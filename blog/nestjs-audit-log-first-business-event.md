---
title: "Start Your NestJS Audit Trail with One Business Event"
date: 2026-09-29
description: "Add a role-change event to an existing NestJS and Prisma transaction. Try audit-log 0.7.0, verify the record and rollback, then expand coverage."
author: nestarc
reviewed: 2026-09-29
versionScope: "@nestarc/audit-log 0.7.0; runnable example pins NestJS 12.1.1 and Prisma 7.9.1 with PostgreSQL; Node.js ^22.13.0 || ^24.0.0"
---

# Start Your NestJS Audit Trail with One Business Event

“This user was a member yesterday. Who made them an admin?”

An access log might tell you that someone called your role endpoint. To answer the customer, you also need the operator, the affected user, the tenant, the previous role, and whether the change actually committed.

That is a useful first audit feature: a history entry your support team can use to explain one important change. You can add it to an existing NestJS and Prisma transaction with `@nestarc/audit-log`, keeping your current Prisma client and recording an explicit business event.

**[Run the 0.7.0 example](/packages/audit-log/quickstart)** and try `npm run smoke:manual`. It checks a role-change event and rollback before you integrate the package into your app.

## Choose the first question your history should answer

Start with a workflow that already generates support questions: a role change, an approval, or an account setting update. Pick one operation with a clear actor and target, then decide what a reader needs to understand it.

For a role change, the useful record looks like this. These are selected fields with illustrative IDs:

```json
{
  "action": "user.role.changed",
  "source": "manual",
  "actorId": "operator-42",
  "tenantId": "tenant-1",
  "targetType": "User",
  "targetId": "user-7",
  "metadata": {
    "role": { "before": "member", "after": "admin" }
  }
}
```

The event name explains the business action. The target identifies whose role changed. The actor identifies who performed it. Keeping the event in the same transaction as the update connects that explanation to a committed change.

A manual event uses the metadata your application supplies. It does not compute field diffs automatically; the role pair above belongs in `metadata.role`.

## Run one event before changing your app

The [downloadable example](/examples/audit-log-0.7.0.zip) installs the published **0.7.0** package and includes source, migrations, and a lockfile. You need Node.js **22.13+ within 22.x or 24.x**, npm, and Docker Compose. The included disposable PostgreSQL database uses local port **5433**.

Run these commands in a new directory:

```sh
curl -fL https://nestarc.dev/examples/audit-log-0.7.0.zip \
  -o audit-log-0.7.0.zip
unzip audit-log-0.7.0.zip
cd audit-log-quick-start
cp .env.example .env
docker compose up -d --wait
npm ci --strict-peer-deps
npm run db:setup
npm run smoke:manual
```

The manual check creates no audited client or automatic extension. It changes a user's role, writes the event, and reads it back. Then it attempts another change, throws an error, and confirms that both the second change and its event rolled back.

Its expected summary is:

```json
{
  "mode": "manual-only",
  "action": "user.role.changed",
  "actorId": "demo-operator",
  "tenantId": "demo-tenant",
  "role": { "before": "member", "after": "admin" },
  "password": "[REDACTED]",
  "rollback": "passed"
}
```

This is the test summary, not a stored row. The password assertion exercises masking of sensitive metadata. The demo actor and tenant are fixed example identities; your application must supply authenticated identity and authorized tenant context.

Read `src/manual-role.ts` for the business operation and `src/manual-smoke.ts` for the assertions. When finished, run `docker compose down` from the example directory to remove the disposable database and its demonstration data. See the [Quick Start](/packages/audit-log/quickstart) for an alternative database connection or the HTTP example.

## Keep the event in the business transaction

In your existing app, first follow [installation](/packages/audit-log/installation) to create audit storage and register `AuditLogModule` with your base Prisma client. For this path, you can omit the `extension` section from `defineAuditConfig()`.

