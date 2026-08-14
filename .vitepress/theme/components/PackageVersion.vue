<script setup>
import { getPackage } from '../../../data/package-catalog.mjs'

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const pkg = getPackage(props.slug)

if (!pkg) {
  throw new Error(`Unknown package catalog slug: ${props.slug}`)
}
</script>

<template>
  <code
    data-catalog-surface="package-version"
    :data-catalog-package="pkg.slug"
    :data-version="pkg.version"
    :data-status="pkg.supportStatus"
  >{{ pkg.version }}</code>
</template>
