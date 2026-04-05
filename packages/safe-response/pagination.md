# Pagination

## `@Paginated(options?)`

Enables offset pagination metadata auto-calculation. Options: `maxLimit`, `links`.

```typescript
@Get()
@Paginated({ maxLimit: 100, links: true })  // HATEOAS navigation links
findAll() { ... }
```

## `@ApiPaginatedSafeResponse(Model)`

Generates paginated Swagger schema with `meta.pagination`.

```typescript
@Get()
@Paginated({ maxLimit: 100 })
@ApiPaginatedSafeResponse(UserDto)
async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
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
@Get()
@CursorPaginated()
@ApiCursorPaginatedSafeResponse(UserDto)
async findAll(@Query('cursor') cursor?: string, @Query('limit') limit = 20) {
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
  "data": [...],
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
