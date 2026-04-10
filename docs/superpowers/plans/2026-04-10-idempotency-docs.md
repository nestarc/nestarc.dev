# @nestarc/idempotency Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add complete documentation for the newly released `@nestarc/idempotency` (v0.1.3) package to the nestarc.dev VitePress docs site, following the established patterns of the existing 6 packages.

**Architecture:** 4 new markdown pages under `packages/idempotency/`, updates to VitePress config (sidebar + nav), homepage feature card, changelog, getting-started stack overview, and adoption roadmap. All content follows the existing documentation patterns exactly.

**Tech Stack:** VitePress, Markdown

---

## File Structure

### New files
- `packages/idempotency/index.md` — Introduction (features + requirements)
- `packages/idempotency/installation.md` — Install + module registration + interceptor wiring + config tables
- `packages/idempotency/how-it-works.md` — State machine flow + error reference + IETF compliance
- `packages/idempotency/storage.md` — MemoryStorage vs RedisStorage + custom adapters
- `packages/idempotency/benchmark.md` — A~E benchmark results + interpretation

### Modified files
- `.vitepress/config.mts` — Add idempotency to `packagesNav` and `sidebar`
- `index.md` (homepage) — Add idempotency feature card
- `changelog.md` — Add @nestarc/idempotency section
- `getting-started.md` — Add to Stack Overview diagram + table
- `guide/adoption-roadmap.md` — Add idempotency to Step 4

---

### Task 1: VitePress config — sidebar + nav

**Files:**
- Modify: `.vitepress/config.mts`

- [ ] **Step 1: Add idempotency to packagesNav array**

```typescript
const packagesNav = [
  { text: 'tenancy', link: '/packages/tenancy/' },
  { text: 'safe-response', link: '/packages/safe-response/' },
  { text: 'audit-log', link: '/packages/audit-log/' },
  { text: 'feature-flag', link: '/packages/feature-flag/' },
  { text: 'soft-delete', link: '/packages/soft-delete/' },
  { text: 'pagination', link: '/packages/pagination/' },
  { text: 'idempotency', link: '/packages/idempotency/' },
]
```

- [ ] **Step 2: Add idempotency sidebar section**

Add after the `'/packages/pagination/'` sidebar entry:

```typescript
'/packages/idempotency/': [
  {
    text: 'idempotency',
    items: [
      { text: 'Introduction', link: '/packages/idempotency/' },
      { text: 'Installation', link: '/packages/idempotency/installation' },
      { text: 'How It Works', link: '/packages/idempotency/how-it-works' },
      { text: 'Storage Adapters', link: '/packages/idempotency/storage' },
      { text: 'Benchmark', link: '/packages/idempotency/benchmark' },
    ],
  },
],
```

- [ ] **Step 3: Verify with `npm run docs:dev`**

Run: `npm run docs:dev`
Expected: Dev server starts, `/packages/idempotency/` shows in nav dropdown

- [ ] **Step 4: Commit**

```bash
git add .vitepress/config.mts
git commit -m "docs: add idempotency to VitePress nav and sidebar"
```

---

### Task 2: Introduction page (index.md)

**Files:**
- Create: `packages/idempotency/index.md`

- [ ] **Step 1: Create the introduction page**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add packages/idempotency/index.md
git commit -m "docs: add idempotency introduction page"
```

---

### Task 3: Installation page

**Files:**
- Create: `packages/idempotency/installation.md`

- [ ] **Step 1: Create the installation page**

```markdown
---
description: "Install @nestarc/idempotency, register IdempotencyModule, and wire the interceptor in your NestJS application."
---

# Installation

## 1. Install

