---
description: "Performance benchmarks for @nestarc/audit-log — CUD tracking overhead, before/after diff calculation, and audit log insertion latency."
---

# Benchmark

Measures the overhead added by the audit extension for create, update, and delete operations.

::: warning Historical best-effort baseline
These results were collected with the pre-0.4 best-effort execution path. They do not measure
`atomic-required`, row locking, or `withAuditTransaction()`, and should not be used to size a 0.4
atomic deployment. The benchmark harness in the v0.4.0 tag also predates the now-required
`consistency` option; updated atomic measurements are pending.
:::

## What We Measure

| Benchmark | Description |
|-----------|-------------|
| **A) create — no audit** | Baseline Prisma `create()` without extension |
| **B) create — with audit** | `create()` + audit log INSERT (after-only changes) |
| **C) update — with audit + diff** | `update()` + before/after diff calculation + audit log INSERT |
| **D) delete — with audit** | `delete()` + before-only changes + audit log INSERT |

The update benchmark (C) is the most expensive because the extension must:
1. Fetch the existing record (before state)
2. Execute the update
3. Compute the diff between before and after
4. INSERT the audit log entry

## Test Setup

- **Database:** PostgreSQL 16 (Docker, port 5433)
- **Data:** Fresh rows per benchmark (300 iterations each)
- **Warmup:** 30 iterations (discarded)
- **Tracked model:** `User` with `password` as sensitive field

## Running Locally

The v0.4.0 benchmark source cannot be run unchanged because it omits the required `consistency`
option and executes writes outside `withAuditTransaction()`. Treat the numbers below as historical
until the upstream harness publishes separate `best-effort` and `atomic-required` scenarios.

## Results

> Measured on Apple Silicon, PostgreSQL 16, Prisma 7.9.1, local Docker. Your results will vary.

| Benchmark | Avg | P50 | P95 | P99 |
|-----------|-----|-----|-----|-----|
| A) create — no audit (baseline) | 0.70ms | 0.62ms | 0.98ms | 1.57ms |
| B) create — with audit | 1.80ms | 1.73ms | 2.48ms | 3.43ms |
| C) update — with audit + diff | 2.11ms | 2.05ms | 2.82ms | 3.28ms |
| D) delete — with audit | 1.52ms | 1.49ms | 1.98ms | 2.57ms |

**Create overhead:** +1.10ms
**Update is the slowest** at 2.11ms due to the additional `findFirst` (before state) + diff computation.

## Interpretation

The audit extension adds about **1.1ms** to create operations in this run. This is the cost of the additional `INSERT INTO audit_logs` plus (for updates) a `findFirst` to capture the before state and compute the diff.

In absolute terms, the slowest measured operation (update with diff) completed in **2.11ms**. Benchmark your own schema, indexes, and workload before using this result for capacity planning.

Bulk behavior depends on consistency mode. `atomic-required` rejects `createMany` and `updateMany`
before mutation because they cannot provide record-level evidence; use sequential writes inside
`withAuditTransaction()`. `best-effort` writes a count-level summary. Atomic `deleteMany` records
individual rows up to `maxBatchRecords`, while best-effort summary overflow requires an explicit
`batchOverflow: 'summary'` choice.

## Methodology

- `performance.now()` for millisecond-precision timing
- `AuditContext.run()` wraps each operation with actor context (matches real usage)
- Append-only rules are temporarily dropped for cleanup between benchmarks
- Sensitive field masking (`password` → `[REDACTED]`) is active during measurement
- Historical measurements use the non-atomic behavior that v0.4 names `best-effort`
