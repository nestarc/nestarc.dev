# integrations/audit-log

## Interfaces

### AuditLogLike

Defined in: [rbac/src/integrations/audit-log.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/integrations/audit-log.ts#L3)

#### Methods

##### log()

```ts
log(event): void | Promise<void>;
```

Defined in: [rbac/src/integrations/audit-log.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/integrations/audit-log.ts#L4)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `Record`\<`string`, `unknown`\> |

###### Returns

`void` \| `Promise`\<`void`\>

***

### AuditLogRbacLoggerOptions

Defined in: [rbac/src/integrations/audit-log.ts:7](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/integrations/audit-log.ts#L7)

#### Properties

##### auditLog

```ts
auditLog: AuditLogLike;
```

Defined in: [rbac/src/integrations/audit-log.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/integrations/audit-log.ts#L8)

##### source?

```ts
optional source?: string;
```

Defined in: [rbac/src/integrations/audit-log.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/integrations/audit-log.ts#L9)

## Functions

### createAuditLogRbacLogger()

```ts
function createAuditLogRbacLogger(options): RbacAuditLogger;
```

Defined in: [rbac/src/integrations/audit-log.ts:55](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/integrations/audit-log.ts#L55)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditLogRbacLoggerOptions`](#auditlogrbacloggeroptions) |

#### Returns

[`RbacAuditLogger`](../index.md#rbacauditlogger)
