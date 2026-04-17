---
description: "The @nestarc/api-keys key format — <namespace>_<env>_<12-char-prefix>_<32-char-secret> — and what is stored vs shown once."
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
- a SHA-256 hash of the secret, salted with the current pepper
- the pepper version used at hashing time
- `tenantId`, `environment`, `scopes`, `name`
- `createdAt`, `expiresAt` (optional), `revokedAt`

The raw secret is **never** written to storage or logs.

## Prefix lookup, timing-safe verification

1. The guard parses the incoming key and looks up the record by `prefix`.
2. It hashes the supplied secret with the stored record's `pepperVersion`.
3. It compares hashes with `crypto.timingSafeEqual`.

Lookup is a single indexed read; verification is constant-time relative to the candidate hash length, so attackers cannot distinguish "prefix exists" from "secret mismatched" via response timing.

## Never logging keys

The package exports `API_KEY_REDACT_REGEX` for use in log pipelines:

```typescript
import { API_KEY_REDACT_REGEX } from '@nestarc/api-keys';

export function redactApiKeys(value: string): string {
  return value.replace(API_KEY_REDACT_REGEX, '[REDACTED_API_KEY]');
}
```

Use it in your logger's message/metadata serializer before anything hits stdout, files, or an observability backend.
