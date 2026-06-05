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
const allowed = await rbac.can({
  subject: { type: 'user', id: 'user_1', tenantId: 'tenant_1' },
  tenantId: 'tenant_1',
  tenantMode: 'required',
  permission: 'reports.read',
});

if (!allowed) {
  throw new ForbiddenException();
}
```

## Public routes

Use `@SkipRbac()` for health checks, static public endpoints, or routes already protected by another guard:

```ts
@SkipRbac()
@Get('health')
health() {
  return { ok: true };
}
```
