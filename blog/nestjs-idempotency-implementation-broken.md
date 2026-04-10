---
title: Why Your NestJS Idempotency Implementation Is Probably Broken
date: 2026-04-10
description: Three race conditions hiding in typical NestJS idempotency interceptors — and how the IETF Idempotency-Key standard solves them.
author: nestarc
---

# Why Your NestJS Idempotency Implementation Is Probably Broken

Adding an `Idempotency-Key` header check to your API sounds simple: store the key, return the cached response on duplicates. But most implementations have subtle race conditions that only surface under real production traffic — double charges, phantom 409s, and clobbered responses that are nearly impossible to reproduce in local testing.

Here are three bugs we found in the "standard" approach — and how the IETF draft specification addresses each one.

## 1. The Concurrent Duplicate: Both Requests Run the Handler

The most common implementation looks like this:

```typescript
// Typical approach — check then act
const existing = await cache.get(key);
if (existing) return existing;

await cache.set(key, 'PROCESSING');
const result = await next.handle();
await cache.set(key, result);
return result;
```

The bug: two requests arrive 1ms apart. Both call `cache.get(key)`, both see `null`, both proceed to execute the handler. The second request creates a duplicate charge.

**Why it's hard to catch:** In development, you test with `curl` one request at a time. In production, mobile clients retry on timeout, load balancers auto-retry 502s, and API gateways send parallel retries.

**The fix:** Atomic create with NX (not-exists) semantics. The storage must guarantee that only one caller acquires the lock:

```typescript
// Atomic — only one caller gets acquired=true
const { acquired, token } = await storage.create(key, fingerprint, ttl);
if (!acquired) {
  // Someone else got here first — check their status
  const record = await storage.get(key);
  if (record.status === 'COMPLETED') return replay(record);
  if (record.status === 'PROCESSING') throw new ConflictException(); // 409
}
```

Redis `SET NX` or a PostgreSQL `INSERT ... ON CONFLICT DO NOTHING` provides this guarantee. A plain `get → set` never will.

## 2. The TTL Race: A Slow Request Clobbers a Newer One

Your handler takes 30 seconds (a complex payment flow). The idempotency record's TTL is 60 seconds. The following sequence is entirely possible:

1. **Request A** acquires the key, starts processing
2. 60 seconds pass — the record expires
3. **Request B** arrives with the same key, acquires a fresh record, processes, completes
4. **Request A** finally finishes and writes its response to storage
5. **Request B's cached response is overwritten** with A's stale result

Now every retry gets A's response instead of B's. If A processed an outdated payload, your data is silently corrupted.

**Why it's hard to catch:** TTL expiry races require long-running handlers + retries arriving at exactly the wrong time. You'll never reproduce this with a 10ms test handler.

**The fix:** Token-based compare-and-set. When a caller creates a PROCESSING record, it receives an opaque token. On `complete()`, the storage only accepts the write if the caller's token matches the stored token:

```typescript
const { acquired, token } = await storage.create(key, fingerprint, ttl);

// ... handler runs ...

const result = await storage.complete(key, token, response, ttl);
if (result === 'stale') {
  // Our record was evicted and replaced — do NOT clobber the new one
  logger.warn('Stale token — response not cached');
}
// Still emit the response to our client — the handler succeeded
```

Without token-based CAS, there is no safe way to handle TTL expiry in a concurrent system.

## 3. The Key Reuse: Same Key, Different Payload

A client sends `Idempotency-Key: abc123` with `{"amount": 100}`, then reuses the same key with `{"amount": 500}`. A naive implementation replays the first response (100) — the client thinks 500 was charged but only 100 was.

Worse: some implementations don't check the payload at all, so the second request silently succeeds with the wrong amount.

**The fix:** SHA-256 fingerprint of the request body, stored alongside the record. If the fingerprint doesn't match, return 422 — not a replay:

```typescript
if (existing.fingerprint !== computeFingerprint(request.body)) {
  // Same key, different payload — reject
  throw new UnprocessableEntityException(
    'Idempotency-Key reused with a different payload'
  );
}
```

The IETF draft `httpapi-idempotency-key-header-07` specifies this exact behavior: 422 for fingerprint mismatch, 409 for in-flight collision, and replay only when the fingerprint matches.

## What Gets It Right

The [IETF Idempotency-Key header specification](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/) defines a state machine that handles all three cases above. `@nestarc/idempotency` is a clean-room implementation of that specification for NestJS:

```typescript
import { Idempotent, IdempotencyInterceptor } from '@nestarc/idempotency';

@Post()
@Idempotent()
@UseInterceptors(IdempotencyInterceptor)
createPayment(@Body() dto: CreatePaymentDto) {
  // Runs at most once per Idempotency-Key.
  return this.paymentService.process(dto);
}
```

No manual cache logic. No get-then-set races. The interceptor handles atomic lock acquisition, token-based CAS, fingerprint validation, and response replay with correct HTTP status codes (400 / 409 / 422).

The overhead? **~0.04ms** per request with MemoryStorage. Response replays are actually faster than running the handler — the cached response is returned without touching your database.

## Next Steps

- [Installation](/packages/idempotency/installation) — set up IdempotencyModule in 5 minutes
- [How It Works](/packages/idempotency/how-it-works) — the full state machine and error reference
- [Storage Adapters](/packages/idempotency/storage) — MemoryStorage for dev, RedisStorage for production
