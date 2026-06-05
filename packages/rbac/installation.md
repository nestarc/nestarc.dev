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
