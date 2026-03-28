<template>
  <div key="correct" class="card result-card" @click="emit('goNext')">
    <div class="status-icon correct">✓</div>
    <div class="status-text correct-text">Correct!</div>
    <div v-if="phraseInfo" class="answer-reveal">
      <div class="reveal-chinese">{{ phraseInfo.chinese }}</div>
      <div class="reveal-pinyin">{{ phraseInfo.pinyin }}</div>
      <div class="reveal-english">{{ phraseInfo.english }}</div>
    </div>
    <div class="continue-hint">Tap to continue</div>
  </div>
</template>

<script lang="ts" setup>
import { IUnitPhrase } from '@learn-chinese/types'

defineProps<{
  phraseInfo: IUnitPhrase | null
}>()

const emit = defineEmits<{
  (e: 'goNext'): void
}>()
</script>

<style lang="postcss" scoped>
@import './unit-style.postcss';
</style>
