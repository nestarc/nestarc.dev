---
description: "Install @nestarc/feature-flag 0.5.0 in an existing NestJS app, migrate PostgreSQL with Prisma 7, register the module, create a flag, and verify an HTTP request."
---

# Installation and first evaluation

This walkthrough targets published **0.5.0** in an existing NestJS 10/11 application using PostgreSQL. It requires Node.js `^20.19.0`, `^22.12.0`, or `>=24.0.0` and Prisma 7. It uses a local development database and a CommonJS Nest build; keep your application's module settings consistent with the generated Prisma client.

## Install

```bash
npm install @nestarc/feature-flag@0.5.0 @nestjs/common @nestjs/core @prisma/client@^7 @prisma/adapter-pg@^7 pg dotenv class-transformer class-validator rxjs reflect-metadata
npm install --save-dev prisma@^7
```

Keep the existing NestJS major version when installing peers. `@nestjs/platform-express`, TypeScript, and a `start:dev` script are assumed to come from the existing Nest application. Set `DATABASE_URL` in `.env` to your development PostgreSQL database. For production, use your normal migration credentials and a runtime role with the required table permissions.

Optional integrations can be installed later:

```bash
npm install @nestjs/event-emitter # lifecycle/evaluation events
npm install ioredis              # RedisCacheAdapter
npm install @openfeature/server-sdk@^1 # boolean OpenFeature adapter
```

## Prepare the database

Create the Prisma CLI configuration. If your app already has one, merge these settings:

```typescript
// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: env('DATABASE_URL') },
});
```

Add the generator, datasource, and two models to `prisma/schema.prisma`. Keep an existing generator/datasource instead of duplicating it:

```prisma
generator client {
  provider     = "prisma-client"
  output       = "../src/generated/prisma"
  moduleFormat = "cjs"
}

datasource db {
  provider = "postgresql"
}

model FeatureFlag {
  id          String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  key         String    @unique
  description String?
  enabled     Boolean   @default(false)
  percentage  Int       @default(0)
  metadata    Json      @default("{}")
  archivedAt  DateTime? @map("archived_at") @db.Timestamptz()
  createdAt   DateTime  @default(now()) @map("created_at") @db.Timestamptz()
  updatedAt   DateTime  @updatedAt @map("updated_at") @db.Timestamptz()

  overrides FeatureFlagOverride[]

  @@map("feature_flags")
}

model FeatureFlagOverride {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  flagId     String   @map("flag_id") @db.Uuid
  attributes Json
  priority   Int      @default(0)
  enabled    Boolean
  createdAt  DateTime @default(now()) @map("created_at") @db.Timestamptz()
  updatedAt  DateTime @updatedAt @map("updated_at") @db.Timestamptz()

  flag FeatureFlag @relation(fields: [flagId], references: [id], onDelete: Cascade)

  @@index([flagId], map: "idx_override_flag_id")
  @@map("feature_flag_overrides")
}
```

Create the migration without applying it:

```bash
npx prisma migrate dev --name add-feature-flags --create-only
```

Append the following to the generated `migration.sql`; Prisma schema syntax does not express these constraints:

```sql
CREATE UNIQUE INDEX "uq_feature_flag_override_attributes"
  ON "feature_flag_overrides"("flag_id", "attributes");

ALTER TABLE "feature_flag_overrides"
  ADD CONSTRAINT "chk_feature_flag_override_attributes_non_empty"
  CHECK (jsonb_typeof("attributes") = 'object' AND "attributes" <> '{}'::jsonb);
```

Apply the migration and generate the application client:

```bash
npx prisma migrate dev
npx prisma generate
```

## Create and export the Prisma service

```typescript
// src/prisma.service.ts
import 'dotenv/config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL is required');
    super({ adapter: new PrismaPg({ connectionString }) });
  }

  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}
```

```typescript
// src/prisma.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}
```

## Add a guarded route

```typescript
// src/dashboard.controller.ts
import { Controller, Get } from '@nestjs/common';
import { FeatureFlag } from '@nestarc/feature-flag';

@Controller('dashboard')
export class DashboardController {
  @Get()
  @FeatureFlag('NEW_DASHBOARD')
  getDashboard() {
    return { message: 'New dashboard is enabled' };
  }
}
```

Create a deterministic development flag before accepting requests. This demonstration initializer sets the flag on at every application start; replace it with your flag-management workflow after the walkthrough:

