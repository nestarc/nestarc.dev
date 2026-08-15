# @nestarc/outbox

## Classes

<a id="api-localtransport"></a>

### LocalTransport

Defined in: [src/transports/local.transport.ts:10](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/transports/local.transport.ts#L10)

#### Implements

- [`OutboxTransport`](#api-outboxtransport)

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new LocalTransport(tenantProvider?): LocalTransport;
```

Defined in: [src/transports/local.transport.ts:11](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/transports/local.transport.ts#L11)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantProvider?` | [`OutboxTenantProvider`](#api-outboxtenantprovider) \| `null` |

###### Returns

[`LocalTransport`](#api-localtransport)

#### Methods

<a id="api-dispatch"></a>

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
| `record` | [`OutboxRecord`](#api-outboxrecord) |
| `handlers` | [`OutboxHandler`](#api-outboxhandler)[] |
| `context` | [`OutboxHandlerContext`](#api-outboxhandlercontext) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`OutboxTransport`](#api-outboxtransport).[`dispatch`](#api-dispatch-1)

***

<a id="api-outboxadminservice"></a>

### OutboxAdminService

Defined in: [src/outbox.admin.service.ts:38](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.admin.service.ts#L38)

#### Constructors

<a id="api-constructor-1"></a>

##### Constructor

```ts
new OutboxAdminService(options): OutboxAdminService;
```

Defined in: [src/outbox.admin.service.ts:39](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.admin.service.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxOptions`](#api-outboxoptions) |

###### Returns

[`OutboxAdminService`](#api-outboxadminservice)

#### Methods

<a id="api-getbyid"></a>

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

`Promise`\<[`OutboxRecord`](#api-outboxrecord) \| `null`\>

<a id="api-gethealth"></a>

##### getHealth()

```ts
getHealth(options?): Promise<OutboxHealth>;
```

Defined in: [src/outbox.admin.service.ts:215](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.admin.service.ts#L215)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxHealthOptions`](#api-outboxhealthoptions) |

###### Returns

`Promise`\<[`OutboxHealth`](#api-outboxhealth)\>

<a id="api-getstats"></a>

##### getStats()

```ts
getStats(): Promise<OutboxStats>;
```

Defined in: [src/outbox.admin.service.ts:41](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.admin.service.ts#L41)

###### Returns

`Promise`\<[`OutboxStats`](#api-outboxstats)\>

<a id="api-list"></a>

##### list()

```ts
list(options?): Promise<OutboxRecord[]>;
```

Defined in: [src/outbox.admin.service.ts:77](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.admin.service.ts#L77)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxListOptions`](#api-outboxlistoptions) |

###### Returns

`Promise`\<[`OutboxRecord`](#api-outboxrecord)[]\>

<a id="api-markfailed"></a>

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

<a id="api-purgesent"></a>

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

<a id="api-retry"></a>

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

<a id="api-retrymany"></a>

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

<a id="api-outboxemitter"></a>

### OutboxEmitter

Defined in: [src/outbox.emitter.ts:37](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.emitter.ts#L37)

#### Constructors

<a id="api-constructor-2"></a>

##### Constructor

```ts
new OutboxEmitter(options, tenantProvider?): OutboxEmitter;
```

Defined in: [src/outbox.emitter.ts:41](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.emitter.ts#L41)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxOptions`](#api-outboxoptions) |
| `tenantProvider?` | [`OutboxTenantProvider`](#api-outboxtenantprovider) \| `null` |

###### Returns

[`OutboxEmitter`](#api-outboxemitter)

#### Methods

<a id="api-emit"></a>

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
| `tx` | [`PrismaTransactionClient`](#api-prismatransactionclient) |
| `event` | [`OutboxEvent`](#api-abstract-outboxevent) |
| `options?` | [`OutboxEmitOptions`](#api-outboxemitoptions) |

###### Returns

`Promise`\<`void`\>

<a id="api-emitmany"></a>

##### emitMany()

```ts
emitMany(tx, events): Promise<void>;
```

Defined in: [src/outbox.emitter.ts:92](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.emitter.ts#L92)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`PrismaTransactionClient`](#api-prismatransactionclient) |
| `events` | [`OutboxEmitManyEntry`](#api-outboxemitmanyentry)[] |

###### Returns

`Promise`\<`void`\>

***

<a id="api-abstract-outboxevent"></a>

### `abstract` OutboxEvent

Defined in: [src/outbox.event.ts:1](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.event.ts#L1)

#### Constructors

<a id="api-constructor-3"></a>

##### Constructor

```ts
new OutboxEvent(): OutboxEvent;
```

###### Returns

[`OutboxEvent`](#api-abstract-outboxevent)

#### Methods

<a id="api-geteventtype"></a>

##### getEventType()

```ts
getEventType(): string;
```

Defined in: [src/outbox.event.ts:10](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.event.ts#L10)

###### Returns

`string`

<a id="api-topayload"></a>

##### toPayload()

```ts
toPayload(): Record<string, unknown>;
```

Defined in: [src/outbox.event.ts:2](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.event.ts#L2)

###### Returns

`Record`\<`string`, `unknown`\>

***

<a id="api-outboxlistener"></a>

### OutboxListener

Defined in: [src/outbox.listener.ts:24](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.listener.ts#L24)

#### Implements

- `OnModuleInit`
- `OnApplicationShutdown`

#### Constructors

<a id="api-constructor-4"></a>

##### Constructor

```ts
new OutboxListener(options, poller): OutboxListener;
```

Defined in: [src/outbox.listener.ts:30](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.listener.ts#L30)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxOptions`](#api-outboxoptions) |
| `poller` | `Pick`\<`OutboxPoller`, `"poll"`\> |

###### Returns

[`OutboxListener`](#api-outboxlistener)

#### Methods

<a id="api-onapplicationshutdown"></a>

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

<a id="api-onmoduleinit"></a>

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

<a id="api-outboxmodule"></a>

### OutboxModule

Defined in: [src/outbox.module.ts:28](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.module.ts#L28)

#### Constructors

<a id="api-constructor-5"></a>

##### Constructor

```ts
new OutboxModule(): OutboxModule;
```

###### Returns

[`OutboxModule`](#api-outboxmodule)

#### Methods

<a id="api-forroot"></a>

##### forRoot()

```ts
static forRoot(options): DynamicModule;
```

Defined in: [src/outbox.module.ts:29](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.module.ts#L29)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxOptions`](#api-outboxoptions) |

###### Returns

`DynamicModule`

<a id="api-forrootasync"></a>

##### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [src/outbox.module.ts:79](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.module.ts#L79)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxAsyncOptions`](#api-outboxasyncoptions) |

###### Returns

`DynamicModule`

## Interfaces

<a id="api-outboxasyncoptions"></a>

### OutboxAsyncOptions

Defined in: [src/interfaces/outbox-options.interface.ts:44](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L44)

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

<a id="api-inject"></a>

##### inject?

```ts
optional inject?: any[];
```

Defined in: [src/interfaces/outbox-options.interface.ts:45](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L45)

<a id="api-isglobal"></a>

##### isGlobal?

```ts
optional isGlobal?: boolean;
```

Defined in: [src/interfaces/outbox-options.interface.ts:51](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L51)

<a id="api-transport"></a>

##### transport?

```ts
optional transport?: Type<
  | OutboxTransport
| OutboxPublisher>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:50](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L50)

Custom transport class. Defaults to LocalTransport.

<a id="api-useclass"></a>

##### useClass?

```ts
optional useClass?: Type<OutboxOptionsFactory>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:47](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L47)

<a id="api-useexisting"></a>

##### useExisting?

```ts
optional useExisting?: Type<OutboxOptionsFactory>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:48](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L48)

<a id="api-usefactory"></a>

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

  \| [`OutboxOptions`](#api-outboxoptions)
  \| `Promise`\<[`OutboxOptions`](#api-outboxoptions)\>

***

<a id="api-outboxdeliveryoptions"></a>

### OutboxDeliveryOptions

Defined in: [src/interfaces/outbox-options.interface.ts:20](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L20)

#### Properties

<a id="api-mode"></a>

##### mode?

```ts
optional mode?: "local" | "publisher";
```

Defined in: [src/interfaces/outbox-options.interface.ts:21](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L21)

***

<a id="api-outboxdispatchcontext"></a>

### OutboxDispatchContext

Defined in: [src/interfaces/outbox-hooks.interface.ts:14](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L14)

#### Extended by

- [`OutboxRetryContext`](#api-outboxretrycontext)

#### Properties

<a id="api-aggregateid"></a>

##### aggregateId

```ts
aggregateId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:22](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L22)

<a id="api-aggregatetype"></a>

##### aggregateType

```ts
aggregateType: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:21](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L21)

<a id="api-causationid"></a>

##### causationId

```ts
causationId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:26](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L26)

<a id="api-correlationid"></a>

##### correlationId

```ts
correlationId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:25](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L25)

<a id="api-eventid"></a>

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:16](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L16)

<a id="api-eventtype"></a>

##### eventType

```ts
eventType: string;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:17](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L17)

<a id="api-headers"></a>

##### headers

```ts
headers: Record<string, string>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:27](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L27)

<a id="api-idempotencykey"></a>

##### idempotencyKey

```ts
idempotencyKey: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:24](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L24)

<a id="api-maxretries"></a>

##### maxRetries

```ts
maxRetries: number;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:20](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L20)

<a id="api-partitionkey"></a>

##### partitionKey

```ts
partitionKey: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:23](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L23)

<a id="api-record"></a>

##### record

```ts
record: OutboxRecord;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:15](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L15)

<a id="api-retrycount"></a>

##### retryCount

```ts
retryCount: number;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:19](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L19)

<a id="api-tenantid"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:18](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L18)

***

<a id="api-outboxemitcontext"></a>

### OutboxEmitContext

Defined in: [src/interfaces/outbox-hooks.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L4)

#### Extends

- `Required`\<[`OutboxEmitOptions`](#api-outboxemitoptions)\>

#### Properties

<a id="api-aggregateid-1"></a>

##### aggregateId

```ts
aggregateId: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:6](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L6)

###### Inherited from

[`OutboxEmitOptions`](#api-outboxemitoptions).[`aggregateId`](#api-aggregateid-2)

<a id="api-aggregatetype-1"></a>

##### aggregateType

```ts
aggregateType: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:5](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L5)

###### Inherited from

[`OutboxEmitOptions`](#api-outboxemitoptions).[`aggregateType`](#api-aggregatetype-2)

<a id="api-causationid-1"></a>

##### causationId

```ts
causationId: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:10](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L10)

###### Inherited from

[`OutboxEmitOptions`](#api-outboxemitoptions).[`causationId`](#api-causationid-2)

<a id="api-correlationid-1"></a>

##### correlationId

```ts
correlationId: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L9)

###### Inherited from

[`OutboxEmitOptions`](#api-outboxemitoptions).[`correlationId`](#api-correlationid-2)

<a id="api-eventtype-1"></a>

##### eventType

```ts
eventType: string;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:5](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L5)

<a id="api-headers-1"></a>

##### headers

```ts
headers: Record<string, string>;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:11](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L11)

###### Inherited from

[`OutboxEmitOptions`](#api-outboxemitoptions).[`headers`](#api-headers-2)

<a id="api-idempotencykey-1"></a>

##### idempotencyKey

```ts
idempotencyKey: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L8)

###### Inherited from

[`OutboxEmitOptions`](#api-outboxemitoptions).[`idempotencyKey`](#api-idempotencykey-2)

<a id="api-occurredat"></a>

##### occurredAt

```ts
occurredAt: Date | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:12](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L12)

###### Inherited from

[`OutboxEmitOptions`](#api-outboxemitoptions).[`occurredAt`](#api-occurredat-1)

<a id="api-partitionkey-1"></a>

##### partitionKey

```ts
partitionKey: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:7](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L7)

###### Inherited from

[`OutboxEmitOptions`](#api-outboxemitoptions).[`partitionKey`](#api-partitionkey-2)

<a id="api-payload"></a>

##### payload

```ts
payload: Record<string, unknown>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:6](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L6)

<a id="api-tenantid-1"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L4)

###### Inherited from

[`OutboxEmitOptions`](#api-outboxemitoptions).[`tenantId`](#api-tenantid-2)

***

<a id="api-outboxemitoptions"></a>

### OutboxEmitOptions

Defined in: [src/interfaces/outbox-emit-options.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L3)

#### Properties

<a id="api-aggregateid-2"></a>

##### aggregateId?

```ts
optional aggregateId?: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:6](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L6)

<a id="api-aggregatetype-2"></a>

##### aggregateType?

```ts
optional aggregateType?: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:5](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L5)

<a id="api-causationid-2"></a>

##### causationId?

```ts
optional causationId?: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:10](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L10)

<a id="api-correlationid-2"></a>

##### correlationId?

```ts
optional correlationId?: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L9)

<a id="api-headers-2"></a>

##### headers?

```ts
optional headers?: Record<string, string>;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:11](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L11)

<a id="api-idempotencykey-2"></a>

##### idempotencyKey?

```ts
optional idempotencyKey?: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L8)

<a id="api-occurredat-1"></a>

##### occurredAt?

```ts
optional occurredAt?: Date | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:12](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L12)

<a id="api-partitionkey-2"></a>

##### partitionKey?

```ts
optional partitionKey?: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:7](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L7)

<a id="api-tenantid-2"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-emit-options.interface.ts#L4)

***

<a id="api-outboxhandler"></a>

### OutboxHandler

Defined in: [src/interfaces/outbox-handler.interface.ts:1](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler.interface.ts#L1)

#### Properties

<a id="api-eventtypes"></a>

##### eventTypes

```ts
eventTypes: string[];
```

Defined in: [src/interfaces/outbox-handler.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler.interface.ts#L4)

<a id="api-instance"></a>

##### instance

```ts
instance: Record<string, any>;
```

Defined in: [src/interfaces/outbox-handler.interface.ts:2](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler.interface.ts#L2)

<a id="api-methodname"></a>

##### methodName

```ts
methodName: string;
```

Defined in: [src/interfaces/outbox-handler.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler.interface.ts#L3)

***

<a id="api-outboxhandlercontext"></a>

### OutboxHandlerContext

Defined in: [src/interfaces/outbox-handler-context.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler-context.interface.ts#L3)

#### Properties

<a id="api-eventid-1"></a>

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:5](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler-context.interface.ts#L5)

<a id="api-eventtype-2"></a>

##### eventType

```ts
eventType: string;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:6](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler-context.interface.ts#L6)

<a id="api-headers-3"></a>

##### headers

```ts
headers: Record<string, string>;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler-context.interface.ts#L9)

<a id="api-record-1"></a>

##### record

```ts
record: OutboxRecord;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler-context.interface.ts#L4)

<a id="api-retrycount-1"></a>

##### retryCount

```ts
retryCount: number;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler-context.interface.ts#L8)

<a id="api-tenantid-3"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:7](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-handler-context.interface.ts#L7)

***

<a id="api-outboxhealth"></a>

### OutboxHealth

Defined in: [src/interfaces/outbox-admin.interface.ts:26](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L26)

#### Properties

<a id="api-ok"></a>

##### ok

```ts
ok: boolean;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:27](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L27)

<a id="api-reasons"></a>

##### reasons

```ts
reasons: string[];
```

Defined in: [src/interfaces/outbox-admin.interface.ts:29](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L29)

<a id="api-stats"></a>

##### stats

```ts
stats: OutboxStats;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:28](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L28)

***

<a id="api-outboxhealthoptions"></a>

### OutboxHealthOptions

Defined in: [src/interfaces/outbox-admin.interface.ts:21](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L21)

#### Properties

<a id="api-maxfailedcount"></a>

##### maxFailedCount?

```ts
optional maxFailedCount?: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:23](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L23)

<a id="api-maxoldestpendingagems"></a>

##### maxOldestPendingAgeMs?

```ts
optional maxOldestPendingAgeMs?: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:22](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L22)

***

<a id="api-outboxhooks"></a>

### OutboxHooks

Defined in: [src/interfaces/outbox-hooks.interface.ts:36](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L36)

#### Methods

<a id="api-ondeadletter"></a>

##### onDeadLetter()?

```ts
optional onDeadLetter(context): void | Promise<void>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:50](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L50)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`OutboxRetryContext`](#api-outboxretrycontext) |

###### Returns

`void` \| `Promise`\<`void`\>

<a id="api-ondispatchfailure"></a>

##### onDispatchFailure()?

```ts
optional onDispatchFailure(context): void | Promise<void>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:43](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L43)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`OutboxDispatchContext`](#api-outboxdispatchcontext) & \{ `durationMs`: `number`; `error`: `Error`; \} |

###### Returns

`void` \| `Promise`\<`void`\>

<a id="api-ondispatchstart"></a>

##### onDispatchStart()?

```ts
optional onDispatchStart(context): void | Promise<void>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:39](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`OutboxDispatchContext`](#api-outboxdispatchcontext) |

###### Returns

`void` \| `Promise`\<`void`\>

<a id="api-ondispatchsuccess"></a>

##### onDispatchSuccess()?

```ts
optional onDispatchSuccess(context): void | Promise<void>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:40](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L40)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`OutboxDispatchContext`](#api-outboxdispatchcontext) & \{ `durationMs`: `number`; \} |

###### Returns

`void` \| `Promise`\<`void`\>

<a id="api-onemit"></a>

##### onEmit()?

```ts
optional onEmit(context): void | Promise<void>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:37](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`OutboxEmitContext`](#api-outboxemitcontext) |

###### Returns

`void` \| `Promise`\<`void`\>

<a id="api-onpollstart"></a>

##### onPollStart()?

```ts
optional onPollStart(context): void | Promise<void>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:38](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L38)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`OutboxPollContext`](#api-outboxpollcontext) |

###### Returns

`void` \| `Promise`\<`void`\>

<a id="api-onretryscheduled"></a>

##### onRetryScheduled()?

```ts
optional onRetryScheduled(context): void | Promise<void>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:49](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L49)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`OutboxRetryContext`](#api-outboxretrycontext) |

###### Returns

`void` \| `Promise`\<`void`\>

***

<a id="api-outboxlistoptions"></a>

### OutboxListOptions

Defined in: [src/interfaces/outbox-admin.interface.ts:12](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L12)

#### Properties

<a id="api-after"></a>

##### after?

```ts
optional after?: Date;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:18](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L18)

<a id="api-before"></a>

##### before?

```ts
optional before?: Date;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:17](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L17)

<a id="api-eventtype-3"></a>

##### eventType?

```ts
optional eventType?: string;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:14](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L14)

<a id="api-limit"></a>

##### limit?

```ts
optional limit?: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:16](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L16)

<a id="api-status"></a>

##### status?

```ts
optional status?: "PENDING" | "PROCESSING" | "SENT" | "FAILED";
```

Defined in: [src/interfaces/outbox-admin.interface.ts:13](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L13)

<a id="api-tenantid-4"></a>

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:15](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L15)

***

<a id="api-outboxnotification"></a>

### OutboxNotification

Defined in: [src/interfaces/outbox-wakeup.interface.ts:1](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L1)

#### Properties

<a id="api-channel"></a>

##### channel

```ts
channel: string;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:2](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L2)

<a id="api-payload-1"></a>

##### payload?

```ts
optional payload?: string;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L3)

***

<a id="api-outboxnotificationclient"></a>

### OutboxNotificationClient

Defined in: [src/interfaces/outbox-wakeup.interface.ts:6](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L6)

#### Methods

<a id="api-connect"></a>

##### connect()

```ts
connect(): Promise<void>;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:7](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L7)

###### Returns

`Promise`\<`void`\>

<a id="api-end"></a>

##### end()

```ts
end(): Promise<void>;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L9)

###### Returns

`Promise`\<`void`\>

<a id="api-on"></a>

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

<a id="api-query"></a>

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

<a id="api-outboxoptions"></a>

### OutboxOptions

Defined in: [src/interfaces/outbox-options.interface.ts:24](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L24)

#### Properties

<a id="api-delivery"></a>

##### delivery?

```ts
optional delivery?: OutboxDeliveryOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:35](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L35)

<a id="api-events"></a>

##### events?

```ts
optional events?: Type<any>[];
```

Defined in: [src/interfaces/outbox-options.interface.ts:39](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L39)

<a id="api-hooks"></a>

##### hooks?

```ts
optional hooks?: OutboxHooks;
```

Defined in: [src/interfaces/outbox-options.interface.ts:37](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L37)

<a id="api-isglobal-1"></a>

##### isGlobal?

```ts
optional isGlobal?: boolean;
```

Defined in: [src/interfaces/outbox-options.interface.ts:40](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L40)

<a id="api-polling"></a>

##### polling?

```ts
optional polling?: OutboxPollingOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:31](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L31)

<a id="api-prisma"></a>

##### prisma

```ts
prisma: any;
```

Defined in: [src/interfaces/outbox-options.interface.ts:30](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L30)

forRoot: PrismaService class reference (resolved via DI, must be in a

###### Global

module).
forRootAsync: resolved PrismaService instance from the factory.
The instance must satisfy [PrismaLike](#api-prismalike) ($executeRaw, $queryRaw).

<a id="api-retry-1"></a>

##### retry?

```ts
optional retry?: OutboxRetryOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:32](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L32)

<a id="api-stuckthreshold"></a>

##### stuckThreshold?

```ts
optional stuckThreshold?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:41](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L41)

<a id="api-tenancy"></a>

##### tenancy?

```ts
optional tenancy?: OutboxTenancyOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:36](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L36)

<a id="api-transport-1"></a>

##### transport?

```ts
optional transport?: Type<
  | OutboxTransport
| OutboxPublisher>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:34](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L34)

Custom transport class. Defaults to LocalTransport (in-process handler invocation).

<a id="api-wakeup"></a>

##### wakeup?

```ts
optional wakeup?: OutboxWakeupOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:38](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L38)

***

<a id="api-outboxoptionsfactory"></a>

### OutboxOptionsFactory

Defined in: [src/interfaces/outbox-options.interface.ts:54](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L54)

#### Methods

<a id="api-createoutboxoptions"></a>

##### createOutboxOptions()

```ts
createOutboxOptions():
  | OutboxOptions
| Promise<OutboxOptions>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:55](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L55)

###### Returns

  \| [`OutboxOptions`](#api-outboxoptions)
  \| `Promise`\<[`OutboxOptions`](#api-outboxoptions)\>

***

<a id="api-outboxpollcontext"></a>

### OutboxPollContext

Defined in: [src/interfaces/outbox-hooks.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L9)

#### Properties

<a id="api-batchsize"></a>

##### batchSize

```ts
batchSize: number;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:10](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L10)

<a id="api-deliverymode"></a>

##### deliveryMode

```ts
deliveryMode: "local" | "publisher";
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:11](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L11)

***

<a id="api-outboxpollingoptions"></a>

### OutboxPollingOptions

Defined in: [src/interfaces/outbox-options.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L8)

#### Properties

<a id="api-batchsize-1"></a>

##### batchSize?

```ts
optional batchSize?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:11](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L11)

<a id="api-enabled"></a>

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/outbox-options.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L9)

<a id="api-interval"></a>

##### interval?

```ts
optional interval?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:10](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L10)

***

<a id="api-outboxpublisher"></a>

### OutboxPublisher

Defined in: [src/interfaces/outbox-publisher.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-publisher.interface.ts#L3)

#### Methods

<a id="api-publish"></a>

##### publish()

```ts
publish(record): Promise<void>;
```

Defined in: [src/interfaces/outbox-publisher.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-publisher.interface.ts#L4)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `record` | [`OutboxRecord`](#api-outboxrecord) |

###### Returns

`Promise`\<`void`\>

***

<a id="api-outboxrecord"></a>

### OutboxRecord

Defined in: [src/interfaces/outbox-record.interface.ts:1](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L1)

#### Properties

<a id="api-aggregateid-3"></a>

##### aggregateId

```ts
aggregateId: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:14](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L14)

<a id="api-aggregatetype-3"></a>

##### aggregateType

```ts
aggregateType: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:13](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L13)

<a id="api-causationid-3"></a>

##### causationId

```ts
causationId: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:18](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L18)

<a id="api-correlationid-3"></a>

##### correlationId

```ts
correlationId: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:17](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L17)

<a id="api-createdat"></a>

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/outbox-record.interface.ts:6](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L6)

<a id="api-eventtype-4"></a>

##### eventType

```ts
eventType: string;
```

Defined in: [src/interfaces/outbox-record.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L3)

<a id="api-headers-4"></a>

##### headers

```ts
headers: Record<string, string>;
```

Defined in: [src/interfaces/outbox-record.interface.ts:19](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L19)

<a id="api-id"></a>

##### id

```ts
id: string;
```

Defined in: [src/interfaces/outbox-record.interface.ts:2](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L2)

<a id="api-idempotencykey-3"></a>

##### idempotencyKey

```ts
idempotencyKey: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:16](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L16)

<a id="api-lasterror"></a>

##### lastError

```ts
lastError: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:11](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L11)

<a id="api-maxretries-1"></a>

##### maxRetries

```ts
maxRetries: number;
```

Defined in: [src/interfaces/outbox-record.interface.ts:10](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L10)

<a id="api-occurredat-2"></a>

##### occurredAt

```ts
occurredAt: Date;
```

Defined in: [src/interfaces/outbox-record.interface.ts:20](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L20)

<a id="api-partitionkey-3"></a>

##### partitionKey

```ts
partitionKey: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:15](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L15)

<a id="api-payload-2"></a>

##### payload

```ts
payload: Record<string, unknown>;
```

Defined in: [src/interfaces/outbox-record.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L4)

<a id="api-processedat"></a>

##### processedAt

```ts
processedAt: Date | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L8)

<a id="api-retrycount-2"></a>

##### retryCount

```ts
retryCount: number;
```

Defined in: [src/interfaces/outbox-record.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L9)

<a id="api-status-1"></a>

##### status

```ts
status: "PENDING" | "PROCESSING" | "SENT" | "FAILED";
```

Defined in: [src/interfaces/outbox-record.interface.ts:5](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L5)

<a id="api-tenantid-5"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:12](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L12)

<a id="api-updatedat"></a>

##### updatedAt

```ts
updatedAt: Date;
```

Defined in: [src/interfaces/outbox-record.interface.ts:7](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-record.interface.ts#L7)

***

<a id="api-outboxretrycontext"></a>

### OutboxRetryContext

Defined in: [src/interfaces/outbox-hooks.interface.ts:30](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L30)

#### Extends

- [`OutboxDispatchContext`](#api-outboxdispatchcontext)

#### Properties

<a id="api-aggregateid-4"></a>

##### aggregateId

```ts
aggregateId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:22](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L22)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`aggregateId`](#api-aggregateid)

<a id="api-aggregatetype-4"></a>

##### aggregateType

```ts
aggregateType: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:21](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L21)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`aggregateType`](#api-aggregatetype)

<a id="api-causationid-4"></a>

##### causationId

```ts
causationId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:26](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L26)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`causationId`](#api-causationid)

<a id="api-correlationid-4"></a>

##### correlationId

```ts
correlationId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:25](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L25)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`correlationId`](#api-correlationid)

<a id="api-error"></a>

##### error

```ts
error: Error;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:31](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L31)

<a id="api-eventid-2"></a>

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:16](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L16)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`eventId`](#api-eventid)

<a id="api-eventtype-5"></a>

##### eventType

```ts
eventType: string;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:17](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L17)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`eventType`](#api-eventtype)

<a id="api-headers-5"></a>

##### headers

```ts
headers: Record<string, string>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:27](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L27)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`headers`](#api-headers)

<a id="api-idempotencykey-4"></a>

##### idempotencyKey

```ts
idempotencyKey: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:24](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L24)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`idempotencyKey`](#api-idempotencykey)

<a id="api-maxretries-2"></a>

##### maxRetries

```ts
maxRetries: number;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:33](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L33)

