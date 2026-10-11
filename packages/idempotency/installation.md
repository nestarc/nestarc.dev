---
description: "Install @nestarc/idempotency 1.0 on Node 22/24 and NestJS 10/11 with public adapter imports, authenticated scoping, and correct response serializer ordering."
---

# Installation

This guide targets **1.0.0**. Existing 0.4 deployments must follow [Migration to 1.0](/packages/idempotency/migration) before changing serving instances or storage.

## 1. Install

Use Node.js **22 or 24**, NestJS **10 or 11**, and the matching Nest Express/Fastify adapter. TypeScript **5.7.3** is the validated consumer baseline. The package ships CommonJS; validated consumers use `node`, `node16`, or `nodenext` resolution with CommonJS package type, `strict: true`, and `skipLibCheck: false`.

```bash
npm install '@nestarc/idempotency@^1.0.0'

# Only if using Redis:
npm install 'ioredis@^5'

# Only if using Postgres:
npm install 'pg@^8.11'
npm install --save-dev '@types/pg@^8.11'
```

Memory needs no database driver or database type package. Keep the usual Nest peers: `@nestjs/common`, `@nestjs/core`, `reflect-metadata`, and `rxjs`.

| Import path | Public API |
| --- | --- |
| `@nestarc/idempotency` | Module, decorator, interceptor, MemoryStorage, injection tokens, and common types. |
| `@nestarc/idempotency/redis` | `RedisStorage`, `RedisStorageOptions`. |
| `@nestarc/idempotency/postgres` | `PostgresStorage`, `PostgresStorageOptions`, `PostgresSweepService`, `SweepOptions`. |
| `@nestarc/idempotency/sql/init.sql` | Exported SQL schema asset. |

Internal `dist/*` and storage-barrel paths are not public exports. Redis and Postgres classes are no longer root exports.

## 2. Run a local example

```typescript
// app.module.ts
import { Body, Controller, Module, Post, UseInterceptors } from '@nestjs/common';
import {
  Idempotent,
  IdempotencyInterceptor,
  IdempotencyModule,
  MemoryStorage,
} from '@nestarc/idempotency';

@Controller('payments')
@UseInterceptors(IdempotencyInterceptor)
class PaymentsController {
  @Post()
  @Idempotent()
  createPayment(@Body() dto: { commandId: string; amount: number }) {
    // Local replay demo only. No money is moved.
    return { commandId: dto.commandId, amount: dto.amount, accepted: true };
  }
}

@Module({
  imports: [
    IdempotencyModule.forRoot({ storage: new MemoryStorage(), ttl: 86400 }),
  ],
  controllers: [PaymentsController],
})
export class AppModule {}
```

```typescript
// main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(3000);
}
void bootstrap();
```

Send the request twice. The second response has `Idempotency-Status: replayed` and `Idempotency-Replayed: true`:

```bash
curl -i http://localhost:3000/payments \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: demo-command-1' \
  -d '{"commandId":"demo-command-1","amount":100}'
```

Only decorated handlers are processed. `IdempotencyModule` does **not** register the interceptor automatically. `@UseInterceptors(IdempotencyInterceptor)` can also be placed on a method. For application-wide registration, remove the controller decorator and add `{ provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor }` to module providers, importing `APP_INTERCEPTOR` from `@nestjs/core`.

## 3. Use shared storage

### RedisStorage

```typescript
import { Module } from '@nestjs/common';
import { IdempotencyModule } from '@nestarc/idempotency';
import { RedisStorage } from '@nestarc/idempotency/redis';

@Module({
  imports: [
    IdempotencyModule.forRootAsync({
      useFactory: async () => ({
        storage: new RedisStorage({
          connection: {
            host: process.env.REDIS_HOST ?? '127.0.0.1',
            port: Number(process.env.REDIS_PORT ?? 6379),
          },
        }),
        ttl: 86400,
        processingTtl: 120,
      }),
    }),
  ],
})
export class AppModule {}
```

