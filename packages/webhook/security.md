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
import { UnauthorizedException } from '@nestjs/common';
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

`verify()` and `verifyWithTolerance()` accept space-separated `v1,...` signatures and succeed when any one signature matches the supplied secret. This supports controlled secret-rotation overlap. A finite tolerance rejects stale or excessively future timestamps; the same signed request remains valid repeatedly inside that window. Separately deduplicate `webhook-id` in persistent storage and commit that record atomically with receiver side effects. Scope deduplication to the receiver when one event is sent to multiple destinations.

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
- Auto-generated secrets use `crypto.randomBytes`; callers supplying their own secrets must provide cryptographically random values
- Header names and HMAC wire format follow Standard Webhooks. This package accepts unprefixed base64 secrets, not the `whsec_` serialization used by Standard Webhooks tooling. Translate key serialization deliberately when integrating another verifier; do not pass the prefix as part of this package's base64 key.

## SSRF Defense

The module validates endpoint URLs at **two points** to prevent Server-Side Request Forgery:

### 1. Registration Time

When `createEndpoint()` is called, the URL is validated:

- Must use `http:` or `https:`. The current package accepts publicly routed HTTP even when `allowPrivateUrls` is false, so a production administration API must enforce `https:` before calling the package.
- Hostname is resolved via DNS
- Resolved IPs are checked against blocked ranges

### 2. Dispatch Time

Before every HTTP request, the URL is validated **again**:

- DNS is re-resolved to prevent DNS rebinding attacks
- Resolved IPs are re-checked against blocked ranges
- The default HTTP client connects using those validated addresses while preserving the original hostname for TLS

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

- **Redirect blocking** — `FetchHttpClient` uses Node.js `http.request` / `https.request` and does not follow redirects. A 3xx response is retried while attempts remain without requesting the redirect target
- **IPv4-mapped IPv6** — Detects and blocks `::ffff:` prefixed addresses that map to private IPv4 ranges

Validation failures use a structured error type:

```typescript
import { BadRequestException } from '@nestjs/common';
import { WebhookUrlValidationError } from '@nestarc/webhook';

function requireHttpsWebhookUrl(value: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new BadRequestException('Webhook URL must be valid');
  }
  if (parsed.protocol !== 'https:') {
    throw new BadRequestException('Webhook URL must use HTTPS');
  }
  return parsed.toString();
}

try {
  await endpointAdmin.createEndpoint({
    url: requireHttpsWebhookUrl(url),
    events: ['order.created'],
  });
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

Apply `requireHttpsWebhookUrl()` to endpoint updates and bulk imports too. `allowPrivateUrls: false` prevents SSRF to internal networks, but it does not provide transport confidentiality.

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
| `rotateSecret()` | Yes — new secret returned once; previous-key eligibility is checked when new delivery snapshots are created |
| Internal delivery enrichment | Yes — loaded internally for signing, never exposed via admin API |

Creation and rotation responses expose the new secret once. Subsequent list/get APIs exclude secret values.

### Rotate with overlap

```typescript
const rotated = await endpointAdmin.rotateSecret(endpointId, {
  previousSecretExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
});

await provisionReceiver(rotated?.secret);
```

The overlap expiry is evaluated **when a delivery is created**, not on each HTTP attempt. Deliveries created before rotation retain their old key; those created during overlap retain both keys even after expiry. Expiry does not delete the previous key from existing snapshots. Before retiring a receiver key, account for pending deliveries, retries, and manual retry workflows that still carry it.

### Encrypt secrets at rest

The default `PlaintextSecretVault` preserves backward compatibility but does not encrypt database values. Supply a `WebhookSecretVault` implementation when application policy requires encryption at rest:

```typescript
WebhookModule.forRoot({
  prisma,
  secretVault: kmsBackedWebhookSecretVault,
});
```

The vault encrypts before endpoint storage and decrypts only during internal delivery enrichment.
