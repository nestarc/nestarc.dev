---
description: "Export low-cardinality API key verification metrics and create realistic integration-test credentials with createTestKey()."
---

# Metrics & Testing

Version 0.3 adds an optional verification metric sink and a public helper for integration tests. Both use the same public service path as production code.

## Verification metrics

`onMetric` receives one `api_key.verification` measurement for every `ApiKeysService.verify()` call:

```typescript
ApiKeysModule.forRoot({
  namespace: 'acme',
  peppers: { 1: process.env.API_KEY_PEPPER! },
  storage,
  onMetric: (metric) => {
    apiKeyVerificationCounter.add(1, {
      outcome: metric.outcome,
      environment: metric.environment ?? 'unknown',
    });
    apiKeyVerificationDuration.record(metric.durationMs, {
      outcome: metric.outcome,
    });
  },
  onMetricError: (error, metric) => {
    logger.warn({ error, outcome: metric.outcome }, 'API key metric sink failed');
  },
});
```

Each payload contains only:

- `type: 'api_key.verification'`;
- `outcome`;
- `durationMs` from a monotonic clock;
- optional `environment`, when a record was found.

Supported outcomes are `success`, `malformed`, `invalid`, `revoked`, `expired`, and `error`.

Key material, hashes, peppers, prefixes, key ids, tenant ids, scopes, client IPs, and route paths are deliberately excluded. That keeps labels bounded and prevents authentication telemetry from becoming a credential or tenant-data leak.

Metric sink errors never fail authentication. Use `onMetricError` to observe a broken exporter without coupling its availability to the request path.

::: info Verification and authorization boundaries
Version 0.4 separates credential verification from request policy. `authorizeRequest()`/`ApiKeysGuard` use `onAuthorizationMetric` for `api_key.authorization`, including `missing`, `credential_rejected`, `environment_denied`, `ip_denied`, and `scope_denied` outcomes. Policy denials also emit `api_key.authorization_denied`; they do not touch `lastUsedAt` or emit `api_key.used`. `onMetric` remains the credential-verification sink. Create/rotate prefix exhaustion emits `api_key.operation` through `onOperationMetric` with a fixed three-attempt count.
:::

## Create test credentials

`createTestKey()` creates a key and verifies it through the public service API:

```typescript
import { createTestKey } from '@nestarc/api-keys';

const fixture = await createTestKey(apiKeys, {
  tenantId: 'tenant_fixture',
  scopes: [{ resource: 'reports', level: 'read' }],
});

expect(fixture.context.tenantId).toBe('tenant_fixture');

await request(app.getHttpServer())
  .get('/reports')
  .set('Authorization', `Bearer ${fixture.key}`)
  .expect(200);
```

Defaults are intentionally test-oriented:

| Field | Default |
| --- | --- |
| `tenantId` | `tenant_test` |
| `name` | `Test API key` |
| `environment` | `test` |
| `scopes` | `test:write` |

You can also pass `expiresAt`, `createdBy`, and `allowedIpCidrs`.

`createTestKey()` calls the service directly, so its returned context proves creation and cryptographic verification. Test IP, environment, and scope enforcement through an HTTP request guarded by `ApiKeysGuard`.

## RBAC integration test

When composing API keys with RBAC, keep guard order explicit:

```typescript
@UseGuards(ApiKeysGuard, RbacGuard)
@RequireScope('reports', 'read')
@Can('reports.read', { tenant: 'required' })
@Get()
listReports() {}
```

Create the API key fixture, assign an RBAC role to `fixture.context.keyId`, and assert both allowed and denied paths. The package's own 0.3 compatibility suite verifies that `createApiKeySubjectResolver()` maps the guard context to an `api_key` subject.

For microbenchmark and timing-compensation coverage, see [Benchmark](./benchmark).

## Verify a custom storage adapter

The root-exported `runApiKeyStorageContract()` works without Jest globals or Prisma:

```typescript
import { runApiKeyStorageContract } from '@nestarc/api-keys';

await runApiKeyStorageContract({
  name: 'CustomStorage',
  createStorage: async () => createIsolatedTestStorage(),
  disposeStorage: async () => cleanUpTestStorage(),
});
```

The application-owned factories must use disposable test data. The runner checks required methods, deterministic lists, detached Date/array values, terminal rotation rules, and concurrent single-winner rotation. It tests tenant-bound capabilities when implemented and throws `ApiKeyStorageContractError` on failure.
