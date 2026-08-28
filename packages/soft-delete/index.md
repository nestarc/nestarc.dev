---
description: "Prisma soft-delete extension for NestJS — intercept deletes, filter root and relation reads, cascade, bulk restore, purge, and emit lifecycle events."
---

<script setup>
import PackageVersion from '../../.vitepress/theme/components/PackageVersion.vue'
</script>

# @nestarc/soft-delete

Prisma soft-delete extension for NestJS. Automatically intercepts delete operations, filters deleted records from queries, and supports cascade soft-delete, bulk restore, purge, events, and relation-aware reads.

For the database rules and client boundary behind a production setup, read [Prisma Soft Delete: Why `deletedAt` Alone Is Not Enough](/blog/prisma-soft-delete-done-right).

::: tip Current release
Current package version: <PackageVersion slug="soft-delete" />

Version 0.7 adds an opt-in, fail-closed atomic lifecycle bridge for `@nestarc/audit-log`.
Version 0.7.1 accepts the optional audit-log peer range `^0.4.1 || ^0.5.0` with the same
capability handshake on both lines and no soft-delete runtime behavior changes. Prisma 5, 6, and 7
remain in the peer range; cascade and relation filters require explicit DMMF metadata.
:::

---

## Features

- Automatic soft-delete: `delete` and `deleteMany` become `update`/`updateMany` setting `deletedAt`
- Transparent query filtering: `findMany`, `findFirst`, `findUnique`, `count`, `aggregate`, `groupBy` all exclude soft-deleted rows by default
- Opt-in relation filtering for to-many Prisma `include` and `select` trees
- Cascade soft-delete and restore across related models
- `restore()`, `restoreMany()`, `forceDelete()`, and `purge()` operations on `SoftDeleteService`
- Route-decorator control: `@WithDeleted()`, `@OnlyDeleted()`, `@SkipSoftDelete()`, `@WithDeletedRelations()`
- Optional actor tracking via `deletedByField` and `actorExtractor`
- Lifecycle events (`SoftDeletedEvent`, `RestoredEvent`, `PurgedEvent`) via `@nestjs/event-emitter`
- Opt-in atomic lifecycle evidence for soft-delete, restore, purge, cascade, and bounded bulk work
  through `@nestarc/audit-log`
- Fail-closed `auditMaxBatchRecords` guard for record-level `deleteMany` and `restoreMany` evidence
- Testing utilities: `TestSoftDeleteModule`, `expectSoftDeleted`, `expectNotSoftDeleted`, `expectCascadeSoftDeleted`
- Standalone Prisma extension (`createPrismaSoftDeleteExtension`) for use without NestJS
- Global module — register once, use everywhere

---

## Start Here

- [Installation & Quick Start](./installation) — supported versions and module setup
- [Relation Filters](./relation-filters) — filter soft-deleted children in nested reads
- [Cascade & Unique Constraints](./cascade) — cascade behavior and active-row uniqueness
- [Restore, Force Delete & Purge](./restore-purge) — single and bulk recovery operations
- [Upgrade to 0.6](./release-0.6) — Prisma 7 and explicit DMMF migration notes
- [v0.5 Upgrade & Resolved Issues](./release-0.5) — changes, fixes, and adoption checklist
- [API Reference](/api/soft-delete/) — generated TypeScript documentation

---

## Installation

```bash
npm install @nestarc/soft-delete
# or
yarn add @nestarc/soft-delete
# or
pnpm add @nestarc/soft-delete
```

**Required peer dependencies** (install if not already present):

```bash
npm install @nestjs/common @nestjs/core @prisma/client reflect-metadata rxjs
```

For direct PostgreSQL connections with Prisma 7:

```bash
npm install @prisma/adapter-pg pg
```

**Optional peer dependencies:**

```bash
# For lifecycle events
npm install @nestjs/event-emitter

# For scheduled purge jobs
npm install @nestjs/schedule

# For authoritative, same-transaction lifecycle evidence
npm install @nestarc/audit-log@^0.5.0

# Optional tenant context for the composed Prisma client
npm install @nestarc/tenancy@^0.15.0
```

Supported peer ranges are NestJS 10/11 and Prisma 5/6/7. The optional audit-log peer range is
`^0.4.1 || ^0.5.0`. Prisma 7 is the primary development and PostgreSQL E2E target. See the
[installation guide](./installation#compatibility), [atomic lifecycle setup](./installation#atomic-audit-lifecycle),
and [Prisma 7 setup guide](/guide/prisma-7).
