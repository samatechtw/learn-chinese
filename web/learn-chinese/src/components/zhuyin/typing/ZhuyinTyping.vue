<template>
  <div class="zhuyin-typing-wrap">
    <div class="zhuyin-typing container f-col">
      <PageNav :nav="['Home', 'Zhuyin', 'ZhuyinTyping']" />
      <h1 class="hero-title">
        {{ ts('zhuyin.practice') }}
      </h1>
      <div class="progress-wrap">
        <div>{{ ts('progress') }}</div>
        <div class="progress">
          {{ `${index} / ${characters.length}` }}
        </div>
        <div class="score-wrap" :class="{ active: !!scoreAdd }">
          <div class="score-label">
            {{ ts('score') }}
          </div>
          <div class="score">
            {{ prevScore ?? store.typing.state.value?.score ?? 0 }}
          </div>
          <div class="score-add">
            {{ `+${scoreAdd}` }}
          </div>
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
          <ZhuyinTypingActive
            v-else-if="questionState === 'active'"
            :entry="entry"
            :card="card"
            :hint="hint"
            class="card"
            @sayCurrentChar="sayCurrentChar"
            @showHint="showHint"
          />
          <ZhuyinTypingCorrect
            v-else-if="questionState === 'correct'"
            :entry="entry.map((e) => e.s).join('')"
            :card="card"
            class="card"
          />
        </Transition>
      </div>
      <ZhuyinTypingOptions />
      <ZhuyinKeyboard
        v-if="!store.zhuyin.quizOptions.value.hideKeyboard"
        class="quiz-keyboard"
        :showPinyin="cheating"
        @press="keyPress"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { store } from '@frontend/store'
import { shuffleArray } from '@frontend/util/misc'
import { PageNav, ZhuyinKeyboard } from '@frontend/components/widgets'
import { characterSets } from '@frontend/util/characters'
import {
  ITypingQuestion,
  ICharacterSet,
  ITypingEntry,
  IZhuyinTypingState,
  Keys,
  KeyType,
} from '@frontend/types'
import { saySymbol } from '@frontend/util/speech'
import { zhuyinSymbols } from '@frontend/util/zhuyin'
import ZhuyinTypingOptions from './ZhuyinTypingOptions.vue'
import ZhuyinTypingActive from './ZhuyinTypingActive.vue'
import ZhuyinTypingCorrect from './ZhuyinTypingCorrect.vue'
import { ts } from '../../../i18n'
import { useScoreAnimate } from '@frontend/util/ui'

const entry = ref<ITypingEntry[]>([])
const hint = ref()
const { prevScore, scoreAdd, animate } = useScoreAnimate()

const cheating = computed(() => {
  return !!store.typing.typingOptions.value.cheating
})

const questionState = computed(() => {
  return store.typing.state.value?.questionState ?? 'init'
})

const index = computed(() => {
  if (store.typing.state.value?.questionState === 'complete') {
    return characters.value.length
  }
  return store.typing.state.value?.index ?? 0
})

const characterData = computed<ICharacterSet>(() => {
  const sets = store.typing.typingOptions.value.sets ?? ['hsk1']
  return Object.assign({}, ...sets.map((s) => characterSets[s]))
})

const characters = computed<string[]>(() => {
  return store.typing.state.value?.characters ?? Object.keys(characterData.value)
})

const currentChar = computed<string>(() => {
  const ind =
    index.value >= characters.value.length ? characters.value.length - 1 : index.value
  return characters.value[ind]
})

const card = computed<ITypingQuestion>(() => {
  const info = characterData.value[currentChar.value]
  return {
    question: currentChar.value,
    answer: info.z.replaceAll(' ', '').replaceAll('˙', ''),
    pinyin: info.p,
    audio: info.audio,
  }
})

const sayCurrentChar = () => {
  if (currentChar.value) {
    saySymbol(currentChar.value)
  }
}

const showHint = (show: boolean) => {
  if (show) {
    const { next } = nextChar()
    hint.value = next
    store.typing.incrementCheated(1)
  } else {
    hint.value = undefined
  }
}

const startQuestion = () => {
  entry.value = []
  const now = Date.now()
  const state: Partial<IZhuyinTypingState> = {
    questionState: 'active',
    questionStart: now,
  }
  if (questionState.value === 'init') {
    state.start = now
  } else {
    state.index = index.value + 1
  }
  store.typing.startQuestion(state)
  sayCurrentChar()
}

