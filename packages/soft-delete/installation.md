---
description: "Install @nestarc/soft-delete and configure the Prisma extension with deletedAt column support."
---

# Installation & Quick Start

## Installation

```bash
npm install @nestarc/soft-delete@0.7.5
# or
yarn add @nestarc/soft-delete@0.7.5
# or
pnpm add @nestarc/soft-delete@0.7.5
```

**Required peer dependencies** (install if not already present):

```bash
npm install @nestjs/common @nestjs/core @prisma/client reflect-metadata rxjs
```

Prisma 7 direct PostgreSQL connections also require:

```bash
npm install @prisma/adapter-pg pg
npm install --save-dev prisma dotenv
```

**Optional peer dependencies:**

```bash
# For lifecycle events
npm install @nestjs/event-emitter

# For scheduled purge jobs
npm install @nestjs/schedule

# For authoritative, same-transaction lifecycle evidence
npm install --save-exact @nestarc/audit-log@0.7.0

# Optional tenant context and extension composition
npm install --save-exact @nestarc/tenancy@0.16.4
```

---

## Compatibility

The published peer dependency range supports NestJS 10/11 and Prisma 5/6/7. Prisma 7 is the primary development and PostgreSQL E2E target:

| Node.js | NestJS | Prisma | Scope |
|---|---|---|---|
| 20 | 10 | 5 | lint, unit tests, build |
| 22 | 11 | 6 | lint, unit tests, build |
| 24 | 11 | 7 | lint, unit tests, build, PostgreSQL E2E |

