<template>
  <div class="vocab-quiz-active">
    <div class="question-type">
      {{ getQuestionTypeLabel(question.questionType) }}
    </div>
    <div class="question-text">
      {{ getQuestionText() }}
    </div>
    <AudioButton :audio-text="spokenWord" :show-label="false" />
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
import AudioButton from '@learn-vietnamese/components/shared/AudioButton.vue'
import { IVietnameseQuizQuestion } from '@learn-vietnamese/types'
import { vietnameseVocabMap } from '@learn-vietnamese/data/vocab'

interface Props {
  question: IVietnameseQuizQuestion | null
  options: string[]
}

const props = defineProps<Props>()

defineEmits<{
  selectAnswer: [answer: string]
}>()

const getQuestionTypeLabel = (type: string): string => {
  switch (type) {
    case 'EnglishToVietnamese':
      return 'Select the Vietnamese word'
    case 'VietnameseToEnglish':
      return 'Select the English translation'
    default:
      return ''
  }
}

const getQuestionText = (): string => {
  if (!props.question) return ''

  const entry = vietnameseVocabMap[props.question.wordId]
  if (!entry) return ''

  switch (props.question.questionType) {
    case 'EnglishToVietnamese':
      return entry.e
    case 'VietnameseToEnglish':
      return entry.v
    default:
      return ''
  }
}

const spokenWord = computed(() => {
  if (!props.question) return ''
  return vietnameseVocabMap[props.question.wordId]?.v ?? ''
})
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
  color: #c2410c;
  text-transform: uppercase;
  letter-spacing: 0.45px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(194, 65, 12, 0.25);
  background: rgba(194, 65, 12, 0.12);
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

.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  max-width: 100%;
  margin-top: 16px;
}

.option-button {
  @mixin title 24px;
  padding: 20px 14px;
  background: linear-gradient(135deg, #f97316, #ea580c);
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
  box-shadow: 0 10px 20px rgba(249, 115, 22, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 24px rgba(249, 115, 22, 0.3);
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
