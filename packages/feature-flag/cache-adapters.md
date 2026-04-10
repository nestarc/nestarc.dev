---
description: "Pluggable cache adapters for @nestarc/feature-flag — MemoryCacheAdapter (default) and RedisCacheAdapter with Pub/Sub cross-instance invalidation."
---

# Cache Adapters

<Badge type="info" text="v0.2.0" />

Feature flag evaluations are cached to avoid hitting the database on every request. In v0.2.0, caching is handled by pluggable adapters that implement the `CacheAdapter` interface.

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

Uses Redis for shared cache storage and Pub/Sub for real-time cross-instance cache invalidation. When any instance updates a flag, all other instances invalidate their cache immediately.

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
      imports: [ConfigModule],
      inject: [ConfigService, PrismaService],
      useFactory: (config: ConfigService, prisma: PrismaService) => ({
        environment: config.get('NODE_ENV'),
        prisma,
        cacheAdapter: new RedisCacheAdapter({
          client: new Redis(config.get('REDIS_URL')),
        }),
      }),
    }),
  ],
})
export class AppModule {}
```

## Custom Adapter

Implement the `CacheAdapter` interface to use any cache backend:

```typescript
import type { CacheAdapter, FeatureFlagWithOverrides } from '@nestarc/feature-flag';

export class CustomCacheAdapter implements CacheAdapter {
  async get(key: string): Promise<FeatureFlagWithOverrides | null> {
    // retrieve cached flag by key
  }

  async set(key: string, data: FeatureFlagWithOverrides, ttlMs: number): Promise<void> {
    // cache a single flag with TTL
  }

  async getAll(): Promise<FeatureFlagWithOverrides[] | null> {
    // retrieve all cached flags
  }

  async setAll(data: FeatureFlagWithOverrides[], ttlMs: number): Promise<void> {
    // cache entire flag set with TTL
  }

  async invalidate(key?: string): Promise<void> {
    // clear cache — specific key or all entries
  }

  // Optional: called when the NestJS module is destroyed
  async onModuleDestroy?(): Promise<void> {
    // cleanup connections
  }
}
```

Register your custom adapter:

```typescript
FeatureFlagModule.forRoot({
  environment: 'production',
  prisma,
  cacheAdapter: new CustomCacheAdapter(),
})
```

## Cache Behavior

- Cache TTL defaults to **30 seconds** (`cacheTtlMs: 30_000`)
- Set `cacheTtlMs: 0` to disable caching entirely
- Cache invalidation on flag mutations is **best-effort** (non-fatal) — stale entries self-heal via TTL
- All cache operations are async in v0.2.0 (breaking change from v0.1.0's sync `Map`)
