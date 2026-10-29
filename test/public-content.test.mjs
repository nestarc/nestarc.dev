import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import test from 'node:test'
import { isPrivateContentPath, validatePublicContent } from '../scripts/validate-public-content.mjs'

const execFileAsync = promisify(execFile)
const scriptPath = path.resolve(import.meta.dirname, '../scripts/validate-public-content.mjs')

async function fixture(run) {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), 'nestarc-public-content-'))
  const write = async (relativePath, content = '# Fixture\n') => {
    const target = path.join(rootDir, relativePath)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, content)
  }
  const git = (...args) => execFileAsync('git', ['-C', rootDir, ...args])
  try {
    await git('init', '--quiet')
    await run({ rootDir, write, git })
  } finally {
    await rm(rootDir, { recursive: true, force: true })
  }
}

test('public content accepts public guides, code examples and ignored local working notes', async () => {
  await fixture(async ({ rootDir, write, git }) => {
    await write('.gitignore', '.notes/\ndocs/seo-reports/\nnode_modules/\n')
    await write('README.md', '# Public guide\n\n[Storage guide](guide/private-artifacts.md)\n\n' +
      '`docs/SEO_DIRECTION.md` belongs in private storage.\n\n' +
      '```md\n[Policy example](docs/SEO_DIRECTION.md)\n```\n')
    await write('guide/private-artifacts.md')
    await write('.notes/handover.md')
    await write('docs/seo-reports/report.md')
    await write('node_modules/p2-support-proposal.md')
    await git('add', '.gitignore', 'README.md', 'guide')
    const result = await validatePublicContent({ rootDir })
    assert.deepEqual(result.issues, [])
    assert.equal(result.checkedFiles, 3)
    const { stdout } = await execFileAsync(process.execPath, [scriptPath, '--root', rootDir])
    assert.match(stdout, /Public content validation passed \(3 files\)/)
  })
})

test('force-added ignored private material fails publication validation', async () => {
  await fixture(async ({ rootDir, write, git }) => {
    const blocked = [
      '.notes/handover.md',
      'docs/SEO_DIRECTION.md',
      'docs/seo-reports/assets/report.png',
      'api/data-subject/_media/renamed-document.md',
    ]
    await write('.gitignore', '.notes/\ndocs/SEO_DIRECTION.md\ndocs/seo-reports/\napi/data-subject/_media/\n')
    for (const filename of blocked) await write(filename)
    await git('add', '--force', ...blocked)
    const { issues } = await validatePublicContent({ rootDir })
    assert.equal(issues.length, blocked.length)
    for (const filename of blocked) assert.ok(issues.some((issue) => issue.startsWith(`${filename}:`)))
    await assert.rejects(execFileAsync(process.execPath, [scriptPath, '--root', rootDir]), (error) => {
      assert.match(error.stderr, /Public content validation failed/)
      return true
    })
  })
})

test('untracked copied commercial proposals fail before they are staged', async () => {
  await fixture(async ({ rootDir, write }) => {
    await write('api/other/_media/p2-support-proposal.md')
    await write('copies/market-positioning-roadmap.md')
    const { issues } = await validatePublicContent({ rootDir })
    assert.equal(issues.length, 2)
    assert.ok(issues.some((issue) => issue.startsWith('api/other/_media/p2-support-proposal.md:')))
    assert.ok(issues.some((issue) => issue.startsWith('copies/market-positioning-roadmap.md:')))
  })
})

test('nested generated copies of handovers and SEO reports cannot bypass root exclusions', async () => {
  await fixture(async ({ rootDir, write }) => {
    const copied = [
      'api/other/_media/handover.md',
      'api/other/_media/.notes/renamed-note.md',
      'api/other/_media/seo-reports/result.md',
    ]
    for (const filename of copied) await write(filename)
    const { issues } = await validatePublicContent({ rootDir })
    assert.equal(issues.length, copied.length)
    for (const filename of copied) assert.ok(issues.some((issue) => issue.startsWith(`${filename}:`)))
  })
})

