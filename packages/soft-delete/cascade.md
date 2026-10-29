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
  dmmf: prismaDmmf,
  prismaServiceToken: EXTENDED_PRISMA,
});
```

When a `User` is soft-deleted, matching active `Post` records are soft-deleted, followed by matching active `Comment` records, up to `maxCascadeDepth`. Already deleted rows retain their deletion timestamps. Configure the same cascade options on the Prisma extension that performs deletes and on the module that performs restores. `EXTENDED_PRISMA` is the exported client token from [installation](./installation#quick-start).

Restoring the `User` restores only related children whose deletion timestamps fall within **±1 second** of the parent's recorded deletion time, then applies the same rule recursively. It does not restore every deleted descendant. This is a timestamp heuristic, not a deletion-batch identity: independently deleted children inside that window may also be restored. Review the affected relations and retention policy before restoring a tree.

Cascade relation lookup requires explicit Prisma DMMF metadata on Prisma 5, 6, and 7. Pass the same `dmmf` value to the extension and module configuration. Missing metadata with cascade configured fails early with `CascadeDmmfMissingError`; see the [DMMF setup](/packages/soft-delete/installation#dmmf-for-cascade-and-relation-filters).

## Atomic Cascade Evidence

This lifecycle recipe uses audit-log 0.7.0 with soft-delete 0.7.5. Audit-log 0.8.0 is outside
that companion's peer range; do not substitute it or bypass peer validation. See the
[version compatibility boundary](./installation#compatibility) before changing either pin.

To commit cascade mutations and their record-level audit rows together, apply extensions in the
fixed tenancy → audit-log → soft-delete order. Configure the extension and module with the same
cascade, DMMF, and lifecycle limits:

```typescript
const cascade = {
  User: ['Post'],
  Post: ['Comment'],
};

const softDeleteOptions = {
  softDeleteModels: ['User', 'Post', 'Comment'],
  cascade,
  dmmf: prismaDmmf,
  auditLifecycle: 'atomic-required' as const,
  auditMaxBatchRecords: 1000,
};

const client = base
  .$extends(createPrismaTenancyExtension(tenancyService, {
    interactiveTransactionSupport: true,
    failClosed: true,
  }))
  .$extends(createAuditExtension({
    consistency: 'atomic-required',
    trackedModels: ['User', 'Post', 'Comment'],
    maxBatchRecords: 1000,
    databaseMapping: {
      User: { tableName: 'User' },
      Post: { tableName: 'Post' },
      Comment: { tableName: 'Comment' },
    },
    prismaModule,
  }))
  .$extends(createPrismaSoftDeleteExtension(softDeleteOptions));

SoftDeleteModule.forRoot({
  ...softDeleteOptions,
  prismaServiceToken: EXTENDED_PRISMA,
});
```

`EXTENDED_PRISMA` must resolve to this exact `client`, not the base client or a wrapper object. Add
every cascade child to audit-log's `trackedModels` and `databaseMapping`, then keep delete and
restore inside `withAuditTransaction()`:

```typescript
await client.withAuditTransaction((tx) =>
  tx.user.delete({ where: { id: userId } }),
);

await client.withAuditTransaction(() =>
  softDelete.restore('User', { id: userId }),
);
```

The parent and each affected descendant receive deterministic record-level
`Model.softDeleted`/`Model.restored` evidence. A failure in any cascade mutation or audit insert
rolls back the entire transaction. Lifecycle events can still drive notifications, but they are
notification-only and must not be treated as commit evidence. See the
[atomic lifecycle setup](./installation#atomic-audit-lifecycle) for the provider alias.

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
