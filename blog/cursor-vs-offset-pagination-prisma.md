---
title: "Cursor vs Offset Pagination in Prisma: When Each Wins"
date: 2026-04-09
description: Practical comparison of cursor and offset pagination in Prisma with NestJS — benchmarks, SQL analysis, and a Prisma cursor caveat most tutorials don't mention.
author: nestarc
reviewed: 2026-08-19
versionScope: "@nestarc/pagination 0.3.x, NestJS 10/11, Prisma 5/6/7, and PostgreSQL 16"
---

# Cursor vs Offset Pagination in Prisma: When Each Wins

Every pagination tutorial says "cursor is better than offset for large datasets." That's true — but the full picture is more nuanced, especially with Prisma.

## The Conventional Wisdom

**Offset** (`SKIP 990, LIMIT 10`): PostgreSQL scans and discards 990 rows before returning 10. Gets slower as pages get deeper.

**Cursor** (`WHERE id > 'abc', LIMIT 10`): PostgreSQL uses an index to jump directly to the right position. Constant performance at any depth.

Simple, right? Not always.

## What We Measured

We benchmarked both modes with 10,000 rows in PostgreSQL 16:

| Scenario | Avg |
|----------|-----|
| Offset — page 1 | 1.04ms |
| Offset — page 100 | 2.61ms |
| Cursor — first page (sort by id) | 0.56ms |
| Cursor — deep page (sort by id) | **0.58ms** |
| Cursor — deep page (sort by createdAt) | **11.05ms** |

Two surprises:
1. **Offset degradation is already measurable at 10K rows** — page 100 was about 2.5x slower than page 1 in this run
2. **Cursor + non-PK sort remains costly** — the deep `createdAt` case was about 19x slower than the deep ID cursor

## The Prisma Cursor Caveat

When you use cursor pagination with `orderBy: { id: 'asc' }`, Prisma generates:

```sql
SELECT * FROM products
WHERE id > $cursor
ORDER BY id ASC
LIMIT 11
```

Fast — direct index range scan.

But with `orderBy: { createdAt: 'desc' }`, Prisma generates:

```sql
SELECT * FROM products
WHERE created_at <= (
  SELECT created_at FROM products WHERE id = $cursor
)
ORDER BY created_at DESC
OFFSET 1
```

A subquery with no `LIMIT`. This scans every row after the cursor position.

## When to Use Which

| Scenario | Best choice | Why |
|----------|-------------|-----|
| UI with page numbers | **Offset** | Users expect "Page 1, 2, 3..." |
| Infinite scroll | **Cursor** (by PK) | No page jumps needed |
| Large datasets (100K+) | **Cursor** (by PK) | Offset degrades linearly |
| Admin dashboards | **Offset** | Need "jump to page 50" |
| Non-PK sort (createdAt, name) | **Offset** | Avoids Prisma subquery issue |
| Mobile apps (Load More) | **Cursor** (by PK) | Clean forward-only navigation |

The key insight: **cursor pagination performs best when sorting by the cursor column (usually the PK)**. In this benchmark, the deep ID cursor was about 78% faster than deep offset. For other sort orders, measure the generated query and indexes before choosing: the tested `createdAt` cursor was substantially slower.

## Using @nestarc/pagination

[`@nestarc/pagination`](https://nestarc.dev/packages/pagination/) supports both modes in a single API:

```typescript
// Auto-detects mode: offset by default, cursor when ?after= is present
@Get()
async findAll(@Paginate() query: PaginateQuery) {
  return paginate(query, this.prisma.user, {
    sortableColumns: ['id', 'name', 'createdAt'],
    filterableColumns: { role: ['$eq', '$in'] },
    searchableColumns: ['name', 'email'],
  });
}
```

12 filter operators, multi-column sorting, full-text search, and Swagger auto-documentation included.

[Documentation](https://nestarc.dev/packages/pagination/) · [GitHub](https://github.com/nestarc/nestjs-pagination) · [Benchmark](https://nestarc.dev/packages/pagination/benchmark)
