---
title: "nestarc NestJS Packages: FAQ and Compatibility"
description: "Frequently asked questions about nestarc — package compatibility, NestJS/Prisma versions, licensing, and troubleshooting."
---

# nestarc NestJS Packages: FAQ and Compatibility

## General

### Do nestarc packages depend on each other?

No other Nestarc package is required for standalone use. Optional integrations still have peer-version constraints: Jobs 0.4.0's Outbox bridge accepts `^0.2.1 || ^0.3.0`, excluding Outbox 0.4.0, and soft-delete 0.7.4 excludes audit-log 0.8.0. Use each package's installation guide and the version-pinned composition recipes when combining them.

### Which NestJS versions are supported?

Support is package-specific. API Keys 0.4, RBAC 0.2.2, and Outbox 0.4 accept NestJS 12; tenancy, jobs, and webhook still share NestJS 10/11. `@nestarc/audit-log` 0.8 supports NestJS 10, 11, and 12.0.1+;
NestJS 12.0.0 is excluded because its published framework peer metadata was corrected in 12.0.1.
Inbox 0.2.0 requires NestJS `^11.2.8`; it does not declare NestJS 10 or 12 support.
See the [compatibility matrix](/guide/prisma-7#compatibility-matrix) for each package's tested lanes.

### Which Prisma versions are supported?

Support is package-specific. tenancy supports Prisma 6/7; soft-delete, audit-log, pagination, API Keys, RBAC, outbox, and webhook support 5/6/7; feature-flag 0.6 requires Prisma 7, and Inbox 0.2.0 requires Prisma `^7.10.1`. Data-subject 0.3.0 declares the optional peer range `^5.0.0 || ^7.10.0`, excluding Prisma 6. See the [compatibility matrix](/guide/prisma-7#compatibility-matrix) and each package's recorded validation combinations.

### Which licenses apply?

The 14 SaaS backend packages and this documentation site use MIT. The Labs tool `@nestarc/mcp-guard` 0.2.0 uses Apache-2.0. Check the `license` field and bundled `LICENSE` in the version you install; the website footer describes the site's license.

### Do you support both Express and Fastify?

`@nestarc/safe-response` supports both Express and Fastify out of the box. For tenancy, core interfaces accept structural HTTP objects, but authentication, cookies, path extraction, and response handling need adapter-specific setup. See [HTTP adapter prerequisites](/packages/tenancy/installation#http-adapter-prerequisites).

---

## @nestarc/tenancy

### RLS does not seem to be working

Most common causes:

1. **Connected as superuser** — PostgreSQL superusers bypass RLS. Create a dedicated `app_user` role instead.
2. **Missing FORCE ROW LEVEL SECURITY** — Without it, table owners also bypass RLS. Run `ALTER TABLE ... FORCE ROW LEVEL SECURITY`.
3. **Missing tenant_id column** — The table must have a `tenant_id` column, and the `current_setting` key in the RLS policy must match the extension configuration.

Run `npx @nestarc/tenancy check` to detect drift between your Prisma schema and SQL policies.

### set_config does not work inside interactive transactions

By default, the Prisma extension uses batch transactions internally. `set_config` does not propagate into interactive transactions (`$transaction(async (tx) => ...)`).

Two solutions:
1. Use the `tenancyTransaction()` helper (recommended, supports tenancy’s Prisma 6/7 range)
2. Enable `interactiveTransactionSupport: true` (depends on Prisma internals)

See [Installation](/packages/tenancy/installation#interactive-transactions) for details.

### How do I exempt shared models from tenancy extension behavior?

Use the `sharedModels` option:

```typescript
createPrismaTenancyExtension(tenancyService, {
  sharedModels: ['Country', 'Currency'],
})
```

Queries on shared models skip extension context checks, `set_config`, and `autoInjectTenantId`. They do not disable database RLS; configure shared-table database policies deliberately.

### How do I query without a tenant context?

Use `withoutTenant()` to clear context and skip extension checks within a callback. Database RLS still applies: the current tenant policies deny reads without context and reject inserts. Cross-tenant administration requires a separate, tightly authorized connection with deliberate database permissions and auditing. Setting a custom bypass flag alone does not satisfy the restrictive non-empty-context guard.

---

## @nestarc/safe-response

### How do I disable response wrapping for a specific route?

Use the `@RawResponse()` decorator:

```typescript
@Get('health')
@RawResponse()
healthCheck() {
  return { status: 'ok' };
}
```

Useful for file downloads, SSE, and health checks.

### Is it compatible with class-transformer's @Exclude()?

Yes. Safe-response 0.16.0 covers both module import orders with `ClassSerializerInterceptor` on Express and Fastify. Verify that your application's serializer removes sensitive fields before responses are sent. When using idempotency 1.0 as well, register its interceptor before response transformers so it captures the final serialized response for replay.

---

## @nestarc/soft-delete

### Unique constraint conflicts after soft-delete

A normal unique constraint still includes soft-deleted rows, while `@@unique([email, deletedAt])` can allow duplicate active values on databases that treat `NULL` values as distinct. Use a PostgreSQL/SQLite partial unique index or a MySQL generated-column index instead. See [Active-Row Unique Constraints](/packages/soft-delete/cascade#active-row-unique-constraints).

### What is the maximum cascade depth?

Default is 3. Adjust with the `maxCascadeDepth` option.

---

## @nestarc/feature-flag

### What is the flag evaluation priority?

Flags are evaluated through a four-layer cascade. The first matching layer wins:

1. Archived (always false)
2. Best matching attribute override
3. Percentage rollout
4. Global default

### How does percentage rollout work?

It hashes `flagKey + targetingKey` with murmurhash3 and takes the result modulo 100. In feature-flag 0.6, an explicit targeting key takes priority; otherwise the chosen `bucketBy` comes from invocation options, the module registry, or flag metadata, followed by the legacy user/tenant fallback. Typed clients forward their registry settings, and bulk evaluation uses the module registry. Review existing cohorts when upgrading from 0.5; see the [rollout guide](/guide/feature-flags-rollout#how-bucketing-works).

---

## @nestarc/audit-log

### Can I modify or delete audit_logs records?

The generated row triggers block normal `UPDATE` and `DELETE` operations, but they are not a privilege boundary: PostgreSQL `TRUNCATE` does not run row triggers, and a table owner or superuser can alter or bypass them. Use separate runtime and maintenance identities, keep table ownership out of the application role, and revoke `UPDATE`, `DELETE`, and `TRUNCATE` from that runtime role.

### What is the difference between automatic tracking and manual logging?

- **Automatic tracking**: The Prisma extension detects supported CUD operations and records before/after diffs. On PostgreSQL, `atomic-required` plus `withAuditTransaction()` is the Supported authoritative contract. Explicit `best-effort` remains non-atomic and can leave orphan success rows or stale transaction-local diffs after rollback
- **Manual logging**: `AuditService.log()` records business events (e.g., "invoice.approved") explicitly on PostgreSQL or SQL Server. In 0.8.0, `withManualTransaction()` binds a writer to the business transaction and prevents commit after caught audit failures

Both write to the same `audit_logs` table.

Start with [one manual business event or one tracked model](/packages/audit-log/adoption),
or [run the complete example](/packages/audit-log/quickstart) to verify the first record.

### What changed in audit-log 0.8?

Version 0.8.0 adds `withManualTransaction()`, opt-in `strictManualValidation`, a final-redacted-metadata UTF-8 budget through `maxMetadataBytes`, structured `AuditInputError` diagnostics, `onAuditOperation` observers, and `getCapabilities()`. Existing `log(input, tx)` remains available for caller-owned transactions; those callers must still propagate audit failures. See [Manual Logging](/packages/audit-log/manual-logging).

SQL Server now supports tenant-scoped `query()` and `getById()`, optional additive read indexes, and read-only schema inspection. Automatic tracking, scan/export, retention, partitioning, GIN indexes, and rule enforcement remain PostgreSQL-only. See [SQL Server](/packages/audit-log/sql-server).

The required Node.js runtime is `^22.23.4 || ^24.22.1`, introduced in 0.7.1. Upgrade the deployed runtime as well as the npm dependency. Soft-delete 0.7.4 excludes audit-log 0.8.0; a newer combined tuple requires a compatible published companion and passing strict-peer lifecycle checks. Read the [migration guide](/packages/audit-log/migration).

### What changed in audit-log 0.7?

`defineAuditConfig()` shares masking, actor/tenant policy and storage options across manual and
automatic logging. Opt-in `actorRequired: true` rejects atomic tracked writes and explicit manual
logs without an identifiable actor; best-effort preserves the business write and omits its audit
row. The default remains false. In atomic mode, tracked `createManyAndReturn` and
`updateManyAndReturn` now fail before mutation, including when their errors are caught inside
the helper. Read the [migration guide](/packages/audit-log/migration) before upgrading.

### What changed for audit-log 0.5?

Audit-log 0.5 requires Node.js `^22.13.0 || ^24.0.0`, adds NestJS 12.0.1+ support, and removes
`experimentalTxAudit`. Version 0.4.1 is the last release that accepts the removed option. Migrate
authoritative automatic tracking to `consistency: 'atomic-required'` plus
`withAuditTransaction()`, or remove the key and keep explicit `best-effort` when non-atomic behavior
is intentional. TypeScript rejects the old property; JavaScript or `any` objects that still own it,
including `experimentalTxAudit: false`, fail fast during the 0.5.x migration window.

### Can soft-delete lifecycle changes be audited atomically?

The documented recipe pins audit-log 0.7.0 with `@nestarc/soft-delete` 0.7.4. Soft-delete 0.7.4 excludes audit-log 0.8.0 from its peer range, so do not substitute 0.8.0 or bypass peer validation. A newer tuple requires a compatible published companion and passing lifecycle checks.

For the pinned recipe, place audit-log before soft-delete,
configure `auditLifecycle: 'atomic-required'` on the extension and module, and execute lifecycle
mutations inside `withAuditTransaction()`. Keep tracked models, mapping and batch caps aligned.
See the [complete lifecycle configuration](/packages/audit-log/auto-tracking#atomic-soft-delete-lifecycle).
Lifecycle event notifications alone do not provide authoritative same-transaction evidence.
An optional tenancy extension needs its own verified transaction compatibility; tenant attribution
does not enforce RLS or authorize access.

---

## @nestarc/inbox

### Does upgrading from 0.1.0 to 0.2.0 require a migration?

No. SQL schema v2 and the runtime processing contracts are unchanged. Version 0.2.0 adds application-testing helpers and operational recovery validation. Fresh installations still apply the packaged creation SQL; local schema v1 installations still need the [v1-to-v2 migration](/packages/inbox/installation#upgrade-a-local-schema-v1-installation).

### How do I test an Inbox handler?

Use `drainInbox()` from `@nestarc/inbox/testing` with the real service and a scoped admin view, or `waitForInboxRecord()` to observe an existing worker. Assert application database effects as well as receipt completion. Requested IDs restrict assertions, not the worker's claims; use an isolated test database or dedicated consumers. The [testing guide](/packages/inbox/testing) covers real timers, retry waits, diagnostics, and teardown after a timeout.

### How is Inbox different from idempotency, Outbox, and Jobs?

[Inbox](/packages/inbox/) handles incoming events: it stores a durable receipt and commits database effects with processing completion. [Idempotency](/packages/idempotency/) coordinates HTTP request handling and response replay; [Outbox](/packages/outbox/) records outgoing events with business writes; [Jobs](/packages/jobs/) schedules and executes background work. Their identities and retention windows protect different boundaries.

### Does accepting a message mean it has been processed exactly once?

No. `accept()` means the receipt was stored; both `accepted` and `duplicate` allow transport acknowledgment. Handlers can run again after a failure, but their writes through `context.tx` and inbox completion commit or roll back together. The guarantee lasts while the message identity is retained. External HTTP calls, email, and another database need their own idempotency or outbox contract, and Inbox does not guarantee ordering. Read [Processing](/packages/inbox/processing) and [Operations](/packages/inbox/operations) before choosing retention or replay policies.

---

## @nestarc/pagination

### Should I use cursor or offset pagination?

- **Offset**: Page numbers, total count display, admin dashboards
- **Cursor**: Infinite scroll, large datasets, real-time data with consistent results

Cursor mode activates automatically when `after`/`before` parameters are present.

### What happens when a disallowed filter column is used?

When `filterableColumns` is configured, a disallowed column or operator throws `InvalidFilterColumnError` (400). If the option is omitted, request filters are ignored. Configure an explicit allowlist (including `{}` to reject every requested filter), and keep authorization and tenant predicates in the server-controlled `where` option.
