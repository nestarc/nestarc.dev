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

Version **0.7.6** adds audit-log 0.8.0 compatibility while retaining all previous peer ranges.
The current PostgreSQL lifecycle composition uses **tenancy 0.16.4, audit-log 0.8.0, and
soft-delete 0.7.6**. Its public `tenancyTransactionCallback()` binds the authorized tenant
inside audit-log's transaction on a dedicated audit-log → soft-delete client.

The release validates this composition with strict peer installation and packed PostgreSQL
consumers on Node.js 22.23.4 / 24.22.1 and Prisma 6.19.3 / 7.10.1. Coverage includes tenant
isolation under FORCE RLS, restore and permanent deletion, and rollback after user or audit-write failures.
The existing audit-log 0.4.1 / tenancy 0.15.0 development baseline remains in place.
[Release integration fixture](https://github.com/nestarc/nestjs-soft-delete/tree/v0.7.6/test/consumer-audit-lifecycle)

Version 0.7.5 introduced shared service tokens and context between root and `/testing`
imports within each module format, plus the configured cascade provider in
`TestSoftDeleteModule`. These fixes remain available in 0.7.6; see
[testing setup and the 0.7.4 migration boundary](./events#testing).

No soft-delete schema or lifecycle protocol migration is required from 0.7.5. NestJS 10/11,
Prisma 5/6/7, and tenancy `^0.15.0 || ^0.16.0` remain supported. See the
[0.7.6 release source](https://github.com/nestarc/nestjs-soft-delete/blob/v0.7.6/CHANGELOG.md)
and [compatibility guide](./installation#compatibility) before upgrading a composed client.
:::

For a first integration, follow [installation](./installation) and use the extended Prisma client for both deletes and reads. If you also need audit evidence, use the [atomic lifecycle setup](./installation#atomic-audit-lifecycle) with the documented version pairing. Choose [relation filtering](./relation-filters) for nested reads, [cascade and active-row uniqueness](./cascade) for dependent records, or [restore and purge](./restore-purge) for retention workflows.

---

::: info Audit-log 0.9.0 boundary
Soft-delete 0.7.6 does not include audit-log 0.9.0 in its optional peer range. Keep the
verified lifecycle combination on audit-log 0.8.0; do not bypass strict peer validation.
The new [audit-to-Outbox path](/packages/audit-log/atomic-outbox) has a separate scope.
:::

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
npm install @nestarc/soft-delete@0.7.6
# or
yarn add @nestarc/soft-delete@0.7.6
# or
pnpm add @nestarc/soft-delete@0.7.6
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
npm install --save-exact @nestarc/audit-log@0.8.0

# Optional tenant context for the composed Prisma client
npm install --save-exact @nestarc/tenancy@0.16.4
```

Supported peer ranges remain NestJS 10/11 and Prisma 5/6/7. The optional audit-log peer range is
`^0.4.1 || ^0.5.0 || ^0.6.0 || ^0.7.0 || ^0.8.0`; upgrade soft-delete to 0.7.6 before adding
audit-log 0.8.0. Soft-delete alone retains Node.js `^20.19.0 || ^22.12.0 || >=24.0.0`.
The current composition with tenancy 0.16.4 and audit-log 0.8.0 requires
Node.js `^22.23.4 || ^24.22.1`. Prisma 7 is the primary development and PostgreSQL E2E target;
the dedicated latest-composition checks also exercise Prisma 6 consumers. See the
[installation guide](./installation#compatibility), [atomic lifecycle setup](./installation#atomic-audit-lifecycle),
and [Prisma 7 setup guide](/guide/prisma-7).
