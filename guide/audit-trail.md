---
description: "Add audit logging to one NestJS + Prisma workflow, then verify the actor, role change, masking, and rollback with audit-log 0.7.0."
reviewed: 2026-09-29
versionScope: "@nestarc/audit-log 0.7.0, Node.js ^22.13 || ^24, NestJS 10/11/12.0.1+, PostgreSQL, and Prisma 5/6/7"
---

# Adding Audit Trail to an Existing App

Start with one role change: an authorized operator changes a user from `member` to `admin`, and the audit trail records who did it and the previous value. Expand coverage after you have verified that first record and a rollback.

**[Run the 0.7.0 example](/packages/audit-log/quickstart)** for an executable end-to-end check, or **[choose an adoption path](/packages/audit-log/adoption)** for your existing app:

- **One business event:** keep an ordinary Prisma transaction and add `await audit.log(input, tx)`. No automatic extension is needed.
- **One tracked model:** use `trackedModels: ['User']` and move its selected write path to `withAuditTransaction()`. The package captures field diffs automatically.

This guide explains the automatic path and its manual alternative. The [code example](/blog/nestjs-audit-log-without-refactoring) provides a shorter walkthrough.

::: tip Verify the transaction boundary
With `consistency: 'atomic-required'`, supported tracked writes through `withAuditTransaction()` commit or roll back with their automatic audit rows. Explicit `best-effort` is non-atomic and can leave orphan success rows or stale transaction-local diffs. Base-client writes, raw SQL, and database cascades are not automatically covered.
:::

## Prerequisites

This guide assumes you already have:

- Node.js `^22.13.0 || ^24.0.0` and a NestJS 10, 11, or 12.0.1+ application
- Prisma 7 with a PostgreSQL database (Prisma 5/6 remain legacy-compatible)
- A `User` Prisma model with `id` and `role` fields; the example changes `member` to `admin`

The examples below use the Prisma 7 generated client and PostgreSQL driver adapter. For a Prisma 7 app, follow [Prisma 7 Setup](/guide/prisma-7). Existing Prisma 5/6 apps can keep their current client construction; upgrading Prisma is not required to adopt audit-log.

## Step 1: Install

```bash
npm install @nestarc/audit-log@0.7.0
# For the Prisma 7 example below:
npm install @prisma/client@7 @prisma/adapter-pg@7 pg dotenv
npm install --save-dev prisma@7 tsx
```

## Step 2: Share Configuration and Create the Audit Table

Use `defineAuditConfig()` to keep the table, actor policy, masking, and generated Prisma namespace consistent. It returns options; schema setup, client creation, and Nest registration remain explicit.

```typescript
// src/audit.config.ts
import { defineAuditConfig } from '@nestarc/audit-log';
import { Prisma } from './generated/prisma/client';

export const auditConfig = defineAuditConfig({
  shared: {
    prismaModule: { Prisma },
    actorRequired: true,
    sensitiveFields: ['password', 'ssn'],
  },
  module: {
    actorExtractionStage: 'interceptor',
    actorExtractor: (req) => ({
      id: req.user?.id ?? null,
      type: 'user',
      ip: req.ip,
    }),
  },
  extension: {
    consistency: 'atomic-required',
    trackedModels: ['User'],
  },
});
```

These are deliberate choices: `actorRequired` defaults to `false`, extraction defaults to `middleware`, and an omitted `trackedModels` tracks all models. For manual-only adoption, omit `extension` and register only the module.

The package ships a utility that creates the `audit_logs` table, fail-loud append-only triggers, and indexes for you.

The simplest approach is to run this in a one-off setup script or seed file:

```typescript
// scripts/setup-audit.ts
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { applyAuditTableSchema } from '@nestarc/audit-log';
import { PrismaClient } from '../src/generated/prisma/client';
import { auditConfig } from '../src/audit.config';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.MIGRATION_DATABASE_URL!,
  }),
});

async function main() {
  await applyAuditTableSchema(prisma, auditConfig.schemaOptions);
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
If you manage your schema through a migration tool, use `getAuditTableSQL(auditConfig.schemaOptions)` to get the raw SQL string and paste it into a migration file instead:

```typescript
import { getAuditTableSQL } from '@nestarc/audit-log';
import { auditConfig } from '../src/audit.config';

console.log(getAuditTableSQL(auditConfig.schemaOptions));
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
// src/prisma/prisma.service.ts
import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { createAuditedClient } from '@nestarc/audit-log';
import { PrismaClient } from '../generated/prisma/client';
import { auditConfig } from '../audit.config';

