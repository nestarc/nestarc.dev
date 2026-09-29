---
title: "NestJS Audit Log Code Example with Prisma"
date: 2026-04-06
description: "Build a NestJS audit log with Prisma Client Extensions, actor context, before/after diffs, and atomic automatic tracking."
author: nestarc
reviewed: 2026-09-29
versionScope: "@nestarc/audit-log 0.7.0, Node.js ^22.13 || ^24, NestJS 10/11/12.0.1+, PostgreSQL, and Prisma 5/6/7"
---

# NestJS Audit Log Code Example with Prisma

Change a user's role from `member` to `admin`, then answer who made the change and what the previous value was. This example starts with one tracked `User` model and produces an automatic record with `action: 'User.updated'`, `source: 'auto'`, and `changes.role: { before: 'member', after: 'admin' }`.

**[Run the 0.7.0 example](/packages/audit-log/quickstart)** to verify actor, tenant, masking, and rollback, or **[add one workflow to an existing app](/packages/audit-log/adoption)**. The code below explains the automatic path. For a business event in an existing transaction, the manual path uses `AuditService.log(input, tx)` without an automatic extension.

Supported automatic writes use the audited client inside `withAuditTransaction()`, so the business change and audit record commit or roll back together. You choose which write paths to migrate; base-client writes and raw SQL are not automatically covered.

## 1. Install the Package and Prisma 7 Runtime

```bash
npm install @nestarc/audit-log@0.7.0
npm install @prisma/client@7 @prisma/adapter-pg@7 pg
npm install --save-dev prisma@7 dotenv
```

Audit-log 0.7.0 requires Node.js `^22.13.0 || ^24.0.0` and supports NestJS 10, 11, and 12.0.1+.
NestJS 12.0.0 is excluded because its published framework peer metadata was corrected in 12.0.1.

Prisma 7 uses the `prisma-client` generator with an explicit output and a driver adapter. Move the CLI datasource URL to `prisma.config.ts`:

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

Prisma 5/6 applications using the legacy `@prisma/client` output can keep their existing client construction. The generated Prisma namespace shown below is required for Prisma 7.

## 2. Share Configuration and Install the Audit Schema

Keep storage, masking, and identity policy consistent with the 0.7.0 configuration factory. This example deliberately requires an identifiable actor and tracks only `User`:

```typescript
// audit.config.ts
import { defineAuditConfig } from '@nestarc/audit-log';
import { Prisma } from './generated/prisma/client';

export const auditConfig = defineAuditConfig({
  shared: {
    prismaModule: { Prisma },
    sensitiveFields: ['password', 'ssn', 'apiKey'],
    actorRequired: true,
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
    ignoreTimestampOnlyUpdates: true,
  },
});
```

Authenticate and authorize the request in your application's Guards. `actorExtractionStage: 'interceptor'` reads `req.user` after Guards; it was added in 0.6.0 and remains opt-in. The defaults are still middleware extraction and `actorRequired: false`. With the policy enabled above, a missing or blank actor ID rejects an atomic tracked write before mutation. Workers must set an explicit identity with `AuditContext.runAs({ id: 'role-sync-worker', type: 'system' }, callback)`.

The factory builds options; it does not create a client, register Nest providers, or apply database schema.

Do not model a simplified `AuditLog` table and assume it matches the package. Use the package's schema installer in a migration or controlled setup script:

```typescript
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { applyAuditTableSchema } from '@nestarc/audit-log';
import { auditConfig } from './audit.config';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.MIGRATION_DATABASE_URL!,
  }),
});

await applyAuditTableSchema(prisma, auditConfig.schemaOptions);
await prisma.$disconnect();
```

Use a schema-owner `MIGRATION_DATABASE_URL` for this setup step and a restricted runtime `DATABASE_URL` in the application. See the [existing-app guide](/guide/audit-trail) for grants and maintenance-role separation.

If your migration system owns SQL files, call `getAuditTableSQL(auditConfig.schemaOptions)` instead and commit the returned SQL as a reviewed migration. The generated schema includes the package's indexes and append-only enforcement; it can also be configured for monthly partitions.

## 3. Separate the Base and Audited Clients

The integration has two client roles:

- `base` stores and queries audit rows without recursively auditing those writes.
- `client` is the audited client used for application queries and business mutations.

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { createAuditedClient } from '@nestarc/audit-log';
import { auditConfig } from './audit.config';

@Injectable()
export class PrismaService implements OnModuleInit {
  readonly base = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

  readonly client = createAuditedClient(this.base, auditConfig.extensionOptions);

