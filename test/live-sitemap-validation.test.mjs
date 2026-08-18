import assert from 'node:assert/strict'
import test from 'node:test'
import {
  sitemapLocations,
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
