---
description: "FakeJobsService — deterministic tests for job handlers without Redis, with manual drain and full fairness configuration."
---

# Testing

Use `FakeJobsService` when you want deterministic tests for job-producing code **without** standing up Redis. It wires a real `JobsService` on top of an in-memory backend and gives you a manual `drain()` to control when handlers actually run.

## Setup

```ts
import { FakeJobsService } from '@nestarc/jobs';

const fake = new FakeJobsService({
  jobTypes: ['sendReport'],
  tenantCap: 2,
  defaultWeight: 1,
  minSharePct: 0.1,
});

fake.registry.register('sendReport', async (payload, ctx) => {
  expect(ctx.tenantId).toBe('tenant-a');
  expect(payload).toEqual({ userId: 'u1' });
});

await fake.service.enqueue('sendReport', { userId: 'u1' }, {
  context: { tenantId: 'tenant-a' },
});

await fake.drain();
```

## What it gives you

- `fake.service` — a real `JobsService` your production code can receive via DI in tests.
- `fake.registry` — register ad-hoc handler functions per test, no `@JobHandler` needed.
- `fake.drain(maxIterations?)` — alias of `drainUntilIdle()`; run at most 1,000 worker-tick rounds by default and stop earlier when no work is due at the current fake time. Future scheduled jobs and delayed retries remain queued.
- `fake.clock` — advance scheduled work and retry due times without sleeping.
- `fake.drainUntilIdle(maxIterations?)` — use the same bounded loop without polling, sleeping, or advancing the clock. Reaching the iteration cap does not throw, so pass an explicit larger bound and assert final job state when a test queues more than 1,000 sequential due jobs for one job type.

## Patterns

### Asserting the enqueue site

If you only care that your service code calls `jobs.enqueue(...)` with the right arguments, you don't need to register a handler — just assert on what was seen:

```ts
fake.registry.register('sendReport', async (payload, ctx) => {
  expect(payload.userId).toBe('u1');
  expect(ctx.tenantId).toBe('tenant-a');
});

await ordersService.createOrder(dto, 'tenant-a');
await fake.drain();
```

### Testing fairness

You can push jobs for multiple tenants, adjust weights, and drain to verify ordering:

```ts
for (let i = 0; i < 10; i++) {
  await fake.service.enqueue('sendReport', { i }, { context: { tenantId: 'a' } });
  await fake.service.enqueue('sendReport', { i }, { context: { tenantId: 'b' } });
}

fake.service.setTenantWeight('sendReport', 'a', 3);
fake.service.setTenantWeight('sendReport', 'b', 1);

await fake.drain();
// Inspect order your handler recorded — should be weighted ~3:1 in favor of 'a'
```

### Testing schedules and retries

Use `createFakeJobs()` with a fixed `now`, drain the currently due work, advance the clock, and drain again:

```ts
import { createFakeJobs } from '@nestarc/jobs';

const fake = createFakeJobs({
  jobTypes: ['deliverWebhook'],
  now: new Date('2026-08-19T00:00:00.000Z'),
});

fake.registry.register('deliverWebhook', async () => undefined);

const jobId = await fake.service.enqueue(
  'deliverWebhook',
  { deliveryId: 'del_1' },
  { delayMs: 1_000 },
);

await fake.drainUntilIdle();
fake.clock.advanceBy(1_000);
await fake.drainUntilIdle();

expect(await fake.service.getJob(jobId)).toMatchObject({ status: 'succeeded' });
```

When production uses typed runtime defaults, pass the same definitions through `jobs` so the fake applies identical attempts, backoff, and timeout values:

```ts
const fake = createFakeJobs({
  jobs: appJobs,
  jobTypes: Object.keys(appJobs),
});
```

### Why not use BullMQ in tests

BullMQ in tests forces you to manage a real Redis instance, introduces non-determinism (poll intervals, connection state), and is significantly slower than an in-memory run. Reserve it for a small integration suite that verifies the BullMQ backend specifically; use `FakeJobsService` for everything else.
