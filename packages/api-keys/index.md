---
description: "Secure tenant-scoped API keys for NestJS with zero-downtime rotation, IP allowlists, lifecycle hooks, and low-cardinality verification metrics."
---

<script setup>
import PackageVersion from '../../.vitepress/theme/components/PackageVersion.vue'
</script>

# @nestarc/api-keys

Secure, tenant-scoped API keys for NestJS + Prisma. Keys are hashed at rest with SHA-256 and versioned peppers, issued in a Stripe-style format, and verified in constant time by `ApiKeysGuard`.

::: tip Current release
Current package version: <PackageVersion slug="api-keys" />

Version 0.3 adds per-key IP allowlists, verification metrics, `createTestKey()`, and verified `@nestarc/rbac` integration. It remains compatible with existing 0.2 records and custom storage adapters; Prisma users add one optional-array column when upgrading.
:::

## Features

- **Stripe-style key format** — `<namespace>_<env>_<12-char-prefix>_<32-char-secret>`, indexable by prefix.
- **Timing-safe verification** — SHA-256 plus versioned peppers, with a compensated not-found path.
- **Tenant-scoped by design** — every key belongs to a `tenantId` and surfaces it through `ApiKeyContext`.
- **Zero-downtime user key rotation** — issue a replacement with a configurable grace window.
- **Scopes and environment isolation** — resource-level `read`/`write` scopes and separate `live`/`test` keys.
- **Per-key IP allowlists** — exact IPv4/IPv6 addresses and CIDR ranges, enforced fail closed.
- **Lifecycle policy** — TTL controls plus audit-safe creation, revocation, rotation, failure, and optional usage events.
- **Stable request context** — `@CurrentApiKey()`, `getApiKeyContext()`, and an optional `contextWriter` bridge.
- **Safe verification metrics** — bounded-cardinality outcome and latency measurements with isolated sink failures.
- **Pluggable storage** — Prisma and in-memory adapters plus a reusable storage contract suite.

## Requirements

- NestJS 10 (`@nestjs/common` and `@nestjs/core` peer range `^10.0.0`)
- Node.js 20 or newer
- Prisma 5 when using `PrismaApiKeyStorage`

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

Use a product-specific `namespace` such as `acme` or `billing`. The current pepper version defaults to the highest configured version, or you can set `currentPepperVersion` explicitly.

### Protect a route and read its context

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiKeyContext,
  ApiKeysGuard,
  CurrentApiKey,
  RequireScope,
} from '@nestarc/api-keys';

@Controller('reports')
@UseGuards(ApiKeysGuard)
export class ReportsController {
  @Get()
  @RequireScope('reports', 'read')
  list(@CurrentApiKey() apiKey: ApiKeyContext) {
    return this.reports.listForTenant(apiKey.tenantId);
  }
}
```

### Issue a restricted key

```typescript
const { id, key } = await apiKeys.create({
  tenantId: 'tenant_123',
  name: 'Office integration',
  environment: 'live',
  scopes: [{ resource: 'reports', level: 'read' }],
  allowedIpCidrs: ['203.0.113.0/24'],
});

// `key` is returned once. Show it to the user, then discard it.
```

An omitted or empty `allowedIpCidrs` array leaves the key unrestricted. A restricted key is denied when its client IP is outside the allowlist or cannot be resolved.

## Rotate, revoke, and list keys

```typescript
const replacement = await apiKeys.rotate(id, {
  gracePeriodMs: 10 * 60 * 1000,
  name: 'Office integration replacement',
});

await apiKeys.revoke(id);
const active = await apiKeys.list('tenant_123');
const all = await apiKeys.list('tenant_123', { includeRevoked: true });
```

`rotate()` creates a new raw key while keeping the old key valid only until the grace deadline. Use immediate revocation instead when a credential is known to be compromised.

## When to reach for this

- You expose a customer-facing API, CLI, webhook management API, or machine-to-machine endpoint.
- Every credential must carry a stable tenant identity and a narrow capability set.
- You need origin restrictions, expiration policy, lifecycle audit events, or key replacement without downtime.
- You want machine clients to participate in the same tenant-aware RBAC model as users.

## Next steps

- [Installation](./installation) — schema, module registration, upgrade fields, and module options.
- [Key Format](./key-format) — prefix/secret layout, redaction, and stored metadata.
- [Guards & Scopes](./guards-scopes) — bearer authentication, request context, and scope semantics.
- [Environments](./environments) — `live` vs `test` isolation.
- [IP Allowlists](./ip-allowlists) — exact addresses, CIDRs, proxy trust, and fail-closed behavior.
- [User Key Rotation](./user-key-rotation) — replacement keys and grace windows.
- [Pepper Rotation](./pepper-rotation) — server-side hash-secret rotation.
- [Lifecycle & Context](./lifecycle-context) — TTL policy, event hooks, and request-local bridges.
- [Metrics & Testing](./metrics-testing) — bounded metrics and `createTestKey()`.
- [Errors & Logging](./errors-logging) — stable error codes and secret redaction.
- [Benchmark](./benchmark) — library overhead and timing-safe verification checks.
- [API Reference](/api/api-keys/) — module options and public exports.
