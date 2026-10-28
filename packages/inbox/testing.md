---
title: "Test Inbox Handlers with PostgreSQL"
description: "Use Inbox 0.2.0 testing helpers to drain receipts, observe COMPLETED or DEAD outcomes, and verify real Prisma business effects with bounded waits."
---

# Test Inbox Application Handlers

Inbox 0.2.0 adds `@nestarc/inbox/testing` for integration tests using the real `InboxService` and an application's PostgreSQL test database. The helpers work with any test runner and add no runtime dependencies. They wait for processing outcomes; your tests still assert the business effects.

Prepare an isolated test database with the [Inbox SQL schema v2 and application migrations](./installation#_2-apply-postgresql-schema-v2). The helpers do not create, migrate, or reset a database. Existing 0.1.0 schema v2 installations need no migration for 0.2.0.

## Process receipts with the real worker

Disable automatic polling when the test controls processing. This example uses the `OrderProjection` model from [installation](./installation), your generated Prisma client, and Node's assertions. Run it with an application-owned test client against a fresh fixture:

```typescript
import assert from 'node:assert/strict';
import {
  InboxPermanentError,
  InboxService,
  type InboxHandler,
} from '@nestarc/inbox';
import { drainInbox } from '@nestarc/inbox/testing';
import { PrismaClient, type Prisma } from './generated/prisma/client';

async function verifyOrderProjection(prisma: PrismaClient) {
  const handler: InboxHandler<
    { orderId: string },
    Prisma.TransactionClient
  > = {
    consumer: 'test.orders.projection.v1',
    eventType: 'order.created',
    schemaVersion: 1,
    async handle(payload, context) {
      if (context.scope.kind !== 'tenant') throw new InboxPermanentError();
      await context.tx.orderProjection.create({
        data: { tenantId: context.scope.id, orderId: payload.orderId },
      });
    },
  };

  const inbox = new InboxService({
    prisma,
    handlers: [handler],
    worker: { enabled: false, retryBaseMs: 10, retryMaxMs: 20 },
  });

  try {
    const envelope = {
      scope: { kind: 'tenant' as const, id: 'test-tenant' },
      source: 'orders-test',
      consumer: handler.consumer,
      messageId: 'order-event-1',
      eventType: handler.eventType,
      schemaVersion: handler.schemaVersion,
      payload: { orderId: 'order-1' },
    };
    const receipt = await inbox.accept(envelope);
    const admin = inbox.admin.forTenant('test-tenant');
    const [completed] = await drainInbox(inbox, admin, [receipt.id], {
      timeoutMs: 5_000,
    });
    assert.equal(completed?.status, 'COMPLETED');

    const duplicate = await inbox.accept(envelope);
    assert.equal(duplicate.kind, 'duplicate');
    assert.equal(duplicate.id, receipt.id);
    assert.equal(await prisma.orderProjection.count({
      where: { tenantId: 'test-tenant', orderId: 'order-1' },
    }), 1);
  } finally {
    await inbox.close();
  }
}
```

Call `verifyOrderProjection(prisma)` from the test and disconnect the fixture's Prisma client only after that call and Inbox shutdown finish. Adapt the handler to your application's real implementation. Also check outgoing rows when the handler writes an outbox event. A completed receipt alone does not prove that the expected application fields or downstream events were written.

`drainInbox()` checks the requested receipts and calls `runOnce()` between state checks until every requested receipt is `COMPLETED`. A zero-claim poll is not completion: a receipt may be waiting for a retry or lease expiry. Retries follow the worker's actual schedule; set shorter retry delays explicitly for tests when appropriate.

**Receipt IDs select assertions, not claims.** The worker can process other receipts for its registered consumers, including other tenants. A scoped admin view limits the helper's reads, not worker ownership. Use an isolated database or dedicated test consumers, and avoid competing workers when testing deterministic ordering. The helper accepts at most 1,000 receipt UUIDs, deduplicates IDs, and preserves their first occurrence order. An empty list returns immediately.

## Observe an existing worker

`waitForInboxRecord()` reads through the provided admin view. It does not start a worker, requeue failures, or mutate the receipt. Use it with automatic polling or a separately managed worker:

```typescript
import { waitForInboxRecord } from '@nestarc/inbox/testing';

const admin = inbox.admin.forTenant('test-tenant');
const completed = await waitForInboxRecord(admin, receipt.id);

// In a separate test that deliberately exhausts handler retries:
const dead = await waitForInboxRecord(admin, failedReceipt.id, {
  status: 'DEAD',
  timeoutMs: 10_000,
});
```

The expected terminal state is `COMPLETED` by default, or `DEAD` when specified. Observing the other terminal state fails immediately. A missing or out-of-scope receipt remains pending until timeout or the pass limit; the helper cannot distinguish those cases.

## Bound waits and inspect failures

Both helpers accept `InboxTestOptions`; `waitForInboxRecord()` accepts `InboxWaitOptions`, which also includes `status`.

| Option | Default | Meaning |
| --- | --- | --- |
| `timeoutMs` | `5000` | Overall budget, including database reads and worker execution. |
| `pollIntervalMs` | `10` | Delay between state-check passes. |
| `maxPasses` | `1000` | Maximum state-check passes; no new worker call starts after the final check. |
| `signal` | None | An `AbortSignal` that stops waiting and starting new polls. |

Numeric options must be positive 32-bit integers. The overall timeout also bounds waiting on a stalled `get()` or `runOnce()`. Timeout or cancellation stops the helper's wait; an already running database operation or handler may still finish. Close the service before disconnecting Prisma or tearing down the fixture. These wait limits do not replace the runtime's transaction timeouts.

Use **real timers** with PostgreSQL. Advancing a test runner's fake clock does not advance database retry or lease timestamps.

`InboxTestError` extends `Error` and exposes `code` plus a `records` snapshot. Each snapshot contains `id`, last observed `status`, `attemptCount`, and `cycleAttemptCount`; unobserved values are `null`. Diagnostics omit payloads, tenant values, and raw handler errors.

| Error code | Meaning |
| --- | --- |
| `INVALID_OPTIONS` | Invalid numeric option, terminal status, or receipt UUID list. |
| `TIMEOUT` | The overall time budget expired. |
| `ABORTED` | The caller's signal was aborted. |
| `PASS_LIMIT` | The maximum number of state checks was reached. |
| `UNEXPECTED_TERMINAL_STATE` | A receipt reached the other terminal state. |

Underlying database errors propagate unchanged. Treat those errors as a failed fixture or database operation instead of an unfinished receipt.

Read the [published helper source](https://github.com/nestarc/inbox/blob/v0.2.0/src/testing/index.ts), [upstream testing guide](https://github.com/nestarc/inbox/blob/v0.2.0/docs/testing.md), and [testing API reference](/api/inbox/testing) for the full contracts. Continue with [operational recovery checks](./operations#operational-validation) to evaluate failure scenarios beyond application tests.
