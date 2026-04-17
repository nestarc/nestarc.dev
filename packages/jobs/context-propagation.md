---
description: "Carry tenantId, requestId, and traces from the enqueue site into the job handler through contextExtractor and contextRunner."
---

# Context Propagation

A handler runs **later**, on a worker thread, after the request that enqueued it has already returned. That makes it easy to lose context — tenant, request id, trace, user — unless you capture it at enqueue time and restore it before the handler runs.

`@nestarc/jobs` handles this automatically through two hooks.

## The default path

Without any configuration, `jobs.enqueue(type, payload, { context })` captures whatever you pass in `opts.context` and attaches it to the job under an internal reserved key. When the worker picks the job up, it restores that context before invoking your handler:

```ts
await jobs.enqueue(
  'sendReport',
  { userId: 'u1' },
  { context: { tenantId: 'tenant-a', requestId: 'req-42' } },
);
```

```ts
@JobHandler('sendReport')
async handle(
  payload: { userId: string },
  ctx: { tenantId?: string; requestId?: string },
) {
  // ctx === { tenantId: 'tenant-a', requestId: 'req-42' }
}
```

If you never provide a context, the default is `{}`.

## Plugging in an ALS

The manual approach works, but you probably already have an ALS-based tenancy or request scope. Wire it in via `contextExtractor` + `contextRunner` so enqueue sites don't have to remember to pass context:

```ts
JobsModule.forInMemory({
  jobTypes: ['sendReport'],
  contextExtractor: () => ({
    tenantId: tenancy.currentTenantId(),
    requestId: requestScope.currentRequestId(),
  }),
  contextRunner: (ctx, fn) => tenancy.run(ctx, fn),
});
```

Now any `jobs.enqueue(...)` call that happens inside an active request picks up `tenantId` and `requestId` automatically — and the handler sees the same ALS values, not just a plain `ctx` object, because `contextRunner` re-enters the ALS before calling it.

## Reserved key

Payloads must not contain the reserved key `__nestarcCtx`. If one does, the library throws `jobs_reserved_payload_key` at enqueue time — don't try to store contextual data inside the payload; use `opts.context` (or your extractor) instead.

## Why this matters for `@nestarc/tenancy`

`@nestarc/tenancy` sets `app.current_tenant` on the PostgreSQL session, and RLS policies read from that. If you enqueue a job and the handler runs without restoring the tenant, **RLS will either reject the query or return an empty set** — both hard to debug. Wiring `contextRunner: (ctx, fn) => tenancy.run(ctx, fn)` closes that loop: the job's Prisma queries execute under the same tenant that enqueued the work.
