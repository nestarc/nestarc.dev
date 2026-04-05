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
