---
description: "Rotate the server-side pepper with zero downtime — old keys keep working because each record remembers the pepper version used at hashing time."
---

# Pepper Rotation

A **pepper** is a server-side secret mixed into the SHA-256 hash of every API key. Unlike a per-key salt, the pepper lives in configuration and never touches storage, so an attacker who exfiltrates the database still can't brute-force secrets offline without it.

`@nestarc/api-keys` supports **versioned peppers** — you can rotate without breaking existing keys.

## How records track the pepper

Each stored record remembers the `pepperVersion` used when it was hashed. Verification always hashes the candidate secret with the version stored on that record, regardless of which version is current.

That means rotation is additive:

1. Add a new pepper version.
2. Point `currentPepperVersion` at it.
3. New keys hash under the new version; old keys keep verifying under their original version.

There is no "flag day". No re-hashing sweep is required.

## Configuring multiple versions

```typescript
ApiKeysModule.forRoot({
  namespace: 'acme',
  peppers: {
    1: process.env.API_KEY_PEPPER_V1!,
    2: process.env.API_KEY_PEPPER_V2!,
  },
  currentPepperVersion: 2,
  storage: new PrismaApiKeyStorage(prisma),
});
```

- Every version referenced by any stored record must remain in `peppers`.
- `currentPepperVersion` must exist in `peppers` — the module fails fast at startup otherwise, so a misconfigured deployment never boots with keys it can't verify.

## Retiring old versions

To fully retire pepper version 1, you need to rotate the keys issued under it:

1. Identify keys with `pepperVersion === 1` (either via storage query or by building a selector over your adapter).
2. Ask their owners to regenerate (or regenerate on their behalf if that matches your threat model).
3. Revoke the old keys.
4. Once no active records reference version 1, remove the entry from `peppers`.

Until then, keep the old version available — removing it would break verification for any key still using it.

## Threat model reminder

- The pepper is **not** a replacement for careful secret management — treat it like a database credential.
- The pepper is **not** a salt — it's shared across all records. A per-key salt isn't needed because API keys already have 32 bytes of entropy; the pepper exists to defeat offline attacks on the hash table.
- Rotate the pepper if you suspect exposure, or on a cadence that matches your broader secret-rotation policy.
