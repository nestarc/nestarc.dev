import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

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
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
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
  const expression = new RegExp(`\\b${attribute}\\s*=\\s*(["'])(.*?)\\1`, 'gis')
  for (const match of html.matchAll(expression)) {
    values.push(decodeHtml(match[2]))
  }
  return values
}

function extractIds(html) {
  return new Set([
    ...extractAttributes(html, 'id'),
    ...extractAttributes(html, 'name'),
  ].map(safeDecode))
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
