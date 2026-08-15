---
description: "Implement gradual feature rollouts in a multi-tenant NestJS app using @nestarc/feature-flag 0.5, Prisma 7, and deterministic targeting."
---

# Feature Flags for Gradual Rollout

This guide walks through using `@nestarc/feature-flag` to ship features safely in a multi-tenant SaaS application. You will set up the database schema, gate a route behind a flag, roll out to a percentage of users, override behavior for specific tenants, and write tests -- all without any external feature-flag service.

## Overview

Deploying a feature to all users at once is risky. A single bad release can affect every tenant simultaneously. Feature flags let you decouple deployment from release so you can:

- **Ship safely** -- deploy code to production with the flag disabled, then enable it when you are confident.
- **Roll out gradually** -- expose a feature to 10% of users first, watch metrics, then widen to 50% and eventually 100%.
- **Target specific tenants** -- give early access to a design partner or enterprise customer before a general rollout.
- **Run A/B tests** -- serve different code paths to different user segments and compare outcomes.
- **Kill-switch instantly** -- disable a broken feature without redeploying.

`@nestarc/feature-flag` stores all flag state in PostgreSQL via Prisma. There is no external flag service -- your flags live alongside your application data and follow the same backup and migration workflows. Version 0.5 uses attribute-targeted overrides and Prisma 7's generated client and PostgreSQL driver-adapter flow.

## Setup

### Prerequisites

This guide targets `@nestarc/feature-flag` 0.5 and requires:

- Node.js `^20.19.0`, `^22.12.0`, or `>=24.0.0`
- NestJS 10 or 11
- Prisma 7
- PostgreSQL, a restricted runtime `DATABASE_URL`, and a schema-owner `MIGRATION_DATABASE_URL`

### Install the package and peers

```bash
npm install @nestarc/feature-flag @nestarc/tenancy @nestjs/config @prisma/client @prisma/adapter-pg pg dotenv class-transformer class-validator
npm install --save-dev prisma
```

NestJS applications normally already provide `@nestjs/common`, `@nestjs/core`, `reflect-metadata`, and `rxjs`; install those required peers too if your application does not.

### Configure Prisma 7

Prisma 7 keeps the CLI connection URL in `prisma.config.ts`:

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

Use the schema-owner URL only for migrations. The runtime client below reads `DATABASE_URL`, which should not own the tables or have schema-changing privileges.

Use the `prisma-client` generator with an explicit output path. The runtime client will be imported from that generated path rather than from the `@prisma/client` root:

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

### Add the feature-flag schema

Add two models to the same `schema.prisma`. `FeatureFlagOverride` stores a non-empty exact-match `attributes` object, so targeting can use tenants, users, environments, plans, regions, or other stable dimensions without adding columns.

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

Prisma schema syntax cannot express the current PostgreSQL uniqueness and non-empty-object constraints. For a greenfield schema, create the migration without applying it:

```bash
npx prisma migrate dev --name add-feature-flags --create-only
```

Append these statements to the generated `migration.sql`, then apply the migration and generate the client:

```sql
CREATE UNIQUE INDEX "uq_feature_flag_override_attributes"
  ON "feature_flag_overrides"("flag_id", "attributes");

ALTER TABLE "feature_flag_overrides"
  ADD CONSTRAINT "chk_feature_flag_override_attributes_non_empty"
  CHECK (jsonb_typeof("attributes") = 'object' AND "attributes" <> '{}'::jsonb);

-- Replace this placeholder with the actual non-owner runtime role.
GRANT SELECT, INSERT, UPDATE, DELETE
  ON "feature_flags", "feature_flag_overrides"
  TO your_runtime_role;
```

Do not leave `your_runtime_role` unchanged. The schema owner applies this migration; the running application uses that restricted role and receives only the table permissions needed for evaluation and managed CRUD. Keep schema changes and role creation in the privileged provisioning path.

```bash
npx prisma migrate dev
npx prisma generate
```

::: warning Upgrading an existing installation
Do not recreate the eight nullable-column partial indexes from feature-flag 0.2. Version 0.3 replaced `tenant_id`, `user_id`, and `environment` with `attributes jsonb` plus `priority`; its included migration backfills attributes, removes invalid all-null rows, deduplicates collisions, drops the old partial indexes, and adds the constraints above. Follow the [0.2-to-0.3 migration procedure](/packages/feature-flag/installation) for that upgrade. Moving from 0.4 to 0.5 requires the Prisma 7 client changes in this section but no database migration.
:::

### Create the Prisma 7 client

