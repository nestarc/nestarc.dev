---
description: "Install and configure @nestarc/tenancy — enable PostgreSQL RLS, register TenancyModule, and set up the Prisma extension."
---

# Installation

```bash
npm install @nestarc/tenancy
npm install @prisma/client @prisma/adapter-pg pg dotenv
npm install --save-dev prisma
```

tenancy 0.15 supports Prisma 7 and 6 and requires Node.js 20.19 or newer. Prisma 7 is the primary E2E target and additionally requires Node.js `^20.19.0`, `^22.12.0`, or `>=24.0.0`. PostgreSQL 16.14, PgBouncer 1.25.2 transaction mode, Prisma 6.19.3, and Prisma 7.9.1 form the release's pinned pooler verification matrix.

## Quick Start

### 1. Enable RLS on your PostgreSQL tables

Every table that needs tenant isolation must have a `tenant_id` column and an RLS policy:

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

-- The `true` parameter means missing_ok: returns NULL instead of error when unset.
-- At the database layer, queries without tenant context return 0 rows (not an error).
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

#### Extension Options

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
| `interactiveTransactionSupport` | `boolean` | `false` | **Deprecated.** Compatibility-only transparent mode based on Prisma internals. Use `tenancyTransaction()` for interactive transactions. |

`autoInjectTenantId` changes runtime arguments but does not make a required tenant field optional in Prisma's generated TypeScript input. For type-safe `create`/`upsert` code, read the value with `tenancyService.getCurrentTenantOrThrow()` and include it in `data`; the extension overwrites it from the same resolved context at runtime. Authenticate or cross-check client-supplied tenant identifiers before treating that context as trusted.

> **Important:** If you customize `dbSettingKey` in `TenancyModule.forRoot()`, pass the same value to `createPrismaTenancyExtension()` and `tenancyTransaction()`. These are independent configurations that must match your PostgreSQL `current_setting()` calls.

> **Note:** By default, the Prisma extension uses batch transactions internally, which do not propagate `set_config` into interactive transactions (`$transaction(async (tx) => ...)`). Use the `tenancyTransaction()` helper. The deprecated `interactiveTransactionSupport: true` mode remains only for existing consumers. See [Interactive Transactions](#interactive-transactions) below.

> **Migration note:** If you intentionally rely on model queries without tenant context reaching PostgreSQL RLS, set `failClosed: false` explicitly. `sharedModels` and `withoutTenant()` only bypass client-extension behavior; they do not bypass database RLS. Shared tables need an explicit database policy, while cross-tenant administration needs a separate, tightly authorized connection and audit policy.

### Interactive Transactions

The default Prisma extension wraps queries in batch transactions, which breaks inside `$transaction(async (tx) => ...)`. Two approaches are available:

**Option 1: `tenancyTransaction()` helper (recommended)**

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

The helper forwards Prisma's public `maxWait`, `timeout`, and `isolationLevel` transaction options, resolves the tenant before opening the transaction, and applies transaction-local `set_config()` before your callback. Prisma 7.9.1 with `PrismaPg` and Prisma 6.19.3's native engine enforce `maxWait` under pool contention. Prisma 6.19.3 with `PrismaPg` accepts the option but does not enforce it under adapter-pool contention; enforce admission outside the helper or use the native engine when that bound is required.

> **Compatibility note:** `interactiveTransactionSupport: true` is deprecated because it relies on Prisma internal APIs. Existing users should keep an exact-version PostgreSQL E2E lane while migrating to `tenancyTransaction()`.

**Option 2: Deprecated transparent compatibility mode**

This remains available for existing consumers. Startup validates one required Prisma hook, but internal transaction metadata can still change between Prisma releases.

```typescript
const prisma = basePrisma.$extends(
  createPrismaTenancyExtension(tenancyService, {
    interactiveTransactionSupport: true,
  })
);
```

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

All Prisma queries are automatically scoped to that tenant via RLS.

## PgBouncer transaction mode

Version 0.15 verifies PgBouncer transaction mode with `pool_mode = transaction` and `max_prepared_statements = 200`. Use a direct PostgreSQL URL for Prisma CLI and migrations, and route runtime application queries through the pooler URL. With the pinned PgBouncer 1.25.2 configuration, do not add the legacy `pgbouncer=true` URL parameter.

`tenancyTransaction()` is the canonical interactive-transaction path. The release matrix covers reused and replaced physical backends, tenant A → tenant B → no-context isolation, commit, callback/database rollback, timeout, pool contention, and concurrent clients on both Prisma 6 and 7. Managed poolers and custom settings are outside that exact contract, so reproduce the same isolation suite with your production configuration before rollout.
