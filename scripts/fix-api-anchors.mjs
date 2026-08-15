import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import MarkdownIt from 'markdown-it'
import { createMarkdownRenderer } from 'vitepress'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = path.resolve(process.argv[2] ?? '')
const markdownParser = new MarkdownIt()

if (!process.argv[2]) {
  throw new Error('Usage: node scripts/fix-api-anchors.mjs <generated-package-directory>')
}

const relativeOutputDir = path.relative(rootDir, outputDir).split(path.sep).join('/')
if (
  relativeOutputDir.startsWith('../') ||
  path.isAbsolute(relativeOutputDir) ||
  !/^(?:api|\.typedoc-work\/api)\/[^/]+$/.test(relativeOutputDir)
) {
  throw new Error(`Refusing to modify Markdown outside a generated API package: ${outputDir}`)
}

async function walkMarkdown(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...await walkMarkdown(absolute))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(absolute)
    }
  }
  return files
}

async function isFile(file) {
  try {
    return (await stat(file)).isFile()
  } catch {
    return false
  }
}

function linkDestinations(markdown) {
  const destinations = []
  const visit = (tokens) => {
    for (const token of tokens) {
      if (token.type === 'link_open') {
        const href = token.attrGet('href')
        if (href) destinations.push(href)
      }
      if (token.children) visit(token.children)
    }
  }
  visit(markdownParser.parse(markdown, {}))
  return [...new Set(destinations)]
}

function codeBlockRanges(markdown) {
  const lineOffsets = [0]
  for (let index = 0; index < markdown.length; index += 1) {
    if (markdown[index] === '\n') lineOffsets.push(index + 1)
  }

  return markdownParser.parse(markdown, {})
    .filter((token) => ['fence', 'code_block'].includes(token.type) && token.map)
    .map((token) => ({
      start: lineOffsets[token.map[0]],
      end: lineOffsets[token.map[1]] ?? markdown.length,
    }))
}

function backtickRunLength(markdown, start) {
  let end = start
  while (markdown[end] === '`') end += 1
  return end - start
}

function markdownLinkDestinationRanges(markdown) {
  const ranges = []
  const blocked = codeBlockRanges(markdown)
  let blockedIndex = 0

  for (let index = 0; index < markdown.length;) {
    const block = blocked[blockedIndex]
    if (block && index >= block.end) {
      blockedIndex += 1
      continue
    }
    if (block && index >= block.start) {
      index = block.end
      continue
    }

    if (markdown[index] === '\\') {
      index += 2
      continue
    }

    if (markdown[index] === '`') {
      const runLength = backtickRunLength(markdown, index)
      const marker = '`'.repeat(runLength)
      const closing = markdown.indexOf(marker, index + runLength)
      index = closing === -1 ? index + runLength : closing + runLength
      continue
    }

    if (markdown[index] !== ']' || markdown[index + 1] !== '(') {
      index += 1
      continue
    }

    let cursor = index + 2
    while (/\s/.test(markdown[cursor] ?? '')) cursor += 1

    let start = cursor
    let end = cursor
    if (markdown[cursor] === '<') {
      start = cursor + 1
      end = markdown.indexOf('>', start)
      if (end === -1) {
        index += 2
        continue
      }
    } else {
      let depth = 0
      for (; end < markdown.length; end += 1) {
        const character = markdown[end]
        if (character === '\\') {
          end += 1
          continue
        }
        if (character === '(') depth += 1
        if (character === ')') {
          if (depth === 0) break
          depth -= 1
        }
        if (/\s/.test(character) && depth === 0) break
      }
    }

    if (end > start) ranges.push({ start, end, destination: markdown.slice(start, end) })
    index = Math.max(end, index + 2)
  }

  return ranges
}

function extractIds(html) {
  return new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]))
}

function vitePressSlug(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[\u0000-\u001f]/g, '')
    .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()
}

async function resolveMarkdownTarget(sourceFile, destinationPath) {
  if (!destinationPath) return sourceFile
  if (destinationPath.startsWith('/') || /^[a-z][a-z\d+.-]*:/i.test(destinationPath)) {
    return null
  }

  const decoded = decodeURIComponent(destinationPath)
  const target = path.resolve(path.dirname(sourceFile), decoded)
  const relative = path.relative(outputDir, target)
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null

  for (const candidate of [target, `${target}.md`, path.join(target, 'index.md')]) {
    if (await isFile(candidate)) return candidate
  }
  return null
}

function correctedFragment(fragment, targetIds) {
  if (targetIds.has(fragment)) return null

  const withoutTypedocSuffix = fragment.replace(/-\d+$/, '')
  const base = vitePressSlug(withoutTypedocSuffix)
  if (targetIds.has(base)) return base

  const suffixed = [...targetIds]
    .filter((id) => id.startsWith(`${base}-`))
    .sort((left, right) => left.localeCompare(right, 'en', { numeric: true }))
  return suffixed[0] ?? null
}

const files = await walkMarkdown(outputDir)
const vitePressRenderer = await createMarkdownRenderer(rootDir)
const documents = new Map()

for (const file of files) {
  const markdown = await readFile(file, 'utf8')
  const rendered = vitePressRenderer.render(markdown, { path: file })
  documents.set(file, { markdown, ids: extractIds(rendered) })
}

let correctedLinks = 0

for (const [file, document] of documents) {
  const parsedDestinations = new Set(linkDestinations(document.markdown))
  const replacements = []

  for (const range of markdownLinkDestinationRanges(document.markdown)) {
    const destination = markdownParser.normalizeLink(range.destination)
    if (!parsedDestinations.has(destination)) continue

    const hashIndex = destination.indexOf('#')
    if (hashIndex === -1 || hashIndex === destination.length - 1) continue

    const destinationPath = destination.slice(0, hashIndex)
    const fragment = decodeURIComponent(destination.slice(hashIndex + 1))
    const targetFile = await resolveMarkdownTarget(file, destinationPath)
    const targetDocument = targetFile ? documents.get(targetFile) : null
    if (!targetDocument) continue

    const corrected = correctedFragment(fragment, targetDocument.ids)
    if (!corrected) continue

    const rawHashIndex = range.destination.indexOf('#')
    const rawPathname = rawHashIndex === -1
      ? range.destination
      : range.destination.slice(0, rawHashIndex)
    replacements.push({
      start: range.start,
      end: range.end,
      value: `${rawPathname}#${corrected}`,
    })
  }

  let updated = document.markdown
  for (const replacement of replacements.sort((left, right) => right.start - left.start)) {
    updated = `${updated.slice(0, replacement.start)}${replacement.value}${updated.slice(replacement.end)}`
  }
  correctedLinks += replacements.length

  if (updated !== document.markdown) {
    await writeFile(file, updated)
  }
}

console.log(`Normalized ${correctedLinks} generated API anchor link(s) in ${path.basename(outputDir)}.`)
