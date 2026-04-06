---
description: "Install and configure @nestarc/tenancy — enable PostgreSQL RLS, register TenancyModule, and set up the Prisma extension."
---

# Installation

```bash
npm install @nestarc/tenancy
```

## Quick Start

### 1. Enable RLS on your PostgreSQL tables

Every table that needs tenant isolation must have a `tenant_id` column and an RLS policy:

```sql
-- Ensure your table has a tenant_id column
ALTER TABLE users ADD COLUMN tenant_id TEXT NOT NULL;

-- Enable RLS (FORCE ensures table owners also obey policies)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

-- Create isolation policy
CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant', true)::text);

-- The `true` parameter means missing_ok: returns '' instead of error when unset.
-- This ensures queries without tenant context return 0 rows (not an error).
-- Repeat for each tenant-scoped table
```

> **Critical:** RLS is bypassed by superusers and (without `FORCE ROW LEVEL SECURITY`) by table owners. Create a dedicated application role that does **not** own the tables:
> ```sql
> CREATE ROLE app_user LOGIN PASSWORD 'your_password';
> GRANT USAGE ON SCHEMA public TO app_user;
> GRANT SELECT, INSERT, UPDATE, DELETE ON your_table TO app_user;
> ```
> Use this role's connection string in your application. If you connect as a superuser, RLS policies are silently bypassed.

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

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenancyService, createPrismaTenancyExtension } from '@nestarc/tenancy';

@Injectable()
export class PrismaService implements OnModuleInit {
  public readonly client;

  constructor(private readonly tenancyService: TenancyService) {
    const prisma = new PrismaClient();
    this.client = prisma.$extends(
      createPrismaTenancyExtension(tenancyService),
    );
  }

  async onModuleInit() {
    await this.client.$connect();
  }
}
```

#### Extension Options

```typescript
createPrismaTenancyExtension(tenancyService, {
  dbSettingKey: 'app.current_tenant',  // PostgreSQL setting key (default)
  autoInjectTenantId: true,            // Auto-inject tenant_id on create/upsert
  tenantIdField: 'tenant_id',          // Column name for tenant ID (default)
  sharedModels: ['Country', 'Currency'], // Models that skip RLS entirely
})
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dbSettingKey` | `string` | `'app.current_tenant'` | PostgreSQL session variable name |
| `autoInjectTenantId` | `boolean` | `false` | Auto-inject tenant ID into `create`, `createMany`, `createManyAndReturn`, `upsert` |
| `tenantIdField` | `string` | `'tenant_id'` | Column name to inject tenant ID into |
| `sharedModels` | `string[]` | `[]` | Models that bypass RLS (no `set_config`, no injection) |
| `failClosed` | `boolean` | `false` | Block queries when no tenant context is set (prevents accidental data exposure if RLS is misconfigured) |
| `interactiveTransactionSupport` | `boolean` | `false` | Enable transparent `set_config` inside interactive transactions. Validates Prisma compatibility at startup — throws immediately if unsupported. Alternative: `tenancyTransaction()` helper |
| `experimentalTransactionSupport` | `boolean` | `false` | **Deprecated** — use `interactiveTransactionSupport`. Preserves fallback-to-batch behavior when Prisma internals are unavailable. Will be removed in v1.0 |

> **Important:** If you customize `dbSettingKey` in `TenancyModule.forRoot()`, pass the same value to `createPrismaTenancyExtension()` and `tenancyTransaction()`. These are independent configurations that must match your PostgreSQL `current_setting()` calls.

> **Note:** By default, the Prisma extension uses batch transactions internally, which do not propagate `set_config` into interactive transactions (`$transaction(async (tx) => ...)`). Enable `interactiveTransactionSupport: true` for transparent handling, or use the `tenancyTransaction()` helper. See [Interactive Transactions](#interactive-transactions) below.

### Interactive Transactions

The default Prisma extension wraps queries in batch transactions, which breaks inside `$transaction(async (tx) => ...)`. Two approaches are available:

**Option 1: `tenancyTransaction()` helper (recommended)**

Uses only public Prisma APIs. Works with all Prisma versions.

```typescript
import { tenancyTransaction } from '@nestarc/tenancy';

await tenancyTransaction(prisma, tenancyService, async (tx) => {
  const user = await tx.user.findFirst();
  await tx.order.create({ data: { userId: user.id } });
});
```

**Option 2: Transparent mode**

Sets RLS context automatically inside interactive transactions. Validates Prisma compatibility at startup.

```typescript
const prisma = basePrisma.$extends(
  createPrismaTenancyExtension(tenancyService, {
    interactiveTransactionSupport: true,
  })
);
```

> `interactiveTransactionSupport` relies on Prisma internal APIs. If your Prisma version is incompatible, extension creation throws immediately with a clear error message. Use `tenancyTransaction()` as a fallback.

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
