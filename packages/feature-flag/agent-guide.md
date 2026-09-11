---
description: "Use @nestarc/feature-flag from AI coding agents: verify package versions, select public imports, follow a runnable NestJS and Prisma setup, and test flag behavior."
---

# Agent usage guide

This is a consumer integration guide for **@nestarc/feature-flag 0.5.0**. Read it before generating application code. It does not replace the installed package's TypeScript declarations or authorize a package upgrade.

## Version boundary

Start in the consumer application:

```bash
npm ls @nestarc/feature-flag @nestjs/common @nestjs/core @prisma/client prisma
node --version
```

0.5.0 supports NestJS 10/11 and Prisma 7 on Node.js `^20.19.0`, `^22.12.0`, or `>=24.0.0`. Match examples to the lockfile and the [released API](/api/feature-flag/). For an older installation, use its versioned source and migration notes.

The source package has been bumped to **0.6.0**. It is pending npm publication; use a locally built `nestarc-feature-flag-0.6.0.tgz` to verify these changes before release. The generated API reference remains pinned to published 0.5.0.

| Behavior | Published 0.5.0 | 0.6.0 (pending publication) |
| --- | --- | --- |
| Explicit `context.targetingKey` in service evaluation | Dropped; use a stable `userId` or `tenantId` | Forwarded to evaluation |
| Typed-client registry `bucketBy` | Not forwarded by the client | Passed into single-flag evaluation |
| Module registry `bucketBy` in `evaluateAll()` | Not applied | Applied per stored flag |
| Invocation `options.bucketBy` | Not available | Overrides registry and flag metadata |
| Custom repository or tenant-provider registration | Parent-module token providers do not replace internal defaults | `repository` and `tenantContextProvider` instance options |
| SDK provider registration | Direct boolean adapter; does not satisfy the full TypeScript SDK `Provider` interface | Full boolean-only provider registration; non-boolean resolutions report type mismatch |
| OpenFeature context handling | Flat primitive attributes only; a targetingKey-only context is affected by the service bug | Explicit targeting key forwarded; scalar attributes mapped, object and array values ignored |

The [release README](https://github.com/nestarc/nestjs-feature-flag/blob/v0.5.0/README.md) records the original 0.5.0 documentation; the limitations above correct its usage claims. [Current source documentation](https://github.com/nestarc/nestjs-feature-flag/blob/main/README.md) and [release notes](https://github.com/nestarc/nestjs-feature-flag/blob/main/CHANGELOG.md) may describe work that has not been published. Confirm a release contains each fix before removing a workaround.

## Public imports

| Import | Purpose |
| --- | --- |
| `@nestarc/feature-flag` | Module, service, decorators, registry helpers, cache adapters, public types |
| `@nestarc/feature-flag/testing` | `TestFeatureFlagModule` and test controls |
| `@nestarc/feature-flag/openfeature` | `createOpenFeatureBooleanProvider()`, a direct boolean adapter in 0.5.0 |

Published 0.5.0 exposes a direct boolean adapter but lacks the full TypeScript SDK `Provider` interface. The SDK registration recipe in current source is for **0.6.0 (pending publication)** and uses `@openfeature/server-sdk` `^1.23.0`. In that checkout, TypeScript consumers importing `/openfeature` need the SDK types; loading the runtime adapter alone does not load the SDK.

Do not import from `src/` or `dist/` internals. The Prisma client comes from the application's generated output, not the `@prisma/client` root in the Prisma 7 recipe.

## Integration sequence

1. Follow [Installation and first evaluation](./installation) in an existing NestJS app. Add both Prisma models and the SQL constraints, migrate the database, and generate the client.
2. Export `PrismaService` from `PrismaModule`; include that module in `forRootAsync.imports` before injecting it. Keep events disabled until `EventEmitterModule.forRoot()` is present.
3. Create the first flag with `enabled: true, percentage: 0`. Register its controller, start the app, and verify the documented HTTP response.
4. Choose the context deliberately. HTTP user extraction requires `userIdExtractor`; tenant integration requires a configured `TenancyModule` and an established context. Background jobs should pass `userId`, `tenantId`, and attributes explicitly. Explicit tenant IDs work without `@nestarc/tenancy`.
5. Add [attribute overrides](./tenant-overrides) and [percentage rollout](./rollout) only after the first evaluation succeeds. In 0.5.0, prefer explicit user/tenant keys across single and bulk evaluation; do not rely on the registry `bucketBy` paths listed above.
6. Add [Redis](./cache-adapters), [admin endpoints](./admin-api), or [events](./rollout#events) only when needed. Keep each optional peer and Nest import with its configuration.
7. Use `/testing` to test application branches. Use the real service and database to verify targeting, persistence, and cache behavior.

## Semantics to preserve

- Evaluation order is archived → matching attribute override → percentage → global `enabled`. `enabled: false` alone does not stop an active percentage rollout or a matching enabling override. Archiving a stored flag makes evaluation return false.
- Override matching is exact and type-sensitive. More matched attributes win, then higher priority, earlier creation time, and lower ID. Explicit null suppresses ambient context fallback and can match a null attribute.
- In 0.5.0, percentages 1–99 require a usable key; without one they fall through to `enabled`. A percentage of 100 returns true without a key. Keep `enabled: false` for the global fallback during a partial rollout.
- Single-flag evaluation uses invocation default, registry default, then module `defaultOnMissing` for missing flags or evaluation errors. `evaluateAll()` returns active stored flags only, propagates errors, and emits no evaluation or exposure events.
- The cache stores flag records, not a decision shared between all users. Redis invalidation is best-effort; TTL and races still matter. 30 seconds is a default, not a measured optimum. Zero TTL skips built-in cache writes but does not bypass existing shared Redis entries.
- The test module stubs configured booleans; it does not run the real targeting, persistence, or event pipeline. OpenFeature support is boolean-only and does not provide nested-object targeting.

## Validation before handing off generated code

Build or typecheck the consumer app against its installed dependency versions. Exercise an enabled route and a disabled route, a missing flag's fallback, an override match and miss, and a stable rollout key. If using bulk evaluation, compare the relevant values with individual evaluations using the same context. If using Redis, check mutation visibility across two instances and TTL recovery after missed invalidation.

Record which dependency versions and checks ran. Do not describe a copied snippet, passing service stub, or historical benchmark as proof of database integration or current performance.
