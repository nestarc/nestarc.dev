---
description: "Performance benchmarks for @nestarc/audit-log — CUD tracking overhead, before/after diff calculation, and audit log insertion latency."
---

# Benchmark

Measures the overhead added by the audit extension for create, update, and delete operations.

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

```bash
# Start PostgreSQL
docker compose -f test/e2e/docker-compose.yml up -d

# Run benchmark
DATABASE_URL=postgresql://test:test@localhost:5433/audit_test \
  npx ts-node benchmarks/audit-overhead.ts
```

## Results

> Measured on Apple M-series, PostgreSQL 16, local Docker. Your results will vary.

| Benchmark | Avg | P50 | P95 | P99 |
|-----------|-----|-----|-----|-----|
| A) create — no audit (baseline) | 0.40ms | 0.40ms | 0.52ms | 0.57ms |
| B) create — with audit | 1.44ms | 1.37ms | 1.84ms | 3.11ms |
| C) update — with audit + diff | 2.06ms | 2.01ms | 2.54ms | 2.85ms |
| D) delete — with audit | 1.71ms | 1.57ms | 2.09ms | 3.91ms |

**Create overhead:** +1.04ms (+260%)
**Update is the slowest** at 2.06ms due to the additional `findFirst` (before state) + diff computation.

## Interpretation

The audit extension adds **~1ms** per write operation. This is the cost of the additional `INSERT INTO audit_logs` plus (for updates) a `findFirst` to capture the before state and compute the diff.

In absolute terms, even the slowest operation (update with diff) completes in **2ms** — well under the threshold for any API endpoint. For most CRUD APIs where writes are infrequent compared to reads, this is negligible.

For bulk operations (`createMany` with 100+ records), the extension logs each record individually, so consider using `noAudit` context for batch imports and adding a single manual audit log entry instead.

## Methodology

- `performance.now()` for millisecond-precision timing
- `AuditContext.run()` wraps each operation with actor context (matches real usage)
- Append-only rules are temporarily dropped for cleanup between benchmarks
- Sensitive field masking (`password` → `[REDACTED]`) is active during measurement
