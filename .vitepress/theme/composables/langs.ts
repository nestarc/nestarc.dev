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
  'packages/index.md': { root: '/packages/', ko: '/ko/packages/' },
  'ko/packages/index.md': { root: '/packages/', ko: '/ko/packages/' },
  'packages/feature-flag/index.md': {
    root: '/packages/feature-flag/',
    ko: '/ko/packages/feature-flag/',
  },
  'ko/packages/feature-flag/index.md': {
    root: '/packages/feature-flag/',
    ko: '/ko/packages/feature-flag/',
  },
  'packages/idempotency/index.md': {
    root: '/packages/idempotency/',
    ko: '/ko/packages/idempotency/',
  },
  'ko/packages/idempotency/index.md': {
    root: '/packages/idempotency/',
    ko: '/ko/packages/idempotency/',
  },
  'packages/outbox/index.md': {
    root: '/packages/outbox/',
    ko: '/ko/packages/outbox/',
  },
  'ko/packages/outbox/index.md': {
    root: '/packages/outbox/',
    ko: '/ko/packages/outbox/',
  },
  'packages/tenancy/index.md': {
    root: '/packages/tenancy/',
    ko: '/ko/packages/tenancy/',
  },
  'ko/packages/tenancy/index.md': {
    root: '/packages/tenancy/',
    ko: '/ko/packages/tenancy/',
  },
}

export function useLangs() {
  const { site, localeIndex, page } = useData()
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
            link: translated?.[key] || value.link || (key === 'root' ? '/' : `/${key}/`),
          })
  })

  return { localeLinks, currentLang }
}
