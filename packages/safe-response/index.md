# @nestarc/safe-response

Standardized API response wrapper for NestJS — auto-wraps success/error responses, pagination metadata, and Swagger schema generation with a single module import.

## Features

- **Automatic response wrapping** — all controller returns wrapped in `{ success, statusCode, data }` structure
- **Error standardization** — exceptions converted to `{ success: false, error: { code, message, details } }`
- **Pagination metadata** — offset (`page`/`limit`/`total`) and cursor (`nextCursor`/`hasMore`) pagination with auto-calculated meta and HATEOAS links
- **Sort/Filter metadata** — `@SortMeta()` and `@FilterMeta()` decorators to include sorting and filtering info in response `meta`
- **Request ID tracking** — opt-in `requestId` field in all responses with incoming header reuse, auto-generation, and response header propagation
- **Response time** — opt-in `meta.responseTime` (ms) for performance monitoring
- **RFC 9457 Problem Details** — opt-in standard error format with `application/problem+json`
- **Swagger integration** — `@ApiSafeResponse(Dto)` for success schemas, `@ApiSafeErrorResponse()` / `@ApiSafeErrorResponses()` for error schemas — all with the wrapped envelope
- **Global error Swagger** — `applyGlobalErrors()` injects common error responses (401, 403, 500) into all OpenAPI operations
- **Frontend client types** — `@nestarc/safe-response/client` provides zero-dependency TypeScript types and type guards (`isSuccess`, `isError`, `isPaginated`, `isProblemDetailsResponse`, `hasResponseTime`, `hasSort`, `hasFilters`, `isDeprecated`, `hasRateLimit`) for frontend consumers
- **nestjs-i18n integration** — automatic error/success message translation via adapter pattern
- **API deprecation** — `@Deprecated()` decorator with RFC 9745/8594 `Deprecation`/`Sunset` headers, Swagger `deprecated: true`, and response `meta.deprecation`
- **Rate limit metadata** — opt-in `meta.rateLimit` mirroring of `X-RateLimit-*` response headers for frontend consumption
- **nestjs-cls integration** — inject CLS store values (traceId, correlationId) into response `meta`
- **class-validator support** — validation errors parsed into `details` array with "Validation failed" message
- **Custom error codes** — map exceptions to machine-readable codes via `errorCodeMapper`
- **Composite decorators** — `@SafeEndpoint()`, `@SafePaginatedEndpoint()`, `@SafeCursorPaginatedEndpoint()` combine Swagger + runtime + error docs in a single decorator
- **Declarative error codes** — `errorCodes` option for simple status-to-code mapping without writing a mapper function
- **Shape-mismatch warnings** — `@Paginated()`, `@CursorPaginated()`, `@SortMeta()`, `@FilterMeta()` warn when handler data doesn't match expected shape
- **Opt-out per route** — `@RawResponse()` skips wrapping for health checks, SSE, file downloads
- **Platform-agnostic** — works with both Express and Fastify adapters out of the box
- **Context-safe** — automatically skips wrapping for non-HTTP contexts (RPC, WebSocket)
- **Dynamic Module** — `register()` / `registerAsync()` with full DI support

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

## Compatibility

| Dependency | Version |
|------------|---------|
| NestJS | v10, v11 |
| Platform | Express, Fastify |
| @nestjs/swagger | v8, v11 |
| Node.js | >= 18 |
| RxJS | v7 |