\`\`\`bash
npm install @nestarc/idempotency
\`\`\`

For Redis storage (recommended for production):

\`\`\`bash
npm install ioredis
\`\`\`

## 2. Register the Module

\`\`\`typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { IdempotencyModule, MemoryStorage } from '@nestarc/idempotency';

@Module({
  imports: [
    IdempotencyModule.forRoot({
      storage: new MemoryStorage(),
      ttl: 86400, // 24 hours
    }),
  ],
})
export class AppModule {}
\`\`\`

### Async registration (recommended)

\`\`\`typescript
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IdempotencyModule, RedisStorage } from '@nestarc/idempotency';
import { Redis } from 'ioredis';

@Module({
  imports: [
    IdempotencyModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: new RedisStorage({
          client: new Redis({
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
          }),
        }),
        ttl: config.get('IDEMPOTENCY_TTL', 86400),
      }),
    }),
  ],
})
export class AppModule {}
\`\`\`

## 3. Wire the Interceptor

The module does **not** auto-register the interceptor — you opt in with one of three patterns:

\`\`\`typescript
// 1. App-global — applies to every controller
import { APP_INTERCEPTOR } from '@nestjs/core';
import { IdempotencyInterceptor } from '@nestarc/idempotency';

@Module({
  providers: [{ provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor }],
})
export class AppModule {}
\`\`\`

\`\`\`typescript
// 2. Controller-scoped
@Controller('payments')
@UseInterceptors(IdempotencyInterceptor)
export class PaymentsController { ... }
\`\`\`

\`\`\`typescript
// 3. Method-scoped
@Post()
@UseInterceptors(IdempotencyInterceptor)
@Idempotent()
createPayment() { ... }
\`\`\`

In all three cases, only handlers decorated with `@Idempotent()` are processed. Routes without the decorator pass through untouched.

## 4. Decorate Your Handlers

\`\`\`typescript
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { Idempotent, IdempotencyInterceptor } from '@nestarc/idempotency';

@Controller('payments')
@UseInterceptors(IdempotencyInterceptor)
export class PaymentsController {
  @Post()
  @Idempotent()
  createPayment(@Body() dto: CreatePaymentDto) {
    // Runs at most once per Idempotency-Key.
    return this.paymentService.process(dto);
  }

  @Post('refund')
  @Idempotent({ ttl: 300, required: false })
  refund(@Body() dto: RefundDto) {
    // Custom TTL, optional header.
    return this.paymentService.refund(dto);
  }
}
\`\`\`

## Module Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | `IdempotencyStorage` | *required* | Storage adapter instance (`MemoryStorage` or `RedisStorage`) |
| `ttl` | `number` | `86400` | Default TTL in seconds. Per-handler can override |
| `headerName` | `string` | `'Idempotency-Key'` | HTTP header carrying the idempotency key |
| `fingerprint` | `boolean` | `true` | Compute SHA-256 fingerprint of request body |
| `scope` | `IdempotencyScope` | `'endpoint'` | Key namespace strategy. See below |
| `isGlobal` | `boolean` | `true` | Register as a NestJS global module |

## Decorator Options (`@Idempotent()`)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `required` | `boolean` | `true` | If true, missing header returns 400 |
| `ttl` | `number` | inherit | Override module-level TTL for this handler |
| `fingerprint` | `boolean` | inherit | Override module-level fingerprint setting |

## Scope

The `scope` option controls how the storage key is derived from the raw header value.

| Value | Behavior |
|-------|----------|
| `'endpoint'` | **Default.** Prefixes `HTTP_METHOD /route::` using NestJS `PATH_METADATA`. Isolates v1/v2 APIs with same class names |
| `'global'` | Raw header value as-is. Safe only if clients guarantee globally-unique keys |
| `function` | `(ctx: ExecutionContext) => string`. Custom scoping — e.g. include tenant ID |

\`\`\`typescript
// Multi-tenant example
IdempotencyModule.forRoot({
  storage: new MemoryStorage(),
  scope: (ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user.tenantId;
  },
});
\`\`\`
```

- [ ] **Step 2: Commit**

```bash
git add packages/idempotency/installation.md
git commit -m "docs: add idempotency installation page"
```

---

