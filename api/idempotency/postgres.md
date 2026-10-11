# postgres

## Classes

<a id="api-postgresstorage"></a>

### PostgresStorage

Defined in: [src/storage/postgres.storage.ts:110](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L110)

Postgres-backed implementation of [IdempotencyStorage](index.md#idempotencystorage).

Stores each record as a row in `idempotency_records` (override via
`tableName`). Atomic NX is enforced by the primary-key constraint on
`key` combined with `INSERT ... ON CONFLICT DO UPDATE WHERE
expires_at <= now()`. Token-based compare-and-set is enforced by
`WHERE token = $` clauses on `complete()` and `delete()`. Lazy
expiration is enforced by `WHERE expires_at > now()` in `get()`.

For active cleanup of expired rows see [PostgresSweepService](#api-postgressweepservice).

#### Implements

- [`IdempotencyStorage`](index.md#idempotencystorage)
- `OnModuleDestroy`

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new PostgresStorage(options): PostgresStorage;
```

Defined in: [src/storage/postgres.storage.ts:116](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L116)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`PostgresStorageOptions`](#api-postgresstorageoptions) |

###### Returns

[`PostgresStorage`](#api-postgresstorage)

#### Methods

<a id="api-close"></a>

##### close()

```ts
close(): Promise<void>;
```

Defined in: [src/storage/postgres.storage.ts:265](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L265)

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

Defined in: [src/storage/postgres.storage.ts:201](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L201)

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

Defined in: [src/storage/postgres.storage.ts:171](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L171)

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

<a id="api-createschema"></a>

##### createSchema()

```ts
static createSchema(pool, tableName?): Promise<void>;
```

Defined in: [src/storage/postgres.storage.ts:280](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L280)

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

<a id="api-delete"></a>

##### delete()

```ts
delete(key, token): Promise<MutateResult>;
```

Defined in: [src/storage/postgres.storage.ts:240](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L240)

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

Defined in: [src/storage/postgres.storage.ts:138](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L138)

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

Defined in: [src/storage/postgres.storage.ts:271](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L271)

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleDestroy.onModuleDestroy
```

<a id="api-onmoduleinit"></a>

##### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [src/storage/postgres.storage.ts:132](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L132)

###### Returns

`Promise`\<`void`\>

***

<a id="api-postgressweepservice"></a>

### PostgresSweepService

Defined in: [src/services/postgres-sweep.service.ts:38](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/services/postgres-sweep.service.ts#L38)

Optional service that periodically deletes expired idempotency records.

Lazy expiration in [PostgresStorage.get](#api-get) already guarantees
correctness; this service exists only to keep disk usage and dead
tuples bounded in long-running deployments.

Multi-instance safety: each sweep wraps DELETE in
`pg_try_advisory_lock(hashtext('idempotency-sweep'))`. Concurrent
replicas will see a lock contention and skip — no DELETE storms.

#### Implements

- `OnModuleInit`
- `OnModuleDestroy`

#### Constructors

<a id="api-constructor-1"></a>

##### Constructor

```ts
new PostgresSweepService(storage, options?): PostgresSweepService;
```

Defined in: [src/services/postgres-sweep.service.ts:42](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/services/postgres-sweep.service.ts#L42)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `storage` | [`PostgresStorage`](#api-postgresstorage) |
| `options` | [`SweepOptions`](#api-sweepoptions) |

###### Returns

[`PostgresSweepService`](#api-postgressweepservice)

#### Methods

<a id="api-onmoduledestroy-1"></a>

##### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [src/services/postgres-sweep.service.ts:61](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/services/postgres-sweep.service.ts#L61)

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleDestroy.onModuleDestroy
```

<a id="api-onmoduleinit-1"></a>

##### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [src/services/postgres-sweep.service.ts:52](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/services/postgres-sweep.service.ts#L52)

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
OnModuleInit.onModuleInit
```

<a id="api-sweep"></a>

##### sweep()

```ts
sweep(): Promise<{
  deleted: number;
}>;
```

Defined in: [src/services/postgres-sweep.service.ts:69](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/services/postgres-sweep.service.ts#L69)

Runs one sweep cycle. Returns the number of rows deleted (0 if another
replica holds the advisory lock for this cycle).

###### Returns

`Promise`\<\{
  `deleted`: `number`;
\}\>

## Interfaces

<a id="api-postgresstorageoptions"></a>

### PostgresStorageOptions

Defined in: [src/storage/postgres.storage.ts:22](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L22)

Constructor options for [PostgresStorage](#api-postgresstorage).

Provide either a pre-built `pool` (recommended — lets the consumer manage
connection lifecycle) OR a `connection` config that the storage uses to
lazily build its own pool.

#### Properties

<a id="api-autocreateschema"></a>

##### autoCreateSchema?

```ts
optional autoCreateSchema?: boolean;
```

Defined in: [src/storage/postgres.storage.ts:38](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L38)

If true, run `CREATE TABLE IF NOT EXISTS` and matching index on
module init. Defaults to false. Recommended only for development.

<a id="api-connection"></a>

##### connection?

```ts
optional connection?: PoolConfig;
```

Defined in: [src/storage/postgres.storage.ts:26](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L26)

pg PoolConfig used to lazily construct an internal pool.

<a id="api-pool"></a>

##### pool?

```ts
optional pool?: Pool;
```

Defined in: [src/storage/postgres.storage.ts:24](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L24)

A pre-built pg Pool. Wins over `connection` if both are supplied.

<a id="api-poolfactory"></a>

##### poolFactory?

```ts
optional poolFactory?: (connection) => Pool;
```

Defined in: [src/storage/postgres.storage.ts:28](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L28)

Test-only seam: custom factory used in place of `new Pool(connection)`.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `connection` | `PoolConfig` |

###### Returns

`Pool`

<a id="api-tablename"></a>

##### tableName?

```ts
optional tableName?: string;
```

Defined in: [src/storage/postgres.storage.ts:33](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/storage/postgres.storage.ts#L33)

Table name used for idempotency records.

###### Default

```ts
'idempotency_records'
```

***

<a id="api-sweepoptions"></a>

### SweepOptions

Defined in: [src/services/postgres-sweep.service.ts:17](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/services/postgres-sweep.service.ts#L17)

#### Properties

<a id="api-enabled"></a>

##### enabled

```ts
enabled: boolean;
```

Defined in: [src/services/postgres-sweep.service.ts:19](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/services/postgres-sweep.service.ts#L19)

When false, the service is wired up but never schedules a sweep.

<a id="api-intervalms"></a>

##### intervalMs?

```ts
optional intervalMs?: number;
```

Defined in: [src/services/postgres-sweep.service.ts:21](https://github.com/nestarc/idempotency/blob/5dca8af4ef66bf861cd7e264c6975ab2a3f9ab62/src/services/postgres-sweep.service.ts#L21)

Sweep cadence. Defaults to 60_000 (1 minute).
