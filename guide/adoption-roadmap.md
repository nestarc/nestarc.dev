---
title: "NestJS SaaS Backend Adoption Roadmap"
description: "Choose an adoption order for nestarc packages, from multi-tenant API foundations through data safety, operations, async delivery, privacy, and access control."
---

<script setup>
import AdoptionPackageTable from '../.vitepress/theme/components/AdoptionPackageTable.vue'
import AdoptionPathTable from '../.vitepress/theme/components/AdoptionPathTable.vue'
import AdoptionStagePackages from '../.vitepress/theme/components/AdoptionStagePackages.vue'
</script>

# NestJS SaaS Backend Adoption Roadmap

nestarc packages are independent — you can install any one without the others. But if you are seeing nestarc for the first time, do not start by trying to use the full SaaS package lineup. Start with the shape of your SaaS API, then add the packages that match the next operational problem you are solving.

If you are still deciding which capabilities belong in your own codebase, use the [build-vs-buy decision guide](/blog/build-vs-buy-saas-backend-modules) before choosing an adoption stage.

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
- Transaction-first create, update, and delete audit records with an explicit legacy best-effort mode
- Tenant-scoped API keys with scopes, live/test isolation, zero-downtime rotation, and optional IP allowlists
- DB-backed feature flags with tenant overrides and rollout controls

**Time to integrate:** 30–60 minutes

::: warning Check Step 2 compatibility before installing
The command below lists standalone package versions. If you installed soft-delete 0.7.5 in
Step 2, its peer range excludes audit-log 0.8.0. Follow the [version-pinned lifecycle recipe](#prisma-extension-order)
instead of adding the latest audit-log to that dependency set. Do not bypass peer validation.
:::

<AdoptionStagePackages :step="3" />

Audit-log 0.8.0 provides [managed manual transactions and opt-in validation](/packages/audit-log/manual-logging), operation diagnostics, and [SQL Server history queries](/packages/audit-log/sql-server). Automatic Prisma tracking remains PostgreSQL-only.

[Audit Trail Guide →](/guide/audit-trail) · [Feature Flags Guide →](/guide/feature-flags-rollout)

---

## Step 4: Async Events

Add these when work needs to leave the request lifecycle.

**Why fourth:** Event delivery, background work, and customer webhooks are much easier to reason about once your core data and operational controls are in place.

**What you get:**
- Transactional outbox for reliable domain events
- Transactional inbox for incoming event deduplication and atomic database processing
- Tenant-aware jobs with in-memory fairness, durable BullMQ retry/dedupe, and first-party outbox publishing
- Outbound webhook delivery with signing, retry, circuit breaker, and delivery logs

**Time to integrate:** 30–90 minutes, depending on adapters and infrastructure

<AdoptionStagePackages :step="4" />

The combined command follows the supported Jobs/Outbox bridge versions. Add only the packages your application needs, and use each package's installation page for standalone setup and required peers.

Including Inbox 0.2.0 requires **NestJS `^11.2.8` and Prisma `^7.10.1`** across this composition. Inbox records incoming events before transport acknowledgment, then commits handler writes and completion together; Outbox records outgoing events alongside business writes. Follow [Inbox installation](/packages/inbox/installation) and its [retry, replay, and retention guidance](/packages/inbox/operations) for the receiving side.

[Async Delivery Reference Workflow →](/guide/async-delivery-workflow)

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

For tenant-scoped deletion and audit evidence, use tenancy 0.16.4, audit-log 0.7.0, and soft-delete 0.7.5. This combination requires Node.js `^22.23.4 || ^24.22.1` and NestJS 10/11. Soft-delete 0.7.5's optional peer range excludes audit-log 0.8.0.

```bash
npm install --save-exact --strict-peer-deps @nestarc/tenancy@0.16.4 @nestarc/audit-log@0.7.0 @nestarc/soft-delete@0.7.5
```

1. Create an ordinary client with the per-query tenancy extension for tenant-scoped queries.
2. Derive a separate lifecycle client from the same base Prisma client. Apply audit-log first with `consistency: 'atomic-required'`, `tenantRequired: true`, and a `tenantResolver` that returns the authorized tenant. Apply soft-delete second with `auditLifecycle: 'atomic-required'`. Give that client to `SoftDeleteModule` for restore and purge.
3. Let audit-log open the transaction and pass it `tenancyTransactionCallback(tenancyService, work)`. The callback binds the tenant to that connection before performing any business work. Keep one authorized tenant throughout the transaction.

For example, inside an authorized request, with the lifecycle client and generated Prisma types from the [extension chaining guide](/guide/prisma-extension-chaining#prismaservice-example):

```typescript
import { tenancyTransactionCallback } from '@nestarc/tenancy';
import type { AuditTransactionMethods } from '@nestarc/audit-log';
import type { Prisma } from './generated/prisma/client';

const owner = lifecycleClient as unknown as Pick<
  AuditTransactionMethods<Prisma.TransactionClient>, 'withAuditTransaction'
>;
await owner.withAuditTransaction(tenancyTransactionCallback(
  tenancyService,
  async (tx: Prisma.TransactionClient) => tx.user.delete({ where: { id: userId } }),
));
```

Configure the audit model list, table mappings and batch caps for every soft-delete model and cascade child. The [full NestJS wiring](/guide/prisma-extension-chaining) includes those settings, the provider token, and restore and purge examples. The [0.16.4 PostgreSQL regression](https://github.com/nestarc/nestjs-tenancy/blob/v0.16.4/test/ecosystem/audit-lifecycle/verify.mjs) checks tenant isolation, committed deletes and restores, and rollback after an audit failure.

## All Packages at a Glance

<AdoptionPackageTable />

## Tooling

`@nestarc/mcp-guard` is published under the same npm scope, but is not part of the SaaS package adoption path. It statically scans MCP servers and MCP client configuration files before you connect them to AI coding tools. See [mcp-guard](/tools/mcp-guard/).
