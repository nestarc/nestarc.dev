---
description: "Build an end-to-end NestJS async delivery path from an idempotent order command through a transactional outbox, BullMQ job, and signed tenant webhook, with bounded Reliability evidence."
---

<script setup>
import AdoptionStagePackages from '../.vitepress/theme/components/AdoptionStagePackages.vue'
import PackageVersion from '../.vitepress/theme/components/PackageVersion.vue'
</script>

# Async Delivery Reference Workflow

This guide connects one tenant-scoped order command across the complete asynchronous delivery path:

```text
POST /orders
  -> HTTP idempotency lease and response replay
  -> Order + outbox event in one PostgreSQL transaction
  -> durable BullMQ job with the outbox event ID as its job ID
  -> idempotent webhook event + tenant-scoped delivery rows
  -> signed HTTP delivery to the customer's endpoint
  -> metadata-only evidence correlated across every stage
```

The important outcome is not "exactly once." Each boundary has a smaller, testable guarantee and a deterministic identity for recovering from duplicates. The complete workflow is **at least once**, and the receiver must deduplicate signed `webhook-id` values.

For a shorter explanation of what HTTP `202`, outbox `SENT`, job success, and webhook `SENT` each prove, read [HTTP 202 Is Not Delivery](/blog/http-202-is-not-delivery-nestjs).

The final outbound boundary uses [NestJS Outbound Webhooks with `@nestarc/webhook`](/packages/webhook/) for signed delivery, bounded retries, delivery history, and endpoint isolation.

::: info Reference scope
This is an application integration contract, not a new runtime package. `@nestarc/jobs` now ships `createOutboxJobsPublisher()`, a first-party transport for `@nestarc/outbox` publisher mode. This guide uses that adapter so outbox identity and tenant/correlation lineage cross the queue boundary without an application-owned relay.
:::

## Compatibility Contract

Use the common supported runtime across the whole path:

| Component | Release | Runtime boundary |
| --- | --- | --- |
| tenancy | <PackageVersion slug="tenancy" /> | Node ^22.13 or ^24, NestJS 10 or 11, Prisma 6 or 7 |
| idempotency | <PackageVersion slug="idempotency" /> | Node 20+, NestJS 10 or 11 |
| outbox | <PackageVersion slug="outbox" /> | Node 22+, NestJS 10/11/12, Prisma 5/6/7 |
| jobs | <PackageVersion slug="jobs" /> | Node 22 or 24; NestJS 10 or 11 |
| webhook | <PackageVersion slug="webhook" /> | Node 20+, NestJS 10 or 11, Prisma 5, 6, or 7 |

The reference therefore targets **Node ^22.13 or ^24, NestJS 10 or 11, Prisma 6, PostgreSQL, Redis, and BullMQ ^5.76.2**. The current package set also supports Prisma 7; follow [Prisma 7 Setup](/guide/prisma-7) to replace this guide's legacy client construction with explicit generated output and a matching PostgreSQL adapter. The BullMQ backend is used because an in-memory job can disappear after the outbox row is already marked `SENT`.

::: warning Preview integration
Outbox and jobs are Preview releases. Pin the versions resolved by your lockfile, run the crash-window tests in this guide against those exact artifacts, and review their changelogs before upgrading. This reference defines the intended composition; it is not a blanket production certification for every workload.
:::

::: danger Coordinated jobs 0.2 → 0.3 upgrade
Do not run 0.2 and 0.3 BullMQ producers or workers against the same queues. Stop every 0.2 process, deploy 0.3 everywhere, and only then resume production. Version 0.3 can decode jobs already queued by 0.2, but that compatibility covers the package envelope only; it does not transform application payload or context fields.

The 0.2 version of this workflow stored `outboxEventId` and `correlationId` in the job payload, while the 0.3 publisher stores them in job context. Before switching to the context-only handler below, either drain the old queue with the 0.2 handler or deploy a temporary dual-read handler that uses `context.outboxEventId ?? payload.outboxEventId` and `context.correlationId ?? payload.correlationId`. Keep tenant identity authoritative in context, and remove the payload fallback only after every 0.2 job has drained.

An adopted/deduped v0.2 BullMQ job also keeps the attempts and backoff options with which it was originally queued; the v0.3 publisher does not retrofit its new mapping options. A legacy `{ type, delayMs }` backoff is translated when present, but the old version of this workflow did not set one. The retry/backoff mapping described below therefore applies to newly created v0.3 jobs.

Version 0.3 also rejects a BullMQ namespace containing `.`. A dotted-namespace deployment must drain or explicitly migrate its queues and switch to a dot-free namespace before any 0.3 process starts; changing the namespace changes both queue names and the Redis identity keyspace. Dots in job types remain supported.
:::

The Step 4 package set comes from the central package catalog:

<AdoptionStagePackages :step="4" />

The catalog component prints the canonical Step 4 package command. Add the request/RLS boundary packages and runtime peers:

```bash
npm install @nestarc/idempotency @nestarc/tenancy @nestjs/config @nestjs/schedule@^5
npm install @prisma/client@^6 bullmq@^5.74.1 ioredis@^5 pg dotenv
npm install --save-dev prisma@^6
```

## What Each Success State Means

| State | Proven fact | Not yet proven |
| --- | --- | --- |
| HTTP `202` | Order and outbox row committed | A job or webhook was delivered |
| Outbox `SENT` | BullMQ accepted the deterministic job ID | The job handler succeeded |
| Job `succeeded` | Webhook event and any matching delivery rows committed (the set may be empty) | A customer endpoint returned 2xx |
| Webhook delivery `SENT` | The endpoint returned 2xx | The receiver committed its own side effect |

Never collapse those states into one "completed" flag. A missing later state tells an operator which boundary needs attention.

## 1. Prepare Persistence and Runtime Roles

Keep schema changes on a schema-owner connection and application execution on a non-owner runtime connection:

```dotenv
MIGRATION_DATABASE_URL="postgresql://schema_owner:...@db.example.com/app?sslmode=verify-full"
ORDERS_DATABASE_URL="postgresql://orders_api:...@db.example.com/app?sslmode=verify-full"
OUTBOX_DATABASE_URL="postgresql://outbox_worker:...@db.example.com/app?sslmode=verify-full"
OUTBOX_MAINTENANCE_DATABASE_URL="postgresql://outbox_maintenance:...@db.example.com/app?sslmode=verify-full"
WEBHOOK_PUBLISH_DATABASE_URL="postgresql://webhook_publisher:...@db.example.com/app?sslmode=verify-full"
WEBHOOK_DELIVERY_DATABASE_URL="postgresql://webhook_worker:...@db.example.com/app?sslmode=verify-full"
WEBHOOK_ADMIN_DATABASE_URL="postgresql://webhook_admin:...@db.example.com/app?sslmode=verify-full"
WEBHOOK_MAINTENANCE_DATABASE_URL="postgresql://webhook_maintenance:...@db.example.com/app?sslmode=verify-full"
IDEMPOTENCY_REDIS_URL="rediss://idempotency_api:...@redis.example.com:6380"
JOBS_REDIS_URL="rediss://jobs_worker:...@redis.example.com:6380"
JOBS_REDIS_CA_FILE="/run/secrets/redis-ca.pem"
```

