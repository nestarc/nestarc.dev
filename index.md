---
description: "nestarc — open-source NestJS building blocks and a metadata-only reliability control plane for multi-tenant SaaS backends."
layout: home

hero:
  name: nestarc
  text: Build reliable NestJS SaaS backends. See where async work breaks.
  tagline: Open-source modules protect data and delivery. Nestarc Reliability follows evidence across requests, databases, queues, workers, and webhooks — without collecting payloads.
  actions:
    - theme: brand
      text: Start with Open Source
      link: /getting-started
    - theme: alt
      text: Explore Reliability
      link: https://reliability.nestarc.dev/
      target: _self
    - theme: alt
      text: Browse Packages
      link: /packages/

features:
  - title: Establish safe boundaries
    details: Enforce tenant isolation, predictable API contracts, authorization, and auditability inside your application.
    link: /getting-started
    linkText: Start with tenancy
  - title: Deliver async work reliably
    details: Make retries, database events, background jobs, and outbound webhooks explicit and recoverable.
    link: /packages/
    linkText: Explore reliability primitives
  - title: Follow the evidence
    details: Correlate explicitly reported, metadata-only evidence without replacing your queue or moving customer payloads.
    link: https://reliability.nestarc.dev/
    linkText: Explore the read-only pilot
---

<script setup>
import HomeToolCard from './.vitepress/theme/components/HomeToolCard.vue'
import PackageCards from './.vitepress/theme/components/PackageCards.vue'
</script>

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
.reliability-section {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  margin-bottom: 56px;
  padding: 24px;
}
.reliability-section .subtitle {
  margin-bottom: 24px;
}
.reliability-path {
  display: grid;
  gap: 0;
  grid-template-columns: 1fr;
}
@media (min-width: 720px) {
  .reliability-section { padding: 32px; }
  .reliability-path { grid-template-columns: 1fr 1fr; }
}
.reliability-step {
  border-top: 1px solid var(--vp-c-divider);
  padding: 24px 0 0;
}
@media (min-width: 720px) {
  .reliability-step {
    border-left: 1px solid var(--vp-c-divider);
    border-top: 0;
    padding: 0 0 0 28px;
  }
  .reliability-step:first-child {
    border-left: 0;
    padding: 0 28px 0 0;
  }
}
.reliability-step .label {
  color: var(--vp-c-brand-1);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  text-transform: uppercase;
}
.reliability-step h3 {
  font-size: 1.15rem;
  margin: 0 0 8px;
}
.reliability-step p {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
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

<div class="reliability-section">

## Build locally. Follow failures across the whole path.

<p class="subtitle">
  Open-source packages keep execution in your environment. Nestarc Reliability correlates the bounded operational evidence those systems explicitly report; it does not execute customer work or collect request bodies, webhook payloads, raw logs, or SQL.
</p>

<div class="reliability-path">
  <div class="reliability-step">
    <div class="label">Open-source data plane</div>
    <h3>Own the execution path</h3>
    <p>Use tenancy, idempotency, outbox, jobs, and webhook independently or together inside your NestJS application.</p>
  </div>
  <div class="reliability-step">
    <div class="label">Hosted control plane</div>
    <h3>See where evidence stops</h3>
    <p>Follow one operation from request to external effect. The current pilot is read-only, and recovery controls are not enabled.</p>
  </div>
</div>

<div class="package-actions">
  <a class="primary" href="https://reliability.nestarc.dev/">Explore Reliability</a>
  <a href="mailto:hello@nestarc.dev?subject=Nestarc%20Reliability%20pilot">Request pilot access</a>
</div>

</div>

<div class="package-section">

## Package lineup

<p class="subtitle">
  <strong>Supported</strong> packages have active compatibility coverage and maintained documentation. <strong>Preview</strong> packages are usable, but their APIs and operating contracts are still evolving. Status does not replace the version number or changelog when assessing upgrade risk.
</p>

<PackageCards locale="en" />

<div class="package-actions">
  <a class="primary" href="/packages/">Compare all packages</a>
  <a href="/guide/adoption-roadmap">Read the adoption roadmap</a>
</div>

</div>

## Why nestarc?

<p class="subtitle">
  Multi-tenant SaaS teams repeatedly implement the same high-risk infrastructure. nestarc provides tested building blocks with explicit compatibility ranges, operational contracts, and documented limitations.
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
    <div class="solution">Timing-safe verification, zero-downtime rotation, fail-closed IP allowlists, and test/live isolation.</div>
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
    <div class="solution">Weighted fairness for in-memory workloads; BullMQ provides FIFO workers with context propagation.</div>
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

### Evidence over slogans

<div class="tooling-card">
  <p>Package documentation publishes benchmark setup, compatibility ranges, and known limitations alongside the feature guide. Benchmark results describe specific code paths under documented conditions; they are not universal latency promises or cross-package comparisons.</p>
  <div class="package-actions">
    <a href="/packages/">Review package evidence</a>
    <a href="/guide/prisma-7">Check compatibility</a>
  </div>
</div>

<div class="tooling-section">

### Tooling

<HomeToolCard locale="en" />

</div>

<div class="cta-box">
  <p><strong>Build a complete multi-tenant API in 30 minutes.</strong></p>
  <a class="primary" href="/guide/multi-tenant-saas">Full Tutorial</a>
  <a class="secondary" href="/getting-started">Quick Start (5 min)</a>
</div>

</div>
