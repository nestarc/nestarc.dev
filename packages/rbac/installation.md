---
description: "Install @nestarc/rbac and register RbacModule with in-memory or Prisma-backed storage."
---

# Installation

Install the package:

```bash
npm install @nestarc/rbac
```

Install NestJS peer dependencies if your app does not already include them:

```bash
npm install @nestjs/common @nestjs/core reflect-metadata rxjs
```

For Prisma/PostgreSQL storage, install Prisma in the consuming application:

```bash
npm install @prisma/client
npm install -D prisma
```

Version 0.2 is an additive upgrade from 0.1. No database migration is required for the typed-permission, strict-options, decision-detail, audit adapter, or change-publisher APIs.

## In-memory setup

Use in-memory storage for tests, examples, or small single-process deployments:

```ts
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

## Strict production setup

`createStrictRbacOptions()` provides a fail-closed starting point while preserving explicit overrides:

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

The helper enables these defaults:

| Option | Strict default | Effect |
|--------|----------------|--------|
| `requireMetadata` | `true` | Routes without RBAC metadata deny unless marked with `@SkipRbac()`. |
| `tenant.requiredByDefault` | `true` | Protected routes require a tenant unless explicitly configured otherwise. |
| `tenant.allowGlobalRolesInTenant` | `false` | Global roles do not implicitly satisfy tenant checks. |
| `storageErrors` | `'deny'` | Storage failures deny authorization instead of allowing access. |
| `logAllowedDecisions` | `false` | Avoid high-volume allow logs unless explicitly enabled. |
| `writeValidation.rejectTenantMismatch` | `true` | Reject cross-tenant subject and role writes. |
| `writeValidation.rejectResourceWithoutTenant` | `true` | Reject resource bindings without a tenant. |

Register `RbacGuard` globally when every application route should opt into RBAC or explicitly opt out:

```ts
import { APP_GUARD } from '@nestjs/core';
import { RbacGuard } from '@nestarc/rbac';

@Module({
  imports: [RbacModule.forRoot(createStrictRbacOptions({ storage }))],
  providers: [{ provide: APP_GUARD, useClass: RbacGuard }],
})
export class AppModule {}
```

Ensure authentication and tenant-resolution guards or middleware run before RBAC. Mark health checks and intentionally public handlers with `@SkipRbac()`.

## Async setup

Use `forRootAsync()` when storage or resolvers depend on app services:

```ts
import { Module } from '@nestjs/common';
import { RbacModule } from '@nestarc/rbac';
import { PrismaRbacStorage } from '@nestarc/rbac/prisma';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    RbacModule.forRootAsync({
      imports: [PrismaModule],
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        storage: new PrismaRbacStorage(prisma),
        tenant: { requiredByDefault: true },
      }),
    }),
  ],
})
export class AppModule {}
```

## First role

Seed roles at boot, in a migration script, or through an admin workflow:

```ts
await rbac.createRole({
  tenantId: 'tenant_1',
  key: 'admin',
  permissions: ['reports.*', 'users.read'],
});

await rbac.assignRole({
  tenantId: 'tenant_1',
  subject: { type: 'user', id: 'user_1', tenantId: 'tenant_1' },
  roleKey: 'admin',
});
```

## Optional integrations

Use the tenancy integration to resolve tenant context from `@nestarc/tenancy`:

```ts
import { createTenancyTenantResolver } from '@nestarc/rbac/integrations/tenancy';

RbacModule.forRoot({
  storage,
  tenantResolver: createTenancyTenantResolver(() => tenancy.getCurrentTenant()),
  tenant: { requiredByDefault: true },
});
```

Use the API key integration when `@nestarc/api-keys` attaches key context to the request:

```ts
import { createApiKeySubjectResolver } from '@nestarc/rbac/integrations/api-keys';

RbacModule.forRoot({
  storage,
  subjectResolver: createApiKeySubjectResolver(),
  tenant: { requiredByDefault: true },
});
```

Use the audit-log subpath when RBAC decisions and policy mutations should flow into an existing structural audit logger:

```ts
import { createAuditLogRbacLogger } from '@nestarc/rbac/integrations/audit-log';

RbacModule.forRoot(
  createStrictRbacOptions({
    storage,
    auditLogger: createAuditLogRbacLogger({ auditLog: auditService }),
  }),
);
```

Next: [Typed Permissions & Strict Mode](./typed-permissions) for permission contracts and rollout guidance, or [Migration from 0.1](./migration-0.2) when upgrading an existing app.
