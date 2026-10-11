---
description: "Historical @nestarc/feature-flag evaluation benchmarks, corrected workload counts, reproduction commands, and limits for cache and rollout performance claims."
---

# Benchmark

The table below contains **historical reported measurements from the 0.5.0 workload**. It has not been rerun for 0.6.0. The [0.5.0 benchmark source](https://github.com/nestarc/nestjs-feature-flag/blob/v0.5.0/benchmarks/evaluation-overhead.ts) documents that earlier workload. Published [0.6.0 benchmark source](https://github.com/nestarc/nestjs-feature-flag/blob/v0.6.0/benchmarks/evaluation-overhead.ts) adds schema isolation, assertions, and raw timing output, and changes the bulk workload to exactly 50 flags.

## Historical workload and environment

- Reported environment: Apple Silicon, PostgreSQL 16, Prisma 7.9.1, local Docker.
- 500 measured iterations per scenario; A, B, and D have 30 warm-up iterations. C forces a cold lookup for each measured iteration.
- Cached application: 30-second TTL. Uncached application: `cacheTtlMs: 0`.
- One `BENCH_FLAG` with three overrides plus 50 bulk flags. The 0.5.0 script's bulk scenario therefore evaluates **51 active flags**, despite its old 50-flag label.
- Bulk scenario invalidates before every tenth measured call: approximately 90% warm and 10% cold calls. It does not model concurrent clients, Redis, or network latency between machines.

## Historical results

| Scenario | Avg | P50 | P95 | P99 |
| --- | --- | --- | --- | --- |
| A: `isEnabled()` cache hit | 0.04ms | 0.04ms | 0.05ms | 0.12ms |
| B: `isEnabled()` cache miss | 1.17ms | 1.10ms | 1.62ms | 2.04ms |
| C: override matching, cold | 0.95ms | 0.89ms | 1.36ms | 1.87ms |
| D: `evaluateAll()`, 0.5.0 51-flag workload | 0.19ms | 0.04ms | 1.47ms | 1.78ms |

The earlier report gave a 29.2x ratio between the cache-miss and cache-hit averages. Rounded table values may not reproduce that ratio exactly. This is not a throughput or latency guarantee, and it is not a measurement of 0.6.0.

The lower C average than B does not prove that overrides are free or faster; both include a database lookup and the difference may reflect run variation. Hashing cost depends on input length. The bulk average describes the chosen warm/cold mixture, not every application workload.

## Run the 0.6.0 benchmark

Use the [v0.6.0 checkout](https://github.com/nestarc/nestjs-feature-flag/tree/v0.6.0) and its pinned dependencies. The benchmark creates a UUID-named PostgreSQL schema, applies the checked-in migrations there, and seeds exactly **50 flags**: one flag with overrides and 49 bulk flags. Its cleanup attempts to remove only that schema and close its clients, including on failure. Use a development database whose role can create schemas.

```bash
npm ci
npm run docker:up
export DATABASE_URL='postgresql://test:test@localhost:5499/feature_flag_test'
BENCH_OUTPUT=benchmarks/results/local-0.6.0.json npm run bench
```

The connection above matches the release's optional local Docker database. Set your own connection when using another database or port. `npm run bench` generates the Prisma client first; there is no need to apply migrations to application tables. Choose a new output filename for each run because existing files are not overwritten. Omit `BENCH_OUTPUT` to print results without writing JSON. See the [release benchmark instructions](https://github.com/nestarc/nestjs-feature-flag/blob/v0.6.0/benchmarks/README.md).

| Setting | Default | Meaning |
| --- | --- | --- |
| `BENCH_ITERATIONS` | `500` | Timed calls per scenario; multiple of 10, at least 10 |
| `BENCH_WARMUP` | `30` | Untimed calls per scenario; non-negative integer |
| `BENCH_OUTPUT` | Unset | New JSON file with environment metadata, summaries, and raw timings |

The four current scenarios use a warmed memory cache, a database lookup with cache writes disabled, a cold lookup with a matching override, and bulk evaluation of 50 flags with a scheduled 90% warm/10% cold mix. All scenarios have configurable warm-up. Schema setup, invalidation, seeding, assertions, and cleanup are outside timed operations. The benchmark uses sequential service calls and does not measure Redis, HTTP handling, or concurrent throughput.

Preserve the recorded source revision, dirty status, runtime/database versions, CPU, iteration counts, and raw timings with new results. The older 51-flag table and current 50-flag workload are different experiments.

## Choose a cache policy

Thirty seconds is the module default, not a measured optimum. Select TTL based on acceptable stale data and database load. Service mutations already attempt invalidation; direct database writes require explicit invalidation or expiry. Redis Pub/Sub reduces propagation delay but does not guarantee immediate consistency. See [Cache adapters](./cache-adapters).
