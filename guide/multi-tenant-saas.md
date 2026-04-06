---
description: "Build a multi-tenant task management API from scratch using @nestarc/tenancy and PostgreSQL Row Level Security."
---

# Building a Multi-tenant SaaS from Scratch

This guide walks through building a multi-tenant **task management API** using `@nestarc/tenancy` and `@nestarc/safe-response`. By the end, you will have a fully isolated, production-ready backend where PostgreSQL Row Level Security enforces tenant boundaries and every API response follows a standardized envelope.

## What We Are Building

A REST API with:

- **Users** and **Tasks**, each scoped to a `tenant_id`
- PostgreSQL RLS so one tenant can never see another's data
- A header-based tenant extractor (`X-Tenant-Id`)
- Auto-injected `tenant_id` on create operations
- Standardized JSON responses with pagination, error codes, and Swagger docs
- Tests that prove tenant isolation works

```
Request (X-Tenant-Id: acme-uuid)
  -> TenantMiddleware (extract + validate)
    -> AsyncLocalStorage (store tenant context)
      -> TenancyGuard (reject if missing)
        -> TasksController
          -> Prisma Extension (set_config + query)
            -> PostgreSQL RLS (row filtering)
              -> SafeResponseInterceptor (wrap response)
```

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| NestJS | 10 or 11 |
| Prisma | 5 or 6 |
| PostgreSQL | 14+ (with RLS support) |

## Step 1 -- Install Dependencies

```bash
npm install @nestarc/tenancy @nestarc/safe-response
npm install @nestjs/common @nestjs/core @nestjs/swagger @prisma/client
npm install -D prisma
```

## Step 2 -- Prisma Schema

Define the `User` and `Task` models. Both include a `tenant_id` column that ties every row to a specific tenant.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  tenantId  String   @map("tenant_id")
  email     String
  name      String
  tasks     Task[]
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([tenantId])
  @@map("users")
}

model Task {
  id          String   @id @default(uuid())
  tenantId    String   @map("tenant_id")
  title       String
  description String?
  status      String   @default("todo")
  userId      String   @map("user_id")
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([tenantId])
  @@map("tasks")
}
```

Run the migration:

```bash
npx prisma migrate dev --name init
```

## Step 3 -- RLS Setup

After the migration creates the tables, apply RLS policies. This is the critical security layer -- PostgreSQL itself enforces tenant isolation, not your application code.

```sql
-- ============================================
-- RLS for users table
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant', true)::text);

CREATE POLICY tenant_insert ON users
  FOR INSERT
  WITH CHECK (tenant_id = current_setting('app.current_tenant', true)::text);

-- ============================================
-- RLS for tasks table
-- ============================================
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON tasks
  USING (tenant_id = current_setting('app.current_tenant', true)::text);

CREATE POLICY tenant_insert ON tasks
  FOR INSERT
  WITH CHECK (tenant_id = current_setting('app.current_tenant', true)::text);
```

::: warning Database Role Matters
RLS is bypassed by superusers and table owners. Create a dedicated application role that does **not** own the tables:

```sql
CREATE ROLE app_user LOGIN PASSWORD 'your_password';
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON tasks TO app_user;
```

Use this role's connection string in `DATABASE_URL`. If you connect as a superuser, RLS policies are silently bypassed.
:::

::: tip CLI Scaffolding
You can generate these SQL policies automatically from your Prisma schema:

```bash
npx @nestarc/tenancy init
```

Use `npx @nestarc/tenancy check` later to detect drift between your SQL and Prisma schema.
:::

## Step 4 -- Tenancy Module

Register `TenancyModule.forRoot()` in your root module. The `tenantExtractor` option accepts a header name string as a shorthand for `HeaderTenantExtractor`.

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TenancyModule } from '@nestarc/tenancy';
import { SafeResponseModule } from '@nestarc/safe-response';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id',
      onTenantNotFound: (req) => {
        throw new ForbiddenException('Tenant header is required');
      },
    }),
    SafeResponseModule.register({
      timestamp: true,
      path: true,
      requestId: true,
    }),
    PrismaModule,
    TasksModule,
  ],
})
export class AppModule {}
```

