# @nestarc/jobs

## Classes

### BullMQBackend

Defined in: [src/backend/bullmq-backend.ts:30](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L30)

#### Implements

- [`JobsBackend`](#jobsbackend)

#### Constructors

##### Constructor

```ts
new BullMQBackend(opts): BullMQBackend;
```

Defined in: [src/backend/bullmq-backend.ts:34](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L34)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`BullMQBackendOptions`](#bullmqbackendoptions) |

###### Returns

[`BullMQBackend`](#bullmqbackend)

#### Methods

##### ack()

```ts
ack(): Promise<void>;
```

Defined in: [src/backend/bullmq-backend.ts:111](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L111)

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`ack`](#ack-2)

##### capabilities()

```ts
capabilities(): BackendCapabilities;
```

Defined in: [src/backend/bullmq-backend.ts:36](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L36)

###### Returns

[`BackendCapabilities`](#backendcapabilities)

###### Implementation of

[`JobsBackend`](#jobsbackend).[`capabilities`](#capabilities-2)

##### close()

```ts
close(): Promise<void>;
```

Defined in: [src/backend/bullmq-backend.ts:180](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L180)

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`close`](#close-2)

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
| `opts` | [`EnqueueOptions`](#enqueueoptions) |

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`enqueue`](#enqueue-2)

##### fail()

```ts
fail(): Promise<void>;
```

Defined in: [src/backend/bullmq-backend.ts:114](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L114)

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`fail`](#fail-2)

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

`Promise`\<[`JobRecord`](#jobrecord)\<`unknown`, `unknown`\> \| `null`\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`getJob`](#getjob-2)

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

`Promise`\<[`JobHistoryEntry`](#jobhistoryentry)[]\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`getJobHistory`](#getjobhistory-2)

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

##### moveToActive()

```ts
moveToActive(): Promise<JobEnvelope<unknown> | null>;
```

Defined in: [src/backend/bullmq-backend.ts:108](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L108)

###### Returns

`Promise`\<[`JobEnvelope`](#jobenvelope)\<`unknown`\> \| `null`\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`moveToActive`](#movetoactive-2)

##### peekWaiting()

```ts
peekWaiting(): Promise<JobEnvelope<unknown>[]>;
```

Defined in: [src/backend/bullmq-backend.ts:102](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L102)

###### Returns

`Promise`\<[`JobEnvelope`](#jobenvelope)\<`unknown`\>[]\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`peekWaiting`](#peekwaiting-2)

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

### FairWorker

Defined in: [src/fair-worker.ts:19](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L19)

#### Constructors

##### Constructor

```ts
new FairWorker(opts): FairWorker;
```

Defined in: [src/fair-worker.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L20)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`FairWorkerOptions`](#fairworkeroptions) |

###### Returns

[`FairWorker`](#fairworker)

#### Methods

##### tick()

```ts
tick(): Promise<boolean>;
```

Defined in: [src/fair-worker.ts:22](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L22)

###### Returns

`Promise`\<`boolean`\>

***

### FakeClock

Defined in: [src/fake-clock.ts:1](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-clock.ts#L1)

#### Constructors

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

[`FakeClock`](#fakeclock)

#### Methods

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

##### now()

```ts
now(): Date;
```

Defined in: [src/fake-clock.ts:8](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-clock.ts#L8)

###### Returns

`Date`

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

### FakeJobsService

Defined in: [src/fake-jobs.service.ts:16](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L16)

#### Constructors

##### Constructor

```ts
new FakeJobsService(opts): FakeJobsService;
```

Defined in: [src/fake-jobs.service.ts:24](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L24)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`FakeJobsOptions`](#fakejobsoptions) |

###### Returns

[`FakeJobsService`](#fakejobsservice)

#### Properties

##### backend

```ts
readonly backend: InMemoryBackend;
```

Defined in: [src/fake-jobs.service.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L20)

##### clock

```ts
readonly clock: FakeClock;
```

Defined in: [src/fake-jobs.service.ts:19](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L19)

##### registry

```ts
readonly registry: HandlerRegistry;
```

Defined in: [src/fake-jobs.service.ts:18](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L18)

##### schedulers

```ts
readonly schedulers: Map<string, Scheduler>;
```

Defined in: [src/fake-jobs.service.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L21)

##### service

```ts
readonly service: JobsService;
```

Defined in: [src/fake-jobs.service.ts:17](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L17)

#### Methods

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

### HandlerRegistry

Defined in: [src/handler-registry.ts:9](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/handler-registry.ts#L9)

#### Constructors

##### Constructor

```ts
new HandlerRegistry(): HandlerRegistry;
```

###### Returns

[`HandlerRegistry`](#handlerregistry)

#### Methods

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
| `context` | [`JobContext`](#jobcontext) |

###### Returns

`Promise`\<`unknown`\>

##### list()

```ts
list(): string[];
```

Defined in: [src/handler-registry.ts:29](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/handler-registry.ts#L29)

###### Returns

`string`[]

##### register()

```ts
register(jobType, handler): void;
```

Defined in: [src/handler-registry.ts:12](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/handler-registry.ts#L12)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobType` | `string` |
| `handler` | [`HandlerFn`](#handlerfn) |

###### Returns

`void`

***

### InMemoryBackend

Defined in: [src/backend/in-memory-backend.ts:32](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L32)

#### Implements

- [`JobsBackend`](#jobsbackend)

#### Constructors

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

[`InMemoryBackend`](#inmemorybackend)

#### Methods

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

`Promise`\<`void` \| [`JobRecord`](#jobrecord)\<`unknown`, `unknown`\>\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`ack`](#ack-2)

##### capabilities()

```ts
capabilities(): BackendCapabilities;
```

Defined in: [src/backend/in-memory-backend.ts:41](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L41)

###### Returns

[`BackendCapabilities`](#backendcapabilities)

###### Implementation of

[`JobsBackend`](#jobsbackend).[`capabilities`](#capabilities-2)

##### close()

```ts
close(): Promise<void>;
```

Defined in: [src/backend/in-memory-backend.ts:229](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L229)

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`close`](#close-2)

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

[`JobsBackend`](#jobsbackend).[`discardDeadLetter`](#discarddeadletter-1)

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
| `opts` | [`EnqueueOptions`](#enqueueoptions) |

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`enqueue`](#enqueue-2)

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
| `opts` | [`EnqueueOptions`](#enqueueoptions) |

###### Returns

`Promise`\<[`EnqueueResult`](#enqueueresult)\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`enqueueDetailed`](#enqueuedetailed-1)

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

`Promise`\<`void` \| [`JobRecord`](#jobrecord)\<`unknown`, `unknown`\>\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`fail`](#fail-2)

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

`Promise`\<[`JobRecord`](#jobrecord)\<`unknown`, `unknown`\> \| `null`\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`getJob`](#getjob-2)

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

`Promise`\<[`JobHistoryEntry`](#jobhistoryentry)[]\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`getJobHistory`](#getjobhistory-2)

##### listDeadLetters()

```ts
listDeadLetters(filter?): Promise<JobRecord<unknown, unknown>[]>;
```

Defined in: [src/backend/in-memory-backend.ts:186](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L186)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filter` | [`DeadLetterFilter`](#deadletterfilter) |

###### Returns

`Promise`\<[`JobRecord`](#jobrecord)\<`unknown`, `unknown`\>[]\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`listDeadLetters`](#listdeadletters-1)

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

`Promise`\<[`JobRecord`](#jobrecord)\<`unknown`, `unknown`\> \| `null`\>

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
| `error?` | [`JobErrorSummary`](#joberrorsummary) |

###### Returns

`Promise`\<[`JobRecord`](#jobrecord)\<`unknown`, `unknown`\> \| `null`\>

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

`Promise`\<[`JobEnvelope`](#jobenvelope)\<`unknown`\> \| `null`\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`moveToActive`](#movetoactive-2)

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

`Promise`\<[`JobEnvelope`](#jobenvelope)\<`unknown`\>[]\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`peekWaiting`](#peekwaiting-2)

##### replayDeadLetter()

```ts
replayDeadLetter(jobId, options?): Promise<string>;
```

Defined in: [src/backend/in-memory-backend.ts:201](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/in-memory-backend.ts#L201)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |
| `options` | [`ReplayOptions`](#replayoptions) |

###### Returns

`Promise`\<`string`\>

###### Implementation of

[`JobsBackend`](#jobsbackend).[`replayDeadLetter`](#replaydeadletter-1)

***

### JobsError

Defined in: [src/errors.ts:10](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L10)

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new JobsError(code, reason?): JobsError;
```

Defined in: [src/errors.ts:13](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L13)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | [`JobsErrorCode`](#jobserrorcode) |
| `reason?` | `string` |

###### Returns

[`JobsError`](#jobserror)

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

##### code

```ts
readonly code: JobsErrorCode;
```

Defined in: [src/errors.ts:11](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L11)

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
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

```ts
Error.name
```

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

### JobsModule

Defined in: [src/jobs.module.ts:115](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L115)

#### Constructors

##### Constructor

```ts
new JobsModule(): JobsModule;
```

###### Returns

[`JobsModule`](#jobsmodule)

#### Methods

##### forBullMQ()

```ts
static forBullMQ(options): DynamicModule;
```

Defined in: [src/jobs.module.ts:186](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L186)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`BullMQOptions`](#bullmqoptions) |

###### Returns

`DynamicModule`

##### forInMemory()

```ts
static forInMemory(options): DynamicModule;
```

Defined in: [src/jobs.module.ts:116](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L116)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`InMemoryOptions`](#inmemoryoptions) |

###### Returns

`DynamicModule`

***

### JobsOutboxBridge

Defined in: [src/outbox/outbox-bridge.module.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L20)

#### Constructors

##### Constructor

```ts
new JobsOutboxBridge(opts): JobsOutboxBridge;
```

Defined in: [src/outbox/outbox-bridge.module.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L21)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`JobsOutboxBridgeOptions`](#jobsoutboxbridgeoptions) |

###### Returns

[`JobsOutboxBridge`](#jobsoutboxbridge)

***

### JobsService

Defined in: [src/jobs.service.ts:27](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L27)

#### Constructors

##### Constructor

```ts
new JobsService(deps): JobsService;
```

Defined in: [src/jobs.service.ts:31](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L31)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deps` | [`JobsServiceDeps`](#jobsservicedeps) |

###### Returns

[`JobsService`](#jobsservice)

#### Methods

##### capabilities()

```ts
capabilities(): BackendCapabilities;
```

Defined in: [src/jobs.service.ts:70](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L70)

###### Returns

[`BackendCapabilities`](#backendcapabilities)

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
| `opts` | [`EnqueueOptions`](#enqueueoptions) |

###### Returns

`Promise`\<`string`\>

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
| `opts` | [`EnqueueOptions`](#enqueueoptions) |

###### Returns

`Promise`\<[`EnqueueResult`](#enqueueresult)\>

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

`Promise`\<[`JobRecord`](#jobrecord)\<`unknown`, `unknown`\> \| `null`\>

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

`Promise`\<[`JobHistoryEntry`](#jobhistoryentry)[]\>

##### listDeadLetters()

```ts
listDeadLetters(filter?): Promise<JobRecord<unknown, unknown>[]>;
```

Defined in: [src/jobs.service.ts:82](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L82)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filter?` | [`DeadLetterFilter`](#deadletterfilter) |

###### Returns

`Promise`\<[`JobRecord`](#jobrecord)\<`unknown`, `unknown`\>[]\>

##### replayDeadLetter()

```ts
replayDeadLetter(jobId, options?): Promise<string>;
```

Defined in: [src/jobs.service.ts:87](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L87)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |
| `options?` | [`ReplayOptions`](#replayoptions) |

###### Returns

`Promise`\<`string`\>

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

[`Scheduler`](#scheduler-2)

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

### Scheduler

Defined in: [src/scheduler.ts:23](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L23)

#### Constructors

##### Constructor

```ts
new Scheduler(opts): Scheduler;
```

Defined in: [src/scheduler.ts:29](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L29)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`SchedulerOptions`](#scheduleroptions) |

###### Returns

[`Scheduler`](#scheduler-2)

#### Methods

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

##### pickNext()

```ts
pickNext(): PickedJob | null;
```

Defined in: [src/scheduler.ts:58](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L58)

###### Returns

[`PickedJob`](#pickedjob) \| `null`

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

### BackendCapabilities

Defined in: [src/lifecycle.ts:48](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L48)

#### Properties

##### backoff

```ts
backoff: boolean;
```

Defined in: [src/lifecycle.ts:53](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L53)

##### deadLetter

```ts
deadLetter: boolean;
```

Defined in: [src/lifecycle.ts:58](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L58)

##### delayed

```ts
delayed: boolean;
```

Defined in: [src/lifecycle.ts:51](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L51)

##### distributed

```ts
distributed: boolean;
```

Defined in: [src/lifecycle.ts:50](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L50)

##### durable

```ts
durable: boolean;
```

Defined in: [src/lifecycle.ts:49](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L49)

##### fairness

```ts
fairness: "none" | "local-tenant";
```

Defined in: [src/lifecycle.ts:59](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L59)

##### history

```ts
history: boolean;
```

Defined in: [src/lifecycle.ts:56](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L56)

##### idempotency

```ts
idempotency: boolean;
```

Defined in: [src/lifecycle.ts:57](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L57)

##### manualDrain

```ts
manualDrain: boolean;
```

Defined in: [src/lifecycle.ts:60](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L60)

##### retries

```ts
retries: boolean;
```

Defined in: [src/lifecycle.ts:52](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L52)

##### statusQuery

```ts
statusQuery: boolean;
```

Defined in: [src/lifecycle.ts:55](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L55)

##### timeout

```ts
timeout: boolean;
```

Defined in: [src/lifecycle.ts:54](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L54)

***

### BullMQBackendOptions

Defined in: [src/backend/bullmq-backend.ts:15](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L15)

#### Properties

##### connection

```ts
connection: ConnectionOptions;
```

Defined in: [src/backend/bullmq-backend.ts:17](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L17)

##### namespace?

```ts
optional namespace?: string;
```

Defined in: [src/backend/bullmq-backend.ts:16](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L16)

##### workerConcurrency?

```ts
optional workerConcurrency?: number;
```

Defined in: [src/backend/bullmq-backend.ts:18](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/bullmq-backend.ts#L18)

***

### BullMQOptions

Defined in: [src/jobs.module.ts:76](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L76)

#### Properties

##### backend

```ts
backend: BullMQBackend;
```

Defined in: [src/jobs.module.ts:77](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L77)

##### contextExtractor?

```ts
optional contextExtractor?: () => JobContext;
```

Defined in: [src/jobs.module.ts:83](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L83)

###### Returns

[`JobContext`](#jobcontext)

##### contextRunner?

```ts
optional contextRunner?: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/jobs.module.ts:84](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L84)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`JobContext`](#jobcontext) |
| `fn` | () => `Promise`\<`unknown`\> |

###### Returns

`Promise`\<`unknown`\>

##### events?

```ts
optional events?: JobEventsOptions;
```

Defined in: [src/jobs.module.ts:82](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L82)

##### global?

```ts
optional global?: boolean;
```

Defined in: [src/jobs.module.ts:80](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L80)

##### jobs?

```ts
optional jobs?: JobDefinitions;
```

Defined in: [src/jobs.module.ts:79](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L79)

##### jobTypes

```ts
jobTypes: string[];
```

Defined in: [src/jobs.module.ts:78](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L78)

##### onJobFail?

```ts
optional onJobFail?: (e, err) => void;
```

Defined in: [src/jobs.module.ts:87](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L87)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#jobevent) |
| `err` | `Error` |

###### Returns

`void`

##### onJobFinish?

```ts
optional onJobFinish?: (e) => void;
```

Defined in: [src/jobs.module.ts:86](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L86)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#jobevent) |

###### Returns

`void`

##### onJobStart?

```ts
optional onJobStart?: (e) => void;
```

Defined in: [src/jobs.module.ts:85](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L85)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#jobevent) |

###### Returns

`void`

##### strictCapabilities?

```ts
optional strictCapabilities?: boolean;
```

Defined in: [src/jobs.module.ts:81](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L81)

***

### DeadLetterFilter

Defined in: [src/lifecycle.ts:96](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L96)

#### Properties

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/lifecycle.ts:98](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L98)

##### type?

```ts
optional type?: string;
```

Defined in: [src/lifecycle.ts:97](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L97)

***

### DedupeOptions

Defined in: [src/types.ts:43](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L43)

#### Properties

##### key

```ts
key: string;
```

Defined in: [src/types.ts:44](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L44)

##### mode?

```ts
optional mode?: "while_active" | "until_completed";
```

Defined in: [src/types.ts:47](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L47)

##### scope?

```ts
optional scope?: "global" | "tenant";
```

Defined in: [src/types.ts:45](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L45)

##### ttlMs?

```ts
optional ttlMs?: number;
```

Defined in: [src/types.ts:46](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L46)

***

### EnqueueOptions

Defined in: [src/types.ts:50](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L50)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TContext` | [`JobContext`](#jobcontext) |

#### Properties

##### attempts?

```ts
optional attempts?: number;
```

Defined in: [src/types.ts:56](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L56)

##### backoff?

```ts
optional backoff?: BackoffPolicy;
```

Defined in: [src/types.ts:57](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L57)

##### context?

```ts
optional context?: TContext;
```

Defined in: [src/types.ts:52](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L52)

##### dedupe?

```ts
optional dedupe?: DedupeOptions;
```

Defined in: [src/types.ts:60](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L60)

##### delay?

```ts
optional delay?: number;
```

Defined in: [src/types.ts:53](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L53)

##### delayMs?

```ts
optional delayMs?: number;
```

Defined in: [src/types.ts:54](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L54)

##### idempotencyKey?

```ts
optional idempotencyKey?: string;
```

Defined in: [src/types.ts:59](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L59)

##### jobId?

```ts
optional jobId?: string;
```

Defined in: [src/types.ts:51](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L51)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/types.ts:61](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L61)

##### scheduledFor?

```ts
optional scheduledFor?: Date;
```

Defined in: [src/types.ts:55](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L55)

##### timeoutMs?

```ts
optional timeoutMs?: number;
```

Defined in: [src/types.ts:58](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L58)

***

### EnqueueResult

Defined in: [src/lifecycle.ts:90](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L90)

#### Properties

##### existingJobId?

```ts
optional existingJobId?: string;
```

Defined in: [src/lifecycle.ts:93](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L93)

##### jobId

```ts
jobId: string;
```

Defined in: [src/lifecycle.ts:92](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L92)

##### status

```ts
status: "created" | "deduped";
```

Defined in: [src/lifecycle.ts:91](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L91)

***

### FairWorkerOptions

Defined in: [src/fair-worker.ts:7](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L7)

#### Properties

##### backend

```ts
backend: JobsBackend;
```

Defined in: [src/fair-worker.ts:9](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L9)

##### contextRunner

```ts
contextRunner: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/fair-worker.ts:12](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L12)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`JobContext`](#jobcontext) |
| `fn` | () => `Promise`\<`unknown`\> |

###### Returns

`Promise`\<`unknown`\>

##### events?

```ts
optional events?: JobEventsOptions;
```

Defined in: [src/fair-worker.ts:16](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L16)

##### jobType

```ts
jobType: string;
```

Defined in: [src/fair-worker.ts:8](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L8)

##### onFail?

```ts
optional onFail?: (e, err) => void;
```

Defined in: [src/fair-worker.ts:15](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L15)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#jobevent) |
| `err` | `Error` |

###### Returns

`void`

##### onFinish?

```ts
optional onFinish?: (e) => void;
```

Defined in: [src/fair-worker.ts:14](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L14)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#jobevent) |

###### Returns

`void`

##### onStart?

```ts
optional onStart?: (e) => void;
```

Defined in: [src/fair-worker.ts:13](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L13)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#jobevent) |

###### Returns

`void`

##### registry

```ts
registry: HandlerRegistry;
```

Defined in: [src/fair-worker.ts:11](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L11)

##### scheduler

```ts
scheduler: Scheduler;
```

Defined in: [src/fair-worker.ts:10](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fair-worker.ts#L10)

***

### FakeJobsOptions

Defined in: [src/fake-jobs.service.ts:9](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L9)

#### Extends

- `Partial`\<[`SchedulerOptions`](#scheduleroptions)\>

#### Properties

##### contextExtractor?

```ts
optional contextExtractor?: () => JobContext;
```

Defined in: [src/fake-jobs.service.ts:12](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L12)

###### Returns

[`JobContext`](#jobcontext)

##### contextRunner?

```ts
optional contextRunner?: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/fake-jobs.service.ts:13](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L13)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`JobContext`](#jobcontext) |
| `fn` | () => `Promise`\<`unknown`\> |

###### Returns

`Promise`\<`unknown`\>

##### defaultWeight?

```ts
optional defaultWeight?: number;
```

Defined in: [src/scheduler.ts:4](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L4)

###### Inherited from

[`SchedulerOptions`](#scheduleroptions).[`defaultWeight`](#defaultweight-1)

##### jobTypes

```ts
jobTypes: string[];
```

Defined in: [src/fake-jobs.service.ts:10](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L10)

##### minSharePct?

```ts
optional minSharePct?: number;
```

Defined in: [src/scheduler.ts:5](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L5)

###### Inherited from

[`SchedulerOptions`](#scheduleroptions).[`minSharePct`](#minsharepct-1)

##### now?

```ts
optional now?: string | number | Date;
```

Defined in: [src/fake-jobs.service.ts:11](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L11)

##### tenantCap?

```ts
optional tenantCap?: number;
```

Defined in: [src/scheduler.ts:6](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L6)

###### Inherited from

[`SchedulerOptions`](#scheduleroptions).[`tenantCap`](#tenantcap-1)

***

### InMemoryOptions

Defined in: [src/jobs.module.ts:61](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L61)

#### Properties

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

##### contextExtractor?

```ts
optional contextExtractor?: () => JobContext;
```

Defined in: [src/jobs.module.ts:69](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L69)

###### Returns

[`JobContext`](#jobcontext)

##### contextRunner?

```ts
optional contextRunner?: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/jobs.module.ts:70](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L70)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`JobContext`](#jobcontext) |
| `fn` | () => `Promise`\<`unknown`\> |

###### Returns

`Promise`\<`unknown`\>

##### events?

```ts
optional events?: JobEventsOptions;
```

Defined in: [src/jobs.module.ts:66](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L66)

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

##### global?

```ts
optional global?: boolean;
```

Defined in: [src/jobs.module.ts:64](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L64)

##### jobs?

```ts
optional jobs?: JobDefinitions;
```

Defined in: [src/jobs.module.ts:63](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L63)

##### jobTypes

```ts
jobTypes: string[];
```

Defined in: [src/jobs.module.ts:62](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L62)

##### onJobFail?

```ts
optional onJobFail?: (e, err) => void;
```

Defined in: [src/jobs.module.ts:73](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L73)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#jobevent) |
| `err` | `Error` |

###### Returns

`void`

##### onJobFinish?

```ts
optional onJobFinish?: (e) => void;
```

Defined in: [src/jobs.module.ts:72](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L72)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#jobevent) |

###### Returns

`void`

##### onJobStart?

```ts
optional onJobStart?: (e) => void;
```

Defined in: [src/jobs.module.ts:71](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L71)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | [`JobEvent`](#jobevent) |

###### Returns

`void`

##### strictCapabilities?

```ts
optional strictCapabilities?: boolean;
```

Defined in: [src/jobs.module.ts:65](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L65)

***

### JobBuilder

Defined in: [src/contracts.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L20)

#### Type Parameters

| Type Parameter |
| ------ |
| `TPayload` |
| `TContext` |
| `TResult` |

#### Properties

##### \_\_context?

```ts
readonly optional __context?: TContext;
```

Defined in: [src/contracts.ts:22](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L22)

##### \_\_payload?

```ts
readonly optional __payload?: TPayload;
```

Defined in: [src/contracts.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L21)

##### \_\_result?

```ts
readonly optional __result?: TResult;
```

Defined in: [src/contracts.ts:23](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L23)

#### Methods

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

[`JobBuilder`](#jobbuilder)\<`TPayload`, `TNextContext`, `TResult`\>

##### defaults()

```ts
defaults(defaults): JobDefinition<TPayload, TContext, TResult>;
```

Defined in: [src/contracts.ts:26](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L26)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `defaults` | [`JobDefaults`](#jobdefaults) |

###### Returns

[`JobDefinition`](#jobdefinition)\<`TPayload`, `TContext`, `TResult`\>

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

[`JobBuilder`](#jobbuilder)\<`TPayload`, `TContext`, `TNextResult`\>

***

### JobContext

Defined in: [src/types.ts:3](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L3)

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### signal?

```ts
optional signal?: AbortSignal;
```

Defined in: [src/types.ts:5](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L5)

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/types.ts:4](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L4)

***

### JobDefaults

Defined in: [src/contracts.ts:29](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L29)

#### Properties

##### attempts?

```ts
optional attempts?: number;
```

Defined in: [src/contracts.ts:30](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L30)

##### backoff?

```ts
optional backoff?: BackoffPolicy;
```

Defined in: [src/contracts.ts:32](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L32)

##### timeoutMs?

```ts
optional timeoutMs?: number;
```

Defined in: [src/contracts.ts:31](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L31)

***

### JobDefinition

Defined in: [src/contracts.ts:13](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L13)

#### Type Parameters

| Type Parameter |
| ------ |
| `TPayload` |
| `TContext` |
| `TResult` |

#### Properties

##### \_\_context?

```ts
readonly optional __context?: TContext;
```

Defined in: [src/contracts.ts:15](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L15)

##### \_\_payload?

```ts
readonly optional __payload?: TPayload;
```

Defined in: [src/contracts.ts:14](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L14)

##### \_\_result?

```ts
readonly optional __result?: TResult;
```

Defined in: [src/contracts.ts:16](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L16)

##### defaults

```ts
readonly defaults: JobDefaults;
```

Defined in: [src/contracts.ts:17](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L17)

***

### JobEnvelope

Defined in: [src/types.ts:9](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L9)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

##### attempts

```ts
attempts: number;
```

Defined in: [src/types.ts:15](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L15)

##### backoff?

```ts
optional backoff?: BackoffPolicy;
```

Defined in: [src/types.ts:19](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L19)

##### context

```ts
context: JobContext;
```

Defined in: [src/types.ts:13](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L13)

##### dedupeKey?

```ts
optional dedupeKey?: string;
```

Defined in: [src/types.ts:22](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L22)

##### enqueuedAt

```ts
enqueuedAt: Date;
```

Defined in: [src/types.ts:14](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L14)

##### id

```ts
id: string;
```

Defined in: [src/types.ts:10](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L10)

##### idempotencyKey?

```ts
optional idempotencyKey?: string;
```

Defined in: [src/types.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L21)

##### jobType

```ts
jobType: string;
```

Defined in: [src/types.ts:11](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L11)

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/types.ts:16](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L16)

##### metadata

```ts
metadata: Record<string, unknown>;
```

Defined in: [src/types.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L20)

##### payload

```ts
payload: T;
```

Defined in: [src/types.ts:12](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L12)

##### scheduledFor?

```ts
optional scheduledFor?: Date;
```

Defined in: [src/types.ts:17](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L17)

##### timeoutMs?

```ts
optional timeoutMs?: number;
```

Defined in: [src/types.ts:18](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L18)

***

### JobErrorSummary

Defined in: [src/lifecycle.ts:11](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L11)

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/lifecycle.ts:14](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L14)

##### message

```ts
message: string;
```

Defined in: [src/lifecycle.ts:13](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L13)

##### name?

```ts
optional name?: string;
```

Defined in: [src/lifecycle.ts:12](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L12)

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/lifecycle.ts:15](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L15)

***

### JobEvent

Defined in: [src/types.ts:33](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L33)

#### Properties

##### attempt?

```ts
optional attempt?: number;
```

Defined in: [src/types.ts:37](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L37)

##### durationMs?

```ts
optional durationMs?: number;
```

Defined in: [src/types.ts:40](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L40)

##### finishedAt?

```ts
optional finishedAt?: Date;
```

Defined in: [src/types.ts:39](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L39)

##### jobId

```ts
jobId: string;
```

Defined in: [src/types.ts:34](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L34)

##### jobType

```ts
jobType: string;
```

Defined in: [src/types.ts:35](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L35)

##### startedAt?

```ts
optional startedAt?: Date;
```

Defined in: [src/types.ts:38](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L38)

##### tenantId

```ts
tenantId: string | undefined;
```

Defined in: [src/types.ts:36](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L36)

***

### JobEventsOptions

Defined in: [src/lifecycle.ts:86](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L86)

#### Properties

##### onEvent?

```ts
optional onEvent?: (event) => void;
```

Defined in: [src/lifecycle.ts:87](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L87)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`JobLifecycleEvent`](#joblifecycleevent) |

###### Returns

`void`

***

### JobHistoryEntry

Defined in: [src/lifecycle.ts:38](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L38)

#### Properties

##### at

```ts
at: Date;
```

Defined in: [src/lifecycle.ts:42](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L42)

##### attempt

```ts
attempt: number;
```

Defined in: [src/lifecycle.ts:41](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L41)

##### error?

```ts
optional error?: JobErrorSummary;
```

Defined in: [src/lifecycle.ts:44](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L44)

##### jobId

```ts
jobId: string;
```

Defined in: [src/lifecycle.ts:39](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L39)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/lifecycle.ts:45](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L45)

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/lifecycle.ts:43](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L43)

##### status

```ts
status: JobStatus;
```

Defined in: [src/lifecycle.ts:40](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L40)

***

### JobInstance

Defined in: [src/contracts.ts:52](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L52)

#### Type Parameters

| Type Parameter |
| ------ |
| `TJobs` *extends* [`JobDefinitions`](#jobdefinitions) |
| `TType` *extends* [`JobType`](#jobtype-4)\<`TJobs`\> |

#### Properties

##### attempt

```ts
attempt: number;
```

Defined in: [src/contracts.ts:60](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L60)

##### context

```ts
context: JobContextOf<TJobs, TType>;
```

Defined in: [src/contracts.ts:59](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L59)

##### id

```ts
id: string;
```

Defined in: [src/contracts.ts:56](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L56)

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/contracts.ts:61](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L61)

##### metadata

```ts
metadata: Record<string, unknown>;
```

Defined in: [src/contracts.ts:63](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L63)

##### payload

```ts
payload: JobPayload<TJobs, TType>;
```

Defined in: [src/contracts.ts:58](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L58)

##### signal

```ts
signal: AbortSignal;
```

Defined in: [src/contracts.ts:62](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L62)

##### type

```ts
type: TType;
```

Defined in: [src/contracts.ts:57](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L57)

***

### JobLifecycleEvent

Defined in: [src/lifecycle.ts:74](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L74)

#### Properties

##### at

```ts
at: Date;
```

Defined in: [src/lifecycle.ts:80](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L80)

##### attempt

```ts
attempt: number;
```

Defined in: [src/lifecycle.ts:79](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L79)

##### durationMs?

```ts
optional durationMs?: number;
```

Defined in: [src/lifecycle.ts:81](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L81)

##### error?

```ts
optional error?: JobErrorSummary;
```

Defined in: [src/lifecycle.ts:82](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L82)

##### jobId

```ts
jobId: string;
```

Defined in: [src/lifecycle.ts:76](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L76)

##### jobType

```ts
jobType: string;
```

Defined in: [src/lifecycle.ts:77](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L77)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/lifecycle.ts:83](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L83)

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/lifecycle.ts:78](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L78)

##### type

```ts
type: JobLifecycleEventType;
```

Defined in: [src/lifecycle.ts:75](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L75)

***

### JobRecord

Defined in: [src/lifecycle.ts:18](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L18)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TPayload` | `unknown` |
| `TContext` | `unknown` |

#### Properties

##### attempt

```ts
attempt: number;
```

Defined in: [src/lifecycle.ts:24](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L24)

##### completedAt?

```ts
optional completedAt?: Date;
```

Defined in: [src/lifecycle.ts:29](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L29)

##### context?

```ts
optional context?: TContext;
```

Defined in: [src/lifecycle.ts:23](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L23)

##### dedupeKey?

```ts
optional dedupeKey?: string;
```

Defined in: [src/lifecycle.ts:34](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L34)

##### enqueuedAt

```ts
enqueuedAt: Date;
```

Defined in: [src/lifecycle.ts:26](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L26)

##### error?

```ts
optional error?: JobErrorSummary;
```

Defined in: [src/lifecycle.ts:32](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L32)

##### failedAt?

```ts
optional failedAt?: Date;
```

Defined in: [src/lifecycle.ts:30](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L30)

##### id

```ts
id: string;
```

Defined in: [src/lifecycle.ts:19](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L19)

##### idempotencyKey?

```ts
optional idempotencyKey?: string;
```

Defined in: [src/lifecycle.ts:33](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L33)

##### maxAttempts

```ts
maxAttempts: number;
```

Defined in: [src/lifecycle.ts:25](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L25)

##### metadata

```ts
metadata: Record<string, unknown>;
```

Defined in: [src/lifecycle.ts:35](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L35)

##### nextAttemptAt?

```ts
optional nextAttemptAt?: Date;
```

Defined in: [src/lifecycle.ts:31](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L31)

##### payload?

```ts
optional payload?: TPayload;
```

Defined in: [src/lifecycle.ts:22](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L22)

##### scheduledFor?

```ts
optional scheduledFor?: Date;
```

Defined in: [src/lifecycle.ts:27](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L27)

##### startedAt?

```ts
optional startedAt?: Date;
```

Defined in: [src/lifecycle.ts:28](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L28)

##### status

```ts
status: JobStatus;
```

Defined in: [src/lifecycle.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L21)

##### type

```ts
type: string;
```

Defined in: [src/lifecycle.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L20)

***

### JobsBackend

Defined in: [src/backend/jobs-backend.interface.ts:11](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L11)

#### Methods

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

`Promise`\<`void` \| [`JobRecord`](#jobrecord)\<`unknown`, `unknown`\>\>

##### capabilities()

```ts
capabilities(): BackendCapabilities;
```

Defined in: [src/backend/jobs-backend.interface.ts:12](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L12)

###### Returns

[`BackendCapabilities`](#backendcapabilities)

##### close()

```ts
close(): Promise<void>;
```

Defined in: [src/backend/jobs-backend.interface.ts:28](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L28)

###### Returns

`Promise`\<`void`\>

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
| `opts` | [`EnqueueOptions`](#enqueueoptions) |

###### Returns

`Promise`\<`string`\>

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
| `opts` | [`EnqueueOptions`](#enqueueoptions) |

###### Returns

`Promise`\<[`EnqueueResult`](#enqueueresult)\>

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

`Promise`\<`void` \| [`JobRecord`](#jobrecord)\<`unknown`, `unknown`\>\>

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

`Promise`\<[`JobRecord`](#jobrecord)\<`unknown`, `unknown`\> \| `null`\>

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

`Promise`\<[`JobHistoryEntry`](#jobhistoryentry)[]\>

##### listDeadLetters()?

```ts
optional listDeadLetters(filter?): Promise<JobRecord<unknown, unknown>[]>;
```

Defined in: [src/backend/jobs-backend.interface.ts:25](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L25)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filter?` | [`DeadLetterFilter`](#deadletterfilter) |

###### Returns

`Promise`\<[`JobRecord`](#jobrecord)\<`unknown`, `unknown`\>[]\>

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

`Promise`\<[`JobEnvelope`](#jobenvelope)\<`unknown`\> \| `null`\>

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

`Promise`\<[`JobEnvelope`](#jobenvelope)\<`unknown`\>[]\>

##### replayDeadLetter()?

```ts
optional replayDeadLetter(jobId, options?): Promise<string>;
```

Defined in: [src/backend/jobs-backend.interface.ts:26](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/backend/jobs-backend.interface.ts#L26)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |
| `options?` | [`ReplayOptions`](#replayoptions) |

###### Returns

`Promise`\<`string`\>

***

### JobsOutboxBridgeOptions

Defined in: [src/outbox/outbox-bridge.module.ts:13](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L13)

#### Properties

##### jobs

```ts
jobs: JobsService;
```

Defined in: [src/outbox/outbox-bridge.module.ts:14](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L14)

##### map

```ts
map: Record<string, string>;
```

Defined in: [src/outbox/outbox-bridge.module.ts:16](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L16)

##### source

```ts
source: OutboxSource;
```

Defined in: [src/outbox/outbox-bridge.module.ts:15](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L15)

##### tenantFrom?

```ts
optional tenantFrom?: (event) => string;
```

Defined in: [src/outbox/outbox-bridge.module.ts:17](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`OutboxEvent`](#outboxevent) |

###### Returns

`string`

***

### JobsServiceDeps

Defined in: [src/jobs.service.ts:17](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L17)

#### Properties

##### backend

```ts
backend: JobsBackend;
```

Defined in: [src/jobs.service.ts:18](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L18)

##### contextExtractor?

```ts
optional contextExtractor?: () => JobContext;
```

Defined in: [src/jobs.service.ts:22](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L22)

###### Returns

[`JobContext`](#jobcontext)

##### contextRunner?

```ts
optional contextRunner?: (ctx, fn) => Promise<unknown>;
```

Defined in: [src/jobs.service.ts:23](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L23)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`JobContext`](#jobcontext) |
| `fn` | () => `Promise`\<`unknown`\> |

###### Returns

`Promise`\<`unknown`\>

##### events?

```ts
optional events?: JobEventsOptions;
```

Defined in: [src/jobs.service.ts:24](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L24)

##### jobTypes?

```ts
optional jobTypes?: Iterable<string, any, any>;
```

Defined in: [src/jobs.service.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L21)

##### registry

```ts
registry: HandlerRegistry;
```

Defined in: [src/jobs.service.ts:19](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L19)

##### schedulers?

```ts
optional schedulers?: Map<string, Scheduler>;
```

Defined in: [src/jobs.service.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.service.ts#L20)

***

### OutboxEvent

Defined in: [src/outbox/outbox-bridge.module.ts:3](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L3)

#### Properties

##### payload

```ts
payload: Record<string, unknown>;
```

Defined in: [src/outbox/outbox-bridge.module.ts:5](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L5)

##### tenantId

```ts
tenantId: string;
```

Defined in: [src/outbox/outbox-bridge.module.ts:6](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L6)

##### type

```ts
type: string;
```

Defined in: [src/outbox/outbox-bridge.module.ts:4](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L4)

***

### OutboxSource

Defined in: [src/outbox/outbox-bridge.module.ts:9](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/outbox/outbox-bridge.module.ts#L9)

#### Methods

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

### PickedJob

Defined in: [src/scheduler.ts:18](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L18)

#### Properties

##### jobId

```ts
jobId: string;
```

Defined in: [src/scheduler.ts:19](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L19)

##### tenantId

```ts
tenantId: string;
```

Defined in: [src/scheduler.ts:20](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L20)

***

### ReplayOptions

Defined in: [src/lifecycle.ts:101](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L101)

#### Properties

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/lifecycle.ts:104](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L104)

##### preserveOriginalId?

```ts
optional preserveOriginalId?: boolean;
```

Defined in: [src/lifecycle.ts:102](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L102)

##### resetAttempts?

```ts
optional resetAttempts?: boolean;
```

Defined in: [src/lifecycle.ts:103](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/lifecycle.ts#L103)

***

### RetryPolicy

Defined in: [src/retry.ts:5](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/retry.ts#L5)

#### Properties

##### attempts?

```ts
optional attempts?: number;
```

Defined in: [src/retry.ts:6](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/retry.ts#L6)

##### backoff?

```ts
optional backoff?: BackoffPolicy;
```

Defined in: [src/retry.ts:7](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/retry.ts#L7)

***

### SchedulerOptions

Defined in: [src/scheduler.ts:3](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L3)

#### Properties

##### defaultWeight

```ts
defaultWeight: number;
```

Defined in: [src/scheduler.ts:4](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L4)

##### minSharePct

```ts
minSharePct: number;
```

Defined in: [src/scheduler.ts:5](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L5)

##### tenantCap

```ts
tenantCap: number;
```

Defined in: [src/scheduler.ts:6](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/scheduler.ts#L6)

***

### ShardSnapshot

Defined in: [src/types.ts:25](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L25)

#### Properties

##### inflight

```ts
inflight: number;
```

Defined in: [src/types.ts:28](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L28)

##### starvationTokens

```ts
starvationTokens: number;
```

Defined in: [src/types.ts:30](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L30)

##### tenantId

```ts
tenantId: string;
```

Defined in: [src/types.ts:26](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L26)

##### waiting

```ts
waiting: number;
```

Defined in: [src/types.ts:27](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L27)

##### weight

```ts
weight: number;
```

Defined in: [src/types.ts:29](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/types.ts#L29)

***

### TypedJobHandler

Defined in: [src/contracts.ts:66](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L66)

#### Type Parameters

| Type Parameter |
| ------ |
| `TJobs` *extends* [`JobDefinitions`](#jobdefinitions) |
| `TType` *extends* [`JobType`](#jobtype-4)\<`TJobs`\> |

#### Methods

##### handle()

```ts
handle(job): Promise<JobResult<TJobs, TType>>;
```

Defined in: [src/contracts.ts:70](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L70)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `job` | [`JobInstance`](#jobinstance)\<`TJobs`, `TType`\> |

###### Returns

`Promise`\<[`JobResult`](#jobresult)\<`TJobs`, `TType`\>\>

***

### TypedJobsService

Defined in: [src/contracts.ts:73](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L73)

#### Type Parameters

| Type Parameter |
| ------ |
| `TJobs` *extends* [`JobDefinitions`](#jobdefinitions) |

#### Methods

##### capabilities()

```ts
capabilities(): BackendCapabilities;
```

Defined in: [src/contracts.ts:91](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L91)

###### Returns

[`BackendCapabilities`](#backendcapabilities)

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
| `payload` | [`JobPayload`](#jobpayload)\<`TJobs`, `TType`\> |
| `options?` | [`EnqueueOptions`](#enqueueoptions)\<[`JobContextOf`](#jobcontextof)\<`TJobs`, `TType`\>\> |

###### Returns

`Promise`\<`string`\>

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
| `payload` | [`JobPayload`](#jobpayload)\<`TJobs`, `TType`\> |
| `options?` | [`EnqueueOptions`](#enqueueoptions)\<[`JobContextOf`](#jobcontextof)\<`TJobs`, `TType`\>\> |

###### Returns

`Promise`\<[`EnqueueResult`](#enqueueresult)\>

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
  \| [`JobRecord`](#jobrecord)\<[`JobPayload`](#jobpayload)\<`TJobs`, `TType`\>, [`JobContextOf`](#jobcontextof)\<`TJobs`, `TType`\>\>
  \| `null`\>

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

`Promise`\<[`JobHistoryEntry`](#jobhistoryentry)[]\>

##### listDeadLetters()

```ts
listDeadLetters(filter?): Promise<JobRecord<unknown, unknown>[]>;
```

Defined in: [src/contracts.ts:92](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L92)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `filter?` | [`DeadLetterFilter`](#deadletterfilter) |

###### Returns

`Promise`\<[`JobRecord`](#jobrecord)\<`unknown`, `unknown`\>[]\>

##### replayDeadLetter()

```ts
replayDeadLetter(jobId, options?): Promise<string>;
```

Defined in: [src/contracts.ts:93](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L93)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `jobId` | `string` |
| `options?` | [`ReplayOptions`](#replayoptions) |

###### Returns

`Promise`\<`string`\>

## Type Aliases

### AnyJobDefinition

```ts
type AnyJobDefinition = 
  | JobBuilder<unknown, unknown, unknown>
| JobDefinition<unknown, unknown, unknown>;
```

Defined in: [src/contracts.ts:9](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L9)

***

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

### HandlerFn

```ts
type HandlerFn = (payload, context) => Promise<unknown>;
```

Defined in: [src/handler-registry.ts:4](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/handler-registry.ts#L4)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `payload` | `Record`\<`string`, `unknown`\> |
| `context` | [`JobContext`](#jobcontext) |

#### Returns

`Promise`\<`unknown`\>

***

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
| `TJobs` *extends* [`JobDefinitions`](#jobdefinitions) |
| `TType` *extends* [`JobType`](#jobtype-4)\<`TJobs`\> |

***

### JobDefinitions

```ts
type JobDefinitions = Record<string, AnyJobDefinition>;
```

Defined in: [src/contracts.ts:7](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L7)

***

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
| `TJobs` *extends* [`JobDefinitions`](#jobdefinitions) |
| `TType` *extends* [`JobType`](#jobtype-4)\<`TJobs`\> |

***

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
| `TJobs` *extends* [`JobDefinitions`](#jobdefinitions) |
| `TType` *extends* [`JobType`](#jobtype-4)\<`TJobs`\> |

***

### JobsErrorCode

```ts
type JobsErrorCode = typeof JobsErrorCode[keyof typeof JobsErrorCode];
```

Defined in: [src/errors.ts:1](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L1)

***

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

### JobType

```ts
type JobType<TJobs> = Extract<keyof TJobs, string>;
```

Defined in: [src/contracts.ts:35](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L35)

#### Type Parameters

| Type Parameter |
| ------ |
| `TJobs` *extends* [`JobDefinitions`](#jobdefinitions) |

## Variables

### CONTEXT\_KEY

```ts
const CONTEXT_KEY: "__nestarcCtx" = '__nestarcCtx';
```

Defined in: [src/context-serializer.ts:4](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/context-serializer.ts#L4)

***

### JOB\_HANDLER\_METADATA

```ts
const JOB_HANDLER_METADATA: "nestarc:jobs:handler" = 'nestarc:jobs:handler';
```

Defined in: [src/decorators/job-handler.decorator.ts:3](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/decorators/job-handler.decorator.ts#L3)

***

### JOBS\_BACKEND

```ts
const JOBS_BACKEND: typeof JOBS_BACKEND;
```

Defined in: [src/jobs.module.ts:24](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L24)

***

### JOBS\_SERVICE

```ts
const JOBS_SERVICE: typeof JOBS_SERVICE;
```

Defined in: [src/contracts.ts:5](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L5)

***

### JOBS\_WORKERS

```ts
const JOBS_WORKERS: typeof JOBS_WORKERS;
```

Defined in: [src/jobs.module.ts:25](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/jobs.module.ts#L25)

***

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
| <a id="property-fairnessmisconfig"></a> `FairnessMisconfig` | `"jobs_fairness_misconfig"` | `'jobs_fairness_misconfig'` | [src/errors.ts:5](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L5) |
| <a id="property-handlernotfound"></a> `HandlerNotFound` | `"jobs_handler_not_found"` | `'jobs_handler_not_found'` | [src/errors.ts:3](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L3) |
| <a id="property-queuenotfound"></a> `QueueNotFound` | `"jobs_queue_not_found"` | `'jobs_queue_not_found'` | [src/errors.ts:4](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L4) |
| <a id="property-reservedpayloadkey"></a> `ReservedPayloadKey` | `"jobs_reserved_payload_key"` | `'jobs_reserved_payload_key'` | [src/errors.ts:2](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/errors.ts#L2) |

## Functions

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
| `context` | [`JobContext`](#jobcontext) \| `undefined` |

#### Returns

`T` & \{
  `__nestarcCtx`: [`JobContext`](#jobcontext);
\}

***

### computeBackoffDelayMs()

```ts
function computeBackoffDelayMs(policy, attempt): number;
```

Defined in: [src/retry.ts:10](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/retry.ts#L10)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `policy` | [`BackoffPolicy`](#backoffpolicy) \| `undefined` |
| `attempt` | `number` |

#### Returns

`number`

***

### createFakeJobs()

```ts
function createFakeJobs(opts): FakeJobsService;
```

Defined in: [src/fake-jobs.service.ts:70](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/fake-jobs.service.ts#L70)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`FakeJobsOptions`](#fakejobsoptions) |

#### Returns

[`FakeJobsService`](#fakejobsservice)

***

### defineJobs()

```ts
function defineJobs<TJobs>(definitions): TJobs;
```

Defined in: [src/contracts.ts:101](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L101)

#### Type Parameters

| Type Parameter |
| ------ |
| `TJobs` *extends* [`JobDefinitions`](#jobdefinitions) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `definitions` | `TJobs` |

#### Returns

`TJobs`

***

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
| `context` | [`JobContext`](#jobcontext) | [src/context-serializer.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/context-serializer.ts#L21) |
| `payload` | `Omit`\<`T`, *typeof* [`CONTEXT_KEY`](#context-key)\> | [src/context-serializer.ts:21](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/context-serializer.ts#L21) |

***

### InjectJobs()

```ts
function InjectJobs(): PropertyDecorator & ParameterDecorator;
```

Defined in: [src/contracts.ts:105](https://github.com/nestarc/jobs/blob/de3f44caafb2ca3f99f4c009e139c7f8e3bbf920/src/contracts.ts#L105)

#### Returns

`PropertyDecorator` & `ParameterDecorator`

***

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

[`JobBuilder`](#jobbuilder)\<`TPayload`, [`JobContext`](#jobcontext), `unknown`\>

***

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
