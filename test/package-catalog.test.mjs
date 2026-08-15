import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import {
  adoptionStages,
  packageCatalog,
  packageCategories,
  packageNavGroups,
  toolCatalog,
} from '../data/package-catalog.mjs'
import {
  PackageCatalogValidationError,
  validatePackageCatalog,
} from '../data/validate-package-catalog.mjs'
import {
  PackageCatalogRepositoryError,
  validatePackageCatalogRepository,
} from '../scripts/validate-package-catalog.mjs'

function validFixture() {
  return {
    packageCategories: [
      { id: 'foundation', label: 'Foundation' },
    ],
    adoptionStages: [
      { step: 1, label: 'Foundation', useWhen: 'Start with a safe foundation.' },
    ],
    packageNavGroups: [
      { label: 'Packages', labelKo: '패키지', categories: ['foundation'] },
    ],
    packageCatalog: [
      {
        slug: 'alpha-package',
        repository: 'nestjs-alpha-package',
        version: '1.2.3-beta.1+build.5',
        supportStatus: 'Supported',
        apiStatus: 'Generated',
        category: 'foundation',
        adoptionStage: 1,
        homeSummary: {
          en: 'An English package summary.',
          ko: '한국어 패키지 요약입니다.',
        },
        solves: 'A package problem.',
        startHere: 'You need the package behavior.',
        requiresCodeChanges: 'Yes (module wiring)',
        dependsOn: '—',
      },
    ],
    toolCatalog: [
      {
        slug: 'scanner-tool',
        repository: 'scanner-tool',
        version: '0.2.0',
        supportStatus: 'Labs',
        homeSummary: {
          en: 'An English tool summary.',
          ko: '한국어 도구 요약입니다.',
        },
        purpose: 'Scan project inputs.',
      },
    ],
  }
}

function expectInvalid(input, patterns) {
  assert.throws(
    () => validatePackageCatalog(input),
    (error) => {
      assert.ok(error instanceof PackageCatalogValidationError)
      for (const pattern of patterns) assert.match(error.message, pattern)
      return true
    },
  )
}

test('accepts the checked-in catalog and does not mutate its input', () => {
  const input = {
    packageCategories,
    adoptionStages,
    packageNavGroups,
    packageCatalog,
    toolCatalog,
  }
  const fixture = validFixture()
  const before = structuredClone(fixture)

  assert.equal(validatePackageCatalog(input), true)
  assert.equal(validatePackageCatalog(fixture), true)
  assert.deepEqual(fixture, before)
  assert.equal(Object.isFrozen(packageCatalog), true)
  assert.equal(Object.isFrozen(packageCatalog[0]), true)
  assert.equal(Object.isFrozen(packageCatalog[0].homeSummary), true)
})

test('rejects unsafe path identifiers and control characters', () => {
  const fixture = validFixture()
  fixture.packageCatalog[0].slug = '../alpha'
  fixture.packageCatalog[0].repository = 'repo\nname'
  fixture.toolCatalog[0].slug = 'tools/scanner'

  expectInvalid(fixture, [
    /packageCatalog\[0\]\.slug must be a path-safe lowercase identifier/,
    /packageCatalog\[0\]\.repository must not contain control characters/,
    /toolCatalog\[0\]\.slug must be a path-safe lowercase identifier/,
  ])
})

test('rejects duplicate package, tool, and cross-catalog identities', () => {
  const packageDuplicates = validFixture()
  packageDuplicates.packageCatalog.push({
    ...structuredClone(packageDuplicates.packageCatalog[0]),
  })
  expectInvalid(packageDuplicates, [
    /duplicate catalog slug: alpha-package/,
    /duplicate catalog repository: nestjs-alpha-package/,
  ])

  const toolDuplicates = validFixture()
  toolDuplicates.toolCatalog.push({ ...structuredClone(toolDuplicates.toolCatalog[0]) })
  expectInvalid(toolDuplicates, [
    /duplicate catalog slug: scanner-tool/,
    /duplicate catalog repository: scanner-tool/,
  ])

  const crossCatalog = validFixture()
  crossCatalog.toolCatalog[0].slug = crossCatalog.packageCatalog[0].slug
  crossCatalog.toolCatalog[0].repository = crossCatalog.packageCatalog[0].repository
  expectInvalid(crossCatalog, [
    /duplicate catalog slug: alpha-package/,
    /duplicate catalog repository: nestjs-alpha-package/,
  ])
})

test('rejects selector collisions between another item slug and repository', () => {
  const fixture = validFixture()
  fixture.packageCatalog.push({
    ...structuredClone(fixture.packageCatalog[0]),
    slug: fixture.packageCatalog[0].repository,
    repository: 'second-repository',
  })

  expectInvalid(fixture, [
    /catalog selector token nestjs-alpha-package is shared by packageCatalog\[0\] and packageCatalog\[1\]/,
  ])
})

test('rejects invalid category and navigation coverage', () => {
  const fixture = validFixture()
  fixture.packageCategories.push(
    { id: 'foundation', label: 'Foundation duplicate' },
    { id: 'unused', label: 'Unused' },
  )
  fixture.packageCatalog[0].category = 'missing-category'
  fixture.packageNavGroups[0].labelKo = ''
  fixture.packageNavGroups[0].categories = ['foundation', 'foundation', 'unknown']

  expectInvalid(fixture, [
    /duplicate package category id: foundation/,
    /references unknown category: missing-category/,
    /packageNavGroups\[0\]\.labelKo must be a non-empty string/,
    /package category has no packages: unused/,
    /package nav category appears more than once: foundation/,
    /references unknown category: unknown/,
    /package category is missing from navigation: unused/,
  ])
})

