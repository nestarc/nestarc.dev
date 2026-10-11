---
description: "Tenant-scoped data export and verified erasure for NestJS + Prisma: shared policies, signed previews, durable recovery, and optional paged jobs."
---

<script setup>
import PackageVersion from '../../.vitepress/theme/components/PackageVersion.vue'
</script>

# @nestarc/data-subject

`@nestarc/data-subject` executes data-subject export and erasure requests against registered, subject-scoped data. Define which fields to export, delete, anonymize, or retain; the service applies those policies within a tenant and records the result as an artifact and request history.

::: warning Compliance boundary
The package supplies execution controls and evidence. Your application still owns authentication, subject verification, authorization, legal retention decisions, and the wider response procedure.
:::

::: tip Current release
Current package version: <PackageVersion slug="data-subject" />

Published **0.3.0** includes breaking changes from 0.2.0: exports require field allowlists, executors must declare tenant scope, request lookup requires a tenant ID, and erasure verifies results through stable row identities. Read the [migration guide](./migration) before upgrading.
:::

## Features

- **Shared policies** — `definePolicy()` definitions drive runtime registration and Prisma schema lint, including scalar coverage, nullable writes, and declared relations.
- **Tenant-scoped export** — immediate requests produce ZIP files containing only explicitly allowed fields; BigInt values become exact decimal strings.
- **Verified erasure** — stable row IDs let the service verify row deletion, nullification, static replacements, and retained values. Evidence v2 records the policy hash and verification results without raw row values.
- **Signed previews** — inspect a read-only erase plan, then revalidate its policy and data scope during transactional execution.
- **Persistent history and recovery** — `PrismaRequestStorage` persists requests; optional `PrismaExecutionStore` adds durable request keys and original-byte artifact/notification recovery.
- **Optional paged jobs** — PostgreSQL workers process independent models in bounded batches with checkpoints, cancellation, and NDJSON export.
- **Integrations** — lifecycle callbacks, a private S3 reference implementation, and an optional Transcend erasure adapter. Provider verification uses synthetic fixtures; live-account validation remains separate.

## Requirements

| Dependency | Published 0.3.0 contract |
| --- | --- |
| Node.js | `>=20`; selected NestJS/Prisma versions may require a newer runtime |
| `@nestjs/common`, `@nestjs/core` | `^10.0.0` or `^11.2.7` |
| `@prisma/client` | Optional peer: `^5.0.0` or `^7.10.0` |
| `reflect-metadata` | `^0.2.0` |
| `rxjs` | `^7.0.0` |

