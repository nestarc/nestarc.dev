---
description: "Auto-document paginated endpoints in Swagger with @nestarc/pagination decorators and @nestjs/swagger."
---

# Swagger

Install the `@nestjs/swagger` major matching your NestJS application for auto-documentation. The integration is optional at runtime; the published 0.3.2 manifest does not declare a Swagger version range, so install it explicitly.

Register each response DTO with `@ApiExtraModels()`. The pagination decorators create a `$ref` to the DTO but do not register it in `components.schemas`:

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import {
  ApiCursorPaginatedResponse,
  ApiPaginatedResponse,
  Paginate,
  type PaginateQuery,
} from '@nestarc/pagination';

@ApiExtraModels(UserDto)
@Controller('users')
export class UserController {
  @Get()
  @ApiPaginatedResponse(UserDto)          // offset response schema
  async findAll(@Paginate() query: PaginateQuery) { ... }

  @Get('stream')
  @ApiCursorPaginatedResponse(UserDto)    // cursor response schema
  async findAllCursor(@Paginate() query: PaginateQuery) { ... }
}
```

Alternatively, pass `extraModels: [UserDto]` as the third argument to `SwaggerModule.createDocument()`. Ensure DTO properties have Swagger metadata, through `@ApiProperty()` or the Nest Swagger CLI plugin.

These decorators document response and query shapes; they do not select the runtime pagination strategy. Configure `paginationType: 'cursor'` for a cursor endpoint so its first request uses cursor mode even without `after` or `before`.

If `@nestjs/swagger` is not installed, decorators are no-ops.
