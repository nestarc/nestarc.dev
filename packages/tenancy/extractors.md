---
description: "Five built-in tenant extractors for @nestarc/tenancy — header, subdomain, path, JWT claim, and custom extraction strategies."
---

# Tenant Extractors

Five built-in extractors cover common multi-tenancy patterns:

## Header (default)

```typescript
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id', // shorthand for HeaderTenantExtractor
})
```

## Subdomain

```typescript
import { SubdomainTenantExtractor } from '@nestarc/tenancy';

TenancyModule.forRoot({
  tenantExtractor: new SubdomainTenantExtractor({
    excludeSubdomains: ['www', 'api'], // optional, defaults to ['www']
  }),
  validateTenantId: (id) => /^[a-z0-9-]+$/.test(id),
})
// tenant1.app.com → 'tenant1'
```

> **Note:** Uses the `psl` package for accurate ccTLD parsing (installed automatically as a dependency).

## JWT Claim

```typescript
import { JwtClaimTenantExtractor } from '@nestarc/tenancy';

TenancyModule.forRoot({
  tenantExtractor: new JwtClaimTenantExtractor({
    claimKey: 'org_id',       // JWT payload key
    headerName: 'authorization', // optional, defaults to 'authorization'
  }),
})
// Authorization: Bearer eyJ... → payload.org_id
```

> **Security:** This extractor does **not** verify the JWT signature. You must ensure JWT signature verification happens at the **middleware level** — not in a NestJS Guard.
>
> NestJS execution order is: **Middleware → Guards → Interceptors → Pipes**. Since `TenantMiddleware` runs at the middleware stage, a NestJS Guard (e.g., `@nestjs/passport` `AuthGuard`) runs *after* the tenant is already resolved and cannot protect it.
>
> **Middleware ordering:** `TenancyModule` registers `TenantMiddleware` globally via its own `configure()` call. To run JWT verification *before* tenant extraction, you have two options:
>
> **Option 1 (recommended) — Import an auth module before TenancyModule:**
>
> NestJS applies middleware in the order modules are initialized. If your auth middleware is registered in a module that is imported before `TenancyModule`, it will run first.
>
> ```typescript
> // auth.module.ts — registers JWT verification middleware globally
> @Module({})
> export class AuthModule implements NestModule {
>   configure(consumer: MiddlewareConsumer) {
>     consumer
>       .apply(JwtVerifyMiddleware) // verifies signature, populates req.user
>       .forRoutes('*');
>   }
> }
>
> // app.module.ts — import AuthModule BEFORE TenancyModule
> @Module({
>   imports: [
>     AuthModule,        // middleware runs first
>     TenancyModule.forRoot({
>       tenantExtractor: new JwtClaimTenantExtractor({ claimKey: 'org_id' }),
>     }),
>   ],
> })
> export class AppModule {}
> ```
>
> **Option 2 — Verify the JWT claim in `onTenantResolved`:**
>
> If you need to ensure the resolved tenant matches the authenticated user, use the `onTenantResolved` hook. This does not replace signature verification but lets you add an authorization check after extraction:
>
> ```typescript
> TenancyModule.forRoot({
>   tenantExtractor: new JwtClaimTenantExtractor({ claimKey: 'org_id' }),
>   onTenantResolved: (tenantId, req) => {
>     // req.user is populated by an upstream auth middleware
>     if (req.user?.org_id !== tenantId) {
>       throw new ForbiddenException('Tenant mismatch');
>     }
>   },
> })
> ```

## Path Parameter

```typescript
import { PathTenantExtractor } from '@nestarc/tenancy';

TenancyModule.forRoot({
  tenantExtractor: new PathTenantExtractor({
    pattern: '/api/tenants/:tenantId/resources',
    paramName: 'tenantId',
  }),
})
// /api/tenants/acme/resources → 'acme'
```

## Composite (Fallback Chain)

```typescript
import {
  CompositeTenantExtractor,
  HeaderTenantExtractor,
  SubdomainTenantExtractor,
  JwtClaimTenantExtractor,
} from '@nestarc/tenancy';

TenancyModule.forRoot({
  tenantExtractor: new CompositeTenantExtractor([
    new HeaderTenantExtractor('X-Tenant-Id'),
    new SubdomainTenantExtractor(),
    new JwtClaimTenantExtractor({ claimKey: 'org_id' }),
  ]),
})
// Tries each extractor in order, returns the first non-null result
```

## Custom Extractor

```typescript
import { TenantExtractor } from '@nestarc/tenancy';
import { Request } from 'express';

export class CookieTenantExtractor implements TenantExtractor {
  extract(request: Request): string | null {
    return request.cookies?.['tenant_id'] ?? null;
  }
}
```
