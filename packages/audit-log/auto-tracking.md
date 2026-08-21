---
description: "Automatically track Prisma create, update, and delete operations with the @nestarc/audit-log Prisma extension."
---

# Automatic CUD Tracking

::: warning Preview: choose the consistency explicitly
Use `consistency: 'atomic-required'` and run tracked writes inside `withAuditTransaction()` for
authoritative records. Explicit `best-effort` preserves the legacy non-atomic behavior and can leave
orphan rows or stale diffs after caller rollback.
:::

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
| `experimentalTxAudit` | `boolean` | `false` | Deprecated compatibility path available only with `best-effort` |

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

::: warning Soft-delete 0.6 compatibility
Audit-log 0.4 contains the audit side of an atomic lifecycle bridge, but the published
`@nestarc/soft-delete` 0.6.0 package does not expose the matching integration. Keep the deployed
extension order tenancy → soft-delete → audit and use lifecycle events with `AuditService.log()` for
best-effort evidence. For an atomic lifecycle record, perform the equivalent Prisma mutation and
`AuditService.log(input, tx)` in one explicit transaction. The bridge must wait for a compatible
soft-delete release.
:::

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
