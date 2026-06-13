---
description: "Partition and prune @nestarc/audit-log storage with trigger enforcement, monthly partitions, and explicit retention jobs."
---

# Retention & Partitioning

Version `0.2.0` adds dynamic audit table DDL, optional monthly partitioning, and explicit retention maintenance.

## Schema Utilities

| Function | Description |
|----------|-------------|
| `getAuditTableSQL(options?)` | Returns raw SQL for audit tables, trigger enforcement, optional partitions, and indexes |
| `getAuditTableStatements(options?)` | Returns SQL split into individual executable statements |
| `applyAuditTableSchema(prisma, options?)` | Executes generated SQL statement by statement via Prisma |
| `ensurePartitions(prisma, options?)` | Creates missing monthly partitions for partitioned audit tables |

```typescript
import { applyAuditTableSchema } from '@nestarc/audit-log';

await applyAuditTableSchema(prisma, {
  tableName: 'audit.audit_logs',
  partitioned: true,
  ginIndex: true,
});
```

`tableName` may be schema-qualified. Invalid table names are rejected before SQL is executed.

## Partitioned Tables

`getAuditTableSQL({ partitioned: true })` creates a monthly `PARTITION BY RANGE (created_at)` layout with trigger enforcement and initial UTC month partitions.

Keep future partitions available from application bootstrap or a daily maintenance job:

```typescript
import { ensurePartitions } from '@nestarc/audit-log';

await ensurePartitions(maintenancePrisma, {
  tableName: 'audit.audit_logs',
  ahead: 1,
});
```

`ahead` is the number of future monthly partitions to ensure. For example, `ahead: 1` keeps the current and next month available.

## Pruning

Retention is explicit. `AuditService.prune({ olderThan })` deletes old rows on flat tables and drops fully expired monthly partitions on partitioned tables.

```typescript
await auditService.prune({
  olderThan: new Date(Date.now() - 90 * 24 * 3600 * 1000),
  dryRun: true,
});
```

Use `dryRun: true` to inspect targets before deleting anything. Pass `client` when retention should run through a privileged maintenance connection:

```typescript
await auditService.prune({
  olderThan: new Date(Date.now() - 90 * 24 * 3600 * 1000),
  client: maintenancePrisma,
});
```

Flat pruning temporarily disables the delete trigger, or drops and recreates the legacy delete rule, inside one interactive transaction. Partitioned pruning never deletes partial months; it only drops or detaches partitions whose upper bound is at or before `olderThan`.

## Append-Only Enforcement

Append-only enforcement now defaults to fail-loud PostgreSQL triggers. Legacy rule enforcement is still available when requested:

```typescript
await applyAuditTableSchema(prisma, {
  enforcement: 'rule',
});
```

Use the trigger default unless you have an existing migration path that depends on silent `RULE` behavior.

