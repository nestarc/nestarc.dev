# client

## Interfaces

### CursorPaginationMeta

Defined in: [src/client/index.ts:40](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L40)

#### Properties

##### hasMore

```ts
hasMore: boolean;
```

Defined in: [src/client/index.ts:44](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L44)

##### limit

```ts
limit: number;
```

Defined in: [src/client/index.ts:45](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L45)

##### links?

```ts
optional links?: PaginationLinks;
```

Defined in: [src/client/index.ts:47](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L47)

##### nextCursor

```ts
nextCursor: string | null;
```

Defined in: [src/client/index.ts:42](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L42)

##### previousCursor

```ts
previousCursor: string | null;
```

Defined in: [src/client/index.ts:43](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L43)

##### totalCount?

```ts
optional totalCount?: number;
```

Defined in: [src/client/index.ts:46](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L46)

##### type

```ts
type: "cursor";
```

Defined in: [src/client/index.ts:41](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L41)

***

### DeprecationMeta

Defined in: [src/client/index.ts:55](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L55)

#### Properties

##### deprecated

```ts
deprecated: true;
```

Defined in: [src/client/index.ts:56](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L56)

##### link?

```ts
optional link?: string;
```

Defined in: [src/client/index.ts:60](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L60)

##### message?

```ts
optional message?: string;
```

Defined in: [src/client/index.ts:59](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L59)

##### since?

```ts
optional since?: string;
```

Defined in: [src/client/index.ts:57](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L57)

##### sunset?

```ts
optional sunset?: string;
```

Defined in: [src/client/index.ts:58](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L58)

***

### PaginationLinks

Defined in: [src/client/index.ts:21](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L21)

@nestarc/safe-response/client

Lightweight client-side types and type guards for consuming API responses.
This module has ZERO runtime dependencies — no NestJS, no Swagger, no reflect-metadata.

#### Example

```typescript
import type { SafeSuccessResponse, SafeErrorResponse } from '@nestarc/safe-response/client';
import { isSuccess, isError } from '@nestarc/safe-response/client';

const res = await fetch('/api/users').then(r => r.json());
if (isSuccess(res)) {
  console.log(res.data);
}
```

#### Properties

##### first

```ts
first: string;
```

Defined in: [src/client/index.ts:23](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L23)

##### last

```ts
last: string | null;
```

Defined in: [src/client/index.ts:26](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L26)

##### next

```ts
next: string | null;
```

Defined in: [src/client/index.ts:25](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L25)

##### prev

```ts
prev: string | null;
```

Defined in: [src/client/index.ts:24](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L24)

##### self

```ts
self: string;
```

Defined in: [src/client/index.ts:22](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L22)

***

### PaginationMeta

Defined in: [src/client/index.ts:29](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L29)

#### Properties

##### hasNext

```ts
hasNext: boolean;
```

Defined in: [src/client/index.ts:35](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L35)

##### hasPrev

```ts
hasPrev: boolean;
```

Defined in: [src/client/index.ts:36](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L36)

##### limit

```ts
limit: number;
```

Defined in: [src/client/index.ts:32](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L32)

##### links?

```ts
optional links?: PaginationLinks;
```

Defined in: [src/client/index.ts:37](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L37)

##### page

```ts
page: number;
```

Defined in: [src/client/index.ts:31](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L31)

##### total

```ts
total: number;
```

Defined in: [src/client/index.ts:33](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L33)

##### totalPages

```ts
totalPages: number;
```

Defined in: [src/client/index.ts:34](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L34)

##### type?

```ts
optional type?: "offset";
```

Defined in: [src/client/index.ts:30](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L30)

***

### RateLimitMeta

Defined in: [src/client/index.ts:63](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L63)

#### Properties

##### limit

```ts
limit: number;
```

Defined in: [src/client/index.ts:64](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L64)

##### remaining

```ts
remaining: number;
```

Defined in: [src/client/index.ts:65](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L65)

##### reset

```ts
reset: number;
```

Defined in: [src/client/index.ts:66](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L66)

##### retryAfter?

```ts
optional retryAfter?: number;
```

Defined in: [src/client/index.ts:67](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L67)

***

### ResponseMeta

Defined in: [src/client/index.ts:70](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L70)

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### deprecation?

```ts
optional deprecation?: DeprecationMeta;
```

Defined in: [src/client/index.ts:76](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L76)

##### filters?

```ts
optional filters?: Record<string, unknown>;
```

Defined in: [src/client/index.ts:75](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L75)