test('rejects invalid, duplicate, unknown, and unused adoption stages', () => {
  const fixture = validFixture()
  fixture.adoptionStages.push(
    { step: 1, label: 'Duplicate step', useWhen: 'Never.' },
    { step: 2, label: 'Unused step', useWhen: 'Later.' },
  )
  fixture.packageCatalog[0].adoptionStage = 99

  expectInvalid(fixture, [
    /duplicate adoption step: 1/,
    /must keep adoption stages contiguous and ordered/,
    /references unknown step: 99/,
    /adoption step has no packages: 2/,
  ])
})

test('rejects adoption stage sequences with gaps', () => {
  const fixture = validFixture()
  fixture.adoptionStages[0].step = 2
  fixture.packageCatalog[0].adoptionStage = 2

  expectInvalid(fixture, [/adoption steps must be contiguous and start at 1/])
})

test('rejects ranges, invalid enums, and incomplete localized copy', () => {
  const fixture = validFixture()
  fixture.packageCatalog[0].version = '^1.2.3'
  fixture.packageCatalog[0].supportStatus = 'Stable'
  fixture.packageCatalog[0].apiStatus = 'Automatic'
  fixture.packageCatalog[0].homeSummary.ko = ''
  fixture.packageCatalog[0].requiresCodeChanges = ''
  fixture.toolCatalog[0].version = '01.2.3'
  fixture.toolCatalog[0].supportStatus = 'Preview'

  expectInvalid(fixture, [
    /version must be an exact semantic version/,
    /supportStatus must be one of: Supported, Preview/,
    /apiStatus must be one of: Generated, Curated/,
    /homeSummary\.ko must be a non-empty string/,
    /requiresCodeChanges must be a non-empty string/,
    /toolCatalog\[0\]\.version must be an exact semantic version/,
    /toolCatalog\[0\]\.supportStatus must be one of: Labs/,
  ])
})

test('rejects unknown catalog and localized-copy fields', () => {
  const fixture = validFixture()
  fixture.packageCatlog = []
  fixture.packageCatalog[0].versoin = '1.2.3'
  fixture.packageCatalog[0].homeSummary.fr = 'Résumé.'
  fixture.packageNavGroups[0].labelFr = 'Paquets'

  expectInvalid(fixture, [
    /catalog must contain exactly:/,
    /packageCatalog\[0\] must contain exactly:/,
    /packageCatalog\[0\]\.homeSummary must contain exactly: en, ko/,
    /packageNavGroups\[0\] must contain exactly: label, labelKo, categories/,
  ])
})

test('reports malformed collections and entries instead of throwing a type error', () => {
  expectInvalid(null, [/catalog must be a plain object/])
  expectInvalid(undefined, [
    /packageCategories must be an array/,
    /adoptionStages must be an array/,
    /packageNavGroups must be an array/,
    /packageCatalog must be an array/,
    /toolCatalog must be an array/,
  ])

  const fixture = validFixture()
  fixture.packageCatalog[0] = null
  expectInvalid(fixture, [/packageCatalog\[0\] must be a plain object/])
})

async function writeEntry(rootDir, section, slug, content = '# Entry\n') {
  const directory = path.join(rootDir, section, slug)
  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, 'index.md'), content)
}

async function withTemporaryRepository(callback) {
  const rootDir = await mkdtemp(path.join(tmpdir(), 'nestarc-catalog-test-'))
  try {
    await callback(rootDir)
  } finally {
    await rm(rootDir, { recursive: true, force: true })
  }
}

test('accepts the checked-in package, API, and tool route structure', async () => {
  assert.equal(await validatePackageCatalogRepository(), true)
})

test('repository contract reports missing, empty, and unexpected routes', async () => {
  await withTemporaryRepository(async (rootDir) => {
    const packages = [{ slug: 'alpha-package' }]
    const tools = [{ slug: 'scanner-tool' }]

    await writeEntry(rootDir, 'packages', 'alpha-package')
    await writeEntry(rootDir, 'packages', 'orphan-package')
    await writeFile(path.join(rootDir, 'packages', 'orphan-page.md'), '# Orphan\n')
    await writeEntry(rootDir, 'api', 'orphan-api')
    await writeFile(path.join(rootDir, 'api', 'alpha-package.md'), '# Duplicate route\n')
    await writeEntry(rootDir, 'tools', 'scanner-tool', '')

    await assert.rejects(
      validatePackageCatalogRepository({ rootDir, packages, tools }),
      (error) => {
        assert.ok(error instanceof PackageCatalogRepositoryError)
        assert.match(error.message, /unexpected package guide directories: orphan-package/)
        assert.match(error.message, /unexpected top-level package guide Markdown routes: orphan-page\.md/)
        assert.match(error.message, /missing API directories: alpha-package/)
        assert.match(error.message, /unexpected API directories: orphan-api/)
        assert.match(error.message, /unexpected top-level API Markdown routes: alpha-package\.md/)
        assert.match(error.message, /missing or empty API entry: api\/alpha-package\/index\.md/)
        assert.match(error.message, /missing or empty tool entry: tools\/scanner-tool\/index\.md/)
        return true
      },
    )
  })
})
