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
| **C) cursor — first page** | Cursor-based pagination without cursor |
| **D) cursor — deep page** | Cursor-based at depth ~100 (uses cursor, no SKIP) |
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
| A) offset — page 1 | 1.12ms | 1.10ms | 1.33ms | 1.52ms |
| B) offset — page 100 | 1.11ms | 1.10ms | 1.34ms | 1.40ms |
| C) cursor — first page | 0.64ms | 0.63ms | 0.85ms | 0.94ms |
| D) cursor — deep page | 19.81ms | 19.62ms | 20.32ms | 30.02ms |
| E) filtered + sorted | 1.20ms | 1.07ms | 1.40ms | 2.12ms |
| F) full-text search | 8.34ms | 7.87ms | 11.10ms | 15.25ms |

**Deep offset penalty:** near-zero at 10,000 rows — PostgreSQL handles SKIP 990 efficiently at this scale
**Cursor first page:** 0.64ms — fastest mode

## Interpretation

**At 10,000 rows, offset pagination shows no degradation** between page 1 and page 100 (both ~1.1ms). PostgreSQL's query planner handles `SKIP 990` efficiently at this data volume. The deep offset penalty becomes significant at 100K+ rows.

**Cursor first page is the fastest** at 0.64ms because it skips the `count()` query that offset mode requires for `totalPages`. However, cursor deep page (D) is slower at 19.81ms — this depends on the cursor implementation and whether the cursor column has an efficient index.

**Filter and sort** add minimal overhead (1.20ms) because the benchmark schema includes indexes on `category`, `price`, and `created_at`.

**Full-text search** at 8.34ms is the second slowest operation. It uses `ILIKE` patterns across multiple columns without a dedicated text search index. For production workloads with heavy search, consider adding a PostgreSQL `GIN` index or using a dedicated search service.

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
