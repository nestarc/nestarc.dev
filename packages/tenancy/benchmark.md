---
description: "Performance benchmarks for @nestarc/tenancy — RLS overhead, set_config latency, and query performance under PostgreSQL Row Level Security."
---

# Benchmark

Measures the overhead added by the Prisma tenancy extension compared with a manual RLS transaction that returns the same tenant-scoped rows.

## What We Measure

| Benchmark | Description |
|-----------|-------------|
| **Admin direct `findMany`** | Context only; not used as the extension overhead baseline |
| **Admin tenant-filtered `findMany`** | Same returned row count with RLS bypassed |
| **Manual RLS transaction** | `app_user` query with `set_config()` + RLS active, no extension |
| **Tenancy extension `findMany`** | Same role, RLS policy, and returned row count as the manual RLS transaction |
| **Tenancy extension `findFirst`** | Single-row reference path |

The extension wraps every query in a `$transaction` that calls `SET LOCAL app.current_tenant = ?` before executing the actual query. The headline overhead is extension `findMany` minus the manual RLS transaction, not extension versus an unfiltered admin query.

## Test Setup

- **Database:** PostgreSQL 16 (Docker)
- **Data:** 1,005 rows across 3 tenants
- **Warmup:** 50 iterations (discarded)
- **Measured:** 500 iterations per benchmark

## Running Locally

```bash
# Start PostgreSQL
docker compose up -d --wait

# Run benchmark
npm run bench
```

## Results

> Measured on Apple M1 Pro, Node v24.11.1, PostgreSQL 16.14, Prisma Client 7.9.1, local Docker. Your results will vary.

| Scenario | Rows | Avg | P50 | P95 | P99 |
|----------|------|-----|-----|-----|-----|
| Admin direct `findMany` (all rows, no RLS) | 1005 | 1.779ms | 1.585ms | 3.199ms | 5.261ms |
| Admin tenant-filtered `findMany` (`WHERE tenant_id`, no RLS) | 402 | 1.081ms | 0.972ms | 1.643ms | 3.616ms |
| `app_user` manual RLS transaction (`set_config` + `findMany`) | 402 | 2.375ms | 2.253ms | 3.057ms | 5.337ms |
| `app_user` tenancy extension `findMany` | 402 | 2.372ms | 2.276ms | 2.891ms | 5.987ms |
| `app_user` tenancy extension `findFirst` | 1 | 1.605ms | 1.561ms | 2.209ms | 2.695ms |

**Extension overhead (avg):** -0.003ms (-0.1%) compared with the manual RLS transaction
**Extension overhead (P95):** -0.166ms

## Interpretation

The unfiltered admin query is useful context, but it is not the extension overhead baseline because it returns all tenant rows. Compare the tenancy extension with the manual RLS transaction when estimating extension cost: both use the `app_user` role, `SET LOCAL`, RLS policy enforcement, and the same returned row count.

In this local run, the extension and manual RLS transaction were effectively tied. For single-row lookups (`findFirst`), the measured path stayed near 1.6ms.

For most API endpoints (10-50ms total), this overhead is small compared with network, application, and serialization cost. Always benchmark with your schema, indexes, connection pool, and tenant row distribution.

## Methodology

- `performance.now()` measures wall-clock time per query
- Warmup iterations ensure connection pool and query plan caches are hot
- Percentiles computed from sorted timing arrays (no outlier removal)
- The script prints row counts, Node/PostgreSQL/Prisma versions, and p50/p95/p99 timings so results can be compared across environments
- Both clients connect to the same PostgreSQL instance; admin baselines bypass RLS, while manual and extension paths use `app_user` with RLS enforced
