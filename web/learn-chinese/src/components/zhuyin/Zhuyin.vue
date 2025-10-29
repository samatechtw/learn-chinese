<template>
  <div class="zhuyin-wrap">
    <div class="zhuyin container f-center-col">
      <PageNav :nav="['Home', 'Zhuyin']" />
      <h1 class="hero-title">
        {{ ts('zhuyin.learn') }}
      </h1>
      <div class="tools">
        <ToolBubble v-for="tool in tools" :tool="tool" @click="toolClick" />
      </div>
    </div>
    <ZhuyinOptionsModal
      :show="showQuizModal"
      @start="startQuiz"
      @resume="resumeQuiz"
      @cancel="showQuizModal = false"
    />
    <ZhuyinTypingModal
      :show="showTypingModal"
      @start="startTyping"
      @resume="resumeTyping"
      @cancel="showTypingModal = false"
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
import ZhuyinOptionsModal from './ZhuyinOptionsModal.vue'
import ZhuyinTypingModal from './ZhuyinTypingModal.vue'

const router = useRouter()

const learn: IToolBubble = {
  title: 'learn',
  text: 'zhuyin.learn_tool',
  to: 'ZhuyinLearn',
}
const quiz: IToolBubble = { title: 'quiz', text: 'zhuyin.quiz_text' }
const typing: IToolBubble = { title: 'typing', text: 'zhuyin.typing' }

const tools: IToolBubble[] = [learn, quiz, typing]

const showQuizModal = ref(false)
const showTypingModal = ref(false)

const toolClick = (tool: IToolBubble) => {
  if (tool.title === quiz.title) {
    showQuizModal.value = true
  } else if (tool.title === typing.title) {
    showTypingModal.value = true
  }
}

const startQuiz = () => {
  store.zhuyin.clearQuiz()
  resumeQuiz()
}

const resumeQuiz = () => {
  showQuizModal.value = false
  router.push({ name: 'ZhuyinQuiz' })
}

const startTyping = () => {
  store.typing.clearTyping()
  resumeTyping()
}

const resumeTyping = () => {
  showTypingModal.value = false
  router.push({ name: 'ZhuyinTyping' })
}
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.zhuyin-wrap {
  background: $color4;
}
.hero-title {
  font-size: 44px;
}
.zhuyin {
  min-height: calc(100vh - $header-height);
  padding: 120px 0 140px;
}
</style>
