import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import {
  extractAttributes,
  extractSrcsetUrls,
  outputPathForUrl,
  robotsDisallowsPath,
  validateSitemapLocation,
  wildcardRobotsDisallowRules,
} from '../scripts/validate-site.mjs'
import {
  canonicalPathForPage,
  metadataForPage,
  structuredDataForPage,
} from '../.vitepress/seo-metadata.mjs'

const rootDir = path.resolve(import.meta.dirname, '..')

test('extracts rendered asset attributes and srcset candidates', () => {
  const html = '<img src="/hero.png" srcset="/hero.png 1x, /hero@2x.png 2x"><video poster="/poster.jpg"></video>'
  assert.deepEqual(extractAttributes(html, 'src'), ['/hero.png'])
  assert.deepEqual(extractAttributes(html, 'poster'), ['/poster.jpg'])
  assert.deepEqual(extractSrcsetUrls(extractAttributes(html, 'srcset')[0]), [
    '/hero.png',
    '/hero@2x.png',
  ])
})

test('uses page-appropriate structured data for home, articles, docs, and API references', () => {
  const page = (relativePath, frontmatter = {}) => ({
    relativePath,
    title: 'Example',
    description: 'Example description',
    frontmatter,
  })

  assert.equal(structuredDataForPage(page('index.md'))['@type'], 'WebSite')
  assert.equal(structuredDataForPage(page('guide/example.md'))['@type'], 'TechArticle')
  assert.equal(structuredDataForPage(page('api/webhook/index.md'))['@type'], 'APIReference')

  const article = structuredDataForPage(page('blog/example.md', {
    date: '2026-04-06',
    reviewed: '2026-08-18',
    versionScope: 'NestJS 10/11',
  }))
  assert.equal(article['@type'], 'BlogPosting')
  assert.equal(article.datePublished, '2026-04-06')
  assert.equal(article.dateModified, '2026-08-18')
  assert.equal(article.about, 'NestJS 10/11')
})

test('rejects decoded output paths that escape the build directory', () => {
  assert.equal(outputPathForUrl('/tmp/site-dist', '/assets/app.js'), '/tmp/site-dist/assets/app.js')
  assert.equal(outputPathForUrl('/tmp/site-dist', '/%2e%2e%2fconfig.mts'), null)
})

test('validates sitemap origin and forbids query or fragment suffixes', () => {
  assert.equal(
    validateSitemapLocation('https://nestarc.dev/packages/'),
    '/packages/',
  )
  assert.throws(
    () => validateSitemapLocation('https://wrong.example/packages/'),
    /unexpected origin/,
  )
  assert.throws(
    () => validateSitemapLocation('https://nestarc.dev/packages/?preview=1'),
    /query strings and fragments/,
  )
})

test('detects wildcard robots rules that cover the public API', () => {
  assert.equal(robotsDisallowsPath('User-agent: *\nDisallow: /', '/api/'), true)
  assert.equal(robotsDisallowsPath('User-agent: *\nDisallow: /api*', '/api/'), true)
  assert.equal(robotsDisallowsPath('User-agent: *\nDisallow: /private', '/api/'), false)
  assert.deepEqual(
    wildcardRobotsDisallowRules('User-agent: BadBot\nDisallow: /\nUser-agent: *\nAllow: /'),
    [],
  )
})

test('derives extensionless canonical paths while preserving directory URLs', () => {
  assert.equal(canonicalPathForPage('index.md'), '/')
  assert.equal(canonicalPathForPage('packages/webhook/index.md'), '/packages/webhook/')
  assert.equal(canonicalPathForPage('packages/rbac/migration-0.2.md'), '/packages/rbac/migration-0.2')
})

test('separates package landing, guide, and generated API search intent', () => {
  const catalog = [{
    slug: 'webhook',
    solves: 'Outbound delivery, signing, retries, and operations.',
  }]
  const packageLanding = metadataForPage({
    relativePath: 'packages/webhook/index.md',
    title: '@nestarc/webhook',
    description: 'Outbound webhook delivery for NestJS.',
  }, catalog)
  assert.equal(packageLanding.title, 'NestJS Outbound Webhooks with @nestarc/webhook')
  assert.equal(packageLanding.canonicalUrl, 'https://nestarc.dev/packages/webhook/')

  const packageGuide = metadataForPage({
    relativePath: 'packages/webhook/installation.md',
    title: 'Installation',
    description: 'Install the package.',
  }, catalog)
  assert.equal(packageGuide.title, 'Installation - @nestarc/webhook')

  const apiPage = metadataForPage({
    relativePath: 'api/webhook/index.md',
    title: '@nestarc/webhook',
    description: '',
  }, catalog)
  assert.equal(apiPage.title, 'API Reference - @nestarc/webhook')
  assert.match(apiPage.description, /API reference for @nestarc\/webhook/)
})

test('legacy crawler URLs permanently redirect to published canonical pages', async () => {
  const redirects = await readFile(path.join(rootDir, 'public/_redirects'), 'utf8')
  const rules = redirects
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/\s+/))

  assert.equal(rules.length, 68)

  const observedEnglishDuplicates = new Set([
    '/blog/cursor-vs-offset-pagination-prisma.html',
    '/blog/nestjs-audit-log-without-refactoring.html',
    '/blog/nestjs-idempotency-implementation-broken.html',
  ])

  const sources = new Set()
  for (const [source, destination, status, ...extra] of rules) {
    assert.equal(extra.length, 0, `${source}: redirect rule has unexpected fields`)
    assert.equal(status, '301', `${source}: redirect must be permanent`)
    assert.equal(
      source.startsWith('/ko/') || observedEnglishDuplicates.has(source),
      true,
      `${source}: redirect source is not an approved legacy URL`,
    )
    assert.doesNotMatch(destination, /^\/ko\//)
    assert.doesNotMatch(destination, /\.html$/)
    assert.equal(sources.has(source), false, `${source}: duplicate redirect source`)
    sources.add(source)

    const destinationMarkdown = destination.endsWith('/')
      ? path.join(rootDir, destination, 'index.md')
      : path.join(rootDir, `${destination}.md`)
    assert.equal(
      existsSync(destinationMarkdown),
      true,
      `${source}: missing redirect destination ${destination}`,
    )

    if (source.startsWith('/ko/')) {
      const sourceMarkdown = source.endsWith('/')
        ? path.join(rootDir, source, 'index.md')
        : path.join(rootDir, source.replace(/\.html$/, '.md'))
      assert.equal(
        existsSync(sourceMarkdown),
        false,
        `${source}: redirect would override a translated page`,
      )
    }
  }

  assert.deepEqual(
    new Set([...sources].filter((source) => source.startsWith('/blog/'))),
    observedEnglishDuplicates,
  )
})
