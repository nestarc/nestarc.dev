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
- `fake.drain()` — wait until all currently-enqueued jobs have been processed. Deterministic: it does not poll or time out.

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

### Why not use BullMQ in tests

BullMQ in tests forces you to manage a real Redis instance, introduces non-determinism (poll intervals, connection state), and is significantly slower than an in-memory run. Reserve it for a small integration suite that verifies the BullMQ backend specifically; use `FakeJobsService` for everything else.
