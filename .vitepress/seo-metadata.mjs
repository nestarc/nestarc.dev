import { packageCatalog } from '../data/package-catalog.mjs'

const siteOrigin = 'https://nestarc.dev'
const organizationId = `${siteOrigin}/#organization`
const defaultShareImage = `${siteOrigin}/og-default.png`

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

export function organization() {
  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: 'nestarc',
    url: `${siteOrigin}/`,
    description: 'Open-source NestJS reliability building blocks for multi-tenant SaaS backends.',
    logo: {
      '@type': 'ImageObject',
      url: `${siteOrigin}/favicon.svg`,
    },
    sameAs: [
      'https://github.com/nestarc',
      'https://www.npmjs.com/org/nestarc',
    ],
  }
}

function isoDate(value) {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10)
}

export function structuredDataForPage(pageData) {
  const relativePath = pageData.relativePath.replaceAll('\\', '/')
  const canonicalPath = canonicalPathForPage(relativePath)
  const url = new URL(canonicalPath, siteOrigin).href
  const common = {
    '@context': 'https://schema.org',
    name: pageData.title,
    description: pageData.description,
    url,
    breadcrumb: breadcrumbForPage(relativePath, pageData.title),
  }

  if (relativePath === 'index.md' || relativePath === 'ko/index.md') {
    return {
      ...common,
      '@type': 'WebSite',
      publisher: organization(),
      inLanguage: relativePath === 'ko/index.md' ? 'ko' : 'en',
    }
  }

  if (relativePath.startsWith('blog/') && relativePath !== 'blog/index.md') {
    return {
      ...common,
      '@type': 'BlogPosting',
      headline: pageData.title,
      datePublished: isoDate(pageData.frontmatter.date),
      dateModified: isoDate(pageData.frontmatter.reviewed),
      author: organization(),
      publisher: organization(),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      image: defaultShareImage,
      ...(pageData.frontmatter.versionScope
        ? { about: pageData.frontmatter.versionScope }
        : {}),
    }
  }

  if (relativePath.startsWith('api/')) {
    return {
      ...common,
      '@type': 'APIReference',
      author: organization(),
      programmingModel: 'TypeScript',
      targetPlatform: 'Node.js',
    }
  }

  if (/^packages\/[^/]+\/index\.md$/.test(relativePath)) {
    const packageSlug = relativePath.split('/')[1]
    const repository = packageCatalog.find((item) => item.slug === packageSlug)?.repository
    return {
      ...common,
      '@type': 'SoftwareSourceCode',
      author: organization(),
      ...(repository ? { codeRepository: `https://github.com/nestarc/${repository}` } : {}),
      programmingLanguage: 'TypeScript',
      runtimePlatform: 'Node.js',
    }
  }

  if (relativePath === 'about.md') {
    return {
      ...common,
      '@type': 'AboutPage',
      mainEntity: organization(),
    }
  }

  return {
    ...common,
    '@type': 'TechArticle',
    author: organization(),
  }
}

function breadcrumbForPage(relativePath, title) {
  const canonicalPath = canonicalPathForPage(relativePath)
  if (canonicalPath === '/') return undefined

  const segments = canonicalPath.split('/').filter(Boolean)
  const itemListElement = [{
    '@type': 'ListItem',
    position: 1,
    name: 'nestarc',
    item: `${siteOrigin}/`,
  }]

  for (let index = 0; index < segments.length; index += 1) {
    const isSection = index === 0 && ['packages', 'api', 'blog', 'guide', 'community', 'tools', 'ko'].includes(segments[0])
    const path = `/${segments.slice(0, index + 1).join('/')}${isSection ? '/' : ''}`
    itemListElement.push({
      '@type': 'ListItem',
      position: index + 2,
      name: index === segments.length - 1 ? title : humanizePathSegment(segments[index]),
      item: new URL(path, siteOrigin).href,
    })
  }

  return {
    '@type': 'BreadcrumbList',
    itemListElement,
  }
}

export function headForPage(pageData) {
  const relativePath = pageData.relativePath.replaceAll('\\', '/')
  if (pageData.isNotFound || !pageData.filePath || relativePath === '404.md') {
    return [
      ['meta', { name: 'robots', content: 'noindex, nofollow' }],
      ['meta', { name: 'googlebot', content: 'noindex, nofollow' }],
    ]
  }

  const canonicalPath = canonicalPathForPage(relativePath)
  const canonicalUrl = new URL(canonicalPath, siteOrigin).href
  const structuredData = structuredDataForPage(pageData)
  const isArticle = relativePath.startsWith('blog/') && relativePath !== 'blog/index.md'

  return [
    ['link', { rel: 'canonical', href: canonicalUrl }],
    ['meta', { property: 'og:type', content: isArticle ? 'article' : 'website' }],
    ['meta', { property: 'og:site_name', content: 'nestarc' }],
    ['meta', { property: 'og:title', content: pageData.title }],
    ['meta', { property: 'og:description', content: pageData.description }],
    ['meta', { property: 'og:url', content: canonicalUrl }],
    ['meta', { property: 'og:image', content: defaultShareImage }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: pageData.title }],
    ['meta', { name: 'twitter:description', content: pageData.description }],
    ['meta', { name: 'twitter:image', content: defaultShareImage }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(structuredData)],
  ]
}
