import assert from 'node:assert/strict'
import test from 'node:test'
import {
  sitemapLastmods,
  sitemapLocations,
  validateLiveSeoControls,
  validateLiveSitemap,
} from '../scripts/validate-live-sitemap.mjs'

function htmlPage(url, { head = '', body = '<h1>Reference</h1>', title = 'Reference', canonical = true, headers = {} } = {}) {
  const responseHeaders = new Headers({ 'content-type': 'text/html; charset=utf-8' })
  new Headers(headers).forEach((value, name) => responseHeaders.set(name, value))
  return new Response(`<!doctype html><html><head>
    <title>${title}</title>
    ${canonical ? `<link rel="canonical" href="${url}">` : ''}
    ${head}
  </head><body>${body}</body></html>`, { headers: responseHeaders })
}

function sitemapResponse(locations) {
  return new Response(`<urlset>${locations.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`)
}

function pageFetcher(locations, respond) {
  return async (url, options) => url.endsWith('/sitemap.xml') ? sitemapResponse(locations) : respond(url, options)
}

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
    return htmlPage(url)
  }

  const result = await validateLiveSitemap({ fetchImpl, concurrency: 2 })
  assert.equal(result.urlsChecked, 2)
  assert.equal(requests.length, 3)
  assert.ok(requests.every(({ options }) => options.redirect === 'manual'))
  assert.ok(requests.every(({ options }) => options.signal instanceof AbortSignal))
})

test('checks SEO directives on every sitemap page, including pages outside the old samples', async () => {
  const locations = ['https://nestarc.dev/', 'https://nestarc.dev/api/data-subject/modules']
  const fetchImpl = pageFetcher(locations, (url) => htmlPage(url, {
    head: url.endsWith('/modules') ? '<meta content="follow, NOINDEX" name="Googlebot">' : '',
  }))
  await assert.rejects(validateLiveSitemap({ fetchImpl }), /\/api\/data-subject\/modules has a Googlebot meta directive that prevents indexing/)
})

test('parses canonical and robots attributes independently of order, quoting, case, comments, and script content', async () => {
  const url = 'https://nestarc.dev/guide/'
  const fetchImpl = pageFetcher([url], () => htmlPage(url, {
    canonical: false,
    head: `<LINK HREF=${url} REL="alternate CANONICAL">
      <META CONTENT="index,follow" NAME=ROBOTS>
      <!-- <link rel="canonical" href="https://wrong.example/"><meta name="robots" content="noindex"> -->
      <script>const example = '<link rel="canonical" href="https://wrong.example/"><meta name="robots" content="noindex">';</script>`,
    body: '<h1><span>API &amp; guide {{ literal }}</span></h1><pre>&lt;h1&gt;404&lt;/h1&gt;</pre>',
  }))
  assert.equal((await validateLiveSitemap({ fetchImpl })).urlsChecked, 1)
})

for (const { name, options, message } of [
  { name: 'missing canonical', options: { canonical: false }, message: /exactly one canonical link/ },
  { name: 'duplicate canonical', options: { head: '<link rel="canonical" href="https://nestarc.dev/guide/">' }, message: /found 2/ },
  { name: 'canonical outside head', options: { canonical: false, body: '<link href="https://nestarc.dev/guide/" rel="canonical"><h1>Guide</h1>' }, message: /inside <head>/ },
  { name: 'another page canonical', options: { canonical: false, head: '<link href="https://nestarc.dev/other/" rel="canonical">' }, message: /self-canonical URL/ },
  { name: 'relative canonical', options: { canonical: false, head: '<link href="/guide/" rel="canonical">' }, message: /absolute self-canonical URL/ },
  { name: 'robots none', options: { head: '<meta content=none name=robots>' }, message: /robots meta directive that prevents indexing/ },
  { name: 'Googlebot noindex', options: { head: '<meta name="googlebot" content="noindex, follow">' }, message: /googlebot meta directive that prevents indexing/ },
  { name: 'global noindex header', options: { headers: { 'x-robots-tag': 'noindex, nofollow' } }, message: /X-Robots-Tag that prevents indexing/ },
  { name: 'Googlebot none header', options: { headers: { 'x-robots-tag': 'otherbot: nofollow, googlebot: none' } }, message: /X-Robots-Tag that prevents indexing/ },
  { name: 'JSON success response', options: { headers: { 'content-type': 'application/json' } }, message: /non-HTML content type: application\/json/ },
  { name: 'empty title', options: { title: '&nbsp; &#x200b;' }, message: /nonempty <title>/ },
  { name: 'empty H1', options: { body: '<h1>&nbsp;<a aria-hidden="true">#</a></h1>' }, message: /nonempty <h1>/ },
  { name: 'inert H1', options: { body: '<template><h1>Hidden title</h1></template>' }, message: /nonempty <h1>/ },
  { name: 'VitePress error template', options: { title: '404 | NestArc', body: '<div class="VPNotFound"><h1>404</h1><p>PAGE NOT FOUND</p></div>' }, message: /404 template with a success status/ },
]) {
  test(`rejects ${name} on a successful sitemap response`, async () => {
    const fetchImpl = pageFetcher(['https://nestarc.dev/guide/'], (url) => htmlPage(url, options))
    await assert.rejects(validateLiveSitemap({ fetchImpl }), message)
  })
}

