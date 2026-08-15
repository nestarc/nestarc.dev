---
description: "Chain @nestarc/tenancy, soft-delete, and audit-log Prisma Client Extensions in the correct order for a unified PrismaService."
---

# Prisma Extension Chaining

Combine `@nestarc/tenancy`, `@nestarc/soft-delete`, and `@nestarc/audit-log` in a single `PrismaService` using Prisma Client Extensions. This guide explains how the extensions compose, why their order matters, and how to wire everything together.

The examples use Prisma 7 generated-client output and the PostgreSQL driver adapter. Complete [Prisma 7 Setup](/guide/prisma-7) first. If you stay on Prisma 6, keep your existing client construction while preserving the extension order below.

## Overview

Prisma Client Extensions use `$extends()` to wrap the client with additional behavior. Each call returns a new client that layers on top of the previous one:

```typescript
const extended = basePrisma
  .$extends(extensionA)
  .$extends(extensionB)
  .$extends(extensionC);
```

When you call `extended.user.findMany()`, Prisma executes query callbacks in registration order. Each callback must call its `query()` continuation for the next registered callback to run. This means:

- **Extension A** intercepts the query first
- **Extension B** intercepts next if A delegates
- **Extension C** intercepts last if both earlier callbacks delegate

An extension that executes through a client it captured earlier instead of calling `query()` can short-circuit all later callbacks. That detail is critical for the current soft-delete adapter.

## Recommended Order

```typescript
const prisma = basePrisma
  .$extends(createPrismaTenancyExtension(tenancyService))   // 1st callback
  .$extends(createPrismaSoftDeleteExtension({ ... }))        // 2nd callback
  .$extends(createAuditExtension({ ... }));                  // 3rd callback
```

### Why this order

| Position | Extension | Reason |
|----------|-----------|--------|
| 1st | `createPrismaTenancyExtension` | Establishes the RLS context before delegating. The lower client captured by soft-delete still includes tenancy. |
| 2nd | `createPrismaSoftDeleteExtension` | Converts deletes to updates and filters reads. Its current delete handler uses its captured lower client instead of the callback continuation. |
| 3rd | `createAuditExtension` | Tracks writes that reach it through normal delegation. It does **not** see deletes short-circuited by the current soft-delete handler. |

::: warning Soft-delete needs an explicit audit path
This chain does not automatically produce an audit record for `delete()` or `deleteMany()`. Enabling soft-delete lifecycle events and forwarding them to `AuditService.log()` provides best-effort audit after the mutation. If the audit row must be atomic with the mutation, perform an explicit soft-delete update and manual audit in one tenant-scoped transaction instead.
:::

## PrismaService Example

A complete `PrismaService` that chains all three extensions:

```typescript
// prisma.service.ts
import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from './generated/prisma/client';
import { TenancyService, createPrismaTenancyExtension } from '@nestarc/tenancy';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';
import { createAuditExtension } from '@nestarc/audit-log';
import { prismaDmmf } from './prisma.dmmf';

export const prismaModule = { Prisma };

@Injectable()
export class PrismaService implements OnModuleInit {
  /** Base client — used by AuditLogModule for writing/querying audit records */
  readonly base = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

  /** Extended client — use this for all application queries */
  readonly client;

  constructor(private readonly tenancyService: TenancyService) {
    this.client = this.base
      .$extends(
        createPrismaTenancyExtension(tenancyService, {
          autoInjectTenantId: true,
          tenantIdField: 'tenantId',
          sharedModels: ['Country', 'Currency'],
        }),
      )
      .$extends(
        createPrismaSoftDeleteExtension({
          softDeleteModels: ['User', 'Post', 'Comment'],
          deletedAtField: 'deletedAt',
          deletedByField: 'deletedBy',
          cascade: {
            User: ['Post'],
            Post: ['Comment'],
          },
          dmmf: prismaDmmf,
        }),
      )
      .$extends(
        createAuditExtension({
          trackedModels: ['User', 'Post', 'Comment'],
          sensitiveFields: ['password', 'ssn'],
          prismaModule,
        }),
      );
  }

  async onModuleInit() {
    await this.base.$connect();
  }
}
```

