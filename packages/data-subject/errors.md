---
description: "Stable DataSubjectError codes — when they surface, and how to branch on them."
---

# Errors

The package exposes `DataSubjectError` with stable error codes. Branch on `err.code`, not on the message.

## Currently emitted codes

| Code | Meaning |
| --- | --- |
| `dsr_invalid_policy` | Policy failed compilation (missing `subjectField`, unknown strategy, etc.) |
| `dsr_anonymize_dynamic_replacement` | An `anonymize` field used a function replacement — only static strings are allowed |
| `dsr_verification_failed` | After a `delete-row`, residual rows were found for the subject |
| `dsr_entity_already_registered` | Two entities registered with the same `entityName` |
| `dsr_request_conflict` | A conflicting request already exists for the same subject |
| `dsr_request_not_found` | `getRequest(id)` was called with an unknown id |

## When they surface

- **Boot time** — `dsr_invalid_policy`, `dsr_anonymize_dynamic_replacement`, `dsr_entity_already_registered`. Misconfigurations fail fast during module init, not mid-DSR.
- **Request submission** — `dsr_request_conflict` when you try to create a second active request for the same subject.
- **Request execution** — `dsr_verification_failed` after erase if residual rows remain.
- **Lookup** — `dsr_request_not_found` from `getRequest`.

## Pattern

```ts
import { DataSubjectError } from '@nestarc/data-subject';

try {
  await dataSubject.erase('user_123', 'tenant_abc');
} catch (err) {
  if (err instanceof DataSubjectError) {
    if (err.code === 'dsr_request_conflict') {
      return existingRequest;
    }
    logger.error({ code: err.code }, 'DSR failed');
  }
  throw err;
}
```

## Reserved codes

Additional codes exist in the public enum for **future or adapter-specific** use. Consumers should tolerate unknown codes when pattern-matching — treat anything outside the list above as an unexpected failure and surface it through your generic error path.
