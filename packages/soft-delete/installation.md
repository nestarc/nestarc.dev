---
description: "Install @nestarc/soft-delete and configure the Prisma extension with deletedAt column support."
---

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

Prisma 7 direct PostgreSQL connections also require:

```bash
npm install @prisma/adapter-pg pg
npm install --save-dev prisma dotenv
```

**Optional peer dependencies:**

```bash
# For lifecycle events
npm install @nestjs/event-emitter

# For scheduled purge jobs
npm install @nestjs/schedule
```

---

## Compatibility

The published peer dependency range supports NestJS 10/11 and Prisma 5/6/7. Prisma 7 is the primary development and PostgreSQL E2E target:

| Node.js | NestJS | Prisma | Scope |
|---|---|---|---|
| 20 | 10 | 5 | lint, unit tests, build |
| 22 | 11 | 6 | lint, unit tests, build |
| 24 | 11 | 7 | lint, unit tests, build, PostgreSQL E2E |

Node.js `^20.19`, `^22.12`, or `>=24` is required by the Prisma 7 toolchain. Cascade and relation filters require explicit DMMF metadata on every supported Prisma version.

---

## Quick Start

### 1. Prisma schema

Use Prisma 7's generated-client output and add `deletedAt` (and optionally `deletedBy`) to every model you want to soft-delete:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  deletedAt DateTime?
  deletedBy String?
}
```

Move the CLI datasource URL into Prisma Config:

```typescript
// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: { url: env('DATABASE_URL') },
});
```

A plain `@unique` still includes soft-deleted rows. If a value must be reusable after deletion, remove the global unique constraint and add a database-specific active-row unique index. See [Cascade & Unique Constraints](./cascade#active-row-unique-constraints).

### 2. Set up PrismaService

Apply the soft-delete extension in your `PrismaService`. This is what intercepts `delete()` calls and injects query filters:

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private _extended: ReturnType<typeof this.$extends>;

  constructor() {
    super({ adapter });
    this._extended = this.$extends(
      createPrismaSoftDeleteExtension({
        softDeleteModels: ['User', 'Post'],
        deletedAtField: 'deletedAt',
        deletedByField: 'deletedBy',
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

The basic setup above does not need DMMF. If you enable cascade or relation filters, follow [DMMF for Cascade and Relation Filters](#dmmf-for-cascade-and-relation-filters) and pass the same metadata to the extension and module.

::: warning audit-log 0.4 compatibility
Audit-log 0.4 contains the audit side of an atomic lifecycle bridge, but the published
`@nestarc/soft-delete` 0.6.0 package does not expose the matching integration. Do not attempt to
enable that bridge until a compatible soft-delete release is installed. For now, use lifecycle
events with `AuditService.log()` for best-effort evidence, or perform the equivalent mutation and
manual log write in one explicit transaction when atomicity is required. See the
[extension chaining guide](/guide/prisma-extension-chaining).
:::

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

### DMMF for Cascade and Relation Filters

Cascade and relation-filter lookup require full Prisma DMMF metadata. Pin `@prisma/internals` to exactly the same version as `prisma`:

```bash
npm install @prisma/internals@<same-version-as-prisma>
```

Load the schema metadata before creating the extension, then pass the same `dmmf` value into `SoftDeleteModule`:

```typescript
import { readFileSync } from 'node:fs';
import { getDMMF } from '@prisma/internals';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';

const datamodel = readFileSync('prisma/schema.prisma', 'utf8');
const dmmf = await getDMMF({ datamodel });
const cascade = { User: ['Post'] };

const client = basePrisma.$extends(
  createPrismaSoftDeleteExtension({
    softDeleteModels: ['User', 'Post'],
    cascade,
    dmmf,
  }),
);

SoftDeleteModule.forRoot({
  softDeleteModels: ['User', 'Post'],
  cascade,
  dmmf,
  prismaServiceToken: PrismaService,
});
```

`@prisma/internals` has no semantic-versioning guarantee and is not a runtime dependency of soft-delete. Keep the explicit metadata boundary in application code and cover it with startup or integration tests.

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
| `dmmf` | `PrismaDmmfLike` | `undefined` | Explicit Prisma DMMF for cascade and relation-filter lookup when `Prisma.dmmf` is unavailable. |
| `relationFilters` | `boolean \| RelationFilterOptions` | `false` | Opt in to active-only filtering for to-many `include` and `select` trees. |
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

Relation filtering is intentionally opt-in to preserve the 0.4 query shape. Configure it on the Prisma extension and follow the [Relation Filters](./relation-filters) guide before enabling it in production.
