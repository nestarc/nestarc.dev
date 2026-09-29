---
description: "Install @nestarc/audit-log 0.7.0, share actor and masking policy with defineAuditConfig(), and add atomic Prisma tracking to NestJS."
---

# Installation

Add audit logging to an existing NestJS application using the published **0.7.0** package.
For a runnable project, start with the [Quick Start](./quickstart). To introduce one business event
or one tracked model first, use [Incremental Adoption](./adoption).

## 1. Install

```bash
npm install @nestarc/audit-log@0.7.0 @prisma/client@7 @prisma/adapter-pg@7 pg dotenv
npm install --save-dev prisma@7
```

These examples target published `@nestarc/audit-log@0.7.0`. Unreleased checkout options are not part of this contract.

audit-log 0.7 uses Prisma 7 as its primary target while retaining Prisma 5/6 peer compatibility. It
supports NestJS 10, 11, and 12.0.1+, and requires Node.js `^22.13.0 || ^24.0.0`. NestJS 12.0.0 is
excluded because its published framework peer metadata was corrected in 12.0.1.

<span id="upgrading-to-0-7-0"></span>

::: info Upgrading to 0.7.0
0.7.0 adds shared configuration and optional actor requirements. It also rejects tracked returning
bulk operations in atomic mode. Read [Migrating to 0.7.0](./migration) before upgrading an existing
integration, including the changes introduced in 0.6.0.
:::

## 2. Configure Prisma 7

Use an explicit generated-client output and move the CLI datasource URL into `prisma.config.ts`:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
  moduleFormat = "cjs"
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
  datasource: { url: env('DATABASE_URL') },
});
```

The snippets below assume an existing NestJS CommonJS project and your application's `User`
Prisma model. Add that model, or replace `trackedModels` and the service operations with models
from your own schema. The generator's `moduleFormat = "cjs"` matches that
CommonJS build; an ESM application must use a consistent ESM generator and TypeScript configuration.

Set `DATABASE_URL` in the runtime environment or in `.env`, apply your business-schema migration,
and generate the client before compiling code that imports `./generated/prisma/client`:

```bash
npx prisma generate
```

Use matching Prisma 7 CLI, client, and adapter versions in the lockfile. This example imports
`dotenv/config` at runtime, so `dotenv` is a runtime dependency. If your deployment supplies all
environment variables directly, that runtime import can be omitted.

<span id="shared-configuration"></span>

## 3. Define shared audit settings

Keep manual logs, automatic tracking, and audit storage on the same configuration with
`defineAuditConfig()`. This example starts with one tracked model and requires identified actors:

```typescript
// audit.config.ts
import { defineAuditConfig } from '@nestarc/audit-log';
import { Prisma } from './generated/prisma/client';

export const auditConfig = defineAuditConfig({
  shared: {
    prismaModule: { Prisma },
    actorRequired: true,
    sensitiveFields: ['password', 'ssn'],
    // tableName: 'audit_events',
    // tenantRequired: true,
    // tenantResolver: () => yourTenantContext.getTenantId(),
  },
  module: {
    actorExtractionStage: 'interceptor',
    actorExtractor: (req) => ({
      id: req.user?.id ?? null,
      type: req.user ? 'user' : 'system',
      ip: req.ip,
    }),
    // correlationIdHeader: 'x-request-id',
  },
  extension: {
    consistency: 'atomic-required',
    trackedModels: ['User'],
    ignoreTimestampOnlyUpdates: true,
    // databaseMapping: { User: { tableName: 'users' } },
    // primaryKey: { Order: 'orderNumber' },
  },
});
```

The example assumes an authentication Guard populates `req.user`. For worker writes, establish an
identified system actor with `AuditContext.runAs()`; see [Manual Logging](./manual-logging#authenticated-requests-and-background-jobs).
`actorRequired` defaults to `false`; enabling it is an explicit choice. For multi-tenant apps, enable
`tenantRequired` and provide your tenant resolver, or configure the optional tenancy integration.
Actor context does not establish tenant context.

Shared fields belong in `shared`, request extraction settings in `module`, and tracking settings
in `extension`. The factory rejects misplaced fields. It builds independent options without
creating a client, applying schema, or registering a Nest module. Omit `extension` entirely for
manual-only adoption. Existing direct module and extension options remain supported.

<span id="_3-create-the-audit-logs-table"></span>

## 4. Create the audit table

```typescript
import { applyAuditTableSchema } from '@nestarc/audit-log';
import { auditConfig } from './audit.config';

