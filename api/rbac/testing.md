# testing

## Classes

### TestRbacModule

Defined in: [src/testing/test-rbac.module.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/test-rbac.module.ts#L14)

#### Constructors

##### Constructor

```ts
new TestRbacModule(): TestRbacModule;
```

###### Returns

[`TestRbacModule`](#testrbacmodule)

#### Methods

##### forRoot()

```ts
static forRoot(options?): DynamicModule;
```

Defined in: [src/testing/test-rbac.module.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/test-rbac.module.ts#L15)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`TestRbacModuleOptions`](#testrbacmoduleoptions) |

###### Returns

`DynamicModule`

## Interfaces

### RbacScenario

Defined in: [src/testing/rbac-scenario.ts:18](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L18)

#### Properties

##### rbac

```ts
rbac: RbacService;
```

Defined in: [src/testing/rbac-scenario.ts:20](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L20)

##### storage

```ts
storage: InMemoryRbacStorage;
```

Defined in: [src/testing/rbac-scenario.ts:19](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L19)

***

### RbacScenarioInput

Defined in: [src/testing/rbac-scenario.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L12)

#### Properties

##### bindings?

```ts
optional bindings?: AssignRoleInput[];
```

Defined in: [src/testing/rbac-scenario.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L14)

##### options?

```ts
optional options?: Omit<RbacModuleOptions, "storage">;
```

Defined in: [src/testing/rbac-scenario.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L15)

##### roles?

```ts
optional roles?: CreateRoleInput[];
```

Defined in: [src/testing/rbac-scenario.ts:13](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L13)

***

### TestRbacModuleOptions

Defined in: [src/testing/test-rbac.module.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/test-rbac.module.ts#L6)

#### Extends

- `Omit`\<[`RbacModuleOptions`](index.md#rbacmoduleoptions), `"storage"` \| `"subjectResolver"`\>

#### Properties

##### auditLogger?

```ts
optional auditLogger?: RbacAuditLogger;
```

Defined in: [src/interfaces/module-options.ts:44](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L44)

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`auditLogger`](index.md#auditlogger)

##### changePublisher?

```ts
optional changePublisher?: RbacPolicyChangePublisher;
```

Defined in: [src/interfaces/module-options.ts:55](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L55)

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`changePublisher`](index.md#changepublisher)

##### logAllowedDecisions?

```ts
optional logAllowedDecisions?: boolean;
```

Defined in: [src/interfaces/module-options.ts:53](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L53)

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`logAllowedDecisions`](index.md#logalloweddecisions)

##### now?

```ts
optional now?: () => Date;
```

Defined in: [src/interfaces/module-options.ts:56](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L56)

###### Returns

`Date`

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`now`](index.md#now-2)

##### requireMetadata?

```ts
optional requireMetadata?: boolean;
```

Defined in: [src/interfaces/module-options.ts:45](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L45)

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`requireMetadata`](index.md#requiremetadata)

##### storage?

```ts
optional storage?: RbacStorage;
```

Defined in: [src/testing/test-rbac.module.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/test-rbac.module.ts#L8)

##### storageErrors?

```ts
optional storageErrors?: "deny" | "throw";
```

Defined in: [src/interfaces/module-options.ts:52](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L52)

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`storageErrors`](index.md#storageerrors)

##### subject?

```ts
optional subject?: RbacSubject;
```

Defined in: [src/testing/test-rbac.module.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/test-rbac.module.ts#L9)

##### subjectResolver?

```ts
optional subjectResolver?: RbacSubjectResolver;
```

Defined in: [src/testing/test-rbac.module.ts:10](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/test-rbac.module.ts#L10)

##### tenant?

```ts
optional tenant?: {
  allowGlobalRolesInTenant?: boolean;
  requiredByDefault?: boolean;
};
```

Defined in: [src/interfaces/module-options.ts:46](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L46)

###### allowGlobalRolesInTenant?

```ts
optional allowGlobalRolesInTenant?: boolean;
```

###### requiredByDefault?

```ts
optional requiredByDefault?: boolean;
```

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`tenant`](index.md#tenant-1)

##### tenantResolver?

```ts
optional tenantResolver?: RbacTenantResolver;
```

Defined in: [src/interfaces/module-options.ts:43](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L43)

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`tenantResolver`](index.md#tenantresolver)

##### writeValidation?

```ts
optional writeValidation?: RbacWriteValidationOptions;
```

Defined in: [src/interfaces/module-options.ts:54](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L54)

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`writeValidation`](index.md#writevalidation)

## Type Aliases

### RbacMatrixCase

```ts
type RbacMatrixCase = RbacCanInput & {
  allowed: boolean;
  label?: string;
  reason?: RbacDecisionReason;
};
```

Defined in: [src/testing/rbac-scenario.ts:23](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L23)

#### Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `allowed` | `boolean` | [src/testing/rbac-scenario.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L24) |
| `label?` | `string` | [src/testing/rbac-scenario.ts:26](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L26) |
| `reason?` | [`RbacDecisionReason`](index.md#rbacdecisionreason-1) | [src/testing/rbac-scenario.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L25) |

## Variables

### apiKey

```ts
const apiKey: (id, tenantId?) => RbacSubject = rbacApiKey;
```

Defined in: [src/testing/subjects.ts:22](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/subjects.ts#L22)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `tenantId?` | `string` \| `null` |

#### Returns

[`RbacSubject`](index.md#rbacsubject)

***

### serviceAccount

```ts
const serviceAccount: (id, tenantId?) => RbacSubject = rbacServiceAccount;
```

Defined in: [src/testing/subjects.ts:23](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/subjects.ts#L23)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `tenantId?` | `string` \| `null` |

#### Returns

[`RbacSubject`](index.md#rbacsubject)

***

### user

```ts
const user: (id, tenantId?) => RbacSubject = rbacUser;
```

Defined in: [src/testing/subjects.ts:21](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/subjects.ts#L21)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `tenantId?` | `string` \| `null` |

#### Returns

[`RbacSubject`](index.md#rbacsubject)

## Functions

### createRbacScenario()

```ts
function createRbacScenario(input?): Promise<RbacScenario>;
```

Defined in: [src/testing/rbac-scenario.ts:50](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L50)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RbacScenarioInput`](#rbacscenarioinput) |

#### Returns

`Promise`\<[`RbacScenario`](#rbacscenario)\>

***

### expectAllowed()

```ts
function expectAllowed(rbac, input): Promise<RbacDecision>;
```

Defined in: [src/testing/expect-rbac-decision.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/expect-rbac-decision.ts#L4)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `rbac` | [`RbacService`](index.md#rbacservice) |
| `input` | [`RbacCanInput`](index.md#rbaccaninput) |

#### Returns

`Promise`\<[`RbacDecision`](index.md#rbacdecision)\>

***

### expectDenied()

```ts
function expectDenied(
   rbac, 
   input, 
reason?): Promise<RbacDecision>;
```

Defined in: [src/testing/expect-rbac-decision.ts:16](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/expect-rbac-decision.ts#L16)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `rbac` | [`RbacService`](index.md#rbacservice) |
| `input` | [`RbacCanInput`](index.md#rbaccaninput) |
| `reason?` | [`RbacDecisionReason`](index.md#rbacdecisionreason-1) |

#### Returns

`Promise`\<[`RbacDecision`](index.md#rbacdecision)\>

***

### expectDeniedReason()

```ts
function expectDeniedReason(
   rbac, 
   input, 
reason): Promise<RbacDecision>;
```

Defined in: [src/testing/expect-rbac-decision.ts:32](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/expect-rbac-decision.ts#L32)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `rbac` | [`RbacService`](index.md#rbacservice) |
| `input` | [`RbacCanInput`](index.md#rbaccaninput) |
| `reason` | [`RbacDecisionReason`](index.md#rbacdecisionreason-1) |

#### Returns

`Promise`\<[`RbacDecision`](index.md#rbacdecision)\>

***

### expectRbacMatrix()

```ts
function expectRbacMatrix(rbac, cases): Promise<RbacDecision[]>;
```

Defined in: [src/testing/rbac-scenario.ts:64](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L64)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `rbac` | [`RbacService`](index.md#rbacservice) |
| `cases` | [`RbacMatrixCase`](#rbacmatrixcase)[] |

#### Returns

`Promise`\<[`RbacDecision`](index.md#rbacdecision)[]\>

***

### rbacApiKey()

```ts
function rbacApiKey(id, tenantId?): RbacSubject;
```

Defined in: [src/testing/subjects.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/subjects.ts#L9)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `tenantId?` | `string` \| `null` |

#### Returns

[`RbacSubject`](index.md#rbacsubject)

***

### rbacServiceAccount()

```ts
function rbacServiceAccount(id, tenantId?): RbacSubject;
```

Defined in: [src/testing/subjects.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/subjects.ts#L15)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `tenantId?` | `string` \| `null` |

#### Returns

[`RbacSubject`](index.md#rbacsubject)

***

### rbacUser()

```ts
function rbacUser(id, tenantId?): RbacSubject;
```

Defined in: [src/testing/subjects.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/subjects.ts#L3)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `tenantId?` | `string` \| `null` |

#### Returns

[`RbacSubject`](index.md#rbacsubject)
