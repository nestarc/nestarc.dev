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
  assert.match(installation, /tenantProvider: OutboxTenantContextProvider/)
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
    assert.doesNotMatch(document, /await backend\.close\(\)/)
    assert.match(document, /(?:automatically[\s\S]{0,120}clos|clos[\s\S]{0,120}automatically)/)
    assert.match(document, /enableShutdownHooks\(\)/)
  }

  assert.match(asyncGuide, /ALTER TABLE webhook_endpoints ALTER COLUMN secret TYPE TEXT/)
  assert.match(asyncGuide, /requireWebhookHeader\('webhook-signature', 4096\)/)
})

test('integration examples include their required providers, schema, and imports', async () => {
  const chaining = await read('guide/prisma-extension-chaining.md')
  const exampleSaas = await read('guide/example-saas-api.md')
  const troubleshooting = await read('guide/troubleshooting.md')
  const dataSubject = await read('packages/data-subject/index.md')
  const outbox = await read('packages/outbox/installation.md')
  const asyncGuide = await read('guide/async-delivery-workflow.md')
  const jobsBridge = await read('packages/jobs/outbox-bridge.md')

  assert.match(chaining, /`@nestarc\/soft-delete` 0\.7\.2/)
  assert.match(chaining, /auditLifecycle:\s*'atomic-required'/)
  assert.match(chaining, /auditMaxBatchRecords:\s*(?:\d+|lifecycleBatchCap)/)
  assert.ok(chaining.indexOf('createPrismaTenancyExtension(') < chaining.indexOf('createAuditExtension({'))
  assert.ok(chaining.indexOf('createAuditExtension({') < chaining.indexOf('createPrismaSoftDeleteExtension({'))
  assert.match(chaining, /createPrismaTenancyExtension\(tenancyService, \{[\s\S]{0,160}interactiveTransactionSupport:\s*true/)
  assert.match(chaining, /failClosed:\s*true/)
  assert.match(chaining, /withAuditTransaction\(\)/)
  assert.match(chaining, /best-effort[\s\S]{0,200}(?:non-atomic|orphan|stale)/i)
  assert.match(chaining, /`tenancyTransaction\(\)` cannot wrap or replace audit-log's separate `withAuditTransaction\(\)` helper/)
  assert.match(chaining, /automatic soft-delete audit[\s\S]{0,100}unavailable[\s\S]{0,120}manual transaction pattern/)
  assert.match(chaining, /Background work must enter an authorized[\s\S]{0,100}`TenancyContext\.run\(\)`/)
  assert.doesNotMatch(chaining, /If your Prisma version is incompatible, extension creation throws immediately/)
  assert.doesNotMatch(chaining, /soft-delete` 0\.6\.0 does not expose/)
  assert.match(chaining, /prismaServiceToken: EXTENDED_PRISMA/)
  assert.match(chaining, /useFactory: \(prisma: PrismaService\) => prisma\.client/)
  assert.match(exampleSaas, /provide: EXTENDED_PRISMA/)
  assert.match(exampleSaas, /useFactory: \(prisma: PrismaService\) => prisma\.client/)
  assert.match(exampleSaas, /Import `PrismaModule` before registering `SoftDeleteModule`/)
  assert.ok(exampleSaas.indexOf('    PrismaModule,') < exampleSaas.indexOf('    SoftDeleteModule.forRoot({'))
  assert.match(troubleshooting, /createPrismaTenancyExtension\(tenancyService, \{[\s\S]{0,160}interactiveTransactionSupport:\s*true/)
  assert.match(troubleshooting, /failClosed:\s*true/)
  assert.ok(dataSubject.indexOf('model DataSubjectRequest') < dataSubject.indexOf('new PrismaRequestStorage'))
  assert.match(dataSubject, /npx prisma generate/)
  assert.match(outbox, /constructor\(private readonly emailService: EmailService\)/)
  assert.match(outbox, /providers: \[OrderNotificationListener\]/)
  assert.match(
    asyncGuide,
    /import \{[^}]*OrderAcceptedOutboxEvent[^}]*OrderAcceptedWebhookEvent[^}]*\} from '\.\/order-events'/,
  )
  assert.match(asyncGuide, /const OrderJobsPublisher = createOutboxJobsPublisher\(\{/)
  assert.match(asyncGuide, /delivery: \{ mode: 'publisher' \}/)
  assert.match(asyncGuide, /import \{[\s\S]*?OutboxWorkerPrismaService[\s\S]*?WebhookPublisherPrismaService[\s\S]*?\} from '\.\/relay-data\.module'/)
  assert.match(jobsBridge, /createOutboxJobsPublisher\(\{/)
  assert.match(jobsBridge, /transport: JobsPublisher/)
  assert.match(jobsBridge, /uses the outbox record ID as both `jobId` and `idempotencyKey`/)
  assert.doesNotMatch(jobsBridge, /Direct package pairing is not included/)
})

test('jobs v0.3 documents restart-safe BullMQ delivery and explicit capability limits', async () => {
  const index = await read('packages/jobs/index.md')
  const backends = await read('packages/jobs/backends.md')
  const installation = await read('packages/jobs/installation.md')
  const testing = await read('packages/jobs/testing.md')
  const outboxBridge = await read('packages/jobs/outbox-bridge.md')
  const tenantFairness = await read('packages/jobs/tenant-fairness.md')
  const changelog = await read('changelog.md')
  const jobsDocs = `${index}\n${backends}\n${installation}`

  assert.doesNotMatch(jobsDocs, /queues opened by (?:this|the) (?:current )?producer instance only/i)
  assert.doesNotMatch(jobsDocs, /Arbitrary `metadata` is not stored in BullMQ job data/)
  assert.doesNotMatch(jobsDocs, /BullMQ failures normalize to `dead_letter`/)

  assert.match(index, /Declared job types are registered[\s\S]*?survive application restarts/)
  assert.match(
    backends,
    /Context, metadata, schedule, idempotency, dedupe, and backoff lineage are stored in a versioned job envelope and restored after restart/,
  )
  assert.match(
    installation,
    /\| `scheduledFor` \| `Date` \| Absolute target time on both backends; takes precedence over relative delay \|/,
  )
  assert.match(
    installation,
    /\| `metadata` \| `Record<string, unknown>` \| Stored with the job and included in lifecycle events on both backends \|/,
  )

  assert.match(backends, /\| Transition history \| Process lifetime \| — \|/)
  assert.match(backends, /\| Handler timeout \| Cooperative via `ctx\.signal` \| — \|/)
  assert.match(backends, /\| DLQ service helpers \| ✓ \| — \|/)
  assert.match(index, /pull\/manual-drain operations, and service-level DLQ helpers remain unavailable/)
  assert.match(index, /unsupported operations on BullMQ fails with `jobs_capability_unsupported`/)
  assert.match(index, /terminal failures have status `failed`/i)

  assert.match(index, /getRawQueue<import\('bullmq'\)\.Queue>\(jobType\)/)
  assert.match(index, /Explicit `jobId` values[\s\S]*?namespace-wide claim[\s\S]*?`jobs_identity_conflict`/)
  assert.match(index, /external producers are rejected with `jobs_backend_closed`/)

  assert.match(backends, /class ReportHandler[\s\S]*?@JobHandler\('sendReport'\)/)
  assert.match(backends, /providers: \[ReportHandler\]/)
  assert.match(backends, /enqueue from[\s\S]{0,100}external producers fails with `jobs_backend_closed`/)

  assert.match(testing, /`fake\.drain\(maxIterations\?\)` — alias of `drainUntilIdle\(\)`/)
  assert.match(testing, /Reaching the iteration cap with schedulable work rejects with `jobs_drain_limit_exceeded`/)
  assert.match(testing, /Future scheduled jobs and delayed retries remain queued/)
  assert.match(outboxBridge, /`PrismaService` is a class reference and must be exported by a `@Global\(\)` module/)
  assert.match(tenantFairness, /A weight of `0` receives no normal weighted-round credits/)
  assert.match(tenantFairness, /eligible for starvation\/minimum-share dispatch/)
  assert.match(outboxBridge, /durable only when `JobsService` uses the BullMQ backend/)
  assert.match(changelog, /BullMQ `\^5\.74\.1`/)
  assert.match(changelog, /`jobs_backend_closed`/)
  assert.match(changelog, /NestJS 10 or 11/)
  assert.match(index, /during Nest application bootstrap/)
  assert.match(index, /`onModuleInit\(\)` hook/)
  assert.match(index, /Request-scoped and transient handlers/)
  assert.match(index, /fail during bootstrap/)
  assert.match(installation, /`TestingModule\.compile\(\)` alone/)
  assert.match(installation, /does not begin job consumption/)
})

test('current releases retain tenancy safeguards and share Prisma 6/7 auth support', async () => {
  const tenancy = await Promise.all([
    read('packages/tenancy/index.md'),
    read('packages/tenancy/installation.md'),
    read('packages/tenancy/cli.md'),
    read('packages/tenancy/microservice.md'),
    read('packages/tenancy/non-http-resources.md'),
    read('packages/tenancy/migration.md'),
  ])
  const tenancyDocs = tenancy.join('\n')
  const apiKeysIndex = await read('packages/api-keys/index.md')
  const apiKeysInstallation = await read('packages/api-keys/installation.md')
  const rbacGuide = await read('guide/rbac-access-control.md')
  const changelog = await read('changelog.md')

  assert.equal(packageCatalog.find(({ slug }) => slug === 'tenancy')?.version, '0.16.0')
  assert.equal(packageCatalog.find(({ slug }) => slug === 'jobs')?.version, '0.4.0')
  assert.equal(packageCatalog.find(({ slug }) => slug === 'api-keys')?.version, '0.4.0')

  assert.match(tenancyDocs, /npx @nestarc\/tenancy doctor/)
  assert.match(tenancyDocs, /missingContext: \{ policy: 'warn' \}/)
  assert.match(tenancyDocs, /TenantResourceKey/)
  assert.match(tenancyDocs, /TenantSearch/)
  assert.match(tenancyDocs, /maxWait: 2_000/)
  assert.match(tenancyDocs, /`interactiveTransactionSupport: true` is deprecated/)
  assert.match(tenancyDocs, /PgBouncer 1\.25\.2 transaction mode/)

  assert.match(apiKeysIndex, /Prisma 5\/6\/7/)
  assert.match(apiKeysInstallation, /\^5\.0\.0 \|\| \^6\.0\.0/)
  assert.doesNotMatch(apiKeysInstallation, /Prisma 7 is not yet in the supported range/)
  assert.match(rbacGuide, /shares NestJS 10\/11 and Prisma 6\/7/)
  assert.doesNotMatch(rbacGuide, /No supported single-process four-package install yet/)

  assert.match(changelog, /### 0\.15\.0[\s\S]*?`tenancy doctor`/)
  assert.match(changelog, /## @nestarc\/api-keys[\s\S]*?### 0\.3\.1/)
  assert.match(changelog, /## @nestarc\/jobs[\s\S]*?### 0\.3\.1/)
})

test('async delivery guide documents the jobs 0.3 migration and shutdown boundaries', async () => {
  const asyncGuide = await read('guide/async-delivery-workflow.md')

  assert.match(asyncGuide, /compatibility covers the package envelope only/)
  assert.match(asyncGuide, /drain the old queue with the 0\.2 handler or deploy a temporary dual-read handler/)
  assert.match(asyncGuide, /context\.outboxEventId \?\? payload\.outboxEventId/)
  assert.match(asyncGuide, /adopted\/deduped v0\.2 BullMQ job[\s\S]*?keeps the attempts and backoff options/)
  assert.match(asyncGuide, /applies to newly created v0\.3 jobs/)
  assert.match(asyncGuide, /@nestjs\/schedule@\^5/)
  assert.match(asyncGuide, /dotted-namespace deployment[\s\S]*?dot-free namespace/)

  assert.match(asyncGuide, /`@nestarc\/jobs` 0\.4 starts backend close in `onModuleDestroy`/)
  assert.match(asyncGuide, /`@nestarc\/outbox` 0\.3 stops polling[\s\S]*?`onApplicationShutdown`/)
  assert.match(asyncGuide, /outbox poll that publishes during that gap can receive `jobs_backend_closed`/)
  assert.match(asyncGuide, /pre-stop phase that gates new outbox work/)
  assert.match(asyncGuide, /0\.3 exposes no dedicated public pause\/drain operation/)
  assert.match(asyncGuide, /`preStop` sleep by itself cannot prove that quiescence/)
  assert.match(asyncGuide, /SIGTERM-only rollout[\s\S]*?retryable, not lossless/)
  assert.match(asyncGuide, /awaits `app\.close\(\)`[\s\S]*?disconnects its two Prisma clients only after all Nest lifecycle phases finish/)
  assert.match(asyncGuide, /publisher falls back to the event ID[\s\S]*?omitted `causationId` remains valid/)
  assert.match(asyncGuide, /Fairness controls fail with `jobs_fairness_misconfig`[\s\S]*?other unavailable BullMQ operations fail with `jobs_capability_unsupported`/)
  assert.match(asyncGuide, /v0\.2 did not persist arbitrary job metadata[\s\S]*?`metadata: undefined`/)
  assert.doesNotMatch(asyncGuide, /from the relay and handler fixtures/)
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

test('pilot email links opt out of Cloudflare address rewriting', async () => {
  const component = await read('.vitepress/theme/components/PilotEmailLink.vue')
  const home = await read('index.md')
  const koreanHome = await read('ko/index.md')

  assert.match(component, /<!--email_off-->/)
  assert.match(component, /<!--\/email_off-->/)
  assert.match(component, /mailto:hello@nestarc\.dev/)
  assert.match(home, /<PilotEmailLink \/>/)
  assert.match(koreanHome, /<PilotEmailLink locale="ko" \/>/)
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

test('audit-log Supported status stays limited to atomic-required tracking', async () => {
  const auditLog = packageCatalog.find((candidate) => candidate.slug === 'audit-log')
  const documents = await Promise.all([
    read('packages/audit-log/index.md'),
    read('packages/audit-log/installation.md'),
    read('packages/audit-log/auto-tracking.md'),
  ])
  const currentDocs = documents.join('\n')

  assert.equal(auditLog?.version, '0.5.0')
  assert.equal(auditLog?.supportStatus, 'Supported')
  assert.match(`${auditLog?.homeSummary.en} ${auditLog?.solves}`, /atomic-required/)
  for (const document of documents) {
    assert.match(document, /Supported[\s\S]{0,160}(?:atomic-required|automatic tracking|transaction-first)/i)
    assert.match(document, /withAuditTransaction\(\)/)
    assert.match(document, /best-effort[\s\S]{0,160}(?:orphan|stale)/i)
  }
  assert.match(currentDocs, /Node\.js[\s\S]{0,80}22\.13\+[\s\S]{0,80}24/)
  assert.match(currentDocs, /NestJS[\s\S]{0,80}10[\s\S]{0,80}11[\s\S]{0,80}12\.0\.1\+/)
  assert.match(currentDocs, /combined[\s\S]{0,120}peer range is 10\/11[\s\S]{0,120}12\.0\.1\+/i)
  assert.match(currentDocs, /Prisma 7[\s\S]{0,80}Prisma 5\/6/)
  assert.match(documents[2], /createPrismaTenancyExtension\(tenancyService, \{[\s\S]{0,160}interactiveTransactionSupport:\s*true/)
  assert.match(documents[2], /failClosed:\s*true/)
  assert.doesNotMatch(documents[1], /\|\s*`experimentalTxAudit`\s*\|/)
  assert.match(documents[1], /experimentalTxAudit[\s\S]{0,160}(?:removed|fail(?:s|ed)? fast)/i)
})

test('coordinated audit-log and soft-delete releases stay aligned', async () => {
  const softDelete = packageCatalog.find((candidate) => candidate.slug === 'soft-delete')
  const changelog = await read('changelog.md')
  const introduction = await read('blog/hello-nestarc.md')
  const installation = await read('packages/soft-delete/installation.md')
  const cascade = await read('packages/soft-delete/cascade.md')
  const restorePurge = await read('packages/soft-delete/restore-purge.md')
  const auditRelease = changelog.match(/## @nestarc\/audit-log[\s\S]*?### 0\.5\.0([\s\S]*?)### 0\.4\.1/)?.[1]
  const softRelease = changelog.match(/## @nestarc\/soft-delete[\s\S]*?### 0\.7\.0([\s\S]*?)### 0\.6\.0/)?.[1]

  assert.equal(softDelete?.version, '0.7.2')
  assert.equal(softDelete?.supportStatus, 'Supported')
  assert.match(softDelete?.dependsOn ?? '', /audit-log/)
  assert.match(softDelete?.dependsOn ?? '', /tenancy/)
  assert.match(softDelete?.dependsOn ?? '', /@nestjs\/event-emitter/)

  assert.match(changelog, /## @nestarc\/audit-log[\s\S]*?### 0\.5\.0[\s\S]*?### 0\.4\.1[\s\S]*?### 0\.4\.0/)
  assert.ok(auditRelease)
  assert.match(auditRelease, /Node\.js 22\.13\+/)
  assert.match(auditRelease, /NestJS 12\.0\.1\+/)
  assert.match(auditRelease, /experimentalTxAudit/)
  assert.match(auditRelease, /rejected thenables/)
  assert.match(changelog, /## @nestarc\/soft-delete[\s\S]*?### 0\.7\.2[\s\S]*?### 0\.7\.0[\s\S]*?### 0\.6\.0/)
  assert.match(changelog, /0\.7\.1[\s\S]{0,220}\^0\.4\.1 \|\| \^0\.5\.0/)
  assert.ok(softRelease)
  assert.match(softRelease, /tenancy → audit-log → soft-delete/)
  assert.match(softRelease, /auditMaxBatchRecords/)
  assert.match(changelog, /at the time of this release[\s\S]{0,180}soft-delete` 0\.6\.0/i)

  assert.match(introduction, /reviewed: 2026-09-05/)
  assert.match(introduction, /`@nestarc\/audit-log` \| 0\.5\.0/)
  assert.match(introduction, /`@nestarc\/soft-delete` \| 0\.7\.2/)

  assert.match(installation, /User: \{ tableName: 'User' \}/)
  assert.match(installation, /Post: \{ tableName: 'Post' \}/)
  assert.doesNotMatch(installation, /User: \{ tableName: 'users' \}/)
  assert.match(installation, /useFactory: \(prisma: PrismaService\) => prisma\.client/)
  assert.match(installation, /withAuditTransaction\(\(tx\) =>[\s\S]{0,120}tx\.user\.delete/)
  assert.match(installation, /withAuditTransaction\(\(\) =>[\s\S]{0,120}this\.softDelete\.restore/)
  assert.match(cascade, /interactiveTransactionSupport:\s*true/)
  assert.match(cascade, /failClosed:\s*true/)
  assert.match(restorePurge, /this\.tenancyContext\.run\(tenantId/)
  assert.match(restorePurge, /private readonly tenancyContext = new TenancyContext\(\)/)
  assert.doesNotMatch(restorePurge, /private readonly tenancyContext: TenancyContext/)
  assert.match(restorePurge, /this\.tenantDirectory\.listActiveTenantIds\(\)/)
})

test('audit-log exports and retention preserve durable checkpoint safety', async () => {
  const streamingExport = await read('packages/audit-log/streaming-export.md')
  const durableStreams = await read('packages/audit-log/durable-streams.md')
  const retention = await read('packages/audit-log/retention.md')

  assert.match(streamingExport, /AuditService\.scan\(\)[\s\S]{0,180}oldest-first[\s\S]{0,180}high-watermark/i)
  assert.match(streamingExport, /Persist the high-watermark before the first external delivery/)
  assert.match(streamingExport, /Advance the checkpoint only after[\s\S]{0,80}acknowledged/)
  assert.match(streamingExport, /Exactly one export scope is required:[^\n]*`tenantId`[^\n]*`allTenants: true`/)

  assert.match(durableStreams, /AuditStreamRunner[\s\S]{0,180}at-least-once semantics/)
  assert.match(durableStreams, /does\s+not launch a\s+background scheduler or elect a worker/)
  assert.match(durableStreams, /Keep `scan` configuration[\s\S]{0,180}immutable for a `streamId`/)
  assert.match(durableStreams, /sink interface does not receive that\s+signal/)
  assert.match(durableStreams, /checkpoint only after a sink ACK or idempotent terminal DLQ write/)
  assert.match(durableStreams, /At-least-once, not exactly-once/)

  assert.match(retention, /requiredCheckpoints/)
  assert.match(retention, /rejects the call[\s\S]{0,160}`olderThan`[\s\S]{0,160}checkpoint timestamp/)
  assert.match(retention, /required stream with no checkpoint a hard block/)
})

test('P0 SEO articles preserve the current soft-delete and audit-log contracts', async () => {
  const softDelete = await read('blog/prisma-soft-delete-done-right.md')
  const auditLog = await read('blog/nestjs-audit-log-without-refactoring.md')

  assert.match(softDelete, /reviewed: 2026-09-05/)
  assert.match(softDelete, /versionScope: "@nestarc\/soft-delete 0\.7\.x/)
  assert.match(softDelete, /CREATE UNIQUE INDEX users_email_active_unique/)
  assert.match(softDelete, /WHERE "deletedAt" IS NULL/)
  assert.match(softDelete, /prisma\.client\.user\.delete/)
  assert.match(softDelete, /dmmf: prismaDmmf/)
  assert.match(softDelete, /softDelete\.restore\('User', \{ id: \+id \}\)/)
  assert.match(softDelete, /softDelete\.purge\('User', \{\s+olderThan: cutoff/)
  assert.match(softDelete, /User: \{ tableName: 'User' \}/)
  assert.match(softDelete, /useFactory: \(prisma: PrismaService\) => prisma\.client/)
  assert.match(softDelete, /createPrismaTenancyExtension\(tenancyService, \{[\s\S]{0,160}interactiveTransactionSupport:\s*true/)
  assert.doesNotMatch(softDelete, /@@unique\(\[email, deletedAt\]\)\n}/)
  assert.doesNotMatch(softDelete, /softDeleteService\.softDelete/)

  assert.match(auditLog, /NestJS Audit Log Code Example/)
  assert.match(auditLog, /reviewed: 2026-09-05/)
  assert.match(auditLog, /versionScope: "@nestarc\/audit-log 0\.5\.x/)
  assert.match(auditLog, /applyAuditTableSchema\(prisma\)/)
  assert.match(auditLog, /readonly base = new PrismaClient/)
  assert.match(auditLog, /import \{ createAuditedClient \} from '@nestarc\/audit-log'/)
  assert.match(auditLog, /readonly client = createAuditedClient\(this\.base, \{/)
  assert.match(auditLog, /consistency:\s*'atomic-required'/)
  assert.match(auditLog, /`consistency` (?:is|remains) required(?: in 0\.5| since 0\.4)/)
  assert.match(auditLog, /prisma: prisma\.base/)
  assert.match(auditLog, /prismaModule,/)
  assert.match(auditLog, /actorExtractor: \(req\)/)
  assert.match(auditLog, /this\.prisma\.client\.withAuditTransaction\(\(tx\) =>[\s\S]{0,160}tx\.user\.update/)
  assert.match(auditLog, /base-client mutation is not audited/)
})

test('SEO articles preserve current package contracts and measured claims', async () => {
  const featureFlag = await read('blog/nestjs-feature-flags-without-external-services.md')
  const overrides = await read('packages/feature-flag/tenant-overrides.md')
  const rollout = await read('packages/feature-flag/rollout.md')
  const pagination = await read('blog/cursor-vs-offset-pagination-prisma.md')
  const idempotency = await read('blog/nestjs-idempotency-implementation-broken.md')
  const tenancy = await read('blog/nestjs-multi-tenancy-pitfalls.md')
  const safeResponse = await read('blog/nestjs-api-response-format-you-wont-regret.md')

  assert.match(featureFlag, /Prisma 7"/)
  assert.match(featureFlag, /attributes\s+JSONB NOT NULL/)
  assert.match(featureFlag, /four layers/)
  assert.match(featureFlag, /1\.17ms/)
  assert.match(featureFlag, /29\.2x speedup/)
  assert.doesNotMatch(featureFlag, /Prisma 5\/6\/7|6-layer|1\.30ms|32x speedup/)

  assert.match(overrides, /attributes: \{ tenantId: 'tenant-1' \}/)
  assert.match(overrides, /priority: 10/)
  assert.doesNotMatch(overrides, /setOverride\('MY_FLAG', \{\s+tenantId:/)
  assert.match(rollout, /four-layer cascade/)
  assert.match(rollout, /Best override whose attributes all match/)
  assert.doesNotMatch(rollout, /6-layer cascade/)

  assert.match(pagination, /Offset — page 100 \| 2\.61ms/)
  assert.match(pagination, /Cursor — deep page \(sort by id\) \| \*\*0\.58ms\*\*/)
  assert.match(pagination, /about 78% faster than deep offset/)
  assert.doesNotMatch(pagination, /Offset shows no degradation|0\.98ms|17\.56ms/)

  assert.match(idempotency, /not an exactly-once guarantee/)
  assert.match(idempotency, /handler takes 90 seconds/)
  assert.doesNotMatch(idempotency, /Runs at most once/)

  assert.match(tenancy, /createPrismaTenancyExtension\(tenancyService\)/)
  assert.match(tenancy, /default validator accepts UUID tenant IDs/)
  assert.match(tenancy, /tenancyContext\.run/)
  assert.match(tenancy, /provides `withTenant\(\)`/)
  assert.doesNotMatch(tenancy, /runWithTenant|provides `setTenant\(\)`/)

  assert.match(safeResponse, /requestId: true/)
  assert.match(safeResponse, /meta: \{ pagination: \{ page, totalPages/)
  assert.match(safeResponse, /defaults are disabled/)
})

test('SEO metadata remains route-reactive and excludes generated changelogs', async () => {
  const config = await read('.vitepress/config.mts')
  const metadata = await read('.vitepress/seo-metadata.mjs')

  assert.match(config, /api\/\*\*\/CHANGELOG\.md/)
  assert.match(config, /docs\/seo-reports\/\*\*/)
  assert.match(config, /frontmatter:[\s\S]*head:[\s\S]*headForPage\(resolvedPageData\)/)
  assert.match(config, /transformHead\(\{ pageData \}\)[\s\S]*pageData\.isNotFound/)
  assert.match(metadata, /pageData\.isNotFound/)
  assert.match(metadata, /noindex, nofollow/)
  assert.match(metadata, /mainEntityOfPage/)
  assert.match(metadata, /og:image/)
  assert.match(metadata, /sameAs/)
  assert.match(config, /<h\[1-2\]/)
  assert.doesNotMatch(config, /<h\[1-6\]/)
  assert.match(config, /editorialLastUpdatedForPage/)
  assert.match(config, /editorialLastmod\.get\(itemPath\) \?\? item\.lastmod/)
})

test('September upgrades document breaking migrations and new admission boundaries', async () => {
  const [outbox, outboxFlow, jobs, keys, rbac, english, korean] = await Promise.all([
    read('packages/outbox/installation.md'),
    read('packages/outbox/how-it-works.md'),
    read('packages/jobs/backends.md'),
    read('packages/api-keys/installation.md'),
    read('packages/rbac/guards-permissions.md'),
    read('getting-started.md'),
    read('ko/getting-started.md'),
  ])
  assert.match(outbox, /upgrade-to-current\.sql/)
  assert.match(outbox, /Old\/new pollers must not overlap/)
  assert.match(outbox, /tenantProvider: OutboxTenantContextProvider/)
  assert.doesNotMatch(outbox, /tenancy: \{ provider:/)
  assert.match(outbox, /page\.records/)
  assert.match(outbox, /result\.outcome/)
  assert.match(outboxFlow, /no global, aggregate, partition, or batch FIFO guarantee/)
  assert.match(jobs, /role: 'producer'/)
  assert.match(jobs, /role: 'worker'/)
  assert.match(jobs, /poolSize: 1/)
  assert.match(jobs, /JobsShutdownError/)
  assert.match(jobs, /pruneTerminal\(\{ producersStopped: true \}\)/)
  assert.match(keys, /TypeScript to 5\.3\+/)
  assert.match(keys, /'rotated'` or `'not_rotatable'/)
  assert.match(keys, /ApiKeySummary\[\]/)
  assert.match(rbac, /request\.apiKey` is canonical/)
  assert.match(rbac, /HTTP-only/)
  for (const document of [english, korean]) {
    assert.match(document, /\^22\.13\.0/)
    assert.match(document, /AS RESTRICTIVE/)
    assert.match(document, /NULLIF\(current_setting\('app\.current_tenant', true\), ''\) IS NOT NULL/)
  }
})
