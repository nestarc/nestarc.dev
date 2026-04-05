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
- **Error hierarchy** — `TenantContextMissingError` base class enables unified `instanceof` catch handling
- **CLI scaffolding** — `npx @nestarc/tenancy init` generates RLS policies and module config
- **CLI drift detection** — `npx @nestarc/tenancy check` validates SQL against Prisma schema
- **Multi-schema support** — `@@schema()` directives generate schema-qualified SQL (e.g., `"auth"."users"`)
- **ccTLD-aware subdomain extraction** — accurate parsing for `.co.uk`, `.co.jp`, `.com.au`, etc.
- **SQL injection safe** — `set_config()` with bind parameters, plus UUID validation by default
- **NestJS 10 & 11** compatible, **Prisma 5 & 6** compatible (CI-tested with Prisma 6; Prisma 5 unit-tested)

## Performance

Measured with PostgreSQL 16, Prisma 6, 1005 rows, 500 iterations on Apple Silicon:

| Scenario | Avg | P50 | P95 | P99 |
|----------|-----|-----|-----|-----|
| Direct query (no extension, 1005 rows) | 3.74ms | 3.07ms | 6.13ms | 10.44ms |
| **findMany with extension** (402 rows via RLS) | **2.91ms** | **2.66ms** | **4.59ms** | **6.52ms** |
| **findFirst with extension** (1 row via RLS) | **1.23ms** | **1.20ms** | **1.62ms** | **2.00ms** |

The batch transaction overhead (`set_config` + query) is negligible — RLS reduces the returned row count, which often makes queries faster than unfiltered equivalents.

> Reproduce: `docker compose up -d && npx ts-node benchmarks/rls-overhead.ts`

## Prerequisites

- Node.js >= 18
- NestJS 10 or 11
- Prisma 5 or 6
- PostgreSQL (with RLS support)
