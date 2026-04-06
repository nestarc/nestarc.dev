---
description: "Implement gradual feature rollouts in a multi-tenant NestJS app using @nestarc/feature-flag with percentage-based bucketing."
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

`@nestarc/feature-flag` stores all flag state in PostgreSQL via Prisma. There is no external dependency -- your flags live alongside your application data and follow the same backup and migration workflows.

## Setup

### Install

```bash
npm install @nestarc/feature-flag
```

### Prisma Schema

Add two models to your `schema.prisma`. The `FeatureFlag` model stores each flag's global state, and `FeatureFlagOverride` stores per-tenant, per-user, or per-environment overrides.

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

Run the migration:

```bash
npx prisma migrate dev --name add-feature-flags
```

::: tip
See the [Installation](/packages/feature-flag/installation) reference for the full set of partial unique indexes that prevent duplicate overrides when nullable columns are `NULL`.
:::

### Module Registration

Register the module with `forRootAsync` so you can inject your `ConfigService` and `PrismaService`:

```typescript
import { Module } from '@nestjs/common';
import { FeatureFlagModule } from '@nestarc/feature-flag';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    FeatureFlagModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, PrismaService],
      useFactory: (config: ConfigService, prisma: PrismaService) => ({
        environment: config.get('NODE_ENV'),
        prisma,
        userIdExtractor: (req) => req.headers['x-user-id'] as string,
        cacheTtlMs: 30_000,
      }),
    }),
  ],
})
export class AppModule {}
```

The `userIdExtractor` tells the module how to pull the current user from each request. This value is used for percentage rollout bucketing and user-level overrides.

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

    if (useNewEngine) {
      return this.newEngine.generate(order);
    }
    return this.legacyEngine.generate(order);
  }
}
```

You can also pass an explicit `EvaluationContext` to override the ambient request values:

```typescript
const enabled = await this.flags.isEnabled('NEW_INVOICE_ENGINE', {
  userId: 'user-123',
  tenantId: 'tenant-acme',
  environment: 'staging',
});
```

To fetch every flag at once (useful for sending a flag map to a frontend client):

```typescript
const allFlags = await this.flags.evaluateAll();
// { NEW_DASHBOARD: true, NEW_INVOICE_ENGINE: false, ... }
```

## Percentage Rollout

Percentage rollout lets you expose a feature to a fraction of users and increase that fraction over time. The module uses murmurhash3 to hash `flagKey + userId` (or `flagKey + tenantId` when no user is present) and takes the result modulo 100. Because the hash is deterministic, the same user always lands in the same bucket -- they will not flicker between enabled and disabled across requests.

### Step-by-step rollout

Start by creating the flag with the percentage set to `0`:

```typescript
await this.flags.create({
  key: 'NEW_DASHBOARD',
  description: 'Redesigned analytics dashboard',
  enabled: true,   // must be true for percentage to take effect
  percentage: 0,   // nobody gets it yet
});
```

::: warning
The `enabled` field must be `true` for percentage rollout to apply. When `enabled` is `false`, the flag is off for everyone regardless of `percentage`.
:::

Roll out to 10% of users:

```typescript
await this.flags.update('NEW_DASHBOARD', { percentage: 10 });
```

Monitor your error rates and user feedback. When you are satisfied, widen to 50%:

```typescript
await this.flags.update('NEW_DASHBOARD', { percentage: 50 });
```

Finally, complete the rollout:

```typescript
await this.flags.update('NEW_DASHBOARD', { percentage: 100 });
```

### How bucketing works

The evaluation at priority 5 in the cascade computes:

```
bucket = murmurhash3(flagKey + userId) % 100
```

If `bucket < percentage`, the flag is enabled. Users with hash values in the range `[0, 9]` are in the first 10%. When you increase to 50%, users `[0, 49]` are included -- so everyone who was already in the 10% cohort remains in the 50% cohort. This means users never lose access to a feature during a gradual widening.

::: tip
If no `userId` is available (for example, in a pre-authentication endpoint), the module falls back to hashing `flagKey + tenantId`. If neither is present, percentage rollout is skipped and evaluation falls through to the global `enabled` default.
:::

## Tenant Overrides

In a multi-tenant SaaS, you often want to give a specific tenant early access before the global rollout begins. Overrides take precedence over percentage rollout in the evaluation cascade.

### Enable for a design partner

Suppose tenant `acme-corp` is your design partner and should see `NEW_DASHBOARD` immediately, even while the global percentage is still at 0%:

```typescript
await this.flags.setOverride('NEW_DASHBOARD', {
  tenantId: 'acme-corp',
  enabled: true,
});
```

Every user in `acme-corp` now sees the new dashboard. Users in all other tenants remain subject to the global percentage.

### Disable for a specific tenant during rollout

If a tenant reports problems after you have rolled out to 50%, you can disable the flag just for them without affecting everyone else:

```typescript
await this.flags.setOverride('NEW_DASHBOARD', {
  tenantId: 'problem-tenant',
  enabled: false,
});
```

### Combine dimensions

Overrides support multiple dimensions. You can scope an override to a specific tenant, user, and environment simultaneously:

```typescript
await this.flags.setOverride('NEW_DASHBOARD', {
  tenantId: 'acme-corp',
  userId: 'user-42',
  environment: 'production',
  enabled: true,
});
```

### Evaluation priority

The full evaluation cascade, from highest to lowest priority:

| Priority | Layer                   | Description                                              |
| -------- | ----------------------- | -------------------------------------------------------- |
| 1        | **Archived**            | Archived flags always return `false`                     |
| 2        | **User override**       | Override matching the current `userId`                   |
| 3        | **Tenant override**     | Override matching the current `tenantId`                 |
| 4        | **Environment override**| Override matching the current `environment`              |
| 5        | **Percentage rollout**  | Deterministic hash of `flagKey + userId` mod 100         |
| 6        | **Global default**      | The flag's `enabled` field                               |

The first matching layer wins. A user override beats a tenant override, which beats a percentage rollout.

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

Turn on the flag and set a small percentage, or use tenant overrides to target specific customers:

```typescript
await this.flags.update('NEW_DASHBOARD', {
  enabled: true,
  percentage: 10,
});

// Give design partners immediate access
await this.flags.setOverride('NEW_DASHBOARD', {
  tenantId: 'acme-corp',
  enabled: true,
});
```

### 3. Widen and complete rollout

Gradually increase the percentage as confidence grows:

```typescript
await this.flags.update('NEW_DASHBOARD', { percentage: 50 });
// ... monitor ...
await this.flags.update('NEW_DASHBOARD', { percentage: 100 });
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
