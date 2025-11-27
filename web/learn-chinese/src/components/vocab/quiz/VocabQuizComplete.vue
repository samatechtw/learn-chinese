<template>
  <div class="vocab-quiz-complete">
    <div class="completion-icon">🎉</div>
    <div class="title">Quiz Complete!</div>
    <div class="score-display">
      <div class="score-label">Your Score</div>
      <div class="score-value">{{ score }} / {{ questions.length }}</div>
      <div class="score-percentage">{{ percentage }}%</div>
    </div>
    <div v-if="incorrectQuestions.length > 0" class="mistakes-section">
      <div class="mistakes-title">Questions to Review:</div>
      <div class="mistakes-list">
        <div
          v-for="(question, index) in incorrectQuestions"
          :key="index"
          class="mistake-item"
        >
          <div class="mistake-char">{{ question.characterId }}</div>
          <div class="mistake-details">
            <div class="detail-row">
              <span class="detail-label">Pinyin:</span>
              <span>{{ getCharInfo(question.characterId)?.p }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">English:</span>
              <span>{{ getCharInfo(question.characterId)?.e }}</span>
            </div>
            <div class="detail-row wrong">
              <span class="detail-label">Your answer:</span>
              <span>{{ question.wrongGuess }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <button class="restart-button" @click="$emit('restart')">
        Restart Quiz
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { IVocabQuizQuestion } from '@frontend/types'
import { hsk1 } from '@frontend/util/characters'

interface Props {
  questions: IVocabQuizQuestion[]
  score: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  restart: []
}>()

const percentage = computed(() => {
  if (props.questions.length === 0) return 0
  return Math.round((props.score / props.questions.length) * 100)
})

const incorrectQuestions = computed(() => {
  return props.questions.filter(q => q.wrongGuess)
})

const getCharInfo = (charId: string) => {
  return hsk1[charId]
}
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.vocab-quiz-complete {
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.completion-icon {
  font-size: 48px;
}

.title {
  @mixin title 28px;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: $color3;
  border-radius: 8px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.score-label {
  @mixin title-regular 12px;
  color: $text2;
  text-transform: uppercase;
}

.score-value {
  @mixin title 36px;
}

.score-percentage {
  @mixin title-regular 18px;
  color: $text2;
}

.mistakes-section {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
}

.mistakes-title {
  @mixin title 18px;
  text-align: center;
}

.mistakes-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.mistake-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: $color3;
  border-radius: 8px;
  border: 1px solid $border1;
  box-sizing: border-box;
}

.mistake-char {
  @mixin title 28px;
  min-width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mistake-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.detail-row {
  @mixin title-regular 13px;
  display: flex;
  gap: 8px;

  &.wrong {
    color: rgb(239, 68, 68);
  }
}

.detail-label {
  font-weight: 600;
  min-width: 90px;
  flex-shrink: 0;
}

.buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.restart-button {
  @mixin title 14px;
  padding: 10px 24px;
  background: $primary;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
