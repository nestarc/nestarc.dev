---
description: "Add transaction-first audit logging to an existing NestJS + Prisma app with @nestarc/audit-log."
---

# Adding Audit Trail to an Existing App

This guide walks through adding `@nestarc/audit-log` to an existing NestJS + Prisma application. By the end, supported mutations on your tracked models will produce automatic audit rows in the same transaction, and you will have a manual logging API for business events.

If you want the shorter problem-first explanation before following the full recipe, start with the [NestJS audit log code example](/blog/nestjs-audit-log-without-refactoring).

::: warning v0.4.0 requires an explicit consistency mode
This guide uses `consistency: 'atomic-required'`. Tracked business mutations must run through `withAuditTransaction()`, which commits or rolls back the mutation, audit reads, and audit insert together. The legacy `best-effort` mode must now be selected explicitly and can still leave orphan success rows or stale diffs after caller rollback.
:::

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

The package ships a utility that creates the `audit_logs` table, fail-loud append-only triggers, and indexes for you.

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
REVOKE ALL ON TABLE audit_logs FROM PUBLIC;
REVOKE ALL ON TABLE audit_logs FROM your_runtime_role;
GRANT SELECT, INSERT ON TABLE audit_logs TO your_runtime_role;
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE audit_logs FROM your_runtime_role;
```

Do not leave the placeholder unchanged or assume every deployment role is named `app_user`. Retention and schema maintenance stay on a separate privileged workflow. Keep the owner credential out of the running application; the `PrismaService` below uses the restricted runtime `DATABASE_URL` instead. Row triggers do not protect `TRUNCATE`, and a table owner or superuser can disable or replace them, so role separation and monitoring remain the authoritative controls.

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
| **Audited client** | Used by your application code --- automatic tracking and the transaction helper live here |

If your app already has a `PrismaService`, refactor it to expose the base + audited client pattern:

```typescript
// prisma.service.ts
import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { createAuditedClient } from '@nestarc/audit-log';
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

  /** Audited client --- use this for application queries */
  readonly client = createAuditedClient(this.base, {
    consistency: 'atomic-required',
    trackedModels: ['User', 'Invoice'],
    sensitiveFields: ['password', 'ssn'],
    prismaModule,
  });

  async onModuleInit() {
    await this.base.$connect();
  }
}
```

::: warning Update your service classes
After this change, use `this.prisma.client` for application queries and wrap every tracked mutation in `this.prisma.client.withAuditTransaction(...)`. In `atomic-required`, a tracked mutation issued outside the helper is rejected before its business query executes.
:::

`createAuditedClient()` accepts the audit extension options and exposes the typed transaction helper:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `consistency` | `'atomic-required' \| 'best-effort'` | required | `atomic-required` fails closed and requires `withAuditTransaction()`; `best-effort` preserves legacy non-atomic behavior |
| `trackedModels` | `string[]` | all models when omitted | Allowlist of Prisma model names to track. `trackedModels: []` means no models are audited |
| `ignoredModels` | `string[]` | `[]` | Denylist used only when `trackedModels` is not set |
| `sensitiveFields` | `string[]` | `[]` | Keys masked recursively as `[REDACTED]` in scalar and nested JSON diffs |
| `sensitiveFieldsByModel` | `Record<string, string[]>` | `{}` | Per-model fields unioned with `sensitiveFields` |
| `primaryKey` | `Record<string, string>` | `{ *: 'id' }` | Custom PK field per model |
| `databaseMapping` | `Record<string, { tableName; schema?; primaryKeyColumn? }>` | `{}` | PostgreSQL identifiers for atomic row locks when public Prisma mapping metadata is unavailable |
| `maxBatchRecords` | `number` | `1000` | Maximum records audited individually by `deleteMany` |
| `batchOverflow` | `'reject' \| 'summary'` | `'reject'` | Cap overflow behavior; `summary` is available only in `best-effort` |
| `tableName` | `string` | `audit_logs` | Audit table used by automatic inserts |
| `tenantRequired` | `boolean` | `false` | Missing tenant rolls back atomic mutations; best-effort skips the audit row and reports it |
| `tenantResolver` | `() => string \| null` | — | Custom tenant lookup before the `@nestarc/tenancy` fallback |
| `onAuditError` | `(error, context) => void` | — | Structured automatic-audit failure callback |
| `logger` | `AuditLogger` | `console` | Logger used for audit warnings and errors |
| `logFailures` | `boolean` | `false` | Records best-effort failure rows when business writes throw |
| `ignoreTimestampOnlyUpdates` | `boolean` | `false` | Suppress `@updatedAt`-only update entries |
| `prismaModule` | generated Prisma namespace | legacy fallback | Required with the Prisma 7 `prisma-client` generator |
| `experimentalTxAudit` | `boolean` | `false` | Deprecated best-effort compatibility path; cannot be combined with `atomic-required` |

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

With Prisma 7, pass the same `prismaModule` object to both `createAuditedClient()` and `AuditLogModule`. Prisma 5/6 consumers can keep their existing `@prisma/client` import and client construction until they upgrade Prisma.
:::

## Step 5: Automatic Tracking

Run every tracked mutation through `withAuditTransaction()`. The callback receives the audited official Prisma interactive transaction client; the business mutation, before/after reads, and audit insert either commit together or roll back together.

```typescript
// user.service.ts
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    return this.prisma.client.withAuditTransaction((tx) =>
      tx.user.create({ data }),
    );
  }

  async updateEmail(id: string, email: string) {
    return this.prisma.client.withAuditTransaction((tx) =>
      tx.user.update({
        where: { id },
        data: { email },
      }),
    );
  }

  async deleteUser(id: string) {
    return this.prisma.client.withAuditTransaction((tx) =>
      tx.user.delete({ where: { id } }),
    );
  }
}
```

Group related mutations in one helper call when they form one unit of work. The helper also accepts Prisma's `timeout`, `maxWait`, and `isolationLevel` options, preserves callback/result types, and rejects nested helper calls:

```typescript
await this.prisma.client.withAuditTransaction(
  async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { status: 'active' },
    });
    await tx.invoice.create({ data: invoice });
  },
  { timeout: 10_000, maxWait: 5_000, isolationLevel: 'Serializable' },
);
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
- **Recursive sensitive masking** --- Keys listed in `sensitiveFields` are replaced with `"[REDACTED]"` in scalar values and nested JSON objects or arrays.
- **Immediate preimages** --- Single-row update, delete, and upsert lock the target and refresh its preimage before mutation, so concurrent audited writers record the immediately committed previous value.
- **Fail-closed context** --- Tracked writes outside the helper, audit read/insert failures, and missing required tenant context reject and roll back instead of silently degrading.

