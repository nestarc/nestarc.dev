---
description: "Version history and release notes for all @nestarc packages including tenancy, safe-response, audit-log, and more."
---

# Changelog

Version history for all nestarc packages. Each package follows [Semantic Versioning](https://semver.org/).

## @nestarc/tenancy

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
- Tenant-scoped key context and scope guards
- Live/test environment isolation
- Prisma and in-memory storage adapters
- Typed errors with stable error codes

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
