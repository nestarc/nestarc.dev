# index

## Classes

### CursorPaginationMetaDto

Defined in: [src/dto/response.dto.ts:46](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L46)

#### Constructors

##### Constructor

```ts
new CursorPaginationMetaDto(): CursorPaginationMetaDto;
```

###### Returns

[`CursorPaginationMetaDto`](#cursorpaginationmetadto)

#### Properties

##### hasMore

```ts
hasMore: boolean;
```

Defined in: [src/dto/response.dto.ts:57](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L57)

##### limit

```ts
limit: number;
```

Defined in: [src/dto/response.dto.ts:60](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L60)

##### links?

```ts
optional links?: PaginationLinksDto;
```

Defined in: [src/dto/response.dto.ts:66](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L66)

##### nextCursor

```ts
nextCursor: string | null;
```

Defined in: [src/dto/response.dto.ts:51](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L51)

##### previousCursor

```ts
previousCursor: string | null;
```

Defined in: [src/dto/response.dto.ts:54](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L54)

##### totalCount?

```ts
optional totalCount?: number;
```

Defined in: [src/dto/response.dto.ts:63](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L63)

##### type

```ts
type: "cursor";
```

Defined in: [src/dto/response.dto.ts:48](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L48)

***

### DeprecationMetaDto

Defined in: [src/dto/response.dto.ts:87](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L87)

#### Constructors

##### Constructor

```ts
new DeprecationMetaDto(): DeprecationMetaDto;
```

###### Returns

[`DeprecationMetaDto`](#deprecationmetadto)

#### Properties

##### deprecated

```ts
deprecated: true;
```

Defined in: [src/dto/response.dto.ts:89](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L89)

##### link?

```ts
optional link?: string;
```

Defined in: [src/dto/response.dto.ts:101](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L101)

##### message?

```ts
optional message?: string;
```

Defined in: [src/dto/response.dto.ts:98](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L98)

##### since?

```ts
optional since?: string;
```

Defined in: [src/dto/response.dto.ts:92](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L92)

##### sunset?

```ts
optional sunset?: string;
```

Defined in: [src/dto/response.dto.ts:95](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L95)

***

### ErrorDetailDto

Defined in: [src/dto/response.dto.ts:179](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L179)

#### Constructors

##### Constructor

```ts
new ErrorDetailDto(): ErrorDetailDto;
```

###### Returns

[`ErrorDetailDto`](#errordetaildto)

#### Properties

##### code

```ts
code: string;
```

Defined in: [src/dto/response.dto.ts:181](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L181)

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/dto/response.dto.ts:189](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L189)

##### message

```ts
message: string;
```

Defined in: [src/dto/response.dto.ts:184](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L184)

***

### ErrorResponseMetaDto

Defined in: [src/dto/response.dto.ts:192](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L192)

#### Indexable

```ts
[key: string]: unknown
```

Additional context fields (e.g., traceId, correlationId) injected via CLS

#### Constructors

##### Constructor

```ts
new ErrorResponseMetaDto(): ErrorResponseMetaDto;
```

###### Returns

[`ErrorResponseMetaDto`](#errorresponsemetadto)

#### Properties

##### apiVersion?

```ts
optional apiVersion?: string;
```

Defined in: [src/dto/response.dto.ts:203](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L203)

##### deprecation?

```ts
optional deprecation?: DeprecationMetaDto;
```

Defined in: [src/dto/response.dto.ts:197](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L197)

##### rateLimit?

```ts
optional rateLimit?: RateLimitMetaDto;
```

Defined in: [src/dto/response.dto.ts:200](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L200)

##### responseTime?

```ts
optional responseTime?: number;
```

Defined in: [src/dto/response.dto.ts:194](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L194)

***

### FilterMetaDto

Defined in: [src/dto/response.dto.ts:77](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L77)

#### Constructors

##### Constructor

```ts
new FilterMetaDto(): FilterMetaDto;
```

###### Returns

[`FilterMetaDto`](#filtermetadto)

#### Properties

##### filters

```ts
filters: Record<string, unknown>;
```

Defined in: [src/dto/response.dto.ts:84](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L84)

***

### NestI18nAdapter

Defined in: [src/adapters/i18n.adapter.ts:25](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/adapters/i18n.adapter.ts#L25)

Built-in adapter for nestjs-i18n.
Wraps I18nService from the nestjs-i18n package.

#### Implements

- [`I18nAdapter`](#i18nadapter)

#### Constructors

##### Constructor

```ts
new NestI18nAdapter(i18nService): NestI18nAdapter;
```

Defined in: [src/adapters/i18n.adapter.ts:26](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/adapters/i18n.adapter.ts#L26)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `i18nService` | [`I18nServiceLike`](#i18nservicelike) |

###### Returns

[`NestI18nAdapter`](#nesti18nadapter)

#### Methods

##### resolveLanguage()

```ts
resolveLanguage(request): string;
```

Defined in: [src/adapters/i18n.adapter.ts:41](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/adapters/i18n.adapter.ts#L41)

Resolve the preferred language from the request

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | `unknown` |

###### Returns

`string`

###### Implementation of

[`I18nAdapter`](#i18nadapter).[`resolveLanguage`](#resolvelanguage)

##### translate()

```ts
translate(key, options?): string;
```

Defined in: [src/adapters/i18n.adapter.ts:28](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/adapters/i18n.adapter.ts#L28)

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

[`I18nAdapter`](#i18nadapter).[`translate`](#translate)

***

### PaginationLinksDto

Defined in: [src/dto/response.dto.ts:3](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L3)

#### Constructors

##### Constructor

```ts
new PaginationLinksDto(): PaginationLinksDto;
```

###### Returns

[`PaginationLinksDto`](#paginationlinksdto)

#### Properties

##### first

```ts
first: string;
```

Defined in: [src/dto/response.dto.ts:8](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L8)

##### last

```ts
last: string | null;
```

Defined in: [src/dto/response.dto.ts:17](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L17)

##### next

```ts
next: string | null;
```

Defined in: [src/dto/response.dto.ts:14](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L14)

##### prev

```ts
prev: string | null;
```

Defined in: [src/dto/response.dto.ts:11](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L11)

##### self

```ts
self: string;
```

Defined in: [src/dto/response.dto.ts:5](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L5)

***

### PaginationMetaDto

Defined in: [src/dto/response.dto.ts:20](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L20)

#### Constructors

##### Constructor

```ts
new PaginationMetaDto(): PaginationMetaDto;
```

###### Returns

[`PaginationMetaDto`](#paginationmetadto)

#### Properties

##### hasNext

```ts
hasNext: boolean;
```

Defined in: [src/dto/response.dto.ts:37](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L37)

##### hasPrev

```ts
hasPrev: boolean;
```

Defined in: [src/dto/response.dto.ts:40](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L40)

##### limit

```ts
limit: number;
```

Defined in: [src/dto/response.dto.ts:28](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L28)

##### links?

```ts
optional links?: PaginationLinksDto;
```

Defined in: [src/dto/response.dto.ts:43](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L43)

##### page

```ts
page: number;
```

Defined in: [src/dto/response.dto.ts:25](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L25)

##### total

```ts
total: number;
```

Defined in: [src/dto/response.dto.ts:31](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L31)

##### totalPages

```ts
totalPages: number;
```

Defined in: [src/dto/response.dto.ts:34](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L34)

##### type?

```ts
optional type?: "offset";
```

Defined in: [src/dto/response.dto.ts:22](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L22)

***

### ProblemDetailsDto

Defined in: [src/dto/response.dto.ts:232](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L232)

#### Constructors

##### Constructor

```ts
new ProblemDetailsDto(): ProblemDetailsDto;
```

###### Returns

[`ProblemDetailsDto`](#problemdetailsdto)

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/dto/response.dto.ts:249](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L249)

##### detail

```ts
detail: string;
```

Defined in: [src/dto/response.dto.ts:243](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L243)

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/dto/response.dto.ts:255](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L255)

##### instance

```ts
instance: string;
```

Defined in: [src/dto/response.dto.ts:246](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L246)

##### meta?

```ts
optional meta?: ErrorResponseMetaDto;
```

Defined in: [src/dto/response.dto.ts:258](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L258)

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/dto/response.dto.ts:252](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L252)

##### status

```ts
status: number;
```

Defined in: [src/dto/response.dto.ts:240](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L240)

##### title

```ts
title: string;
```

Defined in: [src/dto/response.dto.ts:237](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L237)

##### type

```ts
type: string;
```

Defined in: [src/dto/response.dto.ts:234](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L234)

***

### RateLimitMetaDto

Defined in: [src/dto/response.dto.ts:104](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L104)

#### Constructors

##### Constructor

```ts
new RateLimitMetaDto(): RateLimitMetaDto;
```

###### Returns

[`RateLimitMetaDto`](#ratelimitmetadto)

#### Properties

##### limit

```ts
limit: number;
```

Defined in: [src/dto/response.dto.ts:106](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L106)

##### remaining

```ts
remaining: number;
```

Defined in: [src/dto/response.dto.ts:109](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L109)

##### reset

```ts
reset: number;
```

Defined in: [src/dto/response.dto.ts:112](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L112)

##### retryAfter?

```ts
optional retryAfter?: number;
```

Defined in: [src/dto/response.dto.ts:115](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L115)

***

### ResponseMetaDto

Defined in: [src/dto/response.dto.ts:119](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L119)

#### Constructors

##### Constructor

```ts
new ResponseMetaDto(): ResponseMetaDto;
```

###### Returns

[`ResponseMetaDto`](#responsemetadto)

#### Properties

##### apiVersion?

```ts
optional apiVersion?: string;
```

Defined in: [src/dto/response.dto.ts:147](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L147)

##### deprecation?

```ts
optional deprecation?: DeprecationMetaDto;
```

Defined in: [src/dto/response.dto.ts:141](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L141)

##### fields?

```ts
optional fields?: string[];
```

Defined in: [src/dto/response.dto.ts:150](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L150)

##### filters?

```ts
optional filters?: Record<string, unknown>;
```

Defined in: [src/dto/response.dto.ts:138](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L138)

##### message?

```ts
optional message?: string;
```

Defined in: [src/dto/response.dto.ts:129](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L129)

##### pagination?

```ts
optional pagination?: 
  | PaginationMetaDto
  | CursorPaginationMetaDto;
```

Defined in: [src/dto/response.dto.ts:126](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L126)

##### rateLimit?

```ts
optional rateLimit?: RateLimitMetaDto;
```

Defined in: [src/dto/response.dto.ts:144](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L144)

##### responseTime?

```ts
optional responseTime?: number;
```

Defined in: [src/dto/response.dto.ts:132](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L132)

##### sort?

```ts
optional sort?: SortMetaDto;
```

Defined in: [src/dto/response.dto.ts:135](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L135)

***

### SafeErrorResponseDto

Defined in: [src/dto/response.dto.ts:209](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L209)

#### Constructors

##### Constructor

```ts
new SafeErrorResponseDto(): SafeErrorResponseDto;
```

###### Returns

[`SafeErrorResponseDto`](#safeerrorresponsedto)

#### Properties

##### error

```ts
error: ErrorDetailDto;
```

Defined in: [src/dto/response.dto.ts:220](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L220)

##### meta?

```ts
optional meta?: ErrorResponseMetaDto;
```

Defined in: [src/dto/response.dto.ts:223](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L223)

##### path?

```ts
optional path?: string;
```

Defined in: [src/dto/response.dto.ts:229](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L229)

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/dto/response.dto.ts:217](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L217)

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/dto/response.dto.ts:214](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L214)

##### success

```ts
success: false;
```

Defined in: [src/dto/response.dto.ts:211](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L211)

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/dto/response.dto.ts:226](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L226)

***

### SafeException

Defined in: [src/errors/index.ts:53](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/errors/index.ts#L53)

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

##### Constructor

```ts
new SafeException(key, options?): SafeException;
```

Defined in: [src/errors/index.ts:58](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/errors/index.ts#L58)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `options?` | \{ `details?`: `unknown`; `message?`: `string`; \} |
| `options.details?` | `unknown` |
| `options.message?` | `string` |

###### Returns

[`SafeException`](#safeexception)

###### Overrides

```ts
HttpException.constructor
```

#### Properties

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

##### errorKey

```ts
readonly errorKey: string;
```

Defined in: [src/errors/index.ts:54](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/errors/index.ts#L54)

##### message

```ts
message: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1075

###### Inherited from

```ts
HttpException.message
```

##### name

```ts
name: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1074

###### Inherited from

```ts
HttpException.name
```

##### overrideDetails?

```ts
readonly optional overrideDetails?: unknown;
```

Defined in: [src/errors/index.ts:56](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/errors/index.ts#L56)

##### overrideMessage?

```ts
readonly optional overrideMessage?: string;
```

Defined in: [src/errors/index.ts:55](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/errors/index.ts#L55)

##### stack?

```ts
optional stack?: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

```ts
HttpException.stack
```

#### Methods

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

***

### SafeExceptionFilter

Defined in: [src/filters/safe-exception.filter.ts:64](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/filters/safe-exception.filter.ts#L64)

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

##### Constructor

```ts
new SafeExceptionFilter(
   httpAdapterHost, 
   options?, 
   moduleRef?): SafeExceptionFilter;
```

Defined in: [src/filters/safe-exception.filter.ts:69](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/filters/safe-exception.filter.ts#L69)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `httpAdapterHost` | `HttpAdapterHost` |
| `options` | [`SafeResponseModuleOptions`](#saferesponsemoduleoptions) |
| `moduleRef?` | `ModuleRef` |

###### Returns

[`SafeExceptionFilter`](#safeexceptionfilter)

#### Methods

##### catch()

```ts
catch(exception, host): void;
```

Defined in: [src/filters/safe-exception.filter.ts:93](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/filters/safe-exception.filter.ts#L93)

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

### SafeResponseInterceptor

Defined in: [src/interceptors/safe-response.interceptor.ts:63](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interceptors/safe-response.interceptor.ts#L63)

#### Implements

- `NestInterceptor`

#### Constructors

##### Constructor

```ts
new SafeResponseInterceptor(
   reflector, 
   options?, 
   moduleRef?): SafeResponseInterceptor;
```

Defined in: [src/interceptors/safe-response.interceptor.ts:68](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interceptors/safe-response.interceptor.ts#L68)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `reflector` | `Reflector` |
| `options` | [`SafeResponseModuleOptions`](#saferesponsemoduleoptions) |
| `moduleRef?` | `ModuleRef` |

###### Returns

[`SafeResponseInterceptor`](#saferesponseinterceptor)

#### Methods

##### intercept()

```ts
intercept(context, next): Observable<any>;
```

Defined in: [src/interceptors/safe-response.interceptor.ts:83](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interceptors/safe-response.interceptor.ts#L83)

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

### SafeResponseModule

Defined in: [src/safe-response.module.ts:12](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/safe-response.module.ts#L12)

#### Implements

- `OnModuleInit`

#### Constructors

##### Constructor

```ts
new SafeResponseModule(): SafeResponseModule;
```

###### Returns

[`SafeResponseModule`](#saferesponsemodule)

#### Methods

##### onModuleInit()

```ts
onModuleInit(): void;
```

Defined in: [src/safe-response.module.ts:16](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/safe-response.module.ts#L16)

###### Returns

`void`

###### Implementation of

```ts
OnModuleInit.onModuleInit
```

##### register()

```ts
static register(options?): DynamicModule;
```

Defined in: [src/safe-response.module.ts:27](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/safe-response.module.ts#L27)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`SafeResponseModuleOptions`](#saferesponsemoduleoptions) |

###### Returns

`DynamicModule`

##### registerAsync()

```ts
static registerAsync(options): DynamicModule;
```

Defined in: [src/safe-response.module.ts:48](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/safe-response.module.ts#L48)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`SafeResponseModuleAsyncOptions`](#saferesponsemoduleasyncoptions) |

###### Returns

`DynamicModule`

***

### SafeSuccessResponseDto

Defined in: [src/dto/response.dto.ts:153](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L153)

#### Constructors

##### Constructor

```ts
new SafeSuccessResponseDto(): SafeSuccessResponseDto;
```

###### Returns

[`SafeSuccessResponseDto`](#safesuccessresponsedto)

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/dto/response.dto.ts:161](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L161)

##### data

```ts
data: unknown;
```

Defined in: [src/dto/response.dto.ts:167](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L167)

##### meta?

```ts
optional meta?: ResponseMetaDto;
```

Defined in: [src/dto/response.dto.ts:170](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L170)

##### path?

```ts
optional path?: string;
```

Defined in: [src/dto/response.dto.ts:176](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L176)

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/dto/response.dto.ts:164](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L164)

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/dto/response.dto.ts:158](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L158)

##### success

```ts
success: true;
```

Defined in: [src/dto/response.dto.ts:155](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L155)

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/dto/response.dto.ts:173](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L173)

***

### SortMetaDto

Defined in: [src/dto/response.dto.ts:69](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L69)

#### Constructors

##### Constructor

```ts
new SortMetaDto(): SortMetaDto;
```

###### Returns

[`SortMetaDto`](#sortmetadto)

#### Properties

##### field

```ts
field: string;
```

Defined in: [src/dto/response.dto.ts:71](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L71)

##### order

```ts
order: "asc" | "desc";
```

Defined in: [src/dto/response.dto.ts:74](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/dto/response.dto.ts#L74)

## Interfaces

### ApiSafeErrorResponseOptions

Defined in: [src/interfaces/index.ts:247](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L247)

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:251](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L251)

Override the auto-resolved error code from DEFAULT_ERROR_CODE_MAP

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/index.ts:249](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L249)

Description shown in Swagger UI

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/interfaces/index.ts:255](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L255)

Example details value (type is inferred: array → array schema, object → object schema)

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:253](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L253)

Example error message

***

### ContextOptions

Defined in: [src/interfaces/index.ts:10](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L10)

#### Properties

##### fields?

```ts
optional fields?: Record<string, string>;
```

Defined in: [src/interfaces/index.ts:12](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L12)

Map CLS store keys to response meta fields. Key = meta field name, Value = CLS store key.

##### resolver?

```ts
optional resolver?: (store) => Record<string, unknown>;
```

Defined in: [src/interfaces/index.ts:14](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L14)

Custom resolver function. Receives the CLS service instance and returns fields to inject.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `store` | `unknown` |

###### Returns

`Record`\<`string`, `unknown`\>

***

### CursorPaginatedOptions

Defined in: [src/interfaces/index.ts:232](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L232)

#### Properties

##### links?

```ts
optional links?: boolean;
```

Defined in: [src/interfaces/index.ts:235](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L235)

Generate HATEOAS navigation links in pagination meta. Default: false

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [src/interfaces/index.ts:233](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L233)

***

### CursorPaginatedResult

Defined in: [src/interfaces/index.ts:238](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L238)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

##### data

```ts
data: T[];
```

Defined in: [src/interfaces/index.ts:239](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L239)

##### hasMore

```ts
hasMore: boolean;
```

Defined in: [src/interfaces/index.ts:242](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L242)

##### limit

```ts
limit: number;
```

Defined in: [src/interfaces/index.ts:243](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L243)

##### nextCursor

```ts
nextCursor: string | null;
```

Defined in: [src/interfaces/index.ts:240](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L240)

##### previousCursor?

```ts
optional previousCursor?: string | null;
```

Defined in: [src/interfaces/index.ts:241](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L241)

##### totalCount?

```ts
optional totalCount?: number;
```

Defined in: [src/interfaces/index.ts:244](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L244)

***

### CursorPaginationMeta

Defined in: [src/interfaces/index.ts:150](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L150)

#### Properties

##### hasMore

```ts
hasMore: boolean;
```

Defined in: [src/interfaces/index.ts:154](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L154)

##### limit

```ts
limit: number;
```

Defined in: [src/interfaces/index.ts:155](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L155)

##### links?

```ts
optional links?: PaginationLinks;
```

Defined in: [src/interfaces/index.ts:157](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L157)

##### nextCursor

```ts
nextCursor: string | null;
```

Defined in: [src/interfaces/index.ts:152](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L152)

##### previousCursor

```ts
previousCursor: string | null;
```

Defined in: [src/interfaces/index.ts:153](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L153)

##### totalCount?

```ts
optional totalCount?: number;
```

Defined in: [src/interfaces/index.ts:156](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L156)

##### type

```ts
type: "cursor";
```

Defined in: [src/interfaces/index.ts:151](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L151)

***

### DeprecatedOptions

Defined in: [src/interfaces/index.ts:19](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L19)

#### Properties

##### link?

```ts
optional link?: string;
```

Defined in: [src/interfaces/index.ts:27](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L27)

URL of the successor endpoint or migration guide

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:25](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L25)

Human-readable deprecation message for API consumers

##### since?

```ts
optional since?: string | Date;
```

Defined in: [src/interfaces/index.ts:21](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L21)

Date when the endpoint was deprecated (ISO string or Date object)

##### sunset?

```ts
optional sunset?: string | Date;
```

Defined in: [src/interfaces/index.ts:23](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L23)

Date when the endpoint will be removed (ISO string or Date object)

***

### DeprecationMeta

Defined in: [src/interfaces/index.ts:30](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L30)

#### Properties

##### deprecated

```ts
deprecated: true;
```

Defined in: [src/interfaces/index.ts:31](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L31)

##### link?

```ts
optional link?: string;
```

Defined in: [src/interfaces/index.ts:35](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L35)

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:34](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L34)

##### since?

```ts
optional since?: string;
```

Defined in: [src/interfaces/index.ts:32](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L32)

##### sunset?

```ts
optional sunset?: string;
```

Defined in: [src/interfaces/index.ts:33](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L33)

***

### ErrorCodeMapperContext

Defined in: [src/interfaces/index.ts:50](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L50)

#### Properties

##### defaultCode

```ts
defaultCode: string;
```

Defined in: [src/interfaces/index.ts:54](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L54)

Default code from errorCodes option or DEFAULT_ERROR_CODE_MAP

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/interfaces/index.ts:52](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L52)

Resolved HTTP status code

***

### ErrorDefinition

Defined in: [src/errors/index.ts:5](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/errors/index.ts#L5)

#### Properties

##### description?

```ts
optional description?: string;
```

Defined in: [src/errors/index.ts:11](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/errors/index.ts#L11)

Swagger description (used in @ApiSafeErrorResponse)

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/errors/index.ts:13](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/errors/index.ts#L13)

Default error details

##### message

```ts
message: string;
```

Defined in: [src/errors/index.ts:9](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/errors/index.ts#L9)

Default error message

##### status

```ts
status: number;
```

Defined in: [src/errors/index.ts:7](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/errors/index.ts#L7)

HTTP status code for this error

***

### FieldSelectionOptions

Defined in: [src/shared/field-selection.ts:8](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/shared/field-selection.ts#L8)

Partial response (field selection) utilities.

Enables Google-style `?fields=id,name,address.city` query parameter
for selecting specific fields from the response data.

#### Properties

##### maxDepth?

```ts
optional maxDepth?: number;
```

Defined in: [src/shared/field-selection.ts:14](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/shared/field-selection.ts#L14)

Maximum nesting depth for dot-notation fields (default: 3)

##### queryParam?

```ts
optional queryParam?: string;
```

Defined in: [src/shared/field-selection.ts:10](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/shared/field-selection.ts#L10)

Query parameter name (default: 'fields')

##### separator?

```ts
optional separator?: string;
```

Defined in: [src/shared/field-selection.ts:12](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/shared/field-selection.ts#L12)

Field separator (default: ',')

***

### I18nAdapter

Defined in: [src/adapters/i18n.adapter.ts:5](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/adapters/i18n.adapter.ts#L5)

Interface for i18n adapters.
Implementations bridge the gap between @nestarc/safe-response and i18n libraries.

#### Methods

##### resolveLanguage()

```ts
resolveLanguage(request): string;
```

Defined in: [src/adapters/i18n.adapter.ts:9](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/adapters/i18n.adapter.ts#L9)

Resolve the preferred language from the request

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | `unknown` |

###### Returns

`string`

##### translate()

```ts
translate(key, options?): string;
```

Defined in: [src/adapters/i18n.adapter.ts:7](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/adapters/i18n.adapter.ts#L7)

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

### I18nServiceLike

Defined in: [src/adapters/i18n.adapter.ts:17](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/adapters/i18n.adapter.ts#L17)

Minimal interface for nestjs-i18n's I18nService.
Requires only the `translate()` method, making it structurally compatible
with nestjs-i18n v10+ without importing the package at compile time.

#### Methods

##### translate()

```ts
translate(key, options?): unknown;
```

Defined in: [src/adapters/i18n.adapter.ts:18](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/adapters/i18n.adapter.ts#L18)

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

### PaginatedOptions

Defined in: [src/interfaces/index.ts:219](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L219)

#### Properties

##### links?

```ts
optional links?: boolean;
```

Defined in: [src/interfaces/index.ts:222](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L222)

Generate HATEOAS navigation links in pagination meta. Default: false

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [src/interfaces/index.ts:220](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L220)

***

### PaginatedResult

Defined in: [src/interfaces/index.ts:225](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L225)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

##### data

```ts
data: T[];
```

Defined in: [src/interfaces/index.ts:226](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L226)

##### limit

```ts
limit: number;
```

Defined in: [src/interfaces/index.ts:229](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L229)

##### page

```ts
page: number;
```

Defined in: [src/interfaces/index.ts:228](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L228)

##### total

```ts
total: number;
```

Defined in: [src/interfaces/index.ts:227](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L227)

***

### PaginationLinks

Defined in: [src/interfaces/index.ts:211](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L211)

#### Properties

##### first

```ts
first: string;
```

Defined in: [src/interfaces/index.ts:213](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L213)

##### last

```ts
last: string | null;
```

Defined in: [src/interfaces/index.ts:216](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L216)

##### next

```ts
next: string | null;
```

Defined in: [src/interfaces/index.ts:215](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L215)

##### prev

```ts
prev: string | null;
```

Defined in: [src/interfaces/index.ts:214](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L214)

##### self

```ts
self: string;
```

Defined in: [src/interfaces/index.ts:212](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L212)

***

### PaginationMeta

Defined in: [src/interfaces/index.ts:139](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L139)

#### Properties

##### hasNext

```ts
hasNext: boolean;
```

Defined in: [src/interfaces/index.ts:145](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L145)

##### hasPrev

```ts
hasPrev: boolean;
```

Defined in: [src/interfaces/index.ts:146](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L146)

##### limit

```ts
limit: number;
```

Defined in: [src/interfaces/index.ts:142](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L142)

##### links?

```ts
optional links?: PaginationLinks;
```

Defined in: [src/interfaces/index.ts:147](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L147)

##### page

```ts
page: number;
```

Defined in: [src/interfaces/index.ts:141](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L141)

##### total

```ts
total: number;
```

Defined in: [src/interfaces/index.ts:143](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L143)

##### totalPages

```ts
totalPages: number;
```

Defined in: [src/interfaces/index.ts:144](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L144)

##### type?

```ts
optional type?: "offset";
```

Defined in: [src/interfaces/index.ts:140](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L140)

***

### ProblemDetailsOptions

Defined in: [src/interfaces/index.ts:101](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L101)

#### Properties

##### baseUrl?

```ts
optional baseUrl?: string;
```

Defined in: [src/interfaces/index.ts:103](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L103)

Base URL for problem type URIs (e.g., 'https://api.example.com/problems')

***

### RateLimitMeta

Defined in: [src/interfaces/index.ts:43](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L43)

#### Properties

##### limit

```ts
limit: number;
```

Defined in: [src/interfaces/index.ts:44](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L44)

##### remaining

```ts
remaining: number;
```

Defined in: [src/interfaces/index.ts:45](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L45)

##### reset

```ts
reset: number;
```

Defined in: [src/interfaces/index.ts:46](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L46)

##### retryAfter?

```ts
optional retryAfter?: number;
```

Defined in: [src/interfaces/index.ts:47](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L47)

***

### RateLimitOptions

Defined in: [src/interfaces/index.ts:38](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L38)

#### Properties

##### headerPrefix?

```ts
optional headerPrefix?: string;
```

Defined in: [src/interfaces/index.ts:40](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L40)

Header name prefix (default: 'X-RateLimit'). Headers read: {prefix}-Limit, {prefix}-Remaining, {prefix}-Reset

***

### RequestIdOptions

Defined in: [src/interfaces/index.ts:3](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L3)

#### Properties

##### generator?

```ts
optional generator?: () => string;
```

Defined in: [src/interfaces/index.ts:7](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L7)

Custom ID generator (default: crypto.randomUUID())

###### Returns

`string`

##### headerName?

```ts
optional headerName?: string;
```

Defined in: [src/interfaces/index.ts:5](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L5)

Custom header name (default: 'X-Request-Id')

***

### ResponseMeta

Defined in: [src/interfaces/index.ts:165](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L165)

#### Indexable

```ts
[key: string]: unknown
```

Additional context fields (e.g., traceId, correlationId)

#### Properties

##### apiVersion?

```ts
optional apiVersion?: string;
```

Defined in: [src/interfaces/index.ts:173](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L173)

##### deprecation?

```ts
optional deprecation?: DeprecationMeta;
```

Defined in: [src/interfaces/index.ts:171](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L171)

##### fields?

```ts
optional fields?: string[];
```

Defined in: [src/interfaces/index.ts:174](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L174)

##### filters?

```ts
optional filters?: Record<string, unknown>;
```

Defined in: [src/interfaces/index.ts:170](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L170)

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:167](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L167)

##### pagination?

```ts
optional pagination?: 
  | PaginationMeta
  | CursorPaginationMeta;
```

Defined in: [src/interfaces/index.ts:166](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L166)

##### rateLimit?

```ts
optional rateLimit?: RateLimitMeta;
```

Defined in: [src/interfaces/index.ts:172](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L172)

##### responseTime?

```ts
optional responseTime?: number;
```

Defined in: [src/interfaces/index.ts:168](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L168)

##### sort?

```ts
optional sort?: SortInfo;
```

Defined in: [src/interfaces/index.ts:169](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L169)

***

### SafeCursorPaginatedEndpointOptions

Defined in: [src/interfaces/index.ts:316](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L316)

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:330](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L330)

Custom success code

##### deprecated?

```ts
optional deprecated?: DeprecatedOptions;
```

Defined in: [src/interfaces/index.ts:334](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L334)

Mark endpoint as deprecated with RFC headers

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/index.ts:326](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L326)

Swagger response description

##### errors?

```ts
optional errors?: ApiSafeErrorResponseConfig[];
```

Defined in: [src/interfaces/index.ts:332](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L332)

Error responses to document in Swagger

##### filter?

```ts
optional filter?: boolean;
```

Defined in: [src/interfaces/index.ts:324](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L324)

Include filter metadata (default: false)

##### links?

```ts
optional links?: boolean;
```

Defined in: [src/interfaces/index.ts:320](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L320)

Generate HATEOAS navigation links (default: false)

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [src/interfaces/index.ts:318](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L318)

Maximum items per page

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:328](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L328)

Custom response message in meta

##### problemDetails?

```ts
optional problemDetails?: boolean;
```

Defined in: [src/interfaces/index.ts:340](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L340)

Use RFC 9457 Problem Details schema for error responses in Swagger (default: false).
**Note:** This only controls Swagger documentation schema. The actual runtime error format
is determined by the module-level `problemDetails` option. Keep both in sync.

##### sort?

```ts
optional sort?: boolean;
```

Defined in: [src/interfaces/index.ts:322](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L322)

Include sort metadata (default: false)

***

### SafeEndpointOptions

Defined in: [src/interfaces/index.ts:262](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L262)

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:276](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L276)

Custom success code

##### deprecated?

```ts
optional deprecated?: DeprecatedOptions;
```

Defined in: [src/interfaces/index.ts:280](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L280)

Mark endpoint as deprecated with RFC headers

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/index.ts:268](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L268)

Swagger response description

##### errors?

```ts
optional errors?: ApiSafeErrorResponseConfig[];
```

Defined in: [src/interfaces/index.ts:278](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L278)

Error responses to document in Swagger

##### filter?

```ts
optional filter?: boolean;
```

Defined in: [src/interfaces/index.ts:272](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L272)

Include filter metadata from handler return value (default: false)

##### isArray?

```ts
optional isArray?: boolean;
```

Defined in: [src/interfaces/index.ts:266](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L266)

Whether data is an array (default: false)

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:274](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L274)

Custom response message in meta

##### problemDetails?

```ts
optional problemDetails?: boolean;
```

Defined in: [src/interfaces/index.ts:286](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L286)

Use RFC 9457 Problem Details schema for error responses in Swagger (default: false).
**Note:** This only controls Swagger documentation schema. The actual runtime error format
is determined by the module-level `problemDetails` option. Keep both in sync.

##### sort?

```ts
optional sort?: boolean;
```

Defined in: [src/interfaces/index.ts:270](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L270)

Include sort metadata from handler return value (default: false)

##### statusCode?

```ts
optional statusCode?: number;
```

Defined in: [src/interfaces/index.ts:264](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L264)

HTTP status code for Swagger response (default: 200)

***

### SafeErrorResponse

Defined in: [src/interfaces/index.ts:190](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L190)

#### Properties

##### error

```ts
error: {
  code: string;
  details?: unknown;
  message: string;
};
```

Defined in: [src/interfaces/index.ts:194](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L194)

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
  apiVersion?: string;
  deprecation?: DeprecationMeta;
  rateLimit?: RateLimitMeta;
  responseTime?: number;
};
```

Defined in: [src/interfaces/index.ts:199](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L199)

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

##### path?

```ts
optional path?: string;
```

Defined in: [src/interfaces/index.ts:208](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L208)

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/interfaces/index.ts:193](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L193)

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/interfaces/index.ts:192](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L192)

##### success

```ts
success: false;
```

Defined in: [src/interfaces/index.ts:191](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L191)

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/interfaces/index.ts:207](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L207)

***

### SafePaginatedEndpointOptions

Defined in: [src/interfaces/index.ts:289](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L289)

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:303](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L303)

Custom success code

##### deprecated?

```ts
optional deprecated?: DeprecatedOptions;
```

Defined in: [src/interfaces/index.ts:307](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L307)

Mark endpoint as deprecated with RFC headers

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/index.ts:299](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L299)

Swagger response description

##### errors?

```ts
optional errors?: ApiSafeErrorResponseConfig[];
```

Defined in: [src/interfaces/index.ts:305](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L305)

Error responses to document in Swagger

##### filter?

```ts
optional filter?: boolean;
```

Defined in: [src/interfaces/index.ts:297](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L297)

Include filter metadata from handler return value (default: false)

##### links?

```ts
optional links?: boolean;
```

Defined in: [src/interfaces/index.ts:293](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L293)

Generate HATEOAS navigation links (default: false)

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [src/interfaces/index.ts:291](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L291)

Maximum items per page (clamped via PaginatedOptions.maxLimit)

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:301](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L301)

Custom response message in meta

##### problemDetails?

```ts
optional problemDetails?: boolean;
```

Defined in: [src/interfaces/index.ts:313](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L313)

Use RFC 9457 Problem Details schema for error responses in Swagger (default: false).
**Note:** This only controls Swagger documentation schema. The actual runtime error format
is determined by the module-level `problemDetails` option. Keep both in sync.

##### sort?

```ts
optional sort?: boolean;
```

Defined in: [src/interfaces/index.ts:295](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L295)

Include sort metadata from handler return value (default: false)

***

### SafeProblemDetailsResponse

Defined in: [src/interfaces/index.ts:106](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L106)

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:113](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L113)

Extension member: machine-readable error code

##### detail

```ts
detail: string;
```

Defined in: [src/interfaces/index.ts:110](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L110)

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/interfaces/index.ts:117](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L117)

Extension member: validation error details

##### instance

```ts
instance: string;
```

Defined in: [src/interfaces/index.ts:111](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L111)

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

Defined in: [src/interfaces/index.ts:119](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L119)

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

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/interfaces/index.ts:115](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L115)

Extension member: request tracking ID

##### status

```ts
status: number;
```

Defined in: [src/interfaces/index.ts:109](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L109)

##### title

```ts
title: string;
```

Defined in: [src/interfaces/index.ts:108](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L108)

##### type

```ts
type: string;
```

Defined in: [src/interfaces/index.ts:107](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L107)

***

### SafeResponseModuleAsyncOptions

Defined in: [src/interfaces/index.ts:129](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L129)

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
optional inject?: any[];
```

Defined in: [src/interfaces/index.ts:136](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L136)

##### useFactory

```ts
useFactory: (...args) => 
  | SafeResponseModuleOptions
| Promise<SafeResponseModuleOptions>;
```

Defined in: [src/interfaces/index.ts:131](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L131)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`SafeResponseModuleOptions`](#saferesponsemoduleoptions)
  \| `Promise`\<[`SafeResponseModuleOptions`](#saferesponsemoduleoptions)\>

***

### SafeResponseModuleOptions

Defined in: [src/interfaces/index.ts:62](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L62)

#### Properties

##### context?

```ts
optional context?: ContextOptions;
```

Defined in: [src/interfaces/index.ts:84](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L84)

Inject request context values (e.g., traceId) into response meta. Requires nestjs-cls.

##### dateFormatter?

```ts
optional dateFormatter?: () => string;
```

Defined in: [src/interfaces/index.ts:70](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L70)

Custom date formatter function (default: ISO 8601)

###### Returns

`string`

##### errorCatalog?

```ts
optional errorCatalog?: ErrorCatalog<string>;
```

Defined in: [src/interfaces/index.ts:96](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L96)

Error catalog for centralized error definitions. Created via defineErrors().

##### errorCodeMapper?

```ts
optional errorCodeMapper?: (exception, context?) => string | undefined;
```

Defined in: [src/interfaces/index.ts:68](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L68)

Custom error code mapper function. Optional second arg provides statusCode and defaultCode context.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `exception` | `unknown` |
| `context?` | [`ErrorCodeMapperContext`](#errorcodemappercontext) |

###### Returns

`string` \| `undefined`

##### errorCodes?

```ts
optional errorCodes?: Record<number, string>;
```

Defined in: [src/interfaces/index.ts:92](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L92)

Declarative error code map. Merged on top of DEFAULT_ERROR_CODE_MAP. Use for simple status-to-code mappings.

##### fieldSelection?

```ts
optional fieldSelection?: boolean | FieldSelectionOptions;
```

Defined in: [src/interfaces/index.ts:98](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L98)

Enable partial response via field selection query parameter. true uses defaults, or pass options.

##### i18n?

```ts
optional i18n?: boolean | I18nAdapter;
```

Defined in: [src/interfaces/index.ts:86](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L86)

Enable i18n for error/success messages. true = auto-detect nestjs-i18n, or pass a custom I18nAdapter.

##### path?

```ts
optional path?: boolean;
```

Defined in: [src/interfaces/index.ts:66](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L66)

Include path field in responses (default: true)

##### problemDetails?

```ts
optional problemDetails?: boolean | ProblemDetailsOptions;
```

Defined in: [src/interfaces/index.ts:80](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L80)

Enable RFC 9457 Problem Details format for error responses. Default: false

##### rateLimit?

```ts
optional rateLimit?: boolean | RateLimitOptions;
```

Defined in: [src/interfaces/index.ts:88](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L88)

Mirror rate limit response headers into meta.rateLimit. true uses defaults, or pass options object.

##### requestId?

```ts
optional requestId?: boolean | RequestIdOptions;
```

Defined in: [src/interfaces/index.ts:76](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L76)

Enable request ID tracking. true uses defaults, or pass options object.

##### responseTime?

```ts
optional responseTime?: boolean;
```

Defined in: [src/interfaces/index.ts:78](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L78)

Include response time in meta (milliseconds). Default: false

##### successCodeMapper?

```ts
optional successCodeMapper?: (statusCode) => string | undefined;
```

Defined in: [src/interfaces/index.ts:72](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L72)

Custom success code mapper function (statusCode → code string)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `statusCode` | `number` |

###### Returns

`string` \| `undefined`

##### suppressWarnings?

```ts
optional suppressWarnings?: boolean;
```

Defined in: [src/interfaces/index.ts:90](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L90)

Suppress shape-mismatch warnings for @Paginated, @CursorPaginated, @SortMeta, @FilterMeta. Default: false

##### swagger?

```ts
optional swagger?: SwaggerOptions;
```

Defined in: [src/interfaces/index.ts:82](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L82)

Swagger documentation options

##### timestamp?

```ts
optional timestamp?: boolean;
```

Defined in: [src/interfaces/index.ts:64](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L64)

Include timestamp field in responses (default: true)

##### transformResponse?

```ts
optional transformResponse?: (data) => unknown;
```

Defined in: [src/interfaces/index.ts:74](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L74)

Transform data before wrapping (sync only, runs before pagination check)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `unknown` |

###### Returns

`unknown`

##### version?

```ts
optional version?: string;
```

Defined in: [src/interfaces/index.ts:94](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L94)

API version string to include in every response's meta.apiVersion.

***

### SafeSuccessResponse

Defined in: [src/interfaces/index.ts:179](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L179)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:182](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L182)

##### data

```ts
data: T;
```

Defined in: [src/interfaces/index.ts:184](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L184)

##### meta?

```ts
optional meta?: ResponseMeta;
```

Defined in: [src/interfaces/index.ts:185](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L185)

##### path?

```ts
optional path?: string;
```

Defined in: [src/interfaces/index.ts:187](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L187)

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/interfaces/index.ts:183](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L183)

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/interfaces/index.ts:181](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L181)

##### success

```ts
success: true;
```

Defined in: [src/interfaces/index.ts:180](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L180)

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/interfaces/index.ts:186](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L186)

***

### SortInfo

Defined in: [src/interfaces/index.ts:160](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L160)

#### Properties

##### field

```ts
field: string;
```

Defined in: [src/interfaces/index.ts:161](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L161)

##### order

```ts
order: "asc" | "desc";
```

Defined in: [src/interfaces/index.ts:162](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L162)

***

### SwaggerOptions

Defined in: [src/interfaces/index.ts:57](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L57)

#### Properties

##### globalErrors?

```ts
optional globalErrors?: ApiSafeErrorResponseConfig[];
```

Defined in: [src/interfaces/index.ts:59](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L59)

Error responses to add to all routes (e.g., [401, 403, 500])

## Type Aliases

### ApiSafeErrorResponseConfig

```ts
type ApiSafeErrorResponseConfig = 
  | number
  | {
  status: number;
} & ApiSafeErrorResponseOptions;
```

Defined in: [src/interfaces/index.ts:258](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/interfaces/index.ts#L258)

***

### ErrorCatalog

```ts
type ErrorCatalog<K> = Record<K, ErrorDefinition>;
```

Defined in: [src/errors/index.ts:16](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/errors/index.ts#L16)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `K` *extends* `string` | `string` |

## Variables

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

Defined in: [src/constants.ts:41](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L41)

#### Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-400"></a> `400` | `"BAD_REQUEST"` | `'BAD_REQUEST'` | [src/constants.ts:42](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L42) |
| <a id="property-401"></a> `401` | `"UNAUTHORIZED"` | `'UNAUTHORIZED'` | [src/constants.ts:43](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L43) |
| <a id="property-403"></a> `403` | `"FORBIDDEN"` | `'FORBIDDEN'` | [src/constants.ts:44](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L44) |
| <a id="property-404"></a> `404` | `"NOT_FOUND"` | `'NOT_FOUND'` | [src/constants.ts:45](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L45) |
| <a id="property-405"></a> `405` | `"METHOD_NOT_ALLOWED"` | `'METHOD_NOT_ALLOWED'` | [src/constants.ts:46](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L46) |
| <a id="property-409"></a> `409` | `"CONFLICT"` | `'CONFLICT'` | [src/constants.ts:47](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L47) |
| <a id="property-422"></a> `422` | `"UNPROCESSABLE_ENTITY"` | `'UNPROCESSABLE_ENTITY'` | [src/constants.ts:48](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L48) |
| <a id="property-429"></a> `429` | `"TOO_MANY_REQUESTS"` | `'TOO_MANY_REQUESTS'` | [src/constants.ts:49](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L49) |
| <a id="property-500"></a> `500` | `"INTERNAL_SERVER_ERROR"` | `'INTERNAL_SERVER_ERROR'` | [src/constants.ts:50](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L50) |
| <a id="property-502"></a> `502` | `"BAD_GATEWAY"` | `'BAD_GATEWAY'` | [src/constants.ts:51](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L51) |
| <a id="property-503"></a> `503` | `"SERVICE_UNAVAILABLE"` | `'SERVICE_UNAVAILABLE'` | [src/constants.ts:52](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L52) |

***

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

Defined in: [src/constants.ts:27](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L27)

#### Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-400-1"></a> `400` | `"Bad Request"` | `'Bad Request'` | [src/constants.ts:28](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L28) |
| <a id="property-401-1"></a> `401` | `"Unauthorized"` | `'Unauthorized'` | [src/constants.ts:29](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L29) |
| <a id="property-403-1"></a> `403` | `"Forbidden"` | `'Forbidden'` | [src/constants.ts:30](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L30) |
| <a id="property-404-1"></a> `404` | `"Not Found"` | `'Not Found'` | [src/constants.ts:31](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L31) |
| <a id="property-405-1"></a> `405` | `"Method Not Allowed"` | `'Method Not Allowed'` | [src/constants.ts:32](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L32) |
| <a id="property-409-1"></a> `409` | `"Conflict"` | `'Conflict'` | [src/constants.ts:33](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L33) |
| <a id="property-422-1"></a> `422` | `"Unprocessable Entity"` | `'Unprocessable Entity'` | [src/constants.ts:34](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L34) |
| <a id="property-429-1"></a> `429` | `"Too Many Requests"` | `'Too Many Requests'` | [src/constants.ts:35](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L35) |
| <a id="property-500-1"></a> `500` | `"Internal Server Error"` | `'Internal Server Error'` | [src/constants.ts:36](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L36) |
| <a id="property-502-1"></a> `502` | `"Bad Gateway"` | `'Bad Gateway'` | [src/constants.ts:37](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L37) |
| <a id="property-503-1"></a> `503` | `"Service Unavailable"` | `'Service Unavailable'` | [src/constants.ts:38](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L38) |

## Functions

### ApiCursorPaginatedSafeResponse()

```ts
function ApiCursorPaginatedSafeResponse<T>(model, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:219](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L219)

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

### ApiPaginatedSafeResponse()

```ts
function ApiPaginatedSafeResponse<T>(model, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:81](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L81)

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

### ApiSafeErrorResponse()

```ts
function ApiSafeErrorResponse(status, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:150](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L150)

Document a single error response in Swagger with the SafeErrorResponseDto envelope.
Error code auto-resolves from DEFAULT_ERROR_CODE_MAP if not provided.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `status` | `number` |
| `options?` | [`ApiSafeErrorResponseOptions`](#apisafeerrorresponseoptions) |

#### Returns

`MethodDecorator`

#### Example

```typescript
@ApiSafeErrorResponse(404)
@ApiSafeErrorResponse(400, { code: 'VALIDATION_ERROR', details: ['email must be an email'] })
```

***

### ApiSafeErrorResponses()

```ts
function ApiSafeErrorResponses(configs): MethodDecorator;
```

Defined in: [src/decorators/index.ts:205](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L205)

Document multiple error responses in Swagger at once.
Accepts an array of status codes (number) or config objects.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `configs` | [`ApiSafeErrorResponseConfig`](#apisafeerrorresponseconfig)[] |

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

### ApiSafeProblemResponse()

```ts
function ApiSafeProblemResponse(status, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:347](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L347)

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

### ApiSafeResponse()

```ts
function ApiSafeResponse<T>(model, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:46](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L46)

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

### applyGlobalErrors()

```ts
function applyGlobalErrors<T>(document, options): T;
```

Defined in: [src/swagger/global-errors.ts:44](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/swagger/global-errors.ts#L44)

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
| `options` | [`SafeResponseModuleOptions`](#saferesponsemoduleoptions) |

#### Returns

`T`

***

### CursorPaginated()

```ts
function CursorPaginated(options?): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:269](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L269)

Enable cursor-based pagination metadata auto-calculation.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`CursorPaginatedOptions`](#cursorpaginatedoptions) |

#### Returns

`CustomDecorator`\<`string`\>

***

### defineErrors()

```ts
function defineErrors<K>(catalog): ErrorCatalog<K>;
```

Defined in: [src/errors/index.ts:29](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/errors/index.ts#L29)

Define a typed error catalog. Returns the catalog with literal key types preserved.

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `catalog` | `Record`\<`K`, [`ErrorDefinition`](#errordefinition)\> |

#### Returns

[`ErrorCatalog`](#errorcatalog)\<`K`\>

#### Example

```typescript
const errors = defineErrors({
  USER_NOT_FOUND: { status: 404, message: 'User not found' },
  EMAIL_TAKEN: { status: 409, message: 'Email already registered' },
});
```

***

### Deprecated()

```ts
function Deprecated(options?): <TFunction, Y>(target, propertyKey?, descriptor?) => void;
```

Defined in: [src/decorators/index.ts:334](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L334)

Mark a route as deprecated with RFC 9745 Deprecation and RFC 8594 Sunset headers.
Also sets `deprecated: true` in the Swagger operation documentation.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | [`DeprecatedOptions`](#deprecatedoptions) | Optional deprecation configuration |

#### Returns

\<`TFunction`, `Y`\>(`target`, `propertyKey?`, `descriptor?`) => `void`

#### Example

```typescript
@Get('v1/users')
@Deprecated({ sunset: '2026-12-31', link: '/v2/users' })
findAll() { ... }
```

***

### FieldSelection()

```ts
function FieldSelection(options?): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:308](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L308)

Enable field selection (partial response) for this route.
Allows clients to specify `?fields=id,name` to receive only selected fields.
Pass `false` to explicitly disable field selection on a route when the module-level option is enabled.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `false` \| [`FieldSelectionOptions`](#fieldselectionoptions) |

#### Returns

`CustomDecorator`\<`string`\>

***

### FilterMeta()

```ts
function FilterMeta(): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:301](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L301)

Include filter metadata in the response meta.
The handler must return a `filters` field in the paginated result.

#### Returns

`CustomDecorator`\<`string`\>

***

### lookupErrorCode()

```ts
function lookupErrorCode(statusCode): string | undefined;
```

Defined in: [src/constants.ts:56](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L56)

Look up an error code by HTTP status. Returns undefined for unmapped status codes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `statusCode` | `number` |

#### Returns

`string` \| `undefined`

***

### lookupProblemTitle()

```ts
function lookupProblemTitle(statusCode): string | undefined;
```

Defined in: [src/constants.ts:61](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/constants.ts#L61)

Look up a problem title by HTTP status. Returns undefined for unmapped status codes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `statusCode` | `number` |

#### Returns

`string` \| `undefined`

***

### Paginated()

```ts
function Paginated(options?): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:263](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L263)

Enable offset pagination metadata auto-calculation.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`PaginatedOptions`](#paginatedoptions) |

#### Returns

`CustomDecorator`\<`string`\>

***

### ProblemType()

```ts
function ProblemType(typeUri): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:288](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L288)

Set the RFC 9457 problem type URI for this route.
Used when `problemDetails` is enabled in module options.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `typeUri` | `string` |

#### Returns

`CustomDecorator`\<`string`\>

***

### RawResponse()

```ts
function RawResponse(): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:258](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L258)

Skip response wrapping for this route.

#### Returns

`CustomDecorator`\<`string`\>

***

### ResponseMessage()

```ts
function ResponseMessage(message): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:275](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L275)

Set a custom message in the response meta.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

#### Returns

`CustomDecorator`\<`string`\>

***

### SafeCursorPaginatedEndpoint()

```ts
function SafeCursorPaginatedEndpoint<T>(model, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:445](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L445)

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
| `options` | [`SafeCursorPaginatedEndpointOptions`](#safecursorpaginatedendpointoptions) |

#### Returns

`MethodDecorator`

***

### SafeEndpoint()

```ts
function SafeEndpoint<T>(model, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:388](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L388)

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
| `options` | [`SafeEndpointOptions`](#safeendpointoptions) |

#### Returns

`MethodDecorator`

***

### SafePaginatedEndpoint()

```ts
function SafePaginatedEndpoint<T>(model, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:416](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L416)

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
| `options` | [`SafePaginatedEndpointOptions`](#safepaginatedendpointoptions) |

#### Returns

`MethodDecorator`

***

### SafeResponse()

```ts
function SafeResponse(options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:24](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L24)

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

### SkipGlobalErrors()

```ts
function SkipGlobalErrors(): <TFunction, Y>(target, propertyKey?, descriptor?) => void;
```

Defined in: [src/decorators/index.ts:315](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L315)

Skip global error responses for this route.
Use on health checks, public endpoints, etc. that should not inherit global error documentation.

#### Returns

\<`TFunction`, `Y`\>(`target`, `propertyKey?`, `descriptor?`) => `void`

***

### SortMeta()

```ts
function SortMeta(): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:295](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L295)

Include sort metadata in the response meta.
The handler must return a `sort` field in the paginated result.

#### Returns

`CustomDecorator`\<`string`\>

***

### SuccessCode()

```ts
function SuccessCode(code): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:282](https://github.com/nestarc/nestjs-safe-response/blob/d521e0cae98a4a3b84f52d4c4a5818a573fa9dbb/src/decorators/index.ts#L282)

Set a custom success code for this route (method-level only).
Takes priority over successCodeMapper module option.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | `string` |

#### Returns

`CustomDecorator`\<`string`\>