Inject credentials from a secret manager; do not commit these values. PostgreSQL clients must verify the server certificate/hostname. Give idempotency and jobs different Redis ACL users (or instances) with only the commands/keyspaces they need, and configure their ioredis providers with a trusted CA and `rejectUnauthorized: true`. The `psql` commands below require `MIGRATION_DATABASE_URL` to be exported into the shell by your secret manager or CI environment; saving it in a `.env` file alone does not make it visible to `psql`. Do not source an untrusted env file as shell code.

For Prisma 6, keep the normal runtime URL and a direct migration URL in `schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("ORDERS_DATABASE_URL")
  directUrl = env("MIGRATION_DATABASE_URL")
}

model Order {
  id                 String   @id @default(uuid()) @db.Uuid
  tenantId           String   @map("tenant_id") @db.VarChar(255)
  commandKeyHash     String   @map("command_key_hash") @db.Char(64)
  requestFingerprint String   @map("request_fingerprint") @db.Char(64)
  totalCents         Int      @map("total_cents")
  status             String   @default("accepted") @db.VarChar(32)
  createdAt          DateTime @default(now()) @map("created_at") @db.Timestamptz()

  @@unique([tenantId, commandKeyHash], map: "orders_tenant_command_key")
  @@index([tenantId, createdAt], map: "orders_tenant_created_idx")
  @@map("orders")
}
```

Create the business migration, then apply the raw SQL shipped by outbox and webhook with the schema-owner URL:

```bash
npx prisma migrate dev --name add-orders

psql "$MIGRATION_DATABASE_URL" \
  -f "$(node -e "console.log(require.resolve('@nestarc/outbox/src/sql/create-outbox-table.sql'))")"

psql "$MIGRATION_DATABASE_URL" \
  -f node_modules/@nestarc/webhook/src/sql/create-webhook-tables.sql

# The published schema uses VARCHAR(255) for legacy plaintext secrets. KMS
# envelope ciphertext is variable-length, so widen it before enabling the
# production vault. This conversion is additive and preserves existing rows.
psql "$MIGRATION_DATABASE_URL" \
  -c 'ALTER TABLE webhook_endpoints ALTER COLUMN secret TYPE TEXT;'
```

For an existing outbox 0.1/0.2 or webhook pre-0.13 installation, apply the package-specific additive migrations instead of assuming a new-install script alters old tables. See [Outbox installation](/packages/outbox/installation) and [Webhook installation](/packages/webhook/installation).

Enable and force tenant RLS on the business table. The authenticated tenant context must be set in the same transaction as every order query:

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders FORCE ROW LEVEL SECURITY;

CREATE POLICY orders_tenant_isolation ON orders
  USING (tenant_id = current_setting('app.current_tenant', true))
  WITH CHECK (tenant_id = current_setting('app.current_tenant', true));

CREATE POLICY orders_context_guard ON orders AS RESTRICTIVE
  USING (NULLIF(current_setting('app.current_tenant', true), '') IS NOT NULL)
  WITH CHECK (NULLIF(current_setting('app.current_tenant', true), '') IS NOT NULL);

ALTER TABLE outbox_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbox_events FORCE ROW LEVEL SECURITY;

CREATE POLICY outbox_orders_insert ON outbox_events
  FOR INSERT TO orders_api
  WITH CHECK (
    tenant_id = NULLIF(current_setting('app.current_tenant', true), '')
  );

CREATE POLICY outbox_worker_select ON outbox_events
  FOR SELECT TO outbox_worker
  USING (true);

CREATE POLICY outbox_worker_status_update ON outbox_events
  FOR UPDATE TO outbox_worker
  USING (true)
  WITH CHECK (true);

CREATE POLICY outbox_maintenance_all ON outbox_events
  FOR ALL TO outbox_maintenance
  USING (true)
  WITH CHECK (true);
```

Create the named roles in a database-provisioning step before applying this migration. Pair the worker policy with column-level `UPDATE` grants only for the poller's state fields (`status`, `updated_at`, `processed_at`, `retry_count`, `last_error`, `next_attempt_at`, `claim_token`, `lease_expires_at`); RLS alone does not stop a compromised role from changing another permitted column. Grant cross-tenant delete only to the audited maintenance role.

Do not give one `app_runtime` role every table and verb. Provision separate credentials and verify the exact grants against the pinned package versions:

| Role | Minimum responsibility | Must not receive |
| --- | --- | --- |
| `orders_api` | `SELECT`, `INSERT` on `orders`; `INSERT` on `outbox_events` | Outbox status updates, endpoint secrets, delivery attempts |
| `outbox_worker` | `SELECT` outbox rows and update only poller state columns | Business-table access or mutation of payload/tenant/identity columns |
| `outbox_maintenance` | Bounded, audited retention/recovery against outbox rows | Request traffic or schema ownership |
| `webhook_publisher` | `SELECT` the matching endpoint fields (including encrypted secret snapshots, without decrypt permission) and event dedupe fields; `INSERT` events/deliveries | Delivery `SELECT`, secret decryption, delivery retries, business tables |
| `webhook_worker` | Read required endpoint/event/delivery columns; update delivery state and only endpoint circuit columns; insert attempts; decrypt signing secrets | Business tables and endpoint configuration changes outside worker-owned circuit fields |
| `webhook_admin` | Explicitly authorized endpoint and recovery operations | General application traffic or Reliability access |
| `webhook_maintenance` | Scheduled payload/response redaction through narrowly granted retention-column updates | Endpoint administration, secret decryption, row deletion, or request traffic |

Each runtime role needs schema `USAGE`, must be a non-owner, `NOSUPERUSER`, and `NOBYPASSRLS`, and must not hold schema-changing privileges. Use column-level grants for webhook worker circuit fields (`active`, `consecutive_failures`, `disabled_at`, `disabled_reason`, `updated_at`) and delivery state fields required by the pinned worker. Put retention reads and column updates in a separate maintenance role. A single-process deployment may combine these permissions for local evaluation, but that expands the compromise blast radius and is not the production reference boundary.

Complete the [tenancy installation](/packages/tenancy/installation) before this guide. The service below uses `tenancyTransaction()` for both the first write and the unique-key fallback, so `app.current_tenant` is set on the exact PostgreSQL transaction that reads or writes `orders`. Merely enabling RLS without that context returns zero rows or rejects writes.

## 2. Define Stable Event Contracts

Use different class names for the internal outbox event and the customer-facing webhook event. They may share an event type, but they have different persistence and retry lifecycles.

```typescript
// order-events.ts
import { OutboxEvent } from '@nestarc/outbox';
import { WebhookEvent } from '@nestarc/webhook';

export const MAX_ORDER_TOTAL_CENTS = 100_000_000;
export const isValidOrderTotal = (value: unknown): value is number =>
  typeof value === 'number' &&
  Number.isSafeInteger(value) &&
  value >= 0 &&
  value <= MAX_ORDER_TOTAL_CENTS;

export class OrderAcceptedOutboxEvent extends OutboxEvent {
  static readonly eventType = 'order.accepted';

  constructor(
    public readonly orderId: string,
    public readonly totalCents: number,
  ) {
    super();
  }
}

export class OrderAcceptedWebhookEvent extends WebhookEvent {
  static readonly eventType = 'order.accepted';

