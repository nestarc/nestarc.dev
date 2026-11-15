---
description: "Version-scoped integration checklist for published audit-log 0.9.0: optional atomic Outbox delivery, managed transactions, tenant boundaries, and compatible lifecycle pins."
---

# Agent Guide

This guide targets published `@nestarc/audit-log@0.9.0`. Use the installed package declarations
and [0.9.0 release source](https://github.com/nestarc/nestjs-audit-log/blob/v0.9.0/README.md)
as the version boundary. Start with the [Quick Start](./quickstart), [Incremental Adoption](./adoption),
or [SQL Server guide](./sql-server).

1. Require Node.js `^22.23.4 || ^24.22.1`, NestJS 10/11/12.0.1+, and compatible Prisma 5/6/7
   dependencies. Use matching Prisma CLI/client/adapter versions. Pass the generated `{ Prisma }`
   namespace for Prisma 7 at module and extension boundaries.
2. Choose the provider explicitly when needed: omitted `provider` selects PostgreSQL. SQL Server
   supports manual logging, managed manual transactions, and `query()`/`getById()`. It does not
   support automatic tracking, Outbox delivery, scan/export, retention, partitions, GIN indexes, or rule enforcement.
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
   base client. Without delivery, caller-owned `log(input, tx)` remains available; its errors must
   escape the callback. Configured delivery rejects public `log()` calls, even with a managed `tx`.
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
    deduplication and CDC or reconciliation for historical capture. New opted-in producer writes can
    use [Atomic Outbox Delivery](./atomic-outbox) without relying on an audit timestamp checkpoint. Load required checkpoints before
    [retention](./retention); missing checkpoints must stop pruning.
12. For tenant-scoped PostgreSQL lifecycle writes, pin tenancy 0.16.4, audit-log 0.8.0, and
    soft-delete 0.7.6 with strict peer installation. This is a separate 0.8.0 recipe: soft-delete
    0.7.6 excludes audit-log 0.9.0. Upgrade soft-delete from 0.7.5 or earlier first;
    this composition supports NestJS 10/11 and Prisma 6/7. Create a dedicated
    audit-log → soft-delete client, inject it into `SoftDeleteService`, and pass
    `tenancyTransactionCallback(tenancy, work)` directly to its `withAuditTransaction()`.
    [Lifecycle recipe](./auto-tracking#atomic-soft-delete-lifecycle)
13. For new PostgreSQL audit delivery, use `delivery: createOutboxAuditDelivery(emitter)` with
    exact Outbox 0.4.1 and audit-log 0.9.0. Apply both schemas before enabling it. Require the
    managed manual writer or `atomic-required` automatic tracking on the same transaction;
    staging failure prevents commit even when caught. Keep network delivery in an Outbox worker.
    The fixed summary excludes changes, arbitrary metadata, and actor IP. Consumers deduplicate
    by tenant/audit ID; no historical backfill, commit ordering, or exactly-once guarantee is added.

Verify a committed write, rollback, actor and tenant values, redaction, and an authorized history
query. Test missing-actor and enabled validation/size failures, including caught failures in the
managed helper. Keep setup/maintenance credentials separate from the request-serving runtime.
SQL Server inspection can have incomplete metadata and never proves trigger enforcement; verify
actual permissions and commit/rollback behavior. Read indexes require an explicit migration.
For delivery, also verify enqueue failure, reversed commit order, producer loss after commit,
and consumer deduplication. Distinguish the released source RLS regression from the runnable
Outbox example's tenant-attribution checks; see [verification scope](./atomic-outbox#run-the-released-example-and-check-its-scope).
