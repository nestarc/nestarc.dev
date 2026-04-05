# Error Codes

## Default Error Code Mapping

| HTTP Status | Error Code |
|-------------|------------|
| 400 | `BAD_REQUEST` |
| 401 | `UNAUTHORIZED` |
| 403 | `FORBIDDEN` |
| 404 | `NOT_FOUND` |
| 409 | `CONFLICT` |
| 422 | `UNPROCESSABLE_ENTITY` |
| 429 | `TOO_MANY_REQUESTS` |
| 500 | `INTERNAL_SERVER_ERROR` |

Override with `errorCodeMapper` option.

## Declarative Error Codes

For simple status-to-code mappings without a mapper function:

```typescript
SafeResponseModule.register({
  errorCodes: {
    404: 'RESOURCE_NOT_FOUND',
    409: 'DUPLICATE_ENTRY',
  },
})
```

Resolution order: `errorCodeMapper` > `errorCodes` > `DEFAULT_ERROR_CODE_MAP` > `'INTERNAL_SERVER_ERROR'`

## Custom Error Codes (`errorCodeMapper`)

```typescript
SafeResponseModule.register({
  errorCodeMapper: (exception) => {
    if (exception instanceof TokenExpiredError) return 'TOKEN_EXPIRED';
    return undefined;      // fall back to default mapping
  },
})
```

### Utility Functions

```typescript
import { lookupErrorCode, lookupProblemTitle } from '@nestarc/safe-response';

lookupErrorCode(404);      // 'NOT_FOUND'
lookupProblemTitle(404);   // 'Not Found'
```

### Shape-mismatch Warnings

When `@Paginated()`, `@CursorPaginated()`, `@SortMeta()`, or `@FilterMeta()` are applied but the handler returns data that doesn't match the expected shape, a `Logger.warn()` is emitted with the route and expected shape.

```typescript
SafeResponseModule.register({
  suppressWarnings: true,  // silence shape-mismatch warnings
})
```

## `@ApiSafeErrorResponse(status, options?)`

Documents an error response in Swagger with the `SafeErrorResponseDto` envelope. Error codes are auto-resolved from `DEFAULT_ERROR_CODE_MAP`.

```typescript
@Get(':id')
@ApiSafeResponse(UserDto)
@ApiSafeErrorResponse(404)
@ApiSafeErrorResponse(400, {
  code: 'VALIDATION_ERROR',
  message: 'Input validation failed',
  details: ['email must be an email'],
})
async findOne(@Param('id') id: string) {
  return this.usersService.findOne(id);
}
```

Options: `description`, `code`, `message`, `details`

> **Note:** This decorator generates build-time Swagger metadata only. If you use a custom `errorCodeMapper` at runtime, the decorator cannot reflect those dynamic codes automatically — pass the `code` option explicitly to match your runtime mapping.

The `details` field schema is automatically inferred from the example value:
- Array → `{ type: 'array', items: { type } }` (item type inferred from first element: object, number, or string)
- `object` → `{ type: 'object' }`
- `string` → `{ type: 'string' }`

## `@ApiSafeErrorResponses(configs)`

Documents multiple error responses at once. Accepts an array of status codes or config objects.

```typescript
@Post()
@ApiSafeResponse(UserDto, { statusCode: 201 })
@ApiSafeErrorResponses([400, 401, 409])
async create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}

// With mixed configuration
@Post('register')
@ApiSafeErrorResponses([
  400,
  { status: 401, description: 'Token expired' },
  { status: 409, code: 'EMAIL_TAKEN', message: 'Email already registered' },
])
async register(@Body() dto: RegisterDto) {
  return this.authService.register(dto);
}
```

## Global Error Swagger Documentation (`applyGlobalErrors`)

Inject common error responses (e.g., 401, 403, 500) into all OpenAPI operations at once, instead of decorating every route.

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { applyGlobalErrors, SafeResponseModule } from '@nestarc/safe-response';

// 1. Register with swagger option
SafeResponseModule.register({
  swagger: { globalErrors: [401, 403, { status: 500, message: 'Unexpected error' }] },
});

// 2. Apply after document creation
const config = new DocumentBuilder().setTitle('My API').build();
const document = SwaggerModule.createDocument(app, config);
applyGlobalErrors(document, moduleOptions);  // mutates document in-place
SwaggerModule.setup('api', app, document);
```

Use `@SkipGlobalErrors()` on routes that should not receive global error schemas.
