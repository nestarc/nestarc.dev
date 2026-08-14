# @nestarc/idempotency

## Classes

### IdempotencyInterceptor

Defined in: [src/idempotency.interceptor.ts:100](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/idempotency.interceptor.ts#L100)

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

##### Constructor

```ts
new IdempotencyInterceptor(
   reflector, 
   storage, 
   moduleOptions): IdempotencyInterceptor;
```

Defined in: [src/idempotency.interceptor.ts:103](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/idempotency.interceptor.ts#L103)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `reflector` | `Reflector` |
| `storage` | [`IdempotencyStorage`](#idempotencystorage) |
| `moduleOptions` | [`IdempotencyOptions`](#idempotencyoptions) |

###### Returns

[`IdempotencyInterceptor`](#idempotencyinterceptor)

#### Methods

##### intercept()

```ts
intercept(context, next): Observable<unknown>;
```

Defined in: [src/idempotency.interceptor.ts:119](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/idempotency.interceptor.ts#L119)

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

### IdempotencyModule

Defined in: [src/idempotency.module.ts:35](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/idempotency.module.ts#L35)

NestJS dynamic module exposing the [IdempotencyInterceptor](#idempotencyinterceptor) and the
configured [IdempotencyStorage](#idempotencystorage).

The module does **not** auto-register the interceptor as `APP_INTERCEPTOR` —
consumers opt in via one of three patterns:

1. App-global:
   `providers: [{ provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor }]`
2. Controller-scoped: `@UseInterceptors(IdempotencyInterceptor)` on the class
3. Method-scoped: `@UseInterceptors(IdempotencyInterceptor)` on the handler

The module is registered as global by default so consumers can wire any of
the three patterns without re-importing it everywhere.

#### Constructors

##### Constructor

```ts
new IdempotencyModule(): IdempotencyModule;
```

###### Returns

[`IdempotencyModule`](#idempotencymodule)

#### Methods

##### forRoot()

```ts
static forRoot(options): DynamicModule;
```

Defined in: [src/idempotency.module.ts:36](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/idempotency.module.ts#L36)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`IdempotencyOptions`](#idempotencyoptions) |

###### Returns

`DynamicModule`

##### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [src/idempotency.module.ts:58](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/idempotency.module.ts#L58)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`IdempotencyAsyncOptions`](#idempotencyasyncoptions) |

###### Returns

`DynamicModule`

***

### MemoryStorage

Defined in: [src/storage/memory.storage.ts:25](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/memory.storage.ts#L25)

In-memory implementation of [IdempotencyStorage](#idempotencystorage).

Backed by a `Map` with per-entry `setTimeout` expirations. Suitable for
tests and single-instance development. **Not safe for production**: state
is lost on restart and not shared across processes — two replicas would
each enforce idempotency independently, letting duplicates slip through.

#### Implements

- [`IdempotencyStorage`](#idempotencystorage)
- `OnModuleDestroy`

#### Constructors

##### Constructor

```ts
new MemoryStorage(): MemoryStorage;
```

###### Returns

[`MemoryStorage`](#memorystorage)

#### Methods

##### complete()

```ts
complete(
   key, 
   token, 
   response, 
ttlSeconds): Promise<MutateResult>;
```

Defined in: [src/storage/memory.storage.ts:66](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/memory.storage.ts#L66)

Transitions a `PROCESSING` record to `COMPLETED` and stores the captured response,
but ONLY if the stored record's token matches the caller's token.
Returns `'stale'` if the token does not match — meaning the original record
was evicted and a newer one exists under this key. The caller's response
must not overwrite the newer record.

On `'ok'`, implementations must refresh the TTL to `ttlSeconds`.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `token` | `string` |
| `response` | [`CompleteResponse`](#completeresponse) |
| `ttlSeconds` | `number` |

###### Returns

`Promise`\<[`MutateResult`](#mutateresult)\>

###### Implementation of

[`IdempotencyStorage`](#idempotencystorage).[`complete`](#complete)

##### create()

```ts
create(
   key, 
   fingerprint, 
ttlSeconds): Promise<CreateResult>;
```

Defined in: [src/storage/memory.storage.ts:41](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/memory.storage.ts#L41)

Atomically creates a PROCESSING record. On success, returns an opaque
token that the caller MUST pass back to `complete()` / `delete()`.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | the idempotency key from the client header (already scoped by the interceptor to include endpoint identity) |
| `fingerprint` | `string` \| `undefined` | SHA-256 of the request body, or undefined if fingerprinting is off |
| `ttlSeconds` | `number` | lifetime of the lock; the interceptor passes the resolved TTL |

###### Returns

`Promise`\<[`CreateResult`](#createresult)\>

###### Implementation of

[`IdempotencyStorage`](#idempotencystorage).[`create`](#create)

##### delete()

```ts
delete(key, token): Promise<MutateResult>;
```

Defined in: [src/storage/memory.storage.ts:105](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/memory.storage.ts#L105)

Removes a record, but ONLY if the caller's token matches. Returns `'ok'`
if the record was removed OR was already absent (idempotent cleanup), and
`'stale'` only if a DIFFERENT record (with a different token) is currently
stored under this key.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `token` | `string` |

###### Returns

`Promise`\<[`MutateResult`](#mutateresult)\>

###### Implementation of

[`IdempotencyStorage`](#idempotencystorage).[`delete`](#delete)

##### get()

```ts
get(key): Promise<IdempotencyRecord | null>;
```

Defined in: [src/storage/memory.storage.ts:28](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/memory.storage.ts#L28)

Fetches a record by key. Returns null if the key does not exist or has expired.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`IdempotencyRecord`](#idempotencyrecord) \| `null`\>

###### Implementation of

[`IdempotencyStorage`](#idempotencystorage).[`get`](#get)

##### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [src/storage/memory.storage.ts:122](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/memory.storage.ts#L122)

Lifecycle hook: clear all pending eviction timers when the module is torn down.
Prevents leaked timers from keeping the Node event loop alive in long test runs.

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleDestroy.onModuleDestroy
```

***

### PostgresStorage

Defined in: [src/storage/postgres.storage.ts:72](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L72)

Postgres-backed implementation of [IdempotencyStorage](#idempotencystorage).

Stores each record as a row in `idempotency_records` (override via
`tableName`). Atomic NX is enforced by the primary-key constraint on
`key` combined with `INSERT ... ON CONFLICT DO UPDATE WHERE
expires_at < now()`. Token-based compare-and-set is enforced by
`WHERE token = $` clauses on `complete()` and `delete()`. Lazy
expiration is enforced by `WHERE expires_at > now()` in `get()`.

For active cleanup of expired rows see [PostgresSweepService](#postgressweepservice).

#### Implements

- [`IdempotencyStorage`](#idempotencystorage)
- `OnModuleDestroy`

#### Constructors

##### Constructor

```ts
new PostgresStorage(options): PostgresStorage;
```

Defined in: [src/storage/postgres.storage.ts:78](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L78)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`PostgresStorageOptions`](#postgresstorageoptions) |

###### Returns

[`PostgresStorage`](#postgresstorage)

#### Methods

##### close()

```ts
close(): Promise<void>;
```

Defined in: [src/storage/postgres.storage.ts:233](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L233)

###### Returns

`Promise`\<`void`\>

##### complete()

```ts
complete(
   key, 
   token, 
   response, 
ttlSeconds): Promise<MutateResult>;
```

Defined in: [src/storage/postgres.storage.ts:172](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L172)

Transitions a `PROCESSING` record to `COMPLETED` and stores the captured response,
but ONLY if the stored record's token matches the caller's token.
Returns `'stale'` if the token does not match — meaning the original record
was evicted and a newer one exists under this key. The caller's response
must not overwrite the newer record.

On `'ok'`, implementations must refresh the TTL to `ttlSeconds`.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `token` | `string` |
| `response` | [`CompleteResponse`](#completeresponse) |
| `ttlSeconds` | `number` |

###### Returns

`Promise`\<[`MutateResult`](#mutateresult)\>

###### Implementation of

[`IdempotencyStorage`](#idempotencystorage).[`complete`](#complete)

##### create()

```ts
create(
   key, 
   fingerprint, 
ttlSeconds): Promise<CreateResult>;
```

Defined in: [src/storage/postgres.storage.ts:143](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L143)

Atomically creates a PROCESSING record. On success, returns an opaque
token that the caller MUST pass back to `complete()` / `delete()`.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | the idempotency key from the client header (already scoped by the interceptor to include endpoint identity) |
| `fingerprint` | `string` \| `undefined` | SHA-256 of the request body, or undefined if fingerprinting is off |
| `ttlSeconds` | `number` | lifetime of the lock; the interceptor passes the resolved TTL |

###### Returns

`Promise`\<[`CreateResult`](#createresult)\>

###### Implementation of

[`IdempotencyStorage`](#idempotencystorage).[`create`](#create)

##### createSchema()

```ts
static createSchema(pool, tableName?): Promise<void>;
```

Defined in: [src/storage/postgres.storage.ts:248](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L248)

Idempotently creates the records table and supporting index.
Safe to call multiple times. Used by `autoCreateSchema=true` and
available as a public helper for code-driven migrations.

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `pool` | `Pool` | `undefined` |
| `tableName` | `string` | `DEFAULT_TABLE_NAME` |

###### Returns

`Promise`\<`void`\>

##### delete()

```ts
delete(key, token): Promise<MutateResult>;
```

Defined in: [src/storage/postgres.storage.ts:209](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L209)

Removes a record, but ONLY if the caller's token matches. Returns `'ok'`
if the record was removed OR was already absent (idempotent cleanup), and
`'stale'` only if a DIFFERENT record (with a different token) is currently
stored under this key.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `token` | `string` |

###### Returns

`Promise`\<[`MutateResult`](#mutateresult)\>

###### Implementation of

[`IdempotencyStorage`](#idempotencystorage).[`delete`](#delete)

##### get()

```ts
get(key): Promise<IdempotencyRecord | null>;
```

Defined in: [src/storage/postgres.storage.ts:110](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L110)

Fetches a record by key. Returns null if the key does not exist or has expired.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`IdempotencyRecord`](#idempotencyrecord) \| `null`\>

###### Implementation of

[`IdempotencyStorage`](#idempotencystorage).[`get`](#get)

##### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [src/storage/postgres.storage.ts:239](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L239)

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleDestroy.onModuleDestroy
```

##### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [src/storage/postgres.storage.ts:104](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L104)

###### Returns

`Promise`\<`void`\>

***

### PostgresSweepService

Defined in: [src/services/postgres-sweep.service.ts:34](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/services/postgres-sweep.service.ts#L34)

Optional service that periodically deletes expired idempotency records.

Lazy expiration in [PostgresStorage.get](#get-2) already guarantees
correctness; this service exists only to keep disk usage and dead
tuples bounded in long-running deployments.

Multi-instance safety: each sweep wraps DELETE in
`pg_try_advisory_lock(hashtext('idempotency-sweep'))`. Concurrent
replicas will see a lock contention and skip — no DELETE storms.

#### Implements

- `OnModuleInit`
- `OnModuleDestroy`

#### Constructors

##### Constructor

```ts
new PostgresSweepService(storage, options?): PostgresSweepService;
```

Defined in: [src/services/postgres-sweep.service.ts:38](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/services/postgres-sweep.service.ts#L38)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `storage` | [`PostgresStorage`](#postgresstorage) |
| `options` | [`SweepOptions`](#sweepoptions) |

###### Returns

[`PostgresSweepService`](#postgressweepservice)

#### Methods

##### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [src/services/postgres-sweep.service.ts:56](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/services/postgres-sweep.service.ts#L56)

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleDestroy.onModuleDestroy
```

##### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [src/services/postgres-sweep.service.ts:45](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/services/postgres-sweep.service.ts#L45)

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleInit.onModuleInit
```

##### sweep()

```ts
sweep(): Promise<{
  deleted: number;
}>;
```

Defined in: [src/services/postgres-sweep.service.ts:64](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/services/postgres-sweep.service.ts#L64)

Runs one sweep cycle. Returns the number of rows deleted (0 if another
replica holds the advisory lock for this cycle).

###### Returns

`Promise`\<\{
  `deleted`: `number`;
\}\>

***

### RedisStorage

Defined in: [src/storage/redis.storage.ts:76](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/redis.storage.ts#L76)

Redis-backed implementation of [IdempotencyStorage](#idempotencystorage).

Stores each record as a Redis Hash under `${keyPrefix}${key}` with two
fields: `token` (opaque UUID owned by the creating caller) and `payload`
(JSON-serialized SerializedPayload). All mutations go through
Lua scripts registered with `defineCommand` so the compare-and-set logic
runs atomically on the Redis server — closing the race window that a
GET-then-SET pattern would leave open.

#### Implements

- [`IdempotencyStorage`](#idempotencystorage)
- `OnModuleDestroy`

#### Constructors

##### Constructor

```ts
new RedisStorage(options): RedisStorage;
```

Defined in: [src/storage/redis.storage.ts:81](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/redis.storage.ts#L81)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RedisStorageOptions`](#redisstorageoptions) |

###### Returns

[`RedisStorage`](#redisstorage)

#### Methods

##### close()

```ts
close(): Promise<void>;
```

Defined in: [src/storage/redis.storage.ts:202](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/redis.storage.ts#L202)

Closes the internally-managed Redis client. No-op if the client was
supplied by the consumer (they own its lifecycle).

Normally called automatically via `onModuleDestroy()` during Nest's
shutdown. Exposed publicly so non-Nest consumers (or manual teardown
in tests) can trigger the cleanup without going through the module
lifecycle.

###### Returns

`Promise`\<`void`\>

##### complete()

```ts
complete(
   key, 
   token, 
   response, 
ttlSeconds): Promise<MutateResult>;
```

Defined in: [src/storage/redis.storage.ts:156](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/redis.storage.ts#L156)

Transitions a `PROCESSING` record to `COMPLETED` and stores the captured response,
but ONLY if the stored record's token matches the caller's token.
Returns `'stale'` if the token does not match — meaning the original record
was evicted and a newer one exists under this key. The caller's response
must not overwrite the newer record.

On `'ok'`, implementations must refresh the TTL to `ttlSeconds`.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `token` | `string` |
| `response` | [`CompleteResponse`](#completeresponse) |
| `ttlSeconds` | `number` |

###### Returns

`Promise`\<[`MutateResult`](#mutateresult)\>

###### Implementation of

[`IdempotencyStorage`](#idempotencystorage).[`complete`](#complete)

##### create()

```ts
create(
   key, 
   fingerprint, 
ttlSeconds): Promise<CreateResult>;
```

Defined in: [src/storage/redis.storage.ts:131](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/redis.storage.ts#L131)

Atomically creates a PROCESSING record. On success, returns an opaque
token that the caller MUST pass back to `complete()` / `delete()`.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | the idempotency key from the client header (already scoped by the interceptor to include endpoint identity) |
| `fingerprint` | `string` \| `undefined` | SHA-256 of the request body, or undefined if fingerprinting is off |
| `ttlSeconds` | `number` | lifetime of the lock; the interceptor passes the resolved TTL |

###### Returns

`Promise`\<[`CreateResult`](#createresult)\>

###### Implementation of

[`IdempotencyStorage`](#idempotencystorage).[`create`](#create)

##### delete()

```ts
delete(key, token): Promise<MutateResult>;
```

Defined in: [src/storage/redis.storage.ts:188](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/redis.storage.ts#L188)

Removes a record, but ONLY if the caller's token matches. Returns `'ok'`
if the record was removed OR was already absent (idempotent cleanup), and
`'stale'` only if a DIFFERENT record (with a different token) is currently
stored under this key.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `token` | `string` |

###### Returns

`Promise`\<[`MutateResult`](#mutateresult)\>

###### Implementation of

[`IdempotencyStorage`](#idempotencystorage).[`delete`](#delete)

##### get()

```ts
get(key): Promise<IdempotencyRecord | null>;
```

Defined in: [src/storage/redis.storage.ts:112](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/redis.storage.ts#L112)

Fetches a record by key. Returns null if the key does not exist or has expired.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`IdempotencyRecord`](#idempotencyrecord) \| `null`\>

###### Implementation of

[`IdempotencyStorage`](#idempotencystorage).[`get`](#get)

##### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [src/storage/redis.storage.ts:217](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/redis.storage.ts#L217)

Nest lifecycle hook — fires automatically when the host module is
destroyed (e.g. during `app.close()`). Delegates to [close](#close-1)
so consumers who pass only `connection` options (letting this class
own the client) get graceful teardown without manual bookkeeping.

If the consumer supplied their own `client`, this hook is a no-op:
they remain responsible for closing what they created.

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleDestroy.onModuleDestroy
```

## Interfaces

### CompleteResponse

Defined in: [src/interfaces/idempotency-storage.interface.ts:6](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-storage.interface.ts#L6)

The response payload captured by the interceptor and persisted by storage.

#### Properties

##### body?

```ts
optional body?: string;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:11](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-storage.interface.ts#L11)

JSON-serialized response body, or undefined for empty bodies (e.g. 204).

##### headers?

```ts
optional headers?: Record<string, string>;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:14](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-storage.interface.ts#L14)

Lowercase HTTP response headers captured for replay.

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:8](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-storage.interface.ts#L8)

HTTP status code emitted by the original handler.

***

### CreateResult

Defined in: [src/interfaces/idempotency-storage.interface.ts:28](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-storage.interface.ts#L28)

Return shape of [IdempotencyStorage.create](#create).

`acquired === true` means this caller successfully created a new PROCESSING
record and was given an opaque `token` that uniquely identifies that record.
The caller MUST pass this token back to `complete()` / `delete()` so the
storage can verify it still owns the record before mutating it.

`acquired === false` means a record already existed (NX semantics). No token
is issued in this case.

#### Properties

##### acquired

```ts
acquired: boolean;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:29](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-storage.interface.ts#L29)

##### token?

```ts
optional token?: string;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:30](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-storage.interface.ts#L30)

***

### IdempotencyAsyncOptions

Defined in: [src/interfaces/idempotency-options.interface.ts:184](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L184)

Async configuration passed to [IdempotencyModule.forRootAsync](#forrootasync).
Mirrors the standard NestJS async-module pattern (useFactory / useClass / useExisting).

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

Defined in: [src/interfaces/idempotency-options.interface.ts:190](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L190)

##### isGlobal?

```ts
optional isGlobal?: boolean;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:191](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L191)

##### useClass?

```ts
optional useClass?: Type<IdempotencyOptionsFactory>;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:186](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L186)

##### useExisting?

```ts
optional useExisting?: Type<IdempotencyOptionsFactory>;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:185](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L185)

##### useFactory?

```ts
optional useFactory?: (...args) => 
  | IdempotencyOptions
| Promise<IdempotencyOptions>;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:187](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L187)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`IdempotencyOptions`](#idempotencyoptions)
  \| `Promise`\<[`IdempotencyOptions`](#idempotencyoptions)\>

***

### IdempotencyOptions

Defined in: [src/interfaces/idempotency-options.interface.ts:79](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L79)

Module-level configuration passed to [IdempotencyModule.forRoot](#forroot).

#### Properties

##### fingerprint?

```ts
optional fingerprint?: boolean | IdempotencyFingerprintResolver;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:136](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L136)

When true, the interceptor computes a SHA-256 fingerprint of the request body
and verifies it on subsequent requests. Pass a resolver function to provide
an application-specific semantic fingerprint. A mismatch produces HTTP 422.

###### Default

```ts
true
```

##### headerName?

```ts
optional headerName?: string;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:114](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L114)

The HTTP header name carrying the idempotency key. Override only if you
need to deviate from the IETF draft default.

###### Default

```ts
'Idempotency-Key'
```

##### isGlobal?

```ts
optional isGlobal?: boolean;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:168](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L168)

When true, the module is registered as a global module (no need to import
it into every consumer module).

###### Default

```ts
true
```

##### keyResolver?

```ts
optional keyResolver?: IdempotencyKeyResolver;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:120](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L120)

Optional application-level idempotency key resolver. When configured, its
return value is used instead of reading the configured header.

##### maxKeyLength?

```ts
optional maxKeyLength?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:127](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L127)

Maximum accepted idempotency key length, in characters.

###### Default

```ts
255
```

##### observability?

```ts
optional observability?: IdempotencyObservabilityOptions;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:160](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L160)

Optional operational hooks and client-visible status headers.

##### processingTtl?

```ts
optional processingTtl?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:106](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L106)

Optional time-to-live for in-flight PROCESSING records, in seconds.
When omitted, [ttl](#ttl) is used for both processing locks and completed
replay records. Per-handler `@Idempotent({ processingTtl })` overrides this.

Configure this only when you want stuck in-flight records to expire sooner
than completed replay records. Values shorter than the endpoint's real
processing time can allow duplicate execution.

##### replayHeaders?

```ts
optional replayHeaders?: ReplayHeadersOption;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:155](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L155)

Controls which response headers are captured and replayed.

`true` or undefined uses the conservative default allowlist.
`false` disables header replay.
A string array uses an explicit allowlist, still filtered through the
unsafe header denylist.

###### Default

```ts
true
```

##### scope?

```ts
optional scope?: IdempotencyScope;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:143](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L143)

How storage keys are namespaced. See [IdempotencyScope](#idempotencyscope).

###### Default

```ts
'endpoint'
```

##### storage

```ts
storage: IdempotencyStorage;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:85](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L85)

The storage adapter instance to use. Construct it yourself
(e.g. `new MemoryStorage()` or `new RedisStorage({ host, port })`)
for full type-safe control over adapter wiring.

##### ttl?

```ts
optional ttl?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:95](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L95)

Default time-to-live for idempotency records, in seconds.
Per-handler `@Idempotent({ ttl })` overrides this.
Completed replay records use this TTL. In-flight PROCESSING records also
use this TTL unless [processingTtl](#processingttl) is configured.

###### Default

```ts
86400 (24 hours)
```

***

### IdempotencyOptionsFactory

Defined in: [src/interfaces/idempotency-options.interface.ts:174](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L174)

Factory contract for `useClass` / `useExisting` async registration paths.

#### Methods

##### createIdempotencyOptions()

```ts
createIdempotencyOptions(): 
  | IdempotencyOptions
| Promise<IdempotencyOptions>;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:175](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L175)

###### Returns

  \| [`IdempotencyOptions`](#idempotencyoptions)
  \| `Promise`\<[`IdempotencyOptions`](#idempotencyoptions)\>

***

### IdempotencyRecord

Defined in: [src/interfaces/idempotency-record.interface.ts:14](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-record.interface.ts#L14)

The persisted shape of an idempotency record across all storage adapters.

#### Properties

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:54](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-record.interface.ts#L54)

When the record was first created by `IdempotencyStorage.create()`.

**Invariant**: this field is IMMUTABLE over the lifetime of a record.
`complete()` and any other mutation MUST preserve the original value.
Storage adapters that rewrite `createdAt` on update are non-conformant
and WILL break consumers who use it for monitoring (e.g. first-seen
timestamps in metrics / audit trails).

##### expiresAt

```ts
expiresAt: Date;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:61](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-record.interface.ts#L61)

When the record will be evicted by the storage adapter.
Unlike `createdAt`, this field IS mutated on `complete()` when the
adapter refreshes the TTL window to the new (typically longer) value.

##### fingerprint?

```ts
optional fingerprint?: string;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:31](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-record.interface.ts#L31)

SHA-256 of the request body, used to detect a key being reused with a
different payload (which produces HTTP 422 per the IETF draft).
Undefined when fingerprinting is disabled.

##### key

```ts
key: string;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:16](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-record.interface.ts#L16)

The exact value of the `Idempotency-Key` header from the original request.

##### responseBody?

```ts
optional responseBody?: string;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:40](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-record.interface.ts#L40)

JSON-serialized response body, ready to be parsed and replayed.

##### responseHeaders?

```ts
optional responseHeaders?: Record<string, string>;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:43](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-record.interface.ts#L43)

Lowercase HTTP response headers captured for replay.

##### status

```ts
status: IdempotencyStatus;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:34](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-record.interface.ts#L34)

Current lifecycle state.

##### statusCode?

```ts
optional statusCode?: number;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:37](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-record.interface.ts#L37)

Captured HTTP status code of the original handler response.

##### token

```ts
token: string;
```

Defined in: [src/interfaces/idempotency-record.interface.ts:24](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-record.interface.ts#L24)

Opaque token issued by `IdempotencyStorage.create()` that uniquely
identifies THIS record across its lifetime. Used by `complete()` /
`delete()` to compare-and-set so that a slow caller cannot clobber a
newer caller's record after TTL eviction.

***

### IdempotencyStorage

Defined in: [src/interfaces/idempotency-storage.interface.ts:74](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-storage.interface.ts#L74)

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
   See [IdempotencyRecord.createdAt](#createdat).

### Lifecycle

Storage adapters that hold external resources (Redis clients, DB
connections, timers) SHOULD implement Nest's `OnModuleDestroy` hook so
the resources are released when the host application shuts down. Both
built-in adapters (`MemoryStorage`, `RedisStorage`) do this — a custom
adapter is free to opt in the same way.

A cross-adapter contract suite that exercises every requirement of this
interface lives at `test/support/shared-storage-contract.ts` — new
adapters should be plugged into it to guarantee LSP-level uniformity.

#### Methods

##### complete()

```ts
complete(
   key, 
   token, 
   response, 
ttlSeconds): Promise<MutateResult>;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:104](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-storage.interface.ts#L104)

Transitions a `PROCESSING` record to `COMPLETED` and stores the captured response,
but ONLY if the stored record's token matches the caller's token.
Returns `'stale'` if the token does not match — meaning the original record
was evicted and a newer one exists under this key. The caller's response
must not overwrite the newer record.

On `'ok'`, implementations must refresh the TTL to `ttlSeconds`.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `token` | `string` |
| `response` | [`CompleteResponse`](#completeresponse) |
| `ttlSeconds` | `number` |

###### Returns

`Promise`\<[`MutateResult`](#mutateresult)\>

##### create()

```ts
create(
   key, 
   fingerprint, 
ttlSeconds): Promise<CreateResult>;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:89](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-storage.interface.ts#L89)

Atomically creates a PROCESSING record. On success, returns an opaque
token that the caller MUST pass back to `complete()` / `delete()`.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | the idempotency key from the client header (already scoped by the interceptor to include endpoint identity) |
| `fingerprint` | `string` \| `undefined` | SHA-256 of the request body, or undefined if fingerprinting is off |
| `ttlSeconds` | `number` | lifetime of the lock; the interceptor passes the resolved TTL |

###### Returns

`Promise`\<[`CreateResult`](#createresult)\>

##### delete()

```ts
delete(key, token): Promise<MutateResult>;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:117](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-storage.interface.ts#L117)

Removes a record, but ONLY if the caller's token matches. Returns `'ok'`
if the record was removed OR was already absent (idempotent cleanup), and
`'stale'` only if a DIFFERENT record (with a different token) is currently
stored under this key.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `token` | `string` |

###### Returns

`Promise`\<[`MutateResult`](#mutateresult)\>

##### get()

```ts
get(key): Promise<IdempotencyRecord | null>;
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:78](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-storage.interface.ts#L78)

Fetches a record by key. Returns null if the key does not exist or has expired.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`IdempotencyRecord`](#idempotencyrecord) \| `null`\>

***

### IdempotentMetadata

Defined in: [src/interfaces/idempotency-options.interface.ts:238](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L238)

The metadata shape persisted via `SetMetadata` by the [Idempotent](#idempotent) decorator.
The `enabled: true` flag lets the interceptor distinguish "decorator applied
with no overrides" from "no decorator at all".

#### Extends

- [`IdempotentOptions`](#idempotentoptions)

#### Properties

##### enabled

```ts
enabled: true;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:239](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L239)

##### fingerprint?

```ts
optional fingerprint?: boolean | IdempotencyFingerprintResolver;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:230](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L230)

Override the module-level fingerprint setting for this handler.

###### Inherited from

[`IdempotentOptions`](#idempotentoptions).[`fingerprint`](#fingerprint-3)

##### keyResolver?

```ts
optional keyResolver?: IdempotencyKeyResolver;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:220](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L220)

Override the module-level key resolver for this handler.

###### Inherited from

[`IdempotentOptions`](#idempotentoptions).[`keyResolver`](#keyresolver-2)

##### maxKeyLength?

```ts
optional maxKeyLength?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:225](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L225)

Override the module-level maximum key length for this handler.

###### Inherited from

[`IdempotentOptions`](#idempotentoptions).[`maxKeyLength`](#maxkeylength-2)

##### processingTtl?

```ts
optional processingTtl?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:215](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L215)

Override the module-level processing TTL for this handler (in seconds).

###### Inherited from

[`IdempotentOptions`](#idempotentoptions).[`processingTtl`](#processingttl-2)

##### required?

```ts
optional required?: boolean;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:205](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L205)

When true, the `Idempotency-Key` header is mandatory and a missing header
produces HTTP 400. When false, requests without the header pass through
normally (no idempotency check).

###### Default

```ts
true
```

###### Inherited from

[`IdempotentOptions`](#idempotentoptions).[`required`](#required-1)

##### ttl?

```ts
optional ttl?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:210](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L210)

Override the module-level TTL for this handler (in seconds).

###### Inherited from

[`IdempotentOptions`](#idempotentoptions).[`ttl`](#ttl-2)

***

### IdempotentOptions

Defined in: [src/interfaces/idempotency-options.interface.ts:197](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L197)

Per-handler overrides accepted by the [Idempotent](#idempotent) decorator.

#### Extended by

- [`IdempotentMetadata`](#idempotentmetadata)

#### Properties

##### fingerprint?

```ts
optional fingerprint?: boolean | IdempotencyFingerprintResolver;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:230](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L230)

Override the module-level fingerprint setting for this handler.

##### keyResolver?

```ts
optional keyResolver?: IdempotencyKeyResolver;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:220](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L220)

Override the module-level key resolver for this handler.

##### maxKeyLength?

```ts
optional maxKeyLength?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:225](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L225)

Override the module-level maximum key length for this handler.

##### processingTtl?

```ts
optional processingTtl?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:215](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L215)

Override the module-level processing TTL for this handler (in seconds).

##### required?

```ts
optional required?: boolean;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:205](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L205)

When true, the `Idempotency-Key` header is mandatory and a missing header
produces HTTP 400. When false, requests without the header pass through
normally (no idempotency check).

###### Default

```ts
true
```

##### ttl?

```ts
optional ttl?: number;
```

Defined in: [src/interfaces/idempotency-options.interface.ts:210](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L210)

Override the module-level TTL for this handler (in seconds).

***

### PostgresStorageOptions

Defined in: [src/storage/postgres.storage.ts:21](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L21)

Constructor options for [PostgresStorage](#postgresstorage).

Provide either a pre-built `pool` (recommended — lets the consumer manage
connection lifecycle) OR a `connection` config that the storage uses to
lazily build its own pool.

#### Properties

##### autoCreateSchema?

```ts
optional autoCreateSchema?: boolean;
```

Defined in: [src/storage/postgres.storage.ts:37](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L37)

If true, run `CREATE TABLE IF NOT EXISTS` and matching index on
module init. Defaults to false. Recommended only for development.

##### connection?

```ts
optional connection?: PoolConfig;
```

Defined in: [src/storage/postgres.storage.ts:25](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L25)

pg PoolConfig used to lazily construct an internal pool.

##### pool?

```ts
optional pool?: Pool;
```

Defined in: [src/storage/postgres.storage.ts:23](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L23)

A pre-built pg Pool. Wins over `connection` if both are supplied.

##### poolFactory?

```ts
optional poolFactory?: (connection) => Pool;
```

Defined in: [src/storage/postgres.storage.ts:27](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L27)

Test-only seam: custom factory used in place of `new Pool(connection)`.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `connection` | `PoolConfig` |

###### Returns

`Pool`

##### tableName?

```ts
optional tableName?: string;
```

Defined in: [src/storage/postgres.storage.ts:32](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/postgres.storage.ts#L32)

Table name used for idempotency records.

###### Default

```ts
'idempotency_records'
```

***

### RedisStorageOptions

Defined in: [src/storage/redis.storage.ts:20](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/redis.storage.ts#L20)

Constructor options for [RedisStorage](#redisstorage).

Provide either a pre-built `client` (recommended — lets the consumer manage
connection lifecycle) OR a `connection` options object that the storage
uses to lazily build its own client.

#### Properties

##### client?

```ts
optional client?: Redis;
```

Defined in: [src/storage/redis.storage.ts:22](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/redis.storage.ts#L22)

A pre-built ioredis client. Wins over `connection` if both are supplied.

##### clientFactory?

```ts
optional clientFactory?: (connection) => Redis;
```

Defined in: [src/storage/redis.storage.ts:26](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/redis.storage.ts#L26)

Test-only seam: custom factory used in place of `new Redis(connection)`.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `connection` | `RedisOptions` |

###### Returns

`Redis`

##### connection?

```ts
optional connection?: RedisOptions;
```

Defined in: [src/storage/redis.storage.ts:24](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/redis.storage.ts#L24)

ioredis connection options used to lazily construct an internal client.

##### keyPrefix?

```ts
optional keyPrefix?: string;
```

Defined in: [src/storage/redis.storage.ts:31](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/storage/redis.storage.ts#L31)

Prefix prepended to every idempotency key in Redis.

###### Default

```ts
'idempotency:'
```

***

### SweepOptions

Defined in: [src/services/postgres-sweep.service.ts:13](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/services/postgres-sweep.service.ts#L13)

#### Properties

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/services/postgres-sweep.service.ts:15](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/services/postgres-sweep.service.ts#L15)

When false, the service is wired up but never schedules a sweep.

##### intervalMs?

```ts
optional intervalMs?: number;
```

Defined in: [src/services/postgres-sweep.service.ts:17](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/services/postgres-sweep.service.ts#L17)

Sweep cadence. Defaults to 60_000 (1 minute).

## Type Aliases

### IdempotencyScope

```ts
type IdempotencyScope = "endpoint" | "global" | ((context) => string);
```

Defined in: [src/interfaces/idempotency-options.interface.ts:21](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L21)

How the interceptor derives the storage-key namespace from the request.

- `'endpoint'` (default) — scope by actual HTTP method + request path when
  available, falling back to Nest route metadata and then controller class +
  handler method name. Two different endpoints using the SAME
  `Idempotency-Key` value will NOT collide. Matches the IETF draft
  recommendation that the key be unique per (key, request URI) tuple.

- `'global'` — legacy behavior: use the raw header value as the storage
  key with no namespace. Safe only if clients guarantee globally-unique
  keys across all endpoints (e.g. fresh UUIDs per request).

- A function `(ctx) => string` — fully custom scoping. Useful in
  multi-tenant systems where the scope should include the tenant ID.
  The returned string will be combined with the raw header value.

***

### IdempotencyStatus

```ts
type IdempotencyStatus = "PROCESSING" | "COMPLETED";
```

Defined in: [src/interfaces/idempotency-record.interface.ts:9](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-record.interface.ts#L9)

Lifecycle state of an idempotency record.

- `PROCESSING`: a request with this key is currently being handled.
  A duplicate request arriving in this state should receive HTTP 409 Conflict.
- `COMPLETED`: the request finished and its response is cached. A duplicate
  request with the same fingerprint should be replayed from the stored response.

***

### MutateResult

```ts
type MutateResult = "ok" | "stale";
```

Defined in: [src/interfaces/idempotency-storage.interface.ts:45](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-storage.interface.ts#L45)

Return shape of [IdempotencyStorage.complete](#complete) and
[IdempotencyStorage.delete](#delete).

- `'ok'`: the operation succeeded — the caller's token matched the stored
  record (or, for delete, the record was already absent).
- `'stale'`: the caller's token does NOT match the record currently stored
  under this key. This happens when the original PROCESSING record was
  evicted by TTL and a newer caller has since created a fresh record. The
  original caller MUST NOT touch the newer record; storage silently refused
  the write.

***

### ReplayHeadersOption

```ts
type ReplayHeadersOption = boolean | string[];
```

Defined in: [src/interfaces/idempotency-options.interface.ts:26](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/interfaces/idempotency-options.interface.ts#L26)

## Variables

### DEFAULT\_HEADER\_NAME

```ts
const DEFAULT_HEADER_NAME: "Idempotency-Key" = 'Idempotency-Key';
```

Defined in: [src/idempotency.constants.ts:29](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/idempotency.constants.ts#L29)

Default HTTP header name carrying the idempotency key.
Matches the IETF draft `httpapi-idempotency-key-header-07`.

***

### DEFAULT\_TTL\_SECONDS

```ts
const DEFAULT_TTL_SECONDS: 86400 = 86_400;
```

Defined in: [src/idempotency.constants.ts:34](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/idempotency.constants.ts#L34)

Default time-to-live for idempotency records, in seconds (24 hours).

***

### IDEMPOTENCY\_OPTIONS

```ts
const IDEMPOTENCY_OPTIONS: typeof IDEMPOTENCY_OPTIONS;
```

Defined in: [src/idempotency.constants.ts:4](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/idempotency.constants.ts#L4)

Injection token for the resolved [IdempotencyOptions](#idempotencyoptions) instance.

***

### IDEMPOTENCY\_STORAGE

```ts
const IDEMPOTENCY_STORAGE: typeof IDEMPOTENCY_STORAGE;
```

Defined in: [src/idempotency.constants.ts:9](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/idempotency.constants.ts#L9)

Injection token for the [IdempotencyStorage](#idempotencystorage) instance the interceptor uses.

***

### IDEMPOTENCY\_SWEEP\_OPTIONS

```ts
const IDEMPOTENCY_SWEEP_OPTIONS: typeof IDEMPOTENCY_SWEEP_OPTIONS;
```

Defined in: [src/idempotency.constants.ts:15](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/idempotency.constants.ts#L15)

Injection token for [SweepOptions](#sweepoptions). Optional — when not provided the
`PostgresSweepService` runs in disabled mode (no scheduled cleanup).

***

### IDEMPOTENT\_METADATA\_KEY

```ts
const IDEMPOTENT_METADATA_KEY: "nestarc:idempotent" = 'nestarc:idempotent';
```

Defined in: [src/idempotency.constants.ts:23](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/idempotency.constants.ts#L23)

Reflector metadata key carrying the per-handler [IdempotentMetadata](#idempotentmetadata).

Stored as a plain string (not Symbol) for maximum compatibility with
Nest's `Reflector.get` and `Reflect.getMetadata`.

## Functions

### Idempotent()

```ts
function Idempotent(options?): MethodDecorator;
```

Defined in: [src/idempotency.decorator.ts:29](https://github.com/nestarc/idempotency/blob/9610774a767d152c4cbae49c6276a4f2d76463e4/src/idempotency.decorator.ts#L29)

Marks a NestJS controller handler as idempotent.

The [IdempotencyInterceptor](#idempotencyinterceptor) reads this metadata to decide whether to
apply duplicate-request protection: extracting the `Idempotency-Key` header,
computing a request fingerprint, and replaying cached responses for repeats.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`IdempotentOptions`](#idempotentoptions) |

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
