---
description: "Inspect webhook deliveries and attempts, retry bounded failure sets, and replay events with WebhookDeliveryAdminService."
---

# Delivery Logs

The `WebhookDeliveryAdminService` provides delivery and attempt history plus manual retry and replay operations. Use it to build observability dashboards and protected support tooling.

## Query Delivery History

```typescript
import { Injectable } from '@nestjs/common';
import { WebhookDeliveryAdminService } from '@nestarc/webhook';

@Injectable()
export class WebhookDashboardService {
  constructor(private readonly deliveryAdmin: WebhookDeliveryAdminService) {}

  async getEndpointLogs(endpointId: string) {
    return this.deliveryAdmin.getDeliveryLogs(endpointId, {
      status: 'FAILED',
      limit: 50,
      offset: 0,
    });
  }
}
```

## Filter Options

```typescript
interface DeliveryLogFilters {
  status?: DeliveryStatus;    // 'PENDING' | 'SENDING' | 'SENT' | 'FAILED'
  eventType?: string;         // Filter by event type (e.g. 'order.created')
  since?: Date;               // Only deliveries after this timestamp
  until?: Date;               // Only deliveries before this timestamp
  limit?: number;             // Max results to return
  offset?: number;            // Pagination offset
}
```

## Delivery Record

Each delivery row summarizes the latest state with full context:

```typescript
interface DeliveryRecord {
  id: string;
  eventId: string;
  endpointId: string;
  destinationUrl: string;            // snapshotted URL used for this delivery
  tenantId: string | null;
  status: DeliveryStatus;         // PENDING | SENDING | SENT | FAILED
  attempts: number;               // Current attempt count
  maxAttempts: number;            // Max attempts allowed
  nextAttemptAt: Date | null;     // Scheduled retry time
  lastAttemptAt: Date | null;     // When last attempt was made
  completedAt: Date | null;       // When delivery completed (SENT or FAILED)
  responseStatus: number | null;  // HTTP status code from endpoint
  responseBody: string | null;    // Response body (truncated to 1024 bytes)
  latencyMs: number | null;       // Round-trip latency in ms
  lastError: string | null;       // Error message for failed attempts
}
```

`destinationUrl` comes from the delivery snapshot when available, so support tooling can show where the queued attempt was actually sent even after the endpoint is edited.

## Inspect Every Attempt

Version 0.9 and later store one record for each delivery attempt:

```typescript
const attempts = await this.deliveryAdmin.getDeliveryAttempts('delivery-uuid');
```

```typescript
interface DeliveryAttemptRecord {
  id: string;
  deliveryId: string;
  attemptNumber: number;
  status: 'PENDING' | 'SENT' | 'FAILED';
  responseStatus: number | null;
  responseBody: string | null;
  responseBodyTruncated: boolean;
  latencyMs: number | null;
  lastError: string | null;
  createdAt: Date;
}
```

## Manual Retry

Retry a specific failed delivery:

```typescript
const success = await this.deliveryAdmin.retryDelivery('delivery-uuid', {
  reason: 'customer requested retry',
});
// Returns true if the delivery was reset to PENDING
```

This requeues only a failed delivery. The attempt history remains intact, and version 0.13 guarantees at least one additional manual attempt even when the original attempt budget was exhausted.

::: tip
Manual retry is useful for one-off failures caused by temporary endpoint issues. For systemic failures, investigate the endpoint health via the [circuit breaker](/packages/webhook/retry-circuit-breaker) status first.
:::

## Retry a Bounded Failed Set

Bulk retry is designed for an operator-selected and bounded incident scope:

```typescript
const result = await this.deliveryAdmin.retryFailedDeliveries(
  {
    endpointId: 'endpoint-uuid',
    eventType: 'order.created',
    since: new Date('2026-08-01T00:00:00Z'),
    limit: 100,
  },
  { reason: 'receiver outage resolved' },
);

// { matched, retried, skipped }
```

Always set a finite `limit` and narrow by endpoint, event type, or time window. The result separates matched rows from those actually requeued.

## Replay an Event

Replay keeps the original event ID and payload but creates new delivery rows for currently active matching endpoints:

```typescript
const replay = await this.deliveryAdmin.replayEvent('event-uuid', {
  tenantId: 'tenant_123',
  reason: 'customer support replay',
});

// { eventId, deliveriesCreated, endpointIds }
```

Optionally pass `endpointIds` to constrain the replay. Unlike retrying an existing failed delivery, replay resolves current active endpoints and snapshots their current URL and signing secrets.

## WebhookDeliveryAdminService API

| Method | Signature | Description |
|--------|-----------|-------------|
| `getDeliveryLogs` | `(endpointId: string, filters?: DeliveryLogFilters) => Promise<DeliveryRecord[]>` | Query delivery history for an endpoint |
| `getDeliveryAttempts` | `(deliveryId: string) => Promise<DeliveryAttemptRecord[]>` | Return attempts ordered by attempt number |
| `retryDelivery` | `(deliveryId: string, options?: RetryDeliveryOptions) => Promise<boolean>` | Requeue one failed delivery |
| `retryFailedDeliveries` | `(filters, options?) => Promise<RetryFailedDeliveriesResult>` | Requeue a bounded failed set |
| `replayEvent` | `(eventId, options?) => Promise<ReplayEventResult>` | Create new deliveries for an existing event |

## Monitoring Queries

You can also query the delivery tables directly for operational monitoring:

```sql
-- Count deliveries by status for an endpoint
SELECT status, COUNT(*) AS count
FROM webhook_deliveries
WHERE endpoint_id = 'endpoint-uuid'
GROUP BY status;

-- Recent failed deliveries with error details
SELECT d.id, e.event_type, d.attempts, d.last_error,
       d.response_status, d.latency_ms, d.last_attempt_at
FROM webhook_deliveries d
JOIN webhook_events e ON e.id = d.event_id
WHERE d.status = 'FAILED'
ORDER BY d.last_attempt_at DESC
LIMIT 20;

-- Attempt history for one delivery
SELECT attempt_number, status, response_status, latency_ms,
       last_error, created_at
FROM webhook_delivery_attempts
WHERE delivery_id = 'delivery-uuid'
ORDER BY attempt_number ASC;

-- Average latency by endpoint (last 24h)
SELECT endpoint_id, AVG(latency_ms) AS avg_latency,
       COUNT(*) AS total_deliveries
FROM webhook_deliveries
WHERE status = 'SENT' AND completed_at > NOW() - INTERVAL '24 hours'
GROUP BY endpoint_id;
```
