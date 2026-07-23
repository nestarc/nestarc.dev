---
description: "Storage adapters for @nestarc/idempotency: MemoryStorage, RedisStorage, PostgresStorage, token-based CAS, and custom adapter contracts."
---

# Storage Adapters

Idempotency only works across production replicas when every instance shares the same storage backend. Use `MemoryStorage` for local development and tests. Use `RedisStorage` or `PostgresStorage` for deployed applications.

## Adapter comparison

| Feature | MemoryStorage | RedisStorage | PostgresStorage |
|---------|---------------|--------------|-----------------|
| Scope | Single process | Shared across replicas | Shared across replicas |
| Persistence | Lost on restart | Redis durability | Postgres durability |
| TTL mechanism | `setTimeout` | Redis `EXPIRE` | Lazy expiration on `get()` plus optional sweep |
| Atomic create | In-process lock | Lua script with NX semantics | `INSERT ... ON CONFLICT` with expiration check |
| Token CAS | Yes | Lua script | `WHERE token = $2` |
| Header replay storage | In memory | Redis hash payload | `response_headers JSONB` |
| Cluster-safe | No | Yes | Yes |
| Production-ready | No | Yes | Yes |
| Required peer | none | `ioredis ^5` | `pg ^8.11` |

## MemoryStorage

`MemoryStorage` is backed by a `Map` and per-record timers.

```typescript
import { IdempotencyModule, MemoryStorage } from '@nestarc/idempotency';

@Module({
  imports: [
    IdempotencyModule.forRoot({
      storage: new MemoryStorage(),
      ttl: 86400,
    }),
  ],
})
export class AppModule {}
```

::: warning
Do not use `MemoryStorage` in production. State is lost on restart and is not shared across processes, so two replicas can both accept the same idempotency key and run the handler twice.
:::

## RedisStorage

`RedisStorage` stores each record as a Redis hash under a prefixed key. Mutations run through Lua scripts so create, complete, and delete decisions are atomic on the Redis server.

```typescript
import { IdempotencyModule, RedisStorage } from '@nestarc/idempotency';
import { Redis } from 'ioredis';

const client = new Redis({ host: 'localhost', port: 6379 });

@Module({
  imports: [
    IdempotencyModule.forRoot({
      storage: new RedisStorage({ client }),
      ttl: 86400,
      processingTtl: 120,
    }),
  ],
})
export class AppModule {}
```

### RedisStorage options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `client` | `Redis` | none | Pre-built ioredis client. If supplied, your app owns its lifecycle. |
| `connection` | `RedisOptions` | none | Connection options used to lazily create an internal client. |
| `clientFactory` | `(connection) => Redis` | internal `new Redis(...)` | Test seam for custom construction. |
| `keyPrefix` | `string` | `'idempotency:'` | Prefix for every Redis key. |

If `connection` is used, `RedisStorage` owns the client and closes it in `onModuleDestroy()`. If `client` is used, it does not close the caller-owned client.

### Redis guarantees

| Script | Operation | Guarantee |
|--------|-----------|-----------|
| `idemCreate` | Create `PROCESSING` record | Exactly one concurrent caller acquires the key. |
| `idemComplete` | Transition to `COMPLETED` | Only the caller with the matching token can write the response. |
| `idemDelete` | Cleanup failed or bypassed records | Deletes only the matching token, or treats missing records as already cleaned up. |

The source CI includes a real Redis smoke job with `redis:7-alpine` and runs the shared storage contract through `TEST_REDIS_URL`.

## PostgresStorage

`PostgresStorage` is useful when your stack already has Postgres and you do not want Redis only for idempotency. It uses the same storage contract as Redis:

- atomic create via a primary key and `INSERT ... ON CONFLICT DO UPDATE WHERE expires_at < now()`;
- token-based compare-and-set via `WHERE token = $2`;
- lazy expiration through `WHERE expires_at > now()` in `get()`;
- optional active cleanup through `PostgresSweepService` or your own scheduler.

```typescript
import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { IdempotencyModule, PostgresStorage } from '@nestarc/idempotency';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

@Module({
  imports: [
    IdempotencyModule.forRoot({
      storage: new PostgresStorage({ pool }),
      ttl: 86400,
      processingTtl: 120,
    }),
  ],
})
export class AppModule {}
```

