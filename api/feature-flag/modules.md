# @nestarc/feature-flag

> Published 0.5.0 API. For corrected targeting, tenant-context, and custom-provider usage, read [the maintained version boundary](https://nestarc.dev/packages/feature-flag/agent-guide#version-boundary). Unreleased fixes are not included in these signatures.


<!-- api-context:start -->
API reference for `@nestarc/feature-flag` **0.5.0**. DB-backed feature flags with cache adapters, Admin API, rollouts, and tenant overrides.

## Start here

Install the documented release with `npm install @nestarc/feature-flag@0.5.0`. Follow [Installation](/packages/feature-flag/installation) for peer dependencies and application setup, then read [Agent guide and version boundary](/packages/feature-flag/agent-guide) for usage decisions and examples.

Choose an import path below to find its exported signatures and types. The root package contains the main application APIs; named subpaths group the additional integrations and utilities. The reference is generated from the published release, with source links pinned to its commit.
<!-- api-context:end -->

## Modules

- [`@nestarc/feature-flag`](index.md) — Register FeatureFlagModule and use the service, guard, decorators, cache contracts, and admin APIs. Read the maintained version boundary before choosing targeting or tenant-context behavior.
- [`@nestarc/feature-flag/openfeature`](openfeature.md) — Create the Boolean evaluation provider with createOpenFeatureBooleanProvider. This subpath documents its evaluation context and resolution details; it is not a reference for other OpenFeature value types.
- [`@nestarc/feature-flag/testing`](testing.md) — Configure TestFeatureFlagModule and its controller with flag defaults and overrides for deterministic application tests.
