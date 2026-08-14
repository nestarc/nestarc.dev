<script setup>
import { packageCatalog } from '../../../data/package-catalog.mjs'

const validSteps = new Set(packageCatalog.map((pkg) => pkg.adoptionStage))
const props = defineProps({
  step: {
    type: Number,
    required: true,
    validator: (value) => Number.isInteger(value) && value > 0,
  },
})

if (!Number.isInteger(props.step) || !validSteps.has(props.step)) {
  throw new Error(`Invalid adoption stage: ${String(props.step)}`)
}

const packages = packageCatalog.filter((pkg) => pkg.adoptionStage === props.step)
if (packages.length === 0) {
  throw new Error(`Adoption stage ${props.step} has no packages`)
}

const installCommand = `npm install ${packages.map((pkg) => `@nestarc/${pkg.slug}`).join(' ')}`
</script>

<template>
  <div data-catalog-surface="adoption-stage-packages">
    <div class="language-bash vp-adaptive-theme">
      <span class="lang">bash</span>
      <pre class="vp-code" tabindex="0"><code><span class="line">{{ installCommand }}</span></code></pre>
    </div>
    <p>
      <template v-for="(pkg, index) in packages" :key="pkg.slug">
        <span v-if="index > 0"> · </span>
        <a
          :href="`/packages/${pkg.slug}/`"
          data-catalog-surface="adoption-stage-packages"
          :data-catalog-package="pkg.slug"
          :data-version="pkg.version"
          :data-status="pkg.supportStatus"
        >{{ pkg.slug }} Docs →</a>
      </template>
    </p>
  </div>
</template>
