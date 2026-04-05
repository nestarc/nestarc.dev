# index

## Classes

### BullTenantPropagator

Defined in: [src/propagation/bull-tenant-propagator.ts:31](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/bull-tenant-propagator.ts#L31)

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

Defined in: [src/propagation/bull-tenant-propagator.ts:36](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/bull-tenant-propagator.ts#L36)

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

Defined in: [src/propagation/bull-tenant-propagator.ts:49](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/bull-tenant-propagator.ts#L49)

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

Defined in: [src/propagation/bull-tenant-propagator.ts:43](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/bull-tenant-propagator.ts#L43)

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

Defined in: [src/extractors/composite.extractor.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/composite.extractor.ts#L4)

#### Implements

- [`TenantExtractor`](#tenantextractor-1)

#### Constructors

##### Constructor

```ts
new CompositeTenantExtractor(extractors): CompositeTenantExtractor;
```

Defined in: [src/extractors/composite.extractor.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/composite.extractor.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `extractors` | [`TenantExtractor`](#tenantextractor-1)[] |

###### Returns

[`CompositeTenantExtractor`](#compositetenantextractor)

#### Methods

##### extract()

```ts
extract(request): Promise<string | null>;
```

Defined in: [src/extractors/composite.extractor.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/composite.extractor.ts#L11)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | `Request` |

###### Returns

`Promise`\<`string` \| `null`\>

###### Implementation of

[`TenantExtractor`](#tenantextractor-1).[`extract`](#extract-9)

***

### GrpcTenantPropagator

Defined in: [src/propagation/grpc-tenant-propagator.ts:44](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/grpc-tenant-propagator.ts#L44)

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

Defined in: [src/propagation/grpc-tenant-propagator.ts:49](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/grpc-tenant-propagator.ts#L49)

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

Defined in: [src/propagation/grpc-tenant-propagator.ts:63](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/grpc-tenant-propagator.ts#L63)

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

Defined in: [src/propagation/grpc-tenant-propagator.ts:56](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/grpc-tenant-propagator.ts#L56)

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

Defined in: [src/extractors/header.extractor.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/header.extractor.ts#L4)

#### Implements

- [`TenantExtractor`](#tenantextractor-1)

#### Constructors

##### Constructor

```ts
new HeaderTenantExtractor(headerName): HeaderTenantExtractor;
```

Defined in: [src/extractors/header.extractor.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/header.extractor.ts#L7)

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

Defined in: [src/extractors/header.extractor.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/header.extractor.ts#L11)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | `Request` |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantExtractor`](#tenantextractor-1).[`extract`](#extract-9)

***

### HttpTenantPropagator

Defined in: [src/propagation/http-tenant-propagator.ts:23](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/http-tenant-propagator.ts#L23)

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

Defined in: [src/propagation/http-tenant-propagator.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/http-tenant-propagator.ts#L26)

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

Defined in: [src/propagation/http-tenant-propagator.ts:33](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/http-tenant-propagator.ts#L33)

Returns headers to propagate tenant context.
Returns an empty object if no tenant context is available.

###### Returns

`Record`\<`string`, `string`\>

###### Implementation of

[`TenantPropagator`](#tenantpropagator).[`getHeaders`](#getheaders-2)

***

### JwtClaimTenantExtractor

Defined in: [src/extractors/jwt-claim.extractor.ts:19](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/jwt-claim.extractor.ts#L19)

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

Defined in: [src/extractors/jwt-claim.extractor.ts:23](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/jwt-claim.extractor.ts#L23)

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

Defined in: [src/extractors/jwt-claim.extractor.ts:28](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/jwt-claim.extractor.ts#L28)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | `Request` |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantExtractor`](#tenantextractor-1).[`extract`](#extract-9)

***

### KafkaTenantPropagator

Defined in: [src/propagation/kafka-tenant-propagator.ts:40](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/kafka-tenant-propagator.ts#L40)

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

Defined in: [src/propagation/kafka-tenant-propagator.ts:45](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/kafka-tenant-propagator.ts#L45)

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

Defined in: [src/propagation/kafka-tenant-propagator.ts:61](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/kafka-tenant-propagator.ts#L61)

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

Defined in: [src/propagation/kafka-tenant-propagator.ts:71](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/kafka-tenant-propagator.ts#L71)

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

Defined in: [src/propagation/kafka-tenant-propagator.ts:52](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/kafka-tenant-propagator.ts#L52)

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

Defined in: [src/extractors/path.extractor.ts:9](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/path.extractor.ts#L9)

#### Implements

- [`TenantExtractor`](#tenantextractor-1)

#### Constructors

##### Constructor

```ts
new PathTenantExtractor(options): PathTenantExtractor;
```

Defined in: [src/extractors/path.extractor.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/path.extractor.ts#L13)

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

Defined in: [src/extractors/path.extractor.ts:20](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/path.extractor.ts#L20)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | `Request` |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantExtractor`](#tenantextractor-1).[`extract`](#extract-9)

***

### SubdomainTenantExtractor

Defined in: [src/extractors/subdomain.extractor.ts:23](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/subdomain.extractor.ts#L23)

#### Implements

- [`TenantExtractor`](#tenantextractor-1)

#### Constructors

##### Constructor

```ts
new SubdomainTenantExtractor(options?): SubdomainTenantExtractor;
```

Defined in: [src/extractors/subdomain.extractor.ts:27](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/subdomain.extractor.ts#L27)

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

Defined in: [src/extractors/subdomain.extractor.ts:34](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/subdomain.extractor.ts#L34)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | `Request` |

###### Returns

`string` \| `null`

###### Implementation of

[`TenantExtractor`](#tenantextractor-1).[`extract`](#extract-9)

***

### TenancyContext

Defined in: [src/services/tenancy-context.ts:10](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/services/tenancy-context.ts#L10)

#### Constructors

##### Constructor

```ts
new TenancyContext(): TenancyContext;
```

###### Returns

[`TenancyContext`](#tenancycontext)

#### Methods

##### getTenantId()

```ts
getTenantId(): string | null;
```

Defined in: [src/services/tenancy-context.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/services/tenancy-context.ts#L17)

###### Returns

`string` \| `null`

##### isBypassed()

```ts
isBypassed(): boolean;
```

Defined in: [src/services/tenancy-context.ts:21](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/services/tenancy-context.ts#L21)

###### Returns

`boolean`

##### run()

```ts
run<T>(tenantId, callback): T;
```

Defined in: [src/services/tenancy-context.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/services/tenancy-context.ts#L13)

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

```ts
runWithoutTenant<T>(callback): Promise<T>;
```

Defined in: [src/services/tenancy-context.ts:25](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/services/tenancy-context.ts#L25)

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

### TenancyContextRequiredError

Defined in: [src/errors/tenancy-context-required.error.ts:3](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/errors/tenancy-context-required.error.ts#L3)

Thrown when tenant context is required but not available.

Base class for all tenancy context errors. Use `instanceof TenantContextMissingError`
to catch both this error and its subclass `TenancyContextRequiredError` (Prisma fail-closed).

#### Example

```typescript
try {
  const tenantId = tenancyService.getCurrentTenantOrThrow();
} catch (e) {
  if (e instanceof TenantContextMissingError) {
    // Handles both service-level and Prisma-level errors
  }
}
```

#### Extends

- [`TenantContextMissingError`](#tenantcontextmissingerror)

#### Constructors

##### Constructor

```ts
new TenancyContextRequiredError(model, operation): TenancyContextRequiredError;
```

Defined in: [src/errors/tenancy-context-required.error.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/errors/tenancy-context-required.error.ts#L4)

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

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1075

###### Inherited from

[`TenantContextMissingError`](#tenantcontextmissingerror).[`message`](#message-1)

##### model

```ts
readonly model: string;
```

Defined in: [src/errors/tenancy-context-required.error.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/errors/tenancy-context-required.error.ts#L5)

##### name

```ts
name: string = 'TenantContextMissingError';
```

Defined in: [src/errors/tenant-context-missing.error.ts:19](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/errors/tenant-context-missing.error.ts#L19)

###### Inherited from

[`TenantContextMissingError`](#tenantcontextmissingerror).[`name`](#name-1)

##### operation

```ts
readonly operation: string;
```

Defined in: [src/errors/tenancy-context-required.error.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/errors/tenancy-context-required.error.ts#L6)

##### stack?

```ts
optional stack?: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1076

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

***

### TenancyEventService

Defined in: [src/events/tenancy-event.service.ts:12](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-event.service.ts#L12)

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

Defined in: [src/events/tenancy-event.service.ts:15](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-event.service.ts#L15)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `moduleRef` | `ModuleRef` |

###### Returns

[`TenancyEventService`](#tenancyeventservice)

#### Methods

##### emit()

```ts
emit(event, payload): void;
```

Defined in: [src/events/tenancy-event.service.ts:28](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-event.service.ts#L28)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` |
| `payload` | `any` |

###### Returns

`void`

##### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [src/events/tenancy-event.service.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-event.service.ts#L17)

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleInit.onModuleInit
```

***

### TenancyModule

Defined in: [src/tenancy.module.ts:25](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/tenancy.module.ts#L25)

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

Defined in: [src/tenancy.module.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/tenancy.module.ts#L26)

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

Defined in: [src/tenancy.module.ts:32](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/tenancy.module.ts#L32)

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

Defined in: [src/tenancy.module.ts:48](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/tenancy.module.ts#L48)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`TenancyModuleAsyncOptions`](#tenancymoduleasyncoptions) |

###### Returns

`DynamicModule`

***

### TenancyService

Defined in: [src/services/tenancy.service.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/services/tenancy.service.ts#L8)

#### Constructors

##### Constructor

```ts
new TenancyService(context, eventService?): TenancyService;
```

Defined in: [src/services/tenancy.service.ts:9](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/services/tenancy.service.ts#L9)

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

Defined in: [src/services/tenancy.service.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/services/tenancy.service.ts#L14)

###### Returns

`string` \| `null`

##### getCurrentTenantOrThrow()

```ts
getCurrentTenantOrThrow(): string;
```

Defined in: [src/services/tenancy.service.ts:18](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/services/tenancy.service.ts#L18)

###### Returns

`string`

##### isTenantBypassed()

```ts
isTenantBypassed(): boolean;
```

Defined in: [src/services/tenancy.service.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/services/tenancy.service.ts#L26)

###### Returns

`boolean`

##### withoutTenant()

```ts
withoutTenant<T>(callback): Promise<T>;
```

Defined in: [src/services/tenancy.service.ts:30](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/services/tenancy.service.ts#L30)

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

Defined in: [src/telemetry/tenancy-telemetry.service.ts:16](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/telemetry/tenancy-telemetry.service.ts#L16)

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

Defined in: [src/telemetry/tenancy-telemetry.service.ts:22](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/telemetry/tenancy-telemetry.service.ts#L22)

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

Defined in: [src/telemetry/tenancy-telemetry.service.ts:54](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/telemetry/tenancy-telemetry.service.ts#L54)

Safely end a span (null-safe).

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `span` | \| \{ `end`: `void`; \} \| `null` |

###### Returns

`void`

##### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:30](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/telemetry/tenancy-telemetry.service.ts#L30)

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

Defined in: [src/telemetry/tenancy-telemetry.service.ts:41](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/telemetry/tenancy-telemetry.service.ts#L41)

Add tenant.id attribute to the current active span.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` |

###### Returns

`void`

##### startSpan()

```ts
startSpan(name, attributes?): 
  | {
  end: void;
}
  | null;
```

Defined in: [src/telemetry/tenancy-telemetry.service.ts:48](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/telemetry/tenancy-telemetry.service.ts#L48)

Start a custom span (only when createSpans is true). Returns null if disabled or OTel unavailable.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `attributes?` | `Record`\<`string`, `string`\> |

###### Returns

  \| \{
  `end`: `void`;
\}
  \| `null`

***

### TenantContextInterceptor

Defined in: [src/propagation/tenant-context.interceptor.ts:56](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/tenant-context.interceptor.ts#L56)

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

Defined in: [src/propagation/tenant-context.interceptor.ts:62](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/tenant-context.interceptor.ts#L62)

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

Defined in: [src/propagation/tenant-context.interceptor.ts:72](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/tenant-context.interceptor.ts#L72)

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

Defined in: [src/errors/tenant-context-missing.error.ts:18](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/errors/tenant-context-missing.error.ts#L18)

Thrown when tenant context is required but not available.

Base class for all tenancy context errors. Use `instanceof TenantContextMissingError`
to catch both this error and its subclass `TenancyContextRequiredError` (Prisma fail-closed).

#### Example

```typescript
try {
  const tenantId = tenancyService.getCurrentTenantOrThrow();
} catch (e) {
  if (e instanceof TenantContextMissingError) {
    // Handles both service-level and Prisma-level errors
  }
}
```

#### Extends

- `Error`

#### Extended by

- [`TenancyContextRequiredError`](#tenancycontextrequirederror)

#### Constructors

##### Constructor

```ts
new TenantContextMissingError(message?): TenantContextMissingError;
```

Defined in: [src/errors/tenant-context-missing.error.ts:21](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/errors/tenant-context-missing.error.ts#L21)

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

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1075

###### Inherited from

```ts
Error.message
```

##### name

```ts
name: string = 'TenantContextMissingError';
```

Defined in: [src/errors/tenant-context-missing.error.ts:19](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/errors/tenant-context-missing.error.ts#L19)

###### Overrides

```ts
Error.name
```

##### stack?

```ts
optional stack?: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1076

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

Defined in: [src/propagation/bull-tenant-propagator.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/bull-tenant-propagator.ts#L4)

#### Properties

##### dataKey?

```ts
optional dataKey?: string;
```

Defined in: [src/propagation/bull-tenant-propagator.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/bull-tenant-propagator.ts#L6)

Key name used to store tenant ID in job data. Defaults to '__tenantId'.

***

### GrpcMetadataLike

Defined in: [src/propagation/grpc-tenant-propagator.ts:16](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/grpc-tenant-propagator.ts#L16)

Structural type for gRPC Metadata — no dependency on @grpc/grpc-js.

Matches the subset of `@grpc/grpc-js` `Metadata` used for tenant propagation.

#### Methods

##### get()

```ts
get(key): (string | Buffer<ArrayBufferLike>)[];
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:18](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/grpc-tenant-propagator.ts#L18)

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

Defined in: [src/propagation/grpc-tenant-propagator.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/grpc-tenant-propagator.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `value` | `string` |

###### Returns

`void`

***

### GrpcPropagationOptions

Defined in: [src/propagation/grpc-tenant-propagator.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/grpc-tenant-propagator.ts#L4)

#### Properties

##### metadataKey?

```ts
optional metadataKey?: string;
```

Defined in: [src/propagation/grpc-tenant-propagator.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/grpc-tenant-propagator.ts#L6)

Metadata key for tenant ID. Defaults to 'x-tenant-id' (lowercase per gRPC convention).

***

### HttpPropagationOptions

Defined in: [src/propagation/http-tenant-propagator.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/http-tenant-propagator.ts#L5)

#### Properties

##### headerName?

```ts
optional headerName?: string;
```

Defined in: [src/propagation/http-tenant-propagator.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/http-tenant-propagator.ts#L7)

Header name for tenant ID propagation. Defaults to 'X-Tenant-Id'.

***

### JwtClaimExtractorOptions

Defined in: [src/extractors/jwt-claim.extractor.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/jwt-claim.extractor.ts#L4)

#### Properties

##### claimKey

```ts
claimKey: string;
```

Defined in: [src/extractors/jwt-claim.extractor.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/jwt-claim.extractor.ts#L5)

##### headerName?

```ts
optional headerName?: string;
```

Defined in: [src/extractors/jwt-claim.extractor.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/jwt-claim.extractor.ts#L6)

***

### KafkaMessageLike

Defined in: [src/propagation/kafka-tenant-propagator.ts:12](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/kafka-tenant-propagator.ts#L12)

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

Defined in: [src/propagation/kafka-tenant-propagator.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/kafka-tenant-propagator.ts#L13)

***

### KafkaPropagationOptions

Defined in: [src/propagation/kafka-tenant-propagator.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/kafka-tenant-propagator.ts#L6)

#### Properties

##### headerName?

```ts
optional headerName?: string;
```

Defined in: [src/propagation/kafka-tenant-propagator.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/kafka-tenant-propagator.ts#L8)

Header name for tenant ID in Kafka message headers. Defaults to 'X-Tenant-Id'.

***

### PathExtractorOptions

Defined in: [src/extractors/path.extractor.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/path.extractor.ts#L4)

#### Properties

##### paramName

```ts
paramName: string;
```

Defined in: [src/extractors/path.extractor.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/path.extractor.ts#L6)

##### pattern

```ts
pattern: string;
```

Defined in: [src/extractors/path.extractor.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/path.extractor.ts#L5)

***

### PrismaTenancyExtensionOptions

Defined in: [src/prisma/prisma-tenancy.extension.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/prisma/prisma-tenancy.extension.ts#L6)

#### Properties

##### autoInjectTenantId?

```ts
optional autoInjectTenantId?: boolean;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/prisma/prisma-tenancy.extension.ts#L8)

##### dbSettingKey?

```ts
optional dbSettingKey?: string;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/prisma/prisma-tenancy.extension.ts#L7)

##### ~~experimentalTransactionSupport?~~

```ts
optional experimentalTransactionSupport?: boolean;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:39](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/prisma/prisma-tenancy.extension.ts#L39)

###### Deprecated

Use `interactiveTransactionSupport` instead. Will be removed in v1.0.

##### failClosed?

```ts
optional failClosed?: boolean;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:19](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/prisma/prisma-tenancy.extension.ts#L19)

When true, throws `TenancyContextRequiredError` if a query is executed
without a tenant context (unless the model is in `sharedModels` or
`withoutTenant()` was used to explicitly bypass).

Prevents accidental data exposure when RLS policies are misconfigured.

###### Default

```ts
false
```

##### interactiveTransactionSupport?

```ts
optional interactiveTransactionSupport?: boolean;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:35](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/prisma/prisma-tenancy.extension.ts#L35)

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

Defined in: [src/prisma/prisma-tenancy.extension.ts:10](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/prisma/prisma-tenancy.extension.ts#L10)

##### tenantIdField?

```ts
optional tenantIdField?: string;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:9](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/prisma/prisma-tenancy.extension.ts#L9)

***

### SubdomainExtractorOptions

Defined in: [src/extractors/subdomain.extractor.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/subdomain.extractor.ts#L4)

#### Properties

##### excludeSubdomains?

```ts
optional excludeSubdomains?: string[];
```

Defined in: [src/extractors/subdomain.extractor.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/extractors/subdomain.extractor.ts#L5)

***

### TelemetryOptions

Defined in: [src/interfaces/tenancy-module-options.interface.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L6)

#### Properties

##### createSpans?

```ts
optional createSpans?: boolean;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:10](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L10)

Create custom spans for tenant lifecycle events (resolved, not_found, etc.).

###### Default

```ts
false
```

##### spanAttributeKey?

```ts
optional spanAttributeKey?: string;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L8)

Span attribute key for tenant ID.

###### Default

```ts
'tenant.id'
```

***

### TenancyModuleAsyncOptions

Defined in: [src/interfaces/tenancy-module-options.interface.ts:65](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L65)

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
optional inject?: any[];
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:67](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L67)

##### useClass?

```ts
optional useClass?: Type<TenancyModuleOptionsFactory>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:71](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L71)

##### useExisting?

```ts
optional useExisting?: Type<TenancyModuleOptionsFactory>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:72](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L72)

##### useFactory?

```ts
optional useFactory?: (...args) => 
  | TenancyModuleOptions
| Promise<TenancyModuleOptions>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:68](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L68)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`TenancyModuleOptions`](#tenancymoduleoptions)
  \| `Promise`\<[`TenancyModuleOptions`](#tenancymoduleoptions)\>

***

### TenancyModuleOptions

Defined in: [src/interfaces/tenancy-module-options.interface.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L13)

#### Properties

##### crossCheckExtractor?

```ts
optional crossCheckExtractor?: TenantExtractor;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:43](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L43)

Secondary extractor for cross-checking the tenant ID against another source.
Prevents tenant ID forgery by comparing the primary extractor result with this one.

Common pattern: primary = header, crossCheck = JWT claim.
If both return a value and they differ, the request is rejected or logged
based on `onCrossCheckFailed`.

If the cross-check extractor returns null (e.g., no JWT present),
validation is skipped — allowing unauthenticated endpoints to work normally.

##### dbSettingKey?

```ts
optional dbSettingKey?: string;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:15](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L15)

##### onCrossCheckFailed?

```ts
optional onCrossCheckFailed?: "reject" | "log";
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:50](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L50)

Behavior when `crossCheckExtractor` detects a mismatch.
- `'reject'` (default): throws ForbiddenException
- `'log'`: logs a warning and continues with the primary extractor's value

##### onTenantNotFound?

```ts
optional onTenantNotFound?: (request, response) => void | "skip" | Promise<void | "skip">;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:30](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L30)

Called when no tenant ID could be extracted from the request.

Behavior based on return value:
- `void` / `undefined`: request continues to the next middleware (observation-only hook)
- `'skip'`: request continues but `next()` is NOT called — you must have already
  sent a response (e.g., via injected `Response`) or thrown an exception

Throwing an exception (e.g., `throw new ForbiddenException()`) always aborts
the request regardless of return value.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | `Request` |
| `response` | `Response` |

###### Returns

`void` \| `"skip"` \| `Promise`\<`void` \| `"skip"`\>

##### onTenantResolved?

```ts
optional onTenantResolved?: (tenantId, request) => void | Promise<void>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` |
| `request` | `Request` |

###### Returns

`void` \| `Promise`\<`void`\>

##### telemetry?

```ts
optional telemetry?: TelemetryOptions;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:56](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L56)

OpenTelemetry integration. Automatically adds tenant.id to active spans.
Silently ignored if `@opentelemetry/api` is not installed.

##### tenantExtractor

```ts
tenantExtractor: string | TenantExtractor;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L14)

##### validateTenantId?

```ts
optional validateTenantId?: (tenantId) => boolean | Promise<boolean>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:16](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` |

###### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### TenancyModuleOptionsFactory

Defined in: [src/interfaces/tenancy-module-options.interface.ts:59](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L59)

#### Methods

##### createTenancyOptions()

```ts
createTenancyOptions(): 
  | TenancyModuleOptions
| Promise<TenancyModuleOptions>;
```

Defined in: [src/interfaces/tenancy-module-options.interface.ts:60](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenancy-module-options.interface.ts#L60)

###### Returns

  \| [`TenancyModuleOptions`](#tenancymoduleoptions)
  \| `Promise`\<[`TenancyModuleOptions`](#tenancymoduleoptions)\>

***

### TenancyTransactionOptions

Defined in: [src/prisma/tenancy-transaction.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/prisma/tenancy-transaction.ts#L4)

#### Properties

##### dbSettingKey?

```ts
optional dbSettingKey?: string;
```

Defined in: [src/prisma/tenancy-transaction.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/prisma/tenancy-transaction.ts#L7)

##### isolationLevel?

```ts
optional isolationLevel?: string;
```

Defined in: [src/prisma/tenancy-transaction.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/prisma/tenancy-transaction.ts#L6)

##### timeout?

```ts
optional timeout?: number;
```

Defined in: [src/prisma/tenancy-transaction.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/prisma/tenancy-transaction.ts#L5)

***

### TenantContextBypassedEvent

Defined in: [src/events/tenancy-events.ts:25](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L25)

#### Properties

##### reason

```ts
reason: "decorator" | "withoutTenant";
```

Defined in: [src/events/tenancy-events.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L26)

***

### TenantContextCarrier

Defined in: [src/interfaces/tenant-context-carrier.interface.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenant-context-carrier.interface.ts#L14)

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

Defined in: [src/interfaces/tenant-context-carrier.interface.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenant-context-carrier.interface.ts#L26)

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

Defined in: [src/interfaces/tenant-context-carrier.interface.ts:20](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenant-context-carrier.interface.ts#L20)

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

### TenantContextInterceptorOptions

Defined in: [src/propagation/tenant-context.interceptor.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/tenant-context.interceptor.ts#L11)

#### Properties

##### bullDataKey?

```ts
optional bullDataKey?: string;
```

Defined in: [src/propagation/tenant-context.interceptor.ts:15](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/tenant-context.interceptor.ts#L15)

Bull job data key. Defaults to '__tenantId'.

##### grpcMetadataKey?

```ts
optional grpcMetadataKey?: string;
```

Defined in: [src/propagation/tenant-context.interceptor.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/tenant-context.interceptor.ts#L17)

gRPC metadata key. Defaults to 'x-tenant-id'.

##### kafkaHeaderName?

```ts
optional kafkaHeaderName?: string;
```

Defined in: [src/propagation/tenant-context.interceptor.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/tenant-context.interceptor.ts#L13)

Kafka message header name. Defaults to 'X-Tenant-Id'.

##### transport?

```ts
optional transport?: "kafka" | "bull" | "grpc";
```

Defined in: [src/propagation/tenant-context.interceptor.ts:22](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/tenant-context.interceptor.ts#L22)

Explicitly specify the transport type instead of using duck-typing detection.
Recommended to avoid false positives from ambiguous RPC context shapes.

***

### TenantCrossCheckFailedEvent

Defined in: [src/events/tenancy-events.ts:29](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L29)

#### Properties

##### crossCheckTenantId

```ts
crossCheckTenantId: string;
```

Defined in: [src/events/tenancy-events.ts:31](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L31)

##### extractedTenantId

```ts
extractedTenantId: string;
```

Defined in: [src/events/tenancy-events.ts:30](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L30)

##### request

```ts
request: Request;
```

Defined in: [src/events/tenancy-events.ts:32](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L32)

***

### TenantExtractor

Defined in: [src/interfaces/tenant-extractor.interface.ts:3](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenant-extractor.interface.ts#L3)

#### Methods

##### extract()

```ts
extract(request): string | Promise<string | null> | null;
```

Defined in: [src/interfaces/tenant-extractor.interface.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenant-extractor.interface.ts#L4)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | `Request` |

###### Returns

`string` \| `Promise`\<`string` \| `null`\> \| `null`

***

### TenantNotFoundEvent

Defined in: [src/events/tenancy-events.ts:16](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L16)

#### Properties

##### request

```ts
request: Request;
```

Defined in: [src/events/tenancy-events.ts:17](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L17)

***

### TenantPropagator

Defined in: [src/interfaces/tenant-propagator.interface.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenant-propagator.interface.ts#L8)

Contract for propagating tenant context to outgoing requests.

Implementations transform the current tenant ID into transport-specific
headers or metadata. Used by `HttpTenantPropagator` for HTTP and
`KafkaTenantPropagator` for Kafka. For Bull and gRPC, see `TenantContextCarrier`.

#### Methods

##### getHeaders()

```ts
getHeaders(): Record<string, string>;
```

Defined in: [src/interfaces/tenant-propagator.interface.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/interfaces/tenant-propagator.interface.ts#L13)

Returns headers to propagate tenant context.
Returns an empty object if no tenant context is available.

###### Returns

`Record`\<`string`, `string`\>

***

### TenantResolvedEvent

Defined in: [src/events/tenancy-events.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L11)

#### Properties

##### request

```ts
request: Request;
```

Defined in: [src/events/tenancy-events.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L13)

##### tenantId

```ts
tenantId: string;
```

Defined in: [src/events/tenancy-events.ts:12](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L12)

***

### TenantValidationFailedEvent

Defined in: [src/events/tenancy-events.ts:20](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L20)

#### Properties

##### request

```ts
request: Request;
```

Defined in: [src/events/tenancy-events.ts:22](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L22)

##### tenantId

```ts
tenantId: string;
```

Defined in: [src/events/tenancy-events.ts:21](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L21)

## Variables

### CurrentTenant

```ts
const CurrentTenant: (...dataOrPipes) => ParameterDecorator;
```

Defined in: [src/decorators/current-tenant.decorator.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/decorators/current-tenant.decorator.ts#L6)

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

Defined in: [src/tenancy.constants.ts:1](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/tenancy.constants.ts#L1)

***

### TenancyEvents

```ts
const TenancyEvents: {
  CONTEXT_BYPASSED: "tenant.context_bypassed";
  CROSS_CHECK_FAILED: "tenant.cross_check_failed";
  NOT_FOUND: "tenant.not_found";
  RESOLVED: "tenant.resolved";
  VALIDATION_FAILED: "tenant.validation_failed";
};
```

Defined in: [src/events/tenancy-events.ts:3](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L3)

#### Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-context_bypassed"></a> `CONTEXT_BYPASSED` | `"tenant.context_bypassed"` | `'tenant.context_bypassed'` | [src/events/tenancy-events.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L7) |
| <a id="property-cross_check_failed"></a> `CROSS_CHECK_FAILED` | `"tenant.cross_check_failed"` | `'tenant.cross_check_failed'` | [src/events/tenancy-events.ts:8](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L8) |
| <a id="property-not_found"></a> `NOT_FOUND` | `"tenant.not_found"` | `'tenant.not_found'` | [src/events/tenancy-events.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L5) |
| <a id="property-resolved"></a> `RESOLVED` | `"tenant.resolved"` | `'tenant.resolved'` | [src/events/tenancy-events.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L4) |
| <a id="property-validation_failed"></a> `VALIDATION_FAILED` | `"tenant.validation_failed"` | `'tenant.validation_failed'` | [src/events/tenancy-events.ts:6](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/events/tenancy-events.ts#L6) |

## Functions

### BypassTenancy()

```ts
function BypassTenancy(): CustomDecorator<typeof BYPASS_TENANCY_KEY>;
```

Defined in: [src/decorators/bypass-tenancy.decorator.ts:4](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/decorators/bypass-tenancy.decorator.ts#L4)

#### Returns

`CustomDecorator`\<*typeof* `BYPASS_TENANCY_KEY`\>

***

### createPrismaTenancyExtension()

```ts
function createPrismaTenancyExtension(tenancyService, options?): any;
```

Defined in: [src/prisma/prisma-tenancy.extension.ts:74](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/prisma/prisma-tenancy.extension.ts#L74)

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

**Interactive transactions:**
By default, the batch `$transaction([set_config, query])` does not propagate into
interactive transactions (`$transaction(async (tx) => ...)`). Two solutions:
1. Enable `interactiveTransactionSupport: true` for transparent handling (uses Prisma internals).
2. Use the standalone `tenancyTransaction()` helper (public APIs only).

Usage:
```typescript
const prisma = new PrismaClient().$extends(
  createPrismaTenancyExtension(tenancyService)
);
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenancyService` | [`TenancyService`](#tenancyservice) |
| `options?` | [`PrismaTenancyExtensionOptions`](#prismatenancyextensionoptions) |

#### Returns

`any`

***

### propagateTenantHeaders()

```ts
function propagateTenantHeaders(headerName?): Record<string, string>;
```

Defined in: [src/propagation/propagate-tenant-headers.ts:34](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/propagation/propagate-tenant-headers.ts#L34)

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
function tenancyTransaction<T>(
   prisma, 
   tenancyService, 
   callback, 
options?): Promise<T>;
```

Defined in: [src/prisma/tenancy-transaction.ts:22](https://github.com/nestarc/nestjs-tenancy/blob/722df8042d9e1819fee761c8321d917c52b597c5/src/prisma/tenancy-transaction.ts#L22)

Executes a Prisma interactive transaction with RLS tenant context.

Runs `set_config()` as the first statement inside the interactive
transaction, ensuring the PostgreSQL session variable is set on the
same connection that executes the callback queries.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prisma` | `any` | PrismaClient instance (not extended — raw client) |
| `tenancyService` | [`TenancyService`](#tenancyservice) | TenancyService to read current tenant |
| `callback` | (`tx`) => `Promise`\<`T`\> | Function receiving the transaction client |
| `options?` | [`TenancyTransactionOptions`](#tenancytransactionoptions) | Transaction timeout, isolation level, and DB setting key |

#### Returns

`Promise`\<`T`\>
