# @nestarc/jobs

## Classes

<a id="api-bullmqbackend"></a>

### BullMQBackend

Defined in: [src/backend/bullmq-backend.ts:118](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L118)

#### Implements

- [`JobsBackend`](#api-jobsbackend)

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new BullMQBackend(opts): BullMQBackend;
```

Defined in: [src/backend/bullmq-backend.ts:131](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L131)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`BullMQBackendOptions`](#api-bullmqbackendoptions) |

###### Returns

[`BullMQBackend`](#api-bullmqbackend)

#### Methods

<a id="api-ack"></a>

##### ack()

```ts
ack(_jobType?, _jobId?): Promise<void>;
```

Defined in: [src/backend/bullmq-backend.ts:429](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L429)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `_jobType?` | `string` |
| `_jobId?` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`ack`](#api-ack-2)

<a id="api-capabilities"></a>

##### capabilities()

```ts
capabilities(): BackendCapabilities;
```

Defined in: [src/backend/bullmq-backend.ts:142](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L142)

###### Returns

[`BackendCapabilities`](#api-backendcapabilities)

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`capabilities`](#api-capabilities-2)

<a id="api-close"></a>

##### close()

```ts
close(): Promise<void>;
```

Defined in: [src/backend/bullmq-backend.ts:560](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L560)

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`close`](#api-close-3)

<a id="api-enqueue"></a>

##### enqueue()

```ts
enqueue(
   jobType,
   envelope,
opts): Promise<string>;
```

Defined in: [src/backend/bullmq-backend.ts:163](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L163)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `envelope` | `Record`\<`string`, `unknown`\> |
| `opts` | [`EnqueueOptions`](#api-enqueueoptions) |

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`enqueue`](#api-enqueue-2)

<a id="api-enqueuedetailed"></a>

##### enqueueDetailed()

```ts
enqueueDetailed(
   jobType,
   envelope,
   opts,
onCommit?): Promise<EnqueueResult>;
```

Defined in: [src/backend/bullmq-backend.ts:171](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L171)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `envelope` | `Record`\<`string`, `unknown`\> |
| `opts` | [`EnqueueOptions`](#api-enqueueoptions) |
| `onCommit?` | [`EnqueueCommitObserver`](#api-enqueuecommitobserver) |

###### Returns

`Promise`\<[`EnqueueResult`](#api-enqueueresult)\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`enqueueDetailed`](#api-enqueuedetailed-2)

<a id="api-fail"></a>

##### fail()

```ts
fail(
   _jobType?,
   _jobId?,
_reason?): Promise<void>;
```

Defined in: [src/backend/bullmq-backend.ts:433](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L433)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `_jobType?` | `string` |
| `_jobId?` | `string` |
| `_reason?` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`fail`](#api-fail-2)

<a id="api-getjob"></a>

##### getJob()

```ts
getJob(jobId): Promise<JobRecord<unknown, unknown> | null>;
```

Defined in: [src/backend/bullmq-backend.ts:378](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L378)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\> \| `null`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`getJob`](#api-getjob-3)

<a id="api-getjobhistory"></a>

##### getJobHistory()

```ts
getJobHistory(_jobId): Promise<JobHistoryEntry[]>;
```

Defined in: [src/backend/bullmq-backend.ts:417](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L417)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `_jobId` | `string` |

###### Returns

`Promise`\<[`JobHistoryEntry`](#api-jobhistoryentry)[]\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`getJobHistory`](#api-getjobhistory-2)

<a id="api-getrawqueue"></a>

##### getRawQueue()

```ts
getRawQueue<TQueue>(jobType): TQueue;
```

Defined in: [src/backend/bullmq-backend.ts:572](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L572)

###### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TQueue` | [`BullMQRawQueue`](#api-bullmqrawqueue) |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |

###### Returns

`TQueue`

<a id="api-movetoactive"></a>

##### moveToActive()

```ts
moveToActive(_jobType?, _jobId?): Promise<JobEnvelope<unknown> | null>;
```

Defined in: [src/backend/bullmq-backend.ts:425](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L425)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `_jobType?` | `string` |
| `_jobId?` | `string` |

###### Returns

`Promise`\<[`JobEnvelope`](#api-jobenvelope)\<`unknown`\> \| `null`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`moveToActive`](#api-movetoactive-2)

<a id="api-peekwaiting"></a>

##### peekWaiting()

```ts
peekWaiting(_jobType?): Promise<JobEnvelope<unknown>[]>;
```

Defined in: [src/backend/bullmq-backend.ts:421](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L421)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `_jobType?` | `string` |

###### Returns

`Promise`\<[`JobEnvelope`](#api-jobenvelope)\<`unknown`\>[]\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`peekWaiting`](#api-peekwaiting-2)

<a id="api-pruneterminal"></a>

##### pruneTerminal()

```ts
pruneTerminal(options): Promise<number>;
```

Defined in: [src/backend/bullmq-backend.ts:480](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L480)

Offline maintenance: stop producers/admin writers first. Workers are paused and must be idle.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RetentionCleanupOptions`](#api-retentioncleanupoptions) |

###### Returns

`Promise`\<`number`\>

<a id="api-registerjobtypes"></a>

##### registerJobTypes()

```ts
registerJobTypes(jobTypes): void;
```

Defined in: [src/backend/bullmq-backend.ts:159](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L159)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobTypes` | `Iterable`\<`string`\> |

###### Returns

`void`

<a id="api-startconsumer"></a>

##### startConsumer()

```ts
startConsumer(jobTypes, consumer): void;
```

Defined in: [src/backend/bullmq-backend.ts:437](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L437)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobTypes` | `string`[] |
| `consumer` | [`BullMQConsumerOptions`](#api-bullmqconsumeroptions) |

###### Returns

`void`

***

<a id="api-fairworker"></a>

### FairWorker

Defined in: [src/fair-worker.ts:37](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L37)

#### Constructors

<a id="api-constructor-1"></a>

##### Constructor

```ts
new FairWorker(opts): FairWorker;
```

Defined in: [src/fair-worker.ts:54](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L54)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`FairWorkerOptions`](#api-fairworkeroptions) |

###### Returns

[`FairWorker`](#api-fairworker)

#### Methods

<a id="api-outstandingjobids"></a>

##### outstandingJobIds()

```ts
outstandingJobIds(): string[];
```

Defined in: [src/fair-worker.ts:46](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L46)

###### Returns

`string`[]

<a id="api-pendingrecoveryjobids"></a>

##### pendingRecoveryJobIds()

```ts
pendingRecoveryJobIds(): string[];
```

Defined in: [src/fair-worker.ts:42](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L42)

###### Returns

`string`[]

<a id="api-tick"></a>

##### tick()

```ts
tick(): Promise<boolean>;
```

Defined in: [src/fair-worker.ts:63](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L63)

###### Returns

`Promise`\<`boolean`\>

<a id="api-waitforidle"></a>

##### waitForIdle()

```ts
waitForIdle(): Promise<void>;
```

Defined in: [src/fair-worker.ts:50](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L50)

###### Returns

`Promise`\<`void`\>

***

<a id="api-fakeclock"></a>

### FakeClock

Defined in: [src/fake-clock.ts:1](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-clock.ts#L1)

#### Constructors

<a id="api-constructor-2"></a>

##### Constructor

```ts
new FakeClock(now?): FakeClock;
```

Defined in: [src/fake-clock.ts:4](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-clock.ts#L4)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `now` | `string` \| `number` \| `Date` |

###### Returns

[`FakeClock`](#api-fakeclock)

#### Methods

<a id="api-advanceby"></a>

##### advanceBy()

```ts
advanceBy(ms): Date;
```

Defined in: [src/fake-clock.ts:12](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-clock.ts#L12)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ms` | `number` |

###### Returns

`Date`

<a id="api-now"></a>

##### now()

```ts
now(): Date;
```

Defined in: [src/fake-clock.ts:8](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-clock.ts#L8)

###### Returns

`Date`

<a id="api-set"></a>

##### set()

```ts
set(next): Date;
```

Defined in: [src/fake-clock.ts:17](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-clock.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `next` | `string` \| `number` \| `Date` |

###### Returns

`Date`

***

<a id="api-fakejobsservice"></a>

### FakeJobsService

Defined in: [src/fake-jobs.service.ts:20](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L20)

#### Constructors

<a id="api-constructor-3"></a>

##### Constructor

```ts
new FakeJobsService(opts): FakeJobsService;
```

Defined in: [src/fake-jobs.service.ts:28](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L28)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`FakeJobsOptions`](#api-fakejobsoptions) |

###### Returns

[`FakeJobsService`](#api-fakejobsservice)

#### Properties

<a id="api-backend-2"></a>

##### backend

```ts
readonly backend: InMemoryBackend;
```

Defined in: [src/fake-jobs.service.ts:24](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L24)

<a id="api-clock"></a>

##### clock

```ts
readonly clock: FakeClock;
```

Defined in: [src/fake-jobs.service.ts:23](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L23)

<a id="api-registry-2"></a>

##### registry

```ts
readonly registry: HandlerRegistry;
```

Defined in: [src/fake-jobs.service.ts:22](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L22)

<a id="api-schedulers"></a>

##### schedulers

```ts
readonly schedulers: Map<string, Scheduler>;
```

Defined in: [src/fake-jobs.service.ts:25](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L25)

<a id="api-service"></a>

##### service

```ts
readonly service: JobsService;
```

Defined in: [src/fake-jobs.service.ts:21](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L21)

#### Methods

<a id="api-drain"></a>

##### drain()

```ts
drain(maxIterations?): Promise<void>;
```

Defined in: [src/fake-jobs.service.ts:61](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L61)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `maxIterations` | `number` | `1000` |

###### Returns

`Promise`\<`void`\>

<a id="api-drainuntilidle"></a>

##### drainUntilIdle()

```ts
drainUntilIdle(maxIterations?): Promise<void>;
```

Defined in: [src/fake-jobs.service.ts:65](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L65)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `maxIterations` | `number` | `1000` |

###### Returns

`Promise`\<`void`\>

***

<a id="api-handlerregistry"></a>

### HandlerRegistry

Defined in: [src/handler-registry.ts:6](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/handler-registry.ts#L6)

#### Constructors

<a id="api-constructor-4"></a>

##### Constructor

```ts
new HandlerRegistry(): HandlerRegistry;
```

###### Returns

[`HandlerRegistry`](#api-handlerregistry)

#### Methods

<a id="api-invoke"></a>

##### invoke()

```ts
invoke(
   jobType,
   payload,
context): Promise<unknown>;
```

Defined in: [src/handler-registry.ts:16](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/handler-registry.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `payload` | `Record`\<`string`, `unknown`\> |
| `context` | [`JobContext`](#api-jobcontext) |

###### Returns

`Promise`\<`unknown`\>

<a id="api-list"></a>

##### list()

```ts
list(): string[];
```

Defined in: [src/handler-registry.ts:26](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/handler-registry.ts#L26)

###### Returns

`string`[]

<a id="api-register"></a>

##### register()

```ts
register(jobType, handler): void;
```

Defined in: [src/handler-registry.ts:9](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/handler-registry.ts#L9)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `handler` | [`HandlerFn`](#api-handlerfn) |

###### Returns

`void`

***

<a id="api-inmemorybackend"></a>

### InMemoryBackend

Defined in: [src/backend/in-memory-backend.ts:58](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L58)

#### Implements

- [`JobsBackend`](#api-jobsbackend)

#### Constructors

<a id="api-constructor-5"></a>

##### Constructor

```ts
new InMemoryBackend(opts?): InMemoryBackend;
```

Defined in: [src/backend/in-memory-backend.ts:67](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L67)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`InMemoryBackendOptions`](#api-inmemorybackendoptions) |

###### Returns

[`InMemoryBackend`](#api-inmemorybackend)

#### Accessors

<a id="api-lifecyclestate"></a>

##### lifecycleState

###### Get Signature

```ts
get lifecycleState(): "open" | "closing" | "closed";
```

Defined in: [src/backend/in-memory-backend.ts:425](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L425)

###### Returns

`"open"` \| `"closing"` \| `"closed"`

#### Methods

<a id="api-ack-1"></a>

##### ack()

```ts
ack(
   jobType,
   jobId,
activationId): Promise<JobRecord<unknown, unknown>>;
```

Defined in: [src/backend/in-memory-backend.ts:207](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L207)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `jobId` | `string` |
| `activationId` | `string` |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\>\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`ack`](#api-ack-2)

<a id="api-beginclose"></a>

##### beginClose()

```ts
beginClose(): void;
```

Defined in: [src/backend/in-memory-backend.ts:429](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L429)

###### Returns

`void`

<a id="api-capabilities-1"></a>

##### capabilities()

```ts
capabilities(): BackendCapabilities;
```

Defined in: [src/backend/in-memory-backend.ts:72](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L72)

###### Returns

[`BackendCapabilities`](#api-backendcapabilities)

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`capabilities`](#api-capabilities-2)

<a id="api-close-2"></a>

##### close()

```ts
close(): Promise<void>;
```

Defined in: [src/backend/in-memory-backend.ts:443](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L443)

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`close`](#api-close-3)

<a id="api-discarddeadletter"></a>

##### discardDeadLetter()

```ts
discardDeadLetter(jobId, reason?): Promise<void | JobRecord<unknown, unknown>>;
```

Defined in: [src/backend/in-memory-backend.ts:376](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L376)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `jobId` | `string` | `undefined` |
| `reason` | `string` | `'discarded'` |

###### Returns

`Promise`\<`void` \| [`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\>\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`discardDeadLetter`](#api-discarddeadletter-1)

<a id="api-enqueue-1"></a>

##### enqueue()

```ts
enqueue(
   jobType,
   envelope,
opts): Promise<string>;
```

Defined in: [src/backend/in-memory-backend.ts:90](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L90)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `envelope` | `Record`\<`string`, `unknown`\> |
| `opts` | [`EnqueueOptions`](#api-enqueueoptions) |

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`enqueue`](#api-enqueue-2)

<a id="api-enqueuedetailed-1"></a>

##### enqueueDetailed()

```ts
enqueueDetailed(
   jobType,
   envelope,
   opts,
onCommit?): Promise<EnqueueResult>;
```

Defined in: [src/backend/in-memory-backend.ts:98](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L98)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `envelope` | `Record`\<`string`, `unknown`\> |
| `opts` | [`EnqueueOptions`](#api-enqueueoptions) |
| `onCommit?` | [`EnqueueCommitObserver`](#api-enqueuecommitobserver) |

###### Returns

`Promise`\<[`EnqueueResult`](#api-enqueueresult)\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`enqueueDetailed`](#api-enqueuedetailed-2)

<a id="api-fail-1"></a>

##### fail()

```ts
fail(
   jobType,
   jobId,
   reason,
activationId): Promise<void | JobRecord<unknown, unknown>>;
```

Defined in: [src/backend/in-memory-backend.ts:222](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L222)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `jobId` | `string` |
| `reason` | `string` |
| `activationId` | `string` |

###### Returns

`Promise`\<`void` \| [`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\>\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`fail`](#api-fail-2)

<a id="api-getjob-2"></a>

##### getJob()

```ts
getJob(jobId): Promise<JobRecord<unknown, unknown> | null>;
```

Defined in: [src/backend/in-memory-backend.ts:286](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L286)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\> \| `null`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`getJob`](#api-getjob-3)

<a id="api-getjobhistory-1"></a>

##### getJobHistory()

```ts
getJobHistory(jobId): Promise<JobHistoryEntry[]>;
```

Defined in: [src/backend/in-memory-backend.ts:291](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L291)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`Promise`\<[`JobHistoryEntry`](#api-jobhistoryentry)[]\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`getJobHistory`](#api-getjobhistory-2)

<a id="api-listdeadletters"></a>

##### listDeadLetters()

```ts
listDeadLetters(filter?): Promise<JobRecord<unknown, unknown>[]>;
```

Defined in: [src/backend/in-memory-backend.ts:295](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L295)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filter` | [`DeadLetterFilter`](#api-deadletterfilter) |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\>[]\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`listDeadLetters`](#api-listdeadletters-1)

<a id="api-markcancelled"></a>

##### markCancelled()

```ts
markCancelled(
   jobType,
   jobId,
reason?): Promise<JobRecord<unknown, unknown> | null>;
```

Defined in: [src/backend/in-memory-backend.ts:267](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L267)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `jobType` | `string` | `undefined` |
| `jobId` | `string` | `undefined` |
| `reason` | `string` | `'cancelled'` |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\> \| `null`\>

<a id="api-markfailed"></a>

##### markFailed()

```ts
markFailed(
   jobType,
   jobId,
   reason,
   activationId,
error?): Promise<JobRecord<unknown, unknown> | null>;
```

Defined in: [src/backend/in-memory-backend.ts:232](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L232)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `jobId` | `string` |
| `reason` | `string` |
| `activationId` | `string` |
| `error?` | [`JobErrorSummary`](#api-joberrorsummary) |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\> \| `null`\>

<a id="api-movetoactive-1"></a>

##### moveToActive()

```ts
moveToActive(
   jobType,
   jobId,
activationId?): Promise<JobEnvelope<unknown> | null>;
```

Defined in: [src/backend/in-memory-backend.ts:187](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L187)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `jobId` | `string` |
| `activationId?` | `string` |

###### Returns

`Promise`\<[`JobEnvelope`](#api-jobenvelope)\<`unknown`\> \| `null`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`moveToActive`](#api-movetoactive-2)

<a id="api-peekwaiting-1"></a>

##### peekWaiting()

```ts
peekWaiting(jobType): Promise<JobEnvelope<unknown>[]>;
```

Defined in: [src/backend/in-memory-backend.ts:181](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L181)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |

###### Returns

`Promise`\<[`JobEnvelope`](#api-jobenvelope)\<`unknown`\>[]\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`peekWaiting`](#api-peekwaiting-2)

<a id="api-pendingjobids"></a>

##### pendingJobIds()

```ts
pendingJobIds(): string[];
```

Defined in: [src/backend/in-memory-backend.ts:433](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L433)

###### Returns

`string`[]

<a id="api-pruneterminal-1"></a>

##### pruneTerminal()

```ts
pruneTerminal(options): Promise<number>;
```

Defined in: [src/backend/in-memory-backend.ts:390](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L390)

Run during a quiescent maintenance window. Young terminal identities are never evicted.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RetentionCleanupOptions`](#api-retentioncleanupoptions) |

###### Returns

`Promise`\<`number`\>

<a id="api-replaydeadletter"></a>

##### replayDeadLetter()

```ts
replayDeadLetter(jobId, options?): Promise<string>;
```

Defined in: [src/backend/in-memory-backend.ts:310](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L310)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |
| `options` | [`ReplayOptions`](#api-replayoptions) |

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`replayDeadLetter`](#api-replaydeadletter-1)

***

<a id="api-jobserror"></a>

### JobsError

Defined in: [src/errors.ts:18](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L18)

#### Extends

- `Error`

#### Extended by

- [`JobsShutdownError`](#api-jobsshutdownerror)

#### Constructors

<a id="api-constructor-6"></a>

##### Constructor

```ts
new JobsError(code, reason?): JobsError;
```

Defined in: [src/errors.ts:21](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L21)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | [`JobsErrorCode`](#api-jobserrorcode-2) |
| `reason?` | `string` |

###### Returns

[`JobsError`](#api-jobserror)

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

<a id="api-code-1"></a>

##### code

```ts
readonly code: JobsErrorCode;
```

Defined in: [src/errors.ts:19](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L19)

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

<a id="api-jobsmodule"></a>

### JobsModule

Defined in: [src/jobs.module.ts:391](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L391)

#### Constructors

<a id="api-constructor-7"></a>

##### Constructor

```ts
new JobsModule(): JobsModule;
```

###### Returns

[`JobsModule`](#api-jobsmodule)

#### Methods

<a id="api-forbullmq"></a>

##### forBullMQ()

```ts
static forBullMQ(options): DynamicModule;
```

Defined in: [src/jobs.module.ts:493](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L493)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`BullMQOptions`](#api-bullmqoptions) |

###### Returns

`DynamicModule`

<a id="api-forinmemory"></a>

##### forInMemory()

```ts
static forInMemory(options): DynamicModule;
```

Defined in: [src/jobs.module.ts:392](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L392)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`InMemoryOptions`](#api-inmemoryoptions) |

###### Returns

`DynamicModule`

***

<a id="api-jobsoutboxbridge"></a>

### ~~JobsOutboxBridge~~

Defined in: [src/outbox/outbox-bridge.module.ts:21](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-bridge.module.ts#L21)

#### Deprecated

Compatibility-only bridge without source identity/lineage. Use createOutboxJobsPublisher for first-party Outbox.

#### Constructors

<a id="api-constructor-8"></a>

##### Constructor

```ts
new JobsOutboxBridge(opts): JobsOutboxBridge;
```

Defined in: [src/outbox/outbox-bridge.module.ts:22](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-bridge.module.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`JobsOutboxBridgeOptions`](#api-jobsoutboxbridgeoptions) |

###### Returns

[`JobsOutboxBridge`](#api-jobsoutboxbridge)

***

<a id="api-jobsservice"></a>

### JobsService

Defined in: [src/jobs.service.ts:37](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L37)

#### Constructors

<a id="api-constructor-9"></a>

##### Constructor

```ts
new JobsService(deps): JobsService;
```

Defined in: [src/jobs.service.ts:41](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L41)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deps` | [`JobsServiceDeps`](#api-jobsservicedeps) |

###### Returns

[`JobsService`](#api-jobsservice)

#### Methods

<a id="api-capabilities-3"></a>

##### capabilities()

```ts
capabilities(): BackendCapabilities;
```

Defined in: [src/jobs.service.ts:124](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L124)

###### Returns

[`BackendCapabilities`](#api-backendcapabilities)

<a id="api-discarddeadletter-2"></a>

##### discardDeadLetter()

```ts
discardDeadLetter(jobId, reason?): Promise<void>;
```

Defined in: [src/jobs.service.ts:248](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L248)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |
| `reason?` | `string` |

###### Returns

`Promise`\<`void`\>

<a id="api-enqueue-3"></a>

##### enqueue()

```ts
enqueue(
   jobType,
   payload,
opts?): Promise<string>;
```

Defined in: [src/jobs.service.ts:48](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L48)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `payload` | `object` |
| `opts` | [`EnqueueOptions`](#api-enqueueoptions)\<`object`, `object`\> |

###### Returns

`Promise`\<`string`\>

<a id="api-enqueuedetailed-3"></a>

##### enqueueDetailed()

```ts
enqueueDetailed(
   jobType,
   payload,
opts?): Promise<EnqueueResult>;
```

Defined in: [src/jobs.service.ts:56](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L56)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `payload` | `object` |
| `opts` | [`EnqueueOptions`](#api-enqueueoptions)\<`object`, `object`\> |

###### Returns

`Promise`\<[`EnqueueResult`](#api-enqueueresult)\>

<a id="api-getjob-4"></a>

##### getJob()

```ts
getJob<TPayload, TContext>(jobId): Promise<JobRecord<TPayload, TContext> | null>;
```

Defined in: [src/jobs.service.ts:137](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L137)

###### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TPayload` | `unknown` |
| `TContext` | `unknown` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`TPayload`, `TContext`\> \| `null`\>

<a id="api-getjobfortenant"></a>

##### getJobForTenant()

```ts
getJobForTenant(jobId, expectedTenantId): Promise<JobRecord<unknown, unknown> | null>;
```

Defined in: [src/jobs.service.ts:129](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L129)

Authorization remains the caller's responsibility; mismatches look like missing IDs.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |
| `expectedTenantId` | `string` |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\> \| `null`\>

<a id="api-getjobhistory-3"></a>

##### getJobHistory()

```ts
getJobHistory(jobId): Promise<JobHistoryEntry[]>;
```

Defined in: [src/jobs.service.ts:143](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L143)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`Promise`\<[`JobHistoryEntry`](#api-jobhistoryentry)[]\>

<a id="api-listdeadletters-2"></a>

##### listDeadLetters()

```ts
listDeadLetters(filter?): Promise<JobRecord<unknown, unknown>[]>;
```

Defined in: [src/jobs.service.ts:148](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L148)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filter?` | [`DeadLetterFilter`](#api-deadletterfilter) |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\>[]\>

<a id="api-replaydeadletter-2"></a>

##### replayDeadLetter()

```ts
replayDeadLetter(jobId, options?): Promise<string>;
```

Defined in: [src/jobs.service.ts:156](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L156)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |
| `options?` | [`ReplayOptions`](#api-replayoptions) |

###### Returns

`Promise`\<`string`\>

<a id="api-scheduler-1"></a>

##### scheduler()

```ts
scheduler(jobType): Scheduler;
```

Defined in: [src/jobs.service.ts:273](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L273)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |

###### Returns

[`Scheduler`](#api-scheduler-2)

<a id="api-settenantweight"></a>

##### setTenantWeight()

```ts
setTenantWeight(
   jobType,
   tenantId,
   weight): void;
```

Defined in: [src/jobs.service.ts:269](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L269)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `tenantId` | `string` \| `undefined` |
| `weight` | `number` |

###### Returns

`void`

***

<a id="api-jobsshutdownerror"></a>

### JobsShutdownError

Defined in: [src/errors.ts:29](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L29)

Shutdown did not complete; admission remains closed and records are retained.

#### Extends

- [`JobsError`](#api-jobserror)

#### Constructors

<a id="api-constructor-10"></a>

##### Constructor

```ts
new JobsShutdownError(
   reason,
   jobIds,
   cause?): JobsShutdownError;
```

Defined in: [src/errors.ts:33](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L33)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `reason` | `"deadline"` \| `"pending_jobs"` \| `"worker_error"` |
| `jobIds` | readonly `string`[] |
| `cause?` | `unknown` |

###### Returns

[`JobsShutdownError`](#api-jobsshutdownerror)

###### Overrides

[`JobsError`](#api-jobserror).[`constructor`](#api-constructor-6)

#### Properties

<a id="api-cause-1"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`JobsError`](#api-jobserror).[`cause`](#api-cause)

<a id="api-code-2"></a>

##### code

```ts
readonly code: JobsErrorCode;
```

Defined in: [src/errors.ts:19](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L19)

###### Inherited from

[`JobsError`](#api-jobserror).[`code`](#api-code-1)

<a id="api-message-2"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`JobsError`](#api-jobserror).[`message`](#api-message-1)

<a id="api-name-2"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`JobsError`](#api-jobserror).[`name`](#api-name-1)

<a id="api-reason-2"></a>

##### reason

```ts
readonly reason: "deadline" | "pending_jobs" | "worker_error";
```

Defined in: [src/errors.ts:34](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L34)

<a id="api-remainingcount"></a>

##### remainingCount

```ts
readonly remainingCount: number;
```

Defined in: [src/errors.ts:31](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L31)

<a id="api-remainingjobids"></a>

##### remainingJobIds

```ts
readonly remainingJobIds: readonly string[];
```

Defined in: [src/errors.ts:30](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L30)

<a id="api-stack-1"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`JobsError`](#api-jobserror).[`stack`](#api-stack)

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

[`JobsError`](#api-jobserror).[`stackTraceLimit`](#api-stacktracelimit)

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

[`JobsError`](#api-jobserror).[`captureStackTrace`](#api-capturestacktrace)

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

[`JobsError`](#api-jobserror).[`prepareStackTrace`](#api-preparestacktrace)

***

<a id="api-scheduler-2"></a>

### Scheduler

Defined in: [src/scheduler.ts:41](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L41)

#### Constructors

<a id="api-constructor-11"></a>

##### Constructor

```ts
new Scheduler(opts): Scheduler;
```

Defined in: [src/scheduler.ts:52](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L52)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`SchedulerOptions`](#api-scheduleroptions) |

###### Returns

[`Scheduler`](#api-scheduler-2)

#### Methods

<a id="api-hasreadyjobs"></a>

##### hasReadyJobs()

```ts
hasReadyJobs(): boolean;
```

Defined in: [src/scheduler.ts:117](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L117)

###### Returns

`boolean`

<a id="api-onack"></a>

##### onAck()

```ts
onAck(jobId): void;
```

Defined in: [src/scheduler.ts:106](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L106)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`void`

<a id="api-onenqueue"></a>

##### onEnqueue()

```ts
onEnqueue(
   jobId,
   tenantId,
   timing?): void;
```

Defined in: [src/scheduler.ts:84](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L84)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |
| `tenantId` | `string` \| `undefined` |
| `timing?` | [`SchedulerEnqueueTiming`](#api-schedulerenqueuetiming) |

###### Returns

`void`

<a id="api-picknext"></a>

##### pickNext()

```ts
pickNext(): PickedJob | null;
```

Defined in: [src/scheduler.ts:127](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L127)

###### Returns

[`PickedJob`](#api-pickedjob) \| `null`

<a id="api-setweight"></a>

##### setWeight()

```ts
setWeight(tenantId, weight): void;
```

Defined in: [src/scheduler.ts:71](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L71)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` \| `undefined` |
| `weight` | `number` |

###### Returns

`void`

<a id="api-snapshot"></a>

##### snapshot()

```ts
snapshot(): {
  inflight: number;
  starvationTokens: number;
  tenantId: string | undefined;
  waiting: number;
  weight: number;
}[];
```

Defined in: [src/scheduler.ts:160](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L160)

###### Returns

\{
  `inflight`: `number`;
  `starvationTokens`: `number`;
  `tenantId`: `string` \| `undefined`;
  `waiting`: `number`;
  `weight`: `number`;
\}[]

## Interfaces

<a id="api-backendcapabilities"></a>

### BackendCapabilities

Defined in: [src/lifecycle.ts:48](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L48)

#### Properties

<a id="api-activationfencing"></a>

##### activationFencing?

```ts
optional activationFencing?: boolean;
```

Defined in: [src/lifecycle.ts:62](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L62)

Required by FairWorker: completion is fenced by an opaque activation token.

<a id="api-backoff"></a>

##### backoff

```ts
backoff: boolean;
```

Defined in: [src/lifecycle.ts:53](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L53)

<a id="api-deadletter"></a>

##### deadLetter

```ts
deadLetter: boolean;
```

Defined in: [src/lifecycle.ts:58](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L58)

<a id="api-delayed"></a>

##### delayed

```ts
delayed: boolean;
```

Defined in: [src/lifecycle.ts:51](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L51)

<a id="api-distributed"></a>

##### distributed

```ts
distributed: boolean;
```

Defined in: [src/lifecycle.ts:50](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L50)

<a id="api-durable"></a>

##### durable

```ts
durable: boolean;
```

Defined in: [src/lifecycle.ts:49](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L49)

<a id="api-fairness"></a>

##### fairness

```ts
fairness: "none" | "local-tenant";
```

Defined in: [src/lifecycle.ts:59](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L59)

<a id="api-history"></a>

##### history

```ts
history: boolean;
```

Defined in: [src/lifecycle.ts:56](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L56)

<a id="api-idempotency"></a>

##### idempotency

```ts
idempotency: boolean;
```

Defined in: [src/lifecycle.ts:57](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L57)

<a id="api-manualdrain"></a>

##### manualDrain

```ts
manualDrain: boolean;
```

Defined in: [src/lifecycle.ts:60](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L60)

<a id="api-retries"></a>

##### retries

```ts
retries: boolean;
```

Defined in: [src/lifecycle.ts:52](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L52)

<a id="api-statusquery"></a>

##### statusQuery

```ts
statusQuery: boolean;
```

Defined in: [src/lifecycle.ts:55](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L55)

<a id="api-timeout"></a>

##### timeout

```ts
timeout: boolean;
```

Defined in: [src/lifecycle.ts:54](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L54)

***

<a id="api-bullmqbackendoptions"></a>

### BullMQBackendOptions

Defined in: [src/backend/bullmq-backend.ts:95](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L95)

#### Properties

<a id="api-connection"></a>

##### connection

```ts
connection: object;
```

Defined in: [src/backend/bullmq-backend.ts:99](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L99)

BullMQ/ioredis connection object. Kept structural so BullMQ remains an optional peer.

<a id="api-namespace"></a>

##### namespace?

```ts
optional namespace?: string;
```

Defined in: [src/backend/bullmq-backend.ts:97](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L97)

<a id="api-retention"></a>

##### retention?

```ts
optional retention?: RetentionOptions;
```

Defined in: [src/backend/bullmq-backend.ts:96](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L96)

<a id="api-workerconcurrency"></a>

##### workerConcurrency?

```ts
optional workerConcurrency?: number;
```

Defined in: [src/backend/bullmq-backend.ts:100](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L100)

***

<a id="api-bullmqconsumeroptions"></a>

### BullMQConsumerOptions

Defined in: [src/backend/bullmq-backend.ts:109](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L109)

#### Properties

<a id="api-contextrunner"></a>

##### contextRunner

```ts
contextRunner: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/backend/bullmq-backend.ts:111](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L111)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`JobContext`](#api-jobcontext) |
| `fn` | () => `Promise`\<`unknown`\> |

###### Returns

`Promise`\<`unknown`\>

<a id="api-events"></a>

##### events?

```ts
optional events?: JobEventsOptions;
```

Defined in: [src/backend/bullmq-backend.ts:115](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L115)

<a id="api-onfail"></a>

##### onFail?

```ts
optional onFail?: (e, err) => void;
```

Defined in: [src/backend/bullmq-backend.ts:114](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L114)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#api-jobevent) |
| `err` | `Error` |

###### Returns

`void`

<a id="api-onfinish"></a>

##### onFinish?

```ts
optional onFinish?: (e) => void;
```

Defined in: [src/backend/bullmq-backend.ts:113](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L113)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#api-jobevent) |

###### Returns

`void`

<a id="api-onstart"></a>

##### onStart?

```ts
optional onStart?: (e) => void;
```

Defined in: [src/backend/bullmq-backend.ts:112](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L112)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#api-jobevent) |

###### Returns

`void`

<a id="api-registry"></a>

##### registry

```ts
registry: HandlerRegistry;
```

Defined in: [src/backend/bullmq-backend.ts:110](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L110)

***

<a id="api-bullmqoptions"></a>

### BullMQOptions

Defined in: [src/jobs.module.ts:268](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L268)

#### Properties

<a id="api-backend"></a>

##### backend

```ts
backend: BullMQBackend;
```

Defined in: [src/jobs.module.ts:273](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L273)

<a id="api-contextextractor"></a>

##### contextExtractor?

```ts
optional contextExtractor?: () => JobContext;
```

Defined in: [src/jobs.module.ts:279](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L279)

###### Returns

[`JobContext`](#api-jobcontext)

<a id="api-contextrunner-1"></a>

##### contextRunner?

```ts
optional contextRunner?: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/jobs.module.ts:280](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L280)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`JobContext`](#api-jobcontext) |
| `fn` | () => `Promise`\<`unknown`\> |

###### Returns

`Promise`\<`unknown`\>

<a id="api-dynamicregistration"></a>

##### dynamicRegistration?

```ts
optional dynamicRegistration?: boolean;
```

Defined in: [src/jobs.module.ts:272](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L272)

Opt out of bootstrap handler checks when registration is intentionally deferred.

<a id="api-events-1"></a>

##### events?

```ts
optional events?: JobEventsOptions;
```

Defined in: [src/jobs.module.ts:278](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L278)

<a id="api-global"></a>

##### global?

```ts
optional global?: boolean;
```

Defined in: [src/jobs.module.ts:276](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L276)

<a id="api-jobs"></a>

##### jobs?

```ts
optional jobs?: JobDefinitions;
```

Defined in: [src/jobs.module.ts:275](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L275)

<a id="api-jobtypes"></a>

##### jobTypes

```ts
jobTypes: string[];
```

Defined in: [src/jobs.module.ts:274](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L274)

<a id="api-onjobfail"></a>

##### onJobFail?

```ts
optional onJobFail?: (e, err) => void;
```

Defined in: [src/jobs.module.ts:283](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L283)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#api-jobevent) |
| `err` | `Error` |

###### Returns

`void`

<a id="api-onjobfinish"></a>

##### onJobFinish?

```ts
optional onJobFinish?: (e) => void;
```

Defined in: [src/jobs.module.ts:282](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L282)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#api-jobevent) |

###### Returns

`void`

<a id="api-onjobstart"></a>

##### onJobStart?

```ts
optional onJobStart?: (e) => void;
```

Defined in: [src/jobs.module.ts:281](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L281)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#api-jobevent) |

###### Returns

`void`

<a id="api-role"></a>

##### role?

```ts
optional role?: "producer" | "worker" | "both";
```

Defined in: [src/jobs.module.ts:270](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L270)

Default both. Worker role rejects JobsService enqueue. Producer never consumes.

<a id="api-strictcapabilities"></a>

##### strictCapabilities?

```ts
optional strictCapabilities?: boolean;
```

Defined in: [src/jobs.module.ts:277](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L277)

***

<a id="api-bullmqrawqueue"></a>

### BullMQRawQueue

Defined in: [src/backend/bullmq-backend.ts:103](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L103)

#### Methods

<a id="api-add"></a>

##### add()

```ts
add(
   name,
   data,
   options?): Promise<{
  id?: string | number;
}>;
```

Defined in: [src/backend/bullmq-backend.ts:104](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L104)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `data` | `unknown` |
| `options?` | `unknown` |

###### Returns

`Promise`\<\{
  `id?`: `string` \| `number`;
\}\>

<a id="api-close-1"></a>

##### close()

```ts
close(): Promise<void>;
```

Defined in: [src/backend/bullmq-backend.ts:106](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L106)

###### Returns

`Promise`\<`void`\>

<a id="api-getjob-1"></a>

##### getJob()

```ts
getJob(jobId): Promise<unknown>;
```

Defined in: [src/backend/bullmq-backend.ts:105](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/bullmq-backend.ts#L105)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`Promise`\<`unknown`\>

***

<a id="api-deadletterfilter"></a>

### DeadLetterFilter

Defined in: [src/lifecycle.ts:99](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L99)

#### Properties

<a id="api-tenantid"></a>

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/lifecycle.ts:101](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L101)

<a id="api-type"></a>

##### type?

```ts
optional type?: string;
```

Defined in: [src/lifecycle.ts:100](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L100)

***

<a id="api-dedupeoptions"></a>

### DedupeOptions

Defined in: [src/types.ts:45](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L45)

#### Properties

<a id="api-key"></a>

##### key

```ts
key: string;
```

Defined in: [src/types.ts:46](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L46)

<a id="api-mode"></a>

##### mode?

```ts
optional mode?: "while_active" | "until_completed";
```

Defined in: [src/types.ts:49](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L49)

<a id="api-scope"></a>

##### scope?

```ts
optional scope?: "global" | "tenant";
```

Defined in: [src/types.ts:47](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L47)

<a id="api-ttlms"></a>

##### ttlMs?

```ts
optional ttlMs?: number;
```

Defined in: [src/types.ts:48](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L48)

***

<a id="api-enqueueoptions"></a>

### EnqueueOptions

Defined in: [src/types.ts:52](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L52)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TContext` | [`JobContext`](#api-jobcontext) |
| `TMetadata` *extends* `object` | `Record`\<`string`, `unknown`\> |

#### Properties

<a id="api-attempts"></a>

##### attempts?

```ts
optional attempts?: number;
```

Defined in: [src/types.ts:61](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L61)

<a id="api-backoff-1"></a>

##### backoff?

```ts
optional backoff?: BackoffPolicy;
```

Defined in: [src/types.ts:62](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L62)

<a id="api-context"></a>

##### context?

```ts
optional context?: TContext;
```

Defined in: [src/types.ts:57](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L57)

<a id="api-dedupe"></a>

##### dedupe?

```ts
optional dedupe?: DedupeOptions;
```

Defined in: [src/types.ts:65](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L65)

<a id="api-delay"></a>

##### delay?

```ts
optional delay?: number;
```

Defined in: [src/types.ts:58](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L58)

<a id="api-delayms"></a>

##### delayMs?

```ts
optional delayMs?: number;
```

Defined in: [src/types.ts:59](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L59)

<a id="api-idempotencykey"></a>

##### idempotencyKey?

```ts
optional idempotencyKey?: string;
```

Defined in: [src/types.ts:64](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L64)

<a id="api-jobid"></a>

##### jobId?

```ts
optional jobId?: string;
```

Defined in: [src/types.ts:56](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L56)

<a id="api-metadata"></a>

##### metadata?

```ts
optional metadata?: TMetadata;
```

Defined in: [src/types.ts:66](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L66)

<a id="api-scheduledfor"></a>

##### scheduledFor?

```ts
optional scheduledFor?: Date;
```

Defined in: [src/types.ts:60](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L60)

<a id="api-timeoutms"></a>

##### timeoutMs?

```ts
optional timeoutMs?: number;
```

Defined in: [src/types.ts:63](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L63)

***

<a id="api-enqueueresult"></a>

### EnqueueResult

Defined in: [src/lifecycle.ts:93](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L93)

#### Properties

<a id="api-existingjobid"></a>

##### existingJobId?

```ts
optional existingJobId?: string;
```

Defined in: [src/lifecycle.ts:96](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L96)

<a id="api-jobid-1"></a>

##### jobId

```ts
jobId: string;
```

Defined in: [src/lifecycle.ts:95](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L95)

<a id="api-status"></a>

##### status

```ts
status: "created" | "deduped";
```

Defined in: [src/lifecycle.ts:94](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L94)

***

<a id="api-fairworkeroptions"></a>

### FairWorkerOptions

Defined in: [src/fair-worker.ts:17](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L17)

#### Properties

<a id="api-backend-1"></a>

##### backend

```ts
backend: JobsBackend;
```

Defined in: [src/fair-worker.ts:19](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L19)

<a id="api-contextrunner-2"></a>

##### contextRunner

```ts
contextRunner: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/fair-worker.ts:22](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`JobContext`](#api-jobcontext) |
| `fn` | () => `Promise`\<`unknown`\> |

###### Returns

`Promise`\<`unknown`\>

<a id="api-events-2"></a>

##### events?

```ts
optional events?: JobEventsOptions;
```

Defined in: [src/fair-worker.ts:26](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L26)

<a id="api-jobtype"></a>

##### jobType

```ts
jobType: string;
```

Defined in: [src/fair-worker.ts:18](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L18)

<a id="api-onfail-1"></a>

##### onFail?

```ts
optional onFail?: (e, err) => void;
```

Defined in: [src/fair-worker.ts:25](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L25)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#api-jobevent) |
| `err` | `Error` |

###### Returns

`void`

<a id="api-onfinish-1"></a>

##### onFinish?

```ts
optional onFinish?: (e) => void;
```

Defined in: [src/fair-worker.ts:24](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L24)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#api-jobevent) |

###### Returns

`void`

<a id="api-onstart-1"></a>

##### onStart?

```ts
optional onStart?: (e) => void;
```

Defined in: [src/fair-worker.ts:23](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L23)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#api-jobevent) |

###### Returns

`void`

<a id="api-registry-1"></a>

##### registry

```ts
registry: HandlerRegistry;
```

Defined in: [src/fair-worker.ts:21](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L21)

<a id="api-scheduler"></a>

##### scheduler

```ts
scheduler: Scheduler;
```

Defined in: [src/fair-worker.ts:20](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fair-worker.ts#L20)

***

<a id="api-fakejobsoptions"></a>

### FakeJobsOptions

Defined in: [src/fake-jobs.service.ts:12](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L12)

#### Extends

- `Omit`\<`Partial`\<[`SchedulerOptions`](#api-scheduleroptions)\>, `"clock"`\>

#### Properties

<a id="api-budget"></a>

##### budget?

```ts
optional budget?: ExecutionBudget;
```

Defined in: [src/scheduler.ts:11](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L11)

###### Inherited from

[`SchedulerOptions`](#api-scheduleroptions).[`budget`](#api-budget-1)

<a id="api-contextextractor-1"></a>

##### contextExtractor?

```ts
optional contextExtractor?: () => JobContext;
```

Defined in: [src/fake-jobs.service.ts:16](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L16)

###### Returns

[`JobContext`](#api-jobcontext)

<a id="api-contextrunner-3"></a>

##### contextRunner?

```ts
optional contextRunner?: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/fake-jobs.service.ts:17](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`JobContext`](#api-jobcontext) |
| `fn` | () => `Promise`\<`unknown`\> |

###### Returns

`Promise`\<`unknown`\>

<a id="api-defaultweight"></a>

##### defaultWeight?

```ts
optional defaultWeight?: number;
```

Defined in: [src/scheduler.ts:6](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L6)

###### Inherited from

[`SchedulerOptions`](#api-scheduleroptions).[`defaultWeight`](#api-defaultweight-1)

<a id="api-jobs-1"></a>

##### jobs?

```ts
optional jobs?: JobDefinitions;
```

Defined in: [src/fake-jobs.service.ts:14](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L14)

<a id="api-jobtypes-1"></a>

##### jobTypes

```ts
jobTypes: string[];
```

Defined in: [src/fake-jobs.service.ts:13](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L13)

<a id="api-minsharepct"></a>

##### minSharePct?

```ts
optional minSharePct?: number;
```

Defined in: [src/scheduler.ts:7](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L7)

###### Inherited from

[`SchedulerOptions`](#api-scheduleroptions).[`minSharePct`](#api-minsharepct-1)

<a id="api-now-1"></a>

##### now?

```ts
optional now?: string | number | Date;
```

Defined in: [src/fake-jobs.service.ts:15](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L15)

<a id="api-tenantcap"></a>

##### tenantCap?

```ts
optional tenantCap?: number;
```

Defined in: [src/scheduler.ts:8](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L8)

###### Inherited from

[`SchedulerOptions`](#api-scheduleroptions).[`tenantCap`](#api-tenantcap-1)

<a id="api-typecap"></a>

##### typeCap?

```ts
optional typeCap?: number;
```

Defined in: [src/scheduler.ts:10](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L10)

###### Inherited from

[`SchedulerOptions`](#api-scheduleroptions).[`typeCap`](#api-typecap-1)

***

<a id="api-inmemorybackendoptions"></a>

### InMemoryBackendOptions

Defined in: [src/backend/in-memory-backend.ts:52](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L52)

#### Properties

<a id="api-deadletter-1"></a>

##### deadLetter?

```ts
optional deadLetter?: {
  enabled?: boolean;
};
```

Defined in: [src/backend/in-memory-backend.ts:55](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L55)

###### enabled?

```ts
optional enabled?: boolean;
```

<a id="api-now-2"></a>

##### now?

```ts
optional now?: () => Date;
```

Defined in: [src/backend/in-memory-backend.ts:54](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L54)

###### Returns

`Date`

<a id="api-retention-1"></a>

##### retention?

```ts
optional retention?: RetentionOptions;
```

Defined in: [src/backend/in-memory-backend.ts:53](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/in-memory-backend.ts#L53)

***

<a id="api-inmemoryoptions"></a>

### InMemoryOptions

Defined in: [src/jobs.module.ts:247](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L247)

#### Properties

<a id="api-concurrency"></a>

##### concurrency?

```ts
optional concurrency?: {
  poolSize?: number;
  tenantCap?: number;
  typeCap?: number;
};
```

Defined in: [src/jobs.module.ts:259](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L259)

Local module-wide invocation limits. Defaults: pool 10, tenant 10, type = pool.

###### poolSize?

```ts
optional poolSize?: number;
```

###### tenantCap?

```ts
optional tenantCap?: number;
```

###### typeCap?

```ts
optional typeCap?: number;
```

<a id="api-contextextractor-2"></a>

##### contextExtractor?

```ts
optional contextExtractor?: () => JobContext;
```

Defined in: [src/jobs.module.ts:261](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L261)

###### Returns

[`JobContext`](#api-jobcontext)

<a id="api-contextrunner-4"></a>

##### contextRunner?

```ts
optional contextRunner?: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/jobs.module.ts:262](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L262)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`JobContext`](#api-jobcontext) |
| `fn` | () => `Promise`\<`unknown`\> |

###### Returns

`Promise`\<`unknown`\>

<a id="api-events-3"></a>

##### events?

```ts
optional events?: JobEventsOptions;
```

Defined in: [src/jobs.module.ts:257](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L257)

<a id="api-fairness-1"></a>

##### fairness?

```ts
optional fairness?: {
  defaultWeight?: number;
  minSharePct?: number;
};
```

Defined in: [src/jobs.module.ts:260](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L260)

###### defaultWeight?

```ts
optional defaultWeight?: number;
```

###### minSharePct?

```ts
optional minSharePct?: number;
```

<a id="api-global-1"></a>

##### global?

```ts
optional global?: boolean;
```

Defined in: [src/jobs.module.ts:255](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L255)

<a id="api-jobs-2"></a>

##### jobs?

```ts
optional jobs?: JobDefinitions;
```

Defined in: [src/jobs.module.ts:254](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L254)

<a id="api-jobtypes-2"></a>

##### jobTypes

```ts
jobTypes: string[];
```

Defined in: [src/jobs.module.ts:253](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L253)

<a id="api-onjobfail-1"></a>

##### onJobFail?

```ts
optional onJobFail?: (e, err) => void;
```

Defined in: [src/jobs.module.ts:265](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L265)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#api-jobevent) |
| `err` | `Error` |

###### Returns

`void`

<a id="api-onjobfinish-1"></a>

##### onJobFinish?

```ts
optional onJobFinish?: (e) => void;
```

Defined in: [src/jobs.module.ts:264](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L264)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#api-jobevent) |

###### Returns

`void`

<a id="api-onjobstart-1"></a>

##### onJobStart?

```ts
optional onJobStart?: (e) => void;
```

Defined in: [src/jobs.module.ts:263](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L263)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#api-jobevent) |

###### Returns

`void`

<a id="api-onworkererror"></a>

##### onWorkerError?

```ts
optional onWorkerError?: (error) => void;
```

Defined in: [src/jobs.module.ts:250](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L250)

Best-effort observer. Backend operation retries use a 50ms backoff.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`void`

<a id="api-retention-2"></a>

##### retention?

```ts
optional retention?: RetentionOptions;
```

Defined in: [src/jobs.module.ts:248](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L248)

<a id="api-shutdown"></a>

##### shutdown?

```ts
optional shutdown?: {
  timeoutMs?: number;
};
```

Defined in: [src/jobs.module.ts:252](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L252)

Graceful drain deadline (default 30 seconds). Timeout rejects; draining continues.

###### timeoutMs?

```ts
optional timeoutMs?: number;
```

<a id="api-strictcapabilities-1"></a>

##### strictCapabilities?

```ts
optional strictCapabilities?: boolean;
```

Defined in: [src/jobs.module.ts:256](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L256)

***

<a id="api-jobbuilder"></a>

### JobBuilder

Defined in: [src/contracts.ts:29](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L29)

#### Type Parameters

| Type Parameter |
| ------ |
| `TPayload` |
| `TContext` |
| `TResult` |

#### Properties

<a id="api-__context"></a>

##### \_\_context?

```ts
readonly optional __context?: TContext;
```

Defined in: [src/contracts.ts:31](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L31)

<a id="api-__payload"></a>

##### \_\_payload?

```ts
readonly optional __payload?: TPayload;
```

Defined in: [src/contracts.ts:30](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L30)

<a id="api-__result"></a>

##### \_\_result?

```ts
readonly optional __result?: TResult;
```

Defined in: [src/contracts.ts:32](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L32)

#### Methods

<a id="api-context-1"></a>

##### context()

```ts
context<TNextContext>(...invalid): JobBuilder<TPayload, TNextContext, TResult>;
```

Defined in: [src/contracts.ts:33](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L33)

###### Type Parameters

| Type Parameter |
| ------ |
| `TNextContext` *extends* `object` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`invalid` | `PlainObjectArguments`\<`TNextContext`\> |

###### Returns

[`JobBuilder`](#api-jobbuilder)\<`TPayload`, `TNextContext`, `TResult`\>

<a id="api-defaults"></a>

##### defaults()

```ts
defaults(defaults): JobDefinition<TPayload, TContext, TResult>;
```

Defined in: [src/contracts.ts:37](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `defaults` | [`JobDefaults`](#api-jobdefaults) |

###### Returns

[`JobDefinition`](#api-jobdefinition)\<`TPayload`, `TContext`, `TResult`\>

<a id="api-result"></a>

##### result()

```ts
result<TNextResult>(): JobBuilder<TPayload, TContext, TNextResult>;
```

Defined in: [src/contracts.ts:36](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L36)

###### Type Parameters

| Type Parameter |
| ------ |
| `TNextResult` |

###### Returns

[`JobBuilder`](#api-jobbuilder)\<`TPayload`, `TContext`, `TNextResult`\>

***

<a id="api-jobcontext"></a>

### JobContext

Defined in: [src/types.ts:3](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L3)

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

<a id="api-signal"></a>

##### signal?

```ts
optional signal?: AbortSignal;
```

Defined in: [src/types.ts:5](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L5)

<a id="api-tenantid-1"></a>

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/types.ts:4](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L4)

***

<a id="api-jobdefaults"></a>

### JobDefaults

Defined in: [src/contracts.ts:40](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L40)

#### Properties

<a id="api-attempts-1"></a>

##### attempts?

```ts
optional attempts?: number;
```

Defined in: [src/contracts.ts:41](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L41)

<a id="api-backoff-2"></a>

##### backoff?

```ts
optional backoff?: BackoffPolicy;
```

Defined in: [src/contracts.ts:43](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L43)

<a id="api-timeoutms-1"></a>

##### timeoutMs?

```ts
optional timeoutMs?: number;
```

Defined in: [src/contracts.ts:42](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L42)

***

<a id="api-jobdefinition"></a>

### JobDefinition

Defined in: [src/contracts.ts:22](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L22)

#### Type Parameters

| Type Parameter |
| ------ |
| `TPayload` |
| `TContext` |
| `TResult` |

#### Properties

<a id="api-__context-1"></a>

##### \_\_context?

```ts
readonly optional __context?: TContext;
```

Defined in: [src/contracts.ts:24](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L24)

<a id="api-__payload-1"></a>

##### \_\_payload?

```ts
readonly optional __payload?: TPayload;
```

Defined in: [src/contracts.ts:23](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L23)

<a id="api-__result-1"></a>

##### \_\_result?

```ts
readonly optional __result?: TResult;
```

Defined in: [src/contracts.ts:25](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L25)

<a id="api-defaults-1"></a>

##### defaults

```ts
readonly defaults: JobDefaults;
```

Defined in: [src/contracts.ts:26](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L26)

***

<a id="api-jobenvelope"></a>

### JobEnvelope

Defined in: [src/types.ts:9](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L9)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

<a id="api-activationid"></a>

##### activationId?

```ts
optional activationId?: string;
```

Defined in: [src/types.ts:17](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L17)

Opaque ownership token returned only by moveToActive.

<a id="api-attempts-2"></a>

##### attempts

```ts
attempts: number;
```

Defined in: [src/types.ts:15](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L15)

<a id="api-backoff-3"></a>

##### backoff?

```ts
optional backoff?: BackoffPolicy;
```

Defined in: [src/types.ts:21](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L21)

<a id="api-context-2"></a>

##### context

```ts
context: JobContext;
```

Defined in: [src/types.ts:13](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L13)

<a id="api-dedupekey"></a>

##### dedupeKey?

```ts
optional dedupeKey?: string;
```

Defined in: [src/types.ts:24](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L24)

<a id="api-enqueuedat"></a>

##### enqueuedAt

```ts
enqueuedAt: Date;
```

Defined in: [src/types.ts:14](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L14)

<a id="api-id"></a>

##### id

```ts
id: string;
```

Defined in: [src/types.ts:10](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L10)

<a id="api-idempotencykey-1"></a>

##### idempotencyKey?

```ts
optional idempotencyKey?: string;
```

Defined in: [src/types.ts:23](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L23)

<a id="api-jobtype-1"></a>

##### jobType

```ts
jobType: string;
```

Defined in: [src/types.ts:11](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L11)

<a id="api-maxattempts"></a>

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/types.ts:18](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L18)

<a id="api-metadata-1"></a>

##### metadata

```ts
metadata: Record<string, unknown>;
```

Defined in: [src/types.ts:22](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L22)

<a id="api-payload"></a>

##### payload

```ts
payload: T;
```

Defined in: [src/types.ts:12](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L12)

<a id="api-scheduledfor-1"></a>

##### scheduledFor?

```ts
optional scheduledFor?: Date;
```

Defined in: [src/types.ts:19](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L19)

<a id="api-timeoutms-2"></a>

##### timeoutMs?

```ts
optional timeoutMs?: number;
```

Defined in: [src/types.ts:20](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L20)

***

<a id="api-joberrorsummary"></a>

### JobErrorSummary

Defined in: [src/lifecycle.ts:11](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L11)

#### Properties

<a id="api-code"></a>

##### code?

```ts
optional code?: string;
```

Defined in: [src/lifecycle.ts:14](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L14)

<a id="api-message"></a>

##### message

```ts
message: string;
```

Defined in: [src/lifecycle.ts:13](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L13)

<a id="api-name"></a>

##### name?

```ts
optional name?: string;
```

Defined in: [src/lifecycle.ts:12](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L12)

<a id="api-reason"></a>

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/lifecycle.ts:15](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L15)

***

<a id="api-jobevent"></a>

### JobEvent

Defined in: [src/types.ts:35](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L35)

#### Properties

<a id="api-attempt"></a>

##### attempt?

```ts
optional attempt?: number;
```

Defined in: [src/types.ts:39](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L39)

<a id="api-durationms"></a>

##### durationMs?

```ts
optional durationMs?: number;
```

Defined in: [src/types.ts:42](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L42)

<a id="api-finishedat"></a>

##### finishedAt?

```ts
optional finishedAt?: Date;
```

Defined in: [src/types.ts:41](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L41)

<a id="api-jobid-2"></a>

##### jobId

```ts
jobId: string;
```

Defined in: [src/types.ts:36](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L36)

<a id="api-jobtype-2"></a>

##### jobType

```ts
jobType: string;
```

Defined in: [src/types.ts:37](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L37)

<a id="api-startedat"></a>

##### startedAt?

```ts
optional startedAt?: Date;
```

Defined in: [src/types.ts:40](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L40)

<a id="api-tenantid-2"></a>

##### tenantId

```ts
tenantId: string | undefined;
```

Defined in: [src/types.ts:38](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L38)

***

<a id="api-jobeventsoptions"></a>

### JobEventsOptions

Defined in: [src/lifecycle.ts:89](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L89)

#### Properties

<a id="api-onevent"></a>

##### onEvent?

```ts
optional onEvent?: (event) => void;
```

Defined in: [src/lifecycle.ts:90](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L90)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`JobLifecycleEvent`](#api-joblifecycleevent) |

###### Returns

`void`

***

<a id="api-jobhistoryentry"></a>

### JobHistoryEntry

Defined in: [src/lifecycle.ts:38](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L38)

#### Properties

<a id="api-at"></a>

##### at

```ts
at: Date;
```

Defined in: [src/lifecycle.ts:42](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L42)

<a id="api-attempt-1"></a>

##### attempt

```ts
attempt: number;
```

Defined in: [src/lifecycle.ts:41](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L41)

<a id="api-error"></a>

##### error?

```ts
optional error?: JobErrorSummary;
```

Defined in: [src/lifecycle.ts:44](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L44)

<a id="api-jobid-3"></a>

##### jobId

```ts
jobId: string;
```

Defined in: [src/lifecycle.ts:39](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L39)

<a id="api-metadata-2"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/lifecycle.ts:45](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L45)

<a id="api-reason-1"></a>

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/lifecycle.ts:43](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L43)

<a id="api-status-1"></a>

##### status

```ts
status: JobStatus;
```

Defined in: [src/lifecycle.ts:40](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L40)

***

<a id="api-jobinstance"></a>

### JobInstance

Defined in: [src/contracts.ts:70](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L70)

#### Type Parameters

| Type Parameter |
| ------ |
| `TJobs` *extends* [`JobDefinitions`](#api-jobdefinitions) |
| `TType` *extends* [`JobType`](#api-jobtype-4)\<`TJobs`\> |

#### Properties

<a id="api-attempt-2"></a>

##### attempt

```ts
attempt: number;
```

Defined in: [src/contracts.ts:75](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L75)

<a id="api-context-3"></a>

##### context

```ts
context: JobContextOf<TJobs, TType>;
```

Defined in: [src/contracts.ts:74](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L74)

<a id="api-id-1"></a>

##### id

```ts
id: string;
```

Defined in: [src/contracts.ts:71](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L71)

<a id="api-maxattempts-1"></a>

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/contracts.ts:76](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L76)

<a id="api-metadata-3"></a>

##### metadata

```ts
metadata: Record<string, unknown>;
```

Defined in: [src/contracts.ts:78](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L78)

<a id="api-payload-1"></a>

##### payload

```ts
payload: JobPayload<TJobs, TType>;
```

Defined in: [src/contracts.ts:73](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L73)

<a id="api-signal-1"></a>

##### signal

```ts
signal: AbortSignal;
```

Defined in: [src/contracts.ts:77](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L77)

<a id="api-type-1"></a>

##### type

```ts
type: TType;
```

Defined in: [src/contracts.ts:72](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L72)

***

<a id="api-joblifecycleevent"></a>

### JobLifecycleEvent

Defined in: [src/lifecycle.ts:77](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L77)

#### Properties

<a id="api-at-1"></a>

##### at

```ts
at: Date;
```

Defined in: [src/lifecycle.ts:83](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L83)

<a id="api-attempt-3"></a>

##### attempt

```ts
attempt: number;
```

Defined in: [src/lifecycle.ts:82](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L82)

<a id="api-durationms-1"></a>

##### durationMs?

```ts
optional durationMs?: number;
```

Defined in: [src/lifecycle.ts:84](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L84)

<a id="api-error-1"></a>

##### error?

```ts
optional error?: JobErrorSummary;
```

Defined in: [src/lifecycle.ts:85](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L85)

<a id="api-jobid-4"></a>

##### jobId

```ts
jobId: string;
```

Defined in: [src/lifecycle.ts:79](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L79)

<a id="api-jobtype-3"></a>

##### jobType

```ts
jobType: string;
```

Defined in: [src/lifecycle.ts:80](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L80)

<a id="api-metadata-4"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/lifecycle.ts:86](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L86)

<a id="api-tenantid-3"></a>

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/lifecycle.ts:81](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L81)

<a id="api-type-2"></a>

##### type

```ts
type: JobLifecycleEventType;
```

Defined in: [src/lifecycle.ts:78](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L78)

***

<a id="api-jobrecord"></a>

### JobRecord

Defined in: [src/lifecycle.ts:18](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L18)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TPayload` | `unknown` |
| `TContext` | `unknown` |

#### Properties

<a id="api-attempt-4"></a>

##### attempt

```ts
attempt: number;
```

Defined in: [src/lifecycle.ts:24](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L24)

<a id="api-completedat"></a>

##### completedAt?

```ts
optional completedAt?: Date;
```

Defined in: [src/lifecycle.ts:29](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L29)

<a id="api-context-4"></a>

##### context?

```ts
optional context?: TContext;
```

Defined in: [src/lifecycle.ts:23](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L23)

<a id="api-dedupekey-1"></a>

##### dedupeKey?

```ts
optional dedupeKey?: string;
```

Defined in: [src/lifecycle.ts:34](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L34)

<a id="api-enqueuedat-1"></a>

##### enqueuedAt

```ts
enqueuedAt: Date;
```

Defined in: [src/lifecycle.ts:26](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L26)

<a id="api-error-2"></a>

##### error?

```ts
optional error?: JobErrorSummary;
```

Defined in: [src/lifecycle.ts:32](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L32)

<a id="api-failedat"></a>

##### failedAt?

```ts
optional failedAt?: Date;
```

Defined in: [src/lifecycle.ts:30](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L30)

<a id="api-id-2"></a>

##### id

```ts
id: string;
```

Defined in: [src/lifecycle.ts:19](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L19)

<a id="api-idempotencykey-2"></a>

##### idempotencyKey?

```ts
optional idempotencyKey?: string;
```

Defined in: [src/lifecycle.ts:33](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L33)

<a id="api-maxattempts-2"></a>

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/lifecycle.ts:25](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L25)

<a id="api-metadata-5"></a>

##### metadata

```ts
metadata: Record<string, unknown>;
```

Defined in: [src/lifecycle.ts:35](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L35)

<a id="api-nextattemptat"></a>

##### nextAttemptAt?

```ts
optional nextAttemptAt?: Date;
```

Defined in: [src/lifecycle.ts:31](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L31)

<a id="api-payload-2"></a>

##### payload?

```ts
optional payload?: TPayload;
```

Defined in: [src/lifecycle.ts:22](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L22)

<a id="api-scheduledfor-2"></a>

##### scheduledFor?

```ts
optional scheduledFor?: Date;
```

Defined in: [src/lifecycle.ts:27](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L27)

<a id="api-startedat-1"></a>

##### startedAt?

```ts
optional startedAt?: Date;
```

Defined in: [src/lifecycle.ts:28](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L28)

<a id="api-status-2"></a>

##### status

```ts
status: JobStatus;
```

Defined in: [src/lifecycle.ts:21](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L21)

<a id="api-type-3"></a>

##### type

```ts
type: string;
```

Defined in: [src/lifecycle.ts:20](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L20)

***

<a id="api-jobsbackend"></a>

### JobsBackend

Defined in: [src/backend/jobs-backend.interface.ts:13](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/jobs-backend.interface.ts#L13)

#### Methods

<a id="api-ack-2"></a>

##### ack()

```ts
ack(
   jobType,
   jobId,
activationId): Promise<void | JobRecord<unknown, unknown>>;
```

Defined in: [src/backend/jobs-backend.interface.ts:28](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/jobs-backend.interface.ts#L28)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `jobId` | `string` |
| `activationId` | `string` |

###### Returns

`Promise`\<`void` \| [`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\>\>

<a id="api-capabilities-2"></a>

##### capabilities()

```ts
capabilities(): BackendCapabilities;
```

Defined in: [src/backend/jobs-backend.interface.ts:14](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/jobs-backend.interface.ts#L14)

###### Returns

[`BackendCapabilities`](#api-backendcapabilities)

<a id="api-close-3"></a>

##### close()

```ts
close(): Promise<void>;
```

Defined in: [src/backend/jobs-backend.interface.ts:40](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/jobs-backend.interface.ts#L40)

###### Returns

`Promise`\<`void`\>

<a id="api-discarddeadletter-1"></a>

##### discardDeadLetter()?

```ts
optional discardDeadLetter(jobId, reason?): Promise<void | JobRecord<unknown, unknown>>;
```

Defined in: [src/backend/jobs-backend.interface.ts:39](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/jobs-backend.interface.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |
| `reason?` | `string` |

###### Returns

`Promise`\<`void` \| [`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\>\>

<a id="api-enqueue-2"></a>

##### enqueue()

```ts
enqueue(
   jobType,
   envelope,
opts): Promise<string>;
```

Defined in: [src/backend/jobs-backend.interface.ts:15](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/jobs-backend.interface.ts#L15)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `envelope` | `Record`\<`string`, `unknown`\> |
| `opts` | [`EnqueueOptions`](#api-enqueueoptions) |

###### Returns

`Promise`\<`string`\>

<a id="api-enqueuedetailed-2"></a>

##### enqueueDetailed()?

```ts
optional enqueueDetailed(
   jobType,
   envelope,
   opts,
onCommit?): Promise<EnqueueResult>;
```

Defined in: [src/backend/jobs-backend.interface.ts:20](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/jobs-backend.interface.ts#L20)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `envelope` | `Record`\<`string`, `unknown`\> |
| `opts` | [`EnqueueOptions`](#api-enqueueoptions) |
| `onCommit?` | [`EnqueueCommitObserver`](#api-enqueuecommitobserver) |

###### Returns

`Promise`\<[`EnqueueResult`](#api-enqueueresult)\>

<a id="api-fail-2"></a>

##### fail()

```ts
fail(
   jobType,
   jobId,
   reason,
activationId): Promise<void | JobRecord<unknown, unknown>>;
```

Defined in: [src/backend/jobs-backend.interface.ts:29](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/jobs-backend.interface.ts#L29)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `jobId` | `string` |
| `reason` | `string` |
| `activationId` | `string` |

###### Returns

`Promise`\<`void` \| [`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\>\>

<a id="api-getjob-3"></a>

##### getJob()

```ts
getJob(jobId): Promise<JobRecord<unknown, unknown> | null>;
```

Defined in: [src/backend/jobs-backend.interface.ts:35](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/jobs-backend.interface.ts#L35)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\> \| `null`\>

<a id="api-getjobhistory-2"></a>

##### getJobHistory()

```ts
getJobHistory(jobId): Promise<JobHistoryEntry[]>;
```

Defined in: [src/backend/jobs-backend.interface.ts:36](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/jobs-backend.interface.ts#L36)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`Promise`\<[`JobHistoryEntry`](#api-jobhistoryentry)[]\>

<a id="api-listdeadletters-1"></a>

##### listDeadLetters()?

```ts
optional listDeadLetters(filter?): Promise<JobRecord<unknown, unknown>[]>;
```

Defined in: [src/backend/jobs-backend.interface.ts:37](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/jobs-backend.interface.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filter?` | [`DeadLetterFilter`](#api-deadletterfilter) |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\>[]\>

<a id="api-movetoactive-2"></a>

##### moveToActive()

```ts
moveToActive(
   jobType,
   jobId,
activationId?): Promise<JobEnvelope<unknown> | null>;
```

Defined in: [src/backend/jobs-backend.interface.ts:27](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/jobs-backend.interface.ts#L27)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `jobId` | `string` |
| `activationId?` | `string` |

###### Returns

`Promise`\<[`JobEnvelope`](#api-jobenvelope)\<`unknown`\> \| `null`\>

<a id="api-peekwaiting-2"></a>

##### peekWaiting()

```ts
peekWaiting(jobType): Promise<JobEnvelope<unknown>[]>;
```

Defined in: [src/backend/jobs-backend.interface.ts:26](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/jobs-backend.interface.ts#L26)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |

###### Returns

`Promise`\<[`JobEnvelope`](#api-jobenvelope)\<`unknown`\>[]\>

<a id="api-replaydeadletter-1"></a>

##### replayDeadLetter()?

```ts
optional replayDeadLetter(jobId, options?): Promise<string>;
```

Defined in: [src/backend/jobs-backend.interface.ts:38](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/jobs-backend.interface.ts#L38)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |
| `options?` | [`ReplayOptions`](#api-replayoptions) |

###### Returns

`Promise`\<`string`\>

***

<a id="api-jobsoutboxbridgeoptions"></a>

### JobsOutboxBridgeOptions

Defined in: [src/outbox/outbox-bridge.module.ts:13](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-bridge.module.ts#L13)

#### Properties

<a id="api-jobs-3"></a>

##### jobs

```ts
jobs: JobsService;
```

Defined in: [src/outbox/outbox-bridge.module.ts:14](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-bridge.module.ts#L14)

<a id="api-map"></a>

##### map

```ts
map: Record<string, string>;
```

Defined in: [src/outbox/outbox-bridge.module.ts:16](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-bridge.module.ts#L16)

<a id="api-source"></a>

##### source

```ts
source: OutboxSource;
```

Defined in: [src/outbox/outbox-bridge.module.ts:15](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-bridge.module.ts#L15)

<a id="api-tenantfrom"></a>

##### tenantFrom?

```ts
optional tenantFrom?: (event) => string;
```

Defined in: [src/outbox/outbox-bridge.module.ts:17](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-bridge.module.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`OutboxEvent`](#api-outboxevent) |

###### Returns

`string`

***

<a id="api-jobsservicedeps"></a>

### JobsServiceDeps

Defined in: [src/jobs.service.ts:25](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L25)

#### Properties

<a id="api-backend-3"></a>

##### backend

```ts
backend: JobsBackend;
```

Defined in: [src/jobs.service.ts:27](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L27)

<a id="api-contextextractor-3"></a>

##### contextExtractor?

```ts
optional contextExtractor?: () => JobContext;
```

Defined in: [src/jobs.service.ts:31](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L31)

###### Returns

[`JobContext`](#api-jobcontext)

<a id="api-contextrunner-5"></a>

##### contextRunner?

```ts
optional contextRunner?: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/jobs.service.ts:32](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L32)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`JobContext`](#api-jobcontext) |
| `fn` | () => `Promise`\<`unknown`\> |

###### Returns

`Promise`\<`unknown`\>

<a id="api-events-4"></a>

##### events?

```ts
optional events?: JobEventsOptions;
```

Defined in: [src/jobs.service.ts:33](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L33)

<a id="api-jobs-4"></a>

##### jobs?

```ts
optional jobs?: JobDefinitions;
```

Defined in: [src/jobs.service.ts:34](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L34)

<a id="api-jobtypes-3"></a>

##### jobTypes?

```ts
optional jobTypes?: Iterable<string, any, any>;
```

Defined in: [src/jobs.service.ts:30](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L30)

<a id="api-producerenabled"></a>

##### producerEnabled?

```ts
optional producerEnabled?: boolean;
```

Defined in: [src/jobs.service.ts:26](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L26)

<a id="api-registry-3"></a>

##### registry

```ts
registry: HandlerRegistry;
```

Defined in: [src/jobs.service.ts:28](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L28)

<a id="api-schedulers-1"></a>

##### schedulers?

```ts
optional schedulers?: Map<string, Scheduler>;
```

Defined in: [src/jobs.service.ts:29](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.service.ts#L29)

***

<a id="api-outboxevent"></a>

### OutboxEvent

Defined in: [src/outbox/outbox-bridge.module.ts:3](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-bridge.module.ts#L3)

#### Properties

<a id="api-payload-3"></a>

##### payload

```ts
payload: Record<string, unknown>;
```

Defined in: [src/outbox/outbox-bridge.module.ts:5](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-bridge.module.ts#L5)

<a id="api-tenantid-4"></a>

##### tenantId

```ts
tenantId: string;
```

Defined in: [src/outbox/outbox-bridge.module.ts:6](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-bridge.module.ts#L6)

<a id="api-type-4"></a>

##### type

```ts
type: string;
```

Defined in: [src/outbox/outbox-bridge.module.ts:4](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-bridge.module.ts#L4)

***

<a id="api-outboxjobspublisheroptions"></a>

### OutboxJobsPublisherOptions

Defined in: [src/outbox/outbox-jobs-publisher.ts:40](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L40)

#### Properties

<a id="api-map-1"></a>

##### map

```ts
map: Record<string, string | OutboxJobTarget>;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:41](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L41)

<a id="api-unmapped"></a>

##### unmapped?

```ts
optional unmapped?: "error" | "ignore";
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:42](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L42)

***

<a id="api-outboxjobtarget"></a>

### OutboxJobTarget

Defined in: [src/outbox/outbox-jobs-publisher.ts:33](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L33)

#### Properties

<a id="api-job-3"></a>

##### job

```ts
job: string;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:34](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L34)

<a id="api-options"></a>

##### options?

```ts
optional options?:
  | EnqueueOptions<JobContext, Record<string, unknown>>
  | ((record) => EnqueueOptions);
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:36](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L36)

<a id="api-payload-4"></a>

##### payload?

```ts
optional payload?: (record) => Record<string, unknown>;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:35](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L35)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `record` | [`OutboxRecord`](#api-outboxrecord) |

###### Returns

`Record`\<`string`, `unknown`\>

<a id="api-tenant"></a>

##### tenant?

```ts
optional tenant?: "required" | "optional" | ((record) => string | undefined);
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:37](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L37)

***

<a id="api-outboxpublisher"></a>

### OutboxPublisher

Defined in: [src/outbox/outbox-jobs-publisher.ts:29](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L29)

#### Methods

<a id="api-publish"></a>

##### publish()

```ts
publish(record): Promise<void>;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:30](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L30)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `record` | [`OutboxRecord`](#api-outboxrecord) |

###### Returns

`Promise`\<`void`\>

***

<a id="api-outboxrecord"></a>

### OutboxRecord

Defined in: [src/outbox/outbox-jobs-publisher.ts:7](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L7)

#### Properties

<a id="api-aggregateid"></a>

##### aggregateId?

```ts
optional aggregateId?: string | null;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:20](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L20)

<a id="api-aggregatetype"></a>

##### aggregateType?

```ts
optional aggregateType?: string | null;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:19](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L19)

<a id="api-causationid"></a>

##### causationId?

```ts
optional causationId?: string | null;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:24](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L24)

<a id="api-correlationid"></a>

##### correlationId?

```ts
optional correlationId?: string | null;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:23](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L23)

<a id="api-createdat"></a>

##### createdAt?

```ts
optional createdAt?: Date;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:12](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L12)

<a id="api-eventtype"></a>

##### eventType

```ts
eventType: string;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:9](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L9)

<a id="api-headers"></a>

##### headers?

```ts
optional headers?: Record<string, unknown> | null;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:25](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L25)

<a id="api-id-3"></a>

##### id

```ts
id: string;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:8](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L8)

<a id="api-idempotencykey-3"></a>

##### idempotencyKey?

```ts
optional idempotencyKey?: string | null;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:22](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L22)

<a id="api-lasterror"></a>

##### lastError?

```ts
optional lastError?: string | null;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:17](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L17)

<a id="api-maxretries"></a>

##### maxRetries?

```ts
optional maxRetries?: number;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:16](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L16)

<a id="api-occurredat"></a>

##### occurredAt?

```ts
optional occurredAt?: string | Date | null;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:26](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L26)

<a id="api-partitionkey"></a>

##### partitionKey?

```ts
optional partitionKey?: string | null;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:21](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L21)

<a id="api-payload-5"></a>

##### payload

```ts
payload: Record<string, unknown>;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:10](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L10)

<a id="api-processedat"></a>

##### processedAt?

```ts
optional processedAt?: Date | null;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:14](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L14)

<a id="api-retrycount"></a>

##### retryCount?

```ts
optional retryCount?: number;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:15](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L15)

<a id="api-status-3"></a>

##### status?

```ts
optional status?: "PENDING" | "PROCESSING" | "SENT" | "FAILED";
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:11](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L11)

<a id="api-tenantid-5"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:18](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L18)

<a id="api-updatedat"></a>

##### updatedAt?

```ts
optional updatedAt?: Date;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:13](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L13)

***

<a id="api-outboxsource"></a>

### OutboxSource

Defined in: [src/outbox/outbox-bridge.module.ts:9](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-bridge.module.ts#L9)

#### Methods

<a id="api-onevent-1"></a>

##### onEvent()

```ts
onEvent(cb): void;
```

Defined in: [src/outbox/outbox-bridge.module.ts:10](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-bridge.module.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `cb` | (`event`) => `Promise`\<`void`\> |

###### Returns

`void`

***

<a id="api-pickedjob"></a>

### PickedJob

Defined in: [src/scheduler.ts:36](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L36)

#### Properties

<a id="api-jobid-5"></a>

##### jobId

```ts
jobId: string;
```

Defined in: [src/scheduler.ts:37](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L37)

<a id="api-tenantid-6"></a>

##### tenantId

```ts
tenantId: string | undefined;
```

Defined in: [src/scheduler.ts:38](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L38)

***

<a id="api-replayoptions"></a>

### ReplayOptions

Defined in: [src/lifecycle.ts:104](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L104)

#### Properties

<a id="api-metadata-6"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/lifecycle.ts:107](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L107)

<a id="api-preserveoriginalid"></a>

##### preserveOriginalId?

```ts
optional preserveOriginalId?: boolean;
```

Defined in: [src/lifecycle.ts:105](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L105)

<a id="api-resetattempts"></a>

##### resetAttempts?

```ts
optional resetAttempts?: boolean;
```

Defined in: [src/lifecycle.ts:106](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L106)

***

<a id="api-retentioncleanupoptions"></a>

### RetentionCleanupOptions

Defined in: [src/retention.ts:12](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/retention.ts#L12)

#### Properties

<a id="api-producersstopped"></a>

##### producersStopped

```ts
producersStopped: true;
```

Defined in: [src/retention.ts:14](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/retention.ts#L14)

All producers and administrative retry/replay writers must be stopped first.

***

<a id="api-retentionoptions"></a>

### RetentionOptions

Defined in: [src/retention.ts:4](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/retention.ts#L4)

Opt-in, operator-driven cleanup. The age is a safety floor even under count pressure.

#### Properties

<a id="api-batchsize"></a>

##### batchSize?

```ts
optional batchSize?: number;
```

Defined in: [src/retention.ts:7](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/retention.ts#L7)

Maximum records removed per queue and call (default 1000).

<a id="api-recoveryhorizonms"></a>

##### recoveryHorizonMs

```ts
recoveryHorizonMs: number;
```

Defined in: [src/retention.ts:9](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/retention.ts#L9)

Longest Outbox retry + manual recovery horizon for this deployment.

<a id="api-terminalagems"></a>

##### terminalAgeMs

```ts
terminalAgeMs: number;
```

Defined in: [src/retention.ts:5](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/retention.ts#L5)

***

<a id="api-retrypolicy"></a>

### RetryPolicy

Defined in: [src/retry.ts:6](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/retry.ts#L6)

#### Properties

<a id="api-attempts-3"></a>

##### attempts?

```ts
optional attempts?: number;
```

Defined in: [src/retry.ts:7](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/retry.ts#L7)

<a id="api-backoff-4"></a>

##### backoff?

```ts
optional backoff?: BackoffPolicy;
```

Defined in: [src/retry.ts:8](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/retry.ts#L8)

***

<a id="api-schedulerenqueuetiming"></a>

### SchedulerEnqueueTiming

Defined in: [src/scheduler.ts:14](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L14)

#### Properties

<a id="api-delayms-1"></a>

##### delayMs?

```ts
optional delayMs?: number;
```

Defined in: [src/scheduler.ts:16](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L16)

<a id="api-scheduledfor-3"></a>

##### scheduledFor?

```ts
optional scheduledFor?: Date;
```

Defined in: [src/scheduler.ts:15](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L15)

***

<a id="api-scheduleroptions"></a>

### SchedulerOptions

Defined in: [src/scheduler.ts:5](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L5)

#### Properties

<a id="api-budget-1"></a>

##### budget?

```ts
optional budget?: ExecutionBudget;
```

Defined in: [src/scheduler.ts:11](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L11)

<a id="api-clock-1"></a>

##### clock?

```ts
optional clock?: () => Date;
```

Defined in: [src/scheduler.ts:9](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L9)

###### Returns

`Date`

<a id="api-defaultweight-1"></a>

##### defaultWeight

```ts
defaultWeight: number;
```

Defined in: [src/scheduler.ts:6](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L6)

<a id="api-minsharepct-1"></a>

##### minSharePct

```ts
minSharePct: number;
```

Defined in: [src/scheduler.ts:7](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L7)

<a id="api-tenantcap-1"></a>

##### tenantCap

```ts
tenantCap: number;
```

Defined in: [src/scheduler.ts:8](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L8)

<a id="api-typecap-1"></a>

##### typeCap?

```ts
optional typeCap?: number;
```

Defined in: [src/scheduler.ts:10](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/scheduler.ts#L10)

***

<a id="api-shardsnapshot"></a>

### ShardSnapshot

Defined in: [src/types.ts:27](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L27)

#### Properties

<a id="api-inflight"></a>

##### inflight

```ts
inflight: number;
```

Defined in: [src/types.ts:30](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L30)

<a id="api-starvationtokens"></a>

##### starvationTokens

```ts
starvationTokens: number;
```

Defined in: [src/types.ts:32](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L32)

<a id="api-tenantid-7"></a>

##### tenantId

```ts
tenantId: string | undefined;
```

Defined in: [src/types.ts:28](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L28)

<a id="api-waiting"></a>

##### waiting

```ts
waiting: number;
```

Defined in: [src/types.ts:29](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L29)

<a id="api-weight"></a>

##### weight

```ts
weight: number;
```

Defined in: [src/types.ts:31](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/types.ts#L31)

***

<a id="api-typedjobhandler"></a>

### TypedJobHandler

Defined in: [src/contracts.ts:81](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L81)

#### Type Parameters

| Type Parameter |
| ------ |
| `TJobs` *extends* [`JobDefinitions`](#api-jobdefinitions) |
| `TType` *extends* [`JobType`](#api-jobtype-4)\<`TJobs`\> |

#### Methods

<a id="api-handle"></a>

##### handle()

```ts
handle(payload, context): Promise<JobResult<TJobs, TType>>;
```

Defined in: [src/contracts.ts:82](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L82)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `payload` | [`JobPayload`](#api-jobpayload)\<`TJobs`, `TType`\> |
| `context` | [`JobContextOf`](#api-jobcontextof)\<`TJobs`, `TType`\> |

###### Returns

`Promise`\<[`JobResult`](#api-jobresult)\<`TJobs`, `TType`\>\>

***

<a id="api-typedjobsservice"></a>

### TypedJobsService

Defined in: [src/contracts.ts:88](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L88)

#### Type Parameters

| Type Parameter |
| ------ |
| `TJobs` *extends* [`JobDefinitions`](#api-jobdefinitions) |

#### Methods

<a id="api-capabilities-4"></a>

##### capabilities()

```ts
capabilities(): BackendCapabilities;
```

Defined in: [src/contracts.ts:106](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L106)

###### Returns

[`BackendCapabilities`](#api-backendcapabilities)

<a id="api-discarddeadletter-3"></a>

##### discardDeadLetter()

```ts
discardDeadLetter(jobId, reason?): Promise<void>;
```

Defined in: [src/contracts.ts:109](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L109)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |
| `reason?` | `string` |

###### Returns

`Promise`\<`void`\>

<a id="api-enqueue-4"></a>

##### enqueue()

```ts
enqueue<TType>(
   type,
   payload,
options?): Promise<string>;
```

Defined in: [src/contracts.ts:89](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L89)

###### Type Parameters

| Type Parameter |
| ------ |
| `TType` *extends* `string` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `TType` |
| `payload` | [`JobPayload`](#api-jobpayload)\<`TJobs`, `TType`\> |
| `options?` | [`EnqueueOptions`](#api-enqueueoptions)\<`DeclaredJobContext`\<`TJobs`, `TType`\>, `object`\> |

###### Returns

`Promise`\<`string`\>

<a id="api-enqueuedetailed-4"></a>

##### enqueueDetailed()

```ts
enqueueDetailed<TType>(
   type,
   payload,
options?): Promise<EnqueueResult>;
```

Defined in: [src/contracts.ts:95](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L95)

###### Type Parameters

| Type Parameter |
| ------ |
| `TType` *extends* `string` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `TType` |
| `payload` | [`JobPayload`](#api-jobpayload)\<`TJobs`, `TType`\> |
| `options?` | [`EnqueueOptions`](#api-enqueueoptions)\<`DeclaredJobContext`\<`TJobs`, `TType`\>, `object`\> |

###### Returns

`Promise`\<[`EnqueueResult`](#api-enqueueresult)\>

<a id="api-getjob-5"></a>

##### getJob()

```ts
getJob<TType>(jobId): Promise<
  | JobRecord<JobPayload<TJobs, TType>, JobContextOf<TJobs, TType>>
| null>;
```

Defined in: [src/contracts.ts:101](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L101)

###### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TType` *extends* `string` | `Extract`\<keyof `TJobs`, `string`\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`Promise`\<
  \| [`JobRecord`](#api-jobrecord)\<[`JobPayload`](#api-jobpayload)\<`TJobs`, `TType`\>, [`JobContextOf`](#api-jobcontextof)\<`TJobs`, `TType`\>\>
  \| `null`\>

<a id="api-getjobhistory-4"></a>

##### getJobHistory()

```ts
getJobHistory(jobId): Promise<JobHistoryEntry[]>;
```

Defined in: [src/contracts.ts:105](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L105)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`Promise`\<[`JobHistoryEntry`](#api-jobhistoryentry)[]\>

<a id="api-listdeadletters-3"></a>

##### listDeadLetters()

```ts
listDeadLetters(filter?): Promise<JobRecord<unknown, unknown>[]>;
```

Defined in: [src/contracts.ts:107](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L107)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filter?` | [`DeadLetterFilter`](#api-deadletterfilter) |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\>[]\>

<a id="api-replaydeadletter-3"></a>

##### replayDeadLetter()

```ts
replayDeadLetter(jobId, options?): Promise<string>;
```

Defined in: [src/contracts.ts:108](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L108)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |
| `options?` | [`ReplayOptions`](#api-replayoptions) |

###### Returns

`Promise`\<`string`\>

## Type Aliases

<a id="api-anyjobdefinition"></a>

### AnyJobDefinition

```ts
type AnyJobDefinition =
  | JobBuilder<unknown, unknown, unknown>
| JobDefinition<unknown, unknown, unknown>;
```

Defined in: [src/contracts.ts:18](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L18)

***

<a id="api-backoffpolicy"></a>

### BackoffPolicy

```ts
type BackoffPolicy =
  | {
  delayMs: number;
  jitter?: number;
  type: "fixed";
}
  | {
  delayMs: number;
  jitter?: number;
  maxDelayMs?: number;
  type: "exponential";
};
```

Defined in: [src/retry.ts:2](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/retry.ts#L2)

***

<a id="api-emptyjobpayload"></a>

### EmptyJobPayload

```ts
type EmptyJobPayload = Record<string, never>;
```

Defined in: [src/contracts.ts:14](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L14)

***

<a id="api-enqueuecommitobserver"></a>

### EnqueueCommitObserver

```ts
type EnqueueCommitObserver = (result) => void;
```

Defined in: [src/backend/jobs-backend.interface.ts:11](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/backend/jobs-backend.interface.ts#L11)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `result` | [`EnqueueResult`](#api-enqueueresult) |

#### Returns

`void`

***

<a id="api-handlerfn"></a>

### HandlerFn

```ts
type HandlerFn = (payload, context) => Promise<unknown>;
```

Defined in: [src/handler-registry.ts:4](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/handler-registry.ts#L4)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `payload` | `Record`\<`string`, `unknown`\> |
| `context` | [`JobContext`](#api-jobcontext) |

#### Returns

`Promise`\<`unknown`\>

***

<a id="api-jobcontextof"></a>

### JobContextOf

```ts
type JobContextOf<TJobs, TType> = TJobs[TType] extends {
  __context?: infer TContext;
} ? TContext & JobContext : JobContext;
```

Defined in: [src/contracts.ts:53](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L53)

#### Type Parameters

| Type Parameter |
| ------ |
| `TJobs` *extends* [`JobDefinitions`](#api-jobdefinitions) |
| `TType` *extends* [`JobType`](#api-jobtype-4)\<`TJobs`\> |

***

<a id="api-jobdefinitions"></a>

### JobDefinitions

```ts
type JobDefinitions = Record<string, AnyJobDefinition>;
```

Defined in: [src/contracts.ts:16](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L16)

***

<a id="api-joblifecycleeventtype-1"></a>

### JobLifecycleEventType

```ts
type JobLifecycleEventType =
  | "job.enqueued"
  | "job.started"
  | "job.timed_out"
  | "job.succeeded"
  | "job.failed"
  | "job.retry_scheduled"
  | "job.dead_lettered"
  | "job.cancelled"
  | "job.discarded"
  | "job.replayed";
```

Defined in: [src/lifecycle.ts:65](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L65)

***

<a id="api-jobpayload"></a>

### JobPayload

```ts
type JobPayload<TJobs, TType> = TJobs[TType] extends {
  __payload?: infer TPayload;
} ? TPayload & object : never;
```

Defined in: [src/contracts.ts:48](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L48)

#### Type Parameters

| Type Parameter |
| ------ |
| `TJobs` *extends* [`JobDefinitions`](#api-jobdefinitions) |
| `TType` *extends* [`JobType`](#api-jobtype-4)\<`TJobs`\> |

***

<a id="api-jobresult"></a>

### JobResult

```ts
type JobResult<TJobs, TType> = TJobs[TType] extends {
  __result?: infer TResult;
} ? TResult : unknown;
```

Defined in: [src/contracts.ts:65](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L65)

#### Type Parameters

| Type Parameter |
| ------ |
| `TJobs` *extends* [`JobDefinitions`](#api-jobdefinitions) |
| `TType` *extends* [`JobType`](#api-jobtype-4)\<`TJobs`\> |

***

<a id="api-jobserrorcode-2"></a>

### JobsErrorCode

```ts
type JobsErrorCode = typeof JobsErrorCode[keyof typeof JobsErrorCode];
```

Defined in: [src/errors.ts:1](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L1)

***

<a id="api-jobstatus"></a>

### JobStatus

```ts
type JobStatus =
  | "queued"
  | "delayed"
  | "active"
  | "succeeded"
  | "failed"
  | "retrying"
  | "dead_letter"
  | "cancelled";
```

Defined in: [src/lifecycle.ts:1](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/lifecycle.ts#L1)

***

<a id="api-jobtype-4"></a>

### JobType

```ts
type JobType<TJobs> = Extract<keyof TJobs, string>;
```

Defined in: [src/contracts.ts:46](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L46)

#### Type Parameters

| Type Parameter |
| ------ |
| `TJobs` *extends* [`JobDefinitions`](#api-jobdefinitions) |

## Variables

<a id="api-context_key"></a>

### CONTEXT\_KEY

```ts
const CONTEXT_KEY: "__nestarcCtx" = '__nestarcCtx';
```

Defined in: [src/context-serializer.ts:6](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/context-serializer.ts#L6)

***

<a id="api-internal_job_key"></a>

### INTERNAL\_JOB\_KEY

```ts
const INTERNAL_JOB_KEY: "__nestarcJob" = '__nestarcJob';
```

Defined in: [src/context-serializer.ts:7](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/context-serializer.ts#L7)

***

<a id="api-job_handler_metadata"></a>

### JOB\_HANDLER\_METADATA

```ts
const JOB_HANDLER_METADATA: "nestarc:jobs:handler" = 'nestarc:jobs:handler';
```

Defined in: [src/decorators/job-handler.decorator.ts:3](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/decorators/job-handler.decorator.ts#L3)

***

<a id="api-jobs_backend"></a>

### JOBS\_BACKEND

```ts
const JOBS_BACKEND: typeof JOBS_BACKEND;
```

Defined in: [src/jobs.module.ts:32](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L32)

***

<a id="api-jobs_service"></a>

### JOBS\_SERVICE

```ts
const JOBS_SERVICE: typeof JOBS_SERVICE;
```

Defined in: [src/contracts.ts:12](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L12)

***

<a id="api-jobs_workers"></a>

### JOBS\_WORKERS

```ts
const JOBS_WORKERS: typeof JOBS_WORKERS;
```

Defined in: [src/jobs.module.ts:33](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/jobs.module.ts#L33)

***

<a id="api-jobserrorcode-1"></a>

### JobsErrorCode

```ts
const JobsErrorCode: {
  ActivationConflict: "jobs_activation_conflict";
  BackendClosed: "jobs_backend_closed";
  CapabilityUnsupported: "jobs_capability_unsupported";
  DrainLimitExceeded: "jobs_drain_limit_exceeded";
  FairnessMisconfig: "jobs_fairness_misconfig";
  HandlerNotFound: "jobs_handler_not_found";
  IdentityConflict: "jobs_identity_conflict";
  InvalidInput: "jobs_invalid_input";
  QueueNotFound: "jobs_queue_not_found";
  ReservedPayloadKey: "jobs_reserved_payload_key";
  SerializationInvalid: "jobs_serialization_invalid";
  ShutdownIncomplete: "jobs_shutdown_incomplete";
};
```

Defined in: [src/errors.ts:1](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L1)

#### Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="api-property-activationconflict"></a> `ActivationConflict` | `"jobs_activation_conflict"` | `'jobs_activation_conflict'` | [src/errors.ts:11](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L11) |
| <a id="api-property-backendclosed"></a> `BackendClosed` | `"jobs_backend_closed"` | `'jobs_backend_closed'` | [src/errors.ts:10](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L10) |
| <a id="api-property-capabilityunsupported"></a> `CapabilityUnsupported` | `"jobs_capability_unsupported"` | `'jobs_capability_unsupported'` | [src/errors.ts:9](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L9) |
| <a id="api-property-drainlimitexceeded"></a> `DrainLimitExceeded` | `"jobs_drain_limit_exceeded"` | `'jobs_drain_limit_exceeded'` | [src/errors.ts:2](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L2) |
| <a id="api-property-fairnessmisconfig"></a> `FairnessMisconfig` | `"jobs_fairness_misconfig"` | `'jobs_fairness_misconfig'` | [src/errors.ts:8](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L8) |
| <a id="api-property-handlernotfound"></a> `HandlerNotFound` | `"jobs_handler_not_found"` | `'jobs_handler_not_found'` | [src/errors.ts:6](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L6) |
| <a id="api-property-identityconflict"></a> `IdentityConflict` | `"jobs_identity_conflict"` | `'jobs_identity_conflict'` | [src/errors.ts:13](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L13) |
| <a id="api-property-invalidinput"></a> `InvalidInput` | `"jobs_invalid_input"` | `'jobs_invalid_input'` | [src/errors.ts:3](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L3) |
| <a id="api-property-queuenotfound"></a> `QueueNotFound` | `"jobs_queue_not_found"` | `'jobs_queue_not_found'` | [src/errors.ts:7](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L7) |
| <a id="api-property-reservedpayloadkey"></a> `ReservedPayloadKey` | `"jobs_reserved_payload_key"` | `'jobs_reserved_payload_key'` | [src/errors.ts:5](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L5) |
| <a id="api-property-serializationinvalid"></a> `SerializationInvalid` | `"jobs_serialization_invalid"` | `'jobs_serialization_invalid'` | [src/errors.ts:4](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L4) |
| <a id="api-property-shutdownincomplete"></a> `ShutdownIncomplete` | `"jobs_shutdown_incomplete"` | `'jobs_shutdown_incomplete'` | [src/errors.ts:12](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/errors.ts#L12) |

## Functions

<a id="api-attachcontext"></a>

### attachContext()

```ts
function attachContext<T>(payload, context): T & {
  __nestarcCtx: JobContext;
};
```

Defined in: [src/context-serializer.ts:9](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/context-serializer.ts#L9)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `payload` | `T` |
| `context` | [`JobContext`](#api-jobcontext) \| `undefined` |

#### Returns

`T` & \{
  `__nestarcCtx`: [`JobContext`](#api-jobcontext);
\}

***

<a id="api-computebackoffdelayms"></a>

### computeBackoffDelayMs()

```ts
function computeBackoffDelayMs(policy, attempt): number;
```

Defined in: [src/retry.ts:11](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/retry.ts#L11)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `policy` | [`BackoffPolicy`](#api-backoffpolicy) \| `undefined` |
| `attempt` | `number` |

#### Returns

`number`

***

<a id="api-createfakejobs"></a>

### createFakeJobs()

```ts
function createFakeJobs(opts): FakeJobsService;
```

Defined in: [src/fake-jobs.service.ts:83](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/fake-jobs.service.ts#L83)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`FakeJobsOptions`](#api-fakejobsoptions) |

#### Returns

[`FakeJobsService`](#api-fakejobsservice)

***

<a id="api-createoutboxjobspublisher"></a>

### createOutboxJobsPublisher()

```ts
function createOutboxJobsPublisher(publisherOptions): Type<OutboxPublisher>;
```

Defined in: [src/outbox/outbox-jobs-publisher.ts:50](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/outbox/outbox-jobs-publisher.ts#L50)

Creates an OutboxPublisher-compatible Nest provider for use as
`OutboxModule.forRoot({ transport: createOutboxJobsPublisher(...),
delivery: { mode: 'publisher' } })`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `publisherOptions` | [`OutboxJobsPublisherOptions`](#api-outboxjobspublisheroptions) |

#### Returns

`Type`\<[`OutboxPublisher`](#api-outboxpublisher)\>

***

<a id="api-definejobs"></a>

### defineJobs()

```ts
function defineJobs<TJobs>(definitions): TJobs;
```

Defined in: [src/contracts.ts:141](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L141)

#### Type Parameters

| Type Parameter |
| ------ |
| `TJobs` *extends* [`JobDefinitions`](#api-jobdefinitions) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `definitions` | `TJobs` |

#### Returns

`TJobs`

***

<a id="api-detachcontext"></a>

### detachContext()

```ts
function detachContext<T>(envelope): {
  context: JobContext;
  payload: Omit<T, typeof CONTEXT_KEY>;
};
```

Defined in: [src/context-serializer.ts:29](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/context-serializer.ts#L29)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `envelope` | `T` |

#### Returns

```ts
{
  context: JobContext;
  payload: Omit<T, typeof CONTEXT_KEY>;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `context` | [`JobContext`](#api-jobcontext) | [src/context-serializer.ts:31](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/context-serializer.ts#L31) |
| `payload` | `Omit`\<`T`, *typeof* [`CONTEXT_KEY`](#api-context_key)\> | [src/context-serializer.ts:31](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/context-serializer.ts#L31) |

***

<a id="api-injectjobs"></a>

### InjectJobs()

```ts
function InjectJobs(): PropertyDecorator & ParameterDecorator;
```

Defined in: [src/contracts.ts:145](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L145)

#### Returns

`PropertyDecorator` & `ParameterDecorator`

***

<a id="api-job"></a>

### job()

```ts
function job<TPayload>(..._invalid): JobBuilder<TPayload, JobContext, unknown>;
```

Defined in: [src/contracts.ts:135](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/contracts.ts#L135)

#### Type Parameters

| Type Parameter |
| ------ |
| `TPayload` *extends* `object` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`_invalid` | `PlainObjectArguments`\<`TPayload`\> |

#### Returns

[`JobBuilder`](#api-jobbuilder)\<`TPayload`, [`JobContext`](#api-jobcontext), `unknown`\>

***

<a id="api-jobhandler"></a>

### JobHandler()

```ts
function JobHandler(jobType): MethodDecorator;
```

Defined in: [src/decorators/job-handler.decorator.ts:5](https://github.com/nestarc/jobs/blob/563612539401f49fa6b1ab0c9c265f79e8f61741/src/decorators/job-handler.decorator.ts#L5)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |

#### Returns

`MethodDecorator`
