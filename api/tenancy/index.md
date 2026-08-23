# @nestarc/tenancy

## Classes

<a id="api-bulltenantpropagator"></a>

### BullTenantPropagator

Defined in: [src/propagation/bull-tenant-propagator.ts:35](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/bull-tenant-propagator.ts#L35)

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

- [`TenantContextCarrier`](#api-tenantcontextcarrier)\<`Record`\<`string`, `unknown`\>\>

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new BullTenantPropagator(context, options?): BullTenantPropagator;
```

Defined in: [src/propagation/bull-tenant-propagator.ts:42](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/bull-tenant-propagator.ts#L42)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`TenancyContext`](#api-tenancycontext) |
| `options?` | [`BullPropagationOptions`](#api-bullpropagationoptions) |

###### Returns

[`BullTenantPropagator`](#api-bulltenantpropagator)

#### Methods

<a id="api-extract"></a>

##### extract()

```ts
extract(jobData): string | null;
```

Defined in: [src/propagation/bull-tenant-propagator.ts:69](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/bull-tenant-propagator.ts#L69)

Extracts the tenant ID from an incoming carrier.
Returns the tenant ID string, or `null` if not present.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobData` | `Record`\<`string`, `unknown`\> |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantContextCarrier`](#api-tenantcontextcarrier).[`extract`](#api-extract-8)

<a id="api-inject"></a>

##### inject()

```ts
inject(jobData): Record<string, unknown>;
```

Defined in: [src/propagation/bull-tenant-propagator.ts:51](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/bull-tenant-propagator.ts#L51)

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

[`TenantContextCarrier`](#api-tenantcontextcarrier).[`inject`](#api-inject-4)

***

<a id="api-compositetenantextractor"></a>

### CompositeTenantExtractor

Defined in: [src/extractors/composite.extractor.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/composite.extractor.ts#L4)

Contract for extracting a tenant ID from an inbound HTTP request.

Return the tenant ID string when present, or `null` when the request does
not carry tenant information. A missing tenant is not an error condition;
`TenantMiddleware` will call `onTenantNotFound` and let the application
decide whether to continue, respond, or throw.

Implementations may return synchronously or return a Promise for async
lookups. Throw only for malformed input or policy failures that should
reject the request immediately.

#### Implements

- [`TenantExtractor`](#api-tenantextractor-1)

#### Constructors

<a id="api-constructor-1"></a>

##### Constructor

```ts
new CompositeTenantExtractor(extractors): CompositeTenantExtractor;
```

Defined in: [src/extractors/composite.extractor.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/composite.extractor.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `extractors` | [`TenantExtractor`](#api-tenantextractor-1)[] |

###### Returns

[`CompositeTenantExtractor`](#api-compositetenantextractor)

#### Methods

<a id="api-extract-1"></a>

##### extract()

```ts
extract(request): string | Promise<string | null> | null;
```

Defined in: [src/extractors/composite.extractor.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/composite.extractor.ts#L11)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | [`TenancyRequest`](#api-tenancyrequest) |

###### Returns

`string` \| `Promise`\<`string` \| `null`\> \| `null`

###### Implementation of

[`TenantExtractor`](#api-tenantextractor-1).[`extract`](#api-extract-9)

***

<a id="api-grpctenantpropagator"></a>

### GrpcTenantPropagator

Defined in: [src/propagation/grpc-tenant-propagator.ts:48](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/grpc-tenant-propagator.ts#L48)

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

- [`TenantContextCarrier`](#api-tenantcontextcarrier)\<[`GrpcMetadataLike`](#api-grpcmetadatalike)\>

#### Constructors

<a id="api-constructor-2"></a>

##### Constructor

```ts
new GrpcTenantPropagator(context, options?): GrpcTenantPropagator;
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:55](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/grpc-tenant-propagator.ts#L55)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`TenancyContext`](#api-tenancycontext) |
| `options?` | [`GrpcPropagationOptions`](#api-grpcpropagationoptions) |

###### Returns

[`GrpcTenantPropagator`](#api-grpctenantpropagator)

#### Methods

<a id="api-extract-2"></a>

##### extract()

```ts
extract(metadata): string | null;
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:74](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/grpc-tenant-propagator.ts#L74)

Extracts the tenant ID from an incoming carrier.
Returns the tenant ID string, or `null` if not present.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `metadata` | [`GrpcMetadataLike`](#api-grpcmetadatalike) |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantContextCarrier`](#api-tenantcontextcarrier).[`extract`](#api-extract-8)

<a id="api-inject-1"></a>

##### inject()

```ts
inject(metadata): GrpcMetadataLike;
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:64](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/grpc-tenant-propagator.ts#L64)

Attaches the current tenant ID to the carrier for outbound propagation.
Returns the carrier with tenant context included.
If no tenant context is available, returns the carrier unchanged.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `metadata` | [`GrpcMetadataLike`](#api-grpcmetadatalike) |

###### Returns

[`GrpcMetadataLike`](#api-grpcmetadatalike)

###### Implementation of

[`TenantContextCarrier`](#api-tenantcontextcarrier).[`inject`](#api-inject-4)

***

<a id="api-headertenantextractor"></a>

### HeaderTenantExtractor

Defined in: [src/extractors/header.extractor.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/header.extractor.ts#L4)

Contract for extracting a tenant ID from an inbound HTTP request.

Return the tenant ID string when present, or `null` when the request does
not carry tenant information. A missing tenant is not an error condition;
`TenantMiddleware` will call `onTenantNotFound` and let the application
decide whether to continue, respond, or throw.

Implementations may return synchronously or return a Promise for async
lookups. Throw only for malformed input or policy failures that should
reject the request immediately.

#### Implements

- [`TenantExtractor`](#api-tenantextractor-1)

#### Constructors

<a id="api-constructor-3"></a>

##### Constructor

```ts
new HeaderTenantExtractor(headerName): HeaderTenantExtractor;
```

Defined in: [src/extractors/header.extractor.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/header.extractor.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `headerName` | `string` |

###### Returns

[`HeaderTenantExtractor`](#api-headertenantextractor)

#### Methods

<a id="api-extract-3"></a>

##### extract()

```ts
extract(request): string | null;
```

Defined in: [src/extractors/header.extractor.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/header.extractor.ts#L11)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | [`TenancyRequest`](#api-tenancyrequest) |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantExtractor`](#api-tenantextractor-1).[`extract`](#api-extract-9)

***

<a id="api-httptenantpropagator"></a>

### HttpTenantPropagator

Defined in: [src/propagation/http-tenant-propagator.ts:23](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/http-tenant-propagator.ts#L23)

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

- [`TenantPropagator`](#api-tenantpropagator)

#### Constructors

<a id="api-constructor-4"></a>

##### Constructor

```ts
new HttpTenantPropagator(context, options?): HttpTenantPropagator;
```

Defined in: [src/propagation/http-tenant-propagator.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/http-tenant-propagator.ts#L26)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`TenancyContext`](#api-tenancycontext) |
| `options?` | [`HttpPropagationOptions`](#api-httppropagationoptions) |

###### Returns

[`HttpTenantPropagator`](#api-httptenantpropagator)

#### Methods

<a id="api-getheaders"></a>

##### getHeaders()

```ts
getHeaders(): Record<string, string>;
```

Defined in: [src/propagation/http-tenant-propagator.ts:33](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/http-tenant-propagator.ts#L33)

Returns headers to propagate tenant context.
Returns an empty object if no tenant context is available.

###### Returns

`Record`\<`string`, `string`\>

###### Implementation of

[`TenantPropagator`](#api-tenantpropagator).[`getHeaders`](#api-getheaders-2)

***

<a id="api-jwtclaimtenantextractor"></a>

### JwtClaimTenantExtractor

Defined in: [src/extractors/jwt-claim.extractor.ts:37](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/jwt-claim.extractor.ts#L37)

Extracts the tenant ID from a JWT claim in the Authorization header.

**IMPORTANT: This extractor does NOT verify the JWT signature.**
It decodes the payload (Base64URL) without cryptographic validation.
You MUST ensure that JWT authentication (e.g., `@nestjs/passport` AuthGuard,
or an upstream auth middleware) has already validated the token before this
extractor runs. Using this extractor without prior JWT verification allows
attackers to forge tenant IDs via crafted tokens.

#### Implements

- [`TenantExtractor`](#api-tenantextractor-1)

#### Constructors

<a id="api-constructor-5"></a>

##### Constructor

```ts
new JwtClaimTenantExtractor(options): JwtClaimTenantExtractor;
```

Defined in: [src/extractors/jwt-claim.extractor.ts:41](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/jwt-claim.extractor.ts#L41)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`JwtClaimExtractorOptions`](#api-jwtclaimextractoroptions) |

###### Returns

[`JwtClaimTenantExtractor`](#api-jwtclaimtenantextractor)

#### Methods

<a id="api-extract-4"></a>

##### extract()

```ts
extract(request): string | null;
```

Defined in: [src/extractors/jwt-claim.extractor.ts:46](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/jwt-claim.extractor.ts#L46)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | [`TenancyRequest`](#api-tenancyrequest) |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantExtractor`](#api-tenantextractor-1).[`extract`](#api-extract-9)

***

<a id="api-kafkatenantpropagator"></a>

### KafkaTenantPropagator

Defined in: [src/propagation/kafka-tenant-propagator.ts:45](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/kafka-tenant-propagator.ts#L45)

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

- [`TenantContextCarrier`](#api-tenantcontextcarrier)\<[`KafkaMessageLike`](#api-kafkamessagelike)\>
- [`TenantPropagator`](#api-tenantpropagator)

#### Constructors

<a id="api-constructor-6"></a>

##### Constructor

```ts
new KafkaTenantPropagator(context, options?): KafkaTenantPropagator;
```

Defined in: [src/propagation/kafka-tenant-propagator.ts:52](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/kafka-tenant-propagator.ts#L52)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`TenancyContext`](#api-tenancycontext) |
| `options?` | [`KafkaPropagationOptions`](#api-kafkapropagationoptions) |

###### Returns

[`KafkaTenantPropagator`](#api-kafkatenantpropagator)

#### Methods

<a id="api-extract-5"></a>

##### extract()

```ts
extract(message): string | null;
```

Defined in: [src/propagation/kafka-tenant-propagator.ts:73](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/kafka-tenant-propagator.ts#L73)

Extracts the tenant ID from an incoming carrier.
Returns the tenant ID string, or `null` if not present.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | [`KafkaMessageLike`](#api-kafkamessagelike) |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantContextCarrier`](#api-tenantcontextcarrier).[`extract`](#api-extract-8)

<a id="api-getheaders-1"></a>

##### getHeaders()

```ts
getHeaders(): Record<string, string>;
```

Defined in: [src/propagation/kafka-tenant-propagator.ts:84](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/kafka-tenant-propagator.ts#L84)

Returns headers to propagate tenant context.
Returns an empty object if no tenant context is available.

###### Returns

`Record`\<`string`, `string`\>

###### Implementation of

[`TenantPropagator`](#api-tenantpropagator).[`getHeaders`](#api-getheaders-2)

<a id="api-inject-2"></a>

##### inject()

```ts
inject(message): KafkaMessageLike;
```

Defined in: [src/propagation/kafka-tenant-propagator.ts:61](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/kafka-tenant-propagator.ts#L61)

Attaches the current tenant ID to the carrier for outbound propagation.
Returns the carrier with tenant context included.
If no tenant context is available, returns the carrier unchanged.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | [`KafkaMessageLike`](#api-kafkamessagelike) |

###### Returns

[`KafkaMessageLike`](#api-kafkamessagelike)

###### Implementation of

[`TenantContextCarrier`](#api-tenantcontextcarrier).[`inject`](#api-inject-4)

***

<a id="api-pathtenantextractor"></a>

### PathTenantExtractor

Defined in: [src/extractors/path.extractor.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/path.extractor.ts#L13)

Contract for extracting a tenant ID from an inbound HTTP request.

Return the tenant ID string when present, or `null` when the request does
not carry tenant information. A missing tenant is not an error condition;
`TenantMiddleware` will call `onTenantNotFound` and let the application
decide whether to continue, respond, or throw.

Implementations may return synchronously or return a Promise for async
lookups. Throw only for malformed input or policy failures that should
reject the request immediately.

#### Implements

- [`TenantExtractor`](#api-tenantextractor-1)

#### Constructors

<a id="api-constructor-7"></a>

##### Constructor

```ts
new PathTenantExtractor(options): PathTenantExtractor;
```

Defined in: [src/extractors/path.extractor.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/path.extractor.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`PathExtractorOptions`](#api-pathextractoroptions) |

###### Returns

[`PathTenantExtractor`](#api-pathtenantextractor)

#### Methods

<a id="api-extract-6"></a>

##### extract()

```ts
extract(request): string | null;
```

Defined in: [src/extractors/path.extractor.ts:29](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/path.extractor.ts#L29)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | [`TenancyRequest`](#api-tenancyrequest) |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantExtractor`](#api-tenantextractor-1).[`extract`](#api-extract-9)

***

<a id="api-subdomaintenantextractor"></a>

### SubdomainTenantExtractor

Defined in: [src/extractors/subdomain.extractor.ts:30](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/subdomain.extractor.ts#L30)

Contract for extracting a tenant ID from an inbound HTTP request.

Return the tenant ID string when present, or `null` when the request does
not carry tenant information. A missing tenant is not an error condition;
`TenantMiddleware` will call `onTenantNotFound` and let the application
decide whether to continue, respond, or throw.

Implementations may return synchronously or return a Promise for async
lookups. Throw only for malformed input or policy failures that should
reject the request immediately.

#### Implements

- [`TenantExtractor`](#api-tenantextractor-1)

#### Constructors

<a id="api-constructor-8"></a>

##### Constructor

```ts
new SubdomainTenantExtractor(options?): SubdomainTenantExtractor;
```

Defined in: [src/extractors/subdomain.extractor.ts:34](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/subdomain.extractor.ts#L34)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`SubdomainExtractorOptions`](#api-subdomainextractoroptions) |

###### Returns

[`SubdomainTenantExtractor`](#api-subdomaintenantextractor)

#### Methods

<a id="api-extract-7"></a>

##### extract()

```ts
extract(request): string | null;
```

Defined in: [src/extractors/subdomain.extractor.ts:41](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/subdomain.extractor.ts#L41)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | [`TenancyRequest`](#api-tenancyrequest) |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantExtractor`](#api-tenantextractor-1).[`extract`](#api-extract-9)

***

<a id="api-tenancycontext"></a>

### TenancyContext

Defined in: [src/services/tenancy-context.ts:9](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/services/tenancy-context.ts#L9)

#### Constructors

<a id="api-constructor-9"></a>

##### Constructor

```ts
new TenancyContext(): TenancyContext;
```

###### Returns

[`TenancyContext`](#api-tenancycontext)

#### Methods

<a id="api-getcurrenttenantid"></a>

##### getCurrentTenantId()

```ts
static getCurrentTenantId(): string | null;
```

Defined in: [src/services/tenancy-context.ts:12](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/services/tenancy-context.ts#L12)

###### Returns

`string` \| `null`

<a id="api-gettenantid"></a>

##### getTenantId()

```ts
getTenantId(): string | null;
```

Defined in: [src/services/tenancy-context.ts:22](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/services/tenancy-context.ts#L22)

###### Returns

`string` \| `null`

<a id="api-isbypassed"></a>

##### isBypassed()

```ts
isBypassed(): boolean;
```

Defined in: [src/services/tenancy-context.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/services/tenancy-context.ts#L26)

###### Returns

`boolean`

<a id="api-run"></a>

##### run()

###### Call Signature

```ts
run<T>(tenantId, callback): Promise<T>;
```

Defined in: [src/services/tenancy-context.ts:16](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/services/tenancy-context.ts#L16)

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

Defined in: [src/services/tenancy-context.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/services/tenancy-context.ts#L17)

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

<a id="api-runwithouttenant"></a>

##### runWithoutTenant()

###### Call Signature

```ts
runWithoutTenant<T>(callback): Promise<T>;
```

Defined in: [src/services/tenancy-context.ts:30](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/services/tenancy-context.ts#L30)

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

Defined in: [src/services/tenancy-context.ts:31](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/services/tenancy-context.ts#L31)

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

<a id="api-tenancycontextrequirederror"></a>

### TenancyContextRequiredError

Defined in: [src/errors/tenancy-context-required.error.ts:3](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/errors/tenancy-context-required.error.ts#L3)

#### Extends

- [`TenantContextMissingError`](#api-tenantcontextmissingerror)

#### Constructors

<a id="api-constructor-10"></a>

##### Constructor

```ts
new TenancyContextRequiredError(model, operation): TenancyContextRequiredError;
```

Defined in: [src/errors/tenancy-context-required.error.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/errors/tenancy-context-required.error.ts#L6)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `model` | `string` |
| `operation` | `string` |

###### Returns

[`TenancyContextRequiredError`](#api-tenancycontextrequirederror)

###### Overrides

[`TenantContextMissingError`](#api-tenantcontextmissingerror).[`constructor`](#api-constructor-17)

#### Properties

<a id="api-message"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`TenantContextMissingError`](#api-tenantcontextmissingerror).[`message`](#api-message-1)

<a id="api-model"></a>

##### model

```ts
readonly model: string;
```

Defined in: [src/errors/tenancy-context-required.error.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/errors/tenancy-context-required.error.ts#L7)

<a id="api-name"></a>

##### name

```ts
name: string = 'TenancyContextRequiredError';
```

Defined in: [src/errors/tenancy-context-required.error.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/errors/tenancy-context-required.error.ts#L4)

###### Overrides

[`TenantContextMissingError`](#api-tenantcontextmissingerror).[`name`](#api-name-1)

<a id="api-operation-1"></a>

##### operation

```ts
readonly operation: string;
```

Defined in: [src/errors/tenancy-context-required.error.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/errors/tenancy-context-required.error.ts#L8)

<a id="api-stack"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`TenantContextMissingError`](#api-tenantcontextmissingerror).[`stack`](#api-stack-1)

<a id="api-stacktracelimit"></a>

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

[`TenantContextMissingError`](#api-tenantcontextmissingerror).[`stackTraceLimit`](#api-stacktracelimit-1)

#### Methods

<a id="api-capturestacktrace"></a>

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

[`TenantContextMissingError`](#api-tenantcontextmissingerror).[`captureStackTrace`](#api-capturestacktrace-1)

<a id="api-preparestacktrace"></a>

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

[`TenantContextMissingError`](#api-tenantcontextmissingerror).[`prepareStackTrace`](#api-preparestacktrace-1)

<a id="api-tojson"></a>

##### toJSON()

```ts
toJSON(): {
  message: string;
  model: string;
  name: string;
  operation: string;
};
```

Defined in: [src/errors/tenancy-context-required.error.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/errors/tenancy-context-required.error.ts#L17)

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
| `message` | `string` | [src/errors/tenancy-context-required.error.ts:20](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/errors/tenancy-context-required.error.ts#L20) |
| `model` | `string` | [src/errors/tenancy-context-required.error.ts:21](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/errors/tenancy-context-required.error.ts#L21) |
| `name` | `string` | [src/errors/tenancy-context-required.error.ts:19](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/errors/tenancy-context-required.error.ts#L19) |
| `operation` | `string` | [src/errors/tenancy-context-required.error.ts:22](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/errors/tenancy-context-required.error.ts#L22) |

***

<a id="api-tenancyeventservice"></a>

### TenancyEventService

Defined in: [src/events/tenancy-event.service.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-event.service.ts#L14)

Optional event emission service that integrates with @nestjs/event-emitter.

If `@nestjs/event-emitter` is installed and `EventEmitterModule.forRoot()`
is imported, events are emitted via EventEmitter2.
If not installed, all emit() calls are silently ignored.

#### Implements

- `OnModuleInit`

#### Constructors

<a id="api-constructor-11"></a>

##### Constructor

```ts
new TenancyEventService(moduleRef): TenancyEventService;
```

Defined in: [src/events/tenancy-event.service.ts:18](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-event.service.ts#L18)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `moduleRef` | `ModuleRef` |

###### Returns

[`TenancyEventService`](#api-tenancyeventservice)

#### Methods

<a id="api-emit"></a>

##### emit()

```ts
emit<K>(event, payload): void;
```

Defined in: [src/events/tenancy-event.service.ts:31](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-event.service.ts#L31)

###### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof [`TenancyEventMap`](#api-tenancyeventmap) |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `payload` | [`TenancyEventMap`](#api-tenancyeventmap)\[`K`\] |

###### Returns

`void`

<a id="api-onmoduleinit"></a>

##### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [src/events/tenancy-event.service.ts:20](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-event.service.ts#L20)

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleInit.onModuleInit
```

***

<a id="api-tenancymodule"></a>

### TenancyModule

Defined in: [src/tenancy.module.ts:50](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/tenancy.module.ts#L50)

#### Implements

- `NestModule`

#### Constructors

<a id="api-constructor-12"></a>

##### Constructor

```ts
new TenancyModule(): TenancyModule;
```

###### Returns

[`TenancyModule`](#api-tenancymodule)

#### Methods

<a id="api-configure"></a>

##### configure()

```ts
configure(consumer): void;
```

Defined in: [src/tenancy.module.ts:51](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/tenancy.module.ts#L51)

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

Defined in: [src/tenancy.module.ts:60](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/tenancy.module.ts#L60)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`TenancyModuleOptions`](#api-tenancymoduleoptions) |

###### Returns

`DynamicModule`

<a id="api-forrootasync"></a>

##### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [src/tenancy.module.ts:66](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/tenancy.module.ts#L66)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`TenancyModuleAsyncOptions`](#api-tenancymoduleasyncoptions) |

###### Returns

`DynamicModule`

***

<a id="api-tenancyservice"></a>

### TenancyService

Defined in: [src/services/tenancy.service.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/services/tenancy.service.ts#L8)

#### Constructors

<a id="api-constructor-13"></a>

##### Constructor

```ts
new TenancyService(context, eventService?): TenancyService;
```

Defined in: [src/services/tenancy.service.ts:9](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/services/tenancy.service.ts#L9)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`TenancyContext`](#api-tenancycontext) |
| `eventService?` | [`TenancyEventService`](#api-tenancyeventservice) |

###### Returns

[`TenancyService`](#api-tenancyservice)

#### Methods

<a id="api-getcurrenttenant"></a>

##### getCurrentTenant()

```ts
getCurrentTenant(): string | null;
```

Defined in: [src/services/tenancy.service.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/services/tenancy.service.ts#L14)

###### Returns

`string` \| `null`

<a id="api-getcurrenttenantorthrow"></a>

##### getCurrentTenantOrThrow()

```ts
getCurrentTenantOrThrow(): string;
```

Defined in: [src/services/tenancy.service.ts:18](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/services/tenancy.service.ts#L18)

###### Returns

`string`

<a id="api-istenantbypassed"></a>

##### isTenantBypassed()

```ts
isTenantBypassed(): boolean;
```

Defined in: [src/services/tenancy.service.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/services/tenancy.service.ts#L26)

###### Returns

`boolean`

<a id="api-withouttenant"></a>

##### withoutTenant()

```ts
withoutTenant<T>(callback): Promise<T>;
```

Defined in: [src/services/tenancy.service.ts:30](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/services/tenancy.service.ts#L30)

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

<a id="api-tenancytelemetryservice"></a>

### TenancyTelemetryService

Defined in: [src/telemetry/tenancy-telemetry.service.ts:25](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/telemetry/tenancy-telemetry.service.ts#L25)

Optional OpenTelemetry integration service.

If `@opentelemetry/api` is installed, automatically adds the tenant ID
as a span attribute to the current active span. Optionally creates
custom spans for tenant lifecycle events.

If `@opentelemetry/api` is not installed, all methods are silently no-ops.
Follows the same graceful degradation pattern as `TenancyEventService`.

#### Implements

- `OnModuleInit`

#### Constructors

<a id="api-constructor-14"></a>

##### Constructor

```ts
new TenancyTelemetryService(options): TenancyTelemetryService;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:33](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/telemetry/tenancy-telemetry.service.ts#L33)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`TenancyModuleOptions`](#api-tenancymoduleoptions) |

###### Returns

[`TenancyTelemetryService`](#api-tenancytelemetryservice)

#### Methods

<a id="api-endspan"></a>

##### endSpan()

```ts
endSpan(span): void;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:126](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/telemetry/tenancy-telemetry.service.ts#L126)

Safely end a span (null-safe).

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `span` | `Pick`\<`Span`, `"end"`\> \| `null` |

###### Returns

`void`

<a id="api-onmoduleinit-1"></a>

##### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:41](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/telemetry/tenancy-telemetry.service.ts#L41)

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleInit.onModuleInit
```

<a id="api-recordmissingcontext"></a>

##### recordMissingContext()

```ts
recordMissingContext(diagnostic): void;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:65](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/telemetry/tenancy-telemetry.service.ts#L65)

Record a non-HTTP missing-context span event and metric counter.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `diagnostic` | [`MissingTenantContextDiagnostic`](#api-missingtenantcontextdiagnostic) |

###### Returns

`void`

<a id="api-settenantattribute"></a>

##### setTenantAttribute()

```ts
setTenantAttribute(tenantId): void;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:58](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/telemetry/tenancy-telemetry.service.ts#L58)

Add tenant.id attribute to the current active span.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` |

###### Returns

`void`

<a id="api-startspan"></a>

##### startSpan()

```ts
startSpan(name, attributes?): Span | null;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:82](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/telemetry/tenancy-telemetry.service.ts#L82)

Start a custom span (only when createSpans is true). Returns null if disabled or OTel unavailable.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `attributes?` | `Attributes` |

###### Returns

`Span` \| `null`

<a id="api-starttenantspan"></a>

##### startTenantSpan()

```ts
startTenantSpan(name, tenantId): Span | null;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:88](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/telemetry/tenancy-telemetry.service.ts#L88)

Start a custom span with the configured tenant ID attribute attached.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `tenantId` | `string` |

###### Returns

`Span` \| `null`

<a id="api-withspan"></a>

##### withSpan()

```ts
withSpan<T>(
   name,
   attributes,
   callback): T;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:93](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/telemetry/tenancy-telemetry.service.ts#L93)

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

<a id="api-withtenantspan"></a>

##### withTenantSpan()

```ts
withTenantSpan<T>(
   name,
   tenantId,
   callback): T;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:117](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/telemetry/tenancy-telemetry.service.ts#L117)

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

<a id="api-tenantcontextdiagnostics"></a>

### TenantContextDiagnostics

Defined in: [src/diagnostics/tenant-context-diagnostics.ts:36](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/diagnostics/tenant-context-diagnostics.ts#L36)

Applies one missing-context policy across non-HTTP transports and resources.

`ignore` preserves the pre-diagnostics behavior. `warn` reports and continues,
while `throw` reports and then raises `TenantContextMissingError`.

#### Constructors

<a id="api-constructor-15"></a>

##### Constructor

```ts
new TenantContextDiagnostics(
   options?,
   eventService?,
   telemetryService?): TenantContextDiagnostics;
```

Defined in: [src/diagnostics/tenant-context-diagnostics.ts:40](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/diagnostics/tenant-context-diagnostics.ts#L40)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`TenantContextDiagnosticsOptions`](#api-tenantcontextdiagnosticsoptions) |
| `eventService?` | `Pick`\<[`TenancyEventService`](#api-tenancyeventservice), `"emit"`\> |
| `telemetryService?` | `Pick`\<[`TenancyTelemetryService`](#api-tenancytelemetryservice), `"recordMissingContext"`\> |

###### Returns

[`TenantContextDiagnostics`](#api-tenantcontextdiagnostics)

#### Properties

<a id="api-policy"></a>

##### policy

```ts
readonly policy: MissingTenantContextPolicy;
```

Defined in: [src/diagnostics/tenant-context-diagnostics.ts:38](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/diagnostics/tenant-context-diagnostics.ts#L38)

#### Methods

<a id="api-report"></a>

##### report()

```ts
report(diagnostic): void;
```

Defined in: [src/diagnostics/tenant-context-diagnostics.ts:51](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/diagnostics/tenant-context-diagnostics.ts#L51)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `diagnostic` | [`MissingTenantContextDiagnostic`](#api-missingtenantcontextdiagnostic) |

###### Returns

`void`

***

<a id="api-tenantcontextinterceptor"></a>

### TenantContextInterceptor

Defined in: [src/propagation/tenant-context.interceptor.ts:62](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/tenant-context.interceptor.ts#L62)

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

<a id="api-constructor-16"></a>

##### Constructor

```ts
new TenantContextInterceptor(context, options?): TenantContextInterceptor;
```

Defined in: [src/propagation/tenant-context.interceptor.ts:70](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/tenant-context.interceptor.ts#L70)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`TenancyContext`](#api-tenancycontext) |
| `options?` | [`TenantContextInterceptorOptions`](#api-tenantcontextinterceptoroptions) |

###### Returns

[`TenantContextInterceptor`](#api-tenantcontextinterceptor)

#### Methods

<a id="api-intercept"></a>

##### intercept()

```ts
intercept(executionContext, next): Observable<unknown>;
```

Defined in: [src/propagation/tenant-context.interceptor.ts:89](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/tenant-context.interceptor.ts#L89)

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

<a id="api-tenantcontextmissingerror"></a>

### TenantContextMissingError

Defined in: [src/errors/tenant-context-missing.error.ts:22](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/errors/tenant-context-missing.error.ts#L22)

#### Extends

- `Error`

#### Extended by

- [`TenancyContextRequiredError`](#api-tenancycontextrequirederror)

#### Constructors

<a id="api-constructor-17"></a>

##### Constructor

```ts
new TenantContextMissingError(message?): TenantContextMissingError;
```

Defined in: [src/errors/tenant-context-missing.error.ts:25](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/errors/tenant-context-missing.error.ts#L25)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message?` | `string` |

###### Returns

[`TenantContextMissingError`](#api-tenantcontextmissingerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

<a id="api-message-1"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

```ts
Error.message
```

<a id="api-name-1"></a>

##### name

```ts
name: string = 'TenantContextMissingError';
```

Defined in: [src/errors/tenant-context-missing.error.ts:23](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/errors/tenant-context-missing.error.ts#L23)

###### Overrides

```ts
Error.name
```

<a id="api-stack-1"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

```ts
Error.stack
```

<a id="api-stacktracelimit-1"></a>

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

<a id="api-capturestacktrace-1"></a>

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

<a id="api-preparestacktrace-1"></a>

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

***

<a id="api-tenantresourcekey"></a>

### TenantResourceKey

Defined in: [src/resources/tenant-resource-key.ts:18](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-resource-key.ts#L18)

Creates collision-safe tenant-scoped identifiers for Redis and search resources.

#### Constructors

<a id="api-constructor-18"></a>

##### Constructor

```ts
new TenantResourceKey(context, options): TenantResourceKey;
```

Defined in: [src/resources/tenant-resource-key.ts:22](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-resource-key.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`TenancyContext`](#api-tenancycontext) |
| `options` | [`TenantResourceKeyOptions`](#api-tenantresourcekeyoptions) |

###### Returns

[`TenantResourceKey`](#api-tenantresourcekey)

#### Methods

<a id="api-create"></a>

##### create()

```ts
create(key): string | null;
```

Defined in: [src/resources/tenant-resource-key.ts:30](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-resource-key.ts#L30)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`string` \| `null`

***

<a id="api-tenantsearch"></a>

### TenantSearch

Defined in: [src/resources/tenant-search.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-search.ts#L26)

Resolves tenant scope before invoking a vendor-specific search adapter.
The adapter is never called without a tenant. `ignore` and `warn` return
`null`; `throw` raises `TenantContextMissingError`.

#### Type Parameters

| Type Parameter |
| ------ |
| `TQuery` |
| `TResult` |

#### Constructors

<a id="api-constructor-19"></a>

##### Constructor

```ts
new TenantSearch<TQuery, TResult>(
   context,
   adapter,
options): TenantSearch<TQuery, TResult>;
```

Defined in: [src/resources/tenant-search.ts:27](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-search.ts#L27)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`TenancyContext`](#api-tenancycontext) |
| `adapter` | [`TenantSearchAdapter`](#api-tenantsearchadapter)\<`TQuery`, `TResult`\> |
| `options` | [`TenantSearchOptions`](#api-tenantsearchoptions) |

###### Returns

[`TenantSearch`](#api-tenantsearch)\<`TQuery`, `TResult`\>

#### Methods

<a id="api-search"></a>

##### search()

```ts
search(query): Promise<TResult | null>;
```

Defined in: [src/resources/tenant-search.ts:33](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-search.ts#L33)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `query` | `TQuery` |

###### Returns

`Promise`\<`TResult` \| `null`\>

## Interfaces

<a id="api-bullpropagationoptions"></a>

### BullPropagationOptions

Defined in: [src/propagation/bull-tenant-propagator.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/bull-tenant-propagator.ts#L6)

#### Properties

<a id="api-datakey"></a>

##### dataKey?

```ts
optional dataKey?: string;
```

Defined in: [src/propagation/bull-tenant-propagator.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/bull-tenant-propagator.ts#L8)

Key name used to store tenant ID in job data. Defaults to '__tenantId'.

<a id="api-diagnostics"></a>

##### diagnostics?

```ts
optional diagnostics?: TenantContextDiagnostics;
```

Defined in: [src/propagation/bull-tenant-propagator.ts:10](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/bull-tenant-propagator.ts#L10)

Opt-in missing-context diagnostics.

<a id="api-resource"></a>

##### resource?

```ts
optional resource?: string;
```

Defined in: [src/propagation/bull-tenant-propagator.ts:12](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/bull-tenant-propagator.ts#L12)

Stable queue or job-family name included in diagnostics.

***

<a id="api-grpcmetadatalike"></a>

### GrpcMetadataLike

Defined in: [src/propagation/grpc-tenant-propagator.ts:20](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/grpc-tenant-propagator.ts#L20)

Structural type for gRPC Metadata — no dependency on @grpc/grpc-js.

Matches the subset of `@grpc/grpc-js` `Metadata` used for tenant propagation.

#### Methods

<a id="api-get"></a>

##### get()

```ts
get(key): (string | Buffer<ArrayBufferLike>)[];
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:22](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/grpc-tenant-propagator.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

(`string` \| `Buffer`\<`ArrayBufferLike`\>)[]

<a id="api-set"></a>

##### set()

```ts
set(key, value): void;
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:21](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/grpc-tenant-propagator.ts#L21)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `value` | `string` |

###### Returns

`void`

***

<a id="api-grpcpropagationoptions"></a>

### GrpcPropagationOptions

Defined in: [src/propagation/grpc-tenant-propagator.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/grpc-tenant-propagator.ts#L6)

#### Properties

<a id="api-diagnostics-1"></a>

##### diagnostics?

```ts
optional diagnostics?: TenantContextDiagnostics;
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:10](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/grpc-tenant-propagator.ts#L10)

Opt-in missing-context diagnostics.

<a id="api-metadatakey"></a>

##### metadataKey?

```ts
optional metadataKey?: string;
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/grpc-tenant-propagator.ts#L8)

Metadata key for tenant ID. Defaults to 'x-tenant-id' (lowercase per gRPC convention).

<a id="api-resource-1"></a>

##### resource?

```ts
optional resource?: string;
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:12](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/grpc-tenant-propagator.ts#L12)

Stable service or method name included in diagnostics.

***

<a id="api-httppropagationoptions"></a>

### HttpPropagationOptions

Defined in: [src/propagation/http-tenant-propagator.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/http-tenant-propagator.ts#L5)

#### Properties

<a id="api-headername"></a>

##### headerName?

```ts
optional headerName?: string;
```

Defined in: [src/propagation/http-tenant-propagator.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/http-tenant-propagator.ts#L7)

Header name for tenant ID propagation. Defaults to 'X-Tenant-Id'.

***

<a id="api-jwtclaimextractoroptions"></a>

### JwtClaimExtractorOptions

Defined in: [src/extractors/jwt-claim.extractor.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/jwt-claim.extractor.ts#L4)

#### Properties

<a id="api-claimkey"></a>

##### claimKey

```ts
claimKey: string;
```

Defined in: [src/extractors/jwt-claim.extractor.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/jwt-claim.extractor.ts#L5)

<a id="api-headername-1"></a>

##### headerName?

```ts
optional headerName?: string;
```

Defined in: [src/extractors/jwt-claim.extractor.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/jwt-claim.extractor.ts#L6)

***

<a id="api-kafkamessagelike"></a>

### KafkaMessageLike

Defined in: [src/propagation/kafka-tenant-propagator.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/kafka-tenant-propagator.ts#L17)

Structural type for Kafka message — no dependency on kafkajs.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

<a id="api-headers"></a>

##### headers?

```ts
optional headers?: Record<string, string | Buffer<ArrayBufferLike> | undefined>;
```

Defined in: [src/propagation/kafka-tenant-propagator.ts:18](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/kafka-tenant-propagator.ts#L18)

***

<a id="api-kafkapropagationoptions"></a>

### KafkaPropagationOptions

Defined in: [src/propagation/kafka-tenant-propagator.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/kafka-tenant-propagator.ts#L7)

#### Properties

<a id="api-diagnostics-2"></a>

##### diagnostics?

```ts
optional diagnostics?: TenantContextDiagnostics;
```

Defined in: [src/propagation/kafka-tenant-propagator.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/kafka-tenant-propagator.ts#L11)

Opt-in missing-context diagnostics.

<a id="api-headername-2"></a>

##### headerName?

```ts
optional headerName?: string;
```

Defined in: [src/propagation/kafka-tenant-propagator.ts:9](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/kafka-tenant-propagator.ts#L9)

Header name for tenant ID in Kafka message headers. Defaults to 'X-Tenant-Id'.

<a id="api-resource-2"></a>

##### resource?

```ts
optional resource?: string;
```

Defined in: [src/propagation/kafka-tenant-propagator.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/kafka-tenant-propagator.ts#L13)

Stable topic name included in diagnostics.

***

<a id="api-missingtenantcontextdiagnostic"></a>

### MissingTenantContextDiagnostic

Defined in: [src/diagnostics/tenant-context-diagnostics.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/diagnostics/tenant-context-diagnostics.ts#L17)

#### Properties

<a id="api-operation"></a>

##### operation

```ts
operation: TenantContextDiagnosticOperation;
```

Defined in: [src/diagnostics/tenant-context-diagnostics.ts:19](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/diagnostics/tenant-context-diagnostics.ts#L19)

<a id="api-resource-3"></a>

##### resource?

```ts
optional resource?: string;
```

Defined in: [src/diagnostics/tenant-context-diagnostics.ts:20](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/diagnostics/tenant-context-diagnostics.ts#L20)

<a id="api-transport"></a>

##### transport

```ts
transport: "bull" | "kafka" | "grpc" | "cache" | "redis" | "search";
```

Defined in: [src/diagnostics/tenant-context-diagnostics.ts:18](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/diagnostics/tenant-context-diagnostics.ts#L18)

***

<a id="api-pathextractoroptions"></a>

### PathExtractorOptions

Defined in: [src/extractors/path.extractor.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/path.extractor.ts#L4)

#### Properties

<a id="api-paramname"></a>

##### paramName

```ts
paramName: string;
```

Defined in: [src/extractors/path.extractor.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/path.extractor.ts#L6)

<a id="api-pattern"></a>

##### pattern

```ts
pattern: string;
```

Defined in: [src/extractors/path.extractor.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/path.extractor.ts#L5)

***

<a id="api-prismatenancyextensionoptions"></a>

### PrismaTenancyExtensionOptions

Defined in: [src/prisma/prisma-tenancy.extension.ts:31](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/prisma-tenancy.extension.ts#L31)

#### Properties

<a id="api-autoinjecttenantid"></a>

##### autoInjectTenantId?

```ts
optional autoInjectTenantId?: boolean;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:33](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/prisma-tenancy.extension.ts#L33)

<a id="api-dbsettingkey"></a>

##### dbSettingKey?

```ts
optional dbSettingKey?: string;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:32](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/prisma-tenancy.extension.ts#L32)

<a id="api-failclosed"></a>

##### failClosed?

```ts
optional failClosed?: boolean;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:44](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/prisma-tenancy.extension.ts#L44)

When true, throws `TenancyContextRequiredError` if a query is executed
without a tenant context (unless the model is in `sharedModels` or
`withoutTenant()` was used to explicitly bypass).

Prevents accidental data exposure when RLS policies are misconfigured.

###### Default

```ts
true
```

<a id="api-interactivetransactionsupport"></a>

##### ~~interactiveTransactionSupport?~~

```ts
optional interactiveTransactionSupport?: boolean;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:63](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/prisma-tenancy.extension.ts#L63)

Enable transparent interactive transaction support.

When enabled, the extension detects interactive transactions
(`$transaction(async (tx) => ...)`) and sets the RLS context
on the transaction's connection directly.

Relies on Prisma internal APIs (`__internalParams`, `_createItxClient`).
Extension creation verifies `_createItxClient`, but Prisma does not expose a
public way to validate the full `__internalParams.transaction` shape.
A Prisma internal change can therefore bypass transparent detection.

For an alternative that uses only public Prisma APIs, see `tenancyTransaction()`.

###### Deprecated

Use `tenancyTransaction()` for interactive transactions. This
compatibility-sensitive mode is retained only for existing consumers.

###### Default

```ts
false
```

<a id="api-sharedmodels"></a>

##### sharedModels?

```ts
optional sharedModels?: string[];
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:35](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/prisma-tenancy.extension.ts#L35)

<a id="api-tenantidfield"></a>

##### tenantIdField?

```ts
optional tenantIdField?: string;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:34](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/prisma-tenancy.extension.ts#L34)

***

<a id="api-prismatransactionclient"></a>

### PrismaTransactionClient

Defined in: [src/prisma/tenancy-transaction.ts:18](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/tenancy-transaction.ts#L18)

Structural type representing a Prisma-like client that supports
interactive transactions. `PrismaClient` satisfies this automatically.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTx` *extends* [`PrismaTransactionContext`](#api-prismatransactioncontext) | `any` |

#### Methods

<a id="api-transaction"></a>

##### $transaction()

```ts
$transaction<T>(fn, options?): Promise<T>;
```

Defined in: [src/prisma/tenancy-transaction.ts:19](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/tenancy-transaction.ts#L19)

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

<a id="api-prismatransactioncontext"></a>

### PrismaTransactionContext

Defined in: [src/prisma/tenancy-transaction.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/tenancy-transaction.ts#L7)

Minimal transaction client shape required by `tenancyTransaction`.

#### Methods

<a id="api-executeraw"></a>

##### $executeRaw()

```ts
$executeRaw(strings, ...values): Promise<unknown>;
```

Defined in: [src/prisma/tenancy-transaction.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/tenancy-transaction.ts#L8)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `strings` | `TemplateStringsArray` |
| ...`values` | `unknown`[] |

###### Returns

`Promise`\<`unknown`\>

***

<a id="api-subdomainextractoroptions"></a>

### SubdomainExtractorOptions

Defined in: [src/extractors/subdomain.extractor.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/subdomain.extractor.ts#L4)

#### Properties

<a id="api-excludesubdomains"></a>

##### excludeSubdomains?

```ts
optional excludeSubdomains?: string[];
```

Defined in: [src/extractors/subdomain.extractor.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/extractors/subdomain.extractor.ts#L5)

***

<a id="api-telemetryoptions"></a>

### TelemetryOptions

Defined in: [src/interfaces/tenancy-module-options.interface.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L7)

#### Properties

<a id="api-createspans"></a>

##### createSpans?

```ts
optional createSpans?: boolean;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L11)

Create custom spans for tenant lifecycle events (resolved, not_found, etc.).

###### Default

```ts
false
```

<a id="api-spanattributekey"></a>

##### spanAttributeKey?

```ts
optional spanAttributeKey?: string;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:9](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L9)

Span attribute key for tenant ID.

###### Default

```ts
'tenant.id'
```

***

<a id="api-tenancyeventmap"></a>

### TenancyEventMap

Defined in: [src/events/tenancy-events.ts:91](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L91)

Type-safe mapping from event name to payload type.
Used by `TenancyEventService.emit()` to enforce correct payloads at compile time.

#### Properties

<a id="api-tenantcontext_bypassed"></a>

##### tenant.context\_bypassed

```ts
tenant.context_bypassed: TenantContextBypassedEvent;
```

Defined in: [src/events/tenancy-events.ts:96](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L96)

<a id="api-tenantcontext_missing"></a>

##### tenant.context\_missing

```ts
tenant.context_missing: MissingTenantContextDiagnostic;
```

Defined in: [src/events/tenancy-events.ts:98](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L98)

<a id="api-tenantcross_check_failed"></a>

##### tenant.cross\_check\_failed

```ts
tenant.cross_check_failed: TenantCrossCheckFailedEvent;
```

Defined in: [src/events/tenancy-events.ts:97](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L97)

<a id="api-tenantextraction_failed"></a>

##### tenant.extraction\_failed

```ts
tenant.extraction_failed: TenantExtractionFailedEvent;
```

Defined in: [src/events/tenancy-events.ts:94](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L94)

<a id="api-tenantnot_found"></a>

##### tenant.not\_found

```ts
tenant.not_found: TenancyEventRequestPayload;
```

Defined in: [src/events/tenancy-events.ts:93](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L93)

<a id="api-tenantresolved"></a>

##### tenant.resolved

```ts
tenant.resolved: TenantResolvedEvent;
```

Defined in: [src/events/tenancy-events.ts:92](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L92)

<a id="api-tenantvalidation_failed"></a>

##### tenant.validation\_failed

```ts
tenant.validation_failed: TenantValidationFailedEvent;
```

Defined in: [src/events/tenancy-events.ts:95](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L95)

***

<a id="api-tenancyeventrequestsummary"></a>

### TenancyEventRequestSummary

Defined in: [src/events/tenancy-events.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L4)

#### Properties

<a id="api-host"></a>

##### host?

```ts
optional host?: string;
```

Defined in: [src/events/tenancy-events.ts:9](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L9)

<a id="api-ip"></a>

##### ip?

```ts
optional ip?: string;
```

Defined in: [src/events/tenancy-events.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L7)

<a id="api-method"></a>

##### method?

```ts
optional method?: string;
```

Defined in: [src/events/tenancy-events.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L5)

<a id="api-path"></a>

##### path?

```ts
optional path?: string;
```

Defined in: [src/events/tenancy-events.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L6)

<a id="api-useragent"></a>

##### userAgent?

```ts
optional userAgent?: string;
```

Defined in: [src/events/tenancy-events.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L8)

***

<a id="api-tenancymoduleasyncoptions"></a>

### TenancyModuleAsyncOptions

Defined in: [src/interfaces/tenancy-module-options.interface.ts:104](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L104)

#### Extends

- `Pick`\<`ModuleMetadata`, `"imports"`\>

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

<a id="api-inject-3"></a>

##### inject?

```ts
optional inject?: (InjectionToken | OptionalFactoryDependency)[];
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:106](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L106)

<a id="api-useclass"></a>

##### useClass?

```ts
optional useClass?: Type<TenancyModuleOptionsFactory>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:110](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L110)

<a id="api-useexisting"></a>

##### useExisting?

```ts
optional useExisting?: Type<TenancyModuleOptionsFactory>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:111](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L111)

<a id="api-usefactory"></a>

##### useFactory?

```ts
optional useFactory?: (...args) =>
  | TenancyModuleOptions
| Promise<TenancyModuleOptions>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:107](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L107)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`TenancyModuleOptions`](#api-tenancymoduleoptions)
  \| `Promise`\<[`TenancyModuleOptions`](#api-tenancymoduleoptions)\>

***

<a id="api-tenancymoduleoptions"></a>

### TenancyModuleOptions

Defined in: [src/interfaces/tenancy-module-options.interface.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L14)

#### Properties

<a id="api-crosscheck"></a>

##### crossCheck?

```ts
optional crossCheck?: {
  extractor: TenantExtractor;
  onFailed?: "reject" | "log";
  required?: boolean;
};
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:67](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L67)

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

<a id="api-dbsettingkey-1"></a>

##### dbSettingKey?

```ts
optional dbSettingKey?: string;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:29](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L29)

<a id="api-missingcontext"></a>

##### missingContext?

```ts
optional missingContext?: TenantContextDiagnosticsOptions;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:95](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L95)

Opt-in diagnostics for missing tenant context outside HTTP requests.
The default `ignore` policy preserves existing pass-through behavior.

<a id="api-ontenantnotfound"></a>

##### onTenantNotFound?

```ts
optional onTenantNotFound?: (request, response) => void | "skip" | Promise<void | "skip">;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:54](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L54)

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
| `request` | [`TenancyRequest`](#api-tenancyrequest) |
| `response` | [`TenancyResponse`](#api-tenancyresponse) |

###### Returns

`void` \| `"skip"` \| `Promise`\<`void` \| `"skip"`\>

<a id="api-ontenantresolved"></a>

##### onTenantResolved?

```ts
optional onTenantResolved?: (tenantId, request) => void | Promise<void>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:39](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L39)

Called after a tenant ID is successfully extracted and validated.
Runs inside `TenancyContext.run()`, so `getCurrentTenant()` is available.

Throwing an exception aborts the request — NestJS handles it as a 500
(or whatever your exception filter maps it to). The telemetry span is
always closed via `finally`, so throwing is safe for audit/authorization checks.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` |
| `request` | [`TenancyRequest`](#api-tenancyrequest) |

###### Returns

`void` \| `Promise`\<`void`\>

<a id="api-telemetry"></a>

##### telemetry?

```ts
optional telemetry?: TelemetryOptions;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:89](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L89)

OpenTelemetry integration. Automatically adds tenant.id to active spans.
Silently ignored if `@opentelemetry/api` is not installed.

<a id="api-tenantextractor"></a>

##### tenantExtractor

```ts
tenantExtractor: string | TenantExtractor;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:28](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L28)

Tenant extraction strategy.

A string is a shortcut for `HeaderTenantExtractor` and is interpreted as
the HTTP header name. Use a `TenantExtractor` instance for non-header
strategies such as subdomain, path, JWT claim, or composite extraction.

###### Example

```typescript
tenantExtractor: 'X-Tenant-Id'
tenantExtractor: new SubdomainTenantExtractor()
```

<a id="api-validatetenantid"></a>

##### validateTenantId?

```ts
optional validateTenantId?: (tenantId) => boolean | Promise<boolean>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:30](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L30)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` |

###### Returns

`boolean` \| `Promise`\<`boolean`\>

***

<a id="api-tenancymoduleoptionsfactory"></a>

### TenancyModuleOptionsFactory

Defined in: [src/interfaces/tenancy-module-options.interface.ts:98](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L98)

#### Methods

<a id="api-createtenancyoptions"></a>

##### createTenancyOptions()

```ts
createTenancyOptions():
  | TenancyModuleOptions
| Promise<TenancyModuleOptions>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:99](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-module-options.interface.ts#L99)

###### Returns

  \| [`TenancyModuleOptions`](#api-tenancymoduleoptions)
  \| `Promise`\<[`TenancyModuleOptions`](#api-tenancymoduleoptions)\>

***

<a id="api-tenancyrequest"></a>

### TenancyRequest

Defined in: [src/interfaces/tenancy-request.interface.ts:9](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-request.interface.ts#L9)

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

<a id="api-headers-1"></a>

##### headers

```ts
headers: Record<string, string | string[] | undefined>;
```

Defined in: [src/interfaces/tenancy-request.interface.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-request.interface.ts#L11)

HTTP request headers. Keys are lowercase in Node.js.

<a id="api-hostname"></a>

##### hostname?

```ts
optional hostname?: string;
```

Defined in: [src/interfaces/tenancy-request.interface.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-request.interface.ts#L13)

Hostname derived from the `Host` header.

<a id="api-path-1"></a>

##### path?

```ts
optional path?: string;
```

Defined in: [src/interfaces/tenancy-request.interface.ts:15](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-request.interface.ts#L15)

Request path without query string.

<a id="api-url"></a>

##### url?

```ts
optional url?: string;
```

Defined in: [src/interfaces/tenancy-request.interface.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-request.interface.ts#L17)

Full request URL.

***

<a id="api-tenancyresponse"></a>

### TenancyResponse

Defined in: [src/interfaces/tenancy-request.interface.ts:32](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-request.interface.ts#L32)

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

<a id="api-end"></a>

##### end()?

```ts
optional end(): void;
```

Defined in: [src/interfaces/tenancy-request.interface.ts:38](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-request.interface.ts#L38)

End the response without a body.

###### Returns

`void`

<a id="api-json"></a>

##### json()?

```ts
optional json(body): void;
```

Defined in: [src/interfaces/tenancy-request.interface.ts:36](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-request.interface.ts#L36)

Send JSON response body.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `body` | `unknown` |

###### Returns

`void`

<a id="api-status"></a>

##### status()?

```ts
optional status(code): this;
```

Defined in: [src/interfaces/tenancy-request.interface.ts:34](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenancy-request.interface.ts#L34)

Set HTTP status code. Returns `this` for chaining (Express/Fastify convention).

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | `number` |

###### Returns

`this`

***

<a id="api-tenancytransactionoptions"></a>

### TenancyTransactionOptions

Defined in: [src/prisma/tenancy-transaction.ts:25](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/tenancy-transaction.ts#L25)

#### Properties

<a id="api-dbsettingkey-2"></a>

##### dbSettingKey?

```ts
optional dbSettingKey?: string;
```

Defined in: [src/prisma/tenancy-transaction.ts:35](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/tenancy-transaction.ts#L35)

<a id="api-isolationlevel"></a>

##### isolationLevel?

```ts
optional isolationLevel?: "ReadUncommitted" | "ReadCommitted" | "RepeatableRead" | "Serializable";
```

Defined in: [src/prisma/tenancy-transaction.ts:34](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/tenancy-transaction.ts#L34)

PostgreSQL transaction isolation level.

<a id="api-maxwait"></a>

##### maxWait?

```ts
optional maxWait?: number;
```

Defined in: [src/prisma/tenancy-transaction.ts:30](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/tenancy-transaction.ts#L30)

Maximum time in milliseconds to wait for Prisma to start the transaction.
Forwarded to Prisma; enforcement depends on the selected Prisma runtime.

<a id="api-timeout"></a>

##### timeout?

```ts
optional timeout?: number;
```

Defined in: [src/prisma/tenancy-transaction.ts:32](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/tenancy-transaction.ts#L32)

Maximum time in milliseconds the interactive transaction may run.

***

<a id="api-tenantcontextbypassedevent"></a>

### TenantContextBypassedEvent

Defined in: [src/events/tenancy-events.ts:46](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L46)

#### Properties

<a id="api-previoustenantid"></a>

##### previousTenantId?

```ts
optional previousTenantId?: string | null;
```

Defined in: [src/events/tenancy-events.ts:48](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L48)

<a id="api-reason"></a>

##### reason

```ts
reason: "decorator" | "withoutTenant";
```

Defined in: [src/events/tenancy-events.ts:47](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L47)

<a id="api-requestsummary"></a>

##### requestSummary?

```ts
optional requestSummary?: TenancyEventRequestSummary;
```

Defined in: [src/events/tenancy-events.ts:49](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L49)

***

<a id="api-tenantcontextcarrier"></a>

### TenantContextCarrier

Defined in: [src/interfaces/tenant-context-carrier.interface.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenant-context-carrier.interface.ts#L14)

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

<a id="api-extract-8"></a>

##### extract()

```ts
extract(carrier): string | null;
```

Defined in: [src/interfaces/tenant-context-carrier.interface.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenant-context-carrier.interface.ts#L26)

Extracts the tenant ID from an incoming carrier.
Returns the tenant ID string, or `null` if not present.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `carrier` | `TCarrier` |

###### Returns

`string` \| `null`

<a id="api-inject-4"></a>

##### inject()

```ts
inject(carrier): TCarrier;
```

Defined in: [src/interfaces/tenant-context-carrier.interface.ts:20](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenant-context-carrier.interface.ts#L20)

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

<a id="api-tenantcontextdiagnosticsoptions"></a>

### TenantContextDiagnosticsOptions

Defined in: [src/diagnostics/tenant-context-diagnostics.ts:23](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/diagnostics/tenant-context-diagnostics.ts#L23)

#### Properties

<a id="api-onmissing"></a>

##### onMissing?

```ts
optional onMissing?: (diagnostic) => void;
```

Defined in: [src/diagnostics/tenant-context-diagnostics.ts:27](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/diagnostics/tenant-context-diagnostics.ts#L27)

Optional hook for structured logging or application metrics.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `diagnostic` | [`MissingTenantContextDiagnostic`](#api-missingtenantcontextdiagnostic) |

###### Returns

`void`

<a id="api-policy-1"></a>

##### policy?

```ts
optional policy?: MissingTenantContextPolicy;
```

Defined in: [src/diagnostics/tenant-context-diagnostics.ts:25](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/diagnostics/tenant-context-diagnostics.ts#L25)

Existing silent/pass-through behavior remains the default.

***

<a id="api-tenantcrosscheckfailedevent"></a>

### TenantCrossCheckFailedEvent

Defined in: [src/events/tenancy-events.ts:52](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L52)

#### Extends

- `TenancyEventRequestPayload`

#### Properties

<a id="api-crosschecktenantid"></a>

##### crossCheckTenantId

```ts
crossCheckTenantId: string;
```

Defined in: [src/events/tenancy-events.ts:54](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L54)

<a id="api-extractedtenantid"></a>

##### extractedTenantId

```ts
extractedTenantId: string;
```

Defined in: [src/events/tenancy-events.ts:53](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L53)

<a id="api-request"></a>

##### ~~request?~~

```ts
optional request?: TenancyRequest;
```

Defined in: [src/events/tenancy-events.ts:28](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L28)

###### Deprecated

Use `requestSummary` instead. Raw request objects may contain
credentials, cookies, body data, and framework-specific references.

###### Inherited from

```ts
TenancyEventRequestPayload.request
```

<a id="api-requestsummary-1"></a>

##### requestSummary?

```ts
optional requestSummary?: TenancyEventRequestSummary;
```

Defined in: [src/events/tenancy-events.ts:23](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L23)

###### Inherited from

```ts
TenancyEventRequestPayload.requestSummary
```

***

<a id="api-tenantextractionfailedevent"></a>

### TenantExtractionFailedEvent

Defined in: [src/events/tenancy-events.ts:37](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L37)

#### Extends

- `TenancyEventRequestPayload`

#### Properties

<a id="api-errormessage"></a>

##### errorMessage

```ts
errorMessage: string;
```

Defined in: [src/events/tenancy-events.ts:39](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L39)

<a id="api-errorname"></a>

##### errorName

```ts
errorName: string;
```

Defined in: [src/events/tenancy-events.ts:38](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L38)

<a id="api-request-1"></a>

##### ~~request?~~

```ts
optional request?: TenancyRequest;
```

Defined in: [src/events/tenancy-events.ts:28](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L28)

###### Deprecated

Use `requestSummary` instead. Raw request objects may contain
credentials, cookies, body data, and framework-specific references.

###### Inherited from

```ts
TenancyEventRequestPayload.request
```

<a id="api-requestsummary-2"></a>

##### requestSummary?

```ts
optional requestSummary?: TenancyEventRequestSummary;
```

Defined in: [src/events/tenancy-events.ts:23](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L23)

###### Inherited from

```ts
TenancyEventRequestPayload.requestSummary
```

***

<a id="api-tenantextractor-1"></a>

### TenantExtractor

Defined in: [src/interfaces/tenant-extractor.interface.ts:15](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenant-extractor.interface.ts#L15)

Contract for extracting a tenant ID from an inbound HTTP request.

Return the tenant ID string when present, or `null` when the request does
not carry tenant information. A missing tenant is not an error condition;
`TenantMiddleware` will call `onTenantNotFound` and let the application
decide whether to continue, respond, or throw.

Implementations may return synchronously or return a Promise for async
lookups. Throw only for malformed input or policy failures that should
reject the request immediately.

#### Methods

<a id="api-extract-9"></a>

##### extract()

```ts
extract(request): string | Promise<string | null> | null;
```

Defined in: [src/interfaces/tenant-extractor.interface.ts:16](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenant-extractor.interface.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | [`TenancyRequest`](#api-tenancyrequest) |

###### Returns

`string` \| `Promise`\<`string` \| `null`\> \| `null`

***

<a id="api-tenantpropagator"></a>

### TenantPropagator

Defined in: [src/interfaces/tenant-propagator.interface.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenant-propagator.interface.ts#L8)

Contract for propagating tenant context to outgoing requests.

Implementations transform the current tenant ID into transport-specific
headers or metadata. Used by `HttpTenantPropagator` for HTTP and
`KafkaTenantPropagator` for Kafka. For Bull and gRPC, see `TenantContextCarrier`.

#### Methods

<a id="api-getheaders-2"></a>

##### getHeaders()

```ts
getHeaders(): Record<string, string>;
```

Defined in: [src/interfaces/tenant-propagator.interface.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/interfaces/tenant-propagator.interface.ts#L13)

Returns headers to propagate tenant context.
Returns an empty object if no tenant context is available.

###### Returns

`Record`\<`string`, `string`\>

***

<a id="api-tenantresolvedevent"></a>

### TenantResolvedEvent

Defined in: [src/events/tenancy-events.ts:31](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L31)

#### Extends

- `TenancyEventRequestPayload`

#### Properties

<a id="api-request-2"></a>

##### ~~request?~~

```ts
optional request?: TenancyRequest;
```

Defined in: [src/events/tenancy-events.ts:28](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L28)

###### Deprecated

Use `requestSummary` instead. Raw request objects may contain
credentials, cookies, body data, and framework-specific references.

###### Inherited from

```ts
TenancyEventRequestPayload.request
```

<a id="api-requestsummary-3"></a>

##### requestSummary?

```ts
optional requestSummary?: TenancyEventRequestSummary;
```

Defined in: [src/events/tenancy-events.ts:23](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L23)

###### Inherited from

```ts
TenancyEventRequestPayload.requestSummary
```

<a id="api-tenantid"></a>

##### tenantId

```ts
tenantId: string;
```

Defined in: [src/events/tenancy-events.ts:32](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L32)

***

<a id="api-tenantresourcekeyoptions"></a>

### TenantResourceKeyOptions

Defined in: [src/resources/tenant-resource-key.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-resource-key.ts#L4)

#### Properties

<a id="api-diagnostics-3"></a>

##### diagnostics?

```ts
optional diagnostics?: TenantContextDiagnostics;
```

Defined in: [src/resources/tenant-resource-key.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-resource-key.ts#L14)

Opt-in missing-context diagnostics.

<a id="api-prefix"></a>

##### prefix?

```ts
optional prefix?: string;
```

Defined in: [src/resources/tenant-resource-key.ts:10](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-resource-key.ts#L10)

Prefix for generated keys.

###### Default

```ts
'tenant'
```

<a id="api-resource-4"></a>

##### resource?

```ts
optional resource?: string;
```

Defined in: [src/resources/tenant-resource-key.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-resource-key.ts#L8)

Stable cache, index, or resource name included in diagnostics.

<a id="api-separator"></a>

##### separator?

```ts
optional separator?: string;
```

Defined in: [src/resources/tenant-resource-key.ts:12](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-resource-key.ts#L12)

Separator between encoded key parts.

###### Default

```ts
':'
```

<a id="api-transport-1"></a>

##### transport

```ts
transport: "redis" | "search";
```

Defined in: [src/resources/tenant-resource-key.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-resource-key.ts#L6)

Resource kind used in diagnostics.

***

<a id="api-tenantsearchadapter"></a>

### TenantSearchAdapter

Defined in: [src/resources/tenant-search.ts:10](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-search.ts#L10)

Vendor-neutral search contract. Adapters must apply both scope fields.

#### Type Parameters

| Type Parameter |
| ------ |
| `TQuery` |
| `TResult` |

#### Methods

<a id="api-search-1"></a>

##### search()

```ts
search(scope, query): Promise<TResult>;
```

Defined in: [src/resources/tenant-search.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-search.ts#L11)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `scope` | [`TenantSearchScope`](#api-tenantsearchscope) |
| `query` | `TQuery` |

###### Returns

`Promise`\<`TResult`\>

***

<a id="api-tenantsearchoptions"></a>

### TenantSearchOptions

Defined in: [src/resources/tenant-search.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-search.ts#L14)

#### Properties

<a id="api-diagnostics-4"></a>

##### diagnostics?

```ts
optional diagnostics?: TenantContextDiagnostics;
```

Defined in: [src/resources/tenant-search.ts:18](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-search.ts#L18)

Opt-in missing-context diagnostics.

<a id="api-index"></a>

##### index

```ts
index: string;
```

Defined in: [src/resources/tenant-search.ts:16](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-search.ts#L16)

Logical or physical index name.

***

<a id="api-tenantsearchscope"></a>

### TenantSearchScope

Defined in: [src/resources/tenant-search.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-search.ts#L4)

#### Properties

<a id="api-index-1"></a>

##### index

```ts
index: string;
```

Defined in: [src/resources/tenant-search.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-search.ts#L6)

<a id="api-tenantid-1"></a>

##### tenantId

```ts
tenantId: string;
```

Defined in: [src/resources/tenant-search.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/resources/tenant-search.ts#L5)

***

<a id="api-tenantvalidationfailedevent"></a>

### TenantValidationFailedEvent

Defined in: [src/events/tenancy-events.ts:42](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L42)

#### Extends

- `TenancyEventRequestPayload`

#### Properties

<a id="api-request-3"></a>

##### ~~request?~~

```ts
optional request?: TenancyRequest;
```

Defined in: [src/events/tenancy-events.ts:28](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L28)

###### Deprecated

Use `requestSummary` instead. Raw request objects may contain
credentials, cookies, body data, and framework-specific references.

###### Inherited from

```ts
TenancyEventRequestPayload.request
```

<a id="api-requestsummary-4"></a>

##### requestSummary?

```ts
optional requestSummary?: TenancyEventRequestSummary;
```

Defined in: [src/events/tenancy-events.ts:23](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L23)

###### Inherited from

```ts
TenancyEventRequestPayload.requestSummary
```

<a id="api-tenantid-2"></a>

##### tenantId

```ts
tenantId: string;
```

Defined in: [src/events/tenancy-events.ts:43](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L43)

## Type Aliases

<a id="api-missingtenantcontextpolicy"></a>

### MissingTenantContextPolicy

```ts
type MissingTenantContextPolicy = "ignore" | "warn" | "throw";
```

Defined in: [src/diagnostics/tenant-context-diagnostics.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/diagnostics/tenant-context-diagnostics.ts#L7)

***

<a id="api-tenantcontextdiagnosticoperation"></a>

### TenantContextDiagnosticOperation

```ts
type TenantContextDiagnosticOperation = "inject" | "extract" | "consume" | "cache" | "key" | "search";
```

Defined in: [src/diagnostics/tenant-context-diagnostics.ts:9](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/diagnostics/tenant-context-diagnostics.ts#L9)

***

<a id="api-tenantcontextinterceptoroptions"></a>

### TenantContextInterceptorOptions

```ts
type TenantContextInterceptorOptions = TenantContextInterceptorDiagnosticOptions &
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

Defined in: [src/propagation/tenant-context.interceptor.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/tenant-context.interceptor.ts#L26)

Options for `TenantContextInterceptor`.

When `transport` is specified, only the matching transport key is accepted.
When `transport` is omitted, all keys are available for duck-typing fallback.

***

<a id="api-tenantnotfoundevent"></a>

### TenantNotFoundEvent

```ts
type TenantNotFoundEvent = TenancyEventRequestPayload;
```

Defined in: [src/events/tenancy-events.ts:35](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L35)

## Variables

<a id="api-currenttenant"></a>

### CurrentTenant

```ts
const CurrentTenant: (...dataOrPipes) => ParameterDecorator;
```

Defined in: [src/decorators/current-tenant.decorator.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/decorators/current-tenant.decorator.ts#L4)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`dataOrPipes` | `unknown`[] |

#### Returns

`ParameterDecorator`

***

<a id="api-tenancy_module_options"></a>

### TENANCY\_MODULE\_OPTIONS

```ts
const TENANCY_MODULE_OPTIONS: typeof TENANCY_MODULE_OPTIONS;
```

Defined in: [src/tenancy.constants.ts:2](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/tenancy.constants.ts#L2)

***

<a id="api-tenancyevents"></a>

### TenancyEvents

```ts
const TenancyEvents: {
  CONTEXT_BYPASSED: "tenant.context_bypassed";
  CONTEXT_MISSING: "tenant.context_missing";
  CROSS_CHECK_FAILED: "tenant.cross_check_failed";
  EXTRACTION_FAILED: "tenant.extraction_failed";
  NOT_FOUND: "tenant.not_found";
  RESOLVED: "tenant.resolved";
  VALIDATION_FAILED: "tenant.validation_failed";
};
```

Defined in: [src/events/tenancy-events.ts:12](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L12)

#### Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="api-property-context_bypassed"></a> `CONTEXT_BYPASSED` | `"tenant.context_bypassed"` | `'tenant.context_bypassed'` | [src/events/tenancy-events.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L17) |
| <a id="api-property-context_missing"></a> `CONTEXT_MISSING` | `"tenant.context_missing"` | `'tenant.context_missing'` | [src/events/tenancy-events.ts:19](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L19) |
| <a id="api-property-cross_check_failed"></a> `CROSS_CHECK_FAILED` | `"tenant.cross_check_failed"` | `'tenant.cross_check_failed'` | [src/events/tenancy-events.ts:18](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L18) |
| <a id="api-property-extraction_failed"></a> `EXTRACTION_FAILED` | `"tenant.extraction_failed"` | `'tenant.extraction_failed'` | [src/events/tenancy-events.ts:15](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L15) |
| <a id="api-property-not_found"></a> `NOT_FOUND` | `"tenant.not_found"` | `'tenant.not_found'` | [src/events/tenancy-events.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L14) |
| <a id="api-property-resolved"></a> `RESOLVED` | `"tenant.resolved"` | `'tenant.resolved'` | [src/events/tenancy-events.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L13) |
| <a id="api-property-validation_failed"></a> `VALIDATION_FAILED` | `"tenant.validation_failed"` | `'tenant.validation_failed'` | [src/events/tenancy-events.ts:16](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/events/tenancy-events.ts#L16) |

## Functions

<a id="api-bypasstenancy"></a>

### BypassTenancy()

```ts
function BypassTenancy(): CustomDecorator<typeof BYPASS_TENANCY_KEY>;
```

Defined in: [src/decorators/bypass-tenancy.decorator.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/decorators/bypass-tenancy.decorator.ts#L14)

Marks a route or controller to skip `TenancyGuard`'s tenant-required check.

**Important:** This only bypasses the guard — it does NOT clear the tenant context.
If the request contains a tenant header, `TenantMiddleware` still sets the context,
so `getCurrentTenant()` may return a value and Prisma queries will still be RLS-filtered.

Use this for endpoints that should work with or without a tenant (e.g., health checks,
public APIs). If you need to explicitly run without tenant context, use `withoutTenant()`.

#### Returns

`CustomDecorator`\<*typeof* `BYPASS_TENANCY_KEY`\>

***

<a id="api-createprismatenancyextension"></a>

### createPrismaTenancyExtension()

```ts
function createPrismaTenancyExtension(tenancyService, options?): (client) => PrismaClientExtends<InternalArgs<{
}, {
}, {
}, {
}>>;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:99](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/prisma-tenancy.extension.ts#L99)

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
interactive transactions (`$transaction(async (tx) => ...)`). Use the standalone
`tenancyTransaction()` helper (public APIs only). The deprecated
`interactiveTransactionSupport: true` mode remains for existing consumers.

Usage:
```typescript
const prisma = basePrisma.$extends(
  createPrismaTenancyExtension(tenancyService)
);
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenancyService` | [`TenancyService`](#api-tenancyservice) |
| `options?` | [`PrismaTenancyExtensionOptions`](#api-prismatenancyextensionoptions) |

#### Returns

(`client`) => `PrismaClientExtends`\<`InternalArgs`\<\{
\}, \{
\}, \{
\}, \{
\}\>\>

***

<a id="api-propagatetenantheaders"></a>

### propagateTenantHeaders()

```ts
function propagateTenantHeaders(headerName?): Record<string, string>;
```

Defined in: [src/propagation/propagate-tenant-headers.ts:34](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/propagation/propagate-tenant-headers.ts#L34)

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

<a id="api-tenancytransaction"></a>

### tenancyTransaction()

```ts
function tenancyTransaction<T, TTx>(
   prisma,
   tenancyService,
   callback,
options?): Promise<T>;
```

Defined in: [src/prisma/tenancy-transaction.ts:50](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/prisma/tenancy-transaction.ts#L50)

Executes a Prisma interactive transaction with RLS tenant context.

Runs `set_config()` as the first statement inside the interactive
transaction, ensuring the PostgreSQL session variable is set on the
same connection that executes the callback queries.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | - |
| `TTx` *extends* [`PrismaTransactionContext`](#api-prismatransactioncontext) | `any` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prisma` | [`PrismaTransactionClient`](#api-prismatransactionclient)\<`TTx`\> | PrismaClient instance (not extended — raw client) |
| `tenancyService` | [`TenancyService`](#api-tenancyservice) | TenancyService to read current tenant |
| `callback` | (`tx`) => `Promise`\<`T`\> | Function receiving the transaction client |
| `options?` | [`TenancyTransactionOptions`](#api-tenancytransactionoptions) | Transaction wait/timeout, isolation level, and DB setting key |

#### Returns

`Promise`\<`T`\>