  async onModuleInit() {
    await this.base.$connect();
  }
}
```

`consistency` is required whenever the factory includes an `extension` section. `atomic-required` keeps audit reads, the business mutation, and the automatic insert in the same transaction. `best-effort` is an explicit non-atomic choice. The shared generated `{ Prisma }` namespace supports the Prisma 7 client on both the module and extension.

Upgrading from an older release? Follow the [migration guide](/packages/audit-log/migration), including the removed `experimentalTxAudit` option and 0.7 returning-bulk rejection.

## 4. Register `AuditLogModule` with Actor Context

Export `PrismaService` from a global `PrismaModule`, then configure audit-log with the **base** client and an actor extractor:

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

For multi-tenant applications, set `tenantRequired: true` and a trusted `tenantResolver` in the factory's `shared` section. Audit tenant context scopes audit records; it does not authorize a tenant or scope your business Prisma queries. Include the authorized tenant predicate in those queries. Missing tenant context rolls back an `atomic-required` mutation; explicit `best-effort` skips the automatic row and reports the audit failure, while module-side manual logging and ambient queries fail closed.

<span id="_5-keep-business-logic-use-the-audited-client"></span>

## 5. Change One Role and Inspect the Record

The service method does not need to load a before snapshot or construct an audit record. Put the mutation inside the audited client's transaction helper:

```typescript
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateRole(id: string, role: 'member' | 'admin') {
    return this.prisma.client.withAuditTransaction((tx) =>
      tx.user.update({
        where: { id },
        data: { role },
      }),
    );
  }
}
```

Keep application authorization, validation, branching, and domain behavior around this mutation. The change here is one explicit atomic boundary. If a method performs several tracked writes, make sequential `tx.model` calls inside one `withAuditTransaction()` callback. Existing base-client mutation paths must move behind the audited client; a base-client mutation is not audited.

After an authorized operator changes an existing user's role from `member` to `admin`, expect a record with these fields (illustrative IDs and timestamp):

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
    "role": {
      "before": "member",
      "after": "admin"
    }
  },
  "metadata": null,
  "result": "success",
  "createdAt": "2026-08-18T10:30:00.000Z"
}
```

Only changed fields appear in `changes`. Configured sensitive fields are represented as `"[REDACTED]"` in before/after values.

## 6. Know the Transaction Boundary

The required `consistency` option makes the contract explicit:

- `atomic-required` accepts tracked mutations only inside `withAuditTransaction()`. The pre-read, business write, post-read, and audit insert use the same official Prisma interactive transaction. An audit failure rolls back the business mutation even when the callback catches the audit error; a tracked write outside the helper is rejected before it executes.
- `best-effort` preserves the legacy behavior. The business write stays in the caller's transaction, but the automatic audit insert uses the independent base client. A caller rollback can therefore leave an orphan success row, and transaction-local diffs can be empty or stale.
- `AuditService.log(input, tx)` is the stable path for a custom business event that must share a caller-controlled transaction. Calling `log(input)` without `tx` performs an independent base-client write.

For a manual role-change event, keep an ordinary Prisma transaction and pass the same `tx`:

```typescript
await this.prisma.base.$transaction(async (tx) => {
  const before = await tx.user.findUniqueOrThrow({ where: { id: userId } });
  const after = await tx.user.update({
    where: { id: userId },
    data: { role: 'admin' },
  });
  await this.auditService.log(
    {
      action: 'user.role.changed',
      targetId: userId,
      targetType: 'User',
      metadata: { role: { before: before.role, after: after.role } },
    },
    tx,
  );
});
```

This manual alternative produces `source: 'manual'` and `metadata.role`, not automatic `changes.role`. Await `log(input, tx)` and propagate failures: catching a JavaScript audit error inside an ordinary transaction can allow the business write to commit. Manual logging does not apply the automatic helper's failure marker to that transaction.

Array `$transaction([...])` and tracked `createMany`, `updateMany`, `createManyAndReturn`, and `updateManyAndReturn` are rejected in atomic mode before mutation. The returning-bulk rejection is a breaking change in 0.7.0; catching it inside the helper still causes the whole transaction to roll back. Use sequential single-record operations inside `withAuditTransaction()` instead. Nested writes that target tracked related models must likewise be expressed as explicit mutations, including when the parent or an intermediate model is untracked. Atomic `deleteMany` is supported as per-record evidence up to `maxBatchRecords` (1,000 by default); exceeding the cap rolls back the mutation. Use the audited helper for authoritative row-level automatic records, and pass `tx` to manual logging for atomic domain events; do not assume `best-effort` or `log(input)` is atomic.

