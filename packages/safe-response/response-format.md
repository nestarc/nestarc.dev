---
description: "Understand the @nestarc/safe-response envelope format — success data, error codes, pagination metadata, and timestamps."
---

# Response Format

## Success

```json
{
  "success": true,
  "statusCode": 200,
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "data": { "id": 1, "name": "John" },
  "timestamp": "2025-03-21T12:00:00.000Z",
  "path": "/api/users/1"
}
```

> `requestId` is only present when `requestId` option is enabled. See [Request ID](#request-id).

When a handler returns `undefined`, JSON omits `data`; `null` stays `data: null`. In 0.16.0, untyped Swagger responses allow omission and the server/client `SafeSuccessResponse<T>` types agree: with `strictNullChecks`, `data` is optional only when `T` admits `undefined` (including `void` and default `unknown`). DTO and pagination schemas still require `data`.

The envelope's `statusCode` and `successCodeMapper` reflect the status after the handler completes, including changes through `@Res({ passthrough: true })`.

## Wrapping Boundaries

`SafeResponseModule` wraps HTTP handler return values. `@RawResponse()` bypasses the success interceptor, while exceptions still go through the global filter. A returned `StreamableFile` bypasses wrapping automatically on Express and Fastify; use it for portable binary responses. A raw `Buffer` or stream does not become portable merely by adding `@RawResponse()`.

Manually sent responses and HTTP responses without a body, such as 204, do not receive a JSON envelope. Non-HTTP contexts (RPC and WebSocket) are skipped. Examples on this page omit optional `timestamp` and `path` fields where they are not relevant.

## Error

```json
{
  "success": false,
  "statusCode": 400,
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": ["email must be an email", "name should not be empty"]
  },
  "timestamp": "2025-03-21T12:00:00.000Z",
  "path": "/api/users"
}
```

## Request ID

Enable request ID tracking to include a unique identifier in every response — essential for production debugging and distributed tracing.

```typescript
SafeResponseModule.register({
  requestId: true, // auto-generate UUID v4, read from X-Request-Id header
})
```

Behavior:
1. Reads the first incoming `X-Request-Id` value, truncates it to 128 characters, and removes characters outside `A–Z`, `a–z`, `0–9`, `-`, `_`, `.`, `~`
2. If no usable value remains, calls the configured generator or `crypto.randomUUID()`; generator output is sanitized too, with UUID fallback if empty or throwing
3. Includes `requestId` field in both success and error response bodies
4. Sets `X-Request-Id` response header for downstream tracking

### Custom Options

```typescript
SafeResponseModule.register({
  requestId: {
    headerName: 'X-Correlation-Id',  // custom header name (default: 'X-Request-Id')
    generator: () => `req-${Date.now()}`,  // custom ID generator
  },
})
```

## Response Time

Measure elapsed time from the interceptor to response construction. It includes downstream pipes, interceptors, and the handler, and excludes earlier guards and network transfer.

```typescript
SafeResponseModule.register({
  responseTime: true,  // adds meta.responseTime (milliseconds) when timing is available
})
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "data": { "id": 1, "name": "John" },
  "meta": { "responseTime": 42 }
}
```

Uses `performance.now()` for high-resolution timing. Included in both success and error responses (when the interceptor ran before the error).

## RFC 9457 Problem Details

Enable [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html) Problem Details error responses.

```typescript
SafeResponseModule.register({
  problemDetails: { baseUrl: 'https://api.example.com/problems' },
  requestId: true,
})
```

For an incoming `X-Request-Id: abc-123` and a `NotFoundException('User with ID 123 not found')`:

```json
{
  "type": "https://api.example.com/problems/not-found",
  "title": "Not Found",
  "status": 404,
  "detail": "User with ID 123 not found",
  "instance": "/api/users/123",
  "code": "NOT_FOUND",
  "requestId": "abc-123"
}
```

- Sets `Content-Type: application/problem+json` automatically
- With `problemDetails: true` and no `@ProblemType()`, `type` defaults to `about:blank`
- Uses `@ProblemType(uri)` decorator for per-route type URIs, or auto-generates from `baseUrl` + error code
- Preserves extension members: `code`, `requestId`, `details` (validation errors), `meta.responseTime`
- Success responses are **not affected** — only error responses change format
- Use `@ApiSafeProblemResponse(status)` for Swagger documentation

## API Deprecation

`@Deprecated()` adds deprecation headers, `meta.deprecation`, and Swagger's deprecated marker:

```typescript
@Get('v1/users')
@Deprecated({
  since: '2026-01-01',
  sunset: '2026-12-31',
  message: 'Use /v2/users instead',
  link: '/v2/users',
})
findAll() { ... }
```

This sets `Deprecation: @1767225600`, `Sunset: Thu, 31 Dec 2026 00:00:00 GMT`, and `Link: </v2/users>; rel="successor-version"`.

In 0.16.0, a missing or invalid `since` produces an RFC 9745 `@<unix-timestamp>` for the current time, instead of `true`. The first fallback date is reused for the same response, and repeated handling does not duplicate successor links. `meta.deprecation.since` is included only for a valid explicit date. Supply `since` when a stable deprecation date matters.

Success and error responses can include this metadata. If a guard throws before the interceptor runs, route deprecation headers are unavailable; the same limitation applies to `@ProblemType()`.

## Rate Limit Metadata

Mirror rate limit response headers into the response body for frontend consumption.

```typescript
SafeResponseModule.register({
  rateLimit: true,  // reads X-RateLimit-* headers
})
```

Reads headers already set on the application response when the envelope is built, for example by a guard or middleware. Headers added later by a proxy or API gateway cannot be mirrored:

```json
{
  "success": true,
  "statusCode": 200,
  "data": [{ "id": 1 }],
  "meta": {
    "rateLimit": {
      "limit": 100,
      "remaining": 87,
      "reset": 1712025600
    }
  }
}
```

All three headers (`Limit`, `Remaining`, `Reset`) must contain finite, non-negative values; missing or invalid data is suppressed. A valid numeric `Retry-After` is included as `retryAfter`. Available in both success and error responses (including 429 Too Many Requests).

### Custom Header Prefix

```typescript
SafeResponseModule.register({
  rateLimit: { headerPrefix: 'RateLimit' },  // reads RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset
})
```

## Field Selection Metadata

Enable Google-style partial responses with `@FieldSelection()` or the module-level `fieldSelection` option:

```typescript
SafeResponseModule.register({
  fieldSelection: {
    maxDepth: 2,
    maxFields: 20,
    maxFieldLength: 80,
  },
})
```

Field paths support dot notation and arrays. Inherited/prototype paths and reserved segments (`__proto__`, `prototype`, `constructor`) are ignored. Use `maxFields` and `maxFieldLength` to bound query complexity for public APIs.

In 0.16.0, overlapping paths such as `fields=address,address.city` keep the entire parent value regardless of selection order. Selection does not mutate the original payload and supports frozen objects. Missing nested paths are omitted.

Top-level arrays are processed element by element, including nested arrays. A path such as `addresses.city` does not automatically traverse an array stored in an object property. A route's `@FieldSelection()` takes precedence over the module option; use `@FieldSelection(false)` to opt out.

Field selection does not rewrite Swagger schemas. Use a DTO with optional properties, including nested properties, or a schema that permits omitted fields. It selects output fields and does not replace authorization or sensitive-field exclusion.

Source: [0.16.0 response and integration contracts](https://github.com/nestarc/nestjs-safe-response/blob/v0.16.0/README.md).
