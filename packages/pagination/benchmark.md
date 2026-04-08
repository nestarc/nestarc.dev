---
description: "Performance benchmarks for @nestarc/pagination — offset vs cursor at depth, filter parsing, sorting, and full-text search performance."
---

# Benchmark

Compares offset and cursor pagination performance at different depths, plus the cost of filtering, sorting, and search.

## What We Measure

| Benchmark | Description |
|-----------|-------------|
| **A) offset — page 1** | Shallow offset pagination (SKIP 0) |
| **B) offset — page 100** | Deep offset pagination (SKIP 990) |
| **C) cursor — first page** | Cursor-based, sort by `id` |
| **D1) cursor deep — sort by id** | Prisma generates efficient `WHERE id > ?` |
| **D2) cursor deep — sort by createdAt** | Prisma generates subquery (see caveat below) |
| **E) filtered + sorted** | Category filter + price sort |
| **F) full-text search** | Search across `name` and `category` columns |

## Test Setup

- **Database:** PostgreSQL 16 (Docker, port 5434)
- **Data:** 10,000 products across 5 categories with random prices
- **Warmup:** 20 iterations (discarded)
- **Measured:** 200 iterations per benchmark
- **Page size:** 10 items

## Running Locally

```bash
# Start PostgreSQL
docker compose up -d

# Generate Prisma client & run benchmark
DATABASE_URL=postgresql://test:test@localhost:5434/pagination_test \
  npx prisma generate --schema=benchmarks/prisma/schema.prisma && \
  npx ts-node benchmarks/pagination-overhead.ts
```

## Results

> Measured on Apple M-series, PostgreSQL 16, 10,000 rows, local Docker. Your results will vary.

| Benchmark | Avg | P50 | P95 | P99 |
|-----------|-----|-----|-----|-----|
| A) offset — page 1 | 0.99ms | 0.97ms | 1.14ms | 1.19ms |
| B) offset — page 100 | 0.98ms | 0.96ms | 1.11ms | 1.31ms |
| C) cursor — first page | 0.53ms | 0.51ms | 0.70ms | 0.80ms |
| D1) cursor deep — sort by id | 0.67ms | 0.66ms | 0.83ms | 0.93ms |
| D2) cursor deep — sort by createdAt | 17.56ms | 17.30ms | 17.96ms | 28.14ms |
| E) filtered + sorted | 0.90ms | 0.88ms | 1.11ms | 1.17ms |
| F) full-text search | 8.20ms | 7.71ms | 10.79ms | 21.55ms |

**Cursor + id sort is fastest:** 0.67ms at any depth — 31% faster than offset
**Deep offset penalty:** near-zero at 10,000 rows

## Interpretation

**Cursor + PK sort is the best performer.** At 0.67ms even for deep pages, it beats offset (0.98ms) by 31%. Prisma generates an efficient `WHERE id > ?` with `LIMIT`, using a direct index range scan.

**At 10,000 rows, offset shows no degradation** between page 1 and page 100 (both ~1ms). The deep offset penalty becomes significant at 100K+ rows.

**Filter and sort** add minimal overhead (0.90ms) because the benchmark schema includes indexes on `category`, `price`, and `created_at`.

**Full-text search** at 8.20ms uses `ILIKE` patterns across multiple columns without a dedicated text search index. For heavy search workloads, consider a PostgreSQL `GIN` index or a dedicated search service.

::: warning Prisma cursor caveat
**D2 shows a 26x slowdown** (17.56ms) when using cursor pagination with a non-PK sort column like `createdAt`. This is not a `@nestarc/pagination` issue — Prisma generates a subquery:

```sql
-- Sort by PK (fast): direct index range scan
WHERE id > $cursor ORDER BY id ASC LIMIT 11

-- Sort by non-PK (slow): subquery + no LIMIT
WHERE created_at <= (SELECT created_at FROM products WHERE id = $cursor)
ORDER BY created_at DESC OFFSET 1
```

**Recommendation:** When using cursor pagination, sort by the cursor column (`id`) for optimal performance. If you need `createdAt` ordering, use offset pagination instead — it performs consistently at ~1ms regardless of page depth at this data scale.
:::

### When to Use Which

| Scenario | Recommendation |
|----------|---------------|
| UI with page numbers (page 1, 2, 3...) | Offset |
| Infinite scroll / "Load more" | Cursor |
| Large datasets (100K+ rows) | Cursor (offset degrades) |
| Admin dashboards with "jump to page" | Offset |
| API consumed by mobile apps | Cursor |

## Methodology

- `performance.now()` for millisecond-precision timing
- `paginate()` function called directly (not through HTTP) to isolate pagination logic from network overhead
- Deep cursor is obtained by iterating 99 pages from the start, then benchmarking the 100th page fetch
- Products are seeded with varied categories, prices, and ratings to create realistic filter distributions