`connection` makes the adapter own and close the client on Nest shutdown. If you pass an existing ioredis `client`, its application owner must call `client.quit()` after all users have closed. Use the default `import Redis from 'ioredis'` when constructing a client to support the validated ioredis 5.0 lower bound.

For dependency injection, set `imports` to the modules exporting your providers and `inject` to their tokens. Async registration supports `useFactory`, `useClass`, or `useExisting`; choose one. Class factories implement `IdempotencyOptionsFactory`.

### PostgresStorage

```typescript
import { Module } from '@nestjs/common';
import { IdempotencyModule } from '@nestarc/idempotency';
import { PostgresStorage } from '@nestarc/idempotency/postgres';

@Module({
  imports: [
    IdempotencyModule.forRoot({
      storage: new PostgresStorage({
        connection: { connectionString: process.env.DATABASE_URL },
      }),
      ttl: 86400,
      processingTtl: 120,
    }),
  ],
})
export class AppModule {}
```

Create the table before starting the application. For the default table, apply the exported schema through migration tooling:

```bash
psql "$DATABASE_URL" -f "$(node -p "require.resolve('@nestarc/idempotency/sql/init.sql')")"
```

For a custom `tableName`, use a matching migration or `PostgresStorage.createSchema(pool, tableName)`. `autoCreateSchema: true` is available for development. An externally supplied `pool` remains application-owned and must be closed with `pool.end()`; `connection` makes the adapter own it. See [Storage Adapters](/packages/idempotency/storage).

`app.close()` runs lifecycle hooks; `enableShutdownHooks()` connects process signals to that lifecycle. Register each storage instance once and arrange cleanup for externally owned resources, including startup failures.

## 4. Order authentication and serialization

Guards must authenticate and authorize each request **before** idempotency, including replay. A replay skips the handler, so authentication or webhook signature checks performed only inside the handler are insufficient.

Put idempotency **before** every response-transforming interceptor. Nest unwinds the response chain in reverse order, allowing idempotency to capture the final transformed plain JSON and avoid applying transformations again on replay.

```typescript
// Placement fragment inside a controller:
@UseInterceptors(IdempotencyInterceptor, ClassSerializerInterceptor)
@Idempotent()
@Post()
createPayment() { /* return a DTO or a Promise of one */ }
```

Import `ClassSerializerInterceptor` and `UseInterceptors` from `@nestjs/common`. For global interceptors, list the `APP_INTERCEPTOR` provider for idempotency before the serializer provider. A global serializer outside controller-scoped idempotency is the wrong order. Adapter-specific response schemas or serializers that change the body afterward are outside the replay contract.

## Module options

| Option | Default | Contract |
| --- | --- | --- |
| `storage` | required | `IdempotencyStorage` instance. |
| `ttl` | `86400` | Completed replay TTL, integer seconds from 1 through 2,147,483,647. |
| `processingTtl` | same as `ttl` | In-flight lease, with the same integer range. |
| `headerName` | `'Idempotency-Key'` | Header containing one raw opaque key. |
| `keyResolver` | header lookup | Sync/async resolver returning a string or `undefined`; replaces header lookup. |
| `maxKeyLength` | `255` | Maximum UTF-8 bytes; must be a positive safe integer. |
| `fingerprint` | `true` | Stable body SHA-256, `false`, or a semantic resolver. |
| `scope` | `'endpoint'` | `'endpoint'`, `'global'`, or synchronous identity function. |
| `replayHeaders` | `true` | Default header allowlist, explicit `string[]`, or `false`. |
| `observability` | status headers on | `{ onEvent?, exposeStatusHeaders? }`. |
| `isGlobal` | `true` | Whether the module is globally available in Nest. |

The decorator accepts `required` (default `true`) and per-handler `ttl`, `processingTtl`, `keyResolver`, `maxKeyLength`, and `fingerprint` overrides. With `required: false`, only a missing key bypasses processing; invalid keys still return `400`. Invalid TTL/max-length/scope configuration is a server error, normally `500`, before storage or handler execution.

