---
title: "Prisma Soft Delete in NestJS: Patterns and Pitfalls"
date: 2026-04-06
description: "Implement Prisma soft delete in NestJS with an extended client, active-row uniqueness, cascade, restore, purge, and atomic lifecycle evidence."
author: nestarc
reviewed: 2026-11-15
versionScope: "@nestarc/soft-delete 0.7.6; audit-log 0.8.0 + tenancy 0.16.4 lifecycle; NestJS 10/11 and PostgreSQL"
---

# Prisma Soft Delete in NestJS: Correct Patterns and Pitfalls

Adding a `deletedAt` column is only the first step. A production implementation must also define active-row uniqueness, keep deleted rows out of reads, route application queries through the extended Prisma client, make cascade, restore, and retention behavior explicit, and distinguish notification events from authoritative audit evidence.

This guide uses `@nestarc/soft-delete` to build that boundary without hiding the database rules it depends on.

::: info Published lifecycle composition
The audit examples use **soft-delete 0.7.6, audit-log 0.8.0, and tenancy 0.16.4**.
This composition requires Node.js `^22.23.4 || ^24.22.1` and shares NestJS 10/11.
Its PostgreSQL lifecycle checks cover Node 22/24 with Prisma 6/7 consumers.
Standalone soft-delete retains Prisma 5/6/7 and its existing Node.js range.
See the [compatibility guide](/packages/soft-delete/installation#compatibility)
and [release verification fixture](https://github.com/nestarc/nestjs-soft-delete/blob/v0.7.6/test/consumer-audit-lifecycle/verify.mjs).
:::

## Problem 1: A Normal Unique Constraint Blocks Reuse

With a global unique constraint, a deleted row still owns its email address:

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  deletedAt DateTime?
}
```

Removing `@unique` and adding `@@unique([email, deletedAt])` is **not** a safe fix. PostgreSQL treats `NULL` values as distinct, so multiple active rows with the same email and `deletedAt = NULL` can satisfy that composite constraint.

For PostgreSQL, keep the fields in the Prisma model and create a partial unique index in a reviewed migration:

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String
  deletedAt DateTime?
}
```

```sql
CREATE UNIQUE INDEX users_email_active_unique
  ON "User" ("email")
  WHERE "deletedAt" IS NULL;
```

This enforces exactly the desired rule: one active row may own an email, while an email from a soft-deleted row can be reused. Remove the previous global unique constraint before adding the partial index, and check existing active rows for duplicates first.

SQLite also supports a partial unique index. MySQL requires a functional or generated-column strategy instead. See [Cascade & Active-Row Uniqueness](/packages/soft-delete/cascade#active-row-unique-constraints) for database-specific DDL.

## Problem 2: The Base Client Bypasses Soft Delete

Manual `deletedAt: null` filters are easy to miss. The package solves that with a Prisma Client Extension, but only queries made through the **extended** client are intercepted.

For Prisma 7, generate the client to an explicit output path and construct the runtime client with a driver adapter. The query-only extension preserves the model API; the factory narrows its schema-independent package type to the generated client:

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';

function createSoftDeleteClient(base: PrismaClient) {
  return base.$extends(createPrismaSoftDeleteExtension({
    softDeleteModels: ['User'],
    deletedAtField: 'deletedAt',
  })) as unknown as Omit<PrismaClient, '$on' | '$use'>;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  readonly client: ReturnType<typeof createSoftDeleteClient>;

  constructor() {
    super({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
    });
    this.client = createSoftDeleteClient(this);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
```

Export both the service and the extended client from a global provider module. A provider declared only in the parent `AppModule.providers` is not visible inside `SoftDeleteModule`:

```typescript
// prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export const EXTENDED_PRISMA = Symbol('EXTENDED_PRISMA');

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: EXTENDED_PRISMA,
      useFactory: (prisma: PrismaService) => prisma.client,
      inject: [PrismaService],
    },
  ],
  exports: [PrismaService, EXTENDED_PRISMA],
})
export class PrismaModule {}
```

Import this module before configuring soft-delete, so queries and restore operations use the same extended client:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { SoftDeleteModule } from '@nestarc/soft-delete';
import { EXTENDED_PRISMA, PrismaModule } from './prisma.module';

@Module({
  imports: [
    PrismaModule,
    SoftDeleteModule.forRoot({
      softDeleteModels: ['User'],
      deletedAtField: 'deletedAt',
      prismaServiceToken: EXTENDED_PRISMA,
    }),
  ],
})
export class AppModule {}
```

