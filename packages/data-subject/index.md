---
description: "DPA-ready GDPR/CCPA toolkit for NestJS + Prisma. Entity registry, export/erase lifecycle with delete/anonymize/retain strategies, legal retention, and outbox fan-out."
---

<script setup>
import PackageVersion from '../../.vitepress/theme/components/PackageVersion.vue'
</script>

# @nestarc/data-subject

`@nestarc/data-subject` is a NestJS-oriented toolkit for handling **data-subject export and erasure requests** against subject-scoped data. It keeps policy declarative — you describe what each entity holds and how fields should be treated (`delete`, `anonymize`, `retain`) — and the service drives the full lifecycle, emits outbox events, and produces an artifact (ZIP for export, JSON report for erase).

::: tip Current release
Current package version: <PackageVersion slug="data-subject" />

This release adds persistent request records through `PrismaRequestStorage`, erase evidence artifacts with pre/post-scan statistics and SHA-256 hashes, complete audit lifecycle events, and the `data-subject lint` Prisma schema/policy checker.
:::

## Features

- **Entity registry** — declare policies programmatically per entity and compile them before execution.
- **`DataSubjectService`** — `export`, `erase`, and request lookup APIs with built-in SLA tracking.
- **`DataSubjectModule.forRoot(...)`** — idiomatic NestJS integration.
- **Prisma adapter** — `fromPrisma(...)` built on `findMany`, `deleteMany`, and `updateMany`.
- **Persistent request history** — `PrismaRequestStorage` stores `DataSubjectRequest` records through an application-provided Prisma delegate.
- **Strategy model** — `delete`, `anonymize`, `retain`, and `mixed` semantics per field.
- **Legal retention** — `retain` with `legalBasis` and `until` for tax/regulatory obligations.
- **Outbox fan-out** — emits `data_subject.*` events through your publisher, no bus assumptions.
- **Erase evidence** — stores a JSON evidence artifact with pre/post scans, residual verification, and a SHA-256 digest without copying raw rows or field values into the default report.
- **Schema lint CLI** — `data-subject lint` checks Prisma schemas and policy configuration for common coverage gaps.
- **Typed errors** — `DataSubjectError` with stable error codes.
- **Test-friendly** — deterministic in-memory request and artifact stores remain available for local development and tests.

## Requirements

- NestJS 10
- Node.js >= 20
- `@prisma/client ^5.0.0` (optional — only if you use `fromPrisma(...)` or `PrismaRequestStorage`)

The published `0.2.x` adapter declares Prisma 5 as its peer range. Prisma 6 and 7 are not covered by that contract; do not use the Prisma-backed helpers on those majors until a compatible package release expands the peer range.

## Prepare persistent request storage

`PrismaRequestStorage` receives an application-owned Prisma delegate; the package does not add a model to your schema. Add the following model before using the persistent quickstart:

```prisma
model DataSubjectRequest {
  id            String   @id @default(cuid())
  tenantId      String
  subjectId     String
  type          String
  state         String
  createdAt     DateTime @default(now())
  dueAt         DateTime
  completedAt   DateTime?
  failedAt      DateTime?
  failureReason String?
  artifactHash  String?
  artifactUrl   String?
  stats         Json?
  requestedBy   String?

  @@index([tenantId, subjectId])
  @@index([state, dueAt])
}
```

Apply the migration and regenerate the Prisma 5 client so `prisma.dataSubjectRequest` exists:

```bash
npx prisma migrate dev --name add-data-subject-requests
npx prisma generate
```

For a test or local-only setup that does not need durable request history, use `InMemoryRequestStorage` instead and skip this model.

## Quickstart

