---
title: "Retries, Replay, and Tenant Operations"
description: "Operate Inbox 0.1.0 workers with durable retries, version-checked DEAD requeue, explicit replay, tenant-bound administration, PostgreSQL RLS, and payload retention."
---

# Operate Inbox Workers and Recovery

Inbox 0.1.0 stores processing state in PostgreSQL. Operators inspect retained receipts, recover DEAD work after correcting a failure, and explicitly replay completed messages when the business operation permits another execution.

## Configure workers and retries

The worker is opt-in. Register handlers and set `worker.enabled: true` as shown in [installation](./installation). Defaults favor short database transactions; all durations below are milliseconds.

| Option | Default | Purpose |
| --- | --- | --- |
| `worker.enabled` | `false` | Start polling on application initialization. |
| `worker.consumers` | Registered handler names | Restrict claims and recovery to owned consumers. |
| `worker.concurrency` | `4` | Maximum claimed active records; upper bound 100. |
| `worker.pollIntervalMs` | `1000` | Delay between polling opportunities. |
| `worker.leaseMs` | `30000` | Database claim lifetime. |
| `worker.heartbeatIntervalMs` | `5000` | Renewal interval; must be less than half the lease duration. |
| `worker.transactionTimeoutMs` | `10000` | Handler transaction deadline. |
| `worker.transactionMaxWaitMs` | `5000` | Wait to acquire a Prisma transaction connection. |
| `worker.lockTimeoutMs` | `1000` | Database lock-wait bound. |
| `worker.shutdownTimeoutMs` | `15000` | Bounded drain on shutdown. |
| `worker.maxAttempts` | `8` | Claims per retry cycle, including the first attempt and crashes. |
| `worker.retryBaseMs` / `worker.retryMaxMs` | `1000` / `300000` | Exponential delay cap before full jitter. |
| `maxPayloadBytes` | `262144` | Accepted JSON payload limit in UTF-8 bytes. |
| `maxPendingMessages` | Unset | Optional approximate backlog admission limit. |

Each claim consumes an attempt before the handler runs. Ordinary failures schedule a persisted retry with capped exponential backoff and full jitter. `InboxPermanentError`, invalid handler payloads, unsupported schemas, and exhausted attempts become **DEAD**. Error details are redacted before persistence and observation.

Renewal succeeds only for an owned, unexpired lease. If a newer worker has taken over, the old completion cannot commit its business writes. If a completion commit response is lost, Inbox reads the receipt before choosing a failure transition; an unavailable reconciliation read leaves recovery to the lease rather than overwriting a potentially completed record.

Provision pool connections for admission, heartbeats, and control queries in addition to handler transactions. Inbox reuses the application's Prisma pool. Increasing concurrency can increase pool pressure, so measure with the application's actual workload.

For explicit bounded execution, `InboxService.initialize()` checks the schema, `runOnce()` processes a batch, and `close()` stops the worker. The Nest module handles initialization and shutdown automatically. Close the Nest application before disconnecting Prisma, enable shutdown hooks for operating-system signals, and allow the process manager enough time for application cleanup.

## Inspect and requeue DEAD messages

Inject `InboxAdminService` into an authorized operator service, then bind the scope from authenticated context. In this example `admin` is that injected instance; `operatorId` and `authenticatedTenantId` come from the application's authorization layer:

```typescript
const tenant = admin.forTenant(authenticatedTenantId);
const page = await tenant.list({ status: 'DEAD', limit: 50 });
const item = await tenant.get(recordId);

if (item?.status === 'DEAD') {
  await tenant.requeue({
    id: item.id,
    expectedVersion: item.rowVersion,
    reason: 'Handler corrected and deployed',
    actor: operatorId,
  });
}

const stats = await tenant.stats();
```

`list()` returns `records` and `nextCursor`; pass the cursor with the same filters to continue. Listing order does not imply processing order. Statistics count retained records and include oldest pending work, so large histories have query costs.

Requeue requires a DEAD record and its observed version. Stale or concurrent mutations fail with `InboxStateConflictError`. It preserves identity, payload, claim token, lifetime attempts, and requeue history, while resetting the current retry-cycle budget. It cannot reset a COMPLETED record.

`forGlobal()` selects intentional global records; it does not select every tenant. `InboxPrivilegedAdminService` exposes cross-tenant operator capabilities only when `privilegedAdmin: true` is configured. With `forRootAsync`, that opt-in is a top-level registration option beside `imports`, `inject`, and `useFactory`, not part of the factory result. Keep that surface in an authorized control-plane application.

## Replay a completed message explicitly

Replay creates a **new PENDING receipt** and preserves the original completion and identity. It deliberately permits another business execution. Deploy a matching target handler whose business semantics allow reprocessing, such as a projection rebuild:

