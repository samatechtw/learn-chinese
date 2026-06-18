<template>
  <component
    :is="tool.to ? 'router-link' : 'div'"
    class="tool-bubble f-col"
    :key="tool.title"
    :to="tool.to ? { name: tool.to } : undefined"
    :class="{ isDisabled: tool.disabled }"
    @click="click"
  >
    <div v-if="tool.icon" class="tool-icon" aria-hidden="true">
      {{ tool.icon }}
    </div>
    <div class="tool-title">
      {{ ts(tool.title) }}
    </div>
    <div class="tool-text">
      {{ ts(tool.text) }}
    </div>
    <div v-if="tool.disabled" class="coming-soon">
      {{ ts('home.coming_soon') }}
    </div>
  </component>
</template>

<script lang="ts" setup>
import { IToolBubble } from '@frontend/types'
import { ts } from '../../i18n'

const { tool } = defineProps<{
  tool: IToolBubble
}>()

const emit = defineEmits<{
  (e: 'click', tool: IToolBubble): void
}>()

const click = () => {
  emit('click', tool)
}
</script>

<style lang="postcss" scoped>
@import '@theme/css/defines.postcss';

.tool-icon {
  font-size: 34px;
  line-height: 1;
  margin-bottom: 14px;
}
.tool-title {
  @mixin title 20px;
  color: $color2;
}
.tool-text {
  @mixin text 16px;
  color: $text2;
  margin-top: 10px;
}
.tool-bubble {
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  color: $color1;
  width: 244px;
  max-width: 260px;
  height: 200px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(50, 130, 184, 0.28);
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 10px 26px rgba(15, 76, 117, 0.08);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease,
    background 0.22s ease;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 4px;
    background: linear-gradient(90deg, $color2, $color3);
    opacity: 0.85;
    transition: opacity 0.22s ease;
  }
  &.isDisabled {
    cursor: default;
    pointer-events: none;
    border-color: rgba(50, 130, 184, 0.16);
    background: rgba(255, 255, 255, 0.45);
    box-shadow: none;
    &::before {
      opacity: 0.25;
    }
    .tool-title,
    .tool-text,
    .tool-icon {
      color: rgba($color2, 0.4);
    }
  }
  &:hover:not(.isDisabled) {
    transform: translateY(-4px);
    border-color: $color3;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 18px 36px rgba(15, 76, 117, 0.18);
  }
}
.coming-soon {
  @mixin title-regular 13px;
  color: white;
  background: $color3;
  border-radius: 999px;
  padding: 3px 10px;
  position: absolute;
  right: 12px;
  top: 12px;
}
@media (max-width: 900px) {
  .tool-bubble {
    width: 220px;
    max-width: 220px;
    padding: 24px 20px;
    height: 190px;
  }
  .tool-title {
    font-size: 19px;
  }
  .tool-text {
    font-size: 16px;
  }
}
@media (max-width: 620px) {
  .tool-bubble {
    width: 100%;
    padding: 20px 16px;
    height: 180px;
  }
  .tool-title {
    font-size: 18px;
  }
  .tool-text {
    font-size: 15px;
  }
}
@media (max-width: 520px) {
  .tool-bubble {
    padding: 16px 12px;
    height: 170px;
  }
  .tool-title {
    font-size: 16px;
  }
  .tool-text {
    font-size: 14px;
  }
}
</style>
