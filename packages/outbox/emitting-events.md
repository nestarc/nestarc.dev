---
description: "Emit outbox events inside Prisma transactions — OutboxEvent class, OutboxEmitter API, emitMany for batch events, and multi-tenant context."
---

# Emitting Events

## Define an Event Class

Every event extends the abstract `OutboxEvent` class and declares a `static readonly eventType`:

```typescript
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

- `eventType` must be a non-empty string — the decorator and poller both validate this at startup
- `toPayload()` is inherited from `OutboxEvent` — it serializes all instance properties to a plain object
- The payload is stored as `JSONB` in PostgreSQL

::: tip
Use a dot-separated naming convention for event types (e.g. `order.created`, `payment.refunded`). This makes it easy to filter events in SQL queries and monitoring dashboards.
:::

## Emit Inside a Transaction

Inject `OutboxEmitter` and call `emit()` inside a Prisma `$transaction`:

```typescript
import { Injectable } from '@nestjs/common';
import { OutboxEmitter } from '@nestarc/outbox';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly outbox: OutboxEmitter,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({ data: dto });

      await this.outbox.emit(tx, new OrderCreatedEvent(order.id, dto.total));

      return order;
    });
  }
}
```

The `emit()` call performs a raw `INSERT INTO outbox_events` using the transaction client (`tx`). If the transaction rolls back, the event is never persisted.

## Emit Multiple Events

Use `emitMany()` to emit multiple events in a single transaction:

```typescript
async fulfillOrder(orderId: string) {
  return this.prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: orderId },
      data: { status: 'FULFILLED' },
    });

    await this.outbox.emitMany(tx, [
      new OrderFulfilledEvent(order.id),
      new InventoryDeductedEvent(order.id, order.items),
      new NotificationRequestedEvent(order.customerId, 'order_shipped'),
    ]);

    return order;
  });
}
```

`emitMany()` inserts each event sequentially within the same transaction. All events share the same `max_retries` value (configured at module level).

## OutboxEmitter API

| Method | Signature | Description |
|--------|-----------|-------------|
| `emit` | `(tx: PrismaTransactionClient, event: OutboxEvent) => Promise<void>` | Insert a single event into the outbox table |
| `emitMany` | `(tx: PrismaTransactionClient, events: OutboxEvent[]) => Promise<void>` | Insert multiple events sequentially |

## Event Payload Serialization

`OutboxEvent.toPayload()` iterates over all instance properties and returns them as a plain object:

```typescript
const event = new OrderCreatedEvent('abc-123', 49.99);
event.toPayload();
// → { orderId: 'abc-123', total: 49.99 }
```

The payload is `JSON.stringify()`'d and stored as `JSONB`. When the handler receives the event, it gets the deserialized plain object — not an instance of the event class.

::: warning
Only JSON-serializable values should be used in event properties. `Date` objects, `Buffer`, `Map`, `Set`, and circular references will either be lost or cause serialization errors.
:::
