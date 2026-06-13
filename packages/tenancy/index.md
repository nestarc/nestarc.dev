---
description: "PostgreSQL Row Level Security multi-tenancy for NestJS and Prisma — automatic tenant isolation with one line of code."
---

# @nestarc/tenancy

Multi-tenancy module for NestJS with **PostgreSQL Row Level Security (RLS)** and **Prisma** support.

One line of code. Automatic tenant isolation.

::: tip
Full API details are in the sub-pages.
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
- **`tenancyTransaction()`** — interactive transaction support with RLS
- **Fail-Closed mode** — `failClosed: true` blocks model queries without tenant context, preventing accidental data exposure
- **Testing utilities** — `TestTenancyModule`, `withTenant()`, `expectTenantIsolation()` via `@nestarc/tenancy/testing`
- **Event system** — optional `@nestjs/event-emitter` integration for `tenant.resolved`, `tenant.not_found`, etc.
- **Microservice propagation** — HTTP (`propagateTenantHeaders()`), Bull, Kafka, gRPC propagators with zero transport dependencies
- **Inbound context restoration** — `TenantContextInterceptor` auto-restores tenant context from incoming microservice messages
- **Tenant-aware caching** — `TenantCacheInterceptor` scopes Nest response cache keys by tenant, with explicit shared-cache opt-in
- **Error hierarchy** — `TenantContextMissingError` base class enables unified `instanceof` catch handling
- **CLI scaffolding** — `npx @nestarc/tenancy init` generates RLS policies and module config
- **CLI drift detection** — `npx @nestarc/tenancy check` validates SQL against Prisma schema
- **Multi-schema support** — `@@schema()` directives generate schema-qualified SQL (e.g., `"auth"."users"`)
- **ccTLD-aware subdomain extraction** — accurate parsing for `.co.uk`, `.co.jp`, `.com.au`, etc.
- **SQL injection safe** — `set_config()` with bind parameters, plus UUID validation by default
- **NestJS 10 & 11** compatible, **Prisma 5 & 6** compatible (CI-tested with Prisma 6; Prisma 5 unit-tested)

## Performance

Measured with PostgreSQL 16.13, Prisma Client 6.19.2, 1005 rows, 500 measured iterations on Apple M1 Pro:

| Scenario | Rows | Avg | P50 | P95 | P99 |
|----------|------|-----|-----|-----|-----|
| Admin direct `findMany` (all rows, no RLS) | 1005 | 3.983ms | 3.369ms | 5.444ms | 6.992ms |
| Admin tenant-filtered `findMany` (`WHERE tenant_id`, no RLS) | 402 | 2.747ms | 2.736ms | 3.612ms | 4.686ms |
| `app_user` manual RLS transaction (`set_config` + `findMany`) | 402 | 2.846ms | 2.614ms | 4.154ms | 5.177ms |
| `app_user` tenancy extension `findMany` | 402 | 2.961ms | 2.766ms | 4.281ms | 4.800ms |
| `app_user` tenancy extension `findFirst` | 1 | 1.217ms | 1.192ms | 1.522ms | 1.777ms |

The headline overhead is extension `findMany` compared with the manual RLS transaction: **+0.115ms avg (+4.0%)**, **+0.127ms p95**.

> Reproduce: `docker compose up -d --wait && npm run bench`

## Prerequisites

- Node.js >= 18
- NestJS 10 or 11
- Prisma 5 or 6
- PostgreSQL (with RLS support)
