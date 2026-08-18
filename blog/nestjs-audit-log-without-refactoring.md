---
title: "NestJS Audit Log Code Example: Automatic Prisma Tracking Without Business-Logic Refactors"
date: 2026-04-06
description: "A current NestJS audit log code example using separate base and extended Prisma clients, actor context, automatic diffs, and transaction-aware manual logs."
author: nestarc
reviewed: 2026-08-18
versionScope: "@nestarc/audit-log 0.3.x, NestJS 10/11, PostgreSQL, and Prisma 5/6/7"
---

# NestJS Audit Log Code Example: Automatic Prisma Tracking Without Business-Logic Refactors

Your compliance team wants to know who changed what and when. Your application already has dozens of Prisma writes, and adding a bespoke `auditService.log()` call beside every mutation would be repetitive and easy to miss.

`@nestarc/audit-log` tracks create, update, delete, upsert, and batch operations through a Prisma Client Extension. Existing business methods can keep their intent and control flow, but their application writes must go through the extended client. Base-client writes are deliberately not intercepted.

## 1. Install the Package and Prisma 7 Runtime

```bash
npm install @nestarc/audit-log @prisma/client @prisma/adapter-pg pg
npm install --save-dev prisma dotenv
```

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

## 3. Separate the Base and Extended Clients

The integration has two client roles:

- `base` stores and queries audit rows without recursively auditing those writes.
- `client` is the extended client used for application queries and business mutations.

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from './generated/prisma/client';
import { createAuditExtension } from '@nestarc/audit-log';

export const prismaModule = { Prisma };

@Injectable()
export class PrismaService implements OnModuleInit {
  readonly base = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

  readonly client = this.base.$extends(
    createAuditExtension({
      trackedModels: ['User', 'Task', 'Project'],
      sensitiveFields: ['password', 'ssn', 'apiKey'],
      ignoreTimestampOnlyUpdates: true,
      prismaModule,
    }),
  );

  async onModuleInit() {
    await this.base.$connect();
  }
}
```

Passing `prismaModule` lets audit-log use the Prisma namespace exported by the Prisma 7 generated client. Pass the same value to the Nest module.

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

For multi-tenant applications, configure `tenantRequired` on both the extension and module when missing tenant context must fail closed or skip automatic audit insertion according to the package contract.

## 5. Keep Business Logic, Use the Extended Client

The service method does not need to load a before snapshot or construct an audit record. It only needs to use `prisma.client`:

```typescript
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  updateUser(id: string, dto: UpdateUserDto) {
    return this.prisma.client.user.update({
      where: { id },
      data: dto,
    });
  }
}
```

This is the precise meaning of "without refactoring business logic": validation, branching, and domain behavior stay unchanged. If existing services call `prisma.user.update()` on the base client, those access paths must be changed to `prisma.client.user.update()` or injected through a token that resolves to the extended client. A base-client mutation is not audited.

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

Automatic tracking preserves the caller's transaction for the business write, but the audit insert is best-effort through the base client and does **not** join that transaction. If the caller transaction rolls back, an automatic audit row can remain; before/after state observed from an open transaction can also be stale.

When the audit row must commit or roll back atomically with the business change, write an explicit business event with the transaction client:

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

Use this explicit path for compliance-sensitive workflows rather than assuming automatic entries are transaction-atomic.

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

## Implementation Checklist

- Install the package-provided audit schema through a reviewed migration path.
- Keep one base client for audit storage and one extended client for application writes.
- Pass the Prisma 7 generated `{ Prisma }` namespace to both extension and module.
- Configure `prisma`, `prismaModule`, and `actorExtractor` on `AuditLogModule`.
- Verify every business mutation reaches `prisma.client`; base-client writes are not intercepted.
- Use manual `AuditService.log(input, tx)` when audit and business writes must be atomic.

## Next Steps

- [Installation](/packages/audit-log/installation) — complete schema and client setup
- [Automatic CUD Tracking](/packages/audit-log/auto-tracking) — options and transaction contract
- [Manual Logging](/packages/audit-log/manual-logging) — atomic business-event logging
- [Query API](/packages/audit-log/query-api) — cursors, filters, and tenant scoping
- [Prisma Extension Chaining](/guide/prisma-extension-chaining) — combine audit-log with tenancy and soft-delete
