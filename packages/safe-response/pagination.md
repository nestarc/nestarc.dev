---
description: "Add offset and cursor pagination metadata to API responses, parse query limits, and preserve filters in navigation links."
---

# Pagination

## `@Paginated(options?)`

Enables offset pagination metadata auto-calculation. Options: `maxLimit`, `links`.

The handler supplies numeric pagination values and queries the data source. `maxLimit` clamps response metadata only; it does not limit the database query or truncate returned arrays. Parse query strings, reject non-positive values, and cap the limit before querying. The same rules apply to cursor pagination.

```typescript
@Get()
@Paginated({ maxLimit: 100, links: true })  // HATEOAS navigation links
findAll() { ... }
```

## `@ApiPaginatedSafeResponse(Model)`

Generates paginated Swagger schema with `meta.pagination`.

```typescript
import { BadRequestException, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';

@Get()
@Paginated({ maxLimit: 100 })
@ApiPaginatedSafeResponse(UserDto)
async findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(20), ParseIntPipe) requestedLimit: number,
) {
  if (page < 1 || requestedLimit < 1) {
    throw new BadRequestException('page and limit must be positive');
  }
  const limit = Math.min(requestedLimit, 100);
  const [items, total] = await this.usersService.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  });
  return { data: items, total, page, limit };
}
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "data": [{ "id": 1 }, { "id": 2 }],
  "meta": {
    "pagination": {
      "type": "offset",
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## `@CursorPaginated(options?)`

Enables cursor-based pagination metadata auto-calculation. Options: `maxLimit`, `links`.

## `@ApiCursorPaginatedSafeResponse(Model)`

Generates cursor-paginated Swagger schema with `meta.pagination`.

```typescript
import { BadRequestException, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';

@Get()
@CursorPaginated({ maxLimit: 100 })
@ApiCursorPaginatedSafeResponse(UserDto)
async findAll(
  @Query('cursor') cursor: string | undefined,
  @Query('limit', new DefaultValuePipe(20), ParseIntPipe) requestedLimit: number,
) {
  if (requestedLimit < 1) throw new BadRequestException('limit must be positive');
  const limit = Math.min(requestedLimit, 100);
  const { items, nextCursor, hasMore, totalCount } =
    await this.usersService.findWithCursor({ cursor, limit });
  return { data: items, nextCursor, hasMore, limit, totalCount };
}
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "data": [{ "id": 1 }, { "id": 2 }],
  "meta": {
    "pagination": {
      "type": "cursor",
      "nextCursor": "eyJpZCI6MTAwfQ==",
      "previousCursor": null,
      "hasMore": true,
      "limit": 20,
      "totalCount": 150
    }
  }
}
```

The handler must return a `CursorPaginatedResult<T>`:

```typescript
interface CursorPaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
  previousCursor?: string | null;  // defaults to null
  hasMore: boolean;
  limit: number;
  totalCount?: number;             // optional
}
```

## `@SortMeta()` / `@FilterMeta()`

Include sorting and filtering metadata in the response. The handler must return `sort` and/or `filters` fields alongside the data.

```typescript
@Get()
@Paginated()
@SortMeta()
@FilterMeta()
@ApiPaginatedSafeResponse(UserDto)
async findAll(
  @Query('sortBy') sortBy = 'createdAt',
  @Query('order') order: 'asc' | 'desc' = 'desc',
  @Query('status') status?: string,
) {
  const [items, total] = await this.usersService.findAndCount({ sortBy, order, status });
  return {
    data: items, total, page: 1, limit: 20,
    sort: { field: sortBy, order },
    filters: { ...(status && { status }) },
  };
}
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "data": [{ "id": 1, "name": "John" }],
  "meta": {
    "pagination": { "type": "offset", "page": 1, "limit": 20, "total": 100, "totalPages": 5, "hasNext": true, "hasPrev": false },
    "sort": { "field": "createdAt", "order": "desc" },
    "filters": { "status": "active" }
  }
}
```

## HATEOAS Links

When `links: true`, the response includes navigation links in `meta.pagination.links`:

```json
{
  "meta": {
    "pagination": {
      "type": "offset",
      "page": 2, "limit": 20, "total": 100, "totalPages": 5,
      "links": {
        "self": "/api/users?page=2&limit=20",
        "first": "/api/users?page=1&limit=20",
        "prev": "/api/users?page=1&limit=20",
        "next": "/api/users?page=3&limit=20",
        "last": "/api/users?page=5&limit=20"
      }
    }
  }
}
```

Links use relative paths. In 0.16.0, every cursor navigation link preserves repeated filters such as `?status=active&status=pending`. Only cursor and limit values change; `first` removes the cursor, and `self` uses the normalized limit. This avoids losing filter values when navigating a cursor-paginated result.

Source: [0.16.0 pagination documentation](https://github.com/nestarc/nestjs-safe-response/blob/v0.16.0/README.md) and [cursor link implementation](https://github.com/nestarc/nestjs-safe-response/blob/v0.16.0/src/interceptors/safe-response.interceptor.ts).
