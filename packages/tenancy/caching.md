---
description: "Scope NestJS response cache keys by tenant with TenantCacheInterceptor and SharedTenantCache."
---

# Tenant-Aware Caching

PostgreSQL RLS protects database rows, but it does not protect Redis, in-memory response caches, or other application cache stores. If two tenants hit the same route and the cache key is only the URL, an unscoped response cache can leak one tenant's data to another tenant.

Install Nest's optional cache runtime when you want response caching:

```bash
npm install @nestjs/cache-manager cache-manager
```

Register Nest caching alongside the tenancy module. Keep core tenancy imports from `@nestarc/tenancy`:

```typescript
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TenancyModule } from '@nestarc/tenancy';

@Module({
  imports: [
    CacheModule.register(),
    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id',
    }),
  ],
})
export class AppModule {}
```

Use `TenantCacheInterceptor` from the cache subpath on routes that should cache per tenant:

```typescript
import { CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { TenantCacheInterceptor } from '@nestarc/tenancy/cache';

@Controller('products')
export class ProductsController {
  @UseInterceptors(TenantCacheInterceptor)
  @CacheTTL(60)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}
```

By default, the interceptor turns Nest's base cache key into `tenant:{tenantIdLength}:{tenantId}:{baseCacheKey}`. The length prefix keeps tenant IDs containing `:` or another configured separator from colliding with opaque Nest cache keys. The base cache key is the same key Nest's `CacheInterceptor` would have used, including any `@CacheKey()` override.

## Shared Cache Entries

For routes where the response is intentionally public or shared across tenants, opt in with `@SharedTenantCache()` from `@nestarc/tenancy/cache`:

```typescript
import { CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { BypassTenancy } from '@nestarc/tenancy';
import { SharedTenantCache, TenantCacheInterceptor } from '@nestarc/tenancy/cache';

@Controller('catalog')
export class CatalogController {
  @BypassTenancy()
  @SharedTenantCache()
  @UseInterceptors(TenantCacheInterceptor)
  @CacheTTL(300)
  @Get()
  publicCatalog() {
    return this.catalogService.publicCatalog();
  }
}
```

`@SharedTenantCache()` affects cache keys only: shared routes use `shared:{baseCacheKey}` instead of a tenant-prefixed key. It does not bypass `TenancyGuard`, clear tenant context, or authorize access. If a public route should skip the tenant-required guard, it still needs `@BypassTenancy()`.

## Global Interceptor

To apply tenant-aware caching globally, register the interceptor as an `APP_INTERCEPTOR`. Optional cache interceptor settings are provided through the cache subpath token:

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { TenancyModule } from '@nestarc/tenancy';
import {
  TENANT_CACHE_INTERCEPTOR_OPTIONS,
  TenantCacheInterceptor,
} from '@nestarc/tenancy/cache';

@Module({
  imports: [
    CacheModule.register(),
    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id',
    }),
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TenantCacheInterceptor },
    {
      provide: TENANT_CACHE_INTERCEPTOR_OPTIONS,
      useValue: { hashTenantId: true },
    },
  ],
})
export class AppModule {}
```

Cache invalidation remains application- and store-specific. Invalidate every tenant-scoped key shape your application writes, including any shared cache keys you opt into.

## Missing tenant context

Version 0.15 connects `TenantCacheInterceptor` to the shared non-HTTP missing-context policy. Configure it once on `TenancyModule`:

```typescript
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  missingContext: { policy: 'throw' },
});
```

`ignore` preserves the earlier behavior, `warn` reports `tenant.context_missing`, and `throw` raises `TenantContextMissingError` before an unscoped cache entry can be used. Shared routes annotated with `@SharedTenantCache()` remain an explicit exception and use their intentional shared key.

For arbitrary Redis keys or search indexes outside Nest response caching, use [Non-HTTP Resources](./non-http-resources).
