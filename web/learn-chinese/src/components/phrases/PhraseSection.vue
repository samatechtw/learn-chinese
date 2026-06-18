<template>
  <section class="phrase-section">
    <button
      type="button"
      class="section-header"
      :aria-expanded="!collapsed"
      @click="emit('toggle')"
    >
      <svg class="chevron" :class="{ collapsed }" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" stroke-width="2" />
      </svg>
      <span class="section-title">{{ section.title }}</span>
      <span class="section-count">{{ section.phrases.length }}</span>
    </button>
    <div v-show="!collapsed" class="phrase-grid">
      <PhraseItem v-for="(phrase, i) in section.phrases" :key="i" :phrase="phrase" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { IPhraseSection } from '@learn-chinese/types'
import PhraseItem from './PhraseItem.vue'

defineProps<{
  section: IPhraseSection
  collapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.phrase-section {
  width: 100%;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 4px;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(50, 130, 184, 0.2);
  cursor: pointer;
  text-align: left;
  color: $color2;
}
.section-title {
  @mixin title 22px;
  color: $color2;
  transition: color 0.15s ease;
}
.section-header:hover .section-title {
  color: $color3;
}
.chevron {
  width: 18px;
  height: 18px;
  color: $color3;
  flex-shrink: 0;
  transform: rotate(90deg);
  transition: transform 0.2s ease;
}
.chevron.collapsed {
  transform: rotate(0deg);
}
.section-count {
  @mixin title-regular 13px;
  color: $text2;
  background: rgba(50, 130, 184, 0.1);
  border-radius: 999px;
  padding: 2px 10px;
}
.phrase-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}
@media (max-width: 860px) {
  .phrase-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 520px) {
  .section-title {
    font-size: 19px;
  }
  .phrase-grid {
    grid-template-columns: 1fr;
  }
}
</style>
