import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import test from 'node:test'
import { apiPackageTsv } from '../scripts/list-api-packages.mjs'
import { listPackageEntryPoints } from '../scripts/list-package-entry-points.mjs'
import {
  loadNpmSigstoreVerify,
  verifyReleaseProvenance,
  verifySigstoreBundle,
} from '../scripts/verify-release-provenance.mjs'

const execFileAsync = promisify(execFile)
const rootDir = path.resolve(import.meta.dirname, '..')

test('renders validated API package rows as generator TSV', () => {
  assert.equal(
    apiPackageTsv([{
      repository: 'nestjs-alpha',
      slug: 'alpha',
      version: '1.2.3',
      releaseProvenance: 'gitHead',
    }]),
    'nestjs-alpha\talpha\t1.2.3\tv1.2.3\tgitHead',
  )
  assert.throws(
    () => apiPackageTsv([{
      repository: 'nestjs-alpha\nunsafe',
      slug: 'alpha',
      version: '1.2.3',
      releaseProvenance: 'gitHead',
    }]),
    /Invalid API package TSV fields/,
  )
})

test('normalizes an invalid generated anchor against VitePress output', async () => {
  const fixtureDir = path.join(
    rootDir,
    '.typedoc-work',
    'api',
    `anchor-fixture-${process.pid}`,
  )

  try {
    await mkdir(fixtureDir, { recursive: true })
    const markdownPath = path.join(fixtureDir, 'index.md')
    await writeFile(
      markdownPath,
      [
        '# Fixture',
        '',
        '[Broken](#section-7)',
        '[Second underscore](#foo_bar-1)',
        '[Unprefixed custom](#symbol)',
        '[Prefixed natural](#api-constructor-1)',
        '[Collapsed punctuation](#why-nestarcsoft-delete)',
        '',
        '`[Inline example](#section-7)`',
        '',
        '```md',
        '[Fenced example](#section-7)  ',
        '```',
        '',
        '## Section',
        '',
        '## foo_bar',
        '',
        '## Symbol {#api-symbol}',
        '',
        '## Constructor',
        '',
        '## Why @nestarc/soft-delete?',
        '',
        '## Constructor',
        '',
        '## foo_bar',
        '',
      ].join('\n'),
    )

    const { stdout } = await execFileAsync(
      process.execPath,
      ['scripts/fix-api-anchors.mjs', fixtureDir],
      { cwd: rootDir },
    )

    assert.match(stdout, /Normalized 5 generated API anchor link/)
    const updated = await readFile(markdownPath, 'utf8')
    assert.match(updated, /\[Broken\]\(#section\)/)
    assert.match(updated, /\[Second underscore\]\(#foo-bar-1\)/)
    assert.match(updated, /\[Unprefixed custom\]\(#api-symbol\)/)
    assert.match(updated, /\[Prefixed natural\]\(#constructor-1\)/)
    assert.match(updated, /\[Collapsed punctuation\]\(#why-nestarc-soft-delete\)/)
    assert.match(updated, /`\[Inline example\]\(#section-7\)`/)
    assert.match(updated, /```md\n\[Fenced example\]\(#section-7\)\n```/)
    assert.doesNotMatch(updated, /\[Fenced example\]\(#section-7\) +$/m)
  } finally {
    await rm(fixtureDir, { recursive: true, force: true })
  }
})

test('derives TypeDoc entry points from every public package export', async () => {
  const fixtureDir = path.join(
    rootDir,
    '.typedoc-work',
    `exports-fixture-${process.pid}`,
  )

  try {
    await mkdir(path.join(fixtureDir, 'src', 'cache'), { recursive: true })
    await writeFile(path.join(fixtureDir, 'src', 'index.ts'), 'export {}\n')
    await writeFile(path.join(fixtureDir, 'src', 'openfeature.ts'), 'export {}\n')
    await writeFile(path.join(fixtureDir, 'src', 'cache', 'index.ts'), 'export {}\n')
    await writeFile(
      path.join(fixtureDir, 'package.json'),
      JSON.stringify({
        exports: {
          '.': { types: './dist/index.d.ts', import: './dist/index.js' },
          './openfeature': { types: './dist/openfeature.d.ts' },
          './cache': './dist/cache/index.js',
          './package.json': './package.json',
        },
      }),
    )

    assert.deepEqual(listPackageEntryPoints(fixtureDir), [
      'src/index.ts',
      'src/openfeature.ts',
      'src/cache/index.ts',
    ])

    await writeFile(path.join(fixtureDir, 'src', 'main.ts'), 'export {}\n')
    await writeFile(
      path.join(fixtureDir, 'package.json'),
      JSON.stringify({ exports: './dist/main.js' }),
    )
    assert.deepEqual(listPackageEntryPoints(fixtureDir), ['src/main.ts'])

    await writeFile(
      path.join(fixtureDir, 'package.json'),
      JSON.stringify({
        exports: {
          types: './dist/main.d.ts',
          import: './dist/main.js',
        },
      }),
    )
    assert.deepEqual(listPackageEntryPoints(fixtureDir), ['src/main.ts'])
  } finally {
    await rm(fixtureDir, { recursive: true, force: true })
  }
})

test('pins TypeDoc links to prefixed HTML anchors without replacing heading IDs', async () => {
  const config = JSON.parse(await readFile(path.join(rootDir, 'typedoc.base.json'), 'utf8'))
  assert.equal(config.useHTMLAnchors, true)
  assert.notEqual(config.useCustomAnchors, true)
  assert.equal(config.anchorPrefix, 'api-')
})

test('API generation workflow rebases and validates against current main before push', async () => {
  const workflow = await readFile(
    path.join(rootDir, '.github', 'workflows', 'generate-api-docs.yml'),
    'utf8',
  )
  assert.match(workflow, /ref: main/)
  assert.match(workflow, /git rebase origin\/main/)
  assert.match(workflow, /npm run docs:check/)
  assert.match(workflow, /git push origin HEAD:main/)
})

test('API generation verifies trusted-publisher artifacts before reading SLSA provenance', async () => {
  const generator = await readFile(
    path.join(rootDir, 'scripts', 'generate-api-docs.sh'),
    'utf8',
  )

  assert.match(generator, /^\s+dist \\$/m)
  assert.match(generator, /npm audit signatures/)
  assert.match(generator, /--ignore-scripts/)
  assert.match(generator, /case "\$RELEASE_PROVENANCE" in/)
  assert.match(generator, /package-lock\.json/)
  assert.match(generator, /AUDITED_INTEGRITY/)
  assert.match(
    generator,
    /lock\.packages\?\.\[""\]\?\.dependencies\?\.\[packageName\]/,
  )
  assert.match(
    generator,
    /lock\.packages\?\.\[`node_modules\/\$\{packageName\}`\]/,
  )
  assert.match(generator, /declaredVersion !== expectedVersion/)
  assert.match(generator, /installed\?\.version !== expectedVersion/)
  assert.match(generator, /MEDIA_CHANGELOG_LINKED/)
  assert.match(generator, /generated media links to \.\.\/CHANGELOG\.md/)
})

test('requires npm gitHead to match the immutable release tag commit', async () => {
  const commit = 'a'.repeat(40)
  await assert.doesNotReject(
    () => verifyReleaseProvenance(
      { version: '1.2.3', gitHead: commit },
      '1.2.3',
      commit,
      '@nestarc/fixture',
      { releaseProvenance: 'gitHead' },
    ),
  )
  await assert.rejects(
    () => verifyReleaseProvenance(
      { version: '1.2.3', gitHead: 'b'.repeat(40) },
      '1.2.3',
      commit,
      '@nestarc/fixture',
      { releaseProvenance: 'gitHead' },
    ),
    /does not match release tag commit/,
  )
  await assert.rejects(
    () => verifyReleaseProvenance(
      { version: '1.2.3' },
      '1.2.3',
      commit,
      '@nestarc/fixture',
      { releaseProvenance: 'gitHead' },
    ),
    /missing a valid gitHead/,
  )
  await assert.rejects(
    () => verifyReleaseProvenance(
      { version: '1.2.3', gitHead: commit },
      '1.2.3',
      commit,
      '@nestarc/fixture',
    ),
    /unsupported release provenance policy undefined/,
  )
})

function slsaFixture(overrides = {}) {
  const commit = 'a'.repeat(40)
  const digest = 'b'.repeat(128)
  const integrity = `sha512-${Buffer.from(digest, 'hex').toString('base64')}`
  const statement = overrides.statement ?? {
    _type: 'https://in-toto.io/Statement/v1',
    subject: [{
      name: 'pkg:npm/%40nestarc/fixture@1.2.3',
      digest: { sha512: digest },
    }],
    predicateType: 'https://slsa.dev/provenance/v1',
    predicate: {
      buildDefinition: {
        externalParameters: {
          workflow: {
            repository: 'https://github.com/nestarc/fixture-repo',
            ref: 'refs/tags/v1.2.3',
          },
        },
        resolvedDependencies: [{
          uri: 'git+https://github.com/nestarc/fixture-repo@refs/tags/v1.2.3',
          digest: { gitCommit: commit },
        }],
      },
    },
  }
  const bundle = {
    dsseEnvelope: {
      payloadType: 'application/vnd.in-toto+json',
      payload: Buffer.from(JSON.stringify(statement)).toString('base64'),
    },
  }
  const attestations = {
    attestations: [{
      predicateType: 'https://slsa.dev/provenance/v1',
      bundle,
    }],
  }
  const metadata = {
    version: '1.2.3',
    // A valid gitHead must not downgrade a catalog-selected SLSA policy.
    gitHead: commit,
    dist: {
      integrity,
      attestations: {
        url: 'https://registry.npmjs.org/-/npm/v1/attestations/%40nestarc%2Ffixture@1.2.3',
        provenance: { predicateType: 'https://slsa.dev/provenance/v1' },
      },
    },
  }
  return {
    attestations,
    bundle,
    commit,
    digest,
    integrity,
    metadata,
    options: {
      attestations,
      repository: 'fixture-repo',
      tag: 'v1.2.3',
      releaseProvenance: 'slsa',
      auditedVersion: '1.2.3',
      auditedIntegrity: integrity,
    },
  }
}

test('SLSA policy verifies one exact bundle before semantic checks even when gitHead exists', async () => {
  const fixture = slsaFixture()
  let cryptographicallyVerified = false
  const replacementBundle = { dsseEnvelope: { payload: 'forged' } }

  await assert.doesNotReject(() => verifyReleaseProvenance(
    fixture.metadata,
    '1.2.3',
    fixture.commit,
    '@nestarc/fixture',
    {
      ...fixture.options,
      verifyBundle: async (bundle, repository, tag) => {
        assert.strictEqual(bundle, fixture.bundle)
        assert.equal(repository, 'fixture-repo')
        assert.equal(tag, 'v1.2.3')
        cryptographicallyVerified = true
        fixture.attestations.attestations[0].bundle = replacementBundle
      },
    },
  ))
  assert.equal(cryptographicallyVerified, true)
})

test('SLSA policy rejects missing or ambiguous attestations even when gitHead exists', async () => {
  const missing = slsaFixture()
  await assert.rejects(
    () => verifyReleaseProvenance(
      missing.metadata,
      '1.2.3',
      missing.commit,
      '@nestarc/fixture',
      {
        ...missing.options,
        attestations: undefined,
        verifyBundle: async () => {},
      },
    ),
    /invalid attestation response/,
  )

  const ambiguous = slsaFixture()
  ambiguous.attestations.attestations.push({
    ...ambiguous.attestations.attestations[0],
  })
  await assert.rejects(
    () => verifyReleaseProvenance(
      ambiguous.metadata,
      '1.2.3',
      ambiguous.commit,
      '@nestarc/fixture',
      { ...ambiguous.options, verifyBundle: async () => {} },
    ),
    /must have exactly one SLSA provenance statement/,
  )
})

test('SLSA policy binds audited lock integrity, metadata, statement, and tag commit', async () => {
  const fixture = slsaFixture()
  const verifyBundle = async () => {}

  await assert.rejects(
    () => verifyReleaseProvenance(
      fixture.metadata,
      '1.2.3',
      'c'.repeat(40),
      '@nestarc/fixture',
      { ...fixture.options, verifyBundle },
    ),
    /does not match release tag commit/,
  )
  await assert.rejects(
    () => verifyReleaseProvenance(
      fixture.metadata,
      '1.2.3',
      fixture.commit,
      '@nestarc/fixture',
      {
        ...fixture.options,
        auditedIntegrity: `sha512-${Buffer.alloc(64).toString('base64')}`,
        verifyBundle,
      },
    ),
    /metadata integrity does not match the audited lock entry/,
  )
  await assert.rejects(
    () => verifyReleaseProvenance(
      fixture.metadata,
      '1.2.3',
      fixture.commit,
      '@nestarc/fixture',
      { ...fixture.options, auditedVersion: '1.2.4', verifyBundle },
    ),
    /audited npm package version 1\.2\.4 does not match/,
  )

  const wrongSubject = slsaFixture()
  const statement = JSON.parse(
    Buffer.from(
      wrongSubject.bundle.dsseEnvelope.payload,
      'base64',
    ).toString('utf8'),
  )
  statement.subject[0].digest.sha512 = 'c'.repeat(128)
  wrongSubject.bundle.dsseEnvelope.payload = Buffer.from(
    JSON.stringify(statement),
  ).toString('base64')
  await assert.rejects(
    () => verifyReleaseProvenance(
      wrongSubject.metadata,
      '1.2.3',
      wrongSubject.commit,
      '@nestarc/fixture',
      { ...wrongSubject.options, verifyBundle },
    ),
    /SLSA subject does not match/,
  )
})

test('SLSA policy rejects workflow repository and ref mismatches', async () => {
  for (const [field, value] of [
    ['repository', 'https://github.com/nestarc/other-repo'],
    ['ref', 'refs/heads/main'],
  ]) {
    const fixture = slsaFixture()
    const statement = JSON.parse(
      Buffer.from(
        fixture.bundle.dsseEnvelope.payload,
        'base64',
      ).toString('utf8'),
    )
    statement.predicate.buildDefinition.externalParameters.workflow[field] = value
    fixture.bundle.dsseEnvelope.payload = Buffer.from(
      JSON.stringify(statement),
    ).toString('base64')

    await assert.rejects(
      () => verifyReleaseProvenance(
        fixture.metadata,
        '1.2.3',
        fixture.commit,
        '@nestarc/fixture',
        { ...fixture.options, verifyBundle: async () => {} },
      ),
      /SLSA workflow does not match/,
    )
  }
})

test('SLSA policy fails closed when cryptographic bundle verification fails', async () => {
  const fixture = slsaFixture()
  await assert.rejects(
    () => verifyReleaseProvenance(
      fixture.metadata,
      '1.2.3',
      fixture.commit,
      '@nestarc/fixture',
      {
        ...fixture.options,
        verifyBundle: async () => {
          throw new Error('cryptographic verification failed')
        },
      },
    ),
    /cryptographic verification failed/,
  )
})

test('pins Sigstore verification to the GitHub Actions issuer and release workflow identity', async () => {
  const bundle = { mediaType: 'application/vnd.dev.sigstore.bundle.v0.3+json' }
  await verifySigstoreBundle(bundle, 'fixture-repo', 'v1.2.3', {
    sigstoreVerify: async (receivedBundle, policy) => {
      assert.strictEqual(receivedBundle, bundle)
      assert.equal(
        policy.certificateIssuer,
        'https://token.actions.githubusercontent.com',
      )
      const identity = new RegExp(policy.certificateIdentityURI)
      assert.match(
        'https://github.com/nestarc/fixture-repo/.github/workflows/release.yml@refs/tags/v1.2.3',
        identity,
      )
      assert.doesNotMatch(
        'https://github.com/nestarc/other/.github/workflows/release.yml@refs/tags/v1.2.3',
        identity,
      )
      assert.doesNotMatch(
        'https://github.com/nestarc/fixture-repo/.github/workflows/release.yml@refs/heads/main',
        identity,
      )
      assert.doesNotMatch(
        'https://github.com/nestarc/fixture-repo/.github/workflows/nested/release.yml@refs/tags/v1.2.3',
        identity,
      )
    },
  })
})

test('loads npm bundled Sigstore by capability and fails closed without verify', () => {
  assert.equal(typeof loadNpmSigstoreVerify(), 'function')

  const verify = async () => {}
  let requiredFrom
  const loaded = loadNpmSigstoreVerify({
    npmRoot: '/test/global/lib/node_modules',
    createRequire: (modulePath) => {
      requiredFrom = modulePath
      return (specifier) => specifier === 'sigstore' ? { verify } : undefined
    },
  })
  assert.strictEqual(loaded, verify)
  assert.equal(
    requiredFrom,
    '/test/global/lib/node_modules/npm/package.json',
  )

  assert.throws(
    () => loadNpmSigstoreVerify({
      npmRoot: '/test/global/lib/node_modules',
      createRequire: () => () => ({}),
    }),
    /does not expose the required verify API/,
  )
  assert.throws(
    () => loadNpmSigstoreVerify({
      npmRoot: '/test/global/lib/node_modules',
      createRequire: () => () => {
        throw new Error('module not found')
      },
    }),
    /bundled sigstore is unavailable: module not found/,
  )
})
