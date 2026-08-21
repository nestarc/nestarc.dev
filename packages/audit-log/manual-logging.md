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
| `tenantResolver` | `() => string \| null` | — | Custom tenant lookup before the optional `@nestarc/tenancy` fallback |
| `onAuditError` | `(error, ctx) => void` | — | Structured audit failure callback |
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
