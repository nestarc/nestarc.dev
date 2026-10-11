---
description: "Shared runtime and lint policies for data-subject 0.3.0, with explicit export fields, tenant scope, stable row identity, and conservative retention."
---

# Policy Model

Policies are compiled when entities are registered. In 0.3.0, prefer `definePolicy()` so runtime registration and schema lint read the same JSON-serializable definition. The legacy `entities` and `Registry.register({ policy, executor })` APIs remain available.

## One definition for runtime and lint

This example assumes a `Profile` model with `id`, `subjectId`, `tenantId`, nullable `email` and `displayName`, and `createdAt` fields:

```ts
import { definePolicy, fromPrisma, Registry } from '@nestarc/data-subject';

export const definitions = definePolicy([{
  entityName: 'Profile',
  subjectField: 'subjectId',
  stableIdField: 'id',
  scope: { mode: 'multi-tenant', tenantField: 'tenantId' },
  rowLevel: 'delete-fields',
  fields: {
    email: 'delete',
    displayName: { strategy: 'anonymize', replacement: '[removed]' },
  },
  exportFields: ['email', 'displayName'],
  ignoredFields: { createdAt: 'Creation timestamp reviewed as outside the erasure policy' },
}]);

const registry = new Registry();
registry.registerDefinition(definitions[0], fromPrisma({
  delegate: prisma.profile,
  subjectField: 'subjectId',
  tenantField: 'tenantId',
  stableIdField: 'id',
}));
```

For NestJS, pass `definitions: [{ definition: definitions[0], executor }]` to `DataSubjectModule.forRoot(...)`. The declared scope and stable ID must agree with the executor. Registration fixes the compiled policy and executor metadata; create a new registry and preview when changing policy.

Shared definitions must contain only JSON values. Omit unused optional properties instead of passing `undefined`; functions, dates, and circular references are rejected.

## Erasure strategies

| Strategy | Policy | Effect with `fromPrisma` |
| --- | --- | --- |
| Delete | `email: 'delete'` | Defaults to `delete-fields`, writing `null` with `updateMany`; an all-delete policy with `rowLevel: 'delete-row'` uses `deleteMany` |
| Anonymize | `displayName: { strategy: 'anonymize', replacement: '[removed]' }` | Writes the configured static value and keeps the row |
| Retain | `amount: { strategy: 'retain', legalBasis: 'tax:example-rule', until: '+7y' }` | Preserves the value and records the basis, optional expiry metadata, and count |

Anonymization replacements accept strings, finite numbers, or `null`. Function replacements fail policy compilation. A static replacement is a technical operation; the host determines whether it sufficiently de-identifies the data.

`retain` requires `legalBasis`. The `strictLegalBasis: true` option validates a `scheme:reference` format, not the legal applicability of that reference. `until` is retention metadata, not an automatic deletion schedule. The `pseudonymize` option exists in the type model, but the package does not implement HMAC pseudonymization.

Mixed policies keep rows whenever non-delete strategies require them. For example:

```ts
rowLevel: 'delete-row',
fields: {
  amount: { strategy: 'retain', legalBasis: 'tax:example-rule', until: '+7y' },
  customerEmail: { strategy: 'anonymize', replacement: '[removed]' },
  internalNote: 'delete',
},
```

The actual strategy becomes field updates: `amount` stays unchanged, `customerEmail` is replaced, and `internalNote` becomes `null`. Erase stats report `strategy: 'mixed'` and list retained fields in `stats.retained`. `ignoredFields` is an exclusion reason for lint; it does **not** protect a field from row deletion. Use `retain` for data that must survive erasure.

## Export is a separate allowlist

`exportFields` does not inherit erase `fields`. An omitted or empty allowlist excludes the entity from export entirely, including its read. New columns, password hashes, and tokens stay out unless explicitly listed.

Only listed own top-level properties are projected. Listing an object or JSON field includes its nested contents, so review that entire value or provide a deliberately flattened export model. See [Export & Erase](./export-erase).

## Scope and stable identity

Multi-tenant mode is the default. `fromPrisma` requires exactly one of `tenantField` or `singleTenantId`; custom executors must declare and enforce an equivalent `scope`. Single-tenant installations must use the same explicit ID in the executor, module/service, and service calls.

Erasure uses an immutable, unique scalar ID for verification. `fromPrisma` defaults `stableIdField` to `id`. Custom executors provide `identityField` and `selectByIds(ids, tenantId)`, reading by tenant and original IDs even if the subject lookup field changes. Field writes cannot change the stable ID or tenant field. See [strict verification](./export-erase#strict-erasure-verification).

## Schema checks and relation order

Build the policy file, then import that same output into the CLI configuration:

```js
// data-subject.config.cjs
const { definitions } = require('./dist/policy.js');
module.exports = { definitions, strictCoverage: true, checkRelations: true };
```

```bash
npx prisma validate --schema prisma/schema.prisma
npx data-subject lint --schema prisma/schema.prisma --config data-subject.config.cjs --format json
```

Shared definitions enable strict scalar coverage and relation checks by default. Apart from subject, tenant, and explicitly declared stable-ID fields, each scalar needs an erasure policy or an `ignoredFields` reason. An export allowlist entry alone does not satisfy coverage. Workflow and unrelated models need explicit `suppressions` entries with meaningful reasons.

Declare reviewed relationship fields in `relations` and parent entity names in `dependsOn`; children execute before those parents. The linter checks required-field null writes, unsafe parent deletion or reference-key changes, retained-child conflicts, missing dependencies, and cycles. It does not discover and delete arbitrary relations. Implicit many-to-many relations and unsupported Prisma syntax require an explicit supported model or another execution design.

The parser supports a documented Prisma subset, so run `prisma validate` as well. See the [0.3.0 shared-policy and relation guide](https://github.com/nestarc/data-subject/blob/v0.3.0/docs/p1-migration.md) for the complete constraints.
