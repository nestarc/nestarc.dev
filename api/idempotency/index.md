# @nestarc/idempotency

## Classes

<a id="api-idempotencyinterceptor"></a>

### IdempotencyInterceptor

Defined in: [src/idempotency.interceptor.ts:117](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/idempotency.interceptor.ts#L117)

The core idempotency interceptor.

Reads `@Idempotent()` metadata off the handler, extracts the configured
idempotency header, computes a request body fingerprint, and dispatches
the storage state machine: replay COMPLETED, conflict on PROCESSING,
mismatch on differing fingerprint, otherwise lock + delegate + capture
response under token-based compare-and-set.

Implements the IETF draft `httpapi-idempotency-key-header-07` semantics for
400 / 409 / 422 responses.

#### Implements

- `NestInterceptor`

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new IdempotencyInterceptor(
   reflector,
   storage,
   moduleOptions): IdempotencyInterceptor;
```

Defined in: [src/idempotency.interceptor.ts:120](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/idempotency.interceptor.ts#L120)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `reflector` | `Reflector` |
| `storage` | [`IdempotencyStorage`](#api-idempotencystorage) |
| `moduleOptions` | [`IdempotencyOptions`](#api-idempotencyoptions) |

###### Returns

[`IdempotencyInterceptor`](#api-idempotencyinterceptor)

#### Methods

<a id="api-intercept"></a>

##### intercept()

```ts
intercept(context, next): Observable<unknown>;
```

Defined in: [src/idempotency.interceptor.ts:136](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/idempotency.interceptor.ts#L136)

Method to implement a custom interceptor.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `ExecutionContext` | an `ExecutionContext` object providing methods to access the route handler and class about to be invoked. |
| `next` | `CallHandler` | a reference to the `CallHandler`, which provides access to an `Observable` representing the response stream from the route handler. |

###### Returns

`Observable`\<`unknown`\>

###### Implementation of

```ts
NestInterceptor.intercept
```

***

<a id="api-idempotencymodule"></a>

### IdempotencyModule

Defined in: [src/idempotency.module.ts:35](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/idempotency.module.ts#L35)

NestJS dynamic module exposing the [IdempotencyInterceptor](#api-idempotencyinterceptor) and the
configured [IdempotencyStorage](#api-idempotencystorage).

The module does **not** auto-register the interceptor as `APP_INTERCEPTOR` —
consumers opt in via one of three patterns:

1. App-global:
   `providers: [{ provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor }]`
2. Controller-scoped: `@UseInterceptors(IdempotencyInterceptor)` on the class
3. Method-scoped: `@UseInterceptors(IdempotencyInterceptor)` on the handler

The module is registered as global by default so consumers can wire any of
the three patterns without re-importing it everywhere.

#### Constructors

<a id="api-constructor-1"></a>

##### Constructor

```ts
new IdempotencyModule(): IdempotencyModule;
```

###### Returns

[`IdempotencyModule`](#api-idempotencymodule)

#### Methods

<a id="api-forroot"></a>

##### forRoot()

```ts
static forRoot(options): DynamicModule;
```

Defined in: [src/idempotency.module.ts:36](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/idempotency.module.ts#L36)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`IdempotencyOptions`](#api-idempotencyoptions) |

###### Returns

`DynamicModule`

<a id="api-forrootasync"></a>

##### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [src/idempotency.module.ts:58](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/idempotency.module.ts#L58)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`IdempotencyAsyncOptions`](#api-idempotencyasyncoptions) |

###### Returns

`DynamicModule`

***

<a id="api-memorystorage"></a>

### MemoryStorage

Defined in: [src/storage/memory.storage.ts:29](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/memory.storage.ts#L29)

In-memory implementation of [IdempotencyStorage](#api-idempotencystorage).

Backed by a `Map` with per-entry `setTimeout` expirations. Suitable for
tests and single-instance development. **Not safe for production**: state
is lost on restart and not shared across processes — two replicas would
each enforce idempotency independently, letting duplicates slip through.

#### Implements

- [`IdempotencyStorage`](#api-idempotencystorage)
- `OnModuleDestroy`

#### Constructors

<a id="api-constructor-2"></a>

##### Constructor

```ts
new MemoryStorage(): MemoryStorage;
```

###### Returns

[`MemoryStorage`](#api-memorystorage)

#### Methods

<a id="api-complete-1"></a>

##### complete()

```ts
complete(
   key,
   token,
   response,
ttlSeconds): Promise<MutateResult>;
```

Defined in: [src/storage/memory.storage.ts:61](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/memory.storage.ts#L61)

Transitions a `PROCESSING` record to `COMPLETED` and stores the captured response,
but ONLY if the record is unexpired and its token matches the caller's.
Returns `'stale'` for missing/expired records, token mismatches, and an
already COMPLETED record (including the same token). A stale operation
must not overwrite a response or refresh TTL.

On `'ok'`, implementations must refresh the TTL to `ttlSeconds`.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | - |
| `token` | `string` | - |
| `response` | [`CompleteResponse`](#api-completeresponse) | - |
| `ttlSeconds` | `number` | completed record lifetime, an integer in [1, 2_147_483_647] seconds |

###### Returns

`Promise`\<[`MutateResult`](#api-mutateresult)\>

###### Throws

RangeError if ttlSeconds is invalid, before ownership or state checks

###### Implementation of

[`IdempotencyStorage`](#api-idempotencystorage).[`complete`](#api-complete)

<a id="api-create-1"></a>

##### create()

```ts
create(
   key,
   fingerprint,
ttlSeconds): Promise<CreateResult>;
```

Defined in: [src/storage/memory.storage.ts:36](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/memory.storage.ts#L36)

Atomically creates a PROCESSING record. On success, returns an opaque
token that the caller MUST pass back to `complete()` / `delete()`.
An expired record is absent for NX purposes, regardless of physical cleanup.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | the idempotency key from the client header (already scoped by the interceptor to include endpoint identity) |
| `fingerprint` | `string` \| `undefined` | SHA-256 of the request body, or undefined if fingerprinting is off |
| `ttlSeconds` | `number` | lifetime of the lock, an integer in [1, 2_147_483_647] seconds |

###### Returns

`Promise`\<[`CreateResult`](#api-createresult)\>

###### Throws

RangeError if ttlSeconds is invalid, before NX or expiry checks

###### Implementation of

[`IdempotencyStorage`](#api-idempotencystorage).[`create`](#api-create)

<a id="api-delete-1"></a>

##### delete()

```ts
delete(key, token): Promise<MutateResult>;
```

Defined in: [src/storage/memory.storage.ts:100](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/memory.storage.ts#L100)

Removes a record, but ONLY if the caller's token matches. Returns `'ok'`
if the record was removed OR was absent/expired (idempotent cleanup), and
`'stale'` only if a DIFFERENT record (with a different token) is currently
stored and unexpired under this key. Expired physical rows may remain for
later cleanup; delete success does not promise immediate physical removal.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `token` | `string` |

###### Returns

`Promise`\<[`MutateResult`](#api-mutateresult)\>

###### Implementation of

[`IdempotencyStorage`](#api-idempotencystorage).[`delete`](#api-delete)

<a id="api-get-1"></a>

##### get()

```ts
get(key): Promise<IdempotencyRecord | null>;
```

Defined in: [src/storage/memory.storage.ts:32](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/memory.storage.ts#L32)

Fetches a record by key. Returns null if the key does not exist or has expired.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`IdempotencyRecord`](#api-idempotencyrecord) \| `null`\>

###### Implementation of

[`IdempotencyStorage`](#api-idempotencystorage).[`get`](#api-get)

<a id="api-onmoduledestroy"></a>

##### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [src/storage/memory.storage.ts:117](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/memory.storage.ts#L117)

Lifecycle hook: clear all pending eviction timers when the module is torn down.
Prevents leaked timers from keeping the Node event loop alive in long test runs.

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleDestroy.onModuleDestroy
```

## Interfaces

<a id="api-completeresponse"></a>

### CompleteResponse

Defined in: [src/interfaces/idempotency-storage.interface.ts:6](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-storage.interface.ts#L6)

The response payload captured by the interceptor and persisted by storage.

#### Properties

<a id="api-body"></a>

##### body?

```ts
optional body?: string;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:16](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-storage.interface.ts#L16)

Opaque replay payload. Store and return this string unchanged; do not
JSON.parse/stringify or otherwise normalize it. The interceptor writes a
versioned envelope, including for empty HTTP bodies. Optional for storage
callers and older records; missing/legacy payloads are not replayed.

<a id="api-headers"></a>

##### headers?

```ts
optional headers?: Record<string, string>;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:19](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-storage.interface.ts#L19)

Lowercase HTTP response headers captured for replay.

<a id="api-statuscode"></a>

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:8](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-storage.interface.ts#L8)

HTTP status code emitted by the original handler.

***

<a id="api-createresult"></a>

### CreateResult

Defined in: [src/interfaces/idempotency-storage.interface.ts:33](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-storage.interface.ts#L33)

Return shape of [IdempotencyStorage.create](#api-create).

`acquired === true` means this caller successfully created a new PROCESSING
record and was given an opaque `token` that uniquely identifies that record.
The caller MUST pass this token back to `complete()` / `delete()` so the
storage can verify it still owns the record before mutating it.

`acquired === false` means a record already existed (NX semantics). No token
is issued in this case.

#### Properties

<a id="api-acquired"></a>

##### acquired

```ts
acquired: boolean;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:34](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-storage.interface.ts#L34)

<a id="api-token"></a>

##### token?

```ts
optional token?: string;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:35](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-storage.interface.ts#L35)

***

<a id="api-idempotencyasyncoptions"></a>

### IdempotencyAsyncOptions

Defined in: [src/interfaces/idempotency-options.interface.ts:215](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L215)

Async configuration passed to [IdempotencyModule.forRootAsync](#api-forrootasync).
Mirrors the standard NestJS async-module pattern (useFactory / useClass / useExisting).

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

Defined in: [src/interfaces/idempotency-options.interface.ts:221](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L221)

<a id="api-isglobal"></a>

##### isGlobal?

```ts
optional isGlobal?: boolean;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:222](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L222)

<a id="api-useclass"></a>

##### useClass?

```ts
optional useClass?: Type<IdempotencyOptionsFactory>;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:217](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L217)

<a id="api-useexisting"></a>

##### useExisting?

```ts
optional useExisting?: Type<IdempotencyOptionsFactory>;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:216](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L216)

<a id="api-usefactory"></a>

##### useFactory?

```ts
optional useFactory?: (...args) =>
  | IdempotencyOptions
| Promise<IdempotencyOptions>;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:218](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L218)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`IdempotencyOptions`](#api-idempotencyoptions)
  \| `Promise`\<[`IdempotencyOptions`](#api-idempotencyoptions)\>

***

<a id="api-idempotencyevent"></a>

### IdempotencyEvent

Defined in: [src/interfaces/idempotency-options.interface.ts:82](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L82)

#### Properties

<a id="api-error"></a>

##### error?

```ts
optional error?: IdempotencyEventError;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:89](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L89)

<a id="api-keyhash"></a>

##### keyHash

```ts
keyHash: string;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:85](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L85)

SHA-256 of the v1 encoded storage key; not a metric label or encryption.

<a id="api-namespace"></a>

##### namespace

```ts
namespace: string;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:87](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L87)

S3 v1 identity + endpoint namespace hash, independent of the raw key.

<a id="api-outcome"></a>

##### outcome

```ts
outcome: IdempotencyOutcome;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:83](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L83)

<a id="api-statuscode-1"></a>

##### statusCode?

```ts
optional statusCode?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:88](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L88)

***

<a id="api-idempotencyfingerprintinput"></a>

### IdempotencyFingerprintInput

Defined in: [src/interfaces/idempotency-options.interface.ts:43](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L43)

#### Properties

<a id="api-body-1"></a>

##### body

```ts
body: unknown;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:47](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L47)

<a id="api-context"></a>

##### context

```ts
context: ExecutionContext;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:44](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L44)

<a id="api-defaultfingerprint"></a>

##### defaultFingerprint

```ts
defaultFingerprint: () => string | undefined;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:48](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L48)

