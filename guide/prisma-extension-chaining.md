---
title: "Prisma Client Extension Chaining for NestJS"
description: "Chain tenancy, audit-log, and soft-delete Prisma Client Extensions in the correct order for one production NestJS PrismaService."
---

# Prisma Client Extension Chaining for NestJS

Combine `@nestarc/tenancy`, `@nestarc/audit-log`, and `@nestarc/soft-delete` in a single `PrismaService` using Prisma Client Extensions. This guide explains how the extensions compose, why their order matters, and how to wire everything together.

The examples use the supported audit lifecycle tuple: `@nestarc/audit-log` 0.5.0 with `@nestarc/soft-delete` 0.7.1, Prisma 7 generated-client output, and the PostgreSQL driver adapter. Complete [Prisma 7 Setup](/guide/prisma-7) first. If you stay on Prisma 6, keep your existing client construction while preserving the extension order below. Applications that include audit-log need Node.js 22.13+ within the 22.x line or Node.js 24.x. Audit-log itself accepts NestJS 10, 11, and 12.0.1+, but the full tenancy/audit/soft-delete chain currently shares NestJS 10/11.

For the individual extension boundaries, start with the [Prisma soft-delete implementation guide](/blog/prisma-soft-delete-done-right) and the [NestJS audit-log code example](/blog/nestjs-audit-log-without-refactoring).

## Overview

Prisma Client Extensions use `$extends()` to wrap the client with additional behavior. Each call returns a new client that layers on top of the previous one:

```typescript
const extended = basePrisma
  .$extends(extensionA)
  .$extends(extensionB)
  .$extends(extensionC);
```

When you call `extended.user.findMany()`, Prisma executes query callbacks in registration order. Each callback must call its `query()` continuation for the next registered callback to run. This means:

- **Extension A** intercepts the query first
- **Extension B** intercepts next if A delegates
- **Extension C** intercepts last if both earlier callbacks delegate

An extension can also expose capabilities to extensions registered after it. Soft-delete 0.7.1 uses that composition boundary to join audit-log's ambient transaction and write record-level lifecycle evidence atomically.

## Recommended Order

```typescript
const prisma = basePrisma
  .$extends(createPrismaTenancyExtension(tenancyService, {  // 1st callback
    interactiveTransactionSupport: true,
    failClosed: true,
  }))
  .$extends(createAuditExtension({                           // 2nd callback
    consistency: 'atomic-required',
    ...
  }))
  .$extends(createPrismaSoftDeleteExtension({                // 3rd callback
    auditLifecycle: 'atomic-required',
    ...
  }));
```

### Why this order

| Position | Extension | Reason |
|----------|-----------|--------|
| 1st | `createPrismaTenancyExtension` | Reads the caller-established tenant context and applies tenant/RLS behavior before either data-safety extension runs. |
| 2nd | `createAuditExtension` | Provides `withAuditTransaction()`, the atomic lifecycle capability handshake, row locking, and record-level audit writes. |
| 3rd | `createPrismaSoftDeleteExtension` | Rewrites lifecycle operations and calls the audit capability exposed by the already-composed audit client. |

::: warning Atomic lifecycle contract
Set `consistency: 'atomic-required'` on audit-log and `auditLifecycle: 'atomic-required'` on
soft-delete. Run soft-delete, restore, purge, and cascade work inside `withAuditTransaction()`.
The bridge fails before mutation when the order, capability, consistency mode, or transaction
boundary is wrong.

Keep audit-log's `trackedModels` aligned with every soft-delete model and cascade child. Keep
`maxBatchRecords` equal to soft-delete's `auditMaxBatchRecords`, and configure the exact deployed
`databaseMapping`, primary-key metadata, and DMMF required by those models. The two packages apply
their batch caps independently, so a mismatch is not a supported lifecycle configuration.
:::

Explicit audit-log `best-effort` remains an intentionally non-atomic compatibility mode and cannot power the atomic soft-delete lifecycle bridge. A business rollback can leave orphan success rows, and transaction-local diffs can be stale. Use it only when those semantics are acceptable; it is outside the supported authoritative lifecycle claim.

## PrismaService Example

A complete `PrismaService` that chains all three extensions:

