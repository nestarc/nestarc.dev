---
description: "API reference stub for @nestarc/data-subject: module registration, policy model, service APIs, storage adapters, hooks, and production notes."
---

# @nestarc/data-subject

::: warning Status: Beta
API reference is being expanded.
The package is usable, but advanced examples are still in progress.
:::

## Overview

`@nestarc/data-subject` is a NestJS toolkit for data-subject export and erasure workflows. You register entity policies, provide executors and storage adapters, and call `DataSubjectService` to produce export artifacts or erase/anonymize data according to policy.

Use it for GDPR, CCPA, DSR, or internal privacy workflows where deletion, anonymization, retention, and auditability need to be explicit.

## Installation

```bash
npm install @nestarc/data-subject
```

Install `@prisma/client` if you use the `fromPrisma(...)` executor helper.

## Basic usage

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
      ],
    }),
  ],
})
export class AppModule {}
```

## Configuration

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `entities` | `EntityRegistration[]` | required | Policy and executor pairs. |
| `requestStorage` | `RequestStorage` | required | Request lifecycle persistence. |
| `artifactStorage` | `ArtifactStorage` | required | Export artifact persistence. |
| `slaDays` | `number` | `30` | Deadline used by overdue queries. |
| `strictLegalBasis` | `boolean` | `false` | Validates legal-basis format. |
| `publishOutbox` | function | optional | Emits lifecycle events to an outbox. |
| `publishAudit` | function | optional | Emits audit events. |
| `runInTransaction` | function | optional | Integrates with an application unit of work. |

## Public API

| Export | Purpose |
|--------|---------|
| `DataSubjectModule` | Nest module with `forRoot()` registration. |
| `DataSubjectService` | `export`, `erase`, request lookup, tenant listing, and overdue listing. |
| `fromPrisma()` | Prisma executor helper using `findMany`, `deleteMany`, and `updateMany`. |
| `InMemoryRequestStorage` | Test/development request storage adapter. |
| `InMemoryArtifactStorage` | Test/development artifact storage adapter. |
| `RequestStorage` | Request storage contract. |
| `ArtifactStorage` | Export artifact storage contract. |
| `EntityExecutor` | Per-entity export/erase execution contract. |
| `DataSubjectError` | Stable error type with machine-readable codes. |

## Examples

```ts
const exportRequest = await dataSubject.export('user_123', 'tenant_abc');
const eraseRequest = await dataSubject.erase('user_123', 'tenant_abc');

const same = await dataSubject.getRequest(exportRequest.id);
const tenantRequests = await dataSubject.listByTenant('tenant_abc');
const overdue = await dataSubject.listOverdue();
```

```ts
DataSubjectModule.forRoot({
  // ...
  publishOutbox: async (type, payload) => {
    await outbox.emit(type, payload);
  },
});
```

Useful package guides:

- [Policy model](/packages/data-subject/policy-model)
- [Export and erase](/packages/data-subject/export-erase)
- [Events and hooks](/packages/data-subject/events-hooks)
- [Errors](/packages/data-subject/errors)

## Production notes

- Replace in-memory request and artifact storage before production.
- Model retention explicitly with `retain` and `legalBasis` instead of hiding business exceptions in executor code.
- Treat `runInTransaction` as an integration hook; rollback guarantees depend on whether your adapters share the same unit of work.
- Review large domain models entity by entity so export and erasure policies remain understandable to support and compliance teams.
