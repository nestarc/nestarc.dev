---
description: "DPA-ready GDPR/CCPA toolkit for NestJS + Prisma. Entity registry, export/erase lifecycle with delete/anonymize/retain strategies, legal retention, and outbox fan-out."
---

# @nestarc/data-subject

`@nestarc/data-subject` is a NestJS-oriented toolkit for handling **data-subject export and erasure requests** against subject-scoped data. It keeps policy declarative — you describe what each entity holds and how fields should be treated (`delete`, `anonymize`, `retain`) — and the service drives the full lifecycle, emits outbox events, and produces an artifact (ZIP for export, JSON report for erase).

## Features

- **Entity registry** — declare policies programmatically per entity and compile them before execution.
- **`DataSubjectService`** — `export`, `erase`, and request lookup APIs with built-in SLA tracking.
- **`DataSubjectModule.forRoot(...)`** — idiomatic NestJS integration.
- **Prisma adapter** — `fromPrisma(...)` built on `findMany`, `deleteMany`, and `updateMany`.
- **Strategy model** — `delete`, `anonymize`, `retain`, and `mixed` semantics per field.
- **Legal retention** — `retain` with `legalBasis` and `until` for tax/regulatory obligations.
- **Outbox fan-out** — emits `data_subject.*` events through your publisher, no bus assumptions.
- **Typed errors** — `DataSubjectError` with stable error codes.
- **Test-friendly** — in-memory request and artifact stores for local development and tests.

## Requirements

- NestJS 10 or 11
- Node.js 20 or 22
- `@prisma/client` if you use `fromPrisma(...)`

## Quickstart

```ts
import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  DataSubjectModule,
  InMemoryArtifactStorage,
  InMemoryRequestStorage,
  fromPrisma,
} from '@nestarc/data-subject';

const prisma = new PrismaClient();

@Module({
  imports: [
    DataSubjectModule.forRoot({
      requestStorage: new InMemoryRequestStorage(),
      artifactStorage: new InMemoryArtifactStorage(),
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
- **Erase** executes each entity's compiled policy (`delete-row`, `delete-fields`, `anonymize`, `retain`), emits `data_subject.erasure_requested`, and records `stats.entities`, `stats.retained`, and `stats.verificationResidual`.
- **Mixed strategies** on one entity are intentionally conservative: `retain` fields survive, delete fields are downgraded to field-level updates instead of row deletion.

## When to reach for this

- You have real users in the EU, UK, California, or Korea and need to honor DSAR/DSR requests without writing bespoke per-table logic each time.
- You keep invoices, audit logs, or contracts under legal retention and need a policy that distinguishes **"erase this"** from **"retain this under legal basis X until Y"**.
- You want erase requests to fan out through your existing outbox so downstream services can react in the same transaction story as everything else.

## Current scope

Version `0.1.0` focuses on the execution core. It does **not** currently ship decorators, automatic entity discovery, a CLI, persistent request/artifact storage adapters, or schema-aware Prisma field deletion beyond `null` assignment. If you need database-specific behavior, plug in your own `EntityExecutor`, `RequestStorage`, or `ArtifactStorage`.

## Next steps

- [Installation](./installation) — module registration, entity wiring, and the first request.
- [Policy Model](./policy-model) — `delete`, `anonymize`, `retain`, mixed strategies, legal basis.
- [Export & Erase](./export-erase) — artifact layout, erase report, verification residual.
- [Events & Hooks](./events-hooks) — `publishOutbox`, `publishAudit`, and transaction boundaries.
- [Errors](./errors) — `DataSubjectError` codes and when they surface.
