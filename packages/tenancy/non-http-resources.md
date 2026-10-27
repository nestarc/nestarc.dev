---
description: "Prevent cross-tenant Redis and search access with TenantResourceKey, TenantSearch, and the shared non-HTTP missing-context policy."
---

# Non-HTTP Resources

PostgreSQL RLS protects database rows, not cache entries, Redis keys, search indexes, queues, or external services. Version 0.15 adds small tenant-scoping boundaries for resources that sit outside PostgreSQL.

## Configure the shared policy

Start with one module-level missing-context policy:

```typescript
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  missingContext: {
    policy: 'throw', // 'ignore' | 'warn' | 'throw'
    onMissing: (diagnostic) => logger.warn(diagnostic),
  },
});
```

`ignore` keeps the pre-0.15 behavior. `warn` emits diagnostics but returns the integration's safe empty result. `throw` emits diagnostics and then raises `TenantContextMissingError`. Resolve `TenantContextDiagnostics` from Nest and pass it to helpers you construct manually.

## Collision-safe Redis keys

`TenantResourceKey` prefixes opaque resource keys with a length-delimited tenant ID, avoiding collisions even when tenant IDs contain the configured separator:

```typescript
import {
  TenantContextDiagnostics,
  TenantResourceKey,
  TenancyContext,
} from '@nestarc/tenancy';

const keys = new TenantResourceKey(new TenancyContext(), {
  transport: 'redis',
  resource: 'response-cache',
  diagnostics: app.get(TenantContextDiagnostics),
});

const key = keys.create(`products:${productId}`);
if (key !== null) {
  await redis.set(key, JSON.stringify(product));
}
```

The default form is `tenant:{tenantIdLength}:{tenantId}:{key}`. When context is missing, `create()` returns `null` under `ignore` or `warn`; under `throw`, it fails before Redis is called. Never fall back from `null` to the original unscoped key.

### Migrating tenant resource key separators

From **0.16.2**, `separator` must contain at least one non-digit character. The constructor rejects an empty string or a value made entirely of ASCII digits (`0`–`9`), because those values make the decimal tenant-length boundary ambiguous. This is a configuration `Error`, raised before generating a key even when the missing-context policy is `ignore` or `warn`:

```text
[TenantResourceKey] separator must contain at least one non-digit character
```

Use the default `:` or a valid custom separator such as `|` or `1:`. Existing valid separators preserve their exact key format; the default `:` requires no key migration.

For a deployment using a rejected separator:

1. Choose a valid separator and update every reader and writer for the affected namespace, including workers, before upgrading tenancy.
2. Stop old readers and writers as part of a coordinated cutover. Never fall back to an ambiguous old key when a new key is missing.
3. Invalidate only the affected disposable cache namespace, then rebuild it from tenant-authorized data. For durable resources, migrate from records with independently verified tenant ownership. An ambiguous key cannot establish its original owner: do not split or bulk-rename those keys to infer a tenant, and do not clear unrelated data.
4. Verify that two tenants using the same logical resource key receive separate values. Retire the old namespace using the application's retention process.

This change applies to `TenantResourceKey`. `TenantCacheInterceptor` already uses a fixed colon in its tenant-length prefix and is unaffected. See the [0.16.2 deployment sequence](./migration#upgrade-to-0-16-2) for the accompanying runtime and HTTP parser updates, and the [release migration source](https://github.com/nestarc/nestjs-tenancy/blob/v0.16.2/docs/integrations.md#migrating-tenant-resource-key-separators).

## Tenant-scoped search

`TenantSearch` is a vendor-neutral boundary. It resolves the tenant first and only then calls your adapter with both `tenantId` and `index`:

```typescript
import {
  TenantContextDiagnostics,
  TenantSearch,
  type TenantSearchAdapter,
  TenancyContext,
} from '@nestarc/tenancy';

type ProductQuery = { text: string };
type ProductHit = { id: string; name: string };

const adapter: TenantSearchAdapter<ProductQuery, ProductHit[]> = {
  async search(scope, query) {
    return searchClient.search({
      index: scope.index,
      filter: { tenantId: scope.tenantId },
      query: query.text,
    });
  },
};

const products = new TenantSearch(new TenancyContext(), adapter, {
  index: 'products',
  diagnostics: app.get(TenantContextDiagnostics),
});

const hits = await products.search({ text: 'chair' });
```

The adapter is never invoked without tenant context. `search()` returns `null` under `ignore` or `warn`, and throws under `throw`. The adapter remains responsible for applying both scope fields to the vendor query; cover that mapping with integration tests against the real search service.

## Operational guidance

- Use stable queue, topic, cache, service, or index names for `resource`; never put tenant IDs, raw keys, URLs, or request paths into telemetry labels.
- Treat missing-context counters as deployment signals, but use `throw` on paths where an unscoped fallback could expose or overwrite another tenant's data.
- Keep authorization separate. Tenant-scoped resource names prevent collisions; they do not prove the caller may access that tenant.
- Exercise producer and consumer paths independently. A correctly scoped producer does not protect a consumer that accepts raw, unscoped messages.

See [Microservice Propagation](./microservice) for BullMQ, Kafka, and gRPC integration and [Tenant-Aware Caching](./caching) for Nest response caching.
