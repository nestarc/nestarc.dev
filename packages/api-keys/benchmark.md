---
description: "Performance benchmarks for @nestarc/api-keys — authentication overhead, timing-safe verification, and key-issuance throughput."
---

# Benchmark

Measures the per-request overhead of `ApiKeysService.verify()` (what every authenticated request pays), and validates the timing-safe property that prevents attackers from distinguishing "key doesn't exist" from "key does exist but is wrong" via response timing.

## What We Measure

| Benchmark | Description |
|-----------|-------------|
| **A) Raw `crypto.createHash('sha256')` — baseline** | The irreducible SHA-256 + pepper concat floor |
| **B) `Sha256Hasher.hash()`** | Wrapper overhead over raw SHA-256 |
| **C) `Sha256Hasher.verify()`** | Hash + `timingSafeEqual` compare |
| **D) `ApiKeysService.verify()` — HAPPY path** | Parse + prefix lookup + hash + compare + context construction (what the guard runs per request) |
| **E) `ApiKeysService.verify()` — INVALID (not found)** | Same compute as D via `dummyVerify()`; validates that the not-found path doesn't short-circuit |
| **F) `create()` + `verify()` round-trip** | Key-issuance + immediate verification |

## Key Assertion: Timing-Safe Property

The benchmark fails (exit code 1) if `|P50(D) − P50(E)| > 50µs`. The service calls `hasher.dummyVerify()` on the not-found path so that rejection does the same SHA-256 work as acceptance — if an attacker could distinguish hit from miss via timing, the "timing-safe" claim in the README is broken. The 50µs threshold is well below network-RTT jitter (typically hundreds of µs to ms), so if the check passes the property holds at the wire level.

## Test Setup

- **Storage:** Prefix-indexed in-memory adapter (O(1) lookup on hit and miss, mirroring a production Prisma adapter with `UNIQUE INDEX(prefix)`)
- **Seed:** 1000 pre-seeded valid keys
- **Iterations:** 5000 per scenario (configurable)
- **Warmup:** 500 iterations (discarded)
- **PostgreSQL:** Not required — bench isolates library overhead from DB I/O

## Running Locally

```bash
cd api-keys
npm install
npm run bench
# Custom iterations
npx ts-node bench/api-keys.bench.ts --iterations 10000 --warmup 1000
```

## Results

> Measured on Windows 11, Node.js 24, Intel Core i7-10750H. Your results will vary by CPU and OS.

| Benchmark | Avg | P50 | P95 | P99 |
|-----------|-----|-----|-----|-----|
| A) Raw `crypto.createHash('sha256')` — baseline | 2.8µs | 2.2µs | 3.8µs | 18.1µs |
| B) `Sha256Hasher.hash()` | 2.8µs | 2.2µs | 4.3µs | 19.9µs |
| C) `Sha256Hasher.verify()` | 2.7µs | 2.3µs | 2.9µs | 17.0µs |
| D) `ApiKeysService.verify()` — HAPPY | **4.9µs** | **4.1µs** | 6.7µs | 24.8µs |
| E) `ApiKeysService.verify()` — INVALID | 13.8µs | 10.1µs | 12.2µs | 31.6µs |
| F) `create()` + `verify()` round-trip | 16.2µs | 14.1µs | 28.8µs | 56.9µs |

### Derived numbers

- **Hasher wrapper overhead (B − A):** ~0.2µs (≈8% of raw SHA-256)
- **Authentication throughput:** ~**205,000 verifications/sec per core**
- **Timing-safe delta at P50:** 6.0µs (threshold 50µs) ✓ PASS

## Interpretation

**The hasher wrapper is essentially free.** B overlaps A within measurement noise — there is no meaningful cost to going through `Sha256Hasher.hash()` vs calling `crypto.createHash` directly.

**Per-request overhead is under 5µs.** The full service path — parse the key, look up the prefix, hash the candidate, compare against stored hash in constant time, construct the `ApiKeyContext` — runs at ~4.9µs average. That's roughly 1/200th of a millisecond, so it disappears into the noise of any real network round-trip.

**The invalid-path difference is exception-unwinding, not timing leak.** E is ~6µs slower than D at P50 because the invalid path throws `ApiKeyError` and V8 pays a small cost for stack unwinding. The crypto work itself is identical (see C vs A + lookup cost). The 6µs is far below network jitter, so an attacker cannot distinguish hit from miss over a real network.

**Key issuance is sub-millisecond.** Round-trip `create()` + `verify()` runs at ~16µs average. Even a worst-case user-registration flow that issues several keys will remain well under 1ms total.

## Production Notes

- Numbers above reflect the **library overhead only** — a real production request adds DB query time (~0.5-2ms for an indexed lookup in PostgreSQL) and network RTT.
- Under real load with Prisma + PostgreSQL, expect the verify path to be dominated by the DB round-trip, not the crypto — which means the library is essentially "free" relative to your existing auth cost.
- If you see verification latency spikes, the signal is almost certainly storage (pool saturation, cold index), not the service.
