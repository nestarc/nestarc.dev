---
description: "Storage adapters for @nestarc/idempotency — MemoryStorage for dev/test, RedisStorage for production, and custom adapter interface."
---

# Storage Adapters

## Adapter Comparison

| Feature | MemoryStorage | RedisStorage |
|---------|---------------|--------------|
| Scope | Single process | Shared across replicas |
| Persistence | Lost on restart | Full Redis durability |
| TTL mechanism | `setTimeout` | Redis `EXPIRE` |
| Cluster-safe | ❌ | ✅ |
| Production-ready | ❌ (dev/test only) | ✅ |
| Required peer | none | `ioredis ^5` |

## MemoryStorage

Backed by a `Map` with per-entry `setTimeout` expirations. Suitable for development and testing.

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
**Not safe for production.** State is lost on restart and not shared across processes — two replicas would enforce idempotency independently, letting duplicates slip through.
:::

## RedisStorage

Stores records as Redis Hash structures with Lua scripts for atomic compare-and-set operations.

```typescript
import { IdempotencyModule, RedisStorage } from '@nestarc/idempotency';
import { Redis } from 'ioredis';

@Module({
  imports: [
    IdempotencyModule.forRoot({
      storage: new RedisStorage({
        client: new Redis({ host: 'localhost', port: 6379 }),
      }),
      ttl: 86400,
    }),
  ],
})
export class AppModule {}
```

### RedisStorage Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `client` | `Redis` | — | Pre-built ioredis client (recommended) |
| `connection` | `RedisOptions` | — | ioredis options for lazy client construction |
| `keyPrefix` | `string` | `'idempotency:'` | Prefix for all Redis keys |

If you pass `client`, you own its lifecycle. If you pass `connection`, RedisStorage creates and closes the client via `OnModuleDestroy`.

### Lua Scripts

RedisStorage registers three Lua scripts via `defineCommand`:

| Script | Operation | Guarantee |
|--------|-----------|-----------|
| `idemCreate` | NX-semantics record creation | Exactly one caller acquires the lock |
| `idemComplete` | Token-gated PROCESSING → COMPLETED | Only the lock owner can write the response |
| `idemDelete` | Token-gated cleanup | Failed handlers clean up without clobbering |

## Custom Storage Adapters

Implement the `IdempotencyStorage` interface with token-based compare-and-set semantics:

```typescript
import type {
  IdempotencyStorage,
  IdempotencyRecord,
  CreateResult,
  CompleteResponse,
  MutateResult,
} from '@nestarc/idempotency';
import type { OnModuleDestroy } from '@nestjs/common';

class MyStorage implements IdempotencyStorage, OnModuleDestroy {
  async get(key: string): Promise<IdempotencyRecord | null> {
    // Return the record, or null if expired / not found.
  }

  async create(
    key: string,
    fingerprint: string | undefined,
    ttlSeconds: number,
  ): Promise<CreateResult> {
    // NX semantics: return { acquired: false } if key exists.
    // Otherwise generate a token, persist PROCESSING record,
    // and return { acquired: true, token }.
  }

  async complete(
    key: string,
    token: string,
    response: CompleteResponse,
    ttlSeconds: number,
  ): Promise<MutateResult> {
    // Compare-and-set: only mutate if stored token matches.
    // Return 'ok' on success, 'stale' on token mismatch.
    // Refresh expiresAt but preserve createdAt.
  }

  async delete(key: string, token: string): Promise<MutateResult> {
    // Token-gated cleanup. Return 'ok' if removed or absent,
    // 'stale' if a different record exists under this key.
  }

  async onModuleDestroy(): Promise<void> {
    // Release external resources (connections, timers).
  }
}
```

### Storage Contract Guarantees

1. **Atomic creation** — two concurrent `create()` for the same key must result in exactly one `acquired: true`
2. **Token-based CAS** — `complete()` and `delete()` only mutate records with matching tokens
3. **`createdAt` immutability** — `complete()` must preserve the original `createdAt` timestamp

::: tip
The source repo includes a shared contract test suite at `test/support/shared-storage-contract.ts`. Custom adapters can plug into it via `describeStorageContract('Name', factory)` to verify conformance.
:::