###### Returns

`string` \| `undefined`

<a id="api-key"></a>

##### key

```ts
key: string;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:45](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L45)

<a id="api-scope"></a>

##### scope

```ts
scope: string;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:46](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L46)

***

<a id="api-idempotencyobservabilityoptions"></a>

### IdempotencyObservabilityOptions

Defined in: [src/interfaces/idempotency-options.interface.ts:92](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L92)

#### Properties

<a id="api-exposestatusheaders"></a>

##### exposeStatusHeaders?

```ts
optional exposeStatusHeaders?: boolean;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:96](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L96)

Defaults to true. These headers are generated afresh, never replayed.

<a id="api-onevent"></a>

##### onEvent?

```ts
optional onEvent?: (event) => void | Promise<void>;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:94](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L94)

Best effort, not awaited. Throws/rejections never change request handling.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`IdempotencyEvent`](#api-idempotencyevent) |

###### Returns

`void` \| `Promise`\<`void`\>

***

<a id="api-idempotencyoptions"></a>

### IdempotencyOptions

Defined in: [src/interfaces/idempotency-options.interface.ts:102](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L102)

Module-level configuration passed to [IdempotencyModule.forRoot](#api-forroot).

#### Properties

<a id="api-fingerprint"></a>

##### fingerprint?

```ts
optional fingerprint?:
  | boolean
  | IdempotencyFingerprintResolver;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:167](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L167)

When true, the interceptor computes a SHA-256 fingerprint of the request body
and verifies it on subsequent requests. Pass a resolver function to provide
an application-specific semantic fingerprint. A mismatch produces HTTP 422.

###### Default

```ts
true
```

<a id="api-headername"></a>

##### headerName?

```ts
optional headerName?: string;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:141](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L141)

The HTTP header name carrying one raw opaque key string. Repeated fields,
arrays and comma-joined values are rejected. Quotes are literal; this is
not a Structured Field String parser.

###### Default

```ts
'Idempotency-Key'
```

<a id="api-isglobal-1"></a>

##### isGlobal?

```ts
optional isGlobal?: boolean;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:199](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L199)

When true, the module is registered as a global module (no need to import
it into every consumer module).

###### Default

```ts
true
```

<a id="api-keyresolver"></a>

##### keyResolver?

```ts
optional keyResolver?: IdempotencyKeyResolver;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:149](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L149)

