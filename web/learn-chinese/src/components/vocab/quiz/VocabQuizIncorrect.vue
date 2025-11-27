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
    <div class="character-display">
      <div class="chinese">{{ question?.characterId }}</div>
      <div class="pinyin">{{ getCharInfo()?.p }}</div>
      <div class="english">{{ getCharInfo()?.e }}</div>
    </div>
    <div class="continue-hint">Click to continue</div>
  </div>
</template>

<script lang="ts" setup>
import { IVocabQuizQuestion } from '@frontend/types'
import { hsk1 } from '@frontend/util/characters'

interface Props {
  question: IVocabQuizQuestion | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  next: []
}>()

const getCharInfo = () => {
  if (!props.question) return null
  return hsk1[props.question.characterId]
}
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.vocab-quiz-incorrect {
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  cursor: pointer;
}

.status-icon {
  font-size: 48px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &.incorrect {
    background: rgba(239, 68, 68, 0.1);
    color: rgb(239, 68, 68);
  }
}

.status-text {
  @mixin title 24px;
  color: rgb(239, 68, 68);
}

.answer-info {
  display: flex;
  gap: 24px;
  width: 100%;
  justify-content: center;
}

.your-answer,
.correct-answer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.label {
  @mixin title-regular 12px;
  color: $text2;
  text-transform: uppercase;
}

.value {
  @mixin title 18px;

  &.wrong {
    color: rgb(239, 68, 68);
    text-decoration: line-through;
  }
}

.character-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
  background: $color3;
  border-radius: 8px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.chinese {
  @mixin title 36px;
}

.pinyin {
  @mixin title-regular 16px;
  color: $text2;
}

.english {
  @mixin title-regular 14px;
  color: $text2;
}

.continue-hint {
  @mixin title-regular 12px;
  color: $text2;
  margin-top: 8px;
}
</style>
