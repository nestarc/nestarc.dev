---
title: "Multi-Tenant NestJS with Prisma and PostgreSQL RLS"
description: "Build a multi-tenant NestJS API with Prisma, PostgreSQL Row Level Security, tenant context, safe responses, and isolation tests."
---

# Multi-Tenant NestJS SaaS with Prisma and PostgreSQL RLS

This guide walks through building a multi-tenant **task management API** using `@nestarc/tenancy` and `@nestarc/safe-response`. By the end, you will have a production-oriented foundation where PostgreSQL Row Level Security enforces tenant boundaries through a restricted runtime role and every API response follows a standardized envelope.

Before implementing the happy path, review the [NestJS multi-tenancy pitfalls that cause cross-tenant data leaks](/blog/nestjs-multi-tenancy-pitfalls) and the current [`@nestarc/tenancy` package contract](/packages/tenancy/).

## What We Are Building

A REST API with:

- **Users** and **Tasks**, each scoped to a Prisma `tenantId` field mapped to a `tenant_id` column
- PostgreSQL RLS so one tenant can never see another's data
- A header-based tenant extractor (`X-Tenant-Id`)
- Context-derived `tenantId` on typed writes, with runtime overwrite by the tenancy extension
- Standardized JSON responses with pagination, error codes, and Swagger docs
- Tests that prove tenant isolation works

```
Request (X-Tenant-Id: 550e8400-e29b-41d4-a716-446655440000)
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
| Node.js | `^20.19.0`, `^22.12.0`, or `>=24.0.0` |
| NestJS | 10 or 11 |
| Prisma | 7 |
| PostgreSQL | 14+ (with RLS support) |

## Step 1 -- Install Dependencies

```bash
npm install @nestarc/tenancy @nestarc/safe-response
npm install @prisma/client @prisma/adapter-pg pg dotenv
npm install @nestjs/config @nestjs/swagger class-transformer class-validator
npm install --save-dev prisma supertest @types/supertest
```

This guide starts from an existing NestJS 10 or 11 application. Keep `@nestjs/testing` on the same major version as the rest of your NestJS dependencies.

## Step 2 -- Prisma Schema

Define the `User` and `Task` models. In application code the field is named `tenantId`; `@map("tenant_id")` maps it to the database column used by the RLS policies.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String   @id @default(uuid())
  tenantId  String   @map("tenant_id")
  email     String
  name      String
  tasks     Task[]
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@unique([tenantId, id])
  @@map("users")
}

model Task {
  id          String   @id @default(uuid())
  tenantId    String   @map("tenant_id")
  title       String
  description String?
  status      String   @default("todo")
  userId      String   @map("user_id")
  user        User     @relation(fields: [tenantId, userId], references: [tenantId, id])
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([tenantId, userId])
  @@map("tasks")
}
```

The composite relation requires a task and its user to share the same tenant. The leftmost `tenantId` in the composite indexes also supports tenant-scoped lookups.

Prisma 7 reads the CLI datasource URL from Prisma Config. Keep the schema-owner connection used by migrations separate from the non-owner application connection used at runtime:

```dotenv
# .env
MIGRATION_DATABASE_URL="postgresql://schema_owner:owner_password@localhost:5432/tenant_tasks"
DATABASE_URL="postgresql://app_user:your_password@localhost:5432/tenant_tasks"
```

```typescript
// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: env('MIGRATION_DATABASE_URL') },
});
```

`schema_owner` must already own the target database or schema. A database administrator or provisioning process creates the `app_user` role referenced by the runtime URL in Step 3; ordinary schema-owner credentials might not have PostgreSQL `CREATEROLE` privilege.

Run the migration and generate the client at the configured output path:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Step 3 -- RLS Setup

After the migration creates the tables, apply RLS policies. This is the critical security layer -- PostgreSQL itself enforces tenant isolation, not your application code.

Create a new migration rather than editing the already-applied `init` migration:

```bash
npx prisma migrate dev --create-only --name enable-rls
```

Append these statements to the new migration's `migration.sql`, then apply it. Keeping RLS in its own checked-in migration avoids checksum drift on the applied init migration.

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

```bash
npx prisma migrate dev
```

::: warning Database Role Matters
Superusers and roles with `BYPASSRLS` always bypass RLS; table owners also bypass it unless `FORCE ROW LEVEL SECURITY` is enabled. Have a database administrator or provisioning process create a dedicated runtime role that does **not** own the tables. `CREATE ROLE` requires `CREATEROLE` (or superuser) privilege; the migration owner only needs to apply the RLS policies and grants afterward:

```sql
CREATE ROLE app_user LOGIN NOSUPERUSER NOBYPASSRLS PASSWORD 'your_password';
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON users, tasks TO app_user;
```

