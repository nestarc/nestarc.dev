# prisma

## Classes

### PrismaRbacStorage

Defined in: [src/adapters/prisma-rbac.storage.ts:242](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L242)

#### Implements

- [`RbacStorage`](index.md#rbacstorage)

#### Constructors

##### Constructor

```ts
new PrismaRbacStorage(prisma): PrismaRbacStorage;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:243](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L243)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `prisma` | [`PrismaRbacClientLike`](#prismarbacclientlike) |

###### Returns

[`PrismaRbacStorage`](#prismarbacstorage)

#### Methods

##### assignRole()

```ts
assignRole(input): Promise<RbacRoleBinding>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:399](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L399)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`AssignRoleStorageInput`](index.md#assignrolestorageinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](index.md#rbacrolebinding)\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`assignRole`](index.md#assignrole-2)

##### deleteRole()

```ts
deleteRole(input): Promise<void>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:347](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L347)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`DeleteRoleInput`](index.md#deleteroleinput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`deleteRole`](index.md#deleterole-2)

##### findRole()

```ts
findRole(input): Promise<RbacRole | null>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:245](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L245)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`FindRoleInput`](index.md#findroleinput) |

###### Returns

`Promise`\<[`RbacRole`](index.md#rbacrole) \| `null`\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`findRole`](index.md#findrole-1)

##### grantPermission()

```ts
grantPermission(input): Promise<void>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:351](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L351)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`GrantPermissionInput`](index.md#grantpermissioninput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`grantPermission`](index.md#grantpermission-2)

##### listBindings()

```ts
listBindings(input): Promise<RbacRoleBinding[]>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:486](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L486)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListBindingsInput`](index.md#listbindingsinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](index.md#rbacrolebinding)[]\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`listBindings`](index.md#listbindings-2)

##### listEffectivePermissions()

```ts
listEffectivePermissions(input): Promise<RbacEffectivePermission[]>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:510](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L510)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListEffectiveRolesInput`](index.md#listeffectiverolesinput) |

###### Returns

`Promise`\<[`RbacEffectivePermission`](index.md#rbaceffectivepermission)[]\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`listEffectivePermissions`](index.md#listeffectivepermissions-1)

##### listEffectiveRoles()

```ts
listEffectiveRoles(input): Promise<RbacEffectiveRole[]>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:499](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L499)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListEffectiveRolesInput`](index.md#listeffectiverolesinput) |

###### Returns

`Promise`\<[`RbacEffectiveRole`](index.md#rbaceffectiverole)[]\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`listEffectiveRoles`](index.md#listeffectiveroles-1)

##### listRolePermissions()

```ts
listRolePermissions(input): Promise<string[]>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:389](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L389)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListRolePermissionsInput`](index.md#listrolepermissionsinput) |

###### Returns

`Promise`\<`string`[]\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`listRolePermissions`](index.md#listrolepermissions-1)

##### listRoles()

```ts
listRoles(input): Promise<RbacRole[]>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:254](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L254)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListRolesInput`](index.md#listrolesinput) |

###### Returns

`Promise`\<[`RbacRole`](index.md#rbacrole)[]\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`listRoles`](index.md#listroles-2)

##### revokePermission()

```ts
revokePermission(input): Promise<void>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:376](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L376)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokePermissionInput`](index.md#revokepermissioninput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`revokePermission`](index.md#revokepermission-2)

##### revokeRole()

```ts
revokeRole(input): Promise<void>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:471](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L471)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokeRoleInput`](index.md#revokeroleinput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`revokeRole`](index.md#revokerole-2)

##### upsertRole()

```ts
upsertRole(input): Promise<RbacRole>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:265](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L265)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`UpsertRoleInput`](index.md#upsertroleinput) |

###### Returns

`Promise`\<[`RbacRole`](index.md#rbacrole)\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`upsertRole`](index.md#upsertrole-1)

## Interfaces

### PrismaRbacClientLike

Defined in: [src/adapters/prisma-rbac.storage.ts:72](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L72)

#### Extends

- [`PrismaRbacTransactionClientLike`](#prismarbactransactionclientlike)

#### Properties

##### rbacPermission

```ts
rbacPermission: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:67](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L67)

###### Inherited from

[`PrismaRbacTransactionClientLike`](#prismarbactransactionclientlike).[`rbacPermission`](#rbacpermission-1)

##### rbacRole

```ts
rbacRole: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:66](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L66)

###### Inherited from

[`PrismaRbacTransactionClientLike`](#prismarbactransactionclientlike).[`rbacRole`](#rbacrole-1)

##### rbacRoleBinding

```ts
rbacRoleBinding: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:69](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L69)

###### Inherited from

[`PrismaRbacTransactionClientLike`](#prismarbactransactionclientlike).[`rbacRoleBinding`](#rbacrolebinding-1)

##### rbacRolePermission

```ts
rbacRolePermission: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:68](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L68)

###### Inherited from

[`PrismaRbacTransactionClientLike`](#prismarbactransactionclientlike).[`rbacRolePermission`](#rbacrolepermission-1)

#### Methods

##### $transaction()

```ts
$transaction<T>(fn): Promise<T>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:73](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L73)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`tx`) => `Promise`\<`T`\> |

###### Returns

`Promise`\<`T`\>

***

### PrismaRbacTransactionClientLike

Defined in: [src/adapters/prisma-rbac.storage.ts:65](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L65)

#### Extended by

- [`PrismaRbacClientLike`](#prismarbacclientlike)

#### Properties

##### rbacPermission

```ts
rbacPermission: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:67](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L67)

##### rbacRole

```ts
rbacRole: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:66](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L66)

##### rbacRoleBinding

```ts
rbacRoleBinding: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:69](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L69)

##### rbacRolePermission

```ts
rbacRolePermission: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:68](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/prisma-rbac.storage.ts#L68)
