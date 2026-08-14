# @nestarc/feature-flag

## Classes

### FeatureFlagAdminModule

Defined in: [src/admin/feature-flag-admin.module.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/admin/feature-flag-admin.module.ts#L6)

#### Constructors

##### Constructor

```ts
new FeatureFlagAdminModule(): FeatureFlagAdminModule;
```

###### Returns

[`FeatureFlagAdminModule`](#featureflagadminmodule)

#### Methods

##### register()

```ts
static register(options): DynamicModule;
```

Defined in: [src/admin/feature-flag-admin.module.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/admin/feature-flag-admin.module.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`FeatureFlagAdminOptions`](#featureflagadminoptions) |

###### Returns

`DynamicModule`

***

### FeatureFlagGuard

Defined in: [src/guards/feature-flag.guard.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/guards/feature-flag.guard.ts#L12)

#### Implements

- `CanActivate`

#### Constructors

##### Constructor

```ts
new FeatureFlagGuard(reflector, featureFlagService): FeatureFlagGuard;
```

Defined in: [src/guards/feature-flag.guard.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/guards/feature-flag.guard.ts#L13)

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

Defined in: [src/guards/feature-flag.guard.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/guards/feature-flag.guard.ts#L18)

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

Defined in: [src/feature-flag.module.ts:54](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.module.ts#L54)

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

Defined in: [src/feature-flag.module.ts:55](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.module.ts#L55)

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

Defined in: [src/feature-flag.module.ts:61](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.module.ts#L61)

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

Defined in: [src/feature-flag.module.ts:105](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.module.ts#L105)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`FeatureFlagModuleRootAsyncOptions`](#featureflagmodulerootasyncoptions) |

###### Returns

`DynamicModule`

***

### FeatureFlagService

Defined in: [src/services/feature-flag.service.ts:33](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L33)

#### Constructors

##### Constructor

```ts
new FeatureFlagService(
   options, 
   repository, 
   cacheAdapter, 
   evaluator, 
   contextResolver, 
   eventPublisher): FeatureFlagService;
```

Defined in: [src/services/feature-flag.service.ts:34](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L34)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`FeatureFlagModuleOptions`](#featureflagmoduleoptions) |
| `repository` | [`FeatureFlagRepository`](#featureflagrepository) |
| `cacheAdapter` | [`CacheAdapter`](#cacheadapter) |
| `evaluator` | `FlagEvaluatorService` |
| `contextResolver` | `FlagContextResolver` |
| `eventPublisher` | `FlagEventPublisher` |

###### Returns

[`FeatureFlagService`](#featureflagservice)

#### Methods

##### archive()

```ts
archive(key, metadata?): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/services/feature-flag.service.ts:139](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L139)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `metadata` | [`FlagMutationMetadata`](#flagmutationmetadata) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

##### create()

```ts
create(input, metadata?): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/services/feature-flag.service.ts:110](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L110)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`CreateFeatureFlagInput`](#createfeatureflaginput) |
| `metadata` | [`FlagMutationMetadata`](#flagmutationmetadata) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

##### evaluateAll()

```ts
evaluateAll(explicitContext?): Promise<Record<string, boolean>>;
```

Defined in: [src/services/feature-flag.service.ts:98](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L98)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `explicitContext?` | [`EvaluationContext`](#evaluationcontext) |

###### Returns

`Promise`\<`Record`\<`string`, `boolean`\>\>

##### evaluateBoolean()

```ts
evaluateBoolean(
   flagKey, 
   explicitContext?, 
evaluationOptions?): Promise<BooleanEvaluationDetails>;
```

Defined in: [src/services/feature-flag.service.ts:55](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L55)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `string` |
| `explicitContext?` | [`EvaluationContext`](#evaluationcontext) |
| `evaluationOptions?` | [`EvaluateBooleanOptions`](#evaluatebooleanoptions) |

###### Returns

`Promise`\<[`BooleanEvaluationDetails`](#booleanevaluationdetails)\>

##### findAll()

```ts
findAll(): Promise<FeatureFlagWithOverrides[]>;
```

Defined in: [src/services/feature-flag.service.ts:188](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L188)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)[]\>

##### findByKey()

```ts
findByKey(key): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/services/feature-flag.service.ts:197](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L197)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

##### invalidateCache()

```ts
invalidateCache(): Promise<void>;
```

Defined in: [src/services/feature-flag.service.ts:192](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L192)

###### Returns

`Promise`\<`void`\>

##### isEnabled()

```ts
isEnabled(
   flagKey, 
   explicitContext?, 
evaluationOptions?): Promise<boolean>;
```

Defined in: [src/services/feature-flag.service.ts:47](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L47)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `string` |
| `explicitContext?` | [`EvaluationContext`](#evaluationcontext) |
| `evaluationOptions?` | [`EvaluateBooleanOptions`](#evaluatebooleanoptions) |

###### Returns

`Promise`\<`boolean`\>

##### removeOverride()

```ts
removeOverride(
   key, 
   input, 
metadata?): Promise<void>;
```

Defined in: [src/services/feature-flag.service.ts:205](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L205)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `input` | [`RemoveOverrideInput`](#removeoverrideinput) |
| `metadata` | [`FlagMutationMetadata`](#flagmutationmetadata) |

###### Returns

`Promise`\<`void`\>

##### setOverride()

```ts
setOverride(
   key, 
   input, 
metadata?): Promise<void>;
```

Defined in: [src/services/feature-flag.service.ts:153](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L153)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `input` | [`SetOverrideInput`](#setoverrideinput) |
| `metadata` | [`FlagMutationMetadata`](#flagmutationmetadata) |

###### Returns

`Promise`\<`void`\>

##### update()

```ts
update(
   key, 
   input, 
metadata?): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/services/feature-flag.service.ts:124](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L124)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `input` | [`UpdateFeatureFlagInput`](#updatefeatureflaginput) |
| `metadata` | [`FlagMutationMetadata`](#flagmutationmetadata) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

***

### FlagContext

Defined in: [src/services/flag-context.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/flag-context.ts#L9)

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

Defined in: [src/services/flag-context.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/flag-context.ts#L16)

###### Returns

`string` \| `null`

##### run()

```ts
run<T>(store, callback): T;
```

Defined in: [src/services/flag-context.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/flag-context.ts#L12)

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

***

### MemoryCacheAdapter

Defined in: [src/cache/memory-cache.adapter.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/memory-cache.adapter.ts#L11)

#### Implements

- [`CacheAdapter`](#cacheadapter)

#### Constructors

##### Constructor

```ts
new MemoryCacheAdapter(): MemoryCacheAdapter;
```

###### Returns

[`MemoryCacheAdapter`](#memorycacheadapter)

#### Methods

##### get()

```ts
get(key): Promise<FeatureFlagWithOverrides | null>;
```

Defined in: [src/cache/memory-cache.adapter.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/memory-cache.adapter.ts#L15)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides) \| `null`\>

###### Implementation of

[`CacheAdapter`](#cacheadapter).[`get`](#get)

##### getAll()

```ts
getAll(): Promise<FeatureFlagWithOverrides[] | null>;
```

Defined in: [src/cache/memory-cache.adapter.ts:30](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/memory-cache.adapter.ts#L30)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)[] \| `null`\>

###### Implementation of

[`CacheAdapter`](#cacheadapter).[`getAll`](#getall)

##### invalidate()

```ts
invalidate(key?): Promise<void>;
```

Defined in: [src/cache/memory-cache.adapter.ts:44](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/memory-cache.adapter.ts#L44)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key?` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`CacheAdapter`](#cacheadapter).[`invalidate`](#invalidate)

##### set()

```ts
set(
   key, 
   data, 
ttlMs): Promise<void>;
```

Defined in: [src/cache/memory-cache.adapter.ts:25](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/memory-cache.adapter.ts#L25)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `data` | [`FeatureFlagWithOverrides`](#featureflagwithoverrides) |
| `ttlMs` | `number` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`CacheAdapter`](#cacheadapter).[`set`](#set)

##### setAll()

```ts
setAll(data, ttlMs): Promise<void>;
```

Defined in: [src/cache/memory-cache.adapter.ts:39](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/memory-cache.adapter.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`FeatureFlagWithOverrides`](#featureflagwithoverrides)[] |
| `ttlMs` | `number` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`CacheAdapter`](#cacheadapter).[`setAll`](#setall)

***

### PrismaFeatureFlagRepository

Defined in: [src/repositories/prisma-feature-flag.repository.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L28)

#### Implements

- [`FeatureFlagRepository`](#featureflagrepository)

#### Constructors

##### Constructor

```ts
new PrismaFeatureFlagRepository(prisma): PrismaFeatureFlagRepository;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:29](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L29)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `prisma` | `any` |

###### Returns

[`PrismaFeatureFlagRepository`](#prismafeatureflagrepository)

#### Methods

##### archiveFlag()

```ts
archiveFlag(key): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:80](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L80)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

###### Implementation of

[`FeatureFlagRepository`](#featureflagrepository).[`archiveFlag`](#archiveflag)

##### createFlag()

```ts
createFlag(input): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L31)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`CreateFeatureFlagInput`](#createfeatureflaginput) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

###### Implementation of

[`FeatureFlagRepository`](#featureflagrepository).[`createFlag`](#createflag)

##### createOverride()

```ts
createOverride(
   flagId, 
   criteria, 
   enabled, 
priority): Promise<void>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:125](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L125)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagId` | `string` |
| `criteria` | [`OverrideCriteria`](#overridecriteria) |
| `enabled` | `boolean` |
| `priority` | `number` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`FeatureFlagRepository`](#featureflagrepository).[`createOverride`](#createoverride)

##### deleteOverride()

```ts
deleteOverride(id): Promise<void>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:162](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L162)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`FeatureFlagRepository`](#featureflagrepository).[`deleteOverride`](#deleteoverride)

##### findAllActiveFlags()

```ts
findAllActiveFlags(): Promise<FeatureFlagWithOverrides[]>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:107](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L107)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)[]\>

###### Implementation of

[`FeatureFlagRepository`](#featureflagrepository).[`findAllActiveFlags`](#findallactiveflags)

##### findFlagByKey()

```ts
findFlagByKey(key): Promise<FeatureFlagWithOverrides | null>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:95](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L95)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides) \| `null`\>

###### Implementation of

[`FeatureFlagRepository`](#featureflagrepository).[`findFlagByKey`](#findflagbykey)

##### findFlagIdByKey()

```ts
findFlagIdByKey(key): Promise<string | null>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:102](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L102)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<`string` \| `null`\>

###### Implementation of

[`FeatureFlagRepository`](#featureflagrepository).[`findFlagIdByKey`](#findflagidbykey)

##### findOverride()

```ts
findOverride(flagId, criteria): Promise<
  | {
  id: string;
}
| null>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:115](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L115)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagId` | `string` |
| `criteria` | [`OverrideCriteria`](#overridecriteria) |

###### Returns

`Promise`\<
  \| \{
  `id`: `string`;
\}
  \| `null`\>

###### Implementation of

[`FeatureFlagRepository`](#featureflagrepository).[`findOverride`](#findoverride)

##### updateFlag()

```ts
updateFlag(key, input): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:56](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L56)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `input` | [`UpdateFeatureFlagInput`](#updatefeatureflaginput) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

###### Implementation of

[`FeatureFlagRepository`](#featureflagrepository).[`updateFlag`](#updateflag)

##### updateOverride()

```ts
updateOverride(id, input): Promise<void>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:152](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L152)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `input` | [`UpdateOverrideInput`](#updateoverrideinput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`FeatureFlagRepository`](#featureflagrepository).[`updateOverride`](#updateoverride)

***

### RedisCacheAdapter

Defined in: [src/cache/redis-cache.adapter.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L14)

#### Implements

- [`CacheAdapter`](#cacheadapter)

#### Constructors

##### Constructor

```ts
new RedisCacheAdapter(options): RedisCacheAdapter;
```

Defined in: [src/cache/redis-cache.adapter.ts:21](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L21)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RedisCacheAdapterOptions`](#rediscacheadapteroptions) |

###### Returns

[`RedisCacheAdapter`](#rediscacheadapter)

#### Methods

##### get()

```ts
get(key): Promise<FeatureFlagWithOverrides | null>;
```

Defined in: [src/cache/redis-cache.adapter.ts:50](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L50)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides) \| `null`\>

###### Implementation of

[`CacheAdapter`](#cacheadapter).[`get`](#get)

##### getAll()

```ts
getAll(): Promise<FeatureFlagWithOverrides[] | null>;
```

Defined in: [src/cache/redis-cache.adapter.ts:61](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L61)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)[] \| `null`\>

###### Implementation of

[`CacheAdapter`](#cacheadapter).[`getAll`](#getall)

##### invalidate()

```ts
invalidate(key?): Promise<void>;
```

Defined in: [src/cache/redis-cache.adapter.ts:72](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L72)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key?` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`CacheAdapter`](#cacheadapter).[`invalidate`](#invalidate)

##### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [src/cache/redis-cache.adapter.ts:83](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L83)

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`CacheAdapter`](#cacheadapter).[`onModuleDestroy`](#onmoduledestroy)

##### set()

```ts
set(
   key, 
   data, 
ttlMs): Promise<void>;
```

Defined in: [src/cache/redis-cache.adapter.ts:56](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L56)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `data` | [`FeatureFlagWithOverrides`](#featureflagwithoverrides) |
| `ttlMs` | `number` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`CacheAdapter`](#cacheadapter).[`set`](#set)

##### setAll()

```ts
setAll(data, ttlMs): Promise<void>;
```

Defined in: [src/cache/redis-cache.adapter.ts:67](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L67)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`FeatureFlagWithOverrides`](#featureflagwithoverrides)[] |
| `ttlMs` | `number` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`CacheAdapter`](#cacheadapter).[`setAll`](#setall)

## Interfaces

### BooleanEvaluationDetails

Defined in: [src/interfaces/evaluation-details.interface.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L31)

#### Properties

##### bucket?

```ts
optional bucket?: number;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:42](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L42)

##### defaultUsed

```ts
defaultUsed: boolean;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:38](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L38)

##### errorCode?

```ts
optional errorCode?: string;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:39](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L39)

##### errorMessage?

```ts
optional errorMessage?: string;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:40](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L40)

##### evaluationTimeMs?

```ts
optional evaluationTimeMs?: number;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:44](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L44)

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:32](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L32)

##### matchedOverrideId?

```ts
optional matchedOverrideId?: string;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:41](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L41)

##### reason

```ts
reason: EvaluationReason;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:37](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L37)

##### result

```ts
result: boolean;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:35](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L35)

Backward-compatible alias for value.

##### source

```ts
source: EvaluationSource;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L36)

##### targetingKey?

```ts
optional targetingKey?: string;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:43](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L43)

##### value

```ts
value: boolean;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:33](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L33)

***

### CacheAdapter

Defined in: [src/interfaces/cache-adapter.interface.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/cache-adapter.interface.ts#L3)

#### Methods

##### get()

```ts
get(key): Promise<FeatureFlagWithOverrides | null>;
```

Defined in: [src/interfaces/cache-adapter.interface.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/cache-adapter.interface.ts#L4)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides) \| `null`\>

##### getAll()

```ts
getAll(): Promise<FeatureFlagWithOverrides[] | null>;
```

Defined in: [src/interfaces/cache-adapter.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/cache-adapter.interface.ts#L6)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)[] \| `null`\>

##### invalidate()

```ts
invalidate(key?): Promise<void>;
```

Defined in: [src/interfaces/cache-adapter.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/cache-adapter.interface.ts#L8)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key?` | `string` |

###### Returns

`Promise`\<`void`\>

##### onModuleDestroy()?

```ts
optional onModuleDestroy(): Promise<void>;
```

Defined in: [src/interfaces/cache-adapter.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/cache-adapter.interface.ts#L9)

###### Returns

`Promise`\<`void`\>

##### set()

```ts
set(
   key, 
   data, 
ttlMs): Promise<void>;
```

Defined in: [src/interfaces/cache-adapter.interface.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/cache-adapter.interface.ts#L5)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `data` | [`FeatureFlagWithOverrides`](#featureflagwithoverrides) |
| `ttlMs` | `number` |

###### Returns

`Promise`\<`void`\>

##### setAll()

```ts
setAll(data, ttlMs): Promise<void>;
```

Defined in: [src/interfaces/cache-adapter.interface.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/cache-adapter.interface.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`FeatureFlagWithOverrides`](#featureflagwithoverrides)[] |
| `ttlMs` | `number` |

###### Returns

`Promise`\<`void`\>

***

### CreateFeatureFlagInput

Defined in: [src/interfaces/feature-flag.interface.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L4)

#### Properties

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L6)

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L7)

##### key

```ts
key: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L5)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L9)

##### percentage?

```ts
optional percentage?: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L8)

***

### EvaluateBooleanOptions

Defined in: [src/interfaces/evaluation-details.interface.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L20)

#### Properties

##### defaultValue?

```ts
optional defaultValue?: boolean;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L22)

Invocation-level default used when the flag is missing or evaluation fails.

##### includeContextInEvent?

```ts
optional includeContextInEvent?: boolean;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L28)

Include the full resolved context in evaluation/exposure events.

##### trackExposure?

```ts
optional trackExposure?: boolean;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:25](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L25)

Emit an exposure event for this evaluation.

***

### EvaluationContext

Defined in: [src/interfaces/evaluation-context.interface.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-context.interface.ts#L3)

#### Properties

##### attributes?

```ts
optional attributes?: TargetingAttributes;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-context.interface.ts#L17)

Additional exact-match targeting attributes

##### environment?

```ts
optional environment?: string;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-context.interface.ts#L11)

Environment - auto-injected from module options. Can be explicitly overridden

##### targetingKey?

```ts
optional targetingKey?: string | null;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-context.interface.ts#L14)

Explicit stable key for percentage rollout bucketing

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-context.interface.ts#L8)

Tenant ID - used for tenant-scoped targeting. Ignored if tenancy is not installed

##### userId?

```ts
optional userId?: string | null;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-context.interface.ts#L5)

User ID - used for user-scoped targeting and percentage hash

***

### FeatureFlagAdminOptions

Defined in: [src/admin/admin-options.interface.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/admin/admin-options.interface.ts#L3)

#### Properties

##### guard

```ts
guard: Type<CanActivate>;
```

Defined in: [src/admin/admin-options.interface.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/admin/admin-options.interface.ts#L4)

##### path?

```ts
optional path?: string;
```

Defined in: [src/admin/admin-options.interface.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/admin/admin-options.interface.ts#L5)

***

### FeatureFlagGuardOptions

Defined in: [src/interfaces/feature-flag.interface.ts:25](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L25)

#### Properties

##### defaultValue?

```ts
optional defaultValue?: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:33](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L33)

Invocation-level default when the guard cannot find or evaluate the flag. Default: false

##### fallback?

```ts
optional fallback?: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:30](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L30)

Response body when flag is OFF

##### statusCode?

```ts
optional statusCode?: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:27](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L27)

HTTP status code when flag is OFF. Default: 403

***

### FeatureFlagLifecycleMetadata

Defined in: [src/interfaces/flag-registry.interface.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L5)

#### Extended by

- [`FlagDefinition`](#flagdefinition)
- [`FlagLifecycleStatus`](#flaglifecyclestatus)

#### Properties

##### expiresAt?

```ts
optional expiresAt?: string | Date;
```

Defined in: [src/interfaces/flag-registry.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L9)

##### owner?

```ts
optional owner?: string;
```

Defined in: [src/interfaces/flag-registry.interface.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L7)

##### staleAt?

```ts
optional staleAt?: string | Date;
```

Defined in: [src/interfaces/flag-registry.interface.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L10)

##### tags?

```ts
optional tags?: readonly string[];
```

Defined in: [src/interfaces/flag-registry.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L8)

##### type?

```ts
optional type?: FeatureFlagType;
```

Defined in: [src/interfaces/flag-registry.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L6)

***

### FeatureFlagModuleAsyncOptions

Defined in: [src/interfaces/feature-flag-options.interface.ts:35](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L35)

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

Defined in: [src/interfaces/feature-flag-options.interface.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L36)

##### useClass?

```ts
optional useClass?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:38](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L38)

##### useExisting?

```ts
optional useExisting?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:39](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L39)

##### useFactory?

```ts
optional useFactory?: (...args) => 
  | FeatureFlagModuleOptions
| Promise<FeatureFlagModuleOptions>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:37](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`FeatureFlagModuleOptions`](#featureflagmoduleoptions)
  \| `Promise`\<[`FeatureFlagModuleOptions`](#featureflagmoduleoptions)\>

***

### FeatureFlagModuleOptions

Defined in: [src/interfaces/feature-flag-options.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L6)

#### Extended by

- [`FeatureFlagModuleRootOptions`](#featureflagmodulerootoptions)

#### Properties

##### cacheAdapter?

```ts
optional cacheAdapter?: CacheAdapter;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L23)

Custom cache adapter implementation. If not provided, an in-memory cache is used.

##### cacheTtlMs?

```ts
optional cacheTtlMs?: number;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L11)

Cache TTL in milliseconds. 0 disables caching. Default: 30000

##### defaultOnMissing?

```ts
optional defaultOnMissing?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L17)

Default value when evaluating a non-existent flag. Default: false

##### emitEvents?

```ts
optional emitEvents?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L20)

Emit evaluation events via @nestjs/event-emitter. Default: false

##### environment

```ts
environment: string;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L8)

Current environment (e.g., 'development', 'staging', 'production')

##### flags?

```ts
optional flags?: FlagRegistry;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:26](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L26)

Optional type-safe flag registry used for defaults and evaluation metadata.

##### userIdExtractor?

```ts
optional userIdExtractor?: (req) => string | null;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L14)

Extract user ID from request. Returns null if user is not authenticated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `Request` |

###### Returns

`string` \| `null`

***

### FeatureFlagModuleOptionsFactory

Defined in: [src/interfaces/feature-flag-options.interface.ts:29](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L29)

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

Defined in: [src/interfaces/feature-flag-options.interface.ts:30](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L30)

###### Returns

  \| `Promise`\<[`FeatureFlagModuleOptions`](#featureflagmoduleoptions) & \{
  `prisma`: `any`;
\}\>
  \| [`FeatureFlagModuleOptions`](#featureflagmoduleoptions) & \{
  `prisma`: `any`;
\}

***

### FeatureFlagModuleRootAsyncOptions

Defined in: [src/feature-flag.module.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.module.ts#L36)

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

Defined in: [src/interfaces/feature-flag-options.interface.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L36)

###### Inherited from

[`FeatureFlagModuleAsyncOptions`](#featureflagmoduleasyncoptions).[`inject`](#inject)

##### useClass?

```ts
optional useClass?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:38](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L38)

###### Inherited from

[`FeatureFlagModuleAsyncOptions`](#featureflagmoduleasyncoptions).[`useClass`](#useclass)

##### useExisting?

```ts
optional useExisting?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:39](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L39)

###### Inherited from

[`FeatureFlagModuleAsyncOptions`](#featureflagmoduleasyncoptions).[`useExisting`](#useexisting)

##### useFactory?

```ts
optional useFactory?: (...args) => 
  | FeatureFlagModuleRootOptions
| Promise<FeatureFlagModuleRootOptions>;
```

Defined in: [src/feature-flag.module.ts:37](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.module.ts#L37)

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

Defined in: [src/feature-flag.module.ts:32](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.module.ts#L32)

#### Extends

- [`FeatureFlagModuleOptions`](#featureflagmoduleoptions)

#### Properties

##### cacheAdapter?

```ts
optional cacheAdapter?: CacheAdapter;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L23)

Custom cache adapter implementation. If not provided, an in-memory cache is used.

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`cacheAdapter`](#cacheadapter-1)

##### cacheTtlMs?

```ts
optional cacheTtlMs?: number;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L11)

Cache TTL in milliseconds. 0 disables caching. Default: 30000

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`cacheTtlMs`](#cachettlms)

##### defaultOnMissing?

```ts
optional defaultOnMissing?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L17)

Default value when evaluating a non-existent flag. Default: false

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`defaultOnMissing`](#defaultonmissing)

##### emitEvents?

```ts
optional emitEvents?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L20)

Emit evaluation events via @nestjs/event-emitter. Default: false

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`emitEvents`](#emitevents)

##### environment

```ts
environment: string;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L8)

Current environment (e.g., 'development', 'staging', 'production')

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`environment`](#environment-1)

##### flags?

```ts
optional flags?: FlagRegistry;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:26](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L26)

Optional type-safe flag registry used for defaults and evaluation metadata.

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`flags`](#flags)

##### prisma

```ts
prisma: any;
```

Defined in: [src/feature-flag.module.ts:33](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.module.ts#L33)

##### userIdExtractor?

```ts
optional userIdExtractor?: (req) => string | null;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L14)

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

### FeatureFlagRepository

Defined in: [src/interfaces/feature-flag-repository.interface.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L17)

#### Methods

##### archiveFlag()

```ts
archiveFlag(key): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L20)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

##### createFlag()

```ts
createFlag(input): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L18)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`CreateFeatureFlagInput`](#createfeatureflaginput) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

##### createOverride()

```ts
createOverride(
   flagId, 
   criteria, 
   enabled, 
priority): Promise<void>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:25](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L25)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagId` | `string` |
| `criteria` | [`OverrideCriteria`](#overridecriteria) |
| `enabled` | `boolean` |
| `priority` | `number` |

###### Returns

`Promise`\<`void`\>

##### deleteOverride()

```ts
deleteOverride(id): Promise<void>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:32](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L32)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`Promise`\<`void`\>

##### findAllActiveFlags()

```ts
findAllActiveFlags(): Promise<FeatureFlagWithOverrides[]>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L23)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)[]\>

##### findFlagByKey()

```ts
findFlagByKey(key): Promise<FeatureFlagWithOverrides | null>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:21](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L21)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides) \| `null`\>

##### findFlagIdByKey()

```ts
findFlagIdByKey(key): Promise<string | null>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<`string` \| `null`\>

##### findOverride()

```ts
findOverride(flagId, criteria): Promise<
  | {
  id: string;
}
| null>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:24](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L24)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagId` | `string` |
| `criteria` | [`OverrideCriteria`](#overridecriteria) |

###### Returns

`Promise`\<
  \| \{
  `id`: `string`;
\}
  \| `null`\>

##### updateFlag()

```ts
updateFlag(key, input): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:19](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L19)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `input` | [`UpdateFeatureFlagInput`](#updatefeatureflaginput) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

##### updateOverride()

```ts
updateOverride(id, input): Promise<void>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L31)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `input` | [`UpdateOverrideInput`](#updateoverrideinput) |

###### Returns

`Promise`\<`void`\>

***

### FeatureFlagWithOverrides

Defined in: [src/interfaces/feature-flag.interface.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L36)

#### Properties

##### archivedAt

```ts
archivedAt: Date | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:43](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L43)

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/feature-flag.interface.ts:44](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L44)

##### description

```ts
description: string | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:39](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L39)

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:40](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L40)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:37](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L37)

##### key

```ts
key: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:38](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L38)

##### metadata

```ts
metadata: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:42](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L42)

##### overrides

```ts
overrides: FlagOverride[];
```

Defined in: [src/interfaces/feature-flag.interface.ts:46](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L46)

##### percentage

```ts
percentage: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:41](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L41)

##### updatedAt

```ts
updatedAt: Date;
```

Defined in: [src/interfaces/feature-flag.interface.ts:45](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L45)

***

### FlagDefinition

Defined in: [src/interfaces/flag-registry.interface.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L13)

#### Extends

- [`FeatureFlagLifecycleMetadata`](#featureflaglifecyclemetadata)

#### Properties

##### bucketBy?

```ts
optional bucketBy?: BucketBy;
```

Defined in: [src/interfaces/flag-registry.interface.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L16)

##### defaultValue

```ts
defaultValue: boolean;
```

Defined in: [src/interfaces/flag-registry.interface.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L14)

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/flag-registry.interface.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L15)

##### expiresAt?

```ts
optional expiresAt?: string | Date;
```

Defined in: [src/interfaces/flag-registry.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L9)

###### Inherited from

[`FeatureFlagLifecycleMetadata`](#featureflaglifecyclemetadata).[`expiresAt`](#expiresat)

##### owner?

```ts
optional owner?: string;
```

Defined in: [src/interfaces/flag-registry.interface.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L7)

###### Inherited from

[`FeatureFlagLifecycleMetadata`](#featureflaglifecyclemetadata).[`owner`](#owner)

##### staleAt?

```ts
optional staleAt?: string | Date;
```

Defined in: [src/interfaces/flag-registry.interface.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L10)

###### Inherited from

[`FeatureFlagLifecycleMetadata`](#featureflaglifecyclemetadata).[`staleAt`](#staleat)

##### tags?

```ts
optional tags?: readonly string[];
```

Defined in: [src/interfaces/flag-registry.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L8)

###### Inherited from

[`FeatureFlagLifecycleMetadata`](#featureflaglifecyclemetadata).[`tags`](#tags)

##### trackExposure?

```ts
optional trackExposure?: boolean;
```

Defined in: [src/interfaces/flag-registry.interface.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L17)

##### type?

```ts
optional type?: FeatureFlagType;
```

Defined in: [src/interfaces/flag-registry.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L6)

###### Inherited from

[`FeatureFlagLifecycleMetadata`](#featureflaglifecyclemetadata).[`type`](#type)

***

### FlagEvaluatedEvent

Defined in: [src/events/feature-flag.events.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L18)

#### Properties

##### bucket?

```ts
optional bucket?: number;
```

Defined in: [src/events/feature-flag.events.ts:29](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L29)

##### context?

```ts
optional context?: EvaluationContext;
```

Defined in: [src/events/feature-flag.events.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L22)

##### defaultUsed?

```ts
optional defaultUsed?: boolean;
```

Defined in: [src/events/feature-flag.events.ts:25](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L25)

##### errorCode?

```ts
optional errorCode?: string;
```

Defined in: [src/events/feature-flag.events.ts:26](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L26)

##### errorMessage?

```ts
optional errorMessage?: string;
```

Defined in: [src/events/feature-flag.events.ts:27](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L27)

##### evaluationTimeMs

```ts
evaluationTimeMs: number;
```

Defined in: [src/events/feature-flag.events.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L31)

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/events/feature-flag.events.ts:19](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L19)

##### matchedOverrideId?

```ts
optional matchedOverrideId?: string;
```

Defined in: [src/events/feature-flag.events.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L28)

##### reason?

```ts
optional reason?: EvaluationReason;
```

Defined in: [src/events/feature-flag.events.ts:24](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L24)

##### result

```ts
result: boolean;
```

Defined in: [src/events/feature-flag.events.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L20)

##### source

```ts
source: EvaluationSource;
```

Defined in: [src/events/feature-flag.events.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L23)

##### targetingKey?

```ts
optional targetingKey?: string;
```

Defined in: [src/events/feature-flag.events.ts:30](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L30)

##### value?

```ts
optional value?: boolean;
```

Defined in: [src/events/feature-flag.events.ts:21](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L21)

***

### FlagEvaluatorOptions

Defined in: [src/interfaces/evaluation-details.interface.ts:47](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L47)

#### Properties

##### bucketBy?

```ts
optional bucketBy?: BucketBy;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:48](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L48)

***

### FlagExposedEvent

Defined in: [src/events/feature-flag.events.ts:34](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L34)

#### Properties

##### bucket?

```ts
optional bucket?: number;
```

Defined in: [src/events/feature-flag.events.ts:43](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L43)

##### context?

```ts
optional context?: EvaluationContext;
```

Defined in: [src/events/feature-flag.events.ts:41](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L41)

##### defaultUsed

```ts
defaultUsed: boolean;
```

Defined in: [src/events/feature-flag.events.ts:40](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L40)

##### evaluationTimeMs?

```ts
optional evaluationTimeMs?: number;
```

Defined in: [src/events/feature-flag.events.ts:45](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L45)

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/events/feature-flag.events.ts:35](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L35)

##### matchedOverrideId?

```ts
optional matchedOverrideId?: string;
```

Defined in: [src/events/feature-flag.events.ts:42](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L42)

##### reason

```ts
reason: EvaluationReason;
```

Defined in: [src/events/feature-flag.events.ts:39](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L39)

##### result

```ts
result: boolean;
```

Defined in: [src/events/feature-flag.events.ts:37](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L37)

##### source

```ts
source: EvaluationSource;
```

Defined in: [src/events/feature-flag.events.ts:38](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L38)

##### targetingKey?

```ts
optional targetingKey?: string;
```

Defined in: [src/events/feature-flag.events.ts:44](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L44)

##### value

```ts
value: boolean;
```

Defined in: [src/events/feature-flag.events.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L36)

***

### FlagLifecycleStatus

Defined in: [src/flag-registry.ts:40](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L40)

#### Extends

- [`FeatureFlagLifecycleMetadata`](#featureflaglifecyclemetadata)

#### Properties

##### expiresAt?

```ts
optional expiresAt?: Date;
```

Defined in: [src/flag-registry.ts:44](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L44)

###### Overrides

[`FeatureFlagLifecycleMetadata`](#featureflaglifecyclemetadata).[`expiresAt`](#expiresat)

##### owner?

```ts
optional owner?: string;
```

Defined in: [src/interfaces/flag-registry.interface.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L7)

###### Inherited from

[`FeatureFlagLifecycleMetadata`](#featureflaglifecyclemetadata).[`owner`](#owner)

##### staleAt?

```ts
optional staleAt?: Date;
```

Defined in: [src/flag-registry.ts:43](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L43)

###### Overrides

[`FeatureFlagLifecycleMetadata`](#featureflaglifecyclemetadata).[`staleAt`](#staleat)

##### status

```ts
status: FlagLifecycleStatusName;
```

Defined in: [src/flag-registry.ts:41](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L41)

##### tags

```ts
tags: string[];
```

Defined in: [src/flag-registry.ts:42](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L42)

###### Overrides

[`FeatureFlagLifecycleMetadata`](#featureflaglifecyclemetadata).[`tags`](#tags)

##### type?

```ts
optional type?: FeatureFlagType;
```

Defined in: [src/interfaces/flag-registry.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L6)

###### Inherited from

[`FeatureFlagLifecycleMetadata`](#featureflaglifecyclemetadata).[`type`](#type)

***

### FlagMutationEvent

Defined in: [src/events/feature-flag.events.ts:48](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L48)

#### Properties

##### action

```ts
action: "created" | "updated" | "archived";
```

Defined in: [src/events/feature-flag.events.ts:50](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L50)

##### actorId?

```ts
optional actorId?: string;
```

Defined in: [src/events/feature-flag.events.ts:51](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L51)

##### actorType?

```ts
optional actorType?: string;
```

Defined in: [src/events/feature-flag.events.ts:52](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L52)

##### correlationId?

```ts
optional correlationId?: string;
```

Defined in: [src/events/feature-flag.events.ts:55](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L55)

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/events/feature-flag.events.ts:49](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L49)

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/events/feature-flag.events.ts:53](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L53)

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/events/feature-flag.events.ts:54](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L54)

***

### FlagMutationMetadata

Defined in: [src/interfaces/feature-flag.interface.ts:63](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L63)

#### Properties

##### actorId?

```ts
optional actorId?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:64](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L64)

##### actorType?

```ts
optional actorType?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:65](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L65)

##### correlationId?

```ts
optional correlationId?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:68](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L68)

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:66](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L66)

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:67](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L67)

***

### FlagOverride

Defined in: [src/interfaces/feature-flag.interface.ts:49](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L49)

#### Properties

##### attributes

```ts
attributes: TargetingAttributes;
```

Defined in: [src/interfaces/feature-flag.interface.ts:52](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L52)

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/feature-flag.interface.ts:55](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L55)

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:54](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L54)

##### flagId

```ts
flagId: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:51](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L51)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:50](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L50)

##### priority

```ts
priority: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:53](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L53)

##### updatedAt

```ts
updatedAt: Date;
```

Defined in: [src/interfaces/feature-flag.interface.ts:56](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L56)

***

### FlagOverrideEvent

Defined in: [src/events/feature-flag.events.ts:58](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L58)

#### Properties

##### action

```ts
action: "set" | "removed";
```

Defined in: [src/events/feature-flag.events.ts:63](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L63)

##### actorId?

```ts
optional actorId?: string;
```

Defined in: [src/events/feature-flag.events.ts:64](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L64)

##### actorType?

```ts
optional actorType?: string;
```

Defined in: [src/events/feature-flag.events.ts:65](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L65)

##### attributes

```ts
attributes: Record<string, string | number | boolean | null>;
```

Defined in: [src/events/feature-flag.events.ts:60](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L60)

##### correlationId?

```ts
optional correlationId?: string;
```

Defined in: [src/events/feature-flag.events.ts:68](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L68)

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/events/feature-flag.events.ts:61](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L61)

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/events/feature-flag.events.ts:59](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L59)

##### priority?

```ts
optional priority?: number;
```

Defined in: [src/events/feature-flag.events.ts:62](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L62)

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/events/feature-flag.events.ts:66](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L66)

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/events/feature-flag.events.ts:67](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L67)

***

### OverrideCriteria

Defined in: [src/interfaces/feature-flag-repository.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L8)

#### Properties

##### attributes

```ts
attributes: TargetingAttributes;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L9)

***

### RedisCacheAdapterOptions

Defined in: [src/cache/redis-cache.adapter.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L6)

#### Properties

##### channel?

```ts
optional channel?: string;
```

Defined in: [src/cache/redis-cache.adapter.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L10)

##### client

```ts
client: Redis;
```

Defined in: [src/cache/redis-cache.adapter.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L7)

##### keyPrefix?

```ts
optional keyPrefix?: string;
```

Defined in: [src/cache/redis-cache.adapter.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L9)

##### subscriber?

```ts
optional subscriber?: Redis;
```

Defined in: [src/cache/redis-cache.adapter.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L8)

***

### RemoveOverrideInput

Defined in: [src/interfaces/feature-flag.interface.ts:59](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L59)

#### Properties

##### attributes

```ts
attributes: TargetingAttributes;
```

Defined in: [src/interfaces/feature-flag.interface.ts:60](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L60)

***

### SetOverrideInput

Defined in: [src/interfaces/feature-flag.interface.ts:19](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L19)

#### Properties

##### attributes

```ts
attributes: TargetingAttributes;
```

Defined in: [src/interfaces/feature-flag.interface.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L20)

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:21](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L21)

##### priority?

```ts
optional priority?: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L22)

***

### TenantContextProvider

Defined in: [src/interfaces/tenant-context-provider.interface.ts:1](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/tenant-context-provider.interface.ts#L1)

#### Methods

##### getCurrentTenantId()

```ts
getCurrentTenantId(): string | null;
```

Defined in: [src/interfaces/tenant-context-provider.interface.ts:2](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/tenant-context-provider.interface.ts#L2)

###### Returns

`string` \| `null`

***

### TypedFeatureFlagClient

Defined in: [src/flag-registry.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L15)

#### Type Parameters

| Type Parameter |
| ------ |
| `TFlags` *extends* [`FlagRegistry`](#flagregistry) |

#### Properties

##### registry

```ts
registry: TFlags;
```

Defined in: [src/flag-registry.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L28)

#### Methods

##### evaluateBoolean()

```ts
evaluateBoolean<K>(
   flagKey, 
   context?, 
options?): Promise<BooleanEvaluationDetails>;
```

Defined in: [src/flag-registry.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L22)

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `K` |
| `context?` | [`EvaluationContext`](#evaluationcontext) |
| `options?` | [`EvaluateBooleanOptions`](#evaluatebooleanoptions) |

###### Returns

`Promise`\<[`BooleanEvaluationDetails`](#booleanevaluationdetails)\>

##### isEnabled()

```ts
isEnabled<K>(
   flagKey, 
   context?, 
options?): Promise<boolean>;
```

Defined in: [src/flag-registry.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L16)

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `K` |
| `context?` | [`EvaluationContext`](#evaluationcontext) |
| `options?` | [`EvaluateBooleanOptions`](#evaluatebooleanoptions) |

###### Returns

`Promise`\<`boolean`\>

***

### TypedFeatureFlagDecorators

Defined in: [src/flag-registry.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L31)

#### Type Parameters

| Type Parameter |
| ------ |
| `TFlags` *extends* [`FlagRegistry`](#flagregistry) |

#### Methods

##### FeatureFlag()

```ts
FeatureFlag<K>(flagKey, options?): ClassDecorator & MethodDecorator;
```

Defined in: [src/flag-registry.ts:32](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L32)

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `K` |
| `options?` | [`FeatureFlagGuardOptions`](#featureflagguardoptions) |

###### Returns

`ClassDecorator` & `MethodDecorator`

***

### UpdateFeatureFlagInput

Defined in: [src/interfaces/feature-flag.interface.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L12)

#### Properties

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L13)

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L14)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L16)

##### percentage?

```ts
optional percentage?: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L15)

***

### UpdateOverrideInput

Defined in: [src/interfaces/feature-flag-repository.interface.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L12)

#### Properties

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L13)

##### priority

```ts
priority: number;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L14)

## Type Aliases

### BucketBy

```ts
type BucketBy = 
  | "userId"
  | "tenantId"
  | "environment"
  | "targetingKey"
  | string & {
};
```

Defined in: [src/interfaces/evaluation-details.interface.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L13)

***

### EvaluationReason

```ts
type EvaluationReason = 
  | "ARCHIVED"
  | "OVERRIDE_MATCH"
  | "PERCENTAGE_MATCH"
  | "PERCENTAGE_MISS"
  | "PERCENTAGE_NO_TARGETING_KEY"
  | "GLOBAL"
  | "FLAG_NOT_FOUND"
  | "ERROR";
```

Defined in: [src/interfaces/evaluation-details.interface.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L3)

***

### EvaluationSource

```ts
type EvaluationSource = "override" | "percentage" | "global" | "default";
```

Defined in: [src/interfaces/evaluation-details.interface.ts:1](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L1)

***

### FeatureFlagType

```ts
type FeatureFlagType = "release" | "experiment" | "ops" | "permission";
```

Defined in: [src/interfaces/flag-registry.interface.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L3)

***

### FlagKey

```ts
type FlagKey<TFlags> = Extract<keyof TFlags, string>;
```

Defined in: [src/interfaces/flag-registry.interface.ts:21](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L21)

#### Type Parameters

| Type Parameter |
| ------ |
| `TFlags` *extends* [`FlagRegistry`](#flagregistry) |

***

### FlagLifecycleStatusName

```ts
type FlagLifecycleStatusName = "active" | "stale" | "expired";
```

Defined in: [src/flag-registry.ts:38](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L38)

***

### FlagRegistry

```ts
type FlagRegistry = Record<string, FlagDefinition>;
```

Defined in: [src/interfaces/flag-registry.interface.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L20)

***

### TargetingAttributes

```ts
type TargetingAttributes = Record<string, TargetingAttributeValue>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:2](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L2)

***

### TargetingAttributeValue

```ts
type TargetingAttributeValue = string | number | boolean | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:1](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L1)

## Variables

### CACHE\_ADAPTER

```ts
const CACHE_ADAPTER: typeof CACHE_ADAPTER;
```

Defined in: [src/feature-flag.constants.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.constants.ts#L9)

***

### FEATURE\_FLAG\_MODULE\_OPTIONS

```ts
const FEATURE_FLAG_MODULE_OPTIONS: typeof FEATURE_FLAG_MODULE_OPTIONS;
```

Defined in: [src/feature-flag.constants.ts:1](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.constants.ts#L1)

***

### FEATURE\_FLAG\_REPOSITORY

```ts
const FEATURE_FLAG_REPOSITORY: typeof FEATURE_FLAG_REPOSITORY;
```

Defined in: [src/feature-flag.constants.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.constants.ts#L10)

***

### FeatureFlagEvents

```ts
const FeatureFlagEvents: {
  ARCHIVED: "feature-flag.archived";
  CACHE_INVALIDATED: "feature-flag.cache.invalidated";
  CREATED: "feature-flag.created";
  EVALUATED: "feature-flag.evaluated";
  EXPOSED: "feature-flag.exposed";
  OVERRIDE_REMOVED: "feature-flag.override.removed";
  OVERRIDE_SET: "feature-flag.override.set";
  UPDATED: "feature-flag.updated";
};
```

Defined in: [src/events/feature-flag.events.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L7)

#### Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-archived"></a> `ARCHIVED` | `"feature-flag.archived"` | `'feature-flag.archived'` | [src/events/feature-flag.events.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L12) |
| <a id="property-cache_invalidated"></a> `CACHE_INVALIDATED` | `"feature-flag.cache.invalidated"` | `'feature-flag.cache.invalidated'` | [src/events/feature-flag.events.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L15) |
| <a id="property-created"></a> `CREATED` | `"feature-flag.created"` | `'feature-flag.created'` | [src/events/feature-flag.events.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L10) |
| <a id="property-evaluated"></a> `EVALUATED` | `"feature-flag.evaluated"` | `'feature-flag.evaluated'` | [src/events/feature-flag.events.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L8) |
| <a id="property-exposed"></a> `EXPOSED` | `"feature-flag.exposed"` | `'feature-flag.exposed'` | [src/events/feature-flag.events.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L9) |
| <a id="property-override_removed"></a> `OVERRIDE_REMOVED` | `"feature-flag.override.removed"` | `'feature-flag.override.removed'` | [src/events/feature-flag.events.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L14) |
| <a id="property-override_set"></a> `OVERRIDE_SET` | `"feature-flag.override.set"` | `'feature-flag.override.set'` | [src/events/feature-flag.events.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L13) |
| <a id="property-updated"></a> `UPDATED` | `"feature-flag.updated"` | `'feature-flag.updated'` | [src/events/feature-flag.events.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L11) |

***

### TENANT\_CONTEXT\_PROVIDER

```ts
const TENANT_CONTEXT_PROVIDER: typeof TENANT_CONTEXT_PROVIDER;
```

Defined in: [src/feature-flag.constants.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.constants.ts#L11)

## Functions

### BypassFeatureFlag()

```ts
function BypassFeatureFlag(): CustomDecorator<string>;
```

Defined in: [src/decorators/bypass-feature-flag.decorator.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/decorators/bypass-feature-flag.decorator.ts#L4)

#### Returns

`CustomDecorator`\<`string`\>

***

### createFeatureFlagClient()

```ts
function createFeatureFlagClient<TFlags>(service, registry): TypedFeatureFlagClient<TFlags>;
```

Defined in: [src/flag-registry.ts:51](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L51)

#### Type Parameters

| Type Parameter |
| ------ |
| `TFlags` *extends* [`FlagRegistry`](#flagregistry) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `service` | [`FeatureFlagService`](#featureflagservice) |
| `registry` | `TFlags` |

#### Returns

[`TypedFeatureFlagClient`](#typedfeatureflagclient)\<`TFlags`\>

***

### createFeatureFlagDecorators()

```ts
function createFeatureFlagDecorators<TFlags>(registry): TypedFeatureFlagDecorators<TFlags>;
```

Defined in: [src/flag-registry.ts:68](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L68)

#### Type Parameters

| Type Parameter |
| ------ |
| `TFlags` *extends* [`FlagRegistry`](#flagregistry) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `registry` | `TFlags` |

#### Returns

[`TypedFeatureFlagDecorators`](#typedfeatureflagdecorators)\<`TFlags`\>

***

### defineFlags()

```ts
function defineFlags<TFlags>(flags): TFlags;
```

Defined in: [src/flag-registry.ts:47](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L47)

#### Type Parameters

| Type Parameter |
| ------ |
| `TFlags` *extends* [`FlagRegistry`](#flagregistry) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `flags` | `TFlags` |

#### Returns

`TFlags`

***

### FeatureFlag()

```ts
function FeatureFlag(flagKey, options?): ClassDecorator & MethodDecorator;
```

Defined in: [src/decorators/feature-flag.decorator.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/decorators/feature-flag.decorator.ts#L6)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `string` |
| `options` | [`FeatureFlagGuardOptions`](#featureflagguardoptions) |

#### Returns

`ClassDecorator` & `MethodDecorator`

***

### getFlagLifecycleStatus()

```ts
function getFlagLifecycleStatus(metadata, now?): FlagLifecycleStatus;
```

Defined in: [src/flag-registry.ts:80](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L80)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `metadata` | [`FeatureFlagLifecycleMetadata`](#featureflaglifecyclemetadata) |
| `now` | `Date` |

#### Returns

[`FlagLifecycleStatus`](#flaglifecyclestatus)
