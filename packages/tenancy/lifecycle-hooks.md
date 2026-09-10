---
description: "React to tenant resolution events with typed lifecycle hooks for logging, authorization checks, and missing-tenant responses."
---

# Lifecycle Hooks

Hooks receive `TenancyRequest` and `TenancyResponse`, the package's small public HTTP interfaces. Authenticate before resolution if a hook uses the caller's identity; see [authentication ordering](./extractors#authentication-before-tenant-extraction).

## Resolved tenant

The callback runs inside the tenant's AsyncLocalStorage context, so `getCurrentTenant()` works here. This application fragment assumes your logger and audit service are available in its scope:

```typescript
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  onTenantResolved: async (tenantId, request) => {
    logger.info({ tenantId, path: request.path ?? request.url }, 'tenant resolved');
    await auditService.recordAccess(tenantId);
  },
});
```

## Missing tenant

Choose one response strategy. Returning `void` continues middleware processing; the tenancy Guard can still reject a tenant-required route later.

Observe and continue:

```typescript
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  onTenantNotFound: (request) => {
    console.warn('No tenant', request.path ?? request.url);
  },
});
```

Reject with a Nest exception:

```typescript
import { ForbiddenException } from '@nestjs/common';
import { TenancyModule } from '@nestarc/tenancy';

TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  onTenantNotFound: () => {
    throw new ForbiddenException('Tenant header required');
  },
});
```

Send a response and return `'skip'` to prevent `next()`. This example requires the **Express** adapter; its response provides `status()` and `json()`, which are optional in the package's public interface:

```typescript
import { TenancyModule } from '@nestarc/tenancy';
import type { TenancyResponse } from '@nestarc/tenancy';
import type { Response } from 'express';

TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  onTenantNotFound: (_request, response) => {
    const expressResponse = response as TenancyResponse & Response;
    expressResponse.status(401).json({ message: 'Tenant header required' });
    return 'skip';
  },
});
```

Fastify's middleware stage may provide a raw Node `ServerResponse`, not a `FastifyReply`. Use the actual adapter's response API; do not assume casting changes the object.

| Hook | Signature | When |
|------|-----------|------|
| `onTenantResolved` | `(tenantId: string, req: TenancyRequest) => void \| Promise<void>` | After successful extraction and validation |
| `onTenantNotFound` | `(req: TenancyRequest, res: TenancyResponse) => void \| 'skip' \| Promise<void \| 'skip'>` | When no tenant ID could be extracted |

## Error Responses

| Scenario | Status | Message |
|----------|--------|---------|
| Missing tenant header (no `@BypassTenancy`) | 403 | `Tenant ID is required` |
| Invalid tenant ID format | 400 | `Invalid tenant ID format` |
| Non-HTTP context (WebSocket, gRPC) | — | HTTP Guard skips; configure [RPC validation and authorization](./microservice) separately |

## Tenant ID Forgery Prevention

Cross-checking two client-controlled values does not authenticate either one. If the secondary source is a JWT, verify that token upstream before using its claim:

```typescript
import { JwtClaimTenantExtractor, TenancyModule } from '@nestarc/tenancy';

TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  crossCheck: {
    extractor: new JwtClaimTenantExtractor({ claimKey: 'tenantId' }),
    onFailed: 'reject', // 'reject' (default) | 'log'
    required: true,    // reject when the authenticated secondary claim is absent
  },
});
```

`required` defaults to `false`, which skips validation when the secondary extractor returns `null`. Use `true` for routes that require this secondary identity. A mismatch emits `tenant.cross_check_failed`.

::: warning v0.12.0 migration
The flat `crossCheckExtractor` / `onCrossCheckFailed` fields were removed. Use `crossCheck: { extractor, onFailed, required }`.
:::

## Lifecycle event payloads in 0.16

Event-emitter payloads no longer expose the deprecated raw `request` field. Listeners for resolved, not-found, extraction-failed, validation-failed, and cross-check-failed events must use `requestSummary` and other declared fields. Custom emitters must stop attaching raw requests. This removal does not remove the explicit request argument from middleware hooks.

See [Migration](./migration#upgrade-to-0-16) for the version-specific removal schedule of other deprecated APIs.
