---
description: "Upgrade @nestarc/tenancy through 0.12, 0.13, and 0.14, including cross-check configuration, tenant-aware caching, Node and Prisma transitions, verification, and rollback."
---

# Migration Guide

This guide covers the supported release path from 0.11.x through 0.12, 0.13, and 0.14. Review every intervening section when skipping versions: pre-1.0 minor releases can contain breaking changes.

The 0.12–0.14 release notes do not declare a tenancy-owned database migration. The 0.14 Prisma 7 work changes client generation and runtime construction, not your tenant columns or PostgreSQL RLS policies. Keep application schema migrations separate and run the tenancy drift check before and after deployment.

## Compatibility by release

| Release | Node.js | Prisma peer range | NestJS peer range | Required application change |
|---|---|---|---|---|
| 0.12.x | `>=18` | `^5.0.0 || ^6.0.0` | 10 or 11 | Replace removed flat cross-check options. |
| 0.13.x | `>=18` | `^5.0.0 || ^6.0.0` | 10 or 11 | None for existing core users; cache APIs use a new subpath and optional peers. |
| 0.14.x | `>=20.19.0` | `^6.0.0 || ^7.0.0` | 10 or 11 | Upgrade Node; move off Prisma 5. Prisma 7 users also adopt Prisma Config, an explicit generated client, and a driver adapter. |

Prisma 6 remains supported in 0.14. If you are upgrading both tenancy and Prisma, the lowest-risk sequence is:

1. Upgrade the runtime to Node 20.19 or newer.
2. Upgrade `@nestarc/tenancy` to 0.14 while staying on Prisma 6.
3. Verify tenant isolation.
4. Migrate Prisma 6 to Prisma 7 as a separate deployment.

This separates tenancy behavior from generated-client and driver-adapter changes and gives each transition its own rollback point.

## Before upgrading

### Record the current state

Capture the versions used by local development, CI, and production images:

```bash
node --version
npm ls @nestarc/tenancy @prisma/client prisma @nestjs/common @nestjs/core
npx prisma --version
```

Preserve the current lockfile, built deployment artifact or container image, Prisma schema, generated client configuration, and tenancy module configuration. Rollback should restore these as one tested unit rather than resolving an older package against a newer lockfile.

### Find affected configuration

Search for the removed 0.12 options, optional 0.13 cache imports, and Prisma client construction that changes when adopting Prisma 7:

```bash
rg "crossCheckExtractor|onCrossCheckFailed" src test
rg "@nestarc/tenancy/cache|TenantCacheInterceptor|SharedTenantCache" src test
rg "prisma-client-js|from '@prisma/client'|new PrismaClient" src prisma
```

No match is expected for features your application does not use.

### Establish a security baseline

Before changing dependencies:

- Run the application build, unit tests, and PostgreSQL-backed tenant-isolation tests.
- Verify tenant A cannot read or mutate tenant B rows.
- Verify a request with a missing, invalid, or mismatched tenant identity follows your intended status and logging policy.
- Exercise each interactive transaction path. Prefer the public `tenancyTransaction()` helper unless you intentionally accept the compatibility risk of `interactiveTransactionSupport`.
- Check RLS policy drift:

```bash
npx @nestarc/tenancy check
```

If you use a non-default PostgreSQL setting key, pass the same key configured in your module, Prisma extension, transaction helper, and policies:

```bash
npx @nestarc/tenancy check --db-setting-key=custom.tenant_key
```

## Upgrade to 0.12

```bash
npm install @nestarc/tenancy@0.12.0
```

### Breaking: grouped cross-check configuration

0.12 removes the deprecated `crossCheckExtractor` and `onCrossCheckFailed` module options. Move both values under `crossCheck`:

```typescript
import { JwtClaimTenantExtractor, TenancyModule } from '@nestarc/tenancy';

// Before 0.12
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  crossCheckExtractor: new JwtClaimTenantExtractor({ claimKey: 'org_id' }),
  onCrossCheckFailed: 'reject',
});

// 0.12+
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  crossCheck: {
    extractor: new JwtClaimTenantExtractor({ claimKey: 'org_id' }),
    onFailed: 'reject',
    required: false,
  },
});
```

`onCrossCheckFailed` maps to `crossCheck.onFailed`; it is not the `onTenantNotFound` lifecycle hook. The `onTenantResolved` and `onTenantNotFound` signatures do not require a 0.12 change.

Cross-check behavior after migration:

- Matching primary and secondary tenant ids continue normally.
- A mismatch uses `onFailed: 'reject'` by default, or logs and continues with `'log'`.
- A missing secondary value is skipped when `required` is omitted or `false`.
- A missing secondary value is rejected when `required: true`.
- A mismatch emits `tenant.cross_check_failed`.

See [Lifecycle Hooks and cross-checking](./lifecycle-hooks) for the current callbacks and failure semantics.

### Other 0.12 changes

