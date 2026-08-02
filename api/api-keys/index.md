---
description: "API reference for @nestarc/api-keys 0.3: module options, services, guards, storage, rotation, IP policy, events, metrics, and testing exports."
---

# @nestarc/api-keys

::: warning Status: Beta · 0.3.0
The package is published and usable. This curated reference covers the public entry point while generated symbol-level documentation continues to expand.
:::

## Overview

`@nestarc/api-keys` provides tenant-scoped machine authentication for NestJS. Keys use a Stripe-style format, are hashed at rest with versioned peppers, and can carry scopes, live/test environment, expiration, and IP-origin policy.

```bash
npm install @nestarc/api-keys@0.3.0
```

Prisma consumers add the documented model and run their own migration. The 0.3.0 npm tarball does not bundle the repository's example schema, so use the [installation model and upgrade fields](/packages/api-keys/installation#2-add-the-prisma-model) rather than relying on a `node_modules` schema path.

## Module registration

```ts
import { Module } from '@nestjs/common';
import { ApiKeysModule, PrismaApiKeyStorage } from '@nestarc/api-keys';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Module({
  imports: [
    ApiKeysModule.forRoot({
      namespace: 'acme',
      peppers: { 1: process.env.API_KEY_PEPPER! },
      currentPepperVersion: 1,
      storage: new PrismaApiKeyStorage(prisma),
    }),
  ],
})
export class AppModule {}
```

`ApiKeysModule` is global and exports `ApiKeysService` and `ApiKeysGuard`.

## `ApiKeysModuleOptions`

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `namespace` | `string` | `nk` | Product prefix in generated keys. |
| `peppers` | `Record<number, string>` | required | Server-side hash secrets by version; at least one is required. |
| `currentPepperVersion` | `number` | highest configured | Version used for new and replacement keys. |
| `storage` | `ApiKeyStorage` | required | Prisma, in-memory, or custom adapter. |
| `debounceMs` | `number` | `60000` | Minimum interval between best-effort `lastUsedAt` writes. |
| `onAuthFailed` | `(prefix, code) => void` | no-op | Compatibility callback for verification failures. |
| `onEvent` | `ApiKeyEventSink` | none | Lifecycle event sink. |
| `onEventError` | `(error, event) => void` | none | Isolated event sink error handler. |
| `onMetric` | `ApiKeyMetricSink` | none | Verification outcome and duration sink. |
| `onMetricError` | `(error, metric) => void` | none | Isolated metric sink error handler. |
| `emitUsageEvents` | `boolean` | `false` | Enables `api_key.used` lifecycle events. |
| `ttlPolicy` | `ApiKeyTtlPolicy` | none | Default/max expiration and never-expire policy. |
| `contextWriter` | `ApiKeyContextWriter` | none | Writes authorized context to request-local infrastructure. |
| `clientIpResolver` | `ApiKeyClientIpResolver` | `request.ip` | Resolves origin for restricted keys. |

`create()` defaults an omitted environment to `live`; there is no module-level `defaultEnvironment` option.

## `ApiKeysService`

| Method | Result | Purpose |
| --- | --- | --- |
| `create(input)` | `CreateApiKeyResult` | Issues a raw key once and persists its protected record. |
| `verify(rawKey)` | `ApiKeyContext` | Parses, looks up, validates, and records best-effort usage. |
| `rotate(id, input?)` | `RotateApiKeyResult` | Atomically creates a replacement and closes the old key after a grace window. |
| `revoke(id)` | `void` | Marks a key revoked. |
| `list(tenantId, options?)` | `ApiKeyRecord[]` | Lists active or optionally revoked tenant keys. |

### `CreateApiKeyInput`

```ts
interface CreateApiKeyInput {
  tenantId: string;
  name: string;
  environment?: 'live' | 'test';
  scopes: Array<{ resource: string; level: 'read' | 'write' }>;
  expiresAt?: Date;
  createdBy?: string;
  allowedIpCidrs?: string[];
}
```

### `RotateApiKeyInput`

```ts
interface RotateApiKeyInput {
  gracePeriodMs?: number;
  name?: string;
  createdBy?: string;
  expiresAt?: Date | null;
  allowedIpCidrs?: string[];
}
```