```typescript
// prisma.service.ts
import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from './generated/prisma/client';
import { TenancyService, createPrismaTenancyExtension } from '@nestarc/tenancy';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';
import { createAuditExtension } from '@nestarc/audit-log';
import { prismaDmmf } from './prisma.dmmf';

export const prismaModule = { Prisma };
export const lifecycleModels = ['User', 'Post', 'Comment'];
export const lifecycleBatchCap = 1000;
export const lifecycleCascade = { User: ['Post'], Post: ['Comment'] };
export const lifecycleDatabaseMapping = {
  User: { tableName: 'users' },
  Post: { tableName: 'posts' },
  Comment: { tableName: 'comments' },
};

@Injectable()
export class PrismaService implements OnModuleInit {
  /** Base client — used by AuditLogModule for writing/querying audit records */
  readonly base = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

  /** Extended client — use this for all application queries */
  readonly client;

  constructor(private readonly tenancyService: TenancyService) {
    this.client = this.base
      .$extends(
        createPrismaTenancyExtension(tenancyService, {
          autoInjectTenantId: true,
          tenantIdField: 'tenantId',
          sharedModels: ['Country', 'Currency'],
          interactiveTransactionSupport: true,
          failClosed: true,
        }),
      )
      .$extends(
        createAuditExtension({
          consistency: 'atomic-required',
          trackedModels: lifecycleModels,
          sensitiveFields: ['password', 'ssn'],
          maxBatchRecords: lifecycleBatchCap,
          databaseMapping: lifecycleDatabaseMapping,
          prismaModule,
        }),
      )
      .$extends(
        createPrismaSoftDeleteExtension({
          softDeleteModels: lifecycleModels,
          deletedAtField: 'deletedAt',
          deletedByField: 'deletedBy',
          auditLifecycle: 'atomic-required',
          auditMaxBatchRecords: lifecycleBatchCap,
          cascade: lifecycleCascade,
          dmmf: prismaDmmf,
        }),
      );
  }

  async onModuleInit() {
    await this.base.$connect();
  }
}
```

`prismaDmmf` is application-owned metadata loaded from `prisma/schema.prisma` with a matching `@prisma/internals` version. See [soft-delete DMMF setup](/packages/soft-delete/installation#dmmf-for-cascade-and-relation-filters). The shared constants make the supported contract visible: all soft-delete and cascade models are tracked, both batch caps are 1000, and the audit mapping names the deployed tables. If a model uses a custom primary key, also align audit-log's `primaryKey` and `databaseMapping.primaryKeyColumn` with its DMMF primary key. An incorrect or incomplete mapping fails closed before mutation.

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
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => prisma.client,
    },
  ],
  exports: [PrismaService, EXTENDED_PRISMA],
})
export class PrismaModule {}
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TenancyModule } from '@nestarc/tenancy';
import { SoftDeleteModule } from '@nestarc/soft-delete';
import { AuditLogModule } from '@nestarc/audit-log';
import { EXTENDED_PRISMA, PrismaModule } from './prisma.module';
import {
  lifecycleBatchCap,
  lifecycleCascade,
  lifecycleModels,
  PrismaService,
  prismaModule,
} from './prisma.service';
import { prismaDmmf } from './prisma.dmmf';

@Module({
  imports: [
    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id',
    }),

    SoftDeleteModule.forRoot({
      softDeleteModels: lifecycleModels,
      deletedAtField: 'deletedAt',
      deletedByField: 'deletedBy',
      actorExtractor: (req) => req.user?.id ?? null,
      auditLifecycle: 'atomic-required',
      auditMaxBatchRecords: lifecycleBatchCap,
      cascade: lifecycleCascade,
      dmmf: prismaDmmf,
      prismaServiceToken: EXTENDED_PRISMA,
    }),

    AuditLogModule.forRootAsync({
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        prisma: prisma.base,
        prismaModule,
        actorExtractor: (req) => ({
          id: req.user?.id ?? null,
          type: req.user ? 'user' : 'system',
          ip: req.ip,
        }),
      }),
    }),

    PrismaModule,
  ],
})
export class AppModule {}
```

::: tip Base vs extended client
`AuditLogModule` receives `prisma.base` (the un-extended `PrismaClient`) for its internal storage. Your application code always uses `prisma.client` (the fully extended client). This separation prevents audit writes from recursively triggering more audit writes.

`SoftDeleteModule` receives the `EXTENDED_PRISMA` alias rather than the wrapper
`PrismaService`. `SoftDeleteService` looks up model delegates directly (for
example, `prisma.user`) for restore, purge, and cascade operations, so its token
must resolve to `prisma.client`, not an object that merely contains that client.
:::

## How Extensions Interact

Consider what happens when a user soft-deletes a record:

```typescript
await this.prisma.client.withAuditTransaction((tx) =>
  tx.user.delete({ where: { id: 'user-42' } }),
);
```

The call reaches the extensions in registration order:

```
1. Tenancy extension
   → Reads the caller-established tenant context, applies transaction-local RLS, and delegates

