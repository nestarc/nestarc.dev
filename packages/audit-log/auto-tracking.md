---
description: "Automatically track Prisma create, update, and delete operations with the @nestarc/audit-log Prisma extension."
---

# Automatic CUD Tracking

Automatic tracking works via Prisma `$extends`. When you use the extended client for business writes, create, update, delete, upsert, and batch operations are automatically tracked.

## Configuration

Tracking behavior is configured through `createAuditExtension(options)`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `trackedModels` | `string[]` | all models when omitted | Allowlist of Prisma model names to track. `trackedModels: []` means no models are audited |
| `ignoredModels` | `string[]` | `[]` | Denylist used only when `trackedModels` is not set |
| `sensitiveFields` | `string[]` | `[]` | Fields to mask as `[REDACTED]` in diffs |
| `sensitiveFieldsByModel` | `Record<string, string[]>` | `{}` | Per-model fields unioned with `sensitiveFields` |
| `primaryKey` | `Record<string, string>` | `{ *: 'id' }` | Map of model name to primary key field name |
| `tenantRequired` | `boolean` | `false` | Skip automatic audit rows when tenant context is missing and report the skip; the business mutation still returns |
| `tenantResolver` | `() => string \| null` | — | Custom tenant lookup |
| `onAuditError` | `(error, ctx) => void` | — | Structured audit failure callback |
| `logFailures` | `boolean` | `false` | Record best-effort failure audit rows for business write errors |
| `ignoreTimestampOnlyUpdates` | `boolean` | `false` | Suppress `@updatedAt`-only update entries |

When neither `trackedModels` nor `ignoredModels` is configured, all Prisma models are audited. Set `trackedModels` explicitly to keep a narrow allowlist.

## Transaction Model

| Path | Caller tx participation | Audit insert |
|------|------------------------|--------------|
| Automatic tracking (extension) | Business write keeps caller `$transaction` | Best-effort via the base client; automatic audit inserts do not join the caller transaction |
| Manual logging (`log(input, tx)`) | Yes — when `tx` provided | Participates in provided transaction |
| Manual logging (`log(input)`) | No | Independent write via base client |

The key contract is explicit: automatic audit inserts do not join the caller transaction. If the caller transaction rolls back, the business row rolls back but the automatic audit row can remain as an orphan row. For updates inside an open transaction, automatic before/after diffs are based on committed state visible to the base client, so the diff can be empty or stale.

When transaction consistency matters, use `AuditService.log(input, tx)` for the audit row you need to roll back with the business work. `experimentalTxAudit` is an opt-in experimental path with no semver guarantee.

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
| Automatic tracking with `tenantRequired: true` | Skips the audit row, reports `audit entry skipped`, and the business mutation still returns |
| `AuditService.log()` / `query()` with `tenantRequired: true` | Throws unless tenant context is available or an explicit tenant option is provided |

## Nested Writes

Nested relation writes are not fully audited in `0.2.0`. When a tracked model mutation contains a nested write such as `posts.create`, the extension records the top-level model mutation and emits one logger warning per model/relation.
