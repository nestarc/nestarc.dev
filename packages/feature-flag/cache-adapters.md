---
description: "Pluggable cache adapters for @nestarc/feature-flag — MemoryCacheAdapter (default) and RedisCacheAdapter with Pub/Sub cross-instance invalidation."
---

# Cache Adapters

<Badge type="info" text="v0.2.0" />

Flag records and their overrides are cached to avoid a database query on every evaluation. The evaluator still computes a result for each supplied context. This page describes published 0.5.0 and its `CacheAdapter` interface.

## Built-in Adapters

| Adapter | Backend | Cross-instance invalidation | Default |
|---------|---------|----------------------------|---------|
| `MemoryCacheAdapter` | In-process `Map` | No | Yes |
| `RedisCacheAdapter` | Redis + Pub/Sub | Yes | No |

## MemoryCacheAdapter

The default adapter. Stores flags in an in-memory `Map` with TTL-based expiration. No configuration required.

```typescript
import { FeatureFlagModule } from '@nestarc/feature-flag';

@Module({
  imports: [
    FeatureFlagModule.forRoot({
      environment: 'production',
      prisma,
      // MemoryCacheAdapter is used by default — no need to specify
      cacheTtlMs: 30_000,
    }),
  ],
})
export class AppModule {}
```

**When to use:** Single-instance deployments, development, or when cache consistency across instances is not required.

## RedisCacheAdapter

Uses Redis for shared cache storage and Pub/Sub to notify other instances about invalidation. Mutation invalidation is best-effort: a Redis failure does not undo a successful database write, and missed invalidation or concurrent reads can leave stale data until TTL expiry. Pub/Sub reduces propagation delay; it does not guarantee an immediate, globally consistent switch.

### Install ioredis

```bash
npm install ioredis
```

### Setup

```typescript
import { FeatureFlagModule } from '@nestarc/feature-flag';
import { RedisCacheAdapter } from '@nestarc/feature-flag';
import Redis from 'ioredis';

const redisClient = new Redis({ host: 'localhost', port: 6379 });

@Module({
  imports: [
    FeatureFlagModule.forRoot({
      environment: 'production',
      prisma,
      cacheAdapter: new RedisCacheAdapter({
        client: redisClient,
      }),
    }),
  ],
})
export class AppModule {}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `client` | `Redis` | *required* | ioredis client instance |
| `subscriber` | `Redis` | `client.duplicate()` | Separate client for Pub/Sub subscription |
| `keyPrefix` | `string` | `'feature-flag:'` | Redis key prefix for cached entries |
| `channel` | `string` | `'feature-flag:invalidate'` | Pub/Sub channel for invalidation messages |

### How It Works

```
Instance A updates flag "NEW_FEATURE"
  ├─ writes to database
  ├─ invalidates local cache
  └─ publishes to Redis channel "feature-flag:invalidate"
       ├─ Instance B receives → invalidates cache
       └─ Instance C receives → invalidates cache
```

The subscriber client is auto-created via `client.duplicate()` if not provided. This is required because Redis clients in subscribe mode cannot execute other commands.

### With forRootAsync

```typescript
@Module({
  imports: [
    FeatureFlagModule.forRootAsync({
      imports: [ConfigModule, PrismaModule],
      inject: [ConfigService, PrismaService],
      useFactory: (config: ConfigService, prisma: PrismaService) => ({
        environment: config.get<string>('NODE_ENV') ?? 'production',
        prisma,
        cacheAdapter: new RedisCacheAdapter({
          client: new Redis(config.getOrThrow<string>('REDIS_URL')),
        }),
      }),
    }),
  ],
})
export class AppModule {}
```

## Custom Adapter

Implement the exported `CacheAdapter` interface to use another backend. This contract excerpt lists the required methods; supply a complete implementation before registration:

```typescript
import type { CacheAdapter, FeatureFlagWithOverrides } from '@nestarc/feature-flag';

interface CustomCacheContract extends CacheAdapter {
  get(key: string): Promise<FeatureFlagWithOverrides | null>;
  set(key: string, data: FeatureFlagWithOverrides, ttlMs: number): Promise<void>;
  getAll(): Promise<FeatureFlagWithOverrides[] | null>;
  setAll(data: FeatureFlagWithOverrides[], ttlMs: number): Promise<void>;
  invalidate(key?: string): Promise<void>;
}
```

Register an instance of your completed `CustomCacheAdapter`:

```typescript
FeatureFlagModule.forRoot({
  environment: 'production',
  prisma,
  cacheAdapter: new CustomCacheAdapter(),
})
```

## Cache Behavior

- Cache TTL defaults to **30 seconds** (`cacheTtlMs: 30_000`)
- `cacheTtlMs: 0` skips writes to the built-in caches. Existing shared Redis entries can still be read; clear them or use an isolated empty namespace if you need an uncached process.
- Cache invalidation on flag mutations is **best-effort** (non-fatal) — stale entries self-heal via TTL
- TTL is an application trade-off, not an established optimum. Use an empty or isolated cache with `cacheTtlMs: 0` when repeated database reads are acceptable; database failures still follow the evaluation fallback rules.
- Service mutations already attempt invalidation. Direct database writes need explicit `await flags.invalidateCache()` or TTL expiry.
- A custom adapter must expire entries and invalidate the bulk list as well as affected per-key entries. Await all cache operations.

Use the same Redis key prefix/channel only for instances sharing flag data. The adapter closes an internally duplicated subscriber during module destruction; the application owns its supplied Redis client and any supplied subscriber. Configure application shutdown cleanup for those connections. Explicit `await flags.invalidateCache()` propagates cache errors, unlike mutation-path best-effort invalidation.
