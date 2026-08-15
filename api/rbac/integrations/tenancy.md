# integrations/tenancy

## Type Aliases

<a id="api-rbactenantidgetter"></a>

### RbacTenantIdGetter

```ts
type RbacTenantIdGetter = () => string | null | undefined;
```

Defined in: [src/integrations/tenancy.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/integrations/tenancy.ts#L3)

#### Returns

`string` \| `null` \| `undefined`

## Variables

<a id="api-createnestarctenancyresolver"></a>

### createNestarcTenancyResolver

```ts
const createNestarcTenancyResolver: (getTenantId) => RbacTenantResolver = createTenancyTenantResolver;
```

Defined in: [src/integrations/tenancy.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/integrations/tenancy.ts#L9)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `getTenantId` | [`RbacTenantIdGetter`](#api-rbactenantidgetter) |

#### Returns

[`RbacTenantResolver`](../index.md#rbactenantresolver)

## Functions

<a id="api-createtenancytenantresolver"></a>

### createTenancyTenantResolver()

```ts
function createTenancyTenantResolver(getTenantId): RbacTenantResolver;
```

Defined in: [src/integrations/tenancy.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/integrations/tenancy.ts#L5)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `getTenantId` | [`RbacTenantIdGetter`](#api-rbactenantidgetter) |

#### Returns

[`RbacTenantResolver`](../index.md#rbactenantresolver)
