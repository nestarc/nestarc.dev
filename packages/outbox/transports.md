---
description: "Transport adapters for @nestarc/outbox — LocalTransport for in-process dispatch, custom adapters for Kafka, RabbitMQ, SQS, and the OutboxTransport interface."
---

# Transport Adapters

The transport layer controls **how** events are delivered to handlers after the poller reads them from the database.

## LocalTransport (default)

Calls handlers directly in the same process. No external message broker needed.

```typescript
// This is the default — no configuration required
OutboxModule.forRoot({
  prisma: PrismaService,
  // transport defaults to LocalTransport
})
```

`LocalTransport` iterates over all registered handlers for the event type and calls each one sequentially:

```typescript
async dispatch(record: OutboxRecord, handlers: OutboxHandler[]): Promise<void> {
  for (const handler of handlers) {
    await handler.instance[handler.methodName](record.payload);
  }
}
```

**When to use:** single-instance deployments, development, testing, or when handlers are fast and in-process dispatch is sufficient.

::: warning
If one handler throws, the remaining handlers are **not called**. The entire event is retried, including handlers that already succeeded. Keep handlers idempotent.
:::

## Custom Transport

Implement the `OutboxTransport` interface to publish events to an external message broker:

```typescript
import { Injectable } from '@nestjs/common';
import type { OutboxTransport, OutboxRecord, OutboxHandler } from '@nestarc/outbox';

@Injectable()
export class KafkaTransport implements OutboxTransport {
  constructor(private readonly kafka: KafkaProducer) {}

  async dispatch(record: OutboxRecord, handlers: OutboxHandler[]): Promise<void> {
    await this.kafka.send({
      topic: record.eventType,
      messages: [
        {
          key: record.id,
          value: JSON.stringify(record.payload),
        },
      ],
    });
  }
}
```

Register the transport via module options:

```typescript
OutboxModule.forRootAsync({
  imports: [PrismaModule, KafkaModule],
  inject: [PrismaService],
  transport: KafkaTransport,
  useFactory: (prisma: PrismaService) => ({
    prisma,
    delivery: { mode: 'publisher' },
  }),
})
```

The imported modules must export `PrismaService` and `KafkaProducer`. In 0.3, async transport/tenant-provider classes are top-level Nest registrations; returning them from the factory is rejected.

## `OutboxTransport` Interface

```typescript
interface OutboxTransport {
  dispatch(record: OutboxRecord, handlers: OutboxHandler[]): Promise<void>;
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `record` | `OutboxRecord` | The event record from the database |
| `handlers` | `OutboxHandler[]` | Discovered handlers for this event type |

## `OutboxRecord`

Use the root-exported `OutboxRecord` type rather than copying its shape. It includes readonly identity/payload/status fields, tenant and aggregate metadata, headers, occurrence/processing timestamps, and `nextAttemptAt`. Publishers and handlers receive detached deep snapshots; the private claim token is not a public routing field. See [the generated interface](/api/outbox/).

## `OutboxHandler`

Each handler discovered by the explorer:

```typescript
interface OutboxHandler {
  instance: Record<string, any>;
  methodName: string;
  eventTypes: string[];
}
```

## Example: RabbitMQ Transport

```typescript
@Injectable()
export class RabbitMQTransport implements OutboxTransport {
  constructor(private readonly amqp: AmqpConnection) {}

  async dispatch(record: OutboxRecord): Promise<void> {
    await this.amqp.publish('outbox-exchange', record.eventType, {
      id: record.id,
      payload: record.payload,
      createdAt: record.createdAt,
    });
  }
}
```

## Example: SQS Transport

```typescript
@Injectable()
export class SQSTransport implements OutboxTransport {
  constructor(private readonly sqs: SQSClient) {}

  async dispatch(record: OutboxRecord): Promise<void> {
    await this.sqs.send(new SendMessageCommand({
      QueueUrl: this.getQueueUrl(record.eventType),
      MessageBody: JSON.stringify(record.payload),
      MessageDeduplicationId: record.id,
      MessageGroupId: record.eventType,
    }));
  }

  private getQueueUrl(eventType: string): string {
    return `https://sqs.region.amazonaws.com/account/${eventType.replace('.', '-')}`;
  }
}
```

::: tip
When using an external transport, the `handlers` parameter may be unused — the consuming application handles the events on the other side of the message broker. The poller still marks the event as `SENT` after `dispatch()` resolves successfully.
:::
