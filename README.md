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

## Tenancy documentation corrections

Keep `packages/tenancy/`, its agent guide, `public/llms.txt`, and the package repository's README/JSDoc aligned. Source examples linked from `main` can be newer than the published release; publish their source before deploying links to new paths, and state the applicable package version.

Generated APIs must continue to come from the catalog's immutable published tag. Tenancy 0.16.1 includes the corrected JSDoc in the source release, so it no longer uses the temporary 0.16.0 editorial overlay. The `.generated.json` file records the exact package version, tag, and commit used by TypeDoc.

```bash
# Regenerate tenancy only after its npm version and immutable tag are public:
npm run api:generate -- tenancy
npm run docs:check
```

For tenancy, the generated README is a short navigation page linking to the immutable source README and the maintained usage guides. TypeDoc does not copy the full consumer documentation into `_media`; API signatures and their source links are generated from the release itself. The documentation contract tests run in `docs:check` and the existing build workflow.