Use this role's connection string in `DATABASE_URL`; Prisma Config continues to use `MIGRATION_DATABASE_URL` for migrations. Never use a superuser or `BYPASSRLS` role for the application connection.
:::

::: tip CLI Scaffolding
You can generate these SQL policies automatically from your Prisma schema:

```bash
npx @nestarc/tenancy init
```

Use `npx @nestarc/tenancy check` later to detect drift between your SQL and Prisma schema.
:::

## Step 4 -- Tenancy Module

Register `TenancyModule.forRoot()` in your root module. The `tenantExtractor` option accepts a header name string as a shorthand for `HeaderTenantExtractor`. The guard rejects missing tenant IDs by default, while routes marked with `@BypassTenancy()` remain reachable without the header.

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
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TenancyModule } from '@nestarc/tenancy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TenancyModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        tenantExtractor: config.get('TENANT_HEADER', 'X-Tenant-Id'),
      }),
    }),
  ],
})
export class AppModule {}
```
:::

## Step 5 -- PrismaService with Tenancy Extension

The Prisma client extension calls `set_config('app.current_tenant', tenantId)` inside a batch transaction before every query. PostgreSQL RLS reads this value to filter rows.

```typescript
// src/prisma/prisma.service.ts
import 'dotenv/config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { TenancyService, createPrismaTenancyExtension } from '@nestarc/tenancy';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client;

  constructor(private readonly tenancyService: TenancyService) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    const basePrisma = new PrismaClient({ adapter });
    this.client = basePrisma.$extends(
      createPrismaTenancyExtension(tenancyService, {
        autoInjectTenantId: true,
        // Use the Prisma field name; @map("tenant_id") handles the SQL column.
        tenantIdField: 'tenantId',
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
| `autoInjectTenantId` | `true` | Automatically sets the tenant field on `create`, `createMany`, `createManyAndReturn`, and `upsert` |
| `tenantIdField` | `'tenantId'` | Prisma field to inject; `@map("tenant_id")` handles the SQL column name |

`autoInjectTenantId` overwrites runtime write arguments, but it does not make Prisma's generated `tenantId` input optional. Type-safe create code must still read the resolved value from `TenancyService` and include it, as shown below.

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

Enable validation and publish the generated OpenAPI document in your bootstrap file:

```typescript
// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Multi-tenant Tasks API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}

bootstrap();
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
  tenantId: string;

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
import { TenancyService } from '@nestarc/tenancy';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

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
    const tenantId = this.tenancy.getCurrentTenantOrThrow();
    return this.prisma.client.task.create({
      data: {
        tenantId,
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
  create(@Body() dto: CreateTaskDto) {
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

`TasksService` reads `tenantId` from `TenancyService`, never from the request body. Prisma's generated create input therefore remains type-safe, while `autoInjectTenantId` overwrites the same field at runtime to prevent body-level tenant spoofing. Authenticate or cross-check header-derived context in production. The extension also handles `set_config()` before every query; PostgreSQL sees the mapped `tenant_id` column and RLS filters everything else.

## Step 9 -- Running It

The task schema requires a valid user. Seed one through the runtime connection while the same tenant context is active:

```bash
export DATABASE_URL='postgresql://app_user:your_password@localhost:5432/tenant_tasks'
psql "$DATABASE_URL"
```

`psql` does not load `.env` automatically. Export the restricted runtime URL explicitly (or retrieve it from your secret manager) before this check; do not substitute the schema-owner migration URL.

```sql
BEGIN;
SELECT set_config(
  'app.current_tenant',
  '550e8400-e29b-41d4-a716-446655440000',
  true
);
INSERT INTO users (id, tenant_id, email, name, created_at, updated_at)
VALUES (
  'user-uuid',
  '550e8400-e29b-41d4-a716-446655440000',
  'owner@example.com',
  'Example Owner',
  NOW(),
  NOW()
);
COMMIT;
```

Start the NestJS application, then create a task for that user:

```bash
npm run start:dev
```

```bash
curl -X POST -H "X-Tenant-Id: 550e8400-e29b-41d4-a716-446655440000" \
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
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
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
import { Test, TestingModule } from '@nestjs/testing';
import { TestTenancyModule, withTenant } from '@nestarc/tenancy/testing';
import { TasksService } from '../src/tasks/tasks.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('TasksService', () => {
  const tenantA = '11111111-1111-4111-8111-111111111111';
  const tenantB = '22222222-2222-4222-8222-222222222222';

  let moduleRef: TestingModule;
  let service: TasksService;
  let prisma: PrismaService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [TestTenancyModule.register(), PrismaModule],
      providers: [TasksService],
    }).compile();

    service = moduleRef.get(TasksService);
    prisma = moduleRef.get(PrismaService);

    await withTenant(tenantA, async () => {
      await prisma.client.user.upsert({
        where: { id: 'user-a' },
        update: { email: 'a@example.com', name: 'Tenant A User' },
        create: {
          id: 'user-a',
          tenantId: tenantA,
          email: 'a@example.com',
          name: 'Tenant A User',
        },
      });
      await service.create({ title: 'Tenant A task', userId: 'user-a' });
    });

    await withTenant(tenantB, async () => {
      await prisma.client.user.upsert({
        where: { id: 'user-b' },
        update: { email: 'b@example.com', name: 'Tenant B User' },
        create: {
          id: 'user-b',
          tenantId: tenantB,
          email: 'b@example.com',
          name: 'Tenant B User',
        },
      });
      await service.create({ title: 'Tenant B task', userId: 'user-b' });
    });
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should only return tasks for the current tenant', async () => {
    const tenantATasks = await withTenant(tenantA, () =>
      service.findAll(1, 100),
    );
    expect(tenantATasks.data.map((task) => task.title)).toContain(
      'Tenant A task',
    );
    expect(tenantATasks.data.map((task) => task.title)).not.toContain(
      'Tenant B task',
    );

    const tenantBTasks = await withTenant(tenantB, () =>
      service.findAll(1, 100),
    );
    expect(tenantBTasks.data.map((task) => task.title)).toContain(
      'Tenant B task',
    );
    expect(tenantBTasks.data.map((task) => task.title)).not.toContain(
      'Tenant A task',
    );
  });
});
```

### Isolation Assertion

After the two tenant fixtures above exist, add `expectTenantIsolation` inside the same `describe` block for a focused leakage check:

```typescript
import { expectTenantIsolation } from '@nestarc/tenancy/testing';