@Injectable()
export class PrismaService implements OnModuleInit {
  /** Base client --- for audit storage (log/query) */
  readonly base = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

  /** Audited client --- use this for application queries */
  readonly client = createAuditedClient(this.base, auditConfig.extensionOptions);

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
| `actorRequired` | `boolean` | `false` | Requires a non-blank string actor ID for all actor types; atomic writes fail before mutation, while best-effort omits the audit row and reports the error |
| `tenantResolver` | `() => string \| null` | — | Custom tenant lookup replacing the optional `@nestarc/tenancy` lookup; null does not fall back |
| `onAuditError` | `(error, context) => void` | — | Structured automatic-audit failure callback |
| `logger` | `AuditLogger` | `console` | Logger used for audit warnings and errors |
| `logFailures` | `boolean` | `false` | Records best-effort failure rows when business writes throw |
| `ignoreTimestampOnlyUpdates` | `boolean` | `false` | Suppress `@updatedAt`-only update entries |
| `prismaModule` | generated Prisma namespace | legacy fallback | Required with the Prisma 7 `prisma-client` generator |

### Upgrading an existing audit-log installation

Review the [upgrade guidance](/packages/audit-log/migration). In 0.7.0, tracked `createManyAndReturn` and `updateManyAndReturn` now fail before mutation in atomic mode; catching the policy error inside the helper still rolls back the whole transaction. `actorRequired` is opt-in. Older `experimentalTxAudit` configuration was removed in 0.5 and must be replaced with an explicit consistency mode and supported write boundaries.

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
import { auditConfig } from './audit.config';

@Module({
  imports: [
    PrismaModule,
    AuditLogModule.forRootAsync({
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        ...auditConfig.moduleOptions,
        prisma: prisma.base,
      }),
    }),
  ],
})
export class AppModule {}
```

The shared config opts into `actorExtractionStage: 'interceptor'`, added in 0.6.0, so extraction runs once after authentication Guards have populated `req.user`. Keep the global audit interceptor enabled (the default), or register it explicitly when disabling global registration. Extraction does not authenticate the principal or authorize a role change; those remain application responsibilities.

`actorRequired: true` rejects an absent or blank actor ID, including for `type: 'system'`. For workers, establish an explicit identity with `AuditContext.runAs({ id: 'role-sync-worker', type: 'system' }, callback)`. Manual `log()` rejects before INSERT, but an ordinary transaction only rolls back if the error escapes its callback.

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `prisma` | `PrismaClient` | Yes | The base client --- not the extended one |
| `prismaModule` | generated Prisma namespace | With Prisma 7 | Pass `{ Prisma }` from the generated client output |
| `actorExtractor` | `(req) => AuditActor \| Promise<AuditActor>` | Yes | Extracts actor identity from the HTTP request |
| `actorExtractionStage` | `'middleware' \| 'interceptor'` | No | Defaults to middleware; use interceptor for identity populated by Guards |
| `actorRequired` | `boolean` | No | Defaults to false; when enabled, manual writes require a non-blank actor ID |
| `tenantRequired` | `boolean` | No | When `true`, `log()` requires ambient tenant context; `query()`/`getById()` require context unless their supported explicit tenant/all-tenants option is used |

::: info
Pass the **base** client to `AuditLogModule`, not the extended client. The module uses it for raw audit log reads and writes. The extended client is what your services use for tracked business operations.

With Prisma 7, pass the same `prismaModule` object to both `createAuditedClient()` and `AuditLogModule`. Prisma 5/6 consumers can keep their existing `@prisma/client` import and client construction until they upgrade Prisma.
:::

## Step 5: Change One Role and Verify the Record

After the application authorizes the operator, run the role change through `withAuditTransaction()`. The callback's `tx` is the audited official Prisma interactive transaction client. In a multi-tenant app include the authorized `tenantId` in the business query as well as setting audit tenant context.

```typescript
// user.service.ts
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateRole(id: string, role: 'member' | 'admin') {
    return this.prisma.client.withAuditTransaction((tx) =>
      tx.user.update({ where: { id }, data: { role } }),
    );
  }
}
```

For an existing user with role `member`, change the role to `admin`, then query that target after authorizing the audit reader:

```typescript
const page = await audit.query({
  targetType: 'User',
  targetId: userId,
  source: 'auto',
  includeTotal: false,
});
```

Expect these fields (illustrative IDs):

```json
{
  "tenantId": null,
  "action": "User.updated",
  "actorId": "user-42",
  "actorType": "user",
  "targetId": "user-7",
  "targetType": "User",
  "source": "auto",
  "changes": {
    "role": { "before": "member", "after": "admin" }
  },
  "result": "success"
}
```

Confirm the actor and target match the request. In tenant mode, also confirm the authorized tenant. Exercise a sensitive field and verify `[REDACTED]`, then throw after a mutation and confirm both the change and new audit row are absent. Use the [Quick Start checks](/packages/audit-log/quickstart) for these assertions and audit-failure rollback.

Group related supported writes into sequential calls inside one helper. The helper accepts Prisma's `timeout`, `maxWait`, and `isolationLevel` options; nested helper calls are rejected. Since 0.6.0, it remembers atomic audit failures and rejects completion even if your callback catches the error.

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
| `createManyAndReturn` / `updateManyAndReturn` | Rejected before mutation in 0.7.0, inside or outside the helper; catching the error inside the helper still rolls back earlier work |

Returning bulk operations produce no automatic rows in `best-effort`; 0.7.0 warns once per model/operation while preserving business behavior.

An atomic `deleteMany` rolls back on cap overflow, a preimage/affected-count mismatch, or any audit insert failure. Explicit `best-effort` writes count-level summary rows for `createMany` and `updateMany`; its optional `batchOverflow: 'summary'` delete fallback is only an activity marker and is not record evidence.

Array `$transaction([...])` is outside the atomic contract and is rejected when detected. Express the work as sequential calls inside one `withAuditTransaction()` callback.

If a tracked model uses `@@map`, `@@schema`, or a mapped primary-key column and your generated Prisma namespace does not expose public mapping metadata, configure `databaseMapping`. A missing or incorrect mapping fails closed before the mutation rather than locking the wrong row.

### Nested Write Contract

In `atomic-required`, nested relation operations targeting a tracked model --- including `create`, `createMany`, `connect`, `connectOrCreate`, `disconnect`, `update`, `updateMany`, `upsert`, `delete`, `deleteMany`, and `set` --- are rejected before the business query, including through an untracked parent or intermediate relation (fixed in 0.6.0). Express each related-model mutation explicitly inside `withAuditTransaction()` so every affected record receives its own atomic audit row.

Relations whose target model is intentionally outside your tracking configuration do not trigger the guard when Prisma exposes the relation metadata. If the required metadata is unavailable, atomic mode fails conservatively. Explicit `best-effort` keeps the top-level mutation and only warns about the nested boundary, so it is not authoritative evidence for the related changes.

## Step 6: The Manual Alternative

For one business event, keep your base Prisma client and ordinary transaction. Omit the automatic extension from `defineAuditConfig()` and register its module options. This role-change alternative records the before/after values supplied by your application:

```typescript
await prisma.base.$transaction(async (tx) => {
  const before = await tx.user.findUniqueOrThrow({ where: { id: userId } });
  const after = await tx.user.update({
    where: { id: userId },
    data: { role: 'admin' },
  });
  await audit.log(
    {
      action: 'user.role.changed',
      targetId: userId,
      targetType: 'User',
      metadata: { role: { before: before.role, after: after.role } },
    },
    tx,
  );
  return after;
});
```

This writes `source: 'manual'`, action `user.role.changed`, and `metadata.role`. It does not create automatic `changes.role` or a second `User.updated` row because the business write uses the base client. Both reads and writes share the transaction; concurrent business decisions may still need your application's locking or isolation policy.

Await `log(input, tx)` and propagate errors for rollback. Catching a JavaScript audit error inside an ordinary transaction can allow the business change to commit; the automatic helper's failure marker does not apply here. Calling `log(input)` without `tx` is an independent write.

Include authorized tenant predicates in business queries for tenant apps. If you use PostgreSQL RLS, your transaction must also establish the required transaction-local database setting; audit metadata alone does not do that. See [incremental adoption](/packages/audit-log/adoption) for the scoped manual example.

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
      action,       // supports wildcards: 'User.*'
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
  action: 'User.*',
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

Since 0.6.0, `after === until` is treated as a completed range without replay.

Persist the checkpoint only after delivery is acknowledged. To resume the same bounded run, pass both the saved checkpoint as `after` and its saved high-watermark as `until`, with the same filters. `exportCsv()` builds a backpressure-aware Node.js `Readable` on the same scan primitive, with stable `v1` columns, RFC 4180 escaping, canonical JSON, and spreadsheet formula-injection defense.

For recurring SIEM or object-storage delivery, move to `AuditStreamRunner` with a durable checkpoint/DLQ store such as `PostgresAuditStreamStore`. The runner is host-scheduled (`runOnce()`); it does not start background timers, delivery is at least once, and receivers must deduplicate stable batch or entry IDs. If retention is enabled, protect required streams with `prune({ requiredCheckpoints })` and block pruning at the host policy layer until a required stream has its first checkpoint. See the [full audit-log documentation](/packages/audit-log/) for CSV columns, stream sinks, retries, and retention coordination.

## Step 8: Route-level Control

Sometimes you need to suppress audit logging on specific routes or override the auto-generated action name.

### @NoAudit()

Use `@NoAudit()` to skip automatic audit tracking for a handler or controller. Explicit
`AuditService.log()` calls still write records and enforce the module's actor policy. This is
useful for health checks, internal sync endpoints, or paths where automatic tracking would be noisy.

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
  async changeRole(@Param('id') id: string, @Body('role') role: 'member' | 'admin') {
    return this.userService.updateRole(id, role);
  }
}
```

