# @nestarc/jobs

## Classes

<a id="api-bullmqbackend"></a>

### BullMQBackend

Defined in: [src/backend/bullmq-backend.ts:30](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L30)

#### Implements

- [`JobsBackend`](#api-jobsbackend)

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new BullMQBackend(opts): BullMQBackend;
```

Defined in: [src/backend/bullmq-backend.ts:34](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L34)

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
ack(): Promise<void>;
```

Defined in: [src/backend/bullmq-backend.ts:111](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L111)

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`ack`](#api-ack-2)

<a id="api-capabilities"></a>

##### capabilities()

```ts
capabilities(): BackendCapabilities;
```

Defined in: [src/backend/bullmq-backend.ts:36](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L36)

###### Returns

[`BackendCapabilities`](#api-backendcapabilities)

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`capabilities`](#api-capabilities-2)

<a id="api-close"></a>

##### close()

```ts
close(): Promise<void>;
```

Defined in: [src/backend/bullmq-backend.ts:180](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L180)

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`close`](#api-close-2)

<a id="api-enqueue"></a>

##### enqueue()

```ts
enqueue(
   jobType,
   envelope,
opts): Promise<string>;
```

Defined in: [src/backend/bullmq-backend.ts:53](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L53)

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

<a id="api-fail"></a>

##### fail()

```ts
fail(): Promise<void>;
```

Defined in: [src/backend/bullmq-backend.ts:114](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L114)

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`fail`](#api-fail-2)

<a id="api-getjob"></a>

##### getJob()

```ts
getJob(jobId): Promise<JobRecord<unknown, unknown> | null>;
```

Defined in: [src/backend/bullmq-backend.ts:68](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L68)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\> \| `null`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`getJob`](#api-getjob-2)

<a id="api-getjobhistory"></a>

##### getJobHistory()

```ts
getJobHistory(jobId): Promise<JobHistoryEntry[]>;
```

Defined in: [src/backend/bullmq-backend.ts:93](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L93)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`Promise`\<[`JobHistoryEntry`](#api-jobhistoryentry)[]\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`getJobHistory`](#api-getjobhistory-2)

<a id="api-getrawqueue"></a>

##### getRawQueue()

```ts
getRawQueue(jobType): Queue;
```

Defined in: [src/backend/bullmq-backend.ts:198](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L198)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |

###### Returns

`Queue`

<a id="api-movetoactive"></a>

##### moveToActive()

```ts
moveToActive(): Promise<JobEnvelope<unknown> | null>;
```

Defined in: [src/backend/bullmq-backend.ts:108](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L108)

###### Returns

`Promise`\<[`JobEnvelope`](#api-jobenvelope)\<`unknown`\> \| `null`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`moveToActive`](#api-movetoactive-2)

<a id="api-peekwaiting"></a>

##### peekWaiting()

```ts
peekWaiting(): Promise<JobEnvelope<unknown>[]>;
```

Defined in: [src/backend/bullmq-backend.ts:102](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L102)

###### Returns

`Promise`\<[`JobEnvelope`](#api-jobenvelope)\<`unknown`\>[]\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`peekWaiting`](#api-peekwaiting-2)

<a id="api-startconsumer"></a>

##### startConsumer()

```ts
startConsumer(jobTypes, consumer): void;
```

Defined in: [src/backend/bullmq-backend.ts:118](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L118)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobTypes` | `string`[] |
| `consumer` | `BullMQConsumerOptions` |

###### Returns

`void`

***

<a id="api-fairworker"></a>

### FairWorker

Defined in: [src/fair-worker.ts:19](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L19)

#### Constructors

<a id="api-constructor-1"></a>

##### Constructor

```ts
new FairWorker(opts): FairWorker;
```

Defined in: [src/fair-worker.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L20)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`FairWorkerOptions`](#api-fairworkeroptions) |

###### Returns

[`FairWorker`](#api-fairworker)

#### Methods

<a id="api-tick"></a>

##### tick()

```ts
tick(): Promise<boolean>;
```

Defined in: [src/fair-worker.ts:22](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L22)

###### Returns

`Promise`\<`boolean`\>

***

<a id="api-fakeclock"></a>

### FakeClock

Defined in: [src/fake-clock.ts:1](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-clock.ts#L1)

#### Constructors

<a id="api-constructor-2"></a>

##### Constructor

```ts
new FakeClock(now?): FakeClock;
```

Defined in: [src/fake-clock.ts:4](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-clock.ts#L4)

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

Defined in: [src/fake-clock.ts:12](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-clock.ts#L12)

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

Defined in: [src/fake-clock.ts:8](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-clock.ts#L8)

###### Returns

`Date`

<a id="api-set"></a>

##### set()

```ts
set(next): Date;
```

Defined in: [src/fake-clock.ts:17](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-clock.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `next` | `string` \| `number` \| `Date` |

###### Returns

`Date`

***

<a id="api-fakejobsservice"></a>

### FakeJobsService

Defined in: [src/fake-jobs.service.ts:16](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L16)

#### Constructors

<a id="api-constructor-3"></a>

##### Constructor

```ts
new FakeJobsService(opts): FakeJobsService;
```

Defined in: [src/fake-jobs.service.ts:24](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L24)

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

Defined in: [src/fake-jobs.service.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L20)

<a id="api-clock"></a>

##### clock

```ts
readonly clock: FakeClock;
```

Defined in: [src/fake-jobs.service.ts:19](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L19)

<a id="api-registry-1"></a>

##### registry

```ts
readonly registry: HandlerRegistry;
```

Defined in: [src/fake-jobs.service.ts:18](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L18)

<a id="api-schedulers"></a>

##### schedulers

```ts
readonly schedulers: Map<string, Scheduler>;
```

Defined in: [src/fake-jobs.service.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L21)

<a id="api-service"></a>

##### service

```ts
readonly service: JobsService;
```

Defined in: [src/fake-jobs.service.ts:17](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L17)

#### Methods

<a id="api-drain"></a>

##### drain()

```ts
drain(maxIterations?): Promise<void>;
```

Defined in: [src/fake-jobs.service.ts:55](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L55)

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

Defined in: [src/fake-jobs.service.ts:59](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L59)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `maxIterations` | `number` | `1000` |

###### Returns

`Promise`\<`void`\>

***

<a id="api-handlerregistry"></a>

### HandlerRegistry

Defined in: [src/handler-registry.ts:9](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/handler-registry.ts#L9)

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

Defined in: [src/handler-registry.ts:19](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/handler-registry.ts#L19)

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

Defined in: [src/handler-registry.ts:29](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/handler-registry.ts#L29)

###### Returns

`string`[]

<a id="api-register"></a>

##### register()

```ts
register(jobType, handler): void;
```

Defined in: [src/handler-registry.ts:12](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/handler-registry.ts#L12)

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

Defined in: [src/backend/in-memory-backend.ts:32](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L32)

#### Implements

- [`JobsBackend`](#api-jobsbackend)

#### Constructors

<a id="api-constructor-5"></a>

##### Constructor

```ts
new InMemoryBackend(opts?): InMemoryBackend;
```

Defined in: [src/backend/in-memory-backend.ts:39](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `InMemoryBackendOptions` |

###### Returns

[`InMemoryBackend`](#api-inmemorybackend)

#### Methods

<a id="api-ack-1"></a>

##### ack()

```ts
ack(jobType, jobId): Promise<void | JobRecord<unknown, unknown>>;
```

Defined in: [src/backend/in-memory-backend.ts:128](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L128)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `jobId` | `string` |

###### Returns

`Promise`\<`void` \| [`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\>\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`ack`](#api-ack-2)

<a id="api-capabilities-1"></a>

##### capabilities()

```ts
capabilities(): BackendCapabilities;
```

Defined in: [src/backend/in-memory-backend.ts:41](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L41)

###### Returns

[`BackendCapabilities`](#api-backendcapabilities)

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`capabilities`](#api-capabilities-2)

<a id="api-close-1"></a>

##### close()

```ts
close(): Promise<void>;
```

Defined in: [src/backend/in-memory-backend.ts:229](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L229)

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`close`](#api-close-2)

<a id="api-discarddeadletter"></a>

##### discardDeadLetter()

```ts
discardDeadLetter(jobId, reason?): Promise<void>;
```

Defined in: [src/backend/in-memory-backend.ts:222](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L222)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `jobId` | `string` | `undefined` |
| `reason` | `string` | `'discarded'` |

###### Returns

`Promise`\<`void`\>

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

Defined in: [src/backend/in-memory-backend.ts:58](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L58)

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
opts): Promise<EnqueueResult>;
```

Defined in: [src/backend/in-memory-backend.ts:66](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L66)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `envelope` | `Record`\<`string`, `unknown`\> |
| `opts` | [`EnqueueOptions`](#api-enqueueoptions) |

###### Returns

`Promise`\<[`EnqueueResult`](#api-enqueueresult)\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`enqueueDetailed`](#api-enqueuedetailed-1)

<a id="api-fail-1"></a>

##### fail()

```ts
fail(
   jobType,
   jobId,
reason): Promise<void | JobRecord<unknown, unknown>>;
```

Defined in: [src/backend/in-memory-backend.ts:137](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L137)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `jobId` | `string` |
| `reason` | `string` |

###### Returns

`Promise`\<`void` \| [`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\>\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`fail`](#api-fail-2)

<a id="api-getjob-1"></a>

##### getJob()

```ts
getJob(jobId): Promise<JobRecord<unknown, unknown> | null>;
```

Defined in: [src/backend/in-memory-backend.ts:177](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L177)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\> \| `null`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`getJob`](#api-getjob-2)

<a id="api-getjobhistory-1"></a>

##### getJobHistory()

```ts
getJobHistory(jobId): Promise<JobHistoryEntry[]>;
```

Defined in: [src/backend/in-memory-backend.ts:182](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L182)

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

Defined in: [src/backend/in-memory-backend.ts:186](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L186)

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

Defined in: [src/backend/in-memory-backend.ts:169](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L169)

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
error?): Promise<JobRecord<unknown, unknown> | null>;
```

Defined in: [src/backend/in-memory-backend.ts:142](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L142)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `jobId` | `string` |
| `reason` | `string` |
| `error?` | [`JobErrorSummary`](#api-joberrorsummary) |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\> \| `null`\>

<a id="api-movetoactive-1"></a>

##### moveToActive()

```ts
moveToActive(jobType, jobId): Promise<JobEnvelope<unknown> | null>;
```

Defined in: [src/backend/in-memory-backend.ts:117](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L117)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `jobId` | `string` |

###### Returns

`Promise`\<[`JobEnvelope`](#api-jobenvelope)\<`unknown`\> \| `null`\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`moveToActive`](#api-movetoactive-2)

<a id="api-peekwaiting-1"></a>

##### peekWaiting()

```ts
peekWaiting(jobType): Promise<JobEnvelope<unknown>[]>;
```

Defined in: [src/backend/in-memory-backend.ts:111](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L111)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |

###### Returns

`Promise`\<[`JobEnvelope`](#api-jobenvelope)\<`unknown`\>[]\>

###### Implementation of

[`JobsBackend`](#api-jobsbackend).[`peekWaiting`](#api-peekwaiting-2)

<a id="api-replaydeadletter"></a>

##### replayDeadLetter()

```ts
replayDeadLetter(jobId, options?): Promise<string>;
```

Defined in: [src/backend/in-memory-backend.ts:201](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L201)

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

Defined in: [src/errors.ts:10](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L10)

#### Extends

- `Error`

#### Constructors

<a id="api-constructor-6"></a>

##### Constructor

```ts
new JobsError(code, reason?): JobsError;
```

Defined in: [src/errors.ts:13](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L13)

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

Defined in: [src/errors.ts:11](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L11)

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

Defined in: [src/jobs.module.ts:115](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L115)

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

Defined in: [src/jobs.module.ts:186](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L186)

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

Defined in: [src/jobs.module.ts:116](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L116)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`InMemoryOptions`](#api-inmemoryoptions) |

###### Returns

`DynamicModule`

***

<a id="api-jobsoutboxbridge"></a>

### JobsOutboxBridge

Defined in: [src/outbox/outbox-bridge.module.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L20)

#### Constructors

<a id="api-constructor-8"></a>

##### Constructor

```ts
new JobsOutboxBridge(opts): JobsOutboxBridge;
```

Defined in: [src/outbox/outbox-bridge.module.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L21)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`JobsOutboxBridgeOptions`](#api-jobsoutboxbridgeoptions) |

###### Returns

[`JobsOutboxBridge`](#api-jobsoutboxbridge)

***

<a id="api-jobsservice"></a>

### JobsService

Defined in: [src/jobs.service.ts:27](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L27)

#### Constructors

<a id="api-constructor-9"></a>

##### Constructor

```ts
new JobsService(deps): JobsService;
```

Defined in: [src/jobs.service.ts:31](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L31)

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

Defined in: [src/jobs.service.ts:70](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L70)

###### Returns

[`BackendCapabilities`](#api-backendcapabilities)

<a id="api-discarddeadletter-2"></a>

##### discardDeadLetter()

```ts
discardDeadLetter(jobId, reason?): Promise<void>;
```

Defined in: [src/jobs.service.ts:94](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L94)

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

Defined in: [src/jobs.service.ts:36](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L36)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `payload` | `Record`\<`string`, `unknown`\> |
| `opts` | [`EnqueueOptions`](#api-enqueueoptions) |

###### Returns

`Promise`\<`string`\>

<a id="api-enqueuedetailed-2"></a>

##### enqueueDetailed()

```ts
enqueueDetailed(
   jobType,
   payload,
opts?): Promise<EnqueueResult>;
```

Defined in: [src/jobs.service.ts:44](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L44)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `payload` | `Record`\<`string`, `unknown`\> |
| `opts` | [`EnqueueOptions`](#api-enqueueoptions) |

###### Returns

`Promise`\<[`EnqueueResult`](#api-enqueueresult)\>

<a id="api-getjob-3"></a>

##### getJob()

```ts
getJob(jobId): Promise<JobRecord<unknown, unknown> | null>;
```

Defined in: [src/jobs.service.ts:74](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L74)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\> \| `null`\>

<a id="api-getjobhistory-3"></a>

##### getJobHistory()

```ts
getJobHistory(jobId): Promise<JobHistoryEntry[]>;
```

Defined in: [src/jobs.service.ts:78](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L78)

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

Defined in: [src/jobs.service.ts:82](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L82)

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

Defined in: [src/jobs.service.ts:87](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L87)

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

Defined in: [src/jobs.service.ts:105](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L105)

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

Defined in: [src/jobs.service.ts:101](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L101)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `tenantId` | `string` |
| `weight` | `number` |

###### Returns

`void`

***

<a id="api-scheduler-2"></a>

### Scheduler

Defined in: [src/scheduler.ts:23](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L23)

#### Constructors

<a id="api-constructor-10"></a>

##### Constructor

```ts
new Scheduler(opts): Scheduler;
```

Defined in: [src/scheduler.ts:29](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L29)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`SchedulerOptions`](#api-scheduleroptions) |

###### Returns

[`Scheduler`](#api-scheduler-2)

#### Methods

<a id="api-onack"></a>

##### onAck()

```ts
onAck(jobId): void;
```

Defined in: [src/scheduler.ts:48](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L48)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |

###### Returns

`void`

<a id="api-onenqueue"></a>

##### onEnqueue()

```ts
onEnqueue(jobId, tenantId): void;
```

Defined in: [src/scheduler.ts:43](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L43)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |
| `tenantId` | `string` |

###### Returns

`void`

<a id="api-picknext"></a>

##### pickNext()

```ts
pickNext(): PickedJob | null;
```

Defined in: [src/scheduler.ts:58](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L58)

###### Returns

[`PickedJob`](#api-pickedjob) \| `null`

<a id="api-setweight"></a>

##### setWeight()

```ts
setWeight(tenantId, weight): void;
```

Defined in: [src/scheduler.ts:38](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L38)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `tenantId` | `string` |
| `weight` | `number` |

###### Returns

`void`

<a id="api-snapshot"></a>

##### snapshot()

```ts
snapshot(): {
  inflight: number;
  starvationTokens: number;
  tenantId: string;
  waiting: number;
  weight: number;
}[];
```

Defined in: [src/scheduler.ts:95](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L95)

###### Returns

\{
  `inflight`: `number`;
  `starvationTokens`: `number`;
  `tenantId`: `string`;
  `waiting`: `number`;
  `weight`: `number`;
\}[]

## Interfaces

<a id="api-backendcapabilities"></a>

### BackendCapabilities

Defined in: [src/lifecycle.ts:48](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L48)

#### Properties

<a id="api-backoff"></a>

##### backoff

```ts
backoff: boolean;
```

Defined in: [src/lifecycle.ts:53](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L53)

<a id="api-deadletter"></a>

##### deadLetter

```ts
deadLetter: boolean;
```

Defined in: [src/lifecycle.ts:58](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L58)

<a id="api-delayed"></a>

##### delayed

```ts
delayed: boolean;
```

Defined in: [src/lifecycle.ts:51](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L51)

<a id="api-distributed"></a>

##### distributed

```ts
distributed: boolean;
```

Defined in: [src/lifecycle.ts:50](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L50)

<a id="api-durable"></a>

##### durable

```ts
durable: boolean;
```

Defined in: [src/lifecycle.ts:49](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L49)

<a id="api-fairness"></a>

##### fairness

```ts
fairness: "none" | "local-tenant";
```

Defined in: [src/lifecycle.ts:59](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L59)

<a id="api-history"></a>

##### history

```ts
history: boolean;
```

Defined in: [src/lifecycle.ts:56](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L56)

<a id="api-idempotency"></a>

##### idempotency

```ts
idempotency: boolean;
```

Defined in: [src/lifecycle.ts:57](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L57)

<a id="api-manualdrain"></a>

##### manualDrain

```ts
manualDrain: boolean;
```

Defined in: [src/lifecycle.ts:60](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L60)

<a id="api-retries"></a>

##### retries

```ts
retries: boolean;
```

Defined in: [src/lifecycle.ts:52](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L52)

<a id="api-statusquery"></a>

##### statusQuery

```ts
statusQuery: boolean;
```

Defined in: [src/lifecycle.ts:55](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L55)

<a id="api-timeout"></a>

##### timeout

```ts
timeout: boolean;
```

Defined in: [src/lifecycle.ts:54](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L54)

***

<a id="api-bullmqbackendoptions"></a>

### BullMQBackendOptions

Defined in: [src/backend/bullmq-backend.ts:15](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L15)

#### Properties

<a id="api-connection"></a>

##### connection

```ts
connection: ConnectionOptions;
```

Defined in: [src/backend/bullmq-backend.ts:17](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L17)

<a id="api-namespace"></a>

##### namespace?

```ts
optional namespace?: string;
```

Defined in: [src/backend/bullmq-backend.ts:16](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L16)

<a id="api-workerconcurrency"></a>

##### workerConcurrency?

```ts
optional workerConcurrency?: number;
```

Defined in: [src/backend/bullmq-backend.ts:18](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L18)

***

<a id="api-bullmqoptions"></a>

### BullMQOptions

Defined in: [src/jobs.module.ts:76](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L76)

#### Properties

<a id="api-backend"></a>

##### backend

```ts
backend: BullMQBackend;
```

Defined in: [src/jobs.module.ts:77](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L77)

<a id="api-contextextractor"></a>

##### contextExtractor?

```ts
optional contextExtractor?: () => JobContext;
```

Defined in: [src/jobs.module.ts:83](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L83)

###### Returns

[`JobContext`](#api-jobcontext)

<a id="api-contextrunner"></a>

##### contextRunner?

```ts
optional contextRunner?: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/jobs.module.ts:84](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L84)

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

Defined in: [src/jobs.module.ts:82](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L82)

<a id="api-global"></a>

##### global?

```ts
optional global?: boolean;
```

Defined in: [src/jobs.module.ts:80](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L80)

<a id="api-jobs"></a>

##### jobs?

```ts
optional jobs?: JobDefinitions;
```

Defined in: [src/jobs.module.ts:79](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L79)

<a id="api-jobtypes"></a>

##### jobTypes

```ts
jobTypes: string[];
```

Defined in: [src/jobs.module.ts:78](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L78)

<a id="api-onjobfail"></a>

##### onJobFail?

```ts
optional onJobFail?: (e, err) => void;
```

Defined in: [src/jobs.module.ts:87](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L87)

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

Defined in: [src/jobs.module.ts:86](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L86)

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

Defined in: [src/jobs.module.ts:85](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L85)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#api-jobevent) |

###### Returns

`void`

<a id="api-strictcapabilities"></a>

##### strictCapabilities?

```ts
optional strictCapabilities?: boolean;
```

Defined in: [src/jobs.module.ts:81](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L81)

***

<a id="api-deadletterfilter"></a>

### DeadLetterFilter

Defined in: [src/lifecycle.ts:96](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L96)

#### Properties

<a id="api-tenantid"></a>

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/lifecycle.ts:98](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L98)

<a id="api-type"></a>

##### type?

```ts
optional type?: string;
```

Defined in: [src/lifecycle.ts:97](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L97)

***

<a id="api-dedupeoptions"></a>

### DedupeOptions

Defined in: [src/types.ts:43](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L43)

#### Properties

<a id="api-key"></a>

##### key

```ts
key: string;
```

Defined in: [src/types.ts:44](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L44)

<a id="api-mode"></a>

##### mode?

```ts
optional mode?: "while_active" | "until_completed";
```

Defined in: [src/types.ts:47](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L47)

<a id="api-scope"></a>

##### scope?

```ts
optional scope?: "global" | "tenant";
```

Defined in: [src/types.ts:45](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L45)

<a id="api-ttlms"></a>

##### ttlMs?

```ts
optional ttlMs?: number;
```

Defined in: [src/types.ts:46](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L46)

***

<a id="api-enqueueoptions"></a>

### EnqueueOptions

Defined in: [src/types.ts:50](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L50)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TContext` | [`JobContext`](#api-jobcontext) |

#### Properties

<a id="api-attempts"></a>

##### attempts?

```ts
optional attempts?: number;
```

Defined in: [src/types.ts:56](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L56)

<a id="api-backoff-1"></a>

##### backoff?

```ts
optional backoff?: BackoffPolicy;
```

Defined in: [src/types.ts:57](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L57)

<a id="api-context"></a>

##### context?

```ts
optional context?: TContext;
```

Defined in: [src/types.ts:52](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L52)

<a id="api-dedupe"></a>

##### dedupe?

```ts
optional dedupe?: DedupeOptions;
```

Defined in: [src/types.ts:60](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L60)

<a id="api-delay"></a>

##### delay?

```ts
optional delay?: number;
```

Defined in: [src/types.ts:53](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L53)

<a id="api-delayms"></a>

##### delayMs?

```ts
optional delayMs?: number;
```

Defined in: [src/types.ts:54](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L54)

<a id="api-idempotencykey"></a>

##### idempotencyKey?

```ts
optional idempotencyKey?: string;
```

Defined in: [src/types.ts:59](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L59)

<a id="api-jobid"></a>

##### jobId?

```ts
optional jobId?: string;
```

Defined in: [src/types.ts:51](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L51)

<a id="api-metadata"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/types.ts:61](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L61)

<a id="api-scheduledfor"></a>

##### scheduledFor?

```ts
optional scheduledFor?: Date;
```

Defined in: [src/types.ts:55](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L55)

<a id="api-timeoutms"></a>

##### timeoutMs?

```ts
optional timeoutMs?: number;
```

Defined in: [src/types.ts:58](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L58)

***

<a id="api-enqueueresult"></a>

### EnqueueResult

Defined in: [src/lifecycle.ts:90](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L90)

#### Properties

<a id="api-existingjobid"></a>

##### existingJobId?

```ts
optional existingJobId?: string;
```

Defined in: [src/lifecycle.ts:93](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L93)

<a id="api-jobid-1"></a>

##### jobId

```ts
jobId: string;
```

Defined in: [src/lifecycle.ts:92](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L92)

<a id="api-status"></a>

##### status

```ts
status: "created" | "deduped";
```

Defined in: [src/lifecycle.ts:91](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L91)

***

<a id="api-fairworkeroptions"></a>

### FairWorkerOptions

Defined in: [src/fair-worker.ts:7](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L7)

#### Properties

<a id="api-backend-1"></a>

##### backend

```ts
backend: JobsBackend;
```

Defined in: [src/fair-worker.ts:9](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L9)

<a id="api-contextrunner-1"></a>

##### contextRunner

```ts
contextRunner: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/fair-worker.ts:12](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L12)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`JobContext`](#api-jobcontext) |
| `fn` | () => `Promise`\<`unknown`\> |

###### Returns

`Promise`\<`unknown`\>

<a id="api-events-1"></a>

##### events?

```ts
optional events?: JobEventsOptions;
```

Defined in: [src/fair-worker.ts:16](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L16)

<a id="api-jobtype"></a>

##### jobType

```ts
jobType: string;
```

Defined in: [src/fair-worker.ts:8](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L8)

<a id="api-onfail"></a>

##### onFail?

```ts
optional onFail?: (e, err) => void;
```

Defined in: [src/fair-worker.ts:15](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L15)

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

Defined in: [src/fair-worker.ts:14](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L14)

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

Defined in: [src/fair-worker.ts:13](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L13)

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

Defined in: [src/fair-worker.ts:11](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L11)

<a id="api-scheduler"></a>

##### scheduler

```ts
scheduler: Scheduler;
```

Defined in: [src/fair-worker.ts:10](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L10)

***

<a id="api-fakejobsoptions"></a>

### FakeJobsOptions

Defined in: [src/fake-jobs.service.ts:9](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L9)

#### Extends

- `Partial`\<[`SchedulerOptions`](#api-scheduleroptions)\>

#### Properties

<a id="api-contextextractor-1"></a>

##### contextExtractor?

```ts
optional contextExtractor?: () => JobContext;
```

Defined in: [src/fake-jobs.service.ts:12](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L12)

###### Returns

[`JobContext`](#api-jobcontext)

<a id="api-contextrunner-2"></a>

##### contextRunner?

```ts
optional contextRunner?: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/fake-jobs.service.ts:13](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L13)

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

Defined in: [src/scheduler.ts:4](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L4)

###### Inherited from

[`SchedulerOptions`](#api-scheduleroptions).[`defaultWeight`](#api-defaultweight-1)

<a id="api-jobtypes-1"></a>

##### jobTypes

```ts
jobTypes: string[];
```

Defined in: [src/fake-jobs.service.ts:10](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L10)

<a id="api-minsharepct"></a>

##### minSharePct?

```ts
optional minSharePct?: number;
```

Defined in: [src/scheduler.ts:5](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L5)

###### Inherited from

[`SchedulerOptions`](#api-scheduleroptions).[`minSharePct`](#api-minsharepct-1)

<a id="api-now-1"></a>

##### now?

```ts
optional now?: string | number | Date;
```

Defined in: [src/fake-jobs.service.ts:11](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L11)

<a id="api-tenantcap"></a>

##### tenantCap?

```ts
optional tenantCap?: number;
```

Defined in: [src/scheduler.ts:6](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L6)

###### Inherited from

[`SchedulerOptions`](#api-scheduleroptions).[`tenantCap`](#api-tenantcap-1)

***

<a id="api-inmemoryoptions"></a>

### InMemoryOptions

Defined in: [src/jobs.module.ts:61](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L61)

#### Properties

<a id="api-concurrency"></a>

##### concurrency?

```ts
optional concurrency?: {
  tenantCap?: number;
};
```

Defined in: [src/jobs.module.ts:67](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L67)

###### tenantCap?

```ts
optional tenantCap?: number;
```

<a id="api-contextextractor-2"></a>

##### contextExtractor?

```ts
optional contextExtractor?: () => JobContext;
```

Defined in: [src/jobs.module.ts:69](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L69)

###### Returns

[`JobContext`](#api-jobcontext)

<a id="api-contextrunner-3"></a>

##### contextRunner?

```ts
optional contextRunner?: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/jobs.module.ts:70](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L70)

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

Defined in: [src/jobs.module.ts:66](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L66)

<a id="api-fairness-1"></a>

##### fairness?

```ts
optional fairness?: {
  defaultWeight?: number;
  minSharePct?: number;
};
```

Defined in: [src/jobs.module.ts:68](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L68)

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

Defined in: [src/jobs.module.ts:64](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L64)

<a id="api-jobs-1"></a>

##### jobs?

```ts
optional jobs?: JobDefinitions;
```

Defined in: [src/jobs.module.ts:63](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L63)

<a id="api-jobtypes-2"></a>

##### jobTypes

```ts
jobTypes: string[];
```

Defined in: [src/jobs.module.ts:62](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L62)

<a id="api-onjobfail-1"></a>

##### onJobFail?

```ts
optional onJobFail?: (e, err) => void;
```

Defined in: [src/jobs.module.ts:73](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L73)

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

Defined in: [src/jobs.module.ts:72](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L72)

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

Defined in: [src/jobs.module.ts:71](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L71)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#api-jobevent) |

###### Returns

`void`

<a id="api-strictcapabilities-1"></a>

##### strictCapabilities?

```ts
optional strictCapabilities?: boolean;
```

Defined in: [src/jobs.module.ts:65](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L65)

***

<a id="api-jobbuilder"></a>

### JobBuilder

Defined in: [src/contracts.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L20)

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

Defined in: [src/contracts.ts:22](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L22)

<a id="api-__payload"></a>

##### \_\_payload?

```ts
readonly optional __payload?: TPayload;
```

Defined in: [src/contracts.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L21)

<a id="api-__result"></a>

##### \_\_result?

```ts
readonly optional __result?: TResult;
```

Defined in: [src/contracts.ts:23](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L23)

#### Methods

<a id="api-context-1"></a>

##### context()

```ts
context<TNextContext>(): JobBuilder<TPayload, TNextContext, TResult>;
```

Defined in: [src/contracts.ts:24](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L24)

###### Type Parameters

| Type Parameter |
| ------ |
| `TNextContext` |

###### Returns

[`JobBuilder`](#api-jobbuilder)\<`TPayload`, `TNextContext`, `TResult`\>

<a id="api-defaults"></a>

##### defaults()

```ts
defaults(defaults): JobDefinition<TPayload, TContext, TResult>;
```

Defined in: [src/contracts.ts:26](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L26)

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

Defined in: [src/contracts.ts:25](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L25)

###### Type Parameters

| Type Parameter |
| ------ |
| `TNextResult` |

###### Returns

[`JobBuilder`](#api-jobbuilder)\<`TPayload`, `TContext`, `TNextResult`\>

***

<a id="api-jobcontext"></a>

### JobContext

Defined in: [src/types.ts:3](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L3)

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

Defined in: [src/types.ts:5](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L5)

<a id="api-tenantid-1"></a>

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/types.ts:4](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L4)

***

<a id="api-jobdefaults"></a>

### JobDefaults

Defined in: [src/contracts.ts:29](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L29)

#### Properties

<a id="api-attempts-1"></a>

##### attempts?

```ts
optional attempts?: number;
```

Defined in: [src/contracts.ts:30](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L30)

<a id="api-backoff-2"></a>

##### backoff?

```ts
optional backoff?: BackoffPolicy;
```

Defined in: [src/contracts.ts:32](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L32)

<a id="api-timeoutms-1"></a>

##### timeoutMs?

```ts
optional timeoutMs?: number;
```

Defined in: [src/contracts.ts:31](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L31)

***

<a id="api-jobdefinition"></a>

### JobDefinition

Defined in: [src/contracts.ts:13](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L13)

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

Defined in: [src/contracts.ts:15](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L15)

<a id="api-__payload-1"></a>

##### \_\_payload?

```ts
readonly optional __payload?: TPayload;
```

Defined in: [src/contracts.ts:14](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L14)

<a id="api-__result-1"></a>

##### \_\_result?

```ts
readonly optional __result?: TResult;
```

Defined in: [src/contracts.ts:16](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L16)

<a id="api-defaults-1"></a>

##### defaults

```ts
readonly defaults: JobDefaults;
```

Defined in: [src/contracts.ts:17](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L17)

***

<a id="api-jobenvelope"></a>

### JobEnvelope

Defined in: [src/types.ts:9](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L9)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

<a id="api-attempts-2"></a>

##### attempts

```ts
attempts: number;
```

Defined in: [src/types.ts:15](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L15)

<a id="api-backoff-3"></a>

##### backoff?

```ts
optional backoff?: BackoffPolicy;
```

Defined in: [src/types.ts:19](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L19)

<a id="api-context-2"></a>

##### context

```ts
context: JobContext;
```

Defined in: [src/types.ts:13](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L13)

<a id="api-dedupekey"></a>

##### dedupeKey?

```ts
optional dedupeKey?: string;
```

Defined in: [src/types.ts:22](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L22)

<a id="api-enqueuedat"></a>

##### enqueuedAt

```ts
enqueuedAt: Date;
```

Defined in: [src/types.ts:14](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L14)

<a id="api-id"></a>

##### id

```ts
id: string;
```

Defined in: [src/types.ts:10](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L10)

<a id="api-idempotencykey-1"></a>

##### idempotencyKey?

```ts
optional idempotencyKey?: string;
```

Defined in: [src/types.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L21)

<a id="api-jobtype-1"></a>

##### jobType

```ts
jobType: string;
```

Defined in: [src/types.ts:11](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L11)

<a id="api-maxattempts"></a>

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/types.ts:16](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L16)

<a id="api-metadata-1"></a>

##### metadata

```ts
metadata: Record<string, unknown>;
```

Defined in: [src/types.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L20)

<a id="api-payload"></a>

##### payload

```ts
payload: T;
```

Defined in: [src/types.ts:12](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L12)

<a id="api-scheduledfor-1"></a>

##### scheduledFor?

```ts
optional scheduledFor?: Date;
```

Defined in: [src/types.ts:17](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L17)

<a id="api-timeoutms-2"></a>

##### timeoutMs?

```ts
optional timeoutMs?: number;
```

Defined in: [src/types.ts:18](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L18)

***

<a id="api-joberrorsummary"></a>

### JobErrorSummary

Defined in: [src/lifecycle.ts:11](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L11)

#### Properties

<a id="api-code"></a>

##### code?

```ts
optional code?: string;
```

Defined in: [src/lifecycle.ts:14](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L14)

<a id="api-message"></a>

##### message

```ts
message: string;
```

Defined in: [src/lifecycle.ts:13](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L13)

<a id="api-name"></a>

##### name?

```ts
optional name?: string;
```

Defined in: [src/lifecycle.ts:12](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L12)

<a id="api-reason"></a>

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/lifecycle.ts:15](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L15)

***

<a id="api-jobevent"></a>

### JobEvent

Defined in: [src/types.ts:33](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L33)

#### Properties

<a id="api-attempt"></a>

##### attempt?

```ts
optional attempt?: number;
```

Defined in: [src/types.ts:37](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L37)

<a id="api-durationms"></a>

##### durationMs?

```ts
optional durationMs?: number;
```

Defined in: [src/types.ts:40](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L40)

<a id="api-finishedat"></a>

##### finishedAt?

```ts
optional finishedAt?: Date;
```

Defined in: [src/types.ts:39](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L39)

<a id="api-jobid-2"></a>

##### jobId

```ts
jobId: string;
```

Defined in: [src/types.ts:34](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L34)

<a id="api-jobtype-2"></a>

##### jobType

```ts
jobType: string;
```

Defined in: [src/types.ts:35](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L35)

<a id="api-startedat"></a>

##### startedAt?

```ts
optional startedAt?: Date;
```

Defined in: [src/types.ts:38](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L38)

<a id="api-tenantid-2"></a>

##### tenantId

```ts
tenantId: string | undefined;
```

Defined in: [src/types.ts:36](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L36)

***

<a id="api-jobeventsoptions"></a>

### JobEventsOptions

Defined in: [src/lifecycle.ts:86](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L86)

#### Properties

<a id="api-onevent"></a>

##### onEvent?

```ts
optional onEvent?: (event) => void;
```

Defined in: [src/lifecycle.ts:87](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L87)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`JobLifecycleEvent`](#api-joblifecycleevent) |

###### Returns

`void`

***

<a id="api-jobhistoryentry"></a>

### JobHistoryEntry

Defined in: [src/lifecycle.ts:38](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L38)

#### Properties

<a id="api-at"></a>

##### at

```ts
at: Date;
```

Defined in: [src/lifecycle.ts:42](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L42)

<a id="api-attempt-1"></a>

##### attempt

```ts
attempt: number;
```

Defined in: [src/lifecycle.ts:41](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L41)

<a id="api-error"></a>

##### error?

```ts
optional error?: JobErrorSummary;
```

Defined in: [src/lifecycle.ts:44](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L44)

<a id="api-jobid-3"></a>

##### jobId

```ts
jobId: string;
```

Defined in: [src/lifecycle.ts:39](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L39)

<a id="api-metadata-2"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/lifecycle.ts:45](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L45)

