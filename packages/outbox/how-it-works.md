---
description: "How the transactional outbox works — event lifecycle, polling with SKIP LOCKED, status transitions, and delivery guarantees."
---

# How It Works

The outbox pattern stores domain events in the same database transaction as the business data, then a background poller delivers them asynchronously.

## Event Lifecycle

```
Business Logic (inside $transaction)
    │
    ├─ 1. Write business data (e.g., create order)
    │
    ├─ 2. OutboxEmitter.emit(tx, event)
    │     └─ INSERT into outbox_events with status=PENDING
    │
    └─ 3. Transaction commits atomically
          (both data and event are persisted — or neither)

OutboxPoller (background interval via @nestjs/schedule)
    │
    ├─ 4. UPDATE ... SET status='PROCESSING'
    │     WHERE id IN (
    │       SELECT id FROM outbox_events
    │       WHERE status='PENDING' AND retry backoff elapsed
    │       ORDER BY created_at ASC
    │       LIMIT batchSize
    │       FOR UPDATE SKIP LOCKED
    │     ) RETURNING *
    │
    ├─ 5. Dispatch each event via transport
    │     ├─ success  → status=SENT, set processed_at
    │     ├─ failure  → retry_count++
    │     │    ├─ retryCount < maxRetries → status=PENDING (re-queued with backoff)
    │     │    └─ retryCount >= maxRetries → status=FAILED, store last_error
    │     └─ no handlers → status=FAILED immediately
    │
    ├─ 6. Every Nth cycle: recover stuck events
    │     (PROCESSING longer than stuckThreshold → reset to PENDING)
    │
    └─ 7. Wait pollingInterval, repeat from step 4
```

## Event Statuses

| Status | Description |
|--------|-------------|
| `PENDING` | Waiting for delivery (newly created or retrying after failure) |
| `PROCESSING` | Locked by a poller instance, currently being dispatched |
| `SENT` | Successfully delivered to all handlers |
| `FAILED` | Exceeded `maxRetries` or no handlers registered |

## `SKIP LOCKED` Concurrency

The poller uses PostgreSQL `FOR UPDATE SKIP LOCKED` to safely support multiple instances:

1. Replica A polls and locks events 1, 2, 3
2. Replica B polls simultaneously — events 1, 2, 3 are **skipped** (locked by A)
3. Replica B picks up events 4, 5, 6 instead

No external coordinator (Redis, Zookeeper, etc.) is required.

::: tip
`FOR UPDATE SKIP LOCKED` acquires row-level locks within the transaction. Locked rows are silently skipped by other transactions rather than blocking them.
:::

## Stuck Event Recovery

If a poller crashes mid-processing (e.g. SIGKILL), events may be left in `PROCESSING` indefinitely. The poller automatically recovers them:

- Every 10th polling cycle, events in `PROCESSING` with `updated_at` older than `stuckThreshold` (default: 5 minutes) are reset to `PENDING`
- This is logged as a warning for monitoring

## Delivery Guarantees

**At-least-once delivery** — events may be delivered more than once if the poller crashes after dispatching but before marking the event as `SENT`. Your event handlers should be idempotent.

**Ordered within batch** — events are polled in `created_at ASC` order within a batch. Cross-batch ordering depends on timing and concurrency.

## Atomicity

The core guarantee: **business data and the outbox event are committed in the same transaction.**

```typescript
// Both writes are atomic — the order and event succeed or fail together.
await this.prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: dto });
  await this.outbox.emit(tx, new OrderCreatedEvent(order.id, dto.total));
});
```

Without the outbox pattern:

```typescript
// DANGEROUS: dual-write problem
const order = await this.prisma.order.create({ data: dto });
await this.messageBroker.publish('order.created', order); // can fail independently
```

If the publish fails, the order exists without the event. If the publish succeeds but the DB crashes before commit, the event was sent for data that doesn't exist.
