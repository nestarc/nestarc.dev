---
description: "Add cursor and offset pagination to NestJS API endpoints in 10 minutes with @nestarc/pagination — filters, sorting, and Swagger docs included."
---

# Quick Start: pagination

Add production-ready pagination to your NestJS + Prisma API endpoints with filtering, sorting, and Swagger documentation.

If you have not chosen a pagination strategy yet, compare the trade-offs in [Cursor vs Offset Pagination in Prisma](/blog/cursor-vs-offset-pagination-prisma).

## What You Get

```bash
# Offset pagination with filters and sorting
GET /users?page=2&limit=10&sortBy=name:ASC&filter.role=$eq:admin

# Cursor pagination for infinite scroll
GET /users/feed?limit=20
# Continue with the returned links.next URL, which contains a real cursor.
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "meta": {
    "itemsPerPage": 10,
    "totalItems": 142,
    "currentPage": 2,
    "totalPages": 15,
    "sortBy": [["name", "ASC"]]
  },
  "links": {
    "first": "/users?page=1&limit=10",
    "previous": "/users?page=1&limit=10",
    "current": "/users?page=2&limit=10",
    "next": "/users?page=3&limit=10",
    "last": "/users?page=15&limit=10"
  }
}
```

## Step 1: Install

```bash
npm install @nestarc/pagination
```

## Step 2: Register the Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { PaginationModule } from '@nestarc/pagination';

@Module({
  imports: [
    PaginationModule.forRoot({
      defaultLimit: 20,
      maxLimit: 100,
    }),
  ],
})
export class AppModule {}
```

## Step 3: Add to a Controller

```typescript
// users/users.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Paginate, PaginateQuery, PaginateService } from '@nestarc/pagination';
import { PrismaService } from '../prisma.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginateService: PaginateService,
  ) {}

  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.paginateService.paginate(
      query,
      this.prisma.user,
      {
        sortableColumns: ['id', 'name', 'email', 'createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
        searchableColumns: ['name', 'email'],
        filterableColumns: {
          role: ['$eq', '$in'],
          createdAt: ['$gte', '$lte'],
        },
      },
    );
  }

  @Get('feed')
  findFeed(@Paginate() query: PaginateQuery) {
    return this.paginateService.paginate(query, this.prisma.user, {
      paginationType: 'cursor',
      sortableColumns: ['id'],
      defaultSortBy: [['id', 'ASC']],
    });
  }
}
```

The feed uses cursor mode from its first request, even without `after` or `before`. Follow `links.next` from that response; the package encodes the cursor, so a raw record ID or invented string is not valid. For timestamp-sorted feeds, use the [keyset strategy](/packages/pagination/offset-vs-cursor#keyset-cursors-for-non-unique-ordering).

## Step 4: Test It

```bash
# Basic pagination
curl "http://localhost:3000/users?page=1&limit=5"

# With sorting
curl "http://localhost:3000/users?sortBy=name:ASC"

# With filtering
curl "http://localhost:3000/users?filter.role=\$eq:admin"

# With search
curl "http://localhost:3000/users?search=alice"

# Cursor-based (for infinite scroll)
curl "http://localhost:3000/users/feed?limit=20"
# Request the returned links.next URL to fetch the next page.
```

## Available Filter Operators

| Operator | Prisma Equivalent | Example |
|----------|-------------------|---------|
| `$eq` | `equals` | `filter.role=$eq:admin` |
| `$not` | `not` | `filter.role=$not:admin` |
| `$gt` | `gt` | `filter.age=$gt:18` |
| `$gte` | `gte` | `filter.age=$gte:18` |
| `$lt` | `lt` | `filter.age=$lt:65` |
| `$lte` | `lte` | `filter.age=$lte:65` |
| `$in` | `in` | `filter.role=$in:admin,editor` |
| `$nin` | `notIn` | `filter.role=$nin:guest` |
| `$contains` | `contains` | `filter.name=$contains:ali` |
| `$startsWith` | `startsWith` | `filter.name=$startsWith:a` |
| `$endsWith` | `endsWith` | `filter.email=$endsWith:.com` |
| `$btw` | `gte` + `lte` | `filter.age=$btw:18,65` |

::: warning Security
With `filterableColumns` configured, only listed columns and operators are accepted; disallowed filters throw a 400 error. Omitting the option ignores request filters, while `{}` rejects every requested filter. This allowlist does not authorize rows: enforce tenant and access predicates in the server-controlled `where` option.
:::

## Next Steps

- [Offset vs Cursor Pagination](/packages/pagination/offset-vs-cursor) — when to use which
- [Filters & Sorting](/packages/pagination/filters-sorting) — advanced filter patterns
- [Swagger Integration](/packages/pagination/swagger) — auto-document paginated endpoints
- [Adoption Roadmap](/guide/adoption-roadmap) — what to add next
