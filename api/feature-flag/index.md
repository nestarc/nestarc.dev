# index

## Classes

### FeatureFlagGuard

Defined in: [src/guards/feature-flag.guard.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/guards/feature-flag.guard.ts#L12)

#### Implements

- `CanActivate`

#### Constructors

##### Constructor

```ts
new FeatureFlagGuard(reflector, featureFlagService): FeatureFlagGuard;
```

Defined in: [src/guards/feature-flag.guard.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/guards/feature-flag.guard.ts#L13)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `reflector` | `Reflector` |
| `featureFlagService` | [`FeatureFlagService`](#featureflagservice) |

###### Returns

[`FeatureFlagGuard`](#featureflagguard)

#### Methods

##### canActivate()

```ts
canActivate(context): Promise<boolean>;
```

Defined in: [src/guards/feature-flag.guard.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/guards/feature-flag.guard.ts#L18)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `ExecutionContext` | Current execution context. Provides access to details about the current request pipeline. |

###### Returns

`Promise`\<`boolean`\>

Value indicating whether or not the current request is allowed to
proceed.

###### Implementation of

```ts
CanActivate.canActivate
```

***

### FeatureFlagModule

Defined in: [src/feature-flag.module.ts:44](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/feature-flag.module.ts#L44)

#### Implements

- `NestModule`

#### Constructors

##### Constructor

```ts
new FeatureFlagModule(): FeatureFlagModule;
```

###### Returns

[`FeatureFlagModule`](#featureflagmodule)

#### Methods

##### configure()

```ts
configure(consumer): void;
```

Defined in: [src/feature-flag.module.ts:45](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/feature-flag.module.ts#L45)

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

Defined in: [src/feature-flag.module.ts:51](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/feature-flag.module.ts#L51)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`FeatureFlagModuleRootOptions`](#featureflagmodulerootoptions) |

###### Returns

`DynamicModule`

##### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [src/feature-flag.module.ts:77](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/feature-flag.module.ts#L77)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`FeatureFlagModuleRootAsyncOptions`](#featureflagmodulerootasyncoptions) |

###### Returns

`DynamicModule`

***

### FeatureFlagService

Defined in: [src/services/feature-flag.service.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/services/feature-flag.service.ts#L18)

#### Constructors

##### Constructor

```ts
new FeatureFlagService(
   options, 
   prisma, 
   cache, 
   evaluator, 
   flagContext, 
   moduleRef, 
   eventEmitter?): FeatureFlagService;
```

Defined in: [src/services/feature-flag.service.ts:19](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/services/feature-flag.service.ts#L19)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`FeatureFlagModuleOptions`](#featureflagmoduleoptions) |
| `prisma` | `any` |
| `cache` | `FlagCacheService` |
| `evaluator` | `FlagEvaluatorService` |
| `flagContext` | [`FlagContext`](#flagcontext) |
| `moduleRef` | `ModuleRef` |
| `eventEmitter?` | `any` |

###### Returns

[`FeatureFlagService`](#featureflagservice)

#### Methods

##### archive()

```ts
archive(key): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/services/feature-flag.service.ts:108](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/services/feature-flag.service.ts#L108)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

##### create()

```ts
create(input): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/services/feature-flag.service.ts:66](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/services/feature-flag.service.ts#L66)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`CreateFeatureFlagInput`](#createfeatureflaginput) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

##### evaluateAll()

```ts
evaluateAll(explicitContext?): Promise<Record<string, boolean>>;
```

Defined in: [src/services/feature-flag.service.ts:54](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/services/feature-flag.service.ts#L54)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `explicitContext?` | [`EvaluationContext`](#evaluationcontext) |

###### Returns

`Promise`\<`Record`\<`string`, `boolean`\>\>

##### findAll()

```ts
findAll(): Promise<FeatureFlagWithOverrides[]>;
```

Defined in: [src/services/feature-flag.service.ts:161](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/services/feature-flag.service.ts#L161)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)[]\>

##### invalidateCache()

```ts
invalidateCache(): void;
```

Defined in: [src/services/feature-flag.service.ts:169](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/services/feature-flag.service.ts#L169)

###### Returns

`void`

##### isEnabled()

```ts
isEnabled(flagKey, explicitContext?): Promise<boolean>;
```

Defined in: [src/services/feature-flag.service.ts:29](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/services/feature-flag.service.ts#L29)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `string` |
| `explicitContext?` | [`EvaluationContext`](#evaluationcontext) |

###### Returns

`Promise`\<`boolean`\>

##### setOverride()

```ts
setOverride(key, input): Promise<void>;
```

Defined in: [src/services/feature-flag.service.ts:124](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/services/feature-flag.service.ts#L124)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `input` | [`SetOverrideInput`](#setoverrideinput) |

###### Returns

`Promise`\<`void`\>

##### update()

```ts
update(key, input): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/services/feature-flag.service.ts:87](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/services/feature-flag.service.ts#L87)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `input` | [`UpdateFeatureFlagInput`](#updatefeatureflaginput) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

***

### FlagContext

Defined in: [src/services/flag-context.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/services/flag-context.ts#L9)

#### Constructors

##### Constructor

```ts
new FlagContext(): FlagContext;
```

###### Returns

[`FlagContext`](#flagcontext)

#### Methods

##### getUserId()

```ts
getUserId(): string | null;
```

Defined in: [src/services/flag-context.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/services/flag-context.ts#L16)

###### Returns

`string` \| `null`

##### run()

```ts
run<T>(store, callback): T;
```

Defined in: [src/services/flag-context.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/services/flag-context.ts#L12)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `store` | `FlagStore` |
| `callback` | () => `T` |

###### Returns

`T`

## Interfaces

### CreateFeatureFlagInput

Defined in: [src/interfaces/feature-flag.interface.ts:1](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L1)

#### Properties

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L3)

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L4)

##### key

```ts
key: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:2](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L2)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L6)

##### percentage?

```ts
optional percentage?: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L5)

***

### EvaluationContext

Defined in: [src/interfaces/evaluation-context.interface.ts:1](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/evaluation-context.interface.ts#L1)

#### Properties

##### environment?

```ts
optional environment?: string;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/evaluation-context.interface.ts#L9)

Environment — auto-injected from module options. Can be explicitly overridden

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/evaluation-context.interface.ts#L6)

Tenant ID — used for tenant overrides. Ignored if tenancy is not installed

##### userId?

```ts
optional userId?: string | null;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/evaluation-context.interface.ts#L3)

User ID — used for user overrides and percentage hash

***

### FeatureFlagGuardOptions

Defined in: [src/interfaces/feature-flag.interface.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L23)

#### Properties

##### fallback?

```ts
optional fallback?: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L28)

Response body when flag is OFF

##### statusCode?

```ts
optional statusCode?: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:25](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L25)

HTTP status code when flag is OFF. Default: 403

***

### FeatureFlagModuleAsyncOptions

Defined in: [src/interfaces/feature-flag-options.interface.ts:27](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L27)

#### Extends

- `Pick`\<`ModuleMetadata`, `"imports"`\>

#### Extended by

- [`FeatureFlagModuleRootAsyncOptions`](#featureflagmodulerootasyncoptions)

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

Defined in: [src/interfaces/feature-flag-options.interface.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L28)

##### useClass?

```ts
optional useClass?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:30](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L30)

##### useExisting?

```ts
optional useExisting?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L31)

##### useFactory?

```ts
optional useFactory?: (...args) => 
  | FeatureFlagModuleOptions
| Promise<FeatureFlagModuleOptions>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:29](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L29)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`FeatureFlagModuleOptions`](#featureflagmoduleoptions)
  \| `Promise`\<[`FeatureFlagModuleOptions`](#featureflagmoduleoptions)\>

***

### FeatureFlagModuleOptions

Defined in: [src/interfaces/feature-flag-options.interface.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L4)

#### Extended by

- [`FeatureFlagModuleRootOptions`](#featureflagmodulerootoptions)

#### Properties

##### cacheTtlMs?

```ts
optional cacheTtlMs?: number;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L9)

Cache TTL in milliseconds. 0 disables caching. Default: 30000

##### defaultOnMissing?

```ts
optional defaultOnMissing?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L15)

Default value when evaluating a non-existent flag. Default: false

##### emitEvents?

```ts
optional emitEvents?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L18)

Emit evaluation events via @nestjs/event-emitter. Default: false

##### environment

```ts
environment: string;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L6)

Current environment (e.g., 'development', 'staging', 'production')

##### userIdExtractor?

```ts
optional userIdExtractor?: (req) => string | null;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L12)

Extract user ID from request. Returns null if user is not authenticated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `Request` |

###### Returns

`string` \| `null`

***

### FeatureFlagModuleOptionsFactory

Defined in: [src/interfaces/feature-flag-options.interface.ts:21](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L21)

#### Methods

##### createFeatureFlagOptions()

```ts
createFeatureFlagOptions(): 
  | Promise<FeatureFlagModuleOptions & {
  prisma: any;
}>
  | FeatureFlagModuleOptions & {
  prisma: any;
};
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L22)

###### Returns

  \| `Promise`\<[`FeatureFlagModuleOptions`](#featureflagmoduleoptions) & \{
  `prisma`: `any`;
\}\>
  \| [`FeatureFlagModuleOptions`](#featureflagmoduleoptions) & \{
  `prisma`: `any`;
\}

***

### FeatureFlagModuleRootAsyncOptions

Defined in: [src/feature-flag.module.ts:27](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/feature-flag.module.ts#L27)

#### Extends

- [`FeatureFlagModuleAsyncOptions`](#featureflagmoduleasyncoptions)

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

[`FeatureFlagModuleAsyncOptions`](#featureflagmoduleasyncoptions).[`imports`](#imports)

##### inject?

```ts
optional inject?: any[];
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L28)

###### Inherited from

[`FeatureFlagModuleAsyncOptions`](#featureflagmoduleasyncoptions).[`inject`](#inject)

##### useClass?

```ts
optional useClass?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:30](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L30)

###### Inherited from

[`FeatureFlagModuleAsyncOptions`](#featureflagmoduleasyncoptions).[`useClass`](#useclass)

##### useExisting?

```ts
optional useExisting?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L31)

###### Inherited from

[`FeatureFlagModuleAsyncOptions`](#featureflagmoduleasyncoptions).[`useExisting`](#useexisting)

##### useFactory?

```ts
optional useFactory?: (...args) => 
  | FeatureFlagModuleRootOptions
| Promise<FeatureFlagModuleRootOptions>;
```

Defined in: [src/feature-flag.module.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/feature-flag.module.ts#L28)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`FeatureFlagModuleRootOptions`](#featureflagmodulerootoptions)
  \| `Promise`\<[`FeatureFlagModuleRootOptions`](#featureflagmodulerootoptions)\>

###### Overrides

[`FeatureFlagModuleAsyncOptions`](#featureflagmoduleasyncoptions).[`useFactory`](#usefactory)

***

### FeatureFlagModuleRootOptions

Defined in: [src/feature-flag.module.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/feature-flag.module.ts#L23)

#### Extends

- [`FeatureFlagModuleOptions`](#featureflagmoduleoptions)

#### Properties

##### cacheTtlMs?

```ts
optional cacheTtlMs?: number;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L9)

Cache TTL in milliseconds. 0 disables caching. Default: 30000

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`cacheTtlMs`](#cachettlms)

##### defaultOnMissing?

```ts
optional defaultOnMissing?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L15)

Default value when evaluating a non-existent flag. Default: false

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`defaultOnMissing`](#defaultonmissing)

##### emitEvents?

```ts
optional emitEvents?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L18)

Emit evaluation events via @nestjs/event-emitter. Default: false

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`emitEvents`](#emitevents)

##### environment

```ts
environment: string;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L6)

Current environment (e.g., 'development', 'staging', 'production')

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`environment`](#environment-1)

##### prisma

```ts
prisma: any;
```

Defined in: [src/feature-flag.module.ts:24](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/feature-flag.module.ts#L24)

##### userIdExtractor?

```ts
optional userIdExtractor?: (req) => string | null;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag-options.interface.ts#L12)

Extract user ID from request. Returns null if user is not authenticated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `Request` |

###### Returns

`string` \| `null`

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`userIdExtractor`](#useridextractor)

***

### FeatureFlagWithOverrides

Defined in: [src/interfaces/feature-flag.interface.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L31)

#### Properties

##### archivedAt

```ts
archivedAt: Date | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:38](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L38)

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/feature-flag.interface.ts:39](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L39)

##### description

```ts
description: string | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:34](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L34)

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:35](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L35)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:32](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L32)

##### key

```ts
key: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:33](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L33)

##### metadata

```ts
metadata: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:37](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L37)

##### overrides

```ts
overrides: FlagOverride[];
```

Defined in: [src/interfaces/feature-flag.interface.ts:41](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L41)

##### percentage

```ts
percentage: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L36)

##### updatedAt

```ts
updatedAt: Date;
```

Defined in: [src/interfaces/feature-flag.interface.ts:40](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L40)

***

### FlagEvaluatedEvent

Defined in: [src/events/feature-flag.events.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L13)

#### Properties

##### context

```ts
context: EvaluationContext;
```

Defined in: [src/events/feature-flag.events.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L16)

##### evaluationTimeMs

```ts
evaluationTimeMs: number;
```

Defined in: [src/events/feature-flag.events.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L18)

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/events/feature-flag.events.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L14)

##### result

```ts
result: boolean;
```

Defined in: [src/events/feature-flag.events.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L15)

##### source

```ts
source: 
  | "user_override"
  | "tenant_override"
  | "env_override"
  | "percentage"
  | "global";
```

Defined in: [src/events/feature-flag.events.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L17)

***

### FlagMutationEvent

Defined in: [src/events/feature-flag.events.ts:21](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L21)

#### Properties

##### action

```ts
action: "created" | "updated" | "archived";
```

Defined in: [src/events/feature-flag.events.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L23)

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/events/feature-flag.events.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L22)

***

### FlagOverride

Defined in: [src/interfaces/feature-flag.interface.ts:44](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L44)

#### Properties

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:50](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L50)

##### environment

```ts
environment: string | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:49](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L49)

##### flagId

```ts
flagId: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:46](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L46)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:45](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L45)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:47](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L47)

##### userId

```ts
userId: string | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:48](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L48)

***

### FlagOverrideEvent

Defined in: [src/events/feature-flag.events.ts:26](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L26)

#### Properties

##### action

```ts
action: "set" | "removed";
```

Defined in: [src/events/feature-flag.events.ts:32](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L32)

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/events/feature-flag.events.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L31)

##### environment?

```ts
optional environment?: string | null;
```

Defined in: [src/events/feature-flag.events.ts:30](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L30)

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/events/feature-flag.events.ts:27](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L27)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/events/feature-flag.events.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L28)

##### userId?

```ts
optional userId?: string | null;
```

Defined in: [src/events/feature-flag.events.ts:29](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L29)

***

### SetOverrideInput

Defined in: [src/interfaces/feature-flag.interface.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L16)

#### Properties

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L20)

##### environment?

```ts
optional environment?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:19](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L19)

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L17)

##### userId?

```ts
optional userId?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L18)

***

### UpdateFeatureFlagInput

Defined in: [src/interfaces/feature-flag.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L9)

#### Properties

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L10)

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L11)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L13)

