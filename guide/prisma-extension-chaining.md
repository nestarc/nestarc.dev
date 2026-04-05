# Prisma Extension Chaining

Combine `@nestarc/tenancy`, `@nestarc/soft-delete`, and `@nestarc/audit-log` in a single `PrismaService` using Prisma Client Extensions. This guide explains how the extensions compose, why their order matters, and how to wire everything together.

## Overview

Prisma Client Extensions use `$extends()` to wrap the client with additional behavior. Each call returns a new client that layers on top of the previous one:

```typescript
const extended = new PrismaClient()
  .$extends(extensionA)
  .$extends(extensionB)
  .$extends(extensionC);
```

When you call `extended.user.findMany()`, Prisma executes extensions in reverse registration order. The last extension registered runs first and delegates down to the previous one. This means:

- **Extension C** intercepts the query first
- **Extension B** intercepts next
- **Extension A** intercepts last, closest to the raw database call

This is the same pattern as middleware stacks: the outermost layer runs first, the innermost layer touches the database. Understanding this is critical to getting the right behavior when combining nestarc packages.

## Recommended Order

```typescript
const prisma = new PrismaClient()
  .$extends(createPrismaTenancyExtension(tenancyService))   // 1st — innermost
  .$extends(createPrismaSoftDeleteExtension({ ... }))        // 2nd — middle
  .$extends(createAuditExtension({ ... }));                  // 3rd — outermost
```

### Why this order

| Position | Extension | Reason |
|----------|-----------|--------|
| 1st (innermost) | `createPrismaTenancyExtension` | Runs `set_config()` to establish the RLS context before any query hits PostgreSQL. Every subsequent extension benefits from tenant isolation. |
| 2nd (middle) | `createPrismaSoftDeleteExtension` | Intercepts `delete` operations and converts them to `update` (setting `deletedAt`). Also injects `deletedAt IS NULL` filters into read queries. Must run after tenancy so those rewritten queries are still tenant-scoped. |
| 3rd (outermost) | `createAuditExtension` | Observes the final operation (including soft-delete rewrites) and records the change. Runs first in the call chain, so it sees what the caller intended, then delegates down to soft-delete and tenancy. |

::: warning Extension order affects behavior
If you place `createAuditExtension` before `createPrismaSoftDeleteExtension` in the `$extends` chain, audit-log would see the raw `delete` call rather than the rewritten `update`. The recommended order ensures audit-log captures the actual database operation (a soft-delete update) rather than the original intent (a hard delete).
:::

## PrismaService Example

A complete `PrismaService` that chains all three extensions:

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenancyService, createPrismaTenancyExtension } from '@nestarc/tenancy';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';
import { createAuditExtension } from '@nestarc/audit-log';

@Injectable()
export class PrismaService implements OnModuleInit {
  /** Base client — used by AuditLogModule for writing/querying audit records */
  readonly base = new PrismaClient();

  /** Extended client — use this for all application queries */
  readonly client;

  constructor(private readonly tenancyService: TenancyService) {
    this.client = this.base
      .$extends(
        createPrismaTenancyExtension(tenancyService, {
          autoInjectTenantId: true,
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
        }),
      )
      .$extends(
        createAuditExtension({
          trackedModels: ['User', 'Post', 'Comment'],
          sensitiveFields: ['password', 'ssn'],
        }),
      );
  }

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
import { TenancyModule } from '@nestarc/tenancy';
import { SoftDeleteModule } from '@nestarc/soft-delete';
import { AuditLogModule } from '@nestarc/audit-log';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id',
    }),

    SoftDeleteModule.forRoot({
      softDeleteModels: ['User', 'Post', 'Comment'],
      deletedAtField: 'deletedAt',
      deletedByField: 'deletedBy',
      actorExtractor: (req) => req.user?.id ?? null,
      cascade: { User: ['Post'], Post: ['Comment'] },
      prismaServiceToken: PrismaService,
    }),

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

    PrismaModule,
  ],
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

The call flows through the extension chain:

