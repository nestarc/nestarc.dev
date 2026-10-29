---
description: "Install @nestarc/pagination and register PaginationModule in your NestJS application."
---

# Installation

```bash
npm install @nestarc/pagination@0.3.2
```

Peer dependencies: `@nestjs/common`, `@nestjs/core`, `@prisma/client` 5/6/7, `reflect-metadata`, `rxjs`

Prisma 7 is the primary development and CI target. For a direct PostgreSQL connection, install `@prisma/adapter-pg` and `pg`, configure the `prisma-client` generator and `prisma.config.ts`, and import from your generated output. See [Prisma 7 Setup](/guide/prisma-7).

## Upgrading to 0.3.2

Version 0.3.2 includes the 0.3.1 keyset fixes and corrects offset navigation when totals are omitted. The [published release changelog](https://github.com/nestarc/nestjs-pagination/blob/09b8cf8cb7aea22b5ad7a603404d6c41fcd2f14a/CHANGELOG.md) records the source and migration details.

- With `countStrategy: 'none'`, offset pagination fetches one extra row to decide whether `links.next` exists and returns at most the requested limit. `totalItems` and `totalPages` are omitted, and `links.last` is always `null`. Its public TypeScript type is now `string | null`; check it before rendering or following a last-page link.
- Keyset `before` requests return the immediately preceding page in the requested order. Cursors include every effective sort column; restart from the first page if a saved older cursor lacks a sort value. Send only one of `after` or `before` per request; supplying both returns HTTP 400.
- Keyset exact/custom totals describe the entire result set matching the base conditions, filters, and search, rather than the rows remaining after the cursor. Calls through `PaginateService` now apply module-level `withTotalCount`; override it per endpoint with `withTotalCount: false` or `countStrategy: 'none'` when totals are unnecessary.

The unused `withLinks` and `fieldNamingStrategy` module options are deprecated: links remain included and metadata remains camelCase. The [benchmark measurements](./benchmark) remain the historical 0.3.0 results, not a new 0.3.2 performance claim.

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

Pass the decorated handler as the fourth argument when using `@PaginateDefaults`, as above. Module defaults apply only through the injected service; calling the standalone function does not read Nest's module configuration.

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
  cursorStrategy: 'prisma',      // 'prisma' | 'keyset'
  defaultLimit: 20,
  maxLimit: 100,
  withTotalCount: false,         // cursor mode: include total count
  countStrategy: 'exact',        // 'exact' | 'none' | 'custom'; takes precedence

  // Base where condition
  where: { isActive: true },
};
```

> When both `select` and `relations` are set, relations are merged into the select object to avoid Prisma's include/select conflict.

An explicit `countStrategy` takes precedence over `withTotalCount`. Without one, offset requests count by default; cursor requests count only when `withTotalCount` is enabled. Use `countStrategy: 'none'` for count-free traversal or `countStrategy: 'custom'` with a `countQuery` callback for application-owned totals. For non-unique sorting, follow the [keyset configuration](./offset-vs-cursor#keyset-cursors-for-non-unique-ordering) and include a unique tie-breaker.

## Standalone Usage

`paginate()` works without creating a Nest application or registering a NestJS module. The package still imports its NestJS peers, so keep the required peer dependencies installed. Pass endpoint limits and ordering explicitly; this function does not inherit `PaginationModule` options:

```typescript
import { paginate } from '@nestarc/pagination';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const result = await paginate(
  { page: 1, limit: 20, path: '/users' },
  prisma.user,
  {
    sortableColumns: ['id', 'name', 'createdAt'],
    defaultSortBy: [['createdAt', 'DESC'], ['id', 'DESC']],
    paginationType: 'offset',
    defaultLimit: 20,
    maxLimit: 100,
  },
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
