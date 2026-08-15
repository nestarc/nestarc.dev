import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import test from 'node:test'
import { apiPackageTsv } from '../scripts/list-api-packages.mjs'

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
    await writeFile(markdownPath, '# Fixture\n\n[Broken](#section-7)\n\n## Section\n')

    const { stdout } = await execFileAsync(
      process.execPath,
      ['scripts/fix-api-anchors.mjs', fixtureDir],
      { cwd: rootDir },
    )

    assert.match(stdout, /Normalized 1 generated API anchor link/)
    assert.match(await readFile(markdownPath, 'utf8'), /\[Broken\]\(#section\)/)
  } finally {
    await rm(fixtureDir, { recursive: true, force: true })
  }
})
