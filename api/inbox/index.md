# @nestarc/inbox

**Curated API reference for the published `0.1.0` package, SQL schema v2.** This page summarizes the public declarations in the npm tarball. Follow [Installation](/packages/inbox/installation) for application setup, [Processing](/packages/inbox/processing) for transaction boundaries, and [Operations](/packages/inbox/operations) for recovery.

The [0.1.0 release](https://github.com/nestarc/inbox/releases/tag/v0.1.0) identifies source commit [`15b01813`](https://github.com/nestarc/inbox/tree/15b01813f009bb012f88a081bdd4a7705befc90e). The npm tarball was checked against the candidate from [CI run 40686580892](https://github.com/nestarc/inbox/actions/runs/40686580892); their SHA-512 digests match. This initial publication has no npm GitHub OIDC provenance, so this reference is maintained manually rather than labeled as provenance-verified TypeDoc output.

## Public imports

Import runtime APIs and types from `@nestarc/inbox`. The only additional package export paths are the two SQL assets listed below. Storage and worker implementation files are not public import paths.

```ts
import {
  InboxModule,
  InboxService,
  InboxAdminService,
  InboxPermanentError,
  createInboxTenancyContext,
  type InboxEnvelope,
  type InboxHandler,
  type InboxOptions,
} from '@nestarc/inbox';
```

The [public export list](https://github.com/nestarc/inbox/blob/15b01813f009bb012f88a081bdd4a7705befc90e/src/index.ts) includes the contracts described here. APIs and schema may change before 1.0.

## InboxModule

| Method | Contract |
| --- | --- |
| `InboxModule.forRoot(options: InboxOptions)` | Returns a NestJS `DynamicModule` using an application-owned Prisma client. |
| `InboxModule.forRootAsync(options: InboxModuleAsyncOptions)` | Accepts `imports`, `inject`, and a `useFactory` returning `InboxOptions` or `Promise<InboxOptions>`. |

`InboxOptions` requires `prisma`. Optional fields include `handlers`, `consumers`, `worker`, `maxPayloadBytes`, `maxPendingMessages`, `observer`, `handlerContext`, and `privilegedAdmin`. An ingress-only application needs an explicit non-empty `consumers` allowlist. The pending-message admission limit is approximate under concurrent acceptance.

Cross-tenant administration requires an explicit `privilegedAdmin: true` opt-in. With `forRootAsync`, set it on the module registration itself; a factory return alone cannot register that provider.

[Module source](https://github.com/nestarc/inbox/blob/15b01813f009bb012f88a081bdd4a7705befc90e/src/inbox.module.ts)

## InboxService

| Method or property | Result and purpose |
| --- | --- |
| `initialize(): Promise<void>` | Validates the installed SQL schema and initializes processing. Nest module initialization calls it automatically. |
| `accept(envelope: InboxEnvelope): Promise<InboxReceipt>` | Commits durable acceptance or returns an existing receipt. It does not wait for the business handler. |
| `runOnce(): Promise<number>` | Processes a bounded batch for managed workers or tests. |
| `close(): Promise<void>` | Stops the worker; Nest shutdown calls it automatically. It does not disconnect the application's Prisma client. |
| `admin: InboxAdminService` | Provides fixed tenant or global administration views. |
| `privilegedAdmin?: InboxPrivilegedAdminService` | Available only when privileged administration is enabled. |

### Envelope and receipt

`InboxEnvelope<T extends JsonValue>` requires `scope`, `source`, `consumer`, `messageId`, `eventType`, `schemaVersion`, and `payload`. Optional tracing fields are `correlationId`, `causationId`, and `headers` containing `traceparent` or `tracestate`.

`InboxScope` is `{ kind: 'tenant'; id: string }` or `{ kind: 'global' }`. Authenticate and authorize the scope before acceptance. The retained identity is **scope + source + consumer + message ID**. Matching content returns a duplicate without resetting its processing state; conflicting content throws `InboxConflictError`.

```ts
interface InboxReceipt {
  kind: 'accepted' | 'duplicate';
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'RETRYABLE' | 'COMPLETED' | 'DEAD';
}
```

Both receipt kinds permit transport acknowledgment after `accept()` resolves. A receipt confirms durable storage, not successful processing. If acceptance throws or its commit result is uncertain, preserve the identity for redelivery.

[Service source](https://github.com/nestarc/inbox/blob/15b01813f009bb012f88a081bdd4a7705befc90e/src/inbox.service.ts) · [Envelope and receipt types](https://github.com/nestarc/inbox/blob/15b01813f009bb012f88a081bdd4a7705befc90e/src/contracts/types.ts)

## InboxHandler and InboxContext

`InboxHandler<TPayload, TTx extends InboxTransaction>` declares `consumer`, `eventType`, `schemaVersion`, an optional synchronous `validate(payload)`, and `handle(payload, context): Promise<void>`. Validation must be side-effect free; returning `false` or throwing quarantines an invalid payload.

`InboxContext<TTx>` provides `tx`, `scope`, `messageId`, `source`, `consumer`, `inboxId`, `attempt`, and `signal`, plus optional correlation, causation, and replay metadata. Use your generated `Prisma.TransactionClient` as `TTx` to type business-model writes.

All business writes and optional outbox writes must use **`context.tx`** to commit with inbox completion. Handler invocation can repeat after failure; external requests, another database, and message ordering are outside this transaction guarantee. Honor `context.signal` when work can be interrupted.

[Handler contracts](https://github.com/nestarc/inbox/blob/15b01813f009bb012f88a081bdd4a7705befc90e/src/contracts/types.ts) · [Processing guide](/packages/inbox/processing)

## Worker options and observations

The worker is configured through `InboxOptions.worker`; there is no public worker class export.

| `InboxWorkerOptions` field | Default |
| --- | --- |
| `enabled` | `false` |
| `consumers` | Registered handler names |
| `concurrency` | `4` |
| `pollIntervalMs` | `1000` |
| `leaseMs` / `heartbeatIntervalMs` | `30000` / `5000` |
| `transactionTimeoutMs` / `transactionMaxWaitMs` | `10000` / `5000` |
| `lockTimeoutMs` / `shutdownTimeoutMs` | `1000` / `15000` |
| `maxAttempts` | `8` per retry cycle |
| `retryBaseMs` / `retryMaxMs` | `1000` / `300000` |

Worker-owned consumers must have registered handlers. Heartbeat interval must be less than half the lease; concurrency is bounded to 100. Pool capacity must cover handler transactions, ingress, and heartbeats.

`observer(event: InboxObservation)` receives `accepted`, `duplicate`, `completed`, `retry`, `dead`, `lease_lost`, or `error`, with optional `consumer` and `code`. The contract excludes payloads, tenant IDs, and raw exceptions.

[Option defaults and validation](https://github.com/nestarc/inbox/blob/15b01813f009bb012f88a081bdd4a7705befc90e/src/internal/options.ts)

## Administration

Use `InboxAdminService.forTenant(tenantId)` or `.forGlobal()` to create a fixed-scope `InboxAdminView`. A global view covers global messages, not every tenant. The application authorizes access before constructing the view.

| `InboxAdminView` method | Result and constraints |
| --- | --- |
| `get(recordId)` | `Promise<InboxRecord \| null>` within the view's scope. |
| `list(options?)` | `Promise<InboxPage>` with `records` and `nextCursor`; filters include `status`, `consumer`, `cursor`, and `limit`. |
| `stats()` | `Promise<InboxStats>` with status `counts` and `oldestPendingAt`. |
| `requeue(options)` | `Promise<InboxRecord>`; requires a DEAD record and its observed version. |
| `replay(options)` | `Promise<InboxReplayResult>`; creates an intentional new receipt from a retained COMPLETED payload. |
| `purgeCompletedPayload({ before, limit? })` | `Promise<number>`; removes eligible completed payloads while preserving receipt identity, fingerprint, and replay lineage. |

`InboxRequeueOptions` contains `id`, `expectedVersion`, `reason`, and `actor`. Supply the record's `rowVersion` as `expectedVersion`. Requeue resets the retry-cycle budget while retaining lifetime attempts and history.

`InboxReplayOptions` adds `requestId` and `targetConsumer`. Persist one UUID per intended operator request and reuse it after timeouts. `InboxReplayResult` contains `kind: 'accepted' | 'duplicate'` and the new `record`. A new request deliberately permits another business execution; it is not a reset of the original receipt. Deleting receipts ends their deduplication protection.

`InboxPrivilegedAdminService` extends the same view across scopes and is registered only with the explicit module opt-in. Protect it separately from tenant-facing administration.

[Administration source](https://github.com/nestarc/inbox/blob/15b01813f009bb012f88a081bdd4a7705befc90e/src/inbox-admin.service.ts) · [Recovery and retention](/packages/inbox/operations)

## Optional tenancy integration

`createInboxTenancyContext(options: InboxTenancyOptions)` returns an `InboxHandlerContextRunner` for `InboxOptions.handlerContext`. Pass the application's tenancy `context` and `tenancy` service; `global` defaults to `'reject'` and may be set to `'shared'`.

The adapter applies tenant context and the database setting on the existing handler transaction. Use the raw application Prisma client, install RLS policies separately, and run with an appropriate non-owner, non-`BYPASSRLS` role. The adapter does not authenticate an incoming tenant or grant authorization.

[Tenancy adapter source](https://github.com/nestarc/inbox/blob/15b01813f009bb012f88a081bdd4a7705befc90e/src/integrations/tenancy.ts)

## Errors

All exported error classes extend `InboxError`, which exposes a stable `code` string.

| Class | Default code |
| --- | --- |
| `InboxValidationError` | `INVALID_ENVELOPE` |
| `InboxConflictError` | `IDENTITY_CONFLICT` |
| `InboxReplayConflictError` | `REPLAY_CONFLICT` |
| `InboxPermanentError` | `PERMANENT_ERROR`; accepts an optional message and custom code |
| `InboxLeaseLostError` | `LEASE_LOST` |
| `InboxStateConflictError` | `STATE_CONFLICT` |
| `InboxBackpressureError` | `BACKPRESSURE` |
| `InboxSchemaError` | `SCHEMA_MISMATCH` |
| `InboxConfigurationError` | `INVALID_CONFIGURATION` |
| `InboxTimeoutError` | `PROCESSING_TIMEOUT` |

Map acceptance failures to your transport's retry or rejection policy. Permanent handler errors and exhausted retry cycles become DEAD; operators handle recovery through the scoped admin API.

[Error source](https://github.com/nestarc/inbox/blob/15b01813f009bb012f88a081bdd4a7705befc90e/src/contracts/errors.ts)

## SQL assets

- `@nestarc/inbox/sql/create-inbox-table.sql`: fresh schema v2 installation.
- `@nestarc/inbox/sql/migrate-v1-to-v2.sql`: migration for an existing local-development schema v1 installation.

Resolve these files with `require.resolve()` and apply them through the application's migration process before starting Inbox. Runtime schema checks do not create or upgrade tables. See [Installation](/packages/inbox/installation) for the migration boundary.
