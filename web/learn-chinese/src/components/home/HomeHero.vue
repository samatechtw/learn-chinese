<template>
  <div>
    <div class="hero-wrap">
      <div class="home-hero container f-center-col">
        <PageNav :nav="getLanguageBreadcrumbs('chinese')" />
        <h1 class="hero-title">
          {{ ts('home.hero') }}
        </h1>
        <div class="hero-text">
          {{ ts('home.hero_text') }}
        </div>
        <div class="tools">
          <ToolBubble v-for="tool in tools" :tool="tool" />
        </div>
        <UnitsSection />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IToolBubble } from '@frontend/types'
import { PageNav, ToolBubble } from '@frontend/components/widgets'
import { ts } from '@frontend/i18n'
import { getLanguageBreadcrumbs } from '@frontend/util/misc'
import UnitsSection from '../units/UnitsSection.vue'

const tools: IToolBubble[] = [
  {
    title: 'zhuyin.learn',
    text: 'zhuyin.learn_tool',
    to: 'ZhuyinLearn',
    icon: '注',
    disabled: false,
  },
  {
    title: 'zhuyin.quiz',
    text: 'zhuyin.quiz_text',
    to: 'ZhuyinQuiz',
    icon: '🎯',
    disabled: false,
  },
  {
    title: 'typing',
    text: 'zhuyin.typing_options_text',
    to: 'ZhuyinTyping',
    icon: '⌨️',
    disabled: false,
  },
  {
    title: 'vocab.quiz',
    text: 'vocab.quiz_text',
    to: 'VocabQuiz',
    icon: '🗂️',
    disabled: false,
  },
  {
    title: 'phrases.title',
    text: 'phrases.tool_text',
    to: 'ChinesePhrases',
    icon: '💬',
    disabled: false,
  },
  {
    title: 'typing_game',
    text: 'typing_game_text',
    to: 'not-found',
    icon: '🎮',
    disabled: true,
  },
]
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.hero-wrap {
  background: $color4;
}
.home-hero {
  min-height: calc(100vh - $header-height);
  padding: 100px 0 120px;
}
.hero-text {
  @mixin title-thin 22px;
}
.home-hero .tools {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  justify-items: center;
  gap: 24px;
  width: 100%;
  max-width: 860px;
  margin-top: 40px;
  padding: 0 24px;
}
@media (max-width: 720px) {
  .home-hero {
    text-align: center;
  }
  .hero-title {
    font-size: 48px;
  }
  .home-hero .tools {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: 540px;
  }
}
@media (max-width: 620px) {
  .home-hero {
    padding: 80px 0 100px;
  }
  .hero-title {
    font-size: 42px;
  }
  .hero-text {
    font-size: 19px;
  }
  .home-hero .tools {
    gap: 20px;
    padding: 0 12px;
    max-width: 400px;
  }
}
</style>
