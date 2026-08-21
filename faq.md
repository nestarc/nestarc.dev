---
description: "Frequently asked questions about nestarc — package compatibility, NestJS/Prisma versions, licensing, and troubleshooting."
---

# FAQ

## General

### Do nestarc packages depend on each other?

No. Every package can be installed and used independently. They compose well together via Prisma extension chaining, but it is not required.

### Which NestJS versions are supported?

NestJS 10 and 11. Both are tested in CI.

### Which Prisma versions are supported?

Support is package-specific. tenancy supports Prisma 6/7; soft-delete, audit-log, and pagination support 5/6/7; feature-flag 0.5 requires Prisma 7. Prisma 7 is the primary development target for all five. See the [compatibility matrix](/guide/prisma-7#compatibility-matrix).

### Do you support both Express and Fastify?

`@nestarc/safe-response` supports both Express and Fastify out of the box. The other packages are HTTP adapter agnostic.

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
1. Use the `tenancyTransaction()` helper (recommended, works with all Prisma versions)
2. Enable `interactiveTransactionSupport: true` (depends on Prisma internals)

See [Installation](/packages/tenancy/installation#interactive-transactions) for details.

### How do I skip RLS for specific models?

Use the `sharedModels` option:

```typescript
createPrismaTenancyExtension(tenancyService, {
  sharedModels: ['Country', 'Currency'],
})
```

Queries on shared models skip `set_config` and `autoInjectTenantId`.

### How do I query without a tenant context?

Use `withoutTenant()` to explicitly clear the tenant context. Note that with RLS enabled, queries will return 0 rows. To query across all tenants, you need a separate admin connection that bypasses RLS.

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

Yes. Import `SafeResponseModule` before registering `ClassSerializerInterceptor`. Serialization runs first, then the result is wrapped.

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

It hashes `flagKey + targetingKey` with murmurhash3 and takes the result modulo 100. The targeting key resolves from an explicit key or configured context (with the service-path constraints documented in the rollout guide), so the same stable identifier remains in the same bucket.

---

## @nestarc/audit-log

### Can I modify or delete audit_logs records?

The generated row triggers block normal `UPDATE` and `DELETE` operations, but they are not a privilege boundary: PostgreSQL `TRUNCATE` does not run row triggers, and a table owner or superuser can alter or bypass them. Use separate runtime and maintenance identities, keep table ownership out of the application role, and revoke `UPDATE`, `DELETE`, and `TRUNCATE` from that runtime role.

### What is the difference between automatic tracking and manual logging?

- **Automatic tracking**: The Prisma extension detects CUD operations and records before/after diffs. In 0.4, choose `atomic-required` with `withAuditTransaction()` for same-transaction evidence or explicitly select legacy `best-effort`
- **Manual logging**: `AuditService.log()` records business events (e.g., "invoice.approved") explicitly

Both write to the same `audit_logs` table.

---

## @nestarc/pagination

### Should I use cursor or offset pagination?

- **Offset**: Page numbers, total count display, admin dashboards
- **Cursor**: Infinite scroll, large datasets, real-time data with consistent results

Cursor mode activates automatically when `after`/`before` parameters are present.

### What happens when a disallowed filter column is used?

An `InvalidFilterColumnError` (400) is thrown. Only columns and operators explicitly registered in `filterableColumns` are allowed. This is a security measure.
