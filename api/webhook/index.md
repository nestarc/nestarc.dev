---
description: "API reference stub for @nestarc/webhook: module registration, event sending, endpoint admin APIs, delivery logs, adapters, and production notes."
---

# @nestarc/webhook

::: warning Status: Beta
API reference is being expanded.
The package is usable, but advanced examples are still in progress.
:::

## Overview

`@nestarc/webhook` sends outbound webhook events from a NestJS application. It stores events, endpoints, and deliveries in PostgreSQL, signs requests with Standard Webhooks-compatible headers, retries with backoff, and records delivery attempts.

Use it when customers can register callback URLs and you need a self-hosted delivery pipeline.

## Installation

```bash
npm install @nestarc/webhook @nestjs/schedule @prisma/client
```

Apply the SQL migration shipped with the package:

```bash
psql "$DATABASE_URL" -f node_modules/@nestarc/webhook/src/sql/create-webhook-tables.sql
```

## Basic usage

```ts
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

```ts
import { Injectable } from '@nestjs/common';
import { WebhookService } from '@nestarc/webhook';

@Injectable()
export class OrdersService {
  constructor(private readonly webhooks: WebhookService) {}

  async createOrder(dto: CreateOrderDto) {
    const order = await this.saveOrder(dto);
    await this.webhooks.send(new OrderCreatedEvent(order.id, order.total));
    return order;
  }
}
```

## Configuration

```ts
import { WebhookModule } from '@nestarc/webhook';

WebhookModule.forRoot({
  prisma: prismaService,
  delivery: {
    timeout: 10000,
    maxRetries: 5,
    backoff: 'exponential',
    jitter: true,
  },
  circuitBreaker: {
    failureThreshold: 5,
    cooldownMinutes: 60,
  },
  polling: {
    interval: 5000,
    batchSize: 50,
  },
});
```

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `prisma` | instance | required | Prisma client/service for default repositories. |
| `delivery.timeout` | `number` | `10000` | HTTP timeout in milliseconds. |
| `delivery.maxRetries` | `number` | `5` | Attempts before failed delivery state. |
| `delivery.backoff` | `'exponential'` | `'exponential'` | Retry schedule strategy. |
| `delivery.jitter` | `boolean` | `true` | Adds retry jitter. |
| `circuitBreaker.failureThreshold` | `number` | `5` | Failures before endpoint disablement. |
| `polling.interval` | `number` | `5000` | Worker poll interval in milliseconds. |
| `polling.batchSize` | `number` | `50` | Deliveries claimed per cycle. |
| `allowPrivateUrls` | `boolean` | `false` | Development/test escape hatch for private URLs. |

## Public API

| Export | Purpose |
|--------|---------|
| `WebhookModule` | Nest module with `forRoot()` and `forRootAsync()`. |
| `WebhookService` | Sends events with `send()` and `sendToTenant()`. |
| `WebhookEvent` | Base class for serializable webhook events. |
| `WebhookEndpointAdminService` | CRUD and test events for endpoint management. |
| `WebhookDeliveryAdminService` | Delivery log queries and manual retry. |
| `WebhookHttpClient` | HTTP delivery adapter contract. |
| `WebhookEventRepository` | Event persistence adapter contract. |
| `WebhookEndpointRepository` | Endpoint adapter contract. |
| `WebhookDeliveryRepository` | Delivery lifecycle adapter contract. |

## Examples

```ts
const eventId = await webhooks.sendToTenant(
  'tenant_123',
  new OrderCreatedEvent('ord_123', 99.99),
);
```

Useful package guides:

- [Sending events](/packages/webhook/sending-events)
- [Endpoint management](/packages/webhook/endpoint-management)
- [Delivery logs](/packages/webhook/delivery-logs)
- [Security](/packages/webhook/security)
- [Custom adapters](/packages/webhook/custom-adapters)

## Production notes

- Leave `allowPrivateUrls` disabled in production to preserve SSRF protections.
- Monitor failed deliveries and endpoints disabled by the circuit breaker.
- Keep endpoint secrets out of logs; signed delivery headers are enough for receivers to verify payload authenticity.
- Tune polling and retry settings with your database capacity and customer expectations in mind.