Create the runtime client with `@prisma/adapter-pg` and import `PrismaClient` from the generated output:

```typescript
// src/prisma.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(config: ConfigService) {
    super({
      adapter: new PrismaPg({
        connectionString: config.getOrThrow<string>('DATABASE_URL'),
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### Module Registration

Export that service from a `PrismaModule`, then register feature-flag with `forRootAsync` so Nest injects the configured client:

```typescript
// src/prisma.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FeatureFlagModule } from '@nestarc/feature-flag';
import { TenancyModule } from '@nestarc/tenancy';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id',
    }),
    FeatureFlagModule.forRootAsync({
      imports: [ConfigModule, PrismaModule],
      inject: [ConfigService, PrismaService],
      useFactory: (config: ConfigService, prisma: PrismaService) => ({
        environment: config.get<string>('NODE_ENV') ?? 'development',
        prisma,
        userIdExtractor: (req) => {
          const header = req.headers['x-user-id'];
          return Array.isArray(header) ? header[0] ?? null : header ?? null;
        },
        cacheTtlMs: 30_000,
      }),
    }),
  ],
})
export class AppModule {}
```

The default feature-flag tenant provider reads the request context established by `TenancyModule`; without tenancy or a custom `TenantContextProvider`, tenant override rows cannot match route evaluations. Both header extractors are deliberately concise for this guide: in production, derive the tenant from an authenticated claim or cross-check it as described in [Tenant Lifecycle Hooks](/packages/tenancy/lifecycle-hooks), and derive the user ID from the authenticated principal rather than trusting `X-User-Id`. Otherwise a caller could choose another rollout bucket. In the current 0.5 service path, use an authenticated `userId` or validated `tenantId` as the stable rollout key; do not rely on a `targetingKey`-only context.

::: warning Multi-instance kill switches
The default `MemoryCacheAdapter` is process-local, and this example's 30-second TTL allows another replica to serve a stale value until expiry. For production replicas, configure `RedisCacheAdapter` with Pub/Sub invalidation as shown in [Cache Adapters](/packages/feature-flag/cache-adapters), or set `cacheTtlMs: 0` when an immediate database-backed kill switch matters more than caching. Test invalidation across at least two instances before calling the switch instant.
:::

## Gate a Route

The `@FeatureFlag()` decorator is the simplest way to protect a route. It automatically applies the `FeatureFlagGuard` -- you do not need a separate `@UseGuards()` call.

```typescript
import { Controller, Get } from '@nestjs/common';
import { FeatureFlag } from '@nestarc/feature-flag';

@Controller('dashboard')
export class DashboardController {
  @FeatureFlag('NEW_DASHBOARD')
  @Get()
  getNewDashboard() {
    return { widgets: ['revenue', 'churn', 'nps'] };
  }
}
```

When `NEW_DASHBOARD` is disabled for the requesting user, the guard responds with `403 Forbidden` by default. You can customize both the status code and the response body:

```typescript
@FeatureFlag('NEW_DASHBOARD', {
  statusCode: 404,
  fallback: { message: 'Not found' },
})
@Get()
getNewDashboard() {
  return { widgets: ['revenue', 'churn', 'nps'] };
}
```

::: info
Using `404` instead of `403` prevents clients from discovering that a feature exists before it is available to them.
:::

You can also apply the decorator at the class level to gate an entire controller, and use `@BypassFeatureFlag()` to exempt specific routes like health checks:

```typescript
import { FeatureFlag, BypassFeatureFlag } from '@nestarc/feature-flag';

@FeatureFlag('BETA_API')
@Controller('beta')
export class BetaController {
  @Get('insights')
  getInsights() { /* guarded by BETA_API */ }

  @BypassFeatureFlag()
  @Get('health')
  healthCheck() {
    return { status: 'ok' };
  }
}
```

## Programmatic Checks

Not every feature flag decision happens at the route level. For service-layer branching, inject `FeatureFlagService` and call `isEnabled()`:

```typescript
import { Injectable } from '@nestjs/common';
import { FeatureFlagService } from '@nestarc/feature-flag';

@Injectable()
export class InvoiceService {
  constructor(private readonly flags: FeatureFlagService) {}

