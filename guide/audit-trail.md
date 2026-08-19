---
description: "Add automatic audit logging to an existing NestJS + Prisma app with @nestarc/audit-log — track every CUD operation."
---

# Adding Audit Trail to an Existing App

This guide walks through adding `@nestarc/audit-log` to an existing NestJS + Prisma application. By the end, every create, update, and delete on your tracked models will be recorded automatically, and you will have a manual logging API for business events.

If you want the shorter problem-first explanation before following the full recipe, start with the [NestJS audit log code example](/blog/nestjs-audit-log-without-refactoring).

## Why Audit Logging Matters

For many SaaS products, audit logging is a foundational operational and security control.

- **Compliance evidence** --- An audit trail can support controls, investigations, and evidence collection for frameworks or regulations such as SOC 2, HIPAA, and GDPR. Exact requirements depend on scope and jurisdiction, and a log is not sufficient by itself.
- **Debugging** --- When a customer reports that their data changed unexpectedly, an audit trail lets you reconstruct exactly what happened without digging through application logs.
- **Accountability** --- In multi-user workspaces, teams need visibility into who modified a record, approved an invoice, or changed a permission.

`@nestarc/audit-log` provides automatic Prisma change tracking, before/after diffs, sensitive field masking, and fail-loud PostgreSQL protections against ordinary UPDATE and DELETE operations. Database owners and privileged roles remain part of your threat model, and your broader retention, access, monitoring, and review controls still apply.

## Prerequisites

This guide assumes you already have:

- Node.js `^20.19.0`, `^22.12.0`, or `^24.0.0` and a NestJS 10 or 11 application
- Prisma 7 with a PostgreSQL database (Prisma 5/6 remain legacy-compatible)
- At least one Prisma model you want to track (we will use `User` and `Invoice` as examples)

The examples below use the Prisma 7 generated client and PostgreSQL driver adapter. Complete [Prisma 7 Setup](/guide/prisma-7) first if your application still uses `prisma-client-js` or constructs `PrismaClient` without an adapter.

## Step 1: Install

```bash
npm install @nestarc/audit-log @prisma/client @prisma/adapter-pg pg dotenv
npm install --save-dev prisma tsx
```

## Step 2: Create the audit_logs Table

The package ships a utility that creates the `audit_logs` table, append-only rules, and indexes for you.

The simplest approach is to run this in a one-off setup script or seed file:

```typescript
// scripts/setup-audit.ts
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { applyAuditTableSchema } from '@nestarc/audit-log';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.MIGRATION_DATABASE_URL!,
  }),
});

async function main() {
  await applyAuditTableSchema(prisma);
  console.log('audit_logs table created');
}

main()
  .finally(() => prisma.$disconnect());
```

Run the one-off script with the schema-owner URL, then remove that credential from the shell/session:

```bash
npx tsx scripts/setup-audit.ts
```

`MIGRATION_DATABASE_URL` should use a schema-owner credential for this one-off DDL step. In the same checked-in migration or provisioning workflow, replace `your_runtime_role` with the application's actual non-owner role and grant only its normal query/log permissions:

```sql
GRANT SELECT, INSERT ON audit_logs TO your_runtime_role;
```

Do not leave the placeholder unchanged or assume every deployment role is named `app_user`. Retention and schema maintenance stay on a separate privileged workflow. Keep the owner credential out of the running application; the `PrismaService` below uses the restricted runtime `DATABASE_URL` instead.

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

If your app already has a `PrismaService`, refactor it to expose the base + extended client pattern:

