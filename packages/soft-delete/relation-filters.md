---
description: "Filter soft-deleted children from Prisma include and select trees with @nestarc/soft-delete v0.5 relation filters."
---

# Relation Filters

Top-level soft-delete filtering does not automatically change nested Prisma relations. Version 0.5 adds an opt-in traversal that injects the current soft-delete mode into to-many `include` and `select` trees.

## Enable Relation Filtering

Configure the Prisma extension that handles application queries:

```typescript
import { Prisma, PrismaClient } from '@prisma/client';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';

const prisma = new PrismaClient().$extends(
  createPrismaSoftDeleteExtension({
    softDeleteModels: ['User', 'Post', 'Comment'],
    relationFilters: {
      enabled: true,
      maxDepth: 3,
    },
    dmmf: Prisma.dmmf,
  }),
);
```

`relationFilters: true` is shorthand for enabling the feature with the default maximum depth of 3. DMMF metadata is required to distinguish to-many relations and resolve their target models. When `Prisma.dmmf` is unavailable, pass compatible DMMF explicitly; otherwise setup throws `RelationDmmfMissingError`.

::: tip
The published peer range covers Prisma 5 and 6. Treat other Prisma versions as an explicit-DMMF path until they are included in the compatibility matrix.
:::

## Query Rewriting

With the default filter mode, this application query:

```typescript
await prisma.user.findMany({
  include: {
    posts: {
      include: { comments: true },
    },
  },
});
```

is sent to Prisma with active-only filters on configured to-many soft-delete models:

```typescript
{
  where: { deletedAt: null },
  include: {
    posts: {
      where: { deletedAt: null },
      include: {
        comments: { where: { deletedAt: null } },
      },
    },
  },
}
```

Existing relation `where` clauses are retained, while the context-controlled `deletedAt` predicate is enforced.

## Filter Modes

| Context | Root records | To-many relations |
|---|---|---|
| Default | Active only | Active only |
| `@OnlyDeleted()` / `onlyDeleted()` | Deleted only | Deleted only |
| `@WithDeleted()` / `withDeleted()` | Active and deleted | Active and deleted |
| `@SkipSoftDelete()` | No rewrite | No rewrite |

## Include Deleted Rows for Selected Relations

`@WithDeletedRelations()` keeps normal root filtering but exempts exact relation paths:

```typescript
import { Get, Param } from '@nestjs/common';
import { WithDeletedRelations } from '@nestarc/soft-delete';

@Get(':id')
@WithDeletedRelations('posts', 'posts.comments')
findOne(@Param('id') id: string) {
  return this.prisma.client.user.findUnique({
    where: { id: +id },
    include: {
      posts: {
        include: { comments: true },
      },
    },
  });
}
```

Paths are exact dot paths from the query's root model. Exempting `posts` does not automatically exempt `posts.comments`; list both when both levels should include deleted rows.

## Supported Scope

Version 0.5 supports:

- to-many relation trees under `include` and `select`
- nested traversal up to `maxDepth`
- default, only-deleted, with-deleted, and skipped contexts
- exact route-level relation-path exemptions

It does not filter to-one relations because Prisma does not accept the same nested `where` shape there. Nested writes are also outside the relation-filter feature.

## Adoption Checklist

1. Inventory queries that currently return deleted children and treat the new filtering as an intentional response-shape change.
2. Enable the feature in a test environment and exercise nested `include` and `select` queries.
3. Add `@WithDeletedRelations()` only to routes that are authorized to expose deleted child records.
4. Keep `maxDepth` bounded and measure complex nested queries against production-like data.
5. Verify DMMF availability during application startup.

See [Decorators](./decorators) for the other request-level modes and [v0.5 Changes & Fixes](./release-0.5) for upgrade guidance.
