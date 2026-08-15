# client

## Interfaces

<a id="api-cursorpaginationmeta"></a>

### CursorPaginationMeta

Defined in: [src/client/index.ts:40](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L40)

#### Properties

<a id="api-hasmore"></a>

##### hasMore

```ts
hasMore: boolean;
```

Defined in: [src/client/index.ts:44](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L44)

<a id="api-limit"></a>

##### limit

```ts
limit: number;
```

Defined in: [src/client/index.ts:45](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L45)

<a id="api-links"></a>

##### links?

```ts
optional links?: PaginationLinks;
```

Defined in: [src/client/index.ts:47](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L47)

<a id="api-nextcursor"></a>

##### nextCursor

```ts
nextCursor: string | null;
```

Defined in: [src/client/index.ts:42](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L42)

<a id="api-previouscursor"></a>

##### previousCursor

```ts
previousCursor: string | null;
```

Defined in: [src/client/index.ts:43](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L43)

<a id="api-totalcount"></a>

##### totalCount?

```ts
optional totalCount?: number;
```

Defined in: [src/client/index.ts:46](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L46)

<a id="api-type"></a>

##### type

```ts
type: "cursor";
```

Defined in: [src/client/index.ts:41](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L41)

***

<a id="api-deprecationmeta"></a>

### DeprecationMeta

Defined in: [src/client/index.ts:55](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L55)

#### Properties

<a id="api-deprecated"></a>

##### deprecated

```ts
deprecated: true;
```

Defined in: [src/client/index.ts:56](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L56)

<a id="api-link"></a>

##### link?

```ts
optional link?: string;
```

Defined in: [src/client/index.ts:60](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L60)

<a id="api-message"></a>

##### message?

```ts
optional message?: string;
```

Defined in: [src/client/index.ts:59](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L59)

<a id="api-since"></a>

##### since?

```ts
optional since?: string;
```

Defined in: [src/client/index.ts:57](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L57)

<a id="api-sunset"></a>

##### sunset?

```ts
optional sunset?: string;
```

Defined in: [src/client/index.ts:58](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L58)

***

<a id="api-paginationlinks"></a>

### PaginationLinks

Defined in: [src/client/index.ts:21](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L21)

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

<a id="api-first"></a>

##### first

```ts
first: string;
```

Defined in: [src/client/index.ts:23](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L23)

<a id="api-last"></a>

##### last

```ts
last: string | null;
```

Defined in: [src/client/index.ts:26](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L26)

<a id="api-next"></a>

##### next

```ts
next: string | null;
```

Defined in: [src/client/index.ts:25](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L25)

<a id="api-prev"></a>

##### prev

```ts
prev: string | null;
```

Defined in: [src/client/index.ts:24](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L24)

<a id="api-self"></a>

##### self

```ts
self: string;
```

Defined in: [src/client/index.ts:22](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L22)

***

<a id="api-paginationmeta"></a>

### PaginationMeta

Defined in: [src/client/index.ts:29](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L29)

#### Properties

<a id="api-hasnext"></a>

##### hasNext

```ts
hasNext: boolean;
```

Defined in: [src/client/index.ts:35](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L35)

<a id="api-hasprev"></a>

##### hasPrev

```ts
hasPrev: boolean;
```

Defined in: [src/client/index.ts:36](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L36)

<a id="api-limit-1"></a>

##### limit

```ts
limit: number;
```

Defined in: [src/client/index.ts:32](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L32)

<a id="api-links-1"></a>

##### links?

```ts
optional links?: PaginationLinks;
```

Defined in: [src/client/index.ts:37](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L37)

<a id="api-page"></a>

##### page

```ts
page: number;
```

Defined in: [src/client/index.ts:31](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L31)

<a id="api-total"></a>

##### total

```ts
total: number;
```

Defined in: [src/client/index.ts:33](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L33)

<a id="api-totalpages"></a>

##### totalPages

```ts
totalPages: number;
```

Defined in: [src/client/index.ts:34](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L34)

<a id="api-type-1"></a>

##### type?

```ts
optional type?: "offset";
```

Defined in: [src/client/index.ts:30](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L30)

***

