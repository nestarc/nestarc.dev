---
description: "Upgrade notes and resolved issues for @nestarc/soft-delete 0.5.0."
---

# v0.5.0 Changes & Resolved Issues

`@nestarc/soft-delete` 0.5.0 was published on June 13, 2026. The release is additive: relation filtering remains disabled by default, and no database schema migration is required by the package itself.

## Added

| Area | Change | Adoption impact |
|---|---|---|
| Relation reads | Opt-in filtering for to-many `include` and `select` trees | Response shapes change only after `relationFilters` is enabled |
| Route control | `@WithDeletedRelations(...paths)` | Allows exact, authorized exceptions without disabling root filtering |
| Recovery | `SoftDeleteService.restoreMany()` | Restores matching deleted rows and cascade descendants when configured |
| Events | Optional `count` on deleted and restored events | Bulk operations can report affected-row counts |
| Uniqueness | PostgreSQL, SQLite, and MySQL active-row recipes | Replaces unsafe composite-null uniqueness guidance |
| Compatibility | NestJS 10/Prisma 5 and NestJS 11/Prisma 6 CI matrix | Matches the published peer dependency range |

## Resolved Runtime Issue

### `deleteMany()` rewrote existing deletion timestamps

Before 0.5, a broad soft-delete `deleteMany()` could update rows that were already soft-deleted. That replaced their original `deletedAt` timestamp and could distort retention calculations, audit history, and timestamp-matched cascade restore behavior.

Version 0.5 adds an active-row predicate to both cascade and non-cascade bulk paths:

```typescript
await prisma.user.deleteMany({
  where: { organizationId },
});

// Internally constrained with: deletedAt: null
```

Only active rows are updated, the returned `count` represents newly soft-deleted rows, and previously deleted rows retain their timestamp.

## Resolved Documentation Pitfall

The former `@@unique([email, deletedAt])` recommendation does not reliably enforce uniqueness among active rows. Databases that treat `NULL` values as distinct can allow multiple rows with the same email while every active row has `deletedAt = NULL`.

The documentation now uses database-specific active-row constraints:

- PostgreSQL and SQLite: partial unique indexes with `WHERE deletedAt IS NULL`
- MySQL: a generated active-value column with a unique index

See [Active-Row Unique Constraints](./cascade#active-row-unique-constraints) before changing a production constraint.

## Release Pipeline Fix

The tagged release workflow now runs lint and verifies package contents with `npm pack --dry-run` before publishing. npm publication uses trusted publishing through GitHub OIDC instead of a long-lived token.

## Upgrade Checklist

1. Upgrade the dependency to `@nestarc/soft-delete@0.5.0`.
2. Run existing delete, cascade restore, purge, and event tests; no package-owned SQL migration is required.
3. Confirm bulk delete counts and retention logic now rely on newly deleted rows only.
4. Review active-row unique constraints separately and deploy database-specific DDL where needed.
5. Adopt `restoreMany()` where bulk recovery previously used application loops.
6. Enable `relationFilters` only after checking nested response shapes and DMMF availability.

The authoritative release notes are available in the [v0.5.0 GitHub release](https://github.com/nestarc/nestjs-soft-delete/releases/tag/v0.5.0), and the generated surface is in the [API Reference](/api/soft-delete/).
