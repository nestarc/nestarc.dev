---
description: "Audit logging for NestJS with automatic Prisma change tracking — record who changed what with before/after diffs."
---

# @nestarc/audit-log

Audit logging module for NestJS with automatic Prisma change tracking and append-only PostgreSQL storage.

## Features

- **Automatic CUD tracking** via Prisma `$extends` — create, update, delete, upsert, and batch operations
- **Transaction contract is explicit** — business writes keep the caller `$transaction`, while automatic audit inserts are best-effort outside that transaction
- **Before/after diffs** with deep comparison for JSON fields
- **Sensitive field masking** — configurable `[REDACTED]` replacement
- **Manual logging API** — `AuditService.log()` for business events (with optional transaction support)
- **Query API v2** — `AuditService.query()` with keyset cursors, wildcard filters, optional totals, and `getById()`
- **Decorators** — `@NoAudit()`, `@AuditAction()`, and `@AuditReason()` on handlers or controllers
- **Custom primary keys** — configurable per-model PK field (defaults to `id`)
- **Multi-tenant** — optional `@nestarc/tenancy` integration with explicit tenant scoping and authorized cross-tenant reads
- **Retention & partitioning** — monthly PostgreSQL partitions, `ensurePartitions()`, and `AuditService.prune()`
- **Append-only** — trigger enforcement blocks UPDATE/DELETE on audit records by default

## Requirements

- NestJS 10 or 11
- Prisma 7 (primary), with Prisma 5/6 legacy peer compatibility
- PostgreSQL
- Node.js 20.19+, 22.12+, or 24.x

Version 0.3 adds Prisma 7 generated-client and driver-adapter coverage. See [Installation](./installation) or the shared [Prisma 7 setup guide](/guide/prisma-7).
