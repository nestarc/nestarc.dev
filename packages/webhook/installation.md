---
description: "Install @nestarc/webhook with Prisma 7 and PostgreSQL, register a NestJS module and endpoint, then publish and inspect the first webhook delivery."
---

# Installation

This walkthrough targets an existing **NestJS 11 CommonJS application** using **Prisma 7** and published `@nestarc/webhook@0.13.1`. It takes you from a database connection to a registered receiver and a recorded delivery. For a complete local sender/receiver application, see the [source example](https://github.com/nestarc/webhook/tree/main/examples/quick-start); source `main` is now 0.13.2, pending npm publication, so follow its version notes before using it with npm 0.13.1.

## 1. Check requirements and install

- NestJS 10/11 and `@nestjs/schedule` 4/5 are supported by the package. This walkthrough uses NestJS 11 and schedule 5.
- Use Node.js `^20.19.0`, `^22.12.0`, or `>=24.0.0` for Prisma 7, within the range supported by your application dependencies.
- Use an available PostgreSQL database and `psql`. The SQL uses PostgreSQL 9.5+ features; use a supported PostgreSQL release in production.
- Prisma 5/6 applications may retain their existing generated client; the adapter setup below is specific to Prisma 7.

```bash
node --version
npm ls @nestjs/common @nestjs/core
npm install --save-exact @nestarc/webhook@0.13.1 @nestjs/schedule@5.0.1 @prisma/client@7.10.0 @prisma/adapter-pg@7.10.0 pg@8.23.0 dotenv
npm install --save-dev --save-exact prisma@7.10.0 @types/pg
```

The package is pre-1.0; keep exact versions and review release notes before upgrading. Use matching versions of Prisma CLI, client, and adapter. The PostgreSQL adapter and `pg` are required by this Prisma 7 setup.

Set a connection string accessible to both the Prisma CLI and the running application:

```bash
export DATABASE_URL='postgresql://app_user:change-me@localhost:5432/app'
```

Use your own credentials. An application `.env` file is another option when loaded with `dotenv/config`; do not commit it.

## 2. Generate the Prisma client

Webhook tables are managed by the package's SQL, so no webhook models are needed in `schema.prisma`:

```prisma
// prisma/schema.prisma
generator client {
  provider     = "prisma-client"
  output       = "../src/generated/prisma"
  moduleFormat = "cjs"
}

datasource db {
  provider = "postgresql"
}
```

`moduleFormat = "cjs"` matches this CommonJS Nest application. An ESM application should generate a matching ESM client instead. Keep any existing application models in the schema.

```typescript
// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: { url: env('DATABASE_URL') },
});
```

```bash
npx prisma generate
```

Create and export a client provider with connection lifecycle hooks:

```typescript
// src/prisma.module.ts
import 'dotenv/config';
import { Injectable, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL is required');
    super({ adapter: new PrismaPg({ connectionString }) });
  }

  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}

@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}
```

## 3. Apply the webhook SQL

For a new webhook installation:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f node_modules/@nestarc/webhook/src/sql/create-webhook-tables.sql
```

This creates `webhook_endpoints`, `webhook_events`, `webhook_deliveries`, and `webhook_delivery_attempts` with indexes. The SQL is idempotent and includes `CREATE EXTENSION IF NOT EXISTS pgcrypto` for PostgreSQL versions before 13. Use a migration connection permitted to create the required objects. Keep webhook table definitions out of Prisma-generated application migrations.

### Upgrade an existing database

Apply the additive migrations missing from the installation, in version order. A fresh database created using the current full SQL already includes these changes:

```bash
# Existing installations from before 0.9: attempt logs and endpoint/key snapshots
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f node_modules/@nestarc/webhook/src/sql/migrations/v0.9.0.sql
# Existing installations from before 0.12: query indexes
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f node_modules/@nestarc/webhook/src/sql/migrations/v0.12.0.sql
# Existing installations from before 0.13: idempotency, correlation, payload purge
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f node_modules/@nestarc/webhook/src/sql/migrations/v0.13.0.sql
```

## 4. Register the module

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { WebhookModule } from '@nestarc/webhook';
import { PrismaModule, PrismaService } from './prisma.module';

@Module({
  imports: [
    WebhookModule.forRootAsync({
      imports: [PrismaModule],
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        prisma,
        delivery: { timeout: 10_000, maxRetries: 5, jitter: true },
        polling: { interval: 5_000, batchSize: 50 },
      }),
    }),
  ],
})
export class AppModule {}
```

The webhook module registers scheduling. Polling starts in this process unless `polling.enabled` is `false`; register it once per application. Call `app.enableShutdownHooks()` in the application's bootstrap so in-flight work can drain on shutdown. [Operations](./operations#separate-api-and-worker-processes) explains separate workers.

Start the application in an async bootstrap. Put the service lookups and awaited calls from steps 5 and 6 inside this function after `app.listen()`, and keep their imports at the top of the file:

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(3000);

  // Run the one-time setup and smoke-test calls in steps 5 and 6 here.
  // Provision the receiver's secret before publishing its first event.
}

