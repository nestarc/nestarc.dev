import { readdir, readFile, writeFile } from 'node:fs/promises'
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

export function renderJobsReleaseReadme(provenance) {
  const pkg = getPackage('jobs')
  const expected = {
    package: '@nestarc/jobs',
    slug: pkg.slug,
    repository: pkg.repository,
    version: pkg.version,
    tag: `v${pkg.version}`,
  }
  if (!provenance || typeof provenance !== 'object' || Array.isArray(provenance)) {
    throw new Error('Jobs API provenance must be a JSON object')
  }
  for (const [field, value] of Object.entries(expected)) {
    if (provenance[field] !== value) {
      throw new Error(`Jobs API provenance ${field} does not match the package catalog`)
    }
  }
  if (!/^[0-9a-f]{40}$/.test(provenance.commit ?? '')) {
    throw new Error('Jobs API provenance must contain an immutable commit')
  }
  const sourceUrl = `https://github.com/nestarc/${pkg.repository}/blob/${provenance.commit}/README.md`
  const releaseNote = pkg.version === '0.4.0'
    ? '\n\nThe original release README still calls 0.3.1 published and 0.4.0 unreleased. That status text is stale: the published package metadata and API provenance identify this release as **0.4.0**. Use the maintained guides below for current setup and operating instructions.'
    : ''
  return `# @nestarc/jobs ${pkg.version} release source

The API signatures and source links are generated from the immutable published release recorded in [the provenance file](https://github.com/nestarc/nestarc.dev/blob/main/api/jobs/.generated.json).

Read the [original release README](${sourceUrl}) for the upstream source documentation.${releaseNote}

## Start here

- [Installation](/packages/jobs/installation) — install the published release, its peers, and the application module.
- [Backends](/packages/jobs/backends) — choose local or BullMQ workers and configure roles, retention, and shutdown.
- [Testing](/packages/jobs/testing) — test handlers with the fake service and clock.
- [Outbox bridge](/packages/jobs/outbox-bridge) — publish committed outbox events into jobs with stable identities.
- [API signatures](./index.md) — browse the release-generated runtime contracts and source links.
`
}

export function renderDataSubjectReleaseReadme(provenance) {
  const pkg = getPackage('data-subject')
  const expected = {
    package: '@nestarc/data-subject',
    slug: pkg.slug,
    repository: pkg.repository,
    version: pkg.version,
    tag: `v${pkg.version}`,
  }
  if (!provenance || typeof provenance !== 'object' || Array.isArray(provenance)) {
    throw new Error('Data-subject API provenance must be a JSON object')
  }
  for (const [field, value] of Object.entries(expected)) {
    if (provenance[field] !== value) {
      throw new Error(`Data-subject API provenance ${field} does not match the package catalog`)
    }
  }
  if (!/^[0-9a-f]{40}$/.test(provenance.commit ?? '')) {
    throw new Error('Data-subject API provenance must contain an immutable commit')
  }
  return `# @nestarc/data-subject ${pkg.version} release source

The API signatures and source links are generated from the immutable published release recorded in [the provenance file](https://github.com/nestarc/nestarc.dev/blob/main/api/data-subject/.generated.json).

## Start here

- [Installation](/packages/data-subject/installation) — install the published release and configure the application module.
- [Policy model](/packages/data-subject/policy-model) — define entity policies and subject scope.
- [Export and erase](/packages/data-subject/export-erase) — integrate exports, previews, and verified erasure.
- [Durable execution](/packages/data-subject/execution) — operate persistent requests and paged jobs.
- [Migration](/packages/data-subject/migration) — upgrade the application and storage schema.
- [API modules](./modules.md) — browse the release-generated runtime and lint contracts.
`
}

export async function enrichApiNavigation(outputDir, slug) {
  if (!getPackage(slug)) throw new Error(`Unknown API package: ${slug}`)
  const updates = []
  if (slug === 'data-subject') {
    // This reference publishes signatures and maintained navigation only. Fail
    // before publishing if TypeDoc starts copying upstream planning attachments.
    const allowedFiles = new Set(['.generated.json', 'README.md', 'index.md', 'lint.md', 'modules.md'])
    for (const entry of await readdir(outputDir, { withFileTypes: true })) {
      if (!entry.isFile() || !allowedFiles.has(entry.name)) {
        throw new Error(`Data-subject API output contains an unapproved file: ${entry.name}`)
      }
    }
    const provenance = JSON.parse(await readFile(path.join(outputDir, '.generated.json'), 'utf8'))
    updates.push([path.join(outputDir, 'README.md'), renderDataSubjectReleaseReadme(provenance)])
  }
  if (apiNavigation[slug]) {
    const filePath = path.join(outputDir, 'modules.md')
    updates.push([filePath, enrichApiModules(await readFile(filePath, 'utf8'), slug)])
  }
  if (slug === 'rbac') {
    const filePath = path.join(outputDir, 'integrations', 'api-keys.md')
    updates.push([filePath, enrichApiKeyIntegration(await readFile(filePath, 'utf8'))])
  }
  if (slug === 'jobs') {
    const provenance = JSON.parse(await readFile(path.join(outputDir, '.generated.json'), 'utf8'))
    updates.push([path.join(outputDir, 'README.md'), renderJobsReleaseReadme(provenance)])
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
