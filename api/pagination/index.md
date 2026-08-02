# index

## Classes

### InvalidCursorError

Defined in: [nestjs-pagination/src/errors/invalid-cursor.error.ts:3](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/errors/invalid-cursor.error.ts#L3)

#### Extends

- `BadRequestException`

#### Constructors

##### Constructor

```ts
new InvalidCursorError(cursor): InvalidCursorError;
```

Defined in: [nestjs-pagination/src/errors/invalid-cursor.error.ts:4](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/errors/invalid-cursor.error.ts#L4)

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:28

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

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1075

###### Inherited from

```ts
BadRequestException.message
```

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1074

###### Inherited from

```ts
BadRequestException.name
```

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:74

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:75

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:76

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:84

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:77

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:78

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:72

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:73

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:69

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:70

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:71

###### Returns

`void`

###### Inherited from

```ts
BadRequestException.initName
```

***

### InvalidFilterColumnError

Defined in: [nestjs-pagination/src/errors/invalid-filter-column.error.ts:3](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/errors/invalid-filter-column.error.ts#L3)

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

Defined in: [nestjs-pagination/src/errors/invalid-filter-column.error.ts:4](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/errors/invalid-filter-column.error.ts#L4)

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:28

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

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1075

###### Inherited from

```ts
BadRequestException.message
```

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1074

###### Inherited from

```ts
BadRequestException.name
```

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:74

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:75

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:76

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:84

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:77

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:78

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:72

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:73

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:69

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:70

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:71

###### Returns

`void`

###### Inherited from

```ts
BadRequestException.initName
```

***

### InvalidSortColumnError

Defined in: [nestjs-pagination/src/errors/invalid-sort-column.error.ts:3](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/errors/invalid-sort-column.error.ts#L3)

#### Extends

- `BadRequestException`

#### Constructors

##### Constructor

```ts
new InvalidSortColumnError(column, sortableColumns): InvalidSortColumnError;
```

Defined in: [nestjs-pagination/src/errors/invalid-sort-column.error.ts:4](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/errors/invalid-sort-column.error.ts#L4)

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:28

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

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1075

###### Inherited from

```ts
BadRequestException.message
```

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1074

###### Inherited from

```ts
BadRequestException.name
```

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:74

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:75

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:76

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:84

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:77

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:78

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:72

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:73

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:69

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:70

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/exceptions/http.exception.d.ts:71

###### Returns

`void`

###### Inherited from

```ts
BadRequestException.initName
```

***

### PaginateService

Defined in: [nestjs-pagination/src/paginate.service.ts:12](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/paginate.service.ts#L12)

#### Constructors

##### Constructor

```ts
new PaginateService(moduleOptions?, reflector): PaginateService;
```

Defined in: [nestjs-pagination/src/paginate.service.ts:13](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/paginate.service.ts#L13)

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

Defined in: [nestjs-pagination/src/paginate.service.ts:20](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/paginate.service.ts#L20)

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

Defined in: [nestjs-pagination/src/pagination.module.ts:11](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/pagination.module.ts#L11)

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

Defined in: [nestjs-pagination/src/pagination.module.ts:12](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/pagination.module.ts#L12)

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

Defined in: [nestjs-pagination/src/pagination.module.ts:28](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/pagination.module.ts#L28)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`PaginationModuleAsyncOptions`](#paginationmoduleasyncoptions) |

###### Returns

`DynamicModule`

## Interfaces

### ApiPaginationQueryOptions

Defined in: [nestjs-pagination/src/decorators/api-paginated-response.decorator.ts:11](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/api-paginated-response.decorator.ts#L11)

#### Properties

##### allowWithDeleted?

```ts
optional allowWithDeleted?: boolean;
```

Defined in: [nestjs-pagination/src/decorators/api-paginated-response.decorator.ts:16](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/api-paginated-response.decorator.ts#L16)

##### filterableColumns?

```ts
optional filterableColumns?: Record<string, FilterOperator[]>;
```

Defined in: [nestjs-pagination/src/decorators/api-paginated-response.decorator.ts:15](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/api-paginated-response.decorator.ts#L15)

##### searchableColumns?

```ts
optional searchableColumns?: string[];
```

Defined in: [nestjs-pagination/src/decorators/api-paginated-response.decorator.ts:14](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/api-paginated-response.decorator.ts#L14)

##### sortableColumns?

```ts
optional sortableColumns?: string[];
```

Defined in: [nestjs-pagination/src/decorators/api-paginated-response.decorator.ts:13](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/api-paginated-response.decorator.ts#L13)

##### type?

```ts
optional type?: "offset" | "cursor";
```

Defined in: [nestjs-pagination/src/decorators/api-paginated-response.decorator.ts:12](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/api-paginated-response.decorator.ts#L12)

***

### CursorPaginated

Defined in: [nestjs-pagination/src/interfaces/paginated.interface.ts:23](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginated.interface.ts#L23)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Properties

##### data

```ts
data: T[];
```

Defined in: [nestjs-pagination/src/interfaces/paginated.interface.ts:24](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginated.interface.ts#L24)

##### links

```ts
links: {
  current: string;
  next: string | null;
  previous: string | null;
};
```

Defined in: [nestjs-pagination/src/interfaces/paginated.interface.ts:36](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginated.interface.ts#L36)

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

Defined in: [nestjs-pagination/src/interfaces/paginated.interface.ts:25](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginated.interface.ts#L25)

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

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:8](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L8)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

#### Properties

##### allowWithDeleted?

```ts
optional allowWithDeleted?: boolean;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:51](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L51)

##### countQuery?

```ts
optional countQuery?: (args) => Promise<number>;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:43](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L43)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | \{ `config`: [`PaginateConfig`](#paginateconfig)\<`T`\>; `delegate`: \{ `count`: (`args`) => `Promise`\<`number`\>; \}; `query`: [`PaginateQuery`](#paginatequery); `where`: `Record`\<`string`, `any`\>; \} |
| `args.config` | [`PaginateConfig`](#paginateconfig)\<`T`\> |
| `args.delegate` | \{ `count`: (`args`) => `Promise`\<`number`\>; \} |
| `args.delegate.count` | (`args`) => `Promise`\<`number`\> |
| `args.query` | [`PaginateQuery`](#paginatequery) |
| `args.where` | `Record`\<`string`, `any`\> |

###### Returns

`Promise`\<`number`\>

##### countStrategy?

```ts
optional countStrategy?: CountStrategy;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:42](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L42)

##### cursorColumn?

```ts
optional cursorColumn?: keyof T & string;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:34](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L34)

Column used as cursor for cursor-based pagination. Defaults to 'id'.

Requirements:
- Must be included in `sortableColumns`
- Should have unique, sequential values (e.g., auto-increment ID, UUID v7, timestamp)
- Non-unique cursor columns may produce inconsistent results across pages

###### See

https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination

##### cursorColumns?

```ts
optional cursorColumns?: keyof T & string[];
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:36](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L36)

##### cursorStrategy?

```ts
optional cursorStrategy?: CursorStrategy;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:35](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L35)

##### decodeCursor?

```ts
optional decodeCursor?: (cursor) => CursorPayload;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:38](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L38)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `cursor` | `string` |

###### Returns

`CursorPayload`

##### defaultLimit?

```ts
optional defaultLimit?: number;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:39](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L39)

##### defaultSortBy?

```ts
optional defaultSortBy?: [keyof T & string, SortOrder][];
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:11](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L11)

##### encodeCursor?

```ts
optional encodeCursor?: (payload) => string;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:37](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `payload` | `CursorPayload` |

###### Returns

`string`

##### filterableColumns?

```ts
optional filterableColumns?: { [K in string]?: FilterOperator[] };
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:16](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L16)

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:40](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L40)

##### nullSort?

```ts
optional nullSort?: "first" | "last";
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:12](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L12)

##### paginationType?

```ts
optional paginationType?: "offset" | "cursor";
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:23](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L23)

##### relations?

```ts
optional relations?: Record<string, boolean | object>;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:20](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L20)

##### searchableColumns?

```ts
optional searchableColumns?: keyof T & string[];
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:14](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L14)

##### select?

```ts
optional select?: keyof T & string[];
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:21](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L21)

##### sortableColumns

```ts
sortableColumns: keyof T & string[];
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:9](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L9)

##### where?

```ts
optional where?: object;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:50](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L50)

##### withTotalCount?

```ts
optional withTotalCount?: boolean;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:41](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L41)

***

### Paginated

Defined in: [nestjs-pagination/src/interfaces/paginated.interface.ts:3](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginated.interface.ts#L3)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Properties

##### data

```ts
data: T[];
```

Defined in: [nestjs-pagination/src/interfaces/paginated.interface.ts:4](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginated.interface.ts#L4)

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

Defined in: [nestjs-pagination/src/interfaces/paginated.interface.ts:14](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginated.interface.ts#L14)

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
  totalItems?: number;
  totalPages?: number;
};
```

Defined in: [nestjs-pagination/src/interfaces/paginated.interface.ts:5](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginated.interface.ts#L5)

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

###### totalItems?

```ts
optional totalItems?: number;
```

###### totalPages?

```ts
optional totalPages?: number;
```

***

### PaginateDefaultsOptions

Defined in: [nestjs-pagination/src/decorators/paginate-defaults.decorator.ts:6](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/paginate-defaults.decorator.ts#L6)

#### Properties

##### defaultLimit?

```ts
optional defaultLimit?: number;
```

Defined in: [nestjs-pagination/src/decorators/paginate-defaults.decorator.ts:7](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/paginate-defaults.decorator.ts#L7)

##### defaultSortBy?

```ts
optional defaultSortBy?: [string, SortOrder][];
```

Defined in: [nestjs-pagination/src/decorators/paginate-defaults.decorator.ts:9](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/paginate-defaults.decorator.ts#L9)

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [nestjs-pagination/src/decorators/paginate-defaults.decorator.ts:8](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/paginate-defaults.decorator.ts#L8)

##### paginationType?

```ts
optional paginationType?: "offset" | "cursor";
```

Defined in: [nestjs-pagination/src/decorators/paginate-defaults.decorator.ts:10](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/paginate-defaults.decorator.ts#L10)

***

### PaginateQuery

Defined in: [nestjs-pagination/src/interfaces/paginate-query.interface.ts:3](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-query.interface.ts#L3)

#### Properties

##### after?

```ts
optional after?: string;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-query.interface.ts:15](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-query.interface.ts#L15)

##### before?

```ts
optional before?: string;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-query.interface.ts:16](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-query.interface.ts#L16)

##### filter?

```ts
optional filter?: Record<string, string | string[]>;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-query.interface.ts:7](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-query.interface.ts#L7)

##### limit?

```ts
optional limit?: number;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-query.interface.ts:4](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-query.interface.ts#L4)

##### page?

```ts
optional page?: number;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-query.interface.ts:12](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-query.interface.ts#L12)

##### path

```ts
path: string;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-query.interface.ts:9](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-query.interface.ts#L9)

##### search?

```ts
optional search?: string;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-query.interface.ts:6](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-query.interface.ts#L6)

##### sortBy?

```ts
optional sortBy?: [string, SortOrder][];
```

Defined in: [nestjs-pagination/src/interfaces/paginate-query.interface.ts:5](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-query.interface.ts#L5)

##### withDeleted?

```ts
optional withDeleted?: boolean;
```

Defined in: [nestjs-pagination/src/interfaces/paginate-query.interface.ts:8](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-query.interface.ts#L8)

***

### PaginationModuleAsyncOptions

Defined in: [nestjs-pagination/src/interfaces/pagination-options.interface.ts:14](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/pagination-options.interface.ts#L14)

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

Defined in: nestjs-pagination/node\_modules/@nestjs/common/interfaces/modules/module-metadata.interface.d.ts:18

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

Defined in: [nestjs-pagination/src/interfaces/pagination-options.interface.ts:19](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/pagination-options.interface.ts#L19)

##### useFactory

```ts
useFactory: (...args) =>
  | PaginationModuleOptions
| Promise<PaginationModuleOptions>;
```

Defined in: [nestjs-pagination/src/interfaces/pagination-options.interface.ts:16](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/pagination-options.interface.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`PaginationModuleOptions`](#paginationmoduleoptions)
  \| `Promise`\<[`PaginationModuleOptions`](#paginationmoduleoptions)\>

***

### PaginationModuleOptions

Defined in: [nestjs-pagination/src/interfaces/pagination-options.interface.ts:4](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/pagination-options.interface.ts#L4)

#### Properties

##### defaultLimit?

```ts
optional defaultLimit?: number;
```

Defined in: [nestjs-pagination/src/interfaces/pagination-options.interface.ts:5](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/pagination-options.interface.ts#L5)

##### defaultPaginationType?

```ts
optional defaultPaginationType?: "offset" | "cursor";
```

Defined in: [nestjs-pagination/src/interfaces/pagination-options.interface.ts:7](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/pagination-options.interface.ts#L7)

##### defaultSortBy?

```ts
optional defaultSortBy?: [string, SortOrder][];
```

Defined in: [nestjs-pagination/src/interfaces/pagination-options.interface.ts:8](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/pagination-options.interface.ts#L8)

##### fieldNamingStrategy?

```ts
optional fieldNamingStrategy?: "camelCase" | "snake_case";
```

Defined in: [nestjs-pagination/src/interfaces/pagination-options.interface.ts:11](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/pagination-options.interface.ts#L11)

##### maxLimit?

```ts
optional maxLimit?: number;
```

Defined in: [nestjs-pagination/src/interfaces/pagination-options.interface.ts:6](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/pagination-options.interface.ts#L6)

##### withLinks?

```ts
optional withLinks?: boolean;
```

Defined in: [nestjs-pagination/src/interfaces/pagination-options.interface.ts:9](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/pagination-options.interface.ts#L9)

##### withTotalCount?

```ts
optional withTotalCount?: boolean;
```

Defined in: [nestjs-pagination/src/interfaces/pagination-options.interface.ts:10](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/pagination-options.interface.ts#L10)

## Type Aliases

### CountStrategy

```ts
type CountStrategy = "exact" | "none" | "custom";
```

Defined in: [nestjs-pagination/src/interfaces/paginate-config.interface.ts:5](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/paginate-config.interface.ts#L5)

***

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

Defined in: [nestjs-pagination/src/interfaces/filter-operator.type.ts:1](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/filter-operator.type.ts#L1)

***

### SortOrder

```ts
type SortOrder = "ASC" | "DESC";
```

Defined in: [nestjs-pagination/src/interfaces/filter-operator.type.ts:15](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/interfaces/filter-operator.type.ts#L15)

## Variables

### Paginate

```ts
const Paginate: (...dataOrPipes) => ParameterDecorator;
```

Defined in: [nestjs-pagination/src/decorators/paginate.decorator.ts:5](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/paginate.decorator.ts#L5)

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

Defined in: [nestjs-pagination/src/decorators/paginate-defaults.decorator.ts:4](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/paginate-defaults.decorator.ts#L4)

***

### PAGINATION\_MODULE\_OPTIONS

```ts
const PAGINATION_MODULE_OPTIONS: "PAGINATION_MODULE_OPTIONS" = 'PAGINATION_MODULE_OPTIONS';
```

Defined in: [nestjs-pagination/src/pagination.constants.ts:1](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/pagination.constants.ts#L1)

## Functions

### ApiCursorPaginatedResponse()

```ts
function ApiCursorPaginatedResponse(dataDto, queryOptions?): MethodDecorator;
```

Defined in: [nestjs-pagination/src/decorators/api-paginated-response.decorator.ts:68](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/api-paginated-response.decorator.ts#L68)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `dataDto` | `Type` |
| `queryOptions` | `Omit`\<[`ApiPaginationQueryOptions`](#apipaginationqueryoptions), `"type"`\> |

#### Returns

`MethodDecorator`

***

### ApiPaginatedResponse()

```ts
function ApiPaginatedResponse(dataDto, queryOptions?): MethodDecorator;
```

Defined in: [nestjs-pagination/src/decorators/api-paginated-response.decorator.ts:19](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/api-paginated-response.decorator.ts#L19)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `dataDto` | `Type` |
| `queryOptions` | `Omit`\<[`ApiPaginationQueryOptions`](#apipaginationqueryoptions), `"type"`\> |

#### Returns

`MethodDecorator`

***

### ApiPaginationQuery()

```ts
function ApiPaginationQuery(options?): MethodDecorator;
```

Defined in: [nestjs-pagination/src/decorators/api-paginated-response.decorator.ts:116](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/api-paginated-response.decorator.ts#L116)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`ApiPaginationQueryOptions`](#apipaginationqueryoptions) |

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

Defined in: [nestjs-pagination/src/paginate.ts:23](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/paginate.ts#L23)

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

Defined in: [nestjs-pagination/src/decorators/paginate-defaults.decorator.ts:13](https://github.com/nestarc/nestjs-pagination/blob/fad02c29077fce7b3ec97bf8ef04db3ab5d01153/src/decorators/paginate-defaults.decorator.ts#L13)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `defaults` | [`PaginateDefaultsOptions`](#paginatedefaultsoptions) |

#### Returns

`CustomDecorator`\<`string`\>
