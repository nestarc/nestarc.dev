---
description: "Install @nestarc/outbox, apply the new or upgrade SQL migration, configure local or publisher delivery, and enable admin or LISTEN/NOTIFY operations."
---

# Installation

## 1. Install the package and peers

Choose the Schedule major for your existing NestJS application:

```bash
# NestJS 10
npm install @nestarc/outbox@0.4.1 @nestjs/schedule@4
# NestJS 11
npm install @nestarc/outbox@0.4.1 @nestjs/schedule@5
# NestJS 12
npm install @nestarc/outbox@0.4.1 @nestjs/schedule@12
```

Run one command and preserve the application's existing Prisma major. NestJS common/core, Schedule, `@prisma/client`, and `reflect-metadata` are peers. Keep the Prisma CLI and client on matching versions. A [complete quick-start application](https://github.com/nestarc/outbox/tree/v0.4.1/examples/quick-start) is shipped in the package for projects that do not have this setup yet.

The tenant-aware emission example in step 4 uses the authenticated context from `@nestarc/tenancy`. Install and configure it first, or substitute an application-owned context service with an equivalent fail-closed `getCurrentTenantOrThrow()` contract:

```bash
npm install @nestarc/tenancy
```

Outbox 0.4 requires Node.js `>=22.0.0` with maintained Node 22/24 lanes. It supports NestJS 10/11/12, Schedule 4/5/12, and Prisma 5/6/7. Pair NestJS 12 with Schedule 12; Webhook currently shares the NestJS 10/11 range. Jobs 0.4.2 supports this Outbox 0.4.1 release on NestJS 10/11; follow the [Jobs bridge](/packages/jobs/outbox-bridge) for required polling and coordinated shutdown. PostgreSQL is the only supported database; PostgreSQL 16 is the automated test baseline, and an older minimum has not been verified. Prisma 7 needs a matching driver adapter and generated client; see [Prisma 7 Setup](/guide/prisma-7).

PostgreSQL `LISTEN/NOTIFY` wakeups use `pg` as an optional peer dependency. Install it when enabling the built-in notification client:

```bash
npm install pg
```

The Prisma 7 PostgreSQL adapter also needs `pg`, even when outbox wakeups are disabled:

```bash
npm install @prisma/adapter-pg@7 pg
```

Keep `prisma`, `@prisma/client`, and `@prisma/adapter-pg` on matching versions. Follow [Prisma 7 Setup](/guide/prisma-7) to generate the client and construct it with the adapter.

## 2. Apply the database migration

The `outbox_events` table is managed with bundled SQL rather than a Prisma model. Startup validates columns, indexes, and constraints and fails with `OutboxSchemaError` / `OUTBOX_SCHEMA_MISMATCH` on an old or incomplete database; it does not migrate automatically.

### New installation

Apply the complete current schema:

```bash
psql -v ON_ERROR_STOP=1 "$DATABASE_URL" -f "$(node -e "console.log(require.resolve('@nestarc/outbox/src/sql/create-outbox-table.sql'))")"
```

### Upgrade from 0.4.0 to 0.4.1

