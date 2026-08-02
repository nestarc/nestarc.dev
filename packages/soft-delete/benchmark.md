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

- **Database:** PostgreSQL 15 (Docker, port 5432)
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

**Observed findMany difference:** -1.10ms (-35%) with half as many returned rows

**Observed soft vs hard delete:** 0.54ms vs 0.53ms in this small workload

## Interpretation

**The read scenarios return different row counts.** The `WHERE deleted_at IS NULL` query returns 250 live rows while the baseline returns 500 rows. Its lower latency therefore reflects less data returned and should not be interpreted as negative extension overhead.

**Soft delete and hard delete were close** at roughly 0.53ms in this single-row benchmark. Measure the extension with your indexes, row width, triggers, and database workload before making capacity decisions.

**The measured cascade case completed in 0.56ms** for a User with 3 Posts and 6 Comments. Deeper trees and production contention can behave differently, so benchmark the relationship shapes your application actually uses.

## Methodology

- `performance.now()` for millisecond-precision timing
- Raw SQL table creation (no Prisma migration) — matches e2e test pattern
- Cascade benchmark uses `createPrismaSoftDeleteExtension` with explicit cascade config
- Each delete benchmark seeds fresh rows to avoid measuring empty-set operations
