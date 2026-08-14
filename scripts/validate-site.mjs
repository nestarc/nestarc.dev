import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { packageCatalog, toolCatalog } from '../data/package-catalog.mjs'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(rootDir, '.vitepress', 'dist')
const siteOrigin = 'https://nestarc.dev'

const forbiddenPublicRoutes = [
  {
    pattern: /^\/docs\/superpowers(?:\/|$)/,
    reason: 'internal implementation plans must not be published',
  },
  {
    pattern: /^\/api\/[^/]+\/(?:README|LICENSE)(?:\.html)?$/i,
    reason: 'generated package README and license files are support inputs, not public reference pages',
  },
  {
    pattern: /^\/api\/[^/]+\/_media(?:\/|$)/,
    reason: 'generated API media sources must not be published as standalone pages',
  },
]

const failures = []

function fail(message) {
  failures.push(message)
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replace(/&#(\d+);/g, (_, codePoint) => String.fromCodePoint(Number(codePoint)))
    .replace(/&#x([\da-f]+);/gi, (_, codePoint) => String.fromCodePoint(Number.parseInt(codePoint, 16)))
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

async function walkFiles(directory) {
  const files = []
  const entries = await readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...await walkFiles(absolute))
    } else if (entry.isFile()) {
      files.push(absolute)
    }
  }

  return files
}

function routeForHtml(relativeFile) {
  const posixFile = relativeFile.split(path.sep).join('/')
  if (posixFile === 'index.html') return '/'
  if (posixFile.endsWith('/index.html')) {
    return `/${posixFile.slice(0, -'index.html'.length)}`
  }
  return `/${posixFile}`
}

function routeCandidates(pathname) {
  const decoded = safeDecode(pathname)
  const candidates = new Set([decoded])

  if (decoded.endsWith('/')) {
    candidates.add(`${decoded}index.html`)
  } else if (!path.posix.extname(decoded)) {
    candidates.add(`${decoded}.html`)
    candidates.add(`${decoded}/index.html`)
  }

  return [...candidates]
}

function extractAttributes(html, attribute) {
  const values = []
  const expression = new RegExp(`(?:^|\\s)${attribute}\\s*=\\s*(["'])(.*?)\\1`, 'gis')
  for (const match of html.matchAll(expression)) {
    values.push(decodeHtml(match[2]))
  }
  return values
}