void bootstrap();
```

Run your existing application's build and start scripts (`npm run build` and `npm run start:dev` in a standard Nest project). The bootstrap setup below is for an initial smoke test: in a product, endpoint registration belongs in a protected management workflow and should not run on every application restart.

## 5. Register the receiver before publishing

Obtain the public services from your Nest application context or inject them into an application service. `receiverUrl` below must be an HTTPS endpoint you control that can receive the event:

```typescript
import {
  WebhookEndpointAdminService,
  WebhookService,
  WebhookDeliveryAdminService,
} from '@nestarc/webhook';

const endpointAdmin = app.get(WebhookEndpointAdminService);
const webhooks = app.get(WebhookService);
const deliveryAdmin = app.get(WebhookDeliveryAdminService);

const receiverUrl = process.env.WEBHOOK_RECEIVER_URL;
if (!receiverUrl || new URL(receiverUrl).protocol !== 'https:') {
  throw new Error('WEBHOOK_RECEIVER_URL must be your HTTPS receiver');
}
const endpoint = await endpointAdmin.createEndpoint({
  url: receiverUrl,
  events: ['order.created'],
  tenantId: 'tenant_demo',
  secret: 'auto',
});
```

Securely provision `endpoint.secret` to the receiver before publishing; read APIs do not return it again. The receiver must validate the signature against the raw body and persistently deduplicate `webhook-id`. [Security](./security) describes both checks. A loopback-only local example can opt into `allowPrivateUrls: true`; leave that development override out of production.

## 6. Publish, then inspect the HTTP result

```typescript
import { WebhookEvent } from '@nestarc/webhook';

class OrderCreatedEvent extends WebhookEvent {
  static readonly eventType = 'order.created';
  constructor(public readonly orderId: string, public readonly total: number) {
    super();
  }
}

const eventId = await webhooks.sendToTenant(
  'tenant_demo',
  new OrderCreatedEvent('order_demo', 99.99),
  { idempotencyKey: 'order_demo:created', correlationId: 'request_demo' },
);
```

`eventId` confirms persistence, not successful receipt. After the worker polls, inspect the delivery and receiver:

```typescript
const logs = await deliveryAdmin.getDeliveryLogs(endpoint.id, { limit: 20 });
const delivery = logs.find((row) => row.eventId === eventId);
if (delivery) {
  const attempts = await deliveryAdmin.getDeliveryAttempts(delivery.id);
  console.log({ status: delivery.status, responseStatus: delivery.responseStatus, attempts });
}
```

Expected success is `SENT`, a 2xx receiver response, and one processed receiver event. A temporarily empty result or `PENDING` means polling may not have occurred yet. Inspect `lastError` and [retry classification](./retry-circuit-breaker#retryability-classification) for failures.

`sendToTenant()` limits matching to one tenant. `send()` reaches matching endpoints across all tenants. Publishing before any endpoint matches stores an event with no deliveries; a later registration does not automatically backfill it. Reusing the same idempotency key returns the original event without new deliveries.

## Module options

| Option | Default | Meaning |
| --- | --- | --- |
| `prisma` | Required for default repositories | Generated Prisma client instance |
| `delivery.timeout` | `10000` | HTTP timeout in milliseconds |
| `delivery.maxRetries` | `5` | Total attempts including the initial request |
| `delivery.jitter` | `true` | Add ±10% jitter to fixed retry delays |
| `circuitBreaker.failureThreshold` | `5` | Consecutive failures before deactivation |
| `circuitBreaker.degradedThreshold` | Omitted | Optional earlier notification threshold |
| `circuitBreaker.cooldownMinutes` | `60` | Time before automatic recovery |
| `polling.enabled` | `true` | Enable this process's background worker |
| `polling.interval` | `5000` | Poll interval in milliseconds |
| `polling.batchSize` | `50` | Rows per claim |
| `polling.maxConcurrency` | `batchSize` | In-flight requests per process |
| `polling.staleSendingMinutes` | `5` | Lease age before recovering a `SENDING` row |
| `polling.drainWhileBacklogged` | `false` | Continue bounded claims within a poll |
| `allowPrivateUrls` | `false` | Development-only private-address override |
| `workerObserver` | Omitted | Best-effort worker callbacks |
| `retention` / `redaction` | Omitted | Data lifecycle configuration; purge scheduling is application-owned |

The fixed delays are 30 seconds, 5 minutes, 30 minutes, 2 hours, then 24 hours. With the default five total attempts only four retries are available. `delivery.backoff` is deprecated. See [Operations](./operations) and [API Reference](/api/webhook/) for full options.

## Prisma 7 and the 0.13.1 patch

Webhook 0.13.1 fixes retention SQL cutoff casts for Prisma 7. There is no additional schema migration from an already migrated 0.13.0 database. Earlier installations still need the migrations above. See [release notes](https://github.com/nestarc/webhook/blob/v0.13.1/CHANGELOG.md) and [published limitations](./agent-guide#published-0-13-1-limitations), including correlation ID persistence and replay attempt counts.
