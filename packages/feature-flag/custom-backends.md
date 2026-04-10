---
description: "Swap the persistence layer and tenant resolver in @nestarc/feature-flag — FeatureFlagRepository and TenantContextProvider interfaces for custom backends."
---

# Custom Backends

<Badge type="info" text="v0.2.0" />

`@nestarc/feature-flag` uses a **Ports & Adapters** architecture. Three interfaces define the extension points:

| Port | Default Adapter | DI Token | Purpose |
|------|----------------|----------|---------|
| `CacheAdapter` | `MemoryCacheAdapter` | `CACHE_ADAPTER` | Flag caching ([docs](./cache-adapters)) |
| `FeatureFlagRepository` | `PrismaFeatureFlagRepository` | `FEATURE_FLAG_REPOSITORY` | Flag persistence |
| `TenantContextProvider` | `DefaultTenantContextProvider` | `TENANT_CONTEXT_PROVIDER` | Tenant ID resolution |

This page covers the **Repository** and **TenantContextProvider** ports. For cache adapters, see [Cache Adapters](./cache-adapters).

## FeatureFlagRepository

The repository interface defines how flags and overrides are stored and retrieved. Implement it to use any database — MongoDB, DynamoDB, in-memory stores, or even an external feature flag service.

### Interface

```typescript
import type {
  FeatureFlagRepository,
  OverrideCriteria,
} from '@nestarc/feature-flag';

interface FeatureFlagRepository {
  // Flag CRUD
  createFlag(input: CreateFeatureFlagInput): Promise<FeatureFlagWithOverrides>;
  updateFlag(key: string, input: UpdateFeatureFlagInput): Promise<FeatureFlagWithOverrides>;
  archiveFlag(key: string): Promise<FeatureFlagWithOverrides>;

  // Flag queries
  findFlagByKey(key: string): Promise<FeatureFlagWithOverrides | null>;
  findFlagIdByKey(key: string): Promise<string | null>;
  findAllActiveFlags(): Promise<FeatureFlagWithOverrides[]>;

  // Override operations
  findOverride(flagId: string, criteria: OverrideCriteria): Promise<{ id: string } | null>;
  createOverride(flagId: string, criteria: OverrideCriteria, enabled: boolean): Promise<void>;
  updateOverrideEnabled(id: string, enabled: boolean): Promise<void>;
  deleteOverride(id: string): Promise<void>;
}
```

### OverrideCriteria

```typescript
interface OverrideCriteria {
  tenantId?: string | null;
  userId?: string | null;
  environment?: string | null;
}
```

### Example: MongoDB Implementation

```typescript
import { Injectable } from '@nestjs/common';
import type {
  FeatureFlagRepository,
  FeatureFlagWithOverrides,
  CreateFeatureFlagInput,
  UpdateFeatureFlagInput,
  OverrideCriteria,
} from '@nestarc/feature-flag';
import { Collection, Db } from 'mongodb';

@Injectable()
export class MongoFeatureFlagRepository implements FeatureFlagRepository {
  private flags: Collection;
  private overrides: Collection;

  constructor(private readonly db: Db) {
    this.flags = db.collection('feature_flags');
    this.overrides = db.collection('feature_flag_overrides');
  }

  async createFlag(input: CreateFeatureFlagInput): Promise<FeatureFlagWithOverrides> {
    const flag = {
      id: crypto.randomUUID(),
      ...input,
      enabled: input.enabled ?? false,
      percentage: input.percentage ?? 0,
      metadata: input.metadata ?? {},
      archivedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.flags.insertOne(flag);
    return { ...flag, overrides: [] };
  }

  async findFlagByKey(key: string): Promise<FeatureFlagWithOverrides | null> {
    const flag = await this.flags.findOne({ key, archivedAt: null });
    if (!flag) return null;

    const overrides = await this.overrides.find({ flagId: flag.id }).toArray();
    return { ...flag, overrides } as FeatureFlagWithOverrides;
  }

  async findAllActiveFlags(): Promise<FeatureFlagWithOverrides[]> {
    const flags = await this.flags.find({ archivedAt: null }).toArray();
    // attach overrides to each flag...
    return flags as FeatureFlagWithOverrides[];
  }

  // ... implement remaining methods
}
```

