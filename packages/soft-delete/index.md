# @nestarc/soft-delete

Prisma soft-delete extension for NestJS. Automatically intercepts delete operations, filters deleted records from queries, and supports cascade soft-delete, restore, purge, events, and more.

---

## Features

- Automatic soft-delete: `delete` and `deleteMany` become `update`/`updateMany` setting `deletedAt`
- Transparent query filtering: `findMany`, `findFirst`, `findUnique`, `count`, `aggregate`, `groupBy` all exclude soft-deleted rows by default
- Cascade soft-delete and restore across related models
- `restore()`, `forceDelete()`, and `purge()` operations on `SoftDeleteService`
- Route-decorator control: `@WithDeleted()`, `@OnlyDeleted()`, `@SkipSoftDelete()`
- Optional actor tracking via `deletedByField` and `actorExtractor`
- Lifecycle events (`SoftDeletedEvent`, `RestoredEvent`, `PurgedEvent`) via `@nestjs/event-emitter`
- Testing utilities: `TestSoftDeleteModule`, `expectSoftDeleted`, `expectNotSoftDeleted`, `expectCascadeSoftDeleted`
- Standalone Prisma extension (`createPrismaSoftDeleteExtension`) for use without NestJS
- Global module — register once, use everywhere

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

**Optional peer dependencies:**

```bash
# For lifecycle events
npm install @nestjs/event-emitter

# For scheduled purge jobs
npm install @nestjs/schedule
```