::: tip Async Configuration
For production, load the header name from environment variables:

```typescript
TenancyModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    tenantExtractor: config.get('TENANT_HEADER', 'X-Tenant-Id'),
  }),
})
```
:::

## Step 5 -- PrismaService with Tenancy Extension

The Prisma client extension calls `set_config('app.current_tenant', tenantId)` inside a batch transaction before every query. PostgreSQL RLS reads this value to filter rows.

```typescript
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenancyService, createPrismaTenancyExtension } from '@nestarc/tenancy';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client;

  constructor(private readonly tenancyService: TenancyService) {
    const prisma = new PrismaClient();
    this.client = prisma.$extends(
      createPrismaTenancyExtension(tenancyService, {
        autoInjectTenantId: true,
        tenantIdField: 'tenant_id',
      }),
    );
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
```

```typescript
// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

The key extension options:

| Option | Value | Effect |
|--------|-------|--------|
| `autoInjectTenantId` | `true` | Automatically sets `tenant_id` on `create`, `createMany`, and `upsert` |
| `tenantIdField` | `'tenant_id'` | Column name to inject into (matches our Prisma `@map`) |

With `autoInjectTenantId` enabled, you never need to manually pass `tenant_id` in your `create` calls -- the extension handles it.

## Step 6 -- Safe Response Setup

`SafeResponseModule.register()` is already imported in `AppModule` above. Here is a closer look at what it does and how to configure it for this project.

```typescript
// Already in app.module.ts
SafeResponseModule.register({
  timestamp: true,     // adds "timestamp" to every response
  path: true,          // adds "path" to every response
  requestId: true,     // reads X-Request-Id or generates UUID v4
})
```

Every successful response is wrapped automatically:

```json
{
  "success": true,
  "statusCode": 200,
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "data": { "id": "...", "title": "..." },
  "timestamp": "2026-04-05T12:00:00.000Z",
  "path": "/tasks"
}
```

Errors are standardized too:

```json
{
  "success": false,
  "statusCode": 404,
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "error": {
    "code": "NOT_FOUND",
    "message": "Task not found"
  },
  "timestamp": "2026-04-05T12:00:00.000Z",
  "path": "/tasks/nonexistent-id"
}
```

## Step 7 -- DTOs

Define the DTOs for Swagger documentation and validation.

```typescript
// src/tasks/dto/create-task.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement login page' })
  @IsString()
  title: string;

  @ApiProperty({ required: false, example: 'Build the login form with OAuth' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'user-uuid-here' })
  @IsString()
  userId: string;
}
```

```typescript
// src/tasks/dto/update-task.dto.ts
import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Updated title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ['todo', 'in_progress', 'done'] })
  @IsOptional()
  @IsIn(['todo', 'in_progress', 'done'])
  status?: string;
}
```

```typescript
// src/tasks/dto/task.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description: string | null;

  @ApiProperty({ enum: ['todo', 'in_progress', 'done'] })
  status: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
