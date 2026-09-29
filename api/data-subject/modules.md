# @nestarc/data-subject

<!-- api-context:start -->
API reference for `@nestarc/data-subject` **0.2.0**. GDPR/CCPA export and erase workflows with entity policies, retention, and outbox fan-out.

## Start here

Install the documented release with `npm install @nestarc/data-subject@0.2.0`. Follow [Installation](/packages/data-subject/installation) for peer dependencies and application setup, then read [Policy model](/packages/data-subject/policy-model) for usage decisions and examples.

Choose an import path below to find its exported signatures and types. The root package contains the main application APIs; named subpaths group the additional integrations and utilities. The reference is generated from the published release, with source links pinned to its commit.
<!-- api-context:end -->

## Modules

- [`@nestarc/data-subject`](index.md) — Register DataSubjectModule, define entity policies and executors, and call DataSubjectService for export or erasure requests. Includes storage contracts, Prisma adapters, lifecycle events, and error types.
- [`@nestarc/data-subject/lint`](lint.md) — Inspect Prisma schemas with parsePrismaSchema and lintPrismaSchema, format findings, and decide whether policy lint should fail a check. Use these helpers when validating entity-policy coverage.
