---
description: "API reference stub for @nestarc/outbox: module registration, event emission, handlers, transports, and production notes."
---

# @nestarc/outbox

::: warning Status: Beta
API reference is being expanded.
The package is usable, but advanced examples are still in progress.
:::

## Overview

`@nestarc/outbox` implements the transactional outbox pattern for NestJS and Prisma. It stores domain events in the same database transaction as business data, then polls and dispatches them with retry, backoff, and stuck-event recovery.

Use it when request handlers need to emit reliable domain events without dual-write failures.

## Installation

```bash
npm install @nestarc/outbox @nestjs/schedule @prisma/client
```

Apply the SQL migration shipped with the package before enabling the poller:

```bash
psql "$DATABASE_URL" -f "$(node -e "console.log(require.resolve('@nestarc/outbox/src/sql/create-outbox-table.sql'))")"
```

## Basic usage

```ts
import { OutboxEvent } from '@nestarc/outbox';

export class OrderCreatedEvent extends OutboxEvent {
  static readonly eventType = 'order.created';

  constructor(
    public readonly orderId: string,
    public readonly total: number,
  ) {
    super();
  }
}
```

```ts
await this.prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: dto });
  await this.outbox.emit(tx, new OrderCreatedEvent(order.id, dto.total));
  return order;
});
```

## Configuration

```ts
import { OutboxModule } from '@nestarc/outbox';

OutboxModule.forRoot({
  prisma: PrismaService,
  polling: {
    interval: 5000,
    batchSize: 100,
  },
  retry: {
    maxRetries: 5,
    backoff: 'exponential',
    initialDelay: 1000,
  },
});
```

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `prisma` | class ref / instance | required | Prisma service class or resolved instance. |
| `polling.enabled` | `boolean` | `true` | Enables the scheduler. |
| `polling.interval` | `number` | `5000` | Milliseconds between polling cycles. |
| `polling.batchSize` | `number` | `100` | Maximum events processed per cycle. |
| `retry.maxRetries` | `number` | `5` | Attempts before an event is marked failed. |
| `retry.backoff` | `'fixed' \| 'exponential'` | `'exponential'` | Backoff strategy. |
| `transport` | `Type` | `LocalTransport` | Dispatch adapter. |
| `stuckThreshold` | `number` | `300000` | Resets stale `PROCESSING` events. |

## Public API

| Export | Purpose |
|--------|---------|
| `OutboxModule` | Nest module with `forRoot()` and `forRootAsync()`. |
| `OutboxEmitter` | Inserts one or more events into `outbox_events`. |
| `OutboxEvent` | Base class for type-safe domain events. |
| `OnOutboxEvent()` | Decorator for local event handlers. |
| `LocalTransport` | Default in-process dispatch transport. |
| `OutboxTransport` | Contract for Kafka, RabbitMQ, SQS, or custom transports. |
| `OutboxRecord` | Stored event record passed to transports. |
| `OutboxHandler` | Discovered handler metadata used by transports. |

## Examples

```ts
import { Injectable } from '@nestjs/common';
import { OnOutboxEvent } from '@nestarc/outbox';

@Injectable()
export class OrderEmailHandler {
  @OnOutboxEvent(OrderCreatedEvent)
  async sendConfirmation(payload: { orderId: string; total: number }) {
    await this.emailService.sendOrderConfirmation(payload.orderId);
  }
}
```

Useful package guides:

- [Emitting events](/packages/outbox/emitting-events)
- [Handling events](/packages/outbox/handling-events)
- [Retry and backoff](/packages/outbox/retry-backoff)
- [Transport adapters](/packages/outbox/transports)

## Production notes

- Keep the outbox SQL migration under your application migration process, even though the package ships the SQL.
- Use `forRootAsync()` when Prisma and configuration are resolved by modules.
- Tune `polling.batchSize`, `polling.interval`, and retry options against your database load and delivery latency goals.
- Monitor `FAILED` and stale `PROCESSING` events; they are operational signals, not just library state.
