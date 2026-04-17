---
description: "Keep live and test API keys isolated with @RequireEnvironment — a leaked test key can never charge a live account."
---

# Environments

Every issued key carries an `environment` of either `live` (default) or `test`. The guard rejects requests whose key environment doesn't match the route's requirement with `api_key_environment_mismatch` (HTTP 403).

## Marking a route live-only

```typescript
import { Post, UseGuards } from '@nestjs/common';
import { ApiKeysGuard, RequireEnvironment, RequireScope } from '@nestarc/api-keys';

@UseGuards(ApiKeysGuard)
export class PublishController {
  @Post()
  @RequireEnvironment('live')
  @RequireScope('publish', 'write')
  publish() {
    /* ... */
  }
}
```

Routes without `@RequireEnvironment` accept both environments.

## Issuing a test key

```typescript
await apiKeys.create({
  tenantId: 'tenant_123',
  name: 'Sandbox',
  environment: 'test',
  scopes: [{ resource: 'publish', level: 'write' }],
});
```

The issued key begins with your namespace + `_test_`, making it visually distinguishable in logs and customer dashboards.

## Why bother

Isolating environments at the **key level** (not just at the application config level) means:

- A leaked test key cannot reach live endpoints, even if the same service serves both.
- Customer-facing sandbox traffic can be billed or rate-limited separately without branching at the business logic.
- You can ship "try it out" docs and CLIs that generate test keys on the fly without risk of live-data calls.

A test key hitting a `@RequireEnvironment('live')` route, or a live key hitting a `@RequireEnvironment('test')` route, always fails closed with `api_key_environment_mismatch`.
