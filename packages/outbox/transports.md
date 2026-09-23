---
description: "Transport adapters for @nestarc/outbox — LocalTransport for in-process dispatch, custom adapters for Kafka, RabbitMQ, SQS, and the OutboxTransport interface."
---

# Transport Adapters

The transport layer controls **how** events are delivered after the poller reads them from PostgreSQL. Use the default `local` mode for decorated handlers or `publisher` mode with an `OutboxPublisher` for an external broker. These examples target published **0.3.0**.

## LocalTransport (default)

Calls handlers directly in the same process. No external message broker needed.

```typescript
// This is the default — no configuration required
OutboxModule.forRoot({
  prisma: PrismaService,
  // transport defaults to LocalTransport
})
```

`LocalTransport` invokes registered handlers sequentially with `(payload, context)`. The optional `OutboxHandlerContext` contains `eventId`, `eventType`, `tenantId`, `retryCount`, `headers`, and the record. Each handler gets a detached snapshot; a configured tenant provider restores tenant context around the callbacks.

**When to use:** handlers run inside the application, in development or production. Local delivery also supports multiple replicas sharing the outbox database.

::: warning
If one handler throws, the remaining handlers are **not called**. The entire event is retried, including handlers that already succeeded. Keep handlers idempotent.
:::

## Broker publisher

Implement `OutboxPublisher` and preserve event identity independently of the broker partition key. A reusable message envelope also keeps routing and trace metadata available to consumers:

```typescript
import type { OutboxRecord } from '@nestarc/outbox';

function toBrokerEvent(record: OutboxRecord) {
  return {
    id: record.id,
    eventType: record.eventType,
    payload: record.payload,
    tenantId: record.tenantId,
    aggregateType: record.aggregateType,
    aggregateId: record.aggregateId,
    partitionKey: record.partitionKey,
    idempotencyKey: record.idempotencyKey,
    correlationId: record.correlationId,
    causationId: record.causationId,
    headers: record.headers,
    occurredAt: record.occurredAt,
  };
}
```

The broker client is application-owned; adapt its injection token and `send()` call to your client library:

```typescript
import { Injectable } from '@nestjs/common';
import type { OutboxPublisher, OutboxRecord } from '@nestarc/outbox';

@Injectable()
export class KafkaPublisher implements OutboxPublisher {
  constructor(private readonly kafka: KafkaProducer) {}

  async publish(record: OutboxRecord): Promise<void> {
    await this.kafka.send({
      topic: record.eventType,
      messages: [
        {
          key: record.partitionKey ?? record.aggregateId ?? record.id,
          value: JSON.stringify(toBrokerEvent(record)),
          headers: { ...record.headers, 'outbox-event-id': record.id },
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
  transport: KafkaPublisher,
  useFactory: (prisma: PrismaService) => ({
    prisma,
    delivery: { mode: 'publisher' },
  }),
})
```

The imported modules must export `PrismaService` and `KafkaProducer`. In 0.3, async transport/tenant-provider classes are top-level Nest registrations; returning them from the factory is rejected.

A resolved `publish()` marks the row `SENT`; await the broker acknowledgement before resolving. This does not mean a downstream consumer completed its work. Consumers must deduplicate using the envelope `id` or an application-controlled `idempotencyKey`, including when `partitionKey` is present.

## Legacy `OutboxTransport` interface

The `dispatch()` interface remains supported. In publisher mode it receives an empty handler array; new broker adapters can use the simpler `OutboxPublisher.publish()` interface above.

```typescript
interface OutboxTransport {
  dispatch(
    record: OutboxRecord,
    handlers: OutboxHandler[],
    context?: OutboxHandlerContext,
  ): Promise<void>;
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `record` | `OutboxRecord` | The event record from the database |
| `handlers` | `OutboxHandler[]` | Discovered handlers in local mode; empty in publisher mode |
| `context` | `OutboxHandlerContext` | Optional event identity and tenant context |

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

## Example: RabbitMQ publisher

```typescript
@Injectable()
export class RabbitMQPublisher implements OutboxPublisher {
  constructor(private readonly amqp: AmqpConnection) {}

  async publish(record: OutboxRecord): Promise<void> {
    await this.amqp.publish('outbox-exchange', record.eventType, toBrokerEvent(record));
  }
}
```

## Example: SQS publisher

This example targets FIFO queues. Configure actual `.fifo` queue URLs for each event type in the application and configure the corresponding broker client provider. SQS FIFO deduplication does not replace persistent consumer deduplication.

```typescript
@Injectable()
export class SQSPublisher implements OutboxPublisher {
  constructor(private readonly sqs: SQSClient) {}

  async publish(record: OutboxRecord): Promise<void> {
    await this.sqs.send(new SendMessageCommand({
      QueueUrl: this.getQueueUrl(record.eventType),
      MessageBody: JSON.stringify(toBrokerEvent(record)),
      MessageDeduplicationId: record.id,
      MessageGroupId: record.partitionKey ?? record.aggregateId ?? record.eventType,
    }));
  }

  private getQueueUrl(eventType: string): string {
    return `https://sqs.region.amazonaws.com/account/${eventType.replaceAll('.', '-')}.fifo`;
  }
}
```

::: tip
When using an external transport, the `handlers` parameter may be unused — the consuming application handles the events on the other side of the message broker. The poller marks the event as `SENT` after `publish()` or legacy `dispatch()` resolves successfully. Configure the client to resolve after the broker acknowledgement required by your application.
:::
