# @nestarc/feature-flag

## Classes

<a id="api-featureflagadminmodule"></a>

### FeatureFlagAdminModule

Defined in: [src/admin/feature-flag-admin.module.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/admin/feature-flag-admin.module.ts#L6)

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new FeatureFlagAdminModule(): FeatureFlagAdminModule;
```

###### Returns

[`FeatureFlagAdminModule`](#api-featureflagadminmodule)

#### Methods

<a id="api-register"></a>

##### register()

```ts
static register(options): DynamicModule;
```

Defined in: [src/admin/feature-flag-admin.module.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/admin/feature-flag-admin.module.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`FeatureFlagAdminOptions`](#api-featureflagadminoptions) |

###### Returns

`DynamicModule`

***

<a id="api-featureflagguard"></a>

### FeatureFlagGuard

Defined in: [src/guards/feature-flag.guard.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/guards/feature-flag.guard.ts#L12)

#### Implements

- `CanActivate`

#### Constructors

<a id="api-constructor-1"></a>

##### Constructor

```ts
new FeatureFlagGuard(reflector, featureFlagService): FeatureFlagGuard;
```

Defined in: [src/guards/feature-flag.guard.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/guards/feature-flag.guard.ts#L13)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `reflector` | `Reflector` |
| `featureFlagService` | [`FeatureFlagService`](#api-featureflagservice) |

###### Returns

[`FeatureFlagGuard`](#api-featureflagguard)

#### Methods

<a id="api-canactivate"></a>

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

<a id="api-featureflagmodule"></a>

### FeatureFlagModule

Defined in: [src/feature-flag.module.ts:54](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.module.ts#L54)

#### Implements

- `NestModule`

#### Constructors

<a id="api-constructor-2"></a>

##### Constructor

```ts
new FeatureFlagModule(): FeatureFlagModule;
```

###### Returns

[`FeatureFlagModule`](#api-featureflagmodule)

#### Methods

<a id="api-configure"></a>

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

<a id="api-forroot"></a>

##### forRoot()

```ts
static forRoot(options): DynamicModule;
```

Defined in: [src/feature-flag.module.ts:61](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.module.ts#L61)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`FeatureFlagModuleRootOptions`](#api-featureflagmodulerootoptions) |

###### Returns

`DynamicModule`

<a id="api-forrootasync"></a>

##### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [src/feature-flag.module.ts:105](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.module.ts#L105)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`FeatureFlagModuleRootAsyncOptions`](#api-featureflagmodulerootasyncoptions) |

###### Returns

`DynamicModule`

***

<a id="api-featureflagservice"></a>

### FeatureFlagService

Defined in: [src/services/feature-flag.service.ts:33](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L33)

#### Constructors

<a id="api-constructor-3"></a>

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
| `options` | [`FeatureFlagModuleOptions`](#api-featureflagmoduleoptions) |
| `repository` | [`FeatureFlagRepository`](#api-featureflagrepository) |
| `cacheAdapter` | [`CacheAdapter`](#api-cacheadapter) |
| `evaluator` | `FlagEvaluatorService` |
| `contextResolver` | `FlagContextResolver` |
| `eventPublisher` | `FlagEventPublisher` |

###### Returns

[`FeatureFlagService`](#api-featureflagservice)

#### Methods

<a id="api-archive"></a>

##### archive()

```ts
archive(key, metadata?): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/services/feature-flag.service.ts:139](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L139)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `metadata` | [`FlagMutationMetadata`](#api-flagmutationmetadata) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)\>

<a id="api-create"></a>

##### create()

```ts
create(input, metadata?): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/services/feature-flag.service.ts:110](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L110)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`CreateFeatureFlagInput`](#api-createfeatureflaginput) |
| `metadata` | [`FlagMutationMetadata`](#api-flagmutationmetadata) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)\>

<a id="api-evaluateall"></a>

##### evaluateAll()

```ts
evaluateAll(explicitContext?): Promise<Record<string, boolean>>;
```

Defined in: [src/services/feature-flag.service.ts:98](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L98)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `explicitContext?` | [`EvaluationContext`](#api-evaluationcontext) |

###### Returns

`Promise`\<`Record`\<`string`, `boolean`\>\>

<a id="api-evaluateboolean"></a>

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
| `explicitContext?` | [`EvaluationContext`](#api-evaluationcontext) |
| `evaluationOptions?` | [`EvaluateBooleanOptions`](#api-evaluatebooleanoptions) |

###### Returns

`Promise`\<[`BooleanEvaluationDetails`](#api-booleanevaluationdetails)\>

<a id="api-findall"></a>

##### findAll()

```ts
findAll(): Promise<FeatureFlagWithOverrides[]>;
```

Defined in: [src/services/feature-flag.service.ts:188](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L188)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)[]\>

<a id="api-findbykey"></a>

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

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)\>

<a id="api-invalidatecache"></a>

##### invalidateCache()

```ts
invalidateCache(): Promise<void>;
```

Defined in: [src/services/feature-flag.service.ts:192](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/feature-flag.service.ts#L192)

###### Returns

`Promise`\<`void`\>

<a id="api-isenabled"></a>

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
| `explicitContext?` | [`EvaluationContext`](#api-evaluationcontext) |
| `evaluationOptions?` | [`EvaluateBooleanOptions`](#api-evaluatebooleanoptions) |

###### Returns

`Promise`\<`boolean`\>

<a id="api-removeoverride"></a>

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
| `input` | [`RemoveOverrideInput`](#api-removeoverrideinput) |
| `metadata` | [`FlagMutationMetadata`](#api-flagmutationmetadata) |

###### Returns

`Promise`\<`void`\>

<a id="api-setoverride"></a>

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
| `input` | [`SetOverrideInput`](#api-setoverrideinput) |
| `metadata` | [`FlagMutationMetadata`](#api-flagmutationmetadata) |

###### Returns

`Promise`\<`void`\>

<a id="api-update"></a>

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
| `input` | [`UpdateFeatureFlagInput`](#api-updatefeatureflaginput) |
| `metadata` | [`FlagMutationMetadata`](#api-flagmutationmetadata) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)\>

***

<a id="api-flagcontext"></a>

### FlagContext

Defined in: [src/services/flag-context.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/flag-context.ts#L9)

#### Constructors

<a id="api-constructor-4"></a>

##### Constructor

```ts
new FlagContext(): FlagContext;
```

###### Returns

[`FlagContext`](#api-flagcontext)

#### Methods

<a id="api-getuserid"></a>

##### getUserId()

```ts
getUserId(): string | null;
```

Defined in: [src/services/flag-context.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/services/flag-context.ts#L16)

###### Returns

`string` \| `null`

<a id="api-run"></a>

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

<a id="api-memorycacheadapter"></a>

### MemoryCacheAdapter

Defined in: [src/cache/memory-cache.adapter.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/memory-cache.adapter.ts#L11)

#### Implements

- [`CacheAdapter`](#api-cacheadapter)

#### Constructors

<a id="api-constructor-5"></a>

##### Constructor

```ts
new MemoryCacheAdapter(): MemoryCacheAdapter;
```

###### Returns

[`MemoryCacheAdapter`](#api-memorycacheadapter)

#### Methods

<a id="api-get-1"></a>

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

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides) \| `null`\>

###### Implementation of

[`CacheAdapter`](#api-cacheadapter).[`get`](#api-get)

<a id="api-getall-1"></a>

##### getAll()

```ts
getAll(): Promise<FeatureFlagWithOverrides[] | null>;
```

Defined in: [src/cache/memory-cache.adapter.ts:30](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/memory-cache.adapter.ts#L30)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)[] \| `null`\>

###### Implementation of

[`CacheAdapter`](#api-cacheadapter).[`getAll`](#api-getall)

<a id="api-invalidate-1"></a>

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

[`CacheAdapter`](#api-cacheadapter).[`invalidate`](#api-invalidate)

<a id="api-set-1"></a>

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
| `data` | [`FeatureFlagWithOverrides`](#api-featureflagwithoverrides) |
| `ttlMs` | `number` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`CacheAdapter`](#api-cacheadapter).[`set`](#api-set)

<a id="api-setall-1"></a>

##### setAll()

```ts
setAll(data, ttlMs): Promise<void>;
```

Defined in: [src/cache/memory-cache.adapter.ts:39](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/memory-cache.adapter.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)[] |
| `ttlMs` | `number` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`CacheAdapter`](#api-cacheadapter).[`setAll`](#api-setall)

***

<a id="api-prismafeatureflagrepository"></a>

### PrismaFeatureFlagRepository

Defined in: [src/repositories/prisma-feature-flag.repository.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L28)

#### Implements

- [`FeatureFlagRepository`](#api-featureflagrepository)

#### Constructors

<a id="api-constructor-6"></a>

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

[`PrismaFeatureFlagRepository`](#api-prismafeatureflagrepository)

#### Methods

<a id="api-archiveflag-1"></a>

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

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)\>

###### Implementation of

[`FeatureFlagRepository`](#api-featureflagrepository).[`archiveFlag`](#api-archiveflag)

<a id="api-createflag-1"></a>

##### createFlag()

```ts
createFlag(input): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L31)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`CreateFeatureFlagInput`](#api-createfeatureflaginput) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)\>

###### Implementation of

[`FeatureFlagRepository`](#api-featureflagrepository).[`createFlag`](#api-createflag)

<a id="api-createoverride-1"></a>

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
| `criteria` | [`OverrideCriteria`](#api-overridecriteria) |
| `enabled` | `boolean` |
| `priority` | `number` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`FeatureFlagRepository`](#api-featureflagrepository).[`createOverride`](#api-createoverride)

<a id="api-deleteoverride-1"></a>

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

[`FeatureFlagRepository`](#api-featureflagrepository).[`deleteOverride`](#api-deleteoverride)

<a id="api-findallactiveflags-1"></a>

##### findAllActiveFlags()

```ts
findAllActiveFlags(): Promise<FeatureFlagWithOverrides[]>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:107](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L107)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)[]\>

###### Implementation of

[`FeatureFlagRepository`](#api-featureflagrepository).[`findAllActiveFlags`](#api-findallactiveflags)

<a id="api-findflagbykey-1"></a>

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

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides) \| `null`\>

###### Implementation of

[`FeatureFlagRepository`](#api-featureflagrepository).[`findFlagByKey`](#api-findflagbykey)

<a id="api-findflagidbykey-1"></a>

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

[`FeatureFlagRepository`](#api-featureflagrepository).[`findFlagIdByKey`](#api-findflagidbykey)

<a id="api-findoverride-1"></a>

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
| `criteria` | [`OverrideCriteria`](#api-overridecriteria) |

###### Returns

`Promise`\<
  \| \{
  `id`: `string`;
\}
  \| `null`\>

###### Implementation of

[`FeatureFlagRepository`](#api-featureflagrepository).[`findOverride`](#api-findoverride)

<a id="api-updateflag-1"></a>

##### updateFlag()

```ts
updateFlag(key, input): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:56](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L56)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `input` | [`UpdateFeatureFlagInput`](#api-updatefeatureflaginput) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)\>

###### Implementation of

[`FeatureFlagRepository`](#api-featureflagrepository).[`updateFlag`](#api-updateflag)

<a id="api-updateoverride-1"></a>

##### updateOverride()

```ts
updateOverride(id, input): Promise<void>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:152](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/repositories/prisma-feature-flag.repository.ts#L152)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `input` | [`UpdateOverrideInput`](#api-updateoverrideinput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`FeatureFlagRepository`](#api-featureflagrepository).[`updateOverride`](#api-updateoverride)

***

<a id="api-rediscacheadapter"></a>

### RedisCacheAdapter

Defined in: [src/cache/redis-cache.adapter.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L14)

#### Implements

- [`CacheAdapter`](#api-cacheadapter)

#### Constructors

<a id="api-constructor-7"></a>

##### Constructor

```ts
new RedisCacheAdapter(options): RedisCacheAdapter;
```

Defined in: [src/cache/redis-cache.adapter.ts:21](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L21)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RedisCacheAdapterOptions`](#api-rediscacheadapteroptions) |

###### Returns

[`RedisCacheAdapter`](#api-rediscacheadapter)

#### Methods

<a id="api-get-2"></a>

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

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides) \| `null`\>

###### Implementation of

[`CacheAdapter`](#api-cacheadapter).[`get`](#api-get)

<a id="api-getall-2"></a>

##### getAll()

```ts
getAll(): Promise<FeatureFlagWithOverrides[] | null>;
```

Defined in: [src/cache/redis-cache.adapter.ts:61](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L61)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)[] \| `null`\>

###### Implementation of

[`CacheAdapter`](#api-cacheadapter).[`getAll`](#api-getall)

<a id="api-invalidate-2"></a>

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

[`CacheAdapter`](#api-cacheadapter).[`invalidate`](#api-invalidate)

<a id="api-onmoduledestroy-1"></a>

##### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [src/cache/redis-cache.adapter.ts:83](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L83)

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`CacheAdapter`](#api-cacheadapter).[`onModuleDestroy`](#api-onmoduledestroy)

<a id="api-set-2"></a>

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
| `data` | [`FeatureFlagWithOverrides`](#api-featureflagwithoverrides) |
| `ttlMs` | `number` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`CacheAdapter`](#api-cacheadapter).[`set`](#api-set)

<a id="api-setall-2"></a>

##### setAll()

```ts
setAll(data, ttlMs): Promise<void>;
```

Defined in: [src/cache/redis-cache.adapter.ts:67](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L67)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)[] |
| `ttlMs` | `number` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`CacheAdapter`](#api-cacheadapter).[`setAll`](#api-setall)

## Interfaces

<a id="api-booleanevaluationdetails"></a>

### BooleanEvaluationDetails

Defined in: [src/interfaces/evaluation-details.interface.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L31)

#### Properties

<a id="api-bucket"></a>

##### bucket?

```ts
optional bucket?: number;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:42](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L42)

<a id="api-defaultused"></a>

##### defaultUsed

```ts
defaultUsed: boolean;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:38](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L38)

<a id="api-errorcode"></a>

##### errorCode?

```ts
optional errorCode?: string;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:39](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L39)

<a id="api-errormessage"></a>

##### errorMessage?

```ts
optional errorMessage?: string;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:40](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L40)

<a id="api-evaluationtimems"></a>

##### evaluationTimeMs?

```ts
optional evaluationTimeMs?: number;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:44](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L44)

<a id="api-flagkey"></a>

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:32](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L32)

<a id="api-matchedoverrideid"></a>

##### matchedOverrideId?

```ts
optional matchedOverrideId?: string;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:41](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L41)

<a id="api-reason"></a>

##### reason

```ts
reason: EvaluationReason;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:37](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L37)

<a id="api-result"></a>

##### result

```ts
result: boolean;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:35](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L35)

Backward-compatible alias for value.

<a id="api-source"></a>

##### source

```ts
source: EvaluationSource;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L36)

<a id="api-targetingkey"></a>

##### targetingKey?

```ts
optional targetingKey?: string;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:43](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L43)

<a id="api-value"></a>

##### value

```ts
value: boolean;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:33](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L33)

***

<a id="api-cacheadapter"></a>

### CacheAdapter

Defined in: [src/interfaces/cache-adapter.interface.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/cache-adapter.interface.ts#L3)

#### Methods

<a id="api-get"></a>

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

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides) \| `null`\>

<a id="api-getall"></a>

##### getAll()

```ts
getAll(): Promise<FeatureFlagWithOverrides[] | null>;
```

Defined in: [src/interfaces/cache-adapter.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/cache-adapter.interface.ts#L6)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)[] \| `null`\>

<a id="api-invalidate"></a>

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

<a id="api-onmoduledestroy"></a>

##### onModuleDestroy()?

```ts
optional onModuleDestroy(): Promise<void>;
```

Defined in: [src/interfaces/cache-adapter.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/cache-adapter.interface.ts#L9)

###### Returns

`Promise`\<`void`\>

<a id="api-set"></a>

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
| `data` | [`FeatureFlagWithOverrides`](#api-featureflagwithoverrides) |
| `ttlMs` | `number` |

###### Returns

`Promise`\<`void`\>

<a id="api-setall"></a>

##### setAll()

```ts
setAll(data, ttlMs): Promise<void>;
```

Defined in: [src/interfaces/cache-adapter.interface.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/cache-adapter.interface.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)[] |
| `ttlMs` | `number` |

###### Returns

`Promise`\<`void`\>

***

<a id="api-createfeatureflaginput"></a>

### CreateFeatureFlagInput

Defined in: [src/interfaces/feature-flag.interface.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L4)

#### Properties

<a id="api-description"></a>

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L6)

<a id="api-enabled"></a>

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L7)

<a id="api-key"></a>

##### key

```ts
key: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L5)

<a id="api-metadata"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L9)

