<template>
  <div class="vocab-quiz-wrap">
    <VocabQuiz :questionMode="questionMode" />
  </div>
</template>

<script lang="ts" setup>
import VocabQuiz from '../components/vocab/quiz/VocabQuiz.vue'
import { VietnameseQuizMode } from '@learn-vietnamese/types'

interface Props {
  questionMode?: VietnameseQuizMode
}

withDefaults(defineProps<Props>(), {
  questionMode: 'EnglishToVietnamese',
})
</script>

<style lang="postcss" scoped></style>
