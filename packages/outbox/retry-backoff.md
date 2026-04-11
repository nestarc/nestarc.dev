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
delay = initialDelay * 2^(retry_count - 1)
```

With defaults (`initialDelay: 1000ms`, `maxRetries: 5`):

| Attempt | Delay |
|---------|-------|
| 1 | 1s |
| 2 | 2s |
| 3 | 4s |
| 4 | 8s |
| 5 | 16s |
| 6 | FAILED |

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
  },
})
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxRetries` | `number` | `5` | Max delivery attempts before `FAILED` |
| `backoff` | `'fixed' \| 'exponential'` | `'exponential'` | Backoff strategy |
| `initialDelay` | `number` | `1000` | Base delay in ms |

::: tip
The `maxRetries` value is stored **per-record** in the `max_retries` column at emit time. Configuration changes during rolling deployments do not affect in-flight events.
:::

## Backoff Computation in SQL

The backoff is computed directly in the polling query, not in application code:

```sql
WHERE status = 'PENDING'
  AND (
    retry_count = 0
    OR updated_at < NOW() - make_interval(
      secs => CASE
        WHEN backoff = 'exponential'
        THEN initial_delay_seconds * pow(2, retry_count - 1)
        ELSE initial_delay_seconds
      END
    )
  )
```

Events whose backoff delay hasn't elapsed are simply not selected — they remain in `PENDING` until the next qualifying poll.

## Stuck Event Recovery

If a poller crashes (e.g. SIGKILL), events locked in `PROCESSING` may remain stuck indefinitely. The module includes automatic recovery:

- **Check frequency:** every 10th polling cycle
- **Threshold:** `stuckThreshold` (default: 300,000ms = 5 minutes)
- Events in `PROCESSING` with `updated_at` older than the threshold are reset to `PENDING`

```typescript
OutboxModule.forRoot({
  prisma: PrismaService,
  stuckThreshold: 300_000, // 5 minutes (default)
})
```

::: warning
Setting `stuckThreshold` too low may cause events to be re-processed while the original handler is still running. Keep it well above your longest expected handler execution time.
:::

## Manual Reprocessing

`FAILED` events are kept in the table for observability. To reprocess them, reset their status to `PENDING`:

```sql
-- Reprocess a specific event
UPDATE outbox_events
SET status = 'PENDING', retry_count = 0, last_error = NULL, updated_at = NOW()
WHERE id = 'event-uuid-here';

-- Reprocess all failed events of a specific type
UPDATE outbox_events
SET status = 'PENDING', retry_count = 0, last_error = NULL, updated_at = NOW()
WHERE status = 'FAILED' AND event_type = 'order.created';
```

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
