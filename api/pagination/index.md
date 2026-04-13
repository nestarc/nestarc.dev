# index

## Classes

### InvalidCursorError

Defined in: [src/errors/invalid-cursor.error.ts:3](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/errors/invalid-cursor.error.ts#L3)

#### Extends

- `BadRequestException`

#### Constructors

##### Constructor

```ts
new InvalidCursorError(cursor): InvalidCursorError;
```

Defined in: [src/errors/invalid-cursor.error.ts:4](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/errors/invalid-cursor.error.ts#L4)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `cursor` | `string` |

###### Returns

[`InvalidCursorError`](#invalidcursorerror)

###### Overrides

```ts
BadRequestException.constructor
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
BadRequestException.cause
```

##### message

```ts
message: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1075

###### Inherited from

```ts
BadRequestException.message
```

##### name

```ts
name: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1074

###### Inherited from

```ts
BadRequestException.name
```

##### stack?

```ts
optional stack?: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

```ts
BadRequestException.stack
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
BadRequestException.createBody
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
BadRequestException.createBody
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
BadRequestException.createBody
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
BadRequestException.extractDescriptionAndOptionsFrom
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
BadRequestException.getDescriptionFrom
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
BadRequestException.getHttpExceptionOptionsFrom
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
BadRequestException.getResponse
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
BadRequestException.getStatus
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
BadRequestException.initCause
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
BadRequestException.initMessage
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
BadRequestException.initName
```

***

### InvalidFilterColumnError

Defined in: [src/errors/invalid-filter-column.error.ts:3](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/errors/invalid-filter-column.error.ts#L3)

#### Extends

- `BadRequestException`

#### Constructors

##### Constructor

```ts
new InvalidFilterColumnError(
   column, 
   filterableColumns, 
   operator?, 
   allowedOperators?): InvalidFilterColumnError;
```

Defined in: [src/errors/invalid-filter-column.error.ts:4](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/errors/invalid-filter-column.error.ts#L4)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `column` | `string` |
| `filterableColumns` | `string`[] |
| `operator?` | `string` |
| `allowedOperators?` | `string`[] |

###### Returns

[`InvalidFilterColumnError`](#invalidfiltercolumnerror)

###### Overrides

```ts
BadRequestException.constructor
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
BadRequestException.cause
```

##### message

```ts
message: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1075

###### Inherited from

```ts
BadRequestException.message
```

##### name

```ts
name: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1074

###### Inherited from

```ts
BadRequestException.name
```

##### stack?

```ts
optional stack?: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

```ts
BadRequestException.stack
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
BadRequestException.createBody
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
BadRequestException.createBody
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
BadRequestException.createBody
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
BadRequestException.extractDescriptionAndOptionsFrom
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
BadRequestException.getDescriptionFrom
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
BadRequestException.getHttpExceptionOptionsFrom
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
BadRequestException.getResponse
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
BadRequestException.getStatus
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
BadRequestException.initCause
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
BadRequestException.initMessage
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
BadRequestException.initName
```

***

### InvalidSortColumnError

Defined in: [src/errors/invalid-sort-column.error.ts:3](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/errors/invalid-sort-column.error.ts#L3)

#### Extends

- `BadRequestException`

#### Constructors

##### Constructor

```ts
new InvalidSortColumnError(column, sortableColumns): InvalidSortColumnError;
```

Defined in: [src/errors/invalid-sort-column.error.ts:4](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/errors/invalid-sort-column.error.ts#L4)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `column` | `string` |
| `sortableColumns` | `string`[] |

###### Returns

[`InvalidSortColumnError`](#invalidsortcolumnerror)

###### Overrides

```ts
BadRequestException.constructor
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
BadRequestException.cause
```

##### message

```ts
message: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1075

###### Inherited from

```ts
BadRequestException.message
```

##### name

```ts
name: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1074

###### Inherited from

```ts
BadRequestException.name
```

##### stack?

```ts
optional stack?: string;
```

Defined in: ../../../../../../../opt/hostedtoolcache/node/18.20.8/x64/lib/node\_modules/typedoc/node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

```ts
BadRequestException.stack
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
BadRequestException.createBody
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
BadRequestException.createBody
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
BadRequestException.createBody
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
BadRequestException.extractDescriptionAndOptionsFrom
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
BadRequestException.getDescriptionFrom
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
BadRequestException.getHttpExceptionOptionsFrom
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
BadRequestException.getResponse
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
BadRequestException.getStatus
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
BadRequestException.initCause
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
BadRequestException.initMessage
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
BadRequestException.initName
```

***

### PaginateService

Defined in: [src/paginate.service.ts:12](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/paginate.service.ts#L12)

#### Constructors

##### Constructor

```ts
new PaginateService(moduleOptions?, reflector): PaginateService;
```

Defined in: [src/paginate.service.ts:13](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/paginate.service.ts#L13)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `moduleOptions` | [`PaginationModuleOptions`](#paginationmoduleoptions) |
| `reflector` | `Reflector` |

###### Returns

[`PaginateService`](#paginateservice)

#### Methods

##### paginate()

```ts
paginate<T>(
   query, 
   delegate, 
   config, 
   handler?): Promise<
  | Paginated<T>
| CursorPaginated<T>>;
```

Defined in: [src/paginate.service.ts:20](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/paginate.service.ts#L20)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `query` | [`PaginateQuery`](#paginatequery) |
| `delegate` | \{ `count`: (`args`) => `Promise`\<`number`\>; `findMany`: (`args`) => `Promise`\<`T`[]\>; \} |
| `delegate.count` | (`args`) => `Promise`\<`number`\> |
| `delegate.findMany` | (`args`) => `Promise`\<`T`[]\> |
| `config?` | [`PaginateConfig`](#paginateconfig)\<`T`\> |
| `handler?` | `Function` |

###### Returns

`Promise`\<
  \| [`Paginated`](#paginated)\<`T`\>
  \| [`CursorPaginated`](#cursorpaginated)\<`T`\>\>

***

### PaginationModule

Defined in: [src/pagination.module.ts:11](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/pagination.module.ts#L11)

#### Constructors

##### Constructor

```ts
new PaginationModule(): PaginationModule;
```

###### Returns

[`PaginationModule`](#paginationmodule)

#### Methods

##### forRoot()

```ts
static forRoot(options?): DynamicModule;
```

Defined in: [src/pagination.module.ts:12](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/pagination.module.ts#L12)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`PaginationModuleOptions`](#paginationmoduleoptions) |

###### Returns

`DynamicModule`

##### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [src/pagination.module.ts:28](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/pagination.module.ts#L28)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`PaginationModuleAsyncOptions`](#paginationmoduleasyncoptions) |

###### Returns

`DynamicModule`

## Interfaces

### CursorPaginated

Defined in: [src/interfaces/paginated.interface.ts:23](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginated.interface.ts#L23)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Properties

##### data

```ts
data: T[];
```

Defined in: [src/interfaces/paginated.interface.ts:24](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginated.interface.ts#L24)

##### links

```ts
links: {
  current: string;
  next: string | null;
  previous: string | null;
};
```

Defined in: [src/interfaces/paginated.interface.ts:36](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginated.interface.ts#L36)

###### current

```ts
current: string;
```

###### next

```ts
next: string | null;
```

###### previous

```ts
previous: string | null;
```

##### meta

```ts
meta: {
  endCursor: string | null;
  filter?: Record<string, string>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemsPerPage: number;
  search?: string;
  sortBy: [string, SortOrder][];
  startCursor: string | null;
  totalItems?: number;
};
```

Defined in: [src/interfaces/paginated.interface.ts:25](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginated.interface.ts#L25)

###### endCursor

```ts
endCursor: string | null;
```

###### filter?

```ts
optional filter?: Record<string, string>;
```

###### hasNextPage

```ts
hasNextPage: boolean;
```

###### hasPreviousPage

```ts
hasPreviousPage: boolean;
```

###### itemsPerPage

```ts
itemsPerPage: number;
```

###### search?

```ts
optional search?: string;
```

###### sortBy

```ts
sortBy: [string, SortOrder][];
```

###### startCursor

```ts
startCursor: string | null;
```

###### totalItems?

```ts
optional totalItems?: number;
```

***

### PaginateConfig

Defined in: [src/interfaces/paginate-config.interface.ts:3](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-config.interface.ts#L3)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

#### Properties

##### allowWithDeleted?

```ts
optional allowWithDeleted?: boolean;
```

Defined in: [src/interfaces/paginate-config.interface.ts:35](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-config.interface.ts#L35)

##### cursorColumn?

```ts
optional cursorColumn?: keyof T & string;
```

Defined in: [src/interfaces/paginate-config.interface.ts:29](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-config.interface.ts#L29)

Column used as cursor for cursor-based pagination. Defaults to 'id'.

Requirements:
- Must be included in `sortableColumns`
- Should have unique, sequential values (e.g., auto-increment ID, UUID v7, timestamp)
- Non-unique cursor columns may produce inconsistent results across pages

###### See

https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination

##### defaultLimit?

```ts
optional defaultLimit?: number;
```

Defined in: [src/interfaces/paginate-config.interface.ts:30](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-config.interface.ts#L30)

##### defaultSortBy?

```ts
optional defaultSortBy?: [keyof T & string, SortOrder][];
```

Defined in: [src/interfaces/paginate-config.interface.ts:6](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-config.interface.ts#L6)

##### filterableColumns?

```ts
optional filterableColumns?: { [K in string]?: FilterOperator[] };
```

Defined in: [src/interfaces/paginate-config.interface.ts:11](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-config.interface.ts#L11)

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [src/interfaces/paginate-config.interface.ts:31](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-config.interface.ts#L31)

##### nullSort?

```ts
optional nullSort?: "first" | "last";
```

Defined in: [src/interfaces/paginate-config.interface.ts:7](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-config.interface.ts#L7)

##### paginationType?

```ts
optional paginationType?: "offset" | "cursor";
```

Defined in: [src/interfaces/paginate-config.interface.ts:18](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-config.interface.ts#L18)

##### relations?

```ts
optional relations?: Record<string, boolean | object>;
```

Defined in: [src/interfaces/paginate-config.interface.ts:15](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-config.interface.ts#L15)

##### searchableColumns?

```ts
optional searchableColumns?: keyof T & string[];
```

Defined in: [src/interfaces/paginate-config.interface.ts:9](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-config.interface.ts#L9)

##### select?

```ts
optional select?: keyof T & string[];
```

Defined in: [src/interfaces/paginate-config.interface.ts:16](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-config.interface.ts#L16)

##### sortableColumns

```ts
sortableColumns: keyof T & string[];
```

Defined in: [src/interfaces/paginate-config.interface.ts:4](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-config.interface.ts#L4)

##### where?

```ts
optional where?: object;
```

Defined in: [src/interfaces/paginate-config.interface.ts:34](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-config.interface.ts#L34)

##### withTotalCount?

```ts
optional withTotalCount?: boolean;
```

Defined in: [src/interfaces/paginate-config.interface.ts:32](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-config.interface.ts#L32)

***

### Paginated

Defined in: [src/interfaces/paginated.interface.ts:3](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginated.interface.ts#L3)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Properties

##### data

```ts
data: T[];
```

Defined in: [src/interfaces/paginated.interface.ts:4](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginated.interface.ts#L4)

##### links

```ts
links: {
  current: string;
  first: string;
  last: string;
  next: string | null;
  previous: string | null;
};
```

Defined in: [src/interfaces/paginated.interface.ts:14](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginated.interface.ts#L14)

###### current

```ts
current: string;
```

###### first

```ts
first: string;
```

###### last

```ts
last: string;
```

###### next

```ts
next: string | null;
```

###### previous

```ts
previous: string | null;
```

##### meta

```ts
meta: {
  currentPage: number;
  filter?: Record<string, string>;
  itemsPerPage: number;
  search?: string;
  sortBy: [string, SortOrder][];
  totalItems: number;
  totalPages: number;
};
```

Defined in: [src/interfaces/paginated.interface.ts:5](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginated.interface.ts#L5)

###### currentPage

```ts
currentPage: number;
```

###### filter?

```ts
optional filter?: Record<string, string>;
```

###### itemsPerPage

```ts
itemsPerPage: number;
```

###### search?

```ts
optional search?: string;
```

###### sortBy

```ts
sortBy: [string, SortOrder][];
```

###### totalItems

```ts
totalItems: number;
```

###### totalPages

```ts
totalPages: number;
```

***

### PaginateDefaultsOptions

Defined in: [src/decorators/paginate-defaults.decorator.ts:6](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/decorators/paginate-defaults.decorator.ts#L6)

#### Properties

##### defaultLimit?

```ts
optional defaultLimit?: number;
```

Defined in: [src/decorators/paginate-defaults.decorator.ts:7](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/decorators/paginate-defaults.decorator.ts#L7)

##### defaultSortBy?

```ts
optional defaultSortBy?: [string, SortOrder][];
```

Defined in: [src/decorators/paginate-defaults.decorator.ts:9](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/decorators/paginate-defaults.decorator.ts#L9)

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [src/decorators/paginate-defaults.decorator.ts:8](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/decorators/paginate-defaults.decorator.ts#L8)

##### paginationType?

```ts
optional paginationType?: "offset" | "cursor";
```

Defined in: [src/decorators/paginate-defaults.decorator.ts:10](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/decorators/paginate-defaults.decorator.ts#L10)

***

### PaginateQuery

Defined in: [src/interfaces/paginate-query.interface.ts:3](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-query.interface.ts#L3)

#### Properties

##### after?

```ts
optional after?: string;
```

Defined in: [src/interfaces/paginate-query.interface.ts:14](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-query.interface.ts#L14)

##### before?

```ts
optional before?: string;
```

Defined in: [src/interfaces/paginate-query.interface.ts:15](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-query.interface.ts#L15)

##### filter?

```ts
optional filter?: Record<string, string | string[]>;
```

Defined in: [src/interfaces/paginate-query.interface.ts:7](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-query.interface.ts#L7)

##### limit?

```ts
optional limit?: number;
```

Defined in: [src/interfaces/paginate-query.interface.ts:4](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-query.interface.ts#L4)

##### page?

```ts
optional page?: number;
```

Defined in: [src/interfaces/paginate-query.interface.ts:11](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-query.interface.ts#L11)

##### path

```ts
path: string;
```

Defined in: [src/interfaces/paginate-query.interface.ts:8](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-query.interface.ts#L8)

##### search?

```ts
optional search?: string;
```

Defined in: [src/interfaces/paginate-query.interface.ts:6](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-query.interface.ts#L6)

##### sortBy?

```ts
optional sortBy?: [string, SortOrder][];
```

Defined in: [src/interfaces/paginate-query.interface.ts:5](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/paginate-query.interface.ts#L5)

***

### PaginationModuleAsyncOptions

Defined in: [src/interfaces/pagination-options.interface.ts:14](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/pagination-options.interface.ts#L14)

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

Defined in: [src/interfaces/pagination-options.interface.ts:19](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/pagination-options.interface.ts#L19)

##### useFactory

```ts
useFactory: (...args) => 
  | PaginationModuleOptions
| Promise<PaginationModuleOptions>;
```

Defined in: [src/interfaces/pagination-options.interface.ts:16](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/pagination-options.interface.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`PaginationModuleOptions`](#paginationmoduleoptions)
  \| `Promise`\<[`PaginationModuleOptions`](#paginationmoduleoptions)\>

***

### PaginationModuleOptions

Defined in: [src/interfaces/pagination-options.interface.ts:4](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/pagination-options.interface.ts#L4)

#### Properties

##### defaultLimit?

```ts
optional defaultLimit?: number;
```

Defined in: [src/interfaces/pagination-options.interface.ts:5](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/pagination-options.interface.ts#L5)

##### defaultPaginationType?

```ts
optional defaultPaginationType?: "offset" | "cursor";
```

Defined in: [src/interfaces/pagination-options.interface.ts:7](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/pagination-options.interface.ts#L7)

##### defaultSortBy?

```ts
optional defaultSortBy?: [string, SortOrder][];
```

Defined in: [src/interfaces/pagination-options.interface.ts:8](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/pagination-options.interface.ts#L8)

##### fieldNamingStrategy?

```ts
optional fieldNamingStrategy?: "camelCase" | "snake_case";
```

Defined in: [src/interfaces/pagination-options.interface.ts:11](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/pagination-options.interface.ts#L11)

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [src/interfaces/pagination-options.interface.ts:6](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/pagination-options.interface.ts#L6)

##### withLinks?

```ts
optional withLinks?: boolean;
```

Defined in: [src/interfaces/pagination-options.interface.ts:9](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/pagination-options.interface.ts#L9)

##### withTotalCount?

```ts
optional withTotalCount?: boolean;
```

Defined in: [src/interfaces/pagination-options.interface.ts:10](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/pagination-options.interface.ts#L10)

## Type Aliases

### FilterOperator

```ts
type FilterOperator = 
  | "$eq"
  | "$ne"
  | "$gt"
  | "$gte"
  | "$lt"
  | "$lte"
  | "$in"
  | "$nin"
  | "$ilike"
  | "$btw"
  | "$null"
  | "$not:null";
```

Defined in: [src/interfaces/filter-operator.type.ts:1](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/filter-operator.type.ts#L1)

***

### SortOrder

```ts
type SortOrder = "ASC" | "DESC";
```

Defined in: [src/interfaces/filter-operator.type.ts:15](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/interfaces/filter-operator.type.ts#L15)

## Variables

### Paginate

```ts
const Paginate: (...dataOrPipes) => ParameterDecorator;
```

Defined in: [src/decorators/paginate.decorator.ts:5](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/decorators/paginate.decorator.ts#L5)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`dataOrPipes` | `unknown`[] |

#### Returns

`ParameterDecorator`

***

### PAGINATE\_DEFAULTS\_KEY

```ts
const PAGINATE_DEFAULTS_KEY: "PAGINATE_DEFAULTS" = 'PAGINATE_DEFAULTS';
```

Defined in: [src/decorators/paginate-defaults.decorator.ts:4](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/decorators/paginate-defaults.decorator.ts#L4)

***

### PAGINATION\_MODULE\_OPTIONS

```ts
const PAGINATION_MODULE_OPTIONS: "PAGINATION_MODULE_OPTIONS" = 'PAGINATION_MODULE_OPTIONS';
```

Defined in: [src/pagination.constants.ts:1](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/pagination.constants.ts#L1)

## Functions

### ApiCursorPaginatedResponse()

```ts
function ApiCursorPaginatedResponse(dataDto): MethodDecorator;
```

Defined in: [src/decorators/api-paginated-response.decorator.ts:59](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/decorators/api-paginated-response.decorator.ts#L59)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `dataDto` | `Type` |

#### Returns

`MethodDecorator`

***

### ApiPaginatedResponse()

```ts
function ApiPaginatedResponse(dataDto): MethodDecorator;
```

Defined in: [src/decorators/api-paginated-response.decorator.ts:10](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/decorators/api-paginated-response.decorator.ts#L10)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `dataDto` | `Type` |

#### Returns

`MethodDecorator`

***

### paginate()

```ts
function paginate<T>(
   query, 
   delegate, 
   config): Promise<
  | Paginated<T>
| CursorPaginated<T>>;
```

Defined in: [src/paginate.ts:11](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/paginate.ts#L11)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `query` | [`PaginateQuery`](#paginatequery) |
| `delegate` | \{ `count`: (`args`) => `Promise`\<`number`\>; `findMany`: (`args`) => `Promise`\<`T`[]\>; \} |
| `delegate.count` | (`args`) => `Promise`\<`number`\> |
| `delegate.findMany` | (`args`) => `Promise`\<`T`[]\> |
| `config` | [`PaginateConfig`](#paginateconfig)\<`T`\> |

#### Returns

`Promise`\<
  \| [`Paginated`](#paginated)\<`T`\>
  \| [`CursorPaginated`](#cursorpaginated)\<`T`\>\>

***

### PaginateDefaults()

```ts
function PaginateDefaults(defaults): CustomDecorator<string>;
```

Defined in: [src/decorators/paginate-defaults.decorator.ts:13](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/decorators/paginate-defaults.decorator.ts#L13)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `defaults` | [`PaginateDefaultsOptions`](#paginatedefaultsoptions) |

#### Returns

`CustomDecorator`\<`string`\>
