---
description: "Install @nestarc/feature-flag and set up the feature flags table in PostgreSQL with Prisma."
---

# Installation

```bash
npm install @nestarc/feature-flag
```

### Peer dependencies

```bash
npm install @nestjs/common @nestjs/core @prisma/client @prisma/adapter-pg pg class-transformer class-validator rxjs reflect-metadata
npm install --save-dev prisma
```

feature-flag 0.5 supports Prisma 7 and requires Node.js 20.19+, 22.12+, or 24+.

### Optional

```bash
# Required only if you enable emitEvents
npm install @nestjs/event-emitter

# Required only if you use RedisCacheAdapter
npm install ioredis
```

## Prisma 7 Setup

Prisma 7 keeps connection URLs in `prisma.config.ts` and uses a generated client with an explicit output path:

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

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

Create the runtime client with the PostgreSQL driver adapter:

```typescript
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });
```

Add the feature-flag models to the same schema:

```prisma
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

For a greenfield schema, add raw SQL constraints because Prisma schema cannot express them:

```sql
CREATE UNIQUE INDEX "uq_feature_flag_override_attributes"
  ON "feature_flag_overrides"("flag_id", "attributes");

ALTER TABLE "feature_flag_overrides"
  ADD CONSTRAINT "chk_feature_flag_override_attributes_non_empty"
  CHECK (jsonb_typeof("attributes") = 'object' AND "attributes" <> '{}'::jsonb);
```

Existing 0.2 applications should apply the included 0.3 migration, which converts the fixed tenant/user/environment columns to `attributes` JSON. Upgrading from feature-flag 0.4 to 0.5 requires no database migration. See the shared [Prisma 7 setup guide](/guide/prisma-7).

## Module Registration

### forRoot (synchronous)

```typescript
import { FeatureFlagModule } from '@nestarc/feature-flag';

@Module({
  imports: [
    FeatureFlagModule.forRoot({
      environment: 'production',
      prisma: prismaService,
      userIdExtractor: (req) => req.headers['x-user-id'] as string,
      emitEvents: true,
      cacheTtlMs: 30_000,
      // cacheAdapter: new RedisCacheAdapter({ client: redisClient }),
    }),
  ],
})
export class AppModule {}
```

### forRootAsync (with useFactory)

```typescript
import { FeatureFlagModule } from '@nestarc/feature-flag';

@Module({
  imports: [
    FeatureFlagModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, PrismaService],
      useFactory: (config: ConfigService, prisma: PrismaService) => ({
        environment: config.get('NODE_ENV'),
        prisma,
        userIdExtractor: (req) => req.headers['x-user-id'] as string,
      }),
    }),
  ],
})
export class AppModule {}
```

### forRootAsync (with useClass)

```typescript
@Injectable()
class FeatureFlagConfigService implements FeatureFlagModuleOptionsFactory {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  createFeatureFlagOptions() {
    return {
      environment: this.config.get('NODE_ENV'),
      prisma: this.prisma,
    };
  }
}

@Module({
  imports: [
    FeatureFlagModule.forRootAsync({
      imports: [ConfigModule, PrismaModule],
      useClass: FeatureFlagConfigService,
    }),
  ],
})
export class AppModule {}
```

### forRootAsync (with useExisting)

```typescript
@Module({
  imports: [
    FeatureFlagModule.forRootAsync({
      useExisting: FeatureFlagConfigService,
    }),
  ],
})
export class AppModule {}
```

## FeatureFlagModuleOptions

| Option              | Type                              | Default   | Description                                                     |
| ------------------- | --------------------------------- | --------- | --------------------------------------------------------------- |
| `environment`       | `string`                          | *required*| Deployment environment (e.g. `'production'`, `'staging'`)       |
| `cacheTtlMs`        | `number`                          | `30000`   | Cache TTL in ms. Set to `0` to disable caching                  |
| `userIdExtractor`   | `(req: Request) => string \| null`| `undefined`| Extracts user ID from the incoming request                     |
| `defaultOnMissing`  | `boolean`                         | `false`   | Value returned when a flag key does not exist in the database   |
| `emitEvents`        | `boolean`                         | `false`   | Emit lifecycle events via `@nestjs/event-emitter`               |
| `cacheAdapter`      | `CacheAdapter`                    | `MemoryCacheAdapter` | Pluggable cache backend ([Cache Adapters →](./cache-adapters)) |

### FeatureFlagModuleRootOptions

Extends `FeatureFlagModuleOptions` with:

| Option  | Type  | Description                    |
| ------- | ----- | ------------------------------ |
| `prisma`| `any` | Prisma client instance         |

## Admin Module (Optional)

To expose REST endpoints for flag management, register `FeatureFlagAdminModule` alongside the main module. A guard is required.

```typescript
import { FeatureFlagAdminModule } from '@nestarc/feature-flag';

@Module({
  imports: [
    FeatureFlagModule.forRoot({ /* ... */ }),
    FeatureFlagAdminModule.register({
      guard: AdminAuthGuard,
    }),
  ],
})
export class AppModule {}
```

See the [Admin API](./admin-api) page for full endpoint documentation.
