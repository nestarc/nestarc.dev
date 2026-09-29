---
description: "Version-scoped integration checklist for AI agents using published @nestarc/audit-log 0.7.0 with NestJS, Prisma, and PostgreSQL."
---

# Agent Guide

This guide targets published `@nestarc/audit-log@0.7.0`. Use the installed package's declarations
and [0.7.0 changelog](https://github.com/nestarc/nestjs-audit-log/blob/v0.7.0/CHANGELOG.md) as the
version boundary. The release artifact includes older README/Quick Start labels; use this site's
[Quick Start](./quickstart) and [Incremental Adoption](./adoption) for the 0.7.0 install path.

1. Check Node.js, NestJS, Prisma, and PostgreSQL requirements in [Installation](./installation).
   Use the generated `{ Prisma }` namespace for Prisma 7 at both the module and extension boundaries.
2. Start with one manual event or one tracked model. Use `defineAuditConfig()` to build shared
   actor, tenant, table, masking, module, extension, schema, and partition options. Put shared fields
   only in `shared`; provide `prisma` at module registration. Omit `extension` for manual-only use.
   The factory creates no client and performs no schema or database work.
3. Create the audit schema in a migration. Keep the base client for audit storage; use
   `createAuditedClient()` for automatic business writes and an explicit `trackedModels` allowlist.
   Set `consistency: 'atomic-required'` and use `withAuditTransaction()` for supported tracked writes.
   Automatic audit failures prevent helper commit even when caught. Manual `log(input, tx)` errors
   still must escape the callback for rollback. `best-effort` has independent audit inserts.
4. Use direct operations for tracked child writes. Atomic nested-write checks include untracked
   parents and intermediate relations. Atomic `createMany`, `updateMany`, `createManyAndReturn`,
   and `updateManyAndReturn` are rejected for tracked models; use sequential single-record calls.
   `deleteMany` has a per-record cap. Check [Automatic CUD Tracking](./auto-tracking) and
   [Migrating to 0.7.0](./migration).
5. Use `actorExtractionStage: 'interceptor'` when a Guard populates identity. Authenticate and
   authorize in the host app. `actorRequired` is optional and defaults to `false`; enabling it
   requires non-blank string IDs for users, API keys, and workers. Workers use
   `AuditContext.runAs()` and establish tenant context separately. Automatic exclusions remain
   intentional bypasses; explicit manual logs still enforce the actor policy.
6. Match action names and source exactly. Automatic `Invoice` writes use `Invoice.*`; a manual
   `invoice.approved` event has `source: 'manual'`. [Query API](./query-api) lists filters,
   inclusive time bounds, optional totals, and pagination constraints. `actorRequired` does not
   authenticate reads or grant cross-tenant access.
7. Use explicit scope for [exports](./streaming-export). A saved `after === until` is a completed
   range with no replay in 0.7.0. Treat [durable streams](./durable-streams) as timestamp-based
   delivery of observed rows: late commits can be missed. Use entry-ID deduplication and external
   CDC or reconciliation when complete continuous capture is required.
8. Load every required stream state before [retention](./retention). A missing checkpoint must stop
   prune; a timestamp checkpoint does not replace CDC or reconciliation completion evidence.
   Use the same custom table name for runtime, schema, and partition maintenance.
9. For the atomic lifecycle bridge, pair audit-log 0.7.0 with soft-delete 0.7.4, ordered audit-log
   then soft-delete. Optional tenancy transaction/RLS composition requires separate verification;
   a populated audit tenant ID alone does not prove transaction-local tenant isolation.

Verify one committed write, one rollback, expected actor and tenant values, one redacted field,
and a query that finds the event. Also test missing-actor rejection if enabled, including worker
execution, and a caught automatic policy failure to verify rollback of earlier writes. Schema
owners and maintenance credentials remain separate from the request-serving runtime.
