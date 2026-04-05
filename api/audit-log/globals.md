# @nestarc/audit-log

## Classes

### AuditContext

Defined in: [src/services/audit-context.ts:10](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/services/audit-context.ts#L10)

#### Constructors

##### Constructor

```ts
new AuditContext(): AuditContext;
```

###### Returns

[`AuditContext`](#auditcontext)

#### Methods

##### getActionOverride()

```ts
static getActionOverride(): string | undefined;
```

Defined in: [src/services/audit-context.ts:29](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/services/audit-context.ts#L29)

###### Returns

`string` \| `undefined`

##### getActor()

```ts
static getActor(): AuditActor | null;
```

Defined in: [src/services/audit-context.ts:21](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/services/audit-context.ts#L21)

###### Returns

[`AuditActor`](#auditactor) \| `null`

##### getStore()

```ts
static getStore(): AuditContextStore | undefined;
```

Defined in: [src/services/audit-context.ts:17](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/services/audit-context.ts#L17)

###### Returns

[`AuditContextStore`](#auditcontextstore) \| `undefined`

##### isNoAudit()

```ts
static isNoAudit(): boolean;
```

Defined in: [src/services/audit-context.ts:25](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/services/audit-context.ts#L25)

###### Returns

`boolean`

##### run()

```ts
static run<T>(store, fn): T;
```

Defined in: [src/services/audit-context.ts:13](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/services/audit-context.ts#L13)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `store` | [`AuditContextStore`](#auditcontextstore) |
| `fn` | () => `T` |

###### Returns

`T`

***

### AuditLogModule

Defined in: [src/audit-log.module.ts:18](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/audit-log.module.ts#L18)

#### Implements

- `NestModule`

#### Constructors

##### Constructor

```ts
new AuditLogModule(): AuditLogModule;
```

###### Returns

[`AuditLogModule`](#auditlogmodule)

#### Methods

##### configure()

```ts
configure(consumer): void;
```

Defined in: [src/audit-log.module.ts:19](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/audit-log.module.ts#L19)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `consumer` | `MiddlewareConsumer` |

###### Returns

`void`

###### Implementation of

```ts
NestModule.configure
```

##### forRoot()

```ts
static forRoot(options): DynamicModule;
```

Defined in: [src/audit-log.module.ts:23](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/audit-log.module.ts#L23)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditLogModuleOptions`](#auditlogmoduleoptions) |

###### Returns

`DynamicModule`

##### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [src/audit-log.module.ts:37](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/audit-log.module.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditLogModuleAsyncOptions`](#auditlogmoduleasyncoptions) |

###### Returns

`DynamicModule`

***

### AuditService

Defined in: [src/services/audit.service.ts:15](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/services/audit.service.ts#L15)

#### Constructors

##### Constructor

```ts
new AuditService(options): AuditService;
```

Defined in: [src/services/audit.service.ts:16](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/services/audit.service.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditLogModuleOptions`](#auditlogmoduleoptions) |

###### Returns

[`AuditService`](#auditservice)

#### Methods

##### log()

```ts
log(input, tx?): Promise<void>;
```

Defined in: [src/services/audit.service.ts:21](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/services/audit.service.ts#L21)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ManualAuditLogInput`](#manualauditloginput) |
| `tx?` | `any` |

###### Returns

`Promise`\<`void`\>

##### query()

```ts
query(options): Promise<AuditQueryResult>;
```

Defined in: [src/services/audit.service.ts:53](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/services/audit.service.ts#L53)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditQueryOptions`](#auditqueryoptions) |

###### Returns

`Promise`\<[`AuditQueryResult`](#auditqueryresult)\>

## Interfaces

### AuditActor

Defined in: [src/interfaces/actor.interface.ts:1](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/actor.interface.ts#L1)

#### Properties

##### id

```ts
id: string | null;
```

Defined in: [src/interfaces/actor.interface.ts:2](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/actor.interface.ts#L2)

##### ip?

```ts
optional ip?: string;
```

Defined in: [src/interfaces/actor.interface.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/actor.interface.ts#L4)

##### type

```ts
type: "user" | "system" | "api_key";
```

Defined in: [src/interfaces/actor.interface.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/actor.interface.ts#L3)

***

### AuditContextStore

Defined in: [src/services/audit-context.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/services/audit-context.ts#L4)

#### Properties

##### actionOverride?

```ts
optional actionOverride?: string;
```

Defined in: [src/services/audit-context.ts:7](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/services/audit-context.ts#L7)

##### actor

```ts
actor: AuditActor | null;
```

Defined in: [src/services/audit-context.ts:5](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/services/audit-context.ts#L5)

##### noAudit

```ts
noAudit: boolean;
```

Defined in: [src/services/audit-context.ts:6](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/services/audit-context.ts#L6)

***

### AuditEntry

Defined in: [src/interfaces/audit-entry.interface.ts:1](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L1)

#### Properties

##### action

```ts
action: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:7](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L7)

##### actorId

```ts
actorId: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L4)

##### actorIp

```ts
actorIp: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:6](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L6)

##### actorType

```ts
actorType: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:5](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L5)

##### changes

```ts
changes: 
  | Record<string, {
  after?: unknown;
  before?: unknown;
}>
  | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:11](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L11)

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/audit-entry.interface.ts:14](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L14)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:2](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L2)

##### metadata

```ts
metadata: Record<string, unknown> | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:12](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L12)

##### result

```ts
result: "success" | "failure";
```

Defined in: [src/interfaces/audit-entry.interface.ts:13](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L13)

##### source

```ts
source: "auto" | "manual";
```

Defined in: [src/interfaces/audit-entry.interface.ts:10](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L10)

##### targetId

```ts
targetId: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:9](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L9)

##### targetType

```ts
targetType: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:8](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L8)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L3)

***

### AuditExtensionOptions

Defined in: [src/prisma/audit-extension.ts:11](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/prisma/audit-extension.ts#L11)

#### Properties

##### ignoredModels?

```ts
optional ignoredModels?: string[];
```

Defined in: [src/prisma/audit-extension.ts:13](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/prisma/audit-extension.ts#L13)

##### primaryKey?

```ts
optional primaryKey?: Record<string, string>;
```

Defined in: [src/prisma/audit-extension.ts:16](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/prisma/audit-extension.ts#L16)

Map of model name to primary key field name. Defaults to 'id'.

##### sensitiveFields?

```ts
optional sensitiveFields?: string[];
```

Defined in: [src/prisma/audit-extension.ts:14](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/prisma/audit-extension.ts#L14)

##### trackedModels?

```ts
optional trackedModels?: string[];
```

Defined in: [src/prisma/audit-extension.ts:12](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/prisma/audit-extension.ts#L12)

***

### AuditLogModuleAsyncOptions

Defined in: [src/interfaces/audit-log-options.interface.ts:11](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-log-options.interface.ts#L11)

#### Extends

- `Pick`\<`ModuleMetadata`, `"imports"`\>

#### Properties

##### imports?

```ts
optional imports?: (
  | DynamicModule
  | Type<any>
  | Promise<DynamicModule>
  | ForwardReference<any>)[];
```

Defined in: node\_modules/@nestjs/common/interfaces/modules/module-metadata.interface.d.ts:18

Optional list of imported modules that export the providers which are
required in this module.

###### Inherited from

```ts
Pick.imports
```

##### inject?

```ts
optional inject?: any[];
```

Defined in: [src/interfaces/audit-log-options.interface.ts:16](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-log-options.interface.ts#L16)

##### useFactory

```ts
useFactory: (...args) => 
  | AuditLogModuleOptions
| Promise<AuditLogModuleOptions>;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:13](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-log-options.interface.ts#L13)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`AuditLogModuleOptions`](#auditlogmoduleoptions)
  \| `Promise`\<[`AuditLogModuleOptions`](#auditlogmoduleoptions)\>

***

### AuditLogModuleOptions

Defined in: [src/interfaces/audit-log-options.interface.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-log-options.interface.ts#L4)

#### Properties

##### actorExtractor

```ts
actorExtractor: ActorExtractor;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:6](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-log-options.interface.ts#L6)

##### prisma

```ts
prisma: any;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:5](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-log-options.interface.ts#L5)

##### tenantRequired?

```ts
optional tenantRequired?: boolean;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:8](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-log-options.interface.ts#L8)

When true, query() throws if tenant context is unavailable. Default: false

***

### AuditQueryOptions

Defined in: [src/interfaces/audit-entry.interface.ts:17](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L17)

#### Properties

##### action?

```ts
optional action?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:19](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L19)

##### actorId?

```ts
optional actorId?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:18](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L18)

##### from?

```ts
optional from?: Date;
```

Defined in: [src/interfaces/audit-entry.interface.ts:22](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L22)

##### limit?

```ts
optional limit?: number;
```

Defined in: [src/interfaces/audit-entry.interface.ts:24](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L24)

##### offset?

```ts
optional offset?: number;
```

Defined in: [src/interfaces/audit-entry.interface.ts:25](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L25)

##### targetId?

```ts
optional targetId?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:21](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L21)

##### targetType?

```ts
optional targetType?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:20](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L20)

##### to?

```ts
optional to?: Date;
```

Defined in: [src/interfaces/audit-entry.interface.ts:23](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L23)

***

### AuditQueryResult

Defined in: [src/interfaces/audit-entry.interface.ts:28](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L28)

#### Properties

##### entries

```ts
entries: AuditEntry[];
```

Defined in: [src/interfaces/audit-entry.interface.ts:29](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L29)

##### total

```ts
total: number;
```

Defined in: [src/interfaces/audit-entry.interface.ts:30](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L30)

***

### ManualAuditLogInput

Defined in: [src/interfaces/audit-entry.interface.ts:33](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L33)

#### Properties

##### action

```ts
action: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:34](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L34)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/audit-entry.interface.ts:37](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L37)

##### result?

```ts
optional result?: "success" | "failure";
```

Defined in: [src/interfaces/audit-entry.interface.ts:38](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L38)

##### targetId?

```ts
optional targetId?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:35](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L35)

##### targetType?

```ts
optional targetType?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:36](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/audit-entry.interface.ts#L36)

## Type Aliases

### ActorExtractor

```ts
type ActorExtractor = (req) => AuditActor;
```

Defined in: [src/interfaces/actor.interface.ts:7](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/interfaces/actor.interface.ts#L7)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `any` |

#### Returns

[`AuditActor`](#auditactor)

## Variables

### AUDIT\_ACTION\_KEY

```ts
const AUDIT_ACTION_KEY: "AUDIT_ACTION" = 'AUDIT_ACTION';
```

Defined in: [src/decorators/audit-action.decorator.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/decorators/audit-action.decorator.ts#L3)

***

### AUDIT\_LOG\_OPTIONS

```ts
const AUDIT_LOG_OPTIONS: typeof AUDIT_LOG_OPTIONS;
```

Defined in: [src/audit-log.constants.ts:1](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/audit-log.constants.ts#L1)

***

### NO\_AUDIT\_KEY

```ts
const NO_AUDIT_KEY: "NO_AUDIT" = 'NO_AUDIT';
```

Defined in: [src/decorators/no-audit.decorator.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/decorators/no-audit.decorator.ts#L3)

## Functions

### applyAuditTableSchema()

```ts
function applyAuditTableSchema(prisma): Promise<void>;
```

Defined in: [src/sql/index.ts:50](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/sql/index.ts#L50)

Execute the audit table schema SQL using a Prisma client.
Runs each statement individually to work with Prisma's prepared statement limit.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prisma` | `any` |

#### Returns

`Promise`\<`void`\>

***

### AuditAction()

```ts
function AuditAction(action): CustomDecorator<string>;
```

Defined in: [src/decorators/audit-action.decorator.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/decorators/audit-action.decorator.ts#L4)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `action` | `string` |

#### Returns

`CustomDecorator`\<`string`\>

***

### createAuditExtension()

```ts
function createAuditExtension(options): any;
```

Defined in: [src/prisma/audit-extension.ts:119](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/prisma/audit-extension.ts#L119)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditExtensionOptions`](#auditextensionoptions) |

#### Returns

`any`

***

### getAuditTableSQL()

```ts
function getAuditTableSQL(): string;
```

Defined in: [src/sql/index.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/sql/index.ts#L4)

#### Returns

`string`

***

### getAuditTableStatements()

```ts
function getAuditTableStatements(): string[];
```

Defined in: [src/sql/index.ts:13](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/sql/index.ts#L13)

Split the audit table SQL into individual executable statements.
Handles PL/pgSQL DO blocks ($$...$$) that contain inner semicolons.
Useful because Prisma's $executeRawUnsafe cannot run multiple statements at once.

#### Returns

`string`[]

***

### NoAudit()

```ts
function NoAudit(): CustomDecorator<string>;
```

Defined in: [src/decorators/no-audit.decorator.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/e3e359221e03a03c74a72195553756cc16d529b7/src/decorators/no-audit.decorator.ts#L4)

#### Returns

`CustomDecorator`\<`string`\>
