---
description: "Configure @nestarc/rbac Prisma storage for PostgreSQL-backed roles, bindings, resources, and audit-ready metadata."
---

# Prisma Storage

`@nestarc/rbac/prisma` provides `PrismaRbacStorage`, a Prisma-compatible storage adapter for production apps.

## Install Prisma peers

```bash
npm install @prisma/client
npm install -D prisma
```

## Add schema and migration

Copy the package's example models from `prisma/schema.prisma.example` into your application's Prisma schema, then apply `prisma/migrations/0001_init_rbac.sql` through your migration workflow.

The storage contract expects stable role keys, subject bindings, optional resource scopes, timestamps, and metadata JSON.

## Register storage

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

## Tenant and global roles

Tenant roles should set `tenantId`. Global roles use `tenantId: null` and only apply to tenant-scoped checks when you explicitly allow it:

```ts
RbacModule.forRoot({
  storage,
  tenant: {
    requiredByDefault: true,
    allowGlobalRolesInTenant: false,
  },
});
```

Keep global roles rare. Most SaaS authorization decisions should be tenant-scoped.

## Production notes

- Run migrations before assigning roles in application boot code.
- Validate role keys and permission strings before exposing admin write APIs.
- Avoid storing sensitive auth-provider payloads in subject attributes or metadata.
- Keep RBAC writes auditable. The package emits audit events and includes `NoopRbacAuditLogger` when an app wants an explicit no-op logger.