<a id="api-percentage"></a>

##### percentage?

```ts
optional percentage?: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L8)

***

<a id="api-evaluatebooleanoptions"></a>

### EvaluateBooleanOptions

Defined in: [src/interfaces/evaluation-details.interface.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L20)

#### Properties

<a id="api-defaultvalue"></a>

##### defaultValue?

```ts
optional defaultValue?: boolean;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L22)

Invocation-level default used when the flag is missing or evaluation fails.

<a id="api-includecontextinevent"></a>

##### includeContextInEvent?

```ts
optional includeContextInEvent?: boolean;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L28)

Include the full resolved context in evaluation/exposure events.

<a id="api-trackexposure"></a>

##### trackExposure?

```ts
optional trackExposure?: boolean;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:25](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L25)

Emit an exposure event for this evaluation.

***

<a id="api-evaluationcontext"></a>

### EvaluationContext

Defined in: [src/interfaces/evaluation-context.interface.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-context.interface.ts#L3)

#### Properties

<a id="api-attributes"></a>

##### attributes?

```ts
optional attributes?: TargetingAttributes;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-context.interface.ts#L17)

Additional exact-match targeting attributes

<a id="api-environment"></a>

##### environment?

```ts
optional environment?: string;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-context.interface.ts#L11)

Environment - auto-injected from module options. Can be explicitly overridden

<a id="api-targetingkey-1"></a>

##### targetingKey?

```ts
optional targetingKey?: string | null;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-context.interface.ts#L14)

Explicit stable key for percentage rollout bucketing

<a id="api-tenantid"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-context.interface.ts#L8)

Tenant ID - used for tenant-scoped targeting. Ignored if tenancy is not installed

<a id="api-userid"></a>

##### userId?

```ts
optional userId?: string | null;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-context.interface.ts#L5)

User ID - used for user-scoped targeting and percentage hash

***

<a id="api-featureflagadminoptions"></a>

### FeatureFlagAdminOptions

Defined in: [src/admin/admin-options.interface.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/admin/admin-options.interface.ts#L3)

#### Properties

<a id="api-guard"></a>

##### guard

```ts
guard: Type<CanActivate>;
```

Defined in: [src/admin/admin-options.interface.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/admin/admin-options.interface.ts#L4)

<a id="api-path"></a>

##### path?

```ts
optional path?: string;
```

Defined in: [src/admin/admin-options.interface.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/admin/admin-options.interface.ts#L5)

***

<a id="api-featureflagguardoptions"></a>

### FeatureFlagGuardOptions

Defined in: [src/interfaces/feature-flag.interface.ts:25](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L25)

#### Properties

<a id="api-defaultvalue-1"></a>

##### defaultValue?

```ts
optional defaultValue?: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:33](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L33)

Invocation-level default when the guard cannot find or evaluate the flag. Default: false

<a id="api-fallback"></a>

##### fallback?

```ts
optional fallback?: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:30](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L30)

Response body when flag is OFF

<a id="api-statuscode"></a>

##### statusCode?

```ts
optional statusCode?: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:27](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L27)

HTTP status code when flag is OFF. Default: 403

***

<a id="api-featureflaglifecyclemetadata"></a>

### FeatureFlagLifecycleMetadata

Defined in: [src/interfaces/flag-registry.interface.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L5)

#### Extended by

- [`FlagDefinition`](#api-flagdefinition)
- [`FlagLifecycleStatus`](#api-flaglifecyclestatus)

#### Properties

<a id="api-expiresat"></a>

##### expiresAt?

```ts
optional expiresAt?: string | Date;
```

Defined in: [src/interfaces/flag-registry.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L9)

<a id="api-owner"></a>

##### owner?

```ts
optional owner?: string;
```

Defined in: [src/interfaces/flag-registry.interface.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L7)

<a id="api-staleat"></a>

##### staleAt?

```ts
optional staleAt?: string | Date;
```

Defined in: [src/interfaces/flag-registry.interface.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L10)

<a id="api-tags"></a>

##### tags?

```ts
optional tags?: readonly string[];
```

Defined in: [src/interfaces/flag-registry.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L8)

<a id="api-type"></a>

##### type?

```ts
optional type?: FeatureFlagType;
```

Defined in: [src/interfaces/flag-registry.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L6)

***

<a id="api-featureflagmoduleasyncoptions"></a>

### FeatureFlagModuleAsyncOptions

Defined in: [src/interfaces/feature-flag-options.interface.ts:35](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L35)

#### Extends

- `Pick`\<`ModuleMetadata`, `"imports"`\>

#### Extended by

- [`FeatureFlagModuleRootAsyncOptions`](#api-featureflagmodulerootasyncoptions)

#### Properties

<a id="api-imports"></a>

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

<a id="api-inject"></a>

##### inject?

```ts
optional inject?: any[];
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L36)

<a id="api-useclass"></a>

##### useClass?

```ts
optional useClass?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:38](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L38)

<a id="api-useexisting"></a>

##### useExisting?

```ts
optional useExisting?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:39](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L39)

<a id="api-usefactory"></a>

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

  \| [`FeatureFlagModuleOptions`](#api-featureflagmoduleoptions)
  \| `Promise`\<[`FeatureFlagModuleOptions`](#api-featureflagmoduleoptions)\>

***

<a id="api-featureflagmoduleoptions"></a>

### FeatureFlagModuleOptions

Defined in: [src/interfaces/feature-flag-options.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L6)

#### Extended by

- [`FeatureFlagModuleRootOptions`](#api-featureflagmodulerootoptions)

#### Properties

<a id="api-cacheadapter-1"></a>

##### cacheAdapter?

```ts
optional cacheAdapter?: CacheAdapter;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L23)

Custom cache adapter implementation. If not provided, an in-memory cache is used.

<a id="api-cachettlms"></a>

##### cacheTtlMs?

```ts
optional cacheTtlMs?: number;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L11)

Cache TTL in milliseconds. 0 disables caching. Default: 30000

<a id="api-defaultonmissing"></a>

##### defaultOnMissing?

```ts
optional defaultOnMissing?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L17)

Default value when evaluating a non-existent flag. Default: false

<a id="api-emitevents"></a>

##### emitEvents?

```ts
optional emitEvents?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L20)

Emit evaluation events via @nestjs/event-emitter. Default: false

<a id="api-environment-1"></a>

##### environment

```ts
environment: string;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L8)

Current environment (e.g., 'development', 'staging', 'production')

<a id="api-flags"></a>

##### flags?

```ts
optional flags?: FlagRegistry;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:26](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L26)

Optional type-safe flag registry used for defaults and evaluation metadata.

<a id="api-useridextractor"></a>

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

<a id="api-featureflagmoduleoptionsfactory"></a>

### FeatureFlagModuleOptionsFactory

Defined in: [src/interfaces/feature-flag-options.interface.ts:29](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L29)

#### Methods

<a id="api-createfeatureflagoptions"></a>

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

  \| `Promise`\<[`FeatureFlagModuleOptions`](#api-featureflagmoduleoptions) & \{
  `prisma`: `any`;
\}\>
  \| [`FeatureFlagModuleOptions`](#api-featureflagmoduleoptions) & \{
  `prisma`: `any`;
\}

***

<a id="api-featureflagmodulerootasyncoptions"></a>

### FeatureFlagModuleRootAsyncOptions

Defined in: [src/feature-flag.module.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.module.ts#L36)

#### Extends

- [`FeatureFlagModuleAsyncOptions`](#api-featureflagmoduleasyncoptions)

#### Properties

<a id="api-imports-1"></a>

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

[`FeatureFlagModuleAsyncOptions`](#api-featureflagmoduleasyncoptions).[`imports`](#api-imports)

<a id="api-inject-1"></a>

##### inject?

```ts
optional inject?: any[];
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L36)

###### Inherited from

[`FeatureFlagModuleAsyncOptions`](#api-featureflagmoduleasyncoptions).[`inject`](#api-inject)

<a id="api-useclass-1"></a>

##### useClass?

```ts
optional useClass?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:38](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L38)

###### Inherited from

[`FeatureFlagModuleAsyncOptions`](#api-featureflagmoduleasyncoptions).[`useClass`](#api-useclass)

<a id="api-useexisting-1"></a>

##### useExisting?

```ts
optional useExisting?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:39](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L39)

###### Inherited from

[`FeatureFlagModuleAsyncOptions`](#api-featureflagmoduleasyncoptions).[`useExisting`](#api-useexisting)

<a id="api-usefactory-1"></a>

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

  \| [`FeatureFlagModuleRootOptions`](#api-featureflagmodulerootoptions)
  \| `Promise`\<[`FeatureFlagModuleRootOptions`](#api-featureflagmodulerootoptions)\>

###### Overrides

[`FeatureFlagModuleAsyncOptions`](#api-featureflagmoduleasyncoptions).[`useFactory`](#api-usefactory)

***

<a id="api-featureflagmodulerootoptions"></a>

### FeatureFlagModuleRootOptions

Defined in: [src/feature-flag.module.ts:32](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.module.ts#L32)

#### Extends

- [`FeatureFlagModuleOptions`](#api-featureflagmoduleoptions)

#### Properties

<a id="api-cacheadapter-2"></a>

##### cacheAdapter?

```ts
optional cacheAdapter?: CacheAdapter;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L23)

Custom cache adapter implementation. If not provided, an in-memory cache is used.

###### Inherited from

[`FeatureFlagModuleOptions`](#api-featureflagmoduleoptions).[`cacheAdapter`](#api-cacheadapter-1)

<a id="api-cachettlms-1"></a>

##### cacheTtlMs?

```ts
optional cacheTtlMs?: number;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L11)

Cache TTL in milliseconds. 0 disables caching. Default: 30000

###### Inherited from

[`FeatureFlagModuleOptions`](#api-featureflagmoduleoptions).[`cacheTtlMs`](#api-cachettlms)

<a id="api-defaultonmissing-1"></a>

##### defaultOnMissing?

```ts
optional defaultOnMissing?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L17)

Default value when evaluating a non-existent flag. Default: false

###### Inherited from

[`FeatureFlagModuleOptions`](#api-featureflagmoduleoptions).[`defaultOnMissing`](#api-defaultonmissing)

<a id="api-emitevents-1"></a>

##### emitEvents?

```ts
optional emitEvents?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L20)

Emit evaluation events via @nestjs/event-emitter. Default: false

###### Inherited from

[`FeatureFlagModuleOptions`](#api-featureflagmoduleoptions).[`emitEvents`](#api-emitevents)

<a id="api-environment-2"></a>

##### environment

```ts
environment: string;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L8)

Current environment (e.g., 'development', 'staging', 'production')

###### Inherited from

[`FeatureFlagModuleOptions`](#api-featureflagmoduleoptions).[`environment`](#api-environment-1)

<a id="api-flags-1"></a>

##### flags?

```ts
optional flags?: FlagRegistry;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:26](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-options.interface.ts#L26)

Optional type-safe flag registry used for defaults and evaluation metadata.

###### Inherited from

[`FeatureFlagModuleOptions`](#api-featureflagmoduleoptions).[`flags`](#api-flags)

<a id="api-prisma"></a>

##### prisma

```ts
prisma: any;
```

Defined in: [src/feature-flag.module.ts:33](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.module.ts#L33)

<a id="api-useridextractor-1"></a>

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

[`FeatureFlagModuleOptions`](#api-featureflagmoduleoptions).[`userIdExtractor`](#api-useridextractor)

***

<a id="api-featureflagrepository"></a>

### FeatureFlagRepository

Defined in: [src/interfaces/feature-flag-repository.interface.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L17)

#### Methods

<a id="api-archiveflag"></a>

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

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)\>

<a id="api-createflag"></a>

##### createFlag()

```ts
createFlag(input): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L18)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`CreateFeatureFlagInput`](#api-createfeatureflaginput) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)\>

<a id="api-createoverride"></a>

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
| `criteria` | [`OverrideCriteria`](#api-overridecriteria) |
| `enabled` | `boolean` |
| `priority` | `number` |

###### Returns

`Promise`\<`void`\>

<a id="api-deleteoverride"></a>

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

<a id="api-findallactiveflags"></a>

##### findAllActiveFlags()

```ts
findAllActiveFlags(): Promise<FeatureFlagWithOverrides[]>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L23)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)[]\>

<a id="api-findflagbykey"></a>

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

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides) \| `null`\>

<a id="api-findflagidbykey"></a>

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

<a id="api-findoverride"></a>

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
| `criteria` | [`OverrideCriteria`](#api-overridecriteria) |

###### Returns

`Promise`\<
  \| \{
  `id`: `string`;
\}
  \| `null`\>

<a id="api-updateflag"></a>

##### updateFlag()

```ts
updateFlag(key, input): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:19](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L19)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `input` | [`UpdateFeatureFlagInput`](#api-updatefeatureflaginput) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#api-featureflagwithoverrides)\>

<a id="api-updateoverride"></a>

##### updateOverride()

```ts
updateOverride(id, input): Promise<void>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L31)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `input` | [`UpdateOverrideInput`](#api-updateoverrideinput) |

###### Returns

`Promise`\<`void`\>

***

<a id="api-featureflagwithoverrides"></a>

### FeatureFlagWithOverrides

Defined in: [src/interfaces/feature-flag.interface.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L36)

#### Properties

<a id="api-archivedat"></a>

##### archivedAt

```ts
archivedAt: Date | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:43](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L43)

<a id="api-createdat"></a>

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/feature-flag.interface.ts:44](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L44)

<a id="api-description-1"></a>

##### description

```ts
description: string | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:39](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L39)

<a id="api-enabled-1"></a>

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:40](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L40)

<a id="api-id"></a>

##### id

```ts
id: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:37](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L37)

<a id="api-key-1"></a>

##### key

```ts
key: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:38](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L38)

<a id="api-metadata-1"></a>

##### metadata

```ts
metadata: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:42](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L42)

