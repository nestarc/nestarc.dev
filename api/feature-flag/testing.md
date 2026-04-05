# testing

## Classes

### TestFeatureFlagModule

Defined in: [src/testing/test-feature-flag.module.ts:5](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/testing/test-feature-flag.module.ts#L5)

#### Constructors

##### Constructor

```ts
new TestFeatureFlagModule(): TestFeatureFlagModule;
```

###### Returns

[`TestFeatureFlagModule`](#testfeatureflagmodule)

#### Methods

##### register()

```ts
static register(flags?): DynamicModule;
```

Defined in: [src/testing/test-feature-flag.module.ts:6](https://github.com/nestarc/nestjs-feature-flag/blob/117c8a1ed45e3ad324abf392e5988cb0f55f8a2c/src/testing/test-feature-flag.module.ts#L6)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flags?` | `Record`\<`string`, `boolean`\> |

###### Returns

`DynamicModule`
