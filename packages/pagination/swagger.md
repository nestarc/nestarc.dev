---
description: "Auto-document paginated endpoints in Swagger with @nestarc/pagination decorators and @nestjs/swagger."
---

# Swagger

Install `@nestjs/swagger` (optional peer dependency) for auto-documentation:

```typescript
@Get()
@ApiPaginatedResponse(UserDto)          // offset response schema
async findAll(@Paginate() query: PaginateQuery) { ... }

@Get('stream')
@ApiCursorPaginatedResponse(UserDto)    // cursor response schema
async findAllCursor(@Paginate() query: PaginateQuery) { ... }
```

If `@nestjs/swagger` is not installed, decorators are no-ops.
