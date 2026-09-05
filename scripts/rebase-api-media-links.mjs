import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt()
function filesUnder(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (['node_modules', '.git'].includes(entry.name)) return []
    const file = path.join(dir, entry.name)
    return entry.isDirectory() ? filesUnder(file) : [file]
  })
}

export function rebaseApiMediaLinks({ sourceDir, outputDir, repository, commit }) {
  const mediaDir = path.join(outputDir, '_media')
  if (!existsSync(mediaDir)) return
  const sources = filesUnder(sourceDir)
  for (const file of filesUnder(mediaDir).filter((file) => file.endsWith('.md'))) {
    const text = readFileSync(file, 'utf8')
    const candidates = sources.filter((source) => path.basename(source) === path.basename(file))
    const source = candidates.length === 1 ? candidates[0]
      : candidates.find((source) => readFileSync(source, 'utf8') === text)
    // Synthesized directory/extensionless siblings are handled by the generator.
    if (!source) continue
    const lines = text.split('\n')
    const proseLines = new Set(markdown.parse(text, {}).filter((token) => ['inline', 'table_open'].includes(token.type))
      .flatMap((token) => token.map ? Array.from({ length: token.map[1] - token.map[0] }, (_, i) => token.map[0] + i) : []))
    for (const line of proseLines) {
      // Keep inline-code examples and fenced blocks verbatim.
      lines[line] = lines[line].split(/(`+[^`]*`+)/g).map((part) => part.startsWith('`') ? part
        : part.replace(/(?<!!)\]\(([^\s)]+)(\s+"[^"]*")?\)/g, (match, href, title = '') => {
          if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(href)) return match
          const [relative, suffix = ''] = href.split(/(?=[#?])/s, 2)
          const target = path.resolve(path.dirname(source), decodeURIComponent(relative))
          const relativeTarget = path.relative(sourceDir, target)
          if (relativeTarget.startsWith('..') || !existsSync(target)) {
            throw new Error(`Copied media ${file} has an unresolved source link: ${href}`)
          }
          const urlPath = relativeTarget.split(path.sep).map(encodeURIComponent).join('/')
          return `](https://github.com/nestarc/${repository}/blob/${commit}/${urlPath}${suffix}${title})`
        })).join('')
    }
    writeFileSync(file, lines.join('\n'))
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [sourceDir, outputDir, repository, commit] = process.argv.slice(2)
  rebaseApiMediaLinks({ sourceDir, outputDir, repository, commit })
}
