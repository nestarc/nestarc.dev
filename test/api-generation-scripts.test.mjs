import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import test from 'node:test'
import { apiPackageTsv } from '../scripts/list-api-packages.mjs'
import { listPackageEntryPoints } from '../scripts/list-package-entry-points.mjs'
import { apiNavigation } from '../data/api-navigation.mjs'
import {
  contextEnd,
  contextStart,
  enrichApiKeyIntegration,
  enrichApiModules,
  enrichApiNavigation,
} from '../scripts/enrich-api-navigation.mjs'
import {
  loadNpmSigstoreVerify,
  verifyReleaseProvenance,
  verifySigstoreBundle,
} from '../scripts/verify-release-provenance.mjs'

const execFileAsync = promisify(execFile)
const rootDir = path.resolve(import.meta.dirname, '..')

test('API navigation survives regeneration without duplicating context or changing signatures', async () => {
  for (const [slug, { modules }] of Object.entries(apiNavigation)) {
    const boundary = slug === 'feature-flag' ? '> Keep the published version boundary.\n\n' : ''
    const generated = `# @nestarc/${slug}\n\n${boundary}## Modules\n\n${Object.keys(modules)
      .map((target) => `- [${target.replace(/\.md$/, '')}](${target})`).join('\n')}\n`
    const enriched = enrichApiModules(generated, slug)
    assert.equal(enrichApiModules(enriched, slug), enriched)
    assert.ok(enriched.includes(boundary))
    for (const target of Object.keys(modules)) assert.ok(enriched.includes(`](${target})`))
    const checkedIn = await readFile(path.join(rootDir, 'api', slug, 'modules.md'), 'utf8')
    assert.equal(enrichApiModules(checkedIn, slug), checkedIn, `${slug} navigation is stale`)
  }

  const generated = '# integrations/api-keys\n\n## Functions\n\n' +
    '<a id="api-createapikeysubjectresolver"></a>\n\n' +
    '### createApiKeySubjectResolver()\n\n```ts\nfunction createApiKeySubjectResolver(): RbacSubjectResolver;\n```\n' +
    '\nDefined in: [source](https://example.test/immutable-commit/api-keys.ts#L5)\n'
  const enriched = enrichApiKeyIntegration(generated)
  assert.equal(enrichApiKeyIntegration(enriched), enriched)
  assert.equal(enriched.slice(enriched.indexOf('## Functions\n')), generated.slice(generated.indexOf('## Functions\n')))
  assert.match(enriched, /request\.apiKey/)
  assert.match(enriched, /does not validate an API-key credential/)
  const checkedIn = await readFile(path.join(rootDir, 'api/rbac/integrations/api-keys.md'), 'utf8')
  assert.equal(enrichApiKeyIntegration(checkedIn), checkedIn, 'API-key integration context is stale')
})

test('API navigation fails when generated module coverage or context markers drift', () => {
  assert.throws(() => enrichApiModules('# Package\n\n## Modules\n\n- [index](index.md)\n', 'data-subject'), /Missing data-subject API module: lint.md/)
  assert.throws(() => enrichApiModules('# Package\n\n## Modules\n\n- [new](new.md)\n', 'data-subject'), /Unexpected or duplicate/)
  assert.throws(() => enrichApiKeyIntegration(`# Package\n\n${contextStart}\n## Functions\n`), /Malformed/)
  assert.throws(() => enrichApiKeyIntegration(`# Package\n\n${contextEnd}\n${contextStart}\n## Functions\n`), /Malformed/)
  assert.throws(() => enrichApiKeyIntegration('# Package\n'), /Missing generated API heading/)
})

