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

- Workers start automatically during application bootstrap, after singleton handler discovery and provider initialization complete.
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
- Consumers start only after application-bootstrap handler discovery completes; work queued before `app.init()` waits in Redis.
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

Decorator handlers must be singleton providers with static dependency trees. Request/transient-scoped handlers and singleton handlers that depend on scoped providers fail at bootstrap; use explicit `HandlerRegistry.register()` integration for dynamic resolution. Testing and standalone application contexts must call `app.init()` before expecting either backend to consume.

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

## Upgrading to 0.4

Upgrade Node to `^22.0.0 || ^24.0.0`, optional BullMQ to `^5.76.2`, and Outbox to `^0.2.1 || ^0.3.0`. A composition with tenancy requires Node 22.13+ in the 22.x line or Node 24. Outbox 0.3 has its own mandatory SQL migration.

### Producer and worker roles

```ts
// Separate process registrations, each with its own backend instance.
JobsModule.forBullMQ({ backend, jobTypes: ['sendReport'], role: 'producer' });
JobsModule.forBullMQ({ backend, jobTypes: ['sendReport'], role: 'worker' });
```

The default role is `both`. Producers never discover handlers or create BullMQ Workers. Worker/both roles validate intended handlers at bootstrap. Register before `app.init()`; `dynamicRegistration: true` is an explicit escape hatch whose registration timing the application owns. Worker-only service enqueue is rejected; use `both` for workers that enqueue follow-ups. Every role closes its resources.

### Bounded in-memory execution

```ts
JobsModule.forInMemory({
  jobTypes: ['sendReport', 'buildExport'],
  concurrency: { poolSize: 10, tenantCap: 2, typeCap: 5 },
  shutdown: { timeoutMs: 30_000 },
});
```

`poolSize` defaults to 10 and limits all outstanding handlers in one module. `tenantCap` spans every type in that module, while `typeCap` limits one type. Use `poolSize: 1` for prior serial behavior. These limits are process-local; BullMQ's `workerConcurrency` is per type and process.

Timed-out in-memory handlers emit `job.timed_out` and receive an aborted `ctx.signal`, but retain their slots until the promise settles. Late success does not override timeout failure; retries wait for settlement. Backend transition failures reconcile the same activation/outcome and notify `onWorkerError`; uncertain acknowledgement never triggers a contradictory failure transition.

In-memory shutdown closes admission first: enqueue, dedupe acknowledgement, replay, and handler follow-up enqueue reject with `jobs_backend_closed`. Accepted active, queued, delayed, and retrying work drains within the deadline. If it cannot finish, `app.close()` rejects with `JobsShutdownError` (`jobs_shutdown_incomplete`, remaining IDs/count), keeps admission closed, and continues draining. A later close joins that drain with a new deadline. A never-settling handler prevents completion; standalone backend close cannot run pending handlers and reports `reason: 'pending_jobs'`.

### Portable values and custom backends

Enqueue/default/config validation runs before identity reservation. Invalid options use `jobs_invalid_input`; invalid recursive data uses `jobs_serialization_invalid`. Plain records/arrays and JSON primitives are supported, valid nested Dates become ISO strings, object `undefined` values are omitted, and array holes become null. BigInt, Buffer, Map/Set, class instances, accessors, cycles, invalid dates, non-finite numbers, and reserved payload keys are rejected. Envelope/metadata limits are 1 MiB each and 64 nesting levels. Adapt handlers that expected Date instances.

Custom backends used by `FairWorker` must advertise `activationFencing` and return a fresh opaque activation token from `moveToActive()`. Carry that invocation's token to `ack(jobType, jobId, activationId)` and `fail(jobType, jobId, reason, activationId)`. Stale or illegal completions use `jobs_activation_conflict`; do not read a newer token to complete an older invocation. BullMQ uses its native lock contract instead.

### Operator retention and tenant reads

Retention is disabled by default. Configure `retention: { terminalAgeMs, recoveryHorizonMs, batchSize }` on the module/backend, deriving the recovery horizon from the longest outbox retry and manual replay window. It is a safety floor, not a target to shorten under memory pressure.

Stop all producers and administrative retry/replay writers, wait for idle workers, and call `backend.pruneTerminal({ producersStopped: true })` in bounded passes until it returns zero. This flag asserts application-wide quiescence; it does not stop other processes. Register all relevant BullMQ job types first. Cleanup removes expired terminal data and matching identities while preserving rebound live mappings; do not combine it with raw BullMQ auto-removal. Re-enqueue after identity expiry can execute again.

After authorizing tenant membership, use `jobs.getJobForTenant(jobId, tenantId)`; missing/mismatched records return null. Replay/discard still require separate administrative authorization. These APIs do not provide RBAC.

### Source shutdown and dedupe

The first-party outbox mapper defaults omitted dedupe scope to `tenant` when a tenant exists. Explicit `global` is required to suppress across tenants; generic `JobsService` defaults are unchanged. Mapping callbacks cannot overwrite canonical source identity/lineage.

Stop and settle the source poller before `app.close()` closes Jobs. Outbox still stops in a later Nest lifecycle phase, so roles alone do not fix shutdown in a co-located process. Outbox `SENT` acknowledges enqueue/dedupe, not job completion; source leases and source retry budgets remain Outbox's responsibility. See [the composed workflow](/guide/async-delivery-workflow).

[Official 0.4 release notes](https://github.com/nestarc/jobs/blob/v0.4.0/CHANGELOG.md).
