# @nestarc/tenancy

<!-- api-context:start -->
API reference for `@nestarc/tenancy` **0.16.4**. PostgreSQL TEXT/UUID RLS, tenant-scoped Prisma transactions, live audits, and validated RPC tenant context.

## Start here

Install the documented release with `npm install @nestarc/tenancy@0.16.4`. Follow [Installation](/packages/tenancy/installation) for peer dependencies and application setup, then read [Agent guide](/packages/tenancy/agent-guide) for usage decisions and examples.

Choose an import path below to find its exported signatures and types. The root package contains the main application APIs; named subpaths group the additional integrations and utilities. The reference is generated from the published release, with source links pinned to its commit.
<!-- api-context:end -->

## Modules

- [`@nestarc/tenancy/cache`](cache.md) — Configure TenantCacheInterceptor and SharedTenantCache for cache behavior that accounts for tenant context. Read the [caching guide](/packages/tenancy/caching) before sharing entries across tenants.
- [`@nestarc/tenancy`](index.md) — Configure tenant extraction, context, guards, Prisma isolation, and tenant propagation. Use tenancyTransaction to open a tenant-scoped transaction or tenancyTransactionCallback to initialize the transaction supplied by its owner. See the [audit and soft-delete integration](/guide/prisma-extension-chaining).
- [`@nestarc/tenancy/testing`](testing.md) — Use TestTenancyModule, withTenant, and expectTenantIsolation to supply tenant context and verify isolation in application tests.
