---
description: "Controller decorators for @nestarc/soft-delete — control root filter modes and relation-specific deleted-row inclusion."
---

# Decorators

Apply to controller route handlers to change the filter mode for that request.

## `@WithDeleted()`

Include soft-deleted records alongside active ones.

```typescript
@Get('trash-and-active')
@WithDeleted()
findAll() {
  return this.prisma.client.post.findMany();
}
```

## `@OnlyDeleted()`

Return only soft-deleted records.

```typescript
@Get('trash')
@OnlyDeleted()
findTrashed() {
  return this.prisma.client.post.findMany();
}
```

## `@SkipSoftDelete()`

Bypass soft-delete logic entirely — `delete` performs a real hard-delete.

```typescript
@Delete(':id/hard')
@SkipSoftDelete()
hardDelete(@Param('id') id: string) {
  return this.prisma.client.post.delete({ where: { id: +id } });
}
```

## `@WithDeletedRelations(...paths)`

When v0.5 relation filtering is enabled, include deleted rows for selected to-many relation paths without disabling the root record filter:

```typescript
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

Paths are exact. `@WithDeletedRelations('posts')` includes deleted posts but does not automatically include deleted `posts.comments`. The decorator affects relation paths only when `relationFilters` is enabled on the Prisma extension.

::: warning
Treat relation exceptions as data-access permissions. Do not expose deleted child records merely to simplify an internal query.
:::

See [Relation Filters](./relation-filters) for configuration, supported relation shapes, and filter-mode behavior.