###### Overrides

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`maxRetries`](#api-maxretries)

<a id="api-partitionkey-4"></a>

##### partitionKey

```ts
partitionKey: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:23](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L23)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`partitionKey`](#api-partitionkey)

<a id="api-record-2"></a>

##### record

```ts
record: OutboxRecord;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:15](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L15)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`record`](#api-record)

<a id="api-retrycount-3"></a>

##### retryCount

```ts
retryCount: number;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:32](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L32)

###### Overrides

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`retryCount`](#api-retrycount)

<a id="api-tenantid-6"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:18](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-hooks.interface.ts#L18)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`tenantId`](#api-tenantid)

***

<a id="api-outboxretryoptions"></a>

### OutboxRetryOptions

Defined in: [src/interfaces/outbox-options.interface.ts:14](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L14)

#### Properties

<a id="api-backoff"></a>

##### backoff?

```ts
optional backoff?: "fixed" | "exponential";
```

Defined in: [src/interfaces/outbox-options.interface.ts:16](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L16)

<a id="api-initialdelay"></a>

##### initialDelay?

```ts
optional initialDelay?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:17](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L17)

<a id="api-maxretries-3"></a>

##### maxRetries?

```ts
optional maxRetries?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:15](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-options.interface.ts#L15)

***

<a id="api-outboxstats"></a>

### OutboxStats

Defined in: [src/interfaces/outbox-admin.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L3)

#### Properties

<a id="api-failed"></a>

##### failed

```ts
failed: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:7](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L7)

