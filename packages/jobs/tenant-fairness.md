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
- **Due-time isolation** — future scheduled jobs and delayed retries stay outside ready weighted dispatch until due. Equal due times preserve enqueue order, and deferred work does not consume weight or starvation accounting; scheduler `waiting` counts still include it.

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

`setTenantWeight()` and `scheduler()` **throw** on the BullMQ backend. The BullMQ path is FIFO and does not apply tenant fairness, even though it supports scheduling, backoff, status, and Redis-backed identity controls. Use the in-memory backend only where process-local execution fits; otherwise design BullMQ capacity and routing with no package-level tenant weighting guarantee.

## Configuration validation

- `defaultWeight` and `tenantCap` must be positive safe integers.
- `minSharePct` must be finite and within `[0, 1]`.
- Runtime weights must be non-negative safe integers. A weight of `0` receives no normal weighted-round credits, but with `minSharePct > 0` its waiting work remains eligible for starvation/minimum-share dispatch (and can run when it is the only schedulable tenant).

Invalid values fail with `jobs_fairness_misconfig` instead of silently changing scheduler behavior.

## Designing weights

A few rules of thumb:

- **Don't start with many tiers.** Three tiers (free / pro / enterprise) covers most SaaS shapes.
- **Keep `minSharePct` non-zero** (e.g. `0.05`–`0.1`). Otherwise a large enterprise weight can drown small tenants entirely.
- **`tenantCap` exists to protect the worker pool** — if one tenant's handlers are slow, they can't hold every slot. Set it well below your total worker count.
- **Reassess weights after watching real traffic**, not before. Starting equal and tuning later is almost always safer than guessing.

## Shared worker pool in 0.4

`concurrency.poolSize` defaults to 10 across every job type in one in-memory module. `tenantCap` defaults to 10 across those types, and `typeCap` defaults to the pool size for each type. All caps must be positive safe integers. `poolSize: 1` restores the earlier serial behavior.

Weighted selection applies only to eligible tenants and cannot override these caps. A timed-out invocation retains all slots until settlement. Every module/process applies its own local limits; BullMQ `workerConcurrency` is per type and process.

The internal system shard is distinct from every real tenant string; missing tenants appear as `undefined` in picks, snapshots, and lifecycle events.
