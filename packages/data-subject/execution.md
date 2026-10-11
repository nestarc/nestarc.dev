---
description: "Signed erasure previews, PostgreSQL durable idempotency and completion recovery, optional paged jobs, and Transcend integration boundaries in data-subject 0.3.0."
---

# Execution & Recovery

Version 0.3.0 adds signed previews and optional durable execution. Choose the path according to the required transaction and recovery boundaries:

| Path | Use case | Commit and output boundary |
| --- | --- | --- |
| Immediate `DataSubjectService` | Bounded exports and erasures with host-managed execution | ZIP export or v2 erase evidence; rollback depends on the configured erase transaction |
| Service + `PrismaExecutionStore` | Whole-request transaction, signed preview, durable idempotency, completion recovery | Participating changes in one PostgreSQL database; original artifact and notification retry |
| `PostgresJobStore` + paged privacy handler | Independent models requiring resumable batches | One batch and checkpoint commit together; earlier batches remain committed; NDJSON export |
| `TranscendErasureAdapter` | Optional provider erasure webhook integration | Queue checkpoint, local durable erasure, and provider callback are separate stages |

All paths require the host to authenticate callers, authorize tenant and subject access, and verify the subject before execution. Relation-aware policies, private storage, and reviewed retention rules remain host configuration.

## Signed erasure previews

```ts
const preview = await service.previewErase(verifiedSubjectId, authenticatedTenantId, {
  ttlMs: 60_000,
});
// Host presents the plan and authorizes execution for this subject.
const request = await service.erase(verifiedSubjectId, authenticatedTenantId, {
  requestedBy: authenticatedActorId,
  preview,
  requestKey: approvedOperationKey, // required when durableStore is configured
});
```

`previewErase` performs reads without creating a request, writing data or artifacts, or calling lifecycle hooks. Its signed result contains tenant/subject identity, policy and target hashes, expected counts, effective strategies, field names, verification availability, and expiry. It excludes raw values and row-ID lists. Apply access controls to preview responses as well.

The default TTL is five minutes; `previewTtlMs` or the call's `ttlMs` can set a positive duration up to one hour. Configure a stable secret `previewSigningKey` of at least 32 bytes across service instances. Without it, each instance uses a temporary key and cannot validate another instance's preview or a preview from before a restart.

Execution verifies the signature, subject, tenant, expiry, current policy, and target rows and policy-field fingerprints. Changed plans fail with `dsr_plan_mismatch`; expired previews fail with `dsr_plan_expired`. Generate and approve a fresh preview after a mismatch. A preview does not lock rows or reserve execution.

Without a durable store, passing `preview` requires `runInTransaction` with all executors bound to the same Serializable transaction; omit `requestKey` on that path. Providing only a callback while executors use the global Prisma client does not satisfy the transaction contract.

## Durable execution setup

Apply the application's migration for `DataSubjectExecution` and its request relation, using the [0.3.0 schema example](https://github.com/nestarc/data-subject/blob/v0.3.0/prisma/schema.example.prisma) and [PostgreSQL migration reference](https://github.com/nestarc/data-subject/blob/v0.3.0/prisma/p1-durable-execution.sql). Preserve the unique constraint on tenant, request type, and idempotency key, then regenerate the Prisma client.

```ts
import { AsyncLocalStorage } from 'node:async_hooks';
import { Prisma } from '@prisma/client';
import { DataSubjectService, PrismaExecutionStore } from '@nestarc/data-subject';

const context = new AsyncLocalStorage<Prisma.TransactionClient>();
const store = new PrismaExecutionStore({
  client: prisma,
  bindTransaction: (transaction, work) => context.run(transaction, work),
});

const service = new DataSubjectService({
  registry, // Every executor resolves its delegate from this transaction context.
  requestStorage: store.requests,
  durableStore: store,
  artifactStorage: privateArtifactStorage,
  previewSigningKey,
  artifactRetryTtlMs: { export: 86_400_000, erase: 86_400_000 },
  slaDays: 30,
});
```

