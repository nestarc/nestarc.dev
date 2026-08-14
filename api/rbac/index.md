# @nestarc/rbac

## Classes

### InMemoryRbacStorage

Defined in: [src/adapters/in-memory-rbac.storage.ts:109](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L109)

#### Implements

- [`RbacStorage`](#rbacstorage)

#### Constructors

##### Constructor

```ts
new InMemoryRbacStorage(): InMemoryRbacStorage;
```

###### Returns

[`InMemoryRbacStorage`](#inmemoryrbacstorage)

#### Methods

##### assignRole()

```ts
assignRole(input): Promise<RbacRoleBinding>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:232](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L232)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`AssignRoleStorageInput`](#assignrolestorageinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](#rbacrolebinding)\>

###### Implementation of

[`RbacStorage`](#rbacstorage).[`assignRole`](#assignrole-2)

##### deleteRole()

```ts
deleteRole(input): Promise<void>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:195](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L195)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`DeleteRoleInput`](#deleteroleinput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](#rbacstorage).[`deleteRole`](#deleterole-2)

##### findRole()

```ts
findRole(input): Promise<RbacRole | null>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:115](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L115)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`FindRoleInput`](#findroleinput) |

###### Returns

`Promise`\<[`RbacRole`](#rbacrole) \| `null`\>

###### Implementation of

[`RbacStorage`](#rbacstorage).[`findRole`](#findrole-1)

##### grantPermission()

```ts
grantPermission(input): Promise<void>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:206](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L206)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`GrantPermissionInput`](#grantpermissioninput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](#rbacstorage).[`grantPermission`](#grantpermission-2)

##### listBindings()

```ts
listBindings(input): Promise<RbacRoleBinding[]>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:298](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L298)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListBindingsInput`](#listbindingsinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](#rbacrolebinding)[]\>

###### Implementation of

[`RbacStorage`](#rbacstorage).[`listBindings`](#listbindings-2)

##### listEffectivePermissions()

```ts
listEffectivePermissions(input): Promise<RbacEffectivePermission[]>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:315](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L315)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListEffectiveRolesInput`](#listeffectiverolesinput) |

###### Returns

`Promise`\<[`RbacEffectivePermission`](#rbaceffectivepermission)[]\>

###### Implementation of

[`RbacStorage`](#rbacstorage).[`listEffectivePermissions`](#listeffectivepermissions-1)

##### listEffectiveRoles()

```ts
listEffectiveRoles(input): Promise<RbacEffectiveRole[]>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:311](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L311)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListEffectiveRolesInput`](#listeffectiverolesinput) |

###### Returns

`Promise`\<[`RbacEffectiveRole`](#rbaceffectiverole)[]\>

###### Implementation of

[`RbacStorage`](#rbacstorage).[`listEffectiveRoles`](#listeffectiveroles-1)

##### listRolePermissions()

```ts
listRolePermissions(input): Promise<string[]>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:228](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L228)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListRolePermissionsInput`](#listrolepermissionsinput) |

###### Returns

`Promise`\<`string`[]\>

###### Implementation of

[`RbacStorage`](#rbacstorage).[`listRolePermissions`](#listrolepermissions-1)

##### listRoles()

```ts
listRoles(input): Promise<RbacRole[]>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:125](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L125)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListRolesInput`](#listrolesinput) |

###### Returns

`Promise`\<[`RbacRole`](#rbacrole)[]\>

###### Implementation of

[`RbacStorage`](#rbacstorage).[`listRoles`](#listroles-2)

##### revokePermission()

```ts
revokePermission(input): Promise<void>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:218](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L218)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokePermissionInput`](#revokepermissioninput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](#rbacstorage).[`revokePermission`](#revokepermission-2)

##### revokeRole()

```ts
revokeRole(input): Promise<void>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:289](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L289)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokeRoleInput`](#revokeroleinput) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`RbacStorage`](#rbacstorage).[`revokeRole`](#revokerole-2)

##### upsertRole()

```ts
upsertRole(input): Promise<RbacRole>;
```

Defined in: [src/adapters/in-memory-rbac.storage.ts:135](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/adapters/in-memory-rbac.storage.ts#L135)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`UpsertRoleInput`](#upsertroleinput) |

###### Returns

`Promise`\<[`RbacRole`](#rbacrole)\>

###### Implementation of

[`RbacStorage`](#rbacstorage).[`upsertRole`](#upsertrole-1)

***

### NoopRbacAuditLogger

Defined in: [src/audit/noop-rbac-audit.logger.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/audit/noop-rbac-audit.logger.ts#L3)

#### Implements

- [`RbacAuditLogger`](#rbacauditlogger)

#### Constructors

##### Constructor

```ts
new NoopRbacAuditLogger(): NoopRbacAuditLogger;
```

###### Returns

[`NoopRbacAuditLogger`](#nooprbacauditlogger)

#### Methods

##### log()

```ts
log(event): void;
```

Defined in: [src/audit/noop-rbac-audit.logger.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/audit/noop-rbac-audit.logger.ts#L4)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`RbacAuditEvent`](#rbacauditevent) |

###### Returns

`void`

###### Implementation of

[`RbacAuditLogger`](#rbacauditlogger).[`log`](#log-1)

***

### RbacBindingNotFoundError

Defined in: [src/errors/rbac.error.ts:89](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L89)

#### Extends

- [`RbacError`](#rbacerror)

#### Constructors

##### Constructor

```ts
new RbacBindingNotFoundError(details?, options?): RbacBindingNotFoundError;
```

Defined in: [src/errors/rbac.error.ts:90](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L90)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#rbacerrorcauseoptions) |

###### Returns

[`RbacBindingNotFoundError`](#rbacbindingnotfounderror)

###### Overrides

[`RbacError`](#rbacerror).[`constructor`](#constructor-4)

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#rbacerror).[`cause`](#cause-2)

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#rbacerror).[`code`](#code-2)

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#rbacerror).[`details`](#details-3)

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#rbacerror).[`message`](#message-2)

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#rbacerror).[`name`](#name-3)

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#rbacerror).[`stack`](#stack-2)

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

[`RbacError`](#rbacerror).[`stackTraceLimit`](#stacktracelimit-2)

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#rbacerror).[`status`](#status-2)

#### Methods

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

[`RbacError`](#rbacerror).[`captureStackTrace`](#capturestacktrace-2)

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

[`RbacError`](#rbacerror).[`prepareStackTrace`](#preparestacktrace-2)

***

### RbacConfigError

Defined in: [src/errors/rbac.error.ts:38](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L38)

#### Extends

- [`RbacError`](#rbacerror)

#### Constructors

##### Constructor

```ts
new RbacConfigError(details?, options?): RbacConfigError;
```

Defined in: [src/errors/rbac.error.ts:39](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L39)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#rbacerrorcauseoptions) |

###### Returns

[`RbacConfigError`](#rbacconfigerror)

###### Overrides

[`RbacError`](#rbacerror).[`constructor`](#constructor-4)

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#rbacerror).[`cause`](#cause-2)

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#rbacerror).[`code`](#code-2)

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#rbacerror).[`details`](#details-3)

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#rbacerror).[`message`](#message-2)

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#rbacerror).[`name`](#name-3)

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#rbacerror).[`stack`](#stack-2)

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

[`RbacError`](#rbacerror).[`stackTraceLimit`](#stacktracelimit-2)

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#rbacerror).[`status`](#status-2)

#### Methods

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

[`RbacError`](#rbacerror).[`captureStackTrace`](#capturestacktrace-2)

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

[`RbacError`](#rbacerror).[`prepareStackTrace`](#preparestacktrace-2)

***

### RbacError

Defined in: [src/errors/rbac.error.ts:21](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L21)

#### Extends

- `Error`

#### Extended by

- [`RbacConfigError`](#rbacconfigerror)
- [`RbacSubjectMissingError`](#rbacsubjectmissingerror)
- [`RbacTenantMissingError`](#rbactenantmissingerror)
- [`RbacResourceMissingError`](#rbacresourcemissingerror)
- [`RbacPermissionDeniedError`](#rbacpermissiondeniederror)
- [`RbacRoleNotFoundError`](#rbacrolenotfounderror)
- [`RbacPermissionNotFoundError`](#rbacpermissionnotfounderror)
- [`RbacBindingNotFoundError`](#rbacbindingnotfounderror)
- [`RbacStorageError`](#rbacstorageerror)

#### Constructors

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
| `code` | [`RbacErrorCode`](#rbacerrorcode) |
| `status?` | `number` |
| `options?` | [`RbacErrorOptions`](#rbacerroroptions) |

###### Returns

[`RbacError`](#rbacerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

```ts
Error.cause
```

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

```ts
Error.message
```

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

```ts
Error.name
```

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

```ts
Error.stack
```

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

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

#### Methods

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

### RbacGuard

Defined in: [src/rbac.guard.ts:84](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.guard.ts#L84)

#### Implements

- `CanActivate`

#### Constructors

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
| `rbac` | [`RbacService`](#rbacservice) |
| `options` | [`RbacModuleOptions`](#rbacmoduleoptions) |
| `moduleRef` | `ModuleRef` |

###### Returns

[`RbacGuard`](#rbacguard)

#### Methods

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

### RbacModule

Defined in: [src/rbac.module.ts:16](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.module.ts#L16)

#### Constructors

##### Constructor

```ts
new RbacModule(): RbacModule;
```

###### Returns

[`RbacModule`](#rbacmodule)

#### Methods

##### forRoot()

```ts
static forRoot(options): DynamicModule;
```

Defined in: [src/rbac.module.ts:17](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.module.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RbacModuleOptions`](#rbacmoduleoptions) |

###### Returns

`DynamicModule`

##### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [src/rbac.module.ts:30](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.module.ts#L30)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RbacModuleAsyncOptions`](#rbacmoduleasyncoptions) |

###### Returns

`DynamicModule`

***

### RbacPermissionDeniedError

Defined in: [src/errors/rbac.error.ts:65](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L65)

#### Extends

- [`RbacError`](#rbacerror)

#### Constructors

##### Constructor

```ts
new RbacPermissionDeniedError(details?, options?): RbacPermissionDeniedError;
```

Defined in: [src/errors/rbac.error.ts:66](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L66)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#rbacerrorcauseoptions) |

###### Returns

[`RbacPermissionDeniedError`](#rbacpermissiondeniederror)

###### Overrides

[`RbacError`](#rbacerror).[`constructor`](#constructor-4)

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#rbacerror).[`cause`](#cause-2)

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#rbacerror).[`code`](#code-2)

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#rbacerror).[`details`](#details-3)

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#rbacerror).[`message`](#message-2)

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#rbacerror).[`name`](#name-3)

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#rbacerror).[`stack`](#stack-2)

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

[`RbacError`](#rbacerror).[`stackTraceLimit`](#stacktracelimit-2)

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#rbacerror).[`status`](#status-2)

#### Methods

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

[`RbacError`](#rbacerror).[`captureStackTrace`](#capturestacktrace-2)

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

[`RbacError`](#rbacerror).[`prepareStackTrace`](#preparestacktrace-2)

***

### RbacPermissionNotFoundError

Defined in: [src/errors/rbac.error.ts:80](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L80)

#### Extends

- [`RbacError`](#rbacerror)

#### Constructors

##### Constructor

```ts
new RbacPermissionNotFoundError(details?, options?): RbacPermissionNotFoundError;
```

Defined in: [src/errors/rbac.error.ts:81](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L81)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#rbacerrorcauseoptions) |

###### Returns

[`RbacPermissionNotFoundError`](#rbacpermissionnotfounderror)

###### Overrides

[`RbacError`](#rbacerror).[`constructor`](#constructor-4)

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#rbacerror).[`cause`](#cause-2)

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#rbacerror).[`code`](#code-2)

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#rbacerror).[`details`](#details-3)

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#rbacerror).[`message`](#message-2)

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#rbacerror).[`name`](#name-3)

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#rbacerror).[`stack`](#stack-2)

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

[`RbacError`](#rbacerror).[`stackTraceLimit`](#stacktracelimit-2)

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#rbacerror).[`status`](#status-2)

#### Methods

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

[`RbacError`](#rbacerror).[`captureStackTrace`](#capturestacktrace-2)

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

[`RbacError`](#rbacerror).[`prepareStackTrace`](#preparestacktrace-2)

***

### RbacResourceMissingError

Defined in: [src/errors/rbac.error.ts:59](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L59)

#### Extends

- [`RbacError`](#rbacerror)

#### Constructors

##### Constructor

```ts
new RbacResourceMissingError(details?, options?): RbacResourceMissingError;
```

Defined in: [src/errors/rbac.error.ts:60](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L60)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#rbacerrorcauseoptions) |

###### Returns

[`RbacResourceMissingError`](#rbacresourcemissingerror)

###### Overrides

[`RbacError`](#rbacerror).[`constructor`](#constructor-4)

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#rbacerror).[`cause`](#cause-2)

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#rbacerror).[`code`](#code-2)

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#rbacerror).[`details`](#details-3)

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#rbacerror).[`message`](#message-2)

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#rbacerror).[`name`](#name-3)

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#rbacerror).[`stack`](#stack-2)

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

[`RbacError`](#rbacerror).[`stackTraceLimit`](#stacktracelimit-2)

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#rbacerror).[`status`](#status-2)

#### Methods

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

[`RbacError`](#rbacerror).[`captureStackTrace`](#capturestacktrace-2)

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

[`RbacError`](#rbacerror).[`prepareStackTrace`](#preparestacktrace-2)

***

### RbacRoleNotFoundError

Defined in: [src/errors/rbac.error.ts:74](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L74)

#### Extends

- [`RbacError`](#rbacerror)

#### Constructors

##### Constructor

```ts
new RbacRoleNotFoundError(details?, options?): RbacRoleNotFoundError;
```

Defined in: [src/errors/rbac.error.ts:75](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L75)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#rbacerrorcauseoptions) |

###### Returns

[`RbacRoleNotFoundError`](#rbacrolenotfounderror)

###### Overrides

[`RbacError`](#rbacerror).[`constructor`](#constructor-4)

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#rbacerror).[`cause`](#cause-2)

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#rbacerror).[`code`](#code-2)

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#rbacerror).[`details`](#details-3)

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#rbacerror).[`message`](#message-2)

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#rbacerror).[`name`](#name-3)

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#rbacerror).[`stack`](#stack-2)

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

[`RbacError`](#rbacerror).[`stackTraceLimit`](#stacktracelimit-2)

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#rbacerror).[`status`](#status-2)

#### Methods

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

[`RbacError`](#rbacerror).[`captureStackTrace`](#capturestacktrace-2)

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

[`RbacError`](#rbacerror).[`prepareStackTrace`](#preparestacktrace-2)

***

### RbacService

Defined in: [src/rbac.service.ts:82](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L82)

#### Constructors

##### Constructor

```ts
new RbacService(options): RbacService;
```

Defined in: [src/rbac.service.ts:83](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L83)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RbacModuleOptions`](#rbacmoduleoptions) |

###### Returns

[`RbacService`](#rbacservice)

#### Methods

##### assertCan()

```ts
assertCan(input): Promise<void>;
```

Defined in: [src/rbac.service.ts:112](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L112)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RbacCanInput`](#rbaccaninput) |

###### Returns

`Promise`\<`void`\>

##### assignRole()

```ts
assignRole(input): Promise<RbacRoleBinding>;
```

Defined in: [src/rbac.service.ts:201](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L201)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`AssignRoleInput`](#assignroleinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](#rbacrolebinding)\>

##### can()

```ts
can(input): Promise<RbacDecision>;
```

Defined in: [src/rbac.service.ts:85](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L85)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RbacCanInput`](#rbaccaninput) |

###### Returns

`Promise`\<[`RbacDecision`](#rbacdecision)\>

##### createRole()

```ts
createRole(input): Promise<RbacRole>;
```

Defined in: [src/rbac.service.ts:120](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L120)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`CreateRoleInput`](#createroleinput) |

###### Returns

`Promise`\<[`RbacRole`](#rbacrole)\>

##### deleteRole()

```ts
deleteRole(input): Promise<void>;
```

Defined in: [src/rbac.service.ts:158](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L158)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`DeleteRoleInput`](#deleteroleinput) |

###### Returns

`Promise`\<`void`\>

##### grantPermission()

```ts
grantPermission(input): Promise<void>;
```

Defined in: [src/rbac.service.ts:171](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L171)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`GrantPermissionInput`](#grantpermissioninput) |

###### Returns

`Promise`\<`void`\>

##### listBindings()

```ts
listBindings(input): Promise<RbacRoleBinding[]>;
```

Defined in: [src/rbac.service.ts:260](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L260)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListBindingsInput`](#listbindingsinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](#rbacrolebinding)[]\>

##### listPermissions()

```ts
listPermissions(input): Promise<string[]>;
```

Defined in: [src/rbac.service.ts:256](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L256)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListPermissionsInput`](#listpermissionsinput) |

###### Returns

`Promise`\<`string`[]\>

##### listRoles()

```ts
listRoles(input): Promise<RbacRole[]>;
```

Defined in: [src/rbac.service.ts:252](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L252)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListRolesInput`](#listrolesinput) |

###### Returns

`Promise`\<[`RbacRole`](#rbacrole)[]\>

##### revokePermission()

```ts
revokePermission(input): Promise<void>;
```

Defined in: [src/rbac.service.ts:186](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L186)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokePermissionInput`](#revokepermissioninput) |

###### Returns

`Promise`\<`void`\>

##### revokeRole()

```ts
revokeRole(input): Promise<void>;
```

Defined in: [src/rbac.service.ts:239](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L239)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokeRoleInput`](#revokeroleinput) |

###### Returns

`Promise`\<`void`\>

##### updateRole()

```ts
updateRole(input): Promise<RbacRole>;
```

Defined in: [src/rbac.service.ts:139](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/rbac.service.ts#L139)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`UpdateRoleInput`](#updateroleinput) |

###### Returns

`Promise`\<[`RbacRole`](#rbacrole)\>

***

### RbacStorageError

Defined in: [src/errors/rbac.error.ts:95](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L95)

#### Extends

- [`RbacError`](#rbacerror)

#### Constructors

##### Constructor

```ts
new RbacStorageError(details?, options?): RbacStorageError;
```

Defined in: [src/errors/rbac.error.ts:96](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L96)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#rbacerrorcauseoptions) |

###### Returns

[`RbacStorageError`](#rbacstorageerror)

###### Overrides

[`RbacError`](#rbacerror).[`constructor`](#constructor-4)

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#rbacerror).[`cause`](#cause-2)

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#rbacerror).[`code`](#code-2)

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#rbacerror).[`details`](#details-3)

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#rbacerror).[`message`](#message-2)

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#rbacerror).[`name`](#name-3)

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#rbacerror).[`stack`](#stack-2)

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

[`RbacError`](#rbacerror).[`stackTraceLimit`](#stacktracelimit-2)

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#rbacerror).[`status`](#status-2)

#### Methods

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

[`RbacError`](#rbacerror).[`captureStackTrace`](#capturestacktrace-2)

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

[`RbacError`](#rbacerror).[`prepareStackTrace`](#preparestacktrace-2)

***

### RbacSubjectMissingError

Defined in: [src/errors/rbac.error.ts:47](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L47)

#### Extends

- [`RbacError`](#rbacerror)

#### Constructors

##### Constructor

```ts
new RbacSubjectMissingError(details?, options?): RbacSubjectMissingError;
```

Defined in: [src/errors/rbac.error.ts:48](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L48)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#rbacerrorcauseoptions) |

###### Returns

[`RbacSubjectMissingError`](#rbacsubjectmissingerror)

###### Overrides

[`RbacError`](#rbacerror).[`constructor`](#constructor-4)

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#rbacerror).[`cause`](#cause-2)

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#rbacerror).[`code`](#code-2)

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#rbacerror).[`details`](#details-3)

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#rbacerror).[`message`](#message-2)

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#rbacerror).[`name`](#name-3)

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#rbacerror).[`stack`](#stack-2)

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

[`RbacError`](#rbacerror).[`stackTraceLimit`](#stacktracelimit-2)

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#rbacerror).[`status`](#status-2)

#### Methods

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

[`RbacError`](#rbacerror).[`captureStackTrace`](#capturestacktrace-2)

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

[`RbacError`](#rbacerror).[`prepareStackTrace`](#preparestacktrace-2)

***

### RbacTenantMissingError

Defined in: [src/errors/rbac.error.ts:53](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L53)

#### Extends

- [`RbacError`](#rbacerror)

#### Constructors

##### Constructor

```ts
new RbacTenantMissingError(details?, options?): RbacTenantMissingError;
```

Defined in: [src/errors/rbac.error.ts:54](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L54)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `details?` | `Record`\<`string`, `unknown`\> |
| `options?` | [`RbacErrorCauseOptions`](#rbacerrorcauseoptions) |

###### Returns

[`RbacTenantMissingError`](#rbactenantmissingerror)

###### Overrides

[`RbacError`](#rbacerror).[`constructor`](#constructor-4)

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

###### Inherited from

[`RbacError`](#rbacerror).[`cause`](#cause-2)

##### code

```ts
readonly code: RbacErrorCode;
```

Defined in: [src/errors/rbac.error.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L24)

###### Inherited from

[`RbacError`](#rbacerror).[`code`](#code-2)

##### details?

```ts
readonly optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L35)

###### Inherited from

[`RbacError`](#rbacerror).[`details`](#details-3)

##### message

```ts
message: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

###### Inherited from

[`RbacError`](#rbacerror).[`message`](#message-2)

##### name

```ts
name: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

###### Inherited from

[`RbacError`](#rbacerror).[`name`](#name-3)

##### stack?

```ts
optional stack?: string;
```

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

###### Inherited from

[`RbacError`](#rbacerror).[`stack`](#stack-2)

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

[`RbacError`](#rbacerror).[`stackTraceLimit`](#stacktracelimit-2)

##### status?

```ts
readonly optional status?: number;
```

Defined in: [src/errors/rbac.error.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L25)

###### Inherited from

[`RbacError`](#rbacerror).[`status`](#status-2)

#### Methods

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

[`RbacError`](#rbacerror).[`captureStackTrace`](#capturestacktrace-2)

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

[`RbacError`](#rbacerror).[`prepareStackTrace`](#preparestacktrace-2)

## Interfaces

### AssignRoleBaseInput

Defined in: [src/interfaces/binding.ts:17](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L17)

#### Extended by

- [`AssignRoleStorageInput`](#assignrolestorageinput)

#### Properties

##### expiresAt?

```ts
optional expiresAt?: Date | null;
```

Defined in: [src/interfaces/binding.ts:21](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L21)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/binding.ts:22](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L22)

##### resource?

```ts
optional resource?: RbacResourceRef;
```

Defined in: [src/interfaces/binding.ts:20](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L20)

##### subject

```ts
subject: RbacSubject;
```

Defined in: [src/interfaces/binding.ts:19](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L19)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/binding.ts:18](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L18)

***

### AssignRoleStorageInput

Defined in: [src/interfaces/binding.ts:37](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L37)

#### Extends

- [`AssignRoleBaseInput`](#assignrolebaseinput)

#### Properties

##### expiresAt?

```ts
optional expiresAt?: Date | null;
```

Defined in: [src/interfaces/binding.ts:21](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L21)

###### Inherited from

[`AssignRoleBaseInput`](#assignrolebaseinput).[`expiresAt`](#expiresat)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/binding.ts:22](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L22)

###### Inherited from

[`AssignRoleBaseInput`](#assignrolebaseinput).[`metadata`](#metadata)

##### resource?

```ts
optional resource?: RbacResourceRef;
```

Defined in: [src/interfaces/binding.ts:20](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L20)

###### Inherited from

[`AssignRoleBaseInput`](#assignrolebaseinput).[`resource`](#resource)

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/binding.ts:38](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L38)

##### subject

```ts
subject: RbacSubject;
```

Defined in: [src/interfaces/binding.ts:19](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L19)

###### Inherited from

[`AssignRoleBaseInput`](#assignrolebaseinput).[`subject`](#subject)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/binding.ts:18](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L18)

###### Inherited from

[`AssignRoleBaseInput`](#assignrolebaseinput).[`tenantId`](#tenantid)

***

### CreateRoleInput

Defined in: [src/interfaces/role.ts:11](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L11)

#### Properties

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/role.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L15)

##### isSystem?

```ts
optional isSystem?: boolean;
```

Defined in: [src/interfaces/role.ts:16](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L16)

##### key

```ts
key: string;
```

Defined in: [src/interfaces/role.ts:13](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L13)

##### name?

```ts
optional name?: string;
```

Defined in: [src/interfaces/role.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L14)

##### permissions

```ts
permissions: string[];
```

Defined in: [src/interfaces/role.ts:17](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L17)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/role.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L12)

***

### DefineRbacPermissionsOptions

Defined in: [src/permissions/define-rbac-permissions.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L9)

#### Properties

##### validateDuplicates?

```ts
optional validateDuplicates?: boolean;
```

Defined in: [src/permissions/define-rbac-permissions.ts:10](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L10)

***

### DeleteRoleInput

Defined in: [src/interfaces/role.ts:30](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L30)

#### Properties

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/role.ts:31](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L31)

***

### FindRoleInput

Defined in: [src/interfaces/role.ts:38](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L38)

#### Properties

##### key

```ts
key: string;
```

Defined in: [src/interfaces/role.ts:40](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L40)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/role.ts:39](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L39)

***

### GrantPermissionInput

Defined in: [src/interfaces/permission.ts:1](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L1)

#### Properties

##### permission

```ts
permission: string;
```

Defined in: [src/interfaces/permission.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L3)

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/permission.ts:2](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L2)

***

### ListBindingsInput

Defined in: [src/interfaces/binding.ts:48](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L48)

#### Properties

##### subject

```ts
subject: RbacSubject;
```

Defined in: [src/interfaces/binding.ts:50](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L50)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/binding.ts:49](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L49)

***

### ListEffectiveRolesInput

Defined in: [src/interfaces/storage.ts:22](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L22)

#### Properties

##### now?

```ts
optional now?: Date;
```

Defined in: [src/interfaces/storage.ts:26](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L26)

##### resource?

```ts
optional resource?: RbacResourceRef;
```

Defined in: [src/interfaces/storage.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L25)

##### subject

```ts
subject: RbacSubject;
```

Defined in: [src/interfaces/storage.ts:23](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L23)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/storage.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L24)

***

### ListPermissionsInput

Defined in: [src/interfaces/permission.ts:11](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L11)

#### Properties

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/permission.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L12)

***

### ListRolePermissionsInput

Defined in: [src/interfaces/permission.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L15)

#### Properties

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/permission.ts:16](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L16)

***

### ListRolesInput

Defined in: [src/interfaces/role.ts:34](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L34)

#### Properties

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/role.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L35)

***

### RbacAuditEvent

Defined in: [src/interfaces/audit.ts:1](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/audit.ts#L1)

#### Properties

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/audit.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/audit.ts#L15)

##### subjectId?

```ts
optional subjectId?: string;
```

Defined in: [src/interfaces/audit.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/audit.ts#L14)

##### subjectType?

```ts
optional subjectType?: string;
```

Defined in: [src/interfaces/audit.ts:13](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/audit.ts#L13)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/audit.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/audit.ts#L12)

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

### RbacAuditLogger

Defined in: [src/interfaces/audit.ts:18](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/audit.ts#L18)

#### Methods

##### log()

```ts
log(event): void | Promise<void>;
```

Defined in: [src/interfaces/audit.ts:19](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/audit.ts#L19)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`RbacAuditEvent`](#rbacauditevent) |

###### Returns

`void` \| `Promise`\<`void`\>

***

### RbacCanBaseInput

Defined in: [src/interfaces/decision.ts:7](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L7)

#### Properties

##### now?

```ts
optional now?: Date;
```

Defined in: [src/interfaces/decision.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L12)

##### resource?

```ts
optional resource?: RbacResourceRef;
```

Defined in: [src/interfaces/decision.ts:11](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L11)

##### subject?

```ts
optional subject?: RbacSubject;
```

Defined in: [src/interfaces/decision.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L8)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/decision.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L9)

##### tenantMode?

```ts
optional tenantMode?: RbacTenantMode;
```

Defined in: [src/interfaces/decision.ts:10](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L10)

***

### RbacDecision

Defined in: [src/interfaces/decision.ts:40](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L40)

#### Properties

##### allowed

```ts
allowed: boolean;
```

Defined in: [src/interfaces/decision.ts:41](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L41)

##### details?

```ts
optional details?: RbacDecisionDetails;
```

Defined in: [src/interfaces/decision.ts:52](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L52)

##### matchedPermissions?

```ts
optional matchedPermissions?: string[];
```

Defined in: [src/interfaces/decision.ts:50](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L50)

##### matchedRoleKeys?

```ts
optional matchedRoleKeys?: string[];
```

Defined in: [src/interfaces/decision.ts:49](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L49)

##### mode?

```ts
optional mode?: RbacRequirementMode;
```

Defined in: [src/interfaces/decision.ts:48](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L48)

##### permission?

```ts
optional permission?: string;
```

Defined in: [src/interfaces/decision.ts:45](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L45)

##### permissions?

```ts
optional permissions?: string[];
```

Defined in: [src/interfaces/decision.ts:46](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L46)

##### reason

```ts
reason: RbacDecisionReason;
```

Defined in: [src/interfaces/decision.ts:42](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L42)

##### resource?

```ts
optional resource?: RbacResourceRef;
```

Defined in: [src/interfaces/decision.ts:51](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L51)

##### roleKey?

```ts
optional roleKey?: string;
```

Defined in: [src/interfaces/decision.ts:47](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L47)

##### subject?

```ts
optional subject?: RbacSubject;
```

Defined in: [src/interfaces/decision.ts:43](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L43)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/decision.ts:44](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L44)

***

### RbacDecisionDetails

Defined in: [src/interfaces/decision.ts:55](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L55)

#### Properties

##### evaluationPath?

```ts
optional evaluationPath?: RbacEvaluationStep[];
```

Defined in: [src/interfaces/decision.ts:59](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L59)

##### matched?

```ts
optional matched?: RbacDecisionMatchDetails;
```

Defined in: [src/interfaces/decision.ts:57](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L57)

##### missing?

```ts
optional missing?: RbacDecisionMissingDetails;
```

Defined in: [src/interfaces/decision.ts:58](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L58)

##### requirement?

```ts
optional requirement?: RbacDecisionRequirementDetails;
```

Defined in: [src/interfaces/decision.ts:56](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L56)

##### safeMessage?

```ts
optional safeMessage?: string;
```

Defined in: [src/interfaces/decision.ts:60](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L60)

***

### RbacDecisionMatchDetails

Defined in: [src/interfaces/decision.ts:70](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L70)

#### Properties

##### bindingIds?

```ts
optional bindingIds?: string[];
```

Defined in: [src/interfaces/decision.ts:74](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L74)

##### permissions?

```ts
optional permissions?: string[];
```

Defined in: [src/interfaces/decision.ts:73](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L73)

##### roleIds?

```ts
optional roleIds?: string[];
```

Defined in: [src/interfaces/decision.ts:71](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L71)

##### roleKeys?

```ts
optional roleKeys?: string[];
```

Defined in: [src/interfaces/decision.ts:72](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L72)

***

### RbacDecisionMissingDetails

Defined in: [src/interfaces/decision.ts:77](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L77)

#### Properties

##### permissions?

```ts
optional permissions?: string[];
```

Defined in: [src/interfaces/decision.ts:81](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L81)

##### resource?

```ts
optional resource?: boolean;
```

Defined in: [src/interfaces/decision.ts:80](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L80)

##### roleKeys?

```ts
optional roleKeys?: string[];
```

Defined in: [src/interfaces/decision.ts:82](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L82)

##### subject?

```ts
optional subject?: boolean;
```

Defined in: [src/interfaces/decision.ts:78](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L78)

##### tenant?

```ts
optional tenant?: boolean;
```

Defined in: [src/interfaces/decision.ts:79](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L79)

***

### RbacDecisionRequirementDetails

Defined in: [src/interfaces/decision.ts:63](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L63)

#### Properties

##### mode?

```ts
optional mode?: RbacRequirementMode;
```

Defined in: [src/interfaces/decision.ts:67](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L67)

##### permissions?

```ts
optional permissions?: string[];
```

Defined in: [src/interfaces/decision.ts:65](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L65)

##### roleKeys?

```ts
optional roleKeys?: string[];
```

Defined in: [src/interfaces/decision.ts:66](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L66)

##### type

```ts
type: "permission" | "role";
```

Defined in: [src/interfaces/decision.ts:64](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L64)

***

### RbacEffectivePermission

Defined in: [src/interfaces/storage.ts:41](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L41)

#### Extends

- [`RbacEffectiveRole`](#rbaceffectiverole)

#### Properties

##### bindingId

```ts
bindingId: string;
```

Defined in: [src/interfaces/storage.ts:34](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L34)

###### Inherited from

[`RbacEffectiveRole`](#rbaceffectiverole).[`bindingId`](#bindingid-1)

##### expiresAt?

```ts
optional expiresAt?: Date | null;
```

Defined in: [src/interfaces/storage.ts:38](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L38)

###### Inherited from

[`RbacEffectiveRole`](#rbaceffectiverole).[`expiresAt`](#expiresat-3)

##### permission

```ts
permission: string;
```

Defined in: [src/interfaces/storage.ts:42](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L42)

##### resourceId?

```ts
optional resourceId?: string | null;
```

Defined in: [src/interfaces/storage.ts:37](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L37)

###### Inherited from

[`RbacEffectiveRole`](#rbaceffectiverole).[`resourceId`](#resourceid-1)

##### resourceType?

```ts
optional resourceType?: string | null;
```

Defined in: [src/interfaces/storage.ts:36](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L36)

###### Inherited from

[`RbacEffectiveRole`](#rbaceffectiverole).[`resourceType`](#resourcetype-1)

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/storage.ts:33](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L33)

###### Inherited from

[`RbacEffectiveRole`](#rbaceffectiverole).[`roleId`](#roleid-6)

##### roleKey

```ts
roleKey: string;
```

Defined in: [src/interfaces/storage.ts:32](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L32)

###### Inherited from

[`RbacEffectiveRole`](#rbaceffectiverole).[`roleKey`](#rolekey-2)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/storage.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L35)

###### Inherited from

[`RbacEffectiveRole`](#rbaceffectiverole).[`tenantId`](#tenantid-11)

***

### RbacEffectiveRole

Defined in: [src/interfaces/storage.ts:31](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L31)

#### Extended by

- [`RbacEffectivePermission`](#rbaceffectivepermission)

#### Properties

##### bindingId

```ts
bindingId: string;
```

Defined in: [src/interfaces/storage.ts:34](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L34)

##### expiresAt?

```ts
optional expiresAt?: Date | null;
```

Defined in: [src/interfaces/storage.ts:38](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L38)

##### resourceId?

```ts
optional resourceId?: string | null;
```

Defined in: [src/interfaces/storage.ts:37](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L37)

##### resourceType?

```ts
optional resourceType?: string | null;
```

Defined in: [src/interfaces/storage.ts:36](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L36)

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/storage.ts:33](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L33)

##### roleKey

```ts
roleKey: string;
```

Defined in: [src/interfaces/storage.ts:32](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L32)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/storage.ts:35](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L35)

***

### RbacErrorCauseOptions

Defined in: [src/errors/rbac.error.ts:17](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L17)

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: [src/errors/rbac.error.ts:18](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L18)

***

### RbacErrorOptions

Defined in: [src/errors/rbac.error.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L12)

#### Properties

##### cause?

```ts
optional cause?: unknown;
```

Defined in: [src/errors/rbac.error.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L14)

##### details?

```ts
optional details?: Record<string, unknown>;
```

Defined in: [src/errors/rbac.error.ts:13](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/errors/rbac.error.ts#L13)

***

### RbacEvaluationStep

Defined in: [src/interfaces/decision.ts:85](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L85)

#### Properties

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

##### outcome

```ts
outcome: "allow" | "deny" | "skip" | "info";
```

Defined in: [src/interfaces/decision.ts:98](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L98)

***

### RbacModuleAsyncOptions

Defined in: [src/interfaces/module-options.ts:59](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L59)

#### Properties

##### imports?

```ts
optional imports?: (
  | Type<any>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference<any>)[];
```

Defined in: [src/interfaces/module-options.ts:60](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L60)

##### inject?

```ts
optional inject?: (InjectionToken | OptionalFactoryDependency)[];
```

Defined in: [src/interfaces/module-options.ts:61](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L61)

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

  \| [`RbacModuleOptions`](#rbacmoduleoptions)
  \| `Promise`\<[`RbacModuleOptions`](#rbacmoduleoptions)\>

***

### RbacModuleOptions

Defined in: [src/interfaces/module-options.ts:40](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L40)

#### Properties

##### auditLogger?

```ts
optional auditLogger?: RbacAuditLogger;
```

Defined in: [src/interfaces/module-options.ts:44](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L44)

##### changePublisher?

```ts
optional changePublisher?: RbacPolicyChangePublisher;
```

Defined in: [src/interfaces/module-options.ts:55](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L55)

##### logAllowedDecisions?

```ts
optional logAllowedDecisions?: boolean;
```

Defined in: [src/interfaces/module-options.ts:53](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L53)

##### now?

```ts
optional now?: () => Date;
```

Defined in: [src/interfaces/module-options.ts:56](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L56)

###### Returns

`Date`

##### requireMetadata?

```ts
optional requireMetadata?: boolean;
```

Defined in: [src/interfaces/module-options.ts:45](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L45)

##### storage

```ts
storage: RbacStorage;
```

Defined in: [src/interfaces/module-options.ts:41](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L41)

##### storageErrors?

```ts
optional storageErrors?: "deny" | "throw";
```

Defined in: [src/interfaces/module-options.ts:52](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L52)

##### subjectResolver?

```ts
optional subjectResolver?: RbacSubjectResolver;
```

Defined in: [src/interfaces/module-options.ts:42](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L42)

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

##### tenantResolver?

```ts
optional tenantResolver?: RbacTenantResolver;
```

Defined in: [src/interfaces/module-options.ts:43](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L43)

##### writeValidation?

```ts
optional writeValidation?: RbacWriteValidationOptions;
```

Defined in: [src/interfaces/module-options.ts:54](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L54)

***

### RbacPermissionMetadata

Defined in: [src/permissions/define-rbac-permissions.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L3)

#### Properties

##### description?

```ts
optional description?: string;
```

Defined in: [src/permissions/define-rbac-permissions.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L4)

##### owner?

```ts
optional owner?: string;
```

Defined in: [src/permissions/define-rbac-permissions.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L5)

##### risk?

```ts
optional risk?: string;
```

Defined in: [src/permissions/define-rbac-permissions.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/permissions/define-rbac-permissions.ts#L6)

***

### RbacPolicyChangeEvent

Defined in: [src/interfaces/module-options.ts:23](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L23)

#### Properties

##### bindingId?

```ts
optional bindingId?: string;
```

Defined in: [src/interfaces/module-options.ts:32](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L32)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/module-options.ts:33](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L33)

##### occurredAt

```ts
occurredAt: Date;
```

Defined in: [src/interfaces/module-options.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L25)

##### permissions?

```ts
optional permissions?: string[];
```

Defined in: [src/interfaces/module-options.ts:30](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L30)

##### resource?

```ts
optional resource?: RbacResourceRef;
```

Defined in: [src/interfaces/module-options.ts:31](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L31)

##### roleId?

```ts
optional roleId?: string;
```

Defined in: [src/interfaces/module-options.ts:28](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L28)

##### roleKey?

```ts
optional roleKey?: string;
```

Defined in: [src/interfaces/module-options.ts:29](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L29)

##### subject?

```ts
optional subject?: Pick<RbacSubject, "type" | "id">;
```

Defined in: [src/interfaces/module-options.ts:27](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L27)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/module-options.ts:26](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L26)

##### type

```ts
type: RbacPolicyChangeEventType;
```

Defined in: [src/interfaces/module-options.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L24)

***

### RbacPolicyChangePublisher

Defined in: [src/interfaces/module-options.ts:36](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L36)

#### Methods

##### publish()

```ts
publish(event): void | Promise<void>;
```

Defined in: [src/interfaces/module-options.ts:37](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`RbacPolicyChangeEvent`](#rbacpolicychangeevent) |

###### Returns

`void` \| `Promise`\<`void`\>

***

### RbacRequirementOptions

Defined in: [src/interfaces/requirements.ts:31](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L31)

#### Properties

##### mode?

```ts
optional mode?: RbacRequirementMode;
```

Defined in: [src/interfaces/requirements.ts:32](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L32)

##### reason?

```ts
optional reason?: string;
```

Defined in: [src/interfaces/requirements.ts:40](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L40)

##### resource?

```ts
optional resource?: 
  | RbacBuiltInResourceDeclaration
  | RbacResourceResolverFn
  | RbacResourceResolverToken
  | RbacResourceResolverTokenRef;
```

Defined in: [src/interfaces/requirements.ts:34](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L34)

##### tenant?

```ts
optional tenant?: "required" | "optional" | "none";
```

Defined in: [src/interfaces/requirements.ts:33](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L33)

***

### RbacResourceRef

Defined in: [src/interfaces/resource.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resource.ts#L3)

#### Properties

##### id

```ts
id: string;
```

Defined in: [src/interfaces/resource.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resource.ts#L5)

##### type

```ts
type: string;
```

Defined in: [src/interfaces/resource.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resource.ts#L4)

***

### RbacResourceResolver

Defined in: [src/interfaces/resource.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resource.ts#L8)

#### Methods

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

  \| [`RbacResourceRef`](#rbacresourceref)
  \| `Promise`\<[`RbacResourceRef`](#rbacresourceref) \| `undefined`\>
  \| `undefined`

***

### RbacResourceResolverTokenRef

Defined in: [src/interfaces/resource.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resource.ts#L14)

#### Properties

##### resolverToken

```ts
resolverToken: RbacResourceResolverToken;
```

Defined in: [src/interfaces/resource.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resource.ts#L15)

***

### RbacRole

Defined in: [src/interfaces/role.ts:1](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L1)

#### Properties

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/role.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L5)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/role.ts:2](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L2)

##### isSystem?

```ts
optional isSystem?: boolean;
```

Defined in: [src/interfaces/role.ts:7](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L7)

##### key

```ts
key: string;
```

Defined in: [src/interfaces/role.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L3)

##### name?

```ts
optional name?: string;
```

Defined in: [src/interfaces/role.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L4)

##### permissions

```ts
permissions: string[];
```

Defined in: [src/interfaces/role.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L8)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/role.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L6)

***

### RbacRoleBinding

Defined in: [src/interfaces/binding.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L4)

#### Properties

##### expiresAt?

```ts
optional expiresAt?: Date | null;
```

Defined in: [src/interfaces/binding.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L12)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/binding.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L5)

##### metadata?

```ts
optional metadata?: Record<string, unknown>;
```

Defined in: [src/interfaces/binding.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L14)

##### resourceId?

```ts
optional resourceId?: string | null;
```

Defined in: [src/interfaces/binding.ts:11](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L11)

##### resourceType?

```ts
optional resourceType?: string | null;
```

Defined in: [src/interfaces/binding.ts:10](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L10)

##### revokedAt?

```ts
optional revokedAt?: Date | null;
```

Defined in: [src/interfaces/binding.ts:13](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L13)

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/binding.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L9)

##### subjectId

```ts
subjectId: string;
```

Defined in: [src/interfaces/binding.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L8)

##### subjectType

```ts
subjectType: string;
```

Defined in: [src/interfaces/binding.ts:7](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L7)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/binding.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L6)

***

### RbacStorage

Defined in: [src/interfaces/storage.ts:45](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L45)

#### Methods

##### assignRole()

```ts
assignRole(input): Promise<RbacRoleBinding>;
```

Defined in: [src/interfaces/storage.ts:53](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L53)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`AssignRoleStorageInput`](#assignrolestorageinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](#rbacrolebinding)\>

##### deleteRole()

```ts
deleteRole(input): Promise<void>;
```

Defined in: [src/interfaces/storage.ts:49](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L49)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`DeleteRoleInput`](#deleteroleinput) |

###### Returns

`Promise`\<`void`\>

##### findRole()

```ts
findRole(input): Promise<RbacRole | null>;
```

Defined in: [src/interfaces/storage.ts:46](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L46)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`FindRoleInput`](#findroleinput) |

###### Returns

`Promise`\<[`RbacRole`](#rbacrole) \| `null`\>

##### grantPermission()

```ts
grantPermission(input): Promise<void>;
```

Defined in: [src/interfaces/storage.ts:50](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L50)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`GrantPermissionInput`](#grantpermissioninput) |

###### Returns

`Promise`\<`void`\>

##### listBindings()

```ts
listBindings(input): Promise<RbacRoleBinding[]>;
```

Defined in: [src/interfaces/storage.ts:55](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L55)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListBindingsInput`](#listbindingsinput) |

###### Returns

`Promise`\<[`RbacRoleBinding`](#rbacrolebinding)[]\>

##### listEffectivePermissions()

```ts
listEffectivePermissions(input): Promise<RbacEffectivePermission[]>;
```

Defined in: [src/interfaces/storage.ts:57](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L57)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListEffectiveRolesInput`](#listeffectiverolesinput) |

###### Returns

`Promise`\<[`RbacEffectivePermission`](#rbaceffectivepermission)[]\>

##### listEffectiveRoles()

```ts
listEffectiveRoles(input): Promise<RbacEffectiveRole[]>;
```

Defined in: [src/interfaces/storage.ts:56](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L56)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListEffectiveRolesInput`](#listeffectiverolesinput) |

###### Returns

`Promise`\<[`RbacEffectiveRole`](#rbaceffectiverole)[]\>

##### listRolePermissions()

```ts
listRolePermissions(input): Promise<string[]>;
```

Defined in: [src/interfaces/storage.ts:52](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L52)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListRolePermissionsInput`](#listrolepermissionsinput) |

###### Returns

`Promise`\<`string`[]\>

##### listRoles()

```ts
listRoles(input): Promise<RbacRole[]>;
```

Defined in: [src/interfaces/storage.ts:47](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L47)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ListRolesInput`](#listrolesinput) |

###### Returns

`Promise`\<[`RbacRole`](#rbacrole)[]\>

##### revokePermission()

```ts
revokePermission(input): Promise<void>;
```

Defined in: [src/interfaces/storage.ts:51](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L51)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokePermissionInput`](#revokepermissioninput) |

###### Returns

`Promise`\<`void`\>

##### revokeRole()

```ts
revokeRole(input): Promise<void>;
```

Defined in: [src/interfaces/storage.ts:54](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L54)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RevokeRoleInput`](#revokeroleinput) |

###### Returns

`Promise`\<`void`\>

##### upsertRole()

```ts
upsertRole(input): Promise<RbacRole>;
```

Defined in: [src/interfaces/storage.ts:48](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L48)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`UpsertRoleInput`](#upsertroleinput) |

###### Returns

`Promise`\<[`RbacRole`](#rbacrole)\>

***

### RbacStoredResourceRef

Defined in: [src/utils/resource-matcher.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/utils/resource-matcher.ts#L3)

#### Properties

##### resourceId?

```ts
optional resourceId?: string | null;
```

Defined in: [src/utils/resource-matcher.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/utils/resource-matcher.ts#L5)

##### resourceType?

```ts
optional resourceType?: string | null;
```

Defined in: [src/utils/resource-matcher.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/utils/resource-matcher.ts#L4)

***

### RbacSubject

Defined in: [src/interfaces/subject.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/subject.ts#L3)

#### Properties

##### attributes?

```ts
optional attributes?: Record<string, unknown>;
```

Defined in: [src/interfaces/subject.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/subject.ts#L8)

##### displayName?

```ts
optional displayName?: string;
```

Defined in: [src/interfaces/subject.ts:7](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/subject.ts#L7)

##### id

```ts
id: string;
```

Defined in: [src/interfaces/subject.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/subject.ts#L5)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/subject.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/subject.ts#L6)

##### type

```ts
type: RbacSubjectType;
```

Defined in: [src/interfaces/subject.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/subject.ts#L4)

***

### RbacWriteValidationOptions

Defined in: [src/interfaces/module-options.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L8)

#### Properties

##### rejectGlobalRoleInTenantBinding?

```ts
optional rejectGlobalRoleInTenantBinding?: boolean;
```

Defined in: [src/interfaces/module-options.ts:11](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L11)

##### rejectResourceWithoutTenant?

```ts
optional rejectResourceWithoutTenant?: boolean;
```

Defined in: [src/interfaces/module-options.ts:10](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L10)

##### rejectTenantMismatch?

```ts
optional rejectTenantMismatch?: boolean;
```

Defined in: [src/interfaces/module-options.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/module-options.ts#L9)

***

### RevokePermissionInput

Defined in: [src/interfaces/permission.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L6)

#### Properties

##### permission

```ts
permission: string;
```

Defined in: [src/interfaces/permission.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L8)

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/permission.ts:7](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/permission.ts#L7)

***

### RevokeRoleInput

Defined in: [src/interfaces/binding.ts:41](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L41)

#### Properties

##### bindingId

```ts
bindingId: string;
```

Defined in: [src/interfaces/binding.ts:42](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L42)

##### revokedAt?

```ts
optional revokedAt?: Date;
```

Defined in: [src/interfaces/binding.ts:43](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L43)

***

### UpdateRoleInput

Defined in: [src/interfaces/role.ts:20](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L20)

#### Properties

##### description?

```ts
optional description?: string;
```

Defined in: [src/interfaces/role.ts:25](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L25)

##### isSystem?

```ts
optional isSystem?: boolean;
```

Defined in: [src/interfaces/role.ts:26](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L26)

##### key?

```ts
optional key?: string;
```

Defined in: [src/interfaces/role.ts:23](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L23)

##### name?

```ts
optional name?: string;
```

Defined in: [src/interfaces/role.ts:24](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L24)

##### permissions?

```ts
optional permissions?: string[];
```

Defined in: [src/interfaces/role.ts:27](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L27)

##### roleId

```ts
roleId: string;
```

Defined in: [src/interfaces/role.ts:21](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L21)

##### tenantId?

```ts
optional tenantId?: string | null;
```

Defined in: [src/interfaces/role.ts:22](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L22)

## Type Aliases

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

### ListBindingsStorageInput

```ts
type ListBindingsStorageInput = ListBindingsInput;
```

Defined in: [src/interfaces/binding.ts:53](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L53)

***

### ListEffectivePermissionsInput

```ts
type ListEffectivePermissionsInput = ListEffectiveRolesInput;
```

Defined in: [src/interfaces/storage.ts:29](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/storage.ts#L29)

***

### RbacBuiltInResourceDeclaration

```ts
type RbacBuiltInResourceDeclaration = 
  | RbacParamResourceDeclaration
  | RbacHeaderResourceDeclaration
  | RbacQueryResourceDeclaration;
```

Defined in: [src/interfaces/requirements.ts:26](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L26)

***

### RbacCanInput

```ts
type RbacCanInput = 
  | RbacPermissionCanInput
  | RbacRoleCanInput;
```

Defined in: [src/interfaces/decision.ts:38](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L38)

***

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

##### idHeader

```ts
idHeader: string;
```

Defined in: [src/interfaces/requirements.ts:14](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L14)

##### idParam?

```ts
optional idParam?: never;
```

Defined in: [src/interfaces/requirements.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L15)

##### idQuery?

```ts
optional idQuery?: never;
```

Defined in: [src/interfaces/requirements.ts:16](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L16)

##### type

```ts
type: string;
```

Defined in: [src/interfaces/requirements.ts:13](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L13)

***

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

##### idHeader?

```ts
optional idHeader?: never;
```

Defined in: [src/interfaces/requirements.ts:8](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L8)

##### idParam

```ts
idParam: string;
```

Defined in: [src/interfaces/requirements.ts:7](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L7)

##### idQuery?

```ts
optional idQuery?: never;
```

Defined in: [src/interfaces/requirements.ts:9](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L9)

##### type

```ts
type: string;
```

Defined in: [src/interfaces/requirements.ts:6](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L6)

***

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

##### idHeader?

```ts
optional idHeader?: never;
```

Defined in: [src/interfaces/requirements.ts:23](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L23)

##### idParam?

```ts
optional idParam?: never;
```

Defined in: [src/interfaces/requirements.ts:22](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L22)

##### idQuery

```ts
idQuery: string;
```

Defined in: [src/interfaces/requirements.ts:21](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L21)

##### type

```ts
type: string;
```

Defined in: [src/interfaces/requirements.ts:20](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/requirements.ts#L20)

***

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

### RbacRequirementMode

```ts
type RbacRequirementMode = "any" | "all";
```

Defined in: [src/interfaces/decision.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L5)

***

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

  \| `Promise`\<[`RbacResourceRef`](#rbacresourceref) \| `undefined`\>
  \| [`RbacResourceRef`](#rbacresourceref)
  \| `undefined`

***

### RbacResourceResolverToken

```ts
type RbacResourceResolverToken = InjectionToken<RbacResourceResolver>;
```

Defined in: [src/interfaces/resource.ts:12](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/resource.ts#L12)

***

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

  \| `Promise`\<[`RbacSubject`](#rbacsubject) \| `undefined`\>
  \| [`RbacSubject`](#rbacsubject)
  \| `undefined`

***

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

### RbacTenantMode

```ts
type RbacTenantMode = "required" | "optional" | "none";
```

Defined in: [src/interfaces/decision.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/decision.ts#L4)

***

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
| `options` | [`RbacRequirementOptions`](#rbacrequirementoptions) |
| `subject` | [`RbacSubject`](#rbacsubject) |

#### Returns

  \| `Promise`\<`string` \| `null` \| `undefined`\>
  \| `string`
  \| `null`
  \| `undefined`

***

### RevokeRoleStorageInput

```ts
type RevokeRoleStorageInput = RevokeRoleInput;
```

Defined in: [src/interfaces/binding.ts:46](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/binding.ts#L46)

***

### UpsertRoleInput

```ts
type UpsertRoleInput = 
  | CreateRoleInput
  | UpdateRoleInput;
```

Defined in: [src/interfaces/role.ts:43](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/interfaces/role.ts#L43)

## Variables

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

### RBAC\_OPTIONS

```ts
const RBAC_OPTIONS: typeof RBAC_OPTIONS;
```

Defined in: [src/constants.ts:1](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/constants.ts#L1)

***

### RBAC\_REQUIREMENTS\_METADATA

```ts
const RBAC_REQUIREMENTS_METADATA: typeof RBAC_REQUIREMENTS_METADATA;
```

Defined in: [src/constants.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/constants.ts#L3)

***

### RBAC\_SKIP\_METADATA

```ts
const RBAC_SKIP_METADATA: typeof RBAC_SKIP_METADATA;
```

Defined in: [src/constants.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/constants.ts#L4)

***

### RBAC\_STORAGE

```ts
const RBAC_STORAGE: typeof RBAC_STORAGE;
```

Defined in: [src/constants.ts:2](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/constants.ts#L2)

***

### RBAC\_SUBJECT\_REQUEST\_KEY

```ts
const RBAC_SUBJECT_REQUEST_KEY: "rbacSubject" = 'rbacSubject';
```

Defined in: [src/constants.ts:5](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/constants.ts#L5)

***

### RequirePermission

```ts
const RequirePermission: (permission, options) => ClassDecorator & MethodDecorator = Can;
```

Defined in: [src/decorators/permission.decorator.ts:15](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/decorators/permission.decorator.ts#L15)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `permission` | `string` |
| `options` | [`RbacRequirementOptions`](#rbacrequirementoptions) |

#### Returns

`ClassDecorator` & `MethodDecorator`

## Functions

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

### Can()

```ts
function Can(permission, options?): ClassDecorator & MethodDecorator;
```

Defined in: [src/decorators/permission.decorator.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/decorators/permission.decorator.ts#L4)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `permission` | `string` |
| `options` | [`RbacRequirementOptions`](#rbacrequirementoptions) |

#### Returns

`ClassDecorator` & `MethodDecorator`

***

### createStrictRbacOptions()

```ts
function createStrictRbacOptions(options): RbacModuleOptions;
```

Defined in: [src/options/strict-rbac-options.ts:3](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/options/strict-rbac-options.ts#L3)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RbacModuleOptions`](#rbacmoduleoptions) |

#### Returns

[`RbacModuleOptions`](#rbacmoduleoptions)

***

### defaultHttpSubjectResolver()

```ts
function defaultHttpSubjectResolver(): RbacSubjectResolver;
```

Defined in: [src/resolvers/default-http-subject.resolver.ts:103](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/resolvers/default-http-subject.resolver.ts#L103)

#### Returns

[`RbacSubjectResolver`](#rbacsubjectresolver)

***

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
| `options` | [`DefineRbacPermissionsOptions`](#definerbacpermissionsoptions) |

#### Returns

[`RbacPermissionContract`](#rbacpermissioncontract)\<`T`\>

***

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
| `error` | [`RbacError`](#rbacerror) |

#### Returns

  \| `InternalServerErrorException`
  \| `UnauthorizedException`
  \| `ForbiddenException`

***

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

### matchesResource()

```ts
function matchesResource(granted, required): boolean;
```

Defined in: [src/utils/resource-matcher.ts:21](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/utils/resource-matcher.ts#L21)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `granted` | \| [`RbacResourceRef`](#rbacresourceref) \| [`RbacStoredResourceRef`](#rbacstoredresourceref) \| `undefined` |
| `required` | [`RbacResourceRef`](#rbacresourceref) \| `undefined` |

#### Returns

`boolean`

***

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

### RequirePermissions()

```ts
function RequirePermissions(permissions, options?): ClassDecorator & MethodDecorator;
```

Defined in: [src/decorators/permission.decorator.ts:17](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/decorators/permission.decorator.ts#L17)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `permissions` | readonly `string`[] |
| `options` | [`RbacRequirementOptions`](#rbacrequirementoptions) |

#### Returns

`ClassDecorator` & `MethodDecorator`

***

### RequireRole()

```ts
function RequireRole(roleKey, options?): ClassDecorator & MethodDecorator;
```

Defined in: [src/decorators/role.decorator.ts:4](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/decorators/role.decorator.ts#L4)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `roleKey` | `string` |
| `options` | [`RbacRequirementOptions`](#rbacrequirementoptions) |

#### Returns

`ClassDecorator` & `MethodDecorator`

***

### resolveHttpResource()

```ts
function resolveHttpResource(context, declaration): RbacResourceRef | undefined;
```

Defined in: [src/resolvers/default-http-resource.resolver.ts:30](https://github.com/nestarc/rbac/blob/bbc5ef068736450a54ed42bb4d3afbb7a97c16cb/src/resolvers/default-http-resource.resolver.ts#L30)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `ExecutionContext` |
| `declaration` | [`RbacBuiltInResourceDeclaration`](#rbacbuiltinresourcedeclaration) |

#### Returns

[`RbacResourceRef`](#rbacresourceref) \| `undefined`

***

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
| `requirementOptions` | [`RbacRequirementOptions`](#rbacrequirementoptions) |
| `subject` | [`RbacSubject`](#rbacsubject) |

#### Returns

`string` \| `null` \| `undefined`

***

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

`CustomDecorator`\<*typeof* [`RBAC_SKIP_METADATA`](#rbac-skip-metadata)\>
