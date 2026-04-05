import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'nestarc',
  description: 'Production-ready NestJS modules for SaaS backends',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'nestarc' }],
    ['meta', { property: 'og:description', content: 'Production-ready NestJS modules for SaaS backends' }],
    ['meta', { property: 'og:url', content: 'https://nestarc.dev' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Getting Started', link: '/getting-started' },
      {
        text: 'Packages',
        items: [
          { text: 'tenancy', link: '/packages/tenancy/' },
          { text: 'safe-response', link: '/packages/safe-response/' },
          { text: 'audit-log', link: '/packages/audit-log/' },
          { text: 'feature-flag', link: '/packages/feature-flag/' },
          { text: 'soft-delete', link: '/packages/soft-delete/' },
          { text: 'pagination', link: '/packages/pagination/' },
        ],
      },
      { text: 'Guide', link: '/guide/' },
    ],

    sidebar: {
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
          ],
        },
      ],
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Overview', link: '/guide/' },
            { text: 'Multi-tenant SaaS from Scratch', link: '/guide/multi-tenant-saas' },
            { text: 'Adding Audit Trail', link: '/guide/audit-trail' },
            { text: 'Feature Flags for Gradual Rollout', link: '/guide/feature-flags-rollout' },
            { text: 'Prisma Extension Chaining', link: '/guide/prisma-extension-chaining' },
          ],
        },
      ],
    },

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
