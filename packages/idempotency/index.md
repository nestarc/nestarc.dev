---
description: "IETF draft-07-compatible idempotency for NestJS: safe retries, stable fingerprints, response replay, Redis/Postgres storage, and production adoption guidance."
---

# @nestarc/idempotency

`@nestarc/idempotency` protects non-idempotent NestJS write endpoints from accidental duplicate execution when clients, gateways, workers, or mobile networks retry a request.

It follows the behavior described by the IETF `Idempotency-Key` draft: the first request owns a key, a completed matching retry receives the original response, a concurrent retry receives `409`, and a reused key with a different payload receives `422`.

The package protects the HTTP mutation boundary. It does not replace database transactions or make an entire business workflow magically exactly-once, but it closes the retry window where duplicate payments, orders, refunds, imports, and webhook handlers usually slip in.

## Why adopt it

Hand-rolled idempotency usually starts as "store the key, then return the cached response." That misses the hard production cases:

- **Race condition on first write**: two concurrent retries both see no key and both run the handler.
- **Duplicate execution after cache failure**: the handler succeeds, `complete()` fails, cleanup deletes the record, and the retry runs the business action again.
- **Payload mismatch**: the client reuses the same key for a different request and receives a misleading cached response.
- **TTL expiry race**: a slow request finishes after its lock expired and overwrites a newer request's record.
- **Response drift**: replaying only the body loses important safe headers such as `Location`, `ETag`, or `X-Request-Id`.
- **Endpoint collision**: the same raw key on two different routes should not replay the neighboring route's response.

`@nestarc/idempotency` handles these cases with an interceptor state machine, request fingerprint validation, token-based compare-and-set storage, safe response replay, and endpoint-aware scoping.

## Use cases

Use idempotency on operations where a retry must not create a second side effect:

| Workflow | What it prevents |
|----------|------------------|
| Payment creation or capture | Double charges after client timeouts or gateway retries |
| Order submission | Duplicate orders from mobile retry taps |
| Refunds and reversals | Multiple refunds for the same customer action |
| CSV/import jobs | Re-running an import request while the first one is still processing |
| Inbound webhooks | Processing the same provider event more than once |
| Command-style APIs | Re-executing a submitted command after a network failure |

## Latest reliability updates

- **Stable JSON request fingerprinting**: object keys are sorted recursively before hashing, so semantically equivalent JSON objects with different key order do not produce false `422` responses. Array order remains significant.
- **Safe response header capture and replay**: completed retries can replay `Content-Type`, `Location`, `ETag`, `Cache-Control`, and custom `X-*` headers. Unsafe hop-by-hop or credential headers such as `Set-Cookie`, `Connection`, and `Transfer-Encoding` are never cached.
- **Fastify adapter verification**: the source test suite includes Fastify E2E coverage for replay, mismatch, required-key errors, parameterized route scoping, and header replay.
- **Real Redis smoke coverage in CI**: CI runs a Redis service container and executes the shared storage contract against real Redis, not only mocks.
- **Endpoint scoping without query strings**: the default `scope: 'endpoint'` uses `HTTP_METHOD /actual/path::key` and intentionally excludes the query string to avoid key drift from query ordering.
- **Postgres response header migration**: Postgres deployments created before v0.3.0 need a one-time `response_headers JSONB` column before relying on header replay.
- **v0.4.0 API additions**: processing leases, custom key resolvers, custom fingerprint resolvers, key length validation, observability events, and `Idempotency-Status` response headers.

## Features

- **IETF draft-07-compatible behavior**: `400` for missing required keys, `409` for in-flight duplicates, `422` for fingerprint mismatch.
- **One-line handler opt-in**: add `@Idempotent()` to the endpoints that need retry safety.
- **Response replay**: duplicate completed requests return the original status, JSON body, and safe headers without re-running the handler.
- **Stable request fingerprinting**: SHA-256 over stable JSON detects key reuse with different payloads.
- **Shared production storage**: `RedisStorage` and `PostgresStorage` are built for multi-replica deployments.
- **Token-based CAS**: `create()` issues an opaque token; `complete()` and `delete()` mutate only when the token still owns the record.
- **Configurable scoping**: endpoint scope by default, global scope for globally unique keys, or a custom function for tenant-aware namespaces.
- **Processing leases**: `processingTtl` can be shorter than the completed replay `ttl` to recover stuck in-flight records.
- **Application key resolvers**: derive keys from webhook event ids, command ids, or other deterministic application fields.
- **Observability hooks**: emit redacted outcome events and expose `Idempotency-Status` headers unless disabled.
- **Binary response protection**: buffers, typed arrays, and streams bypass caching instead of replaying corrupted JSON.

## Requirements

- Node.js 20+
- NestJS 10 or 11
- Optional: `ioredis ^5` for `RedisStorage`
- Optional: `pg ^8.11` for `PostgresStorage`

## Start here

1. Install the package and wire `IdempotencyModule`.
2. Use `MemoryStorage` only for local development and tests.
3. Use `RedisStorage` or `PostgresStorage` for any multi-instance deployment.
4. Register `IdempotencyInterceptor` globally, per controller, or per method.
5. Add `@Idempotent()` only to the write endpoints that need retry safety.
6. Keep fingerprinting enabled unless the endpoint has a deliberate semantic fingerprint resolver.

::: tip Production default
For most SaaS APIs, start with `RedisStorage`, `ttl: 86400`, `processingTtl` above the endpoint p99, `fingerprint: true`, and the default `scope: 'endpoint'`.
:::

::: warning Postgres storage migration
If you use the Postgres adapter from a pre-v0.3.0 install, add response header storage before relying on header replay:

```sql
ALTER TABLE idempotency_records
  ADD COLUMN IF NOT EXISTS response_headers JSONB;
```
:::

Next: [Installation](/packages/idempotency/installation) for setup, [How It Works](/packages/idempotency/how-it-works) for the state machine, and [Storage Adapters](/packages/idempotency/storage) for Redis/Postgres details.
