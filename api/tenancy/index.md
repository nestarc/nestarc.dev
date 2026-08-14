# @nestarc/tenancy

## Classes

### BullTenantPropagator

Defined in: [src/propagation/bull-tenant-propagator.ts:30](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/bull-tenant-propagator.ts#L30)

Bull/BullMQ tenant propagator.

Injects the current tenant ID into job data on the producer side,
and extracts it on the consumer side. Uses a configurable key
(default: `__tenantId`) to avoid collisions with application data.

No runtime dependency on `bullmq` — uses plain object types.

#### Example

```typescript
const propagator = new BullTenantPropagator(new TenancyContext());

// Producer: inject tenant into job data
await queue.add('process', propagator.inject({ orderId: '123' }));

// Consumer: extract tenant from job data
const tenantId = propagator.extract(job.data);
```

#### Implements

- [`TenantContextCarrier`](#tenantcontextcarrier)\<`Record`\<`string`, `unknown`\>\>

#### Constructors

##### Constructor

```ts
new BullTenantPropagator(context, options?): BullTenantPropagator;
```

Defined in: [src/propagation/bull-tenant-propagator.ts:35](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/bull-tenant-propagator.ts#L35)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`TenancyContext`](#tenancycontext) |
| `options?` | [`BullPropagationOptions`](#bullpropagationoptions) |

###### Returns

[`BullTenantPropagator`](#bulltenantpropagator)

#### Methods

##### extract()

```ts
extract(jobData): string | null;
```

Defined in: [src/propagation/bull-tenant-propagator.ts:53](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/bull-tenant-propagator.ts#L53)

Extracts the tenant ID from an incoming carrier.
Returns the tenant ID string, or `null` if not present.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobData` | `Record`\<`string`, `unknown`\> |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantContextCarrier`](#tenantcontextcarrier).[`extract`](#extract-8)

##### inject()

```ts
inject(jobData): Record<string, unknown>;
```

Defined in: [src/propagation/bull-tenant-propagator.ts:42](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/bull-tenant-propagator.ts#L42)

Attaches the current tenant ID to the carrier for outbound propagation.
Returns the carrier with tenant context included.
If no tenant context is available, returns the carrier unchanged.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobData` | `Record`\<`string`, `unknown`\> |

###### Returns

`Record`\<`string`, `unknown`\>

###### Implementation of

[`TenantContextCarrier`](#tenantcontextcarrier).[`inject`](#inject-4)

***

### CompositeTenantExtractor

Defined in: [src/extractors/composite.extractor.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/composite.extractor.ts#L4)

Contract for extracting a tenant ID from an inbound HTTP request.

Return the tenant ID string when present, or `null` when the request does
not carry tenant information. A missing tenant is not an error condition;
`TenantMiddleware` will call `onTenantNotFound` and let the application
decide whether to continue, respond, or throw.

Implementations may return synchronously or return a Promise for async
lookups. Throw only for malformed input or policy failures that should
reject the request immediately.

#### Implements

- [`TenantExtractor`](#tenantextractor-1)

#### Constructors

##### Constructor

```ts
new CompositeTenantExtractor(extractors): CompositeTenantExtractor;
```

Defined in: [src/extractors/composite.extractor.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/composite.extractor.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `extractors` | [`TenantExtractor`](#tenantextractor-1)[] |

###### Returns

[`CompositeTenantExtractor`](#compositetenantextractor)

#### Methods

##### extract()

```ts
extract(request): string | Promise<string | null> | null;
```

Defined in: [src/extractors/composite.extractor.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/composite.extractor.ts#L11)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | [`TenancyRequest`](#tenancyrequest) |

###### Returns

`string` \| `Promise`\<`string` \| `null`\> \| `null`

###### Implementation of

[`TenantExtractor`](#tenantextractor-1).[`extract`](#extract-9)

***

### GrpcTenantPropagator

Defined in: [src/propagation/grpc-tenant-propagator.ts:43](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/grpc-tenant-propagator.ts#L43)

gRPC tenant propagator.

Injects tenant ID into gRPC call metadata on the client side,
and extracts it on the server side.

Uses lowercase metadata keys per gRPC convention (keys are case-insensitive
but lowercase is standard).

No runtime dependency on `@grpc/grpc-js` — uses structural types.

#### Example

```typescript
const propagator = new GrpcTenantPropagator(new TenancyContext());

// Client: inject tenant into outgoing metadata
const metadata = new Metadata();
propagator.inject(metadata);

// Server: extract tenant from incoming metadata
const tenantId = propagator.extract(call.metadata);
```

#### Implements

- [`TenantContextCarrier`](#tenantcontextcarrier)\<[`GrpcMetadataLike`](#grpcmetadatalike)\>

#### Constructors

##### Constructor

```ts
new GrpcTenantPropagator(context, options?): GrpcTenantPropagator;
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:48](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/grpc-tenant-propagator.ts#L48)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`TenancyContext`](#tenancycontext) |
| `options?` | [`GrpcPropagationOptions`](#grpcpropagationoptions) |

###### Returns

[`GrpcTenantPropagator`](#grpctenantpropagator)

#### Methods

##### extract()

```ts
extract(metadata): string | null;
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:62](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/grpc-tenant-propagator.ts#L62)

Extracts the tenant ID from an incoming carrier.
Returns the tenant ID string, or `null` if not present.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `metadata` | [`GrpcMetadataLike`](#grpcmetadatalike) |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantContextCarrier`](#tenantcontextcarrier).[`extract`](#extract-8)

##### inject()

```ts
inject(metadata): GrpcMetadataLike;
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:55](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/grpc-tenant-propagator.ts#L55)

Attaches the current tenant ID to the carrier for outbound propagation.
Returns the carrier with tenant context included.
If no tenant context is available, returns the carrier unchanged.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `metadata` | [`GrpcMetadataLike`](#grpcmetadatalike) |

###### Returns

[`GrpcMetadataLike`](#grpcmetadatalike)

###### Implementation of

[`TenantContextCarrier`](#tenantcontextcarrier).[`inject`](#inject-4)

***

### HeaderTenantExtractor

Defined in: [src/extractors/header.extractor.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/header.extractor.ts#L4)

Contract for extracting a tenant ID from an inbound HTTP request.

Return the tenant ID string when present, or `null` when the request does
not carry tenant information. A missing tenant is not an error condition;
`TenantMiddleware` will call `onTenantNotFound` and let the application
decide whether to continue, respond, or throw.

Implementations may return synchronously or return a Promise for async
lookups. Throw only for malformed input or policy failures that should
reject the request immediately.

#### Implements

- [`TenantExtractor`](#tenantextractor-1)

#### Constructors

##### Constructor

```ts
new HeaderTenantExtractor(headerName): HeaderTenantExtractor;
```

Defined in: [src/extractors/header.extractor.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/header.extractor.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `headerName` | `string` |

###### Returns

[`HeaderTenantExtractor`](#headertenantextractor)

#### Methods

##### extract()

```ts
extract(request): string | null;
```

Defined in: [src/extractors/header.extractor.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/header.extractor.ts#L11)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | [`TenancyRequest`](#tenancyrequest) |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantExtractor`](#tenantextractor-1).[`extract`](#extract-9)

***

### HttpTenantPropagator

Defined in: [src/propagation/http-tenant-propagator.ts:23](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/http-tenant-propagator.ts#L23)

HTTP-specific tenant propagator.

Reads the current tenant from `TenancyContext` and returns it as an HTTP header.
Returns an empty object when no tenant context is available.

#### Example

```typescript
const propagator = new HttpTenantPropagator(tenancyContext);
const headers = propagator.getHeaders();
// { 'X-Tenant-Id': 'tenant-abc' }
```

#### Implements

- [`TenantPropagator`](#tenantpropagator)

#### Constructors

##### Constructor

```ts
new HttpTenantPropagator(context, options?): HttpTenantPropagator;
```

Defined in: [src/propagation/http-tenant-propagator.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/http-tenant-propagator.ts#L26)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`TenancyContext`](#tenancycontext) |
| `options?` | [`HttpPropagationOptions`](#httppropagationoptions) |

###### Returns

[`HttpTenantPropagator`](#httptenantpropagator)

#### Methods

##### getHeaders()

```ts
getHeaders(): Record<string, string>;
```

Defined in: [src/propagation/http-tenant-propagator.ts:33](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/http-tenant-propagator.ts#L33)

Returns headers to propagate tenant context.
Returns an empty object if no tenant context is available.

###### Returns

`Record`\<`string`, `string`\>

###### Implementation of

[`TenantPropagator`](#tenantpropagator).[`getHeaders`](#getheaders-2)

***

### JwtClaimTenantExtractor

Defined in: [src/extractors/jwt-claim.extractor.ts:37](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/jwt-claim.extractor.ts#L37)

Extracts the tenant ID from a JWT claim in the Authorization header.

**IMPORTANT: This extractor does NOT verify the JWT signature.**
It decodes the payload (Base64URL) without cryptographic validation.
You MUST ensure that JWT authentication (e.g., `@nestjs/passport` AuthGuard,
or an upstream auth middleware) has already validated the token before this
extractor runs. Using this extractor without prior JWT verification allows
attackers to forge tenant IDs via crafted tokens.

#### Implements

- [`TenantExtractor`](#tenantextractor-1)

#### Constructors

##### Constructor

```ts
new JwtClaimTenantExtractor(options): JwtClaimTenantExtractor;
```

Defined in: [src/extractors/jwt-claim.extractor.ts:41](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/jwt-claim.extractor.ts#L41)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`JwtClaimExtractorOptions`](#jwtclaimextractoroptions) |

###### Returns

[`JwtClaimTenantExtractor`](#jwtclaimtenantextractor)

#### Methods

##### extract()

```ts
extract(request): string | null;
```

Defined in: [src/extractors/jwt-claim.extractor.ts:46](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/jwt-claim.extractor.ts#L46)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | [`TenancyRequest`](#tenancyrequest) |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantExtractor`](#tenantextractor-1).[`extract`](#extract-9)

***

### KafkaTenantPropagator

Defined in: [src/propagation/kafka-tenant-propagator.ts:40](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/kafka-tenant-propagator.ts#L40)

Kafka tenant propagator.

Implements both `TenantContextCarrier<KafkaMessageLike>` (for inject/extract)
and `TenantPropagator` (for getHeaders compatibility).

Handles Kafka headers that may be `string` or `Buffer` on extraction.
No runtime dependency on `kafkajs` — uses structural types.

#### Example

```typescript
const propagator = new KafkaTenantPropagator(new TenancyContext());

// Producer: inject tenant into message
await producer.send({
  topic: 'orders',
  messages: [propagator.inject({ value: JSON.stringify(payload) })],
});

// Consumer: extract tenant from message
const tenantId = propagator.extract(message);
```

#### Implements

- [`TenantContextCarrier`](#tenantcontextcarrier)\<[`KafkaMessageLike`](#kafkamessagelike)\>
- [`TenantPropagator`](#tenantpropagator)

#### Constructors

##### Constructor

```ts
new KafkaTenantPropagator(context, options?): KafkaTenantPropagator;
```

Defined in: [src/propagation/kafka-tenant-propagator.ts:45](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/kafka-tenant-propagator.ts#L45)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`TenancyContext`](#tenancycontext) |
| `options?` | [`KafkaPropagationOptions`](#kafkapropagationoptions) |

###### Returns

[`KafkaTenantPropagator`](#kafkatenantpropagator)

#### Methods

##### extract()

```ts
extract(message): string | null;
```

Defined in: [src/propagation/kafka-tenant-propagator.ts:61](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/kafka-tenant-propagator.ts#L61)

Extracts the tenant ID from an incoming carrier.
Returns the tenant ID string, or `null` if not present.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | [`KafkaMessageLike`](#kafkamessagelike) |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantContextCarrier`](#tenantcontextcarrier).[`extract`](#extract-8)

##### getHeaders()

```ts
getHeaders(): Record<string, string>;
```

Defined in: [src/propagation/kafka-tenant-propagator.ts:71](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/kafka-tenant-propagator.ts#L71)

Returns headers to propagate tenant context.
Returns an empty object if no tenant context is available.

###### Returns

`Record`\<`string`, `string`\>

###### Implementation of

[`TenantPropagator`](#tenantpropagator).[`getHeaders`](#getheaders-2)

##### inject()

```ts
inject(message): KafkaMessageLike;
```

Defined in: [src/propagation/kafka-tenant-propagator.ts:52](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/kafka-tenant-propagator.ts#L52)

Attaches the current tenant ID to the carrier for outbound propagation.
Returns the carrier with tenant context included.
If no tenant context is available, returns the carrier unchanged.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | [`KafkaMessageLike`](#kafkamessagelike) |

###### Returns

[`KafkaMessageLike`](#kafkamessagelike)

###### Implementation of

[`TenantContextCarrier`](#tenantcontextcarrier).[`inject`](#inject-4)

***

### PathTenantExtractor

Defined in: [src/extractors/path.extractor.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/path.extractor.ts#L13)

Contract for extracting a tenant ID from an inbound HTTP request.

Return the tenant ID string when present, or `null` when the request does
not carry tenant information. A missing tenant is not an error condition;
`TenantMiddleware` will call `onTenantNotFound` and let the application
decide whether to continue, respond, or throw.

Implementations may return synchronously or return a Promise for async
lookups. Throw only for malformed input or policy failures that should
reject the request immediately.

#### Implements

- [`TenantExtractor`](#tenantextractor-1)

#### Constructors

##### Constructor

```ts
new PathTenantExtractor(options): PathTenantExtractor;
```

Defined in: [src/extractors/path.extractor.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/path.extractor.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`PathExtractorOptions`](#pathextractoroptions) |

###### Returns

[`PathTenantExtractor`](#pathtenantextractor)

#### Methods

##### extract()

```ts
extract(request): string | null;
```

Defined in: [src/extractors/path.extractor.ts:29](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/path.extractor.ts#L29)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | [`TenancyRequest`](#tenancyrequest) |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantExtractor`](#tenantextractor-1).[`extract`](#extract-9)

***

### SubdomainTenantExtractor

Defined in: [src/extractors/subdomain.extractor.ts:30](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/subdomain.extractor.ts#L30)

Contract for extracting a tenant ID from an inbound HTTP request.

Return the tenant ID string when present, or `null` when the request does
not carry tenant information. A missing tenant is not an error condition;
`TenantMiddleware` will call `onTenantNotFound` and let the application
decide whether to continue, respond, or throw.

Implementations may return synchronously or return a Promise for async
lookups. Throw only for malformed input or policy failures that should
reject the request immediately.

#### Implements

- [`TenantExtractor`](#tenantextractor-1)

#### Constructors

##### Constructor

```ts
new SubdomainTenantExtractor(options?): SubdomainTenantExtractor;
```

Defined in: [src/extractors/subdomain.extractor.ts:34](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/subdomain.extractor.ts#L34)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`SubdomainExtractorOptions`](#subdomainextractoroptions) |

###### Returns

[`SubdomainTenantExtractor`](#subdomaintenantextractor)

#### Methods

##### extract()

```ts
extract(request): string | null;
```

Defined in: [src/extractors/subdomain.extractor.ts:41](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/subdomain.extractor.ts#L41)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | [`TenancyRequest`](#tenancyrequest) |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantExtractor`](#tenantextractor-1).[`extract`](#extract-9)

***

### TenancyContext

Defined in: [src/services/tenancy-context.ts:9](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/services/tenancy-context.ts#L9)

#### Constructors

##### Constructor

```ts
new TenancyContext(): TenancyContext;
```

###### Returns

[`TenancyContext`](#tenancycontext)

#### Methods

##### getCurrentTenantId()

```ts
static getCurrentTenantId(): string | null;
```

Defined in: [src/services/tenancy-context.ts:12](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/services/tenancy-context.ts#L12)

###### Returns

`string` \| `null`

##### getTenantId()

```ts
getTenantId(): string | null;
```

Defined in: [src/services/tenancy-context.ts:22](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/services/tenancy-context.ts#L22)

###### Returns

`string` \| `null`

##### isBypassed()

```ts
isBypassed(): boolean;
```

Defined in: [src/services/tenancy-context.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/services/tenancy-context.ts#L26)

###### Returns

`boolean`

##### run()

###### Call Signature

```ts
run<T>(tenantId, callback): Promise<T>;
```

Defined in: [src/services/tenancy-context.ts:16](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/services/tenancy-context.ts#L16)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` |
| `callback` | () => `Promise`\<`T`\> |

###### Returns

`Promise`\<`T`\>

###### Call Signature

```ts
run<T>(tenantId, callback): T;
```

Defined in: [src/services/tenancy-context.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/services/tenancy-context.ts#L17)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` |
| `callback` | () => `T` |

###### Returns

`T`

##### runWithoutTenant()

###### Call Signature

```ts
runWithoutTenant<T>(callback): Promise<T>;
```

Defined in: [src/services/tenancy-context.ts:30](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/services/tenancy-context.ts#L30)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `callback` | () => `Promise`\<`T`\> |

###### Returns

`Promise`\<`T`\>

###### Call Signature

```ts
runWithoutTenant<T>(callback): T;
```

Defined in: [src/services/tenancy-context.ts:31](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/services/tenancy-context.ts#L31)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `callback` | () => `T` |

###### Returns

`T`

***

### TenancyContextRequiredError

Defined in: [src/errors/tenancy-context-required.error.ts:3](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/errors/tenancy-context-required.error.ts#L3)

#### Extends

- [`TenantContextMissingError`](#tenantcontextmissingerror)

#### Constructors

##### Constructor

```ts
new TenancyContextRequiredError(model, operation): TenancyContextRequiredError;
```

Defined in: [src/errors/tenancy-context-required.error.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/errors/tenancy-context-required.error.ts#L6)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `model` | `string` |
| `operation` | `string` |

###### Returns

[`TenancyContextRequiredError`](#tenancycontextrequirederror)

###### Overrides

[`TenantContextMissingError`](#tenantcontextmissingerror).[`constructor`](#constructor-16)

#### Properties

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`TenantContextMissingError`](#tenantcontextmissingerror).[`message`](#message-1)

##### model

```ts
readonly model: string;
```

Defined in: [src/errors/tenancy-context-required.error.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/errors/tenancy-context-required.error.ts#L7)

##### name

```ts
name: string = 'TenancyContextRequiredError';
```

Defined in: [src/errors/tenancy-context-required.error.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/errors/tenancy-context-required.error.ts#L4)

###### Overrides

[`TenantContextMissingError`](#tenantcontextmissingerror).[`name`](#name-1)

##### operation

```ts
readonly operation: string;
```

Defined in: [src/errors/tenancy-context-required.error.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/errors/tenancy-context-required.error.ts#L8)

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`TenantContextMissingError`](#tenantcontextmissingerror).[`stack`](#stack-1)

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:67

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

###### Inherited from

[`TenantContextMissingError`](#tenantcontextmissingerror).[`stackTraceLimit`](#stacktracelimit-1)

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:51

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`TenantContextMissingError`](#tenantcontextmissingerror).[`captureStackTrace`](#capturestacktrace-1)

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:55

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`TenantContextMissingError`](#tenantcontextmissingerror).[`prepareStackTrace`](#preparestacktrace-1)

##### toJSON()

```ts
toJSON(): {
  message: string;
  model: string;
  name: string;
  operation: string;
};
```

Defined in: [src/errors/tenancy-context-required.error.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/errors/tenancy-context-required.error.ts#L17)

###### Returns

```ts
{
  message: string;
  model: string;
  name: string;
  operation: string;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `message` | `string` | [src/errors/tenancy-context-required.error.ts:20](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/errors/tenancy-context-required.error.ts#L20) |
| `model` | `string` | [src/errors/tenancy-context-required.error.ts:21](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/errors/tenancy-context-required.error.ts#L21) |
| `name` | `string` | [src/errors/tenancy-context-required.error.ts:19](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/errors/tenancy-context-required.error.ts#L19) |
| `operation` | `string` | [src/errors/tenancy-context-required.error.ts:22](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/errors/tenancy-context-required.error.ts#L22) |

***

### TenancyEventService

Defined in: [src/events/tenancy-event.service.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-event.service.ts#L14)

Optional event emission service that integrates with @nestjs/event-emitter.

If `@nestjs/event-emitter` is installed and `EventEmitterModule.forRoot()`
is imported, events are emitted via EventEmitter2.
If not installed, all emit() calls are silently ignored.

#### Implements

- `OnModuleInit`

#### Constructors

##### Constructor

```ts
new TenancyEventService(moduleRef): TenancyEventService;
```

Defined in: [src/events/tenancy-event.service.ts:18](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-event.service.ts#L18)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `moduleRef` | `ModuleRef` |

###### Returns

[`TenancyEventService`](#tenancyeventservice)

#### Methods

##### emit()

```ts
emit<K>(event, payload): void;
```

Defined in: [src/events/tenancy-event.service.ts:31](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-event.service.ts#L31)

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof [`TenancyEventMap`](#tenancyeventmap) |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `payload` | [`TenancyEventMap`](#tenancyeventmap)\[`K`\] |

###### Returns

`void`

##### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [src/events/tenancy-event.service.ts:20](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-event.service.ts#L20)

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleInit.onModuleInit
```

***

### TenancyModule

Defined in: [src/tenancy.module.ts:49](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/tenancy.module.ts#L49)

#### Implements

- `NestModule`

#### Constructors

##### Constructor

```ts
new TenancyModule(): TenancyModule;
```

###### Returns

[`TenancyModule`](#tenancymodule)

#### Methods

##### configure()

```ts
configure(consumer): void;
```

Defined in: [src/tenancy.module.ts:50](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/tenancy.module.ts#L50)

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

Defined in: [src/tenancy.module.ts:59](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/tenancy.module.ts#L59)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`TenancyModuleOptions`](#tenancymoduleoptions) |

###### Returns

`DynamicModule`

##### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [src/tenancy.module.ts:65](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/tenancy.module.ts#L65)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`TenancyModuleAsyncOptions`](#tenancymoduleasyncoptions) |

###### Returns

`DynamicModule`

***

### TenancyService

Defined in: [src/services/tenancy.service.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/services/tenancy.service.ts#L8)

#### Constructors

##### Constructor

```ts
new TenancyService(context, eventService?): TenancyService;
```

Defined in: [src/services/tenancy.service.ts:9](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/services/tenancy.service.ts#L9)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`TenancyContext`](#tenancycontext) |
| `eventService?` | [`TenancyEventService`](#tenancyeventservice) |

###### Returns

[`TenancyService`](#tenancyservice)

#### Methods

##### getCurrentTenant()

```ts
getCurrentTenant(): string | null;
```

Defined in: [src/services/tenancy.service.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/services/tenancy.service.ts#L14)

###### Returns

`string` \| `null`

##### getCurrentTenantOrThrow()

```ts
getCurrentTenantOrThrow(): string;
```

Defined in: [src/services/tenancy.service.ts:18](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/services/tenancy.service.ts#L18)

###### Returns

`string`

##### isTenantBypassed()

```ts
isTenantBypassed(): boolean;
```

Defined in: [src/services/tenancy.service.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/services/tenancy.service.ts#L26)

###### Returns

`boolean`

##### withoutTenant()

```ts
withoutTenant<T>(callback): Promise<T>;
```

Defined in: [src/services/tenancy.service.ts:30](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/services/tenancy.service.ts#L30)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `callback` | () => `T` \| `Promise`\<`T`\> |

###### Returns

`Promise`\<`T`\>

***

### TenancyTelemetryService

Defined in: [src/telemetry/tenancy-telemetry.service.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/telemetry/tenancy-telemetry.service.ts#L17)

Optional OpenTelemetry integration service.

If `@opentelemetry/api` is installed, automatically adds the tenant ID
as a span attribute to the current active span. Optionally creates
custom spans for tenant lifecycle events.

If `@opentelemetry/api` is not installed, all methods are silently no-ops.
Follows the same graceful degradation pattern as `TenancyEventService`.

#### Implements

- `OnModuleInit`

#### Constructors

##### Constructor

```ts
new TenancyTelemetryService(options): TenancyTelemetryService;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:24](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/telemetry/tenancy-telemetry.service.ts#L24)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`TenancyModuleOptions`](#tenancymoduleoptions) |

###### Returns

[`TenancyTelemetryService`](#tenancytelemetryservice)

#### Methods

##### endSpan()

```ts
endSpan(span): void;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:95](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/telemetry/tenancy-telemetry.service.ts#L95)

Safely end a span (null-safe).

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `span` | `Pick`\<`Span`, `"end"`\> \| `null` |

###### Returns

`void`

##### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:32](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/telemetry/tenancy-telemetry.service.ts#L32)

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleInit.onModuleInit
```

##### setTenantAttribute()

```ts
setTenantAttribute(tenantId): void;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:44](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/telemetry/tenancy-telemetry.service.ts#L44)

Add tenant.id attribute to the current active span.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` |

###### Returns

`void`

##### startSpan()

```ts
startSpan(name, attributes?): Span | null;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:51](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/telemetry/tenancy-telemetry.service.ts#L51)

Start a custom span (only when createSpans is true). Returns null if disabled or OTel unavailable.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `attributes?` | `Attributes` |

###### Returns

`Span` \| `null`

##### startTenantSpan()

```ts
startTenantSpan(name, tenantId): Span | null;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:57](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/telemetry/tenancy-telemetry.service.ts#L57)

Start a custom span with the configured tenant ID attribute attached.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `tenantId` | `string` |

###### Returns

`Span` \| `null`

##### withSpan()

```ts
withSpan<T>(
   name, 
   attributes, 
   callback): T;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:62](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/telemetry/tenancy-telemetry.service.ts#L62)

Run a callback with a custom span set as the active OpenTelemetry span.

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `attributes` | `Attributes` \| `undefined` |
| `callback` | (`span`) => `T` |

###### Returns

`T`

##### withTenantSpan()

```ts
withTenantSpan<T>(
   name, 
   tenantId, 
   callback): T;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:86](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/telemetry/tenancy-telemetry.service.ts#L86)

Run a callback with a tenant lifecycle span set as active.

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `tenantId` | `string` |
| `callback` | (`span`) => `T` |

###### Returns

`T`

***

### TenantContextInterceptor

Defined in: [src/propagation/tenant-context.interceptor.ts:51](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/tenant-context.interceptor.ts#L51)

NestJS interceptor that restores tenant context from incoming microservice messages.

Designed for **RPC transports only** (Kafka, Bull, gRPC). HTTP requests are
skipped because `TenantMiddleware` + `TenancyGuard` already handle HTTP
tenant extraction as part of `TenancyModule`.

Wraps the handler execution inside `TenancyContext.run()`, ensuring
that all downstream code (services, Prisma extension, etc.) has access
to the tenant context through AsyncLocalStorage.

For best results, set the `transport` option explicitly to avoid duck-typing
ambiguity when multiple RPC transports share similar context shapes.

#### Example

```typescript
// Global interceptor for Kafka consumers
app.useGlobalInterceptors(
  new TenantContextInterceptor(new TenancyContext(), { transport: 'kafka' }),
);

// Bull processor with explicit transport
@UseInterceptors(new TenantContextInterceptor(new TenancyContext(), { transport: 'bull' }))
@Controller()
export class OrderProcessor { ... }
```

#### Implements

- `NestInterceptor`

#### Constructors

##### Constructor

```ts
new TenantContextInterceptor(context, options?): TenantContextInterceptor;
```

Defined in: [src/propagation/tenant-context.interceptor.ts:57](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/tenant-context.interceptor.ts#L57)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`TenancyContext`](#tenancycontext) |
| `options?` | [`TenantContextInterceptorOptions`](#tenantcontextinterceptoroptions) |

###### Returns

[`TenantContextInterceptor`](#tenantcontextinterceptor)

#### Methods

##### intercept()

```ts
intercept(executionContext, next): Observable<unknown>;
```

Defined in: [src/propagation/tenant-context.interceptor.ts:73](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/tenant-context.interceptor.ts#L73)

Method to implement a custom interceptor.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `executionContext` | `ExecutionContext` | - |
| `next` | `CallHandler` | a reference to the `CallHandler`, which provides access to an `Observable` representing the response stream from the route handler. |

###### Returns

`Observable`\<`unknown`\>

###### Implementation of

```ts
NestInterceptor.intercept
```

***

### TenantContextMissingError

Defined in: [src/errors/tenant-context-missing.error.ts:22](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/errors/tenant-context-missing.error.ts#L22)

#### Extends

- `Error`

#### Extended by

- [`TenancyContextRequiredError`](#tenancycontextrequirederror)

#### Constructors

##### Constructor

```ts
new TenantContextMissingError(message?): TenantContextMissingError;
```

Defined in: [src/errors/tenant-context-missing.error.ts:25](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/errors/tenant-context-missing.error.ts#L25)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message?` | `string` |

###### Returns

[`TenantContextMissingError`](#tenantcontextmissingerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

```ts
Error.message
```

##### name

```ts
name: string = 'TenantContextMissingError';
```

Defined in: [src/errors/tenant-context-missing.error.ts:23](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/errors/tenant-context-missing.error.ts#L23)

###### Overrides

```ts
Error.name
```

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

```ts
Error.stack
```

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:67

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

###### Inherited from

```ts
Error.stackTraceLimit
```

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:51

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

```ts
Error.captureStackTrace
```

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:55

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

```ts
Error.prepareStackTrace
```

## Interfaces

### BullPropagationOptions

Defined in: [src/propagation/bull-tenant-propagator.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/bull-tenant-propagator.ts#L5)

#### Properties

##### dataKey?

```ts
optional dataKey?: string;
```

Defined in: [src/propagation/bull-tenant-propagator.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/bull-tenant-propagator.ts#L7)

Key name used to store tenant ID in job data. Defaults to '__tenantId'.

***

### GrpcMetadataLike

Defined in: [src/propagation/grpc-tenant-propagator.ts:15](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/grpc-tenant-propagator.ts#L15)

Structural type for gRPC Metadata — no dependency on @grpc/grpc-js.

Matches the subset of `@grpc/grpc-js` `Metadata` used for tenant propagation.

#### Methods

##### get()

```ts
get(key): (string | Buffer<ArrayBufferLike>)[];
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/grpc-tenant-propagator.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

(`string` \| `Buffer`\<`ArrayBufferLike`\>)[]

##### set()

```ts
set(key, value): void;
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:16](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/grpc-tenant-propagator.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `value` | `string` |

###### Returns

`void`

***

### GrpcPropagationOptions

Defined in: [src/propagation/grpc-tenant-propagator.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/grpc-tenant-propagator.ts#L5)

#### Properties

##### metadataKey?

```ts
optional metadataKey?: string;
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/grpc-tenant-propagator.ts#L7)

Metadata key for tenant ID. Defaults to 'x-tenant-id' (lowercase per gRPC convention).

***

### HttpPropagationOptions

Defined in: [src/propagation/http-tenant-propagator.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/http-tenant-propagator.ts#L5)

#### Properties

##### headerName?

```ts
optional headerName?: string;
```

Defined in: [src/propagation/http-tenant-propagator.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/http-tenant-propagator.ts#L7)

Header name for tenant ID propagation. Defaults to 'X-Tenant-Id'.

***

### JwtClaimExtractorOptions

Defined in: [src/extractors/jwt-claim.extractor.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/jwt-claim.extractor.ts#L4)

#### Properties

##### claimKey

```ts
claimKey: string;
```

Defined in: [src/extractors/jwt-claim.extractor.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/jwt-claim.extractor.ts#L5)

##### headerName?

```ts
optional headerName?: string;
```

Defined in: [src/extractors/jwt-claim.extractor.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/jwt-claim.extractor.ts#L6)

***

### KafkaMessageLike

Defined in: [src/propagation/kafka-tenant-propagator.ts:12](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/kafka-tenant-propagator.ts#L12)

Structural type for Kafka message — no dependency on kafkajs.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### headers?

```ts
optional headers?: Record<string, string | Buffer<ArrayBufferLike> | undefined>;
```

Defined in: [src/propagation/kafka-tenant-propagator.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/kafka-tenant-propagator.ts#L13)

***

### KafkaPropagationOptions

Defined in: [src/propagation/kafka-tenant-propagator.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/kafka-tenant-propagator.ts#L6)

#### Properties

##### headerName?

```ts
optional headerName?: string;
```

Defined in: [src/propagation/kafka-tenant-propagator.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/kafka-tenant-propagator.ts#L8)

Header name for tenant ID in Kafka message headers. Defaults to 'X-Tenant-Id'.

***

### PathExtractorOptions

Defined in: [src/extractors/path.extractor.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/path.extractor.ts#L4)

#### Properties

##### paramName

```ts
paramName: string;
```

Defined in: [src/extractors/path.extractor.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/path.extractor.ts#L6)

##### pattern

```ts
pattern: string;
```

Defined in: [src/extractors/path.extractor.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/path.extractor.ts#L5)

***

### PrismaTenancyExtensionOptions

Defined in: [src/prisma/prisma-tenancy.extension.ts:31](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/prisma-tenancy.extension.ts#L31)

#### Properties

##### autoInjectTenantId?

```ts
optional autoInjectTenantId?: boolean;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:33](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/prisma-tenancy.extension.ts#L33)

##### dbSettingKey?

```ts
optional dbSettingKey?: string;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:32](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/prisma-tenancy.extension.ts#L32)

##### failClosed?

```ts
optional failClosed?: boolean;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:44](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/prisma-tenancy.extension.ts#L44)

When true, throws `TenancyContextRequiredError` if a query is executed
without a tenant context (unless the model is in `sharedModels` or
`withoutTenant()` was used to explicitly bypass).

Prevents accidental data exposure when RLS policies are misconfigured.

###### Default

```ts
true
```

##### interactiveTransactionSupport?

```ts
optional interactiveTransactionSupport?: boolean;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:60](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/prisma-tenancy.extension.ts#L60)

Enable transparent interactive transaction support.

When enabled, the extension detects interactive transactions
(`$transaction(async (tx) => ...)`) and sets the RLS context
on the transaction's connection directly.

Relies on Prisma internal APIs (`__internalParams`, `_createItxClient`).
Compatibility is validated at extension creation time — an error is thrown
immediately if the current Prisma version does not support this feature.

For an alternative that uses only public Prisma APIs, see `tenancyTransaction()`.

###### Default

```ts
false
```

##### sharedModels?

```ts
optional sharedModels?: string[];
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:35](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/prisma-tenancy.extension.ts#L35)

##### tenantIdField?

```ts
optional tenantIdField?: string;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:34](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/prisma-tenancy.extension.ts#L34)

***

### PrismaTransactionClient

Defined in: [src/prisma/tenancy-transaction.ts:18](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/tenancy-transaction.ts#L18)

Structural type representing a Prisma-like client that supports
interactive transactions. `PrismaClient` satisfies this automatically.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTx` *extends* [`PrismaTransactionContext`](#prismatransactioncontext) | `any` |

#### Methods

##### $transaction()

```ts
$transaction<T>(fn, options?): Promise<T>;
```

Defined in: [src/prisma/tenancy-transaction.ts:19](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/tenancy-transaction.ts#L19)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`tx`) => `Promise`\<`T`\> |
| `options?` | `Record`\<`string`, `unknown`\> |

###### Returns

`Promise`\<`T`\>

***

### PrismaTransactionContext

Defined in: [src/prisma/tenancy-transaction.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/tenancy-transaction.ts#L7)

Minimal transaction client shape required by `tenancyTransaction`.

#### Methods

##### $executeRaw()

```ts
$executeRaw(strings, ...values): Promise<unknown>;
```

Defined in: [src/prisma/tenancy-transaction.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/tenancy-transaction.ts#L8)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `strings` | `TemplateStringsArray` |
| ...`values` | `unknown`[] |

###### Returns

`Promise`\<`unknown`\>

***

### SubdomainExtractorOptions

Defined in: [src/extractors/subdomain.extractor.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/subdomain.extractor.ts#L4)

#### Properties

##### excludeSubdomains?

```ts
optional excludeSubdomains?: string[];
```

Defined in: [src/extractors/subdomain.extractor.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/extractors/subdomain.extractor.ts#L5)

***

### TelemetryOptions

Defined in: [src/interfaces/tenancy-module-options.interface.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L6)

#### Properties

##### createSpans?

```ts
optional createSpans?: boolean;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:10](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L10)

Create custom spans for tenant lifecycle events (resolved, not_found, etc.).

###### Default

```ts
false
```

##### spanAttributeKey?

```ts
optional spanAttributeKey?: string;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L8)

Span attribute key for tenant ID.

###### Default

```ts
'tenant.id'
```

***

### TenancyEventMap

Defined in: [src/events/tenancy-events.ts:89](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L89)

Type-safe mapping from event name to payload type.
Used by `TenancyEventService.emit()` to enforce correct payloads at compile time.

#### Properties

##### tenant.context\_bypassed

```ts
tenant.context_bypassed: TenantContextBypassedEvent;
```

Defined in: [src/events/tenancy-events.ts:94](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L94)

##### tenant.cross\_check\_failed

```ts
tenant.cross_check_failed: TenantCrossCheckFailedEvent;
```

Defined in: [src/events/tenancy-events.ts:95](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L95)

##### tenant.extraction\_failed

```ts
tenant.extraction_failed: TenantExtractionFailedEvent;
```

Defined in: [src/events/tenancy-events.ts:92](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L92)

##### tenant.not\_found

```ts
tenant.not_found: TenancyEventRequestPayload;
```

Defined in: [src/events/tenancy-events.ts:91](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L91)

##### tenant.resolved

```ts
tenant.resolved: TenantResolvedEvent;
```

Defined in: [src/events/tenancy-events.ts:90](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L90)

##### tenant.validation\_failed

```ts
tenant.validation_failed: TenantValidationFailedEvent;
```

Defined in: [src/events/tenancy-events.ts:93](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L93)

***

### TenancyEventRequestSummary

Defined in: [src/events/tenancy-events.ts:3](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L3)

#### Properties

##### host?

```ts
optional host?: string;
```

Defined in: [src/events/tenancy-events.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L8)

##### ip?

```ts
optional ip?: string;
```

Defined in: [src/events/tenancy-events.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L6)

##### method?

```ts
optional method?: string;
```

Defined in: [src/events/tenancy-events.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L4)

##### path?

```ts
optional path?: string;
```

Defined in: [src/events/tenancy-events.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L5)

##### userAgent?

```ts
optional userAgent?: string;
```

Defined in: [src/events/tenancy-events.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L7)

***

### TenancyModuleAsyncOptions

Defined in: [src/interfaces/tenancy-module-options.interface.ts:97](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L97)

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
optional inject?: (InjectionToken | OptionalFactoryDependency)[];
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:99](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L99)

##### useClass?

```ts
optional useClass?: Type<TenancyModuleOptionsFactory>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:103](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L103)

##### useExisting?

```ts
optional useExisting?: Type<TenancyModuleOptionsFactory>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:104](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L104)

##### useFactory?

```ts
optional useFactory?: (...args) => 
  | TenancyModuleOptions
| Promise<TenancyModuleOptions>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:100](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L100)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`TenancyModuleOptions`](#tenancymoduleoptions)
  \| `Promise`\<[`TenancyModuleOptions`](#tenancymoduleoptions)\>

***

### TenancyModuleOptions

Defined in: [src/interfaces/tenancy-module-options.interface.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L13)

#### Properties

##### crossCheck?

```ts
optional crossCheck?: {
  extractor: TenantExtractor;
  onFailed?: "reject" | "log";
  required?: boolean;
};
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:66](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L66)

Cross-check configuration for tenant ID forgery prevention.

Compares the primary extractor result with a secondary source.
Common pattern: primary = header, cross-check = JWT claim.

If the cross-check extractor returns null (e.g., no JWT present),
validation is skipped — allowing unauthenticated endpoints to work normally.
Set `required: true` to reject requests when the cross-check extractor
returns null, enforcing that every request must have a verifiable secondary source.

###### extractor

```ts
extractor: TenantExtractor;
```

Secondary extractor to validate the tenant ID against.

###### onFailed?

```ts
optional onFailed?: "reject" | "log";
```

Behavior on mismatch.
- `'reject'` (default): throws ForbiddenException
- `'log'`: logs a warning and continues with the primary extractor's value

###### required?

```ts
optional required?: boolean;
```

When true, the cross-check extractor must return a non-null value.
Throws ForbiddenException if the extractor returns null.
Use this for endpoints that require authenticated cross-validation.

###### Default

```ts
false
```

##### dbSettingKey?

```ts
optional dbSettingKey?: string;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:28](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L28)

##### onTenantNotFound?

```ts
optional onTenantNotFound?: (request, response) => void | "skip" | Promise<void | "skip">;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:53](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L53)

Called when no tenant ID could be extracted from the request.

Behavior based on return value:
- `void` / `undefined`: request continues to the next middleware (observation-only hook)
- `'skip'`: request continues but `next()` is NOT called.
  **Warning:** You must send a response (e.g., `response.status(403).end()`)
  or throw an exception before returning `'skip'`. Otherwise the HTTP request
  will hang indefinitely with no response sent to the client.

Throwing an exception (e.g., `throw new ForbiddenException()`) always aborts
the request regardless of return value.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | [`TenancyRequest`](#tenancyrequest) |
| `response` | [`TenancyResponse`](#tenancyresponse) |

###### Returns

`void` \| `"skip"` \| `Promise`\<`void` \| `"skip"`\>

##### onTenantResolved?

```ts
optional onTenantResolved?: (tenantId, request) => void | Promise<void>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:38](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L38)

Called after a tenant ID is successfully extracted and validated.
Runs inside `TenancyContext.run()`, so `getCurrentTenant()` is available.

Throwing an exception aborts the request — NestJS handles it as a 500
(or whatever your exception filter maps it to). The telemetry span is
always closed via `finally`, so throwing is safe for audit/authorization checks.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` |
| `request` | [`TenancyRequest`](#tenancyrequest) |

###### Returns

`void` \| `Promise`\<`void`\>

##### telemetry?

```ts
optional telemetry?: TelemetryOptions;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:88](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L88)

OpenTelemetry integration. Automatically adds tenant.id to active spans.
Silently ignored if `@opentelemetry/api` is not installed.

##### tenantExtractor

```ts
tenantExtractor: string | TenantExtractor;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:27](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L27)

Tenant extraction strategy.

A string is a shortcut for `HeaderTenantExtractor` and is interpreted as
the HTTP header name. Use a `TenantExtractor` instance for non-header
strategies such as subdomain, path, JWT claim, or composite extraction.

###### Example

```typescript
tenantExtractor: 'X-Tenant-Id'
tenantExtractor: new SubdomainTenantExtractor()
```

##### validateTenantId?

```ts
optional validateTenantId?: (tenantId) => boolean | Promise<boolean>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:29](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L29)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` |

###### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### TenancyModuleOptionsFactory

Defined in: [src/interfaces/tenancy-module-options.interface.ts:91](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L91)

#### Methods

##### createTenancyOptions()

```ts
createTenancyOptions(): 
  | TenancyModuleOptions
| Promise<TenancyModuleOptions>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:92](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-module-options.interface.ts#L92)

###### Returns

  \| [`TenancyModuleOptions`](#tenancymoduleoptions)
  \| `Promise`\<[`TenancyModuleOptions`](#tenancymoduleoptions)\>

***

### TenancyRequest

Defined in: [src/interfaces/tenancy-request.interface.ts:9](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-request.interface.ts#L9)

Minimal HTTP request interface for @nestarc/tenancy public API.

This is intentionally framework-agnostic. Express `Request`, Fastify
`FastifyRequest`, and Node.js `http.IncomingMessage` all satisfy this
interface. Use type assertion if you need platform-specific properties
(e.g., `request as import('express').Request`).

#### Indexable

```ts
[key: string]: unknown
```

Index signature for platform-specific properties. Use type assertion to access.

#### Properties

##### headers

```ts
headers: Record<string, string | string[] | undefined>;
```

Defined in: [src/interfaces/tenancy-request.interface.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-request.interface.ts#L11)

HTTP request headers. Keys are lowercase in Node.js.

##### hostname?

```ts
optional hostname?: string;
```

Defined in: [src/interfaces/tenancy-request.interface.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-request.interface.ts#L13)

Hostname derived from the `Host` header.

##### path?

```ts
optional path?: string;
```

Defined in: [src/interfaces/tenancy-request.interface.ts:15](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-request.interface.ts#L15)

Request path without query string.

##### url?

```ts
optional url?: string;
```

Defined in: [src/interfaces/tenancy-request.interface.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-request.interface.ts#L17)

Full request URL.

***

### TenancyResponse

Defined in: [src/interfaces/tenancy-request.interface.ts:32](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-request.interface.ts#L32)

Minimal HTTP response interface for @nestarc/tenancy public API.

Used only in `onTenantNotFound` callback. Framework-agnostic — both
Express `Response` and Fastify `FastifyReply` satisfy this interface.

The named methods are optional to maintain compatibility with any
response-like object. If you need the full response API, use type
assertion: `(response as import('express').Response)`.

#### Indexable

```ts
[key: string]: unknown
```

Index signature for platform-specific properties. Use type assertion to access.

#### Methods

##### end()?

```ts
optional end(): void;
```

Defined in: [src/interfaces/tenancy-request.interface.ts:38](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-request.interface.ts#L38)

End the response without a body.

###### Returns

`void`

##### json()?

```ts
optional json(body): void;
```

Defined in: [src/interfaces/tenancy-request.interface.ts:36](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-request.interface.ts#L36)

Send JSON response body.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `body` | `unknown` |

###### Returns

`void`

##### status()?

```ts
optional status(code): this;
```

Defined in: [src/interfaces/tenancy-request.interface.ts:34](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenancy-request.interface.ts#L34)

Set HTTP status code. Returns `this` for chaining (Express/Fastify convention).

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | `number` |

###### Returns

`this`

***

### TenancyTransactionOptions

Defined in: [src/prisma/tenancy-transaction.ts:25](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/tenancy-transaction.ts#L25)

#### Properties

##### dbSettingKey?

```ts
optional dbSettingKey?: string;
```

Defined in: [src/prisma/tenancy-transaction.ts:29](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/tenancy-transaction.ts#L29)

##### isolationLevel?

```ts
optional isolationLevel?: "ReadUncommitted" | "ReadCommitted" | "RepeatableRead" | "Serializable";
```

Defined in: [src/prisma/tenancy-transaction.ts:28](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/tenancy-transaction.ts#L28)

PostgreSQL transaction isolation level.

##### timeout?

```ts
optional timeout?: number;
```

Defined in: [src/prisma/tenancy-transaction.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/tenancy-transaction.ts#L26)

***

### TenantContextBypassedEvent

Defined in: [src/events/tenancy-events.ts:44](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L44)

#### Properties

##### previousTenantId?

```ts
optional previousTenantId?: string | null;
```

Defined in: [src/events/tenancy-events.ts:46](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L46)

##### reason

```ts
reason: "decorator" | "withoutTenant";
```

Defined in: [src/events/tenancy-events.ts:45](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L45)

##### requestSummary?

```ts
optional requestSummary?: TenancyEventRequestSummary;
```

Defined in: [src/events/tenancy-events.ts:47](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L47)

***

### TenantContextCarrier

Defined in: [src/interfaces/tenant-context-carrier.interface.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenant-context-carrier.interface.ts#L14)

Transport-agnostic contract for propagating tenant context across service boundaries.

Unlike `TenantPropagator` (HTTP-specific, returns `Record<string, string>`),
this interface supports any carrier type: Bull job data, Kafka messages,
gRPC metadata, or custom transports.

Follows the OpenTelemetry inject/extract pattern:
- `inject`: attaches the current tenant ID to an outgoing carrier
- `extract`: reads a tenant ID from an incoming carrier

#### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `TCarrier` | `unknown` | The transport-specific data structure (e.g., job data object, Kafka message, gRPC Metadata) |

#### Methods

##### extract()

```ts
extract(carrier): string | null;
```

Defined in: [src/interfaces/tenant-context-carrier.interface.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenant-context-carrier.interface.ts#L26)

Extracts the tenant ID from an incoming carrier.
Returns the tenant ID string, or `null` if not present.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `carrier` | `TCarrier` |

###### Returns

`string` \| `null`

##### inject()

```ts
inject(carrier): TCarrier;
```

Defined in: [src/interfaces/tenant-context-carrier.interface.ts:20](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenant-context-carrier.interface.ts#L20)

Attaches the current tenant ID to the carrier for outbound propagation.
Returns the carrier with tenant context included.
If no tenant context is available, returns the carrier unchanged.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `carrier` | `TCarrier` |

###### Returns

`TCarrier`

***

### TenantCrossCheckFailedEvent

Defined in: [src/events/tenancy-events.ts:50](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L50)

#### Extends

- `TenancyEventRequestPayload`

#### Properties

##### crossCheckTenantId

```ts
crossCheckTenantId: string;
```

Defined in: [src/events/tenancy-events.ts:52](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L52)

##### extractedTenantId

```ts
extractedTenantId: string;
```

Defined in: [src/events/tenancy-events.ts:51](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L51)

##### ~~request?~~

```ts
optional request?: TenancyRequest;
```

Defined in: [src/events/tenancy-events.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L26)

###### Deprecated

Use `requestSummary` instead. Raw request objects may contain
credentials, cookies, body data, and framework-specific references.

###### Inherited from

```ts
TenancyEventRequestPayload.request
```

##### requestSummary?

```ts
optional requestSummary?: TenancyEventRequestSummary;
```

Defined in: [src/events/tenancy-events.ts:21](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L21)

###### Inherited from

```ts
TenancyEventRequestPayload.requestSummary
```

***

### TenantExtractionFailedEvent

Defined in: [src/events/tenancy-events.ts:35](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L35)

#### Extends

- `TenancyEventRequestPayload`

#### Properties

##### errorMessage

```ts
errorMessage: string;
```

Defined in: [src/events/tenancy-events.ts:37](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L37)

##### errorName

```ts
errorName: string;
```

Defined in: [src/events/tenancy-events.ts:36](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L36)

##### ~~request?~~

```ts
optional request?: TenancyRequest;
```

Defined in: [src/events/tenancy-events.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L26)

###### Deprecated

Use `requestSummary` instead. Raw request objects may contain
credentials, cookies, body data, and framework-specific references.

###### Inherited from

```ts
TenancyEventRequestPayload.request
```

##### requestSummary?

```ts
optional requestSummary?: TenancyEventRequestSummary;
```

Defined in: [src/events/tenancy-events.ts:21](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L21)

###### Inherited from

```ts
TenancyEventRequestPayload.requestSummary
```

***

### TenantExtractor

Defined in: [src/interfaces/tenant-extractor.interface.ts:15](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenant-extractor.interface.ts#L15)

Contract for extracting a tenant ID from an inbound HTTP request.

Return the tenant ID string when present, or `null` when the request does
not carry tenant information. A missing tenant is not an error condition;
`TenantMiddleware` will call `onTenantNotFound` and let the application
decide whether to continue, respond, or throw.

Implementations may return synchronously or return a Promise for async
lookups. Throw only for malformed input or policy failures that should
reject the request immediately.

#### Methods

##### extract()

```ts
extract(request): string | Promise<string | null> | null;
```

Defined in: [src/interfaces/tenant-extractor.interface.ts:16](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenant-extractor.interface.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | [`TenancyRequest`](#tenancyrequest) |

###### Returns

`string` \| `Promise`\<`string` \| `null`\> \| `null`

***

### TenantPropagator

Defined in: [src/interfaces/tenant-propagator.interface.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenant-propagator.interface.ts#L8)

Contract for propagating tenant context to outgoing requests.

Implementations transform the current tenant ID into transport-specific
headers or metadata. Used by `HttpTenantPropagator` for HTTP and
`KafkaTenantPropagator` for Kafka. For Bull and gRPC, see `TenantContextCarrier`.

#### Methods

##### getHeaders()

```ts
getHeaders(): Record<string, string>;
```

Defined in: [src/interfaces/tenant-propagator.interface.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/interfaces/tenant-propagator.interface.ts#L13)

Returns headers to propagate tenant context.
Returns an empty object if no tenant context is available.

###### Returns

`Record`\<`string`, `string`\>

***

### TenantResolvedEvent

Defined in: [src/events/tenancy-events.ts:29](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L29)

#### Extends

- `TenancyEventRequestPayload`

#### Properties

##### ~~request?~~

```ts
optional request?: TenancyRequest;
```

Defined in: [src/events/tenancy-events.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L26)

###### Deprecated

Use `requestSummary` instead. Raw request objects may contain
credentials, cookies, body data, and framework-specific references.

###### Inherited from

```ts
TenancyEventRequestPayload.request
```

##### requestSummary?

```ts
optional requestSummary?: TenancyEventRequestSummary;
```

Defined in: [src/events/tenancy-events.ts:21](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L21)

###### Inherited from

```ts
TenancyEventRequestPayload.requestSummary
```

##### tenantId

```ts
tenantId: string;
```

Defined in: [src/events/tenancy-events.ts:30](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L30)

***

### TenantValidationFailedEvent

Defined in: [src/events/tenancy-events.ts:40](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L40)

#### Extends

- `TenancyEventRequestPayload`

#### Properties

##### ~~request?~~

```ts
optional request?: TenancyRequest;
```

Defined in: [src/events/tenancy-events.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L26)

###### Deprecated

Use `requestSummary` instead. Raw request objects may contain
credentials, cookies, body data, and framework-specific references.

###### Inherited from

```ts
TenancyEventRequestPayload.request
```

##### requestSummary?

```ts
optional requestSummary?: TenancyEventRequestSummary;
```

Defined in: [src/events/tenancy-events.ts:21](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L21)

###### Inherited from

```ts
TenancyEventRequestPayload.requestSummary
```

##### tenantId

```ts
tenantId: string;
```

Defined in: [src/events/tenancy-events.ts:41](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L41)

## Type Aliases

### TenantContextInterceptorOptions

```ts
type TenantContextInterceptorOptions = 
  | {
  kafkaHeaderName?: string;
  transport: "kafka";
}
  | {
  bullDataKey?: string;
  transport: "bull";
}
  | {
  grpcMetadataKey?: string;
  transport: "grpc";
}
  | {
  bullDataKey?: string;
  grpcMetadataKey?: string;
  kafkaHeaderName?: string;
  transport?: undefined;
};
```

Defined in: [src/propagation/tenant-context.interceptor.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/tenant-context.interceptor.ts#L17)

Options for `TenantContextInterceptor`.

When `transport` is specified, only the matching transport key is accepted.
When `transport` is omitted, all keys are available for duck-typing fallback.

***

### TenantNotFoundEvent

```ts
type TenantNotFoundEvent = TenancyEventRequestPayload;
```

Defined in: [src/events/tenancy-events.ts:33](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L33)

## Variables

### CurrentTenant

```ts
const CurrentTenant: (...dataOrPipes) => ParameterDecorator;
```

Defined in: [src/decorators/current-tenant.decorator.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/decorators/current-tenant.decorator.ts#L4)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`dataOrPipes` | `unknown`[] |

#### Returns

`ParameterDecorator`

***

### TENANCY\_MODULE\_OPTIONS

```ts
const TENANCY_MODULE_OPTIONS: typeof TENANCY_MODULE_OPTIONS;
```

Defined in: [src/tenancy.constants.ts:2](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/tenancy.constants.ts#L2)

***

### TenancyEvents

```ts
const TenancyEvents: {
  CONTEXT_BYPASSED: "tenant.context_bypassed";
  CROSS_CHECK_FAILED: "tenant.cross_check_failed";
  EXTRACTION_FAILED: "tenant.extraction_failed";
  NOT_FOUND: "tenant.not_found";
  RESOLVED: "tenant.resolved";
  VALIDATION_FAILED: "tenant.validation_failed";
};
```

Defined in: [src/events/tenancy-events.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L11)

#### Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-context_bypassed"></a> `CONTEXT_BYPASSED` | `"tenant.context_bypassed"` | `'tenant.context_bypassed'` | [src/events/tenancy-events.ts:16](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L16) |
| <a id="property-cross_check_failed"></a> `CROSS_CHECK_FAILED` | `"tenant.cross_check_failed"` | `'tenant.cross_check_failed'` | [src/events/tenancy-events.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L17) |
| <a id="property-extraction_failed"></a> `EXTRACTION_FAILED` | `"tenant.extraction_failed"` | `'tenant.extraction_failed'` | [src/events/tenancy-events.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L14) |
| <a id="property-not_found"></a> `NOT_FOUND` | `"tenant.not_found"` | `'tenant.not_found'` | [src/events/tenancy-events.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L13) |
| <a id="property-resolved"></a> `RESOLVED` | `"tenant.resolved"` | `'tenant.resolved'` | [src/events/tenancy-events.ts:12](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L12) |
| <a id="property-validation_failed"></a> `VALIDATION_FAILED` | `"tenant.validation_failed"` | `'tenant.validation_failed'` | [src/events/tenancy-events.ts:15](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/events/tenancy-events.ts#L15) |

## Functions

### BypassTenancy()

```ts
function BypassTenancy(): CustomDecorator<typeof BYPASS_TENANCY_KEY>;
```

Defined in: [src/decorators/bypass-tenancy.decorator.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/decorators/bypass-tenancy.decorator.ts#L14)

Marks a route or controller to skip `TenancyGuard`'s tenant-required check.

**Important:** This only bypasses the guard — it does NOT clear the tenant context.
If the request contains a tenant header, `TenantMiddleware` still sets the context,
so `getCurrentTenant()` may return a value and Prisma queries will still be RLS-filtered.

Use this for endpoints that should work with or without a tenant (e.g., health checks,
public APIs). If you need to explicitly run without tenant context, use `withoutTenant()`.

#### Returns

`CustomDecorator`\<*typeof* `BYPASS_TENANCY_KEY`\>

***

### createPrismaTenancyExtension()

```ts
function createPrismaTenancyExtension(tenancyService, options?): (client) => PrismaClientExtends<InternalArgs<{
}, {
}, {
}, {
}>>;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:96](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/prisma-tenancy.extension.ts#L96)

Creates a Prisma Client Extension that sets the PostgreSQL RLS context
before every model query when a tenant context exists.

Uses `Prisma.defineExtension` to access the base client via closure,
then wraps each query in a batch transaction:
  1. `SELECT set_config(key, tenantId, TRUE)` — sets the RLS variable (transaction-local)
  2. `query(args)` — the original query, now filtered by RLS

SECURITY: Uses `$executeRaw` tagged template with bind parameters.
`set_config()` accepts parameterized values, unlike `SET LOCAL` which
requires string interpolation. This eliminates SQL injection risk entirely.

Options:
- `dbSettingKey`: PostgreSQL session variable name (default: app.current_tenant)
- `autoInjectTenantId`: Automatically inject tenant ID into write operations
- `tenantIdField`: Field name to inject tenant ID into (default: tenant_id)
- `sharedModels`: Models that are shared across tenants (skips RLS and injection)
- `failClosed`: Throw when model queries run without tenant context (default: true)

**Interactive transactions:**
By default, the batch `$transaction([set_config, query])` does not propagate into
interactive transactions (`$transaction(async (tx) => ...)`). Two solutions:
1. Enable `interactiveTransactionSupport: true` for transparent handling (uses Prisma internals).
2. Use the standalone `tenancyTransaction()` helper (public APIs only).

Usage:
```typescript
const prisma = basePrisma.$extends(
  createPrismaTenancyExtension(tenancyService)
);
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenancyService` | [`TenancyService`](#tenancyservice) |
| `options?` | [`PrismaTenancyExtensionOptions`](#prismatenancyextensionoptions) |

#### Returns

(`client`) => `PrismaClientExtends`\<`InternalArgs`\<\{
\}, \{
\}, \{
\}, \{
\}\>\>

***

### propagateTenantHeaders()

```ts
function propagateTenantHeaders(headerName?): Record<string, string>;
```

Defined in: [src/propagation/propagate-tenant-headers.ts:34](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/propagation/propagate-tenant-headers.ts#L34)

Returns HTTP headers containing the current tenant ID for service-to-service propagation.

Works with any HTTP client (fetch, axios, got, undici, node:http) — no dependencies required.
Returns an empty object when no tenant context is available.

Uses the static `AsyncLocalStorage` from `TenancyContext`, so it works anywhere in
the call stack without dependency injection.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `headerName` | `string` | `DEFAULT_PROPAGATION_HEADER` | Header name for tenant ID (default: 'X-Tenant-Id') |

#### Returns

`Record`\<`string`, `string`\>

Object with tenant header, or empty object if no tenant context

#### Example

```typescript
// With fetch
const res = await fetch('/api/orders', {
  headers: { ...propagateTenantHeaders() },
});

// With axios
const res = await axios.get('/api/orders', {
  headers: propagateTenantHeaders(),
});

// With @nestjs/axios HttpService
this.httpService.get('/api/orders', {
  headers: propagateTenantHeaders(),
});
```

***

### tenancyTransaction()

```ts
function tenancyTransaction<T, TTx>(
   prisma, 
   tenancyService, 
   callback, 
options?): Promise<T>;
```

Defined in: [src/prisma/tenancy-transaction.ts:44](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/prisma/tenancy-transaction.ts#L44)

Executes a Prisma interactive transaction with RLS tenant context.

Runs `set_config()` as the first statement inside the interactive
transaction, ensuring the PostgreSQL session variable is set on the
same connection that executes the callback queries.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | - |
| `TTx` *extends* [`PrismaTransactionContext`](#prismatransactioncontext) | `any` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prisma` | [`PrismaTransactionClient`](#prismatransactionclient)\<`TTx`\> | PrismaClient instance (not extended — raw client) |
| `tenancyService` | [`TenancyService`](#tenancyservice) | TenancyService to read current tenant |
| `callback` | (`tx`) => `Promise`\<`T`\> | Function receiving the transaction client |
| `options?` | [`TenancyTransactionOptions`](#tenancytransactionoptions) | Transaction timeout, isolation level, and DB setting key |

#### Returns

`Promise`\<`T`\>