### Bulk Mutation Contract

Atomic mode distinguishes record evidence from count-only activity summaries:

| Operation | `atomic-required` behavior |
|-----------|----------------------------|
| `createMany` | Rejected before mutation; use sequential `create()` calls inside `withAuditTransaction()` |
| `updateMany` | Rejected before mutation; use sequential `update()` calls inside the helper |
| `deleteMany` | Locks and captures at most `maxBatchRecords`, then writes one `Model.deleted` row per deleted record in the same transaction |
| `createManyAndReturn` / `updateManyAndReturn` | Outside the automatic tracking contract; do not use them for tracked models |

An atomic `deleteMany` rolls back on cap overflow, a preimage/affected-count mismatch, or any audit insert failure. Explicit `best-effort` writes count-level summary rows for `createMany` and `updateMany`; its optional `batchOverflow: 'summary'` delete fallback is only an activity marker and is not record evidence.

Array `$transaction([...])` is outside the atomic contract and is rejected when detected. Express the work as sequential calls inside one `withAuditTransaction()` callback.

If a tracked model uses `@@map`, `@@schema`, or a mapped primary-key column and your generated Prisma namespace does not expose public mapping metadata, configure `databaseMapping`. A missing or incorrect mapping fails closed before the mutation rather than locking the wrong row.

