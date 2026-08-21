---
description: "Export @nestarc/audit-log entries with forward scans, resumable checkpoints, a fixed high-watermark, and spreadsheet-safe streaming CSV."
lastUpdated: 2026-08-21
---

# Streaming Export

Use `AuditService.scan()` for a bounded forward export. It reads matching entries oldest-first,
never runs `COUNT(*)`, and fixes a high-watermark when the scan starts so new writes cannot keep an
in-progress job open forever.

| API | Order | Scope | Boundary | Best for |
|-----|-------|-------|----------|----------|
| `query()` | Newest first | Explicit or ambient tenant | Page cursor; optional total | UI feeds and investigations |
| `scan()` | Oldest first | Explicit tenant or intentional all-tenant | Checkpoint plus fixed high-watermark; no total | Exports and downstream delivery |

## Run a resumable scan

Persist the high-watermark before the first external delivery. Advance the checkpoint only after
that delivery is acknowledged:

```typescript
interface ExportState {
  checkpoint: string | null;
  highWatermark: string | null;
}

async function runExport(jobId: string, signal: AbortSignal) {
  const state: ExportState = (await loadExportState(jobId)) ?? {
    checkpoint: null,
    highWatermark: null,
  };

  if (state.checkpoint && state.checkpoint === state.highWatermark) {
    await markExportComplete(jobId);
    return;
  }

  for await (const page of auditService.scan({
    tenantId: 'tenant-1',
    action: 'invoice.*',
    from: new Date('2026-08-01T00:00:00.000Z'),
    batchSize: 500,
    ...(state.checkpoint ? { after: state.checkpoint } : {}),
    ...(state.highWatermark ? { until: state.highWatermark } : {}),
    signal,
  })) {
    if (page.entries.length === 0 || !page.checkpoint) {
      continue;
    }

    if (!state.highWatermark) {
      state.highWatermark = page.highWatermark;
      await saveExportState(jobId, state); // fix the resume boundary first
    }

    await deliver(page.entries);
    state.checkpoint = page.checkpoint;
    await saveExportState(jobId, state); // ACK, then advance
  }

  await markExportComplete(jobId);
}
```

Entries and tokens use the deterministic `(created_at, id)` ascending order. Each page's
`checkpoint` identifies its last entry. For a non-empty scan, `highWatermark` identifies the
greatest matching entry at scan start. Entries committed above that boundary belong to a later
scan. An empty scan instead uses `after`, `until`, or an internal empty-scan token as its boundary.

To resume the exact bounded run, pass the saved checkpoint as `after` and saved high-watermark as
`until`. Persist and reuse the same tenant scope and filters. Both tokens are opaque and
intentionally do not encode the filters; do not parse, edit, or construct them. `after` must sort
strictly before `until`. If your saved `after` equals `until`, mark the bounded run complete without
calling `scan()`; passing equal tokens is rejected.

An empty scan yields one page with `entries: []` and `checkpoint: null`, allowing a job to record a
successful empty result. An aborted scan throws an `AbortError` and does not advance application
state for you.

## Scan options

Exactly one export scope is required: `tenantId`, or an explicitly authorized `allTenants: true`.
Unlike `query()`, export never falls back to ambient tenant context.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tenantId` | `string` | required scope | Export one tenant |
| `allTenants` | `true` | required scope | Deliberately export across tenants |
| `action` | `string` | — | Exact action or `*` wildcard pattern |
| `actorId` | `string` | — | Filter by actor ID |
| `targetType` | `string` | — | Filter by target type |
| `targetId` | `string` | — | Filter by target ID |
| `from` | `Date` | — | Inclusive lower timestamp bound |
| `to` | `Date` | — | Inclusive upper timestamp bound |
| `batchSize` | `number` | `500` | Integer from 1 through 10,000 |
| `after` | `string` | — | Resume strictly after this checkpoint |
| `until` | `string` | scan-start maximum | Stop at or before this high-watermark |
| `signal` | `AbortSignal` | — | Cancel between queries and yielded entries |

The caller owns authorization for `allTenants: true`, destination access, retry scheduling, and
checkpoint durability. For those pieces as one durable workflow, use
[`AuditStreamRunner`](./durable-streams).

## Stream CSV with backpressure

`exportCsv()` consumes the same scan and returns a Node.js `Readable`. Pin `columns: 'v1'` when a
downstream system treats the file as a versioned contract:

```typescript
import { pipeline } from 'node:stream/promises';
import type { ServerResponse } from 'node:http';

async function writeAuditCsv(response: ServerResponse) {
  response.statusCode = 200;
  response.setHeader('content-type', 'text/csv; charset=utf-8');
  response.setHeader(
    'content-disposition',
    'attachment; filename="audit-log.csv"',
  );

  await pipeline(
    auditService.exportCsv({
      tenantId: 'tenant-1',
      columns: 'v1',
      includeBom: true,
      batchSize: 500,
    }),
    response,
  );
}
```

`includeBom` adds an optional UTF-8 BOM for spreadsheet clients. `pipeline()` propagates source,
serialization, cancellation, and response errors while preserving stream backpressure.

## CSV v1 contract and safety

`AUDIT_CSV_COLUMNS_V1` publishes this stable order:

```text
schemaVersion,id,tenantId,actorId,actorType,actorIp,action,targetType,
targetId,source,result,changes,metadata,createdAt
```

- Every row starts with `schemaVersion` value `v1`.
- Fields follow RFC 4180 quoting and records use CRLF delimiters.
- `changes` and `metadata` use canonical JSON with recursively sorted object keys.
- A text cell beginning with optional ASCII space, tab, CR, or LF followed by `=`, `+`, `-`, or `@`
  receives an apostrophe prefix to reduce spreadsheet formula injection.
- Null scalar fields and null JSON fields serialize as empty cells; timestamps use ISO 8601.

Formula escaping does not replace access control or data handling policy. Authorize the export
before calling the API, set response headers in the host application, protect temporary files and
destinations, and avoid logging exported rows or checkpoint-bearing job payloads.
