---
description: "Override feature flag values for specific tenants or users — force-enable or disable flags per context."
---

# Overrides

Published 0.5.0 uses non-empty `attributes` objects with string, finite number, boolean, or null values. Matching is exact and type-sensitive; strings, numbers, and booleans are not coerced. Set context-specific overrides that take precedence over percentage rollout and the global flag value:

```typescript
// Enable for a specific tenant
await this.flags.setOverride('MY_FLAG', {
  attributes: { tenantId: 'tenant-1' },
  enabled: true,
});

// Disable for a specific user
await this.flags.setOverride('MY_FLAG', {
  attributes: { userId: 'user-42' },
  enabled: false,
});

// Enable only in staging
await this.flags.setOverride('MY_FLAG', {
  attributes: { environment: 'staging' },
  enabled: true,
});

// Combine dimensions
await this.flags.setOverride('MY_FLAG', {
  attributes: {
    tenantId: 'tenant-1',
    userId: 'user-42',
    environment: 'production',
  },
  enabled: true,
  priority: 10,
});
```

Top-level explicit `userId`, `tenantId`, and `environment` are merged into the resolved attributes and take precedence over same-named nested attributes. Explicit tenant IDs work without the optional tenancy package. If multiple overrides match, the evaluator selects more attributes, higher `priority`, earlier `createdAt`, then lower `id`. See [rollout precedence](./rollout).

## Remove an Override <Badge type="info" text="v0.2.0" />

```typescript
await this.flags.removeOverride('MY_FLAG', {
  attributes: { tenantId: 'tenant-1' },
});
```

The operation is idempotent — removing a non-existent override does not throw.

## Find a Flag by Key <Badge type="info" text="v0.2.0" />

```typescript
const flag = await this.flags.findByKey('MY_FLAG');
// Returns the full flag with overrides, or throws NotFoundException
```

## Testing

Import `TestFeatureFlagModule` from the `/testing` subpath to stub flag values in tests without a database connection:

```typescript
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { TestFeatureFlagModule } from '@nestarc/feature-flag/testing';
import { DashboardController } from './dashboard.controller';

// DashboardController is the guarded controller from the installation guide.
describe('DashboardController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TestFeatureFlagModule.register({
          NEW_DASHBOARD: true,
          PREMIUM_FEATURE: false,
        }),
      ],
      controllers: [DashboardController],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(() => app.close());

  it('should allow access when flag is enabled', () => {
    return request(app.getHttpServer())
      .get('/dashboard')
      .expect(200);
  });
});
```

`TestFeatureFlagModule.register()` provides a global mock of `FeatureFlagService` where `isEnabled(key)` returns the boolean you specified (defaulting to `false` for unregistered keys) and `evaluateAll()` returns the full map.

The test module is a service stub: it does not run real override matching, rollout hashing, persistence, or events. Use the real service in an integration test to verify those behaviors.
