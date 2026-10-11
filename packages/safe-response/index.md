---
description: "Standardized API response wrapper for NestJS — auto-wraps success and error responses with Swagger, field selection, error catalogs, and i18n."
---

# @nestarc/safe-response

Standardized API response wrapper for NestJS — auto-wraps success/error responses, pagination metadata, and Swagger schema generation with a single module import.

For the response-contract design trade-offs behind the package, read [A NestJS API Response Format You Won't Regret](/blog/nestjs-api-response-format-you-wont-regret).

## Current Release

This guide targets **0.16.0**, released on **October 2, 2026**. It fixes response-to-Swagger contracts, omitted `data` for undefined payloads, dynamic success statuses, Express payload-limit errors, field selection immutability, and repeated filters in cursor links. See the [0.16.0 release notes](https://github.com/nestarc/nestjs-safe-response/blob/v0.16.0/CHANGELOG.md) and [migration notes](./installation#migrating-from-0-15-0).

## Features

- **Automatic response wrapping** — HTTP handler return values wrapped in `{ success, statusCode, data }`, with route and file-response opt-outs
- **Error standardization** — exceptions converted to `{ success: false, error: { code, message, details } }`
- **[Pagination metadata](./pagination)** — offset (`page`/`limit`/`total`) and cursor (`nextCursor`/`hasMore`) pagination with auto-calculated meta and HATEOAS links
- **Sort/Filter metadata** — `@SortMeta()` and `@FilterMeta()` decorators to include sorting and filtering info in response `meta`
- **Request ID tracking** — opt-in `requestId` field in all responses with incoming header reuse, auto-generation, and response header propagation
- **Response time** — opt-in `meta.responseTime` (ms) for performance monitoring
- **RFC 9457 Problem Details** — opt-in standard error format with `application/problem+json`
- **Swagger integration** — `@ApiSafeResponse(Dto)` for success schemas, `@ApiSafeErrorResponse()` / `@ApiSafeErrorResponses()` for error schemas — all with the wrapped envelope
- **Global error Swagger** — `applyGlobalErrors()` injects common error responses (401, 403, 500) into all OpenAPI operations
- **Frontend client types** — `@nestarc/safe-response/client` provides types and type guards without server runtime imports; see the [package peer and resolution boundaries](./swagger#frontend-client-types)
- **nestjs-i18n integration** — automatic error/success message translation via adapter pattern
- **API deprecation** — `@Deprecated()` decorator with RFC 9745/8594 `Deprecation`/`Sunset` headers, Swagger `deprecated: true`, and response `meta.deprecation`
- **Rate limit metadata** — opt-in `meta.rateLimit` mirroring of `X-RateLimit-*` response headers for frontend consumption
- **nestjs-cls integration** — inject CLS store values (traceId, correlationId) into response `meta`
- **Field selection** — Google-style `?fields=id,name,address.city` partial responses with quotas and prototype-safe path handling <Badge type="info" text="v0.15.0" />
- **Error catalog** — `defineErrors()`, `createSafeException()`, and catalog-backed Swagger decorators <Badge type="info" text="v0.15.0" />
- **API version metadata** — opt-in `meta.apiVersion` on success and error responses <Badge type="info" text="v0.14.0" />
- **StreamableFile detection** — file download responses skip wrapping automatically <Badge type="info" text="v0.14.0" />
- **class-validator support** — validation errors parsed into `details` array with "Validation failed" message
- **Custom error codes** — map exceptions to machine-readable codes via `errorCodeMapper`
- **Composite decorators** — `@SafeEndpoint()`, `@SafePaginatedEndpoint()`, `@SafeCursorPaginatedEndpoint()` combine Swagger + runtime + error docs, with per-route field selection and explicit error format docs
- **Declarative error codes** — `errorCodes` option for simple status-to-code mapping without writing a mapper function
- **Shape-mismatch warnings** — `@Paginated()`, `@CursorPaginated()`, `@SortMeta()`, `@FilterMeta()` warn when handler data doesn't match expected shape
- **Opt-out per route** — `@RawResponse()` skips wrapping for health checks, SSE, file downloads
- **Platform-agnostic** — works with both Express and Fastify adapters out of the box
- **Context-safe** — automatically skips wrapping for non-HTTP contexts (RPC, WebSocket)
- **Dynamic Module** — `register()` / `registerAsync()` with full DI support

## Installation

```bash
npm install @nestarc/safe-response@0.16.0
```

### Peer Dependencies

Use the [installation guide](./installation#peer-dependencies) to choose the matching NestJS/Swagger majors and Node.js runtime for your application.

## Quick Start

```typescript
import { Module } from '@nestjs/common';
import { SafeResponseModule } from '@nestarc/safe-response';

@Module({
  imports: [
    SafeResponseModule.register({
      fieldSelection: true,
      version: '1.0.0',
    }),
  ],
})
export class AppModule {}
```

Register the module once in the root module. HTTP handler returns receive an envelope; `@RawResponse()`, `StreamableFile`, manually sent responses, and responses without a body such as HTTP 204 have different boundaries described in [Response Format](./response-format#wrapping-boundaries).

For list endpoints, follow the [pagination examples](./pagination) to return the fields expected
by `@Paginated()` or `@CursorPaginated()` and document the resulting envelope in Swagger.
The handler still supplies the items and pagination values from your data query.

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

| NestJS | @nestjs/swagger | Node.js compatibility tested in 0.16.0 |
|--------|-----------------|---------------------------------------|
| 10 | 8 | 18, 20, 22, 24 |
| 11 | 11 | 20, 22, 24 |

The package declares Node.js `>=18`; NestJS 11 requires Node.js `>=20`. Express and Fastify are covered; keep the HTTP adapter on the same NestJS major as `@nestjs/core`. Other required peers are RxJS `^7` and `reflect-metadata` `^0.2`.

Source: [0.16.0 package metadata](https://github.com/nestarc/nestjs-safe-response/blob/v0.16.0/package.json) and [compatibility workflow](https://github.com/nestarc/nestjs-safe-response/blob/v0.16.0/.github/workflows/ci.yml).
