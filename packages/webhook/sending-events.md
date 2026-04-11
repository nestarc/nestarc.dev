---
description: "Define webhook events and send them via WebhookService — WebhookEvent class, send(), sendToTenant(), payload serialization, and multi-tenant context."
---

# Sending Events

## Define an Event Class

Every event extends the abstract `WebhookEvent` class and declares a `static readonly eventType`:

```typescript
import { WebhookEvent } from '@nestarc/webhook';

export class OrderCreatedEvent extends WebhookEvent {
  static readonly eventType = 'order.created';

  constructor(
    public readonly orderId: string,
    public readonly total: number,
  ) {
    super();
  }
}
```

- `eventType` **must** be defined as a static property — the module throws at runtime if missing
- `toPayload()` is inherited from `WebhookEvent` — it serializes all instance properties to a plain object
- The payload is stored as `JSONB` in PostgreSQL

::: tip
Use a dot-separated naming convention for event types (e.g. `order.created`, `payment.refunded`). This makes filtering delivery logs straightforward.
:::

## Send Events

Inject `WebhookService` and call `send()`:

```typescript
import { Injectable } from '@nestjs/common';
import { WebhookService } from '@nestarc/webhook';

@Injectable()
export class OrdersService {
  constructor(private readonly webhooks: WebhookService) {}

  async createOrder(dto: CreateOrderDto) {
    const order = await this.saveOrder(dto);

    // Publishes to all endpoints subscribed to 'order.created'
    const eventId = await this.webhooks.send(
      new OrderCreatedEvent(order.id, order.total),
    );

    return order;
  }
}
```

`send()` performs the following atomically in a `$transaction`:

1. Saves the event to `webhook_events`
2. Finds all active endpoints subscribed to the event type
3. Creates a delivery record for each matching endpoint

Returns the event UUID for tracking.

## Send to a Specific Tenant

Use `sendToTenant()` for multi-tenant isolation:

```typescript
async createOrder(tenantId: string, dto: CreateOrderDto) {
  const order = await this.saveOrder(dto);

  // Only delivers to endpoints belonging to this tenant
  const eventId = await this.webhooks.sendToTenant(
    tenantId,
    new OrderCreatedEvent(order.id, order.total),
  );

  return order;
}
```

`sendToTenant()` scopes the endpoint query to `tenant_id = :tenantId`, ensuring events are only delivered to the tenant's own endpoints.

## WebhookService API

| Method | Signature | Description |
|--------|-----------|-------------|
| `send` | `(event: WebhookEvent) => Promise<string>` | Publish to all matching active endpoints; returns eventId |
| `sendToTenant` | `(tenantId: string, event: WebhookEvent) => Promise<string>` | Publish to tenant-scoped endpoints only; returns eventId |

## Payload Serialization

`WebhookEvent.toPayload()` iterates over all instance properties and returns them as a plain object:

```typescript
const event = new OrderCreatedEvent('ord_123', 99.99);
event.toPayload();
// → { orderId: 'ord_123', total: 99.99 }
```

The payload is `JSON.stringify()`'d and stored as `JSONB`. The webhook POST body wraps it as:

```json
{
  "type": "order.created",
  "data": {
    "orderId": "ord_123",
    "total": 99.99
  }
}
```

::: warning
Only JSON-serializable values should be used in event properties. `Date` objects, `Buffer`, `Map`, `Set`, and circular references will either be lost or cause serialization errors.
:::

## Multiple Event Types

Define separate event classes for each webhook event type:

```typescript
export class OrderCreatedEvent extends WebhookEvent {
  static readonly eventType = 'order.created';
  constructor(public readonly orderId: string, public readonly total: number) {
    super();
  }
}

export class OrderPaidEvent extends WebhookEvent {
  static readonly eventType = 'order.paid';
  constructor(public readonly orderId: string, public readonly paidAt: string) {
    super();
  }
}

export class OrderCancelledEvent extends WebhookEvent {
  static readonly eventType = 'order.cancelled';
  constructor(public readonly orderId: string, public readonly reason: string) {
    super();
  }
}
```

Endpoints subscribe to specific event types when registered — they only receive events matching their `events` array.