<a id="api-ratelimitmeta"></a>

### RateLimitMeta

Defined in: [src/client/index.ts:63](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L63)

#### Properties

<a id="api-limit-2"></a>

##### limit

```ts
limit: number;
```

Defined in: [src/client/index.ts:64](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L64)

<a id="api-remaining"></a>

##### remaining

```ts
remaining: number;
```

Defined in: [src/client/index.ts:65](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L65)

<a id="api-reset"></a>

##### reset

```ts
reset: number;
```

Defined in: [src/client/index.ts:66](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L66)

<a id="api-retryafter"></a>

##### retryAfter?

```ts
optional retryAfter?: number;
```

Defined in: [src/client/index.ts:67](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L67)

***

<a id="api-responsemeta"></a>

### ResponseMeta

Defined in: [src/client/index.ts:70](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L70)

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

<a id="api-apiversion"></a>

##### apiVersion?

```ts
optional apiVersion?: string;
```

Defined in: [src/client/index.ts:78](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L78)

<a id="api-deprecation"></a>

##### deprecation?

```ts
optional deprecation?: DeprecationMeta;
```

Defined in: [src/client/index.ts:76](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L76)

<a id="api-fields"></a>

##### fields?

```ts
optional fields?: string[];
```

Defined in: [src/client/index.ts:79](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L79)

<a id="api-filters"></a>

##### filters?

```ts
optional filters?: Record<string, unknown>;
```

Defined in: [src/client/index.ts:75](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L75)

<a id="api-message-1"></a>

##### message?

```ts
optional message?: string;
```

Defined in: [src/client/index.ts:72](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L72)

<a id="api-pagination"></a>

##### pagination?

```ts
optional pagination?:
  | PaginationMeta
  | CursorPaginationMeta;
```

Defined in: [src/client/index.ts:71](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L71)

<a id="api-ratelimit"></a>

##### rateLimit?

```ts
optional rateLimit?: RateLimitMeta;
```

Defined in: [src/client/index.ts:77](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L77)

<a id="api-responsetime"></a>

##### responseTime?

```ts
optional responseTime?: number;
```

Defined in: [src/client/index.ts:73](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L73)

<a id="api-sort"></a>

##### sort?

```ts
optional sort?: SortInfo;
```

Defined in: [src/client/index.ts:74](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L74)

***

<a id="api-safeerrorresponse"></a>

### SafeErrorResponse

Defined in: [src/client/index.ts:94](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L94)

#### Properties

<a id="api-error"></a>

##### error

```ts
error: {
  code: string;
  details?: unknown;
  message: string;
};
```

Defined in: [src/client/index.ts:98](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L98)

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

<a id="api-meta"></a>

##### meta?

```ts
optional meta?: {
[key: string]: unknown;
  apiVersion?: string;
  deprecation?: DeprecationMeta;
  rateLimit?: RateLimitMeta;
  responseTime?: number;
};
```

Defined in: [src/client/index.ts:103](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L103)

###### Index Signature

```ts
[key: string]: unknown
```

###### apiVersion?

```ts
optional apiVersion?: string;
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

<a id="api-path"></a>

##### path?

```ts
optional path?: string;
```

Defined in: [src/client/index.ts:111](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L111)

<a id="api-requestid"></a>

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/client/index.ts:97](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L97)

<a id="api-statuscode"></a>

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/client/index.ts:96](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L96)

<a id="api-success"></a>

##### success

```ts
success: false;
```

Defined in: [src/client/index.ts:95](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L95)

<a id="api-timestamp"></a>

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/client/index.ts:110](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L110)

***

<a id="api-safeproblemdetailsresponse"></a>

### SafeProblemDetailsResponse

Defined in: [src/client/index.ts:114](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L114)

#### Properties

<a id="api-code"></a>

##### code?

```ts
optional code?: string;
```

Defined in: [src/client/index.ts:120](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L120)

<a id="api-detail"></a>

##### detail

```ts
detail: string;
```

Defined in: [src/client/index.ts:118](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L118)

<a id="api-details"></a>

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/client/index.ts:122](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L122)

<a id="api-instance"></a>

##### instance

```ts
instance: string;
```

Defined in: [src/client/index.ts:119](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L119)

<a id="api-meta-1"></a>

##### meta?

```ts
optional meta?: {
[key: string]: unknown;
  apiVersion?: string;
  deprecation?: DeprecationMeta;
  rateLimit?: RateLimitMeta;
  responseTime?: number;
};
```

Defined in: [src/client/index.ts:123](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L123)

###### Index Signature

```ts
[key: string]: unknown
```

###### apiVersion?

```ts
optional apiVersion?: string;
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

