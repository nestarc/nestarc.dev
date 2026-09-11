---
description: "Historical @nestarc/feature-flag evaluation benchmarks, corrected workload counts, reproduction commands, and limits for cache and rollout performance claims."
---

# Benchmark

These are **historical reported measurements**, not a fresh run of the unreleased fixes. Use them to understand the test setup, then measure your own workload. The [published 0.5.0 benchmark source](https://github.com/nestarc/nestjs-feature-flag/blob/v0.5.0/benchmarks/evaluation-overhead.ts) is the reproducible baseline; [current source](https://github.com/nestarc/nestjs-feature-flag/blob/main/benchmarks/evaluation-overhead.ts) may change the workload.

## Workload and environment

- Reported environment: Apple Silicon, PostgreSQL 16, Prisma 7.9.1, local Docker.
- 500 measured iterations per scenario; A, B, and D have 30 warm-up iterations. C forces a cold lookup for each measured iteration.
- Cached application: 30-second TTL. Uncached application: `cacheTtlMs: 0`.
- One `BENCH_FLAG` with three overrides plus 50 bulk flags. The released script's bulk scenario therefore evaluates **51 active flags**, despite its old 50-flag label.
- Bulk scenario invalidates before every tenth measured call: approximately 90% warm and 10% cold calls. It does not model concurrent clients, Redis, or network latency between machines.

## Historical results

| Scenario | Avg | P50 | P95 | P99 |
| --- | --- | --- | --- | --- |
| A: `isEnabled()` cache hit | 0.04ms | 0.04ms | 0.05ms | 0.12ms |
| B: `isEnabled()` cache miss | 1.17ms | 1.10ms | 1.62ms | 2.04ms |
| C: override matching, cold | 0.95ms | 0.89ms | 1.36ms | 1.87ms |
| D: `evaluateAll()`, released 51-flag workload | 0.19ms | 0.04ms | 1.47ms | 1.78ms |

The earlier report gave a 29.2x ratio between the cache-miss and cache-hit averages. Rounded table values may not reproduce that ratio exactly. This is not a throughput or latency guarantee, and it has not been rerun during the documentation correction.

The lower C average than B does not prove that overrides are free or faster; both include a database lookup and the difference may reflect run variation. Hashing cost depends on input length. The bulk average describes the chosen warm/cold mixture, not every application workload.

## Run the benchmark

Use a disposable database: the benchmark deletes feature-flag records during setup and cleanup. Run from the chosen package checkout:

```bash
npm ci
npm run prisma:generate
npm run docker:up
npm run db:migrate
npm run bench
```

The scripts read `.env.test` for the benchmark PostgreSQL connection. Record the source commit, runtime versions, actual active flag count, and hardware with new results. Do not compare measurements from different flag counts as if they were the same workload.

## Choose a cache policy

Thirty seconds is the module default, not a measured optimum. Select TTL based on acceptable stale data and database load. Service mutations already attempt invalidation; direct database writes require explicit invalidation or expiry. Redis Pub/Sub reduces propagation delay but does not guarantee immediate consistency. See [Cache adapters](./cache-adapters).
