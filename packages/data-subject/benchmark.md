---
description: "Reproduce the @nestarc/data-subject 0.3.0 in-memory benchmarks for verified erasure, signed previews, ZIP exports, and paged handlers."
---

# Benchmark

The **0.3.0** benchmark measures in-memory execution and checks the resulting data, tenant boundaries, and artifacts on every iteration. It covers immediate service calls and the paged privacy handler. These are library microbenchmarks; use database integration tests and production-like workloads to assess deployment performance.

## Run the Release Benchmark

The benchmark lives in the source repository. Check out the release tag so the fixture and package implementation match:

```bash
git clone --branch v0.3.0 --depth 1 https://github.com/nestarc/data-subject.git
cd data-subject
npm ci
npm run bench:check
npm run bench:smoke
npm run bench -- --iterations 100 --warmup 10 --rows 1000 --batch-size 128
```

`bench:check` type-checks the fixtures. `bench:smoke` runs every scenario with one measured iteration, no warmup, seven rows, and a batch size of three; it checks correctness, not statistically useful timing.

| Option | Default | Meaning |
| --- | --- | --- |
| `--iterations` | `100` | Positive integer; measured iterations per scenario |
| `--warmup` | `10` | Nonnegative integer; checked but excluded from timing statistics |
| `--rows` | `1000` | Positive integer; exact total target rows in each data scenario |
| `--batch-size` | `128` | Integer from 1 to 1000; applies to paged handler scenarios |

## Scenarios

| Scenario | Measured operation |
| --- | --- |
| A | Raw tenant- and subject-scoped executor read |
| B | `compilePolicy()` for one entity with five fields |
| C | Allowlisted ZIP export across five entities, sharing the exact total row count, including any remainder |
| D | Verified erasure with `delete-row` |
| E | Verified erasure with `delete-fields` |
| F | Verified mixed `delete`, `anonymize`, and `retain` erasure |
| G | Signed, read-only erasure preview |
| H | Verified erasure using a signed preview prepared before timing |
| I | DateTime, Decimal, and BigInt replacement verification with synthetic scalar conversion |
| Paged export | Allowlisted NDJSON export through `createPagedPrivacyHandler()` |
| Paged erase | Verified mixed erasure through `createPagedPrivacyHandler()` |

## What the Timer Includes

Each warmup and measured iteration starts with fresh fixtures. Fixture seeding, entity registration, schema validation, and post-run assertions are outside the timer. The timed operation includes fixture reads and writes, the library's verification, artifact creation, and the immediate erasure fixture's snapshot copying for its local transaction. Scenario H excludes preview preparation; scenario G measures it separately.

The harness reports average, P50, P95, and P99 latency, plus rows per second for data scenarios. Percentiles use the nearest-rank method over measured iterations only. Record the release tag, Node version, hardware, options, and complete output when comparing repeated runs. The suite does not enforce timing thresholds or relative speed rankings.

## Correctness Checks

Every warmup and measured iteration must pass its assertions. A failure exits nonzero.

- Immediate erasure checks actual deleted or updated rows, preserved retained values, stable-identity verification, v2 evidence, and artifact hashes. The mixed fixture retains `amount` and `balance`, with counts matching the target rows.
- Export checks the allowlisted ZIP contents, total row count, serialized values, and artifact hash. Preview checks its signature, row count, and absence of request or data writes.
- Fixtures include other tenants and subjects to check isolation. Immediate artifact retrieval is also tested against the wrong tenant.
- Paged scenarios check bounded keyset reads, checkpoints, exact row coverage, NDJSON/evidence chunks, per-batch verification, and tenant isolation. Their unbounded executor methods deliberately fail if called.

## Measurement Limits

The fixture includes synthetic executor and instrumentation overhead. It does not time PostgreSQL queue locks, durable database transactions, crash recovery, provider callbacks, or remote storage and network latency. Scalar conversion in scenario I is synthetic, not a Prisma database benchmark.

Paged scenarios run the real handler in a local checkpoint loop. They retain chunks and call traces in memory for assertions, so their timings do not establish streaming memory usage. Per-batch verification also does not imply a whole-job snapshot or rollback guarantee.

No historical timing table is presented as a 0.3.0 result. Run the tagged suite for measurements in your environment and use the [release compatibility guide](https://github.com/nestarc/data-subject/blob/v0.3.0/docs/compatibility.md) for database-backed validation.

Source: [benchmark scenarios](https://github.com/nestarc/data-subject/blob/v0.3.0/bench/data-subject.bench.ts), [measurement harness](https://github.com/nestarc/data-subject/blob/v0.3.0/bench/harness.ts), and [paged fixtures](https://github.com/nestarc/data-subject/blob/v0.3.0/bench/paged-privacy.ts).
