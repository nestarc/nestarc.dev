# nestarc.dev

Official website and documentation for @nestarc — open-source NestJS reliability building blocks for multi-tenant SaaS backends

## Package metadata

[`data/package-catalog.mjs`](./data/package-catalog.mjs) is the source of truth for package names, repositories, versions, support and API status, navigation groups, adoption stages, and catalog copy. Update the catalog and generated API reference in the same change:

```bash
npm ci
npm run catalog:releases
npm run api:generate
npm run docs:check
```

`catalog:releases` compares the pinned catalog versions with npm's `latest` dist-tags without changing generation inputs. `docs:check` validates the catalog schema and repository routes, verifies generated API provenance and local links, builds the site, and checks the rendered output.
