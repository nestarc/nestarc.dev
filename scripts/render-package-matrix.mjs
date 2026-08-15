import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { packageCatalog, packageCategories } from '../data/package-catalog.mjs'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const packageIndexPath = path.join(rootDir, 'packages', 'index.md')
export const packageMatrixStart = '<!-- package-matrix:start -->'
export const packageMatrixEnd = '<!-- package-matrix:end -->'

function escapeMarkdownCell(value) {
  return String(value)
    .replaceAll('\\', '\\\\')
    .replaceAll('|', '\\|')
    .replaceAll('\n', ' ')
}

function packageCell(pkg) {
  return `<span data-catalog-surface="package-matrix" data-catalog-package="${pkg.slug}" data-version="${pkg.version}" data-status="${pkg.supportStatus}"><a href="/packages/${pkg.slug}/"><code>@nestarc/${pkg.slug}</code></a></span>`
}

export function renderPackageMatrixMarkdown() {
  const sections = packageCategories.map((category) => {
    const rows = packageCatalog
      .filter((pkg) => pkg.category === category.id)
      .map((pkg) => `| ${packageCell(pkg)} | ${pkg.supportStatus} | \`${pkg.version}\` | ${escapeMarkdownCell(pkg.solves)} | ${escapeMarkdownCell(pkg.startHere)} |`)

    return [
      `### ${category.label}`,
      '',
      '| Package | Status | Version | Solves | Start here |',
      '| --- | --- | --- | --- | --- |',
      ...rows,
    ].join('\n')
  })

  return [
    ...sections.flatMap((section, index) => index === 0 ? [section] : ['', section]),
    '',
  ].join('\n')
}

export function replacePackageMatrix(markdown) {
  const start = markdown.indexOf(packageMatrixStart)
  const end = markdown.indexOf(packageMatrixEnd)
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('packages/index.md is missing package matrix markers')
  }

  const before = markdown.slice(0, start + packageMatrixStart.length)
  const after = markdown.slice(end)
  return `${before}\n${renderPackageMatrixMarkdown()}${after}`
}

async function main() {
  const current = await readFile(packageIndexPath, 'utf8')
  await writeFile(packageIndexPath, replacePackageMatrix(current))
  console.log(`Rendered ${path.relative(rootDir, packageIndexPath)} package matrix`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main()
}
