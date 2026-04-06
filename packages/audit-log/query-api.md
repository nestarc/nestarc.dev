---
description: "Search and filter audit log entries with AuditService.query() — wildcard filters, pagination, and date ranges."
---

# Query API

Use `AuditService.query()` to search audit log entries with wildcard filters, pagination, and date range support.

## Example

```typescript
const result = await auditService.query({
  actorId: 'user-123',
  action: 'invoice.*',     // wildcard support
  targetType: 'Invoice',
  from: new Date('2026-01-01'),
  to: new Date('2026-04-01'),
  limit: 50,
  offset: 0,
});
// -> { entries: AuditEntry[], total: number }
```

## Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `actorId` | `string` | Filter by actor ID |
| `action` | `string` | Filter by action name (supports wildcards, e.g. `invoice.*`) |
| `targetType` | `string` | Filter by target type |
| `from` | `Date` | Start of date range |
| `to` | `Date` | End of date range |
| `limit` | `number` | Maximum number of entries to return |
| `offset` | `number` | Number of entries to skip (for pagination) |

## Response Format

```typescript
{ entries: AuditEntry[], total: number }
```
