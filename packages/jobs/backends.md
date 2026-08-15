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
| Status/history API | Full process-local history | Current state for queues opened by this producer instance only |
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
- The current release exposes normalized current status only for queues this backend instance has opened through `enqueue()`, plus attempts, numeric delay, and stable job IDs. A restarted or worker-only process does not discover queues from Redis and returns `null`/`[]` until it enqueues that job type. It does not translate `scheduledFor` or the package's `{ type, delayMs, maxDelayMs }` backoff policy to BullMQ's option shape.
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
import { readFileSync } from 'node:fs';
import {
  Injectable,
  Module,
  type OnApplicationShutdown,
} from '@nestjs/common';
import { BullMQBackend, JobsModule } from '@nestarc/jobs';

const redisHost = process.env.REDIS_HOST!;
const backend = new BullMQBackend({
  namespace: 'acme',
  connection: {
    host: redisHost,
    port: Number(process.env.REDIS_PORT ?? 6380),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    tls: {
      ca: readFileSync(process.env.REDIS_CA_FILE!),
      servername: redisHost,
      rejectUnauthorized: true,
    },
  },
  workerConcurrency: 10,
});

@Injectable()
class BullMQShutdown implements OnApplicationShutdown {
  async onApplicationShutdown(): Promise<void> {
    await backend.close();
  }
}

@Module({
  imports: [
    JobsModule.forBullMQ({ backend, jobTypes: ['sendReport'] }),
  ],
  providers: [BullMQShutdown],
})
export class JobsBackendModule {}
```

Use TLS with certificate verification and workload-specific Redis ACL credentials in production. A plaintext connection is appropriate only for an explicitly local/test Redis instance inside the same trusted boundary. Call `app.enableShutdownHooks()` in the process bootstrap; the application-owned shutdown provider is responsible for closing the backend.

For an absolute target time, calculate `delayMs` immediately before enqueue. Do not pass the package `backoff` object to the current BullMQ adapter; use an application-owned adapter with an exact-version integration test if native BullMQ backoff is required.

## Migration plan

Many teams start with `forInMemory` for early development, then switch to `forBullMQ` when they need persistence and multi-process consumption. The handler interface (`@JobHandler`, payload + ctx signatures) is stable across backends, so the switch is a module-registration change plus a Redis deployment — not a handler rewrite.

Switching to the current BullMQ backend drops tenant fairness, cooperative handler timeout, rich dedupe, full transition history, and the in-memory DLQ service helpers. Treat those as explicit backend capability boundaries when planning the migration.
