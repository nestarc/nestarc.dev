---
description: "Auto-generate Swagger documentation for standardized responses using @ApiSafeResponse() decorator."
---

# Swagger

## `@ApiSafeResponse(Model)`

Documents the Swagger `data` field with a specific DTO type.

```typescript
@Get(':id')
@ApiSafeResponse(UserDto)
async findOne(@Param('id') id: string) {
  return this.usersService.findOne(id);
}
```

Options: `isArray`, `statusCode`, `description`

## Composite Decorators

Combine Swagger documentation, runtime behavior, and error responses into a single decorator.

### `@SafeEndpoint(Model, options?)`

```typescript
@Get()
@SafeEndpoint(UserDto, {
  description: 'List users',
  errors: [401, { status: 404, code: 'USER_NOT_FOUND' }],
  message: 'Users fetched',
})
findAll() { ... }
```

Equivalent to stacking `@ApiSafeResponse()` + `@ResponseMessage()` + `@ApiSafeErrorResponses()`.

Options: `statusCode`, `isArray`, `description`, `sort`, `filter`, `message`, `code`, `errors`, `deprecated`, `problemDetails`

### `@SafePaginatedEndpoint(Model, options?)`

```typescript
@Get()
@SafePaginatedEndpoint(UserDto, {
  maxLimit: 100,
  links: true,
  errors: [401],
})
findAll() { ... }
```

Equivalent to `@ApiPaginatedSafeResponse()` + `@Paginated()` + `@ApiSafeErrorResponses()`.

Options: `maxLimit`, `links`, `sort`, `filter`, `description`, `message`, `code`, `errors`, `deprecated`, `problemDetails`

### `@SafeCursorPaginatedEndpoint(Model, options?)`

```typescript
@Get()
@SafeCursorPaginatedEndpoint(UserDto, {
  maxLimit: 50,
  errors: [401],
})
findAll() { ... }
```

Equivalent to `@ApiCursorPaginatedSafeResponse()` + `@CursorPaginated()` + `@ApiSafeErrorResponses()`.

Options: `maxLimit`, `links`, `sort`, `filter`, `description`, `message`, `code`, `errors`, `deprecated`, `problemDetails`

> **`problemDetails` option**: When `true`, error responses use `application/problem+json` schema in Swagger. Must match the module-level `problemDetails` setting — this option only controls Swagger documentation, not runtime behavior.

## `@SkipGlobalErrors()`

Excludes a route from `applyGlobalErrors()` global error injection. Useful for routes with custom error schemas.

## `@Exclude()` Integration

### Using with `class-transformer`

`@nestarc/safe-response` works with NestJS's `ClassSerializerInterceptor` when registered in the correct order. `SafeResponseModule` must be imported **before** `ClassSerializerInterceptor` is registered, so that serialization runs first and response wrapping runs second.

```typescript
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [SafeResponseModule.register()],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
```

## Frontend Client Types

`@nestarc/safe-response/client` provides zero-dependency TypeScript types and type guards for frontend consumers. No NestJS, Swagger, or `reflect-metadata` required.

```typescript
import type { SafeAnyResponse } from '@nestarc/safe-response/client';
import {
  isSuccess, isError, isPaginated, isOffsetPagination, isCursorPagination,
  isProblemDetailsResponse, hasResponseTime, hasSort, hasFilters,
  isDeprecated, hasRateLimit,
} from '@nestarc/safe-response/client';

// SafeAnyResponse includes success, error, and Problem Details responses
const res: SafeAnyResponse<User[]> = await fetch('/api/users').then(r => r.json());

if (isSuccess(res)) {
  console.log(res.data);  // User[]

  if (isPaginated(res.meta) && isOffsetPagination(res.meta.pagination)) {
    console.log(`Page ${res.meta.pagination.page} of ${res.meta.pagination.totalPages}`);
  }
}

if (isError(res)) {
  console.error(res.error.code, res.error.message);
}

// RFC 9457 Problem Details (different shape from standard errors)
if (isProblemDetailsResponse(res)) {
  console.error(res.type, res.detail, res.instance);
}
```
