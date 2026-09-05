---
description: "Upgrade @nestarc/rbac 0.1 applications to 0.2 and incrementally adopt typed permissions, strict defaults, audit logging, and policy-change hooks."
---

# Migration: 0.1 to 0.2

`@nestarc/rbac` 0.2 is an additive upgrade. Existing string permissions, decorators, module options, storage adapters, and the Prisma schema remain compatible.

## Upgrade

```bash
npm install @nestarc/rbac@0.2
```

No database migration is required. Applications that assert exact `RbacDecision` object equality should allow the new optional `details` field.

## Adopt typed permissions

Create one permission contract and replace string literals incrementally:

```ts
import { defineRbacPermissions } from '@nestarc/rbac';

export const permissions = defineRbacPermissions({
  reports: {
    read: 'reports.read',
    export: 'reports.export',
  },
} as const);
```

The persisted strings do not change. Start with new code, then migrate role seeds and decorators as they are touched.

## Adopt strict options

Enable strict defaults in tests or one module before applying them globally:

```ts
import { createStrictRbacOptions, RbacModule } from '@nestarc/rbac';

RbacModule.forRoot(
  createStrictRbacOptions({
    storage,
  }),
);
```

Before a global rollout:

1. Mark intentionally public routes with `@SkipRbac()`.
2. Add RBAC metadata to protected routes.
3. Confirm auth and tenancy middleware resolve context before RBAC.
4. Add denial tests for missing subject, tenant, resource, and permission.
5. Decide whether `rejectGlobalRoleInTenantBinding` should remain `false` or be enabled for your policy.

## Connect audit logging

The optional audit-log adapter is exported from its own subpath:

```ts
import { createAuditLogRbacLogger } from '@nestarc/rbac/integrations/audit-log';

RbacModule.forRoot({
  storage,
  auditLogger: createAuditLogRbacLogger({ auditLog: auditService }),
});
```

The root package remains dependency-light and does not require `@nestarc/audit-log` at runtime.

## Publish policy changes

Use `changePublisher` for best-effort cache invalidation or outbox integration:

```ts
RbacModule.forRoot({
  storage,
  changePublisher: {
    publish: (event) => outbox.publish('rbac.policy.changed', event),
  },
});
```

These hooks do not provide distributed consistency by themselves. Monitor failures and design cache freshness around the delivery mechanism used by the consuming application.

## Verify the upgrade

- Run existing role, guard, and Prisma adapter tests unchanged.
- Add `expectDeniedReason()` assertions for critical denial paths.
- Add an `expectRbacMatrix()` table for tenant and resource boundary cases.
- Confirm default HTTP denials do not expose `decision.details`.
- Confirm audit metadata does not contain tokens, secrets, request bodies, headers, or raw subject attributes.

## Upgrade from 0.2.0/0.2.1 to 0.2.2

- Reconcile all authenticated subject and tenant sources; canonical API-key identity belongs in `request.apiKey`. Remove conflicting legacy writers.
- Account for authoritative configured tenant resolvers. `tenant.resolverMode: 'legacy-fallback'` exists only as a deprecated temporary migration option.
- Handle missing-role `updateRole()` errors and no-op mutations without expecting success audit/change events.
- Prefer `RbacServiceDecision` and its service-specific reason/details types for `can()`; wider decision envelopes remain compatible. The unused decorator `reason` option and dormant error/detail fields are deprecated.
- Keep guard integrations on HTTP; invoke `RbacService` from application-owned non-HTTP adapters.
- Validate representative Node 22/24 and NestJS 10/11/12 consumers. Prisma 7 support arrived in 0.2.1 and does not require an RBAC schema migration.

[Official change history](https://github.com/nestarc/rbac/blob/v0.2.2/changelog.md).
