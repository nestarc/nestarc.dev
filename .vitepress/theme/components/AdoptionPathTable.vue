<script setup>
import { adoptionStages, packageCatalog } from '../../../data/package-catalog.mjs'

defineProps({
  view: {
    type: String,
    default: 'overview',
    validator: (value) => value === 'overview' || value === 'roadmap',
  },
})

const rows = adoptionStages.map((stage) => ({
  ...stage,
  packages: packageCatalog.filter((pkg) => pkg.adoptionStage === stage.step),
}))
</script>

<template>
  <table aria-label="Recommended package adoption path" data-catalog-surface="adoption-table" tabindex="0">
    <thead>
      <tr>
        <th scope="col">Step</th>
        <th scope="col">{{ view === 'roadmap' ? 'Goal' : 'Add this layer' }}</th>
        <th scope="col">Packages</th>
        <th v-if="view === 'overview'" scope="col">Use when</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="stage in rows" :key="stage.step">
        <td>{{ stage.step }}</td>
        <td>{{ stage.label }}</td>
        <td>
          <template v-for="(pkg, index) in stage.packages" :key="pkg.slug">
            <span v-if="index > 0">, </span>
            <a
              :href="`/packages/${pkg.slug}/`"
              data-catalog-surface="adoption-table"
              :data-catalog-package="pkg.slug"
              :data-version="pkg.version"
              :data-status="pkg.supportStatus"
            >{{ pkg.slug }}</a>
          </template>
        </td>
        <td v-if="view === 'overview'">{{ stage.useWhen }}</td>
      </tr>
    </tbody>
  </table>
</template>
