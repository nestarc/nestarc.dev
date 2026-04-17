---
description: "Protect routes with ApiKeysGuard, require specific scopes with @RequireScope, and rely on write-implies-read semantics."
---

# Guards & Scopes

`ApiKeysGuard` reads the bearer token, verifies it, and attaches an `ApiKeyContext` (containing `tenantId`, `environment`, and the matched scopes) to the request. Authorization decorators run on top of that context.

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

- `resource` is a free-form string like `reports`, `invoices`, `projects`.
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
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiKeysGuard, ApiKeyContext } from '@nestarc/api-keys';

@Controller('reports')
@UseGuards(ApiKeysGuard)
export class ReportsController {
  @Get()
  list(@Req() req: { apiKey: ApiKeyContext }) {
    return this.service.listForTenant(req.apiKey.tenantId);
  }
}
```

`ApiKeyContext` surfaces:

- `id` — the key's record id
- `tenantId`
- `environment` (`live` | `test`)
- `scopes` — the full scope list granted to this key

## Failures

| Situation | Error code | HTTP |
| --- | --- | --- |
| No `Authorization` header | `api_key_missing` | 401 |
| Header doesn't match the expected format | `api_key_malformed` | 401 |
| Key not found or secret mismatch | `api_key_invalid` | 401 |
| Key was revoked | `api_key_revoked` | 401 |
| Key is past `expiresAt` | `api_key_expired` | 401 |
| Route requires `live` but key is `test` (or vice versa) | `api_key_environment_mismatch` | 403 |
| Key lacks the required scope | `api_key_scope_insufficient` | 403 |

Branch on the `code` value — not the message — in clients and structured logs.
