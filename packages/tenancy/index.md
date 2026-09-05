---
description: "PostgreSQL Row Level Security multi-tenancy for NestJS and Prisma — automatic tenant isolation with one line of code."
---

<script setup>
import PackageVersion from '../../.vitepress/theme/components/PackageVersion.vue'
</script>

# @nestarc/tenancy

Multi-tenancy module for NestJS with **PostgreSQL Row Level Security (RLS)** and **Prisma** support.

One line of code. Automatic tenant isolation.

Start with the [multi-tenant SaaS implementation guide](/guide/multi-tenant-saas), then compare [PostgreSQL RLS with application-level tenancy](/blog/rls-vs-application-level-tenancy) before choosing the enforcement boundary.

::: tip
Current package version: <PackageVersion slug="tenancy" />

Version 0.16 adds schema-derived TEXT/UUID policies, a restrictive non-empty tenant-context guard, validated RPC restoration, and one canonical database setting key. It requires Node 22.13/24 and removes raw request data from lifecycle event payloads. Existing deployments must review and reapply generated RLS SQL; see [Migration](./migration#upgrade-to-0-16).
:::

## Features

- **RLS-based isolation** — PostgreSQL enforces tenant boundaries at the database level
- **AsyncLocalStorage** — Zero-overhead request-scoped tenant context (no `REQUEST` scope)
- **Prisma Client Extensions** — Automatic `set_config()` before every query
- **5 built-in extractors** — Header, Subdomain, JWT Claim, Path, Composite (fallback chain)
- **Lifecycle hooks** — `onTenantResolved` / `onTenantNotFound` for logging, auditing, custom error handling
- **Auto-inject tenant ID** — Optionally inject `tenant_id` into `create` / `createMany` / `upsert` operations
- **Shared models** — Whitelist models that skip RLS (e.g., `Country`, `Currency`)
- **`withoutTenant()`** — programmatic bypass for background jobs and admin queries
- **`tenancyTransaction()`** — public-API interactive transaction support with RLS, `maxWait`, `timeout`, and isolation-level forwarding
- **Fail-Closed mode** — `failClosed: true` blocks model queries without tenant context, preventing accidental data exposure
- **Testing utilities** — `TestTenancyModule`, `withTenant()`, `expectTenantIsolation()` via `@nestarc/tenancy/testing`
- **Event system** — optional `@nestjs/event-emitter` integration for `tenant.resolved`, `tenant.not_found`, etc.
- **Microservice propagation** — HTTP (`propagateTenantHeaders()`), Bull, Kafka, gRPC propagators with zero transport dependencies
- **Inbound context restoration** — `TenantContextInterceptor` auto-restores tenant context from incoming microservice messages
- **Non-HTTP fail-closed policy** — diagnose or reject missing tenant context across BullMQ, Kafka, gRPC, cache, Redis, and search paths
- **Tenant-scoped resources** — collision-safe `TenantResourceKey` identifiers and a vendor-neutral `TenantSearch` boundary
- **Tenant-aware caching** — `TenantCacheInterceptor` scopes Nest response cache keys by tenant, with explicit shared-cache opt-in
- **Error hierarchy** — `TenantContextMissingError` base class enables unified `instanceof` catch handling
- **CLI scaffolding** — `npx @nestarc/tenancy init` generates RLS policies and module config
- **CLI drift detection** — `npx @nestarc/tenancy check` validates SQL against Prisma schema
- **Live database doctor** — `npx @nestarc/tenancy doctor` audits the runtime role, RLS catalogs, policies, grants, indexes, and optional active isolation behavior
- **Multi-schema support** — `@@schema()` directives generate schema-qualified SQL (e.g., `"auth"."users"`)
- **ccTLD-aware subdomain extraction** — accurate parsing for `.co.uk`, `.co.jp`, `.com.au`, etc.
- **SQL injection safe** — `set_config()` with bind parameters, plus UUID validation by default
- **NestJS 10 & 11** compatible, with **first-class Prisma 7** support and verified Prisma 6/PgBouncer compatibility lanes

## Performance

Measured with PostgreSQL 16.14, Prisma Client 7.9.1, 1005 rows, 500 measured iterations on Apple M1 Pro:

| Scenario | Rows | Avg | P50 | P95 | P99 |
|----------|------|-----|-----|-----|-----|
| Admin direct `findMany` (all rows, no RLS) | 1005 | 1.779ms | 1.585ms | 3.199ms | 5.261ms |
| Admin tenant-filtered `findMany` (`WHERE tenant_id`, no RLS) | 402 | 1.081ms | 0.972ms | 1.643ms | 3.616ms |
| `app_user` manual RLS transaction (`set_config` + `findMany`) | 402 | 2.375ms | 2.253ms | 3.057ms | 5.337ms |
| `app_user` tenancy extension `findMany` | 402 | 2.372ms | 2.276ms | 2.891ms | 5.987ms |
| `app_user` tenancy extension `findFirst` | 1 | 1.605ms | 1.561ms | 2.209ms | 2.695ms |

The extension and equivalent manual RLS transaction were effectively tied in this run: **-0.003ms avg (-0.1%)**, **-0.166ms p95**. Treat sub-millisecond differences as run-to-run noise.

> Reproduce: `docker compose up -d --wait && npm run bench`

## Prerequisites

- Node.js >= 20.19
- NestJS 10 or 11
- Prisma 7 (recommended) or Prisma 6
- PostgreSQL (with RLS support)

See the shared [Prisma 7 setup guide](/guide/prisma-7) for generated-client and driver-adapter configuration.