Application code must use `prisma.client`:

```typescript
// Soft delete: the extension rewrites delete() to an update.
await prisma.client.user.delete({ where: { id: userId } });

// Active-only read: the extension adds the deletedAt filter.
const users = await prisma.client.user.findMany();
```

Direct calls such as `prisma.user.delete()` use the base client and remain hard deletes. Likewise, `prisma.user.findMany()` does not receive the automatic active-row filter. Keep the base client out of normal application repositories and services.

When an authorized recovery endpoint needs a different read mode, decorators change the request-scoped behavior of the extended client:

```typescript
@OnlyDeleted()
@Get('trash')
listDeletedUsers() {
  return this.prisma.client.user.findMany();
}

@WithDeleted()
@Get('all')
listAllUsers() {
  return this.prisma.client.user.findMany();
}
```

## Problem 3: Cascade Needs Schema Metadata

If deleting a `User` should also soft-delete related `Post` and `Comment` rows, configure cascade on both the Prisma extension and the Nest module. Cascade relation lookup requires full Prisma DMMF metadata on Prisma 5, 6, and 7.

Pin `@prisma/internals` to the exact version of `prisma`. Load and export the schema metadata once, copying the read-only Prisma arrays into the shape accepted by soft-delete. Use the [`prisma.dmmf.ts` example](/packages/soft-delete/installation#dmmf-for-cascade-and-relation-filters).

```typescript
// soft-delete.config.ts
export { prismaDmmf } from './prisma.dmmf';
export const softDeleteCascade = {
  User: ['Post'],
  Post: ['Comment'],
};
```

Add the `Post` and `Comment` models with their relations and deletion fields to your schema before expanding the factory:

```typescript
// Replace the factory from Problem 2; import these shared values.
import { prismaDmmf, softDeleteCascade } from './soft-delete.config';

function createSoftDeleteClient(base: PrismaClient) {
  return base.$extends(createPrismaSoftDeleteExtension({
    softDeleteModels: ['User', 'Post', 'Comment'],
    cascade: softDeleteCascade,
    maxCascadeDepth: 3,
    dmmf: prismaDmmf,
  })) as unknown as Omit<PrismaClient, '$on' | '$use'>;
}
```

```typescript
// In AppModule, keep PrismaModule imported and use its exported client token.
SoftDeleteModule.forRoot({
  softDeleteModels: ['User', 'Post', 'Comment'],
  cascade: softDeleteCascade,
  maxCascadeDepth: 3,
  dmmf: prismaDmmf,
  prismaServiceToken: EXTENDED_PRISMA,
});
```

The package fails early with `CascadeDmmfMissingError` when cascade is configured without metadata. Keep `@prisma/internals` version-pinned because it does not provide a semantic-versioning guarantee, and cover metadata loading with a startup or integration test.

## Problem 4: Lifecycle Events Are Not Audit Evidence

`SoftDeletedEvent`, `RestoredEvent`, and `PurgedEvent` are useful for metrics, cache invalidation,
and notifications. They are notification-only: a listener can run before an outer transaction
commits, and event delivery is not a durable proof that the mutation committed.

For authoritative lifecycle evidence, soft-delete 0.7.6 adds audit-log 0.8 to its optional peer range while retaining the existing atomic capability handshake and older supported lines. Install the published composition with strict peer validation:

```bash
npm install --save-exact --strict-peer-deps @nestarc/soft-delete@0.7.6 @nestarc/audit-log@0.8.0 @nestarc/tenancy@0.16.4
```

Derive a dedicated lifecycle client from the base client with **audit-log → soft-delete**. Keep the per-query tenancy extension on a separate client for ordinary queries. Pass `tenancyTransactionCallback()` to audit-log's transaction owner so the tenant is bound on the same PostgreSQL connection as the lifecycle mutation.

```typescript
// lifecycle-client.ts
import { Prisma, PrismaClient } from './generated/prisma/client';
import { createAuditExtension, type AuditTransactionMethods } from '@nestarc/audit-log';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';
import { tenancyTransactionCallback, TenancyService } from '@nestarc/tenancy';
import { prismaDmmf, softDeleteCascade } from './soft-delete.config';

export const lifecycleOptions = {
  softDeleteModels: ['User', 'Post', 'Comment'],
  cascade: softDeleteCascade,
  dmmf: prismaDmmf,
  auditLifecycle: 'atomic-required' as const,
  auditMaxBatchRecords: 1000,
};

export function createLifecycleClient(
  base: PrismaClient,
  tenancyService: TenancyService,
) {
  const client = base
    .$extends(createAuditExtension({
      consistency: 'atomic-required',
      trackedModels: lifecycleOptions.softDeleteModels,
      tenantRequired: true,
      tenantResolver: () => tenancyService.getCurrentTenantOrThrow(),
      maxBatchRecords: lifecycleOptions.auditMaxBatchRecords,
      databaseMapping: {
        User: { tableName: 'User' },
        Post: { tableName: 'Post' },
        Comment: { tableName: 'Comment' },
      },
      prismaModule: { Prisma },
    }))
    .$extends(createPrismaSoftDeleteExtension(lifecycleOptions));

  // Soft-delete preserves the runtime capability. Narrow to the method used here.
  const owner = client as unknown as Pick<
    AuditTransactionMethods<Prisma.TransactionClient>, 'withAuditTransaction'
  >;
  function transact<T>(work: (tx: Prisma.TransactionClient) => Promise<T>) {
    return owner.withAuditTransaction(
      tenancyTransactionCallback(tenancyService, work),
    );
  }
  return { client, transact };
}
```

Replace the basic `PrismaService` from Problem 2 with this lifecycle owner. The imported tenancy module must export the configured `TenancyService` to this provider:

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { TenancyService } from '@nestarc/tenancy';
import { Prisma, PrismaClient } from './generated/prisma/client';
import { createLifecycleClient } from './lifecycle-client';

@Injectable()
export class PrismaService implements OnModuleInit {
  readonly base = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });
  readonly lifecycle: ReturnType<typeof createLifecycleClient>;

  constructor(tenancyService: TenancyService) {
    this.lifecycle = createLifecycleClient(this.base, tenancyService);
  }

  get client() {
    return this.lifecycle.client;
  }

  transact<T>(work: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.lifecycle.transact(work);
  }

  async onModuleInit() {
    await this.base.$connect();
  }
}
```

The `EXTENDED_PRISMA` factory from Problem 2 now exports this exact lifecycle client. Keep `PrismaModule` imported and replace the soft-delete registration with the same lifecycle options:

```typescript
import { lifecycleOptions } from './lifecycle-client';

