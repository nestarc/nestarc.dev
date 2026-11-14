---
title: "Prisma Client Extension Chaining for NestJS"
description: "Use tenancy 0.16.4 to scope an audit-log transaction to one PostgreSQL tenant and commit soft-delete, restore, and audit records together."
---

# Prisma Client Extension Chaining for NestJS

When an invoice is deleted, the tenant's row and its audit record should change in the same transaction. With `@nestarc/tenancy` 0.16.4, `audit-log` opens that transaction and `tenancyTransactionCallback()` sets the authorized tenant on its PostgreSQL connection before application code runs.

::: info Version scope
Use `@nestarc/tenancy` 0.16.4, `@nestarc/audit-log` 0.7.0, and `@nestarc/soft-delete` 0.7.5 for this recipe. Soft-delete 0.7.5's optional audit-log peer range excludes 0.8.0. The combined packages support NestJS 10/11 and require Node.js `^22.23.4 || ^24.22.1`. The [tenancy release fixture](https://github.com/nestarc/nestjs-tenancy/tree/v0.16.4/test/ecosystem/audit-lifecycle) uses Prisma 7.10.1 and PostgreSQL 16 with a restricted runtime role. It verifies concurrent tenant isolation, delete and restore, rejection of a cross-tenant restore, and rollback after an audit insert fails. Test your own model mappings, cascades and purge policy on your deployed stack.
:::

```bash
npm install --save-exact --strict-peer-deps @nestarc/tenancy@0.16.4 @nestarc/audit-log@0.7.0 @nestarc/soft-delete@0.7.5
```

