---
description: "IETF-compliant idempotency for NestJS — decorator-based, pluggable storage, stable fingerprints, header replay, and response replay."
---

# @nestarc/idempotency

IETF-draft-compliant idempotency module for NestJS — one-line decorator API with pluggable storage and response replay.

## Features

- **IETF draft compliant** — implements `httpapi-idempotency-key-header-07` semantics (400 / 409 / 422)
- **One-line decorator** — `@Idempotent()` on any handler to enable exactly-once processing
- **Response replay** — duplicate requests return the cached response without re-running the handler
- **Request fingerprint** — SHA-256 body hashing detects key reuse with different payloads (422)
- **Stable JSON fingerprinting** — object key order no longer causes false 422 responses <Badge type="info" text="v0.3.0" />
- **Pluggable storage** — MemoryStorage for dev/test, RedisStorage for production (custom adapters supported)
- **Configurable scope** — per-endpoint (default), global, or custom function (e.g. multi-tenant)
- **Token-based CAS** — prevents TTL-expiry races from clobbering newer records
- **Response header replay** — safely captures and replays `Content-Type`, `Location`, `ETag`, `Cache-Control`, and `X-*` headers <Badge type="info" text="v0.3.0" />
- **Fastify verified** — E2E coverage for Fastify adapter behavior <Badge type="info" text="v0.3.0" />
- **Per-handler overrides** — `ttl`, `required`, `fingerprint` configurable per endpoint
- **Binary detection** — Buffer, streams, typed arrays bypass caching with a warning (never corrupt replays)
- **NestJS lifecycle** — storage adapters implement `OnModuleDestroy` for graceful shutdown

## Requirements

- NestJS 10 or 11
- Node.js 20+
- Optional: ioredis 5+ (for RedisStorage)

::: warning Postgres storage migration
If you use the Postgres adapter from a pre-0.3.0 install, add response header storage before relying on header replay:

```sql
ALTER TABLE idempotency_records ADD COLUMN IF NOT EXISTS response_headers JSONB;
```
:::