<a id="api-reason-1"></a>

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/lifecycle.ts:43](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L43)

<a id="api-status-1"></a>

##### status

```ts
status: JobStatus;
```

Defined in: [src/lifecycle.ts:40](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L40)

***

<a id="api-jobinstance"></a>

### JobInstance

Defined in: [src/contracts.ts:52](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L52)

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

Defined in: [src/contracts.ts:60](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L60)

<a id="api-context-3"></a>

##### context

```ts
context: JobContextOf<TJobs, TType>;
```

Defined in: [src/contracts.ts:59](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L59)

<a id="api-id-1"></a>

##### id

```ts
id: string;
```

Defined in: [src/contracts.ts:56](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L56)

<a id="api-maxattempts-1"></a>

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/contracts.ts:61](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L61)

<a id="api-metadata-3"></a>

##### metadata

```ts
metadata: Record<string, unknown>;
```

Defined in: [src/contracts.ts:63](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L63)

<a id="api-payload-1"></a>

##### payload

```ts
payload: JobPayload<TJobs, TType>;
```

Defined in: [src/contracts.ts:58](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L58)

<a id="api-signal-1"></a>

##### signal

```ts
signal: AbortSignal;
```

Defined in: [src/contracts.ts:62](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L62)

<a id="api-type-1"></a>

