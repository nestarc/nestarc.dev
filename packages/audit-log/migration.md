---
description: "Upgrade @nestarc/audit-log to 0.7.0: returning bulk guards, optional actor requirements, shared configuration, and changes since 0.5.0."
---

# Migrating to 0.7.0

0.7.0 is published. Upgrade the dependency and lockfile, then review the changes that apply to your
integration. The new factory and actor policy are optional; existing direct registration remains
supported. No audit-table schema migration is required for these API changes.

```bash
npm install @nestarc/audit-log@0.7.0
```

Keep Node.js `^22.13.0 || ^24.0.0`, NestJS 10/11/12.0.1+, and compatible Prisma 5/6/7 dependencies.
For the optional atomic soft-delete bridge, use `@nestarc/soft-delete@0.7.4`; older companion pins
may not accept audit-log 0.7.0. See [Installation](./installation) for the full setup.

## From 0.6.0: replace returning bulk operations in atomic mode

In 0.6.0, `createManyAndReturn` and `updateManyAndReturn` could execute without automatic audit rows
in either consistency mode. In 0.7.0, tracked calls in `atomic-required` reject **before mutation**,
whether invoked inside or outside `withAuditTransaction()`.

Catching that policy error inside the helper still rejects helper completion and rolls back earlier
business changes and audit rows. Replace returning bulk creates with sequential single-record calls:

```typescript
const created = await prisma.withAuditTransaction(async (tx) => {
  const records = [];
  for (const data of users) {
    records.push(await tx.user.create({ data }));
  }
  return records;
});
```

For updates, use explicit record IDs and individual `update()` calls inside the helper. If a manual
business event fits the workflow, you can instead use a base-client transaction and
`AuditService.log(input, tx)`, propagating its errors. That event contains the evidence you supply;
it does not synthesize per-record before/after values.

`best-effort` preserves returning-bulk business results and errors, produces no automatic audit row,
and now warns once per model/operation per extension instance. Logger failures do not change the
business operation. Excluded models and `@NoAudit()` retain their intentional bypass. The guard
covers these two known APIs and does not discover base-client, raw SQL, or future Prisma writes.

## Optional: require identifiable actors

`actorRequired` defaults to `false`. Before enabling it, ensure HTTP users, system workers, and API
keys all have non-blank string IDs. Valid IDs are stored unchanged. Use
`actorExtractionStage: 'interceptor'` when authentication Guards populate `req.user`, and wrap worker
execution in `AuditContext.runAs({ id: 'worker-name', type: 'system' }, callback)`.

| Path with an invalid actor | Result when enabled |
|---|---|
| Tracked atomic write | Rejects before mutation; a caught error still prevents helper commit |
| Tracked best-effort write | Business operation preserved, error reported, audit row omitted |
| Explicit manual `log(input, tx?)` | Rejects before audit INSERT; propagate the error for transaction rollback |
| Read query, scan, or export | No actor-required write check; host authorization and tenant scope still apply |

Enable the setting on both module and extension configurations, or use the factory below. Automatic
tracking exclusions remain exclusions; an explicit `log()` still enforces the module policy even
under `@NoAudit()`.

## Optional: share configuration

Use `defineAuditConfig()` to keep actor, tenant, storage, and masking policy consistent:

```typescript
const config = defineAuditConfig({
  shared: {
    prismaModule: { Prisma },
    actorRequired: true,
    sensitiveFields: ['password'],
  },
  module: {
    actorExtractionStage: 'interceptor',
    actorExtractor,
  },
  extension: {
    consistency: 'atomic-required',
    trackedModels: ['User'],
  },
});

const audited = createAuditedClient(base, config.extensionOptions);
AuditLogModule.forRoot({ ...config.moduleOptions, prisma: base });
// In your migration/setup process:
await applyAuditTableSchema(setupClient, config.schemaOptions);
```

Import the audit APIs from `@nestarc/audit-log` and `Prisma` from your generated client. The host
supplies its authenticated `actorExtractor`, base/setup clients, and Nest provider wiring; see the
[complete installation](./installation#shared-configuration).

Shared fields belong only in `shared`; `module` requires an actor extractor, and an included
`extension` requires explicit consistency. Omit `extension` for manual-only use. For a custom table,
set `shared.tableName`; the factory also returns matching `schemaOptions` and `partitionOptions`.
It performs no client creation, schema application, Nest registration, or scheduling.

The outputs are independent copies of mutable configuration. Later changes or spread overrides do
not synchronize between registrations. Functions, logger instances, and the Prisma namespace keep
their identity.

## Upgrading from 0.5.0

0.7.0 also includes these changes introduced in 0.6.0:

- **Guard-based actor extraction:** opt into `actorExtractionStage: 'interceptor'`. The default
  remains middleware extraction before Guards.
- **Caught automatic audit failures:** the helper remembers audit failures and prevents commit
  even when the callback catches them. Manual `log()` still requires callers to propagate errors.
- **Nested tracked children:** atomic nested-write inspection also traverses untracked parent
  models and intermediate relations. Replace affected nested mutations with direct child writes.
- **Completed scan ranges:** `after === until` completes without replay instead of rejecting.
  Timestamp streams still need reconciliation or CDC if late commits must never be missed.

0.7.0 also fixes `ensurePartitions()` decoding of PostgreSQL `regclass` lookup results, including
custom table options. See [Retention](./retention) for partition maintenance and pruning rules.

## Upgrading from 0.4 or earlier

`experimentalTxAudit` was removed in 0.5.0; 0.4.1 is the last release accepting it and the last
Node.js 20-compatible release. Remove the option, including `false`, and choose a consistency mode.
`consistency` has been required since 0.4.0. Use `atomic-required` with `withAuditTransaction()` for
supported atomic tracking; choose `best-effort` only when independent audit inserts are intentional.

## Verify before rollout

Exercise a committed write, a transaction rollback, the expected actor/tenant values, and sensitive
field masking. When actor requirements are enabled, verify HTTP and worker identities and missing
actor rejection. Catch an automatic policy failure inside the helper and confirm earlier work does
not commit. Also check existing bulk and nested write paths against the new guards.

Continue with the [Quick Start](./quickstart), [Incremental Adoption](./adoption), or the full
[automatic tracking contract](./auto-tracking).