```typescript
// prisma.service.ts
import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { createAuditExtension } from '@nestarc/audit-log';
import { Prisma, PrismaClient } from '../generated/prisma/client';

export const prismaModule = { Prisma };

@Injectable()
export class PrismaService implements OnModuleInit {
  /** Base client --- for audit storage (log/query) */
  readonly base = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

  /** Extended client --- use this for all application queries */
  readonly client = this.base.$extends(
    createAuditExtension({
      trackedModels: ['User', 'Invoice'],
      sensitiveFields: ['password', 'ssn'],
      prismaModule,
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
| `trackedModels` | `string[]` | all models when omitted | Allowlist of Prisma model names to track. `trackedModels: []` means no models are audited |
| `ignoredModels` | `string[]` | `[]` | Denylist used only when `trackedModels` is not set |
| `sensitiveFields` | `string[]` | `[]` | Fields masked as `[REDACTED]` in diffs |
| `sensitiveFieldsByModel` | `Record<string, string[]>` | `{}` | Per-model fields unioned with `sensitiveFields` |
| `primaryKey` | `Record<string, string>` | `{ *: 'id' }` | Custom PK field per model |
| `ignoreTimestampOnlyUpdates` | `boolean` | `false` | Suppress `@updatedAt`-only update entries |

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
import { PrismaService, prismaModule } from './prisma/prisma.service';

@Module({
  imports: [
    PrismaModule,
    AuditLogModule.forRootAsync({
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        prisma: prisma.base,
        prismaModule,
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

`actorExtractor` runs from audit middleware. The example assumes trusted authentication middleware registered earlier has already verified the credential and populated `req.user`. A Passport/Nest guard that sets `req.user` later in the request lifecycle is too late for this extractor; move principal resolution to earlier middleware (or provide an extractor backed by an equivalently verified earlier context) and add an integration test that asserts the stored actor.

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `prisma` | `PrismaClient` | Yes | The base client --- not the extended one |
| `prismaModule` | generated Prisma namespace | With Prisma 7 | Pass `{ Prisma }` from the generated client output |
| `actorExtractor` | `(req) => AuditActor \| Promise<AuditActor>` | Yes | Extracts actor identity from the HTTP request |
| `tenantRequired` | `boolean` | No | When `true`, `log()` requires ambient tenant context; `query()`/`getById()` require context unless their supported explicit tenant/all-tenants option is used |

::: info
Pass the **base** client to `AuditLogModule`, not the extended client. The module uses it for raw audit log reads and writes. The extended client is what your services use for tracked business operations.

With Prisma 7, pass the same `prismaModule` object to both `createAuditExtension()` and `AuditLogModule`. Prisma 5/6 consumers can keep their existing `@prisma/client` import and client construction until they upgrade Prisma.
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
  "id": "0f06a36c-6d06-4d76-b2a8-852731c1ee85",
  "tenantId": null,
  "action": "User.updated",
  "actorId": "user-42",
  "actorType": "user",
  "actorIp": "203.0.113.10",
  "targetId": "user-7",
  "targetType": "User",
  "source": "auto",
  "changes": {
    "email": {
      "before": "old@example.com",
      "after": "new@example.com"
    }
  },
  "metadata": null,
  "result": "success",
  "createdAt": "2026-04-05T10:30:00.000Z"
}
```

Key behaviors to note:

- **Diffs only** --- `changes` contains one `{ before, after }` entry per changed field, not the full record.
- **Deep JSON comparison** --- Nested JSON fields are diffed correctly.
- **Sensitive masking** --- Fields listed in `sensitiveFields` appear as `"[REDACTED]"` in both `before` and `after`.
- **Batch operations** --- `createMany`, `updateMany`, and `deleteMany` are also tracked.
- **Explicit transaction contract** --- Business writes keep the caller `$transaction`, but automatic audit inserts are best-effort via the base client and do not join the caller transaction. If a caller transaction rolls back, an automatic audit row can remain as an orphan row. Use manual `AuditService.log(input, tx)` when the audit row must roll back with the business write.

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

    // The update above is auto-tracked as "Invoice.updated".
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

