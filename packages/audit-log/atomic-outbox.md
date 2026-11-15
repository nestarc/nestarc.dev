---
title: Atomic Audit Delivery with Outbox
description: "Commit business writes, audit records, and Outbox events together with published audit-log 0.9.0 and Outbox 0.4.1, then recover at-least-once delivery."
---

# Atomic Audit Delivery with Outbox

Published **`@nestarc/audit-log@0.9.0`** adds opt-in PostgreSQL delivery through
`createOutboxAuditDelivery()`. A managed transaction commits the business change, its audit row,
and an Outbox event together. An Outbox worker delivers the event after commit.

Use this path when a newly recorded audit event must leave a durable delivery request. The
[checkpointed stream](./durable-streams) still scans by timestamp and can miss a late commit behind
its checkpoint. Atomic Outbox delivery stages the request at the producer transaction; it does
not change existing stream behavior or backfill historical audit rows.

::: info Existing soft-delete composition
Soft-delete 0.7.6 excludes audit-log 0.9.0 from its optional peer range. Keep the verified
tenancy 0.16.4 / audit-log 0.8.0 / soft-delete 0.7.6 [lifecycle recipe](./auto-tracking#atomic-soft-delete-lifecycle)
on its pinned versions. This delivery guide does not establish a new soft-delete combination.
:::

## Install and prepare storage

In an application with compatible NestJS and Prisma dependencies:

```bash
npm install --save-exact --strict-peer-deps @nestarc/audit-log@0.9.0 @nestarc/outbox@0.4.1
```

Audit-log requires Node.js `^22.23.4 || ^24.22.1`. The
[released runnable example](https://github.com/nestarc/nestjs-audit-log/tree/v0.9.0/examples/atomic-outbox)
pins NestJS 11.2.8 and Prisma CLI/client/PostgreSQL adapter 7.10.1. Use matching Prisma versions
and follow [installation](./installation) for the generated namespace and module wiring.

Create the business table, audit table, and Outbox tables in explicit migrations before enabling
delivery. Audit-log's `applyAuditTableSchema()` creates audit storage; it does not install Outbox.
Use the [Outbox installation guide](/packages/outbox/installation) for its schema and permissions.
The emitter, audit writes, and business writes must use the **same PostgreSQL transaction**.
Ensure the producer and worker resolve `outbox_events` to the same schema.

Audit-log does not require or import the Outbox runtime when `delivery` is omitted. Install
Outbox explicitly only when using this adapter.

## Share the delivery configuration

The fragments below assume an existing base Prisma client named `base`, a generated `Prisma`
namespace, and an `Invoice` model mapped to `invoices` with `id`, `tenantId`, and `status` fields.
The host authenticates the actor and authorizes the tenant and invoice before entering either
write path. `tenantScope` is an application-owned context, not an authorization check.

```typescript
import { AsyncLocalStorage } from 'node:async_hooks';
import {
  AuditContext,
  AuditService,
  createAuditedClient,
  createOutboxAuditDelivery,
  defineAuditConfig,
} from '@nestarc/audit-log';
import { OutboxEmitter } from '@nestarc/outbox';
import { Prisma } from './generated/prisma/client';

const tenantScope = new AsyncLocalStorage<string>();
const emitter = new OutboxEmitter({ prisma: base });
const config = defineAuditConfig({
  shared: {
    provider: 'postgresql',
    prismaModule: { Prisma },
    tableName: 'audit_logs',
    actorRequired: true,
    tenantRequired: true,
    tenantResolver: () => tenantScope.getStore() ?? null,
    sensitiveFields: ['password', 'token'],
    delivery: createOutboxAuditDelivery(emitter),
  },
  module: {
    actorExtractionStage: 'interceptor',
    actorExtractor: req => ({ id: req.user?.id ?? null, type: 'user' }),
    strictManualValidation: true,
  },
  extension: {
    consistency: 'atomic-required',
    trackedModels: ['Invoice'],
    databaseMapping: { Invoice: { tableName: 'invoices' } },
  },
});

const audit = new AuditService({ ...config.moduleOptions, prisma: base });
const audited = createAuditedClient(base, config.extensionOptions);
```

For Nest dependency injection, register `config.moduleOptions` and the base client with
`AuditLogModule.forRoot()` or `forRootAsync()`, then inject `AuditService`. The direct construction
above keeps the transaction examples focused. For manual-only use, omit the `extension` section
and the audited client.

Both examples below run inside this already-authorized context:

```typescript
const identity = { tenantId, actorId, requestId }; // Values authorized by the host.

function inAuthorizedContext<T>(work: () => T): T {
  return tenantScope.run(identity.tenantId, () => AuditContext.run({
    actor: { id: identity.actorId, type: 'user' },
    noAudit: false,
    metadata: { correlationId: identity.requestId },
  }, work));
}
```

## Manual event and delivery in one transaction

Use the **bound `log` writer** supplied by `withManualTransaction()`:

```typescript
await inAuthorizedContext(() =>
  audit.withManualTransaction(base, async ({ tx, log }) => {
    const invoice = await tx.invoice.update({
      where: { id: invoiceId, tenantId: identity.tenantId },
      data: { status: 'approved' },
    });
    await log({
      action: 'invoice.approved',
      targetType: 'Invoice',
      targetId: invoice.id,
    });
    return invoice;
  }),
);
```

With delivery configured, standalone `audit.log(input)` and caller-owned `audit.log(input, tx)`
reject before the audit INSERT. Passing the managed helper's transaction to the public `log()`
method does not bypass that restriction; use its bound writer. Business writes must use the
supplied `tx`; a captured base client does not join the transaction.

## Automatic tracking and delivery in one transaction

Use `atomic-required` and the audited client's helper:

```typescript
await inAuthorizedContext(() =>
  audited.withAuditTransaction(async tx => {
    return tx.invoice.update({
      where: { id: invoiceId, tenantId: identity.tenantId },
      data: { status: 'approved' },
    });
  }),
);
```

This produces an automatic `Invoice.updated` audit row and its delivery event. The manual
example instead produces `invoice.approved`. Choose the appropriate path for the event's meaning;
the examples are separate alternatives. Existing [automatic coverage limits](./auto-tracking)
still apply: base-client writes, raw SQL, database cascades, and intentional exclusions do not
become automatically audited by enabling delivery.

Automatic delivery rejects `best-effort` configuration. In either supported managed path,
audit INSERT or enqueue failure prevents commit, including when application code catches the
audit error inside the callback. A business callback failure rolls back all three writes too.
Delivery failures are reported through `onAuditError` with phase `delivery` and code
`AUDIT_DELIVERY_FAILED`; the original error is preserved. Handle recovery outside the helper.

## Tenant isolation and payload privacy

The adapter passes the resolved audit tenant explicitly to Outbox. A null tenant uses explicit
global scope rather than the emitter's ambient tenant fallback. Set `tenantRequired: true` for
tenant-owned events. Audit tenant attribution does not add tenant filters or RLS policies to
business tables and does not authorize the actor.

When the application's PostgreSQL RLS policies use a tenant setting, bind that setting on the
supplied transaction before any business query. Keep one authorized tenant for its lifetime.
The [released source regression](https://github.com/nestarc/nestjs-audit-log/blob/v0.9.0/test/e2e/atomic-delivery.e2e-spec.ts)
uses a restricted `NOBYPASSRLS` runtime role and forced RLS on business, audit, and delivery
tables to verify this boundary. The snippets above retain explicit business-query tenant scope;
they do not install or initialize an application's RLS configuration.

The event type is `nestarc.audit.recorded.v1`. Its immutable summary contains only:

```typescript
{
  schemaVersion: 1,
  auditId,
  tenantId,
  actorId,
  actorType,
  action,
  targetType,
  targetId,
  source,        // 'manual' or 'auto'
  result,        // 'success' or 'failure'
  correlationId,
}
```

It excludes full changes, arbitrary metadata, and actor IP. Correlation comes from the redacted
audit metadata when its value is a string; otherwise the payload contains `null`. The Outbox
envelope falls back to `auditId` for correlation. Audit IDs are generated for individual audit
records, not reused as application command IDs; command retries need their own idempotency policy.

## Deliver and recover after commit

Configure an Outbox worker with an `OutboxPublisher` for this event type. Keep Outbox 0.4.1
periodic polling enabled, and call `OutboxPoller.stop()` before closing its dependencies. Network
delivery belongs in that worker, outside producer transactions and emitter hooks. See
[Outbox transports](/packages/outbox/transports).

Delivery is **at least once**. The audit ID becomes the Outbox `idempotencyKey` and `causationId`;
that key is metadata and does not suppress a second Outbox INSERT. Consumers should store a
receipt keyed by tenant scope and `payload.auditId` in the same transaction as their database
effects. Retain receipts for the full retry/replay window. Use the destination's idempotency
mechanism for external side effects.

Existing audit records are not backfilled, and delivery order is not commit order. SQL Server
delivery and exactly-once execution are outside this contract. Existing `log()`, query, export,
and stream behavior stays unchanged when `delivery` is omitted. If consumers resolve the audit
ID to full history, coordinate source retention with their recovery window.

## Run the released example and check its scope

Copy the [0.9.0 example directory](https://github.com/nestarc/nestjs-audit-log/tree/v0.9.0/examples/atomic-outbox)
to an isolated workspace, then follow its README to install exact audit-log 0.9.0 and Outbox 0.4.1:

```bash
npm install --strict-peer-deps
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/audit_demo
npm run smoke
```

The example uses a disposable schema and an actual Outbox poller. It checks invisible
uncommitted events, rollback, producer termination after commit, retained delivery identity,
lost-acknowledgement retry, and durable consumer deduplication. Its two-tenant assertions cover
attribution and scoped history reads; the separate source regression covers PostgreSQL RLS.
The demo publisher models a receiver in PostgreSQL and does not call an external HTTP service.

The [registry consumer check](https://github.com/nestarc/nestjs-audit-log/blob/v0.9.0/scripts/verify-atomic-outbox-consumer.cjs)
installs the published artifact, verifies its integrity and exact Outbox version, runs that smoke,
and separately loads audit-log without Outbox installed. These checks establish the tested
contracts and dependency tuple, not a throughput benchmark or validation of every custom adapter.
