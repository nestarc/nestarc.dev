---
description: "Prisma cursor and offset pagination for NestJS with 12 filter operators, sorting, search, and Swagger docs."
---

# @nestarc/pagination

Prisma cursor & offset pagination for NestJS with filtering, sorting, search, and Swagger auto-documentation.

## Features

- **Offset + cursor** pagination in a single API
- **12 filter operators**: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$ilike`, `$btw`, `$null`, `$not:null`
- **Multi-column sorting** with null positioning
- **Full-text search** across multiple columns
- **Column/operator whitelisting** for security
- **Swagger** auto-documentation (optional)
- **Standalone** `paginate()` function — works without NestJS
- Compatible with `@nestarc/tenancy` (RLS) and `@nestarc/soft-delete` via Prisma extension chain

## Quick Start

### Install

```bash
npm install @nestarc/pagination
```

Peer dependencies: `@nestjs/common`, `@nestjs/core`, `@prisma/client`, `reflect-metadata`, `rxjs`

### 1. Register the module

```typescript
import { PaginationModule } from '@nestarc/pagination';

@Module({
  imports: [
    PaginationModule.forRoot({
      defaultLimit: 20,
      maxLimit: 100,
    }),
  ],
})
export class AppModule {}
```

### 2. Use in a controller

```typescript
import { Paginate, PaginateQuery, ApiPaginatedResponse } from '@nestarc/pagination';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiPaginatedResponse(UserDto)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.userService.findAll(query);
  }
}
```

### 3. Use in a service

```typescript
import { paginate, PaginateQuery, PaginateConfig, Paginated } from '@nestarc/pagination';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.prisma.user, {
      sortableColumns: ['id', 'name', 'email', 'createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      searchableColumns: ['name', 'email'],
      filterableColumns: {
        role: ['$eq', '$in'],
        createdAt: ['$gte', '$lte'],
      },
    });
  }
}
```
