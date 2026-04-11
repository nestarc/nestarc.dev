---
description: "Performance benchmarks for @nestarc/outbox — emit overhead, poll-to-dispatch latency, and poller throughput."
---

# Benchmark

Measures the overhead added by `OutboxEmitter.emit()` and the end-to-end latency from emit to handler invocation.

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
- **Poller:** `polling.enabled: false`, manually called via `poller.poll()`

## Running Locally

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

**Emit overhead is negligible.** A single `emit()` (B) adds ~0.06ms over the baseline INSERT (A) — the cost of `toPayload()` serialization and `JSON.stringify`. This is the overhead the business code pays per event.

**`emitMany()` scales linearly.** 10 events (C) take ~3.15ms, or ~0.31ms per event. Each event is a separate `INSERT` within the same transaction.

**Poll-to-dispatch latency is dominated by the UPDATE query.** The poller's `UPDATE ... RETURNING` query with `FOR UPDATE SKIP LOCKED` accounts for most of the ~1.42ms in (D). Handler invocation itself is sub-microsecond in this benchmark.

**Throughput scales well.** Processing 100 events in a single poll cycle (E) takes ~38.5ms, yielding ~2,600 events/sec. Real throughput depends on handler complexity and database latency.

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
