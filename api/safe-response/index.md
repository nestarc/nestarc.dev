# @nestarc/safe-response

## Classes

<a id="api-cursorpaginationmetadto"></a>

### CursorPaginationMetaDto

Defined in: [src/dto/response.dto.ts:46](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L46)

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new CursorPaginationMetaDto(): CursorPaginationMetaDto;
```

###### Returns

[`CursorPaginationMetaDto`](#api-cursorpaginationmetadto)

#### Properties

<a id="api-hasmore-2"></a>

##### hasMore

```ts
hasMore: boolean;
```

Defined in: [src/dto/response.dto.ts:57](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L57)

<a id="api-limit-2"></a>

##### limit

```ts
limit: number;
```

Defined in: [src/dto/response.dto.ts:60](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L60)

<a id="api-links-2"></a>

##### links?

```ts
optional links?: PaginationLinksDto;
```

Defined in: [src/dto/response.dto.ts:66](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L66)

<a id="api-nextcursor-2"></a>

##### nextCursor

```ts
nextCursor: string | null;
```

Defined in: [src/dto/response.dto.ts:51](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L51)

<a id="api-previouscursor-2"></a>

##### previousCursor

```ts
previousCursor: string | null;
```

Defined in: [src/dto/response.dto.ts:54](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L54)

<a id="api-totalcount-2"></a>

##### totalCount?

```ts
optional totalCount?: number;
```

Defined in: [src/dto/response.dto.ts:63](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L63)

<a id="api-type-1"></a>

##### type

```ts
type: "cursor";
```

Defined in: [src/dto/response.dto.ts:48](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L48)

***

<a id="api-deprecationmetadto"></a>

### DeprecationMetaDto

Defined in: [src/dto/response.dto.ts:87](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L87)

#### Constructors

<a id="api-constructor-1"></a>

##### Constructor

```ts
new DeprecationMetaDto(): DeprecationMetaDto;
```

###### Returns

[`DeprecationMetaDto`](#api-deprecationmetadto)

#### Properties

<a id="api-deprecated-4"></a>

##### deprecated

```ts
deprecated: true;
```

Defined in: [src/dto/response.dto.ts:89](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L89)

<a id="api-link-2"></a>

##### link?

```ts
optional link?: string;
```

Defined in: [src/dto/response.dto.ts:101](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L101)

<a id="api-message-3"></a>

##### message?

```ts
optional message?: string;
```

Defined in: [src/dto/response.dto.ts:98](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L98)

<a id="api-since-2"></a>

##### since?

```ts
optional since?: string;
```

Defined in: [src/dto/response.dto.ts:92](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L92)

<a id="api-sunset-2"></a>

##### sunset?

```ts
optional sunset?: string;
```

Defined in: [src/dto/response.dto.ts:95](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L95)

***

<a id="api-errordetaildto"></a>

### ErrorDetailDto

Defined in: [src/dto/response.dto.ts:179](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L179)

#### Constructors

<a id="api-constructor-2"></a>

##### Constructor

```ts
new ErrorDetailDto(): ErrorDetailDto;
```

###### Returns

[`ErrorDetailDto`](#api-errordetaildto)

#### Properties

<a id="api-code-1"></a>

##### code

```ts
code: string;
```

Defined in: [src/dto/response.dto.ts:181](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L181)

<a id="api-details-2"></a>

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/dto/response.dto.ts:189](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L189)

<a id="api-message-5"></a>

##### message

```ts
message: string;
```

Defined in: [src/dto/response.dto.ts:184](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L184)

***

<a id="api-errorresponsemetadto"></a>

### ErrorResponseMetaDto

Defined in: [src/dto/response.dto.ts:192](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L192)

#### Indexable

```ts
[key: string]: unknown
```

Additional context fields (e.g., traceId, correlationId) injected via CLS

#### Constructors

<a id="api-constructor-3"></a>

##### Constructor

```ts
new ErrorResponseMetaDto(): ErrorResponseMetaDto;
```

###### Returns

[`ErrorResponseMetaDto`](#api-errorresponsemetadto)

#### Properties

<a id="api-apiversion"></a>

##### apiVersion?

```ts
optional apiVersion?: string;
```

Defined in: [src/dto/response.dto.ts:203](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L203)

<a id="api-deprecation"></a>

##### deprecation?

```ts
optional deprecation?: DeprecationMetaDto;
```

Defined in: [src/dto/response.dto.ts:197](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L197)

<a id="api-ratelimit"></a>

##### rateLimit?

```ts
optional rateLimit?: RateLimitMetaDto;
```

Defined in: [src/dto/response.dto.ts:200](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L200)

<a id="api-responsetime"></a>

##### responseTime?

```ts
optional responseTime?: number;
```

Defined in: [src/dto/response.dto.ts:194](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L194)

***

<a id="api-filtermetadto"></a>

### FilterMetaDto

Defined in: [src/dto/response.dto.ts:77](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L77)

#### Constructors

<a id="api-constructor-4"></a>

##### Constructor

```ts
new FilterMetaDto(): FilterMetaDto;
```

###### Returns

[`FilterMetaDto`](#api-filtermetadto)

#### Properties

<a id="api-filters"></a>

##### filters

```ts
filters: Record<string, unknown>;
```

Defined in: [src/dto/response.dto.ts:84](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L84)

***

<a id="api-nesti18nadapter"></a>

### NestI18nAdapter

Defined in: [src/adapters/i18n.adapter.ts:25](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/adapters/i18n.adapter.ts#L25)

Built-in adapter for nestjs-i18n.
Wraps I18nService from the nestjs-i18n package.

#### Implements

- [`I18nAdapter`](#api-i18nadapter)

#### Constructors

<a id="api-constructor-5"></a>

##### Constructor

```ts
new NestI18nAdapter(i18nService): NestI18nAdapter;
```

Defined in: [src/adapters/i18n.adapter.ts:26](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/adapters/i18n.adapter.ts#L26)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `i18nService` | [`I18nServiceLike`](#api-i18nservicelike) |

###### Returns

[`NestI18nAdapter`](#api-nesti18nadapter)

#### Methods

<a id="api-resolvelanguage-1"></a>

##### resolveLanguage()

```ts
resolveLanguage(request): string;
```

Defined in: [src/adapters/i18n.adapter.ts:41](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/adapters/i18n.adapter.ts#L41)

Resolve the preferred language from the request

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | `unknown` |

###### Returns

`string`

###### Implementation of

[`I18nAdapter`](#api-i18nadapter).[`resolveLanguage`](#api-resolvelanguage)

<a id="api-translate-2"></a>

##### translate()

```ts
translate(key, options?): string;
```

Defined in: [src/adapters/i18n.adapter.ts:28](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/adapters/i18n.adapter.ts#L28)

Translate a message key to the target language

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `options?` | \{ `args?`: `Record`\<`string`, `unknown`\>; `lang?`: `string`; \} |
| `options.args?` | `Record`\<`string`, `unknown`\> |
| `options.lang?` | `string` |

###### Returns

`string`

###### Implementation of

[`I18nAdapter`](#api-i18nadapter).[`translate`](#api-translate)

***

<a id="api-paginationlinksdto"></a>

### PaginationLinksDto

Defined in: [src/dto/response.dto.ts:3](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L3)

#### Constructors

<a id="api-constructor-6"></a>

##### Constructor

```ts
new PaginationLinksDto(): PaginationLinksDto;
```

###### Returns

[`PaginationLinksDto`](#api-paginationlinksdto)

#### Properties

<a id="api-first-1"></a>

##### first

```ts
first: string;
```

Defined in: [src/dto/response.dto.ts:8](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L8)

<a id="api-last-1"></a>

##### last

```ts
last: string | null;
```

Defined in: [src/dto/response.dto.ts:17](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L17)

<a id="api-next-1"></a>

##### next

```ts
next: string | null;
```

Defined in: [src/dto/response.dto.ts:14](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L14)

<a id="api-prev-1"></a>

##### prev

```ts
prev: string | null;
```

Defined in: [src/dto/response.dto.ts:11](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L11)

<a id="api-self-1"></a>

##### self

```ts
self: string;
```

Defined in: [src/dto/response.dto.ts:5](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L5)

***

<a id="api-paginationmetadto"></a>

### PaginationMetaDto

Defined in: [src/dto/response.dto.ts:20](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L20)

#### Constructors

<a id="api-constructor-7"></a>

##### Constructor

```ts
new PaginationMetaDto(): PaginationMetaDto;
```

###### Returns

[`PaginationMetaDto`](#api-paginationmetadto)

#### Properties

<a id="api-hasnext-1"></a>

##### hasNext

```ts
hasNext: boolean;
```

Defined in: [src/dto/response.dto.ts:37](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L37)

<a id="api-hasprev-1"></a>

##### hasPrev

```ts
hasPrev: boolean;
```

Defined in: [src/dto/response.dto.ts:40](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L40)

<a id="api-limit-5"></a>

##### limit

```ts
limit: number;
```

Defined in: [src/dto/response.dto.ts:28](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L28)

<a id="api-links-5"></a>

##### links?

```ts
optional links?: PaginationLinksDto;
```

Defined in: [src/dto/response.dto.ts:43](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L43)

<a id="api-page-2"></a>

##### page

```ts
page: number;
```

Defined in: [src/dto/response.dto.ts:25](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L25)

<a id="api-total-2"></a>

##### total

```ts
total: number;
```

Defined in: [src/dto/response.dto.ts:31](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L31)

<a id="api-totalpages-1"></a>

##### totalPages

```ts
totalPages: number;
```

Defined in: [src/dto/response.dto.ts:34](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L34)

<a id="api-type-3"></a>

##### type?

```ts
optional type?: "offset";
```

Defined in: [src/dto/response.dto.ts:22](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L22)

***

<a id="api-problemdetailsdto"></a>

### ProblemDetailsDto

Defined in: [src/dto/response.dto.ts:232](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L232)

#### Constructors

<a id="api-constructor-8"></a>

##### Constructor

```ts
new ProblemDetailsDto(): ProblemDetailsDto;
```

###### Returns

[`ProblemDetailsDto`](#api-problemdetailsdto)

#### Properties

<a id="api-code-2"></a>

##### code?

```ts
optional code?: string;
```

Defined in: [src/dto/response.dto.ts:249](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L249)

<a id="api-detail"></a>

##### detail

```ts
detail: string;
```

Defined in: [src/dto/response.dto.ts:243](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L243)

<a id="api-details-3"></a>

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/dto/response.dto.ts:255](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L255)

<a id="api-instance"></a>

##### instance

```ts
instance: string;
```

Defined in: [src/dto/response.dto.ts:246](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L246)

<a id="api-meta"></a>

##### meta?

```ts
optional meta?: ErrorResponseMetaDto;
```

Defined in: [src/dto/response.dto.ts:258](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L258)

<a id="api-requestid"></a>

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/dto/response.dto.ts:252](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L252)

<a id="api-status-1"></a>

##### status

```ts
status: number;
```

Defined in: [src/dto/response.dto.ts:240](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L240)

<a id="api-title"></a>

##### title

```ts
title: string;
```

Defined in: [src/dto/response.dto.ts:237](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L237)

<a id="api-type-4"></a>

##### type

```ts
type: string;
```

Defined in: [src/dto/response.dto.ts:234](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L234)

***

<a id="api-ratelimitmetadto"></a>

### RateLimitMetaDto

Defined in: [src/dto/response.dto.ts:104](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L104)

#### Constructors

<a id="api-constructor-9"></a>

##### Constructor

```ts
new RateLimitMetaDto(): RateLimitMetaDto;
```

###### Returns

[`RateLimitMetaDto`](#api-ratelimitmetadto)

#### Properties

<a id="api-limit-7"></a>

##### limit

```ts
limit: number;
```

Defined in: [src/dto/response.dto.ts:106](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L106)

<a id="api-remaining-1"></a>

##### remaining

```ts
remaining: number;
```

Defined in: [src/dto/response.dto.ts:109](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L109)

<a id="api-reset-1"></a>

##### reset

```ts
reset: number;
```

Defined in: [src/dto/response.dto.ts:112](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L112)

<a id="api-retryafter-1"></a>

##### retryAfter?

```ts
optional retryAfter?: number;
```

Defined in: [src/dto/response.dto.ts:115](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L115)

***

<a id="api-responsemetadto"></a>

### ResponseMetaDto

Defined in: [src/dto/response.dto.ts:119](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L119)

#### Constructors

<a id="api-constructor-10"></a>

##### Constructor

```ts
new ResponseMetaDto(): ResponseMetaDto;
```

###### Returns

[`ResponseMetaDto`](#api-responsemetadto)

#### Properties

<a id="api-apiversion-2"></a>

##### apiVersion?

```ts
optional apiVersion?: string;
```

Defined in: [src/dto/response.dto.ts:147](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L147)

<a id="api-deprecation-2"></a>

##### deprecation?

```ts
optional deprecation?: DeprecationMetaDto;
```

Defined in: [src/dto/response.dto.ts:141](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L141)

<a id="api-fields-2"></a>

##### fields?

```ts
optional fields?: string[];
```

Defined in: [src/dto/response.dto.ts:150](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L150)

<a id="api-filters-2"></a>

##### filters?

```ts
optional filters?: Record<string, unknown>;
```

Defined in: [src/dto/response.dto.ts:138](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L138)

<a id="api-message-7"></a>

##### message?

```ts
optional message?: string;
```

Defined in: [src/dto/response.dto.ts:129](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L129)

<a id="api-pagination-1"></a>

##### pagination?

```ts
optional pagination?:
  | PaginationMetaDto
  | CursorPaginationMetaDto;
