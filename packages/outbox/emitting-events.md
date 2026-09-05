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

`emitMany()` validates the entire batch before database access, then chunks parameterized inserts at 1,000 rows on the same transaction when supported (with a sequential fallback). All events share the same `max_retries` value (configured at module level).

## OutboxEmitter API

| Method | Signature | Description |
|--------|-----------|-------------|
| `emit` | `(tx: PrismaTransactionClient, event: OutboxEvent, options?: OutboxEmitOptions) => Promise<void>` | Insert a single event into the outbox table |
| `emitMany` | `(tx: PrismaTransactionClient, events: OutboxEvent[]) => Promise<void>` | Validate and insert events or metadata entries in bounded batches |

## Event Payload Serialization

`OutboxEvent.toPayload()` iterates over all instance properties and returns them as a plain object:

```typescript
const event = new OrderCreatedEvent('abc-123', 49.99);
event.toPayload();
// → { orderId: 'abc-123', total: 49.99 }
```

The payload is `JSON.stringify()`'d and stored as `JSONB`. When the handler receives the event, it gets the deserialized plain object — not an instance of the event class.

::: warning
Only JSON-serializable values should be used in event properties. Nested `Date`, `Buffer`, `Map`, `Set`, class instances, `undefined`, and circular references are rejected before SQL. Convert payload dates to strings explicitly; only the separate `occurredAt` option accepts a valid Date. Payloads are bounded to 1 MiB and 100 nesting levels; headers to 64 KiB total.
:::

## Tenant provenance and envelope validation

`tenancy.policy` can be `optional`, `required`, or `require-match`. An undefined tenant uses the configured provider; null, blank, non-string, or surrounding-whitespace values fail before SQL. Use `tenantScope: 'global'` only for an explicitly authorized global event. Under `require-match`, a supplied tenant must exactly match the trusted provider.

`emit()`/`emitMany()` reject invalid dates, unsupported JSON values, circular/class payloads, oversized payloads/headers, and malformed identifiers with `OutboxEnvelopeError` (`OUTBOX_INVALID_ENVELOPE`, with `field`/`reason`). Prevalidation avoids partially staged batches caused by later invalid entries. The caller still owns commit/rollback.

`onEmit` runs before commit and may be followed by rollback. Persist durable audit facts transactionally rather than inferring them from this best-effort hook.
