# testing

## Classes

### TestFeatureFlagController

Defined in: [src/testing/test-feature-flag.module.ts:71](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/testing/test-feature-flag.module.ts#L71)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TFlags` *extends* [`FlagRegistry`](index.md#flagregistry) | [`FlagRegistry`](index.md#flagregistry) |

#### Constructors

##### Constructor

```ts
new TestFeatureFlagController<TFlags>(defaults, overrides?): TestFeatureFlagController<TFlags>;
```

Defined in: [src/testing/test-feature-flag.module.ts:75](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/testing/test-feature-flag.module.ts#L75)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `defaults` | `Record`\<`string`, `boolean`\> |
| `overrides` | `Partial`\<`Record`\<[`FlagKey`](index.md#flagkey-3)\<`TFlags`\>, `boolean`\>\> |

###### Returns

[`TestFeatureFlagController`](#testfeatureflagcontroller)\<`TFlags`\>

#### Methods

##### evaluateAll()

```ts
evaluateAll(): Record<string, boolean>;
```

Defined in: [src/testing/test-feature-flag.module.ts:95](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/testing/test-feature-flag.module.ts#L95)

###### Returns

`Record`\<`string`, `boolean`\>

##### findAll()

```ts
findAll(): FeatureFlagWithOverrides[];
```

Defined in: [src/testing/test-feature-flag.module.ts:122](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/testing/test-feature-flag.module.ts#L122)

###### Returns

[`FeatureFlagWithOverrides`](index.md#featureflagwithoverrides)[]

##### findFlag()

```ts
findFlag(key): FeatureFlagWithOverrides;
```

Defined in: [src/testing/test-feature-flag.module.ts:114](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/testing/test-feature-flag.module.ts#L114)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

[`FeatureFlagWithOverrides`](index.md#featureflagwithoverrides)

##### getDetails()

```ts
getDetails(key, options?): BooleanEvaluationDetails;
```

Defined in: [src/testing/test-feature-flag.module.ts:99](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/testing/test-feature-flag.module.ts#L99)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `options` | [`EvaluateBooleanOptions`](index.md#evaluatebooleanoptions) |

###### Returns

[`BooleanEvaluationDetails`](index.md#booleanevaluationdetails)

##### isEnabled()

```ts
isEnabled(key, options?): boolean;
```

Defined in: [src/testing/test-feature-flag.module.ts:91](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/testing/test-feature-flag.module.ts#L91)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `options` | [`EvaluateBooleanOptions`](index.md#evaluatebooleanoptions) |

###### Returns

`boolean`

##### reset()

```ts
reset(): void;
```

Defined in: [src/testing/test-feature-flag.module.ts:87](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/testing/test-feature-flag.module.ts#L87)

###### Returns

`void`

##### set()

```ts
set<K>(key, value): void;
```

Defined in: [src/testing/test-feature-flag.module.ts:83](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/testing/test-feature-flag.module.ts#L83)

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `K` |
| `value` | `boolean` |

###### Returns

`void`

***

### TestFeatureFlagModule

Defined in: [src/testing/test-feature-flag.module.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/testing/test-feature-flag.module.ts#L31)

#### Constructors

##### Constructor

```ts
new TestFeatureFlagModule(): TestFeatureFlagModule;
```

###### Returns

[`TestFeatureFlagModule`](#testfeatureflagmodule)

#### Methods

##### register()

```ts
static register(flags?): DynamicModule;
```

Defined in: [src/testing/test-feature-flag.module.ts:32](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/testing/test-feature-flag.module.ts#L32)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flags?` | `Record`\<`string`, `boolean`\> |

###### Returns

`DynamicModule`

##### registerRegistry()

```ts
static registerRegistry<TFlags>(flags, options?): DynamicModule;
```

Defined in: [src/testing/test-feature-flag.module.ts:37](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/testing/test-feature-flag.module.ts#L37)

###### Type Parameters

| Type Parameter |
| ------ |
| `TFlags` *extends* [`FlagRegistry`](index.md#flagregistry) |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flags` | `TFlags` |
| `options` | [`TestFeatureFlagRegistryOptions`](#testfeatureflagregistryoptions)\<`TFlags`\> |

###### Returns

`DynamicModule`

## Interfaces

### TestFeatureFlagRegistryOptions

Defined in: [src/testing/test-feature-flag.module.ts:67](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/testing/test-feature-flag.module.ts#L67)

#### Type Parameters

| Type Parameter |
| ------ |
| `TFlags` *extends* [`FlagRegistry`](index.md#flagregistry) |

#### Properties

##### overrides?

```ts
optional overrides?: Partial<Record<Extract<keyof TFlags, string>, boolean>>;
```

Defined in: [src/testing/test-feature-flag.module.ts:68](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/testing/test-feature-flag.module.ts#L68)
