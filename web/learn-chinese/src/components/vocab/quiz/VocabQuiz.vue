<template>
  <div class="vocab-quiz-wrap">
    <div class="vocab-quiz container f-col">
      <PageNav :nav="['Home', 'Vocab', 'VocabQuiz']" />
      <h1 class="hero-title">
        {{ ts('vocab.quiz') }}
      </h1>
      <div class="progress-wrap">
        <div>{{ ts('progress') }}</div>
        <div class="progress">
          {{ `${index} / ${characterIds.length}` }}
        </div>
      </div>
      <div class="card-wrap f-center-col" @click="checkInactive()">
        <Transition name="fade" mode="out-in">
          <div v-if="questionState === 'init'" class="card">
            <div class="card-title">
              {{ ts('start_quiz') }}
            </div>
            <div class="card-text">
              {{ ts('continue') }}
            </div>
          </div>
          <div v-else-if="questionState === 'complete'" class="card">
            <div class="card-title">
              {{ ts('quiz_complete') }}
            </div>
            <div class="card-text">
              {{ ts('score') }} {{ score }}
            </div>
            <div class="buttons">
              <AppButton :text="ts('restart')" @click="restartQuiz" class="restart" />
            </div>
          </div>
          <div v-else class="card">
            <div class="card-title">Quiz in progress</div>
            <div class="card-text">Character quiz placeholder</div>
          </div>
        </Transition>
      </div>
      <div class="quiz-options">
        <div class="option-text">
          HSK Level: {{ store.vocab.quizOptions.value.hskLevel }}
        </div>
        <div class="option-text">
          Count: {{ store.vocab.quizOptions.value.count }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { store } from '@frontend/store'
import { IVocabQuizState } from '@frontend/types'
import { PageNav, AppButton } from '@frontend/components/widgets'
import { ts } from '../../../i18n'

const questionState = computed(() => {
  return store.vocab.quiz.value?.questionState ?? 'init'
})

const index = computed(() => {
  if (store.vocab.quiz.value?.questionState === 'complete') {
    return characterIds.value.length
  }
  return store.vocab.quiz.value?.index ?? 0
})

const characterIds = computed(() => {
  return store.vocab.quiz.value?.characterIds ?? []
})

const score = computed(() => {
  return store.vocab.quiz.value?.score ?? 0
})

const startQuestion = () => {
  const now = Date.now()
  const state: Partial<IVocabQuizState> = {
    questionState: 'active',
    questionStart: now,
  }
  if (questionState.value === 'init') {
    state.quizStart = now
  } else {
    state.index = index.value + 1
  }
  store.vocab.setQuiz(state)
}

const checkInactive = (): boolean => {
  if (questionState.value === 'complete') {
    return true
  } else if (questionState.value === 'init') {
    startQuestion()
    return true
  }
  return false
}

const restartQuiz = () => {
  const order = store.vocab.quizOptions.value.order
  // TODO: Load actual character data based on HSK level
  let characterIds: string[] = []

  // Placeholder: Create dummy character IDs for now
  const hskLevel = store.vocab.quizOptions.value.hskLevel
  const totalChars = hskLevel === 'hsk1' ? 150 : 500 // HSK1 has ~150 chars
  characterIds = Array.from({ length: totalChars }, (_, i) => `char_${i}`)

  if (order === 'random') {
    characterIds = characterIds.sort(() => Math.random() - 0.5)
  }

  const limit = store.vocab.quizOptions.value.count || 'all'
  if (limit !== 'all') {
    characterIds = characterIds.slice(0, parseInt(limit))
  }

  store.vocab.setQuizOptions({ cheating: false })
  store.vocab.setQuiz({
    index: 0,
    characterIds,
    incorrect: [],
    score: 0,
    questionState: 'init',
    quizStart: Date.now(),
    cheated: false,
    reviewing: false,
  })
}

onMounted(() => {
  if (!store.vocab.quiz.value) {
    restartQuiz()
  }
})
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.vocab-quiz-wrap {
  background: $color4;
}
.hero-title {
  @mixin title 32px;
  margin: 16px 0 0 0;
}
.vocab-quiz {
  min-height: calc(100vh - $header-height);
  padding: 120px 0 160px;
  align-items: center;
}
.progress-wrap {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  @mixin title-regular 16px;
}
.progress {
  font-weight: 600;
}
.card-wrap {
  margin-top: 32px;
  cursor: pointer;
}
.card-title {
  @mixin title 24px;
  margin-bottom: 16px;
}
.card-text {
  @mixin title-regular 16px;
  color: $text2;
}
.buttons {
  margin-top: 24px;
  display: flex;
  gap: 16px;
  justify-content: center;
}
.quiz-options {
  margin-top: 32px;
  display: flex;
  gap: 24px;
}
.option-text {
  @mixin title-regular 14px;
  color: $text2;
}
</style>