This is the store configuration, not a complete executor binding. Every business delegate must read `context.getStore()` during execution. The [0.3.0 setup guide](https://github.com/nestarc/data-subject/blob/v0.3.0/docs/p1-migration.md) includes the full transaction-bound delegate example. `requestStorage` must be the exact `store.requests` instance, and durable execution rejects `allowUnverified`.

The store uses Serializable transactions, row locks, and a database unique constraint. Entity changes, request results, artifact retry bytes, and notification intents commit together. External uploads and callbacks follow the commit; they are not part of a distributed transaction. Keep workload sizes and provider timeouts bounded: this path prepares the entire artifact in memory and stores recovery bytes in the database.

## Idempotency keys

Every durable `export` and `erase` needs a `requestKey`. The same tenant, request type, and key refer to one request ID. The payload hash includes the subject, actor, current policy, and complete supplied preview; reusing a key with different input produces `dsr_request_conflict`.

Store the operation key and original context with the host's business request. Reusing a key does not repeat a failed data execution. A new preview also changes the payload, so it cannot be substituted into an old key. A newly authorized data execution requires a separate key after investigating the previous result.

## Completion recovery

Inspect the returned request as well as exceptions. `stats.lifecycle` distinguishes data work from artifact and callback delivery:

| Outcome | Meaning | Recovery |
| --- | --- | --- |
| `failed`, `dataOutcome: not_started` | Data execution did not start | Inspect request creation/processing and decide whether to authorize a new request |
| `failed`, `failureStage: data_execution`, `dataOutcome: unknown` | Data, verification, or transaction execution failed | Reconcile actual data and transaction participation |
| `failed`, `failureStage: artifact_write`, `dataOutcome: completed` | Data work succeeded; artifact delivery failed | Recover original bytes with durable `retryCompletion` |
| `completed` with `notificationFailures` | Data and completion succeeded; a callback failed | Retry undelivered notifications |
| `DataSubjectPersistenceError` | Request storage or commit result needs reconciliation | Use its `requestId`, `tenantId`, and `dataOutcome` to inspect stored state |

```ts
const current = await service.getRequest(requestId, authenticatedTenantId);
// Host authorizes access and confirms this is completion recovery.
const recovered = await service.retryCompletion(current.id, authenticatedTenantId);
```

`retryCompletion` requires durable storage. It uses saved original artifact bytes and pending notifications, never entity reads or mutations, and can resume after a process restart. It does not execute a pending request whose data has not committed. Do not call `erase` again merely to regenerate evidence.

A failed verification remains a failed request even when its original failed-evidence artifact uploads successfully. Inspect `stats.lifecycle.artifactFailure` for additional delivery errors without overwriting the original verification failure.

Artifact stores must safely accept repeated writes to the same key with the same bytes. Callbacks are delivered at least once and must deduplicate the stable `DeliveryContext.id`; see [Events & Hooks](./events-hooks).

### Recovery payload retention

The default retry-payload TTL is 24 hours from the immutable request creation time, configurable per request type with `artifactRetryTtlMs`. It is not extended by retries or restarts. Confirmed uploads clear stored payload bytes; expired pending payloads are discarded and cannot be regenerated by completion recovery.

```ts
// Run in a privileged internal maintenance worker.
const report = await service.expirePendingArtifacts(100);
// Observe report.failures and retry cleanup on a later worker run.
```

Expiry alone does not physically remove database bytes; run cleanup or retry processing. Failed export payloads can contain personal data, so protect and expire them. Uploaded-object retention and cleanup are separate storage responsibilities. Deleting execution metadata also removes idempotency history, so align its retention with the host's retry window.

## Paged jobs and NDJSON

The optional `PostgresJobStore`, `pagedFromPrisma`, `createPagedPrivacyHandler`, and `createPagedPrivacyPayload` APIs provide resumable batch execution. Apply the [0.3.0 job migration](https://github.com/nestarc/data-subject/blob/v0.3.0/prisma/p2-jobs.sql) in the same PostgreSQL database as the business data and bind all delegates to the job store's transaction context.

The handler validates the real Prisma schema and shared policy definitions. It supports reviewed independent models with one immutable String or Int primary key. Relations touching registered models, compound IDs, and BigInt IDs are unsupported on this path. Do not hide relations from the schema to bypass validation. Exporting a BigInt field as a decimal string is distinct from using BigInt as the paging ID.

A worker call to `jobs.runNext(handler, { kind: PAGED_PRIVACY_JOB_KIND })` processes at most one batch. Each batch's data changes, verification, chunk, and checkpoint commit atomically; earlier batches remain committed. The stored policy hash must continue to match the registry. A signed whole-request preview is not an approval token for this separate API.

`jobs.cancel(id, tenantId)` stops future batches after the current lock is released; it cannot restore erased rows. `jobs.retry(id, tenantId)` resumes an eligible failed or cancelled job from its original checkpoint. Inspect `state`, `partial`, `hasCommittedChanges`, `processedRows`, and `pagesCommitted`; a returned job is not necessarily successful.

Paged export stores allowlisted fields in NDJSON chunks:

```json
{"entityName":"Profile","data":{"email":"example@example.test","displayName":"Example"}}
```

After tenant and subject authorization, stream completed-job chunks using `jobs.readChunks(id, tenantId)` with `application/x-ndjson`. Keep backpressure and avoid combining all chunks into one buffer. Pages are limited to 1–1,000 rows; the handler defaults to a 1 MiB chunk limit. These bounds do not cap the driver's memory for an individual oversized field.

Each entity captures an upper ID bound, but batches are not one consistent snapshot. Concurrent inserts behind the cursor, subject changes, or later writes can fall outside the verified range. Batch erasure evidence uses `data-subject.paged-evidence.v1`, separate from whole-request v2 evidence.

Jobs expire after seven days by default. Run privileged `jobs.purgeExpiredChunks(100)` repeatedly to remove expired chunks and payloads; expiry does not itself physically delete them. See the [0.3.0 batch execution guide](https://github.com/nestarc/data-subject/blob/v0.3.0/docs/p2-execution.md) for complete setup, limits, cancellation, and cleanup semantics.

## Optional Transcend integration

The experimental `TranscendErasureAdapter` accepts ERASURE webhooks and coordinates the job queue with the durable service. ACCESS requests and other provider workflows are unsupported. It requires both job and durable migrations, operator-configured keys and tenant bindings, and a tenant-scoped `resolveSubject` implementation.

Webhook acceptance means the job was persisted. Local erasure completion and provider callback acceptance are separate results: inspect `job.result.localStatus`, `providerStatus`, and `dataOutcome`, not only `job.state`. A terminal provider rejection can coexist with a completed queue job. The adapter uses the whole-request durable path; it does not convert erasure into paged batches.

Queue and local execution transactions are independent. Recovery reuses the original durable key instead of repeating mutations under a new identity. Cancellation after local completion can stop a pending callback but cannot restore data. Validation in this release uses synthetic fixtures; a live provider account and the host's mappings still require environment-specific verification.

See the pinned [0.3.0 Transcend integration guide](https://github.com/nestarc/data-subject/blob/v0.3.0/docs/platform-integration.md) for authentication, supported Sombra versions, callback classification, and retry boundaries.
