// Maintained navigation copy for generated TypeDoc pages. Package versions and
// summaries come from package-catalog.mjs; signatures remain release-generated.
export const apiNavigation = {
  'data-subject': {
    guide: ['Policy model', 'policy-model'],
    modules: {
      'index.md': 'Register DataSubjectModule, define entity policies and executors, and call DataSubjectService for export or erasure requests. Includes storage contracts, Prisma adapters, lifecycle events, and error types.',
      'lint.md': 'Inspect Prisma schemas with parsePrismaSchema and lintPrismaSchema, format findings, and decide whether policy lint should fail a check. Use these helpers when validating entity-policy coverage.',
    },
  },
  'feature-flag': {
    guide: ['Agent guide and version boundary', 'agent-guide'],
    modules: {
      'index.md': 'Register FeatureFlagModule and use the service, guard, decorators, cache contracts, and admin APIs. Read the maintained version boundary before choosing targeting or tenant-context behavior.',
      'openfeature.md': 'Create the Boolean evaluation provider with createOpenFeatureBooleanProvider. This subpath documents its evaluation context and resolution details; it is not a reference for other OpenFeature value types.',
      'testing.md': 'Configure TestFeatureFlagModule and its controller with flag defaults and overrides for deterministic application tests.',
    },
  },
  pagination: {
    guide: ['Offset vs cursor pagination', 'offset-vs-cursor'],
    modules: {
      'index.md': 'Configure PaginationModule, parse route queries with Paginate, and apply paginate or PaginateService to list queries. Includes filter and sort options, cursor results, validation errors, and Swagger decorators.',
      'testing.md': 'Use TestPaginationModule and createPaginateQuery to build pagination inputs and Nest test modules without repeating query fixture setup.',
    },
  },
  rbac: {
    guide: ['Guards and permissions', 'guards-permissions'],
    modules: {
      'index.md': 'Register RbacModule, define permissions, and check authorization with RbacGuard or RbacService. Includes in-memory storage, subject and tenant contracts, strict options, and decision types.',
      'integrations/api-keys.md': 'Resolve a machine-client subject from verified API-key request context with createApiKeySubjectResolver. Authentication must populate the context before RBAC runs.',
      'integrations/audit-log.md': 'Connect an existing structural audit logger through createAuditLogRbacLogger and inspect its adapter options.',
      'integrations/tenancy.md': 'Create a tenant resolver from the application tenant-context callback with createTenancyTenantResolver.',
      'prisma.md': 'Persist roles, permissions, and bindings with PrismaRbacStorage. Read the [Prisma storage guide](/packages/rbac/prisma-storage) for the schema and application provider setup.',
      'testing.md': 'Build subjects and scenarios with TestRbacModule, then assert allow, deny, denial reasons, or permission matrices with the testing helpers.',
    },
  },
  'safe-response': {
    guide: ['Response format', 'response-format'],
    modules: {
      'client.md': 'Consume response envelopes using success, error, pagination, and metadata types. Type guards such as isSuccess and isError help narrow received responses.',
      'index.md': 'Configure the NestJS response module, response decorators, DTOs, error contracts, and Swagger helpers that produce consistent API envelopes.',
    },
  },
  'soft-delete': {
    guide: ['Restore and purge', 'restore-purge'],
    modules: {
      'index.md': 'Create the Prisma soft-delete extension and register SoftDeleteModule. Includes query-scope decorators, cascade and relation-filter options, service methods, and deletion lifecycle events.',
      'testing.md': 'Use TestSoftDeleteModule and assertions for deleted, restored, and cascade-deleted records when testing the application deletion lifecycle.',
    },
  },
  tenancy: {
    guide: ['Agent guide', 'agent-guide'],
    modules: {
      'cache.md': 'Configure TenantCacheInterceptor and SharedTenantCache for cache behavior that accounts for tenant context. Read the [caching guide](/packages/tenancy/caching) before sharing entries across tenants.',
      'index.md': 'Configure tenant extraction, context, guards, Prisma isolation, and tenant propagation. This root reference includes the runtime services and types used to carry tenant identity through application work.',
      'testing.md': 'Use TestTenancyModule, withTenant, and expectTenantIsolation to supply tenant context and verify isolation in application tests.',
    },
  },
}

// Based on api/rbac/README.md's API Key Recipe for the pinned release.
export const apiKeyIntegrationContext = `Use \`createApiKeySubjectResolver()\` when machine clients authenticate with \`@nestarc/api-keys\` and also need RBAC roles or resource permissions. Import it from \`@nestarc/rbac/integrations/api-keys\` and pass the returned resolver to \`RbacModule.forRoot()\`.

## Authentication and identity

Authenticate the key before the RBAC guard runs and attach the verified context to \`request.apiKey\`. The resolver maps that context to an \`api_key\` subject; it does not validate an API-key credential. It reads the opaque string \`keyId\` or \`id\`, preserves \`tenantId\`, and retains the source record in \`subject.attributes\`.

The deprecated \`request.apiKeyContext\` is a fallback only when \`request.apiKey\` is absent. Conflicting populated canonical and legacy contexts fail closed, so migrate legacy writers instead of relying on precedence.

## Register the resolver

This registration uses in-memory role storage for a local example. Configure authentication and seed the application's roles separately; selecting a resolver alone does not grant access.

\`\`\`ts
import { InMemoryRbacStorage, RbacModule } from '@nestarc/rbac';
import { createApiKeySubjectResolver } from '@nestarc/rbac/integrations/api-keys';

RbacModule.forRoot({
  storage: new InMemoryRbacStorage(),
  subjectResolver: createApiKeySubjectResolver(),
  tenant: { requiredByDefault: true },
});
\`\`\`

Follow [RBAC installation](/packages/rbac/installation) for module and guard setup, [API-key integration](/packages/rbac/integrations#with-api-keys) for the authentication boundary, and [Prisma storage](/packages/rbac/prisma-storage) for persistent roles. Use [API-key installation](/packages/api-keys/installation) to configure the authenticating package.
`
