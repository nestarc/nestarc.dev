---
title: "Cursor vs Offset Pagination in Prisma: When Each Wins"
date: 2026-04-09
description: Practical comparison of cursor and offset pagination in Prisma with NestJS — benchmarks, SQL analysis, and a Prisma cursor caveat most tutorials don't mention.
author: nestarc
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
| Offset — page 1 | 0.99ms |
| Offset — page 100 | 0.98ms |
| Cursor — first page (sort by id) | 0.53ms |
| Cursor — deep page (sort by id) | **0.67ms** |
| Cursor — deep page (sort by createdAt) | **17.56ms** |

Two surprises:
1. **Offset shows no degradation at 10K rows** — PostgreSQL handles `SKIP 990` efficiently at this scale
2. **Cursor + non-PK sort is 26x slower** — this is a Prisma-specific issue

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

The key insight: **cursor pagination only outperforms offset when sorting by the cursor column (usually the PK)**. For other sort orders, offset is simpler and equally fast at reasonable data volumes.

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
