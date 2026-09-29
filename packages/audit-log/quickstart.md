---
title: Run the Audit Log 0.7.0 Example
description: "Run a standalone NestJS + Prisma example using published @nestarc/audit-log 0.7.0. Verify a manual event, automatic role changes, actor, tenant, masking, and rollback."
---

# Run your first audit trail

Create a user, change their role from `member` to `admin`, and query who made the change. This standalone example installs published **`@nestarc/audit-log@0.7.0`** from npm and includes both manual and automatic adoption paths.

**[Download the 0.7.0 example](/examples/audit-log-0.7.0.zip)** · [Add it to an existing app](./adoption)

## Before you start

- Node.js **22.13+ within 22.x, or 24.x**, and npm.
- Docker Compose for the included disposable PostgreSQL database, or your own disposable PostgreSQL database/schema.
- Port **5433** available for the included database and **3000** for the HTTP example.

The example pins NestJS **12.1.1** and Prisma **7.9.1** with a generated CommonJS client. It includes source, migrations, configuration, and a lockfile; no library repository build is required.

## Download and run

Download and unzip the example into a new directory:

```sh
curl -fL https://nestarc.dev/examples/audit-log-0.7.0.zip \
  -o audit-log-0.7.0.zip
unzip audit-log-0.7.0.zip
cd audit-log-quick-start
```

Start the included database and install the pinned dependencies:

```sh
cp .env.example .env
docker compose up -d --wait
npm ci --strict-peer-deps
npm run db:setup
```

The default `.env` points to `audit_test` on `127.0.0.1:5433`, using the separate `audit_quickstart` schema. If using your own disposable PostgreSQL database, edit `DATABASE_URL` and skip the Docker command.

`db:setup` applies the example migrations, generates Prisma, builds the application, and creates audit storage. It finishes with:

```text
Audit storage ready.
```

The example uses `defineAuditConfig()` for shared table, masking, actor, and tenant settings, including `actorRequired: true`. Setup uses the factory's schema options. Use a setup connection with schema permissions; see [storage and runtime privileges](./retention) when adapting it to an application.

## Verify both adoption paths

Run the manual-only check:

```sh
npm run smoke:manual
```

It uses a base Prisma client and an ordinary transaction, changes a role, and writes one manual event. Expected summary:

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

This verifies the target, actor, tenant, application-supplied role metadata, and masking. It also verifies that no automatic rows were created and that throwing an error rolls back a second role change and its event.

Then run the HTTP and automatic tracking check:

```sh
npm run smoke
```

It starts a temporary local server, sends creation and role-change requests, queries history, records a manual review, and verifies worker context and rollback. Expected summary:

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

This is a summary of several checked records: the role pair comes from the separate `User.updated` row. Automatic changes use `changes.role`; the manual role event uses `metadata.role`. The commands exit with an error if an assertion fails. They leave demonstration rows in the disposable schema and use unique emails for repeated runs.

## Try the HTTP flow yourself

Start the server:

```sh
npm start
```

In a second terminal, create a user:

```sh
curl -sS http://127.0.0.1:3000/users \
  -H 'content-type: application/json' \
  -H 'x-request-id: example-request' \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'
```

Copy the returned `id` into `USER_ID`, then change the role and read the history:

```sh
USER_ID='paste-returned-id-here'
curl -sS "http://127.0.0.1:3000/users/$USER_ID/role" \
  -H 'content-type: application/json' \
  -d '{"role":"admin"}'
curl -sS "http://127.0.0.1:3000/users/$USER_ID/audit"
```

Find `User.updated` in `entries`. Its `actorId` is `demo-user`, `tenantId` is `demo-tenant`, `targetId` matches the returned ID, and `changes.role` contains `member → admin`. The creation record masks the password. Use a different email if you repeat the manual `curl` flow.

::: warning Demo identity is not authentication
`DemoIdentityGuard` supplies a fixed user and permissions; middleware supplies a fixed tenant. The controller checks these demo permissions and tenant before writes and history reads. Replace them with authenticated identity, trusted memberships, and application authorization before adopting the code. Do not accept arbitrary actor or tenant headers as proof of identity or access.
:::

## Take one path into your app

| Goal | Example file to inspect | Next guide |
| --- | --- | --- |
| Keep an existing transaction and add an event | `src/manual-role.ts` | [Log one business event](./adoption#log-one-business-event) |
| Capture field changes for one model | `src/prisma.service.ts`, `src/user.controller.ts` | [Track one Prisma model](./adoption#track-one-prisma-model) |
| Share actor, tenant, and masking policy | `src/audit-options.ts` | [Installation](./installation) |
| Repeat the checks in your own tests | `src/manual-smoke.ts`, `src/smoke.ts` | [Verify the first record](./adoption#verify-the-first-record) |

Automatic tracking covers supported writes through the audited transaction. Review [nested/bulk writes and coverage limits](./auto-tracking) before expanding it to other paths. Passing this example confirms these scenarios, not every write in your application.

## Stop the example

Press **Ctrl-C** to stop the HTTP server. If you started the included disposable database, stop and remove its container from the example directory:

```sh
docker compose down
```

The included database has no persistent volume; its demonstration data is discarded when the container is removed. A separately supplied PostgreSQL database is unaffected by this Docker command.
