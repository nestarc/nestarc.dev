---
description: "Performance benchmarks for @nestarc/jobs — enqueue overhead, end-to-end latency, and weighted tenant-fairness correctness."
---

# Benchmark

::: info Historical measurements
These results predate jobs 0.4 and do not measure its bounded pool, portable JSON validation, activation reconciliation, or terminal retention. Re-run the installed release with your handler mix; prior dispatch ratios are not a guarantee of CPU-time shares.
:::

Measures queue overhead and, more importantly, **validates the weighted tenant-fairness claim** with a direct correctness check. The benchmark asserts that dispatch ratios across three tenants with weights 3:2:1 match the ideal ratio within ±10%.

## What We Measure

| Benchmark | Description |
|-----------|-------------|
| **A) Baseline: direct async function call** | The floor you're replacing — no queue at all |
| **B) `enqueue()` — no drain** | Per-call cost of handing a job to the backend |
| **C) `enqueue` + `drain`, 1 job — end-to-end latency** | Single-job latency from enqueue to handler completion |
| **D) Throughput: 5000 jobs, 1 tenant (FIFO)** | Single-queue drain cost — exposes `Array.shift()` O(N) |
| **E) Throughput: 5000 jobs, 100 tenants equal weight** | Partitioned workload — shows fair scheduler at scale |
| **F) Fairness correctness: 3 tenants at weights 3:2:1** | Dispatch ratios must match weight ratios within ±10% |

## Key Assertion: Weighted Fairness Correctness

The benchmark enqueues 2000 jobs each for tenants `a`, `b`, `c` with weights 3, 2, 1. It then samples the **first 3000 dispatches** — the contested window where all three tenants have work to pick. The observed ratios must land within ±10% of the ideal:

- Expected: `a = 0.500`, `b = 0.333`, `c = 0.167`
- If any tenant's observed ratio deviates more than ±10% from its expected ratio, the bench exits 1

This validates the **central claim of the package**: paying customers at higher weights actually get proportionally more worker slots. If the scheduler drifts, this test catches it — not a property assertion from the README, but a measured runtime behavior.

## Test Setup

- **Backend:** `FakeJobsService` wrapping `InMemoryBackend` (single-process, no Redis)
- **Iterations:** 10,000 per latency scenario
- **Warmup:** 1000 iterations
- **Throughput jobs:** 5000 per workload
- **Fairness jobs:** 6000 (2000 per tenant)
- **Fairness tolerance:** ±10%
- **Redis:** Not required — bench isolates library overhead from transport I/O

## Running Locally

```bash
cd jobs
npm install
npm run bench
# Custom scale
npx ts-node bench/jobs.bench.ts --iterations 20000 --throughput-jobs 10000
```

## Results

> Measured on Windows 11, Node.js 24, Intel Core i7-10750H. Your results will vary.

### Per-call latency

| Benchmark | Avg | P50 | P95 | P99 |
|-----------|-----|-----|-----|-----|
| A) Baseline: direct async call | 0.3µs | 0.2µs | 0.4µs | 0.7µs |
| B) `enqueue()` — no drain | 2.0µs | 1.6µs | 2.6µs | 11.0µs |
| C) `enqueue` + `drain`, 1 job | **6.0µs** | 3.4µs | 5.6µs | 17.2µs |

### Throughput

| Scenario | Total time | Jobs/sec |
|----------|-----------|----------|
| D) 5000 jobs, 1 tenant | 82.9ms | ~60,000 |
| E) 5000 jobs, 100 tenants | 21.1ms | ~237,000 |

### Fairness correctness

| Tenant | Weight | Expected ratio | Observed ratio | Deviation |
|--------|--------|----------------|----------------|-----------|
| a | 3 | 0.500 | 0.500 | 0.0% |
| b | 2 | 0.333 | 0.333 | 0.0% |
| c | 1 | 0.167 | 0.167 | 0.2% |

**Worst deviation: 0.2%** (tolerance: ±10%) — ✓ **PASS**

### Derived numbers

- **Queue enqueue overhead (B − A):** ~1.7µs
- **End-to-end overhead (C − A):** ~5.7µs
- **E vs D:** Partitioned workload is ~4× faster on total throughput than a single queue of the same size

## Interpretation

**Per-call overhead is low.** `enqueue()` adds ~1.7µs over a direct async call — that's the cost of serializing context into the job payload, inserting into the backend, and updating scheduler state. In this historical run, end-to-end enqueue, dispatch, and handler invocation averaged 6.0µs, with a 3.4µs P50. These values do not include the 0.4 changes listed above.

**The single-tenant sample was slower.** D processed 5,000 queued jobs at about 60K jobs/sec. The published scheduler uses `Array.shift()`, but this historical benchmark does not isolate its cost from other work or establish a current throughput ceiling. Measure your actual workload before changing queue design and preserve real tenant identities.

**The partitioned sample completed sooner.** E processed 5,000 jobs across 100 tenant queues of about 50 each in 21ms, or approximately 237K jobs/sec. This comparison describes the recorded fixture, not every multi-tenant workload.

**Weighted fairness is measurably correct.** The observed 3:2:1 dispatch ratios land within 0.2% of the ideal — the scheduler is implementing weighted round-robin faithfully, not just approximately. Weights influence eligible dispatch opportunities; pool, tenant, and type caps plus handler duration affect actual throughput.

## Production Notes

- In-memory numbers are the **library floor** — BullMQ adds Redis round-trips (~0.1-1ms per operation). For Redis-backed workloads, dominant cost shifts to network I/O.
- In-memory fairness is **process-local**. If you run multiple replicas, each has its own scheduler. BullMQ has no package-level tenant fairness; stable tenant-to-queue mapping alone does not implement a distributed weighted scheduler.
- Include realistic backlog sizes, handler durations, and tenant distributions when measuring the current release.
