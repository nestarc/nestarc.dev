---
description: "Run the idempotency 1.0 Express/Fastify benchmark with validated HTTP samples, isolated Redis/Postgres namespaces, and reproducible JSON reports."
---

# Benchmark

The **1.0.0 source-checkout benchmark** measures sequential HTTP round-trip latency for Express and Fastify with Memory, Redis, and Postgres storage. It checks correctness before accepting timing samples. The benchmark is not included in the npm package.

It is a diagnostic tool, not a throughput test or an isolated measurement of interceptor overhead. The previous site's 0.x timing table is not a 1.0 measurement; no 1.0 latency promise is published here.

## Run the pinned source

Use Node.js 22 or 24:

```bash
git clone --branch v1.0.0 --depth 1 https://github.com/nestarc/idempotency.git
cd idempotency
npm ci
npm run bench -- --help
npm run bench -- --adapter both --iterations 200 --warmup 20
```

Without service URLs, Memory runs and the report marks Redis/Postgres as skipped (`pass-with-skips`). A configured service that fails to load, connect, or initialize fails the run.

Use disposable services from the source repository's Compose setup. PostgreSQL credentials must allow schema creation and deletion:

```bash
docker compose up -d --wait
export TEST_DATABASE_URL=postgresql://test:test@localhost:5432/idempotency_test
export TEST_REDIS_URL=redis://localhost:6379
npm run bench:smoke
npm run bench -- --adapter both --require-services \
  --iterations 2000 --warmup 100 --request-timeout-ms 5000 \
  --output /tmp/idempotency-benchmark.json
```

`--redis-url` and `--postgres-url` override the environment defaults. `bench:smoke` requires both services and runs Express/Fastify × Memory/Redis/Postgres with five samples and one warmup per scenario. This verifies functionality, not statistically useful p99 performance.

Use a new output filename in an existing directory. The runner refuses to overwrite evidence and omits service URLs and credentials from reports.

## Scenarios and validation

Each adapter/storage combination starts a fresh Nest application on an ephemeral loopback port with a single keep-alive connection. Untimed probes first verify first request, replay, mismatch, and replay after mismatch.

| Scenario | Expected result |
| --- | --- |
| Baseline | POST without idempotency; one handler call per request. |
| First request | Unique key per request; one handler call and `Idempotency-Status: created`. |
| Replay | Reuse a seeded key; matching status/body/headers and no additional handler call. |

Every warmup and sample validates HTTP status, exact JSON, idempotency headers, and handler count. A completion failure that still returns success invalidates the run. HTTP requests have bounded deadlines, complete framing checks, and a 1 MiB response cap.

## Reports and interpretation

JSON reports include raw samples, average/min/max, nearest-rank p50/p95/p99, counts, versions, CPU/OS, commit and dirty-checkout state, skips, failures, and cleanup outcomes. A failure discards performance samples and exits nonzero.

Timings include client/TCP, Nest adapter, serialization, and storage in the same process. Baseline differences are not isolated package overhead. There is no concurrency or requests-per-second claim. Machine load, garbage collection, scenario order, growing first-request storage, connection warmth, and remote backend placement affect results. Compare repeated longer runs with the same configuration.

## Isolation and cleanup

Each cell uses an owned random Redis prefix or Postgres schema. It never truncates a default records table, and a namespace collision fails without deleting existing data. After success or failure, it closes HTTP/Nest resources, removes only its own storage namespace, and closes externally supplied driver connections. Cleanup failure fails the benchmark.

Graceful SIGINT/SIGTERM requests cleanup after the current bounded operation. SIGKILL, a second interrupt, or an unavailable backend can leave artifacts. Redis records have a 24-hour TTL; surviving Postgres schemas are identified in the report for authorized cleanup.

See the [version-pinned benchmark guide](https://github.com/nestarc/idempotency/blob/v1.0.0/bench/README.md) for recorded release-source checks and the [storage guide](/packages/idempotency/storage) for adapter contracts. Run production load tests separately using representative response sizes, handlers, concurrency, and topology.
