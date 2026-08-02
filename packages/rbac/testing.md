---
description: "Testing utilities for @nestarc/rbac — TestRbacModule, subject builders, and allow/deny assertions."
---

# Testing

`@nestarc/rbac/testing` provides deterministic helpers for unit and integration tests.

## Test module

```ts
import { Test } from '@nestjs/testing';
import { RbacService } from '@nestarc/rbac';
import { TestRbacModule, rbacUser } from '@nestarc/rbac/testing';

const moduleRef = await Test.createTestingModule({
  imports: [
    TestRbacModule.forRoot({
      tenant: { requiredByDefault: true },
      subject: rbacUser('user_1', 'tenant_1'),
    }),
  ],
}).compile();

const rbac = moduleRef.get(RbacService);
```

## Seed roles

```ts
await rbac.createRole({
  tenantId: 'tenant_1',
  key: 'viewer',
  permissions: ['reports.read'],
});

await rbac.assignRole({
  tenantId: 'tenant_1',
  subject: rbacUser('user_1', 'tenant_1'),
  roleKey: 'viewer',
});
```

## Assert authorization

```ts
import { expectAllowed, expectDenied, rbacUser } from '@nestarc/rbac/testing';

await expectAllowed(rbac, {
  subject: rbacUser('user_1', 'tenant_1'),
  tenantId: 'tenant_1',
  permission: 'reports.read',
});

await expectDenied(rbac, {
  subject: rbacUser('user_2', 'tenant_1'),
  tenantId: 'tenant_1',
  permission: 'reports.read',
});
```

When a test cares about the reason rather than only allow/deny state, use the stable denial reason added to the testing workflow in version 0.2:

```ts
import { expectDeniedReason } from '@nestarc/rbac/testing';

await expectDeniedReason(
  rbac,
  {
    subject: rbacUser('user_2', 'tenant_1'),
    tenantId: 'tenant_1',
    permission: 'reports.read',
  },
  'denied_no_matching_permission',
);
```

## Subject builders

Use subject builders to keep tests readable:

```ts
import { rbacApiKey, rbacServiceAccount, rbacUser } from '@nestarc/rbac/testing';

const user = rbacUser('user_1', 'tenant_1');
const apiKey = rbacApiKey('key_1', 'tenant_1');
const service = rbacServiceAccount('worker');
```

Short aliases—`user()`, `apiKey()`, and `serviceAccount()`—are also available. The explicit `rbacUser()`, `rbacApiKey()`, and `rbacServiceAccount()` names remain compatible with version 0.1.

## Scenario and matrix helpers

`createRbacScenario()` seeds an in-memory storage with roles and bindings. `expectRbacMatrix()` then evaluates a compact allow/deny table and includes the permission, role, tenant, and resource in failure messages:

```ts
import {
  createRbacScenario,
  expectRbacMatrix,
  user,
} from '@nestarc/rbac/testing';

const scenario = await createRbacScenario({
  roles: [
    {
      tenantId: 'tenant_1',
      key: 'viewer',
      permissions: ['reports.read'],
    },
  ],
  bindings: [
    {
      tenantId: 'tenant_1',
      subject: user('user_1', 'tenant_1'),
      roleKey: 'viewer',
    },
  ],
});

await expectRbacMatrix(scenario.rbac, [
  {
    subject: user('user_1', 'tenant_1'),
    tenantId: 'tenant_1',
    permission: 'reports.read',
    allowed: true,
  },
  {
    subject: user('user_1', 'tenant_1'),
    tenantId: 'tenant_1',
    permission: 'reports.write',
    allowed: false,
    reason: 'denied_no_matching_permission',
  },
]);
```

## Test guidance

- Test both allow and deny paths for each protected workflow.
- Include a missing-tenant case when routes use `tenant: 'required'`.
- Prefer permission assertions over role-name assertions for application behavior.
- Assert stable denial reasons for security-critical failure paths.
- Use matrix tests when a tenant/resource/permission policy has several meaningful combinations.
- Use Prisma-backed tests only for storage integration; most guard and service tests can use `TestRbacModule`.