- The package now declares its existing Node.js 18 minimum through `engines.node`.
- `prompts` became a regular dependency, so `npx @nestarc/tenancy init` works in a normal package installation.
- The root and `@nestarc/tenancy/testing` public entrypoints did not move.

These items need no application code change unless an install policy treats engine metadata as an error.

### Verify 0.12

Test all four cross-check combinations: match, mismatch, missing secondary with `required: false`, and missing secondary with `required: true`. Also confirm that `onTenantNotFound` still sends a response before returning `'skip'`; returning `'skip'` alone prevents `next()` and leaves the request open.

## Upgrade to 0.13

```bash
npm install @nestarc/tenancy@0.13.0
```

0.13 has no declared breaking API change for existing tenancy users. It fixes NestJS 10 middleware wildcard registration while retaining the NestJS 11 named wildcard path.

### Optional tenant-aware response caching

PostgreSQL RLS does not isolate application response caches. If the application caches tenant-scoped routes, install the optional peers supported by 0.13 and import cache APIs from their dedicated subpath:

```bash
npm install @nestjs/cache-manager cache-manager
```

```typescript
import { CacheModule, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Module, UseInterceptors } from '@nestjs/common';
import { TenancyModule } from '@nestarc/tenancy';
import { TenantCacheInterceptor } from '@nestarc/tenancy/cache';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseInterceptors(TenantCacheInterceptor)
  @CacheTTL(60)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}

@Module({
  imports: [
    CacheModule.register(),
    TenancyModule.forRoot({ tenantExtractor: 'X-Tenant-Id' }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class AppModule {}
```

The root `@nestarc/tenancy` entrypoint deliberately does not eagerly import the cache runtime. Import `TenantCacheInterceptor`, `SharedTenantCache`, and `TENANT_CACHE_INTERCEPTOR_OPTIONS` from `@nestarc/tenancy/cache` only.

For an intentionally shared response, opt in explicitly:

```typescript
import { CacheModule } from '@nestjs/cache-manager';
import { BypassTenancy, TenancyModule } from '@nestarc/tenancy';
import { SharedTenantCache, TenantCacheInterceptor } from '@nestarc/tenancy/cache';
import { Controller, Get, Module, UseInterceptors } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class PublicCatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @BypassTenancy()
  @SharedTenantCache()
  @UseInterceptors(TenantCacheInterceptor)
  @Get('public')
  publicCatalog() {
    return this.catalogService.publicCatalog();
  }
}

@Module({
  imports: [
    CacheModule.register(),
    TenancyModule.forRoot({ tenantExtractor: 'X-Tenant-Id' }),
  ],
  controllers: [PublicCatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
```

`@SharedTenantCache()` changes cache-key generation only. It does not authorize access, bypass `TenancyGuard`, or clear tenant context; a public endpoint still needs `@BypassTenancy()`.

Applications that do not use Nest response caching do not need either optional dependency or any code change. See [Tenant-Aware Caching](./caching) for global interceptor configuration and hashed tenant keys.

### Verify 0.13

- Request the same URL as two tenants and confirm they do not share a cached response.
- Confirm a route with `@SharedTenantCache()` intentionally reuses its cache entry.
- Remove `@BypassTenancy()` temporarily in a test and confirm `@SharedTenantCache()` does not bypass the guard.
- Run an HTTP smoke test on the NestJS major used in production to cover middleware registration.

## Upgrade to 0.14

### 1. Upgrade Node before installing 0.14

0.14 raises `engines.node` from Node 18 to `>=20.19.0`. Update developer tooling, CI runners, production images, and serverless runtime declarations first, then confirm:

```bash
node --version
```

### 2. Choose a Prisma path

0.14 supports Prisma 6 and 7; Prisma 5 is no longer in the peer range.

The package engine accepts Node.js `>=20.19.0`; the Prisma 7 path additionally follows Prisma's runtime range of `^20.19.0`, `^22.12.0`, or `>=24.0.0`. Node 21, Node 23, and early Node 22 releases are therefore not valid Prisma 7 targets.

#### Stay on Prisma 6

This is the smallest tenancy-only upgrade:

```bash
npm install @nestarc/tenancy@0.14.0 @prisma/client@^6
npm install --save-dev prisma@^6
```

Prisma 6 consumers can retain the existing `@prisma/client` import, generator, datasource configuration, and client construction. Apply `createPrismaTenancyExtension()` to the same base client as before.

#### Move to Prisma 7

Install the Prisma 7 client, CLI, and PostgreSQL driver adapter:

```bash
npm install @nestarc/tenancy@0.14.0 @prisma/client@^7 @prisma/adapter-pg pg dotenv
npm install --save-dev prisma@^7
```

Use the Prisma 7 `prisma-client` generator with an explicit output and move the connection URL into Prisma Config:

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

```typescript
// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: { url: env('MIGRATION_DATABASE_URL') },
});
```

