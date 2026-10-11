---
description: "Explicit export allowlists, strict stable-ID erasure verification, v2 evidence artifacts, and tenant-scoped request access in data-subject 0.3.0."
---

# Export & Erase

The host authenticates the actor, authorizes the operation and tenant, and verifies the subject before calling the service. `requestedBy` records that actor; it does not grant permission. The core does not check that a subject account exists.

```ts
const request = await dataSubject.export(verifiedSubjectId, authenticatedTenantId, {
  requestedBy: authenticatedActorId,
});
```

This is the immediate path. A service configured with `durableStore` also requires a `requestKey` for every export or erase; see [Execution & Recovery](./execution).

## Export

`export(subjectId, tenantId, context?)` reads only entities with a nonempty `exportFields` allowlist, projects the allowed own top-level properties, and writes their JSON files into a ZIP. Erase policies do not automatically grant export permission. Omitted or empty allowlists exclude the entity, including its query.

Allowlisting an object or JSON field includes nested contents without recursive filtering. BigInt values, including nested values, serialize as exact decimal strings; dates serialize as ISO strings. Consumers should preserve decimal strings for values beyond JavaScript's safe integer range.

| Result | Meaning |
| --- | --- |
| Artifact key | `data-subject/{tenantId}/{requestId}/export.zip`, with encoded path segments |
| ZIP entries | `<EntityName>.json` for each allowlisted entity; `[]` when no rows match |
| `artifactHash` | SHA-256 over the ZIP bytes |
| `artifactUrl` | Storage adapter result; it may be an internal reference |
| `stats.entities` | Entries such as `{ entityName: 'Profile', strategy: 'export', affected: 1 }` |

This API builds the ZIP in memory. The optional [paged job path](./execution#paged-jobs-and-ndjson) produces NDJSON chunks with different completion and consistency semantics.

## Strict erasure verification

`erase(subjectId, tenantId, context?)` scans the registered entities, applies the compiled policies, and verifies the result after all entities execute. The default is strict verification using immutable scalar IDs, rather than relying only on a second subject lookup.

Before mutations, the runner checks for missing or duplicate IDs, ID lookup mismatches, and missing fields needed for field-level verification. A custom executor needs `identityField` and tenant-scoped `selectByIds`; `fromPrisma` supplies these and defaults to `id`. An executor that cannot support verification fails before erasure with `dsr_verification_unavailable`.

After execution, the runner rereads the original IDs and verifies:

- Deleted rows are absent.
- Field-level deletes are `null`.
- Anonymized fields equal their static replacement values.
- Retained fields are unchanged.

Changing a subject lookup field cannot hide a row from this check. `stats.verification` records field and entity outcomes, and `stats.verificationResidual` records residual rows where applicable. Field-level operations keep rows by design; row presence alone is not their verification criterion.

`allowUnverified: true` is an explicit migration option for legacy executors on the immediate path. Missing checks remain `unverified`, and actual detected failures still fail. Durable execution does not allow this option.

## Erasure evidence

After successful data execution and any configured transaction commit, the service writes an evidence JSON artifact:

| Result | Meaning |
| --- | --- |
| Artifact key | `data-subject/{tenantId}/{requestId}/erase-evidence.json` |
| Artifact schema | `data-subject.erasure-evidence.v2` |
| Request evidence metadata | `stats.evidence.schemaVersion: 'data-subject.evidence.v2'` |
| Verification | `policyHash`, actual `effectiveRowStrategy`, checked counts, field outcomes, and `verificationOverall` |
| Additional stats | Entity actions, retention reasons, pre/post scan counts, and residual counts |
| `artifactHash` | SHA-256 over the stored evidence bytes |

Evidence excludes raw rows, field values, row-ID lists, and `subjectId`; the request record retains the subject association. Do not treat old v1 evidence as newly verified v2 evidence.

Verification failure records a failed request and sanitized verification details. The durable path also preserves the original failed v2 evidence artifact. Recovering its upload leaves the request failed. Evidence observed inside a transaction describes those observations; inspect the final database state separately after rollback or an uncertain commit.

Verification covers registered data and fields. It does not establish legal compliance, sufficient anonymization, or erasure in unregistered stores, external systems, and backups.

## Tenant-scoped lookup and downloads

```ts
const request = await dataSubject.getRequest(requestId, authenticatedTenantId);
// Host checks request.subjectId against the caller's authorized subject(s).
const artifact = await dataSubject.getArtifact(request.id, authenticatedTenantId);
const tenantRequests = await dataSubject.listByTenant(authenticatedTenantId);
const overdue = await dataSubject.listOverdue(); // privileged cross-tenant worker only
```

Tenant-scoped lookup treats another tenant's request like an unknown ID. The host must still enforce subject-level access within that tenant and authorize tenant request listings. Serve artifact bytes through an authenticated endpoint or an approved short-lived link; `artifactUrl` is not automatically a public download URL.

`PrismaRequestStorage` provides persistent request records. `InMemoryRequestStorage` and `InMemoryArtifactStorage` are for tests and local development. Implement private production `ArtifactStorage.put/get` storage; the [0.3.0 private-artifact reference](https://github.com/nestarc/data-subject/blob/v0.3.0/docs/private-artifacts.md) covers S3 integration without adding a cloud SDK to the core.

## Read state together with execution outcome

The built-in service transitions through `created → processing → completed | failed`; the public type also includes `validating`. Calls can return a failed request, so inspect `state` and `stats.lifecycle` instead of relying only on thrown exceptions.

`failed` does not necessarily mean data was unchanged: an artifact write may fail after erasure committed. A completion callback failure leaves the request `completed` and records `notificationFailures`. Use [failure stages and recovery](./execution#completion-recovery) to distinguish these outcomes.

The default Prisma field-delete operation writes `null` and does not inspect database nullability at runtime. Run schema lint and use policies or custom executors appropriate to non-null columns. Transactions require every executor to use the same transaction client; see [Events & Hooks](./events-hooks).
