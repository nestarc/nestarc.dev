---
description: "Install @nestarc/outbox, apply the new or upgrade SQL migration, configure local or publisher delivery, and enable admin or LISTEN/NOTIFY operations."
---

# Installation

## 1. Install the package and peers

```bash
npm install @nestarc/outbox @nestjs/schedule @prisma/client
```

The tenant-aware emission example in step 4 uses the authenticated context from `@nestarc/tenancy`. Install and configure it first, or substitute an application-owned context service with an equivalent fail-closed `getCurrentTenantOrThrow()` contract:

```bash
npm install @nestarc/tenancy
```

The current published package supports Node.js `>=20.0.0`, NestJS 10 or 11, `@nestjs/schedule` 4 or 5, and `@prisma/client` 5 or 6.

PostgreSQL `LISTEN/NOTIFY` wakeups use `pg` as an optional peer dependency. Install it only when enabling the built-in notification client:

```bash
npm install pg
```

## 2. Apply the database migration

The `outbox_events` table is **not** managed through `schema.prisma`. The package ships raw SQL for both new installations and existing 0.1 databases.

### New installation

Apply the complete 0.2 schema once:

```bash
psql "$DATABASE_URL" -f "$(node -e "console.log(require.resolve('@nestarc/outbox/src/sql/create-outbox-table.sql'))")"
```

This file creates the table, retry/status indexes, and the 0.2 aggregate and tenant metadata indexes. Its `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS` statements are safe to rerun.

<details>
<summary>View the 0.2 new-install SQL</summary>

```sql
CREATE TABLE IF NOT EXISTS outbox_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type      VARCHAR(255) NOT NULL,
  payload         JSONB NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at    TIMESTAMPTZ,
  retry_count     INT NOT NULL DEFAULT 0,
  max_retries     INT NOT NULL DEFAULT 5,
  last_error      TEXT,
  tenant_id       VARCHAR(255),
  aggregate_type  VARCHAR(255),
  aggregate_id    VARCHAR(255),
  partition_key   VARCHAR(255),
  idempotency_key VARCHAR(255),
  correlation_id  VARCHAR(255),
  causation_id    VARCHAR(255),
  headers         JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_status CHECK (status IN ('PENDING', 'PROCESSING', 'SENT', 'FAILED'))
);

CREATE INDEX IF NOT EXISTS idx_outbox_pending
  ON outbox_events (created_at ASC)
  WHERE status = 'PENDING';

CREATE INDEX IF NOT EXISTS idx_outbox_processing
  ON outbox_events (updated_at ASC)
  WHERE status = 'PROCESSING';

CREATE INDEX IF NOT EXISTS idx_outbox_failed
  ON outbox_events (created_at DESC)
  WHERE status = 'FAILED';

CREATE INDEX IF NOT EXISTS idx_outbox_aggregate
  ON outbox_events (aggregate_type, aggregate_id, created_at ASC)
  WHERE aggregate_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_outbox_tenant_pending
  ON outbox_events (tenant_id, created_at ASC)
  WHERE status = 'PENDING' AND tenant_id IS NOT NULL;
```

</details>

### Upgrade from 0.1.x to 0.2

Do not rely on the new-install file to alter an existing table: `CREATE TABLE IF NOT EXISTS` leaves the 0.1 schema unchanged. Apply the additive upgrade file before running 0.2 code:

```bash
psql "$DATABASE_URL" -f "$(node -e "console.log(require.resolve('@nestarc/outbox/src/sql/upgrade-0.1-to-0.2.sql'))")"
```

The upgrade preserves existing rows and adds the metadata columns and indexes required by 0.2:

```sql
ALTER TABLE outbox_events
  ADD COLUMN IF NOT EXISTS aggregate_type VARCHAR(255),
  ADD COLUMN IF NOT EXISTS aggregate_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS partition_key VARCHAR(255),
  ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(255),
  ADD COLUMN IF NOT EXISTS correlation_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS causation_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS headers JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_outbox_aggregate
  ON outbox_events (aggregate_type, aggregate_id, created_at ASC)
  WHERE aggregate_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_outbox_tenant_pending
  ON outbox_events (tenant_id, created_at ASC)
  WHERE status = 'PENDING' AND tenant_id IS NOT NULL;
```

## 3. Register the module

The default delivery mode is `local`, which invokes registered `@OnOutboxEvent()` handlers:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { OutboxModule } from '@nestarc/outbox';

@Module({
  imports: [
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
    }),
  ],
})
export class AppModule {}
```

::: warning Prisma provider visibility
When passing a **class reference** to `prisma` in `forRoot()`, that class must be provided by a `@Global()` module such as `PrismaModule` so NestJS can resolve it across module boundaries.
:::

### Async registration

Use `forRootAsync()` when the Prisma instance and options come from dependency injection:

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

## 4. Emit an event with metadata

When this step is combined with `@nestarc/tenancy`, replace the basic
`forRoot()` registration from step 3 with an async registration that passes the
extended Prisma client and restores the persisted tenant around local handlers:

```typescript
// outbox-tenant-context.provider.ts
import { TenancyContext } from '@nestarc/tenancy';
import type { OutboxTenantProvider } from '@nestarc/outbox';