No additional SQL migration is required. Use the new public `OutboxPoller.stop()`
before closing a co-located Jobs transport. The automatic shutdown hook now throws
`OutboxShutdownError` (`OUTBOX_SHUTDOWN_INCOMPLETE`) when its default 30-second
drain deadline expires; 0.4.0 only logged remaining work and returned. Handle the
error while keeping callback dependencies open. See [graceful shutdown](#enable-graceful-shutdown).

### Upgrade from 0.3.0 to 0.4.0

The required database schema remains **0.3.0**. A current 0.3.0 database needs no additional SQL migration. Update the application before starting the 0.4.0 runtime:

- Keep periodic polling enabled. `polling.enabled: false` now fails module initialization with `OutboxConfigurationError` (`OUTBOX_INVALID_CONFIGURATION`), even when notifications connect successfully.
- Discard saved `listPage()` v1 cursors and restart from the first page. The new v2 cursor preserves PostgreSQL microseconds; v1 input fails with `OUTBOX_INVALID_CURSOR`.
- Correct invalid `tenancy.policy`, provider, hook, and notification settings. Module setup now validates their object shapes and supplied callback types. This does not verify external connection availability or callback behavior.

See the [0.4.0 migration contract](https://github.com/nestarc/outbox/blob/v0.4.0/README.md#upgrading-to-040).

### Upgrade from 0.1.x or 0.2.x {#upgrade-from-0-1-x-or-0-2-x-to-0-3}

Stop and drain all old pollers before applying the current package's unified upgrade to the 0.3.0 schema. Old/new pollers must not overlap because 0.2 workers do not honor leases, fenced claims, or stored due times. Complete the 0.4.0 configuration and cursor changes above as well.

```bash
psql -v ON_ERROR_STOP=1 "$DATABASE_URL" -f "$(node -e "console.log(require.resolve('@nestarc/outbox/src/sql/upgrade-to-current.sql'))")"
```

The idempotent upgrade preserves rows and adds claim ownership, lease expiry, `next_attempt_at`, metadata, cursor/retention indexes, and CHECK constraints. It intentionally fails on corrupt rows such as invalid retry limits or non-object JSON. Repair or quarantine those rows before retrying. Index/constraint work can acquire locks, so plan a maintenance window. `create-outbox-table.sql` alone does not upgrade an existing table.

Also migrate callers:

- Import runtime/types from `@nestarc/outbox` and resolve only the two SQL paths above; `dist/**` and component migration imports are blocked.
- In `forRootAsync()`, move `transport`, `tenantProvider`, and `isGlobal` registrations to the top level and import their dependency modules. Keep runtime `tenancy.policy` in the factory result; returning `tenancy.provider` is rejected.
- Replace `tenantId: null` with explicit `tenantScope: 'global'`. Undefined tenant IDs fall back to the configured provider.
- Inspect `retry()`/`markFailed()` result `.outcome` instead of testing the result as a boolean. Callback records/contexts are readonly detached snapshots.

[Official legacy migration contract](https://github.com/nestarc/outbox/blob/v0.4.0/README.md#upgrading-to-030).

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

### Enable graceful shutdown

Outbox 0.4.1 exports `OutboxPoller` from the package root and both module registration
paths. For Jobs or another transport that closes in `onModuleDestroy`, call `stop()`
**before** `app.close()`:

```typescript
import { OutboxPoller } from '@nestarc/outbox';

async function closeApplication() {
  await app.get(OutboxPoller).stop({ timeoutMs: 30_000 });
  await app.close();
  // Disconnect application-owned Prisma clients only after close succeeds.
}
```

Use one application-owned signal handler for this sequence; do not also call
`app.enableShutdownHooks()` for the same signals. The [complete relay bootstrap](/guide/async-delivery-workflow#_4-register-durable-workers)
shows concurrent close handling and retry after failure.

`stop()` permanently fences new polls and drops queued cycles. It waits for the
current claim query, publisher/handler, lease heartbeat and fenced DB completion.
A claim returned after stop begins is released to `PENDING` without consuming a
retry. A stopped poller cannot be restarted; create a new application to resume.

The default deadline is **30 seconds**; `timeoutMs` must be a positive 32-bit integer.
`OutboxShutdownError` has code `OUTBOX_SHUTDOWN_INCOMPLETE` and reports `timeoutMs`,
`pollsInFlight`, and `eventsInFlight`. A timeout does not cancel work. Keep Jobs,
Prisma and other callback dependencies open, then retry `stop()` after settlement;
concurrent/repeated calls are safe. Let the process supervisor enforce a bounded
termination grace if work cannot settle. Never disconnect these dependencies in
a `finally` block around a failed drain.

For standalone local handlers whose dependencies remain open through
`onApplicationShutdown`, `app.enableShutdownHooks()` invokes the same drain with
the default deadline. This automatic hook also rejects on an incomplete drain;
it cannot establish Outbox-before-Jobs ordering. Set callback/network deadlines
and allow enough process termination time for the drain and remaining cleanup.

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
  tenantProvider: OutboxTenantContextProvider,
  useFactory: (prisma: PrismaService) => ({
    prisma: prisma.client,
    tenancy: { policy: 'require-match' },
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

Resolve `tenantId` from authenticated request context, not from `CreateOrderDto` or an arbitrary tenant header. With `require-match`, an explicit tenant must exactly match the provider. `optional` permits absence, `required` requires attribution, and `tenantScope: 'global'` explicitly opts out for an intentional global event. With `OutboxTenantContextProvider` registered above, that persisted identifier is restored around local handlers, so it must already be authoritative. Map accepted DTO fields into the Prisma write instead of passing the request object through wholesale.

`emitMany()` also accepts per-event metadata entries. The emitter validates the full input before SQL and uses parameterized batches of up to 1,000 rows on the same caller-owned transaction:

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
            partitionKey: record.partitionKey,
            headers: record.headers,
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

`OutboxOperatorService` is a privileged global provider; `OutboxAdminService` remains a deprecated alias. Tenant-facing code must authorize the caller and bind trusted tenant context with `OutboxTenantAdminService.forTenant()`:

```typescript
import { OutboxTenantAdminService } from '@nestarc/outbox';

// callerTenantId has already been authorized by the application's guard/policy.
const admin = app.get(OutboxTenantAdminService).forTenant(callerTenantId);
const page = await admin.listPage({ status: 'FAILED', limit: 100 });
if (page.records.length > 0) {
  const result = await admin.retry(page.records[0].id);
  if (result.outcome !== 'applied') {
    // Handle not_found, conflict, or lost_claim in the operator UI.
  }
}
const stats = await admin.getStats();
```

`listPage()` uses `(created_at DESC, id DESC)` with an exclusive opaque `nextCursor`. Keep filters stable between pages. Malformed cursors produce `OUTBOX_INVALID_CURSOR`; date-only `list()` filters remain compatible but are not continuation tokens.

In **0.4.0**, v2 cursors preserve PostgreSQL UTC timestamps at microsecond precision, fixing the page-boundary skips in 0.3.0. Public record date fields remain JavaScript `Date` values and cannot reconstruct the cursor. Pass the returned `nextCursor` unchanged. Existing v1 cursors are rejected with `OutboxCursorError` (`OUTBOX_INVALID_CURSOR`); restart those traversals from the first page.

```typescript
const nextPage = page.nextCursor
  ? await admin.listPage({ status: 'FAILED', limit: 100, cursor: page.nextCursor })
  : null;
```

`retry()` moves only `FAILED` to `PENDING`, preserves `retry_count`, clears error/completion fields, and sets `next_attempt_at` to PostgreSQL's current time. `markFailed()` accepts only `PENDING`. No admin mutation overwrites a `PROCESSING` claim. Single-record mutations return `applied`, `not_found`, `conflict`, or `lost_claim`; cross-tenant IDs are `not_found`. `purgeSent()` only removes eligible `SENT` rows.

## 7. Enable PostgreSQL LISTEN/NOTIFY wakeups

Periodic polling is required in **0.4.0**. Setting `polling.enabled: false` fails module initialization with `OutboxConfigurationError` (`OUTBOX_INVALID_CONFIGURATION`), even with a working notification client. A notification triggers a bounded cycle; it does not schedule future retries, exhaust a larger backlog, or replay notifications missed while the listener was disconnected. Startup backlog and expired-lease recovery also need subsequent cycles.

Wakeup mode is an optional latency optimization: `emit()` calls `pg_notify()` inside the business transaction, PostgreSQL delivers the notification after commit, and `OutboxListener` requests an early poll.

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

Listener connection/LISTEN failures or unavailable `pg` degrade to polling; reconnect uses capped exponential backoff. Leave `polling.enabled` at its `true` default. `OutboxWakeupUnavailableError` remains exported for compatibility but is not a current startup failure path. Concurrent timer, notification, and manual triggers coalesce into at most one queued rerun, which shutdown drops while waiting for the active poll. Advanced integrations can provide `wakeup.clientFactory` instead of using the built-in `pg` client.

## Module options

| Option | Type | Default | Description |
|---|---|---|---|
| `prisma` | class ref / instance | **required** | `PrismaService` class reference for `forRoot()` or resolved `PrismaLike` instance for `forRootAsync()`. |
| `polling.enabled` | `boolean` | `true` | Required for backlog, scheduled retries, and recovery; `false` is rejected at module initialization. |
| `polling.interval` | `number` | `5000` | Milliseconds between fallback polling cycles. |
| `polling.batchSize` | `number` | `100` | Maximum records processed per polling cycle. |
| `retry.maxRetries` | `number` | `5` | Delivery attempts allowed before a record becomes `FAILED`. |
| `retry.backoff` | `'fixed' \| 'exponential'` | `'exponential'` | Backoff strategy between attempts. |
| `retry.initialDelay` | `number` | `1000` | Base or fixed retry delay in milliseconds. |
| `delivery.mode` | `'local' \| 'publisher'` | `'local'` | Require decorated local handlers or publish records to a broker transport. |
| `transport` | `Type<OutboxTransport \| OutboxPublisher>` | `LocalTransport` | Delivery provider class. |
| `tenancy.provider` | provider / provider class | none | Sync `forRoot()` only; for async registration use top-level `tenantProvider`. Resolves and restores tenant context. |
| `hooks` | `OutboxHooks` | none | Observe emit, poll, dispatch, retry, and dead-letter lifecycle events; hook errors are isolated. |
| `wakeup.enabled` | `boolean` | `false` | Enable PostgreSQL notification wakeups alongside polling. |
| `wakeup.channel` | `string` | `'outbox_events'` | Non-empty notification channel, no NUL, at most 63 UTF-8 bytes. |
| `wakeup.connectionString` | `string` | `pg` default | Connection string for the built-in notification client. |
| `wakeup.reconnectDelay` | `number` | `5000` | Base reconnect delay in milliseconds; consecutive failures back off up to 60 seconds. |
| `wakeup.clientFactory` | function | built-in `pg` client | Supply a custom `OutboxNotificationClient`. |
| `isGlobal` | `boolean` | `true` | Register the module globally. |
| `stuckThreshold` | `number` | `300000` | Deprecated alias for `lease.duration`; recovery now follows lease expiry. |

See the [generated API reference](/api/outbox/) for complete option and method signatures.

## Retry, lease, and tenant controls

| Option | Default | Contract |
| --- | --- | --- |
| `retry.maxDelay` | `86400000` | Bounds the persisted retry delay; at most `2147483647` ms |
| `lease.duration` | `300000` | Renewable claim lifetime in milliseconds |
| `lease.heartbeatInterval` | duration / 3 | Positive and less than half the lease duration |
| `lease.heartbeatFailureTolerance` | `1` | Heartbeat errors tolerated before abandoning completion |
| `tenancy.policy` | `optional` | `optional`, `required`, or `require-match` |

Both sync/async paths validate polling, retry, lease, delivery, tenant policies/providers, hook members, and notification settings with `OUTBOX_INVALID_CONFIGURATION`. Supplied hook and tenant/notification callbacks must be functions. Setup validates shape and supported values; it does not establish database/broker availability or prove custom callback behavior. Async factory registration errors and Nest dependency-injection errors remain separate. Poller/admin reads reject corrupt persisted records with `OUTBOX_PERSISTED_INVARIANT_VIOLATION`. Hook snapshots cannot change delivery state; `onEmit` observes a staged write before transaction commit and is not a durable audit fact.
