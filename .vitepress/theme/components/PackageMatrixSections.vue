<script setup>
import { packageCategories } from '../../../data/package-catalog.mjs'
import PackageMatrixTable from './PackageMatrixTable.vue'
</script>

<template>
  <section
    v-for="category in packageCategories"
    :key="category.id"
    data-catalog-surface="package-matrix-section"
  >
    <h3 :id="category.id" tabindex="-1">
      {{ category.label }}
      <a
        class="header-anchor"
        :href="`#${category.id}`"
        :aria-label="`Permalink to ${category.label}`"
      >&#8203;</a>
    </h3>
    <PackageMatrixTable :category="category.id" />
  </section>
</template>
