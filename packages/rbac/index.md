---
description: "Tenant-aware RBAC and permission guards for production NestJS SaaS applications."
---

<script setup>
import PackageVersion from '../../.vitepress/theme/components/PackageVersion.vue'
</script>

# @nestarc/rbac

Tenant-aware RBAC and permission guards for production NestJS SaaS applications. `@nestarc/rbac` stays separate from authentication: your auth layer identifies the subject, and RBAC decides whether that subject has the tenant, global, or resource-scoped role required for the action.

Read [Why Your NestJS RBAC Breaks in Multi-Tenant Apps](/blog/nestjs-rbac-breaks-multi-tenant-apps) for the failure modes this tenant and resource model is designed to prevent.

::: tip Current release
Current package version: <PackageVersion slug="rbac" />

Version 0.2.2 reconciles identity sources fail closed, makes stacked guard audits request-final, and reports committed mutation outcomes. NestJS 10/11/12 and Prisma 5/6/7 have verified consumers on Node 22/24. Existing schema and required custom-storage methods remain compatible, but conflicting identity sources and missing-role updates now fail explicitly.
:::

## Features

- **NestJS route guards** — protect controllers with `RbacGuard`, `@Can()`, `@RequirePermissions()`, and `@RequireRole()`.
- **Service-level checks** — call `RbacService.can()` before running sensitive domain operations.
- **Tenant-aware decisions** — support tenant-required, tenant-optional, and global-only checks.
- **Resource-scoped roles** — bind roles to one tenant, one resource, or a global scope.
- **Wildcard permissions** — support exact permissions, suffix wildcards such as `reports.*`, and `*`.
- **Typed permission contracts** — centralize permission strings with `defineRbacPermissions()` while preserving their persisted values.
- **Fail-closed defaults** — use `createStrictRbacOptions()` to require route metadata, tenant context, and safe storage-error behavior.
- **Safe decision details** — inspect server-side evaluation details without exposing them in default HTTP denial responses.
- **Optional persistence** — use `InMemoryRbacStorage` for tests and local apps, or `PrismaRbacStorage` for PostgreSQL-backed production storage.
- **Integration helpers** — optional subpaths for tenancy, API key subject resolution, and audit-log event mapping.
- **Policy-change hooks** — publish successful role, permission, and binding mutations to cache or outbox workflows.
- **Testing utilities** — `TestRbacModule`, scenario builders, decision-reason assertions, and allow/deny matrices.

## Requirements

- NestJS 10, 11, or 12
- `reflect-metadata`, `rxjs`
- Prisma 5, 6, or 7 (optional, only if you use `@nestarc/rbac/prisma`)

## Quickstart

```ts
import { Module } from '@nestjs/common';
import {
  createStrictRbacOptions,
  InMemoryRbacStorage,
  RbacModule,
} from '@nestarc/rbac';

@Module({
  imports: [
    RbacModule.forRoot(
      createStrictRbacOptions({
        storage: new InMemoryRbacStorage(),
      }),
    ),
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

Define a typed permission contract and reuse the same literal values in guards, seeds, and service checks:

```ts
import { defineRbacPermissions } from '@nestarc/rbac';

export const permissions = defineRbacPermissions({
  reports: {
    read: 'reports.read',
    export: 'reports.export',
  },
} as const);

@Can(permissions.reports.read, { tenant: 'required' })
@Get(':reportId')
readReport() {
  return this.reports.findOne();
}
```

## When to reach for this

- You already authenticate users, API keys, or service accounts, but need consistent authorization checks.
- Tenant-scoped roles should not accidentally apply globally.
- Some roles apply to a single resource, such as one project or workspace.
- You want Prisma/PostgreSQL persistence without forcing every test to use a database.
- Authorization writes must feed audit, cache invalidation, or outbox workflows.

## Next steps

- [Installation](./installation) — module setup, peer dependencies, and first role.
- [Typed Permissions & Strict Mode](./typed-permissions) — permission contracts, strict defaults, and safe decision details.
- [Guards & Permissions](./guards-permissions) — route decorators, tenant modes, resource-scoped checks.
- [Prisma Storage](./prisma-storage) — PostgreSQL-backed role and binding storage.
- [Integrations](./integrations) — tenancy, API keys, resource scopes, and audit-ready workflows.
- [Testing](./testing) — deterministic test modules and assertions.
- [Migration from 0.1](./migration-0.2) — additive upgrade guidance for version 0.2.
- [Production Access-Control Recipe](/guide/rbac-access-control) — compose tenancy, API keys, RBAC, and audit logging.
