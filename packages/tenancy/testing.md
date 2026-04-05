# Testing

## Testing Utilities

Import from `@nestarc/tenancy/testing`:

```typescript
import { TestTenancyModule, withTenant, expectTenantIsolation } from '@nestarc/tenancy/testing';

// 1. Use TestTenancyModule in unit/integration tests (no middleware or guard)
const module = await Test.createTestingModule({
  imports: [TestTenancyModule.register()],
  providers: [MyService],
}).compile();

// 2. Run code in a tenant context
const result = await withTenant('tenant-1', () => service.findAll());

// 3. Assert tenant isolation in E2E tests
await expectTenantIsolation(prisma.user, 'tenant-a-uuid', 'tenant-b-uuid');
```

## Event System

Optional integration with `@nestjs/event-emitter`. Install the package and import `EventEmitterModule`:

```typescript
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TenancyEvents } from '@nestarc/tenancy';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TenancyModule.forRoot({ tenantExtractor: 'x-tenant-id' }),
  ],
})
export class AppModule {}

// Listen for events anywhere in your app
@Injectable()
class TenantLogger {
  @OnEvent(TenancyEvents.RESOLVED)
  handleResolved({ tenantId }: { tenantId: string }) {
    console.log(`Tenant resolved: ${tenantId}`);
  }
}
```

Events: `tenant.resolved`, `tenant.not_found`, `tenant.validation_failed`, `tenant.context_bypassed`, `tenant.cross_check_failed`.

If `@nestjs/event-emitter` is not installed, events are silently skipped — no errors.

## OpenTelemetry

Optional integration with `@opentelemetry/api`. Install the package to enable automatic tenant context in traces:

```bash
npm install @opentelemetry/api
```

```typescript
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  telemetry: {
    spanAttributeKey: 'tenant.id', // default
    createSpans: true,              // create custom spans for tenant lifecycle
  },
})
```

When enabled, `tenant.id` is automatically added as a span attribute to the active span on every request. If `createSpans` is `true`, a `tenant.resolved` span is also created.

If `@opentelemetry/api` is not installed, telemetry is silently skipped — no errors.
