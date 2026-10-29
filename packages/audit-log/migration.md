---
description: "Upgrade @nestarc/audit-log to 0.8.0: managed manual transactions, optional validation and diagnostics, SQL Server history, runtime requirements, and compatibility."
---

# Migrating to 0.8.0

Install the published package and update the lockfile:

```bash
npm install --save-exact @nestarc/audit-log@0.8.0
```

Existing PostgreSQL automatic tracking and `log(input, tx?)` remain available. The new manual
validation options are opt-in. PostgreSQL is still the default provider.

## Runtime and companion compatibility

Use Node.js `^22.23.4 || ^24.22.1`, NestJS 10/11/12.0.1+, and compatible Prisma 5/6/7 dependencies.
The Node.js minimum was raised in 0.7.1. Update deployment runtimes and rebuild/restart applications;
changing the npm package does not update a running Node process.

`@nestarc/soft-delete@0.7.5` excludes audit-log 0.8.0 from its optional peer range. This combined
tuple is unsupported. Keep the lifecycle integration scoped to audit-log 0.7.0 / soft-delete 0.7.5
until a published 0.8-compatible companion and lifecycle validation are available; do not bypass strict peer
checks. Standalone audit-log adoption does not depend on soft-delete. See [Installation](./installation).

## From 0.7.x: managed manual transactions

Use the new helper when audit failures must prevent commit even if application code catches them:

```typescript
await audit.withManualTransaction(base, async ({ tx, log }) => {
  const invoice = await tx.invoice.update({ where: { id }, data: { status: 'approved' } });
  await log({ action: 'invoice.approved', targetType: 'Invoice', targetId: invoice.id });
  return invoice;
});
```

The helper binds `log` to its transaction, settles started writes before completing, and rejects
writer use after callback completion or abort. Business writes must use its `tx`. Nested managed
helpers are unsupported; the helper cannot detect missing event calls or enlist a captured base
client. Keep `audit.log(input, tx)` for a caller-owned transaction and propagate its errors.

## Opt into validation and diagnostics

Add `strictManualValidation`, `maxMetadataBytes`, and `onAuditOperation` to the factory's `module`
section or direct module options. Existing defaults remain unchanged. Before enabling strict
validation, check event names, identifiers, and metadata for the JSON contract; invalid events throw
`AuditInputError` before INSERT. A metadata byte budget measures final redacted JSON, including
merged context metadata, and rejects oversized values rather than truncating them.

`onAuditError` now reports rejected manual validation, context, tenant-resolution, serialization,
and INSERT failures with phase/code/duration. Review telemetry handling for the expanded event set.
`onAuditOperation` exposes outcomes without event contents; a successful log event means INSERT
completion, while the managed transaction emits its own final outcome. Observer failures preserve
business control flow. See [Manual Logging](./manual-logging) for examples and error semantics.

## SQL Server history and storage

SQL Server manual logging and schema utilities were added in 0.7.1. Version 0.8.0 adds managed manual
transactions, `query()`, `getById()`, provider capabilities, optional read indexes, and read-only
storage inspection. Set `shared.provider: 'sqlserver'` and omit the automatic extension.

History reads need an authorized identity with SELECT privileges. New read indexes are an explicit
schema operation; upgrading npm does not install them. SQL Server automatic tracking, scan/export,
retention, partitioning, GIN indexes, and rule enforcement remain unsupported. Existing PostgreSQL
storage needs no schema change for the new manual APIs. Follow [SQL Server](./sql-server) for setup,
opaque cursor handling, and permissions.

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

When upgrading past 0.5.0, retain these changes introduced in 0.6.0:

- **Guard-based actor extraction:** opt into `actorExtractionStage: 'interceptor'`. The default
  remains middleware extraction before Guards.
- **Caught automatic audit failures:** the helper remembers audit failures and prevents commit
  even when the callback catches them. Caller-owned manual `log()` still requires callers to propagate errors.
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
not commit. For managed manual transactions, catch a validation or audit failure and confirm earlier
writes roll back; verify enabled byte limits and observer failures. Also check bulk and nested write
paths against the automatic guards. SQL Server deployments should verify authorized history reads
and real storage permissions, not only capability flags or metadata inspection.

Continue with the [Quick Start](./quickstart), [Incremental Adoption](./adoption), or the full
[automatic tracking contract](./auto-tracking).