// In a migration or setup script, using the setup client's database connection:
await applyAuditTableSchema(prisma, auditConfig.schemaOptions);
```

Or use `getAuditTableSQL(auditConfig.schemaOptions)` to get the raw SQL string for your migration
tool. The default table name is `audit_logs`. A custom `shared.tableName` also flows to schema and
partition options, so setup and runtime use the same table. For partitioned storage, add
`schema: { partitioned: true }` to the factory and follow [Retention](./retention).

<span id="_4-complete-nestjs-integration"></span>

## 5. Complete NestJS integration

The library uses two Prisma client roles:

- **Base client** — used by `AuditService` for writing/querying audit logs.
- **Extended client** — used by your application for automatic business-write tracking.

```typescript
// prisma.service.ts
import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { createAuditedClient } from '@nestarc/audit-log';
import { auditConfig } from './audit.config';

@Injectable()
export class PrismaService implements OnModuleInit {
  /** Base client — for audit storage. */
  readonly base = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

  /** Extended client — for automatic business-write tracking. */
  readonly client = createAuditedClient(this.base, auditConfig.extensionOptions);

  async onModuleInit() {
    await this.base.$connect();
  }
}
```

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

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { AuditLogModule } from '@nestarc/audit-log';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';
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

```typescript
// user.service.ts — use prisma.client (extended) for all business writes
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    // Automatic audit tracking fires because we use the extended client
    return this.prisma.client.withAuditTransaction((tx) =>
      tx.user.create({ data }),
    );
  }
}
```

With the Prisma 7 `prisma-client` generator, passing `{ Prisma }` as `prismaModule` is required for both the extension and `AuditLogModule`. Prisma 5/6 applications using the legacy `@prisma/client` output can keep their existing imports. See [Prisma 7 Setup](/guide/prisma-7).

## Actor extraction and authentication order

`actorExtractionStage: 'interceptor'` runs actor extraction once after successful NestJS Guards
and before the handler. It is available since 0.6.0. The default remains `'middleware'`, which runs
before Guards and suits identity already populated by authentication middleware.

Writes inside a Guard occur before interceptor-stage extraction. If those writes need attribution,
authenticate in earlier middleware or establish an explicit audit context. If you disable global
interceptor registration, bind `AuditInterceptor` yourself. Routes excluded from audit middleware
have no context for either extraction stage; exclusion alone does not disable automatic tracking.

Extractor errors are reported and request handling continues with a null actor. With
`actorRequired: true`, a tracked automatic write or explicit manual log then rejects for the missing
identity. Reads remain unaffected. The host application must still authenticate and authorize users;
actor validation does not perform either task.

Module and extension options remain independent at runtime. The factory applies shared values at
creation time; later edits to an output do not update the other outputs. If you use direct
registration instead, repeat shared tenant, actor, table, and masking settings where required.

## createAuditExtension Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `consistency` | `'atomic-required' \| 'best-effort'` | required | Select the atomic helper contract or explicit legacy behavior |
| `databaseMapping` | `Record<string, { tableName; schema?; primaryKeyColumn? }>` | `{}` | PostgreSQL identifiers used for atomic row locks when public Prisma mapping metadata is unavailable |
| `maxBatchRecords` | `number` | `1000` | Per-record atomic `deleteMany` cap |
| `batchOverflow` | `'reject' \| 'summary'` | `'reject'` | Summary overflow is best-effort-only |
| `trackedModels` | `string[]` | all models when omitted | Allowlist of Prisma model names to track. `trackedModels: []` means no models are audited |
| `ignoredModels` | `string[]` | `[]` | Denylist used only when `trackedModels` is not set |
| `sensitiveFields` | `string[]` | `[]` | Fields to mask as `[REDACTED]` in diffs |
| `sensitiveFieldsByModel` | `Record<string, string[]>` | `{}` | Per-model fields unioned with `sensitiveFields` |
| `primaryKey` | `Record<string, string>` | `{ *: 'id' }` | Map of model name to primary key field name |
| `tableName` | `string` | `audit_logs` | Audit table used by automatic inserts |
| `actorRequired` | `boolean` | `false` | Require a non-blank actor ID; reject atomic writes before mutation, or skip best-effort audit rows |
| `tenantRequired` | `boolean` | `false` | Missing tenant rolls back atomic mutations; best-effort skips the audit row and reports it |
| `tenantResolver` | `() => string \| null` | — | Replaces default tenant resolution, including when it returns `null`; tenancy is used only when no resolver is supplied |
| `onAuditError` | `(error, ctx) => void` | — | Structured callback for automatic audit failures |
| `logger` | `AuditLogger` | `console` | Logger used for audit warnings and errors |
| `logFailures` | `boolean` | `false` | Record best-effort `result='failure'` rows when business writes throw |
| `ignoreTimestampOnlyUpdates` | `boolean` | `false` | Suppress `@updatedAt`-only update entries |
| `prismaModule` | generated Prisma module | legacy `@prisma/client` fallback | Required with the Prisma 7 `prisma-client` generator; pass `{ Prisma }` from the generated output |

When neither `trackedModels` nor `ignoredModels` is configured, `createAuditExtension()` audits all Prisma models and emits a one-time warning. Set `trackedModels` as an allowlist or `ignoredModels` as a denylist to narrow scope.

## Optional Atomic Soft-Delete Lifecycle

Use `@nestarc/soft-delete@0.7.4` with audit-log 0.7.0 for the atomic lifecycle bridge. Apply
audit-log before soft-delete, set `auditLifecycle: 'atomic-required'` on the soft-delete extension
and module, and run lifecycle calls inside `withAuditTransaction()`.

Keep every soft-delete model, including cascade children, in audit-log's `trackedModels` and
`databaseMapping`. Align soft-delete's `auditMaxBatchRecords` with audit-log's `maxBatchRecords`.
Calls with an incompatible order, a best-effort audit client, or no ambient audit transaction fail
before the lifecycle mutation. See [Automatic CUD Tracking](./auto-tracking#atomic-soft-delete-lifecycle).

Optional tenancy composition needs its own transaction/RLS compatibility check; audit tenant
metadata alone does not establish that boundary. Do not infer transaction support from the optional
peer dependency or extension order alone.

## AuditLogModule Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prisma` | `PrismaClient` | *required* | Base Prisma client for audit storage |
| `actorExtractor` | `(req) => AuditActor \| Promise<AuditActor>` | *required* | Extracts actor from HTTP request |
| `actorExtractionStage` | `'middleware' \| 'interceptor'` | `'middleware'` | Use `interceptor` for identity populated by Guards |
| `actorRequired` | `boolean` | `false` | Require a non-blank actor ID for `log()`; reads are unaffected |
| `tenantRequired` | `boolean` | `false` | When `true`, module-side `log()` and ambient `query()`/`getById()` require tenant context unless `tenantId` or `allTenants` is explicit |
| `excludeRoutes` | `RouteInfo[]` | `[]` | Routes excluded from `AuditActorMiddleware` |
| `registerGlobalInterceptor` | `boolean` | `true` | Set `false` to bind `AuditInterceptor` manually |
| `correlationIdHeader` | `string` | `x-request-id` | Header copied into `metadata.correlationId` |
| `correlationIdGetter` | `(req) => string \| undefined` | — | Custom correlation ID source |
| `tableName` | `string` | `audit_logs` | Audit table name used by module-side log/query/scan/export/prune APIs |
| `tenantResolver` | `() => string \| null` | — | Replaces default tenant resolution, including when it returns `null`; tenancy is used only when no resolver is supplied |
| `sensitiveFields` | `string[]` | `[]` | Metadata redaction keys for manual logs |
| `sensitiveFieldsByModel` | `Record<string, string[]>` | `{}` | Model-specific metadata redaction keys |
| `onAuditError` | `(error, ctx) => void` | — | Reports actor/correlation extraction and actor-policy errors; handle rejected `log()` calls separately |
| `logger` | `AuditLogger` | `console` | Logger used for audit warnings and errors |
| `prismaModule` | generated Prisma module | legacy `@prisma/client` fallback | Required with the Prisma 7 `prisma-client` generator; pass `{ Prisma }` from the generated output |

## Schema Utilities

| Function | Description |
|----------|-------------|
| `getAuditTableSQL(options?)` | Returns raw SQL string for creating audit tables, trigger enforcement, optional partitions, and indexes |
| `getAuditTableStatements(options?)` | Returns SQL split into individual executable statements |
| `applyAuditTableSchema(prisma, options?)` | Executes the schema SQL statement by statement via Prisma |
| `ensurePartitions(prisma, options?)` | Creates missing monthly partitions for partitioned audit tables |

## Verify the first record

Commit one tracked change, then confirm the actor, tenant, target, and redacted fields through
[Query API](./query-api). Repeat with an error thrown from the transaction callback and confirm
that neither the business change nor its audit row persists. The [Quick Start](./quickstart)
provides a runnable verification path.