Prepare a generated Prisma client, the audit table, and tenant columns on all tenant-owned tables. Deploy RLS policies that use the same PostgreSQL setting as `TenancyModule` (default `app.current_tenant`). Authenticate the caller and authorize its membership in the selected tenant before running business code. See [Prisma 7 setup](/guide/prisma-7), [audit schema setup](/packages/audit-log/installation), and the [release fixture's RLS policies and grants](https://github.com/nestarc/nestjs-tenancy/blob/v0.16.4/test/ecosystem/audit-lifecycle/setup.sql).

<a id="choose-the-smallest-chain-you-need"></a>
<a id="overview"></a>
<a id="base-client-vs-extended-client"></a>

## Recommended Order

Derive two clients from one base Prisma client. They share its connection pool.

| Work | Client | Where the tenant is set |
|---|---|---|
| Ordinary tenant-scoped model queries | `base.$extends(createPrismaTenancyExtension(...))` | The tenancy query hook sets the tenant for each model operation. |
| Tracked writes, soft-delete, restore, purge and cascade | `base.$extends(createAuditExtension(...)).$extends(createPrismaSoftDeleteExtension(...))` | Pass `tenancyTransactionCallback(tenancy, work)` to this client's `withAuditTransaction()`. |
| Caller-managed transaction with manual audit events | `tenancyTransaction(base, tenancy, work)` | Tenancy opens the transaction. Use its callback client for the business write and for `auditService.log(event, tx)`. |

<a id="extension-order-affects-behavior"></a>

### Why this order

The audit extension supplies `withAuditTransaction()` and the atomic lifecycle methods that soft-delete calls. Apply it first on the lifecycle client. The tenancy per-query hook starts its own batch transactions, so keep it on the ordinary query client. The lifecycle client gets its tenant from the public callback wrapper.

Set `consistency: 'atomic-required'` on audit-log and `auditLifecycle: 'atomic-required'` on the soft-delete extension and Nest module. The `best-effort` audit mode is non-atomic and can leave an audit row after the business transaction rolls back.

## PrismaService Example

This example tracks `User`, `Post`, and `Comment` and configures cascading deletion and restoration. The database table names must match the deployed schema. Include every cascade child in the tracked models and supply the DMMF for those relations. For a custom primary key, configure audit-log's `primaryKey` and `databaseMapping.primaryKeyColumn` as well. See [DMMF for cascade and relation filters](/packages/soft-delete/installation#dmmf-for-cascade-and-relation-filters).

```typescript
// prisma.service.ts
import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from './generated/prisma/client';
import {
  TenancyService, createPrismaTenancyExtension, tenancyTransactionCallback,
} from '@nestarc/tenancy';
import { createAuditExtension, type AuditTransactionMethods } from '@nestarc/audit-log';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';
import { prismaDmmf } from './prisma.dmmf';

const lifecycleModels = ['User', 'Post', 'Comment'];
const lifecycleBatchCap = 1000;

export const softDeleteOptions = {
  softDeleteModels: lifecycleModels,
  deletedAtField: 'deletedAt',
  deletedByField: 'deletedBy',
  auditLifecycle: 'atomic-required' as const,
  auditMaxBatchRecords: lifecycleBatchCap,
  cascade: { User: ['Post'], Post: ['Comment'] },
  dmmf: prismaDmmf,
};

@Injectable()
export class PrismaService implements OnModuleInit {
  readonly base = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });
  readonly tenantClient;
  readonly lifecycleClient;

  constructor(private readonly tenancyService: TenancyService) {
    this.tenantClient = this.base.$extends(
      createPrismaTenancyExtension(tenancyService, {
        autoInjectTenantId: true,
        tenantIdField: 'tenantId',
        sharedModels: ['Country', 'Currency'],
        failClosed: true,
      }),
    );

    this.lifecycleClient = this.base
      .$extends(createAuditExtension({
        consistency: 'atomic-required',
        trackedModels: lifecycleModels,
        tenantRequired: true,
        tenantResolver: () => tenancyService.getCurrentTenantOrThrow(),
        sensitiveFields: ['password', 'ssn'],
        maxBatchRecords: lifecycleBatchCap,
        databaseMapping: {
          User: { tableName: 'users' },
          Post: { tableName: 'posts' },
          Comment: { tableName: 'comments' },
        },
        prismaModule: { Prisma },
      }))
      .$extends(createPrismaSoftDeleteExtension(softDeleteOptions));
  }

  withTenantAuditTransaction<T>(work: (tx: Prisma.TransactionClient) => Promise<T>) {
    // The second $extends preserves the audit method at runtime. Its
    // published type omits that method, so narrow to the capability used here.
    const owner = this.lifecycleClient as unknown as Pick<
      AuditTransactionMethods<Prisma.TransactionClient>, 'withAuditTransaction'
    >;
    return owner.withAuditTransaction(tenancyTransactionCallback(this.tenancyService, work));
  }

  async onModuleInit() {
    await this.base.$connect();
  }
}
```

The callback resolves the tenant at invocation and calls `set_config()` on the supplied transaction before `work`. It rejects a missing tenant, a root Prisma client, and an attempt to rebind the same setting to another tenant. Keep one authorized tenant throughout the callback, use its `tx` for every business query, and supply tenant fields explicitly on inserts. Transaction options, commit and rollback belong to audit-log. See the [released callback implementation](https://github.com/nestarc/nestjs-tenancy/blob/v0.16.4/src/prisma/tenancy-transaction.ts).

### Register the lifecycle client with Nest

Give `SoftDeleteModule` the actual composed client so `SoftDeleteService.restore()` and `purge()` can join the transaction that the same audit extension opened. Export it from a global provider module.

```typescript
// prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export const LIFECYCLE_PRISMA = Symbol('LIFECYCLE_PRISMA');

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: LIFECYCLE_PRISMA,
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => prisma.lifecycleClient,
    },
  ],
  exports: [PrismaService, LIFECYCLE_PRISMA],
})
export class PrismaModule {}
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TenancyModule, TenancyService } from '@nestarc/tenancy';
import { SoftDeleteModule } from '@nestarc/soft-delete';
import { AuditLogModule } from '@nestarc/audit-log';
import { Prisma } from './generated/prisma/client';
import { LIFECYCLE_PRISMA, PrismaModule } from './prisma.module';
import { PrismaService, softDeleteOptions } from './prisma.service';
import { assertAuthorizedTenant } from './auth/tenant-membership';

@Module({
  imports: [
    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id',
      onTenantResolved: (tenantId, req) => assertAuthorizedTenant(req, tenantId),
    }),
    PrismaModule,
    SoftDeleteModule.forRoot({
      ...softDeleteOptions,
      actorExtractor: (req) => req.user?.id ?? null,
      prismaServiceToken: LIFECYCLE_PRISMA,
    }),
    AuditLogModule.forRootAsync({
      imports: [PrismaModule],
      inject: [PrismaService, TenancyService],
      useFactory: (prisma: PrismaService, tenancy: TenancyService) => ({
        prisma: prisma.base,
        prismaModule: { Prisma },
        tenantRequired: true,
        tenantResolver: () => tenancy.getCurrentTenantOrThrow(),
        actorExtractor: (req) => ({
          id: req.user?.id ?? null,
          type: req.user ? 'user' : 'system',
          ip: req.ip,
        }),
      }),
    }),
  ],
})
export class AppModule {}
```

Implement `assertAuthorizedTenant` against the authenticated principal's memberships. Register authentication before Nest's tenancy middleware runs. Background work must enter an authorized tenant with `TenancyContext.run()` before calling the same service. See [authentication and tenant extraction](/packages/tenancy/extractors#authentication-before-tenant-extraction).

## How Extensions Interact

A tracked soft-delete uses the transaction client passed by audit-log. If cascade is configured, child updates and their record-level audit rows join that transaction.

```typescript
await prisma.withTenantAuditTransaction((tx) =>
  tx.user.delete({ where: { id: userId } }),
);
```

A restore or purge goes through the injected `SoftDeleteService` inside the same wrapper. The service uses its configured lifecycle client to join audit-log's active transaction. Choose a cutoff and authorize purge separately for the affected tenant.

```typescript
await prisma.withTenantAuditTransaction(() =>
  softDeleteService.restore('User', { id: userId }),
);

await prisma.withTenantAuditTransaction(() =>
  softDeleteService.purge('User', { olderThan: cutoff }),
);
```

The corresponding actions are `Model.softDeleted`, `Model.restored`, and `Model.purged`. Let database and audit errors propagate to the owner. The release test forces an audit insert to fail after a previous restore in the same transaction, then checks that both changes and their audit records rolled back. See the [release assertions](https://github.com/nestarc/nestjs-tenancy/blob/v0.16.4/test/ecosystem/audit-lifecycle/verify.mjs).

Use the same wrapper for ordinary **tracked** writes:

```typescript
await prisma.withTenantAuditTransaction((tx) =>
  tx.user.update({ where: { id: userId }, data: { name: 'After' } }),
);
```

<a id="read-queries-follow-the-same-pattern"></a>
<a id="adding-pagination"></a>
<a id="soft-delete-decorators-work-per-request"></a>

### Read queries and pagination

Use `prisma.tenantClient` for ordinary tenant-scoped reads. This client's per-query extension applies the tenant's RLS setting. It has no soft-delete filter, so request active rows explicitly when appropriate:

```typescript
await prisma.tenantClient.user.findMany({ where: { deletedAt: null } });
```

For reads that rely on soft-delete filtering, use the scoped lifecycle `tx`. By default, its soft-delete extension returns active rows. On a decorated HTTP route, `@WithDeleted()` includes deleted rows and `@OnlyDeleted()` selects them. That filter mode applies to other lifecycle reads in the same request. The PostgreSQL tenant policy still applies. For example, pass the transaction delegate to [pagination](/packages/pagination/) so the page query and count run with the same tenant and soft-delete settings:

```typescript
import { paginate } from '@nestarc/pagination';

const page = await prisma.withTenantAuditTransaction((tx) =>
  paginate(query, tx.user, {
    sortableColumns: ['id', 'name', 'createdAt'],
    defaultSortBy: [['createdAt', 'DESC']],
  }),
);
```

## Gotchas

### Interactive transactions with tenancy

For an existing three-extension setup, keep `createPrismaTenancyExtension()` on the ordinary query client. Build the audit/soft-delete client directly from the same base, update the `SoftDeleteModule` provider token to point to it, and wrap each audit callback with `tenancyTransactionCallback()`. Once all callers have migrated, remove the deprecated `interactiveTransactionSupport` option. The 0.16.4 recipe uses public Prisma APIs. See the [release migration example](https://github.com/nestarc/nestjs-tenancy/blob/v0.16.4/README.md#tenant-scoping-an-audit-transaction).

When tenancy should open the transaction and your application writes manual audit events, continue to use `tenancyTransaction()` on the base client. Pass its `tx` to both the business update and `auditService.log()`, await both operations, and propagate failures:

```typescript
import { tenancyTransaction } from '@nestarc/tenancy';

await tenancyTransaction(prisma.base, tenancyService, async (tx) => {
  await tx.invoice.update({ where: { id }, data: { status: 'approved' } });
  await auditService.log({ action: 'invoice.approved', targetId: id }, tx);
});
```

<a id="shared-models-skip-the-tenancy-extension-not-database-rls"></a>

### Permissions and shared models

Configure the application role without superuser or `BYPASSRLS` privileges. The release fixture enforces tenant policies on both the business table and audit inserts. If you enable purge, grant the runtime role the narrowly scoped delete permissions it needs and test that operation under RLS. The fixture's role has only read/update access on its business table.

`sharedModels` affects the ordinary client's per-query behavior. PostgreSQL policies and role permissions still apply to those tables. Likewise, a base client with runtime credentials is subject to RLS. Use a separately authorized role for cross-tenant maintenance.
