---
title: "How to Add Audit Logging to a NestJS API Without Changing Business Logic"
date: 2026-04-06
description: Add automatic change tracking to an existing NestJS + Prisma application in under 30 minutes — no service refactoring required.
author: nestarc
---

# How to Add Audit Logging to a NestJS API Without Changing Business Logic

Your compliance team wants to know who changed what and when. Your codebase has 50+ service methods doing Prisma writes. Manually adding log statements to each one is tedious and error-prone.

This post shows how to add automatic audit logging to an existing NestJS + Prisma application **without modifying any service or controller code**.

## The Problem

Traditional audit logging means sprinkling `auditService.log(...)` calls throughout your services:

```typescript
// Before: every write needs manual logging
async updateUser(id: string, dto: UpdateUserDto) {
  const before = await this.prisma.user.findUnique({ where: { id } });
  const after = await this.prisma.user.update({ where: { id }, data: dto });
  await this.auditService.log({ action: 'user.update', before, after }); // tedious
  return after;
}
```

This approach has problems:
- **Easy to forget** — new endpoints silently skip logging
- **Inconsistent** — each developer logs different fields
- **Coupled** — business logic is tangled with audit concerns
- **Brittle** — refactoring a service can break audit trails

## The Solution: Prisma Extension

`@nestarc/audit-log` uses a Prisma Client Extension to intercept write operations at the ORM layer. Your services stay untouched.

### Step 1: Install

```bash
npm install @nestarc/audit-log
```

### Step 2: Create the Audit Table

```prisma
model AuditLog {
  id        String   @id @default(uuid())
  action    String
  model     String
  recordId  String   @map("record_id")
  before    Json?
  after     Json?
  userId    String?  @map("user_id")
  tenantId  String?  @map("tenant_id")
  metadata  Json?
  createdAt DateTime @default(now()) @map("created_at")

  @@index([model, recordId])
  @@index([userId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

```bash
npx prisma migrate dev --name add-audit-logs
```

### Step 3: Register the Module

```typescript
import { AuditLogModule } from '@nestarc/audit-log';

@Module({
  imports: [
    AuditLogModule.forRoot({
      trackedModels: ['User', 'Task', 'Project'],
      sensitiveFields: ['password', 'ssn', 'apiKey'],
    }),
  ],
})
export class AppModule {}
```

### Step 4: Extend Your Prisma Client

```typescript
import { createAuditExtension } from '@nestarc/audit-log';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(auditConfig: AuditConfigService) {
    super();
    return this.$extends(createAuditExtension(auditConfig)) as this;
  }
}
```

That's it. Every `create`, `update`, `delete`, and `upsert` on tracked models now generates an audit record with before/after diffs.

## What Gets Logged

For an update operation, the audit record looks like:

```json
{
  "action": "user.update",
  "model": "User",
  "recordId": "usr_abc123",
  "before": { "name": "Alice", "role": "member" },
  "after": { "name": "Alice", "role": "admin" },
  "userId": "usr_xyz789",
  "createdAt": "2026-04-06T10:30:00.000Z"
}
```

Sensitive fields are automatically redacted:

```json
{
  "before": { "password": "[REDACTED]" },
  "after": { "password": "[REDACTED]" }
}
```

## Skipping Audit for Specific Routes

Some operations (health checks, batch imports) should not generate audit records. Use the `@NoAudit()` decorator:

```typescript
@NoAudit()
@Post('import')
async bulkImport(@Body() dto: ImportDto) {
  return this.userService.importBatch(dto.users);
}
```

## Querying the Audit Trail

```typescript
const logs = await this.auditService.query({
  model: 'User',
  recordId: 'usr_abc123',
  from: new Date('2026-01-01'),
  to: new Date(),
  limit: 50,
});
```

## Next Steps

- [Auto Tracking](/packages/audit-log/auto-tracking) — configuration options and transaction model
- [Manual Logging](/packages/audit-log/manual-logging) — log custom business events
- [Query API](/packages/audit-log/query-api) — search audit entries with filters
- [Prisma Extension Chaining](/guide/prisma-extension-chaining) — combine audit-log with tenancy and soft-delete
