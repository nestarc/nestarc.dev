---
description: "Install @nestarc/audit-log, create the audit_logs table, and register AuditLogModule in your NestJS application."
---

# Installation

::: tip Supported: choose the authoritative consistency boundary
Use `consistency: 'atomic-required'` with `withAuditTransaction()` for Supported authoritative
automatic records. Explicit `best-effort` is outside this support claim: it is non-atomic and can
leave orphan success rows or stale transaction-local diffs after caller rollback.
See [Automatic CUD Tracking](./auto-tracking#transaction-model) for the complete boundary.
:::

## 1. Install

```bash
npm install @nestarc/audit-log @prisma/client @prisma/adapter-pg pg
npm install --save-dev prisma dotenv
```

audit-log 0.5 uses Prisma 7 as its primary target while retaining Prisma 5/6 peer compatibility. It
supports NestJS 10, 11, and 12.0.1+, and requires Node.js `^22.13.0 || ^24.0.0`. NestJS 12.0.0 is
excluded because its published framework peer metadata was corrected in 12.0.1.

::: danger Upgrading to 0.5
`experimentalTxAudit` was removed; 0.4.1 is the last version that accepts it. Remove the key and use
`consistency: 'atomic-required'` plus `withAuditTransaction()` for authoritative automatic evidence,
or keep `consistency: 'best-effort'` explicit when non-atomic records are intentional. TypeScript
options fail to compile with the removed key. JavaScript or `any` options that retain their own
`experimentalTxAudit` key, including `false`, fail fast instead of silently downgrading.
:::

::: info Upgrading from 0.3 or earlier
`consistency` became required in 0.4. Choose `atomic-required` and move tracked writes into
`withAuditTransaction()` for authoritative evidence, or explicitly select `best-effort` to preserve
the old non-atomic behavior. Atomic mode rejects tracked writes outside the helper before mutation.
:::

## 2. Configure Prisma 7

Use an explicit generated-client output and move the CLI datasource URL into `prisma.config.ts`:

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
  datasource: { url: env('DATABASE_URL') },
});
```

## 3. Create the audit_logs table

```typescript
import { applyAuditTableSchema } from '@nestarc/audit-log';