The following integration excerpt assumes an injected `AuditService` named `audit`, a base Prisma client named `base`, and a `User` model with `id`, `tenantId`, and `role`. Authentication, permission checks, and trusted actor/tenant context are established before this operation; `userId` and `tenantId` identify an authorized target.

```typescript
await base.$transaction(async (tx) => {
  const before = await tx.user.findUniqueOrThrow({
    where: { id: userId, tenantId },
  });
  const after = await tx.user.update({
    where: { id: userId, tenantId },
    data: { role: 'admin' },
  });

  await audit.log({
    action: 'user.role.changed',
    targetType: 'User',
    targetId: userId,
    metadata: {
      role: { before: before.role, after: after.role },
    },
  }, tx);

  return after;
});
```

The transaction client passed as the second argument is essential. `audit.log(input, tx)` participates in the business transaction. Calling `audit.log(input)` instead writes independently, so a later business rollback can leave an event behind.

Await the audit call and let its errors escape the transaction callback. Catching a JavaScript audit policy error inside an ordinary Prisma transaction can allow the business update to commit. This manual path depends on the caller preserving that failure boundary.

The read and update above share a transaction, but concurrent role changes can still require application-owned locking or stronger isolation. Choose that policy before treating an application-supplied `before` value as authoritative under concurrent writes.

### What 0.7.0 adds to this starting point

`defineAuditConfig()` gives the Nest module and storage setup one source of settings. When you add automatic tracking later, it can use the same actor/tenant policy and sensitive-field masking. The factory produces options; you still register the module and apply the schema.

Enable the new `actorRequired: true` option to reject a manual event with a missing or blank actor ID. It defaults to `false`. Combined with an awaited audit call whose errors propagate, this lets the transaction fail when it cannot attribute the change. The [existing-app guide](/packages/audit-log/adoption#prepare-the-shared-configuration) shows this alongside `tenantRequired: true`, trusted tenant resolution, and actor extraction after NestJS Guards.

These policies validate audit context. Your application still owns authentication, authorization, and the tenant predicates on business queries.

## Decide what a passing trial means

A successful install is only the beginning. Before enabling the workflow for users, verify these outcomes in your own application:

| Check | Expected result |
| --- | --- |
| Change an authorized user's role | One manual event identifies the correct actor, tenant, target, and supplied role values. |
| Include a configured sensitive metadata field | The stored value is `[REDACTED]`. |
| Throw after the change and audit call | Neither the attempted change nor its new event survives. |
| Omit the actor with `actorRequired: true` | The audit call rejects; the propagated error rolls back the business change. |
| Request history without permission | Application authorization rejects the request before querying audit records. |

After authorizing a history request, query the tenant and target together:

```typescript
const history = await audit.query({
  tenantId,
  targetType: 'User',
  targetId: userId,
  action: 'user.role.changed',
  source: 'manual',
  includeTotal: false,
});
```

A tenant filter scopes the query; it does not grant permission to read it. The runnable example gives you a starting set of assertions to adapt to your own identity and authorization flow.

## Expand from the first useful answer

If another workflow needs a business explanation, add another explicit event. You can keep using your existing transactions and choose the event names and metadata that make sense to your users.

When you need automatic field changes across a selected Prisma model, move its supported writes through an audited client and `withAuditTransaction()`. That path produces `source: 'auto'` and `changes.role`. The [Prisma audit-log code example](/blog/nestjs-audit-log-without-refactoring) covers its setup and transaction boundaries. Adding a manual event to an automatically tracked mutation deliberately produces two records with different meanings.

Coverage grows with the write paths you integrate. Explicit manual calls cover those events; automatic tracking covers supported writes through the audited client. Inventory jobs, scripts, raw SQL, and other mutation paths before claiming complete history.

**[Add one business event to your app](/packages/audit-log/adoption#log-one-business-event)**, or **[run the 0.7.0 example first](/packages/audit-log/quickstart)**. Make the first milestone concrete: one important change you can explain, with a record that survives only when the change commits.
