---
title: "Prisma Soft Delete: Why deletedAt Alone Is Not Enough"
date: 2026-04-06
description: "Common soft-delete traps in Prisma — broken unique constraints, orphaned relations, and missing query filters — with battle-tested solutions."
author: nestarc
---

# Prisma Soft Delete: Why deletedAt Alone Is Not Enough

Adding a `deletedAt` column to your Prisma models is the easy part. The hard part is everything that breaks afterward: unique constraints fail, related records become orphans, and `findMany` queries quietly return deleted data.

This post covers the three most common soft-delete problems and how to solve them properly.

## Problem 1: Unique Constraints Break

You add `deletedAt` to your `User` model. A user with email `alice@example.com` is soft-deleted. Now a new user tries to register with the same email — and gets a unique constraint violation.

```prisma
// This breaks after the first soft-delete
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique  // blocks re-registration
  deletedAt DateTime?
}
```

**Fix:** Use a composite unique constraint that includes `deletedAt`:

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String
  deletedAt DateTime?

  @@unique([email, deletedAt])
}
```

This works because most databases treat `NULL` as distinct in unique indexes. Active records (where `deletedAt IS NULL`) enforce uniqueness, while soft-deleted records (with timestamps) do not collide.

## Problem 2: Queries Return Deleted Records

Every `findMany`, `findFirst`, and `count` call needs a `where: { deletedAt: null }` filter. Miss one and deleted data leaks into your API responses.

```typescript
// Easy to forget the filter
const users = await prisma.user.findMany();

// Must remember every time
const users = await prisma.user.findMany({
  where: { deletedAt: null },
});
```

This is error-prone at scale. With 50+ queries across your codebase, someone will forget.

**Fix:** Use a Prisma Client Extension to automatically inject the filter:

```typescript
import { SoftDeleteModule } from '@nestarc/soft-delete';

@Module({
  imports: [
    SoftDeleteModule.forRoot({
      softDeleteModels: ['User', 'Post', 'Comment'],
      prismaServiceToken: PrismaService,
    }),
  ],
})
export class AppModule {}
```

Now all queries on tracked models automatically exclude deleted records. No manual `where` clauses needed.

When you **do** need deleted records (admin panels, recovery tools), use the `@WithDeleted()` decorator:

```typescript
@WithDeleted()
@Get('trash')
async listDeletedUsers() {
  return this.userService.findAll(); // includes soft-deleted records
}
```

## Problem 3: Orphaned Related Records

Soft-deleting a `User` without touching their `Post` and `Comment` records creates orphans — posts that belong to a "deleted" user still show up in queries.

```typescript
// Only the user is soft-deleted
await softDeleteService.softDelete('User', userId);

// Their posts are still visible!
const posts = await prisma.post.findMany(); // includes orphaned posts
```

**Fix:** Configure cascade relationships:

```typescript
SoftDeleteModule.forRoot({
  softDeleteModels: ['User', 'Post', 'Comment'],
  cascade: {
    User: ['Post'],    // soft-deleting a User cascades to their Posts
    Post: ['Comment'], // soft-deleting a Post cascades to its Comments
  },
  maxCascadeDepth: 3,
  prismaServiceToken: PrismaService,
});
```

When a `User` is soft-deleted, all their `Post` records are soft-deleted automatically, and each post's `Comment` records follow. Restoring the user reverses the entire tree.

## Bonus: Permanent Deletion (Purge)

Soft-deleted records accumulate over time. Schedule periodic purges for records past their retention period:

```typescript
// Permanently remove records soft-deleted more than 90 days ago
const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

await softDeleteService.purge('User', {
  where: { deletedAt: { lt: cutoff } },
});
```

## Next Steps

- [Installation](/packages/soft-delete/installation) — set up `@nestarc/soft-delete` in your project
- [Cascade Configuration](/packages/soft-delete/cascade) — parent-child relationship setup
- [Restore & Purge](/packages/soft-delete/restore-purge) — recovery and permanent deletion APIs
- [Decorators](/packages/soft-delete/decorators) — `@WithDeleted()`, `@OnlyDeleted()` for query control
