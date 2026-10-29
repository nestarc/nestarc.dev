---
title: "The NestJS API Response Format You Won't Regret"
date: 2026-04-09
description: Why every NestJS endpoint should return the same response shape from day one — and how to add it to an existing app without touching a single controller.
author: nestarc
reviewed: 2026-10-29
versionScope: "@nestarc/safe-response 0.16.0 and NestJS 10/11; benchmark figures are from the earlier harness"
---

# The NestJS API Response Format You Won't Regret

Your API has 30 endpoints. Some return `{ data: [...] }`, some return arrays directly, some return `{ result: {...}, status: 'ok' }`. The error format? Depends on who wrote the endpoint.

Your frontend team is writing `if (response.data) ... else if (response.result) ...` everywhere. It's week 3 and they're already frustrated.

## The Problem

NestJS doesn't enforce a response format. Controllers return whatever shape you give them:

```typescript
// Endpoint A returns this
{ id: 1, name: 'Alice' }

// Endpoint B returns this
{ data: { id: 1, name: 'Alice' }, message: 'success' }

// Error from endpoint A
{ statusCode: 404, message: 'Not Found' }

// Error from endpoint B
{ error: true, msg: 'user not found', code: 'USER_NOT_FOUND' }
```

Every frontend dev has to learn each endpoint's quirks. Every new backend dev invents yet another format.

## The Solution: Wrap Once, Everywhere

A NestJS interceptor can transform HTTP handler return values into a consistent envelope:

```typescript
// Every success response becomes:
{
  "success": true,
  "statusCode": 200,
  "data": { "id": 1, "name": "Alice" }
}

// Every error response becomes:
{
  "success": false,
  "statusCode": 404,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

The frontend can share the package's discriminated response type:

```typescript
import type { SafeResponse } from '@nestarc/safe-response/client';

type ApiResponse<T> = SafeResponse<T>;
```

In 0.16.0, success `data` is required for concrete payloads and may be omitted when the payload type admits `undefined`. A `null` payload remains `data: null`. Use `SafeAnyResponse<T>` when the API enables RFC 9457 Problem Details, which has a different error shape.

## Why Do This on Day One?

Changing response formats after launch is painful:
- Every frontend consumer needs to update their parsing logic
- Mobile apps with older versions can't handle the new format
- API clients built by third parties break silently

Adding the wrapper **before** any frontend integration means you never have to migrate.

## The Performance Question

"Doesn't wrapping every response add overhead?"

An earlier local run with the previous benchmark harness reported:

| Scenario | Raw NestJS | With wrapper | Difference |
|----------|-----------|-------------|------------|
| Success (200) | 0.61ms | 0.44ms | -0.17ms |
| Error (404) | 0.39ms | 0.52ms | +0.13ms |

These are historical measurements, not 0.16.0 results. The current harness uses paired, alternating rounds and consistent keep-alive connections; its measurements are not directly comparable with this table. Follow the [0.16.0 benchmark procedure](/packages/safe-response/benchmark) to measure your deployment path. A negative difference does not establish that wrapping makes NestJS faster.

## What Else Comes Free?

Once you have a global interceptor, you can add metadata without changing controllers:

- **Request ID tracking** — optional `X-Request-Id` handling and response metadata
- **Response time** — optional `meta.responseTime`
- **Pagination metadata** — `{ meta: { pagination: { page, totalPages, ... } } }`
- **Rate limit info** — optional mirroring of `X-RateLimit-*` headers into `meta.rateLimit`
- **Deprecation warnings** — RFC 9745 headers + response metadata

Each of these would be a separate interceptor if you built them yourself.

## Using @nestarc/safe-response

[`@nestarc/safe-response`](https://nestarc.dev/packages/safe-response/) does all of this:

```bash
npm install @nestarc/safe-response@0.16.0
```

```typescript
// app.module.ts — enable only the metadata your API contract needs
SafeResponseModule.register({
  requestId: true,
  responseTime: true,
  rateLimit: true,
}),
```

No controller or service changes are needed for the base envelope. Request IDs, response time, and rate-limit metadata are opt-in; their defaults are disabled.

Use `@RawResponse()` for routes that need an unwrapped success response, and return `StreamableFile` for portable file downloads. Manually sent responses and bodyless statuses such as HTTP 204 do not receive a JSON envelope. See the [wrapping boundaries](/packages/safe-response/response-format#wrapping-boundaries) before applying this contract to an existing API.

Includes Swagger schema generation, error code mapping, cursor/offset pagination metadata, an i18n adapter, and client types without server runtime imports. The npm package still declares NestJS/Swagger peers even when consumers import only `/client`. Follow the [installation guide](/packages/safe-response/installation) for compatible peers and the 0.16.0 migration notes.

[Documentation](https://nestarc.dev/packages/safe-response/) · [GitHub](https://github.com/nestarc/nestjs-safe-response) · [Benchmark](https://nestarc.dev/packages/safe-response/benchmark)

Primary framework reference: [NestJS interceptors](https://docs.nestjs.com/interceptors).
