---
description: "Recommended order to adopt nestarc packages — start with tenancy, add safe-response, then layer in audit-log, feature-flag, soft-delete, and pagination."
---

# Adoption Roadmap

nestarc packages are independent — you can install any one without the others. But adopting them in the right order minimizes rework and maximizes value at each step.

## Recommended Order

```
Step 1       Step 2           Step 3         Step 4
tenancy  →  safe-response  →  audit-log  →  pick what you need
                                             ├─ feature-flag
                                             ├─ soft-delete
                                             └─ pagination
```

## Step 1: tenancy (Day 1)

**Why first:** Tenant isolation is a foundational requirement. Every other package benefits from having tenant context available.

**What you get:**
- PostgreSQL RLS enforcement on all queries
- Automatic `tenant_id` injection on writes
- Zero data leaks between tenants

**Time to integrate:** 5–15 minutes

```bash
npm install @nestarc/tenancy
```

[Getting Started →](/getting-started) · [Full Docs →](/packages/tenancy/)

---

## Step 2: safe-response (Day 1–2)

**Why second:** Once your API works, standardize the response format before frontend teams start integrating. Changing response shapes later is painful.

**What you get:**
- Every endpoint returns `{ success, data, error, meta }` automatically
- Error codes map to HTTP status codes
- Swagger schemas auto-generated
- Pagination metadata included when applicable

**Time to integrate:** 5–10 minutes (module registration only — no service changes)

```bash
npm install @nestarc/safe-response
```

[Quick Start →](/packages/safe-response/installation) · [Response Format →](/packages/safe-response/response-format)

---

## Step 3: audit-log (Day 2–3)

**Why third:** Audit logging should be added early — before real user data enters the system. Retroactively backfilling audit history is impossible.

**What you get:**
- Automatic tracking of all create, update, delete operations
- Before/after diffs stored as JSON
- No changes to existing services required (Prisma extension)
- Multi-tenancy aware (uses tenant context from Step 1)

**Time to integrate:** 15–30 minutes

```bash
npm install @nestarc/audit-log
```

[Quick Start →](/packages/audit-log/installation) · [Guide: Adding Audit Trail →](/guide/audit-trail)

---

## Step 4: Pick What You Need

The remaining packages are independent. Adopt them based on your current needs:

### feature-flag — when you need gradual rollouts

Best added when you're about to ship a risky feature and want to gate it behind a flag, or when you need tenant-specific behavior differences.

```bash
npm install @nestarc/feature-flag
```

[Quick Start →](/packages/feature-flag/installation) · [Guide: Feature Flags for Rollout →](/guide/feature-flags-rollout)

### soft-delete — when you need data recovery

Add this when your application handles data that users might accidentally delete, or when compliance requires retaining deleted records for a period.

```bash
npm install @nestarc/soft-delete
```

[Quick Start →](/packages/soft-delete/installation) · [Cascade Configuration →](/packages/soft-delete/cascade)

### pagination — when you have list endpoints

If your API has endpoints that return collections, add pagination early to avoid breaking changes when data volume grows.

```bash
npm install @nestarc/pagination
```

[Quick Start →](/packages/pagination/installation) · [Offset vs Cursor →](/packages/pagination/offset-vs-cursor)

---

## Prisma Extension Order

When using multiple packages, chain the Prisma extensions in this order:

```typescript
const prisma = new PrismaClient()
  .$extends(createPrismaTenancyExtension(tenancyService))   // 1. must be first
  .$extends(createPrismaSoftDeleteExtension(softDeleteOpts)) // 2. before audit
  .$extends(createAuditExtension(auditOpts));                // 3. last — sees final state
```

**Why this order matters:**
1. **Tenancy** must be first — it sets `app.current_tenant` via `set_config`, which all subsequent queries depend on
2. **Soft-delete** should come before audit-log — so audit records reflect the soft-delete (not a hard delete)
3. **Audit-log** should be last — it captures the final state of the operation after all other extensions have run

See the [Prisma Extension Chaining](/guide/prisma-extension-chaining) guide for a complete walkthrough.

## All Packages at a Glance

| Package | Added In | Requires Code Changes? | Depends On |
|---------|----------|----------------------|------------|
| tenancy | Step 1 | Yes (module + Prisma extension) | — |
| safe-response | Step 2 | No (interceptor auto-applies) | — |
| audit-log | Step 3 | No (Prisma extension) | Optional: tenancy |
| feature-flag | Step 4 | Yes (decorators on routes) | Optional: tenancy |
| soft-delete | Step 4 | No (Prisma extension) | — |
| pagination | Step 4 | Yes (decorators on routes) | Optional: safe-response |
