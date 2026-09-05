---
description: "Use @nestarc/rbac guards, permission decorators, tenant modes, and resource-scoped role checks."
---

# Guards & Permissions

`RbacGuard` evaluates metadata from route decorators and denies requests that do not satisfy the required role or permission.

## Permission checks

```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Can, RbacGuard } from '@nestarc/rbac';

@Controller('reports')
@UseGuards(RbacGuard)
export class ReportsController {
  @Can('reports.read', { tenant: 'required' })
  @Get()
  list() {
    return [];
  }
}
```

Use `@Can()` or `@RequirePermissions()` for permission strings. Permissions can be exact, suffix wildcards such as `reports.*`, or the global `*`.

For multiple permissions, choose whether every permission or any one permission is required:

```ts
@RequirePermissions(['project.member.invite', 'project.member.read'], {
  mode: 'all',
  tenant: 'required',
})
@Post(':projectId/invitations')
invite() {
  return { ok: true };
}
```

`@RequirePermissions()` defaults to `mode: 'all'`. Use `mode: 'any'` only when one matching permission is sufficient. `@Can(permission)` is an alias for `@RequirePermission(permission)`.

## Typed permission contracts

Version 0.2 can centralize permission values without changing what is stored in the database:

```ts
import { Can, defineRbacPermissions } from '@nestarc/rbac';

export const permissions = defineRbacPermissions({
  projects: {
    read: 'project.read',
    inviteMember: 'project.member.invite',
  },
} as const);

@Can(permissions.projects.read, { tenant: 'required' })
@Get(':projectId')
read() {
  return {};
}
```

See [Typed Permissions & Strict Mode](./typed-permissions) for metadata, duplicate validation, and migration guidance.

## Role checks

```ts
import { RequireRole, RbacGuard } from '@nestarc/rbac';

@UseGuards(RbacGuard)
@RequireRole('owner', { tenant: 'required' })
@Get('billing')
getBilling() {
  return {};
}
```

Role checks are useful for coarse-grained admin screens. Permission checks are usually better for application features because they survive role renames.

## Tenant modes

| Mode | Use when |
|------|----------|
| `required` | The route must run inside a tenant. Missing tenant identity fails closed. |
| `optional` | Tenant roles can apply when a tenant is present, but global checks are still allowed. |
| `none` | The route is explicitly global-only. |

```ts
@Can('platform.read', { tenant: 'none' })
@Get('/admin/health')
health() {
  return { ok: true };
}
```

By default, global roles do not satisfy tenant-scoped checks unless `tenant.allowGlobalRolesInTenant` is enabled.

## Global guard and strict metadata

Use a global guard with strict options when missing authorization metadata should deny by default:

```ts
import { APP_GUARD } from '@nestjs/core';
import {
  createStrictRbacOptions,
  InMemoryRbacStorage,
  RbacGuard,
  RbacModule,
} from '@nestarc/rbac';

@Module({
  imports: [
    RbacModule.forRoot(
      createStrictRbacOptions({ storage: new InMemoryRbacStorage() }),
    ),
  ],
  providers: [{ provide: APP_GUARD, useClass: RbacGuard }],
})
export class AppModule {}
```

Authentication must run before RBAC. With `requireMetadata: true`, every route must use a requirement decorator or `@SkipRbac()`.

## Resource-scoped roles

Bind a role to one resource:

```ts
await rbac.assignRole({
  tenantId: 'tenant_1',
  subject: { type: 'user', id: 'user_1' },
  roleKey: 'project-maintainer',
  resource: { type: 'project', id: 'project_1' },
});
```

Check that resource from a route parameter:

```ts
@Can('project.member.invite', {
  tenant: 'required',
  resource: { type: 'project', idParam: 'projectId' },
})
@Post(':projectId/invitations')
invite() {
  return { ok: true };
}
```

Unscoped bindings still satisfy resource checks, which keeps tenant-wide admin roles useful.

## Service-level checks

Use service checks when authorization depends on domain data that is not available in route metadata:

```ts
const decision = await rbac.can({
  subject: { type: 'user', id: 'user_1', tenantId: 'tenant_1' },
  tenantId: 'tenant_1',
  tenantMode: 'required',
  permission: 'reports.read',
});

if (!decision.allowed) {
  throw new ForbiddenException();
}
```

The return value is an `RbacServiceDecision`, not a boolean. Use its stable reason and safe evaluation details for reviewed server-side telemetry:

```ts
const decision = await rbac.can({
  subject,
  tenantId: 'tenant_1',
  permission: permissions.projects.inviteMember,
  resource: { type: 'project', id: 'project_1' },
});

if (!decision.allowed) {
  logger.warn({ reason: decision.reason, details: decision.details });
  throw new ForbiddenException();
}
```

Default HTTP denial responses do not expose `decision.details`; keep those details in reviewed server-side telemetry.

## Public routes

Use `@SkipRbac()` for health checks, static public endpoints, or routes already protected by another guard:

```ts
@SkipRbac()
@Get('health')
health() {
  return { ok: true };
}
```

## HTTP identity reconciliation in 0.2.2

The default resolver reconciles populated `request.rbacSubject`, `request.user`, and API-key sources. Subject type, ID, and tenant must agree; one valid higher-priority identity cannot hide a conflicting source. `request.apiKey` is canonical, while `request.apiKeyContext` is a deprecated fallback only when the canonical source is absent.

A configured tenant resolver is authoritative by default. It must agree with subject tenant, `request.tenantId`, `request.tenant.id`, and `x-tenant-id`. Direct `can()` also rejects conflicting subject/input tenants, including `tenantMode: 'none'`. API-key IDs remain exact opaque values. Malformed runtime modes and shapes fail with `RBAC_CONFIG_ERROR`.

Guard/decorator/default-resolver integration is HTTP-only. GraphQL, RPC, and WebSocket adapters should authorize through transport-neutral `RbacService`; custom resolver hooks alone do not add transport support.

Stacked class/handler requirements produce a final RBAC audit outcome: a later denial suppresses earlier allowed events, while a fully allowed request emits one aggregate allowed event when enabled. This is the RBAC guard outcome, not proof of successful business execution.
