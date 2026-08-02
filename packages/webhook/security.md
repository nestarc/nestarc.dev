---
description: "Webhook security — HMAC-SHA256 signing with Standard Webhooks headers, SSRF defense with DNS validation, and secret handling best practices."
---

# Security

## HMAC-SHA256 Signing

All webhook deliveries are signed with **HMAC-SHA256** using [Standard Webhooks](https://www.standardwebhooks.com/) headers:

```
webhook-id: <event-uuid>
webhook-timestamp: <unix-seconds>
webhook-signature: v1,<base64-hmac-sha256>
```

The signature is computed over `{webhook-id}.{webhook-timestamp}.{body}` using the endpoint's secret.

### Verifying Signatures

Customers should verify webhook signatures against the **raw request body** before parsing or processing the payload. `WebhookSigner.verifyWithTolerance()` checks both HMAC validity and timestamp freshness:

```typescript
import { WebhookSigner } from '@nestarc/webhook';

const signer = new WebhookSigner();
const timestamp = Number(headers['webhook-timestamp']);

const valid = signer.verifyWithTolerance(
  headers['webhook-id'],
  timestamp,
  rawBody,
  signingSecret,
  headers['webhook-signature'],
  { toleranceSeconds: 300 },
);

if (!valid) {
  throw new UnauthorizedException('Invalid or stale webhook signature');
}
```

`verify()` and `verifyWithTolerance()` accept space-separated `v1,...` signatures and succeed when any one signature matches the supplied secret. This supports controlled secret-rotation overlap. Use a finite tolerance in receiver applications to reduce replay risk.

### WebhookSigner API

The `WebhookSigner` service can also be used directly for custom signing scenarios:

| Method | Signature | Description |
|--------|-----------|-------------|
| `sign` | `(eventId, timestamp, body, secret) => SignatureHeaders` | Generate Standard Webhooks headers |
| `signAll` | `(eventId, timestamp, body, secrets[]) => SignatureHeaders` | Generate space-separated signatures for rotation overlap |
| `verify` | `(eventId, timestamp, body, secret, signature) => boolean` | Timing-safe signature verification |
| `verifyWithTolerance` | `(eventId, timestamp, body, secret, signature, options) => boolean` | Verify HMAC and reject stale timestamps |
| `generateSecret` | `() => string` | Generate random 32-byte base64 secret |

```typescript
interface SignatureHeaders {
  'webhook-id': string;         // Event UUID
  'webhook-timestamp': string;  // Unix seconds
  'webhook-signature': string;  // v1,<base64-hmac-sha256>
}
```

### Secret Format

- Secrets must be valid base64 strings decoding to at least 16 bytes
- Use `secret: 'auto'` when creating endpoints to auto-generate a 32-byte secret
- Secrets are cryptographically random (via `crypto.randomBytes`)

## SSRF Defense

The module validates endpoint URLs at **two points** to prevent Server-Side Request Forgery:

### 1. Registration Time

When `createEndpoint()` is called, the URL is validated:

- Must be a valid HTTPS URL (HTTP only allowed with `allowPrivateUrls: true`)
- Hostname is resolved via DNS
- Resolved IPs are checked against blocked ranges

### 2. Dispatch Time

Before every HTTP request, the URL is validated **again**:

- DNS is re-resolved to prevent DNS rebinding attacks
- Resolved IPs are re-checked against blocked ranges

### Blocked IP Ranges

The following are blocked by default:

| Range | Description |
|-------|-------------|
| `127.0.0.0/8` | Loopback |
| `10.0.0.0/8` | Private (RFC 1918) |
| `172.16.0.0/12` | Private (RFC 1918) |
| `192.168.0.0/16` | Private (RFC 1918) |
| `169.254.0.0/16` | Link-local / cloud metadata |
| `0.0.0.0/8` | "This" network |
| `::1` | IPv6 loopback |
| `::ffff:10.x.x.x` | IPv4-mapped IPv6 (bypass detection) |

### Additional Protections

- **Redirect blocking** — HTTP redirects are disabled (`redirect: 'manual'` in fetch). A 3xx response is treated as a failure, preventing redirect-based SSRF bypass
- **IPv4-mapped IPv6** — Detects and blocks `::ffff:` prefixed addresses that map to private IPv4 ranges

Validation failures use a structured error type:

```typescript
import { WebhookUrlValidationError } from '@nestarc/webhook';

try {
  await endpointAdmin.createEndpoint({ url, events: ['order.created'] });
} catch (error) {
  if (error instanceof WebhookUrlValidationError) {
    throw new BadRequestException({
      message: error.message,
      reason: error.reason,
      resolvedIp: error.resolvedIp,
    });
  }
  throw error;
}
```

Branch on `reason` (`parse`, `scheme`, `blocked_hostname`, `loopback`, `private`, `link_local`, or `invalid_target`) instead of matching error-message text.

::: tip
Set `allowPrivateUrls: true` only in development and testing environments. Never enable it in production.
:::

## Secret Handling

Secrets are treated as sensitive throughout the module:

| Operation | Secret Visible? |
|-----------|----------------|
| `createEndpoint()` | Yes — returned once for customer to store |
| `listEndpoints()` | No — excluded from results |
| `getEndpoint()` | No — excluded from results |
| `updateEndpoint()` | No — cannot be changed after creation |
| `rotateSecret()` | Yes — new secret returned once; previous secret retained internally until expiry |
| Internal delivery enrichment | Yes — loaded internally for signing, never exposed via admin API |

This follows the same pattern as Stripe API keys — shown once at creation, never retrievable afterward.

### Rotate with overlap

```typescript
const rotated = await endpointAdmin.rotateSecret(endpointId, {
  previousSecretExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
});

await provisionReceiver(rotated?.secret);
```

Queued deliveries retain their snapshotted destination and signing material. During the overlap window, receivers should try the current and previous secret against the multi-signature header, then remove the previous secret after expiry.

### Encrypt secrets at rest

The default `PlaintextSecretVault` preserves backward compatibility but does not encrypt database values. Supply a `WebhookSecretVault` implementation when application policy requires encryption at rest:

```typescript
WebhookModule.forRoot({
  prisma,
  secretVault: kmsBackedWebhookSecretVault,
});
```

The vault encrypts before endpoint storage and decrypts only during internal delivery enrichment.
