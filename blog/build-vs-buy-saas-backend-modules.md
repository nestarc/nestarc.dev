---
title: "Build vs Buy: When to Use a Library for SaaS Backend Features"
date: 2026-04-06
description: "Should you build multi-tenancy, audit logging, and feature flags from scratch or use a library? A practical comparison for NestJS developers."
author: nestarc
---

# Build vs Buy: When to Use a Library for SaaS Backend Features

Every SaaS backend needs multi-tenancy, audit logging, feature flags, and pagination. The question is: should you build them yourself or use a library?

This isn't a sales pitch. Sometimes building from scratch is the right call. Here's how to decide.

## The Real Cost of Building

The initial implementation isn't the expensive part. It's the **edge cases you discover in production**.

### Multi-Tenancy

**Looks easy:**
```typescript
// "Just add a WHERE clause"
findAll(tenantId: string) {
  return this.prisma.task.findMany({ where: { tenantId } });
}
```

**Actually hard:**
- What if someone forgets the WHERE clause? Silent data leak.
- What about `$executeRaw` and `$queryRaw`? Not filtered.
- What about background jobs with no request context?
- What about database migrations that touch multiple tenants?
- What about unique constraints that should be per-tenant?

A production-ready tenant isolation system handles all of these. That's weeks of work, not hours.

### Audit Logging

**Looks easy:**
```typescript
// "Just log the change"
await this.auditService.log({ action: 'update', model: 'User', data: dto });
```

**Actually hard:**
- What's the "before" state? You need a separate read before each write.
- How do you track batch operations (`updateMany`, `deleteMany`)?
- How do you handle sensitive fields (passwords, SSN)?
- What if the audit log insert fails — should the business write fail too?
- How do you ensure 100% coverage? (Hint: manual calls get forgotten.)

### Feature Flags

**Looks easy:**
```typescript
// "Just check a database table"
const flag = await this.db.featureFlag.findUnique({ where: { key: 'new-ui' } });
if (flag?.enabled) { ... }
```

**Actually hard:**
- How do you handle percentage rollouts consistently? (Same user must always see the same result.)
- How do you override per-tenant without a cascade of if-statements?
- How do you test routes gated behind flags?
- How do you clean up stale flags without breaking production?

## When Building Makes Sense

Build from scratch when:

- **Your requirements are unique** — your tenancy model doesn't fit the standard patterns (e.g., per-tenant databases, sharding)
- **You need deep integration** — the library's abstraction doesn't match your ORM, database, or framework
- **You're building it as a core competency** — you sell a platform where these features are the product
- **The scope is truly simple** — you have 3 tables, 1 developer, and no compliance requirements

## When a Library Makes Sense

Use a library when:

- **You need to ship quickly** — these are solved problems; re-solving them delays your actual product
- **Multiple developers will maintain the code** — a library provides consistent patterns across the team
- **You need correctness guarantees** — tenant isolation and audit logging can't have "oops" moments
- **The scope will grow** — today it's 3 tables, but SaaS projects rarely stay small

## The nestarc Approach

nestarc packages are designed for the "library makes sense" scenario:

| Feature | Build Time (DIY) | nestarc Setup | Ongoing Maintenance |
|---------|-------------------|---------------|---------------------|
| Multi-tenancy (RLS) | 2–3 weeks | 15 minutes | Handled by library |
| Audit logging | 1–2 weeks | 15 minutes | Handled by library |
| Feature flags | 1 week | 10 minutes | Handled by library |
| Soft delete | 3–5 days | 10 minutes | Handled by library |
| Pagination | 3–5 days | 10 minutes | Handled by library |
| Response standardization | 2–3 days | 5 minutes | Handled by library |

The key advantage isn't just setup time — it's that **edge cases are already handled**. The library has been tested against the subtle bugs you'd discover in week 3 of a custom implementation.

## Questions to Ask

Before deciding, ask yourself:

1. **"Would I be embarrassed if this had a bug?"** — If yes (tenancy, audit), use a tested library.
2. **"How many developers will touch this code?"** — If more than 2, consistency from a library helps.
3. **"Is this a differentiator for my product?"** — If no, don't invest custom engineering time.
4. **"Will I maintain this in 2 years?"** — Libraries get maintained by the community. Custom code only gets maintained by you.

## Further Reading

- [Getting Started](/getting-started) — set up your first nestarc package in 5 minutes
- [Adoption Roadmap](/guide/adoption-roadmap) — recommended order for adding packages
- [Prisma Extension Chaining](/guide/prisma-extension-chaining) — how packages compose together
