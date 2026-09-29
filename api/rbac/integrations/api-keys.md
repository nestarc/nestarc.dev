# integrations/api-keys

<!-- api-context:start -->
Use `createApiKeySubjectResolver()` when machine clients authenticate with `@nestarc/api-keys` and also need RBAC roles or resource permissions. Import it from `@nestarc/rbac/integrations/api-keys` and pass the returned resolver to `RbacModule.forRoot()`.

## Authentication and identity

Authenticate the key before the RBAC guard runs and attach the verified context to `request.apiKey`. The resolver maps that context to an `api_key` subject; it does not validate an API-key credential. It reads the opaque string `keyId` or `id`, preserves `tenantId`, and retains the source record in `subject.attributes`.

The deprecated `request.apiKeyContext` is a fallback only when `request.apiKey` is absent. Conflicting populated canonical and legacy contexts fail closed, so migrate legacy writers instead of relying on precedence.

## Register the resolver

This registration uses in-memory role storage for a local example. Configure authentication and seed the application's roles separately; selecting a resolver alone does not grant access.

```ts
import { InMemoryRbacStorage, RbacModule } from '@nestarc/rbac';
import { createApiKeySubjectResolver } from '@nestarc/rbac/integrations/api-keys';

RbacModule.forRoot({
  storage: new InMemoryRbacStorage(),
  subjectResolver: createApiKeySubjectResolver(),
  tenant: { requiredByDefault: true },
});
```

Follow [RBAC installation](/packages/rbac/installation) for module and guard setup, [API-key integration](/packages/rbac/integrations#with-api-keys) for the authentication boundary, and [Prisma storage](/packages/rbac/prisma-storage) for persistent roles. Use [API-key installation](/packages/api-keys/installation) to configure the authenticating package.
<!-- api-context:end -->

## Functions

<a id="api-createapikeysubjectresolver"></a>

### createApiKeySubjectResolver()

```ts
function createApiKeySubjectResolver(): RbacSubjectResolver;
```

Defined in: [src/integrations/api-keys.ts:5](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/integrations/api-keys.ts#L5)

#### Returns

[`RbacSubjectResolver`](../index.md#rbacsubjectresolver)