<a id="api-oldestpendingagems"></a>

##### oldestPendingAgeMs

```ts
oldestPendingAgeMs: number | null;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L8)

<a id="api-oldestprocessingagems"></a>

##### oldestProcessingAgeMs

```ts
oldestProcessingAgeMs: number | null;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L9)

<a id="api-pending"></a>

##### pending

```ts
pending: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L4)

<a id="api-processing"></a>

##### processing

```ts
processing: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:5](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L5)

<a id="api-sent"></a>

##### sent

```ts
sent: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:6](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-admin.interface.ts#L6)

***

<a id="api-outboxtenancyoptions"></a>

### OutboxTenancyOptions

Defined in: [src/interfaces/outbox-tenancy.interface.ts:8](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-tenancy.interface.ts#L8)

#### Properties

<a id="api-provider"></a>

##### provider?

```ts
optional provider?:
  | OutboxTenantProvider
| Type<OutboxTenantProvider>;
```

Defined in: [src/interfaces/outbox-tenancy.interface.ts:9](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-tenancy.interface.ts#L9)

***

<a id="api-outboxtenantprovider"></a>

### OutboxTenantProvider

Defined in: [src/interfaces/outbox-tenancy.interface.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-tenancy.interface.ts#L3)

#### Methods

<a id="api-gettenantid"></a>

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

<a id="api-runwithtenant"></a>

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

<a id="api-outboxtransport"></a>

### OutboxTransport

Defined in: [src/interfaces/outbox-transport.interface.ts:5](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-transport.interface.ts#L5)

#### Methods

<a id="api-dispatch-1"></a>

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
| `record` | [`OutboxRecord`](#api-outboxrecord) |
| `handlers` | [`OutboxHandler`](#api-outboxhandler)[] |
| `context?` | [`OutboxHandlerContext`](#api-outboxhandlercontext) |

###### Returns

`Promise`\<`void`\>

***

<a id="api-outboxwakeupoptions"></a>

### OutboxWakeupOptions

Defined in: [src/interfaces/outbox-wakeup.interface.ts:13](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L13)

#### Properties

<a id="api-channel-1"></a>

##### channel?

```ts
optional channel?: string;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:15](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L15)

