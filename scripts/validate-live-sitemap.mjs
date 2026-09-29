import process from 'node:process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from '@vue/compiler-dom'

const defaultOrigin = 'https://nestarc.dev'
const defaultTimeoutMs = 15_000
const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])
const inertElements = new Set(['script', 'style', 'template', 'noscript'])

function decodeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
}

export function sitemapLocations(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/gis)]
    .map((match) => decodeXml(match[1].trim()))
}

export function sitemapLastmods(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map((match) => ({
    location: decodeXml(match[1].match(/<loc>(.*?)<\/loc>/is)?.[1]?.trim() ?? ''),
    lastmod: match[1].match(/<lastmod>(.*?)<\/lastmod>/is)?.[1]?.trim() ?? '',
  }))
}

function normalizedOrigin(value) {
  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error(`origin must be an HTTP(S) URL without credentials: ${value}`)
  }
  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error(`origin must not include a path, query, or fragment: ${value}`)
  }
  return url.origin
}

async function cancelBody(response) {
  try {
    await response.body?.cancel()
  } catch {
    // A failed or already consumed body needs no further cleanup.
  }
}

function validateRequestOptions(fetchImpl, timeoutMs) {
  if (typeof fetchImpl !== 'function') throw new Error('a fetch implementation is required')
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1) throw new Error('timeoutMs must be a positive integer')
}

async function fetchWithoutRedirect(fetchImpl, url, timeoutMs, readBody = (response) => !statusFailure(url, response)) {
  const controller = new AbortController()
  let response
  let stage = 'request'
  let timer
  try {
    return await Promise.race([
      (async () => {
        response = await fetchImpl(url, {
          method: 'GET',
          redirect: 'manual',
          signal: controller.signal,
          headers: {
            accept: 'text/html,application/xml;q=0.9,*/*;q=0.8',
            'user-agent': 'nestarc-live-sitemap-validator/2.0',
          },
        })
        stage = 'response body'
        let body = ''
        if (readBody(response)) body = await response.text()
        else await cancelBody(response)
        return { url, response, body }
      })(),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          controller.abort()
          reject(new Error(`timed out after ${timeoutMs} ms`))
        }, timeoutMs)
      }),
    ])
  } catch (error) {
    controller.abort()
    if (response) void cancelBody(response)
    throw new Error(`${url} ${stage} failed: ${error instanceof Error ? error.message : error}`)
  } finally {
    clearTimeout(timer)
  }
}

function attributes(node) {
  return Object.fromEntries(node.props
    .filter((prop) => prop.type === 6)
    .map((prop) => [prop.name.toLowerCase(), prop.value?.content ?? '']))
}

function visibleText(node) {
  if (node.type === 2) return node.content
  if (node.type !== 1 || inertElements.has(node.tag.toLowerCase())) return ''
  const props = attributes(node)
  if ('hidden' in props || props['aria-hidden']?.toLowerCase() === 'true') return ''
  return node.children.map(visibleText).join(' ')
}

function hasNoindex(value) {
  return value.toLowerCase().split(/[\s,;]+/).some((directive) => ['noindex', 'none'].includes(directive))
}

function headerIndexingFailure(value) {
  let agent = '*'
  // Fetch folds repeated X-Robots-Tag fields into one comma-separated value,
  // losing the distinction between "otherbot: nofollow, noindex" and separate
  // "otherbot: nofollow" / global "noindex" fields. Fail this ambiguous case
  // rather than overlooking a global indexing block. Explicit otherbot-scoped
  // noindex remains allowed; emit an agent prefix on each scoped blocking rule.
  const valueDirectives = new Set(['max-snippet', 'max-image-preview', 'max-video-preview', 'unavailable_after'])
  for (let directive of value.split(',')) {
    const prefix = /^\s*([\w-]+|\*)\s*:\s*(.*)$/s.exec(directive)
    const explicitAgent = prefix && !valueDirectives.has(prefix[1].toLowerCase())
    if (explicitAgent) {
      agent = prefix[1].toLowerCase()
      directive = prefix[2]
    }
    if (!hasNoindex(directive)) continue
    if (['*', 'googlebot'].includes(agent)) return 'has an X-Robots-Tag that prevents indexing'
    if (!explicitAgent) return 'has an ambiguous X-Robots-Tag: bare noindex/none after another crawler scope may be a separate global header'
  }
  return null
}

