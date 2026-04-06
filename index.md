---
description: "nestarc — production-ready NestJS modules for SaaS backends. Multi-tenancy, audit logs, feature flags, soft-delete, and pagination built on Prisma & PostgreSQL."
layout: home

hero:
  name: nestarc
  text: Production-ready NestJS modules for SaaS backends
  tagline: Multi-tenancy, audit logs, feature flags, and more — built on Prisma & PostgreSQL
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/nestarc

features:
  - title: tenancy
    details: PostgreSQL RLS + Prisma multi-tenancy. Row-level isolation out of the box.
    link: /packages/tenancy/
    linkText: v0.8.0
  - title: safe-response
    details: API response wrapper with Swagger integration, pagination, and i18n support.
    link: /packages/safe-response/
    linkText: v0.13.1
  - title: audit-log
    details: Prisma CUD auto-tracking with before/after diff. Know who changed what.
    link: /packages/audit-log/
    linkText: v0.1.0
  - title: feature-flag
    details: DB-based feature flags with tenant and user-level overrides.
    link: /packages/feature-flag/
    linkText: v0.1.0
  - title: soft-delete
    details: Prisma soft-delete extension with cascade delete and restore support.
    link: /packages/soft-delete/
    linkText: v0.2.0
  - title: pagination
    details: Cursor + offset pagination with 12 filter operators. Works with Swagger.
    link: /packages/pagination/
    linkText: v0.1.0
---

<style>
.why-section {
  max-width: 960px;
  margin: 0 auto;
  padding: 64px 24px;
}
.why-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}
.why-section .subtitle {
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
  margin-bottom: 40px;
  line-height: 1.6;
}
.pain-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 48px;
}
@media (min-width: 640px) {
  .pain-grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 960px) {
  .pain-grid { grid-template-columns: 1fr 1fr 1fr; }
}
.pain-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 24px;
}
.pain-card .label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  margin-bottom: 8px;
}
.pain-card .problem {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 8px;
}
.pain-card .solution {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  font-size: 0.9rem;
}
.before-after {
  margin-bottom: 48px;
}
.before-after h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
}
.cta-box {
  background: var(--vp-c-brand-soft);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
}
.cta-box p {
  margin-bottom: 16px;
  font-size: 1.05rem;
}
.cta-box a {
  display: inline-block;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  margin: 0 8px;
}
.cta-box .primary {
  background: var(--vp-c-brand-3);
  color: #fff;
}
.cta-box .secondary {
  border: 1px solid var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
</style>

<div class="why-section">

## Why nestarc?

<p class="subtitle">
  Every multi-tenant SaaS backend needs the same six features. Building them from scratch takes weeks and introduces subtle bugs. nestarc solves them once, correctly.
</p>

<div class="pain-grid">
  <div class="pain-card">
    <div class="label">Tenant Isolation</div>
    <div class="problem">One misconfigured query leaks customer data across tenants.</div>
    <div class="solution">PostgreSQL RLS enforces isolation at the database level.</div>
  </div>
  <div class="pain-card">
    <div class="label">Audit Trail</div>
    <div class="problem">Manually logging every write is tedious and easy to forget.</div>
    <div class="solution">Prisma extension auto-tracks CUD with before/after diffs.</div>
  </div>
  <div class="pain-card">
    <div class="label">Feature Flags</div>
    <div class="problem">External flag services add latency, cost, and a new dependency.</div>
    <div class="solution">DB-backed flags with tenant overrides and percentage rollouts.</div>
  </div>
  <div class="pain-card">
    <div class="label">Soft Delete</div>
    <div class="problem">deletedAt alone breaks unique constraints and leaks deleted records.</div>
    <div class="solution">Prisma extension with cascade, restore, and query filtering.</div>
  </div>
  <div class="pain-card">
    <div class="label">Pagination</div>
    <div class="problem">Implementing cursor + offset with filters is boilerplate-heavy.</div>
    <div class="solution">12 filter operators, sorting, and Swagger docs out of the box.</div>
  </div>
  <div class="pain-card">
    <div class="label">Response Format</div>
    <div class="problem">Inconsistent API envelopes across endpoints frustrate frontend teams.</div>
    <div class="solution">Auto-wrapped responses with error codes, pagination, and i18n.</div>
  </div>
</div>

<div class="before-after">

### Without nestarc

```typescript
// Scattered across 50+ services, easy to forget, hard to audit
async updateUser(id: string, dto: UpdateUserDto) {
  const before = await this.prisma.user.findUnique({ where: { id } });
  await this.prisma.$executeRaw`SELECT set_config('app.current_tenant', ${tenantId}, true)`;
  const after = await this.prisma.user.update({ where: { id, deletedAt: null }, data: dto });
  await this.auditService.log({ action: 'user.update', before, after });
  return { success: true, data: after, timestamp: new Date() };
}
```

### With nestarc

```typescript
// Tenant isolation, audit logging, soft-delete filtering, and response wrapping
// are all handled automatically by Prisma extensions and NestJS interceptors.
async updateUser(id: string, dto: UpdateUserDto) {
  return this.prisma.user.update({ where: { id }, data: dto });
}
```

</div>

<div class="cta-box">
  <p><strong>Build a complete multi-tenant API in 30 minutes.</strong></p>
  <a class="primary" href="/guide/multi-tenant-saas">Full Tutorial</a>
  <a class="secondary" href="/getting-started">Quick Start (5 min)</a>
</div>

</div>
