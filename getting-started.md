---
description: "Set up a multi-tenant NestJS API in 5 minutes with @nestarc/tenancy, Prisma, and PostgreSQL RLS."
---

# Getting Started

Build a working multi-tenant API endpoint in 5 minutes.

Not sure which module to adopt first? Start with the [package comparison](/packages/) or the [Adoption Roadmap](/guide/adoption-roadmap).

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | `^20.19.0`, `^22.12.0`, or `>=24.0.0` |
| NestJS | 10 or 11 |
| Prisma | 7 recommended; 6 supported by tenancy |
| PostgreSQL | 14+ |

::: tip Already configured these dependencies?
Skip to [Step 2](#step-2-enable-rls) only if `@nestarc/tenancy`, the Prisma 7 PostgreSQL adapter, `prisma.config.ts`, and the generated client are already in place.
:::

## Step 1: Install

```bash
npm install @nestarc/tenancy @prisma/client @prisma/adapter-pg pg dotenv
npm install --save-dev prisma
```

This quick start assumes the generated client and `prisma.config.ts` are configured as shown in [Prisma 7 Setup](/guide/prisma-7).

## Step 2: Enable RLS

This example assumes an existing, empty `users` table that matches the model below except for `tenant_id`. Add the tenant column, index, and Row Level Security as the schema owner:

```sql
ALTER TABLE users ADD COLUMN tenant_id TEXT NOT NULL;
CREATE INDEX users_tenant_id_idx ON users (tenant_id);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant', true)::text);
```

Expose the same table in your Prisma schema, then regenerate the client:

```prisma
model User {
  id       String @id @default(uuid())
  name     String
  tenantId String @map("tenant_id")

  @@index([tenantId], map: "users_tenant_id_idx")
  @@map("users")
}
```

```bash
npx prisma generate
```

If you use Prisma Migrate, put the column, index, and RLS statements in the same migration instead of applying them as ad-hoc SQL.

::: warning Existing production rows
`ADD COLUMN ... NOT NULL` only succeeds on an empty table. For an existing table, add a nullable column, backfill every row from a trusted tenant-ownership source, verify the mapping, and only then apply `NOT NULL`. Do not assign unrelated rows to a single fallback tenant.
:::

::: warning
Both `ENABLE` and `FORCE` are required. Without `FORCE`, the table owner role bypasses RLS entirely. See [5 Common Multi-Tenancy Pitfalls](/blog/nestjs-multi-tenancy-pitfalls) for details.
:::

## Step 3: Register the Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TenancyModule } from '@nestarc/tenancy';
import { PrismaService } from './prisma.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id',
    }),
  ],
  controllers: [UsersController],
  providers: [PrismaService, UsersService],
})
export class AppModule {}
```

::: warning Authenticate tenant selection in production
The raw `X-Tenant-Id` header keeps this local example short, but it does not prove that a caller may access that tenant. In production, derive the tenant from an authenticated JWT claim or [cross-check the header against one](/packages/tenancy/lifecycle-hooks#tenant-id-forgery-prevention).
:::

## Step 4: Extend Prisma

```typescript
// prisma.service.ts
import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { TenancyService, createPrismaTenancyExtension } from '@nestarc/tenancy';

@Injectable()
export class PrismaService implements OnModuleInit {
  public readonly client;

  constructor(private readonly tenancyService: TenancyService) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    const basePrisma = new PrismaClient({ adapter });
    this.client = basePrisma.$extends(
      createPrismaTenancyExtension(tenancyService, {
        autoInjectTenantId: true,
        // Use the Prisma field name; @map("tenant_id") handles the SQL column.
        tenantIdField: 'tenantId',
      }),
    );
  }

  async onModuleInit() {
    await this.client.$connect();
  }
}
```

Run migrations and RLS setup with a schema-owner credential, but connect the application through a separate non-owner, non-superuser role. Have a database administrator or provisioning process run `CREATE ROLE` (it requires PostgreSQL `CREATEROLE` or superuser privilege); the migration owner can then apply the grants:

```sql
CREATE ROLE app_user LOGIN PASSWORD 'replace-with-a-secret';
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users TO app_user;
```

Set the runtime `DATABASE_URL` to that role (for example, `postgresql://app_user:...@localhost:5432/app`). Keep schema-owner credentials out of the running application.

For separate credentials, point `prisma.config.ts` at `env('MIGRATION_DATABASE_URL')` and keep the adapter above on `DATABASE_URL`. The former owns schema migrations; the latter is the restricted runtime connection.

## Step 5: Create an API Endpoint

```typescript
// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { TenancyService } from '@nestarc/tenancy';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

  findAll() {
    // RLS automatically filters by tenant — no manual WHERE clause needed
    return this.prisma.client.user.findMany();
  }

  create(name: string) {
    const tenantId = this.tenancy.getCurrentTenantOrThrow();
    return this.prisma.client.user.create({ data: { name, tenantId } });
  }
}
```

Prisma's generated `UserCreateInput` still requires `tenantId` at compile time, so the service supplies the resolved tenant context rather than accepting it from the request body. The extension overwrites the same field at runtime to prevent body-level spoofing and also covers bulk write paths. In production, authenticate or cross-check that resolved context as described above.

```typescript
// users/users.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body('name') name: string) {
    return this.usersService.create(name);
  }
}
```

## Step 6: Test It

