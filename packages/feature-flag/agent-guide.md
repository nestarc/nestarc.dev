---
description: "Use @nestarc/feature-flag from AI coding agents: verify package versions, select public imports, follow a runnable NestJS and Prisma setup, and test flag behavior."
---

# Agent usage guide

This is a consumer integration guide for **@nestarc/feature-flag 0.6.0**. Read it before generating application code. It does not replace the installed package's TypeScript declarations or authorize a package upgrade.

## Version boundary

Start in the consumer application:

```bash
npm ls @nestarc/feature-flag @nestjs/common @nestjs/core @prisma/client prisma
node --version
```

0.6.0 supports NestJS 10/11 and Prisma 7 on Node.js `^20.19.0`, `^22.12.0`, or `>=24.0.0`. Match examples to the lockfile and the [released API](/api/feature-flag/). For an older installation, use its versioned source and migration notes.

The published release and generated API reference are **0.6.0**. The changes below are available in that release. They require no Prisma schema migration from 0.5.0, but corrected key selection can change partial-rollout assignments. Review affected cohorts before deploying an upgrade.

| Behavior | Earlier 0.5.0 | Published 0.6.0 |
| --- | --- | --- |
| Explicit `context.targetingKey` in service evaluation | Dropped; use a stable `userId` or `tenantId` | Forwarded to evaluation |
| Typed-client registry `bucketBy` | Not forwarded by the client | Passed into single-flag evaluation |
| Module registry `bucketBy` in `evaluateAll()` | Not applied | Applied per stored flag |
| Invocation `options.bucketBy` | Not available | Selects the bucket attribute ahead of registry and flag metadata; explicit `targetingKey` still wins |
| Custom repository or tenant-provider registration | Parent-module token providers do not replace internal defaults | `repository` and `tenantContextProvider` instance options |
| SDK provider registration | Direct boolean adapter; does not satisfy the full TypeScript SDK `Provider` interface | Full boolean-only provider registration; non-boolean resolutions report type mismatch |
| OpenFeature context handling | Flat primitive attributes only; a targetingKey-only context is affected by the service bug | Explicit targeting key forwarded; scalar attributes mapped, object and array values ignored |

Use the [0.6.0 consumer guide](https://github.com/nestarc/nestjs-feature-flag/blob/v0.6.0/docs/usage.md) and [release notes](https://github.com/nestarc/nestjs-feature-flag/blob/v0.6.0/CHANGELOG.md) with the installed declarations. Version 0.6.0 also rejects null and non-integer percentages before Prisma and aligns nullable description/context types with runtime behavior.

## Public imports

| Import | Purpose |
| --- | --- |
| `@nestarc/feature-flag` | Module, service, decorators, registry helpers, cache adapters, public types |
| `@nestarc/feature-flag/testing` | `TestFeatureFlagModule` and test controls |
| `@nestarc/feature-flag/openfeature` | `createOpenFeatureBooleanProvider()`, an SDK-compatible boolean provider |

TypeScript consumers importing `/openfeature` need `@openfeature/server-sdk@^1.23.0` because the public provider declarations reference its types. The adapter has no SDK runtime import. See the [SDK registration recipe](#openfeature-sdk-registration).

Do not import from `src/` or `dist/` internals. The Prisma client comes from the application's generated output, not the `@prisma/client` root in the Prisma 7 recipe.

## Integration sequence

1. Follow [Installation and first evaluation](./installation) in an existing NestJS app. Add both Prisma models and the SQL constraints, migrate the database, and generate the client.
2. Export `PrismaService` from `PrismaModule`; include that module in `forRootAsync.imports` before injecting it. Keep events disabled until `EventEmitterModule.forRoot()` is present.
3. Create the first flag with `enabled: true, percentage: 0`. Register its controller, start the app, and verify the documented HTTP response.
4. Choose the context deliberately. HTTP user extraction requires `userIdExtractor`; tenant integration requires a configured `TenancyModule` and an established context. Background jobs should pass `userId`, `tenantId`, and attributes explicitly. Explicit tenant IDs work without `@nestarc/tenancy`.
5. Add [attribute overrides](./tenant-overrides) and [percentage rollout](./rollout) only after the first evaluation succeeds. Choose a stable `targetingKey` or [bucket attribute](./rollout#targeting-key-selection). Register the same flag definitions at module level when direct service or bulk calls need the typed client's bucketing settings.
6. Add [Redis](./cache-adapters), [admin endpoints](./admin-api), or [events](./rollout#events) only when needed. Keep each optional peer and Nest import with its configuration.
7. Use `/testing` to test application branches. Use the real service and database to verify targeting, persistence, and cache behavior.

## Semantics to preserve

- Evaluation order is archived → matching attribute override → percentage → global `enabled`. `enabled: false` alone does not stop an active percentage rollout or a matching enabling override. Archiving a stored flag makes evaluation return false.
- Override matching is exact and type-sensitive. More matched attributes win, then higher priority, earlier creation time, and lower ID. Explicit null suppresses ambient context fallback and can match a null attribute.
- Percentages 1–99 require a usable key; without one they fall through to `enabled`. A percentage of 100 returns true without a key. Keep `enabled: false` for the global fallback during a partial rollout.
- Single-flag evaluation uses invocation default, registry default, then module `defaultOnMissing` for missing flags or evaluation errors. `evaluateAll()` returns active stored flags only, propagates errors, and emits no evaluation or exposure events.
- The cache stores flag records, not a decision shared between all users. Redis invalidation is best-effort; TTL and races still matter. 30 seconds is a default, not a measured optimum. Zero TTL skips built-in cache writes but does not bypass existing shared Redis entries.
- The test module stubs configured booleans; it does not run the real targeting, persistence, or event pipeline. OpenFeature support is boolean-only and does not provide nested-object targeting.

## OpenFeature SDK registration

Install the optional SDK in the consumer application:

```bash
npm install @openfeature/server-sdk@^1.23.0
```

After initializing the Nest application with `FeatureFlagModule`, register its service-backed provider:

```typescript
import { OpenFeature } from '@openfeature/server-sdk';
import { FeatureFlagService } from '@nestarc/feature-flag';
import { createOpenFeatureBooleanProvider } from '@nestarc/feature-flag/openfeature';

// app is the initialized Nest application.
await OpenFeature.setProviderAndWait(
  createOpenFeatureBooleanProvider(app.get(FeatureFlagService)),
);
const client = OpenFeature.getClient();
const enabled = await client.getBooleanValue('NEW_CHECKOUT', false, {
  targetingKey: 'user-42',
  tenantId: 'tenant-acme',
  plan: 'pro',
});
```

Known context fields map to the library context; additional scalar fields such as `plan` become targeting attributes. Arrays and nested objects are ignored. The SDK's boolean default is forwarded to the service for missing/error evaluations. Non-boolean getters return the supplied default with reason `ERROR` and error code `TYPE_MISMATCH`. This provider does not implement variant flags. Use the library evaluation API or module registry to configure exposure tracking.

## Validation before handing off generated code

Build or typecheck the consumer app against its installed dependency versions. Exercise an enabled route and a disabled route, a missing flag's fallback, an override match and miss, and a stable rollout key. If using bulk evaluation, compare the relevant values with individual evaluations using the same context. If using Redis, check mutation visibility across two instances and TTL recovery after missed invalidation.

Record which dependency versions and checks ran. Do not describe a copied snippet, passing service stub, or historical benchmark as proof of database integration or current performance.
