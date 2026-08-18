<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()

const isTechnicalArticle = computed(() =>
  page.value.relativePath.startsWith('blog/')
    && page.value.relativePath !== 'blog/index.md',
)
</script>

<template>
  <div
    v-if="isTechnicalArticle"
    class="article-trust"
    aria-label="Article review information"
  >
    <span>By {{ frontmatter.author }}</span>
    <span>Reviewed and updated {{ frontmatter.reviewed }}</span>
    <span>Version scope: {{ frontmatter.versionScope }}</span>
  </div>
</template>