`RotateApiKeyResult` contains `id`, the show-once `key`, `replacedKeyId`, and `graceExpiresAt`.

## Guard and decorators

```ts
import {
  ApiKeyContext,
  ApiKeysGuard,
  CurrentApiKey,
  RequireEnvironment,
  RequireScope,
} from '@nestarc/api-keys';

@UseGuards(ApiKeysGuard)
@RequireEnvironment('live')
@RequireScope('reports', 'read')
@Get()
list(@CurrentApiKey() apiKey: ApiKeyContext) {
  return { tenantId: apiKey.tenantId };
}
```

`ApiKeysGuard` verifies the credential, then applies environment, IP, and scope checks. It attaches context only after all checks pass. `write` scope satisfies a matching `read` requirement.

`ApiKeyContext` exposes `keyId`, `tenantId`, `environment`, flattened `scopes`, safe `prefix`, and optional `allowedIpCidrs`.

Context helpers:

- `CurrentApiKey` — Nest parameter decorator.
- `getApiKeyContext(request)` — reads context outside a controller parameter.
- `API_KEY_CONTEXT_PROPERTY` — stable request property name.
- `ApiKeyContextWriter` — bridge for request-local tenancy or RLS context.

## IP policy exports

| Export | Purpose |
| --- | --- |
| `ApiKeyClientIpResolver` | Sync or async request-to-IP resolver type. |
| `defaultApiKeyClientIpResolver` | Reads a non-empty `request.ip`. |
| `normalizeAllowedIpCidrs()` | Normalizes exact addresses/CIDRs and deduplicates them. |
| `isIpAllowed()` | Fail-closed address-to-range matcher. |

IP restrictions are enforced by `ApiKeysGuard`. Direct `verify()` callers must apply transport-specific origin policy themselves.

## Events and metrics

Lifecycle event types are `api_key.created`, `api_key.revoked`, `api_key.rotated`, `api_key.auth_failed`, and opt-in `api_key.used`.

`ApiKeyVerificationMetric` contains:

```ts
interface ApiKeyVerificationMetric {
  type: 'api_key.verification';
  outcome: 'success' | 'malformed' | 'invalid' | 'revoked' | 'expired' | 'error';
  durationMs: number;
  environment?: 'live' | 'test';
}
```

Event and metric sink failures are isolated from key operations. Metrics exclude key material, identifiers, tenant data, scopes, client IPs, and route paths.

## Errors

`ApiKeyError` includes `code` and `httpStatus`:

| Code | HTTP |
| --- | --- |
| `api_key_missing` | 401 |
| `api_key_malformed` | 401 |
| `api_key_invalid` | 401 |
| `api_key_revoked` | 401 |
| `api_key_expired` | 401 |
| `api_key_environment_mismatch` | 403 |
| `api_key_scope_insufficient` | 403 |
| `api_key_ip_not_allowed` | 403 |

`ApiKeyOperationError` exposes `api_key_record_not_found` and `api_key_not_rotatable` for rotation preconditions.

## Storage and testing exports

| Export | Purpose |
|--------|---------|
| `ApiKeyStorage` | Storage adapter contract, including `findById()` and atomic `rotate()`. |
| `PrismaApiKeyStorage` | Prisma-backed production adapter. |
| `InMemoryApiKeyStorage` | Deterministic in-memory adapter. |
| `createTestKey()` | Creates and verifies an integration-test fixture. |
| `API_KEY_REDACT_REGEX` | Redacts raw keys from text before logging. |
| `generateKey()` / `parseKey()` | Key format helpers. |
| `Sha256Hasher` | Built-in versioned-pepper hasher. |

## Guides

- [Installation and upgrades](/packages/api-keys/installation)
- [Guards and scopes](/packages/api-keys/guards-scopes)
- [IP allowlists](/packages/api-keys/ip-allowlists)
- [User key rotation](/packages/api-keys/user-key-rotation)
- [Pepper rotation](/packages/api-keys/pepper-rotation)
- [Lifecycle and context](/packages/api-keys/lifecycle-context)
- [Metrics and testing](/packages/api-keys/metrics-testing)
- [Errors and logging](/packages/api-keys/errors-logging)
