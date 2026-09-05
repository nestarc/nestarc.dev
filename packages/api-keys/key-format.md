---
description: "The @nestarc/api-keys key format — namespace, environment, 12-character prefix, and 32-character secret — and what is stored vs shown once."
---

# Key Format

Issued keys follow a Stripe-style layout:

```text
<namespace>_<env>_<12-char-prefix>_<32-char-secret>
```

For example, with `namespace: 'nk'` and `environment: 'live'`:

```text
nk_live_aB3cD4eF5gH6_9i8J7k6L5m4N3o2P1q0RstUvWxYzAB12345
```

| Segment | Purpose | Safe to show |
| --- | --- | --- |
| `namespace` | Product/service identifier (e.g. `acme`, `billing`) | Yes |
| `env` | `live` or `test` | Yes |
| 12-char prefix | Lookup index — one hit into storage | Yes |
| 32-char secret | Verified with SHA-256 + pepper | **Only once, at creation** |

## What is stored

The storage adapter persists:

- the prefix (indexed)
- a SHA-256 hash of the secret, mixed with the current pepper
- the pepper version used at hashing time
- `tenantId`, `environment`, `scopes`, `name`, and `allowedIpCidrs`
- `createdAt`, `createdBy`, `lastUsedAt`, `expiresAt`, and `revokedAt`
- `rotatedAt` and `replacedByKeyId` for replacement history

The raw secret is **never** written to storage or logs.

## Prefix lookup, timing-safe verification

1. The guard parses the incoming key and looks up the record by `prefix`.
2. It hashes the supplied secret with the stored record's `pepperVersion`.
3. It compares hashes with `crypto.timingSafeEqual`.

Hash comparison is timing-safe and missing/known-prefix failures perform bounded hash work. This does not make the complete database/request path constant-time.

The safe prefix is also exposed on `ApiKeyContext` and audit-safe lifecycle events. Use it to identify a credential in logs or a customer dashboard without exposing the raw secret.

## Never logging keys

The package exports `API_KEY_REDACT_REGEX` for use in log pipelines:

```typescript
import { API_KEY_REDACT_REGEX } from '@nestarc/api-keys';

export function redactApiKeys(value: string): string {
  return value.replace(API_KEY_REDACT_REGEX, '[REDACTED_API_KEY]');
}
```

Use it in your logger's message/metadata serializer before anything hits stdout, files, or an observability backend.

## 0.4 issuance and verification rules

Namespaces are 1–32 ASCII letters/digits; prefix and secret syntax is base62. Invalid namespace or scope input fails before key generation. Reissue credentials from unsupported namespaces before upgrading.

The secret is authenticated before revoked/expired state is revealed. A wrong secret returns `api_key_invalid` even for a known revoked prefix. After authentication, the raw `live`/`test` segment must match the stored environment; segment-only tampering fails without attaching stored identity to failure telemetry.

`ApiKeysService.list()` exposes only `ApiKeySummary[]`, never hashes, pepper versions, or raw secrets. The storage adapter's internal record remains private to verification and rotation.
