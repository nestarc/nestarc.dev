---
description: "NestJS feature flags with Prisma and PostgreSQL: attribute targeting, percentage rollouts, route guards, Redis caching, and a versioned integration guide."
---

# @nestarc/feature-flag

Store feature flags in PostgreSQL and evaluate them in your NestJS application. Use exact-match attributes to target users or tenants, percentage rollouts to release gradually, and `@FeatureFlag()` to gate routes. An external feature-flag service is not required; NestJS, Prisma, and the other [peer dependencies](./installation#install) are required.

**Start with [Installation and first evaluation](./installation).** It connects database setup, module registration, flag creation, and a request with an expected result. See the [agent usage guide](./agent-guide) for version checks, public imports, and validation steps.

## Version scope

The published release documented here is **0.6.0**, with NestJS 10/11, Prisma 7, and Node.js `^20.19.0`, `^22.12.0`, or `>=24.0.0`. The [generated API reference](/api/feature-flag/) is pinned to that release. Upgrading from 0.5.0 requires no feature-flag database migration. See the [versioned release notes](https://github.com/nestarc/nestjs-feature-flag/blob/v0.6.0/CHANGELOG.md).

::: warning Review rollout assignments when upgrading from 0.5.0
Version 0.6.0 preserves explicit `targetingKey`, forwards typed-client registry `bucketBy`, and applies module registry `bucketBy` in `evaluateAll()`. These values were previously ignored on those paths, so existing partial-rollout assignments can change. The release also adds invocation `bucketBy`, direct `repository` / `tenantContextProvider` options, and an OpenFeature SDK-compatible boolean provider. Read [the version boundary](./agent-guide#version-boundary) before removing workarounds.
:::

## What the package provides

| Need | Entry point |
| --- | --- |
| Gate a route or controller | [Guard and decorator](./guard-decorator) |
| Understand override and rollout precedence | [Evaluation and percentage rollouts](./rollout) |
| Target users, tenants, plans, or regions | [Attribute overrides and testing](./tenant-overrides) |
| Share cached flag data between replicas | [Memory and Redis cache adapters](./cache-adapters) |
| Manage flags through authenticated endpoints | [Admin REST API](./admin-api) |
| Use your own storage or tenant context | [Custom backends](./custom-backends) |
| Read performance methodology and limits | [Benchmark](./benchmark) |
| Integrate from an AI coding agent | [Agent usage guide](./agent-guide) |

`evaluateBoolean()` reports the value, source, reason, fallback, and available targeting metadata. `defineFlags()` and `createFeatureFlagClient()` provide typed flag keys and defaults. Optional events support evaluation, exposure, and mutation observability. The `/testing` subpath supplies service stubs; `/openfeature` supplies an [SDK-compatible boolean provider](./agent-guide#openfeature-sdk-registration).

For the architectural trade-offs, read [NestJS Feature Flags Without External Services](/blog/nestjs-feature-flags-without-external-services). For a longer walkthrough, read [Feature Flags for Gradual Rollout](/guide/feature-flags-rollout).
