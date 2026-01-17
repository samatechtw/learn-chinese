<template>
  <div class="vocab-quiz-wrap">
    <div class="vocab-quiz container f-col">
      <div class="header">
        <div class="title-block">
          <PageNav :nav="['Home', 'VocabQuiz']" />
          <h1 class="hero-title">
            {{ ts('vocab.quiz') }}
          </h1>
          <p class="subtitle">
            {{ ts('vocab.quiz_text') }}
          </p>
        </div>
        <div class="meta">
          <div class="pill">
            <span>{{ ts('progress') }}</span>
            <strong>{{ `${displayIndex} / ${characterIds.length}` }}</strong>
          </div>
          <div class="pill score-pill">
            <span>{{ ts('score') }}</span>
            <strong>{{ score }}</strong>
          </div>
        </div>
      </div>
      <div class="card-shell">
        <div class="card-wrap f-center-col">
          <MoeDictionaryModal class="dictionary-lookup" :word="currentLookupWord" />
          <Transition name="fade" mode="out-in">
            <div
              v-if="questionState === 'init'"
              class="card init-card"
              @click="checkInactive"
            >
              <div class="card-title">
                {{ ts('start_quiz') }}
              </div>
              <div class="card-text">Click to start</div>
            </div>
            <VocabQuizComplete
              v-else-if="questionState === 'complete'"
              :questions="questions"
              :score="score"
              class="card"
              @restart="restartQuiz"
            />
            <VocabQuizCorrect
              v-else-if="questionState === 'correct'"
              :question="currentQuestion"
              class="card"
              @next="checkInactive()"
            />
            <VocabQuizIncorrect
              v-else-if="questionState === 'incorrect'"
              :question="currentQuestion"
              class="card"
              @next="checkInactive()"
            />
            <VocabQuizActive
              v-else-if="questionState === 'active'"
              :question="currentQuestion"
              :options="currentOptions"
              class="card"
              @selectAnswer="selectAnswer"
            />
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { store } from '@frontend/store'
import { IVocabQuizState, VocabQuestionType, IVocabQuizQuestion } from '@frontend/types'
import { PageNav } from '@frontend/components/widgets'
import { ts } from '@frontend/i18n'
import { hsk1 } from '@frontend/util/characters'
import MoeDictionaryModal from '../MoeDictionaryModal.vue'
import VocabQuizActive from './VocabQuizActive.vue'
import VocabQuizCorrect from './VocabQuizCorrect.vue'
import VocabQuizIncorrect from './VocabQuizIncorrect.vue'
import VocabQuizComplete from './VocabQuizComplete.vue'

const currentOptions = ref<string[]>([])
const lastOptionIndex = ref<number | null>(null)

const questionState = computed(() => {
  return store.vocab.quiz.value?.questionState ?? 'init'
})

const currentIndex = computed(() => {
  return store.vocab.quiz.value?.index ?? 0
})

const displayIndex = computed(() => {
  if (store.vocab.quiz.value?.questionState === 'complete') {
    return characterIds.value.length
  }
  return currentIndex.value + 1
})

const characterIds = computed(() => {
  return store.vocab.quiz.value?.characterIds ?? []
})

const questions = computed(() => {
  return store.vocab.quiz.value?.questions ?? []
})

const score = computed(() => {
  return store.vocab.quiz.value?.score ?? 0
})

const currentQuestion = computed(() => {
  if (currentIndex.value >= questions.value.length) {
    return null
  }
  return questions.value[currentIndex.value]
})

const currentLookupWord = computed(() => {
  if (currentQuestion.value) {
    return currentQuestion.value.characterId
  }
  if (characterIds.value.length === 0) {
    return ''
  }
  const safeIndex = Math.min(currentIndex.value, characterIds.value.length - 1)
  return characterIds.value[safeIndex] ?? ''
})

const getRandomQuestionType = (): VocabQuestionType => {
  const types: VocabQuestionType[] = [
    'EnglishToChinese',
    'ChineseToPinyin',
    'ChineseToEnglish',
  ]
  return types[Math.floor(Math.random() * types.length)]
}

const generateQuestion = (charId: string): IVocabQuizQuestion => {
  const char = hsk1[charId]
  if (!char) {
    throw new Error(`Character ${charId} not found in HSK1`)
  }

  const questionType = getRandomQuestionType()
  let correctAnswer = ''

  switch (questionType) {
    case 'EnglishToChinese':
      correctAnswer = charId
      break
    case 'ChineseToPinyin':
      correctAnswer = char.p
      break
    case 'ChineseToEnglish':
      correctAnswer = char.e || ''
      break
  }

  return {
    characterId: charId,
    questionType,
    correctAnswer,
  }
}

const generateOptions = (question: IVocabQuizQuestion): string[] => {
  const allChars = Object.keys(hsk1)
  const options: string[] = [question.correctAnswer]

  const optionFn: (char: string) => string = {
    EnglishToChinese: (char: string) => char,
    ChineseToPinyin: (char: string) => hsk1[char].p,
    ChineseToEnglish: (char: string) => hsk1[char].e || '',
  }[question.questionType]

  while (options.length < 4) {
    const randomChar = allChars[Math.floor(Math.random() * allChars.length)]
    const randomOption = optionFn(randomChar)

    if (!options.includes(randomOption)) {
      options.push(randomOption)
    }
  }

  return options.sort(() => Math.random() - 0.5)
}

