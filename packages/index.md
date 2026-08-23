---
description: "Compare all current nestarc SaaS packages by adoption stage, support status, version, and operating use case."
outline: [2, 3]
---

<script setup>
import AdoptionPathTable from '../.vitepress/theme/components/AdoptionPathTable.vue'
import CatalogScopeSummary from '../.vitepress/theme/components/CatalogScopeSummary.vue'
import ToolCatalogTable from '../.vitepress/theme/components/ToolCatalogTable.vue'
</script>

# Packages

nestarc publishes independent NestJS packages for production SaaS backends. Install only the modules that solve the problem in front of you, then add the next layer when the product needs it.

::: info Current scope
<CatalogScopeSummary />
:::

## Status model

| Status | Meaning |
|--------|---------|
| Supported | Actively maintained package with documented compatibility coverage and operating guidance. |
| Preview | Published package with an evolving API or operating contract; validate it against your production requirements. |
| Labs | Experimental or developer tooling outside the SaaS backend package lineup. |

::: warning Version and status are different signals
All current packages are pre-1.0. `Supported` describes active maintenance and compatibility coverage; it does not promise a frozen API. Review the package changelog and migration notes before upgrading.
:::

## Recommended adoption path

<AdoptionPathTable />

See the [Adoption Roadmap](/guide/adoption-roadmap) for the detailed sequence.

## Package matrix

<!-- package-matrix:start -->
### Foundation

| Package | Status | Version | Solves | Start here |
| --- | --- | --- | --- | --- |
| <span data-catalog-surface="package-matrix" data-catalog-package="tenancy" data-version="0.15.0" data-status="Supported"><a href="/packages/tenancy/"><code>@nestarc/tenancy</code></a></span> | Supported | `0.15.0` | Tenant context, PostgreSQL RLS, Prisma 6/7 query isolation, live database audits, and tenant-scoped non-HTTP resources. | You need tenant data isolation enforced below application code. |
| <span data-catalog-surface="package-matrix" data-catalog-package="safe-response" data-version="0.15.0" data-status="Supported"><a href="/packages/safe-response/"><code>@nestarc/safe-response</code></a></span> | Supported | `0.15.0` | Consistent API envelopes, errors, field selection, pagination, Swagger helpers. | Frontend teams need predictable responses across controllers. |
| <span data-catalog-surface="package-matrix" data-catalog-package="pagination" data-version="0.3.0" data-status="Supported"><a href="/packages/pagination/"><code>@nestarc/pagination</code></a></span> | Supported | `0.3.0` | Prisma 7 cursor, keyset, and offset pagination with filters, sorting, and Swagger. | List endpoints are gaining custom query parsing and repeated DTOs. |

### Data safety

| Package | Status | Version | Solves | Start here |
| --- | --- | --- | --- | --- |
| <span data-catalog-surface="package-matrix" data-catalog-package="soft-delete" data-version="0.6.0" data-status="Supported"><a href="/packages/soft-delete/"><code>@nestarc/soft-delete</code></a></span> | Supported | `0.6.0` | Prisma 7 soft delete, relation filters, cascade, bulk restore, purge, and event hooks. | Deleting records must preserve auditability and avoid accidental reads. |
| <span data-catalog-surface="package-matrix" data-catalog-package="idempotency" data-version="0.4.0" data-status="Preview"><a href="/packages/idempotency/"><code>@nestarc/idempotency</code></a></span> | Preview | `0.4.0` | IETF draft-07-compatible `Idempotency-Key`, stable fingerprinting, response/header replay, Redis/Postgres storage. | Retries can duplicate payments, orders, refunds, imports, or webhook receivers. |

### Operations and auth

| Package | Status | Version | Solves | Start here |
| --- | --- | --- | --- | --- |
| <span data-catalog-surface="package-matrix" data-catalog-package="audit-log" data-version="0.4.0" data-status="Preview"><a href="/packages/audit-log/"><code>@nestarc/audit-log</code></a></span> | Preview | `0.4.0` | Atomic Prisma tracking, checkpointed CSV export, durable SIEM streams, retention, and partitions. | You need to answer who changed what, when, and from where. |
| <span data-catalog-surface="package-matrix" data-catalog-package="api-keys" data-version="0.3.1" data-status="Preview"><a href="/packages/api-keys/"><code>@nestarc/api-keys</code></a></span> | Preview | `0.3.1` | Tenant-scoped API keys, verified Prisma 5/6 storage, rotation, IP allowlists, lifecycle hooks, and verification metrics. | Customers or integrations need scoped machine access with enforceable origin and lifecycle policy. |
| <span data-catalog-surface="package-matrix" data-catalog-package="feature-flag" data-version="0.5.0" data-status="Supported"><a href="/packages/feature-flag/"><code>@nestarc/feature-flag</code></a></span> | Supported | `0.5.0` | Prisma 7 DB-backed flags, typed evaluation, cache adapters, rollout, tenant overrides, Admin API. | You want gradual rollout without external flag-service dependency. |
| <span data-catalog-surface="package-matrix" data-catalog-package="rbac" data-version="0.2.0" data-status="Supported"><a href="/packages/rbac/"><code>@nestarc/rbac</code></a></span> | Supported | `0.2.0` | Typed tenant-aware roles, fail-closed guards, resource scopes, Prisma storage, and audit hooks. | Controllers and services have ad hoc role checks that are starting to drift. |

### Async and integration

| Package | Status | Version | Solves | Start here |
| --- | --- | --- | --- | --- |
| <span data-catalog-surface="package-matrix" data-catalog-package="outbox" data-version="0.2.0" data-status="Preview"><a href="/packages/outbox/"><code>@nestarc/outbox</code></a></span> | Preview | `0.2.0` | Transactional outbox, polling, SKIP LOCKED, retry, event decorators. | Database writes and event emission must succeed or recover together. |
| <span data-catalog-surface="package-matrix" data-catalog-package="jobs" data-version="0.3.1" data-status="Preview"><a href="/packages/jobs/"><code>@nestarc/jobs</code></a></span> | Preview | `0.3.1` | Typed job contracts, bootstrap-safe handler discovery, tenant-fair local scheduling, restart-safe BullMQ execution, Redis idempotency/dedupe, retries, graceful shutdown, and outbox publishing. | You need shared job handlers across local tests and Redis-backed production workers. |
| <span data-catalog-surface="package-matrix" data-catalog-package="webhook" data-version="0.13.0" data-status="Supported"><a href="/packages/webhook/"><code>@nestarc/webhook</code></a></span> | Supported | `0.13.0` | Idempotent HMAC-signed delivery, retry/replay operations, worker observability, and data retention. | Your app sends events to customer endpoints. |

### Privacy and compliance

| Package | Status | Version | Solves | Start here |
| --- | --- | --- | --- | --- |
| <span data-catalog-surface="package-matrix" data-catalog-package="data-subject" data-version="0.2.0" data-status="Preview"><a href="/packages/data-subject/"><code>@nestarc/data-subject</code></a></span> | Preview | `0.2.0` | GDPR/CCPA export and erase policies, retention, anonymization, outbox fan-out. | Privacy requests touch invoices, audit logs, tax records, and tenant data. |
<!-- package-matrix:end -->

## Tooling

<ToolCatalogTable view="packages" />

## Install pattern

Each package can be installed by name:

```bash
npm install @nestarc/tenancy
```

Replace `tenancy` with the package you want to adopt. Package-specific peer dependencies and setup steps are listed in each package's Installation page.
