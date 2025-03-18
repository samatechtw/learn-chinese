<template>
  <div class="card">
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
        <AppButton :text="ts('restart')" class="restart" @click="emit('restart')" />
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
        @click="emit('review')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@frontend/store'
import { AppButton } from '@frontend/components/widgets'
import { roundTime } from '@frontend/util/misc'
import { KeyType } from '@frontend/types'
import { ts } from '../../../i18n'

const router = useRouter()

const { symbolKeys } = defineProps<{
  symbolKeys: KeyType[]
}>()
const emit = defineEmits<{
  (e: 'restart'): void
  (e: 'review'): void
}>()

const getCorrectCount = (): number => {
  const incorrect = store.zhuyin.quiz.value?.incorrect.length ?? 0
  return symbolKeys.length - incorrect
}

const getCorrectPercent = (): number => {
  const correct = getCorrectCount()
  return Math.round((correct / symbolKeys.length) * 100)
}

const highScore = computed(() => {
  const count = store.zhuyin.quizOptions.value.count
  return store.zhuyin.quizHighScore.value[count] ?? 0
})

const quizTime = computed(() => {
  const quiz = store.zhuyin.quiz.value
  if (!quiz) return 0
  return roundTime(quiz.quizEnd - quiz.quizStart)
})
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

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
.complete-actions {
  margin-top: 16px;
}
.actions1 {
  display: flex;
}
.review {
  margin-top: 8px;
}
.score {
  font-weight: 700;
  margin: 0 16px 0 6px;
}
.high-score {
  font-weight: 700;
  margin-left: 6px;
}
.restart {
  margin-right: 4px;
}
.back {
  margin-left: 4px;
}
</style>
