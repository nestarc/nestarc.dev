---
title: "NestJS Webhook Idempotency with a Transactional Inbox"
date: 2026-10-29
description: "Prevent duplicate webhook database writes in NestJS with a transactional inbox. Follow Prisma and PostgreSQL setup, retry handling, and integration tests."
author: nestarc
reviewed: 2026-10-29
versionScope: "@nestarc/inbox 0.2.0, SQL schema v2, NestJS ^11.2.8, Prisma ^7.10.1, PostgreSQL; Node.js >=22.12.0"
---

# NestJS Webhook Idempotency with a Transactional Inbox {#handle-duplicate-webhooks-in-nestjs-with-a-transactional-inbox}

Webhook idempotency means that receiving the same event again does not repeat its committed business effect. In NestJS, a **transactional inbox** can provide this boundary by storing an event's identity in PostgreSQL and committing its Prisma database writes together with a completion record.

Consider a webhook handler that saves an order, then loses the connection before the sender receives its success response. The sender retries. Your application must recognize an already committed change while still allowing unfinished work to recover.

This tutorial uses `@nestarc/inbox` to build that receiver with your existing Prisma client. You will accept one event, process it in a worker, test duplicate deliveries, and recover failed work. [Go to the NestJS and Prisma setup](#start-with-one-incoming-event) if you are ready to implement it.

This walkthrough uses **0.2.0, released on 28 October 2026**. That release adds application-testing helpers, which we will use to check that two deliveries produce one order projection. See the [release notes](https://github.com/nestarc/inbox/blob/v0.2.0/CHANGELOG.md) and [installation guide](/packages/inbox/installation) for the supported setup.

## Why duplicate webhooks need idempotent handlers {#where-receiving-an-event-becomes-difficult}

These problems show up in real integrations:

- **A repeated event becomes a database error.** In a [2020 dj-stripe report](https://github.com/dj-stripe/dj-stripe/issues/1239), a developer described duplicate Stripe webhook events causing a unique-constraint violation and preventing their subscription handler from running. A constraint protects the row, but the receiver still needs a way to recognize a previous delivery and respond successfully.
- **Successful database work becomes a retry loop.** A [July 2026 Hatchet report](https://github.com/hatchet-dev/hatchet/issues/4481) describes a PostgreSQL write succeeding before a RabbitMQ connection fails ahead of ACK. Redelivery then hits the existing unique key repeatedly, adding database load and error logs. The database and the broker disagree about whether the work finished.
- **Moving work into the background adds a recovery problem.** [Stripe recommends responding quickly and processing events asynchronously](https://docs.stripe.com/webhooks#handle-events-asynchronously). Your receiver still needs to persist the event before returning success, track whether the business operation completed, and recover after a worker stops.

Retries are part of the delivery contract. [Stripe documents duplicate events](https://docs.stripe.com/webhooks#handle-duplicate-events), and [Amazon SQS standard queues can deliver a message more than once](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues-at-least-once-delivery.html). A receiver needs a repeatable outcome even when the transport behaves as designed.

A separate `processed_events` flag can leave a gap. Mark the event processed before the business write, and a crash can leave unfinished work that later deliveries skip. Write the business data first and save the flag afterward, and a crash between them can repeat the business operation. The database change and completion marker need to share a transaction.

## How the transactional inbox pattern prevents duplicate writes {#what-inbox-handles-for-you}

Inbox separates receiving an event from applying its effects:

```text
Verify the incoming request or message
                  |
                  v
accept() commits a receipt in PostgreSQL
                  |
                  +----> Return HTTP 2xx or acknowledge the broker
                  |
                  v
Worker claims the stored event
                  |
                  v
One transaction: business writes + completion marker
                  |
                  +----> Commit: COMPLETED
                  |
                  +----> Rollback: persisted retry, or DEAD
```

| Work you would otherwise build | What Inbox provides |
| --- | --- |
| Remember deliveries across processes and restarts | A retained identity made from scope, source, consumer, and message ID. |
| Close the gap between a database change and its completion marker | A supplied Prisma transaction, `context.tx`, for both business writes and Inbox completion. |
| Recover interrupted processing | Worker leases, ownership checks, and persisted retries with backoff. |
| Investigate and retry failed work | Scoped receipt queries and version-checked requeue of DEAD messages. |

The core uses PostgreSQL and your application's Prisma client, so it needs no additional Redis service or broker. You keep your current webhook endpoint or message consumer. Inbox manages the accepted message's processing lifecycle.

**The guarantee applies to committed database effects through `context.tx`, per retained message identity.** A handler can run again after a failure. Email, external API calls, and writes through another client do not share that transaction. If processing must publish another event, write an [outbox event through the same transaction](/packages/inbox/processing#combine-inbox-and-outbox), then deliver it separately.

## Implement webhook idempotency with NestJS and Prisma {#start-with-one-incoming-event}

We will receive `order.created` and create an `OrderProjection` row: a small local view of an order owned by another service. Repeating the same event should return the same receipt and leave one projection row.

This example assumes an existing NestJS **11.2.8+ within 11.x** app with Prisma **7.10.1+ within 7.x**, a generated Prisma client, and PostgreSQL. Inbox declares Node.js `>=22.12.0`; the full release validation uses **22.23.4+ within 22.x or 24.22.1+ within 24.x**. If your app uses an older framework or Prisma version, check [compatibility](/packages/inbox/#compatibility) before installing.

### 1 Install the package and database schema

```bash
npm install @nestarc/inbox@0.2.0
npm install @prisma/adapter-pg@7.10.1
```

Keep your Prisma CLI, client, and adapter versions aligned. The [Prisma 7 guide](/guide/prisma-7) covers client generation and driver setup if you have not configured them yet.

Add the application model to `prisma/schema.prisma`:

```prisma
model OrderProjection {
  tenantId String @map("tenant_id")
  orderId  String @map("order_id")

  @@id([tenantId, orderId])
  @@map("order_projections")
}
```

Create and apply its migration through your normal workflow, then run `npx prisma generate`. Locate the Inbox installation SQL:

```bash
node -p "require.resolve('@nestarc/inbox/sql/create-inbox-table.sql')"
```

Copy the contents of that file into a migration owned by your application and apply it before starting the worker. This installs **Inbox SQL schema v2**. Preserve these SQL-managed tables in future Prisma migrations; do not let a schema synchronization drop them. Inbox checks the schema on startup and does not create tables automatically. Existing Inbox 0.1.0 installations already use v2 and need no SQL upgrade for 0.2.0.

The projection's composite primary key protects a separate business rule: one projection per tenant and order. Two different event IDs remain different Inbox messages, even if they refer to the same order. Decide how your business handler should handle that case.

### 2 Write the handler using the supplied transaction

Create `src/order-created.handler.ts`. Adjust the generated-client import to your project's output path:

```typescript
import { InboxPermanentError, type InboxHandler } from '@nestarc/inbox';
import type { Prisma } from './generated/prisma/client';

export const orderCreated: InboxHandler<
  { orderId: string },
  Prisma.TransactionClient
> = {
  consumer: 'orders.projection.v1',
  eventType: 'order.created',
  schemaVersion: 1,
  validate(payload) {
    return (
      !!payload &&
      typeof payload === 'object' &&
      !Array.isArray(payload) &&
      typeof payload.orderId === 'string' &&
      payload.orderId.length > 0
    );
  },
  async handle(payload, context) {
    if (context.scope.kind !== 'tenant') throw new InboxPermanentError();

    await context.tx.orderProjection.create({
      data: { tenantId: context.scope.id, orderId: payload.orderId },
    });
  },
};
```

Use `context.tx` for every database write in this handler and let errors escape. Inbox records completion in that same transaction. If the insert or completion fails, both roll back. Here `schemaVersion: 1` describes your event payload; it is separate from Inbox's database schema version.

### 3 Register Inbox and enable its worker

The following `src/orders.module.ts` uses one application-owned Prisma client. Reuse your existing client if you already have one; [async module registration](/packages/inbox/installation#_3-register-a-handler-and-ingress-service) lets you inject it and other handler dependencies.

```typescript
import { Injectable, Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { InboxModule, InboxService } from '@nestarc/inbox';
import { PrismaClient } from './generated/prisma/client';
import { orderCreated } from './order-created.handler';

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

@Injectable()
export class OrdersIngress {
  constructor(private readonly inbox: InboxService) {}

  receive(verifiedTenantId: string, event: { id: string; orderId: string }) {
    return this.inbox.accept({
      scope: { kind: 'tenant', id: verifiedTenantId },
      source: 'orders-service',
      consumer: orderCreated.consumer,
      messageId: event.id,
      eventType: orderCreated.eventType,
      schemaVersion: orderCreated.schemaVersion,
      payload: { orderId: event.orderId },
    });
  }
}

@Module({
  imports: [
    InboxModule.forRoot({
      prisma,
      handlers: [orderCreated],
      worker: { enabled: true },
    }),
  ],
  providers: [OrdersIngress],
  exports: [OrdersIngress],
})
export class OrdersModule {}
```

Import `OrdersModule` in your application module. The worker is disabled by default, so `enabled: true` matters. Enable `app.enableShutdownHooks()` in your bootstrap and close the Nest application before disconnecting its Prisma client. Inbox manages worker shutdown; your application owns the database connection lifecycle.

### 4 Acknowledge after the receipt is stored

Inject `OrdersIngress` into your existing transport consumer. Authenticate the sender, validate the event envelope, and derive `verifiedTenantId` from trusted routing or credentials first. For signed webhooks, verify the signature over the original raw request body before accepting the event.

At the end of that verified ingress path, the sequence is:

```typescript
const receipt = await ordersIngress.receive(verifiedTenantId, event);
// Now return HTTP 2xx, or ACK the broker delivery.
// receipt.kind is 'accepted' or 'duplicate'.
```

Keep the producer's `event.id` unchanged on every delivery. A new random ID on each request defeats deduplication. Keep `source` and `consumer` stable too: renaming the consumer creates a different logical processing identity.

Both `accepted` and `duplicate` allow transport acknowledgment because the receipt exists durably. They do not mean the order projection is complete. A duplicate can even refer to a DEAD message, which requires operator recovery.

If acceptance fails or its commit result is uncertain, do not acknowledge success; redeliver the same identity. An authentication failure, invalid envelope, or `InboxConflictError` needs an explicit rejection policy. The conflict means an existing identity was reused with different content. See the [transport examples](https://github.com/nestarc/inbox/blob/v0.2.0/examples/README.md) for signed HTTP, RabbitMQ, Kafka, SQS-compatible, and BullMQ integrations.

### 5 Verify two deliveries produce one database effect

Version 0.2.0 includes `drainInbox()` so a test can wait for real processing instead of guessing how long to sleep. Use an isolated PostgreSQL test database with both migrations applied and no competing workers.

Create `src/verify-order-projection.ts` and invoke this function from your integration test with its fixture's Prisma client:

```typescript
import assert from 'node:assert/strict';
import { InboxService } from '@nestarc/inbox';
import { drainInbox } from '@nestarc/inbox/testing';
import type { PrismaClient } from './generated/prisma/client';
import { orderCreated } from './order-created.handler';

export async function verifyOrderProjection(prisma: PrismaClient) {
  const inbox = new InboxService({
    prisma,
    handlers: [orderCreated],
    worker: { enabled: false },
  });

  try {
    const envelope = {
      scope: { kind: 'tenant' as const, id: 'test-tenant' },
      source: 'orders-service',
      consumer: orderCreated.consumer,
      messageId: 'order-event-1',
      eventType: orderCreated.eventType,
      schemaVersion: orderCreated.schemaVersion,
      payload: { orderId: 'order-1' },
    };

    const first = await inbox.accept(envelope);
    const second = await inbox.accept(envelope);
    assert.equal(first.kind, 'accepted');
    assert.equal(second.kind, 'duplicate');
    assert.equal(second.id, first.id);

    const [completed] = await drainInbox(
      inbox,
      inbox.admin.forTenant('test-tenant'),
      [first.id],
      { timeoutMs: 5_000 },
    );
    assert.equal(completed?.status, 'COMPLETED');
    assert.equal(await prisma.orderProjection.count({
      where: { tenantId: 'test-tenant', orderId: 'order-1' },
    }), 1);

    const redelivery = await inbox.accept(envelope);
    assert.equal(redelivery.kind, 'duplicate');
    assert.equal(redelivery.status, 'COMPLETED');
  } finally {
    await inbox.close();
  }
}
```

Use a fresh fixture for each run and real timers. Disconnect the fixture's Prisma client after this function finishes. The helper processes eligible work for the registered consumers, so its receipt ID list does not isolate other messages in a shared database.

Then add a rollback test for your real handler: write a business row and deliberately throw before returning. Verify that the row does not survive that attempt, then allow a retry and check the final result. The [testing guide](/packages/inbox/testing) covers bounded waits and DEAD outcomes.

## Retry and recover failed webhook processing {#recover-failed-work-without-changing-its-identity}

Ordinary handler failures use persisted retries with backoff. Invalid handler payloads, unsupported event schemas, permanent failures, and exhausted attempts become `DEAD`. Once an event is accepted, Inbox owns those processing retries; repeated deliveries from the sender do not reset the retry budget.

After correcting the cause, an authorized operator can inspect and requeue the same receipt. Here `admin` is an injected `InboxAdminService`, and the tenant and operator IDs come from your authorization layer:

```typescript
const tenant = admin.forTenant(authenticatedTenantId);
const item = await tenant.get(receiptId);

if (item?.status === 'DEAD') {
  await tenant.requeue({
    id: item.id,
    expectedVersion: item.rowVersion,
    actor: operatorId,
    reason: 'Corrected handler deployed',
  });
}
```

The observed version prevents a stale operator action from overwriting a concurrent change. Monitor backlog age and DEAD count as well as HTTP success: a receiver can keep accepting events while a missing or unhealthy worker leaves them pending. The [operations guide](/packages/inbox/operations) covers worker ownership, recovery, and retention.

Keep the deduplication receipts for the redelivery history you need. Completed-payload cleanup can remove payloads while preserving identity and fingerprints; deleting the receipts themselves removes that protection. Inbox does not guarantee event ordering, so handlers that depend on the latest state still need application version checks or another ordering strategy.

## Webhook idempotency questions

### Which event ID should deduplicate a webhook

Use the verified sender's stable event ID as `messageId`, together with the trusted scope, source, and consumer. For Stripe, this is the Event object's `id`; do not generate a new ID for each delivery. [Stripe also documents separate Event objects for the same underlying action](https://docs.stripe.com/webhooks#handle-duplicate-events). Different event IDs need business constraints or state-transition checks in addition to Inbox deduplication.

### When should a NestJS webhook return HTTP 200

Return a successful `2xx` response after `accept()` resolves with `accepted` or `duplicate`, which confirms durable receipt storage. The worker can finish later. If storage fails or the commit result is uncertain, allow redelivery with the same identity. A duplicate receipt may still be pending or DEAD, so track processing status separately from the HTTP response.

### How does Inbox differ from Outbox and HTTP idempotency

An **inbox** stores incoming events and coordinates their database effects. An [outbox](/packages/outbox/) stores outgoing events in the same transaction as a business change, then publishes them later. [HTTP idempotency](/packages/idempotency/) coordinates repeated requests and response replay. A cached HTTP response alone does not atomically commit your business writes with a durable processing record. Choose the boundary that matches the operation; a handler can use both an inbox and an outbox in the same transaction.

## Adopt Inbox for one webhook consumer {#make-the-first-adoption-small}

Choose one incoming event that updates PostgreSQL. Preserve its event ID, move its database writes into `context.tx`, and verify duplicate delivery and rollback before expanding to other handlers.

That first integration gives you a durable answer to “did we receive it?” and a separate, inspectable answer to “did it finish?” It also gives the next retry a safe path through the same database workflow.

**[Install Inbox for one consumer](/packages/inbox/installation)**, or start with the [versioned runnable integrations](https://github.com/nestarc/inbox/blob/v0.2.0/examples/README.md) to try your transport. For the sending side of the same workflow, read [HTTP 202 is not delivery](/blog/http-202-is-not-delivery-nestjs).
