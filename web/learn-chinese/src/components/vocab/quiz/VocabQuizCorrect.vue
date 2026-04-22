<template>
  <div class="vocab-quiz-correct" @click="$emit('next')">
    <div class="status-icon correct">✓</div>
    <div class="status-text">Correct!</div>
    <button class="audio-button" :disabled="isPlaying" @click.stop="$emit('playAudio')">
      {{ isPlaying ? 'Playing...' : 'Listen' }}
    </button>
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

.audio-button {
  @mixin title-regular 15px;
  border: 1px solid rgba(31, 157, 18, 0.24);
  background: rgba(31, 157, 18, 0.08);
  color: $correct;
  border-radius: 999px;
  padding: 10px 18px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
}

.character-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px 16px;
  background: linear-gradient(135deg, #eef7ff, #def1ff);
  border-radius: 12px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(50, 130, 184, 0.18);
}

@media (max-width: 640px) {
  .chinese {
    font-size: 30px;
  }
}
</style>
