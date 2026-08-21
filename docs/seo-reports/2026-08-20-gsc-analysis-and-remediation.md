# nestarc.dev Search Performance Analysis and Remediation

> Report date: 2026-08-20 (Asia/Seoul)  
> Property: `nestarc.dev`  
> Search type: Web  
> GSC selector: Previous three months  
> Visible data dates: 2026-08-14 through 2026-08-18  
> Deployment verified: 2026-08-20

This is an internal decision record. It preserves the source data, interpretation, implementation rationale, and post-deployment checks used for the 2026-08-20 SEO changes. It is excluded from the public VitePress build and sitemap.

## Source provenance

- Original export: `nestarc.dev-Performance-on-Search-2026-08-20.xlsx`
- Source location at analysis time: `/Users/ksy/Downloads/nestarc.dev-Performance-on-Search-2026-08-20.xlsx`
- File size: 9,987 bytes
- SHA-256: `2ab6cd9b47435701768382c8eabbbe649e7c3ee1621e9dadb025e28e94562021`
- Workbook tabs: `차트`, `검색어 수`, `페이지`, `국가`, `기기`, `검색 노출`, `필터`

The workbook was treated only as source data. It was not modified.

## 1. Current data

### Property-level daily performance

| Date | Clicks | Impressions | CTR | Average position |
|---|---:|---:|---:|---:|
| 2026-08-14 | 0 | 46 | 0.00% | 22.5 |
| 2026-08-15 | 0 | 29 | 0.00% | 31.9 |
| 2026-08-16 | 1 | 80 | 1.25% | 24.2 |
| 2026-08-17 | 0 | 39 | 0.00% | 23.8 |
| 2026-08-18 | 1 | 56 | 1.79% | 21.7 |
| **Total / weighted result** | **2** | **250** | **0.80%** | **24.2** |

The reported position is approximately `24.158`, calculated by weighting each daily average position by that day's impressions.

### Highest-impression pages

| Page | Clicks | Impressions | CTR | Average position |
|---|---:|---:|---:|---:|
| `/changelog` | 0 | 41 | 0.00% | 21.24 |
| `/blog/prisma-soft-delete-done-right` | 0 | 34 | 0.00% | 8.62 |
| `/guide/multi-tenant-saas` | 0 | 29 | 0.00% | 30.72 |
| `/guide/prisma-extension-chaining` | 0 | 26 | 0.00% | 11.19 |
| `/packages/audit-log/` | 0 | 18 | 0.00% | 17.17 |
| `/blog/cursor-vs-offset-pagination-prisma` | 1 | 15 | 6.67% | 8.00 |
| `/packages/pagination/` | 1 | 13 | 7.69% | 41.46 |

### Visible queries

| Query | Clicks | Impressions | Average position |
|---|---:|---:|---:|
| `audit code nestjs` | 0 | 7 | 28.43 |
| `site:nestarc.dev` | 0 | 6 | 17.67 |
| `prisma soft delete` | 0 | 2 | 22.00 |
| `nestjs webhook` | 0 | 2 | 33.00 |
| `mcp guard` | 0 | 2 | 40.50 |
| `rbac nestjs` | 0 | 1 | 32.00 |
| `nest rbac` | 0 | 1 | 48.00 |
| `finbuckle multitenant` | 0 | 1 | 60.00 |

### Device and country signals

| Device | Clicks | Impressions | CTR | Average position |
|---|---:|---:|---:|---:|
| Desktop | 2 | 216 | 0.93% | 26.47 |
| Mobile | 0 | 34 | 0.00% | 9.44 |

The United States supplied 131 impressions and one click, or 52.4% of property impressions. The Philippines supplied 26 impressions and India supplied 16. Tanzania's one click from one impression is treated as noise, not a 100% CTR benchmark.

### Data limitations

