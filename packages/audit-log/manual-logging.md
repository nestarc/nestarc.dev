---
description: "Log custom business events with AuditService.log() for actions not covered by automatic Prisma tracking."
---

# Manual Logging

Use `AuditService.log()` for business events that are not automatically tracked by the Prisma extension.

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

Published 0.5.0 extracts HTTP actors in middleware before guards run. If a guard populates
`req.user`, establish actor context after authentication around the async business work. This
example belongs in an authenticated handler; reject unauthenticated requests before entering it:

```typescript
import { AuditContext } from '@nestarc/audit-log';

const current = AuditContext.getStore();
return AuditContext.run({
  ...current,
  actor: { id: req.user.id, type: 'user', ip: req.ip },
  noAudit: current?.noAudit ?? false,
}, async () => {
  await auditService.log({ action: 'invoice.approved', targetId: id });
});
```

Copying the existing context preserves correlation metadata, reason, and route overrides. `log()`
still resolves tenancy from the configured resolver or optional tenancy integration; actor context
does not establish a tenant. Jobs have no HTTP middleware and can use `AuditContext.runAs()` with a
system actor plus their own tenant context. `@NoAudit()` skips automatic tracking, while an explicit
`log()` call still writes an event.

## With Transaction

```typescript
await prisma.base.$transaction(async (tx) => {
  await tx.invoice.update({ where: { id }, data: { status: 'approved' } });
  await auditService.log({
    action: 'invoice.approved',
    targetType: 'Invoice',
    targetId: id,
  }, tx);
  // Both roll back together if anything fails
});
```

## AuditLogModule.forRoot / forRootAsync Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prisma` | `PrismaClient` | *required* | Base Prisma client for audit storage |
| `actorExtractor` | `(req) => AuditActor \| Promise<AuditActor>` | *required* | Extracts actor from HTTP request |
| `tenantRequired` | `boolean` | `false` | When `true`, `log()` requires tenant context; ambient `query()`/`getById()` require context unless an explicit `tenantId` or `allTenants: true` scope is provided |
| `excludeRoutes` | `RouteInfo[]` | `[]` | Routes excluded from `AuditActorMiddleware` |
| `registerGlobalInterceptor` | `boolean` | `true` | Set `false` to bind `AuditInterceptor` manually |
| `correlationIdHeader` | `string` | `x-request-id` | Header copied into `metadata.correlationId` |
| `correlationIdGetter` | `(req) => string \| undefined` | — | Custom correlation ID source |
| `tableName` | `string` | `audit_logs` | Audit table name used by module-side log/query/scan/export/prune APIs |
| `tenantResolver` | `() => string \| null` | — | Replaces default tenant resolution, including when it returns `null`; tenancy is used only when no resolver is supplied |
| `onAuditError` | `(error, ctx) => void` | — | Reports actor/correlation extraction errors; handle rejected `log()` calls separately |
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
