---
description: "Compare all current nestarc SaaS packages by adoption stage, support status, version, and operating use case."
---

# Packages

nestarc publishes independent NestJS packages for production SaaS backends. Install only the modules that solve the problem in front of you, then add the next layer when the product needs it.

::: info Current scope
There are 13 SaaS backend packages under the `@nestarc` npm scope. Developer tools such as [`@nestarc/mcp-guard`](/tools/mcp-guard/) live under [Tooling](/tools/) instead of this package adoption path.
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

| Step | Add this layer | Packages | Use when |
|------|----------------|----------|----------|
| 1 | SaaS API foundation | [tenancy](/packages/tenancy/), [safe-response](/packages/safe-response/), [pagination](/packages/pagination/) | You are building tenant-scoped HTTP APIs and want consistent response and list behavior. |
| 2 | Data safety | [soft-delete](/packages/soft-delete/), [idempotency](/packages/idempotency/) | Deletes, retries, payments, imports, or external callbacks can corrupt state if handled ad hoc. |
| 3 | Operations and auth | [audit-log](/packages/audit-log/), [api-keys](/packages/api-keys/), [feature-flag](/packages/feature-flag/), [rbac](/packages/rbac/) | Teams need traceability, scoped machine access, controlled rollout, or tenant-aware authorization. |
| 4 | Async and integration | [outbox](/packages/outbox/), [jobs](/packages/jobs/), [webhook](/packages/webhook/) | Writes need reliable event fan-out, background work, or outbound delivery. |
| 5 | Privacy and compliance | [data-subject](/packages/data-subject/) | Export, erase, retention, and legal basis workflows need consistent policy handling. |

See the [Adoption Roadmap](/guide/adoption-roadmap) for the detailed sequence.

## Package matrix

### Foundation

| Package | Status | Version | Solves | Start here |
|---------|--------|---------|--------|------------|
| [`@nestarc/tenancy`](/packages/tenancy/) | Supported | `0.14.0` | Tenant context, PostgreSQL RLS, Prisma 7 query isolation, tenant-aware cache keys. | You need tenant data isolation enforced below application code. |
| [`@nestarc/safe-response`](/packages/safe-response/) | Supported | `0.15.0` | Consistent API envelopes, errors, field selection, pagination, Swagger helpers. | Frontend teams need predictable responses across controllers. |
| [`@nestarc/pagination`](/packages/pagination/) | Supported | `0.3.0` | Prisma 7 cursor, keyset, and offset pagination with filters, sorting, and Swagger. | List endpoints are gaining custom query parsing and repeated DTOs. |

### Data safety

| Package | Status | Version | Solves | Start here |
|---------|--------|---------|--------|------------|
| [`@nestarc/soft-delete`](/packages/soft-delete/) | Supported | `0.6.0` | Prisma 7 soft delete, relation filters, cascade, bulk restore, purge, and event hooks. | Deleting records must preserve auditability and avoid accidental reads. |
| [`@nestarc/idempotency`](/packages/idempotency/) | Preview | `0.4.0` | IETF draft-07-compatible `Idempotency-Key`, stable fingerprinting, response/header replay, Redis/Postgres storage. | Retries can duplicate payments, orders, refunds, imports, or webhook receivers. |

### Operations and auth

| Package | Status | Version | Solves | Start here |
|---------|--------|---------|--------|------------|
| [`@nestarc/audit-log`](/packages/audit-log/) | Supported | `0.3.0` | Prisma 7 CUD tracking, query cursors, retention, partitions, actor metadata. | You need to answer who changed what, when, and from where. |
| [`@nestarc/api-keys`](/packages/api-keys/) | Preview | `0.3.0` | Tenant-scoped API keys, rotation, IP allowlists, lifecycle hooks, and verification metrics. | Customers or integrations need scoped machine access with enforceable origin and lifecycle policy. |
| [`@nestarc/feature-flag`](/packages/feature-flag/) | Supported | `0.5.0` | Prisma 7 DB-backed flags, typed evaluation, cache adapters, rollout, tenant overrides, Admin API. | You want gradual rollout without external flag-service dependency. |
| [`@nestarc/rbac`](/packages/rbac/) | Supported | `0.2.0` | Typed tenant-aware roles, fail-closed guards, resource scopes, Prisma storage, and audit hooks. | Controllers and services have ad hoc role checks that are starting to drift. |

### Async and integration

| Package | Status | Version | Solves | Start here |
|---------|--------|---------|--------|------------|
| [`@nestarc/outbox`](/packages/outbox/) | Preview | `0.1.0` | Transactional outbox, polling, SKIP LOCKED, retry, event decorators. | Database writes and event emission must succeed or recover together. |
| [`@nestarc/jobs`](/packages/jobs/) | Preview | `0.1.0` | Tenant-fair in-memory scheduling, BullMQ FIFO workers, context propagation. | You need shared job handlers across local tests and Redis-backed production workers. |
| [`@nestarc/webhook`](/packages/webhook/) | Supported | `0.13.0` | Idempotent HMAC-signed delivery, retry/replay operations, worker observability, and data retention. | Your app sends events to customer endpoints. |

### Privacy and compliance

| Package | Status | Version | Solves | Start here |
|---------|--------|---------|--------|------------|
| [`@nestarc/data-subject`](/packages/data-subject/) | Preview | `0.1.0` | GDPR/CCPA export and erase policies, retention, anonymization, outbox fan-out. | Privacy requests touch invoices, audit logs, tax records, and tenant data. |

## Tooling

| Tool | Status | Version | Purpose |
|------|--------|---------|---------|
| [`@nestarc/mcp-guard`](/tools/mcp-guard/) | Labs | `0.2.0` | Static scanning for MCP servers and MCP client configuration files. |

## Install pattern

Each package can be installed by name:

```bash
npm install @nestarc/tenancy
```

Replace `tenancy` with the package you want to adopt. Package-specific peer dependencies and setup steps are listed in each package's Installation page.
