---
description: "Soft-delete lifecycle events, testing utilities, and API reference for @nestarc/soft-delete."
---

# Events, Testing & API Reference

## Events

Lifecycle events are notification-only. Use them for metrics, cache invalidation, and downstream
notifications, not as authoritative proof that a database transaction committed. For atomic
lifecycle evidence, use the 0.7 bridge with `auditLifecycle: 'atomic-required'` and
`withAuditTransaction()`.

Enable events and install `@nestjs/event-emitter`:

```bash
npm install @nestjs/event-emitter
```

```typescript
// app.module.ts
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    SoftDeleteModule.forRoot({
      softDeleteModels: ['User', 'Post'],
      enableEvents: true,
      prismaServiceToken: PrismaService,
    }),
  ],
})
export class AppModule {}
```

Listen to events with `@OnEvent()`:

```typescript
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SoftDeletedEvent, RestoredEvent, PurgedEvent } from '@nestarc/soft-delete';

@Injectable()
export class LifecycleListener {
  @OnEvent(SoftDeletedEvent.EVENT_NAME)
  onDeleted(event: SoftDeletedEvent) {
    console.log(`${event.model} soft-deleted by ${event.actorId} at ${event.deletedAt}`);
  }

  @OnEvent(RestoredEvent.EVENT_NAME)
  onRestored(event: RestoredEvent) {
    console.log(`${event.model} restored by ${event.actorId}`);
  }

  @OnEvent(PurgedEvent.EVENT_NAME)
  onPurged(event: PurgedEvent) {
    console.log(`${event.count} ${event.model} records purged (older than ${event.olderThan})`);
  }
}
```

| Event class | `EVENT_NAME` | Payload fields |
|---|---|---|
| `SoftDeletedEvent` | `soft-delete.deleted` | `model`, `where`, `deletedAt`, `actorId`, `count?` |
| `RestoredEvent` | `soft-delete.restored` | `model`, `where`, `actorId`, `count?` |
| `PurgedEvent` | `soft-delete.purged` | `model`, `count`, `olderThan` |

Version 0.5 populates the optional `count` for bulk delete and bulk restore operations. Single-row soft deletes report `count: 1`; single-row restores keep the field optional for backward compatibility.

```typescript
@OnEvent(RestoredEvent.EVENT_NAME)
onRestored(event: RestoredEvent) {
  metrics.count('soft_delete.restored', event.count ?? 1, {
    model: event.model,
  });
}
```

### Notification-only contract

`@nestjs/event-emitter` dispatches these events synchronously by default, but an event may still be
observed before an outer Prisma transaction commits. Listener failure, asynchronous scheduling,
process termination, or a later rollback can therefore make event delivery diverge from durable
database state. Do not call `AuditService.log()` from a listener and treat the result as atomic
evidence.