Soft-delete declares Node.js `^20.19.0 || ^22.12.0 || >=24.0.0`. Adding tenancy 0.16.4 narrows the
shared runtime to Node.js `^22.23.4 || ^24.22.1`. The pinned audit-log 0.7.0 and historical tenancy
0.16.0–0.16.1 artifacts declare `^22.13.0 || ^24.0.0`; apply the
[tenancy runtime and HTTP parser updates](/packages/tenancy/migration#upgrade-to-0-16-2) even when retaining those package pins. Audit-log
0.7.1 also raises its minimum to `^22.23.4 || ^24.22.1`; the complete
three-package composition shares NestJS 10/11. Cascade and relation filters
require explicit DMMF metadata on every supported Prisma version.

Version 0.7.5 accepts `@nestarc/audit-log` as an optional peer at
`^0.4.1 || ^0.5.0 || ^0.6.0 || ^0.7.0`. All supported lines must expose the atomic lifecycle
capability handshake; legacy and best-effort clients are rejected before a lifecycle mutation runs.
The tenancy **0.16.4** release tests the published **audit-log 0.7.0** and **soft-delete 0.7.5** together on PostgreSQL. Its fixture exercises concurrent tenant isolation, delete and restore, and rollback after a failed audit insert. [Release fixture](https://github.com/nestarc/nestjs-tenancy/tree/v0.16.4/test/ecosystem/audit-lifecycle)

::: warning Audit-log 0.8.0 compatibility
Soft-delete 0.7.5 excludes audit-log 0.8.0 from its peer range. These lifecycle examples remain
pinned to audit-log 0.7.0 / soft-delete 0.7.5. Do not substitute 0.8.0 or bypass peer validation.
A newer tuple requires a compatible published companion and passing strict-peer lifecycle checks.
See the [audit-log upgrade guide](/packages/audit-log/migration).
:::

Upgrading from soft-delete 0.7.2 to 0.7.4 requires no soft-delete schema or API migration:
0.7.3 added audit-log 0.6 peer support, and 0.7.4 adds audit-log 0.7 peer support while preserving
the runtime and atomic transaction contract. If audit-log is upgraded too, follow its
[migration guide](/packages/audit-log/migration). These boundaries come from the
[0.7.5 package manifest](https://github.com/nestarc/nestjs-soft-delete/blob/v0.7.5/package.json)
and [release notes](https://github.com/nestarc/nestjs-soft-delete/blob/v0.7.5/CHANGELOG.md).

### Upgrade to 0.7.5

Version 0.7.5 fixes the installed package's root/testing boundary: both entry points now share
service classes, injection tokens, event emitter, and context within the same module format.
Use CommonJS for both entry points or ESM for both; mixing a CommonJS root with ESM testing
imports does not establish shared identity. `TestSoftDeleteModule.register()` also installs the
production cascade provider when cascade is configured. Supply the same cascade options and
DMMF to the extension and test module; missing DMMF fails initialization.

No database migration or peer-range change is required from 0.7.4. The production-module test
setup remains valid, and 0.7.5 can also use the [testing module setup](./events#testsoftdeletemodule-in-0-7-5).

---

## Quick Start

### 1. Prisma schema

Use Prisma 7's generated-client output and add `deletedAt` (and optionally `deletedBy`) to every model you want to soft-delete:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  deletedAt DateTime?
  deletedBy String?
}
```

Move the CLI datasource URL into Prisma Config:

```typescript
// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: { url: env('DATABASE_URL') },
});
```

A plain `@unique` still includes soft-deleted rows. If a value must be reusable after deletion, remove the global unique constraint and add a database-specific active-row unique index. See [Cascade & Unique Constraints](./cascade#active-row-unique-constraints).

### 2. Set up PrismaService

Apply the soft-delete extension in your `PrismaService`. This is what intercepts `delete()` calls and injects query filters:

```typescript
// prisma.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly base = new PrismaClient({ adapter });
  readonly client = this.base.$extends(
    createPrismaSoftDeleteExtension({
      softDeleteModels: ['User'],
      deletedAtField: 'deletedAt',
      deletedByField: 'deletedBy',
    }),
  );

  async onModuleInit() {
    await this.base.$connect();
  }

  async onModuleDestroy() {
    await this.base.$disconnect();
  }
}
```

> **Important:** Use `prisma.client.user.delete()` (the extended client) for soft-delete behavior.
> Direct `prisma.base.user.delete()` calls bypass the extension and perform hard deletes.

The basic setup above does not need DMMF. If you enable cascade or relation filters, follow [DMMF for Cascade and Relation Filters](#dmmf-for-cascade-and-relation-filters) and pass the same metadata to the extension and module.

::: tip Atomic lifecycle evidence
Version 0.7.5 can record soft-delete, restore, purge, cascade, and bounded bulk work through
`@nestarc/audit-log`. Apply audit-log before soft-delete on the lifecycle client and configure
`auditLifecycle: 'atomic-required'`. To bind a tenant to that client's transaction, follow the
[atomic lifecycle setup](#atomic-audit-lifecycle).
:::

### 3. Register the module

Export the extended client from a global provider module. `SoftDeleteModule.forRoot()` resolves
`prismaServiceToken` inside its own module; placing `PrismaService` only in the parent
`AppModule.providers` does not make that dependency visible.

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
import { SoftDeleteModule } from '@nestarc/soft-delete';
import { PrismaModule, EXTENDED_PRISMA } from './prisma.module';
import { UsersController } from './users.controller';

@Module({
  imports: [
    PrismaModule,
    SoftDeleteModule.forRoot({
      softDeleteModels: ['User'],
      deletedAtField: 'deletedAt',
      deletedByField: 'deletedBy',
      actorExtractor: (req) => req.user?.id ?? null,
      prismaServiceToken: EXTENDED_PRISMA,
    }),
  ],
  controllers: [UsersController],
})
export class AppModule {}
```

`SoftDeleteModule` is global — you do not need to import it in feature modules. The minimal
schema and quick start configure `User` only. Add a `Post` model with deletion fields before
adopting the multi-model examples below. For a non-global provider module, use
`forRootAsync({ imports: [PrismaModule], ... })` to make its exported client token visible.

### DMMF for Cascade and Relation Filters

Cascade and relation-filter lookup require full Prisma DMMF metadata. Audited bulk operations on models whose primary key is not named `id` also need this metadata, even without cascade. Pin `@prisma/internals` to exactly the same version as `prisma`:

```bash
npm install @prisma/internals@<same-version-as-prisma>
```

Prisma 7.10.1 types the metadata returned by `getDMMF()` as read-only. Soft-delete 0.7.5's `PrismaDmmfLike` type expects mutable arrays. Copy the model, field, and relation-key arrays when you load the schema:

```typescript
// prisma.dmmf.ts
import { readFileSync } from 'node:fs';
import prismaInternals from '@prisma/internals';
import type { PrismaDmmfLike } from '@nestarc/soft-delete';

const datamodel = readFileSync('prisma/schema.prisma', 'utf8');
const { datamodel: schema } = await prismaInternals.getDMMF({ datamodel });

export const prismaDmmf: PrismaDmmfLike = {
  datamodel: {
    models: schema.models.map(({ name, fields }) => ({
      name,
      fields: fields.map(field => ({
        ...field,
        relationFromFields: [...(field.relationFromFields ?? [])],
      })),
    })),
  },
};
```

Use the same metadata for the Prisma extension and the Nest module:

```typescript
import { createPrismaSoftDeleteExtension, SoftDeleteModule } from '@nestarc/soft-delete';
import { prismaDmmf } from './prisma.dmmf';

const cascade = { User: ['Post'] };

const client = basePrisma.$extends(
  createPrismaSoftDeleteExtension({
    softDeleteModels: ['User', 'Post'],
    cascade,
    dmmf: prismaDmmf,
  }),
);

SoftDeleteModule.forRoot({
  softDeleteModels: ['User', 'Post'],
  cascade,
  dmmf: prismaDmmf,
  prismaServiceToken: EXTENDED_PRISMA,
});
```

`@prisma/internals` has no semantic-versioning guarantee and is not a runtime dependency of soft-delete. Keep the explicit metadata boundary in application code and cover it with startup or integration tests.

### Atomic Audit Lifecycle

For PostgreSQL, use **tenancy 0.16.4**, **audit-log 0.7.0**, and **soft-delete 0.7.5** to commit a tenant's deletion or restore with its audit records. Add a tenant column to each tenant-scoped model, including cascade children. Enforce RLS on the business and audit tables, use a restricted application role, and authorize the tenant before entering the callback. The [release fixture](https://github.com/nestarc/nestjs-tenancy/tree/v0.16.4/test/ecosystem/audit-lifecycle) includes the SQL grants, policies, and rollback checks.

Build a dedicated lifecycle client from the base Prisma client. Apply audit-log first and soft-delete second. Keep the per-query tenancy extension on the separate client used for ordinary queries. When migrating from `interactiveTransactionSupport: true`, move the tenant binding into the callback of `withAuditTransaction()`.

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from './generated/prisma/client';
import { tenancyTransactionCallback, TenancyService } from '@nestarc/tenancy';
import { createAuditExtension, type AuditTransactionMethods } from '@nestarc/audit-log';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';
import { prismaDmmf } from './prisma.dmmf';

export const lifecycleOptions = {
  softDeleteModels: ['User', 'Post'],
  cascade: { User: ['Post'] },
  dmmf: prismaDmmf,
  auditLifecycle: 'atomic-required' as const,
  auditMaxBatchRecords: 1000,
};

@Injectable()
export class PrismaService implements OnModuleInit {
  readonly base = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });
  readonly lifecycleClient;

  constructor(private readonly tenancy: TenancyService) {
    this.lifecycleClient = this.base
      .$extends(createAuditExtension({
        consistency: 'atomic-required',
        trackedModels: lifecycleOptions.softDeleteModels,
        maxBatchRecords: lifecycleOptions.auditMaxBatchRecords,
        databaseMapping: {
          User: { tableName: 'User' },
          Post: { tableName: 'Post' },
        },
        tenantRequired: true,
        tenantResolver: () => tenancy.getCurrentTenantOrThrow(),
        prismaModule: { Prisma },
      }))
      .$extends(createPrismaSoftDeleteExtension(lifecycleOptions));
  }

  withTenantAuditTransaction<T>(work: (tx: Prisma.TransactionClient) => Promise<T>) {
    // soft-delete's declarations omit the audit method preserved at runtime.
    const owner = this.lifecycleClient as unknown as Pick<
      AuditTransactionMethods<Prisma.TransactionClient>, 'withAuditTransaction'
    >;
    return owner.withAuditTransaction(tenancyTransactionCallback(this.tenancy, work));
  }

  async onModuleInit() {
    await this.base.$connect();
  }
}
```

Inject this exact lifecycle client into `SoftDeleteModule` so service operations such as `restore()` join the audit transaction. Export its provider from your Prisma module:

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

Register the service with the same lifecycle options as the extension:

```typescript
SoftDeleteModule.forRoot({
  ...lifecycleOptions,
  prismaServiceToken: LIFECYCLE_PRISMA,
});
```

Run lifecycle writes in an authorized tenant context. Direct Prisma writes use the callback's `tx`. Service calls use the injected lifecycle client and its active audit transaction:

```typescript
await prisma.withTenantAuditTransaction((tx) =>
  tx.user.delete({ where: { id } }),
);

