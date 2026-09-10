---
description: "Configure NestJS multi-tenancy with Prisma tenant context, PostgreSQL Row Level Security, restricted database roles, and isolation checks."
---

<script setup>
import PackageVersion from '../../.vitepress/theme/components/PackageVersion.vue'
</script>

# @nestarc/tenancy

Multi-tenancy module for NestJS with **PostgreSQL Row Level Security (RLS)** and **Prisma** support.

Configure the Nest module, Prisma extension, and database policies to apply tenant context to model queries. PostgreSQL enforces isolation through your RLS policies and runtime role.

Start with the [multi-tenant SaaS implementation guide](/guide/multi-tenant-saas), then compare [PostgreSQL RLS with application-level tenancy](/blog/rls-vs-application-level-tenancy) before choosing the enforcement boundary.

::: tip
Current package version: <PackageVersion slug="tenancy" />

Version 0.16 adds schema-derived TEXT/UUID policies, a restrictive non-empty tenant-context guard, validated RPC restoration, and one canonical database setting key. It requires Node 22.13/24 and removes raw request data from lifecycle event payloads. Existing deployments must review and reapply generated RLS SQL; see [Migration](./migration#upgrade-to-0-16).
:::

## Features

- **RLS-based isolation** — PostgreSQL enforces tenant boundaries at the database level
- **AsyncLocalStorage** — Tenant context without Nest `REQUEST`-scoped providers
- **Prisma Client Extensions** — Transaction-local `set_config()` for tenant-scoped model operations; raw SQL needs explicit transaction handling
- **5 built-in extractors** — Header, Subdomain, JWT Claim, Path, Composite (fallback chain)
- **Lifecycle hooks** — `onTenantResolved` / `onTenantNotFound` for logging, auditing, custom error handling
- **Auto-inject tenant ID** — Optionally inject `tenant_id` into `create` / `createMany` / `upsert` operations
- **Shared models** — Exempt selected models from extension checks, context setup, and injection; database RLS still applies
- **`withoutTenant()`** — Clear tenant context and skip extension checks within a callback; database RLS still applies
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
- **Bound setting parameters** — Extension-owned `set_config()` calls use bind parameters; application SQL requires its own parameterization
- **NestJS 10 & 11** compatible, with **first-class Prisma 7** support and verified Prisma 6/PgBouncer compatibility lanes

## Performance

Use the [benchmark procedure](./benchmark) to compare the extension with a manual RLS transaction under the same role, policies, and row count. No timing guarantee is made; retain each run’s environment and raw samples when evaluating cost.

## Prerequisites

- Node.js `^22.13.0 || ^24.0.0` for tenancy 0.16
- NestJS 10 or 11
- Prisma 7 (recommended) or Prisma 6
- PostgreSQL (with RLS support)

See the shared [Prisma 7 setup guide](/guide/prisma-7) for generated-client and driver-adapter configuration.

Start with [Installation](./installation). For automated coding tools, use the [version-scoped agent guide](./agent-guide).
