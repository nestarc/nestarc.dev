# Restore, Force Delete & Purge

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
import { PrismaClient } from '@prisma/client';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';

const prisma = new PrismaClient().$extends(
  createPrismaSoftDeleteExtension({
    softDeleteModels: ['User', 'Post', 'Comment'],
    deletedAtField: 'deletedAt',
    deletedByField: 'deletedBy',
    cascade: {
      User: ['Post'],
      Post: ['Comment'],
    },
    maxCascadeDepth: 3,
  }),
);

// delete is now a soft-delete
await prisma.user.delete({ where: { id: 1 } });

// findMany automatically excludes soft-deleted rows
const activeUsers = await prisma.user.findMany();
```

### `SoftDeleteExtensionOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `softDeleteModels` | `string[]` | — | **Required.** Models to enable soft-delete for. |
| `deletedAtField` | `string` | `'deletedAt'` | Field that stores the soft-delete timestamp. |
| `deletedByField` | `string \| null` | `null` | Field to store actor ID. |
| `cascade` | `Record<string, string[]>` | `undefined` | Parent-to-children cascade map. |
| `maxCascadeDepth` | `number` | `3` | Maximum cascade depth. |
| `eventEmitter` | `{ emitSoftDeleted: (event) => void } \| null` | `null` | Optional custom event emitter. |
