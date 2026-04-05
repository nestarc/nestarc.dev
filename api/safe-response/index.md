# index

## Classes

### CursorPaginationMetaDto

Defined in: [src/dto/response.dto.ts:46](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L46)

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

Defined in: [src/dto/response.dto.ts:57](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L57)

##### limit

```ts
limit: number;
```

Defined in: [src/dto/response.dto.ts:60](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L60)

##### links?

```ts
optional links?: PaginationLinksDto;
```

Defined in: [src/dto/response.dto.ts:66](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L66)

##### nextCursor

```ts
nextCursor: string | null;
```

Defined in: [src/dto/response.dto.ts:51](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L51)

##### previousCursor

```ts
previousCursor: string | null;
```

Defined in: [src/dto/response.dto.ts:54](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L54)

##### totalCount?

```ts
optional totalCount?: number;
```

Defined in: [src/dto/response.dto.ts:63](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L63)

##### type

```ts
type: "cursor";
```

Defined in: [src/dto/response.dto.ts:48](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L48)

***

### DeprecationMetaDto

Defined in: [src/dto/response.dto.ts:87](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L87)

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

Defined in: [src/dto/response.dto.ts:89](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L89)

##### link?

```ts
optional link?: string;
```

Defined in: [src/dto/response.dto.ts:101](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L101)

##### message?

```ts
optional message?: string;
```

Defined in: [src/dto/response.dto.ts:98](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L98)

##### since?

```ts
optional since?: string;
```

Defined in: [src/dto/response.dto.ts:92](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L92)

##### sunset?

```ts
optional sunset?: string;
```

Defined in: [src/dto/response.dto.ts:95](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L95)

***

### ErrorDetailDto

Defined in: [src/dto/response.dto.ts:173](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L173)

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

Defined in: [src/dto/response.dto.ts:175](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L175)

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/dto/response.dto.ts:183](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L183)

##### message

```ts
message: string;
```

Defined in: [src/dto/response.dto.ts:178](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L178)

***

### ErrorResponseMetaDto

Defined in: [src/dto/response.dto.ts:186](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L186)

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

##### deprecation?

```ts
optional deprecation?: DeprecationMetaDto;
```

Defined in: [src/dto/response.dto.ts:191](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L191)

##### rateLimit?

```ts
optional rateLimit?: RateLimitMetaDto;
```

Defined in: [src/dto/response.dto.ts:194](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L194)

##### responseTime?

```ts
optional responseTime?: number;
```

Defined in: [src/dto/response.dto.ts:188](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L188)

***

### FilterMetaDto

Defined in: [src/dto/response.dto.ts:77](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L77)

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

Defined in: [src/dto/response.dto.ts:84](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L84)

***

### NestI18nAdapter

