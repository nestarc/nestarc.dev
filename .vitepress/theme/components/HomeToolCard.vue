<script setup>
import { toolCatalog } from '../../../data/package-catalog.mjs'

const props = defineProps({
  locale: {
    type: String,
    default: 'en',
    validator: (value) => value === 'en' || value === 'ko',
  },
})

function detail(tool) {
  return props.locale === 'ko'
    ? `${tool.homeSummary.ko} @nestarc 스코프로 배포되지만, NestJS SaaS 모듈 목록과는 분리해 다룹니다.`
    : `${tool.homeSummary.en} It is published under the @nestarc scope, but lives separately from the NestJS SaaS module lineup.`
}

function linkLabel() {
  return props.locale === 'ko' ? '도구 보기 →' : 'Explore tooling →'
}
</script>

<template>
  <div data-catalog-surface="home-tools">
    <div
      v-for="tool in toolCatalog"
      :key="tool.slug"
      class="tooling-card"
      data-catalog-surface="home-tools"
      :data-catalog-tool="tool.slug"
      :data-version="tool.version"
      :data-status="tool.supportStatus"
    >
      <div class="label">{{ tool.supportStatus }} · {{ tool.slug }} · v{{ tool.version }}</div>
      <p>{{ detail(tool) }}</p>
      <a href="/tools/">{{ linkLabel() }}</a>
    </div>
  </div>
</template>