`prismaDmmf` is application-owned metadata loaded from `prisma/schema.prisma` with a matching `@prisma/internals` version. See [soft-delete DMMF setup](/packages/soft-delete/installation#dmmf-for-cascade-and-relation-filters). Remove `cascade` and `dmmf` if you only need root soft-delete filtering.

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
// soft-delete-events.module.ts
import { Global, Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    { provide: 'EventEmitter2', useExisting: EventEmitter2 },
  ],
  exports: [EventEmitterModule, 'EventEmitter2'],
})
export class SoftDeleteEventsModule {}
```

The string-token alias is required by `@nestarc/soft-delete` 0.6. `EventEmitterModule.forRoot()` exposes the `EventEmitter2` class token, while this package resolves the literal `'EventEmitter2'` token.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TenancyModule } from '@nestarc/tenancy';
import { SoftDeleteModule } from '@nestarc/soft-delete';
import { AuditLogModule } from '@nestarc/audit-log';
import { PrismaModule } from './prisma.module';
import { PrismaService, prismaModule } from './prisma.service';
import { prismaDmmf } from './prisma.dmmf';
import { SoftDeleteAuditListener } from './soft-delete-audit.listener';
import { SoftDeleteEventsModule } from './soft-delete-events.module';

@Module({
  imports: [
    SoftDeleteEventsModule,

    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id',
    }),

    SoftDeleteModule.forRoot({
      softDeleteModels: ['User', 'Post', 'Comment'],
      deletedAtField: 'deletedAt',
      deletedByField: 'deletedBy',
      actorExtractor: (req) => req.user?.id ?? null,
      cascade: { User: ['Post'], Post: ['Comment'] },
      dmmf: prismaDmmf,
      prismaServiceToken: PrismaService,
      enableEvents: true,
    }),

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

    PrismaModule,
  ],
  providers: [SoftDeleteAuditListener],
})
export class AppModule {}
```

::: tip Base vs extended client
`AuditLogModule` receives `prisma.base` (the un-extended `PrismaClient`) for its internal storage. Your application code always uses `prisma.client` (the fully extended client). This separation prevents audit writes from recursively triggering more audit writes.
:::

## How Extensions Interact

Consider what happens when a user soft-deletes a record:

```typescript
await this.prisma.client.user.delete({ where: { id: 'user-42' } });
```

The call reaches the extensions in registration order:

```
1. Tenancy extension
   → Establishes tenant context and delegates

2. Soft-delete extension
   → Intercepts the delete
   → Executes user.update({ where: { id: 'user-42' }, data: { deletedAt: now, deletedBy: actorId } })
     through its captured lower client, which includes tenancy
   → Cascade: also soft-deletes related Post and Comment records

3. Audit extension
   → Is not called for this delete because soft-delete did not invoke its continuation
```

The result is tenant-scoped soft deletion, but no automatic audit entry. Bridge the lifecycle event when best-effort audit is sufficient:

```typescript
// soft-delete-audit.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuditService } from '@nestarc/audit-log';
import { SoftDeletedEvent } from '@nestarc/soft-delete';

@Injectable()
export class SoftDeleteAuditListener {
  constructor(private readonly audit: AuditService) {}

  @OnEvent(SoftDeletedEvent.EVENT_NAME)
  async record(event: SoftDeletedEvent): Promise<void> {
    await this.audit.log({
      action: `${event.model}.deleted`,
      targetType: event.model,
      metadata: {
        where: event.where,
        deletedAt: event.deletedAt,
        count: event.count ?? 1,
      },
    });
  }
}
```

Import the global `SoftDeleteEventsModule`, set `enableEvents: true` on `SoftDeleteModule`, and provide the listener as shown above. Event delivery happens after the mutation and is not transaction-atomic. For compliance-sensitive deletion, use `tenancyTransaction(prisma.base, tenancyService, ...)`, update `deletedAt` explicitly through the transaction client, and pass the same transaction client to `auditService.log()`.

### Read queries follow the same pattern

```typescript
await this.prisma.client.user.findMany();
```

1. **Tenancy extension** -- runs `set_config()` so RLS filters by tenant
2. **Soft-delete extension** -- injects `WHERE deletedAt IS NULL` to exclude soft-deleted rows
3. **Audit extension** -- passes through (no tracking on reads)

The caller receives only active records belonging to the current tenant.

## Adding Pagination

The `paginate()` function from `@nestarc/pagination` works alongside extensions because it calls standard Prisma operations (`findMany` and `count`) on the model delegate you pass in:

```typescript
import { paginate, PaginateQuery } from '@nestarc/pagination';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginateQuery) {
    return paginate(query, this.prisma.client.user, {
      sortableColumns: ['id', 'name', 'email', 'createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      searchableColumns: ['name', 'email'],
      filterableColumns: {
        role: ['$eq', '$in'],
        createdAt: ['$gte', '$lte'],
      },
    });
  }
}
```

