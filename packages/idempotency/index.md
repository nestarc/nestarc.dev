---
description: "IETF-compliant idempotency for NestJS — decorator-based, pluggable storage, response replay, fingerprint validation."
---

# @nestarc/idempotency

IETF-draft-compliant idempotency module for NestJS — one-line decorator API with pluggable storage and response replay.

## Features

- **IETF draft compliant** — implements `httpapi-idempotency-key-header-07` semantics (400 / 409 / 422)
- **One-line decorator** — `@Idempotent()` on any handler to enable exactly-once processing
- **Response replay** — duplicate requests return the cached response without re-running the handler
- **Request fingerprint** — SHA-256 body hashing detects key reuse with different payloads (422)
- **Pluggable storage** — MemoryStorage for dev/test, RedisStorage for production (custom adapters supported)
- **Configurable scope** — per-endpoint (default), global, or custom function (e.g. multi-tenant)
- **Token-based CAS** — prevents TTL-expiry races from clobbering newer records
- **Per-handler overrides** — `ttl`, `required`, `fingerprint` configurable per endpoint
- **Binary detection** — Buffer, streams, typed arrays bypass caching with a warning (never corrupt replays)
- **NestJS lifecycle** — storage adapters implement `OnModuleDestroy` for graceful shutdown

## Requirements

- NestJS 10 or 11
- Node.js 20+
- Optional: ioredis 5+ (for RedisStorage)
