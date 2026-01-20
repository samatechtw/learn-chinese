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
        <div v-for="(question, index) in incorrectQuestions" :key="index" class="mistake-item">
          <div class="mistake-word">{{ question.wordId }}</div>
          <div class="mistake-details">
            <div class="detail-row">
              <span class="detail-label">English:</span>
              <span>{{ getWordInfo(question.wordId)?.e }}</span>
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
      <button class="restart-button" @click="$emit('restart')">Restart Quiz</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { IVietnameseQuizQuestion } from '@learn-vietnamese/types'
import { vietnameseVocabMap } from '@learn-vietnamese/data/vocab'

interface Props {
  questions: IVietnameseQuizQuestion[]
  score: number
}

const props = defineProps<Props>()

defineEmits<{
  restart: []
}>()

const percentage = computed(() => {
  if (props.questions.length === 0) return 0
  return Math.round((props.score / props.questions.length) * 100)
})

const incorrectQuestions = computed(() => {
  return props.questions.filter((q) => q.wrongGuess)
})

const getWordInfo = (wordId: string) => {
  return vietnameseVocabMap[wordId]
}
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.vocab-quiz-complete {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.completion-icon {
  font-size: 46px;
}

.title {
  @mixin title 26px;
  color: #c2410c;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 22px 20px;
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
  border-radius: 14px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(194, 65, 12, 0.2);
}

.score-label {
  @mixin title-regular 12px;
  color: $text2;
  text-transform: uppercase;
}

.score-value {
  @mixin title 34px;
}

.score-percentage {
  @mixin title-regular 17px;
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
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  border: 1px solid rgba(194, 65, 12, 0.18);
  box-sizing: border-box;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
}

.mistake-word {
  @mixin title 24px;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.mistake-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.detail-row {
  @mixin title-regular 14px;
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
  margin-top: 10px;
}

.restart-button {
  @mixin title 14px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 10px 22px rgba(249, 115, 22, 0.26);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 26px rgba(249, 115, 22, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .score-value {
    font-size: 30px;
  }
  .mistake-item {
    flex-direction: column;
  }
}
</style>
