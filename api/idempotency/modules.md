# @nestarc/idempotency

<!-- api-context:start -->
API reference for `@nestarc/idempotency` **1.0.0**. HTTP Idempotency-Key handling with hashed request identities, ownership leases, and response replay across memory, Redis, or PostgreSQL.

## Start here

Install the documented release with `npm install @nestarc/idempotency@1.0.0`. Follow [Installation](/packages/idempotency/installation) for peer dependencies and application setup, then read [Migration to 1.0](/packages/idempotency/migration) for usage decisions and examples.

Choose an import path below to find its exported signatures and types. The root package contains the main application APIs; named subpaths group the additional integrations and utilities. The reference is generated from the published release, with source links pinned to its commit.
<!-- api-context:end -->

## Modules

- [`@nestarc/idempotency`](index.md) — Register IdempotencyModule, apply the interceptor and route decorators, configure endpoint identity and replay policy, and use dependency-free memory storage and public contracts.
- [`@nestarc/idempotency/postgres`](postgres.md) — Use PostgresStorage with an application-owned pg Pool. Install pg separately and apply the package SQL before accepting traffic.
- [`@nestarc/idempotency/redis`](redis.md) — Use RedisStorage with an application-owned ioredis client. Install ioredis separately and select a new key prefix when migrating from 0.x.