##### type

```ts
type: TType;
```

Defined in: [src/contracts.ts:57](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L57)

***

<a id="api-joblifecycleevent"></a>

### JobLifecycleEvent

Defined in: [src/lifecycle.ts:74](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L74)

#### Properties

<a id="api-at-1"></a>

##### at

```ts
at: Date;
```

Defined in: [src/lifecycle.ts:80](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L80)

<a id="api-attempt-3"></a>

##### attempt

```ts
attempt: number;
```

Defined in: [src/lifecycle.ts:79](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L79)

<a id="api-durationms-1"></a>

##### durationMs?

```ts
optional durationMs?: number;
```

Defined in: [src/lifecycle.ts:81](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L81)

<a id="api-error-1"></a>

##### error?

```ts
optional error?: JobErrorSummary;
```

Defined in: [src/lifecycle.ts:82](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L82)

<a id="api-jobid-4"></a>

##### jobId

```ts
jobId: string;
```

Defined in: [src/lifecycle.ts:76](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L76)

<a id="api-jobtype-3"></a>

##### jobType

```ts
jobType: string;
```

Defined in: [src/lifecycle.ts:77](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L77)

<a id="api-metadata-4"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/lifecycle.ts:83](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L83)

<a id="api-tenantid-3"></a>

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/lifecycle.ts:78](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L78)

