---
description: "Record manual events on PostgreSQL or SQL Server with audit-log 0.8.0 managed transactions, optional validation, metadata budgets, and operation diagnostics."
---

# Manual Logging

Use `AuditService.log()` for business events such as an invoice approval, role change, or export.
You can start with one event in an existing transaction without installing the Prisma extension.
Published 0.8.0 supports this path on PostgreSQL and SQL Server. See [Incremental Adoption](./adoption)
for the first event or [SQL Server](./sql-server) for provider setup.

## Basic Usage

```typescript
await auditService.log({
  action: 'invoice.approved',
  targetId: 'inv-123',
  targetType: 'Invoice',
  metadata: { amount: 5000, currency: 'USD' },
});
```

Manual events have `source: 'manual'`. To read the event above, use matching source and action values:

```typescript
const page = await auditService.query({
  tenantId: 'tenant-1',
  action: 'invoice.approved',
  source: 'manual',
  includeTotal: false,
});
```

## Authenticated requests and background jobs

When a NestJS Guard populates `req.user`, choose `actorExtractionStage: 'interceptor'` so actor
extraction happens after successful authentication and before the handler:

```typescript
AuditLogModule.forRoot({
  prisma: basePrisma,
  prismaModule,
  actorExtractionStage: 'interceptor',
  actorRequired: true,
  actorExtractor: (req) => ({
    id: req.user?.id ?? null,
    type: req.user ? 'user' : 'system',
    ip: req.ip,
  }),
});
```

The stage option is available since 0.6.0; the default is still `'middleware'`, before Guards.
Writes inside a Guard precede interceptor-stage extraction. The module reports extraction errors
and continues with a null actor; host authentication must reject unauthorized requests.
`actorRequired: true` rejects a reached `log()` call if identity is missing, while reads remain
unaffected. If you turn off global interceptor registration, bind `AuditInterceptor` yourself.

Jobs have no HTTP extraction. Establish an identified system actor around the async work:

```typescript
import { AuditContext } from '@nestarc/audit-log';

await AuditContext.runAs({ id: 'invoice-worker', type: 'system' }, async () => {
  AuditContext.setMetadata({ jobId: 'job-42' });
  AuditContext.setReason('Scheduled reconciliation');
  await auditService.log({
    action: 'invoice.reconciled',
    targetType: 'Invoice',
    targetId: 'inv-123',
  });
});
```

`log()` resolves tenancy from the configured resolver or optional tenancy integration. Actor
context does not establish a tenant; jobs must establish their host-owned tenant context separately.
`@NoAudit()` skips automatic tracking, while an explicit `log()` call still writes an event and
still enforces the module's actor policy. `@AuditAction()` does not replace `input.action`.

## Require an identified actor

Introduced in 0.7.0, `actorRequired` defaults to `false`. When enabled, `user`, `system`, and `api_key`
actors all need a string ID containing at least one non-whitespace character. Null, empty, and
whitespace-only IDs reject before the audit INSERT. Valid IDs are stored unchanged, without trimming.
The default permits records with `actorId: null` and `actorType: 'system'` when no context exists.

