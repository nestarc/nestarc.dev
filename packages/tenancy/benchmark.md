---
description: "Reproduce Prisma tenancy-extension benchmarks against an equivalent PostgreSQL RLS transaction and retain environment metadata and raw samples."
---

# Benchmark

Measure the Prisma tenancy extension against a manual RLS transaction that returns the same tenant-scoped rows. A measurement of the full database path does not establish zero AsyncLocalStorage overhead.

## Comparison

| Scenario | Purpose |
|-----------|-------------|
| Admin direct `findMany` | All rows, RLS bypassed; contextual reference only |
| Admin tenant-filtered `findMany` | Same returned row count, RLS bypassed |
| Manual RLS transaction | `app_user` with transaction-local `set_config()` and RLS |
| Tenancy extension `findMany` | Same role, policies, and row count as the manual transaction |
| Tenancy extension `findFirst` | Single-row reference path |

For tenant-scoped model operations, the default extension opens a batch transaction and runs `SELECT set_config($1, $2, true)` before the operation. Raw SQL, shared models, and `withoutTenant()` are outside that automatic wrapper. Compare extension `findMany` minus manual RLS transaction timings; an unfiltered admin query is not an equivalent baseline.

## Reproduce and retain evidence

Use the package repository's [benchmark procedure](https://github.com/nestarc/nestjs-tenancy/blob/v0.16.1/benchmarks/README.md). The evidence-output options below are available in the 0.16.1 source release; use that tag or a reviewed newer checkout.

```bash
# In a package source checkout, with DATABASE_URL and APP_DATABASE_URL
# pointing only to a disposable fixture database:
docker compose up -d --wait
npm run bench -- --allow-fixture-reset --output benchmarks/results/local-run.json
```

The explicit reset flag authorizes the benchmark fixture to reset its tables; never target an application database. Defaults are 50 warmup iterations and 500 measured iterations, with 1,005 rows across three tenants. The script's procedure documents overrides.

Keep the JSON artifact with its measurement time, source commit and dirty state, source hashes, Node/PostgreSQL/Prisma versions, raw timing samples, returned row counts, and computed comparison deltas. This makes a result reviewable against the exact source and database setup used.

## Evidence status

Earlier documentation included a local Apple M1 Pro / Prisma 7.9.1 timing table. Its raw samples and immutable run provenance were not retained with this repository. The table is omitted from the current guide because readers cannot independently inspect that run; this is not evidence that the historical numbers were fabricated.

A [reference run from 2026-09-10](https://github.com/nestarc/nestjs-tenancy/blob/v0.16.1/benchmarks/results/2026-09-10-documentation-remediation.json) retains the raw samples and records the then-uncommitted source with hashes. It demonstrates the evidence format; it is not a production performance guarantee. Measure with your schema, indexes, connection pool, and tenant distribution. Small differences can be run-to-run noise, and an average alone does not characterize tail latency.

## Methodology

- `performance.now()` measures wall-clock time for each operation.
- Warmup iterations are discarded; measured samples are retained.
- Percentiles use sorted timing samples, with no outlier removal.
- Manual and extension paths use the same `app_user`, RLS policies, and returned row count.
- Admin reference paths deliberately bypass RLS and are identified separately.
