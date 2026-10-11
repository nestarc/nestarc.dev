# lint

## Interfaces

<a id="api-datasubjectlintconfig"></a>

### DataSubjectLintConfig

Defined in: [src/lint/types.ts:42](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L42)

#### Properties

<a id="api-checkrelations"></a>

##### checkRelations?

```ts
optional checkRelations?: boolean;
```

Defined in: [src/lint/types.ts:53](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L53)

Validate declared relations and child-before-parent dependencies. Defaults true with definitions.

<a id="api-definitions"></a>

##### definitions?

```ts
optional definitions?: EntityDefinition[];
```

Defined in: [src/lint/types.ts:44](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L44)

The same JSON-compatible definitions passed to Registry.registerDefinition.

<a id="api-piifieldpatterns"></a>

##### piiFieldPatterns?

```ts
optional piiFieldPatterns?: string[];
```

Defined in: [src/lint/types.ts:47](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L47)

<a id="api-registry"></a>

##### registry?

```ts
optional registry?: DataSubjectLintRegistryEntry[];
```

Defined in: [src/lint/types.ts:46](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L46)

Legacy configuration. Prefer definitions for a shared runtime/lint source.

<a id="api-requiretenantfield"></a>

##### requireTenantField?

```ts
optional requireTenantField?: boolean;
```

Defined in: [src/lint/types.ts:49](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L49)

<a id="api-strictcoverage"></a>

##### strictCoverage?

```ts
optional strictCoverage?: boolean;
```

Defined in: [src/lint/types.ts:51](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L51)

Check every scalar, including newly added fields without PII-like names. Defaults true with definitions.

<a id="api-suppressions"></a>

##### suppressions?

```ts
optional suppressions?: DataSubjectLintSuppression[];
```

Defined in: [src/lint/types.ts:48](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L48)

***

<a id="api-datasubjectlintfinding"></a>

### DataSubjectLintFinding

Defined in: [src/lint/types.ts:21](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L21)

#### Properties

<a id="api-code"></a>

##### code

```ts
code: DataSubjectLintCode;
```

Defined in: [src/lint/types.ts:23](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L23)

<a id="api-field"></a>

##### field?

```ts
optional field?: string;
```

Defined in: [src/lint/types.ts:25](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L25)

<a id="api-message"></a>

##### message

```ts
message: string;
```

Defined in: [src/lint/types.ts:26](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L26)

<a id="api-model"></a>

##### model

```ts
model: string;
```

Defined in: [src/lint/types.ts:24](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L24)

<a id="api-severity"></a>

##### severity

```ts
severity: DataSubjectLintSeverity;
```

Defined in: [src/lint/types.ts:22](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L22)

***

<a id="api-datasubjectlintregistryentry"></a>

### DataSubjectLintRegistryEntry

Defined in: [src/lint/types.ts:29](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L29)

#### Extends

