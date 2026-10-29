---
title: "NestJS Transactional Inbox with Prisma and PostgreSQL"
description: "Deduplicate incoming webhooks and broker messages with @nestarc/inbox. Commit Prisma business writes and inbox completion together, with retries and scoped recovery."
---

<script setup>
import PackageVersion from '../../.vitepress/theme/components/PackageVersion.vue'
</script>

# NestJS Transactional Inbox

`@nestarc/inbox` durably receives incoming events in PostgreSQL and processes them with NestJS and Prisma. A stable message identity deduplicates redeliveries; business writes and processing completion commit in the same database transaction.

Use it when webhook retries, broker redeliveries, or worker crashes could repeat a database change. Inbox uses your application's existing Prisma client and PostgreSQL database; the core requires no additional broker or cache service.

::: tip Documented release
Documented package version: <PackageVersion slug="inbox" />

These guides cover **0.2.0**, released on **28 October 2026**, with **SQL schema v2**. Version 0.2.0 adds application-testing helpers and operational recovery checks. Existing 0.1.0 installations need no SQL migration. The package remains pre-1.0: APIs and schema can change. Check the [versioned source](https://github.com/nestarc/inbox/tree/v0.2.0) and [release changelog](https://github.com/nestarc/inbox/blob/v0.2.0/CHANGELOG.md) when upgrading.
:::

Start with [installation and a working handler](./installation), then connect your transport using the [acceptance and transaction guide](./processing). Use [operations and recovery](./operations) for retries, DEAD messages, explicit replay, tenant context, and retention. The [testing guide](./testing) shows how to exercise real handlers and wait for receipt completion with the new `@nestarc/inbox/testing` helpers.

For a walkthrough from duplicate-delivery problems to your first tested consumer, read [NestJS Webhook Idempotency with a Transactional Inbox](/blog/nestjs-inbox-duplicate-webhooks).

## What the inbox guarantees

```text
Authenticated incoming event
  → accept(): commit a durable receipt
  → application acknowledges the transport
  → worker claims the receipt
  → transaction: business writes + inbox completion
  → COMPLETED, or rollback followed by retry / DEAD
```

The identity is **scope + source + consumer + message ID**. Repeating that identity with the same content returns a duplicate receipt; changing the content raises `InboxConflictError`. PostgreSQL leases and claim tokens prevent an old worker from committing after losing ownership.

**Acceptance means stored, not processed.** Handler invocations can repeat after failures. Deduplication covers successfully committed writes through `context.tx` while the receipt is retained. External HTTP calls, email, another database, and different message IDs for the same business action need separate idempotency or business constraints. Message ordering is not guaranteed.

## Choose the boundary you need

| Need | Package and boundary |
| --- | --- |
| Receive an event and apply database changes once per retained identity | **Inbox** persists the receipt and commits the handler's database effects with completion. |
| Publish an event with a business database write | [Outbox](/packages/outbox/) persists outgoing events in the caller's transaction, then delivers them at least once. Preserve the event ID when feeding an inbox. |
| Replay a response to repeated HTTP requests | [Idempotency](/packages/idempotency/) coordinates request ownership and response replay. Its response-cache lifetime is separate from inbox receipt retention. |
| Run typed background jobs with local or BullMQ workers | [Jobs](/packages/jobs/) handles job execution; an inbox is useful when incoming delivery identity must be tied to committed database effects. |
| Send signed events to customer endpoints | [Webhook](/packages/webhook/) handles outbound delivery. An incoming receiver authenticates its sender before accepting an inbox message. |

An inbox handler can write a follow-up [outbox event](./processing#combine-inbox-and-outbox) through the same transaction. The later external delivery still needs a consumer deduplication contract.

## Compatibility

| Component | Published contract and recorded validation |
| --- | --- |
| Node.js | Engine `>=22.12.0`; the full validation and optional tenancy examples use 22.23.4+ on Node 22 or 24.22.1+ on Node 24. |
| NestJS | `@nestjs/common` and `@nestjs/core` `^11.2.8`; tested at 11.2.8. |
| Prisma | `@prisma/client` `^7.10.1`; tested at 7.10.1 with its PostgreSQL driver adapter. |
| PostgreSQL | Database and crash-recovery checks exercised 16 and 18. |
| Other peers | `reflect-metadata ^0.2.2`, `rxjs ^7.8.2`. |
| Optional tenancy | `@nestarc/tenancy ^0.16.2`; core Inbox works without it. |

Inbox does not claim the broader Prisma or NestJS compatibility ranges of other Nestarc packages. See the [release package metadata](https://github.com/nestarc/inbox/blob/v0.2.0/package.json).

## Evaluate the release

The upstream release includes [eight runnable integrations](https://github.com/nestarc/inbox/blob/v0.2.0/examples/README.md): outbox, signed webhooks, RabbitMQ, Kafka, SQS-compatible, BullMQ, tenancy, and HTTP idempotency. The Kafka fixture uses Redpanda and the SQS fixture uses ElasticMQ; validate your production transport separately.

The [validation record](https://github.com/nestarc/inbox/blob/v0.2.0/docs/validation.md) covers concurrent redelivery, transaction rollback, process termination, stale claims, replay races, and installed-package checks. Version 0.2.0 adds real TCP disconnect and blackhole tests, pool pressure, SIGTERM drain, PostgreSQL standby promotion, bounded tablespace exhaustion, and RabbitMQ restart/retry/DLQ checks. Read [the operational scope](./operations#operational-validation) before applying these results to a deployment.

Two [disk-backed concurrent-ingress measurements](https://github.com/nestarc/inbox/blob/v0.2.0/docs/benchmarks/2026-10-28-sustained-local.md) each accepted 19,199 receipts during 120 seconds of ingress, then recovered the backlog in about 94–95 seconds. Every receipt completed with one committed business effect, including intentional rollback/retry cases. These are several-minute local Docker VM samples with a specific handler, pool, and offered load; they do not establish maximum throughput, tenant fairness, or a production SLA. Real-service adoption was outside this release's validation.

- [Install Inbox and apply schema v2](./installation)
- [Understand deduplication and acknowledgment](./processing)
- [Operate retries, replay, and retention](./operations)
- [Test handlers and wait for completion](./testing)
- [API reference](/api/inbox/)
- [npm package](https://www.npmjs.com/package/@nestarc/inbox)
