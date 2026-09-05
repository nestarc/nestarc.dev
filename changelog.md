---
title: "nestarc Changelog: NestJS Package Releases"
description: "Release notes and version history for @nestarc NestJS packages, including Prisma compatibility, fixes, migrations, and new features."
---

# nestarc Changelog: NestJS Package Releases

Version history for all nestarc packages. Each package follows [Semantic Versioning](https://semver.org/).

## @nestarc/tenancy

### 0.16.0 — 2026-08-30

- Breaking: Node.js now requires `^22.13.0 || ^24.0.0`; lifecycle event payloads remove raw `request` in favor of `requestSummary`.
- Generate schema-derived TEXT/UUID RLS predicates and a restrictive non-empty-context policy. Existing installations must review and reapply generated SQL; unusual or long identifiers now use collision-resistant names.
- Reject invalid tenant-column mappings during scaffolding; share the module's validated `dbSettingKey` across runtime extensions and transactions.
- Add sync/async `TenantIdValidator` support to RPC restoration and redacted invalid-context diagnostics.
- Fix cache-manager 2.x synchronous keys, UUID reset casts, empty TEXT tenant access, and atomic/sequential SQL application.
- Verify Prisma 6.19.3/7.10.0 and the published NestJS 11/Prisma 7 ecosystem lane. Transparent interactive transactions remain deprecated through 0.16.x and are scheduled for removal in 0.17.

[Release source](https://github.com/nestarc/nestjs-tenancy/blob/v0.16.0/CHANGELOG.md) · [Migration guide](/packages/tenancy/migration#upgrade-to-0-16)

### 0.15.0

- Added `tenancy doctor` to audit the live application role, RLS state and policies, tenant indexes, grants, and optional read-only tenant-isolation probes
- Added a real PostgreSQL and PgBouncer transaction-mode matrix for Prisma 6 and 7, covering commit, rollback, timeout, pool contention, backend reuse, and replacement
- Added one non-HTTP missing-context policy (`ignore`, `warn`, or `throw`) for propagators, interceptors, response caching, Redis/search resource keys, and search adapters
- Added `TenantResourceKey` and `TenantSearch` for collision-safe tenant resource IDs and fail-closed vendor-neutral search access
- Added `maxWait` forwarding to `tenancyTransaction()`; deprecated `interactiveTransactionSupport` in favor of the public-API helper
- Added a tarball-installed ecosystem compatibility release gate covering API Keys, RBAC, RLS, Outbox, Jobs, and Webhook flows

### 0.14.0

- Added first-class Prisma 7 support with Prisma Config, the `prisma-client` generator, explicit generated output, and PostgreSQL driver-adapter E2E coverage
- Added a Prisma 6 compatibility CI lane; Prisma 5 is no longer supported by tenancy
- Breaking: raised the minimum Node.js version to 20.19
- Fixed shared extension imports by using `@prisma/client/extension`

### 0.13.0

- Added `TenantCacheInterceptor` for Nest response cache keys scoped by the current tenant
- Added `@SharedTenantCache()` for routes that intentionally share cache entries across tenants
- Added `@nestarc/tenancy/cache` subpath exports and optional `@nestjs/cache-manager` / `cache-manager` peer metadata
- Kept the root `@nestarc/tenancy` entrypoint free of eager cache runtime imports
- Fixed NestJS 10 middleware wildcard registration while preserving NestJS 11 named wildcard support

### 0.12.0

- Breaking: removed deprecated flat cross-check options; use `crossCheck: { extractor, onFailed, required }`
- Added `engines.node` metadata for documented Node.js support
- Moved `prompts` to regular dependencies so the interactive CLI works in normal installs
- Made CLI shebang injection idempotent
- Added public API smoke coverage for root and testing entrypoints
- Added v0.12.0 cross-check migration guidance and clarified JWT extraction, `@BypassTenancy()`, `withoutTenant()`, and interactive transaction usage

### 0.8.0

- Microservice propagation: HTTP, Bull, Kafka, gRPC propagators
- `TenantContextInterceptor` for inbound context restoration
- `crossCheckExtractor` for tenant ID forgery prevention
- OpenTelemetry integration (opt-in)
- Error hierarchy: `TenantContextMissingError` base class
- CLI `check` command for drift detection
- Multi-schema support (`@@schema()` directives)

### 0.7.0

- `failClosed` mode for Prisma extension
- `interactiveTransactionSupport` option
- `tenancyTransaction()` helper for interactive transactions
- Event system via `@nestjs/event-emitter`

### 0.6.0

- `autoInjectTenantId` for create/upsert operations
- `sharedModels` to skip RLS for specific models
- `withoutTenant()` programmatic bypass
- ccTLD-aware subdomain extraction

### 0.5.0

- Initial public release
- 5 built-in extractors (Header, Subdomain, JWT Claim, Path, Composite)
- AsyncLocalStorage-based tenant context
- Prisma Client Extension with `set_config()`
- CLI `init` command for RLS scaffolding

---

## @nestarc/safe-response

### 0.15.0

- Added `createSafeException()` for typed `SafeException` subclasses from `defineErrors()` catalogs
- Added `ApiSafeCatalogError()` and `ApiSafeCatalogErrors()` Swagger decorators for catalog-backed error documentation
- Added `fieldSelection` support to composite decorators and `errorFormat: 'safe' | 'problem'` for explicit error schema selection
- Added `maxFields` and `maxFieldLength` field selection quotas
- Hardened field selection against inherited properties and reserved path segments such as `__proto__`, `prototype`, and `constructor`
- Tightened pagination and rate-limit metadata validation, and avoided double-writing already-sent Express/Fastify error responses

### 0.14.0

- Field selection / partial response support via Google-style `?fields=id,name,address.city`
- `@FieldSelection()` decorator and global `fieldSelection` module option
- Error catalog support with `defineErrors()` and `SafeException`
- API version metadata via the `version` module option
- Automatic `StreamableFile` detection to skip response wrapping for file downloads
- New client guard: `hasFieldSelection()`

### 0.13.1

- Rate limit metadata mirroring (`X-RateLimit-*` headers)
- `nestjs-cls` integration for context injection

### 0.13.0

- API deprecation (`@Deprecated()` decorator) with RFC 9745/8594 headers
- Composite decorators: `@SafeEndpoint()`, `@SafePaginatedEndpoint()`, `@SafeCursorPaginatedEndpoint()`

### 0.12.0

- RFC 9457 Problem Details support
- Frontend client types (`@nestarc/safe-response/client`)
- `nestjs-i18n` integration

### 0.11.0

- Request ID tracking
- Response time in meta
- Cursor pagination support (`@CursorPaginated()`)

### 0.10.0

- Initial public release
- Automatic response wrapping
- Error standardization
- Offset pagination metadata
- Swagger integration

---

## @nestarc/audit-log

> **Current documentation status (2026-08-28): Supported for atomic automatic tracking.** The
> support claim is limited to `atomic-required` writes executed through `withAuditTransaction()`.
> Explicit `best-effort` remains an intentionally non-atomic compatibility mode outside that
> claim. Manual `AuditService.log(input, tx)`, query, export, retention, partitioning, and schema
> utilities keep their documented supported contracts.

### 0.5.0

- Breaking: removed the deprecated `experimentalTxAudit` private-routing option; migrate authoritative automatic tracking to `atomic-required` plus `withAuditTransaction()`, while explicit `best-effort` remains non-atomic
- Breaking: dropped Node.js 20 and now requires Node.js 22.13+ within the 22.x line or Node.js 24.x
- Added NestJS 12.0.1+ support while retaining NestJS 10/11 compatibility, with NestJS 12 and Prisma 5/6/7 peer-matrix coverage
- Added a consumer-owned PostgreSQL ecosystem gate for the exact published tenancy, audit-log, and soft-delete tuple and the packed audit-log candidate
- Promoted `atomic-required` automatic tracking through `withAuditTransaction()` from Preview to Supported after the coordinated tenancy 0.15.0, audit-log 0.5.0, and soft-delete 0.7.1 PostgreSQL release gate
- Upgraded the repository lint gate from ESLint 9 to ESLint 10
- Updated CI and release workflows to Node.js 24-based GitHub Actions and retained npm provenance publishing
- Isolated `AuditStreamRunner` observability hooks from delivery control flow: synchronous throws, rejected thenables, and mutation of reported errors no longer alter retry, DLQ, or checkpoint semantics; completed retry backoffs also remove their abort listeners
- Resolved the installed NestJS major without importing the private `@nestjs/core/package.json` subpath, which is unavailable under NestJS 12 package exports
- Preserved the original database failure as the error `cause` when partition pruning fails
- See the [v0.5.0 release](https://github.com/nestarc/nestjs-audit-log/releases/tag/v0.5.0) and [full comparison](https://github.com/nestarc/nestjs-audit-log/compare/v0.4.1...v0.5.0)

### 0.4.1

- Added `getAuditCapabilities()` so cross-package lifecycle integrations fail closed unless the client advertises `atomic-required` consistency and atomic lifecycle support
- Scoped lifecycle suppression to the matching outer delete operation and removed failed callback tokens, preventing one caught lifecycle failure from suppressing a later physical-delete audit
- Rejected `withAuditLifecycle()` on best-effort clients before invoking the lifecycle callback
- See the [v0.4.1 release](https://github.com/nestarc/nestjs-audit-log/releases/tag/v0.4.1) and [full comparison](https://github.com/nestarc/nestjs-audit-log/compare/v0.4.0...v0.4.1)

### 0.4.0

- Breaking: `AuditExtensionOptions.consistency` is required; select `atomic-required` or explicitly opt into legacy `best-effort`
- Added `createAuditedClient()` and typed `withAuditTransaction()` so tracked writes, pre/post reads, and audit inserts commit or roll back in one official Prisma interactive transaction
- Added row-locked single-record diffs, bounded record-level atomic `deleteMany`, mapped database identifiers, nested-write safeguards, and the audit-side `withAuditLifecycle()` bridge
- Added `AuditService.scan()` with resumable checkpoints, a fixed high-watermark, bounded batches, tenant-explicit scope, filters, and cancellation
- Added backpressure-aware `AuditService.exportCsv()` with a versioned CSV schema, canonical JSON, RFC 4180 records, and spreadsheet formula-injection defense
- Added host-scheduled `AuditStreamRunner`, persistent PostgreSQL checkpoints/DLQ, HTTP and object-storage sinks, Datadog/Splunk mappings, bounded retries, metrics, and at-least-once delivery
- Added retention checkpoint guards, recursive sensitive-key redaction, stricter input validation, and database-hardening guidance
- Compatibility at the time of this release: the then-published `@nestarc/soft-delete` 0.6.0 did not expose the matching lifecycle options, so applications used its event/manual transaction path until 0.7.0 became available
- See the [v0.4.0 release](https://github.com/nestarc/nestjs-audit-log/releases/tag/v0.4.0) and [full comparison](https://github.com/nestarc/nestjs-audit-log/compare/v0.3.0...v0.4.0)

### 0.3.0

- Added Prisma 7.9 primary development and CI coverage with Prisma Config, generated client output, and the PostgreSQL driver adapter
- Retained declared Prisma 5/6 peer compatibility and raised the minimum Node.js version to 20.19
- Fixed Prisma 7 driver-adapter deserialization in partition setup and pruning by casting PostgreSQL catalog `relkind` values to text
- Clarified that automatic auditing in array `$transaction([...])` calls is best-effort and can leave an orphan success row when the batch rolls back

### 0.2.0

- Breaking: `createAuditExtension({})` now audits all Prisma models by default; set `trackedModels` or `ignoredModels` explicitly to narrow scope
- Breaking: `trackedModels: []` now audits no models, even when `ignoredModels` is also set
- Added `onAuditError`, `logger`, `logFailures`, `ignoreTimestampOnlyUpdates`, `tenantResolver`, `sensitiveFieldsByModel`, and custom `prismaModule` options
- Added async actor extraction, route exclusions, correlation ID metadata, public `AuditInterceptor` / `AuditActorMiddleware` exports, and `@AuditReason()`
- Added dynamic audit table SQL with schema-qualified table names, trigger append-only enforcement, optional GIN indexes, monthly partitions, and `ensurePartitions()`
- Added `AuditService.prune()` for flat-table and partitioned retention maintenance
- Added Query API v2 with deterministic keyset cursors, optional totals, `getById()`, explicit `tenantId`, and `allTenants` admin reads
- Documented the transaction contract: automatic audit inserts are best-effort outside caller transactions unless `experimentalTxAudit` is enabled
- Fixed primary-key projection handling, wildcard escaping, audit pre-read failure handling, and Nest 11 middleware wildcard warnings

### 0.1.0

- Initial release
- Automatic CUD tracking via Prisma `$extends`
- Before/after diffs with deep JSON comparison
- Sensitive field masking
- Manual logging API with transaction support
- Query API with wildcard filters
- `@NoAudit()` / `@AuditAction()` decorators
- Append-only PostgreSQL storage
- Multi-tenant integration with `@nestarc/tenancy`

---

## @nestarc/feature-flag

### 0.5.0

- Moved the package to Prisma 7 as its supported Prisma major
- Updated generation to the `prisma-client` generator with explicit output and moved CLI connection configuration to `prisma.config.ts`
- Updated PostgreSQL tests, benchmarks, and examples to use `@prisma/adapter-pg`
- Raised the Node.js requirement to 20.19+, 22.12+, or 24+
- No database migration is required for this release

### 0.4.0

- Added detailed `evaluateBoolean()` results, invocation and guard fallbacks, explicit rollout targeting keys, and type-safe flag registries
- Added opt-in exposure events, richer mutation metadata, test registry helpers, and a boolean OpenFeature provider
- Kept the legacy rollout bucket fallback when no explicit targeting key or bucket field is configured

### 0.3.0

- Published v0.3.0 release
- See the [GitHub compare](https://github.com/nestarc/nestjs-feature-flag/compare/v0.2.0...v0.3.0) for detailed changes

### 0.2.0

- **Pluggable cache adapters** — `CacheAdapter` interface with `MemoryCacheAdapter` (default) and `RedisCacheAdapter`
- **Redis Pub/Sub** — cross-instance cache invalidation via SCAN-based flush
- **Admin REST API** — `FeatureFlagAdminModule` with mandatory guard injection (7 endpoints)
- **Repository pattern** — `FeatureFlagRepository` interface with `PrismaFeatureFlagRepository` default
- **Tenant context provider** — `TenantContextProvider` interface with automatic `@nestarc/tenancy` integration
- `findByKey()` and `removeOverride()` methods on `FeatureFlagService`
- All cache operations are now async (`CacheAdapter` interface)
- `cacheAdapter` option added to `FeatureFlagModuleOptions`
- `setOverride()` throws `NotFoundException` instead of generic `Error`
- Admin endpoints return proper 404/409 status codes instead of 500
- Override race conditions resolved (concurrent set/delete no longer 500)

### 0.1.0

- Initial release
- Database-backed feature flags
- `@FeatureFlag()` guard decorator
- `@BypassFeatureFlag()` decorator
- Percentage rollouts with murmurhash3
- Tenant / user / environment overrides
- 6-layer evaluation cascade
- Built-in caching with TTL
- Event system via `@nestjs/event-emitter`
- `TestFeatureFlagModule` for testing

---

## @nestarc/soft-delete

### 0.7.2 — 2026-08-30

- Expand the optional tenancy peer to `^0.15.0 || ^0.16.0`, verified with strict packed installs and PostgreSQL composition on Node 22.13/24.
- The atomic audit lifecycle contract remains unchanged; installations composed with tenancy 0.16 inherit its newer Node requirement.

[Release source](https://github.com/nestarc/nestjs-soft-delete/blob/v0.7.2/CHANGELOG.md)

### 0.7.1

- Extended the optional `@nestarc/audit-log` peer range to `^0.4.1 || ^0.5.0`; both lines use the same fail-closed atomic lifecycle capability handshake, with no soft-delete runtime behavior change

### 0.7.0

- Added opt-in `auditLifecycle: 'atomic-required'` integration with `@nestarc/audit-log`, using the fixed tenancy → audit-log → soft-delete extension order and `withAuditTransaction()`
- Added deterministic `Model.softDeleted`, `Model.restored`, and `Model.purged` audit actions with record-level cascade and bulk metadata
- Added the fail-closed `auditMaxBatchRecords` cap for atomic `deleteMany` and `restoreMany` conversion
- Added PostgreSQL cross-package coverage for commit, rollback, repeated operations, restore, purge, cascade, bulk mutation, cap overflow, and tenant metadata against audit-log 0.4.1 and tenancy 0.15.0
- Added real optional peer contracts for audit-log, tenancy, and event-emitter integrations
- Hardened repeated and concurrent lifecycle mutations so state, relation, timestamp, and custom-primary-key predicates fail closed instead of emitting misleading evidence

### 0.6.0

- Added Prisma 7 to the peer range and made it the primary generated-client and PostgreSQL E2E target
- Updated Prisma 7 setup to use Prisma Config, explicit generated output, and the PostgreSQL driver adapter
- Shared extensions now import from `@prisma/client/extension`
- Breaking for cascade/relation filtering setup: pass explicit `dmmf` metadata instead of relying on generated-client runtime metadata

### 0.5.0

- Added opt-in active-only filtering for to-many Prisma `include` and `select` trees
- Added `@WithDeletedRelations(...paths)` for exact relation-path exceptions
- Added `SoftDeleteService.restoreMany()` with cascade restore and optional event counts
- Added PostgreSQL, SQLite, and MySQL recipes for uniqueness among active rows
- Added NestJS 10 + Prisma 5 and NestJS 11 + Prisma 6 compatibility coverage
- Fixed `deleteMany()` so already soft-deleted rows keep their original deletion timestamp
- Added lint and package-content verification to the release workflow

### 0.4.0

- Stability release with PostgreSQL-backed E2E coverage for cascade soft-delete, cascade restore, purge, lifecycle events, and full NestJS HTTP integration
- Fixed cascade restore so nested soft-deleted descendants restore through a `withDeleted` context
- Hardened NestJS DI metadata for interceptor and optional event emitter injection
- Release workflow now runs PostgreSQL E2E before npm publish
- Excludes `dist/.tsbuildinfo` from the npm package

### 0.3.0

- Added explicit `dmmf` configuration for runtimes that do not expose `Prisma.dmmf`
- Added `CascadeDmmfMissingError`
- Fixed cascade setup so missing DMMF fails early instead of silently disabling cascade

### 0.2.0

- Cascade soft-delete and restore
- `forceDelete()` for hard deletes
- `purge()` with scheduled cleanup
- Standalone `createPrismaSoftDeleteExtension`

### 0.1.0

- Initial release
- Automatic soft-delete via Prisma extension
- Transparent query filtering
- `@WithDeleted()`, `@OnlyDeleted()`, `@SkipSoftDelete()` decorators
- Actor tracking (`deletedByField`)
- Lifecycle events

---

## @nestarc/pagination

### 0.3.0

- Added Prisma 7 generated-client type verification and PostgreSQL offset/cursor smoke tests in CI
- Made Prisma 7 the primary development target while retaining Prisma 5/6 peer compatibility
- Updated standalone Prisma setup to use Prisma Config, an explicit generated client, and the PostgreSQL driver adapter
- Reran performance measurements with Prisma 7.9.1 and PostgreSQL 16

### 0.2.0

- Added stable keyset cursors for non-unique sort columns with tie-breaker columns
- Added exact, omitted, and custom count strategies
- Added endpoint-aware Swagger query documentation and `withDeleted` query pass-through

### 0.1.0

- Initial release
- Offset + cursor pagination
- 12 filter operators
- Multi-column sorting with null positioning
- Full-text search
- Column/operator whitelisting
- Swagger auto-documentation
- Standalone `paginate()` function
- `TestPaginationModule` for testing

---

## @nestarc/idempotency

### 0.4.0

- Added `processingTtl` for separate in-flight PROCESSING leases and completed replay TTLs
- Added `keyResolver`, `maxKeyLength`, and custom fingerprint resolvers for webhook event ids, command ids, and semantic request fingerprints
- Added `observability.onEvent`, `Idempotency-Status`, and `Idempotency-Replayed` response headers
- Exported `PostgresStorage` from the storage barrel
- Clarified draft-07-compatible behavior and the HTTP-boundary guarantee

### 0.3.0

- Stable JSON request fingerprinting so object key order does not cause false 422 responses
- Safe response header capture and replay for `Content-Type`, `Location`, `ETag`, `Cache-Control`, and `X-*` headers
- Fastify adapter E2E verification
- Real Redis smoke coverage in CI
- Default endpoint scoping now uses the actual request path without query string
- Postgres migration: add `response_headers JSONB` to existing idempotency records

### 0.1.3

- Token-based compare-and-set for TTL-expiry race prevention
- Per-endpoint key scoping via `PATH_METADATA` (HTTP_METHOD /route:: prefix)
- TTL boundary validation (positive integer only)
- Concurrent duplicate regression coverage
- Transient `storage.complete()` failure no longer causes duplicate execution

### 0.1.0

- Initial release
- IETF `httpapi-idempotency-key-header-07` state machine (400 / 409 / 422)
- `@Idempotent()` decorator with per-handler overrides
- `IdempotencyInterceptor` with opt-in wiring (global / controller / method)
- `MemoryStorage` and `RedisStorage` adapters
- SHA-256 request body fingerprint
- Response replay (status code + body)
- Configurable scope (`endpoint` / `global` / custom function)
- Binary response detection and bypass

---

## @nestarc/outbox

### 0.3.0 — 2026-09-05

- Breaking: move to Node 22/24, drain old pollers, and apply `upgrade-to-current.sql` before deployment. Startup checks the required schema with `OUTBOX_SCHEMA_MISMATCH` diagnostics.
- Claim one record on demand using renewable PostgreSQL leases and fenced completion; persist retry eligibility in `next_attempt_at` with bounded `retry.maxDelay`.
- Add privileged `OutboxOperatorService`, fixed tenant admin scopes, cursor pagination, and structured compare-and-set mutation outcomes.
- Add tenant provenance policies and explicit `tenantScope: 'global'`; reject invalid envelopes before SQL and prevalidate/chunk bulk inserts.
- Move async transport/provider registrations outside factory results; expose only root APIs and documented fresh/current SQL paths.
- Coalesce polling/notification/manual triggers, recover listener connections with capped backoff, and isolate callback snapshots. Delivery remains at-least-once with no FIFO or downstream-completion guarantee.
- Support NestJS 12 with Schedule 12 and retain NestJS 10/11 plus Prisma 5/6/7 consumer coverage.

[Release source](https://github.com/nestarc/outbox/blob/v0.3.0/CHANGELOG.md) · [Migration](/packages/outbox/installation#upgrade-from-0-1-x-or-0-2-x-to-0-3)

### 0.2.1 — 2026-08-30

- Add Prisma 7 peers and a driver-adapter E2E path, retain Prisma 6, and verify the strict packed NestJS 11/Prisma 7 consumer.

### 0.1.0

- Initial release
- Prisma-native transactional outbox table and SQL migration
- Polling with `FOR UPDATE SKIP LOCKED` for multi-replica safety
- `@OnOutboxEvent()` decorator and type-safe event classes
- Fixed and exponential retry backoff strategies
- Stuck event recovery and graceful shutdown
- Local transport plus custom transport adapter support

---

## @nestarc/webhook

### 0.13.1 — 2026-08-30

- Add Prisma 7 support to the default PostgreSQL repositories and verify the exact NestJS 11.2.1/Prisma 7.10.0 packed consumer.
- Retain the independent Prisma 6.19.3 legacy database lane.
- Fix retention purge queries by casting cutoff parameters to `timestamptz` for the Prisma 7 PostgreSQL adapter.

[Release source](https://github.com/nestarc/webhook/blob/v0.13.1/CHANGELOG.md)

### 0.13.0

- Added idempotent event publishing with optional correlation IDs
- Added bounded bulk retry and event replay administration APIs
- Added worker concurrency, backlog draining, observer callbacks, and backlog diagnostics
- Added payload/response redaction hooks and configurable retention purge operations
- Added timestamp-tolerant signature verification and completed the secret-rotation overlap workflow

### 0.12.1

- Fixed successful-delivery circuit-breaker resets to avoid rewriting already-healthy endpoint rows
- Reduced `webhook_endpoints` row-lock contention during high-throughput worker scale-out

### 0.2.0

- Outbound webhook delivery with endpoint, event, and delivery tables
- HMAC-SHA256 signatures using Standard Webhooks-compatible headers
- Exponential retry schedule with jitter and circuit breaker support
- Dead letter queue and full delivery-attempt logs
- Multi-instance safe polling with `FOR UPDATE SKIP LOCKED`
- SSRF defenses for endpoint registration and dispatch
- Ports/adapters architecture for Prisma and fetch customization

---

## @nestarc/api-keys

### 0.4.0 — 2026-08-31

- Add `authorizeRequest()` for environment/IP/scope authorization; guard denials no longer touch usage timestamps or emit successful usage events.
- Add tenant-bound revoke/rotate operations, atomic one-winner rotation, and an exported framework-independent storage contract runner.
- Return safe `ApiKeySummary[]` management lists; validate namespace, scope, tenant, time, and expiration inputs before mutation.
- Authenticate secrets before exposing lifecycle state, bind the raw environment segment to stored identity, and isolate observer/context-writer mutations.
- Add separate authorization-denial and prefix-collision metrics; `ApiKeyError` now extends Nest `HttpException` with a safe status/code response.
- Breaking: require Node `^22.13.0 || ^24.0.0` and TypeScript 5.3+, use root imports, and migrate custom `rotate()` adapters to atomic `'rotated' | 'not_rotatable'` results.
- Support NestJS 10/11/12 with Prisma 5/6/7 storage verification and a Prisma-free custom/in-memory path.

[Release source](https://github.com/nestarc/api-keys/blob/v0.4.0/CHANGELOG.md) · [Upgrade checklist](/packages/api-keys/installation#upgrade-to-0-4)

### 0.3.2 — 2026-08-30

- Add Prisma 7 PostgreSQL storage support, NestJS 11 peers, and packaged legacy/Prisma 7 schema and config examples with strict consumer verification.

### 0.3.1

- Expanded the optional `@prisma/client` peer range to `^5.0.0 || ^6.0.0`
- Added real PostgreSQL storage-contract coverage for CRUD, tenant isolation, field mapping, rotation, and transaction rollback
- Added matching Prisma 5.22.0 and 6.19.3 pre-release verification plus a strict tarball consumer install on Prisma 6

### 0.3.0

- Added per-key IPv4, IPv6, and CIDR allowlists through `allowedIpCidrs`
- Added an injectable `clientIpResolver`; restricted keys fail closed when a valid client IP cannot be resolved
- Added low-cardinality `api_key.verification` metrics through `onMetric`, with isolated sink failure reporting through `onMetricError`
- Added `createTestKey()` for consumer integration tests
- Added compatibility coverage and guidance for `@nestarc/rbac` API-key subject resolution
- Updated the Prisma example with `allowedIpCidrs String[] @default([])` and restored the benchmark smoke check in CI

### 0.2.0

- Added zero-downtime user key replacement through `ApiKeysService.rotate()` and rotation metadata
- Added lifecycle hooks for create, revoke, rotate, authentication failure, and opt-in usage events
- Added TTL policy controls for default expiry, maximum expiry, and disallowing non-expiring keys
- Added `@CurrentApiKey()`, `getApiKeyContext()`, `contextWriter`, and a safe key prefix in the request context
- Extended the storage contract with `findById()` and atomic `rotate()` support

### 0.1.0

- Initial release
- Stripe-style key format with indexable prefixes
- SHA-256 hashing with versioned pepper rotation
- Live/test environment isolation
- Scope guards and tenant-scoped key context

---

## @nestarc/rbac

### 0.2.2 — 2026-09-02

- Reconcile populated user, RBAC subject, API-key, and tenant sources; conflicting identities fail closed. `request.apiKey` is canonical and configured tenant resolvers are authoritative by default.
- Make stacked guard audit events reflect the final RBAC request decision and emit mutation success events only for committed changes in capable adapters.
- Add producer-specific service decision types, optional mutation results, and indexed role lookup for strict assignment. `updateRole()` no longer creates missing roles.
- Validate runtime modes and records, preserve exact API-key identities, document HTTP-only guards and transport-neutral service checks, and deprecate legacy resolver/custom-storage fallbacks.
- Expand NestJS peers through 12 with strict NestJS 10/11/12 and Prisma 5/6/7 evidence on Node 22/24.

[Release source](https://github.com/nestarc/rbac/blob/v0.2.2/changelog.md)

### 0.2.1 — 2026-08-30

- Add Prisma 7 driver-adapter support, retain Prisma 6 regression coverage, and verify the packed NestJS 11/Prisma 7 consumer.

### 0.2.0

- Added `defineRbacPermissions()` for typed permission contracts without changing persisted string values
- Added `createStrictRbacOptions()` for fail-closed metadata, tenant, storage-error, and write-validation defaults
- Added safe optional `RbacDecision.details` for server-side decision tracing
- Added policy-change publisher hooks for successful role, permission, and binding mutations
- Added `@nestarc/rbac/integrations/audit-log` with secret-shaped metadata sanitization
- Added `expectDeniedReason()`, `createRbacScenario()`, and `expectRbacMatrix()` testing helpers
- Kept the 0.1 Prisma schema and string-permission APIs compatible

### 0.1.0

- Initial public release of tenant-aware RBAC primitives for NestJS SaaS applications
- Optional Prisma/PostgreSQL persistence through `@nestarc/rbac/prisma`
- `PrismaRbacStorage` implementation of the `RbacStorage` contract
- Prisma schema example and initial RBAC SQL migration for consuming applications
- Public testing helpers through `@nestarc/rbac/testing`
- Optional integration helpers for `@nestarc/tenancy` and `@nestarc/api-keys`
- Audit event emission for RBAC write operations and denied guard decisions
- `tenant.allowGlobalRolesInTenant` support for explicit global-role opt-in
- Multi-entry ESM, CJS, and type declaration output
- Documentation for installation, guards, Prisma setup, testing utilities, and integrations

---

## @nestarc/mcp-guard

::: info Labs tooling
`@nestarc/mcp-guard` is published under the @nestarc npm scope, but it is separate from the NestJS SaaS package lineup.
:::

### 0.2.0

- Discovery mode for Cursor, VS Code, Claude Code, and Claude Desktop MCP config locations
- Discovery options: `--client`, `--scope`, and `--list-targets`
- Aggregate JSON schema v2 and grouped text output
- Server normalization now preserves `headers`, `envFile`, and `type` fields
- `MCPG001` scans secret-like header keys as well as environment variables

---

## @nestarc/data-subject

### 0.1.0

- Initial release
- Declarative entity registry for export and erase policies
- `DataSubjectService` lifecycle for request lookup, export, and erase
- Delete, anonymize, retain, and mixed strategies per field
- Legal retention support with explicit basis and retention windows
- Prisma executor plus in-memory request and artifact stores
- Outbox-style event publisher integration

---

## @nestarc/jobs

### 0.4.0 — 2026-09-05

- Add BullMQ `producer`, `worker`, and `both` roles, bootstrap handler validation, tenant-filtered status reads, worker error observers, and explicit terminal-retention cleanup.
- Run in-memory work in a bounded pool (default 10) with module-wide tenant limits and per-type caps; use `poolSize: 1` for prior serial behavior.
- Validate options before identity reservation and normalize portable JSON values. Custom backend completions now require activation fencing.
- Keep timed-out handlers owned until settlement; close in-memory admission before draining accepted work and report incomplete shutdown with `JobsShutdownError`.
- Fake drains now reject exhausted iteration budgets with `jobs_drain_limit_exceeded`; history snapshots are detached.
- Default first-party outbox dedupe to tenant scope when a tenant exists; preserve canonical source lineage despite mapping callback mutation. Deprecate `JobsOutboxBridge`.
- Support Node 22/24; raise optional peers to BullMQ `^5.76.2` and Outbox `^0.2.1 || ^0.3.0`. Source-poller shutdown still requires explicit orchestration.

[Release source](https://github.com/nestarc/jobs/blob/v0.4.0/CHANGELOG.md) · [Upgrade guide](/packages/jobs/backends#upgrading-to-0-4)

### 0.3.1

- Deferred `@JobHandler()` discovery until application bootstrap, after provider construction and `onModuleInit()` hooks complete
- Started in-memory and BullMQ consumers only after handler registration, so work queued before `app.init()` waits for initialized handlers
- Made request/transient-scoped handlers and singleton handlers with non-static dependency trees fail explicitly during bootstrap

### 0.3.0

- Added `createOutboxJobsPublisher()` for first-party `@nestarc/outbox` integration, preserving tenant, correlation, causation, and event lineage while using the outbox record ID as stable job identity
- Made BullMQ execution restart-safe by registering declared queues and persisting context, metadata, `scheduledFor`, backoff, idempotency, and dedupe lineage in Redis, with backward reads for queued 0.2 jobs
- Added Redis-backed job-type idempotency and global/tenant dedupe, accurate created-vs-deduped results, capped exponential backoff with jitter, and graceful producer/worker shutdown
- Hardened in-memory fairness, delayed work and retry ordering, DLQ replay state restoration, lifecycle event isolation, and mutation-isolated lifecycle snapshots
- Aligned typed handlers with `handle(payload, context)`, applied typed job defaults at runtime and in `FakeJobsService`, and added explicit `jobs_capability_unsupported`, `jobs_backend_closed`, and `jobs_identity_conflict` errors
- Breaking for BullMQ upgrades: use a coordinated stop-and-restart cutover rather than mixed 0.2/0.3 workers, use a dot-free namespace, and require BullMQ `^5.74.1` with Node.js 20, 22, or 24 and NestJS 10 or 11
- Compatibility: typed payloads and contexts must be plain objects, `__nestarcJob` is now reserved, generated idempotency job IDs are hashed, and unsupported BullMQ timeout/history/DLQ/manual-drain operations now fail explicitly

### 0.2.0

- Added typed job contracts with `defineJobs()`, `job()`, `TypedJobsService`, `TypedJobHandler`, `JobInstance`, and `InjectJobs()`
- Added backend capability reporting plus normalized status and history APIs
- Added in-memory retry, backoff, cooperative timeout, idempotency keys, tenant/global dedupe, and dead-letter list/replay/discard operations
- Added `enqueueDetailed()` for distinguishing created and deduped enqueues, lifecycle event hooks, and deterministic delayed-job testing with `createFakeJobs()` and `FakeClock`
- Preserved the 0.1 module, decorator, and string-based enqueue APIs
- BullMQ remained standard FIFO without distributed tenant fairness or DLQ administration; timeout cancellation remained cooperative and could not stop synchronous CPU-bound handlers

### 0.1.0

- Initial release
- In-memory backend with weighted tenant fairness and starvation protection
- BullMQ backend for Redis-backed production workers
- `@JobHandler()` provider discovery
- Context propagation through pluggable extractors and runners
- Outbox-to-jobs bridge
- `FakeJobsService` for deterministic tests
