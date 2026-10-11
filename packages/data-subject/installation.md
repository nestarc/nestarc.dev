---
description: "Install data-subject 0.3.0 with supported NestJS/Prisma versions, shared policies, tenant-scoped storage, and verified erasure."
---

# Installation

These instructions cover published **0.3.0**. Existing 0.2.0 applications should complete the [migration guide](./migration) before changing the dependency.

## Install

```bash
npm install @nestarc/data-subject@0.3.0
```

## Compatibility

| Peer/runtime | Declared range |
| --- | --- |
| Node.js | `>=20` |
| `@nestjs/common`, `@nestjs/core` | `^10.0.0` or `^11.2.7` |
| `@prisma/client` | Optional: `^5.0.0` or `^7.10.0` |
| `reflect-metadata` | `^0.2.0` |
| `rxjs` | `^7.0.0` |

Install the Prisma peer when using `fromPrisma`, `PrismaRequestStorage`, or the Prisma execution helpers. A custom executor/storage implementation does not need Prisma.

The release's packed PostgreSQL consumer tests exercised these exact combinations:

| NestJS | Prisma CLI/client | Runtime and database |
| --- | --- | --- |
| 10.4.22 | 5.22.0 | Node 24.11.1, PostgreSQL 16.15 |
| 11.2.7 | 7.10.0 with `@prisma/adapter-pg` 7.10.0 | Node 24.11.1, PostgreSQL 16.15 |

The package's Node range does not override its dependencies' runtime requirements. Prisma 6/8, NestJS 12, native ESM consumers, other database engines, and other combinations are outside this verification matrix. Read the [release compatibility report](https://github.com/nestarc/data-subject/blob/v0.3.0/docs/compatibility.md) for the exact fixtures and limits.

## Prepare the schema and module

Follow the [persistent schema and quickstart](./#prepare-persistent-request-storage) to add `DataSubjectRequest`, define a matching business model, run the migration, and regenerate the client. Its Prisma 5 example includes all imports, nullable personal-data fields, a shared `definePolicy()` definition, and `DataSubjectModule.forRoot(...)` registration.

Keep the policy and executor aligned:

- Give every entity an immutable unique scalar ID for erasure verification; `fromPrisma` defaults to `id`.
- Declare `scope: { mode: 'multi-tenant', tenantField: 'tenantId' }` in its definition and the same `tenantField` in `fromPrisma`.
- List exported fields separately in `exportFields`; omitted or empty lists exclude that entity from export.
- Use nullable fields for Prisma field deletion, which writes `null`. Run both Prisma validation and the shared-policy lint.

For an explicitly single-tenant installation, use `scope: { mode: 'single-tenant', tenantId: 'installation-a' }`, pass `singleTenantId: 'installation-a'` to both `fromPrisma` and the module, and use that same ID on service calls. Do not supply both `tenantField` and `singleTenantId` to the adapter.

`InMemoryRequestStorage` and `InMemoryArtifactStorage` are useful for tests. Production request history and artifacts need durable storage and explicit access/retention controls. The [private artifact reference](https://github.com/nestarc/data-subject/blob/v0.3.0/docs/private-artifacts.md) provides an S3 integration separately from the core package.

## Prisma 7 setup

Keep the same models and shared policy. Change client generation and construction to the Prisma 7 form verified by the release. This example uses `schema.prisma` at the project root:

```prisma
generator client {
  provider     = "prisma-client"
  output       = "./generated/client"
  moduleFormat = "cjs"
}

datasource db {
  provider = "postgresql"
}
```

```ts
// prisma.config.ts
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'schema.prisma',
  datasource: { url: process.env.DATABASE_URL! },
});
```

```bash
npm install @prisma/client@7.10.0 @prisma/adapter-pg@7.10.0 pg
npm install --save-dev prisma@7.10.0
npx prisma generate
```

```ts
// Use this client in place of the Prisma 5 quickstart's client.
import { PrismaClient } from './generated/client/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});
```

Ensure the CLI and application process receive `DATABASE_URL`. Match import paths to your generated output. If you use a custom PostgreSQL schema, configure it in the adapter and in any durable store's SQL schema options.

## Call the service from an application provider

Register this provider in your application's `providers` alongside the imported data-subject module:

```ts
import { Injectable } from '@nestjs/common';
import { DataSubjectService } from '@nestarc/data-subject';

@Injectable()
export class PrivacyService {
  constructor(private readonly dataSubject: DataSubjectService) {}

  // The caller has already authorized this tenant, subject, actor, and action.
  exportFor(subjectId: string, tenantId: string, actorId: string) {
    return this.dataSubject.export(subjectId, tenantId, { requestedBy: actorId });
  }

  eraseFor(subjectId: string, tenantId: string, actorId: string) {
    return this.dataSubject.erase(subjectId, tenantId, { requestedBy: actorId });
  }
}
```

This is the immediate execution path. It does not configure a signed-preview transaction or durable idempotency. Both `getRequest(id, tenantId)` and `getArtifact(id, tenantId)` require the authorized tenant; before artifact access, the host must also authorize the request's subject. Keep `listOverdue()` behind privileged internal administration.

## Module options

| Option | Default | Purpose |
| --- | --- | --- |
| `requestStorage` | Required | Request history; use `durableStore.requests` when enabling the durable path |
| `artifactStorage` | Required | ZIP exports and JSON erasure evidence |
| `definitions` | `[]` | Recommended shared `{ definition, executor }` registrations |
| `entities` | `[]` | Legacy `{ policy, executor }` registrations remain supported |
| `slaDays` | `30` | Request deadline and overdue lookup |
| `singleTenantId` | Omitted | Explicit single-tenant mode; must match executor scope |
| `strictLegalBasis` | `false` | Validate retention legal-basis syntax as `scheme:reference` |
| `previewSigningKey` | Per-instance temporary key | Shared secret of at least 32 bytes for previews across instances/restarts |
| `previewTtlMs` | `300000` | Preview validity; positive and no more than one hour |
| `allowUnverified` | `false` | Explicit legacy verification compatibility; unavailable on the durable path |
| `durableStore` | Omitted | Durable execution, request-key deduplication, and completion recovery |
| `artifactRetryTtlMs` | 24 hours per request type | Durable retry-byte lifetime through `{ export, erase }` |
| `publishOutbox`, `publishAudit` | Omitted | Lifecycle callbacks; durable delivery includes a stable delivery ID |
| `runInTransaction` | Omitted | Immediate erase transaction hook; all executors must use the actual transaction client |

See [Events & Hooks](./events-hooks) before wiring callbacks. Adding `runInTransaction` around root-client delegates does not make their writes transactional. Signed-preview execution requires Serializable isolation with transaction-bound executors or the configured durable path. Durable execution uses `PrismaExecutionStore.bindTransaction` and the same store's request storage; follow the [optional durable setup](./migration#optional-durable-execution).
