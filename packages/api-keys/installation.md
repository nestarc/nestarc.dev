---
description: "Install @nestarc/api-keys, add its Prisma fields, register ApiKeysModule, and configure lifecycle, IP, and observability options."
---

# Installation

## 1. Install

```bash
npm install @nestarc/api-keys
```

The published peer ranges are `@nestjs/common` and `@nestjs/core` `^10.0.0`, `reflect-metadata` `^0.2.0`, and `rxjs` `^7.0.0`. `@prisma/client` `^5.0.0` is optional and only required when you use `PrismaApiKeyStorage`.

## 2. Add the Prisma model

Add the current model to your Prisma schema:

::: info v0.3.0 package contents
If you are installing v0.3.0, its npm tarball does not include `prisma/schema.example.prisma`, despite the upstream README mentioning that path. Use the model below or the [versioned source schema](https://github.com/nestarc/api-keys/blob/v0.3.0/prisma/schema.example.prisma) for that release.
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
