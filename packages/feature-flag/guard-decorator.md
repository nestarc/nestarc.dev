# Feature Flag Guard

The `@FeatureFlag()` decorator automatically applies `UseGuards(FeatureFlagGuard)`, so you do not need to add `@UseGuards()` yourself.

## Method-level

```typescript
import { FeatureFlag } from '@nestarc/feature-flag';

@Controller('dashboard')
export class DashboardController {
  @FeatureFlag('NEW_DASHBOARD')
  @Get()
  getDashboard() {
    return { message: 'Welcome to the new dashboard' };
  }
}
```

## Class-level

```typescript
@FeatureFlag('BETA_API')
@Controller('beta')
export class BetaController {
  @Get('feature-a')
  featureA() { /* guarded */ }

  @Get('feature-b')
  featureB() { /* guarded */ }
}
```

## Custom status code and fallback

```typescript
@FeatureFlag('PREMIUM_FEATURE', {
  statusCode: 402,
  fallback: { message: 'Upgrade required' },
})
@Get('premium')
getPremiumContent() { ... }
```

When the flag is disabled, the guard responds with the given `statusCode` (default `403`) and optional `fallback` body.

## Bypassing the guard

Use `@BypassFeatureFlag()` on methods that should always be accessible, even when a class-level flag is applied:

```typescript
import { BypassFeatureFlag } from '@nestarc/feature-flag';

@FeatureFlag('BETA_API')
@Controller('beta')
export class BetaController {
  @Get('docs')
  betaDocs() { /* guarded by BETA_API */ }

  @BypassFeatureFlag()
  @Get('health')
  healthCheck() {
    return { status: 'ok' };
  }
}
```

## Programmatic Evaluation

Inject `FeatureFlagService` for service-layer checks outside the HTTP request cycle:

```typescript
import { FeatureFlagService } from '@nestarc/feature-flag';

@Injectable()
export class PaymentService {
  constructor(private readonly flags: FeatureFlagService) {}

  async processPayment(order: Order) {
    const useNewGateway = await this.flags.isEnabled('NEW_PAYMENT_GATEWAY');

    if (useNewGateway) {
      return this.newGateway.process(order);
    }
    return this.legacyGateway.process(order);
  }
}
```

### Evaluate all flags at once

```typescript
const allFlags = await this.flags.evaluateAll();
// { NEW_DASHBOARD: true, PREMIUM_FEATURE: false, ... }
```

### Explicit evaluation context

Both `isEnabled()` and `evaluateAll()` accept an optional `EvaluationContext` to override the auto-detected context:

```typescript
const enabled = await this.flags.isEnabled('MY_FLAG', {
  userId: 'user-123',
  tenantId: 'tenant-abc',
  environment: 'staging',
});
```

Passing `null` explicitly clears that dimension, suppressing any ambient value from the request context:

```typescript
// Evaluate as if no user is present, even within a request with x-user-id
const globalResult = await this.flags.isEnabled('MY_FLAG', { userId: null });
```
