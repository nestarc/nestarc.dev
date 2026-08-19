import process from 'node:process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const defaultOrigin = 'https://nestarc.dev'

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
    // The status and headers are sufficient for this validation.
  }
}

async function fetchWithoutRedirect(fetchImpl, url) {
  return fetchImpl(url, {
    method: 'GET',
    redirect: 'manual',
    headers: {
      accept: 'text/html,application/xml;q=0.9,*/*;q=0.8',
      'user-agent': 'nestarc-live-sitemap-validator/1.0',
    },
  })
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
      const failure = await validate(items[index])
      if (failure) failures.push(failure)
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
} = {}) {
  const expectedOrigin = normalizedOrigin(origin)
  if (typeof fetchImpl !== 'function') throw new Error('a fetch implementation is required')
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error('concurrency must be a positive integer')
  }

  const sitemapUrl = `${expectedOrigin}/sitemap.xml`
  let sitemapResponse
  try {
    sitemapResponse = await fetchWithoutRedirect(fetchImpl, sitemapUrl)
  } catch (error) {
    throw new Error(`${sitemapUrl} request failed: ${error instanceof Error ? error.message : error}`)
  }

  const sitemapFailure = statusFailure(sitemapUrl, sitemapResponse)
  if (sitemapFailure) {
    await cancelBody(sitemapResponse)
    throw new Error(sitemapFailure)
  }

  const xml = await sitemapResponse.text()
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
    let response
    try {
      response = await fetchWithoutRedirect(fetchImpl, url)
    } catch (error) {
      return `${url} request failed: ${error instanceof Error ? error.message : error}`
    }
    const failure = statusFailure(url, response)
    await cancelBody(response)
    return failure
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
} = {}) {
  const expectedOrigin = normalizedOrigin(origin)
  const failures = []

  async function get(pathname) {
    const url = `${expectedOrigin}${pathname}`
    try {
      return { url, response: await fetchWithoutRedirect(fetchImpl, url) }
    } catch (error) {
      failures.push(`${url} request failed: ${error instanceof Error ? error.message : error}`)
      return null
    }
  }

  const sitemap = await get('/sitemap.xml')
  if (sitemap) {
    if (statusFailure(sitemap.url, sitemap.response)) {
      failures.push(statusFailure(sitemap.url, sitemap.response))
      await cancelBody(sitemap.response)
    } else {
      const xml = await sitemap.response.text()
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
      await cancelBody(robots.response)
    } else {
      const body = await robots.response.text()
      if (!body.includes(`Sitemap: ${expectedOrigin}/sitemap.xml`)) failures.push(`${robots.url} is missing the canonical sitemap declaration`)
      if (!/User-agent:\s*OAI-SearchBot[\s\S]*?Allow:\s*\//i.test(body)) failures.push(`${robots.url} does not explicitly allow OAI-SearchBot`)
    }
  }

  const llms = await get('/llms.txt')
  if (llms) {
    const failure = statusFailure(llms.url, llms.response)
    if (failure) {
      failures.push(failure)
      await cancelBody(llms.response)
    } else if (!(await llms.response.text()).includes(`Canonical site: ${expectedOrigin}/`)) {
      failures.push(`${llms.url} does not identify the canonical site`)
    }
  }

  const errorPage = await get('/404')
  if (errorPage) {
    const header = errorPage.response.headers.get('x-robots-tag') ?? ''
    const body = await errorPage.response.text()
    if (!/\bnoindex\b/i.test(header) && !/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(body)) {
      failures.push(`${errorPage.url} is missing a noindex directive`)
    }
    if (/<link[^>]+rel=["']canonical["']/i.test(body)) failures.push(`${errorPage.url} must not emit a canonical URL`)
  }

  const missing = await get('/__nestarc_missing_seo_probe__')
  if (missing) {
    if (missing.response.status !== 404) failures.push(`${missing.url} returned ${missing.response.status}, expected 404`)
    await cancelBody(missing.response)
  }

  for (const pathname of ['/', '/packages/tenancy/', '/blog/nestjs-idempotency-implementation-broken']) {
    const page = await get(pathname)
    if (!page) continue
    const failure = statusFailure(page.url, page.response)
    if (failure) {
      failures.push(failure)
      await cancelBody(page.response)
      continue
    }
    const body = await page.response.text()
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
  console.log(`Live sitemap validation passed: ${result.urlsChecked} URLs returned 2xx without redirects.`)
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
