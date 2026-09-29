# @nestarc/rbac

<!-- api-context:start -->
API reference for `@nestarc/rbac` **0.2.2**. Typed tenant-aware permissions, identity-source reconciliation, HTTP guards, Prisma 5/6/7 storage, and final decision audits.

## Start here

Install the documented release with `npm install @nestarc/rbac@0.2.2`. Follow [Installation](/packages/rbac/installation) for peer dependencies and application setup, then read [Guards and permissions](/packages/rbac/guards-permissions) for usage decisions and examples.

Choose an import path below to find its exported signatures and types. The root package contains the main application APIs; named subpaths group the additional integrations and utilities. The reference is generated from the published release, with source links pinned to its commit.
<!-- api-context:end -->

## Modules

- [`@nestarc/rbac`](index.md) — Register RbacModule, define permissions, and check authorization with RbacGuard or RbacService. Includes in-memory storage, subject and tenant contracts, strict options, and decision types.
- [`@nestarc/rbac/integrations/api-keys`](integrations/api-keys.md) — Resolve a machine-client subject from verified API-key request context with createApiKeySubjectResolver. Authentication must populate the context before RBAC runs.
- [`@nestarc/rbac/integrations/audit-log`](integrations/audit-log.md) — Connect an existing structural audit logger through createAuditLogRbacLogger and inspect its adapter options.
- [`@nestarc/rbac/integrations/tenancy`](integrations/tenancy.md) — Create a tenant resolver from the application tenant-context callback with createTenancyTenantResolver.
- [`@nestarc/rbac/prisma`](prisma.md) — Persist roles, permissions, and bindings with PrismaRbacStorage. Read the [Prisma storage guide](/packages/rbac/prisma-storage) for the schema and application provider setup.
- [`@nestarc/rbac/testing`](testing.md) — Build subjects and scenarios with TestRbacModule, then assert allow, deny, denial reasons, or permission matrices with the testing helpers.
