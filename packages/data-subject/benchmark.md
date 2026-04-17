---
description: "Performance benchmarks for @nestarc/data-subject — DSR processing time, policy-complexity impact, and conservative mixed-strategy correctness."
---

# Benchmark

Measures the time to process export and erase requests at realistic row counts (1000 rows per entity), and validates the package's "conservative mixed strategy" claim — when an entity mixes `delete`, `anonymize`, and `retain`, the benchmark asserts that retained fields are correctly preserved with their legal basis.

## What We Measure

| Benchmark | Description |
|-----------|-------------|
| **A) Baseline: raw executor read 1000 rows** | What `export` would cost without the library |
| **B) `compilePolicy()` — 1 entity, 5 fields** | Boot-time cost (one-off per entity) |
| **C) `export()` — 5 entities × 200 rows (ZIP)** | Realistic DSR export: read + JSON + ZIP for 1000 total rows |
| **D) `erase()` — delete-row, 1 entity × 1000 rows** | Simplest case — remove rows wholesale |
| **E) `erase()` — delete-fields, 1 entity × 1000 rows** | Field-level null updates on all rows |
| **F) `erase()` — mixed (delete + anonymize + retain), 1 × 1000** | Complex case — conservative downgrade semantics |

## Key Assertion: Mixed-Strategy Correctness

When an entity mixes `retain` with delete/anonymize, the erase execution is **intentionally conservative**: the row is kept, retained fields survive, delete fields are downgraded to field-level nulls. The benchmark verifies that on scenario F:

1. `stats.entities[0].strategy === 'mixed'`
2. `stats.retained` lists both `customerName` and `amount` with `legalBasis: 'tax:KR-basic-law-sec85'` and `count: 1000`

If either assertion fails, the bench exits 1. This means the performance numbers always come with a correctness guarantee — you're not measuring a broken erase.

## Test Setup

- **Executor:** Custom in-memory executor that re-seeds 1000 rows per iteration so every run sees the full workload
- **Storage:** `InMemoryRequestStorage` + `InMemoryArtifactStorage` (ships with the package)
- **Iterations:** 100 per scenario (configurable)
- **Warmup:** 10 iterations (discarded)
- **Rows per entity:** 1000 (configurable via `--rows`)
- **PostgreSQL:** Not required — bench isolates library overhead from DB I/O

## Running Locally

```bash
cd data-subject
npm install
npm run bench
# Custom scale
npx ts-node bench/data-subject.bench.ts --iterations 500 --rows 5000
```

## Results

> Measured on Windows 11, Node.js 24, Intel Core i7-10750H. Your results will vary by CPU, Node version, and `jszip` behavior.

| Benchmark | Avg | P50 | P95 | P99 |
|-----------|-----|-----|-----|-----|
| A) Raw executor.select() 1000 rows | 16µs | 13µs | 37µs | 58µs |
| B) `compilePolicy()` 5 fields | 2µs | 2µs | 4µs | 11µs |
| C) `export()` 5 × 200 rows (ZIP) | **5.58ms** | 5.14ms | 6.08ms | 17.58ms |
| D) `erase()` delete-row 1000 rows | **478µs** | 292µs | 449µs | 16.30ms |
| E) `erase()` delete-fields 1000 rows | 595µs | 343µs | 572µs | 22.04ms |
| F) `erase()` mixed 1000 rows | 683µs | 343µs | 486µs | 17.44ms |

### Derived numbers

- **Export throughput:** ~179,000 rows/sec (includes JSON + ZIP encoding)
- **Erase throughput (delete-row):** ~2.1M rows/sec
- **Mixed vs delete-row:** 43% slower (as expected — mixed must downgrade + anonymize)
- **Mixed correctness:** ✓ PASS — `stats.retained` = [customerName, amount] × 1000 rows each

## Interpretation

**Export is dominated by ZIP compression.** The ~5.6ms average for 1000 rows across 5 entities is mostly `jszip` serialization cost — raw row reads are 16µs (scenario A). For larger exports, the archive cost scales with total bytes, not row count; at ~180K rows/sec you'll hit filesystem or S3 bandwidth long before the library's CPU cost matters.

**Erase delete-row is effectively free.** At 473µs for 1000 rows, the library adds ~0.5µs per row of orchestration over the raw `deleteMany` call you'd make yourself. In production with PostgreSQL, the `deleteMany` query itself will dominate — the library overhead disappears.

**Mixed strategy has real but bounded cost.** F runs 43% slower than D because every row goes through a per-field inspection to determine delete/anonymize/retain treatment, and `stats.retained` is accumulated. The `stats.retained` output is what makes the package auditable — you get a record of every field retained and why, which is what compliance reviewers ask for.

**Policy compilation is a one-time cost.** At 2µs per entity it's invisible; even a registry with 100 entities compiles in 200µs during module boot.

## Production Notes

- Numbers above reflect **library overhead only** — with Prisma + PostgreSQL, expect the dominant cost to be the `findMany` / `updateMany` / `deleteMany` queries. For 1000-row scales those are typically 10-50ms, so the library overhead is <5% of wall time.
- Export's ZIP cost is linear in total bytes, not rows. If your rows average 1KB each, 1000 rows is 1MB pre-compression — ZIP handles that in milliseconds.
- If you implement a custom `EntityExecutor`, it's the dominant cost. The bench's in-memory executor is fast specifically so the numbers reflect the library, not the adapter.
