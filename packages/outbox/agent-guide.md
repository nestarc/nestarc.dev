---
description: "Version-scoped @nestarc/outbox 0.4.0 usage for AI agents: SQL prerequisites, required polling, precise admin cursors, provider validation, and runnable consumer fixtures."
---

# Agent usage guide

This guide covers published **@nestarc/outbox 0.4.0**. Start with `npm ls @nestarc/outbox @nestjs/core @nestjs/schedule @prisma/client` in the consuming application. Repository main can contain fixes that are not in the installed package; compare against the [0.4.0 README](https://github.com/nestarc/outbox/blob/v0.4.0/README.md), [usage reference](https://github.com/nestarc/outbox/blob/v0.4.0/docs/usage.md), and [tagged source](https://github.com/nestarc/outbox/tree/v0.4.0).

## Build a working integration

1. Use PostgreSQL and the supported Node/Nest/Prisma combination from [installation](./installation). PostgreSQL 16 is the automated baseline; an older minimum has not been verified. Prisma 7's PostgreSQL adapter needs `pg` even when notifications are disabled.
2. Apply the package's complete fresh-install SQL before starting a new app. A current 0.3.0 schema needs no additional SQL for 0.4.0. For a 0.1/0.2 upgrade, stop all old pollers and apply `upgrade-to-current.sql`; never overlap 0.2 workers with 0.3/0.4 workers.
3. Register an injectable Prisma provider. Use `forRootAsync()` with exporting dependency modules when the transport or tenant provider has injected dependencies. Put `transport` and `tenantProvider` at the top level of the async registration.
4. Write business data and call `OutboxEmitter.emit(tx, event, options)` inside the same Prisma transaction. A call using an independent client does not provide the same atomicity.
5. Register local decorated handlers as Nest providers, or select `delivery.mode: 'publisher'` with an `OutboxPublisher`. Preserve the event ID, payload, and metadata through the broker; consumers must deduplicate side effects.
6. Keep periodic polling enabled; 0.4.0 rejects `polling.enabled: false`. Enable `app.enableShutdownHooks()` for signal-driven cleanup; the poller waits up to 30 seconds and does not forcibly cancel callbacks.
7. Verify a committed event reaches `SENT`, a rolled-back transaction leaves neither business data nor an event, and a failed callback retries before reaching `FAILED`. `SENT` acknowledges local handlers or the publisher, not downstream completion.

Import runtime values and types from `@nestarc/outbox`. The supported SQL exports are `@nestarc/outbox/src/sql/create-outbox-table.sql` and `@nestarc/outbox/src/sql/upgrade-to-current.sql`; do not import internal `dist/**` paths. For full signatures, use the installed `.d.ts` files and [published API reference](/api/outbox/).

## 0.4.0 migration and operating boundaries

| Area | Consumer guidance |
| --- | --- |
| Required polling | `polling.enabled: false` fails module initialization with `OutboxConfigurationError` / `OUTBOX_INVALID_CONFIGURATION`, even with working LISTEN/NOTIFY. Notifications reduce latency; polling discovers backlog, due retries, and expired claims. |
| Admin cursor pagination | `listPage()` now returns v2 cursors preserving PostgreSQL microseconds. Discard saved v1 cursors and restart from the first page; unsupported cursors raise `OUTBOX_INVALID_CURSOR`. Pass `nextCursor` unchanged and keep filters stable; public `Date` fields cannot reconstruct it. |
| Configuration checks | Setup validates tenant policy/provider shapes, observability callbacks, and notification options. This does not establish external connectivity or guarantee callback behavior. |
| Database schema | Required schema remains 0.3.0. An existing current 0.3.0 schema needs no additional migration; 0.1/0.2 databases still need the unified upgrade. |
| Ordering and uniqueness | Delivery is at-least-once and has no global, aggregate, partition, or batch FIFO guarantee. `partitionKey` controls routing; `idempotencyKey` is metadata and does not create an outbox uniqueness constraint. |
| Tenant administration | Authenticate and authorize the tenant before calling `OutboxTenantAdminService.forTenant()`. `OutboxOperatorService` is privileged and global. |

The 0.3.0 cursor precision and notification-only startup behavior no longer describe the current release. Applications remaining on that version should use the [historical 0.3.0 README](https://github.com/nestarc/outbox/blob/v0.3.0/README.md).

## Reference and verification paths

- [Installation, SQL, shutdown, and complete provider registration](./installation)
- [Local handlers and callback behavior](./handling-events)
- [Broker publishers with preserved event identities](./transports)
- [Delivery lifecycle and guarantees](./how-it-works)
- [Complete quick-start application and run instructions](https://github.com/nestarc/outbox/blob/v0.4.0/examples/quick-start/README.md)
- [Version-pinned consumer fixtures](https://github.com/nestarc/outbox/tree/v0.4.0/test/packed-examples)
- [Fixture runner and database requirements](https://github.com/nestarc/outbox/blob/v0.4.0/test/packed-examples/README.md)
- [Packaged documentation map](https://github.com/nestarc/outbox/blob/v0.4.0/llms.txt)

The quick start ships complete imports, providers, models, and a consumer receipt that commits atomically with a database side effect. It uses a disposable PostgreSQL database and verifies `SENT` plus duplicate replay without sending email or contacting a broker. The packed fixture harness exercises installed-package examples with and without optional `pg`. Follow its database setup instructions; recording broker/email doubles do not verify real acknowledgements or external side-effect deduplication.
