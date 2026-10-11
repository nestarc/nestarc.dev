---
description: "Upgrade @nestarc/data-subject from 0.2.0 to 0.3.0: export allowlists, tenant-aware storage, stable-ID verification, signed previews, and optional durable jobs."
---

# Migration to 0.3

Published **0.3.0** changes export, tenant isolation, request storage, and erasure verification contracts. Update application callers and custom adapters together with the package. The [release changelog](https://github.com/nestarc/data-subject/blob/v0.3.0/CHANGELOG.md) records the complete release; the steps below cover the consumer migration.

## Required changes from 0.2.0

| Existing behavior | Required 0.3.0 change |
| --- | --- |
| Export includes complete returned rows | Add a reviewed `exportFields` allowlist per policy; omitted/empty lists exclude the entity |
| Prisma executor can omit tenant scope | Supply exactly one of `tenantField` or `singleTenantId`, matching the service and definition scope |
| `getRequest(id)` / storage lookup by ID | Pass `tenantId` to service and storage lookup/update operations |
| Erasure only checks remaining rows after row deletion | Provide stable scalar row identity and tenant-scoped `selectByIds` verification |
| `failed` interpreted as no data changes | Read `stats.lifecycle` to separate data execution, artifact delivery, and notification failures |
| Separate policies for runtime and lint | Prefer one `definePolicy()` source registered through `definitions` and loaded by lint |

Check the [compatibility table](./installation#compatibility) before updating: the release accepts NestJS 10 or 11.2.7+, and Prisma 5 or 7.10.0+ within those majors. Prisma 6 and NestJS 12 are not declared peers.

```bash
npm install @nestarc/data-subject@0.3.0
```

## Export allowlists

`exportFields` is independent of erase `fields`. Add only values the requester may receive:

```ts
fields: {
  email: 'delete',
  passwordHash: 'delete',
  sessionToken: 'delete',
},
exportFields: ['email'],
```

An omitted or empty list skips the entity's export query and ZIP entry. Allowlisting an object/JSON column includes its nested content; review that data separately. BigInt values, including nested values, now serialize as exact decimal strings. Existing stored ZIPs retain their old contents and need their own access and retention review.

## Tenant scope and request storage

Multi-tenant mode is the default. Set `tenantField` on `fromPrisma` and matching scope on the shared definition. For single-tenant databases, set the same explicit `singleTenantId` on the module/service and each executor, and pass that ID on calls. Blank subject, tenant, request, or supplied actor identifiers are rejected.

Custom executors must declare scope metadata and enforce it in every read/write. Custom request storage must implement these signatures:

```ts
await service.getRequest(requestId, tenantId);
await service.getArtifact(requestId, tenantId);
await storage.findById(requestId, tenantId);
await storage.update(requestId, tenantId, patch);
```

Storage must treat another tenant's request as missing and reject patches to `id`, `tenantId`, `subjectId`, `type`, or `createdAt`. Tenant filtering does not authorize one subject to read another subject's artifact in the same tenant: the host must still check ownership and action permissions. `requestedBy` records an actor without authorizing that actor. `listOverdue()` remains a cross-tenant administrative operation.

The immediate path needs no new request-table columns; lifecycle metadata uses the existing `stats` JSON. Preserve that JSON through custom serializers. An older record without `stats.lifecycle` does not establish that no execution occurred.

## Shared policies and verified erasure

Move duplicated runtime/lint policy into `definePolicy()` and register it using `definitions: [{ definition, executor }]` or `Registry.registerDefinition()`. The legacy `entities` API remains supported. The [quickstart](./#quickstart) shows a complete schema and shared definition.

Shared lint defaults to strict coverage and relation checks. Cover each scalar with a policy or an `ignoredFields` reason, accounting for the automatically recognized identity/scope fields. Declare reviewed relations and child-before-parent dependencies; validate field deletion against nullable columns. `ignoredFields` documents coverage exclusions and does not preserve a row from deletion. Use `retain` for actual retention policy.

```ts
const executor = fromPrisma({
  delegate: prisma.user,
  subjectField: 'userId',
  tenantField: 'tenantId',
  stableIdField: 'id',
});
```

`fromPrisma` defaults its stable identity to `id`. Use an immutable unique scalar column. Custom executors need `identityField` and `selectByIds(ids, tenantId)`, which reselects the original rows by tenant and stable IDs even when a subject field changes. Missing verification support fails before erasure with `dsr_verification_unavailable`.

After all entities execute, verification checks row deletion, nullified fields, static replacement values, and retained values. `allowUnverified: true` is a temporary compatibility option for legacy executors; it records `unverified` results and cannot be used with the durable path. It does not suppress a detected verification failure.

New evidence uses `data-subject.erasure-evidence.v2`; request evidence metadata uses `data-subject.evidence.v2`. Update evidence readers for policy hashes, effective strategies, and field verification status. Historical v1 evidence does not acquire v2 verification guarantees.

## Signed previews

`previewErase()` returns a signed, read-only plan without creating a request or changing business data. It does not authorize execution or reserve rows. The host authorizes the operation, then passes the preview to `erase()` for policy, scope, expiry, and data revalidation.

Configure a shared `previewSigningKey` of at least 32 bytes across instances. Without it, the per-instance temporary key makes previews invalid after restart or on another instance. Expired or mismatched plans require a new review and preview.

The immediate preview path requires `runInTransaction` with **Serializable** isolation and every executor bound to that transaction client. A callback around delegates using the root Prisma client does not satisfy that contract. The durable path provides its own transaction through `PrismaExecutionStore`.

## Optional durable execution

Enable this path when you need persisted request keys, same-database execution coordination, or artifact/notification recovery after restart:

1. Add `DataSubjectExecution` and `DataSubjectRequest.execution` from the [release schema](https://github.com/nestarc/data-subject/blob/v0.3.0/prisma/schema.example.prisma). Apply the [P1 SQL migration](https://github.com/nestarc/data-subject/blob/v0.3.0/prisma/p1-durable-execution.sql) through your application migration process, retaining the uniqueness constraint and expiry index.
2. Configure `PrismaExecutionStore` against that PostgreSQL database. Its `bindTransaction` must route every business executor to the same transaction client.
3. Pass the store as `durableStore` and its exact `store.requests` instance as `requestStorage`.
4. Supply a stable `requestKey` for each authorized business operation. Keep the original subject, actor, policy, and preview context for retries.
5. Use private artifact storage that can safely accept the same key and original bytes again; deduplicate callback deliveries using their stable delivery IDs in durable storage.

The same tenant, request type, and key identify one request; reusing the key with a different payload conflicts. Immediate execution without a durable store cannot accept an idempotency claim through `requestKey`.

Use the [release durable setup guide](https://github.com/nestarc/data-subject/blob/v0.3.0/docs/p1-migration.md) for complete transaction binding and custom-schema configuration. This store coordinates bounded work in one PostgreSQL database, not distributed transactions.

## Completion and recovery

Data execution commits before artifact upload and terminal callbacks. A `failed` request may already have completed its data changes. Inspect `request.stats.lifecycle.dataOutcome`, `failureStage`, `recovery`, and `notificationFailures` before deciding what to retry.

| Outcome | Action |
| --- | --- |
| Data execution or commit outcome unknown | Reconcile the actual database and request state before issuing another operation |
| Data completed, artifact upload failed | Recover the original artifact; do not rerun erasure to generate evidence |
| Completed request, terminal callback failed | Recover notification delivery; the completed data state remains |
| Durable retry bytes expired | Follow the artifact expiry/reconciliation procedure; original-byte upload is no longer available |

With a configured durable store, authorize access to the request before calling:

```ts
const request = await service.getRequest(requestId, authenticatedTenantId);
// Host verifies subject access and that this is completion recovery.
await service.retryCompletion(request.id, authenticatedTenantId);
```

`retryCompletion()` uses the stored original artifact and pending notifications; it does not repeat business executor reads/writes. Persistence errors expose a request ID for reconciliation. Callbacks may be delivered more than once, so persist delivery receipts.

Durable artifact retry bytes expire after 24 hours by default, separately from uploaded object retention. Configure `artifactRetryTtlMs` and an administrative `expirePendingArtifacts()` worker. S3 object cleanup and paged-job chunk cleanup are separate tasks. Do not remove execution metadata without accounting for the deduplication history it preserves.

## Optional paged jobs and provider integration

Paged execution uses a separate [P2 SQL migration](https://github.com/nestarc/data-subject/blob/v0.3.0/prisma/p2-jobs.sql), `PostgresJobStore`, and `createPagedPrivacyHandler`. Apply it only when enabling this path. Pass the real Prisma schema, reviewed shared policies, and transaction-bound paged executors.

This path supports independent models with stable single String/Int primary keys. Connected relations, composite IDs, and BigInt IDs are outside its supported scope. Each batch and checkpoint commit together; cancellation or later failure preserves earlier committed batches. Export produces bounded **NDJSON chunks**, while the immediate/durable service export remains ZIP. A paged job is not a snapshot across all pages, and a P1 signed preview is not authorization for this separate execution path.

Follow the [paged execution guide](https://github.com/nestarc/data-subject/blob/v0.3.0/docs/p2-execution.md) for migration constraints, consistency, resume/cancel behavior, and chunk expiry. The optional [Transcend adapter](https://github.com/nestarc/data-subject/blob/v0.3.0/docs/platform-integration.md) also requires trusted tenant/subject mapping and its own provider configuration; local erasure and provider notification have separate outcomes. The published verification uses synthetic provider fixtures, not a live Transcend account.
