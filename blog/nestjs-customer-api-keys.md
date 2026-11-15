---
title: "Add Customer API Keys to an Existing NestJS App"
date: 2026-11-15
description: "Open one tenant-scoped reports endpoint with @nestarc/api-keys. Run the NestJS and Prisma example, then verify scopes, revocation, and key rotation."
author: nestarc
reviewed: 2026-11-15
versionScope: "@nestarc/api-keys 0.4.0 (Preview); runnable example pins NestJS 11.2.10 and Prisma 7.10.1 with PostgreSQL; Node.js 24.x"
---

# Add Customer API Keys to an Existing NestJS App

“Can our reporting system fetch our company's reports every morning?”

Your customer already signs in to the web app. Their scheduled script needs a credential with its own permissions and lifecycle: it should read their reports, stop working when revoked, and support a planned replacement without interrupting the integration.

That is a useful first API-key feature. Add `@nestarc/api-keys` to one customer-facing endpoint, keep your existing user login for key management, and verify the boundary with actual HTTP requests. The package provides key storage, request guards, scopes, and rotation. Your application decides who may manage keys and which records belong to the authenticated tenant.

**[Download the runnable example](/examples/api-keys-0.4.0.zip)** to issue a key and fetch a report before changing your app. This walkthrough uses **API Keys 0.4.0, currently Preview**. The example pins its dependencies; check the [installation requirements](/packages/api-keys/installation) before choosing a different combination.

## Start with one customer integration

The example has two customers, each with a report and an administrator. It separates their two kinds of access:

| Caller | Endpoint | Identity and permission |
| --- | --- | --- |
| Customer administrator | `/admin/api-keys` | A fixed local administrator identity in the demo; your existing user authentication and tenant authorization in your app. |
| Customer's integration | `/reports` | An API key for that tenant with the `reports:read` scope. |

The administrator creates a read-only key, shows its secret once, and gives it to the customer through an appropriate secret-delivery channel. The customer sends that key as `Authorization: Bearer …` when fetching reports. The API uses the verified key's tenant identity for its database query.

No other nestarc package is required for this first endpoint. You can add more detailed role policies or a database isolation layer when your application needs them.

## Run the example before changing your app

The archive includes a NestJS application, Prisma schema and migrations, a lockfile, Docker Compose configuration, and an HTTP smoke test. It uses the published `@nestarc/api-keys@0.4.0` package with PostgreSQL storage.

You need **Node.js 24.x**, npm, and Docker Compose. The disposable database listens on local port **5434**; the HTTP app uses **127.0.0.1:3000**. Run the commands in a new directory:

```sh
curl -fL https://nestarc.dev/examples/api-keys-0.4.0.zip \
  -o api-keys-0.4.0.zip
unzip api-keys-0.4.0.zip
cd api-keys-quick-start
cp .env.example .env
docker compose up -d --wait
npm ci --strict-peer-deps
npm run db:setup
npm run smoke
```

The smoke test starts the app on an available local port and sends real HTTP requests against the migrated database. It checks the first successful read, rejected requests, tenant boundaries, revocation, and rotation, then closes the application.

A passing run ends with this summary:

```json
{
  "package": "@nestarc/api-keys@0.4.0",
  "storage": "PostgreSQL",
  "firstCall": "passed",
  "tenantIsolation": "passed",
  "scopeDenial": "passed",
  "environmentDenial": "passed",
  "adminBoundary": "passed",
  "tenantBoundManagement": "passed",
  "restartPersistence": "passed",
  "rotationGrace": "passed",
  "revocation": "passed"
}
```

These are test results, not an API response. The persistence check closes and recreates the Nest application and Prisma connection pool before reusing the issued key. The smoke test removes only the keys it creates, leaving the seed reports available for the manual walkthrough.

::: info Local demonstration identities
The example maps `DEMO_ADMIN_TOKEN_A` and `DEMO_ADMIN_TOKEN_B` to two fixed administrator identities. These values and the demonstration pepper in `.env.example` are public local fixtures. The app binds to loopback. Replace this authentication adapter with your existing authenticated user and authorized tenant context before deploying it.
:::

Start the application for the manual walkthrough:

```sh
npm start
```