```

## Step 8 -- Controller and Service

Now wire everything together. The service uses plain Prisma calls -- RLS does the filtering. The controller uses `@ApiSafeResponse` and `@Paginated` from `@nestarc/safe-response` for Swagger docs and pagination metadata.

```typescript
// src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number, limit: number) {
    const [items, total] = await Promise.all([
      this.prisma.client.task.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.task.count(),
    ]);

    return { data: items, total, page, limit };
  }

  async findOne(id: string) {
    const task = await this.prisma.client.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async create(dto: CreateTaskDto) {
    // tenant_id is auto-injected by the Prisma extension
    return this.prisma.client.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        userId: dto.userId,
      },
    });
  }

  async update(id: string, dto: UpdateTaskDto) {
    // RLS ensures we can only update our own tenant's tasks
    await this.findOne(id);

    return this.prisma.client.task.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.client.task.delete({
      where: { id },
    });
  }
}
```

```typescript
// src/tasks/tasks.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiSafeResponse,
  ApiPaginatedSafeResponse,
  ApiSafeErrorResponse,
  Paginated,
} from '@nestarc/safe-response';
import { CurrentTenant } from '@nestarc/tenancy';
import { TasksService } from './tasks.service';
import { TaskDto } from './dto/task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @Paginated({ maxLimit: 100 })
  @ApiPaginatedSafeResponse(TaskDto)
  @ApiSafeErrorResponse(403)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.tasksService.findAll(page, limit);
  }

  @Get(':id')
  @ApiSafeResponse(TaskDto)
  @ApiSafeErrorResponse(404)
  @ApiSafeErrorResponse(403)
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @ApiSafeResponse(TaskDto, { statusCode: 201 })
  @ApiSafeErrorResponse(400)
  @ApiSafeErrorResponse(403)
  create(@Body() dto: CreateTaskDto, @CurrentTenant() tenantId: string) {
    return this.tasksService.create(dto);
  }

  @Patch(':id')
  @ApiSafeResponse(TaskDto)
  @ApiSafeErrorResponse(400)
  @ApiSafeErrorResponse(404)
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiSafeErrorResponse(404)
  @ApiSafeErrorResponse(403)
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
```

```typescript
// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

Notice that `TasksService` never references `tenant_id` directly. The Prisma tenancy extension handles `set_config()` before every query, and `autoInjectTenantId` injects it on create operations. RLS filters everything else.

## Step 9 -- Running It

```bash
curl -H "X-Tenant-Id: 550e8400-e29b-41d4-a716-446655440000" \
     -H "Content-Type: application/json" \
     -d '{"title": "Set up CI pipeline", "userId": "user-uuid"}' \
     http://localhost:3000/tasks
```

Response:

```json
{
  "success": true,
  "statusCode": 201,
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "data": {
    "id": "generated-task-uuid",
    "title": "Set up CI pipeline",
    "description": null,
    "status": "todo",
    "userId": "user-uuid",
    "createdAt": "2026-04-05T10:30:00.000Z",
    "updatedAt": "2026-04-05T10:30:00.000Z"
  },
  "timestamp": "2026-04-05T10:30:00.000Z",
  "path": "/tasks"
}
```

Querying with a different tenant header returns only that tenant's data -- guaranteed by PostgreSQL, not your application code.

## Step 10 -- Testing

`@nestarc/tenancy/testing` provides utilities that let you set the tenant context in tests without HTTP middleware or guards.

### Unit / Integration Tests

```typescript
// test/tasks.service.spec.ts
import { Test } from '@nestjs/testing';
import { TestTenancyModule, withTenant } from '@nestarc/tenancy/testing';
import { TasksService } from '../src/tasks/tasks.service';
import { PrismaModule } from '../src/prisma/prisma.module';

describe('TasksService', () => {
  let service: TasksService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TestTenancyModule.register(), PrismaModule],
      providers: [TasksService],
    }).compile();

    service = module.get(TasksService);
  });

  it('should only return tasks for the current tenant', async () => {
    const tenantA = '11111111-1111-1111-1111-111111111111';
    const tenantB = '22222222-2222-2222-2222-222222222222';

    // Create a task as tenant A
    await withTenant(tenantA, () =>
      service.create({ title: 'Tenant A task', userId: 'user-a' }),
    );

    // Create a task as tenant B
    await withTenant(tenantB, () =>
      service.create({ title: 'Tenant B task', userId: 'user-b' }),
    );

    // Tenant A should only see their own task
    const tenantATasks = await withTenant(tenantA, () =>
      service.findAll(1, 100),
    );
    expect(tenantATasks.data.every((t) => t.title !== 'Tenant B task')).toBe(
      true,
    );

    // Tenant B should only see their own task
    const tenantBTasks = await withTenant(tenantB, () =>
      service.findAll(1, 100),
    );
    expect(tenantBTasks.data.every((t) => t.title !== 'Tenant A task')).toBe(
      true,
    );
  });
});
```

