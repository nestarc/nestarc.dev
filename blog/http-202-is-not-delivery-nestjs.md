---
title: "HTTP 202 Is Not Delivery: Tracking Async Workflows in NestJS"
date: 2026-08-19
description: "What HTTP 202 Accepted proves—and does not prove—in a NestJS workflow spanning Prisma, a transactional outbox, BullMQ, and outbound webhooks."
author: nestarc
reviewed: 2026-08-19
versionScope: "@nestarc/idempotency 0.4.x, @nestarc/outbox 0.2.x, @nestarc/jobs 0.3.x, @nestarc/webhook 0.13.x, Node 20/22/24, NestJS 10/11, Prisma 6, and BullMQ ^5.74.1"
---

# HTTP 202 Is Not Delivery: Tracking Async Workflows in NestJS

Your NestJS endpoint returned `202 Accepted`. The client saw a success response. Ten minutes later, the customer says the webhook never arrived.

What actually succeeded?

According to [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-202-accepted), `202` means that a request was accepted for processing, but processing has not completed. It does not prove that a database transaction committed, a job ran, or a remote system applied a side effect.

Use `202` only when the requested operation itself remains incomplete. This article treats downstream delivery as part of the endpoint contract. If creating the order completes the requested action and the webhook is merely an incidental side effect, return `201 Created` for the order instead.

An application can define a stronger local contract. In the workflow below, the API returns `202` only after the order and its outbox event commit in one PostgreSQL transaction:

```text
POST /orders
  -> Order + outbox event commit
  -> Outbox record is published to BullMQ
  -> Job creates a webhook event and any matching tenant delivery rows
  -> Webhook worker sends the signed HTTP request
  -> Receiver commits its own side effect
```

That contract makes `202` useful, but it still does not make `202` mean "delivered."

::: warning Preview integration
`@nestarc/idempotency`, `@nestarc/outbox`, and `@nestarc/jobs` are Preview releases. Pin the exact versions resolved by your lockfile, run the crash-window tests below against those artifacts, and review their changelogs before upgrading. This article explains the intended failure contract; it is not a blanket production certification for every workload.
:::

## Return an Operation, Not "Done"

RFC 9110 recommends that a `202` representation describe the request's current status and point to a status monitor. In NestJS, keep that contract application-owned and explicit:

```typescript
@Post()
@HttpCode(HttpStatus.ACCEPTED)
async createOrder(@Body() dto: CreateOrderDto) {
  const order = await this.orders.accept(dto);

  return {
    operationId: order.id,
    status: 'accepted',
    statusUrl: `/operations/orders/${order.id}`,
  };
}
```

The tenant-authorized status endpoint should return the last state it verified, not predict the final outcome. `Location` and `Retry-After` headers can supplement this representation, but neither is required by the `202` status code itself.

## One Workflow, Four Success States

Each boundary proves a different fact. Read the workflow forward, but start an investigation from the last durable state you can verify:

| Last durable state | What is proven in this workflow | If progress stops, inspect next |
|---|---|---|
| HTTP `202` under this endpoint contract | The handler returned after the order and outbox row committed | Outbox status, poller health, and retry budget |
| Outbox `SENT` | BullMQ accepted the deterministic job ID | Registered queue, job state, and handler result |
| Job `succeeded` | The webhook event and any matching delivery rows committed | Endpoint subscriptions, then delivery attempts |
| Webhook delivery `SENT` | The endpoint returned 2xx | Receiver dedupe record and business transaction |

The delivery-row set can be empty when no active endpoint matches the event type. Do not collapse these states into one `completed` boolean.

## Gap 1: The Database and Queue Cannot Commit Together

The most common implementation writes business data and then enqueues work:

```typescript
const order = await prisma.order.create({ data: dto });

await queue.add('publishOrderWebhook', {
  orderId: order.id,
});
```

These are two writes to two systems. If PostgreSQL commits and the Redis call fails, the order exists but no job does. Moving `queue.add()` inside `prisma.$transaction()` does not fix it: Prisma cannot include a Redis write in the database transaction. Redis might accept the job and the database transaction might still roll back, producing work for an order that does not exist.

A transactional outbox stores the business change and an event in the same database transaction:

```typescript
// Resolve these from authenticated/request context, never from dto.
const tenantId = this.tenantContext.requireTenantId();
const correlationId = this.requestContext.requireCorrelationId();

await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({
    data: {
      tenantId,
      totalCents: dto.totalCents,
    },
  });

  await outbox.emit(
    tx,
    new OrderAcceptedOutboxEvent(order.id, order.totalCents),
    {
      tenantId,
      aggregateType: 'Order',
      aggregateId: order.id,
      correlationId,
    },
  );
});
```

Now the order and event either both commit or both roll back. A poller can retry the durable outbox row after the request ends. The outbox closes the lost-event gap, but it does not create exactly-once delivery.

See [How the Transactional Outbox Works](/packages/outbox/how-it-works) for the full lifecycle, including `SKIP LOCKED`, retry, and stale-record recovery.

## Gap 2: An Outbox Makes the Event Recoverable, Not Duplicate-Free

Consider the next crash window:

1. The outbox poller publishes an event to BullMQ.
2. Redis accepts the job.
3. The process stops before the outbox row is marked `SENT`.
4. Stale-event recovery returns the row to the publish path.

