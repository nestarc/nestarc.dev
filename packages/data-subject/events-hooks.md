---
description: "Outbox and audit lifecycle events in data-subject 0.3.0, with immediate transaction boundaries and durable at-least-once callback delivery."
---

# Events & Hooks

`publishOutbox` and `publishAudit` connect request lifecycle events to host infrastructure. They do not authenticate a request or replace host authorization before execution.

## Emitted events

| Event | Outbox | Audit | Meaning |
| --- | --- | --- | --- |
| `data_subject.request_created` | Yes | Yes | An export or erase request was created |
| `data_subject.request_processing` | No | Yes | The request entered processing |
| `data_subject.erasure_requested` | Yes | No | An erase request passed its pre-scan |
| `data_subject.request_completed` | Yes | Yes | Export or erase completed |
| `data_subject.request_failed` | Yes | Yes | Request execution or completion failed |
| `data_subject.artifact_expired` | Durable only | Durable only | A pending artifact retry payload expired |

Terminal events cover both export and erase. The failure event includes `failureStage`, `dataOutcome`, and recovery metadata; a failed request may already have committed its data changes. See [completion recovery](./execution#completion-recovery).

```ts
DataSubjectModule.forRoot({
  // ...storage, policy definitions, and executors
  publishOutbox: async (event, payload) => {
    await hostOutbox.publish(event, payload);
  },
  publishAudit: async (event, data) => {
    await hostAudit.write(event, data);
  },
});
```

`hostOutbox` and `hostAudit` above are host implementations. Using a transactional outbox requires its database writes to participate in the intended transaction; naming the hook `publishOutbox` does not create that transaction.

## Immediate execution

Without `durableStore`, created and processing callbacks run before data execution. A failure in those callbacks can stop the request before data work starts. `erasure_requested` runs after the erasure pre-scan within `runInTransaction`.

```ts
DataSubjectModule.forRoot({
  // ...
  runInTransaction: async (work) => hostUnitOfWork.run(work),
});
```

This hook wraps erase reads, mutations, verification, and `erasure_requested`. Every business executor must resolve its delegate against the same transaction client, and the hook must resolve only after commit. Its default implementation simply calls `work()`. Signed-preview execution requires a real Serializable transaction.

Request state writes, artifact uploads, and terminal callbacks on this path are outside that erase transaction. External messages cannot be rolled back by the database. If executors use unrelated clients or databases, a later failure can leave partial changes.

Each terminal callback is attempted independently. A completed request stays `completed` when a completion callback fails; details are recorded in `stats.lifecycle.notificationFailures`. Failing a completion callback cannot cancel committed erasure. An immediate execution has no built-in durable completion retry storage.

## Durable delivery

With `PrismaExecutionStore`, entity changes, request results, original artifact bytes, and notification intents commit together in the same PostgreSQL database. Artifact and status preparation then commit before external notification delivery. Executors must use the store's transaction binding; the immediate-path `runInTransaction` hook does not provide that binding.

All durable callbacks, including created, processing, and erasure-requested events, are delivered after durable execution. Their delivery time is not a point for approving or cancelling those changes.

Callbacks receive a third `DeliveryContext` argument with stable `id`, `requestId`, and `tenantId` values. Delivery is at least once: use a persistent unique constraint on the delivery ID so a lost response or process restart does not duplicate a downstream event.

```ts
publishOutbox: async (event, payload, delivery) => {
  if (!delivery) throw new Error('Durable delivery context required');
  await hostOutbox.insertOnce(delivery.id, { event, payload });
},
publishAudit: async (event, payload, delivery) => {
  if (!delivery) throw new Error('Durable delivery context required');
  await hostAudit.insertOnce(delivery.id, { event, payload });
},
```

These callbacks assume the durable path. Immediate calls have no durable delivery context. `insertOnce` is a host-provided database operation, not a package API; an in-memory set is insufficient across restarts.

`retryCompletion(requestId, tenantId)` resumes original artifact and notification delivery without repeating entity operations. See [Execution & Recovery](./execution) for storage setup and [the 0.3.0 transaction guide](https://github.com/nestarc/data-subject/blob/v0.3.0/docs/p1-migration.md) for the complete binding example.
