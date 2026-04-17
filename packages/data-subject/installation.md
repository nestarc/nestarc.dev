---
description: "Install @nestarc/data-subject, register DataSubjectModule with your entities, wire the outbox hook, and run your first export/erase request."
---

# Installation

## 1. Install

```bash
npm install @nestarc/data-subject
```

Peer expectations:

- `@nestjs/common`, `@nestjs/core`
- `reflect-metadata`
- `rxjs`
- `@prisma/client` if you use `fromPrisma(...)`

## 2. Register the module

Start with in-memory request and artifact storage — they're enough for local development and tests. Swap them for a persistent implementation before production.

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
      ],
      publishOutbox: async (type, payload) => {
        // await outbox.emit(type, payload);
      },
    }),
  ],
})
export class AppModule {}
```

## 3. Run a request

```ts
import { Injectable } from '@nestjs/common';
import { DataSubjectService } from '@nestarc/data-subject';

@Injectable()
export class PrivacyController {
  constructor(private readonly dataSubject: DataSubjectService) {}

  async requestExport(userId: string, tenantId: string) {
    return this.dataSubject.export(userId, tenantId);
  }

  async requestErase(userId: string, tenantId: string) {
    return this.dataSubject.erase(userId, tenantId);
  }
}
```

`export` returns a request record with `artifactUrl` and `artifactHash`. `erase` returns a request record with `stats.entities`, `stats.retained`, and `stats.verificationResidual`.

## 4. Wire the outbox (recommended)

If you use `@nestarc/outbox`, forward lifecycle events through its publisher:

```ts
publishOutbox: async (type, payload) => {
  await outbox.emit(type, payload);
},
```

The service emits:

- `data_subject.request_created`
- `data_subject.erasure_requested` (erase only)
- `data_subject.request_completed`
- `data_subject.request_failed`

## 5. Transaction boundaries (optional)

`runInTransaction` is an integration hook, not an automatic rollback guarantee:

```ts
DataSubjectModule.forRoot({
  // ...
  runInTransaction: async (work) => myUnitOfWork.run(work),
});
```

Use it when your erase flow can run inside a real unit-of-work that also covers entity executors, request storage writes, and outbox publishing. Without shared boundaries, rollback is best-effort.

## Module Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entities` | `EntityRegistration[]` | *required* | Per-entity policy + executor pairs |
| `requestStorage` | `RequestStorage` | *required* | Request lifecycle persistence |
| `artifactStorage` | `ArtifactStorage` | *required* | Export ZIP storage |
| `slaDays` | `number` | `30` | Deadline used by `listOverdue()` |
| `strictLegalBasis` | `boolean` | `false` | Enforce `scheme:reference` format on `legalBasis` |
| `publishOutbox` | `(type, payload) => Promise<void>` | — | Forward lifecycle events |
| `publishAudit` | `(event, data) => Promise<void>` | — | Audit hook (currently `request_created` only) |
| `runInTransaction` | `(work) => Promise<T>` | — | Integration hook for unit-of-work composition |
