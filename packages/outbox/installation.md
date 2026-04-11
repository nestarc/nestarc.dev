---
description: "Install @nestarc/outbox, run the SQL migration, register OutboxModule, and emit your first event."
---

# Installation

## 1. Install

```bash
npm install @nestarc/outbox @nestjs/schedule @prisma/client
```

`@nestjs/schedule` and `@prisma/client` are peer dependencies.

## 2. Run the SQL Migration

The `outbox_events` table is **not** managed through `schema.prisma`. It uses raw SQL shipped with the package:

```bash
# Apply with psql
psql "$DATABASE_URL" -f "$(node -e "console.log(require.resolve('@nestarc/outbox/src/sql/create-outbox-table.sql'))")"
```

The migration creates the table and three partial indexes (PENDING, PROCESSING, FAILED). It is safe to run multiple times (`IF NOT EXISTS`).

<details>
<summary>View the full SQL</summary>

```sql
CREATE TABLE IF NOT EXISTS outbox_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    VARCHAR(255) NOT NULL,
  payload       JSONB NOT NULL,
  status        VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at  TIMESTAMPTZ,
  retry_count   INT NOT NULL DEFAULT 0,
  max_retries   INT NOT NULL DEFAULT 5,
  last_error    TEXT,
  tenant_id     VARCHAR(255),

  CONSTRAINT chk_status CHECK (status IN ('PENDING', 'PROCESSING', 'SENT', 'FAILED'))
);

CREATE INDEX IF NOT EXISTS idx_outbox_pending
  ON outbox_events (created_at ASC) WHERE status = 'PENDING';

CREATE INDEX IF NOT EXISTS idx_outbox_processing
  ON outbox_events (updated_at ASC) WHERE status = 'PROCESSING';

CREATE INDEX IF NOT EXISTS idx_outbox_failed
  ON outbox_events (created_at DESC) WHERE status = 'FAILED';
```

</details>

## 3. Register the Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { OutboxModule } from '@nestarc/outbox';

@Module({
  imports: [
    OutboxModule.forRoot({
      prisma: PrismaService, // class reference — must be in a @Global() module
    }),
  ],
})
export class AppModule {}
```

::: warning
When passing a **class reference** to `prisma` in `forRoot()`, the class must be provided by a `@Global()` module (e.g. `PrismaModule`) so NestJS can resolve it across module boundaries.
:::

### Async registration (recommended)

```typescript
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OutboxModule } from '@nestarc/outbox';

@Module({
  imports: [
    OutboxModule.forRootAsync({
      imports: [PrismaModule, ConfigModule],
      inject: [PrismaService, ConfigService],
      useFactory: (prisma: PrismaService, config: ConfigService) => ({
        prisma,
        polling: {
          interval: config.get('OUTBOX_POLL_INTERVAL', 5000),
          batchSize: config.get('OUTBOX_BATCH_SIZE', 100),
        },
        retry: {
          maxRetries: config.get('OUTBOX_MAX_RETRIES', 5),
          backoff: 'exponential',
          initialDelay: 1000,
        },
      }),
    }),
  ],
})
export class AppModule {}
```

## 4. Emit Your First Event

```typescript
import { OutboxEvent } from '@nestarc/outbox';

// Define an event class
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

## Module Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prisma` | class ref / instance | *required* | `PrismaService` class reference (`forRoot`) or resolved instance (`forRootAsync`) |
| `polling.enabled` | `boolean` | `true` | Enable or disable the polling scheduler |
| `polling.interval` | `number` | `5000` | Milliseconds between polling cycles |
| `polling.batchSize` | `number` | `100` | Max events processed per polling cycle |
| `retry.maxRetries` | `number` | `5` | Max delivery attempts before marking `FAILED` |
| `retry.backoff` | `'fixed' \| 'exponential'` | `'exponential'` | Backoff strategy between retries |
| `retry.initialDelay` | `number` | `1000` | Initial delay in ms (base for exponential, constant for fixed) |
| `transport` | `Type` | `LocalTransport` | Custom transport class implementing `OutboxTransport` |
| `isGlobal` | `boolean` | `true` | Register module globally so `OutboxEmitter` is available everywhere |
| `stuckThreshold` | `number` | `300000` | Events stuck in `PROCESSING` longer than this (ms) are reset to `PENDING` |