When evidence must commit with the lifecycle write, install `@nestarc/audit-log` at its accepted
optional peer range (`^0.4.1 || ^0.5.0 || ^0.6.0 || ^0.7.0` in soft-delete 0.7.4), apply
extensions in tenancy → audit-log → soft-delete
order, and inject that exact composed client into `SoftDeleteModule`. Configure
`auditLifecycle: 'atomic-required'`, bound bulk conversion with `auditMaxBatchRecords`, and run
delete, restore, purge, cascade, and bulk operations inside `withAuditTransaction()`. The bridge
fails before mutation when any part of that contract is absent. See the
[atomic lifecycle setup](./installation#atomic-audit-lifecycle). Soft-delete 0.7.4 excludes
audit-log 0.8.0 from its peer range; the documented lifecycle recipe remains pinned to audit-log
0.7.0. Do not substitute 0.8.0 or bypass peer validation.

---

## Testing

For application integration tests on **0.7.4**, register the production `SoftDeleteModule`
with an imported provider module, just as the application does. Import assertions from
`@nestarc/soft-delete/testing`, and give them the unextended database client so they can read
both active and deleted rows.

```typescript
import { Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import {
  expectSoftDeleted,
  expectNotSoftDeleted,
  expectCascadeSoftDeleted,
} from '@nestarc/soft-delete/testing';
import {
  SoftDeleteModule,
  SoftDeleteService,
  createPrismaSoftDeleteExtension,
} from '@nestarc/soft-delete';
import { basePrisma } from './prisma';
import { prismaDmmf } from './prisma.dmmf';

const TEST_PRISMA = Symbol('TEST_PRISMA');
const options = {
  softDeleteModels: ['User', 'Post'],
  cascade: { User: ['Post'] },
  dmmf: prismaDmmf,
};
const prisma = basePrisma.$extends(createPrismaSoftDeleteExtension(options));

@Module({
  providers: [{ provide: TEST_PRISMA, useValue: prisma }],
  exports: [TEST_PRISMA],
})
class TestPrismaModule {}

describe('UsersService', () => {
  let module: TestingModule;
  let softDelete: SoftDeleteService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        SoftDeleteModule.forRootAsync({
          imports: [TestPrismaModule],
          prismaServiceToken: TEST_PRISMA,
          useFactory: () => ({ ...options, prismaServiceToken: TEST_PRISMA }),
        }),
      ],
    }).compile();
    softDelete = module.get(SoftDeleteService);
  });

  afterAll(async () => {
    await module.close();
    await basePrisma.$disconnect();
  });

  it('soft-deletes and restores a user', async () => {
    // Seed an active User with id 1 in this test's isolated database first.
    await prisma.user.delete({ where: { id: 1 } });
    await expectSoftDeleted(basePrisma.user, { id: 1 });

    await softDelete.restore('User', { id: 1 });
    await expectNotSoftDeleted(basePrisma.user, { id: 1 });
  });

  it('cascades soft-delete to posts', async () => {
    // Seed an active User with id 2 and its Posts in an isolated fixture first.
    await prisma.user.delete({ where: { id: 2 } });
    await expectCascadeSoftDeleted(basePrisma, 'User', { id: 2 }, ['Post']);

    // The generic helper does not verify that children belong to this parent.
    const children = await basePrisma.post.findMany({ where: { authorId: 2 } });
    expect(children.length).toBeGreaterThan(0);
    expect(children.every((post) => post.deletedAt !== null)).toBe(true);
  });
});
```

`basePrisma` is your generated, adapter-backed Prisma client, owned and closed by this test
suite. Seed and clean an isolated fixture for each test; adapt `authorId` to the actual relation
field. Because this example enables cascade, load `prismaDmmf` as shown in the
[DMMF setup](./installation#dmmf-for-cascade-and-relation-filters).

::: warning Published 0.7.4 testing boundary
The published `/testing` bundles contain their own service classes and context store.
`TestSoftDeleteModule.register()` therefore does not export the same `SoftDeleteService` class
token imported from the root package, and its helper context does not switch the root
extension's filters. Use the production module above for runtime service integration and raw
delegates for assertions. `TestSoftDeleteModule` also installs no cascade handler, even if
cascade options are supplied; it is not a cascade-restore integration fixture.
:::

### Assertion helpers

| Helper | Description |
|---|---|
| `expectSoftDeleted(delegate, where, deletedAtField?)` | Asserts the record exists and `deletedAt` is non-null. |
| `expectNotSoftDeleted(delegate, where, deletedAtField?)` | Asserts the record exists and `deletedAt` is null. |
| `expectCascadeSoftDeleted(prisma, parentModel, where, childModels, deletedAtField?)` | Asserts the selected parent is deleted and each listed child model has at least one deleted row; does not check foreign keys, all expected children, or unrelated rows. |

---

## API Reference

### `@nestarc/soft-delete`

| Export | Kind | Description |
|---|---|---|
| `SoftDeleteModule` | Module | NestJS dynamic module. Use `.forRoot()` or `.forRootAsync()`. |
| `SoftDeleteService` | Service | `restore()`, `restoreMany()`, `forceDelete()`, `purge()`, `withDeleted()`, `onlyDeleted()`. |
| `SoftDeleteContext` | Service | AsyncLocalStorage context for filter mode. |
| `createPrismaSoftDeleteExtension` | Function | Creates a Prisma client extension for standalone use. |
| `WithDeleted` | Decorator | Include soft-deleted records in the route handler's queries. |
| `OnlyDeleted` | Decorator | Return only soft-deleted records in the route handler's queries. |
| `SkipSoftDelete` | Decorator | Bypass soft-delete logic in the route handler. |
| `WithDeletedRelations` | Decorator | Include deleted rows for exact to-many relation paths when relation filtering is enabled. |
| `SoftDeleteFilterInterceptor` | Interceptor | Reads route metadata and sets the `SoftDeleteContext`. Auto-registered. |
| `SoftDeletedEvent` | Class | Event emitted after a soft-delete. `EVENT_NAME = 'soft-delete.deleted'`. |
| `RestoredEvent` | Class | Event emitted after a restore. `EVENT_NAME = 'soft-delete.restored'`. |
| `PurgedEvent` | Class | Event emitted after a purge. `EVENT_NAME = 'soft-delete.purged'`. |
| `SoftDeleteEventEmitter` | Service | Internal emitter; exposed for advanced use. |
| `SoftDeleteFieldMissingError` | Error | Exported error reserved for missing-field validation; current runtime paths surface missing fields as Prisma errors. |
| `CascadeRelationNotFoundError` | Error | Thrown when a cascade relation cannot be resolved. |
| `CascadeDmmfMissingError` | Error | Thrown when cascade is configured without available DMMF metadata. |
| `RelationDmmfMissingError` | Error | Thrown when relation filters are enabled without available DMMF metadata. |
| `SoftDeleteModuleOptions` | Interface | Options for `forRoot()`. |
| `SoftDeleteModuleAsyncOptions` | Interface | Options for `forRootAsync()`. |
| `SoftDeleteExtensionOptions` | Interface | Options for `createPrismaSoftDeleteExtension()`. |
| `RelationFilterOptions` | Interface | Enables relation filtering and bounds traversal depth. |
| `PrismaDmmfLike` | Interface | Minimal DMMF shape accepted by explicit configuration. |

### `@nestarc/soft-delete/testing`

| Export | Kind | Description |
|---|---|---|
| `TestSoftDeleteModule` | Module | Lightweight module with separate 0.7.4 bundle tokens and no cascade handler; use the production module above for integration tests. |
| `expectSoftDeleted` | Function | Assert a record is soft-deleted. |
| `expectNotSoftDeleted` | Function | Assert a record is not soft-deleted. |
| `expectCascadeSoftDeleted` | Function | Assert the selected parent and some deleted rows in each child model; verify parent-child relationships separately. |

For complete signatures, see the generated [`@nestarc/soft-delete` API](/api/soft-delete/) and [testing API](/api/soft-delete/testing).
