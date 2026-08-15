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

This release adds typed job contracts, status/history APIs, retry and backoff, in-memory cooperative handler timeouts, idempotency/dedupe options, lifecycle events, and in-memory dead-letter helpers. The BullMQ backend exposes normalized current status, an attempt budget, numeric delay, and stable `jobId` mapping, but it does not map the package backoff policy or absolute `scheduledFor` value and does not provide tenant fairness, handler timeout, rich dedupe results, or service-level DLQ helpers.
:::

## Features

- **`JobsModule.forInMemory()`** — single-process backend with weighted tenant fairness and starvation protection.
- **`JobsModule.forBullMQ()`** — Redis-backed queues using BullMQ's standard `Worker`.
- **`@JobHandler()` discovery** — decorate methods on any Nest provider; the module wires them automatically.
- **Context propagation** — plug in `contextExtractor` / `contextRunner` to carry `tenantId`, `requestId`, or anything else into handlers.
- **`JobsOutboxBridge`** — subscribe to an application-provided `OutboxSource`; `@nestarc/outbox` needs a small handler or publisher adapter.
- **`FakeJobsService`** — deterministic tests without Redis.
- **Typed contracts** — `defineJobs()`, `job()`, and `TypedJobsService` add optional payload/context/result typing without removing the string-based API.
- **Lifecycle status** — query `getJob()` and `getJobHistory()` and observe normalized job lifecycle events.
- **Delivery controls** — opt into retry/backoff, stable idempotency keys, and scoped dedupe on the in-memory backend; BullMQ currently supports attempts and numeric delay but not the package backoff-policy mapping.
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
| Outbox bridge | ✓ | ✓ |
| Status/history API | Full process-local history | Current normalized state + minimal snapshot |
| Retry/backoff | ✓ | Attempts only; package backoff policy is not mapped |
| Handler timeout | Cooperative via `ctx.signal` | — |
| Idempotency/dedupe | Idempotency + global/tenant dedupe | Stable `jobId` mapping only |
| DLQ service helpers | ✓ | — |
| `FakeJobsService` support | ✓, with deterministic clock | N/A |

## Requirements

- NestJS 10
- Node.js `>= 20`
- `reflect-metadata`, `rxjs`
- `bullmq` (only if you use the BullMQ backend)

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
import { Injectable, Module } from '@nestjs/common';
import { BullMQBackend, JobHandler, JobsModule } from '@nestarc/jobs';

@Injectable()
class ReportHandler {
  @JobHandler('sendReport')
  async handle(payload: { userId: string }): Promise<void> {
    console.log(payload.userId);
  }
}

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

@Module({
  imports: [
    JobsModule.forBullMQ({ backend, jobTypes: ['sendReport'] }),
  ],
  providers: [ReportHandler],
})
export class AppModule {}
```

In the current BullMQ backend, jobs are delivered FIFO by BullMQ's worker. Context, normalized status, numeric `delay`/`delayMs`, attempt count, and stable job IDs are available. `scheduledFor` is not converted to a delay, and the package's `{ type, delayMs, maxDelayMs }` backoff shape is not translated to BullMQ's native `{ type, delay }` shape. Tenant fairness, pull-based fairness operations, and service-level DLQ helpers are also unavailable.

## Status, retry, idempotency, and lifecycle

Retries are opt-in (`attempts` defaults to `1`). On the in-memory backend, handler timeout uses cooperative cancellation through `ctx.signal`:

```ts
const jobId = await jobs.enqueue('deliverWebhook', payload, {
  context: { tenantId },
  attempts: 5,
  backoff: {
    type: 'exponential',
    delayMs: 1_000,
    maxDelayMs: 60_000,
  },
  timeoutMs: 30_000,
  idempotencyKey: deliveryId,
});

const record = await jobs.getJob(jobId);
const history = await jobs.getJobHistory(jobId);
```

On the in-memory backend, `enqueueDetailed()` can report whether a job was created or deduped, and tenant-scoped dedupe requires `context.tenantId`. BullMQ maps `idempotencyKey` to a stable job id but does not implement the richer dedupe result. Configure `events.onEvent` on the module for lifecycle events; in-memory emits retry and dead-letter outcomes, while BullMQ emits enqueue, start, success, and failure outcomes.

For BullMQ, calculate an absolute schedule at the call site and pass the result as `delayMs`:

```ts
const delayMs = Math.max(scheduledFor.getTime() - Date.now(), 0);
await jobs.enqueue('deliverWebhook', payload, { delayMs, attempts: 5 });
```

Those attempts retry without a documented package-level backoff guarantee. If delayed retry is required, provide an application-owned backend that deliberately maps your policy to BullMQ options and cover it with an exact-version integration test.

When attempts are exhausted, the in-memory backend moves the job to `dead_letter` by default and supports `listDeadLetters()`, `replayDeadLetter()`, and `discardDeadLetter()`. BullMQ failures normalize to `dead_letter` for status lookup, but those service-level helpers are not exposed by the BullMQ backend.

::: warning Idempotency boundary
Idempotency and dedupe reduce duplicate enqueue operations; they do not guarantee exactly-once external side effects. Keep handlers idempotent before enabling retries.
:::

## When to reach for this

- In a single-process deployment, you need the in-memory backend's weighted tenant fairness so one noisy tenant does not starve the rest. BullMQ is durable but currently FIFO without package-level fairness.
- You use the outbox pattern and can provide the small source, handler, or publisher adapter that preserves your event identity.
- You want the same handler interface across single-process tests (in-memory) and production (BullMQ).

## Next steps

- [Installation](./installation) — module registration, first handler, first enqueue.
- [Backends](./backends) — choosing between in-memory and BullMQ, capability differences.
- [Tenant Fairness](./tenant-fairness) — weighted scheduling, `minSharePct`, runtime tuning.
- [Context Propagation](./context-propagation) — `contextExtractor`, `contextRunner`, reserved keys.
- [Outbox Bridge](./outbox-bridge) — generic source contract and the current `@nestarc/outbox` integration boundary.
- [Testing](./testing) — `FakeJobsService` and deterministic drain.
- [Benchmark](./benchmark) — queue overhead and weighted-fairness correctness check.