test('Jobs release navigation is repeatable and leaves generated signatures and historical media intact', async () => {
  const fixtureDir = await mkdtemp(path.join(os.tmpdir(), 'jobs-api-navigation-'))
  try {
    const provenance = await readFile(path.join(rootDir, 'api/jobs/.generated.json'), 'utf8')
    const { commit, version } = JSON.parse(provenance)
    const signatures = `# @nestarc/jobs\n\nDefined in: [source](https://github.com/nestarc/jobs/blob/${commit}/src/index.ts#L1)\n\n\`\`\`ts\nclass JobsService {}\n\`\`\`\n`
    const historical = '# Historical maintenance decisions\n'
    await mkdir(path.join(fixtureDir, '_media'))
    await writeFile(path.join(fixtureDir, '.generated.json'), provenance)
    await writeFile(path.join(fixtureDir, 'index.md'), signatures)
    await writeFile(path.join(fixtureDir, '_media/spec.md'), historical)
    await writeFile(path.join(fixtureDir, 'README.md'), '# Jobs\n\nPublished 0.3.1; unreleased 0.4.0.\n')

    assert.equal(await enrichApiNavigation(fixtureDir, 'jobs'), 1)
    const updated = await readFile(path.join(fixtureDir, 'README.md'), 'utf8')
    assert.ok(updated.startsWith(`# @nestarc/jobs ${version} release source\n`))
    assert.ok(updated.includes(`https://github.com/nestarc/jobs/blob/${commit}/README.md`))
    assert.doesNotMatch(updated, /status text is stale/)
    for (const guide of ['installation', 'testing', 'backends', 'outbox-bridge']) {
      assert.ok(updated.includes(`/packages/jobs/${guide}`))
    }
    assert.equal(await readFile(path.join(rootDir, 'api/jobs/README.md'), 'utf8'), updated)
    await enrichApiNavigation(fixtureDir, 'jobs')
    assert.equal(await readFile(path.join(fixtureDir, 'README.md'), 'utf8'), updated)
    assert.equal(await readFile(path.join(fixtureDir, 'index.md'), 'utf8'), signatures)
    assert.equal(await readFile(path.join(fixtureDir, '_media/spec.md'), 'utf8'), historical)
    assert.equal(await readFile(path.join(fixtureDir, '.generated.json'), 'utf8'), provenance)
  } finally {
    await rm(fixtureDir, { recursive: true, force: true })
  }
})

test('Jobs navigation rejects mismatched release provenance before replacing the README', async () => {
  const fixtureDir = await mkdtemp(path.join(os.tmpdir(), 'jobs-api-provenance-'))
  try {
    const provenance = JSON.parse(await readFile(path.join(rootDir, 'api/jobs/.generated.json'), 'utf8'))
    const original = '# Keep the original README on validation failure\n'
    await writeFile(path.join(fixtureDir, 'README.md'), original)
    const mismatches = [
      { package: '@nestarc/outbox' },
      { slug: 'outbox' },
      { repository: 'outbox' },
      { version: '0.3.1' },
      { tag: 'v0.3.1' },
      { commit: 'main' },
    ]
    for (const mismatch of mismatches) {
      await writeFile(path.join(fixtureDir, '.generated.json'), JSON.stringify({ ...provenance, ...mismatch }))
      await assert.rejects(() => enrichApiNavigation(fixtureDir, 'jobs'), /Jobs API provenance/)
      assert.equal(await readFile(path.join(fixtureDir, 'README.md'), 'utf8'), original)
    }
    await writeFile(path.join(fixtureDir, '.generated.json'), 'null')
    await assert.rejects(() => enrichApiNavigation(fixtureDir, 'jobs'), /must be a JSON object/)
    assert.equal(await readFile(path.join(fixtureDir, 'README.md'), 'utf8'), original)
  } finally {
    await rm(fixtureDir, { recursive: true, force: true })
  }
})

