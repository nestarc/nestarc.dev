import { execFileSync } from 'node:child_process'
import { apiNavigation } from '../data/api-navigation.mjs'

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', timeout: 90_000 }).trim()
}

export function prepareContentHistory(cwd) {
  if (git(['rev-parse', '--is-shallow-repository'], cwd) !== 'true') return

  // Some Pages checkouts fetch a commit directly without configuring origin.
  const remote = git(['remote'], cwd).split('\n').includes('origin')
    ? 'origin'
    : 'https://github.com/nestarc/nestarc.dev.git'
  const head = git(['rev-parse', 'HEAD'], cwd)
  git(['fetch', '--unshallow', '--no-tags', '--no-recurse-submodules', remote, head], cwd)
  if (git(['rev-parse', '--is-shallow-repository'], cwd) === 'true') {
    throw new Error('The build needs full commit history to date published documents.')
  }
}

export function contentDependencyDates(cwd) {
  const lastChange = (...files) => Number(git(['log', '-1', '--format=%at', '--', ...files], cwd)) * 1000
  // The API renderer supplies the heading and introduction on signature pages.
  const apiRenderer = lastChange('.vitepress/api-page.mjs')
  // The generated directory records the navigation copy for its own release.
  const apiDirectories = new Map(Object.keys(apiNavigation).map(slug => [
    slug, lastChange(`api/${slug}/modules.md`),
  ]))
  const catalog = lastChange('data/package-catalog.mjs')
  const catalogRoutes = new Set(['/', '/ko/', '/api/', '/packages/', '/community/', '/guide/adoption-roadmap'])
  return function lastUpdated(route, pageDate) {
    const apiSlug = route.match(/^\/api\/([^/]+)\//)?.[1]
    if (apiSlug) return Math.max(pageDate || 0, apiRenderer, apiDirectories.get(apiSlug) || 0) || undefined
    if (catalogRoutes.has(route)) return Math.max(pageDate || 0, catalog) || undefined
    return pageDate
  }
}