- [`PolicySpec`](index.md#policyspec)

#### Properties

<a id="api-dependson"></a>

##### dependsOn?

```ts
optional dependsOn?: string[];
```

Defined in: [src/policy-compiler.ts:19](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/policy-compiler.ts#L19)

Parent entities: this entity is erased before each named parent.

###### Inherited from

[`PolicySpec`](index.md#policyspec).[`dependsOn`](index.md#dependson-2)

<a id="api-entityname"></a>

##### entityName

```ts
entityName: string;
```

Defined in: [src/policy-compiler.ts:10](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/policy-compiler.ts#L10)

###### Inherited from

[`PolicySpec`](index.md#policyspec).[`entityName`](index.md#entityname-4)

<a id="api-exportfields"></a>

##### exportFields?

```ts
optional exportFields?: string[];
```

Defined in: [src/policy-compiler.ts:15](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/policy-compiler.ts#L15)

Explicit top-level export allowlist. Omit for an erase-only entity.

###### Inherited from

[`PolicySpec`](index.md#policyspec).[`exportFields`](index.md#exportfields-2)

<a id="api-fields"></a>

##### fields

```ts
fields: Record<string, PolicyEntry>;
```

Defined in: [src/policy-compiler.ts:13](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/policy-compiler.ts#L13)

###### Inherited from

[`PolicySpec`](index.md#policyspec).[`fields`](index.md#fields-4)

<a id="api-ignoredfields"></a>

##### ignoredFields?

```ts
optional ignoredFields?: Record<string, string>;
```

Defined in: [src/lint/types.ts:32](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L32)

<a id="api-relations"></a>

##### relations?

```ts
optional relations?: string[];
```

Defined in: [src/lint/types.ts:33](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L33)

<a id="api-rowlevel"></a>

##### rowLevel?

```ts
optional rowLevel?: "delete-row" | "delete-fields";
```

Defined in: [src/policy-compiler.ts:12](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/policy-compiler.ts#L12)

###### Inherited from

[`PolicySpec`](index.md#policyspec).[`rowLevel`](index.md#rowlevel-4)

<a id="api-singletenantid"></a>

##### singleTenantId?

```ts
optional singleTenantId?: string;
```

Defined in: [src/lint/types.ts:31](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L31)

<a id="api-stableidfield"></a>

##### stableIdField?

```ts
optional stableIdField?: string;
```

Defined in: [src/policy-compiler.ts:17](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/policy-compiler.ts#L17)

Immutable row identity used for post-write verification.

###### Inherited from

[`PolicySpec`](index.md#policyspec).[`stableIdField`](index.md#stableidfield-4)

<a id="api-subjectfield"></a>

##### subjectField

```ts
subjectField: string;
```

Defined in: [src/policy-compiler.ts:11](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/policy-compiler.ts#L11)

###### Inherited from

[`PolicySpec`](index.md#policyspec).[`subjectField`](index.md#subjectfield-4)

<a id="api-tenantfield"></a>

##### tenantField?

```ts
optional tenantField?: string;
```

Defined in: [src/lint/types.ts:30](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L30)

***

<a id="api-datasubjectlintreport"></a>

### DataSubjectLintReport

Defined in: [src/lint/types.ts:56](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L56)

#### Properties

<a id="api-findings"></a>

##### findings

```ts
findings: DataSubjectLintFinding[];
```

Defined in: [src/lint/types.ts:58](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L58)

<a id="api-ok"></a>

##### ok

```ts
ok: boolean;
```

Defined in: [src/lint/types.ts:57](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L57)

***

<a id="api-datasubjectlintsuppression"></a>

### DataSubjectLintSuppression

Defined in: [src/lint/types.ts:36](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L36)

#### Properties

<a id="api-field-1"></a>

##### field?

```ts
optional field?: string;
```

Defined in: [src/lint/types.ts:38](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L38)

<a id="api-model-1"></a>

##### model

```ts
model: string;
```

Defined in: [src/lint/types.ts:37](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L37)

<a id="api-reason"></a>

##### reason

```ts
reason: string;
```

Defined in: [src/lint/types.ts:39](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L39)

## Type Aliases

<a id="api-datasubjectlintcode"></a>

### DataSubjectLintCode

```ts
type DataSubjectLintCode =
  | "dsr_lint_unregistered_model"
  | "dsr_lint_missing_policy_field"
  | "dsr_lint_missing_tenant_field"
  | "dsr_lint_empty_suppression_reason"
  | "dsr_lint_invalid_policy"
  | "dsr_lint_subject_field_missing"
  | "dsr_lint_schema_unsupported"
  | "dsr_lint_nonnullable_write"
  | "dsr_lint_unmapped_relation"
  | "dsr_lint_relation_conflict"
  | "dsr_lint_retention_conflict"
  | "dsr_lint_dependency_order"
  | "dsr_lint_dependency_cycle";
```

Defined in: [src/lint/types.ts:6](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L6)

***

<a id="api-datasubjectlintseverity"></a>

### DataSubjectLintSeverity

```ts
type DataSubjectLintSeverity = "warning" | "error";
```

Defined in: [src/lint/types.ts:4](https://github.com/nestarc/data-subject/blob/43915e549442bce9bca56b3546b20f2a29b8b672/src/lint/types.ts#L4)

## References

<a id="api-formatlintreport"></a>

### formatLintReport

Re-exports [formatLintReport](index.md#formatlintreport)

***

<a id="api-lintprismaschema"></a>

### lintPrismaSchema

Re-exports [lintPrismaSchema](index.md#lintprismaschema)

***

<a id="api-parseprismaschema"></a>

### parsePrismaSchema

Re-exports [parsePrismaSchema](index.md#parseprismaschema)

***

<a id="api-shouldfaillint"></a>

### shouldFailLint

Re-exports [shouldFailLint](index.md#shouldfaillint)
