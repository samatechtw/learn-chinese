<template>
  <div class="vocab-quiz-correct" @click="$emit('next')">
    <div class="status-icon correct">✓</div>
    <div class="status-text">Correct!</div>
    <div class="word-display">
      <div class="vietnamese">{{ word?.v }}</div>
      <div class="english">{{ word?.e }}</div>
    </div>
    <div class="continue-hint">Click to continue</div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { IVietnameseQuizQuestion } from '@learn-vietnamese/types'
import { vietnameseVocabMap } from '@learn-vietnamese/data/vocab'

interface Props {
  question: IVietnameseQuizQuestion | null
}

const props = defineProps<Props>()

defineEmits<{
  next: []
}>()

const word = computed(() => {
  if (!props.question) return null
  return vietnameseVocabMap[props.question.wordId]
})
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.vocab-quiz-correct {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  cursor: pointer;
}

.status-icon {
  font-size: 44px;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &.correct {
    background: rgba(31, 157, 18, 0.12);
    color: $correct;
    box-shadow: 0 10px 24px rgba(31, 157, 18, 0.2);
  }
}

.status-text {
  @mixin title 22px;
  color: $correct;
}

.word-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px 16px;
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
  border-radius: 12px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(194, 65, 12, 0.18);
}

.vietnamese {
  @mixin title 32px;
  color: #9a3412;
}

.english {
  @mixin text 18px;
  color: $text2;
}
</style>
