---
description: "Percentage-based feature rollouts with deterministic murmurhash3 bucketing — consistent per-user flag evaluation."
---

# Percentage Rollouts

Published 0.5.0 uses murmurhash3 for deterministic percentage bucketing. A fixed flag key and stable targeting identifier produce the same bucket. Changing the identifier, override state, or percentage can change the result. For a runnable first check, start with [Installation](./installation).

## Evaluation Priority

When `isEnabled()` is called, flags are evaluated through a four-layer cascade. The first matching layer wins:

| Priority | Layer                  | Description                                                        |
| -------- | ---------------------- | ------------------------------------------------------------------ |
| 1        | **Archived**           | If the flag has `archivedAt` set, evaluation always returns `false` |
| 2        | **Attribute override** | Best override whose attributes all match the evaluation context     |
| 3        | **Percentage rollout** | Deterministic hash of `flagKey + targetingKey` modulo 100            |
| 4        | **Global default**     | The flag's `enabled` field                                          |

Top-level `userId`, `tenantId`, and `environment` values are merged into targeting attributes. If several overrides match, the evaluator prefers more attributes, then higher `priority`, earlier `createdAt`, and lower `id`.

## Percentage and fallback semantics

`percentage: 0` skips the percentage layer. A percentage from 1 to 99 compares the bucket to the percentage when a usable targeting key exists; without a key it falls through to `enabled`. `percentage: 100` returns true without a key. During a partial rollout, use `enabled: false` for an off fallback.

`enabled` is the last fallback, not a master switch. Setting it to false does not override an active rollout or a matching enabling override. To stop the percentage layer, set `{ enabled: false, percentage: 0 }`; also remove or disable enabling overrides. Archiving the stored flag makes all evaluations false, subject to cache propagation.

In npm 0.5.0, the service drops a supplied `targetingKey`. Use a stable `userId` or `tenantId`. Module registry `bucketBy` works for individual service evaluations but is omitted by `evaluateAll()`; the typed client also omits its own registry `bucketBy`. Metadata `bucketBy` is another available source, but mixing sources across these paths can produce different values. See [the version boundary](./agent-guide#version-boundary) before using unreleased invocation or registry fixes.

## Detailed and bulk evaluation

```typescript
const details = await this.flags.evaluateBoolean(
  'NEW_FEATURE',
  { userId: 'user-42', attributes: { plan: 'pro' } },
  { defaultValue: false },
);
// details.value, source, reason, defaultUsed, and available bucket metadata
```

Missing flags and individual evaluation failures use the invocation default, then registry default, then module `defaultOnMissing` (false by default). `evaluateAll(context)` returns active stored flags only; it propagates errors and emits no evaluation/exposure events.

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
  enabled: false,
  percentage: 50,
});

// Archive a flag (soft delete -- evaluations return false)
await this.flags.archive('OLD_FEATURE');

// List all active (non-archived) flags
const allFlags = await this.flags.findAll();

// Manually invalidate the cache
await this.flags.invalidateCache();
```

## Caching

Caching is handled by pluggable adapters (see [Cache Adapters](./cache-adapters)). The default `MemoryCacheAdapter` stores flags in an in-memory `Map`. For multi-instance deployments, use `RedisCacheAdapter` with Pub/Sub cross-instance invalidation.

Cache TTL is controlled by the `cacheTtlMs` option (default `30000` ms). Set to `0` to skip writes to built-in caches; it does not clear or bypass existing shared Redis entries. You can manually invalidate the cache at any time:

```typescript
await this.flags.invalidateCache();
```

::: tip
In v0.2.0, `invalidateCache()` is async. If you are upgrading from v0.1.0, add `await` to all `invalidateCache()` calls.
:::

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
| `FeatureFlagEvents.EXPOSED`              | `feature-flag.exposed`              | `FlagExposedEvent` |
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

`EVALUATED` is emitted by individual `isEnabled()` / `evaluateBoolean()` calls when events are enabled. Set `{ trackExposure: true }` in evaluation options to emit `EXPOSED`. Evaluation events include the resolved context by default; exposure events exclude it by default. `includeContextInEvent` controls context inclusion for both. Excluding full context does not remove separate targeting-key or bucket metadata. Mutation methods accept audit metadata such as actor ID, reason, and request ID; they do not create a durable audit log by themselves.
