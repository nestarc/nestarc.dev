# lint

## Interfaces

<a id="api-datasubjectlintconfig"></a>

### DataSubjectLintConfig

Defined in: [src/lint/types.ts:35](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L35)

#### Properties

<a id="api-piifieldpatterns"></a>

##### piiFieldPatterns?

```ts
optional piiFieldPatterns?: string[];
```

Defined in: [src/lint/types.ts:37](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L37)

<a id="api-registry"></a>

##### registry?

```ts
optional registry?: DataSubjectLintRegistryEntry[];
```

Defined in: [src/lint/types.ts:36](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L36)

<a id="api-requiretenantfield"></a>

##### requireTenantField?

```ts
optional requireTenantField?: boolean;
```

Defined in: [src/lint/types.ts:39](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L39)

<a id="api-suppressions"></a>

##### suppressions?

```ts
optional suppressions?: DataSubjectLintSuppression[];
```

Defined in: [src/lint/types.ts:38](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L38)

***

<a id="api-datasubjectlintfinding"></a>

### DataSubjectLintFinding

Defined in: [src/lint/types.ts:13](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L13)

#### Properties

<a id="api-code"></a>

##### code

```ts
code: DataSubjectLintCode;
```

Defined in: [src/lint/types.ts:15](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L15)

<a id="api-field"></a>

##### field?

```ts
optional field?: string;
```

Defined in: [src/lint/types.ts:17](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L17)

<a id="api-message"></a>

##### message

```ts
message: string;
```

Defined in: [src/lint/types.ts:18](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L18)

<a id="api-model"></a>

##### model

```ts
model: string;
```

Defined in: [src/lint/types.ts:16](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L16)

<a id="api-severity"></a>

##### severity

```ts
severity: DataSubjectLintSeverity;
```

Defined in: [src/lint/types.ts:14](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L14)

***

<a id="api-datasubjectlintregistryentry"></a>

### DataSubjectLintRegistryEntry

Defined in: [src/lint/types.ts:21](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L21)

#### Properties

<a id="api-entityname"></a>

##### entityName

```ts
entityName: string;
```

Defined in: [src/lint/types.ts:22](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L22)

<a id="api-fields"></a>

##### fields

```ts
fields: Record<string, PolicyEntry>;
```

Defined in: [src/lint/types.ts:26](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L26)

<a id="api-rowlevel"></a>

##### rowLevel?

```ts
optional rowLevel?: "delete-row" | "delete-fields";
```

Defined in: [src/lint/types.ts:25](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L25)

<a id="api-subjectfield"></a>

##### subjectField

```ts
subjectField: string;
```

Defined in: [src/lint/types.ts:23](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L23)

<a id="api-tenantfield"></a>

##### tenantField?

```ts
optional tenantField?: string;
```

Defined in: [src/lint/types.ts:24](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L24)

***

<a id="api-datasubjectlintreport"></a>

### DataSubjectLintReport

Defined in: [src/lint/types.ts:42](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L42)

#### Properties

<a id="api-findings"></a>

##### findings

```ts
findings: DataSubjectLintFinding[];
```

Defined in: [src/lint/types.ts:44](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L44)

<a id="api-ok"></a>

##### ok

```ts
ok: boolean;
```

Defined in: [src/lint/types.ts:43](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L43)

***

<a id="api-datasubjectlintsuppression"></a>

### DataSubjectLintSuppression

Defined in: [src/lint/types.ts:29](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L29)

#### Properties

<a id="api-field-1"></a>

##### field?

```ts
optional field?: string;
```

Defined in: [src/lint/types.ts:31](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L31)

<a id="api-model-1"></a>

##### model

```ts
model: string;
```

Defined in: [src/lint/types.ts:30](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L30)

<a id="api-reason"></a>

##### reason

```ts
reason: string;
```

Defined in: [src/lint/types.ts:32](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L32)

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
  | "dsr_lint_subject_field_missing";
```

Defined in: [src/lint/types.ts:5](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L5)

***

<a id="api-datasubjectlintseverity"></a>

### DataSubjectLintSeverity

```ts
type DataSubjectLintSeverity = "warning" | "error";
```

Defined in: [src/lint/types.ts:3](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L3)

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
