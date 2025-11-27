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
          {{ `${displayIndex} / ${characterIds.length}` }}
        </div>
      </div>
      <div class="card-wrap f-center-col">
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
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { store } from '@frontend/store'
import { IVocabQuizState, VocabQuestionType, IVocabQuizQuestion } from '@frontend/types'
import { PageNav } from '@frontend/components/widgets'
import { ts } from '../../../i18n'
import { hsk1 } from '@frontend/util/characters'
import VocabQuizActive from './VocabQuizActive.vue'
import VocabQuizCorrect from './VocabQuizCorrect.vue'
import VocabQuizIncorrect from './VocabQuizIncorrect.vue'
import VocabQuizComplete from './VocabQuizComplete.vue'

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

const currentOptions = ref<string[]>([])

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

  if (currentQuestion.value) {
    currentOptions.value = generateOptions(currentQuestion.value)
  }
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
}
.init-card {
  cursor: pointer;
  width: 100%;
  padding: 32px;
}
</style>
