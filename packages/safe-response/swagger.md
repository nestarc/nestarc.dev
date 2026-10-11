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

Swagger decorators describe responses; runtime wrapping comes from `SafeResponseModule`. A Swagger `statusCode` option does not set the HTTP status. Use NestJS `@HttpCode()` or a passthrough response API for runtime status changes.

In 0.16.0, the base `data` schema accepts all JSON values, including arrays, primitives, and `null`. Untyped `@SafeResponse()` envelopes may omit `data` for undefined returns. `@ApiSafeResponse(UserDto)` and the pagination decorators still require `data` and enforce their DTO or array constraints. Error `details` no longer receives an accidental object-only schema, so validation arrays are valid.

## Composite Decorators

Combine Swagger documentation, runtime behavior, and error responses into a single decorator.

### `@SafeEndpoint(Model, options?)`

```typescript
@Get()
@SafeEndpoint(UserDto, {
  isArray: true,
  description: 'List users',
  errors: [401, { status: 404, code: 'USER_NOT_FOUND' }],
  message: 'Users fetched',
})
findAll() { ... }
```

Equivalent to stacking `@ApiSafeResponse()` + `@ResponseMessage()` + `@ApiSafeErrorResponses()`.

Options: `statusCode`, `isArray`, `description`, `sort`, `filter`, `message`, `code`, `errors`, `deprecated`, `fieldSelection`, `problemDetails`, `errorFormat`

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

Options: `maxLimit`, `links`, `sort`, `filter`, `description`, `message`, `code`, `errors`, `deprecated`, `fieldSelection`, `problemDetails`, `errorFormat`

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

Options: `maxLimit`, `links`, `sort`, `filter`, `description`, `message`, `code`, `errors`, `deprecated`, `fieldSelection`, `problemDetails`, `errorFormat`

> **`problemDetails` option**: When `true`, error responses use `application/problem+json` schema in Swagger. Must match the module-level `problemDetails` setting — this option only controls Swagger documentation, not runtime behavior.
>
> **`errorFormat` option**: Prefer `errorFormat: 'problem' | 'safe'` for new composite decorator code. It documents the intended error schema and takes priority over `problemDetails` when both are provided.

## Catalog-backed Error Decorators

Use `@ApiSafeCatalogError()` and `@ApiSafeCatalogErrors()` to document errors directly from a `defineErrors()` catalog:

```typescript
import {
  ApiSafeCatalogError,
  ApiSafeCatalogErrors,
  ApiSafeResponse,
  defineErrors,
} from '@nestarc/safe-response';

const errors = defineErrors({
  USER_NOT_FOUND: {
    status: 404,
    message: 'User not found',
    description: 'The requested user does not exist',
  },
  EMAIL_TAKEN: { status: 409, message: 'Email already registered' },
});

@Get(':id')
@ApiSafeResponse(UserDto)
@ApiSafeCatalogError(errors, 'USER_NOT_FOUND')
findOne() { ... }

@Post()
@ApiSafeCatalogErrors(errors, ['USER_NOT_FOUND', 'EMAIL_TAKEN'])
create() { ... }
```

## `@SkipGlobalErrors()`

Excludes a route from `applyGlobalErrors()` global error injection. Useful for routes with custom error schemas.

## `@Exclude()` Integration

### Using with `class-transformer`

`@nestarc/safe-response` works with NestJS's `ClassSerializerInterceptor`. Version 0.16.0 includes Express/Fastify E2E coverage for both module import orders; the older requirement to import `SafeResponseModule` first is no longer the documented limitation. Return class instances and register the serializer in the application:

```typescript
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SafeResponseModule } from '@nestarc/safe-response';

@Module({
  imports: [SafeResponseModule.register()],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
```

## Frontend Client Types

`@nestarc/safe-response/client` provides types and type guards without runtime imports of NestJS, Swagger, or `reflect-metadata`. The npm package still declares server peers, which package managers may install or require even when an application imports only `/client`.

Version 0.16.0 supports legacy TypeScript `moduleResolution: node` for `/client` through `typesVersions`, alongside NodeNext and Bundler resolution. Both public entry points support CJS and ESM imports.

`isSuccess()` and `isError()` accept `SafeAnyResponse<T>` and return false for Problem Details, while preserving the concrete payload type in the success branch. These guards discriminate an already typed response; they are not full validators for arbitrary JSON.

```typescript
import type { SafeAnyResponse } from '@nestarc/safe-response/client';
import {
  isSuccess, isError, isPaginated, isOffsetPagination, isCursorPagination,
  isProblemDetailsResponse, hasResponseTime, hasSort, hasFilters,
  isDeprecated, hasRateLimit, hasFieldSelection,
} from '@nestarc/safe-response/client';

interface User {
  id: number;
  name: string;
}

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

`SafeSuccessResponse<T>` is a conditional type alias in 0.16.0. Use intersections for generic extensions and account for omitted `data` when your payload can be undefined; see the [migration notes](./installation#migrating-from-0-15-0).

Source: [0.16.0 client declarations](https://github.com/nestarc/nestjs-safe-response/blob/v0.16.0/src/client/index.ts) and [HTTP/OpenAPI contract tests](https://github.com/nestarc/nestjs-safe-response/blob/v0.16.0/test/e2e/swagger-response-contract.e2e-spec.ts).
