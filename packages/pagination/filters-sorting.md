---
description: "12 filter operators (eq, contains, gte, in, etc.) and multi-column sorting in @nestarc/pagination."
---

# Filters & Sorting

## Filter Operators

| Operator | Prisma | Example |
|----------|--------|---------|
| `$eq` | `{ equals }` | `filter.role=$eq:admin` |
| `$ne` | `{ not }` | `filter.status=$ne:deleted` |
| `$gt` | `{ gt }` | `filter.age=$gt:18` |
| `$gte` | `{ gte }` | `filter.age=$gte:18` |
| `$lt` | `{ lt }` | `filter.price=$lt:100` |
| `$lte` | `{ lte }` | `filter.price=$lte:100` |
| `$in` | `{ in }` | `filter.role=$in:admin,user` |
| `$nin` | `{ notIn }` | `filter.role=$nin:banned` |
| `$ilike` | `{ contains, mode: 'insensitive' }` | `filter.name=$ilike:john` |
| `$btw` | `{ gte, lte }` | `filter.price=$btw:10,100` |
| `$null` | `null` | `filter.deletedAt=$null` |
| `$not:null` | `{ not: null }` | `filter.verifiedAt=$not:null` |

## Multi-column Sorting

```
GET /users?sortBy=createdAt:DESC&sortBy=name:ASC
```

## Case-insensitive Contains Search

```
GET /users?search=john
```

Builds an `OR` of Prisma `contains` filters with `mode: 'insensitive'` across the columns in `searchableColumns`. This is substring matching; it does not use PostgreSQL full-text indexes or relevance ranking:

```typescript
{
  searchableColumns: ['name', 'email'],
}
```

## Column/Operator Whitelisting

When `filterableColumns` is configured, only its listed columns and operators are accepted:

```typescript
{
  filterableColumns: {
    role: ['$eq', '$in'],
    age: ['$gt', '$gte', '$lt', '$lte'],
    createdAt: ['$gte', '$lte', '$btw'],
  },
}
```

If `filterableColumns` is omitted, incoming filters are ignored. Set `filterableColumns: {}` to reject every supplied filter, or provide an explicit allowlist as above. Likewise, `search` has no effect when `searchableColumns` is omitted or empty. Keep authorization and tenant constraints in application-controlled `where` conditions or the database isolation layer.

## Error Handling

| Error | Status | When |
|-------|--------|------|
| `InvalidSortColumnError` | 400 | Sort column not in `sortableColumns` |
| `InvalidFilterColumnError` | 400 | With `filterableColumns` configured, a filter column or operator is not allowed |
| `InvalidCursorError` | 400 | Invalid Base64url cursor |

Unknown sort columns throw errors. Unknown filter columns throw only when `filterableColumns` is configured; omitting the configuration disables filter processing.
