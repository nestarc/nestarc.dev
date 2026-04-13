# testing

## Classes

### TestPaginationModule

Defined in: [src/testing/test-pagination.module.ts:6](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/testing/test-pagination.module.ts#L6)

#### Constructors

##### Constructor

```ts
new TestPaginationModule(): TestPaginationModule;
```

###### Returns

[`TestPaginationModule`](#testpaginationmodule)

#### Methods

##### register()

```ts
static register(options?): DynamicModule;
```

Defined in: [src/testing/test-pagination.module.ts:7](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/testing/test-pagination.module.ts#L7)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`PaginationModuleOptions`](index.md#paginationmoduleoptions) |

###### Returns

`DynamicModule`

## Functions

### createPaginateQuery()

```ts
function createPaginateQuery(overrides?): PaginateQuery;
```

Defined in: [src/testing/create-paginate-query.ts:3](https://github.com/nestarc/nestjs-pagination/blob/248af4aea54c494d065fa9677350994b33b73f27/src/testing/create-paginate-query.ts#L3)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `overrides` | `Partial`\<[`PaginateQuery`](index.md#paginatequery)\> |

#### Returns

[`PaginateQuery`](index.md#paginatequery)
