# integrations/audit-log

## Interfaces

<a id="api-auditloglike"></a>

### AuditLogLike

Defined in: [src/integrations/audit-log.ts:3](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/integrations/audit-log.ts#L3)

#### Methods

<a id="api-log"></a>

##### log()

```ts
log(event): void | Promise<void>;
```

Defined in: [src/integrations/audit-log.ts:4](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/integrations/audit-log.ts#L4)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `Record`\<`string`, `unknown`\> |

###### Returns

`void` \| `Promise`\<`void`\>

***

<a id="api-auditlogrbacloggeroptions"></a>

### AuditLogRbacLoggerOptions

Defined in: [src/integrations/audit-log.ts:7](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/integrations/audit-log.ts#L7)

#### Properties

<a id="api-auditlog"></a>

##### auditLog

```ts
auditLog: AuditLogLike;
```

Defined in: [src/integrations/audit-log.ts:8](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/integrations/audit-log.ts#L8)

<a id="api-source"></a>

##### source?

```ts
optional source?: string;
```

Defined in: [src/integrations/audit-log.ts:9](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/integrations/audit-log.ts#L9)

## Functions

<a id="api-createauditlogrbaclogger"></a>

### createAuditLogRbacLogger()

```ts
function createAuditLogRbacLogger(options): RbacAuditLogger;
```

Defined in: [src/integrations/audit-log.ts:55](https://github.com/nestarc/rbac/blob/7f88c621f32f6af52bd87bf929ae8416eae878ca/src/integrations/audit-log.ts#L55)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AuditLogRbacLoggerOptions`](#api-auditlogrbacloggeroptions) |

#### Returns

[`RbacAuditLogger`](../index.md#rbacauditlogger)
