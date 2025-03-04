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
          <div v-else-if="questionState === 'correct'" class="card correct">
            <div class="card-title">
              {{ `${ts('correct')} (${questionTime}s)` }}
            </div>
            <div class="card-text">
              {{ ts('continue') }}
            </div>
            <STInput :modelValue="entry" class="entry" />
          </div>
          <div v-else-if="questionState === 'incorrect'" class="card incorrect">
            <div class="card-title">
              {{ ts('incorrect') }}
            </div>
            <div class="card-text">
              {{ ts('continue_correct') }}
            </div>
            <div class="incorrect-inputs">
              <STInput :modelValue="entry" class="entry" />
              <STInput :modelValue="card.answer" class="entry correct" />
            </div>
          </div>
          <div v-else-if="questionState === 'complete'" class="card">
            <div class="card-title">
              {{ `${ts('quiz_complete')} (${quizTime}s)` }}
            </div>
            <div class="result">
              <div class="result-count">
                {{ `${getCorrectCount()} / ${symbolKeys.length}` }}
              </div>
              <div class="result-percent">
                {{ `(${getCorrectPercent()}%)` }}
              </div>
            </div>
            <div class="score-wrap">
              <div>{{ ts('score') }}</div>
              <div class="score">
                {{ store.zhuyin.quiz.value?.score ?? 0 }}
              </div>
              <div v-if="!store.zhuyin.quiz.value?.cheated">{{ ts('high_score') }}</div>
              <div v-if="!store.zhuyin.quiz.value?.cheated" class="high-score">
                {{ highScore }}
              </div>
            </div>
            <div class="complete-actions f-col">
              <div class="actions1">
                <AppButton :text="ts('restart')" class="restart" @click="restartQuiz" />
                <AppButton
                  :text="ts('back')"
                  class="back"
                  @click="router.push({ name: 'Zhuyin' })"
                />
              </div>
              <AppButton
                v-if="store.zhuyin.quiz.value?.incorrect.length"
                :text="ts('review_missed')"
                class="review"
                @click="reviewMissed"
              />
            </div>
          </div>
          <div v-else-if="questionState === 'active'" class="card">
            <div class="question-wrap">
              <div class="question">
                {{ card.question }}
              </div>
              <Sound class="sound" @click="sayCurrentSymbol" />
            </div>
            <STInput
              :modelValue="entry"
              :placeholder="ts('answer')"
              class="entry"
              @update:modelValue="setAnswer"
            />
          </div>
        </Transition>
      </div>
      <div class="options">
        <Checkbox
          :item="{
            label: ts('hide_keyboard'),
            checked: store.zhuyin.quizOptions.value.hideKeyboard,
          }"
          class="keyboard-toggle"
          @checked="store.zhuyin.setQuizOptions({ hideKeyboard: $event })"
        />
        <Checkbox
          :item="{
            label: ts('cheat'),
            checked: store.zhuyin.quizOptions.value.cheating,
          }"
          class="cheat"
          @checked="setCheating"
        />
        <AudioOptions :hideVoice="true" class="audio" />
      </div>
      <ZhuyinKeyboard
        v-if="!store.zhuyin.quizOptions.value.hideKeyboard"
        class="quiz-keyboard"
        :showPinyin="store.zhuyin.quizOptions.value.cheating"
        @press="setAnswer"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { STInput } from '@samatech/vue-components'
import { store } from '@frontend/store'
import { IZhuyinKeyInfo, IZhuyinQuizState, KeyType } from '@frontend/types'
import { Sound } from '@frontend/components/svg'
import { zhuyinSymbols } from '@frontend/util/zhuyin'
import { shuffleArray } from '@frontend/util/misc'
import {
  AppButton,
  AudioOptions,
  Checkbox,
  PageNav,
  ZhuyinKeyboard,
} from '@frontend/components/widgets'
import { ts } from '../../i18n'
import { saySymbol } from '@frontend/util/speech'

