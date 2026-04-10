---
description: "DB-backed feature flags for NestJS + Prisma — tenant-aware overrides, percentage rollouts, zero external dependencies."
---

# @nestarc/feature-flag

DB-backed feature flags for NestJS + Prisma + PostgreSQL -- tenant-aware overrides, percentage rollouts, and zero external dependencies.

## Features

- **Database-backed** -- flags stored in PostgreSQL via Prisma, no external service required
- **Tenant / user / environment overrides** -- granular control per tenant, user, or deployment environment
- **Percentage rollouts** -- deterministic hashing (murmurhash3) for consistent per-user bucketing
- **Guard decorator** -- `@FeatureFlag()` automatically gates routes and controllers
- **Bypass decorator** -- `@BypassFeatureFlag()` exempts health checks and public endpoints
- **Programmatic evaluation** -- `isEnabled()`, `evaluateAll()`, and `findByKey()` for service-layer logic
- **Pluggable cache** -- `CacheAdapter` interface with built-in `MemoryCacheAdapter` (default) and `RedisCacheAdapter` <Badge type="info" text="v0.2.0" />
- **Redis Pub/Sub** -- cross-instance cache invalidation for horizontal scaling <Badge type="info" text="v0.2.0" />
- **Admin REST API** -- opt-in `FeatureFlagAdminModule` with mandatory guard injection <Badge type="info" text="v0.2.0" />
- **Repository pattern** -- `FeatureFlagRepository` interface for custom persistence backends <Badge type="info" text="v0.2.0" />
- **Tenant context provider** -- automatic `@nestarc/tenancy` integration via `TenantContextProvider` <Badge type="info" text="v0.2.0" />
- **Event system** -- optional integration with `@nestjs/event-emitter` for audit and observability
- **Testing utilities** -- drop-in `TestFeatureFlagModule` for unit and integration tests

## Installation

```bash
npm install @nestarc/feature-flag
```

### Peer dependencies

```bash
npm install @nestjs/common @nestjs/core @prisma/client rxjs reflect-metadata
```

### Optional

```bash
# Required only if you enable emitEvents
npm install @nestjs/event-emitter

# Required only if you use RedisCacheAdapter
npm install ioredis
```
