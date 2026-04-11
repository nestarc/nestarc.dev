---
description: "Custom adapters for @nestarc/webhook — swap Prisma or fetch with custom implementations using the ports/adapters architecture."
---

# Custom Adapters

The webhook module uses a **ports/adapters architecture**. All persistence and HTTP logic is abstracted behind port interfaces, allowing you to replace any component with a custom implementation.

## Available Ports

| Port Interface | Default Adapter | Responsibility |
|---------------|-----------------|----------------|
| `WebhookEventRepository` | `PrismaEventRepository` | Event persistence |
| `WebhookEndpointRepository` | `PrismaEndpointRepository` | Endpoint CRUD and circuit breaker state |
| `WebhookDeliveryRepository` | `PrismaDeliveryRepository` | Delivery tracking, claiming, and retry |
| `WebhookHttpClient` | `FetchHttpClient` | HTTP POST with timeout and abort |

## Registering Custom Adapters

Pass custom implementations via module options:

```typescript
WebhookModule.forRoot({
  prisma: prismaService,                      // still needed for default adapters
  httpClient: myCustomHttpClient,             // implements WebhookHttpClient
  eventRepository: myCustomEventRepo,         // implements WebhookEventRepository
  endpointRepository: myCustomEndpointRepo,   // implements WebhookEndpointRepository
  deliveryRepository: myCustomDeliveryRepo,   // implements WebhookDeliveryRepository
});
```

If you provide custom implementations for all three repositories, the `prisma` option becomes optional.

## WebhookHttpClient

Replace the default `FetchHttpClient` to use a different HTTP library or add custom behavior (e.g. mutual TLS, proxy support):

```typescript
import type { WebhookHttpClient, DeliveryResult } from '@nestarc/webhook';

@Injectable()
export class AxiosHttpClient implements WebhookHttpClient {
  constructor(private readonly httpService: HttpService) {}

  async post(
    url: string,
    headers: Record<string, string>,
    body: string,
    timeout: number,
  ): Promise<DeliveryResult> {
    const start = performance.now();
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, {
          headers,
          timeout,
          maxRedirects: 0,
        }),
      );
      return {
        success: response.status >= 200 && response.status < 300,
        statusCode: response.status,
        body: JSON.stringify(response.data).slice(0, 1024),
        latencyMs: Math.round(performance.now() - start),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        latencyMs: Math.round(performance.now() - start),
      };
    }
  }
}
```

```typescript
interface DeliveryResult {
  success: boolean;
  statusCode?: number;
  body?: string;
  latencyMs: number;
  error?: string;
}
```

## WebhookEventRepository

Handle event persistence with a custom storage backend:

```typescript
interface WebhookEventRepository {
  saveEvent(
    eventType: string,
    payload: Record<string, unknown>,
    tenantId: string | null,
  ): Promise<string>;

  saveEventInTransaction(
    tx: unknown,
    eventType: string,
    payload: Record<string, unknown>,
    tenantId: string | null,
  ): Promise<string>;
}
```

## WebhookEndpointRepository

Manage endpoint storage and circuit breaker state:

```typescript
interface WebhookEndpointRepository {
  findMatchingEndpoints(eventType: string, tenantId: string | null): Promise<EndpointRecord[]>;
  findMatchingEndpointsInTransaction(tx: unknown, eventType: string, tenantId: string | null): Promise<EndpointRecord[]>;
  createEndpoint(url, secret, events, description, metadata, tenantId): Promise<EndpointRecordWithSecret>;
  getEndpoint(id: string): Promise<EndpointRecord | null>;
  listEndpoints(tenantId?: string): Promise<EndpointRecord[]>;
  updateEndpoint(id: string, dto: UpdateEndpointDto): Promise<EndpointRecord | null>;
  deleteEndpoint(id: string): Promise<boolean>;
  resetFailures(endpointId: string): Promise<void>;
  incrementFailures(endpointId: string): Promise<number>;
  disableEndpoint(endpointId: string, reason: string): Promise<void>;
  recoverEligibleEndpoints(cooldownMinutes: number): Promise<number>;
}
```

## WebhookDeliveryRepository

Handle delivery lifecycle, claiming, and retry:

```typescript
interface WebhookDeliveryRepository {
  runInTransaction<T>(fn: (tx: unknown) => Promise<T>): Promise<T>;
  createDeliveriesInTransaction(tx, eventId, endpointIds, maxAttempts): Promise<void>;
  claimPendingDeliveries(batchSize: number): Promise<PendingDelivery[]>;
  enrichDeliveries(deliveryIds: string[]): Promise<PendingDelivery[]>;
  markSent(deliveryId, attempts, result): Promise<void>;
  markFailed(deliveryId, attempts, result): Promise<void>;
  markRetry(deliveryId, attempts, nextAt, result): Promise<void>;
  recoverStaleSending(stalenessMinutes: number): Promise<number>;
  getDeliveryLogs(endpointId, filters?): Promise<DeliveryRecord[]>;
  retryDelivery(deliveryId: string): Promise<boolean>;
  createTestDelivery(eventId, endpointId): Promise<void>;
}
```

## Default Adapters

The module ships with four default adapters:

| Adapter | Description |
|---------|-------------|
| `PrismaEventRepository` | Stores events via Prisma raw SQL |
| `PrismaEndpointRepository` | Manages endpoints via Prisma raw SQL |
| `PrismaDeliveryRepository` | Handles delivery lifecycle with `FOR UPDATE SKIP LOCKED` |
| `FetchHttpClient` | Uses Node.js native `fetch` with `AbortSignal.timeout()` and `redirect: 'manual'` |

::: tip
The default Prisma adapters use raw SQL (`$queryRaw`, `$executeRaw`) rather than the Prisma Client query API. This avoids the need to add webhook models to your `schema.prisma` file.
:::