  async generateInvoice(order: Order) {
    const useNewEngine = await this.flags.isEnabled('NEW_INVOICE_ENGINE');
    return {
      engine: useNewEngine ? 'v2' : 'v1',
      orderId: order.id,
    };
  }
}
```

You can also pass an explicit `EvaluationContext` to override the ambient request values:

```typescript
const enabled = await this.flags.isEnabled('NEW_INVOICE_ENGINE', {
  userId: 'user-123',
  tenantId: '550e8400-e29b-41d4-a716-446655440000',
  environment: 'staging',
});
```

To fetch every flag at once (useful for sending a flag map to a frontend client), pass the same concrete user/tenant context when percentage decisions must be request-specific:

```typescript
const allFlags = await this.flags.evaluateAll({
  userId: 'user-123',
  tenantId: '550e8400-e29b-41d4-a716-446655440000',
});
// { NEW_DASHBOARD: true, NEW_INVOICE_ENGINE: false, ... }
```

## Percentage Rollout

Percentage rollout lets you expose a feature to a fraction of users and increase that fraction over time. The module uses murmurhash3 to hash `flagKey + targetingKey` and takes the result modulo 100. Because the hash is deterministic, the same targeting key always lands in the same bucket -- it will not flicker between enabled and disabled across requests.

### Step-by-step rollout

Start by creating the flag with the percentage set to `0`:

```typescript
await this.flags.create({
  key: 'NEW_DASHBOARD',
  description: 'Redesigned analytics dashboard',
  enabled: false,  // global fallback is off
  percentage: 0,   // percentage layer is disabled
});
```

::: warning
When `percentage` is between 1 and 99 and a stable user/tenant key exists, the percentage layer runs before the global `enabled` fallback. A percentage of 100 evaluates true even without a key. Setting only `enabled: false` is therefore not a kill switch for an active rollout. To stop exposure, set `percentage: 0` and `enabled: false` together.
:::

Roll out to 10% of users:

```typescript
await this.flags.update('NEW_DASHBOARD', {
  enabled: false,
  percentage: 10,
});
```

Monitor your error rates and user feedback. When you are satisfied, widen to 50%:

```typescript
await this.flags.update('NEW_DASHBOARD', { percentage: 50 });
```

Finally, complete the rollout by disabling bucketing and making the global fallback on:

```typescript
await this.flags.update('NEW_DASHBOARD', {
  enabled: true,
  percentage: 0,
});
```

### How bucketing works

At the percentage-rollout layer, the evaluator computes:

```
bucket = murmurhash3(flagKey + targetingKey) % 100
```

If `bucket < percentage`, the flag is enabled. Users with hash values in the range `[0, 9]` are in the first 10%. When you increase to 50%, users `[0, 49]` are included -- so everyone who was already in the 10% cohort remains in the 50% cohort. This means users never lose access to a feature during a gradual widening.

::: warning Version 0.5 service-path boundary
For `isEnabled()`/`evaluateAll()` in 0.5, supply `userId` or `tenantId`; the context resolver does not forward an explicit `targetingKey` by itself. For percentages 1–99, evaluation without a usable key falls through to the global `enabled` default; 100% is always enabled. `evaluateAll()` also does not carry a typed registry's per-flag `bucketBy`, so use concrete user/tenant context and test every bulk-evaluation rollout. Choose one stable identifier and do not change it while widening the cohort.
:::

## Attribute Overrides for Tenants

In a multi-tenant SaaS, you often want to give a specific tenant early access before the global rollout begins. Overrides take precedence over percentage rollout in the evaluation cascade. Version 0.5 requires every override to provide a non-empty `attributes` object; the legacy top-level `tenantId`, `userId`, and `environment` override fields are no longer accepted.

### Enable for a design partner

Suppose tenant `550e8400-e29b-41d4-a716-446655440000` is your design partner and should see `NEW_DASHBOARD` immediately, even while the global percentage is still at 0%:

```typescript
await this.flags.setOverride('NEW_DASHBOARD', {
  attributes: { tenantId: '550e8400-e29b-41d4-a716-446655440000' },
  enabled: true,
});
```

Every user in that tenant now sees the new dashboard. Users in all other tenants remain subject to the global percentage.

### Disable for a specific tenant during rollout

If a tenant reports problems after you have rolled out to 50%, you can disable the flag just for them without affecting everyone else:

```typescript
await this.flags.setOverride('NEW_DASHBOARD', {
  attributes: { tenantId: '123e4567-e89b-42d3-a456-426614174000' },
  enabled: false,
});
```

### Combine dimensions

Overrides support multiple dimensions. You can scope an override to a specific tenant, user, and environment simultaneously:

```typescript
await this.flags.setOverride('NEW_DASHBOARD', {
  attributes: {
    tenantId: '550e8400-e29b-41d4-a716-446655440000',
    userId: 'user-42',
    environment: 'production',
  },
  enabled: true,
  priority: 10,
});
```

### Evaluation priority

The full evaluation cascade, from highest to lowest priority:

| Priority | Layer                  | Description                                                               |
| -------- | ---------------------- | ------------------------------------------------------------------------- |
| 1        | **Archived**           | Archived flags always return `false`                                      |
| 2        | **Attribute override** | Best override whose attributes all match the evaluation context           |
| 3        | **Percentage rollout** | Deterministic hash of `flagKey + targetingKey` modulo 100                  |
| 4        | **Global default**     | The flag's `enabled` field                                                |

The first layer that applies wins. When multiple attribute overrides match, feature-flag selects more attributes first, then higher `priority`, earlier `createdAt`, and finally lower `id`.

## Lifecycle

A feature flag typically moves through four stages: create, enable, rollout, and archive. Here is the recommended flow.

### 1. Create (code ships, flag is off)

Deploy your code behind the flag. Create the flag record with `enabled: false`:

```typescript
await this.flags.create({
  key: 'NEW_DASHBOARD',
  description: 'Redesigned analytics dashboard',
  enabled: false,
  percentage: 0,
});
```

### 2. Enable for early access

Set a small percentage while leaving the global fallback off, or use tenant overrides to target specific customers:

```typescript
await this.flags.update('NEW_DASHBOARD', {
  enabled: false,
  percentage: 10,
});

