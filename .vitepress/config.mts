import { defineConfig } from 'vitepress'
import { existsSync } from 'node:fs'
import path from 'node:path'
import {
  packageCatalog,
  packageNavGroups,
  toolCatalog,
} from '../data/package-catalog.mjs'
import {
  headForPage,
  metadataForPage,
} from './seo-metadata.mjs'

function decodeSearchText(value: string) {
  return value
    .replace(/<[^>]+>/g, '')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .trim()
}

function splitGeneratedApiForSearch(file: string, html: string) {
  const normalizedFile = file.replaceAll('\\', '/')
  if (!normalizedFile.includes('/api/')) return undefined

  const sections = []
  for (const match of html.matchAll(/<h[1-6][^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h[1-6]>/gi)) {
    const title = decodeSearchText(match[2])
    if (!title) continue
    sections.push({
      anchor: match[1],
      text: title,
      titles: [title],
    })
  }
  return sections
}

function buildPackagesNav(locale: 'en' | 'ko') {
  return [
    { text: locale === 'ko' ? '개요' : 'Overview', link: '/packages/' },
    ...packageNavGroups.map((group) => ({
      text: locale === 'ko' ? group.labelKo : group.label,
      items: packageCatalog
        .filter((item) => group.categories.includes(item.category))
        .map((item) => ({
          text: item.slug,
          link: `/packages/${item.slug}/`,
        })),
    })),
  ]
}

function buildToolingNav(locale: 'en' | 'ko') {
  return [
    { text: locale === 'ko' ? '개요' : 'Overview', link: '/tools/' },
    ...toolCatalog.map((item) => ({
      text: item.slug,
      link: `/tools/${item.slug}/`,
    })),
  ]
}

const packagesNav = buildPackagesNav('en')
const packagesNavKo = buildPackagesNav('ko')
const toolingNav = buildToolingNav('en')
const toolingNavKo = buildToolingNav('ko')

type SidebarItem = { text: string; link: string }
type SidebarGroup = { text: string; items: SidebarItem[] }

const sidebar: Record<string, SidebarGroup[]> = {
  '/packages/': [
    {
      text: 'Packages',
      items: [
        { text: 'Overview', link: '/packages/' },
        { text: 'Adoption Roadmap', link: '/guide/adoption-roadmap' },
      ],
    },
  ],
  '/packages/tenancy/': [
    {
      text: 'tenancy',
      items: [
        { text: 'Introduction', link: '/packages/tenancy/' },
        { text: 'Installation', link: '/packages/tenancy/installation' },
        { text: 'Extractors', link: '/packages/tenancy/extractors' },
        { text: 'Lifecycle Hooks', link: '/packages/tenancy/lifecycle-hooks' },
        { text: 'Microservice Propagation', link: '/packages/tenancy/microservice' },
        { text: 'Tenant-Aware Caching', link: '/packages/tenancy/caching' },
        { text: 'CLI', link: '/packages/tenancy/cli' },
        { text: 'Testing', link: '/packages/tenancy/testing' },
        { text: 'Migration Guide', link: '/packages/tenancy/migration' },
        { text: 'Benchmark', link: '/packages/tenancy/benchmark' },
      ],
    },
  ],
  '/packages/safe-response/': [
    {
      text: 'safe-response',
      items: [
        { text: 'Introduction', link: '/packages/safe-response/' },
        { text: 'Installation', link: '/packages/safe-response/installation' },
        { text: 'Response Format', link: '/packages/safe-response/response-format' },
        { text: 'Pagination', link: '/packages/safe-response/pagination' },
        { text: 'Error Codes', link: '/packages/safe-response/error-codes' },
        { text: 'Swagger', link: '/packages/safe-response/swagger' },
        { text: 'Benchmark', link: '/packages/safe-response/benchmark' },
      ],
    },
  ],
  '/packages/audit-log/': [
    {
      text: 'audit-log',
      items: [
        { text: 'Introduction', link: '/packages/audit-log/' },
        { text: 'Installation', link: '/packages/audit-log/installation' },
        { text: 'Auto Tracking', link: '/packages/audit-log/auto-tracking' },
        { text: 'Manual Logging', link: '/packages/audit-log/manual-logging' },
        { text: 'Query API', link: '/packages/audit-log/query-api' },
        { text: 'Streaming Export', link: '/packages/audit-log/streaming-export' },
        { text: 'Durable Streams', link: '/packages/audit-log/durable-streams' },
        { text: 'Retention & Partitioning', link: '/packages/audit-log/retention' },
        { text: 'Benchmark', link: '/packages/audit-log/benchmark' },
      ],
    },
  ],
  '/packages/feature-flag/': [
    {
      text: 'feature-flag',
      items: [
        { text: 'Introduction', link: '/packages/feature-flag/' },
        { text: 'Installation', link: '/packages/feature-flag/installation' },
        { text: 'Guard & Decorator', link: '/packages/feature-flag/guard-decorator' },
        { text: 'Rollout', link: '/packages/feature-flag/rollout' },
        { text: 'Tenant Overrides', link: '/packages/feature-flag/tenant-overrides' },
        { text: 'Cache Adapters', link: '/packages/feature-flag/cache-adapters' },
        { text: 'Admin API', link: '/packages/feature-flag/admin-api' },
        { text: 'Custom Backends', link: '/packages/feature-flag/custom-backends' },
        { text: 'Benchmark', link: '/packages/feature-flag/benchmark' },
      ],
    },
  ],
  '/packages/soft-delete/': [
    {
      text: 'soft-delete',
      items: [
        { text: 'Introduction', link: '/packages/soft-delete/' },
        { text: 'Installation', link: '/packages/soft-delete/installation' },
        { text: 'Relation Filters', link: '/packages/soft-delete/relation-filters' },
        { text: 'Cascade', link: '/packages/soft-delete/cascade' },
        { text: 'Restore & Purge', link: '/packages/soft-delete/restore-purge' },
        { text: 'Decorators', link: '/packages/soft-delete/decorators' },
        { text: 'Events', link: '/packages/soft-delete/events' },
        { text: 'Upgrade to 0.6', link: '/packages/soft-delete/release-0.6' },
        { text: 'v0.5 Changes & Fixes', link: '/packages/soft-delete/release-0.5' },
        { text: 'Benchmark', link: '/packages/soft-delete/benchmark' },
      ],
    },
  ],
  '/packages/pagination/': [
    {
      text: 'pagination',
      items: [
        { text: 'Introduction', link: '/packages/pagination/' },
        { text: 'Installation', link: '/packages/pagination/installation' },
        { text: 'Offset vs Cursor', link: '/packages/pagination/offset-vs-cursor' },
        { text: 'Filters & Sorting', link: '/packages/pagination/filters-sorting' },
        { text: 'Swagger', link: '/packages/pagination/swagger' },
        { text: 'Benchmark', link: '/packages/pagination/benchmark' },
      ],
    },
  ],
  '/packages/idempotency/': [
    {
      text: 'idempotency',
      items: [
        { text: 'Introduction', link: '/packages/idempotency/' },
        { text: 'Installation', link: '/packages/idempotency/installation' },
        { text: 'How It Works', link: '/packages/idempotency/how-it-works' },
        { text: 'Storage Adapters', link: '/packages/idempotency/storage' },
        { text: 'Benchmark', link: '/packages/idempotency/benchmark' },
      ],
    },
  ],
  '/packages/outbox/': [
    {
      text: 'outbox',
      items: [
        { text: 'Introduction', link: '/packages/outbox/' },
        { text: 'Installation', link: '/packages/outbox/installation' },
        { text: 'How It Works', link: '/packages/outbox/how-it-works' },
        { text: 'Emitting Events', link: '/packages/outbox/emitting-events' },
        { text: 'Handling Events', link: '/packages/outbox/handling-events' },
        { text: 'Retry & Backoff', link: '/packages/outbox/retry-backoff' },
        { text: 'Transport Adapters', link: '/packages/outbox/transports' },
        { text: 'Benchmark', link: '/packages/outbox/benchmark' },
      ],
    },
  ],
  '/packages/webhook/': [
    {
      text: 'webhook',
      items: [
        { text: 'Introduction', link: '/packages/webhook/' },
        { text: 'Self-hosting', link: '/packages/webhook/self-hosting' },
        { text: 'Installation', link: '/packages/webhook/installation' },
        { text: 'How It Works', link: '/packages/webhook/how-it-works' },
        { text: 'Sending Events', link: '/packages/webhook/sending-events' },
        { text: 'Endpoint Management', link: '/packages/webhook/endpoint-management' },
        { text: 'Delivery Logs', link: '/packages/webhook/delivery-logs' },
        { text: 'Retry & Circuit Breaker', link: '/packages/webhook/retry-circuit-breaker' },
        { text: 'Operations & Data Lifecycle', link: '/packages/webhook/operations' },
        { text: 'Security', link: '/packages/webhook/security' },
        { text: 'Custom Adapters', link: '/packages/webhook/custom-adapters' },
      ],
    },
  ],
  '/packages/api-keys/': [
    {
      text: 'api-keys',
      items: [
        { text: 'Introduction', link: '/packages/api-keys/' },
        { text: 'Installation', link: '/packages/api-keys/installation' },
        { text: 'Key Format', link: '/packages/api-keys/key-format' },
        { text: 'Guards & Scopes', link: '/packages/api-keys/guards-scopes' },
        { text: 'Environments', link: '/packages/api-keys/environments' },
        { text: 'IP Allowlists', link: '/packages/api-keys/ip-allowlists' },
        { text: 'User Key Rotation', link: '/packages/api-keys/user-key-rotation' },
        { text: 'Pepper Rotation', link: '/packages/api-keys/pepper-rotation' },
        { text: 'Lifecycle & Context', link: '/packages/api-keys/lifecycle-context' },
        { text: 'Metrics & Testing', link: '/packages/api-keys/metrics-testing' },
        { text: 'Errors & Logging', link: '/packages/api-keys/errors-logging' },
        { text: 'Benchmark', link: '/packages/api-keys/benchmark' },
      ],
    },
  ],
  '/packages/rbac/': [
    {
      text: 'rbac',
      items: [
        { text: 'Introduction', link: '/packages/rbac/' },
        { text: 'Installation', link: '/packages/rbac/installation' },
        { text: 'Typed Permissions & Strict Mode', link: '/packages/rbac/typed-permissions' },
        { text: 'Guards & Permissions', link: '/packages/rbac/guards-permissions' },
        { text: 'Prisma Storage', link: '/packages/rbac/prisma-storage' },
        { text: 'Integrations', link: '/packages/rbac/integrations' },
        { text: 'Testing', link: '/packages/rbac/testing' },
        { text: 'Migration: 0.1 to 0.2', link: '/packages/rbac/migration-0.2' },
      ],
    },
  ],
  '/packages/data-subject/': [
    {
      text: 'data-subject',
      items: [
        { text: 'Introduction', link: '/packages/data-subject/' },
        { text: 'Installation', link: '/packages/data-subject/installation' },
        { text: 'Policy Model', link: '/packages/data-subject/policy-model' },
        { text: 'Export & Erase', link: '/packages/data-subject/export-erase' },
        { text: 'Events & Hooks', link: '/packages/data-subject/events-hooks' },
        { text: 'Errors', link: '/packages/data-subject/errors' },
        { text: 'Benchmark', link: '/packages/data-subject/benchmark' },
      ],
    },
  ],
  '/packages/jobs/': [
    {
      text: 'jobs',
      items: [
        { text: 'Introduction', link: '/packages/jobs/' },
        { text: 'Installation', link: '/packages/jobs/installation' },
        { text: 'Backends', link: '/packages/jobs/backends' },
        { text: 'Tenant Fairness', link: '/packages/jobs/tenant-fairness' },
        { text: 'Context Propagation', link: '/packages/jobs/context-propagation' },
        { text: 'Outbox Integration', link: '/packages/jobs/outbox-bridge' },
        { text: 'Testing', link: '/packages/jobs/testing' },
        { text: 'Benchmark', link: '/packages/jobs/benchmark' },
      ],
    },
  ],
  '/tools/': [
    {
      text: 'Tooling',
      items: [
        { text: 'Overview', link: '/tools/' },
        { text: 'mcp-guard', link: '/tools/mcp-guard/' },
      ],
    },
  ],
  '/tools/mcp-guard/': [
    {
      text: 'mcp-guard',
      items: [
        { text: 'Tooling Overview', link: '/tools/' },
        { text: 'Introduction', link: '/tools/mcp-guard/' },
      ],
    },
  ],
  '/guide/': [
    {
      text: 'Guide',
      items: [
        { text: 'Overview', link: '/guide/' },
        { text: 'Adoption Roadmap', link: '/guide/adoption-roadmap' },
        { text: 'Multi-tenant SaaS from Scratch', link: '/guide/multi-tenant-saas' },
        { text: 'Adding Audit Trail', link: '/guide/audit-trail' },
        { text: 'Production Access Control', link: '/guide/rbac-access-control' },
        { text: 'Feature Flags for Gradual Rollout', link: '/guide/feature-flags-rollout' },
        { text: 'Async Delivery Reference Workflow', link: '/guide/async-delivery-workflow' },
        { text: 'Prisma 7 Setup', link: '/guide/prisma-7' },
        { text: 'Prisma Extension Chaining', link: '/guide/prisma-extension-chaining' },
        { text: 'Quick Start: safe-response', link: '/guide/safe-response-quick-start' },
        { text: 'Quick Start: pagination', link: '/guide/pagination-quick-start' },
        { text: 'Example: SaaS API', link: '/guide/example-saas-api' },
        { text: 'Troubleshooting', link: '/guide/troubleshooting' },
      ],
    },
  ],
}

for (const item of packageCatalog) {
  const packageSidebar = sidebar[`/packages/${item.slug}/`]
  if (!packageSidebar) {
    throw new Error(`Missing package sidebar for ${item.slug}`)
  }

  const apiLink = `/api/${item.slug}/`
  for (const group of packageSidebar) {
    group.items = group.items.filter((sidebarItem) => sidebarItem.link !== apiLink)
  }

  if (item.apiStatus === 'Generated' || item.apiStatus === 'Curated') {
    packageSidebar[0].items.push({ text: 'API Reference', link: apiLink })
  }
}

sidebar['/api/'] = packageCatalog.map((item) => ({
  text: `@nestarc/${item.slug}`,
  items: [
    { text: 'Overview', link: `/api/${item.slug}/` },
    ...(existsSync(path.resolve('api', item.slug, 'modules.md'))
      ? [{ text: 'Public Modules', link: `/api/${item.slug}/modules` }]
      : []),
  ],
}))

for (const item of toolCatalog) {
  const sidebarKey = `/tools/${item.slug}/`
  if (!sidebar[sidebarKey]) {
    sidebar[sidebarKey] = [
      {
        text: item.slug,
        items: [
          { text: 'Tooling Overview', link: '/tools/' },
          { text: 'Introduction', link: sidebarKey },
        ],
      },
    ]
  }
}

export default defineConfig({
  vite: {
    resolve: {
      alias: [
        {
          find: /^\.\.\/composables\/langs$/,
          replacement: path.resolve('.vitepress/theme/composables/langs.ts'),
        },
        {
          find: /^\.\/composables\/langs$/,
          replacement: path.resolve('.vitepress/theme/composables/langs.ts'),
        },
      ],
    },
  },
  title: 'nestarc',
  description: 'Open-source NestJS reliability building blocks for multi-tenant SaaS backends',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: [
    'README.md',
    'docs/SEO_DIRECTION.md',
    'docs/seo-reports/**',
    'docs/superpowers/**',
    'api/**/README.md',
    'api/**/LICENSE.md',
    'api/**/CHANGELOG.md',
    'api/**/_media/**',
  ],

  sitemap: {
    hostname: 'https://nestarc.dev',
    lastmodDateOnly: true,
    transformItems(items) {
      const initialLastmod = new Map([
        ['/about', '2026-08-19'],
        ['/ko/packages/', '2026-08-19'],
        ['/ko/packages/tenancy/', '2026-08-19'],
        ['/ko/packages/idempotency/', '2026-08-19'],
        ['/ko/packages/outbox/', '2026-08-19'],
        ['/ko/packages/feature-flag/', '2026-08-19'],
      ])
      return items.map((item) => {
        const itemPath = new URL(item.url, 'https://nestarc.dev').pathname
        const englishAlternate = item.links?.find((link) => link.lang === 'en')
        return {
          ...item,
          lastmod: item.lastmod ?? initialLastmod.get(itemPath),
          ...(englishAlternate
            ? {
                links: [
                  ...item.links,
                  { lang: 'x-default', url: englishAlternate.url },
                ],
              }
            : {}),
        }
      })
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  ],

  transformPageData(pageData) {
    const metadata = metadataForPage(pageData, packageCatalog)
    const resolvedPageData = {
      ...pageData,
      title: metadata.title,
      description: metadata.description,
    }
    return {
      title: metadata.title,
      description: metadata.description,
      frontmatter: {
        ...pageData.frontmatter,
        head: [
          ...(pageData.frontmatter.head ?? []),
          ...headForPage(resolvedPageData),
        ],
      },
    }
  },

  transformHead({ pageData }) {
    if (!pageData.isNotFound) return []
    return [
      ['meta', { name: 'robots', content: 'noindex, nofollow' }],
      ['meta', { name: 'googlebot', content: 'noindex, nofollow' }],
    ]
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    ko: {
      label: '한국어',
      lang: 'ko',
      title: 'nestarc',
      description: '멀티테넌트 SaaS를 위한 오픈소스 NestJS reliability 빌딩 블록',
      themeConfig: {
        nav: [
          { text: '시작하기', link: '/ko/getting-started' },
          { text: '한국어 핵심 가이드', link: '/ko/packages/' },
          { text: '패키지', items: packagesNavKo, activeMatch: '^/packages/' },
          {
            text: 'Reliability',
            link: 'https://reliability.nestarc.dev/',
            target: '_self',
          },
          { text: '도구', items: toolingNavKo, activeMatch: '^/tools/' },
          { text: '가이드', link: '/guide/' },
          { text: '블로그', link: '/blog/' },
          {
            text: '더보기',
            items: [
              { text: '커뮤니티', link: '/community/' },
              { text: 'API 레퍼런스', link: '/api/' },
              { text: 'FAQ', link: '/faq' },
              { text: '소개', link: '/about' },
              { text: '변경 이력', link: '/changelog' },
            ],
          },
        ],
        sidebar,
        footer: {
          message: 'MIT 라이선스로 배포됩니다.',
          copyright: 'Copyright &copy; 2026 nestarc',
        },
      },
    },
  },

  themeConfig: {
    nav: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Packages', items: packagesNav, activeMatch: '^/packages/' },
      {
        text: 'Reliability',
        link: 'https://reliability.nestarc.dev/',
        target: '_self',
      },
      { text: 'Tooling', items: toolingNav, activeMatch: '^/tools/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Blog', link: '/blog/' },
      {
        text: 'More',
        items: [
          { text: 'Community', link: '/community/' },
          { text: 'API Reference', link: '/api/' },
          { text: 'FAQ', link: '/faq' },
          { text: 'About', link: '/about' },
          { text: 'Changelog', link: '/changelog' },
        ],
      },
    ],

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/nestarc' },
      { icon: 'npm', link: 'https://www.npmjs.com/org/nestarc' },
    ],

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          _splitIntoSections: splitGeneratedApiForSearch,
        },
      },
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright &copy; 2026 nestarc',
    },
  },
})
