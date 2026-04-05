# @nestarc/audit-log

Audit logging module for NestJS with automatic Prisma change tracking and append-only PostgreSQL storage.

## Features

- **Automatic CUD tracking** via Prisma `$extends` — create, update, delete, upsert, and batch operations
- **Caller transaction aware** — automatic tracking participates in caller's `$transaction`; audit insert is best-effort
- **Before/after diffs** with deep comparison for JSON fields
- **Sensitive field masking** — configurable `[REDACTED]` replacement
- **Manual logging API** — `AuditService.log()` for business events (with optional transaction support)
- **Query API** — `AuditService.query()` with wildcard filters, pagination
- **Decorators** — `@NoAudit()` / `@AuditAction()` on handlers or controllers
- **Custom primary keys** — configurable per-model PK field (defaults to `id`)
- **Multi-tenant** — optional `@nestarc/tenancy` integration with fail-closed mode
- **Append-only** — ships PostgreSQL rules to prevent UPDATE/DELETE on audit records

## Requirements

- NestJS 10 or 11
- Prisma 5 or 6
- PostgreSQL
