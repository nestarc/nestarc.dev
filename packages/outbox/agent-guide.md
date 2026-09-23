---
description: "Version-scoped @nestarc/outbox 0.3.0 usage for AI agents: SQL prerequisites, NestJS providers, delivery guarantees, published limitations, and runnable consumer fixtures."
---

# Agent usage guide

This guide covers published **@nestarc/outbox 0.3.0**. Start with `npm ls @nestarc/outbox @nestjs/core @nestjs/schedule @prisma/client` in the consuming application. Repository main can contain fixes that are not in the installed package; compare against the [0.3.0 README](https://github.com/nestarc/outbox/blob/v0.3.0/README.md) and [tagged source](https://github.com/nestarc/outbox/tree/v0.3.0).

## Build a working integration

1. Use PostgreSQL and the supported Node/Nest/Prisma combination from [installation](./installation). Prisma 7's PostgreSQL adapter needs `pg` even when notifications are disabled.
2. Apply the package's complete fresh-install SQL before starting the app. For an upgrade, stop all old pollers and apply `upgrade-to-current.sql`; never overlap 0.2 and 0.3 workers.
3. Register an injectable Prisma provider. Use `forRootAsync()` with exporting dependency modules when the transport or tenant provider has injected dependencies. Put `transport` and `tenantProvider` at the top level of the async registration.
4. Write business data and call `OutboxEmitter.emit(tx, event, options)` inside the same Prisma transaction. A call using an independent client does not provide the same atomicity.
5. Register local decorated handlers as Nest providers, or select `delivery.mode: 'publisher'` with an `OutboxPublisher`. Preserve the event ID, payload, and metadata through the broker; consumers must deduplicate side effects.
6. Keep periodic polling enabled. Enable `app.enableShutdownHooks()` for signal-driven cleanup; the poller waits up to 30 seconds and does not forcibly cancel callbacks.
7. Verify a committed event reaches `SENT`, a rolled-back transaction leaves neither business data nor an event, and a failed callback retries before reaching `FAILED`. `SENT` acknowledges local handlers or the publisher, not downstream completion.

Import runtime values and types from `@nestarc/outbox`. The supported SQL exports are `@nestarc/outbox/src/sql/create-outbox-table.sql` and `@nestarc/outbox/src/sql/upgrade-to-current.sql`; do not import internal `dist/**` paths. For full signatures, use the installed `.d.ts` files and [published API reference](/api/outbox/).

## Published 0.3.0 limitations

| Area | Consumer guidance |
| --- | --- |
| Wakeups without polling | Startup can succeed if the notification client connects, but notifications do not schedule future retries, exhaust backlog, or replay missed messages. Keep `polling.enabled: true`. |
| Admin cursor pagination | `listPage()` loses PostgreSQL sub-millisecond timestamp precision and can skip rows at a page boundary. Do not use it for exhaustive exports; preserve the full database timestamp and ID in an application-owned query. |
| Configuration checks | Validation is not exhaustive at startup. An invalid `tenancy.policy` can reach emit-time `OUTBOX_INVALID_ENVELOPE`; use typed options and documented values. |
| Ordering and uniqueness | Delivery is at-least-once and has no global, aggregate, partition, or batch FIFO guarantee. `partitionKey` controls routing; `idempotencyKey` is metadata and does not create an outbox uniqueness constraint. |
| Tenant administration | Authenticate and authorize the tenant before calling `OutboxTenantAdminService.forTenant()`. `OutboxOperatorService` is privileged and global. |

These are limitations of the published release. Do not assume fixes in repository main exist in an installed 0.3.0 package.

## Reference and verification paths

- [Installation, SQL, shutdown, and complete provider registration](./installation)
- [Local handlers and callback behavior](./handling-events)
- [Broker publishers with preserved event identities](./transports)
- [Delivery lifecycle and guarantees](./how-it-works)
- [Version-pinned consumer fixtures](https://github.com/nestarc/outbox/tree/v0.3.0/test/packed-examples)
- [Fixture runner and database requirements](https://github.com/nestarc/outbox/blob/v0.3.0/test/packed-examples/README.md)

The tagged fixtures demonstrate the published README and include a notification-only scenario that proves immediate notification delivery, not durable recovery without polling. The fixture harness creates and drops tables in its documented disposable database; follow its setup before running it. Its broker is a recording double, so verify real broker acknowledgements and consumer deduplication in your application as well.
