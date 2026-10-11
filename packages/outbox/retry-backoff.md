---
description: "Retry strategies and backoff configuration for @nestarc/outbox — fixed vs exponential, max retries, stuck event recovery, and manual reprocessing."
---

# Retry & Backoff

When a handler throws, the event is retried with a configurable backoff strategy.

## Retry Flow

```
Handler throws
    │
    ├─ retry_count++
    │
    ├─ retryCount < maxRetries?
    │     ├─ yes → status=PENDING, wait for backoff delay
    │     └─ no  → status=FAILED, store last_error
    │
    └─ Next polling cycle picks up the event
       (only if backoff delay has elapsed)
```

## Backoff Strategies

### Exponential (default)

The delay doubles on every attempt:

```
delay = min(maxDelay, initialDelay * 2^(retry_count - 1))
```

With defaults (`initialDelay: 1000ms`, `maxRetries: 5`):

| Attempt | Delay |
|---------|-------|
| 1 | 1s |
| 2 | 2s |
| 3 | 4s |
| 4 | 8s |
| 5 | FAILED (attempt limit reached) |

### Fixed

The delay is constant:

```
delay = initialDelay (every attempt)
```

With `initialDelay: 1000ms`:

| Attempt | Delay |
|---------|-------|
| 1 | 1s |
| 2 | 1s |
| 3 | 1s |
| ... | 1s |

## Configuration

```typescript
OutboxModule.forRoot({
  prisma: PrismaService,
  retry: {
    maxRetries: 5,         // default: 5
    backoff: 'exponential', // 'fixed' | 'exponential' (default: 'exponential')
    initialDelay: 1000,    // default: 1000ms
    maxDelay: 86_400_000,  // default: 24 hours
  },
})
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxRetries` | `number` | `5` | Max delivery attempts before `FAILED` |
| `backoff` | `'fixed' \| 'exponential'` | `'exponential'` | Backoff strategy |
| `initialDelay` | `number` | `1000` | Base delay in ms |
| `maxDelay` | `number` | `86400000` | Maximum exponential delay in ms |

::: tip
The `maxRetries` value is stored **per-record** in the `max_retries` column at emit time. Configuration changes during rolling deployments do not affect in-flight events.
:::

## Persisted retry scheduling

Since 0.3, the next retry time is stored in `next_attempt_at` using PostgreSQL's clock when a failure is committed. Every poller claims from that same due time; differing local backoff settings do not recompute already scheduled retries. `OutboxRecord.nextAttemptAt` exposes the schedule.

`retry.maxDelay` defaults to 86,400,000 ms and caps exponential delay. The maximum permitted bound is 2,147,483,647 ms. `maxRetries` remains a per-record delivery-attempt limit.

`polling.enabled: false` is rejected at module initialization in 0.4.0. A notification at emit time cannot discover a retry that becomes due later; periodic polling remains required.

## Lease recovery

Active callbacks renew their PostgreSQL claim lease. Recovery runs every tenth poll cycle and requeues expired claims without incrementing `retry_count`. Completion requires the original claim token and an unexpired lease; stale completions cannot overwrite newer claims.

```typescript
OutboxModule.forRoot({
  prisma: PrismaService,
  lease: {
    duration: 300_000,
    heartbeatInterval: 60_000,
    heartbeatFailureTolerance: 1,
  },
});
```

`stuckThreshold` is a deprecated alias for `lease.duration`. A hung callback with healthy heartbeats is not automatically timed out; application deadlines and unhealthy-process termination remain necessary.

## Manual Reprocessing

Use an authorized operator service or fixed tenant scope instead of raw SQL resetting counters:

```typescript
const result = await tenantAdmin.retry(eventId);
switch (result.outcome) {
  case 'applied': break;
  case 'not_found': /* missing or outside this tenant */ break;
  case 'conflict': /* state does not allow retry */ break;
  case 'lost_claim': /* concurrent transition won */ break;
}
```

Only `FAILED` rows move to `PENDING`. Retry preserves the lifetime counter, clears error/completion fields, and makes the row due now. `markFailed()` accepts only `PENDING`; admin operations never cancel an active `PROCESSING` callback. See [Admin setup](./installation#_6-operate-failed-events-with-the-admin-api).

## Monitoring

Query failed events to detect systemic issues:

```sql
-- Count failed events by type
SELECT event_type, COUNT(*) AS failed_count, MAX(created_at) AS latest
FROM outbox_events
WHERE status = 'FAILED'
GROUP BY event_type
ORDER BY failed_count DESC;

-- Recent failures with error messages
SELECT id, event_type, retry_count, last_error, created_at
FROM outbox_events
WHERE status = 'FAILED'
ORDER BY created_at DESC
LIMIT 20;
```