  constructor(
    public readonly orderId: string,
    public readonly totalCents: number,
  ) {
    super();
  }
}
```

Keep payloads minimal. Tenant, correlation, retry, and routing identifiers belong in the outbox record or job context, not duplicated inside the customer payload.

## 3. Commit the Order and Outbox Event Together

Protect the HTTP endpoint with shared Redis idempotency. Scope keys with the **authenticated** tenant so two tenants can safely use the same client command ID:

```typescript
// order-idempotency.module.ts
import {
  BadRequestException,
  ExecutionContext,
  Module,
} from '@nestjs/common';
import { IdempotencyModule, RedisStorage } from '@nestarc/idempotency';
import type Redis from 'ioredis';
import {
  IdempotencyRedisModule,
  IDEMPOTENCY_REDIS,
} from './idempotency-redis.module';

const uuidV4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const configuredIdempotencyModule = IdempotencyModule.forRootAsync({
  imports: [IdempotencyRedisModule],
  inject: [IDEMPOTENCY_REDIS],
  useFactory: (redis: Redis) => ({
    storage: new RedisStorage({
      client: redis,
      keyPrefix: 'orders:idempotency:',
    }),
    ttl: 86_400,
    processingTtl: 120,
    fingerprint: true,
    maxKeyLength: 36,
    keyResolver: (ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest<{
        headers: Record<string, string | string[] | undefined>;
      }>();
      const value = request.headers['idempotency-key'];
      if (typeof value !== 'string' || !uuidV4.test(value)) {
        throw new BadRequestException('Idempotency-Key must be a UUIDv4');
      }
      return value;
    },
    scope: (ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest<{
        method: string;
        url: string;
        user: { tenantId: string };
      }>();
      const path = request.url.split('?', 1)[0];
      return `${request.user.tenantId}:${request.method}:${path}`;
    },
  }),
});

@Module({
  imports: [IdempotencyRedisModule, configuredIdempotencyModule],
  exports: [IdempotencyModule, IdempotencyRedisModule],
})
export class OrderIdempotencyModule {}
```

`IdempotencyRedisModule` is application-owned. It fails fast unless `IDEMPOTENCY_REDIS_URL` uses `rediss:` with ACL credentials, constructs the CA-verifying ioredis client, and exposes no automatic destroy hook. Because `RedisStorage` receives an external client, the API process shutdown coordinator below—not `RedisStorage`—closes it after HTTP disposal.

Set `processingTtl` above the endpoint's measured p99. A shorter lease can permit the same handler to run while the first request is still active.

Require a random UUIDv4 command ID. The interceptor's `keyResolver` rejects emails, customer identifiers, and other arbitrary values **before storage access**. The controller consumes that already-validated header; service methods that can be called without the interceptor should enforce the same UUIDv4 invariant at their own boundary. The service stores only its SHA-256 digest in durable database/outbox fields; UUIDv4 has enough entropy that this deterministic digest is not practically enumerable.

The controller takes tenant identity from an authentication guard, never directly from a caller-controlled tenant header:

```typescript
// orders.controller.ts
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Idempotent, IdempotencyInterceptor } from '@nestarc/idempotency';

@Controller('orders')
@UseGuards(JwtAuthGuard)
@UseInterceptors(IdempotencyInterceptor)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @Idempotent()
  create(
    @Req() request: AuthenticatedRequest,
    @Headers('idempotency-key') commandId: string,
    @Body() dto: { totalCents: number },
  ) {
    return this.orders.create({
      tenantId: request.user.tenantId,
      commandId,
      correlationId: request.requestId,
      totalCents: dto.totalCents,
    });
  }
}
```

`JwtAuthGuard`, `AuthenticatedRequest`, the data modules, and the named Prisma services are application-owned types in these snippets. Each Prisma service exposes a raw Prisma 6 client as `.base` and connects with only the process-specific URL shown above. `request.requestId` should be generated by trusted middleware or validated against a short opaque-ID policy; do not copy an arbitrary request header into every persistence layer.

The guard is route authorization, not the mechanism that establishes `TenancyService`. JWT signature verification middleware must run before `TenancyModule` middleware, populate `request.user`, and the tenant extractor/hook must resolve and cross-check the verified tenant claim. A Nest guard runs too late to make an unverified JWT extractor safe. Follow the [JWT extractor middleware ordering contract](/packages/tenancy/extractors#jwt-claim).

The database unique key is a second guard for the narrow case where the order committed but the process died before the Redis response record was completed. It also prevents a later request from reusing the same command ID with different data:

```typescript
// orders.service.ts
import { createHash } from 'node:crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OutboxEmitter } from '@nestarc/outbox';
import { TenancyService, tenancyTransaction } from '@nestarc/tenancy';
import { Prisma } from '@prisma/client';
import {
  isValidOrderTotal,
  OrderAcceptedOutboxEvent,
} from './order-events';

type CreateOrderCommand = {
  tenantId: string;
  commandId: string;
  correlationId: string;
  totalCents: number;
};

type OrderResponse = {
  id: string;
  status: string;
  totalCents: number;
};

function toOrderResponse(order: OrderResponse): OrderResponse {
  return {
    id: order.id,
    status: order.status,
    totalCents: order.totalCents,
  };
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: OrdersPrismaService,
    private readonly tenancy: TenancyService,
    private readonly outbox: OutboxEmitter,
  ) {}

  async create(command: CreateOrderCommand): Promise<OrderResponse> {
    if (!isValidOrderTotal(command.totalCents)) {
      throw new BadRequestException('totalCents is outside the allowed range');
    }

    const currentTenantId = this.tenancy.getCurrentTenantOrThrow();
    if (currentTenantId !== command.tenantId) {
      throw new ForbiddenException('Authenticated tenant context mismatch');
    }

    const requestFingerprint = createHash('sha256')
      .update(JSON.stringify({ totalCents: command.totalCents }))
      .digest('hex');
    const commandKeyHash = createHash('sha256')
      .update(command.commandId)
      .digest('hex');

    try {
      return await tenancyTransaction(
        this.prisma.base,
        this.tenancy,
        async (tx) => {
          const order = await tx.order.create({
            data: {
              tenantId: currentTenantId,
              commandKeyHash,
              requestFingerprint,
              totalCents: command.totalCents,
            },
          });

          await this.outbox.emit(
            tx,
            new OrderAcceptedOutboxEvent(order.id, order.totalCents),
            {
              tenantId: currentTenantId,
              aggregateType: 'Order',
              aggregateId: order.id,
              partitionKey: order.id,
              idempotencyKey: commandKeyHash,
              correlationId: command.correlationId,
              headers: { source: 'orders-api' },
            },
          );

          return toOrderResponse(order);
        },
      );
    } catch (error) {
      if (
        !(error instanceof Prisma.PrismaClientKnownRequestError) ||
        error.code !== 'P2002'
      ) {
        throw error;
      }

      const existing = await tenancyTransaction(
        this.prisma.base,
        this.tenancy,
        (tx) =>
          tx.order.findUnique({
            where: {
              tenantId_commandKeyHash: {
                tenantId: currentTenantId,
                commandKeyHash,
              },
            },
          }),
      );

      if (!existing) {
        throw error;
      }

      if (existing.requestFingerprint !== requestFingerprint) {
        throw new UnprocessableEntityException(
          'Command ID was already used with different order data',
        );
      }

      return toOrderResponse(existing);
    }
  }
}
```

If either insert fails, the order and outbox row both roll back. If the unique fallback returns an existing order, it does **not** emit a second event.

## 4. Register Durable Workers

Register outbox in `publisher` mode with the first-party jobs transport, whose only side effect is a durable BullMQ enqueue. The webhook worker persists deliveries in PostgreSQL and sends them separately.

```typescript
// Condensed listing: put each process module in its own entrypoint file.
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import {
  type DynamicModule,
  Inject,
  Injectable,
  Module,
  type OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OutboxModule } from '@nestarc/outbox';