test('ignored files copied from public are checked independently of the Git inventory', async () => {
  await fixture(async ({ rootDir, write, git }) => {
    await write('.gitignore', 'p2-support-proposal.md\n.notes/\nseo-reports/\npublic/ignored.md\n')
    await write('public/p2-support-proposal.md')
    await write('public/.notes/handover.md')
    await write('public/seo-reports/assets/report.png')
    await write('public/ignored.md', '[Roadmap](../private/market-positioning-roadmap.md)\n')
    const inventory = await git('ls-files', '--cached', '--others', '--exclude-standard')
    assert.doesNotMatch(inventory.stdout, /public\//)
    const { issues } = await validatePublicContent({ rootDir })
    assert.equal(issues.length, 4)
    for (const filename of [
      'public/p2-support-proposal.md',
      'public/.notes/handover.md',
      'public/seo-reports/assets/report.png',
      'public/ignored.md',
    ]) assert.ok(issues.some((issue) => issue.startsWith(`${filename}:`)))
  })
})

test('public symlinks fail without following targets or tracked children below a linked directory', async () => {
  await fixture(async ({ rootDir, write, git }) => {
    await write('.gitignore', 'public/\n')
    await write('public/linked-directory/child.md')
    await git('add', '--force', 'public/linked-directory/child.md')
    await rm(path.join(rootDir, 'public/linked-directory'), { recursive: true })
    // A nonexistent target makes any accidental target traversal fail; the
    // validator should report only the publication input symlinks themselves.
    const missingTarget = path.join(rootDir, 'outside-does-not-exist')
    await symlink(missingTarget, path.join(rootDir, 'public/linked-directory'))
    await symlink(missingTarget, path.join(rootDir, 'public/benign-name.md'))
    await symlink(missingTarget, path.join(rootDir, 'public/p2-support-proposal.md'))
    const { issues } = await validatePublicContent({ rootDir })
    assert.equal(issues.length, 3)
    assert.ok(issues.some((issue) => issue.startsWith('public/linked-directory: symbolic links')))
    assert.ok(issues.some((issue) => issue.startsWith('public/benign-name.md: symbolic links')))
    assert.ok(issues.some((issue) => issue.startsWith('public/p2-support-proposal.md: private working material')))
    assert.ok(issues.every((issue) => !issue.includes('child.md')))
  })
})

test('a symlink replacing public itself cannot bypass publication validation', async () => {
  await fixture(async ({ rootDir, write, git }) => {
    await write('public/previously-tracked.md')
    await git('add', 'public/previously-tracked.md')
    await rm(path.join(rootDir, 'public'), { recursive: true })
    await symlink(path.join(rootDir, 'outside-does-not-exist'), path.join(rootDir, 'public'))
    const { issues } = await validatePublicContent({ rootDir })
    assert.deepEqual(issues, ['public: symbolic links are not allowed in public publication inputs'])
  })
})

test('tracked files removed during migration do not block the cleaned working tree', async () => {
  await fixture(async ({ rootDir, write, git }) => {
    await write('.notes/handover.md')
    await git('add', '.notes/handover.md')
    await rm(path.join(rootDir, '.notes/handover.md'))
    assert.deepEqual((await validatePublicContent({ rootDir })).issues, [])
  })
})

test('Markdown links and images cannot reintroduce local or upstream private-document references', async () => {
  await fixture(async ({ rootDir, write }) => {
    await write('guide/index.md', '# Guide\n\n' +
      '[SEO](../docs/SEO_DIRECTION.md#plan)\n\n' +
      '![Report](/docs/seo-reports/assets/report.png)\n\n' +
      '[Proposal](https://github.com/nestarc/data-subject/blob/abc/docs/%70%32-support-proposal.md)\n\n' +
      '[Private workspace](https://github.com/nestarc/nestarc.dev-internal)\n')
    const { issues } = await validatePublicContent({ rootDir })
    assert.equal(issues.length, 3)
    assert.ok(issues.every((issue) => issue.startsWith('guide/index.md: link to private working material:')))
  })
})

test('API staging path policy rejects copied private material while allowing public storage guides', () => {
  for (const filename of [
    'api/data-subject/_media/private-artifacts.md',
    'api/data-subject/_media.md',
    'api/other/_media/p2-support-proposal.md',
    'copied/SEO_DIRECTION.md',
    './docs/seo-reports/report.md',
    'api/other/_media/seo-reports/report.md',
    'api/other/_media/.notes/decisions.md',
    'api/other/_media/handover.md',
    'api\\other\\_media\\market-positioning-roadmap.md',
  ]) assert.equal(isPrivateContentPath(filename), true, filename)
  for (const filename of [
    'packages/data-subject/export-erase.md',
    'api/other/_media/private-artifacts.md',
    'api/data-subject/index.md',
    'docs/publication-policy.md',
  ]) assert.equal(isPrivateContentPath(filename), false, filename)
})

test('Git failures and invalid CLI arguments fail closed', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'nestarc-not-a-repository-'))
  try {
    await assert.rejects(validatePublicContent({ rootDir: directory }), /not a git repository/)
    await assert.rejects(execFileAsync(process.execPath, [scriptPath, '--root', directory]), (error) => {
      assert.match(error.stderr, /not a git repository/)
      assert.doesNotMatch(error.stdout, /validation passed/)
      return true
    })
    await assert.rejects(execFileAsync(process.execPath, [scriptPath, '--unknown']), (error) => {
      assert.match(error.stderr, /Usage:/)
      return true
    })
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
