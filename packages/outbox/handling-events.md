---
description: "Handle outbox events with @OnOutboxEvent() decorator — handler registration, payload typing, multiple event types, and error behavior."
---

# Handling Events

## `@OnOutboxEvent()` Decorator

Decorate any method on a NestJS injectable to subscribe to outbox events:

```typescript
import { Injectable } from '@nestjs/common';
import { OnOutboxEvent } from '@nestarc/outbox';
import { OrderCreatedEvent } from './events/order-created.event';

@Injectable()
export class OrderNotificationListener {
  @OnOutboxEvent(OrderCreatedEvent)
  async handleOrderCreated(payload: { orderId: string; total: number }) {
    await this.emailService.sendOrderConfirmation(payload.orderId);
  }
}
```

The decorator accepts one or more event classes. Each class must have `static readonly eventType: string` — the decorator validates this at decoration time and throws if missing.

::: tip
The handler receives the **deserialized payload object**, not an instance of the event class. Type the parameter to match the event's properties.
:::

## Multiple Event Types

A single handler can subscribe to multiple event types:

```typescript
@Injectable()
export class AuditListener {
  @OnOutboxEvent(OrderCreatedEvent, OrderCancelledEvent)
  async logOrderChange(payload: Record<string, unknown>) {
    await this.auditService.log({
      action: 'order.change',
      data: payload,
    });
  }
}
```

## Multiple Handlers for One Event

Multiple handlers can subscribe to the same event type. All matching handlers are called sequentially by the `LocalTransport`:

```typescript
@Injectable()
export class NotificationListener {
  @OnOutboxEvent(OrderCreatedEvent)
  async sendEmail(payload: { orderId: string }) {
    await this.emailService.send(payload.orderId);
  }
}

@Injectable()
export class AnalyticsListener {
  @OnOutboxEvent(OrderCreatedEvent)
  async trackEvent(payload: { orderId: string; total: number }) {
    await this.analytics.track('order_created', { total: payload.total });
  }
}
```

## Handler Discovery

Handlers are discovered at module initialization via NestJS `DiscoveryService`. The `OutboxExplorer`:

1. Scans all providers for methods decorated with `@OnOutboxEvent()`
2. Reads the `OUTBOX_EVENT_METADATA` from each method
3. Builds an internal `Map<eventType, OutboxHandler[]>` for fast lookup during polling
4. Logs each registration (e.g. `Registered handler OrderNotificationListener.handleOrderCreated for "order.created"`)

## Error Behavior

If **any** handler throws during dispatch:

1. The event's `retry_count` is incremented
2. The event is set back to `PENDING` for retry (with backoff delay)
3. After `maxRetries`, the event is marked `FAILED` with `last_error`

If an event type has **no registered handlers**, the event is immediately marked `FAILED` with an explanatory `last_error` message. This prevents silent data loss — check your handler registrations if you see unexpected `FAILED` events.

::: warning
Handlers are called **sequentially** by the default `LocalTransport`. If one handler throws, subsequent handlers for the same event are **not called** in that attempt. The entire event will be retried.
:::

## Provider Registration

Handlers must be registered as NestJS providers in a module that is loaded **before** the outbox poller starts:

```typescript
@Module({
  imports: [OutboxModule.forRoot({ prisma: PrismaService })],
  providers: [
    OrderNotificationListener,
    AnalyticsListener,
  ],
})
export class AppModule {}
```