<a id="api-type-2"></a>

##### type

```ts
type: JobLifecycleEventType;
```

Defined in: [src/lifecycle.ts:75](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L75)

***

<a id="api-jobrecord"></a>

### JobRecord

Defined in: [src/lifecycle.ts:18](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L18)

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

Defined in: [src/lifecycle.ts:24](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L24)

<a id="api-completedat"></a>

##### completedAt?

```ts
optional completedAt?: Date;
```

Defined in: [src/lifecycle.ts:29](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L29)

<a id="api-context-4"></a>

##### context?

```ts
optional context?: TContext;
```

Defined in: [src/lifecycle.ts:23](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L23)

<a id="api-dedupekey-1"></a>

##### dedupeKey?

```ts
optional dedupeKey?: string;
```

Defined in: [src/lifecycle.ts:34](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L34)

<a id="api-enqueuedat-1"></a>

##### enqueuedAt

```ts
enqueuedAt: Date;
```

Defined in: [src/lifecycle.ts:26](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L26)

<a id="api-error-2"></a>

##### error?

```ts
optional error?: JobErrorSummary;
```

Defined in: [src/lifecycle.ts:32](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L32)

<a id="api-failedat"></a>

##### failedAt?

```ts
optional failedAt?: Date;
```

Defined in: [src/lifecycle.ts:30](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L30)

