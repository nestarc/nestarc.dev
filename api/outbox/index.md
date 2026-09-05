# @nestarc/outbox

## Classes

<a id="api-localtransport"></a>

### LocalTransport

Defined in: [src/transports/local.transport.ts:10](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/transports/local.transport.ts#L10)

#### Implements

- [`OutboxTransport`](#api-outboxtransport)

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new LocalTransport(tenantProvider?): LocalTransport;
```

Defined in: [src/transports/local.transport.ts:11](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/transports/local.transport.ts#L11)

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

Defined in: [src/transports/local.transport.ts:17](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/transports/local.transport.ts#L17)

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

Defined in: [src/outbox.admin.service.ts:613](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.admin.service.ts#L613)

Privileged global outbox control-plane access. The package does not perform
caller authentication or RBAC for this service.

#### Extends

- `OutboxAdminBase`\<[`OutboxListOptions`](#api-outboxlistoptions)\>

#### Constructors

<a id="api-constructor-1"></a>

##### Constructor

```ts
new OutboxAdminService(options): OutboxAdminService;
```

Defined in: [src/outbox.admin.service.ts:614](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.admin.service.ts#L614)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxOptions`](#api-outboxoptions) |

###### Returns

[`OutboxAdminService`](#api-outboxadminservice)

###### Overrides

```ts
OutboxAdminBase<OutboxListOptions>.constructor
```

#### Methods

<a id="api-getbyid"></a>

##### getById()

```ts
getById(id): Promise<OutboxRecord | null>;
```

Defined in: [src/outbox.admin.service.ts:254](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.admin.service.ts#L254)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`Promise`\<[`OutboxRecord`](#api-outboxrecord) \| `null`\>

###### Inherited from

```ts
OutboxAdminBase.getById
```

<a id="api-gethealth"></a>

##### getHealth()

```ts
getHealth(options?): Promise<OutboxHealth>;
```

Defined in: [src/outbox.admin.service.ts:463](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.admin.service.ts#L463)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxHealthOptions`](#api-outboxhealthoptions) |

###### Returns

`Promise`\<[`OutboxHealth`](#api-outboxhealth)\>

###### Inherited from

```ts
OutboxAdminBase.getHealth
```

<a id="api-getstats"></a>

##### getStats()

```ts
getStats(): Promise<OutboxStats>;
```

Defined in: [src/outbox.admin.service.ts:71](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.admin.service.ts#L71)

###### Returns

`Promise`\<[`OutboxStats`](#api-outboxstats)\>

###### Inherited from

```ts
OutboxAdminBase.getStats
```

<a id="api-list"></a>

##### list()

```ts
list(options?): Promise<OutboxRecord[]>;
```

Defined in: [src/outbox.admin.service.ts:126](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.admin.service.ts#L126)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxListOptions`](#api-outboxlistoptions) |

###### Returns

`Promise`\<[`OutboxRecord`](#api-outboxrecord)[]\>

###### Inherited from

```ts
OutboxAdminBase.list
```

<a id="api-listpage"></a>

##### listPage()

```ts
listPage(options?): Promise<OutboxListPage>;
```

Defined in: [src/outbox.admin.service.ts:184](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.admin.service.ts#L184)

Deterministic descending pagination. The cursor is an opaque, versioned,
exclusive boundary over `(created_at, id)`.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxListOptions`](#api-outboxlistoptions) & \{ `cursor?`: `string`; \} |

###### Returns

`Promise`\<[`OutboxListPage`](#api-outboxlistpage)\>

###### Inherited from

```ts
OutboxAdminBase.listPage
```

<a id="api-markfailed"></a>

##### markFailed()

```ts
markFailed(id, reason): Promise<OutboxAdminMutationResult>;
```

Defined in: [src/outbox.admin.service.ts:375](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.admin.service.ts#L375)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `reason` | `string` |

###### Returns

`Promise`\<[`OutboxAdminMutationResult`](#api-outboxadminmutationresult)\>

###### Inherited from

```ts
OutboxAdminBase.markFailed
```

<a id="api-purgesent"></a>

##### purgeSent()

```ts
purgeSent(options): Promise<number>;
```

Defined in: [src/outbox.admin.service.ts:432](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.admin.service.ts#L432)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | \{ `before`: `Date`; `limit?`: `number`; \} |
| `options.before` | `Date` |
| `options.limit?` | `number` |

###### Returns

`Promise`\<`number`\>

###### Inherited from

```ts
OutboxAdminBase.purgeSent
```

<a id="api-retry"></a>

##### retry()

```ts
retry(id): Promise<OutboxAdminMutationResult>;
```

Defined in: [src/outbox.admin.service.ts:275](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.admin.service.ts#L275)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`Promise`\<[`OutboxAdminMutationResult`](#api-outboxadminmutationresult)\>

###### Inherited from

```ts
OutboxAdminBase.retry
```

<a id="api-retrymany"></a>

##### retryMany()

```ts
retryMany(ids): Promise<number>;
```

Defined in: [src/outbox.admin.service.ts:329](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.admin.service.ts#L329)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ids` | `string`[] |

###### Returns

`Promise`\<`number`\>

###### Inherited from

```ts
OutboxAdminBase.retryMany
```

***

<a id="api-outboxconfigurationerror"></a>

### OutboxConfigurationError

Defined in: [src/errors/outbox-configuration.error.ts:3](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-configuration.error.ts#L3)

#### Extends

- `Error`

#### Constructors

<a id="api-constructor-2"></a>

##### Constructor

```ts
new OutboxConfigurationError(option, message): OutboxConfigurationError;
```

Defined in: [src/errors/outbox-configuration.error.ts:6](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-configuration.error.ts#L6)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `option` | `string` |
| `message` | `string` |

###### Returns

[`OutboxConfigurationError`](#api-outboxconfigurationerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

<a id="api-cause"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

```ts
Error.cause
```

<a id="api-code"></a>

##### code

```ts
readonly code: "OUTBOX_INVALID_CONFIGURATION" = OUTBOX_INVALID_CONFIGURATION;
```

Defined in: [src/errors/outbox-configuration.error.ts:4](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-configuration.error.ts#L4)

<a id="api-message"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

```ts
Error.message
```

<a id="api-name"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

```ts
Error.name
```

<a id="api-option"></a>

##### option

```ts
readonly option: string;
```

Defined in: [src/errors/outbox-configuration.error.ts:7](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-configuration.error.ts#L7)

<a id="api-stack"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

```ts
Error.stack
```

<a id="api-stacktracelimit"></a>

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:68

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

<a id="api-capturestacktrace"></a>

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:52

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

<a id="api-preparestacktrace"></a>

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:56

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

<a id="api-outboxcursorerror"></a>

### OutboxCursorError

Defined in: [src/errors/outbox-cursor.error.ts:4](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-cursor.error.ts#L4)

Stable admin pagination error for malformed or unsupported cursors.

#### Extends

- `Error`

#### Constructors

<a id="api-constructor-3"></a>

##### Constructor

```ts
new OutboxCursorError(message?): OutboxCursorError;
```

Defined in: [src/errors/outbox-cursor.error.ts:7](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-cursor.error.ts#L7)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `message` | `string` | `'Outbox cursor is malformed or unsupported'` |

###### Returns

[`OutboxCursorError`](#api-outboxcursorerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

<a id="api-cause-1"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

```ts
Error.cause
```

<a id="api-code-1"></a>

##### code

```ts
readonly code: "OUTBOX_INVALID_CURSOR" = OUTBOX_INVALID_CURSOR;
```

Defined in: [src/errors/outbox-cursor.error.ts:5](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-cursor.error.ts#L5)

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
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

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

Defined in: node\_modules/@types/node/globals.d.ts:68

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

Defined in: node\_modules/@types/node/globals.d.ts:52

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

Defined in: node\_modules/@types/node/globals.d.ts:56

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

<a id="api-outboxemitter"></a>

### OutboxEmitter

Defined in: [src/outbox.emitter.ts:52](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.emitter.ts#L52)

#### Constructors

<a id="api-constructor-4"></a>

##### Constructor

```ts
new OutboxEmitter(options, tenantProvider?): OutboxEmitter;
```

Defined in: [src/outbox.emitter.ts:56](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.emitter.ts#L56)

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

Defined in: [src/outbox.emitter.ts:65](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.emitter.ts#L65)

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

Defined in: [src/outbox.emitter.ts:78](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.emitter.ts#L78)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`PrismaTransactionClient`](#api-prismatransactionclient) |
| `events` | [`OutboxEmitManyEntry`](#api-outboxemitmanyentry)[] |

###### Returns

`Promise`\<`void`\>

***

<a id="api-outboxenvelopeerror"></a>

### OutboxEnvelopeError

Defined in: [src/errors/outbox-envelope.error.ts:14](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-envelope.error.ts#L14)

Stable producer-side validation error thrown before any database call.

#### Extends

- `Error`

#### Constructors

<a id="api-constructor-5"></a>

##### Constructor

```ts
new OutboxEnvelopeError(
   field,
   reason,
   message): OutboxEnvelopeError;
```

Defined in: [src/errors/outbox-envelope.error.ts:17](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-envelope.error.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `field` | `string` |
| `reason` | [`OutboxEnvelopeErrorReason`](#api-outboxenvelopeerrorreason-1) |
| `message` | `string` |

###### Returns

[`OutboxEnvelopeError`](#api-outboxenvelopeerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

<a id="api-cause-2"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

```ts
Error.cause
```

<a id="api-code-2"></a>

##### code

```ts
readonly code: "OUTBOX_INVALID_ENVELOPE" = OUTBOX_INVALID_ENVELOPE;
```

Defined in: [src/errors/outbox-envelope.error.ts:15](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-envelope.error.ts#L15)

<a id="api-field"></a>

##### field

```ts
readonly field: string;
```

Defined in: [src/errors/outbox-envelope.error.ts:18](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-envelope.error.ts#L18)

<a id="api-message-2"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

```ts
Error.message
```

<a id="api-name-2"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

```ts
Error.name
```

<a id="api-reason"></a>

##### reason

```ts
readonly reason: OutboxEnvelopeErrorReason;
```

Defined in: [src/errors/outbox-envelope.error.ts:19](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-envelope.error.ts#L19)

<a id="api-stack-2"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

```ts
Error.stack
```

<a id="api-stacktracelimit-2"></a>

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:68

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

<a id="api-capturestacktrace-2"></a>

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:52

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

<a id="api-preparestacktrace-2"></a>

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:56

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

<a id="api-abstract-outboxevent"></a>

### `abstract` OutboxEvent

Defined in: [src/outbox.event.ts:1](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.event.ts#L1)

#### Constructors

<a id="api-constructor-6"></a>

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

Defined in: [src/outbox.event.ts:10](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.event.ts#L10)

###### Returns

`string`

<a id="api-topayload"></a>

##### toPayload()

```ts
toPayload(): Record<string, unknown>;
```

Defined in: [src/outbox.event.ts:2](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.event.ts#L2)

###### Returns

`Record`\<`string`, `unknown`\>

***

<a id="api-outboxlistener"></a>

### OutboxListener

Defined in: [src/outbox.listener.ts:39](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.listener.ts#L39)

#### Implements

- `OnModuleInit`
- `OnApplicationShutdown`

#### Constructors

<a id="api-constructor-7"></a>

##### Constructor

```ts
new OutboxListener(
   options,
   poller,
   schemaGuard?): OutboxListener;
```

Defined in: [src/outbox.listener.ts:49](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.listener.ts#L49)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxOptions`](#api-outboxoptions) |
| `poller` | `Pick`\<`OutboxPoller`, `"requestPoll"`\> |
| `schemaGuard?` | `OutboxSchemaGuard` |

###### Returns

[`OutboxListener`](#api-outboxlistener)

#### Methods

<a id="api-onapplicationshutdown"></a>

##### onApplicationShutdown()

```ts
onApplicationShutdown(): Promise<void>;
```

Defined in: [src/outbox.listener.ts:83](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.listener.ts#L83)

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

Defined in: [src/outbox.listener.ts:56](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.listener.ts#L56)

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleInit.onModuleInit
```

***

<a id="api-outboxmodule"></a>

### OutboxModule

Defined in: [src/outbox.module.ts:34](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.module.ts#L34)

#### Constructors

<a id="api-constructor-8"></a>

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

Defined in: [src/outbox.module.ts:35](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.module.ts#L35)

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

Defined in: [src/outbox.module.ts:87](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.module.ts#L87)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxAsyncOptions`](#api-outboxasyncoptions) |

###### Returns

`DynamicModule`

***

<a id="api-outboxpersistedinvarianterror"></a>

### OutboxPersistedInvariantError

Defined in: [src/errors/outbox-persisted-invariant.error.ts:4](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-persisted-invariant.error.ts#L4)

#### Extends

- `Error`

#### Constructors

<a id="api-constructor-9"></a>

##### Constructor

```ts
new OutboxPersistedInvariantError(
   eventId,
   field,
   message): OutboxPersistedInvariantError;
```

Defined in: [src/errors/outbox-persisted-invariant.error.ts:7](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-persisted-invariant.error.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` \| `null` |
| `field` | `string` |
| `message` | `string` |

###### Returns

[`OutboxPersistedInvariantError`](#api-outboxpersistedinvarianterror)

###### Overrides

```ts
Error.constructor
```

#### Properties

<a id="api-cause-3"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

```ts
Error.cause
```

<a id="api-code-3"></a>

##### code

```ts
readonly code: "OUTBOX_PERSISTED_INVARIANT_VIOLATION" = OUTBOX_PERSISTED_INVARIANT_VIOLATION;
```

Defined in: [src/errors/outbox-persisted-invariant.error.ts:5](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-persisted-invariant.error.ts#L5)

<a id="api-eventid-2"></a>

##### eventId

```ts
readonly eventId: string | null;
```

Defined in: [src/errors/outbox-persisted-invariant.error.ts:8](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-persisted-invariant.error.ts#L8)

<a id="api-field-1"></a>

##### field

```ts
readonly field: string;
```

Defined in: [src/errors/outbox-persisted-invariant.error.ts:9](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-persisted-invariant.error.ts#L9)

<a id="api-message-3"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

```ts
Error.message
```

<a id="api-name-3"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

```ts
Error.name
```

<a id="api-stack-3"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

```ts
Error.stack
```

<a id="api-stacktracelimit-3"></a>

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:68

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

<a id="api-capturestacktrace-3"></a>

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:52

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

<a id="api-preparestacktrace-3"></a>

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:56

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

<a id="api-outboxschemaerror"></a>

### OutboxSchemaError

Defined in: [src/errors/outbox-schema.error.ts:3](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-schema.error.ts#L3)

#### Extends

- `Error`

#### Constructors

<a id="api-constructor-10"></a>

##### Constructor

```ts
new OutboxSchemaError(
   requiredVersion,
   actualVersion,
   missing): OutboxSchemaError;
```

Defined in: [src/errors/outbox-schema.error.ts:7](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-schema.error.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `requiredVersion` | `string` |
| `actualVersion` | `string` |
| `missing` | readonly `string`[] |

###### Returns

[`OutboxSchemaError`](#api-outboxschemaerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

<a id="api-actualversion"></a>

##### actualVersion

```ts
readonly actualVersion: string;
```

Defined in: [src/errors/outbox-schema.error.ts:9](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-schema.error.ts#L9)

<a id="api-cause-4"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

```ts
Error.cause
```

<a id="api-code-4"></a>

##### code

```ts
readonly code: "OUTBOX_SCHEMA_MISMATCH" = OUTBOX_SCHEMA_MISMATCH;
```

Defined in: [src/errors/outbox-schema.error.ts:5](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-schema.error.ts#L5)

<a id="api-message-4"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

```ts
Error.message
```

<a id="api-missing"></a>

##### missing

```ts
readonly missing: readonly string[];
```

Defined in: [src/errors/outbox-schema.error.ts:10](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-schema.error.ts#L10)

<a id="api-name-4"></a>

##### name

```ts
readonly name: "OutboxSchemaError" = 'OutboxSchemaError';
```

Defined in: [src/errors/outbox-schema.error.ts:4](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-schema.error.ts#L4)

###### Overrides

```ts
Error.name
```

<a id="api-requiredversion"></a>

##### requiredVersion

```ts
readonly requiredVersion: string;
```

Defined in: [src/errors/outbox-schema.error.ts:8](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-schema.error.ts#L8)

<a id="api-stack-4"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

```ts
Error.stack
```

<a id="api-stacktracelimit-4"></a>

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:68

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

<a id="api-capturestacktrace-4"></a>

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:52

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

<a id="api-preparestacktrace-4"></a>

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:56

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

<a id="api-outboxtenantadminservice"></a>

### OutboxTenantAdminService

Defined in: [src/outbox.admin.service.ts:636](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.admin.service.ts#L636)

Creates an outbox admin API whose every query is fenced by one expected
tenant id. The caller remains responsible for authorizing that identity.

#### Constructors

<a id="api-constructor-11"></a>

##### Constructor

```ts
new OutboxTenantAdminService(options): OutboxTenantAdminService;
```

Defined in: [src/outbox.admin.service.ts:637](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.admin.service.ts#L637)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`OutboxOptions`](#api-outboxoptions) |

###### Returns

[`OutboxTenantAdminService`](#api-outboxtenantadminservice)

#### Methods

<a id="api-fortenant"></a>

##### forTenant()

```ts
forTenant(expectedTenantId): OutboxTenantAdminScope;
```

Defined in: [src/outbox.admin.service.ts:641](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.admin.service.ts#L641)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `expectedTenantId` | `string` |

###### Returns

`OutboxTenantAdminScope`

***

<a id="api-outboxwakeupunavailableerror"></a>

### OutboxWakeupUnavailableError

Defined in: [src/errors/outbox-wakeup-unavailable.error.ts:7](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-wakeup-unavailable.error.ts#L7)

Raised during module initialization when both the polling scheduler and the
PostgreSQL wakeup transport are unavailable.

#### Extends

- `Error`

#### Constructors

<a id="api-constructor-12"></a>

##### Constructor

```ts
new OutboxWakeupUnavailableError(cause): OutboxWakeupUnavailableError;
```

Defined in: [src/errors/outbox-wakeup-unavailable.error.ts:10](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-wakeup-unavailable.error.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `cause` | `Error` |

###### Returns

[`OutboxWakeupUnavailableError`](#api-outboxwakeupunavailableerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

<a id="api-cause-5"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

```ts
Error.cause
```

<a id="api-code-5"></a>

##### code

```ts
readonly code: "OUTBOX_WAKEUP_UNAVAILABLE" = OUTBOX_WAKEUP_UNAVAILABLE;
```

Defined in: [src/errors/outbox-wakeup-unavailable.error.ts:8](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-wakeup-unavailable.error.ts#L8)

<a id="api-message-5"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

```ts
Error.message
```

<a id="api-name-5"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

```ts
Error.name
```

<a id="api-stack-5"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

```ts
Error.stack
```

<a id="api-stacktracelimit-5"></a>

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:68

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

<a id="api-capturestacktrace-5"></a>

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:52

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

<a id="api-preparestacktrace-5"></a>

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:56

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

<a id="api-outboxasyncoptions"></a>

### OutboxAsyncOptions

Defined in: [src/interfaces/outbox-options.interface.ts:75](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L75)

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

Defined in: [src/interfaces/outbox-options.interface.ts:76](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L76)

<a id="api-isglobal"></a>

##### isGlobal?

```ts
optional isGlobal?: boolean;
```

Defined in: [src/interfaces/outbox-options.interface.ts:86](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L86)

<a id="api-tenantprovider"></a>

##### tenantProvider?

```ts
optional tenantProvider?:
  | OutboxTenantProvider
| Type<OutboxTenantProvider>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:85](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L85)

Nest-created tenant provider class or an already-created provider value.

<a id="api-transport"></a>

##### transport?

```ts
optional transport?: Type<
  | OutboxTransport
| OutboxPublisher>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:83](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L83)

Nest-created custom transport class. Defaults to LocalTransport.

<a id="api-useclass"></a>

##### useClass?

```ts
optional useClass?: Type<OutboxOptionsFactory>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:80](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L80)

<a id="api-useexisting"></a>

##### useExisting?

```ts
optional useExisting?: Type<OutboxOptionsFactory>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:81](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L81)

<a id="api-usefactory"></a>

##### useFactory?

```ts
optional useFactory?: (...args) =>
  | OutboxAsyncRuntimeOptions
| Promise<OutboxAsyncRuntimeOptions>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:77](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L77)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`OutboxAsyncRuntimeOptions`](#api-outboxasyncruntimeoptions)
  \| `Promise`\<[`OutboxAsyncRuntimeOptions`](#api-outboxasyncruntimeoptions)\>

***

<a id="api-outboxasyncruntimeoptions"></a>

### OutboxAsyncRuntimeOptions

Defined in: [src/interfaces/outbox-options.interface.ts:66](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L66)

Runtime values produced by an async options factory. Nest provider
registrations are intentionally owned by [OutboxAsyncOptions](#api-outboxasyncoptions) so
their dependencies can participate in the module graph before the factory
resolves.

#### Extends

- `Omit`\<[`OutboxOptions`](#api-outboxoptions), `"isGlobal"` \| `"tenancy"` \| `"transport"`\>

#### Properties

<a id="api-delivery"></a>

##### delivery?

```ts
optional delivery?: OutboxDeliveryOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:49](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L49)

###### Inherited from

[`OutboxOptions`](#api-outboxoptions).[`delivery`](#api-delivery-1)

<a id="api-events"></a>

##### events?

```ts
optional events?: Type<any>[];
```

Defined in: [src/interfaces/outbox-options.interface.ts:54](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L54)

###### Inherited from

[`OutboxOptions`](#api-outboxoptions).[`events`](#api-events-1)

<a id="api-hooks"></a>

##### hooks?

```ts
optional hooks?: OutboxHooks;
```

Defined in: [src/interfaces/outbox-options.interface.ts:51](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L51)

###### Inherited from

[`OutboxOptions`](#api-outboxoptions).[`hooks`](#api-hooks-1)

<a id="api-isglobal-1"></a>

##### isGlobal?

```ts
optional isGlobal?: undefined;
```

Defined in: [src/interfaces/outbox-options.interface.ts:71](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L71)

<a id="api-lease"></a>

##### lease?

```ts
optional lease?: OutboxLeaseOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:53](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L53)

###### Inherited from

[`OutboxOptions`](#api-outboxoptions).[`lease`](#api-lease-1)

<a id="api-polling"></a>

##### polling?

```ts
optional polling?: OutboxPollingOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:45](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L45)

###### Inherited from

[`OutboxOptions`](#api-outboxoptions).[`polling`](#api-polling-1)

<a id="api-prisma"></a>

##### prisma

```ts
prisma: any;
```

Defined in: [src/interfaces/outbox-options.interface.ts:44](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L44)

forRoot: PrismaService class reference (resolved via DI, must be in a

###### Global

module).
forRootAsync: resolved PrismaService instance from the factory.
The instance must satisfy [PrismaLike](#api-prismalike) ($executeRaw, $queryRaw).

###### Inherited from

[`OutboxOptions`](#api-outboxoptions).[`prisma`](#api-prisma-1)

<a id="api-retry-1"></a>

##### retry?

```ts
optional retry?: OutboxRetryOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:46](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L46)

###### Inherited from

[`OutboxOptions`](#api-outboxoptions).[`retry`](#api-retry-2)

<a id="api-stuckthreshold"></a>

##### ~~stuckThreshold?~~

```ts
optional stuckThreshold?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:57](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L57)

###### Deprecated

Use lease.duration. Retained as a lease-duration compatibility alias.

###### Inherited from

[`OutboxOptions`](#api-outboxoptions).[`stuckThreshold`](#api-stuckthreshold-1)

<a id="api-tenancy"></a>

##### tenancy?

```ts
optional tenancy?: Omit<OutboxTenancyOptions, "provider"> & {
  provider?: undefined;
};
```

Defined in: [src/interfaces/outbox-options.interface.ts:70](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L70)

###### Type Declaration

###### provider?

```ts
optional provider?: undefined;
```

<a id="api-transport-1"></a>

##### transport?

```ts
optional transport?: undefined;
```

Defined in: [src/interfaces/outbox-options.interface.ts:72](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L72)

<a id="api-wakeup"></a>

##### wakeup?

```ts
optional wakeup?: OutboxWakeupOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:52](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L52)

###### Inherited from

[`OutboxOptions`](#api-outboxoptions).[`wakeup`](#api-wakeup-1)

***

<a id="api-outboxdeliveryoptions"></a>

### OutboxDeliveryOptions

Defined in: [src/interfaces/outbox-options.interface.ts:25](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L25)

#### Properties

<a id="api-mode"></a>

##### mode?

```ts
optional mode?: "local" | "publisher";
```

Defined in: [src/interfaces/outbox-options.interface.ts:26](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L26)

***

<a id="api-outboxdispatchcontext"></a>

### OutboxDispatchContext

Defined in: [src/interfaces/outbox-hooks.interface.ts:22](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L22)

#### Extended by

- [`OutboxRetryContext`](#api-outboxretrycontext)

#### Properties

<a id="api-aggregateid"></a>

##### aggregateId

```ts
readonly aggregateId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:30](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L30)

<a id="api-aggregatetype"></a>

##### aggregateType

```ts
readonly aggregateType: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:29](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L29)

<a id="api-causationid"></a>

##### causationId

```ts
readonly causationId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:34](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L34)

<a id="api-correlationid"></a>

##### correlationId

```ts
readonly correlationId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:33](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L33)

<a id="api-eventid"></a>

##### eventId

```ts
readonly eventId: string;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:24](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L24)

<a id="api-eventtype"></a>

##### eventType

```ts
readonly eventType: string;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:25](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L25)

<a id="api-headers"></a>

##### headers

```ts
readonly headers: Readonly<Record<string, string>>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:35](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L35)

<a id="api-idempotencykey"></a>

##### idempotencyKey

```ts
readonly idempotencyKey: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:32](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L32)

<a id="api-maxretries"></a>

##### maxRetries

```ts
readonly maxRetries: number;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:28](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L28)

<a id="api-partitionkey"></a>

##### partitionKey

```ts
readonly partitionKey: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:31](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L31)

<a id="api-record"></a>

##### record

```ts
readonly record: OutboxRecord;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:23](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L23)

<a id="api-retrycount"></a>

##### retryCount

```ts
readonly retryCount: number;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:27](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L27)

<a id="api-tenantid"></a>

##### tenantId

```ts
readonly tenantId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:26](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L26)

***

<a id="api-outboxemitcontext"></a>

### OutboxEmitContext

Defined in: [src/interfaces/outbox-hooks.interface.ts:3](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L3)

#### Properties

<a id="api-aggregateid-1"></a>

##### aggregateId

```ts
readonly aggregateId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:8](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L8)

<a id="api-aggregatetype-1"></a>

##### aggregateType

```ts
readonly aggregateType: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:7](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L7)

<a id="api-causationid-1"></a>

##### causationId

```ts
readonly causationId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:12](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L12)

<a id="api-correlationid-1"></a>

##### correlationId

```ts
readonly correlationId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:11](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L11)

<a id="api-eventtype-1"></a>

##### eventType

```ts
readonly eventType: string;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:4](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L4)

<a id="api-headers-1"></a>

##### headers

```ts
readonly headers: Readonly<Record<string, string>>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:13](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L13)

<a id="api-idempotencykey-1"></a>

##### idempotencyKey

```ts
readonly idempotencyKey: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:10](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L10)

<a id="api-occurredat"></a>

##### occurredAt

```ts
readonly occurredAt: Date | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:14](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L14)

<a id="api-partitionkey-1"></a>

##### partitionKey

```ts
readonly partitionKey: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:9](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L9)

<a id="api-payload"></a>

##### payload

```ts
readonly payload: Readonly<Record<string, unknown>>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:5](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L5)

<a id="api-tenantid-1"></a>

##### tenantId

```ts
readonly tenantId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:6](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L6)

***

<a id="api-outboxhandler"></a>

### OutboxHandler

Defined in: [src/interfaces/outbox-handler.interface.ts:1](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-handler.interface.ts#L1)

#### Properties

<a id="api-eventtypes"></a>

##### eventTypes

```ts
eventTypes: string[];
```

Defined in: [src/interfaces/outbox-handler.interface.ts:4](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-handler.interface.ts#L4)

<a id="api-instance"></a>

##### instance

```ts
instance: Record<string, any>;
```

Defined in: [src/interfaces/outbox-handler.interface.ts:2](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-handler.interface.ts#L2)

<a id="api-methodname"></a>

##### methodName

```ts
methodName: string;
```

Defined in: [src/interfaces/outbox-handler.interface.ts:3](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-handler.interface.ts#L3)

***

<a id="api-outboxhandlercontext"></a>

### OutboxHandlerContext

Defined in: [src/interfaces/outbox-handler-context.interface.ts:3](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-handler-context.interface.ts#L3)

#### Properties

<a id="api-eventid-1"></a>

##### eventId

```ts
readonly eventId: string;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:5](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-handler-context.interface.ts#L5)

<a id="api-eventtype-2"></a>

##### eventType

```ts
readonly eventType: string;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:6](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-handler-context.interface.ts#L6)

<a id="api-headers-2"></a>

##### headers

```ts
readonly headers: Readonly<Record<string, string>>;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:9](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-handler-context.interface.ts#L9)

<a id="api-record-1"></a>

##### record

```ts
readonly record: OutboxRecord;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:4](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-handler-context.interface.ts#L4)

<a id="api-retrycount-1"></a>

##### retryCount

```ts
readonly retryCount: number;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:8](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-handler-context.interface.ts#L8)

<a id="api-tenantid-2"></a>

##### tenantId

```ts
readonly tenantId: string | null;
```

Defined in: [src/interfaces/outbox-handler-context.interface.ts:7](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-handler-context.interface.ts#L7)

***

<a id="api-outboxhealth"></a>

### OutboxHealth

Defined in: [src/interfaces/outbox-admin.interface.ts:40](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L40)

#### Properties

<a id="api-ok"></a>

##### ok

```ts
ok: boolean;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:41](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L41)

<a id="api-reasons"></a>

##### reasons

```ts
reasons: string[];
```

Defined in: [src/interfaces/outbox-admin.interface.ts:43](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L43)

<a id="api-stats"></a>

##### stats

```ts
stats: OutboxStats;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:42](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L42)

***

<a id="api-outboxhealthoptions"></a>

### OutboxHealthOptions

Defined in: [src/interfaces/outbox-admin.interface.ts:35](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L35)

#### Properties

<a id="api-maxfailedcount"></a>

##### maxFailedCount?

```ts
optional maxFailedCount?: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:37](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L37)

<a id="api-maxoldestpendingagems"></a>

##### maxOldestPendingAgeMs?

```ts
optional maxOldestPendingAgeMs?: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:36](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L36)

***

<a id="api-outboxhooks"></a>

### OutboxHooks

Defined in: [src/interfaces/outbox-hooks.interface.ts:44](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L44)

#### Methods

<a id="api-ondeadletter"></a>

##### onDeadLetter()?

```ts
optional onDeadLetter(context): void | Promise<void>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:58](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L58)

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

Defined in: [src/interfaces/outbox-hooks.interface.ts:51](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L51)

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

Defined in: [src/interfaces/outbox-hooks.interface.ts:47](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L47)

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

Defined in: [src/interfaces/outbox-hooks.interface.ts:48](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L48)

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

Defined in: [src/interfaces/outbox-hooks.interface.ts:45](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L45)

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

Defined in: [src/interfaces/outbox-hooks.interface.ts:46](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L46)

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

Defined in: [src/interfaces/outbox-hooks.interface.ts:57](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L57)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`OutboxRetryContext`](#api-outboxretrycontext) |

###### Returns

`void` \| `Promise`\<`void`\>

***

<a id="api-outboxleaseoptions"></a>

### OutboxLeaseOptions

Defined in: [src/interfaces/outbox-options.interface.ts:29](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L29)

#### Properties

<a id="api-duration"></a>

##### duration?

```ts
optional duration?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:31](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L31)

Claim lifetime in milliseconds. Defaults to stuckThreshold or 300000.

<a id="api-heartbeatfailuretolerance"></a>

##### heartbeatFailureTolerance?

```ts
optional heartbeatFailureTolerance?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:35](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L35)

Consecutive heartbeat errors tolerated before abandoning the claim. Defaults to 1.

<a id="api-heartbeatinterval"></a>

##### heartbeatInterval?

```ts
optional heartbeatInterval?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:33](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L33)

Active callback heartbeat interval in milliseconds. Defaults to duration / 3.

***

<a id="api-outboxlistoptions"></a>

### OutboxListOptions

Defined in: [src/interfaces/outbox-admin.interface.ts:12](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L12)

#### Extended by

- [`OutboxPageOptions`](#api-outboxpageoptions)

#### Properties

<a id="api-after"></a>

##### after?

```ts
optional after?: Date;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:18](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L18)

<a id="api-before"></a>

##### before?

```ts
optional before?: Date;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:17](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L17)

<a id="api-eventtype-3"></a>

##### eventType?

```ts
optional eventType?: string;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:14](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L14)

<a id="api-limit"></a>

##### limit?

```ts
optional limit?: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:16](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L16)

<a id="api-status"></a>

##### status?

```ts
optional status?: "PENDING" | "PROCESSING" | "SENT" | "FAILED";
```

Defined in: [src/interfaces/outbox-admin.interface.ts:13](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L13)

<a id="api-tenantid-3"></a>

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:15](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L15)

***

<a id="api-outboxlistpage"></a>

### OutboxListPage

Defined in: [src/interfaces/outbox-admin.interface.ts:30](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L30)

#### Properties

<a id="api-nextcursor"></a>

##### nextCursor

```ts
nextCursor: string | null;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:32](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L32)

<a id="api-records"></a>

##### records

```ts
records: OutboxRecord[];
```

Defined in: [src/interfaces/outbox-admin.interface.ts:31](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L31)

***

<a id="api-outboxnotification"></a>

### OutboxNotification

Defined in: [src/interfaces/outbox-wakeup.interface.ts:1](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L1)

#### Properties

<a id="api-channel"></a>

##### channel

```ts
channel: string;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:2](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L2)

<a id="api-payload-1"></a>

##### payload?

```ts
optional payload?: string;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:3](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L3)

***

<a id="api-outboxnotificationclient"></a>

### OutboxNotificationClient

Defined in: [src/interfaces/outbox-wakeup.interface.ts:6](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L6)

#### Methods

<a id="api-connect"></a>

##### connect()

```ts
connect(): Promise<void>;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:7](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L7)

###### Returns

`Promise`\<`void`\>

<a id="api-end"></a>

##### end()

```ts
end(): Promise<void>;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:9](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L9)

###### Returns

`Promise`\<`void`\>

<a id="api-off"></a>

##### off()?

```ts
optional off(event, handler): this;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:12](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L12)

Optional EventEmitter-compatible listener cleanup API.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` |
| `handler` | (`payload`) => `void` |

###### Returns

`this`

<a id="api-on"></a>

##### on()

```ts
on(event, handler): this;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:10](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L10)

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

Defined in: [src/interfaces/outbox-wakeup.interface.ts:8](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L8)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `sql` | `string` |

###### Returns

`Promise`\<`unknown`\>

<a id="api-removelistener"></a>

##### removeListener()?

```ts
optional removeListener(event, handler): this;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:14](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L14)

Optional legacy EventEmitter-compatible listener cleanup API.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` |
| `handler` | (`payload`) => `void` |

###### Returns

`this`

***

<a id="api-outboxoptions"></a>

### OutboxOptions

Defined in: [src/interfaces/outbox-options.interface.ts:38](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L38)

#### Properties

<a id="api-delivery-1"></a>

##### delivery?

```ts
optional delivery?: OutboxDeliveryOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:49](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L49)

<a id="api-events-1"></a>

##### events?

```ts
optional events?: Type<any>[];
```

Defined in: [src/interfaces/outbox-options.interface.ts:54](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L54)

<a id="api-hooks-1"></a>

##### hooks?

```ts
optional hooks?: OutboxHooks;
```

Defined in: [src/interfaces/outbox-options.interface.ts:51](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L51)

<a id="api-isglobal-2"></a>

##### isGlobal?

```ts
optional isGlobal?: boolean;
```

Defined in: [src/interfaces/outbox-options.interface.ts:55](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L55)

<a id="api-lease-1"></a>

##### lease?

```ts
optional lease?: OutboxLeaseOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:53](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L53)

<a id="api-polling-1"></a>

##### polling?

```ts
optional polling?: OutboxPollingOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:45](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L45)

<a id="api-prisma-1"></a>

##### prisma

```ts
prisma: any;
```

Defined in: [src/interfaces/outbox-options.interface.ts:44](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L44)

forRoot: PrismaService class reference (resolved via DI, must be in a

###### Global

module).
forRootAsync: resolved PrismaService instance from the factory.
The instance must satisfy [PrismaLike](#api-prismalike) ($executeRaw, $queryRaw).

<a id="api-retry-2"></a>

##### retry?

```ts
optional retry?: OutboxRetryOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:46](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L46)

<a id="api-stuckthreshold-1"></a>

##### ~~stuckThreshold?~~

```ts
optional stuckThreshold?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:57](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L57)

###### Deprecated

Use lease.duration. Retained as a lease-duration compatibility alias.

<a id="api-tenancy-1"></a>

##### tenancy?

```ts
optional tenancy?: OutboxTenancyOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:50](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L50)

<a id="api-transport-2"></a>

##### transport?

```ts
optional transport?: Type<
  | OutboxTransport
| OutboxPublisher>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:48](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L48)

Custom transport class. Defaults to LocalTransport (in-process handler invocation).

<a id="api-wakeup-1"></a>

##### wakeup?

```ts
optional wakeup?: OutboxWakeupOptions;
```

Defined in: [src/interfaces/outbox-options.interface.ts:52](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L52)

***

<a id="api-outboxoptionsfactory"></a>

### OutboxOptionsFactory

Defined in: [src/interfaces/outbox-options.interface.ts:89](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L89)

#### Methods

<a id="api-createoutboxoptions"></a>

##### createOutboxOptions()

```ts
createOutboxOptions():
  | OutboxAsyncRuntimeOptions
| Promise<OutboxAsyncRuntimeOptions>;
```

Defined in: [src/interfaces/outbox-options.interface.ts:90](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L90)

###### Returns

  \| [`OutboxAsyncRuntimeOptions`](#api-outboxasyncruntimeoptions)
  \| `Promise`\<[`OutboxAsyncRuntimeOptions`](#api-outboxasyncruntimeoptions)\>

***

<a id="api-outboxpageoptions"></a>

### OutboxPageOptions

Defined in: [src/interfaces/outbox-admin.interface.ts:23](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L23)

#### Extends

- [`OutboxListOptions`](#api-outboxlistoptions)

#### Properties

<a id="api-after-1"></a>

##### after?

```ts
optional after?: Date;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:18](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L18)

###### Inherited from

[`OutboxListOptions`](#api-outboxlistoptions).[`after`](#api-after)

<a id="api-before-1"></a>

##### before?

```ts
optional before?: Date;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:17](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L17)

###### Inherited from

[`OutboxListOptions`](#api-outboxlistoptions).[`before`](#api-before)

<a id="api-cursor"></a>

##### cursor?

```ts
optional cursor?: string;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:25](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L25)

Opaque exclusive continuation cursor returned by a previous page.

<a id="api-eventtype-4"></a>

##### eventType?

```ts
optional eventType?: string;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:14](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L14)

###### Inherited from

[`OutboxListOptions`](#api-outboxlistoptions).[`eventType`](#api-eventtype-3)

<a id="api-limit-1"></a>

##### limit?

```ts
optional limit?: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:16](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L16)

###### Inherited from

[`OutboxListOptions`](#api-outboxlistoptions).[`limit`](#api-limit)

<a id="api-status-1"></a>

##### status?

```ts
optional status?: "PENDING" | "PROCESSING" | "SENT" | "FAILED";
```

Defined in: [src/interfaces/outbox-admin.interface.ts:13](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L13)

###### Inherited from

[`OutboxListOptions`](#api-outboxlistoptions).[`status`](#api-status)

<a id="api-tenantid-4"></a>

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:15](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L15)

###### Inherited from

[`OutboxListOptions`](#api-outboxlistoptions).[`tenantId`](#api-tenantid-3)

***

<a id="api-outboxpollcontext"></a>

### OutboxPollContext

Defined in: [src/interfaces/outbox-hooks.interface.ts:17](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L17)

#### Properties

<a id="api-batchsize"></a>

##### batchSize

```ts
readonly batchSize: number;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:18](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L18)

<a id="api-deliverymode"></a>

##### deliveryMode

```ts
readonly deliveryMode: "local" | "publisher";
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:19](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L19)

***

<a id="api-outboxpollingoptions"></a>

### OutboxPollingOptions

Defined in: [src/interfaces/outbox-options.interface.ts:11](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L11)

#### Properties

<a id="api-batchsize-1"></a>

##### batchSize?

```ts
optional batchSize?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:14](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L14)

<a id="api-enabled"></a>

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/outbox-options.interface.ts:12](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L12)

<a id="api-interval"></a>

##### interval?

```ts
optional interval?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:13](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L13)

***

<a id="api-outboxpublisher"></a>

### OutboxPublisher

Defined in: [src/interfaces/outbox-publisher.interface.ts:3](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-publisher.interface.ts#L3)

#### Methods

<a id="api-publish"></a>

##### publish()

```ts
publish(record): Promise<void>;
```

Defined in: [src/interfaces/outbox-publisher.interface.ts:4](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-publisher.interface.ts#L4)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `record` | [`OutboxRecord`](#api-outboxrecord) |

###### Returns

`Promise`\<`void`\>

***

<a id="api-outboxrecord"></a>

### OutboxRecord

Defined in: [src/interfaces/outbox-record.interface.ts:1](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L1)

#### Properties

<a id="api-aggregateid-2"></a>

##### aggregateId

```ts
readonly aggregateId: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:15](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L15)

<a id="api-aggregatetype-2"></a>

##### aggregateType

```ts
readonly aggregateType: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:14](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L14)

<a id="api-causationid-2"></a>

##### causationId

```ts
readonly causationId: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:19](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L19)

<a id="api-correlationid-2"></a>

##### correlationId

```ts
readonly correlationId: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:18](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L18)

<a id="api-createdat"></a>

##### createdAt

```ts
readonly createdAt: Date;
```

Defined in: [src/interfaces/outbox-record.interface.ts:6](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L6)

<a id="api-eventtype-5"></a>

##### eventType

```ts
readonly eventType: string;
```

Defined in: [src/interfaces/outbox-record.interface.ts:3](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L3)

<a id="api-headers-3"></a>

##### headers

```ts
readonly headers: Readonly<Record<string, string>>;
```

Defined in: [src/interfaces/outbox-record.interface.ts:20](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L20)

<a id="api-id"></a>

##### id

```ts
readonly id: string;
```

Defined in: [src/interfaces/outbox-record.interface.ts:2](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L2)

<a id="api-idempotencykey-2"></a>

##### idempotencyKey

```ts
readonly idempotencyKey: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:17](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L17)

<a id="api-lasterror"></a>

##### lastError

```ts
readonly lastError: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:12](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L12)

<a id="api-maxretries-1"></a>

##### maxRetries

```ts
readonly maxRetries: number;
```

Defined in: [src/interfaces/outbox-record.interface.ts:11](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L11)

<a id="api-nextattemptat"></a>

##### nextAttemptAt

```ts
readonly nextAttemptAt: Date | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:9](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L9)

<a id="api-occurredat-1"></a>

##### occurredAt

```ts
readonly occurredAt: Date;
```

Defined in: [src/interfaces/outbox-record.interface.ts:21](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L21)

<a id="api-partitionkey-2"></a>

##### partitionKey

```ts
readonly partitionKey: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:16](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L16)

<a id="api-payload-2"></a>

##### payload

```ts
readonly payload: Readonly<Record<string, unknown>>;
```

Defined in: [src/interfaces/outbox-record.interface.ts:4](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L4)

<a id="api-processedat"></a>

##### processedAt

```ts
readonly processedAt: Date | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:8](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L8)

<a id="api-retrycount-2"></a>

##### retryCount

```ts
readonly retryCount: number;
```

Defined in: [src/interfaces/outbox-record.interface.ts:10](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L10)

<a id="api-status-2"></a>

##### status

```ts
readonly status: "PENDING" | "PROCESSING" | "SENT" | "FAILED";
```

Defined in: [src/interfaces/outbox-record.interface.ts:5](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L5)

<a id="api-tenantid-5"></a>

##### tenantId

```ts
readonly tenantId: string | null;
```

Defined in: [src/interfaces/outbox-record.interface.ts:13](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L13)

<a id="api-updatedat"></a>

##### updatedAt

```ts
readonly updatedAt: Date;
```

Defined in: [src/interfaces/outbox-record.interface.ts:7](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-record.interface.ts#L7)

***

<a id="api-outboxretrycontext"></a>

### OutboxRetryContext

Defined in: [src/interfaces/outbox-hooks.interface.ts:38](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L38)

#### Extends

- [`OutboxDispatchContext`](#api-outboxdispatchcontext)

#### Properties

<a id="api-aggregateid-3"></a>

##### aggregateId

```ts
readonly aggregateId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:30](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L30)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`aggregateId`](#api-aggregateid)

<a id="api-aggregatetype-3"></a>

##### aggregateType

```ts
readonly aggregateType: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:29](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L29)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`aggregateType`](#api-aggregatetype)

<a id="api-causationid-3"></a>

##### causationId

```ts
readonly causationId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:34](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L34)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`causationId`](#api-causationid)

<a id="api-correlationid-3"></a>

##### correlationId

```ts
readonly correlationId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:33](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L33)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`correlationId`](#api-correlationid)

<a id="api-error"></a>

##### error

```ts
readonly error: Error;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:39](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L39)

<a id="api-eventid-3"></a>

##### eventId

```ts
readonly eventId: string;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:24](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L24)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`eventId`](#api-eventid)

<a id="api-eventtype-6"></a>

##### eventType

```ts
readonly eventType: string;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:25](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L25)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`eventType`](#api-eventtype)

<a id="api-headers-4"></a>

##### headers

```ts
readonly headers: Readonly<Record<string, string>>;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:35](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L35)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`headers`](#api-headers)

<a id="api-idempotencykey-3"></a>

##### idempotencyKey

```ts
readonly idempotencyKey: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:32](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L32)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`idempotencyKey`](#api-idempotencykey)

<a id="api-maxretries-2"></a>

##### maxRetries

```ts
readonly maxRetries: number;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:41](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L41)

###### Overrides

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`maxRetries`](#api-maxretries)

<a id="api-partitionkey-3"></a>

##### partitionKey

```ts
readonly partitionKey: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:31](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L31)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`partitionKey`](#api-partitionkey)

<a id="api-record-2"></a>

##### record

```ts
readonly record: OutboxRecord;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:23](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L23)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`record`](#api-record)

<a id="api-retrycount-3"></a>

##### retryCount

```ts
readonly retryCount: number;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:40](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L40)

###### Overrides

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`retryCount`](#api-retrycount)

<a id="api-tenantid-6"></a>

##### tenantId

```ts
readonly tenantId: string | null;
```

Defined in: [src/interfaces/outbox-hooks.interface.ts:26](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-hooks.interface.ts#L26)

###### Inherited from

[`OutboxDispatchContext`](#api-outboxdispatchcontext).[`tenantId`](#api-tenantid)

***

<a id="api-outboxretryoptions"></a>

### OutboxRetryOptions

Defined in: [src/interfaces/outbox-options.interface.ts:17](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L17)

#### Properties

<a id="api-backoff"></a>

##### backoff?

```ts
optional backoff?: "fixed" | "exponential";
```

Defined in: [src/interfaces/outbox-options.interface.ts:19](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L19)

<a id="api-initialdelay"></a>

##### initialDelay?

```ts
optional initialDelay?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:20](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L20)

<a id="api-maxdelay"></a>

##### maxDelay?

```ts
optional maxDelay?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:22](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L22)

Maximum persisted retry delay in milliseconds. Defaults to 24 hours.

<a id="api-maxretries-3"></a>

##### maxRetries?

```ts
optional maxRetries?: number;
```

Defined in: [src/interfaces/outbox-options.interface.ts:18](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-options.interface.ts#L18)

***

<a id="api-outboxstats"></a>

### OutboxStats

Defined in: [src/interfaces/outbox-admin.interface.ts:3](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L3)

#### Properties

<a id="api-failed"></a>

##### failed

```ts
failed: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:7](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L7)

<a id="api-oldestpendingagems"></a>

##### oldestPendingAgeMs

```ts
oldestPendingAgeMs: number | null;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:8](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L8)

<a id="api-oldestprocessingagems"></a>

##### oldestProcessingAgeMs

```ts
oldestProcessingAgeMs: number | null;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:9](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L9)

<a id="api-pending"></a>

##### pending

```ts
pending: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:4](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L4)

<a id="api-processing"></a>

##### processing

```ts
processing: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:5](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L5)

<a id="api-sent"></a>

##### sent

```ts
sent: number;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:6](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L6)

***

<a id="api-outboxtenancyoptions"></a>

### OutboxTenancyOptions

Defined in: [src/interfaces/outbox-tenancy.interface.ts:14](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-tenancy.interface.ts#L14)

#### Properties

<a id="api-policy"></a>

##### policy?

```ts
optional policy?: OutboxTenantPolicy;
```

Defined in: [src/interfaces/outbox-tenancy.interface.ts:20](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-tenancy.interface.ts#L20)

Controls producer tenant resolution. Defaults to `optional` for
compatibility with non-tenant applications.

<a id="api-provider"></a>

##### provider?

```ts
optional provider?:
  | OutboxTenantProvider
| Type<OutboxTenantProvider>;
```

Defined in: [src/interfaces/outbox-tenancy.interface.ts:15](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-tenancy.interface.ts#L15)

***

<a id="api-outboxtenantprovider"></a>

### OutboxTenantProvider

Defined in: [src/interfaces/outbox-tenancy.interface.ts:5](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-tenancy.interface.ts#L5)

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

Defined in: [src/interfaces/outbox-tenancy.interface.ts:6](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-tenancy.interface.ts#L6)

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

Defined in: [src/interfaces/outbox-tenancy.interface.ts:11](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-tenancy.interface.ts#L11)

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

Defined in: [src/interfaces/outbox-transport.interface.ts:5](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-transport.interface.ts#L5)

#### Methods

<a id="api-dispatch-1"></a>

##### dispatch()

```ts
dispatch(
   record,
   handlers,
context?): Promise<void>;
```

Defined in: [src/interfaces/outbox-transport.interface.ts:6](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-transport.interface.ts#L6)

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

Defined in: [src/interfaces/outbox-wakeup.interface.ts:17](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L17)

#### Properties

<a id="api-channel-1"></a>

##### channel?

```ts
optional channel?: string;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:19](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L19)

<a id="api-clientfactory"></a>

##### clientFactory?

```ts
optional clientFactory?: () =>
  | OutboxNotificationClient
  | Promise<OutboxNotificationClient | null>
  | null;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:23](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L23)

###### Returns

  \| [`OutboxNotificationClient`](#api-outboxnotificationclient)
  \| `Promise`\<[`OutboxNotificationClient`](#api-outboxnotificationclient) \| `null`\>
  \| `null`

<a id="api-connectionstring"></a>

##### connectionString?

```ts
optional connectionString?: string;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:20](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L20)

<a id="api-enabled-1"></a>

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:18](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L18)

<a id="api-reconnectdelay"></a>

##### reconnectDelay?

```ts
optional reconnectDelay?: number;
```

Defined in: [src/interfaces/outbox-wakeup.interface.ts:22](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-wakeup.interface.ts#L22)

Base reconnect delay. Consecutive failures back off exponentially.

## Type Aliases

<a id="api-outboxadminmutationresult"></a>

### OutboxAdminMutationResult

```ts
type OutboxAdminMutationResult =
  | {
  outcome: "applied";
}
  | {
  outcome: "not_found";
}
  | {
  currentStatus: OutboxRecord["status"];
  outcome: "conflict";
}
  | {
  outcome: "lost_claim";
};
```

Defined in: [src/interfaces/outbox-admin.interface.ts:46](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L46)

***

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

Defined in: [src/interfaces/outbox-emit-options.interface.ts:28](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-emit-options.interface.ts#L28)

***

<a id="api-outboxemitoptions"></a>

### OutboxEmitOptions

```ts
type OutboxEmitOptions = OutboxEmitMetadata &
  | {
  tenantId?: string;
  tenantScope?: never;
}
  | {
  tenantId?: never;
  tenantScope: "global";
};
```

Defined in: [src/interfaces/outbox-emit-options.interface.ts:14](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-emit-options.interface.ts#L14)

***

<a id="api-outboxenvelopeerrorreason-1"></a>

### OutboxEnvelopeErrorReason

```ts
type OutboxEnvelopeErrorReason =
  | "invalid_type"
  | "empty"
  | "too_long"
  | "invalid_date"
  | "unsupported_json_value"
  | "circular"
  | "too_deep"
  | "too_large";
```

Defined in: [src/errors/outbox-envelope.error.ts:3](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-envelope.error.ts#L3)

***

<a id="api-outboxtenantlistoptions"></a>

### OutboxTenantListOptions

```ts
type OutboxTenantListOptions = Omit<OutboxListOptions, "tenantId">;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:21](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L21)

***

<a id="api-outboxtenantpageoptions"></a>

### OutboxTenantPageOptions

```ts
type OutboxTenantPageOptions = Omit<OutboxPageOptions, "tenantId">;
```

Defined in: [src/interfaces/outbox-admin.interface.ts:28](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-admin.interface.ts#L28)

***

<a id="api-outboxtenantpolicy"></a>

### OutboxTenantPolicy

```ts
type OutboxTenantPolicy = "optional" | "required" | "require-match";
```

Defined in: [src/interfaces/outbox-tenancy.interface.ts:3](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/outbox-tenancy.interface.ts#L3)

***

<a id="api-prismalike"></a>

### PrismaLike

```ts
type PrismaLike = PrismaTransactionClient & {
  $executeRawUnsafe?: Promise<number>;
  $queryRawUnsafe?: Promise<T>;
};
```

Defined in: [src/interfaces/prisma-transaction-client.interface.ts:16](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/prisma-transaction-client.interface.ts#L16)

Minimal type for PrismaService instance (used by OutboxPoller for polling queries).

#### Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `$executeRawUnsafe()?` | (`query`, ...`values`) => `Promise`\<`number`\> | [src/interfaces/prisma-transaction-client.interface.ts:17](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/prisma-transaction-client.interface.ts#L17) |
| `$queryRawUnsafe()?` | (`query`, ...`values`) => `Promise`\<`T`\> | [src/interfaces/prisma-transaction-client.interface.ts:18](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/prisma-transaction-client.interface.ts#L18) |

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

Defined in: [src/interfaces/prisma-transaction-client.interface.ts:2](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/prisma-transaction-client.interface.ts#L2)

Minimal type for Prisma interactive transaction client (inside $transaction callback).

#### Methods

<a id="api-executeraw"></a>

##### $executeRaw()

```ts
$executeRaw(query, ...values): Promise<number>;
```

Defined in: [src/interfaces/prisma-transaction-client.interface.ts:3](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/prisma-transaction-client.interface.ts#L3)

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

Defined in: [src/interfaces/prisma-transaction-client.interface.ts:7](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/prisma-transaction-client.interface.ts#L7)

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

Defined in: [src/interfaces/prisma-transaction-client.interface.ts:8](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/prisma-transaction-client.interface.ts#L8)

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

Defined in: [src/interfaces/prisma-transaction-client.interface.ts:12](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/interfaces/prisma-transaction-client.interface.ts#L12)

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

Defined in: [src/outbox.constants.ts:4](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.constants.ts#L4)

***

<a id="api-outbox_invalid_configuration"></a>

### OUTBOX\_INVALID\_CONFIGURATION

```ts
const OUTBOX_INVALID_CONFIGURATION: "OUTBOX_INVALID_CONFIGURATION" = 'OUTBOX_INVALID_CONFIGURATION';
```

Defined in: [src/errors/outbox-configuration.error.ts:1](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-configuration.error.ts#L1)

***

<a id="api-outbox_invalid_cursor"></a>

### OUTBOX\_INVALID\_CURSOR

```ts
const OUTBOX_INVALID_CURSOR: "OUTBOX_INVALID_CURSOR";
```

Defined in: [src/errors/outbox-cursor.error.ts:1](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-cursor.error.ts#L1)

***

<a id="api-outbox_invalid_envelope"></a>

### OUTBOX\_INVALID\_ENVELOPE

```ts
const OUTBOX_INVALID_ENVELOPE: "OUTBOX_INVALID_ENVELOPE";
```

Defined in: [src/errors/outbox-envelope.error.ts:1](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-envelope.error.ts#L1)

***

<a id="api-outbox_options"></a>

### OUTBOX\_OPTIONS

```ts
const OUTBOX_OPTIONS: typeof OUTBOX_OPTIONS;
```

Defined in: [src/outbox.constants.ts:1](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.constants.ts#L1)

***

<a id="api-outbox_persisted_invariant_violation"></a>

### OUTBOX\_PERSISTED\_INVARIANT\_VIOLATION

```ts
const OUTBOX_PERSISTED_INVARIANT_VIOLATION: "OUTBOX_PERSISTED_INVARIANT_VIOLATION" = 'OUTBOX_PERSISTED_INVARIANT_VIOLATION';
```

Defined in: [src/errors/outbox-persisted-invariant.error.ts:1](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-persisted-invariant.error.ts#L1)

***

<a id="api-outbox_schema_mismatch"></a>

### OUTBOX\_SCHEMA\_MISMATCH

```ts
const OUTBOX_SCHEMA_MISMATCH: "OUTBOX_SCHEMA_MISMATCH";
```

Defined in: [src/errors/outbox-schema.error.ts:1](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-schema.error.ts#L1)

***

<a id="api-outbox_tenant_provider"></a>

### OUTBOX\_TENANT\_PROVIDER

```ts
const OUTBOX_TENANT_PROVIDER: typeof OUTBOX_TENANT_PROVIDER;
```

Defined in: [src/outbox.constants.ts:3](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.constants.ts#L3)

***

<a id="api-outbox_transport"></a>

### OUTBOX\_TRANSPORT

```ts
const OUTBOX_TRANSPORT: typeof OUTBOX_TRANSPORT;
```

Defined in: [src/outbox.constants.ts:2](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.constants.ts#L2)

***

<a id="api-outbox_wakeup_unavailable"></a>

### OUTBOX\_WAKEUP\_UNAVAILABLE

```ts
const OUTBOX_WAKEUP_UNAVAILABLE: "OUTBOX_WAKEUP_UNAVAILABLE";
```

Defined in: [src/errors/outbox-wakeup-unavailable.error.ts:1](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/errors/outbox-wakeup-unavailable.error.ts#L1)

***

<a id="api-required_outbox_schema_version"></a>

### REQUIRED\_OUTBOX\_SCHEMA\_VERSION

```ts
const REQUIRED_OUTBOX_SCHEMA_VERSION: "0.3.0" = '0.3.0';
```

Defined in: [src/outbox.schema.ts:6](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.schema.ts#L6)

## Functions

<a id="api-onoutboxevent"></a>

### OnOutboxEvent()

```ts
function OnOutboxEvent(...events): MethodDecorator;
```

Defined in: [src/outbox.decorator.ts:9](https://github.com/nestarc/outbox/blob/0e94c8df97bebb5cd85ee119a7608209a0c9e61b/src/outbox.decorator.ts#L9)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`events` | `OutboxEventClass`[] |

#### Returns

`MethodDecorator`

## References

<a id="api-outboxoperatorservice"></a>

### OutboxOperatorService

Renames and re-exports [OutboxAdminService](#api-outboxadminservice)
