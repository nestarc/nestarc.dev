---
description: "Manage webhook endpoints — create, list, update, delete, test events, and the WebhookEndpointAdminService API."
---

# Endpoint Management

The `WebhookEndpointAdminService` provides full CRUD for webhook endpoints. Use it to build your webhook management UI or API.

## Create an Endpoint

```typescript
import { Injectable } from '@nestjs/common';
import { WebhookEndpointAdminService } from '@nestarc/webhook';

@Injectable()
export class WebhookController {
  constructor(private readonly endpointAdmin: WebhookEndpointAdminService) {}

  async register(dto: RegisterWebhookDto) {
    const endpoint = await this.endpointAdmin.createEndpoint({
      url: dto.url,
      events: ['order.created', 'order.paid'],
      secret: 'auto',              // generates a random 32-byte base64 secret
      description: 'Order events',
      metadata: { team: 'payments' },
      tenantId: dto.tenantId,
    });

    // endpoint.secret is ONLY returned on creation
    return {
      id: endpoint.id,
      secret: endpoint.secret,
    };
  }
}
```

::: warning
The signing secret is **only** returned in the `createEndpoint()` response. All subsequent read operations (`listEndpoints`, `getEndpoint`) exclude the secret. Store it securely on the customer side.
:::

## List Endpoints

```typescript
// All endpoints
const endpoints = await this.endpointAdmin.listEndpoints();

// Filter by tenant
const tenantEndpoints = await this.endpointAdmin.listEndpoints('tenant_abc');
```

Returns an array of `EndpointRecord` (secret excluded).

## Get a Single Endpoint

```typescript
const endpoint = await this.endpointAdmin.getEndpoint('endpoint-uuid');
// Returns EndpointRecord | null
```

## Update an Endpoint

```typescript
const updated = await this.endpointAdmin.updateEndpoint('endpoint-uuid', {
  url: 'https://new-url.example.com/webhooks',
  events: ['order.created', 'order.paid', 'order.cancelled'],
  description: 'Updated description',
  active: true,
});
```

All fields in the update DTO are optional — only provided fields are updated.

## Delete an Endpoint

```typescript
const deleted = await this.endpointAdmin.deleteEndpoint('endpoint-uuid');
// Returns boolean
```

This is a **hard delete** — the endpoint record is removed from the database. Existing deliveries referencing this endpoint are not affected.

## Send a Test Event

```typescript
const eventId = await this.endpointAdmin.sendTestEvent('endpoint-uuid');
// Sends a 'webhook.test' event with an empty payload to the endpoint
```

Use this to let customers verify their endpoint is reachable and correctly configured.

## WebhookEndpointAdminService API

| Method | Signature | Description |
|--------|-----------|-------------|
| `createEndpoint` | `(dto: CreateEndpointDto) => Promise<EndpointRecordWithSecret>` | Register endpoint; returns record with secret |
| `listEndpoints` | `(tenantId?: string) => Promise<EndpointRecord[]>` | List endpoints (secret excluded) |
| `getEndpoint` | `(id: string) => Promise<EndpointRecord \| null>` | Get single endpoint (secret excluded) |
| `updateEndpoint` | `(id: string, dto: UpdateEndpointDto) => Promise<EndpointRecord \| null>` | Partial update |
| `deleteEndpoint` | `(id: string) => Promise<boolean>` | Hard delete |
| `sendTestEvent` | `(endpointId: string) => Promise<string \| null>` | Send `webhook.test` ping |

## Data Types

### CreateEndpointDto

```typescript
interface CreateEndpointDto {
  url: string;                              // HTTPS endpoint URL
  events: string[];                         // Event types to subscribe
  secret?: string | 'auto';                 // 'auto' generates 32-byte base64 secret
  description?: string;                     // Optional description
  metadata?: Record<string, unknown>;       // Optional key-value metadata
  tenantId?: string;                        // Optional tenant scope
}
```

### UpdateEndpointDto

```typescript
interface UpdateEndpointDto {
  url?: string;
  events?: string[];
  description?: string;
  metadata?: Record<string, unknown>;
  active?: boolean;
}
```

### EndpointRecord

```typescript
interface EndpointRecord {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  description: string | null;
  metadata: Record<string, unknown> | null;
  tenantId: string | null;
  consecutiveFailures: number;
  disabledAt: Date | null;
  disabledReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

::: tip
The `consecutiveFailures`, `disabledAt`, and `disabledReason` fields are managed by the [circuit breaker](/packages/webhook/retry-circuit-breaker). You can expose them in your admin UI to show endpoint health at a glance.
:::
