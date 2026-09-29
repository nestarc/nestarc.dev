---
title: Audit Log for NestJS
description: "Know who changed what in your NestJS app. Start with one business event or one Prisma model, then verify the actor, tenant, field changes, and rollback."
---

# Know who changed what in your NestJS app.

`@nestarc/audit-log` records business events and Prisma field changes in PostgreSQL. Start with one workflow, verify the actor and before/after values, then expand coverage.

<div class="audit-start-actions">
  <a class="audit-start-primary" href="./quickstart">Run the example →</a>
  <a class="audit-start-secondary" href="./adoption">Add to an existing app →</a>
</div>

Published **0.7.0** · [What's new](#whats-new-in-0-7-0) · [API reference](/api/audit-log/)

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

Capture an approval, role change, or export with `AuditService.log()`. Keep your base Prisma client and existing transaction; pass the same `tx` to the audit call. Your application chooses the event name and metadata.

[Add a manual event →](./adoption#log-one-business-event)

Choosing your first workflow? Read [Start Your NestJS Audit Trail with One Business Event](/blog/nestjs-audit-log-first-business-event) for a role-change example and a practical adoption checklist.

### Track one Prisma model

Select a model with `trackedModels: ['User']`, then move its selected write path into an audited transaction. The extension produces field-level before/after changes automatically.

[Track a model →](./adoption#track-one-prisma-model)

Both paths include actor and tenant context, sensitive-field masking, and an API to [query the recorded history](./query-api). The [Quick Start](./quickstart) lets you compare the two before changing your app.

## What's new in 0.7.0 {#whats-new-in-0-7-0}

- **Keep settings consistent.** `defineAuditConfig()` builds module, extension, schema, and partition options from one configuration. Share actor/tenant policy and masking across manual and automatic records.
- **Require an identifiable actor.** Opt into `actorRequired: true` to require a non-blank actor ID, including for background workers. Authentication and authorization remain part of your app.
- **Reject unsupported returning bulk writes.** Atomic mode now rejects `createManyAndReturn` and `updateManyAndReturn`. Review these operations when upgrading; use supported explicit writes for audited changes.
- **Maintain partitions reliably.** `ensurePartitions()` fixes PostgreSQL `regclass` decoding during partition-existence checks.

Already using audit-log? Review [upgrading to 0.7.0](./installation#upgrading-to-0-7-0) and the [release history](/changelog).

<span id="version-scope"></span>

## Fit and supported scope

The package supports NestJS **10, 11, or 12.0.1+**, PostgreSQL, and Node.js **22.13+ within 22.x or 24.x**. Prisma 7 is the primary target; Prisma 5/6 retain peer compatibility. The runnable example pins NestJS 12.1.1 and Prisma 7.9.1. An existing Prisma 5/6 app can keep its client setup.

::: tip Supported: transaction-first automatic tracking
The Supported claim applies to supported tracked operations through `withAuditTransaction()` with `consistency: 'atomic-required'`. Tracked writes outside the helper fail before execution. Base-client writes, raw SQL, and database cascades are outside automatic coverage; review [nested and bulk operations](./auto-tracking) before extending adoption.
:::

Explicit `best-effort` is non-atomic and outside that support claim. It can leave success records after a caller rolls back, or produce stale transaction-local diffs. For manual events, await `log(input, tx)` and propagate failures from an ordinary transaction callback to roll back the business change.

## Grow after the first verified record

- [NestJS audit log code example](/blog/nestjs-audit-log-without-refactoring) — follow a role change from request to recorded history.
- [Installation](./installation) — shared configuration, audit storage, and NestJS wiring.
- [Query API](./query-api) — tenant-scoped history, filters, and keyset pagination.
- [Streaming export](./streaming-export) and [durable streams](./durable-streams) — exports and checkpointed delivery, including polling limits.
- [Retention](./retention) — append-only storage, privileges, and partition maintenance.
- [Soft-delete integration](./auto-tracking#atomic-soft-delete-lifecycle) — optional lifecycle evidence with compatible extension composition.
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
