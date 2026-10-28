---
title: "Install with NestJS and Prisma 7"
description: "Install Inbox 0.2.0, apply PostgreSQL schema v2, register a typed Prisma handler, and acknowledge incoming messages after durable acceptance."
---

# Install Inbox with NestJS and Prisma

This quickstart targets an existing NestJS 11 application with Prisma 7 and PostgreSQL. It follows the [0.2.0 release README](https://github.com/nestarc/inbox/blob/v0.2.0/README.md). Your application owns its Prisma client, migrations, transport, authentication, and shutdown lifecycle.

## 1. Install the package

```bash
npm install @nestarc/inbox@0.2.0
npm install @prisma/adapter-pg@7.10.1
```

The required peers are `@nestjs/common ^11.2.8`, `@nestjs/core ^11.2.8`, `@prisma/client ^7.10.1`, `reflect-metadata ^0.2.2`, and `rxjs ^7.8.2`. Keep the Prisma CLI, client, and driver adapter on matching versions; this example uses 7.10.1. Follow [Prisma 7 setup](/guide/prisma-7) for the generated client and PostgreSQL adapter.

Inbox declares Node.js `>=22.12.0`. Use Node **22.23.4+ on the 22 branch or 24.22.1+ on the 24 branch** to match the full validation and optional [tenancy integration](./operations#tenant-context-and-postgresql-rls). `@nestarc/tenancy` is optional and is not required by this quickstart.

## 2. Apply PostgreSQL schema v2

Find the installation SQL shipped in the npm package:

```bash
node -p "require.resolve('@nestarc/inbox/sql/create-inbox-table.sql')"
```

Add this SQL to your application's migration history and apply it before starting Inbox. Runtime initialization checks the schema and never creates or upgrades tables. Preserve the Inbox SQL tables when generating Prisma migrations or synchronizing your application schema.

For the handler below, also add this application model, generate the Prisma client, and apply its migration:

```prisma
model OrderProjection {
  tenantId String @map("tenant_id")
  orderId  String @map("order_id")

  @@id([tenantId, orderId])
  @@map("order_projections")
}
```

The composite primary key protects the business identity if two different event IDs refer to the same order. That constraint violation is a handler failure to resolve, not an Inbox duplicate.

### Upgrade from 0.1.0

Version 0.2.0 keeps SQL schema v2 and the existing acceptance and processing contracts. Update the npm dependency; existing 0.1.0 installations need no schema migration. The new [testing helpers](./testing) are available from the separate `@nestarc/inbox/testing` import path.

### Upgrade a local schema v1 installation

Preview.0 and Preview.1 were local development baselines, not published npm releases. If a local build created schema v1, stop all of its processes and apply the packaged upgrade through your migration process:

```bash
node -p "require.resolve('@nestarc/inbox/sql/migrate-v1-to-v2.sql')"
```

The transactional upgrade takes an exclusive table lock and preserves receipts, fingerprints, state, attempts, and claim tokens. Deploy 0.2.0 afterward and keep v1 workers stopped. Fresh installations use the creation SQL; local Preview.1 already uses v2 and needs no additional schema change. See the [release migration instructions](https://github.com/nestarc/inbox/blob/v0.2.0/CHANGELOG.md#upgrade-action-schema-version-2).

## 3. Register a handler and ingress service

Create `src/orders.module.ts`. Adjust the generated-client import to your Prisma output directory. The sample creates one application-owned client; reuse your existing client if your application already provides one.

```typescript
import 'reflect-metadata';
import { Injectable, Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  InboxModule,
  InboxPermanentError,
  InboxService,
  type InboxHandler,
} from '@nestarc/inbox';
import { PrismaClient, type Prisma } from './generated/prisma/client';

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const orderCreated: InboxHandler<
  { orderId: string },
  Prisma.TransactionClient
> = {
  consumer: 'orders.projection.v1',
  eventType: 'order.created',
  schemaVersion: 1,
  validate(payload) {
    return (
      !!payload &&
      typeof payload === 'object' &&
      !Array.isArray(payload) &&
      typeof payload.orderId === 'string' &&
      payload.orderId.length > 0
    );
  },
  async handle(payload, context) {
    if (context.scope.kind !== 'tenant') throw new InboxPermanentError();
    await context.tx.orderProjection.create({
      data: { tenantId: context.scope.id, orderId: payload.orderId },
    });
  },
};

@Injectable()
export class OrdersIngress {
  constructor(private readonly inbox: InboxService) {}

  receive(verifiedTenantId: string, event: { id: string; orderId: string }) {
    return this.inbox.accept({
      scope: { kind: 'tenant', id: verifiedTenantId },
      source: 'orders-service',
      consumer: 'orders.projection.v1',
      messageId: event.id,
      eventType: 'order.created',
      schemaVersion: 1,
      payload: { orderId: event.orderId },
    });
  }
}

@Module({
  imports: [
    InboxModule.forRoot({
      prisma,
      handlers: [orderCreated],
      worker: { enabled: true },
    }),
  ],
  providers: [OrdersIngress],
  exports: [OrdersIngress],
})
export class OrdersModule {}
```

Import `OrdersModule` into your application module. Inject `OrdersIngress` into the application's transport consumer, derive `verifiedTenantId` from authenticated routing or credentials, and preserve the producer's `event.id` across redeliveries. `schemaVersion: 1` is the application's event schema version; the Inbox database schema is v2.

For dependency injection, use `InboxModule.forRootAsync({ imports, inject, useFactory })`. Import modules that export your Prisma provider and handler dependencies, then return the resolved Prisma instance and handlers from the factory. Construct handlers inside that factory when they depend on injected services. See the [versioned async registration guide](https://github.com/nestarc/inbox/blob/v0.2.0/docs/usage.md#register-a-consumer).

## 4. Acknowledge after acceptance

With an application-owned RabbitMQ consumer, the boundary is:

```typescript
await ordersIngress.receive(verifiedTenantId, event);
channel.ack(message);
```

Both `accepted` and `duplicate` receipts permit acknowledgment because the receipt already exists durably. They do not imply that the handler completed. If acceptance throws or its commit result is uncertain, do not ACK; redeliver the same identity. Reject or dead-letter authentication failures, malformed input, and identity conflicts according to your transport policy.

Inbox does not connect to a broker or send acknowledgments. Follow the [complete transport examples](https://github.com/nestarc/inbox/blob/v0.2.0/examples/README.md) and the [processing contract](./processing) when implementing that boundary.

## 5. Enable shutdown and verify progress

The worker is disabled by default; this quickstart enables it explicitly. Its default poll interval is 1,000 ms, so acceptance does not wait for a handler invocation. An authorized operator can inspect processing with `InboxAdminService.forTenant(id).get(receipt.id)` or `stats()`; see [scoped administration](./operations#inspect-and-requeue-dead-messages).

Enable Nest shutdown hooks in the application's bootstrap:

```typescript
app.enableShutdownHooks();
```

Close the Nest application before disconnecting its Prisma client. Inbox stops new claims and drains active work within its configured shutdown limit; it does not own or disconnect the Prisma pool.

To evaluate the upstream package in a disposable local environment, use a checkout of [v0.2.0](https://github.com/nestarc/inbox/tree/v0.2.0), a compatible Node version, and Docker:

```bash
npm ci
npm run test:package
npm run test:examples
```

Run those commands in the Inbox repository, not in your application. They build an installed tarball consumer and exercise temporary databases and integration fixtures. Continue with [processing boundaries](./processing), [worker operations](./operations), [application-handler tests](./testing), or the [API reference](/api/inbox/).
