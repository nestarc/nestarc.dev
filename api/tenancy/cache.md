# cache

## Classes

### TenantCacheInterceptor

Defined in: [src/cache/tenant-cache.interceptor.ts:13](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/cache/tenant-cache.interceptor.ts#L13)

#### Extends

- `CacheInterceptor`

#### Constructors

##### Constructor

```ts
new TenantCacheInterceptor(
   cacheManager, 
   reflector, 
   options?): TenantCacheInterceptor;
```

Defined in: [src/cache/tenant-cache.interceptor.ts:19](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/cache/tenant-cache.interceptor.ts#L19)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `cacheManager` | `any` |
| `reflector` | `Reflector` |
| `options?` | [`TenantCacheInterceptorOptions`](#tenantcacheinterceptoroptions) |

###### Returns

[`TenantCacheInterceptor`](#tenantcacheinterceptor)

###### Overrides

```ts
CacheInterceptor.constructor
```

#### Methods

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

### TenantCacheInterceptorOptions

Defined in: [src/cache/tenant-cache-options.interface.ts:1](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/cache/tenant-cache-options.interface.ts#L1)

#### Properties

##### hashTenantId?

```ts
optional hashTenantId?: boolean;
```

Defined in: [src/cache/tenant-cache-options.interface.ts:9](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/cache/tenant-cache-options.interface.ts#L9)

Hash tenant IDs before placing them in cache keys.

###### Default

```ts
false
```

##### separator?

```ts
optional separator?: string;
```

Defined in: [src/cache/tenant-cache-options.interface.ts:7](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/cache/tenant-cache-options.interface.ts#L7)

Separator used between key parts.

###### Default

```ts
':'
```

##### sharedPrefix?

```ts
optional sharedPrefix?: string;
```

Defined in: [src/cache/tenant-cache-options.interface.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/cache/tenant-cache-options.interface.ts#L5)

Prefix for intentionally shared cache entries.

###### Default

```ts
'shared'
```

##### tenantPrefix?

```ts
optional tenantPrefix?: string;
```

Defined in: [src/cache/tenant-cache-options.interface.ts:3](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/cache/tenant-cache-options.interface.ts#L3)

Prefix for tenant-scoped cache entries.

###### Default

```ts
'tenant'
```

## Variables

### TENANT\_CACHE\_INTERCEPTOR\_OPTIONS

```ts
const TENANT_CACHE_INTERCEPTOR_OPTIONS: typeof TENANT_CACHE_INTERCEPTOR_OPTIONS;
```

Defined in: [src/cache/tenant-cache.constants.ts:1](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/cache/tenant-cache.constants.ts#L1)

## Functions

### SharedTenantCache()

```ts
function SharedTenantCache(): CustomDecorator<typeof SHARED_TENANT_CACHE_KEY>;
```

Defined in: [src/decorators/shared-tenant-cache.decorator.ts:11](https://github.com/nestarc/nestjs-tenancy/blob/2fe52884ef00464ea9511b32196c7c0a34a7dbe1/src/decorators/shared-tenant-cache.decorator.ts#L11)

Marks a route or controller as safe to cache without tenant namespacing.

Use only for data that is intentionally identical for every tenant.
This affects cache key generation only; it does not bypass tenancy guards
or clear tenant context.

#### Returns

`CustomDecorator`\<*typeof* `SHARED_TENANT_CACHE_KEY`\>
