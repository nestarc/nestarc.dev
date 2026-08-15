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

Peer expectations:

- Node.js `>= 20`
- NestJS `^10`
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
import {
  Injectable,
  Module,
  type OnApplicationShutdown,
} from '@nestjs/common';
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

@Injectable()
class BullMQShutdown implements OnApplicationShutdown {
  async onApplicationShutdown(): Promise<void> {
    await backend.close();
  }
}

@Module({
  imports: [
    JobsModule.forBullMQ({ backend, jobTypes: ['deliverWebhook'] }),
  ],
  providers: [WebhookHandler, BullMQShutdown],
})
export class AppModule {}
```

This is the production connection shape. Use a workload-specific Redis ACL user and trusted CA; omit `tls` only for an explicitly local/test instance that does not cross a host or container trust boundary. Call `app.enableShutdownHooks()` during bootstrap so Nest invokes `BullMQShutdown` on `SIGTERM`; otherwise the worker, queue, and Redis sockets remain open after application shutdown.

On the current BullMQ backend, fairness-only APIs (`setTenantWeight`, `scheduler`) and pull-based fairness operations (`peekWaiting`, `moveToActive`) remain unavailable. The current release adds normalized BullMQ status for queues opened by the current producer instance, attempts, numeric delay, and stable job IDs. It does not discover queues from workers or Redis after restart, map `scheduledFor` or the package backoff-policy shape, or add tenant fairness, handler timeout, rich dedupe results, full transition history, or service-level DLQ helpers to this backend.

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
| `jobId` | `string` | Stable job identifier; BullMQ uses it for backend dedupe behavior |
| `context` | `JobContext` | Captured at enqueue, restored before the handler runs |
| `delay` / `delayMs` | `number` | Delay in milliseconds |
| `scheduledFor` | `Date` | In-memory only; for BullMQ calculate and pass `delayMs` |
| `attempts` | `number` | Total attempts; defaults to `1`, so retries are opt-in |
| `backoff` | `BackoffPolicy` | In-memory only in the current release; not mapped to BullMQ's native shape |
| `timeoutMs` | `number` | In-memory only; cooperative handler timeout through `ctx.signal` |
| `idempotencyKey` | `string` | Stable idempotency key; maps to BullMQ `jobId` on that backend |
| `dedupe` | `DedupeOptions` | In-memory global or tenant-scoped dedupe policy |
| `metadata` | `Record<string, unknown>` | In-memory: carried with the job. BullMQ: visible only on the enqueue lifecycle event in this release. |

`enqueue()` keeps returning the job ID for compatibility. On the in-memory backend, use `enqueueDetailed()` when you need to distinguish a newly created job from a deduped result; tenant-scoped dedupe requires `context.tenantId`.

## 5. Inspect lifecycle and exhausted jobs

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

The example above uses the complete in-memory control surface. On BullMQ, omit `timeoutMs` and `backoff`, convert an absolute schedule with `Math.max(scheduledFor.getTime() - Date.now(), 0)`, and pass that number as `delayMs`. `attempts` and stable `idempotencyKey` mapping remain available, but attempts have no documented package-level backoff guarantee. `getJob()` and `getJobHistory()` only search queues opened by `enqueue()` on the current backend instance; after restart or in a worker-only process they return `null`/`[]` until that process enqueues the same job type. Arbitrary `metadata` is not stored in BullMQ job data and is not repeated on start/success/failure events.

Register `events.onEvent` in the module options to observe normalized lifecycle events. When an in-memory job exhausts its attempts, it moves to `dead_letter` by default and can be handled with `listDeadLetters()`, `replayDeadLetter()`, and `discardDeadLetter()`. BullMQ failures normalize to `dead_letter` for status lookup, but the backend does not expose those service-level helpers.

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

Payloads must not contain the reserved key `__nestarcCtx`.
