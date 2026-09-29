# @nestarc/soft-delete

<!-- api-context:start -->
API reference for `@nestarc/soft-delete` **0.7.2**. Prisma soft-delete with relation filters, cascade, bulk restore, purge, events, and optional atomic audit lifecycles.

## Start here

Install the documented release with `npm install @nestarc/soft-delete@0.7.2`. Follow [Installation](/packages/soft-delete/installation) for peer dependencies and application setup, then read [Restore and purge](/packages/soft-delete/restore-purge) for usage decisions and examples.

Choose an import path below to find its exported signatures and types. The root package contains the main application APIs; named subpaths group the additional integrations and utilities. The reference is generated from the published release, with source links pinned to its commit.
<!-- api-context:end -->

## Modules

- [`@nestarc/soft-delete`](index.md) — Create the Prisma soft-delete extension and register SoftDeleteModule. Includes query-scope decorators, cascade and relation-filter options, service methods, and deletion lifecycle events.
- [`@nestarc/soft-delete/testing`](testing.md) — Use TestSoftDeleteModule and assertions for deleted, restored, and cascade-deleted records when testing the application deletion lifecycle.
