---
description: "Weighted tenant-fair scheduler for the in-memory backend — per-tenant weights, minSharePct starvation protection, and runtime tuning."
---

# Tenant Fairness

The in-memory backend uses a **shard-based scheduler** that guarantees no single tenant can starve the others. This is the core value of `@nestarc/jobs` over a plain FIFO queue.

## What the scheduler does

- **Per-tenant waiting queues** — jobs are partitioned by `ctx.tenantId` at enqueue time.
- **Weighted dispatch** — each tenant gets a share of worker slots proportional to its weight.
- **`minSharePct` starvation protection** — every tenant with pending jobs gets at least this fraction of dispatch cycles, regardless of weight.
- **Per-tenant inflight cap** — no tenant can occupy more than `tenantCap` workers simultaneously.

```ts
JobsModule.forInMemory({
  jobTypes: ['sendReport'],
  fairness: {
    defaultWeight: 1,
    minSharePct: 0.1, // every active tenant gets ≥10% of cycles
  },
  concurrency: {
    tenantCap: 10,   // no tenant can exceed 10 concurrent in-flight jobs
  },
});
```

## Per-tenant weight control

Weights can be tuned at runtime. Paying customers can legitimately get more throughput:

```ts
jobs.setTenantWeight('sendReport', 'enterprise-tenant', 3);
jobs.setTenantWeight('sendReport', 'free-tenant', 1);
```

Weights are per-`jobType`, so a tenant can be heavy-weight on `sendReport` while being equal-weight on `generateThumbnail`.

## Inspecting the scheduler

For lower-level inspection — useful during incidents or capacity reviews:

```ts
const snapshot = jobs.scheduler('sendReport').snapshot();
// snapshot shows per-tenant queue depth, inflight count, current weight
```

## BullMQ caveat

`setTenantWeight()` and `scheduler()` **throw** on the BullMQ backend in `0.1.0`. The BullMQ path is FIFO and does not apply fairness. If you need fairness in production today, run the in-memory backend and scale by **sharding tenants across replicas** rather than by running many BullMQ consumers.

## Designing weights

A few rules of thumb:

- **Don't start with many tiers.** Three tiers (free / pro / enterprise) covers most SaaS shapes.
- **Keep `minSharePct` non-zero** (e.g. `0.05`–`0.1`). Otherwise a large enterprise weight can drown small tenants entirely.
- **`tenantCap` exists to protect the worker pool** — if one tenant's handlers are slow, they can't hold every slot. Set it well below your total worker count.
- **Reassess weights after watching real traffic**, not before. Starting equal and tuning later is almost always safer than guessing.
