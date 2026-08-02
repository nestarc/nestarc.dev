---
description: "Install @nestarc/webhook, run the SQL migration, register WebhookModule, and send your first webhook event."
---

# Installation

## 1. Install

```bash
npm install @nestarc/webhook @nestjs/schedule @prisma/client
```

`@nestjs/schedule` and `@prisma/client` are peer dependencies.

## 2. Run the SQL Migration

The webhook tables are **not** managed through `schema.prisma`. They use raw SQL shipped with the package:

```bash
# Apply with psql
psql "$DATABASE_URL" -f node_modules/@nestarc/webhook/src/sql/create-webhook-tables.sql
```

This creates four tables (`webhook_endpoints`, `webhook_events`, `webhook_deliveries`, and `webhook_delivery_attempts`) with their indexes. The migration is idempotent (`IF NOT EXISTS`).

It also runs `CREATE EXTENSION IF NOT EXISTS pgcrypto` for PostgreSQL < 13 compatibility.

Use the SQL shipped with the installed package as the source of truth instead of copying table definitions into application migrations.

### Upgrade an existing database

Applications created before version 0.9 need the additive migration for per-attempt logs, endpoint snapshots, and secret-rotation overlap:

```bash
psql "$DATABASE_URL" -f node_modules/@nestarc/webhook/src/sql/migrations/v0.9.0.sql
```

Applications created before version 0.13 also need the idempotency, correlation ID, and payload-purge migration:

```bash
psql "$DATABASE_URL" -f node_modules/@nestarc/webhook/src/sql/migrations/v0.13.0.sql
```

The v0.13 migration adds `idempotency_key`, `correlation_id`, and `payload_purged_at` to webhook events plus the idempotency lookup index.

## 3. Register the Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { WebhookModule } from '@nestarc/webhook';

@Module({
  imports: [
    WebhookModule.forRoot({
      prisma: prismaService,
      delivery: {
        timeout: 10_000,
        maxRetries: 5,
        jitter: true,
      },
      circuitBreaker: {
        degradedThreshold: 3,
        failureThreshold: 5,
        cooldownMinutes: 60,
      },
      polling: {
        interval: 5000,
        batchSize: 50,
        maxConcurrency: 50,
      },
      onDeliveryRetryScheduled: ({ deliveryId, nextAttemptAt }) => {
        metrics.increment('webhook.retry.scheduled', { deliveryId });
        logger.debug({ deliveryId, nextAttemptAt });
      },
      onEndpointDegraded: ({ endpointId, consecutiveFailures }) => {
        alerting.webhookEndpointDegraded(endpointId, consecutiveFailures);
      },
    }),
  ],
})
export class AppModule {}
```

### Async registration (recommended)

```typescript
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebhookModule } from '@nestarc/webhook';

@Module({
  imports: [
    WebhookModule.forRootAsync({
      imports: [PrismaModule, ConfigModule],
      inject: [PrismaService, ConfigService],
      useFactory: (prisma: PrismaService, config: ConfigService) => ({
        prisma,
        delivery: {
          maxRetries: config.get('WEBHOOK_MAX_RETRIES', 5),
          timeout: config.get('WEBHOOK_TIMEOUT', 10_000),
        },
        circuitBreaker: {
          failureThreshold: config.get('WEBHOOK_CB_THRESHOLD', 5),
          cooldownMinutes: config.get('WEBHOOK_CB_COOLDOWN', 60),
        },
        polling: {
          interval: config.get('WEBHOOK_POLL_INTERVAL', 5000),
          batchSize: config.get('WEBHOOK_BATCH_SIZE', 50),
          maxConcurrency: config.get('WEBHOOK_MAX_CONCURRENCY', 50),
        },
      }),
    }),
  ],
})
export class AppModule {}
```

## 4. Send Your First Event

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

```typescript
import { Injectable } from '@nestjs/common';
import { WebhookService } from '@nestarc/webhook';

@Injectable()
export class OrdersService {
  constructor(private readonly webhooks: WebhookService) {}

  async createOrder(dto: CreateOrderDto, requestId: string) {
    const order = await this.saveOrder(dto);
    await this.webhooks.send(new OrderCreatedEvent(order.id, order.total), {
      idempotencyKey: `order:${order.id}:created`,
      correlationId: requestId,
    });
    return order;
  }
}
```

## Module Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prisma` | instance | *required* | `PrismaClient` instance (optional if all custom repos provided) |
| `delivery.timeout` | `number` | `10000` | HTTP request timeout in ms |
| `delivery.maxRetries` | `number` | `5` | Maximum delivery attempts |
| `delivery.jitter` | `boolean` | `true` | Add ±10% random jitter to retry delays |
| `circuitBreaker.degradedThreshold` | `number` | — | Emit `onEndpointDegraded` before disablement; must be below the failure threshold |
| `circuitBreaker.failureThreshold` | `number` | `5` | Consecutive failures before disabling endpoint |
| `circuitBreaker.cooldownMinutes` | `number` | `60` | Minutes before attempting recovery |
| `polling.enabled` | `boolean` | `true` | Disable polling in an API-only process |
| `polling.interval` | `number` | `5000` | Delivery worker poll interval in ms |
| `polling.batchSize` | `number` | `50` | Rows claimed in one database batch |
| `polling.staleSendingMinutes` | `number` | `5` | Minutes before a stuck SENDING delivery is recovered |
| `polling.maxConcurrency` | `number` | `batchSize` | Maximum in-flight dispatches per worker process |
| `polling.drainWhileBacklogged` | `boolean` | `false` | Keep claiming inside a poll while backlog and capacity remain |
| `workerObserver` | `WebhookWorkerObserver` | — | Best-effort poll and delivery metrics callbacks |
| `retention` | `WebhookRetentionOptions` | — | Payload and response-body retention windows; disabled when omitted |
| `redaction` | `WebhookRedactionOptions` | — | Payload and response-body sanitizers applied before persistence |
| `allowPrivateUrls` | `boolean` | `false` | Allow private/internal URLs (dev/test only) |

The retry schedule is fixed (`30s`, `5m`, `30m`, `2h`, `24h`). The deprecated `delivery.backoff` option is no longer needed in new configuration.

Next: [Sending Events](./sending-events) for publish options, or [Operations & Data Lifecycle](./operations) for worker and retention configuration.
