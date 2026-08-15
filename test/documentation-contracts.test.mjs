import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import {
  packageCatalog,
} from '../data/package-catalog.mjs'
import {
  packageMatrixEnd,
  packageMatrixStart,
  renderPackageMatrixMarkdown,
} from '../scripts/render-package-matrix.mjs'

const rootDir = path.resolve(import.meta.dirname, '..')
const read = (relativePath) => readFile(path.join(rootDir, relativePath), 'utf8')

test('outbox examples preserve authoritative tenant and broker identities', async () => {
  const installation = await read('packages/outbox/installation.md')

  assert.doesNotMatch(installation, /tenantId:\s*dto\.tenantId/)
  assert.match(installation, /getCurrentTenantOrThrow\(\)/)
  assert.match(installation, /id:\s*record\.id/)
  assert.match(installation, /idempotencyKey:\s*record\.idempotencyKey/)
  assert.match(installation, /'outbox-event-id':\s*record\.id/)
})

test('production webhook and BullMQ examples enforce transport encryption', async () => {
  const asyncGuide = await read('guide/async-delivery-workflow.md')
  const webhookSecurity = await read('packages/webhook/security.md')
  const webhookEndpoints = await read('packages/webhook/endpoint-management.md')
  const jobsDocs = await Promise.all([
    read('packages/jobs/index.md'),
    read('packages/jobs/backends.md'),
    read('packages/jobs/installation.md'),
  ])

  assert.match(asyncGuide, /protocol === 'https:'/)
  assert.match(asyncGuide, /rejects every non-HTTPS URL/)
  assert.match(webhookSecurity, /requireHttpsWebhookUrl/)
  assert.match(webhookEndpoints, /url: requireHttpsWebhookUrl\(dto\.url\)/)
  for (const document of jobsDocs) {
    assert.match(document, /tls:\s*\{/)
    assert.match(document, /rejectUnauthorized:\s*true/)
    assert.match(document, /REDIS_CA_FILE/)
  }
})

test('integration examples include their required providers, schema, and imports', async () => {
  const chaining = await read('guide/prisma-extension-chaining.md')
  const dataSubject = await read('packages/data-subject/index.md')
  const outbox = await read('packages/outbox/installation.md')
  const asyncGuide = await read('guide/async-delivery-workflow.md')
  const jobsBridge = await read('packages/jobs/outbox-bridge.md')

  assert.match(chaining, /provide: 'EventEmitter2', useExisting: EventEmitter2/)
  assert.match(chaining, /enableEvents:\s*true/)
  assert.match(chaining, /providers: \[SoftDeleteAuditListener\]/)
  assert.ok(dataSubject.indexOf('model DataSubjectRequest') < dataSubject.indexOf('new PrismaRequestStorage'))
  assert.match(dataSubject, /npx prisma generate/)
  assert.match(outbox, /constructor\(private readonly emailService: EmailService\)/)
  assert.match(outbox, /providers: \[OrderNotificationListener\]/)
  assert.match(asyncGuide, /import \{ OrderAcceptedOutboxEvent \} from '\.\/order-events'/)
  assert.match(asyncGuide, /import \{ OrderAcceptedWebhookEvent \} from '\.\/order-events'/)
  assert.match(jobsBridge, /import \{ OrderAcceptedOutboxEvent \} from '\.\/order-events'/)
})

test('BullMQ limitations are documented at the status and metadata entry points', async () => {
  const index = await read('packages/jobs/index.md')
  const backends = await read('packages/jobs/backends.md')
  const installation = await read('packages/jobs/installation.md')

  assert.match(index, /queues opened by this producer instance only/)
  assert.match(backends, /restarted or worker-only process/)
  assert.match(installation, /Arbitrary `metadata` is not stored in BullMQ job data/)
})

test('package matrix is static searchable Markdown generated from the catalog', async () => {
  const packagesIndex = await read('packages/index.md')
  const start = packagesIndex.indexOf(packageMatrixStart) + packageMatrixStart.length
  const end = packagesIndex.indexOf(packageMatrixEnd)
  const generated = packagesIndex.slice(start, end).replace(/^\n|\n$/g, '')

  assert.doesNotMatch(packagesIndex, /PackageMatrixSections/)
  assert.ok(start >= packageMatrixStart.length)
  assert.ok(end > start)
  assert.equal(`${generated}\n`, renderPackageMatrixMarkdown())
  assert.match(generated, /^### Foundation$/m)
  assert.match(generated, /Tenant context, PostgreSQL RLS/)
})

test('catalog tables are keyboard focusable and locale switches drop stale anchors', async () => {
  const tableComponents = [
    'AdoptionPathTable.vue',
    'PackageMatrixTable.vue',
    'ToolCatalogTable.vue',
    'AdoptionPackageTable.vue',
    'ApiCatalogTable.vue',
    'RepositoryCatalogTable.vue',
    'PrismaCompatibilityTable.vue',
  ]

  for (const component of tableComponents) {
    assert.match(
      await read(`.vitepress/theme/components/${component}`),
      /<table[\s\S]*?tabindex="0"/,
      `${component} should expose its horizontal scroll region to keyboard users`,
    )
  }

  const langs = await read('.vitepress/theme/composables/langs.ts')
  assert.doesNotMatch(langs, /hash\.value/)
  assert.doesNotMatch(langs, /page, hash/)
})

test('adoption matrix reports package-level setup changes accurately', () => {
  for (const slug of ['safe-response', 'soft-delete', 'audit-log']) {
    const item = packageCatalog.find((candidate) => candidate.slug === slug)
    assert.ok(item, `${slug} should exist in the package catalog`)
    assert.match(item.requiresCodeChanges, /^Yes \(/)
  }
})
