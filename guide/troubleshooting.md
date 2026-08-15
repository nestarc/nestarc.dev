---
description: "Step-by-step troubleshooting for common nestarc issues — RLS not filtering, empty query results, audit logs missing, and Prisma extension conflicts."
---

# Troubleshooting

Step-by-step debugging guides for common issues. Each section starts with the **symptom you observe**, explains the **root cause**, and walks through the **fix**.

## Tenant Isolation

### Queries return all rows (RLS not filtering)

**Symptom:** `findMany()` returns data from all tenants instead of the current one.

**Diagnosis:**

1. **Check if RLS is enabled and forced:**

```sql
SELECT relname, relrowsecurity, relforcerowsecurity
FROM pg_class
WHERE relname = 'your_table_name';
```

Both `relrowsecurity` and `relforcerowsecurity` must be `true`. Enable RLS first, then force table owners to obey it:

```sql
ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;
ALTER TABLE your_table_name FORCE ROW LEVEL SECURITY;
```

2. **Check your connection role:**

```sql
SELECT current_user, rolsuper, rolbypassrls
FROM pg_roles
WHERE rolname = current_user;
```

Superusers and roles with `BYPASSRLS` bypass RLS entirely. Have a database administrator or provisioning process create a dedicated application role (`CREATE ROLE` requires `CREATEROLE` or superuser privilege), then let the migration owner apply schema/table grants:

```sql
CREATE ROLE app_user LOGIN NOSUPERUSER NOBYPASSRLS PASSWORD 'secret';
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
```

Update your `DATABASE_URL` to use this role.

3. **Check if the policy exists:**

```sql
SELECT * FROM pg_policies WHERE tablename = 'your_table_name';
```

If empty, create the policy:

```sql
CREATE POLICY tenant_isolation ON your_table_name
  USING (tenant_id = current_setting('app.current_tenant', true)::text);
```

4. **Run the CLI check:**

```bash
npx @nestarc/tenancy check
```

This detects drift between your Prisma schema and SQL policies.

---

### Queries return zero rows (but data exists)

**Symptom:** `findMany()` returns `[]` even though the table has data.

**Root cause:** Tenant context is not being set, so `current_setting('app.current_tenant')` returns `NULL`, which matches no rows.

**Diagnosis:**

1. **Verify the tenant header is being sent:**

```bash
curl -v http://localhost:3000/users -H "X-Tenant-Id: your-tenant-id"
```

Check that the `X-Tenant-Id` header appears in the request.

2. **Verify the extractor is configured correctly:**

```typescript
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id', // must match the header name exactly
})
```

3. **Check that `set_config` and the model query share one transaction:**

Enable Prisma query logging temporarily and confirm `SELECT set_config(..., true)` and the affected model query run in the same transaction/connection. The setting is transaction-local. A separate diagnostic query can legitimately return `NULL`, so this query is only meaningful inside that same transaction:

```sql
SELECT current_setting('app.current_tenant', true);
```

If it returns `NULL` inside the transaction that contains the model query, the tenant context is not reaching the database.

4. **Check the `tenant_id` values in your data:**

```sql
SELECT DISTINCT tenant_id FROM your_table_name;
```

Ensure the value you're sending in `X-Tenant-Id` matches exactly (case-sensitive).

---

## Audit Logging

### Audit records are not being created

**Symptom:** CUD operations succeed, but no rows appear in the `audit_logs` table.

**Diagnosis:**

1. **Check `trackedModels` configuration:**

```typescript
const client = basePrisma.$extends(
  createAuditExtension({
    trackedModels: ['User', 'Task'], // model names must match Prisma schema exactly
    prismaModule,
  }),
);
```

Model names are case-sensitive. `user` does not match `User`.

2. **Check that the extended Prisma client is being used:**

The audit extension only works when queries go through the extended client. If you're using a raw `PrismaClient` instance (without `$extends`), writes are not tracked.

3. **Check for `@NoAudit()` decorator:**

If the route or controller has `@NoAudit()`, audit tracking is skipped for that handler.

4. **Check the database for errors:**

Audit inserts run best-effort — they don't fail the business operation. Check your application logs for warnings like:

