# Installation

```bash
npm install @nestarc/feature-flag
```

### Peer dependencies

```bash
npm install @nestjs/common @nestjs/core @prisma/client rxjs reflect-metadata
```

### Optional

```bash
# Required only if you enable emitEvents
npm install @nestjs/event-emitter
```

## Prisma Schema

Add the following models to your `schema.prisma`:

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
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  flagId      String   @map("flag_id") @db.Uuid
  tenantId    String?  @map("tenant_id")
  userId      String?  @map("user_id")
  environment String?
  enabled     Boolean
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz()
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz()

  flag FeatureFlag @relation(fields: [flagId], references: [id], onDelete: Cascade)

  @@index([flagId], map: "idx_override_flag_id")
  @@map("feature_flag_overrides")
}
```

### Partial unique indexes for overrides

PostgreSQL treats `NULL != NULL` in standard unique constraints, which means a simple `UNIQUE(flag_id, tenant_id, user_id, environment)` would allow duplicate rows when any nullable column is `NULL`. To enforce true uniqueness across all combinations, apply the following migration that creates one partial index per NULL/NOT-NULL pattern:

```sql
-- Drop the old unique constraint that does not handle NULLs correctly
ALTER TABLE feature_flag_overrides
  DROP CONSTRAINT IF EXISTS uq_override_context;

-- Global override (all nullable columns NULL)
CREATE UNIQUE INDEX uq_override_000
  ON feature_flag_overrides (flag_id)
  WHERE tenant_id IS NULL AND user_id IS NULL AND environment IS NULL;

-- Only environment is NOT NULL
CREATE UNIQUE INDEX uq_override_001
  ON feature_flag_overrides (flag_id, environment)
  WHERE tenant_id IS NULL AND user_id IS NULL AND environment IS NOT NULL;

-- Only user_id is NOT NULL
CREATE UNIQUE INDEX uq_override_010
  ON feature_flag_overrides (flag_id, user_id)
  WHERE tenant_id IS NULL AND user_id IS NOT NULL AND environment IS NULL;

-- user_id + environment
CREATE UNIQUE INDEX uq_override_011
  ON feature_flag_overrides (flag_id, user_id, environment)
  WHERE tenant_id IS NULL AND user_id IS NOT NULL AND environment IS NOT NULL;

-- Only tenant_id is NOT NULL
CREATE UNIQUE INDEX uq_override_100
  ON feature_flag_overrides (flag_id, tenant_id)
  WHERE tenant_id IS NOT NULL AND user_id IS NULL AND environment IS NULL;

-- tenant_id + environment
CREATE UNIQUE INDEX uq_override_101
  ON feature_flag_overrides (flag_id, tenant_id, environment)
  WHERE tenant_id IS NOT NULL AND user_id IS NULL AND environment IS NOT NULL;

-- tenant_id + user_id
CREATE UNIQUE INDEX uq_override_110
  ON feature_flag_overrides (flag_id, tenant_id, user_id)
  WHERE tenant_id IS NOT NULL AND user_id IS NOT NULL AND environment IS NULL;

-- All three NOT NULL
CREATE UNIQUE INDEX uq_override_111
  ON feature_flag_overrides (flag_id, tenant_id, user_id, environment)
  WHERE tenant_id IS NOT NULL AND user_id IS NOT NULL AND environment IS NOT NULL;
```

This SQL is included in the initial migration at `prisma/migrations/20260405000000_init/migration.sql`.

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

### FeatureFlagModuleRootOptions

Extends `FeatureFlagModuleOptions` with:

| Option  | Type  | Description                    |
| ------- | ----- | ------------------------------ |
| `prisma`| `any` | Prisma client instance         |
