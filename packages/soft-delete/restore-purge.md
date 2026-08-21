---
description: "Restore soft-deleted records or permanently purge them using SoftDeleteService methods."
---

# Restore, Bulk Restore, Force Delete & Purge

::: warning audit-log 0.4 compatibility
The audit-side atomic lifecycle bridge in audit-log 0.4 cannot be used with the currently published
soft-delete 0.6.0 package. Use `RestoredEvent` and `PurgedEvent` with `AuditService.log()` for
best-effort evidence. If the log must commit or roll back with the lifecycle change, perform the
equivalent Prisma update or delete and `AuditService.log(input, tx)` in one explicit transaction.
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

---

## Purge (Scheduled Hard-Delete)

Use `SoftDeleteService.purge()` with `@nestjs/schedule` to permanently remove old soft-deleted records on a schedule.

```bash
npm install @nestjs/schedule
```

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SoftDeleteService } from '@nestarc/soft-delete';

@Injectable()
export class PurgeService {
  constructor(private readonly softDelete: SoftDeleteService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async purgeOldRecords() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const users = await this.softDelete.purge('User', { olderThan: thirtyDaysAgo });
    const posts = await this.softDelete.purge('Post', { olderThan: thirtyDaysAgo });

    console.log(`Purged ${users.count} users, ${posts.count} posts`);
  }
}
```

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
