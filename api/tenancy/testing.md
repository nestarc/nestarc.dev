# testing

## Classes

### TestTenancyModule

Defined in: [src/testing/test-tenancy.module.ts:22](https://github.com/nestarc/nestjs-tenancy/blob/752ca0b5fbe332d4a5169d9614caeae563b22680/src/testing/test-tenancy.module.ts#L22)

A lightweight test module that provides TenancyContext and TenancyService
without the middleware, guard, or module options required by the production
TenancyModule.

Usage in tests:
```typescript
const module = await Test.createTestingModule({
  imports: [TestTenancyModule.register()],
  providers: [MyService],
}).compile();

const service = module.get(MyService);
const result = await withTenant('tenant-1', () => service.findAll());
```

#### Constructors

##### Constructor

```ts
new TestTenancyModule(): TestTenancyModule;
```

###### Returns

[`TestTenancyModule`](#testtenancymodule)

#### Methods

##### register()

```ts
static register(): DynamicModule;
```

Defined in: [src/testing/test-tenancy.module.ts:23](https://github.com/nestarc/nestjs-tenancy/blob/752ca0b5fbe332d4a5169d9614caeae563b22680/src/testing/test-tenancy.module.ts#L23)

###### Returns

`DynamicModule`

## Interfaces

### IsolationTestOptions

Defined in: [src/testing/expect-tenant-isolation.ts:3](https://github.com/nestarc/nestjs-tenancy/blob/752ca0b5fbe332d4a5169d9614caeae563b22680/src/testing/expect-tenant-isolation.ts#L3)

#### Properties

##### tenantIdField?

```ts
optional tenantIdField?: string;
```

Defined in: [src/testing/expect-tenant-isolation.ts:5](https://github.com/nestarc/nestjs-tenancy/blob/752ca0b5fbe332d4a5169d9614caeae563b22680/src/testing/expect-tenant-isolation.ts#L5)

The field name that holds the tenant ID.

###### Default

```ts
'tenant_id'
```

## Functions

### expectTenantIsolation()

```ts
function expectTenantIsolation(
   prismaModel, 
   tenantA, 
   tenantB, 
options?): Promise<void>;
```

Defined in: [src/testing/expect-tenant-isolation.ts:25](https://github.com/nestarc/nestjs-tenancy/blob/752ca0b5fbe332d4a5169d9614caeae563b22680/src/testing/expect-tenant-isolation.ts#L25)

Asserts that a Prisma model enforces tenant isolation between two tenants.

Executes `findMany()` concurrently as both tenants and verifies that
no rows from tenant A appear in tenant B's results, and vice versa.

Usage in E2E tests:
```typescript
await expectTenantIsolation(prisma.user, 'tenant-a-uuid', 'tenant-b-uuid');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prismaModel` | \{ `findMany`: (`args?`) => `Promise`\<`Record`\<`string`, `unknown`\>[]\>; \} | A Prisma model delegate with a `findMany` method |
| `prismaModel.findMany` | (`args?`) => `Promise`\<`Record`\<`string`, `unknown`\>[]\> | - |
| `tenantA` | `string` | First tenant ID |
| `tenantB` | `string` | Second tenant ID |
| `options?` | [`IsolationTestOptions`](#isolationtestoptions) | Optional configuration |

#### Returns

`Promise`\<`void`\>

#### Throws

Error if tenant isolation is violated

***

### withTenant()

```ts
function withTenant<T>(
   tenantId, 
   callback, 
context?): Promise<T>;
```

Defined in: [src/testing/with-tenant.ts:26](https://github.com/nestarc/nestjs-tenancy/blob/752ca0b5fbe332d4a5169d9614caeae563b22680/src/testing/with-tenant.ts#L26)

Runs a callback within a tenant context, handling async/await properly.

Simplifies the common test pattern:
```typescript
// Before (verbose)
await new Promise<void>((resolve) => {
  context.run('tenant-1', async () => {
    const result = await service.findAll();
    expect(result).toHaveLength(3);
    resolve();
  });
});

// After (with helper)
const result = await withTenant('tenant-1', () => service.findAll());
expect(result).toHaveLength(3);
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tenantId` | `string` | The tenant ID to set in context |
| `callback` | () => `T` \| `Promise`\<`T`\> | The async function to execute within the tenant context |
| `context?` | [`TenancyContext`](index.md#tenancycontext) | Optional TenancyContext instance (uses a new instance by default; works because AsyncLocalStorage is static) |

#### Returns

`Promise`\<`T`\>
