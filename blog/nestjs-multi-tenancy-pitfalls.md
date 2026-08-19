---
title: 5 Common Multi-Tenancy Pitfalls in NestJS (and How to Avoid Them)
date: 2026-04-06
description: Avoid data leaks, broken RLS policies, and race conditions when building multi-tenant NestJS APIs with PostgreSQL and Prisma.
author: nestarc
reviewed: 2026-08-19
versionScope: "@nestarc/tenancy 0.14.x, NestJS 10/11, Prisma 6/7, and PostgreSQL"
---

# 5 Common Multi-Tenancy Pitfalls in NestJS (and How to Avoid Them)

Building a multi-tenant SaaS backend sounds straightforward until data leaks between tenants, RLS policies silently fail, or tests pass locally but break in production. Here are five mistakes we see repeatedly — and concrete fixes for each.

## 1. Forgetting `FORCE ROW LEVEL SECURITY`

Enabling RLS on a table does **not** apply policies to the table owner. If your Prisma connection uses the same role that owns the tables, queries bypass RLS entirely.

```sql
-- This alone is NOT enough
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- You MUST also force RLS on the owner
ALTER TABLE tasks FORCE ROW LEVEL SECURITY;
```

**Why it's dangerous:** Everything works in development where you test with a non-owner role, then breaks silently in production where migrations ran as the owner.

**Fix:** Always pair `ENABLE` with `FORCE`. Better yet, use `@nestarc/tenancy`'s CLI to scaffold RLS policies — it generates both statements automatically:

```bash
npx nestarc-tenancy init --schema prisma/schema.prisma
```

## 2. Setting Tenant Context Outside a Transaction

PostgreSQL `set_config` with `is_local = true` scopes the setting to the current transaction. If you set the tenant and then run queries outside a transaction, the setting is lost.

```typescript
// Wrong: set_config is lost after the transaction ends
await prisma.$executeRaw`SELECT set_config('app.current_tenant', ${tenantId}, true)`;
await prisma.task.findMany(); // RLS sees NULL tenant — returns nothing or everything
```

`@nestarc/tenancy` solves this by using its Prisma extension to keep `set_config` and the query in one transaction. Registering the Nest module supplies context; you must also construct and use the extended client:

```typescript
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
})

const tenancyPrisma = basePrisma.$extends(
  createPrismaTenancyExtension(tenancyService),
);

// Use tenancyPrisma (or a wrapper's .client) for tenant-scoped queries.
await tenancyPrisma.task.findMany();
```

## 3. Not Validating the Tenant ID

The default validator accepts UUID tenant IDs and rejects invalid formats. If your tenant IDs are not UUIDs, or you also need an existence check, configure a custom validator:

```typescript
// Safe default for UUID tenant IDs
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
})

// Custom format plus existence check
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  validateTenantId: async (id) => {
    if (!/^[a-z0-9-]{3,36}$/.test(id)) return false;
    const tenant = await tenantRepo.findById(id);
    return !!tenant;
  },
})
```

Keep the UUID default unless your identifier scheme requires something else. An existence check can additionally reject unknown but well-formed IDs.

## 4. Leaking Tenant Context in Background Jobs

HTTP middleware sets the tenant context per request. But background jobs (cron, queues, event handlers) run outside the request lifecycle — there is no `X-Tenant-Id` header.

```typescript
// This will fail — no request context
@Cron('0 * * * *')
async cleanupExpiredTasks() {
  // TenantMiddleware never ran, so tenant context is undefined
  await this.taskService.deleteExpired();
}
```

**Fix:** Explicitly set tenant context for background operations:

```typescript
@Cron('0 * * * *')
async cleanupExpiredTasks() {
  const tenants = await this.tenantRepo.findAll();
  for (const tenant of tenants) {
    await this.tenancyContext.run(tenant.id, async () => {
      await this.taskService.deleteExpired();
    });
  }
}
```

## 5. Testing Without Tenant Isolation Assertions

Writing CRUD tests that only check "the response is 200" misses the most critical property: **tenant A cannot see tenant B's data**.

```typescript
// Incomplete test — doesn't prove isolation
it('should list tasks', async () => {
  const res = await request(app.getHttpServer())
    .get('/tasks')
    .set('X-Tenant-Id', 'tenant-a');
  expect(res.status).toBe(200);
});

// Better: prove isolation
it('should not leak data between tenants', async () => {
  // Create a task as tenant-a
  await request(app.getHttpServer())
    .post('/tasks')
    .set('X-Tenant-Id', 'tenant-a')
    .send({ title: 'Secret task' });

  // Query as tenant-b — must not see tenant-a's task
  const res = await request(app.getHttpServer())
    .get('/tasks')
    .set('X-Tenant-Id', 'tenant-b');

  expect(res.body.data).toHaveLength(0);
});
```

`@nestarc/tenancy/testing` provides `withTenant()` to run unit-test code inside a scoped tenant context.

## Next Steps

- [Getting Started](/getting-started) — set up your first multi-tenant API in 5 minutes
- [Tenant Extractors](/packages/tenancy/extractors) — header, subdomain, JWT, and custom strategies
- [Testing Utilities](/packages/tenancy/testing) — mock tenant context in unit tests
- [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) — owner bypass, `FORCE ROW LEVEL SECURITY`, and policy behavior