```bash
# Create a user as tenant A
curl -X POST http://localhost:3000/users \
  -H "X-Tenant-Id: 550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'

# Create a user as tenant B
curl -X POST http://localhost:3000/users \
  -H "X-Tenant-Id: 123e4567-e89b-42d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob"}'

# Query as tenant A — only sees Alice
curl http://localhost:3000/users \
  -H "X-Tenant-Id: 550e8400-e29b-41d4-a716-446655440000"
# => [{"id":"<uuid>","name":"Alice","tenantId":"550e8400-e29b-41d4-a716-446655440000"}]

# Query as tenant B — only sees Bob
curl http://localhost:3000/users \
  -H "X-Tenant-Id: 123e4567-e89b-42d3-a456-426614174000"
# => [{"id":"<uuid>","name":"Bob","tenantId":"123e4567-e89b-42d3-a456-426614174000"}]
```

That's it. With the RLS policy and application role configured as above, PostgreSQL filters queries by the current tenant without a manual application-level `WHERE` clause.

## What's Next?

<div style="display: grid; grid-template-columns: 1fr; gap: 12px; margin: 24px 0;">

::: tip 5 min — Standardize your API responses
Add `@nestarc/safe-response` to auto-wrap all responses with consistent error codes, pagination metadata, and Swagger schemas. [Quick Start →](/packages/safe-response/installation)
:::

::: tip 10 min — Add audit logging
Track create, update, and delete operations through an explicit transaction-first write boundary. [Quick Start →](/packages/audit-log/installation)
:::

::: tip 30 min — Full tutorial
Build a complete multi-tenant task management API with tenancy + safe-response + testing. [Full Tutorial →](/guide/multi-tenant-saas)
:::

</div>

See the [package comparison](/packages/) and [Adoption Roadmap](/guide/adoption-roadmap) for the recommended adoption path.

## Stack Overview

All nestarc packages share a common foundation and compose via Prisma extensions:

```
Your NestJS App
|-- Request/API layer: safe-response, pagination, idempotency, api-keys
|-- Domain/data layer: tenancy, audit-log, soft-delete, feature-flag, rbac
|-- Events/workers: outbox, webhook, data-subject, jobs
`-- PostgreSQL + Prisma
```

| Package | Role |
|---------|------|
| [@nestarc/tenancy](/packages/tenancy/) | Row-level tenant isolation via PostgreSQL RLS |
| [@nestarc/safe-response](/packages/safe-response/) | Standardized API response wrapping + Swagger |
| [@nestarc/audit-log](/packages/audit-log/) | Automatic CUD change tracking |
| [@nestarc/feature-flag](/packages/feature-flag/) | DB-based feature flags with tenant overrides |
| [@nestarc/soft-delete](/packages/soft-delete/) | Prisma soft-delete with cascade and restore |
| [@nestarc/pagination](/packages/pagination/) | Cursor + offset pagination with filters |
| [@nestarc/idempotency](/packages/idempotency/) | IETF draft-07-compatible idempotency with response/header replay |
| [@nestarc/outbox](/packages/outbox/) | Transactional outbox for reliable domain events |
| [@nestarc/webhook](/packages/webhook/) | Outbound webhook delivery with signing, retry, and logs |
| [@nestarc/api-keys](/packages/api-keys/) | Tenant-scoped machine authentication with scopes, rotation, IP policy, and lifecycle hooks |
| [@nestarc/rbac](/packages/rbac/) | Tenant-aware roles, permissions, and resource-scoped guards |
| [@nestarc/data-subject](/packages/data-subject/) | GDPR/CCPA export and erase workflows |
| [@nestarc/jobs](/packages/jobs/) | Tenant-aware jobs with in-memory fairness, durable BullMQ retry/dedupe, and first-party outbox publishing |

### Tooling

`@nestarc/mcp-guard` is published under the same npm scope, but is separate from the NestJS SaaS module stack. It statically scans MCP servers and client configuration files before you connect them to AI coding tools. See [mcp-guard](/tools/mcp-guard/).

### Prisma Extension Chaining

Multiple nestarc packages compose as Prisma extensions:

```typescript
const lifecycleModels = ['User'];
const lifecycleBatchCap = 1000;

const prisma = basePrisma
  .$extends(createPrismaTenancyExtension(tenancyService, {
    autoInjectTenantId: true,
    tenantIdField: 'tenantId',
    interactiveTransactionSupport: true,
  }))
  .$extends(createAuditExtension({
    consistency: 'atomic-required',
    trackedModels: lifecycleModels,
    maxBatchRecords: lifecycleBatchCap,
    databaseMapping: { User: { tableName: 'users' } },
    prismaModule,
  }))
  .$extends(createPrismaSoftDeleteExtension({
    softDeleteModels: lifecycleModels,
    auditLifecycle: 'atomic-required',
    auditMaxBatchRecords: lifecycleBatchCap,
    dmmf: prismaDmmf,
  }));

await prisma.withAuditTransaction((tx) =>
  tx.user.delete({ where: { id: userId } }),
);
```

::: info
Use the supported `@nestarc/audit-log` 0.5.0 / `@nestarc/soft-delete` 0.7.1 tuple and preserve the fixed tenancy → audit-log → soft-delete order. Set `auditLifecycle: 'atomic-required'`, keep the soft-delete model list, audit `trackedModels`, deployed `databaseMapping`, batch caps, and DMMF aligned, and run delete, restore, purge, and cascade mutations inside `withAuditTransaction()`. This multi-tenant example opts into tenancy's interactive-transaction support; validate it against your exact Prisma version. In Prisma 7, audit-log also needs the generated `{ Prisma }` namespace as `prismaModule`.

Adding audit-log narrows the runtime to Node.js 22.13+ within 22.x or Node.js 24.x. Audit-log accepts NestJS 12.0.1+, but the complete tenancy/audit/soft-delete chain currently shares NestJS 10/11. Explicit `best-effort` is intentionally non-atomic: rollback can leave orphan success rows and transaction-local diffs can be stale. See the [Prisma Extension Chaining](/guide/prisma-extension-chaining) guide for details.
:::