### Registration

Provide your custom repository using the `FEATURE_FLAG_REPOSITORY` injection token:

```typescript
import { Module } from '@nestjs/common';
import {
  FeatureFlagModule,
  FEATURE_FLAG_REPOSITORY,
} from '@nestarc/feature-flag';
import { MongoFeatureFlagRepository } from './mongo-feature-flag.repository';

@Module({
  imports: [
    FeatureFlagModule.forRoot({
      environment: 'production',
      prisma: null, // not needed when using a custom repository
    }),
  ],
  providers: [
    {
      provide: FEATURE_FLAG_REPOSITORY,
      useClass: MongoFeatureFlagRepository,
    },
  ],
})
export class AppModule {}
```

::: warning
When providing a custom repository, you are responsible for:
- Enforcing unique constraints on flag keys
- Filtering out archived flags in `findAllActiveFlags()`
- Handling concurrent override upserts (idempotent `createOverride` / `deleteOverride`)
:::

### Error Conventions

The `FeatureFlagService` expects the repository to follow these conventions:

| Scenario | Expected Behavior |
|----------|------------------|
| Duplicate flag key on `createFlag()` | Throw a recognizable error (service maps to 409) |
| Missing flag on `updateFlag()` / `archiveFlag()` | Return `null` or throw (service maps to 404) |
| `findAllActiveFlags()` | Only return flags where `archivedAt` is `null` |
| Percentage value | Must be validated as 0–100 |

---

## TenantContextProvider

The tenant context provider resolves the current tenant ID for override evaluation. The default implementation auto-detects `@nestarc/tenancy` and calls `TenancyService.getCurrentTenant()`.

### Interface

```typescript
import type { TenantContextProvider } from '@nestarc/feature-flag';

interface TenantContextProvider {
  getCurrentTenantId(): string | null;
}
```

### Default Behavior

`DefaultTenantContextProvider` does the following:
1. Tries to import `@nestarc/tenancy` at module init
2. If available, calls `TenancyService.getCurrentTenant()` on each evaluation
3. If `@nestarc/tenancy` is not installed, returns `null` (tenant overrides are skipped)

This means **tenant overrides work automatically** if you have `@nestarc/tenancy` installed — no configuration needed.

### Custom Implementation

Override when your tenant context comes from a different source:

```typescript
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import type { TenantContextProvider } from '@nestarc/feature-flag';

@Injectable()
export class ClsTenantProvider implements TenantContextProvider {
  constructor(private readonly cls: ClsService) {}

  getCurrentTenantId(): string | null {
    return this.cls.get('tenantId') ?? null;
  }
}
```

### Registration

```typescript
import { TENANT_CONTEXT_PROVIDER } from '@nestarc/feature-flag';

@Module({
  imports: [FeatureFlagModule.forRoot({ /* ... */ })],
  providers: [
    {
      provide: TENANT_CONTEXT_PROVIDER,
      useClass: ClsTenantProvider,
    },
  ],
})
export class AppModule {}
```

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│           FeatureFlagService            │
│   isEnabled() · evaluateAll() · CRUD    │
├───────────┬───────────┬─────────────────┤
│ CacheAdapter │ Repository │ TenantContext │  ← Ports
├───────────┼───────────┼─────────────────┤
│  Memory   │  Prisma   │   Default       │  ← Default Adapters
│  Redis    │  (yours)  │   (yours)       │  ← Swappable
└───────────┴───────────┴─────────────────┘
```

All three ports are independent — you can swap one without affecting the others. For example, use `RedisCacheAdapter` with `PrismaFeatureFlagRepository` and a custom `TenantContextProvider`.