With this decorator, the audit entry's `action` field will be `user.role.changed` instead of the default `User.updated`. It still has `source: 'auto'` and `changes.role`; a renamed automatic action is not a manual business event. Validate the incoming role in your application.

<span id="step-9-multi-tenancy-integration"></span>

## Step 9: Add Tenant Context and Optional Integrations

For a tenant application, put `tenantRequired: true` and a trusted `tenantResolver` in the factory's `shared` section so the module and extension use the same policy:

```typescript
shared: {
  prismaModule: { Prisma },
  actorRequired: true,
  tenantRequired: true,
  tenantResolver: () => tenantScope.getStore()?.tenantId ?? null,
  sensitiveFields: ['password', 'ssn'],
},
```

Here `tenantScope` is application-owned context populated after authenticating the principal and authorizing membership. When no custom resolver is supplied, the package can read optional `@nestarc/tenancy` context. A custom resolver returning `null` does not fall back. Audit context scopes audit records and their readers; it does not authorize the tenant, add business predicates, or enable PostgreSQL RLS.

| Missing context or read path | Behavior |
|---|---|
| No tenant context, `tenantRequired: false` | Writes an audit row with `tenantId: null` |
| Atomic tracking, `tenantRequired: true` | Rejects the mutation and rolls back the helper |
| Best-effort tracking, `tenantRequired: true` | Preserves the business write, omits the audit row, and reports the error |
| Manual `log()`, `tenantRequired: true` | Requires ambient tenant context; propagate failures to roll back an ordinary transaction |
| `query()` / `getById()`, `tenantRequired: true` | Requires context or a supported explicitly authorized tenant/all-tenants option |
| `scan()` / `exportCsv()` | Requires exactly one of explicit `tenantId` or authorized `allTenants: true`; never uses ambient scope |

