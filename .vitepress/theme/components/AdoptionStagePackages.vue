<script setup>
import { onBeforeUnmount, ref } from 'vue'
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
const copied = ref(false)
let resetTimer

async function copyInstallCommand() {
  let succeeded = false
  try {
    await navigator.clipboard.writeText(installCommand)
    succeeded = true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = installCommand
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.fontSize = '12pt'
    document.body.appendChild(textarea)
    textarea.select()
    succeeded = document.execCommand('copy')
    textarea.remove()
  }

  if (!succeeded) return
  copied.value = true
  window.clearTimeout(resetTimer)
  resetTimer = window.setTimeout(() => {
    copied.value = false
  }, 2000)
}

onBeforeUnmount(() => window.clearTimeout(resetTimer))
</script>

<template>
  <div data-catalog-surface="adoption-stage-packages">
    <div class="language-bash vp-adaptive-theme">
      <button
        type="button"
        class="copy"
        :class="{ copied }"
        :title="copied ? 'Copied' : 'Copy code'"
        :aria-label="copied ? 'Install command copied' : 'Copy install command'"
        @click.stop="copyInstallCommand"
      ></button>
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
