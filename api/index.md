# API Reference

API reference entry point for current nestarc SaaS packages, plus separate tooling docs.

::: info
Generated TypeScript API docs are available for the packages marked `Generated`. Packages marked `Beta` are usable, and their API reference pages are being expanded with the same structure while full TypeDoc output is prepared.
:::

## Packages

| Package | Status | API Docs | Package Guide | Source |
|---------|--------|----------|---------------|--------|
| @nestarc/tenancy | Generated | [View API](/api/tenancy/) | [Guide](/packages/tenancy/) | [GitHub](https://github.com/nestarc/nestjs-tenancy) |
| @nestarc/safe-response | Generated | [View API](/api/safe-response/) | [Guide](/packages/safe-response/) | [GitHub](https://github.com/nestarc/nestjs-safe-response) |
| @nestarc/pagination | Generated | [View API](/api/pagination/) | [Guide](/packages/pagination/) | [GitHub](https://github.com/nestarc/nestjs-pagination) |
| @nestarc/soft-delete | Generated | [View API](/api/soft-delete/) | [Guide](/packages/soft-delete/) | [GitHub](https://github.com/nestarc/nestjs-soft-delete) |
| @nestarc/audit-log | Generated | [View API](/api/audit-log/) | [Guide](/packages/audit-log/) | [GitHub](https://github.com/nestarc/nestjs-audit-log) |
| @nestarc/feature-flag | Generated | [View API](/api/feature-flag/) | [Guide](/packages/feature-flag/) | [GitHub](https://github.com/nestarc/nestjs-feature-flag) |
| @nestarc/idempotency | Beta | [View API](/api/idempotency/) | [Guide](/packages/idempotency/) | [GitHub](https://github.com/nestarc/idempotency) |
| @nestarc/outbox | Beta | [View API](/api/outbox/) | [Guide](/packages/outbox/) | [GitHub](https://github.com/nestarc/outbox) |
| @nestarc/jobs | Beta | [View API](/api/jobs/) | [Guide](/packages/jobs/) | [GitHub](https://github.com/nestarc/jobs) |
| @nestarc/webhook | Beta | [View API](/api/webhook/) | [Guide](/packages/webhook/) | [GitHub](https://github.com/nestarc/webhook) |
| @nestarc/api-keys | Beta | [View API](/api/api-keys/) | [Guide](/packages/api-keys/) | [GitHub](https://github.com/nestarc/api-keys) |
| @nestarc/rbac | Beta | [View API](/api/rbac/) | [Guide](/packages/rbac/) | [GitHub](https://github.com/nestarc/rbac) |
| @nestarc/data-subject | Beta | [View API](/api/data-subject/) | [Guide](/packages/data-subject/) | [GitHub](https://github.com/nestarc/data-subject) |

## Tooling

| Package | Status | Docs | Source |
|---------|--------|------|--------|
| @nestarc/mcp-guard | Labs | [View Docs](/tools/mcp-guard/) | [GitHub](https://github.com/nestarc/mcp-guard) |

## Beta API Pages

Beta API pages follow the same minimum structure:

- Overview
- Installation
- Basic usage
- Configuration
- Public API
- Examples
- Production notes

They intentionally stay visible so new users can see the full 13-package SaaS surface instead of assuming the missing TypeDoc pages are unavailable packages. Labs tooling remains separate from the SaaS package API surface.