<a id="api-overrides"></a>

##### overrides

```ts
overrides: FlagOverride[];
```

Defined in: [src/interfaces/feature-flag.interface.ts:46](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L46)

<a id="api-percentage-1"></a>

##### percentage

```ts
percentage: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:41](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L41)

<a id="api-updatedat"></a>

##### updatedAt

```ts
updatedAt: Date;
```

Defined in: [src/interfaces/feature-flag.interface.ts:45](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L45)

***

<a id="api-flagdefinition"></a>

### FlagDefinition

Defined in: [src/interfaces/flag-registry.interface.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L13)

#### Extends

- [`FeatureFlagLifecycleMetadata`](#api-featureflaglifecyclemetadata)

#### Properties

<a id="api-bucketby-1"></a>

##### bucketBy?

```ts
optional bucketBy?: BucketBy;
```

Defined in: [src/interfaces/flag-registry.interface.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L16)

<a id="api-defaultvalue-2"></a>

##### defaultValue

```ts
defaultValue: boolean;
```

Defined in: [src/interfaces/flag-registry.interface.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L14)

<a id="api-description-2"></a>

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/flag-registry.interface.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L15)

<a id="api-expiresat-1"></a>

##### expiresAt?

```ts
optional expiresAt?: string | Date;
```

Defined in: [src/interfaces/flag-registry.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L9)

###### Inherited from

[`FeatureFlagLifecycleMetadata`](#api-featureflaglifecyclemetadata).[`expiresAt`](#api-expiresat)

<a id="api-owner-1"></a>

##### owner?

```ts
optional owner?: string;
```

Defined in: [src/interfaces/flag-registry.interface.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L7)

###### Inherited from

[`FeatureFlagLifecycleMetadata`](#api-featureflaglifecyclemetadata).[`owner`](#api-owner)

<a id="api-staleat-1"></a>

##### staleAt?

```ts
optional staleAt?: string | Date;
```

Defined in: [src/interfaces/flag-registry.interface.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L10)

###### Inherited from

[`FeatureFlagLifecycleMetadata`](#api-featureflaglifecyclemetadata).[`staleAt`](#api-staleat)

<a id="api-tags-1"></a>

##### tags?

```ts
optional tags?: readonly string[];
```

Defined in: [src/interfaces/flag-registry.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L8)

###### Inherited from

[`FeatureFlagLifecycleMetadata`](#api-featureflaglifecyclemetadata).[`tags`](#api-tags)

<a id="api-trackexposure-1"></a>

##### trackExposure?

```ts
optional trackExposure?: boolean;
```

Defined in: [src/interfaces/flag-registry.interface.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L17)

<a id="api-type-1"></a>

##### type?

```ts
optional type?: FeatureFlagType;
```

Defined in: [src/interfaces/flag-registry.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L6)

###### Inherited from

[`FeatureFlagLifecycleMetadata`](#api-featureflaglifecyclemetadata).[`type`](#api-type)

***

<a id="api-flagevaluatedevent"></a>

### FlagEvaluatedEvent

Defined in: [src/events/feature-flag.events.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L18)

#### Properties

<a id="api-bucket-1"></a>

##### bucket?

```ts
optional bucket?: number;
```

Defined in: [src/events/feature-flag.events.ts:29](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L29)

<a id="api-context"></a>

##### context?

```ts
optional context?: EvaluationContext;
```

Defined in: [src/events/feature-flag.events.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L22)

<a id="api-defaultused-1"></a>

##### defaultUsed?

```ts
optional defaultUsed?: boolean;
```

Defined in: [src/events/feature-flag.events.ts:25](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L25)

<a id="api-errorcode-1"></a>

##### errorCode?

```ts
optional errorCode?: string;
```

Defined in: [src/events/feature-flag.events.ts:26](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L26)

<a id="api-errormessage-1"></a>

##### errorMessage?

```ts
optional errorMessage?: string;
```

Defined in: [src/events/feature-flag.events.ts:27](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L27)

<a id="api-evaluationtimems-1"></a>

##### evaluationTimeMs

```ts
evaluationTimeMs: number;
```

Defined in: [src/events/feature-flag.events.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L31)

<a id="api-flagkey-1"></a>

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/events/feature-flag.events.ts:19](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L19)

<a id="api-matchedoverrideid-1"></a>

##### matchedOverrideId?

```ts
optional matchedOverrideId?: string;
```

Defined in: [src/events/feature-flag.events.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L28)

<a id="api-reason-1"></a>

##### reason?

```ts
optional reason?: EvaluationReason;
```

Defined in: [src/events/feature-flag.events.ts:24](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L24)

<a id="api-result-1"></a>

##### result

```ts
result: boolean;
```

Defined in: [src/events/feature-flag.events.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L20)

<a id="api-source-1"></a>

##### source

```ts
source: EvaluationSource;
```

Defined in: [src/events/feature-flag.events.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L23)

<a id="api-targetingkey-2"></a>

##### targetingKey?

```ts
optional targetingKey?: string;
```

Defined in: [src/events/feature-flag.events.ts:30](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L30)

<a id="api-value-1"></a>

##### value?

```ts
optional value?: boolean;
```

Defined in: [src/events/feature-flag.events.ts:21](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L21)

***

<a id="api-flagevaluatoroptions"></a>

### FlagEvaluatorOptions

Defined in: [src/interfaces/evaluation-details.interface.ts:47](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L47)

#### Properties

<a id="api-bucketby-2"></a>

##### bucketBy?

```ts
optional bucketBy?: BucketBy;
```

Defined in: [src/interfaces/evaluation-details.interface.ts:48](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L48)

***

<a id="api-flagexposedevent"></a>

### FlagExposedEvent

Defined in: [src/events/feature-flag.events.ts:34](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L34)

#### Properties

<a id="api-bucket-2"></a>

##### bucket?

```ts
optional bucket?: number;
```

Defined in: [src/events/feature-flag.events.ts:43](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L43)

<a id="api-context-1"></a>

##### context?

```ts
optional context?: EvaluationContext;
```

Defined in: [src/events/feature-flag.events.ts:41](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L41)

<a id="api-defaultused-2"></a>

##### defaultUsed

```ts
defaultUsed: boolean;
```

Defined in: [src/events/feature-flag.events.ts:40](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L40)

<a id="api-evaluationtimems-2"></a>

##### evaluationTimeMs?

```ts
optional evaluationTimeMs?: number;
```

Defined in: [src/events/feature-flag.events.ts:45](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L45)

<a id="api-flagkey-2"></a>

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/events/feature-flag.events.ts:35](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L35)

<a id="api-matchedoverrideid-2"></a>

##### matchedOverrideId?

```ts
optional matchedOverrideId?: string;
```

Defined in: [src/events/feature-flag.events.ts:42](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L42)

<a id="api-reason-2"></a>

##### reason

```ts
reason: EvaluationReason;
```

Defined in: [src/events/feature-flag.events.ts:39](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L39)

<a id="api-result-2"></a>

##### result

```ts
result: boolean;
```

Defined in: [src/events/feature-flag.events.ts:37](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L37)

<a id="api-source-2"></a>

##### source

```ts
source: EvaluationSource;
```

Defined in: [src/events/feature-flag.events.ts:38](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L38)

<a id="api-targetingkey-3"></a>

##### targetingKey?

```ts
optional targetingKey?: string;
```

Defined in: [src/events/feature-flag.events.ts:44](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L44)

<a id="api-value-2"></a>

##### value

```ts
value: boolean;
```

Defined in: [src/events/feature-flag.events.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L36)

***

<a id="api-flaglifecyclestatus"></a>

### FlagLifecycleStatus

Defined in: [src/flag-registry.ts:40](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L40)

#### Extends

- [`FeatureFlagLifecycleMetadata`](#api-featureflaglifecyclemetadata)

#### Properties

<a id="api-expiresat-2"></a>

##### expiresAt?

```ts
optional expiresAt?: Date;
```

Defined in: [src/flag-registry.ts:44](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L44)

###### Overrides

[`FeatureFlagLifecycleMetadata`](#api-featureflaglifecyclemetadata).[`expiresAt`](#api-expiresat)

<a id="api-owner-2"></a>

##### owner?

```ts
optional owner?: string;
```

Defined in: [src/interfaces/flag-registry.interface.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L7)

###### Inherited from

[`FeatureFlagLifecycleMetadata`](#api-featureflaglifecyclemetadata).[`owner`](#api-owner)

<a id="api-staleat-2"></a>

##### staleAt?

```ts
optional staleAt?: Date;
```

Defined in: [src/flag-registry.ts:43](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L43)

###### Overrides

[`FeatureFlagLifecycleMetadata`](#api-featureflaglifecyclemetadata).[`staleAt`](#api-staleat)

<a id="api-status"></a>

##### status

```ts
status: FlagLifecycleStatusName;
```

Defined in: [src/flag-registry.ts:41](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L41)

<a id="api-tags-2"></a>

##### tags

```ts
tags: string[];
```

Defined in: [src/flag-registry.ts:42](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L42)

###### Overrides

[`FeatureFlagLifecycleMetadata`](#api-featureflaglifecyclemetadata).[`tags`](#api-tags)

<a id="api-type-2"></a>

##### type?

```ts
optional type?: FeatureFlagType;
```

Defined in: [src/interfaces/flag-registry.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L6)

###### Inherited from

[`FeatureFlagLifecycleMetadata`](#api-featureflaglifecyclemetadata).[`type`](#api-type)

***

<a id="api-flagmutationevent"></a>

### FlagMutationEvent

Defined in: [src/events/feature-flag.events.ts:48](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L48)

#### Properties

<a id="api-action"></a>

##### action

```ts
action: "created" | "updated" | "archived";
```

Defined in: [src/events/feature-flag.events.ts:50](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L50)

<a id="api-actorid"></a>

##### actorId?

```ts
optional actorId?: string;
```

Defined in: [src/events/feature-flag.events.ts:51](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L51)

<a id="api-actortype"></a>

##### actorType?

```ts
optional actorType?: string;
```

Defined in: [src/events/feature-flag.events.ts:52](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L52)

<a id="api-correlationid"></a>

##### correlationId?

```ts
optional correlationId?: string;
```

Defined in: [src/events/feature-flag.events.ts:55](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L55)

<a id="api-flagkey-4"></a>

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/events/feature-flag.events.ts:49](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L49)

<a id="api-reason-3"></a>

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/events/feature-flag.events.ts:53](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L53)

<a id="api-requestid"></a>

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/events/feature-flag.events.ts:54](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L54)

***

<a id="api-flagmutationmetadata"></a>

### FlagMutationMetadata

Defined in: [src/interfaces/feature-flag.interface.ts:63](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L63)

#### Properties

<a id="api-actorid-1"></a>

##### actorId?

```ts
optional actorId?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:64](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L64)

