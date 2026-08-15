<script setup>
import { packageCatalog } from '../../../data/package-catalog.mjs'
</script>

<template>
  <table aria-label="Package API documentation status" data-catalog-surface="api-table" tabindex="0">
    <thead>
      <tr>
        <th scope="col">Package</th>
        <th scope="col">Status</th>
        <th scope="col">API Docs</th>
        <th scope="col">Package Guide</th>
        <th scope="col">Source</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="pkg in packageCatalog"
        :key="pkg.slug"
        data-catalog-surface="api-table"
        :data-catalog-package="pkg.slug"
        :data-version="pkg.version"
        :data-status="pkg.apiStatus"
      >
        <td>@nestarc/{{ pkg.slug }}</td>
        <td>{{ pkg.apiStatus }}</td>
        <td><a :href="`/api/${pkg.slug}/`" :aria-label="`${pkg.slug} API reference`">View API</a></td>
        <td><a :href="`/packages/${pkg.slug}/`" :aria-label="`${pkg.slug} package guide`">Guide</a></td>
        <td><a :href="`https://github.com/nestarc/${pkg.repository}`" :aria-label="`${pkg.slug} source on GitHub`">GitHub</a></td>
      </tr>
    </tbody>
  </table>
</template>
