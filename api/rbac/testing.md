# testing

## Classes

<a id="api-testrbacmodule"></a>

### TestRbacModule

Defined in: [src/testing/test-rbac.module.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/test-rbac.module.ts#L14)

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new TestRbacModule(): TestRbacModule;
```

###### Returns

[`TestRbacModule`](#api-testrbacmodule)

#### Methods

<a id="api-forroot"></a>

##### forRoot()

```ts
static forRoot(options?): DynamicModule;
```

Defined in: [src/testing/test-rbac.module.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/test-rbac.module.ts#L15)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`TestRbacModuleOptions`](#api-testrbacmoduleoptions) |

###### Returns

`DynamicModule`

## Interfaces

<a id="api-rbacscenario"></a>

### RbacScenario

Defined in: [src/testing/rbac-scenario.ts:18](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L18)

#### Properties

<a id="api-rbac"></a>

##### rbac

```ts
rbac: RbacService;
```

Defined in: [src/testing/rbac-scenario.ts:20](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L20)

<a id="api-storage"></a>

##### storage

```ts
storage: InMemoryRbacStorage;
```

Defined in: [src/testing/rbac-scenario.ts:19](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L19)

***

<a id="api-rbacscenarioinput"></a>

### RbacScenarioInput

Defined in: [src/testing/rbac-scenario.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L12)

#### Properties

<a id="api-bindings"></a>

##### bindings?

```ts
optional bindings?: AssignRoleInput[];
```

Defined in: [src/testing/rbac-scenario.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L14)

<a id="api-options"></a>

##### options?

```ts
optional options?: Omit<RbacModuleOptions, "storage">;
```

Defined in: [src/testing/rbac-scenario.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L15)

<a id="api-roles"></a>

##### roles?

```ts
optional roles?: CreateRoleInput[];
```

Defined in: [src/testing/rbac-scenario.ts:13](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L13)

***

<a id="api-testrbacmoduleoptions"></a>

### TestRbacModuleOptions

Defined in: [src/testing/test-rbac.module.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/test-rbac.module.ts#L6)

#### Extends

- `Omit`\<[`RbacModuleOptions`](index.md#rbacmoduleoptions), `"storage"` \| `"subjectResolver"`\>

#### Properties

<a id="api-auditlogger"></a>

##### auditLogger?

```ts
optional auditLogger?: RbacAuditLogger;
```

Defined in: [src/interfaces/module-options.ts:44](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L44)

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`auditLogger`](index.md#auditlogger)

<a id="api-changepublisher"></a>

##### changePublisher?

```ts
optional changePublisher?: RbacPolicyChangePublisher;
```

Defined in: [src/interfaces/module-options.ts:55](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L55)

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`changePublisher`](index.md#changepublisher)

<a id="api-logalloweddecisions"></a>

##### logAllowedDecisions?

```ts
optional logAllowedDecisions?: boolean;
```

Defined in: [src/interfaces/module-options.ts:53](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L53)

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`logAllowedDecisions`](index.md#logalloweddecisions)

<a id="api-now"></a>

##### now?

```ts
optional now?: () => Date;
```

Defined in: [src/interfaces/module-options.ts:56](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L56)

###### Returns

`Date`

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`now`](index.md#now-2)

<a id="api-requiremetadata"></a>

##### requireMetadata?

```ts
optional requireMetadata?: boolean;
```

Defined in: [src/interfaces/module-options.ts:45](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L45)

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`requireMetadata`](index.md#requiremetadata)

<a id="api-storage-1"></a>

##### storage?

```ts
optional storage?: RbacStorage;
```

Defined in: [src/testing/test-rbac.module.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/test-rbac.module.ts#L8)

<a id="api-storageerrors"></a>

##### storageErrors?

```ts
optional storageErrors?: "deny" | "throw";
```

Defined in: [src/interfaces/module-options.ts:52](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L52)

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`storageErrors`](index.md#storageerrors)

<a id="api-subject"></a>

##### subject?

```ts
optional subject?: RbacSubject;
```

Defined in: [src/testing/test-rbac.module.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/test-rbac.module.ts#L9)

<a id="api-subjectresolver"></a>

##### subjectResolver?

```ts
optional subjectResolver?: RbacSubjectResolver;
```

Defined in: [src/testing/test-rbac.module.ts:10](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/test-rbac.module.ts#L10)

<a id="api-tenant"></a>

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

<a id="api-tenantresolver"></a>

##### tenantResolver?

```ts
optional tenantResolver?: RbacTenantResolver;
```

Defined in: [src/interfaces/module-options.ts:43](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L43)

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`tenantResolver`](index.md#tenantresolver)

<a id="api-writevalidation"></a>

##### writeValidation?

```ts
optional writeValidation?: RbacWriteValidationOptions;
```

Defined in: [src/interfaces/module-options.ts:54](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L54)

###### Inherited from

[`RbacModuleOptions`](index.md#rbacmoduleoptions).[`writeValidation`](index.md#writevalidation)

## Type Aliases

<a id="api-rbacmatrixcase"></a>

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
| `reason?` | [`RbacDecisionReason`](index.md#api-rbacdecisionreason-1) | [src/testing/rbac-scenario.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L25) |

## Variables

<a id="api-apikey"></a>

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

<a id="api-serviceaccount"></a>

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

<a id="api-user"></a>

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

<a id="api-createrbacscenario"></a>

### createRbacScenario()

```ts
function createRbacScenario(input?): Promise<RbacScenario>;
```

Defined in: [src/testing/rbac-scenario.ts:50](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L50)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RbacScenarioInput`](#api-rbacscenarioinput) |

#### Returns

`Promise`\<[`RbacScenario`](#api-rbacscenario)\>

***

<a id="api-expectallowed"></a>

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

<a id="api-expectdenied"></a>

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
| `reason?` | [`RbacDecisionReason`](index.md#api-rbacdecisionreason-1) |

#### Returns

`Promise`\<[`RbacDecision`](index.md#rbacdecision)\>

***

<a id="api-expectdeniedreason"></a>

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
| `reason` | [`RbacDecisionReason`](index.md#api-rbacdecisionreason-1) |

#### Returns

`Promise`\<[`RbacDecision`](index.md#rbacdecision)\>

***

<a id="api-expectrbacmatrix"></a>

### expectRbacMatrix()

```ts
function expectRbacMatrix(rbac, cases): Promise<RbacDecision[]>;
```

Defined in: [src/testing/rbac-scenario.ts:64](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/testing/rbac-scenario.ts#L64)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `rbac` | [`RbacService`](index.md#rbacservice) |
| `cases` | [`RbacMatrixCase`](#api-rbacmatrixcase)[] |

#### Returns

`Promise`\<[`RbacDecision`](index.md#rbacdecision)[]\>

***

<a id="api-rbacapikey"></a>

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

<a id="api-rbacserviceaccount"></a>

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

<a id="api-rbacuser"></a>

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
