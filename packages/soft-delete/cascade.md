---
description: "Configure cascade soft-delete relationships and database-specific active-row unique constraints in @nestarc/soft-delete."
---

# Cascade & Active-Row Uniqueness

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

Cascade relation lookup requires explicit Prisma DMMF metadata on Prisma 5, 6, and 7. Pass the same `dmmf` value to the extension and module configuration. Missing metadata with cascade configured fails early with `CascadeDmmfMissingError`; see the [DMMF setup](/packages/soft-delete/installation#dmmf-for-cascade-and-relation-filters).

---

## Active-Row Unique Constraints

Soft-deleted rows still participate in normal database unique constraints. A plain unique email therefore prevents a new active account from reusing the value after the original row is deleted.

::: danger Do not use `@@unique([email, deletedAt])`
Many databases treat `NULL` values as distinct. Because active rows all have `deletedAt = NULL`, the composite constraint can allow duplicate active emails instead of rejecting them.
:::

Prisma schema syntax cannot express every partial or functional index. Keep the fields in the Prisma model, then add database-specific DDL in a migration.

### PostgreSQL

```sql
CREATE UNIQUE INDEX users_email_active_unique
  ON "User" ("email")
  WHERE "deletedAt" IS NULL;
```

For mapped snake-case tables:

```sql
CREATE UNIQUE INDEX users_email_active_unique
  ON users (email)
  WHERE deleted_at IS NULL;
```

### SQLite

```sql
CREATE UNIQUE INDEX users_email_active_unique
  ON User (email)
  WHERE deletedAt IS NULL;
```

### MySQL

Use a generated column populated only for active rows:

```sql
ALTER TABLE users
  ADD active_email VARCHAR(255)
    GENERATED ALWAYS AS (
      CASE WHEN deleted_at IS NULL THEN email ELSE NULL END
    ) STORED,
  ADD UNIQUE INDEX users_active_email_unique (active_email);
```

### Migration Checklist

1. Remove or replace the existing global unique constraint; leaving it in place still blocks reuse after deletion.
2. Check for duplicate active values before creating the new index.
3. Apply the database-specific index in a reviewed migration.
4. Verify a duplicate active value fails.
5. Soft-delete the original row and verify the value can be reused by one new active row.
6. Verify active-only reads still return a single record.

The upstream PostgreSQL E2E suite covers both value reuse after soft-delete and rejection of duplicate active rows.
