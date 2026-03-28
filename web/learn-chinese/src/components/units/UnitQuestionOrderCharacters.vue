<template>
  <div class="card active-card">
    <div class="question-type-badge">{{ questionTypeLabel }}</div>
    <div class="order-prompt">{{ question.displayText }}</div>
    <div class="order-selected" :class="{ empty: selectedWords.length === 0 }">
      <span v-if="selectedWords.length === 0" class="order-placeholder"
        >Tap words below to build the sentence</span
      >
      <button
        v-for="(word, i) in selectedWords"
        :key="`sel-${i}`"
        class="word-chip selected"
        @click="emit('deselectWord', i)"
      >
        {{ word }}
      </button>
    </div>
    <div class="word-bank">
      <button
        v-for="(word, i) in remainingWords"
        :key="`bank-${i}`"
        class="word-chip"
        @click="emit('selectWord', i)"
      >
        {{ word }}
      </button>
    </div>
    <button
      class="submit-btn"
      :disabled="selectedWords.length === 0"
      @click="emit('submitOrderAnswer')"
    >
      Check
    </button>
  </div>
</template>

<script lang="ts" setup>
import { IUnitQuestion } from '@learn-chinese/types'

defineProps<{
  question: IUnitQuestion
  questionTypeLabel: string
  remainingWords: string[]
  selectedWords: string[]
}>()

const emit = defineEmits<{
  (e: 'deselectWord', index: number): void
  (e: 'selectWord', index: number): void
  (e: 'submitOrderAnswer'): void
}>()
</script>

<style lang="postcss" scoped>
@import './unit-style.postcss';
</style>
