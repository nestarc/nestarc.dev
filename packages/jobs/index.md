---
description: "Tenant-aware background jobs for NestJS — weighted tenant fairness in-memory, BullMQ-backed workers for Redis, ALS context propagation, and outbox-to-jobs bridge."
---

# @nestarc/jobs

Tenant-aware background jobs for NestJS. `@nestarc/jobs` gives you two backends behind a single `JobsService`: an in-memory scheduler with **weighted tenant fairness** for single-process apps and tests, and a Redis-backed BullMQ worker for production. Both restore request context via an ALS-style pluggable runner, discover handlers through Nest provider scanning, and integrate with the outbox pattern.

## Features

- **`JobsModule.forInMemory()`** — single-process backend with weighted tenant fairness and starvation protection.
- **`JobsModule.forBullMQ()`** — Redis-backed queues using BullMQ's standard `Worker`.
- **`@JobHandler()` discovery** — decorate methods on any Nest provider; the module wires them automatically.
- **Context propagation** — plug in `contextExtractor` / `contextRunner` to carry `tenantId`, `requestId`, or anything else into handlers.
- **`JobsOutboxBridge`** — subscribe to an outbox source and fan events out as jobs.
- **`FakeJobsService`** — deterministic tests without Redis.
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
| `FakeJobsService` support | ✓ | N/A |

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
  connection: { url: process.env.REDIS_URL! },
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

In `0.1.0` the BullMQ backend delivers jobs FIFO by BullMQ's worker. Context is still restored; tenant fairness is not applied on this backend yet.

## When to reach for this

- One noisy tenant's backlog shouldn't starve every other tenant's jobs.
- You already use the outbox pattern and want events to flow into background processing without inventing a bespoke bridge.
- You want the same handler interface across single-process tests (in-memory) and production (BullMQ).

## Next steps

- [Installation](./installation) — module registration, first handler, first enqueue.
- [Backends](./backends) — choosing between in-memory and BullMQ, capability differences.
- [Tenant Fairness](./tenant-fairness) — weighted scheduling, `minSharePct`, runtime tuning.
- [Context Propagation](./context-propagation) — `contextExtractor`, `contextRunner`, reserved keys.
- [Outbox Bridge](./outbox-bridge) — mapping outbox event types to job types.
- [Testing](./testing) — `FakeJobsService` and deterministic drain.
- [Benchmark](./benchmark) — queue overhead and weighted-fairness correctness check.
