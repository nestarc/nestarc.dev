---
description: "Audit logging for NestJS with automatic Prisma change tracking — record who changed what with before/after diffs."
---

# @nestarc/audit-log

Audit logging module for NestJS with automatic Prisma change tracking and append-only PostgreSQL storage.

::: tip Supported: transaction-first automatic tracking
`atomic-required` automatic tracking is Supported when supported tracked operations run through
`withAuditTransaction()`: business mutations and automatic audit rows commit or roll back together,
and tracked writes outside the helper fail before execution. Explicit `best-effort` is intentionally
outside this support claim; it remains non-atomic and can leave orphan success rows or stale
transaction-local diffs after caller rollback.

Audit-log 0.5 composes with `@nestarc/soft-delete` 0.7.1 for authoritative lifecycle evidence.
The combined 0.5.0/0.7.1 bridge's shared NestJS peer range is 10/11; audit-log alone additionally
supports NestJS 12.0.1+.
Apply extensions in the fixed order tenancy → audit-log → soft-delete, configure
`auditLifecycle: 'atomic-required'`, and execute lifecycle mutations inside
`withAuditTransaction()`.
:::

For a complete integration walkthrough, read the [NestJS audit log code example](/blog/nestjs-audit-log-without-refactoring), including the separate base and extended Prisma client boundary.

## Features

- **Automatic CUD tracking** via Prisma `$extends` — create, update, delete, upsert, and supported batch operations
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

- NestJS 10, 11, or 12.0.1+
- Prisma 7 (primary), with Prisma 5/6 legacy peer compatibility
- PostgreSQL
- Node.js 22.13+ within the 22.x line, or Node.js 24.x

Version 0.5 removes the deprecated `experimentalTxAudit` option. Migrate authoritative automatic
tracking to `atomic-required` plus `withAuditTransaction()`, or remove the legacy key and retain
explicit non-atomic `best-effort`. Untyped options that still own the legacy key, including
`experimentalTxAudit: false`, fail fast during the 0.5.x migration window. See
[Installation](./installation), [Automatic CUD Tracking](./auto-tracking),
[Streaming Export](./streaming-export), [Durable Streams](./durable-streams), or the shared
[Prisma 7 setup guide](/guide/prisma-7).