test('data-subject regeneration publishes maintained guides without upstream planning attachments', async () => {
  const fixtureDir = await mkdtemp(path.join(os.tmpdir(), 'data-subject-api-navigation-'))
  try {
    const generator = await readFile(path.join(rootDir, 'scripts/generate-api-docs.sh'), 'utf8')
    assert.match(generator, /if [^\n]*\[ "\$PKG" = "data-subject" \][^\n]*; then\s+TYPEDOC_OPTIONS\+=\(--readme none --entryFileName modules\)/)
    const provenance = await readFile(path.join(rootDir, 'api/data-subject/.generated.json'), 'utf8')
    const signatures = '# Runtime signatures\n\n```ts\nclass DataSubjectService {}\n```\n'
    const lint = '# Lint signatures\n'
    const modules = '# @nestarc/data-subject\n\n## Modules\n\n- [index](index.md)\n- [lint](lint.md)\n'
    await writeFile(path.join(fixtureDir, '.generated.json'), provenance)
    await writeFile(path.join(fixtureDir, 'index.md'), signatures)
    await writeFile(path.join(fixtureDir, 'lint.md'), lint)
    await writeFile(path.join(fixtureDir, 'modules.md'), modules)

    assert.equal(await enrichApiNavigation(fixtureDir, 'data-subject'), 2)
    const readme = await readFile(path.join(fixtureDir, 'README.md'), 'utf8')
    assert.ok(readme.startsWith(`# @nestarc/data-subject ${JSON.parse(provenance).version} release source\n`))
    for (const guide of ['installation', 'policy-model', 'export-erase', 'execution', 'migration']) {
      assert.ok(readme.includes(`/packages/data-subject/${guide}`))
    }
    assert.doesNotMatch(readme, /_media|support-proposal|market-positioning|\/blob\/[a-f0-9]+\/README\.md/)
    await enrichApiNavigation(fixtureDir, 'data-subject')
    assert.equal(await readFile(path.join(fixtureDir, 'README.md'), 'utf8'), readme)
    assert.equal(await readFile(path.join(fixtureDir, 'index.md'), 'utf8'), signatures)
    assert.equal(await readFile(path.join(fixtureDir, 'lint.md'), 'utf8'), lint)
    assert.equal(await readFile(path.join(fixtureDir, '.generated.json'), 'utf8'), provenance)
    assert.equal(await readFile(path.join(fixtureDir, 'modules.md'), 'utf8'), enrichApiModules(modules, 'data-subject'))
  } finally {
    await rm(fixtureDir, { recursive: true, force: true })
  }
})

test('data-subject refuses unexpected generated files before changing any navigation', async () => {
  const fixtureDir = await mkdtemp(path.join(os.tmpdir(), 'data-subject-api-private-output-'))
  try {
    const provenance = await readFile(path.join(rootDir, 'api/data-subject/.generated.json'), 'utf8')
    const readme = '# Preserve on failed validation\n'
    const modules = '# @nestarc/data-subject\n\n## Modules\n\n- [index](index.md)\n- [lint](lint.md)\n'
    await writeFile(path.join(fixtureDir, '.generated.json'), provenance)
    await writeFile(path.join(fixtureDir, 'README.md'), readme)
    await writeFile(path.join(fixtureDir, 'index.md'), '# Runtime\n')
    await writeFile(path.join(fixtureDir, 'lint.md'), '# Lint\n')
    await writeFile(path.join(fixtureDir, 'modules.md'), modules)
    for (const name of ['_media', 'p2-support-proposal.md', 'renamed-internal-plan.md']) {
      const unexpectedPath = path.join(fixtureDir, name)
      if (name === '_media') {
        await mkdir(unexpectedPath)
        await writeFile(path.join(unexpectedPath, 'proposal.md'), 'Private fixture\n')
      } else {
        await writeFile(unexpectedPath, 'Private fixture\n')
      }
      await assert.rejects(enrichApiNavigation(fixtureDir, 'data-subject'), /unapproved file/)
      assert.equal(await readFile(path.join(fixtureDir, 'README.md'), 'utf8'), readme)
      assert.equal(await readFile(path.join(fixtureDir, 'modules.md'), 'utf8'), modules)
      await rm(unexpectedPath, { recursive: true })
    }
    await writeFile(path.join(fixtureDir, '.generated.json'), JSON.stringify({ ...JSON.parse(provenance), commit: 'main' }))
    await assert.rejects(enrichApiNavigation(fixtureDir, 'data-subject'), /immutable commit/)
    assert.equal(await readFile(path.join(fixtureDir, 'README.md'), 'utf8'), readme)
    assert.equal(await readFile(path.join(fixtureDir, 'modules.md'), 'utf8'), modules)
  } finally {
    await rm(fixtureDir, { recursive: true, force: true })
  }
})

