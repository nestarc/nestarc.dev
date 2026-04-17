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

Use these codes (not messages) to branch in client code or structured logs. Messages are intended for humans and may change between patch releases.

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
import { ApiKeyError } from '@nestarc/api-keys';

try {
  await apiKeys.revoke(keyId);
} catch (err) {
  if (err instanceof ApiKeyError) {
    logger.warn({ code: err.code }, 'api key operation failed');
    throw err;
  }
  throw err;
}
```

Guard clauses like this keep the error's `code` structured in your logs while surfacing the original error upward.