### Task 4: How It Works page

**Files:**
- Create: `packages/idempotency/how-it-works.md`

- [ ] **Step 1: Create the how-it-works page**

```markdown
---
description: "How the idempotency interceptor works — state machine, error codes, IETF compliance, and response replay lifecycle."
---

# How It Works

The interceptor implements a state machine that ensures exactly-once handler execution per `Idempotency-Key` value.

## Request Lifecycle

\`\`\`
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
\`\`\`

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
```

- [ ] **Step 2: Commit**

```bash
git add packages/idempotency/how-it-works.md
git commit -m "docs: add idempotency how-it-works page"
```

---

### Task 5: Storage Adapters page

**Files:**
- Create: `packages/idempotency/storage.md`

- [ ] **Step 1: Create the storage page**

```markdown
---
description: "Storage adapters for @nestarc/idempotency — MemoryStorage for dev/test, RedisStorage for production, and custom adapter interface."
---

# Storage Adapters

## Adapter Comparison

| Feature | MemoryStorage | RedisStorage |
|---------|---------------|--------------|
| Scope | Single process | Shared across replicas |
| Persistence | Lost on restart | Full Redis durability |
| TTL mechanism | `setTimeout` | Redis `EXPIRE` |
| Cluster-safe | ❌ | ✅ |
| Production-ready | ❌ (dev/test only) | ✅ |
| Required peer | none | `ioredis ^5` |

## MemoryStorage

Backed by a `Map` with per-entry `setTimeout` expirations. Suitable for development and testing.

\`\`\`typescript
import { IdempotencyModule, MemoryStorage } from '@nestarc/idempotency';

@Module({
  imports: [
    IdempotencyModule.forRoot({
      storage: new MemoryStorage(),
      ttl: 86400,
    }),
  ],
})
export class AppModule {}
\`\`\`

::: warning
**Not safe for production.** State is lost on restart and not shared across processes — two replicas would enforce idempotency independently, letting duplicates slip through.
:::

## RedisStorage

Stores records as Redis Hash structures with Lua scripts for atomic compare-and-set operations.

\`\`\`typescript
import { IdempotencyModule, RedisStorage } from '@nestarc/idempotency';
import { Redis } from 'ioredis';

@Module({
  imports: [
    IdempotencyModule.forRoot({
      storage: new RedisStorage({
        client: new Redis({ host: 'localhost', port: 6379 }),
      }),
      ttl: 86400,
    }),
  ],
})
export class AppModule {}
\`\`\`

### RedisStorage Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `client` | `Redis` | — | Pre-built ioredis client (recommended) |
| `connection` | `RedisOptions` | — | ioredis options for lazy client construction |
| `keyPrefix` | `string` | `'idempotency:'` | Prefix for all Redis keys |

If you pass `client`, you own its lifecycle. If you pass `connection`, RedisStorage creates and closes the client via `OnModuleDestroy`.

### Lua Scripts

RedisStorage registers three Lua scripts via `defineCommand`:

| Script | Operation | Guarantee |
|--------|-----------|-----------|
| `idemCreate` | NX-semantics record creation | Exactly one caller acquires the lock |
| `idemComplete` | Token-gated PROCESSING → COMPLETED | Only the lock owner can write the response |
| `idemDelete` | Token-gated cleanup | Failed handlers clean up without clobbering |

## Custom Storage Adapters

Implement the `IdempotencyStorage` interface with token-based compare-and-set semantics:

\`\`\`typescript
import type {
  IdempotencyStorage,
  IdempotencyRecord,
  CreateResult,
  CompleteResponse,
  MutateResult,
} from '@nestarc/idempotency';
import type { OnModuleDestroy } from '@nestjs/common';

class MyStorage implements IdempotencyStorage, OnModuleDestroy {
  async get(key: string): Promise<IdempotencyRecord | null> {
    // Return the record, or null if expired / not found.
  }

  async create(
    key: string,
    fingerprint: string | undefined,
    ttlSeconds: number,
  ): Promise<CreateResult> {
    // NX semantics: return { acquired: false } if key exists.
    // Otherwise generate a token, persist PROCESSING record,
    // and return { acquired: true, token }.
  }

  async complete(
    key: string,
    token: string,
    response: CompleteResponse,
    ttlSeconds: number,
  ): Promise<MutateResult> {
    // Compare-and-set: only mutate if stored token matches.
    // Return 'ok' on success, 'stale' on token mismatch.
    // Refresh expiresAt but preserve createdAt.
  }

  async delete(key: string, token: string): Promise<MutateResult> {
    // Token-gated cleanup. Return 'ok' if removed or absent,
    // 'stale' if a different record exists under this key.
  }

  async onModuleDestroy(): Promise<void> {
    // Release external resources (connections, timers).
  }
}
\`\`\`

### Storage Contract Guarantees

1. **Atomic creation** — two concurrent `create()` for the same key must result in exactly one `acquired: true`
2. **Token-based CAS** — `complete()` and `delete()` only mutate records with matching tokens
3. **`createdAt` immutability** — `complete()` must preserve the original `createdAt` timestamp

::: tip
The source repo includes a shared contract test suite at `test/support/shared-storage-contract.ts`. Custom adapters can plug into it via `describeStorageContract('Name', factory)` to verify conformance.
:::
```