### Isolation Assertion

For a quick smoke test that proves cross-tenant data cannot leak, use `expectTenantIsolation`:

```typescript
import { expectTenantIsolation } from '@nestarc/tenancy/testing';

it('should enforce strict tenant isolation', async () => {
  await expectTenantIsolation(
    prisma.client.task,
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
  );
});
```

This helper creates a record in tenant A, then queries as tenant B and asserts zero results.

### E2E Tests

For full HTTP-level tests, send the `X-Tenant-Id` header directly:

```typescript
// test/tasks.e2e-spec.ts
import * as request from 'supertest';

const TENANT_A = '11111111-1111-1111-1111-111111111111';
const TENANT_B = '22222222-2222-2222-2222-222222222222';

describe('Tasks (e2e)', () => {
  it('POST /tasks should create a task scoped to tenant', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('X-Tenant-Id', TENANT_A)
      .send({ title: 'E2E Task', userId: 'user-a' })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('E2E Task');
  });

  it('GET /tasks should not leak data across tenants', async () => {
    // Tenant B should not see Tenant A's task
    const res = await request(app.getHttpServer())
      .get('/tasks')
      .set('X-Tenant-Id', TENANT_B)
      .expect(200);

    expect(res.body.data).toHaveLength(0);
  });

  it('should return 403 without X-Tenant-Id header', async () => {
    const res = await request(app.getHttpServer())
      .get('/tasks')
      .expect(403);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });
});
```

## Step 11 -- Health Check Without Tenant

Use `@BypassTenancy()` for routes that should work without a tenant header:

```typescript
import { Controller, Get } from '@nestjs/common';
import { BypassTenancy } from '@nestarc/tenancy';
import { RawResponse } from '@nestarc/safe-response';

@Controller('health')
export class HealthController {
  @BypassTenancy()
  @RawResponse()
  @Get()
  check() {
    return { status: 'ok' };
  }
}
```

`@BypassTenancy()` skips the `TenancyGuard` check, and `@RawResponse()` skips the safe-response wrapper -- useful for load balancer health checks that expect a plain JSON body.

## Next Steps

This guide covered the core loop: schema, RLS, tenancy module, Prisma extension, safe responses, CRUD, and testing. Here are the natural next additions:

- **[Adding Audit Trail](/guide/audit-trail)** -- track who created, updated, and deleted records with `@nestarc/audit-log`
- **[Feature Flags for Gradual Rollout](/guide/feature-flags-rollout)** -- gate new features per tenant with `@nestarc/feature-flag`
- **[Prisma Extension Chaining](/guide/prisma-extension-chaining)** -- compose tenancy, soft-delete, and audit-log extensions on a single Prisma client
- **Soft Delete** -- replace hard deletes with `@nestarc/soft-delete` for recoverable data
- **Pagination** -- add cursor-based pagination with `@nestarc/pagination` for large datasets

::: tip Production Checklist
Before going live, review these security considerations:

1. **Database role** -- never connect as a superuser; use a dedicated app role
2. **Tenant ID validation** -- the default UUID validator covers most cases, but customize `validateTenantId` if your IDs have a different format
3. **Trust boundary** -- the `X-Tenant-Id` header is client-supplied; cross-validate against a JWT claim using `crossCheckExtractor` or verify in `onTenantResolved`
4. **Fail-closed mode** -- enable `failClosed: true` in `createPrismaTenancyExtension` to block queries when no tenant context is set, preventing accidental data exposure if RLS is misconfigured
:::
