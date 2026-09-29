---
description: "Measure audit-log 0.7.0 with separate direct, transaction, best-effort, and atomic-required baselines using the reproducible benchmark harness."
lastUpdated: 2026-09-29
---

# Benchmark

Measure auditing against the transaction boundary your application will use. The 0.7.0 benchmark
harness runs create, update, and delete separately in four modes and checks the audit rows produced
by each scenario. This page does not claim a measured overhead for the published 0.7.0 package.

## Run the current harness

Use the [v0.7.0 benchmark source](https://github.com/nestarc/nestjs-audit-log/blob/v0.7.0/benchmarks/audit-overhead.ts)
from a checkout of that tag, with a supported Node.js version and Docker running:

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
