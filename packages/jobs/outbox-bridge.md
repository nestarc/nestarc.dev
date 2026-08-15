---
description: "Use JobsOutboxBridge with an application-provided OutboxSource, or connect @nestarc/outbox through a handler/publisher that preserves event identity and correlation."
---

# Outbox Bridge

`JobsOutboxBridge` subscribes to an **application-provided** outbox-like source and enqueues mapped job types. It keeps request handlers side-effect-free, but it is a generic port rather than a bundled adapter for `@nestarc/outbox`.

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

::: warning Direct package pairing is not included
`@nestarc/outbox` 0.2 exposes `@OnOutboxEvent()`, `OutboxPublisher`, and `OutboxRecord`; it does not expose the `OutboxSource.onEvent()` port above. `JobsOutboxBridge` also has no field for the outbox record ID or correlation metadata, so it cannot by itself establish a deterministic BullMQ job ID across an outbox retry.

Use the direct handler below, write an `OutboxPublisher`, or supply and test your own `OutboxSource` adapter. Do not pass an undefined placeholder called `outboxSource` and assume the packages are wired.
:::

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

Events not in `map` are ignored. That behavior is appropriate only when the source deliberately contains unrelated events; a reliability-critical mapping should fail closed when a required event type is missing.

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
- Shared/system events that use an explicitly defined pseudo-tenant (`'system'`, `'shared'`) in the in-memory fairness scheduler.

The current BullMQ backend is FIFO and does not implement package-level tenant fairness, so remapping a tenant does not create weighted isolation on that backend.

## Pairing with `@nestarc/outbox` 0.2

For the smallest current integration, register an outbox handler whose only side effect is a durable job enqueue:

```ts
import { Injectable } from '@nestjs/common';
import { JobsService } from '@nestarc/jobs';
import { OnOutboxEvent, OutboxHandlerContext } from '@nestarc/outbox';
import { OrderAcceptedOutboxEvent } from './order-events';

@Injectable()
export class OrderOutboxRelay {
  constructor(private readonly jobs: JobsService) {}

  @OnOutboxEvent(OrderAcceptedOutboxEvent)
  async enqueue(
    payload: { orderId: string },
    context: OutboxHandlerContext,
  ): Promise<void> {
    if (!context.tenantId) throw new Error('outbox_tenant_missing');

    await this.jobs.enqueue(
      'publishOrderWebhook',
      {
        orderId: payload.orderId,
        outboxEventId: context.eventId,
        correlationId: context.record.correlationId ?? context.eventId,
      },
      {
        idempotencyKey: context.eventId,
        context: { tenantId: context.tenantId },
        attempts: 5,
      },
    );
  }
}
```

This preserves the important crash-window identity: if BullMQ accepts the job and the process stops before outbox marks the record `SENT`, the retry uses the same outbox UUID as the BullMQ job ID.

For a transport-wide integration, implement `OutboxPublisher.publish(record)` and register outbox with `delivery: { mode: 'publisher' }`. The publisher receives the full `OutboxRecord`, but its Nest module must import a module that exports `JobsService` so dependency injection can construct the transport.

The complete pattern is:

1. A domain write + `outbox.emit(...)` happen in the same transaction.
2. The outbox poller invokes the direct handler or application publisher.
3. That adapter enqueues a durable job with the outbox record ID as its idempotency key.
4. A `@JobHandler(jobType)` runs the actual side effect with the tenant restored.

This gives you transactional guarantees on the **write** step without forcing heavy work into the request path. It remains at-least-once: every job handler and external receiver must be idempotent.

See the [Async Delivery Reference Workflow](/guide/async-delivery-workflow) for the full outbox → BullMQ → tenant webhook failure contract.
