<script setup>
import { packageCatalog } from '../../../data/package-catalog.mjs'

defineProps({
  locale: {
    type: String,
    default: 'en',
    validator: (value) => value === 'en' || value === 'ko',
  },
})
</script>

<template>
  <div class="package-grid" data-catalog-surface="home-packages">
    <a
      v-for="pkg in packageCatalog"
      :key="pkg.slug"
      class="package-card"
      :href="`/packages/${pkg.slug}/`"
      data-catalog-surface="home-packages"
      :data-catalog-package="pkg.slug"
      :data-version="pkg.version"
      :data-status="pkg.supportStatus"
    >
      <span class="status">{{ pkg.supportStatus }} · v{{ pkg.version }}</span>
      <span class="title">{{ pkg.slug }}</span>
      <p>{{ pkg.homeSummary[locale] }}</p>
    </a>
  </div>
</template>
