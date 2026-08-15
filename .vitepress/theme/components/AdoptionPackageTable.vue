<script setup>
import { packageCatalog } from '../../../data/package-catalog.mjs'

const catalogOrder = new Map(packageCatalog.map((pkg, index) => [pkg.slug, index]))
const rows = [...packageCatalog]
  .sort((left, right) => left.adoptionStage - right.adoptionStage
    || catalogOrder.get(left.slug) - catalogOrder.get(right.slug))
</script>

<template>
  <table aria-label="Package adoption details" data-catalog-surface="adoption-package-table" tabindex="0">
    <thead>
      <tr>
        <th scope="col">Package</th>
        <th scope="col">Adoption Step</th>
        <th scope="col">Requires Code Changes?</th>
        <th scope="col">Depends On</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in rows"
        :key="row.slug"
        data-catalog-surface="adoption-package-table"
        :data-catalog-package="row.slug"
        :data-version="row.version"
        :data-status="row.supportStatus"
      >
        <td><a :href="`/packages/${row.slug}/`">{{ row.slug }}</a></td>
        <td>Step {{ row.adoptionStage }}</td>
        <td>{{ row.requiresCodeChanges }}</td>
        <td>{{ row.dependsOn }}</td>
      </tr>
    </tbody>
  </table>
</template>
