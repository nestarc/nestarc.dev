---
description: "Version-scoped integration checklist for AI agents using published @nestarc/audit-log 0.5.0 with NestJS, Prisma, and PostgreSQL."
---

# Agent Guide

This guide targets published `@nestarc/audit-log@0.5.0`. Start with the installed package's types and
[version-pinned README](https://github.com/nestarc/nestjs-audit-log/blob/v0.5.0/README.md), then apply
the operational corrections in these pages. A development checkout may contain unreleased fixes;
its options and examples must not be assumed to work in 0.5.0.

1. Check Node.js, NestJS, Prisma, and PostgreSQL requirements in [Installation](./installation).
   Use the generated `{ Prisma }` namespace for Prisma 7 at both the module and extension boundaries.
2. Create the audit schema through a migration. Keep the base client for audit storage and use
   `createAuditedClient()` for business writes. Pass shared tenant, table, and redaction settings to
   both configurations; they are not merged automatically.
3. Set `consistency: 'atomic-required'` and execute supported tracked writes through
   `withAuditTransaction()`. Let audit errors escape the callback: published 0.5.0 does not force
   rollback after a JavaScript-side audit error is caught and suppressed. Its nested-write guard
   also misses tracked children reached through an untracked parent. Generate direct operations for
   every tracked child; check [error handling, bulk, and nested-write restrictions](./auto-tracking).
   `best-effort` has different rollback guarantees.
4. Populate actor identity after authentication. Published 0.5.0 extracts HTTP actors before guards;
   use earlier authentication middleware or an explicit context around authenticated work as shown
   in [Manual Logging](./manual-logging#authenticated-requests-and-background-jobs). Do not add an
   `actorExtractionStage` option: it is not a published 0.5.0 API.
5. Match action names and source exactly. Automatic `Invoice` writes use `Invoice.*`; a manual
   `invoice.approved` event has `source: 'manual'`. [Query API](./query-api) lists supported filters,
   inclusive time bounds, optional totals, and pagination constraints.
6. Use explicit scope for [exports](./streaming-export). In 0.5.0, a saved `after === until` means the
   bounded job is complete; handle it before calling `scan()` because equal boundaries are rejected.
7. Treat [durable streams](./durable-streams) as timestamp-based delivery of observed rows. They can
   miss late commits. Use entry-ID deduplication and external CDC or reconciliation when complete
   continuous capture is required.
8. Load every required stream state before [retention](./retention). A missing checkpoint must stop
   prune, and a timestamp checkpoint does not replace CDC or reconciliation completion evidence.

Verify the integration with one committed write, one rollback, expected actor and tenant values,
one redacted field, and a query that finds the event. Use the host's authentication and authorization
checks for cross-tenant reads. Schema owners and maintenance credentials remain separate from the
request-serving runtime.
