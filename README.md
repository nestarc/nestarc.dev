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

Inbox 0.1.0 uses a **Curated** API reference checked against its published npm declarations and
immutable release source. Its initial interactive npm publication has neither `gitHead` nor
SLSA provenance, as recorded in the [release notes](https://github.com/nestarc/inbox/releases/tag/v0.1.0).
The catalog retains the SLSA policy for future generation; do not enable `Generated` until a
published release satisfies that policy. Existing generation and provenance checks remain in force.

Generated module navigation and the RBAC API-key integration introduction are maintained in
[`data/api-navigation.mjs`](./data/api-navigation.mjs). The generation pipeline applies this
context with `scripts/enrich-api-navigation.mjs`, preserving release-generated signatures and
source links. Update the navigation map when a release adds or removes an entry point; an
unmapped module fails generation instead of silently losing its usage guidance.

## Audit-log 0.8 adoption example

The audit-log API is generated from the published 0.8.0 tag. Generation keeps the release
signatures and links to the maintained site guides instead of copying the package README and
its linked examples into the API tree. The guides cover managed manual transactions, event
validation, diagnostics, and SQL Server history queries alongside PostgreSQL automatic tracking.

The downloadable example is maintained in `examples/audit-log-quick-start/` and pins the npm
0.8.0 package. Keep its archive and lockfile synchronized when updating the quickstart.
Audit-log 0.8.0 requires Node.js `^22.23.4 || ^24.22.1`. Soft-delete 0.7.4 excludes it from
its peer range; combined lifecycle recipes retain their explicitly documented older tuple.

## Live SEO validation

```bash
npm ci --ignore-scripts
npm run docs:validate:live
```

The live check requests every sitemap URL without following redirects and checks its HTML
content type, absolute self-canonical, robots meta tags and `X-Robots-Tag`, title, H1, and absence
of the VitePress 404 template. Requests and body reads have a 15-second timeout. Site-level
checks cover the sitemap dates, discovery files, missing-page behavior, and metadata samples.
The weekly workflow runs the same command. These checks identify technical indexing obstacles;
Google's selected canonical and actual index status still require Search Console URL inspection.
Fetch combines repeated response headers, so a bare `noindex` or `none` after another crawler's
scope is reported as ambiguous. Repeat the crawler name on restrictive directives intended
only for that crawler.

## Tenancy documentation corrections

Keep `packages/tenancy/`, its agent guide, `public/llms.txt`, and the package repository's README/JSDoc aligned. Source examples linked from `main` can be newer than the published release; publish their source before deploying links to new paths, and state the applicable package version.

Generated APIs must continue to come from the catalog's immutable published tag. Tenancy 0.16.2 includes the source JSDoc corrections and resource-key separator validation; it does not use the temporary 0.16.0 editorial overlay. Run generation on Node.js `^22.23.4 || ^24.22.1` to satisfy the release's strict engine requirement. The `.generated.json` file records the exact package version, tag, and commit used by TypeDoc.

```bash
# Regenerate tenancy only after its npm version and immutable tag are public:
npm run api:generate -- tenancy
npm run docs:check
```

For tenancy, the generated README is a short navigation page linking to the immutable source README and the maintained usage guides. TypeDoc does not copy the full consumer documentation into `_media`; API signatures and their source links are generated from the release itself. The documentation contract tests run in `docs:check` and the existing build workflow.