const router = useRouter()
const entry = ref()

const questionState = computed(() => {
  return store.zhuyin.quiz.value?.questionState ?? 'init'
})

const index = computed(() => {
  if (store.zhuyin.quiz.value?.questionState === 'complete') {
    return symbolKeys.value.length
  }
  return store.zhuyin.quiz.value?.index ?? 0
})

const highScore = computed(() => {
  const count = store.zhuyin.quizOptions.value.count
  return store.zhuyin.quizHighScore.value[count] ?? 0
})

const roundTime = (t: number) => {
  return Math.round(t / 100) / 10
}

const questionTime = computed(() => {
  const count = store.zhuyin.quiz.value?.questionTime ?? 0
  return roundTime(count)
})

const quizTime = computed(() => {
  const quiz = store.zhuyin.quiz.value
  if (!quiz) return 0
  return roundTime(quiz.quizEnd - quiz.quizStart)
})

const symbolKeys = computed(() => {
  return store.zhuyin.quiz.value?.symbolKeys ?? Object.keys(zhuyinSymbols)
})

const currentKey = computed(() => {
  const ind =
    index.value >= symbolKeys.value.length ? symbolKeys.value.length - 1 : index.value
  return symbolKeys.value[ind] as KeyType
})

const card = computed(() => {
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

const getCorrectCount = (): number => {
  const incorrect = store.zhuyin.quiz.value?.incorrect.length ?? 0
  return symbolKeys.value.length - incorrect
}

const getCorrectPercent = (): number => {
  const correct = getCorrectCount()
  return Math.round((correct / symbolKeys.value.length) * 100)
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
  entry.value = symbol.s
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

const setCheating = (on: boolean) => {
  store.zhuyin.setQuizOptions({ cheating: on })
  if (on) {
    store.zhuyin.setQuiz({ cheated: true })
  }
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
.card-title {
  @mixin title 28px;
}
.card-text {
  @mixin title-regular 18px;
  margin-top: 16px;
}
.question-wrap {
  display: flex;
  align-items: center;
}
.question {
  @mixin title 48px;
}
.sound {
  @mixin size 26px;
  margin-left: 24px;
  cursor: pointer;
  margin-top: 8px;
}
.entry {
  width: 100%;
  max-width: 160px;
  :deep(input) {
    border-radius: 12px;
    height: 64px;
    font-size: 30px;
    text-align: center;
    margin-top: 24px;
  }
}
.incorrect-inputs {
  display: flex;
}
.incorrect .entry {
  max-width: 60px;
  :deep(input) {
    background-color: $color-error-bg;
    border-color: $color-error;
  }
  &.correct {
    max-width: 100px;
    margin-left: 16px;
    :deep(input) {
      background-color: $green1;
      border-color: $green2;
    }
  }
}
.correct .entry {
  :deep(input) {
    background-color: $green1;
    border-color: $green2;
  }
}
.result {
  @mixin title 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 12px 0 0;
}
.result-count {
  font-weight: bold;
}
.result-percent {
  margin-left: 16px;
}
.score-wrap {
  @mixin title-regular 16px;
  display: flex;
  margin-top: 16px;
  align-items: center;
}
.score {
  font-weight: 700;
  margin: 0 16px 0 6px;
}
.high-score {
  font-weight: 700;
  margin-left: 6px;
}
.options {
  display: flex;
  align-items: center;
  padding: 16px 0 24px;
  .keyboard-toggle,
  :deep(.checkbox) {
    margin: 0;
  }
  .keyboard-toggle {
    margin-right: 12px;
  }
}
.audio {
  margin-left: 16px;
}
.complete-actions {
  margin-top: 16px;
}
.actions1 {
  display: flex;
}
.restart {
  margin-right: 4px;
}
.back {
  margin-left: 4px;
}
.review {
  margin-top: 8px;
}
</style>
