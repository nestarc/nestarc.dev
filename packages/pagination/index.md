---
description: "Prisma cursor and offset pagination for NestJS with 12 filter operators, sorting, search, and Swagger docs."
---

# @nestarc/pagination

Prisma cursor & offset pagination for NestJS with filtering, sorting, search, and Swagger auto-documentation.

This guide targets **0.3.2**. Existing users should read the [upgrade notes](./installation#upgrading-to-0-3-2), including nullable `links.last` when counts are omitted.

Choosing between the two modes? Read the measured [cursor vs offset pagination comparison for Prisma](/blog/cursor-vs-offset-pagination-prisma) before setting a default for your endpoints.

For feeds ordered by `createdAt`, start with the [keyset cursor example](./offset-vs-cursor#keyset-cursors-for-non-unique-ordering). Use [offset pagination](./offset-vs-cursor#offset) when users need numbered pages, and [install the module](./installation) before adding either endpoint.

## Features

- **Offset + cursor** pagination in a single API
- **Keyset cursors** for stable pagination on non-unique sort columns with tie-breakers
- **Count strategies** — exact, omitted, or custom totals for cost-aware queries
- **12 filter operators**: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$ilike`, `$btw`, `$null`, `$not:null`
- **Multi-column sorting** with null positioning
- **Case-insensitive contains search** across multiple columns
- **Column/operator whitelisting** for security
- **Swagger** auto-documentation (optional)
- **Standalone** `paginate()` function — callable without creating a Nest application; the package's NestJS peers are still required
- **Prisma 7-first** compatibility, with Prisma 5 and 6 retained in the peer range
- Compatible with `@nestarc/tenancy` (RLS) and `@nestarc/soft-delete` via Prisma extension chain

## Quick Start

### Install

```bash
npm install @nestarc/pagination@0.3.2
```

Peer dependencies: `@nestjs/common`, `@nestjs/core`, `@prisma/client` 5/6/7, `reflect-metadata`, `rxjs`

Prisma 7 is the primary generated-client and CI target. Prisma 5 and 6 remain accepted peer versions for existing applications.

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
import { ApiExtraModels } from '@nestjs/swagger';

@Controller('users')
@ApiExtraModels(UserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiPaginatedResponse(UserDto)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.userService.findAll(query);
  }
}
```

For Swagger output, install `@nestjs/swagger` and register the response DTO with `@ApiExtraModels()` as above. The pagination decorator references that model's schema; see [Swagger setup](./swagger).

### 3. Use in a service

```typescript
import { PaginateService, PaginateQuery } from '@nestarc/pagination';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginateService,
  ) {}

  async findAll(query: PaginateQuery) {
    return this.pagination.paginate(query, this.prisma.user, {
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

The injected `PaginateService` applies the defaults registered with `PaginationModule`. Standalone `paginate()` only uses the configuration passed to that call and the library's built-in defaults; see [standalone usage](./installation#standalone-usage).
