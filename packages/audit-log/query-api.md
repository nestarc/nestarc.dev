---
description: "Search and filter audit log entries with AuditService.query() — keyset cursors, wildcard filters, and tenant-scoped reads."
---

# Query API

Use `AuditService.query()` to search audit log entries with wildcard filters, deterministic keyset pagination, and tenant scoping.

## Example

```typescript
const result = await auditService.query({
  actorId: 'user-123',
  action: 'invoice.*',     // wildcard support
  targetType: 'Invoice',
  source: 'auto',
  result: 'success',
  from: new Date('2026-01-01'),
  to: new Date('2026-04-01'),
  limit: 50,
  includeTotal: false,
});
// -> { entries: AuditEntry[], nextCursor: string | null, hasMore: boolean }

if (result.hasMore) {
  await auditService.query({
    actorId: 'user-123',
    action: 'invoice.*',
    targetType: 'Invoice',
    source: 'auto',
    result: 'success',
    from: new Date('2026-01-01'),
    to: new Date('2026-04-01'),
    cursor: result.nextCursor!,
    limit: 50,
    includeTotal: false,
  });
}
```

## Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `actorId` | `string` | Filter by actor ID |
| `action` | `string` | Filter by action name (supports wildcards, e.g. `invoice.*`) |
| `targetType` | `string` | Filter by target type |
| `source` | `'auto' \| 'manual'` | Filter by automatic or manual audit source |
| `result` | `'success' \| 'failure'` | Filter by audit result |
| `from` | `Date` | Start of date range |
| `to` | `Date` | End of date range |
| `limit` | `number` | Maximum number of entries to return |
| `cursor` | `string` | Continue after a previous page's `nextCursor` |
| `includeTotal` | `boolean` | When `false`, skips the `COUNT(*)` query and omits `total` |
| `tenantId` | `string` | Explicitly scope to a tenant |
| `allTenants` | `boolean` | Intentional authorized cross-tenant admin read |

## Response Format

```typescript
{
  entries: AuditEntry[];
  nextCursor: string | null;
  hasMore: boolean;
  total?: number;
}
```

Rows are ordered newest-first by `(created_at, id)`. Cursors do not encode filters; keep the same filter set on each page unless you intentionally want a new filtered scan below the cursor boundary.

## Single Entry Lookup

Use `getById(id, options?)` with the same tenant scoping rules:

```typescript
const entry = await auditService.getById('audit-row-id', {
  tenantId: 'tenant-1',
});
```

Use `allTenants: true` only for deliberately authorized cross-tenant admin reads. `tenantId` and `allTenants` are mutually exclusive.
