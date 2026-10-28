---
description: "NestJS HTTP idempotency 1.0: authenticated request scoping, strict key validation, JSON response replay, Redis/Postgres storage, and migration from 0.4."
---

# @nestarc/idempotency

`@nestarc/idempotency` **1.0.0** protects NestJS HTTP write endpoints against duplicate handling when clients retry. It supports Express and Fastify: a matching completed request replays its response, an in-flight duplicate receives `409`, and reuse with a different fingerprint receives `422`.

The package coordinates the HTTP boundary. It does not make a database transaction or external payment exactly-once, and it does not intercept message-broker consumers or background jobs. Pair it with durable business command IDs and authorization on every request, including replay.

::: warning Upgrading from 0.4
1.0 changes adapter imports, runtime support, storage addresses, response encoding, and observability. Deployment requires a **separate empty storage namespace**, durable deduplication covering previous commands, and a coordinated replacement of all writers. Follow [Migration to 1.0](/packages/idempotency/migration); changing only the dependency version can execute an old command again.
:::

## What changed in 1.0

| Area | Released contract |
| --- | --- |
| Runtime | Node.js **22 or 24**, NestJS **10 or 11**; TypeScript **5.7.3** is the validated consumer baseline. |
| Imports | Memory/common APIs stay at the root; Redis uses `/redis`, Postgres and the sweep service use `/postgres`. |
| Request isolation | Every mode uses a versioned SHA-256 storage address. Custom scopes add authenticated identity to the method and actual path. |
| Key input | One raw opaque header string, strict duplicate/invalid-value rejection, and a default limit of **255 UTF-8 bytes**. |
| Response replay | Capture the final supported plain JSON value after response transformers; store a versioned opaque payload, including empty responses. |
| Leases | Complete only an unexpired `PROCESSING` record once. Unsupported responses retain the lease; expiry never proves business work stopped. |
| Observability | Hashed `namespace` replaces `event.scope`; errors expose fixed `code`/`operation` classifications. |

See the [1.0.0 release changelog](https://github.com/nestarc/idempotency/blob/v1.0.0/CHANGELOG.md) for the full release, dated October 7, 2026.

## Use cases

| Workflow | Application responsibility alongside HTTP replay |
| --- | --- |
| Payments and refunds | Durable command ID, provider deduplication, and reconciliation after uncertain results. |
| Order creation | Unique business command row and the order change in one transaction. |
| Inbound webhooks | Signature verification in a guard, durable event inbox, and separate business deduplication. |
| Imports and commands | Stable command identity retained through the real redelivery window. |

Use [@nestarc/inbox](/packages/inbox/) for the durable event inbox in a NestJS + Prisma + PostgreSQL receiver. It retains event identity independently of this package's HTTP response cache and commits business writes with processing completion. Authenticate the sender first, preserve its event ID, and review the [Inbox processing contract](/packages/inbox/processing); receipt deletion or a new event ID changes the deduplication boundary.

## Features

- **Handler opt-in:** register `IdempotencyInterceptor` and decorate selected routes with `@Idempotent()`.
- **Response replay:** return the captured status, supported JSON body, and allowed headers without running the handler again.
- **Stable body fingerprint:** recursively sort object keys before SHA-256 hashing; retain array order.
- **Shared adapters:** Redis and Postgres coordinate replicas with atomic acquisition and token-based compare-and-set.
- **Identity-aware scoping:** add verified tenant/user components to endpoint identity without ambiguous string separators.
- **Processing leases:** configure `processingTtl` independently of completed-response `ttl`.
- **Custom resolvers:** derive keys and semantic fingerprints from validated request data.
- **Outcome diagnostics:** optional events and current-request status headers, with no raw keys or original error objects in package events.

The HTTP profile follows selected draft-07 behavior; it does **not** implement every IETF draft requirement. In particular, headers are raw opaque strings, not parsed Structured Field Strings. See the [HTTP contract](/packages/idempotency/how-it-works#http-contract).

## Start here

1. Check [runtime support and public imports](/packages/idempotency/installation).
2. Run the MemoryStorage quickstart locally; use shared Redis or Postgres in a multi-instance deployment.
3. Authenticate and authorize in guards before idempotency, and put idempotency before response transformers.
4. Choose a lease that covers the intended processing window and a replay TTL matching the client retry window.
5. Keep durable business deduplication beyond cache expiry, restarts, and upgrades.

[Installation](/packages/idempotency/installation) · [How It Works](/packages/idempotency/how-it-works) · [Storage Adapters](/packages/idempotency/storage) · [Migration to 1.0](/packages/idempotency/migration) · [Benchmark](/packages/idempotency/benchmark)

Applications remaining on 0.4 can use the [version-pinned 0.4.0 documentation](https://github.com/nestarc/idempotency/blob/v0.4.0/README.md).