function pageSeoFailures(url, response, body) {
  const failures = []
  const contentType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
  if (!['text/html', 'application/xhtml+xml'].includes(contentType)) {
    failures.push(`${url} returned a non-HTML content type: ${contentType || '(missing)'}`)
  }
  const headerFailure = headerIndexingFailure(response.headers.get('x-robots-tag') ?? '')
  if (headerFailure) failures.push(`${url} ${headerFailure}`)

  let document
  try {
    // Reuse VitePress's public HTML parser; disabling interpolation keeps code
    // examples containing Vue syntax as literal text.
    document = parse(body, {
      parseMode: 'html',
      comments: false,
      delimiters: ['\u0000', '\u0000'],
      isVoidTag: (tag) => voidElements.has(tag.toLowerCase()),
    })
  } catch (error) {
    failures.push(`${url} could not be parsed as HTML: ${error.message}`)
    return failures
  }

  const canonicals = []
  const titles = []
  const headings = []
  let notFoundTemplate = false
  function visit(node, inHead = false) {
    if (node.type !== 1) return
    const tag = node.tag.toLowerCase()
    if (inertElements.has(tag)) return
    const props = attributes(node)
    const insideHead = inHead || tag === 'head'
    if (tag === 'link' && props.rel?.toLowerCase().split(/\s+/).includes('canonical')) {
      canonicals.push({ href: props.href, inHead: insideHead })
    }
    if (tag === 'meta' && ['robots', 'googlebot'].includes(props.name?.toLowerCase()) && hasNoindex(props.content ?? '')) {
      failures.push(`${url} has a ${props.name} meta directive that prevents indexing`)
    }
    if (tag === 'title' && insideHead) titles.push(visibleText(node))
    if (tag === 'h1' && !insideHead) headings.push(visibleText(node))
    if (props.class?.split(/\s+/).includes('VPNotFound')) notFoundTemplate = true
    for (const child of node.children) visit(child, insideHead)
  }
  for (const child of document.children) visit(child)

  if (canonicals.length !== 1 || !canonicals[0].inHead) {
    failures.push(`${url} must have exactly one canonical link, inside <head> (found ${canonicals.length})`)
  } else {
    let canonical
    try { canonical = new URL(canonicals[0].href).href } catch { /* Report an invalid/missing absolute URL below. */ }
    if (canonical !== url) failures.push(`${url} is missing its absolute self-canonical URL (found ${canonicals[0].href ?? '(missing href)'})`)
  }
  const nonempty = (text) => text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().length > 0
  if (!titles.some(nonempty)) failures.push(`${url} is missing a nonempty <title> in <head>`)
  if (!headings.some(nonempty)) failures.push(`${url} is missing a nonempty <h1>`)
  if (notFoundTemplate) failures.push(`${url} returned the VitePress 404 template with a success status`)
  return failures
}

function statusFailure(url, response) {
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('location')
    return `${url} redirects with ${response.status}${location ? ` to ${location}` : ''}`
  }
  if (response.status < 200 || response.status >= 300) {
    return `${url} returned ${response.status}`
  }
  return null
}

async function validateInBatches(items, concurrency, validate) {
  const failures = []
  let cursor = 0

  async function worker() {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      const result = await validate(items[index])
      if (Array.isArray(result)) failures.push(...result)
      else if (result) failures.push(result)
    }
  }

  await Promise.all(Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  ))
  return failures
}

export async function validateLiveSitemap({
  origin = defaultOrigin,
  fetchImpl = globalThis.fetch,
  concurrency = 8,
  timeoutMs = defaultTimeoutMs,
} = {}) {
  const expectedOrigin = normalizedOrigin(origin)
  validateRequestOptions(fetchImpl, timeoutMs)
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error('concurrency must be a positive integer')
  }

  const sitemapUrl = `${expectedOrigin}/sitemap.xml`
  const { response: sitemapResponse, body: xml } = await fetchWithoutRedirect(fetchImpl, sitemapUrl, timeoutMs)

  const sitemapFailure = statusFailure(sitemapUrl, sitemapResponse)
  if (sitemapFailure) {
    throw new Error(sitemapFailure)
  }

  const locations = sitemapLocations(xml)
  if (locations.length === 0) throw new Error(`${sitemapUrl} contains no <loc> entries`)

  const failures = []
  const seenLocations = new Set()
  const validLocations = new Set()
  for (const location of locations) {
    let url
    try {
      url = new URL(location)
    } catch {
      failures.push(`sitemap contains an invalid URL: ${location}`)
      continue
    }
    if (seenLocations.has(url.href)) failures.push(`sitemap contains duplicate URL ${url.href}`)
    seenLocations.add(url.href)

    if (url.origin !== expectedOrigin) {
      failures.push(`${location} uses unexpected origin ${url.origin}`)
    } else if (url.search || url.hash) {
      failures.push(`${location} includes a query string or fragment`)
    } else {
      validLocations.add(url.href)
    }
  }

  const requestFailures = await validateInBatches([...validLocations], concurrency, async (url) => {
    try {
      const { response, body } = await fetchWithoutRedirect(fetchImpl, url, timeoutMs)
      const failure = statusFailure(url, response)
      return failure ? [failure] : pageSeoFailures(url, response, body)
    } catch (error) {
      return error instanceof Error ? error.message : String(error)
    }
  })
  failures.push(...requestFailures)

  if (failures.length > 0) {
    failures.sort()
    throw new Error(`Live sitemap validation failed with ${failures.length} issue(s):\n${failures.map((failure) => `- ${failure}`).join('\n')}`)
  }

  return { origin: expectedOrigin, urlsChecked: validLocations.size }
}

