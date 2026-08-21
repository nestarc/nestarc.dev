# @nestarc/audit-log

## Classes

<a id="api-auditactormiddleware"></a>

### AuditActorMiddleware

Defined in: [src/middleware/audit-actor.middleware.ts:9](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/middleware/audit-actor.middleware.ts#L9)

#### Implements

- `NestMiddleware`

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new AuditActorMiddleware(options): AuditActorMiddleware;
```

Defined in: [src/middleware/audit-actor.middleware.ts:10](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/middleware/audit-actor.middleware.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditLogModuleOptions`](#api-auditlogmoduleoptions) |

###### Returns

[`AuditActorMiddleware`](#api-auditactormiddleware)

#### Methods

<a id="api-use"></a>

##### use()

```ts
use(
   req,
   _res,
next): Promise<void>;
```

Defined in: [src/middleware/audit-actor.middleware.ts:15](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/middleware/audit-actor.middleware.ts#L15)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `any` |
| `_res` | `any` |
| `next` | () => `void` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
NestMiddleware.use
```

***

<a id="api-auditcontext"></a>

### AuditContext

Defined in: [src/services/audit-context.ts:12](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L12)

#### Constructors

<a id="api-constructor-1"></a>

##### Constructor

```ts
new AuditContext(): AuditContext;
```

###### Returns

[`AuditContext`](#api-auditcontext)

#### Methods

<a id="api-getactionoverride"></a>

##### getActionOverride()

```ts
static getActionOverride(): string | undefined;
```

Defined in: [src/services/audit-context.ts:35](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L35)

###### Returns

`string` \| `undefined`

<a id="api-getactor"></a>

##### getActor()

```ts
static getActor(): AuditActor | null;
```

Defined in: [src/services/audit-context.ts:27](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L27)

###### Returns

[`AuditActor`](#api-auditactor) \| `null`

<a id="api-getmetadata"></a>

##### getMetadata()

```ts
static getMetadata(): Record<string, unknown> | undefined;
```

Defined in: [src/services/audit-context.ts:48](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L48)

###### Returns

`Record`\<`string`, `unknown`\> \| `undefined`

<a id="api-getreason"></a>

##### getReason()

```ts
static getReason(): string | undefined;
```

Defined in: [src/services/audit-context.ts:58](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L58)

###### Returns

`string` \| `undefined`

<a id="api-getstore"></a>

##### getStore()

```ts
static getStore(): AuditContextStore | undefined;
```

Defined in: [src/services/audit-context.ts:23](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L23)

###### Returns

[`AuditContextStore`](#api-auditcontextstore) \| `undefined`

<a id="api-isnoaudit"></a>

##### isNoAudit()

```ts
static isNoAudit(): boolean;
```

Defined in: [src/services/audit-context.ts:31](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L31)

###### Returns

`boolean`

<a id="api-run"></a>

##### run()

```ts
static run<T>(store, fn): T;
```

Defined in: [src/services/audit-context.ts:15](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L15)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `store` | [`AuditContextStore`](#api-auditcontextstore) |
| `fn` | () => `T` |

###### Returns

`T`

<a id="api-runas"></a>

##### runAs()

```ts
static runAs<T>(actor, fn): T;
```

Defined in: [src/services/audit-context.ts:19](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L19)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `actor` | [`AuditActor`](#api-auditactor) |
| `fn` | () => `T` |

###### Returns

`T`

<a id="api-setmetadata"></a>

##### setMetadata()

```ts
static setMetadata(metadata): void;
```

Defined in: [src/services/audit-context.ts:39](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `metadata` | `Record`\<`string`, `unknown`\> |

###### Returns

`void`

<a id="api-setreason"></a>

##### setReason()

```ts
static setReason(reason): void;
```

Defined in: [src/services/audit-context.ts:52](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L52)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `reason` | `string` |

###### Returns

`void`

***

<a id="api-auditinterceptor"></a>

### AuditInterceptor

Defined in: [src/interceptors/audit.interceptor.ts:15](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interceptors/audit.interceptor.ts#L15)

#### Implements

- `NestInterceptor`

#### Constructors

<a id="api-constructor-2"></a>

##### Constructor

```ts
new AuditInterceptor(reflector): AuditInterceptor;
```

Defined in: [src/interceptors/audit.interceptor.ts:16](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interceptors/audit.interceptor.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `reflector` | `Reflector` |

###### Returns

[`AuditInterceptor`](#api-auditinterceptor)

#### Methods

<a id="api-intercept"></a>

##### intercept()

```ts
intercept(context, next): Observable<any>;
```

Defined in: [src/interceptors/audit.interceptor.ts:18](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interceptors/audit.interceptor.ts#L18)

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

<a id="api-auditlogmodule"></a>

### AuditLogModule

Defined in: [src/audit-log.module.ts:20](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/audit-log.module.ts#L20)

#### Implements

- `NestModule`

#### Constructors

<a id="api-constructor-3"></a>

##### Constructor

```ts
new AuditLogModule(options): AuditLogModule;
```

Defined in: [src/audit-log.module.ts:21](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/audit-log.module.ts#L21)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditLogModuleOptions`](#api-auditlogmoduleoptions) |

###### Returns

[`AuditLogModule`](#api-auditlogmodule)

#### Methods

<a id="api-configure"></a>

##### configure()

```ts
configure(consumer): void;
```

Defined in: [src/audit-log.module.ts:26](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/audit-log.module.ts#L26)

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

Defined in: [src/audit-log.module.ts:33](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/audit-log.module.ts#L33)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditLogModuleOptions`](#api-auditlogmoduleoptions) |

###### Returns

`DynamicModule`

<a id="api-forrootasync"></a>

##### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [src/audit-log.module.ts:52](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/audit-log.module.ts#L52)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditLogModuleAsyncOptions`](#api-auditlogmoduleasyncoptions) |

###### Returns

`DynamicModule`

***

<a id="api-auditservice"></a>

### AuditService

Defined in: [src/services/audit.service.ts:65](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L65)

#### Constructors

<a id="api-constructor-4"></a>

##### Constructor

```ts
new AuditService(options): AuditService;
```

Defined in: [src/services/audit.service.ts:71](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L71)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditLogModuleOptions`](#api-auditlogmoduleoptions) |

###### Returns

[`AuditService`](#api-auditservice)

#### Methods

<a id="api-exportcsv"></a>

##### exportCsv()

```ts
exportCsv(options): Readable;
```

Defined in: [src/services/audit.service.ts:327](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L327)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditCsvOptions`](#api-auditcsvoptions) |

###### Returns

`Readable`

<a id="api-getbyid"></a>

##### getById()

```ts
getById(id, options?): Promise<AuditEntry | null>;
```

Defined in: [src/services/audit.service.ts:283](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L283)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `options` | [`AuditGetByIdOptions`](#api-auditgetbyidoptions) |

###### Returns

`Promise`\<[`AuditEntry`](#api-auditentry) \| `null`\>

<a id="api-log"></a>

##### log()

```ts
log(input, tx?): Promise<void>;
```

Defined in: [src/services/audit.service.ts:83](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L83)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ManualAuditLogInput`](#api-manualauditloginput) |
| `tx?` | `any` |

###### Returns

`Promise`\<`void`\>

<a id="api-prune"></a>

##### prune()

```ts
prune(options): Promise<AuditPruneResult>;
```

Defined in: [src/services/audit.service.ts:618](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L618)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditPruneOptions`](#api-auditpruneoptions) |

###### Returns

`Promise`\<[`AuditPruneResult`](#api-auditpruneresult)\>

<a id="api-query"></a>

##### query()

```ts
query(options): Promise<AuditQueryResult>;
```

Defined in: [src/services/audit.service.ts:162](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L162)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditQueryOptions`](#api-auditqueryoptions) |

###### Returns

`Promise`\<[`AuditQueryResult`](#api-auditqueryresult)\>

<a id="api-scan"></a>

##### scan()

```ts
scan(options): AsyncIterable<AuditScanPage>;
```

Defined in: [src/services/audit.service.ts:322](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L322)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditScanOptions`](#api-auditscanoptions) |

###### Returns

`AsyncIterable`\<[`AuditScanPage`](#api-auditscanpage)\>

***

<a id="api-auditstreamdeliveryerror"></a>

### AuditStreamDeliveryError

Defined in: [src/stream/audit-stream.ts:79](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L79)

#### Extends

- `Error`

#### Constructors

<a id="api-constructor-5"></a>

##### Constructor

```ts
new AuditStreamDeliveryError(message, options): AuditStreamDeliveryError;
```

Defined in: [src/stream/audit-stream.ts:84](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L84)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `options` | \{ `cause?`: `unknown`; `retryAfterMs?`: `number`; `status?`: `number`; `terminal`: `boolean`; \} |
| `options.cause?` | `unknown` |
| `options.retryAfterMs?` | `number` |
| `options.status?` | `number` |
| `options.terminal` | `boolean` |

###### Returns

[`AuditStreamDeliveryError`](#api-auditstreamdeliveryerror)

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

<a id="api-retryafterms"></a>

##### retryAfterMs?

```ts
readonly optional retryAfterMs?: number;
```

Defined in: [src/stream/audit-stream.ts:82](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L82)

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

<a id="api-status"></a>

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/stream/audit-stream.ts:81](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L81)

<a id="api-terminal"></a>

##### terminal

```ts
readonly terminal: boolean;
```

Defined in: [src/stream/audit-stream.ts:80](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L80)

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

```ts
Error.captureStackTrace
```

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

```ts
Error.prepareStackTrace
```

***

<a id="api-auditstreamrunner"></a>

### AuditStreamRunner

Defined in: [src/stream/audit-stream.ts:104](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L104)

#### Constructors

<a id="api-constructor-6"></a>

##### Constructor

```ts
new AuditStreamRunner(auditService, options): AuditStreamRunner;
```

Defined in: [src/stream/audit-stream.ts:105](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L105)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `auditService` | `Pick`\<[`AuditService`](#api-auditservice), `"scan"`\> |
| `options` | [`AuditStreamRunnerOptions`](#api-auditstreamrunneroptions) |

###### Returns

[`AuditStreamRunner`](#api-auditstreamrunner)

#### Methods

<a id="api-runonce"></a>

##### runOnce()

```ts
runOnce(input?): Promise<AuditStreamRunResult>;
```

Defined in: [src/stream/audit-stream.ts:112](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L112)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | \{ `signal?`: `AbortSignal`; \} |
| `input.signal?` | `AbortSignal` |

###### Returns

`Promise`\<[`AuditStreamRunResult`](#api-auditstreamrunresult)\>

***

<a id="api-datadogauditstreamsink"></a>

### DatadogAuditStreamSink

Defined in: [src/stream/provider-sinks.ts:19](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L19)

#### Implements

- [`AuditStreamSink`](#api-auditstreamsink)

#### Constructors

<a id="api-constructor-7"></a>

##### Constructor

```ts
new DatadogAuditStreamSink(options): DatadogAuditStreamSink;
```

Defined in: [src/stream/provider-sinks.ts:22](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`DatadogAuditStreamSinkOptions`](#api-datadogauditstreamsinkoptions) |

###### Returns

[`DatadogAuditStreamSink`](#api-datadogauditstreamsink)

#### Methods

<a id="api-deliver-1"></a>

##### deliver()

```ts
deliver(entries, context): Promise<void>;
```

Defined in: [src/stream/provider-sinks.ts:44](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L44)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `entries` | readonly [`AuditEntry`](#api-auditentry)[] |
| `context` | [`AuditStreamBatchContext`](#api-auditstreambatchcontext) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AuditStreamSink`](#api-auditstreamsink).[`deliver`](#api-deliver)

***

<a id="api-httpauditstreamsink"></a>

### HttpAuditStreamSink

Defined in: [src/stream/http-sink.ts:22](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/http-sink.ts#L22)

#### Implements

- [`AuditStreamSink`](#api-auditstreamsink)

#### Constructors

<a id="api-constructor-8"></a>

##### Constructor

```ts
new HttpAuditStreamSink(options): HttpAuditStreamSink;
```

Defined in: [src/stream/http-sink.ts:23](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/http-sink.ts#L23)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`HttpAuditStreamSinkOptions`](#api-httpauditstreamsinkoptions) |

###### Returns

[`HttpAuditStreamSink`](#api-httpauditstreamsink)

#### Methods

<a id="api-deliver-2"></a>

##### deliver()

```ts
deliver(entries, context): Promise<void>;
```

Defined in: [src/stream/http-sink.ts:35](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/http-sink.ts#L35)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `entries` | readonly [`AuditEntry`](#api-auditentry)[] |
| `context` | [`AuditStreamBatchContext`](#api-auditstreambatchcontext) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AuditStreamSink`](#api-auditstreamsink).[`deliver`](#api-deliver)

***

<a id="api-objectstorageauditstreamsink"></a>

### ObjectStorageAuditStreamSink

Defined in: [src/stream/provider-sinks.ts:115](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L115)

#### Implements

- [`AuditStreamSink`](#api-auditstreamsink)

#### Constructors

<a id="api-constructor-9"></a>

##### Constructor

```ts
new ObjectStorageAuditStreamSink(options): ObjectStorageAuditStreamSink;
```

Defined in: [src/stream/provider-sinks.ts:116](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L116)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`ObjectStorageAuditStreamSinkOptions`](#api-objectstorageauditstreamsinkoptions) |

###### Returns

[`ObjectStorageAuditStreamSink`](#api-objectstorageauditstreamsink)

#### Methods

<a id="api-deliver-3"></a>

##### deliver()

```ts
deliver(entries, context): Promise<void>;
```

Defined in: [src/stream/provider-sinks.ts:122](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L122)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `entries` | readonly [`AuditEntry`](#api-auditentry)[] |
| `context` | [`AuditStreamBatchContext`](#api-auditstreambatchcontext) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AuditStreamSink`](#api-auditstreamsink).[`deliver`](#api-deliver)

***

<a id="api-postgresauditstreamstore"></a>

### PostgresAuditStreamStore

Defined in: [src/stream/postgres-store.ts:23](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/postgres-store.ts#L23)

#### Implements

- [`AuditStreamCheckpointStore`](#api-auditstreamcheckpointstore)
- [`AuditStreamDeadLetterStore`](#api-auditstreamdeadletterstore)

#### Constructors

<a id="api-constructor-10"></a>

##### Constructor

```ts
new PostgresAuditStreamStore(options): PostgresAuditStreamStore;
```

Defined in: [src/stream/postgres-store.ts:30](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/postgres-store.ts#L30)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`PostgresAuditStreamStoreOptions`](#api-postgresauditstreamstoreoptions) |

###### Returns

[`PostgresAuditStreamStore`](#api-postgresauditstreamstore)

#### Methods

<a id="api-load-1"></a>

##### load()

```ts
load(streamId): Promise<AuditStreamState | null>;
```

Defined in: [src/stream/postgres-store.ts:40](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/postgres-store.ts#L40)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `streamId` | `string` |

###### Returns

`Promise`\<[`AuditStreamState`](#api-auditstreamstate) \| `null`\>

###### Implementation of

[`AuditStreamCheckpointStore`](#api-auditstreamcheckpointstore).[`load`](#api-load)

<a id="api-save-1"></a>

##### save()

```ts
save(streamId, state): Promise<void>;
```

Defined in: [src/stream/postgres-store.ts:51](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/postgres-store.ts#L51)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `streamId` | `string` |
| `state` | [`AuditStreamState`](#api-auditstreamstate) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AuditStreamCheckpointStore`](#api-auditstreamcheckpointstore).[`save`](#api-save)

<a id="api-write-1"></a>

##### write()

```ts
write(deadLetter): Promise<void>;
```

Defined in: [src/stream/postgres-store.ts:65](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/postgres-store.ts#L65)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deadLetter` | [`AuditStreamDeadLetter`](#api-auditstreamdeadletter) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AuditStreamDeadLetterStore`](#api-auditstreamdeadletterstore).[`write`](#api-write)

***

<a id="api-splunkauditstreamsink"></a>

### SplunkAuditStreamSink

Defined in: [src/stream/provider-sinks.ts:66](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L66)

#### Implements

- [`AuditStreamSink`](#api-auditstreamsink)

#### Constructors

<a id="api-constructor-11"></a>

##### Constructor

```ts
new SplunkAuditStreamSink(options): SplunkAuditStreamSink;
```

Defined in: [src/stream/provider-sinks.ts:69](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L69)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`SplunkAuditStreamSinkOptions`](#api-splunkauditstreamsinkoptions) |

###### Returns

[`SplunkAuditStreamSink`](#api-splunkauditstreamsink)

#### Methods

<a id="api-deliver-4"></a>

##### deliver()

```ts
deliver(entries, context): Promise<void>;
```

Defined in: [src/stream/provider-sinks.ts:92](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L92)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `entries` | readonly [`AuditEntry`](#api-auditentry)[] |
| `context` | [`AuditStreamBatchContext`](#api-auditstreambatchcontext) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AuditStreamSink`](#api-auditstreamsink).[`deliver`](#api-deliver)

## Interfaces

<a id="api-auditactor"></a>

### AuditActor

Defined in: [src/interfaces/actor.interface.ts:1](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/actor.interface.ts#L1)

#### Properties

<a id="api-id"></a>

##### id

```ts
id: string | null;
```

Defined in: [src/interfaces/actor.interface.ts:2](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/actor.interface.ts#L2)

<a id="api-ip"></a>

##### ip?

```ts
optional ip?: string;
```

Defined in: [src/interfaces/actor.interface.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/actor.interface.ts#L4)

<a id="api-type"></a>

##### type

```ts
type: "user" | "system" | "api_key";
```

Defined in: [src/interfaces/actor.interface.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/actor.interface.ts#L3)

***

<a id="api-auditcontextstore"></a>

### AuditContextStore

Defined in: [src/services/audit-context.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L4)

#### Properties

<a id="api-actionoverride"></a>

##### actionOverride?

```ts
optional actionOverride?: string;
```

Defined in: [src/services/audit-context.ts:7](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L7)

<a id="api-actor"></a>

##### actor

```ts
actor: AuditActor | null;
```

Defined in: [src/services/audit-context.ts:5](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L5)

<a id="api-metadata"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/services/audit-context.ts:8](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L8)

<a id="api-noaudit"></a>

##### noAudit

```ts
noAudit: boolean;
```

Defined in: [src/services/audit-context.ts:6](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L6)

<a id="api-reason"></a>

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/services/audit-context.ts:9](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L9)

***

<a id="api-auditdatabasemapping"></a>

### AuditDatabaseMapping

Defined in: [src/prisma/audit-extension.ts:62](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L62)

#### Properties

<a id="api-primarykeycolumn"></a>

##### primaryKeyColumn?

```ts
optional primaryKeyColumn?: string;
```

Defined in: [src/prisma/audit-extension.ts:68](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L68)

Database column for the configured logical primary key field.

<a id="api-schema"></a>

##### schema?

```ts
optional schema?: string;
```

Defined in: [src/prisma/audit-extension.ts:66](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L66)

PostgreSQL schema name. Defaults to the connection's current schema.

<a id="api-tablename"></a>

##### tableName

```ts
tableName: string;
```

Defined in: [src/prisma/audit-extension.ts:64](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L64)

PostgreSQL table name used by the Prisma model.

***

<a id="api-auditentry"></a>

### AuditEntry

Defined in: [src/interfaces/audit-entry.interface.ts:1](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L1)

#### Properties

<a id="api-action"></a>

##### action

```ts
action: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:7](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L7)

<a id="api-actorid"></a>

##### actorId

```ts
actorId: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L4)

<a id="api-actorip"></a>

##### actorIp

```ts
actorIp: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:6](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L6)

<a id="api-actortype"></a>

##### actorType

```ts
actorType: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:5](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L5)

<a id="api-changes"></a>

##### changes

```ts
changes:
  | Record<string, {
  after?: unknown;
  before?: unknown;
}>
  | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:11](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L11)

<a id="api-createdat"></a>

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/audit-entry.interface.ts:14](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L14)

<a id="api-id-1"></a>

##### id

```ts
id: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:2](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L2)

<a id="api-metadata-1"></a>

##### metadata

```ts
metadata: Record<string, unknown> | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:12](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L12)

<a id="api-result"></a>

##### result

```ts
result: "success" | "failure";
```

Defined in: [src/interfaces/audit-entry.interface.ts:13](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L13)

<a id="api-source"></a>

##### source

```ts
source: "auto" | "manual";
```

Defined in: [src/interfaces/audit-entry.interface.ts:10](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L10)

<a id="api-targetid"></a>

##### targetId

```ts
targetId: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:9](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L9)

<a id="api-targettype"></a>

##### targetType

```ts
targetType: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:8](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L8)

<a id="api-tenantid"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L3)

***

<a id="api-auditerrorcontext"></a>

### AuditErrorContext

Defined in: [src/interfaces/audit-shared-options.interface.ts:14](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L14)

#### Properties

<a id="api-action-1"></a>

##### action?

```ts
optional action?: string;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:18](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L18)

<a id="api-model"></a>

##### model?

```ts
optional model?: string;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:16](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L16)

<a id="api-operation"></a>

##### operation?

```ts
optional operation?: string;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:17](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L17)

<a id="api-phase"></a>

##### phase

```ts
phase: AuditErrorPhase;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:15](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L15)

<a id="api-targetid-1"></a>

##### targetId?

```ts
optional targetId?: string | null;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:19](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L19)

<a id="api-tenantid-1"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:20](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L20)

***

<a id="api-auditextensionoptions"></a>

### AuditExtensionOptions

Defined in: [src/prisma/audit-extension.ts:93](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L93)

Options shared by the Nest module and Prisma extension.
Runtime merging is intentionally not performed; pass the same object to both
call sites when both paths should share behavior.

#### Extends

- [`AuditSharedOptions`](#api-auditsharedoptions)

#### Properties

<a id="api-batchoverflow"></a>

##### batchOverflow?

```ts
optional batchOverflow?: AuditBatchOverflow;
```

Defined in: [src/prisma/audit-extension.ts:119](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L119)

Behavior when deleteMany matches more than maxBatchRecords. Defaults to
reject. Summary overflow is available only in best-effort mode.

<a id="api-consistency"></a>

##### consistency

```ts
consistency: AuditConsistency;
```

Defined in: [src/prisma/audit-extension.ts:98](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L98)

`atomic-required` rejects tracked writes outside withAuditTransaction().
`best-effort` preserves the legacy non-atomic behavior.

<a id="api-databasemapping"></a>

##### databaseMapping?

```ts
optional databaseMapping?: Record<string, AuditDatabaseMapping>;
```

Defined in: [src/prisma/audit-extension.ts:110](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L110)

Database identifiers used for atomic row locks. Required for models that
use Prisma mapping attributes when the generated Prisma namespace does
not expose public DMMF mapping metadata.

<a id="api-experimentaltxaudit"></a>

##### ~~experimentalTxAudit?~~

```ts
optional experimentalTxAudit?: boolean;
```

Defined in: [src/prisma/audit-extension.ts:129](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L129)

EXPERIMENTAL — no semver guarantee. Reserved for transaction-aware audit
routing when Prisma exposes a compatible internal transaction capability.
Default behavior remains best-effort outside the caller transaction.

###### Deprecated

Use consistency: 'atomic-required' with withAuditTransaction().

<a id="api-ignoredmodels"></a>

##### ignoredModels?

```ts
optional ignoredModels?: string[];
```

Defined in: [src/prisma/audit-extension.ts:100](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L100)

<a id="api-ignoretimestamponlyupdates"></a>

##### ignoreTimestampOnlyUpdates?

```ts
optional ignoreTimestampOnlyUpdates?: boolean;
```

Defined in: [src/prisma/audit-extension.ts:121](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L121)

<a id="api-logfailures"></a>

##### logFailures?

```ts
optional logFailures?: boolean;
```

Defined in: [src/prisma/audit-extension.ts:120](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L120)

<a id="api-logger"></a>

##### logger?

```ts
optional logger?: AuditLogger;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:33](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L33)

###### Inherited from

[`AuditSharedOptions`](#api-auditsharedoptions).[`logger`](#api-logger-2)

<a id="api-maxbatchrecords"></a>

##### maxBatchRecords?

```ts
optional maxBatchRecords?: number;
```

Defined in: [src/prisma/audit-extension.ts:114](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L114)

Maximum records that deleteMany may audit individually. Defaults to 1000.

<a id="api-onauditerror"></a>

##### onAuditError?

```ts
optional onAuditError?: (error, ctx) => void;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:32](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L32)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |
| `ctx` | [`AuditErrorContext`](#api-auditerrorcontext) |

###### Returns

`void`

###### Inherited from

[`AuditSharedOptions`](#api-auditsharedoptions).[`onAuditError`](#api-onauditerror-2)

<a id="api-primarykey"></a>

##### primaryKey?

```ts
optional primaryKey?: Record<string, string>;
```

Defined in: [src/prisma/audit-extension.ts:104](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L104)

Map of model name to primary key field name. Defaults to 'id'.

<a id="api-prismamodule"></a>

##### prismaModule?

```ts
optional prismaModule?: PrismaModuleLike;
```

Defined in: [src/prisma/audit-extension.ts:122](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L122)

<a id="api-sensitivefields"></a>

##### sensitiveFields?

```ts
optional sensitiveFields?: string[];
```

Defined in: [src/prisma/audit-extension.ts:101](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L101)

<a id="api-sensitivefieldsbymodel"></a>

##### sensitiveFieldsByModel?

```ts
optional sensitiveFieldsByModel?: Record<string, string[]>;
```

Defined in: [src/prisma/audit-extension.ts:102](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L102)

<a id="api-tablename-1"></a>

##### tableName?

```ts
optional tableName?: string;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:29](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L29)

###### Inherited from

[`AuditSharedOptions`](#api-auditsharedoptions).[`tableName`](#api-tablename-3)

<a id="api-tenantrequired"></a>

##### tenantRequired?

```ts
optional tenantRequired?: boolean;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:30](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L30)

###### Inherited from

[`AuditSharedOptions`](#api-auditsharedoptions).[`tenantRequired`](#api-tenantrequired-2)

<a id="api-tenantresolver"></a>

##### tenantResolver?

```ts
optional tenantResolver?: () => string | null;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:31](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L31)

###### Returns

`string` \| `null`

###### Inherited from

[`AuditSharedOptions`](#api-auditsharedoptions).[`tenantResolver`](#api-tenantresolver-2)

<a id="api-trackedmodels"></a>

##### trackedModels?

```ts
optional trackedModels?: string[];
```

Defined in: [src/prisma/audit-extension.ts:99](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L99)

***

<a id="api-auditgetbyidoptions"></a>

### AuditGetByIdOptions

Defined in: [src/interfaces/audit-entry.interface.ts:42](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L42)

#### Properties

<a id="api-alltenants"></a>

##### allTenants?

```ts
optional allTenants?: boolean;
```

Defined in: [src/interfaces/audit-entry.interface.ts:44](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L44)

<a id="api-tenantid-2"></a>

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:43](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L43)

***

<a id="api-auditlifecycleinput"></a>

### AuditLifecycleInput

Defined in: [src/prisma/audit-extension.ts:53](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L53)

#### Properties

<a id="api-action-2"></a>

##### action

```ts
action: string;
```

Defined in: [src/prisma/audit-extension.ts:55](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L55)

Deterministic lifecycle action, for example `User.softDeleted`.

<a id="api-metadata-2"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/prisma/audit-extension.ts:57](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L57)

Metadata merged into the ambient audit context for this mutation.

<a id="api-suppressouteroperation"></a>

##### suppressOuterOperation?

```ts
optional suppressOuterOperation?: {
  model: string;
  operation: "delete" | "deleteMany";
};
```

Defined in: [src/prisma/audit-extension.ts:59](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L59)

Internal extension-composition signal for a rewritten outer operation.

###### model

```ts
model: string;
```

###### operation

```ts
operation: "delete" | "deleteMany";
```

***

<a id="api-auditlogger"></a>

### AuditLogger

Defined in: [src/interfaces/audit-shared-options.interface.ts:2](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L2)

Minimal logger compatible with console and NestJS LoggerService.

#### Methods

<a id="api-error"></a>

##### error()

```ts
error(message): void;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L4)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

###### Returns

`void`

<a id="api-warn"></a>

##### warn()

```ts
warn(message): void;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L3)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

###### Returns

`void`

***

<a id="api-auditlogmoduleasyncoptions"></a>

### AuditLogModuleAsyncOptions

Defined in: [src/interfaces/audit-log-options.interface.ts:19](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-log-options.interface.ts#L19)

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

Defined in: [src/interfaces/audit-log-options.interface.ts:24](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-log-options.interface.ts#L24)

<a id="api-usefactory"></a>

##### useFactory

```ts
useFactory: (...args) =>
  | AuditLogModuleOptions
| Promise<AuditLogModuleOptions>;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:21](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-log-options.interface.ts#L21)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`AuditLogModuleOptions`](#api-auditlogmoduleoptions)
  \| `Promise`\<[`AuditLogModuleOptions`](#api-auditlogmoduleoptions)\>

***

<a id="api-auditlogmoduleoptions"></a>

### AuditLogModuleOptions

Defined in: [src/interfaces/audit-log-options.interface.ts:7](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-log-options.interface.ts#L7)

Options shared by the Nest module and Prisma extension.
Runtime merging is intentionally not performed; pass the same object to both
call sites when both paths should share behavior.

#### Extends

- [`AuditSharedOptions`](#api-auditsharedoptions)

#### Properties

<a id="api-actorextractor-1"></a>

##### actorExtractor

```ts
actorExtractor: ActorExtractor;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:9](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-log-options.interface.ts#L9)

<a id="api-correlationidgetter"></a>

##### correlationIdGetter?

```ts
optional correlationIdGetter?: (req) => string | undefined;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:16](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-log-options.interface.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `any` |

###### Returns

`string` \| `undefined`

<a id="api-correlationidheader"></a>

##### correlationIdHeader?

```ts
optional correlationIdHeader?: string;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:15](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-log-options.interface.ts#L15)

<a id="api-excluderoutes"></a>

##### excludeRoutes?

```ts
optional excludeRoutes?: RouteInfo[];
```

Defined in: [src/interfaces/audit-log-options.interface.ts:13](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-log-options.interface.ts#L13)

<a id="api-logger-1"></a>

##### logger?

```ts
optional logger?: AuditLogger;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:33](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L33)

###### Inherited from

[`AuditSharedOptions`](#api-auditsharedoptions).[`logger`](#api-logger-2)

<a id="api-onauditerror-1"></a>

##### onAuditError?

```ts
optional onAuditError?: (error, ctx) => void;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:32](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L32)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |
| `ctx` | [`AuditErrorContext`](#api-auditerrorcontext) |

###### Returns

`void`

###### Inherited from

[`AuditSharedOptions`](#api-auditsharedoptions).[`onAuditError`](#api-onauditerror-2)

<a id="api-prisma"></a>

##### prisma

```ts
prisma: any;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:8](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-log-options.interface.ts#L8)

<a id="api-prismamodule-1"></a>

##### prismaModule?

```ts
optional prismaModule?: PrismaModuleLike;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:10](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-log-options.interface.ts#L10)

<a id="api-registerglobalinterceptor"></a>

##### registerGlobalInterceptor?

```ts
optional registerGlobalInterceptor?: boolean;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:14](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-log-options.interface.ts#L14)

<a id="api-sensitivefields-1"></a>

##### sensitiveFields?

```ts
optional sensitiveFields?: string[];
```

Defined in: [src/interfaces/audit-log-options.interface.ts:11](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-log-options.interface.ts#L11)

<a id="api-sensitivefieldsbymodel-1"></a>

##### sensitiveFieldsByModel?

```ts
optional sensitiveFieldsByModel?: Record<string, string[]>;
```

Defined in: [src/interfaces/audit-log-options.interface.ts:12](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-log-options.interface.ts#L12)

<a id="api-tablename-2"></a>

##### tableName?

```ts
optional tableName?: string;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:29](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L29)

###### Inherited from

[`AuditSharedOptions`](#api-auditsharedoptions).[`tableName`](#api-tablename-3)

<a id="api-tenantrequired-1"></a>

##### tenantRequired?

```ts
optional tenantRequired?: boolean;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:30](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L30)

###### Inherited from

[`AuditSharedOptions`](#api-auditsharedoptions).[`tenantRequired`](#api-tenantrequired-2)

<a id="api-tenantresolver-1"></a>

##### tenantResolver?

```ts
optional tenantResolver?: () => string | null;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:31](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L31)

###### Returns

`string` \| `null`

###### Inherited from

[`AuditSharedOptions`](#api-auditsharedoptions).[`tenantResolver`](#api-tenantresolver-2)

***

<a id="api-auditobjectstorageclient"></a>

### AuditObjectStorageClient

Defined in: [src/stream/provider-sinks.ts:105](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L105)

#### Methods

<a id="api-putobject"></a>

##### putObject()

```ts
putObject(input): Promise<void>;
```

Defined in: [src/stream/provider-sinks.ts:106](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L106)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`AuditObjectStoragePutInput`](#api-auditobjectstorageputinput) |

###### Returns

`Promise`\<`void`\>

***

<a id="api-auditobjectstorageputinput"></a>

### AuditObjectStoragePutInput

Defined in: [src/stream/provider-sinks.ts:97](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L97)

#### Properties

<a id="api-body"></a>

##### body

```ts
body: string;
```

Defined in: [src/stream/provider-sinks.ts:99](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L99)

<a id="api-contenttype"></a>

##### contentType

```ts
contentType: string;
```

Defined in: [src/stream/provider-sinks.ts:100](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L100)

<a id="api-ifnonematch"></a>

##### ifNoneMatch

```ts
ifNoneMatch: "*";
```

Defined in: [src/stream/provider-sinks.ts:101](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L101)

<a id="api-key"></a>

##### key

```ts
key: string;
```

Defined in: [src/stream/provider-sinks.ts:98](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L98)

<a id="api-metadata-3"></a>

##### metadata

```ts
metadata: Record<string, string>;
```

Defined in: [src/stream/provider-sinks.ts:102](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L102)

***

<a id="api-auditpruneoptions"></a>

### AuditPruneOptions

Defined in: [src/services/audit.service.ts:42](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L42)

#### Properties

<a id="api-client"></a>

##### client?

```ts
optional client?: any;
```

Defined in: [src/services/audit.service.ts:46](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L46)

<a id="api-dryrun"></a>

##### dryRun?

```ts
optional dryRun?: boolean;
```

Defined in: [src/services/audit.service.ts:45](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L45)

<a id="api-maxwaitms"></a>

##### maxWaitMs?

```ts
optional maxWaitMs?: number;
```

Defined in: [src/services/audit.service.ts:48](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L48)

<a id="api-mode"></a>

##### mode?

```ts
optional mode?: "drop" | "detach";
```

Defined in: [src/services/audit.service.ts:44](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L44)

<a id="api-olderthan"></a>

##### olderThan

```ts
olderThan: Date;
```

Defined in: [src/services/audit.service.ts:43](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L43)

<a id="api-requiredcheckpoints"></a>

##### requiredCheckpoints?

```ts
optional requiredCheckpoints?: readonly string[];
```

Defined in: [src/services/audit.service.ts:53](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L53)

Last ACKed checkpoints for every required stream. Pruning is rejected when
it would pass any checkpoint and remove entries that stream has not ACKed.

<a id="api-timeoutms"></a>

##### timeoutMs?

```ts
optional timeoutMs?: number;
```

Defined in: [src/services/audit.service.ts:47](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L47)

***

<a id="api-auditpruneresult"></a>

### AuditPruneResult

Defined in: [src/services/audit.service.ts:56](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L56)

#### Properties

<a id="api-deletedrows"></a>

##### deletedRows

```ts
deletedRows: number | null;
```

Defined in: [src/services/audit.service.ts:60](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L60)

<a id="api-dryrun-1"></a>

##### dryRun

```ts
dryRun: boolean;
```

Defined in: [src/services/audit.service.ts:61](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L61)

<a id="api-layout"></a>

##### layout

```ts
layout: "flat" | "partitioned";
```

Defined in: [src/services/audit.service.ts:57](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L57)

<a id="api-mode-1"></a>

##### mode

```ts
mode: "drop" | "detach" | "delete";
```

Defined in: [src/services/audit.service.ts:58](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L58)

<a id="api-prunedpartitions"></a>

##### prunedPartitions

```ts
prunedPartitions: string[];
```

Defined in: [src/services/audit.service.ts:59](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit.service.ts#L59)

***

<a id="api-auditqueryoptions"></a>

### AuditQueryOptions

Defined in: [src/interfaces/audit-entry.interface.ts:17](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L17)

#### Properties

<a id="api-action-3"></a>

##### action?

```ts
optional action?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:20](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L20)

<a id="api-actorid-1"></a>

##### actorId?

```ts
optional actorId?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:18](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L18)

<a id="api-actortype-1"></a>

##### actorType?

```ts
optional actorType?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:19](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L19)

<a id="api-alltenants-1"></a>

##### allTenants?

```ts
optional allTenants?: boolean;
```

Defined in: [src/interfaces/audit-entry.interface.ts:30](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L30)

<a id="api-cursor"></a>

##### cursor?

```ts
optional cursor?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:31](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L31)

<a id="api-from"></a>

##### from?

```ts
optional from?: Date;
```

Defined in: [src/interfaces/audit-entry.interface.ts:25](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L25)

<a id="api-includetotal"></a>

##### includeTotal?

```ts
optional includeTotal?: boolean;
```

Defined in: [src/interfaces/audit-entry.interface.ts:32](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L32)

<a id="api-limit"></a>

##### limit?

```ts
optional limit?: number;
```

Defined in: [src/interfaces/audit-entry.interface.ts:27](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L27)

<a id="api-offset"></a>

##### offset?

```ts
optional offset?: number;
```

Defined in: [src/interfaces/audit-entry.interface.ts:28](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L28)

<a id="api-result-1"></a>

##### result?

```ts
optional result?: "success" | "failure";
```

Defined in: [src/interfaces/audit-entry.interface.ts:24](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L24)

<a id="api-source-1"></a>

##### source?

```ts
optional source?: "auto" | "manual";
```

Defined in: [src/interfaces/audit-entry.interface.ts:23](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L23)

<a id="api-targetid-2"></a>

##### targetId?

```ts
optional targetId?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:22](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L22)

<a id="api-targettype-1"></a>

##### targetType?

```ts
optional targetType?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:21](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L21)

<a id="api-tenantid-3"></a>

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:29](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L29)

<a id="api-to"></a>

##### to?

```ts
optional to?: Date;
```

Defined in: [src/interfaces/audit-entry.interface.ts:26](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L26)

***

<a id="api-auditqueryresult"></a>

### AuditQueryResult

Defined in: [src/interfaces/audit-entry.interface.ts:35](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L35)

#### Properties

<a id="api-entries"></a>

##### entries

```ts
entries: AuditEntry[];
```

Defined in: [src/interfaces/audit-entry.interface.ts:36](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L36)

<a id="api-hasmore"></a>

##### hasMore

```ts
hasMore: boolean;
```

Defined in: [src/interfaces/audit-entry.interface.ts:39](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L39)

<a id="api-nextcursor"></a>

##### nextCursor

```ts
nextCursor: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:38](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L38)

<a id="api-total"></a>

##### total?

```ts
optional total?: number;
```

Defined in: [src/interfaces/audit-entry.interface.ts:37](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L37)

***

<a id="api-auditscanpage"></a>

### AuditScanPage

Defined in: [src/interfaces/audit-entry.interface.ts:64](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L64)

#### Properties

<a id="api-checkpoint"></a>

##### checkpoint

```ts
checkpoint: string | null;
```

Defined in: [src/interfaces/audit-entry.interface.ts:66](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L66)

<a id="api-entries-1"></a>

##### entries

```ts
entries: AuditEntry[];
```

Defined in: [src/interfaces/audit-entry.interface.ts:65](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L65)

<a id="api-highwatermark"></a>

##### highWatermark

```ts
highWatermark: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:67](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L67)

***

<a id="api-auditsharedoptions"></a>

### AuditSharedOptions

Defined in: [src/interfaces/audit-shared-options.interface.ts:28](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L28)

Options shared by the Nest module and Prisma extension.
Runtime merging is intentionally not performed; pass the same object to both
call sites when both paths should share behavior.

#### Extended by

- [`AuditExtensionOptions`](#api-auditextensionoptions)
- [`AuditLogModuleOptions`](#api-auditlogmoduleoptions)

#### Properties

<a id="api-logger-2"></a>

##### logger?

```ts
optional logger?: AuditLogger;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:33](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L33)

<a id="api-onauditerror-2"></a>

##### onAuditError?

```ts
optional onAuditError?: (error, ctx) => void;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:32](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L32)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |
| `ctx` | [`AuditErrorContext`](#api-auditerrorcontext) |

###### Returns

`void`

<a id="api-tablename-3"></a>

##### tableName?

```ts
optional tableName?: string;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:29](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L29)

<a id="api-tenantrequired-2"></a>

##### tenantRequired?

```ts
optional tenantRequired?: boolean;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:30](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L30)

<a id="api-tenantresolver-2"></a>

##### tenantResolver?

```ts
optional tenantResolver?: () => string | null;
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:31](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L31)

###### Returns

`string` \| `null`

***

<a id="api-auditstreambatchcontext"></a>

### AuditStreamBatchContext

Defined in: [src/stream/audit-stream.ts:14](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L14)

#### Properties

<a id="api-attempt"></a>

##### attempt

```ts
attempt: number;
```

Defined in: [src/stream/audit-stream.ts:19](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L19)

<a id="api-batchid"></a>

##### batchId

```ts
batchId: string;
```

Defined in: [src/stream/audit-stream.ts:16](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L16)

<a id="api-checkpoint-1"></a>

##### checkpoint

```ts
checkpoint: string;
```

Defined in: [src/stream/audit-stream.ts:17](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L17)

<a id="api-highwatermark-1"></a>

##### highWatermark

```ts
highWatermark: string;
```

Defined in: [src/stream/audit-stream.ts:18](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L18)

<a id="api-streamid"></a>

##### streamId

```ts
streamId: string;
```

Defined in: [src/stream/audit-stream.ts:15](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L15)

***

<a id="api-auditstreamcheckpointstore"></a>

### AuditStreamCheckpointStore

Defined in: [src/stream/audit-stream.ts:9](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L9)

#### Methods

<a id="api-load"></a>

##### load()

```ts
load(streamId): Promise<AuditStreamState | null>;
```

Defined in: [src/stream/audit-stream.ts:10](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `streamId` | `string` |

###### Returns

`Promise`\<[`AuditStreamState`](#api-auditstreamstate) \| `null`\>

<a id="api-save"></a>

##### save()

```ts
save(streamId, state): Promise<void>;
```

Defined in: [src/stream/audit-stream.ts:11](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L11)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `streamId` | `string` |
| `state` | [`AuditStreamState`](#api-auditstreamstate) |

###### Returns

`Promise`\<`void`\>

***

<a id="api-auditstreamdeadletter"></a>

### AuditStreamDeadLetter

Defined in: [src/stream/audit-stream.ts:29](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L29)

#### Properties

<a id="api-batchid-1"></a>

##### batchId

```ts
batchId: string;
```

Defined in: [src/stream/audit-stream.ts:31](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L31)

<a id="api-checkpoint-2"></a>

##### checkpoint

```ts
checkpoint: string;
```

Defined in: [src/stream/audit-stream.ts:32](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L32)

<a id="api-entries-2"></a>

##### entries

```ts
entries: readonly AuditEntry[];
```

Defined in: [src/stream/audit-stream.ts:34](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L34)

<a id="api-error-1"></a>

##### error

```ts
error: AuditStreamDeliveryError;
```

Defined in: [src/stream/audit-stream.ts:35](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L35)

<a id="api-highwatermark-2"></a>

##### highWatermark

```ts
highWatermark: string;
```

Defined in: [src/stream/audit-stream.ts:33](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L33)

<a id="api-streamid-1"></a>

##### streamId

```ts
streamId: string;
```

Defined in: [src/stream/audit-stream.ts:30](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L30)

***

<a id="api-auditstreamdeadletterstore"></a>

### AuditStreamDeadLetterStore

Defined in: [src/stream/audit-stream.ts:38](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L38)

#### Methods

<a id="api-write"></a>

##### write()

```ts
write(deadLetter): Promise<void>;
```

Defined in: [src/stream/audit-stream.ts:39](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deadLetter` | [`AuditStreamDeadLetter`](#api-auditstreamdeadletter) |

###### Returns

`Promise`\<`void`\>

***

<a id="api-auditstreamerrorcontext"></a>

### AuditStreamErrorContext

Defined in: [src/stream/audit-stream.ts:48](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L48)

#### Properties

<a id="api-attempt-1"></a>

##### attempt

```ts
attempt: number;
```

Defined in: [src/stream/audit-stream.ts:52](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L52)

<a id="api-batchid-2"></a>

##### batchId

```ts
batchId: string;
```

Defined in: [src/stream/audit-stream.ts:51](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L51)

<a id="api-phase-1"></a>

##### phase

```ts
phase: "delivery";
```

Defined in: [src/stream/audit-stream.ts:49](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L49)

<a id="api-streamid-2"></a>

##### streamId

```ts
streamId: string;
```

Defined in: [src/stream/audit-stream.ts:50](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L50)

<a id="api-terminal-1"></a>

##### terminal

```ts
terminal: boolean;
```

Defined in: [src/stream/audit-stream.ts:53](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L53)

***

<a id="api-auditstreamrunneroptions"></a>

### AuditStreamRunnerOptions

Defined in: [src/stream/audit-stream.ts:56](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L56)

#### Properties

<a id="api-checkpointstore"></a>

##### checkpointStore

```ts
checkpointStore: AuditStreamCheckpointStore;
```

Defined in: [src/stream/audit-stream.ts:60](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L60)

<a id="api-deadletterstore"></a>

##### deadLetterStore?

```ts
optional deadLetterStore?: AuditStreamDeadLetterStore;
```

Defined in: [src/stream/audit-stream.ts:61](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L61)

<a id="api-initialbackoffms"></a>

##### initialBackoffMs?

```ts
optional initialBackoffMs?: number;
```

Defined in: [src/stream/audit-stream.ts:63](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L63)

<a id="api-maxbackoffms"></a>

##### maxBackoffMs?

```ts
optional maxBackoffMs?: number;
```

Defined in: [src/stream/audit-stream.ts:64](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L64)

<a id="api-maxretries"></a>

##### maxRetries?

```ts
optional maxRetries?: number;
```

Defined in: [src/stream/audit-stream.ts:62](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L62)

<a id="api-onerror"></a>

##### onError?

```ts
optional onError?: (error, context) => void;
```

Defined in: [src/stream/audit-stream.ts:67](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L67)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |
| `context` | [`AuditStreamErrorContext`](#api-auditstreamerrorcontext) |

###### Returns

`void`

<a id="api-onmetric"></a>

##### onMetric?

```ts
optional onMetric?: (metric) => void;
```

Defined in: [src/stream/audit-stream.ts:66](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L66)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `metric` | [`AuditStreamMetric`](#api-auditstreammetric) |

###### Returns

`void`

<a id="api-redact"></a>

##### redact?

```ts
optional redact?: (entry) => AuditEntry;
```

Defined in: [src/stream/audit-stream.ts:65](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L65)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `entry` | `Readonly`\<[`AuditEntry`](#api-auditentry)\> |

###### Returns

[`AuditEntry`](#api-auditentry)

<a id="api-scan-1"></a>

##### scan

```ts
scan: Omit<AuditScanOptions, "after" | "until" | "signal">;
```

Defined in: [src/stream/audit-stream.ts:58](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L58)

<a id="api-sink"></a>

##### sink

```ts
sink: AuditStreamSink;
```

Defined in: [src/stream/audit-stream.ts:59](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L59)

<a id="api-sleep"></a>

##### sleep?

```ts
optional sleep?: (delayMs, signal?) => Promise<void>;
```

Defined in: [src/stream/audit-stream.ts:68](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L68)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `delayMs` | `number` |
| `signal?` | `AbortSignal` |

###### Returns

`Promise`\<`void`\>

<a id="api-streamid-3"></a>

##### streamId

```ts
streamId: string;
```

Defined in: [src/stream/audit-stream.ts:57](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L57)

***

<a id="api-auditstreamrunresult"></a>

### AuditStreamRunResult

Defined in: [src/stream/audit-stream.ts:71](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L71)

#### Properties

<a id="api-batches"></a>

##### batches

```ts
batches: number;
```

Defined in: [src/stream/audit-stream.ts:75](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L75)

<a id="api-checkpoint-3"></a>

##### checkpoint

```ts
checkpoint: string | null;
```

Defined in: [src/stream/audit-stream.ts:76](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L76)

<a id="api-deadletteredentries"></a>

##### deadLetteredEntries

```ts
deadLetteredEntries: number;
```

Defined in: [src/stream/audit-stream.ts:74](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L74)

<a id="api-deliveredentries"></a>

##### deliveredEntries

```ts
deliveredEntries: number;
```

Defined in: [src/stream/audit-stream.ts:73](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L73)

<a id="api-status-1"></a>

##### status

```ts
status: "delivered" | "idle";
```

Defined in: [src/stream/audit-stream.ts:72](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L72)

***

<a id="api-auditstreamsink"></a>

### AuditStreamSink

Defined in: [src/stream/audit-stream.ts:22](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L22)

#### Methods

<a id="api-deliver"></a>

##### deliver()

```ts
deliver(entries, context): Promise<void>;
```

Defined in: [src/stream/audit-stream.ts:23](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L23)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `entries` | readonly [`AuditEntry`](#api-auditentry)[] |
| `context` | [`AuditStreamBatchContext`](#api-auditstreambatchcontext) |

###### Returns

`Promise`\<`void`\>

***

<a id="api-auditstreamstate"></a>

### AuditStreamState

Defined in: [src/stream/audit-stream.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L4)

#### Properties

<a id="api-checkpoint-4"></a>

##### checkpoint

```ts
checkpoint: string | null;
```

Defined in: [src/stream/audit-stream.ts:5](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L5)

<a id="api-highwatermark-3"></a>

##### highWatermark

```ts
highWatermark: string | null;
```

Defined in: [src/stream/audit-stream.ts:6](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L6)

***

<a id="api-auditstreamstoresqloptions"></a>

### AuditStreamStoreSQLOptions

Defined in: [src/stream/postgres-store.ts:18](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/postgres-store.ts#L18)

#### Properties

<a id="api-checkpointtable"></a>

##### checkpointTable?

```ts
optional checkpointTable?: string;
```

Defined in: [src/stream/postgres-store.ts:19](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/postgres-store.ts#L19)

<a id="api-deadlettertable"></a>

##### deadLetterTable?

```ts
optional deadLetterTable?: string;
```

Defined in: [src/stream/postgres-store.ts:20](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/postgres-store.ts#L20)

***

<a id="api-audittablesqloptions"></a>

### AuditTableSQLOptions

Defined in: [src/sql/index.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/sql/index.ts#L3)

#### Properties

<a id="api-enforcement"></a>

##### enforcement?

```ts
optional enforcement?: "trigger" | "rule";
```

Defined in: [src/sql/index.ts:6](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/sql/index.ts#L6)

<a id="api-ginindex"></a>

##### ginIndex?

```ts
optional ginIndex?: boolean;
```

Defined in: [src/sql/index.ts:7](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/sql/index.ts#L7)

<a id="api-partitioned"></a>

##### partitioned?

```ts
optional partitioned?: boolean;
```

Defined in: [src/sql/index.ts:5](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/sql/index.ts#L5)

<a id="api-tablename-4"></a>

##### tableName?

```ts
optional tableName?: string;
```

Defined in: [src/sql/index.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/sql/index.ts#L4)

***

<a id="api-audittransactionmethods"></a>

### AuditTransactionMethods

Defined in: [src/prisma/audit-extension.ts:42](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L42)

#### Type Parameters

| Type Parameter |
| ------ |
| `TTransactionClient` |

#### Methods

<a id="api-withauditlifecycle"></a>

##### withAuditLifecycle()

```ts
withAuditLifecycle<TResult>(input, callback): Promise<TResult>;
```

Defined in: [src/prisma/audit-extension.ts:47](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L47)

###### Type Parameters

| Type Parameter |
| ------ |
| `TResult` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`AuditLifecycleInput`](#api-auditlifecycleinput) |
| `callback` | (`tx`) => `Promise`\<`TResult`\> |

###### Returns

`Promise`\<`TResult`\>

<a id="api-withaudittransaction"></a>

##### withAuditTransaction()

```ts
withAuditTransaction<TResult>(callback, options?): Promise<TResult>;
```

Defined in: [src/prisma/audit-extension.ts:43](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L43)

###### Type Parameters

| Type Parameter |
| ------ |
| `TResult` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `callback` | (`tx`) => `Promise`\<`TResult`\> |
| `options?` | [`AuditTransactionOptions`](#api-audittransactionoptions) |

###### Returns

`Promise`\<`TResult`\>

***

<a id="api-audittransactionoptions"></a>

### AuditTransactionOptions

Defined in: [src/prisma/audit-extension.ts:32](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L32)

#### Properties

<a id="api-isolationlevel"></a>

##### isolationLevel?

```ts
optional isolationLevel?: "ReadUncommitted" | "ReadCommitted" | "RepeatableRead" | "Serializable";
```

Defined in: [src/prisma/audit-extension.ts:35](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L35)

<a id="api-maxwait"></a>

##### maxWait?

```ts
optional maxWait?: number;
```

Defined in: [src/prisma/audit-extension.ts:33](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L33)

<a id="api-timeout"></a>

##### timeout?

```ts
optional timeout?: number;
```

Defined in: [src/prisma/audit-extension.ts:34](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L34)

***

<a id="api-datadogauditstreamsinkoptions"></a>

### DatadogAuditStreamSinkOptions

Defined in: [src/stream/provider-sinks.ts:9](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L9)

#### Properties

<a id="api-apikey"></a>

##### apiKey

```ts
apiKey: string;
```

Defined in: [src/stream/provider-sinks.ts:11](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L11)

<a id="api-fetch"></a>

##### fetch?

```ts
optional fetch?: (input, init?) => Promise<Response>;
```

Defined in: [src/stream/provider-sinks.ts:15](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L15)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | `string` \| `URL` \| `Request` |
| `init?` | `RequestInit` |

###### Returns

`Promise`\<`Response`\>

<a id="api-service"></a>

##### service?

```ts
optional service?: string;
```

Defined in: [src/stream/provider-sinks.ts:12](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L12)

<a id="api-source-2"></a>

##### source?

```ts
optional source?: string;
```

Defined in: [src/stream/provider-sinks.ts:13](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L13)

<a id="api-tags"></a>

##### tags?

```ts
optional tags?: string;
```

Defined in: [src/stream/provider-sinks.ts:14](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L14)

<a id="api-timeoutms-1"></a>

##### timeoutMs?

```ts
optional timeoutMs?: number;
```

Defined in: [src/stream/provider-sinks.ts:16](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L16)

<a id="api-url"></a>

##### url

```ts
url: string;
```

Defined in: [src/stream/provider-sinks.ts:10](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L10)

***

<a id="api-ensurepartitionsoptions"></a>

### EnsurePartitionsOptions

Defined in: [src/sql/index.ts:10](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/sql/index.ts#L10)

#### Properties

<a id="api-ahead"></a>

##### ahead?

```ts
optional ahead?: number;
```

Defined in: [src/sql/index.ts:12](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/sql/index.ts#L12)

<a id="api-tablename-5"></a>

##### tableName?

```ts
optional tableName?: string;
```

Defined in: [src/sql/index.ts:11](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/sql/index.ts#L11)

***

<a id="api-httpauditstreamsinkoptions"></a>

### HttpAuditStreamSinkOptions

Defined in: [src/stream/http-sink.ts:10](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/http-sink.ts#L10)

#### Properties

<a id="api-fetch-1"></a>

##### fetch?

```ts
optional fetch?: (input, init?) => Promise<Response>;
```

Defined in: [src/stream/http-sink.ts:14](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/http-sink.ts#L14)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | `string` \| `URL` \| `Request` |
| `init?` | `RequestInit` |

###### Returns

`Promise`\<`Response`\>

<a id="api-format"></a>

##### format?

```ts
optional format?: AuditHttpStreamFormat;
```

Defined in: [src/stream/http-sink.ts:12](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/http-sink.ts#L12)

<a id="api-headers"></a>

##### headers?

```ts
optional headers?: Record<string, string>;
```

Defined in: [src/stream/http-sink.ts:13](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/http-sink.ts#L13)

<a id="api-serialize"></a>

##### serialize?

```ts
optional serialize?: (entries, context) => {
  body: string;
  contentType: string;
};
```

Defined in: [src/stream/http-sink.ts:16](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/http-sink.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `entries` | readonly [`AuditEntry`](#api-auditentry)[] |
| `context` | [`AuditStreamBatchContext`](#api-auditstreambatchcontext) |

###### Returns

```ts
{
  body: string;
  contentType: string;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `body` | `string` | [src/stream/http-sink.ts:19](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/http-sink.ts#L19) |
| `contentType` | `string` | [src/stream/http-sink.ts:19](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/http-sink.ts#L19) |

<a id="api-timeoutms-2"></a>

##### timeoutMs?

```ts
optional timeoutMs?: number;
```

Defined in: [src/stream/http-sink.ts:15](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/http-sink.ts#L15)

<a id="api-url-1"></a>

##### url

```ts
url: string;
```

Defined in: [src/stream/http-sink.ts:11](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/http-sink.ts#L11)

***

<a id="api-manualauditloginput"></a>

### ManualAuditLogInput

Defined in: [src/interfaces/audit-entry.interface.ts:77](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L77)

#### Properties

<a id="api-action-4"></a>

##### action

```ts
action: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:78](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L78)

<a id="api-metadata-4"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/audit-entry.interface.ts:81](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L81)

<a id="api-result-2"></a>

##### result?

```ts
optional result?: "success" | "failure";
```

Defined in: [src/interfaces/audit-entry.interface.ts:82](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L82)

<a id="api-targetid-3"></a>

##### targetId?

```ts
optional targetId?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:79](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L79)

<a id="api-targettype-2"></a>

##### targetType?

```ts
optional targetType?: string;
```

Defined in: [src/interfaces/audit-entry.interface.ts:80](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L80)

***

<a id="api-objectstorageauditstreamsinkoptions"></a>

### ObjectStorageAuditStreamSinkOptions

Defined in: [src/stream/provider-sinks.ts:109](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L109)

#### Properties

<a id="api-client-1"></a>

##### client

```ts
client: AuditObjectStorageClient;
```

Defined in: [src/stream/provider-sinks.ts:110](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L110)

<a id="api-isalreadyexists"></a>

##### isAlreadyExists?

```ts
optional isAlreadyExists?: (error) => boolean;
```

Defined in: [src/stream/provider-sinks.ts:112](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L112)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`boolean`

<a id="api-prefix"></a>

##### prefix?

```ts
optional prefix?: string;
```

Defined in: [src/stream/provider-sinks.ts:111](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L111)

***

<a id="api-postgresauditstreamstoreoptions"></a>

### PostgresAuditStreamStoreOptions

Defined in: [src/stream/postgres-store.ts:11](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/postgres-store.ts#L11)

#### Properties

<a id="api-checkpointtable-1"></a>

##### checkpointTable?

```ts
optional checkpointTable?: string;
```

Defined in: [src/stream/postgres-store.ts:14](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/postgres-store.ts#L14)

<a id="api-deadlettertable-1"></a>

##### deadLetterTable?

```ts
optional deadLetterTable?: string;
```

Defined in: [src/stream/postgres-store.ts:15](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/postgres-store.ts#L15)

<a id="api-prisma-1"></a>

##### prisma

```ts
prisma: any;
```

Defined in: [src/stream/postgres-store.ts:12](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/postgres-store.ts#L12)

<a id="api-prismamodule-2"></a>

##### prismaModule?

```ts
optional prismaModule?: PrismaModuleLike;
```

Defined in: [src/stream/postgres-store.ts:13](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/postgres-store.ts#L13)

***

<a id="api-prismamodulelike"></a>

### PrismaModuleLike

Defined in: [src/prisma/prisma-namespace.ts:1](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/prisma-namespace.ts#L1)

#### Properties

<a id="api-prisma-2"></a>

##### Prisma

```ts
Prisma: {
  defineExtension: (extension) => any;
  dmmf?: {
     datamodel?: {
        models?: readonly {
           dbName?: string | null;
           fields?: readonly {
              dbName?: ...;
              isUpdatedAt?: ...;
              kind?: ...;
              name: ...;
              type?: ...;
           }[];
           kind?: string;
           name: string;
           schema?: string | null;
        }[];
     };
  };
  empty?: unknown;
  join?: (values, separator?, prefix?, suffix?) => unknown;
  raw?: (value) => unknown;
  sql?: (strings, ...values) => unknown;
};
```

Defined in: [src/prisma/prisma-namespace.ts:2](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/prisma-namespace.ts#L2)

###### defineExtension

```ts
defineExtension: (extension) => any;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `extension` | `any` |

###### Returns

`any`

###### dmmf?

```ts
optional dmmf?: {
  datamodel?: {
     models?: readonly {
        dbName?: string | null;
        fields?: readonly {
           dbName?: ...;
           isUpdatedAt?: ...;
           kind?: ...;
           name: ...;
           type?: ...;
        }[];
        kind?: string;
        name: string;
        schema?: string | null;
     }[];
  };
};
```

###### dmmf.datamodel?

```ts
optional datamodel?: {
  models?: readonly {
     dbName?: string | null;
     fields?: readonly {
        dbName?: ...;
        isUpdatedAt?: ...;
        kind?: ...;
        name: ...;
        type?: ...;
     }[];
     kind?: string;
     name: string;
     schema?: string | null;
  }[];
};
```

###### dmmf.datamodel.models?

```ts
optional models?: readonly {
  dbName?: string | null;
  fields?: readonly {
     dbName?: ...;
     isUpdatedAt?: ...;
     kind?: ...;
     name: ...;
     type?: ...;
  }[];
  kind?: string;
  name: string;
  schema?: string | null;
}[];
```

###### empty?

```ts
optional empty?: unknown;
```

###### join?

```ts
optional join?: (values, separator?, prefix?, suffix?) => unknown;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `values` | readonly `any`[] |
| `separator?` | `string` |
| `prefix?` | `string` |
| `suffix?` | `string` |

###### Returns

`unknown`

###### raw?

```ts
optional raw?: (value) => unknown;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

###### Returns

`unknown`

###### sql?

```ts
optional sql?: (strings, ...values) => unknown;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `strings` | `TemplateStringsArray` \| readonly `string`[] |
| ...`values` | `any`[] |

###### Returns

`unknown`

***

<a id="api-splunkauditstreamsinkoptions"></a>

### SplunkAuditStreamSinkOptions

Defined in: [src/stream/provider-sinks.ts:55](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L55)

#### Properties

<a id="api-fetch-2"></a>

##### fetch?

```ts
optional fetch?: (input, init?) => Promise<Response>;
```

Defined in: [src/stream/provider-sinks.ts:62](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L62)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | `string` \| `URL` \| `Request` |
| `init?` | `RequestInit` |

###### Returns

`Promise`\<`Response`\>

<a id="api-host"></a>

##### host?

```ts
optional host?: string;
```

Defined in: [src/stream/provider-sinks.ts:61](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L61)

<a id="api-index"></a>

##### index?

```ts
optional index?: string;
```

Defined in: [src/stream/provider-sinks.ts:58](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L58)

<a id="api-source-3"></a>

##### source?

```ts
optional source?: string;
```

Defined in: [src/stream/provider-sinks.ts:59](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L59)

<a id="api-sourcetype"></a>

##### sourcetype?

```ts
optional sourcetype?: string;
```

Defined in: [src/stream/provider-sinks.ts:60](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L60)

<a id="api-timeoutms-3"></a>

##### timeoutMs?

```ts
optional timeoutMs?: number;
```

Defined in: [src/stream/provider-sinks.ts:63](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L63)

<a id="api-token"></a>

##### token

```ts
token: string;
```

Defined in: [src/stream/provider-sinks.ts:57](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L57)

<a id="api-url-2"></a>

##### url

```ts
url: string;
```

Defined in: [src/stream/provider-sinks.ts:56](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/provider-sinks.ts#L56)

## Type Aliases

<a id="api-actorextractor"></a>

### ActorExtractor

```ts
type ActorExtractor = (req) =>
  | AuditActor
| Promise<AuditActor>;
```

Defined in: [src/interfaces/actor.interface.ts:7](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/actor.interface.ts#L7)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `any` |

#### Returns

  \| [`AuditActor`](#api-auditactor)
  \| `Promise`\<[`AuditActor`](#api-auditactor)\>

***

<a id="api-auditbatchoverflow"></a>

### AuditBatchOverflow

```ts
type AuditBatchOverflow = "reject" | "summary";
```

Defined in: [src/prisma/audit-extension.ts:30](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L30)

***

<a id="api-auditconsistency"></a>

### AuditConsistency

```ts
type AuditConsistency = "atomic-required" | "best-effort";
```

Defined in: [src/prisma/audit-extension.ts:29](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L29)

***

<a id="api-auditcsvcolumnversion"></a>

### AuditCsvColumnVersion

```ts
type AuditCsvColumnVersion = "v1";
```

Defined in: [src/interfaces/audit-entry.interface.ts:70](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L70)

***

<a id="api-auditcsvoptions"></a>

### AuditCsvOptions

```ts
type AuditCsvOptions = AuditScanOptions & {
  columns?: AuditCsvColumnVersion;
  includeBom?: boolean;
};
```

Defined in: [src/interfaces/audit-entry.interface.ts:72](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L72)

#### Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `columns?` | [`AuditCsvColumnVersion`](#api-auditcsvcolumnversion) | [src/interfaces/audit-entry.interface.ts:73](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L73) |
| `includeBom?` | `boolean` | [src/interfaces/audit-entry.interface.ts:74](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L74) |

***

<a id="api-auditerrorphase"></a>

### AuditErrorPhase

```ts
type AuditErrorPhase = "pre-read" | "insert" | "post-read" | "tenant-resolution" | "context";
```

Defined in: [src/interfaces/audit-shared-options.interface.ts:7](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-shared-options.interface.ts#L7)

***

<a id="api-auditexportscope"></a>

### AuditExportScope

```ts
type AuditExportScope =
  | {
  allTenants?: never;
  tenantId: string;
}
  | {
  allTenants: true;
  tenantId?: never;
};
```

Defined in: [src/interfaces/audit-entry.interface.ts:47](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L47)

***

<a id="api-audithttpstreamformat"></a>

### AuditHttpStreamFormat

```ts
type AuditHttpStreamFormat = "json" | "ndjson";
```

Defined in: [src/stream/http-sink.ts:8](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/http-sink.ts#L8)

***

<a id="api-auditscanoptions"></a>

### AuditScanOptions

```ts
type AuditScanOptions = AuditExportScope & {
  action?: string;
  actorId?: string;
  after?: string;
  batchSize?: number;
  from?: Date;
  signal?: AbortSignal;
  targetId?: string;
  targetType?: string;
  to?: Date;
  until?: string;
};
```

Defined in: [src/interfaces/audit-entry.interface.ts:51](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L51)

#### Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `action?` | `string` | [src/interfaces/audit-entry.interface.ts:52](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L52) |
| `actorId?` | `string` | [src/interfaces/audit-entry.interface.ts:53](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L53) |
| `after?` | `string` | [src/interfaces/audit-entry.interface.ts:59](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L59) |
| `batchSize?` | `number` | [src/interfaces/audit-entry.interface.ts:58](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L58) |
| `from?` | `Date` | [src/interfaces/audit-entry.interface.ts:56](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L56) |
| `signal?` | `AbortSignal` | [src/interfaces/audit-entry.interface.ts:61](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L61) |
| `targetId?` | `string` | [src/interfaces/audit-entry.interface.ts:55](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L55) |
| `targetType?` | `string` | [src/interfaces/audit-entry.interface.ts:54](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L54) |
| `to?` | `Date` | [src/interfaces/audit-entry.interface.ts:57](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L57) |
| `until?` | `string` | [src/interfaces/audit-entry.interface.ts:60](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/interfaces/audit-entry.interface.ts#L60) |

***

<a id="api-auditstreammetric"></a>

### AuditStreamMetric

```ts
type AuditStreamMetric =
  | {
  attempt: number;
  entries: number;
  name: "batch_delivered";
  streamId: string;
}
  | {
  attempt: number;
  delayMs: number;
  entries: number;
  name: "batch_retried";
  streamId: string;
}
  | {
  entries: number;
  name: "batch_dead_lettered";
  streamId: string;
}
  | {
  name: "run_failed";
  streamId: string;
};
```

Defined in: [src/stream/audit-stream.ts:42](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/audit-stream.ts#L42)

## Variables

<a id="api-audit_action_key"></a>

### AUDIT\_ACTION\_KEY

```ts
const AUDIT_ACTION_KEY: "AUDIT_ACTION" = 'AUDIT_ACTION';
```

Defined in: [src/decorators/audit-action.decorator.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/decorators/audit-action.decorator.ts#L3)

***

<a id="api-audit_csv_columns_v1"></a>

### AUDIT\_CSV\_COLUMNS\_V1

```ts
const AUDIT_CSV_COLUMNS_V1: readonly ["schemaVersion", "id", "tenantId", "actorId", "actorType", "actorIp", "action", "targetType", "targetId", "source", "result", "changes", "metadata", "createdAt"];
```

Defined in: [src/services/audit-csv.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-csv.ts#L3)

***

<a id="api-audit_log_options"></a>

### AUDIT\_LOG\_OPTIONS

```ts
const AUDIT_LOG_OPTIONS: typeof AUDIT_LOG_OPTIONS;
```

Defined in: [src/audit-log.constants.ts:1](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/audit-log.constants.ts#L1)

***

<a id="api-audit_reason_key"></a>

### AUDIT\_REASON\_KEY

```ts
const AUDIT_REASON_KEY: "AUDIT_REASON" = 'AUDIT_REASON';
```

Defined in: [src/decorators/audit-reason.decorator.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/decorators/audit-reason.decorator.ts#L3)

***

<a id="api-no_audit_key"></a>

### NO\_AUDIT\_KEY

```ts
const NO_AUDIT_KEY: "NO_AUDIT" = 'NO_AUDIT';
```

Defined in: [src/decorators/no-audit.decorator.ts:3](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/decorators/no-audit.decorator.ts#L3)

## Functions

<a id="api-applyauditstreamstoreschema"></a>

### applyAuditStreamStoreSchema()

```ts
function applyAuditStreamStoreSchema(prisma, options?): Promise<void>;
```

Defined in: [src/stream/postgres-store.ts:118](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/postgres-store.ts#L118)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prisma` | `any` |
| `options` | [`AuditStreamStoreSQLOptions`](#api-auditstreamstoresqloptions) |

#### Returns

`Promise`\<`void`\>

***

<a id="api-applyaudittableschema"></a>

### applyAuditTableSchema()

```ts
function applyAuditTableSchema(prisma, options?): Promise<void>;
```

Defined in: [src/sql/index.ts:251](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/sql/index.ts#L251)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prisma` | `any` |
| `options` | [`AuditTableSQLOptions`](#api-audittablesqloptions) |

#### Returns

`Promise`\<`void`\>

***

<a id="api-auditaction"></a>

### AuditAction()

```ts
function AuditAction(action): CustomDecorator<string>;
```

Defined in: [src/decorators/audit-action.decorator.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/decorators/audit-action.decorator.ts#L4)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `action` | `string` |

#### Returns

`CustomDecorator`\<`string`\>

***

<a id="api-auditreason"></a>

### AuditReason()

```ts
function AuditReason(reason): CustomDecorator<string>;
```

Defined in: [src/decorators/audit-reason.decorator.ts:5](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/decorators/audit-reason.decorator.ts#L5)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `reason` | `string` |

#### Returns

`CustomDecorator`\<`string`\>

***

<a id="api-createauditedclient"></a>

### createAuditedClient()

```ts
function createAuditedClient<TClient>(client, options): TClient & AuditTransactionMethods<TransactionClientOf<TClient>>;
```

Defined in: [src/prisma/audit-extension.ts:1827](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L1827)

Creates an audited Prisma client while preserving the base client and
interactive transaction callback types.

#### Type Parameters

| Type Parameter |
| ------ |
| `TClient` *extends* `InteractiveTransactionHost` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | `TClient` |
| `options` | [`AuditExtensionOptions`](#api-auditextensionoptions) |

#### Returns

`TClient` & [`AuditTransactionMethods`](#api-audittransactionmethods)\<`TransactionClientOf`\<`TClient`\>\>

***

<a id="api-createauditextension"></a>

### createAuditExtension()

```ts
function createAuditExtension(options): any;
```

Defined in: [src/prisma/audit-extension.ts:989](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/prisma/audit-extension.ts#L989)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditExtensionOptions`](#api-auditextensionoptions) |

#### Returns

`any`

***

<a id="api-ensurepartitions"></a>

### ensurePartitions()

```ts
function ensurePartitions(prisma, options?): Promise<string[]>;
```

Defined in: [src/sql/index.ts:284](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/sql/index.ts#L284)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prisma` | `any` |
| `options` | [`EnsurePartitionsOptions`](#api-ensurepartitionsoptions) |

#### Returns

`Promise`\<`string`[]\>

***

<a id="api-getauditstreamstorestatements"></a>

### getAuditStreamStoreStatements()

```ts
function getAuditStreamStoreStatements(options?): string[];
```

Defined in: [src/stream/postgres-store.ts:88](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/stream/postgres-store.ts#L88)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditStreamStoreSQLOptions`](#api-auditstreamstoresqloptions) |

#### Returns

`string`[]

***

<a id="api-getaudittablesql"></a>

### getAuditTableSQL()

```ts
function getAuditTableSQL(options?): string;
```

Defined in: [src/sql/index.ts:236](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/sql/index.ts#L236)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditTableSQLOptions`](#api-audittablesqloptions) |

#### Returns

`string`

***

<a id="api-getaudittablestatements"></a>

### getAuditTableStatements()

```ts
function getAuditTableStatements(options?): string[];
```

Defined in: [src/sql/index.ts:217](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/sql/index.ts#L217)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditTableSQLOptions`](#api-audittablesqloptions) |

#### Returns

`string`[]

***

<a id="api-mergecontextmetadata"></a>

### mergeContextMetadata()

```ts
function mergeContextMetadata(input?): Record<string, unknown> | undefined;
```

Defined in: [src/services/audit-context.ts:63](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/services/audit-context.ts#L63)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input?` | `Record`\<`string`, `unknown`\> |

#### Returns

`Record`\<`string`, `unknown`\> \| `undefined`

***

<a id="api-noaudit-1"></a>

### NoAudit()

```ts
function NoAudit(): CustomDecorator<string>;
```

Defined in: [src/decorators/no-audit.decorator.ts:4](https://github.com/nestarc/nestjs-audit-log/blob/6e1373b13fad445a6fcd614ab03487a5e4a51741/src/decorators/no-audit.decorator.ts#L4)

#### Returns

`CustomDecorator`\<`string`\>
