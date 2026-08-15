# openfeature

## Interfaces

<a id="api-openfeaturebooleanprovider"></a>

### OpenFeatureBooleanProvider

Defined in: [src/openfeature.ts:31](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L31)

#### Properties

<a id="api-metadata"></a>

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

<a id="api-resolvebooleanevaluation"></a>

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
| `context` | [`OpenFeatureEvaluationContext`](#api-openfeatureevaluationcontext) |

###### Returns

`Promise`\<[`OpenFeatureBooleanResolutionDetails`](#api-openfeaturebooleanresolutiondetails)\>

***

<a id="api-openfeaturebooleanprovideroptions"></a>

### OpenFeatureBooleanProviderOptions

Defined in: [src/openfeature.ts:10](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L10)

#### Properties

<a id="api-name"></a>

##### name?

```ts
optional name?: string;
```

Defined in: [src/openfeature.ts:11](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L11)

***

<a id="api-openfeaturebooleanresolutiondetails"></a>

### OpenFeatureBooleanResolutionDetails

Defined in: [src/openfeature.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L22)

#### Properties

<a id="api-errorcode"></a>

##### errorCode?

```ts
optional errorCode?: string;
```

Defined in: [src/openfeature.ts:26](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L26)

<a id="api-errormessage"></a>

##### errorMessage?

```ts
optional errorMessage?: string;
```

Defined in: [src/openfeature.ts:27](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L27)

<a id="api-flagmetadata"></a>

##### flagMetadata

```ts
flagMetadata: Record<string, unknown>;
```

Defined in: [src/openfeature.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L28)

<a id="api-reason"></a>

##### reason

```ts
reason: string;
```

Defined in: [src/openfeature.ts:24](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L24)

<a id="api-value"></a>

##### value

```ts
value: boolean;
```

Defined in: [src/openfeature.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L23)

<a id="api-variant"></a>

##### variant?

```ts
optional variant?: string;
```

Defined in: [src/openfeature.ts:25](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L25)

***

<a id="api-openfeatureevaluationcontext"></a>

### OpenFeatureEvaluationContext

Defined in: [src/openfeature.ts:14](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L14)

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

<a id="api-environment"></a>

##### environment?

```ts
optional environment?: unknown;
```

Defined in: [src/openfeature.ts:18](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L18)

<a id="api-targetingkey"></a>

##### targetingKey?

```ts
optional targetingKey?: unknown;
```

Defined in: [src/openfeature.ts:15](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L15)

<a id="api-tenantid"></a>

##### tenantId?

```ts
optional tenantId?: unknown;
```

Defined in: [src/openfeature.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L17)

<a id="api-userid"></a>

##### userId?

```ts
optional userId?: unknown;
```

Defined in: [src/openfeature.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L16)

## Functions

<a id="api-createopenfeaturebooleanprovider"></a>

### createOpenFeatureBooleanProvider()

```ts
function createOpenFeatureBooleanProvider(service, options?): OpenFeatureBooleanProvider;
```

Defined in: [src/openfeature.ts:40](https://github.com/nestarc/nestjs-feature-flag/blob/edec49f221012e3e0352185fa075efe1c99841d3/src/openfeature.ts#L40)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `service` | [`FeatureFlagService`](index.md#featureflagservice) |
| `options` | [`OpenFeatureBooleanProviderOptions`](#api-openfeaturebooleanprovideroptions) |

#### Returns

[`OpenFeatureBooleanProvider`](#api-openfeaturebooleanprovider)
