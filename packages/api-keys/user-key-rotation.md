---
description: "Replace customer API keys without downtime using ApiKeysService.rotate(), atomic storage updates, and configurable grace periods."
---

# User Key Rotation

User key rotation replaces the raw credential a customer or integration sends. It is separate from [pepper rotation](./pepper-rotation), which changes the server-side secret used to hash newly issued keys.

## Rotate with a grace window

```typescript
const replacement = await apiKeys.rotate(keyId, {
  gracePeriodMs: 10 * 60 * 1000,
  name: 'Primary replacement',
  createdBy: 'user_123',
});

// replacement.id
// replacement.key             — returned once
// replacement.replacedKeyId
// replacement.graceExpiresAt
```

The storage adapter atomically inserts the replacement and updates the old record with:

- `rotatedAt` — when replacement occurred;
- `replacedByKeyId` — the replacement record id;
- `expiresAt` — the grace deadline, unless the old key already expires earlier.

The old key remains usable until that deadline. `gracePeriodMs` defaults to `0`, so omitting it expires the old credential immediately.

## What the replacement inherits

By default, the new key keeps the old key's:

- `tenantId`;
- `environment`;
- scopes;
- name and creator;
- expiration;
- `allowedIpCidrs`.

You can replace selected mutable fields:

```typescript
await apiKeys.rotate(keyId, {
  name: 'CI replacement',
  createdBy: 'rotation_job',
  expiresAt: new Date('2026-12-31T00:00:00Z'),
  allowedIpCidrs: ['203.0.113.0/24'],
});
```

Use `expiresAt: null` only when your configured TTL policy permits non-expiring keys. Pass `allowedIpCidrs: []` to remove an inherited IP restriction.

## Preconditions and errors

`rotate()` throws `ApiKeyOperationError` with one of these stable codes:

| Code | Meaning |
| --- | --- |
| `api_key_record_not_found` | No record exists for the supplied id. |
| `api_key_not_rotatable` | The key is revoked, expired, or already has a replacement. |

A key can be replaced only once. This keeps the replacement chain unambiguous and prevents concurrent rotations from silently forking credentials.

## Compromise versus routine rotation

Use a grace window for planned customer migration, secret-management automation, or a scheduled credential rollover. Revoke immediately when the old credential is known or suspected to be compromised:

```typescript
await apiKeys.revoke(keyId);
```

Do not grant a compromised key an overlap window merely to avoid client disruption.

## Storage requirements

Version 0.2 added `findById()` and `rotate()` to `ApiKeyStorage`. Custom adapters must make the insert-and-update rotation operation atomic. Prisma users need `rotatedAt`, `replacedByKeyId`, and an index on `replacedByKeyId`; see [Installation](./installation#upgrading-an-existing-installation).

The raw replacement secret follows the same show-once invariant as a newly created key. Store only its record id after presenting it to the caller.

## Tenant-bound management and custom adapters in 0.4

After authorizing the caller's tenant membership, bind that exact tenant to the mutation:

```typescript
const replacement = await apiKeys.rotateForTenant(callerTenantId, keyId, {
  gracePeriodMs: 10 * 60 * 1000,
});
await apiKeys.revokeForTenant(callerTenantId, keyId);
```

Missing and cross-tenant IDs both return `api_key_record_not_found`. The built-in adapters include the expected tenant in the update/CAS; the service does not implement a check-then-mutate fallback.

Custom `rotate(input)` must return `Promise<'rotated' | 'not_rotatable'>` from one atomic claim-and-insert operation. Exactly one concurrent caller can produce a linked replacement; losers receive `api_key_not_rotatable`. Roll back the old-key claim if insertion fails. A legacy `Promise<void>` adapter is incompatible with 0.4.

Validate all dates and TTL/grace durations before mutation. Invalid time values use `api_key_invalid_time`; three duplicate-prefix attempts use `api_key_prefix_collision`. The replacement raw key is still shown only once.
