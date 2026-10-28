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

These guides cover **0.1.0**, released on **28 October 2026**, with **SQL schema v2**. This is the first public release and remains pre-1.0: APIs and schema can change. Check the [versioned source](https://github.com/nestarc/inbox/tree/v0.1.0) and [release changelog](https://github.com/nestarc/inbox/blob/v0.1.0/CHANGELOG.md) when upgrading.
:::

Start with [installation and a working handler](./installation), then connect your transport using the [acceptance and transaction guide](./processing). Use [operations and recovery](./operations) for retries, DEAD messages, explicit replay, tenant context, and retention.

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

Inbox does not claim the broader Prisma or NestJS compatibility ranges of other Nestarc packages. See the [release package metadata](https://github.com/nestarc/inbox/blob/v0.1.0/package.json).

## Evaluate the release

The upstream release includes [eight runnable integrations](https://github.com/nestarc/inbox/blob/v0.1.0/examples/README.md): outbox, signed webhooks, RabbitMQ, Kafka, SQS-compatible, BullMQ, tenancy, and HTTP idempotency. The Kafka fixture uses Redpanda and the SQS fixture uses ElasticMQ; validate your production transport separately.

The [validation record](https://github.com/nestarc/inbox/blob/v0.1.0/docs/validation.md) covers concurrent redelivery, transaction rollback, process termination, stale claims, replay races, and installed-package checks. The 0.1.0 release promotes the Preview.1 runtime and schema. Preview.1 [local benchmarks](https://github.com/nestarc/inbox/blob/v0.1.0/docs/benchmarks/2026-10-28-preview1-local.md) measure receipt acceptance separately from worker draining; they are not sustained handler throughput or a production SLA. Database failover, network partitions, and pool saturation need deployment-specific exercises.

- [Install Inbox and apply schema v2](./installation)
- [Understand deduplication and acknowledgment](./processing)
- [Operate retries, replay, and retention](./operations)
- [API reference](/api/inbox/)
- [npm package](https://www.npmjs.com/package/@nestarc/inbox)
