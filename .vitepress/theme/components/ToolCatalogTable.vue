<script setup>
import { toolCatalog } from '../../../data/package-catalog.mjs'

defineProps({
  view: {
    type: String,
    default: 'packages',
    validator: (value) => ['packages', 'api', 'tools'].includes(value),
  },
})
</script>

<template>
  <table aria-label="nestarc developer tools" data-catalog-surface="tool-table">
    <thead>
      <tr v-if="view === 'packages'">
        <th scope="col">Tool</th>
        <th scope="col">Status</th>
        <th scope="col">Version</th>
        <th scope="col">Purpose</th>
      </tr>
      <tr v-else-if="view === 'api'">
        <th scope="col">Package</th>
        <th scope="col">Status</th>
        <th scope="col">Docs</th>
        <th scope="col">Source</th>
      </tr>
      <tr v-else>
        <th scope="col">Tool</th>
        <th scope="col">Version</th>
        <th scope="col">Purpose</th>
        <th scope="col">Docs</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="tool in toolCatalog"
        :key="tool.slug"
        data-catalog-surface="tool-table"
        :data-catalog-tool="tool.slug"
        :data-version="tool.version"
        :data-status="tool.supportStatus"
      >
        <template v-if="view === 'packages'">
          <td><a :href="`/tools/${tool.slug}/`"><code>@nestarc/{{ tool.slug }}</code></a></td>
          <td>{{ tool.supportStatus }}</td>
          <td><code>{{ tool.version }}</code></td>
          <td>{{ tool.purpose }}</td>
        </template>
        <template v-else-if="view === 'api'">
          <td>@nestarc/{{ tool.slug }}</td>
          <td>{{ tool.supportStatus }}</td>
          <td><a :href="`/tools/${tool.slug}/`" :aria-label="`${tool.slug} documentation`">View Docs</a></td>
          <td><a :href="`https://github.com/nestarc/${tool.repository}`" :aria-label="`${tool.slug} source on GitHub`">GitHub</a></td>
        </template>
        <template v-else>
          <td><code>@nestarc/{{ tool.slug }}</code></td>
          <td><code>{{ tool.version }}</code></td>
          <td>{{ tool.purpose }}</td>
          <td><a :href="`/tools/${tool.slug}/`">{{ tool.slug }}</a></td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
