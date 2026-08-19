---
description: "Tenant-aware background jobs for NestJS — weighted tenant fairness in-memory, BullMQ-backed workers, lifecycle status, retry, idempotency, and outbox integration."
---

<script setup>
import PackageVersion from '../../.vitepress/theme/components/PackageVersion.vue'
</script>

# @nestarc/jobs

Tenant-aware background jobs for NestJS. `@nestarc/jobs` gives you two backends behind a single `JobsService`: an in-memory scheduler with **weighted tenant fairness** for single-process apps and tests, and a Redis-backed BullMQ worker for production. Both restore request context via an ALS-style pluggable runner, discover handlers through Nest provider scanning, and expose a normalized lifecycle surface.

::: tip Current release
Current package version: <PackageVersion slug="jobs" />

Version 0.3 stabilizes the production BullMQ path. Declared job types are registered when `JobsModule.forBullMQ()` is created, so consumption and status lookup survive application restarts. BullMQ now persists context, metadata, schedules, and identity lineage; supports `scheduledFor`, fixed/exponential backoff, Redis-backed idempotency and global/tenant dedupe; and drains active handlers before closing workers and queues during Nest shutdown. It also adds the first-party `createOutboxJobsPublisher()` adapter for `@nestarc/outbox`.
:::

## Features

- **`JobsModule.forInMemory()`** — single-process backend with weighted tenant fairness and starvation protection.
- **`JobsModule.forBullMQ()`** — Redis-backed queues using BullMQ's standard `Worker`.
- **`@JobHandler()` discovery** — decorate methods on any Nest provider; the module wires them automatically.
- **Context propagation** — plug in `contextExtractor` / `contextRunner` to carry `tenantId`, `requestId`, or anything else into handlers.
- **First-party outbox publisher** — `createOutboxJobsPublisher()` connects the `@nestarc/outbox` publisher transport directly to jobs with stable event identity and lineage.
- **Legacy generic bridge** — `JobsOutboxBridge` remains available for sources that expose `OutboxSource.onEvent()`.
- **`FakeJobsService`** — deterministic tests without Redis.
- **Typed contracts** — `defineJobs()`, `job()`, and `TypedJobsService` add optional payload/context/result typing without removing the string-based API.
- **Lifecycle status** — query current status with `getJob()` on both backends and observe normalized lifecycle events; durable transition history remains out of scope for BullMQ.
- **Delivery controls** — opt into absolute or relative scheduling, retry/backoff, stable idempotency keys, and job-type-scoped global/tenant dedupe on both backends.
- **Dead-letter operations** — list, replay, or discard exhausted in-memory jobs.
- **Typed errors** — `JobsError` with stable codes.

## Backend matrix

| Capability | In-memory | BullMQ |
| --- | --- | --- |
| Automatic worker startup in `JobsModule` | ✓ | ✓ |
| Tenant fairness | ✓ | — |
| Per-tenant weight control | ✓ | — |
| ALS/context propagation | ✓ | ✓ |
| `@JobHandler()` discovery | ✓ | ✓ |
| First-party outbox publisher | ✓ | ✓ |
| Delayed / `scheduledFor` jobs | ✓ | ✓ |
| Current status | ✓ | ✓, for registered job types |
| Transition history | Process lifetime | — |
| Retry/backoff | ✓ | ✓ |
| Handler timeout | Cooperative via `ctx.signal` | — |
| Idempotency/dedupe | Job-type-scoped global/tenant dedupe | Redis-backed, job-type-scoped global/tenant dedupe |
| DLQ service helpers | ✓ | — |
| Automatic graceful shutdown | ✓ | ✓ |
| `FakeJobsService` support | ✓, with deterministic clock | N/A |

## Requirements

- Node.js `20`, `22`, or `24`
- NestJS `^10` or `^11`
- `reflect-metadata`, `rxjs`
- BullMQ `^5.74.1` (only when using `forBullMQ()`)
- `@nestarc/outbox ^0.2.0` (only when using `createOutboxJobsPublisher()`)

## Quickstart: In-memory with tenant fairness

```ts
import 'reflect-metadata';
import { Injectable, Module } from '@nestjs/common';
import { JobHandler, JobsModule } from '@nestarc/jobs';

@Injectable()
class ReportHandler {
  @JobHandler('sendReport')
  async handle(
    payload: { userId: string },
    ctx: { tenantId?: string },
  ): Promise<void> {
    console.log('tenant', ctx.tenantId, 'user', payload.userId);
  }
}

@Module({
  imports: [
    JobsModule.forInMemory({
      jobTypes: ['sendReport'],
      fairness: { defaultWeight: 1, minSharePct: 0.1 },
      concurrency: { tenantCap: 10 },
    }),
  ],
  providers: [ReportHandler],
})
export class AppModule {}
```

Enqueue with context:

```ts
await jobs.enqueue('sendReport', { userId: 'u1' }, {
  context: { tenantId: 'tenant-a' },
});
```

Weights can be tuned at runtime so paying tenants get more worker slots:

```ts
jobs.setTenantWeight('sendReport', 'enterprise-tenant', 3);
jobs.setTenantWeight('sendReport', 'free-tenant', 1);
```

## Quickstart: BullMQ backend

```ts
import 'reflect-metadata';
import { readFileSync } from 'node:fs';
import { Injectable, Module } from '@nestjs/common';
import { BullMQBackend, JobHandler, JobsModule } from '@nestarc/jobs';

@Injectable()
class ReportHandler {
  @JobHandler('sendReport')
  async handle(payload: { userId: string }): Promise<void> {
    console.log(payload.userId);
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
export class AppModule {}
```

