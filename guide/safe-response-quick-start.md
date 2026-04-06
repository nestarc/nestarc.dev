---
description: "Add standardized API responses to a NestJS application in 5 minutes with @nestarc/safe-response — auto-wrapped success/error envelopes and Swagger integration."
---

# Quick Start: safe-response

Add consistent API response formatting to your entire NestJS application without modifying any controller or service code.

## Before & After

**Without safe-response** — every controller returns a different shape:

```typescript
// One endpoint returns raw data
@Get(':id')
findOne(@Param('id') id: string) {
  return this.usersService.findOne(id); // => { id: 1, name: "Alice" }
}

// Another wraps it manually
@Post()
create(@Body() dto: CreateUserDto) {
  const user = this.usersService.create(dto);
  return { success: true, data: user }; // inconsistent with findOne
}

// Errors are also inconsistent
@Delete(':id')
remove(@Param('id') id: string) {
  throw new NotFoundException('User not found'); // => { statusCode: 404, message: "..." }
}
```

**With safe-response** — every endpoint returns the same envelope automatically:

```json
// Success
{ "success": true, "statusCode": 200, "data": { "id": 1, "name": "Alice" }, "path": "/users/1" }

// Error
{ "success": false, "statusCode": 404, "error": { "code": "NOT_FOUND", "message": "User not found" }, "path": "/users/1" }
```

## Step 1: Install

```bash
npm install @nestarc/safe-response
```

## Step 2: Register the Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { SafeResponseModule } from '@nestarc/safe-response';

@Module({
  imports: [
    SafeResponseModule.register(),
  ],
})
export class AppModule {}
```

That's it. All routes now return standardized responses. **No changes to controllers or services required.**

## Step 3: Verify

```bash
# Success response
curl http://localhost:3000/users/1
```
```json
{
  "success": true,
  "statusCode": 200,
  "data": { "id": 1, "name": "Alice", "email": "alice@example.com" },
  "timestamp": "2026-04-06T10:00:00.000Z",
  "path": "/users/1"
}
```

```bash
# Error response
curl http://localhost:3000/users/999
```
```json
{
  "success": false,
  "statusCode": 404,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  },
  "timestamp": "2026-04-06T10:00:01.000Z",
  "path": "/users/999"
}
```

## Common Additions

### Add request ID tracking (recommended for production)

```typescript
SafeResponseModule.register({
  requestId: true,    // auto-generate UUID, or reuse X-Request-Id header
  responseTime: true, // include response time in meta
})
```

### Skip wrapping for specific routes

Health checks, file downloads, and SSE endpoints should return raw responses:

```typescript
import { RawResponse } from '@nestarc/safe-response';

@Get('health')
@RawResponse()
healthCheck() {
  return { status: 'ok' };
}
```

### Add Swagger documentation

```typescript
import { ApiSafeResponse } from '@nestarc/safe-response';

@Get(':id')
@ApiSafeResponse(UserDto)
findOne(@Param('id') id: string) {
  return this.usersService.findOne(id);
}
```

## Next Steps

- [Response Format](/packages/safe-response/response-format) — full envelope specification with request ID, response time, and RFC 9457
- [Error Codes](/packages/safe-response/error-codes) — default mappings and custom error codes
- [Swagger Integration](/packages/safe-response/swagger) — `@ApiSafeResponse()` and global error schemas
- [Adoption Roadmap](/guide/adoption-roadmap) — what to add next after safe-response
