---
description: "Configure tenant extraction for NestJS from headers, subdomains, verified JWT claims, paths, or custom sources, with validation and authorization."
---

# Tenant Extractors

Five built-in extractors cover common identifier sources. Extraction finds an identifier; validation checks its format, and your application authorizes the caller's access to that tenant. The default HTTP validator accepts UUID-shaped strings. Use a custom validator for slugs.

## Header (default)

```typescript
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id', // shorthand for HeaderTenantExtractor
})
```

A client-controlled header is not proof of tenant membership. Authenticate first and check the resolved tenant against the authenticated principal.

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

Uses the `psl` dependency for ccTLD parsing. Format validation does not check tenant existence or membership.

## JWT Claim

```typescript
import { JwtClaimTenantExtractor } from '@nestarc/tenancy';

TenancyModule.forRoot({
  tenantExtractor: new JwtClaimTenantExtractor({
    claimKey: 'org_id',
    headerName: 'authorization', // default
  }),
})
// Authorization: Bearer eyJ... → decoded payload.org_id
```

The extractor decodes the JWT payload; it does **not** verify its signature, issuer, audience, or expiry. Verify the token before extraction and compare its tenant claim with the verified principal.

### Authentication before tenant extraction

Register authentication with `app.use()` **before** calling `app.init()` or `app.listen()`. Nest module import order does not guarantee that another module's middleware runs before tenancy's global middleware. A Nest authentication Guard also runs too late to protect tenant resolution and its lifecycle hooks: middleware runs before Guards.

This Express bootstrap fragment assumes your `authenticate` middleware verifies the token and populates `req.user` before calling `next()`; unauthenticated requests must be rejected there.

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { authenticate } from './auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(authenticate);
  await app.listen(3000); // initializes module middleware after app.use()
}
void bootstrap();
```

Read custom properties through a checked shape, because the public hook request uses `unknown` for adapter-specific fields:

```typescript
import { ForbiddenException } from '@nestjs/common';
import { TenancyModule } from '@nestarc/tenancy';

TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  onTenantResolved: (tenantId, request) => {
    const user = request.user;
    if (
      typeof user !== 'object' || user === null ||
      !('org_id' in user) || user.org_id !== tenantId
    ) {
      throw new ForbiddenException('Tenant mismatch');
    }
  },
});
```

The hook is an authorization check after extraction, not an alternative to authentication. See the [runnable HTTP example](https://github.com/nestarc/nestjs-tenancy/tree/v0.16.1/examples/quickstart) for bootstrap, authentication, and membership checks together.

## Path Parameter

```typescript
import { PathTenantExtractor } from '@nestarc/tenancy';

TenancyModule.forRoot({
  tenantExtractor: new PathTenantExtractor({
    pattern: '/api/tenants/:tenantId/resources',
    paramName: 'tenantId',
  }),
  validateTenantId: (id) => /^[a-z0-9-]+$/.test(id),
})
// /api/tenants/acme/resources → 'acme'
```

From **0.16.1**, the extractor prefers `request.path` and falls back to `request.url` when the path is absent or empty. Query strings and fragments are removed before matching. This supports path extraction from a raw Node request; authentication, cookies, and response methods still depend on the HTTP adapter and middleware.

If you must remain on **0.16.0**, normalize the raw URL into `path` with this compatibility wrapper:

```typescript
import { PathTenantExtractor, TenancyModule } from '@nestarc/tenancy';

const pathExtractor = new PathTenantExtractor({
  pattern: '/api/tenants/:tenantId/resources',
  paramName: 'tenantId',
});

TenancyModule.forRoot({
  tenantExtractor: {
    extract(request) {
      return pathExtractor.extract({
        ...request,
        path: (request.path || request.url || '').split(/[?#]/, 1)[0],
      });
    },
  },
  validateTenantId: (id) => /^[a-z0-9-]+$/.test(id),
});
```

## Composite (Fallback Chain)

```typescript
import {
  CompositeTenantExtractor,
  HeaderTenantExtractor,
  SubdomainTenantExtractor,
} from '@nestarc/tenancy';

TenancyModule.forRoot({
  tenantExtractor: new CompositeTenantExtractor([
    new HeaderTenantExtractor('X-Tenant-Id'),
    new SubdomainTenantExtractor(),
  ]),
  validateTenantId: (id) => /^[a-z0-9-]+$/.test(id),
})
// First non-null result wins; accepts slug identifiers from either source.
```

The chain falls back only when extraction returns `null`. An invalid first result fails validation; it does not retry later extractors. Choose one identifier format across the chain and authorize the selected result.

## Custom Extractor

Cookies must already have been parsed by upstream middleware; raw Node requests do not have parsed cookies automatically.

```typescript
import type { TenantExtractor, TenancyRequest } from '@nestarc/tenancy';

export class CookieTenantExtractor implements TenantExtractor {
  extract(request: TenancyRequest): string | null {
    const cookies = request.cookies;
    if (typeof cookies !== 'object' || cookies === null || !('tenant_id' in cookies)) {
      return null;
    }
    return typeof cookies.tenant_id === 'string' ? cookies.tenant_id : null;
  }
}
```
