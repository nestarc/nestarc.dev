---
description: "Automatically track Prisma create, update, and delete operations with the @nestarc/audit-log Prisma extension."
---

# Automatic CUD Tracking

::: tip Supported: authoritative automatic tracking
Use `consistency: 'atomic-required'` and run tracked writes inside `withAuditTransaction()` for
Supported authoritative records. Explicit `best-effort` is outside this support claim: it preserves
non-atomic behavior and can leave orphan success rows or stale transaction-local diffs after caller
rollback.
:::

These audit-log 0.7.0 examples require Node.js `^22.13.0 || ^24.0.0` and support NestJS 10, 11, and
12.0.1+.

Automatic tracking works through Prisma `$extends`. Start with one model in `trackedModels`,
then use the audited client for supported create, update, delete, upsert, and bounded deleteMany
operations. The [Incremental Adoption guide](./adoption) shows how to choose your first model.

Writes through a base client, raw SQL, database-side cascades/triggers, unsupported Prisma APIs,
and intentional exclusions are outside automatic coverage. An atomic audit row guarantees that its
supported business mutation and audit work share one transaction.

## Configuration

Tracking behavior is configured through `createAuditExtension(options)` or the second argument to
`createAuditedClient()`. To share actor, tenant, table, and masking policy with manual logs, use
[`defineAuditConfig()`](./installation#shared-configuration) and pass its
`extensionOptions` to either API:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `consistency` | `'atomic-required' \| 'best-effort'` | required | Atomic helper contract or explicit legacy behavior |
| `databaseMapping` | `Record<string, { tableName; schema?; primaryKeyColumn? }>` | `{}` | Database identifiers for atomic row locks when public DMMF mapping is unavailable |
| `maxBatchRecords` | `number` | `1000` | Per-record `deleteMany` cap |
| `batchOverflow` | `'reject' \| 'summary'` | `'reject'` | Best-effort-only summary fallback when `deleteMany` exceeds the cap |
| `trackedModels` | `string[]` | all models when omitted | Allowlist of Prisma model names to track. `trackedModels: []` means no models are audited |
| `ignoredModels` | `string[]` | `[]` | Denylist used only when `trackedModels` is not set |
| `sensitiveFields` | `string[]` | `[]` | Fields to mask as `[REDACTED]` in diffs |
| `sensitiveFieldsByModel` | `Record<string, string[]>` | `{}` | Per-model fields unioned with `sensitiveFields` |
| `primaryKey` | `Record<string, string>` | `{ *: 'id' }` | Map of model name to primary key field name |
| `actorRequired` | `boolean` | `false` | Require a non-blank actor ID; atomic mode rejects before mutation, best-effort skips audit rows |
| `tenantRequired` | `boolean` | `false` | Missing tenant rolls back atomic mutations; best-effort skips the audit row and reports it |
| `tenantResolver` | `() => string \| null` | — | Custom tenant lookup |
| `onAuditError` | `(error, ctx) => void` | — | Structured audit failure callback |
| `logger` | `AuditLogger` | `console` | Logger used for audit warnings and errors |
| `logFailures` | `boolean` | `false` | Record best-effort failure audit rows for business write errors |
| `ignoreTimestampOnlyUpdates` | `boolean` | `false` | Suppress `@updatedAt`-only update entries |
| `prismaModule` | generated Prisma module | legacy `@prisma/client` fallback | Required with the Prisma 7 `prisma-client` generator |

When neither `trackedModels` nor `ignoredModels` is configured, all Prisma models are audited. Set `trackedModels` explicitly to keep a narrow allowlist.

## Transaction Model

Create the standalone client with the transaction-first helper:

```typescript
const prisma = createAuditedClient(basePrisma, {
  consistency: 'atomic-required',
  trackedModels: ['User', 'Invoice'],
  prismaModule,
});

await prisma.withAuditTransaction(
  async (tx) => {
    await tx.user.update({ where: { id }, data: { name: 'After' } });
    await tx.invoice.create({ data: invoice });
  },
  { timeout: 10_000, maxWait: 5_000, isolationLevel: 'Serializable' },
);
```

| Path | Caller tx participation | Audit insert |
|------|------------------------|--------------|
| `atomic-required` + `withAuditTransaction()` | Same official interactive `tx` | Same `tx`; automatic audit failures prevent commit even when caught |
| `atomic-required` outside helper | Rejected before mutation | Not attempted |
| Explicit `best-effort` | Business write keeps caller `$transaction` | Independent base-client insert |
| Manual logging (`log(input, tx)`) | Yes — when `tx` provided | Participates in provided transaction |
| Manual logging (`log(input)`) | No | Independent write via base client |

Atomic mode uses only the official interactive transaction client, locks single-row
update/delete/upsert targets before refreshing their preimage, and fails closed on audit read, tenant-resolution,
or insert errors. HTTP actor extraction has a
separate context setup policy; see [authentication order](./installation#actor-extraction-and-authentication-order).
The helper forwards `timeout`, `maxWait`, and `isolationLevel` and rejects nested helper calls. Models using `@@map`, `@@schema`, or a mapped primary key must supply
`databaseMapping` when Prisma does not expose public mapping metadata.

<span id="published-0-5-0-error-handling"></span>

### Automatic audit failures roll back the helper

Since 0.6.0, `withAuditTransaction()` remembers automatic audit failures and rejects transaction
completion even if the callback catches the error. Earlier business writes and audit rows in that
helper roll back together. This covers audit preparation, read, and insert failures; 0.7.0 also
marks missing-actor policy and unsupported returning-bulk errors as failed helper completion.

Handle failures outside the helper so the application's recovery path is clear:

```typescript
try {
  await prisma.withAuditTransaction(async (tx) => {
    await tx.user.update({ where: { id }, data: { name: 'After' } });
  });
} catch (error) {
  // The helper rejected; report or handle the failed operation here.
  throw error;
}
```

Recoverable business exceptions remain caller-controlled. Explicit manual `AuditService.log()`
has a different boundary: its error must propagate out of the transaction callback for rollback,
even when passed the helper's `tx`. See [Manual Logging](./manual-logging#with-transaction).

### Require an actor when every change needs attribution

Set `actorRequired: true` in the shared factory settings, or on both module and extension options.
It defaults to `false`. All actor types (`user`, `system`, and `api_key`) need a string ID containing
at least one non-whitespace character; valid IDs are stored unchanged.

| Path with an invalid actor | Behavior |
|---|---|
| Tracked atomic write | Rejects before mutation; a caught policy error still prevents helper commit |
| Tracked best-effort write | Preserves the business operation, reports the error, and omits the audit row, including failure rows |
| Explicit manual `log()` | Rejects before INSERT; the caller must propagate the error for rollback |
| Excluded model or `@NoAudit()` automatic write | Retains its intentional tracking exclusion |
| Query, scan, or export | No actor-required write check; tenant scope and host authorization still apply |

Automatic writes snapshot actor identity before the business query, including for per-record bulk
and supported lifecycle records. Use interceptor extraction for Guard-authenticated requests and
`AuditContext.runAs()` for identified workers. The actor policy validates attribution; it does not
authenticate or authorize the caller.

### Migrating from `experimentalTxAudit`

`experimentalTxAudit` was removed in audit-log 0.5; 0.4.1 is the last release that accepts the
option. For authoritative automatic evidence, remove the key, configure
`consistency: 'atomic-required'`, and move each tracked mutation into
`withAuditTransaction()`. If non-atomic behavior is deliberate, remove the key and retain explicit
`consistency: 'best-effort'`.

Typed options containing the removed property fail to compile. During the 0.5.x migration window,
JavaScript or `any` option objects that retain their own `experimentalTxAudit` property—including
`experimentalTxAudit: false`—fail fast at client construction instead of silently changing modes.

## Bulk Mutations

| Operation | `atomic-required` | `best-effort` |
|-----------|-------------------|---------------|
| `createMany` / `updateMany` | Rejected before mutation | Writes a count-level summary row |
| `deleteMany` | Locks and records at most `maxBatchRecords` rows in the same transaction | Writes per-record rows up to the cap |
| `createManyAndReturn` / `updateManyAndReturn` | Rejected before mutation for tracked models, inside or outside the helper; catching the error still rolls back the helper | Business result/error preserved, no audit rows, and a warning once per model/operation per extension instance |

The returning-bulk guard is a 0.7.0 behavior change. Replace those calls with sequential `create()`
or `update()` calls inside the helper; see [Migrating to 0.7.0](./migration). Excluded models and
`@NoAudit()` retain their intentional bypass. Best-effort warning/logger failures do not change
business results, and the guard does not add coverage for raw SQL or future Prisma APIs.

Atomic overflow, count mismatch, or audit-insert failure rolls back the complete `deleteMany`.
Best-effort callers may explicitly set `batchOverflow: 'summary'`; that summary is an activity
marker, not record-level evidence. Array `$transaction([...])` is rejected in atomic mode, so run
sequential single-record operations inside the helper.

## Atomic Soft-Delete Lifecycle

`@nestarc/soft-delete@0.7.4` can route rewritten lifecycle mutations through audit-log 0.7.0's
same official transaction. Apply audit-log before soft-delete and opt into the bridge:

```typescript
const prisma = basePrisma
  .$extends(createAuditExtension({
    consistency: 'atomic-required',
    trackedModels: ['User', 'Post', 'Comment'],
    maxBatchRecords: 1000,
    databaseMapping: {
      User: { tableName: 'users' },
      Post: { tableName: 'posts' },
      Comment: { tableName: 'comments' },
    },
    prismaModule,
  }))
  .$extends(createPrismaSoftDeleteExtension({
    softDeleteModels: ['User', 'Post', 'Comment'],
    auditLifecycle: 'atomic-required',
    auditMaxBatchRecords: 1000,
    cascade: { User: ['Post'], Post: ['Comment'] },
    dmmf: prismaDmmf,
  }));

await prisma.withAuditTransaction((tx) =>
  tx.user.delete({ where: { id } }),
);
```

This fragment assumes the base client, Prisma namespace, public DMMF (`prismaDmmf`), and both
extension factories have been initialized. If tenancy is also composed, it must precede audit-log;
validate its transaction/RLS behavior for the exact package, Prisma, adapter, and pool versions.
Audit tenant metadata alone is not proof of transaction-local RLS isolation.

Configure the same `auditLifecycle`, `auditMaxBatchRecords`, cascade, and DMMF values on
`SoftDeleteModule`. Every soft-delete model, including cascade children, must be tracked and mapped
by audit-log. The bridge covers soft-delete, restore, force-delete/purge, cascade, and supported bulk
lifecycle mutations with `Model.softDeleted`, `Model.restored`, and `Model.purged` rows. Incompatible
extension order, best-effort audit clients, calls outside `withAuditTransaction()`, and batch-cap
overflow fail before mutation. Lifecycle events remain notifications, not authoritative evidence.

## Decorators

Apply to individual handlers or entire controllers:

```typescript
@NoAudit()      // Skip automatic tracking; explicit AuditService.log() still writes
@AuditAction('user.role.changed')  // Override auto-generated action name
```

## Multi-Tenancy

An explicit `tenantResolver` replaces default resolution even when it returns `null`. Without a resolver, the package uses optional `@nestarc/tenancy`, then `null` when that integration is unavailable.

| Scenario | Behavior |
|----------|----------|
| Not installed | `tenant_id` is `null`, library works normally |
| Installed, context available | `tenant_id` auto-injected |
| Automatic tracking with `tenantRequired: false` | Writes an audit row with `tenant_id = null` |
| Atomic tracking with `tenantRequired: true` | Throws and rolls back the business mutation |
| Best-effort tracking with `tenantRequired: true` | Skips the audit row, reports `audit entry skipped`, and returns the business mutation |
| `AuditService.log()` with `tenantRequired: true` | Throws unless tenant context is available; manual log input has no tenant override |
| `AuditService.query()` / `getById()` with `tenantRequired: true` | Throws unless tenant context is available or an explicit `tenantId` / `allTenants: true` scope is provided |

## Nested Writes

Nested relation writes are not synthesized into child audit rows. Atomic mode rejects nested
mutations that target a tracked related model before the business query. Since 0.6.0 this inspection
also traverses untracked parent models and intermediate relations, preventing a tracked child from
being changed through that bypass.

Express each tracked related-model change as a direct operation inside `withAuditTransaction()`.
For example, update an untracked parent and its tracked child through separate `tx.parent.update()`
and `tx.child.update()` calls. The child's direct call then passes through audit tracking.

With public Prisma DMMF relation metadata, a relation whose target and deeper mutation targets are
all excluded does not trigger the guard. Without that metadata the atomic path fails conservatively.
`best-effort` preserves the mutation and can warn, but supplies no child-record evidence.
`@NoAudit()` remains an intentional bypass.