<a id="api-id-2"></a>

##### id

```ts
id: string;
```

Defined in: [src/lifecycle.ts:19](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L19)

<a id="api-idempotencykey-2"></a>

##### idempotencyKey?

```ts
optional idempotencyKey?: string;
```

Defined in: [src/lifecycle.ts:33](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L33)

<a id="api-maxattempts-2"></a>

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/lifecycle.ts:25](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L25)

<a id="api-metadata-5"></a>

##### metadata

```ts
metadata: Record<string, unknown>;
```

Defined in: [src/lifecycle.ts:35](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L35)

<a id="api-nextattemptat"></a>

##### nextAttemptAt?

```ts
optional nextAttemptAt?: Date;
```

Defined in: [src/lifecycle.ts:31](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L31)

<a id="api-payload-2"></a>

##### payload?

```ts
optional payload?: TPayload;
```

Defined in: [src/lifecycle.ts:22](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L22)

<a id="api-scheduledfor-2"></a>

##### scheduledFor?

```ts
optional scheduledFor?: Date;
```

Defined in: [src/lifecycle.ts:27](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L27)

<a id="api-startedat-1"></a>

##### startedAt?

```ts
optional startedAt?: Date;
```

Defined in: [src/lifecycle.ts:28](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L28)

<a id="api-status-2"></a>