To use the same actor, tenant, storage, and masking settings for manual and automatic records,
configure [`defineAuditConfig()`](./installation#shared-configuration). Module and
extension registrations otherwise remain independent. The actor policy validates attribution;
it does not authenticate or authorize a user.

## Managed manual transactions

In 0.8.0, `withManualTransaction()` creates an official Prisma interactive transaction and gives
you a typed transaction client and a bound manual writer:

```typescript
const invoice = await auditService.withManualTransaction(prisma.base, async ({ tx, log }) => {
  const updated = await tx.invoice.update({
    where: { id },
    data: { status: 'approved' },
  });
  await log({ action: 'invoice.approved', targetType: 'Invoice', targetId: id });
  return updated;
}, { maxWait: 5_000, timeout: 10_000 });
```

The business write and event commit or roll back together. An audit failure prevents commit even
when the callback catches it. Callback errors also roll back and remain the thrown error. Await
each `log()` for sequencing; the helper settles already-started writes before completing and
rejects new writer calls after the callback ends or the transaction aborts. Do not give the writer
to timers or detached tasks. Nested managed manual transactions are rejected.

Use the supplied `tx` for every business write. A captured base client is not enlisted, and the
helper cannot detect that your code forgot to record an event. This manual path does not produce
automatic diffs. It supports PostgreSQL and SQL Server without enabling SQL Server automatic tracking.

`maxWait` and `timeout` are positive safe integers in milliseconds. Choose an `isolationLevel`
supported by the installed Prisma version, adapter, and database. The SQL Server Prisma 7.10.0
validation tuple rejects `Snapshot` before running the callback; the helper does not retry or
fall back to another level.

<span id="with-transaction"></span>

## Caller-owned transactions

```typescript
await prisma.base.$transaction(async (tx) => {
  await tx.invoice.update({ where: { id }, data: { status: 'approved' } });
  await auditService.log({
    action: 'invoice.approved',
    targetType: 'Invoice',
    targetId: id,
  }, tx);
  // Let errors escape this callback so both changes roll back together.
});
```

Pass `tx` explicitly and let `log()` errors escape the callback. Catching and suppressing a
JavaScript actor-policy error can allow a normal Prisma transaction to commit its other business
changes without the manual event. Manual `log()` does not mark the automatic helper as failed,
even when passed a `withAuditTransaction()` client's `tx`.

The example uses the base client for its business update and produces only the manual event.
To record automatic diffs too, make the update inside the audited client's `withAuditTransaction()`
and pass that `tx` to `log()`. Calling `log(input)` without `tx` creates an independent write.

## Validate manual events

Validation is opt-in and belongs in the factory's `module` section:

```typescript
const config = defineAuditConfig({
  shared: {
    prismaModule: { Prisma },
    sensitiveFields: ['password', 'token'],
  },
  module: {
    actorExtractor,
    strictManualValidation: true,
    maxMetadataBytes: 64 * 1024,
  },
});
```

With `strictManualValidation: true`, the action and supplied target identifiers must be non-blank
strings, `result` must be `success` or `failure`, and metadata must be a plain object with
JSON-compatible contents. Present or required actor and tenant values must be non-blank strings;
valid identities are stored unchanged. The default remains `false`.

Validation rejects circular references, non-finite numbers, `BigInt`, functions, `undefined`,
sparse arrays, accessors, custom metadata instances, and nesting deeper than 64. Valid `Date`
values keep ISO serialization and shared references are allowed. Event DTO instances are allowed;
their metadata still needs to satisfy the JSON contract. Event and context metadata are checked
before merging, and the merged metadata is checked again.

`maxMetadataBytes` works independently of strict validation. It is a positive safe-integer budget
for the **final redacted metadata JSON in UTF-8 bytes**, including merged context metadata. The
64 KiB value above is an application example, with no package default. Oversized metadata rejects
before INSERT instead of being truncated.

Failures throw `AuditInputError` with a `field` and a `code` of `AUDIT_INPUT_INVALID` or
`AUDIT_METADATA_TOO_LARGE`; the diagnostic message omits the field's value. Inside a managed manual
transaction, caught validation or size failures still prevent commit.

## Observe operations and failures

An explicitly configured `onAuditError(error, context)` receives rejected manual validation,
context, tenant-resolution, serialization, and INSERT failures with provider, phase, code, and
duration diagnostics. The original error is still thrown; filter detailed errors before forwarding
them to telemetry. Synchronous observer throws and rejected observer promises do not replace the
operation's result or original error.

Configure `onAuditOperation` in the factory's `module` section for counters and timing:

```typescript
module: {
  actorExtractor,
  onAuditOperation: event => {
    metrics.recordAuditOperation({
      provider: event.provider,
      operation: event.operation,
      status: event.status,
      transaction: event.transaction,
      durationMs: event.durationMs,
      code: event.code,
    });
  },
}
```

Supply your application's metrics recorder. Events contain provider, operation (`log` or
`transaction`), status, duration, transaction kind, and optional phase/code. They omit identifiers,
metadata, SQL, and raw errors. A successful `log` event means INSERT completion, not commit: a
later business failure can roll it back. Its transaction kind is `external` when a `tx` was passed
or `standalone` otherwise. The managed helper emits a separate `transaction: 'managed'` outcome
after the host transaction resolves or rejects; a failed transaction may reflect business logic,
database failure, or audit work.

