# index

## Classes

### CascadeDmmfMissingError

Defined in: [src/errors/cascade-dmmf-missing.error.ts:1](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/errors/cascade-dmmf-missing.error.ts#L1)

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new CascadeDmmfMissingError(): CascadeDmmfMissingError;
```

Defined in: [src/errors/cascade-dmmf-missing.error.ts:2](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/errors/cascade-dmmf-missing.error.ts#L2)

###### Returns

[`CascadeDmmfMissingError`](#cascadedmmfmissingerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

###### Inherited from

```ts
Error.cause
```

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
name: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1074

###### Inherited from

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

***

### CascadeRelationNotFoundError

Defined in: [src/errors/cascade-relation-not-found.error.ts:1](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/errors/cascade-relation-not-found.error.ts#L1)

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new CascadeRelationNotFoundError(parent, child): CascadeRelationNotFoundError;
```

Defined in: [src/errors/cascade-relation-not-found.error.ts:2](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/errors/cascade-relation-not-found.error.ts#L2)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `parent` | `string` |
| `child` | `string` |

###### Returns

[`CascadeRelationNotFoundError`](#cascaderelationnotfounderror)

###### Overrides

```ts
Error.constructor
```

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

###### Inherited from

```ts
Error.cause
```

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
name: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1074

###### Inherited from

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

***

### PurgedEvent

Defined in: [src/events/soft-delete.events.ts:22](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L22)

#### Constructors

##### Constructor

```ts
new PurgedEvent(
   model, 
   count, 
   olderThan): PurgedEvent;
```

Defined in: [src/events/soft-delete.events.ts:25](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L25)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `model` | `string` |
| `count` | `number` |
| `olderThan` | `Date` |

###### Returns

[`PurgedEvent`](#purgedevent)

#### Properties

##### count

```ts
readonly count: number;
```

Defined in: [src/events/soft-delete.events.ts:27](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L27)

##### EVENT\_NAME

```ts
readonly static EVENT_NAME: "soft-delete.purged";
```

Defined in: [src/events/soft-delete.events.ts:23](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L23)

##### model

```ts
readonly model: string;
```

Defined in: [src/events/soft-delete.events.ts:26](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L26)

##### olderThan

```ts
readonly olderThan: Date;
```

Defined in: [src/events/soft-delete.events.ts:28](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L28)

***

### RestoredEvent

Defined in: [src/events/soft-delete.events.ts:12](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L12)

#### Constructors

##### Constructor

```ts
new RestoredEvent(
   model, 
   where, 
   actorId?): RestoredEvent;
```

Defined in: [src/events/soft-delete.events.ts:15](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L15)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `model` | `string` | `undefined` |
| `where` | `Record`\<`string`, `unknown`\> | `undefined` |
| `actorId` | `string` \| `null` | `null` |

###### Returns

[`RestoredEvent`](#restoredevent)

#### Properties

##### actorId

```ts
readonly actorId: string | null = null;
```

Defined in: [src/events/soft-delete.events.ts:18](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L18)

##### EVENT\_NAME

```ts
readonly static EVENT_NAME: "soft-delete.restored";
```

Defined in: [src/events/soft-delete.events.ts:13](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L13)

##### model

```ts
readonly model: string;
```

Defined in: [src/events/soft-delete.events.ts:16](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L16)

##### where

```ts
readonly where: Record<string, unknown>;
```

Defined in: [src/events/soft-delete.events.ts:17](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L17)

***

### SoftDeleteContext

Defined in: [src/services/soft-delete-context.ts:4](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/services/soft-delete-context.ts#L4)

#### Constructors

##### Constructor

```ts
new SoftDeleteContext(): SoftDeleteContext;
```

###### Returns

[`SoftDeleteContext`](#softdeletecontext)

#### Methods

##### getActorId()

```ts
static getActorId(): string | null;
```

Defined in: [src/services/soft-delete-context.ts:44](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/services/soft-delete-context.ts#L44)

###### Returns

`string` \| `null`

##### getFilterMode()

```ts
static getFilterMode(): SoftDeleteFilterMode;
```

Defined in: [src/services/soft-delete-context.ts:36](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/services/soft-delete-context.ts#L36)

###### Returns

[`SoftDeleteFilterMode`](#softdeletefiltermode)

##### isSkipped()

```ts
static isSkipped(): boolean;
```

Defined in: [src/services/soft-delete-context.ts:40](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/services/soft-delete-context.ts#L40)

###### Returns

`boolean`

##### run()

```ts
static run<T>(store, callback): T;
```

Defined in: [src/services/soft-delete-context.ts:16](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/services/soft-delete-context.ts#L16)

Runs a callback within the given soft-delete context store.

Supports both synchronous and asynchronous callbacks. When the callback
returns a Promise (e.g. a Prisma query), the context is preserved
throughout the entire async chain — including inside Prisma extension
handlers whose internal Promise implementation may not propagate
AsyncLocalStorage context on its own.

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `store` | [`SoftDeleteStore`](#softdeletestore) |
| `callback` | () => `T` |

###### Returns

`T`

***

### SoftDeletedEvent

Defined in: [src/events/soft-delete.events.ts:1](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L1)

#### Constructors

##### Constructor

```ts
new SoftDeletedEvent(
   model, 
   where, 
   deletedAt, 
   actorId?): SoftDeletedEvent;
```

Defined in: [src/events/soft-delete.events.ts:4](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L4)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `model` | `string` | `undefined` |
| `where` | `Record`\<`string`, `unknown`\> | `undefined` |
| `deletedAt` | `Date` | `undefined` |
| `actorId` | `string` \| `null` | `null` |

###### Returns

[`SoftDeletedEvent`](#softdeletedevent)

#### Properties

##### actorId

```ts
readonly actorId: string | null = null;
```

Defined in: [src/events/soft-delete.events.ts:8](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L8)

##### deletedAt

```ts
readonly deletedAt: Date;
```

Defined in: [src/events/soft-delete.events.ts:7](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L7)

##### EVENT\_NAME

```ts
readonly static EVENT_NAME: "soft-delete.deleted";
```

Defined in: [src/events/soft-delete.events.ts:2](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L2)

##### model

```ts
readonly model: string;
```

Defined in: [src/events/soft-delete.events.ts:5](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L5)

##### where

```ts
readonly where: Record<string, unknown>;
```

Defined in: [src/events/soft-delete.events.ts:6](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete.events.ts#L6)

***

### SoftDeleteEventEmitter

Defined in: [src/events/soft-delete-event-emitter.ts:21](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete-event-emitter.ts#L21)

#### Constructors

##### Constructor

```ts
new SoftDeleteEventEmitter(eventEmitter): SoftDeleteEventEmitter;
```

Defined in: [src/events/soft-delete-event-emitter.ts:22](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete-event-emitter.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventEmitter` | `any` |

###### Returns

[`SoftDeleteEventEmitter`](#softdeleteeventemitter)

#### Accessors

##### isEnabled

###### Get Signature

```ts
get isEnabled(): boolean;
```

Defined in: [src/events/soft-delete-event-emitter.ts:30](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete-event-emitter.ts#L30)

###### Returns

`boolean`

#### Methods

##### emitPurged()

```ts
emitPurged(event): void;
```

Defined in: [src/events/soft-delete-event-emitter.ts:42](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete-event-emitter.ts#L42)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`PurgedEvent`](#purgedevent) |

###### Returns

`void`

##### emitRestored()

```ts
emitRestored(event): void;
```

Defined in: [src/events/soft-delete-event-emitter.ts:38](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete-event-emitter.ts#L38)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`RestoredEvent`](#restoredevent) |

###### Returns

`void`

##### emitSoftDeleted()

```ts
emitSoftDeleted(event): void;
```

Defined in: [src/events/soft-delete-event-emitter.ts:34](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/events/soft-delete-event-emitter.ts#L34)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`SoftDeletedEvent`](#softdeletedevent) |

###### Returns

`void`

***

### SoftDeleteFieldMissingError

Defined in: [src/errors/soft-delete-field-missing.error.ts:1](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/errors/soft-delete-field-missing.error.ts#L1)

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new SoftDeleteFieldMissingError(model, field): SoftDeleteFieldMissingError;
```

Defined in: [src/errors/soft-delete-field-missing.error.ts:2](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/errors/soft-delete-field-missing.error.ts#L2)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `model` | `string` |
| `field` | `string` |

###### Returns

[`SoftDeleteFieldMissingError`](#softdeletefieldmissingerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

###### Inherited from

```ts
Error.cause
```

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
name: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1074

###### Inherited from

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

***

### SoftDeleteFilterInterceptor

Defined in: [src/interceptors/soft-delete-filter.interceptor.ts:9](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interceptors/soft-delete-filter.interceptor.ts#L9)

#### Implements

- `NestInterceptor`

#### Constructors

##### Constructor

```ts
new SoftDeleteFilterInterceptor(reflector): SoftDeleteFilterInterceptor;
```

Defined in: [src/interceptors/soft-delete-filter.interceptor.ts:10](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interceptors/soft-delete-filter.interceptor.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `reflector` | `Reflector` |

###### Returns

[`SoftDeleteFilterInterceptor`](#softdeletefilterinterceptor)

#### Methods

##### intercept()

```ts
intercept(context, next): Observable<any>;
```

Defined in: [src/interceptors/soft-delete-filter.interceptor.ts:12](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interceptors/soft-delete-filter.interceptor.ts#L12)

Method to implement a custom interceptor.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `ExecutionContext` | an `ExecutionContext` object providing methods to access the route handler and class about to be invoked. |
| `next` | `CallHandler` | a reference to the `CallHandler`, which provides access to an `Observable` representing the response stream from the route handler. |

###### Returns

`Observable`\<`any`\>

###### Implementation of

```ts
NestInterceptor.intercept
```

***

### SoftDeleteModule

Defined in: [src/soft-delete.module.ts:54](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/soft-delete.module.ts#L54)

#### Implements

- `NestModule`

#### Constructors

##### Constructor

```ts
new SoftDeleteModule(): SoftDeleteModule;
```

###### Returns

[`SoftDeleteModule`](#softdeletemodule)

#### Methods

##### configure()

```ts
configure(consumer): void;
```

Defined in: [src/soft-delete.module.ts:117](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/soft-delete.module.ts#L117)

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

Defined in: [src/soft-delete.module.ts:55](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/soft-delete.module.ts#L55)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`SoftDeleteModuleOptions`](#softdeletemoduleoptions) |

###### Returns

`DynamicModule`

##### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [src/soft-delete.module.ts:88](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/soft-delete.module.ts#L88)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`SoftDeleteModuleAsyncOptions`](#softdeletemoduleasyncoptions) |

###### Returns

`DynamicModule`

***

### SoftDeleteService

Defined in: [src/services/soft-delete.service.ts:10](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/services/soft-delete.service.ts#L10)

#### Constructors

##### Constructor

```ts
new SoftDeleteService(
   options, 
   prisma, 
   cascadeHandler, 
   eventEmitter): SoftDeleteService;
```

Defined in: [src/services/soft-delete.service.ts:14](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/services/soft-delete.service.ts#L14)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`SoftDeleteModuleOptions`](#softdeletemoduleoptions) |
| `prisma` | `any` |
| `cascadeHandler` | `CascadeHandler` \| `null` |
| `eventEmitter` | [`SoftDeleteEventEmitter`](#softdeleteeventemitter) \| `null` |

###### Returns

[`SoftDeleteService`](#softdeleteservice)

#### Methods

##### forceDelete()

```ts
forceDelete<T>(model, where): Promise<T>;
```

Defined in: [src/services/soft-delete.service.ts:91](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/services/soft-delete.service.ts#L91)

Permanently delete a record, bypassing soft-delete logic.

###### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `model` | `string` |
| `where` | `Record`\<`string`, `any`\> |

###### Returns

`Promise`\<`T`\>

##### onlyDeleted()

```ts
onlyDeleted<T>(callback): Promise<T>;
```

Defined in: [src/services/soft-delete.service.ts:146](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/services/soft-delete.service.ts#L146)

Execute a callback where only soft-deleted records are returned.

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

##### purge()

```ts
purge(model, options): Promise<{
  count: number;
}>;
```

Defined in: [src/services/soft-delete.service.ts:105](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/services/soft-delete.service.ts#L105)

Permanently delete soft-deleted records older than the specified date.
Runs within skipSoftDelete context so the extension does not intercept the deleteMany.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `model` | `string` |
| `options` | \{ `olderThan`: `Date`; `where?`: `Record`\<`string`, `any`\>; \} |
| `options.olderThan` | `Date` |
| `options.where?` | `Record`\<`string`, `any`\> |

###### Returns

`Promise`\<\{
  `count`: `number`;
\}\>

##### restore()

```ts
restore<T>(model, where): Promise<T>;
```

Defined in: [src/services/soft-delete.service.ts:37](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/services/soft-delete.service.ts#L37)

Restore a soft-deleted record by setting deletedAt (and optionally deletedBy) back to null.
If cascade is configured, cascade-restores child records as well.

###### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `model` | `string` |
| `where` | `Record`\<`string`, `any`\> |

###### Returns

`Promise`\<`T`\>

##### withDeleted()

```ts
withDeleted<T>(callback): Promise<T>;
```

Defined in: [src/services/soft-delete.service.ts:136](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/services/soft-delete.service.ts#L136)

Execute a callback where all queries include soft-deleted records.

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

## Interfaces

### PrismaDmmfLike

Defined in: [src/interfaces/soft-delete-options.interface.ts:3](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L3)

#### Properties

##### datamodel

```ts
datamodel: {
  models: {
     fields: {
        isId?: boolean;
        kind?: string;
        name: string;
        relationFromFields?: string[];
        type?: string;
     }[];
     name: string;
  }[];
};
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:4](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L4)

###### models

```ts
models: {
  fields: {
     isId?: boolean;
     kind?: string;
     name: string;
     relationFromFields?: string[];
     type?: string;
  }[];
  name: string;
}[];
```

***

### SoftDeleteExtensionOptions

Defined in: [src/interfaces/soft-delete-options.interface.ts:40](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L40)

#### Properties

##### cascade?

```ts
optional cascade?: Record<string, string[]>;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:44](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L44)

##### deletedAtField?

```ts
optional deletedAtField?: string;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:42](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L42)

##### deletedByField?

```ts
optional deletedByField?: string | null;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:43](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L43)

##### dmmf?

```ts
optional dmmf?: PrismaDmmfLike;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:49](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L49)

Optional Prisma DMMF metadata. Required for cascade when Prisma.dmmf is unavailable.

##### eventEmitter?

```ts
optional eventEmitter?: 
  | {
  emitSoftDeleted: (event) => void;
}
  | null;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:47](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L47)

Optional event emitter for soft-delete lifecycle events

##### maxCascadeDepth?

```ts
optional maxCascadeDepth?: number;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:45](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L45)

##### softDeleteModels

```ts
softDeleteModels: string[];
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:41](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L41)

***

### SoftDeleteModuleAsyncOptions

Defined in: [src/interfaces/soft-delete-options.interface.ts:33](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L33)

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

Defined in: [src/interfaces/soft-delete-options.interface.ts:35](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L35)

##### prismaServiceToken

```ts
prismaServiceToken: any;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:37](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L37)

DI token for the PrismaService provider — known at registration time, not async

##### useFactory

```ts
useFactory: (...args) => 
  | SoftDeleteModuleOptions
| Promise<SoftDeleteModuleOptions>;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:34](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L34)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`SoftDeleteModuleOptions`](#softdeletemoduleoptions)
  \| `Promise`\<[`SoftDeleteModuleOptions`](#softdeletemoduleoptions)\>

***

### SoftDeleteModuleOptions

Defined in: [src/interfaces/soft-delete-options.interface.ts:18](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L18)

#### Properties

##### actorExtractor?

```ts
optional actorExtractor?: (req) => string | null;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:22](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `any` |

###### Returns

`string` \| `null`

##### cascade?

```ts
optional cascade?: Record<string, string[]>;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:23](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L23)

##### deletedAtField?

```ts
optional deletedAtField?: string;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:20](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L20)

##### deletedByField?

```ts
optional deletedByField?: string | null;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:21](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L21)

##### dmmf?

```ts
optional dmmf?: PrismaDmmfLike;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:30](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L30)

Optional Prisma DMMF metadata. Required for cascade when Prisma.dmmf is unavailable.

##### enableEvents?

```ts
optional enableEvents?: boolean;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:28](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L28)

Enable event emission. Requires @nestjs/event-emitter to be installed. Default: false

##### maxCascadeDepth?

```ts
optional maxCascadeDepth?: number;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:24](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L24)

##### prismaServiceToken

```ts
prismaServiceToken: any;
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:26](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L26)

DI token for the PrismaService provider in the consumer's module

##### softDeleteModels

```ts
softDeleteModels: string[];
```

Defined in: [src/interfaces/soft-delete-options.interface.ts:19](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-options.interface.ts#L19)

***

### SoftDeleteStore

Defined in: [src/interfaces/soft-delete-context.interface.ts:3](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-context.interface.ts#L3)

#### Properties

##### actorId?

```ts
optional actorId?: string | null;
```

Defined in: [src/interfaces/soft-delete-context.interface.ts:6](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-context.interface.ts#L6)

##### filterMode

```ts
filterMode: SoftDeleteFilterMode;
```

Defined in: [src/interfaces/soft-delete-context.interface.ts:4](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-context.interface.ts#L4)

##### skipSoftDelete

```ts
skipSoftDelete: boolean;
```

Defined in: [src/interfaces/soft-delete-context.interface.ts:5](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-context.interface.ts#L5)

## Type Aliases

### SoftDeleteFilterMode

```ts
type SoftDeleteFilterMode = "default" | "withDeleted" | "onlyDeleted";
```

Defined in: [src/interfaces/soft-delete-context.interface.ts:1](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/interfaces/soft-delete-context.interface.ts#L1)

## Variables

### SOFT\_DELETE\_MODULE\_OPTIONS

```ts
const SOFT_DELETE_MODULE_OPTIONS: typeof SOFT_DELETE_MODULE_OPTIONS;
```

Defined in: [src/soft-delete.constants.ts:1](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/soft-delete.constants.ts#L1)

***

### SOFT\_DELETE\_PRISMA\_SERVICE

```ts
const SOFT_DELETE_PRISMA_SERVICE: typeof SOFT_DELETE_PRISMA_SERVICE;
```

Defined in: [src/soft-delete.constants.ts:2](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/soft-delete.constants.ts#L2)

## Functions

### createPrismaSoftDeleteExtension()

```ts
function createPrismaSoftDeleteExtension(options): any;
```

Defined in: [src/prisma/soft-delete-extension.ts:271](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/prisma/soft-delete-extension.ts#L271)

Creates a Prisma client extension that intercepts delete operations
(converting them to soft-delete updates) and read operations
(injecting deletedAt filters based on the current context).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`SoftDeleteExtensionOptions`](#softdeleteextensionoptions) |

#### Returns

`any`

***

### OnlyDeleted()

```ts
function OnlyDeleted(): CustomDecorator<string>;
```

Defined in: [src/decorators/only-deleted.decorator.ts:4](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/decorators/only-deleted.decorator.ts#L4)

#### Returns

`CustomDecorator`\<`string`\>

***

### SkipSoftDelete()

```ts
function SkipSoftDelete(): CustomDecorator<string>;
```

Defined in: [src/decorators/skip-soft-delete.decorator.ts:4](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/decorators/skip-soft-delete.decorator.ts#L4)

#### Returns

`CustomDecorator`\<`string`\>

***

### WithDeleted()

```ts
function WithDeleted(): CustomDecorator<string>;
```

Defined in: [src/decorators/with-deleted.decorator.ts:4](https://github.com/nestarc/nestjs-soft-delete/blob/48388220eb5d9381f65a5a7850b40d22e9e5f12b/src/decorators/with-deleted.decorator.ts#L4)

#### Returns

`CustomDecorator`\<`string`\>
