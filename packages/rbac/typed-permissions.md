---
description: "Define typed @nestarc/rbac permission contracts, adopt fail-closed defaults, and inspect safe server-side decision details."
---

# Typed Permissions & Strict Mode

Version 0.2 adds opt-in helpers for keeping authorization policy consistent and fail closed. Existing string permissions remain supported, so each capability can be adopted incrementally.

## Define a permission contract

`defineRbacPermissions()` preserves your existing permission strings while providing autocomplete and literal types:

```ts
import { defineRbacPermissions } from '@nestarc/rbac';

export const permissions = defineRbacPermissions(
  {
    reports: {
      read: 'reports.read',
      export: 'reports.export',
    },
    projects: {
      read: 'project.read',
      inviteMember: 'project.member.invite',
    },
  } as const,
  { validateDuplicates: true },
);

export type AppPermission = typeof permissions.$permission;
```

Use the same contract in role seeds, decorators, and service checks:

```ts
await rbac.createRole({
  tenantId: 'tenant_1',
  key: 'report-viewer',
  permissions: [permissions.reports.read],
});

@Can(permissions.reports.export, { tenant: 'required' })
@Post(':reportId/exports')
exportReport() {
  return this.reports.export();
}
```

`permissions.$permissions` is a non-enumerable runtime array of every declared permission. `permissions.$permission` exists for extracting the literal union type and is not a runtime permission value.

::: info Persistence stays unchanged
The contract centralizes strings at compile time and startup. Persisted role and permission values remain strings such as `reports.read`, so adopting the helper requires no database migration.
:::

## Start from strict options

`createStrictRbacOptions()` fills in fail-closed defaults without overriding values you set explicitly:

```ts
import {
  createStrictRbacOptions,
  InMemoryRbacStorage,
  RbacModule,
} from '@nestarc/rbac';

RbacModule.forRoot(
  createStrictRbacOptions({
    storage: new InMemoryRbacStorage(),
  }),
);
```

The helper defaults to:

- requiring RBAC metadata on guarded routes;
- requiring tenant context unless a check opts into another tenant mode;
- preventing global roles from satisfying tenant checks;
- denying authorization when storage fails;
- validating tenant boundaries on writes;
- keeping allowed-decision logging off by default.

Before enabling strict options globally:

1. Mark public handlers with `@SkipRbac()`.
2. Add permission or role metadata to every protected handler.
3. Ensure authentication and tenancy resolution run before `RbacGuard`.
4. Test missing-subject, missing-tenant, missing-resource, and missing-permission denials.

## Inspect safe decision details

`RbacService.can()` returns an `RbacServiceDecision` with a stable `reason` and optional server-side `details`:

```ts
const decision = await rbac.can({
  subject,
  tenantId: 'tenant_1',
  permission: permissions.projects.inviteMember,
  resource: { type: 'project', id: 'project_1' },
});

if (!decision.allowed) {
  logger.warn({
    reason: decision.reason,
    evaluationPath: decision.details?.evaluationPath,
  });
}
```

Decision details can describe the requirement, matched roles and permissions, missing context, and the evaluation path. Default HTTP denial responses intentionally omit these details; keep them in reviewed server-side logs and observability pipelines.

## Next steps

- [Guards & Permissions](./guards-permissions) for route and service checks.
- [Testing](./testing) for decision-reason and policy-matrix assertions.
- [Migration from 0.1](./migration-0.2) for an incremental adoption checklist.

