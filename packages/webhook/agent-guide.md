---
description: "Version-scoped @nestarc/webhook integration for AI agents: install, register endpoints, publish tenant events, verify receivers, and respect released behavior."
---

# Agent Usage Guide

This consumer guide describes published **@nestarc/webhook 0.13.2**, NestJS 10/11, and the default PostgreSQL repositories with Prisma 5/6/7. The [generated API](/api/webhook/) and [release source](https://github.com/nestarc/webhook/tree/v0.13.2) describe the same version. Check the installed version and its declarations before generating code.

```bash
node --version
npm ls @nestarc/webhook @nestjs/common @nestjs/core @nestjs/schedule @prisma/client prisma
```

The HTML guides and [llms.txt](/llms.txt) help clients discover documentation. They do not guarantee retrieval or correct agent behavior.

## Integration sequence

1. Follow [Installation](./installation): exact dependencies, Prisma generation, shipped SQL, and `WebhookModule.forRootAsync()`. Prisma 7 needs an explicit client output and `@prisma/adapter-pg`; align the generated module format with the Nest application.
2. Apply missing migrations in version order, including the 0.12 indexes. Use migration credentials for schema changes and application credentials for runtime work.
3. Register an HTTPS receiver with matching subscriptions and the intended tenant. Securely provision its returned secret before publishing. Package services do not authenticate users or authorize their tenant/endpoint access.
4. Define a `WebhookEvent` subclass with static `eventType` and JSON-serializable properties. Call `sendToTenant()` for tenant business events. The returned ID confirms event persistence; it does not confirm delivery.
5. Verify incoming HMAC against the unmodified raw body, check timestamp freshness, and deduplicate `webhook-id` persistently in the receiver's scope. Commit the deduplication record with business side effects; retries and replay can repeat the same event ID.
6. Inspect `WebhookDeliveryAdminService.getDeliveryLogs()` and `getDeliveryAttempts()` and the receiver's result. Use [Operations](./operations) for worker separation, capacity, shutdown, and scheduled retention.

The [runnable release example](https://github.com/nestarc/webhook/tree/v0.13.2/examples/quick-start) installs 0.13.2 and checks a local sender/receiver flow in an isolated PostgreSQL schema. It verifies raw-body signatures, tampered-body rejection, receiver deduplication, and persisted delivery/attempt results. Its in-memory deduplication and private-URL override are for the local example; production receivers need durable deduplication and HTTPS.

## Contracts to preserve

| API or behavior | Contract |
| --- | --- |
| `send(event, options?)` | Matches active endpoints across all tenants. No matches still saves an event without deliveries. |
| `sendToTenant(tenantId, event, options?)` | Matches one tenant's active subscribed endpoints. Authorize the tenant in the host application. |
| `sendToEndpoints(ids, event, tenantIdOrOptions?, options?)` | The default Prisma adapter filters the selected IDs by active status, exact event or literal `*`, and the supplied tenant when present. |
| Subscriptions | Exact event names and standalone `*` work; `order.*` is not a prefix pattern. |
| Idempotency key | Uniqueness is tenant + event type + key. A duplicate returns the old ID without changing its payload/metadata or enqueueing deliveries. |
| Correlation ID | All publish methods persist it independently of idempotency keys with the default event repository. It is stored metadata, not a deduplication key. |
| Delivery | Database claims are coordinated by `SKIP LOCKED`; HTTP can repeat and retries may exhaust. Successful receipt is not guaranteed. |
| `delivery.maxRetries` | Total attempts, including the initial request. Default 5 means up to 4 automatic retries. |
| Endpoint update/deactivation | Existing queued URL/key snapshots stay unchanged and deactivation does not cancel pending work. |
| Secret rotation | Previous-key expiry is evaluated when a delivery is created. Snapshots made during overlap can keep both keys after expiry. |
| `verifyWithTolerance()` | Checks HMAC and timestamp age; it does not deduplicate a repeated request inside the accepted window. |
| Retry versus replay | Retry preserves a failed delivery's identity/snapshots/history; replay creates new rows from current matching endpoints but retains the original event ID. |
| Logs | Recorded outcomes can omit crash-interrupted HTTP results. Default response capture is limited to 4096 UTF-16 code units before further redaction/retention. |
| Operator reason | Default retry/replay repositories accept `reason` but do not store it. Audit the operator action in the host application. |

Public exports come from `@nestarc/webhook`; SQL is shipped under `@nestarc/webhook/src/sql`. Use public interfaces for [custom adapters](./custom-adapters). Forward validated addresses to custom HTTP transports, preserve response status for retry classification, and implement optional repository operations before exposing their APIs.

## Version 0.13.2 contracts

- `correlationId` is persisted without an `idempotencyKey` for `send()`, `sendToTenant()`, and `sendToEndpoints()`. Duplicate idempotency keys still preserve the original event's payload and metadata.
- `replayEvent()` uses the module's configured `delivery.maxRetries` total attempt budget. Its public service signature stays `(eventId, options?)`; custom repositories receive the budget as an optional third parameter.
- Manual retry returns `false` for purged event payloads, and bulk retry skips them. Replay rejects missing or purged payloads. The default Prisma repository locks event rows while retrying, replaying, or purging so concurrent cleanup cannot erase a newly queued payload.

These fixes require the installed 0.13.2 release. For custom repositories, update optional correlation metadata, replay budget handling, and retention coordination explicitly; source compatibility alone does not implement those behaviors. See [Custom Adapters](./custom-adapters) and the [release changelog](https://github.com/nestarc/webhook/blob/v0.13.2/CHANGELOG.md).

## Verify the integration

Compile the consuming application and exercise one real PostgreSQL-backed publish through a local receiver, with an endpoint registered first. Verify a 2xx result, raw-body HMAC validation, one receiver business effect after repeated delivery, and a recorded delivery attempt. Also test two tenants, a missing subscription, a duplicate publish key, a retryable 5xx response, a permanent 4xx response, and the configured retention policy when used.

Keep test-only private URL access confined to the local receiver. Record which checks actually ran and whether the package was installed from npm or a source tarball. Static type checks alone do not verify database migrations, worker scheduling, or receiver behavior.
