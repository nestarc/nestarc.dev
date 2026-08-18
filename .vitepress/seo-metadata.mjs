const siteOrigin = 'https://nestarc.dev'

const packageLandingTitles = {
  'api-keys': 'Secure NestJS API Keys with @nestarc/api-keys',
  'audit-log': 'NestJS Audit Logging with Prisma and @nestarc/audit-log',
  'data-subject': 'NestJS GDPR and CCPA Workflows with @nestarc/data-subject',
  'feature-flag': 'NestJS Feature Flags with @nestarc/feature-flag',
  idempotency: 'NestJS Idempotency with Redis and PostgreSQL',
  jobs: 'Tenant-Aware Background Jobs for NestJS',
  outbox: 'NestJS Transactional Outbox with Prisma',
  pagination: 'NestJS Prisma Pagination with @nestarc/pagination',
  rbac: 'Tenant-Aware NestJS RBAC with @nestarc/rbac',
  'safe-response': 'Standardized NestJS API Responses with @nestarc/safe-response',
  'soft-delete': 'Prisma Soft Delete for NestJS with @nestarc/soft-delete',
  tenancy: 'NestJS Multi-Tenancy with PostgreSQL RLS and Prisma',
  webhook: 'NestJS Outbound Webhooks with @nestarc/webhook',
}

function humanizePathSegment(value) {
  return value
    .replace(/\.md$/i, '')
    .split('/')
    .filter(Boolean)
    .map((segment) => segment
      .split('-')
      .map((word) => word ? `${word[0].toUpperCase()}${word.slice(1)}` : word)
      .join(' '))
    .join(' / ')
}

export function canonicalPathForPage(relativePath) {
  const cleanPath = relativePath
    .replaceAll('\\', '/')
    .replace(/\.md$/i, '')

  if (cleanPath === 'index') return '/'
  if (cleanPath.endsWith('/index')) {
    return `/${cleanPath.slice(0, -'index'.length)}`
  }
  return `/${cleanPath}`
}

export function metadataForPage(pageData, packageCatalog) {
  const relativePath = pageData.relativePath.replaceAll('\\', '/')
  const canonicalPath = canonicalPathForPage(relativePath)
  const packageMatch = relativePath.match(/^packages\/([^/]+)\/(.+)\.md$/)
  const apiMatch = relativePath.match(/^api\/([^/]+)\/(.+)\.md$/)
  const catalogPackage = (slug) => packageCatalog.find((item) => item.slug === slug)

  let title = pageData.title
  let description = pageData.description

  if (relativePath === 'index.md') {
    title = 'nestarc - Open-Source NestJS SaaS Building Blocks'
  } else if (relativePath === 'ko/index.md') {
    title = 'nestarc - 오픈소스 NestJS SaaS 빌딩 블록'
  } else if (relativePath === 'api/index.md') {
    title = 'NestJS Package API Reference'
    description = 'Browse package-specific TypeScript API references for the current @nestarc NestJS releases.'
  } else if (packageMatch) {
    const [, slug, page] = packageMatch
    if (page === 'index') {
      title = packageLandingTitles[slug]
        ?? `NestJS ${humanizePathSegment(slug)} with @nestarc/${slug}`
    } else {
      title = `${pageData.title} - @nestarc/${slug}`
    }
  } else if (apiMatch) {
    const [, slug, page] = apiMatch
    const item = catalogPackage(slug)
    const pageLabel = page === 'index'
      ? ''
      : (pageData.title === `@nestarc/${slug}`
          ? humanizePathSegment(page)
          : pageData.title)

    title = pageLabel
      ? `${pageLabel} - API Reference - @nestarc/${slug}`
      : `API Reference - @nestarc/${slug}`

    const packageSummary = item?.solves ?? `public TypeScript exports for @nestarc/${slug}`
    description = pageLabel
      ? `${pageLabel} API reference for @nestarc/${slug}. ${packageSummary}`
      : `API reference for @nestarc/${slug}. ${packageSummary}`
  }

  return {
    title,
    description: description || `${title} documentation for nestarc NestJS packages and developer tooling.`,
    canonicalPath,
    canonicalUrl: new URL(canonicalPath, siteOrigin).href,
  }
}
