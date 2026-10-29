---
title: Audit Log for NestJS
description: "Know who changed what in your NestJS app. Start with one business event or one Prisma model, then verify the actor, tenant, field changes, and rollback."
---

# Know who changed what in your NestJS app.

`@nestarc/audit-log` records business events in PostgreSQL or SQL Server, with automatic Prisma field changes on PostgreSQL. Start with one workflow, verify the actor and before/after values, then expand coverage.

<div class="audit-start-actions">
  <a class="audit-start-primary" href="./quickstart">Run the example →</a>
  <a class="audit-start-secondary" href="./adoption">Add to an existing app →</a>
</div>

Published **0.8.0** · [What's new](#whats-new-in-0-8-0) · [API reference](/api/audit-log/)

<span id="from-a-business-update-to-an-audit-record"></span>

## See the change, and who made it

In the [runnable example](./quickstart), a user starts as a `member`. An HTTP request changes their role to `admin`, producing an automatic audit record with the request's demo actor and tenant context.

Expected fields from the role-change record; the generated user ID varies:

```json
{
  "action": "User.updated",
  "source": "auto",
  "actorId": "demo-user",
  "tenantId": "demo-tenant",
  "targetType": "User",
  "targetId": "<generated-user-id>",
  "changes": {
    "role": { "before": "member", "after": "admin" }
  }
}
```

With `atomic-required`, supported business writes and their automatic audit records commit or roll back together inside `withAuditTransaction()`. The example verifies both the successful change and rollback.

## Start where it helps today

### Log one business event

Capture an approval, role change, or export with a manual event. Use `AuditService.withManualTransaction()` to bind business writes and events to one transaction, or keep an existing transaction and pass its `tx` to `AuditService.log()`. Your application chooses the event name and metadata.

[Add a manual event →](./adoption#log-one-business-event)

Choosing your first workflow? Read [Start Your NestJS Audit Trail with One Business Event](/blog/nestjs-audit-log-first-business-event) for a role-change example and a practical adoption checklist.

### Track one Prisma model

Select a model with `trackedModels: ['User']`, then move its selected write path into an audited transaction. The extension produces field-level before/after changes automatically.

[Track a model →](./adoption#track-one-prisma-model)

Both paths include actor and tenant context, sensitive-field masking, and an API to [query the recorded history](./query-api). The [Quick Start](./quickstart) lets you compare the two before changing your app.

<span id="whats-new-in-0-7-0"></span>

## What's new in 0.8.0 {#whats-new-in-0-8-0}

- **Manage manual transactions.** `withManualTransaction()` supplies a typed `tx` and bound `log`. Audit failures prevent commit even when caught inside the callback.
- **Validate event quality.** Opt into `strictManualValidation` and a `maxMetadataBytes` budget. Invalid inputs expose structured `AuditInputError` diagnostics before INSERT.
- **Observe outcomes.** `onAuditOperation` reports manual log and managed transaction outcomes without event contents. `getCapabilities()` reports the configured provider's API support without database I/O.
- **Read SQL Server history.** Use tenant-scoped `query()` and `getById()`, optional read indexes, and read-only storage inspection. See the [SQL Server guide](./sql-server).

Review [upgrading to 0.8.0](./migration), including the Node.js minimum introduced in 0.7.1 and the optional soft-delete compatibility boundary. Existing PostgreSQL automatic tracking and caller-owned manual transactions remain available.

<span id="version-scope"></span>

## Fit and supported scope

The package supports NestJS **10, 11, or 12.0.1+** and Node.js **22.23.4+ within 22.x or 24.22.1+ within 24.x**. PostgreSQL is the default provider; SQL Server supports manual logging, managed manual transactions, and history reads. Prisma 7 is the primary target; Prisma 5/6 retain peer compatibility. The runnable example pins NestJS 12.1.1 and Prisma 7.9.1. An existing Prisma 5/6 app can keep its client setup.

::: tip Supported: transaction-first automatic tracking
The Supported claim applies to supported tracked operations through `withAuditTransaction()` with `consistency: 'atomic-required'`. Tracked writes outside the helper fail before execution. Base-client writes, raw SQL, and database cascades are outside automatic coverage; review [nested and bulk operations](./auto-tracking) before extending adoption.
:::

Explicit `best-effort` is non-atomic and outside that support claim. It can leave success records after a caller rolls back, or produce stale transaction-local diffs. For manual events, use `withManualTransaction()` to reject commit after caught audit failures. With caller-owned transactions, await `log(input, tx)` and propagate failures to roll back the business change. SQL Server automatic tracking, scan/export, retention, and partitioning remain unsupported.

## Grow after the first verified record

- [NestJS audit log code example](/blog/nestjs-audit-log-without-refactoring) — follow a role change from request to recorded history.
- [Installation](./installation) — shared configuration, audit storage, and NestJS wiring.
- [SQL Server](./sql-server) — manual transactions, history queries, storage setup, and provider limits.
- [Query API](./query-api) — tenant-scoped history, filters, and keyset pagination.
- [Streaming export](./streaming-export) and [durable streams](./durable-streams) — exports and checkpointed delivery, including polling limits.
- [Retention](./retention) — append-only storage, privileges, and partition maintenance.
- [Soft-delete integration](./auto-tracking#atomic-soft-delete-lifecycle) — the documented audit-log 0.7.0 / soft-delete 0.7.5 recipe remains version-scoped; soft-delete 0.7.5 does not accept audit-log 0.8.0.
- [Benchmark guide](./benchmark) — measure the atomic path against an unaudited transaction.
- [Agent guide](./agent-guide) — version-pinned integration checklist for coding agents.

<style scoped>
.audit-start-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 24px 0 16px;
}
.audit-start-actions a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 8px 18px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: none;
}
.audit-start-actions .audit-start-primary {
  background: var(--vp-c-brand-2);
  color: #fff;
}
.audit-start-actions .audit-start-secondary {
  color: var(--vp-c-text-1);
}
.audit-start-actions a:hover {
  border-color: var(--vp-c-brand-2);
  box-shadow: 0 0 0 1px var(--vp-c-brand-2);
}
.audit-start-actions a:focus-visible {
  outline: 3px solid var(--vp-c-brand-1);
  outline-offset: 4px;
}
</style>
