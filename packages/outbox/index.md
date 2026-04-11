---
description: "Prisma-native transactional outbox for NestJS — atomic event emission, polling with FOR UPDATE SKIP LOCKED, retry with backoff, and @OnOutboxEvent() decorator."
---

# @nestarc/outbox

Transactional outbox module for NestJS — emit domain events atomically within Prisma transactions, then reliably deliver them via polling, retry, and pluggable transports.

## Features

- **Prisma-native** — events are stored in the same `$transaction` as your business data, eliminating dual-write failures
- **Polling with `FOR UPDATE SKIP LOCKED`** — multiple replicas poll concurrently without processing the same event twice
- **`@OnOutboxEvent()` decorator** — subscribe to events with a one-line decorator
- **Type-safe events** — extend `OutboxEvent` abstract class with `static readonly eventType` for compile-time safety
- **Retry with backoff** — `fixed` or `exponential` backoff strategy with configurable initial delay and max retries
- **Stuck event recovery** — events stuck in `PROCESSING` longer than `stuckThreshold` are automatically reset to `PENDING`
- **Pluggable transports** — `LocalTransport` for in-process dispatch, or custom adapters (Kafka, RabbitMQ, SQS)
- **Batch polling** — configurable `batchSize` to balance throughput and latency
- **Graceful shutdown** — poller drains in-flight events before the process exits
- **Multi-tenant ready** — `tenant_id` column included for future `@nestarc/tenancy` integration
- **Raw SQL migration** — no Prisma model needed; ships a ready-to-run SQL file

## Requirements

- NestJS 10 or 11
- Prisma 5 or 6
- PostgreSQL 9.5+ (for `SKIP LOCKED` support)
- `@nestjs/schedule` (peer dependency)
