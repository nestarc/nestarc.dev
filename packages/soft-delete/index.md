---
description: "Prisma soft-delete extension for NestJS — intercept deletes, filter root and relation reads, cascade, bulk restore, purge, and emit lifecycle events."
---

# @nestarc/soft-delete

Prisma soft-delete extension for NestJS. Automatically intercepts delete operations, filters deleted records from queries, and supports cascade soft-delete, bulk restore, purge, events, and relation-aware reads.

::: tip Current release: 0.6.0
Version 0.6 adds first-class Prisma 7 support through Prisma Config, explicit generated-client output, and the PostgreSQL driver adapter. Prisma 5 and 6 remain in the peer range. Cascade and relation filters now require explicit DMMF metadata.
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
```

Supported peer ranges are NestJS 10/11 and Prisma 5/6/7. Prisma 7 is the primary development and PostgreSQL E2E target. See the [installation guide](./installation#compatibility) and [Prisma 7 setup guide](/guide/prisma-7).
