---
description: "Use audit-log 0.8.0 with SQL Server: managed manual transactions, tenant-scoped history, storage inspection, and optional read indexes."
lastUpdated: 2026-10-26
---

# SQL Server

`@nestarc/audit-log@0.8.0` supports manual events, managed manual transactions, and tenant-scoped
history on SQL Server. PostgreSQL remains the default; select `provider: 'sqlserver'` explicitly.
SQL Server automatic tracking, scan/export, retention, and partitioning are unsupported.

Use Node.js `^22.23.4 || ^24.22.1`. The recorded SQL Server validation stack is SQL Server 2025
with Prisma CLI, client, and `@prisma/adapter-mssql` 7.10.0. The broader Prisma peer range does not
establish SQL Server validation for every adapter/version combination.

For a runnable application, copy the [0.8.0 SQL Server Quick Start](https://github.com/nestarc/nestjs-audit-log/tree/v0.8.0/examples/sql-server-quick-start).
It pins the published package and verifies commit, rollback, actor/tenant policy, masking, Unicode,
and authorized history using application-owned SQL. The fragments below show the additional
managed transaction and library history APIs available in 0.8.0.

## Configure the provider

```bash
npm install --save-exact @nestarc/audit-log@0.8.0
```

Use your application's SQL Server Prisma client and generated `Prisma` namespace. With Prisma 7,
set `provider = "sqlserver"` in the datasource, put the CLI URL in `prisma.config.ts`, and construct
the runtime client with `PrismaMssql`. When using an adapter configuration object, provide its schema
explicitly, for example `new PrismaMssql(connectionOptions, { schema: 'dbo' })`.

The following configuration assumes a host-owned `currentAuthorizedTenantId()` resolver and a
Guard that authenticates `req.user` before the audit interceptor runs:

```typescript
import { defineAuditConfig } from '@nestarc/audit-log';
import { Prisma } from './generated/prisma/client';
import { currentAuthorizedTenantId } from './tenant-context';

export const auditConfig = defineAuditConfig({
  shared: {
    provider: 'sqlserver',
    tableName: 'dbo.audit_logs',
    prismaModule: { Prisma },
    actorRequired: true,
    tenantRequired: true,
    tenantResolver: currentAuthorizedTenantId,
    sensitiveFields: ['password', 'token'],
  },
  module: {
    actorExtractionStage: 'interceptor',
    actorExtractor: (req) => ({
      id: req.user?.id ?? null,
      type: 'user',
      ip: req.ip,
    }),
    strictManualValidation: true,
    maxMetadataBytes: 64 * 1024,
  },
});
```

Register `AuditLogModule` with `{ ...auditConfig.moduleOptions, prisma: base }`, where `base` is
the application-owned client. Use `forRootAsync()` when Nest injects that client; see
[module registration](./installation). Omit the factory's `extension` section. The audit module
creates no client or connection pool and does not infer the database provider from `base`.

Strict validation and the metadata byte budget are opt-in. The example's 64 KiB limit is an
application choice, measured after redaction and metadata merging. See [Manual Logging](./manual-logging)
for validation errors and operation diagnostics.

## Install the audit table

Run storage setup through a deployment or migration identity:

```typescript
import { applyAuditTableSchema } from '@nestarc/audit-log';

await applyAuditTableSchema(installerPrisma, auditConfig.schemaOptions);
```

The flat table uses `UNIQUEIDENTIFIER` IDs, UTC `DATETIME2(7)` timestamps, Unicode `NVARCHAR(MAX)`
values, JSON checks, and UPDATE/DELETE rejection triggers. It includes a clustered index on
`(created_at, id)`. An unqualified table name resolves under `dbo`; create any alternative schema
first and supply a qualified name such as `history.audit_logs`.

`getAuditTableStatements()` returns executable batches for migration tooling. The installer runs
those batches sequentially, allowing trigger definitions to begin their own batch.
`getAuditTableSQL()` instead emits `GO` batches and `:ON ERROR EXIT` for sqlcmd or SSMS in SQLCMD
mode; do not send that script directly to Prisma or ordinary SSMS mode.

Reapplication preserves compatible rows, checks the existing layout, and reinstalls/enables
mutation triggers. It does not convert a PostgreSQL table or an arbitrary SQL Server schema.
Batches do not share an encompassing transaction: a later failure can leave earlier DDL applied.
Resolve the failure and finish setup before enabling application writes.

## Commit a manual event with the business change

Use the injected `AuditService` with the application's base client. This fragment runs within
authenticated actor and authorized tenant context, and assumes an `Invoice` model:

```typescript
const invoice = await audit.withManualTransaction(base, async ({ tx, log }) => {
  const updated = await tx.invoice.update({
    where: { id: invoiceId, tenantId: authorizedTenantId },
    data: { status: 'approved' },
  });
  await log({
    action: 'invoice.approved',
    targetType: 'Invoice',
    targetId: updated.id,
    metadata: { reason: 'Finance approval' },
  });
  return updated;
}, { maxWait: 5_000, timeout: 10_000 });
```

The bound writer uses the same transaction. A caught audit failure still prevents commit; callback
errors roll back the transaction too. Await every `log()` and use the supplied `tx` for all business
writes. The helper waits for started audit writes, rejects expired writers and nested managed
transactions, and cannot enlist writes through a captured base client. Tenant attribution does not
replace tenant predicates or application authorization.

For a caller-owned transaction, `await audit.log(input, tx)` remains available. Propagate its error
out of the callback when the business change requires audit evidence; swallowing a JavaScript policy
error does not force that caller-owned transaction to roll back. `log(input)` without `tx` writes
independently. The transaction client must address the same database as the audit table.

The helper forwards supported isolation levels without retries or fallback. In the pinned Prisma
7.10.0 SQL Server stack, `Snapshot` is rejected before the callback runs.

## Read authorized history

Authorize the principal and tenant before selecting the query scope. Use a client with audit-table
SELECT permission for the service performing these reads:

```typescript
const filters = {
  tenantId: authorizedTenantId,
  targetType: 'Invoice',
  targetId: invoiceId,
  limit: 50,
  includeTotal: false,
};
const page = await audit.query(filters);
const nextPage = page.nextCursor
  ? await audit.query({ ...filters, cursor: page.nextCursor })
  : null;
const entry = await audit.getById(entryId, { tenantId: authorizedTenantId });
```

SQL Server supports actor, action/wildcard, target, source, result, time, and tenant filters. Exact
text comparisons use `Latin1_General_100_BIN2` plus equal byte lengths, so case, accents, and trailing
spaces matter. Cursor tokens preserve full `DATETIME2(7)` precision and native ID ordering; keep
them opaque and reuse the same filters. Do not share cursors across providers.

Results normalize JSON and UTC dates. `includeTotal: false` avoids `COUNT_BIG`; counts outside the
JavaScript safe integer range reject. Page and count results are not a promised snapshot under
concurrent writes. See [Query API](./query-api) for the full contract.

## Separate deployment, writer, and reader permissions

| Identity | Required scope |
|---|---|
| Installer | Database `CONNECT` and `CREATE TABLE`, plus `ALTER` on the dedicated audit schema |
| Runtime writer | Audit-table `INSERT`, plus the business-table permissions its operations need |
| Authorized reader | Audit-table `SELECT`; the application still authorizes every tenant/read |
| Diagnostic identity | Object `VIEW DEFINITION` for complete storage metadata visibility |

Keep schema ownership and administrative privileges outside the runtime identity. UPDATE/DELETE
triggers reject mutations of existing rows, but owners can disable triggers and `TRUNCATE TABLE`
does not invoke them. Do not grant runtime ownership, `ALTER`, or broad administrative roles.
Adding history reads does not automatically grant an INSERT-only runtime SELECT access.

## Inspect storage and add read indexes

```typescript
import {
  inspectSqlServerAuditStorage,
  applySqlServerAuditReadIndexes,
} from '@nestarc/audit-log';

const inspection = await inspectSqlServerAuditStorage(diagnosticPrisma, {
  tableName: auditConfig.schemaOptions.tableName,
});

// Run only as an explicit migration after reviewing inspection and writer settings.
await applySqlServerAuditReadIndexes(installerPrisma, {
  tableName: auditConfig.schemaOptions.tableName,
});
```

Inspection is read-only. Review `status`, `metadataComplete`, and structured `issues`. A limited
identity may receive `unavailable` rather than proof that a table is missing. `enforcementVerified`
is always `false`: visible enabled triggers do not prove their bodies enforce append-only behavior.
Verify real permissions and commit/rollback behavior during deployment.

Read indexes are optional; upgrading the npm package does not install them. The migration adds four
computed `NVARCHAR(128)` prefix columns and tenant/time, tenant/target/time, and tenant/actor/time
indexes. Original full values remain intact and queries retain full-value equality checks.
`getSqlServerAuditReadIndexStatements()` provides the separate batches for migration tooling.

Every writer connection must use compatible computed-index session settings: `ANSI_NULLS`,
`ANSI_PADDING`, `ANSI_WARNINGS`, `ARITHABORT`, `CONCAT_NULL_YIELDS_NULL`, and `QUOTED_IDENTIFIER` ON;
`NUMERIC_ROUNDABORT` OFF. At compatibility level 90 or later, `ANSI_WARNINGS ON` also implies
effective `ARITHABORT ON`. The installer configures its own connection only. Check application
pools before enabling indexes. Batches run sequentially and can leave partial additions after a
failure; finish the migration before enabling writes. Measure query plans and write costs for your workload.

## Provider limits

`audit.getCapabilities()` reports configured provider support without database I/O. It does not
check credentials, schema health, or live connectivity.

| Available in SQL Server 0.8.0 | Unsupported |
|---|---|
| Manual `log()`, `withManualTransaction()` | Prisma automatic tracking and lifecycle extensions |
| `query()`, `getById()` | `scan()`, CSV export, durable PostgreSQL streams |
| Flat-table DDL, inspection, optional read indexes | Retention, partitioning, GIN indexes, rule enforcement |

Unsupported extension/DDL configuration and retention calls reject before database access.
Unsupported scan/export paths reject when iterated or consumed, before database access or output.
See the [immutable release guide](https://github.com/nestarc/nestjs-audit-log/blob/v0.8.0/docs/sql-server.md)
and [0.8.0 feature contracts](https://github.com/nestarc/nestjs-audit-log/blob/v0.8.0/docs/product-quality.md)
for the full provider boundaries.
