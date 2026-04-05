# CLI

Scaffold RLS policies and module configuration from your Prisma schema:

```bash
npx @nestarc/tenancy init
```

This generates:
- `tenancy-setup.sql` — PostgreSQL RLS policies, roles, and grants
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
