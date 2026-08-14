<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
})

function segments(text) {
  return text.split(/(`[^`]+`)/g).filter(Boolean).map((value) => ({
    code: value.startsWith('`') && value.endsWith('`'),
    value: value.startsWith('`') && value.endsWith('`')
      ? value.slice(1, -1)
      : value,
  }))
}
</script>

<template>
  <span>
    <template v-for="(segment, index) in segments(text)" :key="index">
      <code v-if="segment.code">{{ segment.value }}</code>
      <template v-else>{{ segment.value }}</template>
    </template>
  </span>
</template>
