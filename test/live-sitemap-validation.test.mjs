import assert from 'node:assert/strict'
import test from 'node:test'
import {
  sitemapLastmods,
  sitemapLocations,
  validateLiveSeoControls,
  validateLiveSitemap,
} from '../scripts/validate-live-sitemap.mjs'

test('extracts and decodes sitemap locations', () => {
  assert.deepEqual(sitemapLocations(`
    <urlset>
      <url><loc>https://nestarc.dev/</loc></url>
      <url><loc>https://nestarc.dev/search?q=a&amp;b</loc></url>
    </urlset>
  `), [
    'https://nestarc.dev/',
    'https://nestarc.dev/search?q=a&b',
  ])
})

test('extracts sitemap lastmod values', () => {
  assert.deepEqual(sitemapLastmods(`
    <urlset>
      <url><loc>https://nestarc.dev/</loc><lastmod>2026-08-19</lastmod></url>
    </urlset>
  `), [{ location: 'https://nestarc.dev/', lastmod: '2026-08-19' }])
})

test('validates live robots, discovery, 404, canonical, schema, and social controls', async () => {
  const fetchImpl = async (url) => {
    const pathname = new URL(url).pathname
    if (pathname === '/sitemap.xml') {
      return new Response('<urlset><url><loc>https://nestarc.dev/</loc><lastmod>2026-08-19</lastmod></url></urlset>')
    }
    if (pathname === '/robots.txt') {
      return new Response('User-agent: *\nAllow: /\nUser-agent: OAI-SearchBot\nAllow: /\nSitemap: https://nestarc.dev/sitemap.xml')
    }
    if (pathname === '/llms.txt') return new Response('Canonical site: https://nestarc.dev/')
    if (pathname === '/404') return new Response('<meta name="robots" content="noindex, nofollow">')
    if (pathname === '/__nestarc_missing_seo_probe__') return new Response('missing', { status: 404 })
    const canonical = new URL(pathname, 'https://nestarc.dev').href
    return new Response(`<link rel="canonical" href="${canonical}"><meta property="og:image" content="https://nestarc.dev/og-default.svg"><script type="application/ld+json">{}</script>`)
  }

  const result = await validateLiveSeoControls({ fetchImpl })
  assert.equal(result.controlsChecked, 8)
})

test('requests every live sitemap URL without following redirects', async () => {
  const requests = []
  const fetchImpl = async (url, options) => {
    requests.push({ url, options })
    if (url.endsWith('/sitemap.xml')) {
      return new Response(`
        <urlset>
          <url><loc>https://nestarc.dev/</loc></url>
          <url><loc>https://nestarc.dev/guide/</loc></url>
        </urlset>
      `)
    }
    return new Response('ok')
  }

  const result = await validateLiveSitemap({ fetchImpl, concurrency: 2 })
  assert.equal(result.urlsChecked, 2)
  assert.equal(requests.length, 3)
  assert.ok(requests.every(({ options }) => options.redirect === 'manual'))
})

test('rejects redirects and non-success responses from sitemap URLs', async () => {
  const fetchImpl = async (url) => {
    if (url.endsWith('/sitemap.xml')) {
      return new Response(`
        <urlset>
          <url><loc>https://nestarc.dev/old</loc></url>
          <url><loc>https://nestarc.dev/missing</loc></url>
        </urlset>
      `)
    }
    if (url.endsWith('/old')) {
      return new Response(null, { status: 308, headers: { location: '/new' } })
    }
    return new Response(null, { status: 404 })
  }

  await assert.rejects(
    validateLiveSitemap({ fetchImpl }),
    (error) => {
      assert.match(error.message, /\/old redirects with 308 to \/new/)
      assert.match(error.message, /\/missing returned 404/)
      return true
    },
  )
})

test('reports but never requests sitemap URLs on another origin', async () => {
  const requests = []
  const fetchImpl = async (url) => {
    requests.push(url)
    return new Response(`
      <urlset>
        <url><loc>https://unexpected.example/page</loc></url>
      </urlset>
    `)
  }

  await assert.rejects(
    validateLiveSitemap({ fetchImpl }),
    /uses unexpected origin/,
  )
  assert.deepEqual(requests, ['https://nestarc.dev/sitemap.xml'])
})
