# cache

## Classes

<a id="api-tenantcacheinterceptor"></a>

### TenantCacheInterceptor

Defined in: [src/cache/tenant-cache.interceptor.ts:14](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/cache/tenant-cache.interceptor.ts#L14)

#### Extends

- `CacheInterceptor`

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new TenantCacheInterceptor(
   cacheManager,
   reflector,
   options?,
   diagnostics?): TenantCacheInterceptor;
```

Defined in: [src/cache/tenant-cache.interceptor.ts:22](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/cache/tenant-cache.interceptor.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `cacheManager` | `any` |
| `reflector` | `Reflector` |
| `options?` | [`TenantCacheInterceptorOptions`](#api-tenantcacheinterceptoroptions) |
| `diagnostics?` | [`TenantContextDiagnostics`](index.md#tenantcontextdiagnostics) |

###### Returns

[`TenantCacheInterceptor`](#api-tenantcacheinterceptor)

###### Overrides

```ts
CacheInterceptor.constructor
```

#### Methods

<a id="api-intercept"></a>

##### intercept()

```ts
intercept(context, next): Promise<Observable<any>>;
```

Defined in: node\_modules/@nestjs/cache-manager/dist/interceptors/cache.interceptor.d.ts:15

Method to implement a custom interceptor.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `ExecutionContext` | an `ExecutionContext` object providing methods to access the route handler and class about to be invoked. |
| `next` | `CallHandler` | a reference to the `CallHandler`, which provides access to an `Observable` representing the response stream from the route handler. |

###### Returns

`Promise`\<`Observable`\<`any`\>\>

###### Inherited from

```ts
CacheInterceptor.intercept
```

## Interfaces

<a id="api-tenantcacheinterceptoroptions"></a>

### TenantCacheInterceptorOptions

Defined in: [src/cache/tenant-cache-options.interface.ts:3](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/cache/tenant-cache-options.interface.ts#L3)

#### Properties

<a id="api-diagnostics"></a>

##### diagnostics?

```ts
optional diagnostics?: TenantContextDiagnostics;
```

Defined in: [src/cache/tenant-cache-options.interface.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/cache/tenant-cache-options.interface.ts#L13)

Override the diagnostics service used for missing tenant context.

<a id="api-hashtenantid"></a>

##### hashTenantId?

```ts
optional hashTenantId?: boolean;
```

Defined in: [src/cache/tenant-cache-options.interface.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/cache/tenant-cache-options.interface.ts#L11)

Hash tenant IDs before placing them in cache keys.

###### Default

```ts
false
```

<a id="api-resource"></a>

##### resource?

```ts
optional resource?: string;
```

Defined in: [src/cache/tenant-cache-options.interface.ts:15](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/cache/tenant-cache-options.interface.ts#L15)

Stable cache name included in diagnostics.

<a id="api-separator"></a>

##### separator?

```ts
optional separator?: string;
```

Defined in: [src/cache/tenant-cache-options.interface.ts:9](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/cache/tenant-cache-options.interface.ts#L9)

Separator used between key parts.

###### Default

```ts
':'
```

<a id="api-sharedprefix"></a>

##### sharedPrefix?

```ts
optional sharedPrefix?: string;
```

Defined in: [src/cache/tenant-cache-options.interface.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/cache/tenant-cache-options.interface.ts#L7)

Prefix for intentionally shared cache entries.

###### Default

```ts
'shared'
```

<a id="api-tenantprefix"></a>

##### tenantPrefix?

```ts
optional tenantPrefix?: string;
```

Defined in: [src/cache/tenant-cache-options.interface.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/cache/tenant-cache-options.interface.ts#L5)

Prefix for tenant-scoped cache entries.

###### Default

```ts
'tenant'
```

## Variables

<a id="api-tenant_cache_interceptor_options"></a>

### TENANT\_CACHE\_INTERCEPTOR\_OPTIONS

```ts
const TENANT_CACHE_INTERCEPTOR_OPTIONS: typeof TENANT_CACHE_INTERCEPTOR_OPTIONS;
```

Defined in: [src/cache/tenant-cache.constants.ts:1](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/cache/tenant-cache.constants.ts#L1)

## Functions

<a id="api-sharedtenantcache"></a>

### SharedTenantCache()

```ts
function SharedTenantCache(): CustomDecorator<typeof SHARED_TENANT_CACHE_KEY>;
```

Defined in: [src/decorators/shared-tenant-cache.decorator.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/c9c448ba4e4e7b7ed5634c29516dc7a30376d728/src/decorators/shared-tenant-cache.decorator.ts#L11)

Marks a route or controller as safe to cache without tenant namespacing.

Use only for data that is intentionally identical for every tenant.
This affects cache key generation only; it does not bypass tenancy guards
or clear tenant context.

#### Returns

`CustomDecorator`\<*typeof* `SHARED_TENANT_CACHE_KEY`\>
