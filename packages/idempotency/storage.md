---
description: "Idempotency 1.0 storage contracts: Redis/Postgres subpath imports, logical expiry, complete-once token ownership, opaque response payloads, and connection lifecycle."
---

# Storage Adapters

Use `MemoryStorage` for local development and tests. Redis and Postgres coordinate application replicas through one shared store. Storage durability follows the backend's configuration; it does not establish atomicity with business operations.

::: warning Existing installations
1.0 changes both storage addresses and replay bodies. Use a separate verified empty namespace and the coordinated [migration procedure](/packages/idempotency/migration); sharing the old store or merely waiting for cache expiry is unsupported.
:::

## Adapter comparison

| Property | MemoryStorage | RedisStorage | PostgresStorage |
| --- | --- | --- | --- |
| Import | Package root | `/redis` | `/postgres` |
| Visibility | One process | Shared Redis | Shared Postgres |
| Expiration | Deadline-aware timers and logical expiry | Redis server TTL | SQL deadline checks; optional physical sweep |
| Atomic acquisition | In-process | Lua script | `INSERT ... ON CONFLICT` with expiry check |
| Completion | Live `PROCESSING` owner once | Same, via CAS and server TTL | Same, via state/token/expiry predicates |
| Extra peers | None | `ioredis ^5` | `pg ^8.11`; TypeScript also `@types/pg ^8.11` |

All three accept integer TTL seconds from **1 through 2,147,483,647**. Memory splits long timer waits, so a 30-day TTL is valid. Redis payload `expiresAt` is client-clock metadata; its server TTL determines whether the lease is live.

[Benchmark](/packages/idempotency/benchmark) explains how to measure first-request and replay round trips against your deployment topology.

## MemoryStorage

```typescript
import { IdempotencyModule, MemoryStorage } from '@nestarc/idempotency';

IdempotencyModule.forRoot({
  storage: new MemoryStorage(),
  ttl: 86400,
});
```

The adapter holds a `Map` and timers. Nest shutdown clears them. Restart loses records; separate processes can each acquire the same key. Durable business deduplication must survive outside the process even for a single-instance deployment.

## RedisStorage

```typescript
import { IdempotencyModule } from '@nestarc/idempotency';
import { RedisStorage } from '@nestarc/idempotency/redis';
import Redis from 'ioredis';

const client = new Redis({ host: '127.0.0.1', port: 6379 });
IdempotencyModule.forRoot({
  storage: new RedisStorage({ client }),
  ttl: 86400,
  processingTtl: 120,
});
```

Each record is a Redis hash. Lua scripts make acquisition, token-owned completion, and deletion atomic. Only an unexpired processing owner can complete; a second completion cannot replace the response or refresh its TTL.

| Option | Default | Meaning |
| --- | --- | --- |
| `client` | none | Existing ioredis client; application owns shutdown. |
| `connection` | none | Options for an adapter-owned client. |
| `clientFactory` | internal constructor | Optional client construction seam. |
| `keyPrefix` | `'idempotency:'` | Physical prefix added to the encoded storage address. |

Pass the chosen client or connection configuration. The application closes an injected `client` with `quit()` after all users stop. With `connection`, the adapter closes its client in `onModuleDestroy()`.