// Give design partners immediate access
await this.flags.setOverride('NEW_DASHBOARD', {
  attributes: { tenantId: '550e8400-e29b-41d4-a716-446655440000' },
  enabled: true,
});
```

### 3. Widen and complete rollout

Gradually increase the percentage as confidence grows:

```typescript
await this.flags.update('NEW_DASHBOARD', { percentage: 50 });
// ... monitor ...
await this.flags.update('NEW_DASHBOARD', {
  enabled: true,
  percentage: 0,
});
```

### 4. Archive

Once the feature is stable and the old code path has been removed, archive the flag. Archived flags always evaluate to `false` and are excluded from `findAll()`:

```typescript
await this.flags.archive('NEW_DASHBOARD');
```

::: warning
Do not archive a flag until you have removed all code that checks it. An archived flag returns `false`, which could disable a feature you intended to keep.
:::

You can list all active flags to review what is still in play:

```typescript
const activeFlags = await this.flags.findAll();
```

## Testing

`@nestarc/feature-flag` ships a `TestFeatureFlagModule` that stubs flag values in memory. No database connection is needed.

```typescript
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestFeatureFlagModule } from '@nestarc/feature-flag/testing';
import { DashboardController } from './dashboard.controller';

describe('DashboardController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TestFeatureFlagModule.register({
          NEW_DASHBOARD: true,
          PREMIUM_FEATURE: false,
        }),
      ],
      controllers: [DashboardController],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(() => app.close());

  it('allows access when NEW_DASHBOARD is enabled', () => {
    return request(app.getHttpServer())
      .get('/dashboard')
      .expect(200);
  });

  it('blocks access when the flag is disabled', async () => {
    // Rebuild with the flag disabled
    const module = await Test.createTestingModule({
      imports: [
        TestFeatureFlagModule.register({
          NEW_DASHBOARD: false,
        }),
      ],
      controllers: [DashboardController],
    }).compile();

    const blockedApp = module.createNestApplication();
    await blockedApp.init();

    await request(blockedApp.getHttpServer())
      .get('/dashboard')
      .expect(403);

    await blockedApp.close();
  });
});
```

`TestFeatureFlagModule.register()` provides a global mock of `FeatureFlagService`. `isEnabled(key)` returns the boolean you specified, defaulting to `false` for any key not in the map. `evaluateAll()` returns the full map.

For service-layer tests, you can inject the mocked `FeatureFlagService` directly:

```typescript
describe('InvoiceService', () => {
  let service: InvoiceService;
  let flags: FeatureFlagService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TestFeatureFlagModule.register({
          NEW_INVOICE_ENGINE: true,
        }),
      ],
      providers: [InvoiceService],
    }).compile();

    service = module.get(InvoiceService);
    flags = module.get(FeatureFlagService);
  });

  it('uses the new engine when flag is enabled', async () => {
    const result = await service.generateInvoice(mockOrder);
    expect(result.engine).toBe('v2');
  });
});
```

::: tip Next Steps
- [Guard & Decorator reference](/packages/feature-flag/guard-decorator) -- full decorator options and bypass patterns
- [Rollout reference](/packages/feature-flag/rollout) -- evaluation cascade, caching, and events
- [Tenant Overrides reference](/packages/feature-flag/tenant-overrides) -- all override dimension combinations
:::