2. Audit extension
   → Verifies the atomic-required transaction and lifecycle capability
   → Supplies the row-locking and record-level audit boundary

3. Soft-delete extension
   → Intercepts delete and joins the earlier audit capability
   → Updates deletedAt/deletedBy and applies the configured cascade
   → Produces User.softDeleted plus record-level cascade audit rows in the same transaction
```

HTTP middleware normally establishes the caller context. Background work must enter an authorized
tenant with `TenancyContext.run()` before invoking this chain; the extension does not invent a
tenant identity.

Restore, bulk restore, force-delete, and purge use the same ambient transaction. Service operations must resolve the same fully composed client that the extension uses:

```typescript
await prisma.client.withAuditTransaction(() =>
  softDeleteService.restore('User', { id: 'user-42' }),
);

await prisma.client.withAuditTransaction(() =>
  softDeleteService.purge('User', { olderThan: cutoff }),
);
```

The lifecycle actions are `Model.softDeleted`, `Model.restored`, and `Model.purged`. Lifecycle events can still notify downstream listeners, but they are notification-only and are not the authoritative audit record. If any lifecycle mutation, cascade write, or audit insert fails, the transaction rolls back. Calling a configured lifecycle operation outside `withAuditTransaction()` fails before mutation.

Ordinary tracked CUD writes use the same transaction-first API:

```typescript
await prisma.client.withAuditTransaction((tx) =>
  tx.user.update({ where: { id: 'user-42' }, data: { name: 'After' } }),
);
```

With `consistency: 'atomic-required'`, those tracked writes fail before mutation when called outside
`withAuditTransaction()`.

### Read queries follow the same pattern

```typescript
await this.prisma.client.user.findMany();
```

1. **Tenancy extension** -- runs `set_config()` so RLS filters by tenant
2. **Audit extension** -- passes through (no tracking on reads)
3. **Soft-delete extension** -- injects `WHERE deletedAt IS NULL` to exclude soft-deleted rows

The caller receives only active records belonging to the current tenant.

## Adding Pagination

The `paginate()` function from `@nestarc/pagination` works alongside extensions because it calls standard Prisma operations (`findMany` and `count`) on the model delegate you pass in:

```typescript
import { paginate, PaginateQuery } from '@nestarc/pagination';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginateQuery) {
    return paginate(query, this.prisma.client.user, {
      sortableColumns: ['id', 'name', 'email', 'createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      searchableColumns: ['name', 'email'],
      filterableColumns: {
        role: ['$eq', '$in'],
        createdAt: ['$gte', '$lte'],
      },
    });
  }
}
```

Because `this.prisma.client.user` is the fully extended model delegate, the `findMany` and `count` calls that `paginate()` makes internally flow through all three extensions:

- Tenancy scopes results to the current tenant
- Audit-log observes the read but does not track it (no side effects)
- Soft-delete excludes deleted records

No special configuration is required. Pagination is orthogonal to the extension chain.

## Gotchas

### Extension order affects behavior

The most common mistake is assuming `$extends()` behaves like a reverse-order wrapper stack. Query callbacks run in registration order, and a callback that does not call its continuation prevents later callbacks from observing the operation.

Always use this order:

```typescript
base
  .$extends(tenancy)     // first — sets tenant/RLS context
  .$extends(auditLog)    // second — exposes the atomic lifecycle capability
  .$extends(softDelete)  // third — joins that capability for lifecycle mutations