```typescript
// src/demo-flags.service.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { FeatureFlagService } from '@nestarc/feature-flag';
import { PrismaService } from './prisma.service';

@Injectable()
export class DemoFlagsService implements OnApplicationBootstrap {
  constructor(
    private readonly prisma: PrismaService,
    private readonly flags: FeatureFlagService,
  ) {}

  async onApplicationBootstrap() {
    await this.prisma.featureFlag.upsert({
      where: { key: 'NEW_DASHBOARD' },
      create: { key: 'NEW_DASHBOARD', enabled: true, percentage: 0 },
      update: { enabled: true, percentage: 0, archivedAt: null },
    });
    await this.flags.invalidateCache();
  }
}
```

## Register the module and run

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { FeatureFlagModule } from '@nestarc/feature-flag';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';
import { DashboardController } from './dashboard.controller';
import { DemoFlagsService } from './demo-flags.service';

@Module({
  imports: [
    PrismaModule,
    FeatureFlagModule.forRootAsync({
      imports: [PrismaModule],
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        environment: process.env.NODE_ENV ?? 'development',
        prisma,
      }),
    }),
  ],
  controllers: [DashboardController],
  providers: [DemoFlagsService],
})
export class AppModule {}
```

The inner `imports: [PrismaModule]` makes its exported service available to the feature-flag factory. Keep your existing Nest `main.ts` bootstrap; enable shutdown hooks if you want lifecycle cleanup on process signals.

```bash
npm run start:dev
curl -i http://localhost:3000/dashboard
```

Expected: HTTP **200** with `{"message":"New dashboard is enabled"}`. Set `enabled: false` in both initializer branches and restart to get HTTP **403**. This first check uses `percentage: 0` with no overrides; see [evaluation precedence](./rollout) before adding targeting.

## Other registration styles

`forRoot({ environment: 'production', prisma })` accepts an already-created Prisma client instance. Let the application manage its connection lifecycle.

With `useClass`, Nest creates the options factory inside the feature-flag module. Include the modules exporting its injected dependencies in `forRootAsync.imports`.

With `useExisting`, import a module that exports the existing factory instance:

```typescript
// FeatureFlagConfigService implements FeatureFlagModuleOptionsFactory.
// Its createFeatureFlagOptions() returns { environment, prisma }.
@Module({
  imports: [PrismaModule],
  providers: [FeatureFlagConfigService],
  exports: [FeatureFlagConfigService],
})
export class FeatureFlagConfigModule {}

FeatureFlagModule.forRootAsync({
  imports: [FeatureFlagConfigModule],
  useExisting: FeatureFlagConfigService,
});
```

This fragment assumes the factory class is defined. A provider in an unrelated parent module is not automatically visible inside the dynamic module.

## Options in published 0.5.0

| Option | Default | Purpose |
| --- | --- | --- |
| `environment` | Required | Ambient deployment environment |
| `prisma` | Required | Application Prisma client with feature-flag models |
| `cacheTtlMs` | `30000` | Flag-record TTL in milliseconds; `0` skips built-in cache writes; existing shared entries can still be read |
| `userIdExtractor` | Unset | Request → `string` or `null`; use the authenticated principal |
| `defaultOnMissing` | `false` | Last fallback for missing flags or individual evaluation errors |
| `emitEvents` | `false` | Requires `EventEmitterModule.forRoot()` and its optional package |
| `cacheAdapter` | `MemoryCacheAdapter` | Custom cache instance |
| `flags` | Unset | Typed registry defaults and single-flag evaluation metadata; see [0.5.0 limitations](./agent-guide#version-boundary) |

Direct `repository` and `tenantContextProvider` options are **unreleased**. See [Custom backends](./custom-backends) before using current-source recipes.

## Upgrading

- **0.4 → 0.5:** adopt Prisma 7's generated client and driver adapter. No feature-flag database migration is required. Read [the 0.5 release notes](https://github.com/nestarc/nestjs-feature-flag/blob/v0.5.0/CHANGELOG.md) and [Prisma 7 setup](/guide/prisma-7).
- **0.2 → 0.3 or later:** back up and apply the included attribute migration. It converts the fixed tenant/user/environment columns to `attributes` JSON, removes invalid all-null rows, resolves duplicate attribute sets, and installs the new constraints. Inspect the [versioned migration](https://github.com/nestarc/nestjs-feature-flag/tree/v0.5.0/prisma/migrations) before applying it to existing data; do not recreate the old partial indexes.

Continue with [attribute overrides](./tenant-overrides), [rollouts and events](./rollout), or [the admin API](./admin-api).
