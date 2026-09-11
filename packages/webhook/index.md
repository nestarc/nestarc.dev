---
description: "Outbound webhook delivery for NestJS — HMAC signing, exponential retry, circuit breaker, delivery logs, fan-out, Standard Webhooks compatible."
---

<script setup>
import PackageVersion from '../../.vitepress/theme/components/PackageVersion.vue'
</script>

# @nestarc/webhook

Outbound webhook delivery module for NestJS — send events to customer endpoints with HMAC signing, exponential retry, circuit breaker, and delivery and attempt history. Uses your existing PostgreSQL database — no separate infrastructure required.

[Documentation](./installation) · [Agent Usage Guide](./agent-guide) · [API Reference](/api/webhook/) · [한국어](/ko/packages/webhook/) · [npm](https://www.npmjs.com/package/@nestarc/webhook) · [Changelog](https://github.com/nestarc/webhook/blob/main/CHANGELOG.md)

For deployment ownership and production operations, see [Self-hosting `@nestarc/webhook`](/packages/webhook/self-hosting).

::: tip Current release
Current package version: <PackageVersion slug="webhook" />

Version 0.13 adds idempotent producer publishing, bounded bulk retry and event replay, retention and redaction controls, correlation IDs, and timestamp-tolerant signature verification.
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

## Published version and source changes

These pages describe npm **0.13.1**. The source package is now **0.13.2, pending npm publication**. [Agent Usage Guide](./agent-guide#published-0-13-1-limitations) records released limitations and the fixes included in source 0.13.2. Source checkout examples do not establish what an installed npm release supports.

## Version 0.13.1

The default PostgreSQL repositories now support Prisma 7, backed by a strict NestJS 11.2.1/Prisma 7.10.0 packed consumer and an independent Prisma 6.19.3 database lane. Retention queries explicitly cast cutoff dates to `timestamptz`, fixing Prisma 7 adapter purge failures. Public delivery behavior and the 0.13 SQL schema remain unchanged. [Installation](./installation#prisma-7-and-the-0-13-1-patch).