Defined in: [src/adapters/i18n.adapter.ts:25](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/adapters/i18n.adapter.ts#L25)

Built-in adapter for nestjs-i18n.
Wraps I18nService from the nestjs-i18n package.

#### Implements

- [`I18nAdapter`](#i18nadapter)

#### Constructors

##### Constructor

```ts
new NestI18nAdapter(i18nService): NestI18nAdapter;
```

Defined in: [src/adapters/i18n.adapter.ts:26](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/adapters/i18n.adapter.ts#L26)

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

Defined in: [src/adapters/i18n.adapter.ts:41](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/adapters/i18n.adapter.ts#L41)

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

Defined in: [src/adapters/i18n.adapter.ts:28](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/adapters/i18n.adapter.ts#L28)

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

Defined in: [src/dto/response.dto.ts:3](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L3)

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

Defined in: [src/dto/response.dto.ts:8](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L8)

##### last

```ts
last: string | null;
```

Defined in: [src/dto/response.dto.ts:17](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L17)

##### next

```ts
next: string | null;
```

Defined in: [src/dto/response.dto.ts:14](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L14)

##### prev

```ts
prev: string | null;
```

Defined in: [src/dto/response.dto.ts:11](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L11)

##### self

```ts
self: string;
```

Defined in: [src/dto/response.dto.ts:5](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L5)

***

### PaginationMetaDto

Defined in: [src/dto/response.dto.ts:20](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L20)

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

Defined in: [src/dto/response.dto.ts:37](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L37)

##### hasPrev

```ts
hasPrev: boolean;
```

Defined in: [src/dto/response.dto.ts:40](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L40)

##### limit

```ts
limit: number;
```

Defined in: [src/dto/response.dto.ts:28](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L28)

##### links?

```ts
optional links?: PaginationLinksDto;
```

Defined in: [src/dto/response.dto.ts:43](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L43)

##### page

```ts
page: number;
```

Defined in: [src/dto/response.dto.ts:25](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L25)

##### total

```ts
total: number;
```

Defined in: [src/dto/response.dto.ts:31](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L31)

##### totalPages

```ts
totalPages: number;
```

Defined in: [src/dto/response.dto.ts:34](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L34)

##### type?

```ts
optional type?: "offset";
```

Defined in: [src/dto/response.dto.ts:22](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L22)

***

### ProblemDetailsDto

Defined in: [src/dto/response.dto.ts:223](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L223)

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

Defined in: [src/dto/response.dto.ts:240](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L240)

##### detail

```ts
detail: string;
```

Defined in: [src/dto/response.dto.ts:234](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L234)

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/dto/response.dto.ts:246](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L246)

##### instance

```ts
instance: string;
```

Defined in: [src/dto/response.dto.ts:237](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L237)

##### meta?

```ts
optional meta?: ErrorResponseMetaDto;
```

Defined in: [src/dto/response.dto.ts:249](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L249)

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/dto/response.dto.ts:243](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L243)

##### status

```ts
status: number;
```

Defined in: [src/dto/response.dto.ts:231](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L231)

##### title

```ts
title: string;
```

Defined in: [src/dto/response.dto.ts:228](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L228)

##### type

```ts
type: string;
```

Defined in: [src/dto/response.dto.ts:225](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L225)

***

### RateLimitMetaDto

Defined in: [src/dto/response.dto.ts:104](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L104)

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

Defined in: [src/dto/response.dto.ts:106](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L106)

##### remaining

```ts
remaining: number;
```

Defined in: [src/dto/response.dto.ts:109](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L109)

##### reset

```ts
reset: number;
```

Defined in: [src/dto/response.dto.ts:112](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L112)

##### retryAfter?

```ts
optional retryAfter?: number;
```

Defined in: [src/dto/response.dto.ts:115](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L115)

***

### ResponseMetaDto

Defined in: [src/dto/response.dto.ts:119](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L119)

#### Constructors

##### Constructor

```ts
new ResponseMetaDto(): ResponseMetaDto;
```

###### Returns

[`ResponseMetaDto`](#responsemetadto)

#### Properties

##### deprecation?

```ts
optional deprecation?: DeprecationMetaDto;
```

Defined in: [src/dto/response.dto.ts:141](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L141)

##### filters?

```ts
optional filters?: Record<string, unknown>;
```

Defined in: [src/dto/response.dto.ts:138](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L138)

##### message?

```ts
optional message?: string;
```

Defined in: [src/dto/response.dto.ts:129](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L129)

##### pagination?

```ts
optional pagination?: 
  | PaginationMetaDto
  | CursorPaginationMetaDto;
```

Defined in: [src/dto/response.dto.ts:126](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L126)

##### rateLimit?

```ts
optional rateLimit?: RateLimitMetaDto;
```

Defined in: [src/dto/response.dto.ts:144](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L144)

##### responseTime?

```ts
optional responseTime?: number;
```

Defined in: [src/dto/response.dto.ts:132](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L132)

##### sort?

```ts
optional sort?: SortMetaDto;
```

Defined in: [src/dto/response.dto.ts:135](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L135)

***

### SafeErrorResponseDto

Defined in: [src/dto/response.dto.ts:200](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L200)

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

Defined in: [src/dto/response.dto.ts:211](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L211)

##### meta?

```ts
optional meta?: ErrorResponseMetaDto;
```

Defined in: [src/dto/response.dto.ts:214](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L214)

##### path?

```ts
optional path?: string;
```

Defined in: [src/dto/response.dto.ts:220](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L220)

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/dto/response.dto.ts:208](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L208)

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/dto/response.dto.ts:205](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L205)

##### success

```ts
success: false;
```

Defined in: [src/dto/response.dto.ts:202](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L202)

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/dto/response.dto.ts:217](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L217)

***

### SafeExceptionFilter

Defined in: [src/filters/safe-exception.filter.ts:63](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/filters/safe-exception.filter.ts#L63)

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

Defined in: [src/filters/safe-exception.filter.ts:68](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/filters/safe-exception.filter.ts#L68)

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

Defined in: [src/filters/safe-exception.filter.ts:92](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/filters/safe-exception.filter.ts#L92)

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

Defined in: [src/interceptors/safe-response.interceptor.ts:60](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interceptors/safe-response.interceptor.ts#L60)

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

Defined in: [src/interceptors/safe-response.interceptor.ts:65](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interceptors/safe-response.interceptor.ts#L65)

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

Defined in: [src/interceptors/safe-response.interceptor.ts:80](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interceptors/safe-response.interceptor.ts#L80)

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

Defined in: [src/safe-response.module.ts:12](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/safe-response.module.ts#L12)

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

Defined in: [src/safe-response.module.ts:16](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/safe-response.module.ts#L16)

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

Defined in: [src/safe-response.module.ts:27](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/safe-response.module.ts#L27)

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

Defined in: [src/safe-response.module.ts:48](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/safe-response.module.ts#L48)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`SafeResponseModuleAsyncOptions`](#saferesponsemoduleasyncoptions) |

###### Returns

`DynamicModule`

***

### SafeSuccessResponseDto

Defined in: [src/dto/response.dto.ts:147](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L147)

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

Defined in: [src/dto/response.dto.ts:155](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L155)

##### data

```ts
data: unknown;
```

Defined in: [src/dto/response.dto.ts:161](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L161)

##### meta?

```ts
optional meta?: ResponseMetaDto;
```

Defined in: [src/dto/response.dto.ts:164](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L164)

##### path?

```ts
optional path?: string;
```

Defined in: [src/dto/response.dto.ts:170](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L170)

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/dto/response.dto.ts:158](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L158)

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/dto/response.dto.ts:152](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L152)

##### success

```ts
success: true;
```

Defined in: [src/dto/response.dto.ts:149](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L149)

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/dto/response.dto.ts:167](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L167)

***

### SortMetaDto

Defined in: [src/dto/response.dto.ts:69](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L69)

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

Defined in: [src/dto/response.dto.ts:71](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L71)

##### order

```ts
order: "asc" | "desc";
```

Defined in: [src/dto/response.dto.ts:74](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/dto/response.dto.ts#L74)

## Interfaces

### ApiSafeErrorResponseOptions

Defined in: [src/interfaces/index.ts:237](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L237)

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:241](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L241)

Override the auto-resolved error code from DEFAULT_ERROR_CODE_MAP

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/index.ts:239](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L239)

Description shown in Swagger UI

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/interfaces/index.ts:245](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L245)

Example details value (type is inferred: array → array schema, object → object schema)

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:243](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L243)

Example error message

***

### ContextOptions

Defined in: [src/interfaces/index.ts:10](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L10)

#### Properties

##### fields?

```ts
optional fields?: Record<string, string>;
```

Defined in: [src/interfaces/index.ts:12](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L12)

Map CLS store keys to response meta fields. Key = meta field name, Value = CLS store key.

##### resolver?

```ts
optional resolver?: (store) => Record<string, unknown>;
```

Defined in: [src/interfaces/index.ts:14](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L14)

Custom resolver function. Receives the CLS service instance and returns fields to inject.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `store` | `unknown` |

###### Returns

`Record`\<`string`, `unknown`\>

***

### CursorPaginatedOptions

Defined in: [src/interfaces/index.ts:222](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L222)

#### Properties

##### links?

```ts
optional links?: boolean;
```

Defined in: [src/interfaces/index.ts:225](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L225)

Generate HATEOAS navigation links in pagination meta. Default: false

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [src/interfaces/index.ts:223](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L223)

***

### CursorPaginatedResult

Defined in: [src/interfaces/index.ts:228](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L228)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

##### data

```ts
data: T[];
```

Defined in: [src/interfaces/index.ts:229](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L229)

##### hasMore

```ts
hasMore: boolean;
```

Defined in: [src/interfaces/index.ts:232](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L232)

##### limit

```ts
limit: number;
```

Defined in: [src/interfaces/index.ts:233](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L233)

##### nextCursor

```ts
nextCursor: string | null;
```

Defined in: [src/interfaces/index.ts:230](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L230)

##### previousCursor?

```ts
optional previousCursor?: string | null;
```

Defined in: [src/interfaces/index.ts:231](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L231)

##### totalCount?

```ts
optional totalCount?: number;
```

Defined in: [src/interfaces/index.ts:234](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L234)

***

### CursorPaginationMeta

Defined in: [src/interfaces/index.ts:143](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L143)

#### Properties

##### hasMore

```ts
hasMore: boolean;
```

Defined in: [src/interfaces/index.ts:147](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L147)

##### limit

```ts
limit: number;
```

Defined in: [src/interfaces/index.ts:148](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L148)

##### links?

```ts
optional links?: PaginationLinks;
```

Defined in: [src/interfaces/index.ts:150](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L150)

##### nextCursor

```ts
nextCursor: string | null;
```

Defined in: [src/interfaces/index.ts:145](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L145)

##### previousCursor

```ts
previousCursor: string | null;
```

Defined in: [src/interfaces/index.ts:146](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L146)

##### totalCount?

```ts
optional totalCount?: number;
```

Defined in: [src/interfaces/index.ts:149](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L149)

##### type

```ts
type: "cursor";
```

Defined in: [src/interfaces/index.ts:144](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L144)

***

### DeprecatedOptions

Defined in: [src/interfaces/index.ts:19](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L19)

#### Properties

##### link?

```ts
optional link?: string;
```

Defined in: [src/interfaces/index.ts:27](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L27)

URL of the successor endpoint or migration guide

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:25](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L25)

Human-readable deprecation message for API consumers

##### since?

```ts
optional since?: string | Date;
```

Defined in: [src/interfaces/index.ts:21](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L21)

Date when the endpoint was deprecated (ISO string or Date object)

##### sunset?

```ts
optional sunset?: string | Date;
```

Defined in: [src/interfaces/index.ts:23](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L23)

Date when the endpoint will be removed (ISO string or Date object)

***

### DeprecationMeta

Defined in: [src/interfaces/index.ts:30](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L30)

#### Properties

##### deprecated

```ts
deprecated: true;
```

Defined in: [src/interfaces/index.ts:31](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L31)

##### link?

```ts
optional link?: string;
```

Defined in: [src/interfaces/index.ts:35](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L35)

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:34](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L34)

##### since?

```ts
optional since?: string;
```

Defined in: [src/interfaces/index.ts:32](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L32)

##### sunset?

```ts
optional sunset?: string;
```

Defined in: [src/interfaces/index.ts:33](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L33)

***

### ErrorCodeMapperContext

Defined in: [src/interfaces/index.ts:50](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L50)

#### Properties

##### defaultCode

```ts
defaultCode: string;
```

Defined in: [src/interfaces/index.ts:54](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L54)

Default code from errorCodes option or DEFAULT_ERROR_CODE_MAP

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/interfaces/index.ts:52](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L52)

Resolved HTTP status code

***

### I18nAdapter

Defined in: [src/adapters/i18n.adapter.ts:5](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/adapters/i18n.adapter.ts#L5)

Interface for i18n adapters.
Implementations bridge the gap between @nestarc/safe-response and i18n libraries.

#### Methods

##### resolveLanguage()

```ts
resolveLanguage(request): string;
```

Defined in: [src/adapters/i18n.adapter.ts:9](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/adapters/i18n.adapter.ts#L9)

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

Defined in: [src/adapters/i18n.adapter.ts:7](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/adapters/i18n.adapter.ts#L7)

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

Defined in: [src/adapters/i18n.adapter.ts:17](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/adapters/i18n.adapter.ts#L17)

Minimal interface for nestjs-i18n's I18nService.
Requires only the `translate()` method, making it structurally compatible
with nestjs-i18n v10+ without importing the package at compile time.

#### Methods

##### translate()

```ts
translate(key, options?): unknown;
```

Defined in: [src/adapters/i18n.adapter.ts:18](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/adapters/i18n.adapter.ts#L18)

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

Defined in: [src/interfaces/index.ts:209](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L209)

#### Properties

##### links?

```ts
optional links?: boolean;
```

Defined in: [src/interfaces/index.ts:212](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L212)

Generate HATEOAS navigation links in pagination meta. Default: false

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [src/interfaces/index.ts:210](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L210)

***

### PaginatedResult

Defined in: [src/interfaces/index.ts:215](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L215)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

##### data

```ts
data: T[];
```

Defined in: [src/interfaces/index.ts:216](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L216)

##### limit

```ts
limit: number;
```

Defined in: [src/interfaces/index.ts:219](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L219)

##### page

```ts
page: number;
```

Defined in: [src/interfaces/index.ts:218](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L218)

##### total

```ts
total: number;
```

Defined in: [src/interfaces/index.ts:217](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L217)

***

### PaginationLinks

Defined in: [src/interfaces/index.ts:201](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L201)

#### Properties

##### first

```ts
first: string;
```

Defined in: [src/interfaces/index.ts:203](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L203)

##### last

```ts
last: string | null;
```

Defined in: [src/interfaces/index.ts:206](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L206)

##### next

```ts
next: string | null;
```

Defined in: [src/interfaces/index.ts:205](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L205)

##### prev

```ts
prev: string | null;
```

Defined in: [src/interfaces/index.ts:204](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L204)

##### self

```ts
self: string;
```

Defined in: [src/interfaces/index.ts:202](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L202)

***

### PaginationMeta

Defined in: [src/interfaces/index.ts:132](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L132)

#### Properties

##### hasNext

```ts
hasNext: boolean;
```

Defined in: [src/interfaces/index.ts:138](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L138)

##### hasPrev

```ts
hasPrev: boolean;
```

Defined in: [src/interfaces/index.ts:139](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L139)

##### limit

```ts
limit: number;
```

Defined in: [src/interfaces/index.ts:135](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L135)

##### links?

```ts
optional links?: PaginationLinks;
```

Defined in: [src/interfaces/index.ts:140](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L140)

##### page

```ts
page: number;
```

Defined in: [src/interfaces/index.ts:134](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L134)

##### total

```ts
total: number;
```

Defined in: [src/interfaces/index.ts:136](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L136)

##### totalPages

```ts
totalPages: number;
```

Defined in: [src/interfaces/index.ts:137](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L137)

##### type?

```ts
optional type?: "offset";
```

Defined in: [src/interfaces/index.ts:133](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L133)

***

### ProblemDetailsOptions

Defined in: [src/interfaces/index.ts:95](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L95)

#### Properties

##### baseUrl?

```ts
optional baseUrl?: string;
```

Defined in: [src/interfaces/index.ts:97](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L97)

Base URL for problem type URIs (e.g., 'https://api.example.com/problems')

***

### RateLimitMeta

Defined in: [src/interfaces/index.ts:43](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L43)

#### Properties

##### limit

```ts
limit: number;
```

Defined in: [src/interfaces/index.ts:44](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L44)

##### remaining

```ts
remaining: number;
```

Defined in: [src/interfaces/index.ts:45](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L45)

##### reset

```ts
reset: number;
```

Defined in: [src/interfaces/index.ts:46](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L46)

##### retryAfter?

```ts
optional retryAfter?: number;
```

Defined in: [src/interfaces/index.ts:47](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L47)

***

### RateLimitOptions

Defined in: [src/interfaces/index.ts:38](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L38)

#### Properties

##### headerPrefix?

```ts
optional headerPrefix?: string;
```

Defined in: [src/interfaces/index.ts:40](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L40)

Header name prefix (default: 'X-RateLimit'). Headers read: {prefix}-Limit, {prefix}-Remaining, {prefix}-Reset

***

### RequestIdOptions

Defined in: [src/interfaces/index.ts:3](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L3)

#### Properties

##### generator?

```ts
optional generator?: () => string;
```

Defined in: [src/interfaces/index.ts:7](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L7)

Custom ID generator (default: crypto.randomUUID())

###### Returns

`string`

##### headerName?

```ts
optional headerName?: string;
```

Defined in: [src/interfaces/index.ts:5](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L5)

Custom header name (default: 'X-Request-Id')

***

### ResponseMeta

Defined in: [src/interfaces/index.ts:158](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L158)

#### Indexable

```ts
[key: string]: unknown
```

Additional context fields (e.g., traceId, correlationId)

#### Properties

##### deprecation?

```ts
optional deprecation?: DeprecationMeta;
```

Defined in: [src/interfaces/index.ts:164](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L164)

##### filters?

```ts
optional filters?: Record<string, unknown>;
```

Defined in: [src/interfaces/index.ts:163](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L163)

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:160](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L160)

##### pagination?

```ts
optional pagination?: 
  | PaginationMeta
  | CursorPaginationMeta;
```

Defined in: [src/interfaces/index.ts:159](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L159)

##### rateLimit?

```ts
optional rateLimit?: RateLimitMeta;
```

Defined in: [src/interfaces/index.ts:165](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L165)

##### responseTime?

```ts
optional responseTime?: number;
```

Defined in: [src/interfaces/index.ts:161](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L161)

##### sort?

```ts
optional sort?: SortInfo;
```

Defined in: [src/interfaces/index.ts:162](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L162)

***

### SafeCursorPaginatedEndpointOptions

Defined in: [src/interfaces/index.ts:306](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L306)

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:320](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L320)

Custom success code

##### deprecated?

```ts
optional deprecated?: DeprecatedOptions;
```

Defined in: [src/interfaces/index.ts:324](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L324)

Mark endpoint as deprecated with RFC headers

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/index.ts:316](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L316)

Swagger response description

##### errors?

```ts
optional errors?: ApiSafeErrorResponseConfig[];
```

Defined in: [src/interfaces/index.ts:322](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L322)

Error responses to document in Swagger

##### filter?

```ts
optional filter?: boolean;
```

Defined in: [src/interfaces/index.ts:314](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L314)

Include filter metadata (default: false)

##### links?

```ts
optional links?: boolean;
```

Defined in: [src/interfaces/index.ts:310](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L310)

Generate HATEOAS navigation links (default: false)

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [src/interfaces/index.ts:308](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L308)

Maximum items per page

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:318](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L318)

Custom response message in meta

##### problemDetails?

```ts
optional problemDetails?: boolean;
```

Defined in: [src/interfaces/index.ts:330](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L330)

Use RFC 9457 Problem Details schema for error responses in Swagger (default: false).
**Note:** This only controls Swagger documentation schema. The actual runtime error format
is determined by the module-level `problemDetails` option. Keep both in sync.

##### sort?

```ts
optional sort?: boolean;
```

Defined in: [src/interfaces/index.ts:312](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L312)

Include sort metadata (default: false)

***

### SafeEndpointOptions

Defined in: [src/interfaces/index.ts:252](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L252)

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:266](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L266)

Custom success code

##### deprecated?

```ts
optional deprecated?: DeprecatedOptions;
```

Defined in: [src/interfaces/index.ts:270](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L270)

Mark endpoint as deprecated with RFC headers

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/index.ts:258](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L258)

Swagger response description

##### errors?

```ts
optional errors?: ApiSafeErrorResponseConfig[];
```

Defined in: [src/interfaces/index.ts:268](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L268)

Error responses to document in Swagger

##### filter?

```ts
optional filter?: boolean;
```

Defined in: [src/interfaces/index.ts:262](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L262)

Include filter metadata from handler return value (default: false)

##### isArray?

```ts
optional isArray?: boolean;
```

Defined in: [src/interfaces/index.ts:256](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L256)

Whether data is an array (default: false)

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:264](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L264)

