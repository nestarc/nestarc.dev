---
description: "Choosing between the in-memory tenant-fair backend and the BullMQ Redis-backed backend — capabilities, behavior, and limitations."
---

# Backends

`@nestarc/jobs` ships two backends behind the same `JobsService` interface.

## Backend matrix

| Capability | In-memory | BullMQ |
| --- | --- | --- |
| Automatic worker startup in `JobsModule` | ✓ | ✓ |
| Tenant fairness | ✓ | — |
| Per-tenant weight control | ✓ | — |
| ALS/context propagation | ✓ | ✓ |
| `@JobHandler()` discovery | ✓ | ✓ |
| Outbox bridge | ✓ | ✓ |
| Persistent across restarts | — | ✓ (Redis) |
| Multi-process consumption | — | ✓ |
| Delayed/scheduled jobs | ✓ | Numeric `delay`/`delayMs` only; `scheduledFor` is not mapped |
| Status/history API | Full process-local history | Current normalized state + minimal snapshot |
| Retry/backoff | ✓ | Attempts only; package backoff policy is not mapped |
| Handler timeout | Cooperative via `ctx.signal` | — |
| Idempotency/dedupe | Idempotency + global/tenant dedupe | Stable `jobId` mapping only |
| DLQ service helpers | ✓ | — |
| `FakeJobsService` support | ✓, with deterministic clock | N/A |

## In-memory backend

Use `forInMemory()` when:

- you run a single Nest process
- tenant fairness matters
- you want the simplest local or test setup

Important behavior:

- Workers start automatically when the Nest module initializes.
- Tenant fairness is enforced by the in-process `Scheduler`.
- Status/history, delayed execution, retry/backoff, cooperative timeout, idempotency/dedupe, lifecycle events, and DLQ helpers are available.
- Retries are opt-in; `attempts` defaults to `1`.
- This backend is **not distributed** across multiple processes — each replica has its own queue.

```ts
JobsModule.forInMemory({
  jobTypes: ['sendReport'],
  fairness: { defaultWeight: 1, minSharePct: 0.1 },
  concurrency: { tenantCap: 10 },
});
```

## BullMQ backend

Use `forBullMQ()` when:

- you need Redis-backed persistence and BullMQ workers
- FIFO delivery is acceptable for now

Important behavior:

- Jobs are processed by BullMQ's standard `Worker`.
- The current release exposes normalized current status, attempts, numeric delay, and stable job IDs. It does not translate `scheduledFor` or the package's `{ type, delayMs, maxDelayMs }` backoff policy to BullMQ's option shape.
- `idempotencyKey` maps to a stable BullMQ `jobId`; rich dedupe results and tenant-scoped dedupe are not implemented on this backend.
- Handler timeout is not implemented on this backend.
- Tenant fairness is **not implemented** in the current BullMQ backend.
- Fairness-only APIs throw on this backend:
  - `setTenantWeight()`
  - `scheduler()`
- Pull-based backend methods are **unsupported**:
  - `peekWaiting()`
  - `moveToActive()`
- Service-level dead-letter listing, replay, and discard helpers are not exposed on the current BullMQ backend.

```ts
const backend = new BullMQBackend({
  namespace: 'acme',
  connection: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT ?? 6379),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },
  workerConcurrency: 10,
});

JobsModule.forBullMQ({ backend, jobTypes: ['sendReport'] });
```

For an absolute target time, calculate `delayMs` immediately before enqueue. Do not pass the package `backoff` object to the current BullMQ adapter; use an application-owned adapter with an exact-version integration test if native BullMQ backoff is required.

## Migration plan

Many teams start with `forInMemory` for early development, then switch to `forBullMQ` when they need persistence and multi-process consumption. The handler interface (`@JobHandler`, payload + ctx signatures) is stable across backends, so the switch is a module-registration change plus a Redis deployment — not a handler rewrite.

Switching to the current BullMQ backend drops tenant fairness, cooperative handler timeout, rich dedupe, full transition history, and the in-memory DLQ service helpers. Treat those as explicit backend capability boundaries when planning the migration.