function normalizeVisibleText(value) {
  return decodeHtml(value
    .replace(/<!--.*?-->/gs, '')
    .replace(/<script\b[^>]*>.*?<\/script>/gis, ' ')
    .replace(/<style\b[^>]*>.*?<\/style>/gis, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

function extractElementHtml(html, openingMatch) {
  const [openingTag, tagName] = openingMatch
  const tagExpression = new RegExp(`<\\/?${tagName}\\b[^>]*>`, 'gis')
  tagExpression.lastIndex = openingMatch.index + openingTag.length
  let depth = 1

  for (let match = tagExpression.exec(html); match; match = tagExpression.exec(html)) {
    if (/^<\//.test(match[0])) {
      depth -= 1
    } else if (!/\/>$/.test(match[0])) {
      depth += 1
    }

    if (depth === 0) {
      return html.slice(openingMatch.index, tagExpression.lastIndex)
    }
  }

  return null
}

function extractParagraphTexts(html) {
  const texts = []
  for (const match of html.matchAll(/<p\b[^>]*>(.*?)<\/p>/gis)) {
    texts.push(normalizeVisibleText(match[1]))
  }
  return texts
}

function extractIds(html) {
  return new Set([
    ...extractAttributes(html, 'id'),
    ...extractAttributes(html, 'name'),
  ].map(safeDecode))
}

function extractCatalogEntries(html, kind, surface) {
  const entries = []
  const attribute = `data-catalog-${kind}`
  const expression = new RegExp(
    `<([a-z][\\w:-]*)\\b(?=[^>]*\\b${attribute}\\s*=)[^>]*>`,
    'gis',
  )

  for (const match of html.matchAll(expression)) {
    const openingTag = match[0]
    const tagSurface = extractAttributes(openingTag, 'data-catalog-surface')[0]
    if (tagSurface !== surface) continue

    const elementHtml = extractElementHtml(html, match)

    entries.push({
      slug: extractAttributes(openingTag, attribute)[0],
      version: extractAttributes(openingTag, 'data-version')[0],
      status: extractAttributes(openingTag, 'data-status')[0],
      html: elementHtml,
      hrefs: elementHtml ? extractAttributes(elementHtml, 'href') : [],
      paragraphTexts: elementHtml ? extractParagraphTexts(elementHtml) : [],
      visibleText: elementHtml ? normalizeVisibleText(elementHtml) : '',
    })
  }

  return entries
}

function pageForPath(routeToPage, pathname) {
  for (const candidate of routeCandidates(pathname)) {
    const route = candidate.endsWith('/index.html')
      ? routeForHtml(candidate.slice(1))
      : candidate
    const page = routeToPage.get(route)
    if (page) return page
  }
  return null
}

function validateCatalogSurface({
  routeToPage,
  pathname,
  surface,
  kind,
  items,
  statusField,
  expectedHrefs,
  expectedVisibleText,
  summaryLocale,
}) {
  const page = pageForPath(routeToPage, pathname)
  if (!page) {
    fail(`${pathname}: missing page required for catalog surface ${surface}`)
    return
  }

  const entries = extractCatalogEntries(page.html, kind, surface)
  const actualOrder = entries.map(({ slug }) => slug)
  const expectedOrder = items.map(({ slug }) => slug)
  if (actualOrder.join('\n') !== expectedOrder.join('\n')) {
    fail(
      `${pathname}: ${surface} order is [${actualOrder.join(', ')}], expected [${expectedOrder.join(', ')}]`,
    )
    return
  }

  for (const [index, item] of items.entries()) {
    const entry = entries[index]
    if (!entry.html) {
      fail(`${pathname}: ${surface} ${item.slug} has no matching closing element in SSR output`)
      continue
    }
    if (entry.version !== item.version) {
      fail(
        `${pathname}: ${surface} ${item.slug} renders version ${entry.version ?? '(missing)'}, expected ${item.version}`,
      )
    }
    if (entry.status !== item[statusField]) {
      fail(
        `${pathname}: ${surface} ${item.slug} renders status ${entry.status ?? '(missing)'}, expected ${item[statusField]}`,
      )
    }

    if (expectedHrefs) {
      const actual = [...new Set(entry.hrefs)].sort()
      const expected = [...new Set(expectedHrefs(item))].sort()
      if (actual.join('\n') !== expected.join('\n')) {
        fail(
          `${pathname}: ${surface} ${item.slug} renders hrefs [${actual.join(', ')}], expected [${expected.join(', ')}]`,
        )
      }
    }

    if (expectedVisibleText) {
      const expected = normalizeVisibleText(expectedVisibleText(item))
      if (entry.visibleText !== expected) {
        fail(
          `${pathname}: ${surface} ${item.slug} renders visible text ${JSON.stringify(entry.visibleText)}, expected ${JSON.stringify(expected)}`,
        )
      }
    }

    if (summaryLocale) {
      const expectedSummary = normalizeVisibleText(item.homeSummary[summaryLocale])
      const rendersSummary = entry.paragraphTexts.some((paragraph) =>
        paragraph === expectedSummary || paragraph.startsWith(`${expectedSummary} `))
      if (!rendersSummary) {
        fail(
          `${pathname}: ${surface} ${item.slug} does not render the ${summaryLocale.toUpperCase()} catalog summary as visible paragraph text`,
        )
      }
    }
  }
}

function forbiddenReason(route) {
  return forbiddenPublicRoutes.find(({ pattern }) => pattern.test(route))?.reason
}

async function fileExists(absolutePath) {
  try {
    return (await stat(absolutePath)).isFile()
  } catch {
    return false
  }
}

async function main() {
  if (!await fileExists(path.join(distDir, 'index.html'))) {
    throw new Error('VitePress output is missing. Run `npm run docs:build` first.')
  }

  const allFiles = await walkFiles(distDir)
  const htmlFiles = allFiles.filter((file) => file.endsWith('.html')).sort()
  const routeToPage = new Map()

  for (const file of htmlFiles) {
    const relative = path.relative(distDir, file)
    const route = routeForHtml(relative)
    const html = await readFile(file, 'utf8')
    routeToPage.set(route, { file, html, ids: extractIds(html) })

    const reason = forbiddenReason(route)
    if (reason) fail(`${route}: ${reason}`)
  }

  const adoptionOrder = [...packageCatalog].sort((left, right) =>
    left.adoptionStage - right.adoptionStage
      || packageCatalog.indexOf(left) - packageCatalog.indexOf(right))
  const packageGuideHref = ({ slug }) => [`/packages/${slug}/`]
  const packageApiHrefs = ({ slug, repository }) => [
    `/api/${slug}/`,
    `/packages/${slug}/`,
    `https://github.com/nestarc/${repository}`,
  ]
  const packageRepositoryHref = ({ repository }) => [
    `https://github.com/nestarc/${repository}`,
  ]
  const toolDocsHref = ({ slug }) => [`/tools/${slug}/`]
  const toolApiHrefs = ({ slug, repository }) => [
    `/tools/${slug}/`,
    `https://github.com/nestarc/${repository}`,
  ]
  const toolRepositoryHref = ({ repository }) => [
    `https://github.com/nestarc/${repository}`,
  ]
  const packagesForSlugs = (slugs) => slugs.map((slug) => {
    const item = packageCatalog.find((pkg) => pkg.slug === slug)
    if (!item) throw new Error(`Unknown package catalog slug in site contract: ${slug}`)
    return item
  })
  const prismaPackages = packagesForSlugs([
    'tenancy',
    'soft-delete',
    'audit-log',
    'feature-flag',
    'pagination',
  ])
  const catalogSurfaces = [
    {
      pathname: '/',
      surface: 'home-packages',
      kind: 'package',
      items: packageCatalog,
      statusField: 'supportStatus',
      expectedHrefs: packageGuideHref,
      summaryLocale: 'en',
    },
    {
      pathname: '/ko/',
      surface: 'home-packages',
      kind: 'package',
      items: packageCatalog,
      statusField: 'supportStatus',
      expectedHrefs: packageGuideHref,
      summaryLocale: 'ko',
    },
    {
      pathname: '/packages/',
      surface: 'adoption-table',
      kind: 'package',
      items: adoptionOrder,
      statusField: 'supportStatus',
      expectedHrefs: packageGuideHref,
    },
    {
      pathname: '/packages/',
      surface: 'package-matrix',
      kind: 'package',
      items: packageCatalog,
      statusField: 'supportStatus',
      expectedHrefs: packageGuideHref,
    },
    {
      pathname: '/api/',
      surface: 'api-table',
      kind: 'package',
      items: packageCatalog,
      statusField: 'apiStatus',
      expectedHrefs: packageApiHrefs,
    },
    {
      pathname: '/community/',
      surface: 'repository-table',
      kind: 'package',
      items: packageCatalog,
      statusField: 'supportStatus',
      expectedHrefs: packageRepositoryHref,
    },
    {
      pathname: '/guide/adoption-roadmap',
      surface: 'adoption-table',
      kind: 'package',
      items: adoptionOrder,
      statusField: 'supportStatus',
      expectedHrefs: packageGuideHref,
    },
    {
      pathname: '/guide/adoption-roadmap',
      surface: 'adoption-stage-packages',
      kind: 'package',
      items: adoptionOrder,
      statusField: 'supportStatus',
      expectedHrefs: packageGuideHref,
    },
    {
      pathname: '/guide/adoption-roadmap',
      surface: 'adoption-package-table',
      kind: 'package',
      items: adoptionOrder,
      statusField: 'supportStatus',
    },
    {
      pathname: '/guide/prisma-7',
      surface: 'prisma-compatibility',
      kind: 'package',
      items: prismaPackages,
      statusField: 'supportStatus',
      expectedHrefs: packageGuideHref,
    },
    {
      pathname: '/',
      surface: 'home-tools',
      kind: 'tool',
      items: toolCatalog,
      statusField: 'supportStatus',
      expectedHrefs: () => ['/tools/'],
      summaryLocale: 'en',
    },
    {
      pathname: '/ko/',
      surface: 'home-tools',
      kind: 'tool',
      items: toolCatalog,
      statusField: 'supportStatus',
      expectedHrefs: () => ['/tools/'],
      summaryLocale: 'ko',
    },
    {
      pathname: '/packages/',
      surface: 'tool-table',
      kind: 'tool',
      items: toolCatalog,
      statusField: 'supportStatus',
      expectedHrefs: toolDocsHref,
    },
    {
      pathname: '/api/',
      surface: 'tool-table',
      kind: 'tool',
      items: toolCatalog,
      statusField: 'supportStatus',
      expectedHrefs: toolApiHrefs,
    },
    {
      pathname: '/tools/',
      surface: 'tool-table',
      kind: 'tool',
      items: toolCatalog,
      statusField: 'supportStatus',
      expectedHrefs: toolDocsHref,
    },
    {
      pathname: '/community/',
      surface: 'repository-tool-table',
      kind: 'tool',
      items: toolCatalog,
      statusField: 'supportStatus',
      expectedHrefs: toolRepositoryHref,
    },
  ]

  for (const slug of [
    'soft-delete',
    'rbac',
    'api-keys',
    'webhook',
    'outbox',
    'jobs',
    'data-subject',
  ]) {
    catalogSurfaces.push({
      pathname: `/packages/${slug}/`,
      surface: 'package-version',
      kind: 'package',
      items: packagesForSlugs([slug]),
      statusField: 'supportStatus',
      expectedVisibleText: (item) => item.version,
    })
  }

  for (const contract of catalogSurfaces) {
    validateCatalogSurface({ routeToPage, ...contract })
  }

  for (const [sourceRoute, page] of routeToPage) {
    for (const rawHref of extractAttributes(page.html, 'href')) {
      if (!rawHref || rawHref.startsWith('//')) continue

      let target
      try {
        target = new URL(rawHref, `${siteOrigin}${sourceRoute}`)
      } catch {
        fail(`${sourceRoute}: invalid href ${JSON.stringify(rawHref)}`)
        continue
      }

      if (target.origin !== siteOrigin) continue

      const targetPath = safeDecode(target.pathname)
      const candidates = routeCandidates(targetPath)
      let targetPage

      for (const candidate of candidates) {
        const route = candidate.endsWith('/index.html')
          ? routeForHtml(candidate.slice(1))
          : candidate
        if (routeToPage.has(route)) {
          targetPage = routeToPage.get(route)
          break
        }
      }

      if (!targetPage) {
        const assetPath = path.join(distDir, targetPath.replace(/^\//, ''))
        if (!await fileExists(assetPath)) {
          fail(`${sourceRoute}: ${rawHref} points to missing output ${targetPath}`)
        }
        continue
      }

      if (target.hash) {
        const fragment = safeDecode(target.hash.slice(1))
        if (fragment && !targetPage.ids.has(fragment)) {
          fail(`${sourceRoute}: ${rawHref} points to missing anchor #${fragment}`)
        }
      }
    }
  }

  const sitemapPath = path.join(distDir, 'sitemap.xml')
  if (!await fileExists(sitemapPath)) {
    fail('/sitemap.xml: missing from build output')
  } else {
    const sitemap = await readFile(sitemapPath, 'utf8')
    const sitemapRoutes = new Set()

    for (const match of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
      const route = new URL(decodeHtml(match[1])).pathname
      sitemapRoutes.add(route)
      const reason = forbiddenReason(route)
      if (reason) fail(`sitemap includes ${route}: ${reason}`)

      const candidates = routeCandidates(route)
      const published = candidates.some((candidate) => {
        const normalized = candidate.endsWith('/index.html')
          ? routeForHtml(candidate.slice(1))
          : candidate
        return routeToPage.has(normalized)
      })
      if (!published) fail(`sitemap includes missing page ${route}`)
    }

    for (const route of routeToPage.keys()) {
      if (route === '/404.html') continue
      const sitemapRoute = route.endsWith('/index.html')
        ? routeForHtml(route.slice(1))
        : route
      if (!sitemapRoutes.has(sitemapRoute)) {
        fail(`${route}: public HTML page is missing from sitemap`)
      }
    }
  }

  const robotsPath = path.join(distDir, 'robots.txt')
  if (!await fileExists(robotsPath)) {
    fail('/robots.txt: missing from build output')
  } else {
    const robots = await readFile(robotsPath, 'utf8')
    if (/^\s*Disallow:\s*\/api(?:\/|\s*$)/im.test(robots)) {
      fail('/robots.txt: public API reference conflicts with a Disallow rule')
    }
    if (!robots.includes('Sitemap: https://nestarc.dev/sitemap.xml')) {
      fail('/robots.txt: canonical sitemap declaration is missing')
    }
  }

  if (failures.length > 0) {
    const uniqueFailures = [...new Set(failures)].sort()
    console.error(`Site validation failed with ${uniqueFailures.length} issue(s):`)
    for (const failure of uniqueFailures) {
      console.error(`- ${failure}`)
    }
    process.exitCode = 1
    return
  }

  const publicPages = [...routeToPage.keys()].filter((route) => route !== '/404.html').length
  console.log(`Site validation passed: ${publicPages} public pages, ${htmlFiles.length} HTML files checked.`)
}

await main()
