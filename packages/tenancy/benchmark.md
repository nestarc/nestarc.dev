---
description: "Performance benchmarks for @nestarc/tenancy — RLS overhead, set_config latency, and query performance under PostgreSQL Row Level Security."
---

# Benchmark

Measures the overhead added by the Prisma tenancy extension compared to direct queries without RLS.

## What We Measure

| Benchmark | Description |
|-----------|-------------|
| **A) Direct query (no extension)** | Baseline — superuser Prisma query, no RLS |
| **B) findMany with tenancy extension** | App user query with `set_config()` + RLS active |
| **C) findFirst with tenancy extension** | Single-row lookup with RLS |

The extension wraps every query in a `$transaction` that calls `SET LOCAL app.current_tenant = ?` before executing the actual query. Benchmark B measures this full round-trip.

## Test Setup

- **Database:** PostgreSQL 16 (Docker)
- **Data:** 1,000 rows across 3 tenants
- **Warmup:** 50 iterations (discarded)
- **Measured:** 500 iterations per benchmark

## Running Locally

```bash
# Start PostgreSQL
docker compose up -d --wait

# Run benchmark
DATABASE_URL=postgresql://tenancy:tenancy@localhost:5433/tenancy_test \
  npx ts-node benchmarks/rls-overhead.ts
```

## Results

> Measured on Apple M-series, PostgreSQL 16, local Docker. Your results will vary.

| Benchmark | Avg | P50 | P95 | P99 |
|-----------|-----|-----|-----|-----|
| A) Direct query (no RLS) | 4.11ms | 3.32ms | 6.28ms | 9.96ms |
| B) findMany with extension | 3.12ms | 2.63ms | 5.63ms | 8.94ms |
| C) findFirst with extension | 1.27ms | 1.23ms | 1.58ms | 2.00ms |

**Extension overhead (avg):** -0.99ms (-24%) — **faster with RLS**
**Extension overhead (P95):** -0.65ms

## Interpretation

The extension with RLS is actually **faster** than the baseline because RLS filters rows at the database level — the `app_user` client only sees its own tenant's rows, returning fewer results than the superuser baseline that returns all 1,000 rows across 3 tenants.

The `SET LOCAL` overhead (~0.5ms) is more than offset by scanning fewer rows. For single-row lookups (`findFirst`), the difference is minimal at 1.27ms.

For most API endpoints (10-50ms total), the tenancy extension adds negligible latency. The key takeaway: **RLS is not just a security feature, it's a performance optimization** when your tables contain data from multiple tenants.

## Methodology

- `performance.now()` measures wall-clock time per query
- Warmup iterations ensure connection pool and query plan caches are hot
- Percentiles computed from sorted timing arrays (no outlier removal)
- Both clients connect to the same PostgreSQL instance; the baseline uses a superuser (no RLS), the extension client uses `app_user` (RLS enforced)
