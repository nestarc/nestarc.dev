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

## Subject builders

Use subject builders to keep tests readable:

```ts
import { rbacApiKey, rbacServiceAccount, rbacUser } from '@nestarc/rbac/testing';

const user = rbacUser('user_1', 'tenant_1');
const apiKey = rbacApiKey('key_1', 'tenant_1');
const service = rbacServiceAccount('worker');
```

## Test guidance

- Test both allow and deny paths for each protected workflow.
- Include a missing-tenant case when routes use `tenant: 'required'`.
- Prefer permission assertions over role-name assertions for application behavior.
- Use Prisma-backed tests only for storage integration; most guard and service tests can use `TestRbacModule`.
