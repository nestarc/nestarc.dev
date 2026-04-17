---
description: "Install @nestarc/api-keys, add the Prisma model, register ApiKeysModule, and issue your first tenant-scoped key."
---

# Installation

## 1. Install

```bash
npm install @nestarc/api-keys
```

Peer expectations: NestJS 10 or 11, `reflect-metadata`, and — if you use the Prisma adapter — `@prisma/client`.

## 2. Add the Prisma model

Copy the schema fragment from `node_modules/@nestarc/api-keys/prisma/schema.example.prisma` into your own `schema.prisma` and run a migration:

```bash
npx prisma migrate dev --name add_api_keys
```

The model stores the key prefix, a SHA-256 hash of the secret, the pepper version used at hashing time, `tenantId`, `environment`, scopes, and lifecycle timestamps. The raw secret is never persisted.

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

The module fails fast at startup if `currentPepperVersion` is missing from `peppers`, so a misconfigured deployment never boots with keys it cannot verify.

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

    // Show `key` to the user ONCE. Store only `id` on your side.
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

The guard reads the key from the `Authorization: Bearer` header by default, verifies it in constant time, and attaches an `ApiKeyContext` (with `tenantId`, `environment`, and matched scopes) to the request.

## Module Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `namespace` | `string` | `nk` | Product prefix used in issued keys (`<namespace>_<env>_...`) |
| `peppers` | `Record<number, string>` | *required* | Server-side secrets mixed into the hash, keyed by version |
| `currentPepperVersion` | `number` | *required* | Version used for newly issued keys; must exist in `peppers` |
| `storage` | `ApiKeyStorage` | *required* | Persistence adapter (`PrismaApiKeyStorage` or custom) |
| `defaultEnvironment` | `'live' \| 'test'` | `'live'` | Environment used when `create()` omits it |
