import { defineConfig } from 'vitepress'

const packagesNav = [
  { text: 'Overview', link: '/packages/' },
  {
    text: 'Foundation',
    items: [
      { text: 'tenancy', link: '/packages/tenancy/' },
      { text: 'safe-response', link: '/packages/safe-response/' },
      { text: 'pagination', link: '/packages/pagination/' },
    ],
  },
  {
    text: 'Data safety',
    items: [
      { text: 'soft-delete', link: '/packages/soft-delete/' },
      { text: 'idempotency', link: '/packages/idempotency/' },
    ],
  },
  {
    text: 'Operations & auth',
    items: [
      { text: 'audit-log', link: '/packages/audit-log/' },
      { text: 'api-keys', link: '/packages/api-keys/' },
      { text: 'feature-flag', link: '/packages/feature-flag/' },
      { text: 'rbac', link: '/packages/rbac/' },
    ],
  },
  {
    text: 'Async & compliance',
    items: [
      { text: 'outbox', link: '/packages/outbox/' },
      { text: 'jobs', link: '/packages/jobs/' },
      { text: 'webhook', link: '/packages/webhook/' },
      { text: 'data-subject', link: '/packages/data-subject/' },
    ],
  },
]

const toolingNav = [
  { text: 'Overview', link: '/tools/' },
  { text: 'mcp-guard', link: '/tools/mcp-guard/' },
]

const sidebar = {
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
        { text: 'API Reference', link: '/api/soft-delete/' },
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
        { text: 'API Reference', link: '/api/webhook/' },
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
        { text: 'API Reference', link: '/api/api-keys/' },
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
        { text: 'API Reference', link: '/api/rbac/' },
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
        { text: 'Outbox Bridge', link: '/packages/jobs/outbox-bridge' },
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

export default defineConfig({
  title: 'nestarc',
  description: 'Open-source NestJS reliability building blocks for multi-tenant SaaS backends',
  srcExclude: [
    'README.md',
    'docs/superpowers/**',
    'api/**/README.md',
    'api/**/LICENSE.md',
    'api/**/_media/**',
  ],

  sitemap: {
    hostname: 'https://nestarc.dev',
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'nestarc' }],
    ['meta', { property: 'og:description', content: 'Open-source NestJS reliability building blocks and a metadata-only control plane for multi-tenant SaaS.' }],
    ['meta', { property: 'og:url', content: 'https://nestarc.dev' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: 'nestarc',
      description: 'Open-source NestJS building blocks for multi-tenancy and reliable async delivery, with a metadata-only reliability control plane.',
      url: 'https://nestarc.dev',
      codeRepository: 'https://github.com/nestarc',
      programmingLanguage: 'TypeScript',
      runtimePlatform: 'Node.js',
      license: 'https://opensource.org/licenses/MIT',
      author: {
        '@type': 'Organization',
        name: 'nestarc',
        url: 'https://github.com/nestarc',
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    })],
  ],

  transformHead({ pageData }) {
    const head: Array<[string, Record<string, string>]> = []
    if (pageData.frontmatter.description) {
      head.push(['meta', {
        property: 'og:description',
        content: pageData.frontmatter.description,
      }])
    }
    return head
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    ko: {
      label: '한국어',
      lang: 'ko',
      description: '멀티테넌트 SaaS를 위한 오픈소스 NestJS reliability 빌딩 블록',
      themeConfig: {
        i18nRouting: false,
        nav: [
          { text: '시작하기', link: '/ko/getting-started' },
          { text: '패키지', items: packagesNav, activeMatch: '^/packages/' },
          {
            text: 'Reliability',
            link: 'https://reliability.nestarc.dev/',
            target: '_self',
          },
          { text: '도구', items: toolingNav, activeMatch: '^/tools/' },
          { text: '가이드', link: '/guide/' },
          { text: '블로그', link: '/blog/' },
          {
            text: '더보기',
            items: [
              { text: '커뮤니티', link: '/community/' },
              { text: 'API 레퍼런스', link: '/api/' },
              { text: 'FAQ', link: '/faq' },
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
    i18nRouting: false,
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
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright &copy; 2026 nestarc',
    },
  },
})
