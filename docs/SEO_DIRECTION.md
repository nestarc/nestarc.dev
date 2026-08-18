# nestarc.dev SEO Direction

> Status: active working brief  
> Baseline date: 2026-08-18 (Asia/Seoul)  
> Source: Google Search Console screenshot plus a read-only repository and live-URL audit  
> Scope: preserve SEO context and execution order across Codex sessions

## Executive direction

Treat the current Search Console result as **initial search discovery**, not as a failed SEO program.

The work order is:

1. Correct inaccurate or outdated high-intent articles.
2. Align sitemap, internal links, redirects, and canonical URLs.
3. Give package, guide, blog, and generated API pages distinct search intents and titles.
4. Add contextual links back to the preferred search landing pages.
5. Establish a complete 28-day baseline, then optimize query-page pairs with real evidence.

Do not optimize around the site-wide `0% CTR` yet. The available sample is too small and the average position is outside the top results.

## Search Console baseline

Property: `nestarc.dev`  
Search type: Web  
Selected range: 3 months  
Visible observation dates: 2026-08-14 through 2026-08-15

| Metric | Baseline |
|---|---:|
| Clicks | 0 |
| Impressions | 75 |
| CTR | 0% |
| Average position | 26.1 |

Visible queries:

| Query | Clicks | Impressions |
|---|---:|---:|
| `prisma soft delete` | 0 | 2 |
| `mcp guard` | 0 | 2 |
| `audit code nestjs` | 0 | 1 |
| `rbac nestjs` | 0 | 1 |
| `nest rbac` | 0 | 1 |
| `nestjs webhook` | 0 | 1 |

### Interpretation constraints

- The chart shows only two visible data days despite the three-month selector. Do not classify the approximate `46 -> 29` impression movement as a decline trend.
- The six visible query rows total 8 impressions, not 75. Search Console omits anonymized and some low-frequency queries from the table while retaining them in chart totals. Do not assign the remaining 67 impressions to a guessed keyword.
- Average position `26.1` is an aggregate of the topmost property result recorded for each impression. It is not the rank of every query or every page.
- The screenshot does not show query-level position, landing page, country, or device. It cannot establish cannibalization or a title/description CTR problem.
- The visible queries match the site's actual topics: Prisma soft delete, MCP security, NestJS audit logging, RBAC, and webhooks. Topical discovery has started.

Official references:

