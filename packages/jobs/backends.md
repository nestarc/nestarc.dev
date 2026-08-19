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
| First-party outbox publisher | ✓ | ✓ |
| Persistent across restarts | — | ✓ (Redis) |
| Multi-process consumption | — | ✓ |
| Delayed/scheduled jobs | ✓ | ✓, including `scheduledFor` |
| Current status | ✓ | ✓, for registered job types |
| Transition history | Process lifetime | — |
| Retry/backoff | ✓ | ✓ |
| Handler timeout | Cooperative via `ctx.signal` | — |
| Idempotency/dedupe | Job-type-scoped global/tenant dedupe | Redis-backed, job-type-scoped global/tenant dedupe |
| DLQ service helpers | ✓ | — |
| Automatic graceful shutdown | ✓ | ✓ |
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
- `JobsModule.forBullMQ()` registers declared job types during module construction. Consumption and `getJob()` status lookup therefore work after an application/backend restart for those queues; undeclared queues are not discovered by scanning Redis.
- `scheduledFor` is supported and takes precedence over `delayMs`, which takes precedence over `delay`. Past times run without delay.
- Fixed and exponential package backoff policies run through the BullMQ worker strategy, including `maxDelayMs` and bounded symmetric `jitter`.
- Context, metadata, schedule, idempotency, dedupe, and backoff lineage are stored in a versioned job envelope and restored after restart.
- `enqueueDetailed()` returns created-vs-deduped results backed by Redis. `idempotencyKey` and dedupe keys are scoped to a job type; dedupe supports global or tenant scope and `while_active` / `until_completed` modes.
- `while_active` releases at a terminal state. `until_completed` starts its optional TTL at that transition. Conflicting supplied identities fail with `jobs_identity_conflict` instead of replacing a mapping.
- Handler timeout is not implemented; supplying `timeoutMs` fails with `jobs_capability_unsupported`.
- Tenant fairness is **not implemented** in the BullMQ backend.
- Fairness-only APIs fail with `jobs_fairness_misconfig` on this backend:
  - `setTenantWeight()`
  - `scheduler()`
- Pull-based backend methods fail with `jobs_capability_unsupported`:
  - `peekWaiting()`
  - `moveToActive()`
- Service-level dead-letter listing, replay, and discard helpers fail with `jobs_capability_unsupported`.
- Durable transition history is unavailable; `getJobHistory()` fails with `jobs_capability_unsupported`.
- Exhausted BullMQ jobs report `failed`; they are not normalized into the in-memory-only `dead_letter` state.
- Nest teardown stops new consumption, drains active handlers and their follow-up enqueues, and closes workers and queues automatically. Repeated close calls are safe.
- Once close begins, enqueue from controllers, pollers, and other external producers fails with `jobs_backend_closed`; only follow-up enqueue from a handler that was already active is allowed during the drain.

```ts
import { readFileSync } from 'node:fs';
import { Injectable, Module } from '@nestjs/common';
import { BullMQBackend, JobHandler, JobsModule } from '@nestarc/jobs';

@Injectable()
class ReportHandler {
  @JobHandler('sendReport')
  async handle(payload: { reportId: string }): Promise<void> {
    console.log(payload.reportId);
  }
}

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

@Module({
  imports: [
    JobsModule.forBullMQ({ backend, jobTypes: ['sendReport'] }),
  ],
  providers: [ReportHandler],
})
export class JobsBackendModule {}
```

Use TLS with certificate verification and workload-specific Redis ACL credentials in production. A plaintext connection is appropriate only for an explicitly local/test Redis instance inside the same trusted boundary. Every declared worker job type needs a matching `@JobHandler()` provider; otherwise queued work fails with `jobs_handler_not_found`. `JobsModule` closes the registered backend during Nest teardown; call `app.enableShutdownHooks()` in the process bootstrap when `SIGTERM` or other operating-system signals must initiate that lifecycle.

For delayed work, pass `scheduledFor` directly or use relative `delayMs` / `delay`. The same public fixed/exponential `backoff` shape works across both backends.

## Migration plan

Many teams start with `forInMemory` for early development, then switch to `forBullMQ` when they need persistence and multi-process consumption. The handler interface (`@JobHandler`, payload + ctx signatures) is stable across backends, so the switch is a module-registration change plus a Redis deployment — not a handler rewrite.

Switching to BullMQ drops tenant fairness, cooperative handler timeout, transition history, and the in-memory DLQ service helpers. Scheduling, retry/backoff, current status, and idempotency/dedupe remain available and become Redis-backed.

## Upgrading a BullMQ deployment from 0.2

Version 0.3 workers can read already queued 0.2 work, but mixed 0.2/0.3 producers or workers on the same queues are unsupported. Use a coordinated cutover:

1. Stop all 0.2 producers and workers.
2. Deploy 0.3 to every producer and worker.
3. Resume production only after every process runs 0.3.

Version 0.3 rejects BullMQ namespaces containing `.`. If an existing deployment has a dotted namespace, drain or explicitly migrate its queues and choose a dot-free namespace before starting 0.3; changing the namespace changes queue names and the Redis identity keyspace. Dots in job types remain supported.

If 0.2 reused one raw idempotency key across multiple job-type queues, 0.3 can adopt each queued job independently, but direct ID-only lookup of those already duplicated raw IDs remains ambiguous. Drain or rename them before cutover when unambiguous lookup is required.