<a id="api-requestid-1"></a>

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/client/index.ts:121](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L121)

<a id="api-status"></a>

##### status

```ts
status: number;
```

Defined in: [src/client/index.ts:117](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L117)

<a id="api-title"></a>

##### title

```ts
title: string;
```

Defined in: [src/client/index.ts:116](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L116)

<a id="api-type-2"></a>

##### type

```ts
type: string;
```

Defined in: [src/client/index.ts:115](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L115)

***

<a id="api-safesuccessresponse"></a>

### SafeSuccessResponse

Defined in: [src/client/index.ts:83](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L83)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

<a id="api-code-1"></a>

##### code?

```ts
optional code?: string;
```

Defined in: [src/client/index.ts:86](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L86)

<a id="api-data"></a>

##### data

```ts
data: T;
```

Defined in: [src/client/index.ts:88](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L88)

<a id="api-meta-2"></a>

##### meta?

```ts
optional meta?: ResponseMeta;
```

Defined in: [src/client/index.ts:89](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L89)

<a id="api-path-1"></a>

##### path?

```ts
optional path?: string;
```

Defined in: [src/client/index.ts:91](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L91)

<a id="api-requestid-2"></a>

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/client/index.ts:87](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L87)

<a id="api-statuscode-1"></a>

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/client/index.ts:85](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L85)

<a id="api-success-1"></a>

##### success

```ts
success: true;
```

Defined in: [src/client/index.ts:84](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L84)

<a id="api-timestamp-1"></a>

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/client/index.ts:90](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L90)

***

<a id="api-sortinfo"></a>

### SortInfo

Defined in: [src/client/index.ts:50](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L50)

#### Properties

<a id="api-field"></a>

##### field

```ts
field: string;
```

Defined in: [src/client/index.ts:51](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L51)

<a id="api-order"></a>

##### order

```ts
order: "asc" | "desc";
```

Defined in: [src/client/index.ts:52](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L52)

## Type Aliases

<a id="api-safeanyresponse"></a>

### SafeAnyResponse

```ts
type SafeAnyResponse<T> =
  | SafeSuccessResponse<T>
  | SafeErrorResponse
  | SafeProblemDetailsResponse;
```

Defined in: [src/client/index.ts:136](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L136)

Broader union including RFC 9457 Problem Details (when `problemDetails` is enabled)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

***

<a id="api-saferesponse"></a>

### SafeResponse

```ts
type SafeResponse<T> =
  | SafeSuccessResponse<T>
  | SafeErrorResponse;
```

Defined in: [src/client/index.ts:133](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L133)

Union type for standard API responses (success or error envelope)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Functions

<a id="api-hasfieldselection"></a>

### hasFieldSelection()

```ts
function hasFieldSelection(meta?): meta is ResponseMeta & { fields: string[] };
```

Defined in: [src/client/index.ts:225](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L225)

