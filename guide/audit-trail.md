---
description: "Add automatic audit logging to an existing NestJS + Prisma app with @nestarc/audit-log — track every CUD operation."
---

# Adding Audit Trail to an Existing App

This guide walks through adding `@nestarc/audit-log` to an existing NestJS + Prisma application. By the end, every create, update, and delete on your tracked models will be recorded automatically, and you will have a manual logging API for business events.

## Why Audit Logging Matters

If you are building a SaaS product, audit logging is not optional --- it is infrastructure.

- **Compliance** --- Regulations like SOC 2, HIPAA, and GDPR require you to prove who did what and when. An append-only audit log gives you that proof.
- **Debugging** --- When a customer reports that their data changed unexpectedly, an audit trail lets you reconstruct exactly what happened without digging through application logs.
- **Accountability** --- In multi-user workspaces, teams need visibility into who modified a record, approved an invoice, or changed a permission.

`@nestarc/audit-log` handles all of this with minimal setup: automatic Prisma change tracking, before/after diffs, sensitive field masking, and append-only PostgreSQL storage that prevents tampering.

## Prerequisites

This guide assumes you already have:

- A NestJS 10+ application
- Prisma 5+ with a PostgreSQL database
- At least one Prisma model you want to track (we will use `User` and `Invoice` as examples)

## Step 1: Install

```bash
npm install @nestarc/audit-log
```

## Step 2: Create the audit_logs Table

The package ships a utility that creates the `audit_logs` table, append-only rules, and indexes for you.

The simplest approach is to run this in a one-off setup script or seed file:

```typescript
import { PrismaClient } from '@prisma/client';
import { applyAuditTableSchema } from '@nestarc/audit-log';

const prisma = new PrismaClient();

async function main() {
  await applyAuditTableSchema(prisma);
  console.log('audit_logs table created');
}

main()
  .finally(() => prisma.$disconnect());
```

::: tip Migration-friendly alternative
If you manage your schema through a migration tool, use `getAuditTableSQL()` to get the raw SQL string and paste it into a migration file instead:

```typescript
import { getAuditTableSQL } from '@nestarc/audit-log';

console.log(getAuditTableSQL());
```

You can also use `getAuditTableStatements()` if your tool requires individual SQL statements.
:::

## Step 3: Set Up PrismaService

`@nestarc/audit-log` relies on two Prisma clients with distinct roles:

| Client | Role |
|--------|------|
| **Base client** | Used internally by `AuditService` for writing and querying audit records |
| **Extended client** | Used by your application code --- CUD tracking fires on this client |

If your app already has a `PrismaService`, you will refactor it to expose both clients.

**Before** --- typical single-client setup:

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

**After** --- base + extended client pattern:

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createAuditExtension } from '@nestarc/audit-log';

@Injectable()
export class PrismaService implements OnModuleInit {
  /** Base client --- for audit storage (log/query) */
  readonly base = new PrismaClient();

  /** Extended client --- use this for all application queries */
  readonly client = this.base.$extends(
    createAuditExtension({
      trackedModels: ['User', 'Invoice'],
      sensitiveFields: ['password', 'ssn'],
    }),
  );

  async onModuleInit() {
    await this.base.$connect();
  }
}
```

::: warning Update your service classes
After this change, replace all `this.prisma.user.create(...)` calls with `this.prisma.client.user.create(...)`. Only the extended client triggers audit tracking.
:::

The `createAuditExtension` options control what gets tracked:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `trackedModels` | `string[]` | --- | Whitelist of Prisma model names to track |
| `ignoredModels` | `string[]` | --- | Blacklist (used when `trackedModels` is not set) |
| `sensitiveFields` | `string[]` | `[]` | Fields masked as `[REDACTED]` in diffs |
| `primaryKey` | `Record<string, string>` | `{ *: 'id' }` | Custom PK field per model |

If your `PrismaModule` is not already global, make sure it is:

```typescript
// prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

## Step 4: Register AuditLogModule