await prisma.withTenantAuditTransaction(() =>
  softDelete.restore('User', { id }),
);
```

Keep one authorized tenant throughout the callback and supply tenant fields explicitly for inserts. Map each tracked model and cascade child to its actual database table. Align `auditMaxBatchRecords` with audit-log's `maxBatchRecords` for bulk operations. For setup with ordinary tenant-scoped queries and a complete Prisma service, see [Prisma extension chaining](/guide/prisma-extension-chaining).

### 4. Use in a controller

The controller below belongs to the basic non-audit quick start. If you enabled the atomic audit
lifecycle setup above, do not call either lifecycle path directly; use the atomic variants after
this example.

```typescript
// users.controller.ts
import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SoftDeleteService, WithDeleted } from '@nestarc/soft-delete';
import { PrismaService } from './prisma.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly softDelete: SoftDeleteService,
  ) {}

  // Soft-deletes the user (sets deletedAt) via the extended client
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.client.user.delete({ where: { id: +id } });
  }

  // Normal findMany — deleted users are automatically excluded
  @Get()
  findAll() {
    return this.prisma.client.user.findMany();
  }

  // Include soft-deleted users in results
  @Get('all')
  @WithDeleted()
  findAllIncludingDeleted() {
    return this.prisma.client.user.findMany();
  }

  // Restore a soft-deleted user
  @Post(':id/restore')
  restore(@Param('id') id: string) {
    return this.softDelete.restore('User', { id: +id });
  }
}
```

With `auditLifecycle: 'atomic-required'`, use the tenant-bound method from the [lifecycle setup](#atomic-audit-lifecycle) for both controller paths:

```typescript
remove(@Param('id') id: string) {
  return this.prisma.withTenantAuditTransaction((tx) =>
    tx.user.delete({ where: { id: +id } }),
  );
}