it('should enforce strict tenant isolation', async () => {
  await expectTenantIsolation(
    prisma.client.task,
    tenantA,
    tenantB,
    { tenantIdField: 'tenantId' },
  );
});
```

The helper runs `findMany()` in both tenant contexts and verifies that neither result contains the other tenant's rows. It does not create fixtures, and the explicit `tenantIdField` matches the generated Prisma result field rather than its mapped SQL column.

### E2E Tests

For full HTTP-level tests, send the `X-Tenant-Id` header directly:

```typescript
// test/tasks.e2e-spec.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { withTenant } from '@nestarc/tenancy/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const TENANT_A = '33333333-3333-4333-8333-333333333333';
const TENANT_B = '44444444-4444-4444-8444-444444444444';

describe('Tasks (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();

    const prisma = app.get(PrismaService);
    await withTenant(TENANT_A, () =>
      prisma.client.user.upsert({
        where: { id: 'e2e-user-a' },
        update: { email: 'e2e-a@example.com', name: 'E2E Tenant A User' },
        create: {
          id: 'e2e-user-a',
          tenantId: TENANT_A,
          email: 'e2e-a@example.com',
          name: 'E2E Tenant A User',
        },
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /tasks should create a task scoped to tenant', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('X-Tenant-Id', TENANT_A)
      .send({ title: 'E2E Task', userId: 'e2e-user-a' })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('E2E Task');
    expect(res.body.data.tenantId).toBe(TENANT_A);
  });

  it('GET /tasks should not leak data across tenants', async () => {
    const res = await request(app.getHttpServer())
      .get('/tasks')
      .set('X-Tenant-Id', TENANT_B)
      .expect(200);

    expect(res.body.data.map((task) => task.title)).not.toContain('E2E Task');
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
- **[Prisma Extension Chaining](/guide/prisma-extension-chaining)** -- compose tenancy, audit-log, and soft-delete extensions on a single Prisma client
- **Soft Delete** -- replace hard deletes with `@nestarc/soft-delete` for recoverable data
- **Pagination** -- add cursor-based pagination with `@nestarc/pagination` for large datasets

::: tip Production Checklist
Before going live, review these security considerations:

1. **Database role** -- never connect as a superuser; use a dedicated app role
2. **Tenant ID validation** -- the default UUID validator covers most cases, but customize `validateTenantId` if your IDs have a different format
3. **Trust boundary** -- the `X-Tenant-Id` header is client-supplied; cross-validate against a JWT claim with `crossCheck: { extractor, onFailed, required }` or verify in `onTenantResolved`
4. **Fail-closed mode** -- `failClosed: true` is the default in `createPrismaTenancyExtension`; keep it enabled to block queries when no tenant context is set, preventing accidental data exposure if RLS is misconfigured
:::
