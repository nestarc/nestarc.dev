---
description: "Join the nestarc community — contribute to open-source NestJS modules, report issues, and explore the project roadmap."
---

# Community

## Get Involved

- [GitHub Discussions](https://github.com/orgs/nestarc/discussions) — Questions, ideas, and general discussion
- [GitHub Issues](https://github.com/nestarc) — Bug reports and feature requests (per-package repos)
- [npm](https://www.npmjs.com/org/nestarc) — All published packages

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

### 2. Development workflow

```bash
# Clone the repo
git clone https://github.com/nestarc/nestjs-<package>.git
cd nestjs-<package>

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

### In Progress

- Documentation site improvements (you're looking at it)

### Completed

- Performance benchmarks for all packages ([view benchmarks](/packages/tenancy/benchmark))

### Planned

- `@nestarc/rbac` — Role-based access control with tenant-scoped permissions
- `@nestarc/webhook` — Outbound webhook delivery with retry and signing
- Playground with StackBlitz embeds
- Showcase / Who's Using section

### Under Consideration

- `@nestarc/billing` — Usage-based billing primitives
- `@nestarc/notification` — Multi-channel notifications (email, Slack, webhook)
- Fastify-first adapters for all packages