```

Defined in: [src/dto/response.dto.ts:126](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L126)

<a id="api-ratelimit-2"></a>

##### rateLimit?

```ts
optional rateLimit?: RateLimitMetaDto;
```

Defined in: [src/dto/response.dto.ts:144](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L144)

<a id="api-responsetime-2"></a>

##### responseTime?

```ts
optional responseTime?: number;
```

Defined in: [src/dto/response.dto.ts:132](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L132)

<a id="api-sort-1"></a>

##### sort?

```ts
optional sort?: SortMetaDto;
```

Defined in: [src/dto/response.dto.ts:135](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L135)

***

<a id="api-safeerrorresponsedto"></a>

### SafeErrorResponseDto

Defined in: [src/dto/response.dto.ts:209](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L209)

#### Constructors

<a id="api-constructor-11"></a>

##### Constructor

```ts
new SafeErrorResponseDto(): SafeErrorResponseDto;
```

###### Returns

[`SafeErrorResponseDto`](#api-safeerrorresponsedto)

#### Properties

<a id="api-error-1"></a>

##### error

```ts
error: ErrorDetailDto;
```

Defined in: [src/dto/response.dto.ts:220](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L220)

<a id="api-meta-2"></a>

##### meta?

```ts
optional meta?: ErrorResponseMetaDto;
```

Defined in: [src/dto/response.dto.ts:223](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L223)

<a id="api-path-1"></a>

##### path?

```ts
optional path?: string;
```

Defined in: [src/dto/response.dto.ts:229](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L229)

<a id="api-requestid-2"></a>

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/dto/response.dto.ts:217](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L217)

<a id="api-statuscode-3"></a>

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/dto/response.dto.ts:214](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L214)

<a id="api-success-1"></a>

##### success

```ts
success: false;
```

Defined in: [src/dto/response.dto.ts:211](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L211)

<a id="api-timestamp-1"></a>

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/dto/response.dto.ts:226](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L226)

***

<a id="api-safeexception"></a>

### SafeException

Defined in: [src/errors/index.ts:53](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/errors/index.ts#L53)

Custom exception that resolves status/message from the error catalog.

When thrown, the SafeExceptionFilter looks up the `errorKey` in the registered
`errorCatalog` to resolve the HTTP status, message, and details. The key itself
becomes the error `code` in the response.

Falls back to 500 Internal Server Error if no catalog is registered or the key
is not found.

#### Example

```typescript
throw new SafeException('USER_NOT_FOUND');
throw new SafeException('VALIDATION_ERROR', { message: 'Custom message', details: [...] });
```

#### Extends

- `HttpException`

#### Constructors

<a id="api-constructor-12"></a>

##### Constructor

```ts
new SafeException(key, options?): SafeException;
```

Defined in: [src/errors/index.ts:58](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/errors/index.ts#L58)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `options?` | \{ `details?`: `unknown`; `message?`: `string`; \} |
| `options.details?` | `unknown` |
| `options.message?` | `string` |

###### Returns

[`SafeException`](#api-safeexception)

###### Overrides

```ts
HttpException.constructor
```

#### Properties

<a id="api-cause"></a>

##### cause

```ts
cause: unknown;
```

Defined in: node\_modules/@nestjs/common/exceptions/http.exception.d.ts:28

Exception cause. Indicates the specific original cause of the error.
It is used when catching and re-throwing an error with a more-specific or useful error message in order to still have access to the original error.

###### Inherited from

```ts
HttpException.cause
```

<a id="api-errorkey"></a>

##### errorKey

```ts
readonly errorKey: string;
```

Defined in: [src/errors/index.ts:54](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/errors/index.ts#L54)

<a id="api-message-10"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

```ts
HttpException.message
```

<a id="api-name"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

```ts
HttpException.name
```

<a id="api-overridedetails"></a>

##### overrideDetails?

```ts
readonly optional overrideDetails?: unknown;
```

Defined in: [src/errors/index.ts:56](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/errors/index.ts#L56)

<a id="api-overridemessage"></a>

##### overrideMessage?

```ts
readonly optional overrideMessage?: string;
```

Defined in: [src/errors/index.ts:55](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/errors/index.ts#L55)

<a id="api-stack"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

```ts
HttpException.stack
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
HttpException.stackTraceLimit
```

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
HttpException.captureStackTrace
```

<a id="api-createbody"></a>

##### createBody()

###### Call Signature

```ts
static createBody(
   nil,
   message,
   statusCode): HttpExceptionBody;
```

Defined in: node\_modules/@nestjs/common/exceptions/http.exception.d.ts:74

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `nil` | `""` \| `null` |
| `message` | `HttpExceptionBodyMessage` |
| `statusCode` | `number` |

###### Returns

`HttpExceptionBody`

###### Inherited from

```ts
HttpException.createBody
```

###### Call Signature

```ts
static createBody(
   message,
   error,
   statusCode): HttpExceptionBody;
```

Defined in: node\_modules/@nestjs/common/exceptions/http.exception.d.ts:75

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `HttpExceptionBodyMessage` |
| `error` | `string` |
| `statusCode` | `number` |

###### Returns

`HttpExceptionBody`

###### Inherited from

```ts
HttpException.createBody
```

###### Call Signature

```ts
static createBody<Body>(custom): Body;
```

Defined in: node\_modules/@nestjs/common/exceptions/http.exception.d.ts:76

###### Type Parameters

| Type Parameter |
| ------ |
| `Body` *extends* `Record`\<`string`, `unknown`\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `custom` | `Body` |

###### Returns

`Body`

###### Inherited from

```ts
HttpException.createBody
```

<a id="api-extractdescriptionandoptionsfrom"></a>

##### extractDescriptionAndOptionsFrom()

```ts
static extractDescriptionAndOptionsFrom(descriptionOrOptions): DescriptionAndOptions;
```

Defined in: node\_modules/@nestjs/common/exceptions/http.exception.d.ts:84

Utility method used to extract the error description and httpExceptionOptions from the given argument.
This is used by inheriting classes to correctly parse both options.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `descriptionOrOptions` | `string` \| `HttpExceptionOptions` |

###### Returns

`DescriptionAndOptions`

the error description and the httpExceptionOptions as an object.

###### Inherited from

```ts
HttpException.extractDescriptionAndOptionsFrom
```

<a id="api-getdescriptionfrom"></a>

##### getDescriptionFrom()

```ts
static getDescriptionFrom(descriptionOrOptions): string;
```

Defined in: node\_modules/@nestjs/common/exceptions/http.exception.d.ts:77

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `descriptionOrOptions` | `string` \| `HttpExceptionOptions` |

###### Returns

`string`

###### Inherited from

```ts
HttpException.getDescriptionFrom
```

<a id="api-gethttpexceptionoptionsfrom"></a>

##### getHttpExceptionOptionsFrom()

```ts
static getHttpExceptionOptionsFrom(descriptionOrOptions): HttpExceptionOptions;
```

Defined in: node\_modules/@nestjs/common/exceptions/http.exception.d.ts:78

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `descriptionOrOptions` | `string` \| `HttpExceptionOptions` |

###### Returns

`HttpExceptionOptions`

###### Inherited from