<a id="api-actortype-1"></a>

##### actorType?

```ts
optional actorType?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:65](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L65)

<a id="api-correlationid-1"></a>

##### correlationId?

```ts
optional correlationId?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:68](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L68)

<a id="api-reason-4"></a>

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:66](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L66)

<a id="api-requestid-1"></a>

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:67](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L67)

***

<a id="api-flagoverride"></a>

### FlagOverride

Defined in: [src/interfaces/feature-flag.interface.ts:49](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L49)

#### Properties

<a id="api-attributes-1"></a>

##### attributes

```ts
attributes: TargetingAttributes;
```

Defined in: [src/interfaces/feature-flag.interface.ts:52](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L52)

<a id="api-createdat-1"></a>

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/feature-flag.interface.ts:55](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L55)

<a id="api-enabled-2"></a>

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:54](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L54)

<a id="api-flagid"></a>

##### flagId

```ts
flagId: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:51](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L51)

<a id="api-id-1"></a>

##### id

```ts
id: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:50](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L50)

<a id="api-priority"></a>

##### priority

```ts
priority: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:53](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L53)

<a id="api-updatedat-1"></a>

##### updatedAt

```ts
updatedAt: Date;
```

Defined in: [src/interfaces/feature-flag.interface.ts:56](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L56)

***

<a id="api-flagoverrideevent"></a>

### FlagOverrideEvent

Defined in: [src/events/feature-flag.events.ts:58](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L58)

#### Properties

<a id="api-action-1"></a>

##### action

```ts
action: "set" | "removed";
```

Defined in: [src/events/feature-flag.events.ts:63](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L63)

<a id="api-actorid-2"></a>

##### actorId?

```ts
optional actorId?: string;
```

Defined in: [src/events/feature-flag.events.ts:64](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L64)

<a id="api-actortype-2"></a>

##### actorType?

```ts
optional actorType?: string;
```

Defined in: [src/events/feature-flag.events.ts:65](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L65)

<a id="api-attributes-2"></a>

##### attributes

```ts
attributes: Record<string, string | number | boolean | null>;
```

Defined in: [src/events/feature-flag.events.ts:60](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L60)

<a id="api-correlationid-2"></a>

##### correlationId?

```ts
optional correlationId?: string;
```

Defined in: [src/events/feature-flag.events.ts:68](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L68)

<a id="api-enabled-3"></a>

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/events/feature-flag.events.ts:61](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L61)

<a id="api-flagkey-5"></a>

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/events/feature-flag.events.ts:59](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L59)

<a id="api-priority-1"></a>

##### priority?

```ts
optional priority?: number;
```

Defined in: [src/events/feature-flag.events.ts:62](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L62)

<a id="api-reason-5"></a>

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/events/feature-flag.events.ts:66](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L66)

<a id="api-requestid-2"></a>

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/events/feature-flag.events.ts:67](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L67)

***

<a id="api-overridecriteria"></a>

### OverrideCriteria

Defined in: [src/interfaces/feature-flag-repository.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L8)

#### Properties

<a id="api-attributes-3"></a>

##### attributes

```ts
attributes: TargetingAttributes;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L9)