export async function validateLiveSeoControls({
  origin = defaultOrigin,
  fetchImpl = globalThis.fetch,
  timeoutMs = defaultTimeoutMs,
} = {}) {
  const expectedOrigin = normalizedOrigin(origin)
  validateRequestOptions(fetchImpl, timeoutMs)
  const failures = []

  async function get(pathname, readBody) {
    const url = `${expectedOrigin}${pathname}`
    try {
      return await fetchWithoutRedirect(fetchImpl, url, timeoutMs, readBody)
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error))
      return null
    }
  }

  const sitemap = await get('/sitemap.xml')
  if (sitemap) {
    if (statusFailure(sitemap.url, sitemap.response)) {
      failures.push(statusFailure(sitemap.url, sitemap.response))
    } else {
      const xml = sitemap.body
      for (const entry of sitemapLastmods(xml)) {
        if (!entry.location || !/^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod)) {
          failures.push(`${entry.location || sitemap.url} is missing a date-only sitemap lastmod`)
        }
      }
    }
  }

  const robots = await get('/robots.txt')
  if (robots) {
    const failure = statusFailure(robots.url, robots.response)
    if (failure) {
      failures.push(failure)
    } else {
      const body = robots.body
      if (!body.includes(`Sitemap: ${expectedOrigin}/sitemap.xml`)) failures.push(`${robots.url} is missing the canonical sitemap declaration`)
      if (!/User-agent:\s*OAI-SearchBot[\s\S]*?Allow:\s*\//i.test(body)) failures.push(`${robots.url} does not explicitly allow OAI-SearchBot`)
    }
  }

  const llms = await get('/llms.txt')
  if (llms) {
    const failure = statusFailure(llms.url, llms.response)
    if (failure) {
      failures.push(failure)
    } else if (!llms.body.includes(`Canonical site: ${expectedOrigin}/`)) {
      failures.push(`${llms.url} does not identify the canonical site`)
    }
  }

  const errorPage = await get('/404', () => true)
  if (errorPage) {
    const header = errorPage.response.headers.get('x-robots-tag') ?? ''
    const body = errorPage.body
    if (!/\bnoindex\b/i.test(header) && !/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(body)) {
      failures.push(`${errorPage.url} is missing a noindex directive`)
    }
    if (/<link[^>]+rel=["']canonical["']/i.test(body)) failures.push(`${errorPage.url} must not emit a canonical URL`)
  }

  const missing = await get('/__nestarc_missing_seo_probe__', () => false)
  if (missing) {
    if (missing.response.status !== 404) failures.push(`${missing.url} returned ${missing.response.status}, expected 404`)
  }

  for (const pathname of ['/', '/packages/tenancy/', '/blog/nestjs-idempotency-implementation-broken']) {
    const page = await get(pathname)
    if (!page) continue
    const failure = statusFailure(page.url, page.response)
    if (failure) {
      failures.push(failure)
      continue
    }
    const body = page.body
    const canonical = new URL(pathname, expectedOrigin).href
    if (!body.includes(`rel="canonical" href="${canonical}"`)) failures.push(`${page.url} is missing its self-canonical URL`)
    if (!body.includes('application/ld+json')) failures.push(`${page.url} is missing JSON-LD`)
    if (!body.includes('property="og:image"')) failures.push(`${page.url} is missing og:image`)
  }

  if (failures.length > 0) {
    failures.sort()
    throw new Error(`Live SEO control validation failed with ${failures.length} issue(s):\n${failures.map((failure) => `- ${failure}`).join('\n')}`)
  }

  return { origin: expectedOrigin, controlsChecked: 8 }
}

async function main() {
  const origin = process.argv[2] ?? defaultOrigin
  const result = await validateLiveSitemap({ origin })
  await validateLiveSeoControls({ origin })
  console.log(`Live sitemap validation passed: ${result.urlsChecked} URLs passed HTTP and HTML indexability checks (content type, self-canonical, robots directives, title, H1, and 404 template).`)
  console.log('Live SEO controls passed: sitemap lastmod, robots, llms.txt, 404, canonical, JSON-LD, and social image checks.')
}

const scriptPath = fileURLToPath(import.meta.url)
if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    await main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
