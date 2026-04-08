---
description: "Performance benchmarks for @nestarc/feature-flag — flag evaluation latency, cache hit/miss comparison, override cascade, and bulk evaluation."
---

# Benchmark

Measures flag evaluation performance under different conditions: cached, uncached, with overrides, and bulk.

## What We Measure

| Benchmark | Description |
|-----------|-------------|
| **A) isEnabled() — cache hit** | Flag already in memory cache (hot path) |
| **B) isEnabled() — cache miss** | Every call hits the database |
| **C) isEnabled() — override cascade** | Cold cache + user/tenant/env override resolution |
| **D) evaluateAll() — 50 flags** | Bulk evaluation with mixed cache |

## Test Setup

- **Database:** PostgreSQL 16 (Docker, port 5499)
- **Warmup:** 30 iterations (discarded)
- **Measured:** 500 iterations per benchmark
- **Cache TTL:** 30s for cached tests, 0 for uncached
- **Flags:** 1 flag with 3 overrides (tenant, user, env) + 50 bulk flags

## Running Locally

```bash
# Start PostgreSQL
docker compose up -d --wait

# Run migrations
dotenv -e .env.test -- npx prisma migrate deploy

# Run benchmark
dotenv -e .env.test -- npx ts-node benchmarks/evaluation-overhead.ts
```

## Results

> Measured on Apple M-series, PostgreSQL 16, local Docker. Your results will vary.

| Benchmark | Avg | P50 | P95 | P99 |
|-----------|-----|-----|-----|-----|
| A) isEnabled() — cache hit | 0.04ms | 0.03ms | 0.05ms | 0.07ms |
| B) isEnabled() — cache miss | 1.30ms | 1.14ms | 2.54ms | 3.69ms |
| C) isEnabled() — override cascade (cold) | 1.07ms | 1.02ms | 1.43ms | 2.11ms |
| D) evaluateAll() — 50 flags (mixed) | 0.19ms | 0.04ms | 1.55ms | 1.71ms |

**Cache speedup:** 32.5x (hit vs miss)

## Interpretation

**Cache is critical.** A cache hit resolves in **0.04ms** (pure memory Map lookup + evaluator cascade). A cache miss requires a full DB round-trip at **1.3ms**.

The 6-layer evaluation cascade adds negligible overhead — override cascade (C) at 1.07ms is actually *faster* than a plain cache miss (B) at 1.3ms, because the override lookup is a single `findUnique` with `include: { overrides: true }`. The `murmurhash3` function used for percentage rollouts is constant-time.

The `evaluateAll()` benchmark averages **0.19ms** because 90% of calls hit cache (P50 = 0.04ms). The P95 of 1.55ms reflects the 10% of calls that trigger a cache miss.

**Recommendation:** Keep the default 30s cache TTL unless you need real-time flag changes. For dashboard/admin endpoints that must reflect immediately, call `invalidateCache()` after flag updates.

## Methodology

- `performance.now()` for millisecond-precision timing
- Two separate NestJS apps: one with 30s cache TTL, one with cache disabled
- Override cascade test invalidates cache before each iteration to force cold evaluation
- Bulk test uses 50 flags with varying `enabled` and `percentage` values