## Discover provider support

`auditService.getCapabilities()` returns a frozen provider capability object without database I/O.
Both providers support `manualLogging`, `manualTransactions`, and `query`; PostgreSQL also supports
`automaticTracking`, `scan`, `exportCsv`, and `retention`. SQL Server supports `schemaInspection`
and `readIndexes`. Capabilities do not validate live credentials, schema, or permissions.

This differs from the audited client's `getAuditCapabilities()`, which reports its automatic
consistency and lifecycle contract. See [SQL Server](./sql-server) for provider limits.

## AuditLogModule.forRoot / forRootAsync Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prisma` | `PrismaClient` | *required* | Base Prisma client for audit storage |
| `provider` | `'postgresql' \| 'sqlserver'` | `'postgresql'` | Database dialect for manual logging, managed transactions, and history queries |
| `actorExtractor` | `(req) => AuditActor \| Promise<AuditActor>` | *required* | Extracts actor from HTTP request |
| `actorExtractionStage` | `'middleware' \| 'interceptor'` | `'middleware'` | Use `interceptor` for identity populated by Guards |
| `actorRequired` | `boolean` | `false` | Reject `log()` before INSERT when the actor has no non-blank string ID; reads are unaffected |
| `tenantRequired` | `boolean` | `false` | When `true`, `log()` requires tenant context; ambient `query()`/`getById()` require context unless an explicit `tenantId` or `allTenants: true` scope is provided |
| `excludeRoutes` | `RouteInfo[]` | `[]` | Routes excluded from `AuditActorMiddleware` |
| `registerGlobalInterceptor` | `boolean` | `true` | Set `false` to bind `AuditInterceptor` manually |
| `correlationIdHeader` | `string` | `x-request-id` | Header copied into `metadata.correlationId` |
| `correlationIdGetter` | `(req) => string \| undefined` | — | Custom correlation ID source |
| `tableName` | `string` | `audit_logs` | Audit table name used by module-side log/query/scan/export/prune APIs |
| `tenantResolver` | `() => string \| null` | — | Replaces default tenant resolution, including when it returns `null`; tenancy is used only when no resolver is supplied |
| `strictManualValidation` | `boolean` | `false` | Validate manual event fields, identity, and JSON-compatible metadata before INSERT |
| `maxMetadataBytes` | `number` | — | Positive safe-integer budget for final redacted metadata JSON in UTF-8 bytes |
| `onAuditOperation` | `(event: AuditOperationEvent) => unknown` | — | Observe manual log and managed transaction outcomes without event contents |
| `onAuditError` | `(error, ctx) => unknown` | — | Reports extraction and rejected manual validation, context, serialization, and INSERT failures |
| `logger` | `AuditLogger` | — | Warning/error logger compatible with `console` and NestJS `LoggerService` |
| `sensitiveFields` | `string[]` | `[]` | Metadata keys redacted recursively in objects and arrays for manual logs |
| `sensitiveFieldsByModel` | `Record<string, string[]>` | `{}` | Model-specific metadata redaction keys |
| `prismaModule` | generated Prisma module | legacy `@prisma/client` fallback | Required with the Prisma 7 `prisma-client` generator; pass `{ Prisma }` from the generated output |

Sensitive-key redaction traverses manual-log `metadata` recursively through nested objects and arrays. Global `sensitiveFields` and model-specific keys selected from `sensitiveFieldsByModel` by `targetType` are combined before storage. `ManualAuditLogInput` does not accept `changes`; automatic tracking populates `AuditEntry.changes`, while custom business context belongs in `metadata`.

## Reason Metadata

Use `@AuditReason()` when a handler needs to attach a human-readable reason to entries emitted during the request:

```typescript
@Patch(':id/role')
@AuditAction('user.role.changed')
@AuditReason('admin role update')
async updateRole() {
  // automatic tracking and manual logs can read the request audit reason
}
```