1. The selector covers three months, but the export contains only five visible daily rows. This is an initial-discovery sample, not a stable trend.
2. Visible query rows account for 22 of 250 impressions, or 8.8%. The remaining 228 impressions must not be assigned to guessed keywords.
3. Page rows total 317 impressions while the property chart totals 250. Page-dimension rows are valid for prioritization but must not be summed to reconstruct property CTR.
4. The `검색 노출` sheet contains only its header, so rich-result or search-appearance performance cannot be evaluated.
5. Mobile has only 34 impressions. Its zero-click result is a review signal, not proof of a mobile usability or snippet defect.

## 2. Analysis result

### Overall interpretation

Search discovery has started and is topically aligned with the product. The visible queries map to the site's actual NestJS, Prisma, audit logging, soft-delete, webhook, MCP security, and RBAC topics. The sample is too small to classify the site-wide CTR as a mature performance problem.

### Positive signals

- `/blog/cursor-vs-offset-pagination-prisma` is the clearest early performer: position 8.0, one click, and 6.67% CTR.
- `/blog/prisma-soft-delete-done-right` already reaches the first page on average, showing that Google understands its topic.
- `/guide/prisma-extension-chaining` is close to the first page at position 11.19.
- The United States represents most impressions, which matches the English-first technical content strategy.

### Highest-priority opportunities

1. **Soft-delete snippet and intent alignment:** 34 impressions at position 8.62 with no clicks made this the highest-confidence title and description opportunity.
2. **Prisma extension first-page push:** 26 impressions at position 11.19 justified a more explicit NestJS/Prisma title and stronger links from related implementation content.
3. **Audit-log query alignment:** the query `audit code nestjs` received the most visible query impressions, while the package landing page sat at position 17.17. The explanatory code article remains the preferred query landing page.
4. **Multi-tenant depth and linking:** 29 impressions at position 30.72 showed topical discovery but weak ranking. The guide needed a more descriptive search title and an early link to the problem-first article.
5. **Changelog intent:** `/changelog` had the most page impressions but no clicks at position 21.24. Its title needed to explain that it contains NestJS package releases. It was not noindexed because the data did not establish that its search visibility was harmful.

### Duplicate URL evidence

The page export contained both `.html` and extensionless forms for three blog articles:

| Content | Extensionless row | `.html` row |
|---|---|---|
| Cursor vs offset pagination | 15 impressions, 1 click, position 8 | 1 impression, position 7 |
| NestJS audit log | 2 impressions, position 33 | 4 impressions, position 6.25 |
| NestJS idempotency | 1 impression, position 10 | 1 impression, position 54 |

The site already used `cleanUrls: true`, extensionless sitemap entries, self-canonical tags, and platform redirects. Because the export spans the pre- and post-clean-URL deployment period, these rows did not prove a current canonical regression. Explicit edge redirects were still added for the three observed legacy URLs to make the consolidation rule deterministic and testable.

## 3. Modification rationale and implementation

### A. URL consolidation

Changed `public/_redirects`:

- `/blog/cursor-vs-offset-pagination-prisma.html` -> `/blog/cursor-vs-offset-pagination-prisma` with 301
- `/blog/nestjs-audit-log-without-refactoring.html` -> `/blog/nestjs-audit-log-without-refactoring` with 301
- `/blog/nestjs-idempotency-implementation-broken.html` -> `/blog/nestjs-idempotency-implementation-broken` with 301

Changed `test/site-validation.test.mjs` so these observed English legacy URLs are allowlisted, permanent, unique, extensionless at the destination, and backed by a published Markdown target.

### B. Search titles and descriptions

