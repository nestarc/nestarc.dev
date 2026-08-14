# @nestarc/webhook

## Classes

### FetchHttpClient

Defined in: [src/adapters/fetch-http-client.ts:21](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/fetch-http-client.ts#L21)

#### Implements

- [`WebhookHttpClient`](#webhookhttpclient)

#### Constructors

##### Constructor

```ts
new FetchHttpClient(): FetchHttpClient;
```

###### Returns

[`FetchHttpClient`](#fetchhttpclient)

#### Methods

##### post()

```ts
post(
   url, 
   headers, 
   body, 
   timeout, 
options?): Promise<DeliveryResult>;
```

Defined in: [src/adapters/fetch-http-client.ts:22](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/fetch-http-client.ts#L22)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | - |
| `headers` | `Record`\<`string`, `string`\> | - |
| `body` | `string` | - |
| `timeout` | `number` | milliseconds before the request is aborted. |
| `options?` | `WebhookHttpClientRequestOptions` | - |

###### Returns

`Promise`\<[`DeliveryResult`](#deliveryresult)\>

DeliveryResult with success false on timeout/network failure; implementations should not throw for HTTP failures.

###### Implementation of

[`WebhookHttpClient`](#webhookhttpclient).[`post`](#post-1)

***

### PlaintextSecretVault

Defined in: [src/adapters/plaintext-secret-vault.ts:9](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/plaintext-secret-vault.ts#L9)

Default no-op vault — secrets are stored and retrieved as-is.
Replace with a real implementation (e.g. AES-256-GCM) for production.

#### Implements

- [`WebhookSecretVault`](#webhooksecretvault)

#### Constructors

##### Constructor

```ts
new PlaintextSecretVault(): PlaintextSecretVault;
```

###### Returns

[`PlaintextSecretVault`](#plaintextsecretvault)

#### Methods

##### decrypt()

```ts
decrypt(secret): Promise<string>;
```

Defined in: [src/adapters/plaintext-secret-vault.ts:14](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/plaintext-secret-vault.ts#L14)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `secret` | `string` |

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`WebhookSecretVault`](#webhooksecretvault).[`decrypt`](#decrypt-1)

##### encrypt()

```ts
encrypt(secret): Promise<string>;
```

Defined in: [src/adapters/plaintext-secret-vault.ts:10](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/plaintext-secret-vault.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `secret` | `string` |

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`WebhookSecretVault`](#webhooksecretvault).[`encrypt`](#encrypt-1)

***

### PrismaDeliveryRepository

Defined in: [src/adapters/prisma-delivery.repository.ts:100](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L100)

#### Implements

- [`WebhookDeliveryRepository`](#webhookdeliveryrepository)

#### Constructors

##### Constructor

```ts
new PrismaDeliveryRepository(
   prisma, 
   vault?, 
   redaction?): PrismaDeliveryRepository;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:101](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L101)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `prisma` | `any` |
| `vault?` | [`WebhookSecretVault`](#webhooksecretvault) |
| `redaction?` | [`WebhookRedactionOptions`](#webhookredactionoptions) |

###### Returns

[`PrismaDeliveryRepository`](#prismadeliveryrepository)

#### Methods

##### claimPendingDeliveries()

```ts
claimPendingDeliveries(batchSize): Promise<ClaimedDelivery[]>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:157](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L157)

Atomically claims pending rows and returns the minimal delivery identity needed for enrichment.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `batchSize` | `number` |

###### Returns

`Promise`\<[`ClaimedDelivery`](#claimeddelivery)[]\>

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`claimPendingDeliveries`](#claimpendingdeliveries-1)

##### createDeliveriesInTransaction()

```ts
createDeliveriesInTransaction(
   tx, 
   eventId, 
   endpointIds, 
maxAttempts): Promise<void>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:107](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L107)

Creates queued delivery rows inside the provided transaction.
No-op when endpointIds is empty.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | `any` |
| `eventId` | `string` |
| `endpointIds` | `string`[] |
| `maxAttempts` | `number` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`createDeliveriesInTransaction`](#createdeliveriesintransaction-1)

##### createTestDelivery()

```ts
createTestDelivery(eventId, endpointId): Promise<void>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:713](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L713)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `endpointId` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`createTestDelivery`](#createtestdelivery-1)

##### enrichDeliveries()

```ts
enrichDeliveries(deliveryIds): Promise<PendingDelivery[]>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:178](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L178)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryIds` | `string`[] |

###### Returns

`Promise`\<[`PendingDelivery`](#pendingdelivery)[]\>

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`enrichDeliveries`](#enrichdeliveries-1)

##### getBacklogSummary()

```ts
getBacklogSummary(): Promise<DeliveryBacklogSummary>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:334](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L334)

###### Returns

`Promise`\<[`DeliveryBacklogSummary`](#deliverybacklogsummary)\>

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`getBacklogSummary`](#getbacklogsummary-1)

##### getDeliveryAttempts()

```ts
getDeliveryAttempts(deliveryId): Promise<DeliveryAttemptRecord[]>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:460](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L460)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |

###### Returns

`Promise`\<[`DeliveryAttemptRecord`](#deliveryattemptrecord)[]\>

attempts sorted by attemptNumber ASC.

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`getDeliveryAttempts`](#getdeliveryattempts-3)

##### getDeliveryLogs()

```ts
getDeliveryLogs(endpointId, filters?): Promise<DeliveryRecord[]>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:406](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L406)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `filters?` | [`DeliveryLogFilters`](#deliverylogfilters) |

###### Returns

`Promise`\<[`DeliveryRecord`](#deliveryrecord)[]\>

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`getDeliveryLogs`](#getdeliverylogs-3)

##### markFailed()

```ts
markFailed(
   deliveryId, 
   attempts, 
result): Promise<void>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:237](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L237)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `attempts` | `number` |
| `result` | [`DeliveryResult`](#deliveryresult) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`markFailed`](#markfailed-1)

##### markRetry()

```ts
markRetry(
   deliveryId, 
   attempts, 
   nextAt, 
result): Promise<void>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:254](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L254)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `attempts` | `number` |
| `nextAt` | `Date` |
| `result` | [`DeliveryResult`](#deliveryresult) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`markRetry`](#markretry-1)

##### markSent()

```ts
markSent(
   deliveryId, 
   attempts, 
result): Promise<void>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:222](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L222)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `attempts` | `number` |
| `result` | [`DeliveryResult`](#deliveryresult) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`markSent`](#marksent-1)

##### purgeExpiredData()

```ts
purgeExpiredData(options, now?): Promise<WebhookRetentionPurgeResult>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:643](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L643)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`WebhookRetentionOptions`](#webhookretentionoptions) |
| `now` | `Date` |

###### Returns

`Promise`\<[`WebhookRetentionPurgeResult`](#webhookretentionpurgeresult)\>

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`purgeExpiredData`](#purgeexpireddata-1)

##### recoverStaleSending()

```ts
recoverStaleSending(stalenessMinutes): Promise<number>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:275](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L275)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `stalenessMinutes` | `number` |

###### Returns

`Promise`\<`number`\>

number of stale SENDING deliveries recovered or failed.

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`recoverStaleSending`](#recoverstalesending-1)

##### replayEvent()

```ts
replayEvent(eventId, options?): Promise<ReplayEventResult>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:562](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L562)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `options?` | [`ReplayEventOptions`](#replayeventoptions) |

###### Returns

`Promise`\<[`ReplayEventResult`](#replayeventresult)\>

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`replayEvent`](#replayevent-3)

##### retryDelivery()

```ts
retryDelivery(deliveryId, _options?): Promise<boolean>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:478](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L478)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `_options?` | [`RetryDeliveryOptions`](#retrydeliveryoptions) |

###### Returns

`Promise`\<`boolean`\>

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`retryDelivery`](#retrydelivery-3)

##### retryFailedDeliveries()

```ts
retryFailedDeliveries(filters, _options?): Promise<RetryFailedDeliveriesResult>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:491](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L491)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filters` | [`RetryFailedDeliveriesFilters`](#retryfaileddeliveriesfilters) |
| `_options?` | [`RetryDeliveryOptions`](#retrydeliveryoptions) |

###### Returns

`Promise`\<[`RetryFailedDeliveriesResult`](#retryfaileddeliveriesresult)\>

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`retryFailedDeliveries`](#retryfaileddeliveries-3)

##### runInTransaction()

```ts
runInTransaction<T>(fn): Promise<T>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:153](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-delivery.repository.ts#L153)

Runs the callback in one repository transaction. Pass the tx only to other *InTransaction port methods.

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`tx`) => `Promise`\<`T`\> |

###### Returns

`Promise`\<`T`\>

###### Implementation of

[`WebhookDeliveryRepository`](#webhookdeliveryrepository).[`runInTransaction`](#runintransaction-1)

***

### PrismaEndpointRepository

Defined in: [src/adapters/prisma-endpoint.repository.ts:38](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-endpoint.repository.ts#L38)

#### Implements

- [`WebhookEndpointRepository`](#webhookendpointrepository)

#### Constructors

##### Constructor

```ts
new PrismaEndpointRepository(prisma, vault?): PrismaEndpointRepository;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:39](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-endpoint.repository.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `prisma` | `any` |
| `vault?` | [`WebhookSecretVault`](#webhooksecretvault) |

###### Returns

[`PrismaEndpointRepository`](#prismaendpointrepository)

#### Methods

##### createEndpoint()

```ts
createEndpoint(input): Promise<EndpointRecordWithSecret>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:91](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-endpoint.repository.ts#L91)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ResolvedCreateEndpointInput`](#resolvedcreateendpointinput) |

###### Returns

`Promise`\<[`EndpointRecordWithSecret`](#endpointrecordwithsecret)\>

###### Implementation of

[`WebhookEndpointRepository`](#webhookendpointrepository).[`createEndpoint`](#createendpoint-3)

##### deleteEndpoint()

```ts
deleteEndpoint(id): Promise<boolean>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:197](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-endpoint.repository.ts#L197)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`Promise`\<`boolean`\>

true if a row was deleted, false if the endpoint did not exist.
May reject when existing delivery rows still reference the endpoint.

###### Implementation of

[`WebhookEndpointRepository`](#webhookendpointrepository).[`deleteEndpoint`](#deleteendpoint-3)

##### disableEndpoint()

```ts
disableEndpoint(endpointId, reason): Promise<boolean>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:239](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-endpoint.repository.ts#L239)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `reason` | `string` |

###### Returns

`Promise`\<`boolean`\>

true when the endpoint transitioned from active to inactive.

###### Implementation of

[`WebhookEndpointRepository`](#webhookendpointrepository).[`disableEndpoint`](#disableendpoint-1)

##### findMatchingEndpoints()

```ts
findMatchingEndpoints(eventType, tenantId): Promise<EndpointRecord[]>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:44](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-endpoint.repository.ts#L44)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventType` | `string` |
| `tenantId` | `string` \| `undefined` |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord)[]\>

###### Implementation of

[`WebhookEndpointRepository`](#webhookendpointrepository).[`findMatchingEndpoints`](#findmatchingendpoints-1)

##### findMatchingEndpointsInTransaction()

```ts
findMatchingEndpointsInTransaction(
   tx, 
   eventType, 
tenantId): Promise<EndpointRecord[]>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:67](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-endpoint.repository.ts#L67)

Use only with a transaction object received from WebhookDeliveryRepository.runInTransaction().

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | `any` |
| `eventType` | `string` |
| `tenantId` | `string` \| `undefined` |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord)[]\>

###### Implementation of

[`WebhookEndpointRepository`](#webhookendpointrepository).[`findMatchingEndpointsInTransaction`](#findmatchingendpointsintransaction-1)

##### getEndpoint()

```ts
getEndpoint(id): Promise<EndpointRecord | null>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:111](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-endpoint.repository.ts#L111)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord) \| `null`\>

###### Implementation of

[`WebhookEndpointRepository`](#webhookendpointrepository).[`getEndpoint`](#getendpoint-3)

##### incrementFailures()

```ts
incrementFailures(endpointId): Promise<number>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:230](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-endpoint.repository.ts#L230)

Atomically increments consecutive failures and returns the new value.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`number`\>

###### Implementation of

[`WebhookEndpointRepository`](#webhookendpointrepository).[`incrementFailures`](#incrementfailures-1)

##### listEndpoints()

```ts
listEndpoints(tenantId?): Promise<EndpointRecord[]>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:119](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-endpoint.repository.ts#L119)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId?` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord)[]\>

###### Implementation of

[`WebhookEndpointRepository`](#webhookendpointrepository).[`listEndpoints`](#listendpoints-3)

##### recoverEligibleEndpoints()

```ts
recoverEligibleEndpoints(cooldownMinutes): Promise<number>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:247](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-endpoint.repository.ts#L247)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `cooldownMinutes` | `number` |

###### Returns

`Promise`\<`number`\>

number of endpoints recovered after cooldown.

###### Implementation of

[`WebhookEndpointRepository`](#webhookendpointrepository).[`recoverEligibleEndpoints`](#recovereligibleendpoints-1)

##### resetFailures()

```ts
resetFailures(endpointId): Promise<void>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:203](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-endpoint.repository.ts#L203)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`WebhookEndpointRepository`](#webhookendpointrepository).[`resetFailures`](#resetfailures-1)

##### rotateSecret()

```ts
rotateSecret(id, input): Promise<EndpointRecord | null>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:174](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-endpoint.repository.ts#L174)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `input` | [`ResolvedRotateEndpointSecretInput`](#resolvedrotateendpointsecretinput) |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord) \| `null`\>

###### Implementation of

[`WebhookEndpointRepository`](#webhookendpointrepository).[`rotateSecret`](#rotatesecret-3)

##### updateEndpoint()

```ts
updateEndpoint(id, dto): Promise<EndpointRecord | null>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:134](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-endpoint.repository.ts#L134)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `dto` | [`UpdateEndpointDto`](#updateendpointdto) |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord) \| `null`\>

###### Implementation of

[`WebhookEndpointRepository`](#webhookendpointrepository).[`updateEndpoint`](#updateendpoint-3)

***

### PrismaEventRepository

Defined in: [src/adapters/prisma-event.repository.ts:9](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-event.repository.ts#L9)

#### Implements

- [`WebhookEventRepository`](#webhookeventrepository)

#### Constructors

##### Constructor

```ts
new PrismaEventRepository(prisma): PrismaEventRepository;
```

Defined in: [src/adapters/prisma-event.repository.ts:10](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-event.repository.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `prisma` | `any` |

###### Returns

[`PrismaEventRepository`](#prismaeventrepository)

#### Methods

##### saveEvent()

```ts
saveEvent(
   eventType, 
   payload, 
tenantId): Promise<string>;
```

Defined in: [src/adapters/prisma-event.repository.ts:12](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-event.repository.ts#L12)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventType` | `string` |
| `payload` | `Record`\<`string`, `unknown`\> |
| `tenantId` | `string` \| `null` |

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`WebhookEventRepository`](#webhookeventrepository).[`saveEvent`](#saveevent-1)

##### saveEventInTransaction()

```ts
saveEventInTransaction(
   tx, 
   eventType, 
   payload, 
tenantId): Promise<string>;
```

Defined in: [src/adapters/prisma-event.repository.ts:24](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-event.repository.ts#L24)

Use only with a transaction object received from WebhookDeliveryRepository.runInTransaction().

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | `any` |
| `eventType` | `string` |
| `payload` | `Record`\<`string`, `unknown`\> |
| `tenantId` | `string` \| `null` |

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`WebhookEventRepository`](#webhookeventrepository).[`saveEventInTransaction`](#saveeventintransaction-1)

##### saveEventOnceInTransaction()

```ts
saveEventOnceInTransaction(
   tx, 
   eventType, 
   payload, 
   tenantId, 
options): Promise<SavedWebhookEvent>;
```

Defined in: [src/adapters/prisma-event.repository.ts:37](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/adapters/prisma-event.repository.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | `any` |
| `eventType` | `string` |
| `payload` | `Record`\<`string`, `unknown`\> |
| `tenantId` | `string` \| `null` |
| `options` | `Required`\<`Pick`\<[`WebhookPublishOptions`](#webhookpublishoptions), `"idempotencyKey"`\>\> & `Pick`\<[`WebhookPublishOptions`](#webhookpublishoptions), `"correlationId"`\> |

###### Returns

`Promise`\<[`SavedWebhookEvent`](#savedwebhookevent)\>

###### Implementation of

[`WebhookEventRepository`](#webhookeventrepository).[`saveEventOnceInTransaction`](#saveeventonceintransaction-1)

***

### ~~WebhookAdminService~~

Defined in: [src/webhook.admin.service.ts:27](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.admin.service.ts#L27)

#### Deprecated

since v0.2.0. Will be removed in v1.0.0.
Use WebhookEndpointAdminService and WebhookDeliveryAdminService directly.

#### Constructors

##### Constructor

```ts
new WebhookAdminService(endpoints, deliveries): WebhookAdminService;
```

Defined in: [src/webhook.admin.service.ts:28](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.admin.service.ts#L28)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpoints` | [`WebhookEndpointAdminService`](#webhookendpointadminservice) |
| `deliveries` | [`WebhookDeliveryAdminService`](#webhookdeliveryadminservice) |

###### Returns

[`WebhookAdminService`](#webhookadminservice)

#### Methods

##### ~~createEndpoint()~~

```ts
createEndpoint(dto): Promise<EndpointRecordWithSecret>;
```

Defined in: [src/webhook.admin.service.ts:33](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.admin.service.ts#L33)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `dto` | [`CreateEndpointDto`](#createendpointdto) |

###### Returns

`Promise`\<[`EndpointRecordWithSecret`](#endpointrecordwithsecret)\>

##### ~~deleteEndpoint()~~

```ts
deleteEndpoint(endpointId): Promise<boolean>;
```

Defined in: [src/webhook.admin.service.ts:59](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.admin.service.ts#L59)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### ~~getDeliveryAttempts()~~

```ts
getDeliveryAttempts(deliveryId): Promise<DeliveryAttemptRecord[]>;
```

Defined in: [src/webhook.admin.service.ts:70](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.admin.service.ts#L70)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |

###### Returns

`Promise`\<[`DeliveryAttemptRecord`](#deliveryattemptrecord)[]\>

##### ~~getDeliveryLogs()~~

```ts
getDeliveryLogs(endpointId, filters?): Promise<DeliveryRecord[]>;
```

Defined in: [src/webhook.admin.service.ts:63](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.admin.service.ts#L63)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `filters?` | [`DeliveryLogFilters`](#deliverylogfilters) |

###### Returns

`Promise`\<[`DeliveryRecord`](#deliveryrecord)[]\>

##### ~~getEndpoint()~~

```ts
getEndpoint(endpointId): Promise<EndpointRecord | null>;
```

Defined in: [src/webhook.admin.service.ts:41](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.admin.service.ts#L41)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord) \| `null`\>

##### ~~listEndpoints()~~

```ts
listEndpoints(tenantId?): Promise<EndpointRecord[]>;
```

Defined in: [src/webhook.admin.service.ts:37](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.admin.service.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId?` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord)[]\>

##### ~~replayEvent()~~

```ts
replayEvent(eventId, options?): Promise<ReplayEventResult>;
```

Defined in: [src/webhook.admin.service.ts:88](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.admin.service.ts#L88)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `options?` | [`ReplayEventOptions`](#replayeventoptions) |

###### Returns

`Promise`\<[`ReplayEventResult`](#replayeventresult)\>

##### ~~retryDelivery()~~

```ts
retryDelivery(deliveryId, options?): Promise<boolean>;
```

Defined in: [src/webhook.admin.service.ts:74](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.admin.service.ts#L74)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `options?` | [`RetryDeliveryOptions`](#retrydeliveryoptions) |

###### Returns

`Promise`\<`boolean`\>

##### ~~retryFailedDeliveries()~~

```ts
retryFailedDeliveries(filters, options?): Promise<RetryFailedDeliveriesResult>;
```

Defined in: [src/webhook.admin.service.ts:81](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.admin.service.ts#L81)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filters` | [`RetryFailedDeliveriesFilters`](#retryfaileddeliveriesfilters) |
| `options?` | [`RetryDeliveryOptions`](#retrydeliveryoptions) |

###### Returns

`Promise`\<[`RetryFailedDeliveriesResult`](#retryfaileddeliveriesresult)\>

##### ~~rotateSecret()~~

```ts
rotateSecret(endpointId, dto): Promise<EndpointRecordWithSecret | null>;
```

Defined in: [src/webhook.admin.service.ts:52](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.admin.service.ts#L52)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `dto` | [`RotateEndpointSecretDto`](#rotateendpointsecretdto) |

###### Returns

`Promise`\<[`EndpointRecordWithSecret`](#endpointrecordwithsecret) \| `null`\>

##### ~~sendTestEvent()~~

```ts
sendTestEvent(endpointId): Promise<string | null>;
```

Defined in: [src/webhook.admin.service.ts:95](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.admin.service.ts#L95)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`string` \| `null`\>

##### ~~updateEndpoint()~~

```ts
updateEndpoint(endpointId, dto): Promise<EndpointRecord | null>;
```

Defined in: [src/webhook.admin.service.ts:45](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.admin.service.ts#L45)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `dto` | [`UpdateEndpointDto`](#updateendpointdto) |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord) \| `null`\>

***

### WebhookDeliveryAdminService

Defined in: [src/webhook.delivery-admin.service.ts:16](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.delivery-admin.service.ts#L16)

#### Constructors

##### Constructor

```ts
new WebhookDeliveryAdminService(deliveryRepo): WebhookDeliveryAdminService;
```

Defined in: [src/webhook.delivery-admin.service.ts:17](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.delivery-admin.service.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryRepo` | [`WebhookDeliveryRepository`](#webhookdeliveryrepository) |

###### Returns

[`WebhookDeliveryAdminService`](#webhookdeliveryadminservice)

#### Methods

##### getDeliveryAttempts()

```ts
getDeliveryAttempts(deliveryId): Promise<DeliveryAttemptRecord[]>;
```

Defined in: [src/webhook.delivery-admin.service.ts:29](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.delivery-admin.service.ts#L29)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |

###### Returns

`Promise`\<[`DeliveryAttemptRecord`](#deliveryattemptrecord)[]\>

##### getDeliveryLogs()

```ts
getDeliveryLogs(endpointId, filters?): Promise<DeliveryRecord[]>;
```

Defined in: [src/webhook.delivery-admin.service.ts:22](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.delivery-admin.service.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `filters?` | [`DeliveryLogFilters`](#deliverylogfilters) |

###### Returns

`Promise`\<[`DeliveryRecord`](#deliveryrecord)[]\>

##### replayEvent()

```ts
replayEvent(eventId, options?): Promise<ReplayEventResult>;
```

Defined in: [src/webhook.delivery-admin.service.ts:53](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.delivery-admin.service.ts#L53)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `options?` | [`ReplayEventOptions`](#replayeventoptions) |

###### Returns

`Promise`\<[`ReplayEventResult`](#replayeventresult)\>

##### retryDelivery()

```ts
retryDelivery(deliveryId, options?): Promise<boolean>;
```

Defined in: [src/webhook.delivery-admin.service.ts:33](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.delivery-admin.service.ts#L33)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `options?` | [`RetryDeliveryOptions`](#retrydeliveryoptions) |

###### Returns

`Promise`\<`boolean`\>

##### retryFailedDeliveries()

```ts
retryFailedDeliveries(filters, options?): Promise<RetryFailedDeliveriesResult>;
```

Defined in: [src/webhook.delivery-admin.service.ts:40](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.delivery-admin.service.ts#L40)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filters` | [`RetryFailedDeliveriesFilters`](#retryfaileddeliveriesfilters) |
| `options?` | [`RetryDeliveryOptions`](#retrydeliveryoptions) |

###### Returns

`Promise`\<[`RetryFailedDeliveriesResult`](#retryfaileddeliveriesresult)\>

***

### WebhookEndpointAdminService

Defined in: [src/webhook.endpoint-admin.service.ts:23](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.endpoint-admin.service.ts#L23)

#### Constructors

##### Constructor

```ts
new WebhookEndpointAdminService(
   endpointRepo, 
   eventRepo, 
   deliveryRepo, 
   signer, 
   options): WebhookEndpointAdminService;
```

Defined in: [src/webhook.endpoint-admin.service.ts:27](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.endpoint-admin.service.ts#L27)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointRepo` | [`WebhookEndpointRepository`](#webhookendpointrepository) |
| `eventRepo` | [`WebhookEventRepository`](#webhookeventrepository) |
| `deliveryRepo` | [`WebhookDeliveryRepository`](#webhookdeliveryrepository) |
| `signer` | [`WebhookSigner`](#webhooksigner) |
| `options` | [`WebhookModuleOptions`](#webhookmoduleoptions) |

###### Returns

[`WebhookEndpointAdminService`](#webhookendpointadminservice)

#### Methods

##### createEndpoint()

```ts
createEndpoint(dto): Promise<EndpointRecordWithSecret>;
```

Defined in: [src/webhook.endpoint-admin.service.ts:41](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.endpoint-admin.service.ts#L41)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `dto` | [`CreateEndpointDto`](#createendpointdto) |

###### Returns

`Promise`\<[`EndpointRecordWithSecret`](#endpointrecordwithsecret)\>

##### deleteEndpoint()

```ts
deleteEndpoint(endpointId): Promise<boolean>;
```

Defined in: [src/webhook.endpoint-admin.service.ts:96](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.endpoint-admin.service.ts#L96)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### getEndpoint()

```ts
getEndpoint(endpointId): Promise<EndpointRecord | null>;
```

Defined in: [src/webhook.endpoint-admin.service.ts:65](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.endpoint-admin.service.ts#L65)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord) \| `null`\>

##### listEndpoints()

```ts
listEndpoints(tenantId?): Promise<EndpointRecord[]>;
```

Defined in: [src/webhook.endpoint-admin.service.ts:61](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.endpoint-admin.service.ts#L61)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId?` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord)[]\>

##### rotateSecret()

```ts
rotateSecret(endpointId, dto): Promise<EndpointRecordWithSecret | null>;
```

Defined in: [src/webhook.endpoint-admin.service.ts:79](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.endpoint-admin.service.ts#L79)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `dto` | [`RotateEndpointSecretDto`](#rotateendpointsecretdto) |

###### Returns

`Promise`\<[`EndpointRecordWithSecret`](#endpointrecordwithsecret) \| `null`\>

##### sendTestEvent()

```ts
sendTestEvent(endpointId): Promise<string | null>;
```

Defined in: [src/webhook.endpoint-admin.service.ts:100](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.endpoint-admin.service.ts#L100)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`string` \| `null`\>

##### updateEndpoint()

```ts
updateEndpoint(endpointId, dto): Promise<EndpointRecord | null>;
```

Defined in: [src/webhook.endpoint-admin.service.ts:69](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.endpoint-admin.service.ts#L69)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `dto` | [`UpdateEndpointDto`](#updateendpointdto) |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord) \| `null`\>

***

### `abstract` WebhookEvent

Defined in: [src/webhook.event.ts:1](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.event.ts#L1)

#### Constructors

##### Constructor

```ts
new WebhookEvent(): WebhookEvent;
```

###### Returns

[`WebhookEvent`](#abstract-webhookevent)

#### Properties

##### eventType

```ts
readonly static eventType: string;
```

Defined in: [src/webhook.event.ts:2](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.event.ts#L2)

#### Accessors

##### eventType

###### Get Signature

```ts
get eventType(): string;
```

Defined in: [src/webhook.event.ts:4](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.event.ts#L4)

###### Returns

`string`

#### Methods

##### toPayload()

```ts
toPayload(): Record<string, unknown>;
```

Defined in: [src/webhook.event.ts:14](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.event.ts#L14)

###### Returns

`Record`\<`string`, `unknown`\>

***

### WebhookModule

Defined in: [src/webhook.module.ts:139](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.module.ts#L139)

#### Implements

- `OnModuleInit`
- `OnModuleDestroy`

#### Constructors

##### Constructor

```ts
new WebhookModule(
   schedulerRegistry, 
   deliveryWorker, 
   options): WebhookModule;
```

Defined in: [src/webhook.module.ts:140](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.module.ts#L140)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `schedulerRegistry` | `SchedulerRegistry` |
| `deliveryWorker` | `WebhookDeliveryWorker` |
| `options` | [`WebhookModuleOptions`](#webhookmoduleoptions) |

###### Returns

[`WebhookModule`](#webhookmodule)

#### Methods

##### forRoot()

```ts
static forRoot(options): DynamicModule;
```

Defined in: [src/webhook.module.ts:147](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.module.ts#L147)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`WebhookModuleOptions`](#webhookmoduleoptions) |

###### Returns

`DynamicModule`

##### forRootAsync()

```ts
static forRootAsync(asyncOptions): DynamicModule;
```

Defined in: [src/webhook.module.ts:160](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.module.ts#L160)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `asyncOptions` | [`WebhookModuleAsyncOptions`](#webhookmoduleasyncoptions) |

###### Returns

`DynamicModule`

##### onModuleDestroy()

```ts
onModuleDestroy(): void;
```

Defined in: [src/webhook.module.ts:209](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.module.ts#L209)

###### Returns

`void`

###### Implementation of

```ts
OnModuleDestroy.onModuleDestroy
```

##### onModuleInit()

```ts
onModuleInit(): void;
```

Defined in: [src/webhook.module.ts:200](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.module.ts#L200)

###### Returns

`void`

###### Implementation of

```ts
OnModuleInit.onModuleInit
```

***

### WebhookRetentionAdminService

Defined in: [src/webhook.retention-admin.service.ts:17](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.retention-admin.service.ts#L17)

#### Constructors

##### Constructor

```ts
new WebhookRetentionAdminService(deliveryRepo, options): WebhookRetentionAdminService;
```

Defined in: [src/webhook.retention-admin.service.ts:18](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.retention-admin.service.ts#L18)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryRepo` | [`WebhookDeliveryRepository`](#webhookdeliveryrepository) |
| `options` | [`WebhookModuleOptions`](#webhookmoduleoptions) |

###### Returns

[`WebhookRetentionAdminService`](#webhookretentionadminservice)

#### Methods

##### purgeExpiredData()

```ts
purgeExpiredData(now?): Promise<WebhookRetentionPurgeResult>;
```

Defined in: [src/webhook.retention-admin.service.ts:25](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.retention-admin.service.ts#L25)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `now?` | `Date` |

###### Returns

`Promise`\<[`WebhookRetentionPurgeResult`](#webhookretentionpurgeresult)\>

***

### WebhookService

Defined in: [src/webhook.service.ts:22](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.service.ts#L22)

#### Constructors

##### Constructor

```ts
new WebhookService(
   eventRepo, 
   endpointRepo, 
   deliveryRepo, 
   options): WebhookService;
```

Defined in: [src/webhook.service.ts:27](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.service.ts#L27)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventRepo` | [`WebhookEventRepository`](#webhookeventrepository) |
| `endpointRepo` | [`WebhookEndpointRepository`](#webhookendpointrepository) |
| `deliveryRepo` | [`WebhookDeliveryRepository`](#webhookdeliveryrepository) |
| `options` | [`WebhookModuleOptions`](#webhookmoduleoptions) |

###### Returns

[`WebhookService`](#webhookservice)

#### Methods

##### send()

```ts
send(event, options?): Promise<string>;
```

Defined in: [src/webhook.service.ts:41](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.service.ts#L41)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`WebhookEvent`](#abstract-webhookevent) |
| `options?` | [`WebhookPublishOptions`](#webhookpublishoptions) |

###### Returns

`Promise`\<`string`\>

##### sendToEndpoints()

```ts
sendToEndpoints(
   endpointIds, 
   event, 
   tenantIdOrOptions?, 
options?): Promise<string>;
```

Defined in: [src/webhook.service.ts:53](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.service.ts#L53)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointIds` | `string`[] |
| `event` | [`WebhookEvent`](#abstract-webhookevent) |
| `tenantIdOrOptions?` | `string` \| [`WebhookPublishOptions`](#webhookpublishoptions) |
| `options?` | [`WebhookPublishOptions`](#webhookpublishoptions) |

###### Returns

`Promise`\<`string`\>

##### sendToTenant()

```ts
sendToTenant(
   tenantId, 
   event, 
options?): Promise<string>;
```

Defined in: [src/webhook.service.ts:45](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.service.ts#L45)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` |
| `event` | [`WebhookEvent`](#abstract-webhookevent) |
| `options?` | [`WebhookPublishOptions`](#webhookpublishoptions) |

###### Returns

`Promise`\<`string`\>

***

### WebhookSigner

Defined in: [src/webhook.signer.ts:17](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.signer.ts#L17)

#### Constructors

##### Constructor

```ts
new WebhookSigner(): WebhookSigner;
```

###### Returns

[`WebhookSigner`](#webhooksigner)

#### Methods

##### generateSecret()

```ts
generateSecret(): string;
```

Defined in: [src/webhook.signer.ts:95](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.signer.ts#L95)

###### Returns

`string`

##### sign()

```ts
sign(
   eventId, 
   timestamp, 
   body, 
   secret): SignatureHeaders;
```

Defined in: [src/webhook.signer.ts:39](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.signer.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `timestamp` | `number` |
| `body` | `string` |
| `secret` | `string` |

###### Returns

[`SignatureHeaders`](#signatureheaders)

##### signAll()

```ts
signAll(
   eventId, 
   timestamp, 
   body, 
   secrets): SignatureHeaders;
```

Defined in: [src/webhook.signer.ts:18](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.signer.ts#L18)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `timestamp` | `number` |
| `body` | `string` |
| `secrets` | `string`[] |

###### Returns

[`SignatureHeaders`](#signatureheaders)

##### verify()

```ts
verify(
   eventId, 
   timestamp, 
   body, 
   secret, 
   signature): boolean;
```

Defined in: [src/webhook.signer.ts:48](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.signer.ts#L48)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `timestamp` | `number` |
| `body` | `string` |
| `secret` | `string` |
| `signature` | `string` |

###### Returns

`boolean`

##### verifyWithTolerance()

```ts
verifyWithTolerance(
   eventId, 
   timestamp, 
   body, 
   secret, 
   signature, 
   options): boolean;
```

Defined in: [src/webhook.signer.ts:68](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.signer.ts#L68)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `timestamp` | `number` |
| `body` | `string` |
| `secret` | `string` |
| `signature` | `string` |
| `options` | [`WebhookVerificationOptions`](#webhookverificationoptions) |

###### Returns

`boolean`

***

### WebhookUrlValidationError

Defined in: [src/webhook.url-validator.ts:59](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.url-validator.ts#L59)

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new WebhookUrlValidationError(
   message, 
   reason, 
   url?, 
   resolvedIp?): WebhookUrlValidationError;
```

Defined in: [src/webhook.url-validator.ts:65](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.url-validator.ts#L65)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `reason` | [`WebhookUrlValidationReason`](#webhookurlvalidationreason) |
| `url?` | `string` |
| `resolvedIp?` | `string` |

###### Returns

[`WebhookUrlValidationError`](#webhookurlvalidationerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

```ts
Error.cause
```

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

```ts
Error.message
```

##### name

```ts
readonly name: "WebhookUrlValidationError" = 'WebhookUrlValidationError';
```

Defined in: [src/webhook.url-validator.ts:60](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.url-validator.ts#L60)

###### Overrides

```ts
Error.name
```

##### reason

```ts
readonly reason: WebhookUrlValidationReason;
```

Defined in: [src/webhook.url-validator.ts:61](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.url-validator.ts#L61)

##### resolvedIp?

```ts
readonly optional resolvedIp?: string;
```

Defined in: [src/webhook.url-validator.ts:63](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.url-validator.ts#L63)

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

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

##### url?

```ts
readonly optional url?: string;
```

Defined in: [src/webhook.url-validator.ts:62](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.url-validator.ts#L62)

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

### CircuitBreakerOptions

Defined in: [src/interfaces/webhook-options.interface.ts:52](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L52)

#### Properties

##### cooldownMinutes?

```ts
optional cooldownMinutes?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:55](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L55)

##### degradedThreshold?

```ts
optional degradedThreshold?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:54](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L54)

##### failureThreshold?

```ts
optional failureThreshold?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:53](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L53)

***

### ClaimedDelivery

Defined in: [src/ports/webhook-delivery.repository.ts:23](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L23)

A delivery row claimed by the worker but not yet enriched with endpoint/event data.

#### Extended by

- [`PendingDelivery`](#pendingdelivery)

#### Properties

##### attempts

```ts
attempts: number;
```

Defined in: [src/ports/webhook-delivery.repository.ts:27](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L27)

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:26](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L26)

##### eventId

```ts
eventId: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:25](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L25)

##### id

```ts
id: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:24](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L24)

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/ports/webhook-delivery.repository.ts:28](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L28)

***

### CreateEndpointDto

Defined in: [src/interfaces/webhook-endpoint.interface.ts:22](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L22)

#### Properties

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:27](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L27)

##### events

```ts
events: string[];
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:24](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L24)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:29](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L29)

JSON-serializable metadata stored as jsonb. Dates become strings; BigInt is not supported.

##### secret?

```ts
optional secret?: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:26](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L26)

Pass `'auto'` or omit the field to generate a secure base64 signing secret.

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:30](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L30)

##### url

```ts
url: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:23](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L23)

***

### DeliveryAttemptRecord

Defined in: [src/interfaces/webhook-delivery.interface.ts:24](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L24)

#### Properties

##### attemptNumber

```ts
attemptNumber: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:27](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L27)

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:34](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L34)

##### deliveryId

```ts
deliveryId: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:26](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L26)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:25](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L25)

##### lastError

```ts
lastError: string | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:33](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L33)

##### latencyMs

```ts
latencyMs: number | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:32](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L32)

##### responseBody

```ts
responseBody: string | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:30](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L30)

##### responseBodyTruncated

```ts
responseBodyTruncated: boolean;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:31](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L31)

##### responseStatus

```ts
responseStatus: number | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:29](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L29)

##### status

```ts
status: DeliveryAttemptStatus;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:28](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L28)

***

### DeliveryBacklogSummary

Defined in: [src/ports/webhook-delivery.repository.ts:41](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L41)

#### Properties

##### oldestPendingAgeMs

```ts
oldestPendingAgeMs: number | null;
```

Defined in: [src/ports/webhook-delivery.repository.ts:45](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L45)

##### oldestRunnableAgeMs

```ts
oldestRunnableAgeMs: number | null;
```

Defined in: [src/ports/webhook-delivery.repository.ts:46](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L46)

##### pendingCount

```ts
pendingCount: number;
```

Defined in: [src/ports/webhook-delivery.repository.ts:42](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L42)

##### runnablePendingCount

```ts
runnablePendingCount: number;
```

Defined in: [src/ports/webhook-delivery.repository.ts:44](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L44)

##### sendingCount

```ts
sendingCount: number;
```

Defined in: [src/ports/webhook-delivery.repository.ts:43](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L43)

***

### DeliveryFailedContext

Defined in: [src/interfaces/webhook-options.interface.ts:131](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L131)

#### Properties

##### attempts

```ts
attempts: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:137](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L137)

##### deliveryId

```ts
deliveryId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:132](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L132)

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:133](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L133)

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:134](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L134)

##### failureKind?

```ts
optional failureKind?: DeliveryFailureKind;
```

Defined in: [src/interfaces/webhook-options.interface.ts:143](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L143)

High-level classification. Built-in workers set this in v0.8.0+; optional for custom/legacy producers.

##### lastError

```ts
lastError: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:139](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L139)

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:138](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L138)

##### resolvedIp?

```ts
optional resolvedIp?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:149](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L149)

Set only when `failureKind === 'url_validation'` and DNS resolution was involved.

##### responseStatus

```ts
responseStatus: number | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:140](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L140)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:136](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L136)

Null when the endpoint is not scoped to a tenant.

##### validationReason?

```ts
optional validationReason?: WebhookUrlValidationReason;
```

Defined in: [src/interfaces/webhook-options.interface.ts:145](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L145)

Set only when `failureKind === 'url_validation'` — structured reason from `WebhookUrlValidationError`.

##### validationUrl?

```ts
optional validationUrl?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:147](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L147)

Set only when `failureKind === 'url_validation'` — URL that triggered validation failure.

***

### DeliveryLogFilters

Defined in: [src/interfaces/webhook-delivery.interface.ts:53](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L53)

#### Extended by

- [`RetryFailedDeliveriesFilters`](#retryfaileddeliveriesfilters)

#### Properties

##### eventType?

```ts
optional eventType?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:55](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L55)

##### limit?

```ts
optional limit?: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:58](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L58)

##### offset?

```ts
optional offset?: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:59](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L59)

##### since?

```ts
optional since?: Date;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:56](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L56)

##### status?

```ts
optional status?: DeliveryStatus;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:54](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L54)

##### until?

```ts
optional until?: Date;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:57](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L57)

***

### DeliveryOptions

Defined in: [src/interfaces/webhook-options.interface.ts:15](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L15)

#### Properties

##### ~~backoff?~~

```ts
optional backoff?: "exponential";
```

Defined in: [src/interfaces/webhook-options.interface.ts:19](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L19)

###### Deprecated

Retry backoff is currently fixed to the default exponential schedule.

##### jitter?

```ts
optional jitter?: boolean;
```

Defined in: [src/interfaces/webhook-options.interface.ts:20](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L20)

##### maxRetries?

```ts
optional maxRetries?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:17](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L17)

##### timeout?

```ts
optional timeout?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:16](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L16)

***

### DeliveryRecord

Defined in: [src/interfaces/webhook-delivery.interface.ts:4](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L4)

#### Properties

##### attempts

```ts
attempts: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:13](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L13)

##### completedAt

```ts
completedAt: Date | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:17](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L17)

##### destinationUrl

```ts
destinationUrl: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:9](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L9)

Destination URL used for this delivery. Uses the queued snapshot when available.

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:7](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L7)

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:6](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L6)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:5](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L5)

##### lastAttemptAt

```ts
lastAttemptAt: Date | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:16](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L16)

##### lastError

```ts
lastError: string | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:21](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L21)

##### latencyMs

```ts
latencyMs: number | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:20](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L20)

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:14](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L14)

##### nextAttemptAt

```ts
nextAttemptAt: Date | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:15](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L15)

##### responseBody

```ts
responseBody: string | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:19](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L19)

##### responseStatus

```ts
responseStatus: number | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:18](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L18)

##### status

```ts
status: DeliveryStatus;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:12](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L12)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:11](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L11)

Null when the endpoint is global rather than tenant-scoped.

***

### DeliveryResult

Defined in: [src/interfaces/webhook-delivery.interface.ts:45](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L45)

#### Properties

##### body?

```ts
optional body?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:48](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L48)

##### error?

```ts
optional error?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:50](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L50)

##### latencyMs

```ts
latencyMs: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:49](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L49)

##### statusCode?

```ts
optional statusCode?: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:47](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L47)

##### success

```ts
success: boolean;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:46](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L46)

***

### DeliveryRetryScheduledContext

Defined in: [src/interfaces/webhook-options.interface.ts:152](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L152)

#### Properties

##### attempts

```ts
attempts: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:158](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L158)

##### deliveryId

```ts
deliveryId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:153](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L153)

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:154](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L154)

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:155](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L155)

##### failureKind?

```ts
optional failureKind?: DeliveryFailureKind;
```

Defined in: [src/interfaces/webhook-options.interface.ts:165](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L165)

High-level classification for the failed attempt that scheduled the retry.

##### lastError

```ts
lastError: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:161](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L161)

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:159](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L159)

##### nextAttemptAt

```ts
nextAttemptAt: Date;
```

Defined in: [src/interfaces/webhook-options.interface.ts:160](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L160)

##### resolvedIp?

```ts
optional resolvedIp?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:171](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L171)

Set only when `failureKind === 'url_validation'` and DNS resolution was involved.

##### responseStatus

```ts
responseStatus: number | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:162](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L162)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:157](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L157)

Null when the endpoint is not scoped to a tenant.

##### validationReason?

```ts
optional validationReason?: WebhookUrlValidationReason;
```

Defined in: [src/interfaces/webhook-options.interface.ts:167](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L167)

Set only when `failureKind === 'url_validation'` — structured reason from `WebhookUrlValidationError`.

##### validationUrl?

```ts
optional validationUrl?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:169](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L169)

Set only when `failureKind === 'url_validation'` — URL that triggered validation failure.

***

### EndpointDegradedContext

Defined in: [src/interfaces/webhook-options.interface.ts:183](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L183)

#### Properties

##### consecutiveFailures

```ts
consecutiveFailures: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:189](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L189)

##### degradedThreshold

```ts
degradedThreshold: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:190](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L190)

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:184](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L184)

##### failureThreshold

```ts
failureThreshold: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:191](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L191)

##### reason

```ts
reason: "consecutive_failures_degraded";
```

Defined in: [src/interfaces/webhook-options.interface.ts:188](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L188)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:186](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L186)

Null when the endpoint is not scoped to a tenant.

##### url

```ts
url: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:187](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L187)

***

### EndpointDisabledContext

Defined in: [src/interfaces/webhook-options.interface.ts:174](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L174)

#### Properties

##### consecutiveFailures

```ts
consecutiveFailures: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:180](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L180)

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:175](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L175)

##### reason

```ts
reason: "consecutive_failures_exceeded";
```

Defined in: [src/interfaces/webhook-options.interface.ts:179](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L179)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:177](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L177)

Null when the endpoint is not scoped to a tenant.

##### url

```ts
url: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:178](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L178)

***

### EndpointRecord

Defined in: [src/interfaces/webhook-endpoint.interface.ts:1](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L1)

#### Extended by

- [`EndpointRecordWithSecret`](#endpointrecordwithsecret)

#### Properties

##### active

```ts
active: boolean;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:5](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L5)

##### consecutiveFailures

```ts
consecutiveFailures: number;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:9](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L9)

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:13](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L13)

##### description

```ts
description: string | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:6](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L6)

##### disabledAt

```ts
disabledAt: Date | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:10](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L10)

##### disabledReason

```ts
disabledReason: string | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:11](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L11)

##### events

```ts
events: string[];
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:4](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L4)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:2](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L2)

##### metadata

```ts
metadata: Record<string, unknown> | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:7](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L7)

##### previousSecretExpiresAt

```ts
previousSecretExpiresAt: Date | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:12](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L12)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:8](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L8)

##### updatedAt

```ts
updatedAt: Date;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:14](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L14)

##### url

```ts
url: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:3](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L3)

***

### EndpointRecordWithSecret

Defined in: [src/interfaces/webhook-endpoint.interface.ts:18](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L18)

Internal record that includes the signing secret. Only used for endpoint creation response and delivery enrichment.

#### Extends

- [`EndpointRecord`](#endpointrecord)

#### Properties

##### active

```ts
active: boolean;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:5](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L5)

###### Inherited from

[`EndpointRecord`](#endpointrecord).[`active`](#active)

##### consecutiveFailures

```ts
consecutiveFailures: number;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:9](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L9)

###### Inherited from

[`EndpointRecord`](#endpointrecord).[`consecutiveFailures`](#consecutivefailures-2)

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:13](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L13)

###### Inherited from

[`EndpointRecord`](#endpointrecord).[`createdAt`](#createdat-1)

##### description

```ts
description: string | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:6](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L6)

###### Inherited from

[`EndpointRecord`](#endpointrecord).[`description`](#description-1)

##### disabledAt

```ts
disabledAt: Date | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:10](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L10)

###### Inherited from

[`EndpointRecord`](#endpointrecord).[`disabledAt`](#disabledat)

##### disabledReason

```ts
disabledReason: string | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:11](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L11)

###### Inherited from

[`EndpointRecord`](#endpointrecord).[`disabledReason`](#disabledreason)

##### events

```ts
events: string[];
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:4](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L4)

###### Inherited from

[`EndpointRecord`](#endpointrecord).[`events`](#events-1)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:2](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L2)

###### Inherited from

[`EndpointRecord`](#endpointrecord).[`id`](#id-3)

##### metadata

```ts
metadata: Record<string, unknown> | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:7](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L7)

###### Inherited from

[`EndpointRecord`](#endpointrecord).[`metadata`](#metadata-1)

##### previousSecretExpiresAt

```ts
previousSecretExpiresAt: Date | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:12](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L12)

###### Inherited from

[`EndpointRecord`](#endpointrecord).[`previousSecretExpiresAt`](#previoussecretexpiresat)

##### secret

```ts
secret: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:19](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L19)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:8](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L8)

###### Inherited from

[`EndpointRecord`](#endpointrecord).[`tenantId`](#tenantid-6)

##### updatedAt

```ts
updatedAt: Date;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:14](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L14)

###### Inherited from

[`EndpointRecord`](#endpointrecord).[`updatedAt`](#updatedat)

##### url

```ts
url: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:3](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L3)

###### Inherited from

[`EndpointRecord`](#endpointrecord).[`url`](#url-3)

***

### EventRecord

Defined in: [src/interfaces/webhook-delivery.interface.ts:37](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L37)

#### Properties

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:42](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L42)

##### eventType

```ts
eventType: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:39](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L39)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:38](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L38)

##### payload

```ts
payload: Record<string, unknown>;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:40](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L40)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:41](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L41)

***

### PendingDelivery

Defined in: [src/ports/webhook-delivery.repository.ts:32](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L32)

A claimed delivery enriched with endpoint URL, signing secrets, and event payload. Ready to dispatch.

#### Extends

- [`ClaimedDelivery`](#claimeddelivery)

#### Properties

##### additionalSecrets

```ts
additionalSecrets: string[];
```

Defined in: [src/ports/webhook-delivery.repository.ts:36](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L36)

##### attempts

```ts
attempts: number;
```

Defined in: [src/ports/webhook-delivery.repository.ts:27](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L27)

###### Inherited from

[`ClaimedDelivery`](#claimeddelivery).[`attempts`](#attempts)

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:26](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L26)

###### Inherited from

[`ClaimedDelivery`](#claimeddelivery).[`endpointId`](#endpointid)

##### eventId

```ts
eventId: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:25](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L25)

###### Inherited from

[`ClaimedDelivery`](#claimeddelivery).[`eventId`](#eventid)

##### eventType

```ts
eventType: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:37](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L37)

##### id

```ts
id: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:24](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L24)

###### Inherited from

[`ClaimedDelivery`](#claimeddelivery).[`id`](#id)

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/ports/webhook-delivery.repository.ts:28](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L28)

###### Inherited from

[`ClaimedDelivery`](#claimeddelivery).[`maxAttempts`](#maxattempts)

##### payload

```ts
payload: Record<string, unknown>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:38](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L38)

##### secret

```ts
secret: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:35](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L35)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/ports/webhook-delivery.repository.ts:33](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L33)

##### url

```ts
url: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:34](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L34)

***

### PollingOptions

Defined in: [src/interfaces/webhook-options.interface.ts:58](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L58)

#### Properties

##### batchSize?

```ts
optional batchSize?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:62](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L62)

##### drainLoopDelayMs?

```ts
optional drainLoopDelayMs?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:72](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L72)

Optional sleep between continuous drain loops. Default: 0

##### drainWhileBacklogged?

```ts
optional drainWhileBacklogged?: boolean;
```

Defined in: [src/interfaces/webhook-options.interface.ts:68](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L68)

When true, one poll cycle keeps claiming while backlog and capacity remain. Default: false

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/webhook-options.interface.ts:60](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L60)

Set to false to disable the polling loop. Useful for API-only processes where a separate worker handles delivery. Default: true

##### interval?

```ts
optional interval?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:61](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L61)

##### maxConcurrency?

```ts
optional maxConcurrency?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:66](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L66)

Maximum delivery dispatches in flight per worker process. Default: batchSize

##### maxDrainLoopsPerPoll?

```ts
optional maxDrainLoopsPerPoll?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:70](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L70)

Maximum claim/drain loops inside one poll cycle. Default: 1, or 10 when drainWhileBacklogged is true

##### staleSendingMinutes?

```ts
optional staleSendingMinutes?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:64](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L64)

Minutes before a SENDING delivery is considered stale and reset to PENDING. Default: 5

***

### ReplayEventOptions

Defined in: [src/interfaces/webhook-delivery.interface.ts:76](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L76)

#### Properties

##### endpointIds?

```ts
optional endpointIds?: string[];
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:77](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L77)

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:79](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L79)

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:78](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L78)

***

### ReplayEventResult

Defined in: [src/interfaces/webhook-delivery.interface.ts:82](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L82)

#### Properties

##### deliveriesCreated

```ts
deliveriesCreated: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:84](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L84)

##### endpointIds

```ts
endpointIds: string[];
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:85](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L85)

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:83](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L83)

***

### ResolvedCreateEndpointInput

Defined in: [src/ports/webhook-endpoint.repository.ts:9](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L9)

#### Properties

##### description

```ts
description: string | null;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:13](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L13)

##### events

```ts
events: string[];
```

Defined in: [src/ports/webhook-endpoint.repository.ts:12](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L12)

##### metadata

```ts
metadata: Record<string, unknown> | null;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:14](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L14)

##### secret

```ts
secret: string;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:11](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L11)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:15](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L15)

##### url

```ts
url: string;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:10](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L10)

***

### ResolvedRotateEndpointSecretInput

Defined in: [src/ports/webhook-endpoint.repository.ts:18](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L18)

#### Extends

- `Required`\<[`RotateEndpointSecretDto`](#rotateendpointsecretdto)\>

#### Properties

##### previousSecretExpiresAt

```ts
previousSecretExpiresAt: Date;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:46](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L46)

Keep the previous secret valid until this timestamp so queued receivers can overlap during rotation.

###### Inherited from

[`RotateEndpointSecretDto`](#rotateendpointsecretdto).[`previousSecretExpiresAt`](#previoussecretexpiresat-3)

##### secret

```ts
secret: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:44](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L44)

Pass `'auto'` or omit the field to generate a secure base64 signing secret.

###### Inherited from

[`RotateEndpointSecretDto`](#rotateendpointsecretdto).[`secret`](#secret-5)

***

### RetryDeliveryOptions

Defined in: [src/interfaces/webhook-delivery.interface.ts:62](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L62)

#### Properties

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:63](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L63)

***

### RetryFailedDeliveriesFilters

Defined in: [src/interfaces/webhook-delivery.interface.ts:66](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L66)

#### Extends

- [`DeliveryLogFilters`](#deliverylogfilters)

#### Properties

##### endpointId?

```ts
optional endpointId?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:67](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L67)

##### eventType?

```ts
optional eventType?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:55](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L55)

###### Inherited from

[`DeliveryLogFilters`](#deliverylogfilters).[`eventType`](#eventtype)

##### limit?

```ts
optional limit?: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:58](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L58)

###### Inherited from

[`DeliveryLogFilters`](#deliverylogfilters).[`limit`](#limit)

##### offset?

```ts
optional offset?: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:59](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L59)

###### Inherited from

[`DeliveryLogFilters`](#deliverylogfilters).[`offset`](#offset)

##### since?

```ts
optional since?: Date;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:56](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L56)

###### Inherited from

[`DeliveryLogFilters`](#deliverylogfilters).[`since`](#since)

##### status?

```ts
optional status?: DeliveryStatus;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:54](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L54)

###### Inherited from

[`DeliveryLogFilters`](#deliverylogfilters).[`status`](#status-1)

##### until?

```ts
optional until?: Date;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:57](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L57)

###### Inherited from

[`DeliveryLogFilters`](#deliverylogfilters).[`until`](#until)

***

### RetryFailedDeliveriesResult

Defined in: [src/interfaces/webhook-delivery.interface.ts:70](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L70)

#### Properties

##### matched

```ts
matched: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:71](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L71)

##### retried

```ts
retried: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:72](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L72)

##### skipped

```ts
skipped: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:73](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L73)

***

### RotateEndpointSecretDto

Defined in: [src/interfaces/webhook-endpoint.interface.ts:42](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L42)

#### Properties

##### previousSecretExpiresAt

```ts
previousSecretExpiresAt: Date;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:46](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L46)

Keep the previous secret valid until this timestamp so queued receivers can overlap during rotation.

##### secret?

```ts
optional secret?: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:44](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L44)

Pass `'auto'` or omit the field to generate a secure base64 signing secret.

***

### SavedWebhookEvent

Defined in: [src/ports/webhook-event.repository.ts:4](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-event.repository.ts#L4)

#### Properties

##### created

```ts
created: boolean;
```

Defined in: [src/ports/webhook-event.repository.ts:6](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-event.repository.ts#L6)

##### id

```ts
id: string;
```

Defined in: [src/ports/webhook-event.repository.ts:5](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-event.repository.ts#L5)

***

### SignatureHeaders

Defined in: [src/webhook.signer.ts:4](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.signer.ts#L4)

#### Indexable

```ts
[key: string]: string
```

#### Properties

##### webhook-id

```ts
webhook-id: string;
```

Defined in: [src/webhook.signer.ts:6](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.signer.ts#L6)

##### webhook-signature

```ts
webhook-signature: string;
```

Defined in: [src/webhook.signer.ts:8](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.signer.ts#L8)

##### webhook-timestamp

```ts
webhook-timestamp: string;
```

Defined in: [src/webhook.signer.ts:7](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.signer.ts#L7)

***

### UpdateEndpointDto

Defined in: [src/interfaces/webhook-endpoint.interface.ts:33](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L33)

#### Properties

##### active?

```ts
optional active?: boolean;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:39](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L39)

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:36](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L36)

##### events?

```ts
optional events?: string[];
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:35](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L35)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:38](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L38)

JSON-serializable metadata stored as jsonb. Dates become strings; BigInt is not supported.

##### url?

```ts
optional url?: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:34](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-endpoint.interface.ts#L34)

***

### WebhookDeliveryProcessingResult

Defined in: [src/interfaces/webhook-options.interface.ts:97](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L97)

#### Properties

##### attempts

```ts
attempts: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:102](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L102)

##### deliveryId

```ts
deliveryId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:98](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L98)

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:99](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L99)

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:100](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L100)

##### failureKind?

```ts
optional failureKind?: DeliveryFailureKind;
```

Defined in: [src/interfaces/webhook-options.interface.ts:109](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L109)

##### lastError

```ts
lastError: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:106](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L106)

##### latencyMs

```ts
latencyMs: number | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:107](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L107)

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:103](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L103)

##### nextAttemptAt?

```ts
optional nextAttemptAt?: Date;
```

Defined in: [src/interfaces/webhook-options.interface.ts:108](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L108)

##### resolvedIp?

```ts
optional resolvedIp?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:112](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L112)

##### responseStatus

```ts
responseStatus: number | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:105](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L105)

##### status

```ts
status: WebhookDeliveryProcessingStatus;
```

Defined in: [src/interfaces/webhook-options.interface.ts:104](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L104)

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:101](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L101)

##### validationReason?

```ts
optional validationReason?: WebhookUrlValidationReason;
```

Defined in: [src/interfaces/webhook-options.interface.ts:110](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L110)

##### validationUrl?

```ts
optional validationUrl?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:111](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L111)

***

### WebhookDeliveryRepository

Defined in: [src/ports/webhook-delivery.repository.ts:49](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L49)

#### Methods

##### claimPendingDeliveries()

```ts
claimPendingDeliveries(batchSize): Promise<ClaimedDelivery[]>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:65](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L65)

Atomically claims pending rows and returns the minimal delivery identity needed for enrichment.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `batchSize` | `number` |

###### Returns

`Promise`\<[`ClaimedDelivery`](#claimeddelivery)[]\>

##### createDeliveriesInTransaction()

```ts
createDeliveriesInTransaction(
   tx, 
   eventId, 
   endpointIds, 
maxAttempts): Promise<void>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:54](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L54)

Creates queued delivery rows inside the provided transaction.
No-op when endpointIds is empty.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`WebhookTransaction`](#webhooktransaction) |
| `eventId` | `string` |
| `endpointIds` | `string`[] |
| `maxAttempts` | `number` |

###### Returns

`Promise`\<`void`\>

##### createTestDelivery()

```ts
createTestDelivery(eventId, endpointId): Promise<void>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:91](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L91)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `endpointId` | `string` |

###### Returns

`Promise`\<`void`\>

##### enrichDeliveries()

```ts
enrichDeliveries(deliveryIds): Promise<PendingDelivery[]>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:66](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L66)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryIds` | `string`[] |

###### Returns

`Promise`\<[`PendingDelivery`](#pendingdelivery)[]\>

##### getBacklogSummary()?

```ts
optional getBacklogSummary(): Promise<DeliveryBacklogSummary>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:74](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L74)

###### Returns

`Promise`\<[`DeliveryBacklogSummary`](#deliverybacklogsummary)\>

##### getDeliveryAttempts()

```ts
getDeliveryAttempts(deliveryId): Promise<DeliveryAttemptRecord[]>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:77](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L77)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |

###### Returns

`Promise`\<[`DeliveryAttemptRecord`](#deliveryattemptrecord)[]\>

attempts sorted by attemptNumber ASC.

##### getDeliveryLogs()

```ts
getDeliveryLogs(endpointId, filters?): Promise<DeliveryRecord[]>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:75](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L75)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `filters?` | [`DeliveryLogFilters`](#deliverylogfilters) |

###### Returns

`Promise`\<[`DeliveryRecord`](#deliveryrecord)[]\>

##### markFailed()

```ts
markFailed(
   deliveryId, 
   attempts, 
result): Promise<void>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:69](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L69)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `attempts` | `number` |
| `result` | [`DeliveryResult`](#deliveryresult) |

###### Returns

`Promise`\<`void`\>

##### markRetry()

```ts
markRetry(
   deliveryId, 
   attempts, 
   nextAt, 
result): Promise<void>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:70](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L70)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `attempts` | `number` |
| `nextAt` | `Date` |
| `result` | [`DeliveryResult`](#deliveryresult) |

###### Returns

`Promise`\<`void`\>

##### markSent()

```ts
markSent(
   deliveryId, 
   attempts, 
result): Promise<void>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:68](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L68)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `attempts` | `number` |
| `result` | [`DeliveryResult`](#deliveryresult) |

###### Returns

`Promise`\<`void`\>

##### purgeExpiredData()?

```ts
optional purgeExpiredData(options, now?): Promise<WebhookRetentionPurgeResult>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:87](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L87)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`WebhookRetentionOptions`](#webhookretentionoptions) |
| `now?` | `Date` |

###### Returns

`Promise`\<[`WebhookRetentionPurgeResult`](#webhookretentionpurgeresult)\>

##### recoverStaleSending()

```ts
recoverStaleSending(stalenessMinutes): Promise<number>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:73](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L73)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `stalenessMinutes` | `number` |

###### Returns

`Promise`\<`number`\>

number of stale SENDING deliveries recovered or failed.

##### replayEvent()?

```ts
optional replayEvent(eventId, options?): Promise<ReplayEventResult>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:83](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L83)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `options?` | [`ReplayEventOptions`](#replayeventoptions) |

###### Returns

`Promise`\<[`ReplayEventResult`](#replayeventresult)\>

##### retryDelivery()

```ts
retryDelivery(deliveryId, options?): Promise<boolean>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:78](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L78)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `options?` | [`RetryDeliveryOptions`](#retrydeliveryoptions) |

###### Returns

`Promise`\<`boolean`\>

##### retryFailedDeliveries()?

```ts
optional retryFailedDeliveries(filters, options?): Promise<RetryFailedDeliveriesResult>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:79](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L79)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filters` | [`RetryFailedDeliveriesFilters`](#retryfaileddeliveriesfilters) |
| `options?` | [`RetryDeliveryOptions`](#retrydeliveryoptions) |

###### Returns

`Promise`\<[`RetryFailedDeliveriesResult`](#retryfaileddeliveriesresult)\>

##### runInTransaction()

```ts
runInTransaction<T>(fn): Promise<T>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:62](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L62)

Runs the callback in one repository transaction. Pass the tx only to other *InTransaction port methods.

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`tx`) => `Promise`\<`T`\> |

###### Returns

`Promise`\<`T`\>

***

### WebhookEndpointRepository

Defined in: [src/ports/webhook-endpoint.repository.ts:21](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L21)

#### Methods

##### createEndpoint()

```ts
createEndpoint(input): Promise<EndpointRecordWithSecret>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:34](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L34)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ResolvedCreateEndpointInput`](#resolvedcreateendpointinput) |

###### Returns

`Promise`\<[`EndpointRecordWithSecret`](#endpointrecordwithsecret)\>

##### deleteEndpoint()

```ts
deleteEndpoint(id): Promise<boolean>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:47](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L47)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`Promise`\<`boolean`\>

true if a row was deleted, false if the endpoint did not exist.
May reject when existing delivery rows still reference the endpoint.

##### disableEndpoint()

```ts
disableEndpoint(endpointId, reason): Promise<boolean>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:53](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L53)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `reason` | `string` |

###### Returns

`Promise`\<`boolean`\>

true when the endpoint transitioned from active to inactive.

##### findMatchingEndpoints()

```ts
findMatchingEndpoints(eventType, tenantId): Promise<EndpointRecord[]>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:22](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventType` | `string` |
| `tenantId` | `string` \| `undefined` |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord)[]\>

##### findMatchingEndpointsInTransaction()

```ts
findMatchingEndpointsInTransaction(
   tx, 
   eventType, 
tenantId): Promise<EndpointRecord[]>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:28](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L28)

Use only with a transaction object received from WebhookDeliveryRepository.runInTransaction().

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`WebhookTransaction`](#webhooktransaction) |
| `eventType` | `string` |
| `tenantId` | `string` \| `undefined` |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord)[]\>

##### getEndpoint()

```ts
getEndpoint(id): Promise<EndpointRecord | null>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:36](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L36)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord) \| `null`\>

##### incrementFailures()

```ts
incrementFailures(endpointId): Promise<number>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:51](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L51)

Atomically increments consecutive failures and returns the new value.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`number`\>

##### listEndpoints()

```ts
listEndpoints(tenantId?): Promise<EndpointRecord[]>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:37](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId?` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord)[]\>

##### recoverEligibleEndpoints()

```ts
recoverEligibleEndpoints(cooldownMinutes): Promise<number>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:55](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L55)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `cooldownMinutes` | `number` |

###### Returns

`Promise`\<`number`\>

number of endpoints recovered after cooldown.

##### resetFailures()

```ts
resetFailures(endpointId): Promise<void>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:49](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L49)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`void`\>

##### rotateSecret()

```ts
rotateSecret(id, input): Promise<EndpointRecord | null>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:39](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `input` | [`ResolvedRotateEndpointSecretInput`](#resolvedrotateendpointsecretinput) |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord) \| `null`\>

##### updateEndpoint()

```ts
updateEndpoint(id, dto): Promise<EndpointRecord | null>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:38](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-endpoint.repository.ts#L38)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `dto` | [`UpdateEndpointDto`](#updateendpointdto) |

###### Returns

`Promise`\<[`EndpointRecord`](#endpointrecord) \| `null`\>

***

### WebhookEventRepository

Defined in: [src/ports/webhook-event.repository.ts:9](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-event.repository.ts#L9)

#### Methods

##### saveEvent()

```ts
saveEvent(
   eventType, 
   payload, 
tenantId): Promise<string>;
```

Defined in: [src/ports/webhook-event.repository.ts:10](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-event.repository.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventType` | `string` |
| `payload` | `Record`\<`string`, `unknown`\> |
| `tenantId` | `string` \| `null` |

###### Returns

`Promise`\<`string`\>

##### saveEventInTransaction()

```ts
saveEventInTransaction(
   tx, 
   eventType, 
   payload, 
tenantId): Promise<string>;
```

Defined in: [src/ports/webhook-event.repository.ts:17](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-event.repository.ts#L17)

Use only with a transaction object received from WebhookDeliveryRepository.runInTransaction().

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`WebhookTransaction`](#webhooktransaction) |
| `eventType` | `string` |
| `payload` | `Record`\<`string`, `unknown`\> |
| `tenantId` | `string` \| `null` |

###### Returns

`Promise`\<`string`\>

##### saveEventOnceInTransaction()?

```ts
optional saveEventOnceInTransaction(
   tx, 
   eventType, 
   payload, 
   tenantId, 
options): Promise<SavedWebhookEvent>;
```

Defined in: [src/ports/webhook-event.repository.ts:24](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-event.repository.ts#L24)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`WebhookTransaction`](#webhooktransaction) |
| `eventType` | `string` |
| `payload` | `Record`\<`string`, `unknown`\> |
| `tenantId` | `string` \| `null` |
| `options` | `Required`\<`Pick`\<[`WebhookPublishOptions`](#webhookpublishoptions), `"idempotencyKey"`\>\> & `Pick`\<[`WebhookPublishOptions`](#webhookpublishoptions), `"correlationId"`\> |

###### Returns

`Promise`\<[`SavedWebhookEvent`](#savedwebhookevent)\>

***

### WebhookHttpClient

Defined in: [src/ports/webhook-http-client.ts:11](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-http-client.ts#L11)

#### Methods

##### post()

```ts
post(
   url, 
   headers, 
   body, 
   timeout, 
options?): Promise<DeliveryResult>;
```

Defined in: [src/ports/webhook-http-client.ts:16](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-http-client.ts#L16)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | - |
| `headers` | `Record`\<`string`, `string`\> | - |
| `body` | `string` | - |
| `timeout` | `number` | milliseconds before the request is aborted. |
| `options?` | `WebhookHttpClientRequestOptions` | - |

###### Returns

`Promise`\<[`DeliveryResult`](#deliveryresult)\>

DeliveryResult with success false on timeout/network failure; implementations should not throw for HTTP failures.

***

### WebhookModuleAsyncOptions

Defined in: [src/interfaces/webhook-options.interface.ts:235](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L235)

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
optional inject?: (InjectionToken | OptionalFactoryDependency)[];
```

Defined in: [src/interfaces/webhook-options.interface.ts:237](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L237)

##### useClass?

```ts
optional useClass?: Type<WebhookOptionsFactory>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:238](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L238)

##### useExisting?

```ts
optional useExisting?: Type<WebhookOptionsFactory>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:239](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L239)

##### useFactory?

```ts
optional useFactory?: (...args) => 
  | WebhookModuleOptions<unknown>
| Promise<WebhookModuleOptions<unknown>>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:236](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L236)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`WebhookModuleOptions`](#webhookmoduleoptions)\<`unknown`\>
  \| `Promise`\<[`WebhookModuleOptions`](#webhookmoduleoptions)\<`unknown`\>\>

***

### WebhookModuleOptions

Defined in: [src/interfaces/webhook-options.interface.ts:194](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L194)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TPrisma` | `unknown` |

#### Properties

##### allowPrivateUrls?

```ts
optional allowPrivateUrls?: boolean;
```

Defined in: [src/interfaces/webhook-options.interface.ts:203](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L203)

Allow private/internal URLs for endpoints. Only enable in development/testing. Default: false

##### circuitBreaker?

```ts
optional circuitBreaker?: CircuitBreakerOptions;
```

Defined in: [src/interfaces/webhook-options.interface.ts:198](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L198)

##### delivery?

```ts
optional delivery?: DeliveryOptions;
```

Defined in: [src/interfaces/webhook-options.interface.ts:197](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L197)

##### deliveryRepository?

```ts
optional deliveryRepository?: WebhookDeliveryRepository;
```

Defined in: [src/interfaces/webhook-options.interface.ts:207](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L207)

##### endpointRepository?

```ts
optional endpointRepository?: WebhookEndpointRepository;
```

Defined in: [src/interfaces/webhook-options.interface.ts:206](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L206)

##### eventRepository?

```ts
optional eventRepository?: WebhookEventRepository;
```

Defined in: [src/interfaces/webhook-options.interface.ts:205](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L205)

Custom port overrides — provide these to replace default Prisma/fetch adapters.

##### httpClient?

```ts
optional httpClient?: WebhookHttpClient;
```

Defined in: [src/interfaces/webhook-options.interface.ts:208](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L208)

##### onDeliveryFailed?

```ts
optional onDeliveryFailed?: (context) => void | Promise<void>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:217](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L217)

Called when a delivery exhausts retry attempts or receives a non-retryable response. Fire-and-forget — errors are logged, not propagated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`DeliveryFailedContext`](#deliveryfailedcontext) |

###### Returns

`void` \| `Promise`\<`void`\>

##### onDeliveryRetryScheduled?

```ts
optional onDeliveryRetryScheduled?: (context) => void | Promise<void>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:220](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L220)

Called after a retriable failed attempt is persisted with a next attempt time. Fire-and-forget — errors are logged, not propagated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`DeliveryRetryScheduledContext`](#deliveryretryscheduledcontext) |

###### Returns

`void` \| `Promise`\<`void`\>

##### onEndpointDegraded?

```ts
optional onEndpointDegraded?: (context) => void | Promise<void>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:225](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L225)

Called when consecutive failures reach the configured degraded threshold before endpoint disablement. Fire-and-forget — errors are logged, not propagated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`EndpointDegradedContext`](#endpointdegradedcontext) |

###### Returns

`void` \| `Promise`\<`void`\>

##### onEndpointDisabled?

```ts
optional onEndpointDisabled?: (context) => void | Promise<void>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:228](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L228)

Called when the circuit breaker disables an endpoint. Fire-and-forget — errors are logged, not propagated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`EndpointDisabledContext`](#endpointdisabledcontext) |

###### Returns

`void` \| `Promise`\<`void`\>

##### polling?

```ts
optional polling?: PollingOptions;
```

Defined in: [src/interfaces/webhook-options.interface.ts:199](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L199)

##### prisma?

```ts
optional prisma?: TPrisma;
```

Defined in: [src/interfaces/webhook-options.interface.ts:196](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L196)

PrismaClient instance — used by default Prisma adapters. Not needed if all custom repositories are provided.

##### redaction?

```ts
optional redaction?: WebhookRedactionOptions;
```

Defined in: [src/interfaces/webhook-options.interface.ts:214](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L214)

Optional minimization hooks applied before webhook data is persisted.

##### retention?

```ts
optional retention?: WebhookRetentionOptions;
```

Defined in: [src/interfaces/webhook-options.interface.ts:212](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L212)

Optional retention purge policy. Disabled when omitted.

##### secretVault?

```ts
optional secretVault?: WebhookSecretVault;
```

Defined in: [src/interfaces/webhook-options.interface.ts:210](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L210)

Custom secret vault for encrypting/decrypting endpoint signing secrets at rest. Default: PlaintextSecretVault (no-op).

##### workerObserver?

```ts
optional workerObserver?: WebhookWorkerObserver;
```

Defined in: [src/interfaces/webhook-options.interface.ts:201](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L201)

Best-effort worker lifecycle and delivery metrics observer. Observer errors are logged and ignored.

***

### WebhookOptionsFactory

Defined in: [src/interfaces/webhook-options.interface.ts:231](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L231)

#### Methods

##### createWebhookOptions()

```ts
createWebhookOptions(): 
  | WebhookModuleOptions<unknown>
| Promise<WebhookModuleOptions<unknown>>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:232](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L232)

###### Returns

  \| [`WebhookModuleOptions`](#webhookmoduleoptions)\<`unknown`\>
  \| `Promise`\<[`WebhookModuleOptions`](#webhookmoduleoptions)\<`unknown`\>\>

***

### WebhookPollContext

Defined in: [src/interfaces/webhook-options.interface.ts:75](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L75)

#### Properties

##### activeDeliveries

```ts
activeDeliveries: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:81](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L81)

##### batchSize

```ts
batchSize: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:76](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L76)

##### drainLoopDelayMs

```ts
drainLoopDelayMs: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:80](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L80)

##### drainWhileBacklogged

```ts
drainWhileBacklogged: boolean;
```

Defined in: [src/interfaces/webhook-options.interface.ts:78](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L78)

##### maxConcurrency

```ts
maxConcurrency: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:77](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L77)

##### maxDrainLoopsPerPoll

```ts
maxDrainLoopsPerPoll: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:79](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L79)

***

### WebhookPollResult

Defined in: [src/interfaces/webhook-options.interface.ts:84](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L84)

#### Properties

##### claimed

```ts
claimed: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:85](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L85)

##### durationMs

```ts
durationMs: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:91](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L91)

##### enriched

```ts
enriched: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:86](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L86)

##### failed

```ts
failed: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:88](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L88)

##### loops

```ts
loops: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:92](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L92)

##### recoveredStale

```ts
recoveredStale: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:90](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L90)

##### retried

```ts
retried: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:89](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L89)

##### sent

```ts
sent: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:87](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L87)

***

### WebhookPublishOptions

Defined in: [src/interfaces/webhook-options.interface.ts:23](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L23)

#### Properties

##### correlationId?

```ts
optional correlationId?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:27](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L27)

Optional caller correlation ID stored with the event for diagnostics.

##### idempotencyKey?

```ts
optional idempotencyKey?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:25](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L25)

Application-provided key used to deduplicate publish attempts.

***

### WebhookRedactionOptions

Defined in: [src/interfaces/webhook-options.interface.ts:36](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L36)

#### Properties

##### sanitizePayload?

```ts
optional sanitizePayload?: (payload, context) => Record<string, unknown>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:37](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `payload` | `Record`\<`string`, `unknown`\> |
| `context` | \{ `eventType`: `string`; `tenantId`: `string` \| `null`; \} |
| `context.eventType` | `string` |
| `context.tenantId` | `string` \| `null` |

###### Returns

`Record`\<`string`, `unknown`\>

##### sanitizeResponseBody?

```ts
optional sanitizeResponseBody?: (body, context) => string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:41](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L41)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `body` | `string` |
| `context` | \{ `deliveryId`: `string`; `endpointId`: `string` \| `null`; `eventId`: `string` \| `null`; `statusCode`: `number` \| `null`; \} |
| `context.deliveryId` | `string` |
| `context.endpointId` | `string` \| `null` |
| `context.eventId` | `string` \| `null` |
| `context.statusCode` | `number` \| `null` |

###### Returns

`string` \| `null`

***

### WebhookRetentionOptions

Defined in: [src/interfaces/webhook-options.interface.ts:30](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L30)

#### Properties

##### attemptResponseBodyRetentionDays?

```ts
optional attemptResponseBodyRetentionDays?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:33](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L33)

##### deliveryResponseBodyRetentionDays?

```ts
optional deliveryResponseBodyRetentionDays?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:32](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L32)

##### eventPayloadRetentionDays?

```ts
optional eventPayloadRetentionDays?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:31](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L31)

***

### WebhookRetentionPurgeResult

Defined in: [src/interfaces/webhook-delivery.interface.ts:88](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L88)

#### Properties

##### attemptsPurged

```ts
attemptsPurged: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:91](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L91)

##### deliveriesPurged

```ts
deliveriesPurged: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:90](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L90)

##### eventsPurged

```ts
eventsPurged: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:89](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L89)

***

### WebhookSecretVault

Defined in: [src/ports/webhook-secret-vault.ts:7](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-secret-vault.ts#L7)

Port for encrypting/decrypting endpoint signing secrets at rest.
Implement this interface to provide custom encryption (e.g. AES-256-GCM).
The default PlaintextSecretVault passes values through unchanged.
Throws are propagated to callers; implementations should retry transient KMS/network failures internally.

#### Methods

##### decrypt()

```ts
decrypt(encryptedSecret): Promise<string>;
```

Defined in: [src/ports/webhook-secret-vault.ts:9](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-secret-vault.ts#L9)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `encryptedSecret` | `string` |

###### Returns

`Promise`\<`string`\>

##### encrypt()

```ts
encrypt(plainSecret): Promise<string>;
```

Defined in: [src/ports/webhook-secret-vault.ts:8](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-secret-vault.ts#L8)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `plainSecret` | `string` |

###### Returns

`Promise`\<`string`\>

***

### WebhookVerificationOptions

Defined in: [src/webhook.signer.ts:11](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.signer.ts#L11)

#### Properties

##### now?

```ts
optional now?: Date;
```

Defined in: [src/webhook.signer.ts:13](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.signer.ts#L13)

##### toleranceSeconds

```ts
toleranceSeconds: number;
```

Defined in: [src/webhook.signer.ts:12](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.signer.ts#L12)

***

### WebhookWorkerObserver

Defined in: [src/interfaces/webhook-options.interface.ts:115](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L115)

#### Methods

##### onDeliveryComplete()?

```ts
optional onDeliveryComplete(result): void;
```

Defined in: [src/interfaces/webhook-options.interface.ts:118](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L118)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `result` | [`WebhookDeliveryProcessingResult`](#webhookdeliveryprocessingresult) |

###### Returns

`void`

##### onPollComplete()?

```ts
optional onPollComplete(result): void;
```

Defined in: [src/interfaces/webhook-options.interface.ts:117](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L117)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `result` | [`WebhookPollResult`](#webhookpollresult) |

###### Returns

`void`

##### onPollError()?

```ts
optional onPollError(error): void;
```

Defined in: [src/interfaces/webhook-options.interface.ts:119](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L119)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`void`

##### onPollStart()?

```ts
optional onPollStart(context): void;
```

Defined in: [src/interfaces/webhook-options.interface.ts:116](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L116)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`WebhookPollContext`](#webhookpollcontext) |

###### Returns

`void`

## Type Aliases

### DeliveryAttemptStatus

```ts
type DeliveryAttemptStatus = Exclude<DeliveryStatus, "SENDING">;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:2](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L2)

***

### DeliveryFailureKind

```ts
type DeliveryFailureKind = "url_validation" | "dispatch_error" | "http_error";
```

Defined in: [src/interfaces/webhook-options.interface.ts:129](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L129)

Category of failure that caused the delivery to stop after retry exhaustion
or after a non-retryable receiver response.
- `url_validation`: SSRF defense rejected the URL (private/loopback/link-local/etc.)
- `dispatch_error`: dispatcher threw an exception (timeout, ECONNREFUSED, etc.)
- `http_error`: endpoint responded with a non-2xx status code

***

### DeliveryStatus

```ts
type DeliveryStatus = "PENDING" | "SENDING" | "SENT" | "FAILED";
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:1](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-delivery.interface.ts#L1)

***

### EndpointDisabledReason

```ts
type EndpointDisabledReason = typeof ENDPOINT_DISABLED_REASON_CONSECUTIVE_FAILURES_EXCEEDED;
```

Defined in: [src/webhook.constants.ts:28](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L28)

***

### WebhookDeliveryProcessingStatus

```ts
type WebhookDeliveryProcessingStatus = "sent" | "failed" | "retried";
```

Defined in: [src/interfaces/webhook-options.interface.ts:95](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/interfaces/webhook-options.interface.ts#L95)

***

### WebhookTransaction

```ts
type WebhookTransaction = {
  [webhookTransactionBrand]: "WebhookTransaction";
};
```

Defined in: [src/ports/webhook-delivery.repository.ts:18](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L18)

Opaque transaction token created by repository adapters.

#### Properties

##### \[webhookTransactionBrand\]

```ts
readonly [webhookTransactionBrand]: "WebhookTransaction";
```

Defined in: [src/ports/webhook-delivery.repository.ts:19](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/ports/webhook-delivery.repository.ts#L19)

***

### WebhookUrlValidationReason

```ts
type WebhookUrlValidationReason = 
  | "parse"
  | "scheme"
  | "blocked_hostname"
  | "loopback"
  | "private"
  | "link_local"
  | "invalid_target";
```

Defined in: [src/webhook.url-validator.ts:18](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.url-validator.ts#L18)

## Variables

### DEFAULT\_BACKOFF\_SCHEDULE

```ts
const DEFAULT_BACKOFF_SCHEDULE: readonly [30, 300, 1800, 7200, 86400];
```

Defined in: [src/webhook.constants.ts:12](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L12)

Svix/Stripe-style exponential backoff schedule (seconds)

***

### DEFAULT\_CIRCUIT\_BREAKER\_COOLDOWN\_MINUTES

```ts
const DEFAULT_CIRCUIT_BREAKER_COOLDOWN_MINUTES: 60 = 60;
```

Defined in: [src/webhook.constants.ts:25](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L25)

***

### DEFAULT\_CIRCUIT\_BREAKER\_THRESHOLD

```ts
const DEFAULT_CIRCUIT_BREAKER_THRESHOLD: 5 = 5;
```

Defined in: [src/webhook.constants.ts:24](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L24)

***

### DEFAULT\_DELIVERY\_TIMEOUT

```ts
const DEFAULT_DELIVERY_TIMEOUT: 10000 = 10_000;
```

Defined in: [src/webhook.constants.ts:20](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L20)

***

### DEFAULT\_MAX\_RETRIES

```ts
const DEFAULT_MAX_RETRIES: 5 = 5;
```

Defined in: [src/webhook.constants.ts:21](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L21)

***

### DEFAULT\_POLLING\_BATCH\_SIZE

```ts
const DEFAULT_POLLING_BATCH_SIZE: 50 = 50;
```

Defined in: [src/webhook.constants.ts:32](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L32)

***

### DEFAULT\_POLLING\_INTERVAL

```ts
const DEFAULT_POLLING_INTERVAL: 5000 = 5_000;
```

Defined in: [src/webhook.constants.ts:31](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L31)

***

### DEFAULT\_STALE\_SENDING\_MINUTES

```ts
const DEFAULT_STALE_SENDING_MINUTES: 5 = 5;
```

Defined in: [src/webhook.constants.ts:33](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L33)

***

### ENDPOINT\_DISABLED\_REASON\_CONSECUTIVE\_FAILURES\_EXCEEDED

```ts
const ENDPOINT_DISABLED_REASON_CONSECUTIVE_FAILURES_EXCEEDED: "consecutive_failures_exceeded";
```

Defined in: [src/webhook.constants.ts:26](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L26)

***

### WEBHOOK\_DELIVERY\_REPOSITORY

```ts
const WEBHOOK_DELIVERY_REPOSITORY: "WEBHOOK_DELIVERY_REPOSITORY" = 'WEBHOOK_DELIVERY_REPOSITORY';
```

Defined in: [src/webhook.constants.ts:5](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L5)

***

### WEBHOOK\_ENDPOINT\_REPOSITORY

```ts
const WEBHOOK_ENDPOINT_REPOSITORY: "WEBHOOK_ENDPOINT_REPOSITORY" = 'WEBHOOK_ENDPOINT_REPOSITORY';
```

Defined in: [src/webhook.constants.ts:4](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L4)

***

### WEBHOOK\_EVENT\_REPOSITORY

```ts
const WEBHOOK_EVENT_REPOSITORY: "WEBHOOK_EVENT_REPOSITORY" = 'WEBHOOK_EVENT_REPOSITORY';
```

Defined in: [src/webhook.constants.ts:3](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L3)

***

### WEBHOOK\_HTTP\_CLIENT

```ts
const WEBHOOK_HTTP_CLIENT: "WEBHOOK_HTTP_CLIENT" = 'WEBHOOK_HTTP_CLIENT';
```

Defined in: [src/webhook.constants.ts:6](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L6)

***

### WEBHOOK\_MODULE\_OPTIONS

```ts
const WEBHOOK_MODULE_OPTIONS: "WEBHOOK_MODULE_OPTIONS" = 'WEBHOOK_MODULE_OPTIONS';
```

Defined in: [src/webhook.constants.ts:1](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L1)

***

### WEBHOOK\_SECRET\_VAULT

```ts
const WEBHOOK_SECRET_VAULT: "WEBHOOK_SECRET_VAULT" = 'WEBHOOK_SECRET_VAULT';
```

Defined in: [src/webhook.constants.ts:7](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.constants.ts#L7)

## Functions

### resolveAndValidateHost()

```ts
function resolveAndValidateHost(hostname, url?): Promise<string[]>;
```

Defined in: [src/webhook.url-validator.ts:166](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.url-validator.ts#L166)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `hostname` | `string` |
| `url?` | `string` |

#### Returns

`Promise`\<`string`[]\>

***

### validateWebhookUrl()

```ts
function validateWebhookUrl(url): Promise<void>;
```

Defined in: [src/webhook.url-validator.ts:79](https://github.com/nestarc/webhook/blob/683f53e14826884e134f96dacc9e4fa6b3a46321/src/webhook.url-validator.ts#L79)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |

#### Returns

`Promise`\<`void`\>