##### status

```ts
status: JobStatus;
```

Defined in: [src/lifecycle.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L21)

<a id="api-type-3"></a>

##### type

```ts
type: string;
```

Defined in: [src/lifecycle.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L20)

***

<a id="api-jobsbackend"></a>

### JobsBackend

Defined in: [src/backend/jobs-backend.interface.ts:11](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L11)

#### Methods

<a id="api-ack-2"></a>

##### ack()

```ts
ack(jobType, jobId): Promise<void | JobRecord<unknown, unknown>>;
```

Defined in: [src/backend/jobs-backend.interface.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L21)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `jobId` | `string` |

###### Returns

`Promise`\<`void` \| [`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\>\>

<a id="api-capabilities-2"></a>

##### capabilities()

```ts
capabilities(): BackendCapabilities;
```

Defined in: [src/backend/jobs-backend.interface.ts:12](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L12)

###### Returns

[`BackendCapabilities`](#api-backendcapabilities)

<a id="api-close-2"></a>

##### close()

```ts
close(): Promise<void>;
```

Defined in: [src/backend/jobs-backend.interface.ts:28](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L28)

###### Returns

`Promise`\<`void`\>

<a id="api-discarddeadletter-1"></a>

##### discardDeadLetter()?

```ts
optional discardDeadLetter(jobId, reason?): Promise<void>;
```

Defined in: [src/backend/jobs-backend.interface.ts:27](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L27)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |
| `reason?` | `string` |

###### Returns

`Promise`\<`void`\>

<a id="api-enqueue-2"></a>

##### enqueue()

```ts
enqueue(
   jobType,
   envelope,
opts): Promise<string>;
```

Defined in: [src/backend/jobs-backend.interface.ts:13](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L13)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `envelope` | `Record`\<`string`, `unknown`\> |
| `opts` | [`EnqueueOptions`](#api-enqueueoptions) |

###### Returns

`Promise`\<`string`\>

<a id="api-enqueuedetailed-1"></a>

##### enqueueDetailed()?

```ts
optional enqueueDetailed(
   jobType,
   envelope,
opts): Promise<EnqueueResult>;
```

Defined in: [src/backend/jobs-backend.interface.ts:14](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L14)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `envelope` | `Record`\<`string`, `unknown`\> |
| `opts` | [`EnqueueOptions`](#api-enqueueoptions) |

###### Returns

`Promise`\<[`EnqueueResult`](#api-enqueueresult)\>

<a id="api-fail-2"></a>

##### fail()

```ts
fail(
   jobType,
   jobId,
reason): Promise<void | JobRecord<unknown, unknown>>;
```

Defined in: [src/backend/jobs-backend.interface.ts:22](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `jobId` | `string` |
| `reason` | `string` |

###### Returns

`Promise`\<`void` \| [`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\>\>

<a id="api-getjob-2"></a>

##### getJob()

```ts
getJob(jobId): Promise<JobRecord<unknown, unknown> | null>;
```

Defined in: [src/backend/jobs-backend.interface.ts:23](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L23)

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

Defined in: [src/backend/jobs-backend.interface.ts:24](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L24)

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

Defined in: [src/backend/jobs-backend.interface.ts:25](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L25)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filter?` | [`DeadLetterFilter`](#api-deadletterfilter) |

###### Returns

`Promise`\<[`JobRecord`](#api-jobrecord)\<`unknown`, `unknown`\>[]\>

<a id="api-movetoactive-2"></a>

##### moveToActive()

```ts
moveToActive(jobType, jobId): Promise<JobEnvelope<unknown> | null>;
```

Defined in: [src/backend/jobs-backend.interface.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L20)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `jobId` | `string` |

###### Returns

`Promise`\<[`JobEnvelope`](#api-jobenvelope)\<`unknown`\> \| `null`\>

<a id="api-peekwaiting-2"></a>

##### peekWaiting()

```ts
peekWaiting(jobType): Promise<JobEnvelope<unknown>[]>;
```

Defined in: [src/backend/jobs-backend.interface.ts:19](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L19)

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

Defined in: [src/backend/jobs-backend.interface.ts:26](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L26)

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

Defined in: [src/outbox/outbox-bridge.module.ts:13](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L13)

#### Properties

<a id="api-jobs-2"></a>

##### jobs

```ts
jobs: JobsService;
```

Defined in: [src/outbox/outbox-bridge.module.ts:14](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L14)

<a id="api-map"></a>

##### map

```ts
map: Record<string, string>;
```

Defined in: [src/outbox/outbox-bridge.module.ts:16](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L16)

<a id="api-source"></a>

##### source

```ts
source: OutboxSource;
```

Defined in: [src/outbox/outbox-bridge.module.ts:15](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L15)

<a id="api-tenantfrom"></a>

##### tenantFrom?

```ts
optional tenantFrom?: (event) => string;
```

Defined in: [src/outbox/outbox-bridge.module.ts:17](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`OutboxEvent`](#api-outboxevent) |

###### Returns

`string`

***

<a id="api-jobsservicedeps"></a>

### JobsServiceDeps

Defined in: [src/jobs.service.ts:17](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L17)

#### Properties

<a id="api-backend-3"></a>

##### backend

```ts
backend: JobsBackend;
```

Defined in: [src/jobs.service.ts:18](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L18)

<a id="api-contextextractor-3"></a>

##### contextExtractor?

```ts
optional contextExtractor?: () => JobContext;
```

Defined in: [src/jobs.service.ts:22](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L22)

###### Returns

[`JobContext`](#api-jobcontext)

<a id="api-contextrunner-4"></a>

##### contextRunner?

```ts
optional contextRunner?: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/jobs.service.ts:23](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L23)

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