- [ ] **Step 2: Commit**

```bash
git add packages/idempotency/storage.md
git commit -m "docs: add idempotency storage adapters page"
```

---

### Task 6: Benchmark page

**Files:**
- Create: `packages/idempotency/benchmark.md`

- [ ] **Step 1: Create the benchmark page**

```markdown
---
description: "Performance benchmarks for @nestarc/idempotency — interceptor overhead, response replay speed, MemoryStorage vs RedisStorage latency."
---

# Benchmark

Measures the overhead added by the idempotency interceptor and the speed of response replay.

## What We Measure

| Benchmark | Description |
|-----------|-------------|
| **A) POST — no idempotency (baseline)** | Plain NestJS handler without the interceptor |
| **B) First request — MemoryStorage** | Full path: header parsing + fingerprint + record creation + handler + response capture |
| **C) Replay — MemoryStorage** | Cache hit: record lookup + fingerprint match + cached response replay (handler skipped) |
| **D) First request — RedisStorage** | Same as B with Redis (4 round trips: get + create + hgetall + complete) |
| **E) Replay — RedisStorage** | Same as C with Redis (1 round trip: get only) |

## Test Setup

- **NestJS:** Test app with `@nestjs/testing`, trivial JSON handler
- **Redis:** Docker `redis:7-alpine`, localhost
- **Iterations:** 1,000 per scenario
- **Warmup:** 100 iterations (discarded)
- **HTTP client:** Raw `http.request()` (no supertest overhead)

## Running Locally

\`\`\`bash
# Memory only (A, B, C)
npx ts-node bench/idempotency.bench.ts --iterations 1000 --warmup 100

# With Redis (A~E)
docker run -d --name redis-bench -p 6379:6379 redis:7-alpine
npx ts-node bench/idempotency.bench.ts --iterations 1000 --warmup 100 \
  --redis-url redis://localhost:6379
docker stop redis-bench && docker rm redis-bench
\`\`\`

## Results

> Measured on Windows 11, Node.js 20, Redis 7 (Docker), localhost. Your results will vary.

| Benchmark | Avg | P50 | P95 | P99 |
|-----------|-----|-----|-----|-----|
| A) POST — no idempotency (baseline) | 0.28ms | 0.25ms | 0.39ms | 0.57ms |
| B) First request — MemoryStorage | 0.32ms | 0.30ms | 0.41ms | 0.53ms |
| C) Replay — MemoryStorage | 0.25ms | 0.24ms | 0.33ms | 0.44ms |
| D) First request — RedisStorage | 1.67ms | 1.61ms | 2.02ms | 2.34ms |
| E) Replay — RedisStorage | 0.64ms | 0.61ms | 0.82ms | 1.08ms |

## Interpretation

**MemoryStorage overhead is negligible.** First request (B) adds ~0.04ms to baseline (A) — the cost of SHA-256 fingerprinting, record creation, and response capture. Replay (C) is actually **faster** than baseline because the handler is skipped entirely.

**RedisStorage is dominated by network round trips.** First request (D) requires 4 Redis round trips (get → create → hgetall → complete), while replay (E) requires only 1 (get). The ~1ms difference between D and E reflects 3 saved round trips.

**Replay saves real handler cost.** In this benchmark the handler is trivial, so the savings are modest. In a real application where the handler performs database writes, external API calls, or complex computation, the replay savings scale proportionally — the handler is completely bypassed.

| Metric | Value |
|--------|-------|
| MemoryStorage first-request overhead (B − A) | ~0.04ms |
| MemoryStorage replay vs baseline (A − C) | ~0.03ms faster |
| RedisStorage network cost (D − B) | ~1.35ms |
| RedisStorage replay savings (D − E) | ~1.03ms (3 RTTs) |

## Methodology

- `performance.now()` for sub-millisecond timing
- Raw `http.request()` to avoid supertest assertion overhead
- Unique run ID (`Date.now().toString(36)`) prevents key collisions across repeated executions
- Warmup indices offset from measurement indices to avoid key namespace collision
- Each scenario runs sequentially (no concurrent interference)
```

