# @nestarc/rbac

## Classes

<a id="api-inmemoryrbacstorage"></a>

### InMemoryRbacStorage

Defined in: [src/adapters/in-memory-rbac.storage.ts:109](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L109)

#### Implements

- [`RbacStorage`](#api-rbacstorage)

#### Constructors

<a id="api-constructor"></a>

##### Constructor

```ts
new InMemoryRbacStorage(): InMemoryRbacStorage;
```

###### Returns

[`InMemoryRbacStorage`](#api-inmemoryrbacstorage)

#### Methods

<a id="api-assignrole"></a>

##### assignRole()

```ts
assignRole(input): Promise<RbacRoleBinding>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:232](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L232)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`AssignRoleStorageInput`](#api-assignrolestorageinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](#api-rbacrolebinding)\>

###### Implementation of

[`RbacStorage`](#api-rbacstorage).[`assignRole`](#api-assignrole-2)

<a id="api-deleterole"></a>

##### deleteRole()

```ts
deleteRole(input): Promise<void>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:195](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L195)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`DeleteRoleInput`](#api-deleteroleinput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](#api-rbacstorage).[`deleteRole`](#api-deleterole-2)

<a id="api-findrole"></a>

##### findRole()

```ts
findRole(input): Promise<RbacRole | null>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:115](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L115)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`FindRoleInput`](#api-findroleinput) |

###### Returns

`Promise`\<[`RbacRole`](#api-rbacrole) \| `null`\>

###### Implementation of

[`RbacStorage`](#api-rbacstorage).[`findRole`](#api-findrole-1)

<a id="api-grantpermission"></a>

##### grantPermission()

```ts
grantPermission(input): Promise<void>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:206](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L206)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`GrantPermissionInput`](#api-grantpermissioninput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](#api-rbacstorage).[`grantPermission`](#api-grantpermission-2)

<a id="api-listbindings"></a>

##### listBindings()

```ts
listBindings(input): Promise<RbacRoleBinding[]>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:298](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L298)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListBindingsInput`](#api-listbindingsinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](#api-rbacrolebinding)[]\>

###### Implementation of

[`RbacStorage`](#api-rbacstorage).[`listBindings`](#api-listbindings-2)

<a id="api-listeffectivepermissions"></a>

##### listEffectivePermissions()

```ts
listEffectivePermissions(input): Promise<RbacEffectivePermission[]>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:315](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L315)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListEffectiveRolesInput`](#api-listeffectiverolesinput) |

###### Returns

`Promise`\<[`RbacEffectivePermission`](#api-rbaceffectivepermission)[]\>

###### Implementation of

[`RbacStorage`](#api-rbacstorage).[`listEffectivePermissions`](#api-listeffectivepermissions-1)

<a id="api-listeffectiveroles"></a>

##### listEffectiveRoles()

```ts
listEffectiveRoles(input): Promise<RbacEffectiveRole[]>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:311](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L311)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListEffectiveRolesInput`](#api-listeffectiverolesinput) |

###### Returns

`Promise`\<[`RbacEffectiveRole`](#api-rbaceffectiverole)[]\>

###### Implementation of

[`RbacStorage`](#api-rbacstorage).[`listEffectiveRoles`](#api-listeffectiveroles-1)

<a id="api-listrolepermissions"></a>

##### listRolePermissions()

```ts
listRolePermissions(input): Promise<string[]>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:228](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L228)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListRolePermissionsInput`](#api-listrolepermissionsinput) |

###### Returns

`Promise`\<`string`[]\>

###### Implementation of

[`RbacStorage`](#api-rbacstorage).[`listRolePermissions`](#api-listrolepermissions-1)

<a id="api-listroles"></a>

##### listRoles()

```ts
listRoles(input): Promise<RbacRole[]>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:125](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L125)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListRolesInput`](#api-listrolesinput) |

###### Returns

`Promise`\<[`RbacRole`](#api-rbacrole)[]\>

###### Implementation of

[`RbacStorage`](#api-rbacstorage).[`listRoles`](#api-listroles-2)

<a id="api-revokepermission"></a>

##### revokePermission()

```ts
revokePermission(input): Promise<void>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:218](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L218)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokePermissionInput`](#api-revokepermissioninput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](#api-rbacstorage).[`revokePermission`](#api-revokepermission-2)

<a id="api-revokerole"></a>

##### revokeRole()

```ts
revokeRole(input): Promise<void>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:289](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L289)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokeRoleInput`](#api-revokeroleinput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](#api-rbacstorage).[`revokeRole`](#api-revokerole-2)

<a id="api-upsertrole"></a>

##### upsertRole()

```ts
upsertRole(input): Promise<RbacRole>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:135](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L135)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`UpsertRoleInput`](#api-upsertroleinput) |

###### Returns

`Promise`\<[`RbacRole`](#api-rbacrole)\>

###### Implementation of

[`RbacStorage`](#api-rbacstorage).[`upsertRole`](#api-upsertrole-1)

***

<a id="api-nooprbacauditlogger"></a>

### NoopRbacAuditLogger

Defined in: [src/audit/noop-rbac-audit.logger.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/audit/noop-rbac-audit.logger.ts#L3)

#### Implements

- [`RbacAuditLogger`](#api-rbacauditlogger)

#### Constructors

<a id="api-constructor-1"></a>

##### Constructor

```ts
new NoopRbacAuditLogger(): NoopRbacAuditLogger;
```

###### Returns

[`NoopRbacAuditLogger`](#api-nooprbacauditlogger)

#### Methods

<a id="api-log"></a>

##### log()

```ts
log(event): void;
```

Defined in: [src/audit/noop-rbac-audit.logger.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/audit/noop-rbac-audit.logger.ts#L4)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`RbacAuditEvent`](#api-rbacauditevent) |

###### Returns

`void`

###### Implementation of

[`RbacAuditLogger`](#api-rbacauditlogger).[`log`](#api-log-1)

***

<a id="api-rbacbindingnotfounderror"></a>

### RbacBindingNotFoundError

Defined in: [src/errors/rbac.error.ts:89](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L89)

#### Extends

- [`RbacError`](#api-rbacerror)

#### Constructors

<a id="api-constructor-2"></a>

##### Constructor

```ts
new RbacBindingNotFoundError(details?, options?): RbacBindingNotFoundError;
```

Defined in: [src/errors/rbac.error.ts:90](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L90)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#api-rbacerrorcauseoptions) |

###### Returns

[`RbacBindingNotFoundError`](#api-rbacbindingnotfounderror)

###### Overrides

[`RbacError`](#api-rbacerror).[`constructor`](#api-constructor-4)

#### Properties

<a id="api-cause"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#api-rbacerror).[`cause`](#api-cause-2)

<a id="api-code"></a>

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#api-rbacerror).[`code`](#api-code-2)

<a id="api-details"></a>

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#api-rbacerror).[`details`](#api-details-3)

<a id="api-message"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#api-rbacerror).[`message`](#api-message-2)

<a id="api-name-1"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#api-rbacerror).[`name`](#api-name-3)

<a id="api-stack"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#api-rbacerror).[`stack`](#api-stack-2)

<a id="api-stacktracelimit"></a>

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:67

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

###### Inherited from

[`RbacError`](#api-rbacerror).[`stackTraceLimit`](#api-stacktracelimit-2)

<a id="api-status"></a>

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#api-rbacerror).[`status`](#api-status-2)

#### Methods

<a id="api-capturestacktrace"></a>

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:51

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`RbacError`](#api-rbacerror).[`captureStackTrace`](#api-capturestacktrace-2)

<a id="api-preparestacktrace"></a>

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:55

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`RbacError`](#api-rbacerror).[`prepareStackTrace`](#api-preparestacktrace-2)

***

<a id="api-rbacconfigerror"></a>

### RbacConfigError

Defined in: [src/errors/rbac.error.ts:38](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L38)

#### Extends

- [`RbacError`](#api-rbacerror)

#### Constructors

<a id="api-constructor-3"></a>

##### Constructor

```ts
new RbacConfigError(details?, options?): RbacConfigError;
```

Defined in: [src/errors/rbac.error.ts:39](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#api-rbacerrorcauseoptions) |

###### Returns

[`RbacConfigError`](#api-rbacconfigerror)

###### Overrides

[`RbacError`](#api-rbacerror).[`constructor`](#api-constructor-4)

#### Properties

<a id="api-cause-1"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#api-rbacerror).[`cause`](#api-cause-2)

<a id="api-code-1"></a>

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#api-rbacerror).[`code`](#api-code-2)

<a id="api-details-1"></a>

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#api-rbacerror).[`details`](#api-details-3)

<a id="api-message-1"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#api-rbacerror).[`message`](#api-message-2)

<a id="api-name-2"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#api-rbacerror).[`name`](#api-name-3)

<a id="api-stack-1"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#api-rbacerror).[`stack`](#api-stack-2)

<a id="api-stacktracelimit-1"></a>

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:67

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

###### Inherited from

[`RbacError`](#api-rbacerror).[`stackTraceLimit`](#api-stacktracelimit-2)

<a id="api-status-1"></a>

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#api-rbacerror).[`status`](#api-status-2)

#### Methods

<a id="api-capturestacktrace-1"></a>

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:51

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`RbacError`](#api-rbacerror).[`captureStackTrace`](#api-capturestacktrace-2)

<a id="api-preparestacktrace-1"></a>

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:55

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`RbacError`](#api-rbacerror).[`prepareStackTrace`](#api-preparestacktrace-2)

***

<a id="api-rbacerror"></a>

### RbacError

Defined in: [src/errors/rbac.error.ts:21](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L21)

#### Extends

- `Error`

#### Extended by

- [`RbacConfigError`](#api-rbacconfigerror)
- [`RbacSubjectMissingError`](#api-rbacsubjectmissingerror)
- [`RbacTenantMissingError`](#api-rbactenantmissingerror)
- [`RbacResourceMissingError`](#api-rbacresourcemissingerror)
- [`RbacPermissionDeniedError`](#api-rbacpermissiondeniederror)
- [`RbacRoleNotFoundError`](#api-rbacrolenotfounderror)
- [`RbacPermissionNotFoundError`](#api-rbacpermissionnotfounderror)
- [`RbacBindingNotFoundError`](#api-rbacbindingnotfounderror)
- [`RbacStorageError`](#api-rbacstorageerror)

#### Constructors

<a id="api-constructor-4"></a>

##### Constructor

```ts
new RbacError(
   message,
   code,
   status?,
   options?): RbacError;
```

Defined in: [src/errors/rbac.error.ts:22](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `code` | [`RbacErrorCode`](#api-rbacerrorcode-1) |
| `status?` | `number` |
| `options?` | [`RbacErrorOptions`](#api-rbacerroroptions) |

###### Returns

[`RbacError`](#api-rbacerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

<a id="api-cause-2"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

```ts
Error.cause
```

<a id="api-code-2"></a>

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

<a id="api-details-3"></a>

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

<a id="api-message-2"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

```ts
Error.message
```

<a id="api-name-3"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

```ts
Error.name
```

<a id="api-stack-2"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

```ts
Error.stack
```

<a id="api-stacktracelimit-2"></a>

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:67

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

###### Inherited from

```ts
Error.stackTraceLimit
```

<a id="api-status-2"></a>

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

#### Methods

<a id="api-capturestacktrace-2"></a>

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:51

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

```ts
Error.captureStackTrace
```

<a id="api-preparestacktrace-2"></a>

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:55

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

```ts
Error.prepareStackTrace
```

***

<a id="api-rbacguard"></a>

### RbacGuard

Defined in: [src/rbac.guard.ts:84](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.guard.ts#L84)

#### Implements

- `CanActivate`

#### Constructors

<a id="api-constructor-5"></a>

##### Constructor

```ts
new RbacGuard(
   reflector,
   rbac,
   options,
   moduleRef): RbacGuard;
```

Defined in: [src/rbac.guard.ts:85](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.guard.ts#L85)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `reflector` | `Reflector` |
| `rbac` | [`RbacService`](#api-rbacservice) |
| `options` | [`RbacModuleOptions`](#api-rbacmoduleoptions) |
| `moduleRef` | `ModuleRef` |

###### Returns

[`RbacGuard`](#api-rbacguard)

#### Methods

<a id="api-canactivate"></a>

##### canActivate()

```ts
canActivate(context): Promise<boolean>;
```

Defined in: [src/rbac.guard.ts:92](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.guard.ts#L92)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `ExecutionContext` | Current execution context. Provides access to details about the current request pipeline. |

###### Returns

`Promise`\<`boolean`\>

Value indicating whether or not the current request is allowed to
proceed.

###### Implementation of

```ts
CanActivate.canActivate
```

***

<a id="api-rbacmodule"></a>

### RbacModule

Defined in: [src/rbac.module.ts:16](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.module.ts#L16)

#### Constructors

<a id="api-constructor-6"></a>

##### Constructor

```ts
new RbacModule(): RbacModule;
```

###### Returns

[`RbacModule`](#api-rbacmodule)

#### Methods

<a id="api-forroot"></a>

##### forRoot()

```ts
static forRoot(options): DynamicModule;
```

Defined in: [src/rbac.module.ts:17](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.module.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RbacModuleOptions`](#api-rbacmoduleoptions) |

###### Returns

`DynamicModule`

<a id="api-forrootasync"></a>

##### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [src/rbac.module.ts:30](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.module.ts#L30)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RbacModuleAsyncOptions`](#api-rbacmoduleasyncoptions) |

###### Returns

`DynamicModule`

***

<a id="api-rbacpermissiondeniederror"></a>

### RbacPermissionDeniedError

Defined in: [src/errors/rbac.error.ts:65](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L65)

#### Extends

- [`RbacError`](#api-rbacerror)

#### Constructors

<a id="api-constructor-7"></a>

##### Constructor

```ts
new RbacPermissionDeniedError(details?, options?): RbacPermissionDeniedError;
```

Defined in: [src/errors/rbac.error.ts:66](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L66)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#api-rbacerrorcauseoptions) |

###### Returns

[`RbacPermissionDeniedError`](#api-rbacpermissiondeniederror)

###### Overrides

[`RbacError`](#api-rbacerror).[`constructor`](#api-constructor-4)

#### Properties

<a id="api-cause-5"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#api-rbacerror).[`cause`](#api-cause-2)

<a id="api-code-4"></a>

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#api-rbacerror).[`code`](#api-code-2)

<a id="api-details-5"></a>

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#api-rbacerror).[`details`](#api-details-3)

<a id="api-message-3"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#api-rbacerror).[`message`](#api-message-2)

<a id="api-name-4"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#api-rbacerror).[`name`](#api-name-3)

<a id="api-stack-3"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#api-rbacerror).[`stack`](#api-stack-2)

<a id="api-stacktracelimit-3"></a>

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:67

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

###### Inherited from

[`RbacError`](#api-rbacerror).[`stackTraceLimit`](#api-stacktracelimit-2)

<a id="api-status-3"></a>

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#api-rbacerror).[`status`](#api-status-2)

#### Methods

<a id="api-capturestacktrace-3"></a>

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:51

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`RbacError`](#api-rbacerror).[`captureStackTrace`](#api-capturestacktrace-2)

<a id="api-preparestacktrace-3"></a>

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:55

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`RbacError`](#api-rbacerror).[`prepareStackTrace`](#api-preparestacktrace-2)

***

<a id="api-rbacpermissionnotfounderror"></a>

### RbacPermissionNotFoundError

Defined in: [src/errors/rbac.error.ts:80](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L80)

#### Extends

- [`RbacError`](#api-rbacerror)

#### Constructors

<a id="api-constructor-8"></a>

##### Constructor

```ts
new RbacPermissionNotFoundError(details?, options?): RbacPermissionNotFoundError;
```

Defined in: [src/errors/rbac.error.ts:81](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L81)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#api-rbacerrorcauseoptions) |

###### Returns

[`RbacPermissionNotFoundError`](#api-rbacpermissionnotfounderror)

###### Overrides

[`RbacError`](#api-rbacerror).[`constructor`](#api-constructor-4)

#### Properties

<a id="api-cause-6"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#api-rbacerror).[`cause`](#api-cause-2)

<a id="api-code-5"></a>

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#api-rbacerror).[`code`](#api-code-2)

<a id="api-details-6"></a>

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#api-rbacerror).[`details`](#api-details-3)

<a id="api-message-4"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#api-rbacerror).[`message`](#api-message-2)

<a id="api-name-5"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#api-rbacerror).[`name`](#api-name-3)

<a id="api-stack-4"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#api-rbacerror).[`stack`](#api-stack-2)

<a id="api-stacktracelimit-4"></a>

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:67

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

###### Inherited from

[`RbacError`](#api-rbacerror).[`stackTraceLimit`](#api-stacktracelimit-2)

<a id="api-status-4"></a>

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#api-rbacerror).[`status`](#api-status-2)

#### Methods

<a id="api-capturestacktrace-4"></a>

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:51

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`RbacError`](#api-rbacerror).[`captureStackTrace`](#api-capturestacktrace-2)

<a id="api-preparestacktrace-4"></a>

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:55

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`RbacError`](#api-rbacerror).[`prepareStackTrace`](#api-preparestacktrace-2)

***

<a id="api-rbacresourcemissingerror"></a>

### RbacResourceMissingError

Defined in: [src/errors/rbac.error.ts:59](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L59)

#### Extends

- [`RbacError`](#api-rbacerror)

#### Constructors

<a id="api-constructor-9"></a>

##### Constructor

```ts
new RbacResourceMissingError(details?, options?): RbacResourceMissingError;
```

Defined in: [src/errors/rbac.error.ts:60](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L60)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#api-rbacerrorcauseoptions) |

###### Returns

[`RbacResourceMissingError`](#api-rbacresourcemissingerror)

###### Overrides

[`RbacError`](#api-rbacerror).[`constructor`](#api-constructor-4)

#### Properties

<a id="api-cause-7"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#api-rbacerror).[`cause`](#api-cause-2)

<a id="api-code-6"></a>

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#api-rbacerror).[`code`](#api-code-2)

<a id="api-details-7"></a>

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#api-rbacerror).[`details`](#api-details-3)

<a id="api-message-5"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#api-rbacerror).[`message`](#api-message-2)

<a id="api-name-6"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#api-rbacerror).[`name`](#api-name-3)

<a id="api-stack-5"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#api-rbacerror).[`stack`](#api-stack-2)

<a id="api-stacktracelimit-5"></a>

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:67

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

###### Inherited from

[`RbacError`](#api-rbacerror).[`stackTraceLimit`](#api-stacktracelimit-2)

<a id="api-status-5"></a>

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#api-rbacerror).[`status`](#api-status-2)

#### Methods

<a id="api-capturestacktrace-5"></a>

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:51

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`RbacError`](#api-rbacerror).[`captureStackTrace`](#api-capturestacktrace-2)

<a id="api-preparestacktrace-5"></a>

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:55

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`RbacError`](#api-rbacerror).[`prepareStackTrace`](#api-preparestacktrace-2)

***

<a id="api-rbacrolenotfounderror"></a>

### RbacRoleNotFoundError

Defined in: [src/errors/rbac.error.ts:74](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L74)

#### Extends

- [`RbacError`](#api-rbacerror)

#### Constructors

<a id="api-constructor-10"></a>

##### Constructor

```ts
new RbacRoleNotFoundError(details?, options?): RbacRoleNotFoundError;
```

Defined in: [src/errors/rbac.error.ts:75](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L75)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#api-rbacerrorcauseoptions) |

###### Returns

[`RbacRoleNotFoundError`](#api-rbacrolenotfounderror)

###### Overrides

[`RbacError`](#api-rbacerror).[`constructor`](#api-constructor-4)

#### Properties

<a id="api-cause-8"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#api-rbacerror).[`cause`](#api-cause-2)

<a id="api-code-7"></a>

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#api-rbacerror).[`code`](#api-code-2)

<a id="api-details-8"></a>

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#api-rbacerror).[`details`](#api-details-3)

<a id="api-message-6"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#api-rbacerror).[`message`](#api-message-2)

<a id="api-name-8"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#api-rbacerror).[`name`](#api-name-3)

<a id="api-stack-6"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#api-rbacerror).[`stack`](#api-stack-2)

<a id="api-stacktracelimit-6"></a>

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:67

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

###### Inherited from

[`RbacError`](#api-rbacerror).[`stackTraceLimit`](#api-stacktracelimit-2)

<a id="api-status-6"></a>

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#api-rbacerror).[`status`](#api-status-2)

#### Methods

<a id="api-capturestacktrace-6"></a>

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:51

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`RbacError`](#api-rbacerror).[`captureStackTrace`](#api-capturestacktrace-2)

<a id="api-preparestacktrace-6"></a>

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:55

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`RbacError`](#api-rbacerror).[`prepareStackTrace`](#api-preparestacktrace-2)

***

<a id="api-rbacservice"></a>

### RbacService

Defined in: [src/rbac.service.ts:82](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L82)

#### Constructors

<a id="api-constructor-11"></a>

##### Constructor

```ts
new RbacService(options): RbacService;
```

Defined in: [src/rbac.service.ts:83](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L83)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RbacModuleOptions`](#api-rbacmoduleoptions) |

###### Returns

[`RbacService`](#api-rbacservice)

#### Methods

<a id="api-assertcan"></a>

##### assertCan()

```ts
assertCan(input): Promise<void>;
```

Defined in: [src/rbac.service.ts:112](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L112)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RbacCanInput`](#api-rbaccaninput) |

###### Returns

`Promise`\<`void`\>

<a id="api-assignrole-1"></a>

##### assignRole()

```ts
assignRole(input): Promise<RbacRoleBinding>;
```

Defined in: [src/rbac.service.ts:201](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L201)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`AssignRoleInput`](#api-assignroleinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](#api-rbacrolebinding)\>

<a id="api-can-3"></a>

##### can()

```ts
can(input): Promise<RbacDecision>;
```

Defined in: [src/rbac.service.ts:85](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L85)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RbacCanInput`](#api-rbaccaninput) |

###### Returns

`Promise`\<[`RbacDecision`](#api-rbacdecision)\>

<a id="api-createrole"></a>

##### createRole()

```ts
createRole(input): Promise<RbacRole>;
```

Defined in: [src/rbac.service.ts:120](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L120)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`CreateRoleInput`](#api-createroleinput) |

###### Returns

`Promise`\<[`RbacRole`](#api-rbacrole)\>

<a id="api-deleterole-1"></a>

##### deleteRole()

```ts
deleteRole(input): Promise<void>;
```

Defined in: [src/rbac.service.ts:158](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L158)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`DeleteRoleInput`](#api-deleteroleinput) |

###### Returns

`Promise`\<`void`\>

<a id="api-grantpermission-1"></a>

##### grantPermission()

```ts
grantPermission(input): Promise<void>;
```

Defined in: [src/rbac.service.ts:171](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L171)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`GrantPermissionInput`](#api-grantpermissioninput) |

###### Returns

`Promise`\<`void`\>

<a id="api-listbindings-1"></a>

##### listBindings()

```ts
listBindings(input): Promise<RbacRoleBinding[]>;
```

Defined in: [src/rbac.service.ts:260](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L260)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListBindingsInput`](#api-listbindingsinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](#api-rbacrolebinding)[]\>

<a id="api-listpermissions"></a>

##### listPermissions()

```ts
listPermissions(input): Promise<string[]>;
```

Defined in: [src/rbac.service.ts:256](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L256)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListPermissionsInput`](#api-listpermissionsinput) |

###### Returns

`Promise`\<`string`[]\>

<a id="api-listroles-1"></a>

##### listRoles()

```ts
listRoles(input): Promise<RbacRole[]>;
```

Defined in: [src/rbac.service.ts:252](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L252)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListRolesInput`](#api-listrolesinput) |

###### Returns

`Promise`\<[`RbacRole`](#api-rbacrole)[]\>

<a id="api-revokepermission-1"></a>

##### revokePermission()

```ts
revokePermission(input): Promise<void>;
```

Defined in: [src/rbac.service.ts:186](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L186)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokePermissionInput`](#api-revokepermissioninput) |

###### Returns

`Promise`\<`void`\>

<a id="api-revokerole-1"></a>

##### revokeRole()

```ts
revokeRole(input): Promise<void>;
```

Defined in: [src/rbac.service.ts:239](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L239)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokeRoleInput`](#api-revokeroleinput) |

###### Returns

`Promise`\<`void`\>

<a id="api-updaterole"></a>

##### updateRole()

```ts
updateRole(input): Promise<RbacRole>;
```

Defined in: [src/rbac.service.ts:139](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L139)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`UpdateRoleInput`](#api-updateroleinput) |

###### Returns

`Promise`\<[`RbacRole`](#api-rbacrole)\>

***

<a id="api-rbacstorageerror"></a>

### RbacStorageError

Defined in: [src/errors/rbac.error.ts:95](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L95)

#### Extends

- [`RbacError`](#api-rbacerror)

#### Constructors

<a id="api-constructor-12"></a>

##### Constructor

```ts
new RbacStorageError(details?, options?): RbacStorageError;
```

Defined in: [src/errors/rbac.error.ts:96](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L96)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#api-rbacerrorcauseoptions) |

###### Returns

[`RbacStorageError`](#api-rbacstorageerror)

###### Overrides

[`RbacError`](#api-rbacerror).[`constructor`](#api-constructor-4)

#### Properties

<a id="api-cause-9"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#api-rbacerror).[`cause`](#api-cause-2)

<a id="api-code-8"></a>

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#api-rbacerror).[`code`](#api-code-2)

<a id="api-details-9"></a>

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#api-rbacerror).[`details`](#api-details-3)

<a id="api-message-7"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#api-rbacerror).[`message`](#api-message-2)

<a id="api-name-9"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#api-rbacerror).[`name`](#api-name-3)

<a id="api-stack-7"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#api-rbacerror).[`stack`](#api-stack-2)

<a id="api-stacktracelimit-7"></a>

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:67

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

###### Inherited from

[`RbacError`](#api-rbacerror).[`stackTraceLimit`](#api-stacktracelimit-2)

<a id="api-status-7"></a>

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#api-rbacerror).[`status`](#api-status-2)

#### Methods

<a id="api-capturestacktrace-7"></a>

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:51

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`RbacError`](#api-rbacerror).[`captureStackTrace`](#api-capturestacktrace-2)

<a id="api-preparestacktrace-7"></a>

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:55

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`RbacError`](#api-rbacerror).[`prepareStackTrace`](#api-preparestacktrace-2)

***

<a id="api-rbacsubjectmissingerror"></a>

### RbacSubjectMissingError

Defined in: [src/errors/rbac.error.ts:47](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L47)

#### Extends

- [`RbacError`](#api-rbacerror)

#### Constructors

<a id="api-constructor-13"></a>

##### Constructor

```ts
new RbacSubjectMissingError(details?, options?): RbacSubjectMissingError;
```

Defined in: [src/errors/rbac.error.ts:48](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L48)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#api-rbacerrorcauseoptions) |

###### Returns

[`RbacSubjectMissingError`](#api-rbacsubjectmissingerror)

###### Overrides

[`RbacError`](#api-rbacerror).[`constructor`](#api-constructor-4)

#### Properties

<a id="api-cause-10"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#api-rbacerror).[`cause`](#api-cause-2)

<a id="api-code-9"></a>

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#api-rbacerror).[`code`](#api-code-2)

<a id="api-details-10"></a>

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#api-rbacerror).[`details`](#api-details-3)

<a id="api-message-8"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#api-rbacerror).[`message`](#api-message-2)

<a id="api-name-10"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#api-rbacerror).[`name`](#api-name-3)

<a id="api-stack-8"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#api-rbacerror).[`stack`](#api-stack-2)

<a id="api-stacktracelimit-8"></a>

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:67

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

###### Inherited from

[`RbacError`](#api-rbacerror).[`stackTraceLimit`](#api-stacktracelimit-2)

<a id="api-status-8"></a>

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#api-rbacerror).[`status`](#api-status-2)

#### Methods

<a id="api-capturestacktrace-8"></a>

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:51

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`RbacError`](#api-rbacerror).[`captureStackTrace`](#api-capturestacktrace-2)

<a id="api-preparestacktrace-8"></a>

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:55

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`RbacError`](#api-rbacerror).[`prepareStackTrace`](#api-preparestacktrace-2)

***

<a id="api-rbactenantmissingerror"></a>

### RbacTenantMissingError

Defined in: [src/errors/rbac.error.ts:53](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L53)

#### Extends

- [`RbacError`](#api-rbacerror)

#### Constructors

<a id="api-constructor-14"></a>

##### Constructor

```ts
new RbacTenantMissingError(details?, options?): RbacTenantMissingError;
```

Defined in: [src/errors/rbac.error.ts:54](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L54)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#api-rbacerrorcauseoptions) |

###### Returns

[`RbacTenantMissingError`](#api-rbactenantmissingerror)

###### Overrides

[`RbacError`](#api-rbacerror).[`constructor`](#api-constructor-4)

#### Properties

<a id="api-cause-11"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#api-rbacerror).[`cause`](#api-cause-2)

<a id="api-code-10"></a>

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#api-rbacerror).[`code`](#api-code-2)

<a id="api-details-11"></a>

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#api-rbacerror).[`details`](#api-details-3)

<a id="api-message-9"></a>

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#api-rbacerror).[`message`](#api-message-2)

<a id="api-name-11"></a>

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#api-rbacerror).[`name`](#api-name-3)

<a id="api-stack-9"></a>

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#api-rbacerror).[`stack`](#api-stack-2)

<a id="api-stacktracelimit-9"></a>

##### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: node\_modules/@types/node/globals.d.ts:67

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

###### Inherited from

[`RbacError`](#api-rbacerror).[`stackTraceLimit`](#api-stacktracelimit-2)

<a id="api-status-9"></a>

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#api-rbacerror).[`status`](#api-status-2)

#### Methods

<a id="api-capturestacktrace-9"></a>

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:51

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`RbacError`](#api-rbacerror).[`captureStackTrace`](#api-capturestacktrace-2)

<a id="api-preparestacktrace-9"></a>

##### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:55

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`RbacError`](#api-rbacerror).[`prepareStackTrace`](#api-preparestacktrace-2)

## Interfaces

<a id="api-assignrolebaseinput"></a>

### AssignRoleBaseInput

Defined in: [src/interfaces/binding.ts:17](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L17)

#### Extended by

- [`AssignRoleStorageInput`](#api-assignrolestorageinput)

#### Properties

<a id="api-expiresat"></a>

##### expiresAt?

```ts
optional expiresAt?: Date | null;
```

Defined in: [src/interfaces/binding.ts:21](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L21)

<a id="api-metadata"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/binding.ts:22](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L22)

<a id="api-resource"></a>

##### resource?

```ts
optional resource?: RbacResourceRef;
```

Defined in: [src/interfaces/binding.ts:20](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L20)

<a id="api-subject"></a>

##### subject

```ts
subject: RbacSubject;
```

Defined in: [src/interfaces/binding.ts:19](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L19)

<a id="api-tenantid"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/binding.ts:18](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L18)

***

<a id="api-assignrolestorageinput"></a>

### AssignRoleStorageInput

Defined in: [src/interfaces/binding.ts:37](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L37)

#### Extends

- [`AssignRoleBaseInput`](#api-assignrolebaseinput)

#### Properties

<a id="api-expiresat-1"></a>

##### expiresAt?

```ts
optional expiresAt?: Date | null;
```

Defined in: [src/interfaces/binding.ts:21](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L21)

###### Inherited from

[`AssignRoleBaseInput`](#api-assignrolebaseinput).[`expiresAt`](#api-expiresat)

<a id="api-metadata-1"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/binding.ts:22](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L22)

###### Inherited from

[`AssignRoleBaseInput`](#api-assignrolebaseinput).[`metadata`](#api-metadata)

<a id="api-resource-1"></a>

##### resource?

```ts
optional resource?: RbacResourceRef;
```

Defined in: [src/interfaces/binding.ts:20](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L20)

###### Inherited from

[`AssignRoleBaseInput`](#api-assignrolebaseinput).[`resource`](#api-resource)

<a id="api-roleid"></a>

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/binding.ts:38](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L38)

<a id="api-subject-1"></a>

##### subject

```ts
subject: RbacSubject;
```

Defined in: [src/interfaces/binding.ts:19](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L19)

###### Inherited from

[`AssignRoleBaseInput`](#api-assignrolebaseinput).[`subject`](#api-subject)

<a id="api-tenantid-1"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/binding.ts:18](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L18)

###### Inherited from

[`AssignRoleBaseInput`](#api-assignrolebaseinput).[`tenantId`](#api-tenantid)

***

<a id="api-createroleinput"></a>

### CreateRoleInput

Defined in: [src/interfaces/role.ts:11](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L11)

#### Properties

<a id="api-description"></a>

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/role.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L15)

<a id="api-issystem"></a>

##### isSystem?

```ts
optional isSystem?: boolean;
```

Defined in: [src/interfaces/role.ts:16](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L16)

<a id="api-key"></a>

##### key

```ts
key: string;
```

Defined in: [src/interfaces/role.ts:13](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L13)

<a id="api-name"></a>

##### name?

```ts
optional name?: string;
```

Defined in: [src/interfaces/role.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L14)

<a id="api-permissions"></a>

##### permissions

```ts
permissions: string[];
```

Defined in: [src/interfaces/role.ts:17](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L17)

<a id="api-tenantid-2"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/role.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L12)

***

<a id="api-definerbacpermissionsoptions"></a>

### DefineRbacPermissionsOptions

Defined in: [src/permissions/define-rbac-permissions.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L9)

#### Properties

<a id="api-validateduplicates"></a>

##### validateDuplicates?

```ts
optional validateDuplicates?: boolean;
```

Defined in: [src/permissions/define-rbac-permissions.ts:10](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L10)

***

<a id="api-deleteroleinput"></a>

### DeleteRoleInput

Defined in: [src/interfaces/role.ts:30](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L30)

#### Properties

<a id="api-roleid-1"></a>

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/role.ts:31](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L31)

***

<a id="api-findroleinput"></a>

### FindRoleInput

Defined in: [src/interfaces/role.ts:38](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L38)

#### Properties

<a id="api-key-1"></a>

##### key

```ts
key: string;
```

Defined in: [src/interfaces/role.ts:40](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L40)

<a id="api-tenantid-3"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/role.ts:39](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L39)

***

<a id="api-grantpermissioninput"></a>

### GrantPermissionInput

Defined in: [src/interfaces/permission.ts:1](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L1)

#### Properties

<a id="api-permission"></a>

##### permission

```ts
permission: string;
```

Defined in: [src/interfaces/permission.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L3)

<a id="api-roleid-2"></a>

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/permission.ts:2](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L2)

***

<a id="api-listbindingsinput"></a>

### ListBindingsInput

Defined in: [src/interfaces/binding.ts:48](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L48)

#### Properties

<a id="api-subject-2"></a>

##### subject

```ts
subject: RbacSubject;
```

Defined in: [src/interfaces/binding.ts:50](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L50)

<a id="api-tenantid-4"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/binding.ts:49](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L49)

***

<a id="api-listeffectiverolesinput"></a>

### ListEffectiveRolesInput

Defined in: [src/interfaces/storage.ts:22](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L22)

#### Properties

<a id="api-now"></a>

##### now?

```ts
optional now?: Date;
```

Defined in: [src/interfaces/storage.ts:26](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L26)

<a id="api-resource-2"></a>

##### resource?

```ts
optional resource?: RbacResourceRef;
```

Defined in: [src/interfaces/storage.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L25)

<a id="api-subject-3"></a>

##### subject

```ts
subject: RbacSubject;
```

Defined in: [src/interfaces/storage.ts:23](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L23)

<a id="api-tenantid-5"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/storage.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L24)

***

<a id="api-listpermissionsinput"></a>

### ListPermissionsInput

Defined in: [src/interfaces/permission.ts:11](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L11)

#### Properties

<a id="api-roleid-3"></a>

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/permission.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L12)

***

<a id="api-listrolepermissionsinput"></a>

### ListRolePermissionsInput

Defined in: [src/interfaces/permission.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L15)

#### Properties

<a id="api-roleid-4"></a>

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/permission.ts:16](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L16)

***

<a id="api-listrolesinput"></a>

### ListRolesInput

Defined in: [src/interfaces/role.ts:34](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L34)

#### Properties

<a id="api-tenantid-6"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/role.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L35)

***

<a id="api-rbacauditevent"></a>

### RbacAuditEvent

Defined in: [src/interfaces/audit.ts:1](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/audit.ts#L1)

#### Properties

<a id="api-metadata-2"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/audit.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/audit.ts#L15)

<a id="api-subjectid"></a>

##### subjectId?

```ts
optional subjectId?: string;
```

Defined in: [src/interfaces/audit.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/audit.ts#L14)

<a id="api-subjecttype"></a>

##### subjectType?

```ts
optional subjectType?: string;
```

Defined in: [src/interfaces/audit.ts:13](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/audit.ts#L13)

<a id="api-tenantid-7"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/audit.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/audit.ts#L12)

<a id="api-type"></a>

##### type

```ts
type:
  | "rbac.role.created"
  | "rbac.role.updated"
  | "rbac.role.deleted"
  | "rbac.permission.granted"
  | "rbac.permission.revoked"
  | "rbac.role.assigned"
  | "rbac.role.revoked"
  | "rbac.permission.allowed"
  | "rbac.permission.denied";
```

Defined in: [src/interfaces/audit.ts:2](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/audit.ts#L2)

***

<a id="api-rbacauditlogger"></a>

### RbacAuditLogger

Defined in: [src/interfaces/audit.ts:18](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/audit.ts#L18)

#### Methods

<a id="api-log-1"></a>

##### log()

```ts
log(event): void | Promise<void>;
```

Defined in: [src/interfaces/audit.ts:19](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/audit.ts#L19)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`RbacAuditEvent`](#api-rbacauditevent) |

###### Returns

`void` \| `Promise`\<`void`\>

***

<a id="api-rbaccanbaseinput"></a>

### RbacCanBaseInput

Defined in: [src/interfaces/decision.ts:7](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L7)

#### Properties

<a id="api-now-1"></a>

##### now?

```ts
optional now?: Date;
```

Defined in: [src/interfaces/decision.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L12)

<a id="api-resource-3"></a>

##### resource?

```ts
optional resource?: RbacResourceRef;
```

Defined in: [src/interfaces/decision.ts:11](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L11)

<a id="api-subject-4"></a>

##### subject?

```ts
optional subject?: RbacSubject;
```

Defined in: [src/interfaces/decision.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L8)

<a id="api-tenantid-8"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/decision.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L9)

<a id="api-tenantmode"></a>

##### tenantMode?

```ts
optional tenantMode?: RbacTenantMode;
```

Defined in: [src/interfaces/decision.ts:10](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L10)

***

<a id="api-rbacdecision"></a>

### RbacDecision

Defined in: [src/interfaces/decision.ts:40](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L40)

#### Properties

<a id="api-allowed"></a>

##### allowed

```ts
allowed: boolean;
```

Defined in: [src/interfaces/decision.ts:41](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L41)

<a id="api-details-2"></a>

##### details?

```ts
optional details?: RbacDecisionDetails;
```

Defined in: [src/interfaces/decision.ts:52](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L52)

<a id="api-matchedpermissions"></a>

##### matchedPermissions?

```ts
optional matchedPermissions?: string[];
```

Defined in: [src/interfaces/decision.ts:50](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L50)

<a id="api-matchedrolekeys"></a>

##### matchedRoleKeys?

```ts
optional matchedRoleKeys?: string[];
```

Defined in: [src/interfaces/decision.ts:49](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L49)

<a id="api-mode"></a>

##### mode?

```ts
optional mode?: RbacRequirementMode;
```

Defined in: [src/interfaces/decision.ts:48](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L48)

<a id="api-permission-1"></a>

##### permission?

```ts
optional permission?: string;
```

Defined in: [src/interfaces/decision.ts:45](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L45)

<a id="api-permissions-1"></a>

##### permissions?

```ts
optional permissions?: string[];
```

Defined in: [src/interfaces/decision.ts:46](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L46)

<a id="api-reason"></a>

##### reason

```ts
reason: RbacDecisionReason;
```

Defined in: [src/interfaces/decision.ts:42](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L42)

<a id="api-resource-4"></a>

##### resource?

```ts
optional resource?: RbacResourceRef;
```

Defined in: [src/interfaces/decision.ts:51](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L51)

<a id="api-rolekey"></a>

##### roleKey?

```ts
optional roleKey?: string;
```

Defined in: [src/interfaces/decision.ts:47](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L47)

<a id="api-subject-5"></a>

##### subject?

```ts
optional subject?: RbacSubject;
```

Defined in: [src/interfaces/decision.ts:43](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L43)

<a id="api-tenantid-9"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/decision.ts:44](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L44)

***

<a id="api-rbacdecisiondetails-1"></a>

### RbacDecisionDetails

Defined in: [src/interfaces/decision.ts:55](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L55)

#### Properties

<a id="api-evaluationpath"></a>

##### evaluationPath?

```ts
optional evaluationPath?: RbacEvaluationStep[];
```

Defined in: [src/interfaces/decision.ts:59](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L59)

<a id="api-matched"></a>

##### matched?

```ts
optional matched?: RbacDecisionMatchDetails;
```

Defined in: [src/interfaces/decision.ts:57](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L57)

<a id="api-missing"></a>

##### missing?

```ts
optional missing?: RbacDecisionMissingDetails;
```

Defined in: [src/interfaces/decision.ts:58](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L58)

<a id="api-requirement"></a>

##### requirement?

```ts
optional requirement?: RbacDecisionRequirementDetails;
```

Defined in: [src/interfaces/decision.ts:56](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L56)

<a id="api-safemessage"></a>

##### safeMessage?

```ts
optional safeMessage?: string;
```

Defined in: [src/interfaces/decision.ts:60](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L60)

***

<a id="api-rbacdecisionmatchdetails"></a>

### RbacDecisionMatchDetails

Defined in: [src/interfaces/decision.ts:70](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L70)

#### Properties

<a id="api-bindingids"></a>

##### bindingIds?

```ts
optional bindingIds?: string[];
```

Defined in: [src/interfaces/decision.ts:74](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L74)

<a id="api-permissions-2"></a>

##### permissions?

```ts
optional permissions?: string[];
```

Defined in: [src/interfaces/decision.ts:73](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L73)

<a id="api-roleids"></a>

##### roleIds?

```ts
optional roleIds?: string[];
```

Defined in: [src/interfaces/decision.ts:71](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L71)

<a id="api-rolekeys"></a>

##### roleKeys?

```ts
optional roleKeys?: string[];
```

Defined in: [src/interfaces/decision.ts:72](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L72)

***

<a id="api-rbacdecisionmissingdetails"></a>

### RbacDecisionMissingDetails

Defined in: [src/interfaces/decision.ts:77](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L77)

#### Properties

<a id="api-permissions-3"></a>

##### permissions?

```ts
optional permissions?: string[];
```

Defined in: [src/interfaces/decision.ts:81](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L81)

<a id="api-resource-5"></a>

##### resource?

```ts
optional resource?: boolean;
```

Defined in: [src/interfaces/decision.ts:80](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L80)

<a id="api-rolekeys-1"></a>

##### roleKeys?

```ts
optional roleKeys?: string[];
```

Defined in: [src/interfaces/decision.ts:82](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L82)

<a id="api-subject-6"></a>

##### subject?

```ts
optional subject?: boolean;
```

Defined in: [src/interfaces/decision.ts:78](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L78)

<a id="api-tenant"></a>

##### tenant?

```ts
optional tenant?: boolean;
```

Defined in: [src/interfaces/decision.ts:79](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L79)

***

<a id="api-rbacdecisionrequirementdetails"></a>

### RbacDecisionRequirementDetails

Defined in: [src/interfaces/decision.ts:63](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L63)

#### Properties

<a id="api-mode-1"></a>

##### mode?

```ts
optional mode?: RbacRequirementMode;
```

Defined in: [src/interfaces/decision.ts:67](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L67)

<a id="api-permissions-4"></a>

##### permissions?

```ts
optional permissions?: string[];
```

Defined in: [src/interfaces/decision.ts:65](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L65)

<a id="api-rolekeys-2"></a>

##### roleKeys?

```ts
optional roleKeys?: string[];
```

Defined in: [src/interfaces/decision.ts:66](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L66)

<a id="api-type-1"></a>

##### type

```ts
type: "permission" | "role";
```

Defined in: [src/interfaces/decision.ts:64](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L64)

***

<a id="api-rbaceffectivepermission"></a>

### RbacEffectivePermission

Defined in: [src/interfaces/storage.ts:41](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L41)

#### Extends

- [`RbacEffectiveRole`](#api-rbaceffectiverole)

#### Properties

<a id="api-bindingid"></a>

##### bindingId

```ts
bindingId: string;
```

Defined in: [src/interfaces/storage.ts:34](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L34)

###### Inherited from

[`RbacEffectiveRole`](#api-rbaceffectiverole).[`bindingId`](#api-bindingid-1)

<a id="api-expiresat-2"></a>

##### expiresAt?

```ts
optional expiresAt?: Date | null;
```

Defined in: [src/interfaces/storage.ts:38](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L38)

###### Inherited from

[`RbacEffectiveRole`](#api-rbaceffectiverole).[`expiresAt`](#api-expiresat-3)

<a id="api-permission-2"></a>

##### permission

```ts
permission: string;
```

Defined in: [src/interfaces/storage.ts:42](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L42)

<a id="api-resourceid"></a>

##### resourceId?

```ts
optional resourceId?: string | null;
```

Defined in: [src/interfaces/storage.ts:37](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L37)

###### Inherited from

[`RbacEffectiveRole`](#api-rbaceffectiverole).[`resourceId`](#api-resourceid-1)

<a id="api-resourcetype"></a>

##### resourceType?

```ts
optional resourceType?: string | null;
```

Defined in: [src/interfaces/storage.ts:36](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L36)

###### Inherited from

[`RbacEffectiveRole`](#api-rbaceffectiverole).[`resourceType`](#api-resourcetype-1)

<a id="api-roleid-5"></a>

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/storage.ts:33](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L33)

###### Inherited from

[`RbacEffectiveRole`](#api-rbaceffectiverole).[`roleId`](#api-roleid-6)

<a id="api-rolekey-1"></a>

##### roleKey

```ts
roleKey: string;
```

Defined in: [src/interfaces/storage.ts:32](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L32)

###### Inherited from

[`RbacEffectiveRole`](#api-rbaceffectiverole).[`roleKey`](#api-rolekey-2)

<a id="api-tenantid-10"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/storage.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L35)

###### Inherited from

[`RbacEffectiveRole`](#api-rbaceffectiverole).[`tenantId`](#api-tenantid-11)

***

<a id="api-rbaceffectiverole"></a>

### RbacEffectiveRole

Defined in: [src/interfaces/storage.ts:31](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L31)

#### Extended by

- [`RbacEffectivePermission`](#api-rbaceffectivepermission)

#### Properties

<a id="api-bindingid-1"></a>

##### bindingId

```ts
bindingId: string;
```

Defined in: [src/interfaces/storage.ts:34](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L34)

<a id="api-expiresat-3"></a>

##### expiresAt?

```ts
optional expiresAt?: Date | null;
```

Defined in: [src/interfaces/storage.ts:38](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L38)

<a id="api-resourceid-1"></a>

##### resourceId?

```ts
optional resourceId?: string | null;
```

Defined in: [src/interfaces/storage.ts:37](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L37)

<a id="api-resourcetype-1"></a>

##### resourceType?

```ts
optional resourceType?: string | null;
```

Defined in: [src/interfaces/storage.ts:36](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L36)

<a id="api-roleid-6"></a>

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/storage.ts:33](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L33)

<a id="api-rolekey-2"></a>

##### roleKey

```ts
roleKey: string;
```

Defined in: [src/interfaces/storage.ts:32](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L32)

<a id="api-tenantid-11"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/storage.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L35)

***

<a id="api-rbacerrorcauseoptions"></a>

### RbacErrorCauseOptions

Defined in: [src/errors/rbac.error.ts:17](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L17)

#### Properties

<a id="api-cause-3"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: [src/errors/rbac.error.ts:18](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L18)

***

<a id="api-rbacerroroptions"></a>

### RbacErrorOptions

Defined in: [src/errors/rbac.error.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L12)

#### Properties

<a id="api-cause-4"></a>

##### cause?

```ts
optional cause?: unknown;
```

Defined in: [src/errors/rbac.error.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L14)

<a id="api-details-4"></a>

##### details?

```ts
optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:13](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L13)

***

<a id="api-rbacevaluationstep"></a>

### RbacEvaluationStep

Defined in: [src/interfaces/decision.ts:85](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L85)

#### Properties

<a id="api-code-3"></a>

##### code

```ts
code:
  | "subject_missing"
  | "tenant_missing"
  | "resource_missing"
  | "resource_mismatch"
  | "roles_loaded"
  | "permissions_loaded"
  | "permission_matched"
  | "permission_missing"
  | "role_matched"
  | "role_missing"
  | "storage_error";
```

Defined in: [src/interfaces/decision.ts:86](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L86)

<a id="api-outcome"></a>

##### outcome

```ts
outcome: "allow" | "deny" | "skip" | "info";
```

Defined in: [src/interfaces/decision.ts:98](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L98)

***

<a id="api-rbacmoduleasyncoptions"></a>

### RbacModuleAsyncOptions

Defined in: [src/interfaces/module-options.ts:59](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L59)

#### Properties

<a id="api-imports"></a>

##### imports?

```ts
optional imports?: (
  | Type<any>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference<any>)[];
```

Defined in: [src/interfaces/module-options.ts:60](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L60)

<a id="api-inject"></a>

##### inject?

```ts
optional inject?: (InjectionToken | OptionalFactoryDependency)[];
```

Defined in: [src/interfaces/module-options.ts:61](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L61)

<a id="api-usefactory"></a>

##### useFactory

```ts
useFactory: (...args) =>
  | RbacModuleOptions
| Promise<RbacModuleOptions>;
```

Defined in: [src/interfaces/module-options.ts:62](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L62)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

###### Returns

  \| [`RbacModuleOptions`](#api-rbacmoduleoptions)
  \| `Promise`\<[`RbacModuleOptions`](#api-rbacmoduleoptions)\>

***

<a id="api-rbacmoduleoptions"></a>

### RbacModuleOptions

Defined in: [src/interfaces/module-options.ts:40](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L40)

#### Properties

<a id="api-auditlogger"></a>

##### auditLogger?

```ts
optional auditLogger?: RbacAuditLogger;
```

Defined in: [src/interfaces/module-options.ts:44](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L44)

<a id="api-changepublisher"></a>

##### changePublisher?

```ts
optional changePublisher?: RbacPolicyChangePublisher;
```

Defined in: [src/interfaces/module-options.ts:55](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L55)

<a id="api-logalloweddecisions"></a>

##### logAllowedDecisions?

```ts
optional logAllowedDecisions?: boolean;
```

Defined in: [src/interfaces/module-options.ts:53](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L53)

<a id="api-now-2"></a>

##### now?

```ts
optional now?: () => Date;
```

Defined in: [src/interfaces/module-options.ts:56](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L56)

###### Returns

`Date`

<a id="api-requiremetadata"></a>

##### requireMetadata?

```ts
optional requireMetadata?: boolean;
```

Defined in: [src/interfaces/module-options.ts:45](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L45)

<a id="api-storage"></a>

##### storage

```ts
storage: RbacStorage;
```

Defined in: [src/interfaces/module-options.ts:41](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L41)

<a id="api-storageerrors"></a>

##### storageErrors?

```ts
optional storageErrors?: "deny" | "throw";
```

Defined in: [src/interfaces/module-options.ts:52](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L52)

<a id="api-subjectresolver"></a>

##### subjectResolver?

```ts
optional subjectResolver?: RbacSubjectResolver;
```

Defined in: [src/interfaces/module-options.ts:42](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L42)

<a id="api-tenant-1"></a>

##### tenant?

```ts
optional tenant?: {
  allowGlobalRolesInTenant?: boolean;
  requiredByDefault?: boolean;
};
```

Defined in: [src/interfaces/module-options.ts:46](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L46)

###### allowGlobalRolesInTenant?

```ts
optional allowGlobalRolesInTenant?: boolean;
```

###### requiredByDefault?

```ts
optional requiredByDefault?: boolean;
```

<a id="api-tenantresolver"></a>

##### tenantResolver?

```ts
optional tenantResolver?: RbacTenantResolver;
```

Defined in: [src/interfaces/module-options.ts:43](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L43)

<a id="api-writevalidation"></a>

##### writeValidation?

```ts
optional writeValidation?: RbacWriteValidationOptions;
```

Defined in: [src/interfaces/module-options.ts:54](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L54)

***

<a id="api-rbacpermissionmetadata"></a>

### RbacPermissionMetadata

Defined in: [src/permissions/define-rbac-permissions.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L3)

#### Properties

<a id="api-description-1"></a>

##### description?

```ts
optional description?: string;
```

Defined in: [src/permissions/define-rbac-permissions.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L4)

<a id="api-owner"></a>

##### owner?

```ts
optional owner?: string;
```

Defined in: [src/permissions/define-rbac-permissions.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L5)

<a id="api-risk"></a>

##### risk?

```ts
optional risk?: string;
```

Defined in: [src/permissions/define-rbac-permissions.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L6)

***

<a id="api-rbacpolicychangeevent"></a>

### RbacPolicyChangeEvent

Defined in: [src/interfaces/module-options.ts:23](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L23)

#### Properties

<a id="api-bindingid-2"></a>

##### bindingId?

```ts
optional bindingId?: string;
```

Defined in: [src/interfaces/module-options.ts:32](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L32)

<a id="api-metadata-3"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/module-options.ts:33](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L33)

<a id="api-occurredat"></a>

##### occurredAt

```ts
occurredAt: Date;
```

Defined in: [src/interfaces/module-options.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L25)

<a id="api-permissions-5"></a>

##### permissions?

```ts
optional permissions?: string[];
```

Defined in: [src/interfaces/module-options.ts:30](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L30)

<a id="api-resource-6"></a>

##### resource?

```ts
optional resource?: RbacResourceRef;
```

Defined in: [src/interfaces/module-options.ts:31](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L31)

<a id="api-roleid-7"></a>

##### roleId?

```ts
optional roleId?: string;
```

Defined in: [src/interfaces/module-options.ts:28](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L28)

<a id="api-rolekey-3"></a>

##### roleKey?

```ts
optional roleKey?: string;
```

Defined in: [src/interfaces/module-options.ts:29](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L29)

<a id="api-subject-7"></a>

##### subject?

```ts
optional subject?: Pick<RbacSubject, "type" | "id">;
```

Defined in: [src/interfaces/module-options.ts:27](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L27)

<a id="api-tenantid-12"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/module-options.ts:26](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L26)

<a id="api-type-4"></a>

##### type

```ts
type: RbacPolicyChangeEventType;
```

Defined in: [src/interfaces/module-options.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L24)

***

<a id="api-rbacpolicychangepublisher"></a>

### RbacPolicyChangePublisher

Defined in: [src/interfaces/module-options.ts:36](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L36)

#### Methods

<a id="api-publish"></a>

##### publish()

```ts
publish(event): void | Promise<void>;
```

Defined in: [src/interfaces/module-options.ts:37](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`RbacPolicyChangeEvent`](#api-rbacpolicychangeevent) |

###### Returns

`void` \| `Promise`\<`void`\>

***

<a id="api-rbacrequirementoptions"></a>

### RbacRequirementOptions

Defined in: [src/interfaces/requirements.ts:31](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L31)

#### Properties

<a id="api-mode-2"></a>

##### mode?

```ts
optional mode?: RbacRequirementMode;
```

Defined in: [src/interfaces/requirements.ts:32](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L32)

<a id="api-reason-1"></a>

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/interfaces/requirements.ts:40](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L40)

<a id="api-resource-7"></a>

##### resource?

```ts
optional resource?:
  | RbacBuiltInResourceDeclaration
  | RbacResourceResolverFn
  | RbacResourceResolverToken
  | RbacResourceResolverTokenRef;
```

Defined in: [src/interfaces/requirements.ts:34](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L34)

<a id="api-tenant-2"></a>

##### tenant?

```ts
optional tenant?: "required" | "optional" | "none";
```

Defined in: [src/interfaces/requirements.ts:33](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L33)

***

<a id="api-rbacresourceref"></a>

### RbacResourceRef

Defined in: [src/interfaces/resource.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resource.ts#L3)

#### Properties

<a id="api-id"></a>

##### id

```ts
id: string;
```

Defined in: [src/interfaces/resource.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resource.ts#L5)

<a id="api-type-6"></a>

##### type

```ts
type: string;
```

Defined in: [src/interfaces/resource.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resource.ts#L4)

***

<a id="api-rbacresourceresolver"></a>

### RbacResourceResolver

Defined in: [src/interfaces/resource.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resource.ts#L8)

#### Methods

<a id="api-resolve"></a>

##### resolve()

```ts
resolve(context):
  | RbacResourceRef
  | Promise<RbacResourceRef | undefined>
  | undefined;
```

Defined in: [src/interfaces/resource.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resource.ts#L9)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `ExecutionContext` |

###### Returns

  \| [`RbacResourceRef`](#api-rbacresourceref)
  \| `Promise`\<[`RbacResourceRef`](#api-rbacresourceref) \| `undefined`\>
  \| `undefined`

***

<a id="api-rbacresourceresolvertokenref"></a>

### RbacResourceResolverTokenRef

Defined in: [src/interfaces/resource.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resource.ts#L14)

#### Properties

<a id="api-resolvertoken"></a>

##### resolverToken

```ts
resolverToken: RbacResourceResolverToken;
```

Defined in: [src/interfaces/resource.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resource.ts#L15)

***

<a id="api-rbacrole"></a>

### RbacRole

Defined in: [src/interfaces/role.ts:1](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L1)

#### Properties

<a id="api-description-2"></a>

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/role.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L5)

<a id="api-id-1"></a>

##### id

```ts
id: string;
```

Defined in: [src/interfaces/role.ts:2](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L2)

<a id="api-issystem-1"></a>

##### isSystem?

```ts
optional isSystem?: boolean;
```

Defined in: [src/interfaces/role.ts:7](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L7)

<a id="api-key-2"></a>

##### key

```ts
key: string;
```

Defined in: [src/interfaces/role.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L3)

<a id="api-name-7"></a>

##### name?

```ts
optional name?: string;
```

Defined in: [src/interfaces/role.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L4)

<a id="api-permissions-6"></a>

##### permissions

```ts
permissions: string[];
```

Defined in: [src/interfaces/role.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L8)

<a id="api-tenantid-13"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/role.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L6)

***

<a id="api-rbacrolebinding"></a>

### RbacRoleBinding

Defined in: [src/interfaces/binding.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L4)

#### Properties

<a id="api-expiresat-4"></a>

##### expiresAt?

```ts
optional expiresAt?: Date | null;
```

Defined in: [src/interfaces/binding.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L12)

<a id="api-id-2"></a>

##### id

```ts
id: string;
```

Defined in: [src/interfaces/binding.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L5)

<a id="api-metadata-4"></a>

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/binding.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L14)

<a id="api-resourceid-2"></a>

##### resourceId?

```ts
optional resourceId?: string | null;
```

Defined in: [src/interfaces/binding.ts:11](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L11)

<a id="api-resourcetype-2"></a>

##### resourceType?

```ts
optional resourceType?: string | null;
```

Defined in: [src/interfaces/binding.ts:10](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L10)

<a id="api-revokedat"></a>

##### revokedAt?

```ts
optional revokedAt?: Date | null;
```

Defined in: [src/interfaces/binding.ts:13](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L13)

<a id="api-roleid-8"></a>

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/binding.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L9)

<a id="api-subjectid-1"></a>

##### subjectId

```ts
subjectId: string;
```

Defined in: [src/interfaces/binding.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L8)

<a id="api-subjecttype-1"></a>

##### subjectType

```ts
subjectType: string;
```

Defined in: [src/interfaces/binding.ts:7](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L7)

<a id="api-tenantid-14"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/binding.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L6)

***

<a id="api-rbacstorage"></a>

### RbacStorage

Defined in: [src/interfaces/storage.ts:45](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L45)

#### Methods

<a id="api-assignrole-2"></a>

##### assignRole()

```ts
assignRole(input): Promise<RbacRoleBinding>;
```

Defined in: [src/interfaces/storage.ts:53](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L53)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`AssignRoleStorageInput`](#api-assignrolestorageinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](#api-rbacrolebinding)\>

<a id="api-deleterole-2"></a>

##### deleteRole()

```ts
deleteRole(input): Promise<void>;
```

Defined in: [src/interfaces/storage.ts:49](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L49)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`DeleteRoleInput`](#api-deleteroleinput) |

###### Returns

`Promise`\<`void`\>

<a id="api-findrole-1"></a>

##### findRole()

```ts
findRole(input): Promise<RbacRole | null>;
```

Defined in: [src/interfaces/storage.ts:46](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L46)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`FindRoleInput`](#api-findroleinput) |

###### Returns

`Promise`\<[`RbacRole`](#api-rbacrole) \| `null`\>

<a id="api-grantpermission-2"></a>

##### grantPermission()

```ts
grantPermission(input): Promise<void>;
```

Defined in: [src/interfaces/storage.ts:50](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L50)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`GrantPermissionInput`](#api-grantpermissioninput) |

###### Returns

`Promise`\<`void`\>

<a id="api-listbindings-2"></a>

##### listBindings()

```ts
listBindings(input): Promise<RbacRoleBinding[]>;
```

Defined in: [src/interfaces/storage.ts:55](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L55)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListBindingsInput`](#api-listbindingsinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](#api-rbacrolebinding)[]\>

<a id="api-listeffectivepermissions-1"></a>

##### listEffectivePermissions()

```ts
listEffectivePermissions(input): Promise<RbacEffectivePermission[]>;
```

Defined in: [src/interfaces/storage.ts:57](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L57)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListEffectiveRolesInput`](#api-listeffectiverolesinput) |

###### Returns

`Promise`\<[`RbacEffectivePermission`](#api-rbaceffectivepermission)[]\>

<a id="api-listeffectiveroles-1"></a>

##### listEffectiveRoles()

```ts
listEffectiveRoles(input): Promise<RbacEffectiveRole[]>;
```

Defined in: [src/interfaces/storage.ts:56](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L56)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListEffectiveRolesInput`](#api-listeffectiverolesinput) |

###### Returns

`Promise`\<[`RbacEffectiveRole`](#api-rbaceffectiverole)[]\>

<a id="api-listrolepermissions-1"></a>

##### listRolePermissions()

```ts
listRolePermissions(input): Promise<string[]>;
```

Defined in: [src/interfaces/storage.ts:52](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L52)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListRolePermissionsInput`](#api-listrolepermissionsinput) |

###### Returns

`Promise`\<`string`[]\>

<a id="api-listroles-2"></a>

##### listRoles()

```ts
listRoles(input): Promise<RbacRole[]>;
```

Defined in: [src/interfaces/storage.ts:47](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L47)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListRolesInput`](#api-listrolesinput) |

###### Returns

`Promise`\<[`RbacRole`](#api-rbacrole)[]\>

<a id="api-revokepermission-2"></a>

##### revokePermission()

```ts
revokePermission(input): Promise<void>;
```

Defined in: [src/interfaces/storage.ts:51](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L51)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokePermissionInput`](#api-revokepermissioninput) |

###### Returns

`Promise`\<`void`\>

<a id="api-revokerole-2"></a>

##### revokeRole()

```ts
revokeRole(input): Promise<void>;
```

Defined in: [src/interfaces/storage.ts:54](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L54)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokeRoleInput`](#api-revokeroleinput) |

###### Returns

`Promise`\<`void`\>

<a id="api-upsertrole-1"></a>

##### upsertRole()

```ts
upsertRole(input): Promise<RbacRole>;
```

Defined in: [src/interfaces/storage.ts:48](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L48)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`UpsertRoleInput`](#api-upsertroleinput) |

###### Returns

`Promise`\<[`RbacRole`](#api-rbacrole)\>

***

<a id="api-rbacstoredresourceref"></a>

### RbacStoredResourceRef

Defined in: [src/utils/resource-matcher.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/utils/resource-matcher.ts#L3)

#### Properties

<a id="api-resourceid-3"></a>

##### resourceId?

```ts
optional resourceId?: string | null;
```

Defined in: [src/utils/resource-matcher.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/utils/resource-matcher.ts#L5)

<a id="api-resourcetype-3"></a>

##### resourceType?

```ts
optional resourceType?: string | null;
```

Defined in: [src/utils/resource-matcher.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/utils/resource-matcher.ts#L4)

***

<a id="api-rbacsubject"></a>

### RbacSubject

Defined in: [src/interfaces/subject.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/subject.ts#L3)

#### Properties

<a id="api-attributes"></a>

##### attributes?

```ts
optional attributes?: Record<string, unknown>;
```

Defined in: [src/interfaces/subject.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/subject.ts#L8)

<a id="api-displayname"></a>

##### displayName?

```ts
optional displayName?: string;
```

Defined in: [src/interfaces/subject.ts:7](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/subject.ts#L7)

<a id="api-id-3"></a>

##### id

```ts
id: string;
```

Defined in: [src/interfaces/subject.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/subject.ts#L5)

<a id="api-tenantid-15"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/subject.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/subject.ts#L6)

<a id="api-type-7"></a>

##### type

```ts
type: RbacSubjectType;
```

Defined in: [src/interfaces/subject.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/subject.ts#L4)

***

<a id="api-rbacwritevalidationoptions"></a>

### RbacWriteValidationOptions

Defined in: [src/interfaces/module-options.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L8)

#### Properties

<a id="api-rejectglobalroleintenantbinding"></a>

##### rejectGlobalRoleInTenantBinding?

```ts
optional rejectGlobalRoleInTenantBinding?: boolean;
```

Defined in: [src/interfaces/module-options.ts:11](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L11)

<a id="api-rejectresourcewithouttenant"></a>

##### rejectResourceWithoutTenant?

```ts
optional rejectResourceWithoutTenant?: boolean;
```

Defined in: [src/interfaces/module-options.ts:10](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L10)

<a id="api-rejecttenantmismatch"></a>

##### rejectTenantMismatch?

```ts
optional rejectTenantMismatch?: boolean;
```

Defined in: [src/interfaces/module-options.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L9)

***

<a id="api-revokepermissioninput"></a>

### RevokePermissionInput

Defined in: [src/interfaces/permission.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L6)

#### Properties

<a id="api-permission-3"></a>

##### permission

```ts
permission: string;
```

Defined in: [src/interfaces/permission.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L8)

<a id="api-roleid-9"></a>

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/permission.ts:7](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L7)

***

<a id="api-revokeroleinput"></a>

### RevokeRoleInput

Defined in: [src/interfaces/binding.ts:41](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L41)

#### Properties

<a id="api-bindingid-3"></a>

##### bindingId

```ts
bindingId: string;
```

Defined in: [src/interfaces/binding.ts:42](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L42)

<a id="api-revokedat-1"></a>

##### revokedAt?

```ts
optional revokedAt?: Date;
```

Defined in: [src/interfaces/binding.ts:43](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L43)

***

<a id="api-updateroleinput"></a>

### UpdateRoleInput

Defined in: [src/interfaces/role.ts:20](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L20)

#### Properties

<a id="api-description-3"></a>

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/role.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L25)

<a id="api-issystem-2"></a>

##### isSystem?

```ts
optional isSystem?: boolean;
```

Defined in: [src/interfaces/role.ts:26](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L26)

<a id="api-key-3"></a>

##### key?

```ts
optional key?: string;
```

Defined in: [src/interfaces/role.ts:23](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L23)

<a id="api-name-12"></a>

##### name?

```ts
optional name?: string;
```

Defined in: [src/interfaces/role.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L24)

<a id="api-permissions-7"></a>

##### permissions?

```ts
optional permissions?: string[];
```

Defined in: [src/interfaces/role.ts:27](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L27)

<a id="api-roleid-10"></a>

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/role.ts:21](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L21)

<a id="api-tenantid-16"></a>

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/role.ts:22](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L22)

## Type Aliases

<a id="api-assignroleinput"></a>

### AssignRoleInput

```ts
type AssignRoleInput = AssignRoleBaseInput &
  | {
  roleId: string;
  roleKey?: never;
}
  | {
  roleId?: never;
  roleKey: string;
};
```

Defined in: [src/interfaces/binding.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L25)

***

<a id="api-listbindingsstorageinput"></a>

### ListBindingsStorageInput

```ts
type ListBindingsStorageInput = ListBindingsInput;
```

Defined in: [src/interfaces/binding.ts:53](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L53)

***

<a id="api-listeffectivepermissionsinput"></a>

### ListEffectivePermissionsInput

```ts
type ListEffectivePermissionsInput = ListEffectiveRolesInput;
```

Defined in: [src/interfaces/storage.ts:29](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L29)

***

<a id="api-rbacbuiltinresourcedeclaration"></a>

### RbacBuiltInResourceDeclaration

```ts
type RbacBuiltInResourceDeclaration =
  | RbacParamResourceDeclaration
  | RbacHeaderResourceDeclaration
  | RbacQueryResourceDeclaration;
```

Defined in: [src/interfaces/requirements.ts:26](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L26)

***

<a id="api-rbaccaninput"></a>

### RbacCanInput

```ts
type RbacCanInput =
  | RbacPermissionCanInput
  | RbacRoleCanInput;
```

Defined in: [src/interfaces/decision.ts:38](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L38)

***

<a id="api-rbacdecisionreason-1"></a>

### RbacDecisionReason

```ts
type RbacDecisionReason =
  | "allowed_by_role"
  | "allowed_by_role_permission"
  | "denied_subject_missing"
  | "denied_tenant_missing"
  | "denied_resource_missing"
  | "denied_no_matching_role"
  | "denied_no_matching_permission"
  | "denied_role_expired"
  | "denied_resource_mismatch"
  | "denied_storage_error";
```

Defined in: [src/interfaces/decision.ts:101](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L101)

***

<a id="api-rbacerrorcode-1"></a>

### RbacErrorCode

```ts
type RbacErrorCode =
  | "RBAC_CONFIG_ERROR"
  | "RBAC_SUBJECT_MISSING"
  | "RBAC_TENANT_MISSING"
  | "RBAC_RESOURCE_MISSING"
  | "RBAC_PERMISSION_DENIED"
  | "RBAC_ROLE_NOT_FOUND"
  | "RBAC_PERMISSION_NOT_FOUND"
  | "RBAC_BINDING_NOT_FOUND"
  | "RBAC_STORAGE_ERROR";
```

Defined in: [src/errors/rbac.error.ts:1](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L1)

***

<a id="api-rbacheaderresourcedeclaration"></a>

### RbacHeaderResourceDeclaration

```ts
type RbacHeaderResourceDeclaration = {
  idHeader: string;
  idParam?: never;
  idQuery?: never;
  type: string;
};
```

Defined in: [src/interfaces/requirements.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L12)

#### Properties

<a id="api-idheader"></a>

##### idHeader

```ts
idHeader: string;
```

Defined in: [src/interfaces/requirements.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L14)

<a id="api-idparam"></a>

##### idParam?

```ts
optional idParam?: never;
```

Defined in: [src/interfaces/requirements.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L15)

<a id="api-idquery"></a>

##### idQuery?

```ts
optional idQuery?: never;
```

Defined in: [src/interfaces/requirements.ts:16](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L16)

<a id="api-type-2"></a>

##### type

```ts
type: string;
```

Defined in: [src/interfaces/requirements.ts:13](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L13)

***

<a id="api-rbacparamresourcedeclaration"></a>

### RbacParamResourceDeclaration

```ts
type RbacParamResourceDeclaration = {
  idHeader?: never;
  idParam: string;
  idQuery?: never;
  type: string;
};
```

Defined in: [src/interfaces/requirements.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L5)

#### Properties

<a id="api-idheader-1"></a>

##### idHeader?

```ts
optional idHeader?: never;
```

Defined in: [src/interfaces/requirements.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L8)

<a id="api-idparam-1"></a>

##### idParam

```ts
idParam: string;
```

Defined in: [src/interfaces/requirements.ts:7](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L7)

<a id="api-idquery-1"></a>

##### idQuery?

```ts
optional idQuery?: never;
```

Defined in: [src/interfaces/requirements.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L9)

<a id="api-type-3"></a>

##### type

```ts
type: string;
```

Defined in: [src/interfaces/requirements.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L6)

***

<a id="api-rbacpermissioncaninput"></a>

### RbacPermissionCanInput

```ts
type RbacPermissionCanInput = RbacCanBaseInput &
  | {
  mode?: RbacRequirementMode;
  permission: string;
  permissions?: string[];
  roleKey?: never;
}
  | {
  mode?: RbacRequirementMode;
  permission?: undefined;
  permissions: string[];
  roleKey?: never;
};
```

Defined in: [src/interfaces/decision.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L15)

***

<a id="api-rbacpermissioncontract"></a>

### RbacPermissionContract

```ts
type RbacPermissionContract<T> = PermissionShape<T> & {
  $metadata: PermissionMetadataMap<T>;
  $permission: PermissionValueUnion<T>;
  $permissions: PermissionValueUnion<T>[];
};
```

Defined in: [src/permissions/define-rbac-permissions.ts:45](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L45)

#### Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `$metadata` | `PermissionMetadataMap`\<`T`\> | [src/permissions/define-rbac-permissions.ts:48](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L48) |
| `$permission` | `PermissionValueUnion`\<`T`\> | [src/permissions/define-rbac-permissions.ts:46](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L46) |
| `$permissions` | `PermissionValueUnion`\<`T`\>[] | [src/permissions/define-rbac-permissions.ts:47](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L47) |

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

***

<a id="api-rbacpolicychangeeventtype-1"></a>

### RbacPolicyChangeEventType

```ts
type RbacPolicyChangeEventType =
  | "role.created"
  | "role.updated"
  | "role.deleted"
  | "permission.granted"
  | "permission.revoked"
  | "role.assigned"
  | "role.revoked";
```

Defined in: [src/interfaces/module-options.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L14)

***

<a id="api-rbacqueryresourcedeclaration"></a>

### RbacQueryResourceDeclaration

```ts
type RbacQueryResourceDeclaration = {
  idHeader?: never;
  idParam?: never;
  idQuery: string;
  type: string;
};
```

Defined in: [src/interfaces/requirements.ts:19](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L19)

#### Properties

<a id="api-idheader-2"></a>

##### idHeader?

```ts
optional idHeader?: never;
```

Defined in: [src/interfaces/requirements.ts:23](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L23)

<a id="api-idparam-2"></a>

##### idParam?

```ts
optional idParam?: never;
```

Defined in: [src/interfaces/requirements.ts:22](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L22)

<a id="api-idquery-2"></a>

##### idQuery

```ts
idQuery: string;
```

Defined in: [src/interfaces/requirements.ts:21](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L21)

<a id="api-type-5"></a>

##### type

```ts
type: string;
```

Defined in: [src/interfaces/requirements.ts:20](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L20)

***

<a id="api-rbacrequirement"></a>

### RbacRequirement

```ts
type RbacRequirement =
  | {
  kind: "permission";
  mode: RbacRequirementMode;
  options: RbacRequirementOptions;
  permissions: string[];
}
  | {
  kind: "role";
  options: RbacRequirementOptions;
  roleKey: string;
};
```

Defined in: [src/interfaces/requirements.ts:43](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L43)

***

<a id="api-rbacrequirementmode"></a>

### RbacRequirementMode

```ts
type RbacRequirementMode = "any" | "all";
```

Defined in: [src/interfaces/decision.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L5)

***

<a id="api-rbacresourceresolverfn"></a>

### RbacResourceResolverFn

```ts
type RbacResourceResolverFn = (context) =>
  | Promise<RbacResourceRef | undefined>
  | RbacResourceRef
  | undefined;
```

Defined in: [src/interfaces/resolvers.ts:16](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resolvers.ts#L16)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `ExecutionContext` |

#### Returns

  \| `Promise`\<[`RbacResourceRef`](#api-rbacresourceref) \| `undefined`\>
  \| [`RbacResourceRef`](#api-rbacresourceref)
  \| `undefined`

***

<a id="api-rbacresourceresolvertoken"></a>

### RbacResourceResolverToken

```ts
type RbacResourceResolverToken = InjectionToken<RbacResourceResolver>;
```

Defined in: [src/interfaces/resource.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resource.ts#L12)

***

<a id="api-rbacrolecaninput"></a>

### RbacRoleCanInput

```ts
type RbacRoleCanInput = RbacCanBaseInput & {
  mode?: never;
  permission?: never;
  permissions?: never;
  roleKey: string;
};
```

Defined in: [src/interfaces/decision.ts:31](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L31)

#### Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `mode?` | `never` | [src/interfaces/decision.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L35) |
| `permission?` | `never` | [src/interfaces/decision.ts:33](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L33) |
| `permissions?` | `never` | [src/interfaces/decision.ts:34](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L34) |
| `roleKey` | `string` | [src/interfaces/decision.ts:32](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L32) |

***

<a id="api-rbacsubjectresolver"></a>

### RbacSubjectResolver

```ts
type RbacSubjectResolver = (context) =>
  | Promise<RbacSubject | undefined>
  | RbacSubject
  | undefined;
```

Defined in: [src/interfaces/resolvers.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resolvers.ts#L6)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `ExecutionContext` |

#### Returns

  \| `Promise`\<[`RbacSubject`](#api-rbacsubject) \| `undefined`\>
  \| [`RbacSubject`](#api-rbacsubject)
  \| `undefined`

***

<a id="api-rbacsubjecttype-1"></a>

### RbacSubjectType

```ts
type RbacSubjectType =
  | "user"
  | "api_key"
  | "service_account"
  | string & {
};
```

Defined in: [src/interfaces/subject.ts:1](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/subject.ts#L1)

***

<a id="api-rbactenantmode"></a>

### RbacTenantMode

```ts
type RbacTenantMode = "required" | "optional" | "none";
```

Defined in: [src/interfaces/decision.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L4)

***

<a id="api-rbactenantresolver"></a>

### RbacTenantResolver

```ts
type RbacTenantResolver = (context, options, subject) =>
  | Promise<string | null | undefined>
  | string
  | null
  | undefined;
```

Defined in: [src/interfaces/resolvers.ts:10](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resolvers.ts#L10)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `ExecutionContext` |
| `options` | [`RbacRequirementOptions`](#api-rbacrequirementoptions) |
| `subject` | [`RbacSubject`](#api-rbacsubject) |

#### Returns

  \| `Promise`\<`string` \| `null` \| `undefined`\>
  \| `string`
  \| `null`
  \| `undefined`

***

<a id="api-revokerolestorageinput"></a>

### RevokeRoleStorageInput

```ts
type RevokeRoleStorageInput = RevokeRoleInput;
```

Defined in: [src/interfaces/binding.ts:46](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L46)

***

<a id="api-upsertroleinput"></a>

### UpsertRoleInput

```ts
type UpsertRoleInput =
  | CreateRoleInput
  | UpdateRoleInput;
```

Defined in: [src/interfaces/role.ts:43](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L43)

## Variables

<a id="api-currentrbacsubject"></a>

### CurrentRbacSubject

```ts
const CurrentRbacSubject: (...dataOrPipes) => ParameterDecorator;
```

Defined in: [src/decorators/current-rbac-subject.decorator.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/decorators/current-rbac-subject.decorator.ts#L6)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`dataOrPipes` | `unknown`[] |

#### Returns

`ParameterDecorator`

***

<a id="api-rbac_options"></a>

### RBAC\_OPTIONS

```ts
const RBAC_OPTIONS: typeof RBAC_OPTIONS;
```

Defined in: [src/constants.ts:1](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/constants.ts#L1)

***

<a id="api-rbac_requirements_metadata"></a>

### RBAC\_REQUIREMENTS\_METADATA

```ts
const RBAC_REQUIREMENTS_METADATA: typeof RBAC_REQUIREMENTS_METADATA;
```

Defined in: [src/constants.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/constants.ts#L3)

***

<a id="api-rbac_skip_metadata"></a>

### RBAC\_SKIP\_METADATA

```ts
const RBAC_SKIP_METADATA: typeof RBAC_SKIP_METADATA;
```

Defined in: [src/constants.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/constants.ts#L4)

***

<a id="api-rbac_storage"></a>

### RBAC\_STORAGE

```ts
const RBAC_STORAGE: typeof RBAC_STORAGE;
```

Defined in: [src/constants.ts:2](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/constants.ts#L2)

***

<a id="api-rbac_subject_request_key"></a>

### RBAC\_SUBJECT\_REQUEST\_KEY

```ts
const RBAC_SUBJECT_REQUEST_KEY: "rbacSubject" = 'rbacSubject';
```

Defined in: [src/constants.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/constants.ts#L5)

***

<a id="api-requirepermission"></a>

### RequirePermission

```ts
const RequirePermission: (permission, options) => ClassDecorator & MethodDecorator = Can;
```

Defined in: [src/decorators/permission.decorator.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/decorators/permission.decorator.ts#L15)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `permission` | `string` |
| `options` | [`RbacRequirementOptions`](#api-rbacrequirementoptions) |

#### Returns

`ClassDecorator` & `MethodDecorator`

## Functions

<a id="api-assertnonemptystring"></a>

### assertNonEmptyString()

```ts
function assertNonEmptyString(value, name): string;
```

Defined in: [src/utils/assertions.ts:1](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/utils/assertions.ts#L1)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `null` \| `undefined` |
| `name` | `string` |

#### Returns

`string`

***

<a id="api-can"></a>

### Can()

```ts
function Can(permission, options?): ClassDecorator & MethodDecorator;
```

Defined in: [src/decorators/permission.decorator.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/decorators/permission.decorator.ts#L4)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `permission` | `string` |
| `options` | [`RbacRequirementOptions`](#api-rbacrequirementoptions) |

#### Returns

`ClassDecorator` & `MethodDecorator`

***

<a id="api-createstrictrbacoptions"></a>

### createStrictRbacOptions()

```ts
function createStrictRbacOptions(options): RbacModuleOptions;
```

Defined in: [src/options/strict-rbac-options.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/options/strict-rbac-options.ts#L3)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RbacModuleOptions`](#api-rbacmoduleoptions) |

#### Returns

[`RbacModuleOptions`](#api-rbacmoduleoptions)

***

<a id="api-defaulthttpsubjectresolver"></a>

### defaultHttpSubjectResolver()

```ts
function defaultHttpSubjectResolver(): RbacSubjectResolver;
```

Defined in: [src/resolvers/default-http-subject.resolver.ts:103](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/resolvers/default-http-subject.resolver.ts#L103)

#### Returns

[`RbacSubjectResolver`](#api-rbacsubjectresolver)

***

<a id="api-definerbacpermissions"></a>

### defineRbacPermissions()

```ts
function defineRbacPermissions<T>(definition, options?): RbacPermissionContract<T>;
```

Defined in: [src/permissions/define-rbac-permissions.ts:76](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L76)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `PermissionDefinition` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `definition` | `T` |
| `options` | [`DefineRbacPermissionsOptions`](#api-definerbacpermissionsoptions) |

#### Returns

[`RbacPermissionContract`](#api-rbacpermissioncontract)\<`T`\>

***

<a id="api-maprbacerrortohttpexception"></a>

### mapRbacErrorToHttpException()

```ts
function mapRbacErrorToHttpException(error):
  | InternalServerErrorException
  | UnauthorizedException
  | ForbiddenException;
```

Defined in: [src/errors/http-error.mapper.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/http-error.mapper.ts#L8)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | [`RbacError`](#api-rbacerror) |

#### Returns

  \| `InternalServerErrorException`
  \| `UnauthorizedException`
  \| `ForbiddenException`

***

<a id="api-matchespermission"></a>

### matchesPermission()

```ts
function matchesPermission(granted, required): boolean;
```

Defined in: [src/utils/permission-matcher.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/utils/permission-matcher.ts#L3)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `granted` | `string` |
| `required` | `string` |

#### Returns

`boolean`

***

<a id="api-matchesresource"></a>

### matchesResource()

```ts
function matchesResource(granted, required): boolean;
```

Defined in: [src/utils/resource-matcher.ts:21](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/utils/resource-matcher.ts#L21)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `granted` | \| [`RbacResourceRef`](#api-rbacresourceref) \| [`RbacStoredResourceRef`](#api-rbacstoredresourceref) \| `undefined` |
| `required` | [`RbacResourceRef`](#api-rbacresourceref) \| `undefined` |

#### Returns

`boolean`

***

<a id="api-normalizepermission"></a>

### normalizePermission()

```ts
function normalizePermission(permission): string;
```

Defined in: [src/utils/normalize.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/utils/normalize.ts#L3)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `permission` | `string` |

#### Returns

`string`

***

<a id="api-normalizepermissions"></a>

### normalizePermissions()

```ts
function normalizePermissions(permissions): string[];
```

Defined in: [src/utils/normalize.ts:11](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/utils/normalize.ts#L11)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `permissions` | `string`[] |

#### Returns

`string`[]

***

<a id="api-requirepermissions"></a>

### RequirePermissions()

```ts
function RequirePermissions(permissions, options?): ClassDecorator & MethodDecorator;
```

Defined in: [src/decorators/permission.decorator.ts:17](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/decorators/permission.decorator.ts#L17)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `permissions` | readonly `string`[] |
| `options` | [`RbacRequirementOptions`](#api-rbacrequirementoptions) |

#### Returns

`ClassDecorator` & `MethodDecorator`

***

<a id="api-requirerole"></a>

### RequireRole()

```ts
function RequireRole(roleKey, options?): ClassDecorator & MethodDecorator;
```

Defined in: [src/decorators/role.decorator.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/decorators/role.decorator.ts#L4)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `roleKey` | `string` |
| `options` | [`RbacRequirementOptions`](#api-rbacrequirementoptions) |

#### Returns

`ClassDecorator` & `MethodDecorator`

***

<a id="api-resolvehttpresource"></a>

### resolveHttpResource()

```ts
function resolveHttpResource(context, declaration): RbacResourceRef | undefined;
```

Defined in: [src/resolvers/default-http-resource.resolver.ts:30](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/resolvers/default-http-resource.resolver.ts#L30)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `ExecutionContext` |
| `declaration` | [`RbacBuiltInResourceDeclaration`](#api-rbacbuiltinresourcedeclaration) |

#### Returns

[`RbacResourceRef`](#api-rbacresourceref) \| `undefined`

***

<a id="api-resolvehttptenant"></a>

### resolveHttpTenant()

```ts
function resolveHttpTenant(
   context,
   requirementOptions,
   subject): string | null | undefined;
```

Defined in: [src/resolvers/default-http-tenant.resolver.ts:36](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/resolvers/default-http-tenant.resolver.ts#L36)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `ExecutionContext` |
| `requirementOptions` | [`RbacRequirementOptions`](#api-rbacrequirementoptions) |
| `subject` | [`RbacSubject`](#api-rbacsubject) |

#### Returns

`string` \| `null` \| `undefined`

***

<a id="api-skiprbac"></a>

### SkipRbac()

```ts
function SkipRbac(reason?): CustomDecorator<typeof RBAC_SKIP_METADATA>;
```

Defined in: [src/decorators/skip-rbac.decorator.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/decorators/skip-rbac.decorator.ts#L4)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `reason?` | `string` |

#### Returns

`CustomDecorator`\<*typeof* [`RBAC_SKIP_METADATA`](#api-rbac_skip_metadata)\>
