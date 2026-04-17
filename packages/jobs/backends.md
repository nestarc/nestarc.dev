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
| `FakeJobsService` support | ✓ | N/A |
| Persistent across restarts | — | ✓ (Redis) |
| Multi-process consumption | — | ✓ |
| Delayed jobs | — (not modeled) | ✓ |
| Retries with backoff | — (not modeled) | ✓ |

## In-memory backend

Use `forInMemory()` when:

- you run a single Nest process
- tenant fairness matters
- you want the simplest local or test setup

Important behavior:

- Workers start automatically when the Nest module initializes.
- Tenant fairness is enforced by the in-process `Scheduler`.
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
- Tenant fairness is **not implemented** in `0.1.0`.
- Fairness-only APIs throw on this backend:
  - `setTenantWeight()`
  - `scheduler()`
- Pull-based backend methods are **unsupported**:
  - `peekWaiting()`
  - `moveToActive()`

```ts
const backend = new BullMQBackend({
  namespace: 'acme',
  connection: { url: process.env.REDIS_URL! },
  workerConcurrency: 10,
});

JobsModule.forBullMQ({ backend, jobTypes: ['sendReport'] });
```

## Migration plan

Many teams start with `forInMemory` for early development, then switch to `forBullMQ` when they need persistence and multi-process consumption. The handler interface (`@JobHandler`, payload + ctx signatures) is stable across backends, so the switch is a module-registration change plus a Redis deployment — not a handler rewrite.

Note that switching to BullMQ drops tenant fairness in `0.1.0`. Plan around that if you rely on weighted scheduling today — you can mitigate it with dedicated queues per tenant tier while a fair BullMQ strategy lands in a later release.
