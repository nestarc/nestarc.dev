---
description: "Secure, tenant-scoped API keys for NestJS + Prisma — SHA-256 hashed, Stripe-style scopes, test/live environments, and versioned pepper rotation."
---

# @nestarc/api-keys

Secure, tenant-scoped API keys for NestJS + Prisma. Hashed at rest with SHA-256 plus versioned peppers, issued under a Stripe-style format, and verified in constant time by an `ApiKeysGuard`. Ships with Prisma and in-memory storage adapters.

## Features

- **Stripe-style key format** — `<namespace>_<env>_<12-char-prefix>_<32-char-secret>`, indexable by prefix.
- **Timing-safe verification** with SHA-256 + versioned peppers, ready for rotation.
- **Tenant-scoped by design** — every key belongs to a `tenantId` and surfaces it via `ApiKeyContext`.
- **Scope system** — resource/level pairs (`reports:read`, `reports:write`) with `write`-implies-`read` semantics.
- **Environment isolation** — `live` vs `test` keys that cannot cross over.
- **Pluggable storage** — Prisma and in-memory adapters plus a reusable contract suite.
- **NestJS-native** — `ApiKeysModule.forRoot`, `ApiKeysGuard`, `@RequireScope`, `@RequireEnvironment`.
- **Typed errors** — `ApiKeyError` with stable `code` values mapped to HTTP statuses.

## Requirements

- NestJS 10 or 11
- Node.js 20 or 22
- Prisma 5 or 6 (optional — only if using `PrismaApiKeyStorage`)

## Quickstart

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
      storage: new PrismaApiKeyStorage(prisma),
    }),
  ],
})
export class AppModule {}
```

Use a product-specific `namespace` such as `acme` or `billing` instead of relying on the default `nk`. That keeps your keys distinct if multiple packages or services generate API keys in the same ecosystem.

### Protect a route

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

### Issue a key

```typescript
const { id, key } = await apiKeys.create({
  tenantId: 'tenant_123',
  name: 'Primary',
  scopes: [{ resource: 'reports', level: 'read' }],
});
// key is returned ONCE; show it to the user and discard.
```

## Revoking and listing keys

```typescript
await apiKeys.revoke(keyId);                                 // soft-delete: sets revokedAt
const active = await apiKeys.list('tenant_123');             // active keys only
const all = await apiKeys.list('tenant_123', { includeRevoked: true });
```

Revocation is idempotent. Revoked keys remain in storage so you can audit historical usage.

## When to reach for this

- You ship a public API that customers call from their backends or CLIs.
- You need per-tenant authentication without building your own hashing, prefixing, and rotation layer.
- You want environment-isolated test keys that can never hit a live account by accident.

## Next steps

- [Installation](./installation) — schema, module registration, and first key.
- [Key Format](./key-format) — prefix/secret layout, redaction, and storage expectations.
- [Guards & Scopes](./guards-scopes) — `ApiKeysGuard`, `@RequireScope`, and scope semantics.
- [Environments](./environments) — `live` vs `test` isolation.
- [Pepper Rotation](./pepper-rotation) — versioned peppers, zero-downtime rotation.
- [Errors & Logging](./errors-logging) — stable error codes and safe log redaction.
