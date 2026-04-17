---
description: "JobsOutboxBridge — subscribe to an outbox source and fan events out as jobs, with optional tenant remapping."
---

# Outbox Bridge

`JobsOutboxBridge` subscribes to an outbox-like source and enqueues mapped job types. It's the glue between `@nestarc/outbox` (domain events) and `@nestarc/jobs` (background execution) — it lets you keep handlers small and side-effect-free in request handlers, then process the real work asynchronously under tenant-fair scheduling.

## Basic mapping

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

Events not in `map` are ignored — you can start with one or two mappings and grow.

## Overriding the tenant

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
- Shared/system events that should run under a pseudo-tenant (`'system'`, `'shared'`) so they don't compete with customer-owned work under real tenant weights.

## Pairing with `@nestarc/outbox`

The bridge does not care about the transport — it treats the outbox as a subscribable source. With `@nestarc/outbox` the pattern is:

1. A domain write + `outbox.emit(...)` happen in the same transaction.
2. The outbox poller publishes the event.
3. The bridge maps it to a job type and enqueues under the tenant.
4. A `@JobHandler(jobType)` runs the actual side effect with the tenant restored.

This gives you transactional guarantees on the **write** step without forcing heavy work (sending webhooks, processing exports, generating reports) to happen inside the request path.
