---
description: "Operate @nestarc/audit-log retention safely with monthly partitions, stream checkpoint guards, rollback-safe flat pruning, and separated database roles."
---

# Retention & Partitioning

Retention is explicit: the package never schedules deletion. Run `ensurePartitions()` and
`AuditService.prune()` from a controlled maintenance job, using a database identity that is not
available to the request-serving application.

## Create and maintain the layout

```typescript
import {
  applyAuditTableSchema,
  ensurePartitions,
} from '@nestarc/audit-log';

await applyAuditTableSchema(maintenancePrisma, {
  tableName: 'audit.audit_logs',
  partitioned: true,
  ginIndex: true,
});

// Run at bootstrap or from a daily maintenance job.
await ensurePartitions(maintenancePrisma, {
  tableName: 'audit.audit_logs',
  ahead: 1,
});
```

`partitioned: true` creates monthly UTC range partitions. `ahead: 1` ensures the current and next
month exist. Prefer generated SQL in a reviewed migration for production; the helpers are useful for
setup and controlled maintenance. Schema-qualified table names are supported, and invalid
identifiers are rejected before SQL runs.

## Inspect, then prune

Start every policy change with a dry run:

```typescript
const cutoff = new Date('2026-05-01T00:00:00.000Z');

const preview = await auditService.prune({
  olderThan: cutoff,
  dryRun: true,
  client: maintenancePrisma,
});

logger.info({ preview }, 'audit retention preview');
```

After reviewing the target and coordinating downstream consumers, run the same cutoff without
`dryRun`:

```typescript
const result = await auditService.prune({
  olderThan: cutoff,
  client: maintenancePrisma,
  timeoutMs: 60_000,
  maxWaitMs: 10_000,
});
```

The result reports the detected layout, effective mode, affected partition names or row count, and
whether the operation was a dry run:

```typescript
interface AuditPruneResult {
  layout: 'flat' | 'partitioned';
  mode: 'drop' | 'detach' | 'delete';
  prunedPartitions: string[];
  deletedRows: number | null;
  dryRun: boolean;
}
```

### Flat tables

Rows with `created_at < olderThan` are deleted. The service first discovers enforcement on the
target table. It then uses one interactive transaction to temporarily disable the delete trigger (or
remove the legacy delete rule), delete rows, and restore enforcement. PostgreSQL rolls all of those
transactional steps back together on failure.

Version 0.4 scopes trigger and rule discovery to the target table OID, so a same-named object on
another table cannot select the maintenance path. It also validates `olderThan`, `timeoutMs`, and
`maxWaitMs` before database work. The timeout defaults are 60 seconds and 10 seconds respectively.

::: warning Flat pruning takes an exclusive lock
Changing trigger or rule enforcement takes an `ACCESS EXCLUSIVE` table lock. Use monthly
partitioning for large audit tables and schedule flat pruning away from request traffic.
:::

### Partitioned tables

Only complete monthly partitions whose upper bound is at or before `olderThan` are selected. A
partial month is never row-deleted.

```typescript
await auditService.prune({
  olderThan: cutoff,
  mode: 'detach',
  client: maintenancePrisma,
});
```

`mode: 'drop'` is the default and destroys each selected partition. `mode: 'detach'` removes it from
the parent table but retains the table for an externally managed archive workflow. Partition
operations run one at a time; an error reports which earlier partitions already succeeded.

## Protect required stream checkpoints

A retention cutoff must not pass the slowest required durable consumer. Load every required stream
state, reject missing checkpoints in host policy, and pass all non-null ACK checkpoints to `prune()`:

```typescript
const requiredStreamIds = [
  'tenant-1-primary-siem',
  'tenant-1-compliance-archive',
];

const states = await Promise.all(
  requiredStreamIds.map((streamId) => streamStore.load(streamId)),
);

if (states.some((state) => !state?.checkpoint)) {
  throw new Error('retention blocked: a required audit stream has no ACK checkpoint');
}

await auditService.prune({
  olderThan: cutoff,
  client: maintenancePrisma,
  requiredCheckpoints: states.map((state) => state!.checkpoint!),
});
```

`requiredCheckpoints` accepts opaque `scan()` checkpoint strings. Version 0.4 rejects the call
before maintenance if `olderThan` is later than any supplied checkpoint timestamp. It cannot know
which streams are mandatory, and omitting a stream disables its protection. Coordinate the stream
state read and prune job in your host, and make a required stream with no checkpoint a hard block.

For an archive that must leave the live partitioned table sooner, use an externally managed
detach-first workflow, tail the detached storage, verify delivery, and only then drop it. See
[`AuditStreamRunner`](./durable-streams) for checkpoint behavior.

## Separate runtime and maintenance privileges

Append-only row triggers fail loudly on ordinary `UPDATE` and `DELETE`, but they are not a database
privilege boundary. PostgreSQL `TRUNCATE` does not invoke row triggers, and a table owner or
superuser can alter or disable triggers, drop the table, or bypass other controls.

Use a non-login owner role, a narrowly granted runtime login, and a separately protected
owner-capable maintenance connection:

```sql
CREATE ROLE audit_owner NOLOGIN;
-- Login-role provisioning and secret delivery are environment-specific.

ALTER TABLE audit.audit_logs OWNER TO audit_owner;
ALTER FUNCTION audit.audit_logs_block_mutation() OWNER TO audit_owner;

REVOKE ALL ON TABLE audit.audit_logs FROM PUBLIC;
REVOKE ALL ON TABLE audit.audit_logs FROM app_runtime;
GRANT SELECT, INSERT ON TABLE audit.audit_logs TO app_runtime;
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE audit.audit_logs FROM app_runtime;
```

Do not grant the runtime identity membership in `audit_owner`, database superuser, schema `CREATE`,
or an owner-capable maintenance credential. Alert on `ALTER TABLE`, `DROP TABLE`, `TRUNCATE`, and
audit-trigger changes, then test the grants after every migration. An optional `BEFORE TRUNCATE FOR
EACH STATEMENT` trigger can prevent accidental owner-side truncation, but an owner can disable it;
owner separation plus `REVOKE TRUNCATE` is the authoritative control.

## Maintenance checklist

- Choose the cutoff with security, privacy, incident-response, and legal owners.
- Confirm future partitions exist before the UTC month boundary.
- Dry-run and record the exact result without logging audit payloads.
- Block on every required stream's last ACK checkpoint.
- Use the maintenance identity only for the bounded job.
- Monitor lock wait, duration, partial partition success, and enforcement restoration.
- Re-test append-only `UPDATE`, `DELETE`, and runtime `TRUNCATE` denial after maintenance.
