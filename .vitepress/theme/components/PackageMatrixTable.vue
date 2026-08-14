<script setup>
import { packageCatalog } from '../../../data/package-catalog.mjs'
import CatalogText from './CatalogText.vue'

const props = defineProps({
  category: {
    type: String,
    required: true,
  },
})

const packages = packageCatalog.filter((pkg) => pkg.category === props.category)
</script>

<template>
  <table :aria-label="`${category} package matrix`" data-catalog-surface="package-matrix">
    <thead>
      <tr>
        <th scope="col">Package</th>
        <th scope="col">Status</th>
        <th scope="col">Version</th>
        <th scope="col">Solves</th>
        <th scope="col">Start here</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="pkg in packages"
        :key="pkg.slug"
        data-catalog-surface="package-matrix"
        :data-catalog-package="pkg.slug"
        :data-version="pkg.version"
        :data-status="pkg.supportStatus"
      >
        <td><a :href="`/packages/${pkg.slug}/`"><code>@nestarc/{{ pkg.slug }}</code></a></td>
        <td>{{ pkg.supportStatus }}</td>
        <td><code>{{ pkg.version }}</code></td>
        <td><CatalogText :text="pkg.solves" /></td>
        <td>{{ pkg.startHere }}</td>
      </tr>
    </tbody>
  </table>
</template>
