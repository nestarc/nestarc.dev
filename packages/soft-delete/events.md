---
description: "Soft-delete lifecycle events, testing utilities, and API reference for @nestarc/soft-delete."
---

# Events, Testing & API Reference

## Events

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
export class AuditListener {
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

---

## Testing

Import `TestSoftDeleteModule` from `@nestarc/soft-delete/testing` in your unit or integration tests.

```typescript
import { Test } from '@nestjs/testing';
import { TestSoftDeleteModule, expectSoftDeleted, expectNotSoftDeleted, expectCascadeSoftDeleted } from '@nestarc/soft-delete/testing';
import { SoftDeleteService } from '@nestarc/soft-delete';
import { createPrismaSoftDeleteExtension } from '@nestarc/soft-delete';
import { basePrisma } from './prisma';
import { prismaDmmf } from './prisma.dmmf';

describe('UsersService', () => {
  let softDelete: SoftDeleteService;
  let prisma: any; // your extended PrismaClient in tests

  beforeAll(async () => {
    prisma = basePrisma.$extends(
      createPrismaSoftDeleteExtension({
        softDeleteModels: ['User', 'Post'],
        cascade: { User: ['Post'] },
        dmmf: prismaDmmf,
      }),
    );

    const module = await Test.createTestingModule({
      imports: [
        TestSoftDeleteModule.register(
          {
            softDeleteModels: ['User', 'Post'],
            cascade: { User: ['Post'] },
            dmmf: prismaDmmf,
          },
          prisma,
        ),
      ],
    }).compile();

    softDelete = module.get(SoftDeleteService);
  });

  it('soft-deletes a user', async () => {
    await prisma.user.delete({ where: { id: 1 } });
    await expectSoftDeleted(prisma.user, { id: 1 });
  });

  it('restores a user', async () => {
    await softDelete.restore('User', { id: 1 });
    await expectNotSoftDeleted(prisma.user, { id: 1 });
  });

  it('cascades soft-delete to posts', async () => {
    await prisma.user.delete({ where: { id: 2 } });
    await expectCascadeSoftDeleted(prisma, 'User', { id: 2 }, ['Post']);
  });
});
```

`basePrisma` is your generated, adapter-backed Prisma 7 client. Because this test enables cascade, load `prismaDmmf` as shown in the [DMMF setup](./installation#dmmf-for-cascade-and-relation-filters).

### Assertion helpers

| Helper | Description |
|---|---|
| `expectSoftDeleted(delegate, where, deletedAtField?)` | Asserts the record exists and `deletedAt` is non-null. |
| `expectNotSoftDeleted(delegate, where, deletedAtField?)` | Asserts the record exists and `deletedAt` is null. |
| `expectCascadeSoftDeleted(prisma, parentModel, where, childModels, deletedAtField?)` | Asserts the parent and all listed child models have soft-deleted records. |

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
| `TestSoftDeleteModule` | Module | Lightweight test module. Use `.register(options, prisma?)`. |
| `expectSoftDeleted` | Function | Assert a record is soft-deleted. |
| `expectNotSoftDeleted` | Function | Assert a record is not soft-deleted. |
| `expectCascadeSoftDeleted` | Function | Assert a parent and its children are all soft-deleted. |

For complete signatures, see the generated [`@nestarc/soft-delete` API](/api/soft-delete/) and [testing API](/api/soft-delete/testing).