### Issue a key and read the first report

In a second terminal, from the same example directory, load the local demonstration settings and issue a key as customer A's administrator:

```sh
set -a
. ./.env
set +a

ISSUED=$(curl --fail-with-body -sS -X POST \
  http://127.0.0.1:3000/admin/api-keys \
  -H "Authorization: Bearer $DEMO_ADMIN_TOKEN_A")

API_KEY=$(printf '%s' "$ISSUED" | node -pe \
  'JSON.parse(require("node:fs").readFileSync(0, "utf8")).key')
KEY_ID=$(printf '%s' "$ISSUED" | node -pe \
  'JSON.parse(require("node:fs").readFileSync(0, "utf8")).id')

curl --fail-with-body -sS http://127.0.0.1:3000/reports \
  -H "Authorization: Bearer $API_KEY"
```

The response contains customer A's report:

```json
[
  { "id": "report-a", "tenantId": "tenant-a", "title": "Acme monthly report" }
]
```

Customer B's report is absent. The key-creation endpoint determines the tenant from the authenticated administrator; it accepts no tenant ID from the request body.

The returned `key` is the raw credential. Show it once and keep it out of logs, analytics, and error reports. PostgreSQL stores the lookup prefix, hash, policy, and lifecycle fields. Retain `id` for later management operations.

### Confirm that read access has limits

The same read-only key cannot create a report:

```sh
curl -i -X POST http://127.0.0.1:3000/reports \
  -H "Authorization: Bearer $API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"title":"This write should be denied"}'
```

Expect **403** with `api_key_scope_insufficient`. Calling `GET /reports` without a key returns **401**. The smoke test also tries another customer's report ID and verifies that the application does not return it.

## Keep authentication and data ownership connected

The example's `@CustomerApi()` decorator applies `ApiKeysGuard` and requires a `live` key. It also marks the route for the global administrator guard, which skips its user-authentication check only on these explicitly marked integration routes. All other routes still require the demo administrator identity.

In an existing app, make this choice explicit in your JWT or session guard. A global login guard runs before controller guards; adding `ApiKeysGuard` to a controller does not by itself exempt it from that earlier login requirement. Preserve the API-key guard when adding an exemption, and keep key-management endpoints behind user authentication and tenant authorization.

The list route in `src/controllers.ts` uses the verified key context in its Prisma query. This excerpt keeps the imports and provider used by the runnable example:

```typescript
import { Controller, Get, Inject } from '@nestjs/common';
import {
  CurrentApiKey, RequireScope, type ApiKeyContext,
} from '@nestarc/api-keys';
import { CustomerApi } from './auth';
import { DATABASE } from './database';
import { PrismaClient } from './generated/prisma/client';

@Controller('reports')
@CustomerApi()
export class ReportsController {
  constructor(@Inject(DATABASE) private readonly prisma: PrismaClient) {}

  @Get()
  @RequireScope('reports', 'read')
  list(@CurrentApiKey() key: ApiKeyContext) {
    return this.prisma.report.findMany({
      where: { tenantId: key.tenantId },
      orderBy: { id: 'asc' },
    });
  }
}
```

The module supplies the same Prisma client to this controller and `PrismaApiKeyStorage`. A `reports:read` scope says what the caller may do; the tenant predicate identifies whose records it may read. Both are required.

For a record-by-ID endpoint, include the tenant in the lookup as well. Looking up an arbitrary report by ID after checking only the scope would allow cross-customer access. Return the same not-found response for a missing report and one owned by another tenant.

`ApiKeysGuard` checks the credential, required environment, IP policy when configured, and scope. Routes without `@RequireEnvironment` accept both `live` and `test` keys. The example explicitly requires `live`; the labels alone do not isolate environments. See [Guards & Scopes](/packages/api-keys/guards-scopes) and [Environments](/packages/api-keys/environments).

## Replace or revoke a customer's key

For a planned replacement, call the management endpoint with the customer's administrator credential:

```sh
REPLACEMENT=$(curl --fail-with-body -sS -X POST \
  "http://127.0.0.1:3000/admin/api-keys/$KEY_ID/rotate" \
  -H "Authorization: Bearer $DEMO_ADMIN_TOKEN_A")

NEW_KEY=$(printf '%s' "$REPLACEMENT" | node -pe \
  'JSON.parse(require("node:fs").readFileSync(0, "utf8")).key')
NEW_KEY_ID=$(printf '%s' "$REPLACEMENT" | node -pe \
  'JSON.parse(require("node:fs").readFileSync(0, "utf8")).id')

curl --fail-with-body -sS http://127.0.0.1:3000/reports \
  -H "Authorization: Bearer $API_KEY"
curl --fail-with-body -sS http://127.0.0.1:3000/reports \
  -H "Authorization: Bearer $NEW_KEY"
```

The example grants the old key a **10-second grace period** so that you can observe expiry locally. Run the block together to try both keys within that window. The replacement response includes `graceExpiresAt`; wait past that deadline and compare the requests again:

```sh
sleep 11
curl -i http://127.0.0.1:3000/reports \
  -H "Authorization: Bearer $API_KEY"
curl --fail-with-body -sS http://127.0.0.1:3000/reports \
  -H "Authorization: Bearer $NEW_KEY"
```

The old key now returns **401** and the replacement continues working. The smoke test checks both sides of the grace deadline automatically. Choose a migration window appropriate to your customers in a deployed application.

To revoke the replacement immediately:

```sh
curl -i -X DELETE \
  "http://127.0.0.1:3000/admin/api-keys/$NEW_KEY_ID" \
  -H "Authorization: Bearer $DEMO_ADMIN_TOKEN_A"

curl -i http://127.0.0.1:3000/reports \
  -H "Authorization: Bearer $NEW_KEY"
```

Expect **204** from revocation, then **401** with `api_key_revoked` from the report request. For a compromised key, revoke it immediately instead of granting a grace window.

The management controller uses `rotateForTenant()` and `revokeForTenant()` with the administrator's trusted tenant. These methods bind the tenant to the storage mutation. Missing and cross-tenant key IDs receive the same not-found outcome. Authorize the administrator before calling them; knowing a tenant ID is not proof of permission. See [User Key Rotation](/packages/api-keys/user-key-rotation).

## Decide what a passing trial means

Run `npm run smoke` after changing the example. Adapt these checks to your application's authentication and data model:

| Check | Expected result |
| --- | --- |
| Read reports with customer A's key | 200 with only customer A's reports. |
| Omit the key or send an invalid credential | 401; no report data is returned. |
| Create a report with a read-only key | 403; no report is created. |
| Request customer B's report with customer A's key | 404, matching a nonexistent report. |
| Use an integration key to manage keys | User authentication rejects the request. |
| Rotate or revoke another tenant's key | Not found; the other tenant's key remains usable. |
| Use a revoked key | 401. |
| Rotate a key | Both keys work during the grace period; afterward only the replacement works. |

The fixture's explicit tenant predicates protect these application queries. API key scopes do not install PostgreSQL RLS or cover unrelated queries, jobs, and scripts. Keep any existing database isolation policy in place and test its interaction with your verified identity flow.

When finished, stop the application and run `docker compose down` from the example directory to remove its disposable database. See the included README for the exact file layout and configuration.

## Move one endpoint into your app

Follow [Installation](/packages/api-keys/installation) to add the `ApiKey` model and register the module with your existing Prisma client. Copy the report route's identity and scope handling into one endpoint, and keep the trusted-tenant predicates in its service methods. Use the [Prisma 7 setup guide](/guide/prisma-7) if your generated client and PostgreSQL adapter are not already configured.

Replace the demo administrator guard with your current user authentication and key-management permission checks. Supply your own secret pepper, keep issued keys out of request logging, and decide how long keys may live. The example's fixtures make the workflow reproducible; production identity and secret management belong to your application.

If that first integration needs richer permissions later, connect [tenant-aware RBAC](/guide/rbac-access-control). If operators need an authoritative history of key-management actions, design that workflow with [audit logging](/packages/audit-log/); API-key lifecycle observers are best-effort notifications, not transactional audit evidence.

**[Run the example](/examples/api-keys-0.4.0.zip), then add one customer-facing read endpoint.** The first milestone is a customer script that can read its own data, cannot exceed its granted scope, and loses access when its key is revoked.