Optional application-level idempotency key resolver. When configured, its
return value is used instead of reading the configured header. Only
undefined means missing. Invalid strings/non-string results produce 400
even when required:false. Commas are allowed in resolver keys.

<a id="api-maxkeylength"></a>

##### maxKeyLength?

```ts
optional maxKeyLength?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:158](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L158)

Maximum accepted idempotency key length, in UTF-8 bytes. Must be a positive
safe integer. Empty/blank strings, controls and unpaired surrogates are
rejected. Strings are not trimmed or Unicode-normalized by this package.

###### Default

```ts
255
```

<a id="api-observability"></a>

##### observability?

```ts
optional observability?: IdempotencyObservabilityOptions;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:191](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L191)

Optional operational hooks and client-visible status headers.

<a id="api-processingttl"></a>

##### processingTtl?

```ts
optional processingTtl?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:132](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L132)

Optional time-to-live for in-flight PROCESSING records, in seconds.
When omitted, [ttl](#api-ttl) is used for both processing locks and completed
replay records. Per-handler `@Idempotent({ processingTtl })` overrides this.
Must be an integer from 1 through 2_147_483_647, like [ttl](#api-ttl).

Configure this only when you want stuck in-flight records to expire sooner
than completed replay records. Values shorter than the endpoint's real
processing time can allow duplicate execution.

<a id="api-replayheaders"></a>

##### replayHeaders?

```ts
optional replayHeaders?: ReplayHeadersOption;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:186](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L186)

