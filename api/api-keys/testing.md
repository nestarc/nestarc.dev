# testing

## Interfaces

### CreateTestKeyOptions

Defined in: [src/testing.ts:4](https://github.com/nestarc/api-keys/blob/7190c5d2e7408ee46a1de3ce65feff2e11cbfe7d/src/testing.ts#L4)

#### Properties

##### allowedIpCidrs?

```ts
optional allowedIpCidrs?: string[];
```

Defined in: [src/testing.ts:11](https://github.com/nestarc/api-keys/blob/7190c5d2e7408ee46a1de3ce65feff2e11cbfe7d/src/testing.ts#L11)

##### createdBy?

```ts
optional createdBy?: string;
```

Defined in: [src/testing.ts:10](https://github.com/nestarc/api-keys/blob/7190c5d2e7408ee46a1de3ce65feff2e11cbfe7d/src/testing.ts#L10)

##### environment?

```ts
optional environment?: Environment;
```

Defined in: [src/testing.ts:7](https://github.com/nestarc/api-keys/blob/7190c5d2e7408ee46a1de3ce65feff2e11cbfe7d/src/testing.ts#L7)

##### expiresAt?

```ts
optional expiresAt?: Date;
```

Defined in: [src/testing.ts:9](https://github.com/nestarc/api-keys/blob/7190c5d2e7408ee46a1de3ce65feff2e11cbfe7d/src/testing.ts#L9)

##### name?

```ts
optional name?: string;
```

Defined in: [src/testing.ts:6](https://github.com/nestarc/api-keys/blob/7190c5d2e7408ee46a1de3ce65feff2e11cbfe7d/src/testing.ts#L6)

##### scopes?

```ts
optional scopes?: Scope[];
```

Defined in: [src/testing.ts:8](https://github.com/nestarc/api-keys/blob/7190c5d2e7408ee46a1de3ce65feff2e11cbfe7d/src/testing.ts#L8)

##### tenantId?

```ts
optional tenantId?: string;
```

Defined in: [src/testing.ts:5](https://github.com/nestarc/api-keys/blob/7190c5d2e7408ee46a1de3ce65feff2e11cbfe7d/src/testing.ts#L5)

## Functions

### createTestKey()

```ts
function createTestKey(service, options?): Promise<CreateApiKeyResult & {
  context: ApiKeyContext;
}>;
```

Defined in: [src/testing.ts:14](https://github.com/nestarc/api-keys/blob/7190c5d2e7408ee46a1de3ce65feff2e11cbfe7d/src/testing.ts#L14)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `service` | [`ApiKeysService`](index.md#apikeysservice) |
| `options` | [`CreateTestKeyOptions`](#createtestkeyoptions) |

#### Returns

`Promise`\<[`CreateApiKeyResult`](index.md#createapikeyresult) & \{
  `context`: [`ApiKeyContext`](index.md#apikeycontext);
\}\>
