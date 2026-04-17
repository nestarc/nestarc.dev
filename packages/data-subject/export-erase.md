---
description: "What export and erase actually do — ZIP artifact layout, erase report shape, verification residual, and practical limitations."
---

# Export & Erase

## Export

`DataSubjectService.export(subjectId, tenantId)`:

1. Creates a request record.
2. Reads matching rows from every registered entity.
3. Writes **one JSON file per entity** into a ZIP archive.
4. Stores the ZIP via `ArtifactStorage.put(...)`.
5. Records:
   - `artifactHash` as a SHA-256 digest of the ZIP bytes.
   - `artifactUrl` returned by the artifact storage.
   - `stats.entities[]` with `strategy: 'export'`.

### Artifact shape

- Key: `<requestId>.zip`
- Contents: `<EntityName>.json` files, one per registered entity that held rows for the subject.

### Example

```ts
const request = await dataSubject.export('user_123', 'tenant_abc');

request.artifactUrl;  // e.g. "s3://privacy/.../a1b2c3.zip" (depends on adapter)
request.artifactHash; // SHA-256 over the ZIP bytes
request.stats.entities; // [{ entityName: 'User', strategy: 'export', rowCount: 1 }, ...]
```

## Erase

`DataSubjectService.erase(subjectId, tenantId)`:

1. Creates a request record.
2. Publishes `data_subject.erasure_requested` through `publishOutbox` (if configured).
3. Executes each registered entity according to its compiled policy.
4. Records:
   - `stats.entities[]` per entity
   - `stats.retained[]` for any fields kept under a legal basis
   - `stats.verificationResidual[]` for rows that survived after a `delete-row`
   - `artifactHash` as a SHA-256 digest of the erase report JSON

### Verification residual

The current implementation only fails verification on **residual rows after `delete-row`**. Field-level delete and anonymize operations keep rows in place by design, so their "residual" is expected behavior rather than a failure signal.

If `stats.verificationResidual[]` is non-empty after a `delete-row`, the request transitions to `failed` and `data_subject.request_failed` is emitted.

## Request lookup

```ts
const request = await dataSubject.getRequest(requestId);
const tenantRequests = await dataSubject.listByTenant('tenant_abc');
const overdue = await dataSubject.listOverdue(); // uses module's slaDays
```

States in the current built-in service:

```
created -> processing -> completed | failed
```

The type model also includes `validating`, but the built-in service does not currently transition through it.

## Practical limitations

- `fromPrisma(...)` only relies on `findMany`, `deleteMany`, and `updateMany`.
- Default Prisma field deletion writes `null`; it does **not** inspect schema nullability. Use custom executors for non-null columns.
- There is no built-in subject-existence check before export or erase — the request is always created even if no rows match.
- Only in-memory request and artifact adapters ship with the package. For production, implement `RequestStorage` and `ArtifactStorage` against your database and object store.