SoftDeleteModule.forRoot({
  ...lifecycleOptions,
  prismaServiceToken: EXTENDED_PRISMA,
});
```

Resolve and authorize the tenant before calling `transact`; configure audit-log's actor context separately. Add tenant fields to every tenant-scoped model, including cascade children, and install RLS policies on both business and audit tables with a restricted application role. The callback binds the tenant; it does not create policies or populate tenant fields on inserts. Use the supplied `tx` for business queries and keep the tenant unchanged throughout the transaction.

Add every cascade child to audit-log's `trackedModels` and `databaseMapping`, using the actual table names. Then keep root, cascade, service, and bulk lifecycle operations inside the wrapper:

```typescript
// Inside an authorized tenant context; root soft-delete and its cascades.
await prisma.transact((tx) =>
  tx.user.delete({ where: { id: userId } }),
);

// SoftDeleteService uses EXTENDED_PRISMA and joins the same transaction.
await prisma.transact(() =>
  softDelete.restore('User', { id: userId }),
);

await prisma.transact(() =>
  softDelete.restoreMany('User', { where: { organizationId } }),
);

await prisma.transact(() =>
  softDelete.purge('User', { olderThan: cutoff, where: { organizationId } }),
);
```

The [PostgreSQL release fixture](https://github.com/nestarc/nestjs-soft-delete/blob/v0.7.6/test/consumer-audit-lifecycle/verify.mjs) verifies concurrent tenant isolation under FORCE RLS, restore and permanent deletion, and rollback after user or audit-insert failures. See the [full NestJS integration guide](/guide/prisma-extension-chaining) for tenancy registration and provider wiring.

The business rows and deterministic record actions (`Model.softDeleted`, `Model.restored`, and
`Model.purged`) commit or roll back together. Calls outside the helper, an incorrect extension
order, a best-effort audit client, or a different injected client fail before mutation.
`auditMaxBatchRecords` bounds record-level `deleteMany` and `restoreMany` conversion; align it with
audit-log's independent `maxBatchRecords` limit.

## Restore Through `SoftDeleteService`

`restore()` clears the deletion fields and restores timestamp-matched descendants when cascade is configured:

```typescript
@Post(':id/restore')
restore(@Param('id') id: string) {
  return this.prisma.transact(() =>
    this.softDelete.restore('User', { id: +id }),
  );
}
```

For a bounded bulk restore, use `restoreMany()`:

```typescript
const result = await this.prisma.transact(() =>
  this.softDelete.restoreMany('User', {
    where: { organizationId, role: 'GUEST' },
  }),
);
```

These wrappers are required when `auditLifecycle: 'atomic-required'` is enabled. Restoring an active
value can conflict with the partial unique index if another active row has claimed it. Treat restore
as an authorized workflow and handle that conflict explicitly.

## Purge Only Rows Older Than the Retention Cutoff

`purge()` permanently deletes soft-deleted rows. Its current argument shape requires `olderThan`; an optional `where` can narrow the operation further:

```typescript
const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