export class OutboxTenantContextProvider implements OutboxTenantProvider {
  private readonly context = new TenancyContext();

  getTenantId(): string | null {
    return TenancyContext.getCurrentTenantId();
  }

  runWithTenant<T>(tenantId: string, fn: () => Promise<T>): Promise<T> {
    return this.context.run(tenantId, fn);
  }
}
```

```typescript
// app.module.ts
OutboxModule.forRootAsync({
  imports: [PrismaModule],
  inject: [PrismaService],
  useFactory: (prisma: PrismaService) => ({
    prisma: prisma.client,
    tenancy: { provider: OutboxTenantContextProvider },
    polling: { interval: 5000, batchSize: 100 },
    retry: {
      maxRetries: 5,
      backoff: 'exponential',
      initialDelay: 1000,
    },
  }),
})
```

`TenancyContext` uses the package's shared `AsyncLocalStorage`, so the adapter
reads the authenticated request context and can recreate it for a polled local
delivery. Passing only `tenantId` metadata without this provider persists the
identifier but does not restore the handler context.

Define an event class with a stable event type:

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

Write the event inside the same Prisma transaction as the business change. The optional third argument persists routing, idempotency, trace, and tenant metadata on the outbox record:

```typescript
import { Injectable } from '@nestjs/common';
import { OutboxEmitter } from '@nestarc/outbox';
import { TenancyService, tenancyTransaction } from '@nestarc/tenancy';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly outbox: OutboxEmitter,
    private readonly tenancy: TenancyService,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const tenantId = this.tenancy.getCurrentTenantOrThrow();

    return tenancyTransaction(this.prisma.base, this.tenancy, async (tx) => {
      const order = await tx.order.create({
        data: {
          tenantId,
          total: dto.total,
        },
      });

      await this.outbox.emit(tx, new OrderCreatedEvent(order.id, dto.total), {
        tenantId,
        aggregateType: 'Order',
        aggregateId: order.id,
        partitionKey: order.id,
        idempotencyKey: dto.requestId,
        correlationId: dto.requestId,
        headers: { source: 'orders-api' },
      });

      return order;
    });
  }
}
```

Resolve `tenantId` from authenticated request context, not from `CreateOrderDto` or an arbitrary tenant header. An explicit `tenantId` passed to `emit()` takes precedence over the configured provider. With `OutboxTenantContextProvider` registered above, that persisted identifier is restored around local handlers, so it must already be authoritative. Map accepted DTO fields into the Prisma write instead of passing the request object through wholesale.

`emitMany()` also accepts per-event metadata entries. When the transaction client exposes `$executeRawUnsafe`, 0.2 uses one parameterized multi-row insert:

```typescript
await this.outbox.emitMany(tx, [
  {
    event: new OrderCreatedEvent(order.id, dto.total),
    options: { aggregateType: 'Order', aggregateId: order.id },
  },
  new OrderAuditRequestedEvent(order.id),
]);
```

## 5. Choose local handlers or broker publishing

### Local handlers

In the default `local` mode, register a handler with `@OnOutboxEvent()`. The optional second argument exposes the stored record context:

```typescript
import { Injectable, Module } from '@nestjs/common';
import { OnOutboxEvent, OutboxHandlerContext } from '@nestarc/outbox';
import { EmailModule, EmailService } from './email.module';

@Injectable()
export class OrderNotificationListener {
  constructor(private readonly emailService: EmailService) {}

  @OnOutboxEvent(OrderCreatedEvent)
  async handle(
    payload: { orderId: string; total: number },
    context: OutboxHandlerContext,
  ) {
    await this.emailService.sendOrderConfirmation(payload.orderId, {
      idempotencyKey: context.eventId,
    });
  }
}

@Module({
  imports: [EmailModule],
  providers: [OrderNotificationListener],
})
export class OrderEventsModule {}
```

`EmailModule` and `EmailService` are application-owned. The module must export `EmailService`, and the listener must be registered as a Nest provider so the outbox explorer can discover its decorator.

An event type without a registered local handler is marked `FAILED` with an explanatory `last_error` instead of being silently marked `SENT`.

### Broker publisher

Use `publisher` mode for a broker transport that does not need local handlers:

```typescript
import { Injectable } from '@nestjs/common';
import { OutboxPublisher, OutboxRecord } from '@nestarc/outbox';

@Injectable()
export class KafkaPublisher implements OutboxPublisher {
  constructor(private readonly kafka: KafkaProducer) {}

