# nestarc.dev

Official website and documentation for @nestarc — open-source NestJS reliability building blocks for multi-tenant SaaS backends

## Public content boundary

This repository contains public website content, API references, and runnable examples.
Keep SEO performance exports and analysis, internal handover notes, and provisional
commercial proposals in the separate private working repository. Do not copy them into
this checkout. Excluding a file from VitePress or the sitemap does not make GitHub source
private.

`npm run public:validate` rejects known private paths and Markdown links to those records,
including force-added files and ignored copies inside `public/`. VitePress also excludes
known private document names from page generation. The check runs in `docs:check` and
`docs:build`, so both CI and the hosting build enforce the publication boundary. API
validation applies the same policy to staged output before replacing the checked-in reference.

Data-subject generation publishes only its API modules, signatures, provenance, and a
small navigation README linking to maintained public guides. It does not copy the
upstream README or linked planning attachments, and unexpected output fails generation.
Review new public entry points before updating the allowed output files.

Removing current files does not remove previously published commits or upstream release
copies. Git history cleanup is a separate operation.

## Package metadata

[`data/package-catalog.mjs`](./data/package-catalog.mjs) is the source of truth for package names, repositories, versions, support and API status, navigation groups, adoption stages, and catalog copy. Update the catalog and generated API reference in the same change:

```bash
npm ci
npm run catalog:releases
npm run api:generate
npm run docs:check
```

`catalog:releases` compares the pinned catalog versions with npm's `latest` dist-tags without changing generation inputs. `docs:check` validates the catalog schema and repository routes, verifies generated API provenance and local links, builds the site, and checks the rendered output.

Inbox 0.2.0 uses a **Generated** API reference after verification of its npm SLSA provenance
against the immutable release source. It includes the root runtime API and the new
`@nestarc/inbox/testing` entry point. SQL schema v2 is unchanged from 0.1.0. Generation
links to the maintained usage and testing guides without copying upstream docs and
benchmark reports into the API tree. The initial 0.1.0 reference was curated because that
publication had neither `gitHead` nor SLSA provenance.

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
Audit-log 0.8.0 requires Node.js `^22.23.4 || ^24.22.1`. Soft-delete 0.7.5 excludes it from
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
