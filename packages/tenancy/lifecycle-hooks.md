---
description: "React to tenant resolution events with lifecycle hooks — onTenantResolved, onTenantNotFound, and custom hook handlers."
---

# Lifecycle Hooks

React to tenant resolution events without extending the middleware:

```typescript
TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  onTenantResolved: async (tenantId, req) => {
    // Runs inside AsyncLocalStorage context — getCurrentTenant() works here
    logger.info({ tenantId, path: req.path }, 'tenant resolved');
    await auditService.recordAccess(tenantId);
  },
  onTenantNotFound: (req, res) => {
    // Option 1: Observation only (return void → next() is called)
    logger.warn({ path: req.path }, 'no tenant');

    // Option 2: Block the request (throw an exception)
    throw new ForbiddenException('Tenant header required');

    // Option 3: Return 'skip' to prevent next() — use res to send your own response
    res.status(401).json({ message: 'Tenant header required' });
    return 'skip';
  },
})
```

| Hook | Signature | When |
|------|-----------|------|
| `onTenantResolved` | `(tenantId: string, req: Request) => void \| Promise<void>` | After successful extraction and validation |
| `onTenantNotFound` | `(req: Request, res: Response) => void \| 'skip' \| Promise<void \| 'skip'>` | When no tenant ID could be extracted |

## Error Responses

| Scenario | Status | Message |
|----------|--------|---------|
| Missing tenant header (no `@BypassTenancy`) | 403 | `Tenant ID is required` |
| Invalid tenant ID format | 400 | `Invalid tenant ID format` |
| Non-HTTP context (WebSocket, gRPC) | — | Guard skips (no enforcement) |

## Tenant ID Forgery Prevention

Cross-validate the tenant ID against a secondary source to prevent header forgery:

```typescript
import { JwtClaimTenantExtractor } from '@nestarc/tenancy';

TenancyModule.forRoot({
  tenantExtractor: 'X-Tenant-Id',
  // Cross-check against JWT claim — rejects if they differ
  crossCheckExtractor: new JwtClaimTenantExtractor({ claimKey: 'tenantId' }),
  onCrossCheckFailed: 'reject', // 'reject' (default) | 'log'
})
```

If the cross-check extractor returns `null` (e.g., no JWT present), validation is skipped — unauthenticated endpoints work normally. On mismatch, `tenant.cross_check_failed` event is emitted.
