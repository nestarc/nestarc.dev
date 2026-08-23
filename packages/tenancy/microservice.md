---
description: "Propagate tenant context across NestJS microservices with propagateTenantHeaders() — works with any HTTP client."
---

# Microservice Propagation

Forward the current tenant context to downstream services using `propagateTenantHeaders()`. Works with any HTTP client — zero dependencies.

```typescript
import { propagateTenantHeaders } from '@nestarc/tenancy';

// With fetch
const res = await fetch('http://orders-service/api/orders', {
  headers: { 'Content-Type': 'application/json', ...propagateTenantHeaders() },
});

// With axios
const res = await axios.get('http://orders-service/api/orders', {
  headers: propagateTenantHeaders(),
});

// With @nestjs/axios HttpService
this.httpService.get('http://orders-service/api/orders', {
  headers: propagateTenantHeaders(),
});
```

By default, the function uses `X-Tenant-Id` as the header name. Pass a custom name if needed:

```typescript
propagateTenantHeaders('X-Custom-Tenant'); // { 'X-Custom-Tenant': 'tenant-abc' }
```

Returns an empty object `{}` when no tenant context is available (e.g., outside a request or inside `withoutTenant()`).

> **How it works:** `propagateTenantHeaders()` reads from the same static `AsyncLocalStorage` used by `TenancyContext`. No dependency injection required — it works anywhere in the call stack.

For more control, use `HttpTenantPropagator` directly:

```typescript
import { HttpTenantPropagator, TenancyContext } from '@nestarc/tenancy';

const propagator = new HttpTenantPropagator(new TenancyContext(), {
  headerName: 'X-Tenant-Id',
});
const headers = propagator.getHeaders(); // { 'X-Tenant-Id': 'tenant-abc' }
```

## Message Queue & RPC Propagation

Transport-specific propagators for Bull, Kafka, and gRPC. All use structural typing with zero runtime dependencies on transport packages.

### Bull (BullMQ)

```typescript
import { BullTenantPropagator, TenancyContext } from '@nestarc/tenancy';

const propagator = new BullTenantPropagator(new TenancyContext());

// Producer: inject tenant into job data
await queue.add('process-order', propagator.inject({ orderId: '123' }));
// → { orderId: '123', __tenantId: 'tenant-abc' }

// Consumer: extract tenant from job data
const tenantId = propagator.extract(job.data); // 'tenant-abc'
```

### Kafka

```typescript
import { KafkaTenantPropagator, TenancyContext } from '@nestarc/tenancy';

const propagator = new KafkaTenantPropagator(new TenancyContext());

// Producer: inject tenant into message headers
await producer.send({
  topic: 'orders',
  messages: [propagator.inject({ value: JSON.stringify(payload) })],
});

// Consumer: extract tenant from message
const tenantId = propagator.extract(message); // handles string & Buffer headers
```

### gRPC

```typescript
import { GrpcTenantPropagator, TenancyContext } from '@nestarc/tenancy';

const propagator = new GrpcTenantPropagator(new TenancyContext());

// Client: inject tenant into metadata
const metadata = new Metadata();
propagator.inject(metadata); // sets 'x-tenant-id' key

// Server: extract tenant from metadata
const tenantId = propagator.extract(call.metadata);
```

## Inbound Context Restoration

`TenantContextInterceptor` automatically restores tenant context from incoming microservice messages. It wraps handler execution in `TenancyContext.run()`.

```typescript
import { TenantContextInterceptor, TenancyContext } from '@nestarc/tenancy';

// Recommended: specify transport explicitly to avoid duck-typing ambiguity
app.useGlobalInterceptors(
  new TenantContextInterceptor(new TenancyContext(), { transport: 'kafka' }),
);
```

Supported transports: `'kafka'` | `'bull'` | `'grpc'`.

> **HTTP is skipped** — `TenantMiddleware` + `TenancyGuard` already handle HTTP tenant extraction. The interceptor is designed for RPC transports only.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `transport` | `'kafka' \| 'bull' \| 'grpc'` | auto-detect | Explicit transport selection (recommended) |
| `kafkaHeaderName` | `string` | `'X-Tenant-Id'` | Kafka message header name |
| `bullDataKey` | `string` | `'__tenantId'` | Bull job data key |
| `grpcMetadataKey` | `string` | `'x-tenant-id'` | gRPC metadata key |

## Missing-context policy

Non-HTTP paths previously had to decide independently what to do when no tenant context was present. Version 0.15 adds one module-level policy for BullMQ, Kafka, gRPC, response cache, Redis, and search integration paths:

```typescript
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  missingContext: { policy: 'warn' }, // 'ignore' | 'warn' | 'throw'
});
```

- `ignore` preserves the earlier silent/pass-through behavior and is the default.
- `warn` reports the missing context and lets the integration use its documented empty result.
- `throw` reports and raises `TenantContextMissingError` before the resource is accessed.

When constructing a propagator directly, inject the configured diagnostics instance and attach a stable, low-cardinality resource name:

```typescript
import {
  BullTenantPropagator,
  TenantContextDiagnostics,
  TenancyContext,
} from '@nestarc/tenancy';

const diagnostics = app.get(TenantContextDiagnostics);
const propagator = new BullTenantPropagator(new TenancyContext(), {
  diagnostics,
  resource: 'orders',
});
```

Both `warn` and `throw` emit `tenant.context_missing`, add the same event to the active OpenTelemetry span, and increment `nestarc.tenancy.missing_context`. The bounded attributes are `tenant.transport`, `tenant.operation`, and optional `tenant.resource`. Reporter failures are isolated from the context decision.

HTTP extraction is intentionally outside this policy because `TenantMiddleware` and `TenancyGuard` already define its fail-closed contract. See [Non-HTTP Resources](./non-http-resources) for Redis keys and vendor-neutral search adapters using the same diagnostics boundary.
