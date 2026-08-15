import assert from 'node:assert/strict'
import test from 'node:test'
import {
  catalogReleaseTargets,
  checkCatalogReleases,
  compareCatalogVersions,
  fetchLatestVersion,
  formatCatalogReleaseReport,
  latestVersionFromMetadata,
  registryRetryDelay,
  registryPackageUrl,
} from '../scripts/check-catalog-releases.mjs'

test('derives exact npm release targets for packages and tools', () => {
  assert.deepEqual(
    catalogReleaseTargets({
      packages: [{ slug: 'alpha', version: '1.2.3' }],
      tools: [{ slug: 'scanner', version: '0.4.0' }],
    }),
    [
      {
        kind: 'package',
        name: '@nestarc/alpha',
        currentVersion: '1.2.3',
      },
      {
        kind: 'tool',
        name: '@nestarc/scanner',
        currentVersion: '0.4.0',
      },
    ],
  )
})

test('builds an encoded npm registry package URL', () => {
  assert.equal(
    registryPackageUrl('@nestarc/alpha', 'https://registry.example.test/'),
    'https://registry.example.test/%40nestarc%2Falpha/latest',
  )
})

test('extracts latest and rejects malformed registry metadata', () => {
  assert.equal(
    latestVersionFromMetadata({ version: ' 1.2.3 ' }, '@nestarc/alpha'),
    '1.2.3',
  )
  assert.throws(
    () => latestVersionFromMetadata(null, '@nestarc/alpha'),
    /invalid metadata for @nestarc\/alpha/,
  )
  assert.throws(
    () => latestVersionFromMetadata({ 'dist-tags': {} }, '@nestarc/alpha'),
    /missing the latest version/,
  )
})

test('fetches dist-tag latest through an injectable registry client', async () => {
  const requests = []
  const latestVersion = await fetchLatestVersion('@nestarc/alpha', {
    registryOrigin: 'https://registry.example.test',
    timeoutMs: 1_000,
    fetchImpl: async (url, options) => {
      requests.push({ url, options })
      return {
        ok: true,
        status: 200,
        async json() {
          return { version: '1.2.3' }
        },
      }
    },
  })

  assert.equal(latestVersion, '1.2.3')
  assert.equal(requests.length, 1)
  assert.equal(
    requests[0].url,
    'https://registry.example.test/%40nestarc%2Falpha/latest',
  )
  assert.equal(
    requests[0].options.headers.accept,
    'application/json',
  )
  assert.ok(requests[0].options.signal instanceof AbortSignal)
})

test('reports registry HTTP failures with the package name', async () => {
  await assert.rejects(
    fetchLatestVersion('@nestarc/missing', {
      fetchImpl: async () => ({ ok: false, status: 404 }),
    }),
    /@nestarc\/missing failed with HTTP 404/,
  )
})

test('adds package context to registry transport failures', async () => {
  await assert.rejects(
    fetchLatestVersion('@nestarc/unreachable', {
      maxAttempts: 2,
      fetchImpl: async () => {
        throw new Error('connection refused')
      },
    }),
    /request for @nestarc\/unreachable failed after 2 attempt\(s\): connection refused/,
  )
})

test('retries a transient transport failure', async () => {
  let attempts = 0
  const latest = await fetchLatestVersion('@nestarc/alpha', {
    maxAttempts: 2,
    sleepImpl: async () => {},
    fetchImpl: async () => {
      attempts += 1
      if (attempts === 1) throw new Error('temporary failure')
      return {
        ok: true,
        status: 200,
        async json() {
          return { version: '1.2.3' }
        },
      }
    },
  })

  assert.equal(latest, '1.2.3')
  assert.equal(attempts, 2)
})

test('retries rate limits and honors Retry-After', async () => {
  let attempts = 0
  const delays = []
  const latest = await fetchLatestVersion('@nestarc/alpha', {
    maxAttempts: 2,
    sleepImpl: async (delay) => delays.push(delay),
    fetchImpl: async () => {
      attempts += 1
      if (attempts === 1) {
        return {
          ok: false,
          status: 429,
          headers: { get: () => '2' },
        }
      }
      return {
        ok: true,
        status: 200,
        async json() { return { version: '1.2.3' } },
      }
    },
  })

  assert.equal(latest, '1.2.3')
  assert.equal(attempts, 2)
  assert.deepEqual(delays, [2_000])
})

test('retries a response body read failure', async () => {
  let attempts = 0
  const latest = await fetchLatestVersion('@nestarc/alpha', {
    maxAttempts: 2,
    sleepImpl: async () => {},
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      async json() {
        attempts += 1
        if (attempts === 1) throw new TypeError('terminated')
        return { version: '1.2.3' }
      },
    }),
  })

  assert.equal(latest, '1.2.3')
  assert.equal(attempts, 2)
})

test('computes exponential registry retry delay without a header', () => {
  assert.equal(registryRetryDelay(null, 3, { baseDelayMs: 100 }), 400)
})

test('compares catalog versions and formats matching output', async () => {
  const targets = [
    { kind: 'package', name: '@nestarc/alpha', currentVersion: '1.2.3' },
    { kind: 'tool', name: '@nestarc/scanner', currentVersion: '0.4.0' },
  ]
  const latestByName = new Map([
    ['@nestarc/alpha', '1.2.3'],
    ['@nestarc/scanner', '0.4.0'],
  ])

  const report = await checkCatalogReleases({
    targets,
    fetchLatest: async (name) => latestByName.get(name),
  })

  assert.equal(report.checkedCount, 2)
  assert.equal(report.matches.length, 2)
  assert.deepEqual(report.drifts, [])
  assert.equal(
    formatCatalogReleaseReport(report),
    'Catalog releases are current: 2 entries match npm dist-tag latest.',
  )
})

test('lists every drift with its current and latest version', () => {
  const report = compareCatalogVersions([
    {
      kind: 'package',
      name: '@nestarc/alpha',
      currentVersion: '1.2.3',
      latestVersion: '1.3.0',
    },
    {
      kind: 'tool',
      name: '@nestarc/scanner',
      currentVersion: '0.4.0',
      latestVersion: '0.5.0',
    },
  ])

  assert.equal(report.matches.length, 0)
  assert.equal(report.drifts.length, 2)
  assert.equal(
    formatCatalogReleaseReport(report),
    [
      'Catalog release drift detected:',
      '- @nestarc/alpha: current 1.2.3, latest 1.3.0',
      '- @nestarc/scanner: current 0.4.0, latest 0.5.0',
      '',
      'Update data/package-catalog.mjs and regenerate the affected API reference.',
    ].join('\n'),
  )
})
