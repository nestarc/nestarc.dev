---
description: "Operate @nestarc/webhook workers in production — capacity, observability, process separation, retention, and redaction."
---

# Operations & Data Lifecycle

Version 0.13 adds explicit controls for worker capacity, backlog draining, lifecycle metrics, and stored-data minimization. Keep the default single-batch polling behavior until measurements show that a worker needs more throughput.

## Worker Capacity

```typescript
WebhookModule.forRoot({
  prisma,
  polling: {
    interval: 1_000,
    batchSize: 100,
    maxConcurrency: 200,
    drainWhileBacklogged: true,
    maxDrainLoopsPerPoll: 10,
    drainLoopDelayMs: 25,
    staleSendingMinutes: 5,
  },
});
```

| Option | Default | Purpose |
|--------|---------|---------|
| `interval` | `5000` | Milliseconds between poll cycles |
| `batchSize` | `50` | Rows claimed by one database claim |
| `maxConcurrency` | `batchSize` | In-flight HTTP dispatches per worker process |
| `drainWhileBacklogged` | `false` | Continue claiming inside the same poll while capacity remains |
| `maxDrainLoopsPerPoll` | `1`, or `10` in drain mode | Bound the number of claim loops in one poll |
| `drainLoopDelayMs` | `0` | Optional pause between drain loops |
| `staleSendingMinutes` | `5` | Lease age after which abandoned `SENDING` rows are recovered |

`batchSize` controls database claim size; `maxConcurrency` controls HTTP pressure. Their values do not need to match. Increase concurrency gradually while watching downstream rate limits, database load, process memory, and event-loop delay.

::: warning
Each worker process gets its own concurrency budget. Four replicas with `maxConcurrency: 200` can produce up to 800 simultaneous dispatches.
:::

## Observe Every Poll

`workerObserver` receives best-effort lifecycle callbacks. Exceptions from these callbacks are logged and ignored, so metrics failures do not change delivery state.

```typescript
WebhookModule.forRoot({
  prisma,
  workerObserver: {
    onPollStart(context) {
      metrics.gauge('webhook.worker.active', context.activeDeliveries);
    },
    onPollComplete(result) {
      metrics.count('webhook.worker.claimed', result.claimed);
      metrics.count('webhook.worker.sent', result.sent);
      metrics.count('webhook.worker.retried', result.retried);
      metrics.count('webhook.worker.failed', result.failed);
      metrics.gauge('webhook.worker.poll.duration_ms', result.durationMs);
    },
    onDeliveryComplete(result) {
      metrics.count(`webhook.delivery.${result.status.toLowerCase()}`, 1, {
        tenantId: result.tenantId ?? 'global',
      });
    },
    onPollError(error) {
      logger.error({ error }, 'webhook worker poll failed');
    },
  },
});
```

Repository implementations may also expose `getBacklogSummary()`:

```typescript
const summary = await deliveryRepository.getBacklogSummary?.();

// pendingCount, sendingCount, runnablePendingCount,
// oldestPendingAgeMs, oldestRunnableAgeMs
```

Alert on sustained runnable backlog age, terminal failure rate, disabled endpoints, poll errors, and stale-delivery recovery. A high pending count alone may include deliveries scheduled for a future retry, so use `runnablePendingCount` and `oldestRunnableAgeMs` when paging operators.

## Separate API and Worker Processes

In an API process, register the same module configuration but disable polling:

```typescript
WebhookModule.forRoot({
  prisma,
  polling: { enabled: false },
});
```

Run one or more dedicated Nest application contexts with polling enabled:

```typescript
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const worker = await NestFactory.createApplicationContext(WorkerModule);
  worker.enableShutdownHooks();
}

void bootstrap();
```

All processes must point at the same PostgreSQL database and use the same endpoint-secret vault configuration. `FOR UPDATE SKIP LOCKED` coordinates claims across replicas without a separate queue broker.

## Minimize Data Before Persistence

Redaction hooks run before data is stored. Payload redaction also changes the body delivered to receivers.

```typescript
WebhookModule.forRoot({
  prisma,
  redaction: {
    sanitizePayload(payload, { eventType, tenantId }) {
      const { email, accessToken, ...safePayload } = payload;
      audit.debug({ eventType, tenantId }, 'webhook payload sanitized');
      return safePayload;
    },
    sanitizeResponseBody(body, { statusCode }) {
      return statusCode && statusCode >= 500 ? null : body.slice(0, 512);
    },
  },
});
```

`sanitizeResponseBody` applies before response bodies are written to both delivery and attempt records. Return `null` to suppress storage entirely. Sanitizers should be deterministic and must not mutate their input objects.

## Purge Expired Data

Retention is disabled when `retention` is omitted. Configure each data class independently:

```typescript
WebhookModule.forRoot({
  prisma,
  retention: {
    eventPayloadRetentionDays: 30,
    deliveryResponseBodyRetentionDays: 14,
    attemptResponseBodyRetentionDays: 7,
  },
});
```

The package provides the purge operation; your application owns its schedule:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WebhookRetentionAdminService } from '@nestarc/webhook';

@Injectable()
export class WebhookRetentionJob {
  private readonly logger = new Logger(WebhookRetentionJob.name);

  constructor(private readonly retention: WebhookRetentionAdminService) {}

  @Cron('0 3 * * *')
  async purge() {
    const result = await this.retention.purgeExpiredData();
    this.logger.log(result);
  }
}
```

The result reports `eventsPurged`, `deliveriesPurged`, and `attemptsPurged`. Purging replaces expired event payloads with `{}` and clears expired response bodies; it preserves the event, delivery, and attempt rows used for operational history.

For deterministic tests or controlled backfills, pass a reference time:

```typescript
await retention.purgeExpiredData(new Date('2026-08-01T00:00:00Z'));
```

::: tip
Agree on retention periods with security, privacy, support, and incident-response owners. Response bodies often contain more customer data than their status codes suggest.
:::

## Production Runbook

1. Confirm the v0.13 migration is applied before enabling idempotent publishing or purge jobs.
2. Start with bounded concurrency and drain loops, then load test using realistic receiver latency.
3. Dashboard poll duration, runnable backlog age, delivery outcomes, retry scheduling, and endpoint degradation.
4. Protect bulk retry, replay, and retention endpoints with operator authorization and audit logging.
5. Test graceful shutdown and stale `SENDING` recovery before scaling worker replicas.
6. Exercise secret rotation and vault failure recovery as part of incident drills.

See [Delivery Logs](./delivery-logs) for retry and replay operations, [Security](./security) for secret handling, and the [API Reference](/api/webhook/) for complete callback result types.
