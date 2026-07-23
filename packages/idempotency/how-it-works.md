---
description: "How @nestarc/idempotency works: IETF draft-07 semantics, stable fingerprints, response replay, token-based CAS, and error behavior."
---

# How It Works

`@nestarc/idempotency` implements an interceptor-level state machine for NestJS write endpoints. It makes retry behavior deterministic at the HTTP boundary:

- first request with a new key runs the handler;
- matching completed retry replays the stored response;
- concurrent duplicate while the first request is still running returns `409`;
- reused key with a different fingerprint returns `422`;
- missing required key returns `400`.

## Request lifecycle

```text
Client request
  |
  v
IdempotencyInterceptor
  |
  |-- No @Idempotent(): pass through
  |-- Resolve options and validate ttl / processingTtl
  |-- Resolve key from Idempotency-Key or keyResolver
  |-- Missing key + required=true: 400
  |-- Key longer than maxKeyLength: 400
  |
  v
Compute scoped storage key
  |
  |-- default: HTTP_METHOD /actual/path::rawKey
  |-- query string excluded
  |
  v
Compute fingerprint
  |
  |-- default: stable JSON SHA-256 of request body
  |-- custom resolver if configured
  |
  v
storage.get(scopedKey)
  |
  |-- COMPLETED + matching fingerprint: replay status/body/safe headers
  |-- fingerprint mismatch: 422
  |-- PROCESSING: 409
  |-- not found: create PROCESSING record with token
                      |
                      |-- acquired=false: re-read and dispatch again
                      |-- acquired=true: run handler
                              |
                              |-- JSON response: complete(token, response)
                              |-- non-replayable response: delete(token), emit original response
                              |-- handler throws: delete(token), rethrow
```

The interceptor uses RxJS `concatMap` when capturing a successful handler response so the storage write completes before the response is emitted to the client. That removes the small race where a retry could arrive immediately after the first response but before the cache entry is marked `COMPLETED`.

## IETF draft semantics

The package targets the behavior described by `draft-ietf-httpapi-idempotency-key-header-07`. The draft is not a final RFC, so the package documents its supported profile explicitly.

| HTTP status | When it happens | Meaning |
|------------:|-----------------|---------|
| `400` | No key is resolved and `required: true`, or TTL/key validation fails | The client or endpoint configuration violated the contract |
| `409` | A matching key is currently `PROCESSING` | A concurrent duplicate is still in flight |
| `422` | A record exists for the key but the request fingerprint differs | The key was reused for a different payload |
| Original status | A completed record exists with a matching fingerprint | The original response is replayed |

Fingerprint mismatch takes priority over `PROCESSING`, so a reused key with a different payload returns `422` even if the first request is still in flight.

## Stable JSON fingerprinting

With `fingerprint: true`, the request body is serialized through stable JSON before hashing:

- object keys are sorted recursively;
- array order is preserved;
- `undefined`, functions, symbols, `toJSON`, boxed primitives, circular structures, and `BigInt` follow JSON-compatible behavior;
- semantically equivalent object key order no longer causes false `422` responses.

Example:

```json
{ "amount": 100, "metadata": { "source": "web", "campaign": "spring" } }
```

and

```json
{ "metadata": { "campaign": "spring", "source": "web" }, "amount": 100 }
```

produce the same default fingerprint. Arrays remain order-sensitive because `[1, 2]` and `[2, 1]` are different payloads.

For webhook or command-style APIs, use a custom fingerprint resolver when the semantic identity is not the whole body.

## Response replay

When a duplicate request matches a completed record, the interceptor restores:

1. the original HTTP status code;
2. the JSON response body;
3. safe replay headers, when enabled;
4. idempotency status headers, unless disabled.

Default replay headers are:

- `Content-Type`
- `Location`
- `ETag`
- `Cache-Control`
- custom `X-*` headers

Denied headers are never captured or replayed, even if explicitly allowlisted. This includes headers such as `Set-Cookie`, `Connection`, and `Transfer-Encoding`. `Authorization` is not in the default allowlist; avoid adding it to an explicit allowlist for public APIs.

Set `replayHeaders: false` to replay only status and body, or pass an explicit allowlist:

```typescript
IdempotencyModule.forRoot({
  storage,
  replayHeaders: ['location', 'x-request-id'],
});
```

## Token-based compare-and-set

Each successful `storage.create()` returns an opaque token. The interceptor must pass that token back to `complete()` or `delete()`.

This prevents a TTL-expiry race:

1. Request A creates a `PROCESSING` record and receives token A.
2. A runs longer than the processing TTL, so the record expires.
3. Request B creates a fresh record under the same key and receives token B.
4. A finally finishes and calls `complete(key, tokenA, response)`.
5. Storage sees token A does not own the current record and returns `'stale'`.
6. A still receives its own handler result, but B's record is not clobbered.

Without token-based CAS, a slow first request could overwrite a newer request's record after TTL eviction.

## Transient storage failures

If the handler succeeds but `storage.complete()` throws, the interceptor emits the handler result to the original caller and keeps the `PROCESSING` record in place until TTL expiry. Retries see `409` instead of re-running the business logic.

This behavior intentionally favors "do not duplicate the side effect" over "always cache a replay." It is the safer failure mode for payments, orders, refunds, imports, and webhooks.

## Endpoint scoping

The default scope is `endpoint`. The storage key is:

```text
HTTP_METHOD /actual/path::rawKey
```

Examples:

```text
POST /payments::client-key
POST /payments/pay_1/capture::client-key
POST /payments/pay_2/capture::client-key
```

The query string is excluded. These two requests share the same idempotency namespace:

```text
POST /search?a=1
POST /search?b=2
```

Use a custom `scope` function if query values are part of the operation identity.

## Status headers and observability

v0.4.0 exposes status headers by default:

| Header | Values |
|--------|--------|
| `Idempotency-Status` | `created`, `replayed`, `conflict`, `mismatch`, `bypassed`, `stale`, `complete_error` |
| `Idempotency-Replayed` | `true` on replayed responses |

The `observability.onEvent` hook receives the same outcome with a redacted `keyHash`, the scoped key, optional status code, and optional error. Hook failures are swallowed and logged so telemetry problems do not change request behavior.

Disable client-visible headers when needed:

```typescript
IdempotencyModule.forRoot({
  storage,
  observability: { exposeStatusHeaders: false },
});
```

## Non-replayable responses

Only JSON-serializable responses are cached. These response shapes bypass caching:

- `Buffer`
- `ArrayBuffer`
- typed arrays such as `Uint8Array`
- Node.js readable streams
- Web `ReadableStream`
- values that throw during `JSON.stringify`, such as circular structures

The handler still runs and the original caller still receives the response. The cache write is skipped with a warning because replaying binary or stream responses as JSON would corrupt the response.

## Verification in the source package

The package source includes coverage for the failure modes this state machine is designed to prevent:

- Express E2E replay, mismatch, missing-key, header replay, endpoint scoping, and concurrent duplicate behavior.
- Fastify E2E replay, mismatch, missing-key, parameterized route scoping, and header replay.
- Stable JSON serialization unit tests.
- Safe response header capture and replay unit tests.
- Real Redis smoke tests in CI through `TEST_REDIS_URL`.
- Postgres unit and E2E tests with a Postgres service container in CI.
- Shared storage contract tests for `MemoryStorage`, `RedisStorage`, and `PostgresStorage`.
