---
title: "RLS vs Application-Level Tenancy: Which One Should You Choose?"
date: 2026-04-06
description: "Compare PostgreSQL Row Level Security with application-level WHERE clauses for multi-tenant NestJS apps — security, performance, and complexity trade-offs."
author: nestarc
reviewed: 2026-09-23
versionScope: "@nestarc/tenancy 0.16.x, NestJS 10/11, Prisma 6/7, and PostgreSQL"
---

# RLS vs Application-Level Tenancy: Which One Should You Choose?

When building a multi-tenant application, the most fundamental decision is **where to enforce tenant isolation**. There are two primary approaches:

1. **Application-level** — add `WHERE tenant_id = ?` to every query in your code
2. **Database-level (RLS)** — let PostgreSQL enforce isolation via Row Level Security policies

Both work. But they fail differently, and that difference matters when customer data is at stake.

## The Comparison

| Factor | Application-Level | PostgreSQL RLS |
|--------|-------------------|----------------|
| **Isolation boundary** | Application predicates and authorization | Enabled policies evaluated for a restricted runtime role |
| **Failure mode** | A missing predicate can expose other tenants | Policy-dependent: rows may be filtered or writes rejected; privileged roles can bypass RLS |
| **New developer risk** | Must preserve tenant filters on every path | Ordinary queries remain policy-scoped; role, policy, and tenant-context mistakes still matter |
| **ORM compatibility** | Explicit predicates work with any ORM | This tenancy design needs transaction-local `set_config` on the query's connection |
| **Performance** | Cost of predicates and their indexes | Measure policies, predicates, and indexes with the real workload |
| **Debugging** | Straightforward — query is explicit | Harder — invisible filter on queries |
| **Schema complexity** | Tenant fields, relations, and indexes | Tenant schema plus enabled policies and explicit role/owner behavior |
| **Cross-tenant queries** | Separately authorized application path | Separately authorized role or policy path; keep it outside normal request handling |

This comparison assumes an application role that is neither superuser nor `BYPASSRLS`, with RLS enabled and tenant policies deployed on every tenant-owned table. Table owners normally bypass RLS unless `FORCE ROW LEVEL SECURITY` applies; `FORCE` does not constrain superusers or `BYPASSRLS`. See [PostgreSQL's role and policy rules](https://www.postgresql.org/docs/current/ddl-rowsecurity.html). A tenant identifier must come from an authenticated, authorized context, not an unverified header.

## When Application-Level Wins

Application-level tenancy is simpler when:

- **You need frequent cross-tenant operations** — admin dashboards, analytics, migrations
- **Your ORM doesn't support `set_config`** — some ORMs make per-transaction configuration difficult
- **You use a database without RLS** — MySQL, SQLite, older PostgreSQL

```typescript
// Application-level: explicit and visible
async findAll(tenantId: string) {
  return this.prisma.task.findMany({
    where: { tenantId },
  });
}
```

The downside: **every query must include the tenant filter**. Forget it once, and data leaks silently. With 50+ service methods, this is a real risk.

## When RLS Wins

RLS is stronger when:

- **Data isolation is a security requirement** — B2B SaaS, healthcare, finance
- **Multiple developers work on the codebase** — a missing application predicate need not remove the database policy boundary
- **You want defense in depth** — correctly deployed policies add a check below application queries
- **You use PostgreSQL** — RLS is a mature, well-tested feature since PostgreSQL 9.5

```typescript
// RLS: the database handles isolation — your code stays clean
async findAll() {
  return this.prisma.task.findMany();
  // RLS policy: WHERE tenant_id = current_setting('app.current_tenant')
}
```

The downside: **setup complexity**. This tenant-context design needs policies on each tenant-owned table, transaction-local `set_config`, and a restricted runtime role. Keep migration-owner credentials separate; use `FORCE ROW LEVEL SECURITY` when owner queries must also be subject to policies.

## What nestarc Does

`@nestarc/tenancy` reduces the RLS setup complexity while keeping enforcement in PostgreSQL:

- **Automatic `set_config`** — the Prisma extension sets tenant context per transaction
- **CLI scaffolding** — generates RLS policies from your Prisma schema
- **Explicit missing-context behavior** — `failClosed: true` rejects model access without context; restrictive SQL policies provide an independent database boundary
- **Extractor strategies** — header, subdomain, JWT, path, or custom

```typescript
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
})

const tenancyPrisma = basePrisma.$extends(
  createPrismaTenancyExtension(tenancyService, { failClosed: true }),
);

// Application code must use this extended client for tenant-scoped queries.
await tenancyPrisma.task.findMany();
```

The extension sets the transaction-local tenant context, while the database applies the RLS policy. You still need to deploy and test policies, use the extended client consistently, separate privileged cross-tenant paths, and verify table-owner behavior.

## Decision Checklist

Choose **application-level** if:
- [ ] You frequently need cross-tenant queries
- [ ] You don't use PostgreSQL
- [ ] Your team is small and can enforce conventions

Choose **RLS** (with `@nestarc/tenancy`) if:
- [ ] Data isolation is a compliance or security requirement
- [ ] Multiple developers work on the codebase
- [ ] You want defense in depth
- [ ] You use PostgreSQL 14+

## Further Reading

- [Getting Started](/getting-started) — set up RLS-based tenancy in 5 minutes
- [Tenant Extractors](/packages/tenancy/extractors) — header, subdomain, JWT, and custom strategies
- [5 Common Multi-Tenancy Pitfalls](/blog/nestjs-multi-tenancy-pitfalls) — mistakes to avoid with RLS
- [Multi-Tenant NestJS Guide](/guide/multi-tenant-saas#start-with-a-working-example) — pinned authenticated example, runtime roles, and isolation tests
- [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) — authoritative policy and owner-bypass behavior

The current tenancy 0.16 release requires Node 22.13/24 and adds restrictive non-empty-context RLS guards plus explicit RPC validation. Review the [0.16 migration](/packages/tenancy/migration#upgrade-to-0-16) before upgrading existing SQL or lifecycle-event listeners.
