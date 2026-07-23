---
description: "Join the nestarc community - contribute to open-source NestJS modules, report issues, and explore the project roadmap."
---

# Community

## Get Involved

- [GitHub Discussions](https://github.com/orgs/nestarc/discussions) - Questions, ideas, and general discussion
- [GitHub Issues](https://github.com/nestarc) - Bug reports and feature requests (per-package repos)
- [npm](https://www.npmjs.com/org/nestarc) - All published packages

## Contributing

We welcome contributions to any nestarc package. Here's how to get started:

### 1. Pick a package

Each package lives in its own repository under the [nestarc](https://github.com/nestarc) organization:

| Package | Repository |
|---------|-----------|
| tenancy | [nestarc/nestjs-tenancy](https://github.com/nestarc/nestjs-tenancy) |
| safe-response | [nestarc/nestjs-safe-response](https://github.com/nestarc/nestjs-safe-response) |
| audit-log | [nestarc/nestjs-audit-log](https://github.com/nestarc/nestjs-audit-log) |
| feature-flag | [nestarc/nestjs-feature-flag](https://github.com/nestarc/nestjs-feature-flag) |
| soft-delete | [nestarc/nestjs-soft-delete](https://github.com/nestarc/nestjs-soft-delete) |
| pagination | [nestarc/nestjs-pagination](https://github.com/nestarc/nestjs-pagination) |
| idempotency | [nestarc/idempotency](https://github.com/nestarc/idempotency) |
| outbox | [nestarc/outbox](https://github.com/nestarc/outbox) |
| webhook | [nestarc/webhook](https://github.com/nestarc/webhook) |
| api-keys | [nestarc/api-keys](https://github.com/nestarc/api-keys) |
| rbac | [nestarc/rbac](https://github.com/nestarc/rbac) |
| data-subject | [nestarc/data-subject](https://github.com/nestarc/data-subject) |
| jobs | [nestarc/jobs](https://github.com/nestarc/jobs) |

Labs and developer tooling live separately from the main SaaS package list:

| Tool | Repository |
|------|------------|
| mcp-guard | [nestarc/mcp-guard](https://github.com/nestarc/mcp-guard) |

### 2. Development workflow

```bash
# Clone the repo
git clone https://github.com/nestarc/<repo>.git
cd <repo>

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

### 3. Submit a PR

- Fork the repository
- Create a feature branch from `main`
- Write tests for your changes
- Ensure all tests pass
- Submit a pull request with a clear description

## Roadmap

Roadmap items are grouped by current product focus. Nestarc core stays focused on SaaS backend primitives; experimental developer tools live under Labs until they are proven enough to become part of the main product direction.

| Stage | Items |
|-------|-------|
| Now | `@nestarc/rbac`, `@nestarc/webhook` self-hosting docs, generated API reference refresh |
| Next | Webhook examples, access-control recipes, docs localization parity |
| Later | metering, quota, entitlements |
| Exploring | Additional Labs developer tools |

### Core vs Labs

Core roadmap items are packages, docs, examples, and operational workflows that directly support production SaaS backends. Labs items, including `@nestarc/mcp-guard`, are useful developer tools, but they are intentionally separate from the core package roadmap until their fit is clear.