***

<a id="api-rediscacheadapteroptions"></a>

### RedisCacheAdapterOptions

Defined in: [src/cache/redis-cache.adapter.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L6)

#### Properties

<a id="api-channel"></a>

##### channel?

```ts
optional channel?: string;
```

Defined in: [src/cache/redis-cache.adapter.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L10)

<a id="api-client"></a>

##### client

```ts
client: Redis;
```

Defined in: [src/cache/redis-cache.adapter.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L7)

<a id="api-keyprefix"></a>

##### keyPrefix?

```ts
optional keyPrefix?: string;
```

Defined in: [src/cache/redis-cache.adapter.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L9)

<a id="api-subscriber"></a>

##### subscriber?

```ts
optional subscriber?: Redis;
```

Defined in: [src/cache/redis-cache.adapter.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/cache/redis-cache.adapter.ts#L8)

***

<a id="api-removeoverrideinput"></a>

### RemoveOverrideInput

Defined in: [src/interfaces/feature-flag.interface.ts:59](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L59)

#### Properties

<a id="api-attributes-4"></a>

##### attributes

```ts
attributes: TargetingAttributes;
```

Defined in: [src/interfaces/feature-flag.interface.ts:60](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L60)

***

<a id="api-setoverrideinput"></a>

### SetOverrideInput

Defined in: [src/interfaces/feature-flag.interface.ts:19](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L19)

#### Properties

<a id="api-attributes-5"></a>

##### attributes

```ts
attributes: TargetingAttributes;
```

Defined in: [src/interfaces/feature-flag.interface.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L20)

<a id="api-enabled-4"></a>

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:21](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L21)