An upgrade needs a **verified unused and isolated** prefix or separate store, not just a new-looking prefix. Legacy global keys were arbitrary and may overlap new addresses. See the [namespace checks in the release runbook](https://github.com/nestarc/idempotency/blob/v1.0.0/docs/migration-1.0.md).

## PostgresStorage

```typescript
import { IdempotencyModule } from '@nestarc/idempotency';
import { PostgresStorage } from '@nestarc/idempotency/postgres';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
IdempotencyModule.forRoot({
  storage: new PostgresStorage({ pool }),
  ttl: 86400,
  processingTtl: 120,
});
```

Create the schema before startup. The application owns an injected pool and ends it with `pool.end()` after all users have stopped. A pool created through `connection` belongs to the adapter and closes on Nest shutdown.

| Option | Default | Meaning |
| --- | --- | --- |
| `pool` | none | Existing `pg` pool; caller owns shutdown. |
| `connection` | none | Configuration for an adapter-owned pool. |
| `poolFactory` | internal constructor | Optional pool construction seam. |
| `tableName` | `'idempotency_records'` | One quoted table identifier, not a `schema.table` expression. |
| `autoCreateSchema` | `false` | Create schema at module initialization; use explicit production migrations. |

Acquisition replaces an expired record atomically. Reads require `expires_at > now()`; completion additionally requires the matching token and `PROCESSING` state. An expired row is logically absent even if physical cleanup has not run.

### Schema

For the default table, apply the exported SQL asset:

```bash
psql "$DATABASE_URL" -f "$(node -p "require.resolve('@nestarc/idempotency/sql/init.sql')")"
```

The schema includes:

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

The exported SQL also creates the expiry index. Use `PostgresStorage.createSchema(pool, tableName)` or matching migration SQL for a custom table. Runtime and migration must use the same table and database search path.

**There are no new SQL columns for 1.0.** The response body remains `TEXT`, containing an opaque versioned string. The upgrade still requires a separate empty table or store. The old pre-0.3 `response_headers JSONB` addition is historical and is covered in [Migration](/packages/idempotency/migration#postgres-schema-history); `CREATE TABLE IF NOT EXISTS` does not alter an existing table.

### Optional sweep service

Logical expiry provides correctness without a sweep. Sweeping bounds disk usage:

```typescript
import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { IdempotencyModule, IDEMPOTENCY_SWEEP_OPTIONS } from '@nestarc/idempotency';
import { PostgresStorage, PostgresSweepService } from '@nestarc/idempotency/postgres';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

@Module({
  imports: [IdempotencyModule.forRoot({ storage: new PostgresStorage({ pool }) })],
  providers: [
    PostgresSweepService,
    { provide: IDEMPOTENCY_SWEEP_OPTIONS, useValue: { enabled: true, intervalMs: 60_000 } },
  ],
})
export class AppModule {}
```

The service injects `IDEMPOTENCY_STORAGE` and uses the exact adapter registered by the module. Register it only with Postgres. A manual provider graph must provide that token too; registering only `PostgresStorage` by class is insufficient.

Each sweep takes a session advisory lock in the same PostgreSQL database. Overlapping service sweeps skip while the lock is held; this is not a permanent leader election and does not coordinate an independent external cleanup job. Its timer stops on Nest close; the external pool remains application-owned.

## Custom storage adapters

Implement the public `IdempotencyStorage` interface. The method signatures remain the same in 1.0, but adapters must satisfy stricter lifecycle behavior:

| Operation | Required contract |
| --- | --- |
| `get(key)` | Return the live record or `null`. Logical expiry applies before physical cleanup. |
| `create(key, fingerprint, ttlSeconds)` | Validate TTL before any access, then atomically acquire an absent/expired key. Return `{ acquired: true, token }` once; otherwise `{ acquired: false }`. |
| `complete(key, token, response, ttlSeconds)` | Validate TTL first. Only the matching live `PROCESSING` owner may complete once. Refresh the completed TTL and preserve `createdAt` on success. |
| `delete(key, token)` | Delete only the owned live record. Return `'ok'` for absent/expired records, `'stale'` for another live owner. Physical removal of an expired row is not required. |

Completion returns `'stale'` for missing, expired, replaced, or already completed records, including another call with the same token. It must leave response, token, `createdAt`, and expiry unchanged. Expiry alone is sufficient; a replacement need not exist.

Both direct `create()` and `complete()` reject invalid TTLs with `RangeError` **before storage access**, even on acquisition/ownership misses. The accepted range is integer seconds 1–2,147,483,647.

`CompleteResponse.body` is an **opaque replay payload**, currently prefixed `@nestarc/idempotency:replay:v1:`. Store and return it byte-for-byte; never parse, stringify, normalize, or infer a business response from it. Preserve lowercase string-valued response headers. Legacy/corrupt completed bodies cannot safely replay; the interceptor returns `409` without re-execution, unless a fingerprint mismatch takes priority with `422`.

Use the version-pinned [storage interface](https://github.com/nestarc/idempotency/blob/v1.0.0/src/interfaces/idempotency-storage.interface.ts) and [shared storage contract suite](https://github.com/nestarc/idempotency/blob/v1.0.0/test/support/shared-storage-contract.ts) to validate an adapter, including concurrent acquisition/completion, expiry boundaries, and invalid TTL ordering. Resource-owning adapters should implement `OnModuleDestroy`.
