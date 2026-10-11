---
description: "Migrate @nestarc/idempotency 0.4 to 1.0 with new imports, Node 22/24, isolated storage, durable command deduplication, coordinated cutover, and rollback."
---

# Migration to 1.0

`@nestarc/idempotency` **1.0.0**, released October 7, 2026, changes request identity and response storage as well as public imports. This guide summarizes the [version-pinned migration runbook](https://github.com/nestarc/idempotency/blob/v1.0.0/docs/migration-1.0.md) and the released [1.0 README](https://github.com/nestarc/idempotency/blob/v1.0.0/README.md#upgrading-from-04-to-10). The runbook's introductory “unreleased” wording is historical; the tagged package and changelog identify 1.0.0.

## Required deployment boundary

Use **both a separate verified empty storage namespace and durable business deduplication covering commands handled by either version**. Pause protected traffic and redelivery, reconcile outstanding work, and replace all writers before resuming.

A rolling deployment with old/new writers processing the same business commands is unsupported, even with different Redis prefixes or Postgres tables: independent cache locks can both acquire the command. Empty storage avoids mixing response formats but makes old commands cache misses. Business command history must prevent those misses from repeating earlier side effects.

## Changes to review

| Contract | 0.4 → 1.0 change | Action |
| --- | --- | --- |
| Runtime | Node 22/24 replaces Node 20+ support. | Upgrade runtime; use Nest 10/11 and its matching HTTP adapter. |
| Imports | Redis/Postgres APIs leave the root export. | Use `/redis` and `/postgres`; install only your driver and PG type peer when needed. |
| Storage addresses | Every scope uses a versioned SHA-256 tuple address. No legacy fallback, move, or deletion. | Use a separate empty namespace; preserve old records for investigation. |
| Custom scope | String or identity array adds to method + actual path instead of replacing the endpoint. | Use verified identities and audit deliberate cross-endpoint sharing. |
| Response bodies | Opaque `@nestarc/idempotency:replay:v1:` encoding, including empty responses. | Custom adapters preserve strings exactly; do not convert old JSON records. |
| Response pipeline | Capture final supported plain JSON after successful Observable completion. | Put idempotency before serializers. Unsupported values retain the processing lease. |
| Key validation | Strict raw header, UTF-8 byte limit, repeated/comma-joined keys rejected. | Correct producers; optional routes still reject invalid keys. |
| TTL and completion | Integer seconds 1–2,147,483,647; only a live processing owner completes once. | Update custom adapters and direct calls, including validation before any storage access. |
| Observability | `event.scope` becomes hashed `namespace`; errors expose fixed classifications. | Update consumers from `error.message`/driver fields to `error.code` and `error.operation`. |
| Sweep injection | `PostgresSweepService` injects `IDEMPOTENCY_STORAGE`. | Manual provider graphs must bind that token to the configured adapter. |

The default fingerprint algorithm is unchanged: stable JSON SHA-256 over `body ?? null`. A custom fingerprint still receives `{ context, key, scope, body, defaultFingerprint }`, but `scope` now contains the encoded storage address. Audit any resolver that interprets or concatenates it. It is different from the observation `namespace`.

Defaults remain `ttl: 86400`, `processingTtl: ttl`, `scope: 'endpoint'`, `fingerprint: true`, `maxKeyLength: 255`, and enabled status headers. There is no automatic lease renewal, migration API, or dual reader.

## Prepare application and rollback artifacts

Update imports:

```typescript
import {
  IDEMPOTENCY_STORAGE,
  IdempotencyModule,
  MemoryStorage,
  type IdempotencyEvent,
} from '@nestarc/idempotency';
import { RedisStorage } from '@nestarc/idempotency/redis';
import { PostgresStorage, PostgresSweepService } from '@nestarc/idempotency/postgres';
```

Only import adapters you use. Redis needs `ioredis ^5`; Postgres needs `pg ^8.11` and TypeScript consumers need `@types/pg ^8.11`. See [Installation](/packages/idempotency/installation) for module examples and supported compiler resolution.

Before cutover, deploy application-owned deduplication to the old, new, and prepared rollback artifacts. For a local database mutation, use a unique `(tenant_id, command_id)` ledger containing canonical business parameters and the result, committed in the same transaction as the business change. An external provider additionally needs provider deduplication and reconciliation for the gap between provider success and local commit.

Cover **past successful commands and all possible redeliveries**, including manual retry and rollback, not only new traffic. Backfill using authoritative business/provider evidence. Reject reuse of a command ID with changed parameters in every artifact. Existing cache records alone do not establish authenticated ownership or whether a side effect occurred.

If old commands cannot be mapped and reconciled, keep their redelivery blocked upstream and postpone the switch. Draining requests or waiting for cache TTL expiry alone does not satisfy this requirement.

## Coordinated cutover

1. Record old/new/rollback artifacts, storage locations, command-history retention, and application owner. Rehearse the actual deployment and provider recovery.
2. Pause ingress and queue/scheduled/webhook redelivery for protected commands. Fence every old writer, including workers and delayed jobs.
3. Let started work and storage writes settle. Reconcile uncertain outcomes against the durable ledger and provider; canceled requests or vanished pods do not prove canceled side effects.
4. Verify that new and rollback artifacts consult the same complete command history, validate semantic parameters, and authorize result retrieval.
5. Prepare a separate, verified empty physical storage namespace. Keep old records intact. Do not confuse the event's hashed `namespace` with a Redis prefix or Postgres table setting.
6. Replace all writers while traffic stays paused. Verify initialization, guard/serializer order, resource lifecycle, first execution, replay, and mismatch behavior.
7. Confirm that an old successful command returns the established business result without another side effect, and that a new command replays correctly. Resume only after all old writers are fenced and checks pass.

### Select an isolated store

| Adapter | Preparation |
| --- | --- |
| Redis | An unused prefix or separate store, checked while writers are fenced. Configure the same `keyPrefix` on every new instance. |
| Postgres | A new empty table with the existing schema, or a separate database. Configure the matching `tableName` and search path. |
| Memory | New storage instances after all old instances stop; keep durable command history outside the process. |

A new-looking Redis prefix is not proof of isolation: an old global raw key can overlap a new encoded address. Verify emptiness and prevent old writers from reaching it. `SCAN` is not a snapshot during concurrent writes; Redis Cluster requires checking all primaries. The [release runbook](https://github.com/nestarc/idempotency/blob/v1.0.0/docs/migration-1.0.md) provides executable Redis/Postgres checks.

### Postgres schema history

1.0 introduces **no new SQL column or data-conversion migration**. Provision a separate table using the existing schema; `response_body` remains `TEXT` and `response_headers` remains `JSONB`.

For historical 0.2 installations that never applied the 0.3 header migration, the old table needed:

```sql
ALTER TABLE idempotency_records
  ADD COLUMN IF NOT EXISTS response_headers JSONB;
```

This is not the 1.0 upgrade procedure. A newly provisioned 1.0 table already has the column; `CREATE TABLE IF NOT EXISTS` does not modify an existing table. Retain business-ledger schema and history across rollback.

## Rollback

Rollback is another coordinated cutover. Pause traffic and redelivery, fence new writers, settle started work, and reconcile uncertain commands. Deploy the prepared rollback artifact into another verified empty namespace compatible with its record format. It must use the same durable command history, including commands first handled by 1.0, and preserve parameter checks and authorization.

Verify both old and new command retries before resuming. Old code cannot read 1.0's response envelope. Preserve previous namespaces for controlled investigation rather than copying or rewriting cache records.

## Unsupported shortcuts

| Shortcut | Why it is unsafe |
| --- | --- |
| Old/new writers overlap, even with different stores | Separate locks permit concurrent business execution. |
| Read old records or add a dual-read alias fallback | Old records cannot prove current authenticated identity or safe serialization; exact-address overlap is also possible. |
| Flush cache, rotate prefixes, restart, or wait for TTL alone | A cache miss can re-execute a completed business command. |
| Convert/copy old bodies into the new envelope | The old result cannot establish safe capture or identity provenance. |
| Roll back to an artifact without the shared ledger | New-version business effects still exist after its cache records expire. |
| Assume timeout/cancellation stopped the provider | Work can still commit later. Reconcile or keep the command blocked. |

Do not force-unlock records to clear `409` or invent a new command ID to bypass `422`. Return confirmed results through authorized business reconciliation when cache replay is unavailable. See [Failure and recovery](/packages/idempotency/how-it-works#failure-and-recovery).
