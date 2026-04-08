---
title: "NestJS Feature Flags Without External Services"
date: 2026-04-09
description: Implement database-backed feature flags in NestJS with tenant overrides and percentage rollouts — no LaunchDarkly, no Unleash, no external dependency.
author: nestarc
---

# NestJS Feature Flags Without External Services

You want to gate a new feature behind a flag. The usual options: LaunchDarkly ($$$), Unleash (self-hosted complexity), or a homegrown `if (process.env.ENABLE_FEATURE)` that requires a redeploy to change.

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
- **Instant toggle** — Turn off a broken feature without redeploying
- **User overrides** — QA team needs access before launch

Each requirement pushes you toward either paying for a SaaS flag service or building your own flag system.

## Database-Backed Flags

The approach: store flags in PostgreSQL, evaluate them at request time, cache aggressively.

```sql
-- Two tables: flags and overrides
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
  tenant_id   TEXT,
  user_id     TEXT,
  environment TEXT,
  enabled     BOOLEAN NOT NULL
);
```

The evaluation priority chain (6 layers):
1. Archived? → always false
2. User override? → most specific wins
3. Tenant override? → tenant-level control
4. Environment override? → staging vs production
5. Percentage rollout? → deterministic hash
6. Global default → `enabled` field

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

The guard automatically resolves the tenant and user from the request, evaluates the 6-layer cascade, and returns `403` if the flag is off.

## Performance: Cache Is Everything

Without caching, every `@FeatureFlag()` check hits the database. With a 30-second TTL in-memory cache:

| Scenario | Latency |
|----------|---------|
| Cache hit | **0.04ms** |
| Cache miss (DB lookup) | 1.30ms |

That's a **32x speedup**. The flag evaluation itself (hash + cascade lookup) is sub-microsecond — the cost is entirely in the DB round-trip.

## Using @nestarc/feature-flag

This is exactly what [`@nestarc/feature-flag`](https://nestarc.dev/packages/feature-flag/) implements:

```bash
npm install @nestarc/feature-flag
```

```typescript
// app.module.ts
FeatureFlagModule.forRoot({
  environment: 'production',
  prisma,
  cacheTtlMs: 30_000,
  userIdExtractor: (req) => req.headers['x-user-id'],
}),
```

Includes the Prisma schema, evaluation engine, NestJS guard, cache layer, and event system — all in one package.

[Documentation](https://nestarc.dev/packages/feature-flag/) · [GitHub](https://github.com/nestarc/nestjs-feature-flag) · [Benchmark](https://nestarc.dev/packages/feature-flag/benchmark)
