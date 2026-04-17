---
description: "publishOutbox, publishAudit, and runInTransaction hooks — how DataSubjectService fans lifecycle events out without assuming a specific bus."
---

# Events & Hooks

## Outbox events

If `publishOutbox` is provided, the built-in service emits:

| Event | When |
| --- | --- |
| `data_subject.request_created` | Any request is created (export or erase) |
| `data_subject.erasure_requested` | Erase request is created |
| `data_subject.request_completed` | Export or erase completed successfully |
| `data_subject.request_failed` | Export or erase failed (including residual-row verification failure) |

`request_completed` and `request_failed` are emitted for **both** export and erase.
`erasure_requested` is erase-only.

```ts
DataSubjectModule.forRoot({
  // ...
  publishOutbox: async (type, payload) => {
    await outbox.emit(type, payload);
  },
});
```

Wiring this through `@nestarc/outbox` means DSR lifecycle events flow through the same transactional outbox as the rest of your domain events — consumers can subscribe uniformly.

## Audit hook

If `publishAudit` is provided, the built-in service currently emits:

- `data_subject.request_created`

No additional audit lifecycle events are emitted by the current implementation. Treat this hook as an early-warning signal; use `publishOutbox` for full lifecycle tracking.

```ts
DataSubjectModule.forRoot({
  // ...
  publishAudit: async (event, data) => {
    await auditLog.write(event, data);
  },
});
```

## Transaction boundary

`runInTransaction` is an **integration hook**, not an automatic rollback guarantee:

```ts
DataSubjectModule.forRoot({
  // ...
  runInTransaction: async (work) => myUnitOfWork.run(work),
});
```

Use it when your erase flow runs inside a real unit-of-work that also covers:

- the entity executors
- request storage writes
- outbox publishing

If those components do not participate in the same transaction boundary, rollback remains **best-effort** — partial erasure of some entities is possible if a later step fails. Design around that by either:

- Providing a real shared transaction through `runInTransaction` (recommended when all components are Prisma-based), or
- Relying on `data_subject.request_failed` + operational replay to recover from partial failures.
