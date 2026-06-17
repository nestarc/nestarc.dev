---
description: "Install @nestarc/idempotency, configure Redis or Postgres storage, wire the interceptor, and prepare production-safe NestJS idempotency."
---

# Installation

## 1. Install

```bash
npm install @nestarc/idempotency
```

Install the peer dependency for the storage adapter you plan to use:

```bash
# RedisStorage
npm install ioredis

# PostgresStorage
npm install pg
```

## 2. Register the module

Use `MemoryStorage` only for local development and tests:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
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

For production, use shared storage so every application replica sees the same idempotency records.

### RedisStorage

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IdempotencyModule, RedisStorage } from '@nestarc/idempotency';
import { Redis } from 'ioredis';

@Module({
  imports: [
    IdempotencyModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: new RedisStorage({
          client: new Redis({
            host: config.get<string>('REDIS_HOST', 'localhost'),
            port: Number(config.get('REDIS_PORT') ?? 6379),
          }),
        }),
        ttl: Number(config.get('IDEMPOTENCY_TTL') ?? 86400),
        processingTtl: Number(config.get('IDEMPOTENCY_PROCESSING_TTL') ?? 120),
      }),
    }),
  ],
})
export class AppModule {}
```

If you pass `client`, your application owns the Redis lifecycle. If you pass `connection`, `RedisStorage` creates the client and closes it through Nest's `OnModuleDestroy` hook.

### PostgresStorage

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

Create the Postgres schema through your migration tooling:

```bash
psql "$DATABASE_URL" -f node_modules/@nestarc/idempotency/sql/init.sql
```

For tests or scripts you can call the helper:

```typescript
import { PostgresStorage } from '@nestarc/idempotency';

await PostgresStorage.createSchema(pool);
```

`autoCreateSchema: true` exists for development, but production should use an explicit migration.

```typescript
new PostgresStorage({ pool, autoCreateSchema: true });
```

## 3. Wire the interceptor

The module does not auto-register the interceptor. Choose one of these patterns:

```typescript
// 1. App-global: the interceptor is available everywhere.
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { IdempotencyInterceptor } from '@nestarc/idempotency';

@Module({
  providers: [{ provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor }],
})
export class AppModule {}
```

```typescript
// 2. Controller-scoped.
import { Controller, UseInterceptors } from '@nestjs/common';
import { IdempotencyInterceptor } from '@nestarc/idempotency';

@Controller('payments')
@UseInterceptors(IdempotencyInterceptor)
export class PaymentsController {}
```

```typescript
// 3. Method-scoped.
import { Post, UseInterceptors } from '@nestjs/common';
import { Idempotent, IdempotencyInterceptor } from '@nestarc/idempotency';

@Post()
@UseInterceptors(IdempotencyInterceptor)
@Idempotent()
createPayment() {}
```

Only handlers decorated with `@Idempotent()` are processed. Routes without the decorator pass through untouched.

## 4. Decorate write endpoints

```typescript
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { Idempotent, IdempotencyInterceptor } from '@nestarc/idempotency';

