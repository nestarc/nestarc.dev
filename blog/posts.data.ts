import { createContentLoader } from 'vitepress'

export default createContentLoader('blog/*.md', {
  excerpt: true,
  transform(rawData) {
    return rawData
      .filter((page) => page.url !== '/blog/')
      .sort((a, b) => {
        const dateOrder = +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
        return dateOrder || a.url.localeCompare(b.url)
      })
  },
})
