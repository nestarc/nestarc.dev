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
1. Checks incoming `X-Request-Id` header — reuses the value if present
2. If no header, generates a UUID v4 via `crypto.randomUUID()` (no external dependencies)
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

Track handler execution time in every response — useful for performance monitoring and SLA tracking.

```typescript
SafeResponseModule.register({
  responseTime: true,  // adds meta.responseTime (milliseconds) to all responses
})
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "data": { "..." },
  "meta": { "responseTime": 42 }
}
```

Uses `performance.now()` for high-resolution timing. Included in both success and error responses (when the interceptor ran before the error).

## RFC 9457 Problem Details

Enable [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html) standard error responses — used by Stripe, GitHub, and Cloudflare.

```typescript
SafeResponseModule.register({
  problemDetails: true,  // or { baseUrl: 'https://api.example.com/problems' }
})
```

Error response:

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
- Uses `@ProblemType(uri)` decorator for per-route type URIs, or auto-generates from `baseUrl` + error code
- Preserves extension members: `code`, `requestId`, `details` (validation errors), `meta.responseTime`
- Success responses are **not affected** — only error responses change format
- Use `@ApiSafeProblemResponse(status)` for Swagger documentation

## Rate Limit Metadata

Mirror rate limit response headers into the response body for frontend consumption.

```typescript
SafeResponseModule.register({
  rateLimit: true,  // reads X-RateLimit-* headers
})
```

Works with any rate limiter that sets standard headers (`@nestjs/throttler`, API gateways, custom middleware):

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "rateLimit": {
      "limit": 100,
      "remaining": 87,
      "reset": 1712025600
    }
  }
}
```

All three headers (`Limit`, `Remaining`, `Reset`) must be present; partial data is suppressed. Available in both success and error responses (including 429 Too Many Requests).

### Custom Header Prefix

```typescript
SafeResponseModule.register({
  rateLimit: { headerPrefix: 'RateLimit' },  // reads RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset
})
```
