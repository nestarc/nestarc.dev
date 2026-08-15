# lint

## Interfaces

### DataSubjectLintConfig

Defined in: [src/lint/types.ts:35](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L35)

#### Properties

##### piiFieldPatterns?

```ts
optional piiFieldPatterns?: string[];
```

Defined in: [src/lint/types.ts:37](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L37)

##### registry?

```ts
optional registry?: DataSubjectLintRegistryEntry[];
```

Defined in: [src/lint/types.ts:36](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L36)

##### requireTenantField?

```ts
optional requireTenantField?: boolean;
```

Defined in: [src/lint/types.ts:39](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L39)

##### suppressions?

```ts
optional suppressions?: DataSubjectLintSuppression[];
```

Defined in: [src/lint/types.ts:38](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L38)

***

### DataSubjectLintFinding

Defined in: [src/lint/types.ts:13](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L13)

#### Properties

##### code

```ts
code: DataSubjectLintCode;
```

Defined in: [src/lint/types.ts:15](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L15)

##### field?

```ts
optional field?: string;
```

Defined in: [src/lint/types.ts:17](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L17)

##### message

```ts
message: string;
```

Defined in: [src/lint/types.ts:18](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L18)

##### model

```ts
model: string;
```

Defined in: [src/lint/types.ts:16](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L16)

##### severity

```ts
severity: DataSubjectLintSeverity;
```

Defined in: [src/lint/types.ts:14](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L14)

***

### DataSubjectLintRegistryEntry

Defined in: [src/lint/types.ts:21](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L21)

#### Properties

##### entityName

```ts
entityName: string;
```

Defined in: [src/lint/types.ts:22](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L22)

##### fields

```ts
fields: Record<string, PolicyEntry>;
```

Defined in: [src/lint/types.ts:26](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L26)

##### rowLevel?

```ts
optional rowLevel?: "delete-row" | "delete-fields";
```

Defined in: [src/lint/types.ts:25](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L25)

##### subjectField

```ts
subjectField: string;
```

Defined in: [src/lint/types.ts:23](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L23)

##### tenantField?

```ts
optional tenantField?: string;
```

Defined in: [src/lint/types.ts:24](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L24)

***

### DataSubjectLintReport

Defined in: [src/lint/types.ts:42](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L42)

#### Properties

##### findings

```ts
findings: DataSubjectLintFinding[];
```

Defined in: [src/lint/types.ts:44](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L44)

##### ok

```ts
ok: boolean;
```

Defined in: [src/lint/types.ts:43](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L43)

***

### DataSubjectLintSuppression

Defined in: [src/lint/types.ts:29](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L29)

#### Properties

##### field?

```ts
optional field?: string;
```

Defined in: [src/lint/types.ts:31](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L31)

##### model

```ts
model: string;
```

Defined in: [src/lint/types.ts:30](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L30)

##### reason

```ts
reason: string;
```

Defined in: [src/lint/types.ts:32](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L32)

## Type Aliases

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

### DataSubjectLintSeverity

```ts
type DataSubjectLintSeverity = "warning" | "error";
```

Defined in: [src/lint/types.ts:3](https://github.com/nestarc/data-subject/blob/92a05cb8c0aa3876e045893d777b935effbe9a69/src/lint/types.ts#L3)

## References

### formatLintReport

Re-exports [formatLintReport](index.md#formatlintreport)

***

### lintPrismaSchema

Re-exports [lintPrismaSchema](index.md#lintprismaschema)

***

### parsePrismaSchema

Re-exports [parsePrismaSchema](index.md#parseprismaschema)

***

### shouldFailLint

Re-exports [shouldFailLint](index.md#shouldfaillint)
