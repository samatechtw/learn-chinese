<template>
  <div class="segment-wrap">
    <div class="segment-page container f-col">
      <div class="header">
        <div class="title-block">
          <PageNav
            :nav="
              getLanguageBreadcrumbs('vietnamese', {
                name: 'VietnameseSegmentLesson',
                label: segment.title,
              })
            "
          />
          <h1 class="hero-title">{{ segment.title }}</h1>
          <p class="subtitle">{{ segment.description }}</p>
          <p class="dialect-badge">Dialect: Northern Vietnamese</p>
        </div>
        <div class="meta">
          <div class="pill">
            <span>{{ ts('progress') }}</span>
            <strong>{{ `${displayIndex} / ${questions.length}` }}</strong>
          </div>
          <div class="pill score-pill">
            <span>{{ ts('score') }}</span>
            <strong>{{ displayScore }}</strong>
          </div>
        </div>
      </div>
      <div class="card-shell">
        <Transition name="fade" mode="out-in">
          <div v-if="phase === 'init'" class="card init-card" @click="startLesson">
            <div class="card-title">Start Segment</div>
            <div class="card-text">Click to begin sentence practice</div>
          </div>
          <div v-else-if="phase === 'complete'" class="card complete-card">
            <div class="result-icon">🎯</div>
            <div class="card-title">Segment complete</div>
            <div class="result-score">{{ displayScore }} / {{ questions.length }}</div>
            <div class="card-text">You can restart and get a new mix of question types.</div>
            <button class="action-button" @click="restartLesson">Restart Segment</button>
          </div>
          <div v-else-if="phase === 'correct'" class="card result-card" @click="goNext">
            <div class="status-icon correct">✓</div>
            <div class="status-text">Correct</div>
            <div class="answer-box">
              <div class="label">Vietnamese</div>
              <div class="value">{{ currentQuestion?.vietnamese }}</div>
              <div class="label">English</div>
              <div class="value">{{ currentQuestion?.english }}</div>
            </div>
            <div class="continue-hint">Click to continue</div>
          </div>
          <div v-else-if="phase === 'incorrect'" class="card result-card" @click="goNext">
            <div class="status-icon incorrect">✗</div>
            <div class="status-text">Incorrect</div>
            <div class="answer-box">
              <div class="label">Your answer</div>
              <div class="value wrong">{{ wrongAnswer }}</div>
              <div class="label">Correct answer</div>
              <div class="value">{{ currentQuestion?.correctAnswer }}</div>
            </div>
            <div class="continue-hint">Click to continue</div>
          </div>
          <div v-else-if="phase === 'graded'" class="card result-card" @click="goNext">
            <div class="status-icon graded">≈</div>
            <div class="status-text">Sentence graded</div>
            <div class="grade-line">
              {{ Math.round((typedGrade?.totalScore ?? 0) * 100) }}% • {{ typedGrade?.label }}
            </div>
            <div class="grade-breakdown">
              <div>Spelling {{ Math.round((typedGrade?.spellingScore ?? 0) * 100) }}%</div>
              <div>Accents {{ Math.round((typedGrade?.accentScore ?? 0) * 100) }}%</div>
              <div>Punctuation {{ Math.round((typedGrade?.punctuationScore ?? 0) * 100) }}%</div>
            </div>
            <div class="answer-box">
              <div class="label">Your sentence</div>
              <div class="value">{{ wrongAnswer }}</div>
              <div class="label">Target sentence</div>
              <div class="value">{{ currentQuestion?.correctAnswer }}</div>
            </div>
            <div class="continue-hint">Click to continue</div>
          </div>
          <div v-else-if="phase === 'active'" class="card active-card">
            <div class="question-type">{{ getQuestionTypeLabel(currentQuestion?.type) }}</div>
            <div class="question-prompt">{{ currentQuestion?.prompt }}</div>
            <div v-if="currentQuestion?.displayText" class="question-text">
              {{ currentQuestion?.displayText }}
            </div>
            <div v-if="currentQuestion?.type === 'ChooseEnglishMeaning'" class="future-note">
              Temporary mode. Sentence reconstruction mode will replace this later.
            </div>
            <AudioButton :audio-text="currentQuestion?.audioText ?? ''" />
            <div v-if="currentQuestion?.type === 'WriteSentence'" class="typing-wrap">
              <input
                v-model="typedAnswer"
                class="typed-input"
                type="text"
                placeholder="Type the Vietnamese sentence"
                @keydown.enter.prevent="submitTypedAnswer"
              />
              <button class="action-button" @click="submitTypedAnswer">Submit</button>
            </div>
            <div v-else class="options">
              <button
                v-for="(option, index) in currentQuestion?.options ?? []"
                :key="index"
                class="option-button"
                @click="submitAnswer(option)"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { PageNav } from '@frontend/components/widgets'
import { ts } from '@frontend/i18n'
import { getLanguageBreadcrumbs } from '@frontend/util/misc'
import AudioButton from '@learn-vietnamese/components/shared/AudioButton.vue'
import { ILearningSegment, ILearningSegmentQuestion } from '@learn-vietnamese/types'
import {
  buildSegmentQuestions,
  gradeSegmentTypedAnswer,
  ISegmentTypedAnswerGrade,
  isSegmentAnswerCorrect,
} from '@learn-vietnamese/util/segment-quiz'

interface Props {
  segment: ILearningSegment
}

const props = defineProps<Props>()

type SegmentPhase = 'init' | 'active' | 'correct' | 'incorrect' | 'graded' | 'complete'

const phase = ref<SegmentPhase>('init')
const questions = ref<ILearningSegmentQuestion[]>([])
const currentIndex = ref(0)
const score = ref(0)
const wrongAnswer = ref('')
const typedAnswer = ref('')
const typedGrade = ref<ISegmentTypedAnswerGrade | null>(null)

