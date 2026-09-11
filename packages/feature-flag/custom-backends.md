---
description: "FeatureFlagRepository and TenantContextProvider contracts, published 0.5.0 registration limits, and unreleased direct options for custom NestJS feature-flag integrations."
---

# Custom backends

The package defines `CacheAdapter`, `FeatureFlagRepository`, and `TenantContextProvider` interfaces. The defaults are memory caching, Prisma storage, and optional integration with a configured `@nestarc/tenancy` module. [Cache adapters](./cache-adapters) already accept a `cacheAdapter` instance in published 0.5.0.

::: warning Repository and tenant-provider registration is unreleased
In npm **0.5.0**, registering `FEATURE_FLAG_REPOSITORY` or `TENANT_CONTEXT_PROVIDER` in `AppModule.providers` does not replace the providers inside `FeatureFlagModule`. Do not pass `prisma: null` based on that pattern. The direct `repository` and `tenantContextProvider` options below belong to **unreleased source changes**. Use Prisma and explicit evaluation context on 0.5.0, or validate a source build that contains the fixes. See [the version boundary](./agent-guide#version-boundary).
:::

## Repository contract

A custom repository must implement the complete exported `FeatureFlagRepository` interface. The 0.5 contract uses attribute criteria and priorities:

```typescript
interface OverrideCriteria {
  attributes: TargetingAttributes;
}

interface UpdateOverrideInput {
  enabled: boolean;
  priority: number;
}

// Relevant methods from FeatureFlagRepository:
// createOverride(flagId, criteria, enabled, priority): Promise<void>
// updateOverride(id, input: UpdateOverrideInput): Promise<void>
// findAllActiveFlags(): Promise<FeatureFlagWithOverrides[]>
```

Import these types from `@nestarc/feature-flag`; see [the complete release interface](/api/feature-flag/#api-featureflagrepository). The old `tenantId`/`userId`/`environment` criteria and `updateOverrideEnabled()` method are not the current repository contract.

`findFlagByKey()` must preserve archived records so evaluation can report an archived false result; `findAllActiveFlags()` excludes archived records and includes each flag's overrides. Preserve unique flag keys, unique override attribute sets per flag, valid timestamps, and deterministic override ordering. The service normalizes override attributes. The default Prisma repository validates percentages and translates Prisma errors such as `P2002` and `P2025` into Nest exceptions; that behavior is not supplied automatically to a custom repository. Validate integer percentages from 0 to 100 and throw `ConflictException` for duplicate keys and `NotFoundException` for missing update/archive targets. Arbitrary database errors do not automatically become HTTP 409 or 404.

## Registration from an unreleased source build

Given a `StorageModule` that exports a complete `CustomFlagRepository` and a `RequestContextModule` that exports `AppTenantProvider`, inject those instances through the factory:

```typescript
FeatureFlagModule.forRootAsync({
  imports: [StorageModule, RequestContextModule],
  inject: [CustomFlagRepository, AppTenantProvider],
  useFactory: (
    repository: CustomFlagRepository,
    tenantContextProvider: AppTenantProvider,
  ) => ({
    environment: 'production',
    repository,
    tenantContextProvider,
  }),
});
```

This is a registration fragment, not a complete persistence implementation. `repository` takes precedence over `prisma`; `prisma` is optional only when a repository instance is supplied. `forRoot()` accepts the same instances when they are created outside Nest dependency injection. Do not register duplicate parent-module tokens as a substitute. Instance ownership remains with the caller: a supplied repository or tenant provider is not additionally initialized or destroyed by this module. For injected Nest providers, let their declaring module manage lifecycle hooks.

## Tenant context

The `TenantContextProvider` interface is:

```typescript
import type { TenantContextProvider } from '@nestarc/feature-flag';

export class AppTenantProvider implements TenantContextProvider {
  getCurrentTenantId(): string | null {
    return null; // Replace with your established request or job context.
  }
}
```

The default provider tries to resolve `TenancyService` from the Nest application and reads its current tenant on evaluation. Installing `@nestarc/tenancy` alone does not establish a tenant: configure its module and run within a tenant context. If resolution is unavailable, the default provider returns null. Explicit context still works without tenancy:

```typescript
await flags.isEnabled('NEW_CHECKOUT', {
  tenantId: 'tenant-1',
  userId: 'user-42',
});
```

In the unreleased options API, a custom tenant provider is used for ambient resolution. An explicitly supplied `tenantId` overrides it; an explicit null suppresses ambient fallback.
