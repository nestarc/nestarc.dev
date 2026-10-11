# @nestarc/data-subject

<!-- api-context:start -->
API reference for `@nestarc/data-subject` **0.3.0**. Tenant-scoped export and verified erasure with shared policies, signed previews, durable recovery, and paged jobs.

## Start here

Install the documented release with `npm install @nestarc/data-subject@0.3.0`. Follow [Installation](/packages/data-subject/installation) for peer dependencies and application setup, then read [Upgrade to 0.3](/packages/data-subject/migration) for usage decisions and examples.

Choose an import path below to find its exported signatures and types. The root package contains the main application APIs; named subpaths group the additional integrations and utilities. The reference is generated from the published release, with source links pinned to its commit.
<!-- api-context:end -->

## Modules

- [`@nestarc/data-subject`](index.md) — Register DataSubjectModule with shared policy definitions, then use DataSubjectService for tenant-scoped export, signed previews, and verified erasure. Includes durable execution and recovery, paged jobs, the Transcend adapter, storage contracts, lifecycle events, and error types.
- [`@nestarc/data-subject/lint`](lint.md) — Inspect Prisma schemas with parsePrismaSchema and lintPrismaSchema, format findings, and decide whether policy lint should fail a check. Use these helpers when validating entity-policy coverage.
