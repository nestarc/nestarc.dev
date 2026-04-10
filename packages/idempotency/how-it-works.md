---
description: "How the idempotency interceptor works — state machine, error codes, IETF compliance, and response replay lifecycle."
---

# How It Works

The interceptor implements a state machine that ensures exactly-once handler execution per `Idempotency-Key` value.

## Request Lifecycle

```
Client Request (with Idempotency-Key header)
    │
    ▼
[IdempotencyInterceptor]
    │
    ├─ 1. Read @Idempotent() metadata
    │     ├─ no decorator → pass through
    │     ├─ missing header + required=true → 400
    │     └─ validate TTL (positive integer only)
    │
    ├─ 2. Apply scope to key
    │     (default: HTTP_METHOD /route::rawKey)
    │
    ├─ 3. Look up scoped key in storage
    │     ├─ COMPLETED + fingerprint match   → replay cached response
    │     ├─ fingerprint mismatch            → 422
    │     ├─ PROCESSING                       → 409
    │     └─ not found                        → step 4
    │
    ├─ 4. Atomically create PROCESSING record
    │     ├─ acquired → run handler (step 5)
    │     └─ lost race → re-read and dispatch (replay / 422 / 409)
    │
    ├─ 5. Run the controller handler
    │
    └─ 6. Capture response
          ├─ JSON → storage.complete() → emit to client
          ├─ Buffer/stream → bypass cache + warn + emit
          └─ handler threw → delete record + rethrow
```

## Error Reference

| Status | When | IETF Rationale |
|-------:|------|----------------|
| 400 | `Idempotency-Key` header missing and `required: true`, or TTL is not a positive integer | Client contract violation |
| 409 | A request with this key is currently being processed (in-flight collision) | Concurrent duplicate |
| 422 | A record exists with a different request-body fingerprint (key reused with new payload) | Key reused with different payload |

::: tip
Since v0.1.3, a **replay** (not 409) is returned when the race winner has already finished — the interceptor re-reads the record on a lost `create()` race and dispatches through the same state machine as the initial-read branch.
:::

## Response Replay

When a duplicate request arrives with a matching `Idempotency-Key` and fingerprint, the interceptor:

1. Restores the original HTTP status code (e.g. 201)
2. Parses the cached JSON body
3. Returns it to the client — **the handler never runs**

::: warning
Response **headers** are not replayed in v0.1. Only status code + body are cached.
:::

## Token-Based Compare-and-Set

Storage mutations use token-based CAS to prevent a subtle race condition:

1. Request A creates a PROCESSING record and receives a token
2. A's record expires via TTL while the handler is still running
3. Request B creates a NEW record under the same key
4. A's handler finishes and calls `complete(key, token, response)`
5. Storage compares tokens — A's token doesn't match B's record → returns `'stale'`
6. A's response is still emitted to A's client, but B's record is not clobbered

Without token-based CAS, step 4 would overwrite B's record with A's stale response.

## Binary Response Detection

Non-JSON responses are actively detected and bypass caching:

- `Buffer` and `ArrayBuffer`
- Typed arrays (`Uint8Array`, etc.)
- Node.js `Readable` streams (detected via `pipe()`)
- Web `ReadableStream` (detected via `getReader()`)

The handler still runs and the client still gets the response — only the cache write is skipped, with a warning logged.

## IETF Spec Compliance

This package targets [`draft-ietf-httpapi-idempotency-key-header-07`](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/).

| Requirement | Status |
|-------------|--------|
| `Idempotency-Key` header recognition | ✅ |
| Atomic key creation (NX semantics) | ✅ |
| Response replay for completed requests | ✅ |
| 409 Conflict for in-flight collisions | ✅ |
| 422 for fingerprint mismatch | ✅ |
| Per-endpoint key scoping | ✅ |
| Configurable TTL | ✅ |
| Response header replay | 🚧 v0.2 |
| Stable JSON stringify for fingerprint | 🚧 v0.2 |