const result = await this.prisma.transact(() =>
  this.softDelete.purge('User', {
    olderThan: cutoff,
    where: { organizationId },
  }),
);

console.log(`Purged ${result.count} users`);
```

Run purge from a restricted administrative or scheduled workflow, bound optional filters carefully, and test cascade and retention behavior on production-like data before enabling it.

## Implementation Checklist

- Use a database-specific active-row unique index; do not use `@@unique([email, deletedAt])`.
- Send all normal application reads and writes through the extended client.
- Keep base-client hard deletes limited to deliberate administrative paths.
- Pass the same explicit DMMF and cascade map to the extension and Nest module.
- For authoritative evidence, inject the lifecycle client into `SoftDeleteModule` and use the [transaction setup for your package versions](/guide/prisma-extension-chaining).
- Keep `auditMaxBatchRecords` aligned with audit-log's `maxBatchRecords` and test cap overflow.
- Treat lifecycle events as notification-only.
- Test delete filtering, cascade, restore conflicts, and retention-based purge.

## Next Steps

- [Installation](/packages/soft-delete/installation) — complete Prisma 7 and module setup
- [Cascade & Active-Row Uniqueness](/packages/soft-delete/cascade) — metadata and database-specific indexes
- [Restore, Force Delete & Purge](/packages/soft-delete/restore-purge) — current recovery and deletion APIs
- [Decorators](/packages/soft-delete/decorators) — request-scoped query modes
- [PostgreSQL partial indexes](https://www.postgresql.org/docs/current/indexes-partial.html) — authoritative active-row uniqueness building block
- [Prisma Client extensions](https://www.prisma.io/docs/orm/prisma-client/client-extensions) — official extension model