##### message?

```ts
optional message?: string;
```

Defined in: [src/client/index.ts:72](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L72)

##### pagination?

```ts
optional pagination?: 
  | PaginationMeta
  | CursorPaginationMeta;
```

Defined in: [src/client/index.ts:71](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L71)

##### rateLimit?

```ts
optional rateLimit?: RateLimitMeta;
```

Defined in: [src/client/index.ts:77](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L77)

##### responseTime?

```ts
optional responseTime?: number;
```

Defined in: [src/client/index.ts:73](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L73)

##### sort?

```ts
optional sort?: SortInfo;
```

Defined in: [src/client/index.ts:74](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L74)

***

### SafeErrorResponse

Defined in: [src/client/index.ts:92](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L92)

#### Properties

##### error

```ts
error: {
  code: string;
  details?: unknown;
  message: string;
};
```

Defined in: [src/client/index.ts:96](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L96)

###### code

```ts
code: string;
```

###### details?

```ts
optional details?: unknown;
```

###### message

```ts
message: string;
```

##### meta?

```ts
optional meta?: {
[key: string]: unknown;
  deprecation?: DeprecationMeta;
  rateLimit?: RateLimitMeta;
  responseTime?: number;
};
```

Defined in: [src/client/index.ts:101](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L101)

###### Index Signature

```ts
[key: string]: unknown
```

###### deprecation?

```ts
optional deprecation?: DeprecationMeta;
```

###### rateLimit?

```ts
optional rateLimit?: RateLimitMeta;
```

###### responseTime?

```ts
optional responseTime?: number;
```

##### path?

```ts
optional path?: string;
```

Defined in: [src/client/index.ts:108](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L108)

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/client/index.ts:95](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L95)

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/client/index.ts:94](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L94)

##### success

```ts
success: false;
```

Defined in: [src/client/index.ts:93](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L93)

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/client/index.ts:107](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L107)

***

### SafeProblemDetailsResponse

Defined in: [src/client/index.ts:111](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L111)

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/client/index.ts:117](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L117)

##### detail

```ts
detail: string;
```

Defined in: [src/client/index.ts:115](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L115)

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/client/index.ts:119](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L119)

##### instance

```ts
instance: string;
```

Defined in: [src/client/index.ts:116](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L116)

##### meta?

```ts
optional meta?: {
[key: string]: unknown;
  deprecation?: DeprecationMeta;
  rateLimit?: RateLimitMeta;
  responseTime?: number;
};
```

Defined in: [src/client/index.ts:120](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L120)

###### Index Signature

```ts
[key: string]: unknown
```

###### deprecation?

```ts
optional deprecation?: DeprecationMeta;
```

###### rateLimit?

```ts
optional rateLimit?: RateLimitMeta;
```

###### responseTime?

```ts
optional responseTime?: number;
```

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/client/index.ts:118](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L118)

##### status

```ts
status: number;
```

Defined in: [src/client/index.ts:114](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L114)

##### title

```ts
title: string;
```

Defined in: [src/client/index.ts:113](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L113)

##### type

```ts
type: string;
```

Defined in: [src/client/index.ts:112](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L112)

***

### SafeSuccessResponse

Defined in: [src/client/index.ts:81](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L81)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/client/index.ts:84](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L84)

##### data

```ts
data: T;
```

Defined in: [src/client/index.ts:86](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L86)

##### meta?

```ts
optional meta?: ResponseMeta;
```

Defined in: [src/client/index.ts:87](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L87)

##### path?

```ts
optional path?: string;
```

Defined in: [src/client/index.ts:89](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L89)

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/client/index.ts:85](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L85)

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/client/index.ts:83](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L83)

##### success

```ts
success: true;
```

Defined in: [src/client/index.ts:82](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L82)

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/client/index.ts:88](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L88)

***

### SortInfo

Defined in: [src/client/index.ts:50](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L50)

#### Properties

##### field

```ts
field: string;
```

Defined in: [src/client/index.ts:51](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L51)

##### order

```ts
order: "asc" | "desc";
```

Defined in: [src/client/index.ts:52](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L52)

## Type Aliases

### SafeAnyResponse

```ts
type SafeAnyResponse<T> = 
  | SafeSuccessResponse<T>
  | SafeErrorResponse
  | SafeProblemDetailsResponse;
```

Defined in: [src/client/index.ts:132](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L132)

Broader union including RFC 9457 Problem Details (when `problemDetails` is enabled)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

