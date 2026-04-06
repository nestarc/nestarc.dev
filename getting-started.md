---
description: "Set up a multi-tenant NestJS API in 5 minutes with @nestarc/tenancy, Prisma, and PostgreSQL RLS."
---

# Getting Started

Get your first multi-tenant API running in 5 minutes.

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| NestJS | 10 or 11 |
| Prisma | 5 or 6 |
| PostgreSQL | 14+ |

## Step 1: Install

```bash
npm install @nestarc/tenancy
```

## Step 2: Enable RLS on your table

```sql
ALTER TABLE users ADD COLUMN tenant_id TEXT NOT NULL;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant', true)::text);
```

## Step 3: Register the module

```typescript
import { TenancyModule } from '@nestarc/tenancy';

@Module({
  imports: [
    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id',
    }),
  ],
})
export class AppModule {}
```

## Step 4: Extend Prisma

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

## Step 5: Query with tenant isolation

```typescript
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    // Automatically filtered by RLS — only current tenant's data
    return this.prisma.client.user.findMany();
  }
}
```

```bash
curl -H "X-Tenant-Id: 550e8400-e29b-41d4-a716-446655440000" \
  http://localhost:3000/users
```

That's it. All Prisma queries are now scoped to the tenant via PostgreSQL RLS.

::: tip Next Steps
- [Tenant Extractors](/packages/tenancy/extractors) — Subdomain, JWT, Path, and more
- [Extension Options](/packages/tenancy/installation#extension-options) — auto-inject, shared models, fail-closed
- [CLI Scaffolding](/packages/tenancy/cli) — `npx @nestarc/tenancy init` generates RLS policies from your Prisma schema
:::

## Stack Overview

All nestarc packages share a common foundation and compose via Prisma extensions:

```
┌─────────────────────────────────────────────────┐
│                  Your NestJS App                │
├────────┬────────┬──────────┬──────────┬─────────┤
│tenancy │  audit │ feature  │  soft    │paginate │
│        │  -log  │  -flag   │ -delete  │  -ion   │
├────────┴────────┴──────────┴──────────┴─────────┤
│              safe-response (API layer)          │
├─────────────────────────────────────────────────┤
│           Prisma Client Extensions              │
├─────────────────────────────────────────────────┤
│              PostgreSQL + RLS                   │
└─────────────────────────────────────────────────┘
```

| Package | Role |
|---------|------|
| [@nestarc/tenancy](/packages/tenancy/) | Row-level tenant isolation via PostgreSQL RLS |
| [@nestarc/safe-response](/packages/safe-response/) | Standardized API response wrapping + Swagger |
| [@nestarc/audit-log](/packages/audit-log/) | Automatic CUD change tracking |
| [@nestarc/feature-flag](/packages/feature-flag/) | DB-based feature flags with tenant overrides |
| [@nestarc/soft-delete](/packages/soft-delete/) | Prisma soft-delete with cascade and restore |
| [@nestarc/pagination](/packages/pagination/) | Cursor + offset pagination with filters |

### Prisma Extension Chaining

Multiple nestarc packages compose as Prisma extensions:

```typescript
const prisma = new PrismaClient()
  .$extends(createPrismaTenancyExtension(tenancyService))
  .$extends(createPrismaSoftDeleteExtension({ softDeleteModels: ['User'] }))
  .$extends(createAuditExtension({ trackedModels: ['User'] }));
```

::: info
Extension order matters. See the [Prisma Extension Chaining](/guide/prisma-extension-chaining) guide for details.
:::
