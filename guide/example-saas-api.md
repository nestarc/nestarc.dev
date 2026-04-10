---
description: "Build a complete multi-tenant User API in 10 minutes using all 7 nestarc packages — tenancy, safe-response, audit-log, feature-flag, soft-delete, pagination, and idempotency."
---

# Example: SaaS API with All 7 Packages

This guide walks through the [example-saas-api](https://github.com/nestarc/example-saas-api) project — a minimal NestJS API that uses **every nestarc package** in a single app.

By the end, you'll have a User CRUD API with:
- Tenant isolation (RLS)
- Standardized response format
- Automatic audit trail
- Feature-flagged endpoints
- Soft-delete with restore
- Paginated list with filters
- Idempotent write endpoints

## Prerequisites

- Node.js >= 18
- Docker (for PostgreSQL)

## Setup

```bash
git clone https://github.com/nestarc/example-saas-api.git
cd example-saas-api
npm install
docker compose up -d
npx prisma db push
npm run start:dev
```

Server runs on `http://localhost:3000/api`.

## Project Structure

```
src/
├── main.ts              # Bootstrap
├── app.module.ts        # All 7 nestarc modules registered
├── prisma.service.ts    # PrismaClient with 3 chained extensions
└── users/
    ├── users.module.ts
    └── users.controller.ts  # 5 endpoints using all 7 packages
```

## Step 1: Prisma Extensions

The key to using multiple nestarc packages is **chaining Prisma extensions in the correct order**:

```typescript
// prisma.service.ts
this.extended = this
  .$extends(createPrismaTenancyExtension(this.tenancyService))  // 1st: RLS
  .$extends(createPrismaSoftDeleteExtension({                    // 2nd: soft-delete
    softDeleteModels: ['User'],
    deletedAtField: 'deletedAt',
  }))
  .$extends(createAuditExtension({                               // 3rd: audit
    trackedModels: ['User'],
  }));
```

**Why this order matters:**
1. **Tenancy first** — sets `app.current_tenant` via `SET LOCAL`, which all subsequent queries depend on
2. **Soft-delete second** — intercepts `delete()` before audit sees it, so the audit log records a soft-delete (not a hard delete)
3. **Audit-log last** — captures the final state of every operation after all other extensions have run

## Step 2: Module Registration

```typescript
// app.module.ts
@Module({
  imports: [
    // Extracts tenant from X-Tenant-Id header
    TenancyModule.forRoot({
      tenantExtractor: { type: 'header', header: 'x-tenant-id' },
    }),

    // Wraps all responses in { success, data, error }
    SafeResponseModule.register(),

    // Tracks who changed what, with before/after diffs
    AuditLogModule.forRoot({
      prisma: basePrisma,
      actorExtractor: (req) => ({
        id: req.headers['x-user-id'] ?? null,
        type: 'user',
        ip: req.ip,
      }),
    }),

    // DB-backed feature flags
    FeatureFlagModule.forRoot({
      environment: process.env.NODE_ENV ?? 'development',
      prisma: basePrisma,
      cacheTtlMs: 30_000,
    }),

    // Pagination module
    PaginationModule,

    // Idempotency — prevents duplicate processing on retries
    IdempotencyModule.forRoot({
      storage: new MemoryStorage(),
      ttl: 86400,
    }),
  ],
})
export class AppModule {}
```

Each module is independent — you can remove any one without affecting the others.

## Step 3: The Controller

A single controller demonstrates all 7 packages:

### Create (tenancy + audit-log + safe-response + idempotency)

```typescript
@Post()
@Idempotent()
@UseInterceptors(IdempotencyInterceptor)
async create(@Body() body: { name: string; email: string }) {
  return this.prisma.extended.user.create({
    data: { name: body.name, email: body.email },
  });
}
```

What happens behind the scenes:
1. **idempotency** — if the `Idempotency-Key` header was seen before, replays the cached response (handler skipped)
2. **tenancy** — RLS ensures the user is created under the current tenant
3. **audit-log** — automatically records the create with all field values
4. **safe-response** — wraps the result in `{ success: true, data: { ... } }`

### List (pagination + soft-delete + tenancy)

```typescript
@Get()
async findAll(@Paginate() query: PaginateQuery) {
  return paginate(query, this.prisma.extended.user, {
    sortableColumns: ['name', 'email', 'createdAt'],
    filterableColumns: { role: ['$eq', '$in'], name: ['$ilike'] },
    searchableColumns: ['name', 'email'],
  });
}
```

What happens:
1. **pagination** — parses `?page=1&limit=10&sortBy=name:ASC` from the query string
2. **soft-delete** — automatically adds `WHERE deleted_at IS NULL` to exclude deleted records
3. **tenancy** — RLS ensures only current tenant's records are returned

### Delete (soft-delete + audit-log)

```typescript
@Delete(':id')
async remove(@Param('id') id: string) {
  return this.prisma.extended.user.delete({ where: { id } });
}
```

What happens:
1. **soft-delete** — converts `DELETE` to `UPDATE SET deleted_at = now()`
2. **audit-log** — records the soft-delete with the before state

### Feature-flagged endpoint

```typescript
@Get('analytics')
@FeatureFlag('PREMIUM_ANALYTICS')
async analytics() {
  const count = await this.prisma.extended.user.count();
  return { totalUsers: count };
}
```

Returns `403 Forbidden` unless the `PREMIUM_ANALYTICS` feature flag is enabled for the current tenant.

## Try It

```bash
# Create a user (idempotent — safe to retry)
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: tenant-1" \
  -H "X-User-Id: admin-1" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"name": "Alice", "email": "alice@example.com"}'

# List users (paginated)
curl "http://localhost:3000/api/users?page=1&limit=10" \
  -H "X-Tenant-Id: tenant-1"

# Soft-delete
curl -X DELETE http://localhost:3000/api/users/<id> \
  -H "X-Tenant-Id: tenant-1"

# Feature-flagged (will return 403)
curl http://localhost:3000/api/users/analytics \
  -H "X-Tenant-Id: tenant-1"
```

## What's Not in This Example

This is intentionally minimal. A production app would also have:

- **Authentication middleware** (JWT, session, etc.)
- **Validation** (`class-validator` + `class-transformer`)
- **RLS setup SQL** ([see tenancy docs](/packages/tenancy/installation))
- **Feature flag seeding** (create flags via the FeatureFlagService)
- **Swagger documentation** (`@nestjs/swagger` integration)

See the [Adoption Roadmap](/guide/adoption-roadmap) for the recommended order to add each package to your own project.
