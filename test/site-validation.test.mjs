import assert from 'node:assert/strict'
import test from 'node:test'
import {
  extractAttributes,
  extractSrcsetUrls,
  outputPathForUrl,
  robotsDisallowsPath,
  validateSitemapLocation,
  wildcardRobotsDisallowRules,
} from '../scripts/validate-site.mjs'

test('extracts rendered asset attributes and srcset candidates', () => {
  const html = '<img src="/hero.png" srcset="/hero.png 1x, /hero@2x.png 2x"><video poster="/poster.jpg"></video>'
  assert.deepEqual(extractAttributes(html, 'src'), ['/hero.png'])
  assert.deepEqual(extractAttributes(html, 'poster'), ['/poster.jpg'])
  assert.deepEqual(extractSrcsetUrls(extractAttributes(html, 'srcset')[0]), [
    '/hero.png',
    '/hero@2x.png',
  ])
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