const currentQuestion = computed(() => {
  if (currentIndex.value >= questions.value.length) return null
  return questions.value[currentIndex.value]
})

const displayIndex = computed(() => {
  if (phase.value === 'complete') return questions.value.length
  return Math.min(currentIndex.value + 1, questions.value.length)
})

const displayScore = computed(() => {
  const rounded = Math.round(score.value * 100) / 100
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2)
})

const getQuestionTypeLabel = (type?: ILearningSegmentQuestion['type']): string => {
  if (type === 'FillInBlank') return 'Fill in the blank'
  if (type === 'WriteSentence') return 'Write the sentence'
  if (type === 'ChooseEnglishMeaning') return 'English meaning'
  return ''
}

const restartLesson = () => {
  questions.value = buildSegmentQuestions(props.segment)
  currentIndex.value = 0
  score.value = 0
  phase.value = 'init'
  typedAnswer.value = ''
  wrongAnswer.value = ''
  typedGrade.value = null
}

const startLesson = () => {
  phase.value = questions.value.length > 0 ? 'active' : 'complete'
}

const setCompleteIfFinished = (): boolean => {
  if (currentIndex.value >= questions.value.length - 1) {
    phase.value = 'complete'
    return true
  }
  return false
}

const goNext = () => {
  if (setCompleteIfFinished()) return
  currentIndex.value += 1
  typedAnswer.value = ''
  wrongAnswer.value = ''
  typedGrade.value = null
  phase.value = 'active'
}

const submitAnswer = (answer: string) => {
  if (phase.value !== 'active' || !currentQuestion.value) return

  if (currentQuestion.value.type === 'WriteSentence') {
    const grade = gradeSegmentTypedAnswer(currentQuestion.value.correctAnswer, answer)
    typedGrade.value = grade
    score.value += grade.totalScore
    wrongAnswer.value = answer
    phase.value = 'graded'
    return
  }

  const correct = isSegmentAnswerCorrect(currentQuestion.value, answer)
  if (correct) {
    score.value += 1
    phase.value = 'correct'
    return
  }
  wrongAnswer.value = answer
  phase.value = 'incorrect'
}

const submitTypedAnswer = () => {
  submitAnswer(typedAnswer.value)
}

watch(
  () => props.segment.id,
  () => {
    restartLesson()
  },
  { immediate: true },
)
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.segment-wrap {
  background: radial-gradient(circle at top, #ffe8d1 0%, #fff7ed 45%, #ffffff 100%);
  color: $text1;
}
.segment-page {
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
.hero-title {
  @mixin title 34px;
  margin: 12px 0 8px 0;
  color: #c2410c;
}
.subtitle {
  @mixin text 16px;
  color: $text2;
  max-width: 620px;
}
.dialect-badge {
  @mixin title-regular 12px;
  display: inline-block;
  margin-top: 12px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #9a3412;
  background: rgba(194, 65, 12, 0.12);
  border: 1px solid rgba(194, 65, 12, 0.2);
  border-radius: 999px;
  padding: 8px 12px;
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
}
.score-pill span,
.score-pill strong {
  color: white;
}
.card-shell {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
.card {
  width: 100%;
  max-width: 760px;
  min-height: 360px;
  padding: 28px 26px;
  border-radius: 22px;
  border: 1px solid rgba(194, 65, 12, 0.18);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
}
.init-card,
.result-card {
  cursor: pointer;
}
.card-title {
  @mixin title 28px;
  color: #c2410c;
}
.card-text {
  @mixin text 16px;
  color: $text2;
}
.result-icon {
  font-size: 46px;
}
.result-score {
  @mixin title 34px;
}
.status-icon {
  font-size: 42px;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.status-icon.correct {
  background: rgba(31, 157, 18, 0.12);
  color: $correct;
}
.status-icon.incorrect {
  background: rgba(224, 40, 24, 0.12);
  color: $incorrect;
}
.status-icon.graded {
  background: rgba(59, 130, 246, 0.12);
  color: #1d4ed8;
}
.status-text {
  @mixin title 22px;
}
.grade-line {
  @mixin title 20px;
  color: #1d4ed8;
}
.grade-breakdown {
  @mixin text 14px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  color: $text2;
}
.answer-box {
  width: 100%;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  padding: 14px;
  display: grid;
  gap: 6px;
}
.label {
  @mixin title-regular 12px;
  text-transform: uppercase;
  color: $text2;
}
.value {
  @mixin title 21px;
}
.value.wrong {
  color: $incorrect;
  text-decoration: line-through;
}
.continue-hint {
  @mixin title-regular 13px;
  text-transform: uppercase;
  color: $text2;
}
.question-type {
  @mixin title-regular 13px;
  color: #c2410c;
  text-transform: uppercase;
  letter-spacing: 0.45px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(194, 65, 12, 0.25);
  background: rgba(194, 65, 12, 0.12);
}
.question-prompt {
  @mixin title 20px;
}
.question-text {
  @mixin title 32px;
  word-break: break-word;
}
.future-note {
  @mixin text 13px;
  color: $text2;
}
.typing-wrap {
  width: 100%;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.typed-input {
  @mixin text 16px;
  width: min(560px, 100%);
  border-radius: 12px;
  border: 1px solid rgba(194, 65, 12, 0.22);
  padding: 12px 14px;
}
.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
}
.option-button,
.action-button {
  @mixin title 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}
.option-button {
  min-height: 64px;
}
@media (max-width: 640px) {
  .question-text {
    font-size: 24px;
  }
  .options {
    grid-template-columns: 1fr;
  }
}
</style>
