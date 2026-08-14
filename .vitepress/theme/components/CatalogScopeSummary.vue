<script setup>
import { packageCatalog, toolCatalog } from '../../../data/package-catalog.mjs'
</script>

<template>
  <span data-catalog-surface="catalog-scope">
    There are {{ packageCatalog.length }} SaaS backend packages under the <code>@nestarc</code> npm scope.
    Developer tools such as
    <template v-for="(tool, index) in toolCatalog" :key="tool.slug">
      <span v-if="index > 0">, </span><a
        :href="`/tools/${tool.slug}/`"
        data-catalog-surface="catalog-scope"
        :data-catalog-tool="tool.slug"
        :data-version="tool.version"
        :data-status="tool.supportStatus"
      ><code>@nestarc/{{ tool.slug }}</code></a>
    </template>
    live under <a href="/tools/">Tooling</a> instead of this package adoption path.
  </span>
</template>
