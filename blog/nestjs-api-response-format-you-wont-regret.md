---
title: "The NestJS API Response Format You Won't Regret"
date: 2026-04-09
description: Why every NestJS endpoint should return the same response shape from day one — and how to add it to an existing app without touching a single controller.
author: nestarc
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

A NestJS interceptor can transform every response into a consistent envelope:

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

The frontend only needs one type:

```typescript
type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  data?: T;
  error?: { code: string; message: string };
};
```

## Why Do This on Day One?

Changing response formats after launch is painful:
- Every frontend consumer needs to update their parsing logic
- Mobile apps with older versions can't handle the new format
- API clients built by third parties break silently

Adding the wrapper **before** any frontend integration means you never have to migrate.

## The Performance Question

"Doesn't wrapping every response add overhead?"

We measured it:

| Scenario | Raw NestJS | With wrapper | Difference |
|----------|-----------|-------------|------------|
| Success (200) | 0.61ms | 0.44ms | -0.17ms |
| Error (404) | 0.39ms | 0.52ms | +0.13ms |

The success path is actually **faster** with the wrapper. The error path adds 0.13ms — invisible in any real workload.

## What Else Comes Free?

Once you have a global interceptor, you can add metadata without changing controllers:

- **Request ID tracking** — `X-Request-Id` header, included in every response
- **Response time** — measured automatically
- **Pagination metadata** — `{ meta: { currentPage, totalPages, ... } }`
- **Rate limit info** — mirrors `X-RateLimit-*` headers into response body
- **Deprecation warnings** — RFC 9745 headers + response metadata

Each of these would be a separate interceptor if you built them yourself.

## Using @nestarc/safe-response

[`@nestarc/safe-response`](https://nestarc.dev/packages/safe-response/) does all of this:

```bash
npm install @nestarc/safe-response
```

```typescript
// app.module.ts — one line
SafeResponseModule.register(),
```

No controller changes. No service changes. Every endpoint is instantly wrapped.

Includes Swagger schema auto-generation, error code mapping, cursor/offset pagination metadata, i18n adapter, and zero-dependency TypeScript client types.

[Documentation](https://nestarc.dev/packages/safe-response/) · [GitHub](https://github.com/nestarc/nestjs-safe-response) · [Benchmark](https://nestarc.dev/packages/safe-response/benchmark)
