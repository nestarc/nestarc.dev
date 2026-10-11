---
description: "Install @nestarc/safe-response and register SafeResponseModule in your NestJS application."
---

# Installation

## Installation

```bash
npm install @nestarc/safe-response@0.16.0
```

### Peer Dependencies

Choose the combination matching your application and keep the NestJS HTTP adapter on the same major as `@nestjs/core`:

```bash
# NestJS 11: Node.js >=20
npm install @nestjs/common@^11 @nestjs/core@^11 @nestjs/swagger@^11 rxjs@^7 reflect-metadata@^0.2

# NestJS 10: Node.js >=18
npm install @nestjs/common@^10 @nestjs/core@^10 @nestjs/swagger@^8 rxjs@^7 reflect-metadata@^0.2
```

`nestjs-i18n` (`^10 || ^11`) and `nestjs-cls` (`^4 || ^5`) are optional peers needed only for their integrations. Configure `I18nModule` before using `i18n: true`; a custom `I18nAdapter` does not require that peer. Context injection needs a configured `ClsModule` and an active CLS context.

The `/client` entry point has no NestJS runtime imports, but the npm package still declares the server peers. Package managers may install or require them even in a frontend-only project. See [Frontend Client Types](./swagger#frontend-client-types).

## Quick Start

```typescript
import { Module } from '@nestjs/common';
import { SafeResponseModule } from '@nestarc/safe-response';

@Module({
  imports: [SafeResponseModule.register()],
})
export class AppModule {}
```

Register the module once in the root module. It wraps HTTP handler return values and formats errors handled by the global filter; see [wrapping boundaries](./response-format#wrapping-boundaries) for raw, file, and bodyless responses.

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
| `version` | `string` | `undefined` | Include the application's API version in `meta.apiVersion` |
| `errorCatalog` | `ErrorCatalog` | `undefined` | Centralized definitions used by `SafeException` for status/message resolution |
| `fieldSelection` | `boolean \| FieldSelectionOptions` | `undefined` | Enable partial responses through the `fields` query parameter |
| `suppressWarnings` | `boolean` | `false` | Suppress shape-mismatch warnings for `@Paginated`, `@CursorPaginated`, `@SortMeta`, `@FilterMeta` |

#### Success Code Mapping

In 0.16.0, both the envelope's `statusCode` and the mapper read the HTTP status after the handler completes, including status changes made with `@Res({ passthrough: true })`. Swagger decorator options document status; use NestJS `@HttpCode()` or your adapter's passthrough API to change it at runtime.

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

## Migrating from 0.15.0

- **Success types:** `SafeSuccessResponse<T>` is now a conditional type alias in both public entry points. With `strictNullChecks`, `data` remains required for concrete payloads and can be omitted when `T` admits `undefined` (including `void` and default `unknown`). Replace generic interface extensions or declaration merging with an intersection:

  ```typescript
  import type { SafeSuccessResponse } from '@nestarc/safe-response/client';

  type AppSuccess<T> = SafeSuccessResponse<T> & { traceId: string };
  ```

- **Deprecation:** consumers of the `Deprecation` header must accept an RFC 9745 date (`@<unix-timestamp>`) instead of the old `true` fallback. Supply a valid `since` for a fixed date; otherwise the first handling time is reused for that response.
- **Payload limits:** Express oversized JSON requests now produce HTTP `413` with `PAYLOAD_TOO_LARGE`, replacing the erroneous `500`/`INTERNAL_SERVER_ERROR` response. Update client error handling and HTTP contract assertions accordingly.
- **OpenAPI:** regenerate schemas and any generated clients. Untyped `data` and error `details` allow all JSON values; undefined payloads may omit `data`, while DTO and pagination responses still require it. Global error fallback schemas now enforce required envelope and nested metadata fields.

Source: [0.16.0 changelog](https://github.com/nestarc/nestjs-safe-response/blob/v0.16.0/CHANGELOG.md).
