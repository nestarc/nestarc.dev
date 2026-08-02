---
description: "API reference for @nestarc/idempotency: module options, decorator options, storage adapters, response replay, and public exports."
---

# @nestarc/idempotency

::: warning Reference status: Curated · Package status: Preview
This page documents the public entry point and operating contract while generated symbol-level coverage is expanded.
:::

## Overview

`@nestarc/idempotency` adds IETF draft-07-compatible `Idempotency-Key` behavior to NestJS write endpoints. Decorate a handler with `@Idempotent()`, wire `IdempotencyInterceptor`, and completed retries with the same key and fingerprint replay the original response instead of running the handler again.

Use it for payments, orders, refunds, imports, inbound webhooks, and command-style APIs where clients may retry after timeouts.

## Installation

```bash
npm install @nestarc/idempotency
```

Optional peers:

```bash
npm install ioredis
npm install pg
```

## Basic usage

```ts
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
}
```

## Module registration

```ts
import { Module } from '@nestjs/common';
import { IdempotencyModule, RedisStorage } from '@nestarc/idempotency';

@Module({
  imports: [
    IdempotencyModule.forRoot({
      storage: new RedisStorage({
        connection: { host: 'localhost', port: 6379 },
      }),
      ttl: 86400,
      processingTtl: 120,
    }),
  ],
})
export class AppModule {}
```

`forRootAsync()` follows the standard NestJS async module pattern with `imports`, `inject`, `useFactory`, `useClass`, or `useExisting`.

## Module options

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `storage` | `IdempotencyStorage` | required | Use `MemoryStorage`, `RedisStorage`, `PostgresStorage`, or a custom adapter. |
| `ttl` | `number` | `86400` | Completed replay record TTL in seconds. |
| `processingTtl` | `number` | same as `ttl` | In-flight `PROCESSING` lease TTL in seconds. |
| `headerName` | `string` | `Idempotency-Key` | Header carrying the idempotency key. |
| `keyResolver` | `(ctx) => string \| undefined \| Promise<string \| undefined>` | header lookup | Resolve keys from webhook event ids, command ids, or application values. |
| `maxKeyLength` | `number` | `255` | Longer resolved keys return `400`. |
| `fingerprint` | `boolean \| resolver function` | `true` | Stable JSON body fingerprint or semantic resolver. |
| `scope` | `IdempotencyScope` | `'endpoint'` | Namespaces raw keys. Default excludes query strings. |
| `replayHeaders` | `boolean \| string[]` | `true` | Default safe allowlist, explicit allowlist, or disabled. |
| `observability` | `{ onEvent?, exposeStatusHeaders? }` | status headers on | Outcome hook and status-header control. |
| `isGlobal` | `boolean` | `true` | Registers the module globally. |

## Decorator options

```ts
@Post('refunds')
@Idempotent({
  ttl: 86400,
  processingTtl: 60,
  required: true,
})
refund(@Body() dto: RefundDto) {
  return this.paymentService.refund(dto);
}
```

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `required` | `boolean` | `true` | Missing key returns `400`. When false, missing key passes through. |
| `ttl` | `number` | inherit | Completed replay TTL override. |
| `processingTtl` | `number` | inherit | In-flight lease TTL override. |
| `keyResolver` | resolver function | inherit | Handler-level key resolver. |
| `maxKeyLength` | `number` | inherit | Handler-level key length validation. |
| `fingerprint` | `boolean \| resolver function` | inherit | Handler-level fingerprint behavior. |

## Public exports

| Export | Purpose |
|--------|---------|
| `IdempotencyModule` | Nest dynamic module with `forRoot()` and `forRootAsync()`. |
| `IdempotencyInterceptor` | Interceptor that applies idempotency behavior. |
| `Idempotent()` | Method decorator that opts a handler into idempotency. |
| `MemoryStorage` | In-memory adapter for local development and tests. |
| `RedisStorage` | Redis-backed adapter for multi-replica production state. |
| `PostgresStorage` | Postgres-backed adapter for multi-replica production state. |
| `PostgresSweepService` | Optional cleanup service for expired Postgres rows. |
| `IDEMPOTENCY_SWEEP_OPTIONS` | Injection token for sweep service options. |
| `IDEMPOTENCY_OPTIONS` | Injection token for resolved module options. |
| `IDEMPOTENCY_STORAGE` | Injection token for the configured storage adapter. |
| `IDEMPOTENT_METADATA_KEY` | Metadata key used by the decorator and interceptor. |
| `DEFAULT_HEADER_NAME` | Default `Idempotency-Key` header name. |
| `DEFAULT_TTL_SECONDS` | Default completed replay TTL. |
| `IdempotencyOptions` | Module-level options interface. |
| `IdempotencyAsyncOptions` | Async module registration options. |
| `IdempotencyOptionsFactory` | `useClass` / `useExisting` factory contract. |
| `IdempotentOptions` | Per-handler decorator options. |
| `IdempotentMetadata` | Decorator metadata shape. |
| `IdempotencyStorage` | Adapter contract. |
| `IdempotencyRecord` | Persisted storage record shape. |
| `CompleteResponse` | Captured response passed to storage. |
| `CreateResult` | `create()` result with acquired flag and token. |
| `MutateResult` | `'ok' \| 'stale'` result for `complete()` and `delete()`. |
| `IdempotencyScope` | `'endpoint'`, `'global'`, or custom scope function. |
| `ReplayHeadersOption` | `boolean \| string[]`. |
| `RedisStorageOptions` | Redis adapter constructor options. |
| `PostgresStorageOptions` | Postgres adapter constructor options. |
| `SweepOptions` | Postgres sweep service options. |

## Storage contract

```ts
interface IdempotencyStorage {
  get(key: string): Promise<IdempotencyRecord | null>;
  create(
    key: string,
    fingerprint: string | undefined,
    ttlSeconds: number,
  ): Promise<CreateResult>;
  complete(
    key: string,
    token: string,
    response: CompleteResponse,
    ttlSeconds: number,
  ): Promise<MutateResult>;
  delete(key: string, token: string): Promise<MutateResult>;
}
```

Adapters must provide atomic create semantics and token-based compare-and-set for mutations. `createdAt` must remain immutable across `complete()` calls.

## Error semantics

| Status | Cause |
|-------:|-------|
| `400` | Missing required key, invalid TTL, or key longer than `maxKeyLength`. |
| `409` | Existing record is still `PROCESSING`. |
| `422` | Same key was reused with a different fingerprint. |

Completed matching records replay the stored response status, body, and safe headers.

## Response headers

Default replay allowlist:

- `Content-Type`
- `Location`
- `ETag`
- `Cache-Control`
- custom `X-*` headers

Denied headers such as `Set-Cookie`, `Connection`, and `Transfer-Encoding` are not cached or replayed. `Authorization` is not in the default allowlist; avoid adding it to an explicit allowlist for public APIs.

Status headers are enabled by default:

- `Idempotency-Status`
- `Idempotency-Replayed: true` on replay

Disable them with:

```ts
IdempotencyModule.forRoot({
  storage,
  observability: { exposeStatusHeaders: false },
});
```

## Useful guides

- [Installation](/packages/idempotency/installation)
- [How it works](/packages/idempotency/how-it-works)
- [Storage adapters](/packages/idempotency/storage)
- [Benchmarks](/packages/idempotency/benchmark)
