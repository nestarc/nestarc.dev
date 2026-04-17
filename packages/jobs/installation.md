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
import { Module } from '@nestjs/common';
import { BullMQBackend, JobsModule } from '@nestarc/jobs';
import { WebhookHandler } from './webhook.handler';

const backend = new BullMQBackend({
  namespace: 'acme',
  connection: { url: process.env.REDIS_URL! },
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

In `0.1.0` fairness-only APIs (`setTenantWeight`, `scheduler`) and pull-based inspection (`peekWaiting`, `moveToActive`) throw on this backend.

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
| `jobId` | `string` | Stable id (BullMQ dedupes on it) |
| `context` | `JobContext` | Captured at enqueue, restored before the handler runs |
| `delay` | `number` | Milliseconds; BullMQ only |
| `attempts` | `number` | BullMQ only |

## 5. Plug in context (optional)

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