```typescript
const tenant = admin.forTenant(authenticatedTenantId);
const original = await tenant.get(originalId);

if (original?.status === 'COMPLETED') {
  const replay = await tenant.replay({
    id: original.id,
    expectedVersion: original.rowVersion,
    requestId: persistedOperatorRequestUuid,
    targetConsumer: 'orders.projection.rebuild.v1',
    actor: operatorId,
    reason: 'Rebuild the projection with the corrected handler',
  });
  // replay.kind: accepted or duplicate; replay.record: the replay receipt.
}
```

Generate and persist one UUID for each intended operator request, then reuse it after timeouts. It is unique within the source tenant/global scope. Reusing that UUID with changed arguments throws `InboxReplayConflictError`; retrying the same request returns its existing replay receipt even after payload cleanup.

A new replay request requires the retained COMPLETED payload and observed source version. Payload mutation is unsupported, and replay does not create the destination handler. Business uniqueness and external effects still need their own idempotency contracts. `record.replay` and `context.replay` expose the original inbox ID, source version, request ID, actor, reason, and request time; payload cleanup preserves that lineage.

## Tenant context and PostgreSQL RLS

Inbox scope is an identity and administration boundary, not authentication or a database RLS policy. To restore [Tenancy](/packages/tenancy/) context inside the existing handler transaction, install the optional `@nestarc/tenancy ^0.16.2` peer and use `createInboxTenancyContext()` from `@nestarc/inbox`:

```typescript
import { createInboxTenancyContext } from '@nestarc/inbox';
import { TenancyContext } from '@nestarc/tenancy';

// Inside the async factory receiving the application's raw Prisma client
// and injected TenancyService:
handlerContext: createInboxTenancyContext({
  context: new TenancyContext(),
  tenancy,
}),
```

The shown property belongs in the options returned by the `forRootAsync` factory; import the configured tenancy module and the application's Prisma provider module, then inject their exported services. Tenancy 0.16.2 exports `TenancyService`, not a `TenancyContext` provider. Its public `new TenancyContext()` shares the same async-local storage.

Pass the application's **raw Prisma client**, not the tenancy extension that starts transactions of its own. The adapter sets the service's canonical PostgreSQL tenant setting with transaction-local `set_config` and invokes the handler on the same `context.tx`. The setting clears on commit or rollback.

Your application still authenticates the scope, installs RLS policies using that setting, and runs with a non-owner, non-superuser, non-BYPASSRLS role. Inbox control tables are worker-owned; the application-data policies enforce tenant isolation. Global messages are permanently rejected by default. Explicit `global: 'shared'` permits shared-table work with an empty tenant setting and does not bypass RLS.

Use Node 22.23.4+ on Node 22 or 24.22.1+ on Node 24 for this optional integration, matching Tenancy's stricter engine range. Follow the [complete versioned tenancy wiring](https://github.com/nestarc/inbox/blob/v0.1.0/docs/usage.md#tenant-context-in-the-handler-transaction) and [runnable examples](https://github.com/nestarc/inbox/blob/v0.1.0/examples/README.md).

Custom `handlerContext(context, next)` wrappers must invoke and await `next()` exactly once. Skipping or repeating it, swallowing a handler failure, or starting canceled work cannot produce successful completion.

## Retain deduplication while cleaning payloads

Completed-payload cleanup is an explicit operator action:

```typescript
await admin.forTenant(authenticatedTenantId).purgeCompletedPayload({
  before: new Date('2026-01-01T00:00:00Z'),
  limit: 100,
});
```

Choose the cutoff from your retention policy. Cleanup removes eligible COMPLETED payloads and preserves identity, fingerprint, and replay lineage. It leaves PENDING, PROCESSING, RETRYABLE, and DEAD payloads intact. Retained receipts continue deduplicating old redeliveries, but a new replay requires a retained source payload.

Manually deleting receipts ends that deduplication history. Restoring an older database backup also restores an older history, so recovery planning must account for possible redelivery of previously processed identities.

## Monitor the processing outcome

The optional `observer(event)` receives bounded, redacted accepted, duplicate, completed, retry, dead, lease-lost, and infrastructure-error observations. Observers are best-effort and are not a durable audit trail.

Monitor backlog age, DEAD count, database pool pressure, and processing delay. Avoid tenant IDs or message IDs as high-cardinality metric labels. A consumer without an active owner can accumulate pending work even while ingress succeeds.

`maxPendingMessages` is approximate under concurrency and is not a strict quota. Duplicate acceptance remains valid at the limit. Admission rejection or database exhaustion must remain failed acceptance, never a success acknowledgment.

See the [processing contract](./processing), [API reference](/api/inbox/), and [0.1.0 usage guide](https://github.com/nestarc/inbox/blob/v0.1.0/docs/usage.md) for the full signatures and recovery rules.
