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

Both `relrowsecurity` and `relforcerowsecurity` must be `true`. If `relforcerowsecurity` is `false`, the table owner bypasses RLS:

```sql
ALTER TABLE your_table_name FORCE ROW LEVEL SECURITY;
```

2. **Check your connection role:**

```sql
SELECT current_user, current_setting('is_superuser');
```

Superusers bypass RLS entirely. Create a dedicated application role:

```sql
CREATE ROLE app_user LOGIN PASSWORD 'secret';
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

3. **Check that `set_config` is running inside the transaction:**

Add temporary logging to your Prisma extension to confirm the tenant ID is being set:

```sql
SELECT current_setting('app.current_tenant', true);
```

If this returns `NULL` or empty string, the `set_config` call isn't reaching the database.

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
AuditLogModule.forRoot({
  trackedModels: ['User', 'Task'], // model names must match Prisma schema exactly
})
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

If it doesn't exist, run the migration:

```bash
npx prisma migrate dev
```

---

### Audit records have `null` tenant_id

**Symptom:** Audit records are created but `tenant_id` is always `null`.

**Root cause:** `@nestarc/tenancy` is either not installed or the tenant context is not available when the audit extension runs.

**Fix:** Ensure `TenancyModule` is imported **before** `AuditLogModule` in your `AppModule`:

```typescript
@Module({
  imports: [
    TenancyModule.forRoot({ ... }),    // first
    AuditLogModule.forRoot({ ... }),   // second
  ],
})
export class AppModule {}
```

And ensure the Prisma extension chain has tenancy first:

```typescript
const prisma = new PrismaClient()
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

1. **Verify the model is in `softDeleteModels`:**

```typescript
SoftDeleteModule.forRoot({
  softDeleteModels: ['User', 'Post'], // check your model is listed
})
```

2. **Check the `deletedAt` column name:**

By default, the extension looks for `deletedAt`. If your column has a different name (e.g., `deleted_at`), configure it:

```typescript
SoftDeleteModule.forRoot({
  softDeleteModels: ['User'],
  deletedAtField: 'deleted_at',
})
```

3. **Check for `@WithDeleted()` decorator:**

If the route has `@WithDeleted()`, deleted records are intentionally included.

---

## Still Stuck?

- Check the [FAQ](/faq) for quick answers to common questions
- Search [GitHub Discussions](https://github.com/orgs/nestarc/discussions) for similar issues
- Open a [GitHub Issue](https://github.com/nestarc) with reproduction steps
