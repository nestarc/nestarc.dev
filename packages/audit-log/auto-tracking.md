# Automatic CUD Tracking

Automatic tracking works via Prisma `$extends`. When you use the extended client for business writes, create, update, delete, upsert, and batch operations are automatically tracked.

## Configuration

Tracking behavior is configured through `createAuditExtension(options)`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `trackedModels` | `string[]` | — | Whitelist of Prisma model names to track |
| `ignoredModels` | `string[]` | — | Blacklist (used when `trackedModels` is not set) |
| `sensitiveFields` | `string[]` | `[]` | Fields to mask as `[REDACTED]` in diffs |
| `primaryKey` | `Record<string, string>` | `{ *: 'id' }` | Map of model name to primary key field name |

## Transaction Model

| Path | Caller tx participation | Audit insert |
|------|------------------------|--------------|
| Automatic tracking (extension) | Yes — `query(args)` joins caller's `$transaction` | Best-effort — runs after business write, warns on failure |
| Manual logging (`log(input, tx)`) | Yes — when `tx` provided | Participates in provided transaction |
| Manual logging (`log(input)`) | No | Independent write via base client |

The automatic extension uses Prisma's `query(args)` callback, which preserves the caller's transaction context. The audit insert runs separately via the base client and does not block or fail the business operation. If audit insert fails, a warning is logged.

## Decorators

Apply to individual handlers or entire controllers:

```typescript
@NoAudit()      // Skip audit tracking for this route or controller
@AuditAction('user.role.changed')  // Override auto-generated action name
```

## Multi-Tenancy

If `@nestarc/tenancy` is installed, `tenant_id` is automatically included in all audit records and query filters.

| Scenario | Behavior |
|----------|----------|
| Not installed | `tenant_id` is `null`, library works normally |
| Installed, context available | `tenant_id` auto-injected |
| Installed, context fails | Warning logged, `tenant_id` falls back to `null` |
| `tenantRequired: true` + context fails | `log()` and `query()` throw an error |
