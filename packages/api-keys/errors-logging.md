---
description: "Stable ApiKeyError codes and how to redact raw keys before they reach logs, traces, or error reporters."
---

# Errors & Logging

## Typed errors

Verification and authorization failures throw `ApiKeyError` with a stable `code`:

| Code | HTTP | Meaning |
| --- | --- | --- |
| `api_key_missing` | 401 | No key on the request |
| `api_key_malformed` | 401 | Key doesn't match the expected format |
| `api_key_invalid` | 401 | Key not found or secret mismatch |
| `api_key_revoked` | 401 | Key was revoked |
| `api_key_expired` | 401 | Key is past `expiresAt` |
| `api_key_environment_mismatch` | 403 | Key environment doesn't match route |
| `api_key_scope_insufficient` | 403 | Key is missing a required scope |
| `api_key_ip_not_allowed` | 403 | Client IP is missing, invalid, or outside the key allowlist |

Use these codes (not messages) to branch in client code or structured logs. Messages are intended for humans and may change between patch releases.

## Rotation operation errors

Rotation precondition failures use `ApiKeyOperationError` rather than an HTTP-specific `ApiKeyError`:

| Code | Meaning |
| --- | --- |
| `api_key_record_not_found` | The requested record does not exist. |
| `api_key_not_rotatable` | The key is revoked, expired, or already replaced. |

## Redacting keys before logging

Never log raw API keys. The package exports `API_KEY_REDACT_REGEX` so you can redact them before request or error logs are written:

```typescript
import { API_KEY_REDACT_REGEX } from '@nestarc/api-keys';

export function redactApiKeys(value: string): string {
  return value.replace(API_KEY_REDACT_REGEX, '[REDACTED_API_KEY]');
}
```

Plug the redactor into:

- **Request/response loggers** — HTTP interceptors, access logs, morgan/pino formatters
- **Error reporters** — Sentry/Datadog `beforeSend` hooks that serialize request bodies or headers
- **Application logs** — before any `console.log` that might include a user-supplied string

The regex matches on the `<namespace>_<env>_<prefix>_<secret>` shape, so it catches the full token even when it appears inside URLs, JSON bodies, or stack traces.

## Error handling pattern

```typescript
import {
  ApiKeyOperationError,
  ApiKeyOperationErrorCode,
} from '@nestarc/api-keys';

try {
  await apiKeys.rotate(keyId, { gracePeriodMs: 10 * 60 * 1000 });
} catch (err) {
  if (
    err instanceof ApiKeyOperationError &&
    err.code === ApiKeyOperationErrorCode.NotRotatable
  ) {
    logger.warn({ code: err.code }, 'api key operation failed');
  }
  throw err;
}
```

Guard clauses like this keep the error's `code` structured in your logs while surfacing the original error upward.

Lifecycle events and verification metrics are designed to avoid raw credentials. Still review your sink implementations: do not enrich metric labels with key ids, tenant ids, prefixes, scopes, client IPs, or route paths.

## 0.4 error and observer contract

`ApiKeyError` extends Nest `HttpException`, preserving `instanceof`, `code`, and `httpStatus` while returning the documented HTTP status and safe `{ statusCode, code }` body through the default Nest pipeline. Incorrect secrets reveal neither revoked nor expired state.

Additional `ApiKeyOperationError` codes apply to issuance and management:

| Code | Meaning |
| --- | --- |
| `api_key_invalid_input` | Invalid namespace, environment, scopes, or exact tenant identity |
| `api_key_invalid_time` | Invalid Date, duration, overflow, or TTL-policy violation |
| `api_key_prefix_collision` | Create/rotate exhausted three prefix-collision attempts |

Observer inputs are detached copies. Synchronous throws and rejected promises from lifecycle, metric, deprecated `onAuthFailed`, and observer-error callbacks cannot replace the original operation result. Prefer structured `api_key.auth_failed` events to `onAuthFailed`.
