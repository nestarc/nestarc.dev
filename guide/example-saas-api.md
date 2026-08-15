---
description: "Explore a checked-in NestJS SaaS API snapshot that composes tenancy, safe-response, audit-log, feature-flag, soft-delete, pagination, and idempotency."
---

<script setup>
import PackageVersion from '../.vitepress/theme/components/PackageVersion.vue'
</script>

# Example: SaaS API with Seven Packages

This guide walks through an inspected [example-saas-api](https://github.com/nestarc/example-saas-api) repository snapshot — a small NestJS project that shows where seven nestarc packages could compose in one application.

The source contains tenant context and Prisma extension wiring, global response wrapping, User CUD audit hooks, a feature-flag decorator, soft-delete interception, a paginated list, and idempotency decorators on writes. It is a composition snapshot, not a working or production-ready starter.

## Package map

The versions below come from the package catalog. “In this snapshot” describes only the code that is actually checked into the example repository; it is not a claim that the example exercises every current package feature.

| Package | Current version | Current package scope | In this snapshot |
| --- | --- | --- | --- |
| [`@nestarc/tenancy`](/packages/tenancy/) | <PackageVersion slug="tenancy" /> | PostgreSQL RLS, Prisma 7 query isolation, and tenant-aware cache keys | Reads `X-Tenant-Id` and applies the tenancy Prisma extension |
| [`@nestarc/safe-response`](/packages/safe-response/) | <PackageVersion slug="safe-response" /> | Response wrapping with Swagger integration, field selection, error catalogs, and i18n | Registers the global response wrapper |
| [`@nestarc/audit-log`](/packages/audit-log/) | <PackageVersion slug="audit-log" /> | Prisma CUD tracking, query cursors, retention, partitions, and actor metadata | Applies the audit extension to `User` writes |
| [`@nestarc/feature-flag`](/packages/feature-flag/) | <PackageVersion slug="feature-flag" /> | DB-backed flags, cache adapters, rollouts, tenant overrides, and an Admin API | Gates the analytics route with `@FeatureFlag()` |
| [`@nestarc/soft-delete`](/packages/soft-delete/) | <PackageVersion slug="soft-delete" /> | Prisma soft-delete, relation filters, cascade, bulk restore, purge, and lifecycle events | Rewrites `User` deletes and filters deleted records |
| [`@nestarc/pagination`](/packages/pagination/) | <PackageVersion slug="pagination" /> | Prisma cursor, keyset, and offset pagination with filters, sorting, and Swagger helpers | Parses and applies list pagination/filter options |
| [`@nestarc/idempotency`](/packages/idempotency/) | <PackageVersion slug="idempotency" /> | Draft-07 `Idempotency-Key`, stable fingerprints, response/header replay, and Redis/Postgres storage | Uses `MemoryStorage` and protects write routes with the interceptor |

::: warning Snapshot versus current releases
The repository's verified [`main` snapshot at `6af390e`](https://github.com/nestarc/example-saas-api/tree/6af390e657072384d5c2a32465915102a64f62d1) pins Prisma `6.19.3`, the legacy `prisma-client-js` generator, and earlier nestarc package releases. The snippets below explain that snapshot. For a new application, use the catalog versions above and follow [Getting Started](/getting-started), [Prisma 7 Setup](/guide/prisma-7), and each package's installation page instead of upgrading the snapshot piecemeal.
:::

## Prerequisites

| Use case | Requirement | Support boundary |
| --- | --- | --- |
| Inspect the checked-in snapshot | Git | Fixed commit only; no supported run path |
| Start a current application | Node.js `^20.19`, `^22.12`, or `^24.0`; Prisma 7 | Generated-client output and a driver adapter; audit-log narrows the shared Node 24 range |

The current application path also needs PostgreSQL. No global Prisma installation is required.

## Inspect the checked-in snapshot

```bash
git clone https://github.com/nestarc/example-saas-api.git
cd example-saas-api
git checkout 6af390e657072384d5c2a32465915102a64f62d1
```

::: danger Known snapshot blockers
The checked-in snapshot is not end-to-end runnable as documented in its own source:

- its create handler omits required `tenantId`, while the tenancy extension leaves `autoInjectTenantId` at its default `false`;
- its `package.json` and lockfile disagree, so `npm ci` exits before installation, and a fallback `npm install` still leaves TypeScript build errors;
- its sample tenant slugs do not pass tenancy's default UUID validator;
- audit-log and feature-flag are registered with `null as any` Prisma placeholders that are never replaced;
- it applies audit-table DDL during application startup and does not include RLS policy SQL or `PREMIUM_ANALYTICS` seed data.

Use the repository to inspect integration locations, not as a verified quick start. The current-package section below is a migration checklist, not a complete application; the linked package installation guides are the executable contracts.
:::

## Current application migration checklist

In an existing NestJS 10/11 application, install the seven packages and the shared Prisma 7/PostgreSQL dependencies:

```bash
npm install @nestarc/tenancy @nestarc/safe-response @nestarc/audit-log \
  @nestarc/feature-flag @nestarc/soft-delete @nestarc/pagination \
  @nestarc/idempotency @prisma/client @prisma/adapter-pg pg dotenv \
  @nestjs/swagger class-transformer class-validator
npm install --save-dev prisma
```

Then configure Prisma 7's `prisma-client` generator, explicit output directory, `prisma.config.ts`, and PostgreSQL driver adapter as shown in [Prisma 7 Setup](/guide/prisma-7). Storage and optional peers are package-specific: in particular, use shared Redis or Postgres storage for production idempotency rather than `MemoryStorage`. Follow the installation guides for [tenancy](/packages/tenancy/installation), [safe-response](/packages/safe-response/installation), [audit-log](/packages/audit-log/installation), [feature-flag](/packages/feature-flag/installation), [soft-delete](/packages/soft-delete/installation), [pagination](/packages/pagination/installation), and [idempotency](/packages/idempotency/installation).

## Snapshot project structure

```
src/
├── main.ts              # Bootstrap
├── app.module.ts        # 6 Nest modules registered
├── prisma.service.ts    # PrismaClient with 3 chained extensions
└── users/
    ├── users.module.ts
    └── users.controller.ts  # 5 endpoints using the package integrations
```

## Snapshot Step 1: Prisma Extensions

The snapshot uses Prisma 6's legacy `@prisma/client` output and chains the three extensions in this order:

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

The snapshot types its extended client as `any`, which hides the required `tenantId` create field. In a current type-safe implementation, derive that field from tenant context and enable runtime overwrite as defense in depth:

```typescript
const prisma = basePrisma.$extends(
  createPrismaTenancyExtension(this.tenancyService, {
    autoInjectTenantId: true,
    tenantIdField: 'tenantId',
  }),
);

const tenantId = this.tenancyService.getCurrentTenantOrThrow();
await prisma.user.create({ data: { name, email, tenantId } });
```

**Why this order matters:**
1. **Tenancy first** — Prisma runs query callbacks in registration order, so it establishes transaction-local `app.current_tenant` before delegating.
2. **Soft-delete second** — rewrites `delete()` to a tenant-scoped update through its captured lower client.
3. **Audit-log last** — tracks writes that reach it, but the current soft-delete delete handler does not call the continuation, so it does not automatically audit soft-deletes. Use the lifecycle-event bridge for best-effort audit or an explicit tenant-scoped transaction for atomic mutation plus audit.

For Prisma 7, create the base client from the explicit generated output with a PostgreSQL driver adapter. Audit-log also needs the generated `{ Prisma }` namespace, and soft-delete needs explicit DMMF when cascade or relation filters are enabled. Use the current [Prisma Extension Chaining](/guide/prisma-extension-chaining) example instead of copying the snapshot's client bootstrap.

## Current registration map (abridged)

The following is an abridged current registration map. It assumes `basePrisma` and `prismaModule = { Prisma }` come from the Prisma 7 setup described above; use async registration when those values are provided by an injectable `PrismaService`.

```typescript
// app.module.ts
@Module({
  imports: [
    // Extracts tenant from X-Tenant-Id header
    TenancyModule.forRoot({
      tenantExtractor: 'X-Tenant-Id',
    }),

    // Wraps all responses in { success, data, error }
    SafeResponseModule.register(),

    // Tracks who changed what, with before/after diffs
    AuditLogModule.forRoot({
      prisma: basePrisma,
      prismaModule,
      actorExtractor: (req) => ({
        id: req.user?.id ?? null,
        type: req.user ? 'user' : 'system',
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
    PaginationModule.forRoot(),

    // Idempotency — prevents duplicate processing on retries
    IdempotencyModule.forRoot({
      storage: new MemoryStorage(), // local development only
      ttl: 86400,
    }),
  ],
})
export class AppModule {}
```

Each package has its own registration or extension point. If you remove one, also remove its Prisma extension, route decorators/interceptors, schema objects, and peer dependencies where applicable.

This map assumes trusted authentication middleware registered before audit middleware has already verified the credential and populated `req.user`; a later Nest guard is too late for audit's middleware-phase extractor. Never derive audit identity from a caller-controlled user header, and verify stored actor attribution in an integration test.

## Snapshot Step 3: The Controller

A single controller shows the seven intended package integration points. These snippets preserve the inspected snapshot, including the known build/runtime defects called out above; do not copy them into a current application.

### Snapshot create handler (known broken)

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

The snapshot intends this pipeline, but step 2 stops the request before the remaining effects can be relied on:
1. **idempotency** — if the `Idempotency-Key` header was seen before, replays the cached response (handler skipped)
2. **tenancy** — the snapshot establishes tenant context, but this create still fails because its required `tenantId` is absent and auto-injection is disabled
3. **audit-log** — would record the create after the required Prisma and audit storage wiring is repaired
4. **safe-response** — would wrap a successful result in `{ success: true, data: { ... } }`

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
3. **tenancy** — after you install the RLS policy, PostgreSQL returns only the current tenant's records

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

## Illustrative request shapes after repairing the implementation

These shapes are not a runnable path for the pinned snapshot. They assume a separate implementation has replaced the placeholders, supplied typed `tenantId` data, enabled runtime tenant overwrite, installed RLS policies, and seeded the feature flag.

```bash
# Create a user (idempotent — safe to retry)
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: 550e8400-e29b-41d4-a716-446655440000" \
  -H "X-User-Id: admin-1" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"name": "Alice", "email": "alice@example.com"}'

# List users (paginated)
curl "http://localhost:3000/api/users?page=1&limit=10" \
  -H "X-Tenant-Id: 550e8400-e29b-41d4-a716-446655440000"

# Soft-delete
USER_ID='replace-with-a-user-id'
curl -X DELETE "http://localhost:3000/api/users/${USER_ID}" \
  -H "X-Tenant-Id: 550e8400-e29b-41d4-a716-446655440000" \
  -H "X-User-Id: admin-1" \
  -H "Idempotency-Key: $(uuidgen)"

# Feature-flagged (will return 403)
curl http://localhost:3000/api/users/analytics \
  -H "X-Tenant-Id: 550e8400-e29b-41d4-a716-446655440000"
```

## What's Not in This Example

This is intentionally minimal. A production app would also need:

- **Authentication middleware** (JWT, session, etc.)
- **Validation** (`class-validator` + `class-transformer`)
- **RLS setup SQL** ([see tenancy docs](/packages/tenancy/installation))
- **Feature flag seeding** (create flags via the FeatureFlagService)
- **Shared idempotency storage** (Redis or Postgres instead of `MemoryStorage`)
- **Current Prisma 7 bootstrap** (generated output, Prisma Config, and a driver adapter)
- **Package-specific migrations and production configuration** from the current installation guides
- **Swagger documentation** (`@nestjs/swagger` integration)

See the [Adoption Roadmap](/guide/adoption-roadmap) for the recommended adoption path in your own project.
