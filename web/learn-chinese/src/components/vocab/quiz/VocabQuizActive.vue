<template>
  <div class="vocab-quiz-active">
    <div class="question-type">
      {{ getQuestionTypeLabel(question.questionType) }}
    </div>
    <div class="question-text">
      {{ getQuestionText() }}
    </div>
    <button class="audio-button" :disabled="isPlaying" @click="emit('playAudio')">
      {{ isPlaying ? 'Playing...' : 'Listen' }}
    </button>
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
import { IVocabQuizQuestion } from '@learn-chinese/types'
import { hsk1 } from '@learn-chinese/util/characters'

interface Props {
  isPlaying: boolean
  question: IVocabQuizQuestion | null
  options: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  playAudio: []
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.question-type {
  @mixin title-regular 13px;
  color: $color2;
  text-transform: uppercase;
  letter-spacing: 0.45px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(50, 130, 184, 0.25);
  background: rgba(50, 130, 184, 0.12);
}

.question-text {
  @mixin title 48px;
  color: $text1;
  text-align: center;
  min-height: 64px;
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.audio-button {
  @mixin title-regular 15px;
  border: 1px solid rgba(50, 130, 184, 0.28);
  background: rgba(50, 130, 184, 0.1);
  color: $color2;
  border-radius: 999px;
  padding: 10px 18px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
}

.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  max-width: 100%;
  margin-top: 16px;
}

.option-button {
  @mixin title 28px;
  padding: 20px 14px;
  background: linear-gradient(135deg, #3282b8, #5db8ff);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  word-break: break-word;
  box-sizing: border-box;
  box-shadow: 0 10px 20px rgba(50, 130, 184, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 24px rgba(50, 130, 184, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }
}

@media (max-width: 640px) {
  .question-text {
    font-size: 32px;
  }
  .options {
    grid-template-columns: 1fr;
  }
  .option-button {
    min-height: 64px;
  }
}
</style>
