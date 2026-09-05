# @nestarc/webhook

## Classes

<a id="api-fetchhttpclient"></a>

### FetchHttpClient

Defined in: [src/adapters/fetch-http-client.ts:21](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/fetch-http-client.ts#L21)

#### Implements

- [`WebhookHttpClient`](#api-webhookhttpclient)

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new FetchHttpClient(): FetchHttpClient;
```

###### Returns

[`FetchHttpClient`](#api-fetchhttpclient)

#### Methods

<a id="api-post"></a>

##### post()

```ts
post(
   url,
   headers,
   body,
   timeout,
options?): Promise<DeliveryResult>;
```

Defined in: [src/adapters/fetch-http-client.ts:22](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/fetch-http-client.ts#L22)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | - |
| `headers` | `Record`\<`string`, `string`\> | - |
| `body` | `string` | - |
| `timeout` | `number` | milliseconds before the request is aborted. |
| `options?` | `WebhookHttpClientRequestOptions` | - |

###### Returns

`Promise`\<[`DeliveryResult`](#api-deliveryresult)\>

DeliveryResult with success false on timeout/network failure; implementations should not throw for HTTP failures.

###### Implementation of

[`WebhookHttpClient`](#api-webhookhttpclient).[`post`](#api-post-1)

***

<a id="api-plaintextsecretvault"></a>

### PlaintextSecretVault

Defined in: [src/adapters/plaintext-secret-vault.ts:9](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/plaintext-secret-vault.ts#L9)

Default no-op vault — secrets are stored and retrieved as-is.
Replace with a real implementation (e.g. AES-256-GCM) for production.

#### Implements

- [`WebhookSecretVault`](#api-webhooksecretvault)

#### Constructors

<a id="api-constructor-1"></a>

##### Constructor

```ts
new PlaintextSecretVault(): PlaintextSecretVault;
```

###### Returns

[`PlaintextSecretVault`](#api-plaintextsecretvault)

#### Methods

<a id="api-decrypt"></a>

##### decrypt()

```ts
decrypt(secret): Promise<string>;
```

Defined in: [src/adapters/plaintext-secret-vault.ts:14](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/plaintext-secret-vault.ts#L14)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `secret` | `string` |

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`WebhookSecretVault`](#api-webhooksecretvault).[`decrypt`](#api-decrypt-1)

<a id="api-encrypt"></a>

##### encrypt()

```ts
encrypt(secret): Promise<string>;
```

Defined in: [src/adapters/plaintext-secret-vault.ts:10](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/plaintext-secret-vault.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `secret` | `string` |

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`WebhookSecretVault`](#api-webhooksecretvault).[`encrypt`](#api-encrypt-1)

***

<a id="api-prismadeliveryrepository"></a>

### PrismaDeliveryRepository

Defined in: [src/adapters/prisma-delivery.repository.ts:100](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L100)

#### Implements

- [`WebhookDeliveryRepository`](#api-webhookdeliveryrepository)

#### Constructors

<a id="api-constructor-2"></a>

##### Constructor

```ts
new PrismaDeliveryRepository(
   prisma,
   vault?,
   redaction?): PrismaDeliveryRepository;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:101](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L101)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `prisma` | `any` |
| `vault?` | [`WebhookSecretVault`](#api-webhooksecretvault) |
| `redaction?` | [`WebhookRedactionOptions`](#api-webhookredactionoptions) |

###### Returns

[`PrismaDeliveryRepository`](#api-prismadeliveryrepository)

#### Methods

<a id="api-claimpendingdeliveries"></a>

##### claimPendingDeliveries()

```ts
claimPendingDeliveries(batchSize): Promise<ClaimedDelivery[]>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:157](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L157)

Atomically claims pending rows and returns the minimal delivery identity needed for enrichment.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `batchSize` | `number` |

###### Returns

`Promise`\<[`ClaimedDelivery`](#api-claimeddelivery)[]\>

###### Implementation of

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`claimPendingDeliveries`](#api-claimpendingdeliveries-1)

<a id="api-createdeliveriesintransaction"></a>

##### createDeliveriesInTransaction()

```ts
createDeliveriesInTransaction(
   tx,
   eventId,
   endpointIds,
maxAttempts): Promise<void>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:107](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L107)

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

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`createDeliveriesInTransaction`](#api-createdeliveriesintransaction-1)

<a id="api-createtestdelivery"></a>

##### createTestDelivery()

```ts
createTestDelivery(eventId, endpointId): Promise<void>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:713](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L713)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `endpointId` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`createTestDelivery`](#api-createtestdelivery-1)

<a id="api-enrichdeliveries"></a>

##### enrichDeliveries()

```ts
enrichDeliveries(deliveryIds): Promise<PendingDelivery[]>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:178](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L178)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryIds` | `string`[] |

###### Returns

`Promise`\<[`PendingDelivery`](#api-pendingdelivery)[]\>

###### Implementation of

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`enrichDeliveries`](#api-enrichdeliveries-1)

<a id="api-getbacklogsummary"></a>

##### getBacklogSummary()

```ts
getBacklogSummary(): Promise<DeliveryBacklogSummary>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:334](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L334)

###### Returns

`Promise`\<[`DeliveryBacklogSummary`](#api-deliverybacklogsummary)\>

###### Implementation of

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`getBacklogSummary`](#api-getbacklogsummary-1)

<a id="api-getdeliveryattempts"></a>

##### getDeliveryAttempts()

```ts
getDeliveryAttempts(deliveryId): Promise<DeliveryAttemptRecord[]>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:460](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L460)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |

###### Returns

`Promise`\<[`DeliveryAttemptRecord`](#api-deliveryattemptrecord)[]\>

attempts sorted by attemptNumber ASC.

###### Implementation of

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`getDeliveryAttempts`](#api-getdeliveryattempts-3)

<a id="api-getdeliverylogs"></a>

##### getDeliveryLogs()

```ts
getDeliveryLogs(endpointId, filters?): Promise<DeliveryRecord[]>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:406](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L406)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `filters?` | [`DeliveryLogFilters`](#api-deliverylogfilters) |

###### Returns

`Promise`\<[`DeliveryRecord`](#api-deliveryrecord)[]\>

###### Implementation of

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`getDeliveryLogs`](#api-getdeliverylogs-3)

<a id="api-markfailed"></a>

##### markFailed()

```ts
markFailed(
   deliveryId,
   attempts,
result): Promise<void>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:237](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L237)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `attempts` | `number` |
| `result` | [`DeliveryResult`](#api-deliveryresult) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`markFailed`](#api-markfailed-1)

<a id="api-markretry"></a>

##### markRetry()

```ts
markRetry(
   deliveryId,
   attempts,
   nextAt,
result): Promise<void>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:254](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L254)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `attempts` | `number` |
| `nextAt` | `Date` |
| `result` | [`DeliveryResult`](#api-deliveryresult) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`markRetry`](#api-markretry-1)

<a id="api-marksent"></a>

##### markSent()

```ts
markSent(
   deliveryId,
   attempts,
result): Promise<void>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:222](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L222)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `attempts` | `number` |
| `result` | [`DeliveryResult`](#api-deliveryresult) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`markSent`](#api-marksent-1)

<a id="api-purgeexpireddata"></a>

##### purgeExpiredData()

```ts
purgeExpiredData(options, now?): Promise<WebhookRetentionPurgeResult>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:643](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L643)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`WebhookRetentionOptions`](#api-webhookretentionoptions) |
| `now` | `Date` |

###### Returns

`Promise`\<[`WebhookRetentionPurgeResult`](#api-webhookretentionpurgeresult)\>

###### Implementation of

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`purgeExpiredData`](#api-purgeexpireddata-1)

<a id="api-recoverstalesending"></a>

##### recoverStaleSending()

```ts
recoverStaleSending(stalenessMinutes): Promise<number>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:275](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L275)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `stalenessMinutes` | `number` |

###### Returns

`Promise`\<`number`\>

number of stale SENDING deliveries recovered or failed.

###### Implementation of

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`recoverStaleSending`](#api-recoverstalesending-1)

<a id="api-replayevent"></a>

##### replayEvent()

```ts
replayEvent(eventId, options?): Promise<ReplayEventResult>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:562](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L562)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `options?` | [`ReplayEventOptions`](#api-replayeventoptions) |

###### Returns

`Promise`\<[`ReplayEventResult`](#api-replayeventresult)\>

###### Implementation of

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`replayEvent`](#api-replayevent-3)

<a id="api-retrydelivery"></a>

##### retryDelivery()

```ts
retryDelivery(deliveryId, _options?): Promise<boolean>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:478](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L478)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `_options?` | [`RetryDeliveryOptions`](#api-retrydeliveryoptions) |

###### Returns

`Promise`\<`boolean`\>

###### Implementation of

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`retryDelivery`](#api-retrydelivery-3)

<a id="api-retryfaileddeliveries"></a>

##### retryFailedDeliveries()

```ts
retryFailedDeliveries(filters, _options?): Promise<RetryFailedDeliveriesResult>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:491](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L491)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filters` | [`RetryFailedDeliveriesFilters`](#api-retryfaileddeliveriesfilters) |
| `_options?` | [`RetryDeliveryOptions`](#api-retrydeliveryoptions) |

###### Returns

`Promise`\<[`RetryFailedDeliveriesResult`](#api-retryfaileddeliveriesresult)\>

###### Implementation of

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`retryFailedDeliveries`](#api-retryfaileddeliveries-3)

<a id="api-runintransaction"></a>

##### runInTransaction()

```ts
runInTransaction<T>(fn): Promise<T>;
```

Defined in: [src/adapters/prisma-delivery.repository.ts:153](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-delivery.repository.ts#L153)

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

[`WebhookDeliveryRepository`](#api-webhookdeliveryrepository).[`runInTransaction`](#api-runintransaction-1)

***

<a id="api-prismaendpointrepository"></a>

### PrismaEndpointRepository

Defined in: [src/adapters/prisma-endpoint.repository.ts:38](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-endpoint.repository.ts#L38)

#### Implements

- [`WebhookEndpointRepository`](#api-webhookendpointrepository)

#### Constructors

<a id="api-constructor-3"></a>

##### Constructor

```ts
new PrismaEndpointRepository(prisma, vault?): PrismaEndpointRepository;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:39](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-endpoint.repository.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `prisma` | `any` |
| `vault?` | [`WebhookSecretVault`](#api-webhooksecretvault) |

###### Returns

[`PrismaEndpointRepository`](#api-prismaendpointrepository)

#### Methods

<a id="api-createendpoint"></a>

##### createEndpoint()

```ts
createEndpoint(input): Promise<EndpointRecordWithSecret>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:91](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-endpoint.repository.ts#L91)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ResolvedCreateEndpointInput`](#api-resolvedcreateendpointinput) |

###### Returns

`Promise`\<[`EndpointRecordWithSecret`](#api-endpointrecordwithsecret)\>

###### Implementation of

[`WebhookEndpointRepository`](#api-webhookendpointrepository).[`createEndpoint`](#api-createendpoint-3)

<a id="api-deleteendpoint"></a>

##### deleteEndpoint()

```ts
deleteEndpoint(id): Promise<boolean>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:197](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-endpoint.repository.ts#L197)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`Promise`\<`boolean`\>

true if a row was deleted, false if the endpoint did not exist.
May reject when existing delivery rows still reference the endpoint.

###### Implementation of

[`WebhookEndpointRepository`](#api-webhookendpointrepository).[`deleteEndpoint`](#api-deleteendpoint-3)

<a id="api-disableendpoint"></a>

##### disableEndpoint()

```ts
disableEndpoint(endpointId, reason): Promise<boolean>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:239](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-endpoint.repository.ts#L239)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `reason` | `string` |

###### Returns

`Promise`\<`boolean`\>

true when the endpoint transitioned from active to inactive.

###### Implementation of

[`WebhookEndpointRepository`](#api-webhookendpointrepository).[`disableEndpoint`](#api-disableendpoint-1)

<a id="api-findmatchingendpoints"></a>

##### findMatchingEndpoints()

```ts
findMatchingEndpoints(eventType, tenantId): Promise<EndpointRecord[]>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:44](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-endpoint.repository.ts#L44)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventType` | `string` |
| `tenantId` | `string` \| `undefined` |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord)[]\>

###### Implementation of

[`WebhookEndpointRepository`](#api-webhookendpointrepository).[`findMatchingEndpoints`](#api-findmatchingendpoints-1)

<a id="api-findmatchingendpointsintransaction"></a>

##### findMatchingEndpointsInTransaction()

```ts
findMatchingEndpointsInTransaction(
   tx,
   eventType,
tenantId): Promise<EndpointRecord[]>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:67](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-endpoint.repository.ts#L67)

Use only with a transaction object received from WebhookDeliveryRepository.runInTransaction().

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | `any` |
| `eventType` | `string` |
| `tenantId` | `string` \| `undefined` |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord)[]\>

###### Implementation of

[`WebhookEndpointRepository`](#api-webhookendpointrepository).[`findMatchingEndpointsInTransaction`](#api-findmatchingendpointsintransaction-1)

<a id="api-getendpoint"></a>

##### getEndpoint()

```ts
getEndpoint(id): Promise<EndpointRecord | null>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:111](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-endpoint.repository.ts#L111)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord) \| `null`\>

###### Implementation of

[`WebhookEndpointRepository`](#api-webhookendpointrepository).[`getEndpoint`](#api-getendpoint-3)

<a id="api-incrementfailures"></a>

##### incrementFailures()

```ts
incrementFailures(endpointId): Promise<number>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:230](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-endpoint.repository.ts#L230)

Atomically increments consecutive failures and returns the new value.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`number`\>

###### Implementation of

[`WebhookEndpointRepository`](#api-webhookendpointrepository).[`incrementFailures`](#api-incrementfailures-1)

<a id="api-listendpoints"></a>

##### listEndpoints()

```ts
listEndpoints(tenantId?): Promise<EndpointRecord[]>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:119](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-endpoint.repository.ts#L119)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId?` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord)[]\>

###### Implementation of

[`WebhookEndpointRepository`](#api-webhookendpointrepository).[`listEndpoints`](#api-listendpoints-3)

<a id="api-recovereligibleendpoints"></a>

##### recoverEligibleEndpoints()

```ts
recoverEligibleEndpoints(cooldownMinutes): Promise<number>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:247](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-endpoint.repository.ts#L247)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `cooldownMinutes` | `number` |

###### Returns

`Promise`\<`number`\>

number of endpoints recovered after cooldown.

###### Implementation of

[`WebhookEndpointRepository`](#api-webhookendpointrepository).[`recoverEligibleEndpoints`](#api-recovereligibleendpoints-1)

<a id="api-resetfailures"></a>

##### resetFailures()

```ts
resetFailures(endpointId): Promise<void>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:203](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-endpoint.repository.ts#L203)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`WebhookEndpointRepository`](#api-webhookendpointrepository).[`resetFailures`](#api-resetfailures-1)

<a id="api-rotatesecret"></a>

##### rotateSecret()

```ts
rotateSecret(id, input): Promise<EndpointRecord | null>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:174](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-endpoint.repository.ts#L174)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `input` | [`ResolvedRotateEndpointSecretInput`](#api-resolvedrotateendpointsecretinput) |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord) \| `null`\>

###### Implementation of

[`WebhookEndpointRepository`](#api-webhookendpointrepository).[`rotateSecret`](#api-rotatesecret-3)

<a id="api-updateendpoint"></a>

##### updateEndpoint()

```ts
updateEndpoint(id, dto): Promise<EndpointRecord | null>;
```

Defined in: [src/adapters/prisma-endpoint.repository.ts:134](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-endpoint.repository.ts#L134)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `dto` | [`UpdateEndpointDto`](#api-updateendpointdto) |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord) \| `null`\>

###### Implementation of

[`WebhookEndpointRepository`](#api-webhookendpointrepository).[`updateEndpoint`](#api-updateendpoint-3)

***

<a id="api-prismaeventrepository"></a>

### PrismaEventRepository

Defined in: [src/adapters/prisma-event.repository.ts:9](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-event.repository.ts#L9)

#### Implements

- [`WebhookEventRepository`](#api-webhookeventrepository)

#### Constructors

<a id="api-constructor-4"></a>

##### Constructor

```ts
new PrismaEventRepository(prisma): PrismaEventRepository;
```

Defined in: [src/adapters/prisma-event.repository.ts:10](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-event.repository.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `prisma` | `any` |

###### Returns

[`PrismaEventRepository`](#api-prismaeventrepository)

#### Methods

<a id="api-saveevent"></a>

##### saveEvent()

```ts
saveEvent(
   eventType,
   payload,
tenantId): Promise<string>;
```

Defined in: [src/adapters/prisma-event.repository.ts:12](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-event.repository.ts#L12)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventType` | `string` |
| `payload` | `Record`\<`string`, `unknown`\> |
| `tenantId` | `string` \| `null` |

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`WebhookEventRepository`](#api-webhookeventrepository).[`saveEvent`](#api-saveevent-1)

<a id="api-saveeventintransaction"></a>

##### saveEventInTransaction()

```ts
saveEventInTransaction(
   tx,
   eventType,
   payload,
tenantId): Promise<string>;
```

Defined in: [src/adapters/prisma-event.repository.ts:24](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-event.repository.ts#L24)

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

[`WebhookEventRepository`](#api-webhookeventrepository).[`saveEventInTransaction`](#api-saveeventintransaction-1)

<a id="api-saveeventonceintransaction"></a>

##### saveEventOnceInTransaction()

```ts
saveEventOnceInTransaction(
   tx,
   eventType,
   payload,
   tenantId,
options): Promise<SavedWebhookEvent>;
```

Defined in: [src/adapters/prisma-event.repository.ts:37](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/adapters/prisma-event.repository.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | `any` |
| `eventType` | `string` |
| `payload` | `Record`\<`string`, `unknown`\> |
| `tenantId` | `string` \| `null` |
| `options` | `Required`\<`Pick`\<[`WebhookPublishOptions`](#api-webhookpublishoptions), `"idempotencyKey"`\>\> & `Pick`\<[`WebhookPublishOptions`](#api-webhookpublishoptions), `"correlationId"`\> |

###### Returns

`Promise`\<[`SavedWebhookEvent`](#api-savedwebhookevent)\>

###### Implementation of

[`WebhookEventRepository`](#api-webhookeventrepository).[`saveEventOnceInTransaction`](#api-saveeventonceintransaction-1)

***

<a id="api-webhookadminservice"></a>

### ~~WebhookAdminService~~

Defined in: [src/webhook.admin.service.ts:27](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.admin.service.ts#L27)

#### Deprecated

since v0.2.0. Will be removed in v1.0.0.
Use WebhookEndpointAdminService and WebhookDeliveryAdminService directly.

#### Constructors

<a id="api-constructor-5"></a>

##### Constructor

```ts
new WebhookAdminService(endpoints, deliveries): WebhookAdminService;
```

Defined in: [src/webhook.admin.service.ts:28](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.admin.service.ts#L28)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpoints` | [`WebhookEndpointAdminService`](#api-webhookendpointadminservice) |
| `deliveries` | [`WebhookDeliveryAdminService`](#api-webhookdeliveryadminservice) |

###### Returns

[`WebhookAdminService`](#api-webhookadminservice)

#### Methods

<a id="api-createendpoint-1"></a>

##### ~~createEndpoint()~~

```ts
createEndpoint(dto): Promise<EndpointRecordWithSecret>;
```

Defined in: [src/webhook.admin.service.ts:33](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.admin.service.ts#L33)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `dto` | [`CreateEndpointDto`](#api-createendpointdto) |

###### Returns

`Promise`\<[`EndpointRecordWithSecret`](#api-endpointrecordwithsecret)\>

<a id="api-deleteendpoint-1"></a>

##### ~~deleteEndpoint()~~

```ts
deleteEndpoint(endpointId): Promise<boolean>;
```

Defined in: [src/webhook.admin.service.ts:59](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.admin.service.ts#L59)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`boolean`\>

<a id="api-getdeliveryattempts-1"></a>

##### ~~getDeliveryAttempts()~~

```ts
getDeliveryAttempts(deliveryId): Promise<DeliveryAttemptRecord[]>;
```

Defined in: [src/webhook.admin.service.ts:70](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.admin.service.ts#L70)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |

###### Returns

`Promise`\<[`DeliveryAttemptRecord`](#api-deliveryattemptrecord)[]\>

<a id="api-getdeliverylogs-1"></a>

##### ~~getDeliveryLogs()~~

```ts
getDeliveryLogs(endpointId, filters?): Promise<DeliveryRecord[]>;
```

Defined in: [src/webhook.admin.service.ts:63](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.admin.service.ts#L63)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `filters?` | [`DeliveryLogFilters`](#api-deliverylogfilters) |

###### Returns

`Promise`\<[`DeliveryRecord`](#api-deliveryrecord)[]\>

<a id="api-getendpoint-1"></a>

##### ~~getEndpoint()~~

```ts
getEndpoint(endpointId): Promise<EndpointRecord | null>;
```

Defined in: [src/webhook.admin.service.ts:41](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.admin.service.ts#L41)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord) \| `null`\>

<a id="api-listendpoints-1"></a>

##### ~~listEndpoints()~~

```ts
listEndpoints(tenantId?): Promise<EndpointRecord[]>;
```

Defined in: [src/webhook.admin.service.ts:37](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.admin.service.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId?` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord)[]\>

<a id="api-replayevent-1"></a>

##### ~~replayEvent()~~

```ts
replayEvent(eventId, options?): Promise<ReplayEventResult>;
```

Defined in: [src/webhook.admin.service.ts:88](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.admin.service.ts#L88)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `options?` | [`ReplayEventOptions`](#api-replayeventoptions) |

###### Returns

`Promise`\<[`ReplayEventResult`](#api-replayeventresult)\>

<a id="api-retrydelivery-1"></a>

##### ~~retryDelivery()~~

```ts
retryDelivery(deliveryId, options?): Promise<boolean>;
```

Defined in: [src/webhook.admin.service.ts:74](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.admin.service.ts#L74)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `options?` | [`RetryDeliveryOptions`](#api-retrydeliveryoptions) |

###### Returns

`Promise`\<`boolean`\>

<a id="api-retryfaileddeliveries-1"></a>

##### ~~retryFailedDeliveries()~~

```ts
retryFailedDeliveries(filters, options?): Promise<RetryFailedDeliveriesResult>;
```

Defined in: [src/webhook.admin.service.ts:81](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.admin.service.ts#L81)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filters` | [`RetryFailedDeliveriesFilters`](#api-retryfaileddeliveriesfilters) |
| `options?` | [`RetryDeliveryOptions`](#api-retrydeliveryoptions) |

###### Returns

`Promise`\<[`RetryFailedDeliveriesResult`](#api-retryfaileddeliveriesresult)\>

<a id="api-rotatesecret-1"></a>

##### ~~rotateSecret()~~

```ts
rotateSecret(endpointId, dto): Promise<EndpointRecordWithSecret | null>;
```

Defined in: [src/webhook.admin.service.ts:52](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.admin.service.ts#L52)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `dto` | [`RotateEndpointSecretDto`](#api-rotateendpointsecretdto) |

###### Returns

`Promise`\<[`EndpointRecordWithSecret`](#api-endpointrecordwithsecret) \| `null`\>

<a id="api-sendtestevent"></a>

##### ~~sendTestEvent()~~

```ts
sendTestEvent(endpointId): Promise<string | null>;
```

Defined in: [src/webhook.admin.service.ts:95](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.admin.service.ts#L95)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`string` \| `null`\>

<a id="api-updateendpoint-1"></a>

##### ~~updateEndpoint()~~

```ts
updateEndpoint(endpointId, dto): Promise<EndpointRecord | null>;
```

Defined in: [src/webhook.admin.service.ts:45](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.admin.service.ts#L45)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `dto` | [`UpdateEndpointDto`](#api-updateendpointdto) |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord) \| `null`\>

***

<a id="api-webhookdeliveryadminservice"></a>

### WebhookDeliveryAdminService

Defined in: [src/webhook.delivery-admin.service.ts:16](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.delivery-admin.service.ts#L16)

#### Constructors

<a id="api-constructor-6"></a>

##### Constructor

```ts
new WebhookDeliveryAdminService(deliveryRepo): WebhookDeliveryAdminService;
```

Defined in: [src/webhook.delivery-admin.service.ts:17](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.delivery-admin.service.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryRepo` | [`WebhookDeliveryRepository`](#api-webhookdeliveryrepository) |

###### Returns

[`WebhookDeliveryAdminService`](#api-webhookdeliveryadminservice)

#### Methods

<a id="api-getdeliveryattempts-2"></a>

##### getDeliveryAttempts()

```ts
getDeliveryAttempts(deliveryId): Promise<DeliveryAttemptRecord[]>;
```

Defined in: [src/webhook.delivery-admin.service.ts:29](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.delivery-admin.service.ts#L29)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |

###### Returns

`Promise`\<[`DeliveryAttemptRecord`](#api-deliveryattemptrecord)[]\>

<a id="api-getdeliverylogs-2"></a>

##### getDeliveryLogs()

```ts
getDeliveryLogs(endpointId, filters?): Promise<DeliveryRecord[]>;
```

Defined in: [src/webhook.delivery-admin.service.ts:22](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.delivery-admin.service.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `filters?` | [`DeliveryLogFilters`](#api-deliverylogfilters) |

###### Returns

`Promise`\<[`DeliveryRecord`](#api-deliveryrecord)[]\>

<a id="api-replayevent-2"></a>

##### replayEvent()

```ts
replayEvent(eventId, options?): Promise<ReplayEventResult>;
```

Defined in: [src/webhook.delivery-admin.service.ts:53](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.delivery-admin.service.ts#L53)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `options?` | [`ReplayEventOptions`](#api-replayeventoptions) |

###### Returns

`Promise`\<[`ReplayEventResult`](#api-replayeventresult)\>

<a id="api-retrydelivery-2"></a>

##### retryDelivery()

```ts
retryDelivery(deliveryId, options?): Promise<boolean>;
```

Defined in: [src/webhook.delivery-admin.service.ts:33](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.delivery-admin.service.ts#L33)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `options?` | [`RetryDeliveryOptions`](#api-retrydeliveryoptions) |

###### Returns

`Promise`\<`boolean`\>

<a id="api-retryfaileddeliveries-2"></a>

##### retryFailedDeliveries()

```ts
retryFailedDeliveries(filters, options?): Promise<RetryFailedDeliveriesResult>;
```

Defined in: [src/webhook.delivery-admin.service.ts:40](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.delivery-admin.service.ts#L40)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filters` | [`RetryFailedDeliveriesFilters`](#api-retryfaileddeliveriesfilters) |
| `options?` | [`RetryDeliveryOptions`](#api-retrydeliveryoptions) |

###### Returns

`Promise`\<[`RetryFailedDeliveriesResult`](#api-retryfaileddeliveriesresult)\>

***

<a id="api-webhookendpointadminservice"></a>

### WebhookEndpointAdminService

Defined in: [src/webhook.endpoint-admin.service.ts:23](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.endpoint-admin.service.ts#L23)

#### Constructors

<a id="api-constructor-7"></a>

##### Constructor

```ts
new WebhookEndpointAdminService(
   endpointRepo,
   eventRepo,
   deliveryRepo,
   signer,
   options): WebhookEndpointAdminService;
```

Defined in: [src/webhook.endpoint-admin.service.ts:27](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.endpoint-admin.service.ts#L27)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointRepo` | [`WebhookEndpointRepository`](#api-webhookendpointrepository) |
| `eventRepo` | [`WebhookEventRepository`](#api-webhookeventrepository) |
| `deliveryRepo` | [`WebhookDeliveryRepository`](#api-webhookdeliveryrepository) |
| `signer` | [`WebhookSigner`](#api-webhooksigner) |
| `options` | [`WebhookModuleOptions`](#api-webhookmoduleoptions) |

###### Returns

[`WebhookEndpointAdminService`](#api-webhookendpointadminservice)

#### Methods

<a id="api-createendpoint-2"></a>

##### createEndpoint()

```ts
createEndpoint(dto): Promise<EndpointRecordWithSecret>;
```

Defined in: [src/webhook.endpoint-admin.service.ts:41](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.endpoint-admin.service.ts#L41)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `dto` | [`CreateEndpointDto`](#api-createendpointdto) |

###### Returns

`Promise`\<[`EndpointRecordWithSecret`](#api-endpointrecordwithsecret)\>

<a id="api-deleteendpoint-2"></a>

##### deleteEndpoint()

```ts
deleteEndpoint(endpointId): Promise<boolean>;
```

Defined in: [src/webhook.endpoint-admin.service.ts:96](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.endpoint-admin.service.ts#L96)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`boolean`\>

<a id="api-getendpoint-2"></a>

##### getEndpoint()

```ts
getEndpoint(endpointId): Promise<EndpointRecord | null>;
```

Defined in: [src/webhook.endpoint-admin.service.ts:65](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.endpoint-admin.service.ts#L65)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord) \| `null`\>

<a id="api-listendpoints-2"></a>

##### listEndpoints()

```ts
listEndpoints(tenantId?): Promise<EndpointRecord[]>;
```

Defined in: [src/webhook.endpoint-admin.service.ts:61](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.endpoint-admin.service.ts#L61)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId?` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord)[]\>

<a id="api-rotatesecret-2"></a>

##### rotateSecret()

```ts
rotateSecret(endpointId, dto): Promise<EndpointRecordWithSecret | null>;
```

Defined in: [src/webhook.endpoint-admin.service.ts:79](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.endpoint-admin.service.ts#L79)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `dto` | [`RotateEndpointSecretDto`](#api-rotateendpointsecretdto) |

###### Returns

`Promise`\<[`EndpointRecordWithSecret`](#api-endpointrecordwithsecret) \| `null`\>

<a id="api-sendtestevent-1"></a>

##### sendTestEvent()

```ts
sendTestEvent(endpointId): Promise<string | null>;
```

Defined in: [src/webhook.endpoint-admin.service.ts:100](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.endpoint-admin.service.ts#L100)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`string` \| `null`\>

<a id="api-updateendpoint-2"></a>

##### updateEndpoint()

```ts
updateEndpoint(endpointId, dto): Promise<EndpointRecord | null>;
```

Defined in: [src/webhook.endpoint-admin.service.ts:69](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.endpoint-admin.service.ts#L69)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `dto` | [`UpdateEndpointDto`](#api-updateendpointdto) |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord) \| `null`\>

***

<a id="api-abstract-webhookevent"></a>

### `abstract` WebhookEvent

Defined in: [src/webhook.event.ts:1](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.event.ts#L1)

#### Constructors

<a id="api-constructor-8"></a>

##### Constructor

```ts
new WebhookEvent(): WebhookEvent;
```

###### Returns

[`WebhookEvent`](#api-abstract-webhookevent)

#### Properties

<a id="api-eventtype-4"></a>

##### eventType

```ts
readonly static eventType: string;
```

Defined in: [src/webhook.event.ts:2](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.event.ts#L2)

#### Accessors

<a id="api-eventtype-5"></a>

##### eventType

###### Get Signature

```ts
get eventType(): string;
```

Defined in: [src/webhook.event.ts:4](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.event.ts#L4)

###### Returns

`string`

#### Methods

<a id="api-topayload"></a>

##### toPayload()

```ts
toPayload(): Record<string, unknown>;
```

Defined in: [src/webhook.event.ts:14](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.event.ts#L14)

###### Returns

`Record`\<`string`, `unknown`\>

***

<a id="api-webhookmodule"></a>

### WebhookModule

Defined in: [src/webhook.module.ts:139](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.module.ts#L139)

#### Implements

- `OnModuleInit`
- `OnModuleDestroy`

#### Constructors

<a id="api-constructor-9"></a>

##### Constructor

```ts
new WebhookModule(
   schedulerRegistry,
   deliveryWorker,
   options): WebhookModule;
```

Defined in: [src/webhook.module.ts:140](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.module.ts#L140)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `schedulerRegistry` | `SchedulerRegistry` |
| `deliveryWorker` | `WebhookDeliveryWorker` |
| `options` | [`WebhookModuleOptions`](#api-webhookmoduleoptions) |

###### Returns

[`WebhookModule`](#api-webhookmodule)

#### Methods

<a id="api-forroot"></a>

##### forRoot()

```ts
static forRoot(options): DynamicModule;
```

Defined in: [src/webhook.module.ts:147](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.module.ts#L147)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`WebhookModuleOptions`](#api-webhookmoduleoptions) |

###### Returns

`DynamicModule`

<a id="api-forrootasync"></a>

##### forRootAsync()

```ts
static forRootAsync(asyncOptions): DynamicModule;
```

Defined in: [src/webhook.module.ts:160](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.module.ts#L160)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `asyncOptions` | [`WebhookModuleAsyncOptions`](#api-webhookmoduleasyncoptions) |

###### Returns

`DynamicModule`

<a id="api-onmoduledestroy"></a>

##### onModuleDestroy()

```ts
onModuleDestroy(): void;
```

Defined in: [src/webhook.module.ts:209](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.module.ts#L209)

###### Returns

`void`

###### Implementation of

```ts
OnModuleDestroy.onModuleDestroy
```

<a id="api-onmoduleinit"></a>

##### onModuleInit()

```ts
onModuleInit(): void;
```

Defined in: [src/webhook.module.ts:200](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.module.ts#L200)

###### Returns

`void`

###### Implementation of

```ts
OnModuleInit.onModuleInit
```

***

<a id="api-webhookretentionadminservice"></a>

### WebhookRetentionAdminService

Defined in: [src/webhook.retention-admin.service.ts:17](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.retention-admin.service.ts#L17)

#### Constructors

<a id="api-constructor-10"></a>

##### Constructor

```ts
new WebhookRetentionAdminService(deliveryRepo, options): WebhookRetentionAdminService;
```

Defined in: [src/webhook.retention-admin.service.ts:18](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.retention-admin.service.ts#L18)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryRepo` | [`WebhookDeliveryRepository`](#api-webhookdeliveryrepository) |
| `options` | [`WebhookModuleOptions`](#api-webhookmoduleoptions) |

###### Returns

[`WebhookRetentionAdminService`](#api-webhookretentionadminservice)

#### Methods

<a id="api-purgeexpireddata-2"></a>

##### purgeExpiredData()

```ts
purgeExpiredData(now?): Promise<WebhookRetentionPurgeResult>;
```

Defined in: [src/webhook.retention-admin.service.ts:25](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.retention-admin.service.ts#L25)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `now?` | `Date` |

###### Returns

`Promise`\<[`WebhookRetentionPurgeResult`](#api-webhookretentionpurgeresult)\>

***

<a id="api-webhookservice"></a>

### WebhookService

Defined in: [src/webhook.service.ts:22](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.service.ts#L22)

#### Constructors

<a id="api-constructor-11"></a>

##### Constructor

```ts
new WebhookService(
   eventRepo,
   endpointRepo,
   deliveryRepo,
   options): WebhookService;
```

Defined in: [src/webhook.service.ts:27](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.service.ts#L27)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventRepo` | [`WebhookEventRepository`](#api-webhookeventrepository) |
| `endpointRepo` | [`WebhookEndpointRepository`](#api-webhookendpointrepository) |
| `deliveryRepo` | [`WebhookDeliveryRepository`](#api-webhookdeliveryrepository) |
| `options` | [`WebhookModuleOptions`](#api-webhookmoduleoptions) |

###### Returns

[`WebhookService`](#api-webhookservice)

#### Methods

<a id="api-send"></a>

##### send()

```ts
send(event, options?): Promise<string>;
```

Defined in: [src/webhook.service.ts:41](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.service.ts#L41)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`WebhookEvent`](#api-abstract-webhookevent) |
| `options?` | [`WebhookPublishOptions`](#api-webhookpublishoptions) |

###### Returns

`Promise`\<`string`\>

<a id="api-sendtoendpoints"></a>

##### sendToEndpoints()

```ts
sendToEndpoints(
   endpointIds,
   event,
   tenantIdOrOptions?,
options?): Promise<string>;
```

Defined in: [src/webhook.service.ts:53](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.service.ts#L53)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointIds` | `string`[] |
| `event` | [`WebhookEvent`](#api-abstract-webhookevent) |
| `tenantIdOrOptions?` | `string` \| [`WebhookPublishOptions`](#api-webhookpublishoptions) |
| `options?` | [`WebhookPublishOptions`](#api-webhookpublishoptions) |

###### Returns

`Promise`\<`string`\>

<a id="api-sendtotenant"></a>

##### sendToTenant()

```ts
sendToTenant(
   tenantId,
   event,
options?): Promise<string>;
```

Defined in: [src/webhook.service.ts:45](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.service.ts#L45)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` |
| `event` | [`WebhookEvent`](#api-abstract-webhookevent) |
| `options?` | [`WebhookPublishOptions`](#api-webhookpublishoptions) |

###### Returns

`Promise`\<`string`\>

***

<a id="api-webhooksigner"></a>

### WebhookSigner

Defined in: [src/webhook.signer.ts:17](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.signer.ts#L17)

#### Constructors

<a id="api-constructor-12"></a>

##### Constructor

```ts
new WebhookSigner(): WebhookSigner;
```

###### Returns

[`WebhookSigner`](#api-webhooksigner)

#### Methods

<a id="api-generatesecret"></a>

##### generateSecret()

```ts
generateSecret(): string;
```

Defined in: [src/webhook.signer.ts:95](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.signer.ts#L95)

###### Returns

`string`

<a id="api-sign"></a>

##### sign()

```ts
sign(
   eventId,
   timestamp,
   body,
   secret): SignatureHeaders;
```

Defined in: [src/webhook.signer.ts:39](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.signer.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `timestamp` | `number` |
| `body` | `string` |
| `secret` | `string` |

###### Returns

[`SignatureHeaders`](#api-signatureheaders)

<a id="api-signall"></a>

##### signAll()

```ts
signAll(
   eventId,
   timestamp,
   body,
   secrets): SignatureHeaders;
```

Defined in: [src/webhook.signer.ts:18](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.signer.ts#L18)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `timestamp` | `number` |
| `body` | `string` |
| `secrets` | `string`[] |

###### Returns

[`SignatureHeaders`](#api-signatureheaders)

<a id="api-verify"></a>

##### verify()

```ts
verify(
   eventId,
   timestamp,
   body,
   secret,
   signature): boolean;
```

Defined in: [src/webhook.signer.ts:48](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.signer.ts#L48)

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

<a id="api-verifywithtolerance"></a>

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

Defined in: [src/webhook.signer.ts:68](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.signer.ts#L68)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `timestamp` | `number` |
| `body` | `string` |
| `secret` | `string` |
| `signature` | `string` |
| `options` | [`WebhookVerificationOptions`](#api-webhookverificationoptions) |

###### Returns

`boolean`

***

<a id="api-webhookurlvalidationerror"></a>

### WebhookUrlValidationError

Defined in: [src/webhook.url-validator.ts:59](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.url-validator.ts#L59)

#### Extends

- `Error`

#### Constructors

<a id="api-constructor-13"></a>

##### Constructor

```ts
new WebhookUrlValidationError(
   message,
   reason,
   url?,
   resolvedIp?): WebhookUrlValidationError;
```

Defined in: [src/webhook.url-validator.ts:65](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.url-validator.ts#L65)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `reason` | [`WebhookUrlValidationReason`](#api-webhookurlvalidationreason) |
| `url?` | `string` |
| `resolvedIp?` | `string` |

###### Returns

[`WebhookUrlValidationError`](#api-webhookurlvalidationerror)

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
readonly name: "WebhookUrlValidationError" = 'WebhookUrlValidationError';
```

Defined in: [src/webhook.url-validator.ts:60](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.url-validator.ts#L60)

###### Overrides

```ts
Error.name
```

<a id="api-reason-4"></a>

##### reason

```ts
readonly reason: WebhookUrlValidationReason;
```

Defined in: [src/webhook.url-validator.ts:61](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.url-validator.ts#L61)

<a id="api-resolvedip-3"></a>

##### resolvedIp?

```ts
readonly optional resolvedIp?: string;
```

Defined in: [src/webhook.url-validator.ts:63](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.url-validator.ts#L63)

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

<a id="api-url-8"></a>

##### url?

```ts
readonly optional url?: string;
```

Defined in: [src/webhook.url-validator.ts:62](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.url-validator.ts#L62)

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

## Interfaces

<a id="api-circuitbreakeroptions"></a>

### CircuitBreakerOptions

Defined in: [src/interfaces/webhook-options.interface.ts:52](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L52)

#### Properties

<a id="api-cooldownminutes"></a>

##### cooldownMinutes?

```ts
optional cooldownMinutes?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:55](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L55)

<a id="api-degradedthreshold"></a>

##### degradedThreshold?

```ts
optional degradedThreshold?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:54](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L54)

<a id="api-failurethreshold"></a>

##### failureThreshold?

```ts
optional failureThreshold?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:53](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L53)

***

<a id="api-claimeddelivery"></a>

### ClaimedDelivery

Defined in: [src/ports/webhook-delivery.repository.ts:23](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L23)

A delivery row claimed by the worker but not yet enriched with endpoint/event data.

#### Extended by

- [`PendingDelivery`](#api-pendingdelivery)

#### Properties

<a id="api-attempts"></a>

##### attempts

```ts
attempts: number;
```

Defined in: [src/ports/webhook-delivery.repository.ts:27](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L27)

<a id="api-endpointid"></a>

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:26](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L26)

<a id="api-eventid"></a>

##### eventId

```ts
eventId: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:25](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L25)

<a id="api-id"></a>

##### id

```ts
id: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:24](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L24)

<a id="api-maxattempts"></a>

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/ports/webhook-delivery.repository.ts:28](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L28)

***

<a id="api-createendpointdto"></a>

### CreateEndpointDto

Defined in: [src/interfaces/webhook-endpoint.interface.ts:22](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L22)

#### Properties

<a id="api-description"></a>

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:27](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L27)

<a id="api-events"></a>

##### events

```ts
events: string[];
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:24](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L24)

<a id="api-metadata"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:29](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L29)

JSON-serializable metadata stored as jsonb. Dates become strings; BigInt is not supported.

<a id="api-secret"></a>

##### secret?

```ts
optional secret?: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:26](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L26)

Pass `'auto'` or omit the field to generate a secure base64 signing secret.

<a id="api-tenantid"></a>

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:30](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L30)

<a id="api-url"></a>

##### url

```ts
url: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:23](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L23)

***

<a id="api-deliveryattemptrecord"></a>

### DeliveryAttemptRecord

Defined in: [src/interfaces/webhook-delivery.interface.ts:24](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L24)

#### Properties

<a id="api-attemptnumber"></a>

##### attemptNumber

```ts
attemptNumber: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:27](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L27)

<a id="api-createdat"></a>

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:34](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L34)

<a id="api-deliveryid"></a>

##### deliveryId

```ts
deliveryId: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:26](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L26)

<a id="api-id-1"></a>

##### id

```ts
id: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:25](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L25)

<a id="api-lasterror"></a>

##### lastError

```ts
lastError: string | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:33](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L33)

<a id="api-latencyms"></a>

##### latencyMs

```ts
latencyMs: number | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:32](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L32)

<a id="api-responsebody"></a>

##### responseBody

```ts
responseBody: string | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:30](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L30)

<a id="api-responsebodytruncated"></a>

##### responseBodyTruncated

```ts
responseBodyTruncated: boolean;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:31](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L31)

<a id="api-responsestatus"></a>

##### responseStatus

```ts
responseStatus: number | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:29](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L29)

<a id="api-status"></a>

##### status

```ts
status: DeliveryAttemptStatus;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:28](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L28)

***

<a id="api-deliverybacklogsummary"></a>

### DeliveryBacklogSummary

Defined in: [src/ports/webhook-delivery.repository.ts:41](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L41)

#### Properties

<a id="api-oldestpendingagems"></a>

##### oldestPendingAgeMs

```ts
oldestPendingAgeMs: number | null;
```

Defined in: [src/ports/webhook-delivery.repository.ts:45](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L45)

<a id="api-oldestrunnableagems"></a>

##### oldestRunnableAgeMs

```ts
oldestRunnableAgeMs: number | null;
```

Defined in: [src/ports/webhook-delivery.repository.ts:46](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L46)

<a id="api-pendingcount"></a>

##### pendingCount

```ts
pendingCount: number;
```

Defined in: [src/ports/webhook-delivery.repository.ts:42](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L42)

<a id="api-runnablependingcount"></a>

##### runnablePendingCount

```ts
runnablePendingCount: number;
```

Defined in: [src/ports/webhook-delivery.repository.ts:44](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L44)

<a id="api-sendingcount"></a>

##### sendingCount

```ts
sendingCount: number;
```

Defined in: [src/ports/webhook-delivery.repository.ts:43](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L43)

***

<a id="api-deliveryfailedcontext"></a>

### DeliveryFailedContext

Defined in: [src/interfaces/webhook-options.interface.ts:131](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L131)

#### Properties

<a id="api-attempts-1"></a>

##### attempts

```ts
attempts: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:137](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L137)

<a id="api-deliveryid-1"></a>

##### deliveryId

```ts
deliveryId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:132](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L132)

<a id="api-endpointid-1"></a>

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:133](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L133)

<a id="api-eventid-1"></a>

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:134](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L134)

<a id="api-failurekind"></a>

##### failureKind?

```ts
optional failureKind?: DeliveryFailureKind;
```

Defined in: [src/interfaces/webhook-options.interface.ts:143](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L143)

High-level classification. Built-in workers set this in v0.8.0+; optional for custom/legacy producers.

<a id="api-lasterror-1"></a>

##### lastError

```ts
lastError: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:139](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L139)

<a id="api-maxattempts-1"></a>

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:138](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L138)

<a id="api-resolvedip"></a>

##### resolvedIp?

```ts
optional resolvedIp?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:149](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L149)

Set only when `failureKind === 'url_validation'` and DNS resolution was involved.

<a id="api-responsestatus-1"></a>

##### responseStatus

```ts
responseStatus: number | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:140](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L140)

<a id="api-tenantid-1"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:136](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L136)

Null when the endpoint is not scoped to a tenant.

<a id="api-validationreason"></a>

##### validationReason?

```ts
optional validationReason?: WebhookUrlValidationReason;
```

Defined in: [src/interfaces/webhook-options.interface.ts:145](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L145)

Set only when `failureKind === 'url_validation'` — structured reason from `WebhookUrlValidationError`.

<a id="api-validationurl"></a>

##### validationUrl?

```ts
optional validationUrl?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:147](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L147)

Set only when `failureKind === 'url_validation'` — URL that triggered validation failure.

***

<a id="api-deliverylogfilters"></a>

### DeliveryLogFilters

Defined in: [src/interfaces/webhook-delivery.interface.ts:53](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L53)

#### Extended by

- [`RetryFailedDeliveriesFilters`](#api-retryfaileddeliveriesfilters)

#### Properties

<a id="api-eventtype"></a>

##### eventType?

```ts
optional eventType?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:55](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L55)

<a id="api-limit"></a>

##### limit?

```ts
optional limit?: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:58](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L58)

<a id="api-offset"></a>

##### offset?

```ts
optional offset?: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:59](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L59)

<a id="api-since"></a>

##### since?

```ts
optional since?: Date;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:56](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L56)

<a id="api-status-1"></a>

##### status?

```ts
optional status?: DeliveryStatus;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:54](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L54)

<a id="api-until"></a>

##### until?

```ts
optional until?: Date;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:57](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L57)

***

<a id="api-deliveryoptions"></a>

### DeliveryOptions

Defined in: [src/interfaces/webhook-options.interface.ts:15](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L15)

#### Properties

<a id="api-backoff"></a>

##### ~~backoff?~~

```ts
optional backoff?: "exponential";
```

Defined in: [src/interfaces/webhook-options.interface.ts:19](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L19)

###### Deprecated

Retry backoff is currently fixed to the default exponential schedule.

<a id="api-jitter"></a>

##### jitter?

```ts
optional jitter?: boolean;
```

Defined in: [src/interfaces/webhook-options.interface.ts:20](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L20)

<a id="api-maxretries"></a>

##### maxRetries?

```ts
optional maxRetries?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:17](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L17)

<a id="api-timeout"></a>

##### timeout?

```ts
optional timeout?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:16](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L16)

***

<a id="api-deliveryrecord"></a>

### DeliveryRecord

Defined in: [src/interfaces/webhook-delivery.interface.ts:4](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L4)

#### Properties

<a id="api-attempts-2"></a>

##### attempts

```ts
attempts: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:13](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L13)

<a id="api-completedat"></a>

##### completedAt

```ts
completedAt: Date | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:17](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L17)

<a id="api-destinationurl"></a>

##### destinationUrl

```ts
destinationUrl: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:9](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L9)

Destination URL used for this delivery. Uses the queued snapshot when available.

<a id="api-endpointid-2"></a>

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:7](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L7)

<a id="api-eventid-2"></a>

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:6](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L6)

<a id="api-id-2"></a>

##### id

```ts
id: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:5](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L5)

<a id="api-lastattemptat"></a>

##### lastAttemptAt

```ts
lastAttemptAt: Date | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:16](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L16)

<a id="api-lasterror-2"></a>

##### lastError

```ts
lastError: string | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:21](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L21)

<a id="api-latencyms-1"></a>

##### latencyMs

```ts
latencyMs: number | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:20](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L20)

<a id="api-maxattempts-2"></a>

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:14](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L14)

<a id="api-nextattemptat"></a>

##### nextAttemptAt

```ts
nextAttemptAt: Date | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:15](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L15)

<a id="api-responsebody-1"></a>

##### responseBody

```ts
responseBody: string | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:19](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L19)

<a id="api-responsestatus-2"></a>

##### responseStatus

```ts
responseStatus: number | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:18](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L18)

<a id="api-status-2"></a>

##### status

```ts
status: DeliveryStatus;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:12](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L12)

<a id="api-tenantid-2"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:11](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L11)

Null when the endpoint is global rather than tenant-scoped.

***

<a id="api-deliveryresult"></a>

### DeliveryResult

Defined in: [src/interfaces/webhook-delivery.interface.ts:45](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L45)

#### Properties

<a id="api-body"></a>

##### body?

```ts
optional body?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:48](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L48)

<a id="api-error"></a>

##### error?

```ts
optional error?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:50](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L50)

<a id="api-latencyms-2"></a>

##### latencyMs

```ts
latencyMs: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:49](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L49)

<a id="api-statuscode"></a>

##### statusCode?

```ts
optional statusCode?: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:47](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L47)

<a id="api-success"></a>

##### success

```ts
success: boolean;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:46](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L46)

***

<a id="api-deliveryretryscheduledcontext"></a>

### DeliveryRetryScheduledContext

Defined in: [src/interfaces/webhook-options.interface.ts:152](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L152)

#### Properties

<a id="api-attempts-3"></a>

##### attempts

```ts
attempts: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:158](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L158)

<a id="api-deliveryid-2"></a>

##### deliveryId

```ts
deliveryId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:153](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L153)

<a id="api-endpointid-3"></a>

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:154](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L154)

<a id="api-eventid-3"></a>

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:155](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L155)

<a id="api-failurekind-1"></a>

##### failureKind?

```ts
optional failureKind?: DeliveryFailureKind;
```

Defined in: [src/interfaces/webhook-options.interface.ts:165](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L165)

High-level classification for the failed attempt that scheduled the retry.

<a id="api-lasterror-3"></a>

##### lastError

```ts
lastError: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:161](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L161)

<a id="api-maxattempts-3"></a>

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:159](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L159)

<a id="api-nextattemptat-1"></a>

##### nextAttemptAt

```ts
nextAttemptAt: Date;
```

Defined in: [src/interfaces/webhook-options.interface.ts:160](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L160)

<a id="api-resolvedip-1"></a>

##### resolvedIp?

```ts
optional resolvedIp?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:171](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L171)

Set only when `failureKind === 'url_validation'` and DNS resolution was involved.

<a id="api-responsestatus-3"></a>

##### responseStatus

```ts
responseStatus: number | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:162](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L162)

<a id="api-tenantid-3"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:157](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L157)

Null when the endpoint is not scoped to a tenant.

<a id="api-validationreason-1"></a>

##### validationReason?

```ts
optional validationReason?: WebhookUrlValidationReason;
```

Defined in: [src/interfaces/webhook-options.interface.ts:167](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L167)

Set only when `failureKind === 'url_validation'` — structured reason from `WebhookUrlValidationError`.

<a id="api-validationurl-1"></a>

##### validationUrl?

```ts
optional validationUrl?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:169](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L169)

Set only when `failureKind === 'url_validation'` — URL that triggered validation failure.

***

<a id="api-endpointdegradedcontext"></a>

### EndpointDegradedContext

Defined in: [src/interfaces/webhook-options.interface.ts:183](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L183)

#### Properties

<a id="api-consecutivefailures"></a>

##### consecutiveFailures

```ts
consecutiveFailures: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:189](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L189)

<a id="api-degradedthreshold-1"></a>

##### degradedThreshold

```ts
degradedThreshold: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:190](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L190)

<a id="api-endpointid-4"></a>

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:184](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L184)

<a id="api-failurethreshold-1"></a>

##### failureThreshold

```ts
failureThreshold: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:191](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L191)

<a id="api-reason"></a>

##### reason

```ts
reason: "consecutive_failures_degraded";
```

Defined in: [src/interfaces/webhook-options.interface.ts:188](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L188)

<a id="api-tenantid-4"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:186](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L186)

Null when the endpoint is not scoped to a tenant.

<a id="api-url-1"></a>

##### url

```ts
url: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:187](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L187)

***

<a id="api-endpointdisabledcontext"></a>

### EndpointDisabledContext

Defined in: [src/interfaces/webhook-options.interface.ts:174](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L174)

#### Properties

<a id="api-consecutivefailures-1"></a>

##### consecutiveFailures

```ts
consecutiveFailures: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:180](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L180)

<a id="api-endpointid-5"></a>

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:175](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L175)

<a id="api-reason-1"></a>

##### reason

```ts
reason: "consecutive_failures_exceeded";
```

Defined in: [src/interfaces/webhook-options.interface.ts:179](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L179)

<a id="api-tenantid-5"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:177](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L177)

Null when the endpoint is not scoped to a tenant.

<a id="api-url-2"></a>

##### url

```ts
url: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:178](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L178)

***

<a id="api-endpointrecord"></a>

### EndpointRecord

Defined in: [src/interfaces/webhook-endpoint.interface.ts:1](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L1)

#### Extended by

- [`EndpointRecordWithSecret`](#api-endpointrecordwithsecret)

#### Properties

<a id="api-active"></a>

##### active

```ts
active: boolean;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:5](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L5)

<a id="api-consecutivefailures-2"></a>

##### consecutiveFailures

```ts
consecutiveFailures: number;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:9](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L9)

<a id="api-createdat-1"></a>

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:13](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L13)

<a id="api-description-1"></a>

##### description

```ts
description: string | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:6](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L6)

<a id="api-disabledat"></a>

##### disabledAt

```ts
disabledAt: Date | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:10](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L10)

<a id="api-disabledreason"></a>

##### disabledReason

```ts
disabledReason: string | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:11](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L11)

<a id="api-events-1"></a>

##### events

```ts
events: string[];
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:4](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L4)

<a id="api-id-3"></a>

##### id

```ts
id: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:2](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L2)

<a id="api-metadata-1"></a>

##### metadata

```ts
metadata: Record<string, unknown> | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:7](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L7)

<a id="api-previoussecretexpiresat"></a>

##### previousSecretExpiresAt

```ts
previousSecretExpiresAt: Date | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:12](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L12)

<a id="api-tenantid-6"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:8](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L8)

<a id="api-updatedat"></a>

##### updatedAt

```ts
updatedAt: Date;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:14](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L14)

<a id="api-url-3"></a>

##### url

```ts
url: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:3](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L3)

***

<a id="api-endpointrecordwithsecret"></a>

### EndpointRecordWithSecret

Defined in: [src/interfaces/webhook-endpoint.interface.ts:18](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L18)

Internal record that includes the signing secret. Only used for endpoint creation response and delivery enrichment.

#### Extends

- [`EndpointRecord`](#api-endpointrecord)

#### Properties

<a id="api-active-1"></a>

##### active

```ts
active: boolean;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:5](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L5)

###### Inherited from

[`EndpointRecord`](#api-endpointrecord).[`active`](#api-active)

<a id="api-consecutivefailures-3"></a>

##### consecutiveFailures

```ts
consecutiveFailures: number;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:9](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L9)

###### Inherited from

[`EndpointRecord`](#api-endpointrecord).[`consecutiveFailures`](#api-consecutivefailures-2)

<a id="api-createdat-2"></a>

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:13](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L13)

###### Inherited from

[`EndpointRecord`](#api-endpointrecord).[`createdAt`](#api-createdat-1)

<a id="api-description-2"></a>

##### description

```ts
description: string | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:6](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L6)

###### Inherited from

[`EndpointRecord`](#api-endpointrecord).[`description`](#api-description-1)

<a id="api-disabledat-1"></a>

##### disabledAt

```ts
disabledAt: Date | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:10](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L10)

###### Inherited from

[`EndpointRecord`](#api-endpointrecord).[`disabledAt`](#api-disabledat)

<a id="api-disabledreason-1"></a>

##### disabledReason

```ts
disabledReason: string | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:11](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L11)

###### Inherited from

[`EndpointRecord`](#api-endpointrecord).[`disabledReason`](#api-disabledreason)

<a id="api-events-2"></a>

##### events

```ts
events: string[];
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:4](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L4)

###### Inherited from

[`EndpointRecord`](#api-endpointrecord).[`events`](#api-events-1)

<a id="api-id-4"></a>

##### id

```ts
id: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:2](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L2)

###### Inherited from

[`EndpointRecord`](#api-endpointrecord).[`id`](#api-id-3)

<a id="api-metadata-2"></a>

##### metadata

```ts
metadata: Record<string, unknown> | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:7](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L7)

###### Inherited from

[`EndpointRecord`](#api-endpointrecord).[`metadata`](#api-metadata-1)

<a id="api-previoussecretexpiresat-1"></a>

##### previousSecretExpiresAt

```ts
previousSecretExpiresAt: Date | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:12](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L12)

###### Inherited from

[`EndpointRecord`](#api-endpointrecord).[`previousSecretExpiresAt`](#api-previoussecretexpiresat)

<a id="api-secret-1"></a>

##### secret

```ts
secret: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:19](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L19)

<a id="api-tenantid-7"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:8](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L8)

###### Inherited from

[`EndpointRecord`](#api-endpointrecord).[`tenantId`](#api-tenantid-6)

<a id="api-updatedat-1"></a>

##### updatedAt

```ts
updatedAt: Date;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:14](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L14)

###### Inherited from

[`EndpointRecord`](#api-endpointrecord).[`updatedAt`](#api-updatedat)

<a id="api-url-4"></a>

##### url

```ts
url: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:3](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L3)

###### Inherited from

[`EndpointRecord`](#api-endpointrecord).[`url`](#api-url-3)

***

<a id="api-eventrecord"></a>

### EventRecord

Defined in: [src/interfaces/webhook-delivery.interface.ts:37](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L37)

#### Properties

<a id="api-createdat-3"></a>

##### createdAt

```ts
createdAt: Date;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:42](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L42)

<a id="api-eventtype-1"></a>

##### eventType

```ts
eventType: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:39](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L39)

<a id="api-id-5"></a>

##### id

```ts
id: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:38](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L38)

<a id="api-payload"></a>

##### payload

```ts
payload: Record<string, unknown>;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:40](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L40)

<a id="api-tenantid-8"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:41](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L41)

***

<a id="api-pendingdelivery"></a>

### PendingDelivery

Defined in: [src/ports/webhook-delivery.repository.ts:32](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L32)

A claimed delivery enriched with endpoint URL, signing secrets, and event payload. Ready to dispatch.

#### Extends

- [`ClaimedDelivery`](#api-claimeddelivery)

#### Properties

<a id="api-additionalsecrets"></a>

##### additionalSecrets

```ts
additionalSecrets: string[];
```

Defined in: [src/ports/webhook-delivery.repository.ts:36](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L36)

<a id="api-attempts-4"></a>

##### attempts

```ts
attempts: number;
```

Defined in: [src/ports/webhook-delivery.repository.ts:27](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L27)

###### Inherited from

[`ClaimedDelivery`](#api-claimeddelivery).[`attempts`](#api-attempts)

<a id="api-endpointid-6"></a>

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:26](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L26)

###### Inherited from

[`ClaimedDelivery`](#api-claimeddelivery).[`endpointId`](#api-endpointid)

<a id="api-eventid-4"></a>

##### eventId

```ts
eventId: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:25](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L25)

###### Inherited from

[`ClaimedDelivery`](#api-claimeddelivery).[`eventId`](#api-eventid)

<a id="api-eventtype-2"></a>

##### eventType

```ts
eventType: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:37](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L37)

<a id="api-id-6"></a>

##### id

```ts
id: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:24](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L24)

###### Inherited from

[`ClaimedDelivery`](#api-claimeddelivery).[`id`](#api-id)

<a id="api-maxattempts-4"></a>

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/ports/webhook-delivery.repository.ts:28](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L28)

###### Inherited from

[`ClaimedDelivery`](#api-claimeddelivery).[`maxAttempts`](#api-maxattempts)

<a id="api-payload-1"></a>

##### payload

```ts
payload: Record<string, unknown>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:38](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L38)

<a id="api-secret-2"></a>

##### secret

```ts
secret: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:35](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L35)

<a id="api-tenantid-9"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/ports/webhook-delivery.repository.ts:33](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L33)

<a id="api-url-5"></a>

##### url

```ts
url: string;
```

Defined in: [src/ports/webhook-delivery.repository.ts:34](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L34)

***

<a id="api-pollingoptions"></a>

### PollingOptions

Defined in: [src/interfaces/webhook-options.interface.ts:58](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L58)

#### Properties

<a id="api-batchsize"></a>

##### batchSize?

```ts
optional batchSize?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:62](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L62)

<a id="api-drainloopdelayms"></a>

##### drainLoopDelayMs?

```ts
optional drainLoopDelayMs?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:72](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L72)

Optional sleep between continuous drain loops. Default: 0

<a id="api-drainwhilebacklogged"></a>

##### drainWhileBacklogged?

```ts
optional drainWhileBacklogged?: boolean;
```

Defined in: [src/interfaces/webhook-options.interface.ts:68](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L68)

When true, one poll cycle keeps claiming while backlog and capacity remain. Default: false

<a id="api-enabled"></a>

##### enabled?

```ts
optional enabled?: boolean;
```

Defined in: [src/interfaces/webhook-options.interface.ts:60](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L60)

Set to false to disable the polling loop. Useful for API-only processes where a separate worker handles delivery. Default: true

<a id="api-interval"></a>

##### interval?

```ts
optional interval?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:61](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L61)

<a id="api-maxconcurrency"></a>

##### maxConcurrency?

```ts
optional maxConcurrency?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:66](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L66)

Maximum delivery dispatches in flight per worker process. Default: batchSize

<a id="api-maxdrainloopsperpoll"></a>

##### maxDrainLoopsPerPoll?

```ts
optional maxDrainLoopsPerPoll?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:70](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L70)

Maximum claim/drain loops inside one poll cycle. Default: 1, or 10 when drainWhileBacklogged is true

<a id="api-stalesendingminutes"></a>

##### staleSendingMinutes?

```ts
optional staleSendingMinutes?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:64](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L64)

Minutes before a SENDING delivery is considered stale and reset to PENDING. Default: 5

***

<a id="api-replayeventoptions"></a>

### ReplayEventOptions

Defined in: [src/interfaces/webhook-delivery.interface.ts:76](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L76)

#### Properties

<a id="api-endpointids"></a>

##### endpointIds?

```ts
optional endpointIds?: string[];
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:77](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L77)

<a id="api-reason-2"></a>

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:79](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L79)

<a id="api-tenantid-10"></a>

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:78](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L78)

***

<a id="api-replayeventresult"></a>

### ReplayEventResult

Defined in: [src/interfaces/webhook-delivery.interface.ts:82](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L82)

#### Properties

<a id="api-deliveriescreated"></a>

##### deliveriesCreated

```ts
deliveriesCreated: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:84](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L84)

<a id="api-endpointids-1"></a>

##### endpointIds

```ts
endpointIds: string[];
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:85](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L85)

<a id="api-eventid-5"></a>

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:83](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L83)

***

<a id="api-resolvedcreateendpointinput"></a>

### ResolvedCreateEndpointInput

Defined in: [src/ports/webhook-endpoint.repository.ts:9](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L9)

#### Properties

<a id="api-description-3"></a>

##### description

```ts
description: string | null;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:13](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L13)

<a id="api-events-3"></a>

##### events

```ts
events: string[];
```

Defined in: [src/ports/webhook-endpoint.repository.ts:12](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L12)

<a id="api-metadata-3"></a>

##### metadata

```ts
metadata: Record<string, unknown> | null;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:14](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L14)

<a id="api-secret-3"></a>

##### secret

```ts
secret: string;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:11](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L11)

<a id="api-tenantid-11"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:15](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L15)

<a id="api-url-6"></a>

##### url

```ts
url: string;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:10](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L10)

***

<a id="api-resolvedrotateendpointsecretinput"></a>

### ResolvedRotateEndpointSecretInput

Defined in: [src/ports/webhook-endpoint.repository.ts:18](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L18)

#### Extends

- `Required`\<[`RotateEndpointSecretDto`](#api-rotateendpointsecretdto)\>

#### Properties

<a id="api-previoussecretexpiresat-2"></a>

##### previousSecretExpiresAt

```ts
previousSecretExpiresAt: Date;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:46](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L46)

Keep the previous secret valid until this timestamp so queued receivers can overlap during rotation.

###### Inherited from

[`RotateEndpointSecretDto`](#api-rotateendpointsecretdto).[`previousSecretExpiresAt`](#api-previoussecretexpiresat-3)

<a id="api-secret-4"></a>

##### secret

```ts
secret: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:44](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L44)

Pass `'auto'` or omit the field to generate a secure base64 signing secret.

###### Inherited from

[`RotateEndpointSecretDto`](#api-rotateendpointsecretdto).[`secret`](#api-secret-5)

***

<a id="api-retrydeliveryoptions"></a>

### RetryDeliveryOptions

Defined in: [src/interfaces/webhook-delivery.interface.ts:62](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L62)

#### Properties

<a id="api-reason-3"></a>

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:63](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L63)

***

<a id="api-retryfaileddeliveriesfilters"></a>

### RetryFailedDeliveriesFilters

Defined in: [src/interfaces/webhook-delivery.interface.ts:66](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L66)

#### Extends

- [`DeliveryLogFilters`](#api-deliverylogfilters)

#### Properties

<a id="api-endpointid-7"></a>

##### endpointId?

```ts
optional endpointId?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:67](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L67)

<a id="api-eventtype-3"></a>

##### eventType?

```ts
optional eventType?: string;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:55](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L55)

###### Inherited from

[`DeliveryLogFilters`](#api-deliverylogfilters).[`eventType`](#api-eventtype)

<a id="api-limit-1"></a>

##### limit?

```ts
optional limit?: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:58](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L58)

###### Inherited from

[`DeliveryLogFilters`](#api-deliverylogfilters).[`limit`](#api-limit)

<a id="api-offset-1"></a>

##### offset?

```ts
optional offset?: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:59](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L59)

###### Inherited from

[`DeliveryLogFilters`](#api-deliverylogfilters).[`offset`](#api-offset)

<a id="api-since-1"></a>

##### since?

```ts
optional since?: Date;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:56](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L56)

###### Inherited from

[`DeliveryLogFilters`](#api-deliverylogfilters).[`since`](#api-since)

<a id="api-status-3"></a>

##### status?

```ts
optional status?: DeliveryStatus;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:54](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L54)

###### Inherited from

[`DeliveryLogFilters`](#api-deliverylogfilters).[`status`](#api-status-1)

<a id="api-until-1"></a>

##### until?

```ts
optional until?: Date;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:57](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L57)

###### Inherited from

[`DeliveryLogFilters`](#api-deliverylogfilters).[`until`](#api-until)

***

<a id="api-retryfaileddeliveriesresult"></a>

### RetryFailedDeliveriesResult

Defined in: [src/interfaces/webhook-delivery.interface.ts:70](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L70)

#### Properties

<a id="api-matched"></a>

##### matched

```ts
matched: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:71](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L71)

<a id="api-retried"></a>

##### retried

```ts
retried: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:72](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L72)

<a id="api-skipped"></a>

##### skipped

```ts
skipped: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:73](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L73)

***

<a id="api-rotateendpointsecretdto"></a>

### RotateEndpointSecretDto

Defined in: [src/interfaces/webhook-endpoint.interface.ts:42](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L42)

#### Properties

<a id="api-previoussecretexpiresat-3"></a>

##### previousSecretExpiresAt

```ts
previousSecretExpiresAt: Date;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:46](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L46)

Keep the previous secret valid until this timestamp so queued receivers can overlap during rotation.

<a id="api-secret-5"></a>

##### secret?

```ts
optional secret?: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:44](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L44)

Pass `'auto'` or omit the field to generate a secure base64 signing secret.

***

<a id="api-savedwebhookevent"></a>

### SavedWebhookEvent

Defined in: [src/ports/webhook-event.repository.ts:4](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-event.repository.ts#L4)

#### Properties

<a id="api-created"></a>

##### created

```ts
created: boolean;
```

Defined in: [src/ports/webhook-event.repository.ts:6](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-event.repository.ts#L6)

<a id="api-id-7"></a>

##### id

```ts
id: string;
```

Defined in: [src/ports/webhook-event.repository.ts:5](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-event.repository.ts#L5)

***

<a id="api-signatureheaders"></a>

### SignatureHeaders

Defined in: [src/webhook.signer.ts:4](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.signer.ts#L4)

#### Indexable

```ts
[key: string]: string
```

#### Properties

<a id="api-webhook-id"></a>

##### webhook-id

```ts
webhook-id: string;
```

Defined in: [src/webhook.signer.ts:6](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.signer.ts#L6)

<a id="api-webhook-signature"></a>

##### webhook-signature

```ts
webhook-signature: string;
```

Defined in: [src/webhook.signer.ts:8](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.signer.ts#L8)

<a id="api-webhook-timestamp"></a>

##### webhook-timestamp

```ts
webhook-timestamp: string;
```

Defined in: [src/webhook.signer.ts:7](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.signer.ts#L7)

***

<a id="api-updateendpointdto"></a>

### UpdateEndpointDto

Defined in: [src/interfaces/webhook-endpoint.interface.ts:33](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L33)

#### Properties

<a id="api-active-2"></a>

##### active?

```ts
optional active?: boolean;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:39](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L39)

<a id="api-description-4"></a>

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:36](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L36)

<a id="api-events-4"></a>

##### events?

```ts
optional events?: string[];
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:35](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L35)

<a id="api-metadata-4"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:38](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L38)

JSON-serializable metadata stored as jsonb. Dates become strings; BigInt is not supported.

<a id="api-url-7"></a>

##### url?

```ts
optional url?: string;
```

Defined in: [src/interfaces/webhook-endpoint.interface.ts:34](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-endpoint.interface.ts#L34)

***

<a id="api-webhookdeliveryprocessingresult"></a>

### WebhookDeliveryProcessingResult

Defined in: [src/interfaces/webhook-options.interface.ts:97](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L97)

#### Properties

<a id="api-attempts-5"></a>

##### attempts

```ts
attempts: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:102](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L102)

<a id="api-deliveryid-3"></a>

##### deliveryId

```ts
deliveryId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:98](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L98)

<a id="api-endpointid-8"></a>

##### endpointId

```ts
endpointId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:99](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L99)

<a id="api-eventid-6"></a>

##### eventId

```ts
eventId: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:100](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L100)

<a id="api-failurekind-2"></a>

##### failureKind?

```ts
optional failureKind?: DeliveryFailureKind;
```

Defined in: [src/interfaces/webhook-options.interface.ts:109](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L109)

<a id="api-lasterror-4"></a>

##### lastError

```ts
lastError: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:106](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L106)

<a id="api-latencyms-3"></a>

##### latencyMs

```ts
latencyMs: number | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:107](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L107)

<a id="api-maxattempts-5"></a>

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:103](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L103)

<a id="api-nextattemptat-2"></a>

##### nextAttemptAt?

```ts
optional nextAttemptAt?: Date;
```

Defined in: [src/interfaces/webhook-options.interface.ts:108](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L108)

<a id="api-resolvedip-2"></a>

##### resolvedIp?

```ts
optional resolvedIp?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:112](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L112)

<a id="api-responsestatus-4"></a>

##### responseStatus

```ts
responseStatus: number | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:105](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L105)

<a id="api-status-4"></a>

##### status

```ts
status: WebhookDeliveryProcessingStatus;
```

Defined in: [src/interfaces/webhook-options.interface.ts:104](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L104)

<a id="api-tenantid-12"></a>

##### tenantId

```ts
tenantId: string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:101](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L101)

<a id="api-validationreason-2"></a>

##### validationReason?

```ts
optional validationReason?: WebhookUrlValidationReason;
```

Defined in: [src/interfaces/webhook-options.interface.ts:110](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L110)

<a id="api-validationurl-2"></a>

##### validationUrl?

```ts
optional validationUrl?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:111](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L111)

***

<a id="api-webhookdeliveryrepository"></a>

### WebhookDeliveryRepository

Defined in: [src/ports/webhook-delivery.repository.ts:49](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L49)

#### Methods

<a id="api-claimpendingdeliveries-1"></a>

##### claimPendingDeliveries()

```ts
claimPendingDeliveries(batchSize): Promise<ClaimedDelivery[]>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:65](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L65)

Atomically claims pending rows and returns the minimal delivery identity needed for enrichment.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `batchSize` | `number` |

###### Returns

`Promise`\<[`ClaimedDelivery`](#api-claimeddelivery)[]\>

<a id="api-createdeliveriesintransaction-1"></a>

##### createDeliveriesInTransaction()

```ts
createDeliveriesInTransaction(
   tx,
   eventId,
   endpointIds,
maxAttempts): Promise<void>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:54](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L54)

Creates queued delivery rows inside the provided transaction.
No-op when endpointIds is empty.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`WebhookTransaction`](#api-webhooktransaction) |
| `eventId` | `string` |
| `endpointIds` | `string`[] |
| `maxAttempts` | `number` |

###### Returns

`Promise`\<`void`\>

<a id="api-createtestdelivery-1"></a>

##### createTestDelivery()

```ts
createTestDelivery(eventId, endpointId): Promise<void>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:91](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L91)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `endpointId` | `string` |

###### Returns

`Promise`\<`void`\>

<a id="api-enrichdeliveries-1"></a>

##### enrichDeliveries()

```ts
enrichDeliveries(deliveryIds): Promise<PendingDelivery[]>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:66](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L66)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryIds` | `string`[] |

###### Returns

`Promise`\<[`PendingDelivery`](#api-pendingdelivery)[]\>

<a id="api-getbacklogsummary-1"></a>

##### getBacklogSummary()?

```ts
optional getBacklogSummary(): Promise<DeliveryBacklogSummary>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:74](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L74)

###### Returns

`Promise`\<[`DeliveryBacklogSummary`](#api-deliverybacklogsummary)\>

<a id="api-getdeliveryattempts-3"></a>

##### getDeliveryAttempts()

```ts
getDeliveryAttempts(deliveryId): Promise<DeliveryAttemptRecord[]>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:77](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L77)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |

###### Returns

`Promise`\<[`DeliveryAttemptRecord`](#api-deliveryattemptrecord)[]\>

attempts sorted by attemptNumber ASC.

<a id="api-getdeliverylogs-3"></a>

##### getDeliveryLogs()

```ts
getDeliveryLogs(endpointId, filters?): Promise<DeliveryRecord[]>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:75](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L75)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `filters?` | [`DeliveryLogFilters`](#api-deliverylogfilters) |

###### Returns

`Promise`\<[`DeliveryRecord`](#api-deliveryrecord)[]\>

<a id="api-markfailed-1"></a>

##### markFailed()

```ts
markFailed(
   deliveryId,
   attempts,
result): Promise<void>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:69](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L69)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `attempts` | `number` |
| `result` | [`DeliveryResult`](#api-deliveryresult) |

###### Returns

`Promise`\<`void`\>

<a id="api-markretry-1"></a>

##### markRetry()

```ts
markRetry(
   deliveryId,
   attempts,
   nextAt,
result): Promise<void>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:70](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L70)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `attempts` | `number` |
| `nextAt` | `Date` |
| `result` | [`DeliveryResult`](#api-deliveryresult) |

###### Returns

`Promise`\<`void`\>

<a id="api-marksent-1"></a>

##### markSent()

```ts
markSent(
   deliveryId,
   attempts,
result): Promise<void>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:68](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L68)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `attempts` | `number` |
| `result` | [`DeliveryResult`](#api-deliveryresult) |

###### Returns

`Promise`\<`void`\>

<a id="api-purgeexpireddata-1"></a>

##### purgeExpiredData()?

```ts
optional purgeExpiredData(options, now?): Promise<WebhookRetentionPurgeResult>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:87](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L87)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`WebhookRetentionOptions`](#api-webhookretentionoptions) |
| `now?` | `Date` |

###### Returns

`Promise`\<[`WebhookRetentionPurgeResult`](#api-webhookretentionpurgeresult)\>

<a id="api-recoverstalesending-1"></a>

##### recoverStaleSending()

```ts
recoverStaleSending(stalenessMinutes): Promise<number>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:73](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L73)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `stalenessMinutes` | `number` |

###### Returns

`Promise`\<`number`\>

number of stale SENDING deliveries recovered or failed.

<a id="api-replayevent-3"></a>

##### replayEvent()?

```ts
optional replayEvent(eventId, options?): Promise<ReplayEventResult>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:83](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L83)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventId` | `string` |
| `options?` | [`ReplayEventOptions`](#api-replayeventoptions) |

###### Returns

`Promise`\<[`ReplayEventResult`](#api-replayeventresult)\>

<a id="api-retrydelivery-3"></a>

##### retryDelivery()

```ts
retryDelivery(deliveryId, options?): Promise<boolean>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:78](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L78)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deliveryId` | `string` |
| `options?` | [`RetryDeliveryOptions`](#api-retrydeliveryoptions) |

###### Returns

`Promise`\<`boolean`\>

<a id="api-retryfaileddeliveries-3"></a>

##### retryFailedDeliveries()?

```ts
optional retryFailedDeliveries(filters, options?): Promise<RetryFailedDeliveriesResult>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:79](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L79)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filters` | [`RetryFailedDeliveriesFilters`](#api-retryfaileddeliveriesfilters) |
| `options?` | [`RetryDeliveryOptions`](#api-retrydeliveryoptions) |

###### Returns

`Promise`\<[`RetryFailedDeliveriesResult`](#api-retryfaileddeliveriesresult)\>

<a id="api-runintransaction-1"></a>

##### runInTransaction()

```ts
runInTransaction<T>(fn): Promise<T>;
```

Defined in: [src/ports/webhook-delivery.repository.ts:62](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L62)

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

<a id="api-webhookendpointrepository"></a>

### WebhookEndpointRepository

Defined in: [src/ports/webhook-endpoint.repository.ts:21](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L21)

#### Methods

<a id="api-createendpoint-3"></a>

##### createEndpoint()

```ts
createEndpoint(input): Promise<EndpointRecordWithSecret>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:34](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L34)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ResolvedCreateEndpointInput`](#api-resolvedcreateendpointinput) |

###### Returns

`Promise`\<[`EndpointRecordWithSecret`](#api-endpointrecordwithsecret)\>

<a id="api-deleteendpoint-3"></a>

##### deleteEndpoint()

```ts
deleteEndpoint(id): Promise<boolean>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:47](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L47)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`Promise`\<`boolean`\>

true if a row was deleted, false if the endpoint did not exist.
May reject when existing delivery rows still reference the endpoint.

<a id="api-disableendpoint-1"></a>

##### disableEndpoint()

```ts
disableEndpoint(endpointId, reason): Promise<boolean>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:53](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L53)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |
| `reason` | `string` |

###### Returns

`Promise`\<`boolean`\>

true when the endpoint transitioned from active to inactive.

<a id="api-findmatchingendpoints-1"></a>

##### findMatchingEndpoints()

```ts
findMatchingEndpoints(eventType, tenantId): Promise<EndpointRecord[]>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:22](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventType` | `string` |
| `tenantId` | `string` \| `undefined` |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord)[]\>

<a id="api-findmatchingendpointsintransaction-1"></a>

##### findMatchingEndpointsInTransaction()

```ts
findMatchingEndpointsInTransaction(
   tx,
   eventType,
tenantId): Promise<EndpointRecord[]>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:28](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L28)

Use only with a transaction object received from WebhookDeliveryRepository.runInTransaction().

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`WebhookTransaction`](#api-webhooktransaction) |
| `eventType` | `string` |
| `tenantId` | `string` \| `undefined` |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord)[]\>

<a id="api-getendpoint-3"></a>

##### getEndpoint()

```ts
getEndpoint(id): Promise<EndpointRecord | null>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:36](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L36)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord) \| `null`\>

<a id="api-incrementfailures-1"></a>

##### incrementFailures()

```ts
incrementFailures(endpointId): Promise<number>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:51](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L51)

Atomically increments consecutive failures and returns the new value.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`number`\>

<a id="api-listendpoints-3"></a>

##### listEndpoints()

```ts
listEndpoints(tenantId?): Promise<EndpointRecord[]>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:37](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId?` | `string` |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord)[]\>

<a id="api-recovereligibleendpoints-1"></a>

##### recoverEligibleEndpoints()

```ts
recoverEligibleEndpoints(cooldownMinutes): Promise<number>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:55](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L55)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `cooldownMinutes` | `number` |

###### Returns

`Promise`\<`number`\>

number of endpoints recovered after cooldown.

<a id="api-resetfailures-1"></a>

##### resetFailures()

```ts
resetFailures(endpointId): Promise<void>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:49](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L49)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpointId` | `string` |

###### Returns

`Promise`\<`void`\>

<a id="api-rotatesecret-3"></a>

##### rotateSecret()

```ts
rotateSecret(id, input): Promise<EndpointRecord | null>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:39](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `input` | [`ResolvedRotateEndpointSecretInput`](#api-resolvedrotateendpointsecretinput) |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord) \| `null`\>

<a id="api-updateendpoint-3"></a>

##### updateEndpoint()

```ts
updateEndpoint(id, dto): Promise<EndpointRecord | null>;
```

Defined in: [src/ports/webhook-endpoint.repository.ts:38](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-endpoint.repository.ts#L38)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `dto` | [`UpdateEndpointDto`](#api-updateendpointdto) |

###### Returns

`Promise`\<[`EndpointRecord`](#api-endpointrecord) \| `null`\>

***

<a id="api-webhookeventrepository"></a>

### WebhookEventRepository

Defined in: [src/ports/webhook-event.repository.ts:9](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-event.repository.ts#L9)

#### Methods

<a id="api-saveevent-1"></a>

##### saveEvent()

```ts
saveEvent(
   eventType,
   payload,
tenantId): Promise<string>;
```

Defined in: [src/ports/webhook-event.repository.ts:10](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-event.repository.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventType` | `string` |
| `payload` | `Record`\<`string`, `unknown`\> |
| `tenantId` | `string` \| `null` |

###### Returns

`Promise`\<`string`\>

<a id="api-saveeventintransaction-1"></a>

##### saveEventInTransaction()

```ts
saveEventInTransaction(
   tx,
   eventType,
   payload,
tenantId): Promise<string>;
```

Defined in: [src/ports/webhook-event.repository.ts:17](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-event.repository.ts#L17)

Use only with a transaction object received from WebhookDeliveryRepository.runInTransaction().

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`WebhookTransaction`](#api-webhooktransaction) |
| `eventType` | `string` |
| `payload` | `Record`\<`string`, `unknown`\> |
| `tenantId` | `string` \| `null` |

###### Returns

`Promise`\<`string`\>

<a id="api-saveeventonceintransaction-1"></a>

##### saveEventOnceInTransaction()?

```ts
optional saveEventOnceInTransaction(
   tx,
   eventType,
   payload,
   tenantId,
options): Promise<SavedWebhookEvent>;
```

Defined in: [src/ports/webhook-event.repository.ts:24](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-event.repository.ts#L24)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`WebhookTransaction`](#api-webhooktransaction) |
| `eventType` | `string` |
| `payload` | `Record`\<`string`, `unknown`\> |
| `tenantId` | `string` \| `null` |
| `options` | `Required`\<`Pick`\<[`WebhookPublishOptions`](#api-webhookpublishoptions), `"idempotencyKey"`\>\> & `Pick`\<[`WebhookPublishOptions`](#api-webhookpublishoptions), `"correlationId"`\> |

###### Returns

`Promise`\<[`SavedWebhookEvent`](#api-savedwebhookevent)\>

***

<a id="api-webhookhttpclient"></a>

### WebhookHttpClient

Defined in: [src/ports/webhook-http-client.ts:11](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-http-client.ts#L11)

#### Methods

<a id="api-post-1"></a>

##### post()

```ts
post(
   url,
   headers,
   body,
   timeout,
options?): Promise<DeliveryResult>;
```

Defined in: [src/ports/webhook-http-client.ts:16](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-http-client.ts#L16)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | - |
| `headers` | `Record`\<`string`, `string`\> | - |
| `body` | `string` | - |
| `timeout` | `number` | milliseconds before the request is aborted. |
| `options?` | `WebhookHttpClientRequestOptions` | - |

###### Returns

`Promise`\<[`DeliveryResult`](#api-deliveryresult)\>

DeliveryResult with success false on timeout/network failure; implementations should not throw for HTTP failures.

***

<a id="api-webhookmoduleasyncoptions"></a>

### WebhookModuleAsyncOptions

Defined in: [src/interfaces/webhook-options.interface.ts:235](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L235)

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
optional inject?: (InjectionToken | OptionalFactoryDependency)[];
```

Defined in: [src/interfaces/webhook-options.interface.ts:237](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L237)

<a id="api-useclass"></a>

##### useClass?

```ts
optional useClass?: Type<WebhookOptionsFactory>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:238](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L238)

<a id="api-useexisting"></a>

##### useExisting?

```ts
optional useExisting?: Type<WebhookOptionsFactory>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:239](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L239)

<a id="api-usefactory"></a>

##### useFactory?

```ts
optional useFactory?: (...args) =>
  | WebhookModuleOptions<unknown>
| Promise<WebhookModuleOptions<unknown>>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:236](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L236)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`WebhookModuleOptions`](#api-webhookmoduleoptions)\<`unknown`\>
  \| `Promise`\<[`WebhookModuleOptions`](#api-webhookmoduleoptions)\<`unknown`\>\>

***

<a id="api-webhookmoduleoptions"></a>

### WebhookModuleOptions

Defined in: [src/interfaces/webhook-options.interface.ts:194](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L194)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TPrisma` | `unknown` |

#### Properties

<a id="api-allowprivateurls"></a>

##### allowPrivateUrls?

```ts
optional allowPrivateUrls?: boolean;
```

Defined in: [src/interfaces/webhook-options.interface.ts:203](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L203)

Allow private/internal URLs for endpoints. Only enable in development/testing. Default: false

<a id="api-circuitbreaker"></a>

##### circuitBreaker?

```ts
optional circuitBreaker?: CircuitBreakerOptions;
```

Defined in: [src/interfaces/webhook-options.interface.ts:198](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L198)

<a id="api-delivery"></a>

##### delivery?

```ts
optional delivery?: DeliveryOptions;
```

Defined in: [src/interfaces/webhook-options.interface.ts:197](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L197)

<a id="api-deliveryrepository"></a>

##### deliveryRepository?

```ts
optional deliveryRepository?: WebhookDeliveryRepository;
```

Defined in: [src/interfaces/webhook-options.interface.ts:207](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L207)

<a id="api-endpointrepository"></a>

##### endpointRepository?

```ts
optional endpointRepository?: WebhookEndpointRepository;
```

Defined in: [src/interfaces/webhook-options.interface.ts:206](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L206)

<a id="api-eventrepository"></a>

##### eventRepository?

```ts
optional eventRepository?: WebhookEventRepository;
```

Defined in: [src/interfaces/webhook-options.interface.ts:205](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L205)

Custom port overrides — provide these to replace default Prisma/fetch adapters.

<a id="api-httpclient"></a>

##### httpClient?

```ts
optional httpClient?: WebhookHttpClient;
```

Defined in: [src/interfaces/webhook-options.interface.ts:208](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L208)

<a id="api-ondeliveryfailed"></a>

##### onDeliveryFailed?

```ts
optional onDeliveryFailed?: (context) => void | Promise<void>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:217](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L217)

Called when a delivery exhausts retry attempts or receives a non-retryable response. Fire-and-forget — errors are logged, not propagated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`DeliveryFailedContext`](#api-deliveryfailedcontext) |

###### Returns

`void` \| `Promise`\<`void`\>

<a id="api-ondeliveryretryscheduled"></a>

##### onDeliveryRetryScheduled?

```ts
optional onDeliveryRetryScheduled?: (context) => void | Promise<void>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:220](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L220)

Called after a retriable failed attempt is persisted with a next attempt time. Fire-and-forget — errors are logged, not propagated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`DeliveryRetryScheduledContext`](#api-deliveryretryscheduledcontext) |

###### Returns

`void` \| `Promise`\<`void`\>

<a id="api-onendpointdegraded"></a>

##### onEndpointDegraded?

```ts
optional onEndpointDegraded?: (context) => void | Promise<void>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:225](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L225)

Called when consecutive failures reach the configured degraded threshold before endpoint disablement. Fire-and-forget — errors are logged, not propagated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`EndpointDegradedContext`](#api-endpointdegradedcontext) |

###### Returns

`void` \| `Promise`\<`void`\>

<a id="api-onendpointdisabled"></a>

##### onEndpointDisabled?

```ts
optional onEndpointDisabled?: (context) => void | Promise<void>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:228](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L228)

Called when the circuit breaker disables an endpoint. Fire-and-forget — errors are logged, not propagated.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`EndpointDisabledContext`](#api-endpointdisabledcontext) |

###### Returns

`void` \| `Promise`\<`void`\>

<a id="api-polling"></a>

##### polling?

```ts
optional polling?: PollingOptions;
```

Defined in: [src/interfaces/webhook-options.interface.ts:199](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L199)

<a id="api-prisma"></a>

##### prisma?

```ts
optional prisma?: TPrisma;
```

Defined in: [src/interfaces/webhook-options.interface.ts:196](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L196)

PrismaClient instance — used by default Prisma adapters. Not needed if all custom repositories are provided.

<a id="api-redaction"></a>

##### redaction?

```ts
optional redaction?: WebhookRedactionOptions;
```

Defined in: [src/interfaces/webhook-options.interface.ts:214](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L214)

Optional minimization hooks applied before webhook data is persisted.

<a id="api-retention"></a>

##### retention?

```ts
optional retention?: WebhookRetentionOptions;
```

Defined in: [src/interfaces/webhook-options.interface.ts:212](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L212)

Optional retention purge policy. Disabled when omitted.

<a id="api-secretvault"></a>

##### secretVault?

```ts
optional secretVault?: WebhookSecretVault;
```

Defined in: [src/interfaces/webhook-options.interface.ts:210](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L210)

Custom secret vault for encrypting/decrypting endpoint signing secrets at rest. Default: PlaintextSecretVault (no-op).

<a id="api-workerobserver"></a>

##### workerObserver?

```ts
optional workerObserver?: WebhookWorkerObserver;
```

Defined in: [src/interfaces/webhook-options.interface.ts:201](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L201)

Best-effort worker lifecycle and delivery metrics observer. Observer errors are logged and ignored.

***

<a id="api-webhookoptionsfactory"></a>

### WebhookOptionsFactory

Defined in: [src/interfaces/webhook-options.interface.ts:231](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L231)

#### Methods

<a id="api-createwebhookoptions"></a>

##### createWebhookOptions()

```ts
createWebhookOptions():
  | WebhookModuleOptions<unknown>
| Promise<WebhookModuleOptions<unknown>>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:232](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L232)

###### Returns

  \| [`WebhookModuleOptions`](#api-webhookmoduleoptions)\<`unknown`\>
  \| `Promise`\<[`WebhookModuleOptions`](#api-webhookmoduleoptions)\<`unknown`\>\>

***

<a id="api-webhookpollcontext"></a>

### WebhookPollContext

Defined in: [src/interfaces/webhook-options.interface.ts:75](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L75)

#### Properties

<a id="api-activedeliveries"></a>

##### activeDeliveries

```ts
activeDeliveries: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:81](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L81)

<a id="api-batchsize-1"></a>

##### batchSize

```ts
batchSize: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:76](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L76)

<a id="api-drainloopdelayms-1"></a>

##### drainLoopDelayMs

```ts
drainLoopDelayMs: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:80](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L80)

<a id="api-drainwhilebacklogged-1"></a>

##### drainWhileBacklogged

```ts
drainWhileBacklogged: boolean;
```

Defined in: [src/interfaces/webhook-options.interface.ts:78](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L78)

<a id="api-maxconcurrency-1"></a>

##### maxConcurrency

```ts
maxConcurrency: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:77](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L77)

<a id="api-maxdrainloopsperpoll-1"></a>

##### maxDrainLoopsPerPoll

```ts
maxDrainLoopsPerPoll: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:79](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L79)

***

<a id="api-webhookpollresult"></a>

### WebhookPollResult

Defined in: [src/interfaces/webhook-options.interface.ts:84](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L84)

#### Properties

<a id="api-claimed"></a>

##### claimed

```ts
claimed: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:85](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L85)

<a id="api-durationms"></a>

##### durationMs

```ts
durationMs: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:91](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L91)

<a id="api-enriched"></a>

##### enriched

```ts
enriched: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:86](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L86)

<a id="api-failed"></a>

##### failed

```ts
failed: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:88](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L88)

<a id="api-loops"></a>

##### loops

```ts
loops: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:92](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L92)

<a id="api-recoveredstale"></a>

##### recoveredStale

```ts
recoveredStale: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:90](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L90)

<a id="api-retried-1"></a>

##### retried

```ts
retried: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:89](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L89)

<a id="api-sent"></a>

##### sent

```ts
sent: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:87](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L87)

***

<a id="api-webhookpublishoptions"></a>

### WebhookPublishOptions

Defined in: [src/interfaces/webhook-options.interface.ts:23](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L23)

#### Properties

<a id="api-correlationid"></a>

##### correlationId?

```ts
optional correlationId?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:27](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L27)

Optional caller correlation ID stored with the event for diagnostics.

<a id="api-idempotencykey"></a>

##### idempotencyKey?

```ts
optional idempotencyKey?: string;
```

Defined in: [src/interfaces/webhook-options.interface.ts:25](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L25)

Application-provided key used to deduplicate publish attempts.

***

<a id="api-webhookredactionoptions"></a>

### WebhookRedactionOptions

Defined in: [src/interfaces/webhook-options.interface.ts:36](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L36)

#### Properties

<a id="api-sanitizepayload"></a>

##### sanitizePayload?

```ts
optional sanitizePayload?: (payload, context) => Record<string, unknown>;
```

Defined in: [src/interfaces/webhook-options.interface.ts:37](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `payload` | `Record`\<`string`, `unknown`\> |
| `context` | \{ `eventType`: `string`; `tenantId`: `string` \| `null`; \} |
| `context.eventType` | `string` |
| `context.tenantId` | `string` \| `null` |

###### Returns

`Record`\<`string`, `unknown`\>

<a id="api-sanitizeresponsebody"></a>

##### sanitizeResponseBody?

```ts
optional sanitizeResponseBody?: (body, context) => string | null;
```

Defined in: [src/interfaces/webhook-options.interface.ts:41](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L41)

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

<a id="api-webhookretentionoptions"></a>

### WebhookRetentionOptions

Defined in: [src/interfaces/webhook-options.interface.ts:30](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L30)

#### Properties

<a id="api-attemptresponsebodyretentiondays"></a>

##### attemptResponseBodyRetentionDays?

```ts
optional attemptResponseBodyRetentionDays?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:33](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L33)

<a id="api-deliveryresponsebodyretentiondays"></a>

##### deliveryResponseBodyRetentionDays?

```ts
optional deliveryResponseBodyRetentionDays?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:32](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L32)

<a id="api-eventpayloadretentiondays"></a>

##### eventPayloadRetentionDays?

```ts
optional eventPayloadRetentionDays?: number;
```

Defined in: [src/interfaces/webhook-options.interface.ts:31](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L31)

***

<a id="api-webhookretentionpurgeresult"></a>

### WebhookRetentionPurgeResult

Defined in: [src/interfaces/webhook-delivery.interface.ts:88](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L88)

#### Properties

<a id="api-attemptspurged"></a>

##### attemptsPurged

```ts
attemptsPurged: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:91](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L91)

<a id="api-deliveriespurged"></a>

##### deliveriesPurged

```ts
deliveriesPurged: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:90](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L90)

<a id="api-eventspurged"></a>

##### eventsPurged

```ts
eventsPurged: number;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:89](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L89)

***

<a id="api-webhooksecretvault"></a>

### WebhookSecretVault

Defined in: [src/ports/webhook-secret-vault.ts:7](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-secret-vault.ts#L7)

Port for encrypting/decrypting endpoint signing secrets at rest.
Implement this interface to provide custom encryption (e.g. AES-256-GCM).
The default PlaintextSecretVault passes values through unchanged.
Throws are propagated to callers; implementations should retry transient KMS/network failures internally.

#### Methods

<a id="api-decrypt-1"></a>

##### decrypt()

```ts
decrypt(encryptedSecret): Promise<string>;
```

Defined in: [src/ports/webhook-secret-vault.ts:9](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-secret-vault.ts#L9)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `encryptedSecret` | `string` |

###### Returns

`Promise`\<`string`\>

<a id="api-encrypt-1"></a>

##### encrypt()

```ts
encrypt(plainSecret): Promise<string>;
```

Defined in: [src/ports/webhook-secret-vault.ts:8](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-secret-vault.ts#L8)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `plainSecret` | `string` |

###### Returns

`Promise`\<`string`\>

***

<a id="api-webhookverificationoptions"></a>

### WebhookVerificationOptions

Defined in: [src/webhook.signer.ts:11](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.signer.ts#L11)

#### Properties

<a id="api-now"></a>

##### now?

```ts
optional now?: Date;
```

Defined in: [src/webhook.signer.ts:13](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.signer.ts#L13)

<a id="api-toleranceseconds"></a>

##### toleranceSeconds

```ts
toleranceSeconds: number;
```

Defined in: [src/webhook.signer.ts:12](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.signer.ts#L12)

***

<a id="api-webhookworkerobserver"></a>

### WebhookWorkerObserver

Defined in: [src/interfaces/webhook-options.interface.ts:115](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L115)

#### Methods

<a id="api-ondeliverycomplete"></a>

##### onDeliveryComplete()?

```ts
optional onDeliveryComplete(result): void;
```

Defined in: [src/interfaces/webhook-options.interface.ts:118](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L118)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `result` | [`WebhookDeliveryProcessingResult`](#api-webhookdeliveryprocessingresult) |

###### Returns

`void`

<a id="api-onpollcomplete"></a>

##### onPollComplete()?

```ts
optional onPollComplete(result): void;
```

Defined in: [src/interfaces/webhook-options.interface.ts:117](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L117)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `result` | [`WebhookPollResult`](#api-webhookpollresult) |

###### Returns

`void`

<a id="api-onpollerror"></a>

##### onPollError()?

```ts
optional onPollError(error): void;
```

Defined in: [src/interfaces/webhook-options.interface.ts:119](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L119)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`void`

<a id="api-onpollstart"></a>

##### onPollStart()?

```ts
optional onPollStart(context): void;
```

Defined in: [src/interfaces/webhook-options.interface.ts:116](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L116)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`WebhookPollContext`](#api-webhookpollcontext) |

###### Returns

`void`

## Type Aliases

<a id="api-deliveryattemptstatus"></a>

### DeliveryAttemptStatus

```ts
type DeliveryAttemptStatus = Exclude<DeliveryStatus, "SENDING">;
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:2](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L2)

***

<a id="api-deliveryfailurekind"></a>

### DeliveryFailureKind

```ts
type DeliveryFailureKind = "url_validation" | "dispatch_error" | "http_error";
```

Defined in: [src/interfaces/webhook-options.interface.ts:129](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L129)

Category of failure that caused the delivery to stop after retry exhaustion
or after a non-retryable receiver response.
- `url_validation`: SSRF defense rejected the URL (private/loopback/link-local/etc.)
- `dispatch_error`: dispatcher threw an exception (timeout, ECONNREFUSED, etc.)
- `http_error`: endpoint responded with a non-2xx status code

***

<a id="api-deliverystatus"></a>

### DeliveryStatus

```ts
type DeliveryStatus = "PENDING" | "SENDING" | "SENT" | "FAILED";
```

Defined in: [src/interfaces/webhook-delivery.interface.ts:1](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-delivery.interface.ts#L1)

***

<a id="api-endpointdisabledreason"></a>

### EndpointDisabledReason

```ts
type EndpointDisabledReason = typeof ENDPOINT_DISABLED_REASON_CONSECUTIVE_FAILURES_EXCEEDED;
```

Defined in: [src/webhook.constants.ts:28](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L28)

***

<a id="api-webhookdeliveryprocessingstatus"></a>

### WebhookDeliveryProcessingStatus

```ts
type WebhookDeliveryProcessingStatus = "sent" | "failed" | "retried";
```

Defined in: [src/interfaces/webhook-options.interface.ts:95](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/interfaces/webhook-options.interface.ts#L95)

***

<a id="api-webhooktransaction"></a>

### WebhookTransaction

```ts
type WebhookTransaction = {
  [webhookTransactionBrand]: "WebhookTransaction";
};
```

Defined in: [src/ports/webhook-delivery.repository.ts:18](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L18)

Opaque transaction token created by repository adapters.

#### Properties

<a id="api-webhooktransactionbrand"></a>

##### \[webhookTransactionBrand\]

```ts
readonly [webhookTransactionBrand]: "WebhookTransaction";
```

Defined in: [src/ports/webhook-delivery.repository.ts:19](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/ports/webhook-delivery.repository.ts#L19)

***

<a id="api-webhookurlvalidationreason"></a>

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

Defined in: [src/webhook.url-validator.ts:18](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.url-validator.ts#L18)

## Variables

<a id="api-default_backoff_schedule"></a>

### DEFAULT\_BACKOFF\_SCHEDULE

```ts
const DEFAULT_BACKOFF_SCHEDULE: readonly [30, 300, 1800, 7200, 86400];
```

Defined in: [src/webhook.constants.ts:12](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L12)

Svix/Stripe-style exponential backoff schedule (seconds)

***

<a id="api-default_circuit_breaker_cooldown_minutes"></a>

### DEFAULT\_CIRCUIT\_BREAKER\_COOLDOWN\_MINUTES

```ts
const DEFAULT_CIRCUIT_BREAKER_COOLDOWN_MINUTES: 60 = 60;
```

Defined in: [src/webhook.constants.ts:25](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L25)

***

<a id="api-default_circuit_breaker_threshold"></a>

### DEFAULT\_CIRCUIT\_BREAKER\_THRESHOLD

```ts
const DEFAULT_CIRCUIT_BREAKER_THRESHOLD: 5 = 5;
```

Defined in: [src/webhook.constants.ts:24](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L24)

***

<a id="api-default_delivery_timeout"></a>

### DEFAULT\_DELIVERY\_TIMEOUT

```ts
const DEFAULT_DELIVERY_TIMEOUT: 10000 = 10_000;
```

Defined in: [src/webhook.constants.ts:20](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L20)

***

<a id="api-default_max_retries"></a>

### DEFAULT\_MAX\_RETRIES

```ts
const DEFAULT_MAX_RETRIES: 5 = 5;
```

Defined in: [src/webhook.constants.ts:21](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L21)

***

<a id="api-default_polling_batch_size"></a>

### DEFAULT\_POLLING\_BATCH\_SIZE

```ts
const DEFAULT_POLLING_BATCH_SIZE: 50 = 50;
```

Defined in: [src/webhook.constants.ts:32](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L32)

***

<a id="api-default_polling_interval"></a>

### DEFAULT\_POLLING\_INTERVAL

```ts
const DEFAULT_POLLING_INTERVAL: 5000 = 5_000;
```

Defined in: [src/webhook.constants.ts:31](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L31)

***

<a id="api-default_stale_sending_minutes"></a>

### DEFAULT\_STALE\_SENDING\_MINUTES

```ts
const DEFAULT_STALE_SENDING_MINUTES: 5 = 5;
```

Defined in: [src/webhook.constants.ts:33](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L33)

***

<a id="api-endpoint_disabled_reason_consecutive_failures_exceeded"></a>

### ENDPOINT\_DISABLED\_REASON\_CONSECUTIVE\_FAILURES\_EXCEEDED

```ts
const ENDPOINT_DISABLED_REASON_CONSECUTIVE_FAILURES_EXCEEDED: "consecutive_failures_exceeded";
```

Defined in: [src/webhook.constants.ts:26](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L26)

***

<a id="api-webhook_delivery_repository"></a>

### WEBHOOK\_DELIVERY\_REPOSITORY

```ts
const WEBHOOK_DELIVERY_REPOSITORY: "WEBHOOK_DELIVERY_REPOSITORY" = 'WEBHOOK_DELIVERY_REPOSITORY';
```

Defined in: [src/webhook.constants.ts:5](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L5)

***

<a id="api-webhook_endpoint_repository"></a>

### WEBHOOK\_ENDPOINT\_REPOSITORY

```ts
const WEBHOOK_ENDPOINT_REPOSITORY: "WEBHOOK_ENDPOINT_REPOSITORY" = 'WEBHOOK_ENDPOINT_REPOSITORY';
```

Defined in: [src/webhook.constants.ts:4](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L4)

***

<a id="api-webhook_event_repository"></a>

### WEBHOOK\_EVENT\_REPOSITORY

```ts
const WEBHOOK_EVENT_REPOSITORY: "WEBHOOK_EVENT_REPOSITORY" = 'WEBHOOK_EVENT_REPOSITORY';
```

Defined in: [src/webhook.constants.ts:3](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L3)

***

<a id="api-webhook_http_client"></a>

### WEBHOOK\_HTTP\_CLIENT

```ts
const WEBHOOK_HTTP_CLIENT: "WEBHOOK_HTTP_CLIENT" = 'WEBHOOK_HTTP_CLIENT';
```

Defined in: [src/webhook.constants.ts:6](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L6)

***

<a id="api-webhook_module_options"></a>

### WEBHOOK\_MODULE\_OPTIONS

```ts
const WEBHOOK_MODULE_OPTIONS: "WEBHOOK_MODULE_OPTIONS" = 'WEBHOOK_MODULE_OPTIONS';
```

Defined in: [src/webhook.constants.ts:1](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L1)

***

<a id="api-webhook_secret_vault"></a>

### WEBHOOK\_SECRET\_VAULT

```ts
const WEBHOOK_SECRET_VAULT: "WEBHOOK_SECRET_VAULT" = 'WEBHOOK_SECRET_VAULT';
```

Defined in: [src/webhook.constants.ts:7](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.constants.ts#L7)

## Functions

<a id="api-resolveandvalidatehost"></a>

### resolveAndValidateHost()

```ts
function resolveAndValidateHost(hostname, url?): Promise<string[]>;
```

Defined in: [src/webhook.url-validator.ts:166](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.url-validator.ts#L166)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `hostname` | `string` |
| `url?` | `string` |

#### Returns

`Promise`\<`string`[]\>

***

<a id="api-validatewebhookurl"></a>

### validateWebhookUrl()

```ts
function validateWebhookUrl(url): Promise<void>;
```

Defined in: [src/webhook.url-validator.ts:79](https://github.com/nestarc/webhook/blob/60b27254ce870e5237e6cd2f7cb3cfd133001818/src/webhook.url-validator.ts#L79)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |

#### Returns

`Promise`\<`void`\>
