# openfeature

> Published 0.6.0 API. For targeting, tenant-context, and custom-provider usage, read [the agent guide and upgrade guidance](https://nestarc.dev/packages/feature-flag/agent-guide#version-boundary). Signatures and source links describe this published release.


## Interfaces

<a id="api-openfeaturebooleanprovider"></a>

### OpenFeatureBooleanProvider

Defined in: [src/openfeature.ts:33](https://github.com/nestarc/nestjs-feature-flag/blob/b3abf19a213a5bc06a12bc5c8e24cb75f7dd9f82/src/openfeature.ts#L33)

#### Extends

- `Provider`

#### Properties

<a id="api-domainscoped"></a>

##### domainScoped?

```ts
readonly optional domainScoped?: boolean;
```

Defined in: node\_modules/@openfeature/core/dist/types.d.ts:495

When true, the provider maintains state specific to a single domain (such as a
persistent cache) and the SDK will bind it to at most one domain.

###### Inherited from

```ts
Provider.domainScoped
```

<a id="api-events"></a>

##### events?

```ts
optional events?: ProviderEventEmitter<AnyProviderEvent, Record<string, unknown>>;
```

Defined in: node\_modules/@openfeature/core/dist/types.d.ts:507

An event emitter for ProviderEvents.

###### See

ProviderEvents

###### Inherited from

```ts
Provider.events
```

<a id="api-hooks"></a>

##### hooks?

```ts
readonly optional hooks?: Hook<Record<string, unknown>>[];
```

Defined in: node\_modules/@openfeature/server-sdk/dist/types.d.ts:113

A provider hook exposes a mechanism for provider authors to register hooks
to tap into various stages of the flag evaluation lifecycle. These hooks can
be used to perform side effects and mutate the context for purposes of the
provider. Provider hooks are not configured or controlled by the application author.

###### Inherited from

```ts
Provider.hooks
```

<a id="api-metadata"></a>

##### metadata

```ts
metadata: {
  name: string;
};
```

Defined in: [src/openfeature.ts:34](https://github.com/nestarc/nestjs-feature-flag/blob/b3abf19a213a5bc06a12bc5c8e24cb75f7dd9f82/src/openfeature.ts#L34)

###### name

```ts
name: string;
```

###### Overrides

```ts
Provider.metadata
```

<a id="api-runson"></a>

##### runsOn?

```ts
readonly optional runsOn?: Paradigm;
```

Defined in: node\_modules/@openfeature/core/dist/types.d.ts:490

Represents where the provider is intended to be run. If defined,
the SDK will enforce that the defined paradigm at runtime.

###### Inherited from

```ts
Provider.runsOn
```

<a id="api-status"></a>

##### ~~status?~~

```ts
readonly optional status?: ServerProviderStatus;
```

Defined in: node\_modules/@openfeature/core/dist/types.d.ts:502

###### Deprecated

the SDK now maintains the provider's state; there's no need for providers to implement this field.
Returns a representation of the current readiness of the provider.

_Providers which do not implement this method are assumed to be ready immediately._

###### Inherited from

```ts
Provider.status
```

#### Methods

<a id="api-initialize"></a>

##### initialize()?

```ts
optional initialize(context?, domain?): Promise<void>;
```

Defined in: node\_modules/@openfeature/core/dist/types.d.ts:522

A function used to setup the provider.
Called by the SDK after the provider is set if the provider's status is NOT_READY.
When the returned promise resolves, the SDK fires the ProviderEvents.Ready event.
If the returned promise rejects, the SDK fires the ProviderEvents.Error event.
Use this function to perform any context-dependent setup within the provider.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context?` | `EvaluationContext` | the global evaluation context |
| `domain?` | `string` | the bound domain, if any |

###### Returns

`Promise`\<`void`\>

###### Inherited from

```ts
Provider.initialize
```

<a id="api-onclose"></a>

##### onClose()?

```ts
optional onClose(): Promise<void>;
```

Defined in: node\_modules/@openfeature/core/dist/types.d.ts:512

A function used to shut down the provider.
Called when this provider is replaced with a new one, or when the OpenFeature is shut down.

###### Returns

`Promise`\<`void`\>

###### Inherited from

```ts
Provider.onClose
```

<a id="api-resolvebooleanevaluation"></a>

##### resolveBooleanEvaluation()

```ts
resolveBooleanEvaluation(
   flagKey,
   defaultValue,
context): Promise<OpenFeatureBooleanResolutionDetails>;
```

Defined in: [src/openfeature.ts:35](https://github.com/nestarc/nestjs-feature-flag/blob/b3abf19a213a5bc06a12bc5c8e24cb75f7dd9f82/src/openfeature.ts#L35)

Resolve a boolean flag and its evaluation details.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `string` |
| `defaultValue` | `boolean` |
| `context` | [`OpenFeatureEvaluationContext`](#api-openfeatureevaluationcontext) |

###### Returns

`Promise`\<[`OpenFeatureBooleanResolutionDetails`](#api-openfeaturebooleanresolutiondetails)\>

###### Overrides

```ts
Provider.resolveBooleanEvaluation
```

<a id="api-resolvenumberevaluation"></a>

##### resolveNumberEvaluation()

```ts
resolveNumberEvaluation(
   flagKey,
   defaultValue,
   context,
logger): Promise<ResolutionDetails<number>>;
```

Defined in: node\_modules/@openfeature/server-sdk/dist/types.d.ts:125

Resolve a numeric flag and its evaluation details.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `string` |
| `defaultValue` | `number` |
| `context` | `EvaluationContext` |
| `logger` | `Logger` |

###### Returns

`Promise`\<`ResolutionDetails`\<`number`\>\>

###### Inherited from

```ts
Provider.resolveNumberEvaluation
```

<a id="api-resolveobjectevaluation"></a>

##### resolveObjectEvaluation()

```ts
resolveObjectEvaluation<T>(
   flagKey,
   defaultValue,
   context,
logger): Promise<ResolutionDetails<T>>;
```

Defined in: node\_modules/@openfeature/server-sdk/dist/types.d.ts:129

Resolve and parse an object flag and its evaluation details.

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `JsonValue` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `string` |
| `defaultValue` | `T` |
| `context` | `EvaluationContext` |
| `logger` | `Logger` |

###### Returns

`Promise`\<`ResolutionDetails`\<`T`\>\>

###### Inherited from

```ts
Provider.resolveObjectEvaluation
```

<a id="api-resolvestringevaluation"></a>

##### resolveStringEvaluation()

```ts
resolveStringEvaluation(
   flagKey,
   defaultValue,
   context,
logger): Promise<ResolutionDetails<string>>;
```

Defined in: node\_modules/@openfeature/server-sdk/dist/types.d.ts:121

Resolve a string flag and its evaluation details.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flagKey` | `string` |
| `defaultValue` | `string` |
| `context` | `EvaluationContext` |
| `logger` | `Logger` |

###### Returns

`Promise`\<`ResolutionDetails`\<`string`\>\>

###### Inherited from

```ts
Provider.resolveStringEvaluation
```

<a id="api-track"></a>

##### track()?

```ts
optional track(
   trackingEventName,
   context,
   trackingEventDetails): void;
```

Defined in: node\_modules/@openfeature/core/dist/types.d.ts:529

Track a user action or application state, usually representing a business objective or outcome.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `trackingEventName` | `string` | - |
| `context` | `EvaluationContext` | - |
| `trackingEventDetails` | `TrackingEventDetails` | - |

###### Returns

`void`

###### Inherited from

```ts
Provider.track
```

***

<a id="api-openfeaturebooleanprovideroptions"></a>

### OpenFeatureBooleanProviderOptions

Defined in: [src/openfeature.ts:16](https://github.com/nestarc/nestjs-feature-flag/blob/b3abf19a213a5bc06a12bc5c8e24cb75f7dd9f82/src/openfeature.ts#L16)

#### Properties

<a id="api-name"></a>

##### name?

```ts
optional name?: string;
```

Defined in: [src/openfeature.ts:17](https://github.com/nestarc/nestjs-feature-flag/blob/b3abf19a213a5bc06a12bc5c8e24cb75f7dd9f82/src/openfeature.ts#L17)

***

<a id="api-openfeaturebooleanresolutiondetails"></a>

### OpenFeatureBooleanResolutionDetails

Defined in: [src/openfeature.ts:28](https://github.com/nestarc/nestjs-feature-flag/blob/b3abf19a213a5bc06a12bc5c8e24cb75f7dd9f82/src/openfeature.ts#L28)

#### Extends

- `ResolutionDetails`\<`boolean`\>

#### Properties

<a id="api-errorcode"></a>

##### errorCode?

```ts
optional errorCode?: ErrorCode;
```

Defined in: node\_modules/@openfeature/core/dist/types.d.ts:101

###### Inherited from

```ts
ResolutionDetails.errorCode
```

<a id="api-errormessage"></a>

##### errorMessage?

```ts
optional errorMessage?: string;
```

Defined in: node\_modules/@openfeature/core/dist/types.d.ts:102

###### Inherited from

```ts
ResolutionDetails.errorMessage
```

<a id="api-flagmetadata"></a>

##### flagMetadata

```ts
flagMetadata: FlagMetadata;
```

Defined in: [src/openfeature.ts:30](https://github.com/nestarc/nestjs-feature-flag/blob/b3abf19a213a5bc06a12bc5c8e24cb75f7dd9f82/src/openfeature.ts#L30)

###### Overrides

```ts
ResolutionDetails.flagMetadata
```

<a id="api-reason"></a>

##### reason

```ts
reason: string;
```

Defined in: [src/openfeature.ts:29](https://github.com/nestarc/nestjs-feature-flag/blob/b3abf19a213a5bc06a12bc5c8e24cb75f7dd9f82/src/openfeature.ts#L29)

###### Overrides

```ts
ResolutionDetails.reason
```

<a id="api-value"></a>

##### value

```ts
value: boolean;
```

Defined in: node\_modules/@openfeature/core/dist/types.d.ts:97

###### Inherited from

```ts
ResolutionDetails.value
```

<a id="api-variant"></a>

##### variant?

```ts
optional variant?: string;
```

Defined in: node\_modules/@openfeature/core/dist/types.d.ts:98

###### Inherited from

```ts
ResolutionDetails.variant
```

***

<a id="api-openfeatureevaluationcontext"></a>

### OpenFeatureEvaluationContext

Defined in: [src/openfeature.ts:20](https://github.com/nestarc/nestjs-feature-flag/blob/b3abf19a213a5bc06a12bc5c8e24cb75f7dd9f82/src/openfeature.ts#L20)

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

Defined in: [src/openfeature.ts:24](https://github.com/nestarc/nestjs-feature-flag/blob/b3abf19a213a5bc06a12bc5c8e24cb75f7dd9f82/src/openfeature.ts#L24)

<a id="api-targetingkey"></a>

##### targetingKey?

```ts
optional targetingKey?: unknown;
```

Defined in: [src/openfeature.ts:21](https://github.com/nestarc/nestjs-feature-flag/blob/b3abf19a213a5bc06a12bc5c8e24cb75f7dd9f82/src/openfeature.ts#L21)

<a id="api-tenantid"></a>

##### tenantId?

```ts
optional tenantId?: unknown;
```

Defined in: [src/openfeature.ts:23](https://github.com/nestarc/nestjs-feature-flag/blob/b3abf19a213a5bc06a12bc5c8e24cb75f7dd9f82/src/openfeature.ts#L23)

<a id="api-userid"></a>

##### userId?

```ts
optional userId?: unknown;
```

Defined in: [src/openfeature.ts:22](https://github.com/nestarc/nestjs-feature-flag/blob/b3abf19a213a5bc06a12bc5c8e24cb75f7dd9f82/src/openfeature.ts#L22)

## Functions

<a id="api-createopenfeaturebooleanprovider"></a>

### createOpenFeatureBooleanProvider()

```ts
function createOpenFeatureBooleanProvider(service, options?): OpenFeatureBooleanProvider;
```

Defined in: [src/openfeature.ts:42](https://github.com/nestarc/nestjs-feature-flag/blob/b3abf19a213a5bc06a12bc5c8e24cb75f7dd9f82/src/openfeature.ts#L42)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `service` | `Pick`\<[`FeatureFlagService`](index.md#featureflagservice), `"evaluateBoolean"`\> |
| `options` | [`OpenFeatureBooleanProviderOptions`](#api-openfeaturebooleanprovideroptions) |

#### Returns

[`OpenFeatureBooleanProvider`](#api-openfeaturebooleanprovider)