const syncOptions = () => {
  if (questionState.value === 'active' && currentQuestion.value) {
    if (
      lastOptionIndex.value !== currentIndex.value ||
      currentOptions.value.length === 0
    ) {
      currentOptions.value = generateOptions(currentQuestion.value)
      lastOptionIndex.value = currentIndex.value
    }
  } else {
    lastOptionIndex.value = null
    currentOptions.value = []
  }
}

const startQuestion = () => {
  const now = Date.now()
  const state: Partial<IVocabQuizState> = {
    questionState: 'active',
    questionStart: now,
  }

  if (questionState.value === 'init') {
    state.quizStart = now
  } else {
    state.index = currentIndex.value + 1
  }

  store.vocab.setQuiz(state)

  syncOptions()
}

const checkInactive = (): boolean => {
  const isLast = currentIndex.value >= characterIds.value.length - 1

  if (questionState.value === 'complete') {
    return true
  } else if (questionState.value !== 'active' && isLast) {
    store.vocab.setQuiz({ questionState: 'complete', quizEnd: Date.now() })
    return true
  } else if (questionState.value === 'correct' || questionState.value === 'init') {
    startQuestion()
    return true
  } else if (questionState.value === 'incorrect') {
    startQuestion()
    return true
  }
  return false
}

const selectAnswer = (answer: string) => {
  if (!currentQuestion.value || questionState.value !== 'active') {
    return
  }

  const isCorrect = answer === currentQuestion.value.correctAnswer
  const questionTime = Date.now() - (store.vocab.quiz.value?.questionStart ?? 0)

  if (isCorrect) {
    const prevScore = store.vocab.quiz.value?.score ?? 0
    store.vocab.setQuiz({
      score: prevScore + 1,
      questionTime,
      questionState: 'correct',
    })
  } else {
    const updatedQuestions = [...questions.value]
    updatedQuestions[currentIndex.value] = {
      ...currentQuestion.value,
      wrongGuess: answer,
    }
    store.vocab.setQuiz({
      questions: updatedQuestions,
      questionTime,
      questionState: 'incorrect',
    })
  }
}

const restartQuiz = () => {
  const order = store.vocab.quizOptions.value.order
  const hskLevel = store.vocab.quizOptions.value.hskLevel

  let characterIds = Object.keys(hsk1)

  if (order === 'random') {
    characterIds = characterIds.sort(() => Math.random() - 0.5)
  }

  const limit = store.vocab.quizOptions.value.count || 'all'
  if (limit !== 'all') {
    characterIds = characterIds.slice(0, parseInt(limit))
  }

  const generatedQuestions = characterIds.map((charId) => generateQuestion(charId))

  store.vocab.setQuizOptions({ cheating: false })
  store.vocab.setQuiz({
    index: 0,
    characterIds,
    questions: generatedQuestions,
    score: 0,
    questionState: 'init',
    quizStart: Date.now(),
    cheated: false,
    reviewing: false,
  })
}

onMounted(() => {
  if (!store.vocab.quiz.value || characterIds.value.length === 0) {
    restartQuiz()
  } else {
    syncOptions()
  }
})
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.vocab-quiz-wrap {
  background: linear-gradient(130deg, #bbe1fa 0%, #e6f1ff 45%, #f7fbff 100%);
  color: $text1;
}
.hero-title {
  @mixin title 36px;
  margin: 12px 0 6px 0;
  color: $color2;
}
.vocab-quiz {
  min-height: calc(100vh - $header-height);
  padding: 96px 0 140px;
  align-items: stretch;
}
.header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 24px;
}
.title-block {
  flex: 1;
  min-width: 260px;
}
.subtitle {
  @mixin text 16px;
  color: $text2;
  max-width: 560px;
}
.meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
}
.pill {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(50, 130, 184, 0.18);
  border-radius: 14px;
  padding: 12px 16px;
  min-width: 160px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.pill span {
  @mixin title-regular 12px;
  color: $text2;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.pill strong {
  @mixin title 20px;
  color: $text1;
}
.score-pill {
  background: linear-gradient(135deg, #3282b8, #5db8ff);
  border: none;
  color: white;
}
.score-pill span {
  color: rgba(255, 255, 255, 0.86);
}
.score-pill strong {
  color: white;
}
.card-shell {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
.card-wrap {
  margin-top: 0;
  max-width: 760px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(50, 130, 184, 0.2);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.12);
  position: relative;
}
.init-card {
  cursor: pointer;
  width: 100%;
  padding: 28px 12px;
}
.dictionary-lookup {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
}

@media (max-width: 720px) {
  .vocab-quiz {
    padding: 88px 0 120px;
  }
  .hero-title {
    font-size: 30px;
  }
  .subtitle {
    font-size: 15px;
  }
  .pill {
    min-width: 140px;
  }
  .card-wrap {
    padding: 22px 20px;
  }
}
</style>
