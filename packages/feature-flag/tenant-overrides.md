# Overrides

Set context-specific overrides that take precedence over the global flag value:

```typescript
// Enable for a specific tenant
await this.flags.setOverride('MY_FLAG', {
  tenantId: 'tenant-1',
  enabled: true,
});

// Disable for a specific user
await this.flags.setOverride('MY_FLAG', {
  userId: 'user-42',
  enabled: false,
});

// Enable only in staging
await this.flags.setOverride('MY_FLAG', {
  environment: 'staging',
  enabled: true,
});

// Combine dimensions
await this.flags.setOverride('MY_FLAG', {
  tenantId: 'tenant-1',
  userId: 'user-42',
  environment: 'production',
  enabled: true,
});
```

## Testing

Import `TestFeatureFlagModule` from the `/testing` subpath to stub flag values in tests without a database connection:

```typescript
import { TestFeatureFlagModule } from '@nestarc/feature-flag/testing';

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

  it('should allow access when flag is enabled', () => {
    return request(app.getHttpServer())
      .get('/dashboard')
      .expect(200);
  });
});
```

`TestFeatureFlagModule.register()` provides a global mock of `FeatureFlagService` where `isEnabled(key)` returns the boolean you specified (defaulting to `false` for unregistered keys) and `evaluateAll()` returns the full map.
