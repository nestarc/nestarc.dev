<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()

const isTechnicalArticle = computed(() =>
  page.value.relativePath.startsWith('blog/')
    && page.value.relativePath !== 'blog/index.md',
)

const reviewedDate = computed(() => {
  const value = frontmatter.value.reviewed

  if (!value)
    return null

  const date = value instanceof Date ? value : new Date(String(value))

  if (Number.isNaN(date.getTime()))
    return { datetime: undefined, label: String(value) }

  return {
    datetime: date.toISOString().slice(0, 10),
    label: new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
      year: 'numeric',
    }).format(date),
  }
})
</script>

<template>
  <div
    v-if="isTechnicalArticle"
    class="article-trust"
    aria-label="Article review information"
  >
    <div class="article-trust__summary">
      <span v-if="frontmatter.author">By {{ frontmatter.author }}</span>
      <time
        v-if="reviewedDate"
        :datetime="reviewedDate.datetime"
      >
        Updated {{ reviewedDate.label }}
      </time>
    </div>
    <details
      v-if="frontmatter.versionScope"
      class="article-trust__compatibility"
    >
      <summary>Compatibility</summary>
      <p>{{ frontmatter.versionScope }}</p>
    </details>
  </div>
</template>