### Verify the boundary before expanding coverage

Use the [runnable checks](/packages/audit-log/quickstart) to verify the actor, tenant, changed values, and recursive redaction. Then throw after a write and confirm that both the business change and audit row rolled back. Verify an automatic audit failure as well; since 0.6.0, catching it inside the helper cannot turn the transaction into a success.

If you also use soft-delete, choose a companion release whose peer range includes audit-log 0.7.0 (`@nestarc/soft-delete@0.7.4`). Verify the exact NestJS/Prisma/tenancy tuple and lifecycle rollback before adopting the [extension composition](/guide/prisma-extension-chaining). The older audit-log 0.5.0 / soft-delete 0.7.2 example is not evidence for a 0.7.0 combination.

## 7. Control and Query the Trail

Route decorators can skip or rename entries while leaving the service method unchanged:

```typescript
@NoAudit()
@Post('import')
bulkImport(@Body() dto: ImportDto) {
  return this.userService.importBatch(dto.users);
}

@AuditAction('user.role.changed')
@Patch(':id/role')
changeRole(@Param('id') id: string, @Body('role') role: 'member' | 'admin') {
  return this.userService.updateRole(id, role);
}
```

A renamed automatic action still has `source: 'auto'` and `changes.role`; it does not become a manual event. Validate the incoming role in your application.

After application-owned authorization to read this history, query the changed target. In a multi-tenant application also pass the authorized `tenantId` or resolve trusted ambient context:

```typescript
const result = await this.auditService.query({
  actorId: 'user-42',
  targetId: 'user-7',
  targetType: 'User',
  source: 'auto',
  result: 'success',
  limit: 50,
  includeTotal: false,
});

// result: { entries, nextCursor, hasMore }
```

For a complete export, use `scan()` or `exportCsv()` instead of adapting the newest-first query API. Both require an explicit `tenantId` or intentional `allTenants: true`, and `scan()` fixes a high-watermark so a resumed run stays bounded. For continuous SIEM delivery, schedule `AuditStreamRunner.runOnce()` in the host application and make the receiver idempotent because delivery is at least once.

## Implementation Checklist

- Install the package-provided audit schema through a reviewed migration path.
- Keep one base client for audit storage and one audited client for application writes.
- Select the required `consistency` mode explicitly; use `atomic-required` for authoritative automatic records.
- Review the migration guide; 0.7.0 rejects returning bulk writes on tracked models in atomic mode.
- Wrap every tracked business mutation in `withAuditTransaction()` and use the callback's `tx` client.
- Pass the Prisma 7 generated `{ Prisma }` namespace to both extension and module.
- Extract the actor after authentication Guards and set a non-blank system actor ID for workers when `actorRequired` is enabled.
- Verify the first record and test rollback before adding more tracked models.
- Verify no business mutation bypasses the audited client; base-client writes are not intercepted.
- Configure `databaseMapping` for mapped tables, schemas, or primary-key columns when Prisma cannot expose their mapping metadata.
- Pass the caller's `tx` to `AuditService.log(input, tx)` when a custom event and business writes must be atomic.
- Use explicit tenant scope for exports and idempotent consumers for at-least-once durable streams.

## Next Steps

- [Run the 0.7.0 Example](/packages/audit-log/quickstart) — verify a role change and rollback
- [Add to an Existing App](/packages/audit-log/adoption) — choose one manual event or one tracked model
- [Installation](/packages/audit-log/installation) — complete schema and client setup
- [Automatic CUD Tracking](/packages/audit-log/auto-tracking) — options and transaction contract
- [Manual Logging](/packages/audit-log/manual-logging) — atomic business-event logging
- [Query API](/packages/audit-log/query-api) — cursors, filters, and tenant scoping
- [Streaming Export & CSV](/packages/audit-log/streaming-export) — bounded scans, checkpoints, and CSV output
- [Durable Log Streams](/packages/audit-log/durable-streams) — at-least-once SIEM delivery, retries, and dead letters
- [Prisma Extension Chaining](/guide/prisma-extension-chaining) — extension ordering, transaction boundaries, and release compatibility
- [Prisma Client extensions](https://www.prisma.io/docs/orm/prisma-client/client-extensions) — official extension behavior and client composition
- [PostgreSQL CREATE TRIGGER](https://www.postgresql.org/docs/current/sql-createtrigger.html) — database semantics behind trigger-based append-only enforcement