| Page | Implemented search title | Reason |
|---|---|---|
| `/blog/prisma-soft-delete-done-right` | `Prisma Soft Delete in NestJS: Patterns and Pitfalls` | Exact topic in the title, shorter SERP presentation, preserves the problem/pitfall value proposition |
| `/blog/nestjs-audit-log-without-refactoring` | `NestJS Audit Log Code Example with Prisma` | Matches the visible audit-code query with a shorter, explicit implementation title |
| `/guide/prisma-extension-chaining` | `Prisma Client Extension Chaining for NestJS` | Distinguishes it from generic extension-chaining content and names both technologies |
| `/guide/multi-tenant-saas` | `Multi-Tenant NestJS with Prisma and PostgreSQL RLS` | Names the framework, ORM, and database enforcement mechanism |
| `/changelog` | `nestarc Changelog: NestJS Package Releases` | Clarifies the page's search intent instead of exposing a generic `Changelog` title |

The two technical blog articles use `reviewed: 2026-08-20`, which also updates their `BlogPosting.dateModified` structured data.

### C. Contextual internal links

- `packages/pagination/index.md` now links near the introduction to the performing cursor-vs-offset comparison article.
- The pagination article uses canonical root-relative internal links to the package documentation and benchmark.
- `guide/prisma-extension-chaining.md` links near the introduction to the preferred soft-delete and audit-log explanatory articles.
- `guide/multi-tenant-saas.md` links near the introduction to the multi-tenancy pitfalls article and current tenancy package contract.
- Existing soft-delete and audit-log package pages already linked to their preferred explanatory articles and were preserved.

### D. Changes deliberately not made

- No page was noindexed based on five days of data.
- No keyword was repeated unnaturally or mapped to multiple competing primary pages.
- No mobile-specific content or layout change was made from only 34 mobile impressions.
- Canonical ownership was not changed because the existing extensionless ownership was already correct.
- The overall CTR was not treated as a stable failure metric.

## 4. Verification evidence

### Local verification

`npm run docs:check` passed after the modifications:

- 68 tests passed.
- 13 generated and 13 documented API packages validated.
- 84 API Markdown files validated.
- The VitePress production build succeeded.
- 184 public pages and 185 HTML files passed site validation.
- The sitemap contained no `.html` locations.
- Rendered target pages had one route-matching extensionless canonical URL.

### Production verification after deployment

`npm run docs:validate:live` passed on 2026-08-20:

- All 184 sitemap URLs returned 2xx without redirects.
- Sitemap `lastmod`, `robots.txt`, `llms.txt`, 404 behavior, canonical tags, JSON-LD, and social-image controls passed.

Direct production requests confirmed:

| Legacy URL | Status | Location |
|---|---:|---|
| `/blog/cursor-vs-offset-pagination-prisma.html` | 301 | `/blog/cursor-vs-offset-pagination-prisma` |
| `/blog/nestjs-audit-log-without-refactoring.html` | 301 | `/blog/nestjs-audit-log-without-refactoring` |
| `/blog/nestjs-idempotency-implementation-broken.html` | 301 | `/blog/nestjs-idempotency-implementation-broken` |

## 5. Follow-up measurement plan

Use the 2026-08-20 deployment as the start of this remediation measurement window.

### Suggested checkpoints

- **2026-08-27 or later:** confirm that Google continues to select extensionless URLs and that no new canonical/indexing errors appear.
- **2026-09-17 or later:** export a complete 28-day comparison using the same property and Web search type.

### Compare these metrics

1. Total clicks, impressions, CTR, and average position.
2. Impressions and CTR for the five pages whose metadata changed.
3. Count of pages and query-page pairs in positions 1-10 and 11-20.
4. Whether `.html` rows stop receiving new impressions after the deployment and crawl lag.
5. Mobile impressions and CTR once the sample is materially larger.
6. Visible query-to-page ownership for `prisma soft delete`, `audit code nestjs`, `nestjs webhook`, `mcp guard`, and RBAC variants.

### Reproduction commands

```bash
npm run docs:check
npm run docs:validate:live
```

Do not judge the remediation by raw click counts before enough post-deployment impressions accumulate. Compare like-for-like date windows and preserve the query and page exports used for each decision.
