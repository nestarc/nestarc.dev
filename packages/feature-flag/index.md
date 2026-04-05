# @nestarc/feature-flag

DB-backed feature flags for NestJS + Prisma + PostgreSQL -- tenant-aware overrides, percentage rollouts, and zero external dependencies.

## Features

- **Database-backed** -- flags stored in PostgreSQL via Prisma, no external service required
- **Tenant / user / environment overrides** -- granular control per tenant, user, or deployment environment
- **Percentage rollouts** -- deterministic hashing (murmurhash3) for consistent per-user bucketing
- **Guard decorator** -- `@FeatureFlag()` automatically gates routes and controllers
- **Bypass decorator** -- `@BypassFeatureFlag()` exempts health checks and public endpoints
- **Programmatic evaluation** -- `isEnabled()` and `evaluateAll()` for service-layer logic
- **Built-in caching** -- configurable TTL with manual invalidation
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
```