import {
  BullMQBackend,
  createOutboxJobsPublisher,
  JobsModule,
} from '@nestarc/jobs';
import type { ConnectionOptions } from 'bullmq';
import { WebhookModule, type WebhookSecretVault } from '@nestarc/webhook';
import { OrderIdempotencyModule } from './order-idempotency.module';
import {
  isValidOrderTotal,
  OrderAcceptedOutboxEvent,
  OrderAcceptedWebhookEvent,
} from './order-events';
import type Redis from 'ioredis';
import { IDEMPOTENCY_REDIS } from './idempotency-redis.module';
import {
  WebhookSecretVaultModule,
  WEBHOOK_SECRET_VAULT,
} from './webhook-secret-vault.module';

const positiveInt = (
  config: ConfigService,
  key: string,
  fallback: number,
): number => {
  const value = Number(config.get(key) ?? fallback);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${key} must be a positive integer`);
  }
  return value;
};

const requiredBullMqConnection = (
  urlKey: string,
  caFileKey: string,
): ConnectionOptions => {
  const value = process.env[urlKey];
  if (!value) throw new Error(`${urlKey} is required`);
  const parsed = new URL(value);
  if (parsed.protocol !== 'rediss:') {
    throw new Error(`${urlKey} must use rediss:`);
  }
  if (!parsed.username || !parsed.password) {
    throw new Error(`${urlKey} must include an ACL username and password`);
  }
  const caFile = process.env[caFileKey];
  if (!caFile) throw new Error(`${caFileKey} is required`);
  const dbPath = parsed.pathname.replace(/^\//, '');
  const db = dbPath === '' ? 0 : Number(dbPath);
  if (!Number.isSafeInteger(db) || db < 0) {
    throw new Error(`${urlKey} must contain a numeric Redis database path`);
  }

  return {
    host: parsed.hostname,
    port: Number(parsed.port || 6380),
    username: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    db,
    tls: {
      ca: readFileSync(caFile, 'utf8'),
      servername: parsed.hostname,
      rejectUnauthorized: true,
    },
  };
};

const webhookRetention = {
  eventPayloadRetentionDays: 30,
  deliveryResponseBodyRetentionDays: 14,
  attemptResponseBodyRetentionDays: 7,
};
const uuidV4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const sanitizeOrderWebhookPayload = (
  payload: Record<string, unknown>,
  eventType: string,
): Record<string, unknown> => {
  if (
    eventType !== OrderAcceptedWebhookEvent.eventType ||
    typeof payload.orderId !== 'string' ||
    !uuidV4.test(payload.orderId) ||
    !isValidOrderTotal(payload.totalCents)
  ) {
    throw new Error('invalid_order_webhook_payload');
  }
  return {
    orderId: payload.orderId,
    totalCents: payload.totalCents,
  };
};

const OrderJobsPublisher = createOutboxJobsPublisher({
  map: {
    [OrderAcceptedOutboxEvent.eventType]: {
      job: 'publishOrderWebhook',
      options: {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delayMs: 1_000,
          maxDelayMs: 60_000,
          jitter: 0.1,
        },
      },
    },
  },
});

@Injectable()
class OrdersApiShutdown implements OnApplicationShutdown {
  constructor(
    private readonly prisma: OrdersPrismaService,
    @Inject(IDEMPOTENCY_REDIS) private readonly redis: Redis,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    await Promise.all([
      this.prisma.disconnect(),
      this.redis.quit(),
    ]);
  }
}

@Injectable()
class WebhookDeliveryShutdown implements OnApplicationShutdown {
  constructor(private readonly prisma: WebhookDeliveryPrismaService) {}

  async onApplicationShutdown(): Promise<void> {
    await this.prisma.disconnect();
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OrdersPrismaModule,
    OrderIdempotencyModule,
    OutboxModule.forRootAsync({
      imports: [OrdersPrismaModule, ConfigModule],
      inject: [OrdersPrismaService, ConfigService],
      useFactory: (
        prisma: OrdersPrismaService,
        config: ConfigService,
      ) => ({
        prisma: prisma.base,
        polling: { enabled: false },
        retry: {
          maxRetries: positiveInt(config, 'OUTBOX_MAX_RETRIES', 5),
        },
      }),
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersApiShutdown],
})
export class OrdersApiModule {}

@Module({})
export class RelayJobsWorkerModule {
  static register(): DynamicModule {
    const jobsBackend = new BullMQBackend({
      namespace: 'orders',
      connection: requiredBullMqConnection(
        'JOBS_REDIS_URL',
        'JOBS_REDIS_CA_FILE',
      ),
      workerConcurrency: 10,
    });

    return {
      module: RelayJobsWorkerModule,
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        RelayDataModule,
        WebhookSecretVaultModule,
        JobsModule.forBullMQ({
          backend: jobsBackend,
          jobTypes: ['publishOrderWebhook'],
        }),
        OutboxModule.forRootAsync({
          imports: [RelayDataModule, ConfigModule],
          inject: [OutboxWorkerPrismaService, ConfigService],
          transport: OrderJobsPublisher,
          useFactory: (
            prisma: OutboxWorkerPrismaService,
            config: ConfigService,
          ) => ({
            prisma: prisma.base,
            polling: {
              interval: positiveInt(config, 'OUTBOX_POLL_INTERVAL', 5_000),
              batchSize: positiveInt(config, 'OUTBOX_BATCH_SIZE', 100),
            },
            retry: {
              backoff: 'exponential',
              initialDelay: 1_000,
            },
            delivery: { mode: 'publisher' },
          }),
        }),
        WebhookModule.forRootAsync({
          imports: [
            RelayDataModule,
            ConfigModule,
            WebhookSecretVaultModule,
          ],
          inject: [
            WebhookPublisherPrismaService,
            ConfigService,
            WEBHOOK_SECRET_VAULT,
          ],
          useFactory: (
            prisma: WebhookPublisherPrismaService,
            config: ConfigService,
            secretVault: WebhookSecretVault,
          ) => ({
            prisma: prisma.base,
            secretVault,
            delivery: {
              maxRetries: positiveInt(config, 'WEBHOOK_MAX_RETRIES', 5),
            },
            redaction: {
              sanitizePayload: (payload, { eventType }) =>
                sanitizeOrderWebhookPayload(payload, eventType),
            },
            retention: webhookRetention,
            polling: { enabled: false },
          }),
        }),
      ],
      providers: [PublishOrderWebhookHandler],
    };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WebhookDeliveryPrismaModule,
    WebhookSecretVaultModule,
    WebhookModule.forRootAsync({
      imports: [
        WebhookDeliveryPrismaModule,
        ConfigModule,
        WebhookSecretVaultModule,
      ],
      inject: [
        WebhookDeliveryPrismaService,
        ConfigService,
        WEBHOOK_SECRET_VAULT,
      ],
      useFactory: (
        prisma: WebhookDeliveryPrismaService,
        config: ConfigService,
        secretVault: WebhookSecretVault,
      ) => ({
        prisma: prisma.base,
        secretVault,
        delivery: {
          timeout: positiveInt(config, 'WEBHOOK_TIMEOUT', 10_000),
          jitter: true,
        },
        redaction: {
          sanitizeResponseBody: () => null,
        },
        retention: webhookRetention,
        polling: {
          interval: positiveInt(config, 'WEBHOOK_POLL_INTERVAL', 5_000),
          batchSize: positiveInt(config, 'WEBHOOK_BATCH_SIZE', 50),
          maxConcurrency: positiveInt(
            config,
            'WEBHOOK_MAX_CONCURRENCY',
            50,
          ),
        },
      }),
    }),
  ],
  providers: [WebhookDeliveryShutdown],
})
export class WebhookDeliveryWorkerModule {}
```

Although the listing is condensed, place `OrdersApiModule`, `RelayJobsWorkerModule`, and `WebhookDeliveryWorkerModule` in separate files and bootstrap exactly one per process. The relay process must import the dynamic registration—bootstrapping the empty shell class directly would start no workers:

```typescript
// relay-jobs-process.module.ts
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  OutboxWorkerPrismaService,
  WebhookPublisherPrismaService,
} from './relay-data.module';
import { RelayJobsWorkerModule } from './relay-jobs-worker.module';

@Module({ imports: [RelayJobsWorkerModule.register()] })
class RelayJobsProcessModule {}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(
    RelayJobsProcessModule,
  );
  const outboxPrisma = app.get(OutboxWorkerPrismaService);
  const webhookPrisma = app.get(WebhookPublisherPrismaService);
  let shutdownPromise: Promise<void> | undefined;

  const shutdown = (): Promise<void> => {
    shutdownPromise ??= (async () => {
      try {
        // Run every Nest shutdown hook while both Prisma clients are connected.
        await app.close();
      } finally {
        await Promise.all([
          outboxPrisma.disconnect(),
          webhookPrisma.disconnect(),
        ]);
      }
    })();
    return shutdownPromise;
  };

  const onSignal = (): void => {
    void shutdown().catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
  };

  process.once('SIGTERM', onSignal);
  process.once('SIGINT', onSignal);
}

void bootstrap();
```

`RelayJobsWorkerModule.register()` is the only path that reads `JOBS_REDIS_URL`. Do not import all three process modules into one `AppModule`: outbox/webhook are global modules and competing registrations would overwrite process ownership. A one-process local demo needs its own composition that registers each package exactly once and explicitly accepts the broader role.

`OrdersPrismaModule`, `RelayDataModule`, `WebhookDeliveryPrismaModule`, their named Prisma services, `WebhookSecretVaultModule`, and `WEBHOOK_SECRET_VAULT` are application-owned. `OrdersPrismaModule` also imports/exports the already configured tenancy services after authentication middleware. Export only the clients required by that process; do not make the four database credentials globally injectable. Each named service validates its credential and `sslmode=verify-full`, constructs a raw Prisma 6 client from only its corresponding URL, and exposes explicit `.disconnect()`; it must **not** implement `onModuleDestroy` or `onApplicationShutdown` itself. The process coordinator owns ordering. The vault provider must implement `WebhookSecretVault` with envelope encryption backed by KMS/HSM-managed keys; do not bind `PlaintextSecretVault` in production. Bind a fail-closed, non-decrypting provider in the relay/publisher process, and grant decrypt permission only to the delivery worker and the separately authorized secret-administration path.

The package blocks private/internal destinations by default, but the current release still accepts publicly routed `http:` URLs. The RBAC-protected endpoint administration layer must parse every create/update URL and reject it unless `new URL(value).protocol === 'https:'` before calling `WebhookEndpointAdminService`. Apply the same rule to imports and administrative replay tooling; `allowPrivateUrls: false` is an SSRF control, not a transport-encryption control.

Call `app.enableShutdownHooks()` in the API and webhook-delivery bootstraps. The relay bootstrap above instead owns `SIGTERM`/`SIGINT`, awaits `app.close()`, and disconnects its two Prisma clients only after all Nest lifecycle phases finish; this avoids relying on relative `onApplicationShutdown` ordering between its parent module and the global Outbox module on NestJS 10/11. `JobsModule.forBullMQ()` still owns the backend lifecycle: it stops new consumption, lets active handlers finish (including their follow-up enqueue calls), and closes workers and queues before feature providers are torn down. Once close begins, enqueue calls from external producers fail with `jobs_backend_closed`; only follow-up enqueues made from an already active handler are admitted during the drain. Do not add a second hook that calls `jobsBackend.close()`.

::: danger Outbox and Jobs do not coordinate their shutdown phases
The automatic Jobs guarantee is backend-local; it does not quiesce the co-located outbox producer. `@nestarc/jobs` 0.4 starts backend close in `onModuleDestroy`, while `@nestarc/outbox` 0.3 stops polling and waits for its active poll in `onApplicationShutdown`. Nest runs module-destroy hooks before application-shutdown hooks, so an outbox poll that publishes during that gap can receive `jobs_backend_closed`. That failure follows the outbox retry policy and can eventually leave the record `FAILED`; a longer termination grace does not remove this race.

Treat a SIGTERM-only rollout of the combined relay process as retryable, not lossless. A production rollout needs an application/deployment-owned pre-stop phase that gates new outbox work, prevents another claim/publish cycle, waits for the active poll and its `PROCESSING` records to finish, and only then lets Nest close Jobs. `@nestarc/outbox` 0.3 exposes no dedicated public pause/drain operation, so a `preStop` sleep by itself cannot prove that quiescence. With the unmodified package combination shown here, retry budget, `jobs_backend_closed` alerts, and bounded operator recovery for records that reach `FAILED` are the actual fallback unless the deployment can stop upstream emission and prove that no active or eligible outbox record remains before signaling the relay. The explicit relay coordinator keeps Prisma available through `app.close()` but does not establish producer-before-backend ordering.
:::

After that boundary, the relay bootstrap disconnects its Prisma clients after `app.close()`; the webhook module similarly drains before `WebhookDeliveryShutdown` disconnects its client. The API coordinator closes its external Redis client and Prisma client after the HTTP application is disposed.

Set the platform termination grace above **30 seconds + the maximum bounded job-handler duration + margin** for the relay process, and above **30 seconds + margin** for webhook delivery. This budget lets active work drain after a correct pre-stop; it does not fix the outbox/Jobs hook ordering above. BullMQ has no cooperative handler timeout in this release, so enforce network/database timeouts in the handler path; an unbounded handler defeats graceful shutdown.

Retention configuration does not run a purge automatically. In a separate maintenance context, bind `WebhookModule` to `WebhookMaintenancePrismaService.base`, set `polling.enabled: false` and the same `webhookRetention`, then schedule the package operation:

```typescript
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WebhookRetentionAdminService } from '@nestarc/webhook';

@Injectable()
export class WebhookRetentionJob {
  constructor(private readonly retention: WebhookRetentionAdminService) {}

  @Cron('0 3 * * *')
  async purge(): Promise<void> {
    await this.retention.purgeExpiredData();
  }
}
```

Register this provider with `ScheduleModule.forRoot()` in the maintenance context. Run one elected scheduler (or use a distributed lock), bound to `WEBHOOK_MAINTENANCE_DATABASE_URL`; record the purge result without payloads. Choose retention windows with privacy, incident-response, and support owners rather than copying the example values unchanged.

Despite the method name, the pinned implementation redacts retained rows with `UPDATE`; it does not delete them. Grant only the predicate reads and these column updates: `webhook_events(payload, payload_purged_at)`, `webhook_deliveries(response_body)`, and `webhook_delivery_attempts(response_body, response_body_truncated)`. Do not grant this scheduler row deletion, endpoint mutation, or secret-decrypt permission.

::: warning BullMQ capability boundary
The BullMQ backend is durable and multi-process. For declared job types it restores status after restart, maps `scheduledFor` and the package backoff policy, persists context and metadata for v0.3-enqueued jobs, and provides Redis-backed idempotency and global/tenant dedupe. It still does not provide package-level tenant fairness, cooperative handler timeouts, durable transition history, manual drain, or the in-memory backend's service-level DLQ helpers. Fairness controls fail with `jobs_fairness_misconfig`; the other unavailable BullMQ operations fail with `jobs_capability_unsupported`. This reference does not call them.
:::

The three modules above are the production process boundaries: API; relay + jobs worker; and webhook delivery worker. Endpoint/secret administration remains a separate RBAC-protected surface and credential.

`JobsModule.forBullMQ()` starts consumers after bootstrap handler validation in `worker`/`both` roles. This reference keeps the publisher and consumer co-located with default `both`; 0.4 also supports separate `producer` and `worker` processes. Role separation does not automatically settle an outbox poll before closing its producer backend. Processes share logical PostgreSQL/Redis state, but they must not share one database role or one unrestricted vault credential. Keep the BullMQ namespace dot-free (`orders`, not `orders.relay`) so queue identity remains valid.

## 5. Publish the Outbox Record to BullMQ

`createOutboxJobsPublisher()` is the `@nestarc/outbox` publisher transport registered in Step 4. Its mapping sends `order.accepted` to `publishOrderWebhook`, preserves the source payload, and applies a bounded attempt/backoff policy to newly created v0.3 jobs. The package's public `{ type, delayMs, maxDelayMs, jitter }` policy is translated by the BullMQ worker in 0.3, so the example no longer needs an application-owned option adapter.

Tenant identity is required by default. A missing tenant or mapping rejects `publish()`, allowing the outbox poller to retry and eventually mark the record `FAILED`; it cannot silently acknowledge a tenant event as global or drop an unknown event. Use `tenant: 'optional'` or `unmapped: 'ignore'` only for a deliberately global/ignored mapping that has its own tests and review.

The adapter always sets both `jobId` and `idempotencyKey` to the outbox record UUID and does not allow mapping options to override them. It copies `tenantId`, `outboxEventId`, correlation ID (falling back to the event ID), and optional causation ID into job context and metadata. If Redis accepts the job and the process stops before outbox marks the event `SENT`, the next publish resolves to the same job instead of creating a second one. This suppresses duplicate enqueue; the handler path remains at-least-once.

Keep completed/failed BullMQ job IDs at least as long as the outbox retry and operator-recovery window. If a cleanup policy removes the old job first, a later outbox retry can enqueue it again; the downstream webhook publish key still prevents a second delivery fan-out.

## 6. Publish the Tenant Webhook from the Job

The job handler persists a webhook event and its tenant-matching delivery rows. It does **not** perform the HTTP request itself:

```typescript
// publish-order-webhook.handler.ts
import { Injectable } from '@nestjs/common';
import { JobHandler } from '@nestarc/jobs';
import { WebhookService } from '@nestarc/webhook';
import { OrderAcceptedWebhookEvent } from './order-events';

type PublishOrderWebhookPayload = {
  orderId: string;
  totalCents: number;
};

type PublishOrderWebhookContext = {
  tenantId?: string;
  outboxEventId?: string;
  correlationId?: string;
  causationId?: string;
};

@Injectable()
export class PublishOrderWebhookHandler {
  constructor(private readonly webhooks: WebhookService) {}

  @JobHandler('publishOrderWebhook')
  async handle(
    payload: PublishOrderWebhookPayload,
    context: PublishOrderWebhookContext,
  ): Promise<void> {
    if (
      !context.tenantId ||
      !context.outboxEventId ||
      !context.correlationId
    ) {
      throw new Error('webhook_job_lineage_missing');
    }

    await this.webhooks.sendToTenant(
      context.tenantId,
      new OrderAcceptedWebhookEvent(payload.orderId, payload.totalCents),
      {
        idempotencyKey: context.outboxEventId,
        correlationId: context.correlationId,
      },
    );
  }
}
```

The built-in Prisma webhook repository deduplicates on tenant, event type, and idempotency key. If PostgreSQL commits the webhook rows and the job is retried before BullMQ records success, the handler receives the existing webhook event ID and does not fan out a second delivery set.

The webhook worker then owns signing, HTTP timeout, retry, stale-claim recovery, and circuit breaking. Receivers must verify both the signature and a finite timestamp window over the raw request body before parsing it:

```typescript
import { UnauthorizedException } from '@nestjs/common';
import { WebhookSigner } from '@nestarc/webhook';

function requireWebhookHeader(
  name: string,
  maxLength: number,
): string {
  const value = headers[name];
  if (typeof value !== 'string') {
    throw new UnauthorizedException(`Missing ${name} header`);
  }

  const normalized = value.trim();
  if (normalized.length === 0 || normalized.length > maxLength) {
    throw new UnauthorizedException(`Invalid ${name} header`);
  }
  return normalized;
}

const webhookId = requireWebhookHeader('webhook-id', 255);
const timestampHeader = requireWebhookHeader('webhook-timestamp', 16);
const signature = requireWebhookHeader('webhook-signature', 4096);

if (!/^\d+$/.test(timestampHeader)) {
  throw new UnauthorizedException('Invalid webhook-timestamp header');
}
const timestamp = Number(timestampHeader);
if (!Number.isSafeInteger(timestamp)) {
  throw new UnauthorizedException('Invalid webhook-timestamp header');
}

const signer = new WebhookSigner();
const accepted = signer.verifyWithTolerance(
  webhookId,
  timestamp,
  rawBody,
  signingSecret,
  signature,
  { toleranceSeconds: 300 },
);

if (!accepted) {
  throw new UnauthorizedException('Invalid or stale webhook signature');
}

await receiverDatabase.transaction(async (tx) => {
  const firstDelivery = await tx.webhookReceipt.insertIfAbsent({
    webhookId,
  });
  if (!firstDelivery) return;
  await applyOrderAcceptedSideEffect(tx, JSON.parse(rawBody));
});
```

The receiver's `webhook-id` unique row is a dedupe tombstone, not a short-lived cache entry. Retain it longer than the maximum authorized retry/replay and event-retention horizon; keep it permanently when repeating the business side effect would be irreversible. Keep the authorized replay window within the sender's event-payload retention window. A duplicate that already committed should return 2xx without repeating the side effect. See [Webhook security](/packages/webhook/security).

Subscriptions match exact event-type strings; `order.*` is not a wildcard. The default secret vault stores endpoint secrets without encryption for backward compatibility, so production deployments must provide the KMS-backed `WebhookSecretVault` injected above, configure redaction/retention, keep `allowPrivateUrls` disabled, and enforce `https:` in the application-owned endpoint administration boundary.

## 7. Correlate Bounded Reliability Evidence

The current Reliability pilot is read-only and this repository does not expose a hosted ingestion SDK. Treat the following as an application adapter boundary, not as a published Nestarc API:

```typescript
type ReliabilityEvidenceV1 = {
  schemaVersion: 'nestarc.reliability.evidence.v1';
  evidenceId: string;
  occurredAt: string;
  source: {
    service: string;
    environment: string;
    package: 'idempotency' | 'outbox' | 'jobs' | 'webhook';
    packageVersion: string;
  };
  operation: {
    correlationId: string;
    tenantRef?: string; // opaque or pseudonymized; never a tenant name
  };
  subject: {
    kind: 'request' | 'outbox_event' | 'job' | 'webhook_event' | 'webhook_delivery';
    id: string;
  };
  causedBy?: {
    kind: ReliabilityEvidenceV1['subject']['kind'];
    id: string;
  };
  event: { kind: string; state: string };
  attempt?: { current: number; max?: number; nextAt?: string };
  result?: {
    durationMs?: number;
    responseStatus?: number;
    failureKind?: string;
    errorCode?: string;
  };
};
```

Build this envelope from an explicit allowlist. Do not serialize a package callback object and then try to remove sensitive keys.

The TypeScript shape is not the trust boundary. Validate the serialized object with a strict runtime schema before it leaves the application:

| Field family | Runtime constraint |
| --- | --- |
| Evidence, correlation, subject, and causation IDs | Opaque `^[A-Za-z0-9._:-]{1,128}$`; never accept an email, URL, or free-form header |
| Service and environment | Deployment-registry enum, maximum 64 characters |
| Package/version | Exact package enum plus strict semver |
| Subject/event/state | Package-specific enums maintained with the adapter, not callback-provided strings |
| Failure kind/error code | Small stable enums such as `timeout`, `network`, or `receiver_rejected`; map exceptions explicitly and never pass `error.message` |
| Timestamp/duration/attempt/status | ISO timestamp and bounded non-negative integers |

Derive `tenantRef` with a dedicated, rotation-versioned HMAC key or an opaque lookup maintained in the application data plane—for example, `v1:` plus `HMAC-SHA256(evidenceKey, tenantId)` encoded as base64url. Do not reuse a webhook signing key or send the raw tenant ID. Key rotation must preserve the old mapping for the evidence retention horizon if cross-window correlation is required.

| Allowed | Never report |
| --- | --- |
| Opaque outbox/job/webhook IDs | Request, outbox, job, or webhook payload |
| Correlation and typed causation IDs | Raw idempotency key or arbitrary headers/metadata |
| Pseudonymized tenant reference | Tenant name, email, user ID, or other customer identifier |
| Event type, state, attempt, next time | Endpoint URL, resolved IP, signature, secret, token |
| Timestamp, duration, HTTP status | Response body, raw error message/stack/log, SQL |
| Package, version, service, environment | Whole webhook delivery or outbox record objects |

Use these package surfaces to feed a bounded local buffer:

- idempotency `observability.onEvent` for outcome/status only; join a correlation ID from trusted request ALS or an application wrapper
- outbox dispatch/retry/dead-letter hooks once an outbox event ID is available
- jobs `events.onEvent` for enqueue/start/success/failure lifecycle
- webhook delivery callbacks and `workerObserver` for retry, terminal failure, and poll health
- a small `WebhookService` wrapper when the returned webhook event ID must be correlated with the originating outbox event

`OutboxEmitter.emit()` returns `void`, and `onEmit` does not expose the persisted event ID. Use `onEmit` only for an aggregate health counter; create ID-bearing evidence from `onDispatchStart` / `onDispatchSuccess` / `onDispatchFailure`, whose context contains `eventId`. The jobs publisher carries that same value as `jobId`, `context.outboxEventId`, and `metadata.outboxEventId`. Do not invent an outbox subject ID or put a command key in its place.

The idempotency callback also has no correlation or tenant field. Its custom `scope` can contain the raw authenticated tenant and its `error` can contain arbitrary text, so never forward either field. The callback alone cannot join the request to the outbox; attach the trusted request correlation ID in application ALS/wrapper code and emit only the normalized outcome, status, duration, and hashed request subject.

Package hooks can be awaited on transaction or worker paths. Therefore “does not throw” is insufficient: every hook must synchronously validate and enqueue into a bounded local memory/disk buffer, then return without awaiting a remote sink. A dedicated connector drains the buffer with its own timeout and circuit breaker. On overflow, drop evidence, increment a local `evidence_dropped_total` metric, and preserve customer work. Jobs 0.3 isolates lifecycle callback throws/rejections and snapshots callback values, but the callback must still avoid synchronous blocking or unbounded buffering. Evidence reporting must never fail, delay, retry, or mark customer work complete.

For jobs enqueued by v0.3 on BullMQ, context and metadata are persisted in the versioned Redis envelope and restored after restart; lifecycle start/success/failure events repeat that stored metadata. A v0.3 worker can decode a queued v0.2 envelope, but v0.2 did not persist arbitrary job metadata, so those lifecycle events can expose `metadata: undefined`. Keep the deterministic job ID (the outbox event UUID) as the authoritative join key, and allow only explicitly selected metadata fields into the evidence buffer.

Missing evidence also does not prove execution failed. A read-only UI should distinguish "no later evidence observed" from "the local data plane reported a terminal failure" and show connector freshness alongside event time.

## 8. Failure and Recovery Matrix

| Failure window | Automatic behavior | Deterministic guard | Operator boundary |
| --- | --- | --- | --- |
| Request repeated while first is active | HTTP `409` | Tenant-scoped idempotency lease | Inspect request outcome; do not resubmit with a new key |
| Response lost after DB commit | Redis replay, or DB unique fallback after lease loss | `(tenantId, commandKeyHash)` + request fingerprint | Return existing order; mismatch is `422` |
| Order transaction rolls back | No order and no outbox row | Single Prisma transaction | Fix the business error and retry the same command |
| BullMQ enqueue fails | Outbox retries, then `FAILED` when its configured budget is exhausted | Outbox event UUID | Tenant-scoped RBAC operator may request a bounded retry with a reason |
| Redis accepted job, outbox ack was lost | Outbox publisher runs again | BullMQ job ID = outbox event UUID | No manual action if the job exists |
| Webhook publish fails | BullMQ retries with the configured bounded backoff | Same job ID, payload, and context | BullMQ path has no Jobs service-level DLQ helpers; use protected queue operations/runbooks |
| Webhook DB commit succeeded, job ack was lost | Job handler runs again | Webhook publish key = outbox event UUID | Existing event ID is returned; no second fan-out |
| Receiver returns retryable error or times out | Webhook schedules another delivery attempt | Same delivery and signed `webhook-id` | Inspect attempts/backlog and endpoint health |
| Receiver accepted request, delivery ack was lost | Webhook can send again | Receiver unique `webhook-id` | Receiver returns 2xx for an already committed ID |
| Permanent response or attempt budget exhausted | Webhook delivery becomes `FAILED` | Delivery ID and attempt history | Use bounded, tenant-scoped RBAC retry/replay after fixing the cause |
| Reliability evidence sink is unavailable | Local workflow continues | Bounded non-blocking buffer | Restore connector; do not mutate local delivery state from the pilot |

Recovery controls stay in the application environment. Require tenant-scoped RBAC, bounded batch size/rate, an operator reason, and an immutable audit record for every retry, replay, discard, or endpoint-state change; require two-person approval for high-impact cross-tenant actions. The read-only Reliability pilot must not hold queue, database, or webhook credentials and must not expose any of those buttons.

## 9. Verify the Workflow

Test against real PostgreSQL, Redis/BullMQ, and an HTTP receiver before calling the integration production-ready.

### Happy path

1. Register a tenant webhook endpoint subscribed to `order.accepted`.
2. Send `POST /orders` with an authenticated tenant and `Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000`.
3. Assert one order row and one outbox row exist.
4. Wait until the outbox row is `SENT`; assert the BullMQ job ID equals the outbox event UUID.
5. Assert one webhook event exists with the original correlation ID and only that tenant's endpoints received delivery rows.
6. Return `204` from the receiver and assert the delivery is `SENT` with a recorded attempt.

### Duplicate and crash windows

- Repeat the same request and body: the response is replayed and counts remain one.
- Repeat the same key with a different `totalCents`: the request is rejected and no new row/event appears.
- Force the business transaction to roll back: neither the order nor the outbox row exists.
- Publish the same outbox record twice: BullMQ exposes the same job ID and only one job executes.
- Run the job handler twice: webhook event and delivery counts do not increase.
- Crash after a receiver commits but before it returns 2xx: the repeated signed `webhook-id` is ignored by the receiver.

### Retry and tenant isolation

- Configure a receiver to return `503`, `503`, then `204`; verify attempt history ends in `SENT`.
- Return a permanent response and verify the delivery reaches `FAILED` without an unbounded loop.
- Create endpoints for tenants A and B; a tenant A order must never create a tenant B delivery.
- Remove `tenantId` from a required-tenant publisher record and use an unmapped event type; both publishes must reject. Omit `correlationId` and assert that the publisher falls back to the event ID, while an omitted `causationId` remains valid. Separately remove tenant, outbox-event, or correlation context from the job-handler fixture and assert that the handler fails closed.
- Run each process with only its documented database role and assert its positive path succeeds; assert API credentials cannot update outbox status or read webhook attempts/secrets.
- Attempt the same order ID under tenant B and direct cross-tenant reads under tenant A; forced RLS must return only tenant A rows.
- With tenant A set, attempt to insert an outbox row labeled tenant B as `orders_api`; RLS must reject it. Assert `outbox_worker` cannot update `tenant_id`, payload, or identity columns.
- Assert the relay/publisher vault cannot decrypt a signing secret, while the delivery-worker vault can, and verify graceful shutdown closes BullMQ connections.

### Evidence contract

- Validate every evidence object against a strict schema and reject unknown properties.
- Snapshot the outbound evidence and assert it contains no payload, URL, header map, response body, raw error, stack, token, or SQL.
- Make the evidence sink throw, reject, and never resolve; the order, outbox, job, and webhook latency/outcomes must be unchanged.
- Fill the local evidence buffer past capacity; customer work continues and `evidence_dropped_total` increases without leaking the discarded object.
- Join the request, outbox, job, webhook event, and delivery using correlation/causation IDs without inspecting customer payloads.

## Production Checklist

- [ ] Common runtime is Node 20.19+ on Node 20 (or Node 22/24), NestJS 10 or 11, Prisma 6.
- [ ] Database/Redis connections authenticate over verified TLS; credentials come from a secret manager and Redis ACLs are workload-specific.
- [ ] Migrations use a schema-owner URL; API, relay, publisher, delivery, and admin paths use separate restricted roles.
- [ ] `orders` RLS is enabled and forced; both write and fallback read run through `tenancyTransaction()`.
- [ ] `outbox_events` RLS constrains API inserts to the current tenant; cross-tenant worker/maintenance policies use narrow column/verb grants.
- [ ] HTTP idempotency uses shared storage and authenticated tenant scoping.
- [ ] The order command accepts UUIDv4 only and stores a hash under a database unique key plus deterministic request fingerprint.
- [ ] Business data and the outbox event commit in one transaction.
- [ ] Production jobs use BullMQ, not the in-memory backend.
- [ ] Outbox event UUID is reused as the BullMQ job ID and webhook publish key.
- [ ] BullMQ job retention covers the outbox retry and operator-recovery window.
- [ ] The publisher fails closed on a missing required tenant or unmapped event, falls back to the event ID for missing correlation, and treats causation as optional; the job handler fails closed on missing tenant, outbox-event, or correlation context.
- [ ] A 0.2 queue is drained or a temporary payload/context dual-reader remains deployed; the BullMQ namespace is dot-free before cutover.
- [ ] Receivers verify HMAC/timestamp and deduplicate `webhook-id` transactionally with an adequate tombstone lifetime.
- [ ] Webhook secrets use an approved KMS-backed vault; endpoint create/update rejects every non-HTTPS URL; private/internal URLs remain blocked.
- [ ] Webhook payload/response sanitizers are active, retention is bounded, and the maintenance purge is scheduled and audited.
- [ ] The relay shutdown runbook accounts for the Outbox/Jobs hook-order race, alerts on `jobs_backend_closed`, and provides bounded, tenant-authorized, reasoned, and audited recovery.
- [ ] Evidence uses strict value constraints and a bounded non-blocking buffer; sink failure cannot delay or change execution.
- [ ] The Reliability surface is read-only and holds no data-plane credentials.

## Next Steps

- [Outbox installation and current v0.2 contract](/packages/outbox/installation)
- [Jobs context propagation](/packages/jobs/context-propagation)
- [Jobs outbox integration boundary](/packages/jobs/outbox-bridge)
- [Webhook event publishing](/packages/webhook/sending-events)
- [Webhook delivery logs and bounded retry](/packages/webhook/delivery-logs)
- [Webhook operations and data lifecycle](/packages/webhook/operations)

## Upgrading this workflow to September releases

Drain old outbox pollers and apply the installed 0.3 `upgrade-to-current.sql` before restarting this path. Fresh-create SQL is insufficient for existing tables. Schema validation, renewable claims, and stored retry due times are runtime requirements. Handle admin `.outcome` results and use a fixed authorized tenant scope for tenant-facing recovery.

Jobs 0.4 requires BullMQ `^5.76.2`, preserves source IDs across mapping callbacks, and uses tenant dedupe by default when a tenant exists. If you configure terminal cleanup, preserve the complete outbox retry/manual-recovery horizon and stop producers before pruning identities. Portable JSON normalization means nested Date values become ISO strings.

The co-located shutdown limitation documented above still applies to Outbox 0.3 + Jobs 0.4. An explicit producer role enables separate deployment, but its backend must remain open until every publisher callback settles. Webhook 0.13.1 adds Prisma 7 repository support and fixes retention cutoff parameter casts.