```
1. Audit extension (outermost)
   → Sees: user.delete({ where: { id: 'user-42' } })
   → Delegates down to soft-delete

2. Soft-delete extension (middle)
   → Intercepts the delete
   → Rewrites to: user.update({ where: { id: 'user-42' }, data: { deletedAt: now, deletedBy: actorId } })
   → Cascade: also soft-deletes related Post and Comment records
   → Delegates the rewritten update down to tenancy

3. Tenancy extension (innermost)
   → Wraps the update in a batch transaction
   → Runs SET LOCAL set_config('app.current_tenant', 'tenant-abc', true)
   → Executes the UPDATE against PostgreSQL
   → RLS ensures the operation only affects the current tenant's rows

4. Audit extension (post-query)
   → Records the change: action=delete, model=User, targetId=user-42
   → Captures before/after diff (deletedAt: null → timestamp)
```

The result: the row is soft-deleted, scoped to the correct tenant, and an audit log entry is written -- all from a single `delete()` call.

### Read queries follow the same pattern

```typescript
await this.prisma.client.user.findMany();
```

1. **Audit extension** -- passes through (no tracking on reads)
2. **Soft-delete extension** -- injects `WHERE deletedAt IS NULL` to exclude soft-deleted rows
3. **Tenancy extension** -- runs `set_config()` so RLS filters by tenant

The caller receives only active records belonging to the current tenant.

## Adding Pagination

The `paginate()` function from `@nestarc/pagination` works alongside extensions because it calls standard Prisma operations (`findMany` and `count`) on the model delegate you pass in:

```typescript
import { paginate, PaginateQuery, Paginated } from '@nestarc/pagination';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginateQuery): Promise<Paginated<User>> {
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

The most common mistake is registering extensions in the wrong order. If tenancy is not innermost, queries may execute before the RLS context is set. If audit-log is not outermost, it may miss soft-delete rewrites.

Always use this order:

```typescript
base
  .$extends(tenancy)     // innermost — sets RLS context
  .$extends(softDelete)  // middle — rewrites delete to update
  .$extends(auditLog)    // outermost — records changes
```

### Base client vs extended client

The `PrismaService` exposes two clients for a reason:

| Client | Use for |
|--------|---------|
| `prisma.base` | Audit log storage, admin queries, anything that should bypass extensions |
| `prisma.client` | All application code -- queries flow through tenancy, soft-delete, and audit |

Accidentally using `prisma.base` for application queries skips all extensions. Accidentally passing `prisma.client` to `AuditLogModule` causes recursive audit writes.

### Interactive transactions with tenancy

The tenancy extension wraps queries in batch transactions internally. This conflicts with interactive transactions (`$transaction(async (tx) => ...)`). Two solutions:

**Option 1: `tenancyTransaction()` helper (recommended)**

Uses only public Prisma APIs and works with all Prisma versions:

```typescript
import { tenancyTransaction } from '@nestarc/tenancy';

await tenancyTransaction(this.prisma.client, this.tenancyService, async (tx) => {
  const user = await tx.user.findFirst();
  await tx.order.create({ data: { userId: user.id, total: 100 } });
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
For manual audit log entries inside a transaction, pass the transaction client to `auditService.log()`:

```typescript
await prisma.base.$transaction(async (tx) => {
  await tx.invoice.update({ where: { id }, data: { status: 'approved' } });
  await auditService.log({ action: 'invoice.approved', targetId: id }, tx);
});
```

Both the business write and the audit entry roll back together if either fails.
:::

### Soft-delete decorators work per-request

Route decorators like `@WithDeleted()` and `@OnlyDeleted()` change the soft-delete filter mode for the entire request. This applies to all queries in that request, including those made by other services in the call chain. Be mindful of this when a single request triggers queries across multiple services.

### Shared models skip tenancy but not soft-delete

Models listed in `sharedModels` (e.g., `Country`, `Currency`) bypass the tenancy extension -- no `set_config()` is called and no `tenant_id` is injected. However, if those models are also listed in `softDeleteModels`, soft-delete filtering still applies. Design your model lists deliberately:

```typescript
// Tenancy extension
createPrismaTenancyExtension(tenancyService, {
  sharedModels: ['Country', 'Currency'],  // skip RLS for these
})

// Soft-delete extension — don't include shared lookup tables
createPrismaSoftDeleteExtension({
  softDeleteModels: ['User', 'Post', 'Comment'],  // Country/Currency not here
})
```
