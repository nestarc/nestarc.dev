---
description: "Deliver audit entries durably with AuditStreamRunner, persistent PostgreSQL checkpoints, idempotent sinks, bounded retries, DLQ handling, and retention guards."
lastUpdated: 2026-08-21
---

# Durable Streams

`AuditStreamRunner` turns the forward `scan()` API into a host-scheduled durable tailer. It delivers
committed audit rows sequentially with at-least-once semantics. The package does not launch a
background scheduler or elect a worker, and it does not prevent overlapping `runOnce()` calls;
invoke it from cron, BullMQ, or another scheduler that enforces one active run per stream. Retry
backoff and HTTP sink timeouts can use short-lived timers within that run.

## Create the durable store

The PostgreSQL adapter persists both stream progress and terminal dead letters:

```typescript
import {
  applyAuditStreamStoreSchema,
  PostgresAuditStreamStore,
} from '@nestarc/audit-log';
import { Prisma } from './generated/prisma/client';

const prismaModule = { Prisma };

await applyAuditStreamStoreSchema(migrationPrisma, {
  checkpointTable: 'audit.audit_log_stream_checkpoints',
  deadLetterTable: 'audit.audit_log_stream_dead_letters',
});

const streamStore = new PostgresAuditStreamStore({
  prisma: streamStatePrisma,
  prismaModule,
  checkpointTable: 'audit.audit_log_stream_checkpoints',
  deadLetterTable: 'audit.audit_log_stream_dead_letters',
});
```

Use `getAuditStreamStoreStatements()` to put the same DDL in a reviewed production migration. The
default tables are `audit_log_stream_checkpoints` and `audit_log_stream_dead_letters`; custom names
must match between schema setup and the store. You can instead implement
`AuditStreamCheckpointStore` and `AuditStreamDeadLetterStore` for another durable backend.
Give the scheduled worker only the narrowly scoped state-table privileges its store needs; do not
reuse an audit-table owner or general migration credential.

The checkpoint row stores:

- `checkpoint`: the last batch acknowledged by its sink or durably written to the DLQ.
- `highWatermark`: the fixed upper bound of the in-progress scan.

It does not store the scan's tenant scope, filters, or batch size. Keep `scan` configuration
immutable for a `streamId` while a high-watermark is in progress—preferably for the full lifetime of
that stream—so a resumed run preserves its selection and deterministic batch IDs. Use a new
`streamId` when that configuration must change.

The DLQ table has a unique `(stream_id, batch_id)` key, so repeating the same terminal write is
idempotent.

## Configure and schedule a runner

```typescript
import {
  AuditStreamRunner,
  HttpAuditStreamSink,
} from '@nestarc/audit-log';

const runner = new AuditStreamRunner(auditService, {
  streamId: 'tenant-1-primary-siem',
  scan: {
    tenantId: 'tenant-1', // or an authorized allTenants: true
    action: 'invoice.*',
    batchSize: 500,
  },
  sink: new HttpAuditStreamSink({
    url: process.env.SIEM_URL!,
    format: 'ndjson',
    headers: {
      authorization: `Bearer ${process.env.SIEM_TOKEN}`,
    },
    timeoutMs: 15_000,
  }),
  checkpointStore: streamStore,
  deadLetterStore: streamStore,
  maxRetries: 5,
  initialBackoffMs: 250,
  maxBackoffMs: 30_000,
  redact: (entry) => ({
    ...entry,
    metadata: redactForSiem(entry.metadata),
  }),
  onMetric: (metric) => metrics.record(metric),
  onError: (error, context) => logger.error({ error, context }),
});

const result = await runner.runOnce({ signal: shutdownController.signal });
logger.info({ result }, 'audit stream run complete');
```

Each run fixes one high-watermark and stops when it reaches that boundary. After a completed run, a
later `runOnce()` starts a new bounded scan; after a failed run, it resumes the saved boundary. Run
only one active worker for a `streamId`; overlapping calls can redeliver. Use a scheduler lock or
single-worker queue when multiple application instances can start the job.

`runOnce()` returns `status`, delivered and dead-lettered entry counts, batch count, and the last
checkpoint. An empty bounded run returns `status: 'idle'`. `status: 'delivered'` means at least one
batch was processed, even if every entry went to the DLQ; inspect both counters. A delivery failure
that cannot be durably dead-lettered rejects the `runOnce()` promise instead of returning a failure
status.

Export scope is always explicit. The runner's `scan` configuration type omits `after`, `until`, and
`signal`; the runner supplies those from persistent state and the current invocation.
`runOnce({ signal })` stops at runner/scan boundaries and interrupts retry backoff. It does not abort
an already in-flight Prisma query or sink delivery, because the sink interface does not receive that
signal; configure `HttpAuditStreamSink.timeoutMs` (or equivalent custom-sink timeouts) to bound it.