Controls which response headers are captured and replayed.

`true` or undefined uses the conservative default allowlist.
`false` disables header replay.
A string array uses an explicit allowlist, still filtered through the
unsafe header denylist.

###### Default

```ts
true
```

<a id="api-scope-1"></a>

##### scope?

```ts
optional scope?: IdempotencyScope;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:174](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L174)

How storage keys are namespaced. See [IdempotencyScope](#api-idempotencyscope).

###### Default

```ts
'endpoint'
```

<a id="api-storage"></a>

##### storage

```ts
storage: IdempotencyStorage;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:108](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L108)

The storage adapter instance to use. Construct it yourself
(e.g. `new MemoryStorage()` or `new RedisStorage({ host, port })`)
for full type-safe control over adapter wiring.

<a id="api-ttl"></a>

##### ttl?

```ts
optional ttl?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:120](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L120)

Default time-to-live for idempotency records, in seconds.
Per-handler `@Idempotent({ ttl })` overrides this.
Completed replay records use this TTL. In-flight PROCESSING records also
use this TTL unless [processingTtl](#api-processingttl) is configured.
Must be an integer from 1 through 2_147_483_647; otherwise a RangeError
is emitted at request time before storage or handler execution.

###### Default

```ts
86400 (24 hours)
```

***

<a id="api-idempotencyoptionsfactory"></a>

### IdempotencyOptionsFactory

Defined in: [src/interfaces/idempotency-options.interface.ts:205](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L205)

Factory contract for `useClass` / `useExisting` async registration paths.

#### Methods

<a id="api-createidempotencyoptions"></a>

##### createIdempotencyOptions()

```ts
createIdempotencyOptions():
  | IdempotencyOptions
| Promise<IdempotencyOptions>;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:206](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L206)

