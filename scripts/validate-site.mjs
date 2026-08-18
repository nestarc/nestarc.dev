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
  if (posixFile === '404.html') return '/404.html'
  if (posixFile.endsWith('/index.html')) {
    return `/${posixFile.slice(0, -'index.html'.length)}`
  }
  return `/${posixFile.slice(0, -'.html'.length)}`
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

export function extractAttributes(html, attribute) {
  const values = []
  const expression = new RegExp(`(?:^|\\s)${attribute}\\s*=\\s*(["'])(.*?)\\1`, 'gis')
  for (const match of html.matchAll(expression)) {
    values.push(decodeHtml(match[2]))
  }
  return values
}

function extractTagAttributes(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gis'))]
    .map((match) => match[0])
}

function extractTitle(html) {
  const match = /<title>(.*?)<\/title>/is.exec(html)
  return match ? decodeHtml(match[1]).trim() : ''
}

function tagsWithAttribute(html, tagName, attribute, expectedValue) {
  return extractTagAttributes(html, tagName).filter((tag) =>
    extractAttributes(tag, attribute).some((value) => value === expectedValue))
}

export function extractSrcsetUrls(srcset) {
  return srcset
    .split(',')
    .map((candidate) => candidate.trim().split(/\s+/, 1)[0])
    .filter((candidate) => candidate && !candidate.startsWith('data:'))
}

export function outputPathForUrl(outputRoot, pathname) {
  const decoded = safeDecode(pathname)
  const absolute = path.resolve(outputRoot, `.${decoded.startsWith('/') ? decoded : `/${decoded}`}`)
  const relative = path.relative(outputRoot, absolute)
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null
  return absolute
}

function robotsWildcardPattern(value) {
  const anchored = value.endsWith('$')
  const body = anchored ? value.slice(0, -1) : value
  const escaped = body
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replaceAll('*', '.*')
  return new RegExp(`^${escaped}${anchored ? '$' : ''}`)
}

export function wildcardRobotsDisallowRules(robots) {
  const groups = []
  let agents = []
  let disallows = []
  let hasDirectives = false

  const flush = () => {
    if (agents.length > 0) groups.push({ agents, disallows })
    agents = []
    disallows = []
    hasDirectives = false
  }

  for (const rawLine of robots.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim()
    if (!line) continue
    const separator = line.indexOf(':')
    if (separator === -1) continue
    const field = line.slice(0, separator).trim().toLowerCase()
    const value = line.slice(separator + 1).trim()

    if (field === 'user-agent') {
      if (hasDirectives) flush()
      agents.push(value.toLowerCase())
    } else if (agents.length > 0) {
      hasDirectives = true
      if (field === 'disallow' && value) disallows.push(value)
    }
  }
  flush()

  return groups
    .filter(({ agents: groupAgents }) => groupAgents.includes('*'))
    .flatMap(({ disallows: groupDisallows }) => groupDisallows)
}

export function robotsDisallowsPath(robots, pathname) {
  return wildcardRobotsDisallowRules(robots).some((rule) =>
    robotsWildcardPattern(rule).test(pathname))
}

