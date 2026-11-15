# Customer API keys for one NestJS endpoint

Issue a customer key, call a tenant-scoped reports endpoint, and verify scope,
environment, management, rotation, and revocation boundaries against PostgreSQL.
This example installs published `@nestarc/api-keys` **0.4.0** (Preview), NestJS
**11.2.10**, and Prisma **7.10.1** with an exact lockfile.

You need Node.js **22.13+ within 22.x or 24.x**, npm, and Docker Compose.
The manual HTTP commands use Node to parse JSON. The example is a local demonstration:
its admin tokens and database password are public fixtures, and its HTTP server
and PostgreSQL port bind to `127.0.0.1`.

## Run the complete check

```sh
cp .env.example .env
docker compose up -d --wait
npm ci --strict-peer-deps
npm run db:setup
npm run smoke
```

`db:setup` applies the checked-in migration, generates the Prisma client, compiles
TypeScript, and inserts `report-a`/`report-b` if they do not already exist. Use a
dedicated disposable database; the migration adds `ApiKey` and `Report` tables.
The smoke script starts its own HTTP server on a free loopback port. It checks:

- Customer A and B can read only their own reports, including direct-ID requests.
- Missing and tampered keys return 401; a read key's write request returns 403
  without inserting a report; a test key cannot call a live endpoint.
- Keys are issued from authenticated admin context, ignoring body-supplied tenant,
  scope, and environment. Machine keys cannot call admin key-management endpoints.
- Cross-tenant key rotation and revocation return the same 404 as a missing key,
  and leave the target key usable.
- A key remains usable after recreating the Nest application and Prisma pool.
- Old and replacement keys work during the rotation grace window. After the
  returned deadline, the old key fails while the new key still works.
- Revoking the replacement rejects its next request.

Every summary field ends in `"passed"`; no raw API keys appear in its output.
The script closes the application and deletes only the keys it created. It can
be run repeatedly without deleting other demo keys or the seeded reports.

## Make the calls yourself

Start the server in one terminal:

```sh
npm start
```

In a second terminal, issue a read-only key as customer A's demo administrator.
These commands use the public values from `.env.example`; if you changed those
values, substitute your configured admin token and HTTP port.

```sh
ADMIN_TOKEN=api-keys-local-admin-a-demo-only
ISSUED=$(curl -fsS -X POST http://127.0.0.1:3000/admin/api-keys \
  -H "Authorization: Bearer $ADMIN_TOKEN")
KEY=$(printf '%s' "$ISSUED" | node -pe \
  'JSON.parse(require("node:fs").readFileSync(0, "utf8")).key')
KEY_ID=$(printf '%s' "$ISSUED" | node -pe \
  'JSON.parse(require("node:fs").readFileSync(0, "utf8")).id')

curl -fsS http://127.0.0.1:3000/reports \
  -H "Authorization: Bearer $KEY"
```

On a fresh database the response is:

```json
[{"id":"report-a","tenantId":"tenant-a","title":"Acme monthly report"}]
```

These attempts fail:

```sh
# 401: api_key_missing
curl -i http://127.0.0.1:3000/reports

# 403: api_key_scope_insufficient
curl -i -X POST http://127.0.0.1:3000/reports \
  -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d '{"title":"Not allowed"}'

# 404: customer B's report is outside this key's tenant
curl -i http://127.0.0.1:3000/reports/report-b \
  -H "Authorization: Bearer $KEY"
```

Rotate the key. The local server uses a **10-second** grace window; the automated
smoke uses three seconds and waits against the returned `graceExpiresAt` value.

```sh
REPLACEMENT=$(curl -fsS -X POST "http://127.0.0.1:3000/admin/api-keys/$KEY_ID/rotate" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
NEW_KEY=$(printf '%s' "$REPLACEMENT" | node -pe \
  'JSON.parse(require("node:fs").readFileSync(0, "utf8")).key')
NEW_ID=$(printf '%s' "$REPLACEMENT" | node -pe \
  'JSON.parse(require("node:fs").readFileSync(0, "utf8")).id')
printf '%s' "$REPLACEMENT" | node -pe \
  'const {replacedKeyId,graceExpiresAt}=JSON.parse(require("node:fs").readFileSync(0,"utf8")); JSON.stringify({replacedKeyId,graceExpiresAt})'

# Both keys work before graceExpiresAt; the old key returns 401 afterward.
curl -i http://127.0.0.1:3000/reports -H "Authorization: Bearer $KEY"
curl -i http://127.0.0.1:3000/reports -H "Authorization: Bearer $NEW_KEY"

# Revoke the replacement: 204, then 401 api_key_revoked.
curl -i -X DELETE "http://127.0.0.1:3000/admin/api-keys/$NEW_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
curl -i http://127.0.0.1:3000/reports -H "Authorization: Bearer $NEW_KEY"
unset KEY NEW_KEY ISSUED REPLACEMENT
```

The raw secret is returned only at creation or rotation. The database stores a
hash and lookup prefix. Keep real raw keys out of logs, shell recordings, and
source control.

## Move one endpoint into your app

- `src/app.ts` registers `ApiKeysModule` with the same Prisma client used for
  business queries. In your application, reuse your existing client and merge the
  `ApiKey` model into your schema instead of applying this demo's entire migration.
  Version 0.4.0's `PrismaLike` type does not model the generated client's overloaded
  methods; the example keeps one explicit type bridge at the storage constructor.
  The HTTP smoke exercises the real storage and rotation transaction against the
  exact schema and Prisma version pinned here.
- `src/auth.ts` is an explicit substitute for an existing login system. Replace
  the fixed-token lookup with your authenticated user and authorized tenant-admin
  context. The global guard protects management routes. `@CustomerApi()` combines
  its skip marker with `ApiKeysGuard` and `@RequireEnvironment('live')`; it does
  not make the route public. Use equivalent integration with your existing global
  guard, including your session/CSRF policy when applicable.
- `src/controllers.ts` obtains tenant and creator from that trusted admin context.
  Its management routes grant only `reports:read`, live keys and use
  `rotateForTenant()`/`revokeForTenant()`. Apply your own authorization before
  choosing scopes or letting customers manage other keys.
- The reports queries include `tenantId: key.tenantId`. API-key authentication does
  not install RLS or automatically filter business queries. Preserve your existing
  data-isolation policy for every read and write.
- Set a secret high-entropy `API_KEY_PEPPER`, use TLS for real traffic, and choose
  your key lifetime and planned rotation window. This example issues 30-day keys.
  For compromised keys, revoke immediately. This package is not a rate limiter;
  keep application or gateway request limits appropriate to your API.

## Database and port options

Port 5434 is the local Compose default. To use another local port, change
`DATABASE_URL` in `.env` and start Compose with, for example,
`POSTGRES_PORT=5544 docker compose up -d --wait`.

An existing disposable PostgreSQL 15+ database also works: set `DATABASE_URL` and
skip the Docker command. An optional `?schema=...` is applied to both migrations
and the runtime adapter. Environment variables supplied by your shell override
`.env`. Set `PORT` to change the local HTTP port; `smoke` always chooses a free port.

If installation fails, check Node and run `npm ci --strict-peer-deps` using the
included lockfile. If a query reports a missing table or client, rerun
`npm run db:setup`. A missing configuration value fails startup with its variable
name. `npm start` and `smoke` require all four variables in `.env.example` other
than optional `PORT`.

Stop the HTTP server with Ctrl-C, then remove the disposable database:

```sh
docker compose down
```

The database lives on tmpfs. Removing its container removes all its data.
