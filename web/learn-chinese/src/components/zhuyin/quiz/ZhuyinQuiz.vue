<template>
  <div class="zhuyin-quiz-wrap">
    <div class="zhuyin-quiz container f-col">
      <PageNav :nav="['Home', 'Zhuyin', 'ZhuyinQuiz']" />
      <h1 class="hero-title">
        {{ ts('zhuyin.quiz') }}
      </h1>
      <div class="progress-wrap">
        <div>{{ ts('progress') }}</div>
        <div class="progress">
          {{ `${index} / ${symbolKeys.length}` }}
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
          <ZhuyinQuizCorrect
            v-else-if="questionState === 'correct'"
            :symbol="entry.s"
            class="card"
          />
          <ZhuyinQuizIncorrect
            v-else-if="questionState === 'incorrect'"
            :entry="entry"
            :card="card"
            class="card"
          />
          <ZhuyinQuizComplete
            v-else-if="questionState === 'complete'"
            :symbolKeys="symbolKeys"
            class="card"
            @restart="restartQuiz"
            @review="reviewMissed"
          />
          <ZhuyinQuizActive
            v-else-if="questionState === 'active'"
            :symbol="entry?.s"
            :card="card"
            class="card"
            @sayCurrentSymbol="sayCurrentSymbol"
            @setAnswer="setAnswer"
          />
        </Transition>
      </div>
      <ZhuyinQuizOptions />
      <ZhuyinKeyboard
        v-if="!store.zhuyin.quizOptions.value.hideKeyboard"
        class="quiz-keyboard"
        :showPinyin="showPinyin"
        :hideZhuyin="store.zhuyin.quizOptions.value.reverse"
        @press="setAnswer"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { store } from '@frontend/store'
import {
  IZhuyinKeyInfo,
  IZhuyinQuizQuestion,
  IZhuyinQuizState,
  KeyType,
} from '@frontend/types'
import { zhuyinSymbols } from '@frontend/util/zhuyin'
import { shuffleArray } from '@frontend/util/misc'
import { PageNav, ZhuyinKeyboard } from '@frontend/components/widgets'
import { ts } from '../../../i18n'
import { saySymbol } from '@frontend/util/speech'
import ZhuyinQuizCorrect from './ZhuyinQuizCorrect.vue'
import ZhuyinQuizIncorrect from './ZhuyinQuizIncorrect.vue'
import ZhuyinQuizComplete from './ZhuyinQuizComplete.vue'
import ZhuyinQuizActive from './ZhuyinQuizActive.vue'
import ZhuyinQuizOptions from './ZhuyinQuizOptions.vue'

const entry = ref()

const showPinyin = computed(() => {
  return store.zhuyin.quizOptions.value.cheating || store.zhuyin.quizOptions.value.reverse
})

const questionState = computed(() => {
  return store.zhuyin.quiz.value?.questionState ?? 'init'
})

const index = computed(() => {
  if (store.zhuyin.quiz.value?.questionState === 'complete') {
    return symbolKeys.value.length
  }
  return store.zhuyin.quiz.value?.index ?? 0
})

const symbolKeys = computed(() => {
  return (store.zhuyin.quiz.value?.symbolKeys ?? Object.keys(zhuyinSymbols)) as KeyType[]
})

const currentKey = computed(() => {
  const ind =
    index.value >= symbolKeys.value.length ? symbolKeys.value.length - 1 : index.value
  return symbolKeys.value[ind] as KeyType
})

const card = computed<IZhuyinQuizQuestion>(() => {
  const symbol = zhuyinSymbols[currentKey.value] as IZhuyinKeyInfo
  const reverse = store.zhuyin.quizOptions.value.reverse
  return {
    question: reverse ? symbol.s : symbol.p,
    answer: reverse ? symbol.p : symbol.s,
    audio: symbol.audio,
  }
})

const sayCurrentSymbol = () => {
  const key = symbolKeys.value[index.value] as KeyType
  if (key) {
    const symbol = zhuyinSymbols[key] as IZhuyinKeyInfo
    saySymbol(symbol.s)
  }
}

const startQuestion = () => {
  entry.value = undefined
  const now = Date.now()
  const state: Partial<IZhuyinQuizState> = {
    questionState: 'active',
    questionStart: now,
  }
  if (questionState.value === 'init') {
    state.quizStart = now
  } else {
    state.index = index.value + 1
  }
  store.zhuyin.setQuiz(state)
  sayCurrentSymbol()
}

