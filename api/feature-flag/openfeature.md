# openfeature

## Interfaces

### OpenFeatureBooleanProvider

Defined in: [src/openfeature.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L31)

#### Properties

##### metadata

```ts
metadata: {
  name: string;
};
```

Defined in: [src/openfeature.ts:32](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L32)

###### name

```ts
name: string;
```

#### Methods

##### resolveBooleanEvaluation()

```ts
resolveBooleanEvaluation(
   flagKey, 
   defaultValue, 
context): Promise<OpenFeatureBooleanResolutionDetails>;
```

Defined in: [src/openfeature.ts:33](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L33)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `string` |
| `defaultValue` | `boolean` |
| `context` | [`OpenFeatureEvaluationContext`](#openfeatureevaluationcontext) |

###### Returns

`Promise`\<[`OpenFeatureBooleanResolutionDetails`](#openfeaturebooleanresolutiondetails)\>

***

### OpenFeatureBooleanProviderOptions

Defined in: [src/openfeature.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L10)

#### Properties

##### name?

```ts
optional name?: string;
```

Defined in: [src/openfeature.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L11)

***

### OpenFeatureBooleanResolutionDetails

Defined in: [src/openfeature.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L22)

#### Properties

##### errorCode?

```ts
optional errorCode?: string;
```

Defined in: [src/openfeature.ts:26](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L26)

##### errorMessage?

```ts
optional errorMessage?: string;
```

Defined in: [src/openfeature.ts:27](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L27)

##### flagMetadata

```ts
flagMetadata: Record<string, unknown>;
```

Defined in: [src/openfeature.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L28)

##### reason

```ts
reason: string;
```

Defined in: [src/openfeature.ts:24](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L24)

##### value

```ts
value: boolean;
```

Defined in: [src/openfeature.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L23)

##### variant?

```ts
optional variant?: string;
```

Defined in: [src/openfeature.ts:25](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L25)

***

### OpenFeatureEvaluationContext

Defined in: [src/openfeature.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L14)

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### environment?

```ts
optional environment?: unknown;
```

Defined in: [src/openfeature.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L18)

##### targetingKey?

```ts
optional targetingKey?: unknown;
```

Defined in: [src/openfeature.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L15)

##### tenantId?

```ts
optional tenantId?: unknown;
```

Defined in: [src/openfeature.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L17)

##### userId?

```ts
optional userId?: unknown;
```

Defined in: [src/openfeature.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L16)

## Functions

### createOpenFeatureBooleanProvider()

```ts
function createOpenFeatureBooleanProvider(service, options?): OpenFeatureBooleanProvider;
```

Defined in: [src/openfeature.ts:40](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L40)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `service` | [`FeatureFlagService`](index.md#featureflagservice) |
| `options` | [`OpenFeatureBooleanProviderOptions`](#openfeaturebooleanprovideroptions) |

#### Returns

[`OpenFeatureBooleanProvider`](#openfeaturebooleanprovider)