<a id="api-priority-2"></a>

##### priority?

```ts
optional priority?: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L22)

***

<a id="api-tenantcontextprovider"></a>

### TenantContextProvider

Defined in: [src/interfaces/tenant-context-provider.interface.ts:1](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/tenant-context-provider.interface.ts#L1)

#### Methods

<a id="api-getcurrenttenantid"></a>

##### getCurrentTenantId()

```ts
getCurrentTenantId(): string | null;
```

Defined in: [src/interfaces/tenant-context-provider.interface.ts:2](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/tenant-context-provider.interface.ts#L2)

###### Returns

`string` \| `null`

***

<a id="api-typedfeatureflagclient"></a>

### TypedFeatureFlagClient

Defined in: [src/flag-registry.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L15)

#### Type Parameters

| Type Parameter |
| ------ |
| `TFlags` *extends* [`FlagRegistry`](#api-flagregistry) |

#### Properties

<a id="api-registry"></a>

##### registry

```ts
registry: TFlags;
```

Defined in: [src/flag-registry.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L28)

#### Methods

<a id="api-evaluateboolean-1"></a>

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
| `context?` | [`EvaluationContext`](#api-evaluationcontext) |
| `options?` | [`EvaluateBooleanOptions`](#api-evaluatebooleanoptions) |

###### Returns

`Promise`\<[`BooleanEvaluationDetails`](#api-booleanevaluationdetails)\>

<a id="api-isenabled-1"></a>

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
| `context?` | [`EvaluationContext`](#api-evaluationcontext) |
| `options?` | [`EvaluateBooleanOptions`](#api-evaluatebooleanoptions) |

###### Returns

`Promise`\<`boolean`\>

***

<a id="api-typedfeatureflagdecorators"></a>

### TypedFeatureFlagDecorators

Defined in: [src/flag-registry.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L31)

#### Type Parameters

| Type Parameter |
| ------ |
| `TFlags` *extends* [`FlagRegistry`](#api-flagregistry) |

#### Methods

<a id="api-featureflag-3"></a>

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
| `options?` | [`FeatureFlagGuardOptions`](#api-featureflagguardoptions) |

###### Returns

`ClassDecorator` & `MethodDecorator`

***

<a id="api-updatefeatureflaginput"></a>

### UpdateFeatureFlagInput

Defined in: [src/interfaces/feature-flag.interface.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L12)

#### Properties

<a id="api-description-3"></a>

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L13)

<a id="api-enabled-5"></a>

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L14)

<a id="api-metadata-2"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L16)

<a id="api-percentage-2"></a>

##### percentage?

```ts
optional percentage?: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L15)

