---
description: "Configure cascade soft-delete relationships and handle unique constraint conflicts in @nestarc/soft-delete."
---

# Cascade & Unique Constraints

## Cascade Configuration

Define parent-to-children relationships to automatically cascade soft-delete and restore operations.

```typescript
SoftDeleteModule.forRoot({
  softDeleteModels: ['User', 'Post', 'Comment'],
  cascade: {
    User: ['Post'],
    Post: ['Comment'],
  },
  maxCascadeDepth: 3,
  prismaServiceToken: PrismaService,
});
```

When a `User` is soft-deleted, all their `Post` records are soft-deleted automatically, and each post's `Comment` records are soft-deleted as well. Restoring the `User` reverses the entire tree up to `maxCascadeDepth` levels deep.

---

## Unique Constraint Strategy

Standard `@unique` constraints break when multiple soft-deleted rows share the same value (e.g. two deleted users with the same email). Use a composite unique constraint that includes `deletedAt`:

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String
  deletedAt DateTime?

  @@unique([email, deletedAt])
}
```

This allows multiple soft-deleted rows with the same email while still enforcing uniqueness among active records (where `deletedAt IS NULL`). Note that this works in most databases because `NULL` values are treated as distinct in unique indexes. Verify this behaviour for your specific database engine.
