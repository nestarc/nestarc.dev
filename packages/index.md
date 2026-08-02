---
description: "Compare all current nestarc SaaS packages by adoption stage, status, version, and production use case."
---

# Packages

nestarc publishes independent NestJS packages for production SaaS backends. Install only the modules that solve the problem in front of you, then add the next layer when the product needs it.

::: info Current scope
There are 13 SaaS backend packages under the `@nestarc` npm scope. Developer tools such as [`@nestarc/mcp-guard`](/tools/mcp-guard/) live under [Tooling](/tools/) instead of this package adoption path.
:::

## Status model

| Status | Meaning |
|--------|---------|
| Core | Mature package docs and generated API reference are available. |
| Beta | Published package with production-oriented docs; full generated API reference is being expanded. |
| Labs | Experimental or developer tooling outside the SaaS backend package lineup. |

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
| [`@nestarc/tenancy`](/packages/tenancy/) | Core | `0.13.0` | Tenant context, PostgreSQL RLS, Prisma query isolation, tenant-aware cache keys. | You need tenant data isolation enforced below application code. |
| [`@nestarc/safe-response`](/packages/safe-response/) | Core | `0.15.0` | Consistent API envelopes, errors, field selection, pagination, Swagger helpers. | Frontend teams need predictable responses across controllers. |
| [`@nestarc/pagination`](/packages/pagination/) | Core | `0.1.0` | Cursor and offset pagination with filters, sorting, and Swagger. | List endpoints are gaining custom query parsing and repeated DTOs. |

### Data safety

| Package | Status | Version | Solves | Start here |
|---------|--------|---------|--------|------------|
| [`@nestarc/soft-delete`](/packages/soft-delete/) | Core | `0.4.0` | Prisma soft delete, cascade, restore, purge, event hooks. | Deleting records must preserve auditability and avoid accidental reads. |
| [`@nestarc/idempotency`](/packages/idempotency/) | Beta | `0.4.0` | IETF draft-07-compatible `Idempotency-Key`, stable fingerprinting, response/header replay, Redis/Postgres storage. | Retries can duplicate payments, orders, refunds, imports, or webhook receivers. |

### Operations and auth

| Package | Status | Version | Solves | Start here |
|---------|--------|---------|--------|------------|
| [`@nestarc/audit-log`](/packages/audit-log/) | Core | `0.2.0` | Prisma CUD tracking, query cursors, retention, partitions, actor metadata. | You need to answer who changed what, when, and from where. |
| [`@nestarc/api-keys`](/packages/api-keys/) | Beta | `0.1.0` | Tenant-scoped API keys, hashing, peppers, environments, scopes. | Customers or integrations need scoped machine access. |
| [`@nestarc/feature-flag`](/packages/feature-flag/) | Core | `0.3.0` | DB-backed flags, cache adapters, rollout, tenant overrides, Admin API. | You want gradual rollout without external flag-service dependency. |
| [`@nestarc/rbac`](/packages/rbac/) | Core | `0.2.0` | Typed tenant-aware roles, fail-closed guards, resource scopes, Prisma storage, and audit hooks. | Controllers and services have ad hoc role checks that are starting to drift. |

### Async and integration

| Package | Status | Version | Solves | Start here |
|---------|--------|---------|--------|------------|
| [`@nestarc/outbox`](/packages/outbox/) | Beta | `0.1.0` | Transactional outbox, polling, SKIP LOCKED, retry, event decorators. | Database writes and event emission must succeed or recover together. |
| [`@nestarc/jobs`](/packages/jobs/) | Beta | `0.1.0` | Tenant-fair jobs, in-memory scheduler, BullMQ backend, context propagation. | One tenant's backlog should not starve everyone else's work. |
| [`@nestarc/webhook`](/packages/webhook/) | Beta | `0.12.1` | HMAC-signed webhook delivery, retries, circuit breaker, delivery logs. | Your app sends events to customer endpoints. |

### Privacy and compliance

| Package | Status | Version | Solves | Start here |
|---------|--------|---------|--------|------------|
| [`@nestarc/data-subject`](/packages/data-subject/) | Beta | `0.1.0` | GDPR/CCPA export and erase policies, retention, anonymization, outbox fan-out. | Privacy requests touch invoices, audit logs, tax records, and tenant data. |

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
