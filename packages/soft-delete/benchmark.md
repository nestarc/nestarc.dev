---
description: "Performance benchmarks for @nestarc/soft-delete — query filtering overhead, soft vs hard delete comparison, and cascade soft-delete performance."
---

# Benchmark

Measures the overhead of automatic `WHERE deleted_at IS NULL` filtering and the cost of soft-delete operations compared to hard deletes.

## What We Measure

| Benchmark | Description |
|-----------|-------------|
| **A) findMany — no extension** | Baseline query returning all rows (including soft-deleted) |
| **B) findMany — with soft-delete filter** | Same query with automatic `deleted_at IS NULL` injection |
| **C) delete — hard delete** | Baseline `DELETE FROM` |
| **D) delete — soft delete** | `UPDATE SET deleted_at = now()` |
| **E) cascade soft-delete** | User + 3 Posts + 6 Comments deleted in cascade |

## Test Setup

- **Database:** PostgreSQL 16 (Docker, port 5432)
- **Data:** 500 users (half soft-deleted) for read benchmarks, fresh rows for delete benchmarks
- **Warmup:** 30 iterations (discarded)
- **Measured:** 300 iterations per benchmark (50 for cascade)

## Running Locally

```bash
# Start PostgreSQL
docker compose up -d

# Generate Prisma client & run benchmark
DATABASE_URL=postgresql://test:test@localhost:5432/soft_delete_test \
  npx prisma generate --schema=test/prisma/schema.prisma && \
  npx ts-node benchmarks/soft-delete-overhead.ts
```

## Results

> Measured on Apple M-series, PostgreSQL 16, local Docker. Your results will vary.

| Benchmark | Avg | P50 | P95 | P99 |
|-----------|-----|-----|-----|-----|
| A) findMany — no extension | 3.11ms | 2.43ms | 5.78ms | 11.40ms |
| B) findMany — with soft-delete filter | 2.01ms | 1.61ms | 4.44ms | 7.48ms |
| C) delete — hard delete | 0.53ms | 0.52ms | 0.68ms | 0.77ms |
| D) delete — soft delete | 0.54ms | 0.53ms | 0.69ms | 0.77ms |
| E) cascade (User + 3 Posts + 6 Comments) | 0.56ms | 0.56ms | 0.72ms | 0.76ms |

**findMany filter overhead:** -1.10ms (-35%) — **faster with soft-delete filter**
**Soft vs hard delete:** 0.54ms vs 0.53ms — identical

## Interpretation

**Read filtering makes queries faster.** The `WHERE deleted_at IS NULL` condition reduces the result set (250 live rows vs 500 total), cutting query time by 35%. This is not overhead — it's a net performance gain.

**Soft delete vs hard delete** is identical at ~0.53ms. The extension converts `DELETE` to `UPDATE SET deleted_at = now()`, which PostgreSQL executes at the same speed as a real delete for single-row operations.

**Cascade is surprisingly fast** at 0.56ms for a User with 3 Posts and 6 Comments. The extension batches the cascade UPDATEs efficiently. Performance scales linearly with the number of related records, but even with 9 related rows the cost is sub-millisecond.

## Methodology

- `performance.now()` for millisecond-precision timing
- Raw SQL table creation (no Prisma migration) — matches e2e test pattern
- Cascade benchmark uses `createPrismaSoftDeleteExtension` with explicit cascade config
- Each delete benchmark seeds fresh rows to avoid measuring empty-set operations
