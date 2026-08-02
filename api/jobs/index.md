---
description: "API reference stub for @nestarc/jobs: module registration, handlers, enqueue API, backends, testing, and production notes."
---

# @nestarc/jobs

::: warning Reference status: Curated · Package status: Preview
This page documents the public entry point while generated symbol-level coverage is expanded. The BullMQ backend is FIFO in `0.1.0`; tenant fairness applies only to the in-memory backend.
:::

## Overview

`@nestarc/jobs` provides tenant-aware background jobs for NestJS. It offers an in-memory backend with weighted tenant fairness and a BullMQ backend for Redis-backed workers, both behind the same handler and enqueue API.

Use it when work should leave the request lifecycle but still keep tenant, request, or trace context.

## Installation

```bash
npm install @nestarc/jobs
```

Install BullMQ only if you use the BullMQ backend:

```bash
npm install bullmq
```

## Basic usage

```ts
import { Injectable } from '@nestjs/common';
import { JobHandler } from '@nestarc/jobs';

@Injectable()
export class ReportHandler {
  @JobHandler('sendReport')
  async handle(
    payload: { userId: string },
    ctx: { tenantId?: string },
  ): Promise<void> {
    await this.reports.send(payload.userId, ctx.tenantId);
  }
}
```

```ts
await jobs.enqueue('sendReport', { userId: 'u1' }, {
  context: { tenantId: 'tenant-a' },
});
```

## Configuration

```ts
import { JobsModule } from '@nestarc/jobs';

JobsModule.forInMemory({
  jobTypes: ['sendReport'],
  fairness: { defaultWeight: 1, minSharePct: 0.1 },
  concurrency: { tenantCap: 10 },
});
```

```ts
import { BullMQBackend, JobsModule } from '@nestarc/jobs';

const backend = new BullMQBackend({
  namespace: 'acme',
  connection: { url: process.env.REDIS_URL! },
  workerConcurrency: 10,
});

JobsModule.forBullMQ({ backend, jobTypes: ['sendReport'] });
```

| Option | Applies to | Notes |
|--------|------------|-------|
| `jobTypes` | all backends | Declares accepted job names. |
| `fairness.defaultWeight` | in-memory | Baseline tenant scheduling weight. |
| `fairness.minSharePct` | in-memory | Starvation protection. |
| `concurrency.tenantCap` | in-memory | Per-tenant active job cap. |
| `contextExtractor` | all backends | Captures context at enqueue time. |
| `contextRunner` | all backends | Restores context before handler execution. |
| `backend` | BullMQ | BullMQ backend instance. |

## Public API

| Export | Purpose |
|--------|---------|
| `JobsModule` | Nest module with `forInMemory()` and `forBullMQ()`. |
| `JobsService` | Enqueue jobs and tune supported runtime controls. |
| `JobHandler()` | Decorator that registers provider methods as handlers. |
| `BullMQBackend` | Redis-backed backend using BullMQ workers. |
| `JobsOutboxBridge` | Maps outbox events into jobs. |
| `FakeJobsService` | Deterministic test helper with manual drain. |
| `JobsError` | Stable error type for job failures and misconfiguration. |

## Examples

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

```ts
jobs.setTenantWeight('sendReport', 'enterprise-tenant', 3);
jobs.setTenantWeight('sendReport', 'free-tenant', 1);
```

Useful package guides:

- [Backends](/packages/jobs/backends)
- [Tenant fairness](/packages/jobs/tenant-fairness)
- [Context propagation](/packages/jobs/context-propagation)
- [Testing](/packages/jobs/testing)

## Production notes

- Use the in-memory backend for single-process apps, local development, tests, or tenant-sharded deployments.
- Use BullMQ when you need Redis-backed persistence and multi-process workers.
- In version `0.1.0`, tenant fairness APIs are in-memory only; BullMQ delivery is FIFO.
- Keep contextual data in `opts.context` or `contextExtractor`, not inside the payload reserved key `__nestarcCtx`.
