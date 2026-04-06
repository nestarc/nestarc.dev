---
description: "Percentage-based feature rollouts with deterministic murmurhash3 bucketing — consistent per-user flag evaluation."
---

# Percentage Rollouts

Percentage rollout uses murmurhash3 for deterministic bucketing: the same user always gets the same result for a given flag, ensuring a consistent experience across requests.

## Evaluation Priority

When `isEnabled()` is called, flags are evaluated through a 6-layer cascade. The first matching layer wins:

| Priority | Layer                  | Description                                                        |
| -------- | ---------------------- | ------------------------------------------------------------------ |
| 1        | **Archived**           | If the flag has `archivedAt` set, evaluation always returns `false` |
| 2        | **User override**      | Override matching the current `userId` (most specific)              |
| 3        | **Tenant override**    | Override matching the current `tenantId`                            |
| 4        | **Environment override**| Override matching the current `environment`                        |
| 5        | **Percentage rollout** | Deterministic hash of `flagKey + userId` (or `tenantId`) mod 100   |
| 6        | **Global default**     | The flag's `enabled` field                                         |

## CRUD Operations

`FeatureFlagService` also exposes methods for managing flags programmatically:

```typescript
// Create a flag
const flag = await this.flags.create({
  key: 'NEW_FEATURE',
  description: 'Enables the new feature',
  enabled: false,
  percentage: 0,
});

// Update a flag
await this.flags.update('NEW_FEATURE', {
  enabled: true,
  percentage: 50,
});

// Archive a flag (soft delete -- evaluations return false)
await this.flags.archive('OLD_FEATURE');

// List all active (non-archived) flags
const allFlags = await this.flags.findAll();

// Manually invalidate the cache
this.flags.invalidateCache();
```

## Caching

Built-in caching is controlled by the `cacheTtlMs` option (default `30000` ms). Set to `0` to disable caching. You can manually invalidate the cache at any time:

```typescript
this.flags.invalidateCache();
```

## Events

Enable event emission to observe flag lifecycle changes. Requires `@nestjs/event-emitter` as an optional peer dependency.

**Important:** You must import `EventEmitterModule.forRoot()` in your app module. The feature-flag module reuses the same `EventEmitter2` singleton that NestJS manages, so `@OnEvent()` listeners work out of the box.

### Setup

```typescript
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),   // must be imported
    FeatureFlagModule.forRoot({
      environment: 'production',
      prisma: prismaService,
      emitEvents: true,
    }),
  ],
})
export class AppModule {}
```

### Event types

| Event constant                           | Event string                       | Payload type         |
| ---------------------------------------- | ---------------------------------- | -------------------- |
| `FeatureFlagEvents.EVALUATED`            | `feature-flag.evaluated`           | `FlagEvaluatedEvent` |
| `FeatureFlagEvents.CREATED`              | `feature-flag.created`             | `FlagMutationEvent`  |
| `FeatureFlagEvents.UPDATED`              | `feature-flag.updated`             | `FlagMutationEvent`  |
| `FeatureFlagEvents.ARCHIVED`             | `feature-flag.archived`            | `FlagMutationEvent`  |
| `FeatureFlagEvents.OVERRIDE_SET`         | `feature-flag.override.set`        | `FlagOverrideEvent`  |
| `FeatureFlagEvents.OVERRIDE_REMOVED`     | `feature-flag.override.removed`    | `FlagOverrideEvent`  |
| `FeatureFlagEvents.CACHE_INVALIDATED`    | `feature-flag.cache.invalidated`   | `{}`                 |

### Listening to events

```typescript
import { OnEvent } from '@nestjs/event-emitter';
import { FeatureFlagEvents, FlagEvaluatedEvent } from '@nestarc/feature-flag';

@Injectable()
export class FlagAuditListener {
  @OnEvent(FeatureFlagEvents.EVALUATED)
  handleEvaluation(event: FlagEvaluatedEvent) {
    console.log(`Flag ${event.flagKey} = ${event.result} (source: ${event.source})`);
  }
}
```
