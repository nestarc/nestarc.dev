---
description: "Carry tenantId, requestId, and traces from the enqueue site into the job handler through contextExtractor and contextRunner."
---

# Context Propagation

A handler runs **later**, in a worker, after the request that enqueued it has already returned. That makes it easy to lose context — tenant, request id, trace, user — unless you capture it at enqueue time and restore it before the handler runs.

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

On BullMQ, version 0.3 stores the context in a versioned Redis envelope. A worker registered for that job type restores the same context even when it consumes the job after an application restart.

## Plugging in an ALS

For `@nestarc/tenancy`, use `TenancyContext.getCurrentTenantId()` at enqueue time and `new TenancyContext().run(tenantId, fn)` in the worker. This tenant-required example rejects missing context instead of processing a tenant job globally:

```ts
import { JobsModule } from '@nestarc/jobs';
import { TenancyContext } from '@nestarc/tenancy';

const tenancyContext = new TenancyContext();

JobsModule.forInMemory({
  jobTypes: ['sendReport'],
  contextExtractor: () => {
    const tenantId = TenancyContext.getCurrentTenantId();
    if (!tenantId) throw new Error('Tenant context is required');
    return { tenantId };
  },
  contextRunner: async (ctx, fn) => {
    if (!ctx.tenantId) throw new Error('Tenant context is required');
    return tenancyContext.run(ctx.tenantId, fn);
  },
});
```

The same hooks work with `JobsModule.forBullMQ()`. Authenticate and authorize the tenant before enqueueing; a caller-supplied `context.tenantId` is not authorization. Restore request IDs or traces through your application's own context runner if needed. Intentional system jobs need a separately defined policy for absent tenants.

## Serializable object boundary

Payload and context roots must be plain objects. Root primitives, arrays, functions, built-ins such as `Date`/`Map`, and class instances are rejected before enqueue. Nested arrays and JSON values are supported; valid nested Dates become ISO strings in 0.4 on both backends.

Payloads must not contain `__nestarcCtx` or `__nestarcJob`. Both are reserved for the internal context and BullMQ persistence envelopes; the library throws `jobs_reserved_payload_key` at enqueue time. Keep contextual data in `opts.context` (or your extractor), not inside the payload.

## Why this matters for `@nestarc/tenancy`

`TenancyContext.run()` restores the tenant in AsyncLocalStorage; it does not itself configure a database connection. The handler must use the configured tenancy Prisma extension or `tenancyTransaction()` so the canonical `app.current_tenant` setting is applied in the database transaction. PostgreSQL RLS then enforces the policy for that tenant. A raw Prisma client, missing RLS policy, or bypass-capable database role does not gain isolation from job context alone. Follow [Tenancy installation](/packages/tenancy/installation) for that setup.

## Portable values in 0.4

Payload, context, and metadata are snapshotted and normalized before admission. Nested Dates become ISO strings; unsupported class/binary values, accessors, cycles, and non-finite numbers fail with `jobs_serialization_invalid`. Keep roots as plain records, convert non-JSON values explicitly, and observe the 1 MiB/64-level limits. The non-enumerable handler `context.signal` remains a runtime-only abort signal.
