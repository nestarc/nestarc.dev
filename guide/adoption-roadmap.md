---
description: "Recommended adoption path for nestarc packages — start with a SaaS API foundation, then add data safety, operational traceability, async events, privacy workflows, and tenant-aware access control."
---

<script setup>
import AdoptionPackageTable from '../.vitepress/theme/components/AdoptionPackageTable.vue'
import AdoptionPathTable from '../.vitepress/theme/components/AdoptionPathTable.vue'
import AdoptionStagePackages from '../.vitepress/theme/components/AdoptionStagePackages.vue'
</script>

# Adoption Roadmap

nestarc packages are independent — you can install any one without the others. But if you are seeing nestarc for the first time, do not start by trying to use the full SaaS package lineup. Start with the shape of your SaaS API, then add the packages that match the next operational problem you are solving.

## Recommended Adoption Path

<AdoptionPathTable view="roadmap" />

This path is not a dependency graph. It is a product-building order: each step gives your backend a capability that teams usually need before the next layer becomes useful.

## Step 1: SaaS API Foundation

Start here when you are building the first production-facing API surface.

**Why first:** Tenant boundaries, response consistency, and list endpoints shape almost every controller and service. Adding these early avoids breaking changes later.

**What you get:**
- PostgreSQL RLS tenant isolation on all queries
- Standardized `{ success, data, error, meta }` responses
- Cursor and offset pagination with filters and Swagger docs

**Time to integrate:** 15–30 minutes

<AdoptionStagePackages :step="1" />

[Getting Started →](/getting-started) · [safe-response Quick Start →](/guide/safe-response-quick-start) · [pagination Quick Start →](/guide/pagination-quick-start)

---

## Step 2: Data Safety

Add these before user actions can accidentally create duplicate or unrecoverable data changes.

**Why second:** Once users can create, update, and delete records, you need protection against accidental deletion and retry storms.

**What you get:**
- Soft-delete filtering, restore, purge, and cascade behavior
- Idempotency-Key handling for non-idempotent writes
- Response replay for safe retries

**Time to integrate:** 15–30 minutes

<AdoptionStagePackages :step="2" />

---

## Step 3: Operational Traceability and Release Control

Add these when real users, operators, support workflows, or external clients enter the system.

**Why third:** Production systems need to answer who changed what, which machine client made a request, and whether a feature should be enabled for a tenant.

**What you get:**
- Automatic create, update, and delete audit records
- Tenant-scoped API keys with scopes, live/test isolation, zero-downtime rotation, and optional IP allowlists
- DB-backed feature flags with tenant overrides and rollout controls

**Time to integrate:** 30–60 minutes

<AdoptionStagePackages :step="3" />

[Audit Trail Guide →](/guide/audit-trail) · [Feature Flags Guide →](/guide/feature-flags-rollout)

---

## Step 4: Async Events

Add these when work needs to leave the request lifecycle.

**Why fourth:** Event delivery, background work, and customer webhooks are much easier to reason about once your core data and operational controls are in place.

**What you get:**
- Transactional outbox for reliable domain events
- Tenant-aware background jobs with in-memory and BullMQ backends
- Outbound webhook delivery with signing, retry, circuit breaker, and delivery logs

**Time to integrate:** 30–90 minutes, depending on adapters and infrastructure

<AdoptionStagePackages :step="4" />

---

## Step 5: Privacy and Compliance

Add this when customers can request exports or erasure, or when your data model needs explicit retention policies.

**Why fifth:** Data-subject workflows need a clear model of what data exists, what can be deleted, what must be retained, and which events should be emitted after completion.

**What you get:**
- Export and erase request lifecycle
- Per-entity delete, anonymize, retain, and mixed policies
- Legal retention tracking and outbox fan-out

**Time to integrate:** 30–60 minutes for a small model, longer for large domain models

<AdoptionStagePackages :step="5" />

[Policy Model →](/packages/data-subject/policy-model)

---

## Step 6: Access Control

Add this when your app has multiple roles, machine clients, service accounts, or resource-scoped permissions.

**Why sixth:** Authorization policy changes often lag behind core data-model work. Add RBAC once you know which tenant, global, and resource-scoped operations should be allowed.

**What you get:**
- Tenant-aware roles and permission checks
- Typed permission contracts and fail-closed configuration defaults
- Route guards and service-level authorization APIs
- Optional Prisma/PostgreSQL storage
- Audit-log and policy-change integration hooks
- Scenario and matrix testing helpers for allow/deny coverage

**Time to integrate:** 30–60 minutes for a small role model, longer if migrating an existing permission system

<AdoptionStagePackages :step="6" />

[Production Access-Control Recipe →](/guide/rbac-access-control) · [Guards & Permissions →](/packages/rbac/guards-permissions)

---

## Prisma Extension Order

When using multiple Prisma extension packages, chain them in this order:

```typescript
const prisma = new PrismaClient()
  .$extends(createPrismaTenancyExtension(tenancyService))    // 1. must be first
  .$extends(createPrismaSoftDeleteExtension(softDeleteOpts)) // 2. before audit
  .$extends(createAuditExtension(auditOpts));                // 3. last — sees final state
```

**Why this order matters:**
1. **Tenancy** must be first — it sets `app.current_tenant` via `set_config`, which all subsequent queries depend on
2. **Soft-delete** should come before audit-log — so audit records reflect the soft-delete (not a hard delete)
3. **Audit-log** should be last — it captures the final state of the operation after all other extensions have run

See the [Prisma Extension Chaining](/guide/prisma-extension-chaining) guide for a complete walkthrough.

## All Packages at a Glance

<AdoptionPackageTable />

## Tooling

`@nestarc/mcp-guard` is published under the same npm scope, but is not part of the SaaS package adoption path. It statically scans MCP servers and MCP client configuration files before you connect them to AI coding tools. See [mcp-guard](/tools/mcp-guard/).
