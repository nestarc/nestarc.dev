---
description: "Prisma-native transactional outbox for NestJS with atomic event emission, broker publishing, stable metadata, admin/DLQ operations, and PostgreSQL wakeups."
---

<script setup>
import PackageVersion from '../../.vitepress/theme/components/PackageVersion.vue'
</script>

# @nestarc/outbox

Transactional outbox for NestJS, Prisma, and PostgreSQL. Store domain events in the same database transaction as business data, then deliver them through local handlers or a broker publisher with polling, retry, and recovery.

::: tip Current release
Current package version: <PackageVersion slug="outbox" />

Version 0.3 adds renewable fenced claims, persisted retry scheduling, tenant-scoped administration, cursor pagination, and strict envelope/schema validation. It requires Node 22/24, the unified database upgrade, and async-provider/admin caller changes. Read [Installation and migration](./installation) before deploying.
:::

## Features

- **Atomic Prisma emission** — `emit()` and `emitMany()` write outbox rows inside the same `$transaction` as business data, eliminating the application-side dual write.
- **Local or publisher delivery** — keep `@OnOutboxEvent()` handlers in the default `local` mode, or use `delivery.mode: 'publisher'` with an `OutboxPublisher` for Kafka-, RabbitMQ-, or SQS-style delivery without fake local handlers.
- **Stable event metadata** — persist tenant, aggregate, partition, idempotency, correlation, causation, headers, and occurrence-time fields with each event.
- **Handler context** — local handlers can receive `OutboxHandlerContext`, including the event id, type, tenant id, retry count, headers, and full record.
- **Admin and DLQ operations** — inspect backlog and health, list or look up records, retry failed events, mark failures, and purge old `SENT` rows through privileged `OutboxOperatorService` or fixed scopes from `OutboxTenantAdminService`.
- **PostgreSQL wakeups with polling fallback** — optional `LISTEN/NOTIFY` reduces delivery latency while periodic polling remains the durable recovery path.
- **Multi-instance polling** — `FOR UPDATE SKIP LOCKED` lets replicas claim different rows; renewable leases and claim tokens fence stale database completions. External side effects still require idempotency.
- **Retry and recovery** — fixed or exponential backoff, per-record retry limits, `FAILED` retention, and automatic recovery of stale `PROCESSING` rows.
- **Tenant propagation and isolated hooks** — resolve tenant ids at emit time, restore tenant context for local handlers, and observe lifecycle events without hook failures changing delivery state.
- **Graceful shutdown** — stop new polls and drain active database and delivery work before exit.
- **Schema-free integration** — use bundled raw SQL instead of adding an outbox model to `schema.prisma`; fresh-install and unified 0.1/0.2 upgrade migrations are included.

## Delivery modes

`local` is the backward-compatible default. It invokes registered `@OnOutboxEvent()` handlers; an event with no matching handler is marked `FAILED` so a registration mistake cannot silently lose work.

`publisher` sends the complete `OutboxRecord` to an `OutboxPublisher` and does not require local handlers. This is the mode for external brokers:

```typescript
OutboxModule.forRoot({
  prisma: PrismaService,
  delivery: { mode: 'publisher' },
  transport: KafkaPublisher,
})
```

Both modes are at-least-once. A publisher can deliver a duplicate if the process stops after the broker acknowledges the message but before the outbox row is marked `SENT`; consumers should deduplicate with the record id or an application `idempotencyKey`.

## Requirements

The current published package declares these runtime ranges:

- Node.js `>=22.0.0` (maintained Node 22/24 lanes)
- NestJS `@nestjs/common` and `@nestjs/core` `^10.0.0 || ^11.0.0 || ^12.0.0`
- `@nestjs/schedule` `^4.0.0 || ^5.0.0 || ^12.0.0` (pair NestJS 12 with Schedule 12)
- `@prisma/client` `^5.0.0 || ^6.0.0 || ^7.0.0`
- PostgreSQL for the bundled schema and polling queries
- Optional `pg` `^8.0.0` only when using the built-in `LISTEN/NOTIFY` client

## Start here

- [Installation and database migration](./installation)
- [Emitting events](./emitting-events)
- [Handling local events](./handling-events)
- [Transport adapters](./transports)
- [Generated API reference](/api/outbox/)
