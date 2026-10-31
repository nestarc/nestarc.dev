---
description: "Connect @nestarc/outbox to jobs with the first-party publisher, stable event identity, tenant and correlation lineage, or use the legacy generic source bridge."
---

# Outbox Integration

These examples pair **Jobs 0.4.2 with Outbox 0.4.1**. Jobs accepts Outbox `^0.2.1 || ^0.3.0 || ^0.4.0`; 0.4.1 supplies the public drain API used below. The shared combination supports Node 22/24 and NestJS 10/11. Install the versions explicitly:

```bash
npm install @nestarc/jobs@0.4.2 @nestarc/outbox@0.4.1
```

Use `createOutboxJobsPublisher()` as the first-party `@nestarc/outbox` publisher transport. Publishing resolves only after the job enqueue succeeds, so mapping and enqueue failures remain retryable by the outbox poller instead of marking the record sent.

```ts
import { OutboxModule } from '@nestarc/outbox';
import { createOutboxJobsPublisher } from '@nestarc/jobs';
import { PrismaService } from './prisma.service';

const JobsPublisher = createOutboxJobsPublisher({
  map: {
    'invoice.issued': { job: 'invoice.process' },
    'system.reindex_requested': {
      job: 'system.reindex',
      tenant: 'optional',
    },
  },
});

OutboxModule.forRoot({
  prisma: PrismaService,
  transport: JobsPublisher,
  polling: { enabled: true },
  delivery: { mode: 'publisher' },
});
```

Register `JobsModule` in the application so the publisher can inject `JobsService`. In the compact `forRoot()` example above, `PrismaService` is a class reference and must be exported by a `@Global()` module. If your Prisma module is not global, use `OutboxModule.forRootAsync()` with explicit `imports`, `inject`, and a factory that returns the resolved Prisma instance instead.

