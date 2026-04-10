---
description: "Install @nestarc/idempotency, register IdempotencyModule, and wire the interceptor in your NestJS application."
---

# Installation

## 1. Install

```bash
npm install @nestarc/idempotency
```

For Redis storage (recommended for production):

```bash
npm install ioredis
```

## 2. Register the Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { IdempotencyModule, MemoryStorage } from '@nestarc/idempotency';

@Module({
  imports: [
    IdempotencyModule.forRoot({
      storage: new MemoryStorage(),
      ttl: 86400, // 24 hours
    }),
  ],
})
export class AppModule {}
```

### Async registration (recommended)

```typescript
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
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
          }),
        }),
        ttl: config.get('IDEMPOTENCY_TTL', 86400),
      }),
    }),
  ],
})
export class AppModule {}
```

## 3. Wire the Interceptor

The module does **not** auto-register the interceptor — you opt in with one of three patterns:

```typescript
// 1. App-global — applies to every controller
import { APP_INTERCEPTOR } from '@nestjs/core';
import { IdempotencyInterceptor } from '@nestarc/idempotency';

@Module({
  providers: [{ provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor }],
})
export class AppModule {}
```

```typescript
// 2. Controller-scoped
@Controller('payments')
@UseInterceptors(IdempotencyInterceptor)
export class PaymentsController { ... }
```

```typescript
// 3. Method-scoped
@Post()
@UseInterceptors(IdempotencyInterceptor)
@Idempotent()
createPayment() { ... }
```

In all three cases, only handlers decorated with `@Idempotent()` are processed. Routes without the decorator pass through untouched.

## 4. Decorate Your Handlers

```typescript
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { Idempotent, IdempotencyInterceptor } from '@nestarc/idempotency';

@Controller('payments')
@UseInterceptors(IdempotencyInterceptor)
export class PaymentsController {
  @Post()
  @Idempotent()
  createPayment(@Body() dto: CreatePaymentDto) {
    // Runs at most once per Idempotency-Key.
    return this.paymentService.process(dto);
  }

  @Post('refund')
  @Idempotent({ ttl: 300, required: false })
  refund(@Body() dto: RefundDto) {
    // Custom TTL, optional header.
    return this.paymentService.refund(dto);
  }
}
```

## Module Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | `IdempotencyStorage` | *required* | Storage adapter instance (`MemoryStorage` or `RedisStorage`) |
| `ttl` | `number` | `86400` | Default TTL in seconds. Per-handler can override |
| `headerName` | `string` | `'Idempotency-Key'` | HTTP header carrying the idempotency key |
| `fingerprint` | `boolean` | `true` | Compute SHA-256 fingerprint of request body |
| `scope` | `IdempotencyScope` | `'endpoint'` | Key namespace strategy. See below |
| `isGlobal` | `boolean` | `true` | Register as a NestJS global module |

## Decorator Options (`@Idempotent()`)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `required` | `boolean` | `true` | If true, missing header returns 400 |
| `ttl` | `number` | inherit | Override module-level TTL for this handler |
| `fingerprint` | `boolean` | inherit | Override module-level fingerprint setting |

## Scope

The `scope` option controls how the storage key is derived from the raw header value.

| Value | Behavior |
|-------|----------|
| `'endpoint'` | **Default.** Prefixes `HTTP_METHOD /route::` using NestJS `PATH_METADATA`. Isolates v1/v2 APIs with same class names |
| `'global'` | Raw header value as-is. Safe only if clients guarantee globally-unique keys |
| `function` | `(ctx: ExecutionContext) => string`. Custom scoping — e.g. include tenant ID |

```typescript
// Multi-tenant example
IdempotencyModule.forRoot({
  storage: new MemoryStorage(),
  scope: (ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user.tenantId;
  },
});
```
