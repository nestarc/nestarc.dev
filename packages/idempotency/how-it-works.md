---
description: "Idempotency 1.0 request/replay state machine, raw key validation, authenticated scopes, response serialization, processing leases, and failure recovery."
---

# How It Works

`@nestarc/idempotency` **1.0.0** coordinates selected NestJS HTTP handlers through shared records. It prevents an expired writer from replacing a new owner's record, but cache ownership is separate from whether a business action committed.

## Request lifecycle

```text
Authentication and resource authorization guards
  |
IdempotencyInterceptor
  |-- No @Idempotent(): pass through
  |-- Validate options and supported HTTP response mode
  |-- Resolve and validate one key (header or keyResolver)
  |-- Missing required key / invalid key: 400
  |-- Missing optional key: pass through
  |
Encode namespace + key; compute fingerprint
  |
storage.get(encodedKey)
  |-- Fingerprint mismatch: 422
  |-- PROCESSING: 409
  |-- COMPLETED + supported payload: replay
  |-- COMPLETED + legacy/corrupt payload: 409, preserve record
  |-- Not found: atomic create PROCESSING with ownership token
       |-- Lost race: re-read and dispatch; absent race result: 409
       |-- Acquired: run downstream handler and response transformers
            |-- Source error: token-owned delete, rethrow original error
            |-- Successful completion: capture last emitted value
                 |-- Unsupported/capture failure: retain lease, pass through
                 |-- Supported: complete live PROCESSING owner once
                      |-- ok: emit original value, outcome created
                      |-- stale: emit original value, preserve current record
                      |-- storage failure: emit original value, never delete
```

An ordinary HTTP Observable is captured only after successful completion. Intermediate emissions are discarded, and `EMPTY` becomes an empty successful response. Completion writes are awaited before emitting a captured successful value to the client; observability callbacks are not awaited.

## HTTP contract

