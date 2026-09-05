# prisma

## Classes

<a id="api-prismarbacstorage"></a>

### PrismaRbacStorage

Defined in: [src/adapters/prisma-rbac.storage.ts:78](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L78)

Additive 0.2.x capability for indexed role-id lookups. Implement this on
custom adapters before the legacy full-list fallback is removed in 0.3 or later.

#### Implements

- [`RbacStorage`](index.md#rbacstorage)
- [`RbacStorageRoleLookupCapability`](index.md#rbacstoragerolelookupcapability)

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new PrismaRbacStorage(prisma): PrismaRbacStorage;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:79](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L79)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `prisma` | [`PrismaRbacClientLike`](#api-prismarbacclientlike) |

###### Returns

[`PrismaRbacStorage`](#api-prismarbacstorage)

#### Properties

<a id="api-mutationresults"></a>

##### mutationResults

```ts
readonly mutationResults: RbacStorageMutationCapability;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:81](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L81)

Additive 0.2.x capability for outcome-aware writes. Custom adapters that
omit it use the deprecated result-less best-effort event fallback.

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`mutationResults`](index.md#mutationresults-1)

#### Methods

<a id="api-assignrole"></a>

##### assignRole()

```ts
assignRole(input): Promise<RbacRoleBinding>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:315](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L315)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`AssignRoleStorageInput`](index.md#assignrolestorageinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](index.md#rbacrolebinding)\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`assignRole`](index.md#assignrole-2)

<a id="api-deleterole"></a>

##### deleteRole()

```ts
deleteRole(input): Promise<void>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:224](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L224)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`DeleteRoleInput`](index.md#deleteroleinput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`deleteRole`](index.md#deleterole-2)

<a id="api-findrole"></a>

##### findRole()

```ts
findRole(input): Promise<RbacRole | null>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:94](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L94)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`FindRoleInput`](index.md#findroleinput) |

###### Returns

`Promise`\<[`RbacRole`](index.md#rbacrole) \| `null`\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`findRole`](index.md#findrole-1)

<a id="api-findrolebyid"></a>

##### findRoleById()

```ts
findRoleById(input): Promise<RbacRole | null>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:104](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L104)

Optional indexed lookup used by strict assignment validation. Adapters that
omit it retain the deprecated 0.2.x `listRoles({})` compatibility fallback.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`FindRoleByIdInput`](index.md#findrolebyidinput) |

###### Returns

`Promise`\<[`RbacRole`](index.md#rbacrole) \| `null`\>

###### Implementation of

[`RbacStorageRoleLookupCapability`](index.md#rbacstoragerolelookupcapability).[`findRoleById`](index.md#findrolebyid-2)

<a id="api-grantpermission"></a>

##### grantPermission()

```ts
grantPermission(input): Promise<void>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:235](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L235)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`GrantPermissionInput`](index.md#grantpermissioninput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`grantPermission`](index.md#grantpermission-2)

<a id="api-listbindings"></a>

##### listBindings()

```ts
listBindings(input): Promise<RbacRoleBinding[]>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:430](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L430)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListBindingsInput`](index.md#listbindingsinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](index.md#rbacrolebinding)[]\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`listBindings`](index.md#listbindings-2)

<a id="api-listeffectivepermissions"></a>

##### listEffectivePermissions()

```ts
listEffectivePermissions(input): Promise<RbacEffectivePermission[]>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:455](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L455)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListEffectiveRolesInput`](index.md#listeffectiverolesinput) |

###### Returns

`Promise`\<[`RbacEffectivePermission`](index.md#rbaceffectivepermission)[]\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`listEffectivePermissions`](index.md#listeffectivepermissions-1)

<a id="api-listeffectiveroles"></a>

##### listEffectiveRoles()

```ts
listEffectiveRoles(input): Promise<RbacEffectiveRole[]>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:444](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L444)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListEffectiveRolesInput`](index.md#listeffectiverolesinput) |

###### Returns

`Promise`\<[`RbacEffectiveRole`](index.md#rbaceffectiverole)[]\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`listEffectiveRoles`](index.md#listeffectiveroles-1)

<a id="api-listrolepermissions"></a>

##### listRolePermissions()

```ts
listRolePermissions(input): Promise<string[]>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:304](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L304)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListRolePermissionsInput`](index.md#listrolepermissionsinput) |

###### Returns

`Promise`\<`string`[]\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`listRolePermissions`](index.md#listrolepermissions-1)

<a id="api-listroles"></a>

##### listRoles()

```ts
listRoles(input): Promise<RbacRole[]>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:114](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L114)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListRolesInput`](index.md#listrolesinput) |

###### Returns

`Promise`\<[`RbacRole`](index.md#rbacrole)[]\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`listRoles`](index.md#listroles-2)

<a id="api-revokepermission"></a>

##### revokePermission()

```ts
revokePermission(input): Promise<void>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:278](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L278)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokePermissionInput`](index.md#revokepermissioninput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`revokePermission`](index.md#revokepermission-2)

<a id="api-revokerole"></a>

##### revokeRole()

```ts
revokeRole(input): Promise<void>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:402](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L402)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokeRoleInput`](index.md#revokeroleinput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`revokeRole`](index.md#revokerole-2)

<a id="api-upsertrole"></a>

##### upsertRole()

```ts
upsertRole(input): Promise<RbacRole>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:125](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L125)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`UpsertRoleInput`](index.md#upsertroleinput) |

###### Returns

`Promise`\<[`RbacRole`](index.md#rbacrole)\>

###### Implementation of

[`RbacStorage`](index.md#rbacstorage).[`upsertRole`](index.md#upsertrole-1)

## Interfaces

<a id="api-prismarbacclientlike"></a>

### PrismaRbacClientLike

Defined in: [src/adapters/prisma-rbac.storage.ts:74](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L74)

#### Extends

- [`PrismaRbacTransactionClientLike`](#api-prismarbactransactionclientlike)

#### Properties

<a id="api-rbacpermission"></a>

##### rbacPermission

```ts
rbacPermission: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:69](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L69)

###### Inherited from

[`PrismaRbacTransactionClientLike`](#api-prismarbactransactionclientlike).[`rbacPermission`](#api-rbacpermission-1)

<a id="api-rbacrole"></a>

##### rbacRole

```ts
rbacRole: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:68](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L68)

###### Inherited from

[`PrismaRbacTransactionClientLike`](#api-prismarbactransactionclientlike).[`rbacRole`](#api-rbacrole-1)

<a id="api-rbacrolebinding"></a>

##### rbacRoleBinding

```ts
rbacRoleBinding: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:71](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L71)

###### Inherited from

[`PrismaRbacTransactionClientLike`](#api-prismarbactransactionclientlike).[`rbacRoleBinding`](#api-rbacrolebinding-1)

<a id="api-rbacrolepermission"></a>

##### rbacRolePermission

```ts
rbacRolePermission: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:70](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L70)

###### Inherited from

[`PrismaRbacTransactionClientLike`](#api-prismarbactransactionclientlike).[`rbacRolePermission`](#api-rbacrolepermission-1)

#### Methods

<a id="api-transaction"></a>

##### $transaction()

```ts
$transaction<T>(fn): Promise<T>;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:75](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L75)

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

<a id="api-prismarbactransactionclientlike"></a>

### PrismaRbacTransactionClientLike

Defined in: [src/adapters/prisma-rbac.storage.ts:67](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L67)

#### Extended by

- [`PrismaRbacClientLike`](#api-prismarbacclientlike)

#### Properties

<a id="api-rbacpermission-1"></a>

##### rbacPermission

```ts
rbacPermission: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:69](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L69)

<a id="api-rbacrole-1"></a>

##### rbacRole

```ts
rbacRole: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:68](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L68)

<a id="api-rbacrolebinding-1"></a>

##### rbacRoleBinding

```ts
rbacRoleBinding: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:71](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L71)

<a id="api-rbacrolepermission-1"></a>

##### rbacRolePermission

```ts
rbacRolePermission: PrismaDelegate;
```

Defined in: [src/adapters/prisma-rbac.storage.ts:70](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/adapters/prisma-rbac.storage.ts#L70)
