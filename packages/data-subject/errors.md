---
description: "DataSubjectError codes in @nestarc/data-subject 0.3.0, including preview validation, durable recovery, paged jobs, and returned failure states."
---

# Errors

`DataSubjectError` exposes stable `code` and `httpStatus` properties. Branch on `code`, not the error message. The status is metadata for your host application's error mapping; the error class itself is not a NestJS HTTP exception.

An `export()` or `erase()` call can resolve with a **failed request**. Always inspect the returned request's `state`, `failureReason`, and `stats.lifecycle`; catching rejected promises alone does not establish success.

## Configuration and Input

| Code | HTTP status | Meaning |
| --- | --- | --- |
| `dsr_invalid_policy` | 500 | Invalid policy, schema, registry dependencies, or executor configuration |
| `dsr_anonymize_dynamic_replacement` | 500 | An anonymization replacement is a function; use a supported static scalar |
| `dsr_entity_already_registered` | 500 | Duplicate `entityName` registration |
| `dsr_invalid_input` | 400 | Invalid identifier, option, paged payload/checkpoint, or other API input |
| `dsr_invalid_scope` | 400 | Tenant scope is absent, incompatible, or does not match the configured single tenant |

Policy and registration errors commonly surface during setup. Input and scope checks also run at service and adapter boundaries. A static anonymization replacement can be a string, finite number, or `null`; other invalid values use `dsr_invalid_policy`.

## Request and Verification

| Code | HTTP status | Meaning |
| --- | --- | --- |
| `dsr_request_conflict` | 409 | Request ID collision, or reuse of a durable request/job key with a different payload |
| `dsr_request_not_found` | 404 | No matching request or job in the supplied tenant scope |
| `dsr_verification_unavailable` | 400 | Required stable identities, scoped reads, or verification capabilities are unavailable |
| `dsr_verification_failed` | 500 | Post-write checks failed for deleted rows, replacement values, or preserved fields |

`dsr_request_conflict` does **not** mean the service enforces one active request per subject. Durable idempotency is keyed by tenant, request type, and `requestKey`. Repeating an identical durable call reuses the stored request, including a failed request; changing the payload under that key conflicts.

`ErasureVerificationError` extends `DataSubjectError` and carries `stats` and `actions`. The service can catch it and preserve sanitized details in the returned request's `stats.verification` and `stats.verificationResidual`.

## Preview and Recovery

| Code | HTTP status | Meaning |
| --- | --- | --- |
| `dsr_plan_mismatch` | 409 | Invalid preview binding/signature, policy or target-data drift, or a paged job's changed policy |
| `dsr_plan_expired` | 409 | Signed preview has expired |
| `dsr_durable_execution_required` | 400 | Missing durable store/key pair, unavailable durable recovery, or preview execution without a transaction-bound setup |
| `dsr_request_persistence_failed` | 500 | Request persistence or final lookup has an indeterminate outcome; reconcile by request ID |
| `dsr_artifact_write_failed` | 500 | Artifact preparation or writing failed |
| `dsr_artifact_expired` | 410 | Durable retry payload or paged artifact has expired or become unavailable |
| `dsr_invalid_state_transition` | 500 | Recovery or job operation is invalid for the current state |
| `dsr_evidence_report_invalid` | 500 | Durable evidence/retry payload cannot be safely validated |

A fresh preview requires fresh approval and a new request key for a new durable plan. A network retry should reuse the original key and context, including the original preview. Durable execution can record preview failures in a returned `failed` request rather than throw them.

`DataSubjectPersistenceError` extends `DataSubjectError` with `requestId`, `tenantId`, `dataOutcome`, and `recovery: 'reconcile_request'`. Reconcile that request, the data, and the artifact before executing again. Its `dataOutcome` describes what the call could establish and may differ from the last persisted record.

After data completion, artifact or notification failure does not mean erasure should run again. With a durable store, `retryCompletion(id, tenantId)` retries committed artifacts and notifications without repeating entity work. Expired retry payloads cannot be recovered this way. Paged jobs have their own state, checkpoint, and recovery APIs; earlier committed batches remain after a later failure.

## Handle Both Failure Channels

```ts
import {
  DataSubjectError,
  DataSubjectPersistenceError,
  type DataSubjectService,
  type RequestContext,
} from '@nestarc/data-subject';

async function eraseAndInspect(
  service: DataSubjectService,
  subjectId: string,
  tenantId: string,
  context?: RequestContext,
) {
  try {
    const request = await service.erase(subjectId, tenantId, context);
    if (request.state !== 'completed') {
      console.error({
        requestId: request.id,
        state: request.state,
        code: request.failureReason,
        lifecycle: request.stats?.lifecycle,
        verification: request.stats?.verification,
      });
    }
    // Also inspect lifecycle.artifactFailure and notificationFailures.
    return request;
  } catch (error) {
    if (error instanceof DataSubjectPersistenceError) {
      console.error({
        code: error.code,
        requestId: error.requestId,
        tenantId: error.tenantId,
        dataOutcome: error.dataOutcome,
        recovery: error.recovery,
      });
      // Reconcile this ID; do not automatically issue a new erase.
    } else if (error instanceof DataSubjectError) {
      console.error({ code: error.code, httpStatus: error.httpStatus });
    }
    throw error;
  }
}
```

Check the persistence subclass before the base class. Provider or database exceptions may also escape as other error types, so keep a generic failure path. Public request failure metadata sanitizes unrecognized errors to `dsr_operation_failed`; that fallback string is not a member of `DataSubjectErrorCode`.

## Separate Error Contracts

`dsr_subject_not_found` (404) and `dsr_unregistered_entity` (500) remain in the public code object for reserved or adapter-specific use; the core 0.3.0 implementation does not emit them. An empty subject query is not proof that a subject exists or is authorized.

Transcend failures use the separate `TranscendIntegrationError` class. Its `code` values are `invalid_configuration`, `invalid_webhook`, `unauthorized_webhook`, `unsupported_request`, `subject_not_mapped`, `invalid_job`, `provider_unavailable`, and `local_execution_incomplete`. Inspect its `retryable` property; these values are not `DataSubjectErrorCode` members and do not include the `transcend_` prefix used in its message. Lint findings likewise use their own `dsr_lint_*` report codes.

Source: [error definitions](https://github.com/nestarc/data-subject/blob/v0.3.0/src/errors.ts), [service failure handling](https://github.com/nestarc/data-subject/blob/v0.3.0/src/data-subject.service.ts), [durable recovery](https://github.com/nestarc/data-subject/blob/v0.3.0/docs/p1-migration.md), [paged jobs](https://github.com/nestarc/data-subject/blob/v0.3.0/docs/p2-execution.md), and [Transcend errors](https://github.com/nestarc/data-subject/blob/v0.3.0/src/integrations/transcend-auth.ts).
