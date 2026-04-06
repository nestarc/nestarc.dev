---
title: "RLS vs Application-Level Tenancy: Which One Should You Choose?"
date: 2026-04-06
description: "Compare PostgreSQL Row Level Security with application-level WHERE clauses for multi-tenant NestJS apps — security, performance, and complexity trade-offs."
author: nestarc
---

# RLS vs Application-Level Tenancy: Which One Should You Choose?

When building a multi-tenant application, the most fundamental decision is **where to enforce tenant isolation**. There are two primary approaches:

1. **Application-level** — add `WHERE tenant_id = ?` to every query in your code
2. **Database-level (RLS)** — let PostgreSQL enforce isolation via Row Level Security policies

Both work. But they fail differently, and that difference matters when customer data is at stake.

## The Comparison

| Factor | Application-Level | PostgreSQL RLS |
|--------|-------------------|----------------|
| **Isolation guarantee** | Only as good as your code | Enforced by the database engine |
| **Failure mode** | Silent data leak if you forget a WHERE clause | Query returns empty set (fail-closed) |
| **New developer risk** | Must know the convention | Cannot bypass — policies apply to all queries |
| **ORM compatibility** | Works with any ORM | Requires `set_config` per transaction |
| **Performance** | No overhead beyond the WHERE clause | Small overhead from policy evaluation |
| **Debugging** | Straightforward — query is explicit | Harder — invisible filter on queries |
| **Schema complexity** | None — just add a column | RLS policies + FORCE required |
| **Cross-tenant queries** | Easy — omit the WHERE clause | Requires a superuser or policy exception |

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
- **Multiple developers work on the codebase** — a new developer cannot accidentally bypass isolation
- **You want defense in depth** — even if application code has a bug, the database blocks cross-tenant access
- **You use PostgreSQL** — RLS is a mature, well-tested feature since PostgreSQL 9.5

```typescript
// RLS: the database handles isolation — your code stays clean
async findAll() {
  return this.prisma.task.findMany();
  // RLS policy: WHERE tenant_id = current_setting('app.current_tenant')
}
```

The downside: **setup complexity**. You need RLS policies on every table, `set_config` on every transaction, and `FORCE ROW LEVEL SECURITY` on the table owner.

## What nestarc Does

`@nestarc/tenancy` eliminates the RLS setup complexity while keeping the security guarantee:

- **Automatic `set_config`** — the Prisma extension sets tenant context per transaction
- **CLI scaffolding** — generates RLS policies from your Prisma schema
- **Fail-closed by default** — missing tenant context means empty results, not data leaks
- **Extractor strategies** — header, subdomain, JWT, path, or custom

```typescript
// One-time setup — then forget about tenant isolation
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
})
```

You get the security of RLS without the operational overhead of managing it manually.

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