***

<a id="api-updateoverrideinput"></a>

### UpdateOverrideInput

Defined in: [src/interfaces/feature-flag-repository.interface.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L12)

#### Properties

<a id="api-enabled-6"></a>

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L13)

<a id="api-priority-3"></a>

##### priority

```ts
priority: number;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag-repository.interface.ts#L14)

## Type Aliases

<a id="api-bucketby"></a>

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

<a id="api-evaluationreason"></a>

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

<a id="api-evaluationsource"></a>

### EvaluationSource

```ts
type EvaluationSource = "override" | "percentage" | "global" | "default";
```

Defined in: [src/interfaces/evaluation-details.interface.ts:1](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/evaluation-details.interface.ts#L1)

***

<a id="api-featureflagtype"></a>

### FeatureFlagType

```ts
type FeatureFlagType = "release" | "experiment" | "ops" | "permission";
```

Defined in: [src/interfaces/flag-registry.interface.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L3)

***

<a id="api-flagkey-3"></a>

### FlagKey

```ts
type FlagKey<TFlags> = Extract<keyof TFlags, string>;
```

Defined in: [src/interfaces/flag-registry.interface.ts:21](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L21)

#### Type Parameters

| Type Parameter |
| ------ |
| `TFlags` *extends* [`FlagRegistry`](#api-flagregistry) |

***

<a id="api-flaglifecyclestatusname"></a>

### FlagLifecycleStatusName

```ts
type FlagLifecycleStatusName = "active" | "stale" | "expired";
```

Defined in: [src/flag-registry.ts:38](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L38)

***

<a id="api-flagregistry"></a>

### FlagRegistry

```ts
type FlagRegistry = Record<string, FlagDefinition>;
```

Defined in: [src/interfaces/flag-registry.interface.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/flag-registry.interface.ts#L20)

***

<a id="api-targetingattributes"></a>

### TargetingAttributes

```ts
type TargetingAttributes = Record<string, TargetingAttributeValue>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:2](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L2)

