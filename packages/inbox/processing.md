---
title: "Deduplication and Transaction Boundaries"
description: "Handle duplicate webhooks and broker redelivery with stable inbox identities, acknowledgment after acceptance, and atomic Prisma handler transactions."
---

# Inbox Deduplication and Processing

Inbox 0.1.0 separates **durable acceptance** from **business processing**. Your transport consumer authenticates and accepts a message; the worker later applies its database effects. This distinction determines when an HTTP response, broker ACK, offset commit, or message deletion is safe.

## Accept before acknowledging

After [registering a handler](./installation), an application-owned transport consumer calls:

```typescript
const receipt = await inbox.accept({
  scope: { kind: 'tenant', id: verifiedTenantId },
  source: 'orders-service',
  consumer: 'orders.projection.v1',
  messageId: event.id,
  eventType: 'order.created',
  schemaVersion: 1,
  payload: { orderId: event.orderId },
});
// The transport can now acknowledge its delivery.
```

`accept()` resolves after its own transaction commits and returns `{ kind: 'accepted' | 'duplicate', id, status }`.

| Acceptance result | Transport behavior |
| --- | --- |
| `accepted` | A new durable receipt exists. Acknowledge the delivery and let Inbox own processing retries. |
| `duplicate` | The retained identity already exists. Acknowledge without resetting its state or retry budget. |
| Storage failure or uncertain commit result | Do not acknowledge success. Redeliver the same identity so Inbox can reconcile a possible committed receipt. |
| Authentication failure, invalid input, or identity/content conflict | Apply an explicit rejection or transport dead-letter policy; avoid an endless immediate retry loop. |

A duplicate may refer to `PENDING`, `PROCESSING`, `RETRYABLE`, `COMPLETED`, or `DEAD`. It is not a successful business result. DEAD records need [operator recovery](./operations#inspect-and-requeue-dead-messages).

Inbox does not return HTTP responses, connect to brokers, or acknowledge deliveries itself. Verify signed webhook requests using the original raw bytes before deriving the trusted tenant and calling `accept()`. The [versioned integration examples](https://github.com/nestarc/inbox/blob/v0.1.0/examples/README.md) cover RabbitMQ ACKs, Kafka offsets, SQS-compatible deletion, BullMQ completion, and signed webhook responses.

## Keep message identity stable

The unique identity is the tuple **scope + source + consumer + message ID**.

| Identity component | Meaning |
| --- | --- |
| `scope` | `{ kind: 'tenant', id }` or an intentional `{ kind: 'global' }`. Derive tenant IDs from authenticated application context. |
| `source` | Stable producer or upstream-system identity. |
| `consumer` | Stable logical effect, such as `orders.projection.v1`. Renaming it permits another processing operation. |
| `messageId` | The producer's event ID, reused unchanged on every redelivery. |

Do not use a broker delivery tag, attempt counter, or fresh random UUID for each delivery. Distinct event IDs remain distinct Inbox identities even when they describe the same business action. Keep application unique constraints for business invariants such as one order projection per tenant and order.

The content fingerprint covers the event type, event schema version, and canonical JSON payload. Object key order does not affect it; array order does. Trace headers, correlation ID, and causation ID are metadata and do not participate. Put values that change business decisions in the payload.

Reusing an identity with different content throws `InboxConflictError` (`IDENTITY_CONFLICT`) and preserves the existing record. Payloads must contain supported JSON values. Non-finite numbers, `undefined`, arbitrary class instances, circular references, excessive depth, and oversized values are rejected without silent truncation.

## Keep every handler write in the supplied transaction

An `InboxHandler` receives the transaction as `context.tx`. Inbox adds a completion write guarded by the current claim token, then commits both together:

```typescript
async handle(payload, context) {
  if (context.scope.kind !== 'tenant') throw new InboxPermanentError();
  await context.tx.orderProjection.create({
    data: { tenantId: context.scope.id, orderId: payload.orderId },
  });
}
```

This is the handler body from the [complete installation example](./installation). Let transaction errors escape. A second Prisma client, an independent nested transaction, another database, or an external API call does not participate in Inbox's atomic commit.

Worker crashes and retries can invoke the handler more than once. A stale claim cannot commit its handler writes; completion and those writes roll back together. The guarantee is one committed database outcome per retained message identity, not one handler invocation or exactly-once external delivery. Message ordering is not guaranteed.

`context.signal` supports cooperative cancellation. Transaction and callback deadlines bound work even if the handler ignores the signal, but cancellation cannot undo an external side effect. Keep network work outside the handler transaction.

## Combine inbox and outbox

Use an [outbox](/packages/outbox/) when a handler must publish an event after its database change. Inject the application's configured `OutboxEmitter` when constructing the handler, and emit through the same `context.tx`:

```typescript
await outbox.emit(context.tx, new OrderProjectedEvent(payload.orderId), {
  tenantId: context.scope.kind === 'tenant' ? context.scope.id : undefined,
  ...(context.scope.kind === 'global'
    ? { tenantScope: 'global' as const }
    : {}),
  causationId: context.messageId,
});
```

Here `outbox` is the injected emitter and `OrderProjectedEvent` is an application-defined outbox event. Apply the outbox schema and registration as described in its [installation guide](/packages/outbox/installation). The [runnable outbox integration](https://github.com/nestarc/inbox/blob/v0.1.0/examples/README.md) supplies the full application wiring.

Business writes, the outgoing event row, and Inbox completion commit or roll back together. The outbox publisher later delivers at least once, so preserve a stable event ID for the next consumer's inbox or equivalent deduplication boundary.

## Separate ingress from worker ownership

An ingress-only module can declare `consumers: ['orders.projection.v1']` without handlers and leave the worker disabled. A worker deployment registers handlers, enables `worker.enabled`, and can restrict ownership with `worker.consumers`.

Claims, lease recovery, and exhausted-attempt handling stay inside that ownership list. Missing handlers for configured worker consumers and duplicate handler registrations fail startup. Unsupported event types or schemas for a registered consumer become DEAD. If no deployed worker owns a consumer, its backlog remains pending; monitor its age before removing a deployment.

For HTTP response caching alongside Inbox, see [Idempotency](/packages/idempotency/). For typed job scheduling and Redis-backed execution, see [Jobs](/packages/jobs/). Their storage lifetimes and execution contracts do not replace the retained Inbox identity.

Continue with [retries and recovery](./operations) or the [API reference](/api/inbox/). These contracts follow the [0.1.0 usage guide](https://github.com/nestarc/inbox/blob/v0.1.0/docs/usage.md).