Outbox 0.4 requires periodic polling even when LISTEN/NOTIFY is enabled. Every
process registering `OutboxModule` must keep polling enabled and provide its
publisher dependencies. An API-only process can register `OutboxEmitter` directly
with its Prisma client, retry settings and tenant policy, then emit through the
business transaction without registering an Outbox worker. See the
[complete workflow](/guide/async-delivery-workflow#_4-register-durable-workers).

## Coordinated shutdown

```ts
import { OutboxPoller } from '@nestarc/outbox';

async function closeDeliveryApplication() {
  await app.get(OutboxPoller).stop({ timeoutMs: 30_000 });
  await app.close(); // Jobs closes only after the source publisher settles.
}
```

Use a single application-owned signal handler for this sequence, not an additional
`app.enableShutdownHooks()` signal-close path. Nest starts Jobs teardown before
Outbox's automatic shutdown hook, so registering both modules alone does not order
them. Stop waits for the publisher, heartbeat and fenced DB completion, drops
queued polls and releases claims acquired during stop without consuming retries.

The default stop deadline is 30 seconds. `OUTBOX_SHUTDOWN_INCOMPLETE` means work
remains active: keep Jobs and Prisma open and retry `stop()` after settlement.
Timeout does not cancel callbacks. Concurrent calls are safe, but stop is permanent;
start a new application to resume polling. Disconnect application-owned clients
only after `app.close()` succeeds. Use bounded callback/network timeouts and a
process-manager termination grace for callbacks that never settle.

The published pair passed strict packed PostgreSQL 16/Redis 7.2 consumers on
Node 22/24 × Nest 10.4.22/11.2.1 with Prisma 7.10.0: transaction rollback, process
loss after enqueue, retry deduplication, tenant isolation, correlation/causation,
active drain, timeout/retry and restart. See the
[Jobs release verification](https://github.com/nestarc/jobs/actions/runs/41201334069).
Exact Outbox 0.2.1 and 0.3.0 consumer gates remain; their releases do not expose this
stop API.

## Publisher contract

For every mapped outbox record, the adapter:

- maps one source event to one job
- uses the outbox record ID as both `jobId` and `idempotencyKey`; mapping options cannot override either value
- forwards the source payload unchanged unless the target defines `payload(record)`
- requires a tenant by default; system/global events must explicitly set `tenant: 'optional'`
- preserves `outboxEventId`, tenant ID, `correlationId` (falling back to the event ID), and optional `causationId` in context and metadata
- includes available aggregate, partition, header, occurrence-time, and source idempotency fields in metadata
- treats inherited map properties as unmapped rather than accepting names such as `constructor` or `__proto__`

Unmapped events fail by default. Set `unmapped: 'ignore'` only when acknowledging an unrelated event without creating a job is intentionally terminal:

```ts
const JobsPublisher = createOutboxJobsPublisher({
  unmapped: 'ignore',
  map: {
    'report.ready': {
      job: 'sendReport',
      payload: (record) => ({ reportId: record.aggregateId }),
      options: (record) => ({
        attempts: 5,
        backoff: { type: 'exponential', delayMs: 1_000, maxDelayMs: 60_000 },
        dedupe: {
          key: `report:${record.aggregateId ?? record.id}`,
          scope: 'tenant',
          mode: 'until_completed',
        },
      }),
    },
  },
});
```

Mapping-level `until_completed` dedupe remains effective even though the publisher supplies the explicit outbox record ID. Any mapping, tenant-resolution, or enqueue error rejects `publish()` so the outbox delivery policy can retry it.

::: warning Delivery boundary
The integration is at-least-once. Stable identity suppresses duplicate enqueue, but it does not guarantee exactly-once handler execution or external side effects. Keep handlers idempotent, and retain terminal BullMQ job records for at least the outbox retry and operator-recovery horizon.
:::

## Legacy generic bridge

`JobsOutboxBridge` remains available for compatibility with application-provided sources that expose `OutboxSource.onEvent()`. It is not the `@nestarc/outbox` publisher transport and does not carry the first-party adapter's full record identity and lineage contract.

```ts
interface OutboxSource {
  onEvent(
    callback: (event: {
      type: string;
      payload: Record<string, unknown>;
      tenantId: string;
    }) => Promise<void>,
  ): void;
}
```

### Basic mapping

```ts
import { JobsOutboxBridge } from '@nestarc/jobs';

new JobsOutboxBridge({
  jobs,
  source: outboxSource,
  map: {
    'data_subject.erasure_requested': 'handleErasure',
    'webhook.delivery_due': 'deliverWebhook',
  },
});
```

The bridge:

1. Subscribes to the outbox source.
2. Filters events to those in `map`.
3. Calls `jobs.enqueue(mappedJobType, event.payload, { context: { tenantId: event.tenantId } })`.

Events not in `map` are ignored. That behavior is appropriate only when the source deliberately contains unrelated events; a reliability-critical mapping should fail closed when a required event type is missing.

### Overriding the tenant

By default the bridge forwards `event.tenantId` as-is. Override it with `tenantFrom` when you need to namespace or synthesize it:

```ts
new JobsOutboxBridge({
  jobs,
  source: outboxSource,
  map: { 'report.ready': 'sendReport' },
  tenantFrom: (event) => `tenant:${event.tenantId}`,
});
```

Common reasons to override:

- Multi-product accounts where the outbox tenant and the jobs tenant aren't the same identifier.
- Shared/system events that use an explicitly defined pseudo-tenant (`'system'`, `'shared'`) in the in-memory fairness scheduler.

The BullMQ backend is FIFO and does not implement package-level tenant fairness, so remapping a tenant does not create weighted isolation on that backend.

## End-to-end flow

The complete pattern is:

1. A domain write + `outbox.emit(...)` happen in the same transaction.
2. The outbox poller invokes the first-party jobs publisher.
3. The publisher enqueues a job with the outbox record ID as both its public job ID and idempotency key. The job is durable only when `JobsService` uses the BullMQ backend; the in-memory backend remains process-local.
4. A `@JobHandler(jobType)` runs the actual side effect with the tenant restored.

This gives you transactional guarantees on the **write** step without forcing heavy work into the request path. Processing remains at-least-once: every job handler and external receiver must be idempotent.

See the [Async Delivery Reference Workflow](/guide/async-delivery-workflow) for the full outbox → BullMQ → tenant webhook failure contract.

## 0.4 source identity and operations

The first-party mapper uses tenant-scoped dedupe by default when source tenant context exists. Choose `scope: 'global'` explicitly only for an intentional cross-tenant suppression rule. Generic JobsService defaults are unchanged. Reserved context and metadata are reconstructed from a source snapshot; callback mutation cannot replace canonical identity or leave stale lineage for absent source fields.

`JobsOutboxBridge` is deprecated because the generic source has no canonical event ID or lineage fencing. Use `createOutboxJobsPublisher()` for first-party Outbox. Jobs 0.4.2 supports the optional peer `^0.2.1 || ^0.3.0 || ^0.4.0`.

Outbox `SENT` means enqueue/dedupe was acknowledged; Jobs status tracks handler completion separately. Stop source dispatch and settle publisher callbacks before Jobs closes. Configure terminal retention no shorter than the source's complete retry/manual-recovery horizon. [Migration and cleanup](./backends#upgrading-to-0-4).
