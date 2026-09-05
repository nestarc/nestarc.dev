---
title: "NestJS Audit Log Code Example with Prisma"
date: 2026-04-06
description: "Build a NestJS audit log with Prisma Client Extensions, actor context, before/after diffs, and atomic automatic tracking."
author: nestarc
reviewed: 2026-09-05
versionScope: "@nestarc/audit-log 0.5.x, Node.js ^22.13 || ^24, NestJS 10/11/12.0.1+, PostgreSQL, and Prisma 5/6/7"
---

# NestJS Audit Log Code Example with Prisma

Your compliance team wants to know who changed what and when. Your application already has dozens of Prisma writes, and adding a bespoke `auditService.log()` call beside every mutation would be repetitive and easy to miss.

`@nestarc/audit-log` tracks create, update, delete, upsert, and supported batch operations through a Prisma Client Extension. Existing business methods can keep their intent and control flow, but authoritative automatic records now require an explicit audited transaction: tracked application writes must go through the audited client and `withAuditTransaction()`. Base-client writes are deliberately not intercepted.

## 1. Install the Package and Prisma 7 Runtime

```bash
npm install @nestarc/audit-log @prisma/client @prisma/adapter-pg pg
npm install --save-dev prisma dotenv
```

Audit-log 0.5 requires Node.js `^22.13.0 || ^24.0.0` and supports NestJS 10, 11, and 12.0.1+.
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

## 2. Install the Audit Schema

Do not model a simplified `AuditLog` table and assume it matches the package. Use the package's schema installer in a migration or controlled setup script:

```typescript
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { applyAuditTableSchema } from '@nestarc/audit-log';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

await applyAuditTableSchema(prisma);
await prisma.$disconnect();
```

If your migration system owns SQL files, call `getAuditTableSQL()` instead and commit the returned SQL as a reviewed migration. The generated schema includes the package's indexes and append-only enforcement; it can also be configured for monthly partitions.

## 3. Separate the Base and Audited Clients

The integration has two client roles:

- `base` stores and queries audit rows without recursively auditing those writes.
- `client` is the audited client used for application queries and business mutations.

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from './generated/prisma/client';
import { createAuditedClient } from '@nestarc/audit-log';

export const prismaModule = { Prisma };

@Injectable()
export class PrismaService implements OnModuleInit {
  readonly base = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

  readonly client = createAuditedClient(this.base, {
    consistency: 'atomic-required',
    trackedModels: ['User', 'Task', 'Project'],
    sensitiveFields: ['password', 'ssn', 'apiKey'],
    ignoreTimestampOnlyUpdates: true,
    prismaModule,
  });

  async onModuleInit() {
    await this.base.$connect();
  }
}
```

`consistency` remains required in 0.5. `atomic-required` makes audited reads, the business mutation,
and the automatic audit insert one fail-closed unit. This combination is the Supported contract for
authoritative automatic tracking; explicit `best-effort` is intentionally outside that support
claim. Passing `prismaModule` lets audit-log use the Prisma namespace exported by the Prisma 7
generated client; pass the same value to the Nest module.

### Migrating from `experimentalTxAudit`

Audit-log 0.5 removes `experimentalTxAudit`; 0.4.1 is the last version that accepts it. Remove the
key, select `consistency: 'atomic-required'`, and move tracked writes into
`withAuditTransaction()` for authoritative automatic evidence. To preserve intentional non-atomic
behavior, remove the key and keep `consistency: 'best-effort'` explicit. TypeScript rejects the
removed option, while JavaScript or `any` objects that retain their own legacy property—even when
set to `false`—fail fast during the 0.5.x migration window.

## 4. Register `AuditLogModule` with Actor Context

Export `PrismaService` from a global `PrismaModule`, then configure audit-log with the **base** client and an actor extractor:

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
        correlationIdHeader: 'x-request-id',
      }),
    }),
  ],
})
export class AppModule {}
```

For multi-tenant applications, configure `tenantRequired` on both the audited client and module. Missing tenant context rolls back an `atomic-required` mutation; explicit `best-effort` skips the automatic row and reports the audit failure, while module-side manual logging and ambient queries fail closed.

## 5. Keep Business Logic, Use the Audited Client

The service method does not need to load a before snapshot or construct an audit record. Put the mutation inside the audited client's transaction helper:

```typescript
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateUser(id: string, dto: UpdateUserDto) {
    return this.prisma.client.withAuditTransaction((tx) =>
      tx.user.update({
        where: { id },
        data: dto,
      }),
    );
  }
}
```

This is the precise meaning of "without refactoring business logic": validation, branching, and domain behavior stay unchanged, while the mutation gains one explicit atomic boundary. If a method performs several tracked writes, make sequential `tx.model` calls inside one `withAuditTransaction()` callback. Existing base-client mutation paths must move behind the audited client; a base-client mutation is not audited.

