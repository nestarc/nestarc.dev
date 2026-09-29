# Run the audit-log 0.7.0 Quick Start

See who changed a user's role from `member` to `admin`, then verify the actor,
tenant, masked fields, and rollback behavior. This standalone example pins the
published **`@nestarc/audit-log@0.7.0`** package and includes a lockfile.

Requirements: Node.js 22.13+ in the 22.x line or Node.js 24.x, npm, and Docker Compose
(or your own disposable PostgreSQL database). No library repository build is needed.

## Run the example

From this directory:

```sh
cp .env.example .env
docker compose up -d --wait
npm ci --strict-peer-deps
npm run db:setup
npm run smoke:manual
npm run smoke
npm start
```

The included Compose service binds PostgreSQL to `127.0.0.1:5433`; `.env.example`
connects as `test:test` to database `audit_test`, schema `audit_quickstart`.
If that port is occupied, change the port in both `compose.yaml` and `.env`.
For an existing disposable database, set `DATABASE_URL` to a separate schema and
skip `docker compose up`. Never point the smoke commands at a production database.

`db:setup` applies the included user migrations, generates the Prisma 7 client,
builds the app, and creates audit storage using `auditConfig.schemaOptions`.
The demo uses a schema-owning connection for simplicity. For an application,
separate setup credentials from restricted runtime credentials; see
[storage and retention](https://nestarc.dev/packages/audit-log/retention).

## Start with one business event

`npm run smoke:manual` uses a base Prisma client and `AuditService.log()` inside the
same ordinary `$transaction()`. It creates no automatic extension. It changes one
role, verifies the manual event, and confirms a second change and event roll back
together when an error escapes the transaction.

```json
{
  "mode": "manual-only",
  "action": "user.role.changed",
  "actorId": "demo-operator",
  "tenantId": "demo-tenant",
  "role": { "before": "member", "after": "admin" },
  "password": "[REDACTED]",
  "rollback": "passed"
}
```

Read `src/manual-role.ts` and `src/manual-smoke.ts`. The role pair is application-supplied
`metadata.role`; manual logging does not compute a database diff. Pass the same `tx`
to `audit.log()` and propagate errors so the caller's transaction rolls back.

## Track one model automatically

`npm run smoke` sends real HTTP requests through Nest guards and interceptors. It
creates a user, records a manual review, changes the role, and reads its history.
It verifies automatic before/after, actor, tenant, password redaction, worker context,
and atomic rollback.

```json
{
  "action": "User.created",
  "targetType": "User",
  "source": "auto",
  "actorId": "demo-user",
  "tenantId": "demo-tenant",
  "password": { "after": "[REDACTED]" },
  "role": { "before": "member", "after": "admin" },
  "manualAction": "user.reviewed",
  "backgroundActor": "worker-demo",
  "rollback": "passed"
}
```

The `role` pair above summarizes a separate `User.updated` record in `changes.role`.
Read `src/prisma.service.ts`, `src/user.controller.ts`, and `src/smoke.ts`.

`src/audit-options.ts` defines one `defineAuditConfig()` configuration for module,
extension, and schema setup. Both logging paths enforce `actorRequired: true` and
`tenantRequired: true`, and redact `password`. The extension tracks only `User` and
uses `consistency: 'atomic-required'` with `withAuditTransaction()`.

## Try the HTTP flow

With `npm start` running:

```sh
curl -sS http://127.0.0.1:3000/users \
  -H 'content-type: application/json' \
  -H 'x-request-id: example-request' \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'
# Replace USER_ID with the returned id.
curl -sS http://127.0.0.1:3000/users/USER_ID/role \
  -H 'content-type: application/json' -d '{"role":"admin"}'
curl -sS http://127.0.0.1:3000/users/USER_ID/audit
```

Use a different email for each creation. Smoke commands generate unique emails and
leave demonstration rows in the disposable schema.

`DemoIdentityGuard` supplies a fixed `demo-user` with `users:write` and `audit:read`;
middleware supplies `demo-tenant`. **This is demonstration identity, not login or
real membership authorization.** Replace it with your application's authentication,
permissions, and authorized tenant resolution. Do not accept arbitrary actor or
tenant headers as trusted identity. Background work establishes its actor with
`AuditContext.runAs()` and its tenant separately with `tenantScope.run()`.

After stopping the app with Ctrl-C, remove the disposable database and its data:

```sh
docker compose down
```

## Additional policy verification

`verification/policy-smoke.ts` tests the published 0.7.0 contracts: concurrent HTTP
and worker context isolation, actor and tenant requirements, shared redaction,
business and audit-insert failure rollback, caught returning-bulk/actor policy
errors in atomic mode, manual transaction catch boundaries, tracking exclusions,
`@NoAudit()`, and custom table storage.

It deliberately accepts only a local database named `audit_test` with an isolated
schema matching `audit_docs_<32 lowercase hex characters>`. It performs temporary
DDL fault injection in that schema. Run it against the bundled disposable database:

```sh
export DATABASE_URL="postgresql://test:test@127.0.0.1:5433/audit_test?schema=audit_docs_$(node -e 'process.stdout.write(require("node:crypto").randomBytes(16).toString("hex"))')"
npm run db:setup
npm run smoke:policies
unset DATABASE_URL
```

Expected final output: `mode: "policy-verification"`, eight named scenarios, and
`result: "passed"`. Remove the disposable database with `docker compose down` when
finished. The tests show the example's behavior; add application-specific coverage
for every write path and authorization boundary you adopt.