After authorization, a history read can explicitly select both tenant and target:

```typescript
const page = await audit.query({
  tenantId,
  targetType: 'User',
  targetId: userId,
  includeTotal: false,
});
```

For a tenancy/RLS integration, use the version-scoped [extension composition guide](/guide/prisma-extension-chaining) and verify your exact runtime tuple and rollback behavior. A passing audit-log-only example does not establish cross-package compatibility.

For soft-delete lifecycle auditing with audit-log 0.7.0, use a companion whose peer range includes this release (`@nestarc/soft-delete@0.7.4`). The integration requires tenancy → audit-log → soft-delete ordering when all three are present, `auditLifecycle: 'atomic-required'` on both the soft-delete extension and module, aligned batch caps, and tracked/mapped lifecycle models. Verify the exact companion and NestJS/Prisma versions before enabling it; the historical audit-log 0.5.0 / soft-delete 0.7.2 guide is not a verified 0.7.0 tuple.

## Before Expanding Coverage

- Confirm the actor, target, authorized tenant, role diff, and masking on your first record.
- Confirm business errors and automatic audit failures roll back the mutation and automatic record.
- For manual transactions, await logging and allow failures to escape the transaction callback.
- Review base-client writes, raw SQL, database cascades, nested relations, and bulk operations on each model you add.
- Restrict audit readers and keep schema/retention privileges separate from the application role.

Continue with [incremental adoption](/packages/audit-log/adoption), [automatic tracking](/packages/audit-log/auto-tracking), or the [full package reference](/packages/audit-log/).
