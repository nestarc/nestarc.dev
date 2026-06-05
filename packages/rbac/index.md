---
description: "Tenant-aware RBAC and permission guards for production NestJS SaaS applications."
---

# @nestarc/rbac

Tenant-aware RBAC and permission guards for production NestJS SaaS applications. `@nestarc/rbac` stays separate from authentication: your auth layer identifies the subject, and RBAC decides whether that subject has the tenant, global, or resource-scoped role required for the action.

## Features

- **NestJS route guards** — protect controllers with `RbacGuard`, `@Can()`, `@RequirePermissions()`, and `@RequireRole()`.
- **Service-level checks** — call `RbacService.can()` before running sensitive domain operations.
- **Tenant-aware decisions** — support tenant-required, tenant-optional, and global-only checks.
- **Resource-scoped roles** — bind roles to one tenant, one resource, or a global scope.
- **Wildcard permissions** — support exact permissions, suffix wildcards such as `reports.*`, and `*`.
- **Optional persistence** — use `InMemoryRbacStorage` for tests and local apps, or `PrismaRbacStorage` for PostgreSQL-backed production storage.
- **Integration helpers** — optional subpaths for tenancy and API key subject resolution.
- **Testing utilities** — `TestRbacModule`, subject builders, and allow/deny assertions.

## Requirements

- NestJS 10 or 11
- `reflect-metadata`, `rxjs`
- Prisma 5 or 6 (optional, only if you use `@nestarc/rbac/prisma`)

## Quickstart

```ts
import { Module } from '@nestjs/common';
import { InMemoryRbacStorage, RbacModule } from '@nestarc/rbac';

@Module({
  imports: [
    RbacModule.forRoot({
      storage: new InMemoryRbacStorage(),
      tenant: { requiredByDefault: true },
    }),
  ],
})
export class AppModule {}
```

Seed a role and bind it to a subject:

```ts
await rbac.createRole({
  tenantId: 'tenant_1',
  key: 'viewer',
  permissions: ['reports.read'],
});

await rbac.assignRole({
  tenantId: 'tenant_1',
  subject: { type: 'user', id: 'user_1', tenantId: 'tenant_1' },
  roleKey: 'viewer',
});
```

Protect a route:

```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Can, CurrentRbacSubject, RbacGuard, type RbacSubject } from '@nestarc/rbac';

@Controller('reports')
export class ReportsController {
  @UseGuards(RbacGuard)
  @Can('reports.read', { tenant: 'required' })
  @Get(':reportId')
  readReport(@CurrentRbacSubject() subject: RbacSubject) {
    return { viewedBy: subject.id };
  }
}
```

## When to reach for this

- You already authenticate users, API keys, or service accounts, but need consistent authorization checks.
- Tenant-scoped roles should not accidentally apply globally.
- Some roles apply to a single resource, such as one project or workspace.
- You want Prisma/PostgreSQL persistence without forcing every test to use a database.

## Next steps

- [Installation](./installation) — module setup, peer dependencies, and first role.
- [Guards & Permissions](./guards-permissions) — route decorators, tenant modes, resource-scoped checks.
- [Prisma Storage](./prisma-storage) — PostgreSQL-backed role and binding storage.
- [Integrations](./integrations) — tenancy, API keys, resource scopes, and audit-ready workflows.
- [Testing](./testing) — deterministic test modules and assertions.