export function validateSitemapLocation(rawLocation, expectedOrigin = siteOrigin) {
  const url = new URL(decodeHtml(rawLocation))
  if (url.origin !== expectedOrigin) {
    throw new Error(`unexpected origin ${url.origin}`)
  }
  if (url.search || url.hash) {
    throw new Error('query strings and fragments are not allowed')
  }
  return url.pathname
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

function extractElementByClass(html, tagName, className) {
  const expression = new RegExp(
    `<(${tagName})\\b(?=[^>]*\\bclass\\s*=\\s*["'][^"']*\\b${className}\\b[^"']*["'])[^>]*>`,
    'i',
  )
  const match = expression.exec(html)
  return match ? extractElementHtml(html, match) : null
}

function canonicalRouteFromHref(rawHref, sourceRoute) {
  let target
  try {
    target = new URL(rawHref, `${siteOrigin}${sourceRoute}`)
  } catch {
    return null
  }
  if (target.origin !== siteOrigin) return null

  let pathname = safeDecode(target.pathname)
  if (pathname.endsWith('/index.html')) {
    pathname = pathname.slice(0, -'index.html'.length)
  } else if (pathname.endsWith('.html')) {
    pathname = pathname.slice(0, -'.html'.length)
  }
  return pathname
}

function validateRequiredEntryLink({ routeToPage, pathname, target, scope }) {
  const page = pageForPath(routeToPage, pathname)
  if (!page) {
    fail(`${pathname}: missing page required for ${scope} entry-link contract`)
    return
  }

  const html = scope === 'sidebar'
    ? extractElementByClass(page.html, 'aside', 'VPSidebar')
    : extractElementByClass(page.html, 'div', 'vp-doc')
  if (!html) {
    fail(`${pathname}: missing ${scope} element for entry-link contract`)
    return
  }

  const hasTarget = extractAttributes(html, 'href').some((href) =>
    canonicalRouteFromHref(href, pathname) === target)
  if (!hasTarget) {
    fail(`${pathname}: ${scope} must link to ${target}`)
  }
}

function validateRequiredPageLink({ routeToPage, pathname, target, label }) {
  const page = pageForPath(routeToPage, pathname)
  if (!page) {
    fail(`${pathname}: missing page required for ${label}`)
    return
  }
  const hasTarget = extractAttributes(page.html, 'href').some((href) =>
    canonicalRouteFromHref(href, pathname) === target)
  if (!hasTarget) fail(`${pathname}: ${label} must link to ${target}`)
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
  const titleToRoutes = new Map()
  const descriptionToRoutes = new Map()

  for (const file of htmlFiles) {
    const relative = path.relative(distDir, file)
    const route = routeForHtml(relative)
    const html = await readFile(file, 'utf8')
    routeToPage.set(route, { file, html, ids: extractIds(html) })

    const reason = forbiddenReason(route)
    if (reason) fail(`${route}: ${reason}`)

    if (route !== '/404.html') {
      const canonicalTags = tagsWithAttribute(html, 'link', 'rel', 'canonical')
      const expectedCanonical = new URL(route, siteOrigin).href
      const canonicalUrls = canonicalTags.flatMap((tag) => extractAttributes(tag, 'href'))
      if (canonicalUrls.length !== 1) {
        fail(`${route}: expected exactly one canonical link, found ${canonicalUrls.length}`)
      } else if (canonicalUrls[0] !== expectedCanonical) {
        fail(`${route}: canonical is ${canonicalUrls[0]}, expected ${expectedCanonical}`)
      }

      const title = extractTitle(html)
      const expectedOgTitle = title.replace(/ \| nestarc$/, '')
      const descriptionTags = tagsWithAttribute(html, 'meta', 'name', 'description')
      const descriptions = descriptionTags.flatMap((tag) => extractAttributes(tag, 'content'))
      const ogTitleTags = tagsWithAttribute(html, 'meta', 'property', 'og:title')
      const ogTitles = ogTitleTags.flatMap((tag) => extractAttributes(tag, 'content'))
      const ogDescriptionTags = tagsWithAttribute(html, 'meta', 'property', 'og:description')
      const ogDescriptions = ogDescriptionTags.flatMap((tag) => extractAttributes(tag, 'content'))
      const ogUrlTags = tagsWithAttribute(html, 'meta', 'property', 'og:url')
      const ogUrls = ogUrlTags.flatMap((tag) => extractAttributes(tag, 'content'))

      if (!title) fail(`${route}: document title is missing`)
      if (descriptions.length !== 1 || !descriptions[0]) {
        fail(`${route}: expected exactly one non-empty meta description`)
      }
      if (ogTitles.length !== 1 || ogTitles[0] !== expectedOgTitle) {
        fail(`${route}: og:title must match the page-specific document title`)
      }
      if (ogDescriptions.length !== 1 || ogDescriptions[0] !== descriptions[0]) {
        fail(`${route}: og:description must match the page meta description`)
      }
      if (ogUrls.length !== 1 || ogUrls[0] !== expectedCanonical) {
        fail(`${route}: og:url must equal the absolute canonical URL`)
      }

      if (title) {
        const routes = titleToRoutes.get(title) ?? []
        routes.push(route)
        titleToRoutes.set(title, routes)
      }
      if (descriptions[0]) {
        const routes = descriptionToRoutes.get(descriptions[0]) ?? []
        routes.push(route)
        descriptionToRoutes.set(descriptions[0], routes)
      }
    }
  }

  for (const [title, routes] of titleToRoutes) {
    if (routes.length > 1) {
      fail(`duplicate title ${JSON.stringify(title)} on ${routes.join(', ')}`)
    }
  }
  for (const [description, routes] of descriptionToRoutes) {
    if (routes.length > 1) {
      fail(`duplicate description ${JSON.stringify(description)} on ${routes.join(', ')}`)
    }
  }

  const adoptionOrder = [...packageCatalog].sort((left, right) =>
    left.adoptionStage - right.adoptionStage
      || packageCatalog.indexOf(left) - packageCatalog.indexOf(right))
  const packageGuideHref = ({ slug }) => [`/packages/${slug}/`]
  const packageApiHrefs = ({ slug, repository }) => [
    `/api/${slug}/`,
    ...(routeToPage.has(`/api/${slug}/modules`)
      ? [`/api/${slug}/modules`]
      : []),
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
  const asyncDeliveryPackages = packagesForSlugs([
    'outbox',
    'jobs',
    'webhook',
  ])
  const asyncWorkflowVersionPackages = packagesForSlugs([
    'tenancy',
    'idempotency',
    'outbox',
    'jobs',
    'webhook',
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
      pathname: '/guide/async-delivery-workflow',
      surface: 'adoption-stage-packages',
      kind: 'package',
      items: asyncDeliveryPackages,
      statusField: 'supportStatus',
      expectedHrefs: packageGuideHref,
    },
    {
      pathname: '/guide/async-delivery-workflow',
      surface: 'package-version',
      kind: 'package',
      items: asyncWorkflowVersionPackages,
      statusField: 'supportStatus',
      expectedVisibleText: (item) => item.version,
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

  for (const contract of [
    { pathname: '/guide/', target: '/guide/async-delivery-workflow', scope: 'landing' },
    { pathname: '/guide/adoption-roadmap', target: '/guide/async-delivery-workflow', scope: 'adoption' },
    { pathname: '/community/', target: '/guide/async-delivery-workflow', scope: 'roadmap' },
    { pathname: '/guide/async-delivery-workflow', target: '/guide/async-delivery-workflow', scope: 'sidebar' },
  ]) {
    validateRequiredEntryLink({ routeToPage, ...contract })
  }

  for (const contract of [
    { pathname: '/getting-started', target: '/ko/getting-started', label: 'Korean locale switch' },
    { pathname: '/ko/getting-started', target: '/getting-started', label: 'English locale switch' },
    { pathname: '/packages/', target: '/ko/', label: 'fallback Korean locale switch' },
  ]) {
    validateRequiredPageLink({ routeToPage, ...contract })
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
      if (targetPath.endsWith('.html')) {
        fail(`${sourceRoute}: ${rawHref} uses a noncanonical .html internal URL`)
      }
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
        const assetPath = outputPathForUrl(distDir, targetPath)
        if (!assetPath) {
          fail(`${sourceRoute}: ${rawHref} escapes the build output directory`)
        } else if (!await fileExists(assetPath)) {
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

    const assetReferences = [
      ...extractAttributes(page.html, 'src'),
      ...extractAttributes(page.html, 'poster'),
      ...extractAttributes(page.html, 'srcset').flatMap(extractSrcsetUrls),
    ]
    for (const rawReference of assetReferences) {
      if (!rawReference || rawReference.startsWith('//')) continue

      let target
      try {
        target = new URL(rawReference, `${siteOrigin}${sourceRoute}`)
      } catch {
        fail(`${sourceRoute}: invalid rendered asset URL ${JSON.stringify(rawReference)}`)
        continue
      }
      if (target.origin !== siteOrigin) continue

      const targetPath = safeDecode(target.pathname)
      const assetPath = outputPathForUrl(distDir, targetPath)
      if (!assetPath) {
        fail(`${sourceRoute}: ${rawReference} escapes the build output directory`)
      } else if (!await fileExists(assetPath)) {
        fail(`${sourceRoute}: ${rawReference} points to missing rendered asset ${targetPath}`)
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
      let route
      try {
        route = validateSitemapLocation(match[1])
      } catch (error) {
        fail(`/sitemap.xml: invalid location ${JSON.stringify(decodeHtml(match[1]))}: ${error instanceof Error ? error.message : error}`)
        continue
      }
      sitemapRoutes.add(route)
      if (route.endsWith('.html')) {
        fail(`sitemap includes noncanonical .html URL ${route}`)
      }
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
      if (!sitemapRoutes.has(route)) {
        fail(`${route}: public HTML page is missing from sitemap`)
      }
    }
  }

  const robotsPath = path.join(distDir, 'robots.txt')
  if (!await fileExists(robotsPath)) {
    fail('/robots.txt: missing from build output')
  } else {
    const robots = await readFile(robotsPath, 'utf8')
    if (robotsDisallowsPath(robots, '/api/') || robotsDisallowsPath(robots, '/api/index.html')) {
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

const scriptPath = fileURLToPath(import.meta.url)
if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  await main()
}