Defined in: [src/jobs.service.ts:24](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L24)

<a id="api-jobtypes-3"></a>

##### jobTypes?

```ts
optional jobTypes?: Iterable<string, any, any>;
```

Defined in: [src/jobs.service.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L21)

<a id="api-registry-2"></a>

##### registry

```ts
registry: HandlerRegistry;
```

Defined in: [src/jobs.service.ts:19](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L19)

<a id="api-schedulers-1"></a>

##### schedulers?

```ts
optional schedulers?: Map<string, Scheduler>;
```

Defined in: [src/jobs.service.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L20)

***

<a id="api-outboxevent"></a>

### OutboxEvent

Defined in: [src/outbox/outbox-bridge.module.ts:3](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L3)

#### Properties

<a id="api-payload-3"></a>

##### payload

```ts
payload: Record<string, unknown>;
```

Defined in: [src/outbox/outbox-bridge.module.ts:5](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L5)

<a id="api-tenantid-4"></a>

##### tenantId

```ts
tenantId: string;
```

Defined in: [src/outbox/outbox-bridge.module.ts:6](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L6)

<a id="api-type-4"></a>

##### type

```ts
type: string;
```

Defined in: [src/outbox/outbox-bridge.module.ts:4](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L4)

***

<a id="api-outboxsource"></a>

### OutboxSource

Defined in: [src/outbox/outbox-bridge.module.ts:9](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L9)

#### Methods

<a id="api-onevent-1"></a>

##### onEvent()

```ts
onEvent(cb): void;
```

Defined in: [src/outbox/outbox-bridge.module.ts:10](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `cb` | (`event`) => `Promise`\<`void`\> |

###### Returns

`void`

***

<a id="api-pickedjob"></a>

### PickedJob

Defined in: [src/scheduler.ts:18](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L18)

#### Properties

<a id="api-jobid-5"></a>

##### jobId

```ts
jobId: string;
```

Defined in: [src/scheduler.ts:19](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L19)

<a id="api-tenantid-5"></a>

##### tenantId

```ts
tenantId: string;
```

Defined in: [src/scheduler.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L20)

***

<a id="api-replayoptions"></a>

### ReplayOptions

Defined in: [src/lifecycle.ts:101](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L101)

#### Properties

<a id="api-metadata-6"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/lifecycle.ts:104](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L104)

<a id="api-preserveoriginalid"></a>

##### preserveOriginalId?

```ts
optional preserveOriginalId?: boolean;
```

Defined in: [src/lifecycle.ts:102](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L102)

<a id="api-resetattempts"></a>

##### resetAttempts?

```ts
optional resetAttempts?: boolean;
```

Defined in: [src/lifecycle.ts:103](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L103)

***

<a id="api-retrypolicy"></a>

### RetryPolicy

