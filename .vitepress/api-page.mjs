import { apiNavigation } from '../data/api-navigation.mjs'
import { getPackage } from '../data/package-catalog.mjs'

export function apiPageFor(relativePath) {
  const match = relativePath?.replaceAll('\\', '/').match(/^api\/([^/]+)\/(.+)\.md$/)
  if (!match) return
  const [, slug, page] = match
  const pkg = getPackage(slug)
  if (!pkg) return

  const packageName = `@nestarc/${slug}`
  const modules = apiNavigation[slug]?.modules
  if (page === 'modules' && modules) {
    const subpaths = Object.keys(modules).filter(file => file !== 'index.md')
      .map(file => file.replace(/\.md$/, ''))
    return {
      title: `${packageName} import paths`,
      description: `Find the TypeScript exports for ${packageName} and its public subpaths (${subpaths.join(', ')}).`,
    }
  }

  const moduleSummary = modules?.[`${page}.md`]
  if (page !== 'index' && !moduleSummary) return
  const importPath = page === 'index' ? packageName : `${packageName}/${page}`
  const summary = moduleSummary ?? `TypeScript API reference for ${packageName}. ${pkg.solves}`
  const navigation = modules
    ? `[Browse all ${packageName} import paths](/api/${slug}/modules).`
    : `[Read the ${packageName} package guide](/packages/${slug}/).`
  return {
    title: `${importPath} API reference`,
    description: summary.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'),
    introduction: `${summary}\n\n${navigation}`,
  }
}

// Present the released TypeDoc content with the same context in HTML and local search.
export function configureApiMarkdown(md) {
  md.core.ruler.after('block', 'nestarc-api-heading', state => {
    const page = apiPageFor(state.env.relativePath)
    if (!page) return
    const heading = state.tokens.findIndex(token => token.type === 'heading_open' && token.tag === 'h1')
    if (heading === -1) return
    const text = state.tokens[heading + 1]
    // TypeDoc uses the package name or import subpath as its original H1.
    const anchor = text.content.replace(/^@/, '').replaceAll('/', '-')
    state.tokens[heading].attrSet('id', anchor)
    text.content = page.title
    if (page.introduction && !state.src.includes('<!-- api-context:start -->')) {
      const introTokens = []
      md.block.parse(page.introduction, md, state.env, introTokens)
      state.tokens.splice(heading + 3, 0, ...introTokens)
    }
  })
}
