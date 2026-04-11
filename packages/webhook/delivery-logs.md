---
description: "Query webhook delivery logs, filter by status and event type, and manually retry failed deliveries via WebhookDeliveryAdminService."
---

# Delivery Logs

The `WebhookDeliveryAdminService` provides delivery history and manual retry capabilities. Use it to build observability dashboards and support tooling.

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

Each delivery attempt is tracked with full context:

```typescript
interface DeliveryRecord {
  id: string;
  eventId: string;
  endpointId: string;
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

## Manual Retry

Retry a specific failed delivery:

```typescript
const success = await this.deliveryAdmin.retryDelivery('delivery-uuid');
// Returns true if the delivery was reset to PENDING
```

This resets the delivery status to `PENDING` and schedules it for the next poll cycle. The attempt counter is preserved — the delivery continues from where it left off.

::: tip
Manual retry is useful for one-off failures caused by temporary endpoint issues. For systemic failures, investigate the endpoint health via the [circuit breaker](/packages/webhook/retry-circuit-breaker) status first.
:::

## WebhookDeliveryAdminService API

| Method | Signature | Description |
|--------|-----------|-------------|
| `getDeliveryLogs` | `(endpointId: string, filters?: DeliveryLogFilters) => Promise<DeliveryRecord[]>` | Query delivery history for an endpoint |
| `retryDelivery` | `(deliveryId: string) => Promise<boolean>` | Reset a failed delivery to PENDING |

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

-- Average latency by endpoint (last 24h)
SELECT endpoint_id, AVG(latency_ms) AS avg_latency,
       COUNT(*) AS total_deliveries
FROM webhook_deliveries
WHERE status = 'SENT' AND completed_at > NOW() - INTERVAL '24 hours'
GROUP BY endpoint_id;
```
