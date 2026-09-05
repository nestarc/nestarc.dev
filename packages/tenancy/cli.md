---
description: "Scaffold and validate RLS policies, then audit an applied PostgreSQL tenancy configuration with the @nestarc/tenancy CLI."
---

# CLI

Scaffold RLS policies and module configuration from your Prisma schema:

```bash
npx @nestarc/tenancy init
```

This generates:

- `tenancy-setup.sql` — PostgreSQL RLS policies, tenant indexes, roles, and grants
- `tenancy.module-setup.ts` — NestJS module registration code

## Preview without writing files

```bash
npx @nestarc/tenancy init --dry-run
```

## Check for drift

```bash
npx @nestarc/tenancy check
# With custom setting key:
npx @nestarc/tenancy check --db-setting-key=custom.tenant_key
```

Validates table coverage, FORCE ROW LEVEL SECURITY, isolation/insert policies, and setting key consistency across all policies. Exits with code 0 (in sync) or 1 (drift detected).

## Audit the live database

Version 0.15 adds `doctor` for checking the applied database through the same non-superuser role used by the application:

```bash
DATABASE_URL='postgresql://app_user:...@localhost/app' \
  npx @nestarc/tenancy doctor \
  --table=public.users \
  --role=app_user
```

Run it once for every tenant-scoped table. The catalog audit checks:

- the current/login roles and reachable `SUPERUSER` or `BYPASSRLS` risks;
- table ownership plus enabled, forced, and active RLS state;
- the tenant column and supporting index;
- grants, including forbidden `TRUNCATE` access;
- the exact generated `USING` and `WITH CHECK` policy contract.

Add a read-only behavior probe using two tenant IDs that already have fixture rows:

```bash
DATABASE_URL='postgresql://app_user:...@localhost/app' \
  npx @nestarc/tenancy doctor \
  --table=public.users \
  --role=app_user \
  --active \
  --tenant-a=11111111-1111-1111-1111-111111111111 \
  --tenant-b=22222222-2222-2222-2222-222222222222
```

The active probe verifies no-context fail-closed behavior, tenant A/B isolation, and setting cleanup after both commit and rollback. It never writes data. A tenant with no visible fixture row makes the result inconclusive rather than passing falsely.

Use `--db-setting-key` and `--tenant-column` when your schema differs from the defaults. Add `--json` for one machine-readable result. Exit codes are `0` for healthy, `1` for a finding or inconclusive probe, and `2` for usage, connection, or query errors. Prefer `DATABASE_URL` over `--url` so credentials do not enter shell history or the process list.

## 0.16 schema and SQL checks

`init`, `check`, and `doctor` now agree on TEXT versus native UUID tenant predicates and a restrictive non-empty-context guard. Scaffolding rejects an invalid tenant-column mapping before writing files. Generated SQL uses an explicit transaction, qualifies default-schema tables as `public`, and derives collision-resistant names within PostgreSQL's 63-byte limit.

Apply with `psql -v ON_ERROR_STOP=1 "$DATABASE_URL" -f tenancy-setup.sql`. Sequential reapplication is supported, but existing same-name policies are preserved for drift review. An intentional replacement needs an explicit drop in a reviewed transaction. Inspect the [0.16 migration](./migration#upgrade-to-0-16) before regenerating an existing deployment; both old policy names and missing restrictive guards can require action.
