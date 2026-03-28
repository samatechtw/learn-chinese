<template>
  <div class="card active-card">
    <div class="question-type-badge">{{ questionTypeLabel }}</div>
    <div class="fill-sentence">
      <span v-for="(part, i) in templateParts" :key="i">
        <span v-if="part === '__BLANK__'" class="blank-slot">
          <span class="blank-inner">___</span>
        </span>
        <span v-else class="sentence-part">{{ part }}</span>
      </span>
    </div>
    <div class="fill-hint">{{ question.displayText }}</div>
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
import { computed } from 'vue'
import { IUnitQuestion } from '@learn-chinese/types'

const props = defineProps<{
  question: IUnitQuestion
  questionTypeLabel: string
}>()

const emit = defineEmits<{
  (e: 'submitAnswer', answer: string): void
}>()

const templateParts = computed(() => {
  const template = props.question.template
  if (!template) return []
  return template
    .split('___')
    .flatMap((part, i, arr) => (i < arr.length - 1 ? [part, '__BLANK__'] : [part]))
})
</script>

<style lang="postcss" scoped>
@import './unit-style.postcss';
</style>
