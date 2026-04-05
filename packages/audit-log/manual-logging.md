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
  await auditService.log({ action: 'invoice.approved', targetId: id }, tx);
  // Both roll back together if anything fails
});
```

## AuditLogModule.forRoot / forRootAsync Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prisma` | `PrismaClient` | *required* | Base Prisma client for audit storage |
| `actorExtractor` | `(req) => AuditActor` | *required* | Extracts actor from HTTP request |
| `tenantRequired` | `boolean` | `false` | When `true`, throws if tenant context is unavailable |