```
[AuditLog] Warning: Failed to insert audit record: ...
```

5. **Verify the `audit_logs` table exists:**

```sql
SELECT * FROM information_schema.tables WHERE table_name = 'audit_logs';
```

If it does not exist, add the SQL from `getAuditTableSQL()` to a checked-in migration and apply it through your deployment workflow, or run `applyAuditTableSchema()` once with a schema-owner setup client. A bare `prisma migrate dev` cannot create a table that is absent from both the Prisma schema and migration files. See [Audit-log installation](/packages/audit-log/installation).

---

### Audit records have `null` tenant_id

**Symptom:** Audit records are created but `tenant_id` is always `null`.

**Root cause:** `@nestarc/tenancy` is either not installed or the tenant context is not available when the audit extension runs.

**Fix:** Confirm the tenancy middleware ran for the route and that its extractor resolved a validated tenant before the audited call. Module import order alone does not supply audit context. In a fail-closed application, set `tenantRequired: true` independently on both the audit extension and `AuditLogModule`; if you use a custom context implementation, provide the matching audit tenant resolver. See [Audit Trail: Multi-tenancy Integration](/guide/audit-trail#step-9-multi-tenancy-integration).

```typescript
const client = basePrisma.$extends(
  createAuditExtension({
    prismaModule,
    tenantRequired: true,
  }),
);

AuditLogModule.forRoot({
  prisma: basePrisma,
  prismaModule,
  actorExtractor,
  tenantRequired: true,
});
```

These two `tenantRequired` options do not have identical failure semantics. With automatic extension tracking, a missing tenant skips/reports the audit row while the business mutation still succeeds; it is not a mutation-level fail-closed control. Module-side manual `log()` and tenant-scoped query methods throw when their required context is missing. Monitor skipped/error signals and rely on tenancy/RLS for the business data boundary.

Separately, keep the Prisma query extensions in isolation order. Here, `basePrisma` is the generated Prisma 7 client configured with the PostgreSQL driver adapter from [Prisma 7 Setup](/guide/prisma-7#create-the-runtime-client):

```typescript
const prisma = basePrisma
  .$extends(createPrismaTenancyExtension(tenancyService))  // first
  .$extends(createAuditExtension(auditOpts));               // second
```

---

## Prisma Extensions

### "Cannot read properties of undefined" in extension chain

**Symptom:** Runtime error when chaining multiple `$extends` calls.

**Root cause:** Extensions must be chained sequentially, not applied to the same base client:

```typescript
// Wrong — both extensions receive the un-extended base client
const ext1 = prisma.$extends(tenancyExtension);
const ext2 = prisma.$extends(auditExtension); // does NOT include tenancy

// Correct — each extension wraps the previous result
const extended = prisma
  .$extends(tenancyExtension)
  .$extends(auditExtension);
```

See the [Prisma Extension Chaining](/guide/prisma-extension-chaining) guide for the full pattern.

---

### Soft-deleted records still appearing in queries

**Symptom:** Records with a `deletedAt` timestamp still show up in `findMany()` results.

**Diagnosis:**

1. **Verify the model is in the Prisma extension configuration:**

```typescript
const client = basePrisma.$extends(
  createPrismaSoftDeleteExtension({
    softDeleteModels: ['User', 'Post'], // check your model is listed
    deletedAtField: 'deletedAt',
  }),
);
```

2. **Check the Prisma field name:**

The extension option uses the Prisma model field, not the database column name. With `deletedAt DateTime? @map("deleted_at")`, keep `deletedAtField: 'deletedAt'`:

```typescript
createPrismaSoftDeleteExtension({
  softDeleteModels: ['User'],
  deletedAtField: 'deletedAt',
})
```

3. **Check for `@WithDeleted()` decorator:**

If the route has `@WithDeleted()`, deleted records are intentionally included.

---

## Still Stuck?

- Check the [FAQ](/faq) for quick answers to common questions
- Search [GitHub Discussions](https://github.com/orgs/nestarc/discussions) for similar issues
- Open a [GitHub Issue](https://github.com/nestarc) with reproduction steps
