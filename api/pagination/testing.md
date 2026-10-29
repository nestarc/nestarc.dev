# testing

## Classes

<a id="api-testpaginationmodule"></a>

### TestPaginationModule

Defined in: [src/testing/test-pagination.module.ts:6](https://github.com/nestarc/nestjs-pagination/blob/09b8cf8cb7aea22b5ad7a603404d6c41fcd2f14a/src/testing/test-pagination.module.ts#L6)

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new TestPaginationModule(): TestPaginationModule;
```

###### Returns

[`TestPaginationModule`](#api-testpaginationmodule)

#### Methods

<a id="api-register"></a>

##### register()

```ts
static register(options?): DynamicModule;
```

Defined in: [src/testing/test-pagination.module.ts:7](https://github.com/nestarc/nestjs-pagination/blob/09b8cf8cb7aea22b5ad7a603404d6c41fcd2f14a/src/testing/test-pagination.module.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`PaginationModuleOptions`](index.md#paginationmoduleoptions) |

###### Returns

`DynamicModule`

## Functions

<a id="api-createpaginatequery"></a>

### createPaginateQuery()

```ts
function createPaginateQuery(overrides?): PaginateQuery;
```

Defined in: [src/testing/create-paginate-query.ts:3](https://github.com/nestarc/nestjs-pagination/blob/09b8cf8cb7aea22b5ad7a603404d6c41fcd2f14a/src/testing/create-paginate-query.ts#L3)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `overrides` | `Partial`\<[`PaginateQuery`](index.md#paginatequery)\> |

#### Returns

[`PaginateQuery`](index.md#paginatequery)