The safe response is to publish again. If every attempt generates a new job ID, that recovery creates duplicate work.

`@nestarc/jobs` 0.3 suppresses duplicate enqueue in this window, while the BullMQ identity is retained, by using the outbox record UUID as both the BullMQ `jobId` and idempotency key. `createOutboxJobsPublisher()` also carries that UUID as `outboxEventId` in job context and metadata. The identity path is explicit:

```text
outbox record UUID
  -> BullMQ jobId and enqueue idempotency key
  -> job context.outboxEventId
  -> webhook publish idempotency key

webhook event UUID
  -> signed webhook-id received by the customer endpoint
```

When the outbox retries the same record, BullMQ resolves the same identity instead of creating unrelated work. Keep completed and failed BullMQ records at least as long as the outbox retry and operator-recovery window; deleting the identity too early makes a later enqueue possible again.

See [Jobs Outbox Integration](/packages/jobs/outbox-bridge) for the publisher mapping and context-lineage contract.

## Gap 3: A Successful Job Is Not a Delivered Webhook

The same failure shape appears at the next boundary. A job handler can commit webhook event and delivery rows, then stop before BullMQ records success. BullMQ may run the handler again during retry or stalled-job recovery even though its database side effect already happened.

The handler should therefore reuse the outbox event ID as the webhook publish key:

```typescript
if (
  !context.tenantId ||
  !context.outboxEventId ||
  !context.correlationId
) {
  throw new Error('webhook_job_lineage_missing');
}

await webhooks.sendToTenant(
  context.tenantId,
  new OrderAcceptedWebhookEvent(payload.orderId, payload.totalCents),
  {
    idempotencyKey: context.outboxEventId,
    correlationId: context.correlationId,
  },
);
```

The built-in Prisma webhook repository atomically deduplicates on tenant, event type, and idempotency key, returning the existing event instead of creating a second fan-out. A custom repository must implement `saveEventOnceInTransaction()` before callers use `idempotencyKey`; otherwise publishing fails closed. This makes a job retry safe, but the final HTTP request is still at-least-once.

If the receiver commits its side effect and its `2xx` response is lost, the webhook worker cannot know that the first attempt succeeded. It treats the outcome as ambiguous and retries while attempts remain; after the configured budget is exhausted, the delivery becomes `FAILED`. Before trusting any delivery ID, the receiver must verify the signature over the raw body and enforce a finite timestamp window. It can then store the signed `webhook-id` under a unique constraint in the same transaction as its business side effect, returning `2xx` for an already committed ID. Retain that dedupe row beyond the maximum authorized retry and replay window—and permanently when repeating the side effect would be irreversible.

See [Sending Webhook Events](/packages/webhook/sending-events) for tenant-scoped idempotent publishing and [Webhook Security](/packages/webhook/security) for receiver verification and replay resistance.

## Stable Identity and Correlation Are Different

Several identifiers travel through this workflow, but they are not interchangeable:

- The HTTP idempotency key handles concurrent duplicate commands and response replay; a database unique command key also guards the commit-before-response window.
- The outbox record UUID is the durable event identity and becomes the downstream job identity.
- The webhook ID lets the receiver deduplicate repeated HTTP delivery attempts.
- The correlation ID groups related evidence for investigation; it does not prevent duplicate work.

Do not turn a correlation ID into a universal dedupe key. Give each boundary an authoritative identity, and preserve the lineage between them.

## Exactly-Once Is the Wrong Promise

The complete workflow is at-least-once. That is not a defect; it is the honest contract for work crossing PostgreSQL, Redis, a worker, and an external HTTP endpoint.

The useful guarantee is smaller and testable:

- Business data and the outbox event commit atomically.
- Re-publishing one outbox record resolves to one stable job identity.
- Re-running the job does not create a second webhook fan-out.
- Re-delivering the webhook does not repeat the receiver's side effect.

Bounded retries give transient failures another chance. Stable identity makes those retries safe.

## Missing Evidence Is Not the Same as Failure

Suppose a status page last shows outbox `SENT`, but its evidence connection stopped updating five minutes ago. That is not enough information to declare the job failed: the job might be stuck, or the status page might simply be stale.

A status view should distinguish:

- **Terminal failure reported** — a local system recorded `FAILED`.
- **No later evidence observed** — the next state might not have happened, or its evidence might be delayed or missing.

Show the last successful evidence sync beside event time, then check the queue or delivery log as the system of record. Monitoring must stay off the customer-work critical path; a broken status connection must not delay or fail an order.

## Test the Crash Windows

A happy-path test is not enough. At the database boundary, force the order transaction to roll back and assert that neither the order nor outbox row exists. At the external boundary, let a receiver commit, drop its first `2xx`, and assert that the repeated `webhook-id` does not repeat the side effect.

Those two tests exercise the ambiguity at opposite ends of the workflow. The [complete async delivery verification checklist](/guide/async-delivery-workflow#_9-verify-the-workflow) also covers duplicate outbox publishes, repeated job handlers, retry budgets, and tenant isolation.

## Next Steps

- [Async Delivery Reference Workflow](/guide/async-delivery-workflow) — complete NestJS, Prisma, BullMQ, and webhook integration
- [Why Your NestJS Idempotency Implementation Is Probably Broken](/blog/nestjs-idempotency-implementation-broken) — protect the inbound request boundary
