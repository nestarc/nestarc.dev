---
description: "REST Admin API for @nestarc/feature-flag — CRUD endpoints for flags and overrides with mandatory guard injection."
---

# Admin API

<Badge type="info" text="v0.2.0" />

In published 0.6.0, `FeatureFlagAdminModule` provides a ready-made REST API for managing feature flags. It requires a guard to be injected — the module will not register without one.

## Setup

```typescript
import { FeatureFlagModule, FeatureFlagAdminModule } from '@nestarc/feature-flag';

@Module({
  imports: [
    FeatureFlagModule.forRoot({
      environment: 'production',
      prisma,
    }),
    FeatureFlagAdminModule.register({
      guard: AdminAuthGuard,
    }),
  ],
})
export class AppModule {}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `guard` | `Type<CanActivate>` | *required* | NestJS guard applied to all admin endpoints |
| `path` | `string` | `'feature-flags'` | Base route path for the admin API |

::: warning
The `guard` option is **required**. Omitting it throws an error at startup. The package requires a guard class but does not implement authentication or authorization. Supply a guard that actually enforces administrator access.
:::

## Endpoints

All endpoints are prefixed with the configured `path` (default: `/feature-flags`).

### Flags

| Method | Path | Description | Error codes |
|--------|------|-------------|-------------|
| `POST` | `/feature-flags` | Create a new flag | `409` duplicate key |
| `GET` | `/feature-flags` | List all active flags | — |
| `GET` | `/feature-flags/:key` | Get a single flag | `404` not found |
| `PATCH` | `/feature-flags/:key` | Update a flag | `404` not found |
| `DELETE` | `/feature-flags/:key` | Archive a flag | `404` not found |
| `POST` | `/feature-flags/:key/evaluate` | Evaluate a boolean with context and options | Fallback details for missing/error evaluations |

### Overrides

| Method | Path | Description | Error codes |
|--------|------|-------------|-------------|
| `POST` | `/feature-flags/:key/overrides` | Set an override | `404` flag not found |
| `DELETE` | `/feature-flags/:key/overrides` | Remove an override | `404` flag not found |

## Usage Examples

### Create a flag

```bash
curl -X POST http://localhost:3000/feature-flags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "key": "NEW_CHECKOUT",
    "description": "New checkout flow",
    "enabled": false,
    "percentage": 0
  }'
```

### Start a 50% rollout

```bash
curl -X PATCH http://localhost:3000/feature-flags/NEW_CHECKOUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "enabled": false,
    "percentage": 50
  }'
```

### Evaluate with a bucket attribute

Version 0.6.0 accepts invocation `bucketBy` alongside the evaluation context and fallback options:

```bash
curl -X POST http://localhost:3000/feature-flags/NEW_CHECKOUT/evaluate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "context": { "tenantId": "tenant-beta", "userId": "user-42" },
    "bucketBy": "tenantId",
    "defaultValue": false
  }'
```

This uses the tenant for percentage bucketing. A non-empty `context.targetingKey` takes precedence over `bucketBy`. The response includes the boolean value, reason, source, fallback status, and available targeting metadata.

Create/update `percentage` must be an integer from 0 to 100. Null and fractional percentages are rejected with HTTP 400; nullable `description` can be cleared with `null`. See the [versioned DTOs](https://github.com/nestarc/nestjs-feature-flag/blob/v0.6.0/src/admin/feature-flag-admin.dto.ts).

### Set a tenant override

```bash
curl -X POST http://localhost:3000/feature-flags/NEW_CHECKOUT/overrides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "attributes": { "tenantId": "tenant-beta" },
    "enabled": true
  }'
```

### Remove an override

```bash
curl -X DELETE http://localhost:3000/feature-flags/NEW_CHECKOUT/overrides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "attributes": { "tenantId": "tenant-beta" }
  }'
```

### Archive a flag

```bash
curl -X DELETE http://localhost:3000/feature-flags/OLD_FEATURE \
  -H "Authorization: Bearer <token>"
```

::: tip
Archiving sets `archivedAt` on the flag. Archived flags always evaluate to `false` but remain in the database for audit purposes.
:::

The examples require a guard that authenticates the supplied token and authorizes flag administration. With a partial rollout, supply a stable targeting key or bucket attribute during evaluation. Keeping `enabled: false` gives contexts without a usable key an off fallback. See [evaluation precedence](./rollout). The override bodies use the 0.3+ `attributes` contract; top-level `tenantId` is rejected by the admin validation pipe.

## Custom Guard Example

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user?.role === 'admin'; // request.user must already be authenticated.
  }
}
```
