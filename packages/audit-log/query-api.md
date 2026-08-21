---
description: "Search audit entries with AuditService.query() — deterministic keyset cursors, wildcard filters, optional totals, and tenant-scoped reads."
---

# Query API

Use `AuditService.query()` for newest-first application views and investigations. For a forward,
checkpointed export, use [`scan()`](./streaming-export) instead.

## Query a page

```typescript
const filters = {
  tenantId: 'tenant-1',
  actorId: 'user-123',
  actorType: 'user',
  action: 'invoice.*',
  targetType: 'Invoice',
  source: 'auto' as const,
  result: 'success' as const,
  from: new Date('2026-08-01T00:00:00.000Z'),
  to: new Date('2026-09-01T00:00:00.000Z'),
  limit: 50,
  includeTotal: false,
};

let page = await auditService.query(filters);

while (page.hasMore) {
  page = await auditService.query({
    ...filters,
    cursor: page.nextCursor!,
  });
}
```

Rows are ordered newest-first by `(created_at, id)`. The cursor is opaque and records only that
ordering boundary; it does not contain the filters. Reuse the same filter set for every page.

`includeTotal` defaults to `true`. Set it to `false` for feeds that do not need an exact count; this
skips the separate `COUNT(*)` query and omits `total` from the result.

## Query options

| Option | Type | Description |
|--------|------|-------------|
| `tenantId` | `string` | Explicitly scope the read to one tenant |
| `allTenants` | `boolean` | Deliberately omit tenant filtering for an authorized admin read |
| `actorId` | `string` | Filter by actor ID |
| `actorType` | `string` | Filter by actor type |
| `action` | `string` | Exact action or `*` wildcard pattern, such as `invoice.*` |
| `targetType` | `string` | Filter by target type |
| `targetId` | `string` | Filter by target ID |
| `source` | `'auto' \| 'manual'` | Filter by audit source |
| `result` | `'success' \| 'failure'` | Filter by outcome |
| `from` | `Date` | Inclusive lower `created_at` bound |
| `to` | `Date` | Inclusive upper `created_at` bound |
| `limit` | `number` | Page size; defaults to `50` and must be a positive integer |
| `cursor` | `string` | Continue below the previous page's `nextCursor` |
| `offset` | `number` | Non-negative offset for non-cursor pagination |
| `includeTotal` | `boolean` | Include `total`; defaults to `true` |

`cursor` and `offset` are mutually exclusive. Prefer cursors for a changing or large table. Literal
SQL wildcard characters in an action filter are escaped; only `*` has wildcard meaning.

## Response

```typescript
interface AuditQueryResult {
  entries: AuditEntry[];
  nextCursor: string | null;
  hasMore: boolean;
  total?: number;
}
```

`nextCursor` is non-null only when another page exists. Treat it as an opaque token and do not parse,
edit, or manufacture one.

## Tenant boundary

`query()` can use ambient tenant context. An explicit `tenantId` overrides that ambient context;
`allTenants: true` is the intentional cross-tenant path. `tenantId` and `allTenants` are mutually
exclusive.

With `tenantRequired: true`, a call without explicit or ambient tenant scope fails. Without it, an
unscoped call is allowed and emits a one-time warning. The package does not authorize admin access,
so check cross-tenant permissions before calling `allTenants: true`.

## Look up one entry

`getById()` follows the same tenant rules and returns `null` for an invalid or missing ID:

```typescript
const entry = await auditService.getById('12dc5b9e-8e3a-4ec1-b211-f728f924db0f', {
  tenantId: 'tenant-1',
});
```

Use `allTenants: true` only after an application-level authorization check.
