---
description: "REST Admin API for @nestarc/feature-flag — CRUD endpoints for flags and overrides with mandatory guard injection."
---

# Admin API

<Badge type="info" text="v0.2.0" />

`FeatureFlagAdminModule` provides a ready-made REST API for managing feature flags. It requires a guard to be injected — the module will not register without one.

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
The `guard` option is **required**. Omitting it throws an error at startup. This prevents accidentally exposing flag management endpoints without authentication.
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

### Enable with 50% rollout

```bash
curl -X PATCH http://localhost:3000/feature-flags/NEW_CHECKOUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "enabled": true,
    "percentage": 50
  }'
```

### Set a tenant override

```bash
curl -X POST http://localhost:3000/feature-flags/NEW_CHECKOUT/overrides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "tenantId": "tenant-beta",
    "enabled": true
  }'
```

### Remove an override

```bash
curl -X DELETE http://localhost:3000/feature-flags/NEW_CHECKOUT/overrides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "tenantId": "tenant-beta"
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

## Custom Guard Example

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user?.role === 'admin';
  }
}
```
