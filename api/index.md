# API Reference

API reference entry point for current nestarc SaaS packages, plus separate tooling docs.

::: info
All package references are generated from the matching published release tag. This documentation status is separate from package support status; see the [package comparison](/packages/) for `Supported` and `Preview` definitions.
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
| @nestarc/idempotency | Generated | [View API](/api/idempotency/) | [Guide](/packages/idempotency/) | [GitHub](https://github.com/nestarc/idempotency) |
| @nestarc/outbox | Generated | [View API](/api/outbox/) | [Guide](/packages/outbox/) | [GitHub](https://github.com/nestarc/outbox) |
| @nestarc/jobs | Generated | [View API](/api/jobs/) | [Guide](/packages/jobs/) | [GitHub](https://github.com/nestarc/jobs) |
| @nestarc/webhook | Generated | [View API](/api/webhook/) | [Guide](/packages/webhook/) | [GitHub](https://github.com/nestarc/webhook) |
| @nestarc/api-keys | Generated | [View API](/api/api-keys/) | [Guide](/packages/api-keys/) | [GitHub](https://github.com/nestarc/api-keys) |
| @nestarc/rbac | Generated | [View API](/api/rbac/) | [Guide](/packages/rbac/) | [GitHub](https://github.com/nestarc/rbac) |
| @nestarc/data-subject | Generated | [View API](/api/data-subject/) | [Guide](/packages/data-subject/) | [GitHub](https://github.com/nestarc/data-subject) |

## Tooling

| Package | Status | Docs | Source |
|---------|--------|------|--------|
| @nestarc/mcp-guard | Labs | [View Docs](/tools/mcp-guard/) | [GitHub](https://github.com/nestarc/mcp-guard) |

## Generation policy

The weekly workflow uses:

- the explicit package versions declared by the generator;
- the corresponding immutable `v<version>` Git tags;
- a lockfile-pinned TypeDoc, Markdown plugin, and TypeScript toolchain;
- entry-page and relative-link validation before the site build and commit.

Labs tooling remains separate from the SaaS package API surface.
