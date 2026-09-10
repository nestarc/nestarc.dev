---
description: "Version-scoped @nestarc/tenancy guidance for coding agents: confirm package versions, configure authenticated tenant context and PostgreSQL RLS, and validate isolation."
---

# Agent Usage Guide

This consumer guide covers **@nestarc/tenancy 0.16.1**, Node.js `^22.13.0 || ^24.0.0`, NestJS 10/11, and Prisma 6/7. It guides application integration; repository maintenance instructions belong to the source repository. Public HTML and [llms.txt](/llms.txt) are navigation aids, not guarantees that an agent will retrieve or follow them.

## Confirm the installed version

```bash
node --version
npm ls @nestarc/tenancy @prisma/client prisma @nestjs/common @nestjs/core
```

Use the installed package declarations and matching release notes when they differ from a source checkout. GitHub `main` and source examples can contain unreleased changes; the generated API records its immutable release source. [Migration](./migration) lists version-specific requirements.

## Integration sequence

1. Start with [Installation](./installation) or the [complete HTTP example](https://github.com/nestarc/nestjs-tenancy/tree/v0.16.1/examples/quickstart). The example contains the schema, SQL, seed, bootstrap, authentication, module, controller, and commands. Read its setup and authentication limitations before reuse.
2. Create a required tenant column and RLS policies, including the non-empty-context restrictive guard. Use a runtime role that is neither a table owner, superuser, nor `BYPASSRLS`. Migrations use a separate schema-owner connection.
3. Register authentication with `app.use()` before `app.init()` or `app.listen()`, then authorize the principal's membership in the selected tenant. Module import order is not an ordering contract; a Guard runs after tenant middleware. [Extraction examples](./extractors) include slug validation, checked request properties, and the built-in raw-URL fallback available from 0.16.1 (with a wrapper for 0.16.0).
4. Register `TenancyModule` and create a Prisma client extension. Use the extended client for model operations. Align the Prisma tenant field name, SQL column mapping, and canonical `dbSettingKey`.
5. Use `tenancyTransaction(baseClient, tenancyService, callback)` for interactive transactions and raw SQL. Within its callback, use the supplied transaction client, include required tenant fields, and bind SQL values.
6. Add [cache isolation](./caching) and [message validation and authorization](./microservice) when using those resources. Database RLS does not scope Redis keys or authorize incoming messages.

## Behaviors to preserve

| API | Contract |
| --- | --- |
| `failClosed` | Defaults to `true` for model operations. Raw SQL is outside the model hook. |
| `sharedModels` | Skips extension checks, context setup, and injection for listed models; database RLS still applies. |
| `withoutTenant()` | Clears context and skips extension checks inside its callback; it does not grant database privileges. |
| `autoInjectTenantId` | Overwrites supported top-level create data, injects `upsert.create`, and removes the tenant field from `upsert.update`. It does not traverse nested writes or change generated Prisma input types. |
| `@BypassTenancy()` | Skips the Guard's tenant-required check; it does not clear existing context or authorize access. |
| `interactiveTransactionSupport` | Deprecated compatibility mode based on Prisma internals. Use the public transaction helper for new code; see the migration guide for the removal schedule. |
| Cache TTL | Nest/cache-manager values are milliseconds: `60_000` is one minute. |

Core exports are under `@nestarc/tenancy`; cache integration is under `@nestarc/tenancy/cache` with optional Nest cache peers; test helpers are under `@nestarc/tenancy/testing`. See [public modules](/api/tenancy/modules) for declarations.

## Validate the integration

```bash
npx @nestarc/tenancy check
npx @nestarc/tenancy doctor --json --table=public.users --role=app_user
```

Supply the schema, SQL, and database options for your project as described in [CLI](./cli). `check` validates generated SQL against the schema; `doctor` inspects the live database using the runtime role. A static check alone does not establish live tenant isolation.

Compile your application and exercise authenticated tenant A/B requests, a mismatched principal, missing context, failed writes, raw transactions, and any non-HTTP consumers. The [source example](https://github.com/nestarc/nestjs-tenancy/tree/v0.16.1/examples/quickstart) and [testing guide](./testing) provide starting points. Record which tests actually ran; do not describe local edits as an npm release or a deployed site.
