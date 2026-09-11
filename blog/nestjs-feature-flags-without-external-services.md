---
title: "NestJS Feature Flags Without External Services"
date: 2026-04-09
description: Implement database-backed NestJS feature flags with PostgreSQL, attribute overrides, and percentage rollouts without an external feature-flag service.
author: nestarc
reviewed: 2026-09-10
versionScope: "@nestarc/feature-flag 0.5.0, NestJS 10/11, and Prisma 7"
---

# NestJS Feature Flags Without External Services

You want to gate a new feature behind a flag. A managed service, a self-hosted flag service, and an environment-variable check have different operational costs. If your application already uses PostgreSQL, storing flags alongside its data is another option.

What if your PostgreSQL database — the one you already have — could be your feature flag store?

## The Problem with Environment Variables

```typescript
// The simplest approach — but painful in practice
@Get('analytics')
async analytics() {
  if (process.env.ENABLE_ANALYTICS !== 'true') {
    throw new ForbiddenException();
  }
  return this.analyticsService.getDashboard();
}
```

This works until you need:
- **Per-tenant flags** — Tenant A gets the feature, Tenant B doesn't
- **Gradual rollout** — Enable for 10% of users, then 50%, then 100%
- **Runtime changes** — Change flag state without redeploying, subject to evaluation precedence and cache propagation
- **User overrides** — QA team needs access before launch

A database-backed package supplies these mechanics while leaving your application responsible for authentication, flag operations, and monitoring.

## Database-Backed Flags

The approach: store flags in PostgreSQL, evaluate them at request time, cache aggressively.

This abbreviated schema illustrates the storage shape. Use [the complete installation schema](/packages/feature-flag/installation) for required timestamps, metadata, indexes, and constraints.

```sql
-- Conceptual excerpt, not a complete migration
CREATE TABLE feature_flags (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT UNIQUE NOT NULL,
  enabled     BOOLEAN DEFAULT false,
  percentage  INT DEFAULT 0,
  archived_at TIMESTAMPTZ
);

CREATE TABLE feature_flag_overrides (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_id     UUID REFERENCES feature_flags(id) ON DELETE CASCADE,
  attributes  JSONB NOT NULL,
  enabled     BOOLEAN NOT NULL,
  priority    INT NOT NULL DEFAULT 0
);
```

Version 0.5 uses attribute-based overrides rather than fixed tenant, user, and environment columns. Top-level evaluation context values are merged into the attribute set. The evaluation priority chain has four layers:

1. Archived? → always false
2. Best matching attribute override → specificity, priority, creation time, then ID
3. Percentage rollout? → deterministic hash
4. Global default → `enabled` field

## The Decorator Pattern

Instead of `if/else` in every controller, a decorator-based guard:

```typescript
@Get('analytics')
@FeatureFlag('PREMIUM_ANALYTICS')
async analytics() {
  // Only executes if flag is enabled for the current context
  return this.analyticsService.getDashboard();
}
```

The guard resolves the configured evaluation context, evaluates the four-layer cascade, and returns `403` if the flag is off.

The global `enabled` field is a fallback after overrides and percentage evaluation. Turning it off does not stop a matching enabling override or an active percentage rollout. See [rollout semantics](/packages/feature-flag/rollout).

## Historical cache measurements

Without caching, every `@FeatureFlag()` check hits the database. With a 30-second TTL in-memory cache:

| Scenario | Latency |
|----------|---------|
| Cache hit | **0.04ms** |
| Cache miss (DB lookup) | 1.17ms |

The earlier report described a **29.2x speedup** for that local workload. These historical measurements used Apple Silicon, PostgreSQL 16, Prisma 7.9.1, and local Docker; they were not rerun for the documentation correction or unreleased fixes. See [the benchmark methodology and corrected bulk count](/packages/feature-flag/benchmark).

## Using @nestarc/feature-flag

This is exactly what [`@nestarc/feature-flag`](https://nestarc.dev/packages/feature-flag/) implements:

```bash
npm install @nestarc/feature-flag@0.5.0
```

```typescript
// app.module.ts
FeatureFlagModule.forRoot({
  environment: 'production',
  prisma,
  cacheTtlMs: 30_000,
  // Use your authenticated principal in production.
  userIdExtractor: (req) => {
    const header = req.headers['x-user-id'];
    return Array.isArray(header) ? header[0] ?? null : header ?? null;
  },
}),
```

This registration fragment assumes an existing Prisma client with the feature-flag models. Follow [Installation and first evaluation](/packages/feature-flag/installation) for peer dependencies, migrations, DI wiring, and an expected HTTP result. Events additionally require `EventEmitterModule.forRoot()`.

[Documentation](https://nestarc.dev/packages/feature-flag/) · [GitHub](https://github.com/nestarc/nestjs-feature-flag) · [Benchmark](https://nestarc.dev/packages/feature-flag/benchmark)


## Published version limits

In npm 0.5.0, supply a stable `userId` or `tenantId` for percentage rollouts; an explicit `targetingKey` is dropped by the service path. Typed-client registry bucketing and bulk registry bucketing also have known inconsistencies. Fixes and direct custom-backend registration options are unreleased. See [the agent guide's version boundary](/packages/feature-flag/agent-guide#version-boundary) before copying current repository examples.

The package avoids an external feature-flag service, but it still requires its NestJS/Prisma peers and a database. The default 30-second TTL is a starting point. Redis invalidation is best-effort and does not make toggles instantaneous across replicas.
