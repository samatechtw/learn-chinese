<template>
  <div class="card active-card">
    <div class="question-type-badge">{{ questionTypeLabel }}</div>
    <div class="question-text big-chinese">{{ question.displayText }}</div>
    <button
      v-if="question.audioText"
      class="audio-btn"
      :class="{ playing: isPlaying }"
      @click="emit('playAudio', question.audioText)"
    >
      <span class="audio-icon">🔊</span>
    </button>
    <div class="options-grid">
      <button
        v-for="opt in question.options"
        :key="opt"
        class="option-btn"
        @click="emit('submitAnswer', opt)"
      >
        {{ opt }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IUnitQuestion } from '@learn-chinese/types'

defineProps<{
  isPlaying: boolean
  question: IUnitQuestion
  questionTypeLabel: string
}>()

const emit = defineEmits<{
  (e: 'playAudio', text: string): void
  (e: 'submitAnswer', answer: string): void
}>()
</script>

<style lang="postcss" scoped>
@import './unit-style.postcss';
</style>
