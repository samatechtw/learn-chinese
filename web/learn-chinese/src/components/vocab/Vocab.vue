<template>
  <div class="vocab-wrap">
    <div class="vocab container f-center-col">
      <PageNav :nav="['Home', 'Vocab']" />
      <h1 class="hero-title">
        {{ ts('vocab.learn') }}
      </h1>
      <div class="tools">
        <ToolBubble v-for="tool in tools" :tool="tool" @click="toolClick" />
      </div>
    </div>
    <VocabOptionsModal
      :show="showQuizModal"
      @start="startQuiz"
      @resume="resumeQuiz"
      @cancel="showQuizModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@frontend/store'
import { PageNav, ToolBubble } from '@frontend/components/widgets'
import { IToolBubble } from '@frontend/types'
import { ts } from '../../i18n'
import VocabOptionsModal from './VocabOptionsModal.vue'

const router = useRouter()

const quiz: IToolBubble = { title: 'quiz', text: 'vocab.quiz_text' }

const tools: IToolBubble[] = [quiz]

const showQuizModal = ref(false)

const toolClick = (tool: IToolBubble) => {
  if (tool.title === quiz.title) {
    showQuizModal.value = true
  }
}

const startQuiz = () => {
  store.vocab.clearQuiz()
  resumeQuiz()
}

const resumeQuiz = () => {
  showQuizModal.value = false
  router.push({ name: 'VocabQuiz' })
}
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.vocab-wrap {
  background: $color4;
}
.hero-title {
  font-size: 44px;
}
.vocab {
  min-height: calc(100vh - $header-height);
  padding: 120px 0 140px;
}
</style>
