---
description: "Performance benchmarks for @nestarc/api-keys — authentication overhead, timing-safe verification, and key-issuance throughput."
---

# Benchmark

Measures credential-verification overhead with in-memory storage and compares two rejected-credential paths. The current 0.4.0 benchmark is a timing regression smoke check; it does not establish constant-time database or HTTP behavior.

## What We Measure

| Benchmark | Description |
|-----------|-------------|
| **A) Raw `crypto.createHash('sha256')` — baseline** | The irreducible SHA-256 + pepper concat floor |
| **B) `Sha256Hasher.hash()`** | Wrapper overhead over raw SHA-256 |
| **C) `Sha256Hasher.verify()`** | Hash + `timingSafeEqual` compare |
| **D) `ApiKeysService.verify()` — HAPPY path** | Parse + prefix lookup + hash + compare + context construction |
| **E) `ApiKeysService.verify()` — UNKNOWN prefix** | Missing-prefix rejection with dummy hash-and-compare work |
| **F) `ApiKeysService.verify()` — KNOWN prefix, wrong secret** | Known-prefix rejection with real hash-and-compare work |
| **G) `create()` + `verify()` round-trip** | Key-issuance + immediate verification |

## Timing regression check

The [published 0.4.0 source](https://github.com/nestarc/api-keys/blob/v0.4.0/bench/api-keys.bench.ts) fails with exit code 1 when `|P50(E) − P50(F)|` exceeds the configured threshold. The default threshold is `0.05ms` (50µs); `bench:smoke` uses `0.5ms` with fewer iterations to tolerate CI noise. It compares unknown-prefix and known-prefix/wrong-secret failures, not success against failure.

Both rejection paths perform hash-and-compare work. A passing wall-clock check is a bounded regression signal for that run, not proof that remote clients cannot distinguish request paths. Storage latency, exception handling, observers, network conditions, and repeated sampling are outside this check.

## Test Setup

- **Storage:** Prefix-indexed in-memory adapter (O(1) lookup on hit and miss, mirroring a production Prisma adapter with `UNIQUE INDEX(prefix)`)
- **Seed:** 1000 pre-seeded valid keys
- **Iterations:** 5000 per scenario (configurable)
- **Warmup:** 500 iterations (discarded)
- **PostgreSQL:** Not required — bench isolates library overhead from DB I/O

## Running Locally

Run the benchmark from a source checkout of [`nestarc/api-keys` at v0.4.0](https://github.com/nestarc/api-keys/tree/v0.4.0); benchmark sources are not part of the npm tarball.

```bash
cd api-keys
git checkout v0.4.0
npm ci
npm run bench

# Bounded CI smoke check
npm run bench:smoke

# Custom iterations
npx ts-node bench/api-keys.bench.ts --iterations 10000 --warmup 1000

# Custom timing threshold in milliseconds
npx ts-node bench/api-keys.bench.ts --timing-threshold-ms 0.05
```

The full run defaults to 5,000 iterations and 500 warmup iterations. `bench:smoke` uses 250 iterations and 50 warmup iterations. Record the commit, runtime, host, flags, and raw output with each result.

## Historical reported results

> Previously reported on Windows 11, Node.js 24, Intel Core i7-10750H. The original result did not record an exact package version or commit and predates the separate known-prefix/wrong-secret scenario. These numbers are not a 0.4.0 measurement and cannot establish its E-vs-F timing result.

| Benchmark | Avg | P50 | P95 | P99 |
|-----------|-----|-----|-----|-----|
| A) Raw `crypto.createHash('sha256')` — baseline | 2.8µs | 2.2µs | 3.8µs | 18.1µs |
| B) `Sha256Hasher.hash()` | 2.8µs | 2.2µs | 4.3µs | 19.9µs |
| C) `Sha256Hasher.verify()` | 2.7µs | 2.3µs | 2.9µs | 17.0µs |
| D) `ApiKeysService.verify()` — HAPPY | **4.9µs** | **4.1µs** | 6.7µs | 24.8µs |
| E) `ApiKeysService.verify()` — INVALID | 13.8µs | 10.1µs | 12.2µs | 31.6µs |
| F) `create()` + `verify()` round-trip | 16.2µs | 14.1µs | 28.8µs | 56.9µs |

### Reading the historical numbers

- The displayed mean hash timings round to the same value, so they do not support a precise wrapper-overhead percentage.
- The reciprocal of the historical happy-path average is about 204,000 operations per second. This is an in-memory estimate, not measured concurrent HTTP throughput.
- The historical 6.0µs P50 difference compares success with an unknown-prefix failure. It is not the current unknown-versus-known-invalid check.

## Production Notes

- Measure the production storage adapter, database pool, and request path separately. The in-memory benchmark excludes database I/O and network latency.
- `ApiKeysGuard` calls `authorizeRequest()` in 0.4. Credential-only `verify()` timings do not include the full environment/IP/scope policy, context writer, and HTTP pipeline.
- Use separate verification and authorization metrics to investigate latency, then profile storage, policy evaluation, and observer work before attributing a regression.
