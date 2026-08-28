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

These audit-log 0.5 examples require Node.js `^22.13.0 || ^24.0.0` and support NestJS 10, 11, and
12.0.1+.

Automatic tracking works via Prisma `$extends`. When you use the extended client for business writes, create, update, delete, upsert, and batch operations are automatically tracked.

## Configuration

Tracking behavior is configured through `createAuditExtension(options)`:

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
| `atomic-required` + `withAuditTransaction()` | Same official interactive `tx` | Same `tx`; failures roll back business and audit work |
| `atomic-required` outside helper | Rejected before mutation | Not attempted |
| Explicit `best-effort` | Business write keeps caller `$transaction` | Independent base-client insert |
| Manual logging (`log(input, tx)`) | Yes — when `tx` provided | Participates in provided transaction |
| Manual logging (`log(input)`) | No | Independent write via base client |

Atomic mode uses only the official interactive transaction client, locks single-row
update/delete/upsert targets before refreshing their preimage, and fails closed on read, context,
or insert errors. The helper forwards `timeout`, `maxWait`, and `isolationLevel` and rejects nested
helper calls. Models using `@@map`, `@@schema`, or a mapped primary key must supply
`databaseMapping` when Prisma does not expose public mapping metadata.

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
| `createManyAndReturn` / `updateManyAndReturn` | Outside the tracking contract | Outside the tracking contract |

Atomic overflow, count mismatch, or audit-insert failure rolls back the complete `deleteMany`.
Best-effort callers may explicitly set `batchOverflow: 'summary'`; that summary is an activity
marker, not record-level evidence. Array `$transaction([...])` is rejected in atomic mode, so run
sequential single-record operations inside the helper.

## Atomic Soft-Delete Lifecycle

`@nestarc/soft-delete` 0.7.1 can route rewritten lifecycle mutations through audit-log 0.5's same
official transaction. Apply extensions in the fixed order tenancy → audit-log → soft-delete and opt
into the bridge on soft-delete:

The combined 0.5.0/0.7.1 bridge's shared NestJS peer range is 10/11; audit-log alone additionally
supports NestJS 12.0.1+.

```typescript
const prisma = basePrisma
  .$extends(createPrismaTenancyExtension(tenancyService, {
    interactiveTransactionSupport: true,
    failClosed: true,
  }))
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

This opts into tenancy's interactive-transaction path so its transaction-local tenant state reaches
the audit transaction. Validate that path against the exact Prisma release, driver adapter, and
connection-pool mode deployed by the application.

Configure the same `auditLifecycle`, `auditMaxBatchRecords`, cascade, and DMMF values on
`SoftDeleteModule`. Every soft-delete model, including cascade children, must be tracked and mapped
by audit-log. The bridge covers soft-delete, restore, force-delete/purge, cascade, and supported bulk
lifecycle mutations with `Model.softDeleted`, `Model.restored`, and `Model.purged` rows. Incompatible
extension order, best-effort audit clients, calls outside `withAuditTransaction()`, and batch-cap
overflow fail before mutation. Lifecycle events remain notifications, not authoritative evidence.

## Decorators

Apply to individual handlers or entire controllers:

```typescript
@NoAudit()      // Skip audit tracking for this route or controller
@AuditAction('user.role.changed')  // Override auto-generated action name
```

## Multi-Tenancy

Tenant resolution uses this order: explicit `tenantResolver`, optional `@nestarc/tenancy`, then `null`.

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

Nested relation writes are not synthesized into child audit rows. In `atomic-required`, a nested
write targeting a tracked related model is rejected before the business mutation; express each
related-model change explicitly inside `withAuditTransaction()`. `best-effort` preserves the
top-level mutation and emits a warning, so it is not authoritative evidence for the nested changes.