Custom response message in meta

##### problemDetails?

```ts
optional problemDetails?: boolean;
```

Defined in: [src/interfaces/index.ts:276](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L276)

Use RFC 9457 Problem Details schema for error responses in Swagger (default: false).
**Note:** This only controls Swagger documentation schema. The actual runtime error format
is determined by the module-level `problemDetails` option. Keep both in sync.

##### sort?

```ts
optional sort?: boolean;
```

Defined in: [src/interfaces/index.ts:260](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L260)

Include sort metadata from handler return value (default: false)

##### statusCode?

```ts
optional statusCode?: number;
```

Defined in: [src/interfaces/index.ts:254](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L254)

HTTP status code for Swagger response (default: 200)

***

### SafeErrorResponse

Defined in: [src/interfaces/index.ts:181](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L181)

#### Properties

##### error

```ts
error: {
  code: string;
  details?: unknown;
  message: string;
};
```

Defined in: [src/interfaces/index.ts:185](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L185)

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

Defined in: [src/interfaces/index.ts:190](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L190)

###### Index Signature

```ts
[key: string]: unknown
```

Additional context fields (e.g., traceId, correlationId)

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

Defined in: [src/interfaces/index.ts:198](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L198)

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/interfaces/index.ts:184](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L184)

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/interfaces/index.ts:183](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L183)

