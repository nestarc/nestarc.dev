---
description: "Install @nestarc/api-keys, add its Prisma fields, register ApiKeysModule, and configure lifecycle, IP, and observability options."
---

# Installation

## 1. Install

```bash
npm install @nestarc/api-keys
```

The supported Node range is `^22.13.0 || ^24.0.0`; declaration consumers need TypeScript 5.3+. NestJS common/core peers are `^10.0.0 || ^11.0.0 || ^12.0.0`, with `reflect-metadata ^0.2.0` and `rxjs ^7.0.0`. Optional Prisma peers are `^5.0.0 || ^6.0.0 || ^7.0.0` for `PrismaApiKeyStorage`; custom/in-memory consumers can install without Prisma. Exact Prisma 5.22.0/6.19.3/7.10.0 PostgreSQL and NestJS 10/11/12 consumers back these ranges.

## 2. Add the Prisma model

Add the current model to your Prisma schema:

::: info Packaged schema examples
The current tarball exports `@nestarc/api-keys/prisma/schema.example.prisma`, `@nestarc/api-keys/prisma/schema.example.v7.prisma`, and `@nestarc/api-keys/prisma/prisma.config.example.ts`. Use the legacy schema for Prisma 5/6 or the Prisma 7 schema/config with an explicit generated output and matching PostgreSQL adapter. See [Prisma 7 Setup](/guide/prisma-7).
:::

```prisma
model ApiKey {
  id              String    @id @default(cuid())
  tenantId        String
  name            String
  environment     String
  prefix          String    @unique
  hash            String
  pepperVersion   Int       @default(1)
  scopes          String[]
  allowedIpCidrs  String[]  @default([])
  lastUsedAt      DateTime?
  expiresAt       DateTime?
  revokedAt       DateTime?
  rotatedAt       DateTime?
  replacedByKeyId String?
  createdBy       String?
  createdAt       DateTime  @default(now())

  @@index([tenantId, environment])
  @@index([tenantId, revokedAt])
  @@index([replacedByKeyId])
}
```

Run a migration after merging the model:

```bash
npx prisma migrate dev --name add_api_keys
```

The raw secret is never persisted. Storage contains the safe lookup prefix, a SHA-256 hash, the pepper version, tenant and policy fields, and lifecycle timestamps.

### Upgrading an existing installation

If your application already uses 0.2, add `allowedIpCidrs String[] @default([])` and migrate. Existing records become unrestricted because their arrays are empty.

If you are upgrading directly from 0.1, also add `rotatedAt`, `replacedByKeyId`, `createdBy`, and the `replacedByKeyId` index introduced in 0.2. Custom storage adapters upgrading from 0.1 must implement `findById()` and atomic `rotate()`; 0.3 adds no further storage methods.

## 3. Register the module

```typescript
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

`currentPepperVersion` defaults to the highest configured version. The module fails at startup when there are no peppers or the selected version is missing, preventing a deployment from issuing keys it cannot verify.

## 4. Issue your first key

```typescript
import { Injectable } from '@nestjs/common';
import { ApiKeysService } from '@nestarc/api-keys';

@Injectable()
export class OnboardingService {
  constructor(private readonly apiKeys: ApiKeysService) {}

  async issuePrimaryKey(tenantId: string) {
    const { id, key } = await this.apiKeys.create({
      tenantId,
      name: 'Primary',
      environment: 'live',
      scopes: [{ resource: 'reports', level: 'read' }],
    });

    // Show `key` once. Store and reference only `id` afterward.
    return { id, key };
  }
}
```

## 5. Protect a route

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiKeysGuard, RequireScope } from '@nestarc/api-keys';

@Controller('reports')
@UseGuards(ApiKeysGuard)
export class ReportsController {
  @Get()
  @RequireScope('reports', 'read')
  list() {
    return [];
  }
}
```

The guard reads the `Authorization: Bearer` header, verifies the key, enforces environment, IP, and scope policy, and then attaches `ApiKeyContext` to the request.

