# @nestarc/outbox

## Classes

### LocalTransport

Defined in: [src/transports/local.transport.ts:10](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/transports/local.transport.ts#L10)

#### Implements

- [`OutboxTransport`](#outboxtransport)

#### Constructors

##### Constructor

```ts
new LocalTransport(tenantProvider?): LocalTransport;
```

Defined in: [src/transports/local.transport.ts:11](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/transports/local.transport.ts#L11)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantProvider?` | [`OutboxTenantProvider`](#outboxtenantprovider) \| `null` |

###### Returns

[`LocalTransport`](#localtransport)

#### Methods

##### dispatch()

```ts
dispatch(
   record, 
   handlers, 
context?): Promise<void>;
```

Defined in: [src/transports/local.transport.ts:17](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/transports/local.transport.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `record` | [`OutboxRecord`](#outboxrecord) |
| `handlers` | [`OutboxHandler`](#outboxhandler)[] |
| `context` | [`OutboxHandlerContext`](#outboxhandlercontext) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`OutboxTransport`](#outboxtransport).[`dispatch`](#dispatch-1)

***

### OutboxAdminService

Defined in: [src/outbox.admin.service.ts:38](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.admin.service.ts#L38)

#### Constructors

##### Constructor

```ts
new OutboxAdminService(options): OutboxAdminService;
```

Defined in: [src/outbox.admin.service.ts:39](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.admin.service.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxOptions`](#outboxoptions) |

###### Returns

[`OutboxAdminService`](#outboxadminservice)

#### Methods

##### getById()

```ts
getById(id): Promise<OutboxRecord | null>;
```

Defined in: [src/outbox.admin.service.ts:124](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.admin.service.ts#L124)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`Promise`\<[`OutboxRecord`](#outboxrecord) \| `null`\>

##### getHealth()

```ts
getHealth(options?): Promise<OutboxHealth>;
```

Defined in: [src/outbox.admin.service.ts:215](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.admin.service.ts#L215)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxHealthOptions`](#outboxhealthoptions) |

###### Returns

`Promise`\<[`OutboxHealth`](#outboxhealth)\>

##### getStats()

```ts
getStats(): Promise<OutboxStats>;
```

Defined in: [src/outbox.admin.service.ts:41](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.admin.service.ts#L41)

###### Returns

`Promise`\<[`OutboxStats`](#outboxstats)\>

##### list()

```ts
list(options?): Promise<OutboxRecord[]>;
```

Defined in: [src/outbox.admin.service.ts:77](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.admin.service.ts#L77)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxListOptions`](#outboxlistoptions) |

###### Returns

`Promise`\<[`OutboxRecord`](#outboxrecord)[]\>

##### markFailed()

```ts
markFailed(id, reason): Promise<boolean>;
```

Defined in: [src/outbox.admin.service.ts:177](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.admin.service.ts#L177)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `reason` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### purgeSent()

```ts
purgeSent(options): Promise<number>;
```

Defined in: [src/outbox.admin.service.ts:193](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.admin.service.ts#L193)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | \{ `before`: `Date`; `limit?`: `number`; \} |
| `options.before` | `Date` |
| `options.limit?` | `number` |

###### Returns

`Promise`\<`number`\>

##### retry()

```ts
retry(id): Promise<boolean>;
```

Defined in: [src/outbox.admin.service.ts:138](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.admin.service.ts#L138)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### retryMany()

```ts
retryMany(ids): Promise<number>;
```

Defined in: [src/outbox.admin.service.ts:155](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.admin.service.ts#L155)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ids` | `string`[] |

###### Returns

`Promise`\<`number`\>

***

### OutboxEmitter

Defined in: [src/outbox.emitter.ts:37](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.emitter.ts#L37)

#### Constructors

##### Constructor

```ts
new OutboxEmitter(options, tenantProvider?): OutboxEmitter;
```

Defined in: [src/outbox.emitter.ts:41](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.emitter.ts#L41)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxOptions`](#outboxoptions) |
| `tenantProvider?` | [`OutboxTenantProvider`](#outboxtenantprovider) \| `null` |

###### Returns

[`OutboxEmitter`](#outboxemitter)

#### Methods

##### emit()

```ts
emit(
   tx, 
   event, 
options?): Promise<void>;
```

Defined in: [src/outbox.emitter.ts:50](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.emitter.ts#L50)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`PrismaTransactionClient`](#prismatransactionclient) |
| `event` | [`OutboxEvent`](#abstract-outboxevent) |
| `options?` | [`OutboxEmitOptions`](#outboxemitoptions) |

###### Returns

`Promise`\<`void`\>

##### emitMany()

```ts
emitMany(tx, events): Promise<void>;
```

Defined in: [src/outbox.emitter.ts:92](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.emitter.ts#L92)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`PrismaTransactionClient`](#prismatransactionclient) |
| `events` | [`OutboxEmitManyEntry`](#outboxemitmanyentry)[] |

###### Returns

`Promise`\<`void`\>

***

### `abstract` OutboxEvent

Defined in: [src/outbox.event.ts:1](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.event.ts#L1)

#### Constructors

##### Constructor

```ts
new OutboxEvent(): OutboxEvent;
```

###### Returns

[`OutboxEvent`](#abstract-outboxevent)

#### Methods

##### getEventType()

```ts
getEventType(): string;
```

Defined in: [src/outbox.event.ts:10](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.event.ts#L10)

###### Returns

`string`

##### toPayload()

```ts
toPayload(): Record<string, unknown>;
```

Defined in: [src/outbox.event.ts:2](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.event.ts#L2)

###### Returns

`Record`\<`string`, `unknown`\>

***

### OutboxListener

Defined in: [src/outbox.listener.ts:24](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.listener.ts#L24)

#### Implements

- `OnModuleInit`
- `OnApplicationShutdown`

#### Constructors

##### Constructor

```ts
new OutboxListener(options, poller): OutboxListener;
```

Defined in: [src/outbox.listener.ts:30](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.listener.ts#L30)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxOptions`](#outboxoptions) |
| `poller` | `Pick`\<`OutboxPoller`, `"poll"`\> |

###### Returns

[`OutboxListener`](#outboxlistener)

#### Methods

##### onApplicationShutdown()

```ts
onApplicationShutdown(): Promise<void>;
```

Defined in: [src/outbox.listener.ts:41](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.listener.ts#L41)

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnApplicationShutdown.onApplicationShutdown
```

##### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [src/outbox.listener.ts:36](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.listener.ts#L36)

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleInit.onModuleInit
```

***

### OutboxModule

Defined in: [src/outbox.module.ts:28](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.module.ts#L28)

#### Constructors

##### Constructor

```ts
new OutboxModule(): OutboxModule;
```

###### Returns

[`OutboxModule`](#outboxmodule)

#### Methods

##### forRoot()

```ts
static forRoot(options): DynamicModule;
```

Defined in: [src/outbox.module.ts:29](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.module.ts#L29)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxOptions`](#outboxoptions) |

###### Returns

`DynamicModule`

##### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [src/outbox.module.ts:79](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.module.ts#L79)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxAsyncOptions`](#outboxasyncoptions) |

###### Returns

`DynamicModule`

## Interfaces

### OutboxAsyncOptions

Defined in: [src/interfaces/outbox-options.interface.ts:44](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L44)

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

Defined in: [src/interfaces/outbox-options.interface.ts:45](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L45)

##### isGlobal?

```ts
optional isGlobal?: boolean;
```

Defined in: [src/interfaces/outbox-options.interface.ts:51](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L51)

##### transport?

```ts
optional transport?: Type<
  | OutboxTransport
| OutboxPublisher>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:50](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L50)

Custom transport class. Defaults to LocalTransport.

##### useClass?

```ts
optional useClass?: Type<OutboxOptionsFactory>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:47](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L47)

##### useExisting?

```ts
optional useExisting?: Type<OutboxOptionsFactory>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:48](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L48)

##### useFactory?

```ts
optional useFactory?: (...args) => 
  | OutboxOptions
| Promise<OutboxOptions>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:46](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L46)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`OutboxOptions`](#outboxoptions)
  \| `Promise`\<[`OutboxOptions`](#outboxoptions)\>

***

### OutboxDeliveryOptions

Defined in: [src/interfaces/outbox-options.interface.ts:20](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L20)

#### Properties

##### mode?

```ts
optional mode?: "local" | "publisher";
```

Defined in: [src/interfaces/outbox-options.interface.ts:21](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L21)

***

### OutboxDispatchContext

Defined in: [src/interfaces/outbox-hooks.interface.ts:14](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L14)

#### Extended by

- [`OutboxRetryContext`](#outboxretrycontext)

#### Properties

##### aggregateId

```ts
aggregateId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:22](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L22)

##### aggregateType

```ts
aggregateType: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:21](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L21)

##### causationId

```ts
causationId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:26](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L26)

##### correlationId

```ts
correlationId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:25](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L25)

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:16](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L16)

##### eventType

```ts
eventType: string;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:17](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L17)

##### headers

```ts
headers: Record<string, string>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:27](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L27)

##### idempotencyKey

```ts
idempotencyKey: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:24](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L24)

##### maxRetries

```ts
maxRetries: number;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:20](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L20)

##### partitionKey

```ts
partitionKey: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:23](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L23)

##### record

```ts
record: OutboxRecord;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:15](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L15)

##### retryCount

```ts
retryCount: number;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:19](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L19)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:18](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L18)

***

### OutboxEmitContext

Defined in: [src/interfaces/outbox-hooks.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L4)

#### Extends

- `Required`\<[`OutboxEmitOptions`](#outboxemitoptions)\>

#### Properties

##### aggregateId

```ts
aggregateId: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:6](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L6)

###### Inherited from

[`OutboxEmitOptions`](#outboxemitoptions).[`aggregateId`](#aggregateid-2)

##### aggregateType

```ts
aggregateType: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:5](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L5)

###### Inherited from

[`OutboxEmitOptions`](#outboxemitoptions).[`aggregateType`](#aggregatetype-2)

##### causationId

```ts
causationId: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:10](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L10)

###### Inherited from

[`OutboxEmitOptions`](#outboxemitoptions).[`causationId`](#causationid-2)

##### correlationId

```ts
correlationId: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L9)

###### Inherited from

[`OutboxEmitOptions`](#outboxemitoptions).[`correlationId`](#correlationid-2)

##### eventType

```ts
eventType: string;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:5](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L5)

##### headers

```ts
headers: Record<string, string>;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:11](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L11)

###### Inherited from

[`OutboxEmitOptions`](#outboxemitoptions).[`headers`](#headers-2)

##### idempotencyKey

```ts
idempotencyKey: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L8)

###### Inherited from

[`OutboxEmitOptions`](#outboxemitoptions).[`idempotencyKey`](#idempotencykey-2)

##### occurredAt

```ts
occurredAt: Date | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:12](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L12)

###### Inherited from

[`OutboxEmitOptions`](#outboxemitoptions).[`occurredAt`](#occurredat-1)

##### partitionKey

```ts
partitionKey: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:7](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L7)

###### Inherited from

[`OutboxEmitOptions`](#outboxemitoptions).[`partitionKey`](#partitionkey-2)

##### payload

```ts
payload: Record<string, unknown>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:6](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L6)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L4)

###### Inherited from

[`OutboxEmitOptions`](#outboxemitoptions).[`tenantId`](#tenantid-2)

***

### OutboxEmitOptions

Defined in: [src/interfaces/outbox-emit-options.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L3)

#### Properties

##### aggregateId?

```ts
optional aggregateId?: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:6](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L6)

##### aggregateType?

```ts
optional aggregateType?: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:5](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L5)

##### causationId?

```ts
optional causationId?: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:10](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L10)

##### correlationId?

```ts
optional correlationId?: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L9)

##### headers?

```ts
optional headers?: Record<string, string>;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:11](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L11)

##### idempotencyKey?

```ts
optional idempotencyKey?: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L8)

##### occurredAt?

```ts
optional occurredAt?: Date | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:12](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L12)

##### partitionKey?

```ts
optional partitionKey?: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:7](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L7)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L4)

***

### OutboxHandler

Defined in: [src/interfaces/outbox-handler.interface.ts:1](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler.interface.ts#L1)

#### Properties

##### eventTypes

```ts
eventTypes: string[];
```

Defined in: [src/interfaces/outbox-handler.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler.interface.ts#L4)

##### instance

```ts
instance: Record<string, any>;
```

Defined in: [src/interfaces/outbox-handler.interface.ts:2](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler.interface.ts#L2)

##### methodName

```ts
methodName: string;
```

Defined in: [src/interfaces/outbox-handler.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler.interface.ts#L3)

***

### OutboxHandlerContext

Defined in: [src/interfaces/outbox-handler-context.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler-context.interface.ts#L3)

#### Properties

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:5](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler-context.interface.ts#L5)

##### eventType

```ts
eventType: string;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:6](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler-context.interface.ts#L6)

##### headers

```ts
headers: Record<string, string>;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler-context.interface.ts#L9)

##### record

```ts
record: OutboxRecord;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler-context.interface.ts#L4)

##### retryCount

```ts
retryCount: number;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler-context.interface.ts#L8)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:7](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler-context.interface.ts#L7)

***

### OutboxHealth

Defined in: [src/interfaces/outbox-admin.interface.ts:26](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L26)

#### Properties

##### ok

```ts
ok: boolean;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:27](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L27)

##### reasons

```ts
reasons: string[];
```

Defined in: [src/interfaces/outbox-admin.interface.ts:29](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L29)

##### stats

```ts
stats: OutboxStats;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:28](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L28)

***

### OutboxHealthOptions

Defined in: [src/interfaces/outbox-admin.interface.ts:21](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L21)

#### Properties

##### maxFailedCount?

```ts
optional maxFailedCount?: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:23](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L23)

##### maxOldestPendingAgeMs?

```ts
optional maxOldestPendingAgeMs?: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:22](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L22)

***

### OutboxHooks

Defined in: [src/interfaces/outbox-hooks.interface.ts:36](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L36)

#### Methods

##### onDeadLetter()?

```ts
optional onDeadLetter(context): void | Promise<void>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:50](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L50)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`OutboxRetryContext`](#outboxretrycontext) |

###### Returns

`void` \| `Promise`\<`void`\>

##### onDispatchFailure()?

```ts
optional onDispatchFailure(context): void | Promise<void>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:43](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L43)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`OutboxDispatchContext`](#outboxdispatchcontext) & \{ `durationMs`: `number`; `error`: `Error`; \} |

###### Returns

`void` \| `Promise`\<`void`\>

##### onDispatchStart()?

```ts
optional onDispatchStart(context): void | Promise<void>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:39](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`OutboxDispatchContext`](#outboxdispatchcontext) |

###### Returns

`void` \| `Promise`\<`void`\>

##### onDispatchSuccess()?

```ts
optional onDispatchSuccess(context): void | Promise<void>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:40](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L40)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`OutboxDispatchContext`](#outboxdispatchcontext) & \{ `durationMs`: `number`; \} |

###### Returns

`void` \| `Promise`\<`void`\>

##### onEmit()?

```ts
optional onEmit(context): void | Promise<void>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:37](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`OutboxEmitContext`](#outboxemitcontext) |

###### Returns

`void` \| `Promise`\<`void`\>

##### onPollStart()?

```ts
optional onPollStart(context): void | Promise<void>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:38](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L38)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`OutboxPollContext`](#outboxpollcontext) |

###### Returns

`void` \| `Promise`\<`void`\>

##### onRetryScheduled()?

```ts
optional onRetryScheduled(context): void | Promise<void>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:49](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L49)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`OutboxRetryContext`](#outboxretrycontext) |

###### Returns

`void` \| `Promise`\<`void`\>

***

### OutboxListOptions

Defined in: [src/interfaces/outbox-admin.interface.ts:12](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L12)

#### Properties

##### after?

```ts
optional after?: Date;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:18](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L18)

##### before?

```ts
optional before?: Date;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:17](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L17)

##### eventType?

```ts
optional eventType?: string;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:14](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L14)

##### limit?

```ts
optional limit?: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:16](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L16)

##### status?

```ts
optional status?: "PENDING" | "PROCESSING" | "SENT" | "FAILED";
```

Defined in: [src/interfaces/outbox-admin.interface.ts:13](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L13)

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:15](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L15)

***

### OutboxNotification

Defined in: [src/interfaces/outbox-wakeup.interface.ts:1](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L1)

#### Properties

##### channel

```ts
channel: string;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:2](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L2)

##### payload?

```ts
optional payload?: string;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L3)

***

### OutboxNotificationClient

Defined in: [src/interfaces/outbox-wakeup.interface.ts:6](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L6)

#### Methods

##### connect()

```ts
connect(): Promise<void>;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:7](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L7)

###### Returns

`Promise`\<`void`\>

##### end()

```ts
end(): Promise<void>;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L9)

###### Returns

`Promise`\<`void`\>

##### on()

```ts
on(event, handler): this;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:10](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` |
| `handler` | (`payload`) => `void` |

###### Returns

`this`

##### query()

```ts
query(sql): Promise<unknown>;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L8)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `sql` | `string` |

###### Returns

`Promise`\<`unknown`\>

***

### OutboxOptions

Defined in: [src/interfaces/outbox-options.interface.ts:24](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L24)

#### Properties

##### delivery?

```ts
optional delivery?: OutboxDeliveryOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:35](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L35)

##### events?

```ts
optional events?: Type<any>[];
```

Defined in: [src/interfaces/outbox-options.interface.ts:39](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L39)

##### hooks?

```ts
optional hooks?: OutboxHooks;
```

Defined in: [src/interfaces/outbox-options.interface.ts:37](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L37)

##### isGlobal?

```ts
optional isGlobal?: boolean;
```

Defined in: [src/interfaces/outbox-options.interface.ts:40](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L40)

##### polling?

```ts
optional polling?: OutboxPollingOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:31](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L31)

##### prisma

```ts
prisma: any;
```

Defined in: [src/interfaces/outbox-options.interface.ts:30](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L30)

forRoot: PrismaService class reference (resolved via DI, must be in a

###### Global

module).
forRootAsync: resolved PrismaService instance from the factory.
The instance must satisfy [PrismaLike](#prismalike) ($executeRaw, $queryRaw).

##### retry?

```ts
optional retry?: OutboxRetryOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:32](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L32)

##### stuckThreshold?

```ts
optional stuckThreshold?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:41](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L41)

##### tenancy?

```ts
optional tenancy?: OutboxTenancyOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:36](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L36)

##### transport?

```ts
optional transport?: Type<
  | OutboxTransport
| OutboxPublisher>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:34](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L34)

Custom transport class. Defaults to LocalTransport (in-process handler invocation).

##### wakeup?

```ts
optional wakeup?: OutboxWakeupOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:38](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L38)

***

### OutboxOptionsFactory

Defined in: [src/interfaces/outbox-options.interface.ts:54](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L54)

#### Methods

##### createOutboxOptions()

```ts
createOutboxOptions(): 
  | OutboxOptions
| Promise<OutboxOptions>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:55](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L55)

###### Returns

  \| [`OutboxOptions`](#outboxoptions)
  \| `Promise`\<[`OutboxOptions`](#outboxoptions)\>

***

### OutboxPollContext

Defined in: [src/interfaces/outbox-hooks.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L9)

#### Properties

##### batchSize

```ts
batchSize: number;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:10](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L10)

##### deliveryMode

```ts
deliveryMode: "local" | "publisher";
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:11](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L11)

***

### OutboxPollingOptions

Defined in: [src/interfaces/outbox-options.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L8)

#### Properties

##### batchSize?

```ts
optional batchSize?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:11](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L11)

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/outbox-options.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L9)

##### interval?

```ts
optional interval?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:10](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L10)

***

### OutboxPublisher

Defined in: [src/interfaces/outbox-publisher.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-publisher.interface.ts#L3)

#### Methods

##### publish()

```ts
publish(record): Promise<void>;
```

Defined in: [src/interfaces/outbox-publisher.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-publisher.interface.ts#L4)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `record` | [`OutboxRecord`](#outboxrecord) |

###### Returns

`Promise`\<`void`\>

***

### OutboxRecord

Defined in: [src/interfaces/outbox-record.interface.ts:1](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L1)

#### Properties

##### aggregateId

```ts
aggregateId: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:14](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L14)

##### aggregateType

```ts
aggregateType: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:13](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L13)

##### causationId

```ts
causationId: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:18](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L18)

##### correlationId

```ts
correlationId: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:17](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L17)

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/outbox-record.interface.ts:6](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L6)

##### eventType

```ts
eventType: string;
```

Defined in: [src/interfaces/outbox-record.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L3)

##### headers

```ts
headers: Record<string, string>;
```

Defined in: [src/interfaces/outbox-record.interface.ts:19](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L19)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/outbox-record.interface.ts:2](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L2)

##### idempotencyKey

```ts
idempotencyKey: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:16](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L16)

##### lastError

```ts
lastError: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:11](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L11)

##### maxRetries

```ts
maxRetries: number;
```

Defined in: [src/interfaces/outbox-record.interface.ts:10](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L10)

##### occurredAt

```ts
occurredAt: Date;
```

Defined in: [src/interfaces/outbox-record.interface.ts:20](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L20)

##### partitionKey

```ts
partitionKey: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:15](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L15)

##### payload

```ts
payload: Record<string, unknown>;
```

Defined in: [src/interfaces/outbox-record.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L4)

##### processedAt

```ts
processedAt: Date | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L8)

##### retryCount

```ts
retryCount: number;
```

Defined in: [src/interfaces/outbox-record.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L9)

##### status

```ts
status: "PENDING" | "PROCESSING" | "SENT" | "FAILED";
```

Defined in: [src/interfaces/outbox-record.interface.ts:5](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L5)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:12](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L12)

##### updatedAt

```ts
updatedAt: Date;
```

Defined in: [src/interfaces/outbox-record.interface.ts:7](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L7)

***

### OutboxRetryContext

Defined in: [src/interfaces/outbox-hooks.interface.ts:30](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L30)

#### Extends

- [`OutboxDispatchContext`](#outboxdispatchcontext)

#### Properties

##### aggregateId

```ts
aggregateId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:22](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L22)

###### Inherited from

[`OutboxDispatchContext`](#outboxdispatchcontext).[`aggregateId`](#aggregateid)

##### aggregateType

```ts
aggregateType: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:21](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L21)

###### Inherited from

[`OutboxDispatchContext`](#outboxdispatchcontext).[`aggregateType`](#aggregatetype)

##### causationId

```ts
causationId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:26](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L26)

###### Inherited from

[`OutboxDispatchContext`](#outboxdispatchcontext).[`causationId`](#causationid)

##### correlationId

```ts
correlationId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:25](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L25)

###### Inherited from

[`OutboxDispatchContext`](#outboxdispatchcontext).[`correlationId`](#correlationid)

##### error

```ts
error: Error;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:31](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L31)

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:16](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L16)

###### Inherited from

[`OutboxDispatchContext`](#outboxdispatchcontext).[`eventId`](#eventid)

##### eventType

```ts
eventType: string;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:17](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L17)

###### Inherited from

[`OutboxDispatchContext`](#outboxdispatchcontext).[`eventType`](#eventtype)

##### headers

```ts
headers: Record<string, string>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:27](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L27)

###### Inherited from

[`OutboxDispatchContext`](#outboxdispatchcontext).[`headers`](#headers)

##### idempotencyKey

```ts
idempotencyKey: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:24](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L24)

###### Inherited from

[`OutboxDispatchContext`](#outboxdispatchcontext).[`idempotencyKey`](#idempotencykey)

##### maxRetries

```ts
maxRetries: number;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:33](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L33)

###### Overrides

[`OutboxDispatchContext`](#outboxdispatchcontext).[`maxRetries`](#maxretries)

##### partitionKey

```ts
partitionKey: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:23](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L23)

###### Inherited from

[`OutboxDispatchContext`](#outboxdispatchcontext).[`partitionKey`](#partitionkey)

##### record

```ts
record: OutboxRecord;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:15](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L15)

###### Inherited from

[`OutboxDispatchContext`](#outboxdispatchcontext).[`record`](#record)

##### retryCount

```ts
retryCount: number;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:32](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L32)

###### Overrides

[`OutboxDispatchContext`](#outboxdispatchcontext).[`retryCount`](#retrycount)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:18](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L18)

###### Inherited from

[`OutboxDispatchContext`](#outboxdispatchcontext).[`tenantId`](#tenantid)

***

### OutboxRetryOptions

Defined in: [src/interfaces/outbox-options.interface.ts:14](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L14)

#### Properties

##### backoff?

```ts
optional backoff?: "fixed" | "exponential";
```

Defined in: [src/interfaces/outbox-options.interface.ts:16](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L16)

##### initialDelay?

```ts
optional initialDelay?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:17](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L17)

##### maxRetries?

```ts
optional maxRetries?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:15](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L15)

***

### OutboxStats

Defined in: [src/interfaces/outbox-admin.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L3)

#### Properties

##### failed

```ts
failed: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:7](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L7)

##### oldestPendingAgeMs

```ts
oldestPendingAgeMs: number | null;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L8)

##### oldestProcessingAgeMs

```ts
oldestProcessingAgeMs: number | null;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L9)

##### pending

```ts
pending: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L4)

##### processing

```ts
processing: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:5](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L5)

##### sent

```ts
sent: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:6](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L6)

***

### OutboxTenancyOptions

Defined in: [src/interfaces/outbox-tenancy.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-tenancy.interface.ts#L8)

#### Properties

##### provider?

```ts
optional provider?: 
  | OutboxTenantProvider
| Type<OutboxTenantProvider>;
```

Defined in: [src/interfaces/outbox-tenancy.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-tenancy.interface.ts#L9)

***

### OutboxTenantProvider

Defined in: [src/interfaces/outbox-tenancy.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-tenancy.interface.ts#L3)

#### Methods

##### getTenantId()?

```ts
optional getTenantId(): 
  | string
  | Promise<string | null | undefined>
  | null
  | undefined;
```

Defined in: [src/interfaces/outbox-tenancy.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-tenancy.interface.ts#L4)

###### Returns

  \| `string`
  \| `Promise`\<`string` \| `null` \| `undefined`\>
  \| `null`
  \| `undefined`

##### runWithTenant()?

```ts
optional runWithTenant<T>(tenantId, fn): Promise<T>;
```

Defined in: [src/interfaces/outbox-tenancy.interface.ts:5](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-tenancy.interface.ts#L5)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` |
| `fn` | () => `Promise`\<`T`\> |

###### Returns

`Promise`\<`T`\>

***

### OutboxTransport

Defined in: [src/interfaces/outbox-transport.interface.ts:5](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-transport.interface.ts#L5)

#### Methods

##### dispatch()

```ts
dispatch(
   record, 
   handlers, 
context?): Promise<void>;
```

Defined in: [src/interfaces/outbox-transport.interface.ts:6](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-transport.interface.ts#L6)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `record` | [`OutboxRecord`](#outboxrecord) |
| `handlers` | [`OutboxHandler`](#outboxhandler)[] |
| `context?` | [`OutboxHandlerContext`](#outboxhandlercontext) |

###### Returns

`Promise`\<`void`\>

***

### OutboxWakeupOptions

Defined in: [src/interfaces/outbox-wakeup.interface.ts:13](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L13)

#### Properties

##### channel?

```ts
optional channel?: string;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:15](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L15)

##### clientFactory?

```ts
optional clientFactory?: () => 
  | OutboxNotificationClient
  | Promise<OutboxNotificationClient | null>
  | null;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:18](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L18)

###### Returns

  \| [`OutboxNotificationClient`](#outboxnotificationclient)
  \| `Promise`\<[`OutboxNotificationClient`](#outboxnotificationclient) \| `null`\>
  \| `null`

##### connectionString?

```ts
optional connectionString?: string;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:16](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L16)

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:14](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L14)

##### reconnectDelay?

```ts
optional reconnectDelay?: number;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:17](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L17)

## Type Aliases

### OutboxEmitManyEntry

```ts
type OutboxEmitManyEntry = 
  | OutboxEvent
  | {
  event: OutboxEvent;
  options?: OutboxEmitOptions;
};
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:15](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L15)

***

### PrismaLike

```ts
type PrismaLike = PrismaTransactionClient & {
  $executeRawUnsafe?: Promise<number>;
  $queryRawUnsafe?: Promise<T>;
};
```

Defined in: [src/interfaces/prisma-transaction-client.interface.ts:16](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/prisma-transaction-client.interface.ts#L16)

Minimal type for PrismaService instance (used by OutboxPoller for polling queries).

#### Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `$executeRawUnsafe()?` | (`query`, ...`values`) => `Promise`\<`number`\> | [src/interfaces/prisma-transaction-client.interface.ts:17](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/prisma-transaction-client.interface.ts#L17) |
| `$queryRawUnsafe()?` | (`query`, ...`values`) => `Promise`\<`T`\> | [src/interfaces/prisma-transaction-client.interface.ts:18](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/prisma-transaction-client.interface.ts#L18) |

***

### PrismaTransactionClient

```ts
type PrismaTransactionClient = {
  $executeRaw: Promise<number>;
  $executeRawUnsafe?: Promise<number>;
  $queryRaw: Promise<T>;
  $queryRawUnsafe?: Promise<T>;
};
```

Defined in: [src/interfaces/prisma-transaction-client.interface.ts:2](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/prisma-transaction-client.interface.ts#L2)

Minimal type for Prisma interactive transaction client (inside $transaction callback).

#### Methods

##### $executeRaw()

```ts
$executeRaw(query, ...values): Promise<number>;
```

Defined in: [src/interfaces/prisma-transaction-client.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/prisma-transaction-client.interface.ts#L3)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `query` | `TemplateStringsArray` |
| ...`values` | `unknown`[] |

###### Returns

`Promise`\<`number`\>

##### $executeRawUnsafe()?

```ts
optional $executeRawUnsafe(query, ...values): Promise<number>;
```

Defined in: [src/interfaces/prisma-transaction-client.interface.ts:7](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/prisma-transaction-client.interface.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `query` | `string` |
| ...`values` | `unknown`[] |

###### Returns

`Promise`\<`number`\>

##### $queryRaw()

```ts
$queryRaw<T>(query, ...values): Promise<T>;
```

Defined in: [src/interfaces/prisma-transaction-client.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/prisma-transaction-client.interface.ts#L8)

###### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `query` | `TemplateStringsArray` |
| ...`values` | `unknown`[] |

###### Returns

`Promise`\<`T`\>

##### $queryRawUnsafe()?

```ts
optional $queryRawUnsafe<T>(query, ...values): Promise<T>;
```

Defined in: [src/interfaces/prisma-transaction-client.interface.ts:12](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/prisma-transaction-client.interface.ts#L12)

###### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `query` | `string` |
| ...`values` | `unknown`[] |

###### Returns

`Promise`\<`T`\>

## Variables

### OUTBOX\_EVENT\_METADATA

```ts
const OUTBOX_EVENT_METADATA: typeof OUTBOX_EVENT_METADATA;
```

Defined in: [src/outbox.constants.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.constants.ts#L4)

***

### OUTBOX\_OPTIONS

```ts
const OUTBOX_OPTIONS: typeof OUTBOX_OPTIONS;
```

Defined in: [src/outbox.constants.ts:1](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.constants.ts#L1)

***

### OUTBOX\_TENANT\_PROVIDER

```ts
const OUTBOX_TENANT_PROVIDER: typeof OUTBOX_TENANT_PROVIDER;
```

Defined in: [src/outbox.constants.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.constants.ts#L3)

***

### OUTBOX\_TRANSPORT

```ts
const OUTBOX_TRANSPORT: typeof OUTBOX_TRANSPORT;
```

Defined in: [src/outbox.constants.ts:2](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.constants.ts#L2)

## Functions

### OnOutboxEvent()

```ts
function OnOutboxEvent(...events): MethodDecorator;
```

Defined in: [src/outbox.decorator.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.decorator.ts#L9)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`events` | `OutboxEventClass`[] |

#### Returns

`MethodDecorator`
