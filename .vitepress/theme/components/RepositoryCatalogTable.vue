<script setup>
import { computed } from 'vue'
import { packageCatalog, toolCatalog } from '../../../data/package-catalog.mjs'

const props = defineProps({
  kind: {
    type: String,
    default: 'package',
    validator: (value) => value === 'package' || value === 'tool',
  },
})

const items = computed(() => props.kind === 'package' ? packageCatalog : toolCatalog)
const surface = computed(() => props.kind === 'package' ? 'repository-table' : 'repository-tool-table')
</script>

<template>
  <table
    :aria-label="kind === 'package' ? 'Package repositories' : 'Tool repositories'"
    :data-catalog-surface="surface"
    tabindex="0"
  >
    <thead>
      <tr>
        <th scope="col">{{ kind === 'package' ? 'Package' : 'Tool' }}</th>
        <th scope="col">Repository</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in items"
        :key="item.slug"
        :data-catalog-surface="surface"
        :data-catalog-package="kind === 'package' ? item.slug : undefined"
        :data-catalog-tool="kind === 'tool' ? item.slug : undefined"
        :data-version="item.version"
        :data-status="item.supportStatus"
      >
        <td>{{ item.slug }}</td>
        <td><a :href="`https://github.com/nestarc/${item.repository}`">nestarc/{{ item.repository }}</a></td>
      </tr>
    </tbody>
  </table>
</template>