## Module options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `namespace` | `string` | `nk` | Product prefix used in issued keys. |
| `peppers` | `Record<number, string>` | required | Server-side hash secrets keyed by version. |
| `currentPepperVersion` | `number` | highest configured | Pepper used for new and replacement keys. |
| `storage` | `ApiKeyStorage` | required | Persistence adapter. |
| `debounceMs` | `number` | `60000` | Minimum interval between best-effort `lastUsedAt` writes. |
| `ttlPolicy` | `ApiKeyTtlPolicy` | none | Default/max lifetime and non-expiring-key policy. |
| `onEvent` | `ApiKeyEventSink` | none | Audit-safe lifecycle event sink. |
| `onEventError` | `(error, event) => void` | none | Isolated lifecycle sink failure reporter. |
| `emitUsageEvents` | `boolean` | `false` | Enables high-volume `api_key.used` events. |
| `contextWriter` | `ApiKeyContextWriter` | none | Copies verified context into request-local infrastructure. |
| `clientIpResolver` | `ApiKeyClientIpResolver` | reads `request.ip` | Resolves the client IP for restricted keys. |
| `onMetric` | `ApiKeyMetricSink` | none | Receives bounded verification outcome and latency metrics. |
| `onMetricError` | `(error, metric) => void` | none | Isolated metric sink failure reporter. |
| `onAuthFailed` | `(prefix, code) => void` | no-op | Legacy authentication-failure callback; prefer lifecycle events for structured payloads. |

There is no `defaultEnvironment` module option. `create()` defaults each omitted `environment` to `live`; pass `environment: 'test'` when issuing sandbox credentials.

## Production checklist

- Generate peppers with high entropy and keep them outside source control.
- Configure HTTP proxy trust before relying on `request.ip`, or supply a verified `clientIpResolver`.
- Decide whether keys may be non-expiring with `ttlPolicy`; do not rely on application convention alone.
- Redact raw keys from logs, traces, error reports, and request captures.
- Monitor event and metric sink failures through their dedicated error callbacks.

## Upgrade to 0.4

1. Upgrade Node to `^22.13.0 || ^24.0.0` and TypeScript to 5.3+. Import public runtime/types from the package root; undocumented `dist/**` imports are blocked by the export map.
2. Reissue keys under a 1–32 ASCII alphanumeric namespace before cutover if the old namespace contains punctuation or is longer. Keep the prior runtime during the overlap; 0.4 rejects that configuration rather than silently changing credential identity.
3. Audit tenant IDs: they must be exact non-empty strings of at most 255 UTF-16 code units with no surrounding whitespace. Migrate references consistently across tenancy/RBAC or reissue affected credentials. New scope resources must be 1–128 ASCII characters, start alphanumerically, and then use only letters, digits, `.`, `_`, `/`, or `-`.
4. Custom `ApiKeyStorage.rotate()` implementations must atomically claim the old key and insert its replacement, returning `'rotated'` or `'not_rotatable'`. `Promise<void>` adapters fail fast. Run `runApiKeyStorageContract()` against isolated fixtures.
5. Use `revokeForTenant(expectedTenantId, keyId)` and `rotateForTenant(expectedTenantId, keyId, options)` in tenant-facing management after application authorization. Custom adapters need the corresponding optional atomic storage capabilities.
6. Adapt `list()` consumers to `ApiKeySummary[]`: hashes and pepper versions are absent. Default results are non-revoked management history, including expired and rotated keys; classify lifecycle timestamps rather than labeling every result active.
7. Use `authorizeRequest()` for custom transports. `verify()` authenticates a credential without applying environment/IP/scope policy. Guard denials now emit authorization telemetry without updating `lastUsedAt` or emitting `api_key.used`.
8. Validate dates and finite, non-negative TTL/grace/debounce inputs; handle `api_key_invalid_input`, `api_key_invalid_time`, and three-attempt `api_key_prefix_collision` operation errors.

The Prisma model added for earlier rotation/IP support remains valid; 0.4's behavioral and custom-adapter changes still require the review above. [Official release changes](https://github.com/nestarc/api-keys/blob/v0.4.0/CHANGELOG.md).
