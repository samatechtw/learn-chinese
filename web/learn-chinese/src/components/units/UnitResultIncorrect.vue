<template>
  <div key="incorrect" class="card result-card" @click="emit('goNext')">
    <div class="status-icon incorrect">✗</div>
    <div class="status-text incorrect-text">Not quite</div>
    <div class="answer-compare">
      <div class="compare-row">
        <div class="compare-label">Your answer</div>
        <div class="compare-value wrong">{{ wrongAnswer }}</div>
      </div>
      <div class="compare-row">
        <div class="compare-label">Correct answer</div>
        <div class="compare-value">{{ correctAnswer }}</div>
      </div>
    </div>
    <div v-if="phraseInfo" class="answer-reveal small">
      <div class="reveal-chinese">{{ phraseInfo.chinese }}</div>
      <div class="reveal-pinyin">{{ phraseInfo.pinyin }}</div>
      <div class="reveal-english">{{ phraseInfo.english }}</div>
    </div>
    <div v-else-if="question?.displayText" class="answer-reveal small">
      <div class="reveal-english">{{ question.displayText }}</div>
    </div>
    <div class="continue-hint">Tap to continue</div>
  </div>
</template>

<script lang="ts" setup>
import { IUnitPhrase, IUnitQuestion } from '@learn-chinese/types'

defineProps<{
  correctAnswer: string
  phraseInfo: IUnitPhrase | null
  question: IUnitQuestion | null
  wrongAnswer: string
}>()

const emit = defineEmits<{
  (e: 'goNext'): void
}>()
</script>

<style lang="postcss" scoped>
@import './unit-style.postcss';
</style>