##### success

```ts
success: false;
```

Defined in: [src/interfaces/index.ts:182](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L182)

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/interfaces/index.ts:197](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L197)

***

### SafePaginatedEndpointOptions

Defined in: [src/interfaces/index.ts:279](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L279)

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:293](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L293)

Custom success code

##### deprecated?

```ts
optional deprecated?: DeprecatedOptions;
```

Defined in: [src/interfaces/index.ts:297](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L297)

Mark endpoint as deprecated with RFC headers

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/index.ts:289](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L289)

Swagger response description

##### errors?

```ts
optional errors?: ApiSafeErrorResponseConfig[];
```

Defined in: [src/interfaces/index.ts:295](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L295)

Error responses to document in Swagger

##### filter?

```ts
optional filter?: boolean;
```

Defined in: [src/interfaces/index.ts:287](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L287)

Include filter metadata from handler return value (default: false)

##### links?

```ts
optional links?: boolean;
```

Defined in: [src/interfaces/index.ts:283](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L283)

Generate HATEOAS navigation links (default: false)

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [src/interfaces/index.ts:281](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L281)

Maximum items per page (clamped via PaginatedOptions.maxLimit)

##### message?

```ts
optional message?: string;
```

Defined in: [src/interfaces/index.ts:291](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L291)

