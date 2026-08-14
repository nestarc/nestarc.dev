# @nestarc/audit-log

## Classes

### AuditActorMiddleware

Defined in: [src/middleware/audit-actor.middleware.ts:9](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/middleware/audit-actor.middleware.ts#L9)

#### Implements

- `NestMiddleware`

#### Constructors

##### Constructor

```ts
new AuditActorMiddleware(options): AuditActorMiddleware;
```

Defined in: [src/middleware/audit-actor.middleware.ts:10](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/middleware/audit-actor.middleware.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditLogModuleOptions`](#auditlogmoduleoptions) |

###### Returns

[`AuditActorMiddleware`](#auditactormiddleware)

#### Methods

##### use()

```ts
use(
   req, 
   _res, 
next): Promise<void>;
```

Defined in: [src/middleware/audit-actor.middleware.ts:15](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/middleware/audit-actor.middleware.ts#L15)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `any` |
| `_res` | `any` |
| `next` | () => `void` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
NestMiddleware.use
```

***

### AuditContext

Defined in: [src/services/audit-context.ts:12](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L12)

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

Defined in: [src/services/audit-context.ts:35](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L35)

###### Returns

`string` \| `undefined`

##### getActor()

```ts
static getActor(): AuditActor | null;
```

Defined in: [src/services/audit-context.ts:27](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L27)

###### Returns

[`AuditActor`](#auditactor) \| `null`

##### getMetadata()

```ts
static getMetadata(): Record<string, unknown> | undefined;
```

Defined in: [src/services/audit-context.ts:48](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L48)

###### Returns

`Record`\<`string`, `unknown`\> \| `undefined`

##### getReason()

```ts
static getReason(): string | undefined;
```

Defined in: [src/services/audit-context.ts:58](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L58)

###### Returns

`string` \| `undefined`

##### getStore()

```ts
static getStore(): AuditContextStore | undefined;
```

Defined in: [src/services/audit-context.ts:23](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L23)

###### Returns

[`AuditContextStore`](#auditcontextstore) \| `undefined`

##### isNoAudit()

```ts
static isNoAudit(): boolean;
```

Defined in: [src/services/audit-context.ts:31](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L31)

###### Returns

`boolean`

##### run()

```ts
static run<T>(store, fn): T;
```

Defined in: [src/services/audit-context.ts:15](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L15)

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

##### runAs()

```ts
static runAs<T>(actor, fn): T;
```

Defined in: [src/services/audit-context.ts:19](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L19)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `actor` | [`AuditActor`](#auditactor) |
| `fn` | () => `T` |

###### Returns

`T`

##### setMetadata()

```ts
static setMetadata(metadata): void;
```

Defined in: [src/services/audit-context.ts:39](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `metadata` | `Record`\<`string`, `unknown`\> |

###### Returns

`void`

##### setReason()

```ts
static setReason(reason): void;
```

Defined in: [src/services/audit-context.ts:52](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L52)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `reason` | `string` |

###### Returns

`void`

***

### AuditInterceptor

Defined in: [src/interceptors/audit.interceptor.ts:15](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interceptors/audit.interceptor.ts#L15)

#### Implements

- `NestInterceptor`

#### Constructors

##### Constructor

```ts
new AuditInterceptor(reflector): AuditInterceptor;
```

Defined in: [src/interceptors/audit.interceptor.ts:16](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interceptors/audit.interceptor.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `reflector` | `Reflector` |

###### Returns

[`AuditInterceptor`](#auditinterceptor)

#### Methods

##### intercept()

```ts
intercept(context, next): Observable<any>;
```

Defined in: [src/interceptors/audit.interceptor.ts:18](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interceptors/audit.interceptor.ts#L18)

Method to implement a custom interceptor.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `ExecutionContext` | an `ExecutionContext` object providing methods to access the route handler and class about to be invoked. |
| `next` | `CallHandler` | a reference to the `CallHandler`, which provides access to an `Observable` representing the response stream from the route handler. |

###### Returns

`Observable`\<`any`\>

###### Implementation of

```ts
NestInterceptor.intercept
```

***

### AuditLogModule

Defined in: [src/audit-log.module.ts:20](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/audit-log.module.ts#L20)

#### Implements

- `NestModule`

#### Constructors

##### Constructor

```ts
new AuditLogModule(options): AuditLogModule;
```

Defined in: [src/audit-log.module.ts:21](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/audit-log.module.ts#L21)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditLogModuleOptions`](#auditlogmoduleoptions) |

###### Returns

[`AuditLogModule`](#auditlogmodule)

#### Methods

##### configure()

```ts
configure(consumer): void;
```

Defined in: [src/audit-log.module.ts:26](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/audit-log.module.ts#L26)

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

Defined in: [src/audit-log.module.ts:33](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/audit-log.module.ts#L33)

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

Defined in: [src/audit-log.module.ts:52](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/audit-log.module.ts#L52)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditLogModuleAsyncOptions`](#auditlogmoduleasyncoptions) |

###### Returns

`DynamicModule`

***

### AuditService

Defined in: [src/services/audit.service.ts:48](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L48)

#### Constructors

##### Constructor

```ts
new AuditService(options): AuditService;
```

Defined in: [src/services/audit.service.ts:54](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L54)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditLogModuleOptions`](#auditlogmoduleoptions) |

###### Returns

[`AuditService`](#auditservice)

#### Methods

##### getById()

```ts
getById(id, options?): Promise<AuditEntry | null>;
```

Defined in: [src/services/audit.service.ts:266](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L266)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `options` | [`AuditGetByIdOptions`](#auditgetbyidoptions) |

###### Returns

`Promise`\<[`AuditEntry`](#auditentry) \| `null`\>

##### log()

```ts
log(input, tx?): Promise<void>;
```

Defined in: [src/services/audit.service.ts:66](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L66)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ManualAuditLogInput`](#manualauditloginput) |
| `tx?` | `any` |

###### Returns

`Promise`\<`void`\>

##### prune()

```ts
prune(options): Promise<AuditPruneResult>;
```

Defined in: [src/services/audit.service.ts:360](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L360)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditPruneOptions`](#auditpruneoptions) |

###### Returns

`Promise`\<[`AuditPruneResult`](#auditpruneresult)\>

##### query()

```ts
query(options): Promise<AuditQueryResult>;
```

Defined in: [src/services/audit.service.ts:145](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L145)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditQueryOptions`](#auditqueryoptions) |

###### Returns

`Promise`\<[`AuditQueryResult`](#auditqueryresult)\>

## Interfaces

### AuditActor

Defined in: [src/interfaces/actor.interface.ts:1](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/actor.interface.ts#L1)

#### Properties

##### id

```ts
id: string | null;
```

Defined in: [src/interfaces/actor.interface.ts:2](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/actor.interface.ts#L2)

##### ip?

```ts
optional ip?: string;
```

Defined in: [src/interfaces/actor.interface.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/actor.interface.ts#L4)

##### type

```ts
type: "user" | "system" | "api_key";
```

Defined in: [src/interfaces/actor.interface.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/actor.interface.ts#L3)

***

### AuditContextStore

Defined in: [src/services/audit-context.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L4)

#### Properties

##### actionOverride?

```ts
optional actionOverride?: string;
```

Defined in: [src/services/audit-context.ts:7](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L7)

##### actor

```ts
actor: AuditActor | null;
```

Defined in: [src/services/audit-context.ts:5](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L5)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/services/audit-context.ts:8](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L8)

##### noAudit

```ts
noAudit: boolean;
```

Defined in: [src/services/audit-context.ts:6](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L6)

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/services/audit-context.ts:9](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L9)

***

### AuditEntry

Defined in: [src/interfaces/audit-entry.interface.ts:1](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L1)

#### Properties

##### action

```ts
action: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:7](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L7)

##### actorId

```ts
actorId: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L4)

##### actorIp

```ts
actorIp: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:6](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L6)

##### actorType

```ts
actorType: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:5](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L5)

##### changes

```ts
changes: 
  | Record<string, {
  after?: unknown;
  before?: unknown;
}>
  | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:11](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L11)

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/audit-entry.interface.ts:14](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L14)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:2](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L2)

##### metadata

```ts
metadata: Record<string, unknown> | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:12](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L12)

##### result

```ts
result: "success" | "failure";
```

Defined in: [src/interfaces/audit-entry.interface.ts:13](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L13)

##### source

```ts
source: "auto" | "manual";
```

Defined in: [src/interfaces/audit-entry.interface.ts:10](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L10)

##### targetId

```ts
targetId: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:9](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L9)

##### targetType

```ts
targetType: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:8](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L8)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L3)

***

### AuditErrorContext

Defined in: [src/interfaces/audit-shared-options.interface.ts:14](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L14)

#### Properties

##### action?

```ts
optional action?: string;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:18](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L18)

##### model?

```ts
optional model?: string;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:16](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L16)

##### operation?

```ts
optional operation?: string;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:17](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L17)

##### phase

```ts
phase: AuditErrorPhase;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:15](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L15)

##### targetId?

```ts
optional targetId?: string | null;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:19](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L19)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:20](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L20)

***

### AuditExtensionOptions

Defined in: [src/prisma/audit-extension.ts:36](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/prisma/audit-extension.ts#L36)

Options shared by the Nest module and Prisma extension.
Runtime merging is intentionally not performed; pass the same object to both
call sites when both paths should share behavior.

#### Extends

- [`AuditSharedOptions`](#auditsharedoptions)

#### Properties

##### experimentalTxAudit?

```ts
optional experimentalTxAudit?: boolean;
```

Defined in: [src/prisma/audit-extension.ts:51](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/prisma/audit-extension.ts#L51)

EXPERIMENTAL — no semver guarantee. Reserved for transaction-aware audit
routing when Prisma exposes a compatible internal transaction capability.
Default behavior remains best-effort outside the caller transaction.

##### ignoredModels?

```ts
optional ignoredModels?: string[];
```

Defined in: [src/prisma/audit-extension.ts:38](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/prisma/audit-extension.ts#L38)

##### ignoreTimestampOnlyUpdates?

```ts
optional ignoreTimestampOnlyUpdates?: boolean;
```

Defined in: [src/prisma/audit-extension.ts:44](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/prisma/audit-extension.ts#L44)

##### logFailures?

```ts
optional logFailures?: boolean;
```

Defined in: [src/prisma/audit-extension.ts:43](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/prisma/audit-extension.ts#L43)

##### logger?

```ts
optional logger?: AuditLogger;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:33](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L33)

###### Inherited from

[`AuditSharedOptions`](#auditsharedoptions).[`logger`](#logger-2)

##### onAuditError?

```ts
optional onAuditError?: (error, ctx) => void;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:32](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L32)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |
| `ctx` | [`AuditErrorContext`](#auditerrorcontext) |

###### Returns

`void`

###### Inherited from

[`AuditSharedOptions`](#auditsharedoptions).[`onAuditError`](#onauditerror-2)

##### primaryKey?

```ts
optional primaryKey?: Record<string, string>;
```

Defined in: [src/prisma/audit-extension.ts:42](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/prisma/audit-extension.ts#L42)

Map of model name to primary key field name. Defaults to 'id'.

##### prismaModule?

```ts
optional prismaModule?: PrismaModuleLike;
```

Defined in: [src/prisma/audit-extension.ts:45](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/prisma/audit-extension.ts#L45)

##### sensitiveFields?

```ts
optional sensitiveFields?: string[];
```

Defined in: [src/prisma/audit-extension.ts:39](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/prisma/audit-extension.ts#L39)

##### sensitiveFieldsByModel?

```ts
optional sensitiveFieldsByModel?: Record<string, string[]>;
```

Defined in: [src/prisma/audit-extension.ts:40](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/prisma/audit-extension.ts#L40)

##### tableName?

```ts
optional tableName?: string;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:29](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L29)

###### Inherited from

[`AuditSharedOptions`](#auditsharedoptions).[`tableName`](#tablename-2)

##### tenantRequired?

```ts
optional tenantRequired?: boolean;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:30](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L30)

###### Inherited from

[`AuditSharedOptions`](#auditsharedoptions).[`tenantRequired`](#tenantrequired-2)

##### tenantResolver?

```ts
optional tenantResolver?: () => string | null;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:31](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L31)

###### Returns

`string` \| `null`

###### Inherited from

[`AuditSharedOptions`](#auditsharedoptions).[`tenantResolver`](#tenantresolver-2)

##### trackedModels?

```ts
optional trackedModels?: string[];
```

Defined in: [src/prisma/audit-extension.ts:37](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/prisma/audit-extension.ts#L37)

***

### AuditGetByIdOptions

Defined in: [src/interfaces/audit-entry.interface.ts:42](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L42)

#### Properties

##### allTenants?

```ts
optional allTenants?: boolean;
```

Defined in: [src/interfaces/audit-entry.interface.ts:44](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L44)

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:43](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L43)

***

### AuditLogger

Defined in: [src/interfaces/audit-shared-options.interface.ts:2](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L2)

Minimal logger compatible with console and NestJS LoggerService.

#### Methods

##### error()

```ts
error(message): void;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L4)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

###### Returns

`void`

##### warn()

```ts
warn(message): void;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L3)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

###### Returns

`void`

***

### AuditLogModuleAsyncOptions

Defined in: [src/interfaces/audit-log-options.interface.ts:19](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-log-options.interface.ts#L19)

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

Defined in: [src/interfaces/audit-log-options.interface.ts:24](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-log-options.interface.ts#L24)

##### useFactory

```ts
useFactory: (...args) => 
  | AuditLogModuleOptions
| Promise<AuditLogModuleOptions>;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:21](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-log-options.interface.ts#L21)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`AuditLogModuleOptions`](#auditlogmoduleoptions)
  \| `Promise`\<[`AuditLogModuleOptions`](#auditlogmoduleoptions)\>

***

### AuditLogModuleOptions

Defined in: [src/interfaces/audit-log-options.interface.ts:7](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-log-options.interface.ts#L7)

Options shared by the Nest module and Prisma extension.
Runtime merging is intentionally not performed; pass the same object to both
call sites when both paths should share behavior.

#### Extends

- [`AuditSharedOptions`](#auditsharedoptions)

#### Properties

##### actorExtractor

```ts
actorExtractor: ActorExtractor;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:9](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-log-options.interface.ts#L9)

##### correlationIdGetter?

```ts
optional correlationIdGetter?: (req) => string | undefined;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:16](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-log-options.interface.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `any` |

###### Returns

`string` \| `undefined`

##### correlationIdHeader?

```ts
optional correlationIdHeader?: string;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:15](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-log-options.interface.ts#L15)

##### excludeRoutes?

```ts
optional excludeRoutes?: RouteInfo[];
```

Defined in: [src/interfaces/audit-log-options.interface.ts:13](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-log-options.interface.ts#L13)

##### logger?

```ts
optional logger?: AuditLogger;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:33](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L33)

###### Inherited from

[`AuditSharedOptions`](#auditsharedoptions).[`logger`](#logger-2)

##### onAuditError?

```ts
optional onAuditError?: (error, ctx) => void;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:32](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L32)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |
| `ctx` | [`AuditErrorContext`](#auditerrorcontext) |

###### Returns

`void`

###### Inherited from

[`AuditSharedOptions`](#auditsharedoptions).[`onAuditError`](#onauditerror-2)

##### prisma

```ts
prisma: any;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:8](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-log-options.interface.ts#L8)

##### prismaModule?

```ts
optional prismaModule?: PrismaModuleLike;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:10](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-log-options.interface.ts#L10)

##### registerGlobalInterceptor?

```ts
optional registerGlobalInterceptor?: boolean;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:14](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-log-options.interface.ts#L14)

##### sensitiveFields?

```ts
optional sensitiveFields?: string[];
```

Defined in: [src/interfaces/audit-log-options.interface.ts:11](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-log-options.interface.ts#L11)

##### sensitiveFieldsByModel?

```ts
optional sensitiveFieldsByModel?: Record<string, string[]>;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:12](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-log-options.interface.ts#L12)

##### tableName?

```ts
optional tableName?: string;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:29](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L29)

###### Inherited from

[`AuditSharedOptions`](#auditsharedoptions).[`tableName`](#tablename-2)

##### tenantRequired?

```ts
optional tenantRequired?: boolean;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:30](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L30)

###### Inherited from

[`AuditSharedOptions`](#auditsharedoptions).[`tenantRequired`](#tenantrequired-2)

##### tenantResolver?

```ts
optional tenantResolver?: () => string | null;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:31](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L31)

###### Returns

`string` \| `null`

###### Inherited from

[`AuditSharedOptions`](#auditsharedoptions).[`tenantResolver`](#tenantresolver-2)

***

### AuditPruneOptions

Defined in: [src/services/audit.service.ts:30](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L30)

#### Properties

##### client?

```ts
optional client?: any;
```

Defined in: [src/services/audit.service.ts:34](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L34)

##### dryRun?

```ts
optional dryRun?: boolean;
```

Defined in: [src/services/audit.service.ts:33](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L33)

##### maxWaitMs?

```ts
optional maxWaitMs?: number;
```

Defined in: [src/services/audit.service.ts:36](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L36)

##### mode?

```ts
optional mode?: "drop" | "detach";
```

Defined in: [src/services/audit.service.ts:32](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L32)

##### olderThan

```ts
olderThan: Date;
```

Defined in: [src/services/audit.service.ts:31](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L31)

##### timeoutMs?

```ts
optional timeoutMs?: number;
```

Defined in: [src/services/audit.service.ts:35](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L35)

***

### AuditPruneResult

Defined in: [src/services/audit.service.ts:39](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L39)

#### Properties

##### deletedRows

```ts
deletedRows: number | null;
```

Defined in: [src/services/audit.service.ts:43](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L43)

##### dryRun

```ts
dryRun: boolean;
```

Defined in: [src/services/audit.service.ts:44](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L44)

##### layout

```ts
layout: "flat" | "partitioned";
```

Defined in: [src/services/audit.service.ts:40](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L40)

##### mode

```ts
mode: "drop" | "detach" | "delete";
```

Defined in: [src/services/audit.service.ts:41](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L41)

##### prunedPartitions

```ts
prunedPartitions: string[];
```

Defined in: [src/services/audit.service.ts:42](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit.service.ts#L42)

***

### AuditQueryOptions

Defined in: [src/interfaces/audit-entry.interface.ts:17](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L17)

#### Properties

##### action?

```ts
optional action?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:20](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L20)

##### actorId?

```ts
optional actorId?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:18](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L18)

##### actorType?

```ts
optional actorType?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:19](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L19)

##### allTenants?

```ts
optional allTenants?: boolean;
```

Defined in: [src/interfaces/audit-entry.interface.ts:30](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L30)

##### cursor?

```ts
optional cursor?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:31](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L31)

##### from?

```ts
optional from?: Date;
```

Defined in: [src/interfaces/audit-entry.interface.ts:25](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L25)

##### includeTotal?

```ts
optional includeTotal?: boolean;
```

Defined in: [src/interfaces/audit-entry.interface.ts:32](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L32)

##### limit?

```ts
optional limit?: number;
```

Defined in: [src/interfaces/audit-entry.interface.ts:27](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L27)

##### offset?

```ts
optional offset?: number;
```

Defined in: [src/interfaces/audit-entry.interface.ts:28](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L28)

##### result?

```ts
optional result?: "success" | "failure";
```

Defined in: [src/interfaces/audit-entry.interface.ts:24](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L24)

##### source?

```ts
optional source?: "auto" | "manual";
```

Defined in: [src/interfaces/audit-entry.interface.ts:23](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L23)

##### targetId?

```ts
optional targetId?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:22](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L22)

##### targetType?

```ts
optional targetType?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:21](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L21)

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:29](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L29)

##### to?

```ts
optional to?: Date;
```

Defined in: [src/interfaces/audit-entry.interface.ts:26](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L26)

***

### AuditQueryResult

Defined in: [src/interfaces/audit-entry.interface.ts:35](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L35)

#### Properties

##### entries

```ts
entries: AuditEntry[];
```

Defined in: [src/interfaces/audit-entry.interface.ts:36](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L36)

##### hasMore

```ts
hasMore: boolean;
```

Defined in: [src/interfaces/audit-entry.interface.ts:39](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L39)

##### nextCursor

```ts
nextCursor: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:38](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L38)

##### total?

```ts
optional total?: number;
```

Defined in: [src/interfaces/audit-entry.interface.ts:37](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L37)

***

### AuditSharedOptions

Defined in: [src/interfaces/audit-shared-options.interface.ts:28](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L28)

Options shared by the Nest module and Prisma extension.
Runtime merging is intentionally not performed; pass the same object to both
call sites when both paths should share behavior.

#### Extended by

- [`AuditExtensionOptions`](#auditextensionoptions)
- [`AuditLogModuleOptions`](#auditlogmoduleoptions)

#### Properties

##### logger?

```ts
optional logger?: AuditLogger;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:33](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L33)

##### onAuditError?

```ts
optional onAuditError?: (error, ctx) => void;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:32](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L32)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |
| `ctx` | [`AuditErrorContext`](#auditerrorcontext) |

###### Returns

`void`

##### tableName?

```ts
optional tableName?: string;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:29](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L29)

##### tenantRequired?

```ts
optional tenantRequired?: boolean;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:30](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L30)

##### tenantResolver?

```ts
optional tenantResolver?: () => string | null;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:31](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L31)

###### Returns

`string` \| `null`

***

### AuditTableSQLOptions

Defined in: [src/sql/index.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/sql/index.ts#L3)

#### Properties

##### enforcement?

```ts
optional enforcement?: "trigger" | "rule";
```

Defined in: [src/sql/index.ts:6](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/sql/index.ts#L6)

##### ginIndex?

```ts
optional ginIndex?: boolean;
```

Defined in: [src/sql/index.ts:7](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/sql/index.ts#L7)

##### partitioned?

```ts
optional partitioned?: boolean;
```

Defined in: [src/sql/index.ts:5](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/sql/index.ts#L5)

##### tableName?

```ts
optional tableName?: string;
```

Defined in: [src/sql/index.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/sql/index.ts#L4)

***

### EnsurePartitionsOptions

Defined in: [src/sql/index.ts:10](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/sql/index.ts#L10)

#### Properties

##### ahead?

```ts
optional ahead?: number;
```

Defined in: [src/sql/index.ts:12](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/sql/index.ts#L12)

##### tableName?

```ts
optional tableName?: string;
```

Defined in: [src/sql/index.ts:11](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/sql/index.ts#L11)

***

### ManualAuditLogInput

Defined in: [src/interfaces/audit-entry.interface.ts:47](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L47)

#### Properties

##### action

```ts
action: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:48](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L48)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/audit-entry.interface.ts:51](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L51)

##### result?

```ts
optional result?: "success" | "failure";
```

Defined in: [src/interfaces/audit-entry.interface.ts:52](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L52)

##### targetId?

```ts
optional targetId?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:49](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L49)

##### targetType?

```ts
optional targetType?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:50](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-entry.interface.ts#L50)

***

### PrismaModuleLike

Defined in: [src/prisma/prisma-namespace.ts:1](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/prisma/prisma-namespace.ts#L1)

#### Properties

##### Prisma

```ts
Prisma: {
  defineExtension: (extension) => any;
  dmmf?: {
     datamodel?: {
        models?: readonly {
           fields?: readonly {
              isUpdatedAt?: ...;
              kind?: ...;
              name: ...;
           }[];
           kind?: string;
           name: string;
        }[];
     };
  };
  empty?: unknown;
  join?: (values, separator?, prefix?, suffix?) => unknown;
  raw?: (value) => unknown;
  sql?: (strings, ...values) => unknown;
};
```

Defined in: [src/prisma/prisma-namespace.ts:2](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/prisma/prisma-namespace.ts#L2)

###### defineExtension

```ts
defineExtension: (extension) => any;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `extension` | `any` |

###### Returns

`any`

###### dmmf?

```ts
optional dmmf?: {
  datamodel?: {
     models?: readonly {
        fields?: readonly {
           isUpdatedAt?: ...;
           kind?: ...;
           name: ...;
        }[];
        kind?: string;
        name: string;
     }[];
  };
};
```

###### dmmf.datamodel?

```ts
optional datamodel?: {
  models?: readonly {
     fields?: readonly {
        isUpdatedAt?: ...;
        kind?: ...;
        name: ...;
     }[];
     kind?: string;
     name: string;
  }[];
};
```

###### dmmf.datamodel.models?

```ts
optional models?: readonly {
  fields?: readonly {
     isUpdatedAt?: ...;
     kind?: ...;
     name: ...;
  }[];
  kind?: string;
  name: string;
}[];
```

###### empty?

```ts
optional empty?: unknown;
```

###### join?

```ts
optional join?: (values, separator?, prefix?, suffix?) => unknown;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `values` | readonly `any`[] |
| `separator?` | `string` |
| `prefix?` | `string` |
| `suffix?` | `string` |

###### Returns

`unknown`

###### raw?

```ts
optional raw?: (value) => unknown;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

###### Returns

`unknown`

###### sql?

```ts
optional sql?: (strings, ...values) => unknown;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `strings` | `TemplateStringsArray` \| readonly `string`[] |
| ...`values` | `any`[] |

###### Returns

`unknown`

## Type Aliases

### ActorExtractor

```ts
type ActorExtractor = (req) => AuditActor | Promise<AuditActor>;
```

Defined in: [src/interfaces/actor.interface.ts:7](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/actor.interface.ts#L7)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `any` |

#### Returns

[`AuditActor`](#auditactor) \| `Promise`\<[`AuditActor`](#auditactor)\>

***

### AuditErrorPhase

```ts
type AuditErrorPhase = "pre-read" | "insert" | "post-read" | "tenant-resolution" | "context";
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:7](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/interfaces/audit-shared-options.interface.ts#L7)

## Variables

### AUDIT\_ACTION\_KEY

```ts
const AUDIT_ACTION_KEY: "AUDIT_ACTION" = 'AUDIT_ACTION';
```

Defined in: [src/decorators/audit-action.decorator.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/decorators/audit-action.decorator.ts#L3)

***

### AUDIT\_LOG\_OPTIONS

```ts
const AUDIT_LOG_OPTIONS: typeof AUDIT_LOG_OPTIONS;
```

Defined in: [src/audit-log.constants.ts:1](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/audit-log.constants.ts#L1)

***

### AUDIT\_REASON\_KEY

```ts
const AUDIT_REASON_KEY: "AUDIT_REASON" = 'AUDIT_REASON';
```

Defined in: [src/decorators/audit-reason.decorator.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/decorators/audit-reason.decorator.ts#L3)

***

### NO\_AUDIT\_KEY

```ts
const NO_AUDIT_KEY: "NO_AUDIT" = 'NO_AUDIT';
```

Defined in: [src/decorators/no-audit.decorator.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/decorators/no-audit.decorator.ts#L3)

## Functions

### applyAuditTableSchema()

```ts
function applyAuditTableSchema(prisma, options?): Promise<void>;
```

Defined in: [src/sql/index.ts:251](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/sql/index.ts#L251)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prisma` | `any` |
| `options` | [`AuditTableSQLOptions`](#audittablesqloptions) |

#### Returns

`Promise`\<`void`\>

***

### AuditAction()

```ts
function AuditAction(action): CustomDecorator<string>;
```

Defined in: [src/decorators/audit-action.decorator.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/decorators/audit-action.decorator.ts#L4)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `action` | `string` |

#### Returns

`CustomDecorator`\<`string`\>

***

### AuditReason()

```ts
function AuditReason(reason): CustomDecorator<string>;
```

Defined in: [src/decorators/audit-reason.decorator.ts:5](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/decorators/audit-reason.decorator.ts#L5)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `reason` | `string` |

#### Returns

`CustomDecorator`\<`string`\>

***

### createAuditExtension()

```ts
function createAuditExtension(options): any;
```

Defined in: [src/prisma/audit-extension.ts:691](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/prisma/audit-extension.ts#L691)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditExtensionOptions`](#auditextensionoptions) |

#### Returns

`any`

***

### ensurePartitions()

```ts
function ensurePartitions(prisma, options?): Promise<string[]>;
```

Defined in: [src/sql/index.ts:284](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/sql/index.ts#L284)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prisma` | `any` |
| `options` | [`EnsurePartitionsOptions`](#ensurepartitionsoptions) |

#### Returns

`Promise`\<`string`[]\>

***

### getAuditTableSQL()

```ts
function getAuditTableSQL(options?): string;
```

Defined in: [src/sql/index.ts:236](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/sql/index.ts#L236)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditTableSQLOptions`](#audittablesqloptions) |

#### Returns

`string`

***

### getAuditTableStatements()

```ts
function getAuditTableStatements(options?): string[];
```

Defined in: [src/sql/index.ts:217](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/sql/index.ts#L217)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditTableSQLOptions`](#audittablesqloptions) |

#### Returns

`string`[]

***

### mergeContextMetadata()

```ts
function mergeContextMetadata(input?): Record<string, unknown> | undefined;
```

Defined in: [src/services/audit-context.ts:63](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/services/audit-context.ts#L63)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input?` | `Record`\<`string`, `unknown`\> |

#### Returns

`Record`\<`string`, `unknown`\> \| `undefined`

***

### NoAudit()

```ts
function NoAudit(): CustomDecorator<string>;
```

Defined in: [src/decorators/no-audit.decorator.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/9597a73287ab57aef83d7f77f9a08343dfb8c893/src/decorators/no-audit.decorator.ts#L4)

#### Returns

`CustomDecorator`\<`string`\>