### PostgresStorage options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pool` | `Pool` | none | Pre-built `pg` pool. If supplied, your app owns its lifecycle. |
| `connection` | `PoolConfig` | none | Config used to lazily create an internal pool. |
| `poolFactory` | `(connection) => Pool` | internal `new Pool(...)` | Test seam for custom construction. |
| `tableName` | `string` | `'idempotency_records'` | Table used for idempotency records. Must be a single safe identifier. |
| `autoCreateSchema` | `boolean` | `false` | Run schema creation during module init. Use for development only. |

### Schema

Production deployments should run the bundled SQL through normal migration tooling:

```bash
psql "$DATABASE_URL" -f node_modules/@nestarc/idempotency/sql/init.sql
```

The table includes response header replay support:

```sql
CREATE TABLE IF NOT EXISTS idempotency_records (
  key              TEXT        PRIMARY KEY,
  token            UUID        NOT NULL,
  fingerprint      TEXT,
  status           TEXT        NOT NULL CHECK (status IN ('PROCESSING', 'COMPLETED')),
  response_code    INT,
  response_body    TEXT,
  response_headers JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at       TIMESTAMPTZ NOT NULL
);
```

Existing v0.2.x Postgres users need this one-time migration before relying on header replay:

```sql
ALTER TABLE idempotency_records
  ADD COLUMN IF NOT EXISTS response_headers JSONB;
```

### Optional sweep service

Lazy expiration on `get()` is enough for correctness. The sweep service is for disk hygiene in long-running systems.

```typescript
import {
  IDEMPOTENCY_SWEEP_OPTIONS,
  IdempotencyModule,
  PostgresStorage,
  PostgresSweepService,
} from '@nestarc/idempotency';

@Module({
  imports: [
    IdempotencyModule.forRoot({
      storage: new PostgresStorage({ pool }),
    }),
  ],
  providers: [
    PostgresSweepService,
    {
      provide: IDEMPOTENCY_SWEEP_OPTIONS,
      useValue: { enabled: true, intervalMs: 60000 },
    },
  ],
})
export class AppModule {}
```

The sweep uses a Postgres advisory lock so only one replica performs cleanup in a cycle.

You can also schedule cleanup externally:

```sql
DELETE FROM idempotency_records
WHERE expires_at < now();
```

## Custom storage adapters

Implement `IdempotencyStorage` when you need another shared backend. The contract is token-based compare-and-set.

```typescript
import type { OnModuleDestroy } from '@nestjs/common';
import type {
  CompleteResponse,
  CreateResult,
  IdempotencyRecord,
  IdempotencyStorage,
  MutateResult,
} from '@nestarc/idempotency';

class MyStorage implements IdempotencyStorage, OnModuleDestroy {
  async get(key: string): Promise<IdempotencyRecord | null> {
    // Return the non-expired record, or null.
  }

  async create(
    key: string,
    fingerprint: string | undefined,
    ttlSeconds: number,
  ): Promise<CreateResult> {
    // Atomic NX semantics.
    // Return { acquired: true, token } for the winner.
    // Return { acquired: false } when a record already exists.
  }

  async complete(
    key: string,
    token: string,
    response: CompleteResponse,
    ttlSeconds: number,
  ): Promise<MutateResult> {
    // Mutate only when the stored token matches.
    // Return 'ok' on success and 'stale' on token mismatch or missing record.
  }

  async delete(key: string, token: string): Promise<MutateResult> {
    // Delete only when the stored token matches.
    // Return 'ok' if removed or already absent.
    // Return 'stale' if a different token owns the key.
  }

  async onModuleDestroy(): Promise<void> {
    // Release owned connections, timers, or handles.
  }
}
```

### Contract guarantees

Custom adapters must preserve these invariants:

1. `create()` is atomic: two concurrent calls for the same key produce exactly one acquired token.
2. `complete()` and `delete()` are token-gated.
3. `createdAt` is immutable for the lifetime of a record.
4. `complete()` refreshes `expiresAt` to the completed replay TTL.
5. `get()` returns `null` for missing or expired records.
6. `delete()` is idempotent for already-absent records.
7. Stored response headers are lowercase string values when present.

The source repository includes `test/support/shared-storage-contract.ts`. Copy it into custom adapter projects and wire it with `describeStorageContract('MyStorage', factory)` to verify behavior before shipping.
