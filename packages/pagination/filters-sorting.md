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

## Full-text Search

```
GET /users?search=john
```

Searches across columns defined in `searchableColumns`:

```typescript
{
  searchableColumns: ['name', 'email'],
}
```

## Column/Operator Whitelisting

For security, only columns and operators explicitly listed in `filterableColumns` are allowed:

```typescript
{
  filterableColumns: {
    role: ['$eq', '$in'],
    age: ['$gt', '$gte', '$lt', '$lte'],
    createdAt: ['$gte', '$lte', '$btw'],
  },
}
```

## Error Handling

| Error | Status | When |
|-------|--------|------|
| `InvalidSortColumnError` | 400 | Sort column not in `sortableColumns` |
| `InvalidFilterColumnError` | 400 | Filter column not in `filterableColumns` or operator not allowed |
| `InvalidCursorError` | 400 | Invalid Base64url cursor |

Unknown sort/filter columns throw errors (not silently ignored) to prevent clients from trusting incorrect results.
