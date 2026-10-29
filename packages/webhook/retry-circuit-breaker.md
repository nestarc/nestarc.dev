---
description: "Retry with exponential backoff and circuit breaker for @nestarc/webhook — backoff schedule, jitter, failure threshold, auto-disable, and auto-recovery."
---

# Retry & Circuit Breaker

Retryable failures are retried with a fixed backoff schedule while attempts remain. Repeated endpoint failures disable new delivery creation; existing queued work continues.

## Retry Flow

```
Delivery attempt fails
    │
    ├─ attempts++
    ├─ retryable response/error and attempts remain?
    │     ├─ yes → status=PENDING, persist attempt, schedule next_attempt_at
    │     └─ no  → status=FAILED, persist terminal attempt, clear next_attempt_at
    │
    └─ Circuit breaker: incrementFailures(endpointId)
          ├─ consecutiveFailures < threshold → continue
          └─ consecutiveFailures >= threshold → disable endpoint
```

## Backoff Schedule

`delivery.maxRetries` counts **total attempts including the initial request**. The default `5` permits the initial request plus at most four retries:

| Failed attempt | Delay before next attempt | Default budget of 5 |
| --- | --- | --- |
| 1 | 30 seconds | Attempt 2 |
| 2 | 5 minutes | Attempt 3 |
| 3 | 30 minutes | Attempt 4 |
| 4 | 2 hours | Attempt 5 |
| 5 and later | 24 hours | No further automatic retry |

The 24-hour step is used only when a delivery has at least six total attempts available. Permanent responses may stop before the budget is exhausted.

With `jitter: true` (default), each delay is randomized by ±10% to prevent thundering herd when many deliveries retry simultaneously.

## Configuration

```typescript
WebhookModule.forRoot({
  prisma: prismaService,
  delivery: {
    maxRetries: 5,           // initial request + up to 4 retries
    jitter: true,            // default: true (±10%)
  },
  circuitBreaker: {
    degradedThreshold: 3,    // optional early warning
    failureThreshold: 5,     // default: 5 consecutive failures
    cooldownMinutes: 60,     // default: 60 minutes
  },
  onDeliveryRetryScheduled: ({ deliveryId, nextAttemptAt }) => {
    metrics.increment('webhook.retry.scheduled', { deliveryId });
    logger.debug({ deliveryId, nextAttemptAt });
  },
  onEndpointDegraded: ({ endpointId, consecutiveFailures }) => {
    alerting.webhookEndpointDegraded(endpointId, consecutiveFailures);
  },
})
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delivery.maxRetries` | `number` | `5` | Total attempts including the initial request before `FAILED` |
| `delivery.jitter` | `boolean` | `true` | Add ±10% random jitter to delays |
| `circuitBreaker.degradedThreshold` | `number` | — | Emit a degradation callback before disablement; must be below the failure threshold |
| `circuitBreaker.failureThreshold` | `number` | `5` | Consecutive failures before disabling endpoint |
| `circuitBreaker.cooldownMinutes` | `number` | `60` | Minutes before attempting recovery |

The retry schedule is fixed. `delivery.backoff` remains only as a deprecated compatibility option and should be omitted from new configurations.

## Retryability Classification

Receiver responses are classified before another attempt is scheduled:

| Result | Behavior |
|--------|----------|
| `2xx` | Mark `SENT`. |
| `3xx` | Retry while attempts remain. Redirects are not followed. |
| `408`, `409`, `425`, `429` | Retry while attempts remain. |
| Other `4xx` | Mark `FAILED` after the current attempt. |
| `5xx` | Retry while attempts remain. |
| Network, DNS, timeout, or dispatch error | Retry while attempts remain. |

Permanent `4xx` responses still create an attempt record, increment circuit-breaker failures, clear the next retry timestamp, and invoke `onDeliveryFailed`.

## Notification Hooks

The hooks have distinct transition semantics:

- `onDeliveryRetryScheduled` runs after a retriable failure is persisted with `nextAttemptAt`.
- `onEndpointDegraded` runs once when failures exactly reach the configured degraded threshold.
- `onDeliveryFailed` runs only for terminal failure or a non-retryable response.
- `onEndpointDisabled` runs only when an active endpoint transitions to disabled.

Callbacks are best-effort and fire-and-forget. Exceptions are logged and do not change persisted delivery state. Branch on `failureKind` (`url_validation`, `dispatch_error`, or `http_error`) instead of parsing `lastError`:

```typescript
onDeliveryFailed: (context) => {
  if (context.failureKind === 'url_validation') {
    alerting.endpointMisconfigured({
      endpointId: context.endpointId,
      reason: context.validationReason,
      resolvedIp: context.resolvedIp,
    });
  } else if (context.failureKind === 'http_error') {
    alerting.downstreamUnhealthy({
      endpointId: context.endpointId,
      status: context.responseStatus,
    });
  }
},
```

## Circuit Breaker

The circuit breaker tracks consecutive failures **per endpoint**. The default Prisma repository disables failing endpoints and restores them after cooldown:

### Healthy (closed)

- Endpoint is active, deliveries are processed normally
- Each successful delivery resets `consecutiveFailures` to 0
- Each failure increments `consecutiveFailures`

### Disabled (open)

When `consecutiveFailures >= failureThreshold`:

1. Endpoint is marked `active = false`
2. `disabled_at` is set to the current timestamp
3. `disabled_reason` is set to `'consecutive_failures_exceeded'`
4. No new deliveries are created for this endpoint

Existing pending and retrying rows remain claimable. This is not a cancellation mechanism or a strict stop on HTTP dispatch.

### Recovery after cooldown

After `cooldownMinutes` have passed since `disabled_at`:

1. The delivery worker calls `recoverEligibleEndpoints()` every poll cycle
2. Eligible endpoints are re-enabled: `active = true`, `disabled_at = null`, `disabled_reason = null`
3. `consecutiveFailures` is reset to `0`, starting a new failure budget
4. Further failures disable the endpoint again only after they reach `failureThreshold`

```
Healthy ──[threshold reached]──> Disabled
   ^                                │
   └──[cooldown: reset failures]─────┘
```

::: warning
Cooldown recovery applies only to endpoints disabled by the circuit breaker. It resets the counter; it does not implement a single-request half-open probe. Concurrent workers and queued rows can still dispatch multiple requests.
:::

## Stale Delivery Recovery

If a worker crashes while a delivery is in `SENDING` status, the delivery may be stuck indefinitely. The worker automatically recovers stale deliveries:

- Every poll cycle, deliveries in `SENDING` with `claimed_at` older than `staleSendingMinutes` (default: 5 minutes) are reset to `PENDING`
- The `claimed_at` column acts as a lease — exceeding the threshold implies the worker is dead

```typescript
WebhookModule.forRoot({
  prisma: prismaService,
  polling: {
    staleSendingMinutes: 5,  // default: 5
  },
})
```

::: tip
Setting `staleSendingMinutes` too low may cause deliveries to be re-attempted while the original request is still in flight. Keep it well above your `delivery.timeout` value.
:::

## Successful Delivery Reset

On a successful delivery (2xx response):

1. Delivery is marked `SENT` with `completedAt` and response details
2. `consecutiveFailures` for the endpoint is reset to 0
3. A circuit-disabled endpoint is reactivated immediately, even before cooldown. A manually disabled endpoint stays inactive unless it still carries the circuit breaker's disable reason.
