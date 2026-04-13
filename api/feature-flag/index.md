# index

## Classes

### FeatureFlagAdminModule

Defined in: [src/admin/feature-flag-admin.module.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/admin/feature-flag-admin.module.ts#L6)

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

Defined in: [src/admin/feature-flag-admin.module.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/admin/feature-flag-admin.module.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`FeatureFlagAdminOptions`](#featureflagadminoptions) |

###### Returns

`DynamicModule`

***

### FeatureFlagGuard

Defined in: [src/guards/feature-flag.guard.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/guards/feature-flag.guard.ts#L12)

#### Implements

- `CanActivate`

#### Constructors

##### Constructor

```ts
new FeatureFlagGuard(reflector, featureFlagService): FeatureFlagGuard;
```

Defined in: [src/guards/feature-flag.guard.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/guards/feature-flag.guard.ts#L13)

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

Defined in: [src/guards/feature-flag.guard.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/guards/feature-flag.guard.ts#L18)

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

Defined in: [src/feature-flag.module.ts:54](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/feature-flag.module.ts#L54)

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

Defined in: [src/feature-flag.module.ts:55](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/feature-flag.module.ts#L55)

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

Defined in: [src/feature-flag.module.ts:61](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/feature-flag.module.ts#L61)

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

Defined in: [src/feature-flag.module.ts:105](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/feature-flag.module.ts#L105)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`FeatureFlagModuleRootAsyncOptions`](#featureflagmodulerootasyncoptions) |

###### Returns

`DynamicModule`

***

### FeatureFlagService

Defined in: [src/services/feature-flag.service.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/services/feature-flag.service.ts#L22)

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

Defined in: [src/services/feature-flag.service.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/services/feature-flag.service.ts#L23)

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
archive(key): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/services/feature-flag.service.ts:84](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/services/feature-flag.service.ts#L84)

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

Defined in: [src/services/feature-flag.service.ts:70](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/services/feature-flag.service.ts#L70)

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

Defined in: [src/services/feature-flag.service.ts:58](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/services/feature-flag.service.ts#L58)

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

Defined in: [src/services/feature-flag.service.ts:118](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/services/feature-flag.service.ts#L118)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)[]\>

##### findByKey()

```ts
findByKey(key): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/services/feature-flag.service.ts:127](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/services/feature-flag.service.ts#L127)

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

Defined in: [src/services/feature-flag.service.ts:122](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/services/feature-flag.service.ts#L122)

###### Returns

`Promise`\<`void`\>

##### isEnabled()

```ts
isEnabled(flagKey, explicitContext?): Promise<boolean>;
```

Defined in: [src/services/feature-flag.service.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/services/feature-flag.service.ts#L36)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `string` |
| `explicitContext?` | [`EvaluationContext`](#evaluationcontext) |

###### Returns

`Promise`\<`boolean`\>

##### removeOverride()

```ts
removeOverride(key, input): Promise<void>;
```

Defined in: [src/services/feature-flag.service.ts:135](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/services/feature-flag.service.ts#L135)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `input` | [`RemoveOverrideInput`](#removeoverrideinput) |

###### Returns

`Promise`\<`void`\>

##### setOverride()

```ts
setOverride(key, input): Promise<void>;
```

Defined in: [src/services/feature-flag.service.ts:91](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/services/feature-flag.service.ts#L91)

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

Defined in: [src/services/feature-flag.service.ts:77](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/services/feature-flag.service.ts#L77)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `input` | [`UpdateFeatureFlagInput`](#updatefeatureflaginput) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

***

### FlagContext

Defined in: [src/services/flag-context.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/services/flag-context.ts#L9)

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

Defined in: [src/services/flag-context.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/services/flag-context.ts#L16)

###### Returns

`string` \| `null`

##### run()

```ts
run<T>(store, callback): T;
```

Defined in: [src/services/flag-context.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/services/flag-context.ts#L12)

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

Defined in: [src/cache/memory-cache.adapter.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/memory-cache.adapter.ts#L11)

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

Defined in: [src/cache/memory-cache.adapter.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/memory-cache.adapter.ts#L15)

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

Defined in: [src/cache/memory-cache.adapter.ts:30](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/memory-cache.adapter.ts#L30)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)[] \| `null`\>

###### Implementation of

[`CacheAdapter`](#cacheadapter).[`getAll`](#getall)

##### invalidate()

```ts
invalidate(key?): Promise<void>;
```

Defined in: [src/cache/memory-cache.adapter.ts:44](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/memory-cache.adapter.ts#L44)

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

Defined in: [src/cache/memory-cache.adapter.ts:25](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/memory-cache.adapter.ts#L25)

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

Defined in: [src/cache/memory-cache.adapter.ts:39](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/memory-cache.adapter.ts#L39)

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

Defined in: [src/repositories/prisma-feature-flag.repository.ts:27](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/repositories/prisma-feature-flag.repository.ts#L27)

#### Implements

- [`FeatureFlagRepository`](#featureflagrepository)

#### Constructors

##### Constructor

```ts
new PrismaFeatureFlagRepository(prisma): PrismaFeatureFlagRepository;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/repositories/prisma-feature-flag.repository.ts#L28)

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

Defined in: [src/repositories/prisma-feature-flag.repository.ts:79](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/repositories/prisma-feature-flag.repository.ts#L79)

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

Defined in: [src/repositories/prisma-feature-flag.repository.ts:30](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/repositories/prisma-feature-flag.repository.ts#L30)

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
enabled): Promise<void>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:121](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/repositories/prisma-feature-flag.repository.ts#L121)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagId` | `string` |
| `criteria` | [`OverrideCriteria`](#overridecriteria) |
| `enabled` | `boolean` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`FeatureFlagRepository`](#featureflagrepository).[`createOverride`](#createoverride)

##### deleteOverride()

```ts
deleteOverride(id): Promise<void>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:152](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/repositories/prisma-feature-flag.repository.ts#L152)

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

Defined in: [src/repositories/prisma-feature-flag.repository.ts:106](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/repositories/prisma-feature-flag.repository.ts#L106)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)[]\>

###### Implementation of

[`FeatureFlagRepository`](#featureflagrepository).[`findAllActiveFlags`](#findallactiveflags)

##### findFlagByKey()

```ts
findFlagByKey(key): Promise<FeatureFlagWithOverrides | null>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:94](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/repositories/prisma-feature-flag.repository.ts#L94)

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

Defined in: [src/repositories/prisma-feature-flag.repository.ts:101](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/repositories/prisma-feature-flag.repository.ts#L101)

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

Defined in: [src/repositories/prisma-feature-flag.repository.ts:114](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/repositories/prisma-feature-flag.repository.ts#L114)

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

Defined in: [src/repositories/prisma-feature-flag.repository.ts:55](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/repositories/prisma-feature-flag.repository.ts#L55)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `input` | [`UpdateFeatureFlagInput`](#updatefeatureflaginput) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

###### Implementation of

[`FeatureFlagRepository`](#featureflagrepository).[`updateFlag`](#updateflag)

##### updateOverrideEnabled()

```ts
updateOverrideEnabled(id, enabled): Promise<void>;
```

Defined in: [src/repositories/prisma-feature-flag.repository.ts:145](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/repositories/prisma-feature-flag.repository.ts#L145)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `enabled` | `boolean` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`FeatureFlagRepository`](#featureflagrepository).[`updateOverrideEnabled`](#updateoverrideenabled)

***

### RedisCacheAdapter

Defined in: [src/cache/redis-cache.adapter.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/redis-cache.adapter.ts#L14)

#### Implements

- [`CacheAdapter`](#cacheadapter)

#### Constructors

##### Constructor

```ts
new RedisCacheAdapter(options): RedisCacheAdapter;
```

Defined in: [src/cache/redis-cache.adapter.ts:21](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/redis-cache.adapter.ts#L21)

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

Defined in: [src/cache/redis-cache.adapter.ts:50](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/redis-cache.adapter.ts#L50)

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

Defined in: [src/cache/redis-cache.adapter.ts:61](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/redis-cache.adapter.ts#L61)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)[] \| `null`\>

###### Implementation of

[`CacheAdapter`](#cacheadapter).[`getAll`](#getall)

##### invalidate()

```ts
invalidate(key?): Promise<void>;
```

Defined in: [src/cache/redis-cache.adapter.ts:72](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/redis-cache.adapter.ts#L72)

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

Defined in: [src/cache/redis-cache.adapter.ts:83](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/redis-cache.adapter.ts#L83)

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

Defined in: [src/cache/redis-cache.adapter.ts:56](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/redis-cache.adapter.ts#L56)

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

Defined in: [src/cache/redis-cache.adapter.ts:67](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/redis-cache.adapter.ts#L67)

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

### CacheAdapter

Defined in: [src/interfaces/cache-adapter.interface.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/cache-adapter.interface.ts#L3)

#### Methods

##### get()

```ts
get(key): Promise<FeatureFlagWithOverrides | null>;
```

Defined in: [src/interfaces/cache-adapter.interface.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/cache-adapter.interface.ts#L4)

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

Defined in: [src/interfaces/cache-adapter.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/cache-adapter.interface.ts#L6)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)[] \| `null`\>

##### invalidate()

```ts
invalidate(key?): Promise<void>;
```

Defined in: [src/interfaces/cache-adapter.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/cache-adapter.interface.ts#L8)

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

Defined in: [src/interfaces/cache-adapter.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/cache-adapter.interface.ts#L9)

###### Returns

`Promise`\<`void`\>

##### set()

```ts
set(
   key, 
   data, 
ttlMs): Promise<void>;
```

Defined in: [src/interfaces/cache-adapter.interface.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/cache-adapter.interface.ts#L5)

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

Defined in: [src/interfaces/cache-adapter.interface.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/cache-adapter.interface.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`FeatureFlagWithOverrides`](#featureflagwithoverrides)[] |
| `ttlMs` | `number` |

###### Returns

`Promise`\<`void`\>

***

### CreateFeatureFlagInput

Defined in: [src/interfaces/feature-flag.interface.ts:1](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L1)

#### Properties

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L3)

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L4)

##### key

```ts
key: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:2](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L2)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L6)

##### percentage?

```ts
optional percentage?: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L5)

***

### EvaluationContext

Defined in: [src/interfaces/evaluation-context.interface.ts:1](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/evaluation-context.interface.ts#L1)

#### Properties

##### environment?

```ts
optional environment?: string;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/evaluation-context.interface.ts#L9)

Environment — auto-injected from module options. Can be explicitly overridden

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/evaluation-context.interface.ts#L6)

Tenant ID — used for tenant overrides. Ignored if tenancy is not installed

##### userId?

```ts
optional userId?: string | null;
```

Defined in: [src/interfaces/evaluation-context.interface.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/evaluation-context.interface.ts#L3)

User ID — used for user overrides and percentage hash

***

### FeatureFlagAdminOptions

Defined in: [src/admin/admin-options.interface.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/admin/admin-options.interface.ts#L3)

#### Properties

##### guard

```ts
guard: Type<CanActivate>;
```

Defined in: [src/admin/admin-options.interface.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/admin/admin-options.interface.ts#L4)

##### path?

```ts
optional path?: string;
```

Defined in: [src/admin/admin-options.interface.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/admin/admin-options.interface.ts#L5)

***

### FeatureFlagGuardOptions

Defined in: [src/interfaces/feature-flag.interface.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L23)

#### Properties

##### fallback?

```ts
optional fallback?: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L28)

Response body when flag is OFF

##### statusCode?

```ts
optional statusCode?: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:25](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L25)

HTTP status code when flag is OFF. Default: 403

***

### FeatureFlagModuleAsyncOptions

Defined in: [src/interfaces/feature-flag-options.interface.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L31)

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

Defined in: [src/interfaces/feature-flag-options.interface.ts:32](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L32)

##### useClass?

```ts
optional useClass?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:34](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L34)

##### useExisting?

```ts
optional useExisting?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:35](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L35)

##### useFactory?

```ts
optional useFactory?: (...args) => 
  | FeatureFlagModuleOptions
| Promise<FeatureFlagModuleOptions>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:33](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L33)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`FeatureFlagModuleOptions`](#featureflagmoduleoptions)
  \| `Promise`\<[`FeatureFlagModuleOptions`](#featureflagmoduleoptions)\>

***

### FeatureFlagModuleOptions

Defined in: [src/interfaces/feature-flag-options.interface.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L5)

#### Extended by

- [`FeatureFlagModuleRootOptions`](#featureflagmodulerootoptions)

#### Properties

##### cacheAdapter?

```ts
optional cacheAdapter?: CacheAdapter;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L22)

Custom cache adapter implementation. If not provided, an in-memory cache is used.

##### cacheTtlMs?

```ts
optional cacheTtlMs?: number;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L10)

Cache TTL in milliseconds. 0 disables caching. Default: 30000

##### defaultOnMissing?

```ts
optional defaultOnMissing?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L16)

Default value when evaluating a non-existent flag. Default: false

##### emitEvents?

```ts
optional emitEvents?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:19](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L19)

Emit evaluation events via @nestjs/event-emitter. Default: false

##### environment

```ts
environment: string;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L7)

Current environment (e.g., 'development', 'staging', 'production')

##### userIdExtractor?

```ts
optional userIdExtractor?: (req) => string | null;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L13)

Extract user ID from request. Returns null if user is not authenticated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `Request` |

###### Returns

`string` \| `null`

***

### FeatureFlagModuleOptionsFactory

Defined in: [src/interfaces/feature-flag-options.interface.ts:25](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L25)

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

Defined in: [src/interfaces/feature-flag-options.interface.ts:26](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L26)

###### Returns

  \| `Promise`\<[`FeatureFlagModuleOptions`](#featureflagmoduleoptions) & \{
  `prisma`: `any`;
\}\>
  \| [`FeatureFlagModuleOptions`](#featureflagmoduleoptions) & \{
  `prisma`: `any`;
\}

***

### FeatureFlagModuleRootAsyncOptions

Defined in: [src/feature-flag.module.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/feature-flag.module.ts#L36)

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

Defined in: [src/interfaces/feature-flag-options.interface.ts:32](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L32)

###### Inherited from

[`FeatureFlagModuleAsyncOptions`](#featureflagmoduleasyncoptions).[`inject`](#inject)

##### useClass?

```ts
optional useClass?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:34](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L34)

###### Inherited from

[`FeatureFlagModuleAsyncOptions`](#featureflagmoduleasyncoptions).[`useClass`](#useclass)

##### useExisting?

```ts
optional useExisting?: Type<FeatureFlagModuleOptionsFactory>;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:35](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L35)

###### Inherited from

[`FeatureFlagModuleAsyncOptions`](#featureflagmoduleasyncoptions).[`useExisting`](#useexisting)

##### useFactory?

```ts
optional useFactory?: (...args) => 
  | FeatureFlagModuleRootOptions
| Promise<FeatureFlagModuleRootOptions>;
```

Defined in: [src/feature-flag.module.ts:37](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/feature-flag.module.ts#L37)

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

Defined in: [src/feature-flag.module.ts:32](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/feature-flag.module.ts#L32)

#### Extends

- [`FeatureFlagModuleOptions`](#featureflagmoduleoptions)

#### Properties

##### cacheAdapter?

```ts
optional cacheAdapter?: CacheAdapter;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L22)

Custom cache adapter implementation. If not provided, an in-memory cache is used.

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`cacheAdapter`](#cacheadapter-1)

##### cacheTtlMs?

```ts
optional cacheTtlMs?: number;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L10)

Cache TTL in milliseconds. 0 disables caching. Default: 30000

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`cacheTtlMs`](#cachettlms)

##### defaultOnMissing?

```ts
optional defaultOnMissing?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L16)

Default value when evaluating a non-existent flag. Default: false

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`defaultOnMissing`](#defaultonmissing)

##### emitEvents?

```ts
optional emitEvents?: boolean;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:19](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L19)

Emit evaluation events via @nestjs/event-emitter. Default: false

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`emitEvents`](#emitevents)

##### environment

```ts
environment: string;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L7)

Current environment (e.g., 'development', 'staging', 'production')

###### Inherited from

[`FeatureFlagModuleOptions`](#featureflagmoduleoptions).[`environment`](#environment-1)

##### prisma

```ts
prisma: any;
```

Defined in: [src/feature-flag.module.ts:33](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/feature-flag.module.ts#L33)

##### userIdExtractor?

```ts
optional userIdExtractor?: (req) => string | null;
```

Defined in: [src/interfaces/feature-flag-options.interface.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-options.interface.ts#L13)

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

Defined in: [src/interfaces/feature-flag-repository.interface.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-repository.interface.ts#L13)

#### Methods

##### archiveFlag()

```ts
archiveFlag(key): Promise<FeatureFlagWithOverrides>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-repository.interface.ts#L16)

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

Defined in: [src/interfaces/feature-flag-repository.interface.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-repository.interface.ts#L14)

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
enabled): Promise<void>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:21](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-repository.interface.ts#L21)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagId` | `string` |
| `criteria` | [`OverrideCriteria`](#overridecriteria) |
| `enabled` | `boolean` |

###### Returns

`Promise`\<`void`\>

##### deleteOverride()

```ts
deleteOverride(id): Promise<void>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-repository.interface.ts#L23)

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

Defined in: [src/interfaces/feature-flag-repository.interface.ts:19](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-repository.interface.ts#L19)

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)[]\>

##### findFlagByKey()

```ts
findFlagByKey(key): Promise<FeatureFlagWithOverrides | null>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-repository.interface.ts#L17)

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

Defined in: [src/interfaces/feature-flag-repository.interface.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-repository.interface.ts#L18)

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

Defined in: [src/interfaces/feature-flag-repository.interface.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-repository.interface.ts#L20)

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

Defined in: [src/interfaces/feature-flag-repository.interface.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-repository.interface.ts#L15)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `input` | [`UpdateFeatureFlagInput`](#updatefeatureflaginput) |

###### Returns

`Promise`\<[`FeatureFlagWithOverrides`](#featureflagwithoverrides)\>

##### updateOverrideEnabled()

```ts
updateOverrideEnabled(id, enabled): Promise<void>;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-repository.interface.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `enabled` | `boolean` |

###### Returns

`Promise`\<`void`\>

***

### FeatureFlagWithOverrides

Defined in: [src/interfaces/feature-flag.interface.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L31)

#### Properties

##### archivedAt

```ts
archivedAt: Date | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:38](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L38)

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/feature-flag.interface.ts:39](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L39)

##### description

```ts
description: string | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:34](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L34)

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:35](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L35)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:32](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L32)

##### key

```ts
key: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:33](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L33)

##### metadata

```ts
metadata: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:37](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L37)

##### overrides

```ts
overrides: FlagOverride[];
```

Defined in: [src/interfaces/feature-flag.interface.ts:41](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L41)

##### percentage

```ts
percentage: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:36](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L36)

##### updatedAt

```ts
updatedAt: Date;
```

Defined in: [src/interfaces/feature-flag.interface.ts:40](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L40)

***

### FlagEvaluatedEvent

Defined in: [src/events/feature-flag.events.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L13)

#### Properties

##### context

```ts
context: EvaluationContext;
```

Defined in: [src/events/feature-flag.events.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L16)

##### evaluationTimeMs

```ts
evaluationTimeMs: number;
```

Defined in: [src/events/feature-flag.events.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L18)

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/events/feature-flag.events.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L14)

##### result

```ts
result: boolean;
```

Defined in: [src/events/feature-flag.events.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L15)

##### source

```ts
source: 
  | "user_override"
  | "tenant_override"
  | "env_override"
  | "percentage"
  | "global";
```

Defined in: [src/events/feature-flag.events.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L17)

***

### FlagMutationEvent

Defined in: [src/events/feature-flag.events.ts:21](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L21)

#### Properties

##### action

```ts
action: "created" | "updated" | "archived";
```

Defined in: [src/events/feature-flag.events.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L23)

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/events/feature-flag.events.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L22)

***

### FlagOverride

Defined in: [src/interfaces/feature-flag.interface.ts:44](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L44)

#### Properties

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:50](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L50)

##### environment

```ts
environment: string | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:49](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L49)

##### flagId

```ts
flagId: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:46](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L46)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:45](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L45)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:47](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L47)

##### userId

```ts
userId: string | null;
```

Defined in: [src/interfaces/feature-flag.interface.ts:48](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L48)

***

### FlagOverrideEvent

Defined in: [src/events/feature-flag.events.ts:26](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L26)

#### Properties

##### action

```ts
action: "set" | "removed";
```

Defined in: [src/events/feature-flag.events.ts:32](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L32)

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/events/feature-flag.events.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L31)

##### environment?

```ts
optional environment?: string | null;
```

Defined in: [src/events/feature-flag.events.ts:30](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L30)

##### flagKey

```ts
flagKey: string;
```

Defined in: [src/events/feature-flag.events.ts:27](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L27)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/events/feature-flag.events.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L28)

##### userId?

```ts
optional userId?: string | null;
```

Defined in: [src/events/feature-flag.events.ts:29](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L29)

***

### OverrideCriteria

Defined in: [src/interfaces/feature-flag-repository.interface.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-repository.interface.ts#L7)

#### Properties

##### environment

```ts
environment: string | null;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-repository.interface.ts#L10)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-repository.interface.ts#L8)

##### userId

```ts
userId: string | null;
```

Defined in: [src/interfaces/feature-flag-repository.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag-repository.interface.ts#L9)

***

### RedisCacheAdapterOptions

Defined in: [src/cache/redis-cache.adapter.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/redis-cache.adapter.ts#L6)

#### Properties

##### channel?

```ts
optional channel?: string;
```

Defined in: [src/cache/redis-cache.adapter.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/redis-cache.adapter.ts#L10)

##### client

```ts
client: Redis;
```

Defined in: [src/cache/redis-cache.adapter.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/redis-cache.adapter.ts#L7)

##### keyPrefix?

```ts
optional keyPrefix?: string;
```

Defined in: [src/cache/redis-cache.adapter.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/redis-cache.adapter.ts#L9)

##### subscriber?

```ts
optional subscriber?: Redis;
```

Defined in: [src/cache/redis-cache.adapter.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/cache/redis-cache.adapter.ts#L8)

***

### RemoveOverrideInput

Defined in: [src/interfaces/feature-flag.interface.ts:53](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L53)

#### Properties

##### environment?

```ts
optional environment?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:56](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L56)

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:54](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L54)

##### userId?

```ts
optional userId?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:55](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L55)

***

### SetOverrideInput

Defined in: [src/interfaces/feature-flag.interface.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L16)

#### Properties

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L20)

##### environment?

```ts
optional environment?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:19](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L19)

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L17)

##### userId?

```ts
optional userId?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L18)

***

### TenantContextProvider

Defined in: [src/interfaces/tenant-context-provider.interface.ts:1](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/tenant-context-provider.interface.ts#L1)

#### Methods

##### getCurrentTenantId()

```ts
getCurrentTenantId(): string | null;
```

Defined in: [src/interfaces/tenant-context-provider.interface.ts:2](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/tenant-context-provider.interface.ts#L2)

###### Returns

`string` \| `null`

***

### UpdateFeatureFlagInput

Defined in: [src/interfaces/feature-flag.interface.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L9)

#### Properties

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/feature-flag.interface.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L10)

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/feature-flag.interface.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L11)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/feature-flag.interface.ts:13](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L13)

##### percentage?

```ts
optional percentage?: number;
```

Defined in: [src/interfaces/feature-flag.interface.ts:12](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/interfaces/feature-flag.interface.ts#L12)

## Variables

### CACHE\_ADAPTER

```ts
const CACHE_ADAPTER: typeof CACHE_ADAPTER;
```

Defined in: [src/feature-flag.constants.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/feature-flag.constants.ts#L9)

***

### FEATURE\_FLAG\_MODULE\_OPTIONS

```ts
const FEATURE_FLAG_MODULE_OPTIONS: typeof FEATURE_FLAG_MODULE_OPTIONS;
```

Defined in: [src/feature-flag.constants.ts:1](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/feature-flag.constants.ts#L1)

***

### FEATURE\_FLAG\_REPOSITORY

```ts
const FEATURE_FLAG_REPOSITORY: typeof FEATURE_FLAG_REPOSITORY;
```

Defined in: [src/feature-flag.constants.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/feature-flag.constants.ts#L10)

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

Defined in: [src/events/feature-flag.events.ts:3](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L3)

#### Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-archived"></a> `ARCHIVED` | `"feature-flag.archived"` | `'feature-flag.archived'` | [src/events/feature-flag.events.ts:7](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L7) |
| <a id="property-cache_invalidated"></a> `CACHE_INVALIDATED` | `"feature-flag.cache.invalidated"` | `'feature-flag.cache.invalidated'` | [src/events/feature-flag.events.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L10) |
| <a id="property-created"></a> `CREATED` | `"feature-flag.created"` | `'feature-flag.created'` | [src/events/feature-flag.events.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L5) |
| <a id="property-evaluated"></a> `EVALUATED` | `"feature-flag.evaluated"` | `'feature-flag.evaluated'` | [src/events/feature-flag.events.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L4) |
| <a id="property-override_removed"></a> `OVERRIDE_REMOVED` | `"feature-flag.override.removed"` | `'feature-flag.override.removed'` | [src/events/feature-flag.events.ts:9](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L9) |
| <a id="property-override_set"></a> `OVERRIDE_SET` | `"feature-flag.override.set"` | `'feature-flag.override.set'` | [src/events/feature-flag.events.ts:8](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L8) |
| <a id="property-updated"></a> `UPDATED` | `"feature-flag.updated"` | `'feature-flag.updated'` | [src/events/feature-flag.events.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/events/feature-flag.events.ts#L6) |

***

### TENANT\_CONTEXT\_PROVIDER

```ts
const TENANT_CONTEXT_PROVIDER: typeof TENANT_CONTEXT_PROVIDER;
```

Defined in: [src/feature-flag.constants.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/feature-flag.constants.ts#L11)

## Functions

### BypassFeatureFlag()

```ts
function BypassFeatureFlag(): CustomDecorator<string>;
```

Defined in: [src/decorators/bypass-feature-flag.decorator.ts:4](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/decorators/bypass-feature-flag.decorator.ts#L4)

#### Returns

`CustomDecorator`\<`string`\>

***

### FeatureFlag()

```ts
function FeatureFlag(flagKey, options?): ClassDecorator & MethodDecorator;
```

Defined in: [src/decorators/feature-flag.decorator.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/decorators/feature-flag.decorator.ts#L6)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `string` |
| `options` | [`FeatureFlagGuardOptions`](#featureflagguardoptions) |

#### Returns

`ClassDecorator` & `MethodDecorator`
