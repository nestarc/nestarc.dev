---
title: "Prisma Soft Delete: Why deletedAt Alone Is Not Enough"
date: 2026-04-06
description: "Implement Prisma soft delete correctly with an extended client, PostgreSQL active-row uniqueness, cascade metadata, restore, and purge."
author: nestarc
reviewed: 2026-08-19
versionScope: "@nestarc/soft-delete 0.6.x, NestJS 10/11, Prisma 5/6/7, and PostgreSQL"
---

# Prisma Soft Delete: Why deletedAt Alone Is Not Enough

Adding a `deletedAt` column is only the first step. A production implementation must also define active-row uniqueness, keep deleted rows out of reads, route application queries through the extended Prisma client, and make cascade, restore, and retention behavior explicit.

This guide uses `@nestarc/soft-delete` to build that boundary without hiding the database rules it depends on.

## Problem 1: A Normal Unique Constraint Blocks Reuse

With a global unique constraint, a deleted row still owns its email address:

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  deletedAt DateTime?
}
```

Removing `@unique` and adding `@@unique([email, deletedAt])` is **not** a safe fix. PostgreSQL treats `NULL` values as distinct, so multiple active rows with the same email and `deletedAt = NULL` can satisfy that composite constraint.

For PostgreSQL, keep the fields in the Prisma model and create a partial unique index in a reviewed migration:

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String
  deletedAt DateTime?
}
```

```sql
CREATE UNIQUE INDEX users_email_active_unique
  ON "User" ("email")
  WHERE "deletedAt" IS NULL;
```

This enforces exactly the desired rule: one active row may own an email, while an email from a soft-deleted row can be reused. Remove the previous global unique constraint before adding the partial index, and check existing active rows for duplicates first.

SQLite also supports a partial unique index. MySQL requires a functional or generated-column strategy instead. See [Cascade & Active-Row Uniqueness](/packages/soft-delete/cascade#active-row-unique-constraints) for database-specific DDL.

## Problem 2: The Base Client Bypasses Soft Delete

Manual `deletedAt: null` filters are easy to miss. The package solves that with a Prisma Client Extension, but only queries made through the **extended** client are intercepted.

For Prisma 7, generate the client to an explicit output path and construct the runtime client with a driver adapter:

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly extended: ReturnType<typeof this.$extends>;

  constructor() {
    super({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL!,
      }),
    });

    this.extended = this.$extends(
      createPrismaSoftDeleteExtension({
        softDeleteModels: ['User', 'Post', 'Comment'],
        deletedAtField: 'deletedAt',
      }),
    );
  }

  get client() {
    return this.extended;
  }

  async onModuleInit() {
    await this.$connect();
  }
}
```

Register the Nest module against the same service:

```typescript
SoftDeleteModule.forRoot({
  softDeleteModels: ['User', 'Post', 'Comment'],
  deletedAtField: 'deletedAt',
  prismaServiceToken: PrismaService,
});
```

Application code must use `prisma.client`:

```typescript
// Soft delete: the extension rewrites delete() to an update.
await prisma.client.user.delete({ where: { id: userId } });

// Active-only read: the extension adds the deletedAt filter.
const users = await prisma.client.user.findMany();
```

Direct calls such as `prisma.user.delete()` use the base client and remain hard deletes. Likewise, `prisma.user.findMany()` does not receive the automatic active-row filter. Keep the base client out of normal application repositories and services.

When an authorized recovery endpoint needs a different read mode, decorators change the request-scoped behavior of the extended client:

```typescript
@OnlyDeleted()
@Get('trash')
listDeletedUsers() {
  return this.prisma.client.user.findMany();
}

@WithDeleted()
@Get('all')
listAllUsers() {
  return this.prisma.client.user.findMany();
}
```

## Problem 3: Cascade Needs Schema Metadata

If deleting a `User` should also soft-delete related `Post` and `Comment` rows, configure cascade on both the Prisma extension and the Nest module. In 0.6.x, cascade relation lookup requires full Prisma DMMF metadata on Prisma 5, 6, and 7.

Pin `@prisma/internals` to the exact version of `prisma`, load the schema metadata in application-owned setup code, and reuse the same values:

```typescript
// prisma.dmmf.ts
import { readFileSync } from 'node:fs';
import { getDMMF } from '@prisma/internals';

const datamodel = readFileSync('prisma/schema.prisma', 'utf8');

export const prismaDmmf = await getDMMF({ datamodel });
export const softDeleteCascade = {
  User: ['Post'],
  Post: ['Comment'],
};
```

```typescript
// In PrismaService
this.extended = this.$extends(
  createPrismaSoftDeleteExtension({
    softDeleteModels: ['User', 'Post', 'Comment'],
    cascade: softDeleteCascade,
    maxCascadeDepth: 3,
    dmmf: prismaDmmf,
  }),
);
```

```typescript
// In AppModule
SoftDeleteModule.forRoot({
  softDeleteModels: ['User', 'Post', 'Comment'],
  cascade: softDeleteCascade,
  maxCascadeDepth: 3,
  dmmf: prismaDmmf,
  prismaServiceToken: PrismaService,
});
```

The package fails early with `CascadeDmmfMissingError` when cascade is configured without metadata. Keep `@prisma/internals` version-pinned because it does not provide a semantic-versioning guarantee, and cover metadata loading with a startup or integration test.

## Restore Through `SoftDeleteService`

`restore()` clears the deletion fields and restores timestamp-matched descendants when cascade is configured:

```typescript
@Post(':id/restore')
restore(@Param('id') id: string) {
  return this.softDelete.restore('User', { id: +id });
}
```

For a bounded bulk restore, use `restoreMany()`:

```typescript
const result = await this.softDelete.restoreMany('User', {
  where: { organizationId, role: 'GUEST' },
});
```

Restoring an active value can conflict with the partial unique index if another active row has claimed it. Treat restore as an authorized workflow and handle that conflict explicitly.

## Purge Only Rows Older Than the Retention Cutoff

`purge()` permanently deletes soft-deleted rows. Its current argument shape requires `olderThan`; an optional `where` can narrow the operation further:

```typescript
const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

const result = await this.softDelete.purge('User', {
  olderThan: cutoff,
  where: { organizationId },
});

console.log(`Purged ${result.count} users`);
```

Run purge from a restricted administrative or scheduled workflow, bound optional filters carefully, and test cascade and retention behavior on production-like data before enabling it.

## Implementation Checklist

- Use a database-specific active-row unique index; do not use `@@unique([email, deletedAt])`.
- Send all normal application reads and writes through the extended client.
- Keep base-client hard deletes limited to deliberate administrative paths.
- Pass the same explicit DMMF and cascade map to the extension and Nest module.
- Test delete filtering, cascade, restore conflicts, and retention-based purge.

## Next Steps

- [Installation](/packages/soft-delete/installation) — complete Prisma 7 and module setup
- [Cascade & Active-Row Uniqueness](/packages/soft-delete/cascade) — metadata and database-specific indexes
- [Restore, Force Delete & Purge](/packages/soft-delete/restore-purge) — current recovery and deletion APIs
- [Decorators](/packages/soft-delete/decorators) — request-scoped query modes
- [PostgreSQL partial indexes](https://www.postgresql.org/docs/current/indexes-partial.html) — authoritative active-row uniqueness building block
- [Prisma Client extensions](https://www.prisma.io/docs/orm/prisma-client/client-extensions) — official extension model
