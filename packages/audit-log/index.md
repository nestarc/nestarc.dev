---
description: "Audit logging for NestJS with automatic Prisma change tracking — record who changed what with before/after diffs."
---

# @nestarc/audit-log

Audit logging module for NestJS with automatic Prisma change tracking and append-only PostgreSQL storage.

::: warning Preview: transaction-first automatic tracking
`atomic-required` commits and rolls back business mutations and audit rows together through
`withAuditTransaction()`. Explicit `best-effort` remains non-atomic and can leave orphan rows or
stale diffs after caller rollback.

The site currently exposes package-level status only, so the catalog marks the whole package as
Preview. Manual logging with an explicit `tx`, query, retention, partitioning, and schema utilities
remain supported within their documented contracts; the Preview limitation applies to automatic
Prisma tracking.

Audit-log 0.4 also contains the audit side of an atomic soft-delete lifecycle bridge. The published
`@nestarc/soft-delete` 0.6.0 package does not expose the matching automatic routing/configuration,
so do not enable that integration until a compatible soft-delete release is installed. Audit-log's
`withAuditLifecycle()` helper remains available for deliberate manual use inside
`withAuditTransaction()`.
:::

For a complete integration walkthrough, read the [NestJS audit log code example](/blog/nestjs-audit-log-without-refactoring), including the separate base and extended Prisma client boundary.

## Features

- **Automatic CUD tracking** via Prisma `$extends` — create, update, delete, upsert, and batch operations
- **Transaction-first automatic tracking** — official interactive `tx`, row-locked preimages, and fail-closed audit inserts
- **Before/after diffs** with deep comparison for JSON fields
- **Sensitive field masking** — configurable `[REDACTED]` replacement
- **Manual logging API** — `AuditService.log()` for business events (with optional transaction support)
- **Query API v2** — `AuditService.query()` with keyset cursors, wildcard filters, optional totals, and `getById()`
- **Checkpointed export** — forward `AuditService.scan()` plus backpressure-aware, spreadsheet-safe CSV output
- **Durable log streams** — host-scheduled at-least-once delivery with persistent checkpoints, retries, and DLQ support
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

Version 0.4 requires an explicit consistency mode and adds the transaction-first helper, streaming
export, durable sinks, and retention checkpoint guards. See [Installation](./installation),
[Streaming Export](./streaming-export), [Durable Streams](./durable-streams), or the shared
[Prisma 7 setup guide](/guide/prisma-7).
