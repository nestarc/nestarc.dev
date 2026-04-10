---
description: "Performance benchmarks for @nestarc/idempotency — interceptor overhead, response replay speed, MemoryStorage vs RedisStorage latency."
---

# Benchmark

Measures the overhead added by the idempotency interceptor and the speed of response replay.

## What We Measure

| Benchmark | Description |
|-----------|-------------|
| **A) POST — no idempotency (baseline)** | Plain NestJS handler without the interceptor |
| **B) First request — MemoryStorage** | Full path: header parsing + fingerprint + record creation + handler + response capture |
| **C) Replay — MemoryStorage** | Cache hit: record lookup + fingerprint match + cached response replay (handler skipped) |
| **D) First request — RedisStorage** | Same as B with Redis (4 round trips: get + create + hgetall + complete) |
| **E) Replay — RedisStorage** | Same as C with Redis (1 round trip: get only) |

## Test Setup

- **NestJS:** Test app with `@nestjs/testing`, trivial JSON handler
- **Redis:** Docker `redis:7-alpine`, localhost
- **Iterations:** 1,000 per scenario
- **Warmup:** 100 iterations (discarded)
- **HTTP client:** Raw `http.request()` (no supertest overhead)

## Running Locally

```bash
# Memory only (A, B, C)
npx ts-node bench/idempotency.bench.ts --iterations 1000 --warmup 100

# With Redis (A~E)
docker run -d --name redis-bench -p 6379:6379 redis:7-alpine
npx ts-node bench/idempotency.bench.ts --iterations 1000 --warmup 100 \
  --redis-url redis://localhost:6379
docker stop redis-bench && docker rm redis-bench
```

## Results

> Measured on Windows 11, Node.js 20, Redis 7 (Docker), localhost. Your results will vary.

| Benchmark | Avg | P50 | P95 | P99 |
|-----------|-----|-----|-----|-----|
| A) POST — no idempotency (baseline) | 0.28ms | 0.25ms | 0.39ms | 0.57ms |
| B) First request — MemoryStorage | 0.32ms | 0.30ms | 0.41ms | 0.53ms |
| C) Replay — MemoryStorage | 0.25ms | 0.24ms | 0.33ms | 0.44ms |
| D) First request — RedisStorage | 1.67ms | 1.61ms | 2.02ms | 2.34ms |
| E) Replay — RedisStorage | 0.64ms | 0.61ms | 0.82ms | 1.08ms |

## Interpretation

**MemoryStorage overhead is negligible.** First request (B) adds ~0.04ms to baseline (A) — the cost of SHA-256 fingerprinting, record creation, and response capture. Replay (C) is actually **faster** than baseline because the handler is skipped entirely.

**RedisStorage is dominated by network round trips.** First request (D) requires 4 Redis round trips (get → create → hgetall → complete), while replay (E) requires only 1 (get). The ~1ms difference between D and E reflects 3 saved round trips.

**Replay saves real handler cost.** In this benchmark the handler is trivial, so the savings are modest. In a real application where the handler performs database writes, external API calls, or complex computation, the replay savings scale proportionally — the handler is completely bypassed.

| Metric | Value |
|--------|-------|
| MemoryStorage first-request overhead (B − A) | ~0.04ms |
| MemoryStorage replay vs baseline (A − C) | ~0.03ms faster |
| RedisStorage network cost (D − B) | ~1.35ms |
| RedisStorage replay savings (D − E) | ~1.03ms (3 RTTs) |

## Methodology

- `performance.now()` for sub-millisecond timing
- Raw `http.request()` to avoid supertest assertion overhead
- Unique run ID (`Date.now().toString(36)`) prevents key collisions across repeated executions
- Warmup indices offset from measurement indices to avoid key namespace collision
- Each scenario runs sequentially (no concurrent interference)
