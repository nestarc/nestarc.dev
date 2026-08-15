import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { packageCatalog, toolCatalog } from '../data/package-catalog.mjs'

const scriptPath = fileURLToPath(import.meta.url)
const defaultRootDir = path.resolve(path.dirname(scriptPath), '..')

export class PackageCatalogRepositoryError extends Error {
  constructor(issues) {
    super(`Package catalog repository validation failed:\n- ${issues.join('\n- ')}`)
    this.name = 'PackageCatalogRepositoryError'
    this.issues = issues
  }
}

async function nonEmptyFile(filePath) {
  try {
    const fileStat = await stat(filePath)
    return fileStat.isFile() && fileStat.size > 0
  } catch {
    return false
  }
}

async function sectionEntries(directory, label, issues) {
  try {
    const entries = await readdir(directory, { withFileTypes: true })
    return {
      directories: entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort(),
      topLevelMarkdown: entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md')
        .map((entry) => entry.name)
        .sort(),
    }
  } catch {
    issues.push(`missing or unreadable ${label} directory: ${directory}`)
    return { directories: [], topLevelMarkdown: [] }
  }
}

async function validateSection({ rootDir, directory, items, label }, issues) {
  const sectionDir = path.join(rootDir, directory)
  const { directories: actual, topLevelMarkdown } = await sectionEntries(
    sectionDir,
    label,
    issues,
  )
  const expected = items.map(({ slug }) => slug).sort()
  const expectedSet = new Set(expected)
  const actualSet = new Set(actual)

  const missing = expected.filter((slug) => !actualSet.has(slug))
  const unexpected = actual.filter((slug) => !expectedSet.has(slug))
  if (missing.length > 0) issues.push(`missing ${label} directories: ${missing.join(', ')}`)
  if (unexpected.length > 0) {
    issues.push(`unexpected ${label} directories: ${unexpected.join(', ')}`)
  }
  if (topLevelMarkdown.length > 0) {
    issues.push(
      `unexpected top-level ${label} Markdown routes: ${topLevelMarkdown.join(', ')}`,
    )
  }

  for (const { slug } of items) {
    const indexPath = path.join(sectionDir, slug, 'index.md')
    if (!await nonEmptyFile(indexPath)) {
      issues.push(`missing or empty ${label} entry: ${path.relative(rootDir, indexPath)}`)
    }
  }
}

export async function validatePackageCatalogRepository({
  rootDir = defaultRootDir,
  packages = packageCatalog,
  tools = toolCatalog,
} = {}) {
  const absoluteRoot = path.resolve(rootDir)
  const issues = []

  await validateSection({
    rootDir: absoluteRoot,
    directory: 'packages',
    items: packages,
    label: 'package guide',
  }, issues)
  await validateSection({
    rootDir: absoluteRoot,
    directory: 'api',
    items: packages,
    label: 'API',
  }, issues)
  await validateSection({
    rootDir: absoluteRoot,
    directory: 'tools',
    items: tools,
    label: 'tool',
  }, issues)

  if (issues.length > 0) throw new PackageCatalogRepositoryError(issues)
  return true
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    await validatePackageCatalogRepository()
    console.log(
      `Validated ${packageCatalog.length} packages and ${toolCatalog.length} tool${toolCatalog.length === 1 ? '' : 's'} against repository routes.`,
    )
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
