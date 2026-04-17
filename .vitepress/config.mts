import { defineConfig } from 'vitepress'

const packagesNav = [
  { text: 'tenancy', link: '/packages/tenancy/' },
  { text: 'safe-response', link: '/packages/safe-response/' },
  { text: 'audit-log', link: '/packages/audit-log/' },
  { text: 'feature-flag', link: '/packages/feature-flag/' },
  { text: 'soft-delete', link: '/packages/soft-delete/' },
  { text: 'pagination', link: '/packages/pagination/' },
  { text: 'idempotency', link: '/packages/idempotency/' },
  { text: 'outbox', link: '/packages/outbox/' },
  { text: 'webhook', link: '/packages/webhook/' },
  { text: 'api-keys', link: '/packages/api-keys/' },
  { text: 'data-subject', link: '/packages/data-subject/' },
  { text: 'jobs', link: '/packages/jobs/' },
]

const cloudNav = [
  { text: 'webhook-platform (Beta)', link: 'https://webhook.nestarc.dev' },
]

const sidebar = {
  '/packages/tenancy/': [
    {
      text: 'tenancy',
      items: [
        { text: 'Introduction', link: '/packages/tenancy/' },
        { text: 'Installation', link: '/packages/tenancy/installation' },
        { text: 'Extractors', link: '/packages/tenancy/extractors' },
        { text: 'Lifecycle Hooks', link: '/packages/tenancy/lifecycle-hooks' },
        { text: 'Microservice Propagation', link: '/packages/tenancy/microservice' },
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
        { text: 'Cascade', link: '/packages/soft-delete/cascade' },
        { text: 'Restore & Purge', link: '/packages/soft-delete/restore-purge' },
        { text: 'Decorators', link: '/packages/soft-delete/decorators' },
        { text: 'Events', link: '/packages/soft-delete/events' },
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
        { text: 'Installation', link: '/packages/webhook/installation' },
        { text: 'How It Works', link: '/packages/webhook/how-it-works' },
        { text: 'Sending Events', link: '/packages/webhook/sending-events' },
        { text: 'Endpoint Management', link: '/packages/webhook/endpoint-management' },
        { text: 'Delivery Logs', link: '/packages/webhook/delivery-logs' },
        { text: 'Retry & Circuit Breaker', link: '/packages/webhook/retry-circuit-breaker' },
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
        { text: 'Pepper Rotation', link: '/packages/api-keys/pepper-rotation' },
        { text: 'Errors & Logging', link: '/packages/api-keys/errors-logging' },
        { text: 'Benchmark', link: '/packages/api-keys/benchmark' },
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
  '/guide/': [
    {
      text: 'Guide',
      items: [
        { text: 'Overview', link: '/guide/' },
        { text: 'Adoption Roadmap', link: '/guide/adoption-roadmap' },
        { text: 'Multi-tenant SaaS from Scratch', link: '/guide/multi-tenant-saas' },
        { text: 'Adding Audit Trail', link: '/guide/audit-trail' },
        { text: 'Feature Flags for Gradual Rollout', link: '/guide/feature-flags-rollout' },
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
  description: 'Production-ready NestJS modules for SaaS backends',

  ignoreDeadLinks: [
    /^\/api\//,
    /\.\/README/,
  ],

  sitemap: {
    hostname: 'https://nestarc.dev',
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'nestarc' }],
    ['meta', { property: 'og:description', content: 'Production-ready NestJS modules for SaaS backends' }],
    ['meta', { property: 'og:url', content: 'https://nestarc.dev' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: 'nestarc',
      description: 'Production-ready NestJS modules for SaaS backends — multi-tenancy, audit logs, feature flags, soft-delete, and pagination built on Prisma & PostgreSQL.',
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
      description: 'SaaS 백엔드를 위한 프로덕션급 NestJS 모듈',
      themeConfig: {
        nav: [
          { text: '시작하기', link: '/ko/getting-started' },
          { text: '패키지', items: packagesNav },
          { text: '클라우드', items: [
            { text: 'webhook-platform (베타)', link: 'https://webhook.nestarc.dev' },
          ] },
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
    nav: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Packages', items: packagesNav },
      { text: 'Cloud', items: cloudNav },
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
