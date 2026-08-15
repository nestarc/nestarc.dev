import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import test from 'node:test'

const execFileAsync = promisify(execFile)
const rootDir = path.resolve(import.meta.dirname, '..')

test('rejects every noncanonical TypeDoc source-provenance link', async () => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'nestarc-api-validator-'))
  const temporaryApi = path.join(temporaryRoot, 'api')

  try {
    await cp(path.join(rootDir, 'api'), temporaryApi, { recursive: true })
    const target = path.join(temporaryApi, 'tenancy', 'index.md')
    const original = await readFile(target, 'utf8')
    const mutated = original.replace(
      'https://github.com/nestarc/',
      'https://github.com/wrong-org/',
    )
    assert.notEqual(mutated, original)
    await writeFile(target, mutated)

    await assert.rejects(
      execFileAsync(process.execPath, ['scripts/validate-api-docs.mjs'], {
        cwd: rootDir,
        env: { ...process.env, API_DOCS_DIR: temporaryApi },
      }),
      (error) => {
        assert.match(`${error.stdout}\n${error.stderr}`, /noncanonical TypeDoc source link/)
        return true
      },
    )
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true })
  }
})

test('rejects a local link whose VitePress heading anchor does not exist', async () => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'nestarc-api-anchor-validator-'))
  const temporaryApi = path.join(temporaryRoot, 'api')

  try {
    await cp(path.join(rootDir, 'api'), temporaryApi, { recursive: true })
    const target = path.join(temporaryApi, 'tenancy', 'index.md')
    const original = await readFile(target, 'utf8')
    await writeFile(target, `${original}\n[Broken local anchor](#anchor-that-does-not-exist)\n`)

    await assert.rejects(
      execFileAsync(process.execPath, ['scripts/validate-api-docs.mjs'], {
        cwd: rootDir,
        env: { ...process.env, API_DOCS_DIR: temporaryApi },
      }),
      (error) => {
        assert.match(`${error.stdout}\n${error.stderr}`, /missing local anchor: #anchor-that-does-not-exist/)
        return true
      },
    )
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true })
  }
})
