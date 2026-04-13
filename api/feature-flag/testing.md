# testing

## Classes

### TestFeatureFlagModule

Defined in: [src/testing/test-feature-flag.module.ts:26](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/testing/test-feature-flag.module.ts#L26)

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

Defined in: [src/testing/test-feature-flag.module.ts:27](https://github.com/nestarc/nestjs-feature-flag/blob/36aacd04b0f57e9cc42192378dcaffafa76c6dd8/src/testing/test-feature-flag.module.ts#L27)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flags?` | `Record`\<`string`, `boolean`\> |

###### Returns

`DynamicModule`