- [ ] **Step 2: Commit**

```bash
git add packages/idempotency/benchmark.md
git commit -m "docs: add idempotency benchmark page"
```

---

### Task 7: Homepage feature card

**Files:**
- Modify: `index.md` (homepage)

- [ ] **Step 1: Add idempotency to features array**

In the frontmatter `features:` section, add after the pagination entry:

```yaml
  - title: idempotency
    details: IETF-draft idempotency with pluggable storage and response replay.
    link: /packages/idempotency/
    linkText: v0.1.3
```

- [ ] **Step 2: Update the pain-grid section**

Add a new pain-card after the "Response Format" card (inside `<div class="pain-grid">`):

```html
  <div class="pain-card">
    <div class="label">Idempotency</div>
    <div class="problem">Network retries cause double charges, duplicate orders, and corrupt state.</div>
    <div class="solution">IETF-standard Idempotency-Key header with response replay.</div>
  </div>
```

- [ ] **Step 3: Update "Why nestarc?" subtitle**

Change "Every multi-tenant SaaS backend needs the same six features" to "seven features":

```html
<p class="subtitle">
  Every multi-tenant SaaS backend needs the same seven features. Building them from scratch takes weeks and introduces subtle bugs. nestarc solves them once, correctly.
</p>
```

- [ ] **Step 4: Add idempotency performance card**

Add inside `<div class="perf-grid">` after the pagination card:

```html
  <div class="perf-card">
    <div class="pkg">idempotency</div>
    <div class="metric">0.04ms</div>
    <div class="desc">First-request overhead (MemoryStorage)</div>
  </div>
```

- [ ] **Step 5: Commit**

```bash
git add index.md
git commit -m "docs: add idempotency to homepage features and performance grid"
```

---

### Task 8: Changelog

**Files:**
- Modify: `changelog.md`

- [ ] **Step 1: Add @nestarc/idempotency section**

Add before the final line, after the `## @nestarc/pagination` section:

```markdown
---

## @nestarc/idempotency

### 0.1.3

- Token-based compare-and-set for TTL-expiry race prevention
- Per-endpoint key scoping via `PATH_METADATA` (HTTP_METHOD /route:: prefix)
- TTL boundary validation (positive integer only)
- Concurrent duplicate regression coverage
- Transient `storage.complete()` failure no longer causes duplicate execution

### 0.1.0

- Initial release
- IETF `httpapi-idempotency-key-header-07` state machine (400 / 409 / 422)
- `@Idempotent()` decorator with per-handler overrides
- `IdempotencyInterceptor` with opt-in wiring (global / controller / method)
- `MemoryStorage` and `RedisStorage` adapters
- SHA-256 request body fingerprint
- Response replay (status code + body)
- Configurable scope (`endpoint` / `global` / custom function)
- Binary response detection and bypass
```

- [ ] **Step 2: Commit**

```bash
git add changelog.md
git commit -m "docs: add idempotency changelog entries"
```

---

### Task 9: Getting Started — Stack Overview

**Files:**
- Modify: `getting-started.md`

- [ ] **Step 1: Update the ASCII diagram**

Replace the existing stack diagram with:

```
┌─────────────────────────────────────────────────────────────┐
│                      Your NestJS App                       │
├────────┬────────┬──────────┬──────────┬─────────┬──────────┤
│tenancy │  audit │ feature  │  soft    │paginate │idempot-  │
│        │  -log  │  -flag   │ -delete  │  -ion   │  ency    │
├────────┴────────┴──────────┴──────────┴─────────┴──────────┤
│              safe-response (API layer)                     │
├─────────────────────────────────────────────────────────────┤
│           Prisma Client Extensions                         │
├─────────────────────────────────────────────────────────────┤
│              PostgreSQL + RLS                              │
└─────────────────────────────────────────────────────────────┘
```

- [ ] **Step 2: Add idempotency to the package table**

Add after the pagination row:

```markdown
| [@nestarc/idempotency](/packages/idempotency/) | IETF-standard idempotency with response replay |
```

- [ ] **Step 3: Commit**

```bash
git add getting-started.md
git commit -m "docs: add idempotency to stack overview"
```

---

### Task 10: Adoption Roadmap

**Files:**
- Modify: `guide/adoption-roadmap.md`

- [ ] **Step 1: Add idempotency to Step 4 section**

Add after the `### pagination` block:

```markdown
### idempotency — when you need exactly-once processing

Essential for any endpoint that processes payments, creates orders, or mutates state via non-idempotent HTTP methods. Add this before going to production to prevent double charges and duplicate records.

\`\`\`bash
npm install @nestarc/idempotency
\`\`\`

[Quick Start →](/packages/idempotency/installation) · [How It Works →](/packages/idempotency/how-it-works)
```

- [ ] **Step 2: Update the Step 4 diagram**

Replace the existing diagram to include idempotency:

```
Step 1       Step 2           Step 3         Step 4
tenancy  →  safe-response  →  audit-log  →  pick what you need
                                             ├─ feature-flag
                                             ├─ soft-delete
                                             ├─ pagination
                                             └─ idempotency
```

- [ ] **Step 3: Add idempotency to the "All Packages at a Glance" table**

Add after the pagination row:

```markdown
| idempotency | Step 4 | Yes (interceptor + decorator) | Optional: ioredis |
```

- [ ] **Step 4: Commit**

```bash
git add guide/adoption-roadmap.md
git commit -m "docs: add idempotency to adoption roadmap"
```

---

### Task 11: Final verification

- [ ] **Step 1: Run docs dev server and verify all pages**

```bash
npm run docs:dev
```

Check:
- [ ] Navigation dropdown shows "idempotency"
- [ ] All 5 pages render without errors (`/packages/idempotency/`, `/installation`, `/how-it-works`, `/storage`, `/benchmark`)
- [ ] Sidebar navigation works correctly
- [ ] Homepage shows 7 features with idempotency card
- [ ] Changelog shows idempotency section
- [ ] Getting Started stack diagram includes idempotency
- [ ] Adoption roadmap Step 4 includes idempotency

- [ ] **Step 2: Build for production**

```bash
npm run docs:build
```

Expected: Build completes with no errors.

- [ ] **Step 3: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "docs: fix idempotency documentation issues"
```