##### percentage?

```ts
optional percentage?: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/interfaces/feature-flag.interface.ts#L12)

## Variables

### FEATURE\_FLAG\_MODULE\_OPTIONS

```ts
const FEATURE_FLAG_MODULE_OPTIONS: typeof FEATURE_FLAG_MODULE_OPTIONS;
```

Defined in: [src/feature-flag.constants.ts:1](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/feature-flag.constants.ts#L1)

***

### FeatureFlagEvents

```ts
const FeatureFlagEvents: {
  ARCHIVED: "feature-flag.archived";
  CACHE_INVALIDATED: "feature-flag.cache.invalidated";
  CREATED: "feature-flag.created";
  EVALUATED: "feature-flag.evaluated";
  OVERRIDE_REMOVED: "feature-flag.override.removed";
  OVERRIDE_SET: "feature-flag.override.set";
  UPDATED: "feature-flag.updated";
};
```

Defined in: [src/events/feature-flag.events.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L3)

#### Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-archived"></a> `ARCHIVED` | `"feature-flag.archived"` | `'feature-flag.archived'` | [src/events/feature-flag.events.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L7) |
| <a id="property-cache_invalidated"></a> `CACHE_INVALIDATED` | `"feature-flag.cache.invalidated"` | `'feature-flag.cache.invalidated'` | [src/events/feature-flag.events.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L10) |
| <a id="property-created"></a> `CREATED` | `"feature-flag.created"` | `'feature-flag.created'` | [src/events/feature-flag.events.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L5) |
| <a id="property-evaluated"></a> `EVALUATED` | `"feature-flag.evaluated"` | `'feature-flag.evaluated'` | [src/events/feature-flag.events.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L4) |
| <a id="property-override_removed"></a> `OVERRIDE_REMOVED` | `"feature-flag.override.removed"` | `'feature-flag.override.removed'` | [src/events/feature-flag.events.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L9) |
| <a id="property-override_set"></a> `OVERRIDE_SET` | `"feature-flag.override.set"` | `'feature-flag.override.set'` | [src/events/feature-flag.events.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L8) |
| <a id="property-updated"></a> `UPDATED` | `"feature-flag.updated"` | `'feature-flag.updated'` | [src/events/feature-flag.events.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/events/feature-flag.events.ts#L6) |

## Functions

### BypassFeatureFlag()

```ts
function BypassFeatureFlag(): CustomDecorator<string>;
```

Defined in: [src/decorators/bypass-feature-flag.decorator.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/decorators/bypass-feature-flag.decorator.ts#L4)

#### Returns

`CustomDecorator`\<`string`\>

***

### FeatureFlag()

```ts
function FeatureFlag(flagKey, options?): ClassDecorator & MethodDecorator;
```

Defined in: [src/decorators/feature-flag.decorator.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/decorators/feature-flag.decorator.ts#L6)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `string` |
| `options` | [`FeatureFlagGuardOptions`](#featureflagguardoptions) |

#### Returns

`ClassDecorator` & `MethodDecorator`
