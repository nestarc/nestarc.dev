---
description: "Install @nestarc/soft-delete and configure the Prisma extension with deletedAt column support."
---

# Installation & Quick Start

## Installation

```bash
npm install @nestarc/soft-delete
# or
yarn add @nestarc/soft-delete
# or
pnpm add @nestarc/soft-delete
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
npm install @nestarc/audit-log@^0.5.0

# Optional tenant context and extension composition
npm install @nestarc/tenancy@^0.16.0
```

---

## Compatibility

The published peer dependency range supports NestJS 10/11 and Prisma 5/6/7. Prisma 7 is the primary development and PostgreSQL E2E target:

| Node.js | NestJS | Prisma | Scope |
|---|---|---|---|
| 20 | 10 | 5 | lint, unit tests, build |
| 22 | 11 | 6 | lint, unit tests, build |
| 24 | 11 | 7 | lint, unit tests, build, PostgreSQL E2E |

Node.js `^20.19`, `^22.12`, or `>=24` is required by the Prisma 7 toolchain. Cascade and relation filters require explicit DMMF metadata on every supported Prisma version.

Version 0.7.2 accepts `@nestarc/audit-log` as an optional peer at `^0.4.1 || ^0.5.0`.
Both lines must expose the atomic lifecycle capability handshake; legacy and best-effort clients
are rejected before a lifecycle mutation runs.

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
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private _extended: ReturnType<typeof this.$extends>;

  constructor() {
    super({ adapter });
    this._extended = this.$extends(
      createPrismaSoftDeleteExtension({
        softDeleteModels: ['User', 'Post'],
        deletedAtField: 'deletedAt',
        deletedByField: 'deletedBy',
      }),
    );
  }

  // Expose the extended client for all queries
  get client() {
    return this._extended;
  }

  async onModuleInit() {
    await this.$connect();
  }
}
```

> **Important:** Use `prisma.client.user.delete()` (the extended client) for soft-delete behavior.
> Direct `prisma.user.delete()` calls bypass the extension and perform hard deletes.

The basic setup above does not need DMMF. If you enable cascade or relation filters, follow [DMMF for Cascade and Relation Filters](#dmmf-for-cascade-and-relation-filters) and pass the same metadata to the extension and module.

::: tip Atomic lifecycle evidence
Version 0.7.2 can record soft-delete, restore, purge, cascade, and bounded bulk work through
`@nestarc/audit-log`. This is opt-in: use the fixed tenancy → audit-log → soft-delete extension
order, configure `auditLifecycle: 'atomic-required'`, and follow the
[atomic lifecycle setup](#atomic-audit-lifecycle).
:::

### 3. Register the module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { SoftDeleteModule } from '@nestarc/soft-delete';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    SoftDeleteModule.forRoot({
      softDeleteModels: ['User', 'Post'],
      deletedAtField: 'deletedAt',
      deletedByField: 'deletedBy',
      actorExtractor: (req) => req.user?.id ?? null,
      prismaServiceToken: PrismaService,
    }),
  ],
  providers: [PrismaService],
})
export class AppModule {}
```

`SoftDeleteModule` is global — you do not need to import it in feature modules.

### DMMF for Cascade and Relation Filters

Cascade and relation-filter lookup require full Prisma DMMF metadata. Pin `@prisma/internals` to exactly the same version as `prisma`:

```bash
npm install @prisma/internals@<same-version-as-prisma>
```

Load the schema metadata before creating the extension, then pass the same `dmmf` value into `SoftDeleteModule`:

```typescript
import { readFileSync } from 'node:fs';
import { getDMMF } from '@prisma/internals';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';

const datamodel = readFileSync('prisma/schema.prisma', 'utf8');
const dmmf = await getDMMF({ datamodel });
const cascade = { User: ['Post'] };

const client = basePrisma.$extends(
  createPrismaSoftDeleteExtension({
    softDeleteModels: ['User', 'Post'],
    cascade,
    dmmf,
  }),
);

SoftDeleteModule.forRoot({
  softDeleteModels: ['User', 'Post'],
  cascade,
  dmmf,
  prismaServiceToken: PrismaService,
});
```

`@prisma/internals` has no semantic-versioning guarantee and is not a runtime dependency of soft-delete. Keep the explicit metadata boundary in application code and cover it with startup or integration tests.

### Atomic Audit Lifecycle

Use the audit bridge when the lifecycle mutation and its evidence must commit or roll back
together. The order is fixed: tenancy first, audit-log second, soft-delete last.

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from './generated/prisma/client';
import { createPrismaTenancyExtension, TenancyService } from '@nestarc/tenancy';
import { createAuditExtension } from '@nestarc/audit-log';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';
import { prismaDmmf } from './prisma.dmmf';

export const prismaModule = { Prisma };

