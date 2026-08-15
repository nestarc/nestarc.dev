# testing

## Classes

<a id="api-testsoftdeletemodule"></a>

### TestSoftDeleteModule

Defined in: [src/testing/test-soft-delete.module.ts:9](https://github.com/nestarc/nestjs-soft-delete/blob/eaf6e43d65a00ba02b27e3e527ad12991e3f4e51/src/testing/test-soft-delete.module.ts#L9)

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new TestSoftDeleteModule(): TestSoftDeleteModule;
```

###### Returns

[`TestSoftDeleteModule`](#api-testsoftdeletemodule)

#### Methods

<a id="api-register"></a>

##### register()

```ts
static register(options, prisma?): DynamicModule;
```

Defined in: [src/testing/test-soft-delete.module.ts:10](https://github.com/nestarc/nestjs-soft-delete/blob/eaf6e43d65a00ba02b27e3e527ad12991e3f4e51/src/testing/test-soft-delete.module.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | `Partial`\<[`SoftDeleteModuleOptions`](index.md#softdeletemoduleoptions)\> & \{ `softDeleteModels`: `string`[]; \} |
| `prisma?` | `any` |

###### Returns

`DynamicModule`

## Functions

<a id="api-expectcascadesoftdeleted"></a>

### expectCascadeSoftDeleted()

```ts
function expectCascadeSoftDeleted(
   prisma,
   parentModel,
   where,
   childModels,
deletedAtField?): Promise<void>;
```

Defined in: [src/testing/expect-soft-deleted.ts:42](https://github.com/nestarc/nestjs-soft-delete/blob/eaf6e43d65a00ba02b27e3e527ad12991e3f4e51/src/testing/expect-soft-deleted.ts#L42)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `prisma` | `any` | `undefined` |
| `parentModel` | `string` | `undefined` |
| `where` | `Record`\<`string`, `any`\> | `undefined` |
| `childModels` | `string`[] | `undefined` |
| `deletedAtField` | `string` | `'deletedAt'` |

#### Returns

`Promise`\<`void`\>

***

<a id="api-expectnotsoftdeleted"></a>

### expectNotSoftDeleted()

```ts
function expectNotSoftDeleted(
   modelDelegate,
   where,
deletedAtField?): Promise<void>;
```

Defined in: [src/testing/expect-soft-deleted.ts:24](https://github.com/nestarc/nestjs-soft-delete/blob/eaf6e43d65a00ba02b27e3e527ad12991e3f4e51/src/testing/expect-soft-deleted.ts#L24)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `modelDelegate` | `any` | `undefined` |
| `where` | `Record`\<`string`, `any`\> | `undefined` |
| `deletedAtField` | `string` | `'deletedAt'` |

#### Returns

`Promise`\<`void`\>

***

<a id="api-expectsoftdeleted"></a>

### expectSoftDeleted()

```ts
function expectSoftDeleted(
   modelDelegate,
   where,
deletedAtField?): Promise<void>;
```

Defined in: [src/testing/expect-soft-deleted.ts:3](https://github.com/nestarc/nestjs-soft-delete/blob/eaf6e43d65a00ba02b27e3e527ad12991e3f4e51/src/testing/expect-soft-deleted.ts#L3)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `modelDelegate` | `any` | `undefined` |
| `where` | `Record`\<`string`, `any`\> | `undefined` |
| `deletedAtField` | `string` | `'deletedAt'` |

#### Returns

`Promise`\<`void`\>