Use a schema-owner `MIGRATION_DATABASE_URL` for CLI migrations and keep `DATABASE_URL` for the restricted, non-owner runtime adapter below. Do not run the application with the migration credential because table owners and privileged roles can bypass RLS.

Generate the client and import it from the configured output instead of the `@prisma/client` root:

```bash
npx prisma validate
npx prisma generate
```

```typescript
import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { TenancyService, createPrismaTenancyExtension } from '@nestarc/tenancy';
import { PrismaClient } from './generated/prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit {
  public readonly client;

  constructor(private readonly tenancyService: TenancyService) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    const basePrisma = new PrismaClient({ adapter });

    this.client = basePrisma.$extends(
      createPrismaTenancyExtension(this.tenancyService),
    );
  }

  async onModuleInit() {
    await this.client.$connect();
  }
}
```

The tenancy extension API is unchanged. 0.14 internally imports the shared extension helper from `@prisma/client/extension`, so applications do not need to copy that internal fix into tenancy setup.

See [Installation](./installation) and the shared [Prisma 7 Setup](/guide/prisma-7) for the complete generated-client and adapter checklist.

### 3. Recheck extension configuration

Keep the same PostgreSQL setting key across the module, Prisma extension, PostgreSQL policies, and any `tenancyTransaction()` calls:

```typescript
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  dbSettingKey: 'app.current_tenant',
});

const extension = createPrismaTenancyExtension(tenancyService, {
  dbSettingKey: 'app.current_tenant',
  failClosed: true,
});
```

If `autoInjectTenantId` is enabled, `tenantIdField` is the Prisma data field name. For a schema field declared as `tenantId String @map("tenant_id")`, configure `tenantIdField: 'tenantId'`; the `@map` attribute handles the PostgreSQL column name.

If interactive transactions are used, pass the same key to `tenancyTransaction()`. Prefer that helper for new code because it uses public Prisma APIs; `interactiveTransactionSupport: true` relies on Prisma internals and should be covered by E2E tests for the exact Prisma version.

### Verify 0.14

Run dependency, generation, build, and drift checks in the same Node image used for production:

```bash
node --version
npm ls @nestarc/tenancy @prisma/client prisma
npx prisma validate
npx prisma generate
npm run build
npm test
npx @nestarc/tenancy check
```

Then run PostgreSQL-backed checks for:

- Tenant A/B read and write isolation.
- Missing tenant context under the configured `failClosed` policy.
- `sharedModels` and intentional `withoutTenant()` paths.
- `create`, `createMany`, `createManyAndReturn`, and `upsert` when `autoInjectTenantId` is enabled.
- Every interactive transaction path.
- Cross-check mismatch and missing-secondary behavior.
- Tenant-aware cache separation if the 0.13 cache API is enabled.

Do not promote a generated-client change based only on TypeScript compilation; start the application with the production database role and execute at least one tenant-scoped query.

## Deployment and rollback

### Deployment sequence

1. Deploy the required Node runtime before any 0.14 application artifact.
2. Run validation and isolation tests against a staging PostgreSQL database using a non-owner, non-superuser, `NOBYPASSRLS` application role.
3. Deploy one instance and verify tenant extraction, RLS queries, interactive transactions, and cache keys.
4. Complete the rollout only after error, cross-check failure, and tenant-not-found signals match the baseline.

Because these releases do not declare a tenancy database migration, application rollback does not require reverting tenancy-owned SQL. Do not revert unrelated Prisma schema migrations using this guide.

### Roll back 0.12

Restore the previous application artifact and lockfile. The grouped `crossCheck` shape was already available before 0.12, so it can remain when returning to a compatible 0.11 release. If you restore the older flat fields instead, restore configuration and package version together.

### Roll back 0.13

0.12 does not export `@nestarc/tenancy/cache`. Before starting a 0.12 artifact, restore code that does not import that subpath or disable the cache-enabled routes through the previously tested artifact. Optional cache packages may remain installed, but they are unused by tenancy core.

### Roll back 0.14

- If 0.14 stayed on Prisma 6, restore the previous 0.13 application artifact and lockfile. Node 20.19 can remain because 0.13 accepts Node 18 or newer.
- If 0.14 also introduced Prisma 7, restore Prisma 6 dependencies, the previous generator and datasource configuration, the `@prisma/client` import, and the previous generated client together. A 0.13 artifact is outside its declared peer range when paired with Prisma 7.
- Restore all replicas to the same generated-client strategy; do not leave a rollback half-complete across a mixed fleet.

After rollback, rerun the same package-version, build, drift, and tenant-isolation checks used for the upgrade.

## Reference

- [Current tenancy installation](./installation)
- [Lifecycle hooks and cross-checking](./lifecycle-hooks)
- [Tenant-aware caching](./caching)
- [Testing utilities](./testing)
- [Generated tenancy API reference](/api/tenancy/)
- [Project changelog](/changelog)
