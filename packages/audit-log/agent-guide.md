---
description: "Version-scoped integration checklist for AI agents using published @nestarc/audit-log 0.8.0 with NestJS, Prisma, PostgreSQL, or SQL Server."
---

# Agent Guide

This guide targets published `@nestarc/audit-log@0.8.0`. Use the installed package declarations
and [0.8.0 release source](https://github.com/nestarc/nestjs-audit-log/blob/v0.8.0/docs/releases/0.8.0.md)
as the version boundary. Start with the [Quick Start](./quickstart), [Incremental Adoption](./adoption),
or [SQL Server guide](./sql-server).

1. Require Node.js `^22.23.4 || ^24.22.1`, NestJS 10/11/12.0.1+, and compatible Prisma 5/6/7
   dependencies. Use matching Prisma CLI/client/adapter versions. Pass the generated `{ Prisma }`
   namespace for Prisma 7 at module and extension boundaries.
2. Choose the provider explicitly when needed: omitted `provider` selects PostgreSQL. SQL Server
   supports manual logging, managed manual transactions, and `query()`/`getById()`. It does not
   support automatic tracking, scan/export, retention, partitions, GIN indexes, or rule enforcement.
   The pinned SQL Server validation stack is SQL Server 2025 with Prisma 7.10.0.
3. Start with one manual event or one PostgreSQL tracked model. Use `defineAuditConfig()` to share
   actor, tenant, table, provider, and masking settings. Put shared fields only in `shared`, and
   `strictManualValidation`, `maxMetadataBytes`, and `onAuditOperation` in `module`. Provide `prisma`
   at module registration; omit `extension` for manual-only use. The factory performs no database work.
4. Create audit storage in an explicit migration with a setup identity. Keep the base client for
   audit storage. On PostgreSQL, use `createAuditedClient()` and a `trackedModels` allowlist for
   automatic writes, with `consistency: 'atomic-required'` and `withAuditTransaction()`.
   Caught automatic audit failures still prevent helper commit. `best-effort` has independent inserts.
5. For manual events, use `audit.withManualTransaction(base, async ({ tx, log }) => ...)` when
   caught audit failures must prevent commit. Await the bound writer; use its `tx` for all business
   writes. Already-started writes settle before completion, expired writers reject, and nested
   managed helpers are unsupported. The helper cannot detect missing events or enlist a captured
   base client. Caller-owned `log(input, tx)` remains available; its errors must escape the callback.
6. Manual validation defaults to off. Before enabling it, review identifiers and JSON metadata.
   `maxMetadataBytes` measures final redacted JSON in UTF-8 bytes, including context metadata;
   oversize events reject rather than truncate. Handle `AuditInputError.code` and `.field` without
   logging raw event values. Catching these errors inside the managed helper still prevents commit.
7. Use `actorExtractionStage: 'interceptor'` when a Guard populates identity. Authenticate and
   authorize in the host. Optional `actorRequired` needs non-blank string IDs for users, API keys,
   and workers. Workers use `AuditContext.runAs()` and establish tenant context separately.
   Automatic exclusions remain bypasses; explicit manual logs still enforce actor policy.
8. Use explicit operations for tracked children. Atomic nested-write checks include untracked
   parents and intermediate relations. Atomic `createMany`, `updateMany`, `createManyAndReturn`,
   and `updateManyAndReturn` reject for tracked models; use sequential single-record calls.
   `deleteMany` has a per-record cap. See [Automatic CUD Tracking](./auto-tracking).
9. Authorize history access before selecting tenant scope. Match action and source: automatic
   `Invoice.*` versus manual `invoice.approved`. SQL Server cursors retain full timestamp precision;
   keep them opaque and never reuse them across providers. Read credentials need SELECT privileges.
10. `getCapabilities()` reports configured provider APIs without database I/O; it does not prove
    connection, schema, or permissions. The audited client's `getAuditCapabilities()` reports the
    separate automatic consistency/lifecycle contract. `onAuditOperation` omits event contents;
    a successful log reports INSERT completion, while managed transactions have a final outcome.
    Filter detailed `onAuditError` data before forwarding it to telemetry.
11. PostgreSQL [exports](./streaming-export) require explicit scope. `after === until` completes
    without replay. [Durable streams](./durable-streams) may miss late commits; use entry-ID
    deduplication and CDC or reconciliation for complete capture. Load required checkpoints before
    [retention](./retention); missing checkpoints must stop pruning.
12. Soft-delete 0.7.4 excludes audit-log 0.8.0 from its peer range. Do not use that unsupported tuple
    or bypass strict peers. The documented older lifecycle recipe retains its 0.7.0 / 0.7.4 scope;
    a new combined tuple needs an exact published compatible companion and lifecycle validation.
    Optional tenancy transaction/RLS composition also requires separate verification: an audit
    tenant ID alone does not establish transaction-local tenant isolation.

Verify a committed write, rollback, actor and tenant values, redaction, and an authorized history
query. Test missing-actor and enabled validation/size failures, including caught failures in the
managed helper. Keep setup/maintenance credentials separate from the request-serving runtime.
SQL Server inspection can have incomplete metadata and never proves trigger enforcement; verify
actual permissions and commit/rollback behavior. Read indexes require an explicit migration.
