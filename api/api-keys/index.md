---
description: "API reference stub for @nestarc/api-keys: module registration, guards, scopes, storage, service APIs, and production notes."
---

# @nestarc/api-keys

::: warning Status: Beta
API reference is being expanded.
The package is usable, but advanced examples are still in progress.
:::

## Overview

`@nestarc/api-keys` provides tenant-scoped API key authentication for NestJS. Keys are generated with a Stripe-style format, hashed at rest with versioned peppers, verified in constant time, and authorized through guards and scope decorators.

Use it for customer-facing APIs, CLI tokens, machine-to-machine access, or tenant-scoped integration keys.

## Installation

```bash
npm install @nestarc/api-keys
```

If you use the Prisma storage adapter, add the package schema fragment to your Prisma schema and run a migration:

```bash
npx prisma migrate dev --name add_api_keys
```

## Basic usage

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

```ts
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

## Configuration

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `namespace` | `string` | `nk` | Product prefix in generated keys. |
| `peppers` | `Record<number, string>` | required | Server-side hash secrets by version. |
| `currentPepperVersion` | `number` | required | Version used for new keys. |
| `storage` | `ApiKeyStorage` | required | `PrismaApiKeyStorage` or custom adapter. |
| `defaultEnvironment` | `'live' \| 'test'` | `'live'` | Environment used when omitted. |

## Public API

| Export | Purpose |
|--------|---------|
| `ApiKeysModule` | Nest module with `forRoot()` registration. |
| `ApiKeysService` | Create, verify, list, and revoke API keys. |
| `ApiKeysGuard` | Reads bearer tokens and attaches `ApiKeyContext`. |
| `RequireScope()` | Requires a resource/level scope on a route. |
| `RequireEnvironment()` | Restricts routes to `live` or `test` keys. |
| `PrismaApiKeyStorage` | Prisma-backed storage adapter. |
| `ApiKeyStorage` | Storage adapter contract. |
| `ApiKeyContext` | Verified key context attached to the request. |
| `ApiKeyError` | Stable error type with machine-readable codes. |
| `API_KEY_REDACT_REGEX` | Regex for redacting raw keys from logs. |

## Examples

```ts
const { id, key } = await apiKeys.create({
  tenantId: 'tenant_123',
  name: 'Primary',
  environment: 'live',
  scopes: [{ resource: 'reports', level: 'read' }],
});
```

```ts
await apiKeys.revoke(id);
const active = await apiKeys.list('tenant_123');
const all = await apiKeys.list('tenant_123', { includeRevoked: true });
```

Useful package guides:

- [Key format](/packages/api-keys/key-format)
- [Guards and scopes](/packages/api-keys/guards-scopes)
- [Environments](/packages/api-keys/environments)
- [Pepper rotation](/packages/api-keys/pepper-rotation)
- [Errors and logging](/packages/api-keys/errors-logging)

## Production notes

- Generate a high-entropy pepper outside source control and rotate with `currentPepperVersion`.
- Show raw keys only once at creation time; store and reference key IDs after that.
- Redact keys from logs, traces, request bodies, and error reporting payloads.
- Prefer product-specific namespaces such as `acme` or `billing` so keys are recognizable and isolated.
