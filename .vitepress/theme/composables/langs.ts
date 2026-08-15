import { computed } from 'vue'
import { useData } from 'vitepress'

const translatedRoutes: Record<string, Record<string, string>> = {
  'index.md': { root: '/', ko: '/ko/' },
  'ko/index.md': { root: '/', ko: '/ko/' },
  'getting-started.md': {
    root: '/getting-started',
    ko: '/ko/getting-started',
  },
  'ko/getting-started.md': {
    root: '/getting-started',
    ko: '/ko/getting-started',
  },
}

export function useLangs() {
  const { site, localeIndex, page, hash } = useData()
  const currentLang = computed(() => ({
    label: site.value.locales[localeIndex.value]?.label,
    link: site.value.locales[localeIndex.value]?.link
      || (localeIndex.value === 'root' ? '/' : `/${localeIndex.value}/`),
  }))

  const localeLinks = computed(() => {
    const translated = translatedRoutes[page.value.relativePath]
    return Object.entries(site.value.locales).flatMap(([key, value]) =>
      currentLang.value.label === value.label
        ? []
        : {
            text: value.label,
            link: `${translated?.[key] || value.link || (key === 'root' ? '/' : `/${key}/`)}${hash.value}`,
          })
  })

  return { localeLinks, currentLang }
}
