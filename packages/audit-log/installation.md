# Installation

## 1. Install

```bash
npm install @nestarc/audit-log
```

## 2. Create the audit_logs table

```typescript
import { applyAuditTableSchema } from '@nestarc/audit-log';

// In a migration or setup script:
await applyAuditTableSchema(prisma);
```

Or use `getAuditTableSQL()` to get the raw SQL string for your migration tool.

## 3. Complete NestJS Integration

The library requires two Prisma clients with distinct roles:

- **Base client** — used by `AuditService` for writing/querying audit logs
- **Extended client** — used by your application code for business writes (CUD tracking fires here)

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createAuditExtension } from '@nestarc/audit-log';

const auditExtensionOptions = {
  trackedModels: ['User', 'Invoice', 'Document'],
  sensitiveFields: ['password', 'ssn'],
  // primaryKey: { Order: 'orderNumber' }, // for non-id PKs
};

@Injectable()
export class PrismaService implements OnModuleInit {
  /** Base client — for audit storage (log/query) */
  readonly base = new PrismaClient();

  /** Extended client — use this for all application queries */
  readonly client = this.base.$extends(
    createAuditExtension(auditExtensionOptions),
  );

  async onModuleInit() {
    await this.base.$connect();
  }
}
```

```typescript
// prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { AuditLogModule } from '@nestarc/audit-log';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    PrismaModule,
    AuditLogModule.forRootAsync({
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        prisma: prisma.base,
        actorExtractor: (req) => ({
          id: req.user?.id ?? null,
          type: req.user ? 'user' : 'system',
          ip: req.ip,
        }),
        // tenantRequired: true, // fail-closed for multi-tenant deployments
      }),
    }),
  ],
})
export class AppModule {}
```

```typescript
// user.service.ts — use prisma.client (extended) for all business writes
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    // Automatic audit tracking fires because we use the extended client
    return this.prisma.client.user.create({ data });
  }
}
```

## createAuditExtension Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `trackedModels` | `string[]` | — | Whitelist of Prisma model names to track |
| `ignoredModels` | `string[]` | — | Blacklist (used when `trackedModels` is not set) |
| `sensitiveFields` | `string[]` | `[]` | Fields to mask as `[REDACTED]` in diffs |
| `primaryKey` | `Record<string, string>` | `{ *: 'id' }` | Map of model name to primary key field name |

## Schema Utilities

| Function | Description |
|----------|-------------|
| `getAuditTableSQL()` | Returns raw SQL string for creating audit_logs table + rules + indexes |
| `getAuditTableStatements()` | Returns SQL split into individual executable statements |
| `applyAuditTableSchema(prisma)` | Executes the schema SQL statement by statement via Prisma |