Check if response meta contains field selection information

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `meta?` | [`ResponseMeta`](#api-responsemeta) |

#### Returns

`meta is ResponseMeta & { fields: string[] }`

***

<a id="api-hasfilters"></a>

### hasFilters()

```ts
function hasFilters(meta?): meta is ResponseMeta & { filters: Record<string, unknown> };
```

Defined in: [src/client/index.ts:206](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L206)

Check if response meta contains filter information with valid shape

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `meta?` | [`ResponseMeta`](#api-responsemeta) |

#### Returns

`meta is ResponseMeta & { filters: Record<string, unknown> }`

***

<a id="api-hasratelimit"></a>

### hasRateLimit()

```ts
function hasRateLimit(meta?): meta is ResponseMeta & { rateLimit: RateLimitMeta };
```

Defined in: [src/client/index.ts:237](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L237)

Check if response meta contains rate limit information with valid shape

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `meta?` | [`ResponseMeta`](#api-responsemeta) |

#### Returns

`meta is ResponseMeta & { rateLimit: RateLimitMeta }`

***

<a id="api-hasresponsetime"></a>

### hasResponseTime()

```ts
function hasResponseTime(meta?): meta is ResponseMeta & { responseTime: number };
```

Defined in: [src/client/index.ts:187](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L187)

Check if response meta contains a response time measurement

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `meta?` | \| [`ResponseMeta`](#api-responsemeta) \| \{ \[`key`: `string`\]: `unknown`; `responseTime?`: `number`; \} |

#### Returns

`meta is ResponseMeta & { responseTime: number }`

***

<a id="api-hassort"></a>

### hasSort()

```ts
function hasSort(meta?): meta is ResponseMeta & { sort: SortInfo };
```

Defined in: [src/client/index.ts:194](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L194)

Check if response meta contains sort information with valid shape

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `meta?` | [`ResponseMeta`](#api-responsemeta) |

#### Returns

`meta is ResponseMeta & { sort: SortInfo }`

***

<a id="api-iscursorpagination"></a>

### isCursorPagination()

```ts
function isCursorPagination(pagination): pagination is CursorPaginationMeta;
```

Defined in: [src/client/index.ts:165](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L165)

Check if pagination is cursor-based

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pagination` | \| [`PaginationMeta`](#api-paginationmeta) \| [`CursorPaginationMeta`](#api-cursorpaginationmeta) |

#### Returns

`pagination is CursorPaginationMeta`

***

<a id="api-isdeprecated"></a>

### isDeprecated()

```ts
function isDeprecated(meta?): meta is ResponseMeta & { deprecation: DeprecationMeta };
```

Defined in: [src/client/index.ts:218](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L218)

Check if response meta indicates a deprecated endpoint

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `meta?` | [`ResponseMeta`](#api-responsemeta) |

#### Returns

`meta is ResponseMeta & { deprecation: DeprecationMeta }`

***

<a id="api-iserror"></a>

### isError()

```ts
function isError(res): res is SafeErrorResponse;
```

Defined in: [src/client/index.ts:148](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L148)

Check if a response is an error response

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `res` | [`SafeResponse`](#api-saferesponse) |

#### Returns

`res is SafeErrorResponse`

***

<a id="api-isoffsetpagination"></a>

### isOffsetPagination()

```ts
function isOffsetPagination(pagination): pagination is PaginationMeta;
```

Defined in: [src/client/index.ts:158](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L158)

Check if pagination is offset-based

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pagination` | \| [`PaginationMeta`](#api-paginationmeta) \| [`CursorPaginationMeta`](#api-cursorpaginationmeta) |

#### Returns

`pagination is PaginationMeta`

***

<a id="api-ispaginated"></a>

### isPaginated()

```ts
function isPaginated(meta?): meta is ResponseMeta & { pagination: PaginationMeta | CursorPaginationMeta };
```

Defined in: [src/client/index.ts:153](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L153)

Check if response meta contains pagination

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `meta?` | [`ResponseMeta`](#api-responsemeta) |

#### Returns

meta is ResponseMeta & \{ pagination: PaginationMeta \| CursorPaginationMeta \}

***

<a id="api-isproblemdetailsresponse"></a>

### isProblemDetailsResponse()

```ts
function isProblemDetailsResponse(res): res is SafeProblemDetailsResponse;
```

Defined in: [src/client/index.ts:172](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L172)

Check if a response is an RFC 9457 Problem Details response

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `res` | `unknown` |

#### Returns

`res is SafeProblemDetailsResponse`

***

<a id="api-issuccess"></a>

### isSuccess()

```ts
function isSuccess<T>(res): res is SafeSuccessResponse<T>;
```

Defined in: [src/client/index.ts:141](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/client/index.ts#L141)

Check if a response is a successful response

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `res` | [`SafeResponse`](#api-saferesponse)\<`T`\> |

#### Returns

`res is SafeSuccessResponse<T>`
