---
description: "Custom adapters for @nestarc/webhook — replace Prisma persistence or the default HTTP client with custom implementations using the ports/adapters architecture."
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
| `WebhookSecretVault` | `PlaintextSecretVault` | Endpoint-secret encryption and decryption |

## Registering Custom Adapters

Pass custom implementations via module options:

```typescript
WebhookModule.forRoot({
  prisma: prismaService,                      // still needed for default adapters
  httpClient: myCustomHttpClient,             // implements WebhookHttpClient
  eventRepository: myCustomEventRepo,         // implements WebhookEventRepository
  endpointRepository: myCustomEndpointRepo,   // implements WebhookEndpointRepository
  deliveryRepository: myCustomDeliveryRepo,   // implements WebhookDeliveryRepository
  secretVault: myCustomSecretVault,            // implements WebhookSecretVault
});
```

If you provide custom implementations for all three repositories, the `prisma` option becomes optional.

## WebhookHttpClient

Replace the default `FetchHttpClient` to use a different HTTP library or add custom behavior (e.g. mutual TLS, proxy support):

```typescript
import { Injectable, Logger } from '@nestjs/common';
import {
  FetchHttpClient,
  type DeliveryResult,
  type WebhookHttpClient,
} from '@nestarc/webhook';

@Injectable()
export class InstrumentedHttpClient implements WebhookHttpClient {
  private readonly transport = new FetchHttpClient();
  private readonly logger = new Logger(InstrumentedHttpClient.name);

  async post(
    url: string,
    headers: Record<string, string>,
    body: string,
    timeout: number,
    options?: Parameters<WebhookHttpClient['post']>[4],
  ): Promise<DeliveryResult> {
    const result = await this.transport.post(url, headers, body, timeout, options);
    this.logger.debug({ statusCode: result.statusCode, latencyMs: result.latencyMs });
    return result;
  }
}
```

This wrapper forwards the fifth request-options argument, including validated IP addresses, to the default transport. A completely custom transport must enforce those addresses at connection time, preserve the original hostname for TLS, enforce timeouts and response-size limits, and avoid redirects. Return `statusCode` for non-2xx responses so permanent 4xx failures retain the correct retry classification. A four-argument implementation may type-check while losing DNS pinning.

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

  saveEventOnceInTransaction?(
    tx: WebhookTransaction,
    eventType: string,
    payload: Record<string, unknown>,
    tenantId: string | null,
    options: Required<Pick<WebhookPublishOptions, 'idempotencyKey'>> &
      Pick<WebhookPublishOptions, 'correlationId'>,
  ): Promise<SavedWebhookEvent>;
}
```

`saveEventOnceInTransaction()` is optional only for backward compatibility. A custom repository must implement it before callers pass `idempotencyKey`; it must atomically return the existing tenant/event-type/key match or insert a new event.

## WebhookEndpointRepository

Manage endpoint storage and circuit breaker state:

```typescript
interface WebhookEndpointRepository {
  findMatchingEndpoints(eventType: string, tenantId: string | undefined): Promise<EndpointRecord[]>;
  findMatchingEndpointsInTransaction(tx: WebhookTransaction, eventType: string, tenantId: string | undefined): Promise<EndpointRecord[]>;
  createEndpoint(input: ResolvedCreateEndpointInput): Promise<EndpointRecordWithSecret>;
  getEndpoint(id: string): Promise<EndpointRecord | null>;
  listEndpoints(tenantId?: string): Promise<EndpointRecord[]>;
  updateEndpoint(id: string, dto: UpdateEndpointDto): Promise<EndpointRecord | null>;
  rotateSecret(id: string, input: ResolvedRotateEndpointSecretInput): Promise<EndpointRecord | null>;
  deleteEndpoint(id: string): Promise<boolean>;
  resetFailures(endpointId: string): Promise<void>;
  incrementFailures(endpointId: string): Promise<number>;
  disableEndpoint(endpointId: string, reason: string): Promise<boolean>;
  recoverEligibleEndpoints(cooldownMinutes: number): Promise<number>;
}
```

`disableEndpoint()` returns `true` only for an active-to-inactive transition. `deleteEndpoint()` may reject while delivery history still references the endpoint. The repository stores vault-encrypted current and previous secrets and must preserve the configured rotation expiry.

## WebhookDeliveryRepository

Handle delivery lifecycle, claiming, and retry:

```typescript
interface WebhookDeliveryRepository {
  runInTransaction<T>(fn: (tx: WebhookTransaction) => Promise<T>): Promise<T>;
  createDeliveriesInTransaction(tx, eventId, endpointIds, maxAttempts): Promise<void>;
  claimPendingDeliveries(batchSize: number): Promise<ClaimedDelivery[]>;
  enrichDeliveries(deliveryIds: string[]): Promise<PendingDelivery[]>;
  markSent(deliveryId, attempts, result): Promise<void>;
  markFailed(deliveryId, attempts, result): Promise<void>;
  markRetry(deliveryId, attempts, nextAt, result): Promise<void>;
  recoverStaleSending(stalenessMinutes: number): Promise<number>;
  getBacklogSummary?(): Promise<DeliveryBacklogSummary>;
  getDeliveryLogs(endpointId, filters?): Promise<DeliveryRecord[]>;
  getDeliveryAttempts(deliveryId: string): Promise<DeliveryAttemptRecord[]>;
  retryDelivery(deliveryId: string, options?: RetryDeliveryOptions): Promise<boolean>;
  retryFailedDeliveries?(filters, options?): Promise<RetryFailedDeliveriesResult>;
  replayEvent?(eventId: string, options?: ReplayEventOptions): Promise<ReplayEventResult>;
  purgeExpiredData?(options, now?: Date): Promise<WebhookRetentionPurgeResult>;
  createTestDelivery(eventId, endpointId): Promise<void>;
}
```

Bulk retry, event replay, retention purge, and backlog summary are optional port methods for compatibility with older custom repositories. Their admin APIs reject unsupported operations rather than silently emulating them. The default Prisma adapter implements all of them.

## WebhookSecretVault

Use a custom vault when endpoint secrets must be encrypted at rest:

```typescript
interface WebhookSecretVault {
  encrypt(plainSecret: string): Promise<string>;
  decrypt(encryptedSecret: string): Promise<string>;
}
```

Vault errors propagate to the caller. Handle transient KMS or network retries inside the implementation, preserve enough envelope metadata for key rotation, and keep the same vault configuration in publisher and worker processes.

## Default Adapters

The module ships with five default adapters:

| Adapter | Description |
|---------|-------------|
| `PrismaEventRepository` | Stores events via Prisma raw SQL |
| `PrismaEndpointRepository` | Manages endpoints via Prisma raw SQL |
| `PrismaDeliveryRepository` | Handles delivery lifecycle with `FOR UPDATE SKIP LOCKED` |
| `FetchHttpClient` | Uses Node.js `http.request` / `https.request`, validated address pinning, a request timeout, a 4096 UTF-16 code-unit response cap, and no redirect following |
| `PlaintextSecretVault` | Stores and retrieves secrets unchanged; replace it when encryption at rest is required |

::: tip
The default Prisma adapters use raw SQL (`$queryRaw`, `$executeRaw`) rather than the Prisma Client query API. This avoids the need to add webhook models to your `schema.prisma` file.
:::
