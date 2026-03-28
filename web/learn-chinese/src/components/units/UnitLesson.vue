<template>
  <div class="unit-lesson-wrap">
    <div class="unit-lesson container f-col">
      <!-- Header -->
      <div class="lesson-header">
        <div class="header-top">
          <PageNav
            :nav="
              getLanguageBreadcrumbs('chinese', {
                name: 'ChineseUnits',
                label: unit.title,
              })
            "
          />
          <div class="unit-badge">
            <span class="unit-icon">{{ unit.icon }}</span>
            <span class="unit-name">{{ unit.titleChinese }}</span>
          </div>
        </div>
        <div v-if="phase !== 'init' && phase !== 'complete'" class="progress-bar-wrap">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progressPct}%` }" />
          </div>
          <div class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</div>
        </div>
      </div>

      <!-- Card area -->
      <div class="card-shell">
        <Transition name="fade" mode="out-in">
          <UnitInit v-if="phase === 'init'" :unit="unit" @startLesson="startLesson" />
          <UnitComplete
            v-else-if="phase === 'complete'"
            :score="score"
            :score-label="scoreLabel"
            :total-questions="questions.length"
            @restartLesson="restartLesson"
          />
          <UnitResultCorrect
            v-else-if="phase === 'correct'"
            :phrase-info="currentPhraseInfo"
            @goNext="goNext"
          />
          <UnitResultIncorrect
            v-else-if="phase === 'incorrect'"
            :correct-answer="currentQuestion?.correctAnswer ?? ''"
            :phrase-info="currentPhraseInfo"
            :question="currentQuestion"
            :wrong-answer="wrongAnswer"
            @goNext="goNext"
          />
          <UnitQuestionTranslatePhrase
            v-else-if="phase === 'active' && currentQuestion?.type === 'TranslatePhrase'"
            :is-playing="isPlaying"
            :question="currentQuestion"
            :question-type-label="questionTypeLabel"
            @playAudio="playAudio"
            @submitAnswer="submitAnswer"
          />
          <UnitQuestionFillBlank
            v-else-if="phase === 'active' && currentQuestion?.type === 'FillInBlank'"
            :question="currentQuestion"
            :question-type-label="questionTypeLabel"
            @submitAnswer="submitAnswer"
          />
          <UnitQuestionOrderCharacters
            v-else-if="phase === 'active' && currentQuestion?.type === 'OrderCharacters'"
            :question="currentQuestion"
            :question-type-label="questionTypeLabel"
            :remaining-words="remainingWords"
            :selected-words="selectedWords"
            @deselectWord="deselectWord"
            @selectWord="selectWord"
            @submitOrderAnswer="submitOrderAnswer"
          />
          <UnitQuestionListenSelect
            v-else-if="phase === 'active' && currentQuestion?.type === 'ListenSelect'"
            :is-playing="isPlaying"
            :question="currentQuestion"
            :question-type-label="questionTypeLabel"
            @playAudio="playAudio"
            @skipQuestion="skipQuestion"
            @submitAnswer="submitAnswer"
          />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { PageNav } from '@frontend/components/widgets'
import { getLanguageBreadcrumbs } from '@frontend/util/misc'
import { IUnit, IUnitPhrase, IUnitQuestion, UnitQuestionType } from '@learn-chinese/types'
import { buildUnitQuestions } from '@learn-chinese/util/units'
import { saySymbol } from '@learn-chinese/util/speech'
import UnitComplete from './UnitComplete.vue'
import UnitInit from './UnitInit.vue'
import UnitQuestionFillBlank from './UnitQuestionFillBlank.vue'
import UnitQuestionListenSelect from './UnitQuestionListenSelect.vue'
import UnitQuestionOrderCharacters from './UnitQuestionOrderCharacters.vue'
import UnitQuestionTranslatePhrase from './UnitQuestionTranslatePhrase.vue'
import UnitResultCorrect from './UnitResultCorrect.vue'
import UnitResultIncorrect from './UnitResultIncorrect.vue'

const props = defineProps<{
  unit: IUnit
}>()

type LessonPhase = 'init' | 'active' | 'correct' | 'incorrect' | 'complete'

const phase = ref<LessonPhase>('init')
const questions = ref<IUnitQuestion[]>([])
const currentIndex = ref(0)
const score = ref(0)
const wrongAnswer = ref('')
const selectedWords = ref<string[]>([])
const remainingWords = ref<string[]>([])
const isPlaying = ref(false)

const currentQuestion = computed<IUnitQuestion | null>(() => {
  if (currentIndex.value >= questions.value.length) return null
  return questions.value[currentIndex.value]
})

const currentPhraseInfo = computed<IUnitPhrase | null>(() => {
  if (!currentQuestion.value) return null
  return props.unit.phrases.find((p) => p.id === currentQuestion.value!.phraseId) ?? null
})

const progressPct = computed(() =>
  questions.value.length > 0 ? (currentIndex.value / questions.value.length) * 100 : 0,
)

const questionTypeLabel = computed(() => {
  switch (currentQuestion.value?.type) {
    case 'TranslatePhrase':
      return 'Select the meaning'
    case 'FillInBlank':
      return 'Fill in the blank'
    case 'OrderCharacters':
      return 'Put the words in order'
    case 'ListenSelect':
      return 'Listen and select'
    default:
      return ''
  }
})

const scoreLabel = computed(() => {
  const pct = questions.value.length > 0 ? score.value / questions.value.length : 0
  if (pct >= 0.9) return 'Excellent!'
  if (pct >= 0.7) return 'Good job!'
  if (pct >= 0.5) return 'Keep practicing!'
  return 'Try again!'
})

const startLesson = (types: UnitQuestionType[]) => {
  questions.value = buildUnitQuestions(props.unit, types)
  currentIndex.value = 0
  score.value = 0
  wrongAnswer.value = ''
  selectedWords.value = []
  remainingWords.value = []
  phase.value = questions.value.length > 0 ? 'active' : 'complete'
  syncWordBank()
}

const restartLesson = () => {
  phase.value = 'init'
}

const syncWordBank = () => {
  if (currentQuestion.value?.type === 'OrderCharacters') {
    remainingWords.value = [...(currentQuestion.value.wordBank ?? [])]
    selectedWords.value = []
  }
}

const goNext = () => {
  if (currentIndex.value >= questions.value.length - 1) {
    phase.value = 'complete'
    return
  }
  currentIndex.value += 1
  wrongAnswer.value = ''
  selectedWords.value = []
  phase.value = 'active'
  syncWordBank()
}

const submitAnswer = (answer: string) => {
  if (phase.value !== 'active' || !currentQuestion.value) return
  const correct = answer === currentQuestion.value.correctAnswer
  if (correct) {
    score.value += 1
    phase.value = 'correct'
  } else {
    wrongAnswer.value = answer
    phase.value = 'incorrect'
  }
}

const selectWord = (bankIndex: number) => {
  const word = remainingWords.value[bankIndex]
  if (word === undefined) return
  selectedWords.value.push(word)
  remainingWords.value.splice(bankIndex, 1)
}

const deselectWord = (selIndex: number) => {
  const word = selectedWords.value[selIndex]
  if (word === undefined) return
  selectedWords.value.splice(selIndex, 1)
  remainingWords.value.push(word)
}

const submitOrderAnswer = () => {
  submitAnswer(selectedWords.value.join(''))
}

const skipQuestion = () => {
  if (currentIndex.value >= questions.value.length - 1) {
    phase.value = 'complete'
    return
  }
  currentIndex.value += 1
  wrongAnswer.value = ''
  selectedWords.value = []
  phase.value = 'active'
  syncWordBank()
}

const playAudio = async (text: string) => {
  if (!text || isPlaying.value) return
  isPlaying.value = true
  await saySymbol(text)
  setTimeout(() => {
    isPlaying.value = false
  }, 1200)
}

watch(
  () => props.unit.id,
  () => {
    questions.value = []
    currentIndex.value = 0
    score.value = 0
    wrongAnswer.value = ''
    selectedWords.value = []
    remainingWords.value = []
    phase.value = 'init'
  },
  { immediate: true },
)
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';
@import './unit-style.postcss';

.unit-lesson-wrap {
  background: linear-gradient(135deg, #fff7ed 0%, #fef3e8 40%, #ffffff 100%);
  color: $text1;
  min-height: calc(100vh - $header-height);
}

.unit-lesson {
  padding: 88px 0 120px;
  align-items: stretch;
}

.lesson-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 8px;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.unit-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(194, 65, 12, 0.1);
  border: 1px solid rgba(194, 65, 12, 0.2);
  border-radius: 999px;
  padding: 6px 14px;
}

.unit-icon {
  font-size: 18px;
}

.unit-name {
  @mixin title 16px;
  color: #9a3412;
}

.progress-bar-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #ea580c);
  border-radius: 999px;
  transition: width 0.35s ease;
}

.progress-text {
  @mixin title-regular 13px;
  color: $text2;
  white-space: nowrap;
}

.card-shell {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.card {
  width: 100%;
  max-width: 720px;
  min-height: 380px;
  padding: 36px 32px;
  border-radius: 24px;
  border: 1px solid rgba(194, 65, 12, 0.15);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  text-align: center;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 720px) {
  .unit-lesson {
    padding: 80px 0 100px;
  }
  .card {
    padding: 24px 20px;
    min-height: 320px;
  }
}
</style>
