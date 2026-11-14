---
description: "Restore soft-deleted records or permanently purge them using SoftDeleteService methods."
---

# Restore, Bulk Restore, Force Delete & Purge

::: tip Authoritative lifecycle evidence
Use tenancy 0.16.4, audit-log 0.7.0 and soft-delete 0.7.5 for the tenant-scoped PostgreSQL examples below. Set `auditLifecycle: 'atomic-required'` on both the extension and module. Inject the client built with audit-log first and soft-delete second. The [atomic lifecycle setup](./installation#atomic-audit-lifecycle) binds the tenant inside that client's `withAuditTransaction()`. Soft-delete 0.7.5 excludes audit-log 0.8.0 from its optional peer range.
:::

## SoftDeleteService Methods

### `restore()`

Restore a soft-deleted record by clearing its `deletedAt` (and `deletedBy`) field. If cascade is configured, related children deleted within ±1 second of the parent are restored recursively up to `maxCascadeDepth`. Previously deleted children outside that window remain deleted; see [cascade restore semantics](./cascade#cascade-configuration).

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

See [lifecycle event listeners and their notification-only contract](./events#notification-only-contract)
before using restore events for metrics or downstream notifications. An event can be observed
before an outer transaction commits, so it does not prove that the restore became durable.

::: warning
Bulk cascade restore performs descendant recovery for each matched parent. Bound the `where` clause, test the operation on production-like data, and run it through an authorized administrative workflow.
:::

### `forceDelete()`

Permanently delete a record from the database, bypassing soft-delete logic entirely.

### `purge()`

Permanently remove old soft-deleted records. Use with `@nestjs/schedule` to run on a schedule.

## Atomic Restore, Purge, and Bulk Work

Use `withTenantAuditTransaction()` from the [atomic lifecycle setup](./installation#atomic-audit-lifecycle). It passes `tenancyTransactionCallback()` to the audit transaction owner. `SoftDeleteService` joins this transaction through the lifecycle client injected into the module.

```typescript
await prisma.withTenantAuditTransaction(() =>
  softDelete.restore('User', { id }),
);

await prisma.withTenantAuditTransaction(() =>
  softDelete.restoreMany('User', {
    where: { organizationId, role: 'GUEST' },
  }),
);

await prisma.withTenantAuditTransaction((tx) =>
  tx.user.deleteMany({ where: { organizationId, status: 'INACTIVE' } }),
);

await prisma.withTenantAuditTransaction(() =>
  softDelete.forceDelete('User', { id }),
);

await prisma.withTenantAuditTransaction(() =>
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
        const users = await this.prisma.withTenantAuditTransaction(() =>
          this.softDelete.purge('User', { olderThan: thirtyDaysAgo }),
        );
        const posts = await this.prisma.withTenantAuditTransaction(() =>
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
supplies the tenant read by the transaction callback. Enter each authorized tenant with
`TenancyContext.run()` before starting the audit transaction. The callback rejects missing tenant context before issuing database work.

`purge()` also accepts an optional `where` for additional filtering:

```typescript
await this.prisma.withTenantAuditTransaction(() =>
  this.softDelete.purge('Post', {
    olderThan: thirtyDaysAgo,
    where: { authorId: userId },
  }),
);
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
| `dmmf` | `PrismaDmmfLike` | `undefined` | Explicit DMMF required for cascade, relation filters, and audited bulk operations on custom primary keys. |
| `relationFilters` | `boolean \| RelationFilterOptions` | `false` | Opt-in filters for to-many `include` and `select` trees. |
| `eventEmitter` | `{ emitSoftDeleted: (event) => void } \| null` | `null` | Optional custom event emitter. |
| `auditLifecycle` | `'atomic-required'` | `undefined` | Require atomic lifecycle integration with the earlier audit-log extension. |
| `auditMaxBatchRecords` | `number` | `1000` | Maximum records converted to record-level `deleteMany`/`restoreMany` lifecycle mutations. |