@Controller('payments')
@UseInterceptors(IdempotencyInterceptor)
export class PaymentsController {
  @Post()
  @Idempotent()
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentService.process(dto);
  }

  @Post('refunds')
  @Idempotent({ ttl: 86400, processingTtl: 60 })
  refund(@Body() dto: RefundDto) {
    return this.paymentService.refund(dto);
  }
}
```

The first request creates a `PROCESSING` record and runs the handler. A completed retry with the same key and matching fingerprint replays the original response instead of running the handler again.

## Module options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | `IdempotencyStorage` | required | Storage adapter instance. Use `MemoryStorage`, `RedisStorage`, `PostgresStorage`, or a custom adapter. |
| `ttl` | `number` | `86400` | Completed replay record TTL, in seconds. Per-handler can override. |
| `processingTtl` | `number` | same as `ttl` | In-flight `PROCESSING` record TTL, in seconds. Use this to recover stuck records sooner than completed replay records. |
| `headerName` | `string` | `'Idempotency-Key'` | HTTP header carrying the key. |
| `keyResolver` | `(ctx) => string \| undefined \| Promise<string \| undefined>` | header lookup | Resolve keys from webhook event ids, command ids, or other deterministic application values. |
| `maxKeyLength` | `number` | `255` | Maximum accepted key length. Longer keys return `400`. |
| `fingerprint` | `boolean \| resolver` | `true` | Stable JSON SHA-256 body fingerprint, or a custom deterministic fingerprint resolver. |
| `scope` | `'endpoint' \| 'global' \| function` | `'endpoint'` | Storage-key namespace strategy. |
| `replayHeaders` | `boolean \| string[]` | `true` | Replay default safe headers, use an explicit allowlist, or disable header replay. |
| `observability` | `{ onEvent?, exposeStatusHeaders? }` | status headers on | Emit redacted outcome events and expose idempotency status headers. |
| `isGlobal` | `boolean` | `true` | Register the module as a Nest global module. |

## Decorator options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `required` | `boolean` | `true` | If true and no key is resolved, the interceptor returns `400`. If false, missing keys pass through. |
| `ttl` | `number` | inherit | Override the module-level completed replay TTL. |
| `processingTtl` | `number` | inherit | Override the module-level processing TTL. |
| `keyResolver` | key resolver function | inherit | Override module-level key resolution for this handler. |
| `maxKeyLength` | `number` | inherit | Override module-level key length validation. |
| `fingerprint` | `boolean \| resolver` | inherit | Override the module-level fingerprint behavior. |

## Scope

The `scope` option controls how the storage key is derived from the raw key value.

| Value | Behavior |
|-------|----------|
| `'endpoint'` | Default. Prefixes `HTTP_METHOD /actual/path::` and excludes the query string, for example `POST /payments/pay_1/capture::client-key`. |
| `'global'` | Uses the raw key as-is. Use only when clients guarantee globally unique keys across all endpoints. |
| `function` | Returns a custom namespace. Useful for tenant-aware APIs or domain-specific scoping. |

The default endpoint scope uses the actual request path, not only the route template. That means `/orders/1/capture` and `/orders/2/capture` do not collide when they receive the same raw key. Query strings are intentionally excluded because `?a=1&b=2` and `?b=2&a=1` should not accidentally create two idempotency namespaces. If query values must participate, use a custom scope:

```typescript
import { ExecutionContext } from '@nestjs/common';
import { IdempotencyModule, RedisStorage } from '@nestarc/idempotency';

IdempotencyModule.forRoot({
  storage: new RedisStorage({ connection: { host: 'localhost', port: 6379 } }),
  scope: (ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<{
      user: { tenantId: string };
      originalUrl?: string;
    }>();
    return `${req.user.tenantId}:${req.originalUrl ?? ''}`;
  },
});
```

## Processing leases

`ttl` is how long a completed response can be replayed. `processingTtl` is how long an in-flight lock stays around if the process crashes before completing.

```typescript
IdempotencyModule.forRoot({
  storage: new RedisStorage({ connection: { host: 'localhost', port: 6379 } }),
  ttl: 86400,
  processingTtl: 120,
});
```

Choose `processingTtl` above the endpoint's real p99 processing time. A lease shorter than the handler's execution time can allow a retry to acquire the key while the original request is still running.

## Custom key and fingerprint resolvers

Use `keyResolver` when the stable idempotency key comes from the request body instead of the `Idempotency-Key` header, such as webhook event ids or command ids.

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { Idempotent } from '@nestarc/idempotency';

interface StripeEvent {
  id: string;
  type: string;
  data: { object: { id: string } };
}

@Controller('webhooks')
export class WebhooksController {
  @Post('stripe')
  @Idempotent({
    keyResolver: (ctx) => {
      const req = ctx.switchToHttp().getRequest<{ body: StripeEvent }>();
      return req.body.id;
    },
    fingerprint: ({ body }) => {
      const event = body as StripeEvent;
      return `${event.type}:${event.data.object.id}`;
    },
  })
  handleStripe(@Body() event: StripeEvent) {
    return this.webhookService.process(event);
  }
}
```