***

### SafeResponse

```ts
type SafeResponse<T> = 
  | SafeSuccessResponse<T>
  | SafeErrorResponse;
```

Defined in: [src/client/index.ts:129](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L129)

Union type for standard API responses (success or error envelope)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Functions

### hasFilters()

```ts
function hasFilters(meta?): meta is ResponseMeta & { filters: Record<string, unknown> };
```

Defined in: [src/client/index.ts:202](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L202)

Check if response meta contains filter information with valid shape

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `meta?` | [`ResponseMeta`](#responsemeta) |

#### Returns

`meta is ResponseMeta & { filters: Record<string, unknown> }`

***

### hasRateLimit()

```ts
function hasRateLimit(meta?): meta is ResponseMeta & { rateLimit: RateLimitMeta };
```

Defined in: [src/client/index.ts:221](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L221)

Check if response meta contains rate limit information with valid shape

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `meta?` | [`ResponseMeta`](#responsemeta) |

#### Returns

`meta is ResponseMeta & { rateLimit: RateLimitMeta }`

***

### hasResponseTime()

```ts
function hasResponseTime(meta?): meta is ResponseMeta & { responseTime: number };
```

Defined in: [src/client/index.ts:183](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L183)

Check if response meta contains a response time measurement

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `meta?` | \| [`ResponseMeta`](#responsemeta) \| \{ \[`key`: `string`\]: `unknown`; `responseTime?`: `number`; \} |

#### Returns

`meta is ResponseMeta & { responseTime: number }`

***

### hasSort()

```ts
function hasSort(meta?): meta is ResponseMeta & { sort: SortInfo };
```

Defined in: [src/client/index.ts:190](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L190)

Check if response meta contains sort information with valid shape

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `meta?` | [`ResponseMeta`](#responsemeta) |

#### Returns

`meta is ResponseMeta & { sort: SortInfo }`

***

### isCursorPagination()

```ts
function isCursorPagination(pagination): pagination is CursorPaginationMeta;
```

Defined in: [src/client/index.ts:161](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L161)

Check if pagination is cursor-based

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pagination` | \| [`PaginationMeta`](#paginationmeta) \| [`CursorPaginationMeta`](#cursorpaginationmeta) |

#### Returns

`pagination is CursorPaginationMeta`

***

### isDeprecated()

```ts
function isDeprecated(meta?): meta is ResponseMeta & { deprecation: DeprecationMeta };
```

Defined in: [src/client/index.ts:214](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L214)

Check if response meta indicates a deprecated endpoint

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `meta?` | [`ResponseMeta`](#responsemeta) |

#### Returns

`meta is ResponseMeta & { deprecation: DeprecationMeta }`

***

### isError()

```ts
function isError(res): res is SafeErrorResponse;
```

Defined in: [src/client/index.ts:144](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L144)

Check if a response is an error response

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `res` | [`SafeResponse`](#saferesponse) |

#### Returns

`res is SafeErrorResponse`

***

### isOffsetPagination()

```ts
function isOffsetPagination(pagination): pagination is PaginationMeta;
```

Defined in: [src/client/index.ts:154](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L154)

Check if pagination is offset-based

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pagination` | \| [`PaginationMeta`](#paginationmeta) \| [`CursorPaginationMeta`](#cursorpaginationmeta) |

#### Returns

`pagination is PaginationMeta`

***

### isPaginated()

```ts
function isPaginated(meta?): meta is ResponseMeta & { pagination: PaginationMeta | CursorPaginationMeta };
```

Defined in: [src/client/index.ts:149](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L149)

Check if response meta contains pagination

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `meta?` | [`ResponseMeta`](#responsemeta) |

#### Returns

meta is ResponseMeta & \{ pagination: PaginationMeta \| CursorPaginationMeta \}

***

### isProblemDetailsResponse()

```ts
function isProblemDetailsResponse(res): res is SafeProblemDetailsResponse;
```

Defined in: [src/client/index.ts:168](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L168)

Check if a response is an RFC 9457 Problem Details response

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `res` | `unknown` |

#### Returns

`res is SafeProblemDetailsResponse`

***

### isSuccess()

```ts
function isSuccess<T>(res): res is SafeSuccessResponse<T>;
```

Defined in: [src/client/index.ts:137](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/client/index.ts#L137)

Check if a response is a successful response

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `res` | [`SafeResponse`](#saferesponse)\<`T`\> |

#### Returns

`res is SafeSuccessResponse<T>`