```ts
import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  DataSubjectModule,
  InMemoryArtifactStorage,
  PrismaRequestStorage,
  fromPrisma,
} from '@nestarc/data-subject';

const prisma = new PrismaClient();
const artifactStorage = new InMemoryArtifactStorage(); // local/dev only

@Module({
  imports: [
    DataSubjectModule.forRoot({
      requestStorage: new PrismaRequestStorage({
        delegate: prisma.dataSubjectRequest,
      }),
      artifactStorage,
      slaDays: 30,
      strictLegalBasis: true,
      entities: [
        {
          policy: {
            entityName: 'User',
            subjectField: 'userId',
            rowLevel: 'delete-row',
            fields: { email: 'delete', name: 'delete' },
          },
          executor: fromPrisma({
            delegate: prisma.user,
            subjectField: 'userId',
            tenantField: 'tenantId',
          }),
        },
        {
          policy: {
            entityName: 'Invoice',
            subjectField: 'customerId',
            fields: {
              customerName: {
                strategy: 'retain',
                legalBasis: 'tax:KR-basic-law-sec85',
                until: '+7y',
              },
              customerEmail: {
                strategy: 'anonymize',
                replacement: '[REDACTED]',
              },
            },
          },
          executor: fromPrisma({
            delegate: prisma.invoice,
            subjectField: 'customerId',
            tenantField: 'tenantId',
          }),
        },
      ],
      publishOutbox: async (type, payload) => {
        // forward to your outbox publisher (e.g. @nestarc/outbox)
      },
    }),
  ],
})
export class AppModule {}
```

Use `InMemoryRequestStorage` and `InMemoryArtifactStorage` for tests and local development. Production request history should use `PrismaRequestStorage`, and evidence artifacts should use a private durable `ArtifactStorage` implementation.

Then invoke a request:

```ts
const exportRequest = await dataSubject.export('user_123', 'tenant_abc');
const eraseRequest = await dataSubject.erase('user_123', 'tenant_abc');

const same = await dataSubject.getRequest(exportRequest.id);
const tenantRequests = await dataSubject.listByTenant('tenant_abc');
const overdue = await dataSubject.listOverdue();
```

## What it does, concretely

- **Export** reads matching rows from every registered entity, writes one JSON file per entity into a ZIP, stores the ZIP via `ArtifactStorage.put(...)`, and records a SHA-256 digest as `artifactHash`.
- **Erase** performs pre/post scans, executes each entity's compiled policy (`delete-row`, `delete-fields`, `anonymize`, `retain`), emits `data_subject.erasure_requested`, and stores a JSON evidence artifact with scan statistics, residual verification, `artifactUrl`, and a SHA-256 `artifactHash`.
- **Mixed strategies** on one entity are intentionally conservative: `retain` fields survive, delete fields are downgraded to field-level updates instead of row deletion.

The default erase evidence artifact excludes raw rows, raw field values, and `subjectId`; the request record keeps the association to the subject.

## Schema lint

Run the bundled Prisma schema and policy checks in CI:

```bash
npx @nestarc/data-subject lint --schema prisma/schema.prisma --config data-subject.config.json
```

The linter reports PII-like fields, missing subject or tenant metadata, invalid policies, and suppressions without reasons. It is a focused safety check, not automatic data discovery.

## When to reach for this

- You have real users in the EU, UK, California, or Korea and need to honor DSAR/DSR requests without writing bespoke per-table logic each time.
- You keep invoices, audit logs, or contracts under legal retention and need a policy that distinguishes **"erase this"** from **"retain this under legal basis X until Y"**.
- You want erase requests to fan out through your existing outbox so downstream services can react in the same transaction story as everything else.

## Current scope

The current release combines the execution core with persistent Prisma-backed request records, lifecycle evidence, and schema/policy linting. It does **not** currently ship decorators or automatic entity discovery, a production artifact-storage adapter, third-party SaaS connectors, an admin/end-user portal, or schema-aware Prisma field deletion beyond `null` assignment. If you need database-specific behavior, plug in your own `EntityExecutor`, `RequestStorage`, or `ArtifactStorage`.

## Next steps

- [Installation](./installation) — module registration, entity wiring, and the first request.
- [Policy Model](./policy-model) — `delete`, `anonymize`, `retain`, mixed strategies, legal basis.
- [Export & Erase](./export-erase) — artifact layout, erase report, verification residual.
- [Events & Hooks](./events-hooks) — `publishOutbox`, `publishAudit`, and transaction boundaries.
- [Errors](./errors) — `DataSubjectError` codes and when they surface.
- [Benchmark](./benchmark) — DSR processing time and mixed-strategy correctness check.