The default boolean fingerprint uses stable JSON serialization. A custom resolver replaces that with your semantic fingerprint, so it must be deterministic for the same logical request.

## Response header replay

By default, the interceptor captures and replays a conservative header allowlist:

- `Content-Type`
- `Location`
- `ETag`
- `Cache-Control`
- custom `X-*` headers

Unsafe or hop-by-hop headers such as `Set-Cookie`, `Connection`, and `Transfer-Encoding` are denied. `Authorization` is not in the default allowlist; do not add it to an explicit allowlist for public APIs.

```typescript
IdempotencyModule.forRoot({
  storage: new MemoryStorage(),
  replayHeaders: true,
});

IdempotencyModule.forRoot({
  storage: new MemoryStorage(),
  replayHeaders: ['location', 'x-request-id'],
});

IdempotencyModule.forRoot({
  storage: new MemoryStorage(),
  replayHeaders: false,
});
```

## Observability

v0.4.0 emits redacted outcome events and status headers.

```typescript
IdempotencyModule.forRoot({
  storage: new MemoryStorage(),
  observability: {
    onEvent: (event) => {
      console.log('idempotency', event.outcome, event.keyHash);
    },
  },
});
```

Status headers are enabled by default:

| Header | Example |
|--------|---------|
| `Idempotency-Status` | `created`, `replayed`, `conflict`, `mismatch`, `bypassed`, `stale`, `complete_error` |
| `Idempotency-Replayed` | `true` on replayed responses |

Disable client-visible status headers if your public API contract should not expose them:

```typescript
IdempotencyModule.forRoot({
  storage: new MemoryStorage(),
  observability: { exposeStatusHeaders: false },
});
```

## Production checklist

- Use `RedisStorage` or `PostgresStorage` for all multi-replica deployments.
- Keep `fingerprint: true` unless you provide a deterministic semantic fingerprint.
- Keep `scope: 'endpoint'` unless clients guarantee globally unique keys.
- Set `processingTtl` above the endpoint p99 and below the completed replay `ttl`.
- Use a completed replay `ttl` aligned with your client retry window, usually 24 hours for payment-like APIs.
- Return plain JSON from idempotent endpoints. Buffers, typed arrays, and streams intentionally bypass replay caching.
- Decide whether `Location`, `ETag`, `Cache-Control`, and `X-*` replay is part of your API contract.
- Add the Postgres `response_headers JSONB` migration if upgrading from pre-v0.3.0 Postgres storage.
- Monitor `created`, `replayed`, `conflict`, `mismatch`, `stale`, and `complete_error` outcomes.
- Test duplicate requests with the same key, different payload, concurrent requests, and missing-key behavior before rollout.

## Migration guide

### From v0.2.x to v0.3.x

Add the response header column before enabling header replay with Postgres storage:

```sql
ALTER TABLE idempotency_records
  ADD COLUMN IF NOT EXISTS response_headers JSONB;
```

Endpoint scoping now uses the actual request path and excludes the query string. If an endpoint previously relied on query values as part of the idempotency namespace, configure a custom `scope` function.

Stable JSON fingerprinting can turn previous false `422` mismatches into replays when the request bodies differ only by object key order.

### From v0.3.x to v0.4.x

No storage migration is required for the v0.4.0 options. Review these behavior changes before rollout:

- `Idempotency-Status` and `Idempotency-Replayed` headers are exposed by default. Set `observability: { exposeStatusHeaders: false }` if you do not want client-visible status headers.
- `maxKeyLength` defaults to `255`; longer resolved keys return `400`.
- `processingTtl` can now be configured separately from `ttl`. Leaving it unset preserves the earlier single-TTL behavior.
- `keyResolver` and custom `fingerprint` resolvers are available for webhook and command-style APIs.
