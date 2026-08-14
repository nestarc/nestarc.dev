---
description: "Outbound webhook delivery for NestJS — HMAC signing, exponential retry, circuit breaker, delivery logs, fan-out, Standard Webhooks compatible."
---

<script setup>
import PackageVersion from '../../.vitepress/theme/components/PackageVersion.vue'
</script>

# @nestarc/webhook

Outbound webhook delivery module for NestJS — send events to customer endpoints with HMAC signing, exponential retry, circuit breaker, and full delivery audit trail. Uses your existing PostgreSQL database — no separate infrastructure required.

For deployment ownership and production operations, see [Self-hosting `@nestarc/webhook`](/packages/webhook/self-hosting).

::: tip Current release
Current package version: <PackageVersion slug="webhook" />

Version 0.13 adds idempotent producer publishing, bounded bulk retry and event replay, retention and redaction controls, correlation IDs, and timestamp-tolerant signature verification.
:::

## Features

- **Fan-out delivery** — one event published to all matching endpoints in a single call
- **Idempotent publish** — deduplicate producer retries with application-defined keys
- **HMAC-SHA256 signing** — [Standard Webhooks](https://www.standardwebhooks.com/) compatible headers (`webhook-id`, `webhook-timestamp`, `webhook-signature`)
- **Secret rotation overlap** — sign queued deliveries with current and previous secrets during a controlled transition
- **Exponential backoff** — 30s, 5m, 30m, 2h, 24h retry schedule with ±10% jitter
- **Circuit breaker** — emit degraded notifications, auto-disable failing endpoints, and recover after cooldown
- **Dead letter operations** — retry one delivery, retry a bounded failed set, or replay an event to active endpoints
- **Delivery logs** — delivery history plus per-attempt status, latency, response bodies, and errors
- **Retention and redaction** — minimize payloads before dispatch and purge stored payload or response data on your schedule
- **Multi-instance safe** — `FOR UPDATE SKIP LOCKED` prevents duplicate delivery across replicas
- **Worker capacity controls** — separate claim batch size from concurrency and drain backlogs within one poll cycle
- **Worker observability** — poll, delivery, retry, degradation, failure, and disablement callbacks
- **Graceful shutdown** — waits for active polling and in-flight deliveries before exit
- **SSRF defense** — DNS resolution validation at registration and dispatch time, IPv6 bypass blocking
- **Ports/adapters architecture** — swap Prisma or fetch with custom implementations
- **Multi-tenant ready** — `tenant_id` column for `@nestarc/tenancy` integration
- **Stale delivery recovery** — lease-based reaper recovers deliveries from crashed workers

## Start here

- [Installation](./installation) — schema migrations and module configuration.
- [Sending Events](./sending-events) — idempotent fan-out, tenant, and targeted publishing.
- [Endpoint Management](./endpoint-management) — endpoint lifecycle and secret rotation.
- [Delivery Logs](./delivery-logs) — attempts, manual retry, bulk retry, and replay.
- [Operations & Data Lifecycle](./operations) — capacity, observers, retention, and redaction.
- [Security](./security) — SSRF defenses and replay-resistant signature verification.
- [API Reference](/api/webhook/) — generated TypeScript API documentation.

## Requirements

- NestJS 10 or 11
- Node.js >= 20
- Prisma 5 or 6
- PostgreSQL 9.5+ (for `SKIP LOCKED` and `gen_random_uuid()`)
- `@nestjs/schedule` (peer dependency)
