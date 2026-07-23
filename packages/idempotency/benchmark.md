---
description: "Performance benchmarks for @nestarc/idempotency: interceptor overhead, replay speed, and MemoryStorage, RedisStorage, and PostgresStorage scenarios."
---

# Benchmark

The benchmark script measures the cost of the interceptor and the latency difference between first execution and replay.

## Scenarios

| Scenario | Description |
|----------|-------------|
| A) POST, no idempotency | Plain NestJS handler without the interceptor. |
| B) First request, MemoryStorage | Header parsing, stable fingerprint, create lock, run handler, capture response. |
| C) Replay, MemoryStorage | Lookup, fingerprint match, replay cached response. Handler is skipped. |
| D) First request, RedisStorage | Same as B with Redis-backed shared storage. |
| E) Replay, RedisStorage | Same as C with Redis-backed shared storage. |
| F) First request, PostgresStorage | Same as B with Postgres-backed shared storage. |
| G) Replay, PostgresStorage | Same as C with Postgres-backed shared storage. |

## Test setup

- NestJS test application with a small JSON handler.
- Raw `http.request()` client to avoid supertest assertion overhead.
- Unique run id to prevent key collisions across repeated benchmark runs.
- Warmup iterations are offset from measured iterations.
- Redis and Postgres scenarios run only when their connection URLs are provided.

## Running locally

```bash
# Memory only: A, B, C
npx ts-node bench/idempotency.bench.ts

# Longer local run
npx ts-node bench/idempotency.bench.ts --iterations 1000 --warmup 100
```

Run Redis scenarios:

```bash
docker run -d --name redis-bench -p 6379:6379 redis:7-alpine
npx ts-node bench/idempotency.bench.ts \
  --iterations 1000 \
  --warmup 100 \
  --redis-url redis://localhost:6379
docker stop redis-bench
docker rm redis-bench
```

Run Postgres scenarios:

```bash
docker run -d --name idem-pg-bench \
  -e POSTGRES_USER=test \
  -e POSTGRES_PASSWORD=test \
  -e POSTGRES_DB=idempotency_bench \
  -p 5432:5432 \
  postgres:16-alpine

npx ts-node bench/idempotency.bench.ts \
  --iterations 1000 \
  --warmup 100 \
  --postgres-url postgresql://test:test@localhost:5432/idempotency_bench

docker stop idem-pg-bench
docker rm idem-pg-bench
```

## Example results

These numbers are from a previous local run on Windows 11, Node.js 20, Redis 7 in Docker, localhost. Treat them as an order-of-magnitude reference, not a promise for your hardware or network.

| Scenario | Avg | P50 | P95 | P99 |
|----------|-----|-----|-----|-----|
| A) POST, no idempotency | 0.28ms | 0.25ms | 0.39ms | 0.57ms |
| B) First request, MemoryStorage | 0.32ms | 0.30ms | 0.41ms | 0.53ms |
| C) Replay, MemoryStorage | 0.25ms | 0.24ms | 0.33ms | 0.44ms |
| D) First request, RedisStorage | 1.67ms | 1.61ms | 2.02ms | 2.34ms |
| E) Replay, RedisStorage | 0.64ms | 0.61ms | 0.82ms | 1.08ms |

The docs do not publish a canonical Postgres number yet. The source benchmark includes Postgres scenarios F and G; run them against your own database topology because pool location, TLS, disk, and network latency dominate the result.

## Interpretation

**MemoryStorage overhead is small.** In the example run, first-request overhead is roughly the cost of stable JSON fingerprinting, storage record creation, and response capture.

**Replay can be faster than baseline.** Replayed requests skip the controller handler entirely. The more work your handler does, such as database writes or external API calls, the more replay helps.

**Redis and Postgres are dominated by storage latency.** First execution needs create and complete operations. Replay usually needs only the storage read plus JSON/header replay.

**The benchmark is not a substitute for a production load test.** Measure with your adapter, your deployment topology, realistic response sizes, and representative handler work.

## What to watch

| Metric | Why it matters |
|--------|----------------|
| First-request overhead | Added latency on successful non-duplicate writes. |
| Replay latency | User-perceived retry speed when a client times out and retries. |
| `409` conflict rate | Too many in-flight duplicates may indicate aggressive client retries or a too-long handler. |
| `422` mismatch rate | Reused keys with different payloads may indicate client key generation bugs. |
| `complete_error` events | Storage instability can prevent replay and should be investigated. |
| `stale` events | Processing TTL may be too short for the endpoint's real runtime. |
