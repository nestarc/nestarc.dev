---
description: "Compare offset vs cursor pagination in @nestarc/pagination — query parameters, trade-offs, and when to use each."
---

# Offset vs Cursor Pagination

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
| `search` | Full-text search | `john` |
| `filter.{col}` | Filter by column | `filter.role=$eq:admin` |

### Cursor

```
GET /users?limit=20&after=eyJpZCI6IjEwIn0&sortBy=createdAt:DESC
```

| Param | Description | Example |
|-------|-------------|---------|
| `limit` | Items per page | `20` |
| `after` | Forward cursor (Base64url) | `eyJpZCI6IjEwIn0` |
| `before` | Backward cursor | `eyJpZCI6NX0` |
| `sortBy` | Sort | `createdAt:DESC` |

Cursor mode activates automatically when `after`/`before` is present or `paginationType: 'cursor'` is set.

## Response Format

### Offset

```json
{
  "data": [{ "id": "1", "name": "Alice" }],
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

### Cursor

```json
{
  "data": [{ "id": "10", "name": "Bob" }],
  "meta": {
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPreviousPage": true,
    "startCursor": "eyJpZCI6IjEwIn0",
    "endCursor": "eyJpZCI6IjI5In0",
    "sortBy": [["createdAt", "DESC"]]
  },
  "links": {
    "current": "/users?limit=20&after=eyJpZCI6IjEwIn0",
    "next": "/users?limit=20&after=eyJpZCI6IjI5In0",
    "previous": "/users?limit=20&before=eyJpZCI6IjEwIn0"
  }
}
```
