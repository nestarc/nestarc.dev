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

This creates three tables (`webhook_endpoints`, `webhook_events`, `webhook_deliveries`) with indexes. The migration is idempotent (`IF NOT EXISTS`).

It also runs `CREATE EXTENSION IF NOT EXISTS pgcrypto` for PostgreSQL < 13 compatibility.

<details>
<summary>View the full SQL</summary>

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  url                  VARCHAR(2048) NOT NULL,
  secret               VARCHAR(255)  NOT NULL,
  events               VARCHAR(255)[] NOT NULL DEFAULT '{}',
  active               BOOLEAN       NOT NULL DEFAULT TRUE,
  description          VARCHAR(500),
  metadata             JSONB,
  tenant_id            VARCHAR(255),
  consecutive_failures INT           NOT NULL DEFAULT 0,
  disabled_at          TIMESTAMPTZ,
  disabled_reason      VARCHAR(255),
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webhook_events (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  VARCHAR(255) NOT NULL,
  payload     JSONB        NOT NULL,
  tenant_id   VARCHAR(255),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        UUID         NOT NULL REFERENCES webhook_events(id),
  endpoint_id     UUID         NOT NULL REFERENCES webhook_endpoints(id),
  status          VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
  attempts        INT          NOT NULL DEFAULT 0,
  max_attempts    INT          NOT NULL DEFAULT 5,
  next_attempt_at TIMESTAMPTZ,
  claimed_at      TIMESTAMPTZ,
  last_attempt_at TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  response_status INT,
  response_body   TEXT,
  latency_ms      INT,
  last_error      TEXT
);
```

</details>

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

  async createOrder(dto: CreateOrderDto) {
    const order = await this.saveOrder(dto);
    await this.webhooks.send(new OrderCreatedEvent(order.id, order.total));
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
| `delivery.backoff` | `'exponential'` | `'exponential'` | Backoff strategy |
| `delivery.jitter` | `boolean` | `true` | Add ±10% random jitter to retry delays |
| `circuitBreaker.failureThreshold` | `number` | `5` | Consecutive failures before disabling endpoint |
| `circuitBreaker.cooldownMinutes` | `number` | `60` | Minutes before attempting recovery |
| `polling.interval` | `number` | `5000` | Delivery worker poll interval in ms |
| `polling.batchSize` | `number` | `50` | Max deliveries per poll cycle |
| `polling.staleSendingMinutes` | `number` | `5` | Minutes before a stuck SENDING delivery is recovered |
| `allowPrivateUrls` | `boolean` | `false` | Allow private/internal URLs (dev/test only) |
