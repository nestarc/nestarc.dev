---
title: Adopt Audit Logging One Workflow at a Time
description: "Add @nestarc/audit-log 0.7.0 to an existing NestJS app: start with a manual business event or automatic field changes for one Prisma model."
---

# Adopt one workflow at a time

Start with an existing NestJS, Prisma, and PostgreSQL application. Choose a business event when you want explicit activity such as “role changed”; choose automatic tracking when you need field-level diffs for a model.

| Start with | Change in your app | Result |
| --- | --- | --- |
| [One business event](#log-one-business-event) | Add `await audit.log(input, tx)` to an existing transaction | Your event name and metadata |
| [One Prisma model](#track-one-prisma-model) | Configure an audited client and use `withAuditTransaction()` on its write path | Automatic before/after field changes |

Want to try both first? [Run the downloadable 0.7.0 example](./quickstart). It verifies actor, tenant, masking, role changes, and rollback.

## Prepare the shared configuration

Install the published version in your existing app:

```sh
npm install --save-exact @nestarc/audit-log@0.7.0
```

Keep your application's Prisma version and client setup. Follow [installation](./installation) to create the audit table and register `AuditLogModule` with your **base** Prisma client. The snippets below assume a `User` model with `id`, `tenantId`, and `role`, an injected `AuditService` named `audit`, and an authorized `userId` and `tenantId`.

In 0.7.0, `defineAuditConfig()` keeps table names, tenant policy, actor policy, and masking consistent. A manual-only configuration does not need an extension:

```typescript
import { defineAuditConfig } from '@nestarc/audit-log';
import { Prisma } from './generated/prisma/client';

export const auditConfig = defineAuditConfig({
  shared: {
    prismaModule: { Prisma },
    tableName: 'audit_logs',
    sensitiveFields: ['password'],
    actorRequired: true,
    tenantRequired: true,
    tenantResolver: () => tenantScope.getStore()?.tenantId ?? null,
  },
  module: {
    actorExtractionStage: 'interceptor',
    actorExtractor: req => ({ id: req.user?.id ?? null, type: 'user' }),
  },
});
```

Here `tenantScope` is your application-owned, authorized tenant context. Adapt the Prisma import to your generated client. Pass `auditConfig.moduleOptions` to Nest registration and `auditConfig.schemaOptions` to your setup script as shown in [installation](./installation). The factory builds options; it does not create a client, register a module, or apply database schema.

`actorExtractionStage: 'interceptor'` reads the identity after successful authentication Guards. `actorRequired` rejects an empty actor ID; it does not authenticate the request. Establish tenant context and authorize the operation before writing. Audit tenant configuration does not add tenant filters to your business queries.

## Log one business event

Keep the existing base client and ordinary `$transaction()`. No automatic extension is needed. Add the event to the same transaction as the role change:

```typescript
await base.$transaction(async tx => {
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

The record has `source: 'manual'`, action `user.role.changed`, and your supplied before/after values in `metadata.role`. Manual logging does not calculate `changes` automatically. Your app's concurrency requirements may also need locking or stronger transaction isolation around the read and update.

::: warning Propagate manual audit failures
Await `log(input, tx)` and let its errors escape the transaction callback. Catching a JavaScript policy error inside an ordinary Prisma transaction can allow the business change to commit. The automatic helper's failure marker does not apply to arbitrary transactions.
:::

In the example, `npm run smoke:manual` checks a successful `member → admin` event, actor/tenant attribution, metadata redaction, absence of automatic rows, and rollback of a second role change and its event. See [manual logging](./manual-logging) for other events and worker context.

## Track one Prisma model

When field-level changes are useful, add an `extension` section to the same `defineAuditConfig()` call:

```typescript
extension: {
  consistency: 'atomic-required',
  trackedModels: ['User'],
  databaseMapping: { User: { tableName: 'users' } },
},
```

Use the actual database table name from your Prisma mapping (`@@map("users")` in the example). Create an audited view of the same base client:

```typescript
import { createAuditedClient } from '@nestarc/audit-log';

const audited = createAuditedClient(base, auditConfig.extensionOptions);
```

On the selected write path, replace `$transaction()` with `withAuditTransaction()` and use the callback's `tx`:

```typescript
await audited.withAuditTransaction(tx =>
  tx.user.update({
    where: { id: userId, tenantId },
    data: { role: 'admin' },
  }),
);
```

The role-change record contains `action: 'User.updated'`, `source: 'auto'`, and `changes.role: { before: 'member', after: 'admin' }`. The module continues using the base client for audit storage and queries.

Supported automatic writes and their audit rows commit or roll back together. If a tracked write fails an atomic audit policy, the helper rejects even if the callback catches that failure. Writes through a captured base client do not gain automatic coverage merely because they occur inside the callback.

Choose the manual and automatic role-change examples as separate starting paths. Adding a manual event to an automatically tracked update deliberately creates two records with different meanings.

## Verify the first record

After authorizing access to the user's history, query its tenant and target:

```typescript
const page = await audit.query({
  tenantId,
  targetType: 'User',
  targetId: userId,
  includeTotal: false,
});
```

Check the following before expanding coverage:

1. **Actor and tenant:** the recorded IDs match the authenticated operator and authorized tenant.
2. **Target and change:** the selected user has `member → admin` in `metadata.role` for manual events, or `changes.role` for automatic tracking.
3. **Masking:** sensitive values are `[REDACTED]` in the configured metadata/diff fields.
4. **Rollback:** throw an error after the write inside the transaction, then confirm both the business change and its new audit record are absent.
5. **Access:** reject unauthorized history requests before calling `query()`. A tenant filter is a query scope, not authorization.

The [Quick Start assertions](./quickstart#verify-both-adoption-paths) are a starting point for your own integration tests.

## Cover the next write path deliberately

Inventory API handlers, jobs, scripts, and related-model writes that change the chosen model. For workers, use `AuditContext.runAs()` with a stable actor ID and establish the authorized tenant context separately; `runAs()` only supplies the actor.

| Boundary | What to review |
| --- | --- |
| Nested writes | Use explicit supported operations for tracked children; untracked parents can still contain tracked nested writes. |
| Bulk writes | Atomic `createMany`, `updateMany`, `createManyAndReturn`, and `updateManyAndReturn` are rejected. Use bounded explicit writes in the helper; `deleteMany` has a record cap. |
| Base client, raw SQL, database cascades | These bypass automatic tracking. Inventory them before claiming complete model coverage. |
| Exclusions | Untracked models and `@NoAudit()` paths do not generate automatic records. Explicit manual events remain explicit calls. |
| Best-effort | It is non-atomic and may retain success records or stale transaction-local diffs after rollback. |

Review the [automatic tracking contract](./auto-tracking) for supported operations and optional soft-delete integration. Once the first workflow is verified, add [history queries](./query-api), [exports](./streaming-export), or [retention](./retention) as needed.
