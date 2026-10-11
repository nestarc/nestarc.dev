# redis

## Classes

<a id="api-redisstorage"></a>

### RedisStorage

Defined in: [src/storage/redis.storage.ts:93](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/redis.storage.ts#L93)

Redis-backed implementation of [IdempotencyStorage](index.md#idempotencystorage).

Stores each record as a Redis Hash under `${keyPrefix}${key}` with two
fields: `token` (opaque UUID owned by the creating caller) and `payload`
(JSON-serialized SerializedPayload). All mutations go through
Lua scripts registered with `defineCommand` so the compare-and-set logic
runs atomically on the Redis server — closing the race window that a
GET-then-SET pattern would leave open.

#### Implements

- [`IdempotencyStorage`](index.md#idempotencystorage)
- `OnModuleDestroy`

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new RedisStorage(options): RedisStorage;
```

Defined in: [src/storage/redis.storage.ts:98](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/redis.storage.ts#L98)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RedisStorageOptions`](#api-redisstorageoptions) |

###### Returns

[`RedisStorage`](#api-redisstorage)

#### Methods

<a id="api-close"></a>

##### close()

```ts
close(): Promise<void>;
```

Defined in: [src/storage/redis.storage.ts:213](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/redis.storage.ts#L213)

Closes the internally-managed Redis client. No-op if the client was
supplied by the consumer (they own its lifecycle).

Normally called automatically via `onModuleDestroy()` during Nest's
shutdown. Exposed publicly so non-Nest consumers (or manual teardown
in tests) can trigger the cleanup without going through the module
lifecycle.

###### Returns

`Promise`\<`void`\>

<a id="api-complete"></a>

##### complete()

```ts
complete(
   key,
   token,
   response,
ttlSeconds): Promise<MutateResult>;
```

Defined in: [src/storage/redis.storage.ts:162](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/redis.storage.ts#L162)

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
| `response` | [`CompleteResponse`](index.md#completeresponse) | - |
| `ttlSeconds` | `number` | completed record lifetime, an integer in [1, 2_147_483_647] seconds |

###### Returns

`Promise`\<[`MutateResult`](index.md#mutateresult)\>

###### Throws

RangeError if ttlSeconds is invalid, before ownership or state checks

###### Implementation of

[`IdempotencyStorage`](index.md#idempotencystorage).[`complete`](index.md#complete)

<a id="api-create"></a>

##### create()

```ts
create(
   key,
   fingerprint,
ttlSeconds): Promise<CreateResult>;
```

Defined in: [src/storage/redis.storage.ts:136](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/redis.storage.ts#L136)

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

`Promise`\<[`CreateResult`](index.md#createresult)\>

###### Throws

RangeError if ttlSeconds is invalid, before NX or expiry checks

###### Implementation of

[`IdempotencyStorage`](index.md#idempotencystorage).[`create`](index.md#create)

<a id="api-delete"></a>

##### delete()

```ts
delete(key, token): Promise<MutateResult>;
```

Defined in: [src/storage/redis.storage.ts:199](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/redis.storage.ts#L199)

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

`Promise`\<[`MutateResult`](index.md#mutateresult)\>

###### Implementation of

[`IdempotencyStorage`](index.md#idempotencystorage).[`delete`](index.md#delete)

<a id="api-get"></a>

##### get()

```ts
get(key): Promise<IdempotencyRecord | null>;
```

Defined in: [src/storage/redis.storage.ts:117](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/redis.storage.ts#L117)

Fetches a record by key. Returns null if the key does not exist or has expired.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`Promise`\<[`IdempotencyRecord`](index.md#idempotencyrecord) \| `null`\>

###### Implementation of

[`IdempotencyStorage`](index.md#idempotencystorage).[`get`](index.md#get)

<a id="api-onmoduledestroy"></a>

##### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [src/storage/redis.storage.ts:228](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/redis.storage.ts#L228)

Nest lifecycle hook — fires automatically when the host module is
destroyed (e.g. during `app.close()`). Delegates to [close](#api-close)
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

<a id="api-redisstorageoptions"></a>

### RedisStorageOptions

Defined in: [src/storage/redis.storage.ts:23](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/redis.storage.ts#L23)

Constructor options for [RedisStorage](#api-redisstorage).

Provide either a pre-built `client` (recommended — lets the consumer manage
connection lifecycle) OR a `connection` options object that the storage
uses to lazily build its own client.

#### Properties

<a id="api-client"></a>

##### client?

```ts
optional client?: Redis;
```

Defined in: [src/storage/redis.storage.ts:25](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/redis.storage.ts#L25)

A pre-built ioredis client. Wins over `connection` if both are supplied.

<a id="api-clientfactory"></a>

##### clientFactory?

```ts
optional clientFactory?: (connection) => Redis;
```

Defined in: [src/storage/redis.storage.ts:29](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/redis.storage.ts#L29)

Test-only seam: custom factory used in place of `new Redis(connection)`.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `connection` | `RedisOptions` |

###### Returns

`Redis`

<a id="api-connection"></a>

##### connection?

```ts
optional connection?: RedisOptions;
```

Defined in: [src/storage/redis.storage.ts:27](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/redis.storage.ts#L27)

ioredis connection options used to lazily construct an internal client.

<a id="api-keyprefix"></a>

##### keyPrefix?

```ts
optional keyPrefix?: string;
```

Defined in: [src/storage/redis.storage.ts:34](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/redis.storage.ts#L34)

Prefix prepended to every idempotency key in Redis.

###### Default

```ts
'idempotency:'
```
