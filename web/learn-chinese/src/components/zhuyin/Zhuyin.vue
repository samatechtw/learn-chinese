<template>
  <div class="zhuyin-wrap">
    <div class="zhuyin container f-center-col">
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
      @cancel="showQuizModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IToolBubble } from '@frontend/types'
import { ToolBubble } from '@frontend/components/widgets'
import { ts } from '../../i18n'
import ZhuyinOptionsModal from './ZhuyinOptionsModal.vue'

const router = useRouter()

const learn: IToolBubble = {
  title: 'learn',
  text: 'zhuyin.learn_tool',
  to: 'ZhuyinLearn',
}
const quiz: IToolBubble = { title: 'quiz', text: 'zhuyin.quiz' }
const typing: IToolBubble = { title: 'typing', text: 'zhuyin.typing', disabled: true }

const tools: IToolBubble[] = [learn, quiz, typing]

const showQuizModal = ref(false)

const toolClick = (tool: IToolBubble) => {
  if (tool.title === quiz.title) {
    showQuizModal.value = true
  }
}

const startQuiz = () => {
  showQuizModal.value = false
  router.push({ name: 'ZhuyinQuiz' })
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
