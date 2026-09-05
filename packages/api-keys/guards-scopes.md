---
description: "Protect routes with ApiKeysGuard, require specific scopes with @RequireScope, and rely on write-implies-read semantics."
---

# Guards & Scopes

`ApiKeysGuard` reads the `Authorization` header, verifies the key, enforces route and origin policy, and attaches `ApiKeyContext` to the request. A conventional `Bearer` prefix is accepted and stripped; the raw key value is also accepted for compatibility.

## Protecting a route

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiKeysGuard, RequireScope } from '@nestarc/api-keys';

@Controller('reports')
@UseGuards(ApiKeysGuard)
export class ReportsController {
  @Get()
  @RequireScope('reports', 'read')
  list() {
    return [];
  }
}
```

Apply `@UseGuards(ApiKeysGuard)` at the controller level when every route uses API-key auth. Use `@RequireScope(resource, level)` per handler to specify the required permission.

## Scope model

Scopes are `{ resource, level }` pairs:

- `resource` is 1–128 ASCII characters, starts with a letter or digit, and then permits letters, digits, `.`, `_`, `/`, and `-`; `:` is reserved for the stored resource/level separator.
- `level` is `read` or `write`.
- `write` implies `read` — a key with `reports:write` satisfies `@RequireScope('reports', 'read')`.

```typescript
const { id, key } = await apiKeys.create({
  tenantId: 'tenant_123',
  name: 'Primary',
  scopes: [
    { resource: 'reports', level: 'write' }, // also grants reports:read
    { resource: 'projects', level: 'read' },
  ],
});
```

## Reading the context in a handler

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiKeyContext,
  ApiKeysGuard,
  CurrentApiKey,
} from '@nestarc/api-keys';

@Controller('reports')
@UseGuards(ApiKeysGuard)
export class ReportsController {
  @Get()
  list(@CurrentApiKey() apiKey: ApiKeyContext) {
    return this.service.listForTenant(apiKey.tenantId);
  }
}
```

`ApiKeyContext` surfaces:

- `keyId` — the key's record id
- `prefix` — a safe identifier for logs and displays
- `tenantId`
- `environment` (`live` or `test`)
- `scopes` — the full scope list granted to this key
- `allowedIpCidrs` — the normalized origin policy

Use `getApiKeyContext(request)` in middleware or framework-level code. A configured `contextWriter` can copy this context into tenancy, RLS, or request-local infrastructure after all guard checks pass.

## Enforcement order

After credential verification, the guard checks required environment, IP allowlist, and required scope in that order. The request context and `contextWriter` are populated only after every check succeeds.

## Failures

| Situation | Error code | HTTP |
| --- | --- | --- |
| No `Authorization` header | `api_key_missing` | 401 |
| Header doesn't match the expected format | `api_key_malformed` | 401 |
| Key not found or secret mismatch | `api_key_invalid` | 401 |
| Key was revoked | `api_key_revoked` | 401 |
| Key is past `expiresAt` | `api_key_expired` | 401 |
| Route requires `live` but key is `test` (or vice versa) | `api_key_environment_mismatch` | 403 |
| Client IP is missing, invalid, or outside a restricted key's allowlist | `api_key_ip_not_allowed` | 403 |
| Key lacks the required scope | `api_key_scope_insufficient` | 403 |

Branch on the `code` value — not the message — in clients and structured logs.

When combining the package with `@nestarc/rbac`, run `ApiKeysGuard` before `RbacGuard`. Embedded scopes and RBAC role bindings are independent authorization layers, so both requirements must pass.

## Request authorization outside HTTP

```typescript
const context = await apiKeys.authorizeRequest({
  rawKey: message.apiKey,
  clientIp: connection.verifiedRemoteAddress,
  requiredEnvironment: 'live',
  requiredScope: { resource: 'reports', level: 'read' },
});
```

`ApiKeysGuard` uses this same primitive. `verify(rawKey)` remains credential-only: a valid result does not prove request environment, scope, or IP authorization. Restricted keys fail closed without a usable client IP. Denied requests do not update `lastUsedAt` or emit `api_key.used`; observe `api_key.authorization_denied` and the optional authorization metric.

The guard passes an isolated context copy to `contextWriter` and restores authenticated `request.apiKey` after the writer finishes. Observer mutation cannot replace the key, tenant, scopes, or IP policy that downstream RBAC sees.
