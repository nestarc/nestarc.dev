---
description: "Configure Prisma 7 with nestarc packages using Prisma Config, generated client output, PostgreSQL driver adapters, and package-specific migration notes."
---

<script setup>
import PrismaCompatibilityTable from '../.vitepress/theme/components/PrismaCompatibilityTable.vue'
</script>

# Prisma 7 Setup

Five nestarc packages now have first-class Prisma 7 support: tenancy, soft-delete, audit-log, feature-flag, and pagination.

## Compatibility Matrix

<PrismaCompatibilityTable />

Prisma 7 requires Node.js `^20.19.0`, `^22.12.0`, or `>=24.0.0`. Individual package engine ranges can be narrower: applications that include audit-log 0.5.0 need Node.js 22.13+ within the 22.x line or Node.js 24.x.

## Install the PostgreSQL Adapter

Prisma 7 direct PostgreSQL connections use a driver adapter:

```bash
npm install @prisma/client @prisma/adapter-pg pg dotenv
npm install --save-dev prisma
```

## Generate the Client

Use the `prisma-client` generator with an explicit output path. Keep the connection URL out of `schema.prisma`:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

Move the CLI datasource URL into Prisma Config:

```typescript
// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: env('DATABASE_URL') },
});
```

Generate the client after changing the schema:

```bash
npx prisma generate
```

## Create the Runtime Client

Import `PrismaClient` from the configured output instead of the `@prisma/client` root:

```typescript
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });
```

Pass this client or one of its model delegates to nestarc exactly as you did with Prisma 6.

## Package-Specific Steps

### tenancy

Apply `createPrismaTenancyExtension()` to the generated base client. Prisma 6 applications can keep their current client construction. tenancy 0.15 supports Prisma 6 and 7, but no longer supports Prisma 5.

### soft-delete

Cascade and relation filters require explicit DMMF metadata. Install `@prisma/internals` at exactly the same version as `prisma`, load the schema with `getDMMF()`, and pass the result as `dmmf` to both the extension and module configuration. Basic soft-delete filtering without cascade or relation filters does not need DMMF.

See [soft-delete installation](/packages/soft-delete/installation#dmmf-for-cascade-and-relation-filters).

### audit-log

The Prisma 7 generated client exports its Prisma namespace from the generated output. Audit-log 0.5.0 requires an explicit automatic-tracking consistency mode; use `atomic-required` with `withAuditTransaction()` for authoritative records. Pass the generated namespace to both the audited client and module:

```typescript
import { Prisma, PrismaClient } from './generated/prisma/client';
import { createAuditedClient } from '@nestarc/audit-log';

export const prismaModule = { Prisma };

const client = createAuditedClient(basePrisma, {
  consistency: 'atomic-required',
  trackedModels: ['User'],
  prismaModule,
});

await client.withAuditTransaction((tx) =>
  tx.user.update({ where: { id }, data: { name: 'After' } }),
);
```

Also pass `prismaModule` to `AuditLogModule.forRoot()` or `forRootAsync()`.

Audit-log supports NestJS 10, 11, and 12.0.1+; 12.0.0 is excluded. A larger package composition is limited to the intersection of every package's peer ranges.

::: info Atomic soft-delete lifecycle tuple
Pair audit-log 0.5.0 with soft-delete 0.7.1 and use the fixed tenancy → audit-log → soft-delete order:

The combined audit-log 0.5.0 / soft-delete 0.7.1 bridge's shared NestJS peer range is 10/11;
audit-log's NestJS 12.0.1+ support applies when the installed package set also accepts that major.

```typescript
const lifecycleModels = ['User', 'Post'];
const lifecycleBatchCap = 1000;

const client = basePrisma
  .$extends(createPrismaTenancyExtension(tenancyService, {
    interactiveTransactionSupport: true,
  }))
  .$extends(createAuditExtension({
    consistency: 'atomic-required',
    trackedModels: lifecycleModels,
    maxBatchRecords: lifecycleBatchCap,
    databaseMapping: {
      User: { tableName: 'users' },
      Post: { tableName: 'posts' },
    },
    prismaModule,
  }))
  .$extends(createPrismaSoftDeleteExtension({
    softDeleteModels: lifecycleModels,
    auditLifecycle: 'atomic-required',
    auditMaxBatchRecords: lifecycleBatchCap,
    cascade: { User: ['Post'] },
    dmmf: prismaDmmf,
  }));

await client.withAuditTransaction((tx) =>
  tx.user.delete({ where: { id } }),
);
```

Use the same soft-delete models, cascade graph, DMMF, and batch cap in `SoftDeleteModule`. Every lifecycle and cascade model must be audit-tracked with its exact deployed `databaseMapping` and custom primary-key metadata. Restore and purge service calls must also run inside `withAuditTransaction()` using the same fully composed client. Explicit `best-effort` cannot power this bridge; rollback can leave orphan success rows and transaction-local diffs can be stale. See [Prisma Extension Chaining](/guide/prisma-extension-chaining) for the complete NestJS wiring.
:::

### feature-flag

feature-flag 0.5 requires Prisma 7. Create the generated client with a driver adapter, then pass it through the existing `prisma` module option. No database migration is required when upgrading from 0.4.

### pagination

Pagination accepts a normal Prisma model delegate, so the pagination API does not change. Only standalone client construction changes for Prisma 7.

## Upgrade Checklist

1. Upgrade to the package releases in the compatibility matrix.
2. Use a Prisma 7-compatible Node.js version.
3. Move the datasource URL into `prisma.config.ts`.
4. Switch to `provider = "prisma-client"` and set an explicit output.
5. Install the adapter for your database and pass it to `PrismaClient`.
6. Update imports to the generated client path.
7. Apply the soft-delete or audit-log package-specific configuration above. For the combined lifecycle bridge, preserve the extension order and align model, mapping, batch-cap, and DMMF configuration.
8. Regenerate the client and run type, integration, and migration checks before deployment.

Prisma 6 consumers of tenancy, soft-delete, audit-log, and pagination do not need to adopt the Prisma 7 client layout until they upgrade Prisma itself.
