<template>
  <div class="hero-wrap">
    <div class="home-hero container f-center-col">
      <h1 class="hero-title">
        {{ ts('home.hero') }}
      </h1>
      <div class="hero-text">
        {{ ts('home.hero_text') }}
      </div>
      <div class="tools">
        <ToolBubble v-for="tool in tools" :tool="tool" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IToolBubble } from '@frontend/types'
import { ToolBubble } from '@frontend/components/widgets'
import { ts } from '../../i18n'

const tools: IToolBubble[] = [
  { title: 'zhuyin.title', text: 'zhuyin.text', to: 'Zhuyin', disabled: false },
  { title: 'vocab.title', text: 'vocab_text', to: 'Vocab', disabled: false },
  { title: 'typing_game', text: 'typing_game_text', to: 'not-found', disabled: true },
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
@media (max-width: 680px) {
  .home-hero {
    text-align: center;
  }
  .hero-title {
    font-size: 48px;
  }
}
</style>
