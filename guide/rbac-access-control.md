---
description: "Compose @nestarc/tenancy, api-keys, rbac, and audit-log into a fail-closed NestJS access-control workflow."
---

# Production Access Control with RBAC

This recipe combines four independent concerns without collapsing them into one guard:

| Layer | Responsibility |
|-------|----------------|
| `@nestarc/tenancy` | Resolve and isolate the current tenant. |
| `@nestarc/api-keys` | Authenticate machine credentials and enforce coarse scopes. |
| `@nestarc/rbac` | Authorize tenant, global, and resource-scoped actions. |
| `@nestarc/audit-log` | Record policy mutations and denied decisions for review. |

Keep the order explicit: authenticate the subject, resolve the tenant, then evaluate RBAC. Database RLS remains the final data-isolation boundary.

::: info One module registration
The configuration snippets below isolate one concern at a time. Combine their `storage`, `tenantResolver`, `subjectResolver`, and `auditLogger` properties into a single `RbacModule.forRoot()` or `forRootAsync()` call in the application.
:::

## 1. Install the modules

```bash
npm install @nestarc/tenancy @nestarc/api-keys @nestarc/rbac @nestarc/audit-log
```

Install Prisma peers when RBAC roles and bindings use PostgreSQL:

```bash
npm install @prisma/client
npm install -D prisma
```

## 2. Define one permission contract

Centralize the persisted permission strings and import this contract from guards, seeds, and service checks:

```ts
import { defineRbacPermissions } from '@nestarc/rbac';

export const permissions = defineRbacPermissions(
  {
    reports: {
      read: 'reports.read',
      export: 'reports.export',
    },
    projects: {
      inviteMember: 'project.member.invite',
    },
  } as const,
  { validateDuplicates: true },
);
```

## 3. Register fail-closed RBAC

Use Prisma storage for multi-instance production deployments and start with strict defaults:

```ts
import {
  createStrictRbacOptions,
  RbacModule,
} from '@nestarc/rbac';
import { PrismaRbacStorage } from '@nestarc/rbac/prisma';

RbacModule.forRoot(
  createStrictRbacOptions({
    storage: new PrismaRbacStorage(prisma),
  }),
);
```

Strict options require authorization metadata, require tenant context by default, deny storage failures, and validate tenant boundaries on writes. Mark intentionally public handlers with `@SkipRbac()`.

## 4. Connect tenant context

Pass the tenant ID already resolved by your tenancy layer:

```ts
import { RbacModule, createStrictRbacOptions } from '@nestarc/rbac';
import { createTenancyTenantResolver } from '@nestarc/rbac/integrations/tenancy';

RbacModule.forRoot(
  createStrictRbacOptions({
    storage,
    tenantResolver: createTenancyTenantResolver(
      () => tenancyContext.getTenantId(),
    ),
  }),
);
```

Do not derive the authorization tenant independently from untrusted route data. Let authentication and tenancy middleware establish it first, and keep PostgreSQL RLS enabled for tenant-owned models.

## 5. Map API keys to RBAC subjects

`ApiKeysGuard` validates the credential and attaches API key context. The RBAC adapter maps that context to an `api_key` subject:

```ts
import { RbacModule, createStrictRbacOptions } from '@nestarc/rbac';
import { createApiKeySubjectResolver } from '@nestarc/rbac/integrations/api-keys';

RbacModule.forRoot(
  createStrictRbacOptions({
    storage,
    subjectResolver: createApiKeySubjectResolver(),
  }),
);
```

Apply authentication before authorization and require both the coarse API key scope and the domain permission:

```ts
import { ApiKeysGuard, RequireScope } from '@nestarc/api-keys';
import { Can, RbacGuard } from '@nestarc/rbac';

@UseGuards(ApiKeysGuard, RbacGuard)
@RequireScope('reports', 'read')
@Can(permissions.reports.read, { tenant: 'required' })
@Get('reports')
listReports() {
  return this.reports.list();
}
```

When the same application also supports user sessions, compose a custom `subjectResolver` that tries the API key resolver and then maps the authenticated user. Do not let an unvalidated request object become an RBAC subject.

## 6. Audit policy changes and denials

Connect RBAC to the structural `AuditService.log()` API:

```ts
import { createAuditLogRbacLogger } from '@nestarc/rbac/integrations/audit-log';

RbacModule.forRoot(
  createStrictRbacOptions({
    storage,
    auditLogger: createAuditLogRbacLogger({
      auditLog: auditService,
      source: 'rbac',
    }),
  }),
);
```

The adapter records role, permission, and binding changes as successes and denied decisions as failures. It strips secret-shaped metadata before forwarding events. Keep raw tokens, request headers, request bodies, and identity-provider payloads out of custom audit metadata as well.

## 7. Seed roles and verify boundaries

```ts
await rbac.createRole({
  tenantId: 'tenant_1',
  key: 'report-viewer',
  permissions: [permissions.reports.read],
});

await rbac.assignRole({
  tenantId: 'tenant_1',
  subject: { type: 'api_key', id: 'key_1', tenantId: 'tenant_1' },
  roleKey: 'report-viewer',
});
```

Before rollout, verify:

- a valid key in the correct tenant and role is allowed;
- a valid key without the required scope is denied by `ApiKeysGuard`;
- a scoped key without the RBAC permission is denied by `RbacGuard`;
- a cross-tenant subject or resource binding is rejected;
- missing tenant and missing resource context fail closed;
- denial reasons and policy mutations reach audit storage without secrets.

Use [`expectRbacMatrix()`](/packages/rbac/testing#scenario-and-matrix-helpers) to keep these combinations compact and deterministic.

## Next steps

- [Typed Permissions & Strict Mode](/packages/rbac/typed-permissions)
- [RBAC Integrations](/packages/rbac/integrations)
- [Prisma Storage](/packages/rbac/prisma-storage)
- [Adding an Audit Trail](/guide/audit-trail)
