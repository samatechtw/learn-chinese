<template>
  <div class="home-wrap">
    <div class="home-hero container f-center-col">
      <PageNav :nav="getLanguageBreadcrumbs('vietnamese')" />
      <h1 class="hero-title">
        {{ ts('vietnamese.hero') }}
      </h1>
      <div class="hero-text">
        {{ ts('vietnamese.hero_text') }}
      </div>
      <div class="tool-grid">
        <router-link to="/vietnamese/vocab-quiz" class="tool-card">
          <div class="tool-title">{{ ts('vietnamese.vocab_quiz') }}</div>
          <div class="tool-text">{{ ts('vietnamese.vocab_quiz_text') }}</div>
          <div class="tool-action">{{ ts('vietnamese.vocab_quiz_action') }}</div>
        </router-link>
        <router-link to="/vietnamese/vocab-quiz-reverse" class="tool-card">
          <div class="tool-title">{{ ts('vietnamese.vocab_quiz_reverse') }}</div>
          <div class="tool-text">{{ ts('vietnamese.vocab_quiz_reverse_text') }}</div>
          <div class="tool-action">{{ ts('vietnamese.vocab_quiz_reverse_action') }}</div>
        </router-link>
        <div class="tool-card segment-card">
          <div class="tool-title">{{ ts('vietnamese.segment_lessons') }}</div>
          <div class="tool-text">{{ ts('vietnamese.segment_lessons_text') }}</div>
          <div class="bubble-wrap">
            <router-link
              v-for="segment in vietnameseLearningSegments"
              :key="segment.id"
              class="segment-bubble"
              :to="`/vietnamese/segments/${segment.id}`"
            >
              {{ segment.title }}
            </router-link>
          </div>
          <div class="tool-action">{{ ts('vietnamese.segment_lessons_action') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PageNav } from '@frontend/components/widgets'
import { getLanguageBreadcrumbs } from '@frontend/util/misc'
import { ts } from '@frontend/i18n'
import { vietnameseLearningSegments } from '@learn-vietnamese/data/segments'
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.home-wrap {
  background: $color4;
}
.home-hero {
  min-height: calc(100vh - $header-height);
  padding: 100px 0 120px;
  text-align: center;
}
.hero-title {
  @mixin title 56px;
  margin-bottom: 16px;
  color: #b45309;
}
.hero-text {
  @mixin title-thin 22px;
  margin-bottom: 32px;
  color: $text2;
  text-align: center;
  max-width: 640px;
}
.tool-grid {
  width: 100%;
  max-width: 680px;
  display: grid;
  gap: 24px;
  margin-bottom: 36px;
}
.tool-card {
  background: linear-gradient(140deg, #fff7ed, #ffedd5);
  border: 1px solid rgba(194, 65, 12, 0.18);
  border-radius: 18px;
  padding: 28px 24px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}
.tool-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.12);
}
.tool-title {
  @mixin title 26px;
  color: #c2410c;
  margin-bottom: 10px;
}
.tool-text {
  @mixin text 16px;
  color: $text2;
  margin-bottom: 16px;
}
.tool-action {
  @mixin title-regular 14px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #b45309;
}
.segment-card {
  text-align: left;
}
.bubble-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}
.segment-bubble {
  @mixin title-regular 14px;
  text-decoration: none;
  color: #9a3412;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(194, 65, 12, 0.2);
  padding: 10px 12px;
  border-radius: 999px;
  transition: transform 0.2s;
}
.segment-bubble:hover {
  transform: translateY(-1px);
}
</style>
