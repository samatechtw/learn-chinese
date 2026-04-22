<template>
  <div class="vocab-quiz-incorrect" @click="$emit('next')">
    <div class="status-icon incorrect">✗</div>
    <div class="status-text">Incorrect</div>
    <button class="audio-button" :disabled="isPlaying" @click.stop="$emit('playAudio')">
      {{ isPlaying ? 'Playing...' : 'Listen' }}
    </button>
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
import { IVocabQuizQuestion } from '@learn-chinese/types'
import { hsk1 } from '@learn-chinese/util/characters'

interface Props {
  isPlaying: boolean
  question: IVocabQuizQuestion | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  next: []
  playAudio: []
}>()

const getCharInfo = () => {
  if (!props.question) return null
  return hsk1[props.question.characterId]
}
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

.audio-button {
  @mixin title-regular 15px;
  border: 1px solid rgba(224, 40, 24, 0.2);
  background: rgba(224, 40, 24, 0.08);
  color: $incorrect;
  border-radius: 999px;
  padding: 10px 18px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
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

.character-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px 16px;
  background: linear-gradient(135deg, #fff2f2, #ffecec);
  border-radius: 12px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(224, 40, 24, 0.15);
}

@media (max-width: 640px) {
  .answer-info {
    flex-direction: column;
    align-items: stretch;
  }
  .chinese {
    font-size: 30px;
  }
}
</style>
