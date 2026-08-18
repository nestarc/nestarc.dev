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
  assert.match(installation, /tenancyTransaction\(this\.prisma\.base, this\.tenancy/)
  assert.match(installation, /provider: OutboxTenantContextProvider/)
  assert.match(installation, /runWithTenant<T>\(tenantId: string/)
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
    assert.match(document, /await backend\.close\(\)/)
    assert.match(document, /enableShutdownHooks\(\)/)
  }

  assert.match(asyncGuide, /ALTER TABLE webhook_endpoints ALTER COLUMN secret TYPE TEXT/)
  assert.match(asyncGuide, /requireWebhookHeader\('webhook-signature', 4096\)/)
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
  assert.match(chaining, /prismaServiceToken: EXTENDED_PRISMA/)
  assert.match(chaining, /useFactory: \(prisma: PrismaService\) => prisma\.client/)
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

test('generated catalog surfaces preserve copy and API subpath navigation', async () => {
  const adoption = await read('.vitepress/theme/components/AdoptionStagePackages.vue')
  const apiTable = await read('.vitepress/theme/components/ApiCatalogTable.vue')
  const config = await read('.vitepress/config.mts')

  assert.match(adoption, /<button[\s\S]*?class="copy"[\s\S]*?:aria-label="[^"]*Copy install command[^"]*"/)
  assert.match(adoption, /@click\.stop="copyInstallCommand"/)
  assert.match(adoption, /await navigator\.clipboard\.writeText\(installCommand\)/)
  assert.match(adoption, /document\.execCommand\('copy'\)/)
  assert.match(apiTable, /`\/api\/\$\{pkg\.slug\}\/modules`/)
  assert.match(config, /sidebar\['\/api\/'\]/)
  assert.match(config, /Public Modules/)
})

test('adoption matrix reports package-level setup changes accurately', () => {
  for (const slug of ['safe-response', 'soft-delete', 'audit-log']) {
    const item = packageCatalog.find((candidate) => candidate.slug === slug)
    assert.ok(item, `${slug} should exist in the package catalog`)
    assert.match(item.requiresCodeChanges, /^Yes \(/)
  }
})

test('P0 SEO articles preserve the current soft-delete and audit-log contracts', async () => {
  const softDelete = await read('blog/prisma-soft-delete-done-right.md')
  const auditLog = await read('blog/nestjs-audit-log-without-refactoring.md')

  assert.match(softDelete, /reviewed: 2026-08-18/)
  assert.match(softDelete, /versionScope: "@nestarc\/soft-delete 0\.6\.x/)
  assert.match(softDelete, /CREATE UNIQUE INDEX users_email_active_unique/)
  assert.match(softDelete, /WHERE "deletedAt" IS NULL/)
  assert.match(softDelete, /prisma\.client\.user\.delete/)
  assert.match(softDelete, /dmmf: prismaDmmf/)
  assert.match(softDelete, /softDelete\.restore\('User', \{ id: \+id \}\)/)
  assert.match(softDelete, /softDelete\.purge\('User', \{\s+olderThan: cutoff/)
  assert.doesNotMatch(softDelete, /@@unique\(\[email, deletedAt\]\)\n}/)
  assert.doesNotMatch(softDelete, /softDeleteService\.softDelete/)

  assert.match(auditLog, /NestJS Audit Log Code Example/)
  assert.match(auditLog, /reviewed: 2026-08-18/)
  assert.match(auditLog, /versionScope: "@nestarc\/audit-log 0\.3\.x/)
  assert.match(auditLog, /applyAuditTableSchema\(prisma\)/)
  assert.match(auditLog, /readonly base = new PrismaClient/)
  assert.match(auditLog, /readonly client = this\.base\.\$extends/)
  assert.match(auditLog, /prisma: prisma\.base/)
  assert.match(auditLog, /prismaModule,/)
  assert.match(auditLog, /actorExtractor: \(req\)/)
  assert.match(auditLog, /this\.prisma\.client\.user\.update/)
  assert.match(auditLog, /base-client mutation is not audited/)
})
