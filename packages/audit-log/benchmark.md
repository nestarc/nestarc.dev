---
description: "Measure audit-log 0.8.0 with PostgreSQL package comparisons, calibrated performance budgets, and separate transaction and automatic-tracking baselines."
lastUpdated: 2026-10-26
---

# Benchmark

Measure auditing against the transaction boundary your application will use. Version 0.8.0 adds
PostgreSQL package comparisons and controlled measurement tools alongside the existing local
source harness. Both verify the audit evidence produced by their workloads. New runs require
Node.js `^22.23.4 || ^24.22.1`.

## Compare a candidate with a published package

Run these commands from the [v0.8.0 source checkout](https://github.com/nestarc/nestjs-audit-log/tree/v0.8.0)
with Docker running and npm registry access:

```bash
npm ci
npm run docker:up -- --wait --wait-timeout 60
DATABASE_URL=postgresql://test:test@localhost:5433/audit_test npx prisma generate
BENCH_BASELINE_VERSION=0.7.1 BENCH_WARMUP=50 BENCH_ITERATIONS=500 BENCH_REPEATS=4 \
  DATABASE_URL=postgresql://test:test@localhost:5433/audit_test npm run bench:regression
npm run docker:down
```

The wrapper builds and packs the checkout, installs the candidate and exact registry baseline
into separate temporary consumers with strict peers, and records their integrity. It creates and
removes a unique PostgreSQL schema. Run teardown even after a failure, once no other test is using
the disposable database. `BENCH_BASELINE_VERSION` defaults to `0.7.1`; ranges and tags such as
`latest` are rejected.

The report compares manual small/large metadata workloads at concurrency one and four, plus
automatic create, update, and delete at concurrency one. Keep
`benchmarks/results/package-evidence.json`, `postgresql-manual-regression.json`, and
`postgresql-performance-summary.json` together. The summary preserves paired repeat ratios for
mean, P95, P99, and throughput alongside their median and range.

### Optional calibrated budgets

Without a budget, the performance summary is **advisory**: a successful run confirms correctness
and cleanup without promising a latency threshold. Set `BENCH_BUDGET_PATH` to apply a JSON budget
calibrated for the intended runner, runtime, database, and data shapes. The budget identifies an
exact baseline, minimum repeat/sample counts, and named scenario limits; unselected scenarios
remain advisory. See the [budget schema and commands](https://github.com/nestarc/nestjs-audit-log/blob/v0.8.0/docs/benchmarks.md#performance-summaries-and-optional-budgets).

The offline comparator can evaluate an existing report without repeating database work:

```bash
node scripts/compare-performance.cjs benchmarks/results/postgresql-manual-regression.json \
  --budget /path/to/calibrated-budget.json --output /tmp/audit-budget-result.json
```

Preserve failed results as well as passes. A passing budget covers its named scenarios and
environment; it does not establish production latency or statistical significance.

### Controlled comparisons and recorded validation

For automatic-create investigations, 0.8.0 includes
[a controlled runner](https://github.com/nestarc/nestjs-audit-log/blob/v0.8.0/benchmarks/automatic-create-controlled.cjs),
[a confidence-bound comparator](https://github.com/nestarc/nestjs-audit-log/blob/v0.8.0/scripts/compare-controlled-performance.cjs),
and [a CPU-profile analyzer](https://github.com/nestarc/nestjs-audit-log/blob/v0.8.0/scripts/analyze-benchmark-cpu-profile.cjs).
The controlled protocol uses A/A calibration, independent processes, and crossover of package
assignment, module-loading order, and starting slot. CPU profiles are separate diagnostic evidence.

The [0.8.0 release notes](https://github.com/nestarc/nestjs-audit-log/blob/v0.8.0/docs/releases/0.8.0.md#validation-scope)
record seven local PostgreSQL scenarios that passed for the implementation before the version
bump. The measured candidate still declared 0.7.1 and is identified by its tarball integrity.
Those results do not establish overhead for the published 0.8.0 artifact, SQL Server, or production
workloads. New artifacts and environments need their own measurements.

## Run the local source harness

The [v0.8.0 source harness](https://github.com/nestarc/nestjs-audit-log/blob/v0.8.0/benchmarks/audit-overhead.ts)
runs create, update, and delete separately in four modes:

```bash
npm ci
npm run test:e2e:setup
DATABASE_URL=postgresql://test:test@localhost:5433/audit_test npm run bench
npm run test:e2e:teardown
```

The harness accepts only its disposable local test database. Run it by itself after other tests
finish, and run teardown even if the benchmark fails. Do not tear down a database another test is
using. The default is 30 warmup calls and 300 measured calls per operation and mode; use
`BENCH_WARMUP` and `BENCH_ITERATIONS` to change the counts.

The harness introduced in 0.6.0 replaces the obsolete script that omitted explicit consistency and
the atomic transaction helper. Historical non-atomic latency figures do not establish the cost of
the current atomic path.

## Compare equivalent work

Measure create, update, and delete separately under each relevant mode:

| Mode | Appropriate comparison |
|------|------------------------|
| Base client, no transaction | Baseline for explicit `best-effort` auditing |
| Base client, interactive transaction | Baseline for `atomic-required` auditing |
| `best-effort` | Business write plus independent audit insert; rollback guarantees differ |
| `atomic-required` inside `withAuditTransaction()` | Transaction setup, mutation, audit reads/inserts, and commit |

Record warmup and sample counts, package version, source commit and dirty status, Node/Prisma/adapter
versions, PostgreSQL version, hardware, schema, indexes, connection settings, and database location.
Preserve the raw report. Verify each measured audited write actually created the expected audit row.

Compare atomic timings with an unaudited transaction, rather than attributing all transaction
creation and commit cost to auditing. Report mean, median, P95, and P99 with sample counts, and
repeat runs without selecting only the fastest result. Sequential local latency does not establish
production throughput or performance under concurrent writers, large diffs, remote databases,
retention, or export load.

## Run safely

Use a disposable local database and the setup instructions from the exact source revision being
measured. The current harness cleans up its business fixtures and retains append-only audit rows
for inspection until database teardown. Publish numeric claims only alongside a reproducible
command and its retained raw report. A version printed from a modified checkout is not proof that
the published package produced those results.
