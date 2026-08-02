---
description: "Version history and release notes for all @nestarc SaaS packages and separate Labs tooling."
---

# Changelog

Version history for all nestarc packages. Each package follows [Semantic Versioning](https://semver.org/).

## @nestarc/tenancy

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

### 0.1.0

- Initial release
- Stripe-style key format with indexable prefixes
- SHA-256 hashing with versioned pepper rotation
- Live/test environment isolation
- Scope guards and tenant-scoped key context

---

## @nestarc/rbac

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

### 0.1.0

- Initial release
- In-memory backend with weighted tenant fairness and starvation protection
- BullMQ backend for Redis-backed production workers
- `@JobHandler()` provider discovery
- Context propagation through pluggable extractors and runners
- Outbox-to-jobs bridge
- `FakeJobsService` for deterministic tests