<a id="api-clientfactory"></a>

##### clientFactory?

```ts
optional clientFactory?: () =>
  | OutboxNotificationClient
  | Promise<OutboxNotificationClient | null>
  | null;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:18](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L18)

###### Returns

  \| [`OutboxNotificationClient`](#api-outboxnotificationclient)
  \| `Promise`\<[`OutboxNotificationClient`](#api-outboxnotificationclient) \| `null`\>
  \| `null`

<a id="api-connectionstring"></a>

##### connectionString?

```ts
optional connectionString?: string;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:16](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L16)

<a id="api-enabled-1"></a>

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:14](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L14)

<a id="api-reconnectdelay"></a>

##### reconnectDelay?

```ts
optional reconnectDelay?: number;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:17](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/interfaces/outbox-wakeup.interface.ts#L17)

## Type Aliases

<a id="api-outboxemitmanyentry"></a>

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

<a id="api-prismalike"></a>

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

<a id="api-prismatransactionclient"></a>

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

<a id="api-executeraw"></a>

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

<a id="api-executerawunsafe"></a>

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

<a id="api-queryraw"></a>

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

<a id="api-queryrawunsafe"></a>

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

<a id="api-outbox_event_metadata"></a>

### OUTBOX\_EVENT\_METADATA

```ts
const OUTBOX_EVENT_METADATA: typeof OUTBOX_EVENT_METADATA;
```

Defined in: [src/outbox.constants.ts:4](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.constants.ts#L4)

***

<a id="api-outbox_options"></a>

### OUTBOX\_OPTIONS

```ts
const OUTBOX_OPTIONS: typeof OUTBOX_OPTIONS;
```

Defined in: [src/outbox.constants.ts:1](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.constants.ts#L1)

***

<a id="api-outbox_tenant_provider"></a>

### OUTBOX\_TENANT\_PROVIDER

```ts
const OUTBOX_TENANT_PROVIDER: typeof OUTBOX_TENANT_PROVIDER;
```

Defined in: [src/outbox.constants.ts:3](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.constants.ts#L3)

***

<a id="api-outbox_transport"></a>

### OUTBOX\_TRANSPORT

```ts
const OUTBOX_TRANSPORT: typeof OUTBOX_TRANSPORT;
```

Defined in: [src/outbox.constants.ts:2](https://github.com/nestarc/outbox/blob/44f68b2cbe40c86c1085fc2e061862f98852338c/src/outbox.constants.ts#L2)

## Functions

<a id="api-onoutboxevent"></a>

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