@Injectable()
export class PrismaService implements OnModuleInit {
  readonly base = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  readonly client;

  constructor(tenancy: TenancyService) {
    this.client = this.base
      .$extends(
        createPrismaTenancyExtension(tenancy, {
          interactiveTransactionSupport: true,
          failClosed: true,
        }),
      )
      .$extends(
        createAuditExtension({
          consistency: 'atomic-required',
          trackedModels: ['User', 'Post'],
          maxBatchRecords: 1000,
          databaseMapping: {
            User: { tableName: 'User' },
            Post: { tableName: 'Post' },
          },
          prismaModule,
        }),
      )
      .$extends(
        createPrismaSoftDeleteExtension({
          softDeleteModels: ['User', 'Post'],
          cascade: { User: ['Post'] },
          dmmf: prismaDmmf,
          auditLifecycle: 'atomic-required',
          auditMaxBatchRecords: 1000,
        }),
      );
  }

  async onModuleInit() {
    await this.base.$connect();
  }
}
```

Expose that exact composed client as a Nest provider. Do not point `prismaServiceToken` at a
wrapper that merely has a `.client` property: `SoftDeleteService` resolves model delegates directly
from the injected value and must join the same ambient audit transaction.

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

Configure the Nest service path with the same lifecycle, batch, cascade, and DMMF options used by
the extension:

```typescript
SoftDeleteModule.forRoot({
  softDeleteModels: ['User', 'Post'],
  cascade: { User: ['Post'] },
  dmmf: prismaDmmf,
  auditLifecycle: 'atomic-required',
  auditMaxBatchRecords: 1000,
  prismaServiceToken: EXTENDED_PRISMA,
});
```

Every soft-delete model, including cascade children, must appear in audit-log's `trackedModels`
and `databaseMapping`. Run all authoritative lifecycle operations inside `withAuditTransaction()`:

```typescript
await prisma.client.withAuditTransaction((tx) =>
  tx.user.delete({ where: { id } }),
);

await prisma.client.withAuditTransaction(() =>
  softDelete.restore('User', { id }),
);
```

Calls outside the helper, an incorrect extension order, a best-effort audit client, or a different
client injected into `SoftDeleteModule` fail before mutation. `auditMaxBatchRecords` bounds the
record-level conversion used by `deleteMany` and `restoreMany`; keep it aligned with audit-log's
`maxBatchRecords`. Lifecycle events remain notification-only and are not authoritative evidence.
See [Prisma extension chaining](/guide/prisma-extension-chaining) for the complete application
wiring.

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

With `auditLifecycle: 'atomic-required'`, use the exact composed `PrismaService.client` and wrap both
extension-backed and service-backed lifecycle writes:

```typescript
remove(@Param('id') id: string) {
  return this.prisma.client.withAuditTransaction((tx) =>
    tx.user.delete({ where: { id: +id } }),
  );
}

restore(@Param('id') id: string) {
  return this.prisma.client.withAuditTransaction(() =>
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
| `dmmf` | `PrismaDmmfLike` | `undefined` | Explicit Prisma DMMF for cascade and relation-filter lookup when `Prisma.dmmf` is unavailable. |
| `relationFilters` | `boolean \| RelationFilterOptions` | `false` | Opt in to active-only filtering for to-many `include` and `select` trees. |
| `auditLifecycle` | `'atomic-required'` | `undefined` | Require the same-transaction `@nestarc/audit-log` lifecycle bridge. |
| `auditMaxBatchRecords` | `number` | `1000` | Maximum rows converted to record-level `deleteMany`/`restoreMany` audit mutations. |
| `prismaServiceToken` | `any` | — | **Required.** DI token for the query client; in audit lifecycle mode it must resolve to the exact fully composed client. |
| `enableEvents` | `boolean` | `false` | Emit lifecycle events. Requires `@nestjs/event-emitter`. |

### Async registration

```typescript
SoftDeleteModule.forRootAsync({
  imports: [ConfigModule],
  prismaServiceToken: PrismaService,
  useFactory: (config: ConfigService) => ({
    softDeleteModels: config.get('SOFT_DELETE_MODELS').split(','),
    deletedAtField: 'deletedAt',
    prismaServiceToken: PrismaService,
  }),
  inject: [ConfigService],
});
```

Relation filtering is intentionally opt-in to preserve the 0.4 query shape. Configure it on the Prisma extension and follow the [Relation Filters](./relation-filters) guide before enabling it in production.

## Tenancy 0.16 compatibility

Soft-delete 0.7.2 accepts optional `@nestarc/tenancy` `^0.15.0 || ^0.16.0`. A composition with tenancy 0.16 requires Node `^22.13.0 || ^24.0.0`. The soft-delete schema and atomic audit protocol are unchanged; follow the [tenancy migration](/packages/tenancy/migration#upgrade-to-0-16) for its RLS and event changes.
