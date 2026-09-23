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
| **D1) cursor deep — sort by id** | Unique-ID ordering in the reported cursor run |
| **D2) cursor deep — sort by createdAt** | Non-PK ordering in the reported cursor run |
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

# Generate the Prisma 7 client and run the adapter-backed benchmark
npm run bench
```

## Results

> Measured on Apple Silicon, PostgreSQL 16, Prisma 7.9.1, 10,000 rows, local Docker. Your results will vary.

| Benchmark | Avg | P50 | P95 | P99 |
|-----------|-----|-----|-----|-----|
| A) offset — page 1 | 1.04ms | 1.03ms | 1.21ms | 1.27ms |
| B) offset — page 100 | 2.61ms | 2.53ms | 2.94ms | 4.67ms |
| C) cursor — first page | 0.56ms | 0.53ms | 0.76ms | 1.01ms |
| D1) cursor deep — sort by id | 0.58ms | 0.55ms | 0.78ms | 0.92ms |
| D2) cursor deep — sort by createdAt | 11.05ms | 11.06ms | 11.51ms | 11.70ms |
| E) filtered + sorted | 0.92ms | 0.92ms | 1.16ms | 1.29ms |
| F) case-insensitive contains search | 8.55ms | 8.35ms | 10.70ms | 13.31ms |

**Cursor + id sort is fastest:** 0.58ms at depth — 78% faster than deep offset in this run

## Interpretation

**Cursor + PK sort is the best performer among these cases.** At 0.58ms for the measured deep page, it beat deep offset (2.61ms) by 78% in this run. The summary does not include a captured query plan, and composite keyset is not included in these measurements.

**At 10,000 rows, offset shows measurable degradation** from 1.04ms on page 1 to 2.61ms on page 100. The penalty grows with depth and workload.

**Filter and sort** add minimal overhead (0.92ms) because the benchmark schema includes indexes on `category`, `price`, and `created_at`.

**Case-insensitive contains search** at 8.55ms uses `ILIKE` patterns across multiple columns without a dedicated text search index. For heavy search workloads, consider a PostgreSQL `GIN` index or a dedicated search service.

::: warning Scope of the cursor result
**D2 reports 11.05ms** for the tested `createdAt` cursor, compared with 0.58ms for the ID cursor, using Prisma 7.9.1 and PostgreSQL 16. Do not generalize this to every Prisma version or claim that non-PK cursor queries always omit `LIMIT` without capturing the actual SQL.

**Recommendation:** Use a Prisma cursor for a simple unique ordering. For non-unique ordering such as `createdAt`, evaluate the package's keyset cursor with a tie-breaker, or choose offset pagination when arbitrary page jumps matter. Follow the [keyset example](/blog/cursor-vs-offset-pagination-prisma#keyset-pagination-with-createdat-and-id) and measure the actual workload.
:::

### Inspect the Query Plan

The [version-pinned source](https://github.com/nestarc/nestjs-pagination/tree/fad02c29077fce7b3ec97bf8ef04db3ab5d01153) identifies the 0.3.0 implementation behind these docs. To verify a query on your own fixture:

1. Enable Prisma query events on the fixture's client, using `log: [{ emit: 'event', level: 'query' }]`, and subscribe with `prisma.$on('query', ...)`. Capture the SQL and bound parameter types locally; use synthetic data rather than customer values.
2. Run identical filters and sort order for offset, Prisma cursor, and keyset, including a page where multiple rows have the same timestamp.
3. Run `EXPLAIN (ANALYZE, BUFFERS)` on each captured SELECT against a disposable database. This executes the query. Check index use, sorting, rows scanned, and execution time.
4. Record the package/Prisma/PostgreSQL versions, fixture size, indexes, and raw plans with timings. Keep results separate from the historical table above.

The [Prisma logging guide](https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging) describes query event configuration. No new plan capture or keyset timing is claimed by this page.

### When to Use Which

| Scenario | Recommendation |
|----------|---------------|
| UI with page numbers (page 1, 2, 3...) | Offset |
| Infinite scroll / "Load more" | Cursor |
| Large datasets (100K+ rows) | Cursor (offset degrades) |
| Non-unique ordering such as `createdAt` | Keyset cursor with a unique tie-breaker and matching index |
| Admin dashboards with "jump to page" | Offset |
| API consumed by mobile apps | Cursor |

## Methodology

- `performance.now()` for millisecond-precision timing
- `paginate()` function called directly (not through HTTP) to isolate pagination logic from network overhead
- Deep cursor is obtained by iterating 99 pages from the start, then benchmarking the 100th page fetch
- Products are seeded with varied categories, prices, and ratings to create realistic filter distributions
