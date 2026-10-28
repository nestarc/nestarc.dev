# @nestarc/inbox

<!-- api-context:start -->
API reference for `@nestarc/inbox` **0.2.0**. Transactional inbox for NestJS, Prisma, and PostgreSQL with durable event deduplication, atomic database effects, retries, and replay.

## Start here

Install the documented release with `npm install @nestarc/inbox@0.2.0`. Follow [Installation](/packages/inbox/installation) for peer dependencies and application setup, then read [Testing application handlers](/packages/inbox/testing) for usage decisions and examples.

Choose an import path below to find its exported signatures and types. The root package contains the main application APIs; named subpaths group the additional integrations and utilities. The reference is generated from the published release, with source links pinned to its commit.
<!-- api-context:end -->

## Modules

- [`@nestarc/inbox`](index.md) — Register InboxModule with an application-owned Prisma client, accept durable receipts, and process business writes through the handler transaction. Includes scoped administration, retries, replay, optional tenancy context, and runtime contracts.
- [`@nestarc/inbox/testing`](testing.md) — Use drainInbox and waitForInboxRecord with a real PostgreSQL test database, bounded waits, and typed diagnostics. Receipt IDs select assertions, not worker claims; assert business effects separately.
