---
description: "Reproduce @nestarc/safe-response 0.16.0 HTTP benchmarks with balanced rounds, keep-alive connections, and explicit measurement scope."
---

# Benchmark

The 0.16.0 harness compares end-to-end HTTP latency for raw NestJS responses and responses wrapped by `SafeResponseModule`. It measures a successful request (200) and a `NotFoundException` (404).

## Measurement Scope

| Included | Setup |
|----------|-------|
| HTTP transport, serialization, client JSON parsing, and status checks | Express, loopback HTTP, concurrency 1 |
| Success and error response paths | Default module options and a small fixed payload |
| Repeated paired measurements | Six rounds, alternating raw-first and wrapped-first order |
| Per variant, scenario, and round | 50 warmups followed by 500 measured requests |

The two servers start once before timing. Both clients use the same keep-alive connection policy. Preflight checks verify that responses are actually wrapped; startup, preflight, and warmups are excluded from measured samples. Failures stop the run with a nonzero exit code and clean up connections and servers.

## Reproduce the Release

Run from the package repository at the published tag:

```bash
git clone --branch v0.16.0 --depth 1 https://github.com/nestarc/nestjs-safe-response.git
cd nestjs-safe-response
npm ci
npm run bench
```

Use Node.js 24 to match the release's dependency-installation and benchmark CI job. The package also supports NestJS 10 on Node.js 18; that combination is separate from this repository's default benchmark setup.

Configuration is explicit:

```bash
BENCH_ROUNDS=10 BENCH_ITERATIONS=1000 BENCH_WARMUP=100 npm run bench
```

`BENCH_ROUNDS` must be even, from 2 through 100; `BENCH_ITERATIONS` accepts 1–10,000 and `BENCH_WARMUP` accepts 0–10,000. The harness regression tests run with `npm run test:bench` and do not enforce timing thresholds.

## Reading Results

The report prints Node.js, NestJS, Express, package, OS, and CPU versions; per-round and pooled mean/P50/P95/P99 latency; and the mean and range of paired round differences (`wrapped - raw`). Preserve that environment and configuration when sharing a result.

These HTTP differences do not isolate interceptor or filter execution time and do not predict production throughput. Compare multiple rounds and their variation, then measure your own payloads, options, adapter, and concurrency. A negative difference in one run is not evidence that wrapping makes an application faster.

Earlier site figures came from the previous harness and are not comparable to 0.16.0 measurements. This page does not carry them forward as current release results.

Source: [0.16.0 benchmark harness](https://github.com/nestarc/nestjs-safe-response/blob/v0.16.0/benchmarks/response-overhead.ts) and [harness regression tests](https://github.com/nestarc/nestjs-safe-response/blob/v0.16.0/benchmarks/response-overhead.test.cjs).
