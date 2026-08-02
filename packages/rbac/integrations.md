---
description: "Use @nestarc/rbac with tenancy, API keys, resource scopes, and audit-ready authorization workflows."
---

# Integrations

`@nestarc/rbac` deliberately stays separate from authentication. It expects another layer to identify the subject and, when needed, the current tenant. These integrations keep that boundary explicit.

## With tenancy

Use `@nestarc/tenancy` as the source of tenant context, then let RBAC fail closed when a tenant-required route runs without that context.

```ts
import { RbacModule } from '@nestarc/rbac';
import { createTenancyTenantResolver } from '@nestarc/rbac/integrations/tenancy';

RbacModule.forRoot({
  storage,
  tenantResolver: createTenancyTenantResolver(() => tenancyContext.getTenantId()),
  tenant: {
    requiredByDefault: true,
    allowGlobalRolesInTenant: false,
  },
});
```

Keep tenant roles scoped to a tenant id. Global roles are best reserved for platform administration routes that use `tenant: 'none'`.

## With API keys

Use `@nestarc/api-keys` when machine clients authenticate with scoped API keys. The API key guard verifies the key and attaches the key context to the request; RBAC can then resolve the subject from that context.

```ts
import { RbacModule } from '@nestarc/rbac';
import { createApiKeySubjectResolver } from '@nestarc/rbac/integrations/api-keys';

RbacModule.forRoot({
  storage,
  subjectResolver: createApiKeySubjectResolver(),
  tenant: { requiredByDefault: true },
});
```

Use API key scopes for coarse integration limits such as `reports:read`, and RBAC permissions when the same integration must participate in tenant roles or resource-scoped authorization.

## Resource-scoped workflows

Resource scopes are useful when a subject is allowed to manage one project, workspace, report, or customer account but not every resource in the tenant.

```ts
await rbac.assignRole({
  tenantId: 'tenant_1',
  subject: { type: 'user', id: 'user_1', tenantId: 'tenant_1' },
  roleKey: 'project-maintainer',
  resource: { type: 'project', id: 'project_1' },
});
```

```ts
@Can('project.member.invite', {
  tenant: 'required',
  resource: { type: 'project', idParam: 'projectId' },
})
@Post(':projectId/invitations')
inviteMember() {
  return { ok: true };
}
```

Unscoped tenant roles still satisfy resource checks. That lets tenant owners keep broad access while narrower maintainers remain limited to one resource.

## Service checks after loading domain data

Use `RbacService.can()` when the route parameter is not enough to decide authorization.

```ts
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

This pattern keeps controllers thin while still authorizing against canonical domain identifiers.

## Audit-ready authorization

RBAC decisions are most useful when they can be explained later. In production workflows:

- Store stable role keys such as `owner`, `billing-admin`, or `project-maintainer`.
- Store permission strings that describe product actions, such as `billing.invoice.read`.
- Avoid embedding raw identity-provider payloads in RBAC metadata.
- Pair high-risk role assignment flows with [`@nestarc/audit-log`](/packages/audit-log/) so grant and revoke events are reviewable.

### Audit-log adapter

Version 0.2 includes an optional structural adapter for applications that already use `@nestarc/audit-log` or another logger with a compatible `log()` method:

```ts
import { RbacModule } from '@nestarc/rbac';
import { createAuditLogRbacLogger } from '@nestarc/rbac/integrations/audit-log';

RbacModule.forRoot({
  storage,
  auditLogger: createAuditLogRbacLogger({
    auditLog: auditService,
    source: 'rbac',
  }),
});
```

The adapter maps RBAC event types to audit actions, marks denials as failures, and removes secret-shaped fields—including tokens, API key secrets, headers, bodies, and raw subject attributes—from metadata. The root `@nestarc/rbac` entry point does not eagerly import `@nestarc/audit-log`.

## Policy-change events

Audit events explain security-relevant behavior. `changePublisher` is a separate best-effort hook for cache invalidation, outbox publishing, or permission refreshes after successful policy mutations:

```ts
RbacModule.forRoot({
  storage,
  changePublisher: {
    async publish(event) {
      await outbox.publish('rbac.policy.changed', event);
    },
  },
});
```

The package publishes events after role, permission, and binding changes. Publisher failures are swallowed by default, so monitor the consuming hook and do not treat it as a distributed consistency guarantee.

## Next steps

- [Guards & Permissions](./guards-permissions) for decorator-level checks.
- [Prisma Storage](./prisma-storage) for persistent roles and bindings.
- [Testing](./testing) for deterministic allow/deny assertions.
- [Production Access-Control Recipe](/guide/rbac-access-control) for a complete tenancy, API key, RBAC, and audit-log composition.