const recordCorrect = () => {
  const reviewing = store.typing.state.value?.reviewing
  const prevScore = store.typing.state.value?.score ?? 0
  const cheated = store.typing.state.value?.cheated ?? 0
  const questionTime = Date.now() - (store.typing.state.value?.questionStart ?? 0)
  let score = 10 - cheated
  if (questionTime < 2000) {
    score += 5
  } else if (questionTime < 4000) {
    score += 4
  } else if (questionTime < 6000) {
    score += 3
  } else if (questionTime < 8000) {
    score += 2
  } else if (questionTime < 10000) {
    score += 1
  }
  animate(score, prevScore)
  store.typing.setTyping({
    score: reviewing ? prevScore : prevScore + score,
    questionTime,
    questionState: 'correct',
  })
}

// Returns true if there is no active question
// Starts question if inactive and not complete.
// Completes session if inactive and last question has been answered.
// If the current question was incorrect, the answer must be entered to continue.
const checkInactive = (char?: string): boolean => {
  const isLast = index.value >= characters.value.length - 1

  if (char === 'Meta' || char === 'Tab' || questionState.value === 'complete') {
    return true
  } else if (questionState.value !== 'active' && isLast) {
    // Finish the quiz if the answer was correct or the right key is pressed
    if (questionState.value === 'correct' || char === currentChar.value) {
      store.typing.typingComplete()
    }
    return true
  } else if (questionState.value === 'correct' || questionState.value === 'init') {
    startQuestion()
    return true
  } else if (questionState.value === 'incorrect') {
    // Must enter the correct key to continue after a wrong answer
    if (char === currentChar.value) {
      startQuestion()
    }
    return true
  }
  return false
}

const hasError = () => {
  return entry.value.some((e) => !e.correct)
}

const nextChar = (): { error: boolean; next: string } => {
  const error = hasError()
  const expectInd = error ? entry.value.length - 1 : entry.value.length
  return {
    error,
    next: card.value.answer.charAt(expectInd),
  }
}

const keyPress = (char: string, event?: KeyboardEvent) => {
  if (char === Keys.Delete) {
    if (entry.value.length) {
      entry.value.pop()
    }
    return
  }
  if (event?.metaKey || checkInactive(char)) {
    return
  }
  const symbol = zhuyinSymbols[char as KeyType]
  if (!symbol) {
    return
  }
  const { error, next } = nextChar()
  const correct = symbol.s === next
  const newVal = { s: symbol.s, correct }
  if (error) {
    entry.value[entry.value.length - 1] = newVal
  } else {
    entry.value.push(newVal)
  }
  hint.value = undefined
  if (!correct) {
    store.typing.recordMistake()
  }

  if (
    card.value.answer.length === entry.value.length &&
    entry.value.every((e) => e.correct)
  ) {
    recordCorrect()
  }
}

const restartQuiz = () => {
  const order = store.typing.typingOptions.value.order
  let chars = characters.value
  if (order === 'random') {
    shuffleArray(chars)
  } else {
    const d = store.typing.typingDifficulty.value
    chars = chars.sort((a, b) => (d[a] ?? 0) - (d[b] ?? 0))
  }
  const limit = store.typing.typingOptions.value.count || 'all'
  if (limit !== 'all') {
    chars = chars.slice(0, parseInt(limit))
  }
  store.typing.setTypingOptions({ cheating: false })
  store.typing.setTyping({
    index: 0,
    characters: chars,
    incorrect: [],
    score: 0,
    questionState: 'init',
    start: Date.now(),
    cheated: 0,
    reviewing: false,
  })
}

onMounted(() => {
  if (!store.typing.state.value) {
    restartQuiz()
  }
  // If the user refreshes the page on the correct screen, recreate the entry for display
  if (questionState.value === 'correct') {
    ;[...card.value.answer].forEach((s) => entry.value.push({ s, correct: true }))
  }
  console.log(card.value, entry.value)
})
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.zhuyin-typing-wrap {
  background: $color4;
}
.hero-title {
  @mixin title 32px;
  margin: 16px 0 0 0;
}
.zhuyin-typing {
  min-height: calc(100vh - $header-height);
  padding: 140px 0 160px;
  align-items: center;
}
.card {
  width: 70%;
}
.score {
  font-weight: 700;
  margin-left: 6px;
}
.score-add {
  @mixin title 16px;
  position: absolute;
  right: -30px;
  top: -12px;
  color: $correct;
  opacity: 0;
}
.score-wrap {
  display: flex;
  margin-left: 16px;
  position: relative;
  transition: transform 0.2s ease;
  &.active {
    transform: scale(1.4);
    .score-add {
      opacity: 1;
    }
  }
}
</style>
