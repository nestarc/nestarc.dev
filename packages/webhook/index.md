---
description: "Outbound webhook delivery for NestJS — HMAC signing, exponential retry, circuit breaker, delivery logs, fan-out, Standard Webhooks compatible."
---

<script setup>
import PackageVersion from '../../.vitepress/theme/components/PackageVersion.vue'
</script>

# @nestarc/webhook

Outbound webhook delivery module for NestJS — send events to customer endpoints with HMAC signing, exponential retry, circuit breaker, and delivery and attempt history. Uses your existing PostgreSQL database — no separate infrastructure required.

[Documentation](./installation) · [Agent Usage Guide](./agent-guide) · [API Reference](/api/webhook/) · [한국어](/ko/packages/webhook/) · [npm](https://www.npmjs.com/package/@nestarc/webhook) · [Changelog](https://github.com/nestarc/webhook/blob/v0.13.2/CHANGELOG.md)

For deployment ownership and production operations, see [Self-hosting `@nestarc/webhook`](/packages/webhook/self-hosting).

Building the receiving endpoint? [@nestarc/inbox](/packages/inbox/) handles durable incoming event deduplication for NestJS, Prisma, and PostgreSQL. Verify the webhook signature and tenant mapping before acceptance, preserve `webhook-id`, and return success only after the receipt is stored. Business processing then uses a separate worker transaction; see [Inbox processing](/packages/inbox/processing).

::: tip Current release
Current package version: <PackageVersion slug="webhook" />

Version 0.13.2 persists correlation IDs independently of idempotency keys, applies the configured attempt budget to replay, and coordinates retry/replay with payload retention.
:::

## Features

- **Fan-out delivery** — one event published to all matching endpoints in a single call
- **Idempotent publish** — deduplicate producer retries with application-defined keys
- **HMAC-SHA256 signing** — [Standard Webhooks](https://www.standardwebhooks.com/) compatible headers (`webhook-id`, `webhook-timestamp`, `webhook-signature`)
- **Secret rotation overlap** — capture current and eligible previous secrets when each delivery is created
- **Exponential backoff** — 30s, 5m, 30m, 2h, 24h retry schedule with ±10% jitter
- **Circuit breaker** — emit degraded notifications, auto-disable failing endpoints, and recover after cooldown
- **Dead letter operations** — retry one delivery, retry a bounded failed set, or replay an event to active endpoints
- **Delivery logs** — delivery history plus per-attempt status, latency, response bodies, and errors
- **Retention and redaction** — minimize payloads before dispatch and purge stored payload or response data on your schedule
- **Multi-instance safe** — `FOR UPDATE SKIP LOCKED` coordinates work claims across replicas; receivers must handle duplicate HTTP requests
- **Worker capacity controls** — separate claim batch size from concurrency and drain backlogs within one poll cycle
- **Worker observability** — poll, delivery, retry, degradation, failure, and disablement callbacks
- **Graceful shutdown** — waits for active polling and in-flight deliveries before exit
- **SSRF defense** — DNS resolution validation at registration and dispatch time, IPv6 bypass blocking
- **Ports/adapters architecture** — replace persistence, HTTP, and secret storage through public interfaces
- **Multi-tenant ready** — `tenant_id` column for `@nestarc/tenancy` integration
- **Stale delivery recovery** — lease-based reaper recovers deliveries from crashed workers

## Start here

- [Installation](./installation) — schema migrations and module configuration.
- [Sending Events](./sending-events) — idempotent fan-out, tenant, and targeted publishing.
- [Endpoint Management](./endpoint-management) — endpoint lifecycle and secret rotation.
- [Delivery Logs](./delivery-logs) — attempts, manual retry, bulk retry, and replay.
- [Operations & Data Lifecycle](./operations) — capacity, observers, retention, and redaction.
- [Security](./security) — SSRF defenses and signature verification, timestamp freshness, and receiver deduplication.
- [API Reference](/api/webhook/) — generated TypeScript API documentation.

## Requirements

- NestJS 10 or 11
- Node.js >= 20, subject to the stricter requirements of your NestJS and Prisma versions
- Prisma 5, 6, or 7
- PostgreSQL 9.5+ syntax is used; select a supported PostgreSQL release for production. PostgreSQL < 13 needs `pgcrypto` for `gen_random_uuid()`.
- `@nestjs/schedule` (peer dependency)

## Version 0.13.2

These pages describe published **@nestarc/webhook 0.13.2**. The [release source](https://github.com/nestarc/webhook/tree/v0.13.2) and [runnable NestJS/Prisma 7 example](https://github.com/nestarc/webhook/tree/v0.13.2/examples/quick-start) are pinned to that version.

- All publish methods persist `correlationId` without requiring `idempotencyKey`.
- Event replay uses `delivery.maxRetries` as its total attempt budget, including the initial request.
- Manual and bulk retry refuse purged event payloads; the default repository serializes retry, replay, and payload retention on event rows.
- Custom HTTP clients can import the public `WebhookHttpClientRequestOptions` type; custom repositories receive optional correlation metadata and replay attempt budgets.

Prisma 5/6/7 support and the Prisma 7 retention SQL fix from 0.13.1 are retained. No additional SQL migration is required for an already migrated 0.13.0/0.13.1 database. See [upgrade steps](./installation#upgrade-to-0-13-2) and [version-specific contracts](./agent-guide#version-0-13-2-contracts).