Custom response message in meta

##### problemDetails?

```ts
optional problemDetails?: boolean;
```

Defined in: [src/interfaces/index.ts:303](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L303)

Use RFC 9457 Problem Details schema for error responses in Swagger (default: false).
**Note:** This only controls Swagger documentation schema. The actual runtime error format
is determined by the module-level `problemDetails` option. Keep both in sync.

##### sort?

```ts
optional sort?: boolean;
```

Defined in: [src/interfaces/index.ts:285](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L285)

Include sort metadata from handler return value (default: false)

***

### SafeProblemDetailsResponse

Defined in: [src/interfaces/index.ts:100](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L100)

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:107](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L107)

Extension member: machine-readable error code

##### detail

```ts
detail: string;
```

Defined in: [src/interfaces/index.ts:104](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L104)

##### details?

```ts
optional details?: unknown;
```

Defined in: [src/interfaces/index.ts:111](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L111)

Extension member: validation error details

##### instance

```ts
instance: string;
```

Defined in: [src/interfaces/index.ts:105](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L105)

##### meta?

```ts
optional meta?: {
[key: string]: unknown;
  deprecation?: DeprecationMeta;
  rateLimit?: RateLimitMeta;
  responseTime?: number;
};
```

Defined in: [src/interfaces/index.ts:113](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L113)

