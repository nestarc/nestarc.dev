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

Prisma 5 and 6. Prisma 6 is integration-tested in CI; Prisma 5 is unit-tested.

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

Multiple soft-deleted rows with the same value will break a standard unique constraint. Use a composite unique constraint instead:

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String
  deletedAt DateTime?

  @@unique([email, deletedAt])
}
```

Most databases treat `NULL` values as distinct in unique indexes, so uniqueness is enforced only among active records.

### What is the maximum cascade depth?

Default is 3. Adjust with the `maxCascadeDepth` option.

---

## @nestarc/feature-flag

### What is the flag evaluation priority?

Flags are evaluated through a 6-layer cascade. The first matching layer wins:

1. Archived (always false)
2. User override
3. Tenant override
4. Environment override
5. Percentage rollout
6. Global default

### How does percentage rollout work?

It hashes `flagKey + userId` (or `tenantId`) with murmurhash3 and takes the result modulo 100. The same user always lands in the same bucket, ensuring consistent results across requests.

---

## @nestarc/audit-log

### Can I modify or delete audit_logs records?

No. `applyAuditTableSchema` creates PostgreSQL rules that block UPDATE and DELETE on the audit table. This is by design to guarantee log integrity.

### What is the difference between automatic tracking and manual logging?

- **Automatic tracking**: The Prisma extension detects CUD operations and records before/after diffs
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