## Delivery and checkpoint order

For every bounded run, the runner:

1. Loads the last ACK checkpoint and any in-progress high-watermark.
2. Persists a new high-watermark before its first external delivery.
3. Redacts a clone of each entry and delivers one page at a time.
4. Saves the page checkpoint only after a sink ACK or idempotent terminal DLQ write.
5. Clears the completed high-watermark so the next invocation can scan newer rows.

The deterministic batch ID is `firstEntryId:lastEntryId`. `HttpAuditStreamSink` sends it as the
`Idempotency-Key` header. If the sink succeeds but checkpoint persistence fails, the next run sends
the same entry IDs again. Deduplicate by batch ID or, for finer control, by immutable audit entry ID.

::: warning At-least-once, not exactly-once
Checkpoint state and a remote side effect do not share a transaction. Stable IDs make duplicate
detection possible, but the receiving system must implement it.
:::

The runner calls the redactor on a cloned entry and rejects a result that changes the entry ID.
Use this hook for destination-specific minimization; keep storage-time redaction enabled as the
primary control.

## Sink choices

| Sink | Contract | Operational note |
|------|----------|------------------|
| `HttpAuditStreamSink` | Generic JSON envelope or NDJSON; deterministic `Idempotency-Key` | Configure auth and `timeoutMs`; receiver must deduplicate |
| `ObjectStorageAuditStreamSink` | Deterministic NDJSON object key and conditional create | Adapt a provider client to `putObject()` and map already-exists errors |
| `DatadogAuditStreamSink` | Datadog HTTP Logs array | At most 1,000 entries per request; keep `batchSize <= 1000` |
| `SplunkAuditStreamSink` | Newline-delimited HEC event envelopes | Supply the deployment-specific HEC URL and token |

The object-storage adapter requests `If-None-Match: *` semantics. Its `isAlreadyExists` callback
must recognize the provider's conditional-create conflict so a batch created before a checkpoint
failure counts as already acknowledged.

Provider sinks accept explicit endpoints; region, tenancy, credential rotation, and network policy
remain host responsibilities.

## Retries and terminal failures

The defaults are three retries after the initial attempt, 250 ms initial exponential backoff, and a
30-second maximum backoff. `maxRetries: 0` makes one attempt. For `HttpAuditStreamSink`:

- Network errors, timeouts, HTTP 408, 425, 429, and 5xx responses are retryable.
- `Retry-After` is honored when valid, capped by `maxBackoffMs`.
- Other 4xx responses are terminal.
- A response body included in an error is truncated to 1,024 characters.

A custom sink can throw `AuditStreamDeliveryError` with `terminal: true` for a permanent failure.
Other thrown values are treated as retryable. When retries are exhausted, the run fails and leaves
the checkpoint unchanged; the next scheduled run tries that batch again.

On a terminal failure, a configured DLQ store is written before the checkpoint advances. Without a
DLQ store, the run fails and does not advance. The PostgreSQL DLQ stores the entries and error
metadata but does not provide an automatic replay UI: alert operators, diagnose the permanent
failure, and replay or archive the stored batch through an explicitly controlled runbook. If the
DLQ write itself fails, the checkpoint also remains unchanged.

## Observability

`onMetric` receives `batch_delivered`, `batch_retried`, `batch_dead_lettered`, and `run_failed`.
`onError` receives the delivery phase, stream and batch IDs, attempt, and terminal flag. Exceptions
from either hook are ignored so telemetry cannot change delivery or checkpoint semantics.

Alert on repeated retries, any DLQ write, a non-advancing checkpoint, and distance between the
checkpoint and current audit volume. Do not put full audit entries, sink credentials, or unredacted
metadata in logs or metric labels.

## Retention interlock

Required streams must ACK entries before retention removes them. Load every required state and pass
its non-null checkpoint to `prune()`:

```typescript
if (requiredStates.some((state) => !state?.checkpoint)) {
  throw new Error('retention blocked: a required audit stream has no ACK checkpoint');
}

await auditService.prune({
  olderThan: cutoff,
  client: maintenancePrisma,
  requiredCheckpoints: requiredStates.map((state) => state!.checkpoint!),
});
```

The library rejects a cutoff ahead of any supplied checkpoint. Your host must block retention when
a required stream has no checkpoint and must supply the complete required-stream set. See
[Retention & Partitioning](./retention#protect-required-stream-checkpoints) for the full policy.