Extension member: response time and context

###### Index Signature

```ts
[key: string]: unknown
```

Additional context fields (e.g., traceId, correlationId)

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

Defined in: [src/interfaces/index.ts:109](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L109)

Extension member: request tracking ID

##### status

```ts
status: number;
```

Defined in: [src/interfaces/index.ts:103](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L103)

##### title

```ts
title: string;
```

Defined in: [src/interfaces/index.ts:102](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L102)

##### type

```ts
type: string;
```

Defined in: [src/interfaces/index.ts:101](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L101)

***

### SafeResponseModuleAsyncOptions

Defined in: [src/interfaces/index.ts:122](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L122)

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

Defined in: [src/interfaces/index.ts:129](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L129)

##### useFactory

```ts
useFactory: (...args) => 
  | SafeResponseModuleOptions
| Promise<SafeResponseModuleOptions>;
```

Defined in: [src/interfaces/index.ts:124](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L124)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`SafeResponseModuleOptions`](#saferesponsemoduleoptions)
  \| `Promise`\<[`SafeResponseModuleOptions`](#saferesponsemoduleoptions)\>

***

### SafeResponseModuleOptions

Defined in: [src/interfaces/index.ts:62](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L62)

#### Properties

##### context?

```ts
optional context?: ContextOptions;
```

Defined in: [src/interfaces/index.ts:84](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L84)

Inject request context values (e.g., traceId) into response meta. Requires nestjs-cls.

##### dateFormatter?

```ts
optional dateFormatter?: () => string;
```

Defined in: [src/interfaces/index.ts:70](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L70)

Custom date formatter function (default: ISO 8601)

###### Returns

`string`

##### errorCodeMapper?

```ts
optional errorCodeMapper?: (exception, context?) => string | undefined;
```

Defined in: [src/interfaces/index.ts:68](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L68)

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

Defined in: [src/interfaces/index.ts:92](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L92)

Declarative error code map. Merged on top of DEFAULT_ERROR_CODE_MAP. Use for simple status-to-code mappings.

##### i18n?

```ts
optional i18n?: boolean | I18nAdapter;
```

Defined in: [src/interfaces/index.ts:86](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L86)

Enable i18n for error/success messages. true = auto-detect nestjs-i18n, or pass a custom I18nAdapter.

##### path?

```ts
optional path?: boolean;
```

Defined in: [src/interfaces/index.ts:66](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L66)

Include path field in responses (default: true)

##### problemDetails?

```ts
optional problemDetails?: boolean | ProblemDetailsOptions;
```

Defined in: [src/interfaces/index.ts:80](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L80)

Enable RFC 9457 Problem Details format for error responses. Default: false

##### rateLimit?

```ts
optional rateLimit?: boolean | RateLimitOptions;
```

Defined in: [src/interfaces/index.ts:88](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L88)

Mirror rate limit response headers into meta.rateLimit. true uses defaults, or pass options object.

##### requestId?

```ts
optional requestId?: boolean | RequestIdOptions;
```

Defined in: [src/interfaces/index.ts:76](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L76)

Enable request ID tracking. true uses defaults, or pass options object.

##### responseTime?

```ts
optional responseTime?: boolean;
```

Defined in: [src/interfaces/index.ts:78](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L78)

Include response time in meta (milliseconds). Default: false

##### successCodeMapper?

```ts
optional successCodeMapper?: (statusCode) => string | undefined;
```

Defined in: [src/interfaces/index.ts:72](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L72)

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

Defined in: [src/interfaces/index.ts:90](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L90)

Suppress shape-mismatch warnings for @Paginated, @CursorPaginated, @SortMeta, @FilterMeta. Default: false

##### swagger?

```ts
optional swagger?: SwaggerOptions;
```

Defined in: [src/interfaces/index.ts:82](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L82)

Swagger documentation options

##### timestamp?

```ts
optional timestamp?: boolean;
```

Defined in: [src/interfaces/index.ts:64](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L64)

Include timestamp field in responses (default: true)

##### transformResponse?

```ts
optional transformResponse?: (data) => unknown;
```

Defined in: [src/interfaces/index.ts:74](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L74)

Transform data before wrapping (sync only, runs before pagination check)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `unknown` |

###### Returns

`unknown`

***

### SafeSuccessResponse

Defined in: [src/interfaces/index.ts:170](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L170)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Properties

##### code?

```ts
optional code?: string;
```

Defined in: [src/interfaces/index.ts:173](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L173)

##### data

```ts
data: T;
```

Defined in: [src/interfaces/index.ts:175](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L175)

##### meta?

```ts
optional meta?: ResponseMeta;
```

Defined in: [src/interfaces/index.ts:176](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L176)

##### path?

```ts
optional path?: string;
```

Defined in: [src/interfaces/index.ts:178](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L178)

##### requestId?

```ts
optional requestId?: string;
```

Defined in: [src/interfaces/index.ts:174](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L174)

##### statusCode

```ts
statusCode: number;
```

Defined in: [src/interfaces/index.ts:172](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L172)

##### success

```ts
success: true;
```

Defined in: [src/interfaces/index.ts:171](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L171)

##### timestamp?

```ts
optional timestamp?: string;
```

Defined in: [src/interfaces/index.ts:177](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L177)

***

### SortInfo

Defined in: [src/interfaces/index.ts:153](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L153)

#### Properties

##### field

```ts
field: string;
```

Defined in: [src/interfaces/index.ts:154](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L154)

##### order

```ts
order: "asc" | "desc";
```

Defined in: [src/interfaces/index.ts:155](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L155)

***

### SwaggerOptions

Defined in: [src/interfaces/index.ts:57](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L57)

#### Properties

##### globalErrors?

```ts
optional globalErrors?: ApiSafeErrorResponseConfig[];
```

Defined in: [src/interfaces/index.ts:59](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L59)

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

Defined in: [src/interfaces/index.ts:248](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/interfaces/index.ts#L248)

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

Defined in: [src/constants.ts:39](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L39)

#### Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-400"></a> `400` | `"BAD_REQUEST"` | `'BAD_REQUEST'` | [src/constants.ts:40](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L40) |
| <a id="property-401"></a> `401` | `"UNAUTHORIZED"` | `'UNAUTHORIZED'` | [src/constants.ts:41](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L41) |
| <a id="property-403"></a> `403` | `"FORBIDDEN"` | `'FORBIDDEN'` | [src/constants.ts:42](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L42) |
| <a id="property-404"></a> `404` | `"NOT_FOUND"` | `'NOT_FOUND'` | [src/constants.ts:43](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L43) |
| <a id="property-405"></a> `405` | `"METHOD_NOT_ALLOWED"` | `'METHOD_NOT_ALLOWED'` | [src/constants.ts:44](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L44) |
| <a id="property-409"></a> `409` | `"CONFLICT"` | `'CONFLICT'` | [src/constants.ts:45](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L45) |
| <a id="property-422"></a> `422` | `"UNPROCESSABLE_ENTITY"` | `'UNPROCESSABLE_ENTITY'` | [src/constants.ts:46](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L46) |
| <a id="property-429"></a> `429` | `"TOO_MANY_REQUESTS"` | `'TOO_MANY_REQUESTS'` | [src/constants.ts:47](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L47) |
| <a id="property-500"></a> `500` | `"INTERNAL_SERVER_ERROR"` | `'INTERNAL_SERVER_ERROR'` | [src/constants.ts:48](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L48) |
| <a id="property-502"></a> `502` | `"BAD_GATEWAY"` | `'BAD_GATEWAY'` | [src/constants.ts:49](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L49) |
| <a id="property-503"></a> `503` | `"SERVICE_UNAVAILABLE"` | `'SERVICE_UNAVAILABLE'` | [src/constants.ts:50](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L50) |

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

Defined in: [src/constants.ts:25](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L25)

#### Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-400-1"></a> `400` | `"Bad Request"` | `'Bad Request'` | [src/constants.ts:26](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L26) |
| <a id="property-401-1"></a> `401` | `"Unauthorized"` | `'Unauthorized'` | [src/constants.ts:27](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L27) |
| <a id="property-403-1"></a> `403` | `"Forbidden"` | `'Forbidden'` | [src/constants.ts:28](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L28) |
| <a id="property-404-1"></a> `404` | `"Not Found"` | `'Not Found'` | [src/constants.ts:29](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L29) |
| <a id="property-405-1"></a> `405` | `"Method Not Allowed"` | `'Method Not Allowed'` | [src/constants.ts:30](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L30) |
| <a id="property-409-1"></a> `409` | `"Conflict"` | `'Conflict'` | [src/constants.ts:31](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L31) |
| <a id="property-422-1"></a> `422` | `"Unprocessable Entity"` | `'Unprocessable Entity'` | [src/constants.ts:32](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L32) |
| <a id="property-429-1"></a> `429` | `"Too Many Requests"` | `'Too Many Requests'` | [src/constants.ts:33](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L33) |
| <a id="property-500-1"></a> `500` | `"Internal Server Error"` | `'Internal Server Error'` | [src/constants.ts:34](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L34) |
| <a id="property-502-1"></a> `502` | `"Bad Gateway"` | `'Bad Gateway'` | [src/constants.ts:35](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L35) |
| <a id="property-503-1"></a> `503` | `"Service Unavailable"` | `'Service Unavailable'` | [src/constants.ts:36](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L36) |

## Functions

### ApiCursorPaginatedSafeResponse()

```ts
function ApiCursorPaginatedSafeResponse<T>(model, options?): MethodDecorator;
```

Defined in: [src/decorators/index.ts:218](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L218)

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

Defined in: [src/decorators/index.ts:80](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L80)

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

Defined in: [src/decorators/index.ts:149](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L149)

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

Defined in: [src/decorators/index.ts:204](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L204)

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

Defined in: [src/decorators/index.ts:338](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L338)

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

Defined in: [src/decorators/index.ts:45](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L45)

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

Defined in: [src/swagger/global-errors.ts:44](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/swagger/global-errors.ts#L44)

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

Defined in: [src/decorators/index.ts:268](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L268)

Enable cursor-based pagination metadata auto-calculation.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`CursorPaginatedOptions`](#cursorpaginatedoptions) |

#### Returns

`CustomDecorator`\<`string`\>

***

### Deprecated()

```ts
function Deprecated(options?): <TFunction, Y>(target, propertyKey?, descriptor?) => void;
```

Defined in: [src/decorators/index.ts:325](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L325)

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

### FilterMeta()

```ts
function FilterMeta(): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:300](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L300)

Include filter metadata in the response meta.
The handler must return a `filters` field in the paginated result.

#### Returns

`CustomDecorator`\<`string`\>

***

### lookupErrorCode()

```ts
function lookupErrorCode(statusCode): string | undefined;
```

Defined in: [src/constants.ts:54](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L54)

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

Defined in: [src/constants.ts:59](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/constants.ts#L59)

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

Defined in: [src/decorators/index.ts:262](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L262)

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

Defined in: [src/decorators/index.ts:287](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L287)

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

Defined in: [src/decorators/index.ts:257](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L257)

Skip response wrapping for this route.

#### Returns

`CustomDecorator`\<`string`\>

***

### ResponseMessage()

```ts
function ResponseMessage(message): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:274](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L274)

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

Defined in: [src/decorators/index.ts:436](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L436)

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

Defined in: [src/decorators/index.ts:379](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L379)

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

Defined in: [src/decorators/index.ts:407](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L407)

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

Defined in: [src/decorators/index.ts:23](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L23)

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

Defined in: [src/decorators/index.ts:306](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L306)

Skip global error responses for this route.
Use on health checks, public endpoints, etc. that should not inherit global error documentation.

#### Returns

\<`TFunction`, `Y`\>(`target`, `propertyKey?`, `descriptor?`) => `void`

***

### SortMeta()

```ts
function SortMeta(): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:294](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L294)

Include sort metadata in the response meta.
The handler must return a `sort` field in the paginated result.

#### Returns

`CustomDecorator`\<`string`\>

***

### SuccessCode()

```ts
function SuccessCode(code): CustomDecorator<string>;
```

Defined in: [src/decorators/index.ts:281](https://github.com/nestarc/nestjs-safe-response/blob/0a34f29e063056187f72cec5d2adbc14580e45f9/src/decorators/index.ts#L281)

Set a custom success code for this route (method-level only).
Takes priority over successCodeMapper module option.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | `string` |

#### Returns

`CustomDecorator`\<`string`\>
