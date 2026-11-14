---
description: "Version-scoped @nestarc/tenancy guidance for coding agents: confirm package versions, configure authenticated tenant context and PostgreSQL RLS, and validate isolation."
---

# Agent Usage Guide

This consumer guide covers **@nestarc/tenancy 0.16.4**, Node.js `^22.23.4 || ^24.22.1`, NestJS 10/11, and Prisma 6/7. Use the [0.16.4 migration](./migration#upgrade-to-0-16-4) for applications integrating audit-log and soft-delete.

## Confirm the installed version

```bash
node --version
node -p process.execPath
npm ls @nestarc/tenancy @prisma/client prisma @nestjs/common @nestjs/core
npm ls body-parser --all
```

Use the installed package declarations and matching release notes when they differ from a source checkout. GitHub `main` and source examples can contain unreleased changes; the generated API records its immutable release source. [Migration](./migration) lists version-specific requirements.

The security requirements introduced in 0.16.2 still apply. Patch the actual Node binary in every service, worker, CI job, and container. Update each application-owned `body-parser` copy to at least 1.20.9 on 1.x or 2.4.0 on 2.x, preserving caller compatibility. Check `TenantResourceKey` configuration before upgrading. Empty and ASCII-digit-only separators throw at construction. [Key migration](./non-http-resources#migrating-tenant-resource-key-separators) · [Deployment sequence](./migration#upgrade-to-0-16-2)

## Integration sequence

1. Start with [Installation](./installation) or the [complete HTTP example](https://github.com/nestarc/nestjs-tenancy/tree/v0.16.4/examples/quickstart). The example contains the schema, SQL, seed, bootstrap, authentication, module, controller, and commands. Read its setup and authentication limitations before reuse.
2. Create a required tenant column and RLS policies, including the non-empty-context restrictive guard. Use a runtime role that is neither a table owner, superuser, nor `BYPASSRLS`. Migrations use a separate schema-owner connection.
3. Register authentication with `app.use()` before `app.init()` or `app.listen()`, then authorize the principal's membership in the selected tenant. Module import order is not an ordering contract; a Guard runs after tenant middleware. [Extraction examples](./extractors) include slug validation, checked request properties, and the built-in raw-URL fallback available from 0.16.1 (with a wrapper for 0.16.0).
4. Register `TenancyModule` and create a Prisma client extension. Use the extended client for model operations. Align the Prisma tenant field name, SQL column mapping, and canonical `dbSettingKey`.
5. Use `tenancyTransaction(baseClient, tenancyService, callback)` when tenancy opens the transaction. Use the supplied transaction client, include required tenant fields, and bind raw SQL values.
6. For automatic audit and soft-delete, use `0.16.4 / 0.7.0 / 0.7.5` for tenancy, audit-log, and soft-delete respectively. Build a dedicated client from the same base with audit first and soft-delete second. Pass `tenancyTransactionCallback(tenancyService, work)` directly to that client's `withAuditTransaction()`. The ordinary client retains the per-query tenancy extension. [Integration guide](/guide/prisma-extension-chaining)
7. Add [cache isolation](./caching) and [message validation and authorization](./microservice) when using those resources. Database RLS does not scope Redis keys or authorize incoming messages.

## Behaviors to preserve

| API | Contract |
| --- | --- |
| `failClosed` | Defaults to `true` for model operations. Raw SQL is outside the model hook. |
| `sharedModels` | Skips extension checks, context setup, and injection for listed models; database RLS still applies. |
| `withoutTenant()` | Clears context and skips extension checks inside its callback; it does not grant database privileges. |
| `autoInjectTenantId` | Overwrites supported top-level create data, injects `upsert.create`, and removes the tenant field from `upsert.update`. It does not traverse nested writes or change generated Prisma input types. |
| `@BypassTenancy()` | Skips the Guard's tenant-required check; it does not clear existing context or authorize access. |
| `tenancyTransactionCallback()` | Uses the tenant from the invocation context and binds it to the owner's transaction. Missing context, a root client, or a conflicting tenant binding rejects before user work. The transaction owner sets options and handles commit and rollback. |
| `interactiveTransactionSupport` | Deprecated compatibility mode based on Prisma internals, scheduled for removal in 0.17. |
| Cache TTL | Nest/cache-manager values are milliseconds: `60_000` is one minute. |
| `TenantResourceKey` separator | Must contain at least one non-digit character. Empty and ASCII-digit-only values throw even with missing-context policy `ignore` or `warn`; default `:` keys are unchanged. |

Core exports are under `@nestarc/tenancy`; cache integration is under `@nestarc/tenancy/cache` with optional Nest cache peers; test helpers are under `@nestarc/tenancy/testing`. See [public modules](/api/tenancy/modules) for declarations.

## Validate the integration

```bash
npx @nestarc/tenancy check
npx @nestarc/tenancy doctor --json --table=public.users --role=app_user
```

Supply the schema, SQL, and database options for your project as described in [CLI](./cli). `check` validates generated SQL against the schema; `doctor` inspects the live database using the runtime role. A static check alone does not establish live tenant isolation.

Compile your application and exercise authenticated tenant A/B requests, a mismatched principal, missing context, failed writes, raw transactions, and any non-HTTP consumers. For an audit-owned transaction, check that a failed audit insert rolls back earlier business changes and audit rows, and that one tenant cannot restore another tenant's row. [Release integration test](https://github.com/nestarc/nestjs-tenancy/blob/v0.16.4/test/ecosystem/audit-lifecycle/verify.mjs)

Verify separate resource values for two tenants using the same logical key, and accepted compressed requests if the application supports them. The [source example](https://github.com/nestarc/nestjs-tenancy/tree/v0.16.4/examples/quickstart) and [testing guide](./testing) provide starting points.