Register `AuditLogModule` in your root module. The `actorExtractor` callback tells the library how to identify who is making the request.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { AuditLogModule } from '@nestarc/audit-log';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    PrismaModule,
    AuditLogModule.forRootAsync({
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        prisma: prisma.base,
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

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `prisma` | `PrismaClient` | Yes | The base client --- not the extended one |
| `actorExtractor` | `(req) => AuditActor` | Yes | Extracts actor identity from the HTTP request |
| `tenantRequired` | `boolean` | No | When `true`, throws if tenant context is missing (see [Multi-tenancy](#multi-tenancy-integration)) |

::: info
Pass the **base** client to `AuditLogModule`, not the extended client. The module uses it for raw audit log reads and writes. The extended client is what your services use for tracked business operations.
:::

## Step 5: Automatic Tracking

That is all the setup. Now, every create, update, delete, and upsert through the extended client is automatically recorded.

```typescript
// user.service.ts
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    return this.prisma.client.user.create({ data });
  }

  async updateEmail(id: string, email: string) {
    return this.prisma.client.user.update({
      where: { id },
      data: { email },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.client.user.delete({ where: { id } });
  }
}
```

Each of these operations produces an audit entry. For example, updating a user's email generates a record like:

```json
{
  "id": "clx9...",
  "action": "User.update",
  "actor_id": "user-42",
  "actor_type": "user",
  "actor_ip": "203.0.113.10",
  "target_id": "user-7",
  "target_type": "User",
  "before": { "email": "old@example.com" },
  "after": { "email": "new@example.com" },
  "timestamp": "2026-04-05T10:30:00.000Z"
}
```

Key behaviors to note:

- **Diffs only** --- `before` and `after` contain only the fields that changed, not the full record.
- **Deep JSON comparison** --- Nested JSON fields are diffed correctly.
- **Sensitive masking** --- Fields listed in `sensitiveFields` appear as `"[REDACTED]"` in both `before` and `after`.
- **Batch operations** --- `createMany`, `updateMany`, and `deleteMany` are also tracked.
- **Transaction safe** --- If you wrap operations in `$transaction`, the audit extension participates in the caller's transaction. The audit insert itself is best-effort and will not cause your business write to fail.

## Step 6: Manual Logging

Not every auditable event is a database write. For business-level events --- approving an invoice, exporting a report, revoking an API key --- use `AuditService.log()` directly.

```typescript
import { Injectable } from '@nestjs/common';
import { AuditService } from '@nestarc/audit-log';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async approve(invoiceId: string) {
    await this.prisma.client.invoice.update({
      where: { id: invoiceId },
      data: { status: 'approved', approvedAt: new Date() },
    });

    // The update above is auto-tracked as "Invoice.update".
    // This adds a separate business-level event:
    await this.audit.log({
      action: 'invoice.approved',
      targetId: invoiceId,
      targetType: 'Invoice',
      metadata: { previousStatus: 'pending' },
    });
  }
}
```

### Transactional Manual Logging

When a manual log entry must succeed or fail together with a database write, pass the transaction client:

```typescript
async approve(invoiceId: string) {
  await this.prisma.base.$transaction(async (tx) => {
    await tx.invoice.update({
      where: { id: invoiceId },
      data: { status: 'approved' },
    });

    await this.audit.log(
      {
        action: 'invoice.approved',
        targetId: invoiceId,
        targetType: 'Invoice',
      },
      tx, // audit entry rolls back if the transaction fails
    );
  });
}
```

::: warning
When using transactional manual logging, pass `tx` from `prisma.base.$transaction`, not from the extended client. The audit service writes directly to the `audit_logs` table through the base client.
:::

## Step 7: Querying Audit Logs

Use `AuditService.query()` to search audit records. This is useful for building admin dashboards, compliance reports, or debugging tools.

```typescript
@Controller('admin/audit')
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  async getAuditLogs(
    @Query('actorId') actorId?: string,
    @Query('action') action?: string,
    @Query('targetType') targetType?: string,
  ) {
    return this.audit.query({
      actorId,
      action,       // supports wildcards: 'invoice.*'
      targetType,
      from: new Date('2026-01-01'),
      to: new Date(),
      limit: 50,
      offset: 0,
    });
  }
}
```

The response shape is:

```typescript
{ entries: AuditEntry[], total: number }
```

### Wildcard Filters

The `action` parameter supports wildcard matching with `*`:

| Pattern | Matches |
|---------|---------|
| `invoice.*` | `invoice.approved`, `invoice.rejected`, `invoice.voided` |
| `User.*` | `User.create`, `User.update`, `User.delete` |
| `*` | Everything |

### Available Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `actorId` | `string` | Filter by the ID of the user who performed the action |
| `action` | `string` | Filter by action name (supports `*` wildcards) |
| `targetType` | `string` | Filter by the type of resource that was affected |
| `from` | `Date` | Start of the date range |
| `to` | `Date` | End of the date range |
| `limit` | `number` | Maximum entries to return |
| `offset` | `number` | Number of entries to skip for pagination |

## Step 8: Route-level Control

Sometimes you need to suppress audit logging on specific routes or override the auto-generated action name.

### @NoAudit()

Use `@NoAudit()` to skip audit tracking entirely for a handler or controller. This is useful for health checks, internal sync endpoints, or high-frequency read-write paths where audit logging would be too noisy.

```typescript
import { Controller, Post, Get } from '@nestjs/common';
import { NoAudit } from '@nestarc/audit-log';

@Controller('internal')
export class InternalController {
  @NoAudit()
  @Post('sync')
  async syncFromUpstream() {
    // CUD operations here will NOT be audit-logged
  }
}
```

You can also apply `@NoAudit()` at the controller level to skip tracking for all routes in that controller:

```typescript
@NoAudit()
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
```

### @AuditAction()

Use `@AuditAction()` to override the auto-generated action name (which defaults to `ModelName.operation`). This is helpful when you want a more descriptive action in your audit log.

```typescript
import { Controller, Patch, Param, Body } from '@nestjs/common';
import { AuditAction } from '@nestarc/audit-log';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @AuditAction('user.role.changed')
  @Patch(':id/role')
  async changeRole(@Param('id') id: string, @Body('role') role: string) {
    return this.userService.updateRole(id, role);
  }
}
```

With this decorator, the audit entry's `action` field will be `user.role.changed` instead of the default `User.update`.

## Step 9: Multi-tenancy Integration

If your application uses `@nestarc/tenancy`, audit logging picks it up automatically. There is no additional configuration required --- `tenant_id` is injected into every audit record and query filter.

```typescript
// app.module.ts
@Module({
  imports: [
    PrismaModule,
    TenancyModule.forRoot({ /* ... */ }),
    AuditLogModule.forRootAsync({
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        prisma: prisma.base,
        actorExtractor: (req) => ({
          id: req.user?.id ?? null,
          type: req.user ? 'user' : 'system',
          ip: req.ip,
        }),
        tenantRequired: true, // fail-closed: throw if tenant context is missing
      }),
    }),
  ],
})
export class AppModule {}
```

The behavior depends on how tenancy is configured:

| Scenario | Behavior |
|----------|----------|
| `@nestarc/tenancy` not installed | `tenant_id` is `null` --- library works normally |
| Installed, tenant context available | `tenant_id` auto-injected into records and query filters |
| Installed, tenant context fails | Warning logged, `tenant_id` falls back to `null` |
| `tenantRequired: true` + context fails | `log()` and `query()` throw an error |

::: tip
Use `tenantRequired: true` in production multi-tenant deployments. This fail-closed approach prevents audit entries from being written without a tenant context, which could lead to data leaking across tenants in query results.
:::

When querying, you do not need to pass `tenant_id` manually --- it is automatically scoped to the current tenant:

```typescript
// This query is automatically filtered to the current tenant
const result = await this.audit.query({
  action: 'invoice.*',
  limit: 50,
});
```

## Summary

Here is what you set up in this guide:

1. **Installed** `@nestarc/audit-log` and created the `audit_logs` table
2. **Refactored PrismaService** to expose a base client and an extended client with `createAuditExtension`
3. **Registered AuditLogModule** with an `actorExtractor` to identify who is making requests
4. **Got automatic tracking** for all CUD operations on tracked models
5. **Used manual logging** via `AuditService.log()` for business events
6. **Queried audit records** with wildcard filters and pagination
7. **Controlled route behavior** with `@NoAudit()` and `@AuditAction()` decorators
8. **Integrated with multi-tenancy** for tenant-scoped audit records

For the full API reference, see the [@nestarc/audit-log package documentation](/packages/audit-log/).
