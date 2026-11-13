---
description: "Pre-0.4 NestJS Jobs measurements of in-memory enqueue latency and weighted tenant dispatch, with guidance for testing the 0.4 shared worker pool."
---

# In-Memory Job Queue Benchmarks and Tenant Fairness {#benchmark}

::: info Historical measurements
These results predate jobs 0.4 and do not measure its bounded pool, portable JSON validation, activation reconciliation, or terminal retention. Re-run the installed release with your handler mix; prior dispatch ratios are not a guarantee of CPU-time shares.
:::

The single-process fixture measures enqueue latency and counts how many times the in-memory scheduler picks each tenant while all three have queued work. It also records how long the backend takes to drain the same number of jobs spread across one or 100 tenants.

## What We Measure

| Benchmark | Description |
|-----------|-------------|
| **A) Baseline: direct async function call** | The floor you're replacing — no queue at all |
| **B) `enqueue()` — no drain** | Per-call cost of handing a job to the backend |
| **C) `enqueue` + `drain`, 1 job — end-to-end latency** | Single-job latency from enqueue to handler completion |
| **D) Throughput: 5000 jobs, 1 tenant (FIFO)** | Time to drain one tenant queue |
| **E) Throughput: 5000 jobs, 100 tenants equal weight** | Partitioned workload — shows fair scheduler at scale |
| **F) Fairness correctness: 3 tenants at weights 3:2:1** | Dispatch ratios must match weight ratios within ±10% |

## Key Assertion: Weighted Fairness Correctness

The benchmark enqueues 2000 jobs each for tenants `a`, `b`, `c` with weights 3, 2, 1. It then samples the **first 3000 dispatches** — the contested window where all three tenants have work to pick. The observed ratios must land within ±10% of the ideal:

- Expected: `a = 0.500`, `b = 0.333`, `c = 0.167`
- If any tenant's observed ratio deviates more than ±10% from its expected ratio, the bench exits 1

Count picks within this window. Once the fixture drains all 6,000 jobs, every tenant has exactly 2,000 completions regardless of dispatch order. Worker occupancy and CPU time depend on how long each picked job runs.

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

In this run, `enqueue()` averaged 1.7µs more than the direct async call. Enqueue, dispatch, and handler invocation together averaged 6.0µs, with a 3.4µs P50.

**The single-tenant sample was slower.** D processed 5,000 queued jobs at about 60K jobs/sec. The published scheduler uses `Array.shift()`, but this historical benchmark does not isolate its cost from other work or establish a current throughput ceiling. Measure your actual workload before changing queue design and preserve real tenant identities.

**The partitioned sample completed sooner.** E processed 5,000 jobs across 100 tenant queues of about 50 each in 21ms, or approximately 237K jobs/sec. This comparison describes the recorded fixture, not every multi-tenant workload.

The largest observed deviation from the expected 3:2:1 dispatch shares was 0.2% in the first 3,000 picks. For a 0.4 run, record the [pool, tenant, and job-type caps](./tenant-fairness#shared-worker-pool-in-0-4) alongside the weights. A tenant at its concurrency cap must wait for an active handler to settle before it is eligible for another dispatch.

## Production Notes

- Benchmark BullMQ separately with the Redis connection and worker count used by your deployment. Record enqueue latency at the producer and time to handler start at the worker.
- In-memory fairness is **process-local**. If you run multiple replicas, each has its own scheduler. BullMQ has no package-level tenant fairness; stable tenant-to-queue mapping alone does not implement a distributed weighted scheduler.
- Include realistic backlog sizes, handler durations, and tenant distributions when measuring the current release.
