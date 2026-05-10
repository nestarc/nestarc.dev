---
description: "API reference stub for @nestarc/idempotency: module registration, decorator usage, storage adapters, and production notes."
---

# @nestarc/idempotency

::: warning Status: Beta
API reference is being expanded.
The package is usable, but advanced examples are still in progress.
:::

## Overview

`@nestarc/idempotency` adds IETF-style `Idempotency-Key` handling to NestJS write endpoints. Decorate a handler with `@Idempotent()`, wire `IdempotencyInterceptor`, and repeated requests with the same key can replay the original JSON response instead of running the handler again.

Use it for payment creation, order submission, webhook ingestion, or any non-idempotent operation where clients may retry after timeouts.

## Installation

```bash
npm install @nestarc/idempotency
```

Redis storage is recommended for production:

```bash
npm install ioredis
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

## Configuration

```ts
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

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `storage` | `IdempotencyStorage` | required | Use `MemoryStorage`, `RedisStorage`, or a custom adapter. |
| `ttl` | `number` | `86400` | Cache lifetime in seconds. |
| `headerName` | `string` | `Idempotency-Key` | Header carrying the idempotency key. |
| `fingerprint` | `boolean` | `true` | Compare request body hash before replay. |
| `scope` | `'endpoint' \| 'global' \| function` | `'endpoint'` | Namespaces raw keys. |
| `isGlobal` | `boolean` | `true` | Registers the module globally. |

## Public API

| Export | Purpose |
|--------|---------|
| `IdempotencyModule` | Nest module with `forRoot()` and `forRootAsync()`. |
| `IdempotencyInterceptor` | Interceptor that reads metadata and controls replay. |
| `Idempotent()` | Method decorator for idempotent handlers. |
| `MemoryStorage` | In-memory adapter for development and tests. |
| `RedisStorage` | Redis-backed adapter for shared production state. |
| `IdempotencyStorage` | Adapter contract for custom stores. |
| `IdempotencyScope` | Scope strategy for deriving storage keys. |

## Examples

```ts
@Post('refund')
@Idempotent({ ttl: 300, required: false })
refund(@Body() dto: RefundDto) {
  return this.paymentService.refund(dto);
}
```

Useful package guides:

- [How it works](/packages/idempotency/how-it-works)
- [Storage adapters](/packages/idempotency/storage)
- [Benchmarks](/packages/idempotency/benchmark)

## Production notes

- Use `RedisStorage` or another shared adapter when you run more than one application instance.
- Keep `fingerprint` enabled for write endpoints so a reused key with a different payload returns `422`.
- Register `IdempotencyInterceptor` globally, per controller, or per method, then opt specific handlers in with `@Idempotent()`.
- Binary and streaming responses bypass replay caching; design idempotent endpoints to return JSON when replay matters.
