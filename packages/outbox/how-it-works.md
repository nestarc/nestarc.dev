---
description: "How the transactional outbox works — event lifecycle, polling with SKIP LOCKED, status transitions, and delivery guarantees."
---

# How It Works

The outbox pattern stores domain events in the same database transaction as the business data, then a background poller delivers them asynchronously.

## Event Lifecycle

1. Write business data and `OutboxEmitter.emit(tx, event)` on the same caller-owned transaction. Commit persists both; rollback persists neither.
2. A polling/notification/manual trigger enters one shared coordinator. A cycle processes up to `batchSize` records, claiming one eligible `PENDING` record on demand with PostgreSQL `FOR UPDATE SKIP LOCKED`.
3. The claim becomes `PROCESSING` with a private token and renewable lease. Heartbeats protect the active callback while local handlers or the publisher run.
4. A successful dispatch becomes `SENT` only if the original token still owns an unexpired lease. Failure increments retry count and either stores a database-clock `next_attempt_at` with `PENDING`, or becomes terminal `FAILED`.
5. Every tenth poll cycle recovers expired leases without consuming retry budget. A stale completion changes no row and emits no success/failure/retry/dead-letter hook.

## Event Statuses

| Status | Meaning |
| --- | --- |
| `PENDING` | Waiting for initial dispatch or persisted retry due time |
| `PROCESSING` | Claimed with a token and renewable lease |
| `SENT` | Local callbacks or the publisher acknowledged; downstream work may still fail |
| `FAILED` | Retry budget exhausted or no local handler exists |

## Leases and multi-instance delivery

Row locks protect the claim transaction. `lease.duration` defaults to five minutes; heartbeats renew active callbacks and `stuckThreshold` is a deprecated duration alias. A crash stops renewal, allowing recovery after expiry. Legacy migrated `PROCESSING` rows with no lease use the configured duration as their recovery threshold.

A callback that hangs while its event loop/database heartbeat remains healthy still renews its lease. Apply application-level timeouts and terminate unhealthy processes when needed; a short lease is not a handler timeout. Fencing prevents stale database transitions, but it cannot undo an external side effect.

## Delivery Guarantees

Delivery is **at-least-once**. A broker acknowledgement followed by a crash before `SENT`, an expired lease, or an earlier successful local handler before a later failure can all produce duplicates. Consumers must deduplicate using a stable event/business identity.

There is **no global, aggregate, partition, or batch FIFO guarantee**. Claim queries, concurrent replicas, equal timestamps, retries, and callback timing can change observed order. `partitionKey` is routing metadata and `idempotencyKey` is metadata for downstream deduplication, not an outbox uniqueness guarantee. Admin cursor order only makes traversal deterministic.

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