```

Do not swap the last two extensions. With `auditLifecycle: 'atomic-required'`, soft-delete 0.7.1 rejects a client that does not expose audit-log's atomic lifecycle capability.

### Base client vs extended client

The `PrismaService` exposes two clients for a reason:

| Client | Use for |
|--------|---------|
| `prisma.base` | Audit log storage and operations that must bypass client extensions |
| `prisma.client` | All application code -- queries flow through tenancy, audit-log, and soft-delete |

Accidentally using `prisma.base` for application queries skips all extensions. Pass `prisma.base` to `AuditLogModule` as its supported storage contract so audit storage remains separate from application extension behavior; reserve `prisma.client` for business model operations.

The base client bypasses Prisma Client Extensions, **not** PostgreSQL RLS. A cross-tenant administrative query needs a separate, tightly authorized connection and explicit authorization/audit policy; do not treat the runtime base client as an RLS bypass.

### Interactive transactions with tenancy

The tenancy extension wraps queries in batch transactions internally. This conflicts with interactive transactions (`$transaction(async (tx) => ...)`). For general tenant-scoped transaction work, choose one of these paths. The automatic audit lifecycle bridge has the narrower requirement described below.

**Option 1: `tenancyTransaction()` helper (recommended)**

Uses only public Prisma APIs and works with tenancy's supported Prisma 6 and 7 releases:

```typescript
import { tenancyTransaction } from '@nestarc/tenancy';

await tenancyTransaction(this.prisma.base, this.tenancyService, async (tx) => {
  const tenantId = this.tenancyService.getCurrentTenantOrThrow();
  const user = await tx.user.findFirstOrThrow();
  await tx.order.create({ data: { userId: user.id, total: 100, tenantId } });
});
```

**Option 2: Enable `interactiveTransactionSupport`**

```typescript
createPrismaTenancyExtension(tenancyService, {
  interactiveTransactionSupport: true,
})
```

This option relies on Prisma internal APIs. Extension construction verifies the required internal
client hook, but it cannot prove that every future Prisma release preserves the transaction markers
used at query time. Pin and E2E-test the exact Prisma release, driver adapter, and pool mode.

The complete `PrismaService` example enables this option so audit-log's
`withAuditTransaction()` can preserve tenant context. Cover the combined tenancy → audit-log →
soft-delete chain with E2E tests against your exact Prisma version before deploying it.
`tenancyTransaction()` cannot wrap or replace audit-log's separate `withAuditTransaction()` helper.
If the interactive option is not compatible with your deployment, the automatic soft-delete audit
bridge is unavailable; use the manual transaction pattern below instead.

::: warning Audit log in transactions
For manual audit log entries inside a tenant-scoped transaction, pass the raw base client to `tenancyTransaction()` and the resulting transaction client to `auditService.log()`:

```typescript
await tenancyTransaction(prisma.base, tenancyService, async (tx) => {
  await tx.invoice.update({ where: { id }, data: { status: 'approved' } });
  await auditService.log({ action: 'invoice.approved', targetId: id }, tx);
});
```

Both the business write and the audit entry roll back together if either fails.
:::

### Soft-delete decorators work per-request

Route decorators like `@WithDeleted()` and `@OnlyDeleted()` change the soft-delete filter mode for the entire request. This applies to all queries in that request, including those made by other services in the call chain. Be mindful of this when a single request triggers queries across multiple services.

### Shared models skip the tenancy extension, not database RLS

Models listed in `sharedModels` (e.g., `Country`, `Currency`) skip the tenancy client extension -- no `set_config()` is called and no tenant field is injected. They do not bypass PostgreSQL RLS. A genuinely shared lookup table should have no tenant RLS policy (or have an explicit database policy designed for shared reads). If those models are also listed in `softDeleteModels`, soft-delete filtering still applies. Design your model lists deliberately:

```typescript
// Tenancy extension
createPrismaTenancyExtension(tenancyService, {
  sharedModels: ['Country', 'Currency'],  // skip tenancy client behavior
})

// Soft-delete extension — don't include shared lookup tables
createPrismaSoftDeleteExtension({
  softDeleteModels: ['User', 'Post', 'Comment'],  // Country/Currency not here
})
```
