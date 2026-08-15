import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import test from 'node:test'
import { apiPackageTsv } from '../scripts/list-api-packages.mjs'
import { listPackageEntryPoints } from '../scripts/list-package-entry-points.mjs'
import { verifyReleaseProvenance } from '../scripts/verify-release-provenance.mjs'

const execFileAsync = promisify(execFile)
const rootDir = path.resolve(import.meta.dirname, '..')

test('renders validated API package rows as generator TSV', () => {
  assert.equal(
    apiPackageTsv([{
      repository: 'nestjs-alpha',
      slug: 'alpha',
      version: '1.2.3',
    }]),
    'nestjs-alpha\talpha\t1.2.3\tv1.2.3',
  )
  assert.throws(
    () => apiPackageTsv([{
      repository: 'nestjs-alpha\nunsafe',
      slug: 'alpha',
      version: '1.2.3',
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
        '',
        '`[Inline example](#section-7)`',
        '',
        '```md',
        '[Fenced example](#section-7)',
        '```',
        '',
        '## Section',
        '',
      ].join('\n'),
    )

    const { stdout } = await execFileAsync(
      process.execPath,
      ['scripts/fix-api-anchors.mjs', fixtureDir],
      { cwd: rootDir },
    )

    assert.match(stdout, /Normalized 1 generated API anchor link/)
    const updated = await readFile(markdownPath, 'utf8')
    assert.match(updated, /\[Broken\]\(#section\)/)
    assert.match(updated, /`\[Inline example\]\(#section-7\)`/)
    assert.match(updated, /```md\n\[Fenced example\]\(#section-7\)\n```/)
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
  } finally {
    await rm(fixtureDir, { recursive: true, force: true })
  }
})

test('requires npm gitHead to match the immutable release tag commit', () => {
  const commit = 'a'.repeat(40)
  assert.doesNotThrow(() => verifyReleaseProvenance(
    { version: '1.2.3', gitHead: commit },
    '1.2.3',
    commit,
    '@nestarc/fixture',
  ))
  assert.throws(
    () => verifyReleaseProvenance(
      { version: '1.2.3', gitHead: 'b'.repeat(40) },
      '1.2.3',
      commit,
      '@nestarc/fixture',
    ),
    /does not match release tag commit/,
  )
  assert.throws(
    () => verifyReleaseProvenance(
      { version: '1.2.3' },
      '1.2.3',
      commit,
      '@nestarc/fixture',
    ),
    /missing a valid gitHead/,
  )
})
