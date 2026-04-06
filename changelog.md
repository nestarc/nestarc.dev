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