// In a migration or setup script:
await applyAuditTableSchema(prisma);
```

Or use `getAuditTableSQL()` to get the raw SQL string for your migration tool.

## 4. Complete NestJS Integration

The library requires two Prisma clients with distinct roles:

- **Base client** — used by `AuditService` for writing/querying audit logs
- **Extended client** — used by your application code for business writes (CUD tracking fires here)

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from './generated/prisma/client';
import { createAuditedClient } from '@nestarc/audit-log';

export const prismaModule = { Prisma };

const auditExtensionOptions = {
  consistency: 'atomic-required' as const,
  trackedModels: ['User', 'Invoice', 'Document'],
  sensitiveFields: ['password', 'ssn'],
  ignoreTimestampOnlyUpdates: true,
  prismaModule,
  // primaryKey: { Order: 'orderNumber' }, // for non-id PKs
};

@Injectable()
export class PrismaService implements OnModuleInit {
  /** Base client — for audit storage (log/query) */
  readonly base = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

  /** Extended client — use this for all application queries */
  readonly client = createAuditedClient(this.base, auditExtensionOptions);

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
import { PrismaService, prismaModule } from './prisma.service';

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
        // tenantRequired: true, // fail-closed for multi-tenant deployments
        // correlationIdHeader: 'x-request-id',
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
| `tenantRequired` | `boolean` | `false` | Missing tenant rolls back atomic mutations; best-effort skips the audit row and reports it |
| `tenantResolver` | `() => string \| null` | — | Custom tenant lookup before the optional `@nestarc/tenancy` fallback |
| `onAuditError` | `(error, ctx) => void` | — | Structured callback for automatic audit failures |
| `logger` | `AuditLogger` | `console` | Logger used for audit warnings and errors |
| `logFailures` | `boolean` | `false` | Record best-effort `result='failure'` rows when business writes throw |
| `ignoreTimestampOnlyUpdates` | `boolean` | `false` | Suppress `@updatedAt`-only update entries |
| `prismaModule` | generated Prisma module | legacy `@prisma/client` fallback | Required with the Prisma 7 `prisma-client` generator; pass `{ Prisma }` from the generated output |

When neither `trackedModels` nor `ignoredModels` is configured, `createAuditExtension()` audits all Prisma models and emits a one-time warning. Set `trackedModels` as an allowlist or `ignoredModels` as a denylist to narrow scope.

## Optional Atomic Soft-Delete Lifecycle

`@nestarc/soft-delete` 0.7.1 can route soft-delete, restore, purge, cascade, and supported bulk
lifecycle mutations through audit-log 0.5's official transaction. Apply extensions in the fixed
order tenancy → audit-log → soft-delete, set `auditLifecycle: 'atomic-required'` on the soft-delete
extension and module, and run lifecycle calls inside `withAuditTransaction()`.

The combined audit-log 0.5.0 / soft-delete 0.7.1 bridge's shared NestJS peer range is 10/11;
audit-log alone additionally supports NestJS 12.0.1+.

Keep every soft-delete model, including cascade children, in audit-log's `trackedModels` and
`databaseMapping`. Align soft-delete's `auditMaxBatchRecords` with audit-log's `maxBatchRecords`.
Calls with an incompatible order, a best-effort audit client, or no ambient audit transaction fail
before the lifecycle mutation. See [Automatic CUD Tracking](./auto-tracking#atomic-soft-delete-lifecycle)
and [Prisma Extension Chaining](/guide/prisma-extension-chaining).

## AuditLogModule Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prisma` | `PrismaClient` | *required* | Base Prisma client for audit storage |
| `actorExtractor` | `(req) => AuditActor \| Promise<AuditActor>` | *required* | Extracts actor from HTTP request |
| `tenantRequired` | `boolean` | `false` | When `true`, module-side `log()` and ambient `query()`/`getById()` require tenant context unless `tenantId` or `allTenants` is explicit |
| `excludeRoutes` | `RouteInfo[]` | `[]` | Routes excluded from `AuditActorMiddleware` |
| `registerGlobalInterceptor` | `boolean` | `true` | Set `false` to bind `AuditInterceptor` manually |
| `correlationIdHeader` | `string` | `x-request-id` | Header copied into `metadata.correlationId` |
| `correlationIdGetter` | `(req) => string \| undefined` | — | Custom correlation ID source |
| `tableName` | `string` | `audit_logs` | Audit table name used by module-side log/query/scan/export/prune APIs |
| `tenantResolver` | `() => string \| null` | — | Custom tenant lookup before the optional `@nestarc/tenancy` fallback |
| `sensitiveFields` | `string[]` | `[]` | Metadata redaction keys for manual logs |
| `sensitiveFieldsByModel` | `Record<string, string[]>` | `{}` | Model-specific metadata redaction keys |
| `onAuditError` | `(error, ctx) => void` | — | Structured callback for module-side audit failures |
| `logger` | `AuditLogger` | `console` | Logger used for audit warnings and errors |
| `prismaModule` | generated Prisma module | legacy `@prisma/client` fallback | Required with the Prisma 7 `prisma-client` generator; pass `{ Prisma }` from the generated output |

## Schema Utilities

| Function | Description |
|----------|-------------|
| `getAuditTableSQL(options?)` | Returns raw SQL string for creating audit tables, trigger enforcement, optional partitions, and indexes |
| `getAuditTableStatements(options?)` | Returns SQL split into individual executable statements |
| `applyAuditTableSchema(prisma, options?)` | Executes the schema SQL statement by statement via Prisma |
| `ensurePartitions(prisma, options?)` | Creates missing monthly partitions for partitioned audit tables |
