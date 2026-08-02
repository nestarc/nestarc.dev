---
description: "Configure API key TTL policy, consume audit-safe lifecycle events, and bridge verified ApiKeyContext into request-local infrastructure."
---

# Lifecycle & Context

Version 0.2 added expiration policy, audit-safe lifecycle hooks, and stable helpers for reading or forwarding verified key context.

## TTL policy

```typescript
ApiKeysModule.forRoot({
  namespace: 'acme',
  peppers: { 1: process.env.API_KEY_PEPPER! },
  storage,
  ttlPolicy: {
    defaultExpiresInMs: 90 * 24 * 60 * 60 * 1000,
    maxExpiresInMs: 365 * 24 * 60 * 60 * 1000,
    allowNeverExpires: false,
  },
});
```

| Option | Effect |
| --- | --- |
| `defaultExpiresInMs` | Assigns an expiry when `create()` does not provide one. |
| `maxExpiresInMs` | Rejects an expiry beyond the permitted lifetime. |
| `allowNeverExpires` | When `false`, creation or rotation cannot resolve to `expiresAt: null`. |

An explicit `expiresAt` still passes through the policy. Replacement keys inherit the old expiry unless rotation overrides it.

## Lifecycle events

```typescript
ApiKeysModule.forRoot({
  namespace: 'acme',
  peppers: { 1: process.env.API_KEY_PEPPER! },
  storage,
  emitUsageEvents: false,
  onEvent: async (event) => {
    await auditLog.record(event);
  },
  onEventError: (error, event) => {
    logger.warn({ error, eventType: event.type }, 'API key event sink failed');
  },
});
```

The sink can receive:

| Event | Emitted when |
| --- | --- |
| `api_key.created` | A new key record is inserted. |
| `api_key.revoked` | An existing key is revoked. |
| `api_key.rotated` | A replacement and grace deadline are committed. |
| `api_key.auth_failed` | Credential parsing or verification fails. |
| `api_key.used` | Verification succeeds and `emitUsageEvents` is enabled. |

Raw keys, hashes, and pepper values are never included. Event sink failures are isolated from key operations; report them through `onEventError` and monitor that path independently.

`api_key.used` is disabled by default because it can be high volume. Prefer [verification metrics](./metrics-testing) for aggregate success and latency signals.

## Read verified context in controllers

```typescript
import {
  ApiKeyContext,
  ApiKeysGuard,
  CurrentApiKey,
} from '@nestarc/api-keys';

@UseGuards(ApiKeysGuard)
@Get()
list(@CurrentApiKey() apiKey: ApiKeyContext) {
  return this.reports.listForTenant(apiKey.tenantId);
}
```

`ApiKeyContext` contains:

- `keyId` and the safe lookup `prefix`;
- `tenantId` and `environment`;
- flattened scopes;
- the normalized `allowedIpCidrs` array.

For framework-level code, use `getApiKeyContext(request)`. The stable request property name is exported as `API_KEY_CONTEXT_PROPERTY` and currently resolves to `apiKey`.

## Bridge to tenancy or request-local storage

`contextWriter` runs only after environment, IP, and scope checks pass:

```typescript
ApiKeysModule.forRoot({
  namespace: 'acme',
  peppers: { 1: process.env.API_KEY_PEPPER! },
  storage,
  contextWriter: (apiKey, request) => {
    authenticatedMachineContext.write(request, {
      tenantId: apiKey.tenantId,
      apiKeyId: apiKey.keyId,
    });
  },
});
```

This is the right boundary for tenancy, RLS, or correlation infrastructure that must only see an authorized machine identity.

## RBAC composition

`@nestarc/rbac` can map this context to an `api_key` subject:

```typescript
import { RbacModule } from '@nestarc/rbac';
import { createApiKeySubjectResolver } from '@nestarc/rbac/integrations/api-keys';

RbacModule.forRoot({
  storage: rbacStorage,
  subjectResolver: createApiKeySubjectResolver(),
  tenant: { requiredByDefault: true },
});
```

Run `ApiKeysGuard` before `RbacGuard`. API key scopes limit capabilities embedded in the credential; RBAC permissions evaluate role bindings for the key id. When both are required, both must pass.