test('generation applies maintained navigation before merged API validation', async () => {
  const generator = await readFile(path.join(rootDir, 'scripts/generate-api-docs.sh'), 'utf8')
  const enrichCommand = 'node "$SCRIPT_DIR/enrich-api-navigation.mjs" "$OUT_DIR" "$PKG"'
  const enrichOffset = generator.indexOf(enrichCommand)
  assert.ok(enrichOffset !== -1)
  assert.ok(enrichOffset < generator.indexOf('API_DOCS_DIR="$VALIDATION_API_DIR" node "$API_VALIDATOR"'))
})

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

test('normalizes version anchors without redirecting upgrades to another release', async () => {
  const fixtureDir = path.join(rootDir, '.typedoc-work', 'api', `release-anchor-fixture-${process.pid}`)

  try {
    await mkdir(fixtureDir, { recursive: true })
    const markdownPath = path.join(fixtureDir, 'README.md')
    await writeFile(markdownPath, [
      '# Release upgrades',
      '',
      '[Old upgrade](#upgrading-to-030)',
      '[Current upgrade](#upgrading-to-040)',
      '[Later upgrade](#upgrading-to-0140)',
      '[Existing canonical link](#upgrading-to-0-4-0)',
      '[Missing release](#upgrading-to-050)',
      '',
      '## Upgrading to 0.3.0',
      '',
      '## Upgrading to 0.4.0',
      '',
      '## Upgrading to 0.14.0',
      '',
    ].join('\n'))
    const indexPath = path.join(fixtureDir, 'index.md')
    await writeFile(indexPath, '# API\n\n[Current upgrade](README.md#upgrading-to-040)\n')

    await execFileAsync(process.execPath, ['scripts/fix-api-anchors.mjs', fixtureDir], { cwd: rootDir })

    const updated = await readFile(markdownPath, 'utf8')
    assert.match(updated, /\[Old upgrade\]\(#upgrading-to-0-3-0\)/)
    assert.match(updated, /\[Current upgrade\]\(#upgrading-to-0-4-0\)/)
    assert.match(updated, /\[Later upgrade\]\(#upgrading-to-0-14-0\)/)
    assert.match(updated, /\[Existing canonical link\]\(#upgrading-to-0-4-0\)/)
    // Leave unknown releases unresolved for validation; never guess a different release.
    assert.match(updated, /\[Missing release\]\(#upgrading-to-050\)/)
    assert.match(await readFile(indexPath, 'utf8'), /\[Current upgrade\]\(README.md#upgrading-to-0-4-0\)/)

    await execFileAsync(process.execPath, ['scripts/fix-api-anchors.mjs', fixtureDir], { cwd: rootDir })
    assert.equal(await readFile(markdownPath, 'utf8'), updated)
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

    await mkdir(path.join(fixtureDir, 'prisma'), { recursive: true })
    await mkdir(path.join(fixtureDir, 'src', 'sql'), { recursive: true })
    await mkdir(path.join(fixtureDir, 'sql'), { recursive: true })
    const assets = [
      './prisma/schema.example.prisma',
      './prisma/prisma.config.example.ts',
      './src/sql/upgrade-to-current.sql',
      './sql/init.sql',
    ]
    for (const asset of assets) await writeFile(path.join(fixtureDir, asset), '')
    const exportsWithAssets = {
      '.': './dist/main.js',
      ...Object.fromEntries(assets.map((asset) => [asset, asset])),
    }
    await writeFile(path.join(fixtureDir, 'package.json'), JSON.stringify({ exports: exportsWithAssets }))
    assert.deepEqual(listPackageEntryPoints(fixtureDir), ['src/main.ts'])
    await rm(path.join(fixtureDir, assets[0]))
    assert.throws(() => listPackageEntryPoints(fixtureDir), /no matching TypeScript source/)
    await writeFile(path.join(fixtureDir, 'package.json'), JSON.stringify({
      exports: { '.': './dist/main.js', './missing-runtime': './dist/missing.js' },
    }))
    assert.throws(() => listPackageEntryPoints(fixtureDir), /missing-runtime/)

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

test('copied API media links retain immutable source paths, including table links', async () => {
  const { rebaseApiMediaLinks } = await import('../scripts/rebase-api-media-links.mjs')
  const fixtureDir = path.join(rootDir, '.typedoc-work', `media-fixture-${process.pid}`)
  const sourceDir = path.join(fixtureDir, 'source')
  const outputDir = path.join(fixtureDir, 'output')
  const source = '# Compatibility\n\n[Root](../README.md#support)\n\n| Target |\n| --- |\n| [ADR](adr/policy.md) |\n\n`[Example](missing.md)`\n\n```md\n[Code](missing.md)\n```\n'
  try {
    await mkdir(path.join(sourceDir, 'docs', 'adr'), { recursive: true })
    await mkdir(path.join(outputDir, '_media'), { recursive: true })
    await writeFile(path.join(sourceDir, 'docs', 'compatibility.md'), source)
    await writeFile(path.join(sourceDir, 'docs', 'adr', 'policy.md'), '# Policy\n')
    await writeFile(path.join(sourceDir, 'README.md'), '# Support\n')
    const output = path.join(outputDir, '_media', 'compatibility.md')
    await writeFile(output, source)
    const options = { sourceDir, outputDir, repository: 'example', commit: 'a'.repeat(40) }
    rebaseApiMediaLinks(options)
    const rebased = await readFile(output, 'utf8')
    assert.ok(rebased.includes(`https://github.com/nestarc/example/blob/${options.commit}/README.md#support`))
    assert.ok(rebased.includes(`https://github.com/nestarc/example/blob/${options.commit}/docs/adr/policy.md`))
    assert.match(rebased, /`\[Example\]\(missing.md\)`/)
    assert.match(rebased, /```md\n\[Code\]\(missing.md\)\n```/)
    await writeFile(output, source + '\n[Unresolved](missing.md)\n')
    assert.throws(() => rebaseApiMediaLinks(options), /unresolved source link/)
  } finally {
    await rm(fixtureDir, { recursive: true, force: true })
  }
})


test('feature-flag release API uses maintained guides instead of duplicated release media', async () => {
  const generator = await readFile(path.join(rootDir, 'scripts/generate-api-docs.sh'), 'utf8')
  const provenance = JSON.parse(await readFile(path.join(rootDir, 'api/feature-flag/.generated.json'), 'utf8'))
  const releaseReadme = await readFile(path.join(rootDir, 'api/feature-flag/README.md'), 'utf8')
  const publicApi = await readFile(path.join(rootDir, 'api/feature-flag/index.md'), 'utf8')
  assert.match(generator, /if [^\n]*\[ "\$PKG" = "feature-flag" \][^\n]*; then\s+TYPEDOC_OPTIONS\+=\(--readme none --entryFileName modules\)/)
  assert.match(generator, /Signatures and source links describe this published release/)
  assert.equal(provenance.version, '0.6.0')
  assert.equal(provenance.tag, 'v0.6.0')
  assert.match(releaseReadme, new RegExp(provenance.commit))
  assert.match(releaseReadme, /agent guide and upgrade guidance/)
  assert.match(publicApi, /Published 0\.6\.0 API/)
  await assert.rejects(readFile(path.join(rootDir, 'api/feature-flag/_media/basic-guard/README.md')), { code: 'ENOENT' })
})
