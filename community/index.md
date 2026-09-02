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

The current focus is to prove one coherent product loop: open-source NestJS reliability primitives emit bounded operational evidence, and Nestarc Reliability helps teams follow that evidence across an asynchronous workflow. New package categories remain paused while this loop is validated with real applications.

| Stage | Items |
|-------|-------|
| Now | Read-only Reliability pilot, adoption measurement, [async delivery reference workflow](/guide/async-delivery-workflow), first-party outbox → jobs delivery, generated API reference and trust refresh |
| Next | Validate the reference workflow and outbox → jobs delivery in real applications, then add package-specific Reliability evidence integrations |
| Later | Evidence-gated recovery controls and broader packaging, based on pilot results |
| Paused | New SaaS primitive categories, full localization parity, and additional Labs tools |

### Product boundary

The SaaS packages remain independently installable open source. Reliability is a separate, metadata-only control plane: customer execution stays in the application environment, while explicitly reported operational evidence can be correlated in a read-only pilot. Labs items, including `@nestarc/mcp-guard`, remain outside this product path.
