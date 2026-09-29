---
description: "Log custom business events with AuditService.log() for actions not covered by automatic Prisma tracking."
---

# Manual Logging

Use `AuditService.log()` for business events such as an invoice approval, role change, or export.
You can start with one event in an existing transaction without installing the Prisma extension.
See [Incremental Adoption](./adoption) for the complete first-event path on 0.7.0.

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

New in 0.7.0, `actorRequired` defaults to `false`. When enabled, `user`, `system`, and `api_key`
actors all need a string ID containing at least one non-whitespace character. Null, empty, and
whitespace-only IDs reject before the audit INSERT. Valid IDs are stored unchanged, without trimming.
The default permits records with `actorId: null` and `actorType: 'system'` when no context exists.

To use the same actor, tenant, storage, and masking settings for manual and automatic records,
configure [`defineAuditConfig()`](./installation#shared-configuration). Module and
extension registrations otherwise remain independent. The actor policy validates attribution;
it does not authenticate or authorize a user.

## With Transaction

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

## AuditLogModule.forRoot / forRootAsync Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prisma` | `PrismaClient` | *required* | Base Prisma client for audit storage |
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
| `onAuditError` | `(error, ctx) => void` | — | Reports actor/correlation extraction and actor-policy errors; handle rejected `log()` calls separately |
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
