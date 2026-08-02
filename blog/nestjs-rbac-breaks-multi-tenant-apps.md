---
title: "Why Your NestJS RBAC Breaks in Multi-Tenant Apps"
date: 2026-06-05
description: The authorization bugs that appear when roles, tenants, API keys, and resource-scoped permissions collide in a production NestJS SaaS backend.
author: nestarc
---

# Why Your NestJS RBAC Breaks in Multi-Tenant Apps

Most NestJS RBAC starts as a simple role check:

```typescript
if (user.role !== 'admin') {
  throw new ForbiddenException();
}
```

That works until your SaaS app has multiple tenants, customer API keys, platform operators, and resources such as projects, workspaces, reports, or billing accounts. At that point, "is this user an admin?" is no longer a complete authorization question.

The real question is:

> Can this subject perform this action in this tenant, optionally on this resource?

Here are the common ways RBAC breaks once that question gets more specific.

## 1. Global Admin Leaks Into Tenant Admin

A global support operator and a tenant admin may both look like `admin`, but they should not have the same permissions.

```typescript
@Get('billing')
getBilling(@CurrentUser() user: User) {
  if (user.role !== 'admin') {
    throw new ForbiddenException();
  }

  return this.billingService.getTenantBilling();
}
```

The bug: a platform admin role accidentally satisfies a tenant billing route. The route did not ask whether the role belongs to the current tenant.

A safer check separates tenant and global modes:

```typescript
@UseGuards(RbacGuard)
@Can('billing.read', { tenant: 'required' })
@Get('billing')
getBilling() {
  return this.billingService.getTenantBilling();
}
```

With tenant-required authorization, missing tenant context fails closed. Global roles should only satisfy tenant routes when you explicitly opt into that behavior.

## 2. Role Names Become Product Logic

Role checks are easy to read:

```typescript
@RequireRole('owner')
@Delete(':projectId')
deleteProject() {
  return this.projects.delete();
}
```

The problem is that role names change. Today's `owner` becomes tomorrow's `workspace-admin`, `billing-admin`, or `project-maintainer`. If every controller depends on role names, changing product policy means editing route code.

Permission strings age better:

```typescript
@UseGuards(RbacGuard)
@Can('project.delete', {
  tenant: 'required',
  resource: { type: 'project', idParam: 'projectId' },
})
@Delete(':projectId')
deleteProject() {
  return this.projects.delete();
}
```

Now roles can be renamed, split, or merged in storage while the route keeps asking for the same product action: `project.delete`.

## 3. Resource Scope Gets Ignored

Tenant-level roles are not enough for collaboration products. A user might manage one project but not every project in the tenant.

The broken version checks only the tenant:

```typescript
@Can('project.member.invite', { tenant: 'required' })
@Post(':projectId/invitations')
inviteMember() {
  return this.invitations.create();
}
```

If the user has the permission anywhere in the tenant, every project becomes writable.

Resource-scoped assignment fixes the boundary:

```typescript
await rbac.assignRole({
  tenantId: 'tenant_1',
  subject: { type: 'user', id: 'user_1', tenantId: 'tenant_1' },
  roleKey: 'project-maintainer',
  resource: { type: 'project', id: 'project_1' },
});
```

Then the route asks for the matching resource:

```typescript
@Can('project.member.invite', {
  tenant: 'required',
  resource: { type: 'project', idParam: 'projectId' },
})
@Post(':projectId/invitations')
inviteMember() {
  return this.invitations.create();
}
```

Tenant-wide admins can still be represented with unscoped bindings. The important part is that scoped maintainers do not accidentally become tenant-wide admins.

## 4. API Keys Do Not Fit User-Only RBAC

Many SaaS APIs have both users and machine clients. A customer integration might authenticate with an API key, not a browser session.

If your authorization layer assumes every subject is a user, you end up with parallel systems:

- User roles in one place
- API key scopes in another
- Service-account exceptions somewhere else

That split becomes hard to audit.

A better model treats the caller as a subject:

```typescript
subject: {
  type: 'api_key',
  id: 'key_123',
  tenantId: 'tenant_1',
}
```

API key scopes are still useful for coarse limits such as `reports:read`. RBAC becomes useful when a machine client must participate in the same tenant roles or resource-scoped policy as other subjects.

## 5. Some Checks Need Domain Data

Route metadata is not always enough. Maybe the URL uses a slug, but the RBAC policy needs the canonical project id and tenant id from the database.

That belongs in a service-level check:

```typescript
const project = await this.prisma.project.findUniqueOrThrow({
  where: { slug: projectSlug },
  select: { id: true, tenantId: true },
});

const decision = await this.rbac.can({
  subject,
  tenantId: project.tenantId,
  tenantMode: 'required',
  permission: 'project.member.invite',
  resource: { type: 'project', id: project.id },
});

if (!decision.allowed) {
  throw new ForbiddenException();
}
```

This keeps the route simple while still authorizing against the real domain model.

## What @nestarc/rbac Provides

`@nestarc/rbac` keeps authentication and authorization separate. Your auth layer identifies the subject. RBAC decides whether that subject can perform an action in a tenant, globally, or on a resource.

```typescript
import { Module } from '@nestjs/common';
import { InMemoryRbacStorage, RbacModule } from '@nestarc/rbac';

@Module({
  imports: [
    RbacModule.forRoot({
      storage: new InMemoryRbacStorage(),
      tenant: {
        requiredByDefault: true,
        allowGlobalRolesInTenant: false,
      },
    }),
  ],
})
export class AppModule {}
```

Then protect routes with permissions:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Can, RbacGuard } from '@nestarc/rbac';

@Controller('reports')
@UseGuards(RbacGuard)
export class ReportsController {
  @Can('reports.read', { tenant: 'required' })
  @Get()
  list() {
    return this.reports.list();
  }
}
```

Use Prisma storage for production roles and bindings, in-memory storage for tests, tenancy integration for tenant context, and API key integration when machine clients call your API.

## The Rule of Thumb

If your authorization check does not name the subject, action, tenant mode, and resource scope, it is probably too vague for a production SaaS backend.

You do not need a giant policy engine on day one. But you do need clear boundaries:

- Authentication identifies the subject
- Tenancy identifies the tenant
- RBAC decides whether the subject can perform the action
- Audit logging records high-risk grants and revocations

That separation keeps permissions understandable as your product grows.

## Next Steps

- [@nestarc/rbac](/packages/rbac/) - tenant-aware roles, permissions, guards, and storage
- [Guards & Permissions](/packages/rbac/guards-permissions) - route decorators, tenant modes, and resource checks
- [Integrations](/packages/rbac/integrations) - tenancy, API keys, resource scopes, and audit-ready workflows
