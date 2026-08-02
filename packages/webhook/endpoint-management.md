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
      secret: 'auto',              // optional; generates a random 32-byte base64 secret
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

## Rotate a Signing Secret

Rotate secrets with an overlap window so receivers can accept the previous and new signatures while provisioning completes:

```typescript
const rotated = await this.endpointAdmin.rotateSecret('endpoint-uuid', {
  previousSecretExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
});

if (!rotated) {
  throw new NotFoundException('Webhook endpoint not found');
}

// Returned only from this rotation response. Provision it immediately.
await this.receiverSecrets.store(rotated.secret);
```

Omit `secret` or pass `'auto'` to generate a new 32-byte base64 secret. Until `previousSecretExpiresAt`, deliveries can contain space-separated signatures for the current and previous secrets. Read APIs never return either secret.

## Delete an Endpoint

```typescript
const deleted = await this.endpointAdmin.deleteEndpoint('endpoint-uuid');
// Returns boolean
```

This is a **hard delete**. The default PostgreSQL schema keeps delivery history linked to the endpoint, so deletion may be rejected while delivery rows still reference it. Decide whether your admin workflow should deactivate the endpoint, retain its audit history, or purge related records through an explicitly reviewed process.

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
| `rotateSecret` | `(id: string, dto: RotateEndpointSecretDto) => Promise<EndpointRecordWithSecret \| null>` | Rotate the signing secret with an overlap window; returns the new secret once |
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

Omitting `secret` has the same effect as passing the case-sensitive value `'auto'`.

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

### RotateEndpointSecretDto

```typescript
interface RotateEndpointSecretDto {
  secret?: string;                  // valid base64, at least 16 decoded bytes
  previousSecretExpiresAt: Date;    // required future timestamp
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
  previousSecretExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

::: tip
The `consecutiveFailures`, `disabledAt`, and `disabledReason` fields are managed by the [circuit breaker](/packages/webhook/retry-circuit-breaker). You can expose them in your admin UI to show endpoint health at a glance.
:::