The snippet is the production baseline: use workload-specific ACL credentials and a trusted CA. Omit `tls` only for an explicitly local/test Redis instance that never crosses a host or container trust boundary. `JobsModule.forBullMQ()` stops new consumption, waits for active handlers (including their follow-up enqueues), and closes workers and queues automatically during Nest teardown. Call `app.enableShutdownHooks()` during bootstrap if operating-system signals such as `SIGTERM` must trigger that lifecycle.

That drain allowance is limited to follow-up enqueue calls made by handlers that were already active when close began. New enqueue calls from controllers, pollers, or other external producers are rejected with `jobs_backend_closed` once the backend is closing, and all enqueue calls are rejected after it is closed. Quiesce those producers before application teardown.

BullMQ jobs remain FIFO without package-level tenant fairness. Version 0.3 registers every declared `jobType` up front, restores persisted context and metadata after restart, applies `scheduledFor` and the package's fixed/exponential backoff policies, and returns created-vs-deduped results backed by Redis identity mappings. Status lookup searches those registered queues; it does not scan Redis for undeclared job types. Handler timeout, durable transition history, pull/manual-drain operations, and service-level DLQ helpers remain unavailable.

## Status, retry, idempotency, and lifecycle

Retries are opt-in (`attempts` defaults to `1`). The following scheduling, backoff, identity, and current-status flow works on both backends:

```ts
const jobId = await jobs.enqueue('deliverWebhook', payload, {
  context: { tenantId },
  scheduledFor,
  attempts: 5,
  backoff: {
    type: 'exponential',
    delayMs: 1_000,
    maxDelayMs: 60_000,
  },
  idempotencyKey: deliveryId,
  dedupe: {
    key: `webhook:${deliveryId}`,
    scope: 'tenant',
    mode: 'until_completed',
  },
  metadata: { deliveryId },
});

const record = await jobs.getJob(jobId);
```

`scheduledFor` takes precedence over `delayMs`, which takes precedence over `delay`; a past target runs without delay. Both backends evaluate fixed/exponential policies, including `maxDelayMs` and bounded symmetric `jitter`. `enqueueDetailed()` reports `created` or `deduped` on either backend, and tenant-scoped dedupe requires `context.tenantId`.

Identity and dedupe keys are scoped to a job type; `scope: 'global'` means across tenants of that type. `while_active` releases at a terminal state. `until_completed` retains the identity after completion and starts its optional TTL from that terminal transition. If supplied identities already point to different jobs, enqueue fails with `jobs_identity_conflict` rather than replacing either mapping.

Configure `events.onEvent` on the module for normalized lifecycle events. Observer failures cannot change enqueue or handler outcomes. BullMQ emits retry events after Redis schedules the retry; while it is delayed, `getJob()` reports the actual Redis due time through `scheduledFor` and `nextAttemptAt`, and terminal failures have status `failed`.

Only the in-memory backend supports cooperative `timeoutMs`, `getJobHistory()`, and `listDeadLetters()` / `replayDeadLetter()` / `discardDeadLetter()`. Calling those unsupported operations on BullMQ fails with `jobs_capability_unsupported` instead of returning synthetic results.

::: warning Idempotency boundary
Idempotency and dedupe reduce duplicate enqueue operations; they do not guarantee exactly-once external side effects. Keep handlers idempotent before enabling retries.
:::

## Upgrading from 0.2

BullMQ deployments require a coordinated cutover. Stop every 0.2 producer and worker before starting 0.3; mixed 0.2/0.3 processes on the same queues are unsupported. Version 0.3 can read already queued 0.2 jobs after that cutover, but this backward read does not make a rolling upgrade safe.

- BullMQ namespaces may no longer contain `.`. Drain or explicitly migrate a dotted-namespace deployment and choose a dot-free namespace before starting 0.3. Dots in job types remain supported.
- Generated BullMQ IDs for `idempotencyKey` are now queue-scoped hashes. Explicit `jobId` values retain their public value but now take a namespace-wide claim; reusing one ID for a different job-type queue fails with `jobs_identity_conflict` instead of creating another job.
- `getRawQueue()` now defaults to the narrowed `BullMQRawQueue` contract. Code that intentionally uses the full BullMQ API must opt in with `backend.getRawQueue<import('bullmq').Queue>(jobType)` and accept that direct BullMQ coupling.
- In-memory idempotency and dedupe identities are now scoped per job type and honor terminal mode/TTL release, so work previously suppressed by an unrelated job type may now enqueue.
- Decorated typed handlers use `handle(payload, context)`, matching the runtime invocation.
- Payloads and contexts must be plain objects. Arrays, functions, built-ins such as `Date`/`Map`, and class instances are rejected.
- Both `__nestarcCtx` and `__nestarcJob` are reserved payload keys.

## When to reach for this

- In a single-process deployment, you need the in-memory backend's weighted tenant fairness so one noisy tenant does not starve the rest. BullMQ is durable but currently FIFO without package-level fairness.
- You use `@nestarc/outbox` and want the first-party publisher adapter to preserve event identity and correlation lineage.
- You want the same handler interface across single-process tests (in-memory) and production (BullMQ).

## Next steps

- [Installation](./installation) — module registration, first handler, first enqueue.
- [Backends](./backends) — choosing between in-memory and BullMQ, capability differences.
- [Tenant Fairness](./tenant-fairness) — weighted scheduling, `minSharePct`, runtime tuning.
- [Context Propagation](./context-propagation) — `contextExtractor`, `contextRunner`, reserved keys.
- [Outbox Integration](./outbox-bridge) — first-party `@nestarc/outbox` publisher and the legacy generic bridge.
- [Testing](./testing) — `FakeJobsService` and deterministic drain.
- [Benchmark](./benchmark) — queue overhead and weighted-fairness correctness check.