```ts
HttpException.getHttpExceptionOptionsFrom
```

<a id="api-getresponse"></a>

##### getResponse()

```ts
getResponse(): string | object;
```

Defined in: node\_modules/@nestjs/common/exceptions/http.exception.d.ts:72

###### Returns

`string` \| `object`

###### Inherited from

```ts
HttpException.getResponse
```

<a id="api-getstatus"></a>

##### getStatus()

```ts
getStatus(): number;
```

Defined in: node\_modules/@nestjs/common/exceptions/http.exception.d.ts:73

###### Returns

`number`

###### Inherited from

```ts
HttpException.getStatus
```

<a id="api-initcause"></a>

##### initCause()

```ts
initCause(): void;
```

Defined in: node\_modules/@nestjs/common/exceptions/http.exception.d.ts:69

Configures error chaining support

###### Returns

`void`

###### See

 - https://nodejs.org/en/blog/release/v16.9.0/#error-cause
 - https://github.com/microsoft/TypeScript/issues/45167

###### Inherited from

```ts
HttpException.initCause
```

<a id="api-initmessage"></a>

##### initMessage()

```ts
initMessage(): void;
```

Defined in: node\_modules/@nestjs/common/exceptions/http.exception.d.ts:70

###### Returns

`void`

###### Inherited from

```ts
HttpException.initMessage
```

<a id="api-initname"></a>

##### initName()

```ts
initName(): void;
```

Defined in: node\_modules/@nestjs/common/exceptions/http.exception.d.ts:71

###### Returns

`void`

###### Inherited from

```ts
HttpException.initName
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
HttpException.prepareStackTrace
```

***

<a id="api-safeexceptionfilter"></a>

### SafeExceptionFilter

