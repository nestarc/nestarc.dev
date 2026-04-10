---
description: "Set up a multi-tenant NestJS API in 5 minutes with @nestarc/tenancy, Prisma, and PostgreSQL RLS."
---

# Getting Started

Build a working multi-tenant API endpoint in 5 minutes.

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| NestJS | 10 or 11 |
| Prisma | 5 or 6 |
| PostgreSQL | 14+ |

::: tip Already have a NestJS + Prisma project?
Skip to [Step 2](#step-2-enable-rls).
:::

## Step 1: Install

```bash
npm install @nestarc/tenancy
```

## Step 2: Enable RLS

Add a `tenant_id` column and enable Row Level Security on your table:

```sql
ALTER TABLE users ADD COLUMN tenant_id TEXT NOT NULL;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant', true)::text);
```

::: warning
Both `ENABLE` and `FORCE` are required. Without `FORCE`, the table owner role bypasses RLS entirely. See [5 Common Multi-Tenancy Pitfalls](/blog/nestjs-multi-tenancy-pitfalls) for details.
:::

## Step 3: Register the Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TenancyModule } from '@nestarc/tenancy';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id',
    }),
    UsersModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
```

## Step 4: Extend Prisma

```typescript
// prisma.service.ts
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

## Step 5: Create an API Endpoint

```typescript
// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    // RLS automatically filters by tenant — no manual WHERE clause needed
    return this.prisma.client.user.findMany();
  }

  create(name: string) {
    // tenant_id is auto-injected by the Prisma extension
    return this.prisma.client.user.create({ data: { name } });
  }
}
```

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
# Create a user as tenant-a
curl -X POST http://localhost:3000/users \
  -H "X-Tenant-Id: tenant-a" \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'

# Create a user as tenant-b
curl -X POST http://localhost:3000/users \
  -H "X-Tenant-Id: tenant-b" \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob"}'

# Query as tenant-a — only sees Alice
curl http://localhost:3000/users -H "X-Tenant-Id: tenant-a"
# => [{"id": 1, "name": "Alice", "tenantId": "tenant-a"}]

# Query as tenant-b — only sees Bob
curl http://localhost:3000/users -H "X-Tenant-Id: tenant-b"
# => [{"id": 2, "name": "Bob", "tenantId": "tenant-b"}]
```

That's it. PostgreSQL RLS enforces tenant isolation at the database level — no data leaks, no manual filtering.

## What's Next?

<div style="display: grid; grid-template-columns: 1fr; gap: 12px; margin: 24px 0;">

::: tip 5 min — Standardize your API responses
Add `@nestarc/safe-response` to auto-wrap all responses with consistent error codes, pagination metadata, and Swagger schemas. [Quick Start →](/packages/safe-response/installation)
:::

::: tip 10 min — Add audit logging
Track every create, update, and delete automatically — no code changes to your services. [Quick Start →](/packages/audit-log/installation)
:::

::: tip 30 min — Full tutorial
Build a complete multi-tenant task management API with tenancy + safe-response + testing. [Full Tutorial →](/guide/multi-tenant-saas)
:::

</div>

See the [Adoption Roadmap](/guide/adoption-roadmap) for the recommended order to add packages.

## Stack Overview

All nestarc packages share a common foundation and compose via Prisma extensions:

```
┌─────────────────────────────────────────────────────────────┐
│                      Your NestJS App                       │
├────────┬────────┬──────────┬──────────┬─────────┬──────────┤
│tenancy │  audit │ feature  │  soft    │paginate │idempot-  │
│        │  -log  │  -flag   │ -delete  │  -ion   │  ency    │
├────────┴────────┴──────────┴──────────┴─────────┴──────────┤
│              safe-response (API layer)                     │
├─────────────────────────────────────────────────────────────┤
│           Prisma Client Extensions                         │
├─────────────────────────────────────────────────────────────┤
│              PostgreSQL + RLS                              │
└─────────────────────────────────────────────────────────────┘
```

| Package | Role |
|---------|------|
| [@nestarc/tenancy](/packages/tenancy/) | Row-level tenant isolation via PostgreSQL RLS |
| [@nestarc/safe-response](/packages/safe-response/) | Standardized API response wrapping + Swagger |
| [@nestarc/audit-log](/packages/audit-log/) | Automatic CUD change tracking |
| [@nestarc/feature-flag](/packages/feature-flag/) | DB-based feature flags with tenant overrides |
| [@nestarc/soft-delete](/packages/soft-delete/) | Prisma soft-delete with cascade and restore |
| [@nestarc/pagination](/packages/pagination/) | Cursor + offset pagination with filters |
| [@nestarc/idempotency](/packages/idempotency/) | IETF-standard idempotency with response replay |

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