The release verifies NestJS **10.4.22 + Prisma 5.22.0** and NestJS **11.2.7 + Prisma 7.10.0** on Node **24.11.1** with PostgreSQL **16.15**. Prisma 6 and NestJS 12 are outside the declared peer ranges; cross-pairing the tested versions is not separately verified. See [Installation](./installation#compatibility) for Prisma 7 setup and the exact scope.

## Prepare persistent request storage

This quickstart uses Prisma 5 initialization and immediate execution. Merge these models into your PostgreSQL application schema before constructing the module. `DataSubjectRequest` stores workflow history; `User` is the example business model. The fields cleared by `delete-fields` are nullable because the Prisma adapter writes `null`.

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

model User {
  id           String  @id
  userId       String
  tenantId     String
  email        String?
  displayName  String?
  passwordHash String?
  sessionToken String?
}
```

```bash
npm install @nestarc/data-subject@0.3.0
npx prisma migrate dev --name add-data-subject-requests
npx prisma generate
```

Adapt the migration to your existing models. Keep `id` unique and immutable. `DataSubjectExecution` and its relation are needed only when enabling the [durable execution store](./migration#optional-durable-execution); the [release schema](https://github.com/nestarc/data-subject/blob/v0.3.0/prisma/schema.example.prisma) also includes those optional models. For local tests without persistent history, use `InMemoryRequestStorage` instead.

## Quickstart

Use one definition for runtime and schema lint. This policy clears four personal-data fields while allowing only email and display name into an export:

```ts
// policy.ts
import { definePolicy } from '@nestarc/data-subject';

export const definitions = definePolicy([{
  entityName: 'User',
  subjectField: 'userId',
  stableIdField: 'id',
  scope: { mode: 'multi-tenant', tenantField: 'tenantId' },
  rowLevel: 'delete-fields',
  fields: {
    email: 'delete',
    displayName: 'delete',
    passwordHash: 'delete',
    sessionToken: 'delete',
  },
  exportFields: ['email', 'displayName'],
  ignoredFields: {
    id: 'Immutable identity for post-write verification',
    userId: 'Subject lookup key retained after clearing personal fields',
    tenantId: 'Tenant boundary retained on every read and write',
  },
}]);
```

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  DataSubjectModule,
  InMemoryArtifactStorage,
  PrismaRequestStorage,
  fromPrisma,
} from '@nestarc/data-subject';
import { definitions } from './policy';

const prisma = new PrismaClient();

@Module({
  imports: [DataSubjectModule.forRoot({
    requestStorage: new PrismaRequestStorage({
      delegate: prisma.dataSubjectRequest,
    }),
    artifactStorage: new InMemoryArtifactStorage(), // local development only
    slaDays: 30,
    definitions: [{
      definition: definitions[0],
      executor: fromPrisma({
        delegate: prisma.user,
        subjectField: 'userId',
        tenantField: 'tenantId',
        stableIdField: 'id',
      }),
    }],
  })],
})
export class AppModule {}
```

Use your application's managed Prisma client in an integrated service and close it through its normal lifecycle. This immediate example has no transaction hook and does not promise rollback. Before exposing it over HTTP, connect the authorization and subject checks in the [tenant-safe host example](https://github.com/nestarc/data-subject/tree/v0.3.0/examples/tenant-safe), and replace in-memory artifacts with private durable storage.

Inject `DataSubjectService` into an application provider. The host supplies the authenticated tenant, verified subject, and authorized actor:

```ts
const exported = await dataSubject.export('user_123', 'tenant_abc', {
  requestedBy: 'actor_123',
});
const erased = await dataSubject.erase('user_123', 'tenant_abc', {
  requestedBy: 'actor_123',
});

const request = await dataSubject.getRequest(exported.id, 'tenant_abc');
// Authorize access to request.subjectId before fetching its artifact.
const artifact = await dataSubject.getArtifact(request.id, 'tenant_abc');
const tenantRequests = await dataSubject.listByTenant('tenant_abc');
const overdue = await dataSubject.listOverdue(); // privileged administration only
```

`requestedBy` records an actor; it does not grant access. Tenant filtering also does not replace subject ownership or operation permission checks within that tenant.

## Schema lint

Build `policy.ts` with your application, then load the same emitted definition in a CommonJS lint configuration:

```js
// data-subject.config.cjs — adjust the path to your build output
const { definitions } = require('./dist/policy.js');
module.exports = {
  definitions,
  strictCoverage: true,
  checkRelations: true,
  suppressions: [{
    model: 'DataSubjectRequest',
    reason: 'Workflow history has a separate reviewed retention policy',
  }],
};
```

```bash
npx prisma validate --schema prisma/schema.prisma
npx data-subject lint --schema prisma/schema.prisma --config data-subject.config.cjs --format json
```

Review each additional model in your schema: register its policy or provide a specific exclusion reason. Shared definitions enable strict scalar coverage and relation checks by default. Schema lint complements Prisma validation; it does not discover or delete arbitrary relation graphs.

## Choose an execution path

| Need | Path | Completion boundary |
| --- | --- | --- |
| Small, immediate export or erase | `DataSubjectService` with request/artifact stores | ZIP export or JSON evidence; rollback depends on transaction wiring |
| Request idempotency and completion recovery | `DataSubjectService` + `PrismaExecutionStore` | One PostgreSQL data transaction, followed by recoverable artifact and notification delivery |
| Large independent models | `PostgresJobStore` + `createPagedPrivacyHandler` | One batch at a time; earlier commits remain after cancellation or failure; export is NDJSON |

Signed previews work with the durable store or with immediate execution using a Serializable `runInTransaction` hook and transaction-bound executors. The package does not provide automatic entity discovery, a privacy portal, distributed transactions, or streaming ZIP files. Retention `until` values describe policy metadata; your application schedules later disposal. See [Execution & Recovery](./execution) for transaction and recovery boundaries.

## Next steps

- [Installation](./installation) — compatibility, setup, and module options.
- [Migration to 0.3](./migration) — breaking changes and optional durable/job migrations.
- [Policy Model](./policy-model) — shared definitions, retention, and schema checks.
- [Export & Erase](./export-erase) — previews, evidence, and execution paths.
- [Execution & Recovery](./execution) — durable requests, paged jobs, and completion retries.
- [Events & Hooks](./events-hooks) — lifecycle callbacks and transaction boundaries.
- [Errors](./errors) — failure codes and recovery decisions.
- [Benchmark](./benchmark) — measured scope and reproducible checks.
