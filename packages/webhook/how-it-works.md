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
    │     (fetch event payload + endpoint secret for signing)
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
2. All active endpoints subscribed to the event type are queried
3. One delivery record is created per matching endpoint

All three operations happen atomically in a `$transaction`. If any step fails, nothing is persisted.

```
send(OrderCreatedEvent)
    │
    ├─ Endpoint A (subscribed to: order.created) → delivery created
    ├─ Endpoint B (subscribed to: order.*)        → NOT matched (exact match only)
    ├─ Endpoint C (subscribed to: order.created) → delivery created
    └─ Endpoint D (inactive)                     → skipped
```

::: tip
Event matching uses **exact string comparison** on the `events` array. Wildcards are not supported — subscribe endpoints to each specific event type.
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

Each delivery snapshots its destination URL and current signing material when it is created. Retries keep using that snapshot, so later endpoint edits do not silently redirect an already queued delivery. During an active secret-rotation overlap, both current and previous secrets can be represented in the signature header.

Every HTTP attempt is also appended to `webhook_delivery_attempts`. The main delivery row is the current summary; attempt rows preserve the chronological status, response, latency, error, and retry reason used for diagnostics.

## `SKIP LOCKED` Concurrency

The delivery worker uses PostgreSQL `FOR UPDATE SKIP LOCKED` for safe multi-instance operation:

1. Worker A polls and locks deliveries 1, 2, 3
2. Worker B polls simultaneously — deliveries 1, 2, 3 are **skipped** (locked by A)
3. Worker B picks up deliveries 4, 5, 6 instead

No external coordinator (Redis, Zookeeper, etc.) is required.

## Stale Delivery Recovery

If a worker crashes mid-delivery (e.g. SIGKILL), deliveries may be left in `SENDING` indefinitely. The worker automatically recovers them:

- Every poll cycle, deliveries in `SENDING` with `claimed_at` older than `staleSendingMinutes` (default: 5 minutes) are reset to `PENDING`
- This prevents permanent delivery loss from worker failures

## Delivery Guarantees

**At-least-once delivery** — a delivery may be attempted more than once if the worker crashes after a successful HTTP POST but before marking it as `SENT`. Customer endpoints should be idempotent.

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
