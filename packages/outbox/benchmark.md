---
description: "Historical PostgreSQL measurements for Outbox before 0.3, plus how to measure transaction cost and commit-to-handler latency with polling enabled in 0.4.1."
---

# PostgreSQL Outbox Benchmarks for Emit and Dispatch {#benchmark}

::: info Historical measurements
These measurements predate outbox 0.3 and are not 0.4.1 performance results. They do not measure the new lease heartbeats, fenced transitions, stored retry schedules, or bounded bulk inserts. Benchmark the installed release against your own PostgreSQL workload before using these values for capacity planning.
:::

The fixture times two operations separately. The producer writes an outbox event inside a transaction. The poller then claims committed work and invokes a handler. The historical dispatch timing starts with a manual poll, so it excludes the wait for a scheduled poll.

## What We Measure

| Benchmark | Description |
|-----------|-------------|
| **A) INSERT — no outbox (baseline)** | Raw `$transaction` with a single `INSERT INTO outbox_events` |
| **B) emit() — single event** | `OutboxEmitter.emit()` in a transaction (includes `toPayload()` + `JSON.stringify` + INSERT) |
| **C) emitMany() — 10 events** | `OutboxEmitter.emitMany()` with 10 events in a single transaction |
| **D) Poll-to-dispatch — single event** | End-to-end: PENDING → poller fetches → handler called |
| **E) Poller throughput — 100 events** | Time for one `poll()` cycle to process a full batch of 100 events |

## Test Setup

- **NestJS:** Test app with `@nestjs/testing`
- **PostgreSQL:** Docker `postgres`, localhost
- **Iterations:** 200 per scenario (configurable)
- **Warmup:** 20 iterations (discarded)
- **Historical poller harness:** `polling.enabled: false`, manually called via `poller.poll()`. A 0.4.1 Nest module rejects this configuration during initialization; it is not a current application setup.

## Running Locally

The commands below describe the historical source benchmark harness. For current capacity planning, use the [0.4.1 source](https://github.com/nestarc/outbox/tree/v0.4.1), Node 22/24, and a workload that includes required periodic polling, claim heartbeats, and your actual callbacks. Do not copy the historical Node 20 or polling-disabled setup into an application.

```bash
# Start PostgreSQL
docker compose up -d

# Run with defaults (200 iterations, 20 warmup)
DATABASE_URL=postgresql://test:test@localhost:5433/outbox_test \
  npx ts-node bench/outbox.bench.ts

# Custom iterations
DATABASE_URL=... npx ts-node bench/outbox.bench.ts --iterations 500 --warmup 50
```

## Results

> Measured on macOS, Node.js 20, PostgreSQL 16 (Docker), localhost. Your results will vary.

| Benchmark | Avg | P50 | P95 | P99 |
|-----------|-----|-----|-----|-----|
| A) INSERT — no outbox (baseline) | 0.85ms | 0.78ms | 1.21ms | 1.52ms |
| B) emit() — single event in transaction | 0.91ms | 0.84ms | 1.28ms | 1.61ms |
| C) emitMany() — 10 events in transaction | 3.15ms | 2.98ms | 4.12ms | 5.03ms |
| D) Poll-to-dispatch — single event latency | 1.42ms | 1.31ms | 2.05ms | 2.68ms |
| E) Poller throughput — 100 events batch | 38.5ms | 36.2ms | 48.1ms | 55.3ms |

## Interpretation

Single-event `emit()` averaged 0.91ms against 0.85ms for the raw INSERT. The 0.06ms difference covers the full emitter path. The fixture did not time `toPayload()` or `JSON.stringify` separately.

The 10-event transaction averaged 3.15ms, or about 0.31ms per event at that batch size. That run used a separate INSERT per event. Outbox 0.3 introduced prevalidation and chunked bulk inserts.

In the single-event test, a manual poll took 1.42ms on average to claim the event and invoke the handler. Scenario D reports the combined duration of those steps.

The 100-event poll cycle averaged 38.5ms, equivalent to about 2,600 events per second while that cycle was running.

| Metric | Value |
|--------|-------|
| Emit overhead per event (B - A) | ~0.06ms |
| emitMany per-event cost (C / 10) | ~0.31ms |
| Poll-to-dispatch single event | ~1.42ms |
| Batch throughput (100 events) | ~2,600 events/sec |

## Methodology

- `performance.now()` for sub-millisecond timing
- Unique event IDs prevent key collisions across runs
- Table truncated between scenarios
- Poller called manually (`poll()`) to isolate measurement from scheduling jitter
- Each scenario runs sequentially (no concurrent interference)

## Measuring a 0.4.1 deployment

To measure the cost on the request path, time the same business transaction with and without an outbox write. Keep payload size and database placement fixed. Measure single-event and bulk writes separately.

For delivery latency, keep [periodic polling enabled](./how-it-works#event-lifecycle). Record when the business transaction commits and when the handler starts for the same event ID. Report the polling interval, batch size, number of pollers, and whether PostgreSQL notifications wake them early. For sustained throughput, count events reaching `SENT` during a fixed interval with your actual handler or publisher and a backlog that keeps the pollers busy.