### Nested Write Contract

In `atomic-required`, nested relation operations targeting another tracked model --- including `create`, `createMany`, `connect`, `connectOrCreate`, `disconnect`, `update`, `updateMany`, `upsert`, `delete`, `deleteMany`, and `set` --- are rejected before the business query. Express each related-model mutation explicitly inside `withAuditTransaction()` so every affected record receives its own atomic audit row.

Relations whose target model is intentionally outside your tracking configuration do not trigger the guard when Prisma exposes the relation metadata. If the required metadata is unavailable, atomic mode fails conservatively. Explicit `best-effort` keeps the top-level mutation and only warns about the nested boundary, so it is not authoritative evidence for the related changes.

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
    await this.prisma.client.withAuditTransaction((tx) =>
      tx.invoice.update({
        where: { id: invoiceId },
        data: { status: 'approved', approvedAt: new Date() },
      }),
    );

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

The automatic row and manual business event are separate commits in this first example. Use the transactional pattern below when both records and the business mutation must succeed or fail together.

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
This is intentionally a manual-only audit path: the write goes through `prisma.base`, so it does not also produce an automatic `Invoice.updated` row. Passing the same base transaction client to `AuditService.log()` makes the `invoice.approved` row and business mutation commit or roll back together.

In a tenancy/RLS application, use `tenancyTransaction(prisma.base, tenancyService, ...)` for this manual-only pattern so the business write and audit row share both the tenant setting and transaction. See [Prisma Extension Chaining](/guide/prisma-extension-chaining#interactive-transactions-with-tenancy).
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

### Export and Durable Delivery Next Steps

Use `query()` for newest-first UI pages. For a large export, use `scan()` instead: it walks `(created_at, id)` forward in bounded pages, fixes a high-watermark when the scan begins, and never runs `COUNT(*)`. Export scope is deliberately explicit; pass exactly one of `tenantId` or authorized `allTenants: true` because `scan()` never uses ambient tenant context.

```typescript
const state = (await loadScanState(jobId)) ?? {
  checkpoint: null as string | null,
  highWatermark: null as string | null,
};

for await (const page of this.audit.scan({
  tenantId: 'tenant-1',
  action: 'invoice.*',
  batchSize: 500,
  ...(state.checkpoint ? { after: state.checkpoint } : {}),
  ...(state.highWatermark ? { until: state.highWatermark } : {}),
})) {
  if (!page.checkpoint) continue;

  if (!state.highWatermark) {
    state.highWatermark = page.highWatermark;
    await saveScanState(jobId, state); // fix the bounded resume point first
  }

  await deliver(page.entries);
  state.checkpoint = page.checkpoint;
  await saveScanState(jobId, state); // advance only after ACK
}
```

Persist the checkpoint only after delivery is acknowledged. To resume the same bounded run, pass both the saved checkpoint as `after` and its saved high-watermark as `until`, with the same filters. `exportCsv()` builds a backpressure-aware Node.js `Readable` on the same scan primitive, with stable `v1` columns, RFC 4180 escaping, canonical JSON, and spreadsheet formula-injection defense.

For recurring SIEM or object-storage delivery, move to `AuditStreamRunner` with a durable checkpoint/DLQ store such as `PostgresAuditStreamStore`. The runner is host-scheduled (`runOnce()`); it does not start background timers, delivery is at least once, and receivers must deduplicate stable batch or entry IDs. If retention is enabled, protect required streams with `prune({ requiredCheckpoints })` and block pruning at the host policy layer until a required stream has its first checkpoint. See the [full audit-log documentation](/packages/audit-log/) for CSV columns, stream sinks, retries, and retention coordination.

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

Use `@AuditAction()` to override the auto-generated action name (for example, `User.updated`). This is helpful when you want a more descriptive action in your audit log.

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

If your application uses `@nestarc/tenancy`, audit logging can read its request context automatically. Configure `tenantRequired` independently on both the audited client and the Nest module when tenant context must be mandatory:

```typescript
// prisma.service.ts -- automatic CUD tracking
import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { createAuditedClient } from '@nestarc/audit-log';
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
    const tenantClient = this.base.$extends(
      createPrismaTenancyExtension(tenancyService, {
        autoInjectTenantId: true,
        tenantIdField: 'tenantId',
        interactiveTransactionSupport: true,
      }),
    );

    this.client = createAuditedClient(tenantClient, {
      consistency: 'atomic-required',
      trackedModels: ['User', 'Invoice'],
      sensitiveFields: ['password', 'ssn'],
      prismaModule,
      tenantRequired: true,
    });
  }
}
```

Register tenancy first so its Prisma query callback establishes the PostgreSQL transaction setting before audit tracking. `TenancyModule` supplies request context, but it does not replace the Prisma tenancy extension or enforce RLS by itself. This example opts into tenancy's transparent interactive-transaction support; that tenancy option relies on Prisma internals, so test it against your exact Prisma version. The audit implementation itself binds the official interactive transaction without private Prisma APIs.

The audited-client option controls automatic tracking, while the module option below controls `AuditService.log()`, `query()`, and `getById()`; the two option objects are not merged.

Audit-log v0.4 exposes an atomic soft-delete lifecycle bridge, but the currently published `@nestarc/soft-delete` v0.6.0 does not yet expose the matching `auditLifecycle` / `auditMaxBatchRecords` integration. Do not configure those options until a compatible soft-delete release is installed. With v0.6.0, keep the lifecycle-event bridge when best-effort notification is sufficient, or perform the explicit soft-delete update and `AuditService.log(input, tx)` in one tenant-scoped transaction when the row must be atomic. See [Prisma Extension Chaining](/guide/prisma-extension-chaining) for the current compatibility boundary.

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
| No tenancy integration and `tenantRequired: false` | Writes `tenant_id = null` |
| Installed, tenant context available | `tenant_id` auto-injected into records and query filters |
| Automatic tracking, `tenantRequired: false` | Writes an audit row with `tenant_id = null` |
| Atomic tracking, `tenantRequired: true` | Throws and rolls back the business mutation and audit work |
| Best-effort tracking, `tenantRequired: true` | Skips the audit row, reports `audit entry skipped`, and returns the business mutation |
| `AuditService.log()` with `tenantRequired: true` | Throws unless ambient tenant context is available |
| `AuditService.query()` / `getById()` with `tenantRequired: true` | Throws unless tenant context is available or a supported explicit tenant/all-tenants query option is provided |
| `AuditService.scan()` / `exportCsv()` | Never uses ambient scope; requires exactly one of `tenantId` or `allTenants: true` |

::: tip
Use `tenantRequired: true` with `atomic-required` in production multi-tenant deployments so missing or throwing tenant resolution fails closed and rolls back the mutation. Module-side `log()` needs ambient context; query/get-by-id paths fail closed unless context is available or an explicitly authorized query uses their supported tenant/all-tenants option. `tenantId` and `allTenants` are mutually exclusive.
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
2. **Refactored PrismaService** to expose a base client and an audited client from `createAuditedClient()`
3. **Registered AuditLogModule** with an `actorExtractor` to identify who is making requests
4. **Got atomic automatic tracking** by running supported mutations through `withAuditTransaction()`
5. **Used manual logging** via `AuditService.log()` for business events
6. **Queried audit records** with wildcard filters and keyset cursors
7. **Controlled route behavior** with `@NoAudit()` and `@AuditAction()` decorators
8. **Integrated with multi-tenancy** for tenant-scoped audit records
9. **Identified export and streaming paths** with `scan()`, `exportCsv()`, and `AuditStreamRunner`

For the full API reference, see the [@nestarc/audit-log package documentation](/packages/audit-log/).
