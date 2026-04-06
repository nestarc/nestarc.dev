---
description: "Install @nestarc/safe-response and register SafeResponseModule in your NestJS application."
---

# Installation

## Installation

```bash
npm install @nestarc/safe-response
```

### Peer Dependencies

```bash
npm install @nestjs/common @nestjs/core @nestjs/swagger rxjs reflect-metadata
```

## Quick Start

```typescript
import { Module } from '@nestjs/common';
import { SafeResponseModule } from '@nestarc/safe-response';

@Module({
  imports: [SafeResponseModule.register()],
})
export class AppModule {}
```

That's it. All routes now return standardized responses.

### With Fastify

Works the same way — no extra configuration needed:

```typescript
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
);
await app.listen(3000);
```

## Module Options

```typescript
SafeResponseModule.register({
  timestamp: true,         // include timestamp field (default: true)
  path: true,              // include path field (default: true)
  requestId: true,         // include request ID tracking (default: false)
  responseTime: true,      // include response time in meta (default: false)
  problemDetails: true,    // RFC 9457 error format (default: false)
  errorCodeMapper: (exception) => {
    if (exception instanceof TokenExpiredError) return 'TOKEN_EXPIRED';
    return undefined;      // fall back to default mapping
  },
  dateFormatter: () => new Date().toISOString(),  // custom date format
})
```

### Async Registration

```typescript
SafeResponseModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    timestamp: config.get('RESPONSE_TIMESTAMP', true),
  }),
  inject: [ConfigService],
})
```

### Additional Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `requestId` | `boolean \| RequestIdOptions` | `undefined` | Enable request ID tracking in responses |
| `responseTime` | `boolean` | `false` | Include response time (ms) in `meta.responseTime` |
| `problemDetails` | `boolean \| ProblemDetailsOptions` | `false` | Enable RFC 9457 Problem Details error format |
| `successCodeMapper` | `(statusCode: number) => string \| undefined` | `undefined` | Maps HTTP status codes to success code strings |
| `transformResponse` | `(data: unknown) => unknown` | `undefined` | Transform data before response wrapping (sync only) |
| `swagger` | `SwaggerOptions` | `undefined` | Swagger documentation options (e.g., `globalErrors`) |
| `context` | `ContextOptions` | `undefined` | Inject CLS store values (traceId, etc.) into response `meta`. Requires `nestjs-cls`. |
| `rateLimit` | `boolean \| RateLimitOptions` | `undefined` | Mirror rate limit response headers into `meta.rateLimit` |
| `i18n` | `boolean \| I18nAdapter` | `undefined` | Enable i18n for error/success messages. `true` auto-detects `nestjs-i18n`, or pass a custom adapter. |
| `errorCodes` | `Record<number, string>` | `undefined` | Declarative error code map merged on top of `DEFAULT_ERROR_CODE_MAP` |
| `suppressWarnings` | `boolean` | `false` | Suppress shape-mismatch warnings for `@Paginated`, `@CursorPaginated`, `@SortMeta`, `@FilterMeta` |

#### Success Code Mapping

```typescript
SafeResponseModule.register({
  successCodeMapper: (statusCode) => {
    const map: Record<number, string> = { 200: 'OK', 201: 'CREATED' };
    return map[statusCode];
  },
})
```

#### Response Transformation

```typescript
SafeResponseModule.register({
  transformResponse: (data) => {
    if (data && typeof data === 'object' && 'password' in data) {
      const { password, ...rest } = data as Record<string, unknown>;
      return rest;
    }
    return data;
  },
})
```