Because `this.prisma.client.user` is the fully extended model delegate, the `findMany` and `count` calls that `paginate()` makes internally flow through all three extensions:

- Tenancy scopes results to the current tenant
- Soft-delete excludes deleted records
- Audit-log does not track reads (no side effects)

No special configuration is required. Pagination is orthogonal to the extension chain.

## Gotchas

### Extension order affects behavior

The most common mistake is assuming `$extends()` behaves like a reverse-order wrapper stack. Query callbacks run in registration order, and a callback that does not call its continuation prevents later callbacks from observing the operation.

Always use this order:

```typescript
base
  .$extends(tenancy)     // first — sets RLS context
  .$extends(softDelete)  // second — rewrites delete through its lower client
  .$extends(auditLog)    // third — tracks writes that reach it, but not soft-deletes
```

Treat soft-delete audit as a separate integration requirement; use the event bridge or an explicit transaction described above.

### Base client vs extended client

The `PrismaService` exposes two clients for a reason:

| Client | Use for |
|--------|---------|
| `prisma.base` | Audit log storage and operations that must bypass client extensions |
| `prisma.client` | All application code -- queries flow through tenancy, soft-delete, and audit |

Accidentally using `prisma.base` for application queries skips all extensions. Pass `prisma.base` to `AuditLogModule` as its supported storage contract so audit storage remains separate from application extension behavior; reserve `prisma.client` for business model operations.

The base client bypasses Prisma Client Extensions, **not** PostgreSQL RLS. A cross-tenant administrative query needs a separate, tightly authorized connection and explicit authorization/audit policy; do not treat the runtime base client as an RLS bypass.

### Interactive transactions with tenancy

The tenancy extension wraps queries in batch transactions internally. This conflicts with interactive transactions (`$transaction(async (tx) => ...)`). Two solutions:

**Option 1: `tenancyTransaction()` helper (recommended)**

Uses only public Prisma APIs and works with tenancy's supported Prisma 6 and 7 releases:

```typescript
import { tenancyTransaction } from '@nestarc/tenancy';

await tenancyTransaction(this.prisma.base, this.tenancyService, async (tx) => {
  const tenantId = this.tenancyService.getCurrentTenantOrThrow();
  const user = await tx.user.findFirstOrThrow();
  await tx.order.create({ data: { userId: user.id, total: 100, tenantId } });
});
```

**Option 2: Enable `interactiveTransactionSupport`**

```typescript
createPrismaTenancyExtension(tenancyService, {
  interactiveTransactionSupport: true,
})
```

This option relies on Prisma internal APIs. If your Prisma version is incompatible, extension creation throws immediately. Use `tenancyTransaction()` as a fallback.

::: warning Audit log in transactions
For manual audit log entries inside a tenant-scoped transaction, pass the raw base client to `tenancyTransaction()` and the resulting transaction client to `auditService.log()`:

```typescript
await tenancyTransaction(prisma.base, tenancyService, async (tx) => {
  await tx.invoice.update({ where: { id }, data: { status: 'approved' } });
  await auditService.log({ action: 'invoice.approved', targetId: id }, tx);
});
```

Both the business write and the audit entry roll back together if either fails.
:::

### Soft-delete decorators work per-request

Route decorators like `@WithDeleted()` and `@OnlyDeleted()` change the soft-delete filter mode for the entire request. This applies to all queries in that request, including those made by other services in the call chain. Be mindful of this when a single request triggers queries across multiple services.

### Shared models skip the tenancy extension, not database RLS

Models listed in `sharedModels` (e.g., `Country`, `Currency`) skip the tenancy client extension -- no `set_config()` is called and no tenant field is injected. They do not bypass PostgreSQL RLS. A genuinely shared lookup table should have no tenant RLS policy (or have an explicit database policy designed for shared reads). If those models are also listed in `softDeleteModels`, soft-delete filtering still applies. Design your model lists deliberately:

```typescript
// Tenancy extension
createPrismaTenancyExtension(tenancyService, {
  sharedModels: ['Country', 'Currency'],  // skip tenancy client behavior
})

// Soft-delete extension — don't include shared lookup tables
createPrismaSoftDeleteExtension({
  softDeleteModels: ['User', 'Post', 'Comment'],  // Country/Currency not here
})
```