Defined in: [src/retry.ts:5](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/retry.ts#L5)

#### Properties

<a id="api-attempts-3"></a>

##### attempts?

```ts
optional attempts?: number;
```

Defined in: [src/retry.ts:6](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/retry.ts#L6)

<a id="api-backoff-4"></a>

##### backoff?

```ts
optional backoff?: BackoffPolicy;
```

Defined in: [src/retry.ts:7](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/retry.ts#L7)

***

<a id="api-scheduleroptions"></a>

### SchedulerOptions

Defined in: [src/scheduler.ts:3](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L3)

#### Properties

<a id="api-defaultweight-1"></a>

##### defaultWeight

```ts
defaultWeight: number;
```

Defined in: [src/scheduler.ts:4](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L4)

<a id="api-minsharepct-1"></a>

##### minSharePct

```ts
minSharePct: number;
```

Defined in: [src/scheduler.ts:5](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L5)

<a id="api-tenantcap-1"></a>

##### tenantCap

```ts
tenantCap: number;
```

Defined in: [src/scheduler.ts:6](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L6)

***

<a id="api-shardsnapshot"></a>

### ShardSnapshot

Defined in: [src/types.ts:25](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L25)

#### Properties

<a id="api-inflight"></a>

##### inflight

```ts
inflight: number;
```

Defined in: [src/types.ts:28](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L28)

<a id="api-starvationtokens"></a>

##### starvationTokens

```ts
starvationTokens: number;
```

Defined in: [src/types.ts:30](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L30)

<a id="api-tenantid-6"></a>

##### tenantId

```ts
tenantId: string;
```

Defined in: [src/types.ts:26](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L26)

<a id="api-waiting"></a>

##### waiting

```ts
waiting: number;
```

Defined in: [src/types.ts:27](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L27)

<a id="api-weight"></a>

##### weight

```ts
weight: number;
```

Defined in: [src/types.ts:29](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L29)

***

<a id="api-typedjobhandler"></a>

### TypedJobHandler

Defined in: [src/contracts.ts:66](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L66)

#### Type Parameters

| Type Parameter |
| ------ |
| `TJobs` *extends* [`JobDefinitions`](#api-jobdefinitions) |
| `TType` *extends* [`JobType`](#api-jobtype-4)\<`TJobs`\> |

#### Methods

<a id="api-handle"></a>

##### handle()

```ts
handle(job): Promise<JobResult<TJobs, TType>>;
```

Defined in: [src/contracts.ts:70](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L70)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `job` | [`JobInstance`](#api-jobinstance)\<`TJobs`, `TType`\> |

###### Returns

`Promise`\<[`JobResult`](#api-jobresult)\<`TJobs`, `TType`\>\>

***

<a id="api-typedjobsservice"></a>

### TypedJobsService

Defined in: [src/contracts.ts:73](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L73)

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

Defined in: [src/contracts.ts:91](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L91)

###### Returns

[`BackendCapabilities`](#api-backendcapabilities)

<a id="api-discarddeadletter-3"></a>

##### discardDeadLetter()

```ts
discardDeadLetter(jobId, reason?): Promise<void>;
```

Defined in: [src/contracts.ts:94](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L94)

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

Defined in: [src/contracts.ts:74](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L74)

###### Type Parameters

| Type Parameter |
| ------ |
| `TType` *extends* `string` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `TType` |
| `payload` | [`JobPayload`](#api-jobpayload)\<`TJobs`, `TType`\> |
| `options?` | [`EnqueueOptions`](#api-enqueueoptions)\<[`JobContextOf`](#api-jobcontextof)\<`TJobs`, `TType`\>\> |

###### Returns

`Promise`\<`string`\>

<a id="api-enqueuedetailed-3"></a>

##### enqueueDetailed()

```ts
enqueueDetailed<TType>(
   type,
   payload,
options?): Promise<EnqueueResult>;
```

Defined in: [src/contracts.ts:80](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L80)

###### Type Parameters

| Type Parameter |
| ------ |
| `TType` *extends* `string` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `TType` |
| `payload` | [`JobPayload`](#api-jobpayload)\<`TJobs`, `TType`\> |
| `options?` | [`EnqueueOptions`](#api-enqueueoptions)\<[`JobContextOf`](#api-jobcontextof)\<`TJobs`, `TType`\>\> |

###### Returns

`Promise`\<[`EnqueueResult`](#api-enqueueresult)\>

<a id="api-getjob-4"></a>

##### getJob()

```ts
getJob<TType>(jobId): Promise<
  | JobRecord<JobPayload<TJobs, TType>, JobContextOf<TJobs, TType>>
| null>;
```

Defined in: [src/contracts.ts:86](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L86)

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

Defined in: [src/contracts.ts:90](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L90)

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

Defined in: [src/contracts.ts:92](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L92)

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

Defined in: [src/contracts.ts:93](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L93)

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

Defined in: [src/contracts.ts:9](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L9)

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

Defined in: [src/retry.ts:1](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/retry.ts#L1)

***

<a id="api-handlerfn"></a>

### HandlerFn

```ts
type HandlerFn = (payload, context) => Promise<unknown>;
```

Defined in: [src/handler-registry.ts:4](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/handler-registry.ts#L4)

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
} ? TContext : JobContext;
```

Defined in: [src/contracts.ts:42](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L42)

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

Defined in: [src/contracts.ts:7](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L7)

***

<a id="api-joblifecycleeventtype-1"></a>

### JobLifecycleEventType

```ts
type JobLifecycleEventType =
  | "job.enqueued"
  | "job.started"
  | "job.succeeded"
  | "job.failed"
  | "job.retry_scheduled"
  | "job.dead_lettered"
  | "job.cancelled"
  | "job.discarded"
  | "job.replayed";
```

Defined in: [src/lifecycle.ts:63](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L63)

***

<a id="api-jobpayload"></a>

### JobPayload

```ts
type JobPayload<TJobs, TType> = TJobs[TType] extends {
  __payload?: infer TPayload;
} ? TPayload : never;
```

Defined in: [src/contracts.ts:37](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L37)

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

Defined in: [src/contracts.ts:47](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L47)

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

Defined in: [src/errors.ts:1](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L1)

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

Defined in: [src/lifecycle.ts:1](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L1)

***

<a id="api-jobtype-4"></a>

### JobType

```ts
type JobType<TJobs> = Extract<keyof TJobs, string>;
```

Defined in: [src/contracts.ts:35](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L35)

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

Defined in: [src/context-serializer.ts:4](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/context-serializer.ts#L4)

***

<a id="api-job_handler_metadata"></a>

### JOB\_HANDLER\_METADATA

```ts
const JOB_HANDLER_METADATA: "nestarc:jobs:handler" = 'nestarc:jobs:handler';
```

Defined in: [src/decorators/job-handler.decorator.ts:3](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/decorators/job-handler.decorator.ts#L3)

***

<a id="api-jobs_backend"></a>

### JOBS\_BACKEND

```ts
const JOBS_BACKEND: typeof JOBS_BACKEND;
```

Defined in: [src/jobs.module.ts:24](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L24)

***

<a id="api-jobs_service"></a>

### JOBS\_SERVICE

```ts
const JOBS_SERVICE: typeof JOBS_SERVICE;
```

Defined in: [src/contracts.ts:5](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L5)

***

<a id="api-jobs_workers"></a>

### JOBS\_WORKERS

```ts
const JOBS_WORKERS: typeof JOBS_WORKERS;
```

Defined in: [src/jobs.module.ts:25](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L25)

***

<a id="api-jobserrorcode-1"></a>

### JobsErrorCode

```ts
const JobsErrorCode: {
  FairnessMisconfig: "jobs_fairness_misconfig";
  HandlerNotFound: "jobs_handler_not_found";
  QueueNotFound: "jobs_queue_not_found";
  ReservedPayloadKey: "jobs_reserved_payload_key";
};
```

Defined in: [src/errors.ts:1](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L1)

#### Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="api-property-fairnessmisconfig"></a> `FairnessMisconfig` | `"jobs_fairness_misconfig"` | `'jobs_fairness_misconfig'` | [src/errors.ts:5](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L5) |
| <a id="api-property-handlernotfound"></a> `HandlerNotFound` | `"jobs_handler_not_found"` | `'jobs_handler_not_found'` | [src/errors.ts:3](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L3) |
| <a id="api-property-queuenotfound"></a> `QueueNotFound` | `"jobs_queue_not_found"` | `'jobs_queue_not_found'` | [src/errors.ts:4](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L4) |
| <a id="api-property-reservedpayloadkey"></a> `ReservedPayloadKey` | `"jobs_reserved_payload_key"` | `'jobs_reserved_payload_key'` | [src/errors.ts:2](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L2) |

## Functions

<a id="api-attachcontext"></a>

### attachContext()

```ts
function attachContext<T>(payload, context): T & {
  __nestarcCtx: JobContext;
};
```

Defined in: [src/context-serializer.ts:6](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/context-serializer.ts#L6)

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

Defined in: [src/retry.ts:10](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/retry.ts#L10)

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

Defined in: [src/fake-jobs.service.ts:70](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L70)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`FakeJobsOptions`](#api-fakejobsoptions) |

#### Returns

[`FakeJobsService`](#api-fakejobsservice)

***

<a id="api-definejobs"></a>

### defineJobs()

```ts
function defineJobs<TJobs>(definitions): TJobs;
```

Defined in: [src/contracts.ts:101](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L101)

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

Defined in: [src/context-serializer.ts:19](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/context-serializer.ts#L19)

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
| `context` | [`JobContext`](#api-jobcontext) | [src/context-serializer.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/context-serializer.ts#L21) |
| `payload` | `Omit`\<`T`, *typeof* [`CONTEXT_KEY`](#api-context_key)\> | [src/context-serializer.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/context-serializer.ts#L21) |

***

<a id="api-injectjobs"></a>

### InjectJobs()

```ts
function InjectJobs(): PropertyDecorator & ParameterDecorator;
```

Defined in: [src/contracts.ts:105](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L105)

#### Returns

`PropertyDecorator` & `ParameterDecorator`

***

<a id="api-job"></a>

### job()

```ts
function job<TPayload>(): JobBuilder<TPayload, JobContext, unknown>;
```

Defined in: [src/contracts.ts:97](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L97)

#### Type Parameters

| Type Parameter |
| ------ |
| `TPayload` |

#### Returns

[`JobBuilder`](#api-jobbuilder)\<`TPayload`, [`JobContext`](#api-jobcontext), `unknown`\>

***

<a id="api-jobhandler"></a>

### JobHandler()

```ts
function JobHandler(jobType): MethodDecorator;
```

Defined in: [src/decorators/job-handler.decorator.ts:5](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/decorators/job-handler.decorator.ts#L5)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |

#### Returns

`MethodDecorator`
