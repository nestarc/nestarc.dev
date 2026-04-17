---
description: "Per-entity policies with delete, anonymize, retain, and mixed strategies — plus legal-basis validation for retention."
---

# Policy Model

Policies are registered per entity and **compiled before execution**. That means typos and invalid shapes (e.g. dynamic anonymization replacements) surface at boot, not during a real DSR run.

## `delete`

```ts
fields: {
  email: 'delete',
}
```

- The shorthand `'delete'` is normalized to `{ strategy: 'delete' }`.
- Entity `rowLevel` defaults to `'delete-fields'`.
- With the default Prisma adapter:
  - `'delete-row'` calls `deleteMany`.
  - `'delete-fields'` calls `updateMany` and writes `null` into the configured delete fields.

## `anonymize`

```ts
fields: {
  email: { strategy: 'anonymize', replacement: '[REDACTED]' },
}
```

- Replacements must be **static strings**.
- Function replacements are rejected during policy compilation with `dsr_anonymize_dynamic_replacement`.
- Anonymization keeps the row in place — only the field value is overwritten.

## `retain`

```ts
fields: {
  amount: {
    strategy: 'retain',
    legalBasis: 'tax:KR-basic-law-sec85',
    until: '+7y',
  },
}
```

- `legalBasis` is required.
- `strictLegalBasis: true` (module option) enforces a `scheme:reference` shape — e.g. `tax:KR-basic-law-sec85`, `gdpr:art17-3-b`.
- `until` accepts relative durations (`+7y`) or absolute ISO timestamps.
- `pseudonymize` is present in the type model but this package does not perform pseudonymization by itself — wire it through your own executor if needed.

## Mixed strategies

When an entity mixes `delete`, `anonymize`, and `retain`, execution is intentionally **conservative**:

- `retain` fields are preserved.
- Delete fields are **downgraded** to field-level updates instead of row deletion.
- The entity is reported as `strategy: 'mixed'` in erase stats.
- Retained fields are recorded in `stats.retained`.

This prevents retained fields from being dropped just because some other fields on the same row are deletable.

## Full example

```ts
{
  policy: {
    entityName: 'Invoice',
    subjectField: 'customerId',
    rowLevel: 'delete-row', // overridden to delete-fields because of retain
    fields: {
      customerName: {
        strategy: 'retain',
        legalBasis: 'tax:KR-basic-law-sec85',
        until: '+7y',
      },
      customerEmail: {
        strategy: 'anonymize',
        replacement: '[REDACTED]',
      },
      internalNote: 'delete',
    },
  },
  executor: fromPrisma({
    delegate: prisma.invoice,
    subjectField: 'customerId',
    tenantField: 'tenantId',
  }),
}
```

For this entity an erase request will:

- Keep the row.
- Retain `customerName` (reported in `stats.retained` with legal basis and expiry).
- Overwrite `customerEmail` with `[REDACTED]`.
- Null `internalNote`.
