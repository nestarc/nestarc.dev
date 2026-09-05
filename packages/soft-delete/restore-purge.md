---
description: "Restore soft-deleted records or permanently purge them using SoftDeleteService methods."
---

# Restore, Bulk Restore, Force Delete & Purge

::: tip Authoritative lifecycle evidence
Soft-delete 0.7 adds an opt-in atomic bridge for `@nestarc/audit-log`; version 0.7.2 accepts the
optional audit peer range `^0.4.1 || ^0.5.0`. Configure `auditLifecycle: 'atomic-required'` on both
the extension and module, inject the exact composed tenancy → audit-log → soft-delete client, and
run these methods inside `withAuditTransaction()`. Lifecycle events are notification-only.
:::

## SoftDeleteService Methods

### `restore()`

Restore a soft-deleted record by clearing its `deletedAt` (and `deletedBy`) field. If cascade is configured, child records are restored as well.

```typescript
// Restore a soft-deleted user
@Post(':id/restore')
restore(@Param('id') id: string) {
  return this.softDelete.restore('User', { id: +id });
}
```

### `restoreMany()`

Restore all matching soft-deleted records and return Prisma's `{ count }` result:

```typescript
const result = await this.softDelete.restoreMany('User', {
  where: {
    organizationId,
    role: 'GUEST',
  },
});

console.log(`Restored ${result.count} users`);
```

The method enforces `deletedAt: { not: null }`, clears `deletedBy` when configured, and emits one `RestoredEvent` with `count` when at least one row is restored. If cascade is configured, it restores timestamp-matched descendants for each affected parent.

::: warning
Bulk cascade restore performs descendant recovery for each matched parent. Bound the `where` clause, test the operation on production-like data, and run it through an authorized administrative workflow.
:::

### `forceDelete()`

Permanently delete a record from the database, bypassing soft-delete logic entirely.

### `purge()`

Permanently remove old soft-deleted records. Use with `@nestjs/schedule` to run on a schedule.

## Atomic Restore, Purge, and Bulk Work

When the audit lifecycle bridge is enabled, wrap every lifecycle write in the composed client's
transaction helper. `SoftDeleteService` uses the same injected client and joins that ambient
transaction:

```typescript
await prisma.client.withAuditTransaction(() =>
  softDelete.restore('User', { id }),
);

await prisma.client.withAuditTransaction(() =>
  softDelete.restoreMany('User', {
    where: { organizationId, role: 'GUEST' },
  }),
);

await prisma.client.withAuditTransaction((tx) =>
  tx.user.deleteMany({ where: { organizationId, status: 'INACTIVE' } }),
);

await prisma.client.withAuditTransaction(() =>
  softDelete.forceDelete('User', { id }),
);

await prisma.client.withAuditTransaction(() =>
  softDelete.purge('User', {
    olderThan: retentionCutoff,
    where: { organizationId },
  }),
);
```

The mutation and each record-level `Model.restored` or `Model.purged` audit row commit or roll back
together. `restoreMany()` fails before mutation when the affected row count exceeds
`auditMaxBatchRecords`; audit-log's `maxBatchRecords` independently bounds physical bulk deletes,
so keep the two limits aligned. Calls outside `withAuditTransaction()`, a best-effort audit client,
or a base/differently composed client fail closed. See the
[atomic lifecycle setup](./installation#atomic-audit-lifecycle).

---

## Purge (Scheduled Hard-Delete)

Use `SoftDeleteService.purge()` with `@nestjs/schedule` to permanently remove old soft-deleted records on a schedule.

The example below assumes the atomic audit lifecycle setup. If the bridge is disabled, call
`purge()` directly instead.

```bash
npm install @nestjs/schedule
```

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SoftDeleteService } from '@nestarc/soft-delete';
import { TenancyContext } from '@nestarc/tenancy';
import { PrismaService } from './prisma.service';
import { TenantDirectory } from './tenant-directory';

@Injectable()
export class PurgeService {
  private readonly tenancyContext = new TenancyContext();

  constructor(
    private readonly softDelete: SoftDeleteService,
    private readonly prisma: PrismaService,
    private readonly tenantDirectory: TenantDirectory,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async purgeOldRecords() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    for (const tenantId of await this.tenantDirectory.listActiveTenantIds()) {
      await this.tenancyContext.run(tenantId, async () => {
        const users = await this.prisma.client.withAuditTransaction(() =>
          this.softDelete.purge('User', { olderThan: thirtyDaysAgo }),
        );
        const posts = await this.prisma.client.withAuditTransaction(() =>
          this.softDelete.purge('Post', { olderThan: thirtyDaysAgo }),
        );

        console.log(`Purged ${users.count} users and ${posts.count} posts for ${tenantId}`);
      });
    }
  }
}
```

`TenantDirectory` is an application-owned, authorized source of tenant IDs. `TenancyContext`
instances share the package's static AsyncLocalStorage, so the explicitly constructed context above
joins the same store used by the tenancy extension without relying on a non-exported Nest provider.
Enter each tenant with `TenancyContext.run()` before starting the audit transaction; a fail-closed
tenancy extension must reject a scheduled operation that has no tenant context. Single-tenant
applications that do not install the tenancy extension can omit the directory and context loop.

`purge()` also accepts an optional `where` for additional filtering:

```typescript
await this.softDelete.purge('Post', {
  olderThan: thirtyDaysAgo,
  where: { authorId: userId },
});
```

---

## Standalone Usage

Use `createPrismaSoftDeleteExtension()` without NestJS — useful in scripts, tests, or non-NestJS projects:

```typescript
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';
import { basePrisma } from './prisma';
import { prismaDmmf } from './prisma.dmmf';

const prisma = basePrisma.$extends(
  createPrismaSoftDeleteExtension({
    softDeleteModels: ['User', 'Post', 'Comment'],
    deletedAtField: 'deletedAt',
    deletedByField: 'deletedBy',
    cascade: {
      User: ['Post'],
      Post: ['Comment'],
    },
    maxCascadeDepth: 3,
    dmmf: prismaDmmf,
  }),
);

// delete is now a soft-delete
await prisma.user.delete({ where: { id: 1 } });

// findMany automatically excludes soft-deleted rows
const activeUsers = await prisma.user.findMany();
```

The example assumes `basePrisma` uses the Prisma 7 generated client and driver adapter. `prismaDmmf` is required because cascade is enabled; see the [DMMF setup](./installation#dmmf-for-cascade-and-relation-filters).

### `SoftDeleteExtensionOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `softDeleteModels` | `string[]` | — | **Required.** Models to enable soft-delete for. |
| `deletedAtField` | `string` | `'deletedAt'` | Field that stores the soft-delete timestamp. |
| `deletedByField` | `string \| null` | `null` | Field to store actor ID. |
| `cascade` | `Record<string, string[]>` | `undefined` | Parent-to-children cascade map. |
| `maxCascadeDepth` | `number` | `3` | Maximum cascade depth. |
| `dmmf` | `PrismaDmmfLike` | `undefined` | Explicit DMMF metadata for cascade and relation-filter lookup. |
| `relationFilters` | `boolean \| RelationFilterOptions` | `false` | Opt-in filters for to-many `include` and `select` trees. |
| `eventEmitter` | `{ emitSoftDeleted: (event) => void } \| null` | `null` | Optional custom event emitter. |
| `auditLifecycle` | `'atomic-required'` | `undefined` | Require atomic lifecycle integration with the earlier audit-log extension. |
| `auditMaxBatchRecords` | `number` | `1000` | Maximum records converted to record-level `deleteMany`/`restoreMany` lifecycle mutations. |