###### Returns

  \| [`IdempotencyOptions`](#api-idempotencyoptions)
  \| `Promise`\<[`IdempotencyOptions`](#api-idempotencyoptions)\>

***

<a id="api-idempotencyrecord"></a>

### IdempotencyRecord

Defined in: [src/interfaces/idempotency-record.interface.ts:14](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-record.interface.ts#L14)

The persisted shape of an idempotency record across all storage adapters.

#### Properties

<a id="api-createdat"></a>

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:54](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-record.interface.ts#L54)

When the record was first created by `IdempotencyStorage.create()`.

**Invariant**: this field is IMMUTABLE over the lifetime of a record.
`complete()` and any other mutation MUST preserve the original value.
Storage adapters that rewrite `createdAt` on update are non-conformant
and WILL break consumers who use it for monitoring (e.g. first-seen
timestamps in metrics / audit trails).

<a id="api-expiresat"></a>

##### expiresAt

```ts
expiresAt: Date;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:61](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-record.interface.ts#L61)

When the record will be evicted by the storage adapter.
Unlike `createdAt`, this field IS mutated on `complete()` when the
adapter refreshes the TTL window to the new (typically longer) value.

<a id="api-fingerprint-1"></a>

##### fingerprint?

```ts
optional fingerprint?: string;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:31](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-record.interface.ts#L31)

SHA-256 of the request body, used to detect a key being reused with a
different payload (which produces HTTP 422 per the IETF draft).
Undefined when fingerprinting is disabled.

<a id="api-key-1"></a>

##### key

```ts
key: string;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:16](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-record.interface.ts#L16)

The exact value of the `Idempotency-Key` header from the original request.

<a id="api-responsebody"></a>

##### responseBody?

```ts
optional responseBody?: string;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:40](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-record.interface.ts#L40)

Opaque versioned replay payload; storage must preserve it unchanged.

<a id="api-responseheaders"></a>

##### responseHeaders?

```ts
optional responseHeaders?: Record<string, string>;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:43](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-record.interface.ts#L43)

Lowercase HTTP response headers captured for replay.

<a id="api-status"></a>

##### status

```ts
status: IdempotencyStatus;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:34](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-record.interface.ts#L34)

Current lifecycle state.

<a id="api-statuscode-2"></a>

##### statusCode?

```ts
optional statusCode?: number;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:37](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-record.interface.ts#L37)

Captured HTTP status code of the original handler response.

<a id="api-token-1"></a>

##### token

```ts
token: string;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:24](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-record.interface.ts#L24)

Opaque token issued by `IdempotencyStorage.create()` that uniquely
identifies THIS record across its lifetime. Used by `complete()` /
`delete()` to compare-and-set so that a slow caller cannot clobber a
newer caller's record after TTL eviction.

***

<a id="api-idempotencystorage"></a>

### IdempotencyStorage

Defined in: [src/interfaces/idempotency-storage.interface.ts:89](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-storage.interface.ts#L89)

Pluggable storage contract for idempotency records.

Implementations must guarantee:
1. Atomic creation (`NX` semantics) — two concurrent `create()` calls for
   the same key must result in exactly one `acquired: true` and one
   `acquired: false`.
2. Token-based compare-and-set on `complete()` / `delete()` — a caller can
   only mutate a record whose stored token matches the token they received
   from their own `create()` call. This prevents the TTL-eviction race
   where a slow caller would otherwise clobber a newer caller's record.
3. `createdAt` immutability — `complete()` and any other mutation MUST
   preserve the `createdAt` field of the original PROCESSING record.
   See [IdempotencyRecord.createdAt](#api-createdat).
4. Logical expiry — a lease is absent at its storage deadline even when
   physical timer/sweep cleanup has not run. All operations share the same
   deadline; an expired owner cannot revive the lease with complete().
5. Complete once — only a live PROCESSING record may become COMPLETED.
   Repeated/concurrent complete with the same token returns stale after
   the first success, preserving its response and retention deadline.
6. TTL validation — create/complete accept integer seconds from 1 through
   2_147_483_647 inclusive (including 30-day TTLs). Reject all other values
   with RangeError before any storage access or mutation, even for missing,
   expired, already completed, or differently owned records. This applies
   to direct adapter calls as well as calls through the interceptor.

### Lifecycle

Storage adapters that hold external resources (Redis clients, DB
connections, timers) SHOULD implement Nest's `OnModuleDestroy` hook so
the resources are released when the host application shuts down. All
built-in adapters (`MemoryStorage`, `RedisStorage`, `PostgresStorage`) do this — a custom
adapter is free to opt in the same way.

A cross-adapter contract suite that exercises every requirement of this
interface lives at `test/support/shared-storage-contract.ts` — new
adapters should be plugged into it to guarantee LSP-level uniformity.

#### Methods

<a id="api-complete"></a>

##### complete()

```ts
complete(
   key,
   token,
   response,
ttlSeconds): Promise<MutateResult>;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:119](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-storage.interface.ts#L119)

Transitions a `PROCESSING` record to `COMPLETED` and stores the captured response,
but ONLY if the record is unexpired and its token matches the caller's.
Returns `'stale'` for missing/expired records, token mismatches, and an
already COMPLETED record (including the same token). A stale operation
must not overwrite a response or refresh TTL.

On `'ok'`, implementations must refresh the TTL to `ttlSeconds`.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | - |
| `token` | `string` | - |
| `response` | [`CompleteResponse`](#api-completeresponse) | - |
| `ttlSeconds` | `number` | completed record lifetime, an integer in [1, 2_147_483_647] seconds |

###### Returns

`Promise`\<[`MutateResult`](#api-mutateresult)\>

###### Throws

RangeError if ttlSeconds is invalid, before ownership or state checks

<a id="api-create"></a>

##### create()

```ts
create(
   key,
   fingerprint,
ttlSeconds): Promise<CreateResult>;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:106](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-storage.interface.ts#L106)

Atomically creates a PROCESSING record. On success, returns an opaque
token that the caller MUST pass back to `complete()` / `delete()`.
An expired record is absent for NX purposes, regardless of physical cleanup.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | the idempotency key from the client header (already scoped by the interceptor to include endpoint identity) |
| `fingerprint` | `string` \| `undefined` | SHA-256 of the request body, or undefined if fingerprinting is off |
| `ttlSeconds` | `number` | lifetime of the lock, an integer in [1, 2_147_483_647] seconds |

###### Returns

`Promise`\<[`CreateResult`](#api-createresult)\>

###### Throws

RangeError if ttlSeconds is invalid, before NX or expiry checks

<a id="api-delete"></a>

##### delete()

```ts
delete(key, token): Promise<MutateResult>;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:133](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-storage.interface.ts#L133)

Removes a record, but ONLY if the caller's token matches. Returns `'ok'`
if the record was removed OR was absent/expired (idempotent cleanup), and
`'stale'` only if a DIFFERENT record (with a different token) is currently
stored and unexpired under this key. Expired physical rows may remain for
later cleanup; delete success does not promise immediate physical removal.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `token` | `string` |

###### Returns

`Promise`\<[`MutateResult`](#api-mutateresult)\>

<a id="api-get"></a>

##### get()

```ts
get(key): Promise<IdempotencyRecord | null>;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:93](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-storage.interface.ts#L93)

Fetches a record by key. Returns null if the key does not exist or has expired.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`IdempotencyRecord`](#api-idempotencyrecord) \| `null`\>

***

<a id="api-idempotentmetadata"></a>

### IdempotentMetadata

Defined in: [src/interfaces/idempotency-options.interface.ts:271](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L271)

The metadata shape persisted via `SetMetadata` by the [Idempotent](#api-idempotent) decorator.
The `enabled: true` flag lets the interceptor distinguish "decorator applied
with no overrides" from "no decorator at all".

#### Extends

- [`IdempotentOptions`](#api-idempotentoptions)

#### Properties

<a id="api-enabled"></a>

##### enabled

```ts
enabled: true;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:272](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L272)

<a id="api-fingerprint-2"></a>

##### fingerprint?

```ts
optional fingerprint?:
  | boolean
  | IdempotencyFingerprintResolver;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:263](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L263)

Override the module-level fingerprint setting for this handler.

###### Inherited from

[`IdempotentOptions`](#api-idempotentoptions).[`fingerprint`](#api-fingerprint-3)

<a id="api-keyresolver-1"></a>

##### keyResolver?

```ts
optional keyResolver?: IdempotencyKeyResolver;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:253](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L253)

Override the module-level key resolver for this handler.

###### Inherited from

[`IdempotentOptions`](#api-idempotentoptions).[`keyResolver`](#api-keyresolver-2)

<a id="api-maxkeylength-1"></a>

##### maxKeyLength?

```ts
optional maxKeyLength?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:258](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L258)

Override the module-level maximum key length for this handler.

###### Inherited from

[`IdempotentOptions`](#api-idempotentoptions).[`maxKeyLength`](#api-maxkeylength-2)

<a id="api-processingttl-1"></a>

##### processingTtl?

```ts
optional processingTtl?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:248](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L248)

Override the module-level processing TTL for this handler (in seconds).
Must be an integer from 1 through 2_147_483_647.

###### Inherited from

[`IdempotentOptions`](#api-idempotentoptions).[`processingTtl`](#api-processingttl-2)

<a id="api-required"></a>

##### required?

```ts
optional required?: boolean;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:236](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L236)

When true, the `Idempotency-Key` header is mandatory and a missing header
produces HTTP 400. When false, requests without the header pass through
normally (no idempotency check).

###### Default

```ts
true
```

###### Inherited from

[`IdempotentOptions`](#api-idempotentoptions).[`required`](#api-required-1)

<a id="api-ttl-1"></a>

##### ttl?

```ts
optional ttl?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:242](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L242)

Override the module-level TTL for this handler (in seconds).
Must be an integer from 1 through 2_147_483_647.

###### Inherited from

[`IdempotentOptions`](#api-idempotentoptions).[`ttl`](#api-ttl-2)

***

<a id="api-idempotentoptions"></a>

### IdempotentOptions

Defined in: [src/interfaces/idempotency-options.interface.ts:228](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L228)

Per-handler overrides accepted by the [Idempotent](#api-idempotent) decorator.

#### Extended by

- [`IdempotentMetadata`](#api-idempotentmetadata)

#### Properties

<a id="api-fingerprint-3"></a>

##### fingerprint?

```ts
optional fingerprint?:
  | boolean
  | IdempotencyFingerprintResolver;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:263](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L263)

Override the module-level fingerprint setting for this handler.

<a id="api-keyresolver-2"></a>

##### keyResolver?

```ts
optional keyResolver?: IdempotencyKeyResolver;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:253](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L253)

Override the module-level key resolver for this handler.

<a id="api-maxkeylength-2"></a>

##### maxKeyLength?

```ts
optional maxKeyLength?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:258](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L258)

Override the module-level maximum key length for this handler.

<a id="api-processingttl-2"></a>

##### processingTtl?

```ts
optional processingTtl?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:248](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L248)

Override the module-level processing TTL for this handler (in seconds).
Must be an integer from 1 through 2_147_483_647.

<a id="api-required-1"></a>

##### required?

```ts
optional required?: boolean;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:236](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L236)

When true, the `Idempotency-Key` header is mandatory and a missing header
produces HTTP 400. When false, requests without the header pass through
normally (no idempotency check).

###### Default

```ts
true
```

<a id="api-ttl-2"></a>

##### ttl?

```ts
optional ttl?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:242](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L242)

Override the module-level TTL for this handler (in seconds).
Must be an integer from 1 through 2_147_483_647.

## Type Aliases

<a id="api-idempotencyeventerror-1"></a>

### IdempotencyEventError

```ts
type IdempotencyEventError =
  | {
  code: "storage_failure";
  operation: IdempotencyStorageOperation;
}
  | {
  code: "response_not_replayable";
};
```

Defined in: [src/interfaces/idempotency-options.interface.ts:78](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L78)

Package-owned diagnostics. Original thrown values are never included.

***

<a id="api-idempotencyfingerprintresolver"></a>

### IdempotencyFingerprintResolver

```ts
type IdempotencyFingerprintResolver = (input) => string | undefined | Promise<string | undefined>;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:55](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L55)

Resolves the fingerprint used to detect reuse of the same idempotency key
with a semantically different request.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`IdempotencyFingerprintInput`](#api-idempotencyfingerprintinput) |

#### Returns

`string` \| `undefined` \| `Promise`\<`string` \| `undefined`\>

***

<a id="api-idempotencykeyresolver"></a>

### IdempotencyKeyResolver

```ts
type IdempotencyKeyResolver = (context) => string | undefined | Promise<string | undefined>;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:39](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L39)

Resolves the idempotency key for a request. Use this when the stable key
comes from a webhook event id, command id, or other application-level value
instead of the configured HTTP header.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `ExecutionContext` |

#### Returns

`string` \| `undefined` \| `Promise`\<`string` \| `undefined`\>

***

<a id="api-idempotencyoutcome"></a>

### IdempotencyOutcome

```ts
type IdempotencyOutcome =
  | "created"
  | "replayed"
  | "conflict"
  | "mismatch"
  | "bypassed"
  | "stale"
  | "complete_error"
  | "storage_error";
```

Defined in: [src/interfaces/idempotency-options.interface.ts:59](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L59)

***

<a id="api-idempotencyscope"></a>

### IdempotencyScope

```ts
type IdempotencyScope = "endpoint" | "global" | ((context) => string | readonly string[]);
```

Defined in: [src/interfaces/idempotency-options.interface.ts:27](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L27)

How the interceptor derives the storage-key namespace from the request.

- `'endpoint'` (default) — scope by actual HTTP method + request path when
  available, falling back to Nest route metadata and then controller class +
  handler method name. Actual path parameters, duplicate/trailing slashes
  and percent encoding are preserved; query strings are excluded.
  No authenticated identity is inferred. Two different endpoints using the SAME
  `Idempotency-Key` value will NOT collide. Matches the IETF draft
  recommendation that the key be unique per (key, request URI) tuple.

- `'global'` — share keys across all identities and endpoints in the storage.
  Only use when all callers are authorized to share every replayed response.
  Storage keys are still versioned and encoded.

- A synchronous function — ADD authenticated identity to the endpoint.
  Return a nonblank string or a nonempty array of nonblank strings, e.g.
  `[req.user.tenantId, req.user.id]`. Array boundaries are preserved.
  Guards must authenticate/authorize before this interceptor on every retry.
  Unlike 0.4, functions never replace the endpoint. All modes use the v1
  key encoding with no legacy alias lookup. Upgrades require a separate empty
  storage namespace and business deduplication; see the migration contract.

***

<a id="api-idempotencystatus"></a>

### IdempotencyStatus

```ts
type IdempotencyStatus = "PROCESSING" | "COMPLETED";
```

Defined in: [src/interfaces/idempotency-record.interface.ts:9](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-record.interface.ts#L9)

Lifecycle state of an idempotency record.

- `PROCESSING`: a request with this key is currently being handled.
  A duplicate request arriving in this state should receive HTTP 409 Conflict.
- `COMPLETED`: the request finished and its response is cached. A duplicate
  request with the same fingerprint should be replayed from the stored response.

***

<a id="api-idempotencystorageoperation"></a>

### IdempotencyStorageOperation

```ts
type IdempotencyStorageOperation = "get" | "create" | "race_get" | "complete" | "delete";
```

Defined in: [src/interfaces/idempotency-options.interface.ts:70](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L70)

The failed storage call; race_get is the re-read after losing create().

***

<a id="api-mutateresult"></a>

### MutateResult

```ts
type MutateResult = "ok" | "stale";
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:49](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-storage.interface.ts#L49)

Return shape of [IdempotencyStorage.complete](#api-complete) and
[IdempotencyStorage.delete](#api-delete).

- `'ok'`: a live PROCESSING record completed, or delete removed the owned
  record / found it logically absent (including expiry).
- `'stale'`: complete found a missing, expired, already COMPLETED, or
  differently owned record; or delete found a live record with another
  token. No response, TTL, token or createdAt is changed on this path.
  Expiry alone is sufficient: a replacement does not need to exist.

***

<a id="api-replayheadersoption"></a>

### ReplayHeadersOption

```ts
type ReplayHeadersOption = boolean | string[];
```

Defined in: [src/interfaces/idempotency-options.interface.ts:32](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/interfaces/idempotency-options.interface.ts#L32)

## Variables

<a id="api-default_header_name"></a>

### DEFAULT\_HEADER\_NAME

```ts
const DEFAULT_HEADER_NAME: "Idempotency-Key" = 'Idempotency-Key';
```

Defined in: [src/idempotency.constants.ts:29](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/idempotency.constants.ts#L29)

Default HTTP header name carrying the idempotency key.
Matches the IETF draft `httpapi-idempotency-key-header-07`.

***

<a id="api-default_ttl_seconds"></a>

### DEFAULT\_TTL\_SECONDS

```ts
const DEFAULT_TTL_SECONDS: 86400 = 86_400;
```

Defined in: [src/idempotency.constants.ts:34](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/idempotency.constants.ts#L34)

Default time-to-live for idempotency records, in seconds (24 hours).

***

<a id="api-idempotency_options"></a>

### IDEMPOTENCY\_OPTIONS

```ts
const IDEMPOTENCY_OPTIONS: typeof IDEMPOTENCY_OPTIONS;
```

Defined in: [src/idempotency.constants.ts:4](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/idempotency.constants.ts#L4)

Injection token for the resolved [IdempotencyOptions](#api-idempotencyoptions) instance.

***

<a id="api-idempotency_storage"></a>

### IDEMPOTENCY\_STORAGE

```ts
const IDEMPOTENCY_STORAGE: typeof IDEMPOTENCY_STORAGE;
```

Defined in: [src/idempotency.constants.ts:9](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/idempotency.constants.ts#L9)

Injection token for the [IdempotencyStorage](#api-idempotencystorage) instance the interceptor uses.

***

<a id="api-idempotency_sweep_options"></a>

### IDEMPOTENCY\_SWEEP\_OPTIONS

```ts
const IDEMPOTENCY_SWEEP_OPTIONS: typeof IDEMPOTENCY_SWEEP_OPTIONS;
```

Defined in: [src/idempotency.constants.ts:15](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/idempotency.constants.ts#L15)

Injection token for SweepOptions. Optional — when not provided the
`PostgresSweepService` runs in disabled mode (no scheduled cleanup).

***

<a id="api-idempotent_metadata_key"></a>

### IDEMPOTENT\_METADATA\_KEY

```ts
const IDEMPOTENT_METADATA_KEY: "nestarc:idempotent" = 'nestarc:idempotent';
```

Defined in: [src/idempotency.constants.ts:23](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/idempotency.constants.ts#L23)

Reflector metadata key carrying the per-handler [IdempotentMetadata](#api-idempotentmetadata).

Stored as a plain string (not Symbol) for maximum compatibility with
Nest's `Reflector.get` and `Reflect.getMetadata`.

## Functions

<a id="api-idempotent"></a>

### Idempotent()

```ts
function Idempotent(options?): MethodDecorator;
```

Defined in: [src/idempotency.decorator.ts:29](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/idempotency.decorator.ts#L29)

Marks a NestJS controller handler as idempotent.

The [IdempotencyInterceptor](#api-idempotencyinterceptor) reads this metadata to decide whether to
apply duplicate-request protection: extracting the `Idempotency-Key` header,
computing a request fingerprint, and replaying cached responses for repeats.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`IdempotentOptions`](#api-idempotentoptions) |

#### Returns

`MethodDecorator`

#### Examples

**Basic usage — header is required, body fingerprinted, default TTL.**

```ts
@Post()
@Idempotent()
createPayment(@Body() dto: CreatePaymentDto) { ... }
```

**Per-handler overrides.**

```ts
@Post('refunds')
@Idempotent({ ttl: 3600, fingerprint: false })
createRefund(@Body() dto: CreateRefundDto) { ... }
```
