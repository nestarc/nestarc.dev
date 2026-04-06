---
description: "Install @nestarc/pagination and register PaginationModule in your NestJS application."
---

# Installation

```bash
npm install @nestarc/pagination
```

Peer dependencies: `@nestjs/common`, `@nestjs/core`, `@prisma/client`, `reflect-metadata`, `rxjs`

## Module Options

### forRoot

```typescript
PaginationModule.forRoot({
  defaultLimit: 20,
  maxLimit: 100,
  defaultPaginationType: 'offset',
  defaultSortBy: [['createdAt', 'DESC']],
})
```

### forRootAsync

```typescript
PaginationModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    defaultLimit: config.get('PAGINATION_DEFAULT_LIMIT', 20),
    maxLimit: config.get('PAGINATION_MAX_LIMIT', 100),
  }),
  inject: [ConfigService],
})
```

## PaginateService

`PaginateService` merges module options, `@PaginateDefaults` metadata, and per-endpoint config (highest priority wins):

```typescript
@Controller('users')
export class UserController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginateService: PaginateService,
  ) {}

  @Get()
  @PaginateDefaults({ defaultLimit: 10, maxLimit: 50 })
  async findAll(@Paginate() query: PaginateQuery) {
    return this.paginateService.paginate(
      query,
      this.prisma.user,
      { sortableColumns: ['id', 'name', 'createdAt'] },
      this.findAll,
    );
  }
}
```

Priority: `config` (per-endpoint) > `@PaginateDefaults` (per-handler) > `forRoot()` (global)

## PaginateConfig

```typescript
const config: PaginateConfig<User> = {
  // Required
  sortableColumns: ['id', 'name', 'email', 'createdAt'],

  // Sorting
  defaultSortBy: [['createdAt', 'DESC']],
  nullSort: 'last',

  // Search
  searchableColumns: ['name', 'email'],

  // Filtering
  filterableColumns: {
    role: ['$eq', '$in'],
    age: ['$gt', '$gte', '$lt', '$lte'],
    createdAt: ['$gte', '$lte', '$btw'],
  },

  // Relations (Prisma include)
  relations: { profile: true },

  // Column selection (Prisma select)
  select: ['id', 'name', 'email'],

  // Pagination
  paginationType: 'offset',     // 'offset' | 'cursor'
  cursorColumn: 'id',            // default: 'id'
  defaultLimit: 20,
  maxLimit: 100,
  withTotalCount: false,         // cursor mode: include total count

  // Base where condition
  where: { isActive: true },
};
```

> When both `select` and `relations` are set, relations are merged into the select object to avoid Prisma's include/select conflict.

## Standalone Usage

`paginate()` works without NestJS:

```typescript
import { paginate } from '@nestarc/pagination';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const result = await paginate(
  { page: 1, limit: 20, path: '/users' },
  prisma.user,
  { sortableColumns: ['id', 'name', 'createdAt'] },
);
```

## Testing Utilities

```typescript
import { createPaginateQuery, TestPaginationModule } from '@nestarc/pagination/testing';

// Test module
const module = await Test.createTestingModule({
  imports: [TestPaginationModule.register({ defaultLimit: 10 })],
  providers: [UserService],
}).compile();

// Query factory
const query = createPaginateQuery({
  page: 1,
  limit: 10,
  sortBy: [['createdAt', 'DESC']],
  path: '/users',
});
```
