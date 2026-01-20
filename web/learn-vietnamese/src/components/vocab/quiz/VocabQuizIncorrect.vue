<template>
  <div class="vocab-quiz-incorrect" @click="$emit('next')">
    <div class="status-icon incorrect">✗</div>
    <div class="status-text">Incorrect</div>
    <div class="answer-info">
      <div class="your-answer">
        <div class="label">Your answer:</div>
        <div class="value wrong">{{ question?.wrongGuess }}</div>
      </div>
      <div class="correct-answer">
        <div class="label">Correct answer:</div>
        <div class="value">{{ question?.correctAnswer }}</div>
      </div>
    </div>
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

.vocab-quiz-incorrect {
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

  &.incorrect {
    background: rgba(224, 40, 24, 0.12);
    color: $incorrect;
    box-shadow: 0 10px 24px rgba(224, 40, 24, 0.2);
  }
}

.status-text {
  @mixin title 22px;
  color: $incorrect;
}

.answer-info {
  display: flex;
  gap: 20px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

.your-answer,
.correct-answer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  padding: 12px 16px;
}

.label {
  @mixin title-regular 13px;
  color: $text2;
  text-transform: uppercase;
}

.value {
  @mixin title 22px;

  &.wrong {
    color: $incorrect;
    text-decoration: line-through;
  }
}

.word-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px 16px;
  background: linear-gradient(135deg, #fff1f2, #ffe4e6);
  border-radius: 12px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(224, 40, 24, 0.15);
}

.vietnamese {
  @mixin title 30px;
  color: #9f1239;
}

.english {
  @mixin text 18px;
  color: $text2;
}

@media (max-width: 640px) {
  .answer-info {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
