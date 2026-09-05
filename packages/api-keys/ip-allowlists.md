---
description: "Restrict @nestarc/api-keys credentials to IPv4, IPv6, or CIDR ranges with proxy-aware resolution and fail-closed guard enforcement."
---

# IP Allowlists

Version 0.3 can bind each key to exact client addresses or CIDR ranges. The policy is stored with the key and enforced by `ApiKeysGuard` after the credential is verified.

## Issue a restricted key

```typescript
const { id, key } = await apiKeys.create({
  tenantId: 'tenant_123',
  name: 'Office integration',
  scopes: [{ resource: 'reports', level: 'read' }],
  allowedIpCidrs: [
    '203.0.113.42',
    '10.20.0.0/16',
    '2001:db8::/48',
  ],
});
```

Exact IPv4 addresses are stored as `/32` and exact IPv6 addresses as `/128`. CIDRs are normalized to their network address and duplicates are removed before storage. Invalid or blank entries reject key creation instead of silently weakening the policy.

An omitted or empty array means unrestricted access:

```typescript
allowedIpCidrs: []
```

## Fail-closed enforcement

For a restricted key, all of these cases return `api_key_ip_not_allowed` with HTTP 403:

- the resolved address is outside every configured range;
- the client IP is missing;
- the resolved value is not a valid IP address;
- every stored allowlist entry is invalid.

An unrestricted key does not need a resolved address.

::: warning Guard boundary
IP policy is enforced by `ApiKeysGuard`, not by `ApiKeysService.verify()` alone. For custom transports on 0.4, call `authorizeRequest()` with the verified connection address and required environment/scope. The low-level `isIpAllowed()` utility remains available, but does not apply the complete request-policy or accepted-usage contract.
:::

## Resolve the real client IP safely

The default resolver reads `request.ip`. It never reads `X-Forwarded-For` directly, because an untrusted client can forge that header.

When the application sits behind a load balancer or reverse proxy, configure the Nest HTTP adapter's trusted-proxy behavior so `request.ip` represents the verified client hop. If the infrastructure already establishes the client identity elsewhere, inject a resolver:

```typescript
ApiKeysModule.forRoot({
  namespace: 'acme',
  peppers: { 1: process.env.API_KEY_PEPPER! },
  storage,
  clientIpResolver: async (request) => {
    const req = request as { verifiedClientIp?: string };
    return req.verifiedClientIp;
  },
});
```

The resolver may return a string, `undefined`, or a promise. Returning `undefined` denies restricted keys.

## Update policy during rotation

Replacement keys inherit the old allowlist unless you provide a new one:

```typescript
await apiKeys.rotate(keyId, {
  gracePeriodMs: 10 * 60 * 1000,
  allowedIpCidrs: ['198.51.100.0/24'],
});
```

Pass `allowedIpCidrs: []` to make the replacement unrestricted. The old key retains its original policy throughout its grace window.

## Prisma upgrade

Add this field to an existing `ApiKey` model and run a migration:

```prisma
allowedIpCidrs String[] @default([])
```

The empty default preserves the behavior of pre-0.3 records. Custom storage adapters should round-trip the optional `allowedIpCidrs` property on records and contexts; no new storage method was added in 0.3.

## Operational guidance

- Prefer stable egress ranges for server-to-server integrations; residential and mobile addresses change frequently.
- Keep allowlists narrow, but include every legitimate NAT or disaster-recovery egress path before enabling them.
- Treat proxy configuration as part of the security boundary and test both allowed and denied requests through the production proxy chain.
- Use [lifecycle events](./lifecycle-context) for per-key audit detail and [verification metrics](./metrics-testing) for bounded operational telemetry.

## Custom transports in 0.4

Use `authorizeRequest({ rawKey, clientIp, requiredEnvironment, requiredScope })` when a transport needs request policy enforcement. `verify()` returns credential context without enforcing the stored allowlist. Missing IP on a restricted credential is a denial; obtain IP from the authenticated connection/proxy boundary. [Request authorization example](./guards-scopes#request-authorization-outside-http).
