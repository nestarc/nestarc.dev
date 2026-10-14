---
title: "nestarc Open-Source Community"
description: "Join the nestarc community - contribute to open-source NestJS modules, report issues, and explore the project roadmap."
---

<script setup>
import RepositoryCatalogTable from '../.vitepress/theme/components/RepositoryCatalogTable.vue'
</script>

# nestarc Open-Source Community

## Get Involved

- [GitHub Discussions](https://github.com/orgs/nestarc/discussions) - Questions, ideas, and general discussion
- [GitHub Issues](https://github.com/nestarc) - Bug reports and feature requests (per-package repos)
- [npm](https://www.npmjs.com/org/nestarc) - All published packages

## Contributing

We welcome contributions to any nestarc package. Here's how to get started:

### 1. Pick a package

Each package lives in its own repository under the [nestarc](https://github.com/nestarc) organization:

<RepositoryCatalogTable kind="package" />

Labs and developer tooling live separately from the main SaaS package list:

<RepositoryCatalogTable kind="tool" />

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

The open-source packages can be adopted independently or composed into an application workflow. The roadmap focuses on package compatibility, integration guidance, and operational behavior that can be verified against published releases.

| Area | Focus |
|------|-------|
| Package integration | Maintain the [async delivery reference workflow](/guide/async-delivery-workflow) and document the supported outbox → jobs delivery boundary |
| Compatibility | Keep runtime requirements, package version boundaries, and migration guidance aligned with published releases |
| Operations | Document retry, recovery, retention, tenant isolation, and lifecycle hooks with their limitations |
| Documentation | Keep generated API references and package adoption guidance aligned with the catalog |

### Package scope

The SaaS packages are independently installable open source and run in the application's own environment. Labs and developer tools, including `@nestarc/mcp-guard`, are listed separately from the main SaaS package catalog.