Defined in: [src/filters/safe-exception.filter.ts:65](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/filters/safe-exception.filter.ts#L65)

Global exception filter that wraps errors in the SafeErrorResponse or
RFC 9457 Problem Details envelope.

### Known Limitation — Guard-phase exceptions

NestJS lifecycle: Middleware → Guards → **Interceptors** → Pipes → Handler.
Metadata set by the interceptor (`@Deprecated()`, `@ProblemType()`, `responseTime`)
is stored on the request object. When a guard throws before the interceptor runs,
these values are unavailable to this filter:

- `meta.responseTime` — start time was never captured
- `meta.deprecation` / Deprecation headers — `@Deprecated()` options not forwarded
- Problem Details `type` URI — `@ProblemType()` value not forwarded (falls back to
  `config.baseUrl`-derived URI or `about:blank`)

This is an architectural constraint of NestJS's `ArgumentsHost`, which does not
expose `getHandler()` for reflector-based metadata reads.

#### Implements

- `ExceptionFilter`

#### Constructors

<a id="api-constructor-13"></a>

##### Constructor

```ts
new SafeExceptionFilter(
   httpAdapterHost,
   options?,
   moduleRef?): SafeExceptionFilter;
```

Defined in: [src/filters/safe-exception.filter.ts:70](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/filters/safe-exception.filter.ts#L70)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `httpAdapterHost` | `HttpAdapterHost` |
| `options` | [`SafeResponseModuleOptions`](#api-saferesponsemoduleoptions) |
| `moduleRef?` | `ModuleRef` |

###### Returns

[`SafeExceptionFilter`](#api-safeexceptionfilter)

#### Methods

<a id="api-catch"></a>

##### catch()

```ts
catch(exception, host): void;
```

Defined in: [src/filters/safe-exception.filter.ts:94](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/filters/safe-exception.filter.ts#L94)

Method to implement a custom exception filter.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `exception` | `unknown` | the class of the exception being handled |
| `host` | `ArgumentsHost` | used to access an array of arguments for the in-flight request |

###### Returns

`void`

###### Implementation of

```ts
ExceptionFilter.catch
```

***

<a id="api-saferesponseinterceptor"></a>

### SafeResponseInterceptor

Defined in: [src/interceptors/safe-response.interceptor.ts:65](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interceptors/safe-response.interceptor.ts#L65)

#### Implements

- `NestInterceptor`

#### Constructors

<a id="api-constructor-14"></a>

##### Constructor

```ts
new SafeResponseInterceptor(
   reflector,
   options?,
   moduleRef?): SafeResponseInterceptor;
```

Defined in: [src/interceptors/safe-response.interceptor.ts:70](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interceptors/safe-response.interceptor.ts#L70)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `reflector` | `Reflector` |
| `options` | [`SafeResponseModuleOptions`](#api-saferesponsemoduleoptions) |
| `moduleRef?` | `ModuleRef` |

###### Returns

[`SafeResponseInterceptor`](#api-saferesponseinterceptor)

#### Methods

<a id="api-intercept"></a>

##### intercept()

```ts
intercept(context, next): Observable<any>;
```

Defined in: [src/interceptors/safe-response.interceptor.ts:85](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interceptors/safe-response.interceptor.ts#L85)

Method to implement a custom interceptor.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `ExecutionContext` | an `ExecutionContext` object providing methods to access the route handler and class about to be invoked. |
| `next` | `CallHandler` | a reference to the `CallHandler`, which provides access to an `Observable` representing the response stream from the route handler. |

###### Returns

`Observable`\<`any`\>

###### Implementation of

```ts
NestInterceptor.intercept
```

***

<a id="api-saferesponsemodule"></a>

### SafeResponseModule

Defined in: [src/safe-response.module.ts:12](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/safe-response.module.ts#L12)

#### Implements

- `OnModuleInit`

#### Constructors

<a id="api-constructor-15"></a>

##### Constructor

```ts
new SafeResponseModule(): SafeResponseModule;
```

###### Returns

[`SafeResponseModule`](#api-saferesponsemodule)

#### Methods

<a id="api-onmoduleinit"></a>

##### onModuleInit()

```ts
onModuleInit(): void;
```

Defined in: [src/safe-response.module.ts:16](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/safe-response.module.ts#L16)

###### Returns

`void`

###### Implementation of

```ts
OnModuleInit.onModuleInit
```

<a id="api-register"></a>

##### register()

```ts
static register(options?): DynamicModule;
```

Defined in: [src/safe-response.module.ts:27](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/safe-response.module.ts#L27)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`SafeResponseModuleOptions`](#api-saferesponsemoduleoptions) |

###### Returns

`DynamicModule`

<a id="api-registerasync"></a>

##### registerAsync()

```ts
static registerAsync(options): DynamicModule;
```

Defined in: [src/safe-response.module.ts:48](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/safe-response.module.ts#L48)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`SafeResponseModuleAsyncOptions`](#api-saferesponsemoduleasyncoptions) |

###### Returns

`DynamicModule`

***

<a id="api-safesuccessresponsedto"></a>

### SafeSuccessResponseDto

Defined in: [src/dto/response.dto.ts:153](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L153)

#### Constructors

<a id="api-constructor-16"></a>

##### Constructor

```ts
new SafeSuccessResponseDto(): SafeSuccessResponseDto;
```

###### Returns

[`SafeSuccessResponseDto`](#api-safesuccessresponsedto)

#### Properties

<a id="api-code-8"></a>

##### code?

```ts
optional code?: string;
```

Defined in: [src/dto/response.dto.ts:161](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L161)

<a id="api-data-3"></a>

##### data

```ts
data: unknown;
```

Defined in: [src/dto/response.dto.ts:167](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L167)

<a id="api-meta-5"></a>

##### meta?

```ts
optional meta?: ResponseMetaDto;
```

Defined in: [src/dto/response.dto.ts:170](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L170)

<a id="api-path-4"></a>

##### path?

```ts
optional path?: string;
```

Defined in: [src/dto/response.dto.ts:176](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L176)

<a id="api-requestid-6"></a>

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/dto/response.dto.ts:164](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L164)

<a id="api-statuscode-5"></a>

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/dto/response.dto.ts:158](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L158)

<a id="api-success-3"></a>

##### success

```ts
success: true;
```

Defined in: [src/dto/response.dto.ts:155](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L155)

<a id="api-timestamp-4"></a>

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/dto/response.dto.ts:173](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L173)

***

<a id="api-sortmetadto"></a>

### SortMetaDto

Defined in: [src/dto/response.dto.ts:69](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L69)

#### Constructors

<a id="api-constructor-17"></a>

##### Constructor

```ts
new SortMetaDto(): SortMetaDto;
```

###### Returns

[`SortMetaDto`](#api-sortmetadto)

#### Properties

<a id="api-field-1"></a>

##### field

```ts
field: string;
```

Defined in: [src/dto/response.dto.ts:71](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L71)

<a id="api-order-1"></a>

##### order

```ts
order: "asc" | "desc";
```

Defined in: [src/dto/response.dto.ts:74](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/dto/response.dto.ts#L74)

## Interfaces

<a id="api-apisafeerrorresponseoptions"></a>

### ApiSafeErrorResponseOptions

Defined in: [src/interfaces/index.ts:247](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L247)

#### Properties

<a id="api-code"></a>

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:251](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L251)

Override the auto-resolved error code from DEFAULT_ERROR_CODE_MAP

<a id="api-description"></a>

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/index.ts:249](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L249)

Description shown in Swagger UI

<a id="api-details"></a>

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/interfaces/index.ts:255](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L255)

Example details value (type is inferred: array → array schema, object → object schema)

<a id="api-message"></a>

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:253](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L253)

Example error message

***

<a id="api-contextoptions"></a>

### ContextOptions

Defined in: [src/interfaces/index.ts:10](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L10)

#### Properties

<a id="api-fields"></a>

##### fields?

```ts
optional fields?: Record<string, string>;
```

Defined in: [src/interfaces/index.ts:12](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L12)

Map CLS store keys to response meta fields. Key = meta field name, Value = CLS store key.

<a id="api-resolver"></a>

##### resolver?

```ts
optional resolver?: (store) => Record<string, unknown>;
```

Defined in: [src/interfaces/index.ts:14](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L14)

Custom resolver function. Receives the CLS service instance and returns fields to inject.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `store` | `unknown` |

###### Returns

`Record`\<`string`, `unknown`\>

***

<a id="api-cursorpaginatedoptions"></a>

### CursorPaginatedOptions

Defined in: [src/interfaces/index.ts:232](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L232)

#### Properties

<a id="api-links"></a>

##### links?

```ts
optional links?: boolean;
```

Defined in: [src/interfaces/index.ts:235](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L235)

Generate HATEOAS navigation links in pagination meta. Default: false

<a id="api-maxlimit"></a>

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [src/interfaces/index.ts:233](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L233)

***

<a id="api-cursorpaginatedresult"></a>

### CursorPaginatedResult

Defined in: [src/interfaces/index.ts:238](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L238)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

<a id="api-data"></a>

##### data

```ts
data: T[];
```

Defined in: [src/interfaces/index.ts:239](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L239)

<a id="api-hasmore"></a>

##### hasMore

```ts
hasMore: boolean;
```

Defined in: [src/interfaces/index.ts:242](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L242)

<a id="api-limit"></a>

##### limit

```ts
limit: number;
```

Defined in: [src/interfaces/index.ts:243](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L243)

<a id="api-nextcursor"></a>

##### nextCursor

```ts
nextCursor: string | null;
```

Defined in: [src/interfaces/index.ts:240](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L240)

<a id="api-previouscursor"></a>

##### previousCursor?

```ts
optional previousCursor?: string | null;
```

Defined in: [src/interfaces/index.ts:241](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L241)

<a id="api-totalcount"></a>

##### totalCount?

```ts
optional totalCount?: number;
```

Defined in: [src/interfaces/index.ts:244](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L244)

***

<a id="api-cursorpaginationmeta"></a>

### CursorPaginationMeta

Defined in: [src/interfaces/index.ts:150](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L150)

#### Properties

<a id="api-hasmore-1"></a>

##### hasMore

```ts
hasMore: boolean;
```

Defined in: [src/interfaces/index.ts:154](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L154)

<a id="api-limit-1"></a>

##### limit

```ts
limit: number;
```

Defined in: [src/interfaces/index.ts:155](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L155)

<a id="api-links-1"></a>

##### links?

```ts
optional links?: PaginationLinks;
```

Defined in: [src/interfaces/index.ts:157](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L157)

<a id="api-nextcursor-1"></a>

##### nextCursor

```ts
nextCursor: string | null;
```

Defined in: [src/interfaces/index.ts:152](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L152)

<a id="api-previouscursor-1"></a>

##### previousCursor

```ts
previousCursor: string | null;
```

Defined in: [src/interfaces/index.ts:153](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L153)

<a id="api-totalcount-1"></a>

##### totalCount?

```ts
optional totalCount?: number;
```

Defined in: [src/interfaces/index.ts:156](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L156)

<a id="api-type"></a>

##### type

```ts
type: "cursor";
```

Defined in: [src/interfaces/index.ts:151](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L151)

***

<a id="api-deprecatedoptions"></a>

### DeprecatedOptions

Defined in: [src/interfaces/index.ts:19](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L19)

#### Properties

<a id="api-link"></a>

##### link?

```ts
optional link?: string;
```

Defined in: [src/interfaces/index.ts:27](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L27)

URL of the successor endpoint or migration guide

<a id="api-message-1"></a>

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:25](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L25)

Human-readable deprecation message for API consumers

<a id="api-since"></a>

##### since?

```ts
optional since?: string | Date;
```

Defined in: [src/interfaces/index.ts:21](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L21)

Date when the endpoint was deprecated (ISO string or Date object)

<a id="api-sunset"></a>

##### sunset?

```ts
optional sunset?: string | Date;
```

Defined in: [src/interfaces/index.ts:23](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L23)

Date when the endpoint will be removed (ISO string or Date object)

***

<a id="api-deprecationmeta"></a>

### DeprecationMeta

Defined in: [src/interfaces/index.ts:30](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L30)

#### Properties

<a id="api-deprecated-3"></a>

##### deprecated

```ts
deprecated: true;
```

Defined in: [src/interfaces/index.ts:31](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L31)

<a id="api-link-1"></a>

##### link?

```ts
optional link?: string;
```

Defined in: [src/interfaces/index.ts:35](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L35)

<a id="api-message-2"></a>

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:34](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L34)

<a id="api-since-1"></a>

##### since?

```ts
optional since?: string;
```

Defined in: [src/interfaces/index.ts:32](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L32)

<a id="api-sunset-1"></a>

##### sunset?

```ts
optional sunset?: string;
```

Defined in: [src/interfaces/index.ts:33](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L33)

***

<a id="api-errorcodemappercontext"></a>

### ErrorCodeMapperContext

Defined in: [src/interfaces/index.ts:50](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L50)

#### Properties

<a id="api-defaultcode"></a>

##### defaultCode

```ts
defaultCode: string;
```

Defined in: [src/interfaces/index.ts:54](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L54)

Default code from errorCodes option or DEFAULT_ERROR_CODE_MAP

<a id="api-statuscode"></a>

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/interfaces/index.ts:52](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L52)

Resolved HTTP status code

***

<a id="api-errordefinition"></a>

### ErrorDefinition

Defined in: [src/errors/index.ts:5](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/errors/index.ts#L5)

#### Properties

<a id="api-description-1"></a>

##### description?

```ts
optional description?: string;
```

Defined in: [src/errors/index.ts:11](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/errors/index.ts#L11)

Swagger description (used in @ApiSafeErrorResponse)

<a id="api-details-1"></a>

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/errors/index.ts:13](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/errors/index.ts#L13)

Default error details

<a id="api-message-4"></a>

##### message

```ts
message: string;
```

Defined in: [src/errors/index.ts:9](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/errors/index.ts#L9)

Default error message

<a id="api-status"></a>

##### status

```ts
status: number;
```

Defined in: [src/errors/index.ts:7](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/errors/index.ts#L7)

HTTP status code for this error

***

<a id="api-fieldselectionoptions"></a>

### FieldSelectionOptions

Defined in: [src/shared/field-selection.ts:8](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/shared/field-selection.ts#L8)

Partial response (field selection) utilities.

Enables Google-style `?fields=id,name,address.city` query parameter
for selecting specific fields from the response data.

#### Properties

<a id="api-maxdepth"></a>

##### maxDepth?

```ts
optional maxDepth?: number;
```

Defined in: [src/shared/field-selection.ts:14](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/shared/field-selection.ts#L14)

Maximum nesting depth for dot-notation fields (default: 3)

<a id="api-maxfieldlength"></a>

##### maxFieldLength?

```ts
optional maxFieldLength?: number;
```

Defined in: [src/shared/field-selection.ts:18](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/shared/field-selection.ts#L18)

Maximum length of each requested field path

<a id="api-maxfields"></a>

##### maxFields?

```ts
optional maxFields?: number;
```

Defined in: [src/shared/field-selection.ts:16](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/shared/field-selection.ts#L16)

Maximum number of requested field paths to honor

<a id="api-queryparam"></a>

##### queryParam?

```ts
optional queryParam?: string;
```

Defined in: [src/shared/field-selection.ts:10](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/shared/field-selection.ts#L10)

Query parameter name (default: 'fields')

<a id="api-separator"></a>

##### separator?

```ts
optional separator?: string;
```

Defined in: [src/shared/field-selection.ts:12](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/shared/field-selection.ts#L12)

Field separator (default: ',')

***

<a id="api-i18nadapter"></a>

### I18nAdapter

Defined in: [src/adapters/i18n.adapter.ts:5](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/adapters/i18n.adapter.ts#L5)

Interface for i18n adapters.
Implementations bridge the gap between @nestarc/safe-response and i18n libraries.

#### Methods

<a id="api-resolvelanguage"></a>

##### resolveLanguage()

```ts
resolveLanguage(request): string;
```

Defined in: [src/adapters/i18n.adapter.ts:9](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/adapters/i18n.adapter.ts#L9)

Resolve the preferred language from the request

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | `unknown` |

###### Returns

`string`

<a id="api-translate"></a>

##### translate()

```ts
translate(key, options?): string;
```

Defined in: [src/adapters/i18n.adapter.ts:7](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/adapters/i18n.adapter.ts#L7)

Translate a message key to the target language

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `options?` | \{ `args?`: `Record`\<`string`, `unknown`\>; `lang?`: `string`; \} |
| `options.args?` | `Record`\<`string`, `unknown`\> |
| `options.lang?` | `string` |

###### Returns

`string`

***

<a id="api-i18nservicelike"></a>

### I18nServiceLike

Defined in: [src/adapters/i18n.adapter.ts:17](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/adapters/i18n.adapter.ts#L17)

Minimal interface for nestjs-i18n's I18nService.
Requires only the `translate()` method, making it structurally compatible
with nestjs-i18n v10+ without importing the package at compile time.

#### Methods

<a id="api-translate-1"></a>

##### translate()

```ts
translate(key, options?): unknown;
```

Defined in: [src/adapters/i18n.adapter.ts:18](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/adapters/i18n.adapter.ts#L18)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `options?` | \{ `args?`: `Record`\<`string`, `unknown`\>; `lang?`: `string`; \} |
| `options.args?` | `Record`\<`string`, `unknown`\> |
| `options.lang?` | `string` |

###### Returns

`unknown`

***

<a id="api-paginatedoptions"></a>

### PaginatedOptions

Defined in: [src/interfaces/index.ts:219](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L219)

#### Properties

<a id="api-links-3"></a>

##### links?

```ts
optional links?: boolean;
```

Defined in: [src/interfaces/index.ts:222](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L222)

Generate HATEOAS navigation links in pagination meta. Default: false

<a id="api-maxlimit-1"></a>

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [src/interfaces/index.ts:220](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L220)

***

<a id="api-paginatedresult"></a>

### PaginatedResult

Defined in: [src/interfaces/index.ts:225](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L225)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

<a id="api-data-1"></a>

##### data

```ts
data: T[];
```

Defined in: [src/interfaces/index.ts:226](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L226)

<a id="api-limit-3"></a>

##### limit

```ts
limit: number;
```

Defined in: [src/interfaces/index.ts:229](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L229)

<a id="api-page"></a>

##### page

```ts
page: number;
```

Defined in: [src/interfaces/index.ts:228](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L228)

<a id="api-total"></a>

##### total

```ts
total: number;
```

Defined in: [src/interfaces/index.ts:227](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L227)

***

<a id="api-paginationlinks"></a>

### PaginationLinks

Defined in: [src/interfaces/index.ts:211](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L211)

#### Properties

<a id="api-first"></a>

##### first

```ts
first: string;
```

Defined in: [src/interfaces/index.ts:213](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L213)

<a id="api-last"></a>

##### last

```ts
last: string | null;
```

Defined in: [src/interfaces/index.ts:216](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L216)

<a id="api-next"></a>

##### next

```ts
next: string | null;
```

Defined in: [src/interfaces/index.ts:215](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L215)

<a id="api-prev"></a>

##### prev

```ts
prev: string | null;
```

Defined in: [src/interfaces/index.ts:214](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L214)

<a id="api-self"></a>

##### self

```ts
self: string;
```

Defined in: [src/interfaces/index.ts:212](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L212)

***

<a id="api-paginationmeta"></a>

### PaginationMeta

Defined in: [src/interfaces/index.ts:139](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L139)

#### Properties

<a id="api-hasnext"></a>

##### hasNext

```ts
hasNext: boolean;
```

Defined in: [src/interfaces/index.ts:145](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L145)

<a id="api-hasprev"></a>

##### hasPrev

```ts
hasPrev: boolean;
```

Defined in: [src/interfaces/index.ts:146](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L146)

<a id="api-limit-4"></a>

##### limit

```ts
limit: number;
```

Defined in: [src/interfaces/index.ts:142](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L142)

<a id="api-links-4"></a>

##### links?

```ts
optional links?: PaginationLinks;
```

Defined in: [src/interfaces/index.ts:147](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L147)

<a id="api-page-1"></a>

##### page

```ts
page: number;
```

Defined in: [src/interfaces/index.ts:141](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L141)

<a id="api-total-1"></a>

##### total

```ts
total: number;
```

Defined in: [src/interfaces/index.ts:143](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L143)

<a id="api-totalpages"></a>

##### totalPages

```ts
totalPages: number;
```

Defined in: [src/interfaces/index.ts:144](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L144)

<a id="api-type-2"></a>

##### type?

```ts
optional type?: "offset";
```

Defined in: [src/interfaces/index.ts:140](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L140)

***

<a id="api-problemdetailsoptions"></a>

### ProblemDetailsOptions

Defined in: [src/interfaces/index.ts:101](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L101)

#### Properties

<a id="api-baseurl"></a>

##### baseUrl?

```ts
optional baseUrl?: string;
```

Defined in: [src/interfaces/index.ts:103](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L103)

Base URL for problem type URIs (e.g., 'https://api.example.com/problems')

***

<a id="api-ratelimitmeta"></a>

### RateLimitMeta

Defined in: [src/interfaces/index.ts:43](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L43)

#### Properties

<a id="api-limit-6"></a>

##### limit

```ts
limit: number;
```

Defined in: [src/interfaces/index.ts:44](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L44)

<a id="api-remaining"></a>

##### remaining

```ts
remaining: number;
```

Defined in: [src/interfaces/index.ts:45](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L45)

<a id="api-reset"></a>

##### reset

```ts
reset: number;
```

Defined in: [src/interfaces/index.ts:46](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L46)

<a id="api-retryafter"></a>

##### retryAfter?

```ts
optional retryAfter?: number;
```

Defined in: [src/interfaces/index.ts:47](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L47)

***

<a id="api-ratelimitoptions"></a>

### RateLimitOptions

Defined in: [src/interfaces/index.ts:38](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L38)

#### Properties

<a id="api-headerprefix"></a>

##### headerPrefix?

```ts
optional headerPrefix?: string;
```

Defined in: [src/interfaces/index.ts:40](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L40)

Header name prefix (default: 'X-RateLimit'). Headers read: {prefix}-Limit, {prefix}-Remaining, {prefix}-Reset

***

<a id="api-requestidoptions"></a>

### RequestIdOptions

Defined in: [src/interfaces/index.ts:3](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L3)

#### Properties

<a id="api-generator"></a>

##### generator?

```ts
optional generator?: () => string;
```

Defined in: [src/interfaces/index.ts:7](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L7)

Custom ID generator (default: crypto.randomUUID())

###### Returns

`string`

<a id="api-headername"></a>

##### headerName?

```ts
optional headerName?: string;
```

Defined in: [src/interfaces/index.ts:5](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L5)

Custom header name (default: 'X-Request-Id')

***

<a id="api-responsemeta"></a>

### ResponseMeta

Defined in: [src/interfaces/index.ts:165](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L165)

#### Indexable

```ts
[key: string]: unknown
```

Additional context fields (e.g., traceId, correlationId)

#### Properties

<a id="api-apiversion-1"></a>

##### apiVersion?

```ts
optional apiVersion?: string;
```

Defined in: [src/interfaces/index.ts:173](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L173)

<a id="api-deprecation-1"></a>

##### deprecation?

```ts
optional deprecation?: DeprecationMeta;
```

Defined in: [src/interfaces/index.ts:171](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L171)

<a id="api-fields-1"></a>

##### fields?

```ts
optional fields?: string[];
```

Defined in: [src/interfaces/index.ts:174](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L174)

<a id="api-filters-1"></a>

##### filters?

```ts
optional filters?: Record<string, unknown>;
```

Defined in: [src/interfaces/index.ts:170](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L170)

<a id="api-message-6"></a>

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:167](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L167)

<a id="api-pagination"></a>

##### pagination?

```ts
optional pagination?:
  | PaginationMeta
  | CursorPaginationMeta;
```

Defined in: [src/interfaces/index.ts:166](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L166)

<a id="api-ratelimit-1"></a>

##### rateLimit?

```ts
optional rateLimit?: RateLimitMeta;
```

Defined in: [src/interfaces/index.ts:172](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L172)

<a id="api-responsetime-1"></a>

##### responseTime?

```ts
optional responseTime?: number;
```

Defined in: [src/interfaces/index.ts:168](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L168)

<a id="api-sort"></a>

##### sort?

```ts
optional sort?: SortInfo;
```

Defined in: [src/interfaces/index.ts:169](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L169)

***

<a id="api-safecursorpaginatedendpointoptions"></a>

### SafeCursorPaginatedEndpointOptions

Defined in: [src/interfaces/index.ts:326](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L326)

#### Properties

<a id="api-code-3"></a>

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:340](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L340)

Custom success code

<a id="api-deprecated-5"></a>

##### deprecated?

```ts
optional deprecated?: DeprecatedOptions;
```

Defined in: [src/interfaces/index.ts:344](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L344)

Mark endpoint as deprecated with RFC headers

<a id="api-description-2"></a>

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/index.ts:336](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L336)

Swagger response description

<a id="api-errorformat"></a>

##### errorFormat?

```ts
optional errorFormat?: ErrorDocumentationFormat;
```

Defined in: [src/interfaces/index.ts:348](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L348)

Error response documentation format for composite decorators. Runtime format is still module-level problemDetails.

<a id="api-errors"></a>

##### errors?

```ts
optional errors?: ApiSafeErrorResponseConfig[];
```

Defined in: [src/interfaces/index.ts:342](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L342)

Error responses to document in Swagger

<a id="api-fieldselection-3"></a>

##### fieldSelection?

```ts
optional fieldSelection?: boolean | FieldSelectionOptions;
```

Defined in: [src/interfaces/index.ts:346](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L346)

Enable or disable field selection for this route. Overrides module-level fieldSelection.

<a id="api-filter"></a>

##### filter?

```ts
optional filter?: boolean;
```

Defined in: [src/interfaces/index.ts:334](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L334)

Include filter metadata (default: false)

<a id="api-links-6"></a>

##### links?

```ts
optional links?: boolean;
```

Defined in: [src/interfaces/index.ts:330](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L330)

Generate HATEOAS navigation links (default: false)

<a id="api-maxlimit-2"></a>

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [src/interfaces/index.ts:328](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L328)

Maximum items per page

<a id="api-message-8"></a>

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:338](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L338)

Custom response message in meta

<a id="api-problemdetails"></a>

##### problemDetails?

```ts
optional problemDetails?: boolean;
```

Defined in: [src/interfaces/index.ts:354](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L354)

Use RFC 9457 Problem Details schema for error responses in Swagger (default: false).
**Note:** This only controls Swagger documentation schema. The actual runtime error format
is determined by the module-level `problemDetails` option. Keep both in sync.

<a id="api-sort-2"></a>

##### sort?

```ts
optional sort?: boolean;
```

Defined in: [src/interfaces/index.ts:332](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L332)

Include sort metadata (default: false)

***

<a id="api-safeendpointoptions"></a>

### SafeEndpointOptions

Defined in: [src/interfaces/index.ts:264](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L264)

#### Properties

<a id="api-code-4"></a>

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:278](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L278)

Custom success code

<a id="api-deprecated-6"></a>

##### deprecated?

```ts
optional deprecated?: DeprecatedOptions;
```

Defined in: [src/interfaces/index.ts:282](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L282)

Mark endpoint as deprecated with RFC headers

<a id="api-description-3"></a>

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/index.ts:270](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L270)

Swagger response description

<a id="api-errorformat-1"></a>

##### errorFormat?

```ts
optional errorFormat?: ErrorDocumentationFormat;
```

Defined in: [src/interfaces/index.ts:286](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L286)

Error response documentation format for composite decorators. Runtime format is still module-level problemDetails.

<a id="api-errors-1"></a>

##### errors?

```ts
optional errors?: ApiSafeErrorResponseConfig[];
```

Defined in: [src/interfaces/index.ts:280](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L280)

Error responses to document in Swagger

<a id="api-fieldselection-4"></a>

##### fieldSelection?

```ts
optional fieldSelection?: boolean | FieldSelectionOptions;
```

Defined in: [src/interfaces/index.ts:284](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L284)

Enable or disable field selection for this route. Overrides module-level fieldSelection.

<a id="api-filter-1"></a>

##### filter?

```ts
optional filter?: boolean;
```

Defined in: [src/interfaces/index.ts:274](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L274)

Include filter metadata from handler return value (default: false)

<a id="api-isarray"></a>

##### isArray?

```ts
optional isArray?: boolean;
```

Defined in: [src/interfaces/index.ts:268](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L268)

Whether data is an array (default: false)

<a id="api-message-9"></a>

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:276](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L276)

Custom response message in meta

<a id="api-problemdetails-1"></a>

##### problemDetails?

```ts
optional problemDetails?: boolean;
```

Defined in: [src/interfaces/index.ts:292](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L292)

Use RFC 9457 Problem Details schema for error responses in Swagger (default: false).
**Note:** This only controls Swagger documentation schema. The actual runtime error format
is determined by the module-level `problemDetails` option. Keep both in sync.

<a id="api-sort-3"></a>

##### sort?

```ts
optional sort?: boolean;
```

Defined in: [src/interfaces/index.ts:272](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L272)

Include sort metadata from handler return value (default: false)

<a id="api-statuscode-1"></a>

##### statusCode?

```ts
optional statusCode?: number;
```

Defined in: [src/interfaces/index.ts:266](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L266)

HTTP status code for Swagger response (default: 200)

***

<a id="api-safeerrorresponse"></a>

### SafeErrorResponse

Defined in: [src/interfaces/index.ts:190](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L190)

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

Defined in: [src/interfaces/index.ts:194](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L194)

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

Defined in: [src/interfaces/index.ts:199](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L199)

###### Index Signature

```ts
[key: string]: unknown
```

Additional context fields (e.g., traceId, correlationId)

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

Defined in: [src/interfaces/index.ts:208](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L208)

<a id="api-requestid-1"></a>

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/interfaces/index.ts:193](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L193)

<a id="api-statuscode-2"></a>

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/interfaces/index.ts:192](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L192)

<a id="api-success"></a>

##### success

```ts
success: false;
```

Defined in: [src/interfaces/index.ts:191](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L191)

<a id="api-timestamp"></a>

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/interfaces/index.ts:207](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L207)

***

<a id="api-safepaginatedendpointoptions"></a>

### SafePaginatedEndpointOptions

Defined in: [src/interfaces/index.ts:295](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L295)

#### Properties

<a id="api-code-5"></a>

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:309](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L309)

Custom success code

<a id="api-deprecated-7"></a>

##### deprecated?

```ts
optional deprecated?: DeprecatedOptions;
```

Defined in: [src/interfaces/index.ts:313](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L313)

Mark endpoint as deprecated with RFC headers

<a id="api-description-4"></a>

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/index.ts:305](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L305)

Swagger response description

<a id="api-errorformat-2"></a>

##### errorFormat?

```ts
optional errorFormat?: ErrorDocumentationFormat;
```

Defined in: [src/interfaces/index.ts:317](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L317)

Error response documentation format for composite decorators. Runtime format is still module-level problemDetails.

<a id="api-errors-2"></a>

##### errors?

```ts
optional errors?: ApiSafeErrorResponseConfig[];
```

Defined in: [src/interfaces/index.ts:311](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L311)

Error responses to document in Swagger

<a id="api-fieldselection-5"></a>

##### fieldSelection?

```ts
optional fieldSelection?: boolean | FieldSelectionOptions;
```

Defined in: [src/interfaces/index.ts:315](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L315)

Enable or disable field selection for this route. Overrides module-level fieldSelection.

<a id="api-filter-2"></a>

##### filter?

```ts
optional filter?: boolean;
```

Defined in: [src/interfaces/index.ts:303](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L303)

Include filter metadata from handler return value (default: false)

<a id="api-links-7"></a>

##### links?

```ts
optional links?: boolean;
```

Defined in: [src/interfaces/index.ts:299](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L299)

Generate HATEOAS navigation links (default: false)

<a id="api-maxlimit-3"></a>

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [src/interfaces/index.ts:297](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L297)

Maximum items per page (clamped via PaginatedOptions.maxLimit)

<a id="api-message-11"></a>

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:307](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L307)

Custom response message in meta

<a id="api-problemdetails-2"></a>

##### problemDetails?

```ts
optional problemDetails?: boolean;
```

Defined in: [src/interfaces/index.ts:323](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L323)

Use RFC 9457 Problem Details schema for error responses in Swagger (default: false).
**Note:** This only controls Swagger documentation schema. The actual runtime error format
is determined by the module-level `problemDetails` option. Keep both in sync.

<a id="api-sort-4"></a>

##### sort?

```ts
optional sort?: boolean;
```

Defined in: [src/interfaces/index.ts:301](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L301)

Include sort metadata from handler return value (default: false)

***

<a id="api-safeproblemdetailsresponse"></a>

### SafeProblemDetailsResponse

Defined in: [src/interfaces/index.ts:106](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L106)

#### Properties

<a id="api-code-6"></a>

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:113](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L113)

Extension member: machine-readable error code

<a id="api-detail-1"></a>

##### detail

```ts
detail: string;
```

Defined in: [src/interfaces/index.ts:110](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L110)

<a id="api-details-4"></a>

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/interfaces/index.ts:117](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L117)

Extension member: validation error details

<a id="api-instance-1"></a>

##### instance

```ts
instance: string;
```

Defined in: [src/interfaces/index.ts:111](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L111)

<a id="api-meta-3"></a>

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

Defined in: [src/interfaces/index.ts:119](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L119)

Extension member: response time and context

###### Index Signature

```ts
[key: string]: unknown
```

Additional context fields (e.g., traceId, correlationId)

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

<a id="api-requestid-3"></a>

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/interfaces/index.ts:115](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L115)

Extension member: request tracking ID

<a id="api-status-2"></a>

##### status

```ts
status: number;
```

Defined in: [src/interfaces/index.ts:109](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L109)

<a id="api-title-1"></a>

##### title

```ts
title: string;
```

Defined in: [src/interfaces/index.ts:108](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L108)

<a id="api-type-5"></a>

##### type

```ts
type: string;
```

Defined in: [src/interfaces/index.ts:107](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L107)

***

<a id="api-saferesponsemoduleasyncoptions"></a>

### SafeResponseModuleAsyncOptions

Defined in: [src/interfaces/index.ts:129](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L129)

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
optional inject?: any[];
```

Defined in: [src/interfaces/index.ts:136](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L136)

<a id="api-usefactory"></a>

##### useFactory

```ts
useFactory: (...args) =>
  | SafeResponseModuleOptions
| Promise<SafeResponseModuleOptions>;
```

Defined in: [src/interfaces/index.ts:131](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L131)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`SafeResponseModuleOptions`](#api-saferesponsemoduleoptions)
  \| `Promise`\<[`SafeResponseModuleOptions`](#api-saferesponsemoduleoptions)\>

***

<a id="api-saferesponsemoduleoptions"></a>

### SafeResponseModuleOptions

Defined in: [src/interfaces/index.ts:62](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L62)

#### Properties

<a id="api-context"></a>

##### context?

```ts
optional context?: ContextOptions;
```

Defined in: [src/interfaces/index.ts:84](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L84)

Inject request context values (e.g., traceId) into response meta. Requires nestjs-cls.

<a id="api-dateformatter"></a>

##### dateFormatter?

```ts
optional dateFormatter?: () => string;
```

Defined in: [src/interfaces/index.ts:70](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L70)

Custom date formatter function (default: ISO 8601)

###### Returns

`string`

<a id="api-errorcatalog-1"></a>

##### errorCatalog?

```ts
optional errorCatalog?: ErrorCatalog<string>;
```

Defined in: [src/interfaces/index.ts:96](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L96)

Error catalog for centralized error definitions. Created via defineErrors().

<a id="api-errorcodemapper"></a>

##### errorCodeMapper?

```ts
optional errorCodeMapper?: (exception, context?) => string | undefined;
```

Defined in: [src/interfaces/index.ts:68](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L68)

Custom error code mapper function. Optional second arg provides statusCode and defaultCode context.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `exception` | `unknown` |
| `context?` | [`ErrorCodeMapperContext`](#api-errorcodemappercontext) |

###### Returns

`string` \| `undefined`

<a id="api-errorcodes"></a>

##### errorCodes?

```ts
optional errorCodes?: Record<number, string>;
```

Defined in: [src/interfaces/index.ts:92](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L92)

Declarative error code map. Merged on top of DEFAULT_ERROR_CODE_MAP. Use for simple status-to-code mappings.

<a id="api-fieldselection-6"></a>

##### fieldSelection?

```ts
optional fieldSelection?: boolean | FieldSelectionOptions;
```

Defined in: [src/interfaces/index.ts:98](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L98)

Enable partial response via field selection query parameter. true uses defaults, or pass options.

<a id="api-i18n"></a>

##### i18n?

```ts
optional i18n?: boolean | I18nAdapter;
```

Defined in: [src/interfaces/index.ts:86](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L86)

Enable i18n for error/success messages. true = auto-detect nestjs-i18n, or pass a custom I18nAdapter.

<a id="api-path-2"></a>

##### path?

```ts
optional path?: boolean;
```

Defined in: [src/interfaces/index.ts:66](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L66)

Include path field in responses (default: true)

<a id="api-problemdetails-3"></a>

##### problemDetails?

```ts
optional problemDetails?: boolean | ProblemDetailsOptions;
```

Defined in: [src/interfaces/index.ts:80](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L80)

Enable RFC 9457 Problem Details format for error responses. Default: false

<a id="api-ratelimit-3"></a>

##### rateLimit?

```ts
optional rateLimit?: boolean | RateLimitOptions;
```

Defined in: [src/interfaces/index.ts:88](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L88)

Mirror rate limit response headers into meta.rateLimit. true uses defaults, or pass options object.

<a id="api-requestid-4"></a>

##### requestId?

```ts
optional requestId?: boolean | RequestIdOptions;
```

Defined in: [src/interfaces/index.ts:76](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L76)

Enable request ID tracking. true uses defaults, or pass options object.

<a id="api-responsetime-3"></a>

##### responseTime?

```ts
optional responseTime?: boolean;
```

Defined in: [src/interfaces/index.ts:78](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L78)

Include response time in meta (milliseconds). Default: false

<a id="api-successcodemapper"></a>

##### successCodeMapper?

```ts
optional successCodeMapper?: (statusCode) => string | undefined;
```

Defined in: [src/interfaces/index.ts:72](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L72)

Custom success code mapper function (statusCode → code string)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `statusCode` | `number` |

###### Returns

`string` \| `undefined`

<a id="api-suppresswarnings"></a>

##### suppressWarnings?

```ts
optional suppressWarnings?: boolean;
```

Defined in: [src/interfaces/index.ts:90](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L90)

Suppress shape-mismatch warnings for @Paginated, @CursorPaginated, @SortMeta, @FilterMeta. Default: false

<a id="api-swagger"></a>

##### swagger?

```ts
optional swagger?: SwaggerOptions;
```

Defined in: [src/interfaces/index.ts:82](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L82)

Swagger documentation options

<a id="api-timestamp-2"></a>

##### timestamp?

```ts
optional timestamp?: boolean;
```

Defined in: [src/interfaces/index.ts:64](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L64)

Include timestamp field in responses (default: true)

<a id="api-transformresponse"></a>

##### transformResponse?

```ts
optional transformResponse?: (data) => unknown;
```

Defined in: [src/interfaces/index.ts:74](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L74)

Transform data before wrapping (sync only, runs before pagination check)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `unknown` |

###### Returns

`unknown`

<a id="api-version"></a>

##### version?

```ts
optional version?: string;
```

Defined in: [src/interfaces/index.ts:94](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L94)

API version string to include in every response's meta.apiVersion.

***

<a id="api-safesuccessresponse"></a>

### SafeSuccessResponse

Defined in: [src/interfaces/index.ts:179](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L179)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

<a id="api-code-7"></a>

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:182](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L182)

<a id="api-data-2"></a>

##### data

```ts
data: T;
```

Defined in: [src/interfaces/index.ts:184](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L184)

<a id="api-meta-4"></a>

##### meta?

```ts
optional meta?: ResponseMeta;
```

Defined in: [src/interfaces/index.ts:185](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L185)

<a id="api-path-3"></a>

##### path?

```ts
optional path?: string;
```

Defined in: [src/interfaces/index.ts:187](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L187)

<a id="api-requestid-5"></a>

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/interfaces/index.ts:183](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L183)

<a id="api-statuscode-4"></a>

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/interfaces/index.ts:181](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L181)

<a id="api-success-2"></a>

##### success

```ts
success: true;
```

Defined in: [src/interfaces/index.ts:180](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L180)

<a id="api-timestamp-3"></a>

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/interfaces/index.ts:186](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L186)

***

<a id="api-sortinfo"></a>

### SortInfo

Defined in: [src/interfaces/index.ts:160](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L160)

#### Properties

<a id="api-field"></a>

##### field

```ts
field: string;
```

Defined in: [src/interfaces/index.ts:161](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L161)

<a id="api-order"></a>

##### order

```ts
order: "asc" | "desc";
```

Defined in: [src/interfaces/index.ts:162](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L162)

***

<a id="api-swaggeroptions"></a>

### SwaggerOptions

Defined in: [src/interfaces/index.ts:57](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L57)

#### Properties

<a id="api-globalerrors"></a>

##### globalErrors?

```ts
optional globalErrors?: ApiSafeErrorResponseConfig[];
```

Defined in: [src/interfaces/index.ts:59](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L59)

Error responses to add to all routes (e.g., [401, 403, 500])

## Type Aliases

<a id="api-apisafeerrorresponseconfig"></a>

### ApiSafeErrorResponseConfig

```ts
type ApiSafeErrorResponseConfig =
  | number
  | {
  status: number;
} & ApiSafeErrorResponseOptions;
```

Defined in: [src/interfaces/index.ts:258](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L258)

***

<a id="api-errorcatalog"></a>

### ErrorCatalog

```ts
type ErrorCatalog<K> = Record<K, ErrorDefinition>;
```

Defined in: [src/errors/index.ts:16](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/errors/index.ts#L16)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `K` *extends* `string` | `string` |

***

<a id="api-errordocumentationformat"></a>

### ErrorDocumentationFormat

```ts
type ErrorDocumentationFormat = "safe" | "problem";
```

Defined in: [src/interfaces/index.ts:262](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/interfaces/index.ts#L262)

## Variables

<a id="api-default_error_code_map"></a>

### DEFAULT\_ERROR\_CODE\_MAP

```ts
const DEFAULT_ERROR_CODE_MAP: {
  400: "BAD_REQUEST";
  401: "UNAUTHORIZED";
  403: "FORBIDDEN";
  404: "NOT_FOUND";
  405: "METHOD_NOT_ALLOWED";
  409: "CONFLICT";
  422: "UNPROCESSABLE_ENTITY";
  429: "TOO_MANY_REQUESTS";
  500: "INTERNAL_SERVER_ERROR";
  502: "BAD_GATEWAY";
  503: "SERVICE_UNAVAILABLE";
};
```

Defined in: [src/constants.ts:41](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L41)

#### Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="api-property-400"></a> `400` | `"BAD_REQUEST"` | `'BAD_REQUEST'` | [src/constants.ts:42](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L42) |
| <a id="api-property-401"></a> `401` | `"UNAUTHORIZED"` | `'UNAUTHORIZED'` | [src/constants.ts:43](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L43) |
| <a id="api-property-403"></a> `403` | `"FORBIDDEN"` | `'FORBIDDEN'` | [src/constants.ts:44](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L44) |
| <a id="api-property-404"></a> `404` | `"NOT_FOUND"` | `'NOT_FOUND'` | [src/constants.ts:45](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L45) |
| <a id="api-property-405"></a> `405` | `"METHOD_NOT_ALLOWED"` | `'METHOD_NOT_ALLOWED'` | [src/constants.ts:46](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L46) |
| <a id="api-property-409"></a> `409` | `"CONFLICT"` | `'CONFLICT'` | [src/constants.ts:47](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L47) |
| <a id="api-property-422"></a> `422` | `"UNPROCESSABLE_ENTITY"` | `'UNPROCESSABLE_ENTITY'` | [src/constants.ts:48](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L48) |
| <a id="api-property-429"></a> `429` | `"TOO_MANY_REQUESTS"` | `'TOO_MANY_REQUESTS'` | [src/constants.ts:49](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L49) |
| <a id="api-property-500"></a> `500` | `"INTERNAL_SERVER_ERROR"` | `'INTERNAL_SERVER_ERROR'` | [src/constants.ts:50](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L50) |
| <a id="api-property-502"></a> `502` | `"BAD_GATEWAY"` | `'BAD_GATEWAY'` | [src/constants.ts:51](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L51) |
| <a id="api-property-503"></a> `503` | `"SERVICE_UNAVAILABLE"` | `'SERVICE_UNAVAILABLE'` | [src/constants.ts:52](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L52) |

***

<a id="api-default_problem_title_map"></a>

### DEFAULT\_PROBLEM\_TITLE\_MAP

```ts
const DEFAULT_PROBLEM_TITLE_MAP: {
  400: "Bad Request";
  401: "Unauthorized";
  403: "Forbidden";
  404: "Not Found";
  405: "Method Not Allowed";
  409: "Conflict";
  422: "Unprocessable Entity";
  429: "Too Many Requests";
  500: "Internal Server Error";
  502: "Bad Gateway";
  503: "Service Unavailable";
};
```

Defined in: [src/constants.ts:27](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L27)

#### Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="api-property-400-1"></a> `400` | `"Bad Request"` | `'Bad Request'` | [src/constants.ts:28](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L28) |
| <a id="api-property-401-1"></a> `401` | `"Unauthorized"` | `'Unauthorized'` | [src/constants.ts:29](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L29) |
| <a id="api-property-403-1"></a> `403` | `"Forbidden"` | `'Forbidden'` | [src/constants.ts:30](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L30) |
| <a id="api-property-404-1"></a> `404` | `"Not Found"` | `'Not Found'` | [src/constants.ts:31](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L31) |
| <a id="api-property-405-1"></a> `405` | `"Method Not Allowed"` | `'Method Not Allowed'` | [src/constants.ts:32](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L32) |
| <a id="api-property-409-1"></a> `409` | `"Conflict"` | `'Conflict'` | [src/constants.ts:33](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L33) |
| <a id="api-property-422-1"></a> `422` | `"Unprocessable Entity"` | `'Unprocessable Entity'` | [src/constants.ts:34](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L34) |
| <a id="api-property-429-1"></a> `429` | `"Too Many Requests"` | `'Too Many Requests'` | [src/constants.ts:35](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L35) |
| <a id="api-property-500-1"></a> `500` | `"Internal Server Error"` | `'Internal Server Error'` | [src/constants.ts:36](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L36) |
| <a id="api-property-502-1"></a> `502` | `"Bad Gateway"` | `'Bad Gateway'` | [src/constants.ts:37](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L37) |
| <a id="api-property-503-1"></a> `503` | `"Service Unavailable"` | `'Service Unavailable'` | [src/constants.ts:38](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L38) |

## Functions

<a id="api-apicursorpaginatedsaferesponse"></a>

### ApiCursorPaginatedSafeResponse()

```ts
function ApiCursorPaginatedSafeResponse<T>(model, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:243](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L243)

Document a cursor-paginated response with Swagger schema.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Type`\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `model` | `T` |
| `options?` | \{ `description?`: `string`; \} |
| `options.description?` | `string` |

#### Returns

`MethodDecorator`

***

<a id="api-apipaginatedsaferesponse"></a>

### ApiPaginatedSafeResponse()

```ts
function ApiPaginatedSafeResponse<T>(model, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:82](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L82)

Document a paginated response with Swagger schema.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Type`\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `model` | `T` |
| `options?` | \{ `description?`: `string`; \} |
| `options.description?` | `string` |

#### Returns

`MethodDecorator`

***

<a id="api-apisafecatalogerror"></a>

### ApiSafeCatalogError()

```ts
function ApiSafeCatalogError<K>(
   catalog,
   key,
   options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:217](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L217)

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `catalog` | [`ErrorCatalog`](#api-errorcatalog)\<`K`\> |
| `key` | `K` |
| `options?` | [`ApiSafeErrorResponseOptions`](#api-apisafeerrorresponseoptions) |

#### Returns

`MethodDecorator`

***

<a id="api-apisafecatalogerrors"></a>

### ApiSafeCatalogErrors()

```ts
function ApiSafeCatalogErrors<K>(catalog, keys): MethodDecorator;
```

Defined in: [src/decorators/index.ts:231](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L231)

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `catalog` | [`ErrorCatalog`](#api-errorcatalog)\<`K`\> |
| `keys` | readonly `K`[] |

#### Returns

`MethodDecorator`

***

<a id="api-apisafeerrorresponse"></a>

### ApiSafeErrorResponse()

```ts
function ApiSafeErrorResponse(status, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:151](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L151)

Document a single error response in Swagger with the SafeErrorResponseDto envelope.
Error code auto-resolves from DEFAULT_ERROR_CODE_MAP if not provided.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `status` | `number` |
| `options?` | [`ApiSafeErrorResponseOptions`](#api-apisafeerrorresponseoptions) |

#### Returns

`MethodDecorator`

#### Example

```typescript
@ApiSafeErrorResponse(404)
@ApiSafeErrorResponse(400, { code: 'VALIDATION_ERROR', details: ['email must be an email'] })
```

***

<a id="api-apisafeerrorresponses"></a>

### ApiSafeErrorResponses()

```ts
function ApiSafeErrorResponses(configs): MethodDecorator;
```

Defined in: [src/decorators/index.ts:206](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L206)

Document multiple error responses in Swagger at once.
Accepts an array of status codes (number) or config objects.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `configs` | [`ApiSafeErrorResponseConfig`](#api-apisafeerrorresponseconfig)[] |

#### Returns

`MethodDecorator`

#### Example

```typescript
@ApiSafeErrorResponses([400, 401, 404])
@ApiSafeErrorResponses([
  400,
  { status: 401, description: 'Token expired' },
  { status: 404, code: 'USER_NOT_FOUND' },
])
```

***

<a id="api-apisafeproblemresponse"></a>

### ApiSafeProblemResponse()

```ts
function ApiSafeProblemResponse(status, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:371](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L371)

Document an RFC 9457 Problem Details error response in Swagger.

Always generates status-specific examples (status, title, code) via `allOf`
composition with ProblemDetailsDto. When `code`, `message`, or `details`
are provided, those override the auto-resolved defaults.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `status` | `number` |
| `options?` | \{ `code?`: `string`; `description?`: `string`; `details?`: `unknown`; `message?`: `string`; \} |
| `options.code?` | `string` |
| `options.description?` | `string` |
| `options.details?` | `unknown` |
| `options.message?` | `string` |

#### Returns

`MethodDecorator`

***

<a id="api-apisaferesponse"></a>

### ApiSafeResponse()

```ts
function ApiSafeResponse<T>(model, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:47](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L47)

Document the Swagger `data` field with a specific DTO type.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Type`\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `model` | `T` |
| `options?` | \{ `description?`: `string`; `isArray?`: `boolean`; `statusCode?`: `number`; \} |
| `options.description?` | `string` |
| `options.isArray?` | `boolean` |
| `options.statusCode?` | `number` |

#### Returns

`MethodDecorator`

***

<a id="api-applyglobalerrors"></a>

### applyGlobalErrors()

```ts
function applyGlobalErrors<T>(document, options): T;
```

Defined in: [src/swagger/global-errors.ts:44](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/swagger/global-errors.ts#L44)

Apply global error response schemas to all operations in an OpenAPI document.

Call this after `SwaggerModule.createDocument()` and before `SwaggerModule.setup()`:
```typescript
const document = SwaggerModule.createDocument(app, config);
applyGlobalErrors(document, options);
SwaggerModule.setup('api', app, document);
```

The generic preserves the caller's document type — if you pass `OpenAPIObject`,
you get `OpenAPIObject` back, so chaining with `SwaggerModule.setup()` works
without manual casts.

Routes decorated with `@SkipGlobalErrors()` are excluded.
Route-level error responses take priority over global ones (no overwriting).

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `object` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `document` | `T` |
| `options` | [`SafeResponseModuleOptions`](#api-saferesponsemoduleoptions) |

#### Returns

`T`

***

<a id="api-createsafeexception"></a>

### createSafeException()

```ts
function createSafeException<K>(catalog): (key, options?) => SafeException;
```

Defined in: [src/errors/index.ts:67](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/errors/index.ts#L67)

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `catalog` | [`ErrorCatalog`](#api-errorcatalog)\<`K`\> |

#### Returns

(`key`, `options?`) => [`SafeException`](#api-safeexception)

***

<a id="api-cursorpaginated"></a>

### CursorPaginated()

```ts
function CursorPaginated(options?): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:293](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L293)

Enable cursor-based pagination metadata auto-calculation.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`CursorPaginatedOptions`](#api-cursorpaginatedoptions) |

#### Returns

`CustomDecorator`\<`string`\>

***

<a id="api-defineerrors"></a>

### defineErrors()

```ts
function defineErrors<K>(catalog): ErrorCatalog<K>;
```

Defined in: [src/errors/index.ts:29](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/errors/index.ts#L29)

Define a typed error catalog. Returns the catalog with literal key types preserved.

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `catalog` | `Record`\<`K`, [`ErrorDefinition`](#api-errordefinition)\> |

#### Returns

[`ErrorCatalog`](#api-errorcatalog)\<`K`\>

#### Example

```typescript
const errors = defineErrors({
  USER_NOT_FOUND: { status: 404, message: 'User not found' },
  EMAIL_TAKEN: { status: 409, message: 'Email already registered' },
});
```

***

<a id="api-deprecated"></a>

### Deprecated()

```ts
function Deprecated(options?): <TFunction, Y>(target, propertyKey?, descriptor?) => void;
```

Defined in: [src/decorators/index.ts:358](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L358)

Mark a route as deprecated with RFC 9745 Deprecation and RFC 8594 Sunset headers.
Also sets `deprecated: true` in the Swagger operation documentation.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | [`DeprecatedOptions`](#api-deprecatedoptions) | Optional deprecation configuration |

#### Returns

\<`TFunction`, `Y`\>(`target`, `propertyKey?`, `descriptor?`) => `void`

#### Example

```typescript
@Get('v1/users')
@Deprecated({ sunset: '2026-12-31', link: '/v2/users' })
findAll() { ... }
```

***

<a id="api-fieldselection"></a>

### FieldSelection()

```ts
function FieldSelection(options?): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:332](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L332)

Enable field selection (partial response) for this route.
Allows clients to specify `?fields=id,name` to receive only selected fields.
Pass `false` to explicitly disable field selection on a route when the module-level option is enabled.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `boolean` \| [`FieldSelectionOptions`](#api-fieldselectionoptions) |

#### Returns

`CustomDecorator`\<`string`\>

***

<a id="api-filtermeta"></a>

### FilterMeta()

```ts
function FilterMeta(): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:325](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L325)

Include filter metadata in the response meta.
The handler must return a `filters` field in the paginated result.

#### Returns

`CustomDecorator`\<`string`\>

***

<a id="api-lookuperrorcode"></a>

### lookupErrorCode()

```ts
function lookupErrorCode(statusCode): string | undefined;
```

Defined in: [src/constants.ts:56](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L56)

Look up an error code by HTTP status. Returns undefined for unmapped status codes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `statusCode` | `number` |

#### Returns

`string` \| `undefined`

***

<a id="api-lookupproblemtitle"></a>

### lookupProblemTitle()

```ts
function lookupProblemTitle(statusCode): string | undefined;
```

Defined in: [src/constants.ts:61](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/constants.ts#L61)

Look up a problem title by HTTP status. Returns undefined for unmapped status codes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `statusCode` | `number` |

#### Returns

`string` \| `undefined`

***

<a id="api-paginated"></a>

### Paginated()

```ts
function Paginated(options?): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:287](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L287)

Enable offset pagination metadata auto-calculation.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`PaginatedOptions`](#api-paginatedoptions) |

#### Returns

`CustomDecorator`\<`string`\>

***

<a id="api-problemtype"></a>

### ProblemType()

```ts
function ProblemType(typeUri): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:312](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L312)

Set the RFC 9457 problem type URI for this route.
Used when `problemDetails` is enabled in module options.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `typeUri` | `string` |

#### Returns

`CustomDecorator`\<`string`\>

***

<a id="api-rawresponse"></a>

### RawResponse()

```ts
function RawResponse(): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:282](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L282)

Skip response wrapping for this route.

#### Returns

`CustomDecorator`\<`string`\>

***

<a id="api-responsemessage"></a>

### ResponseMessage()

```ts
function ResponseMessage(message): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:299](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L299)

Set a custom message in the response meta.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

#### Returns

`CustomDecorator`\<`string`\>

***

<a id="api-safecursorpaginatedendpoint"></a>

### SafeCursorPaginatedEndpoint()

```ts
function SafeCursorPaginatedEndpoint<T>(model, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:475](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L475)

Composite decorator for cursor-paginated endpoints.
Combines Swagger cursor-paginated response, @CursorPaginated(), sort/filter meta, and more.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Type`\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `model` | `T` |
| `options` | [`SafeCursorPaginatedEndpointOptions`](#api-safecursorpaginatedendpointoptions) |

#### Returns

`MethodDecorator`

***

<a id="api-safeendpoint"></a>

### SafeEndpoint()

```ts
function SafeEndpoint<T>(model, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:412](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L412)

Composite decorator for standard (non-paginated) endpoints.
Combines Swagger response, success code, message, error responses, and deprecation.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Type`\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `model` | `T` |
| `options` | [`SafeEndpointOptions`](#api-safeendpointoptions) |

#### Returns

`MethodDecorator`

***

<a id="api-safepaginatedendpoint"></a>

### SafePaginatedEndpoint()

```ts
function SafePaginatedEndpoint<T>(model, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:443](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L443)

Composite decorator for offset-paginated endpoints.
Combines Swagger paginated response, @Paginated(), sort/filter meta, and more.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Type`\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `model` | `T` |
| `options` | [`SafePaginatedEndpointOptions`](#api-safepaginatedendpointoptions) |

#### Returns

`MethodDecorator`

***

<a id="api-saferesponse"></a>

### SafeResponse()

```ts
function SafeResponse(options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:25](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L25)

Apply standard safe response wrapping + basic Swagger schema.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | \{ `description?`: `string`; `statusCode?`: `number`; \} |
| `options.description?` | `string` |
| `options.statusCode?` | `number` |

#### Returns

`MethodDecorator`

***

<a id="api-skipglobalerrors"></a>

### SkipGlobalErrors()

```ts
function SkipGlobalErrors(): <TFunction, Y>(target, propertyKey?, descriptor?) => void;
```

Defined in: [src/decorators/index.ts:339](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L339)

Skip global error responses for this route.
Use on health checks, public endpoints, etc. that should not inherit global error documentation.

#### Returns

\<`TFunction`, `Y`\>(`target`, `propertyKey?`, `descriptor?`) => `void`

***

<a id="api-sortmeta"></a>

### SortMeta()

```ts
function SortMeta(): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:319](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L319)

Include sort metadata in the response meta.
The handler must return a `sort` field in the paginated result.

#### Returns

`CustomDecorator`\<`string`\>

***

<a id="api-successcode"></a>

### SuccessCode()

```ts
function SuccessCode(code): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:306](https://github.com/nestarc/nestjs-safe-response/blob/3f4be461fb58327d264275db148f512859572ab9/src/decorators/index.ts#L306)

Set a custom success code for this route (method-level only).
Takes priority over successCodeMapper module option.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | `string` |

#### Returns

`CustomDecorator`\<`string`\>
