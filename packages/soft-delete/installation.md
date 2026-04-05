# Installation & Quick Start

## Installation

```bash
npm install @nestarc/soft-delete
# or
yarn add @nestarc/soft-delete
# or
pnpm add @nestarc/soft-delete
```

**Required peer dependencies** (install if not already present):

```bash
npm install @nestjs/common @nestjs/core @prisma/client reflect-metadata rxjs
```

**Optional peer dependencies:**

```bash
# For lifecycle events
npm install @nestjs/event-emitter

# For scheduled purge jobs
npm install @nestjs/schedule
```

---

## Quick Start

### 1. Prisma schema

Add `deletedAt` (and optionally `deletedBy`) to every model you want to soft-delete:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  deletedAt DateTime?
  deletedBy String?
}
```

### 2. Set up PrismaService

Apply the soft-delete extension in your `PrismaService`. This is what intercepts `delete()` calls and injects query filters:

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private _extended: ReturnType<typeof this.$extends>;

  constructor() {
    super();
    this._extended = this.$extends(
      createPrismaSoftDeleteExtension({
        softDeleteModels: ['User', 'Post'],
        deletedAtField: 'deletedAt',
        deletedByField: 'deletedBy',
        cascade: { User: ['Post'] },
      }),
    );
  }

  // Expose the extended client for all queries
  get client() {
    return this._extended;
  }

  async onModuleInit() {
    await this.$connect();
  }
}
```

> **Important:** Use `prisma.client.user.delete()` (the extended client) for soft-delete behavior.
> Direct `prisma.user.delete()` calls bypass the extension and perform hard deletes.

### 3. Register the module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { SoftDeleteModule } from '@nestarc/soft-delete';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    SoftDeleteModule.forRoot({
      softDeleteModels: ['User', 'Post'],
      deletedAtField: 'deletedAt',
      deletedByField: 'deletedBy',
      actorExtractor: (req) => req.user?.id ?? null,
      prismaServiceToken: PrismaService,
    }),
  ],
  providers: [PrismaService],
})
export class AppModule {}
```

`SoftDeleteModule` is global — you do not need to import it in feature modules.

### 4. Use in a controller

```typescript
// users.controller.ts
import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SoftDeleteService, WithDeleted } from '@nestarc/soft-delete';
import { PrismaService } from './prisma.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly softDelete: SoftDeleteService,
  ) {}

  // Soft-deletes the user (sets deletedAt) via the extended client
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.client.user.delete({ where: { id: +id } });
  }

  // Normal findMany — deleted users are automatically excluded
  @Get()
  findAll() {
    return this.prisma.client.user.findMany();
  }

  // Include soft-deleted users in results
  @Get('all')
  @WithDeleted()
  findAllIncludingDeleted() {
    return this.prisma.client.user.findMany();
  }

  // Restore a soft-deleted user
  @Post(':id/restore')
  restore(@Param('id') id: string) {
    return this.softDelete.restore('User', { id: +id });
  }
}
```

---

## Configuration

All options for `SoftDeleteModule.forRoot()`:

| Option | Type | Default | Description |
|---|---|---|---|
| `softDeleteModels` | `string[]` | — | **Required.** Model names to enable soft-delete for. |
| `deletedAtField` | `string` | `'deletedAt'` | Prisma field that stores the soft-delete timestamp. |
| `deletedByField` | `string \| null` | `null` | Prisma field to store the actor ID who deleted the record. |
| `actorExtractor` | `(req: any) => string \| null` | `undefined` | Function to extract the actor ID from the incoming request. |
| `cascade` | `Record<string, string[]>` | `undefined` | Parent-to-children cascade map (see Cascade section). |
| `maxCascadeDepth` | `number` | `3` | Maximum depth for recursive cascade operations. |
| `prismaServiceToken` | `any` | — | **Required.** DI token of your `PrismaService`. |
| `enableEvents` | `boolean` | `false` | Emit lifecycle events. Requires `@nestjs/event-emitter`. |

### Async registration

```typescript
SoftDeleteModule.forRootAsync({
  imports: [ConfigModule],
  prismaServiceToken: PrismaService,
  useFactory: (config: ConfigService) => ({
    softDeleteModels: config.get('SOFT_DELETE_MODELS').split(','),
    deletedAtField: 'deletedAt',
    prismaServiceToken: PrismaService,
  }),
  inject: [ConfigService],
});
```
