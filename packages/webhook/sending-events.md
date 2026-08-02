---
description: "Define webhook events and publish them with @nestarc/webhook using idempotency keys, tenant fan-out, targeted endpoints, and correlation IDs."
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

  async createOrder(dto: CreateOrderDto, requestId: string) {
    const order = await this.saveOrder(dto);

    // Publishes to all endpoints subscribed to 'order.created'
    const eventId = await this.webhooks.send(
      new OrderCreatedEvent(order.id, order.total),
      {
        idempotencyKey: `order:${order.id}:created`,
        correlationId: requestId,
      },
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

## Make producer retries idempotent

Pass an application-defined key whenever the producer may retry the same business operation:

```typescript
const eventId = await this.webhooks.send(
  new OrderCreatedEvent(order.id, order.total),
  {
    idempotencyKey: `order:${order.id}:created`,
    correlationId: requestId,
  },
);
```

For the same tenant, event type, and idempotency key, a duplicate publish returns the original event ID and does not enqueue another set of deliveries. Design keys around a stable business operation—not a random request ID—and retain them long enough to cover the producer retry window.

::: warning Custom repository contract
When `idempotencyKey` is used, a custom `WebhookEventRepository` must implement `saveEventOnceInTransaction()`. The built-in Prisma repository supports it. A custom repository without that optional method causes the publish call to fail instead of silently sending duplicates.
:::

## Send to a Specific Tenant

Use `sendToTenant()` for multi-tenant isolation:

```typescript
async createOrder(tenantId: string, dto: CreateOrderDto) {
  const order = await this.saveOrder(dto);

  // Only delivers to endpoints belonging to this tenant
  const eventId = await this.webhooks.sendToTenant(
    tenantId,
    new OrderCreatedEvent(order.id, order.total),
    {
      idempotencyKey: `order:${order.id}:created`,
      correlationId: requestId,
    },
  );

  return order;
}
```

`sendToTenant()` scopes the endpoint query to `tenant_id = :tenantId`, ensuring events are only delivered to the tenant's own endpoints.

## Send to selected endpoints

Use `sendToEndpoints()` when the application has already selected the destination set:

```typescript
const eventId = await this.webhooks.sendToEndpoints(
  ['endpoint_1', 'endpoint_2'],
  new OrderCreatedEvent(order.id, order.total),
  tenantId,
  {
    idempotencyKey: `order:${order.id}:created:selected`,
    correlationId: requestId,
  },
);
```

Omit `tenantId` and pass the publish options as the third argument for global targeted delivery:

```typescript
await this.webhooks.sendToEndpoints(endpointIds, event, {
  idempotencyKey: operationId,
  correlationId: requestId,
});
```

An empty endpoint array still persists a newly published event but creates no delivery rows. An idempotent duplicate returns the existing event ID and skips targeted delivery creation.

## WebhookService API

| Method | Signature | Description |
|--------|-----------|-------------|
| `send` | `(event, options?) => Promise<string>` | Publish to all matching active endpoints. |
| `sendToTenant` | `(tenantId, event, options?) => Promise<string>` | Publish to matching endpoints in one tenant. |
| `sendToEndpoints` | `(endpointIds, event, tenantIdOrOptions?, options?) => Promise<string>` | Publish to an explicit destination set, optionally tenant-scoped. |

Every method returns the persisted event ID and accepts `WebhookPublishOptions`:

```typescript
interface WebhookPublishOptions {
  idempotencyKey?: string;
  correlationId?: string;
}
```

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
