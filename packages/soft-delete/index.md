---
description: "Prisma soft-delete extension for NestJS — intercept deletes, filter root and relation reads, cascade, bulk restore, purge, and emit lifecycle events."
---

<script setup>
import PackageVersion from '../../.vitepress/theme/components/PackageVersion.vue'
</script>

# @nestarc/soft-delete

Prisma soft-delete extension for NestJS. Automatically intercepts delete operations, filters deleted records from queries, and supports cascade soft-delete, bulk restore, purge, events, and relation-aware reads.

For the database rules and client boundary behind a production setup, read [Prisma Soft Delete: Why `deletedAt` Alone Is Not Enough](/blog/prisma-soft-delete-done-right).

::: tip Documented release
Documented package version: <PackageVersion slug="soft-delete" />

Version 0.7.5 fixes shared service tokens and context between root and `/testing` imports within
each module format, and adds the production cascade provider to `TestSoftDeleteModule`.
See [testing setup and the 0.7.4 migration boundary](./events#testing).

Version 0.7 adds an opt-in, fail-closed atomic lifecycle bridge for `@nestarc/audit-log`.
Version 0.7.5 accepts the optional audit-log peer range `^0.4.1 || ^0.5.0 || ^0.6.0 || ^0.7.0`.
Audit-log 0.8.0 is excluded. Keep the lifecycle examples on their explicit audit-log 0.7.0 pin;
a newer tuple needs a compatible published companion and passing strict-peer lifecycle checks.
Do not bypass peer validation.
Version 0.7.3 added audit-log 0.6 support, and 0.7.4 adds audit-log 0.7 support; both releases
update compatibility metadata without changing the soft-delete runtime, schema, or atomic
capability handshake. Tenancy `^0.15.0 || ^0.16.0` and Prisma 5, 6, and 7 remain supported;
cascade and relation filters require explicit DMMF metadata.
See the [0.7.5 release source](https://github.com/nestarc/nestjs-soft-delete/blob/v0.7.5/CHANGELOG.md)
and [compatibility guide](./installation#compatibility) before upgrading a composed client.
:::

For a first integration, follow [installation](./installation) and use the extended Prisma client for both deletes and reads. If you also need audit evidence, use the [atomic lifecycle setup](./installation#atomic-audit-lifecycle) with the documented version pairing. Choose [relation filtering](./relation-filters) for nested reads, [cascade and active-row uniqueness](./cascade) for dependent records, or [restore and purge](./restore-purge) for retention workflows.

---

## Features

- Automatic soft-delete: `delete` and `deleteMany` become `update`/`updateMany` setting `deletedAt`
- Transparent query filtering: `findMany`, `findFirst`, `findUnique`, `count`, `aggregate`, `groupBy` all exclude soft-deleted rows by default
- Opt-in relation filtering for to-many Prisma `include` and `select` trees
- Cascade soft-delete and restore across related models
- `restore()`, `restoreMany()`, `forceDelete()`, and `purge()` operations on `SoftDeleteService`
- Route-decorator control: `@WithDeleted()`, `@OnlyDeleted()`, `@SkipSoftDelete()`, `@WithDeletedRelations()`
- Optional actor tracking via `deletedByField` and `actorExtractor`
- [Lifecycle events](./events) (`SoftDeletedEvent`, `RestoredEvent`, `PurgedEvent`) via `@nestjs/event-emitter` for notifications, with listener examples and testing helpers
- Opt-in atomic lifecycle evidence for soft-delete, restore, purge, cascade, and bounded bulk work
  through `@nestarc/audit-log`
- Fail-closed `auditMaxBatchRecords` guard for record-level `deleteMany` and `restoreMany` evidence
- Testing utilities: `TestSoftDeleteModule`, `expectSoftDeleted`, `expectNotSoftDeleted`, `expectCascadeSoftDeleted`
- Standalone Prisma extension (`createPrismaSoftDeleteExtension`) for use without NestJS
- Global module — register once, use everywhere

The [benchmark guide](./benchmark) covers filtered reads, delete operations, and a small cascade
workload. Its read scenarios return different row counts; use the methodology and interpretation
notes to design a comparison for your own data before drawing performance conclusions.

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
npm install @nestarc/soft-delete@0.7.5
# or
yarn add @nestarc/soft-delete@0.7.5
# or
pnpm add @nestarc/soft-delete@0.7.5
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
npm install @nestarc/audit-log@0.7.0

# Optional tenant context for the composed Prisma client
npm install @nestarc/tenancy@^0.16.2
```

Supported peer ranges are NestJS 10/11 and Prisma 5/6/7. The optional audit-log peer range is
`^0.4.1 || ^0.5.0 || ^0.6.0 || ^0.7.0`; audit-log 0.7 requires soft-delete 0.7.4 or later
within the 0.7 line. Tenancy 0.16.2 requires Node.js `^22.23.4 || ^24.22.1`. The pinned audit-log 0.7.0 and historical tenancy 0.16.0–0.16.1 releases declare Node.js 22.13+ within 22.x or Node.js 24.x; apply the [runtime and HTTP parser security updates](/packages/tenancy/migration#upgrade-to-0-16-2) even when retaining those pins. Audit-log 0.7.1 also raises its minimum to `^22.23.4 || ^24.22.1`.
Prisma 7 is the primary development and PostgreSQL E2E target. See the
[installation guide](./installation#compatibility), [atomic lifecycle setup](./installation#atomic-audit-lifecycle),
and [Prisma 7 setup guide](/guide/prisma-7).