The package implements a **selected draft-07-compatible profile**, not every IETF draft requirement. It reads one raw opaque header string rather than a Structured Field String: `K` and `"K"` are distinct. It does not provide draft problem-details/link responses or enforce uniqueness for the client. The [1.0 supported profile](https://github.com/nestarc/idempotency/blob/v1.0.0/README.md#ietf-draft-compatible-profile) describes the boundary.

| Result | Condition | Client action |
| --- | --- | --- |
| `400` | Missing required key, duplicate/invalid header, invalid resolver result, or too many UTF-8 bytes. | Fix key production. Optional routes still reject invalid keys. |
| `409` | In-flight record, lost acquisition race without a readable winner, or completed record that cannot safely replay. | Preserve command identity. Back off for active work; reconcile unsafe completed records. |
| `422` | Existing and current fingerprints differ. | Investigate changed command parameters; do not create a new key to force the same business command. |
| Original status/body | Matching completed record with a supported payload. | Use the replayed result. |
| Normally `500` | Invalid TTL, `maxKeyLength`, scope, or unsupported response-mode configuration. | Correct server configuration. |
| Application error response | Storage read/acquisition failure or handler failure. | Assess the business outcome; an error alone does not establish rollback. |

Fingerprint mismatch takes priority over processing state or unsupported stored bodies. The package does not supply a universal retry policy or automatic `Retry-After` schedule.

## Key and scope identity

Header validation rejects repeated fields, arrays, comma-joined fields, empty/blank strings, control characters, unpaired Unicode surrogates, and values over `maxKeyLength` UTF-8 bytes (default 255). Quotes and escapes are literal. A custom key resolver replaces header lookup, allows commas, and treats only `undefined` as missing. These checks run before fingerprinting, storage, or the handler.

All scope modes encode component boundaries in a JSON tuple before hashing. The stored address is versioned; it is no longer the 0.4 `HTTP_METHOD /actual/path::rawKey` string. There is no legacy alias lookup.

| Scope | Replay-sharing boundary |
| --- | --- |
| `'endpoint'` | Method and actual path, including route parameter values. No user identity is inferred. |
| `'global'` | All endpoints and identities using the store. All callers must be authorized to share the result. |
| function | A string or array of authenticated identity components **plus** method and actual path. |

Actual duplicate/trailing slashes and percent encoding remain distinct. Query strings are excluded. If query values change the operation, include selected values in the scope or semantic fingerprint. Custom contexts without a URL fall back to route metadata, then controller/handler names.

A scope is not authentication. Guards must authenticate and authorize the resource before idempotency on every request, including replay after permission changes. Webhook signature verification belongs before the resolver and interceptor, using the original raw bytes.

## Stable request fingerprinting

With `fingerprint: true`, SHA-256 covers stable JSON of `body ?? null`. Object keys are sorted recursively and array order is preserved, so these bodies match:

```json
{ "amount": 100, "metadata": { "source": "web", "campaign": "spring" } }
```

```json
{ "metadata": { "campaign": "spring", "source": "web" }, "amount": 100 }
```

A custom resolver receives `{ context, key, scope, body, defaultFingerprint }`. `scope` is the encoded storage address, not the observability namespace. Deterministically include all fields that change the business operation. Request fingerprint serialization and the stricter response replay format are separate contracts.

## Response replay

Put idempotency before all response serializers, for example `@UseInterceptors(IdempotencyInterceptor, ClassSerializerInterceptor)`. The outgoing chain runs in reverse order, so idempotency captures the transformed value; replay bypasses the inner handler and serializer. Global provider order must obey the same rule.

Supported payloads are recursively plain or null-prototype objects, normal arrays, strings, booleans, finite numbers, and `null`. Root `undefined` represents an empty body. The payload is stored as an opaque versioned string.

| Response shape or mode | 1.0 behavior |
| --- | --- |
| Supported plain JSON or Promise | Capture original status/body and allowed headers. |
| Ordinary HTTP Observable | Capture its last value only after successful completion. |
| `@Res({ passthrough: true })` setting status/headers and returning JSON | Supported. |
| Class instances, `Date`, nested `undefined`, sparse arrays, accessors, `toJSON`, proxies, symbols/functions, BigInt, cycles | Bypass capture and retain `PROCESSING`. Convert values before this boundary. |
| `StreamableFile`, Buffer, ArrayBuffer, typed arrays, Node/Web streams | Bypass capture and retain `PROCESSING`. |
| Passthrough handler already called `send()` | Keep the sent response and lease; do not write more headers. |
| Direct `@Res()`/`@Next()` without passthrough, `@Render()`, `@Redirect()` | Configuration error before storage or handler execution. |
| SSE | Unsupported before handler/storage; Nest may already have opened HTTP 200 and then send an error event. |

Passing through an unsupported value cannot make it a valid Nest/adapter HTTP response. The package cannot detect arbitrary outer transformations; adapter-specific response schemas or serialization hooks that further transform the body are outside its replay guarantee.

Default replay headers are `Content-Type`, `Location`, `ETag`, `Cache-Control`, and custom `X-*`. Explicit allowlists remain subject to the denylist, including `Set-Cookie`, hop-by-hop headers, `Idempotency-Status`, and `Idempotency-Replayed`. Status headers are generated afresh for the current request, never restored from storage.

## Processing leases and token ownership

`processingTtl` controls the in-flight lease; `ttl` controls completed replay retention and defaults to 86,400 seconds. When omitted, `processingTtl` equals `ttl`. Both accept integer seconds 1–2,147,483,647, validated before storage access.

A successful `create()` returns an ownership token. Only the same unexpired `PROCESSING` owner can complete once. An expired, missing, replaced, or already completed record returns `'stale'` without changing the response or TTL. Deletion is token-owned too.

A lease can expire while the original handler or provider request is still running. A retry may then acquire a new token and run again; CAS only stops the old owner from overwriting the new record. There is no lease heartbeat or exactly-once business transaction. Keep a durable command/inbox record through the actual retry horizon and reconcile external provider results.

## Failure and recovery

| Failure | Record handling | Outcome |
| --- | --- | --- |
| Initial `get`, `create`, or race re-read fails | Handler does not run for this attempt; an ambiguous create may already have acquired a lease. | Original storage error; `storage_error` with the operation. |
| Handler fails, including an inner timeout | Attempt token-owned deletion. Failure after a business commit is still possible. | Original handler error, even if cleanup fails. Failed cleanup emits `storage_error` for `delete`. |
| Unsupported response or capture failure | Keep existing processing lease. | Original value passes through; `bypassed`. |
| `complete()` fails | Never delete. The write may already have committed before acknowledgment failed. | Successful handler value passes through; `complete_error`. |
| `complete()` returns `'stale'` | Leave storage unchanged. | Successful handler value passes through; `stale`. |
| Outer unsubscribe/timeout | No completion or deletion for a later handler result; already-started storage Promises can still commit. | No later outcome through the canceled subscription. |
| Process crash | No reliable cleanup; shared state depends on the last applied write and durability. | The business action may have committed without a response/event. |

A completion error does **not** guarantee the record is still `PROCESSING`: it may already be `COMPLETED` after a lost acknowledgment. A canceled subscription does not prove business cancellation, and an HTTP disconnect does not necessarily cause Nest to unsubscribe.

Recover through the authenticated business command ledger and provider evidence. Return a confirmed result through an application reconciliation endpoint; keep uncertain commands pending. Do not delete records to clear `409`, change keys to bypass `422`, or interpret absent/expired storage as proof that no side effect occurred. See the [release failure/recovery guide](https://github.com/nestarc/idempotency/blob/v1.0.0/docs/failure-recovery.md) for timeout placement and crash cases.

## Status headers and events

The current request can receive `Idempotency-Status: created`, `replayed`, `conflict`, `mismatch`, `bypassed`, `stale`, or `complete_error`. Replays also receive `Idempotency-Replayed: true`. Disable package-generated headers with `observability: { exposeStatusHeaders: false }`.

Events additionally include `storage_error`, which assigns no new HTTP status/header. An event contains hashed `namespace` and `keyHash`, optional `statusCode`, and either `{ code: 'storage_failure', operation }` or `{ code: 'response_not_replayable' }` when relevant. It never contains the original Error object. Operations are `get`, `create`, `race_get`, `complete`, or `delete`.

`namespace` replaces 0.4's `event.scope`; it hashes identity and endpoint independently of the raw key. `keyHash` hashes the encoded storage address again. Neither is a raw-key lookup, encryption, an anonymity guarantee, or a suitable metric label. Hash continuity with 0.4 is not promised.

The hook is unawaited and best effort. Throws/rejections do not change the request result. Events can be absent after cancellation/crash, so use a durable business ledger for authoritative results rather than event counts.

## Source verification

The [1.0.0 release validation documentation](https://github.com/nestarc/idempotency/blob/v1.0.0/docs/1.0.0/work-items/S8-release-validation.md) describes testing the same tarball across Node 22/24, Nest 10/11, and minimum/representative optional peers, with real PostgreSQL 16 and Redis 7 plus Express/Fastify installed consumers. These checks support the package contract; validate authorization, serializer order, provider recovery, and storage topology in your own application.