## Scope

Every mode uses a versioned hash of a tuple, preserving component boundaries. `'endpoint'` includes method and actual path, including path parameter values; it does not infer tenant/user identity. `'global'` shares keys across all callers and endpoints using the store and is suitable only when every caller may share every replayed response.

A custom function returns a nonblank string or nonempty `readonly string[]` of nonblank components. In 1.0 it **adds identity to the endpoint**:

```typescript
IdempotencyModule.forRoot({
  storage: new MemoryStorage(),
  scope: (ctx) => {
    const req = ctx.switchToHttp().getRequest<{
      user: { tenantId: string; id: string };
    }>();
    // A guard has authenticated the user and authorized this resource.
    return [req.user.tenantId, req.user.id];
  },
});
```

Use verified identities, not an untrusted tenant header. Actual duplicate/trailing slashes and percent encoding remain distinct. Query strings are excluded; when selected query values affect the operation, include them in a stable-order scope array or fingerprint. A fingerprint rejects changed parameters with `422`; it does not provide authorization.

## Keys, fingerprints, and leases

The header is one raw string: `K` and `"K"` are different keys. Repeated headers, arrays, comma-joined headers, blank strings, control characters, unpaired surrogates, and oversized keys return `400`. Proxies must preserve or reject duplicate headers instead of silently dropping them. Keys are not trimmed, case-folded, or Unicode-normalized by the package.

A `keyResolver` replaces header lookup entirely; it allows commas but otherwise follows the string rules. Only `undefined` means missing. For verified webhooks, resolve the provider event ID **after a guard verifies the original raw request bytes**. Keep an inbox and business deduplication separate from the HTTP cache.

Custom fingerprints receive `{ context, key, scope, body, defaultFingerprint }`; `key` is raw, while `scope` is the encoded storage address. Return a deterministic semantic fingerprint that includes all mutation-relevant fields. The default is stable JSON SHA-256 over `body ?? null`, with recursive object-key sorting and preserved array order.

A lease must cover the processing window you intend to protect, including dependency delays. A p99 is not a maximum: there is no heartbeat, and a request can outlive any finite `processingTtl`. All adapters accept long TTLs, including 30 days. Retain a durable business command identity beyond the actual redelivery window, irrespective of cache TTL.

## Headers and observability

`replayHeaders: true` captures `Content-Type`, `Location`, `ETag`, `Cache-Control`, and custom `X-*` headers. Use an explicit list such as `['location', 'x-request-id']` or disable with `false`. The denylist always excludes cookies, hop-by-hop headers, and the package's own status headers. `Authorization` is not in the default allowlist; do not add credential headers to a replay allowlist.

```typescript
import { IdempotencyModule, MemoryStorage, type IdempotencyOutcome } from '@nestarc/idempotency';

const counts = new Map<IdempotencyOutcome, number>();
IdempotencyModule.forRoot({
  storage: new MemoryStorage(),
  observability: {
    onEvent: (event) => {
      counts.set(event.outcome, (counts.get(event.outcome) ?? 0) + 1);
    },
  },
});
```

Events contain `outcome`, hashed `namespace`, `keyHash`, optional `statusCode`, and a fixed error classification. Hashes are neither anonymous nor suitable metric labels. The callback is best effort and unawaited; do not use it for business writes. See [failure behavior and outcomes](/packages/idempotency/how-it-works#failure-and-recovery).

Status headers are enabled while the response remains writable. `Idempotency-Status` reports `created`, `replayed`, `conflict`, `mismatch`, `bypassed`, `stale`, or `complete_error`; replay also sets `Idempotency-Replayed: true`. `storage_error` is event-only and assigns no status header. Set `observability: { exposeStatusHeaders: false }` to disable package-generated headers. They are generated for the current request and never loaded from cached copies.

The [version-pinned executable consumers](https://github.com/nestarc/idempotency/blob/v1.0.0/test/consumers/README.md) demonstrate strict public imports, module wiring, initialization/shutdown, and real HTTP replay.
