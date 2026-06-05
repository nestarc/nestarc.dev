---
description: "API reference stub for @nestarc/rbac: module registration, guards, role APIs, Prisma storage, testing utilities, and production notes."
---

# @nestarc/rbac

::: warning Status: Beta
API reference is being expanded.
The package is usable, but advanced examples are still in progress.
:::

## Overview

`@nestarc/rbac` provides tenant-aware RBAC primitives for NestJS SaaS applications. It separates authentication from authorization: your app resolves the request subject, and RBAC checks tenant, global, or resource-scoped roles and permissions.

## Installation

```bash
npm install @nestarc/rbac
```

Install Prisma only when you use the production storage adapter:

```bash
npm install @prisma/client
npm install -D prisma
```

## Basic usage

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

## Route guards

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

## Public API

| Export | Purpose |
|--------|---------|
| `RbacModule` | Nest module with `forRoot()` and `forRootAsync()`. |
| `RbacService` | Create roles, assign roles, and run service-level authorization checks. |
| `RbacGuard` | Nest guard that evaluates route metadata. |
| `Can()` | Decorator for permission-based route checks. |
| `RequirePermissions()` | Decorator for explicit permission requirements. |
| `RequireRole()` | Decorator for role-key requirements. |
| `SkipRbac()` | Decorator for public routes or routes protected elsewhere. |
| `CurrentRbacSubject()` | Parameter decorator for the resolved subject. |
| `InMemoryRbacStorage` | In-memory storage for tests and simple deployments. |
| `PrismaRbacStorage` | Prisma/PostgreSQL storage from `@nestarc/rbac/prisma`. |
| `TestRbacModule` | Testing module from `@nestarc/rbac/testing`. |

## Useful guides

- [Package guide](/packages/rbac/)
- [Installation](/packages/rbac/installation)
- [Guards & Permissions](/packages/rbac/guards-permissions)
- [Prisma Storage](/packages/rbac/prisma-storage)
- [Testing](/packages/rbac/testing)

## Production notes

- Authentication is intentionally not included. Attach `request.user`, `request.rbacSubject`, or configure a subject resolver.
- Tenant-required checks fail closed when no tenant can be resolved.
- Global roles do not apply inside tenants by default.
- Keep role writes auditable and avoid logging raw subject attributes unless reviewed.
