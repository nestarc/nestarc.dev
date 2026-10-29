---
description: "Choose offset, Prisma cursor, or keyset pagination in NestJS with query parameters, createdAt tie-breakers, indexes, and response examples."
---

# Offset vs Cursor Pagination

For a deeper comparison of consistency, performance, and Prisma implementation choices, read [Cursor vs Offset Pagination in Prisma](/blog/cursor-vs-offset-pagination-prisma).

## Query Parameters

### Offset

```
GET /users?page=2&limit=20&sortBy=createdAt:DESC&search=john&filter.role=$eq:admin
```

| Param | Description | Example |
|-------|-------------|---------|
| `page` | Page number (1-based) | `2` |
| `limit` | Items per page | `20` |
| `sortBy` | Sort (multi allowed) | `createdAt:DESC` |
| `search` | Case-insensitive contains search | `john` |
| `filter.{col}` | Filter by column | `filter.role=$eq:admin` |

### Cursor

```
GET /users?limit=20&after=eyJpZCI6OX0&sortBy=id:ASC
```

| Param | Description | Example |
|-------|-------------|---------|
| `limit` | Items per page | `20` |
| `after` | Forward cursor (Base64url) | `eyJpZCI6OX0` |
| `before` | Backward cursor | `eyJpZCI6MTB9` |
| `sortBy` | Sort | `id:ASC` |

This example uses a unique numeric ID with the Prisma cursor strategy. Cursor mode activates automatically when `after`/`before` is present or `paginationType: 'cursor'` is set. Send only one of `after` or `before`; supplying both is rejected in 0.3.1 and later. Follow response links rather than reusing the illustrative cursor values above.

### Keyset Cursors for Non-Unique Ordering

For a feed sorted by `createdAt`, add a unique `id` tie-breaker and select the keyset strategy:

```typescript
const result = await paginate(query, this.prisma.user, {
  sortableColumns: ['createdAt', 'id'],
  paginationType: 'cursor',
  cursorStrategy: 'keyset',
  cursorColumns: ['createdAt', 'id'],
  defaultSortBy: [['createdAt', 'DESC'], ['id', 'DESC']],
});
```

Use a matching index such as `@@index([createdAt(sort: Desc), id(sort: Desc)])`. Keep cursor columns populated and stable, preserve the sort and filters, and follow `result.links.next` instead of constructing a cursor manually. The unique tie-breaker distinguishes records with equal timestamps; it does not create a snapshot across requests. See the [worked SQL example and consistency limits](/blog/cursor-vs-offset-pagination-prisma#keyset-pagination-with-createdat-and-id).

Use non-null scalar sort columns: this keyset strategy does not support traversal across null sort values. Every `cursorColumns` entry must also be allowed in `sortableColumns`; missing cursor columns are appended to the requested sort order using its last direction.

Default cursors contain Base64url-encoded JSON with every effective sort value. If `select` omits a cursor field, the package fetches it internally and removes it from returned `data`, but the value remains in the cursor. Only allow sorting on fields that may be exposed to the client; field selection does not conceal cursor values.

Keyset cursors store the effective sort values, so they can continue after the boundary record is deleted. Prisma's record cursor needs that record to locate its boundary. Changes to sort values or filters can still cause skips or repeats with either strategy. The 0.3.1 fixes, included in 0.3.2, restore the immediately preceding keyset page for `before` and preserve all effective sort fields in newly generated cursors. Restart a traversal when a cursor from an older version lacks a required sort field.

## Response Format

### Offset

With the default exact count, totals and a last-page link are available:

```json
{
  "data": [{ "id": 1, "name": "Alice" }],
  "meta": {
    "itemsPerPage": 20,
    "totalItems": 500,
    "currentPage": 1,
    "totalPages": 25,
    "sortBy": [["createdAt", "DESC"]]
  },
  "links": {
    "first": "/users?page=1&limit=20&sortBy=createdAt%3ADESC",
    "previous": null,
    "current": "/users?page=1&limit=20&sortBy=createdAt%3ADESC",
    "next": "/users?page=2&limit=20&sortBy=createdAt%3ADESC",
    "last": "/users?page=25&limit=20&sortBy=createdAt%3ADESC"
  }
}
```

With `countStrategy: 'none'` in 0.3.2, `totalItems` and `totalPages` are omitted. The query reads at most one extra matching row to determine `links.next`, but returns at most the requested limit. `links.last` is always `null`, including on the final or an empty page. Follow `links.next` until it is `null`, and guard against `null` when rendering a last-page control. No count query runs in this mode.

### Cursor

This example shows the first record of a 20-record page spanning IDs 10–29; the `data` array is shortened.

```json
{
  "data": [{ "id": 10, "name": "Bob" }],
  "meta": {
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPreviousPage": true,
    "startCursor": "eyJpZCI6MTB9",
    "endCursor": "eyJpZCI6Mjl9",
    "sortBy": [["id", "ASC"]]
  },
  "links": {
    "current": "/users?limit=20&after=eyJpZCI6OX0&sortBy=id%3AASC",
    "next": "/users?limit=20&after=eyJpZCI6Mjl9&sortBy=id%3AASC",
    "previous": "/users?limit=20&before=eyJpZCI6MTB9&sortBy=id%3AASC"
  }
}
```

Cursor mode omits totals by default. An explicit `countStrategy: 'exact'` or `'custom'` counts the full filtered result set; it does not count only rows remaining after a keyset boundary. Calls through `PaginateService` honor module-level `withTotalCount`, while standalone `paginate()` needs its configuration passed explicitly.
