---
description: "Install @nestarc/jobs, pick a backend (in-memory or BullMQ), register JobsModule, declare a @JobHandler, and enqueue your first job."
---

# Installation

## 1. Install

```bash
npm install @nestarc/jobs
```

If you use the BullMQ backend, install BullMQ too:

```bash
npm install bullmq
```

If you use the first-party outbox publisher, install `@nestarc/outbox` too:

```bash
npm install @nestarc/outbox
```

Peer expectations:

- Node.js `20`, `22`, or `24`
- NestJS `^10` or `^11`
- BullMQ `^5.74.1` when using `forBullMQ()`
- `@nestarc/outbox ^0.2.0` when using `createOutboxJobsPublisher()`
- `reflect-metadata`
- `rxjs`

## 2. Declare a handler

Any Nest provider method decorated with `@JobHandler(jobType)` will be picked up when the module starts.

```ts
import { Injectable } from '@nestjs/common';
import { JobHandler } from '@nestarc/jobs';

@Injectable()
export class WebhookHandler {
  @JobHandler('deliverWebhook')
  async handle(
    payload: { url: string },
    ctx: { tenantId?: string },
  ): Promise<void> {
    // do work
  }
}
```

If no handler is registered for an enqueued job type, the library throws `jobs_handler_not_found`.

## 3a. Register the in-memory backend

```ts
import { Module } from '@nestjs/common';
import { JobsModule } from '@nestarc/jobs';
import { WebhookHandler } from './webhook.handler';

@Module({
  imports: [
    JobsModule.forInMemory({
      jobTypes: ['deliverWebhook'],
      fairness: { defaultWeight: 1, minSharePct: 0.1 },
      concurrency: { tenantCap: 10 },
    }),
  ],
  providers: [WebhookHandler],
})
export class AppModule {}
```

Workers start automatically when the Nest module initializes. This backend is single-process — use it for a single-replica service, local dev, and tests.

## 3b. Register the BullMQ backend

```ts
import { readFileSync } from 'node:fs';
import { Module } from '@nestjs/common';
import { BullMQBackend, JobsModule } from '@nestarc/jobs';
import { WebhookHandler } from './webhook.handler';

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
    JobsModule.forBullMQ({ backend, jobTypes: ['deliverWebhook'] }),
  ],
  providers: [WebhookHandler],
})
export class AppModule {}
```

This is the production connection shape. Use a workload-specific Redis ACL user and trusted CA; omit `tls` only for an explicitly local/test instance that does not cross a host or container trust boundary. `JobsModule.forBullMQ()` automatically drains active work and closes the worker, queue, and Redis connections during Nest teardown. Call `app.enableShutdownHooks()` during bootstrap when `SIGTERM` must trigger that lifecycle.

`JobsModule.forBullMQ()` registers every declared job type while building the module, so consumption and `getJob()` lookup survive restart for those queues. BullMQ supports `scheduledFor`, package backoff policies, persisted context/metadata, and Redis-backed idempotency/dedupe. Fairness controls, handler timeout, durable transition history, manual drain, and service-level DLQ helpers remain unavailable.

## 4. Enqueue a job

```ts
import { Injectable } from '@nestjs/common';
import { JobsService } from '@nestarc/jobs';

@Injectable()
export class OrdersService {
  constructor(private readonly jobs: JobsService) {}

  async createOrder(dto: CreateOrderDto, tenantId: string) {
    const order = await this.saveOrder(dto);
    await this.jobs.enqueue(
      'deliverWebhook',
      { url: order.webhookUrl },
      { context: { tenantId } },
    );
    return order;
  }
}
```

`EnqueueOptions`:

| Field | Type | Notes |
| --- | --- | --- |
| `jobId` | `string` | Explicit public job ID; empty values are rejected |
| `context` | `JobContext` | Captured at enqueue, restored before the handler runs |
| `delay` / `delayMs` | `number` | Delay in milliseconds |
| `scheduledFor` | `Date` | Absolute target time on both backends; takes precedence over relative delay |
| `attempts` | `number` | Total attempts; defaults to `1`, so retries are opt-in |
| `backoff` | `BackoffPolicy` | Fixed/exponential delay with optional jitter; supported on both backends |
| `timeoutMs` | `number` | In-memory only; cooperative handler timeout through `ctx.signal` |
| `idempotencyKey` | `string` | Stable, job-type-scoped identity; Redis-backed on BullMQ |
| `dedupe` | `DedupeOptions` | Job-type-scoped global or tenant policy; Redis-backed on BullMQ |
| `metadata` | `Record<string, unknown>` | Stored with the job and included in lifecycle events on both backends |

`scheduledFor` takes precedence over `delayMs`, which takes precedence over `delay`; past targets run immediately. `enqueue()` keeps returning the job ID for compatibility. Use `enqueueDetailed()` on either backend when you need to distinguish a newly created job from a deduped result. Tenant-scoped dedupe requires `context.tenantId`.

Identity keys are scoped to a job type. Dedupe defaults to global scope (across tenants of that type) and `until_completed` mode. `while_active` releases only when the job reaches a terminal state; `until_completed` starts its optional TTL at that terminal transition. Conflicting supplied identities fail with `jobs_identity_conflict`.

## 5. Inspect lifecycle and exhausted jobs

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
    key: `delivery:${deliveryId}`,
    scope: 'tenant',
    mode: 'until_completed',
  },
  metadata: { deliveryId },
});

const record = await jobs.getJob(jobId);
```

The same schedule, retry/backoff, idempotency, dedupe, context, and metadata options work on BullMQ. Registered job-type queues are opened during module creation, so `getJob()` can find persisted records after restart without waiting for a new enqueue. Undeclared queues are not discovered by scanning Redis.

Register `events.onEvent` in the module options to observe normalized lifecycle events, including persisted metadata. Only the in-memory backend supports `timeoutMs`, transition history, and DLQ administration:

```ts
const history = await jobs.getJobHistory(jobId);
const failed = await jobs.listDeadLetters({ type: 'deliverWebhook' });
```

On BullMQ, `getJobHistory()`, `timeoutMs`, and DLQ helpers fail with `jobs_capability_unsupported`. An exhausted BullMQ job reports `status: 'failed'`, not the in-memory-only `dead_letter` state.

## 6. Plug in context (optional)

If you already have an ALS-based tenancy or request context, wire it through `contextExtractor` / `contextRunner` so handlers see the same context as the enqueue site:

```ts
JobsModule.forInMemory({
  jobTypes: ['deliverWebhook'],
  contextExtractor: () => ({
    tenantId: tenancy.currentTenantId(),
    requestId: requestScope.currentRequestId(),
  }),
  contextRunner: (ctx, fn) => tenancy.run(ctx, fn),
});
```

Payload and context values must be plain objects. Primitives, arrays, functions, built-ins such as `Date`/`Map`, and class instances are rejected before enqueue. Payload keys `__nestarcCtx` and `__nestarcJob` are reserved.

## 7. Upgrade an existing 0.2 BullMQ deployment

Do not run 0.2 and 0.3 producers or workers against the same queues. Stop every 0.2 process, deploy 0.3 everywhere, and resume only after the coordinated cutover. Version 0.3 can read work already queued by 0.2, but that backward-read support does not make mixed-version rolling operation safe.

BullMQ namespace values may no longer contain `.`. Drain or explicitly migrate queues that use a dotted namespace, then choose a dot-free namespace before starting 0.3. Dots in declared job types remain supported.