test('does not flag directives for other crawlers or an article discussing 404 responses', async () => {
  const fetchImpl = pageFetcher(['https://nestarc.dev/guide/'], (url) => htmlPage(url, {
    title: 'Handling 404 responses',
    head: '<meta name="otherbot" content="noindex">',
    body: '<h1>Page not found</h1><p>Return a 404 status for missing resources.</p>',
    headers: { 'x-robots-tag': 'max-snippet: -1, otherbot: noindex, nofollow' },
  }))
  assert.equal((await validateLiveSitemap({ fetchImpl })).urlsChecked, 1)
})

for (const directive of ['noindex', 'none']) {
  test(`rejects a global ${directive} header folded after another crawler's header`, async () => {
    const headers = new Headers([
      ['x-robots-tag', 'otherbot: nofollow'],
      ['x-robots-tag', directive],
    ])
    assert.equal(headers.get('x-robots-tag'), `otherbot: nofollow, ${directive}`)
    const fetchImpl = pageFetcher(['https://nestarc.dev/guide/'], (url) => htmlPage(url, { headers }))
    await assert.rejects(validateLiveSitemap({ fetchImpl }), /ambiguous X-Robots-Tag: bare noindex\/none/)
  })
}

test('keeps page requests and body reads within the concurrency limit', async () => {
  const locations = Array.from({ length: 5 }, (_, index) => `https://nestarc.dev/page-${index}`)
  let active = 0
  let peak = 0
  const fetchImpl = pageFetcher(locations, (url) => {
    active += 1
    peak = Math.max(peak, active)
    const response = htmlPage(url)
    const text = response.text.bind(response)
    response.text = async () => {
      await new Promise((resolve) => setTimeout(resolve, 5))
      active -= 1
      return text()
    }
    return response
  })
  assert.equal((await validateLiveSitemap({ fetchImpl, concurrency: 2 })).urlsChecked, 5)
  assert.equal(peak, 2)
  assert.equal(active, 0)
})

test('aggregates request and response body failures without abandoning other pages', async () => {
  const visited = []
  const locations = ['https://nestarc.dev/network', 'https://nestarc.dev/body', 'https://nestarc.dev/valid']
  const fetchImpl = pageFetcher(locations, (url) => {
    visited.push(url)
    if (url.endsWith('/network')) throw new Error('connection reset')
    if (url.endsWith('/body')) {
      return new Response(new ReadableStream({ start(controller) { controller.error(new Error('stream interrupted')) } }))
    }
    return htmlPage(url)
  })
  await assert.rejects(validateLiveSitemap({ fetchImpl }), (error) => {
    assert.match(error.message, /network request failed: connection reset/)
    assert.match(error.message, /body response body failed: stream interrupted/)
    return true
  })
  assert.deepEqual(visited.sort(), locations.sort())
})

for (const stage of ['request', 'response body']) {
  test(`aborts a stalled ${stage} and reports its URL`, async () => {
    let requestSignal
    const fetchImpl = pageFetcher(['https://nestarc.dev/stalled'], (url, options) => {
      requestSignal = options.signal
      if (stage === 'request') return new Promise(() => {})
      const response = htmlPage(url)
      response.text = () => new Promise(() => {})
      return response
    })
    await assert.rejects(
      validateLiveSitemap({ fetchImpl, timeoutMs: 15 }),
      new RegExp(`/stalled ${stage} failed: timed out after 15 ms`),
    )
    assert.equal(requestSignal.aborted, true)
  })
}

test('reports sitemap response body failures with the sitemap URL', async () => {
  const fetchImpl = async () => new Response(new ReadableStream({ start(controller) { controller.error(new Error('truncated sitemap')) } }))
  await assert.rejects(validateLiveSitemap({ fetchImpl }), /sitemap\.xml response body failed: truncated sitemap/)
})

test('validates timeout configuration before making requests', async () => {
  for (const timeoutMs of [0, -1, 1.5, NaN]) {
    await assert.rejects(validateLiveSitemap({ timeoutMs }), /timeoutMs must be a positive integer/)
    await assert.rejects(validateLiveSeoControls({ timeoutMs }), /timeoutMs must be a positive integer/)
  }
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
