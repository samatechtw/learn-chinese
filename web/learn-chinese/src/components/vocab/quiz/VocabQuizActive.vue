<template>
  <div class="vocab-quiz-active">
    <div class="question-type">
      {{ getQuestionTypeLabel(question.questionType) }}
    </div>
    <div class="question-text">
      {{ getQuestionText() }}
    </div>
    <div class="options">
      <button
        v-for="(option, index) in options"
        :key="index"
        class="option-button"
        @click="$emit('selectAnswer', option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { IVocabQuizQuestion } from '@frontend/types'
import { hsk1 } from '@frontend/util/characters'

interface Props {
  question: IVocabQuizQuestion | null
  options: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectAnswer: [answer: string]
}>()

const getQuestionTypeLabel = (type: string): string => {
  switch (type) {
    case 'EnglishToChinese':
      return 'Select the Chinese character'
    case 'ChineseToPinyin':
      return 'Select the pinyin'
    case 'ChineseToEnglish':
      return 'Select the English translation'
    default:
      return ''
  }
}

const getQuestionText = (): string => {
  if (!props.question) return ''

  const char = hsk1[props.question.characterId]
  if (!char) return ''

  switch (props.question.questionType) {
    case 'EnglishToChinese':
      return char.e || ''
    case 'ChineseToPinyin':
      return props.question.characterId
    case 'ChineseToEnglish':
      return props.question.characterId
    default:
      return ''
  }
}
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.vocab-quiz-active {
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.question-type {
  @mixin title-regular 12px;
  color: $text2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.question-text {
  @mixin title 36px;
  text-align: center;
  min-height: 60px;
  display: flex;
  align-items: center;
}

.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.option-button {
  @mixin title 18px;
  padding: 16px 12px;
  background: $color3;
  border: 2px solid $border1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  word-break: break-word;
  box-sizing: border-box;

  &:hover {
    background: $color2;
    border-color: $primary;
  }

  &:active {
    transform: scale(0.98);
  }
}
</style>
