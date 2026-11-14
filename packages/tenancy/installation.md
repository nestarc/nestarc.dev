---
description: "Install and configure @nestarc/tenancy — enable PostgreSQL RLS, register TenancyModule, and set up the Prisma extension."
---

# Installation

Select Node.js `^22.23.4 || ^24.22.1` before installing tenancy **0.16.4**. The package supports NestJS 10/11 and Prisma 6/7. The commands below use the Prisma 7 release tested with the audit integration.

```bash
npm install --save-exact @nestarc/tenancy@0.16.4 @prisma/client@7.10.1 @prisma/adapter-pg@7.10.1
npm install pg dotenv
npm install --save-dev --save-exact prisma@7.10.1
```

This page integrates tenancy into an existing Nest application. For a complete schema, seed, authentication middleware, controller, and commands, use the [runnable HTTP example](https://github.com/nestarc/nestjs-tenancy/tree/v0.16.4/examples/quickstart).

The 0.16.2 security update requires upgrading the actual Node binary used by the application, containers, and workers. Installing the npm package does not patch Node's embedded decoder. Update the application's own `body-parser` dependency graph to at least **1.20.9** on the 1.x line or **2.4.0** on the 2.x line, keeping each major compatible with its caller; the source repository's overrides do not propagate to consumers. Check the resolved versions with `npm ls body-parser --all`.

Before upgrading an existing deployment, review [the 0.16.2 deployment sequence](./migration#upgrade-to-0-16-2) and [resource-key separator migration](./non-http-resources#migrating-tenant-resource-key-separators). Empty or ASCII-digit-only separators now fail during `TenantResourceKey` construction. Default `:` keys keep their format, and the patch adds no database schema or RLS migration from 0.16.1.

## Quick Start

Authenticate the caller before tenant extraction and verify their membership in the selected tenant. A valid `X-Tenant-Id` value is an identifier, not proof of access. [Register authentication with `app.use()` before `app.init()` or `app.listen()`](./extractors#authentication-before-tenant-extraction); module import order is not an authentication-order guarantee. The examples below use the Express adapter.

### 1. Enable RLS on your PostgreSQL tables

Every table that needs tenant isolation must have a required tenant column and an RLS policy. The SQL below is a TEXT-column example. On populated tables, backfill a tenant value before adding `NOT NULL`; for native UUID or mapped columns, use [CLI-generated schema-aware policies](./cli).

```sql
-- Ensure your table has a tenant_id column
ALTER TABLE users ADD COLUMN tenant_id TEXT NOT NULL;
CREATE INDEX users_tenant_id_idx ON users (tenant_id);

-- Enable RLS (FORCE ensures table owners also obey policies)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

-- Create isolation policy
CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant', true)::text);

CREATE POLICY tenant_context_guard_users ON users
  AS RESTRICTIVE
  USING (NULLIF(current_setting('app.current_tenant', true), '') IS NOT NULL)
  WITH CHECK (NULLIF(current_setting('app.current_tenant', true), '') IS NOT NULL);

-- The `true` parameter means missing_ok: returns NULL instead of error when unset.
-- With these policies, missing-context reads match no rows and inserts fail RLS.
-- The default client check also rejects unscoped model operations.
-- Repeat for each tenant-scoped table
```

> **Critical:** RLS is bypassed by superusers and (without `FORCE ROW LEVEL SECURITY`) by table owners. Have a database administrator or provisioning process create a dedicated application role that does **not** own the tables; `CREATE ROLE` requires PostgreSQL `CREATEROLE` or superuser privilege. The migration owner can apply the RLS policies and grants afterward:
> ```sql
> CREATE ROLE app_user LOGIN NOSUPERUSER NOBYPASSRLS PASSWORD 'your_password';
> GRANT USAGE ON SCHEMA public TO app_user;
> GRANT SELECT, INSERT, UPDATE, DELETE ON users TO app_user;
> ```
> Use this role's connection string in your application. Never grant it superuser or `BYPASSRLS`; either capability silently bypasses RLS.

### 2. Register the module

```typescript
import { Module } from '@nestjs/common';
import { TenancyModule } from '@nestarc/tenancy';

@Module({
  imports: [
    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id', // header name
    }),
  ],
})
export class AppModule {}
```

### 3. Extend your Prisma client

Prisma 7 generates the client into an explicit output directory and reads the datasource URL from Prisma Config:

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

```typescript
// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: { url: env('MIGRATION_DATABASE_URL') },
});
```

Use a schema-owner `MIGRATION_DATABASE_URL` for CLI migrations. The runtime adapter below reads `DATABASE_URL`, which must use the non-owner, `NOBYPASSRLS` application role created above.

Run `npx prisma generate`, then extend the generated client:

```typescript
import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { TenancyService, createPrismaTenancyExtension } from '@nestarc/tenancy';

@Injectable()
export class PrismaService implements OnModuleInit {
  public readonly base: PrismaClient;
  public readonly client;

  constructor(private readonly tenancyService: TenancyService) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    this.base = new PrismaClient({ adapter });
    this.client = this.base.$extends(
      createPrismaTenancyExtension(tenancyService),
    );
  }

  async onModuleInit() {
    await this.base.$connect();
  }
}
```

Application queries use `client`. Keep `base` private to infrastructure paths
that must open a transaction before the tenancy extension runs, such as the
public `tenancyTransaction()` helper below; never expose it to request handlers
as a way to bypass tenant scoping.

Prisma 6 consumers can keep their existing `@prisma/client` import and client construction. See [Prisma 7 Setup](/guide/prisma-7) for the shared migration checklist.

### 4. Use it

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    // Automatically filtered by RLS — only current tenant's data returned
    return this.prisma.client.user.findMany();
  }
}
```

Send requests with the tenant header:

```bash
curl -H "X-Tenant-Id: 550e8400-e29b-41d4-a716-446655440000" http://localhost:3000/users
```

Tenant-scoped model operations through `client` receive transaction-local context. Raw SQL is excluded from automatic handling; run it through `tenancyTransaction()` on `base` with parameterized SQL. Register `PrismaService`, `UsersService`, and your controller as providers/controllers in your application module.

To measure the cost of setting tenant context, [compare the extension with a manual RLS transaction](./benchmark) using the same database role and rows.

## Extension Options

```typescript
createPrismaTenancyExtension(tenancyService, {
  dbSettingKey: 'app.current_tenant',  // PostgreSQL setting key (default)
  autoInjectTenantId: true,            // Auto-inject tenant_id on create/upsert
  tenantIdField: 'tenant_id',          // Prisma field name to inject (default)
  sharedModels: ['Country', 'Currency'], // Models that skip tenancy client behavior
})
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dbSettingKey` | `string` | `'app.current_tenant'` | PostgreSQL session variable name |
| `autoInjectTenantId` | `boolean` | `false` | Auto-inject tenant ID into `create`, `createMany`, `createManyAndReturn`, `upsert` |
| `tenantIdField` | `string` | `'tenant_id'` | Prisma field name to inject into write data. With `tenantId @map("tenant_id")`, set this to `'tenantId'` |
| `sharedModels` | `string[]` | `[]` | Models that skip the tenancy extension (no `set_config`, no injection); this does not bypass database RLS |
| `failClosed` | `boolean` | `true` | Block queries when no tenant context is set (prevents accidental data exposure if RLS is misconfigured) |
| `interactiveTransactionSupport` | `boolean` | `false` | **Deprecated.** Choose a [public transaction helper](#interactive-transactions) according to which component opens the transaction. |

`autoInjectTenantId` changes runtime arguments but does not make a required tenant field optional in Prisma's generated TypeScript input. For type-safe `create`/`upsert` code, read the value with `tenancyService.getCurrentTenantOrThrow()` and include it in `data`; the extension overwrites top-level tenant fields from the same resolved context at runtime. It injects into `create`, `createMany`, `createManyAndReturn`, and `upsert.create`, and removes the tenant field from `upsert.update`; nested writes are not traversed. Supply tenant fields in nested write data and enforce them with RLS and tenant-aware foreign keys. Authenticate or cross-check client-supplied tenant identifiers before treating that context as trusted.

> A custom `dbSettingKey` configured in `TenancyModule.forRoot()` also applies to the Prisma extension and both transaction helpers. An explicit conflicting key fails before the helper runs SQL. Use the same setting in your PostgreSQL RLS policies.

> **Migration note:** If you intentionally rely on model queries without tenant context reaching PostgreSQL RLS, set `failClosed: false` explicitly. `sharedModels` and `withoutTenant()` only bypass client-extension behavior; they do not bypass database RLS. Shared tables need an explicit database policy, while cross-tenant administration needs a separate, tightly authorized connection and audit policy.

## Interactive Transactions

The ordinary tenancy client wraps each model operation in a batch transaction. For an interactive transaction, initialize tenant context on the connection that owns the complete operation.

### Open a tenant-scoped transaction

Uses only public Prisma APIs and works with tenancy's supported Prisma 6 and 7 releases. Pass the raw, non-extended Prisma client as the first argument; passing a tenancy-extended client re-enters the batch wrapper that this helper is designed to avoid.

```typescript
import { tenancyTransaction } from '@nestarc/tenancy';

await tenancyTransaction(basePrisma, tenancyService, async (tx) => {
  const tenantId = tenancyService.getCurrentTenantOrThrow();
  const user = await tx.user.findFirstOrThrow();
  await tx.order.create({ data: { userId: user.id, tenantId } });
}, {
  maxWait: 2_000,
  timeout: 5_000,
  isolationLevel: 'Serializable',
  dbSettingKey: 'app.current_tenant',
});
```

The helper forwards Prisma's public `maxWait`, `timeout`, and `isolationLevel` transaction options, resolves the tenant before opening the transaction, and applies transaction-local `set_config()` before your callback. Prisma 7.10.1 with `PrismaPg` and Prisma 6.19.3's native engine enforce `maxWait` under pool contention. Prisma 6.19.3 with `PrismaPg` accepts the option but does not enforce it under adapter-pool contention; enforce admission outside the helper or use the native engine when that bound is required.

### Use a transaction opened by audit-log

In 0.16.4, pass `tenancyTransactionCallback(tenancyService, work)` directly to the component opening the transaction. For `audit-log@0.7.0` and `soft-delete@0.7.5`, derive a dedicated client from the same base Prisma client. Apply the audit extension first with `consistency: 'atomic-required'` and a tenant resolver that reads the authorized context. Then apply the soft-delete extension with `auditLifecycle: 'atomic-required'`. Keep the per-query tenancy extension on the client used for ordinary queries. The [integration guide](/guide/prisma-extension-chaining) shows the complete setup.

```typescript
import { tenancyTransactionCallback } from '@nestarc/tenancy';
import type { Prisma } from './generated/prisma/client';

// lifecycle is the audit + soft-delete client configured above.
await lifecycle.withAuditTransaction(tenancyTransactionCallback(
  tenancyService,
  async (tx: Prisma.TransactionClient) => tx.invoice.delete({ where: { id: invoiceId } }),
));
```

The wrapper reads the authorized tenant when the owner invokes it, sets the transaction-local RLS key before running `work`, and passes through the owner's transaction client. Missing tenant context, a root Prisma client, or a setting already bound to a different tenant causes rejection before `work` runs. Use one authorized tenant throughout the callback, perform database work through its `tx`, and supply tenant fields explicitly on inserts. Pass timeout and isolation options to the transaction owner. It controls commit and rollback. [Released example and client typing](https://github.com/nestarc/nestjs-tenancy/blob/v0.16.4/README.md#tenant-scoping-an-audit-transaction) · [Callback API](/api/tenancy/#api-tenancytransactioncallback)

### Migrate from transparent transaction detection

`interactiveTransactionSupport: true` is deprecated and scheduled for removal in 0.17. Earlier 0.16 deployments used the following configuration to detect interactive transactions through Prisma internals. Migrate each transaction according to its owner and exercise the [PostgreSQL lifecycle checks](https://github.com/nestarc/nestjs-tenancy/blob/v0.16.4/test/ecosystem/audit-lifecycle/verify.mjs) before removing the option.

```typescript
const prisma = basePrisma.$extends(
  createPrismaTenancyExtension(tenancyService, {
    interactiveTransactionSupport: true,
  })
);
```

## PgBouncer transaction mode

The pooler verification lane introduced in 0.15 verifies PgBouncer transaction mode with `pool_mode = transaction` and `max_prepared_statements = 200`. Use a direct PostgreSQL URL for Prisma CLI and migrations, and route runtime application queries through the pooler URL. With the pinned PgBouncer 1.25.2 configuration, do not add the legacy `pgbouncer=true` URL parameter.

The pinned lane uses PostgreSQL 16.14, PgBouncer 1.25.2 transaction mode, Prisma 6.19.3, and Prisma 7.10.1. This lane exercises `tenancyTransaction()` on the base client. The release matrix covers reused and replaced physical backends, tenant A → tenant B → no-context isolation, commit, callback/database rollback, timeout, pool contention, and concurrent clients on both Prisma 6 and 7. Managed poolers and custom settings are outside that exact contract, so reproduce the same isolation suite with your production configuration before rollout. [Release CI matrix](https://github.com/nestarc/nestjs-tenancy/blob/v0.16.4/.github/workflows/ci.yml#L147-L167)

## Current RLS and setting-key contract

Set a custom `dbSettingKey` once on `TenancyModule`. The Prisma extension, `tenancyTransaction()`, and `tenancyTransactionCallback()` inherit it. Generate SQL with the same key.

Version 0.16 validates exactly one required scalar Prisma `String` mapping per tenant column. UUID columns use a reset-safe UUID predicate, while TEXT-family columns keep text comparisons. Every generated tenant table also needs a restrictive non-empty-context policy. Apply the reviewed SQL with `psql -v ON_ERROR_STOP=1` and run `tenancy check` plus the live `tenancy doctor`. See [the upgrade procedure](./migration#upgrade-to-0-16), including existing-policy preservation and generated-name changes.

## HTTP adapter prerequisites

Core hooks use the small `TenancyRequest` / `TenancyResponse` interfaces. Express supplies `path` and response helpers; Fastify middleware can receive raw Node request/response objects instead of `FastifyRequest` / `FastifyReply`. Register authentication and cookie parsing at the middleware stage, and use response methods appropriate to the actual object. From 0.16.1, `PathTenantExtractor` uses `request.url` when `request.path` is absent; see [path extraction and earlier-version guidance](./extractors#path-parameter). Public structural types alone do not establish full adapter integration coverage.
