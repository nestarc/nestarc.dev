---
description: "Outbound webhook delivery for NestJS — HMAC signing, exponential retry, circuit breaker, delivery logs, fan-out, Standard Webhooks compatible."
---

# @nestarc/webhook

Outbound webhook delivery module for NestJS — send events to customer endpoints with HMAC signing, exponential retry, circuit breaker, and full delivery audit trail. Uses your existing PostgreSQL database — no separate infrastructure required.

::: info Hosted option (public beta)
Want the delivery semantics of `@nestarc/webhook` without running the poller and dashboard yourself? [webhook.nestarc.dev](https://webhook.nestarc.dev) is a managed deployment currently in **public beta** with a free plan — useful for trying the delivery pipeline end-to-end before self-hosting.
:::

## Features

- **Fan-out delivery** — one event published to all matching endpoints in a single call
- **HMAC-SHA256 signing** — [Standard Webhooks](https://www.standardwebhooks.com/) compatible headers (`webhook-id`, `webhook-timestamp`, `webhook-signature`)
- **Exponential backoff** — 30s, 5m, 30m, 2h, 24h retry schedule with ±10% jitter
- **Circuit breaker** — auto-disable failing endpoints after consecutive failures, auto-recover after cooldown
- **Dead letter queue** — failed deliveries tracked for manual retry via admin API
- **Delivery logs** — full audit trail per delivery attempt (status code, latency, response body)
- **Multi-instance safe** — `FOR UPDATE SKIP LOCKED` prevents duplicate delivery across replicas
- **Graceful shutdown** — drains in-flight deliveries on process exit (30s timeout)
- **SSRF defense** — DNS resolution validation at registration and dispatch time, IPv6 bypass blocking
- **Ports/adapters architecture** — swap Prisma or fetch with custom implementations
- **Multi-tenant ready** — `tenant_id` column for `@nestarc/tenancy` integration
- **Stale delivery recovery** — lease-based reaper recovers deliveries from crashed workers

## Requirements

- NestJS 10 or 11
- Prisma 5 or 6
- PostgreSQL 9.5+ (for `SKIP LOCKED` and `gen_random_uuid()`)
- `@nestjs/schedule` (peer dependency)