In a tenancy/RLS application, open this transaction with `tenancyTransaction(prisma.base, tenancyService, ...)` instead so the business write and manual audit row share both the tenant setting and transaction. See [Prisma Extension Chaining](/guide/prisma-extension-chaining#interactive-transactions-with-tenancy).
:::

## Step 7: Querying Audit Logs

Use `AuditService.query()` to search audit records. This is useful for building admin dashboards, compliance reports, or debugging tools.

::: danger Protect audit readers
Put this controller behind application-owned authentication and audit-reader authorization guards. In a multi-tenant deployment, enable `tenantRequired` so ordinary requests are scoped to the resolved tenant. Allow an explicit all-tenants query only after a separate, logged administrator authorization decision; `audit_logs` itself is not tenant-isolated by PostgreSQL RLS in the default schema.
:::

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
      source: 'auto',
      result: 'success',
      from: new Date('2026-01-01'),
      to: new Date(),
      limit: 50,
      includeTotal: false,
    });
  }
}
```

The response shape is:

```typescript
{
  entries: AuditEntry[];
  nextCursor: string | null;
  hasMore: boolean;
  total?: number;
}
```

### Wildcard Filters

The `action` parameter supports wildcard matching with `*`:

| Pattern | Matches |
|---------|---------|
| `invoice.*` | `invoice.approved`, `invoice.rejected`, `invoice.voided` |
| `User.*` | `User.created`, `User.updated`, `User.deleted` |
| `*` | Everything |

### Available Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `actorId` | `string` | Filter by the ID of the user who performed the action |
| `action` | `string` | Filter by action name (supports `*` wildcards) |
| `targetType` | `string` | Filter by the type of resource that was affected |
| `source` | `'auto' \| 'manual'` | Filter by automatic or manual audit source |
| `result` | `'success' \| 'failure'` | Filter by audit result |
| `from` | `Date` | Start of the date range |
| `to` | `Date` | End of the date range |
| `limit` | `number` | Maximum entries to return |
| `cursor` | `string` | Continue after a previous page's `nextCursor` |
| `includeTotal` | `boolean` | When `false`, skips the `COUNT(*)` query and omits `total` |
| `tenantId` | `string` | Explicitly scope to a tenant |
| `allTenants` | `boolean` | Intentional authorized cross-tenant admin read |

Rows are ordered newest-first by `(created_at, id)`. Keep the same filter set when using `nextCursor`; cursors do not encode filters.

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

Use `@AuditAction()` to override the auto-generated action name (for example, `User.updated`; create/delete and batch operations use their corresponding past-tense names). This is helpful when you want a more descriptive action in your audit log.

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

With this decorator, the audit entry's `action` field will be `user.role.changed` instead of the default `User.updated`.

## Step 9: Multi-tenancy Integration

If your application uses `@nestarc/tenancy`, audit logging can read its request context automatically. Configure `tenantRequired` independently on both the Prisma extension and the Nest module when tenant context must be mandatory:

```typescript
// prisma.service.ts -- automatic CUD tracking
import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { createAuditExtension } from '@nestarc/audit-log';
import {
  TenancyService,
  createPrismaTenancyExtension,
} from '@nestarc/tenancy';
import { Prisma, PrismaClient } from '../generated/prisma/client';

const prismaModule = { Prisma };

@Injectable()
export class PrismaService {
  readonly base = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

  readonly client;

  constructor(private readonly tenancyService: TenancyService) {
    this.client = this.base
      .$extends(
        createPrismaTenancyExtension(tenancyService, {
          autoInjectTenantId: true,
          tenantIdField: 'tenantId',
        }),
      )
      .$extends(
        createAuditExtension({
          trackedModels: ['User', 'Invoice'],
          sensitiveFields: ['password', 'ssn'],
          prismaModule,
          tenantRequired: true,
        }),
      );
  }
}
```

Register tenancy first so its Prisma query callback establishes the PostgreSQL transaction setting before later callbacks. `TenancyModule` supplies request context, but it does not replace the Prisma tenancy extension or enforce RLS by itself. The audit extension option controls automatic tracking, while the module option below controls `AuditService.log()` and `query()`; the two option objects are not merged. The current soft-delete delete path short-circuits later query callbacks, so integrate its lifecycle event or use an explicit transaction when deletion audit is required. See [Prisma Extension Chaining](/guide/prisma-extension-chaining) when other extensions are present.

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
        prismaModule,
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
| Automatic tracking, `tenantRequired: false` | Writes an audit row with `tenant_id = null` |
| Automatic tracking, `tenantRequired: true` | Skips the audit row, reports `audit entry skipped`, and the business mutation still returns |
| `AuditService.log()` with `tenantRequired: true` | Throws unless ambient tenant context is available |
| `AuditService.query()` / `getById()` with `tenantRequired: true` | Throws unless tenant context is available or a supported explicit tenant/all-tenants query option is provided |

::: tip
Use `tenantRequired: true` in production multi-tenant deployments. Automatic tracking stays best-effort and will not fail the business mutation. Module-side `log()` needs ambient context; query/get-by-id paths fail closed unless context is available or an explicitly authorized query uses their supported tenant/all-tenants option.
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
6. **Queried audit records** with wildcard filters and keyset cursors
7. **Controlled route behavior** with `@NoAudit()` and `@AuditAction()` decorators
8. **Integrated with multi-tenancy** for tenant-scoped audit records

For the full API reference, see the [@nestarc/audit-log package documentation](/packages/audit-log/).
