---
description: "Understand audit-log 0.5.0 benchmark limits and compare non-atomic and transaction-first auditing with reproducible local measurements."
---

# Benchmark

No current `atomic-required` benchmark result is published on this page. Historical non-atomic
latency figures do not measure row locking and transaction commit, and do not establish the cost
of the published 0.5.0 atomic path.

## Published source limitation

The [benchmark source at v0.5.0](https://github.com/nestarc/nestjs-audit-log/blob/v0.5.0/benchmarks/audit-overhead.ts)
omits the required `consistency` option and executes writes outside `withAuditTransaction()`.
It cannot be run unchanged against the 0.5.0 API. Development checkouts may include an updated
harness, but those measurements must identify their commit and unreleased changes; they are not
results for the published package merely because `package.json` still says 0.5.0.

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
measured. Inspect that revision's cleanup scope: the tagged v0.5.0 harness clears audit and business
data, while a newer harness may retain audit rows for verification. Run benchmarks after other
tests finish and do not point them at an application database. Publish numeric claims only alongside a reproducible
command and its retained raw report.
