<template>
  <div class="card active-card">
    <div class="question-type-badge">{{ questionTypeLabel }}</div>
    <div class="listen-prompt">Listen and choose the matching phrase</div>
    <div class="listen-pinyin">{{ question.displayText }}</div>
    <button
      class="audio-btn large"
      :class="{ playing: isPlaying }"
      @click="emit('playAudio', question.audioText ?? '')"
    >
      <span class="audio-icon">🔊</span>
      <span class="audio-label">{{ isPlaying ? 'Playing...' : 'Play' }}</span>
    </button>
    <div class="options-grid">
      <button
        v-for="opt in question.options"
        :key="opt"
        class="option-btn chinese-opt"
        @click="emit('submitAnswer', opt)"
      >
        {{ opt }}
      </button>
    </div>
    <button v-if="question.skippable" class="skip-btn" @click="emit('skipQuestion')">
      Skip
    </button>
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
  (e: 'skipQuestion'): void
  (e: 'submitAnswer', answer: string): void
}>()
</script>

<style lang="postcss" scoped>
@import './unit-style.postcss';
</style>
