import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { apiKeyIntegrationContext, apiNavigation } from '../data/api-navigation.mjs'
import { getPackage } from '../data/package-catalog.mjs'

export const contextStart = '<!-- api-context:start -->'
export const contextEnd = '<!-- api-context:end -->'

function withoutContext(markdown) {
  const start = markdown.indexOf(contextStart)
  const end = markdown.indexOf(contextEnd)
  if (start === -1 && end === -1) return markdown
  if (start === -1 || end < start || markdown.indexOf(contextStart, start + 1) !== -1 ||
    markdown.indexOf(contextEnd, end + 1) !== -1) {
    throw new Error('Malformed API navigation context markers')
  }
  return markdown.slice(0, start) + markdown.slice(end + contextEnd.length).replace(/^\n\n/, '')
}

function insertContext(markdown, content, heading) {
  const clean = withoutContext(markdown)
  const offset = clean.indexOf(heading)
  if (offset === -1) throw new Error(`Missing generated API heading: ${heading}`)
  return `${clean.slice(0, offset)}${contextStart}\n${content.trim()}\n${contextEnd}\n\n${clean.slice(offset)}`
}

export function enrichApiModules(markdown, slug) {
  const navigation = apiNavigation[slug]
  const pkg = getPackage(slug)
  if (!navigation || !pkg) throw new Error(`No API navigation configured for ${slug}`)

  const seen = new Set()
  const annotated = withoutContext(markdown).replace(
    /^- \[[^\n]+?\]\(([^)\n]+)\)(?: —[^\n]*)?$/gm,
    (_, target) => {
      const description = navigation.modules[target]
      if (!description || seen.has(target)) {
        throw new Error(`Unexpected or duplicate ${slug} API module: ${target}`)
      }
      seen.add(target)
      const subpath = target === 'index.md' ? '' : `/${target.replace(/\.md$/, '')}`
      return `- [\`@nestarc/${slug}${subpath}\`](${target}) — ${description}`
    },
  )
  for (const target of Object.keys(navigation.modules)) {
    if (!seen.has(target)) throw new Error(`Missing ${slug} API module: ${target}`)
  }

  const [guideLabel, guidePath] = navigation.guide
  const intro = `API reference for \`@nestarc/${slug}\` **${pkg.version}**. ${pkg.homeSummary.en}

## Start here

Install the documented release with \`npm install @nestarc/${slug}@${pkg.version}\`. Follow [Installation](/packages/${slug}/installation) for peer dependencies and application setup, then read [${guideLabel}](/packages/${slug}/${guidePath}) for usage decisions and examples.

Choose an import path below to find its exported signatures and types. The root package contains the main application APIs; named subpaths group the additional integrations and utilities. The reference is generated from the published release, with source links pinned to its commit.
`
  return insertContext(annotated, intro, '## Modules\n')
}

export function enrichApiKeyIntegration(markdown) {
  return insertContext(markdown, apiKeyIntegrationContext, '## Functions\n')
}

export async function enrichApiNavigation(outputDir, slug) {
  if (!getPackage(slug)) throw new Error(`Unknown API package: ${slug}`)
  const updates = []
  if (apiNavigation[slug]) {
    const filePath = path.join(outputDir, 'modules.md')
    updates.push([filePath, enrichApiModules(await readFile(filePath, 'utf8'), slug)])
  }
  if (slug === 'rbac') {
    const filePath = path.join(outputDir, 'integrations', 'api-keys.md')
    updates.push([filePath, enrichApiKeyIntegration(await readFile(filePath, 'utf8'))])
  }
  // Validate all targeted pages before writing any of them.
  for (const [filePath, content] of updates) await writeFile(filePath, content)
  return updates.length
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [outputDir, slug] = process.argv.slice(2)
  if (!outputDir || !slug || process.argv.length !== 4) {
    throw new Error('Usage: node scripts/enrich-api-navigation.mjs <package-output-dir> <slug>')
  }
  const updated = await enrichApiNavigation(outputDir, slug)
  console.log(`Enriched ${updated} API navigation page(s) for @nestarc/${slug}`)
}
