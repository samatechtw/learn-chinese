<template>
  <div class="vocab-quiz-wrap">
    <div class="vocab-quiz container f-col">
      <div class="header">
        <div class="title-block">
          <PageNav
            :nav="
              getLanguageBreadcrumbs('vietnamese', {
                name: navRouteName,
                label: navLabel,
              })
            "
          />
          <h1 class="hero-title">
            {{ quizTitle }}
          </h1>
          <p class="subtitle">
            {{ quizSubtitle }}
          </p>
        </div>
        <div class="meta">
          <div class="pill">
            <span>{{ ts('progress') }}</span>
            <strong>{{ `${displayIndex} / ${wordIds.length}` }}</strong>
          </div>
          <div class="pill score-pill">
            <span>{{ ts('score') }}</span>
            <strong>{{ score }}</strong>
          </div>
        </div>
      </div>
      <div class="card-shell">
        <div class="card-wrap f-center-col">
          <Transition name="fade" mode="out-in">
            <div v-if="questionState === 'init'" class="card init-card" @click="checkInactive">
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
import { computed, onMounted, ref, watch } from 'vue'
import { PageNav } from '@frontend/components/widgets'
import { ts } from '@frontend/i18n'
import { getLanguageBreadcrumbs } from '@frontend/util/misc'
import { store } from '@learn-vietnamese/store'
import {
  IVietnameseQuizQuestion,
  IVietnameseQuizState,
  VietnameseQuizMode,
  VietnameseQuestionType,
} from '@learn-vietnamese/types'
import { vietnameseVocabMap } from '@learn-vietnamese/data/vocab'
import VocabQuizActive from './VocabQuizActive.vue'
import VocabQuizCorrect from './VocabQuizCorrect.vue'
import VocabQuizIncorrect from './VocabQuizIncorrect.vue'
import VocabQuizComplete from './VocabQuizComplete.vue'

interface Props {
  questionMode?: VietnameseQuizMode
  title?: string
  subtitle?: string
  routeName?: string
}

const props = withDefaults(defineProps<Props>(), {
  questionMode: 'EnglishToVietnamese',
})

const currentOptions = ref<string[]>([])
const lastOptionIndex = ref<number | null>(null)

const navRouteName = computed(() => {
  if (props.routeName) return props.routeName
  return props.questionMode === 'VietnameseToEnglish'
    ? 'VietnameseVocabQuizReverse'
    : 'VietnameseVocabQuiz'
})

const quizTitle = computed(() => {
  if (props.title) return props.title
  if (props.questionMode === 'VietnameseToEnglish') {
    return ts('vietnamese.vocab_quiz_reverse')
  }
  return ts('vietnamese.vocab_quiz')
})

const quizSubtitle = computed(() => {
  if (props.subtitle) return props.subtitle
  if (props.questionMode === 'VietnameseToEnglish') {
    return ts('vietnamese.vocab_quiz_reverse_text')
  }
  return ts('vietnamese.vocab_quiz_text')
})

const navLabel = computed(() => quizTitle.value)

const questionState = computed(() => {
  return store.vocab.quiz.value?.questionState ?? 'init'
})

const currentIndex = computed(() => {
  return store.vocab.quiz.value?.index ?? 0
})

const displayIndex = computed(() => {
  if (store.vocab.quiz.value?.questionState === 'complete') {
    return wordIds.value.length
  }
  return currentIndex.value + 1
})

const wordIds = computed(() => {
  return store.vocab.quiz.value?.wordIds ?? []
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

const getRandomQuestionType = (): VietnameseQuestionType => {
  const types: VietnameseQuestionType[] = ['EnglishToVietnamese', 'VietnameseToEnglish']
  return types[Math.floor(Math.random() * types.length)]
}

const getQuestionType = (): VietnameseQuestionType => {
  if (props.questionMode === 'Mixed') {
    return getRandomQuestionType()
  }
  return props.questionMode
}

const generateQuestion = (wordId: string): IVietnameseQuizQuestion => {
  const entry = vietnameseVocabMap[wordId]
  if (!entry) {
    throw new Error(`Word ${wordId} not found in Vietnamese vocab list`)
  }

  const questionType = getQuestionType()
  let correctAnswer = ''

  switch (questionType) {
    case 'EnglishToVietnamese':
      correctAnswer = entry.v
      break
    case 'VietnameseToEnglish':
      correctAnswer = entry.e
      break
  }

  return {
    wordId: entry.v,
    questionType,
    correctAnswer,
  }
}

const generateOptions = (question: IVietnameseQuizQuestion): string[] => {
  const allWords = Object.keys(vietnameseVocabMap)
  const options: string[] = [question.correctAnswer]

  const optionFn: (wordId: string) => string = {
    EnglishToVietnamese: (wordId: string) => vietnameseVocabMap[wordId].v,
    VietnameseToEnglish: (wordId: string) => vietnameseVocabMap[wordId].e,
  }[question.questionType]

  while (options.length < 4) {
    const randomWord = allWords[Math.floor(Math.random() * allWords.length)]
    const randomOption = optionFn(randomWord)

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
  const state: Partial<IVietnameseQuizState> = {
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
  const isLast = currentIndex.value >= wordIds.value.length - 1

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

  let wordIds = Object.keys(vietnameseVocabMap)

  if (order === 'random') {
    wordIds = wordIds.sort(() => Math.random() - 0.5)
  }

  const limit = store.vocab.quizOptions.value.count || 'all'
  if (limit !== 'all') {
    wordIds = wordIds.slice(0, parseInt(limit))
  }

  const generatedQuestions = wordIds.map((wordId) => generateQuestion(wordId))

  store.vocab.setQuizOptions({ cheating: false })
  store.vocab.setQuiz({
    index: 0,
    wordIds,
    questions: generatedQuestions,
    score: 0,
    questionState: 'init',
    quizStart: Date.now(),
    cheated: false,
    reviewing: false,
  })
}

onMounted(() => {
  if (!store.vocab.quiz.value || wordIds.value.length === 0) {
    restartQuiz()
  } else {
    syncOptions()
  }
})

watch(
  () => props.questionMode,
  () => {
    restartQuiz()
  },
)
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.vocab-quiz-wrap {
  background: radial-gradient(circle at top, #ffe8d1 0%, #fff7ed 45%, #ffffff 100%);
  color: $text1;
}
.hero-title {
  @mixin title 36px;
  margin: 12px 0 6px 0;
  color: #c2410c;
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
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(194, 65, 12, 0.18);
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
  background: linear-gradient(135deg, #f97316, #ea580c);
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
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(194, 65, 12, 0.18);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.12);
  position: relative;
}
.init-card {
  cursor: pointer;
  width: 100%;
  padding: 28px 12px;
}
</style>