- [Search Console query dimensions and anonymized queries](https://support.google.com/webmasters/answer/17011259?hl=en)
- [How Google counts impressions, clicks, and average position](https://support.google.com/webmasters/answer/7042828?hl=en)
- [Search Console Performance report](https://support.google.com/webmasters/answer/7576553?hl=en)

## Verified repository and deployment state

### Healthy foundations

- [`public/robots.txt`](/robots.txt) allows crawling and declares `https://nestarc.dev/sitemap.xml`.
- `.vitepress/config.mts` configures the sitemap hostname and excludes internal/generated source material.
- VitePress emits server-rendered HTML; the blog list is not dependent on client-only rendering.
- The generated sitemap contains 177 public URLs.
- Search Console impressions confirm that Google is already discovering and serving at least some site content.

### URL and metadata mismatch

- 142 of the 177 sitemap URLs use a `.html` suffix.
- A live sample check found:
  - `https://nestarc.dev/blog/prisma-soft-delete-done-right` -> `200`
  - `https://nestarc.dev/blog/prisma-soft-delete-done-right.html` -> `308` to the extensionless URL
- The current built HTML set contains no self-referential canonical links.
- Global Open Graph metadata sets every page's `og:title` to `nestarc` and `og:url` to `https://nestarc.dev`; `transformHead` only replaces the description. See `.vitepress/config.mts`.
- The sitemap should contain the final extensionless URLs that the server serves as canonical. Internal links and canonical tags should use the same form.

Google references:

- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=en)
- [Canonical URL signals and redirects](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

### Duplicate or underspecified titles

The current build includes broad duplicate titles, including:

- `Installation | nestarc`: 12 pages
- `Benchmark | nestarc`: 11 pages
- package landing pages and generated API pages that share the same package-name title
- 34 generated API pages that inherit the same site-level description

Separate intent by surface:

- Package page: product/use-case intent, for example `NestJS Outbound Webhooks with @nestarc/webhook`.
- Guide/blog: problem-solving or tutorial intent.
- Generated API page: reference intent, for example `API Reference - @nestarc/webhook`.

## P0: content accuracy before traffic growth

### 1. Prisma soft delete article

Preferred landing page: `/blog/prisma-soft-delete-done-right`

Status: **completed on 2026-08-18** (implementation and local validation; not yet deployed).

The title and H1 match the query. The following inaccuracies were corrected:

- [`blog/prisma-soft-delete-done-right.md`](/blog/prisma-soft-delete-done-right) recommended `@@unique([email, deletedAt])` as active-row uniqueness. Because active rows use `NULL`, this can allow duplicate active emails. The corrected guidance follows [`packages/soft-delete/cascade.md`](/packages/soft-delete/cascade): use a database-specific partial or functional unique index.
- The article described a Client Extension but only showed module registration. It now follows [`packages/soft-delete/installation.md`](/packages/soft-delete/installation) by creating and using the extended Prisma client and warning that direct base-client deletes remain hard deletes.
- The article uses an obsolete/non-current `softDeleteService.softDelete()` example.
- Its cascade example omits required DMMF metadata.
- Its purge example uses an outdated argument shape.

Acceptance criteria:

- All examples match the current published package API and supported Prisma versions.
- PostgreSQL active-row uniqueness uses a partial unique index.
- The article shows the extended client boundary explicitly.
- Cascade, restore, and purge examples match the current documentation and tests.
- Add a visible reviewed/updated date and relevant version scope.

### 2. NestJS audit logging article

Preferred landing page: `/blog/nestjs-audit-log-without-refactoring`

Status: **completed on 2026-08-18** (implementation and local validation; not yet deployed).

[`blog/nestjs-audit-log-without-refactoring.md`](/blog/nestjs-audit-log-without-refactoring) previously used the older package setup. It now follows [`packages/audit-log/installation.md`](/packages/audit-log/installation), including:

- the provided schema installer or migration SQL,
- separate base and extended Prisma clients,
- application writes through the extended client,
- module configuration with `prisma`, `prismaModule`, and `actorExtractor`,
- Prisma 7 generated-client considerations.

Acceptance criteria:

- Rewrite the code path against the current package API.
- Preserve the no-business-logic-refactor value proposition without implying that base-client writes are intercepted.
- Add `NestJS Audit Log Code Example` naturally to the title, description, or opening section.
- Add a visible reviewed/updated date and version scope.

Do not request reindexing for either article until its examples are corrected.

## Preferred query-to-page map

Use one primary page per intent until Search Console query-page data proves a different mapping.

| Query cluster | Preferred canonical page | Page intent | Immediate action |
|---|---|---|---|
| `prisma soft delete` | `/blog/prisma-soft-delete-done-right` | explanatory implementation article | Correct P0 technical errors |
| `mcp guard` | `/tools/mcp-guard/` | tool landing and usage | Use a descriptive title/H1 and add output/remediation examples and trust links |
| `audit code nestjs` | `/blog/nestjs-audit-log-without-refactoring` | current code tutorial | Rewrite against current package contract |
| `rbac nestjs`, `nest rbac` | `/blog/nestjs-rbac-breaks-multi-tenant-apps` | RBAC pitfalls and implementation | Keep both variants on one page; strengthen inbound contextual links |
| `nestjs webhook` | `/packages/webhook/` | outbound webhook package landing | Make `NestJS Outbound Webhooks` explicit and distinguish outbound from inbound intent |

Before changing canonical ownership, select a query in Search Console and open the **Pages** tab to verify which URL actually received the impression.

## Prioritized backlog

### P0 - correctness

1. [x] Rewrite the soft-delete article against current APIs and database semantics. Completed 2026-08-18.
2. [x] Rewrite the audit-log article against the current Prisma/package integration contract. Completed 2026-08-18.

### P1 - URL and search-intent signals

3. Make extensionless URLs canonical across VitePress links, sitemap output, and page head metadata.
4. Add one absolute self-canonical per public page.
5. Generate unique page-specific `title`, description, `og:title`, and `og:url` values.
6. Give generated API pages `API Reference - @nestarc/<package>` titles and package-specific descriptions.
7. Give package landing pages explicit NestJS/use-case titles instead of package-name-only titles.

### P2 - internal linking and trust

8. Add contextual links from package and guide pages back to their preferred explanatory articles:
   - soft-delete package -> Prisma soft-delete article,
   - audit package/guide -> NestJS audit code article,
   - RBAC package/guide -> NestJS RBAC article,
   - async workflow -> webhook package landing.
9. Link the home/tool card directly to `/tools/mcp-guard/` where appropriate.
10. Show author, reviewed/updated date, and relevant framework/package versions on technical articles.
11. Distinguish home, article, documentation, and API structured data instead of emitting the same `SoftwareSourceCode` object on every page.

### P3 - regression protection

12. Extend site validation to assert:
    - exactly one canonical on every indexable page,
    - canonical equals the final sitemap/internal-link URL,
    - unique or intentionally allowlisted titles and descriptions,
    - correct absolute `og:url`,
    - valid page-appropriate JSON-LD,
    - no sitemap URLs that redirect.

## Measurement plan

### Required Search Console export

Capture and preserve these dimensions with clicks, impressions, CTR, and average position enabled:

1. Queries
2. Pages
3. Dates
4. Countries
5. Devices

For each visible query, filter the query first and then export the **Pages** tab. This creates the query-page map needed to detect cannibalization.

### Decision rules

- Establish the first complete 28-day period as the official baseline. Do not annualize or monthly-project the current two-day sample.
- Prioritize query-page pairs with meaningful impressions and average positions roughly 8-30.
- Treat `0% CTR` as inconclusive until a query or page has a materially larger sample in a comparable position band. A working review threshold is about 100 impressions, not a Google rule.
- If impressions rise while average position temporarily worsens, check whether Google is discovering new long-tail queries before treating it as regression.
- If a core page is indexed but receives no impressions after a complete baseline, revisit demand, intent, duplication, and internal links before merely rewriting its meta description.

### Directional success indicators

First 30 days after implementation:

- zero known critical inaccuracies in priority landing pages,
- 100% of sitemap entries are final, indexable canonical URLs,
- all preferred landing pages have unique titles/descriptions and contextual inbound links,
- a preserved 28-day GSC baseline exists.

Following 30-90 days:

- first organic clicks,
- growth in pages and query-page pairs receiving impressions,
- increasing count of query-page pairs in the top 20 and top 10,
- growth in 28-day clicks and impressions relative to the established baseline.

These are operating targets, not traffic forecasts or ranking guarantees.

## Next-session checklist

1. Read this file before proposing SEO work.
2. Run `git status --short` and preserve unrelated user changes.
3. Confirm whether the next task is implementation or further analysis.
4. If implementing, start with the two P0 article corrections.
5. Rebuild and validate the site after each metadata/URL change.
6. Confirm the live redirect, canonical, sitemap, and rendered head after deployment.
7. Record completed work and the deployment date in the change log below.
8. Revisit Search Console only after enough post-deployment data has accumulated.

## Change log

- 2026-08-18: Completed P0 content corrections. Rewrote the Prisma soft-delete article for `@nestarc/soft-delete` 0.6.x with PostgreSQL partial uniqueness, the extended-client boundary, explicit cascade DMMF, and current restore/purge APIs. Rewrote the NestJS audit-log article for `@nestarc/audit-log` 0.3.x with the schema installer, base/extended Prisma clients, Prisma 7 `prismaModule`, actor extraction, current query fields, and the automatic-audit transaction boundary. Added documentation contract coverage. Local catalog tests and the VitePress build pass; deployment and reindexing have not been performed.
- 2026-08-18: Initial GSC analysis and repository/live-site audit recorded. No SEO implementation completed yet.