restore(@Param('id') id: string) {
  return this.prisma.withTenantAuditTransaction(() =>
    this.softDelete.restore('User', { id: +id }),
  );
}
```

---

## Configuration

All options for `SoftDeleteModule.forRoot()`:

| Option | Type | Default | Description |
|---|---|---|---|
| `softDeleteModels` | `string[]` | — | **Required.** Model names to enable soft-delete for. |
| `deletedAtField` | `string` | `'deletedAt'` | Prisma field that stores the soft-delete timestamp. |
| `deletedByField` | `string \| null` | `null` | Prisma field to store the actor ID who deleted the record. |
| `actorExtractor` | `(req: any) => string \| null` | `undefined` | Function to extract the actor ID from the incoming request. |
| `cascade` | `Record<string, string[]>` | `undefined` | Parent-to-children cascade map (see Cascade section). |
| `maxCascadeDepth` | `number` | `3` | Maximum depth for recursive cascade operations. |
| `dmmf` | `PrismaDmmfLike` | `undefined` | Explicit Prisma DMMF required for cascade, relation filters, and audited bulk operations on custom primary keys. |
| `relationFilters` | `boolean \| RelationFilterOptions` | `false` | Opt in to active-only filtering for to-many `include` and `select` trees. |
| `auditLifecycle` | `'atomic-required'` | `undefined` | Require the same-transaction `@nestarc/audit-log` lifecycle bridge. |
| `auditMaxBatchRecords` | `number` | `1000` | Maximum rows converted to record-level `deleteMany`/`restoreMany` audit mutations. |
| `prismaServiceToken` | `any` | — | **Required.** DI token for the query client; in audit lifecycle mode it must resolve to the exact fully composed client. |
| `enableEvents` | `boolean` | `false` | Emit lifecycle events. Requires `@nestjs/event-emitter`. |

### Async registration

```typescript
SoftDeleteModule.forRootAsync({
  imports: [ConfigModule, PrismaModule],
  prismaServiceToken: EXTENDED_PRISMA,
  useFactory: (config: ConfigService) => ({
    softDeleteModels: config.getOrThrow<string>('SOFT_DELETE_MODELS').split(','),
    deletedAtField: 'deletedAt',
    prismaServiceToken: EXTENDED_PRISMA,
  }),
  inject: [ConfigService],
});
```

Relation filtering is intentionally opt-in to preserve the 0.4 query shape. Configure it on the Prisma extension and follow the [Relation Filters](./relation-filters) guide before enabling it in production.

## Tenancy 0.16 compatibility

Soft-delete 0.7.5 retains the optional `@nestarc/tenancy` range `^0.15.0 || ^0.16.0` introduced in 0.7.2. A composition with tenancy 0.16.4 requires Node `^22.23.4 || ^24.22.1`. The soft-delete schema and atomic audit protocol are unchanged; follow the [tenancy 0.16 migration](/packages/tenancy/migration#upgrade-to-0-16) for its RLS and event changes and the [0.16.2 upgrade sequence](/packages/tenancy/migration#upgrade-to-0-16-2) for runtime, parser, and resource-key requirements. Validate the exact composed package tuple; the declared peer range does not establish that every combination was exercised.