An automatic update produces a diff-oriented entry like this:

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

- `atomic-required` accepts tracked mutations only inside `withAuditTransaction()`. The pre-read, business write, post-read, and audit insert use the same official Prisma interactive transaction. An audit failure rolls back the business mutation; a tracked write outside the helper is rejected before it executes.
- `best-effort` preserves the legacy behavior. The business write stays in the caller's transaction, but the automatic audit insert uses the independent base client. A caller rollback can therefore leave an orphan success row, and transaction-local diffs can be empty or stale.
- `AuditService.log(input, tx)` is the stable path for a custom business event that must share a caller-controlled transaction. Calling `log(input)` without `tx` performs an independent base-client write.

For example, a manual approval event can commit or roll back with its business change by receiving the same `tx`:

```typescript
await this.prisma.base.$transaction(async (tx) => {
  await tx.invoice.update({
    where: { id: invoiceId },
    data: { status: 'approved' },
  });

  await this.auditService.log(
    {
      action: 'invoice.approved',
      targetId: invoiceId,
      targetType: 'Invoice',
    },
    tx,
  );
});
```

Array `$transaction([...])`, `createMany`, and `updateMany` are outside the atomic automatic contract and are rejected before mutation. Use sequential single-record operations inside `withAuditTransaction()` instead. Nested writes that target tracked related models must likewise be expressed as explicit mutations. Atomic `deleteMany` is supported as per-record evidence up to `maxBatchRecords` (1,000 by default); exceeding the cap rolls back the mutation. Use the audited helper for authoritative row-level automatic records, and pass `tx` to manual logging for atomic domain events; do not assume `best-effort` or `log(input)` is atomic.

### Atomic soft-delete lifecycle evidence

Audit-log 0.5 composes with `@nestarc/soft-delete` 0.7.2 for authoritative soft-delete, restore,
purge, cascade, and supported bulk lifecycle rows. Apply extensions in the fixed order tenancy →
audit-log → soft-delete, set `auditLifecycle: 'atomic-required'` on the soft-delete extension and
module, align `auditMaxBatchRecords` with audit-log's `maxBatchRecords`, and run lifecycle mutations
inside `withAuditTransaction()`. Every soft-delete model, including cascade children, must also be
tracked and mapped by audit-log. Lifecycle events are notifications; they are not a substitute for
this atomic bridge. See [Prisma Extension Chaining](/guide/prisma-extension-chaining) for the full
composition.

The combined audit-log 0.5.0 / soft-delete 0.7.2 bridge's shared NestJS peer range is 10/11;
audit-log alone additionally supports NestJS 12.0.1+.

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
changeRole(@Param('id') id: string, @Body('role') role: string) {
  return this.userService.updateRole(id, role);
}
```

The current query API uses target and actor fields and returns keyset pagination metadata:

```typescript
const result = await this.auditService.query({
  actorId: 'user-42',
  action: 'User.*',
  targetType: 'User',
  source: 'auto',
  result: 'success',
  from: new Date('2026-08-01'),
  to: new Date('2026-09-01'),
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
- Remove `experimentalTxAudit` before upgrading to 0.5; untyped legacy keys fail fast even when set to `false`.
- Wrap every tracked business mutation in `withAuditTransaction()` and use the callback's `tx` client.
- Pass the Prisma 7 generated `{ Prisma }` namespace to both extension and module.
- Configure `prisma`, `prismaModule`, and `actorExtractor` on `AuditLogModule`.
- Verify no business mutation bypasses the audited client; base-client writes are not intercepted.
- Configure `databaseMapping` for mapped tables, schemas, or primary-key columns when Prisma cannot expose their mapping metadata.
- Pass the caller's `tx` to `AuditService.log(input, tx)` when a custom event and business writes must be atomic.
- Use explicit tenant scope for exports and idempotent consumers for at-least-once durable streams.

## Next Steps

- [Installation](/packages/audit-log/installation) — complete schema and client setup
- [Automatic CUD Tracking](/packages/audit-log/auto-tracking) — options and transaction contract
- [Manual Logging](/packages/audit-log/manual-logging) — atomic business-event logging
- [Query API](/packages/audit-log/query-api) — cursors, filters, and tenant scoping
- [Streaming Export & CSV](/packages/audit-log/streaming-export) — bounded scans, checkpoints, and CSV output
- [Durable Log Streams](/packages/audit-log/durable-streams) — at-least-once SIEM delivery, retries, and dead letters
- [Prisma Extension Chaining](/guide/prisma-extension-chaining) — extension ordering, transaction boundaries, and release compatibility
- [Prisma Client extensions](https://www.prisma.io/docs/orm/prisma-client/client-extensions) — official extension behavior and client composition
- [PostgreSQL CREATE TRIGGER](https://www.postgresql.org/docs/current/sql-createtrigger.html) — database semantics behind trigger-based append-only enforcement
