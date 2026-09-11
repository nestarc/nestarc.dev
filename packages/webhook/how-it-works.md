---
description: "How outbound webhook delivery works — event lifecycle, polling with SKIP LOCKED, fan-out, status transitions, and delivery guarantees."
---

# How It Works

The webhook module stores events and delivery tasks in PostgreSQL, then a background worker polls and dispatches HTTP requests to customer endpoints.

## Delivery Lifecycle

```
Application code
    │
    ├─ 1. webhooks.send(event, publishOptions?)
    │     ├─ save event → webhook_events (returns eventId)
    │     │    └─ idempotencyKey duplicate? return existing eventId and stop
    │     ├─ findMatchingEndpoints(eventType, tenantId?)
    │     └─ createDeliveries(eventId, endpointIds[])
    │          └─ snapshot destination URL and signing secrets
    │        (event lookup/insert and fan-out run in one $transaction)
    │
    └─ 2. Returns eventId to caller

DeliveryWorker (background poller via @nestjs/schedule)
    │
    ├─ 3. recoverEligibleEndpoints()
    │     (circuit breaker: re-enable endpoints past cooldown)
    │
    ├─ 4. recoverStaleSending()
    │     (reset SENDING deliveries older than staleSendingMinutes)
    │
    ├─ 5. claimPendingDeliveries(batchSize)
    │     UPDATE ... SET status='SENDING', claimed_at=NOW()
    │     WHERE status='PENDING' AND next_attempt_at <= NOW()
    │     FOR UPDATE SKIP LOCKED
    │
    ├─ 6. enrichDeliveries(ids)
    │     (fetch event payload + snapshotted signing secrets)
    │
    └─ 7. processDelivery() for each:
          ├─ validateHost(url)     [SSRF check]
          ├─ sign(headers)         [HMAC-SHA256]
          ├─ POST to endpoint URL
          ├─ persist webhook_delivery_attempts row
          └─ Result:
             ├─ 2xx → markSent() + resetFailures()
             ├─ retryable response/error + attempts remain → markRetry()
             │    └─ incrementFailures() → check circuit breaker
             └─ permanent response or attempts exhausted → markFailed()
                  └─ incrementFailures() → check circuit breaker
```

## Event Statuses

The `webhook_deliveries` table tracks four statuses:

| Status | Description |
|--------|-------------|
| `PENDING` | Waiting for delivery (newly created or scheduled for retry) |
| `SENDING` | Claimed by a worker, HTTP request in flight |
| `SENT` | Successfully delivered (2xx response) |
| `FAILED` | Exceeded `maxAttempts` or permanent error |

## Fan-out

When `webhooks.send(event)` is called:

1. The event is saved to `webhook_events`
2. All active endpoints subscribed to the event type or literal `*` are queried across all tenants
3. One delivery record is created per matching endpoint

All three operations happen atomically in a `$transaction`. If any step fails, nothing is persisted.

```
send(OrderCreatedEvent)
    │
    ├─ Endpoint A (subscribed to: order.created) → delivery created
    ├─ Endpoint B (subscribed to: order.*)        → NOT matched (exact match only)
    ├─ Endpoint C (subscribed to: order.created) → delivery created
    ├─ Endpoint D (inactive)                     → skipped
    └─ Endpoint E (subscribed to: *)              → delivery created
```

::: tip
Subscriptions match an exact event type or the literal `*` for every event. Prefix patterns such as `order.*` are not supported. `send()` has no tenant filter; use `sendToTenant()` for one tenant. If no endpoints match, the event is saved without deliveries. Registering an endpoint later does not enqueue historical events.
:::

## Idempotent Publishing

Pass an application key when the same business event might be published more than once:

```typescript
const eventId = await webhooks.send(event, {
  idempotencyKey: `order:${order.id}:created`,
  correlationId: requestId,
});
```

The uniqueness boundary is tenant, event type, and idempotency key. A duplicate call returns the original event ID and does not create another set of deliveries. Global and tenant-scoped events therefore have separate key spaces.

The key makes publishing idempotent; it does not change the at-least-once delivery guarantee. Receivers must still deduplicate by the `webhook-id` header.

::: warning
Custom event repositories must implement the optional `saveEventOnceInTransaction()` port method before callers use `idempotencyKey`. The default Prisma adapter implements it.
:::

## Delivery Snapshots and Attempts

Each delivery snapshots its destination URL and current signing material when it is created. Retries keep using that snapshot, so later endpoint edits do not silently redirect an already queued delivery. Previous-secret expiry is checked at delivery creation. A delivery created before rotation keeps the old key; one created during overlap retains both keys even when attempted after the overlap expiry. Coordinate receiver key retirement with outstanding snapshots.

Completed worker processing appends an attempt result to `webhook_delivery_attempts`. The delivery row summarizes the current state; attempt rows keep the recorded history. A crash after an HTTP request but before persistence can leave its outcome unrecorded. The default HTTP client retains at most 4096 UTF-16 code units of response text; redaction and retention may remove more data. [Delivery Logs](./delivery-logs) describes these bounds.

## `SKIP LOCKED` Concurrency

The delivery worker uses PostgreSQL `FOR UPDATE SKIP LOCKED` for safe multi-instance operation:

1. Worker A polls and locks deliveries 1, 2, 3
2. Worker B polls simultaneously — deliveries 1, 2, 3 are **skipped** (locked by A)
3. Worker B picks up deliveries 4, 5, 6 instead

No external coordinator (Redis, Zookeeper, etc.) is required. These locks coordinate database claims; they cannot make an HTTP request and a later database update atomic. Duplicate HTTP requests remain possible after a crash or lease recovery.

## Stale Delivery Recovery

If a worker crashes mid-delivery (e.g. SIGKILL), deliveries may be left in `SENDING` indefinitely. The worker automatically recovers them:

- Every poll cycle, deliveries in `SENDING` with `claimed_at` older than `staleSendingMinutes` (default: 5 minutes) are reset to `PENDING`
- This prevents permanent delivery loss from worker failures

## Delivery Guarantees

**At-least-once attempts with a finite retry budget** — the worker can repeat a request after a successful HTTP POST if it crashes before persisting `SENT`. Retries can also end in `FAILED`, so successful receipt is not guaranteed. Receivers should verify the signature, deduplicate `webhook-id` within their receiver scope, and atomically record processing with the business change.

**Atomic fan-out** — the event and all deliveries for a single `send()` call are created atomically. Delivery order across events depends on timing and worker concurrency.

**Snapshot consistency** — a delivery retries the destination and signing secrets captured when it was created. A deliberate event replay creates new delivery rows from currently active endpoints and their current configuration.

## Webhook Payload Format

Every webhook POST body follows this structure:

```json
{
  "type": "order.created",
  "data": {
    "orderId": "ord_123",
    "total": 99.99
  }
}
```

The `data` field contains all instance properties from the `WebhookEvent` subclass, serialized via `toPayload()`.