  async publish(record: OutboxRecord): Promise<void> {
    await this.kafka.send({
      topic: record.eventType,
      messages: [
        {
          key: record.partitionKey ?? record.aggregateId ?? record.id,
          value: JSON.stringify({
            id: record.id,
            eventType: record.eventType,
            payload: record.payload,
            tenantId: record.tenantId,
            aggregateType: record.aggregateType,
            aggregateId: record.aggregateId,
            idempotencyKey: record.idempotencyKey,
            correlationId: record.correlationId,
            causationId: record.causationId,
            occurredAt: record.occurredAt,
          }),
          headers: {
            ...record.headers,
            'outbox-event-id': record.id,
            ...(record.idempotencyKey
              ? { 'idempotency-key': record.idempotencyKey }
              : {}),
          },
        },
      ],
    });
  }
}
```

Register the module asynchronously so the module that owns the broker client is visible to the outbox injector. `KafkaModule` must export `KafkaProducer`; `PrismaModule` must export `PrismaService`.

```typescript
@Module({
  imports: [
    OutboxModule.forRootAsync({
      imports: [KafkaModule, PrismaModule],
      inject: [PrismaService],
      transport: KafkaPublisher,
      useFactory: (prisma: PrismaService) => ({
        prisma,
        delivery: { mode: 'publisher' },
      }),
    }),
  ],
})
export class EventsModule {}
```

Passing `KafkaPublisher` to `forRoot()` without importing an exporting broker module does not make `KafkaProducer` injectable. A global broker module also works, but explicit async imports keep the dependency boundary visible.

Legacy transports implementing `dispatch(record, handlers)` remain supported. In publisher mode they receive an empty handler array, so broker transports must not depend on local handler registration.

::: warning At-least-once delivery
The outbox can publish a duplicate if the process stops after a broker acknowledgement but before the row is marked `SENT`. Preserve the outbox event `id` and optional `idempotencyKey` in the broker message as shown above, then deduplicate on one of those stable values before applying a side effect.
:::

## 6. Operate failed events with the admin API

`OutboxAdminService` is an exported Nest provider for backlog inspection, health checks, cleanup, and failed-event recovery:

```typescript
import { OutboxAdminService } from '@nestarc/outbox';

const failed = await admin.list({
  status: 'FAILED',
  tenantId: 'tenant-1',
  limit: 100,
});

await admin.retry(failed[0].id);

const stats = await admin.getStats();
const health = await admin.getHealth({
  maxOldestPendingAgeMs: 60_000,
  maxFailedCount: 10,
});
```

The service exposes `getStats()`, `list()`, `getById()`, `retry()`, `retryMany()`, `markFailed()`, `purgeSent()`, and `getHealth()`. Retry operations only reset `FAILED` rows to `PENDING`; they do not modify `PROCESSING` rows or reset `retry_count`.

## 7. Enable PostgreSQL LISTEN/NOTIFY wakeups

Polling remains the source of truth. Wakeup mode is an optional latency optimization: `emit()` calls `pg_notify()` inside the business transaction, PostgreSQL delivers the notification after commit, and `OutboxListener` requests an early poll.

```typescript
OutboxModule.forRoot({
  prisma: PrismaService,
  polling: { interval: 5000 },
  wakeup: {
    enabled: true,
    channel: 'outbox_events',
    connectionString: process.env.DATABASE_URL,
  },
})
```

If `wakeup.enabled` is true but `pg` is unavailable, the package logs a warning and continues with periodic polling. Advanced integrations can provide `wakeup.clientFactory` instead of using the built-in `pg` client.

## Module options

| Option | Type | Default | Description |
|---|---|---|---|
| `prisma` | class ref / instance | **required** | `PrismaService` class reference for `forRoot()` or resolved `PrismaLike` instance for `forRootAsync()`. |
| `polling.enabled` | `boolean` | `true` | Enable the polling scheduler. |
| `polling.interval` | `number` | `5000` | Milliseconds between fallback polling cycles. |
| `polling.batchSize` | `number` | `100` | Maximum records processed per polling cycle. |
| `retry.maxRetries` | `number` | `5` | Delivery attempts allowed before a record becomes `FAILED`. |
| `retry.backoff` | `'fixed' \| 'exponential'` | `'exponential'` | Backoff strategy between attempts. |
| `retry.initialDelay` | `number` | `1000` | Base or fixed retry delay in milliseconds. |
| `delivery.mode` | `'local' \| 'publisher'` | `'local'` | Require decorated local handlers or publish records to a broker transport. |
| `transport` | `Type<OutboxTransport \| OutboxPublisher>` | `LocalTransport` | Delivery provider class. |
| `tenancy.provider` | provider / provider class | none | Resolve tenant ids and optionally restore tenant context around local handlers. |
| `hooks` | `OutboxHooks` | none | Observe emit, poll, dispatch, retry, and dead-letter lifecycle events; hook errors are isolated. |
| `wakeup.enabled` | `boolean` | `false` | Enable PostgreSQL notification wakeups alongside polling. |
| `wakeup.channel` | `string` | `'outbox_events'` | PostgreSQL notification channel. |
| `wakeup.connectionString` | `string` | `pg` default | Connection string for the built-in notification client. |
| `wakeup.clientFactory` | function | built-in `pg` client | Supply a custom `OutboxNotificationClient`. |
| `isGlobal` | `boolean` | `true` | Register the module globally. |
| `stuckThreshold` | `number` | `300000` | Reset records left in `PROCESSING` longer than this many milliseconds. |

See the [generated API reference](/api/outbox/) for complete option and method signatures.
