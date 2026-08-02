---
description: "nestarc — production-ready NestJS modules for SaaS backends. Composable packages for multi-tenancy, API consistency, auditability, access control, reliable events, and tenant-aware operations."
layout: home

hero:
  name: nestarc
  text: Production-ready NestJS modules for SaaS backends
  tagline: Multi-tenancy, audit logs, feature flags, RBAC, and more — built on Prisma & PostgreSQL
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Browse Packages
      link: /packages/
    - theme: alt
      text: Explore Reliability
      link: https://reliability.nestarc.dev/
      target: _self

features:
  - title: SaaS API foundation
    details: Start with tenant isolation, consistent response envelopes, and reusable list endpoints.
    link: /packages/
    linkText: Step 1 · tenancy, safe-response, pagination
  - title: Data safety
    details: Add soft deletion and idempotency before retries, deletes, imports, or payments can corrupt state.
    link: /packages/
    linkText: Step 2 · soft-delete, idempotency
  - title: Operations and auth
    details: Add auditability, machine access, release control, and tenant-aware authorization.
    link: /packages/
    linkText: Step 3 · audit-log, api-keys, feature-flag, rbac
  - title: Async and integration
    details: Move side effects, background work, and outbound webhooks into reliable delivery flows.
    link: /packages/
    linkText: Step 4 · outbox, jobs, webhook
  - title: Privacy and compliance
    details: Model export, erase, anonymization, and retention policies before privacy requests become manual work.
    link: /packages/
    linkText: Step 5 · data-subject
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
  letter-spacing: 0;
}
.package-section {
  margin-bottom: 56px;
}
.package-section h2 {
  margin-bottom: 12px;
}
.package-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin: 24px 0;
}
@media (min-width: 720px) {
  .package-grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 960px) {
  .package-grid { grid-template-columns: 1fr 1fr 1fr; }
}
.package-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  display: block;
  min-height: 170px;
  padding: 16px;
  text-decoration: none;
}
.vp-doc a.package-card,
.vp-doc a.package-card:hover {
  text-decoration: none;
}
.package-card:hover {
  border-color: var(--vp-c-brand-1);
}
.package-card .status {
  color: var(--vp-c-brand-1);
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-transform: uppercase;
}
.package-card .title {
  color: var(--vp-c-text-1);
  display: block;
  font-weight: 700;
  margin-bottom: 8px;
}
.package-card p {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}
.package-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}
.package-actions a {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  display: inline-block;
  font-weight: 600;
  padding: 10px 14px;
  text-decoration: none;
}
.package-actions a.primary {
  background: var(--vp-c-brand-3);
  border-color: var(--vp-c-brand-3);
  color: #fff;
}
.status-note {
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
  line-height: 1.6;
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
  border-radius: 8px;
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
  border-radius: 8px;
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
.perf-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.perf-section .subtitle {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  margin-bottom: 24px;
}
.perf-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 48px;
}
@media (min-width: 640px) {
  .perf-grid { grid-template-columns: 1fr 1fr 1fr; }
}
.perf-card {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}
.perf-card .metric {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  letter-spacing: 0;
}
.perf-card .pkg {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
.perf-card .desc {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  margin-top: 4px;
}
.tooling-section {
  margin-bottom: 48px;
}
.tooling-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.tooling-card {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 24px;
}
.tooling-card .label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  margin-bottom: 8px;
}
.tooling-card p {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 12px;
}
.tooling-card a {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
</style>

<div class="why-section">

<div class="package-section">

## Package lineup

<p class="subtitle">
  Package cards use <strong>Core</strong> for modules with mature docs and generated API reference, and <strong>Beta</strong> for published modules whose generated API reference is still being expanded.
</p>

<div class="package-grid">
  <a class="package-card" href="/packages/tenancy/">
    <span class="status">Core · v0.13.0</span>
    <span class="title">tenancy</span>
    <p>PostgreSQL RLS + Prisma multi-tenancy with tenant-aware cache keys.</p>
  </a>
  <a class="package-card" href="/packages/safe-response/">
    <span class="status">Core · v0.15.0</span>
    <span class="title">safe-response</span>
    <p>API response wrapper with Swagger integration, field selection, error catalogs, and i18n support.</p>
  </a>
  <a class="package-card" href="/packages/pagination/">
    <span class="status">Core · v0.1.0</span>
    <span class="title">pagination</span>
    <p>Cursor and offset pagination with filters, sorting, and Swagger helpers.</p>
  </a>
  <a class="package-card" href="/packages/soft-delete/">
    <span class="status">Core · v0.5.0</span>
    <span class="title">soft-delete</span>
    <p>Prisma soft-delete with relation filters, cascade, bulk restore, purge, and lifecycle events.</p>
  </a>
  <a class="package-card" href="/packages/audit-log/">
    <span class="status">Core · v0.2.0</span>
    <span class="title">audit-log</span>
    <p>Prisma CUD tracking with query cursors, retention, partitions, and actor metadata.</p>
  </a>
  <a class="package-card" href="/packages/feature-flag/">
    <span class="status">Core · v0.3.0</span>
    <span class="title">feature-flag</span>
    <p>DB-backed feature flags with cache adapters, Admin API, rollouts, and tenant overrides.</p>
  </a>
  <a class="package-card" href="/packages/idempotency/">
    <span class="status">Beta · v0.4.0</span>
    <span class="title">idempotency</span>
    <p>IETF draft-07 Idempotency-Key handling with stable fingerprints, Redis/Postgres storage, and response/header replay.</p>
  </a>
  <a class="package-card" href="/packages/api-keys/">
    <span class="status">Beta · v0.1.0</span>
    <span class="title">api-keys</span>
    <p>Tenant-scoped API keys with hashing, versioned peppers, live/test environments, and scopes.</p>
  </a>
  <a class="package-card" href="/packages/rbac/">
    <span class="status">Core · v0.2.0</span>
    <span class="title">rbac</span>
    <p>Typed tenant-aware permissions, fail-closed guards, resource scopes, Prisma storage, and audit hooks.</p>
  </a>
  <a class="package-card" href="/packages/outbox/">
    <span class="status">Beta · v0.1.0</span>
    <span class="title">outbox</span>
    <p>Prisma-native transactional outbox with polling, retry, and event decorators.</p>
  </a>
  <a class="package-card" href="/packages/jobs/">
    <span class="status">Beta · v0.1.0</span>
    <span class="title">jobs</span>
    <p>Tenant-fair background jobs with in-memory scheduling, BullMQ, and context propagation.</p>
  </a>
  <a class="package-card" href="/packages/webhook/">
    <span class="status">Core · v0.13.0</span>
    <span class="title">webhook</span>
    <p>Idempotent outbound delivery with HMAC signing, retry and replay controls, worker metrics, and data retention.</p>
  </a>
  <a class="package-card" href="/packages/data-subject/">
    <span class="status">Beta · v0.1.0</span>
    <span class="title">data-subject</span>
    <p>GDPR/CCPA export and erase workflows with entity policies, retention, and outbox fan-out.</p>
  </a>
</div>

<div class="package-actions">
  <a class="primary" href="/packages/">Compare all packages</a>
  <a href="/guide/adoption-roadmap">Read the adoption roadmap</a>
</div>

</div>

## Why nestarc?

<p class="subtitle">
  Every multi-tenant SaaS backend needs the same operational building blocks. Building them from scratch takes weeks and introduces subtle bugs. nestarc solves them once, correctly.
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
  <div class="pain-card">
    <div class="label">Idempotency</div>
    <div class="problem">Network retries cause double charges, duplicate orders, and corrupt state.</div>
    <div class="solution">IETF draft-07 Idempotency-Key handling with fingerprint validation and response replay.</div>
  </div>
  <div class="pain-card">
    <div class="label">Transactional Outbox</div>
    <div class="problem">DB writes and event emission can get out of sync, causing lost or duplicate events.</div>
    <div class="solution">Prisma-native outbox with polling, SKIP LOCKED, and retry with backoff.</div>
  </div>
  <div class="pain-card">
    <div class="label">Webhook Delivery</div>
    <div class="problem">Reliable outbound webhooks require retry, signing, circuit breaking, and audit trails.</div>
    <div class="solution">HMAC-signed delivery with exponential backoff, circuit breaker, and full delivery logs.</div>
  </div>
  <div class="pain-card">
    <div class="label">API Keys</div>
    <div class="problem">Rolling your own key hashing, prefixing, and rotation is one bug away from a credential leak.</div>
    <div class="solution">SHA-256 + versioned peppers, Stripe-style prefixes, and test/live environment isolation.</div>
  </div>
  <div class="pain-card">
    <div class="label">Access Control</div>
    <div class="problem">Ad hoc role checks drift across controllers, services, tenants, and resource scopes.</div>
    <div class="solution">Tenant-aware RBAC keeps roles, permissions, and guards consistent.</div>
  </div>
  <div class="pain-card">
    <div class="label">Data Subject Rights</div>
    <div class="problem">GDPR/CCPA export and erase requests collide with legal retention on invoices, audits, and tax records.</div>
    <div class="solution">Per-entity policies with delete/anonymize/retain, legal basis tracking, and outbox fan-out.</div>
  </div>
  <div class="pain-card">
    <div class="label">Background Jobs</div>
    <div class="problem">One noisy tenant's backlog starves every other tenant's jobs in a plain FIFO queue.</div>
    <div class="solution">Weighted tenant-fair scheduler with minimum share, plus BullMQ backend for production.</div>
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

<div class="perf-section">

### Near-zero overhead

<p class="subtitle">Core request and data modules are benchmarked. Most add less than 1ms — some make queries faster.</p>

<div class="perf-grid">
  <div class="perf-card">
    <div class="pkg">tenancy</div>
    <div class="metric">-24%</div>
    <div class="desc">RLS filters rows, fewer returned</div>
  </div>
  <div class="perf-card">
    <div class="pkg">safe-response</div>
    <div class="metric">&lt; 0.2ms</div>
    <div class="desc">Response wrapping overhead</div>
  </div>
  <div class="perf-card">
    <div class="pkg">audit-log</div>
    <div class="metric">+1ms</div>
    <div class="desc">Per write with diff tracking</div>
  </div>
  <div class="perf-card">
    <div class="pkg">feature-flag</div>
    <div class="metric">0.04ms</div>
    <div class="desc">Flag evaluation (cache hit)</div>
  </div>
  <div class="perf-card">
    <div class="pkg">soft-delete</div>
    <div class="metric">0ms</div>
    <div class="desc">Zero overhead — actually faster</div>
  </div>
  <div class="perf-card">
    <div class="pkg">pagination</div>
    <div class="metric">~1ms</div>
    <div class="desc">Per page with filters & sort</div>
  </div>
  <div class="perf-card">
    <div class="pkg">idempotency</div>
    <div class="metric">0.04ms</div>
    <div class="desc">First-request overhead (MemoryStorage)</div>
  </div>
  <div class="perf-card">
    <div class="pkg">outbox</div>
    <div class="metric">&lt; 0.1ms</div>
    <div class="desc">Emit overhead per event in transaction</div>
  </div>
  <div class="perf-card">
    <div class="pkg">webhook</div>
    <div class="metric">&lt; 1ms</div>
    <div class="desc">Event persist + fan-out creation overhead</div>
  </div>
  <div class="perf-card">
    <div class="pkg">api-keys</div>
    <div class="metric">~5µs</div>
    <div class="desc">verify() per request (timing-safe)</div>
  </div>
  <div class="perf-card">
    <div class="pkg">data-subject</div>
    <div class="metric">~0.5ms</div>
    <div class="desc">erase() 1000 rows (library overhead)</div>
  </div>
  <div class="perf-card">
    <div class="pkg">jobs</div>
    <div class="metric">~2µs</div>
    <div class="desc">Enqueue overhead per call</div>
  </div>
</div>

</div>

<div class="tooling-section">

### Tooling

<div class="tooling-card">
  <div class="label">Labs · mcp-guard · v0.2.0</div>
  <p>Static scanner for MCP servers and client configuration files. It is published under the @nestarc scope, but lives separately from the NestJS SaaS module lineup.</p>
  <a href="/tools/">Explore tooling →</a>
</div>

</div>

<div class="cta-box">
  <p><strong>Build a complete multi-tenant API in 30 minutes.</strong></p>
  <a class="primary" href="/guide/multi-tenant-saas">Full Tutorial</a>
  <a class="secondary" href="/getting-started">Quick Start (5 min)</a>
</div>

</div>
