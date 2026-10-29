import { execFile } from 'node:child_process'
import { lstat, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import MarkdownIt from 'markdown-it'

const execFileAsync = promisify(execFile)
const scriptPath = fileURLToPath(import.meta.url)
const defaultRootDir = path.resolve(path.dirname(scriptPath), '..')
const markdown = new MarkdownIt()
const privateBasenames = new Set([
  'seo_direction.md',
  'handover.md',
  'p2-support-proposal.md',
  'market-positioning-roadmap.md',
])

// Shared with API staging validation so ignored generated files cannot bypass
// the publication boundary before Git sees them.
export function isPrivateContentPath(relativePath) {
  const normalized = path.posix.normalize(relativePath.replaceAll('\\', '/'))
    .replace(/^\/+/, '').toLowerCase()
  const segments = normalized.split('/')
  return privateBasenames.has(path.posix.basename(normalized)) ||
    segments.includes('.notes') || segments.includes('seo-reports') ||
    normalized === 'api/data-subject/_media' || normalized === 'api/data-subject/_media.md' ||
    normalized.startsWith('api/data-subject/_media/')
}

function isPrivateDestination(sourcePath, destination) {
  let pathname
  let external = false
  try {
    if (/^[a-z][a-z\d+.-]*:/i.test(destination) || destination.startsWith('//')) {
      const url = new URL(destination, 'https://example.invalid')
      if (!['http:', 'https:'].includes(url.protocol)) return false
      pathname = decodeURIComponent(url.pathname)
      external = true
    } else {
      pathname = decodeURIComponent(destination.split(/[?#]/, 1)[0])
    }
  } catch {
    return false
  }
  if (!pathname) return false
  if (!external) {
    const relativeTarget = pathname.startsWith('/')
      ? pathname.slice(1)
      : path.posix.join(path.posix.dirname(sourcePath), pathname)
    return isPrivateContentPath(relativeTarget)
  }
  // An immutable upstream GitHub link still publishes the private document's
  // location. Match the known path suffixes without inspecting arbitrary prose.
  const segments = pathname.split('/')
  return segments.some((_, index) => isPrivateContentPath(segments.slice(index).join('/')))
}

export function privateMarkdownLinks(sourcePath, content) {
  const links = []
  const visit = (tokens) => {
    for (const token of tokens) {
      const destination = token.type === 'link_open'
        ? token.attrGet('href')
        : token.type === 'image' ? token.attrGet('src') : null
      if (destination && isPrivateDestination(sourcePath, destination)) links.push(destination)
      if (token.children) visit(token.children)
    }
  }
  visit(markdown.parse(content, {}))
  return [...new Set(links)]
}

async function physicalPublicFiles(repositoryRoot) {
  const files = []
  const symlinks = []
  const visit = async (relativePath) => {
    const absolutePath = path.join(repositoryRoot, relativePath)
    let info
    try {
      info = await lstat(absolutePath)
    } catch (error) {
      if (error.code === 'ENOENT') return
      throw error
    }
    if (info.isSymbolicLink()) {
      // Do not inspect a symlink's target, even if its filename is benign.
      files.push(relativePath)
      symlinks.push(relativePath)
    } else if (info.isDirectory()) {
      for (const name of await readdir(absolutePath)) await visit(`${relativePath}/${name}`)
    } else {
      files.push(relativePath)
    }
  }
  // VitePress copies this directory verbatim, regardless of Git ignore rules
  // and Markdown srcExclude patterns.
  await visit('public')
  return { files, symlinks }
}

export async function validatePublicContent({ rootDir = defaultRootDir } = {}) {
  const { stdout: topLevel } = await execFileAsync('git', ['-C', rootDir, 'rev-parse', '--show-toplevel'])
  const repositoryRoot = topLevel.trim()
  const { stdout } = await execFileAsync('git', [
    '-C', repositoryRoot, 'ls-files', '--cached', '--others', '--exclude-standard', '-z',
  ], { maxBuffer: 16 * 1024 * 1024 })
  const publicFiles = await physicalPublicFiles(repositoryRoot)
  const files = [...new Set([...stdout.split('\0').filter(Boolean), ...publicFiles.files])].sort()
  const issues = []
  let checkedFiles = 0
  for (const relativePath of files) {
    // A tracked child may still exist in the index after a directory was
    // replaced with a symlink. Never follow that parent to inspect the child.
    if (publicFiles.symlinks.some((link) => relativePath.startsWith(`${link}/`))) continue
    const absolutePath = path.join(repositoryRoot, relativePath)
    let info
    try {
      info = await lstat(absolutePath)
    } catch (error) {
      // A local migration may have deleted a tracked file before staging it.
      if (error.code === 'ENOENT') continue
      throw error
    }
    checkedFiles += 1
    if (isPrivateContentPath(relativePath)) {
      issues.push(`${relativePath}: private working material must not be published`)
      continue
    }
    if (info.isSymbolicLink() && (relativePath === 'public' || relativePath.startsWith('public/'))) {
      issues.push(`${relativePath}: symbolic links are not allowed in public publication inputs`)
      continue
    }
    if (info.isFile() && /\.md$/i.test(relativePath)) {
      for (const destination of privateMarkdownLinks(relativePath, await readFile(absolutePath, 'utf8'))) {
        issues.push(`${relativePath}: link to private working material: ${destination}`)
      }
    }
  }
  return { issues, checkedFiles }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length && (args.length !== 2 || args[0] !== '--root')) {
    throw new Error('Usage: node scripts/validate-public-content.mjs [--root <repository>]')
  }
  const { issues, checkedFiles } = await validatePublicContent({ rootDir: args[1] })
  if (issues.length) {
    throw new Error(`Public content validation failed:\n- ${issues.join('\n- ')}`)
  }
  console.log(`Public content validation passed (${checkedFiles} files).`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