const recordCorrect = () => {
  const reviewing = store.zhuyin.quiz.value?.reviewing
  const prevScore = store.zhuyin.quiz.value?.score ?? 0
  const questionTime = Date.now() - (store.zhuyin.quiz.value?.questionStart ?? 0)
  let score = 5
  if (questionTime < 1000) {
    score += 5
  } else if (questionTime < 2000) {
    score += 4
  } else if (questionTime < 3000) {
    score += 3
  } else if (questionTime < 4000) {
    score += 2
  } else if (questionTime < 5000) {
    score += 1
  }
  store.zhuyin.setQuiz({
    score: reviewing ? prevScore : prevScore + score,
    questionTime,
    questionState: 'correct',
  })
}

const recordIncorrect = (key: KeyType) => {
  const incorrect = [...(store.zhuyin.quiz.value?.incorrect ?? [])]
  incorrect.push(currentKey.value)
  const questionTime = Date.now() - (store.zhuyin.quiz.value?.questionStart ?? 0)
  store.zhuyin.setQuiz({ incorrect, questionTime, questionState: 'incorrect' })
}

const getAnswer = (symbol: IZhuyinKeyInfo) => {
  const reverse = store.zhuyin.quizOptions.value.reverse
  return reverse ? symbol.p : symbol.s
}

// Returns true if there is no active question
// Starts question if inactive and not complete.
// Completes quiz if inactive and last question has been answered.
// If the current question was incorrect, the answer must be entered to continue.
const checkInactive = (char?: string): boolean => {
  const isLast = index.value >= symbolKeys.value.length - 1

  if (char === 'Meta' || char === 'Tab' || questionState.value === 'complete') {
    return true
  } else if (questionState.value != 'active' && isLast) {
    // Finish the quiz if the answer was correct or the right key is pressed
    if (questionState.value === 'correct' || char === currentKey.value) {
      store.zhuyin.quizComplete()
    }
    return true
  } else if (questionState.value === 'correct' || questionState.value === 'init') {
    startQuestion()
    return true
  } else if (questionState.value === 'incorrect') {
    // Must enter the correct key to continue after a wrong answer
    if (char === currentKey.value) {
      startQuestion()
    }
    return true
  }
  return false
}

const setAnswer = (char: string, event?: KeyboardEvent) => {
  if (event?.metaKey || checkInactive(char)) {
    return
  }
  const key = char as KeyType
  const symbol = zhuyinSymbols[key]
  if (!symbol) {
    return
  }
  entry.value = symbol
  if (getAnswer(symbol) === card.value.answer) {
    recordCorrect()
  } else {
    recordIncorrect(key)
  }
}

const reviewMissed = () => {
  const incorrect = store.zhuyin.quiz.value?.incorrect
  if (incorrect?.length) {
    entry.value = undefined
    store.zhuyin.setQuiz({
      index: 0,
      symbolKeys: [...incorrect],
      incorrect: [],
      questionState: 'active',
      questionStart: Date.now(),
      reviewing: true,
    })
    sayCurrentSymbol()
  }
}

const restartQuiz = () => {
  const order = store.zhuyin.quizOptions.value.order
  let symbolKeys = Object.keys(zhuyinSymbols).filter(
    (s) => !['3', '4', '6', '7'].includes(s),
  ) as KeyType[]
  if (order === 'random') {
    shuffleArray(symbolKeys)
  } else {
    const d = store.zhuyin.quizDifficulty.value
    symbolKeys = symbolKeys.sort((a, b) => (d[a] ?? 0) - (d[b] ?? 0))
  }
  const limit = store.zhuyin.quizOptions.value.count || 'all'
  if (limit !== 'all') {
    symbolKeys = symbolKeys.slice(0, parseInt(limit))
  }
  store.zhuyin.setQuizOptions({ cheating: false })
  store.zhuyin.setQuiz({
    index: 0,
    symbolKeys,
    incorrect: [],
    score: 0,
    questionState: 'init',
    quizStart: Date.now(),
    cheated: false,
    reviewing: false,
  })
}

onMounted(() => {
  if (!store.zhuyin.quiz.value) {
    restartQuiz()
  }
})
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.zhuyin-quiz-wrap {
  background: $color4;
}
.hero-title {
  @mixin title 32px;
  margin: 16px 0 0 0;
}
.zhuyin-quiz {
  min-height: calc(100vh - $header-height);
  padding: 120px 0 160px;
  align-items: center;
}
.progress-wrap {
  @mixin title-regular 17px;
  display: flex;
  align-items: center;
  margin-top: 12px;
}
.progress {
  font-weight: 700;
  margin-left: 6px;
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.card-wrap {
  margin-top: 16px;
  border: 1px solid black;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  padding: 32px 24px;
  min-height: 254px;
  text-align: center;
  position: relative;
}
</style>