***

<a id="api-targetingattributevalue"></a>

### TargetingAttributeValue

```ts
type TargetingAttributeValue = string | number | boolean | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:1](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/interfaces/feature-flag.interface.ts#L1)

## Variables

<a id="api-cache_adapter"></a>

### CACHE\_ADAPTER

```ts
const CACHE_ADAPTER: typeof CACHE_ADAPTER;
```

Defined in: [src/feature-flag.constants.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.constants.ts#L9)

***

<a id="api-feature_flag_module_options"></a>

### FEATURE\_FLAG\_MODULE\_OPTIONS

```ts
const FEATURE_FLAG_MODULE_OPTIONS: typeof FEATURE_FLAG_MODULE_OPTIONS;
```

Defined in: [src/feature-flag.constants.ts:1](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.constants.ts#L1)

***

<a id="api-feature_flag_repository"></a>

### FEATURE\_FLAG\_REPOSITORY

```ts
const FEATURE_FLAG_REPOSITORY: typeof FEATURE_FLAG_REPOSITORY;
```

Defined in: [src/feature-flag.constants.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.constants.ts#L10)

***

<a id="api-featureflagevents"></a>

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
| <a id="api-property-archived"></a> `ARCHIVED` | `"feature-flag.archived"` | `'feature-flag.archived'` | [src/events/feature-flag.events.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L12) |
| <a id="api-property-cache_invalidated"></a> `CACHE_INVALIDATED` | `"feature-flag.cache.invalidated"` | `'feature-flag.cache.invalidated'` | [src/events/feature-flag.events.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L15) |
| <a id="api-property-created"></a> `CREATED` | `"feature-flag.created"` | `'feature-flag.created'` | [src/events/feature-flag.events.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L10) |
| <a id="api-property-evaluated"></a> `EVALUATED` | `"feature-flag.evaluated"` | `'feature-flag.evaluated'` | [src/events/feature-flag.events.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L8) |
| <a id="api-property-exposed"></a> `EXPOSED` | `"feature-flag.exposed"` | `'feature-flag.exposed'` | [src/events/feature-flag.events.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L9) |
| <a id="api-property-override_removed"></a> `OVERRIDE_REMOVED` | `"feature-flag.override.removed"` | `'feature-flag.override.removed'` | [src/events/feature-flag.events.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L14) |
| <a id="api-property-override_set"></a> `OVERRIDE_SET` | `"feature-flag.override.set"` | `'feature-flag.override.set'` | [src/events/feature-flag.events.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L13) |
| <a id="api-property-updated"></a> `UPDATED` | `"feature-flag.updated"` | `'feature-flag.updated'` | [src/events/feature-flag.events.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/events/feature-flag.events.ts#L11) |

***

<a id="api-tenant_context_provider"></a>

### TENANT\_CONTEXT\_PROVIDER

```ts
const TENANT_CONTEXT_PROVIDER: typeof TENANT_CONTEXT_PROVIDER;
```

Defined in: [src/feature-flag.constants.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/feature-flag.constants.ts#L11)

## Functions

<a id="api-bypassfeatureflag"></a>

### BypassFeatureFlag()

```ts
function BypassFeatureFlag(): CustomDecorator<string>;
```

Defined in: [src/decorators/bypass-feature-flag.decorator.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/decorators/bypass-feature-flag.decorator.ts#L4)

#### Returns

`CustomDecorator`\<`string`\>

***

<a id="api-createfeatureflagclient"></a>

### createFeatureFlagClient()

```ts
function createFeatureFlagClient<TFlags>(service, registry): TypedFeatureFlagClient<TFlags>;
```

Defined in: [src/flag-registry.ts:51](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L51)

#### Type Parameters

| Type Parameter |
| ------ |
| `TFlags` *extends* [`FlagRegistry`](#api-flagregistry) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `service` | [`FeatureFlagService`](#api-featureflagservice) |
| `registry` | `TFlags` |

#### Returns

[`TypedFeatureFlagClient`](#api-typedfeatureflagclient)\<`TFlags`\>

***

<a id="api-createfeatureflagdecorators"></a>

### createFeatureFlagDecorators()

```ts
function createFeatureFlagDecorators<TFlags>(registry): TypedFeatureFlagDecorators<TFlags>;
```

Defined in: [src/flag-registry.ts:68](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L68)

#### Type Parameters

| Type Parameter |
| ------ |
| `TFlags` *extends* [`FlagRegistry`](#api-flagregistry) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `registry` | `TFlags` |

#### Returns

[`TypedFeatureFlagDecorators`](#api-typedfeatureflagdecorators)\<`TFlags`\>

***

<a id="api-defineflags"></a>

### defineFlags()

```ts
function defineFlags<TFlags>(flags): TFlags;
```

Defined in: [src/flag-registry.ts:47](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L47)

#### Type Parameters

| Type Parameter |
| ------ |
| `TFlags` *extends* [`FlagRegistry`](#api-flagregistry) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `flags` | `TFlags` |

#### Returns

`TFlags`

***

<a id="api-featureflag"></a>

### FeatureFlag()

```ts
function FeatureFlag(flagKey, options?): ClassDecorator & MethodDecorator;
```

Defined in: [src/decorators/feature-flag.decorator.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/decorators/feature-flag.decorator.ts#L6)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `string` |
| `options` | [`FeatureFlagGuardOptions`](#api-featureflagguardoptions) |

#### Returns

`ClassDecorator` & `MethodDecorator`

***

<a id="api-getflaglifecyclestatus"></a>

### getFlagLifecycleStatus()

```ts
function getFlagLifecycleStatus(metadata, now?): FlagLifecycleStatus;
```

Defined in: [src/flag-registry.ts:80](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/flag-registry.ts#L80)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `metadata` | [`FeatureFlagLifecycleMetadata`](#api-featureflaglifecyclemetadata) |
| `now` | `Date` |

#### Returns

[`FlagLifecycleStatus`](#api-flaglifecyclestatus)
