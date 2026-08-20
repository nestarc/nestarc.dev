<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  locale?: 'en' | 'ko'
}>(), {
  locale: 'en',
})

const protectedLink = computed(() => {
  const label = props.locale === 'ko' ? '파일럿 참여 요청' : 'Request pilot access'
  return `<!--email_off--><a href="mailto:hello@nestarc.dev?subject=Nestarc%20Reliability%20pilot">${label}</a><!--/email_off-->`
})
</script>

<template>
  <span v-html="protectedLink"></span>
</template>
